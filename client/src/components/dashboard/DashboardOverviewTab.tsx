import React from "react";
import { Link } from "wouter";
import { ProfileData, MOCK_NOTIFICATIONS } from "@/data/mockData";
import type { AccountBundle } from "@/types/authTypes";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { ProfilePerformanceAnalyticsCard } from "@/components/dashboard/ProfilePerformanceAnalyticsCard";
import {
  Eye,
  Heart,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  SlidersHorizontal,
  Crown,
  Bell,
  MapPin,
  Briefcase,
  Gift,
} from "lucide-react";

export type DashboardTabId =
  | "overview"
  | "matches"
  | "discover"
  | "interests"
  | "chat"
  | "profile"
  | "preferences"
  | "kundli"
  | "membership"
  | "referrals"
  | "settings"
  | "kyc_privacy"
  | "support";

interface DashboardOverviewTabProps {
  account: AccountBundle;
  profiles: ProfileData[];
  sentInterestIds: string[];
  receivedCount: number;
  mutualCount: number;
  unreadChatCount: number;
  onNavigateTab: (tab: DashboardTabId) => void;
  onViewProfile: (profile: ProfileData) => void;
  onToggleInterest: (profile: ProfileData) => void;
}

export const DashboardOverviewTab: React.FC<DashboardOverviewTabProps> = ({
  account,
  profiles,
  sentInterestIds,
  receivedCount,
  mutualCount,
  unreadChatCount,
  onNavigateTab,
  onViewProfile,
  onToggleInterest,
}) => {
  const { t } = useLanguage();
  const { user, profileMeta, role } = account;
  const isIncomplete = profileMeta.profileStatus === "incomplete";

  const stats = [
    {
      label: t("overview.statViews", "Profile Views"),
      value: isIncomplete ? "0" : "142",
      sub: t("overview.statViewsSub", "Last 7 days"),
      icon: Eye,
      color: "bg-amber-50 text-[#EA580C] border-amber-200",
      tab: "overview" as DashboardTabId,
    },
    {
      label: t("overview.statReceived", "Interests Received"),
      value: String(receivedCount),
      sub: t("overview.statReceivedSub", "Pending response"),
      icon: Heart,
      color: "bg-rose-50 text-rose-600 border-rose-200",
      tab: "interests" as DashboardTabId,
    },
    {
      label: t("overview.statMutual", "Mutual Matches"),
      value: String(mutualCount),
      sub: t("overview.statMutualSub", "Ready to connect"),
      icon: Sparkles,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      tab: "interests" as DashboardTabId,
    },
    {
      label: t("overview.statUnread", "Unread Messages"),
      value: String(unreadChatCount),
      sub: t("overview.statUnreadSub", "Encrypted inbox"),
      icon: MessageCircle,
      color: "bg-orange-50 text-[#C2410C] border-orange-200",
      tab: "chat" as DashboardTabId,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#2B0712] via-[#3F0C1C] to-[#240610] text-white p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(43,7,18,0.35)] relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.18)_0%,transparent_70%)]"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t("overview.mobileEmailVerified", "Mobile & Email Verified")}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs font-semibold uppercase">
                <Crown className="w-3.5 h-3.5" />
                {role.role === "vip"
                  ? t("overview.vipMember", "Gold Royal VIP")
                  : t("overview.freeMember", "Free Member")}
              </span>
            </div>

            <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold">
              {t("overview.welcomeBack", "Welcome back")}, {user.fullName}
            </h1>
            <p className="text-sm sm:text-base text-amber-100/80 max-w-2xl">
              {t(
                "overview.welcomeSubtitle",
                "Manage your curated matches, family preferences, Kundli reports, and private conversations from one place."
              )}
            </p>
          </div>

          {/* Profile Completion Card */}
          <div className="bg-white/10 border border-amber-200/20 rounded-2xl p-4 sm:p-5 min-w-[250px] space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-amber-100 font-medium">
                {t("overview.profileCompletion", "Profile Completion")}
              </span>
              <span className="font-bold text-amber-300">
                {profileMeta.profileCompletion}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-black/30 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF7700] to-amber-300 transition-all duration-300"
                style={{ width: `${Math.max(4, profileMeta.profileCompletion)}%` }}
              />
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("profile")}
              className="text-xs font-semibold text-amber-300 hover:text-white inline-flex items-center gap-1"
            >
              {isIncomplete
                ? t("overview.completeWizard", "Complete Profile Wizard")
                : t("overview.updateProfile", "Update Profile Details")}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Incomplete Profile Alert Banner */}
      {isIncomplete && (
        <div className="rounded-2xl bg-amber-50 border-2 border-amber-300 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200/70 text-[#9A3412] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-royal text-base sm:text-lg font-bold text-[#2B120C]">
                Complete Your Matrimonial Profile ({profileMeta.profileCompletion}%)
              </h3>
              <p className="text-sm text-[#5C4740]">
                Your account is active, but matching and direct connections unlock once you fill out your Personal, Career, Family, and Horoscope details.
              </p>
            </div>
          </div>
          <Link href="/profile-wizard">
            <Button
              type="button"
              className="h-11 px-5 rounded-xl bg-saffron-gradient text-white font-semibold shrink-0 shadow-saffron-sm"
            >
              Launch Profile Wizard →
            </Button>
          </Link>
        </div>
      )}

      {/* 4 KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {stats.map((st) => {
          const Icon = st.icon;
          return (
            <button
              key={st.label}
              type="button"
              onClick={() => onNavigateTab(st.tab)}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-sm hover:border-[#FF7700] hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center ${st.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
                {st.value}
              </p>
              <p className="text-sm font-semibold text-[#3E2723] mt-0.5">
                {st.label}
              </p>
              <p className="text-xs text-[#785C52]">{st.sub}</p>
            </button>
          );
        })}
      </div>

      {/* Profile Strength & Weekly Performance Analytics */}
      <ProfilePerformanceAnalyticsCard
        userId={user.id}
        onNavigateTab={onNavigateTab}
      />

      {/* Main Content Split: Daily Recommended Matches + Activity & Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Daily Recommended Matches */}
        <div className="xl:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif-royal text-xl sm:text-2xl font-bold text-[#2B120C]">
                {t("overview.dailyMatchesTitle", "Daily Recommended Matches")}
              </h2>
              <p className="text-sm text-[#5C4740]">
                {t(
                  "overview.dailyMatchesSub",
                  "Curated alliances aligned with your partner preferences"
                )}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab("discover")}
              className="rounded-full border-amber-300 text-[#3B0A18] font-semibold"
            >
              {t("overview.viewAll", "View All")} →
            </Button>
          </div>

          <div className="flex md:grid overflow-x-auto snap-x snap-mandatory gap-4 pb-2 no-scrollbar md:pb-0 md:grid-cols-2 lg:grid-cols-3">
            {profiles.slice(0, 3).map((p) => {
              const sent = sentInterestIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  className="w-[78vw] max-w-[300px] md:w-auto md:max-w-none shrink-0 snap-center bg-white rounded-2xl border border-amber-200/80 overflow-hidden shadow-sm flex flex-col"
                >
                  <div
                    onClick={() => onViewProfile(p)}
                    className="relative aspect-[4/3.4] bg-[#2C0914] cursor-pointer overflow-hidden"
                  >
                    <img
                      src={p.photos[0]}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F070D]/80 via-transparent to-transparent" />
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-white/95 text-[#3B0A18] text-xs font-bold">
                      {p.kundliScore}/36 Gunas
                    </span>
                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <p className="font-serif-royal text-lg font-bold truncate">
                        {p.name}, {p.age}
                      </p>
                      <p className="text-xs text-amber-100 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-amber-300" />
                        {p.city}, {p.state}
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-[#4E342E] flex items-center gap-1.5 truncate">
                      <Briefcase className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                      {p.professionTag} • {p.caste}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onViewProfile(p)}
                        className="rounded-lg border-amber-300 text-xs font-semibold h-9"
                      >
                        {t("overview.view", "View")}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onToggleInterest(p)}
                        className={`rounded-lg text-xs font-semibold h-9 ${
                          sent
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-saffron-gradient text-white"
                        }`}
                      >
                        {sent
                          ? `${t("overview.sent", "Sent")} ✓`
                          : t("overview.interest", "Interest")}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications & Quick Actions */}
        <div className="xl:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-amber-200/80 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#EA580C]" />
                {t("overview.recentActivity", "Recent Activity")}
              </h3>
              <span className="text-xs font-semibold text-[#EA580C]">
                {t("overview.liveFeed", "Live Feed")}
              </span>
            </div>

            <div className="space-y-3">
              {MOCK_NOTIFICATIONS.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 p-2.5 rounded-xl bg-amber-50/60 border border-amber-100"
                >
                  <img
                    src={n.avatar}
                    alt={n.title}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-amber-200"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#2B120C] truncate">
                      {n.title}
                    </p>
                    <p className="text-xs text-[#5C4740] line-clamp-2 mt-0.5">
                      {n.body}
                    </p>
                    <p className="text-[11px] text-[#8C6D62] mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-amber-200/80 p-5 space-y-3 shadow-sm">
            <h3 className="font-serif-royal text-base font-bold text-[#2B120C]">
              {t("overview.quickShortcuts", "Quick Shortcuts")}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigateTab("preferences")}
                className="justify-between rounded-xl border-amber-200 h-10 text-sm font-medium"
              >
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#EA580C]" />
                  {t("overview.shortcutPrefs", "Edit Partner Preferences")}
                </span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigateTab("kundli")}
                className="justify-between rounded-xl border-amber-200 h-10 text-sm font-medium"
              >
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#EA580C]" />
                  {t("overview.shortcutKundli", "36-Guna Kundli Matcher")}
                </span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigateTab("membership")}
                className="justify-between rounded-xl border-amber-200 h-10 text-sm font-medium"
              >
                <span className="inline-flex items-center gap-2">
                  <Crown className="w-4 h-4 text-[#EA580C]" />
                  {t("overview.shortcutVip", "Upgrade VIP Membership")}
                </span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigateTab("referrals")}
                className="justify-between rounded-xl border-amber-200 h-10 text-sm font-medium"
              >
                <span className="inline-flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#EA580C]" />
                  {t("overview.shortcutRefer", "Refer Friends & Earn Credits")}
                </span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
