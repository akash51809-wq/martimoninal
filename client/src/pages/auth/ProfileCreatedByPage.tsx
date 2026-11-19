import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuthAccount } from "@/context/AuthAccountContext";
import type { ProfileCreatedByOption } from "@/types/authTypes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  UserCheck,
  Users,
  HeartHandshake,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const CREATED_BY_OPTIONS: {
  value: ProfileCreatedByOption;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: "Self",
    title: "Self",
    desc: "I am creating this profile for my own marriage search",
    icon: UserCheck,
  },
  {
    value: "Parents",
    title: "Parents",
    desc: "Creating on behalf of our son or daughter",
    icon: Users,
  },
  {
    value: "Brother / Sister",
    title: "Brother / Sister",
    desc: "Creating an alliance profile for my sibling",
    icon: HeartHandshake,
  },
  {
    value: "Relative",
    title: "Relative",
    desc: "Creating on behalf of a family member",
    icon: Users,
  },
  {
    value: "Friend",
    title: "Friend",
    desc: "Helping a close friend start their search",
    icon: Sparkles,
  },
];

export default function ProfileCreatedByPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { currentAccount, setProfileCreatedBy } = useAuthAccount();

  const [selected, setSelected] = useState<ProfileCreatedByOption>("Self");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    document.title = "Profile Created By - Vivah Kar Lo";
  }, []);

  useEffect(() => {
    if (currentAccount?.user.profileCreatedBy) {
      setSelected(currentAccount.user.profileCreatedBy);
    }
  }, [currentAccount]);

  if (!currentAccount) {
    return (
      <AuthLayout
        title="Profile Created By (Step 4)"
        subtitle="Please complete account registration or sign in first to continue."
        activeStep={4}
        showSteps={true}
        topRightLink={{ label: "Register", href: "/register" }}
      >
        <div className="py-6 text-center space-y-4">
          <p className="text-base text-[#5C4740]">
            No active account session found. Please register or sign in first.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/register">
              <Button className="w-full sm:w-auto h-11 px-6 rounded-xl bg-saffron-gradient text-white font-semibold">
                Register Free
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-11 px-6 rounded-xl border-amber-300 text-[#3B0A18] font-semibold"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  const handleConfirm = () => {
    const res = setProfileCreatedBy(selected, currentAccount.user.id);
    if (!res.ok) {
      toast({
        title: "Error",
        description: res.error,
        variant: "destructive",
      });
      return;
    }

    setCompleted(true);
    toast({
      title: "Account Successfully Created",
      description: "You are ready for the Profile Creation Wizard.",
    });
  };

  if (completed) {
    return (
      <AuthLayout
        title="Account Successfully Created"
        subtitle="Your Vivah Kar Lo account is active. Complete your matrimonial profile to unlock full matching and discovery."
        activeStep={4}
        showSteps={true}
      >
        <div className="space-y-6">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 flex items-start gap-3.5">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif-royal text-lg font-bold text-emerald-950">
                Welcome, {currentAccount.user.fullName}!
              </h3>
              <p className="text-sm text-emerald-800 mt-0.5">
                Your mobile and email verifications are complete and Profile Created By:{" "}
                <strong>{selected}</strong> has been saved.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7C2D12]">
              <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
              Account &amp; Profile State
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
              <div className="bg-white rounded-xl p-3 border border-amber-100 flex justify-between">
                <span className="text-[#5C4740]">account_status</span>
                <span className="font-bold text-emerald-700">active</span>
              </div>
              <div className="bg-white rounded-xl p-3 border border-amber-100 flex justify-between">
                <span className="text-[#5C4740]">mobile_verified</span>
                <span className="font-bold text-emerald-700">
                  {String(currentAccount.verification.mobileVerified)}
                </span>
              </div>
              <div className="bg-white rounded-xl p-3 border border-amber-100 flex justify-between">
                <span className="text-[#5C4740]">email_verified</span>
                <span className="font-bold text-emerald-700">
                  {String(currentAccount.verification.emailVerified)}
                </span>
              </div>
              <div className="bg-white rounded-xl p-3 border border-amber-100 flex justify-between">
                <span className="text-[#5C4740]">profile_status</span>
                <span className="font-bold text-[#EA580C]">
                  {currentAccount.profileMeta.profileStatus} (
                  {currentAccount.profileMeta.profileCompletion}%)
                </span>
              </div>
            </div>
            <p className="text-xs text-[#6E564E]">
              * Standard matching and discovery features remain restricted until your matrimonial profile is completed.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setLocation("/dashboard?tab=profile")}
            className="w-full h-12 rounded-xl bg-saffron-gradient hover:opacity-95 text-white font-semibold text-base shadow-saffron-sm"
          >
            Next: Go to User Dashboard &amp; Profile Wizard →
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Step 4: Profile Created By"
      subtitle="Select who is creating and managing this matrimonial profile."
      activeStep={4}
      showSteps={true}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CREATED_BY_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selected === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelected(opt.value)}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? "border-[#FF6B00] bg-orange-50/70 shadow-sm"
                    : "border-amber-200/80 bg-[#FFFDF9] hover:border-amber-300"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-saffron-gradient text-white"
                      : "bg-amber-100 text-[#EA580C]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-serif-royal text-base font-bold text-[#2B120C]">
                    {opt.title}
                  </p>
                  <p className="text-xs sm:text-sm text-[#5C4740] mt-0.5">
                    {opt.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <Button
          type="button"
          onClick={handleConfirm}
          className="w-full h-12 rounded-xl bg-saffron-gradient hover:opacity-95 text-white font-semibold text-base shadow-saffron-sm mt-2"
        >
          Complete Account Setup
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </AuthLayout>
  );
}
