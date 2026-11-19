import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { MatchFeedCategory, MatchProfileItem } from "@/types/matchAndSearchTypes";
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Clock,
  HeartHandshake,
  MapPin,
  Briefcase,
  GraduationCap,
  SlidersHorizontal,
  Bookmark,
  MessageCircle,
  Eye,
  CheckCircle2,
  AlertCircle,
  Filter,
  TrendingUp,
  Smile,
  ArrowUpDown,
  Compass,
  Award,
  ThumbsUp,
  Star,
  Undo2,
  X,
} from "lucide-react";
import { CompatibilityDeepDiveModal } from "./CompatibilityDeepDiveModal";
import { PersonalityQuizModal } from "./PersonalityQuizModal";

interface SmartMatchingViewProps {
  userId?: string;
  isVipMember?: boolean;
  onViewProfile: (profile: any) => void;
  onEditPreferences?: () => void;
  onOpenChat?: (profileId: string) => void;
}

export type SortByOption = "smart_rank" | "success_prob" | "mutual_fit" | "compatibility" | "kundli" | "relevance";

export const SmartMatchingView: React.FC<SmartMatchingViewProps> = ({
  userId = "usr-active-complete",
  isVipMember = false,
  onViewProfile,
  onEditPreferences,
  onOpenChat,
}) => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<MatchFeedCategory>("daily");
  const [sortBy, setSortBy] = useState<SortByOption>("smart_rank");
  const [hideDealbreakers, setHideDealbreakers] = useState<boolean>(false);
  const [matches, setMatches] = useState<MatchProfileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // User interaction states
  const [sentInterests, setSentInterests] = useState<string[]>([]);
  const [shortlisted, setShortlisted] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>(["5"]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(["1", "2"]);

  // Feature #19: Pass & Limited Undo Last Pass State
  const [passedIds, setPassedIds] = useState<string[]>([]);
  const [lastPassed, setLastPassed] = useState<{ targetUserId: string; targetName: string } | null>(null);
  const [remainingUndos, setRemainingUndos] = useState<number>(isVipMember ? 999 : 3);
  const [dailyUndoLimit, setDailyUndoLimit] = useState<string | number>(isVipMember ? "Unlimited" : 3);
  const [undoLoading, setUndoLoading] = useState<boolean>(false);

  // Modals state
  const [deepDiveCandidate, setDeepDiveCandidate] = useState<{ id: string; name: string } | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [userArchetype, setUserArchetype] = useState<string>("⚖️ Balanced Realist");

  const fetchMatches = async (
    category: MatchFeedCategory,
    sort: SortByOption,
    strictDealbreakers = hideDealbreakers
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/v1/matches/recommendations?userId=${encodeURIComponent(
          userId
        )}&category=${category}&sortBy=${sort}&hideDealbreakers=${strictDealbreakers}`
      );
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to load matches");
      }
      setMatches(data.matches || []);
    } catch (err: any) {
      console.warn("Falling back to local matching:", err);
      setError("Server connection notice: showing local verified matching snapshot.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPersonality = async () => {
    try {
      const res = await fetch(`/api/v1/matches/personality/${encodeURIComponent(userId)}`);
      const data = await res.json();
      if (data.success && data.profile) {
        setUserArchetype(data.profile.archetypeBadge || "⚖️ Balanced Realist");
      }
    } catch (e) {
      console.warn("Could not fetch personality:", e);
    }
  };

  useEffect(() => {
    fetchMatches(activeCategory, sortBy, hideDealbreakers);
  }, [activeCategory, sortBy, hideDealbreakers, userId]);

  useEffect(() => {
    fetchUserPersonality();
    fetch(`/api/v1/activity/pass-status?userId=${encodeURIComponent(userId)}&isVip=${isVipMember}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setPassedIds(d.passedProfileIds || []);
          setLastPassed(d.lastPassed || null);
          setRemainingUndos(d.remainingUndos ?? (isVipMember ? 999 : 3));
          setDailyUndoLimit(d.dailyLimit ?? (isVipMember ? "Unlimited" : 3));
        }
      })
      .catch(() => {});
  }, [userId, isVipMember]);

  const handleToggleLike = async (profile: MatchProfileItem) => {
    const isLiked = likedIds.includes(profile.id);
    setLikedIds((prev) =>
      isLiked ? prev.filter((id) => id !== profile.id) : [...prev, profile.id]
    );
    try {
      const res = await fetch("/api/v1/activity/likes/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, targetUserId: profile.id }),
      });
      const data = await res.json();
      toast({
        title: data.liked ? `Liked ${profile.name}` : `Removed Like for ${profile.name}`,
        description: data.isMutualLike
          ? "It's a Mutual Like! Send an interest to begin chatting."
          : undefined,
      });
    } catch {
      toast({ title: isLiked ? "Like removed" : `Liked ${profile.name}` });
    }
  };

  const handleToggleFavorite = (profile: MatchProfileItem) => {
    const isFav = favoriteIds.includes(profile.id);
    setFavoriteIds((prev) =>
      isFav ? prev.filter((id) => id !== profile.id) : [...prev, profile.id]
    );
    fetch("/api/v1/activity/favorites/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, targetUserId: profile.id }),
    }).catch(() => {});
    toast({
      title: isFav ? `Removed ${profile.name} from Favorites` : `Starred ${profile.name} in Favorites`,
    });
  };

  const handlePassProfile = async (profile: MatchProfileItem) => {
    setPassedIds((prev) => (prev.includes(profile.id) ? prev : [...prev, profile.id]));
    setLastPassed({ targetUserId: profile.id, targetName: profile.name });
    try {
      await fetch("/api/v1/activity/pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          targetUserId: profile.id,
          targetName: profile.name,
        }),
      });
    } catch {
      // Handled locally
    }
    toast({
      title: `Passed ${profile.name}`,
      description: isVipMember
        ? "Profile hidden from feed. Click 'Undo Last Pass' anytime (VIP Unlimited)."
        : `Profile hidden. You have ${remainingUndos} free Undo(s) remaining today.`,
    });
  };

  const handleUndoLastPass = async () => {
    if (!lastPassed && passedIds.length === 0) return;
    setUndoLoading(true);
    try {
      const res = await fetch("/api/v1/activity/undo-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isVip: isVipMember }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast({
          title: data.limitReached ? "Daily Undo Limit Reached" : "Cannot Undo Pass",
          description: data.error || "Upgrade to VIP for unlimited Undo Last Pass.",
          variant: "destructive",
        });
        return;
      }

      const restoredId = data.restoredProfile?.targetUserId;
      if (restoredId) {
        setPassedIds((prev) => prev.filter((id) => id !== restoredId));
      }
      setRemainingUndos(data.remainingUndos);
      setDailyUndoLimit(data.dailyLimit);
      // Refresh remaining stack top
      const statusRes = await fetch(
        `/api/v1/activity/pass-status?userId=${encodeURIComponent(userId)}&isVip=${isVipMember}`
      );
      const statusData = await statusRes.json();
      if (statusData.success) {
        setLastPassed(statusData.lastPassed || null);
      }

      toast({
        title: "Last Pass Undone!",
        description: data.message,
      });
    } catch {
      toast({ title: "Undo request failed", variant: "destructive" });
    } finally {
      setUndoLoading(false);
    }
  };

  const handleToggleInterest = (profile: MatchProfileItem) => {
    const isSent = sentInterests.includes(profile.id);
    if (isSent) {
      setSentInterests((prev) => prev.filter((id) => id !== profile.id));
      toast({
        title: "Interest Request Withdrawn",
        description: `Cancelled interest request for ${profile.name}.`,
      });
    } else {
      setSentInterests((prev) => [...prev, profile.id]);
      toast({
        title: "Interest Expressed! 💖",
        description: `Your interest request was sent to ${profile.name}. You'll be notified when they accept.`,
      });
    }
  };

  const handleToggleShortlist = (profile: MatchProfileItem) => {
    const isSaved = shortlisted.includes(profile.id);
    if (isSaved) {
      setShortlisted((prev) => prev.filter((id) => id !== profile.id));
      toast({
        title: "Removed from Shortlist",
        description: `${profile.name} removed from your saved profiles.`,
      });
    } else {
      setShortlisted((prev) => [...prev, profile.id]);
      toast({
        title: "Profile Shortlisted ⭐",
        description: `${profile.name} has been added to your shortlist.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EA580C]">
            <HeartHandshake className="w-4 h-4" />
            <span>Programme 03 • AI Smart Recommendations Engine</span>
          </div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C] mt-1">
            Smart Matching Recommendations
          </h1>
          <p className="text-sm text-[#5C4740] mt-1">
            Algorithmic matchmaking synthesizing Vedic Ashtakoot, multidimensional lifestyle, psychometrics, and 2-way preferences.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Personality Quiz Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsQuizOpen(true)}
            className="rounded-xl border-purple-200 bg-purple-50/70 text-purple-900 hover:bg-purple-100 h-10 px-3.5 text-xs font-bold shadow-sm"
          >
            <Smile className="w-4 h-4 mr-1.5 text-purple-600" />
            <span>Values Quiz ({userArchetype.split(" ")[0]})</span>
          </Button>

          {/* Edit Criteria */}
          {onEditPreferences && (
            <Button
              type="button"
              variant="outline"
              onClick={onEditPreferences}
              className="rounded-xl border-amber-300 bg-white text-[#3B0A18] hover:bg-amber-50 h-10 px-3.5 text-xs font-bold shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 mr-1.5 text-[#EA580C]" />
              Partner Criteria
            </Button>
          )}

          {/* Dynamic Sort Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-xs shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#EA580C]" />
            <span className="font-bold text-[#7C2D12]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortByOption)}
              aria-label="Sort match recommendations"
              className="bg-transparent font-semibold text-[#2B120C] focus:outline-none cursor-pointer"
            >
              <option value="smart_rank">AI Smart Rank (Best Fit)</option>
              <option value="relevance">Profile Relevance Score</option>
              <option value="success_prob">Match Success Probability</option>
              <option value="mutual_fit">2-Way Mutual Harmony</option>
              <option value="compatibility">Partner Criteria Match</option>
              <option value="kundli">Vedic Kundli Guna (36)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setHideDealbreakers(!hideDealbreakers)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              hideDealbreakers
                ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                : "bg-white text-rose-800 border-rose-200 hover:bg-rose-50"
            }`}
          >
            {hideDealbreakers ? "✓ Strict Dealbreakers Active" : "Filter Dealbreakers"}
          </button>
        </div>
      </div>

      {/* 14 Smart Matching Lenses Pill Bar */}
      <div className="p-2 bg-amber-50/80 rounded-2xl border border-amber-200/90 flex flex-wrap gap-1.5">
        {(
          [
            { id: "daily", label: "Daily Top 10" },
            { id: "best", label: "Best AI Matches" },
            { id: "mutual", label: "Mutual Matches" },
            { id: "new", label: "New Matches" },
            { id: "recently_active", label: "Recently Active" },
            { id: "nearby", label: "Nearby Matches" },
            { id: "same_community", label: "Same Community" },
            { id: "similar_education", label: "Similar Education" },
            { id: "similar_career", label: "Similar Career" },
            { id: "family_compat", label: "Family Compatibility" },
            { id: "horoscope", label: "Horoscope Matches" },
            { id: "lifestyle", label: "Lifestyle & Interests" },
            { id: "values_goals", label: "Values & Marriage Goals" },
            { id: "verified", label: "Verified Only" },
          ] as Array<{ id: MatchFeedCategory; label: string }>
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === tab.id
                ? "bg-[#3B0A18] text-amber-100 shadow-sm"
                : "bg-white/80 text-[#5C4740] border border-amber-200/70 hover:text-[#2B120C] hover:bg-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed Description & Sorting Status Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2.5 rounded-xl bg-white border border-amber-200/80 text-xs text-[#5C4740] gap-2">
        <span className="font-semibold text-[#2B120C]">
          {activeCategory === "daily" &&
            "AI Daily Recommended Matches: Ranked by composite Smart Rank, preferences & astrological harmony."}
          {activeCategory === "best" &&
            "Best AI Matches: Highest overall compatibility alliances scoring 82%+ across core pillars."}
          {activeCategory === "mutual" &&
            "100% Mutual Harmony: Where both members fulfill each other's reciprocal partner expectations."}
          {activeCategory === "new" &&
            "New Matches: Recently registered members who joined in the last 7 to 14 days."}
          {activeCategory === "recently_active" &&
            "Recently Active Matches: Members currently online or active recently for faster responses."}
          {activeCategory === "nearby" &&
            "Nearby Matches: Alliances residing in your city or home state for convenient family meetings."}
          {activeCategory === "same_community" &&
            "Same Community Matches: Alliances sharing your religion, cultural background, or community."}
          {activeCategory === "similar_education" &&
            "Similar Education Matches: Premier institute alumni and matching academic qualification tiers."}
          {activeCategory === "similar_career" &&
            "Similar Career Matches: Comparable professional trajectory, corporate/govt sector, and income."}
          {activeCategory === "family_compat" &&
            "Family Compatibility Matches: Strong alignment in family structure, values, and social outlook."}
          {activeCategory === "horoscope" &&
            "Horoscope-Based Matches: High Vedic Ashtakoot Kundli Milan scores (26+/36 Gunas)."}
          {activeCategory === "lifestyle" &&
            "Lifestyle & Interest Matches: Aligned dietary habits, wellness lifestyle, and shared hobbies."}
          {activeCategory === "values_goals" &&
            "Values & Marriage Goal Matches: Aligned on marriage timeline, family responsibilities, and life vision."}
          {activeCategory === "verified" &&
            "100% Verified Profiles: Government ID badge & phone/email verified candidates."}
        </span>
        <div className="flex items-center gap-3 self-end sm:self-auto font-bold text-[#EA580C]">
          <span>Sorted By: {sortBy.replace("_", " ").toUpperCase()}</span>
          <span>•</span>
          <span>{loading ? "Matching..." : `${matches.length} Matches Found`}</span>
        </div>
      </div>

      {/* Feature #19: Undo Last Pass Bar (Limited Free Quota / VIP Unlimited) */}
      {(lastPassed || passedIds.length > 0) && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#3B0A18] to-[#5C1024] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5 text-xs">
            <Undo2 className="w-4 h-4 text-amber-300 shrink-0" />
            <div>
              <p className="font-bold">
                {lastPassed
                  ? `Recently Passed: ${lastPassed.targetName}`
                  : `${passedIds.length} Profile(s) Passed`}
              </p>
              <p className="text-[11px] text-amber-200/90">
                {isVipMember
                  ? "VIP Privilege: Unlimited Undo Last Pass available."
                  : `Free Quota: ${remainingUndos} of ${dailyUndoLimit} daily Undo(s) remaining today.`}
              </p>
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            disabled={undoLoading || (!isVipMember && remainingUndos <= 0)}
            onClick={handleUndoLastPass}
            className="h-9 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#3B0A18] font-bold text-xs shrink-0 disabled:opacity-60"
          >
            <Undo2 className="w-3.5 h-3.5 mr-1.5" />
            {undoLoading
              ? "Restoring..."
              : !isVipMember && remainingUndos <= 0
              ? "Daily Limit Reached (Upgrade VIP)"
              : "Undo Last Pass"}
          </Button>
        </div>
      )}

      {/* Profiles Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-amber-200 border-t-[#EA580C] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#5C4740]">
            Running Smart Recommendation Algorithm...
          </p>
        </div>
      ) : matches.filter((m) => !passedIds.includes(m.id)).length === 0 ? (
        <div className="bg-white rounded-3xl border border-amber-200 p-12 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="font-serif-royal text-xl font-bold text-[#2B120C]">
            No Matches Found In This Feed
          </h3>
          <p className="text-sm text-[#5C4740] max-w-md mx-auto">
            Try adjusting your partner preferences (such as age range, minimum income, or preferred cities) to discover more alliances.
          </p>
          {onEditPreferences && (
            <Button
              type="button"
              onClick={onEditPreferences}
              className="rounded-xl bg-saffron-gradient text-white font-semibold"
            >
              Adjust Preferences
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {matches
            .filter((m) => !passedIds.includes(m.id))
            .map((profile) => {
              const hasSent = sentInterests.includes(profile.id);
              const isSaved = shortlisted.includes(profile.id);
              const isLiked = likedIds.includes(profile.id);
              const isFav = favoriteIds.includes(profile.id);

            return (
              <div
                key={profile.id}
                className="group bg-white rounded-3xl border border-amber-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] w-full bg-amber-100 overflow-hidden">
                  <img
                    src={profile.photos[0] || "/1.jpg"}
                    alt={profile.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/35" />

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
                      ID: {profile.profileId}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {profile.verified && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-[11px] font-bold text-white shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      )}
                      {profile.isNewMember && (
                        <span className="px-2.5 py-1 rounded-full bg-orange-600/90 backdrop-blur-md text-[11px] font-bold text-white">
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* AI Smart Rank & Success Probability Pills */}
                  <div className="absolute top-12 left-3 flex flex-col gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#7C2D12] text-[10px] font-extrabold border border-amber-200 shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#EA580C]" />
                      Smart Rank: {profile.smartRankScore || profile.matchScore} pts
                    </span>

                    {profile.successProbability && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-extrabold shadow-sm flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {profile.successProbability}% Success Probability
                      </span>
                    )}
                  </div>

                  {/* Bottom Header on Image */}
                  <div className="absolute bottom-3 inset-x-3 text-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif-royal text-xl font-bold leading-tight drop-shadow-sm">
                        {profile.name}
                      </h3>
                      <span className="px-2.5 py-1 rounded-full bg-amber-400 text-[#3B0A18] font-bold text-xs shadow-md">
                        {profile.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-xs text-white/90 drop-shadow-sm mt-0.5">
                      {profile.age} Yrs • {profile.height} • {profile.caste}
                    </p>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 sm:p-5 space-y-3.5 flex-1">
                  {/* Profession & Education */}
                  <div className="space-y-1.5 text-xs text-[#3E2723]">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                      <span className="font-semibold truncate">
                        {profile.profession}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                      <span className="truncate">{profile.education}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                      <span>
                        {profile.city}, {profile.state}
                        {profile.country !== "India" && ` (${profile.country})`}
                      </span>
                    </div>
                  </div>

                  {/* Personality & Mutual Match Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {profile.personalityBadge && (
                      <span className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-[11px] font-bold text-purple-800">
                        {profile.personalityBadge}
                      </span>
                    )}

                    {profile.twoWayMutualScore !== undefined && (
                      <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-[11px] font-bold text-rose-800">
                        💞 {profile.isMutualMatch ? "100% Mutual Fit" : `${profile.twoWayMutualScore}% Mutual Fit`}
                      </span>
                    )}

                    <span className="px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-[11px] font-bold text-[#EA580C]">
                      ✨ Kundli: {profile.kundliScore}/36
                    </span>

                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-[11px] font-bold text-[#7C2D12]">
                      💰 {profile.income}
                    </span>
                  </div>

                  {/* Multidimensional Quick Harmony Bars */}
                  {profile.multidimensionalScore && (
                    <div className="p-2.5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#7C2D12]">
                        <span>Lifestyle: {profile.multidimensionalScore.lifestyle.score}%</span>
                        <span>Family: {profile.multidimensionalScore.family.score}%</span>
                        <span>Career: {profile.multidimensionalScore.educationCareer.score}%</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                        <div
                          className="bg-[#EA580C] rounded-l-full"
                          style={{ width: `${profile.multidimensionalScore.lifestyle.score}%` }}
                        />
                        <div
                          className="bg-amber-500"
                          style={{ width: `${profile.multidimensionalScore.family.score}%` }}
                        />
                        <div
                          className="bg-emerald-500 rounded-r-full"
                          style={{ width: `${profile.multidimensionalScore.educationCareer.score}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* AI Match Explanation, Relevance & Dealbreaker Strip */}
                  <div className="pt-2 border-t border-amber-100 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-bold">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100/80 text-[#7C2D12]">
                        Relevance: {profile.profileRelevanceScore ?? profile.matchScore}%
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200">
                        Goals: {profile.marriageGoalScore ?? 88}%
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
                        Values: {profile.valuesScore ?? 86}%
                      </span>
                      {profile.dealbreakerPassed !== undefined && (
                        <span
                          className={`px-2 py-0.5 rounded-md border ${
                            profile.dealbreakerPassed
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {profile.dealbreakerPassed ? "Dealbreakers ✓" : "Dealbreaker Alert"}
                        </span>
                      )}
                    </div>

                    {(profile.matchExplanation || profile.matchReasons) && (
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#7C2D12] mb-1">
                          AI Match Explanation:
                        </span>
                        <ul className="space-y-1">
                          {(profile.matchExplanation || profile.matchReasons)
                            .slice(0, 2)
                            .map((reason, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-1.5 text-[11px] text-[#3E2723] leading-snug"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{reason}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Compatibility Deep Dive Trigger Strip */}
                <div className="px-4 pb-2">
                  <button
                    type="button"
                    onClick={() => setDeepDiveCandidate({ id: profile.id, name: profile.name })}
                    className="w-full py-1.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-[11px] font-bold text-[#7C2D12] flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Deep Dive Full Compatibility Breakdown</span>
                  </button>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 pt-1 border-t border-amber-100 bg-[#FFFDF9] flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handlePassProfile(profile)}
                    className="h-10 w-10 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 shrink-0"
                    title="Pass / Skip Profile (Can Undo)"
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  <Button
                    type="button"
                    onClick={() => handleToggleInterest(profile)}
                    className={`flex-1 h-10 rounded-xl text-xs font-bold transition-all ${
                      hasSent
                        ? "bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100"
                        : "bg-saffron-gradient text-white shadow-saffron-sm hover:opacity-95"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 mr-1 ${
                        hasSent ? "fill-rose-600" : ""
                      }`}
                    />
                    {hasSent ? "Sent" : "Interest"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleToggleLike(profile)}
                    className={`h-10 w-9 rounded-xl border-amber-200 hover:bg-rose-50 shrink-0 ${
                      isLiked ? "text-rose-600 border-rose-300 bg-rose-50" : "text-[#5C4740]"
                    }`}
                    title={isLiked ? "Liked Profile" : "Like Profile"}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-500" : ""}`} />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleToggleFavorite(profile)}
                    className={`h-10 w-9 rounded-xl border-amber-200 hover:bg-amber-50 shrink-0 ${
                      isFav ? "text-amber-500 border-amber-300 bg-amber-50" : "text-[#5C4740]"
                    }`}
                    title={isFav ? "In Favorites" : "Add to Favorites"}
                  >
                    <Star className={`w-3.5 h-3.5 ${isFav ? "fill-amber-400" : ""}`} />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleToggleShortlist(profile)}
                    className={`h-10 w-9 rounded-xl border-amber-200 hover:bg-amber-50 shrink-0 ${
                      isSaved ? "text-amber-600 fill-amber-500" : "text-[#5C4740]"
                    }`}
                    title={isSaved ? "Saved in Shortlist" : "Bookmark shortlist"}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${isSaved ? "fill-amber-500" : ""}`}
                    />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onViewProfile(profile)}
                    className="h-10 w-9 rounded-xl border-amber-200 text-[#5C4740] hover:bg-amber-50 shrink-0"
                    title="View full biodata"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compatibility Deep Dive Modal */}
      {deepDiveCandidate && (
        <CompatibilityDeepDiveModal
          isOpen={!!deepDiveCandidate}
          onClose={() => setDeepDiveCandidate(null)}
          viewerId={userId}
          candidateId={deepDiveCandidate.id}
          candidateName={deepDiveCandidate.name}
          onSendInterest={() => {
            const prof = matches.find((m) => m.id === deepDiveCandidate.id);
            if (prof) handleToggleInterest(prof);
          }}
          hasSentInterest={sentInterests.includes(deepDiveCandidate.id)}
        />
      )}

      {/* Personality & Values Quiz Modal */}
      <PersonalityQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        userId={userId}
        onQuizCompleted={(updatedProfile) => {
          if (updatedProfile?.archetypeBadge) {
            setUserArchetype(updatedProfile.archetypeBadge);
          }
          fetchMatches(activeCategory, sortBy);
        }}
      />
    </div>
  );
};
