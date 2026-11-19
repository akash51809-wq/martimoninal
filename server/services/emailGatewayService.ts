import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

export type EmailProviderType = "google_script" | "smtp";

export interface EmailGatewayConfig {
  provider: EmailProviderType;
  enabled: boolean;
  fromName: string;
  fromEmail: string;
  // Mode 1: Google Apps Script Webhook (100% Render-compatible over HTTPS Port 443)
  googleScriptUrl: string;
  googleScriptSecret: string;
  // Mode 2: Standard SMTP (Nodemailer)
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  updatedAt: string;
}

export interface EmailDeliveryLog {
  id: string;
  to: string;
  subject: string;
  provider: EmailProviderType;
  category: "otp" | "welcome" | "security_alert" | "match_alert" | "test" | "2fa";
  status: "sent_google_script" | "sent_smtp" | "queued_not_configured" | "failed";
  error?: string;
  timestamp: string;
}

const CONFIG_PATH =
  process.env.EMAIL_CONFIG_PATH ||
  path.resolve(process.cwd(), "server", "data", "email_gateway_config.json");

export const GOOGLE_APPS_SCRIPT_TEMPLATE = `// Deploy at https://script.google.com -> New Project -> Paste -> Deploy -> Web App
// Execute as: Me | Who has access: Anyone
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var EXPECTED_SECRET = "VIVAH_KAR_LO_SECRET_2026"; // Match Secret Key in Admin Settings
    if (EXPECTED_SECRET && payload.secret !== EXPECTED_SECRET) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: "Unauthorized secret key" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    MailApp.sendEmail({
      to: payload.to,
      subject: payload.subject,
      htmlBody: payload.html || payload.text,
      name: payload.fromName || "Vivah Kar Lo Matrimony"
    });

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "Email dispatched via Google Apps Script" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}`;

class EmailGatewayService {
  private config: EmailGatewayConfig;
  private logs: EmailDeliveryLog[] = [];

  constructor() {
    this.config = this.loadConfig();
  }

  private defaultConfig(): EmailGatewayConfig {
    return {
      provider: process.env.SMTP_HOST ? "smtp" : "google_script",
      enabled: true,
      fromName: process.env.EMAIL_FROM_NAME || "Vivah Kar Lo Official",
      fromEmail: process.env.EMAIL_FROM || process.env.SMTP_USER || "noreply@vivahkarlo.in",
      googleScriptUrl: process.env.GOOGLE_SCRIPT_EMAIL_URL || "",
      googleScriptSecret: process.env.GOOGLE_SCRIPT_SECRET || "VIVAH_KAR_LO_SECRET_2026",
      smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
      smtpPort: Number(process.env.SMTP_PORT || 587),
      smtpSecure: process.env.SMTP_SECURE === "true",
      smtpUser: process.env.SMTP_USER || "",
      smtpPass: process.env.SMTP_PASS || "",
      updatedAt: new Date().toISOString(),
    };
  }

  private loadConfig(): EmailGatewayConfig {
    try {
      if (fs.existsSync(CONFIG_PATH)) {
        const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
        return { ...this.defaultConfig(), ...JSON.parse(raw) };
      }
    } catch {
      // Fallback to env/defaults
    }
    return this.defaultConfig();
  }

  private saveConfig() {
    try {
      const dir = path.dirname(CONFIG_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(this.config, null, 2), "utf-8");
    } catch (err) {
      console.warn("[EmailGateway] Failed to persist config:", err);
    }
  }

  public getPublicConfig() {
    return {
      provider: this.config.provider,
      enabled: this.config.enabled,
      fromName: this.config.fromName,
      fromEmail: this.config.fromEmail,
      googleScriptUrl: this.config.googleScriptUrl,
      hasGoogleScriptSecret: Boolean(this.config.googleScriptSecret),
      smtpHost: this.config.smtpHost,
      smtpPort: this.config.smtpPort,
      smtpSecure: this.config.smtpSecure,
      smtpUser: this.config.smtpUser,
      hasSmtpPass: Boolean(this.config.smtpPass),
      updatedAt: this.config.updatedAt,
      isReady:
        this.config.provider === "google_script"
          ? Boolean(this.config.googleScriptUrl)
          : Boolean(this.config.smtpHost && this.config.smtpUser && this.config.smtpPass),
      scriptTemplate: GOOGLE_APPS_SCRIPT_TEMPLATE,
    };
  }

  public updateConfig(updates: Partial<EmailGatewayConfig>) {
    // Preserve existing secrets if frontend sends empty or masked placeholder
    const next: EmailGatewayConfig = {
      ...this.config,
      provider: updates.provider || this.config.provider,
      enabled: updates.enabled ?? this.config.enabled,
      fromName: updates.fromName ?? this.config.fromName,
      fromEmail: updates.fromEmail ?? this.config.fromEmail,
      googleScriptUrl:
        updates.googleScriptUrl !== undefined
          ? updates.googleScriptUrl.trim()
          : this.config.googleScriptUrl,
      googleScriptSecret:
        updates.googleScriptSecret && updates.googleScriptSecret !== "••••••••"
          ? updates.googleScriptSecret.trim()
          : this.config.googleScriptSecret,
      smtpHost: updates.smtpHost !== undefined ? updates.smtpHost.trim() : this.config.smtpHost,
      smtpPort: updates.smtpPort !== undefined ? Number(updates.smtpPort) : this.config.smtpPort,
      smtpSecure: updates.smtpSecure ?? this.config.smtpSecure,
      smtpUser: updates.smtpUser !== undefined ? updates.smtpUser.trim() : this.config.smtpUser,
      smtpPass:
        updates.smtpPass && updates.smtpPass !== "••••••••"
          ? updates.smtpPass
          : this.config.smtpPass,
      updatedAt: new Date().toISOString(),
    };
    this.config = next;
    this.saveConfig();
    return this.getPublicConfig();
  }

