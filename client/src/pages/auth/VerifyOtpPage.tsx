import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { OtpVerificationBox } from "@/components/auth/OtpVerificationBox";
import { useAuthAccount } from "@/context/AuthAccountContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Mail, Smartphone, Clock } from "lucide-react";

export default function VerifyOtpPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { currentAccount, sendOtp, verifyOtp, expireOtpForDemo } =
    useAuthAccount();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    document.title = "OTP Verification - Vivah Kar Lo";
  }, []);

  if (!currentAccount) {
    return (
      <AuthLayout
        title="OTP Verification"
        subtitle="Please create a new account or sign in first to continue verification."
        activeStep={2}
        showSteps={true}
        topRightLink={{ label: "Login", href: "/login" }}
      >
        <div className="py-6 text-center space-y-4">
          <p className="text-base text-[#5C4740]">
            No active onboarding session found.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/register">
              <Button className="w-full sm:w-auto h-11 px-6 rounded-xl bg-saffron-gradient text-white font-semibold">
                Create Free Account
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-11 px-6 rounded-xl border-amber-300 text-[#3B0A18] font-semibold"
              >
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  const { user, verification } = currentAccount;
  const activeChannel: "mobile" | "email" = !verification.mobileVerified
    ? "mobile"
    : "email";
  const activeStepNum: 2 | 3 = activeChannel === "mobile" ? 2 : 3;

  const dispatchLiveGatewayOtp = (channel: "mobile" | "email", otpCode?: string) => {
    const gwChannel = channel === "mobile" ? "whatsapp" : "email";
    const destination = channel === "mobile" ? user.mobile : user.email;
    fetch("/api/v1/gateway/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: gwChannel,
        destination,
        otpCode,
        purpose: channel === "mobile" ? "WhatsApp Registration OTP" : "Email Registration OTP",
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.deliveredLive) {
          toast({
            title:
              channel === "mobile"
                ? "Live WhatsApp OTP Sent!"
                : "Live Email OTP Sent!",
            description: d.message,
          });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (
      activeChannel === "mobile" &&
      !verification.mobileVerified &&
      !verification.mobileOtpCode
    ) {
      const res = sendOtp("mobile", user.id);
      if (res.ok) dispatchLiveGatewayOtp("mobile", res.data?.otp);
    } else if (
      activeChannel === "email" &&
      !verification.emailVerified &&
      !verification.emailOtpCode
    ) {
      const res = sendOtp("email", user.id);
      if (res.ok) dispatchLiveGatewayOtp("email", res.data?.otp);
    }
  }, [activeChannel, user.id, verification]);

  const handleVerify = (code: string) => {
    setErrorMsg("");
    const res = verifyOtp(activeChannel, code, user.id);
    if (!res.ok) {
      setErrorMsg(res.error || "OTP verification failed.");
      return;
    }

    if (activeChannel === "mobile") {
      toast({
        title: "WhatsApp / Mobile Number Verified ✓",
        description:
          "Please verify your email address next to activate your account.",
      });
      if (res.data?.nextRoute === "/profile-created-by") {
        setLocation("/profile-created-by");
      }
      return;
    }

    toast({
      title: "WhatsApp & Email Verified ✓",
      description: "Your account is now Active. Complete the final step to finish setup.",
    });
    setLocation("/profile-created-by");
  };

  const handleResend = () => {
    setErrorMsg("");
    const res = sendOtp(activeChannel, user.id);
    if (res.ok) {
      dispatchLiveGatewayOtp(activeChannel, res.data?.otp);
      toast({
        title:
          activeChannel === "mobile"
            ? "WhatsApp OTP Dispatched"
            : "Email OTP Dispatched",
        description: `Code sent via live gateway (Demo fallback: ${res.data?.otp})`,
      });
    }
  };

  return (
    <AuthLayout
      title={
        activeChannel === "mobile"
          ? "Step 2: WhatsApp & Mobile OTP Verification"
          : "Step 3: Email OTP Verification"
      }
      subtitle={
        activeChannel === "mobile"
          ? "Enter the 6-digit OTP sent to your mobile number to verify your contact."
          : "Your mobile is verified. Enter the 6-digit Email OTP to activate your account."
      }
      activeStep={activeStepNum}
      showSteps={true}
      topRightLink={{ label: "Sign In", href: "/login" }}
    >
      {/* Verification Status Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          className={`flex items-center justify-between p-3.5 rounded-2xl border ${
            verification.mobileVerified
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-amber-50 border-amber-300 text-[#2B120C]"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 shrink-0" />
            <span className="text-sm font-semibold">Mobile OTP</span>
          </div>
          {verification.mobileVerified ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#EA580C]">
              <Clock className="w-3.5 h-3.5" />
              Pending
            </span>
          )}
        </div>

        <div
          className={`flex items-center justify-between p-3.5 rounded-2xl border ${
            verification.emailVerified
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : activeChannel === "email"
              ? "bg-amber-50 border-amber-300 text-[#2B120C]"
              : "bg-gray-50 border-gray-200 text-gray-500"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 shrink-0" />
            <span className="text-sm font-semibold">Email OTP</span>
          </div>
          {verification.emailVerified ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#EA580C]">
              <Clock className="w-3.5 h-3.5" />
              Pending
            </span>
          )}
        </div>
      </div>

      <OtpVerificationBox
        key={activeChannel}
        channelLabel={
          activeChannel === "mobile" ? "registered mobile" : "registered email"
        }
        targetValue={
          activeChannel === "mobile" ? `+91 ${user.mobile}` : user.email
        }
        demoOtp={
          activeChannel === "mobile"
            ? verification.mobileOtpCode
            : verification.emailOtpCode
        }
        expiresAt={
          activeChannel === "mobile"
            ? verification.mobileOtpExpiresAt
            : verification.emailOtpExpiresAt
        }
        lockedUntil={
          activeChannel === "mobile"
            ? verification.mobileLockedUntil
            : verification.emailLockedUntil
        }
        errorMessage={errorMsg}
        onVerify={handleVerify}
        onResend={handleResend}
        onSimulateExpiry={() => expireOtpForDemo(activeChannel, user.id)}
      />
    </AuthLayout>
  );
}
