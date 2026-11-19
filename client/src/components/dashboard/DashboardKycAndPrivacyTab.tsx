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

  // Privacy Settings State
  const [photoVisibility, setPhotoVisibility] = useState<"all" | "accepted_only" | "request_only">("all");
  const [contactVisibility, setContactVisibility] = useState<"accepted_vip_only" | "permission_only" | "hidden">("accepted_vip_only");
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean>(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState<boolean>(true);
  const [screenshotProtectionEnabled, setScreenshotProtectionEnabled] = useState<boolean>(true);
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState<boolean>(true);
  const [stealthModeEnabled, setStealthModeEnabled] = useState<boolean>(false);
  const [savingPrivacy, setSavingPrivacy] = useState<boolean>(false);
  const [isSelectiveModalOpen, setIsSelectiveModalOpen] = useState<boolean>(false);

  // Blocked Users State
  const [blockedList, setBlockedList] = useState<Array<{ id: string; blockedUserId: string; blockedUserName: string }>>([
    { id: "blk-1", blockedUserId: "usr-suspended", blockedUserName: "Vikram Malhotra" },
  ]);

  // Load initial trust score & privacy settings
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [trustRes, privacyRes] = await Promise.all([
          fetch(`/api/v1/security/trust-score/${userId}`),
          fetch(`/api/v1/security/privacy/settings/${userId}`),
        ]);
        const trustData = await trustRes.json();
        const privacyData = await privacyRes.json();

        if (isMounted) {
          if (trustData.success && trustData.trust) {
            setTrustScore(trustData.trust.score);
            setTrustTier(trustData.trust.tier);
            setIsGovtVerified(trustData.trust.isGovtIdVerified);
            setIsIncomeVerified(trustData.trust.isIncomeVerified);
          }
          if (privacyData.success && privacyData.settings) {
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
          photoVisibility,
          contactVisibility,
          watermarkEnabled,
          showOnlineStatus,
          screenshotProtectionEnabled,
          readReceiptsEnabled,
          stealthModeEnabled,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast({
        title: "Privacy Controls Updated",
        description: "Your photo shield, screenshot guard, and contact protection settings have been saved.",
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

        {/* Section 3: Photo Shield & Privacy Options */}
        <div className="bg-white rounded-2xl border border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-amber-100">
            <Lock className="w-5 h-5 text-[#EA580C]" />
            <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18]">
              3. Photo Shield &amp; Visibility Controls
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">
                Photo Visibility Permission:
              </Label>
              <select
                value={photoVisibility}
                onChange={(e) => setPhotoVisibility(e.target.value as any)}
                className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-xs sm:text-sm"
              >
                <option value="all">Visible to All Registered Members</option>
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
                  Overlays diagonal &ldquo;Vivah Kar Lo • Confidential&rdquo; seal and disables right-click/screenshotting
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
                    Screenshot &amp; Screen Grab Guard
                  </span>
                </div>
                <span className="text-[11px] text-[#5C4740] block mt-0.5">
                  Blocks PrintScreen keyboard actions, obscures photos on window blur, and hides assets during screen recording.
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

        {/* Section 4: Contact Privacy, Stealth Mode & Blocked Accounts */}
        <div className="bg-white rounded-2xl border border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-amber-100">
              <EyeOff className="w-5 h-5 text-[#EA580C]" />
              <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18]">
                4. Contact Privacy, Stealth &amp; Blocked List
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
                  className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-xs sm:text-sm"
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
                      Hide Profile from Specific Users
                    </span>
                  </div>
                  <span className="text-[11px] text-[#5C4740] block mt-0.5">
                    Stealthily exclude relatives, colleagues, or acquaintances without blocking them.
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
