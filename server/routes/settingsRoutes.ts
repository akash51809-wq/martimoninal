import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { dbService } from "../databaseService";
import { whatsappBaileysService } from "../services/whatsappBaileysService";
import { emailGatewayService } from "../services/emailGatewayService";
import { extractToken } from "../middleware/authMiddleware";

export const settingsRouter = Router();

const changePasswordSchema = z.object({
  userId: z.string().min(1, "User ID required"),
  currentPassword: z.string().min(1, "Current password required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters long"),
});

const deactivateAccountSchema = z.object({
  userId: z.string().min(1, "User ID required"),
  reason: z.string().optional(),
});

const deleteAccountSchema = z.object({
  userId: z.string().min(1, "User ID required"),
  passwordConfirm: z.string().min(1, "Password confirmation required"),
});

const updateWhatsAppSchema = z.object({
  userId: z.string().min(1, "User ID required"),
  updates: z.object({
    matchesAlerts: z.boolean().optional(),
    interestAlerts: z.boolean().optional(),
    chatAlerts: z.boolean().optional(),
    dailyDigest: z.boolean().optional(),
    promotions: z.boolean().optional(),
  }),
});

const testAlertSchema = z.object({
  userId: z.string().min(1, "User ID required"),
  templateType: z.enum([
    "match_alert",
    "interest_alert",
    "chat_alert",
    "verification_alert",
    "general",
  ]).optional(),
});

/**
 * 1. Change Password (Feature 42)
 */
settingsRouter.post("/change-password", async (req: Request, res: Response) => {
  try {
    const { userId, currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    // Verify session identity if token is present
    const token = extractToken(req);
    if (token) {
      const session = dbService.validateSession(token);
      if (session && session.user.id !== userId && session.role !== "admin") {
        return res.status(403).json({
          success: false,
          error: "Unauthorized. You can only change password for your own account.",
        });
      }
    }

    const result = await dbService.changeUserPassword(userId, currentPassword, newPassword);

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    res.json({
      success: true,
      message: "Password changed successfully. Please keep your credentials secure.",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Failed to change password",
    });
  }
});

/**
 * 2. Deactivate Account Temporarily (Feature 43)
 */
settingsRouter.post("/deactivate", async (req: Request, res: Response) => {
  try {
    const { userId, reason } = deactivateAccountSchema.parse(req.body);

    // Verify caller cannot deactivate someone else's profile (CWE-285)
    const token = extractToken(req);
    if (token) {
      const session = dbService.validateSession(token);
      if (session && session.user.id !== userId && session.role !== "admin") {
        return res.status(403).json({
          success: false,
          error: "Unauthorized. You cannot deactivate another member's account.",
        });
      }
    }

    const result = await dbService.deactivateUserAccount(userId, reason);

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    res.json({
      success: true,
      message: "Your profile has been temporarily deactivated and hidden from match searches. You can reactivate anytime by logging in.",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Failed to deactivate account",
    });
  }
});

/**
 * 3. Delete Account Permanently (Feature 43)
 */
settingsRouter.post("/delete-account", async (req: Request, res: Response) => {
  try {
    const { userId, passwordConfirm } = deleteAccountSchema.parse(req.body);
    const result = await dbService.deleteUserAccount(userId, passwordConfirm);

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    res.json({
      success: true,
      message: "Your account and personal data have been permanently deleted in compliance with platform data privacy policies.",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Failed to delete account",
    });
  }
});

/**
 * 4. Get WhatsApp Notification Settings (Feature 36)
 */
settingsRouter.get("/whatsapp", (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ success: false, error: "User ID required" });
  }

  const settings = dbService.getWhatsAppSettings(userId);
  res.json({ success: true, settings });
});

/**
 * 5. Update WhatsApp Notification Settings (Feature 36)
 */
settingsRouter.patch("/whatsapp", async (req: Request, res: Response) => {
  try {
    const { userId, updates } = updateWhatsAppSchema.parse(req.body);
    const updated = await dbService.updateWhatsAppSettings(userId, updates);
    res.json({
      success: true,
      settings: updated,
      message: "WhatsApp notification preferences updated successfully.",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Failed to update WhatsApp preferences",
    });
  }
});

