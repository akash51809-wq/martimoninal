import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  X,
  Sparkles,
  Heart,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Eye,
} from "lucide-react";

interface SimilarProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseProfileId: string | null;
  baseProfileName?: string;
  onSendInterest?: (profile: any) => void;
  onViewProfile?: (profile: any) => void;
}

export const SimilarProfilesModal: React.FC<SimilarProfilesModalProps> = ({
  isOpen,
  onClose,
  baseProfileId,
  baseProfileName,
  onSendInterest,
  onViewProfile,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [similarProfiles, setSimilarProfiles] = useState<any[]>([]);
  const [baseProfile, setBaseProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !baseProfileId) return;

    setLoading(true);
    setError(null);

    fetch(`/api/v1/search/similar/${encodeURIComponent(baseProfileId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          throw new Error(data.error || "Failed to load similar profiles.");
        }
        setBaseProfile(data.baseProfile);
        setSimilarProfiles(data.similarProfiles || []);
      })
      .catch((err: any) => {
        console.error("Failed to fetch similar profiles:", err);
        setError(err.message || "Failed to generate similar profile suggestions.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, baseProfileId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FFFDF9] rounded-3xl border border-amber-200/90 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-900 via-[#7C2D12] to-amber-900 text-white border-b border-amber-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
                Programme 04 • Smart Recommendations
              </span>
              <h2 className="font-serif-royal text-xl sm:text-2xl font-bold leading-tight">
                Similar Profile Suggestions
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all"
            title="Close suggestions"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Sub-header */}
        <div className="p-4 bg-amber-50/80 border-b border-amber-200 text-xs text-[#5C4740] flex items-center justify-between gap-3">
          <span>
            Showing verified candidates with credential, education, and community parity to{" "}
            <strong className="text-[#2B120C]">{baseProfileName || baseProfile?.name || "Candidate"}</strong>.
          </span>
          <span className="font-bold text-[#EA580C] shrink-0">
            {similarProfiles.length} Similar Alliances
          </span>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-amber-200 border-t-[#EA580C] rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold text-[#5C4740]">
                Scanning alliance database for matching career credentials and cultural parity...
              </p>
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
              <h3 className="font-bold text-rose-900">Suggestions Unavailable</h3>
              <p className="text-xs text-rose-700">{error}</p>
            </div>
          ) : similarProfiles.length === 0 ? (
            <div className="p-12 text-center text-sm text-[#5C4740]">
              No closely matching similar profiles found in this category right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarProfiles.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl border border-amber-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="relative aspect-[4/3] w-full bg-amber-100 overflow-hidden">
                    <img
                      src={p.photos[0] || "/1.jpg"}
                      alt={p.name}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold shadow-xs">
                        {p.similarityPercentage}% Match
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 inset-x-3 text-white">
                      <h4 className="font-serif-royal text-base font-bold truncate">{p.name}</h4>
                      <p className="text-[11px] text-white/90">
                        {p.age} Yrs • {p.city} • {p.caste}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5 flex-1 text-xs">
                    <div className="space-y-1 text-[#3E2723]">
                      <div className="flex items-center gap-1.5 truncate">
                        <Briefcase className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                        <span className="font-semibold truncate">{p.profession}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <GraduationCap className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                        <span className="truncate">{p.education}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1 border-t border-amber-100">
                      {p.similarityReasons.map((reason: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 pt-0 border-t border-amber-100 bg-[#FFFDF9] flex items-center gap-2">
                    {onSendInterest && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onSendInterest(p)}
                        className="flex-1 rounded-xl bg-saffron-gradient text-white font-bold text-xs h-8"
                      >
                        <Heart className="w-3.5 h-3.5 mr-1" />
                        Interest
                      </Button>
                    )}
                    {onViewProfile && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onClose();
                          onViewProfile(p);
                        }}
                        className="rounded-xl border-amber-200 text-[#5C4740] text-xs h-8 px-2.5"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FFFDF9] border-t border-amber-200/80 flex items-center justify-between">
          <span className="text-[11px] text-[#5C4740]">
            Suggestions automatically calculated based on profession, education, community, and lifestyle.
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-amber-200 text-[#5C4740] hover:bg-amber-50 h-9 text-xs font-semibold"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
