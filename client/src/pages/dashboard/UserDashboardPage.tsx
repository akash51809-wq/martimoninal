import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { MOCK_PROFILES, ProfileData } from "@/data/mockData";
import { useAuthAccount } from "@/context/AuthAccountContext";
import { VivahBrandLogo } from "@/components/home/VivahBrandLogo";
import { ProfilePreviewModal } from "@/components/home/ProfilePreviewModal";
import {
  DashboardOverviewTab,
  DashboardTabId,
} from "@/components/dashboard/DashboardOverviewTab";
import { DashboardDiscoverTab } from "@/components/dashboard/DashboardDiscoverTab";
import { DashboardInterestsTab } from "@/components/dashboard/DashboardInterestsTab";
import { DashboardChatTab } from "@/components/dashboard/DashboardChatTab";
import {
  MyProfileTab,
  PartnerPreferenceTab,
} from "@/components/dashboard/DashboardProfileAndPrefTabs";
import {
  KundliMilanTab,
  MembershipTab,
  SettingsTab,
} from "@/components/dashboard/DashboardExtrasTabs";
import { DashboardSupportTab } from "@/components/dashboard/DashboardSupportTab";
import { DashboardKycAndPrivacyTab } from "@/components/dashboard/DashboardKycAndPrivacyTab";
import { DashboardReferralTab } from "@/components/dashboard/DashboardReferralTab";
import { useLanguage, type SupportedLanguageCode } from "@/context/LanguageContext";
import { SmartMatchingView } from "@/components/matching/SmartMatchingView";
import { PartnerPreferencesEditor } from "@/components/matching/PartnerPreferencesEditor";
import { AdvancedSearchHub } from "@/components/search/AdvancedSearchHub";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Search,
  Heart,
  HeartHandshake,
  MessageCircle,
  User,
  SlidersHorizontal,
  Sparkles,
  Crown,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  CheckCircle2,
  Bell,
  ExternalLink,
  LifeBuoy,
  Gift,
  Globe,
} from "lucide-react";

const NAV_ITEMS: {
  id: DashboardTabId;
  labelKey: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "overview", labelKey: "nav.overview", label: "Overview", icon: LayoutDashboard },
  { id: "matches", labelKey: "nav.matches", label: "Smart Matches", icon: HeartHandshake },
  { id: "discover", labelKey: "nav.discover", label: "Advanced Search", icon: Search },
  { id: "interests", labelKey: "nav.interests", label: "Interests & Activity", icon: Heart },
  { id: "chat", labelKey: "nav.chat", label: "Messages", icon: MessageCircle },
  { id: "profile", labelKey: "nav.profile", label: "My Profile", icon: User },
  { id: "preferences", labelKey: "nav.preferences", label: "Partner Preferences", icon: SlidersHorizontal },
  { id: "kundli", labelKey: "nav.kundli", label: "Kundli Milan", icon: Sparkles },
  { id: "membership", labelKey: "nav.membership", label: "Membership", icon: Crown },
  { id: "referrals", labelKey: "nav.referrals", label: "Refer & Earn", icon: Gift },
  { id: "kyc_privacy", labelKey: "nav.kyc_privacy", label: "Trust & Safety Shield", icon: ShieldCheck },
  { id: "settings", labelKey: "nav.settings", label: "Settings & Privacy", icon: Settings },
  { id: "support", labelKey: "nav.support", label: "Help & Support", icon: LifeBuoy },
];

