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
import { ShieldAlert, AlertCircle } from "lucide-react";

interface ReportUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetProfile: {
    id: string;
    name: string;
  } | null;
  onSubmitReport: (reason: string, category: string) => void;
  reporting?: boolean;
}

export const ReportUserModal: React.FC<ReportUserModalProps> = ({
  open,
  onOpenChange,
  targetProfile,
  onSubmitReport,
  reporting = false,
}) => {
  const [category, setCategory] = useState<string>("Fake Profile");
  const [description, setDescription] = useState<string>("");

  if (!targetProfile) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmitReport(description.trim(), category);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#FFFDF9] border border-amber-200 rounded-3xl p-6">
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="font-serif-royal text-xl font-bold text-rose-800 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            Report {targetProfile.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#5C4740]">
            Help keep Vivah Kar Lo safe. Reports are investigated by human moderators within 2 hours.
          </DialogDescription>
        </DialogHeader>

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
              <option value="Fake Profile">Fake / Inaccurate Profile Information</option>
              <option value="Inappropriate Messages">Inappropriate or Obscene Language</option>
              <option value="Commercial / Scam">Commercial Solicitation / Financial Fraud</option>
              <option value="Already Married">Already Married / Fake Marital Status</option>
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
              minLength={10}
              className="min-h-[90px] rounded-xl border-amber-200 text-xs sm:text-sm bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-amber-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-amber-300 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={reporting || description.trim().length < 10}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm"
            >
              {reporting ? "Submitting Report..." : "Submit Incident Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
