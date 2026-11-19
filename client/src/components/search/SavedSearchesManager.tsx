import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import type { SavedSearchItem, AdvancedSearchFilters } from "@/types/matchAndSearchTypes";
import {
  BookmarkCheck,
  Play,
  Trash2,
  Bell,
  BellOff,
  Sparkles,
  Calendar,
  AlertCircle,
  Clock,
} from "lucide-react";

interface SavedSearchesManagerProps {
  userId?: string;
  onRunSearch: (filters: AdvancedSearchFilters, name: string) => void;
  refreshTrigger?: number;
}

export const SavedSearchesManager: React.FC<SavedSearchesManagerProps> = ({
  userId = "usr-active-complete",
  onRunSearch,
  refreshTrigger = 0,
}) => {
  const { toast } = useToast();
  const [savedSearches, setSavedSearches] = useState<SavedSearchItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSavedSearches = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/search/saved/${userId}`);
      const data = await res.json();
      if (data.success && data.savedSearches) {
        setSavedSearches(data.savedSearches);
      }
    } catch (err) {
      console.warn("Falling back to local saved search list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedSearches();
  }, [userId, refreshTrigger]);

  const handleDelete = async (searchId: string, searchName: string) => {
    try {
      const res = await fetch(`/api/v1/search/saved/${userId}/${searchId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setSavedSearches((prev) => prev.filter((s) => s.id !== searchId));
      toast({
        title: "Saved Search Removed",
        description: `"${searchName}" has been deleted from your saved queries.`,
      });
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: err.message || "Could not delete saved search.",
        variant: "destructive",
      });
    }
  };

  const handleToggleAlert = async (searchId: string, currentAlert: boolean) => {
    const nextAlert = !currentAlert;
    try {
      const res = await fetch(
        `/api/v1/search/saved/${userId}/${searchId}/toggle-alert`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alertsEnabled: nextAlert }),
        }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setSavedSearches((prev) =>
        prev.map((s) =>
          s.id === searchId ? { ...s, alertsEnabled: nextAlert } : s
        )
      );

      toast({
        title: nextAlert ? "Email & Push Alerts Enabled" : "Alerts Muted",
        description: nextAlert
          ? "You will receive real-time notifications whenever a new matching profile registers."
          : "Notification alerts turned off for this search criteria.",
      });
    } catch (err: any) {
      toast({
        title: "Could not update alert status",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="w-8 h-8 border-3 border-amber-200 border-t-[#EA580C] rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs text-[#5C4740]">Loading saved searches...</span>
      </div>
    );
  }

  if (savedSearches.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-amber-200/80 p-8 text-center space-y-3">
        <BookmarkCheck className="w-10 h-10 text-amber-500 mx-auto" />
        <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
          No Saved Searches Yet
        </h3>
        <p className="text-xs text-[#5C4740] max-w-sm mx-auto">
          Save your favourite search filters to re-run them with one click and get notified whenever a newly registered profile matches your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-[#5C4740] pb-2 border-b border-amber-100">
        <span className="font-semibold">
          Saved Query Criteria &amp; Match Alerts ({savedSearches.length})
        </span>
        <span className="text-[11px] text-[#7C2D12]">
          Instant Re-run &amp; Real-time Alerts
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedSearches.map((item) => {
          const filterSummary: string[] = [];
          if (item.filters.isGovtJob) filterSummary.push("Govt Job");
          if (item.filters.isPremierInstitute) filterSummary.push("IIT / IIM");
          if (item.filters.isNri) filterSummary.push("NRI Only");
          if (item.filters.minIncomeLpa)
            filterSummary.push(`₹${item.filters.minIncomeLpa}L+ Income`);
          if (item.filters.castes && item.filters.castes.length > 0)
            filterSummary.push(`Caste: ${item.filters.castes.join(", ")}`);
          if (item.filters.cities && item.filters.cities.length > 0)
            filterSummary.push(`City: ${item.filters.cities.join(", ")}`);
          if (item.filters.manglik) filterSummary.push(item.filters.manglik);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-amber-200/90 p-4 sm:p-5 shadow-sm space-y-3 hover:border-amber-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-serif-royal text-base font-bold text-[#2B120C]">
                    {item.searchName}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-bold text-[#7C2D12] shrink-0">
                    {item.matchCount || 0} Matches
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mt-2.5">
                  {filterSummary.length > 0 ? (
                    filterSummary.map((f, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-amber-50/70 text-[11px] font-medium text-[#5C4740] border border-amber-100"
                      >
                        {f}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-[#5C4740]">
                      Broad search criteria
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-amber-100 flex items-center justify-between gap-3 text-xs">
                {/* Alert Toggle */}
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.alertsEnabled}
                    onCheckedChange={() =>
                      handleToggleAlert(item.id, item.alertsEnabled)
                    }
                    className="data-[state=checked]:bg-[#EA580C]"
                    aria-label="Toggle match alerts"
                  />
                  <span className="text-[11px] text-[#5C4740] flex items-center gap-1">
                    {item.alertsEnabled ? (
                      <>
                        <Bell className="w-3 h-3 text-[#EA580C]" />
                        <span>Alerts On</span>
                      </>
                    ) : (
                      <>
                        <BellOff className="w-3 h-3 text-gray-400" />
                        <span>Muted</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Actions: Run & Delete */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => onRunSearch(item.filters, item.searchName)}
                    className="h-8 rounded-lg bg-saffron-gradient text-white text-xs font-semibold px-3 shadow-sm hover:opacity-95"
                  >
                    <Play className="w-3 h-3 mr-1 fill-white" />
                    Run Search
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id, item.searchName)}
                    className="h-8 w-8 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    title="Delete saved search"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
