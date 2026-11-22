import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Flag,
} from "lucide-react";

interface ReportProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  targetUserName: string;
  currentUserId?: string;
  onReportSuccess?: () => void;
}

const REPORT_REASONS = [
  {
    id: "fake_profile",
    label: "Fake Profile / Stolen Celebrity Photos",
    desc: "Profile photos look downloaded, AI-generated, or belong to someone else.",
  },
  {
    id: "financial_scam",
    label: "Financial Scam / Asking for Money or UPI",
    desc: "Member requested cash, medical emergency funds, investment, or UPI transfer.",
  },
  {
    id: "harassment",
    label: "Harassment, Abuse or Vulgar Behavior",
    desc: "Abusive language, vulgar messages, or persistent non-consensual contact.",
  },
  {
    id: "impersonation",
    label: "Impersonation or False Marital Information",
    desc: "Misrepresenting marital status, job credentials, or impersonating a family.",
  },
  {
    id: "commercial",
    label: "Commercial Broker / Dating Agency",
    desc: "Commercial agent, matchmaker broker, or promotional agency.",
  },
];

export const ReportProfileModal: React.FC<ReportProfileModalProps> = ({
  isOpen,
  onClose,
  targetUserId,
  targetUserName,
  currentUserId = "usr-current-user",
  onReportSuccess,
}) => {
  const { toast } = useToast();
  const [selectedReason, setSelectedReason] = useState<string>("fake_profile");
  const [details, setDetails] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<{
    autoSuspended: boolean;
    message: string;
  } | null>(null);

  const handleSubmitReport = async () => {
    setSubmitting(true);
    try {
      const reasonObj = REPORT_REASONS.find((r) => r.id === selectedReason);
      const res = await fetch("/api/v1/security/report-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reporterId: currentUserId,
          reportedUserId: targetUserId,
          reportedUserName: targetUserName,
          reason: `${reasonObj?.label || selectedReason}${details ? ` - Details: ${details.trim()}` : ""}`,
          severity: selectedReason === "financial_scam" ? "Critical" : "High",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedResult({
          autoSuspended: Boolean(data.autoSuspended),
          message: data.message,
        });

        toast({
          title: data.autoSuspended
            ? "Safety Action Taken: Profile Suspended"
            : "Report Submitted",
          description: data.message,
          variant: data.autoSuspended ? "destructive" : "default",
        });

        onReportSuccess?.();
      } else {
        toast({
          title: "Submission Error",
          description: data.error || "Unable to submit report.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Network Error",
        description: "Failed to connect to Trust & Safety moderation service.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setSubmittedResult(null);
    setDetails("");
    setSelectedReason("fake_profile");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <DialogContent className="sm:max-w-[480px] p-6 rounded-3xl bg-[#FFFDF9] border border-amber-200 shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-1">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <DialogTitle className="font-serif-royal text-xl font-bold text-[#2B120C]">
            Report Suspicious Profile
          </DialogTitle>
          <DialogDescription className="text-xs text-[#5C4740]">
            Help safeguard our community by reporting fraudulent activity for{" "}
            <span className="font-bold text-[#2B120C]">{targetUserName}</span>. All reports remain 100% confidential.
          </DialogDescription>
        </DialogHeader>

        {submittedResult ? (
          <div className="py-6 space-y-4 text-center animate-in fade-in">
            <div
              className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center ${
                submittedResult.autoSuspended
                  ? "bg-rose-100 text-rose-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {submittedResult.autoSuspended ? (
                <Lock className="w-7 h-7" />
              ) : (
                <CheckCircle2 className="w-7 h-7" />
              )}
            </div>

            <div>
              <h4 className="font-bold text-base text-[#2B120C]">
                {submittedResult.autoSuspended
                  ? "Profile Automatically Suspended"
                  : "Report Successfully Recorded"}
              </h4>
              <p className="text-xs text-[#5C4740] mt-1 max-w-sm mx-auto leading-relaxed">
                {submittedResult.message}
              </p>
            </div>

            {submittedResult.autoSuspended && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 text-left space-y-1">
                <span className="font-bold block">🛡️ 3-Strike Safety Protocol Triggered:</span>
                <p className="text-[11px] text-rose-700">
                  Because 3 independent verified members reported this account, it has been immediately suspended from all searches and chats pending full administrative compliance review.
                </p>
              </div>
            )}

            <Button
              type="button"
              onClick={handleModalClose}
              className="w-full h-10 rounded-xl bg-[#800020] text-white text-xs font-bold"
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-bold text-[#2B120C] block mb-2">
                Select Reason for Report:
              </Label>
              <RadioGroup
                value={selectedReason}
                onValueChange={setSelectedReason}
                className="space-y-2"
              >
                {REPORT_REASONS.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setSelectedReason(r.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                      selectedReason === r.id
                        ? "bg-rose-50/70 border-rose-300 shadow-xs"
                        : "bg-white border-amber-200 hover:border-amber-300"
                    }`}
                  >
                    <RadioGroupItem value={r.id} id={r.id} className="mt-0.5 text-rose-600" />
                    <div className="space-y-0.5">
                      <Label htmlFor={r.id} className="font-bold text-[#2B120C] cursor-pointer text-xs">
                        {r.label}
                      </Label>
                      <p className="text-[11px] text-[#5C4740] leading-snug">
                        {r.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="report-details" className="text-xs font-bold text-[#2B120C] block mb-1">
                Additional Evidence / Details (Optional):
              </Label>
              <Textarea
                id="report-details"
                placeholder="Mention specific messages, suspicious behavior, or transaction requests..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                maxLength={400}
                rows={3}
                className="rounded-xl border-amber-200 text-xs bg-white resize-none"
              />
              <span className="text-[10px] text-[#8C6D62] text-right block mt-0.5">
                {details.length} / 400 characters
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-[#5C4740] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Community Safety Rule:</strong> When 3 verified members report an account, it is automatically suspended and prioritized for admin review.
              </span>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleModalClose}
                className="h-9 px-4 rounded-xl border-amber-300 text-xs font-semibold text-[#5C4740]"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={submitting}
                onClick={handleSubmitReport}
                className="h-9 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                <Flag className="w-3.5 h-3.5 mr-1.5" />
                {submitting ? "Submitting Report..." : "Submit Confidential Report"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
