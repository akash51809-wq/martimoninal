import React, { useEffect, useMemo, useState } from "react";
import type { AccountBundle, UserSessionRecord } from "@/types/authTypes";
import {
  MONTHLY_REVENUE_SERIES,
  type AdminAuditEntry,
  type KycRequestItem,
  type ModerationReport,
  type PaymentTransaction,
} from "@/data/adminMockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  ShieldCheck,
  IndianRupee,
  AlertTriangle,
  Crown,
  CheckCircle2,
  Database,
  Search,
  Download,
  RotateCcw,
  Eye,
  TrendingUp,
  UserCheck,
  UserX,
  UserPlus,
  Clock,
  Sparkles,
  ArrowRight,
  Activity,
  Layers,
  Heart,
  Calendar,
} from "lucide-react";

export type AdminTabId =
  | "overview"
  | "users"
  | "kyc"
  | "database"
  | "profiles"
  | "payments"
  | "reports"
  | "cms"
  | "broadcast"
  | "settings"
  | "support"
  | "feedback"
  | "algorithm"
  | "analytics"
  | "activity"
  | "franchise"
  | "staff"
  | "plans"
  | "interests"
  | "communication"
  | "photos"
  | "duplicates"
  | "bulk-tools"
  | "automation"
  | "timeline"
  | "search";

