import React, { useEffect, useState } from "react";
import type { AccountBundle } from "@/types/authTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Upload,
  Lock,
  Eye,
  EyeOff,
  Building2,
  FileText,
  Ban,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Sparkles,
  CameraOff,
  CheckCheck,
  UserMinus,
  Sliders,
  Image as ImageIcon,
  Zap,
  MapPin,
  Clock,
} from "lucide-react";
import { SelectiveProfilePrivacyModal } from "@/components/modals/SelectiveProfilePrivacyModal";
import { LivenessAndWorkplaceBadgesPanel } from "@/components/security/LivenessAndWorkplaceBadgesPanel";

interface DashboardKycAndPrivacyTabProps {
  account?: AccountBundle;
  userId?: string;
}

export const DashboardKycAndPrivacyTab: React.FC<DashboardKycAndPrivacyTabProps> = ({
  account,
  userId: propUserId,
}) => {
  const { toast } = useToast();
  const userId = propUserId || account?.user.id || "usr-1";
  const userDisplayName = account?.user?.fullName || "User";

  // Trust Score State
  const [trustScore, setTrustScore] = useState<number>(70);
  const [trustTier, setTrustTier] = useState<string>("High Trust");
  const [isGovtVerified, setIsGovtVerified] = useState<boolean>(true);
  const [isIncomeVerified, setIsIncomeVerified] = useState<boolean>(true);

  // KYC Form State
  const [kycDocType, setKycDocType] = useState<string>("Aadhaar Card");
  const [kycIdNumber, setKycIdNumber] = useState<string>("4210");
  const [kycStatus, setKycStatus] = useState<string>("Approved");
  const [submittingKyc, setSubmittingKyc] = useState<boolean>(false);

  // Employment Form State
  const [proofType, setProofType] = useState<string>("Salary Slip");
  const [organization, setOrganization] = useState<string>("TechCorp Global");
  const [designation, setDesignation] = useState<string>("VP of Engineering");
  const [declaredIncome, setDeclaredIncome] = useState<string>("₹45,00,000 / yr");
  const [isGovtJob, setIsGovtJob] = useState<boolean>(false);
  const [empStatus, setEmpStatus] = useState<string>("Approved");
  const [submittingEmp, setSubmittingEmp] = useState<boolean>(false);

  // Custom Profile & Photo Visibility Rules
  const [profileVisibility, setProfileVisibility] = useState<"all" | "verified_only" | "same_state" | "criteria_only">("all");
  const [visibilityMinAge, setVisibilityMinAge] = useState<number>(21);
  const [visibilityMaxAge, setVisibilityMaxAge] = useState<number>(35);
  const [visibilityMinEducation, setVisibilityMinEducation] = useState<string>("Any");

  // Privacy Settings State
  const [photoVisibility, setPhotoVisibility] = useState<"all" | "accepted_only" | "request_only">("all");
  const [contactVisibility, setContactVisibility] = useState<"accepted_vip_only" | "permission_only" | "hidden">("accepted_vip_only");
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean>(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState<boolean>(true);
  const [screenshotProtectionEnabled, setScreenshotProtectionEnabled] = useState<boolean>(true);
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState<boolean>(true);
  const [stealthModeEnabled, setStealthModeEnabled] = useState<boolean>(false);

  // Selective Field Locks (Unlocked only after mutual interest acceptance)
  const [lockSalaryUntilAccepted, setLockSalaryUntilAccepted] = useState<boolean>(false);
  const [lockFamilyDetailsUntilAccepted, setLockFamilyDetailsUntilAccepted] = useState<boolean>(false);
  const [lockContactInfoUntilAccepted, setLockContactInfoUntilAccepted] = useState<boolean>(true);
  const [lockKundliUntilAccepted, setLockKundliUntilAccepted] = useState<boolean>(false);

  // Daily Anti-Bot Rate Limit Quota
  const [dailyQuota, setDailyQuota] = useState<{
    interestsUsed: number;
    interestsRemaining: number;
    interestsLimit: number;
    messagesUsed: number;
    messagesRemaining: number;
    messagesLimit: number;
    resetsInHours: number;
  } | null>(null);

  // EXIF GPS Photo Sanitizer State
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoSanitizedResult, setPhotoSanitizedResult] = useState<{
    exifStripped: boolean;
    hasGps: boolean;
    message: string;
    sanitizedUrl?: string;
  } | null>(null);

  const [savingPrivacy, setSavingPrivacy] = useState<boolean>(false);
  const [isSelectiveModalOpen, setIsSelectiveModalOpen] = useState<boolean>(false);

  // Blocked Users State
  const [blockedList, setBlockedList] = useState<Array<{ id: string; blockedUserId: string; blockedUserName: string }>>([
    { id: "blk-1", blockedUserId: "usr-suspended", blockedUserName: "Vikram Malhotra" },
  ]);

  // Load initial trust score, privacy settings & daily quota
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [trustRes, privacyRes, quotaRes] = await Promise.all([
          fetch(`/api/v1/security/trust-score/${userId}`),
          fetch(`/api/v1/security/privacy/settings/${userId}`),
          fetch(`/api/v1/communication/daily-quota/${userId}`),
        ]);
        const trustData = await trustRes.json();
        const privacyData = await privacyRes.json();
        const quotaData = await quotaRes.json();

        if (isMounted) {
          if (trustData.success && trustData.trust) {
            setTrustScore(trustData.trust.score);
            setTrustTier(trustData.trust.tier);
            setIsGovtVerified(trustData.trust.isGovtIdVerified);
            setIsIncomeVerified(trustData.trust.isIncomeVerified);
          }
          if (privacyData.success && privacyData.settings) {
            if (privacyData.settings.profileVisibility) {
              setProfileVisibility(privacyData.settings.profileVisibility);
            }
            if (privacyData.settings.visibilityMinAge) {
              setVisibilityMinAge(privacyData.settings.visibilityMinAge);
            }
            if (privacyData.settings.visibilityMaxAge) {
              setVisibilityMaxAge(privacyData.settings.visibilityMaxAge);
            }
            if (privacyData.settings.visibilityMinEducation) {
              setVisibilityMinEducation(privacyData.settings.visibilityMinEducation);
            }
            setPhotoVisibility(privacyData.settings.photoVisibility);
            setContactVisibility(privacyData.settings.contactVisibility);
            setWatermarkEnabled(privacyData.settings.watermarkEnabled);
            setShowOnlineStatus(privacyData.settings.showOnlineStatus);
            if (privacyData.settings.screenshotProtectionEnabled !== undefined) {
              setScreenshotProtectionEnabled(privacyData.settings.screenshotProtectionEnabled);
            }
            if (privacyData.settings.readReceiptsEnabled !== undefined) {
              setReadReceiptsEnabled(privacyData.settings.readReceiptsEnabled);
            }
            if (privacyData.settings.stealthModeEnabled !== undefined) {
              setStealthModeEnabled(privacyData.settings.stealthModeEnabled);
            }
            if (privacyData.settings.lockSalaryUntilAccepted !== undefined) {
              setLockSalaryUntilAccepted(privacyData.settings.lockSalaryUntilAccepted);
            }
            if (privacyData.settings.lockFamilyDetailsUntilAccepted !== undefined) {
              setLockFamilyDetailsUntilAccepted(privacyData.settings.lockFamilyDetailsUntilAccepted);
            }
            if (privacyData.settings.lockContactInfoUntilAccepted !== undefined) {
              setLockContactInfoUntilAccepted(privacyData.settings.lockContactInfoUntilAccepted);
            }
            if (privacyData.settings.lockKundliUntilAccepted !== undefined) {
              setLockKundliUntilAccepted(privacyData.settings.lockKundliUntilAccepted);
            }
          }
          if (quotaData.success && quotaData.quota) {
            setDailyQuota(quotaData.quota);
          }
        }
      } catch (e) {
        console.warn("Using offline security defaults:", e);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleSubmitKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingKyc(true);
    try {
      const res = await fetch("/api/v1/security/kyc/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName: userDisplayName,
          docType: kycDocType,
          idNumber: kycIdNumber,
          docFrontUrl: "/2.jpg",
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setKycStatus("Pending");
      toast({
        title: "KYC Uploaded for Verification",
        description: data.message,
      });
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSubmittingKyc(false);
    }
  };

  const handleSubmitEmployment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingEmp(true);
    try {
      const res = await fetch("/api/v1/security/employment/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName: userDisplayName,
          proofType,
          organization,
          designation,
          declaredIncome,
          isGovtJob,
          docUrl: "/2.jpg",
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setEmpStatus("Pending");
      toast({
        title: "Employment Proof Uploaded",
        description: data.message,
      });
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSubmittingEmp(false);
    }
  };

  const handleSavePrivacy = async () => {
    setSavingPrivacy(true);
    try {
      const res = await fetch(`/api/v1/security/privacy/settings/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileVisibility,
          visibilityMinAge,
          visibilityMaxAge,
          visibilityMinEducation,
          photoVisibility,
          contactVisibility,
          watermarkEnabled,
          showOnlineStatus,
          screenshotProtectionEnabled,
          readReceiptsEnabled,
          stealthModeEnabled,
          lockSalaryUntilAccepted,
          lockFamilyDetailsUntilAccepted,
          lockContactInfoUntilAccepted,
          lockKundliUntilAccepted,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast({
        title: "Privacy Controls Updated",
        description: "Your custom visibility rules, selective field locks, and photo shield settings have been saved.",
      });
    } catch (err: any) {
      toast({
        title: "Update Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSavingPrivacy(false);
    }
  };

  const handleSanitizePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setPhotoSanitizedResult(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const photoDataUri = reader.result as string;
        const res = await fetch("/api/v1/security/photo/upload-sanitized", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            photoDataUri,
            photoLabel: file.name,
          }),
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        setPhotoSanitizedResult({
          exifStripped: true,
          hasGps: data.hasEmbeddedGps,
          message: data.message,
          sanitizedUrl: data.sanitizedPhotoUrl,
        });

        toast({
          title: "EXIF Stripped & Protected",
          description: "All GPS coordinates and camera metadata stripped permanently for privacy.",
        });
      } catch (err: any) {
        toast({
          title: "Photo Processing Failed",
          description: err.message || "Could not sanitize photo.",
          variant: "destructive",
        });
      } finally {
        setUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUnblock = async (blockedUserId: string) => {
    try {
      await fetch("/api/v1/security/unblock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockerUserId: userId, blockedUserId }),
      });
      setBlockedList((prev) => prev.filter((b) => b.blockedUserId !== blockedUserId));
      toast({ title: "User Unblocked" });
    } catch (e: any) {
      toast({ title: "Could not unblock user", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EA580C]">
            <ShieldCheck className="w-4 h-4" />
            <span>Programmes 06 &amp; 07 • Trust, Safety &amp; Photo Shield</span>
          </div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C] mt-1">
            Trust Score, KYC &amp; Privacy Controls
          </h1>
          <p className="text-sm text-[#5C4740] mt-1">
            Verify your government identity, prevent photo downloads, and manage who can view your contacts.
          </p>
        </div>

        {/* Live Trust Score Meter Card */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200/90 shadow-sm flex items-center gap-4 min-w-[240px]">
          <div className="relative flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-saffron-gradient flex items-center justify-center text-white font-bold text-lg shadow-md">
              {trustScore}%
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#2B120C]">Trust Score</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                {trustTier}
              </span>
            </div>
            <p className="text-[11px] text-[#5C4740] mt-0.5">
              {trustScore >= 80 ? "Certified Authentic Alliance" : "Upload Govt ID to reach 100%"}
            </p>
          </div>
        </div>
      </div>

      {/* Anti-Bot & Daily Usage Shield Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-saffron-gradient text-white flex items-center justify-center shrink-0 shadow-saffron-sm">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#3B0A18] flex items-center gap-1.5 uppercase tracking-wide">
              <span>Anti-Bot &amp; Anti-Spam Shield Active</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">Fair Usage Protected</span>
            </span>
            <span className="text-xs text-[#5C4740] block mt-0.5">
              Protects members against automated bot blasts and mass scrapers: daily interests capped at {dailyQuota?.interestsLimit || 15} per 24 hours.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-amber-200 text-center shadow-xs">
            <span className="text-[10px] uppercase font-bold text-[#8C6D62] block">Interests Left</span>
            <span className="text-sm font-black text-[#EA580C]">
              {dailyQuota ? `${dailyQuota.interestsRemaining} / ${dailyQuota.interestsLimit}` : "15 / 15"}
            </span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-amber-200 text-center shadow-xs">
            <span className="text-[10px] uppercase font-bold text-[#8C6D62] block">Messages Left</span>
            <span className="text-sm font-black text-emerald-700">
              {dailyQuota ? `${dailyQuota.messagesRemaining} / ${dailyQuota.messagesLimit}` : "30 / 30"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Government ID / KYC Verification */}
        <div className="bg-white rounded-2xl border border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18]">
                1. Government ID Verification
              </h3>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                kycStatus === "Approved"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-amber-100 text-amber-800 border border-amber-200"
              }`}
            >
              {kycStatus === "Approved" ? "✓ ID Verified" : "Verification Pending"}
            </span>
          </div>

          <p className="text-xs text-[#5C4740]">
            Government ID badges are screened to verify genuine identity and give your profile <strong>3X more responses</strong> from verified families.
          </p>

          <form onSubmit={handleSubmitKyc} className="space-y-3.5">
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">
                Select Government Document:
              </Label>
              <select
                value={kycDocType}
                onChange={(e) => setKycDocType(e.target.value)}
                className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-xs sm:text-sm"
              >
                <option value="Aadhaar Card">Aadhaar Card (UIDAI Verified)</option>
                <option value="Passport">Passport (Indian / International)</option>
                <option value="Voter ID">Election Voter ID Card</option>
                <option value="Driving License">Driving License</option>
                <option value="PAN Card">Permanent Account Number (PAN)</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">
                Document / Identification Number (Masked):
              </Label>
              <Input
                value={kycIdNumber}
                onChange={(e) => setKycIdNumber(e.target.value)}
                placeholder="Enter last 4 digits e.g. 4210"
                className="mt-1 h-11 rounded-xl border-amber-200 text-xs sm:text-sm"
              />
              <span className="text-[11px] text-[#7C2D12]">
                For privacy, your full document number is hashed and never displayed publicly.
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-[#5C4740] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {kycStatus === "Approved"
                  ? "Government ID approved. Your profile displays the official Green Shield Badge."
                  : "Upload clear photo of ID front. Reviews complete within 2 hours."}
              </span>
            </div>

            <Button
              type="submit"
              disabled={submittingKyc || kycStatus === "Approved"}
              className="w-full h-11 rounded-xl bg-saffron-gradient text-white text-xs font-bold shadow-saffron-sm"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              {kycStatus === "Approved" ? "ID Successfully Verified" : submittingKyc ? "Submitting..." : "Submit ID for Verification"}
            </Button>
          </form>
        </div>

        {/* Section 2: Salary / Income & Govt Job Proof */}
        <div className="bg-white rounded-2xl border border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#EA580C]" />
              <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18]">
                2. Salary &amp; Employment Verification
              </h3>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                empStatus === "Approved"
                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                  : "bg-amber-100 text-amber-800 border border-amber-200"
              }`}
            >
              {empStatus === "Approved" ? "✓ Income Verified" : "Pending Proof"}
            </span>
          </div>

          <p className="text-xs text-[#5C4740]">
            Awarded for verified corporate compensation or gazetted government service appointment letters.
          </p>

          <form onSubmit={handleSubmitEmployment} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-[#3B0A18]">
                  Proof Document Type:
                </Label>
                <select
                  value={proofType}
                  onChange={(e) => setProofType(e.target.value)}
                  className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-xs"
                >
                  <option value="Salary Slip">Latest Salary Slip</option>
                  <option value="Form 16 / ITR">Form 16 / ITR Acknowledgement</option>
                  <option value="Govt Appointment Letter">Govt Appointment Order</option>
                  <option value="Official ID Card">Official Employee Badge</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-[#3B0A18]">
                  Organization / Ministry:
                </Label>
                <Input
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="mt-1 h-11 rounded-xl border-amber-200 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-[#3B0A18]">
                  Designation:
                </Label>
                <Input
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="mt-1 h-11 rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-[#3B0A18]">
                  Annual Compensation:
                </Label>
                <Input
                  value={declaredIncome}
                  onChange={(e) => setDeclaredIncome(e.target.value)}
                  className="mt-1 h-11 rounded-xl border-amber-200 text-xs"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={submittingEmp || empStatus === "Approved"}
              className="w-full h-11 rounded-xl bg-saffron-gradient text-white text-xs font-bold shadow-saffron-sm"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              {empStatus === "Approved" ? "Income Badge Verified" : submittingEmp ? "Uploading..." : "Verify Employment Proof"}
            </Button>
          </form>
        </div>

        {/* Section 3: Custom Visibility Rules & Photo Shield */}
        <div className="bg-white rounded-2xl border border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-amber-100">
            <Sliders className="w-5 h-5 text-[#EA580C]" />
            <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18]">
              3. Custom Profile &amp; Photo Visibility Rules
            </h3>
          </div>

          <div className="space-y-4">
            {/* Rule 1: Who can discover my profile in search */}
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">
                Who Can Discover &amp; View My Profile:
              </Label>
              <select
                value={profileVisibility}
                onChange={(e) => setProfileVisibility(e.target.value as any)}
                className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-xs sm:text-sm font-medium"
              >
                <option value="all">All Verified Matrimonial Members (Recommended)</option>
                <option value="verified_only">Only 100% KYC &amp; Selfie Verified Members</option>
                <option value="same_state">Same City / State Profiles Only</option>
                <option value="criteria_only">Strict Filter Matchers (Specific Age &amp; Education Range)</option>
              </select>
            </div>

            {/* Sub-inputs when criteria_only is selected */}
            {profileVisibility === "criteria_only" && (
              <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <Label className="text-[11px] font-bold text-[#3B0A18]">
                    Minimum Matching Age:
                  </Label>
                  <Input
                    type="number"
                    min={18}
                    max={70}
                    value={visibilityMinAge}
                    onChange={(e) => setVisibilityMinAge(parseInt(e.target.value) || 21)}
                    className="mt-1 h-9 rounded-lg border-amber-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-bold text-[#3B0A18]">
                    Maximum Matching Age:
                  </Label>
                  <Input
                    type="number"
                    min={18}
                    max={70}
                    value={visibilityMaxAge}
                    onChange={(e) => setVisibilityMaxAge(parseInt(e.target.value) || 35)}
                    className="mt-1 h-9 rounded-lg border-amber-300 text-xs bg-white"
                  />
                </div>
              </div>
            )}

            {/* Photo Visibility */}
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">
                Photo Visibility Permission:
              </Label>
              <select
                value={photoVisibility}
                onChange={(e) => setPhotoVisibility(e.target.value as any)}
                className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-xs sm:text-sm font-medium"
              >
                <option value="all">Visible to All Registered Members</option>
                <option value="verified_only">Visible Only to 100% Govt ID Verified Members</option>
                <option value="accepted_only">
                  Visible Only to Accepted Interests (Others see blurred photo)
                </option>
                <option value="request_only">
                  Locked / Blur Photo (Visible only upon explicit request approval)
                </option>
              </select>
            </div>

            {/* Dynamic Watermark Protection Toggle */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3">
              <div>
                <span className="block text-xs font-bold text-[#2B120C]">
                  Brand Watermark &amp; Anti-Download Shield
                </span>
                <span className="text-[11px] text-[#5C4740]">
                  Overlays diagonal &ldquo;Vivah Kar Lo • Confidential • Viewer ID&rdquo; watermark and disables right-click
                </span>
              </div>
              <Switch
                checked={watermarkEnabled}
                onCheckedChange={setWatermarkEnabled}
                className="data-[state=checked]:bg-[#EA580C]"
              />
            </div>

            {/* Screenshot Protection Guard */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <CameraOff className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span className="text-xs font-bold text-[#2B120C]">
                    Screenshot &amp; Screen Grab Guard (FLAG_SECURE)
                  </span>
                </div>
                <span className="text-[11px] text-[#5C4740] block mt-0.5">
                  Blocks PrintScreen keyboard actions, obscures photos on window blur, and triggers mobile WebView FLAG_SECURE.
                </span>
              </div>
              <Switch
                checked={screenshotProtectionEnabled}
                onCheckedChange={setScreenshotProtectionEnabled}
                className="data-[state=checked]:bg-[#EA580C]"
              />
            </div>

            {/* Read Receipts in Chat */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <CheckCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span className="text-xs font-bold text-[#2B120C]">
                    Send Message Read Receipts
                  </span>
                </div>
                <span className="text-[11px] text-[#5C4740] block mt-0.5">
                  Allows conversation matches to see blue double checkmarks when you have read their messages.
                </span>
              </div>
              <Switch
                checked={readReceiptsEnabled}
                onCheckedChange={setReadReceiptsEnabled}
                className="data-[state=checked]:bg-[#EA580C]"
              />
            </div>

            {/* Online Status Toggle */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3">
              <div>
                <span className="block text-xs font-bold text-[#2B120C]">
                  Show Active / Online Indicator
                </span>
                <span className="text-[11px] text-[#5C4740]">
                  Let mutual alliances know when you are active to chat
                </span>
              </div>
              <Switch
                checked={showOnlineStatus}
                onCheckedChange={setShowOnlineStatus}
                className="data-[state=checked]:bg-[#EA580C]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Selective Field Lock (Locked until Interest Accepted) */}
        <div className="bg-white rounded-2xl border border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-amber-100">
            <Lock className="w-5 h-5 text-[#EA580C]" />
            <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18]">
              4. Selective Field Lock (Hide Specific Details)
            </h3>
          </div>

          <p className="text-xs text-[#5C4740]">
            Keep sensitive financial, astrological, or family information locked from public discovery. Selected fields unlock automatically once you accept an interest.
          </p>

          <div className="space-y-3 mt-3">
            {/* Lock Salary */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3">
              <div>
                <span className="block text-xs font-bold text-[#2B120C]">
                  Lock Annual Income / Salary
                </span>
                <span className="text-[11px] text-[#5C4740]">
                  Hides compensation figure from general browsing; unlocks after mutual interest
                </span>
              </div>
              <Switch
                checked={lockSalaryUntilAccepted}
                onCheckedChange={setLockSalaryUntilAccepted}
                className="data-[state=checked]:bg-[#EA580C]"
              />
            </div>

            {/* Lock Family Background */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3">
              <div>
                <span className="block text-xs font-bold text-[#2B120C]">
                  Lock Detailed Family Background
                </span>
                <span className="text-[11px] text-[#5C4740]">
                  Hides parents&apos; occupation and native place from public view until interest is accepted
                </span>
              </div>
              <Switch
                checked={lockFamilyDetailsUntilAccepted}
                onCheckedChange={setLockFamilyDetailsUntilAccepted}
                className="data-[state=checked]:bg-[#EA580C]"
              />
            </div>

            {/* Lock Contact Numbers */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3">
              <div>
                <span className="block text-xs font-bold text-[#2B120C]">
                  Lock Direct Mobile &amp; WhatsApp
                </span>
                <span className="text-[11px] text-[#5C4740]">
                  Enforces strict mutual approval before phone numbers or WhatsApp are revealed
                </span>
              </div>
              <Switch
                checked={lockContactInfoUntilAccepted}
                onCheckedChange={setLockContactInfoUntilAccepted}
                className="data-[state=checked]:bg-[#EA580C]"
              />
            </div>

            {/* Lock Kundli Chart */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3">
              <div>
                <span className="block text-xs font-bold text-[#2B120C]">
                  Lock Astrological Birth Chart (Kundli)
                </span>
                <span className="text-[11px] text-[#5C4740]">
                  Shows only 36-Guna score; detailed planetary houses unlock only upon mutual connect
                </span>
              </div>
              <Switch
                checked={lockKundliUntilAccepted}
                onCheckedChange={setLockKundliUntilAccepted}
                className="data-[state=checked]:bg-[#EA580C]"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Photo Upload & EXIF GPS Sanitizer (Sharp Powered) */}
        <div className="bg-white rounded-2xl border border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-amber-100">
            <ImageIcon className="w-5 h-5 text-[#EA580C]" />
            <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18]">
              5. EXIF GPS Sanitizer &amp; Safe Photo Upload
            </h3>
          </div>

          <p className="text-xs text-[#5C4740]">
            Smartphone photos contain embedded GPS coordinates pointing directly to your home. Our Sharp engine automatically purges all EXIF geolocation metadata before publishing.
          </p>

          <div className="p-4 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/40 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#EA580C] mx-auto flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#3B0A18]">
                Upload Photo with Auto EXIF Sanitization
              </p>
              <p className="text-[11px] text-[#5C4740] mt-0.5">
                Sharp permanently strips camera EXIF &amp; GPS tags while securely storing an admin audit trace
              </p>
            </div>
            <label className="inline-flex">
              <Input
                type="file"
                accept="image/*"
                onChange={handleSanitizePhotoUpload}
                disabled={uploadingPhoto}
                className="hidden"
                id="photo-sanitizer-input"
              />
              <Button
                type="button"
                disabled={uploadingPhoto}
                onClick={() => document.getElementById("photo-sanitizer-input")?.click()}
                className="h-9 px-4 rounded-xl bg-saffron-gradient text-white text-xs font-semibold shadow-saffron-sm"
              >
                {uploadingPhoto ? "Sanitizing EXIF..." : "Select Photo to Protect"}
              </Button>
            </label>
          </div>

          {photoSanitizedResult && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1 animate-in fade-in">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>EXIF GPS Coordinates Successfully Purged</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                {photoSanitizedResult.message}
              </p>
              {photoSanitizedResult.hasGps && (
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  📍 Home GPS tags detected and stripped • Admin Audit Logged
                </span>
              )}
            </div>
          )}
        </div>

        {/* Section 6: Contact Privacy, Stealth Mode & Blocked Accounts */}
        <div className="bg-white rounded-2xl border border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-amber-100">
              <EyeOff className="w-5 h-5 text-[#EA580C]" />
              <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18]">
                6. Contact Privacy, Stealth &amp; Blocked List
              </h3>
            </div>

            <div className="space-y-4 mt-3">
              <div>
                <Label className="text-xs font-semibold text-[#3B0A18]">
                  Phone &amp; WhatsApp Privacy Rule:
                </Label>
                <select
                  value={contactVisibility}
                  onChange={(e) => setContactVisibility(e.target.value as any)}
                  className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-xs sm:text-sm font-medium"
                >
                  <option value="accepted_vip_only">
                    Visible Only to Accepted Interests with VIP Membership
                  </option>
                  <option value="permission_only">
                    Require Explicit One-Click Permission for every unmasking
                  </option>
                  <option value="hidden">
                    Hidden from All (Communication through Secure Chat Only)
                  </option>
                </select>
              </div>

              {/* Selective Profile Exclusion / Stealth Mode Card */}
              <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <div className="flex items-center gap-1.5">
                    <UserMinus className="w-3.5 h-3.5 text-rose-600" />
                    <span className="text-xs font-bold text-[#2B120C]">
                      Hide Profile from Relatives &amp; Specific Users
                    </span>
                  </div>
                  <span className="text-[11px] text-[#5C4740] block mt-0.5">
                    Stealthily exclude relatives, colleagues, or acquaintances without blocking them. They will never see your profile.
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSelectiveModalOpen(true)}
                  className="h-8 rounded-lg border-rose-300 text-rose-800 hover:bg-rose-100 text-xs font-semibold shrink-0"
                >
                  Manage Stealth List
                </Button>
              </div>

              {/* Blocked Users Count & Management */}
              <div>
                <Label className="text-xs font-semibold text-[#3B0A18] block mb-1">
                  Blocked Profiles ({blockedList.length}):
                </Label>
                {blockedList.length === 0 ? (
                  <p className="text-xs text-[#5C4740] italic">
                    You have not blocked any profiles.
                  </p>
                ) : (
                  <div className="divide-y divide-amber-100 border border-amber-200 rounded-xl bg-[#FFFDF9] max-h-36 overflow-y-auto">
                    {blockedList.map((b) => (
                      <div
                        key={b.id}
                        className="p-2.5 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-[#2B120C]">
                          {b.blockedUserName}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnblock(b.blockedUserId)}
                          className="h-7 text-xs text-rose-600 hover:bg-rose-50 px-2"
                        >
                          Unblock
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            type="button"
            disabled={savingPrivacy}
            onClick={handleSavePrivacy}
            className="w-full h-11 rounded-xl bg-saffron-gradient text-white text-xs font-bold shadow-saffron-sm mt-4"
          >
            {savingPrivacy ? "Saving Privacy Settings..." : "Save Privacy & Shield Settings"}
          </Button>
        </div>
      </div>

      {/* Sections 5 & 6: Live Selfie Liveness & Corporate / LinkedIn Badges */}
      <LivenessAndWorkplaceBadgesPanel
        userId={userId}
        onTrustBoost={(bonus) => {
          setTrustScore((prev) => Math.min(100, prev + bonus));
          setTrustTier("Platinum Verified Trust");
        }}
      />

      {/* Selective Ghost Profile Exclusion Modal */}
      <SelectiveProfilePrivacyModal
        isOpen={isSelectiveModalOpen}
        onClose={() => setIsSelectiveModalOpen(false)}
        currentUserId={userId}
      />
    </div>
  );
};
