import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  X,
  Scale,
  Sparkles,
  Heart,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Award,
  Crown,
} from "lucide-react";

interface ProfileComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileIds: string[];
  onSendInterest?: (profile: any) => void;
  onViewProfile?: (profile: any) => void;
}

export const ProfileComparisonModal: React.FC<ProfileComparisonModalProps> = ({
  isOpen,
  onClose,
  profileIds,
  onSendInterest,
  onViewProfile,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || profileIds.length < 2) return;

    setLoading(true);
    setError(null);

    const idsParam = profileIds.join(",");
    fetch(`/api/v1/search/compare?ids=${encodeURIComponent(idsParam)}`)
      .then((res) => res.json())
      .then((resData) => {
        if (!resData.success) {
          throw new Error(resData.error || "Failed to load comparison matrix.");
        }
        setData(resData);
      })
      .catch((err: any) => {
        console.error("Comparison load error:", err);
        setError(err.message || "Failed to compare selected profiles.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, profileIds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#FFFDF9] rounded-3xl border border-amber-200/90 shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-900 via-[#7C2D12] to-amber-900 text-white border-b border-amber-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
                Programme 04 • Multi-Alliance Evaluation
              </span>
              <h2 className="font-serif-royal text-xl sm:text-2xl font-bold leading-tight">
                Side-by-Side Profile Comparison
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all"
            title="Close comparison"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-amber-200 border-t-[#EA580C] rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold text-[#5C4740]">
                Synthesizing multi-profile matrix across education, astrology, and background...
              </p>
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
              <h3 className="font-bold text-rose-900">Comparison Unavailable</h3>
              <p className="text-xs text-rose-700">{error}</p>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Profile Top Cards Grid */}
              <div className={`grid grid-cols-1 gap-4 ${data.profiles.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
                {data.profiles.map((p: any) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-3xl bg-white border border-amber-200 shadow-sm flex flex-col justify-between space-y-3 hover:border-amber-300 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.photos[0] || "/1.jpg"}
                        alt={p.name}
                        className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-amber-300 shrink-0"
                      />
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-[#7C2D12]">
                          {p.profileId}
                        </span>
                        <h4 className="font-serif-royal text-base font-bold text-[#2B120C] truncate mt-0.5">
                          {p.name}
                        </h4>
                        <p className="text-xs text-[#5C4740] truncate">
                          {p.age} Yrs • {p.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-amber-100">
                      {onSendInterest && (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => onSendInterest(p)}
                          className="flex-1 rounded-xl bg-saffron-gradient text-white font-bold text-[11px] h-8"
                        >
                          <Heart className="w-3.5 h-3.5 mr-1" />
                          Send Interest
                        </Button>
                      )}
                      {onViewProfile && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onViewProfile(p)}
                          className="rounded-xl border-amber-200 text-[#5C4740] text-[11px] h-8 px-2.5"
                        >
                          Biodata
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Matrix Table: Education & Career */}
              <div className="bg-white rounded-3xl border border-amber-200 overflow-hidden shadow-sm">
                <div className="px-5 py-3 bg-amber-50/90 border-b border-amber-200 text-xs font-bold text-[#7C2D12] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#EA580C]" />
                  <span>Education & Career Comparison</span>
                </div>
                <div className="divide-y divide-amber-100 text-xs">
                  {data.comparisonMatrix.educationCareer.map((row: any, i: number) => (
                    <div
                      key={i}
                      className="px-5 py-3 grid grid-cols-12 gap-3 items-center hover:bg-amber-50/40"
                    >
                      <span className="col-span-3 sm:col-span-3 font-bold text-[#2B120C]">
                        {row.label}
                      </span>
                      <div className="col-span-9 sm:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {row.values.map((val: string, vIdx: number) => (
                          <span
                            key={vIdx}
                            className={`truncate font-medium ${
                              val.includes("Premier") || val.includes("Govt")
                                ? "text-emerald-700 font-bold"
                                : "text-[#5C4740]"
                            }`}
                          >
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matrix Table: Community & Astrology */}
              <div className="bg-white rounded-3xl border border-amber-200 overflow-hidden shadow-sm">
                <div className="px-5 py-3 bg-amber-50/90 border-b border-amber-200 text-xs font-bold text-[#7C2D12] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#EA580C]" />
                  <span>Community, Horoscope &amp; Guna Milan</span>
                </div>
                <div className="divide-y divide-amber-100 text-xs">
                  {data.comparisonMatrix.communityAstro.map((row: any, i: number) => (
                    <div
                      key={i}
                      className="px-5 py-3 grid grid-cols-12 gap-3 items-center hover:bg-amber-50/40"
                    >
                      <span className="col-span-3 sm:col-span-3 font-bold text-[#2B120C]">
                        {row.label}
                      </span>
                      <div className="col-span-9 sm:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {row.values.map((val: string, vIdx: number) => (
                          <span
                            key={vIdx}
                            className={`truncate font-medium ${
                              val.includes("32") || val.includes("30") || val.includes("Non-Manglik")
                                ? "text-emerald-700 font-bold"
                                : "text-[#5C4740]"
                            }`}
                          >
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matrix Table: Lifestyle & Habits */}
              <div className="bg-white rounded-3xl border border-amber-200 overflow-hidden shadow-sm">
                <div className="px-5 py-3 bg-amber-50/90 border-b border-amber-200 text-xs font-bold text-[#7C2D12] flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#EA580C]" />
                  <span>Lifestyle, Diet &amp; Personal Habits</span>
                </div>
                <div className="divide-y divide-amber-100 text-xs">
                  {data.comparisonMatrix.lifestyleFamily.map((row: any, i: number) => (
                    <div
                      key={i}
                      className="px-5 py-3 grid grid-cols-12 gap-3 items-center hover:bg-amber-50/40"
                    >
                      <span className="col-span-3 sm:col-span-3 font-bold text-[#2B120C]">
                        {row.label}
                      </span>
                      <div className="col-span-9 sm:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {row.values.map((val: string, vIdx: number) => (
                          <span key={vIdx} className="truncate text-[#5C4740] font-medium">
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FFFDF9] border-t border-amber-200/80 flex items-center justify-between">
          <span className="text-[11px] text-[#5C4740]">
            Comparing {profileIds.length} candidate alliances across verified background criteria.
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-amber-200 text-[#5C4740] hover:bg-amber-50 h-9 text-xs font-semibold"
          >
            Close Matrix
          </Button>
        </div>
      </div>
    </div>
  );
};
