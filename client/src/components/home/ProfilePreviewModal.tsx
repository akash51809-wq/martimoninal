import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileData } from "@/data/mockData";
import { WatermarkedProtectedImage } from "@/components/security/WatermarkedProtectedImage";
import { RequestContactModal } from "@/components/modals/RequestContactModal";
import { SendInterestModal } from "@/components/modals/SendInterestModal";
import { BlockUserModal } from "@/components/modals/BlockUserModal";
import { ReportUserModal } from "@/components/modals/ReportUserModal";
import { CompatibilityDeepDiveModal } from "@/components/matching/CompatibilityDeepDiveModal";
import {
  BadgeCheck,
  MapPin,
  GraduationCap,
  Briefcase,
  Sparkles,
  Heart,
  Users,
  Lock,
  IndianRupee,
  ShieldCheck,
  Phone,
  UserX,
  Flag,
  TrendingUp,
  Compass,
  Share2,
  FileDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  buildSafeWhatsAppShareUrl,
  downloadProtectedBiodataPdf,
} from "@/utils/biodataPdfGenerator";

interface ProfilePreviewModalProps {
  profile: ProfileData | null;
  isLiked: boolean;
  isInterestAccepted?: boolean;
  onClose: () => void;
  onSendInterest: (profile: ProfileData, message?: string) => void;
  onUnlockContact: () => void;
  isVipMember?: boolean;
  viewerId?: string;
}

