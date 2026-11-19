import React, { useState, useMemo } from "react";
import { ProfileData, MOCK_VIP_PLANS } from "@/data/mockData";
import type { AccountBundle, UserSessionRecord } from "@/types/authTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  Check,
  Crown,
  ShieldCheck,
  LogOut,
  EyeOff,
  Bell,
  Lock,
  Printer,
  FileText,
  User,
  Heart,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  calculateVedicKundliMatch,
  RASHI_DATA,
  NAKSHATRA_DATA,
  type AstrologicalProfile,
  type KundliMatchingResult,
} from "@shared/vedicAstrologyEngine";
import { KundliPdfReportModal } from "@/components/matching/KundliPdfReportModal";
import { KundaliChartVisualizer } from "@/components/matching/KundaliChartVisualizer";

export const KundliMilanTab: React.FC<{
  profiles: ProfileData[];
  account?: AccountBundle;
}> = ({ profiles, account }) => {
  const { toast } = useToast();
  const [matchingMode, setMatchingMode] = useState<"profiles" | "custom">("profiles");

  // Selected candidate profile from database/mock list
  const [selectedId, setSelectedId] = useState(profiles[0]?.id || "1");
  const candidate = profiles.find((p) => p.id === selectedId) || profiles[0];

  // Custom Matcher Form State
  const [groomForm, setGroomForm] = useState<AstrologicalProfile>({
    name: account?.user.fullName || "Aarav Sharma",
    gender: "male",
    rashi: "Mesha",
    nakshatra: "Ashwini",
    manglik: "Non-manglik",
    gotra: "Kashyap",
    birthPlace: "New Delhi",
  });

  const [brideForm, setBrideForm] = useState<AstrologicalProfile>({
    name: candidate.name || "Ananya Sen",
    gender: "female",
    rashi: candidate.rashi || "Kanya",
    nakshatra: candidate.nakshatra || "Hasta",
    manglik: (candidate.manglik as any) || "Non-manglik",
    gotra: candidate.gotra || "Bharadwaj",
    birthPlace: candidate.city || "Mumbai",
  });

  // Modal for Downloadable PDF
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Live calculation based on mode
  const matchResult: KundliMatchingResult = useMemo(() => {
    if (matchingMode === "profiles") {
      const groom: AstrologicalProfile = {
        name: account?.user.fullName || "My Profile",
        gender: "male",
        rashi: "Mesha",
        nakshatra: "Ashwini",
        manglik: "Non-manglik",
        gotra: "Kashyap",
        birthPlace: "New Delhi",
      };

      const bride: AstrologicalProfile = {
        name: candidate.name,
        gender: "female",
        rashi: candidate.rashi || "Kanya",
        nakshatra: candidate.nakshatra || "Hasta",
        manglik: (candidate.manglik as any) || "Non-manglik",
        gotra: candidate.gotra || "Vashishta",
        birthPlace: candidate.city,
      };

      return calculateVedicKundliMatch(groom, bride);
    } else {
      return calculateVedicKundliMatch(groomForm, brideForm);
    }
  }, [matchingMode, candidate, account, groomForm, brideForm]);

  const rashiList = Object.keys(RASHI_DATA);
  const nakshatraList = Object.keys(NAKSHATRA_DATA);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
            36-Guna Vedic Kundli Milan
          </h1>
          <p className="text-sm text-[#5C4740]">
            In-house Vedic calculation engine with full Ashtakoot, Nadi, Bhakoot, and Manglik analysis
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setShowPdfModal(true)}
          className="h-10 px-4 rounded-xl bg-saffron-gradient text-white text-xs font-bold shadow-saffron-sm hover:opacity-95 self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 mr-1.5" />
          Download Designer PDF
        </Button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex bg-amber-50 p-1 rounded-2xl border border-amber-200 self-start max-w-md">
        <button
          type="button"
          onClick={() => setMatchingMode("profiles")}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
            matchingMode === "profiles"
              ? "bg-[#3B0A18] text-amber-100 shadow-sm"
              : "text-[#5C4740] hover:text-[#2B120C]"
          }`}
        >
          Match with Community Profiles
        </button>
        <button
          type="button"
          onClick={() => setMatchingMode("custom")}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
            matchingMode === "custom"
              ? "bg-[#3B0A18] text-amber-100 shadow-sm"
              : "text-[#5C4740] hover:text-[#2B120C]"
          }`}
        >
          Custom Kundli Calculator
        </button>
      </div>

      {/* Candidate Profile Strip for Mode A */}
      {matchingMode === "profiles" ? (
        <div className="flex overflow-x-auto no-scrollbar gap-2.5 pb-1">
          {profiles.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              className={`shrink-0 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border text-sm font-semibold transition-all ${
                p.id === candidate.id
                  ? "bg-[#3B0A18] text-white border-[#3B0A18]"
                  : "bg-white text-[#3E2723] border-amber-200 hover:border-[#FF7700]"
              }`}
            >
              <img
                src={p.photos[0]}
                alt={p.name}
                className="w-7 h-7 rounded-full object-cover"
              />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      ) : (
        /* Custom Input Form for Mode B */
        <div className="bg-white rounded-3xl border border-amber-200 p-5 sm:p-6 shadow-sm grid md:grid-cols-2 gap-6">
          {/* Groom Form */}
          <div className="space-y-3 border-b md:border-b-0 md:border-r border-amber-100 pb-5 md:pb-0 md:pr-6">
            <h3 className="font-serif-royal text-base font-bold text-[#3B0A18] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B0A18]" />
              Groom's Vedic Details
            </h3>
            <div className="space-y-2.5 text-xs">
              <div>
                <Label className="text-xs text-[#5C4740]">Full Name</Label>
                <Input
                  value={groomForm.name}
                  onChange={(e) => setGroomForm({ ...groomForm, name: e.target.value })}
                  className="h-9 mt-1 rounded-xl border-amber-200 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-[#5C4740]">Rashi (Moon Sign)</Label>
                  <select
                    value={groomForm.rashi}
                    onChange={(e) => setGroomForm({ ...groomForm, rashi: e.target.value })}
                    className="w-full h-9 mt-1 rounded-xl border border-amber-200 bg-white px-2.5 text-xs"
                  >
                    {rashiList.map((r) => (
                      <option key={r} value={r}>
                        {r} ({RASHI_DATA[r].english})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-[#5C4740]">Nakshatra</Label>
                  <select
                    value={groomForm.nakshatra}
                    onChange={(e) => setGroomForm({ ...groomForm, nakshatra: e.target.value })}
                    className="w-full h-9 mt-1 rounded-xl border border-amber-200 bg-white px-2.5 text-xs"
                  >
                    {nakshatraList.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-[#5C4740]">Manglik Status</Label>
                  <select
                    value={groomForm.manglik}
                    onChange={(e) => setGroomForm({ ...groomForm, manglik: e.target.value as any })}
                    className="w-full h-9 mt-1 rounded-xl border border-amber-200 bg-white px-2.5 text-xs"
                  >
                    <option value="Non-manglik">Non-manglik</option>
                    <option value="Manglik">Manglik</option>
                    <option value="Anshik Manglik">Anshik Manglik</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-[#5C4740]">Gotra</Label>
                  <Input
                    value={groomForm.gotra || ""}
                    onChange={(e) => setGroomForm({ ...groomForm, gotra: e.target.value })}
                    placeholder="e.g. Kashyap"
                    className="h-9 mt-1 rounded-xl border-amber-200 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bride Form */}
          <div className="space-y-3">
            <h3 className="font-serif-royal text-base font-bold text-[#EA580C] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
              Bride's Vedic Details
            </h3>
            <div className="space-y-2.5 text-xs">
              <div>
                <Label className="text-xs text-[#5C4740]">Full Name</Label>
                <Input
                  value={brideForm.name}
                  onChange={(e) => setBrideForm({ ...brideForm, name: e.target.value })}
                  className="h-9 mt-1 rounded-xl border-amber-200 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-[#5C4740]">Rashi (Moon Sign)</Label>
                  <select
                    value={brideForm.rashi}
                    onChange={(e) => setBrideForm({ ...brideForm, rashi: e.target.value })}
                    className="w-full h-9 mt-1 rounded-xl border border-amber-200 bg-white px-2.5 text-xs"
                  >
                    {rashiList.map((r) => (
                      <option key={r} value={r}>
                        {r} ({RASHI_DATA[r].english})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-[#5C4740]">Nakshatra</Label>
                  <select
                    value={brideForm.nakshatra}
                    onChange={(e) => setBrideForm({ ...brideForm, nakshatra: e.target.value })}
                    className="w-full h-9 mt-1 rounded-xl border border-amber-200 bg-white px-2.5 text-xs"
                  >
                    {nakshatraList.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-[#5C4740]">Manglik Status</Label>
                  <select
                    value={brideForm.manglik}
                    onChange={(e) => setBrideForm({ ...brideForm, manglik: e.target.value as any })}
                    className="w-full h-9 mt-1 rounded-xl border border-amber-200 bg-white px-2.5 text-xs"
                  >
                    <option value="Non-manglik">Non-manglik</option>
                    <option value="Manglik">Manglik</option>
                    <option value="Anshik Manglik">Anshik Manglik</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-[#5C4740]">Gotra</Label>
                  <Input
                    value={brideForm.gotra || ""}
                    onChange={(e) => setBrideForm({ ...brideForm, gotra: e.target.value })}
                    placeholder="e.g. Bharadwaj"
                    className="h-9 mt-1 rounded-xl border-amber-200 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Kundli Matching Results Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Hero Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#2B0712] via-[#3B0A18] to-[#4A1022] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl border border-amber-300/30">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Sparkles className="w-4 h-4" />
              {matchResult.verdictTitle}
            </span>
            <h2 className="font-serif-royal text-2xl font-bold">
              {matchResult.groom.name} &amp; {matchResult.bride.name}
            </h2>
            <p className="text-sm text-amber-100/80">
              Groom: {matchResult.groom.rashi} • Bride: {matchResult.bride.rashi}
            </p>
          </div>

          <div className="text-center py-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="font-serif-royal text-5xl sm:text-6xl font-extrabold text-amber-300">
              {matchResult.totalScore}
              <span className="text-2xl text-amber-100/70"> / {matchResult.maxScore}</span>
            </p>
            <p className="text-sm font-semibold text-emerald-300 mt-2">
              {matchResult.percentage}% Compatibility Match
            </p>
            <p className="text-xs text-amber-100/80 px-4 mt-1">
              {matchResult.verdictSummary}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 border border-amber-200/20 p-4 text-xs text-amber-100/85 space-y-1">
            <p><strong>Nadi Status:</strong> {!matchResult.doshas.nadiDosha.hasDosha ? "No Nadi Dosha" : matchResult.doshas.nadiDosha.isCancelled ? "Nadi Dosha Cancelled" : "Nadi Dosha Present"}</p>
            <p><strong>Bhakoot Status:</strong> {!matchResult.doshas.bhakootDosha.hasDosha ? "Auspicious Bhakoot" : matchResult.doshas.bhakootDosha.isCancelled ? "Bhakoot Parihara Cancelled" : "Bhakoot Dosha"}</p>
            <p><strong>Manglik Alignment:</strong> {matchResult.doshas.manglikCompatibility.isCompatible ? "Compatible ✓" : "Remedies Advised"}</p>
          </div>

          <Button
            type="button"
            onClick={() => setShowPdfModal(true)}
            className="w-full h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#2B120C] font-bold text-xs"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            View Official PDF Certificate
          </Button>
        </div>

        {/* Right 8-Kootas Breakdown Cards */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
              8-Koota Gunas Breakdown
            </h3>
            <span className="text-xs text-[#EA580C] font-bold">
              36 Points Total
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {matchResult.kootas.map((k) => {
              const pct = Math.round((k.obtainedScore / k.maxScore) * 100);
              return (
                <div
                  key={k.koota}
                  className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <div>
                      <span className="text-[#2B120C] font-bold">{k.koota}</span>
                      <p className="text-[10px] text-[#8C6D62] font-normal">{k.area}</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        k.obtainedScore === k.maxScore
                          ? "bg-emerald-100 text-emerald-800"
                          : k.obtainedScore > 0
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {k.obtainedScore} / {k.maxScore}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white overflow-hidden">
                    <div
                      className="h-full bg-saffron-gradient"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#5C4740] leading-tight pt-0.5">
                    {k.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Dosha Analysis Cards */}
          <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-amber-100">
            <div className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/70 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2B120C]">Nadi Dosha Review:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  !matchResult.doshas.nadiDosha.hasDosha || matchResult.doshas.nadiDosha.isCancelled
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}>
                  {matchResult.doshas.nadiDosha.isCancelled ? "Parihara Applied ✓" : !matchResult.doshas.nadiDosha.hasDosha ? "No Dosha ✓" : "Nadi Dosha"}
                </span>
              </div>
              <p className="text-[#5C4740] text-[11px]">
                {matchResult.doshas.nadiDosha.description}
              </p>
              {matchResult.doshas.nadiDosha.cancellationReason && (
                <p className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 p-1 rounded">
                  Vedic Rule: {matchResult.doshas.nadiDosha.cancellationReason}
                </p>
              )}
            </div>
            <div className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/70 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2B120C]">Bhakoot Dosha Review:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  !matchResult.doshas.bhakootDosha.hasDosha || matchResult.doshas.bhakootDosha.isCancelled
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}>
                  {matchResult.doshas.bhakootDosha.isCancelled ? "Parihara Applied ✓" : !matchResult.doshas.bhakootDosha.hasDosha ? "No Dosha ✓" : "Bhakoot Dosha"}
                </span>
              </div>
              <p className="text-[#5C4740] text-[11px]">
                {matchResult.doshas.bhakootDosha.description}
              </p>
            </div>
          </div>

          {/* Interactive Composite Charts */}
          <div className="pt-3 border-t border-amber-100 space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#3B0A18] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Lagna & Navamsha Vedic Charts
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              <KundaliChartVisualizer
                personName={matchResult.groom.name}
                rashi={matchResult.groom.rashi}
                lagnaRashi={matchResult.groom.rashi}
              />
              <KundaliChartVisualizer
                personName={matchResult.bride.name}
                rashi={matchResult.bride.rashi}
                lagnaRashi={matchResult.bride.rashi}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Official PDF Certificate Modal */}
      <KundliPdfReportModal
        open={showPdfModal}
        onOpenChange={setShowPdfModal}
        result={matchResult}
      />
    </div>
  );
};

import {
  OFFICIAL_MEMBERSHIP_PLANS,
  OFFICIAL_BANK_DETAILS,
  type MembershipPlan,
  type UserMembershipRecord,
} from "@shared/membershipTypes";
import {
  type SubscriptionInvoice,
  type WhatsAppNotificationPreferences,
} from "@shared/userActivityTypes";
import {
  KeyRound,
  Download,
  Trash2,
  PowerOff,
  Send,
  Smartphone,
  Receipt,
  Eye as EyeIcon,
} from "lucide-react";
import { ManualPaymentModal } from "@/components/modals/ManualPaymentModal";

export const MembershipTab: React.FC<{ account: AccountBundle }> = ({
  account,
}) => {
  const { toast } = useToast();
  const [activeMembership, setActiveMembership] = useState<UserMembershipRecord>({
    userId: account.user.id,
    tier: account.role.role === "vip" ? "gold" : "free",
    tierName: account.role.role === "vip" ? "Gold Royal" : "Free Starter",
    status: account.role.role === "vip" ? "active" : "free",
    contactsTotalQuota: account.role.role === "vip" ? 75 : 0,
    contactsUsedCount: account.role.role === "vip" ? 8 : 0,
    contactsRemaining: account.role.role === "vip" ? 67 : 0,
    expiresAt: account.role.role === "vip" ? "15 May 2027" : undefined,
  });

  const [plans, setPlans] = useState<MembershipPlan[]>(OFFICIAL_MEMBERSHIP_PLANS);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<string>("gold");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  // FEATURE 33: Subscription & Invoice History
  const [invoices, setInvoices] = useState<SubscriptionInvoice[]>([
    {
      id: "inv-101",
      invoiceNumber: "INV-2026-0042",
      planId: "gold",
      planName: "Gold Royal",
      durationLabel: "6 Months",
      amount: 4999,
      amountDisplay: "₹4,999",
      paymentMethod: "UPI (Google Pay)",
      utrNumber: "420198734561",
      status: "approved",
      paymentDate: "12 Nov 2026, 02:40 PM",
    },
    {
      id: "inv-102",
      invoiceNumber: "INV-2026-0018",
      planId: "silver",
      planName: "Silver Connect",
      durationLabel: "3 Months",
      amount: 2499,
      amountDisplay: "₹2,499",
      paymentMethod: "Bank IMPS",
      utrNumber: "IMPS26040192841",
      status: "approved",
      paymentDate: "15 Aug 2026, 11:15 AM",
    },
  ]);

  // Fetch live membership status and dynamic active plans on mount
  React.useEffect(() => {
    fetch(`/api/v1/membership/status/${account.user.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.membership) {
          setActiveMembership(data.membership);
        }
      })
      .catch(() => {});

    fetch("/api/v1/membership/plans")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.plans) && data.plans.length > 0) {
          setPlans(data.plans);
        }
      })
      .catch(() => {});

    fetch(`/api/v1/membership/history?userId=${encodeURIComponent(account.user.id)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.invoices) && data.invoices.length > 0) {
          setInvoices(data.invoices);
        }
      })
      .catch(() => {});
  }, [account.user.id]);

  const handleDownloadInvoice = (inv: SubscriptionInvoice) => {
    toast({
      title: `Invoice #${inv.invoiceNumber} Generated`,
      description: `Official GST receipt for ${inv.planName} (${inv.amountDisplay}) downloaded.`,
    });
  };

  const handleOpenPayment = (planId: string) => {
    setSelectedPlanForPayment(planId);
    setShowPaymentModal(true);
  };

  const isVip = activeMembership.status === "active" && activeMembership.tier !== "free";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
            VIP Membership &amp; Monetization Plans
          </h1>
          <p className="text-sm text-[#5C4740]">
            Unlock unmasked phone numbers, direct WhatsApp chats, and personalized matchmaking
          </p>
        </div>
      </div>

      {/* Active Membership Status Banner */}
      <div className="bg-gradient-to-r from-[#2B0712] via-[#3B0A18] to-[#2B0712] text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-amber-300/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-[#2B120C] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                {activeMembership.tierName}
              </span>
              <span className="text-xs text-amber-200/90 font-medium">
                Status: <strong>{isVip ? "Active Subscriber" : "Free Plan"}</strong>
              </span>
            </div>

            <h2 className="font-serif-royal text-2xl sm:text-3xl font-bold text-white">
              {isVip
                ? `Welcome to ${activeMembership.tierName} Privileges`
                : "Upgrade to Access Verified Contact Details"}
            </h2>

            <p className="text-xs sm:text-sm text-amber-100/80 max-w-xl">
              {isVip
                ? `Your VIP privileges are active until ${activeMembership.expiresAt ? new Date(activeMembership.expiresAt).toLocaleDateString() : "May 2027"}. Use your verified contact credits anytime.`
                : "Free members can explore matches and send initial interests. Upgrade to view phone numbers, chat directly, and download official horoscope certificates."}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 min-w-[240px] space-y-2 text-right md:text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-200">Contact Views Remaining:</span>
              <strong className="text-amber-300 font-mono text-sm">
                {activeMembership.contactsRemaining} / {activeMembership.contactsTotalQuota}
              </strong>
            </div>

            <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{
                  width: `${
                    activeMembership.contactsTotalQuota > 0
                      ? Math.round(
                          (activeMembership.contactsRemaining / activeMembership.contactsTotalQuota) * 100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>

            <p className="text-[11px] text-amber-100/70 text-center">
              {isVip ? "Credits refill upon renewal" : "0 Credits on Free Plan"}
            </p>
          </div>
        </div>
      </div>

      {/* VIP Membership Cards (Dynamic & Admin Managed) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {plans.map((plan) => {
          const isCurrent = activeMembership.tier === plan.id;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl border p-5 sm:p-6 flex flex-col justify-between space-y-5 relative transition-all ${
                plan.recommended
                  ? "bg-gradient-to-b from-[#FFF9F2] to-white border-[#FF7700] shadow-md ring-2 ring-[#FF7700]/30"
                  : "bg-white border-amber-200 shadow-sm hover:border-amber-300"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-saffron-gradient text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                  {plan.badge}
                </span>
              )}

              <div className="space-y-3.5">
                <div>
                  <h3 className="font-serif-royal text-xl font-bold text-[#2B120C]">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-[#5C4740] font-medium mt-0.5">{plan.durationLabel}</p>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif-royal text-3xl font-extrabold text-[#3B0A18]">
                      {plan.priceDisplay}
                    </span>
                    <span className="text-xs text-[#8C6D62] line-through">
                      {plan.originalPriceDisplay}
                    </span>
                  </div>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Save {plan.discountLabel}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-amber-100">
                  {plan.features.map((feat, idx) => (
                    <p
                      key={idx}
                      className="text-xs text-[#4E342E] flex items-start gap-2 leading-snug"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </p>
                  ))}
                </div>
              </div>

              <Button
                type="button"
                onClick={() => handleOpenPayment(plan.id)}
                className={`w-full h-11 rounded-xl font-bold text-xs ${
                  isCurrent
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : plan.recommended
                    ? "bg-saffron-gradient text-white shadow-saffron-sm hover:opacity-95"
                    : "bg-amber-50 hover:bg-amber-100 text-[#3B0A18] border border-amber-300"
                }`}
              >
                {isCurrent ? "Current Plan Active ✓" : `Choose ${plan.name}`}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Matrix */}
      <div className="bg-white rounded-3xl border border-amber-200/90 p-6 shadow-sm space-y-4">
        <h3 className="font-serif-royal text-xl font-bold text-[#2B120C]">
          Feature Comparison &amp; Monetization Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-amber-50/70 border-b border-amber-200 text-[#7C2D12] uppercase font-bold">
                <th className="p-3">Platform Capability</th>
                <th className="p-3 text-center">Free Starter</th>
                <th className="p-3 text-center">Silver Connect</th>
                <th className="p-3 text-center bg-orange-50/50">Gold Royal 🔥</th>
                <th className="p-3 text-center">Diamond VIP 👑</th>
                <th className="p-3 text-center">Assisted Match ⭐</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100 text-[#4E342E]">
              <tr>
                <td className="p-3 font-semibold text-[#2B120C]">Browse Verified Profiles</td>
                <td className="p-3 text-center text-emerald-600 font-bold">Unlimited</td>
                <td className="p-3 text-center text-emerald-600 font-bold">Unlimited</td>
                <td className="p-3 text-center text-emerald-600 font-bold bg-orange-50/30">Unlimited</td>
                <td className="p-3 text-center text-emerald-600 font-bold">Unlimited</td>
                <td className="p-3 text-center text-emerald-600 font-bold">Unlimited</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#2B120C]">Verified Phone &amp; WhatsApp Views</td>
                <td className="p-3 text-center text-rose-600 font-bold">Masked (0)</td>
                <td className="p-3 text-center font-bold">25 Numbers</td>
                <td className="p-3 text-center font-bold text-[#EA580C] bg-orange-50/30">75 Numbers</td>
                <td className="p-3 text-center font-bold">150 Numbers</td>
                <td className="p-3 text-center font-extrabold text-emerald-700">Unlimited</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#2B120C]">1-on-1 Encrypted Messaging</td>
                <td className="p-3 text-center text-slate-400">Locked</td>
                <td className="p-3 text-center text-emerald-600 font-bold">Unlocked</td>
                <td className="p-3 text-center text-emerald-600 font-bold bg-orange-50/30">Unlocked</td>
                <td className="p-3 text-center text-emerald-600 font-bold">Unlocked</td>
                <td className="p-3 text-center text-emerald-600 font-bold">Unlocked</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#2B120C]">36-Guna Kundli PDF Certificate</td>
                <td className="p-3 text-center text-slate-500">Screen View</td>
                <td className="p-3 text-center text-emerald-600 font-bold">Included</td>
                <td className="p-3 text-center text-emerald-600 font-bold bg-orange-50/30">Unlimited PDF</td>
                <td className="p-3 text-center text-emerald-600 font-bold">Unlimited PDF</td>
                <td className="p-3 text-center text-emerald-600 font-bold">Unlimited PDF</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#2B120C]">Personal Relationship Manager (RM)</td>
                <td className="p-3 text-center text-slate-400">✗</td>
                <td className="p-3 text-center text-slate-400">✗</td>
                <td className="p-3 text-center text-slate-400 bg-orange-50/30">✗</td>
                <td className="p-3 text-center text-slate-400">✗</td>
                <td className="p-3 text-center text-emerald-700 font-extrabold">Dedicated Senior RM ✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FEATURE 33: Subscription & Invoice History Table */}
      <div className="bg-white rounded-3xl border border-amber-200/90 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Receipt className="w-5 h-5 text-[#EA580C]" />
            <div>
              <h3 className="font-serif-royal text-xl font-bold text-[#2B120C]">
                Subscription Invoices &amp; Payment History
              </h3>
              <p className="text-xs text-[#5C4740]">
                Past membership purchases, official GST tax receipts, and UTR payment audit trails
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-[#7C2D12] rounded-full">
            {invoices.length} Transactions
          </span>
        </div>

        {invoices.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-amber-200 rounded-2xl space-y-1">
            <Receipt className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="font-bold text-sm text-[#2B120C]">No previous billing records</p>
            <p className="text-xs text-[#5C4740]">
              When you purchase or renew a VIP plan, your official invoices and transaction slips will be recorded here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-amber-50/70 border-b border-amber-200 text-[#7C2D12] uppercase font-bold">
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Plan Details</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method &amp; UTR</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 text-[#4E342E]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#2B120C]">
                      {inv.invoiceNumber}
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-[#2B120C]">{inv.planName}</span>
                      <p className="text-[11px] text-[#8C6D62]">{inv.durationLabel}</p>
                    </td>
                    <td className="p-3 font-bold text-[#2B120C]">
                      {inv.amountDisplay}
                    </td>
                    <td className="p-3">
                      <span className="text-[#2B120C] font-medium">{inv.paymentMethod}</span>
                      <p className="text-[11px] font-mono text-[#8C6D62]">UTR: {inv.utrNumber}</p>
                    </td>
                    <td className="p-3 text-[#5C4740]">{inv.paymentDate}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          inv.status === "approved" || inv.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : inv.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadInvoice(inv)}
                        className="h-8 px-3 rounded-lg border-amber-300 text-[#3B0A18] hover:bg-amber-100 text-[11px] font-semibold"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Payment Submission Modal */}
      <ManualPaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        initialPlanId={selectedPlanForPayment}
        availablePlans={plans}
        userId={account.user.id}
        userName={account.user.fullName}
        userEmail={account.user.email}
        userMobile={account.user.mobile}
        onSuccess={() => {
          setHasPendingRequest(true);
        }}
      />
    </div>
  );
};

export const SettingsTab: React.FC<{
  account: AccountBundle;
  session: UserSessionRecord | null;
  onLogout: () => void;
}> = ({ account, session, onLogout }) => {
  const { toast } = useToast();

  // FEATURE 42: Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  // FEATURE 36: WhatsApp Notifications Preferences State
  const [whatsAppPrefs, setWhatsAppPrefs] = useState<WhatsAppNotificationPreferences>({
    userId: account.user.id,
    mobile: account.user.mobile,
    matchesAlerts: true,
    interestAlerts: true,
    chatAlerts: true,
    dailyDigest: false,
    promotions: false,
    updatedAt: new Date().toISOString(),
  });
  const [waLoading, setWaLoading] = useState(false);
  const [waTesting, setWaTesting] = useState(false);

  // FEATURE 43: Danger Zone State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Security & Compliance State: Login History, Suspicious Alerts, Logout Everywhere, Consent
  const [loginHistory, setLoginHistory] = useState<
    Array<{
      id: string;
      device: string;
      browser: string;
      ipAddress: string;
      location: string;
      loginAt: string;
      isCurrent: boolean;
      isSuspicious: boolean;
      status: "Active" | "Signed Out" | "Blocked";
    }>
  >([]);
  const [suspiciousAlertsEnabled, setSuspiciousAlertsEnabled] = useState(true);
  const [revokingAll, setRevokingAll] = useState(false);
  const [legalConsent, setLegalConsent] = useState<{
    privacyPolicyVersion: string;
    termsVersion: string;
    acceptedAt: string;
  }>({
    privacyPolicyVersion: "v2.4",
    termsVersion: "v2.4",
    acceptedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  });

  // Fetch WhatsApp preferences & Login History on mount
  React.useEffect(() => {
    fetch(`/api/v1/settings/whatsapp?userId=${encodeURIComponent(account.user.id)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.settings) {
          setWhatsAppPrefs(data.settings);
        }
      })
      .catch(() => {});

    fetch(`/api/v1/settings/login-history/${encodeURIComponent(account.user.id)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.history)) {
          setLoginHistory(data.history);
          if (data.legalConsent) setLegalConsent(data.legalConsent);
        }
      })
      .catch(() => {});

    fetch(`/api/v1/settings/2fa/${encodeURIComponent(account.user.id)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.twoFactor) {
          setTwoFactorEnabled(Boolean(data.twoFactor.enabled));
          setTwoFactorMethod(data.twoFactor.method || "whatsapp");
          setBackupCodes(data.twoFactor.backupCodes || []);
        }
      })
      .catch(() => {});
  }, [account.user.id]);

  // Feature #11: Two-Factor Authentication (2FA) State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<"whatsapp" | "email" | "authenticator">("whatsapp");
  const [twoFactorCodeSent, setTwoFactorCodeSent] = useState(false);
  const [twoFactorCodeInput, setTwoFactorCodeInput] = useState("");
  const [twoFactorDemoHint, setTwoFactorDemoHint] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [twoFactorBusy, setTwoFactorBusy] = useState(false);

  const handleRevokeSingleSession = async (sessionId: string) => {
    try {
      const res = await fetch("/api/v1/settings/revoke-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: account.user.id, sessionId }),
      });
      const data = await res.json();
      if (data.success && data.history) {
        setLoginHistory(data.history);
        toast({ title: "Device Signed Out", description: data.message });
      }
    } catch {
      toast({ title: "Could not sign out device", variant: "destructive" });
    }
  };

  const handleSend2faCode = async () => {
    setTwoFactorBusy(true);
    try {
      const destination =
        twoFactorMethod === "whatsapp" ? account.user.mobile : account.user.email;
      const res = await fetch("/api/v1/settings/2fa/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: account.user.id,
          method: twoFactorMethod,
          destination,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTwoFactorCodeSent(true);
        setTwoFactorDemoHint(data.demoCode || null);
        toast({ title: "2FA Code Sent", description: data.message });
      }
    } catch {
      toast({ title: "Failed to dispatch 2FA code", variant: "destructive" });
    } finally {
      setTwoFactorBusy(false);
    }
  };

  const handleEnable2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorCodeInput.trim()) return;
    setTwoFactorBusy(true);
    try {
      const res = await fetch("/api/v1/settings/2fa/verify-enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: account.user.id,
          code: twoFactorCodeInput.trim(),
          method: twoFactorMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Invalid code");
      setTwoFactorEnabled(true);
      setBackupCodes(data.twoFactor?.backupCodes || []);
      setTwoFactorCodeSent(false);
      setTwoFactorCodeInput("");
      setTwoFactorDemoHint(null);
      toast({ title: "Two-Factor Authentication Enabled ✓", description: data.message });
    } catch (err: any) {
      toast({ title: "2FA Verification Failed", description: err.message, variant: "destructive" });
    } finally {
      setTwoFactorBusy(false);
    }
  };

  const handleDisable2fa = async () => {
    setTwoFactorBusy(true);
    try {
      const res = await fetch("/api/v1/settings/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: account.user.id }),
      });
      const data = await res.json();
      if (data.success) {
        setTwoFactorEnabled(false);
        setBackupCodes([]);
        toast({ title: "2FA Disabled", description: data.message });
      }
    } finally {
      setTwoFactorBusy(false);
    }
  };

  const handleReportSuspiciousLogin = async (sessionId: string) => {
    try {
      const res = await fetch("/api/v1/settings/report-suspicious-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: account.user.id, sessionId }),
      });
      const data = await res.json();
      if (data.success && data.history) {
        setLoginHistory(data.history);
        toast({
          title: "Suspicious Session Blocked",
          description: data.message,
        });
      }
    } catch {
      toast({ title: "Error blocking session", variant: "destructive" });
    }
  };

  const handleLogoutAllDevices = async () => {
    setRevokingAll(true);
    try {
      const res = await fetch("/api/v1/settings/logout-all-devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: account.user.id }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.history) setLoginHistory(data.history);
        toast({
          title: "Logged Out from All Devices",
          description: data.message,
        });
      }
    } catch {
      toast({ title: "Unable to revoke all sessions", variant: "destructive" });
    } finally {
      setRevokingAll(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast({ title: "Error", description: "Please enter your current password.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "New password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "New password and confirmation do not match.", variant: "destructive" });
      return;
    }

    setPwdLoading(true);
    try {
      const res = await fetch("/api/v1/settings/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: account.user.id,
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update password");
      }
      toast({
        title: "Password Changed",
        description: "Your login credentials have been securely updated.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({
        title: "Password Update Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setPwdLoading(false);
    }
  };

  const handleToggleWhatsAppPref = async (key: keyof WhatsAppNotificationPreferences) => {
    const updated = {
      ...whatsAppPrefs,
      [key]: !whatsAppPrefs[key],
    };
    setWhatsAppPrefs(updated);

    try {
      await fetch("/api/v1/settings/whatsapp", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: account.user.id,
          updates: { [key]: updated[key] },
        }),
      });
      toast({
        title: "Preferences Saved",
        description: "WhatsApp alert settings updated successfully.",
      });
    } catch (err) {
      toast({
        title: "Update Error",
        description: "Could not save preference changes.",
        variant: "destructive",
      });
    }
  };

  const handleSendTestWhatsAppAlert = async (type: "match_alert" | "interest_alert" | "verification_alert") => {
    setWaTesting(true);
    try {
      const res = await fetch("/api/v1/settings/whatsapp/test-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: account.user.id,
          templateType: type,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: "WhatsApp Alert Sent ✓",
          description: `Sample message simulated for +91 ${account.user.mobile}.`,
        });
      }
    } catch (err) {
      toast({
        title: "Test Alert Failed",
        description: "Could not dispatch simulated alert.",
        variant: "destructive",
      });
    } finally {
      setWaTesting(false);
    }
  };

  const handleDeactivateAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate your profile? Your profile will be temporarily hidden from matches. You can reactivate anytime simply by logging back in."
    );
    if (!confirmed) return;

    try {
      const res = await fetch("/api/v1/settings/deactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: account.user.id,
          reason: "User initiated temporary break",
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: "Account Deactivated",
          description: "Your profile is hidden. Logging you out now.",
        });
        setTimeout(onLogout, 1500);
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to deactivate account", variant: "destructive" });
    }
  };

  const handleDeleteAccountPermanent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword) {
      toast({ title: "Password Required", description: "Enter password to confirm permanent deletion.", variant: "destructive" });
      return;
    }

    setDeleteLoading(true);
    try {
      const res = await fetch("/api/v1/settings/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: account.user.id,
          passwordConfirm: deletePassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete account");
      }
      toast({
        title: "Account Permanently Deleted",
        description: "Your personal data and profile have been expunged.",
      });
      setTimeout(onLogout, 1500);
    } catch (err: any) {
      toast({
        title: "Deletion Aborted",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
          Settings, WhatsApp &amp; Account Security
        </h1>
        <p className="text-sm text-[#5C4740]">
          Manage security credentials, WhatsApp notifications, session devices, and profile privacy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FEATURE 42: Change Password Form */}
        <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-4">
          <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#EA580C]" />
            Change Password
          </h3>
          <p className="text-xs text-[#5C4740]">
            Update your account login password with enterprise Bcrypt encryption.
          </p>

          <form onSubmit={handleChangePassword} className="space-y-3.5">
            <div>
              <Label className="text-xs font-semibold text-[#2B120C]">Current Password</Label>
              <div className="relative mt-1">
                <Input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="rounded-xl border-amber-200 pr-10 text-xs h-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-2.5 text-[#8C6D62] hover:text-[#2B120C]"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#2B120C]">New Password (min 6 chars)</Label>
              <div className="relative mt-1">
                <Input
                  type={showNew ? "text" : "password"}
                  placeholder="Enter strong new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded-xl border-amber-200 pr-10 text-xs h-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 text-[#8C6D62] hover:text-[#2B120C]"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#2B120C]">Confirm New Password</Label>
              <Input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl border-amber-200 text-xs h-10 mt-1"
              />
            </div>

            <Button
              type="submit"
              disabled={pwdLoading}
              className="w-full h-10 rounded-xl bg-saffron-gradient text-white font-bold text-xs shadow-saffron-sm"
            >
              {pwdLoading ? "Securing Credentials..." : "Update Password"}
            </Button>
          </form>
        </div>

        {/* FEATURE 36: WhatsApp Notification Preferences */}
        <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-600" />
              WhatsApp Notifications
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              +91 {account.user.mobile}
            </span>
          </div>
          <p className="text-xs text-[#5C4740]">
            Receive automated matrimonial alerts on your WhatsApp number without spam.
          </p>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
              <div>
                <p className="text-xs font-bold text-[#2B120C]">Daily Top Match Alerts</p>
                <p className="text-[11px] text-[#8C6D62]">Notifies when high-compatibility profiles register</p>
              </div>
              <input
                type="checkbox"
                checked={whatsAppPrefs.matchesAlerts}
                onChange={() => handleToggleWhatsAppPref("matchesAlerts")}
                className="w-4 h-4 accent-[#EA580C] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
              <div>
                <p className="text-xs font-bold text-[#2B120C]">Interest &amp; Proposal Received</p>
                <p className="text-[11px] text-[#8C6D62]">Real-time ping when someone sends an alliance request</p>
              </div>
              <input
                type="checkbox"
                checked={whatsAppPrefs.interestAlerts}
                onChange={() => handleToggleWhatsAppPref("interestAlerts")}
                className="w-4 h-4 accent-[#EA580C] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
              <div>
                <p className="text-xs font-bold text-[#2B120C]">Direct Chat Messages</p>
                <p className="text-[11px] text-[#8C6D62]">Instant alert when mutual matches message you</p>
              </div>
              <input
                type="checkbox"
                checked={whatsAppPrefs.chatAlerts}
                onChange={() => handleToggleWhatsAppPref("chatAlerts")}
                className="w-4 h-4 accent-[#EA580C] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
              <div>
                <p className="text-xs font-bold text-[#2B120C]">Weekly Match Digest</p>
                <p className="text-[11px] text-[#8C6D62]">Curated weekend summary of verified alliances</p>
              </div>
              <input
                type="checkbox"
                checked={whatsAppPrefs.dailyDigest}
                onChange={() => handleToggleWhatsAppPref("dailyDigest")}
                className="w-4 h-4 accent-[#EA580C] rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-amber-100 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={waTesting}
              onClick={() => handleSendTestWhatsAppAlert("match_alert")}
              className="flex-1 h-9 rounded-xl border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-xs font-bold"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              {waTesting ? "Dispatching..." : "Send Test Alert"}
            </Button>
          </div>
        </div>

        {/* Account Credentials Summary */}
        <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-4">
          <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Security &amp; Account Identity
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-amber-100">
              <span className="text-[#5C4740]">Account ID</span>
              <span className="font-mono text-xs font-bold text-[#2B120C]">
                {account.user.id}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-amber-100">
              <span className="text-[#5C4740]">Primary Email</span>
              <span className="font-semibold text-[#2B120C]">{account.user.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-amber-100">
              <span className="text-[#5C4740]">Mobile Number</span>
              <span className="font-semibold text-[#2B120C]">{account.user.mobile}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-amber-100">
              <span className="text-[#5C4740]">Account Role</span>
              <span className="font-bold text-[#EA580C] uppercase text-xs">
                {account.role.role}
              </span>
            </div>
          </div>
        </div>

        {/* Active Session & FEATURE 43: Danger Zone */}
        <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#EA580C]" />
              Active Session &amp; Device
            </h3>

            {session && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5 text-xs text-[#5C4740]">
                <p>
                  <strong>Session Token:</strong>{" "}
                  <span className="font-mono">{session.sessionToken.slice(0, 16)}...</span>
                </p>
                <p>
                  <strong>Device IP:</strong> {session.ipAddress}
                </p>
                <p>
                  <strong>Signed In:</strong> {session.createdAt}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-4 border-t border-amber-100">
            <Button
              type="button"
              variant="outline"
              onClick={onLogout}
              className="w-full h-10 rounded-xl border-amber-300 text-[#3B0A18] hover:bg-amber-50 font-bold text-xs"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Sign Out of This Device
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={revokingAll}
              onClick={handleLogoutAllDevices}
              className="w-full h-10 rounded-xl border-rose-300 bg-rose-50/60 text-rose-800 hover:bg-rose-100 font-bold text-xs"
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              {revokingAll ? "Revoking All Sessions..." : "Logout from All Devices"}
            </Button>

            {/* FEATURE 43: Deactivate Account */}
            <div className="pt-2 border-t border-rose-100 flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleDeactivateAccount}
                className="flex-1 h-10 rounded-xl border-amber-300 text-amber-900 hover:bg-amber-100/60 font-semibold text-xs"
              >
                <PowerOff className="w-3.5 h-3.5 mr-1 text-amber-600" />
                Deactivate Account
              </Button>

              {/* FEATURE 43: Delete Account */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 h-10 rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1 text-rose-600" />
                Delete Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Suspicious Login Alert & Login History Audit Table */}
      <div className="bg-white rounded-3xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
          <div>
            <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#EA580C]" />
              Login History, Suspicious Login Alerts &amp; Legal Compliance
            </h3>
            <p className="text-xs text-[#5C4740]">
              Monitor active devices, block unrecognized logins immediately, and review Privacy/T&amp;C consent records.
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs font-bold text-[#3B0A18] bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 cursor-pointer">
            <input
              type="checkbox"
              checked={suspiciousAlertsEnabled}
              onChange={(e) => {
                setSuspiciousAlertsEnabled(e.target.checked);
                toast({
                  title: e.target.checked
                    ? "Suspicious Login Alerts Enabled"
                    : "Suspicious Login Alerts Paused",
                });
              }}
              className="accent-[#EA580C]"
            />
            Suspicious Login Alert (Email/SMS)
          </label>
        </div>

        {/* Active Suspicious Login Warning Banner */}
        {loginHistory
          .filter((h) => h.isSuspicious && h.status === "Active")
          .map((sus) => (
            <div
              key={sus.id}
              className="p-4 rounded-2xl bg-rose-50 border border-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-2.5 text-xs text-rose-900">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">
                    Suspicious Login Detected — {sus.location}
                  </p>
                  <p className="mt-0.5">
                    Device: <strong>{sus.device}</strong> ({sus.browser}) • IP:{" "}
                    <span className="font-mono">{sus.ipAddress}</span> •{" "}
                    {new Date(sus.loginAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => handleReportSuspiciousLogin(sus.id)}
                className="h-9 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0"
              >
                This Wasn&apos;t Me — Block &amp; Secure
              </Button>
            </div>
          ))}

        {/* Device Management & Multiple Login Sessions Table (#9 & #15) */}
        <div className="overflow-x-auto rounded-2xl border border-amber-200/80">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-amber-50/90 border-b border-amber-200 text-[#7C2D12] uppercase text-[10px]">
                <th className="py-2.5 px-3 font-bold">Device &amp; Browser</th>
                <th className="py-2.5 px-3 font-bold">IP &amp; Location</th>
                <th className="py-2.5 px-3 font-bold">Timestamp</th>
                <th className="py-2.5 px-3 font-bold">Security Status</th>
                <th className="py-2.5 px-3 font-bold text-right">Device Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {loginHistory.map((row) => (
                <tr key={row.id} className="hover:bg-amber-50/30">
                  <td className="py-2.5 px-3 font-semibold text-[#2B120C]">
                    {row.device}
                    <span className="block text-[11px] font-normal text-[#6E564E]">
                      {row.browser} {row.isCurrent ? "• Current Session" : ""}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#4E342E]">
                    <span className="font-mono font-semibold">{row.ipAddress}</span>
                    <span className="block text-[11px] text-[#6E564E]">{row.location}</span>
                  </td>
                  <td className="py-2.5 px-3 text-[#5C4740]">
                    {new Date(row.loginAt).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        row.status === "Blocked"
                          ? "bg-rose-100 text-rose-800 border-rose-200"
                          : row.isSuspicious
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : row.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {row.isSuspicious && row.status === "Active"
                        ? "Suspicious Activity"
                        : row.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {row.status === "Active" ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleRevokeSingleSession(row.id)}
                        className="h-7 px-2.5 rounded-lg border-rose-200 text-rose-700 hover:bg-rose-50 text-[11px] font-bold"
                      >
                        Sign Out Device
                      </Button>
                    ) : (
                      <span className="text-[11px] text-slate-400">Revoked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Feature #11: Two-Factor Authentication (2FA) Control Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-amber-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-100">
            <div>
              <h4 className="font-serif-royal text-base font-bold text-[#2B120C] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#EA580C]" />
                Two-Factor Authentication (2FA)
              </h4>
              <p className="text-xs text-[#5C4740]">
                Add an extra security verification layer via WhatsApp OTP, Email OTP, or Authenticator App on every login.
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold self-start ${
                twoFactorEnabled
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-amber-100 text-amber-800 border border-amber-200"
              }`}
            >
              {twoFactorEnabled ? `2FA Enabled (${twoFactorMethod.toUpperCase()}) ✓` : "2FA Not Enabled"}
            </span>
          </div>

          {twoFactorEnabled ? (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-2">
                <p className="font-bold">
                  Your account is protected by Two-Factor Authentication ({twoFactorMethod.toUpperCase()}).
                </p>
                {backupCodes.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold mb-1.5">
                      Emergency Backup Recovery Codes (Store Offline Safely):
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 font-mono text-[11px]">
                      {backupCodes.map((code) => (
                        <span
                          key={code}
                          className="px-2 py-1 rounded-lg bg-white border border-emerald-200 text-center font-bold text-[#2B120C]"
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={twoFactorBusy}
                onClick={handleDisable2fa}
                className="h-9 rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold"
              >
                Disable Two-Factor Authentication
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(
                  [
                    { id: "whatsapp", label: "WhatsApp OTP (Baileys)" },
                    { id: "email", label: "Email OTP (Render Gateway)" },
                    { id: "authenticator", label: "Authenticator App (TOTP)" },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setTwoFactorMethod(m.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      twoFactorMethod === m.id
                        ? "bg-[#3B0A18] text-amber-100 border-[#3B0A18]"
                        : "bg-white text-[#5C4740] border-amber-200 hover:bg-amber-50"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {!twoFactorCodeSent ? (
                <Button
                  type="button"
                  size="sm"
                  disabled={twoFactorBusy}
                  onClick={handleSend2faCode}
                  className="h-9 rounded-xl bg-saffron-gradient text-white font-bold text-xs px-4"
                >
                  {twoFactorBusy ? "Sending Verification Code..." : `Send 6-Digit 2FA Code via ${twoFactorMethod.toUpperCase()}`}
                </Button>
              ) : (
                <form onSubmit={handleEnable2fa} className="space-y-2.5">
                  {twoFactorDemoHint && (
                    <p className="text-[11px] font-semibold text-[#7C2D12] bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                      Verification Code Sent (Demo Preview: <strong className="font-mono">{twoFactorDemoHint}</strong>)
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      value={twoFactorCodeInput}
                      onChange={(e) => setTwoFactorCodeInput(e.target.value)}
                      placeholder="Enter 6-digit 2FA code"
                      maxLength={6}
                      className="h-9 rounded-xl border-amber-300 text-xs font-mono sm:w-52"
                      required
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={twoFactorBusy}
                      className="h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4"
                    >
                      Verify &amp; Enable 2FA
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleSend2faCode}
                      className="h-9 text-xs font-semibold text-[#EA580C]"
                    >
                      Resend Code
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Legal Consent Compliance Record */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs flex items-center justify-between">
            <div>
              <p className="font-bold text-emerald-900">Privacy Policy Accepted</p>
              <p className="text-[11px] text-emerald-800">
                Version {legalConsent.privacyPolicyVersion} • Verified Consent Logged
              </p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs flex items-center justify-between">
            <div>
              <p className="font-bold text-emerald-900">Terms &amp; Conditions Accepted</p>
              <p className="text-[11px] text-emerald-800">
                Version {legalConsent.termsVersion} •{" "}
                {new Date(legalConsent.acceptedAt).toLocaleDateString()}
              </p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          </div>
        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-7 h-7" />
              <div>
                <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
                  Permanently Delete Profile?
                </h3>
                <p className="text-xs text-[#5C4740]">
                  This action is irreversible and purges all photos, chat history, and match records.
                </p>
              </div>
            </div>

            <form onSubmit={handleDeleteAccountPermanent} className="space-y-3 pt-2">
              <div>
                <Label className="text-xs font-semibold text-[#2B120C]">
                  Enter your password to confirm deletion:
                </Label>
                <Input
                  type="password"
                  placeholder="Account password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="rounded-xl border-rose-200 text-xs h-10 mt-1"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 h-10 rounded-xl border-slate-300 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={deleteLoading}
                  className="flex-1 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                >
                  {deleteLoading ? "Expunging..." : "Confirm & Delete"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
