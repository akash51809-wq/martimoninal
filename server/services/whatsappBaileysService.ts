import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import pino from "pino";
import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  type WASocket,
} from "@whiskeysockets/baileys";

export type WhatsAppConnectionStatus =
  | "disconnected"
  | "connecting"
  | "qr_ready"
  | "connected";

export interface WhatsAppDeliveryLog {
  id: string;
  to: string;
  jid: string;
  category: "otp" | "match_alert" | "interest_alert" | "chat_alert" | "broadcast" | "test" | "security";
  message: string;
  status: "sent_live_baileys" | "queued_disconnected" | "failed";
  error?: string;
  timestamp: string;
}

const SESSION_DIR =
  process.env.WHATSAPP_SESSION_DIR ||
  path.resolve(process.cwd(), "server", "data", "wa_auth_session");

class WhatsAppBaileysService {
  private sock: WASocket | null = null;
  private status: WhatsAppConnectionStatus = "disconnected";
  private qrRaw: string | null = null;
  private qrDataUrl: string | null = null;
  private qrGeneratedAt: string | null = null;
  private connectedPhone: string | null = null;
  private connectedName: string | null = null;
  private lastError: string | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private deliveryLogs: WhatsAppDeliveryLog[] = [];
  private isConnectingLock = false;

  constructor() {
    this.ensureSessionDir();
    // Auto-resume existing scanned session if creds.json already exists
    if (fs.existsSync(path.join(SESSION_DIR, "creds.json"))) {
      this.connect().catch((err) => {
        this.lastError = err?.message || "Auto-resume failed";
      });
    }
  }

  private ensureSessionDir() {
    if (!fs.existsSync(SESSION_DIR)) {
      fs.mkdirSync(SESSION_DIR, { recursive: true });
    }
  }

  public normalizeToJid(mobile: string): string {
    const digits = String(mobile || "").replace(/\D/g, "");
    if (!digits) return "";
    // Default 10-digit Indian mobile numbers to country code 91
    const fullNumber = digits.length === 10 ? `91${digits}` : digits;
    return `${fullNumber}@s.whatsapp.net`;
  }

  public getStatus() {
    return {
      status: this.status,
      qrDataUrl: this.qrDataUrl,
      qrGeneratedAt: this.qrGeneratedAt,
      connectedPhone: this.connectedPhone,
      connectedName: this.connectedName,
      lastError: this.lastError,
      sessionSaved: fs.existsSync(path.join(SESSION_DIR, "creds.json")),
      stats: {
        totalLogs: this.deliveryLogs.length,
        sentLive: this.deliveryLogs.filter((l) => l.status === "sent_live_baileys").length,
        queued: this.deliveryLogs.filter((l) => l.status === "queued_disconnected").length,
        failed: this.deliveryLogs.filter((l) => l.status === "failed").length,
      },
    };
  }

  public getDeliveryLogs(limit = 50): WhatsAppDeliveryLog[] {
    return this.deliveryLogs.slice(0, limit);
  }

