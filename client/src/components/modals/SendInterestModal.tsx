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
import { Heart, Sparkles, Send, CheckCircle2 } from "lucide-react";

interface SendInterestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetProfile: {
    id: string;
    profileId?: string;
    name: string;
    age: number;
    city: string;
    photos: string[];
    profession?: string;
  } | null;
  onSend: (message: string) => void;
  sending?: boolean;
}

const PRESET_MESSAGES = [
  "We found your profile and cultural values deeply inspiring. We would be honored to connect.",
  "Your educational qualifications and career ambitions align wonderfully with our family expectations.",
  "We would be pleased to speak with you and your family to take conversations forward.",
  "Our astrological and family background seem very compatible. Looking forward to your response.",
];

export const SendInterestModal: React.FC<SendInterestModalProps> = ({
  open,
  onOpenChange,
  targetProfile,
  onSend,
  sending = false,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [customMessage, setCustomMessage] = useState<string>(PRESET_MESSAGES[0]);

  if (!targetProfile) return null;

  const handleSelectPreset = (idx: number) => {
    setSelectedPreset(idx);
    setCustomMessage(PRESET_MESSAGES[idx]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(customMessage.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#FFFDF9] border border-amber-200 rounded-3xl p-6">
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="font-serif-royal text-xl font-bold text-[#2B120C] flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            Express Matrimonial Interest
          </DialogTitle>
          <DialogDescription className="text-xs text-[#5C4740]">
            Send a polite introduction to {targetProfile.name}&apos;s family.
          </DialogDescription>
        </DialogHeader>

        {/* Profile Snapshot Header */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 mt-2">
          <img
            src={targetProfile.photos?.[0] || "/1.jpg"}
            alt={targetProfile.name}
            className="w-12 h-12 rounded-xl object-cover object-top border border-amber-300"
          />
          <div>
            <h4 className="font-serif-royal text-sm font-bold text-[#2B120C]">
              {targetProfile.name}, {targetProfile.age}
            </h4>
            <p className="text-xs text-[#5C4740]">
              {targetProfile.profession} • {targetProfile.city}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-3">
          {/* Quick Preset Messages */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#3B0A18] block">
              Choose a Personalized Introduction:
            </label>
            <div className="space-y-2">
              {PRESET_MESSAGES.map((msg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(idx)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border ${
                    selectedPreset === idx
                      ? "bg-amber-100/70 border-amber-400 font-semibold text-[#2B120C]"
                      : "bg-white border-amber-200/70 text-[#5C4740] hover:bg-amber-50"
                  }`}
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>

          {/* Editable Text Area */}
          <div>
            <label className="text-xs font-semibold text-[#3B0A18] block mb-1">
              Customize or Add Family Note:
            </label>
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              maxLength={300}
              className="min-h-[80px] rounded-xl border-amber-200 text-xs sm:text-sm bg-white"
            />
            <div className="flex justify-between text-[11px] text-[#7C2D12] mt-1">
              <span>Warm introductions receive 2.5X faster response</span>
              <span>{customMessage.length}/300</span>
            </div>
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
              disabled={sending || !customMessage.trim()}
              className="rounded-xl bg-saffron-gradient text-white text-xs font-semibold shadow-saffron-sm hover:opacity-95"
            >
              {sending ? (
                <span>Dispatching...</span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  Send Interest
                </span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
