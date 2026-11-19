import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Gift,
  Copy,
  Share2,
  Users,
  Ticket,
  PhoneCall,
  CheckCircle2,
  Send,
  Crown,
} from "lucide-react";

interface DashboardReferralTabProps {
  userId: string;
  userName: string;
  onGoToMembership?: () => void;
}

export const DashboardReferralTab: React.FC<DashboardReferralTabProps> = ({
  userId,
  userName,
  onGoToMembership,
}) => {
  const { toast } = useToast();
  const [wallet, setWallet] = useState<any>(null);
  const [inviteeName, setInviteeName] = useState("");
  const [inviteeMobile, setInviteeMobile] = useState("");
  const [relation, setRelation] = useState("Cousin / Relative");
  const [submitting, setSubmitting] = useState(false);

  const loadWallet = () => {
    fetch(`/api/v1/activity/referrals/${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.wallet) setWallet(d.wallet);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadWallet();
  }, [userId]);

  const referralCode = wallet?.referralCode || "VIVAH-2026";
  const shareLink = `${window.location.origin}/register?ref=${encodeURIComponent(referralCode)}`;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(referralCode);
    toast({ title: "Referral Code Copied", description: `Code ${referralCode} copied to clipboard.` });
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareLink);
    toast({ title: "Referral Link Copied", description: "Share with friends & relatives via WhatsApp or SMS." });
  };

  const handleShareWhatsApp = () => {
    const msg = `Namaste! Join Vivah Kar Lo — India's trusted verified matrimony platform. Register using my personal referral code *${referralCode}* to get priority verification & 20% OFF VIP membership:\n${shareLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteeName.trim() || !inviteeMobile.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/activity/referrals/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          inviteeName: inviteeName.trim(),
          inviteeMobile: inviteeMobile.trim(),
          relation,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Invite failed");
      if (data.wallet) setWallet(data.wallet);
      setInviteeName("");
      setInviteeMobile("");
      toast({ title: "Referral Invitation Sent!", description: data.message });
    } catch (err: any) {
      toast({ title: "Invite Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRedeemCoupon = async (couponCode: string) => {
    try {
      const res = await fetch("/api/v1/activity/referrals/redeem-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, couponCode }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Redeem failed");
      if (data.wallet) setWallet(data.wallet);
      toast({ title: "VIP Reward Redeemed ✓", description: data.message });
    } catch (err: any) {
      toast({ title: "Notice", description: err.message, variant: "destructive" });
    }
  };

  const history = wallet?.history || [];
  const coupons = wallet?.coupons || [];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#3B0A18] via-[#5C1024] to-[#9A3412] text-white p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold">
              <Gift className="w-3.5 h-3.5" />
              Refer &amp; Earn — Family &amp; Friends Rewards Program
            </span>
            <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold">
              Invite Relatives &amp; Friends, Earn Free Contact Credits &amp; 20% VIP Discounts
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90">
              Namaste {userName}! Every verified friend or relative who joins using your code unlocks{" "}
              <strong>+3 Free Contact Unmask Credits</strong> and a <strong>20% OFF VIP Coupon</strong> for your account.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-amber-300/40 rounded-2xl p-4 sm:p-5 space-y-3 min-w-[260px]">
            <span className="text-[11px] uppercase tracking-wider text-amber-200 font-bold block">
              Your Unique Referral Code
            </span>
            <div className="flex items-center justify-between gap-2 bg-[#240710]/70 px-3.5 py-2.5 rounded-xl border border-amber-400/40">
              <span className="font-mono text-lg font-extrabold text-amber-300 tracking-wider">
                {referralCode}
              </span>
              <Button
                type="button"
                size="sm"
                onClick={handleCopyCode}
                className="h-8 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#3B0A18] font-bold text-xs"
              >
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleShareWhatsApp}
                className="h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                <Share2 className="w-3.5 h-3.5 mr-1" />
                WhatsApp
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
                className="h-9 rounded-xl border-amber-300/60 bg-white/10 text-white hover:bg-white/20 font-bold text-xs"
              >
                Copy Link
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reward Wallet KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#5C4740]">Free Contact Credits</span>
            <p className="font-serif-royal text-3xl font-bold text-[#EA580C] mt-1">
              {wallet?.contactCreditsEarned ?? 6}
            </p>
            <span className="text-[11px] text-emerald-700 font-semibold">Ready to unmask numbers</span>
          </div>
          <PhoneCall className="w-9 h-9 text-amber-400" />
        </div>

        <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#5C4740]">VIP Discount Coupons</span>
            <p className="font-serif-royal text-3xl font-bold text-[#3B0A18] mt-1">
              {coupons.filter((c: any) => c.status === "Available").length}
            </p>
            <span className="text-[11px] text-[#7C2D12] font-semibold">Up to 20% OFF VIP Plans</span>
          </div>
          <Ticket className="w-9 h-9 text-amber-400" />
        </div>

        <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#5C4740]">Successful Referrals</span>
            <p className="font-serif-royal text-3xl font-bold text-emerald-700 mt-1">
              {history.filter((h: any) => h.status === "Joined & Verified").length}
            </p>
            <span className="text-[11px] text-[#5C4740]">Out of {history.length} total invites</span>
          </div>
          <Users className="w-9 h-9 text-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Invite Friend / Relative Form */}
        <form
          onSubmit={handleSendInvite}
          className="lg:col-span-5 bg-white rounded-2xl border border-amber-200 p-5 shadow-sm space-y-4"
        >
          <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] border-b border-amber-100 pb-2.5">
            Send Direct Referral Invite
          </h3>
          <div>
            <Label className="text-xs font-semibold text-[#3B0A18]">Friend / Relative Name</Label>
            <Input
              value={inviteeName}
              onChange={(e) => setInviteeName(e.target.value)}
              placeholder="e.g. Siddharth Joshi"
              className="mt-1 h-10 rounded-xl border-amber-200 text-xs"
              required
            />
          </div>
          <div>
            <Label className="text-xs font-semibold text-[#3B0A18]">10-Digit Mobile / WhatsApp Number</Label>
            <Input
              type="tel"
              value={inviteeMobile}
              onChange={(e) => setInviteeMobile(e.target.value)}
              placeholder="9876543210"
              className="mt-1 h-10 rounded-xl border-amber-200 text-xs"
              required
            />
          </div>
          <div>
            <Label className="text-xs font-semibold text-[#3B0A18]">Relation</Label>
            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-xs"
            >
              <option>Cousin / Relative</option>
              <option>Close Friend</option>
              <option>Office Colleague</option>
              <option>Family Neighbor</option>
            </select>
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-10 rounded-xl bg-saffron-gradient text-white font-bold text-xs shadow-saffron-sm"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            {submitting ? "Sending Invite..." : "Send WhatsApp Referral Invite"}
          </Button>
        </form>

        {/* Coupons & Referral History */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-amber-200 p-5 shadow-sm space-y-5">
          <div className="space-y-2.5">
            <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#EA580C]" />
              Your Earned VIP Discount Coupons
            </h3>
            {coupons.length === 0 ? (
              <p className="text-xs text-[#5C4740]">Invite your first friend to unlock a 20% VIP Coupon.</p>
            ) : (
              <div className="space-y-2">
                {coupons.map((c: any) => (
                  <div
                    key={c.code}
                    className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-mono font-extrabold text-sm text-[#3B0A18]">{c.code}</span>
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {c.discountPct}% OFF VIP Plan
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.status === "Available" ? (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleRedeemCoupon(c.code)}
                          className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                        >
                          Redeem &amp; Claim Bonus
                        </Button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Redeemed
                        </span>
                      )}
                      {onGoToMembership && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={onGoToMembership}
                          className="h-8 rounded-lg border-amber-300 text-xs font-semibold"
                        >
                          Use on VIP
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-amber-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7C2D12]">
              Referral Invitations Ledger ({history.length})
            </h4>
            <div className="overflow-x-auto rounded-xl border border-amber-200/80">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-amber-50/90 border-b border-amber-200 text-[#7C2D12] text-[10px] uppercase">
                    <th className="py-2 px-3 font-bold">Invitee</th>
                    <th className="py-2 px-3 font-bold">Contact</th>
                    <th className="py-2 px-3 font-bold">Status</th>
                    <th className="py-2 px-3 font-bold text-right">Reward</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {history.map((row: any) => (
                    <tr key={row.id}>
                      <td className="py-2 px-3 font-semibold text-[#2B120C]">{row.inviteeName}</td>
                      <td className="py-2 px-3 font-mono text-[#5C4740]">{row.inviteeContact}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            row.status === "Joined & Verified"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-[#EA580C]">
                        +{row.rewardCredits} Credits
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
