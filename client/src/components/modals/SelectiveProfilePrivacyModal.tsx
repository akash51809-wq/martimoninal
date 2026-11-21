import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  X,
  EyeOff,
  ShieldAlert,
  UserX,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Lock,
  Ghost,
} from "lucide-react";

interface SelectiveProfilePrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  currentUserId?: string;
}

export const SelectiveProfilePrivacyModal: React.FC<SelectiveProfilePrivacyModalProps> = ({
  isOpen,
  onClose,
  userId: propUserId,
  currentUserId,
}) => {
  const { toast } = useToast();
  const effectiveUserId = propUserId || currentUserId || "usr-active-complete";
  const [hiddenList, setHiddenList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form Inputs
  const [targetIdInput, setTargetIdInput] = useState<string>("");
  const [targetNameInput, setTargetNameInput] = useState<string>("");
  const [reasonInput, setReasonInput] = useState<string>("Relative / Family Acquaintance");

  const fetchHiddenProfiles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/security/hidden-from/${encodeURIComponent(effectiveUserId)}`);
      const data = await res.json();
      if (data.success && data.hiddenProfiles) {
        setHiddenList(data.hiddenProfiles);
      }
    } catch (err) {
      console.warn("Failed to load stealth hidden list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHiddenProfiles();
    }
  }, [isOpen, effectiveUserId]);

  if (!isOpen) return null;

  const handleHideUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetIdInput.trim()) {
      toast({
        title: "Profile ID Required",
        description: "Please enter the Profile ID or User ID you wish to hide from.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/security/hide-from", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: effectiveUserId,
          targetUserId: targetIdInput.trim(),
          targetUserName: targetNameInput.trim() || undefined,
          targetProfileId: targetIdInput.trim(),
          reason: reasonInput,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to hide profile from user.");
      }

      toast({
        title: "Profile Hidden Successfully 🛡️",
        description: data.message,
      });

      setTargetIdInput("");
      setTargetNameInput("");
      fetchHiddenProfiles();
    } catch (err: any) {
      toast({
        title: "Action Failed",
        description: err.message || "Failed to add stealth exclusion.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnhideUser = async (targetUserId: string) => {
    try {
      const res = await fetch("/api/v1/security/unhide-from", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: effectiveUserId, targetUserId }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to remove exclusion.");
      }

      toast({
        title: "Visibility Restored",
        description: "This member can now view your public profile in accordance with your general privacy settings.",
      });

      fetchHiddenProfiles();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to unhide user.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-[#FFFDF9] rounded-3xl border border-amber-200/90 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-900 via-[#7C2D12] to-amber-900 text-white border-b border-amber-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/20">
              <Ghost className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
                Programme 07 • Selective Stealth Privacy
              </span>
              <h2 className="font-serif-royal text-xl font-bold leading-tight">
                Hide Profile from Selected Users
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Callout */}
        <div className="p-4 bg-amber-50/80 border-b border-amber-200 text-xs text-[#5C4740] flex items-start gap-2.5">
          <EyeOff className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
          <p>
            Members on your stealth list will <strong>never</strong> see your profile in search results, daily recommendations, or direct links. They will not be notified of this action.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Add Excluded User Form */}
          <form onSubmit={handleHideUser} className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-200 space-y-3.5 shadow-sm">
            <h4 className="font-serif-royal text-sm font-bold text-[#2B120C] flex items-center gap-1.5">
              <UserX className="w-4 h-4 text-[#EA580C]" />
              Exclude a Member from Seeing Your Profile
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#5C4740]">
                  Profile ID or Member ID *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. #000004 or 4"
                  value={targetIdInput}
                  onChange={(e) => setTargetIdInput(e.target.value)}
                  className="rounded-xl border-amber-200 text-xs h-9 bg-[#FFFDF9]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#5C4740]">
                  Name or Reference Note (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Relative / Colleague"
                  value={targetNameInput}
                  onChange={(e) => setTargetNameInput(e.target.value)}
                  className="rounded-xl border-amber-200 text-xs h-9 bg-[#FFFDF9]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#5C4740]">
                Reason for Exclusion
              </label>
              <select
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                className="w-full h-9 rounded-xl border border-amber-200 bg-[#FFFDF9] px-3 text-xs font-medium text-[#2B120C] focus:outline-none"
              >
                <option value="Relative / Family Acquaintance">Relative / Family Acquaintance</option>
                <option value="Colleague / Workplace Connection">Colleague / Workplace Connection</option>
                <option value="Ex-Partner / Past Match">Ex-Partner / Past Match</option>
                <option value="Personal Privacy Reason">Personal Privacy Reason</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-10 rounded-xl bg-saffron-gradient text-white font-bold text-xs shadow-saffron-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              {submitting ? "Applying Exclusion..." : "Make My Profile Invisible to This Member"}
            </Button>
          </form>

          {/* Currently Hidden Profiles List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif-royal text-sm font-bold text-[#2B120C] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-700" />
                Active Stealth Exclusions ({hiddenList.length})
              </h4>
              <span className="text-[10px] text-[#5C4740]">100% Guaranteed Invisibility</span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-[#5C4740]">Loading stealth rules...</div>
            ) : hiddenList.length === 0 ? (
              <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-center space-y-1.5">
                <Ghost className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-xs font-bold text-[#2B120C]">No Stealth Exclusions Set</p>
                <p className="text-[11px] text-[#5C4740]">
                  Your profile is visible according to your standard privacy settings. Use the form above to hide from specific people.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {hiddenList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-white border border-amber-200 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#2B120C]">
                          {item.targetUserName || "Confidential Member"}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-[#7C2D12]">
                          ID: {item.targetProfileId || item.targetUserId}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5C4740]">
                        {item.reason} • Added {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnhideUser(item.targetUserId)}
                      className="rounded-xl border-amber-200 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold h-8"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1 text-rose-600" />
                      Unhide
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FFFDF9] border-t border-amber-200/80 flex items-center justify-between">
          <span className="text-[11px] text-[#5C4740]">
            Stealth exclusions are enforced on server-side search APIs.
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-amber-200 text-[#5C4740] hover:bg-amber-50 h-9 text-xs font-semibold"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
