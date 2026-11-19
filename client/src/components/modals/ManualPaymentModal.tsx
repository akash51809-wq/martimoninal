import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  OFFICIAL_MEMBERSHIP_PLANS,
  OFFICIAL_BANK_DETAILS,
  type MembershipPlan,
  type PaymentMethod,
} from "@shared/membershipTypes";
import {
  Crown,
  Copy,
  CheckCircle2,
  Building,
  QrCode,
  ShieldCheck,
  Clock,
  ArrowRight,
  Info,
  Phone,
} from "lucide-react";

interface ManualPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPlanId?: string;
  availablePlans?: MembershipPlan[];
  userId: string;
  userName: string;
  userEmail: string;
  userMobile: string;
  onSuccess?: () => void;
}

export const ManualPaymentModal: React.FC<ManualPaymentModalProps> = ({
  open,
  onOpenChange,
  initialPlanId = "gold",
  availablePlans,
  userId,
  userName,
  userEmail,
  userMobile,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [plansList, setPlansList] = useState<MembershipPlan[]>(
    availablePlans && availablePlans.length > 0 ? availablePlans : OFFICIAL_MEMBERSHIP_PLANS
  );
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId);

  React.useEffect(() => {
    if (availablePlans && availablePlans.length > 0) {
      setPlansList(availablePlans);
    } else {
      fetch("/api/v1/membership/plans")
        .then((r) => r.json())
        .then((data) => {
          if (data.success && Array.isArray(data.plans) && data.plans.length > 0) {
            setPlansList(data.plans);
          }
        })
        .catch(() => {});
    }
  }, [availablePlans]);

  React.useEffect(() => {
    if (initialPlanId) {
      setSelectedPlanId(initialPlanId);
    }
  }, [initialPlanId]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [utrNumber, setUtrNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const selectedPlan: MembershipPlan =
    plansList.find((p) => p.id === selectedPlanId) ||
    plansList[0] ||
    OFFICIAL_MEMBERSHIP_PLANS[1];

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(OFFICIAL_BANK_DETAILS.upiId);
    setCopiedUpi(true);
    toast({ title: "UPI ID Copied to Clipboard", description: OFFICIAL_BANK_DETAILS.upiId });
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(OFFICIAL_BANK_DETAILS.accountNumber);
    setCopiedAccount(true);
    toast({ title: "Account Number Copied", description: OFFICIAL_BANK_DETAILS.accountNumber });
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 6) {
      toast({
        title: "Invalid Transaction Reference",
        description: "Please enter a valid 12-digit UPI UTR number or Bank Reference ID.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/membership/purchase-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName,
          userEmail,
          userMobile,
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          durationLabel: selectedPlan.durationLabel,
          amount: selectedPlan.price,
          amountDisplay: selectedPlan.priceDisplay,
          paymentMethod,
          utrNumber: cleanUtr,
          paymentDate: new Date().toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          notes: notes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit request");
      }

      toast({
        title: "Payment Verification Request Submitted!",
        description: `UTR ${cleanUtr} submitted for ${selectedPlan.name}. Admin review in progress.`,
      });

      setUtrNumber("");
      setNotes("");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err.message || "Could not submit payment proof. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[92vh] overflow-y-auto rounded-3xl border border-amber-300 bg-[#FFFDF9] p-0 shadow-2xl">
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-[#2B0712] via-[#3B0A18] to-[#2B0712] text-white p-6 border-b border-amber-200/30">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-5 h-5 text-amber-300" />
            <span className="text-xs uppercase font-bold tracking-wider text-amber-300">
              VIP Membership Activation
            </span>
          </div>
          <DialogHeader className="text-left">
            <DialogTitle className="font-serif-royal text-2xl font-bold text-white">
              Upgrade to {selectedPlan.name}
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-amber-100/80 mt-1">
            Complete payment via UPI or Bank Transfer, submit the 12-digit UTR reference, and our desk activates your account.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Plan Selector Radio Pill Strip */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-[#3B0A18] uppercase tracking-wide">
              1. Confirm Membership Plan:
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {plansList.map((p) => {
                const isSelected = p.id === selectedPlanId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? "bg-gradient-to-b from-amber-50 to-orange-50/70 border-[#FF7700] ring-2 ring-[#FF7700]/30 shadow-xs"
                        : "bg-white border-amber-200 hover:border-amber-300"
                    }`}
                  >
                    <div>
                      <p className="font-serif-royal text-xs font-bold text-[#2B120C]">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-[#8C6D62]">{p.durationLabel}</p>
                    </div>
                    <p className="text-sm font-extrabold text-[#EA580C] mt-2">
                      {p.priceDisplay}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Official Bank & UPI Transfer Box */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-[#3B0A18] uppercase tracking-wide">
              2. Transfer Payable Amount ({selectedPlan.priceDisplay}):
            </Label>

            <div className="rounded-2xl border border-amber-300 bg-white p-4 space-y-3.5 shadow-2xs">
              {/* UPI Option */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3B0A18] text-amber-200 flex items-center justify-center font-bold text-xs">
                    UPI
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8C6D62]">
                      Official Verified UPI ID
                    </span>
                    <p className="font-mono text-sm font-bold text-[#2B120C]">
                      {OFFICIAL_BANK_DETAILS.upiId}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCopyUpi}
                  className="h-8 rounded-lg border-amber-300 text-xs font-semibold text-[#3B0A18]"
                >
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  {copiedUpi ? "Copied ✓" : "Copy UPI"}
                </Button>
              </div>

              {/* Bank NEFT/IMPS Details */}
              <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-amber-200 text-xs space-y-1.5 text-[#4E342E]">
                <div className="flex items-center justify-between border-b border-amber-100 pb-1">
                  <span className="text-[#8C6D62]">Beneficiary Name:</span>
                  <strong className="text-[#2B120C]">{OFFICIAL_BANK_DETAILS.accountName}</strong>
                </div>
                <div className="flex items-center justify-between border-b border-amber-100 pb-1">
                  <span className="text-[#8C6D62]">Bank &amp; Branch:</span>
                  <span>{OFFICIAL_BANK_DETAILS.bankName}, {OFFICIAL_BANK_DETAILS.branch}</span>
                </div>
                <div className="flex items-center justify-between border-b border-amber-100 pb-1">
                  <span className="text-[#8C6D62]">Account Number:</span>
                  <div className="flex items-center gap-2">
                    <strong className="font-mono">{OFFICIAL_BANK_DETAILS.accountNumber}</strong>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="text-[#EA580C] hover:underline text-[10px] font-bold"
                    >
                      {copiedAccount ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8C6D62]">IFSC Code:</span>
                  <strong className="font-mono text-[#EA580C]">{OFFICIAL_BANK_DETAILS.ifscCode}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <Label className="text-xs font-bold text-[#3B0A18] uppercase tracking-wide">
              3. Submit Payment Reference Details:
            </Label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-[#5C4740]">Payment App / Mode *</Label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full h-10 mt-1 rounded-xl border border-amber-200 bg-white px-3 text-xs"
                >
                  <option value="upi">Google Pay (GPay) UPI</option>
                  <option value="phonepe">PhonePe UPI</option>
                  <option value="paytm">Paytm UPI</option>
                  <option value="bank_transfer">Bank Transfer (NEFT / IMPS / RTGS)</option>
                  <option value="cash_deposit">Cash Deposit at ICICI Bank</option>
                </select>
              </div>

              <div>
                <Label className="text-xs text-[#5C4740]">
                  12-Digit UTR / Transaction Reference ID *
                </Label>
                <Input
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 419827361920 or IMPS98234"
                  className="h-10 mt-1 rounded-xl border-amber-200 font-mono text-xs uppercase"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-[#5C4740]">
                Additional Notes / Account Holder Name (Optional)
              </Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Transferred from Sharma Family HDFC account ending in 4102."
                className="mt-1 rounded-xl border-amber-200 text-xs min-h-[64px]"
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Your payment will be verified directly against bank statements. Contact credits ({selectedPlan.contactsQuota} contacts) activate immediately upon approval.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-11 px-5 rounded-xl border-amber-200 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !utrNumber.trim()}
                className="h-11 px-6 rounded-xl bg-saffron-gradient text-white text-xs font-bold shadow-saffron-sm hover:opacity-95 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : `Submit Verification for ${selectedPlan.priceDisplay}`}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
