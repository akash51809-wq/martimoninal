import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { OtpVerificationBox } from "@/components/auth/OtpVerificationBox";
import { useAuthAccount } from "@/context/AuthAccountContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Smartphone,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { findAccountByIdentifier, resetPasswordWithOtp } = useAuthAccount();

  const [step, setStep] = useState<"lookup" | "otp" | "reset" | "done">(
    "lookup"
  );
  const [identifier, setIdentifier] = useState("");
  const [demoOtp, setDemoOtp] = useState("482910");
  const [expiresAt, setExpiresAt] = useState<number>(Date.now() + 120000);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | undefined>(undefined);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Forgot / Reset Password - Vivah Kar Lo";
  }, []);

  const issueDemoOtp = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setDemoOtp(code);
    setExpiresAt(Date.now() + 2 * 60 * 1000);
    setAttempts(0);
    setLockedUntil(undefined);
    return code;
  };

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const acc = findAccountByIdentifier(identifier);
    if (!acc) {
      setError(
        "No account found with this mobile number or email address. Please check and try again."
      );
      return;
    }

    if (acc.user.accountStatus === "deleted") {
      setError("This account has been closed — password recovery is unavailable.");
      return;
    }

    const code = issueDemoOtp();
    setStep("otp");
    toast({
      title: "Password Recovery OTP Sent",
      description: `Demo OTP: ${code}`,
    });
  };

  const handleVerifyOtp = (entered: string) => {
    setError("");
    if (lockedUntil && Date.now() < lockedUntil) {
      setError("Temporary security lock active. Please try again shortly.");
      return;
    }
    if (Date.now() > expiresAt) {
      setError("OTP has expired. Please request a new OTP.");
      return;
    }
    if (entered !== demoOtp) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      if (nextAttempts >= 3) {
        setLockedUntil(Date.now() + 60 * 1000);
        setError("3 wrong OTP attempts entered. Locked for 60 seconds.");
      } else {
        setError(`Invalid OTP. ${3 - nextAttempts} attempt(s) remaining.`);
      }
      return;
    }

    setStep("reset");
    toast({
      title: "OTP Verified",
      description: "Now set a new password for your account.",
    });
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New Password and Confirm Password do not match.");
      return;
    }

    const res = resetPasswordWithOtp(identifier, newPassword);
    if (!res.ok) {
      setError(res.error || "Unable to update password.");
      return;
    }

    setStep("done");
    toast({
      title: "Password Updated Successfully",
      description: "You can now sign in with your new password.",
    });
  };

  return (
    <AuthLayout
      title={
        step === "lookup"
          ? "Reset Your Password"
          : step === "otp"
          ? "Verify Recovery OTP"
          : step === "reset"
          ? "Create New Password"
          : "Password Updated"
      }
      subtitle={
        step === "lookup"
          ? "Enter your registered mobile number or email address to receive a recovery OTP."
          : step === "otp"
          ? "Enter the 6-digit OTP to verify your identity."
          : step === "reset"
          ? "Choose a strong new password for your Vivah Kar Lo account."
          : "Your password has been updated securely."
      }
      topRightLink={{ label: "Back to Login", href: "/login" }}
    >
      {error && step !== "otp" && (
        <Alert
          variant="destructive"
          className="rounded-xl bg-rose-50 border-rose-200 text-rose-800"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {step === "lookup" && (
        <form onSubmit={handleLookupSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label
              htmlFor="fp-identifier"
              className="text-sm font-semibold text-[#4E342E]"
            >
              Registered Mobile Number or Email Address
            </Label>
            <div className="relative">
              <Smartphone className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                id="fp-identifier"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g., 9876543210 or arjun@vivahkarlo.in"
                className="h-12 pl-10 rounded-xl border-amber-200 bg-[#FFFDF9] text-base sm:text-[15px]"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-saffron-gradient hover:opacity-95 text-white font-semibold text-base shadow-saffron-sm"
          >
            Send Recovery OTP
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      )}

      {step === "otp" && (
        <OtpVerificationBox
          channelLabel="registered contact"
          targetValue={identifier}
          demoOtp={demoOtp}
          expiresAt={expiresAt}
          lockedUntil={lockedUntil}
          errorMessage={error}
          onVerify={handleVerifyOtp}
          onResend={() => {
            setError("");
            const code = issueDemoOtp();
            toast({
              title: "New Recovery OTP Sent",
              description: `Demo OTP: ${code}`,
            });
          }}
          onSimulateExpiry={() => setExpiresAt(Date.now() - 1000)}
        />
      )}

      {step === "reset" && (
        <form onSubmit={handleResetSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="fp-new-password"
              className="text-sm font-semibold text-[#4E342E]"
            >
              New Password
            </Label>
            <PasswordInput
              id="fp-new-password"
              value={newPassword}
              onChange={setNewPassword}
              showStrength={true}
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="fp-confirm-password"
              className="text-sm font-semibold text-[#4E342E]"
            >
              Confirm New Password
            </Label>
            <PasswordInput
              id="fp-confirm-password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-saffron-gradient hover:opacity-95 text-white font-semibold text-base shadow-saffron-sm"
          >
            <KeyRound className="w-4 h-4 mr-2" />
            Update Password
          </Button>
        </form>
      )}

      {step === "done" && (
        <div className="py-4 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <p className="text-base text-[#5C4740]">
            Your password has been updated successfully. You can now sign in with your new password.
          </p>
          <Button
            onClick={() => setLocation("/login")}
            className="w-full sm:w-auto px-8 h-12 rounded-xl bg-saffron-gradient text-white font-semibold text-base shadow-saffron-sm"
          >
            Continue to Sign In →
          </Button>
        </div>
      )}

      <div className="pt-2 text-center text-sm text-[#5C4740]">
        <Link
          href="/login"
          className="font-semibold text-[#EA580C] hover:underline underline-offset-4"
        >
          ← Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
