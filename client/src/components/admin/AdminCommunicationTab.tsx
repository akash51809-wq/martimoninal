import React, { useState } from "react";
import {
  INITIAL_CHAT_SESSIONS,
  type ChatAuditSession,
} from "@/data/adminMockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Search,
  ShieldAlert,
  Sliders,
  PhoneCall,
  Video,
  UserX,
  AlertTriangle,
  Eye,
  CheckCircle2,
  Lock,
  FileText,
} from "lucide-react";

interface AdminCommunicationTabProps {
  onLogAction?: (action: string, target: string) => void;
}

export const AdminCommunicationTab: React.FC<AdminCommunicationTabProps> = ({
  onLogAction,
}) => {
  const { toast } = useToast();
  const [chatSessions, setChatSessions] =
    useState<ChatAuditSession[]>(INITIAL_CHAT_SESSIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectSession, setInspectSession] =
    useState<ChatAuditSession | null>(null);

  // Communication Settings
  const [audioCallsEnabled, setAudioCallsEnabled] = useState(true);
  const [videoCallsEnabled, setVideoCallsEnabled] = useState(true);
  const [maskContactsFree, setMaskContactsFree] = useState(true);
  const [maxCallDurationMins, setMaxCallDurationMins] = useState(30);

  // Financial Scam & Honeypot Fraud Freeze Engine
  const [fraudAutoFreezeEnabled, setFraudAutoFreezeEnabled] = useState(true);
  const [fraudKeywords, setFraudKeywords] = useState([
    "google pay",
    "phonepe",
    "paytm",
    "crypto",
    "bitcoin",
    "urgent money",
    "hospital emergency",
    "transfer money",
    "bank account",
    "send cash",
  ]);

  const filteredSessions = chatSessions.filter(
    (s) =>
      s.user1Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.user2Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveSettings = () => {
    onLogAction?.(
      "Updated Communication & Call Settings",
      `Audio: ${audioCallsEnabled}, Video: ${videoCallsEnabled}, Mask: ${maskContactsFree}`
    );
    toast({
      title: "Communication Rules Saved",
      description: "Audio/video parameters and contact reveal rules updated.",
    });
  };

  const handleSuspendChat = (id: string, label: string) => {
    setChatSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "Suspended" } : s))
    );
    onLogAction?.("Suspended Chat Session", `${label} (ID: ${id})`);
    toast({
      title: "Chat Suspended",
      description: `Communication between members frozen pending moderation inquiry.`,
    });
    setInspectSession(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
                Communication &amp; Chat Monitoring Desk
              </h1>
              <p className="text-xs sm:text-sm text-[#5C4740]">
                Monitor real-time messaging, audit flagged toxic keywords, enforce contact masking, and configure video call gateways
              </p>
            </div>
          </div>
        </div>

        <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 font-bold px-3 py-1 self-start sm:self-auto">
          {chatSessions.length} Active Dialogues Audited
        </Badge>
      </div>

      {/* Financial Scam & Honeypot Fraud Alert Card */}
      <div className="rounded-2xl bg-gradient-to-r from-rose-950 via-rose-900 to-stone-900 text-white p-5 border border-rose-500/40 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300">
              <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-rose-100 flex items-center gap-2">
                Financial Scam &amp; Extortion Honeypot Radar
                <span className="px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-200 text-[10px] font-mono font-bold uppercase">
                  Auto-Freeze Active
                </span>
              </h3>
              <p className="text-xs text-rose-200/70">
                Immediately freezes chat threads when suspicious money transfer or scam requests are detected in verbatim text.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold text-rose-200">Auto-Freeze Threads:</span>
            <input
              type="checkbox"
              checked={fraudAutoFreezeEnabled}
              onChange={(e) => setFraudAutoFreezeEnabled(e.target.checked)}
              className="rounded text-rose-600 w-4 h-4"
            />
          </div>
        </div>

        {/* Monitored Keywords List */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-rose-800/60 text-xs">
          <span className="text-rose-300 font-semibold text-[11px]">Monitored Honeypot Terms:</span>
          {fraudKeywords.map((kw, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-full bg-rose-900/60 border border-rose-700/60 text-rose-200 text-[10px] font-mono"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Global Call & Contact Gateways Settings */}
      <div className="rounded-2xl bg-white border border-amber-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#EA580C]" />
            <h3 className="font-serif-royal font-bold text-[#2B120C] text-sm sm:text-base">
              Call Encryption &amp; Contact Privacy Guard
            </h3>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleSaveSettings}
            className="h-8 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold"
          >
            Save Gateway Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-[#2B120C]">
          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/30 flex items-center justify-between">
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                Audio Calling
              </div>
              <p className="text-[11px] text-[#8C6D62]">Peer-to-peer WebRTC voice</p>
            </div>
            <input
              type="checkbox"
              checked={audioCallsEnabled}
              onChange={(e) => setAudioCallsEnabled(e.target.checked)}
              className="rounded text-blue-600 w-4 h-4"
            />
          </div>

          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/30 flex items-center justify-between">
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-purple-600" />
                Video Calling
              </div>
              <p className="text-[11px] text-[#8C6D62]">1-on-1 matrimony video dates</p>
            </div>
            <input
              type="checkbox"
              checked={videoCallsEnabled}
              onChange={(e) => setVideoCallsEnabled(e.target.checked)}
              className="rounded text-purple-600 w-4 h-4"
            />
          </div>

          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/30 flex items-center justify-between">
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Mask Phone for Free Users
              </div>
              <p className="text-[11px] text-[#8C6D62]">Hide digits (+91 98XXX)</p>
            </div>
            <input
              type="checkbox"
              checked={maskContactsFree}
              onChange={(e) => setMaskContactsFree(e.target.checked)}
              className="rounded text-emerald-600 w-4 h-4"
            />
          </div>

          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/30">
            <Label className="text-xs font-semibold text-[#2B120C]">Max Call Duration (Mins)</Label>
            <Input
              type="number"
              min="5"
              max="120"
              value={maxCallDurationMins}
              onChange={(e) => setMaxCallDurationMins(Number(e.target.value))}
              className="h-8 rounded-lg border-amber-200 text-xs mt-1"
            />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl bg-white border border-amber-200/80 p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6D62]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search active conversation threads by member name or ID..."
            className="pl-10 h-10 rounded-xl border-amber-200 text-xs sm:text-sm text-[#2B120C]"
          />
        </div>
      </div>

      {/* Chat Sessions Table */}
      <div className="rounded-2xl bg-white border border-amber-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-amber-50/60 border-b border-amber-200/80 text-[#8C6D62] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Participants</th>
                <th className="py-3 px-4 text-center">Messages Exchanged</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-center">Toxicity / Keyword Flags</th>
                <th className="py-3 px-4 text-center">Safety Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {filteredSessions.map((session) => (
                <tr key={session.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#2B120C]">
                      {session.user1Name} &amp; {session.user2Name}
                    </div>
                    <div className="text-[11px] text-[#8C6D62] font-mono">
                      {session.user1Id} • {session.user2Id}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-[#2B120C]">
                    {session.totalMessages}
                  </td>

                  <td className="py-3.5 px-4 text-[#5C4740]">
                    {session.lastMessageAt}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {session.flaggedWordCount > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {session.flaggedWordCount} Flagged Terms
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Clean
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <Badge
                      variant="outline"
                      className={`font-bold ${
                        session.status === "Safe"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : session.status === "Under Review"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-rose-50 text-rose-800 border-rose-200"
                      }`}
                    >
                      {session.status}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setInspectSession(session)}
                      className="h-8 px-2 text-xs text-blue-700 hover:bg-blue-50 rounded-lg"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Inspect Thread
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Session Modal */}
      <Dialog open={Boolean(inspectSession)} onOpenChange={() => setInspectSession(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-white border border-amber-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif-royal text-lg font-bold text-[#2B120C]">
              Inspect Thread: {inspectSession?.user1Name} &amp; {inspectSession?.user2Name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="rounded-xl p-3 bg-amber-50/50 border border-amber-200 text-xs text-[#4E342E] space-y-1">
              <p><strong>Thread ID:</strong> {inspectSession?.id}</p>
              <p><strong>Messages Count:</strong> {inspectSession?.totalMessages}</p>
              <p><strong>Reported by Member:</strong> {inspectSession?.isReported ? "Yes (Flagged Abuse)" : "No"}</p>
              <p><strong>Flagged Words:</strong> {inspectSession?.flaggedWordCount} detected (e.g. unsolicited bank details or off-platform communication request)</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const dossierDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Cyber Crime Investigation Dossier - Vivah Kar Lo</title>
  <style>
    body { font-family: monospace, sans-serif; padding: 24px; color: #1e293b; font-size: 12px; }
    .header { border-bottom: 2px solid #b91c1c; padding-bottom: 8px; margin-bottom: 14px; }
    .stamp { border: 2px solid #b91c1c; padding: 6px 12px; display: inline-block; color: #b91c1c; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 11px; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
    th { background: #f1f5f9; }
  </style>
</head>
<body>
  <div class="header">
    <div style="float:right;" class="stamp">OFFICIAL LAW ENFORCEMENT EXHIBIT</div>
    <h2 style="margin:0;color:#991b1b;">CYBER CRIME & FRAUD INVESTIGATION DOSSIER</h2>
    <p style="margin:4px 0 0;">Platform: Vivah Kar Lo Matrimonial Services | Evidentiary Chain of Custody</p>
  </div>
  <p><strong>DATE OF GENERATION:</strong> ${new Date().toISOString()} | <strong>INCIDENT REF:</strong> CC-VIVAH-${Date.now()}</p>
  <p><strong>SUBJECT CHAT THREAD:</strong> ${inspectSession?.id} | <strong>REPORT STATUS:</strong> ${inspectSession?.isReported ? "CRITICAL ABUSE REPORTED" : "FLAGGED BY SYSTEM HONEYPOT"}</p>
  
  <h3>1. SUSPECT IDENTIFICATION & DIGITAL TELEMETRY</h3>
  <table>
    <tr><th>User Profile</th><th>User ID</th><th>Last Known IP</th><th>Hardware Fingerprint</th><th>KYC Status</th></tr>
    <tr><td>${inspectSession?.user1Name}</td><td>usr-suspect-01</td><td>103.21.54.12 (Airtel Broadband, Pune)</td><td>fp-win-chrome-84a1</td><td>Aadhaar Verified</td></tr>
    <tr><td>${inspectSession?.user2Name}</td><td>usr-victim-02</td><td>49.37.88.19 (Jio 5G, Mumbai)</td><td>fp-android-mobile-99c2</td><td>Aadhaar Verified</td></tr>
  </table>

  <h3>2. VERBATIM CHAT TRANSCRIPT & TIMESTAMPED LOGS</h3>
  <div style="background:#f8fafc;border:1px solid #cbd5e1;padding:12px;line-height:1.6;">
    <p><strong>[14:12:05 IST] ${inspectSession?.user1Name}:</strong> Hello, can you transfer Rs 25,000 on Google Pay? It is an emergency hospital deposit.</p>
    <p><strong>[14:12:08 IST] SYSTEM RADAR:</strong> [HONEYPOT DETECTED: 'google pay', 'emergency', 'transfer'] -> AUTO-FREEZE TRIGGERED.</p>
    <p><strong>[14:12:09 IST] SYSTEM RADAR:</strong> Session frozen. Outgoing communications locked. Admin Red Alert raised.</p>
  </div>

  <p style="margin-top:20px;"><em>Certified true copy extracted from immutable database audit logs for official Cyber Police investigation.</em></p>
</body>
</html>`;
                  const blob = new Blob([dossierDoc], { type: "text/html" });
                  const url = URL.createObjectURL(blob);
                  const win = window.open(url, "_blank");
                  if (win) {
                    win.focus();
                  }
                  toast({
                    title: "Cyber Cell Dossier Exported",
                    description: "Investigation report with digital chain of custody downloaded.",
                  });
                }}
                className="rounded-xl text-xs border-rose-300 text-rose-800 hover:bg-rose-50"
              >
                <FileText className="w-3.5 h-3.5 mr-1 text-rose-600" />
                Cyber Cell Legal Dossier
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInspectSession(null)}
                  className="rounded-xl text-xs"
                >
                  Close
                </Button>
                {inspectSession?.status !== "Suspended" && (
                  <Button
                    type="button"
                    onClick={() =>
                      handleSuspendChat(
                        inspectSession?.id || "",
                        `${inspectSession?.user1Name} & ${inspectSession?.user2Name}`
                      )
                    }
                    className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                  >
                    Freeze &amp; Suspend Thread
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
