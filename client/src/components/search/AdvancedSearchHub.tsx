import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type {
  AdvancedSearchFilters,
  MatchProfileItem,
  SearchResponsePayload,
} from "@/types/matchAndSearchTypes";
import { SavedSearchesManager } from "./SavedSearchesManager";
import { MapProfileSearch } from "./MapProfileSearch";
import { ProfileComparisonModal } from "./ProfileComparisonModal";
import { SimilarProfilesModal } from "./SimilarProfilesModal";
import {
  Search,
  Filter,
  SlidersHorizontal,
  BookmarkPlus,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  MapPin,
  Sparkles,
  Heart,
  Bookmark,
  Eye,
  MessageCircle,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Building2,
  Plane,
  Award,
  Crown,
  ChevronRight,
  Globe2,
  Scale,
  Users2,
  Moon,
  Trash2,
  CheckSquare,
  Square,
} from "lucide-react";

interface AdvancedSearchHubProps {
  userId?: string;
  onViewProfile: (profile: any) => void;
  onOpenChat?: (profileId: string) => void;
}

export type SearchTabMode =
  | "quick"
  | "professional"
  | "horoscope_family"
  | "map"
  | "by_id"
  | "saved";

const POPULAR_LANGUAGES = [
  "Hindi",
  "Marathi",
  "Gujarati",
  "Punjabi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "English",
  "Marwari",
  "Sindhi",
  "Urdu",
];

const NRI_COUNTRIES = [
  "India",
  "USA",
  "United Kingdom",
  "Canada",
  "UAE",
  "Australia",
  "Singapore",
  "Germany",
];

const RASHIS = [
  "Mesha (Aries)",
  "Vrishabha (Taurus)",
  "Mithuna (Gemini)",
  "Karka (Cancer)",
  "Simha (Leo)",
  "Kanya (Virgo)",
  "Tula (Libra)",
  "Vrischika (Scorpio)",
  "Dhanu (Sagittarius)",
  "Makara (Capricorn)",
  "Kumbha (Aquarius)",
  "Meena (Pisces)",
];

