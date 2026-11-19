import { Router, type Request, type Response } from "express";
import crypto from "crypto";
import { z } from "zod";
import { whatsappBaileysService } from "../services/whatsappBaileysService";
import { emailGatewayService } from "../services/emailGatewayService";
import { dbService } from "../databaseService";
import { requireAdminAuth } from "../middleware/authMiddleware";

export const gatewayRouter = Router();

// Temporary OTP Store for live WhatsApp & Email OTP verification (5 min TTL) with attempt tracking
const liveOtpStore = new Map<
  string,
  { code: string; channel: "whatsapp" | "email"; destination: string; expiresAt: number; attempts: number }
>();

// ============================================================================
// 1. BAILEYS WHATSAPP GATEWAY ENDPOINTS (Admin QR Scan & Live Messaging)
// ============================================================================

gatewayRouter.get("/whatsapp/status", (_req: Request, res: Response) => {
  res.json({
    success: true,
    ...whatsappBaileysService.getStatus(),
    logs: whatsappBaileysService.getDeliveryLogs(30),
  });
});

gatewayRouter.post("/whatsapp/connect", async (_req: Request, res: Response) => {
  const result = await whatsappBaileysService.connect();
  res.json({
    ...result,
    ...whatsappBaileysService.getStatus(),
  });
});

gatewayRouter.post("/whatsapp/disconnect", requireAdminAuth, async (req: Request, res: Response) => {
  const clearSession = Boolean(req.body?.clearSession);
  const result = await whatsappBaileysService.disconnect(clearSession);
  res.json({
    ...result,
    ...whatsappBaileysService.getStatus(),
  });
});

const sendTestWaSchema = z.object({
  mobile: z.string().min(10, "Valid 10-digit mobile number required"),
  message: z.string().min(2, "Message cannot be empty"),
});

gatewayRouter.post("/whatsapp/send-test", async (req: Request, res: Response) => {
  try {
    const { mobile, message } = sendTestWaSchema.parse(req.body);
    const log = await whatsappBaileysService.sendMessage(mobile, message, "test");
    res.json({
      success: log.status === "sent_live_baileys",
      queued: log.status === "queued_disconnected",
      log,
      message:
        log.status === "sent_live_baileys"
          ? `Live WhatsApp message sent to ${mobile} via Baileys!`
          : log.error || "Message queued (WhatsApp QR not scanned yet).",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message,
    });
  }
});

