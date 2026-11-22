import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  QrCode,
  MessageSquare,
  Mail,
  CheckCircle2,
  RefreshCw,
  PowerOff,
  Trash2,
  Send,
  Copy,
  Code2,
  Server,
  ShieldCheck,
  AlertTriangle,
  Wifi,
  WifiOff,
  Save,
  ShieldAlert,
  DollarSign,
  Key,
  Ban,
  Flame,
  Shield,
} from "lucide-react";

interface AdminMessagingGatewayDeskProps {
  onLogAction?: (action: string, target: string) => void;
}

export const AdminMessagingGatewayDesk: React.FC<AdminMessagingGatewayDeskProps> = ({
  onLogAction,
}) => {
  const { toast } = useToast();

  // ---- BAILEYS WHATSAPP STATE ----
  const [waStatus, setWaStatus] = useState<"disconnected" | "connecting" | "qr_ready" | "connected">("disconnected");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [connectedPhone, setConnectedPhone] = useState<string | null>(null);
  const [connectedName, setConnectedName] = useState<string | null>(null);
  const [waError, setWaError] = useState<string | null>(null);
  const [waStats, setWaStats] = useState({ totalLogs: 0, sentLive: 0, queued: 0, failed: 0 });
  const [waLogs, setWaLogs] = useState<any[]>([]);
  const [waBusy, setWaBusy] = useState(false);

  // Test WhatsApp state
  const [testMobile, setTestMobile] = useState("");
  const [testWaMsg, setTestWaMsg] = useState(
    "Namaste! This is a live verification test message from Vivah Kar Lo Official WhatsApp Gateway."
  );
  const [sendingWa, setSendingWa] = useState(false);

  // ---- EMAIL GATEWAY STATE (Google Apps Script / SMTP for Render) ----
  const [provider, setProvider] = useState<"google_script" | "smtp">("google_script");
  const [fromName, setFromName] = useState("Vivah Kar Lo Official");
  const [fromEmail, setFromEmail] = useState("noreply@vivahkarlo.in");
  const [googleScriptUrl, setGoogleScriptUrl] = useState("");
  const [googleScriptSecret, setGoogleScriptSecret] = useState("VIVAH_KAR_LO_SECRET_2026");
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState<number>(587);
  const [smtpSecure, setSmtpSecure] = useState<boolean>(false);
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [emailReady, setEmailReady] = useState(false);
  const [scriptTemplate, setScriptTemplate] = useState("");
  const [showScriptCode, setShowScriptCode] = useState(false);
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [savingEmail, setSavingEmail] = useState(false);

  // Test Email state
  const [testEmailTo, setTestEmailTo] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  // ---- CHAT KEYWORD & SCAM ALERTS STATE ----
  const [activeDeskView, setActiveDeskView] = useState<"gateways" | "scam_alerts">("gateways");
  const [scamAlerts, setScamAlerts] = useState<any[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  const fetchScamAlerts = async () => {
    setLoadingAlerts(true);
    try {
      const res = await fetch("/api/v1/security/admin/scam-alerts");
      const data = await res.json();
      if (data.success && Array.isArray(data.alerts)) {
        setScamAlerts(data.alerts);
      }
    } catch {
      // Ignore network errors
    } finally {
      setLoadingAlerts(false);
    }
  };

  const handleResolveAlert = async (alertId: string, action: "quarantined" | "dismissed", senderUserId: string) => {
    try {
      const res = await fetch(`/api/v1/security/admin/scam-alerts/${alertId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setScamAlerts((prev) =>
          prev.map((a) => (a.id === alertId ? { ...a, status: action } : a))
        );
        onLogAction?.(`Scam Alert: ${action}`, `User: ${senderUserId} (Alert: ${alertId})`);
        toast({
          title: action === "quarantined" ? "Account Quarantined & Suspended" : "Alert Dismissed",
          description: data.message,
          variant: action === "quarantined" ? "destructive" : "default",
        });
      }
    } catch {
      toast({
        title: "Action Failed",
        description: "Could not update scam alert status.",
        variant: "destructive",
      });
    }
  };

  const fetchWaStatus = async () => {
    try {
      const res = await fetch("/api/v1/gateway/whatsapp/status");
      const data = await res.json();
      if (data.success) {
        setWaStatus(data.status);
        setQrDataUrl(data.qrDataUrl || null);
        setConnectedPhone(data.connectedPhone || null);
        setConnectedName(data.connectedName || null);
        setWaError(data.lastError || null);
        if (data.stats) setWaStats(data.stats);
        if (Array.isArray(data.logs)) setWaLogs(data.logs);
      }
    } catch {
      // Ignore transient poll errors
    }
  };

  const fetchEmailConfig = async () => {
    try {
      const res = await fetch("/api/v1/gateway/email/config");
      const data = await res.json();
      if (data.success && data.config) {
        const c = data.config;
        setProvider(c.provider || "google_script");
        setFromName(c.fromName || "Vivah Kar Lo Official");
        setFromEmail(c.fromEmail || "noreply@vivahkarlo.in");
        setGoogleScriptUrl(c.googleScriptUrl || "");
        if (c.hasGoogleScriptSecret) setGoogleScriptSecret("••••••••");
        setSmtpHost(c.smtpHost || "smtp.gmail.com");
        setSmtpPort(c.smtpPort || 587);
        setSmtpSecure(Boolean(c.smtpSecure));
        setSmtpUser(c.smtpUser || "");
        if (c.hasSmtpPass) setSmtpPass("••••••••");
        setEmailReady(Boolean(c.isReady));
        setScriptTemplate(c.scriptTemplate || "");
        if (Array.isArray(data.logs)) setEmailLogs(data.logs);
      }
    } catch {
      // Ignore load error
    }
  };

  useEffect(() => {
    fetchWaStatus();
    fetchEmailConfig();
  }, []);

  // Poll QR / connection status every 3s while connecting or waiting for QR scan
  useEffect(() => {
    if (waStatus !== "connecting" && waStatus !== "qr_ready") return;
    const timer = setInterval(fetchWaStatus, 3000);
    return () => clearInterval(timer);
  }, [waStatus]);

  const handleConnectWa = async () => {
    setWaBusy(true);
    try {
      const res = await fetch("/api/v1/gateway/whatsapp/connect", { method: "POST" });
      const data = await res.json();
      setWaStatus(data.status || "connecting");
      setQrDataUrl(data.qrDataUrl || null);
      setWaError(data.lastError || null);
      onLogAction?.("Initialized Baileys WhatsApp QR", "WhatsApp Gateway");
      toast({
        title: "Baileys WhatsApp Initializing",
        description: "QR Code will appear within 3-5 seconds. Scan via WhatsApp → Linked Devices.",
      });
    } catch {
      toast({ title: "Failed to start WhatsApp engine", variant: "destructive" });
    } finally {
      setWaBusy(false);
    }
  };

  const handleDisconnectWa = async (clearSession: boolean) => {
    setWaBusy(true);
    try {
      const res = await fetch("/api/v1/gateway/whatsapp/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clearSession }),
      });
      const data = await res.json();
      setWaStatus("disconnected");
      setQrDataUrl(null);
      setConnectedPhone(null);
      setConnectedName(null);
      onLogAction?.(
        clearSession ? "Cleared Baileys WhatsApp Session" : "Disconnected WhatsApp",
        "WhatsApp Gateway"
      );
      toast({ title: clearSession ? "WhatsApp Session Cleared" : "WhatsApp Disconnected", description: data.message });
    } finally {
      setWaBusy(false);
    }
  };

  const handleSendTestWa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMobile.trim()) return;
    setSendingWa(true);
    try {
      const res = await fetch("/api/v1/gateway/whatsapp/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: testMobile, message: testWaMsg }),
      });
      const data = await res.json();
      await fetchWaStatus();
      toast({
        title: data.success ? "Live WhatsApp Delivered!" : "WhatsApp Queued",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
    } finally {
      setSendingWa(false);
    }
  };

  const handleSaveEmailConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEmail(true);
    try {
      const res = await fetch("/api/v1/gateway/email/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          enabled: true,
          fromName,
          fromEmail,
          googleScriptUrl,
          googleScriptSecret,
          smtpHost,
          smtpPort: Number(smtpPort),
          smtpSecure,
          smtpUser,
          smtpPass,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");
      setEmailReady(Boolean(data.config?.isReady));
      onLogAction?.("Updated Email Gateway Config", provider);
      toast({ title: "Email Gateway Saved", description: data.message });
    } catch (err: any) {
      toast({ title: "Config Error", description: err.message, variant: "destructive" });
    } finally {
      setSavingEmail(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailTo.trim()) return;
    setSendingEmail(true);
    try {
      const res = await fetch("/api/v1/gateway/email/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testEmailTo }),
      });
      const data = await res.json();
      await fetchEmailConfig();
      toast({
        title: data.success ? "Test Email Sent!" : "Email Dispatch Notice",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top View Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => setActiveDeskView("gateways")}
            className={`h-9 px-4 rounded-xl text-xs font-bold transition-all ${
              activeDeskView === "gateways"
                ? "bg-[#800020] text-white shadow-xs"
                : "bg-white text-[#5C4740] border border-amber-200 hover:bg-amber-100/50"
            }`}
          >
            <MessageSquare className="w-4 h-4 mr-1.5 text-emerald-600" />
            Live Dispatch Gateways (WhatsApp &amp; Email)
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => {
              setActiveDeskView("scam_alerts");
              fetchScamAlerts();
            }}
            className={`h-9 px-4 rounded-xl text-xs font-bold transition-all ${
              activeDeskView === "scam_alerts"
                ? "bg-[#800020] text-white shadow-xs"
                : "bg-white text-[#5C4740] border border-amber-200 hover:bg-amber-100/50"
            }`}
          >
            <Flame className="w-4 h-4 mr-1.5 text-rose-500" />
            Chat Keyword &amp; Scam Alerts
            {scamAlerts.filter((a) => a.status === "pending_review").length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-rose-500 text-white text-[10px] rounded-full font-bold">
                {scamAlerts.filter((a) => a.status === "pending_review").length}
              </span>
            )}
          </Button>
        </div>

        {activeDeskView === "scam_alerts" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchScamAlerts}
            disabled={loadingAlerts}
            className="h-8 px-3 rounded-xl text-xs font-semibold border-amber-200 bg-white hover:bg-amber-50 text-[#5C4740]"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loadingAlerts ? "animate-spin" : ""}`} />
            Refresh Alerts
          </Button>
        )}
      </div>

      {/* VIEW 1: GATEWAYS */}
      {activeDeskView === "gateways" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ============================================================
            PANEL 1: BAILEYS WHATSAPP QR SCAN & LIVE MESSAGING GATEWAY
           ============================================================ */}
        <div className="bg-white rounded-3xl border border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-100">
            <div>
              <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                WhatsApp Gateway (Baileys QR Scan)
              </h3>
              <p className="text-xs text-[#5C4740]">
                Link your official WhatsApp once — all user OTPs, match alerts &amp; broadcasts dispatch live.
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 self-start ${
                waStatus === "connected"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : waStatus === "qr_ready"
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : waStatus === "connecting"
                  ? "bg-sky-100 text-sky-800 border border-sky-200"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {waStatus === "connected" ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              {waStatus === "connected"
                ? "Connected Live ✓"
                : waStatus === "qr_ready"
                ? "Ready to Scan QR"
                : waStatus === "connecting"
                ? "Generating QR..."
                : "Disconnected"}
            </span>
          </div>

          {/* QR Code & Connection Stage */}
          <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-amber-200 flex flex-col items-center justify-center text-center space-y-3">
            {waStatus === "connected" ? (
              <div className="space-y-2 py-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="font-serif-royal text-lg font-bold text-emerald-900">
                  WhatsApp Active &amp; Linked
                </p>
                <p className="text-xs text-[#4E342E]">
                  Number: <strong>+{connectedPhone}</strong> • Account: <strong>{connectedName}</strong>
                </p>
                <div className="flex justify-center gap-3 text-[11px] font-bold pt-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Sent Live: {waStats.sentLive}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    Queued: {waStats.queued}
                  </span>
                </div>
              </div>
            ) : qrDataUrl ? (
              <div className="space-y-2.5">
                <div className="p-3 bg-white rounded-2xl border-2 border-[#EA580C] shadow-md inline-block">
                  <img src={qrDataUrl} alt="Scan WhatsApp Baileys QR Code" className="w-56 h-56" />
                </div>
                <p className="text-xs font-bold text-[#3B0A18]">
                  Open WhatsApp on your phone → Settings → Linked Devices → Link a Device → Scan QR
                </p>
                <p className="text-[11px] text-[#6E564E]">
                  QR refreshes automatically every 20 seconds until scanned.
                </p>
              </div>
            ) : (
              <div className="py-4 space-y-2">
                <QrCode className="w-12 h-12 text-amber-500 mx-auto" />
                <p className="text-sm font-bold text-[#2B120C]">
                  {waStatus === "connecting"
                    ? "Connecting to WhatsApp Web servers via Baileys..."
                    : "WhatsApp Not Linked Yet"}
                </p>
                <p className="text-xs text-[#5C4740] max-w-sm">
                  Click &ldquo;Generate WhatsApp QR&rdquo; below to pair your official Vivah Kar Lo WhatsApp number.
                </p>
              </div>
            )}

            {waError && (
              <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                {waError}
              </p>
            )}

            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {waStatus !== "connected" && (
                <Button
                  type="button"
                  size="sm"
                  disabled={waBusy}
                  onClick={handleConnectWa}
                  className="h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4"
                >
                  <QrCode className="w-3.5 h-3.5 mr-1.5" />
                  {waBusy ? "Starting Baileys..." : "Generate WhatsApp QR"}
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={fetchWaStatus}
                className="h-9 rounded-xl border-amber-300 text-xs font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Refresh Status
              </Button>
              {waStatus !== "disconnected" && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={waBusy}
                  onClick={() => handleDisconnectWa(false)}
                  className="h-9 rounded-xl border-amber-300 text-amber-900 text-xs font-semibold"
                >
                  <PowerOff className="w-3.5 h-3.5 mr-1" />
                  Disconnect
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={waBusy}
                onClick={() => handleDisconnectWa(true)}
                className="h-9 rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear Session &amp; Re-Scan
              </Button>
            </div>
          </div>

          {/* Send Test WhatsApp Message */}
          <form onSubmit={handleSendTestWa} className="space-y-3 pt-2 border-t border-amber-100">
            <Label className="text-xs font-bold text-[#3B0A18] block">
              Test Live WhatsApp Delivery (Baileys):
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input
                value={testMobile}
                onChange={(e) => setTestMobile(e.target.value)}
                placeholder="10-digit mobile (e.g. 9876543210)"
                className="h-10 rounded-xl border-amber-200 text-xs sm:col-span-2"
                required
              />
              <Button
                type="submit"
                disabled={sendingWa}
                className="h-10 rounded-xl bg-saffron-gradient text-white font-bold text-xs"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                {sendingWa ? "Sending..." : "Send Test"}
              </Button>
            </div>
            <Textarea
              value={testWaMsg}
              onChange={(e) => setTestWaMsg(e.target.value)}
              rows={2}
              className="rounded-xl border-amber-200 text-xs"
            />
          </form>

          {/* Recent WhatsApp Logs */}
          {waLogs.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-amber-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#7C2D12]">
                Recent Baileys Dispatch Logs ({waLogs.length})
              </p>
              <div className="max-h-36 overflow-y-auto divide-y divide-amber-100 border border-amber-200/80 rounded-xl text-[11px]">
                {waLogs.slice(0, 8).map((l) => (
                  <div key={l.id} className="p-2 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-bold text-[#2B120C]">{l.to}</span>{" "}
                      <span className="text-[#6E564E] uppercase text-[10px]">[{l.category}]</span>
                      <p className="text-[#5C4740] truncate max-w-[260px]">{l.message}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        l.status === "sent_live_baileys"
                          ? "bg-emerald-100 text-emerald-800"
                          : l.status === "queued_disconnected"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {l.status === "sent_live_baileys"
                        ? "Sent ✓"
                        : l.status === "queued_disconnected"
                        ? "Queued"
                        : "Failed"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================
            PANEL 2: RENDER-READY EMAIL GATEWAY (GOOGLE SCRIPT + SMTP)
           ============================================================ */}
        <div className="bg-white rounded-3xl border border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-100">
            <div>
              <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#EA580C]" />
                Render-Ready Email Gateway
              </h3>
              <p className="text-xs text-[#5C4740]">
                Google Apps Script HTTPS Webhook (100% Render Free/Starter compatible) or Custom SMTP.
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold self-start ${
                emailReady
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-amber-100 text-amber-900 border border-amber-200"
              }`}
            >
              {emailReady ? "Configured ✓" : "Setup Required"}
            </span>
          </div>

          {/* Provider Mode Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-amber-50 border border-amber-200">
            <button
              type="button"
              onClick={() => setProvider("google_script")}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                provider === "google_script"
                  ? "bg-[#3B0A18] text-amber-100 shadow-xs"
                  : "text-[#5C4740] hover:text-[#2B120C]"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Google Apps Script (Render Best)
            </button>
            <button
              type="button"
              onClick={() => setProvider("smtp")}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                provider === "smtp"
                  ? "bg-[#3B0A18] text-amber-100 shadow-xs"
                  : "text-[#5C4740] hover:text-[#2B120C]"
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              Custom SMTP (Nodemailer)
            </button>
          </div>

          <form onSubmit={handleSaveEmailConfig} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-[#3B0A18]">Sender / Brand Name</Label>
                <Input
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="mt-1 h-10 rounded-xl border-amber-200 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-[#3B0A18]">From Email Address</Label>
                <Input
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  className="mt-1 h-10 rounded-xl border-amber-200 text-xs"
                />
              </div>
            </div>

            {provider === "google_script" ? (
              <div className="space-y-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    HTTPS Port 443 Webhook — Never Blocked on Render.com
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowScriptCode(!showScriptCode)}
                    className="text-[11px] font-bold text-[#EA580C] underline"
                  >
                    {showScriptCode ? "Hide Script Code" : "Get Google Script Code"}
                  </button>
                </div>

                {showScriptCode && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#4E342E]">
                      <span>
                        Paste into <strong>script.google.com</strong> → Deploy → Web App (Access: Anyone)
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard?.writeText(scriptTemplate);
                          toast({ title: "Google Apps Script Code Copied!" });
                        }}
                        className="h-7 text-[11px] rounded-lg border-amber-300"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy Code
                      </Button>
                    </div>
                    <pre className="p-3 rounded-xl bg-[#2B120C] text-amber-100 text-[10px] overflow-x-auto max-h-40 font-mono">
                      {scriptTemplate}
                    </pre>
                  </div>
                )}

                <div>
                  <Label className="text-xs font-semibold text-[#3B0A18]">
                    Google Apps Script Web App URL
                  </Label>
                  <Input
                    value={googleScriptUrl}
                    onChange={(e) => setGoogleScriptUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="mt-1 h-10 rounded-xl border-amber-200 bg-white text-xs font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-[#3B0A18]">
                    Webhook Secret Key (Matches EXPECTED_SECRET in Script)
                  </Label>
                  <Input
                    value={googleScriptSecret}
                    onChange={(e) => setGoogleScriptSecret(e.target.value)}
                    placeholder="VIVAH_KAR_LO_SECRET_2026"
                    className="mt-1 h-10 rounded-xl border-amber-200 bg-white text-xs font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <Label className="text-xs font-semibold text-[#3B0A18]">SMTP Host</Label>
                    <Input
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      placeholder="smtp.gmail.com / smtp-relay.brevo.com"
                      className="mt-1 h-10 rounded-xl border-amber-200 bg-white text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-[#3B0A18]">SMTP Port</Label>
                    <Input
                      type="number"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(Number(e.target.value))}
                      className="mt-1 h-10 rounded-xl border-amber-200 bg-white text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-semibold text-[#3B0A18]">SMTP Username / Email</Label>
                    <Input
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                      placeholder="your-email@gmail.com"
                      className="mt-1 h-10 rounded-xl border-amber-200 bg-white text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-[#3B0A18]">SMTP App Password</Label>
                    <Input
                      type="password"
                      value={smtpPass}
                      onChange={(e) => setSmtpPass(e.target.value)}
                      placeholder="16-char Gmail App Password"
                      className="mt-1 h-10 rounded-xl border-amber-200 bg-white text-xs"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#3B0A18] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smtpSecure}
                    onChange={(e) => setSmtpSecure(e.target.checked)}
                    className="accent-[#EA580C]"
                  />
                  Use Direct SSL/TLS (Check for Port 465, uncheck for STARTTLS Port 587)
                </label>
              </div>
            )}

            <Button
              type="submit"
              disabled={savingEmail}
              className="w-full h-10 rounded-xl bg-saffron-gradient text-white font-bold text-xs shadow-saffron-sm"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {savingEmail ? "Saving Email Settings..." : "Save Email Gateway Settings"}
            </Button>
          </form>

          {/* Send Live Test Email */}
          <form onSubmit={handleSendTestEmail} className="space-y-2 pt-3 border-t border-amber-100">
            <Label className="text-xs font-bold text-[#3B0A18] block">
              Test Live Email Delivery:
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input
                type="email"
                value={testEmailTo}
                onChange={(e) => setTestEmailTo(e.target.value)}
                placeholder="recipient@gmail.com"
                className="h-10 rounded-xl border-amber-200 text-xs sm:col-span-2"
                required
              />
              <Button
                type="submit"
                disabled={sendingEmail}
                variant="outline"
                className="h-10 rounded-xl border-amber-300 bg-amber-50 text-[#3B0A18] font-bold text-xs"
              >
                <Send className="w-3.5 h-3.5 mr-1.5 text-[#EA580C]" />
                {sendingEmail ? "Sending..." : "Send Test Email"}
              </Button>
            </div>
          </form>

          {emailLogs.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-amber-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#7C2D12]">
                Recent Email Logs ({emailLogs.length})
              </p>
              <div className="max-h-32 overflow-y-auto divide-y divide-amber-100 border border-amber-200/80 rounded-xl text-[11px]">
                {emailLogs.slice(0, 6).map((l) => (
                  <div key={l.id} className="p-2 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-bold text-[#2B120C]">{l.to}</span>
                      <p className="text-[#5C4740] truncate max-w-[260px]">{l.subject}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        l.status.startsWith("sent_")
                          ? "bg-emerald-100 text-emerald-800"
                          : l.status === "queued_not_configured"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {l.status.startsWith("sent_") ? "Delivered ✓" : l.status === "queued_not_configured" ? "Not Configured" : "Failed"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* VIEW 2: REAL-TIME CHAT KEYWORD & SCAM ALERTS */}
      {activeDeskView === "scam_alerts" && (
        <div className="space-y-4">
          {/* Security Advisory Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#2B120C]">
                Real-Time Chat Keyword &amp; Scam Alert System
              </h4>
              <p className="text-xs text-[#5C4740] mt-0.5 leading-relaxed">
                Automatically scans 1-on-1 member conversations for prohibited financial solicitations (&ldquo;UPI&rdquo;, &ldquo;Google Pay&rdquo;, &ldquo;PhonePe&rdquo;, &ldquo;transfer money&rdquo;, &ldquo;emergency&rdquo;), OTP phishing, and off-platform diversions. Review suspect messages below and quarantine malicious accounts with a single click.
              </p>
            </div>
          </div>

          {loadingAlerts ? (
            <div className="p-12 text-center text-[#8C6D62] bg-white rounded-2xl border border-amber-200/80">
              <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-amber-600" />
              Scanning and loading scam alerts...
            </div>
          ) : scamAlerts.length === 0 ? (
            <div className="p-12 text-center text-[#8C6D62] bg-white rounded-2xl border border-amber-200/80">
              <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
              <p className="font-bold text-sm text-[#2B120C]">No Active Scam Alerts</p>
              <p className="text-xs text-[#5C4740] mt-1">All active member conversations comply with Trust &amp; Safety rules.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scamAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl bg-white border shadow-xs space-y-3 ${
                    alert.severity === "critical"
                      ? "border-rose-300 bg-rose-50/20"
                      : "border-amber-200/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#2B120C]">
                          Sender: {alert.senderName || alert.senderUserId}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            alert.severity === "critical"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : alert.severity === "high"
                              ? "bg-orange-100 text-orange-800 border border-orange-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8C6D62] mt-0.5">
                        Target Recipient: {alert.receiverUserId} • {new Date(alert.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        alert.status === "quarantined"
                          ? "bg-rose-100 text-rose-800"
                          : alert.status === "dismissed"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {alert.status === "quarantined"
                        ? "Quarantined"
                        : alert.status === "dismissed"
                        ? "Dismissed"
                        : "Pending Review"}
                    </span>
                  </div>

                  {/* Flagged Message Box */}
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs">
                    <span className="text-[10px] uppercase font-bold text-[#8C6D62] block mb-1">
                      Intercepted Message Text:
                    </span>
                    <p className="text-[#2B120C] font-mono leading-relaxed bg-white p-2 rounded-lg border border-amber-200/60">
                      &ldquo;{alert.messageContent}&rdquo;
                    </p>
                  </div>

                  {/* Matched Keywords */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[10px] uppercase font-bold text-[#8C6D62]">
                      Keywords Triggered:
                    </span>
                    {alert.matchedKeywords.map((kw: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[11px] font-bold"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  {alert.status === "pending_review" && (
                    <div className="pt-2 border-t border-amber-100 flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolveAlert(alert.id, "dismissed", alert.senderUserId)}
                        className="h-8 rounded-xl text-xs font-semibold border-amber-200 text-[#5C4740]"
                      >
                        Dismiss False Positive
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleResolveAlert(alert.id, "quarantined", alert.senderUserId)}
                        className="h-8 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
                      >
                        <Ban className="w-3.5 h-3.5 mr-1" />
                        Quarantine &amp; Suspend User
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
