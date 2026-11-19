import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  X,
  Sparkles,
  CheckCircle2,
  Smile,
  Compass,
  ArrowRight,
  ArrowLeft,
  Award,
} from "lucide-react";
import {
  PERSONALITY_QUIZ_QUESTIONS,
  determineArchetype,
  type PersonalityTraits,
} from "../../../../shared/advancedMatchingEngine";

interface PersonalityQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onQuizCompleted?: (updatedProfile: any) => void;
}

export const PersonalityQuizModal: React.FC<PersonalityQuizModalProps> = ({
  isOpen,
  onClose,
  userId = "usr-active-complete",
  onQuizCompleted,
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [traits, setTraits] = useState<PersonalityTraits>({
    socialEnergy: 3,
    lifeOutlook: 3,
    ambition: 3,
    finances: 3,
    familyBoundaries: 3,
  });
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    // Load existing traits if available
    fetch(`/api/v1/matches/personality/${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile?.traits) {
          setTraits(data.profile.traits);
        }
      })
      .catch((err) => console.warn("Failed to load existing personality profile:", err));
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const currentQ = PERSONALITY_QUIZ_QUESTIONS[currentStep];
  const activeArchetype = determineArchetype(traits);

  const handleSelectOption = (dimension: keyof PersonalityTraits, val: number) => {
    setTraits((prev) => ({
      ...prev,
      [dimension]: val,
    }));
  };

  const handleNext = () => {
    if (currentStep < PERSONALITY_QUIZ_QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/matches/personality/${encodeURIComponent(userId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ traits }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to save personality profile.");
      }

      toast({
        title: "Personality Profile Updated! 🌟",
        description: `Your archetype is "${data.profile.archetypeBadge}". Matching recommendations have been calibrated to your values.`,
      });

      if (onQuizCompleted) {
        onQuizCompleted(data.profile);
      }
      onClose();
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "Failed to save personality traits.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-3xl border border-amber-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#7C2D12] via-amber-800 to-[#7C2D12] text-white border-b border-amber-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/20">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
                Programme 04 • Psychometric Assessment
              </span>
              <h2 className="font-serif-royal text-xl font-bold leading-tight">
                Personality & Values Alignment Quiz
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all"
            title="Close quiz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="p-4 bg-amber-50/80 border-b border-amber-200/70">
          <div className="flex items-center justify-between text-xs font-bold text-[#7C2D12] mb-1.5">
            <span>
              Question {currentStep + 1} of {PERSONALITY_QUIZ_QUESTIONS.length}: {currentQ.dimensionName}
            </span>
            <span className="text-amber-700">
              {Math.round(((currentStep + 1) / PERSONALITY_QUIZ_QUESTIONS.length) * 100)}% Completed
            </span>
          </div>
          <div className="w-full h-2 bg-amber-200/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#EA580C] to-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / PERSONALITY_QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question & Options Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
              {currentQ.title}
            </span>
            <h3 className="font-serif-royal text-lg sm:text-xl font-bold text-[#2B120C]">
              {currentQ.question}
            </h3>
          </div>

          {/* Options List */}
          <div className="space-y-2.5">
            {currentQ.options.map((option) => {
              const isSelected = traits[currentQ.id] === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelectOption(currentQ.id, option.value)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? "bg-amber-50/90 border-[#EA580C] shadow-sm ring-1 ring-[#EA580C]"
                      : "bg-white border-amber-200 hover:border-amber-300 hover:bg-amber-50/40"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border transition-all ${
                      isSelected
                        ? "bg-[#EA580C] border-[#EA580C] text-white"
                        : "border-amber-300 bg-white"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div className="space-y-0.5">
                    <span
                      className={`text-sm font-bold block ${
                        isSelected ? "text-[#7C2D12]" : "text-[#2B120C]"
                      }`}
                    >
                      {option.label}
                    </span>
                    <span className="text-xs text-[#5C4740] block">{option.sublabel}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Live Archetype Preview Badge */}
          <div className="mt-4 p-4 rounded-2xl bg-amber-100/60 border border-amber-200 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C2D12]">
                Current Calculated Archetype
              </span>
              <span className="block text-sm font-bold text-[#2B120C]">
                {activeArchetype.archetypeBadge}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 justify-end max-w-xs">
              {activeArchetype.topValues.slice(0, 3).map((val, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-white text-[10px] font-semibold text-[#7C2D12] border border-amber-200"
                >
                  {val}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Action Controls Footer */}
        <div className="p-4 sm:p-5 bg-[#FFFDF9] border-t border-amber-200/80 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="rounded-xl border-amber-200 text-[#5C4740] hover:bg-amber-50"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {currentStep < PERSONALITY_QUIZ_QUESTIONS.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-saffron-gradient text-white font-bold px-5"
              >
                Next Question
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 shadow-sm"
              >
                {saving ? "Saving Traits..." : "Save & Calibrate Matches"}
                <CheckCircle2 className="w-4 h-4 ml-1.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
