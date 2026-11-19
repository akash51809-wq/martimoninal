import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuthAccount } from "@/context/AuthAccountContext";
import { Button } from "@/components/ui/button";
import { LogOut, Lock, UserPlus, CheckCircle2 } from "lucide-react";

export default function ProfileSetupStarterPage() {
  const [, setLocation] = useLocation();
  const { currentAccount, logout } = useAuthAccount();

  useEffect(() => {
    document.title = "Profile Setup - Vivah Kar Lo";
  }, []);

  return (
    <AuthLayout
      title="Profile Creation Wizard"
      subtitle="Your account is verified and active. Complete your matrimonial profile to unlock full matching and discovery."
      topRightLink={{ label: "Home", href: "/" }}
    >
      {!currentAccount ? (
        <div className="py-6 text-center space-y-4">
          <p className="text-base text-[#5C4740]">
            Please sign in to continue setting up your matrimonial profile.
          </p>
          <Link href="/login">
            <Button className="h-11 px-6 rounded-xl bg-saffron-gradient text-white font-semibold">
              Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-serif-royal text-lg font-bold text-[#2B120C]">
                  {currentAccount.user.fullName}
                </p>
                <p className="text-sm text-[#5C4740]">
                  Created By: {currentAccount.user.profileCreatedBy || "Self"} •{" "}
                  {currentAccount.user.email}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-orange-100 text-[#C2410C] text-xs font-bold">
                Profile {currentAccount.profileMeta.profileCompletion}%
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-white border border-amber-200 overflow-hidden">
              <div
                className="h-full bg-saffron-gradient transition-all"
                style={{
                  width: `${Math.max(5, currentAccount.profileMeta.profileCompletion)}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white rounded-xl p-2.5 border border-amber-100">
                <p className="text-[#8C6D62]">account_status</p>
                <p className="font-bold text-emerald-700 mt-0.5">
                  {currentAccount.user.accountStatus}
                </p>
              </div>
              <div className="bg-white rounded-xl p-2.5 border border-amber-100">
                <p className="text-[#8C6D62]">mobile_verified</p>
                <p className="font-bold text-emerald-700 mt-0.5">
                  {String(currentAccount.verification.mobileVerified)}
                </p>
              </div>
              <div className="bg-white rounded-xl p-2.5 border border-amber-100">
                <p className="text-[#8C6D62]">email_verified</p>
                <p className="font-bold text-emerald-700 mt-0.5">
                  {String(currentAccount.verification.emailVerified)}
                </p>
              </div>
              <div className="bg-white rounded-xl p-2.5 border border-amber-100">
                <p className="text-[#8C6D62]">profile_status</p>
                <p className="font-bold text-[#EA580C] mt-0.5">
                  {currentAccount.profileMeta.profileStatus}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-amber-200 p-4 flex items-start gap-3 text-sm text-[#4E342E]">
            <Lock className="w-5 h-5 text-[#EA580C] shrink-0 mt-0.5" />
            <p>
              <strong>Access Policy:</strong> Standard matching and discovery features remain locked until your matrimonial profile (education, career, family, horoscope, and photos) is completed.
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4 flex items-start gap-3 text-sm text-emerald-950">
            <UserPlus className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <p>
              <strong>Next Module:</strong> The full multi-step Profile Creation &amp; Partner Preference wizard connects right here in the next build step.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Link href="/" className="flex-1">
              <Button className="w-full h-11 rounded-xl bg-saffron-gradient text-white font-semibold">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Back to Homepage
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
