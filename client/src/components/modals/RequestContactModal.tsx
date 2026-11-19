import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Phone, MessageSquare, Crown, ShieldCheck, CheckCircle2 } from "lucide-react";

interface RequestContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetProfile: {
    id: string;
    profileId?: string;
    name: string;
    phone?: string;
    email?: string;
    city?: string;
    verified?: boolean;
  } | null;
  userRole?: "free" | "gold" | "vip" | "admin";
  onUpgradeMembership: () => void;
  onRequestAccess: () => void;
  requestStatus?: "none" | "pending" | "approved" | "rejected";
  loading?: boolean;
}

export const RequestContactModal: React.FC<RequestContactModalProps> = ({
  open,
  onOpenChange,
  targetProfile,
  userRole = "free",
  onUpgradeMembership,
  onRequestAccess,
  requestStatus = "none",
  loading = false,
}) => {
  if (!targetProfile) return null;

  const isVipOrGold = userRole === "vip" || userRole === "gold" || userRole === "admin";
  const isApproved = requestStatus === "approved";
  const isPending = requestStatus === "pending";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#FFFDF9] border border-amber-200 rounded-3xl p-6">
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="font-serif-royal text-xl font-bold text-[#2B120C] flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#EA580C]" />
            Direct Family Contact Access
          </DialogTitle>
          <DialogDescription className="text-xs text-[#5C4740]">
            Privacy protected verified parental phone &amp; WhatsApp communication line.
          </DialogDescription>
        </DialogHeader>

        {/* Contact Display Box */}
        <div className="p-4 rounded-2xl bg-white border border-amber-200/90 shadow-sm space-y-3 mt-2">
          <div className="flex items-center justify-between pb-2 border-b border-amber-100">
            <div>
              <h4 className="font-serif-royal text-base font-bold text-[#2B120C]">
                {targetProfile.name}
              </h4>
              <span className="text-xs text-[#7C2D12]">
                Profile ID: {targetProfile.profileId || "#000003"}
              </span>
            </div>
            {targetProfile.verified && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                ID Verified
              </span>
            )}
          </div>

          {/* Masked vs Unmasked Details */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/60">
              <span className="text-[#5C4740] font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#EA580C]" />
                Primary Mobile:
              </span>
              <span className="font-mono font-bold text-[#2B120C]">
                {isApproved
                  ? targetProfile.phone || "+91 98765 43210"
                  : "+91 98*** *****"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/60">
              <span className="text-[#5C4740] font-semibold flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp Line:
              </span>
              <span className="font-mono font-bold text-[#2B120C]">
                {isApproved
                  ? targetProfile.phone || "+91 98765 43210"
                  : "+91 98*** *****"}
              </span>
            </div>
          </div>
        </div>

        {/* State 1: User does not have a VIP subscription */}
        {!isVipOrGold && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3 mt-2 text-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-[#EA580C] flex items-center justify-center mx-auto">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-serif-royal text-sm font-bold text-[#2B120C]">
                VIP Subscription Required
              </h5>
              <p className="text-xs text-[#5C4740] mt-1 max-w-[280px] mx-auto">
                Under Vivah Kar Lo safety rules, personal phone numbers &amp; WhatsApp details cannot be unmasked without an active VIP or Gold membership.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onUpgradeMembership();
              }}
              className="w-full h-10 rounded-xl bg-saffron-gradient text-white text-xs font-bold shadow-saffron-sm"
            >
              <Crown className="w-3.5 h-3.5 mr-1.5" />
              Upgrade to VIP Membership
            </Button>
          </div>
        )}

        {/* State 2: VIP User with Approved Access */}
        {isVipOrGold && isApproved && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1 mt-2">
            <span className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Contact Access Approved by Family
            </span>
            <p className="text-[11px] text-emerald-700">
              You are entitled to call or message directly. Please maintain respectful matrimonial etiquette.
            </p>
          </div>
        )}

        {/* State 3: VIP User with Pending Request */}
        {isVipOrGold && isPending && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1 mt-2">
            <span className="text-xs font-bold text-[#7C2D12]">
              Access Request Pending Approval
            </span>
            <p className="text-[11px] text-[#5C4740]">
              The family has received your request and will approve it shortly.
            </p>
          </div>
        )}

        {/* State 4: VIP User has not yet requested */}
        {isVipOrGold && !isApproved && !isPending && (
          <div className="space-y-3 mt-2">
            <p className="text-xs text-[#5C4740] text-center">
              As a VIP member, click below to request direct contact access. Once accepted, full unmasked digits will be revealed.
            </p>
            <Button
              type="button"
              disabled={loading}
              onClick={onRequestAccess}
              className="w-full h-11 rounded-xl bg-saffron-gradient text-white text-xs font-bold shadow-saffron-sm"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              {loading ? "Requesting..." : "Send Contact Access Request"}
            </Button>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-amber-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-amber-300 text-xs"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