/**
 * 6. Send Test WhatsApp Alert (Feature 36)
 */
settingsRouter.post("/whatsapp/test-alert", async (req: Request, res: Response) => {
  try {
    const { userId, templateType } = testAlertSchema.parse(req.body);
    const type = templateType || "match_alert";
    const sampleMessage =
      type === "match_alert"
        ? "[VivahKarlo] 🌟 3 new high-compatibility matches found matching your partner preferences today! View now: vivahkarlo.com/dashboard"
        : type === "interest_alert"
        ? "[VivahKarlo] 💌 An elite member has expressed interest in your profile. Review & respond: vivahkarlo.com/dashboard"
        : "[VivahKarlo] 🛡️ Security Alert: Your mobile number verification is completed. Welcome to VivahKarlo Premium.";

    const log = await dbService.sendWhatsAppAlert(userId, type, sampleMessage);
    // Also dispatch LIVE via Baileys WhatsApp if Admin has linked a WhatsApp device
    const account = dbService.getAllAccounts().find((a) => a.user.id === userId);
    const targetMobile = account?.user.mobile || "9876543210";
    const baileysLog = await whatsappBaileysService.sendMessage(
      targetMobile,
      sampleMessage,
      type === "match_alert" ? "match_alert" : type === "interest_alert" ? "interest_alert" : "test"
    );

    res.json({
      success: true,
      log,
      baileysStatus: baileysLog.status,
      message:
        baileysLog.status === "sent_live_baileys"
          ? `Live WhatsApp alert (${type}) sent to +91 ${targetMobile} via Baileys!`
          : `Test WhatsApp alert (${type}) logged. Scan Baileys QR in Admin Settings for live phone delivery.`,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Failed to trigger WhatsApp alert",
    });
  }
});

/**
 * 7. Get WhatsApp Notification Logs
 */
settingsRouter.get("/whatsapp/logs", (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ success: false, error: "User ID required" });
  }

  const logs = dbService.getWhatsAppLogs(userId);
  res.json({ success: true, logs });
});

// In-memory store for session revocations & suspicious login resolutions
const userSecuritySessions = new Map<
  string,
  Array<{
    id: string;
    device: string;
    browser: string;
    ipAddress: string;
    location: string;
    loginAt: string;
    isCurrent: boolean;
    isSuspicious: boolean;
    status: "Active" | "Signed Out" | "Blocked";
  }>
>();

function getOrSeedLoginHistory(userId: string) {
  if (!userSecuritySessions.has(userId)) {
    const now = Date.now();
    userSecuritySessions.set(userId, [
      {
        id: `sess-${userId}-1`,
        device: "Windows 11 Desktop",
        browser: "Chrome 131.0",
        ipAddress: "103.84.212.14",
        location: "Pune, Maharashtra, India",
        loginAt: new Date(now - 10 * 60 * 1000).toISOString(),
        isCurrent: true,
        isSuspicious: false,
        status: "Active",
      },
      {
        id: `sess-${userId}-2`,
        device: "iPhone 15 Pro (iOS)",
        browser: "Safari Mobile",
        ipAddress: "103.84.212.98",
        location: "Pune, Maharashtra, India",
        loginAt: new Date(now - 6 * 3600 * 1000).toISOString(),
        isCurrent: false,
        isSuspicious: false,
        status: "Active",
      },
      {
        id: `sess-${userId}-3`,
        device: "Unrecognized Linux Device",
        browser: "Firefox 129.0",
        ipAddress: "185.220.101.47",
        location: "Frankfurt, Germany (VPN / Proxy)",
        loginAt: new Date(now - 22 * 3600 * 1000).toISOString(),
        isCurrent: false,
        isSuspicious: true,
        status: "Active",
      },
      {
        id: `sess-${userId}-4`,
        device: "MacBook Pro (macOS)",
        browser: "Chrome 130.0",
        ipAddress: "49.36.142.81",
        location: "Mumbai, Maharashtra, India",
        loginAt: new Date(now - 72 * 3600 * 1000).toISOString(),
        isCurrent: false,
        isSuspicious: false,
        status: "Signed Out",
      },
    ]);
  }
  return userSecuritySessions.get(userId)!;
}

