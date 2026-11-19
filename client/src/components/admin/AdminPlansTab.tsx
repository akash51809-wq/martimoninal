import React, { useState } from "react";
import {
  INITIAL_MEMBERSHIP_PLANS,
  type MembershipPlan,
} from "@/data/adminMockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Crown,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  IndianRupee,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  Zap,
  Clock,
  UserPlus,
  RotateCcw,
} from "lucide-react";

interface AdminPlansTabProps {
  onLogAction?: (action: string, target: string) => void;
}

export const AdminPlansTab: React.FC<AdminPlansTabProps> = ({ onLogAction }) => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<MembershipPlan[]>(INITIAL_MEMBERSHIP_PLANS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  // Manual Member Plan Assignment modal
  const [isManualAssignOpen, setIsManualAssignOpen] = useState(false);
  const [manualUserTarget, setManualUserTarget] = useState("");
  const [manualPlanTier, setManualPlanTier] = useState<string>("gold");
  const [manualDaysExtension, setManualDaysExtension] = useState<number>(30);

  const [formData, setFormData] = useState<Partial<MembershipPlan>>({
    name: "",
    tier: "gold",
    price: 4999,
    strikePrice: 7999,
    durationDays: 180,
    durationLabel: "6 Months",
    contactsQuota: 75,
    chatEnabled: true,
    prioritySearch: true,
    horoscopeMatching: true,
    verifiedBadge: true,
    relationshipManager: false,
    active: true,
    popular: false,
  });

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      tier: "gold",
      price: 4999,
      strikePrice: 7999,
      durationDays: 180,
      durationLabel: "6 Months",
      contactsQuota: 75,
      chatEnabled: true,
      prioritySearch: true,
      horoscopeMatching: true,
      verifiedBadge: true,
      relationshipManager: false,
      active: true,
      popular: false,
    });
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: MembershipPlan) => {
    setEditingPlan(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid plan name.",
        variant: "destructive",
      });
      return;
    }

    if (editingPlan) {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editingPlan.id ? ({ ...p, ...formData } as MembershipPlan) : p
        )
      );
      onLogAction?.("Updated Membership Plan", formData.name || "");
      toast({
        title: "Plan Updated",
        description: `${formData.name} configurations have been updated.`,
      });
    } else {
      const newPlan: MembershipPlan = {
        id: `plan-${Date.now().toString().slice(-4)}`,
        name: formData.name || "New Plan",
        tier: formData.tier || "gold",
        price: Number(formData.price) || 0,
        strikePrice: Number(formData.strikePrice) || 0,
        durationDays: Number(formData.durationDays) || 30,
        durationLabel: formData.durationLabel || "1 Month",
        contactsQuota: Number(formData.contactsQuota) || 10,
        chatEnabled: Boolean(formData.chatEnabled),
        prioritySearch: Boolean(formData.prioritySearch),
        horoscopeMatching: Boolean(formData.horoscopeMatching),
        verifiedBadge: Boolean(formData.verifiedBadge),
        relationshipManager: Boolean(formData.relationshipManager),
        active: Boolean(formData.active),
        popular: Boolean(formData.popular),
      };
      setPlans((prev) => [...prev, newPlan]);
      onLogAction?.("Created Membership Plan", newPlan.name);
      toast({
        title: "Plan Created",
        description: `${newPlan.name} is now available in subscription catalogs.`,
      });
    }
    setIsModalOpen(false);
  };

  const handleDeletePlan = (id: string, name: string) => {
    if (confirm(`Are you sure you want to retire membership plan "${name}"?`)) {
      setPlans((prev) => prev.filter((p) => p.id !== id));
      onLogAction?.("Deleted Membership Plan", name);
      toast({
        title: "Plan Retired",
        description: `${name} has been archived.`,
      });
    }
  };

  const handleManualAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUserTarget.trim()) return;

    onLogAction?.(
      `Manual Membership Activation: ${manualPlanTier.toUpperCase()} (+${manualDaysExtension} days)`,
      manualUserTarget
    );
    toast({
      title: "VIP Membership Activated Manually",
      description: `User ${manualUserTarget} granted ${manualPlanTier.toUpperCase()} tier with +${manualDaysExtension} days validity.`,
    });
    setManualUserTarget("");
    setIsManualAssignOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-xs">
              <Crown className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
                Membership Plans &amp; Revenue Tools
              </h1>
              <p className="text-xs sm:text-sm text-[#5C4740]">
                Configure VIP tier privileges, quota allocations, plan durations, and manual membership extensions
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsManualAssignOpen(true)}
            className="h-10 rounded-xl border-amber-300 text-[#2B120C] hover:bg-amber-50 text-xs font-semibold"
          >
            <UserPlus className="w-4 h-4 mr-1.5 text-amber-700" />
            Manual Member VIP Assign
          </Button>
          <Button
            type="button"
            onClick={handleOpenAdd}
            className="h-10 rounded-xl bg-gradient-to-r from-amber-600 to-[#EA580C] hover:from-amber-700 hover:to-[#C2410C] text-white text-xs font-bold shadow-md shadow-amber-900/10"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create Plan
          </Button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`rounded-2xl p-5 bg-white border transition-all duration-200 flex flex-col justify-between shadow-xs ${
              p.popular
                ? "border-amber-400 ring-2 ring-amber-400/20 shadow-amber-100"
                : "border-amber-200/80 hover:border-amber-300"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  {p.popular && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white mb-1.5 shadow-xs">
                      <Sparkles className="w-2.5 h-2.5 mr-1" />
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
                    {p.name}
                  </h3>
                  <p className="text-xs text-[#8C6D62]">{p.durationLabel}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`uppercase text-[10px] font-bold ${
                    p.tier === "platinum"
                      ? "bg-purple-50 text-purple-800 border-purple-200"
                      : p.tier === "gold"
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : p.tier === "silver"
                      ? "bg-slate-50 text-slate-700 border-slate-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  {p.tier}
                </Badge>
              </div>

              {/* Price display */}
              <div className="pt-2 border-t border-amber-100">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif-royal text-2xl font-bold text-[#2B120C]">
                    Rs {p.price.toLocaleString("en-IN")}
                  </span>
                  {p.strikePrice > p.price && (
                    <span className="text-xs text-[#8C6D62] line-through">
                      Rs {p.strikePrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#5C4740] mt-0.5">
                  Validity: {p.durationDays} Days ({p.durationLabel})
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2 pt-2 border-t border-amber-100 text-xs text-[#5C4740]">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-semibold text-[#2B120C]">
                    {p.contactsQuota > 0 ? `${p.contactsQuota} Phone Numbers` : "No Contact Access"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{p.chatEnabled ? "Direct Messaging Allowed" : "Chat Disabled"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{p.prioritySearch ? "Priority Search Boost" : "Standard Search"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{p.verifiedBadge ? "Verified VIP Profile Badge" : "No VIP Badge"}</span>
                </div>
                {p.relationshipManager && (
                  <div className="flex items-center gap-2 text-purple-700 font-semibold">
                    <Crown className="w-3.5 h-3.5 shrink-0" />
                    <span>Dedicated Relationship Manager</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-amber-100 flex items-center justify-between">
              <span
                className={`text-[11px] font-bold ${
                  p.active ? "text-emerald-700" : "text-gray-500"
                }`}
              >
                {p.active ? "● Live in App" : "○ Draft / Paused"}
              </span>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEdit(p)}
                  className="h-8 px-2 text-xs text-amber-800 hover:bg-amber-100/60 rounded-lg"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Button>
                {p.tier !== "free" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePlan(p.id, p.name)}
                    className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Plan Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6 bg-white border border-amber-200 shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif-royal text-xl font-bold text-[#2B120C]">
              {editingPlan ? "Edit Membership Plan" : "Create New Membership Plan"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSavePlan} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Plan Name *</Label>
                <Input
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Gold Royal VIP"
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Membership Tier</Label>
                <select
                  value={formData.tier || "gold"}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-xl border border-amber-200 text-xs bg-white text-[#2B120C] focus:ring-2 focus:ring-amber-500"
                >
                  <option value="free">Free Tier</option>
                  <option value="silver">Silver Tier</option>
                  <option value="gold">Gold Tier</option>
                  <option value="platinum">Platinum Tier</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Selling Price (Rs) *</Label>
                <Input
                  required
                  type="number"
                  min="0"
                  value={formData.price ?? 4999}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Original / Strike Price (Rs)</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.strikePrice ?? 7999}
                  onChange={(e) => setFormData({ ...formData, strikePrice: Number(e.target.value) })}
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Duration (Days) *</Label>
                <Input
                  required
                  type="number"
                  min="1"
                  value={formData.durationDays ?? 180}
                  onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Duration Label</Label>
                <Input
                  value={formData.durationLabel || "6 Months"}
                  onChange={(e) => setFormData({ ...formData, durationLabel: e.target.value })}
                  placeholder="e.g. 6 Months"
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#2B120C]">Contact View Quota (Numbers)</Label>
              <Input
                type="number"
                min="0"
                value={formData.contactsQuota ?? 75}
                onChange={(e) => setFormData({ ...formData, contactsQuota: Number(e.target.value) })}
                className="rounded-xl border-amber-200 text-xs"
              />
            </div>

            {/* Feature Toggles */}
            <div className="space-y-2 pt-2 border-t border-amber-100">
              <Label className="text-xs font-bold text-[#2B120C]">Plan Entitlements</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2B120C]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.chatEnabled}
                    onChange={(e) => setFormData({ ...formData, chatEnabled: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>Unlimited Chat Messaging</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.prioritySearch}
                    onChange={(e) => setFormData({ ...formData, prioritySearch: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>Priority Search Boost</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.verifiedBadge}
                    onChange={(e) => setFormData({ ...formData, verifiedBadge: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>Crown VIP Badge</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.relationshipManager}
                    onChange={(e) => setFormData({ ...formData, relationshipManager: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>Dedicated Relationship Manager</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>Mark as Most Popular</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>Active &amp; Live in App</span>
                </label>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold"
              >
                {editingPlan ? "Save Plan" : "Create Plan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Manual Member Assignment Modal */}
      <Dialog open={isManualAssignOpen} onOpenChange={setIsManualAssignOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-white border border-amber-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif-royal text-lg font-bold text-[#2B120C]">
              Manual VIP Membership Grant &amp; Extension
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleManualAssignment} className="space-y-4 pt-2">
            <p className="text-xs text-[#5C4740]">
              Manually activate VIP privileges or extend an existing member's validity without payment gateway.
            </p>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#2B120C]">Target User ID or Mobile</Label>
              <Input
                required
                value={manualUserTarget}
                onChange={(e) => setManualUserTarget(e.target.value)}
                placeholder="e.g. usr-active-complete or 9876543210"
                className="rounded-xl border-amber-200 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">VIP Tier</Label>
                <select
                  value={manualPlanTier}
                  onChange={(e) => setManualPlanTier(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-amber-200 text-xs bg-white text-[#2B120C]"
                >
                  <option value="silver">Silver VIP</option>
                  <option value="gold">Gold Royal VIP</option>
                  <option value="platinum">Platinum Exclusive</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Extension Days</Label>
                <select
                  value={manualDaysExtension}
                  onChange={(e) => setManualDaysExtension(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl border border-amber-200 text-xs bg-white text-[#2B120C]"
                >
                  <option value={30}>+30 Days (1 Month)</option>
                  <option value={90}>+90 Days (3 Months)</option>
                  <option value={180}>+180 Days (6 Months)</option>
                  <option value={365}>+365 Days (1 Year)</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsManualAssignOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
              >
                Confirm Grant
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
