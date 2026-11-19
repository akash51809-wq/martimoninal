import React, { useMemo, useState } from "react";
import { ProfileData, MOCK_PROFILES } from "@/data/mockData";
import { HeroSearchFilters } from "./HeroSection";
import {
  BadgeCheck,
  Briefcase,
  GraduationCap,
  Heart,
  MapPin,
  Sparkles,
  RotateCcw,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CuratedProfilesSectionProps {
  filters: HeroSearchFilters;
  onResetFilters: () => void;
  likedIds: string[];
  onToggleLike: (profile: ProfileData) => void;
  onViewProfile: (profile: ProfileData) => void;
  onOpenRegister: () => void;
}

export const CuratedProfilesSection: React.FC<CuratedProfilesSectionProps> = ({
  filters,
  onResetFilters,
  likedIds,
  onToggleLike,
  onViewProfile,
  onOpenRegister,
}) => {
  const [quickTab, setQuickTab] = useState<
    "all" | "brides" | "grooms" | "kundli"
  >("all");

  const filteredProfiles = useMemo(() => {
    return MOCK_PROFILES.filter((p) => {
      if (quickTab === "brides" && p.gender !== "Female") return false;
      if (quickTab === "grooms" && p.gender !== "Male") return false;
      if (quickTab === "kundli" && p.kundliScore < 31) return false;

      if (filters.lookingFor !== "All" && p.gender !== filters.lookingFor) {
        return false;
      }
      if (p.age < filters.minAge || p.age > filters.maxAge) return false;
      if (
        filters.community !== "All Communities" &&
        !p.caste.toLowerCase().includes(filters.community.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.motherTongue !== "All" &&
        !p.motherTongue
          .toLowerCase()
          .includes(filters.motherTongue.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [filters, quickTab]);

  const hasActiveHeroFilter =
    filters.lookingFor !== "All" ||
    filters.community !== "All Communities" ||
    filters.motherTongue !== "All" ||
    filters.minAge !== 21 ||
    filters.maxAge !== 35;

  return (
    <section
      id="discover"
      className="py-16 sm:py-20 bg-[#FFFDF9] border-t border-amber-100/80"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="space-y-2.5 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest text-[#EA580C]">
              <Sparkles className="w-4 h-4" />
              Curated Verified Alliances
            </span>
            <h2 className="font-serif-royal text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#2B120C]">
              Handpicked Profiles For Your Family
            </h2>
            <p className="text-base sm:text-lg text-[#5C4740]">
              Every profile shown is ID-screened with verified education,
              profession, family background, and Ashtakoot Kundli compatibility.
            </p>
          </div>

          {/* Quick Category Filter Tabs (Horizontal App Swipe on Mobile) */}
          <div className="flex md:flex-wrap items-center gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0">
            {(
              [
                { id: "all", label: "All Curated" },
                { id: "brides", label: "Brides" },
                { id: "grooms", label: "Grooms" },
                { id: "kundli", label: "31+ Gunas Match" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setQuickTab(tab.id)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  quickTab === tab.id
                    ? "bg-[#3B0A18] text-amber-100 border-[#3B0A18] shadow-sm"
                    : "bg-white text-[#5C4740] border-amber-200 hover:border-[#FF7700] hover:text-[#EA580C]"
                }`}
              >
                {tab.label}
              </button>
            ))}

            {hasActiveHeroFilter && (
              <button
                type="button"
                onClick={() => {
                  setQuickTab("all");
                  onResetFilters();
                }}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold text-[#C2410C] bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Mobile App Swipe Hint */}
        {filteredProfiles.length > 1 && (
          <div className="md:hidden flex items-center justify-between text-xs font-semibold text-[#EA580C] mb-3">
            <span>{filteredProfiles.length} Verified Profiles</span>
            <span>Swipe left/right →</span>
          </div>
        )}

        {/* Profiles Grid */}
        {filteredProfiles.length === 0 ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50/40 p-10 text-center space-y-3">
            <p className="font-serif-royal text-xl font-bold text-[#2B120C]">
              No sample profiles match that exact filter combination
            </p>
            <p className="text-sm text-[#5C4740] max-w-md mx-auto">
              Register free to unlock 2.4M+ verified profiles across all
              communities and cities, or reset filters to browse curated matches.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setQuickTab("all");
                  onResetFilters();
                }}
                className="rounded-full border-amber-300 text-[#3B0A18]"
              >
                Show All Curated Profiles
              </Button>
              <Button
                onClick={onOpenRegister}
                className="rounded-full bg-saffron-gradient text-white"
              >
                Register Free
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex md:grid overflow-x-auto snap-x snap-mandatory gap-4 pb-3 -mx-4 px-4 no-scrollbar md:mx-0 md:px-0 md:pb-0 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {filteredProfiles.map((profile) => {
              const isLiked = likedIds.includes(profile.id);
              return (
                <article
                  key={profile.id}
                  className="w-[84vw] max-w-[360px] md:w-auto md:max-w-none shrink-0 snap-center group bg-white rounded-3xl border border-amber-200/80 overflow-hidden shadow-[0_10px_35px_-12px_rgba(124,45,18,0.1)] hover:shadow-[0_20px_50px_-12px_rgba(234,88,12,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Photo Header */}
                  <div
                    onClick={() => onViewProfile(profile)}
                    className="relative aspect-[4/3.6] overflow-hidden bg-[#2C0914] cursor-pointer"
                  >
                    <img
                      src={profile.photos[0]}
                      alt={profile.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F070D]/85 via-transparent to-black/15" />

                    {/* Top Status Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                      {profile.verified && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600/95 backdrop-blur-sm text-white text-xs font-semibold shadow-sm">
                          <BadgeCheck className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[#3B0A18] text-xs font-bold shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                        {profile.kundliScore}/36 Gunas
                      </span>
                    </div>

                    {/* Bottom Name Overlay */}
                    <div className="absolute bottom-3.5 left-4 right-4 text-white">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-serif-royal text-2xl font-bold leading-tight truncate">
                          {profile.name}
                        </h3>
                        <span className="text-xs font-semibold text-amber-200 shrink-0">
                          {profile.profileId}
                        </span>
                      </div>
                      <p className="text-sm text-amber-100/95 mt-1 flex items-center gap-1.5">
                        <span>{profile.age} Yrs</span>
                        <span>•</span>
                        <span>{profile.height.split("-")[1]?.trim() || profile.height}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                          {profile.city}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5 text-sm text-[#4E342E]">
                      <div className="flex items-start gap-2.5">
                        <Briefcase className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                        <span className="font-medium line-clamp-1">
                          {profile.profession} • {profile.income}
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <GraduationCap className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{profile.education}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-xs font-medium text-[#7C2D12]">
                          {profile.caste}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-xs font-medium text-[#7C2D12]">
                          {profile.motherTongue}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-xs font-medium text-[#7C2D12]">
                          {profile.maritalStatus}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-amber-100">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onViewProfile(profile)}
                        className="rounded-xl border-amber-300 text-[#3B0A18] hover:bg-amber-50 text-sm font-semibold h-11"
                      >
                        <Eye className="w-4 h-4 mr-1.5 text-[#EA580C]" />
                        View Profile
                      </Button>
                      <Button
                        type="button"
                        onClick={() => onToggleLike(profile)}
                        className={`rounded-xl text-sm font-semibold h-11 transition-all ${
                          isLiked
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-saffron-gradient hover:opacity-95 text-white shadow-saffron-sm"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 mr-1.5 ${
                            isLiked ? "fill-current" : ""
                          }`}
                        />
                        {isLiked ? "Interest Sent" : "Send Interest"}
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Bottom CTA Strip */}
        <div className="mt-10 text-center">
          <Button
            type="button"
            onClick={onOpenRegister}
            variant="outline"
            className="rounded-full px-7 py-6 border-2 border-[#EA580C] text-[#EA580C] hover:bg-[#EA580C] hover:text-white font-semibold text-sm transition-all"
          >
            Unlock All 2.4M+ Verified Profiles — Register Free
          </Button>
        </div>
      </div>
    </section>
  );
};
