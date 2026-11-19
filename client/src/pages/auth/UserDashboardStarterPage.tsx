import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuthAccount } from "@/context/AuthAccountContext";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  LogOut,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";

export default function UserDashboardStarterPage() {
  const [, setLocation] = useLocation();
  const { currentAccount, activeSession, logout } = useAuthAccount();

  useEffect(() => {
    document.title = "User Dashboard - Vivah Kar Lo";
  }, []);

  return (
    <AuthLayout
      title="User Dashboard"
      subtitle="View your verified account overview and active session details."
      topRightLink={{ label: "Home", href: "/" }}
    >
      {!currentAccount ? (
        <div className="py-6 text-center space-y-4">
          <p className="text-base text-[#5C4740]">
            Please sign in to access your dashboard.
          </p>
          <Link href="/login">
            <Button className="h-11 px-6 rounded-xl bg-saffron-gradient text-white font-semibold">
              Go to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-royal text-xl font-bold text-emerald-950">
                  Welcome, {currentAccount.user.fullName}
                </h3>
                <p className="text-sm text-emerald-800 mt-0.5">
                  +91 {currentAccount.user.mobile} • {currentAccount.user.email}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-emerald-800 text-xs font-bold border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Account Active
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-[#EA580C] text-xs font-bold border border-amber-200">
                    <Sparkles className="w-3.5 h-3.5" />
                    Profile {currentAccount.profileMeta.profileCompletion}% Complete
                  </span>
                </div>
              </div>
            </div>
          </div>

          {activeSession && (
            <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-4 space-y-1.5 text-sm text-[#4E342E]">
              <p className="font-bold text-[#3B0A18] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
                Active Session
              </p>
              <p>Device: {activeSession.deviceLabel}</p>
              <p className="text-xs font-mono text-[#785C52] truncate">
                Session ID: {activeSession.sessionId}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1">
              <Button className="w-full h-11 rounded-xl bg-saffron-gradient text-white font-semibold">
                Explore Matches on Homepage →
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                logout();
                setLocation("/login");
              }}
              className="h-11 px-6 rounded-xl border-amber-300 text-[#3B0A18] font-semibold"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
