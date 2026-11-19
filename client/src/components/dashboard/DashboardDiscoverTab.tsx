import React, { useMemo, useState } from "react";
import { ProfileData, MOCK_COMMUNITIES, MOCK_LANGUAGES } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  BadgeCheck,
  Sparkles,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Bookmark,
  Eye,
  RotateCcw,
  Sliders,
  Scale,
  Calendar,
  AlertOctagon,
  ShieldAlert,
} from "lucide-react";
import { WatermarkedProtectedImage } from "@/components/security/WatermarkedProtectedImage";
import { ProfileComparisonModal } from "@/components/matching/ProfileComparisonModal";

interface DashboardDiscoverTabProps {
  profiles: ProfileData[];
  sentInterestIds: string[];
  shortlistedIds: string[];
  onViewProfile: (profile: ProfileData) => void;
  onToggleInterest: (profile: ProfileData) => void;
  onToggleShortlist: (profile: ProfileData) => void;
}

export const DashboardDiscoverTab: React.FC<DashboardDiscoverTabProps> = ({
  profiles,
  sentInterestIds,
  shortlistedIds,
  onViewProfile,
  onToggleInterest,
  onToggleShortlist,
}) => {
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState<"All" | "Female" | "Male">("All");
  const [community, setCommunity] = useState("All Communities");
  const [motherTongue, setMotherTongue] = useState("All");
  const [minKundli, setMinKundli] = useState<number>(0);

  // Strict Dealbreakers State
  const [showDealbreakers, setShowDealbreakers] = useState(false);
  const [dealbreakerNonSmoker, setDealbreakerNonSmoker] = useState(false);
  const [dealbreakerVegOnly, setDealbreakerVegOnly] = useState(false);
  const [dealbreakerNonManglik, setDealbreakerNonManglik] = useState(false);
  const [dealbreakerHorizon, setDealbreakerHorizon] = useState<string>("all");

  // Comparison State
  const [comparisonPair, setComparisonPair] = useState<[ProfileData, ProfileData] | null>(null);

  const getProfileHorizon = (p: ProfileData): "3-6months" | "1year" | "family_stage" => {
    const idNum = parseInt(p.id.replace(/\D/g, "") || "1", 10);
    if (idNum % 3 === 0) return "3-6months";
    if (idNum % 3 === 1) return "1year";
    return "family_stage";
  };

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      if (gender !== "All" && p.gender !== gender) return false;
      if (
        community !== "All Communities" &&
        !p.caste.toLowerCase().includes(community.toLowerCase())
      ) {
        return false;
      }
      if (
        motherTongue !== "All" &&
        p.motherTongue.toLowerCase() !== motherTongue.toLowerCase()
      ) {
        return false;
      }
      if (p.kundliScore < minKundli) return false;

      // Dealbreakers check
      if (dealbreakerNonSmoker && p.lifestyle?.smoke && p.lifestyle.smoke.toLowerCase() !== "no") {
        return false;
      }
      if (dealbreakerVegOnly && p.lifestyle?.diet && !p.lifestyle.diet.toLowerCase().includes("veg")) {
        return false;
      }
      if (
        dealbreakerNonManglik &&
        p.manglik &&
        p.manglik.toLowerCase().includes("manglik") &&
        !p.manglik.toLowerCase().includes("non")
      ) {
        return false;
      }
      if (dealbreakerHorizon !== "all") {
        const horizon = getProfileHorizon(p);
        if (horizon !== dealbreakerHorizon) return false;
      }

      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = `${p.name} ${p.city} ${p.state} ${p.profession} ${p.caste} ${p.profileId}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [
    profiles,
    query,
    gender,
    community,
    motherTongue,
    minKundli,
    dealbreakerNonSmoker,
    dealbreakerVegOnly,
    dealbreakerNonManglik,
    dealbreakerHorizon,
  ]);

  const resetAll = () => {
    setQuery("");
    setGender("All");
    setCommunity("All Communities");
    setMotherTongue("All");
    setMinKundli(0);
    setDealbreakerNonSmoker(false);
    setDealbreakerVegOnly(false);
    setDealbreakerNonManglik(false);
    setDealbreakerHorizon("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
            Search &amp; Discover Matches
          </h1>
          <p className="text-sm text-[#5C4740]">
            Filter verified alliances by city, community, language, and Kundli score
          </p>
        </div>
        <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-[#7C2D12] self-start">
          {filtered.length} Profiles Found
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-amber-200/80 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, city, profession, or ID..."
              className="h-11 pl-10 rounded-xl border-amber-200 bg-[#FFFDF9] text-base sm:text-sm"
            />
          </div>

          <select
            aria-label="Filter Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as any)}
            className="h-11 rounded-xl border border-amber-200 bg-[#FFFDF9] px-3 text-base sm:text-sm font-medium"
          >
            <option value="All">Brides &amp; Grooms</option>
            <option value="Female">Brides Only</option>
            <option value="Male">Grooms Only</option>
          </select>

          <select
            aria-label="Filter Community"
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
            className="h-11 rounded-xl border border-amber-200 bg-[#FFFDF9] px-3 text-base sm:text-sm font-medium"
          >
            {MOCK_COMMUNITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter Mother Tongue"
            value={motherTongue}
            onChange={(e) => setMotherTongue(e.target.value)}
            className="h-11 rounded-xl border border-amber-200 bg-[#FFFDF9] px-3 text-base sm:text-sm font-medium"
          >
            <option value="All">All Languages</option>
            {MOCK_LANGUAGES.map((l) => (
              <option key={l.code} value={l.label}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-100">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "Any Kundli", val: 0 },
              { label: "28+ Gunas", val: 28 },
              { label: "32+ Gunas", val: 32 },
            ].map((chip) => (
              <button
                key={chip.val}
                type="button"
                onClick={() => setMinKundli(chip.val)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  minKundli === chip.val
                    ? "bg-[#3B0A18] text-amber-100 border-[#3B0A18]"
                    : "bg-amber-50/70 text-[#5C4740] border-amber-200 hover:border-[#FF7700]"
                }`}
              >
                {chip.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setShowDealbreakers(!showDealbreakers)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                showDealbreakers || dealbreakerNonSmoker || dealbreakerVegOnly || dealbreakerNonManglik || dealbreakerHorizon !== "all"
                  ? "bg-rose-900 text-rose-100 border-rose-900 shadow-xs"
                  : "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              Strict Dealbreakers
              {(dealbreakerNonSmoker || dealbreakerVegOnly || dealbreakerNonManglik || dealbreakerHorizon !== "all") && (
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#EA580C] hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>

        {/* Collapsible Strict Dealbreakers Section */}
        {showDealbreakers && (
          <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200/80 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Strict Dealbreaker Filters (Profiles failing these will never be shown)
              </span>
              <span className="text-[10px] text-rose-700 font-semibold">
                Instant Zero-Tolerance Filtering
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-rose-200 text-xs font-semibold text-rose-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dealbreakerNonSmoker}
                  onChange={(e) => setDealbreakerNonSmoker(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                Strictly Non-Smoker
              </label>

              <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-rose-200 text-xs font-semibold text-rose-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dealbreakerVegOnly}
                  onChange={(e) => setDealbreakerVegOnly(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                Strictly Pure Vegetarian
              </label>

              <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-rose-200 text-xs font-semibold text-rose-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dealbreakerNonManglik}
                  onChange={(e) => setDealbreakerNonManglik(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                Strictly Non-Manglik
              </label>

              <select
                value={dealbreakerHorizon}
                onChange={(e) => setDealbreakerHorizon(e.target.value)}
                className="p-2 bg-white rounded-xl border border-rose-200 text-xs font-semibold text-rose-900 focus:outline-none"
              >
                <option value="all">Any Marriage Horizon</option>
                <option value="3-6months">Marriage in 3-6 Months</option>
                <option value="1year">Within 1 Year</option>
                <option value="family_stage">Family Exploration Stage</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-white border border-amber-200 p-10 text-center space-y-3">
          <p className="font-serif-royal text-xl font-bold text-[#2B120C]">
            No profiles match these filters
          </p>
          <p className="text-sm text-[#5C4740]">
            Try clearing some filters to explore all verified candidates.
          </p>
          <Button
            onClick={resetAll}
            className="rounded-xl bg-saffron-gradient text-white font-semibold"
          >
            Show All Profiles
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((profile, idx) => {
            const isSent = sentInterestIds.includes(profile.id);
            const isSaved = shortlistedIds.includes(profile.id);
            const horizon = getProfileHorizon(profile);
            const comparePartner = filtered[idx === 0 ? 1 : 0] || profile;

            return (
              <article
                key={profile.id}
                className="bg-white rounded-3xl border border-amber-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div
                  onClick={() => onViewProfile(profile)}
                  className="relative aspect-[4/3.4] bg-[#2C0914] cursor-pointer overflow-hidden"
                >
                  <WatermarkedProtectedImage
                    src={profile.photos[0]}
                    alt={profile.name}
                    profileId={profile.profileId || profile.id}
                    viewerUserId="active-member"
                    aspectRatio="aspect-[4/3.4]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F070D]/85 via-transparent to-black/15 pointer-events-none" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
                    {profile.verified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/95 text-white text-xs font-semibold shadow-xs">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleShortlist(profile);
                      }}
                      aria-label="Shortlist profile"
                      className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm border transition-colors shadow-xs ${
                        isSaved
                          ? "bg-[#FF7700] text-white border-[#FF7700]"
                          : "bg-white/90 text-[#3B0A18] border-amber-200"
                      }`}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
                      />
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white z-20 pointer-events-none">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif-royal text-xl font-bold truncate">
                        {profile.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-[#3B0A18] text-[11px] font-bold">
                        <Sparkles className="w-3 h-3 text-[#FF6B00]" />
                        {profile.kundliScore}/36
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-100 mt-0.5 flex items-center gap-1.5">
                      <span>{profile.age} Yrs</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-amber-300" />
                        {profile.city}, {profile.state}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5 text-sm text-[#4E342E]">
                    {/* Marriage Intent / Horizon Badge */}
                    <div className="flex items-center gap-1.5 pb-1">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          horizon === "3-6months"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : horizon === "1year"
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {horizon === "3-6months"
                          ? "Marriage in 3-6 Months"
                          : horizon === "1year"
                          ? "Within 1 Year"
                          : "Family Discussion Stage"}
                      </span>
                    </div>

                    <p className="flex items-center gap-2 truncate font-medium">
                      <Briefcase className="w-4 h-4 text-[#EA580C] shrink-0" />
                      {profile.profession}
                    </p>
                    <p className="flex items-center gap-2 truncate">
                      <GraduationCap className="w-4 h-4 text-[#EA580C] shrink-0" />
                      {profile.education}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-medium text-[#7C2D12]">
                        {profile.caste}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-medium text-[#7C2D12]">
                        {profile.motherTongue}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-medium text-[#7C2D12]">
                        {profile.income}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-amber-100">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onViewProfile(profile)}
                        className="rounded-xl border-amber-300 text-[#3B0A18] hover:bg-amber-50 text-xs sm:text-sm font-semibold h-9"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 text-[#EA580C]" />
                        Profile
                      </Button>
                      <Button
                        type="button"
                        onClick={() => onToggleInterest(profile)}
                        className={`rounded-xl text-xs sm:text-sm font-semibold h-9 ${
                          isSent
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-saffron-gradient text-white shadow-saffron-sm"
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 mr-1 ${
                            isSent ? "fill-current" : ""
                          }`}
                        />
                        {isSent ? "Sent" : "Interest"}
                      </Button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setComparisonPair([profile, comparePartner])}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-bold text-[#7C2D12] hover:text-[#3B0A18] bg-amber-50 hover:bg-amber-100/80 rounded-xl transition-colors border border-amber-200/60"
                    >
                      <Scale className="w-3 h-3 text-[#EA580C]" />
                      Compare Side-by-Side
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {comparisonPair && (
        <ProfileComparisonModal
          isOpen={Boolean(comparisonPair)}
          onClose={() => setComparisonPair(null)}
          candidateA={comparisonPair[0]}
          candidateB={comparisonPair[1]}
        />
      )}
    </div>
  );
};
