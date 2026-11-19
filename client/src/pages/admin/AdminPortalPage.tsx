import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { MOCK_PROFILES } from "@/data/mockData";
import { useAuthAccount } from "@/context/AuthAccountContext";
import { VivahBrandLogo } from "@/components/home/VivahBrandLogo";
import { AdminLoginView } from "@/components/admin/AdminLoginView";
import {
  AdminOverviewTab,
  AdminDatabaseTab,
  type AdminTabId,
} from "@/components/admin/AdminOverviewAndDatabaseTabs";
import {
  AdminUsersTab,
  AdminKycTab,
} from "@/components/admin/AdminUsersAndKycTabs";
import {
  AdminProfilesTab,
  AdminPaymentsTab,
  AdminReportsTab,
  AdminBroadcastTab,
  AdminSettingsTab,
  AdminSupportTicketsTab,
  AdminFeedbackTab,
} from "@/components/admin/AdminOperationsTabs";
import { AdminMatchingAlgorithmDesk } from "@/components/admin/AdminMatchingAlgorithmDesk";
import { AdminAnalyticsTab } from "@/components/admin/AdminAnalyticsTab";
import { AdminActivityTab } from "@/components/admin/AdminActivityTab";
import { AdminFranchiseTab } from "@/components/admin/AdminFranchiseTab";
import { AdminStaffTab } from "@/components/admin/AdminStaffTab";
import { AdminPlansTab } from "@/components/admin/AdminPlansTab";
import { AdminInterestsTab } from "@/components/admin/AdminInterestsTab";
import { AdminCommunicationTab } from "@/components/admin/AdminCommunicationTab";
import { AdminPhotoModerationTab } from "@/components/admin/AdminPhotoModerationTab";
import { AdminCmsDesk } from "@/components/admin/AdminCmsDesk";
import AdminDuplicateDetectionTab from "@/components/admin/AdminDuplicateDetectionTab";
import AdminBulkToolsTab from "@/components/admin/AdminBulkToolsTab";
import AdminAutomationTab from "@/components/admin/AdminAutomationTab";
import AdminUserTimelineTab from "@/components/admin/AdminUserTimelineTab";
import AdminGlobalSearchDesk from "@/components/admin/AdminGlobalSearchDesk";
import {
  INITIAL_KYC_QUEUE,
  INITIAL_TRANSACTIONS,
  INITIAL_COUPONS,
  INITIAL_REPORTS,
  INITIAL_BROADCASTS,
  INITIAL_AUDIT_LOGS,
  type AdminAuditEntry,
} from "@/data/adminMockData";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Database,
  HeartHandshake,
  IndianRupee,
  AlertTriangle,
  BookOpen,
  Megaphone,
  Settings,
  LogOut,
  Menu,
  ExternalLink,
  LifeBuoy,
  Star,
  Sliders,
  TrendingUp,
  Activity,
  Building2,
  UserCheck,
  Crown,
  Heart,
  MessageSquare,
  Camera,
  Search,
  GitMerge,
  Layers,
  Zap,
  Clock,
} from "lucide-react";

const ADMIN_SESSION_KEY = "vivah_kar_lo_admin_session_v1";
const ADMIN_TOKEN_KEY = "vivah_kar_lo_admin_token_v1";

const ADMIN_NAV_ITEMS: {
  id: AdminTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "overview", label: "Executive Overview", icon: LayoutDashboard },
  { id: "search", label: "Smart Global Search", icon: Search },
  { id: "analytics", label: "Registration Graph", icon: TrendingUp },
  { id: "activity", label: "Recent Activity Stream", icon: Activity },
  { id: "timeline", label: "User Audit & Timeline", icon: Clock },
  { id: "users", label: "Users & Accounts", icon: Users },
  { id: "duplicates", label: "Duplicate Radar", icon: GitMerge },
  { id: "bulk-tools", label: "Bulk Operations Hub", icon: Layers },
  { id: "automation", label: "Automation Rules", icon: Zap },
  { id: "kyc", label: "KYC Verification", icon: ShieldCheck },
  { id: "photos", label: "Photo Moderation", icon: Camera },
  { id: "profiles", label: "Profile Moderation", icon: HeartHandshake },
  { id: "algorithm", label: "Matching Algorithm", icon: Sliders },
  { id: "plans", label: "Membership Plans", icon: Crown },
  { id: "payments", label: "Payments & Coupons", icon: IndianRupee },
  { id: "interests", label: "Interest Discovery", icon: Heart },
  { id: "communication", label: "Communication Desk", icon: MessageSquare },
  { id: "franchise", label: "Franchise & Branches", icon: Building2 },
  { id: "staff", label: "Staff & RBAC", icon: UserCheck },
  { id: "support", label: "Support & Helpdesk", icon: LifeBuoy },
  { id: "feedback", label: "Feedback & Reviews", icon: Star },
  { id: "reports", label: "Abuse Reports", icon: AlertTriangle },
  { id: "broadcast", label: "Bulk Broadcast", icon: Megaphone },
  { id: "cms", label: "Stories & CMS", icon: BookOpen },
  { id: "settings", label: "Settings • WhatsApp & Email", icon: Settings },
  { id: "database", label: "Database Explorer", icon: Database },
];