export const AdvancedSearchHub: React.FC<AdvancedSearchHubProps> = ({
  userId = "usr-active-complete",
  onViewProfile,
  onOpenChat,
}) => {
  const { toast } = useToast();
  const [activeTabMode, setActiveTabMode] = useState<SearchTabMode>("quick");

  // Filter Form State
  const [filters, setFilters] = useState<AdvancedSearchFilters>({
    query: "",
    gender: "All",
    ageMin: 21,
    ageMax: 35,
    heightMinCm: 152,
    heightMaxCm: 190,
    religions: ["All"],
    castes: [],
    motherTongues: [],
    cities: [],
    countries: [],
    isGovtJob: false,
    isPremierInstitute: false,
    isNri: false,
    minIncomeLpa: 0,
    maxIncomeLpa: 1000,
    occupations: [],
    diet: [],
    familyTypes: [],
    familyValues: [],
    familyStatuses: [],
    manglik: "Any",
    rashis: [],
    minKundliScore: 0,
    verifiedOnly: false,
    viewerUserId: userId,
    sortBy: "relevance",
    page: 1,
    limit: 18,
  });

  // Direct Profile ID Lookup State
  const [profileIdInput, setProfileIdInput] = useState<string>("");
  const [idLookupProfile, setIdLookupProfile] = useState<MatchProfileItem | null>(null);
  const [idLookupLoading, setIdLookupLoading] = useState<boolean>(false);
  const [idLookupError, setIdLookupError] = useState<string | null>(null);

  // Search Results State
  const [results, setResults] = useState<MatchProfileItem[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Feature 17: Profile Comparison State
  const [comparedProfileIds, setComparedProfileIds] = useState<string[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);

  // Feature 18: Similar Profile Suggestions State
  const [similarModalBase, setSimilarModalBase] = useState<{ id: string; name: string } | null>(null);

  // Save Search Modal State
  const [saveModalOpen, setSaveModalOpen] = useState<boolean>(false);
  const [searchNickname, setSearchNickname] = useState<string>("");
  const [alertToggle, setAlertToggle] = useState<boolean>(true);
  const [savingSearch, setSavingSearch] = useState<boolean>(false);
  const [savedRefreshTrigger, setSavedRefreshTrigger] = useState<number>(0);

  // User interactions
  const [sentInterests, setSentInterests] = useState<string[]>([]);
  const [shortlisted, setShortlisted] = useState<string[]>([]);

  // Recent Searches / Search History & Default Filter
  const [recentSearches, setRecentSearches] = useState<
    Array<{ id: string; label: string; filters: AdvancedSearchFilters; timestamp: string }>
  >(() => {
    try {
      const saved = localStorage.getItem(`vivah_recent_searches_${userId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load saved default filter preset on mount if present
  useEffect(() => {
    try {
      const rawDefault = localStorage.getItem(`vivah_default_search_${userId}`);
      if (rawDefault) {
        const parsed = JSON.parse(rawDefault);
        setFilters((prev) => ({ ...prev, ...parsed, viewerUserId: userId }));
      }
    } catch {
      // Ignore storage error
    }
  }, [userId]);

  const recordSearchHistory = (applied: AdvancedSearchFilters) => {
    const parts: string[] = [];
    if (applied.query) parts.push(`"${applied.query}"`);
    if (applied.cities?.length) parts.push(applied.cities.join(", "));
    if (applied.isNri) parts.push("NRI");
    if (applied.isGovtJob) parts.push("Govt Job");
    if (applied.verifiedOnly) parts.push("Verified");
    if (applied.premiumOnly) parts.push("Premium");
    if (applied.horoscopeAvailableOnly) parts.push("Horoscope");
    if (applied.recentlyJoinedDays) parts.push(`New ${applied.recentlyJoinedDays}d`);
    if (applied.minIncomeLpa && applied.minIncomeLpa > 0) parts.push(`${applied.minIncomeLpa}+ LPA`);
    if (parts.length === 0) return;

    const label = parts.slice(0, 3).join(" • ");
    setRecentSearches((prev) => {
      const next = [
        { id: `hist-${Date.now()}`, label, filters: applied, timestamp: new Date().toISOString() },
        ...prev.filter((item) => item.label !== label),
      ].slice(0, 6);
      try {
        localStorage.setItem(`vivah_recent_searches_${userId}`, JSON.stringify(next));
      } catch {
        // Ignore quota
      }
      return next;
    });
  };

  const handleSaveAsDefault = () => {
    try {
      localStorage.setItem(`vivah_default_search_${userId}`, JSON.stringify(filters));
      toast({
        title: "Saved as Default Search Filter",
        description: "These filter criteria will automatically load every time you open Profile Discovery.",
      });
    } catch {
      toast({ title: "Could not save default filter", variant: "destructive" });
    }
  };

  // Execute Search API
  const executeSearch = async (appliedFilters = filters) => {
    setLoading(true);
    recordSearchHistory(appliedFilters);
    try {
      const res = await fetch("/api/v1/search/advanced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...appliedFilters, viewerUserId: userId }),
      });
      const data: SearchResponsePayload = await res.json();
      if (data.success) {
        setResults(data.results || []);
        setTotalResults(data.total || 0);
        setActiveFiltersCount(data.activeFiltersCount || 0);
      }
    } catch (err) {
      console.warn("Search fetch fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, [filters.sortBy, filters.page]);

  // Handle Direct Profile ID Lookup
  const handleProfileIdSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!profileIdInput.trim()) return;

    setIdLookupLoading(true);
    setIdLookupError(null);
    setIdLookupProfile(null);

    try {
      const res = await fetch(
        `/api/v1/search/by-id/${encodeURIComponent(profileIdInput.trim())}`
      );
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Profile ID not found");
      }
      setIdLookupProfile(data.profile);
    } catch (err: any) {
      setIdLookupError(err.message || "Failed to find matrimonial profile.");
    } finally {
      setIdLookupLoading(false);
    }
  };

  // Handle Save Current Search
  const handleSaveSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchNickname.trim()) return;

    setSavingSearch(true);
    try {
      const res = await fetch(`/api/v1/search/saved/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchName: searchNickname.trim(),
          filters,
          alertsEnabled: alertToggle,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast({
        title: "Search Criteria Saved!",
        description: `"${searchNickname}" saved. You will receive notification alerts for matching profiles.`,
      });

      setSaveModalOpen(false);
      setSearchNickname("");
      setSavedRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      toast({
        title: "Save Failed",
        description: err.message || "Could not save search query.",
        variant: "destructive",
      });
    } finally {
      setSavingSearch(false);
    }
  };

  const handleResetFilters = () => {
    const clean: AdvancedSearchFilters = {
      query: "",
      gender: "All",
      ageMin: 21,
      ageMax: 35,
      heightMinCm: 152,
      heightMaxCm: 190,
      religions: ["All"],
      castes: [],
      motherTongues: [],
      cities: [],
      countries: [],
      isGovtJob: false,
      isPremierInstitute: false,
      isNri: false,
      minIncomeLpa: 0,
      maxIncomeLpa: 1000,
      occupations: [],
      diet: [],
      familyTypes: [],
      familyValues: [],
      familyStatuses: [],
      manglik: "Any",
      rashis: [],
      minKundliScore: 0,
      verifiedOnly: false,
      viewerUserId: userId,
      sortBy: "relevance",
      page: 1,
      limit: 18,
    };
    setFilters(clean);
    executeSearch(clean);
    toast({
      title: "Filters Cleared",
      description: "Showing all available matrimonial alliances.",
    });
  };

  const handleRunSavedSearch = (savedFilters: AdvancedSearchFilters, name: string) => {
    const merged = { ...filters, ...savedFilters };
    setFilters(merged);
    setActiveTabMode("quick");
    executeSearch(merged);
    toast({
      title: `Running Saved Search: ${name}`,
      description: "Updated search results with saved parameters.",
    });
  };

  const handleToggleInterest = (profile: MatchProfileItem) => {
    const isSent = sentInterests.includes(profile.id);
    if (isSent) {
      setSentInterests((prev) => prev.filter((id) => id !== profile.id));
      toast({
        title: "Interest Withdrawn",
        description: `Request for ${profile.name} removed.`,
      });
    } else {
      setSentInterests((prev) => [...prev, profile.id]);
      toast({
        title: "Interest Expressed! 💖",
        description: `Formal interest sent to ${profile.name}.`,
      });
    }
  };

  const handleToggleShortlist = (profile: MatchProfileItem) => {
    const isSaved = shortlisted.includes(profile.id);
    if (isSaved) {
      setShortlisted((prev) => prev.filter((id) => id !== profile.id));
      toast({
        title: "Removed from Shortlist",
        description: `${profile.name} removed from saved list.`,
      });
    } else {
      setShortlisted((prev) => [...prev, profile.id]);
      toast({
        title: "Shortlisted ⭐",
        description: `${profile.name} saved in your shortlist.`,
      });
    }
  };

  const handleToggleCompare = (id: string) => {
    if (comparedProfileIds.includes(id)) {
      setComparedProfileIds((prev) => prev.filter((item) => item !== id));
    } else {
      if (comparedProfileIds.length >= 3) {
        toast({
          title: "Maximum 3 Profiles",
          description: "You can compare up to 3 profiles simultaneously in the matrix.",
          variant: "destructive",
        });
        return;
      }
      setComparedProfileIds((prev) => [...prev, id]);
    }
  };

  const toggleLanguageFilter = (lang: string) => {
    const current = filters.motherTongues || [];
    const updated = current.includes(lang)
      ? current.filter((l) => l !== lang)
      : [...current, lang];
    setFilters({ ...filters, motherTongues: updated });
  };

  const toggleCountryFilter = (country: string) => {
    const current = filters.countries || [];
    const updated = current.includes(country)
      ? current.filter((c) => c !== country)
      : [...current, country];
    setFilters({ ...filters, countries: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EA580C]">
            <Search className="w-4 h-4" />
            <span>Programme 04 • Advanced Multi-Tier Search &amp; Discovery</span>
          </div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C] mt-1">
            Search Alliances &amp; Discover Matches
          </h1>
          <p className="text-sm text-[#5C4740] mt-1">
            Multi-tier filtering by education, government jobs, NRI status, horoscope, family values, and map view.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSaveModalOpen(true)}
            className="rounded-xl border-amber-300 bg-white text-[#3B0A18] hover:bg-amber-50 h-10 px-4 font-semibold shadow-sm text-xs"
          >
            <BookmarkPlus className="w-4 h-4 mr-2 text-[#EA580C]" />
            Save This Search
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={handleResetFilters}
            className="rounded-xl text-[#5C4740] hover:bg-amber-100/60 h-10 px-3 text-xs"
            title="Reset all filters"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* 6 Navigation Tabs Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-1.5 bg-amber-50/80 rounded-2xl border border-amber-200/90">
        <button
          type="button"
          onClick={() => setActiveTabMode("quick")}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
            activeTabMode === "quick"
              ? "bg-white text-[#7C2D12] shadow-sm border border-amber-200"
              : "text-[#5C4740] hover:text-[#2B120C] hover:bg-amber-100/50"
          }`}
        >
          <Filter className="w-3.5 h-3.5 text-[#EA580C]" />
          <span>Quick Search</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTabMode("professional")}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
            activeTabMode === "professional"
              ? "bg-white text-[#7C2D12] shadow-sm border border-amber-200"
              : "text-[#5C4740] hover:text-[#2B120C] hover:bg-amber-100/50"
          }`}
        >
          <Crown className="w-3.5 h-3.5 text-purple-600" />
          <span>Career &amp; NRI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTabMode("horoscope_family")}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
            activeTabMode === "horoscope_family"
              ? "bg-white text-[#7C2D12] shadow-sm border border-amber-200"
              : "text-[#5C4740] hover:text-[#2B120C] hover:bg-amber-100/50"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Horoscope &amp; Family</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTabMode("map")}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
            activeTabMode === "map"
              ? "bg-white text-[#7C2D12] shadow-sm border border-amber-200"
              : "text-[#5C4740] hover:text-[#2B120C] hover:bg-amber-100/50"
          }`}
        >
          <Globe2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Map View</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTabMode("by_id")}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
            activeTabMode === "by_id"
              ? "bg-white text-[#7C2D12] shadow-sm border border-amber-200"
              : "text-[#5C4740] hover:text-[#2B120C] hover:bg-amber-100/50"
          }`}
        >
          <Search className="w-3.5 h-3.5 text-emerald-600" />
          <span>Profile ID</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTabMode("saved")}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
            activeTabMode === "saved"
              ? "bg-white text-[#7C2D12] shadow-sm border border-amber-200"
              : "text-[#5C4740] hover:text-[#2B120C] hover:bg-amber-100/50"
          }`}
        >
          <BookmarkPlus className="w-3.5 h-3.5 text-rose-500" />
          <span>Saved Queries</span>
        </button>
      </div>

      {/* Mode 1: Quick Search Panel */}
      {activeTabMode === "quick" && (
        <div className="bg-white rounded-2xl border border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Keyword Search */}
            <div className="lg:col-span-2">
              <Label className="text-xs font-semibold text-[#3B0A18]">
                Keyword Search (Name, Profession, City, or Gotra)
              </Label>
              <div className="relative mt-1">
                <Search className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  value={filters.query}
                  onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                  placeholder="e.g., Doctor Pune, Maratha Engineer, IIT..."
                  className="pl-10 h-11 rounded-xl border-amber-200 text-xs"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">Looking For</Label>
              <select
                value={filters.gender}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    gender: e.target.value as "All" | "Female" | "Male",
                  })
                }
                className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-xs"
              >
                <option value="All">All Profiles (Brides &amp; Grooms)</option>
                <option value="Female">Female (Brides)</option>
                <option value="Male">Male (Grooms)</option>
              </select>
            </div>

            {/* Religion */}
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">Religion</Label>
              <select
                value={filters.religions?.[0] || "All"}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    religions: e.target.value === "All" ? ["All"] : [e.target.value],
                  })
                }
                className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-xs"
              >
                <option value="All">All Religions</option>
                <option value="Hindu">Hindu</option>
                <option value="Jain">Jain</option>
                <option value="Sikh">Sikh</option>
                <option value="Buddhist">Buddhist</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {/* Age Range */}
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">
                Age: {filters.ageMin} to {filters.ageMax} Yrs
              </Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Input
                  type="number"
                  min={18}
                  max={70}
                  value={filters.ageMin}
                  onChange={(e) =>
                    setFilters({ ...filters, ageMin: parseInt(e.target.value) || 21 })
                  }
                  className="h-11 rounded-xl border-amber-200 text-xs"
                />
                <Input
                  type="number"
                  min={18}
                  max={80}
                  value={filters.ageMax}
                  onChange={(e) =>
                    setFilters({ ...filters, ageMax: parseInt(e.target.value) || 35 })
                  }
                  className="h-11 rounded-xl border-amber-200 text-xs"
                />
              </div>
            </div>

            {/* Caste / Community */}
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">Caste / Community</Label>
              <Input
                value={filters.castes?.join(", ") || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    castes: e.target.value.split(",").map((c) => c.trim()).filter(Boolean),
                  })
                }
                placeholder="e.g., Maratha, Brahmin, Patel"
                className="mt-1 h-11 rounded-xl border-amber-200 text-xs"
              />
            </div>

            {/* City */}
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">City / Location</Label>
              <Input
                value={filters.cities?.join(", ") || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    cities: e.target.value.split(",").map((c) => c.trim()).filter(Boolean),
                  })
                }
                placeholder="e.g., Pune, Mumbai, Delhi"
                className="mt-1 h-11 rounded-xl border-amber-200 text-xs"
              />
            </div>

            {/* Verified Badge Checkbox */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200 self-end h-11">
              <span className="text-xs font-bold text-[#2B120C]">Verified ID Only</span>
              <Switch
                checked={filters.verifiedOnly}
                onCheckedChange={(c) => setFilters({ ...filters, verifiedOnly: c })}
              />
            </div>
          </div>

          {/* Feature 11: Multi-Language Selector */}
          <div className="pt-2 border-t border-amber-100 space-y-1.5">
            <Label className="text-xs font-bold text-[#7C2D12]">
              Search by Languages / Mother Tongue (Multi-Select)
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_LANGUAGES.map((lang) => {
                const isSelected = filters.motherTongues?.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguageFilter(lang)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-[#EA580C] text-white shadow-xs"
                        : "bg-amber-50 text-[#5C4740] border border-amber-200 hover:bg-amber-100/60"
                    }`}
                  >
                    {lang} {isSelected && "✓"}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              onClick={() => executeSearch(filters)}
              className="h-11 px-6 rounded-xl bg-saffron-gradient text-white font-semibold text-xs shadow-saffron-sm"
            >
              <Search className="w-4 h-4 mr-2" />
              Apply Quick Filters
            </Button>
          </div>
        </div>
      )}

      {/* Mode 2: Professional & Elite Search Panel */}
      {activeTabMode === "professional" && (
        <div className="bg-white rounded-2xl border border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div>
              <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18] flex items-center gap-2">
                <Crown className="w-5 h-5 text-purple-600" />
                Career, Income Range &amp; NRI Global Hubs
              </h3>
              <p className="text-xs text-[#5C4740]">
                Filter by premier academic pedigrees, government positions, NRI residency, and income ranges.
              </p>
            </div>
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">
              Elite Filters
            </span>
          </div>

          {/* Quick Toggle Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => setFilters({ ...filters, isGovtJob: !filters.isGovtJob })}
              className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center justify-between ${
                filters.isGovtJob
                  ? "bg-blue-50 border-blue-400 text-blue-900 shadow-sm"
                  : "bg-amber-50/40 border-amber-200 hover:border-amber-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    filters.isGovtJob ? "bg-blue-600 text-white" : "bg-amber-100 text-[#7C2D12]"
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">Government / PSU Jobs</h4>
                  <p className="text-[11px] text-[#5C4740]">IAS, Defense, PSU &amp; Gazetted</p>
                </div>
              </div>
              <Switch
                checked={filters.isGovtJob}
                onCheckedChange={(checked) => setFilters({ ...filters, isGovtJob: checked })}
              />
            </div>

            <div
              onClick={() => setFilters({ ...filters, isPremierInstitute: !filters.isPremierInstitute })}
              className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center justify-between ${
                filters.isPremierInstitute
                  ? "bg-purple-50 border-purple-400 text-purple-900 shadow-sm"
                  : "bg-amber-50/40 border-amber-200 hover:border-amber-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    filters.isPremierInstitute ? "bg-purple-600 text-white" : "bg-amber-100 text-[#7C2D12]"
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">IIT / IIM / AIIMS Alumni</h4>
                  <p className="text-[11px] text-[#5C4740]">Premier institutes &amp; top ranked</p>
                </div>
              </div>
              <Switch
                checked={filters.isPremierInstitute}
                onCheckedChange={(checked) => setFilters({ ...filters, isPremierInstitute: checked })}
              />
            </div>

            <div
              onClick={() => setFilters({ ...filters, isNri: !filters.isNri })}
              className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center justify-between ${
                filters.isNri
                  ? "bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm"
                  : "bg-amber-50/40 border-amber-200 hover:border-amber-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    filters.isNri ? "bg-emerald-600 text-white" : "bg-amber-100 text-[#7C2D12]"
                  }`}
                >
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">NRI &amp; Overseas Settled</h4>
                  <p className="text-[11px] text-[#5C4740]">USA, UK, Canada, UAE &amp; Europe</p>
                </div>
              </div>
              <Switch
                checked={filters.isNri}
                onCheckedChange={(checked) => setFilters({ ...filters, isNri: checked })}
              />
            </div>
          </div>

          {/* Feature 12: NRI Country Selection Chips */}
          <div className="space-y-1.5 pt-1">
            <Label className="text-xs font-bold text-[#7C2D12]">
              Select Preferred NRI / Foreign Countries (Feature 12)
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {NRI_COUNTRIES.map((ctry) => {
                const isSelected = filters.countries?.includes(ctry);
                return (
                  <button
                    key={ctry}
                    type="button"
                    onClick={() => toggleCountryFilter(ctry)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-[#EA580C] text-white shadow-xs"
                        : "bg-amber-50 text-[#5C4740] border border-amber-200 hover:bg-amber-100/60"
                    }`}
                  >
                    {ctry} {isSelected && "✓"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feature 13: Annual Income Range (Min & Max LPA) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">
                Min Income LPA (₹ Lakhs / Year)
              </Label>
              <select
                value={filters.minIncomeLpa}
                onChange={(e) =>
                  setFilters({ ...filters, minIncomeLpa: parseInt(e.target.value) || 0 })
                }
                className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-xs"
              >
                <option value={0}>No Minimum (Any)</option>
                <option value={10}>₹10 Lakhs+ P.A.</option>
                <option value={15}>₹15 Lakhs+ P.A.</option>
                <option value={25}>₹25 Lakhs+ P.A.</option>
                <option value={50}>₹50 Lakhs+ P.A. (Executive)</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">
                Max Income LPA (Upper Cap)
              </Label>
              <select
                value={filters.maxIncomeLpa}
                onChange={(e) =>
                  setFilters({ ...filters, maxIncomeLpa: parseInt(e.target.value) || 1000 })
                }
                className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-xs"
              >
                <option value={1000}>No Upper Limit (Unlimited)</option>
                <option value={25}>Up to ₹25 Lakhs P.A.</option>
                <option value={50}>Up to ₹50 Lakhs P.A.</option>
                <option value={100}>Up to ₹1 Crore P.A.</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">Specialized Profession</Label>
              <select
                value={filters.occupations?.[0] || ""}
                onChange={(e) =>
                  setFilters({ ...filters, occupations: e.target.value ? [e.target.value] : [] })
                }
                className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-xs"
              >
                <option value="">All Professions</option>
                <option value="Doctor">Doctor / Medical Consultant</option>
                <option value="Software Engineer">Software Architect / Tech Lead</option>
                <option value="Civil Services">Civil Services (IAS / IPS)</option>
                <option value="Chartered Accountant">Chartered Accountant (CA)</option>
                <option value="Entrepreneur">Entrepreneur / Business Founder</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <Button
              type="button"
              onClick={() => executeSearch(filters)}
              className="h-11 px-6 rounded-xl bg-saffron-gradient text-white font-semibold text-xs shadow-saffron-sm"
            >
              <Crown className="w-4 h-4 mr-2" />
              Apply Professional &amp; NRI Filters
            </Button>
          </div>
        </div>
      )}

      {/* Mode 3: Horoscope & Family Background Panel (Features 14 & 15) */}
      {activeTabMode === "horoscope_family" && (
        <div className="bg-white rounded-2xl border border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div>
              <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                Vedic Horoscope, Kundli &amp; Family Values (Features 14 &amp; 15)
              </h3>
              <p className="text-xs text-[#5C4740]">
                Search alliances by Manglik status, Rashi, minimum Ashtakoot Guna score, and joint/nuclear family background.
              </p>
            </div>
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-amber-100 text-[#7C2D12] border border-amber-200 text-xs font-bold">
              Heritage Filters
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Manglik Status */}
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">Manglik Status</Label>
              <select
                value={filters.manglik}
                onChange={(e) => setFilters({ ...filters, manglik: e.target.value })}
                className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-xs"
              >
                <option value="Any">Doesn&apos;t Matter / Any</option>
                <option value="Non-Manglik">Strictly Non-Manglik</option>
                <option value="Manglik">Manglik</option>
                <option value="Anshik Manglik">Anshik Manglik</option>
              </select>
            </div>

            {/* Minimum Kundli Score */}
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">
                Min Kundli Guna Match: {filters.minKundliScore || 0}/36 Gunas
              </Label>
              <select
                value={filters.minKundliScore}
                onChange={(e) =>
                  setFilters({ ...filters, minKundliScore: parseInt(e.target.value) || 0 })
                }
                className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-xs"
              >
                <option value={0}>Any Guna Score</option>
                <option value={18}>18+ Gunas (Passing Threshold)</option>
                <option value={24}>24+ Gunas (Auspicious Alliance)</option>
                <option value={28}>28+ Gunas (Highly Recommended)</option>
                <option value={32}>32+ Gunas (Supreme Astrological Match)</option>
              </select>
            </div>

            {/* Moon Sign / Rashi */}
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">Rashi (Moon Sign)</Label>
              <select
                value={filters.rashis?.[0] || "All"}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    rashis: e.target.value === "All" ? [] : [e.target.value],
                  })
                }
                className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-xs"
              >
                <option value="All">All Rashis</option>
                {RASHIS.map((r) => (
                  <option key={r} value={r.split(" ")[0]}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Feature 14: Family Background Filters */}
          <div className="pt-3 border-t border-amber-100 space-y-3">
            <h4 className="font-serif-royal text-sm font-bold text-[#2B120C] flex items-center gap-1.5">
              <Users2 className="w-4 h-4 text-[#EA580C]" />
              Family Structure &amp; Background (Feature 14)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs font-semibold text-[#5C4740]">Family Type</Label>
                <select
                  value={filters.familyTypes?.[0] || "All"}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      familyTypes: e.target.value === "All" ? [] : [e.target.value],
                    })
                  }
                  className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-xs"
                >
                  <option value="All">Both Nuclear &amp; Joint</option>
                  <option value="Nuclear">Nuclear Family</option>
                  <option value="Joint">Joint Family</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-[#5C4740]">Family Values</Label>
                <select
                  value={filters.familyValues?.[0] || "All"}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      familyValues: e.target.value === "All" ? [] : [e.target.value],
                    })
                  }
                  className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-xs"
                >
                  <option value="All">All Cultural Values</option>
                  <option value="Traditional">Traditional Values</option>
                  <option value="Moderate">Moderate / Balanced</option>
                  <option value="Liberal">Liberal / Progressive</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-[#5C4740]">Family Status</Label>
                <select
                  value={filters.familyStatuses?.[0] || "All"}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      familyStatuses: e.target.value === "All" ? [] : [e.target.value],
                    })
                  }
                  className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-xs"
                >
                  <option value="All">All Social Statuses</option>
                  <option value="Middle Class">Middle Class</option>
                  <option value="Upper Middle Class">Upper Middle Class</option>
                  <option value="Affluent">Affluent / High Networth</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <Button
              type="button"
              onClick={() => executeSearch(filters)}
              className="h-11 px-6 rounded-xl bg-saffron-gradient text-white font-semibold text-xs shadow-saffron-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Apply Horoscope &amp; Family Filters
            </Button>
          </div>
        </div>
      )}

      {/* Mode 4: Map-Based Search Panel (Feature 4) */}
      {activeTabMode === "map" && (
        <MapProfileSearch
          onViewProfile={onViewProfile}
          onSendInterest={handleToggleInterest}
          onOpenChat={onOpenChat}
          viewerUserId={userId}
        />
      )}

      {/* Mode 5: Profile ID Search Panel */}
      {activeTabMode === "by_id" && (
        <div className="bg-white rounded-2xl border border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-5">
          <div>
            <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18] flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Direct Matrimonial Profile ID Lookup
            </h3>
            <p className="text-xs text-[#5C4740]">
              Enter the unique profile code (e.g. <strong>#000003</strong> or <strong>VK-10492</strong>) to jump directly to candidate biodata.
            </p>
          </div>

          <form onSubmit={handleProfileIdSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                value={profileIdInput}
                onChange={(e) => setProfileIdInput(e.target.value)}
                placeholder="Enter Profile ID e.g., #000003"
                className="pl-11 h-12 rounded-xl border-amber-200 text-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={idLookupLoading || !profileIdInput.trim()}
              className="h-12 px-8 rounded-xl bg-saffron-gradient text-white font-semibold text-xs shadow-saffron-sm hover:opacity-95"
            >
              {idLookupLoading ? "Searching..." : "Search Profile"}
            </Button>
          </form>

          {idLookupError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{idLookupError}</span>
            </div>
          )}

          {idLookupProfile && (
            <div className="mt-4 p-5 rounded-2xl bg-[#FFFDF9] border border-amber-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <img
                  src={idLookupProfile.photos[0] || "/1.jpg"}
                  alt={idLookupProfile.name}
                  className="w-20 h-20 rounded-2xl object-cover object-top border-2 border-amber-300 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif-royal text-xl font-bold text-[#2B120C]">
                      {idLookupProfile.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                      {idLookupProfile.profileId}
                    </span>
                  </div>
                  <p className="text-xs text-[#5C4740] mt-0.5">
                    {idLookupProfile.age} Yrs • {idLookupProfile.height} • {idLookupProfile.caste}
                  </p>
                  <p className="text-xs font-semibold text-[#3E2723] mt-1">
                    {idLookupProfile.profession} • {idLookupProfile.city}, {idLookupProfile.state}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => onViewProfile(idLookupProfile)}
                  className="rounded-xl bg-saffron-gradient text-white font-bold text-xs h-10 px-5 shadow-sm"
                >
                  <Eye className="w-4 h-4 mr-1.5" />
                  View Full Biodata
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 6: Saved Searches Manager Panel */}
      {activeTabMode === "saved" && (
        <SavedSearchesManager
          userId={userId}
          onRunSearch={handleRunSavedSearch}
          refreshTrigger={savedRefreshTrigger}
        />
      )}

      {/* Quick Discovery Toggles, Exclusion Controls & Recent Search History Bar */}
      {activeTabMode !== "map" && activeTabMode !== "by_id" && activeTabMode !== "saved" && (
        <div className="bg-white rounded-2xl border border-amber-200/80 p-3.5 sm:p-4 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              {
                label: "Verified Profiles",
                active: Boolean(filters.verifiedOnly),
                toggle: () => {
                  const next = { ...filters, verifiedOnly: !filters.verifiedOnly, page: 1 };
                  setFilters(next);
                  executeSearch(next);
                },
              },
              {
                label: "Premium Profiles",
                active: Boolean(filters.premiumOnly),
                toggle: () => {
                  const next = { ...filters, premiumOnly: !filters.premiumOnly, page: 1 };
                  setFilters(next);
                  executeSearch(next);
                },
              },
              {
                label: "Horoscope Available",
                active: Boolean(filters.horoscopeAvailableOnly),
                toggle: () => {
                  const next = { ...filters, horoscopeAvailableOnly: !filters.horoscopeAvailableOnly, page: 1 };
                  setFilters(next);
                  executeSearch(next);
                },
              },
              {
                label: "Recently Joined (7d)",
                active: filters.recentlyJoinedDays === 7,
                toggle: () => {
                  const next = {
                    ...filters,
                    recentlyJoinedDays: filters.recentlyJoinedDays === 7 ? 0 : 7,
                    page: 1,
                  };
                  setFilters(next);
                  executeSearch(next);
                },
              },
              {
                label: "90%+ Complete",
                active: filters.minProfileCompleteness === 90,
                toggle: () => {
                  const next = {
                    ...filters,
                    minProfileCompleteness: filters.minProfileCompleteness === 90 ? 0 : 90,
                    page: 1,
                  };
                  setFilters(next);
                  executeSearch(next);
                },
              },
              {
                label: "Exclude Already Viewed",
                active: Boolean(filters.excludeViewed),
                toggle: () => {
                  const next = { ...filters, excludeViewed: !filters.excludeViewed, page: 1 };
                  setFilters(next);
                  executeSearch(next);
                },
              },
              {
                label: "Exclude Rejected",
                active: Boolean(filters.excludeRejected),
                toggle: () => {
                  const next = { ...filters, excludeRejected: !filters.excludeRejected, page: 1 };
                  setFilters(next);
                  executeSearch(next);
                },
              },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={chip.toggle}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                  chip.active
                    ? "bg-[#3B0A18] text-amber-100 border-[#3B0A18] shadow-xs"
                    : "bg-amber-50/70 text-[#5C4740] border-amber-200 hover:bg-amber-100"
                }`}
              >
                {chip.active ? "✓ " : ""}
                {chip.label}
              </button>
            ))}

            <select
              value={filters.profileCreatedBy?.[0] || "All"}
              onChange={(e) => {
                const val = e.target.value;
                const next = {
                  ...filters,
                  profileCreatedBy: val === "All" ? [] : [val],
                  page: 1,
                };
                setFilters(next);
                executeSearch(next);
              }}
              aria-label="Filter by profile created by"
              className="h-8 rounded-full border border-amber-200 bg-[#FFFDF9] px-3 text-[11px] font-bold text-[#3B0A18]"
            >
              <option value="All">Created By: Any</option>
              <option value="Self">Created By: Self</option>
              <option value="Parents">Created By: Parents</option>
              <option value="Sibling">Created By: Sibling</option>
            </select>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleSaveAsDefault}
              className="h-8 rounded-full border-emerald-300 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100 text-[11px] font-bold ml-auto"
            >
              Save Filter as Default
            </Button>
          </div>

          {recentSearches.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-amber-100 text-[11px]">
              <span className="font-bold text-[#7C2D12] mr-1">Recent Searches:</span>
              {recentSearches.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFilters({ ...item.filters, viewerUserId: userId, page: 1 });
                    executeSearch({ ...item.filters, viewerUserId: userId, page: 1 });
                  }}
                  className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[#4E342E] hover:bg-amber-100 font-medium"
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setRecentSearches([]);
                  try {
                    localStorage.removeItem(`vivah_recent_searches_${userId}`);
                  } catch {
                    // Ignore
                  }
                }}
                className="text-[10px] font-bold text-rose-600 hover:underline ml-1"
              >
                Clear History
              </button>
            </div>
          )}
        </div>
      )}

      {/* Search Results Summary Header (Only for Query Tabs) */}
      {activeTabMode !== "map" && activeTabMode !== "by_id" && activeTabMode !== "saved" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2.5 rounded-xl bg-white border border-amber-200/80 text-xs text-[#5C4740] gap-2">
          <div className="flex items-center gap-2 font-semibold text-[#2B120C]">
            <span>Found <strong>{totalResults}</strong> Matching Alliances</span>
            {activeFiltersCount > 0 && (
              <Badge className="bg-amber-100 text-[#7C2D12] text-[10px] font-bold border-0">
                {activeFiltersCount} Filters Active
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-[#7C2D12]">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  sortBy: e.target.value as any,
                })
              }
              aria-label="Sort search results"
              className="bg-transparent font-semibold text-[#2B120C] focus:outline-none cursor-pointer"
            >
              <option value="relevance">Most Relevant &amp; Trust</option>
              <option value="compatibility">Highest Compatibility</option>
              <option value="completeness">Profile Completeness</option>
              <option value="recently_active">Recently Active</option>
              <option value="newest">Recently Joined</option>
              <option value="income_desc">Highest Income First</option>
              <option value="age_asc">Age: Low to High</option>
              <option value="kundli_desc">Highest Kundli Gunas</option>
            </select>
          </div>
        </div>
      )}

      {/* Results Profiles Grid */}
      {activeTabMode !== "map" && activeTabMode !== "by_id" && activeTabMode !== "saved" && (
        loading ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-amber-200 border-t-[#EA580C] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#5C4740]">
              Filtering verified matrimonial alliances...
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white rounded-3xl border border-amber-200 p-12 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="font-serif-royal text-xl font-bold text-[#2B120C]">
              No Alliances Match These Criteria
            </h3>
            <p className="text-sm text-[#5C4740] max-w-md mx-auto">
              Try broadening your filters (such as expanding age range, relaxing income or city filters).
            </p>
            <Button
              type="button"
              onClick={handleResetFilters}
              className="rounded-xl bg-saffron-gradient text-white font-semibold text-xs"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {results.map((profile) => {
              const hasSent = sentInterests.includes(profile.id);
              const isSaved = shortlisted.includes(profile.id);
              const isComparing = comparedProfileIds.includes(profile.id);

              return (
                <div
                  key={profile.id}
                  className="group bg-white rounded-3xl border border-amber-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[4/3] w-full bg-amber-100 overflow-hidden">
                    <img
                      src={profile.photos[0] || "/1.jpg"}
                      alt={profile.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
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

                    {/* Compare Button on Photo */}
                    <button
                      type="button"
                      onClick={() => handleToggleCompare(profile.id)}
                      className={`absolute top-12 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 shadow-sm ${
                        isComparing
                          ? "bg-[#EA580C] text-white"
                          : "bg-white/90 text-[#7C2D12] hover:bg-white"
                      }`}
                    >
                      {isComparing ? (
                        <CheckSquare className="w-3.5 h-3.5" />
                      ) : (
                        <Square className="w-3.5 h-3.5" />
                      )}
                      <span>{isComparing ? "In Comparison" : "Compare"}</span>
                    </button>

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
                    <div className="space-y-1.5 text-xs text-[#3E2723]">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                        <span className="font-semibold truncate">{profile.profession}</span>
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

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-[11px] font-bold text-[#7C2D12]">
                        💰 {profile.income}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-[11px] font-bold text-[#EA580C]">
                        ✨ Kundli: {profile.kundliScore}/36
                      </span>
                      {profile.isGovtJob && (
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[11px] font-bold text-blue-700">
                          🏛️ Govt Job
                        </span>
                      )}
                      {profile.isPremierInstitute && (
                        <span className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-[11px] font-bold text-purple-700">
                          🎓 Premier Institute
                        </span>
                      )}
                      {profile.isNri && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
                          ✈️ NRI Alliance
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#5C4740] line-clamp-2 italic pt-1">
                      &ldquo;{profile.bio}&rdquo;
                    </p>
                  </div>

                  {/* Feature 18: Similar Profiles Trigger */}
                  <div className="px-4 pb-2">
                    <button
                      type="button"
                      onClick={() => setSimilarModalBase({ id: profile.id, name: profile.name })}
                      className="w-full py-1.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[11px] font-bold text-purple-900 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>View Similar Credential Alliances</span>
                    </button>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 pt-1 border-t border-amber-100 bg-[#FFFDF9] flex items-center gap-2">
                    <Button
                      type="button"
                      onClick={() => handleToggleInterest(profile)}
                      className={`flex-1 h-10 rounded-xl text-xs font-bold transition-all ${
                        hasSent
                          ? "bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100"
                          : "bg-saffron-gradient text-white shadow-saffron-sm hover:opacity-95"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 mr-1.5 ${hasSent ? "fill-rose-600" : ""}`} />
                      {hasSent ? "Interest Sent" : "Send Interest"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleToggleShortlist(profile)}
                      className={`h-10 w-10 rounded-xl border-amber-200 hover:bg-amber-50 ${
                        isSaved ? "text-amber-600 fill-amber-500" : "text-[#5C4740]"
                      }`}
                      title={isSaved ? "Saved in Shortlist" : "Bookmark profile"}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? "fill-amber-500" : ""}`} />
                    </Button>

                    {onOpenChat && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => onOpenChat(profile.id)}
                        className="h-10 w-10 rounded-xl border-amber-200 text-[#5C4740] hover:bg-amber-50"
                        title="Open conversation"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => onViewProfile(profile)}
                      className="h-10 w-10 rounded-xl border-amber-200 text-[#5C4740] hover:bg-amber-50"
                      title="View full biodata"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Feature 17: Floating Comparison Sticky Bar */}
      {comparedProfileIds.length >= 2 && (
        <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 sm:left-auto z-40 bg-[#2B120C] text-white p-4 rounded-3xl shadow-2xl border border-amber-400/40 flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold block">
                {comparedProfileIds.length} Profiles Selected for Comparison
              </span>
              <span className="text-[10px] text-amber-200/80">
                Compare side-by-side across career, astrology &amp; lifestyle
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => setIsComparisonModalOpen(true)}
              className="rounded-xl bg-saffron-gradient text-white font-bold text-xs h-9 px-4 shadow-sm"
            >
              Open Comparison Matrix
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setComparedProfileIds([])}
              className="text-white/70 hover:text-white h-9 px-2 text-xs"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Feature 17: Comparison Modal */}
      <ProfileComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        profileIds={comparedProfileIds}
        onSendInterest={(p) => handleToggleInterest(p)}
        onViewProfile={(p) => {
          setIsComparisonModalOpen(false);
          onViewProfile(p);
        }}
      />

      {/* Feature 18: Similar Profiles Modal */}
      <SimilarProfilesModal
        isOpen={!!similarModalBase}
        onClose={() => setSimilarModalBase(null)}
        baseProfileId={similarModalBase?.id || null}
        baseProfileName={similarModalBase?.name}
        onSendInterest={(p) => handleToggleInterest(p)}
        onViewProfile={(p) => {
          setSimilarModalBase(null);
          onViewProfile(p);
        }}
      />

      {/* Save Search Dialog Modal (Feature 16) */}
      <Dialog open={saveModalOpen} onOpenChange={setSaveModalOpen}>
        <DialogContent className="max-w-md bg-[#FFFDF9] border border-amber-200 rounded-3xl p-6">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="font-serif-royal text-xl font-bold text-[#2B120C] flex items-center gap-2">
              <BookmarkPlus className="w-5 h-5 text-[#EA580C]" />
              Save Search &amp; Set Match Alerts
            </DialogTitle>
            <DialogDescription className="text-xs text-[#5C4740]">
              Give your customized query a nickname. We will automatically alert you when newly registered candidates match this criteria.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveSearchSubmit} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">
                Search Query Nickname
              </Label>
              <Input
                value={searchNickname}
                onChange={(e) => setSearchNickname(e.target.value)}
                placeholder="e.g., Pune Maratha Engineers, Govt Doctors"
                className="mt-1 h-11 rounded-xl border-amber-200 text-xs"
                required
              />
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3">
              <div>
                <span className="block text-xs font-bold text-[#2B120C]">
                  Real-time Notification Alerts
                </span>
                <span className="text-[11px] text-[#5C4740]">
                  Get email &amp; dashboard alerts for new matching profiles
                </span>
              </div>
              <Switch
                checked={alertToggle}
                onCheckedChange={setAlertToggle}
                className="data-[state=checked]:bg-[#EA580C]"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSaveModalOpen(false)}
                className="rounded-xl border-amber-300 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={savingSearch || !searchNickname.trim()}
                className="rounded-xl bg-saffron-gradient text-white font-semibold text-xs"
              >
                {savingSearch ? "Saving..." : "Save Query"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