export default function UserDashboardPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { lang, setLang, languages, t } = useLanguage();
  const { currentAccount, activeSession, updateProfileProgress, logout } =
    useAuthAccount();

  const initialTabFromQuery = (): DashboardTabId => {
    if (typeof window === "undefined") return "overview";
    const path = window.location.pathname.replace(/^\//, "");
    if (path === "matches") return "matches";
    if (path === "search" || path === "discover") return "discover";
    if (path === "preferences") return "preferences";
    const tab = new URLSearchParams(window.location.search).get("tab");
    const valid = NAV_ITEMS.some((i) => i.id === tab);
    return valid ? (tab as DashboardTabId) : "overview";
  };

  const [activeTab, setActiveTab] = useState<DashboardTabId>(initialTabFromQuery);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<ProfileData | null>(null);
  const [activeChatProfileId, setActiveChatProfileId] = useState<string | null>(
    null
  );

  // Interactive UI-only interests & shortlist states
  const [receivedIds, setReceivedIds] = useState<string[]>(["3", "6"]);
  const [sentIds, setSentIds] = useState<string[]>(["1"]);
  const [mutualIds, setMutualIds] = useState<string[]>(["1", "4"]);
  const [rejectedIds, setRejectedIds] = useState<string[]>(["5"]);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(["4", "6"]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(["1", "2"]);

  // Live Notifications Center State
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: string;
      title: string;
      body: string;
      targetTab: string;
      createdAt: string;
      read: boolean;
    }>
  >([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  useEffect(() => {
    document.title = "User Dashboard - Vivah Kar Lo";
  }, []);

  useEffect(() => {
    const uid = currentAccount?.user?.id;
    if (!uid) return;
    fetch(`/api/v1/activity/notifications?userId=${encodeURIComponent(uid)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.notifications)) {
          setNotifications(d.notifications);
          setUnreadNotifCount(d.unreadCount || 0);
        }
      })
      .catch(() => {});
  }, [currentAccount?.user?.id]);

  const handleMarkNotificationsRead = (notificationId?: string, markAll = false) => {
    const uid = currentAccount?.user?.id;
    if (!uid) return;
    fetch("/api/v1/activity/notifications/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: uid, notificationId, markAll }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.notifications)) {
          setNotifications(d.notifications);
          setUnreadNotifCount(d.unreadCount || 0);
        }
      })
      .catch(() => {});
  };

  if (!currentAccount) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-amber-200 shadow-lg p-8 text-center space-y-4">
          <VivahBrandLogo size="md" className="mx-auto" />
          <h1 className="font-serif-royal text-2xl font-bold text-[#2B120C]">
            Sign In Required
          </h1>
          <p className="text-sm text-[#5C4740]">
            Please sign in to access your Vivah Kar Lo dashboard, matches, and messages.
          </p>
          <div className="flex flex-col gap-2.5 pt-2">
            <Link href="/login">
              <Button className="w-full h-11 rounded-xl bg-saffron-gradient text-white font-semibold">
                Go to Sign In
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="w-full h-11 rounded-xl border-amber-300 text-[#3B0A18]"
              >
                Back to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleInterest = (profile: ProfileData) => {
    setSentIds((prev) => {
      const exists = prev.includes(profile.id);
      const next = exists
        ? prev.filter((id) => id !== profile.id)
        : [...prev, profile.id];
      toast({
        title: exists
          ? "Interest Withdrawn"
          : `Interest Sent to ${profile.name}`,
      });
      return next;
    });
  };

  const handleToggleShortlist = (profile: ProfileData) => {
    setShortlistedIds((prev) => {
      const exists = prev.includes(profile.id);
      const next = exists
        ? prev.filter((id) => id !== profile.id)
        : [...prev, profile.id];
      toast({
        title: exists
          ? `Removed ${profile.name} from shortlist`
          : `Shortlisted ${profile.name}`,
      });
      return next;
    });
  };

  const handleAcceptReceived = (profile: ProfileData) => {
    setReceivedIds((prev) => prev.filter((id) => id !== profile.id));
    setMutualIds((prev) =>
      prev.includes(profile.id) ? prev : [...prev, profile.id]
    );
    toast({
      title: `Interest Accepted — Mutual Match!`,
      description: `You and ${profile.name} can now chat directly.`,
    });
  };

  const handleDeclineReceived = (profile: ProfileData) => {
    setReceivedIds((prev) => prev.filter((id) => id !== profile.id));
    setRejectedIds((prev) =>
      prev.includes(profile.id) ? prev : [...prev, profile.id]
    );
    toast({
      title: `Request from ${profile.name} rejected`,
      description: "Moved to Rejected Interest List. You can reconsider anytime.",
    });
  };

  const handleReconsiderRejected = (profile: ProfileData) => {
    setRejectedIds((prev) => prev.filter((id) => id !== profile.id));
    setMutualIds((prev) =>
      prev.includes(profile.id) ? prev : [...prev, profile.id]
    );
    toast({
      title: `Interest Reconsidered & Accepted`,
      description: `${profile.name} moved to Accepted / Mutual Matches.`,
    });
  };

  const handleToggleFavorite = (profile: ProfileData) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(profile.id);
      const next = exists
        ? prev.filter((id) => id !== profile.id)
        : [...prev, profile.id];
      toast({
        title: exists
          ? `Removed ${profile.name} from Favorites`
          : `Added ${profile.name} to Favorites`,
      });
      return next;
    });
    if (currentAccount?.user?.id) {
      fetch("/api/v1/activity/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentAccount.user.id,
          targetUserId: profile.id,
        }),
      }).catch(() => {});
    }
  };

  const handleLogout = () => {
    logout();
    toast({ title: "Signed out securely" });
    setLocation("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <DashboardOverviewTab
            account={currentAccount}
            profiles={MOCK_PROFILES}
            sentInterestIds={sentIds}
            receivedCount={receivedIds.length}
            mutualCount={mutualIds.length}
            unreadChatCount={2}
            onNavigateTab={setActiveTab}
            onViewProfile={setPreviewProfile}
            onToggleInterest={handleToggleInterest}
          />
        );
      case "matches":
        return (
          <SmartMatchingView
            userId={currentAccount.user.id}
            isVipMember={
              currentAccount.role.role === "vip" ||
              currentAccount.role.role === "admin"
            }
            onViewProfile={setPreviewProfile}
            onEditPreferences={() => setActiveTab("preferences")}
            onOpenChat={(pid) => {
              setActiveChatProfileId(pid);
              setActiveTab("chat");
            }}
          />
        );
      case "discover":
        return (
          <AdvancedSearchHub
            userId={currentAccount.user.id}
            onViewProfile={setPreviewProfile}
            onOpenChat={(pid) => {
              setActiveChatProfileId(pid);
              setActiveTab("chat");
            }}
          />
        );
      case "interests":
        return (
          <DashboardInterestsTab
            allProfiles={MOCK_PROFILES}
            receivedIds={receivedIds}
            sentIds={sentIds}
            mutualIds={mutualIds}
            rejectedIds={rejectedIds}
            shortlistedIds={shortlistedIds}
            favoriteIds={favoriteIds}
            currentUserId={currentAccount.user.id}
            onAcceptReceived={handleAcceptReceived}
            onDeclineReceived={handleDeclineReceived}
            onReconsiderRejected={handleReconsiderRejected}
            onWithdrawSent={handleToggleInterest}
            onToggleShortlist={handleToggleShortlist}
            onToggleFavorite={handleToggleFavorite}
            onViewProfile={(p) => {
              setPreviewProfile(p);
              if (currentAccount?.user?.id && p.id) {
                fetch("/api/v1/activity/views/record", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    viewerId: currentAccount.user.id,
                    viewedUserId: p.id,
                    deviceType: "Desktop",
                  }),
                }).catch(() => {});
              }
            }}
            onOpenChat={(pid) => {
              setActiveChatProfileId(pid);
              setActiveTab("chat");
            }}
            isVipMember={
              currentAccount.role.role === "vip" ||
              currentAccount.role.role === "admin"
            }
          />
        );
      case "chat":
        return (
          <DashboardChatTab
            initialProfileId={activeChatProfileId}
            currentUserId={currentAccount.user.id}
            isVipMember={
              currentAccount.role.role === "vip" ||
              currentAccount.role.role === "admin"
            }
          />
        );
      case "profile":
        return (
          <MyProfileTab
            account={currentAccount}
            onUpdateCompletion={(pct) =>
              updateProfileProgress(pct, currentAccount.user.id)
            }
          />
        );
      case "preferences":
        return (
          <PartnerPreferencesEditor
            userId={currentAccount.user.id}
            onSaved={() => setActiveTab("matches")}
          />
        );
      case "kundli":
        return (
          <KundliMilanTab
            profiles={MOCK_PROFILES}
            account={currentAccount}
          />
        );
      case "membership":
        return <MembershipTab account={currentAccount} />;
      case "referrals":
        return (
          <DashboardReferralTab
            userId={currentAccount.user.id}
            userName={currentAccount.user.fullName}
            onGoToMembership={() => setActiveTab("membership")}
          />
        );
      case "kyc_privacy":
        return <DashboardKycAndPrivacyTab userId={currentAccount.user.id} />;
      case "settings":
        return (
          <SettingsTab
            account={currentAccount}
            session={activeSession}
            onLogout={handleLogout}
          />
        );
      case "support":
        return <DashboardSupportTab account={currentAccount} />;
      default:
        return null;
    }
  };

  const mobileBottomTabs: {
    id: DashboardTabId | "menu";
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: "overview", label: t("mobile.home", "Home"), icon: LayoutDashboard },
    { id: "discover", label: t("mobile.discover", "Discover"), icon: Search },
    {
      id: "interests",
      label: t("mobile.matches", "Matches"),
      icon: Heart,
      badge: receivedIds.length,
    },
    { id: "chat", label: t("mobile.chat", "Chat"), icon: MessageCircle, badge: 2 },
    { id: "menu", label: t("mobile.menu", "Menu"), icon: Menu },
  ];

  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2B120C] flex flex-col overflow-x-hidden">
      {/* Top Bar (Desktop + Mobile App Header) */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFDF9]/98 border-b border-amber-200/80">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-[68px] sm:h-[78px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="group shrink-0">
              <VivahBrandLogo size="sm" />
            </Link>
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t("header.verifiedAccount", "Verified Account")}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Multi-Language Full UI Switcher (EN / HI / MR / GU / TA) */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-50/90 border border-amber-200 text-xs font-semibold text-[#3B0A18]">
              <Globe className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
              <select
                aria-label={t("header.uiLanguage", "Language")}
                value={lang}
                onChange={(e) => {
                  const nextLang = e.target.value as SupportedLanguageCode;
                  setLang(nextLang);
                  const chosen = languages.find((l) => l.code === nextLang);
                  toast({
                    title: `UI Language: ${chosen ? chosen.nativeLabel : nextLang.toUpperCase()}`,
                  });
                }}
                className="bg-transparent text-xs font-bold text-[#3B0A18] focus:outline-none cursor-pointer pr-1 max-w-[115px] sm:max-w-none"
              >
                {languages.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.nativeLabel}
                  </option>
                ))}
              </select>
            </div>

            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-50 hover:bg-orange-100 border border-amber-200 text-xs font-semibold text-[#3B0A18]"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#EA580C]" />
              {t("header.publicWebsite", "Public Website")}
            </Link>

            {/* Live Notifications Center Bell & Responsive Popover */}
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative h-10 w-10 rounded-full border-amber-200 bg-white text-[#3B0A18] hover:bg-amber-50"
                aria-label="Open Notifications"
              >
                <Bell className="w-4 h-4 text-[#EA580C]" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadNotifCount}
                  </span>
                )}
              </Button>

              {notifOpen && (
                <div className="fixed sm:absolute right-3 left-3 sm:left-auto sm:right-0 top-[72px] sm:top-12 sm:w-96 bg-white rounded-2xl border border-amber-200 shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-[#3B0A18] text-white flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-amber-300" />
                      {t("header.notifications", "Notifications")} ({unreadNotifCount} {t("header.unread", "Unread")})
                    </span>
                    {unreadNotifCount > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMarkNotificationsRead(undefined, true)}
                        className="text-[11px] font-bold text-amber-300 hover:underline"
                      >
                        {t("header.markAllRead", "Mark All Read")}
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-amber-100">
                    {notifications.length === 0 ? (
                      <p className="p-6 text-center text-xs text-[#5C4740]">
                        {t("header.noNotifications", "All caught up! No new notifications.")}
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => {
                            handleMarkNotificationsRead(n.id, false);
                            setActiveTab((n.targetTab as DashboardTabId) || "overview");
                            setNotifOpen(false);
                          }}
                          className={`w-full text-left p-3.5 hover:bg-amber-50/70 transition-colors flex items-start gap-2.5 ${
                            !n.read ? "bg-amber-50/50" : "bg-white"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              !n.read ? "bg-[#EA580C]" : "bg-slate-300"
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-[#2B120C]">{n.title}</p>
                            <p className="text-[11px] text-[#5C4740] mt-0.5 leading-snug">
                              {n.body}
                            </p>
                            <p className="text-[10px] text-[#8C6D62] mt-1">
                              {new Date(n.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-amber-200 hover:border-[#FF7700] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-saffron-gradient text-white font-bold text-xs flex items-center justify-center shrink-0">
                {currentAccount.user.fullName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm font-semibold text-[#2B120C] max-w-[140px] truncate">
                {currentAccount.user.fullName}
              </span>
            </button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="hidden sm:inline-flex rounded-full border-amber-300 text-[#3B0A18] hover:bg-rose-50 hover:text-rose-700 h-10 px-4"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              {t("header.logout", "Logout")}
            </Button>

            {/* Mobile Drawer Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden rounded-full border-amber-200 bg-white text-[#3B0A18]"
                  aria-label="Open Dashboard Menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] bg-[#FFFDF9] border-l border-amber-200 flex flex-col justify-between"
              >
                <div>
                  <SheetHeader className="text-left pb-4 border-b border-amber-100">
                    <SheetTitle>
                      <VivahBrandLogo size="sm" />
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const active = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                            active
                              ? "bg-saffron-gradient text-white shadow-sm"
                              : "text-[#3E2723] hover:bg-amber-50"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{t(item.labelKey, item.label)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-amber-100 space-y-2">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-amber-300 text-[#3B0A18]"
                    >
                      {t("header.viewPublicWebsite", "View Public Website")}
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="w-full rounded-xl"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("header.logout", "Logout")}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Quick Horizontal Feature Strip */}
        <div className="lg:hidden border-t border-amber-100 bg-white px-3 py-2 flex overflow-x-auto no-scrollbar gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  active
                    ? "bg-[#3B0A18] text-amber-100 border-[#3B0A18]"
                    : "bg-amber-50/70 text-[#5C4740] border-amber-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t(item.labelKey, item.label)}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Dashboard Layout (Desktop Sidebar + Content Workspace) */}
      <div className="flex-1 w-full grid lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col justify-between bg-white border-r border-amber-200/80 p-4 sticky top-[78px] h-[calc(100vh-78px)] overflow-y-auto">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "bg-saffron-gradient text-white shadow-saffron-sm"
                      : "text-[#3E2723] hover:bg-amber-50 hover:text-[#EA580C]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{t(item.labelKey, item.label)}</span>
                  </span>
                  {item.id === "interests" && receivedIds.length > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        active
                          ? "bg-white text-[#EA580C]"
                          : "bg-orange-100 text-[#EA580C]"
                      }`}
                    >
                      {receivedIds.length}
                    </span>
                  )}
                  {item.id === "chat" && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        active
                          ? "bg-white text-[#EA580C]"
                          : "bg-orange-100 text-[#EA580C]"
                      }`}
                    >
                      2
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-amber-100">
            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              className="w-full rounded-xl border-amber-300 text-[#3B0A18] hover:bg-rose-50 hover:text-rose-700 font-semibold h-11"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t("header.logout", "Logout")}
            </Button>
          </div>
        </aside>

        {/* Active Feature Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 xl:p-10 pb-24 lg:pb-10">
          {renderContent()}
        </main>
      </div>

      {/* Native Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile dashboard navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[#FFFDF9]/98 border-t border-amber-200/90 shadow-[0_-8px_30px_rgba(120,53,15,0.12)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5 items-center h-[64px] px-1">
          {mobileBottomTabs.map((t) => {
            const Icon = t.icon;
            const isActive = t.id !== "menu" && activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  if (t.id === "menu") {
                    setMobileMenuOpen(true);
                  } else {
                    setActiveTab(t.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={`relative flex flex-col items-center justify-center gap-1 h-full transition-colors ${
                  isActive ? "text-[#EA580C]" : "text-[#6E564E]"
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 w-8 h-[3px] rounded-b-full bg-saffron-gradient" />
                )}
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {typeof t.badge === "number" && t.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-saffron-gradient text-white text-[10px] font-bold flex items-center justify-center">
                      {t.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[11px] leading-none ${
                    isActive ? "font-bold" : "font-medium"
                  }`}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Profile Detail Modal */}
      <ProfilePreviewModal
        profile={previewProfile}
        isLiked={
          previewProfile ? sentIds.includes(previewProfile.id) : false
        }
        onClose={() => setPreviewProfile(null)}
        onSendInterest={(p) => handleToggleInterest(p)}
        onUnlockContact={() => {
          setPreviewProfile(null);
          setActiveTab("membership");
        }}
        isVipMember={
          currentAccount.role.role === "vip" ||
          currentAccount.role.role === "admin"
        }
        viewerId={currentAccount.user.id}
      />
    </div>
  );
}
