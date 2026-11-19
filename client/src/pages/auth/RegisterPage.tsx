import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useAuthAccount } from "@/context/AuthAccountContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Smartphone,
  Mail,
  Calendar,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

function calculateAge(dobStr: string): number {
  const dob = new Date(dobStr);
  if (Number.isNaN(dob.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { registerStep1, isMobileRegistered, isEmailRegistered } =
    useAuthAccount();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [dob, setDob] = useState("");
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [confirmedAge, setConfirmedAge] = useState(false);
  const [legalDialog, setLegalDialog] = useState<"privacy" | "terms" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Register Free - Vivah Kar Lo";
  }, []);

  // Real-time live duplicate checks across ALL accounts as the user types
  const liveMobileDuplicate = useMemo(
    () => isMobileRegistered(mobile),
    [mobile, isMobileRegistered]
  );

  const liveEmailDuplicate = useMemo(
    () => isEmailRegistered(email),
    [email, isEmailRegistered]
  );

  const cleanMobileDigits = useMemo(() => {
    const digits = mobile.replace(/\D/g, "");
    return digits.length > 10 && digits.startsWith("91")
      ? digits.slice(-10)
      : digits;
  }, [mobile]);

  const isMobileValidFormat = /^[6-9]\d{9}$/.test(cleanMobileDigits);
  const isEmailValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (fullName.trim().length < 2) {
      setError("Please enter your full name (minimum 2 characters).");
      return;
    }

    if (!isMobileValidFormat) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (liveMobileDuplicate) {
      setError("This mobile number is already registered.");
      return;
    }

    if (!isEmailValidFormat) {
      setError("Please enter a valid email address.");
      return;
    }

    if (liveEmailDuplicate) {
      setError("This email is already registered.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    if (!dob) {
      setError("Please select your Date of Birth.");
      return;
    }

    const age = calculateAge(dob);
    const minAge = gender === "Male" ? 21 : 18;
    if (age < minAge) {
      setError(
        `Minimum age for marriage registration is ${minAge} years for ${
          gender === "Male" ? "Groom (Male)" : "Bride (Female)"
        }.`
      );
      return;
    }

    if (!acceptedPrivacy || !acceptedTerms || !confirmedAge) {
      setError(
        "Please confirm your legal marriageable age and accept both the Privacy Policy and Terms & Conditions to register."
      );
      return;
    }

    try {
      localStorage.setItem(
        "vivah_legal_consent",
        JSON.stringify({
          privacyPolicyAccepted: true,
          privacyPolicyVersion: "v2.4",
          termsAccepted: true,
          termsVersion: "v2.4",
          acceptedAt: new Date().toISOString(),
          email: email.trim(),
        })
      );
    } catch {
      // Safe fallback
    }

    const res = registerStep1({
      fullName,
      mobile: cleanMobileDigits,
      email,
      password,
      gender,
      dob,
    });

    if (!res.ok) {
      setError(res.error || "Unable to create account.");
      return;
    }

    toast({
      title: "Step 1 Complete — Mobile OTP Sent",
      description: `Demo OTP: ${res.data?.otp}`,
    });
    setLocation("/verify-otp");
  };

  return (
    <AuthLayout
      title="Create Free Account (Step 1 of 4)"
      subtitle="Start by creating your verified account. After mobile and email OTP verification, you can complete your matrimonial profile."
      activeStep={1}
      showSteps={true}
      topRightLink={{ label: "Sign In", href: "/login" }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert
            variant="destructive"
            className="rounded-xl bg-rose-50 border-rose-200 text-rose-800"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm font-medium space-y-1.5">
              <p>{error}</p>
              {(liveMobileDuplicate || liveEmailDuplicate) && (
                <div className="flex flex-wrap gap-3 pt-0.5">
                  <Link
                    href="/login"
                    className="underline font-bold text-[#3B0A18]"
                  >
                    Sign In instead →
                  </Link>
                  <Link
                    href="/forgot-password"
                    className="underline font-bold text-[#EA580C]"
                  >
                    Reset Password →
                  </Link>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Full Name */}
        <div className="space-y-1.5">
          <Label
            htmlFor="reg-name"
            className="text-sm font-semibold text-[#4E342E]"
          >
            Full Name
          </Label>
          <div className="relative">
            <User className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="reg-name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g., Aarav Kulkarni"
              className="h-12 pl-10 rounded-xl border-amber-200 bg-[#FFFDF9] text-base sm:text-[15px]"
            />
          </div>
        </div>

        {/* Mobile & Email with Instant Live Duplicate Detection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="reg-mobile"
              className="text-sm font-semibold text-[#4E342E]"
            >
              Mobile Number (10 Digits)
            </Label>
            <div className="relative">
              <Smartphone
                className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                  liveMobileDuplicate ? "text-rose-600" : "text-amber-600"
                }`}
              />
              <Input
                id="reg-mobile"
                type="tel"
                inputMode="numeric"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="9876543210"
                aria-invalid={liveMobileDuplicate}
                className={`h-12 pl-10 pr-10 rounded-xl bg-[#FFFDF9] text-base sm:text-[15px] ${
                  liveMobileDuplicate
                    ? "border-rose-500 focus-visible:ring-rose-500"
                    : "border-amber-200"
                }`}
              />
              {isMobileValidFormat && !liveMobileDuplicate && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
              )}
              {liveMobileDuplicate && (
                <AlertCircle className="w-4 h-4 text-rose-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
              )}
            </div>
            {liveMobileDuplicate && (
              <p
                role="alert"
                className="text-xs font-semibold text-rose-600 flex items-center justify-between gap-2 pt-0.5"
              >
                <span>This mobile number is already registered.</span>
                <Link href="/login" className="underline text-[#3B0A18] shrink-0">
                  Login →
                </Link>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="reg-email"
              className="text-sm font-semibold text-[#4E342E]"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail
                className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                  liveEmailDuplicate ? "text-rose-600" : "text-amber-600"
                }`}
              />
              <Input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                aria-invalid={liveEmailDuplicate}
                className={`h-12 pl-10 pr-10 rounded-xl bg-[#FFFDF9] text-base sm:text-[15px] ${
                  liveEmailDuplicate
                    ? "border-rose-500 focus-visible:ring-rose-500"
                    : "border-amber-200"
                }`}
              />
              {isEmailValidFormat && !liveEmailDuplicate && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
              )}
              {liveEmailDuplicate && (
                <AlertCircle className="w-4 h-4 text-rose-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
              )}
            </div>
            {liveEmailDuplicate && (
              <p
                role="alert"
                className="text-xs font-semibold text-rose-600 flex items-center justify-between gap-2 pt-0.5"
              >
                <span>This email is already registered.</span>
                <Link href="/login" className="underline text-[#3B0A18] shrink-0">
                  Login →
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Gender & DOB */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-[#4E342E]">
              Gender
            </Label>
            <div className="grid grid-cols-2 gap-2 h-12 p-1 rounded-xl bg-amber-50/70 border border-amber-200">
              {(["Male", "Female"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`rounded-lg text-sm font-semibold transition-all ${
                    gender === g
                      ? "bg-saffron-gradient text-white shadow-sm"
                      : "text-[#5C4740] hover:text-[#3B0A18]"
                  }`}
                >
                  {g === "Male" ? "Groom (Male)" : "Bride (Female)"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="reg-dob"
              className="text-sm font-semibold text-[#4E342E]"
            >
              Date of Birth
            </Label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                id="reg-dob"
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="h-12 pl-10 rounded-xl border-amber-200 bg-[#FFFDF9] text-base sm:text-[15px]"
              />
            </div>
            {dob && (
              <p
                className={`text-[11px] font-bold pt-0.5 ${
                  calculateAge(dob) >= (gender === "Male" ? 21 : 18)
                    ? "text-emerald-700"
                    : "text-rose-600"
                }`}
              >
                {calculateAge(dob) >= (gender === "Male" ? 21 : 18)
                  ? `Calculated Age: ${calculateAge(dob)} Years — Legal Marriage Age Verified ✓`
                  : `Calculated Age: ${calculateAge(dob)} Years — Minimum ${
                      gender === "Male" ? 21 : 18
                    } years required`}
              </p>
            )}
          </div>
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="reg-password"
              className="text-sm font-semibold text-[#4E342E]"
            >
              Create Password
            </Label>
            <PasswordInput
              id="reg-password"
              value={password}
              onChange={setPassword}
              showStrength={true}
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="reg-confirm-password"
              className="text-sm font-semibold text-[#4E342E]"
            >
              Confirm Password
            </Label>
            <PasswordInput
              id="reg-confirm-password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Re-enter password"
              autoComplete="new-password"
            />
          </div>
        </div>

        {/* User Age Confirmation, Privacy Policy & Terms Acceptance */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 space-y-2.5 text-xs text-[#4E342E]">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmedAge}
              onChange={(e) => setConfirmedAge(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-amber-400 accent-[#EA580C]"
              required
            />
            <span>
              <strong>User Age Confirmation:</strong> I confirm that the candidate is legally of marriageable age under Indian Law (<strong>21+ Years for Groom / 18+ Years for Bride</strong>) and the Date of Birth entered is accurate.
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={acceptedPrivacy}
              onChange={(e) => setAcceptedPrivacy(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-amber-400 accent-[#EA580C]"
              required
            />
            <span>
              I have read and accept the{" "}
              <button
                type="button"
                onClick={() => setLegalDialog("privacy")}
                className="font-bold text-[#EA580C] underline hover:text-[#9A3412]"
              >
                Privacy Policy (v2.4)
              </button>{" "}
              including data encryption, photo watermark shield, and zero unauthorized contact disclosure.
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-amber-400 accent-[#EA580C]"
              required
            />
            <span>
              I agree to the{" "}
              <button
                type="button"
                onClick={() => setLegalDialog("terms")}
                className="font-bold text-[#EA580C] underline hover:text-[#9A3412]"
              >
                Terms &amp; Conditions (v2.4)
              </button>{" "}
              and confirm that all matrimonial details provided are genuine and lawful.
            </span>
          </label>
        </div>

        <Button
          type="submit"
          disabled={
            liveMobileDuplicate ||
            liveEmailDuplicate ||
            !confirmedAge ||
            !acceptedPrivacy ||
            !acceptedTerms
          }
          className="w-full h-12 rounded-xl bg-saffron-gradient hover:opacity-95 text-white font-semibold text-base shadow-saffron-sm mt-2 disabled:opacity-60"
        >
          Create Account &amp; Send WhatsApp OTP
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        {/* Legal Policy Reader Overlay */}
        {legalDialog && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-amber-200 max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18]">
                  {legalDialog === "privacy"
                    ? "Vivah Kar Lo — Privacy Policy (v2.4)"
                    : "Vivah Kar Lo — Terms & Conditions (v2.4)"}
                </h3>
                <button
                  type="button"
                  onClick={() => setLegalDialog(null)}
                  className="text-xs font-bold text-[#7C2D12] hover:underline"
                >
                  Close
                </button>
              </div>
              <div className="text-xs text-[#4E342E] space-y-2.5 max-h-64 overflow-y-auto leading-relaxed">
                {legalDialog === "privacy" ? (
                  <>
                    <p>
                      <strong>1. Zero Unauthorized Contact Exposure:</strong> Mobile numbers, residential addresses, and emails are strictly masked until VIP verification and explicit mutual permission.
                    </p>
                    <p>
                      <strong>2. Government ID &amp; KYC Vault:</strong> Aadhaar/PAN/Passport numbers are hashed and stored with end-to-end access control solely for identity verification.
                    </p>
                    <p>
                      <strong>3. Photo Shield &amp; Right to Erasure:</strong> Dynamic watermarks, screenshot guard, and full self-service account deactivation/deletion are available anytime under Settings.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>1. Genuine Matrimonial Intent:</strong> Platform membership is exclusively for lawful marriage alliances meeting statutory Indian marriage age criteria (21+ Groom, 18+ Bride).
                    </p>
                    <p>
                      <strong>2. Zero Harassment &amp; Anti-Fraud Policy:</strong> Impersonation, financial solicitation, or bypassing chat DLP contact filters results in immediate suspension.
                    </p>
                    <p>
                      <strong>3. Accurate Disclosure:</strong> Members are responsible for authentic marital, educational, and career disclosures.
                    </p>
                  </>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-amber-100">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (legalDialog === "privacy") setAcceptedPrivacy(true);
                    if (legalDialog === "terms") setAcceptedTerms(true);
                    setLegalDialog(null);
                  }}
                  className="rounded-xl bg-saffron-gradient text-white text-xs font-bold"
                >
                  I Read &amp; Accept
                </Button>
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-[#5C4740] pt-1">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#EA580C] hover:underline underline-offset-4"
          >
            Sign In here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
