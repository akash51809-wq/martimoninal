import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Activity,
  Search,
  Filter,
  Download,
  RotateCcw,
  UserPlus,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  Clock,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

interface ActivityItem {
  id: string;
  category: "registration" | "payment" | "kyc" | "verification" | "security" | "admin";
  type: string;
  title: string;
  userName: string;
  userId: string;
  gender?: string;
  avatar?: string;
  detail: string;
  timestamp: string;
  status: string;
  badge: string;
}

interface AdminActivityTabProps {
  onNavigateTab: (tab: string, query?: string) => void;
}

export const AdminActivityTab: React.FC<AdminActivityTabProps> = ({
  onNavigateTab,
}) => {
  const { toast } = useToast();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadActivities = () => {
    setLoading(true);
    const catQuery =
      selectedCategory !== "all" ? `?category=${selectedCategory}` : "";
    fetch(`/api/v1/admin/activity${catQuery}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.success && Array.isArray(json.activities)) {
          setActivities(json.activities);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadActivities();
  }, [selectedCategory]);

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      loadActivities();
    }, 12000);
    return () => clearInterval(timer);
  }, [autoRefresh, selectedCategory]);

  const filtered = activities.filter((act) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const hay = `${act.title} ${act.userName} ${act.userId} ${act.detail} ${act.type}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "registration":
        return <UserPlus className="w-4 h-4 text-emerald-600" />;
      case "kyc":
      case "verification":
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
      case "payment":
        return <CreditCard className="w-4 h-4 text-[#EA580C]" />;
      case "security":
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      default:
        return <Activity className="w-4 h-4 text-amber-600" />;
    }
  };

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "success":
      case "verified":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "paid":
        return "bg-amber-50 text-[#7C2D12] border-amber-300 font-bold";
      case "pending":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "expired":
        return "bg-slate-100 text-slate-700 border-slate-300";
      case "suspended":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-amber-50 text-amber-900 border-amber-200";
    }
  };

  const exportActivityLog = (format: "csv" | "json") => {
    if (format === "json") {
      const blob = new Blob([JSON.stringify(filtered, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vivah_kar_lo_platform_activity.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = "ID,Timestamp,Type,Member Name,User ID,Details,Status\n";
      const rows = filtered
        .map(
          (a) =>
            `"${a.id}","${a.timestamp}","${a.type}","${a.userName}","${a.userId}","${a.detail.replace(/"/g, '""')}","${a.status}"`
        )
        .join("\n");
      const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vivah_kar_lo_platform_activity.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
    toast({
      title: `Activity Audit Log Exported (${format.toUpperCase()})`,
      description: "Downloaded activity logs to your device.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#3B0A18] text-amber-200 text-xs font-bold inline-flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              Live Platform Activity Stream
            </span>
            <span className="text-xs text-[#8C6D62] font-mono">
              /admin/activity
            </span>
          </div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C] mt-1.5">
            Platform Activity &amp; Audit Trail
          </h1>
          <p className="text-sm text-[#5C4740]">
            Real-time feed of user registrations, KYC verifications, VIP memberships, and safety events
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => exportActivityLog("csv")}
            className="rounded-xl border-amber-300 text-[#3B0A18] hover:bg-amber-50 h-9 font-semibold text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-[#EA580C]" />
            Export CSV
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh((prev) => !prev)}
            className={`rounded-xl border h-9 font-semibold text-xs ${
              autoRefresh
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "border-slate-300 text-slate-700"
            }`}
          >
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            {autoRefresh ? "Auto-Refresh: ON" : "Auto-Refresh: OFF"}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={loadActivities}
            className="rounded-xl bg-[#3B0A18] text-white hover:bg-[#5B1325] h-9 font-semibold text-xs"
          >
            <RotateCcw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activity by member, action, or details..."
            className="h-10 pl-10 rounded-xl border-amber-200 bg-[#FFFDF9] text-sm"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2">
          {[
            { id: "all", label: "All Activities" },
            { id: "registration", label: "Registrations" },
            { id: "kyc", label: "KYC & Verification" },
            { id: "payment", label: "VIP Payments" },
            { id: "security", label: "Security & Reports" },
            { id: "admin", label: "Admin Actions" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                selectedCategory === cat.id
                  ? "bg-[#3B0A18] text-amber-100 border-[#3B0A18]"
                  : "bg-amber-50/70 text-[#5C4740] border-amber-200 hover:bg-amber-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Activity Stream List */}
      <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm overflow-hidden divide-y divide-amber-100">
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#3B0A18] to-[#5C1024] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-300" />
            <h2 className="font-serif-royal text-sm font-bold">
              Activity Stream ({filtered.length} Events)
            </h2>
          </div>
          <span className="text-xs text-amber-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Event Listener Active
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-[#5C4740] space-y-2">
            <p className="font-semibold text-base">No activity events found</p>
            <p className="text-xs">
              Try adjusting your search query or switching to &ldquo;All Activities&rdquo;.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 hover:bg-amber-50/50 transition-colors flex items-start gap-4"
            >
              {/* Avatar / Photo */}
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-xl overflow-hidden border border-amber-200 bg-amber-100 shadow-xs">
                  <img
                    src={item.avatar || "/1.jpg"}
                    alt={item.userName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white border border-amber-200 shadow-xs">
                  {getCategoryIcon(item.category)}
                </div>
              </div>

              {/* Activity Details */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="font-serif-royal text-sm font-bold text-[#2B120C]">
                      {item.userName}
                    </p>
                    <span className="font-mono text-[11px] text-[#7C2D12]">
                      ({item.userId})
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(
                        item.status
                      )}`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#8C6D62] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-xs font-semibold text-[#3B0A18]">
                  {item.title}
                </p>
                <p className="text-xs text-[#5C4740] leading-relaxed">
                  {item.detail}
                </p>

                {/* Deep Link to User Record */}
                <div className="pt-1.5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigateTab("users", `?filter=all`)}
                    className="text-[11px] font-bold text-[#EA580C] hover:underline inline-flex items-center gap-1"
                  >
                    Inspect User Profile <ExternalLink className="w-3 h-3" />
                  </button>
                  {item.category === "kyc" && (
                    <button
                      type="button"
                      onClick={() => onNavigateTab("kyc")}
                      className="text-[11px] font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
                    >
                      Open KYC Desk <ShieldCheck className="w-3 h-3" />
                    </button>
                  )}
                  {item.category === "payment" && (
                    <button
                      type="button"
                      onClick={() => onNavigateTab("payments")}
                      className="text-[11px] font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                    >
                      View Transaction <CreditCard className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
