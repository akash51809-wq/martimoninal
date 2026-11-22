import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShieldAlert, AlertTriangle, CheckCircle2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetProfile?: {
    id: string;
    name: string;
  } | null;
  reportedUserId?: string;
  reportedUserName?: string;
  currentUserId?: string;
  onSubmitReport?: (reason: string, category: string) => void;
  reporting?: boolean;
}

export const ReportUserModal: React.FC<ReportUserModalProps> = ({
  open,
  onOpenChange,
  targetProfile,
  reportedUserId,
  reportedUserName,
  currentUserId = "usr-current-user",
  onSubmitReport,
  reporting = false,
}) => {
  const { toast } = useToast();
  const [category, setCategory] = useState<string>("Fake Profile");
  const [description, setDescription] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedStatus, setSubmittedStatus] = useState<{
    autoSuspended: boolean;
    message: string;
  } | null>(null);

  const effectiveId = reportedUserId || targetProfile?.id;
  const effectiveName = reportedUserName || targetProfile?.name || "Member";

  if (!effectiveId && !targetProfile) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    if (onSubmitReport) {
      onSubmitReport(description.trim(), category);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/security/report-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reporterId: currentUserId,
          reportedUserId: effectiveId,
          reportedUserName: effectiveName,
          reason: `${category}: ${description.trim()}`,
          severity: category.includes("Financial") || category.includes("Scam") ? "Critical" : "High",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedStatus({
          autoSuspended: Boolean(data.autoSuspended),
          message: data.message,
        });

        toast({
          title: data.autoSuspended
            ? "Safety Action Taken: Profile Suspended"
            : "Report Recorded",
          description: data.message,
          variant: data.autoSuspended ? "destructive" : "default",
        });
      } else {
        toast({
          title: "Report Submission Failed",
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

  const handleClose = () => {
    setSubmittedStatus(null);
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-md bg-[#FFFDF9] border border-amber-200 rounded-3xl p-6">
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="font-serif-royal text-xl font-bold text-rose-800 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            Report {effectiveName}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#5C4740]">
            Help keep Vivah Kar Lo safe and scam-free. All reports are strictly confidential.
          </DialogDescription>
        </DialogHeader>

        {submittedStatus ? (
          <div className="py-4 space-y-3 text-center animate-in fade-in">
            <div
              className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                submittedStatus.autoSuspended
                  ? "bg-rose-100 text-rose-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {submittedStatus.autoSuspended ? (
                <Lock className="w-6 h-6" />
              ) : (
                <CheckCircle2 className="w-6 h-6" />
              )}
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#2B120C]">
                {submittedStatus.autoSuspended
                  ? "Profile Automatically Suspended"
                  : "Report Recorded"}
              </h4>
              <p className="text-xs text-[#5C4740] mt-1">{submittedStatus.message}</p>
            </div>

            {submittedStatus.autoSuspended && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 text-left">
                <strong>🛡️ 3-Strike Community Rule Triggered:</strong> 3 independent verified members have reported this profile. It has been immediately quarantined and removed from public searches.
              </div>
            )}

            <Button
              type="button"
              onClick={handleClose}
              className="w-full h-9 rounded-xl bg-[#800020] text-white text-xs font-bold"
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-[#3B0A18] block mb-1">
                Select Violation Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-xs sm:text-sm"
              >
                <option value="Fake Profile">Fake Profile / Inaccurate Information</option>
                <option value="Financial Scam / Asking for Money">Financial Scam / Asking for Money or UPI</option>
                <option value="Inappropriate Messages">Inappropriate or Obscene Language</option>
                <option value="Already Married">Already Married / False Marital Status</option>
                <option value="Harassment">Harassment or Stalking Behavior</option>
                <option value="Other Violation">Other Platform Policy Violation</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3B0A18] block mb-1">
                Provide Details / Evidence:
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what occurred with specific details..."
                required
                minLength={8}
                className="min-h-[90px] rounded-xl border-amber-200 text-xs sm:text-sm bg-white"
              />
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-[#5C4740] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>3-Strike Protection:</strong> If 3 distinct verified members report a profile, the system automatically suspends the account immediately.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-amber-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="rounded-xl border-amber-300 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={reporting || submitting || description.trim().length < 8}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm"
              >
                {reporting || submitting ? "Submitting Report..." : "Submit Incident Report"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