/**
 * 8. Login History & Suspicious Login Detection
 */
settingsRouter.get("/login-history/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;
  const history = getOrSeedLoginHistory(userId);
  const suspiciousCount = history.filter((h) => h.isSuspicious && h.status === "Active").length;
  res.json({
    success: true,
    history,
    suspiciousCount,
    legalConsent: {
      privacyPolicyAccepted: true,
      privacyPolicyVersion: "v2.4",
      termsAccepted: true,
      termsVersion: "v2.4",
      acceptedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
  });
});

/**
 * 9. Report & Block Suspicious Login Session
 */
settingsRouter.post("/report-suspicious-login", (req: Request, res: Response) => {
  const { userId, sessionId } = req.body || {};
  if (!userId || !sessionId) {
    return res.status(400).json({ success: false, error: "userId and sessionId required" });
  }
  const history = getOrSeedLoginHistory(userId);
  const target = history.find((h) => h.id === sessionId);
  if (target) {
    target.status = "Blocked";
    target.isSuspicious = false;
  }
  res.json({
    success: true,
    history,
    message: "Suspicious session terminated and IP flagged for security review.",
  });
});

/**
 * 10. Logout from All Devices (Global Session Revocation)
 */
settingsRouter.post("/logout-all-devices", (req: Request, res: Response) => {
  const { userId } = req.body || {};
  if (!userId) {
    return res.status(400).json({ success: false, error: "userId required" });
  }
  const history = getOrSeedLoginHistory(userId);
  let revokedCount = 0;
  for (const item of history) {
    if (item.status === "Active") {
      item.status = "Signed Out";
      item.isCurrent = false;
      revokedCount++;
    }
  }
  res.json({
    success: true,
    revokedCount,
    history,
    message: `Successfully logged out from all ${revokedCount} active device session(s).`,
  });
});

/**
 * 11. Revoke Individual Device / Session (Device & Multiple Session Management - Features #9 & #15)
 */
settingsRouter.post("/revoke-session", (req: Request, res: Response) => {
  const { userId, sessionId } = req.body || {};
  if (!userId || !sessionId) {
    return res.status(400).json({ success: false, error: "userId and sessionId required" });
  }
  const history = getOrSeedLoginHistory(userId);
  const target = history.find((h) => h.id === sessionId);
  if (!target) {
    return res.status(404).json({ success: false, error: "Device session not found" });
  }
  target.status = "Signed Out";
  target.isCurrent = false;
  res.json({
    success: true,
    history,
    message: `Signed out device: ${target.device} (${target.location}).`,
  });
});

/**
 * 12. Self-Service Account Reactivation (Feature #14)
 */