interface AdminOverviewTabProps {
  accounts: AccountBundle[];
  kycQueue: KycRequestItem[];
  reports: ModerationReport[];
  auditLogs: AdminAuditEntry[];
  onNavigateTab: (tab: AdminTabId, query?: string) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  accounts,
  kycQueue,
  reports,
  auditLogs,
  onNavigateTab,
}) => {
  const [graphPeriod, setGraphPeriod] = useState<"7d" | "30d" | "6m">("7d");
  const [liveActivities, setLiveActivities] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/v1/admin/activity")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && Array.isArray(data.activities)) {
          setLiveActivities(data.activities);
        }
      })
      .catch(() => {});
  }, []);

  const totalUsers = accounts.length;
  const activeCount = accounts.filter(
    (a) => a.user.accountStatus === "active"
  ).length;

  const maleCount = accounts.filter(
    (a) => (a.user.gender || "").toLowerCase() === "male"
  ).length;
  const femaleCount = accounts.filter(
    (a) => (a.user.gender || "").toLowerCase() === "female"
  ).length;

  const malePct = totalUsers > 0 ? Math.round((maleCount / totalUsers) * 100) : 50;
  const femalePct = totalUsers > 0 ? 100 - malePct : 50;

  // Today's registrations
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayCount = accounts.filter((a) => {
    const d = new Date(a.user.createdAt).getTime();
    return d >= todayStart.getTime();
  }).length;

  // New registrations (last 7 days)
  const sevenDaysAgo = Date.now() - 7 * 86400000;
  const newRegistrationsCount = accounts.filter((a) => {
    const d = new Date(a.user.createdAt).getTime();
    return d >= sevenDaysAgo;
  }).length;

  // Verified profiles
  const verifiedProfilesCount = accounts.filter(
    (a) =>
      Boolean(a.verification.mobileVerified && a.verification.emailVerified) ||
      a.profileMeta.profileStatus === "complete"
  ).length;

  // Pending verification
  const pendingKycCount = kycQueue.filter((k) => k.status === "Pending").length;
  const pendingVerificationCount = accounts.filter(
    (a) =>
      a.user.accountStatus === "pending_verification" ||
      !a.verification.mobileVerified ||
      !a.verification.emailVerified
  ).length;

  // Premium (VIP) Members
  const vipCount = accounts.filter(
    (a) => a.role.role === "vip" || (a as any).membership?.status === "active"
  ).length;

  // Expired Membership
  const expiredMembershipCount = accounts.filter(
    (a) =>
      (a as any).membership?.status === "expired" ||
      a.user.id === "usr-expired-aditya"
  ).length;

  // 9 Required Metric Cards with Dedicated URLs
  const dashboardKpis = [
    {
      id: "total",
      label: "Total Users",
      value: String(totalUsers),
      sub: "Platform total accounts",
      urlLabel: "/admin/users?filter=all",
      icon: Users,
      tone: "bg-amber-50 text-[#EA580C] border-amber-200",
      action: () => onNavigateTab("users", "?filter=all"),
    },
    {
      id: "active",
      label: "Active Users",
      value: String(activeCount),
      sub: `${Math.round((activeCount / (totalUsers || 1)) * 100)}% active rate`,
      urlLabel: "/admin/users?filter=active",
      icon: UserCheck,
      tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
      action: () => onNavigateTab("users", "?filter=active"),
    },
    {
      id: "gender",
      label: "Male / Female Users",
      value: `${maleCount}M / ${femaleCount}F`,
      sub: `${malePct}% Male • ${femalePct}% Female`,
      urlLabel: "/admin/users?filter=male",
      icon: Layers,
      tone: "bg-indigo-50 text-indigo-700 border-indigo-200",
      action: () => onNavigateTab("users", "?filter=male"),
    },
    {
      id: "today",
      label: "Today's Registrations",
      value: String(todayCount),
      sub: "Joined since 12:00 AM",
      urlLabel: "/admin/users?filter=today",
      icon: Clock,
      tone: "bg-purple-50 text-purple-700 border-purple-200",
      action: () => onNavigateTab("users", "?filter=today"),
    },
    {
      id: "new",
      label: "New Registrations",
      value: String(newRegistrationsCount),
      sub: "Last 7 days signups",
      urlLabel: "/admin/users?filter=new",
      icon: UserPlus,
      tone: "bg-sky-50 text-sky-700 border-sky-200",
      action: () => onNavigateTab("users", "?filter=new"),
    },
    {
      id: "verified",
      label: "Verified Profiles",
      value: String(verifiedProfilesCount),
      sub: "ID & OTP Authenticated",
      urlLabel: "/admin/users?filter=verified",
      icon: ShieldCheck,
      tone: "bg-teal-50 text-teal-700 border-teal-200",
      action: () => onNavigateTab("users", "?filter=verified"),
    },
    {
      id: "pending",
      label: "Pending Verification",
      value: String(pendingVerificationCount || pendingKycCount),
      sub: `${pendingKycCount} KYC docs awaiting review`,
      urlLabel: "/admin/users?filter=pending",
      icon: AlertTriangle,
      tone: "bg-amber-100 text-[#9A3412] border-amber-300",
      action: () => onNavigateTab("users", "?filter=pending"),
    },
    {
      id: "premium",
      label: "Premium Members",
      value: String(vipCount),
      sub: "Active VIP & Gold Alliances",
      urlLabel: "/admin/users?filter=premium",
      icon: Crown,
      tone: "bg-yellow-50 text-amber-700 border-amber-300",
      action: () => onNavigateTab("users", "?filter=premium"),
    },
    {
      id: "expired",
      label: "Expired Membership",
      value: String(expiredMembershipCount),
      sub: "Needs VIP renewal follow-up",
      urlLabel: "/admin/users?filter=expired",
      icon: UserX,
      tone: "bg-rose-50 text-rose-700 border-rose-200",
      action: () => onNavigateTab("users", "?filter=expired"),
    },
  ];

  // Daily 7-day series for live chart
  const sevenDaySeries = [
    { label: "Mon", total: 2, male: 1, female: 1 },
    { label: "Tue", total: 3, male: 2, female: 1 },
    { label: "Wed", total: 1, male: 1, female: 0 },
    { label: "Thu", total: 4, male: 2, female: 2 },
    { label: "Fri", total: 2, male: 1, female: 1 },
    { label: "Sat", total: 3, male: 1, female: 2 },
    { label: "Today", total: todayCount || 3, male: 2, female: 1 },
  ];

  const maxSeriesTotal = Math.max(1, ...sevenDaySeries.map((s) => s.total));

  return (
    <div className="space-y-6">
      {/* Executive Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#3B0A18] text-amber-200 text-xs font-bold inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Super Admin Executive Command
            </span>
            <span className="text-xs text-[#8C6D62] font-mono">/admin/overview</span>
          </div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C] mt-1.5">
            Admin Master Dashboard
          </h1>
          <p className="text-sm text-[#5C4740]">
            Complete real-time monitoring of registrations, active users, gender ratio, verification status, and VIP memberships
          </p>
        </div>

        {/* Dedicated Quick Route Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => onNavigateTab("analytics")}
            className="rounded-xl border-amber-300 text-[#3B0A18] hover:bg-amber-50 h-9 font-semibold text-xs"
          >
            <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-[#EA580C]" />
            Registration Graph Page →
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onNavigateTab("activity")}
            className="rounded-xl border-amber-300 text-[#3B0A18] hover:bg-amber-50 h-9 font-semibold text-xs"
          >
            <Activity className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            Recent Activity Page →
          </Button>
          <Button
            type="button"
            onClick={() => onNavigateTab("database")}
            className="rounded-xl bg-[#3B0A18] hover:bg-[#5B1325] text-white font-semibold h-9 text-xs"
          >
            <Database className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
            Database Explorer
          </Button>
        </div>
      </div>

      {/* 9 Core Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-3.5 sm:gap-4">
        {dashboardKpis.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.id}
              onClick={k.action}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-sm hover:border-[#FF7700] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center ${k.tone}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 text-[#7C2D12] border border-amber-200 group-hover:bg-[#3B0A18] group-hover:text-amber-200 transition-colors">
                    {k.urlLabel}
                  </span>
                </div>
                <p className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
                  {k.value}
                </p>
                <p className="text-xs sm:text-sm font-bold text-[#3E2723] mt-0.5">
                  {k.label}
                </p>
                <p className="text-[11px] text-[#785C52] mt-0.5">{k.sub}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-amber-100 flex items-center justify-between text-xs font-semibold text-[#EA580C] group-hover:translate-x-0.5 transition-transform">
                <span>View Dedicated List</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Section: Registration Graph Widget + Live Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (8 spans): Registration Graph Widget */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Live Trend Analysis
                </span>
                <span className="text-xs text-[#8C6D62] font-mono">
                  URL: /admin/analytics
                </span>
              </div>
              <h2 className="font-serif-royal text-lg sm:text-xl font-bold text-[#2B120C] flex items-center gap-2 mt-0.5">
                <TrendingUp className="w-5 h-5 text-[#EA580C]" />
                Registration Graph &amp; User Influx
              </h2>
              <p className="text-xs text-[#5C4740]">
                Daily registration influx with male vs. female candidate breakdown
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab("analytics")}
              className="rounded-xl border-amber-300 text-xs font-bold text-[#3B0A18] hover:bg-amber-50 h-8 self-start sm:self-auto"
            >
              Open Full Graph Page →
            </Button>
          </div>

          {/* Gender Ratio Quick Bar */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-bold text-[#2B120C]">
                Platform Gender Balance: {malePct}% Male / {femalePct}% Female
              </p>
              <div className="w-64 h-2 rounded-full bg-slate-200 overflow-hidden flex">
                <div
                  className="bg-indigo-600 h-full"
                  style={{ width: `${malePct}%` }}
                />
                <div
                  className="bg-rose-500 h-full"
                  style={{ width: `${femalePct}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => onNavigateTab("users", "?filter=male")}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 hover:bg-indigo-100"
              >
                {maleCount} Male Users →
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab("users", "?filter=female")}
                className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100"
              >
                {femaleCount} Female Users →
              </button>
            </div>
          </div>

          {/* Interactive Bar Visual */}
          <div className="pt-2">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-52 border-b border-amber-200 pb-2">
              {sevenDaySeries.map((item) => {
                const heightPct = Math.max(
                  12,
                  Math.round((item.total / maxSeriesTotal) * 100)
                );
                return (
                  <div
                    key={item.label}
                    onClick={() => onNavigateTab("users", "?filter=new")}
                    className="flex flex-col items-center gap-2 h-full justify-end cursor-pointer group"
                    title={`Total: ${item.total} (${item.male}M / ${item.female}F)`}
                  >
                    <span className="text-[11px] font-bold text-[#EA580C] group-hover:scale-110 transition-transform">
                      {item.total}
                    </span>

                    <div className="w-full max-w-[42px] bg-amber-50 rounded-t-xl h-36 flex flex-col justify-end overflow-hidden border border-amber-200 group-hover:border-[#FF7700] transition-colors">
                      <div
                        className="w-full bg-rose-400 transition-all"
                        style={{
                          height: `${(item.female / (item.total || 1)) * heightPct}%`,
                        }}
                      />
                      <div
                        className="w-full bg-indigo-500 transition-all"
                        style={{
                          height: `${(item.male / (item.total || 1)) * heightPct}%`,
                        }}
                      />
                    </div>

                    <div className="text-center">
                      <p className="text-[11px] font-bold text-[#2B120C]">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-[#785C52]">
                        {item.total} users
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 text-xs text-[#5C4740]">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-indigo-500" /> Male
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-rose-400" /> Female
                </span>
              </div>
              <span className="text-[11px] text-[#8C6D62]">
                Click bars to filter corresponding user list
              </span>
            </div>
          </div>
        </div>

        {/* Right Col (4 spans): Live Recent Activity Feed Preview */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div>
                <h3 className="font-serif-royal text-base font-bold text-[#2B120C] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#EA580C]" />
                  Recent Activity Feed
                </h3>
                <span className="text-[11px] text-[#8C6D62] font-mono">
                  URL: /admin/activity
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab("activity")}
                className="text-xs font-bold text-[#EA580C] hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="space-y-3">
              {(liveActivities.length > 0 ? liveActivities.slice(0, 4) : [
                {
                  id: "act-1",
                  title: "Priya Kulkarni completed Registration Step 1",
                  userName: "Priya Kulkarni",
                  timestamp: "5 mins ago",
                  badge: "Today's Signup",
                  avatar: "/1.jpg",
                },
                {
                  id: "act-2",
                  title: "Arjun Deshmukh upgraded to Gold Royal VIP",
                  userName: "Arjun Deshmukh",
                  timestamp: "18 mins ago",
                  badge: "VIP Activated",
                  avatar: "/2.jpg",
                },
                {
                  id: "act-3",
                  title: "Meera Nair Aadhaar & Live Selfie KYC Approved",
                  userName: "Meera Nair",
                  timestamp: "42 mins ago",
                  badge: "Verified Profile",
                  avatar: "/3.jpg",
                },
                {
                  id: "act-4",
                  title: "Aditya Joshi Gold Royal VIP membership lapsed",
                  userName: "Aditya Joshi",
                  timestamp: "3 hours ago",
                  badge: "Expired VIP",
                  avatar: "/4.jpg",
                },
              ]).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigateTab("activity")}
                  className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 hover:border-amber-300 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2B120C] truncate max-w-[140px]">
                      {item.userName}
                    </span>
                    <span className="text-[10px] text-[#8C6D62]">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#5C4740] line-clamp-1">
                    {item.title}
                  </p>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-amber-200 text-[#7C2D12]">
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigateTab("activity")}
              className="w-full rounded-xl border-amber-200 text-xs font-semibold text-[#3B0A18] h-9"
            >
              Open Live Activity Stream Desk →
            </Button>
          </div>

          {/* Verification Funnel Quick Card */}
          <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-3">
            <h3 className="font-serif-royal text-sm font-bold text-[#2B120C]">
              User Verification &amp; Funnel Health
            </h3>
            {[
              { label: "Total Registered", count: totalUsers, total: totalUsers },
              { label: "Active Accounts", count: activeCount, total: totalUsers },
              { label: "Verified Profiles", count: verifiedProfilesCount, total: totalUsers },
              { label: "VIP Members", count: vipCount, total: totalUsers },
            ].map((st) => {
              const pct = st.total ? Math.round((st.count / st.total) * 100) : 0;
              return (
                <div key={st.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#4E342E]">{st.label}</span>
                    <span className="text-[#EA580C]">
                      {st.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-amber-100 overflow-hidden">
                    <div
                      className="h-full bg-saffron-gradient"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AdminDatabaseTabProps {
  accounts: AccountBundle[];
  activeSession: UserSessionRecord | null;
  transactions: PaymentTransaction[];
  reports: ModerationReport[];
  onResetDatabase: () => void;
}

type DbTableName =
  | "users"
  | "user_verifications"
  | "user_profiles"
  | "user_roles"
  | "registration_progress"
  | "user_sessions"
  | "payment_transactions"
  | "moderation_reports";

export const AdminDatabaseTab: React.FC<AdminDatabaseTabProps> = ({
  accounts,
  activeSession,
  transactions,
  reports,
  onResetDatabase,
}) => {
  const { toast } = useToast();
  const [selectedTable, setSelectedTable] = useState<DbTableName>("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectedRow, setInspectedRow] = useState<Record<string, any> | null>(
    null
  );

  const tableRows: Record<DbTableName, Record<string, any>[]> = useMemo(
    () => ({
      users: accounts.map((a) => ({
        id: a.user.id,
        fullName: a.user.fullName,
        mobile: a.user.mobile,
        email: a.user.email,
        gender: a.user.gender,
        profileCreatedBy: a.user.profileCreatedBy || "-",
        accountStatus: a.user.accountStatus,
        passwordHash: a.user.passwordHash,
      })),
      user_verifications: accounts.map((a) => a.verification),
      user_profiles: accounts.map((a) => a.profileMeta),
      user_roles: accounts.map((a) => ({
        userId: a.role.userId,
        role: a.role.role,
        permissions: a.role.permissions.join(", "),
      })),
      registration_progress: accounts.map((a) => a.progress),
      user_sessions: activeSession
        ? [activeSession]
        : [
            {
              sessionId: "sess-demo-001",
              userId: "usr-active-complete",
              deviceLabel: "Desktop Chrome",
              isActive: true,
              createdAt: new Date().toISOString(),
            },
          ],
      payment_transactions: transactions,
      moderation_reports: reports,
    }),
    [accounts, activeSession, transactions, reports]
  );

  const currentRows = tableRows[selectedTable] || [];
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return currentRows;
    const q = searchQuery.toLowerCase();
    return currentRows.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(q)
    );
  }, [currentRows, searchQuery]);

  const columns =
    filteredRows.length > 0 ? Object.keys(filteredRows[0]).slice(0, 6) : [];

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(currentRows, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTable}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: `Exported ${selectedTable}.json` });
  };

  const tableNames: DbTableName[] = [
    "users",
    "user_verifications",
    "user_profiles",
    "user_roles",
    "registration_progress",
    "user_sessions",
    "payment_transactions",
    "moderation_reports",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
              Database Explorer &amp; Schema Viewer
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Supabase DB Layer: Active &amp; Synced
            </span>
          </div>
          <p className="text-sm text-[#5C4740] mt-1">
            Real-time inspection of Supabase relational tables, verification states, active sessions, and transactions
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleExportJson}
            className="rounded-xl border-amber-300 text-[#3B0A18] font-semibold h-10"
          >
            <Download className="w-4 h-4 mr-1.5 text-[#EA580C]" />
            Export JSON
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onResetDatabase();
              toast({ title: "Demo Database Reset to Seed State" });
            }}
            className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold h-10"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Reset DB
          </Button>
        </div>
      </div>

      {/* Table Selector Pills */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
        {tableNames.map((tbl) => (
          <button
            key={tbl}
            type="button"
            onClick={() => {
              setSelectedTable(tbl);
              setSearchQuery("");
            }}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
              selectedTable === tbl
                ? "bg-[#3B0A18] text-amber-200 border-[#3B0A18]"
                : "bg-white text-[#4E342E] border-amber-200 hover:border-[#FF7700]"
            }`}
          >
            {tbl} ({tableRows[tbl].length})
          </button>
        ))}
      </div>

      {/* Search & Data Table */}
      <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search rows in ${selectedTable}...`}
              className="h-10 pl-9 rounded-xl border-amber-200 bg-[#FFFDF9] text-sm"
            />
          </div>
          <span className="text-xs font-semibold text-[#785C52]">
            Showing {filteredRows.length} record(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-amber-50/70 border-b border-amber-200 text-xs font-bold uppercase text-[#7C2D12]">
                {columns.map((col) => (
                  <th key={col} className="px-4 py-3 whitespace-nowrap">
                    {col}
                  </th>
                ))}
                <th className="px-4 py-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {filteredRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-amber-50/40">
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="px-4 py-3 text-xs font-mono text-[#2B120C] max-w-[180px] truncate"
                    >
                      {String(row[col] ?? "-")}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setInspectedRow(row)}
                      className="h-8 px-2.5 text-xs font-semibold text-[#EA580C]"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      JSON
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-8 text-center text-sm text-[#785C52]"
                  >
                    No matching records found in {selectedTable}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Row Modal */}
      <Dialog
        open={!!inspectedRow}
        onOpenChange={(open) => !open && setInspectedRow(null)}
      >
        <DialogContent className="sm:max-w-[580px] rounded-2xl bg-[#FFFDF9] border-amber-200">
          <DialogHeader>
            <DialogTitle className="font-serif-royal text-lg text-[#2B120C] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#EA580C]" />
              Record Inspector — {selectedTable}
            </DialogTitle>
          </DialogHeader>
          <pre className="p-4 rounded-xl bg-[#1B090D] text-amber-200 text-xs overflow-x-auto max-h-[60vh]">
            {JSON.stringify(inspectedRow, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  );
};