gatewayRouter.post("/whatsapp/broadcast", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const message = String(req.body?.message || "").trim();
    if (message.length < 3) {
      return res.status(400).json({ success: false, error: "Broadcast message required" });
    }
    const accounts = dbService.getAllAccounts();
    const targetMobiles = Array.from(
      new Set(accounts.map((a) => a.user.mobile).filter((m) => m && m.replace(/\D/g, "").length >= 10))
    ).slice(0, 50);

    let sentLive = 0;
    let queued = 0;
    for (const mobile of targetMobiles) {
      const log = await whatsappBaileysService.sendMessage(mobile, message, "broadcast");
      if (log.status === "sent_live_baileys") sentLive++;
      else queued++;
    }

    res.json({
      success: true,
      totalRecipients: targetMobiles.length,
      sentLive,
      queued,
      message: `Broadcast processed for ${targetMobiles.length} members (${sentLive} live via Baileys, ${queued} queued).`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 2. EMAIL GATEWAY ENDPOINTS (Google Apps Script Webhook + SMTP for Render)
// ============================================================================

gatewayRouter.get("/email/config", (_req: Request, res: Response) => {
  res.json({
    success: true,
    config: emailGatewayService.getPublicConfig(),
    logs: emailGatewayService.getLogs(30),
  });
});

const emailConfigSchema = z.object({
  provider: z.enum(["google_script", "smtp"]),
  enabled: z.boolean().optional(),
  fromName: z.string().min(1).optional(),
  fromEmail: z.string().optional(),
  googleScriptUrl: z.string().optional(),
  googleScriptSecret: z.string().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.number().min(1).max(65535).optional(),
  smtpSecure: z.boolean().optional(),
  smtpUser: z.string().optional(),
  smtpPass: z.string().optional(),
});

gatewayRouter.put("/email/config", requireAdminAuth, (req: Request, res: Response) => {
  try {
    const parsed = emailConfigSchema.parse(req.body);
    const updated = emailGatewayService.updateConfig(parsed);
    res.json({
      success: true,
      config: updated,
      message: `Email gateway configured for ${
        updated.provider === "google_script" ? "Google Apps Script (Render Ready)" : "Custom SMTP"
      }.`,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message,
    });
  }
});

const sendTestEmailSchema = z.object({
  to: z.string().email("Valid recipient email required"),
  subject: z.string().min(2).optional(),
  message: z.string().min(2).optional(),
});

gatewayRouter.post("/email/send-test", async (req: Request, res: Response) => {
  try {
    const { to, subject, message } = sendTestEmailSchema.parse(req.body);
    const log = await emailGatewayService.sendEmail({
      to,
      subject: subject || "Vivah Kar Lo — Render Email Gateway Test",
      text:
        message ||
        "Namaste! This test email confirms your Vivah Kar Lo email gateway (Google Apps Script / SMTP) is configured properly and working on Render.",
      category: "test",
    });

    const delivered = log.status === "sent_google_script" || log.status === "sent_smtp";
    res.json({
      success: delivered,
      queued: log.status === "queued_not_configured",
      log,
      message: delivered
        ? `Test email delivered to ${to} via ${log.provider}!`
        : log.error || "Email not sent — check configuration.",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message,
    });
  }
});

// ============================================================================
// 3. LIVE WHATSAPP OTP & EMAIL OTP DISPATCH + VERIFICATION
// ============================================================================

// Client CANNOT specify its own OTP (Preventing Authorization Bypass)
const sendLiveOtpSchema = z.object({
  channel: z.enum(["whatsapp", "email"]),
  destination: z.string().min(4),
  purpose: z.string().optional(),
});

gatewayRouter.post("/otp/send", async (req: Request, res: Response) => {
  try {
    const { channel, destination, purpose } = sendLiveOtpSchema.parse(req.body);
    // Server-enforced cryptographically secure 6-digit random code
    const code = String(crypto.randomInt(100000, 999999));
    const key = `${channel}:${destination.toLowerCase().trim()}`;
    liveOtpStore.set(key, {
      code,
      channel,
      destination,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
    });

    if (channel === "whatsapp") {
      const text = `*Vivah Kar Lo Verification*\n\nYour ${purpose || "WhatsApp OTP"} code is: *${code}*\nValid for 5 minutes. Never share this code with anyone.`;
      const log = await whatsappBaileysService.sendMessage(destination, text, "otp");
      return res.json({
        success: true,
        channel: "whatsapp",
        deliveredLive: log.status === "sent_live_baileys",
        demoOtp: log.status === "sent_live_baileys" ? undefined : code,
        message:
          log.status === "sent_live_baileys"
            ? `WhatsApp OTP sent live to ${destination}.`
            : `WhatsApp OTP generated (Demo fallback: ${code} — scan Baileys QR in Admin Settings for live WhatsApp delivery).`,
      });
    } else {
      const log = await emailGatewayService.sendEmail({
        to: destination,
        subject: `Your Vivah Kar Lo ${purpose || "Verification"} OTP: ${code}`,
        text: `Namaste,\n\nYour 6-digit verification code for Vivah Kar Lo is: ${code}\n\nThis code is valid for 5 minutes. If you did not request this, please ignore this email.`,
        category: "otp",
      });
      const deliveredLive = log.status === "sent_google_script" || log.status === "sent_smtp";
      return res.json({
        success: true,
        channel: "email",
        deliveredLive,
        demoOtp: deliveredLive ? undefined : code,
        message: deliveredLive
          ? `Email OTP sent live to ${destination}.`
          : `Email OTP generated (Demo fallback: ${code} — configure Google Apps Script URL or SMTP in Admin Settings for live delivery).`,
      });
    }
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message,
    });
  }
});

gatewayRouter.post("/otp/verify", (req: Request, res: Response) => {
  const { channel, destination, code } = req.body || {};
  if (!channel || !destination || !code) {
    return res.status(400).json({ success: false, error: "channel, destination, and code required" });
  }
  const key = `${channel}:${String(destination).toLowerCase().trim()}`;
  const record = liveOtpStore.get(key);
  if (!record) {
    return res.status(400).json({ success: false, error: "OTP expired or not requested." });
  }
  if (Date.now() > record.expiresAt) {
    liveOtpStore.delete(key);
    return res.status(400).json({ success: false, error: "OTP has expired. Please request a new code." });
  }

  // Rate limiting / Lockout on OTP verification attempts (CWE-307)
  record.attempts = (record.attempts || 0) + 1;
  if (record.attempts > 5) {
    liveOtpStore.delete(key);
    return res.status(429).json({
      success: false,
      error: "Too many failed attempts. This OTP has been locked for security. Please request a new code.",
    });
  }

  if (record.code !== String(code).trim()) {
    const remaining = 5 - record.attempts;
    return res.status(400).json({
      success: false,
      error: `Invalid OTP code. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : "Verification code locked."}`,
    });
  }

  liveOtpStore.delete(key);
  res.json({ success: true, verified: true, message: `${channel.toUpperCase()} OTP verified successfully.` });
});