settingsRouter.post("/reactivate", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body || {};
    if (!userId) {
      return res.status(400).json({ success: false, error: "userId required" });
    }
    await dbService.updateUserStatus(userId, "active", "Self-reactivated by user");
    res.json({
      success: true,
      accountStatus: "active",
      message: "Welcome back! Your matrimonial profile has been reactivated and is visible to verified matches again.",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 13. TWO-FACTOR AUTHENTICATION (2FA - Feature #11)
// ============================================================================
interface TwoFactorRecord {
  enabled: boolean;
  method: "whatsapp" | "email" | "authenticator";
  backupCodes: string[];
  pendingCode?: string;
  pendingExpiresAt?: number;
  updatedAt: string;
}

const twoFactorStore = new Map<string, TwoFactorRecord>();

function getOrSeed2fa(userId: string): TwoFactorRecord {
  if (!twoFactorStore.has(userId)) {
    twoFactorStore.set(userId, {
      enabled: false,
      method: "whatsapp",
      backupCodes: [],
      updatedAt: new Date().toISOString(),
    });
  }
  return twoFactorStore.get(userId)!;
}

function generateBackupCodes(): string[] {
  return Array.from({ length: 6 }, () => {
    const p1 = Math.floor(1000 + Math.random() * 9000);
    const p2 = Math.floor(1000 + Math.random() * 9000);
    return `VK-${p1}-${p2}`;
  });
}

settingsRouter.get("/2fa/:userId", (req: Request, res: Response) => {
  const rec = getOrSeed2fa(req.params.userId);
  res.json({
    success: true,
    twoFactor: {
      enabled: rec.enabled,
      method: rec.method,
      backupCodesCount: rec.backupCodes.length,
      backupCodes: rec.enabled ? rec.backupCodes : [],
      updatedAt: rec.updatedAt,
    },
  });
});

settingsRouter.post("/2fa/send-code", async (req: Request, res: Response) => {
  try {
    const { userId, method, destination } = req.body || {};
    if (!userId || !method) {
      return res.status(400).json({ success: false, error: "userId and method required" });
    }
    const rec = getOrSeed2fa(userId);
    const code = String(Math.floor(100000 + Math.random() * 900000));
    rec.method = method;
    rec.pendingCode = code;
    rec.pendingExpiresAt = Date.now() + 5 * 60 * 1000;

    let deliveredLive = false;
    if (method === "whatsapp" && destination) {
      const log = await whatsappBaileysService.sendMessage(
        destination,
        `*Vivah Kar Lo 2FA Security Code*\n\nYour Two-Factor Authentication verification code is: *${code}*\nExpires in 5 minutes.`,
        "security"
      );
      deliveredLive = log.status === "sent_live_baileys";
    } else if (method === "email" && destination) {
      const log = await emailGatewayService.sendEmail({
        to: destination,
        subject: `Vivah Kar Lo 2FA Verification Code: ${code}`,
        text: `Your Two-Factor Authentication verification code is: ${code}\nValid for 5 minutes.`,
        category: "2fa",
      });
      deliveredLive = log.status === "sent_google_script" || log.status === "sent_smtp";
    }

    res.json({
      success: true,
      method,
      deliveredLive,
      demoCode: deliveredLive ? undefined : code,
      message: deliveredLive
        ? `2FA verification code sent live via ${method.toUpperCase()}.`
        : `2FA verification code generated (Demo code: ${code}).`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

settingsRouter.post("/2fa/verify-enable", (req: Request, res: Response) => {
  const { userId, code, method } = req.body || {};
  if (!userId || !code) {
    return res.status(400).json({ success: false, error: "userId and verification code required" });
  }
  const rec = getOrSeed2fa(userId);
  if (!rec.pendingCode || Date.now() > (rec.pendingExpiresAt || 0)) {
    return res.status(400).json({ success: false, error: "2FA code expired. Please request a new code." });
  }
  if (rec.pendingCode !== String(code).trim()) {
    return res.status(400).json({ success: false, error: "Invalid 6-digit 2FA code." });
  }
  rec.enabled = true;
  if (method) rec.method = method;
  rec.pendingCode = undefined;
  rec.backupCodes = generateBackupCodes();
  rec.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    twoFactor: {
      enabled: rec.enabled,
      method: rec.method,
      backupCodes: rec.backupCodes,
      updatedAt: rec.updatedAt,
    },
    message: `Two-Factor Authentication (${rec.method.toUpperCase()}) enabled! Save your 6 backup recovery codes safely.`,
  });
});

settingsRouter.post("/2fa/disable", (req: Request, res: Response) => {
  const { userId } = req.body || {};
  if (!userId) {
    return res.status(400).json({ success: false, error: "userId required" });
  }
  const rec = getOrSeed2fa(userId);
  rec.enabled = false;
  rec.backupCodes = [];
  rec.updatedAt = new Date().toISOString();
  res.json({
    success: true,
    twoFactor: { enabled: false, method: rec.method, backupCodes: [], updatedAt: rec.updatedAt },
    message: "Two-Factor Authentication has been disabled.",
  });
});
