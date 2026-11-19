import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuthAccount } from "@/context/AuthAccountContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, Ban, Phone, Mail, LogOut, RotateCcw } from "lucide-react";

export default function AccountStatusPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { statusNoticeAccount, currentAccount, logout, reactivateMyAccount } = useAuthAccount();

  const target = statusNoticeAccount || currentAccount;
  const isDeleted = target?.user.accountStatus === "deleted";

  useEffect(() => {
    document.title = "Account Status - Vivah Kar Lo";
  }, []);

  const handleReactivate = () => {
    if (!target) return;
    const res = reactivateMyAccount(target.user.id);
    if (res.ok) {
      toast({
        title: "Account Reactivated! ✓",
        description: "Welcome back! Your profile is now active and visible to verified matches.",
      });
      setLocation("/dashboard");
    }
  };

  return (
    <AuthLayout
      title={
        isDeleted
          ? "Account Deletion Policy Notice"
          : "Account Temporarily Suspended"
      }
      subtitle={
        isDeleted
          ? "This account has been closed under our Account Deletion Policy."
          : "Login is temporarily blocked pending a Trust & Safety compliance review."
      }
      topRightLink={{ label: "Back to Login", href: "/login" }}
    >
      <div className="space-y-5">
        <div
          className={`rounded-2xl p-5 border flex items-start gap-4 ${
            isDeleted
              ? "bg-slate-50 border-slate-200 text-slate-900"
              : "bg-rose-50 border-rose-200 text-rose-950"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isDeleted
                ? "bg-slate-200 text-slate-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {isDeleted ? (
              <Ban className="w-6 h-6" />
            ) : (
              <ShieldAlert className="w-6 h-6" />
            )}
          </div>
          <div className="space-y-1.5">
            <p className="font-serif-royal text-lg font-bold">
              {target ? `${target.user.fullName} (${target.user.email})` : "Account Restricted"}
            </p>
            <p className="text-sm leading-relaxed">
              {isDeleted
                ? "Per our Account Deletion Policy, sign-in is disabled for deleted accounts. Please contact our support team if you need assistance or wish to create a new account."
                : target?.user.suspensionReason ||
                  "Access is restricted until identity and profile verification checks are completed."}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-4 space-y-2 text-sm text-[#4E342E]">
          <p className="font-bold text-[#3B0A18]">Support &amp; Appeals Contact:</p>
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#EA580C]" />
            +91 9176 400 700 (Trust &amp; Safety Desk)
          </p>
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#EA580C]" />
            concierge@vivahkarlo.in
          </p>
        </div>

        {!isDeleted && target && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-emerald-900">
              <p className="font-bold text-sm">Temporarily Deactivated Your Profile?</p>
              <p className="mt-0.5">
                Restore your matrimonial profile, chats, and match recommendations instantly with one click.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleReactivate}
              className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reactivate My Account
            </Button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            onClick={() => {
              logout();
              setLocation("/login");
            }}
            className="flex-1 h-11 rounded-xl bg-saffron-gradient text-white font-semibold"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign In With Another Account
          </Button>
          <Link href="/" className="flex-1">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 rounded-xl border-amber-300 text-[#3B0A18] font-semibold"
            >
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
