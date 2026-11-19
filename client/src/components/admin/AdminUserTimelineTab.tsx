import React, { useState, useMemo } from "react";
import {
  Activity,
  ShieldAlert,
  Smartphone,
  Laptop,
  Clock,
  Search,
  Filter,
  UserCheck,
  UserX,
  LogIn,
  LogOut,
  Heart,
  Eye,
  Edit,
  AlertTriangle,
  MapPin,
  Globe,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Lock,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AccountBundle } from "@/data/mockAccounts";
import {
  UserTimelineEvent,
  INITIAL_USER_TIMELINE_EVENTS,
} from "@/data/adminMockData";

interface AdminUserTimelineTabProps {
  accounts: AccountBundle[];
  initialUserId?: string;
  onNavigateUser?: (userId: string) => void;
}

export default function AdminUserTimelineTab({
  accounts,
  initialUserId,
  onNavigateUser,
}: AdminUserTimelineTabProps) {
  const { toast } = useToast();

  const [selectedUserId, setSelectedUserId] = useState<string>(
    initialUserId || accounts[0]?.user.id || "usr-active-01"
  );
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");
  const [timelineEvents, setTimelineEvents] = useState<UserTimelineEvent[]>(
    INITIAL_USER_TIMELINE_EVENTS
  );
  const [searchUserQuery, setSearchUserQuery] = useState<string>("");

  // Currently selected account details
  const currentAccount = useMemo(() => {
    return (
      accounts.find((a) => a.user.id === selectedUserId) ||
      accounts[0] ||
      null
    );
  }, [accounts, selectedUserId]);

  // Filter events for this user (or all if specified)
  const userEvents = useMemo(() => {
    return timelineEvents.filter((ev) => {
      // If event belongs to this user or matches query
      const matchesUser = ev.userId === selectedUserId;
      if (!matchesUser) return false;

      if (selectedTypeFilter === "all") return true;
      if (selectedTypeFilter === "auth") {
        return (
          ev.eventType === "login" ||
          ev.eventType === "logout" ||
          ev.eventType === "suspicious_login"
        );
      }
      if (selectedTypeFilter === "security") {
        return (
          ev.eventType === "suspicious_login" || Boolean(ev.suspiciousFlag)
        );
      }
      if (selectedTypeFilter === "updates") {
        return ev.eventType === "profile_update";
      }
      if (selectedTypeFilter === "discovery") {
        return (
          ev.eventType === "search" ||
          ev.eventType === "profile_view" ||
          ev.eventType === "interest_sent" ||
          ev.eventType === "interest_accepted"
        );
      }
      return ev.eventType === selectedTypeFilter;
    });
  }, [timelineEvents, selectedUserId, selectedTypeFilter]);

  // Security Alert aggregates
  const suspiciousCount = timelineEvents.filter(
    (e) => e.eventType === "suspicious_login" || e.suspiciousFlag
  ).length;

  const handleForceLogoutSessions = () => {
    toast({
      title: "Active Sessions Revoked",
      description: `Forced remote sign-out across all mobile and web devices for user ${selectedUserId}. Auth tokens invalidated.`,
      variant: "destructive",
    });

    const newEvent: UserTimelineEvent = {
      id: `tl-revoked-${Date.now()}`,
      userId: selectedUserId,
      userName: currentAccount
        ? `${currentAccount.profile.first_name} ${currentAccount.profile.last_name}`
        : "User",
      eventType: "logout",
      title: "Admin Revoked All Active Sessions",
      detail:
        "Administrator triggered remote logout across all active refresh tokens.",
      ipAddress: "127.0.0.1 (Admin Console)",
      deviceInfo: "Security Service Daemon",
      location: "Server Action",
      timestamp: "Just now",
    };

    setTimelineEvents((prev) => [newEvent, ...prev]);
  };

  const getEventIcon = (type: UserTimelineEvent["eventType"]) => {
    switch (type) {
      case "login":
        return <LogIn className="w-4 h-4 text-emerald-600" />;
      case "logout":
        return <LogOut className="w-4 h-4 text-stone-500" />;
      case "profile_update":
        return <Edit className="w-4 h-4 text-blue-600" />;
      case "search":
        return <Search className="w-4 h-4 text-amber-600" />;
      case "interest_sent":
      case "interest_accepted":
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case "profile_view":
        return <Eye className="w-4 h-4 text-purple-600" />;
      case "suspicious_login":
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-stone-500" />;
    }
  };

  const candidateFullName = currentAccount
    ? `${currentAccount.profile.first_name || ""} ${
        currentAccount.profile.last_name || ""
      }`
    : "Member Profile";

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#3B0A18] via-[#5A0E24] to-[#8B1E3F] text-amber-50 rounded-2xl p-6 shadow-md border border-amber-900/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
              <Activity className="w-3.5 h-3.5" />
              Live User Telemetry & Security Forensics
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-100">
              User Activity Audit & Security Timeline
            </h1>
            <p className="text-sm text-amber-200/80 mt-1 max-w-2xl">
              Real-time chronological timeline tracking: login/logout telemetry,
              search queries, interest activity, profile views, field-level edit
              history, suspicious login alerts, and multi-device session
              detection.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleForceLogoutSessions}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600/90 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" />
              Force Invalidate All Devices
            </button>
          </div>
        </div>

        {/* Security Alerts Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-amber-800/40">
          <div className="bg-black/20 rounded-xl p-3 border border-rose-500/40">
            <div className="text-xs text-rose-300 font-medium flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Suspicious Logins
            </div>
            <div className="text-2xl font-bold text-rose-200 mt-1">
              {suspiciousCount}
            </div>
            <div className="text-[11px] text-rose-200/60 mt-0.5">
              Geo-velocity & proxy alerts
            </div>
          </div>

          <div className="bg-black/20 rounded-xl p-3 border border-amber-600/40">
            <div className="text-xs text-amber-300 font-medium flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              Multiple Devices
            </div>
            <div className="text-2xl font-bold text-amber-200 mt-1">
              2 Active
            </div>
            <div className="text-[11px] text-amber-200/60 mt-0.5">
              Android 14 + Win11 Chrome
            </div>
          </div>

          <div className="bg-black/20 rounded-xl p-3 border border-emerald-500/40">
            <div className="text-xs text-emerald-300 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              User Last Active
            </div>
            <div className="text-base font-bold text-emerald-200 mt-1 truncate">
              12 mins ago
            </div>
            <div className="text-[11px] text-emerald-200/60 mt-0.5">
              Pune, Maharashtra
            </div>
          </div>

          <div className="bg-black/20 rounded-xl p-3 border border-blue-500/40">
            <div className="text-xs text-blue-300 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Membership Expiry Alert
            </div>
            <div className="text-base font-bold text-blue-200 mt-1">
              In 48 Hours
            </div>
            <div className="text-[11px] text-blue-200/60 mt-0.5">
              Auto renewal reminder sent
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: User Selector & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: User Picker & Profile Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 space-y-3">
            <div className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
              <span>Select Candidate</span>
              <span className="text-[11px] text-stone-400 font-normal">
                {accounts.length} total
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                value={searchUserQuery}
                onChange={(e) => setSearchUserQuery(e.target.value)}
                placeholder="Find candidate..."
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none"
              />
            </div>

            {/* Candidate List */}
            <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
              {accounts
                .filter((a) => {
                  const q = searchUserQuery.toLowerCase();
                  const name = `${a.profile.first_name || ""} ${
                    a.profile.last_name || ""
                  }`.toLowerCase();
                  return (
                    name.includes(q) ||
                    a.user.email.toLowerCase().includes(q) ||
                    a.user.id.toLowerCase().includes(q)
                  );
                })
                .map((acc) => {
                  const isSelected = acc.user.id === selectedUserId;
                  const name = `${acc.profile.first_name || ""} ${
                    acc.profile.last_name || ""
                  }`;

                  return (
                    <button
                      key={acc.user.id}
                      type="button"
                      onClick={() => setSelectedUserId(acc.user.id)}
                      className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? "bg-[#3B0A18] text-amber-100 shadow-sm"
                          : "hover:bg-stone-100 text-stone-700"
                      }`}
                    >
                      <img
                        src={
                          acc.profile.avatar_url ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                        }
                        alt={name}
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-stone-300"
                      />
                      <div className="truncate">
                        <div className="font-bold truncate">
                          {name || "Unnamed"}
                        </div>
                        <div
                          className={`text-[10px] font-mono truncate ${
                            isSelected ? "text-amber-200/70" : "text-stone-400"
                          }`}
                        >
                          {acc.user.id}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* User Dossier Quick Card */}
          {currentAccount && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={
                    currentAccount.profile.avatar_url ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                  }
                  alt={candidateFullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-sm text-stone-900">
                    {candidateFullName}
                  </h4>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      currentAccount.user.status === "active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {currentAccount.user.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span className="text-stone-400">Email:</span>
                  <span className="font-medium">
                    {currentAccount.user.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Mobile:</span>
                  <span className="font-medium">
                    {currentAccount.user.mobile || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Plan:</span>
                  <span className="font-bold text-purple-700 capitalize">
                    {currentAccount.profile.membership_tier || "Free"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">City:</span>
                  <span className="font-medium">
                    {currentAccount.profile.city || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Timeline Feed */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "all", label: "All Telemetry" },
                { id: "auth", label: "Login / Logout" },
                { id: "security", label: "Security & Alerts" },
                { id: "updates", label: "Profile Edits" },
                { id: "discovery", label: "Interests & Views" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedTypeFilter(f.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    selectedTypeFilter === f.id
                      ? "bg-[#3B0A18] text-amber-100"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-stone-500">
              Showing {userEvents.length} chronological actions
            </div>
          </div>

          {/* Timeline Feed Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
            {userEvents.length === 0 ? (
              <div className="text-center py-12 text-stone-400">
                <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs">
                  No telemetry events match the chosen filter for this
                  candidate.
                </p>
              </div>
            ) : (
              <div className="relative border-l-2 border-stone-200 ml-4 space-y-6">
                {userEvents.map((ev) => {
                  const isSuspicious =
                    ev.eventType === "suspicious_login" || ev.suspiciousFlag;

                  return (
                    <div key={ev.id} className="relative pl-6">
                      {/* Timeline Dot Icon */}
                      <div
                        className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white shadow-xs ${
                          isSuspicious
                            ? "border-red-500 bg-red-50"
                            : "border-stone-200"
                        }`}
                      >
                        {getEventIcon(ev.eventType)}
                      </div>

                      {/* Content Card */}
                      <div
                        className={`p-4 rounded-xl border transition-all ${
                          isSuspicious
                            ? "bg-red-50/50 border-red-200 ring-1 ring-red-400/30"
                            : "bg-stone-50/60 border-stone-200 hover:border-amber-300"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-stone-900">
                              {ev.title}
                            </span>
                            {isSuspicious && (
                              <span className="px-2 py-0.5 bg-red-600 text-white font-extrabold text-[10px] rounded-full uppercase tracking-wider">
                                High Risk Alert
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3" />
                            {ev.timestamp}
                          </span>
                        </div>

                        <p className="text-xs text-stone-700 leading-relaxed mb-3">
                          {ev.detail}
                        </p>

                        {/* Metadata Footer */}
                        <div className="pt-2 border-t border-stone-200/60 flex flex-wrap items-center gap-4 text-[11px] text-stone-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3 text-stone-400" />
                            IP: {ev.ipAddress}
                          </span>
                          <span className="flex items-center gap-1">
                            <Laptop className="w-3 h-3 text-stone-400" />
                            {ev.deviceInfo}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            {ev.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
