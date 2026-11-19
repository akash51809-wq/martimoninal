import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ban, AlertTriangle } from "lucide-react";

interface BlockUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetProfile: {
    id: string;
    name: string;
  } | null;
  onConfirmBlock: (reason: string) => void;
  blocking?: boolean;
}

export const BlockUserModal: React.FC<BlockUserModalProps> = ({
  open,
  onOpenChange,
  targetProfile,
  onConfirmBlock,
  blocking = false,
}) => {
  const [reason, setReason] = useState<string>("Not interested in this alliance");

  if (!targetProfile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#FFFDF9] border border-amber-200 rounded-3xl p-6">
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="font-serif-royal text-xl font-bold text-rose-800 flex items-center gap-2">
            <Ban className="w-5 h-5 text-rose-600" />
            Block {targetProfile.name}?
          </DialogTitle>
          <DialogDescription className="text-xs text-[#5C4740]">
            Blocking will remove this profile from all your matching feeds, search results, and messages.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-3">
          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>
              {targetProfile.name} will not be notified that they have been blocked. They will simply be unable to view your profile or message you.
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#3B0A18] block mb-1">
              Select reason (optional):
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-xs sm:text-sm"
            >
              <option value="Not interested in this alliance">Not interested in this alliance</option>
              <option value="Unwanted communication">Unwanted communication</option>
              <option value="Cultural or lifestyle mismatch">Cultural or lifestyle mismatch</option>
              <option value="Suspicious profile activity">Suspicious profile activity</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-amber-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-amber-300 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={blocking}
              onClick={() => onConfirmBlock(reason)}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
            >
              {blocking ? "Blocking..." : "Confirm Block"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
