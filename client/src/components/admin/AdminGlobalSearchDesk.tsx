import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  History,
  Bookmark,
  Sliders,
  Smartphone,
  Mail,
  CreditCard,
  User,
  ShieldCheck,
  ArrowRight,
  XCircle,
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Clock,
  Sparkles,
  RefreshCw,
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AccountBundle } from "@/data/mockAccounts";
import {
  SavedSearchPreset,
  INITIAL_SAVED_SEARCHES,
} from "@/data/adminMockData";

interface AdminGlobalSearchDeskProps {
  accounts: AccountBundle[];
  onNavigateTab: (tab: any, query?: string) => void;
  onSelectUserDossier?: (userId: string) => void;
}

const RECENT_SEARCHES_STORAGE_KEY = "matrimonial_admin_recent_searches_v1";

export default function AdminGlobalSearchDesk({
  accounts,
  onNavigateTab,
  onSelectUserDossier,
}: AdminGlobalSearchDeskProps) {
  const { toast } = useToast();

  const [query, setQuery] = useState<string>("");
  const [searchScope, setSearchScope] = useState<
    "all" | "mobile" | "userId" | "txnId" | "email" | "profileId"
  >("all");
  const [savedPresets, setSavedPresets] = useState<SavedSearchPreset[]>(
    INITIAL_SAVED_SEARCHES
  );

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      return stored
        ? JSON.parse(stored)
        : ["+91 98201", "sharma.family", "usr-active-01", "Platinum"];
    } catch {
      return ["+91 98201", "usr-active-01"];
    }
  });

  const saveToRecent = (text: string) => {
    if (!text || text.trim().length < 2) return;
    const clean = text.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 8);
      try {
        localStorage.setItem(
          RECENT_SEARCHES_STORAGE_KEY,
          JSON.stringify(updated)
        );
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
    } catch {
      // ignore
    }
    toast({
      title: "Recent Searches Cleared",
      description: "Search history has been emptied.",
    });
  };

  const handleSaveCurrentAsPreset = () => {
    if (!query.trim()) {
      toast({
        title: "Query is Empty",
        description: "Type a search term before saving as preset.",
        variant: "destructive",
      });
      return;
    }

    const newPreset: SavedSearchPreset = {
      id: `preset-custom-${Date.now()}`,
      name: `Search: "${query}"`,
      category: "users",
      query: query.trim(),
      filterParam: searchScope,
      targetTab: "users",
      description: `Custom admin preset created on ${new Date().toLocaleDateString()}`,
    };

    setSavedPresets((prev) => [newPreset, ...prev]);
    toast({
      title: "Preset Saved",
      description: `Saved "${query}" to Quick Presets.`,
    });
  };

  // Search Results Matching
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();

    return accounts
      .filter((acc) => {
        const fullName = `${acc.profile.first_name || ""} ${
          acc.profile.last_name || ""
        }`.toLowerCase();
        const email = (acc.user.email || "").toLowerCase();
        const mobile = acc.user.mobile || "";
        const id = (acc.user.id || "").toLowerCase();
        const profileId = (acc.profile.id || "").toLowerCase();

        if (searchScope === "mobile") return mobile.includes(q);
        if (searchScope === "email") return email.includes(q);
        if (searchScope === "userId") return id.includes(q);
        if (searchScope === "profileId") return profileId.includes(q);
        if (searchScope === "txnId") {
          // Check mock transaction match or user id
          return id.includes(q) || q.includes("txn") || q.includes("pay");
        }

        // Omni-search
        return (
          fullName.includes(q) ||
          email.includes(q) ||
          mobile.includes(q) ||
          id.includes(q) ||
          profileId.includes(q) ||
          (acc.profile.caste || "").toLowerCase().includes(q) ||
          (acc.profile.city || "").toLowerCase().includes(q)
        );
      })
      .slice(0, 20);
  }, [accounts, query, searchScope]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#3B0A18] via-[#5A0E24] to-[#8B1E3F] text-amber-50 rounded-2xl p-6 shadow-md border border-amber-900/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
              <Search className="w-3.5 h-3.5" />
              Omni-Search Engine & Query Indexer
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-100">
              Smart Global Search System
            </h1>
            <p className="text-sm text-amber-200/80 mt-1 max-w-2xl">
              Search the entire matrimony platform across all operational tables:
              by Mobile Number, User ID, Transaction ID, Email, Profile ID,
              saved presets, and recent queries.
            </p>
          </div>

          <div className="text-xs text-amber-200/70 bg-black/20 px-3 py-2 rounded-xl border border-amber-800/40">
            Keyboard shortcut: Press{" "}
            <kbd className="px-1.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded font-mono font-bold">
              Ctrl + K
            </kbd>{" "}
            anywhere
          </div>
        </div>

        {/* Big Search Input with Scope Selector */}
        <div className="mt-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-amber-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveToRecent(query);
              }}
              placeholder={
                searchScope === "mobile"
                  ? "Enter mobile number e.g. +91 98201 22334..."
                  : searchScope === "userId"
                  ? "Enter user ID e.g. usr-active-01..."
                  : searchScope === "txnId"
                  ? "Enter transaction reference e.g. TXN-UPI-8841..."
                  : searchScope === "email"
                  ? "Enter email address e.g. priya.kulkarni@example.com..."
                  : searchScope === "profileId"
                  ? "Enter profile matrimony ID..."
                  : "Search anything across users, payments, tickets, KYC..."
              }
              className="w-full pl-12 pr-28 py-3.5 text-sm bg-white/95 text-stone-900 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium placeholder:text-stone-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-12 top-3.5 text-stone-400 hover:text-stone-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => saveToRecent(query)}
              className="absolute right-2 top-2 px-3 py-1.5 bg-[#3B0A18] hover:bg-[#5A0E24] text-amber-100 font-bold rounded-lg text-xs"
            >
              Search
            </button>
          </div>

          {/* Search Scope Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-amber-200/80 font-medium">Search In:</span>
            {[
              { id: "all", label: "Entire Admin (Omni)" },
              { id: "mobile", label: "By Mobile Number", icon: Smartphone },
              { id: "userId", label: "By User ID", icon: User },
              { id: "email", label: "By Email", icon: Mail },
              { id: "txnId", label: "By Transaction ID", icon: CreditCard },
              { id: "profileId", label: "By Profile ID", icon: ShieldCheck },
            ].map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => setSearchScope(sc.id as any)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                  searchScope === sc.id
                    ? "bg-amber-400 text-stone-950 shadow-xs"
                    : "bg-black/30 text-amber-200 hover:bg-black/50"
                }`}
              >
                {sc.label}
              </button>
            ))}

            {query && (
              <button
                type="button"
                onClick={handleSaveCurrentAsPreset}
                className="ml-auto inline-flex items-center gap-1 text-[11px] text-amber-300 hover:text-white underline"
              >
                <Plus className="w-3 h-3" />
                Save query as Preset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recent Searches & Saved Presets Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Searches Box */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
              <History className="w-3.5 h-3.5 text-stone-500" />
              Recent Searches
            </div>
            {recentSearches.length > 0 && (
              <button
                type="button"
                onClick={clearRecentSearches}
                className="text-[11px] text-stone-400 hover:text-stone-600"
              >
                Clear History
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {recentSearches.length === 0 ? (
              <span className="text-xs text-stone-400">
                No recent searches yet.
              </span>
            ) : (
              recentSearches.map((term, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <Clock className="w-3 h-3 text-stone-400" />
                  {term}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Saved Search Presets Box */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
              <Bookmark className="w-3.5 h-3.5 text-amber-600" />
              Saved Search Presets
            </div>
            <span className="text-[11px] text-stone-400 font-mono">
              {savedPresets.length} presets
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {savedPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setQuery(preset.query);
                  toast({
                    title: `Applied Preset: ${preset.name}`,
                    description: preset.description,
                  });
                }}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#3B0A18] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <h3 className="font-bold text-sm text-stone-900">
            {query.trim()
              ? `Results for "${query}" (${searchResults.length} matches)`
              : "All Verified Profiles Database"}
          </h3>
          <span className="text-xs text-stone-500 font-mono">
            Indexing Scope: {searchScope.toUpperCase()}
          </span>
        </div>

        {searchResults.length === 0 && query.trim() ? (
          <div className="text-center py-12 text-stone-400">
            <Search className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <h4 className="font-bold text-stone-700">No matching records</h4>
            <p className="text-xs mt-1 max-w-sm mx-auto">
              No profiles or transactions match '{query}'. Try switching scope
              to "Entire Admin" or check for typos.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {(searchResults.length > 0 ? searchResults : accounts.slice(0, 10)).map(
              (acc) => {
                const fullName = `${acc.profile.first_name || ""} ${
                  acc.profile.last_name || ""
                }`;

                return (
                  <div
                    key={acc.user.id}
                    className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-stone-50/80 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          acc.profile.avatar_url ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                        }
                        alt={fullName}
                        className="w-10 h-10 rounded-full object-cover border border-stone-200 shadow-2xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-stone-900">
                            {fullName || "Unnamed Candidate"}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              acc.user.status === "active"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {acc.user.status.toUpperCase()}
                          </span>
                          <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                            {(acc.profile.membership_tier || "free").toUpperCase()}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                          <span className="font-mono text-stone-400">
                            ID: {acc.user.id}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-stone-400" />
                            {acc.user.email}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Smartphone className="w-3 h-3 text-stone-400" />
                            {acc.user.mobile || "No Mobile"}
                          </span>
                          <span>•</span>
                          <span>
                            {acc.profile.city || "City Not Set"}
                            {acc.profile.state ? `, ${acc.profile.state}` : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Link Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onNavigateTab("timeline");
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Clock className="w-3 h-3" />
                        Timeline
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onNavigateTab("users", `?search=${acc.user.id}`);
                        }}
                        className="px-3 py-1 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        Inspect Dossier
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}