  public async connect(): Promise<{ success: boolean; status: WhatsAppConnectionStatus; message: string }> {
    if (this.status === "connected" && this.sock) {
      return {
        success: true,
        status: "connected",
        message: `WhatsApp already connected as ${this.connectedPhone || "Linked Device"}.`,
      };
    }

    if (this.isConnectingLock) {
      return {
        success: true,
        status: this.status,
        message: "Connection handshake already in progress. Waiting for QR code...",
      };
    }

    this.isConnectingLock = true;
    this.status = "connecting";
    this.lastError = null;
    this.qrRaw = null;
    this.qrDataUrl = null;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    try {
      this.ensureSessionDir();
      const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

      let version: [number, number, number] = [2, 3000, 1015901307];
      try {
        const latest = await fetchLatestBaileysVersion();
        if (latest?.version) {
          version = latest.version;
        }
      } catch {
        // Fallback to stable known protocol version if offline/blocked
      }

      const logger = pino({ level: "silent" });

      const sock = makeWASocket({
        version,
        logger: logger as any,
        auth: state,
        printQRInTerminal: false,
        browser: ["Vivah Kar Lo Admin", "Chrome", "131.0.0"],
        syncFullHistory: false,
        connectTimeoutMs: 30000,
        defaultQueryTimeoutMs: 30000,
      });

      this.sock = sock;

      sock.ev.on("creds.update", saveCreds);

      sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.qrRaw = qr;
          this.qrGeneratedAt = new Date().toISOString();
          this.status = "qr_ready";
          this.isConnectingLock = false;
          try {
            this.qrDataUrl = await QRCode.toDataURL(qr, {
              width: 300,
              margin: 2,
              color: { dark: "#2B120C", light: "#FFFFFF" },
            });
          } catch (qrErr: any) {
            this.lastError = qrErr?.message || "Failed to render QR code";
          }
        }

        if (connection === "open") {
          this.status = "connected";
          this.isConnectingLock = false;
          this.reconnectAttempts = 0;
          this.qrRaw = null;
          this.qrDataUrl = null;
          this.lastError = null;
          const meId = sock.user?.id || "";
          this.connectedPhone = meId.split(":")[0]?.split("@")[0] || "Linked WhatsApp";
          this.connectedName = sock.user?.name || "Vivah Kar Lo Official";
          console.log(`[Baileys WhatsApp] Connected successfully as +${this.connectedPhone}`);
        }

        if (connection === "close") {
          this.isConnectingLock = false;
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
          const isLoggedOut = statusCode === DisconnectReason.loggedOut;

          if (isLoggedOut) {
            this.status = "disconnected";
            this.connectedPhone = null;
            this.connectedName = null;
            this.qrDataUrl = null;
            this.sock = null;
            this.lastError = "WhatsApp session logged out from mobile device. Please scan QR again.";
            this.wipeSessionFiles();
          } else if (this.status !== "disconnected") {
            this.status = "disconnected";
            this.lastError =
              (lastDisconnect?.error as any)?.message || "Connection closed. Ready to reconnect.";
            if (this.reconnectAttempts < 3) {
              this.reconnectAttempts++;
              this.reconnectTimer = setTimeout(() => {
                this.connect().catch(() => {});
              }, 3500 * this.reconnectAttempts);
            }
          }
        }
      });

      return {
        success: true,
        status: this.status,
        message: "Baileys WhatsApp engine initialized. Scan the QR code once ready.",
      };
    } catch (err: any) {
      this.isConnectingLock = false;
      this.status = "disconnected";
      this.lastError = err?.message || "Failed to initialize Baileys WhatsApp socket.";
      return {
        success: false,
        status: "disconnected",
        message: this.lastError!,
      };
    }
  }

  private wipeSessionFiles() {
    try {
      if (fs.existsSync(SESSION_DIR)) {
        fs.rmSync(SESSION_DIR, { recursive: true, force: true });
      }
      this.ensureSessionDir();
    } catch {
      // Ignore cleanup errors
    }
  }

  public async disconnect(clearSession = false): Promise<{ success: boolean; message: string }> {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.status = "disconnected";
    this.isConnectingLock = false;
    this.qrRaw = null;
    this.qrDataUrl = null;

    if (this.sock) {
      try {
        if (clearSession) {
          await this.sock.logout().catch(() => {});
        }
        this.sock.end(undefined);
      } catch {
        // Ignore close errors
      }
      this.sock = null;
    }

    this.connectedPhone = null;
    this.connectedName = null;

    if (clearSession) {
      this.wipeSessionFiles();
      return {
        success: true,
        message: "WhatsApp session cleared cleanly. Click 'Generate QR Code' to link a new device.",
      };
    }

    return {
      success: true,
      message: "WhatsApp socket disconnected.",
    };
  }

  public async sendMessage(
    mobile: string,
    message: string,
    category: WhatsAppDeliveryLog["category"] = "test"
  ): Promise<WhatsAppDeliveryLog> {
    const jid = this.normalizeToJid(mobile);
    const now = new Date().toISOString();

    if (!jid) {
      const failedLog: WhatsAppDeliveryLog = {
        id: `wa-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        to: mobile,
        jid: "",
        category,
        message,
        status: "failed",
        error: "Invalid mobile number format",
        timestamp: now,
      };
      this.deliveryLogs.unshift(failedLog);
      return failedLog;
    }

    if (this.status === "connected" && this.sock) {
      try {
        await this.sock.sendMessage(jid, { text: message });
        const sentLog: WhatsAppDeliveryLog = {
          id: `wa-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          to: mobile,
          jid,
          category,
          message,
          status: "sent_live_baileys",
          timestamp: now,
        };
        this.deliveryLogs.unshift(sentLog);
        if (this.deliveryLogs.length > 200) this.deliveryLogs.pop();
        return sentLog;
      } catch (err: any) {
        const failedLog: WhatsAppDeliveryLog = {
          id: `wa-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          to: mobile,
          jid,
          category,
          message,
          status: "failed",
          error: err?.message || "Baileys sendMessage failed",
          timestamp: now,
        };
        this.deliveryLogs.unshift(failedLog);
        return failedLog;
      }
    }

    // Graceful queue fallback when Admin hasn't scanned QR yet
    const queuedLog: WhatsAppDeliveryLog = {
      id: `wa-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      to: mobile,
      jid,
      category,
      message,
      status: "queued_disconnected",
      error: "WhatsApp not linked yet — Scan QR in Admin Settings to enable live delivery",
      timestamp: now,
    };
    this.deliveryLogs.unshift(queuedLog);
    if (this.deliveryLogs.length > 200) this.deliveryLogs.pop();
    return queuedLog;
  }
}

export const whatsappBaileysService = new WhatsAppBaileysService();