export default function AdminPortalPage() {
  const { toast } = useToast();
  const {
    accounts,
    activeSession,
    adminSetAccountStatus,
    adminVerifyUser,
    adminSetUserRole,
    adminUpdateAccount,
    adminCreateAccount,
    adminResetPassword,
    adminDeleteAccount,
    resetDemoAccounts,
  } = useAuthAccount();

  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ADMIN_SESSION_KEY);
    } catch {
      return null;
    }
  });

  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTabId>(() => {
    const parts = window.location.pathname.split("/").filter(Boolean);
    if (parts[0] === "admin" && parts[1] && parts[1] !== "login") {
      return parts[1] as AdminTabId;
    }
    return "overview";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync route subpath with active tab
  useEffect(() => {
    const parts = location.split("/").filter(Boolean);
    if (parts[0] === "admin" && parts[1] && parts[1] !== "login") {
      const validTabs: AdminTabId[] = [
        "overview",
        "search",
        "analytics",
        "activity",
        "timeline",
        "users",
        "duplicates",
        "bulk-tools",
        "automation",
        "kyc",
        "photos",
        "database",
        "profiles",
        "payments",
        "plans",
        "interests",
        "communication",
        "franchise",
        "staff",
        "reports",
        "cms",
        "broadcast",
        "settings",
        "support",
        "feedback",
        "algorithm",
      ];
      if (validTabs.includes(parts[1] as AdminTabId)) {
        setActiveTab(parts[1] as AdminTabId);
      }
    }
  }, [location]);

  const handleTabChange = (tab: AdminTabId, query?: string) => {
    setActiveTab(tab);
    setLocation(query ? `/admin/${tab}${query}` : `/admin/${tab}`);
  };

  // Admin panel operational state
  const [kycQueue, setKycQueue] = useState(INITIAL_KYC_QUEUE);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [broadcasts, setBroadcasts] = useState(INITIAL_BROADCASTS);
  const [auditLogs, setAuditLogs] =
    useState<AdminAuditEntry[]>(INITIAL_AUDIT_LOGS);

  useEffect(() => {
    document.title = adminEmail
      ? "Admin Dashboard - Vivah Kar Lo"
      : "Admin Login - Vivah Kar Lo";
  }, [adminEmail]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        handleTabChange("search");
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const appendAudit = (action: string, target: string) => {
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        actor: `Super Admin (${adminEmail || "admin@vivahkarlo.in"})`,
        action,
        target,
        timestamp: "Just now",
      },
      ...prev,
    ]);
  };

  useEffect(() => {
    // Intercept outgoing fetch requests to inject the administrative Bearer token
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      let newInit = init;
      const urlStr = typeof input === "string" ? input : input instanceof URL ? input.toString() : "";
      if (token && urlStr.startsWith("/api/")) {
        newInit = newInit || {};
        const headers = new Headers(newInit.headers || {});
        if (!headers.has("Authorization")) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        newInit.headers = headers;
      }
      return originalFetch(input, newInit);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const handleAdminLogin = (email: string, token: string) => {
    try {
      localStorage.setItem(ADMIN_SESSION_KEY, email);
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } catch {
      // Ignore storage error
    }
    setAdminEmail(email);
    appendAudit("Admin Sign In", email);
    toast({
      title: "Admin Session Verified",
      description: "Welcome to the Vivah Kar Lo Command Center.",
    });
  };

  const handleAdminLogout = () => {
    try {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch {
      // Ignore storage error
    }
    setAdminEmail(null);
    toast({ title: "Signed out of Admin Portal" });
  };

  if (!adminEmail) {
    return <AdminLoginView onLoginSuccess={handleAdminLogin} />;
  }

  const pendingKycCount = kycQueue.filter((k) => k.status === "Pending").length;
  const openReportsCount = reports.filter((r) => r.status === "Open").length;

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <AdminOverviewTab
            accounts={accounts}
            kycQueue={kycQueue}
            reports={reports}
            auditLogs={auditLogs}
            onNavigateTab={handleTabChange}
          />
        );
      case "analytics":
        return <AdminAnalyticsTab onNavigateTab={handleTabChange} />;
      case "activity":
        return <AdminActivityTab onNavigateTab={handleTabChange} />;
      case "users":
        return (
          <AdminUsersTab
            accounts={accounts}
            onSetStatus={adminSetAccountStatus}
            onVerifyUser={adminVerifyUser}
            onSetRole={adminSetUserRole}
            onUpdateUser={adminUpdateAccount}
            onAddUser={adminCreateAccount}
            onResetPassword={adminResetPassword}
            onDeleteUser={adminDeleteAccount}
            onLogAction={appendAudit}
          />
        );
      case "kyc":
        return (
          <AdminKycTab
            kycQueue={kycQueue}
            onUpdateKyc={(id, status) => {
              const target = kycQueue.find((k) => k.id === id);
              setKycQueue((prev) =>
                prev.map((k) => (k.id === id ? { ...k, status } : k))
              );
              appendAudit(
                `KYC ${status}`,
                target ? `${target.userName} (${target.profileId})` : id
              );
              toast({
                title: `KYC ${status}`,
                description: target
                  ? `${target.userName} marked as ${status}.`
                  : undefined,
              });
            }}
          />
        );
      case "photos":
        return <AdminPhotoModerationTab onLogAction={appendAudit} />;
      case "database":
        return (
          <AdminDatabaseTab
            accounts={accounts}
            activeSession={activeSession}
            transactions={transactions}
            reports={reports}
            onResetDatabase={() => {
              resetDemoAccounts();
              appendAudit("Reset Demo Database", "All Auth & Operational Tables");
            }}
          />
        );
      case "profiles":
        return (
          <AdminProfilesTab
            profiles={MOCK_PROFILES}
            onLogAction={appendAudit}
          />
        );
      case "plans":
        return <AdminPlansTab onLogAction={appendAudit} />;
      case "interests":
        return <AdminInterestsTab onLogAction={appendAudit} />;
      case "communication":
        return <AdminCommunicationTab onLogAction={appendAudit} />;
      case "franchise":
        return <AdminFranchiseTab onLogAction={appendAudit} />;
      case "staff":
        return <AdminStaffTab onLogAction={appendAudit} />;
      case "cms":
        return <AdminCmsDesk onLogAction={appendAudit} />;
      case "payments":
        return (
          <AdminPaymentsTab
            transactions={transactions}
            coupons={coupons}
            onRefundTxn={(txnId) => {
              setTransactions((prev) =>
                prev.map((t) =>
                  t.txnId === txnId ? { ...t, status: "Refunded" } : t
                )
              );
              appendAudit("Refunded Transaction", txnId);
              toast({ title: `Refund processed for ${txnId}` });
            }}
            onToggleCoupon={(code) => {
              setCoupons((prev) =>
                prev.map((c) =>
                  c.code === code ? { ...c, active: !c.active } : c
                )
              );
              appendAudit("Toggled Promo Coupon", code);
            }}
            onAddCoupon={(code, discountLabel) => {
              setCoupons((prev) => [
                {
                  code,
                  discountLabel,
                  usageCount: 0,
                  maxLimit: 250,
                  active: true,
                  expiry: "31 Dec 2026",
                },
                ...prev,
              ]);
              appendAudit("Created Promo Coupon", code);
            }}
          />
        );
      case "reports":
        return (
          <AdminReportsTab
            reports={reports}
            onResolveReport={(id, status) => {
              const target = reports.find((r) => r.id === id);
              setReports((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status } : r))
              );
              appendAudit(
                `Report ${status}`,
                target ? target.reportedUser : id
              );
              toast({ title: `Moderation action: ${status}` });
            }}
          />
        );
      case "broadcast":
        return (
          <AdminBroadcastTab
            broadcasts={broadcasts}
            onSendBroadcast={(title, audience, channel) => {
              setBroadcasts((prev) => [
                {
                  id: `bc-${Date.now()}`,
                  title,
                  audience,
                  channel,
                  sentAt: "Just now",
                  reachCount: accounts.length * 420,
                },
                ...prev,
              ]);
              appendAudit("Sent Bulk Broadcast", `${audience} (${channel})`);
            }}
          />
        );
      case "settings":
        return (
          <AdminSettingsTab
            auditLogs={auditLogs}
            onLogAction={appendAudit}
          />
        );
      case "support":
        return <AdminSupportTicketsTab onLogAction={appendAudit} />;
      case "feedback":
        return <AdminFeedbackTab onLogAction={appendAudit} />;
      case "algorithm":
        return <AdminMatchingAlgorithmDesk />;
      case "search":
        return (
          <AdminGlobalSearchDesk
            accounts={accounts}
            onNavigateTab={handleTabChange}
          />
        );
      case "duplicates":
        return (
          <AdminDuplicateDetectionTab
            onNavigateUser={(userId) =>
              handleTabChange("users", `?search=${userId}`)
            }
          />
        );
      case "bulk-tools":
        return (
          <AdminBulkToolsTab
            accounts={accounts}
            onUpdateAccount={adminUpdateAccount}
            onDeleteAccount={adminDeleteAccount}
          />
        );
      case "automation":
        return <AdminAutomationTab onNavigateTab={handleTabChange} />;
      case "timeline":
        return (
          <AdminUserTimelineTab
            accounts={accounts}
            onNavigateUser={(userId) =>
              handleTabChange("users", `?search=${userId}`)
            }
          />
        );
      default:
        return null;
    }
  };

  const mobileBottomTabs: {
    id: AdminTabId | "menu";
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "analytics", label: "Graph", icon: TrendingUp },
    { id: "users", label: "Users", icon: Users, badge: accounts.length },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "menu", label: "More", icon: Menu },
  ];

  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2B120C] flex flex-col overflow-x-hidden">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFDF9]/98 border-b border-amber-200/80">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-[68px] sm:h-[78px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="group shrink-0">
              <VivahBrandLogo size="sm" />
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B0A18] text-amber-200 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Super Admin</span>
              <span className="sm:hidden">Admin</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleTabChange("search")}
              className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-stone-100 hover:bg-amber-100/70 border border-amber-200/90 text-xs text-stone-700 transition-colors shadow-2xs font-medium"
            >
              <Search className="w-3.5 h-3.5 text-amber-700" />
              <span>Smart Search...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-white border border-stone-200 rounded text-stone-500 font-mono font-bold">
                Ctrl K
              </kbd>
            </button>

            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-50 hover:bg-orange-100 border border-amber-200 text-xs font-semibold text-[#3B0A18]"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#EA580C]" />
              Live Website
            </Link>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAdminLogout}
              className="hidden sm:inline-flex rounded-full border-amber-300 text-[#3B0A18] hover:bg-rose-50 hover:text-rose-700 h-10 px-4"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Admin Logout
            </Button>

            {/* Mobile Drawer */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden rounded-full border-amber-200 bg-white text-[#3B0A18]"
                  aria-label="Open Admin Menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] bg-[#FFFDF9] border-l border-amber-200 flex flex-col justify-between overflow-y-auto"
              >
                <div>
                  <SheetHeader className="text-left pb-4 border-b border-amber-100">
                    <SheetTitle>
                      <VivahBrandLogo size="sm" />
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-4 space-y-1">
                    {ADMIN_NAV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const active = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            handleTabChange(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                            active
                              ? "bg-saffron-gradient text-white shadow-sm"
                              : "text-[#3E2723] hover:bg-amber-50"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
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
                      Live Website
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    onClick={handleAdminLogout}
                    className="w-full rounded-xl"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Admin Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Quick Feature Chips */}
        <div className="lg:hidden border-t border-amber-100 bg-white px-3 py-2 flex overflow-x-auto no-scrollbar gap-2">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  active
                    ? "bg-[#3B0A18] text-amber-100 border-[#3B0A18]"
                    : "bg-amber-50/70 text-[#5C4740] border-amber-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 w-full grid lg:grid-cols-[270px_1fr]">
        {/* Dark Rosewood Admin Sidebar */}
        <aside className="hidden lg:flex flex-col justify-between bg-[#2B0712] text-amber-50 p-4 sticky top-[78px] h-[calc(100vh-78px)] overflow-y-auto">
          <nav className="space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              const badge =
                item.id === "kyc"
                  ? pendingKycCount
                  : item.id === "reports"
                  ? openReportsCount
                  : item.id === "users"
                  ? accounts.length
                  : item.id === "duplicates"
                  ? 3
                  : item.id === "automation"
                  ? 8
                  : 0;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "bg-saffron-gradient text-white shadow-saffron-sm"
                      : "text-amber-100/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </span>
                  {badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        active
                          ? "bg-white text-[#EA580C]"
                          : "bg-amber-400/20 text-amber-200"
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 mt-4 border-t border-amber-200/15 space-y-3">
            <div className="px-2 text-xs text-amber-200/80 truncate">
              Signed in: <strong className="text-white">{adminEmail}</strong>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleAdminLogout}
              className="w-full rounded-xl bg-white/10 border-amber-300/30 text-white hover:bg-rose-600 hover:border-rose-500 font-semibold h-10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out Admin
            </Button>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-10">{renderTab()}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="Mobile admin navigation"
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
                    handleTabChange(t.id);
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
    </div>
  );
}