  public getLogs(limit = 50): EmailDeliveryLog[] {
    return this.logs.slice(0, limit);
  }

  public async sendEmail(params: {
    to: string;
    subject: string;
    text: string;
    html?: string;
    category?: EmailDeliveryLog["category"];
  }): Promise<EmailDeliveryLog> {
    const now = new Date().toISOString();
    const category = params.category || "test";
    const htmlBody =
      params.html ||
      `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #FDE68A;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(90deg,#3B0A18,#7C2D12);padding:20px;color:#FFFDF9;">
          <h2 style="margin:0;font-size:20px;">${this.config.fromName}</h2>
        </div>
        <div style="padding:24px;background:#FFFDF9;color:#2B120C;line-height:1.6;">
          <p style="white-space:pre-line;font-size:14px;">${params.text}</p>
        </div>
        <div style="padding:12px 24px;background:#FAF5EE;color:#785C52;font-size:11px;border-top:1px solid #FDE68A;">
          Sent securely via Vivah Kar Lo Verification &amp; Notification Gateway.
        </div>
      </div>`;

    // PROVIDER 1: Google Apps Script Webhook (100% works on Render.com via HTTPS 443)
    if (this.config.provider === "google_script") {
      if (!this.config.googleScriptUrl) {
        const queued: EmailDeliveryLog = {
          id: `em-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          to: params.to,
          subject: params.subject,
          provider: "google_script",
          category,
          status: "queued_not_configured",
          error: "Google Apps Script Web App URL not configured yet in Admin Settings",
          timestamp: now,
        };
        this.logs.unshift(queued);
        return queued;
      }

      try {
        const response = await fetch(this.config.googleScriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          redirect: "follow",
          body: JSON.stringify({
            secret: this.config.googleScriptSecret,
            to: params.to,
            subject: params.subject,
            text: params.text,
            html: htmlBody,
            fromName: this.config.fromName,
          }),
        });

        const rawText = await response.text();
        let parsed: any = null;
        try {
          parsed = JSON.parse(rawText);
        } catch {
          parsed = { success: response.ok };
        }

        if (!response.ok || parsed?.success === false) {
          throw new Error(parsed?.error || `HTTP ${response.status} from Google Apps Script`);
        }

        const sentLog: EmailDeliveryLog = {
          id: `em-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          to: params.to,
          subject: params.subject,
          provider: "google_script",
          category,
          status: "sent_google_script",
          timestamp: now,
        };
        this.logs.unshift(sentLog);
        return sentLog;
      } catch (err: any) {
        const failed: EmailDeliveryLog = {
          id: `em-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          to: params.to,
          subject: params.subject,
          provider: "google_script",
          category,
          status: "failed",
          error: err?.message || "Google Apps Script dispatch failed",
          timestamp: now,
        };
        this.logs.unshift(failed);
        return failed;
      }
    }

    // PROVIDER 2: Custom SMTP via Nodemailer
    if (!this.config.smtpHost || !this.config.smtpUser || !this.config.smtpPass) {
      const queued: EmailDeliveryLog = {
        id: `em-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        to: params.to,
        subject: params.subject,
        provider: "smtp",
        category,
        status: "queued_not_configured",
        error: "SMTP credentials not configured yet in Admin Settings",
        timestamp: now,
      };
      this.logs.unshift(queued);
      return queued;
    }

    try {
      const transporter = nodemailer.createTransport({
        host: this.config.smtpHost,
        port: this.config.smtpPort,
        secure: this.config.smtpSecure || this.config.smtpPort === 465,
        auth: {
          user: this.config.smtpUser,
          pass: this.config.smtpPass,
        },
        connectionTimeout: 12000,
      });

      await transporter.sendMail({
        from: `"${this.config.fromName}" <${this.config.fromEmail || this.config.smtpUser}>`,
        to: params.to,
        subject: params.subject,
        text: params.text,
        html: htmlBody,
      });

      const sentLog: EmailDeliveryLog = {
        id: `em-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        to: params.to,
        subject: params.subject,
        provider: "smtp",
        category,
        status: "sent_smtp",
        timestamp: now,
      };
      this.logs.unshift(sentLog);
      return sentLog;
    } catch (err: any) {
      const failed: EmailDeliveryLog = {
        id: `em-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        to: params.to,
        subject: params.subject,
        provider: "smtp",
        category,
        status: "failed",
        error: err?.message || "SMTP sendMail failed",
        timestamp: now,
      };
      this.logs.unshift(failed);
      return failed;
    }
  }
}

export const emailGatewayService = new EmailGatewayService();
