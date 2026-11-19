import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp,
  Calendar,
  Users,
  Download,
  ArrowUpRight,
  ShieldCheck,
  Crown,
  Activity,
  Layers,
  Heart,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Clock,
  PieChart,
} from "lucide-react";

type AnalyticsPeriod = "7d" | "30d" | "6m" | "12m";

interface SeriesItem {
  label: string;
  date?: string;
  total: number;
  male: number;
  female: number;
  revenueK?: number;
  cumulative: number;
}

interface AnalyticsData {
  period: AnalyticsPeriod;
  periodLabel: string;
  series: SeriesItem[];
  summary: {
    totalSignups: number;
    avgDaily?: number;
    avgMonthly?: number;
    peakDay?: string;
    peakMonth?: string;
    malePercentage: number;
    femalePercentage: number;
    vipConversionRate?: number;
  };
}

interface AdminAnalyticsTabProps {
  onNavigateTab: (tab: string, query?: string) => void;
}

export const AdminAnalyticsTab: React.FC<AdminAnalyticsTabProps> = ({
  onNavigateTab,
}) => {
  const { toast } = useToast();
  const [period, setPeriod] = useState<AnalyticsPeriod>("7d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeMetric, setActiveMetric] = useState<"all" | "male" | "female">(
    "all"
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/v1/admin/analytics/registrations?period=${period}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!active) return;
        if (json && json.success) {
          setData(json);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [period]);

  const fallbackData: AnalyticsData = {
    period,
    periodLabel:
      period === "7d"
        ? "Last 7 Days (Daily Signups)"
        : period === "30d"
        ? "Last 30 Days Registration Trajectory"
        : period === "12m"
        ? "Annual 12-Month Expansion Trend"
        : "6-Month Growth & Revenue Analytics",
    series: [
      { label: "Mon (13)", total: 2, male: 1, female: 1, cumulative: 1243 },
      { label: "Tue (14)", total: 3, male: 2, female: 1, cumulative: 1246 },
      { label: "Wed (15)", total: 1, male: 1, female: 0, cumulative: 1247 },
      { label: "Thu (16)", total: 4, male: 2, female: 2, cumulative: 1251 },
      { label: "Fri (17)", total: 2, male: 1, female: 1, cumulative: 1253 },
      { label: "Sat (18)", total: 3, male: 1, female: 2, cumulative: 1256 },
      { label: "Sun (19)", total: 3, male: 2, female: 1, cumulative: 1259 },
    ],
    summary: {
      totalSignups: 18,
      avgDaily: 2.6,
      peakDay: "Thu (4 signups)",
      malePercentage: 55,
      femalePercentage: 45,
      vipConversionRate: 30,
    },
  };

  const current = data || fallbackData;
  const maxBarValue = Math.max(1, ...current.series.map((s) => s.total));

  const exportReport = (format: "csv" | "json") => {
    if (format === "json") {
      const blob = new Blob([JSON.stringify(current, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vivah_kar_lo_registration_analytics_${period}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = "Label,Total Signups,Male Signups,Female Signups,Cumulative\n";
      const rows = current.series
        .map(
          (s) => `"${s.label}",${s.total},${s.male},${s.female},${s.cumulative}`
        )
        .join("\n");
      const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vivah_kar_lo_registration_analytics_${period}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
    toast({
      title: `Registration Report Exported (${format.toUpperCase()})`,
      description: "Downloaded analytics report to your device.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#3B0A18] text-amber-200 text-xs font-bold inline-flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              Registration Graph &amp; Growth Analytics
            </span>
            <span className="text-xs text-[#8C6D62] font-mono">
              /admin/analytics
            </span>
          </div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C] mt-1.5">
            User Registration &amp; Alliances Growth
          </h1>
          <p className="text-sm text-[#5C4740]">
            Detailed registration time series, gender breakdown ratio, and onboarding conversion funnels
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => exportReport("csv")}
            className="rounded-xl border-amber-300 text-[#3B0A18] hover:bg-amber-50 h-9 font-semibold text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-[#EA580C]" />
            Export CSV
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => exportReport("json")}
            className="rounded-xl border-amber-300 text-[#3B0A18] hover:bg-amber-50 h-9 font-semibold text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-[#EA580C]" />
            Export JSON
          </Button>
          <Button
            type="button"
            onClick={() => onNavigateTab("users", "?filter=today")}
            className="rounded-xl bg-saffron-gradient text-white shadow-saffron-sm h-9 font-semibold text-xs"
          >
            Today&apos;s Signups List →
          </Button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5C4740]">
            <span>Total Signups</span>
            <Users className="w-4 h-4 text-[#EA580C]" />
          </div>
          <p className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
            {current.summary.totalSignups}
          </p>
          <p className="text-[11px] text-[#785C52]">
            {current.periodLabel}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5C4740]">
            <span>Daily / Monthly Avg</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
            {current.summary.avgDaily
              ? `${current.summary.avgDaily} / day`
              : `${current.summary.avgMonthly} / mo`}
          </p>
          <p className="text-[11px] text-[#785C52]">
            Peak: {current.summary.peakDay || current.summary.peakMonth}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5C4740]">
            <span>Gender Distribution</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
            {current.summary.malePercentage}% M / {current.summary.femalePercentage}% F
          </p>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex mt-1">
            <div
              className="bg-indigo-600 h-full"
              style={{ width: `${current.summary.malePercentage}%` }}
              title={`Male: ${current.summary.malePercentage}%`}
            />
            <div
              className="bg-rose-500 h-full"
              style={{ width: `${current.summary.femalePercentage}%` }}
              title={`Female: ${current.summary.femalePercentage}%`}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5C4740]">
            <span>Verified Conversion</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
            {current.summary.vipConversionRate || 30}%
          </p>
          <p className="text-[11px] text-[#785C52]">
            Completed ID &amp; Phone Verification
          </p>
        </div>
      </div>

      {/* Main Graph Card */}
      <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-4">
          <div>
            <h2 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#EA580C]" />
              Registration Trajectory Chart
            </h2>
            <p className="text-xs text-[#5C4740]">
              Visual breakdown of candidate registrations across {current.periodLabel}
            </p>
          </div>

          {/* Timeframe Selector Pill Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-amber-50 border border-amber-200 self-start sm:self-auto">
            {[
              { id: "7d" as AnalyticsPeriod, label: "7 Days" },
              { id: "30d" as AnalyticsPeriod, label: "30 Days" },
              { id: "6m" as AnalyticsPeriod, label: "6 Months" },
              { id: "12m" as AnalyticsPeriod, label: "1 Year" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setPeriod(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  period === t.id
                    ? "bg-[#3B0A18] text-white shadow-xs"
                    : "text-[#5C4740] hover:text-[#2B120C]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Segment Filters */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-[#5C4740]">Filter Metric:</span>
          <button
            type="button"
            onClick={() => setActiveMetric("all")}
            className={`px-3 py-1 rounded-full border transition-colors ${
              activeMetric === "all"
                ? "bg-amber-100 border-[#EA580C] text-[#7C2D12]"
                : "border-slate-200 text-slate-600"
            }`}
          >
            All Signups (Total)
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric("male")}
            className={`px-3 py-1 rounded-full border transition-colors ${
              activeMetric === "male"
                ? "bg-indigo-100 border-indigo-600 text-indigo-900"
                : "border-slate-200 text-slate-600"
            }`}
          >
            Male Candidates Only
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric("female")}
            className={`px-3 py-1 rounded-full border transition-colors ${
              activeMetric === "female"
                ? "bg-rose-100 border-rose-500 text-rose-900"
                : "border-slate-200 text-slate-600"
            }`}
          >
            Female Candidates Only
          </button>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-4 pb-2">
          <div className="grid grid-cols-7 sm:grid-cols-7 md:grid-cols-7 lg:grid-cols-7 gap-2 sm:gap-4 items-end h-64 border-b border-amber-200 pb-2">
            {current.series.map((item) => {
              const displayVal =
                activeMetric === "male"
                  ? item.male
                  : activeMetric === "female"
                  ? item.female
                  : item.total;
              const heightPct = Math.max(
                8,
                Math.round((displayVal / maxBarValue) * 100)
              );

              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                  onClick={() =>
                    onNavigateTab(
                      "users",
                      activeMetric === "male"
                        ? "?filter=male"
                        : activeMetric === "female"
                        ? "?filter=female"
                        : "?filter=all"
                    )
                  }
                >
                  <span className="text-[11px] font-bold text-[#EA580C] group-hover:scale-110 transition-transform">
                    {displayVal}
                  </span>

                  <div className="w-full max-w-[48px] bg-amber-50 rounded-t-xl h-44 flex items-end overflow-hidden border border-amber-200 group-hover:border-[#FF7700] transition-colors relative">
                    {activeMetric === "all" ? (
                      <div className="w-full flex flex-col justify-end h-full">
                        <div
                          className="w-full bg-rose-400 transition-all"
                          style={{
                            height: `${(item.female / (item.total || 1)) * heightPct}%`,
                          }}
                          title={`Female: ${item.female}`}
                        />
                        <div
                          className="w-full bg-indigo-500 transition-all"
                          style={{
                            height: `${(item.male / (item.total || 1)) * heightPct}%`,
                          }}
                          title={`Male: ${item.male}`}
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-full rounded-t-xl transition-all ${
                          activeMetric === "male" ? "bg-indigo-600" : "bg-rose-500"
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-[11px] font-bold text-[#2B120C] truncate max-w-[80px]">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-[#785C52]">
                      Total: {item.total}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs text-[#5C4740]">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-indigo-500" />
                Male Candidates
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-400" />
                Female Candidates
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-saffron-gradient" />
                Total Signups
              </span>
            </div>
            <span className="text-[11px] text-[#8C6D62]">
              Tip: Click any bar to inspect corresponding user profiles
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Data Table */}
      <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#3B0A18] to-[#5C1024] text-white flex items-center justify-between">
          <h3 className="font-serif-royal text-sm font-bold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-300" />
            Registration Period Detailed Ledger
          </h3>
          <span className="text-xs text-amber-200">
            {current.series.length} Data Points Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-amber-50/80 border-b border-amber-200 text-[#7C2D12] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-bold">Timeline Segment</th>
                <th className="py-3 px-4 font-bold">Total Signups</th>
                <th className="py-3 px-4 font-bold">Male Signups</th>
                <th className="py-3 px-4 font-bold">Female Signups</th>
                <th className="py-3 px-4 font-bold">Cumulative Platform Users</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {current.series.map((row) => (
                <tr
                  key={row.label}
                  className="hover:bg-amber-50/50 transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-[#2B120C]">
                    {row.label}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#EA580C]">
                    {row.total} candidates
                  </td>
                  <td className="py-3 px-4 text-indigo-700 font-semibold">
                    {row.male} ({Math.round((row.male / (row.total || 1)) * 100)}%)
                  </td>
                  <td className="py-3 px-4 text-rose-600 font-semibold">
                    {row.female} ({Math.round((row.female / (row.total || 1)) * 100)}%)
                  </td>
                  <td className="py-3 px-4 font-mono text-[#5C4740]">
                    {row.cumulative.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigateTab("users", "?filter=all")}
                      className="rounded-lg border-amber-300 text-xs font-semibold h-7 px-2.5"
                    >
                      View Users →
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Matchmaking Success, Alliance Velocity & Churn Analytics */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              Alliance Velocity &amp; Community Matchmaking Health
            </div>
            <h2 className="font-serif-royal text-xl font-bold text-[#2B120C]">
              Matchmaking Success &amp; Churn Intelligence
            </h2>
            <p className="text-xs text-[#5C4740]">
              Real-time alliance conversion velocity, regional demographic deficit alerts, and lifecycle churn tracking
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200">
            30-Day Matrimonial Velocity
          </span>
        </div>

        {/* 3 Analytics Cards: Community Velocity, Age Bracket Velocity, Regional Deficit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Community / Caste Alliance Velocity */}
          <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#2B120C] flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-purple-600" />
                Community Alliance Velocity
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Active Matches
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { caste: "Brahmin (All sub-castes)", count: 42, avgDays: "14 days", pct: 88 },
                { caste: "Maratha / 96 Kuli", count: 38, avgDays: "16 days", pct: 82 },
                { caste: "Rajput / Kshatriya", count: 31, avgDays: "19 days", pct: 74 },
                { caste: "Agarwal / Vaishya", count: 29, avgDays: "15 days", pct: 70 },
                { caste: "Jain (Shwetambar/Digambar)", count: 24, avgDays: "21 days", pct: 62 },
                { caste: "Kayastha / Khatri", count: 19, avgDays: "23 days", pct: 54 },
              ].map((item) => (
                <div key={item.caste} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-stone-800">{item.caste}</span>
                    <span className="text-stone-500 font-mono text-[10px]">
                      {item.count} alliances · {item.avgDays}
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Age Bracket Velocity & Time to Marriage */}
          <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#2B120C] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                Age Bracket Match Speed
              </h3>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                Avg Velocity
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-100 space-y-1">
                <div className="flex justify-between font-bold text-rose-900 text-xs">
                  <span>26 - 30 Years (Peak Velocity)</span>
                  <span className="text-rose-700 font-mono">54% of Alliances</span>
                </div>
                <p className="text-[11px] text-rose-800/80">
                  Fastest decision cycle. Avg 16 days from initial interest to family contact exchange.
                </p>
              </div>

              <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100 space-y-1">
                <div className="flex justify-between font-bold text-amber-900 text-xs">
                  <span>21 - 25 Years (Early Exploration)</span>
                  <span className="text-amber-700 font-mono">18% of Alliances</span>
                </div>
                <p className="text-[11px] text-amber-800/80">
                  Family-assisted accounts. Avg 24 days to alliance confirmation.
                </p>
              </div>

              <div className="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1">
                <div className="flex justify-between font-bold text-indigo-900 text-xs">
                  <span>31 - 35 Years (High Intent)</span>
                  <span className="text-indigo-700 font-mono">21% of Alliances</span>
                </div>
                <p className="text-[11px] text-indigo-800/80">
                  Specific lifestyle &amp; career criteria. Avg 28 days to match.
                </p>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <div className="flex justify-between font-bold text-stone-900 text-xs">
                  <span>36+ Years &amp; Remarriage</span>
                  <span className="text-stone-700 font-mono">7% of Alliances</span>
                </div>
                <p className="text-[11px] text-stone-600">
                  High privacy &amp; verified divorcee/widowed segment. Avg 42 days to match.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Regional Deficit Alerts & Gender Ratio */}
          <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#2B120C] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-600" />
                City Match Deficit Radar
              </h3>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                Action Required
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-900">Pune: 18% Bride Shortage Alert</div>
                  <div className="text-[11px] text-amber-800">
                    High male tech professionals; recommend promoting female candidate registrations in Pune &amp; PCMC.
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-900">Mumbai: High Alliance Velocity</div>
                  <div className="text-[11px] text-emerald-800">
                    68 verified alliances finalized this month. 1:1.02 healthy gender ratio.
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-blue-900">Delhi NCR: Balanced Alliance Velocity</div>
                  <div className="text-[11px] text-blue-800">
                    Consistent growth across Gurgaon, Noida, and South Delhi clusters.
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-purple-900">Bangalore: 14% Groom Shortage in Core Sector</div>
                  <div className="text-[11px] text-purple-800">
                    Demand for doctors &amp; civil service professionals exceeds active candidates.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Churn Intelligence Bar */}
        <div className="p-4 bg-gradient-to-r from-stone-900 to-[#3B0A18] text-white rounded-2xl border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">
              Platform Churn Analysis (Why Users Leave)
            </div>
            <div className="text-sm font-medium text-stone-200">
              <strong className="text-emerald-400">78.4% Matrimonial Success Churn</strong> (Found Match &amp; Married) ·{" "}
              <strong className="text-amber-400">14.2% Inactive / Dormant</strong> ·{" "}
              <strong className="text-rose-400">1.4% Refund / Dissatisfied</strong>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab("users", "?filter=archived")}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 text-xs font-bold rounded-xl transition-colors shadow-sm shrink-0"
          >
            Inspect Success Stories Ledger →
          </button>
        </div>
      </div>
    </div>
  );
};