export const ProfilePreviewModal: React.FC<ProfilePreviewModalProps> = ({
  profile,
  isLiked,
  isInterestAccepted = false,
  onClose,
  onSendInterest,
  onUnlockContact,
  isVipMember = false,
  viewerId = "usr-demo-001",
}) => {
  const { toast } = useToast();
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeepDiveModal, setShowDeepDiveModal] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  if (!profile) return null;

  const handleShareWhatsApp = async () => {
    let shareText: string | undefined;
    try {
      const res = await fetch(
        `/api/v1/profiles/${encodeURIComponent(profile.id)}/biodata-safe?viewerUserId=${encodeURIComponent(viewerId)}`
      );
      const data = await res.json();
      if (data.success && data.whatsappShareText) {
        shareText = data.whatsappShareText;
      }
    } catch {
      // Safe PII-free client builder fallback
    }
    const waUrl = buildSafeWhatsAppShareUrl(profile, shareText);
    window.open(waUrl, "_blank", "noopener,noreferrer");
    toast({
      title: "Opening WhatsApp Share",
      description: "Sharing privacy-safe profile summary (zero personal phone/email or photo exposed).",
    });
  };

  const handleDownloadBiodataPdf = async () => {
    setDownloadingPdf(true);
    try {
      const result = await downloadProtectedBiodataPdf(profile, viewerId, isVipMember);
      toast({
        title: "Protected Biodata PDF Generated",
        description: result.message,
      });
    } catch {
      toast({
        title: "Could not generate PDF",
        description: "Please allow popups and try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleContactClick = () => {
    if (!isVipMember) {
      toast({
        title: "VIP Membership Required",
        description: "Direct contact numbers and WhatsApp access require an active VIP plan for user safety and privacy.",
        variant: "destructive",
      });
      onUnlockContact();
    } else {
      setShowContactModal(true);
    }
  };

  return (
    <Dialog open={!!profile} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[92vh] overflow-y-auto rounded-3xl border border-amber-200 bg-[#FFFDF9] p-0 shadow-2xl">
        {/* Top Protected Photo Container with Brand & User ID Watermark */}
        <div className="relative h-72 sm:h-80 bg-[#2C0914] overflow-hidden">
          <WatermarkedProtectedImage
            src={profile.photos[0]}
            alt={profile.name}
            profileId={profile.profileId || profile.id}
            viewerId={viewerId}
            className="w-full h-full object-cover object-top"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#240710] via-[#240710]/20 to-transparent pointer-events-none" />

          {/* Quick Header Badges & Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowBlockModal(true)}
              className="h-8 w-8 rounded-full bg-black/40 border-white/20 text-white hover:bg-rose-600 hover:text-white"
              title="Block Profile"
            >
              <UserX className="w-3.5 h-3.5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowReportModal(true)}
              className="h-8 w-8 rounded-full bg-black/40 border-white/20 text-white hover:bg-amber-600 hover:text-white"
              title="Report Profile"
            >
              <Flag className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-end justify-between gap-3 text-white pointer-events-none z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold text-amber-200">
                  {profile.profileId}
                </span>
                {profile.verified && (
                  <Badge className="bg-emerald-500 text-white border-0 text-[11px]">
                    <BadgeCheck className="w-3.5 h-3.5 mr-1" />
                    Govt ID Verified
                  </Badge>
                )}
                <span className="px-2 py-0.5 rounded-full bg-amber-500/30 backdrop-blur-md border border-amber-300/40 text-amber-200 text-[11px] font-bold">
                  85% Trust Score
                </span>
              </div>
              <DialogHeader className="text-left">
                <DialogTitle className="font-serif-royal text-2xl text-white">
                  {profile.name}, {profile.age}
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm sm:text-base text-amber-100/95 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                {profile.city}, {profile.state} • {profile.height}
              </p>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-300/40 text-amber-200 text-xs sm:text-sm font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              {profile.kundliScore}/36 Gunas Match
            </div>
          </div>
        </div>

        {/* Body Details */}
        <div className="p-6 space-y-5">
          {/* Safety & Photo Shield Callout */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-[#5C4740] flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Protected by <strong>Vivah Photo Shield™</strong> (anti-download watermark &amp; privacy lock).
              </span>
            </span>
            <span className="text-[11px] font-bold text-[#EA580C] shrink-0">
              Zero Screenshot Leakage
            </span>
          </div>

          {/* Quick Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-amber-100 shadow-xs">
              <p className="text-xs font-semibold uppercase text-[#8C6D62] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#EA580C]" />
                Profession
              </p>
              <p className="text-sm font-semibold text-[#2B120C] mt-1">
                {profile.profession}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-amber-100 shadow-xs">
              <p className="text-xs font-semibold uppercase text-[#8C6D62] flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#EA580C]" />
                Education
              </p>
              <p className="text-sm font-semibold text-[#2B120C] mt-1">
                {profile.education}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-amber-100 shadow-xs">
              <p className="text-xs font-semibold uppercase text-[#8C6D62] flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-[#EA580C]" />
                Annual Income
              </p>
              {(profile as any).lockSalaryUntilAccepted && !isInterestAccepted ? (
                <p className="text-xs font-bold text-amber-700 flex items-center gap-1 mt-1">
                  <Lock className="w-3 h-3 text-[#EA580C]" /> Locked (Mutual Interest required)
                </p>
              ) : (
                <p className="text-sm font-semibold text-[#2B120C] mt-1">
                  {profile.income}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div>
            <h4 className="font-serif-royal text-base font-bold text-[#3B0A18] mb-1.5">
              About {profile.name.split(" ")[0]}
            </h4>
            <p className="text-[15px] text-[#5C4740] leading-relaxed">{profile.bio}</p>
          </div>

          {/* Family & Astro Summary */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-amber-100 shadow-sm space-y-2">
              <h4 className="font-serif-royal text-sm font-bold uppercase tracking-wider text-[#EA580C] flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                Family Background
              </h4>
              {(profile as any).lockFamilyDetailsUntilAccepted && !isInterestAccepted ? (
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-[#5C4740] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#EA580C] shrink-0" />
                  <span>Family details locked by member. Unlocked automatically once mutual interest is accepted.</span>
                </div>
              ) : (
                <>
                  <p className="text-sm text-[#4E342E]">
                    <strong>Father:</strong> {profile.family.fatherOccupation}
                  </p>
                  <p className="text-sm text-[#4E342E]">
                    <strong>Mother:</strong> {profile.family.motherOccupation}
                  </p>
                  <p className="text-sm text-[#4E342E]">
                    <strong>Values:</strong> {profile.family.familyType} • {profile.family.familyValues}
                  </p>
                  <p className="text-sm text-[#4E342E]">
                    <strong>Native:</strong> {profile.family.nativePlace}
                  </p>
                </>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-100 shadow-sm space-y-2">
              <h4 className="font-serif-royal text-sm font-bold uppercase tracking-wider text-[#EA580C] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Community &amp; Horoscope
              </h4>
              <p className="text-sm text-[#4E342E]">
                <strong>Community:</strong> {profile.religion}, {profile.caste} ({profile.subCaste})
              </p>
              <p className="text-sm text-[#4E342E]">
                <strong>Mother Tongue:</strong> {profile.motherTongue}
              </p>
              <p className="text-sm text-[#4E342E]">
                <strong>Rashi / Nakshatra:</strong> {profile.rashi} • {profile.nakshatra}
              </p>
              <p className="text-sm text-[#4E342E]">
                <strong>Manglik Status:</strong> {profile.manglik}
              </p>
            </div>
          </div>

          {/* AI Compatibility & Match Success Probability Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#EA580C]" />
                <span className="text-sm font-bold text-[#2B120C]">
                  AI Compatibility &amp; Marriage Success Rating
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  88%+ High Stability
                </span>
              </div>
              <p className="text-xs text-[#5C4740]">
                Multidimensional breakdown covering lifestyle habits, educational parity, and 2-way mutual preference fit.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeepDiveModal(true)}
              className="h-10 px-4 rounded-xl border-amber-300 bg-white hover:bg-amber-100/60 text-[#7C2D12] font-bold text-xs shrink-0 shadow-xs"
            >
              <Compass className="w-3.5 h-3.5 mr-1.5 text-[#EA580C]" />
              Deep Dive Compatibility
            </Button>
          </div>

          {/* Contact Protection Status Card */}
          <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#EA580C]" />
                <span className="text-sm font-bold text-[#2B120C]">
                  Contact Details (Phone &amp; WhatsApp)
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-[#7C2D12] text-[10px] font-bold">
                  Masked (+91 98*** *****)
                </span>
              </div>
              <p className="text-xs text-[#5C4740] mt-1">
                {isVipMember
                  ? "You have active VIP privileges. Click below to request unmasked contact info."
                  : "Requires an active VIP subscription to request verified contact unmasking."}
              </p>
            </div>

            <Button
              type="button"
              onClick={handleContactClick}
              className="h-10 px-4 rounded-xl bg-[#3B0A18] hover:bg-[#2C0712] text-amber-100 font-semibold text-xs shrink-0"
            >
              <Lock className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              {isVipMember ? "Request Contact Access" : "Upgrade to VIP to View"}
            </Button>
          </div>

          {/* Share via WhatsApp & Privacy-Safe Biodata PDF Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={handleShareWhatsApp}
              className="h-10 rounded-xl border-emerald-300 bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100 text-xs font-bold"
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Share Profile via WhatsApp
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={downloadingPdf}
              onClick={handleDownloadBiodataPdf}
              className="h-10 rounded-xl border-amber-300 bg-amber-50/70 text-[#3B0A18] hover:bg-amber-100 text-xs font-bold"
            >
              <FileDown className="w-3.5 h-3.5 mr-1.5 text-[#EA580C]" />
              {downloadingPdf
                ? "Generating Safe PDF..."
                : isVipMember
                ? "Download Biodata PDF (No Photo)"
                : "Download Biodata PDF (No Photo / No Contact)"}
            </Button>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-amber-100">
            <Button
              onClick={() => {
                if (isLiked) {
                  onSendInterest(profile);
                } else {
                  setShowInterestModal(true);
                }
              }}
              className={`flex-1 h-11 rounded-xl font-semibold ${
                isLiked
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-saffron-gradient hover:opacity-95 text-white shadow-saffron-sm"
              }`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
              {isLiked ? "Interest Sent ✓" : "Express Interest Free"}
            </Button>

            <Button
              variant="outline"
              onClick={handleContactClick}
              className="flex-1 h-11 rounded-xl border-amber-300 text-[#3B0A18] hover:bg-amber-50 font-semibold"
            >
              <Phone className="w-4 h-4 mr-2 text-[#EA580C]" />
              {isVipMember ? "Request Contact" : "Unlock Contact (VIP)"}
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Connected Modals */}
      <SendInterestModal
        open={showInterestModal}
        onOpenChange={setShowInterestModal}
        recipientId={profile.id}
        recipientName={profile.name}
        onSuccess={(msg) => {
          onSendInterest(profile, msg);
          toast({
            title: `Interest Sent to ${profile.name}`,
            description: "Your family proposal has been delivered.",
          });
        }}
      />

      <RequestContactModal
        open={showContactModal}
        onOpenChange={setShowContactModal}
        recipientId={profile.id}
        recipientName={profile.name}
        isVipMember={isVipMember}
      />

      <BlockUserModal
        open={showBlockModal}
        onOpenChange={setShowBlockModal}
        targetUserId={profile.id}
        targetUserName={profile.name}
        onBlocked={() => {
          onClose();
        }}
      />

      <ReportUserModal
        open={showReportModal}
        onOpenChange={setShowReportModal}
        reportedUserId={profile.id}
        reportedUserName={profile.name}
      />

      <CompatibilityDeepDiveModal
        isOpen={showDeepDiveModal}
        onClose={() => setShowDeepDiveModal(false)}
        viewerId={viewerId}
        candidateId={profile.id}
        candidateName={profile.name}
        onSendInterest={() => onSendInterest(profile)}
        hasSentInterest={isLiked}
      />
    </Dialog>
  );
};
