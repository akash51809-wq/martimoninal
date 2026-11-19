import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Navigation,
  Sparkles,
  Heart,
  Briefcase,
  GraduationCap,
  Eye,
  Filter,
  CheckCircle2,
  Globe2,
  Building,
  RotateCcw,
} from "lucide-react";

interface MapProfileSearchProps {
  onViewProfile: (profile: any) => void;
  onSendInterest?: (profile: any) => void;
  onOpenChat?: (profileId: string) => void;
  viewerUserId?: string;
}

export const MapProfileSearch: React.FC<MapProfileSearchProps> = ({
  onViewProfile,
  onSendInterest,
  onOpenChat,
  viewerUserId = "usr-active-complete",
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [clusters, setClusters] = useState<any[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<any>(null);
  const [filterMode, setFilterMode] = useState<"all" | "india" | "nri">("all");
  const [radiusKm, setRadiusKm] = useState<number>(500);
  const [searchCityQuery, setSearchCityQuery] = useState<string>("");

  const fetchMapData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/search/map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maxRadiusKm: radiusKm,
          isNriOnly: filterMode === "nri",
          viewerUserId,
        }),
      });
      const data = await res.json();
      if (data.success && data.clusters) {
        setClusters(data.clusters);
        // Default select first cluster (e.g. Pune or Mumbai)
        if (!selectedCluster && data.clusters.length > 0) {
          const defaultCity = data.clusters.find((c: any) => c.city === "Pune") || data.clusters[0];
          setSelectedCluster(defaultCity);
        }
      }
    } catch (err) {
      console.error("Map search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, [filterMode, radiusKm]);

  const filteredClusters = clusters.filter((c) => {
    if (filterMode === "india" && c.isNri) return false;
    if (filterMode === "nri" && !c.isNri) return false;
    if (searchCityQuery.trim()) {
      const q = searchCityQuery.toLowerCase();
      return c.city.toLowerCase().includes(q) || c.state.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Map Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-3xl bg-white border border-amber-200 shadow-sm gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-[#7C2D12]">
            <MapPin className="w-4 h-4 text-[#EA580C]" />
            <span>Interactive Geospatial Match Explorer</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center p-1 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1 rounded-xl transition-all ${
                filterMode === "all" ? "bg-white text-[#7C2D12] shadow-xs font-bold" : "text-[#5C4740]"
              }`}
            >
              All Hubs
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("india")}
              className={`px-3 py-1 rounded-xl transition-all ${
                filterMode === "india" ? "bg-white text-[#7C2D12] shadow-xs font-bold" : "text-[#5C4740]"
              }`}
            >
              India Cities
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("nri")}
              className={`px-3 py-1 rounded-xl transition-all ${
                filterMode === "nri" ? "bg-white text-[#7C2D12] shadow-xs font-bold" : "text-[#5C4740]"
              }`}
            >
              ✈️ NRI Global Hubs
            </button>
          </div>
        </div>

        {/* City Filter Search Input */}
        <div className="w-full md:w-64">
          <Input
            type="text"
            placeholder="Search city (e.g. Pune, London)..."
            value={searchCityQuery}
            onChange={(e) => setSearchCityQuery(e.target.value)}
            className="rounded-xl border-amber-200 text-xs h-9 bg-[#FFFDF9]"
          />
        </div>
      </div>

      {/* Map Visual Container & City Drawer Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Interactive Stylized Map Visualizer (7 Cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#FFF9F0] via-amber-50 to-orange-50 rounded-3xl border border-amber-200 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden min-h-[460px] shadow-sm">
          {/* Stylized Compass Grid Background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(#EA580C 1px, transparent 1px), radial-gradient(#EA580C 1px, #FFF9F0 1px)",
              backgroundSize: "28px 28px",
              backgroundPosition: "0 0, 14px 14px",
            }}
          />

          {/* Top Map HUD Status */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-bold text-[#7C2D12] flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-[#EA580C]" />
              {filteredClusters.length} Geographic Hubs Identified
            </span>
            <span className="text-[11px] font-semibold text-[#5C4740]">
              Click any city pin to inspect profiles
            </span>
          </div>

          {/* City Cluster Pins Grid (Visual Interactive Pin Matrix) */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-6">
            {filteredClusters.map((cluster) => {
              const isSelected = selectedCluster?.city === cluster.city;
              return (
                <button
                  key={cluster.city}
                  type="button"
                  onClick={() => setSelectedCluster(cluster)}
                  className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                    isSelected
                      ? "bg-white border-[#EA580C] shadow-md ring-2 ring-[#EA580C]/20 scale-102"
                      : "bg-white/85 hover:bg-white border-amber-200/90 hover:border-amber-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-sm font-bold text-[#2B120C] flex items-center gap-1">
                      <MapPin
                        className={`w-3.5 h-3.5 ${
                          isSelected ? "text-[#EA580C] fill-[#EA580C]" : "text-amber-500"
                        }`}
                      />
                      {cluster.city}
                    </span>
                    <Badge
                      className={`text-[10px] px-1.5 py-0 h-5 border-0 ${
                        isSelected
                          ? "bg-[#EA580C] text-white"
                          : "bg-amber-100 text-[#7C2D12]"
                      }`}
                    >
                      {cluster.count}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-[#5C4740] block truncate">
                    {cluster.state} {cluster.isNri && "• NRI Hub"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Selected Cluster Radar Bar */}
          {selectedCluster && (
            <div className="relative z-10 p-3.5 rounded-2xl bg-white/95 border border-amber-200 flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#EA580C]" />
                <span className="text-xs font-bold text-[#2B120C]">
                  Target Cluster: {selectedCluster.city}, {selectedCluster.state}
                </span>
              </div>
              <span className="text-xs font-extrabold text-[#7C2D12]">
                {selectedCluster.count} Verified Matches
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Profiles from Selected City (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-amber-200 p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div>
                <h4 className="font-serif-royal text-lg font-bold text-[#2B120C]">
                  {selectedCluster ? `${selectedCluster.city} Alliances` : "Select a Location"}
                </h4>
                <p className="text-xs text-[#5C4740]">
                  {selectedCluster
                    ? `Showing ${selectedCluster.profiles.length} profiles from ${selectedCluster.city}`
                    : "Choose a geographical city pin on the map to explore."}
                </p>
              </div>

              {selectedCluster && (
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-[#7C2D12] text-xs font-bold">
                  {selectedCluster.profiles.length} Profiles
                </span>
              )}
            </div>

            {/* Profiles Cards List in Cluster */}
            <div className="space-y-3 mt-4 max-h-[500px] overflow-y-auto pr-1">
              {!selectedCluster || selectedCluster.profiles.length === 0 ? (
                <div className="py-16 text-center text-xs text-[#5C4740]">
                  No profiles available in this city cluster.
                </div>
              ) : (
                selectedCluster.profiles.map((p: any) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-amber-200/90 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between space-y-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="w-13 h-13 rounded-2xl object-cover object-top border border-amber-200 shrink-0"
                      />
                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-serif-royal text-sm font-bold text-[#2B120C] truncate">
                            {p.name}
                          </h5>
                          <span className="text-[10px] font-bold text-[#EA580C]">
                            ✨ {p.kundliScore}/36
                          </span>
                        </div>
                        <p className="text-xs text-[#5C4740] truncate">
                          {p.age} Yrs • {p.height} • {p.caste}
                        </p>
                        <p className="text-[11px] font-semibold text-[#2B120C] truncate mt-0.5">
                          {p.profession}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-amber-100 text-xs">
                      <span className="text-[11px] font-bold text-[#7C2D12]">
                        💰 {p.income}
                      </span>

                      <div className="flex items-center gap-2">
                        {onSendInterest && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => onSendInterest(p)}
                            className="rounded-xl bg-saffron-gradient text-white font-bold text-[11px] h-7 px-3"
                          >
                            <Heart className="w-3 h-3 mr-1" />
                            Interest
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onViewProfile(p)}
                          className="rounded-xl border-amber-200 text-[#5C4740] text-[11px] h-7 px-2.5"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
