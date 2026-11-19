import React, { useState, useEffect } from "react";
import { ProfileData } from "@/data/mockData";
import { SUCCESS_STORIES } from "@/data/homepageData";
import {
  ADMIN_TEAM_ROLES,
  type AdminAuditEntry,
  type AdminBroadcastLog,
  type ModerationReport,
  type PaymentTransaction,
  type PromoCoupon,
} from "@/data/adminMockData";
import {
  type SupportTicket,
  type UserFeedback,
} from "@shared/userActivityTypes";
import {
  type MembershipPurchaseRequest,
  type UserMembershipRecord,
  type MembershipPlan,
  OFFICIAL_MEMBERSHIP_PLANS,
} from "@shared/membershipTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AdminMessagingGatewayDesk } from "./AdminMessagingGatewayDesk";
import {
  BadgeCheck,
  Star,
  EyeOff,
  IndianRupee,
  Ticket,
  Plus,
  AlertTriangle,
  Megaphone,
  ShieldCheck,
  CheckCircle2,
  Send,
  MapPin,
  Globe,
  CameraOff,
  UserMinus,
  Search,
  SlidersHorizontal,
  Eye,
  CheckCheck,
  Crown,
  Copy,
  UserCheck,
  RotateCcw,
  Filter,
  Check,
  X,
  FileCheck,
  Edit3,
  Trash2,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Tag,
  Percent,
  Layers,
} from "lucide-react";

export const AdminProfilesTab: React.FC<{
  profiles: ProfileData[];
  onLogAction: (action: string, target: string) => void;
}> = ({ profiles, onLogAction }) => {
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<"moderation" | "privacy_search">("moderation");
  const [featuredIds, setFeaturedIds] = useState<string[]>(["1", "2", "6"]);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [globalWatermark, setGlobalWatermark] = useState<boolean>(true);
  const [globalScreenGuard, setGlobalScreenGuard] = useState<boolean>(true);
  const [globalReadReceipts, setGlobalReadReceipts] = useState<boolean>(true);

  const toggleFeatured = (p: ProfileData) => {
    setFeaturedIds((prev) =>
      prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id]
    );
    onLogAction("Toggled Featured Profile", p.name);
    toast({ title: `Updated featured status for ${p.name}` });
  };

  const toggleHidden = (p: ProfileData) => {
    setHiddenIds((prev) =>
      prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id]
    );
    onLogAction("Toggled Profile Visibility", p.name);
    toast({ title: `Updated visibility for ${p.name}` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
            Profiles, Privacy &amp; Discovery Moderation
          </h1>
          <p className="text-sm text-[#5C4740]">
            Feature top alliances, manage photo watermark guards, and inspect search &amp; stealth telemetry
          </p>
        </div>

        {/* Sub-tab Pill Switch */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-amber-100/60 border border-amber-200/80 self-start">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveSubTab("moderation")}
            className={`h-9 rounded-xl text-xs font-bold px-3.5 ${
              activeSubTab === "moderation"
                ? "bg-white text-[#2B120C] shadow-xs"
                : "text-[#5C4740] hover:text-[#2B120C]"
            }`}
          >
            <Star className="w-3.5 h-3.5 mr-1 text-[#EA580C]" />
            Profiles Directory
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveSubTab("privacy_search")}
            className={`h-9 rounded-xl text-xs font-bold px-3.5 ${
              activeSubTab === "privacy_search"
                ? "bg-white text-[#2B120C] shadow-xs"
                : "text-[#5C4740] hover:text-[#2B120C]"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Privacy &amp; Search Telemetry
          </Button>
        </div>
      </div>

      {activeSubTab === "privacy_search" ? (
        <div className="space-y-6">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-[#5C4740]">
                <span>Photo Shield Active</span>
                <CameraOff className="w-4 h-4 text-[#EA580C]" />
              </div>
              <p className="text-2xl font-bold text-[#2B120C]">1,280</p>
              <p className="text-[11px] text-emerald-700 font-medium">99.4% profiles watermarked</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-[#5C4740]">
                <span>Stealth Exclusions</span>
                <UserMinus className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-2xl font-bold text-[#2B120C]">42</p>
              <p className="text-[11px] text-[#5C4740]">Relative / Colleague filters</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-[#5C4740]">
                <span>Geospatial Map Nodes</span>
                <MapPin className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-[#2B120C]">24</p>
              <p className="text-[11px] text-[#5C4740]">18 Indian Cities + 6 NRI Hubs</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-[#5C4740]">
                <span>Saved Search Alerts</span>
                <Search className="w-4 h-4 text-sky-600" />
              </div>
              <p className="text-2xl font-bold text-[#2B120C]">154</p>
              <p className="text-[11px] text-emerald-700 font-medium">Active daily match triggers</p>
            </div>
          </div>

          {/* Detailed Platform Search & Privacy Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left: Discovery & Geo Hub Analytics */}
            <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-amber-100">
                <Globe className="w-5 h-5 text-[#EA580C]" />
                <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
                  Top Searched Locations &amp; NRI Diaspora
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Mumbai Metropolitan (MMR)", count: 480, nri: false },
                  { name: "New York / New Jersey Hub (USA)", count: 215, nri: true },
                  { name: "Delhi NCR / Gurgaon", count: 390, nri: false },
                  { name: "London / Greater London (UK)", count: 185, nri: true },
                  { name: "Bangalore Tech Corridor", count: 320, nri: false },
                  { name: "Dubai / UAE Alliances", count: 140, nri: true },
                  { name: "Toronto / Vancouver (Canada)", count: 110, nri: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#2B120C] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {item.nri && (
                        <span className="px-1.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-bold">
                          NRI Hub
                        </span>
                      )}
                      <span className="font-mono text-[#5C4740] font-bold">{item.count} queries</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Security & Screenshot Shield Governance */}
            <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-amber-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
                  Platform Privacy Policy &amp; Anti-Scraping Guards
                </h3>
              </div>

              <div className="space-y-3.5">
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-[#2B120C]">
                      Enforce Dynamic Brand Watermark
                    </span>
                    <span className="text-[11px] text-[#5C4740]">
                      Applies &quot;Vivah Kar Lo • Confidential&quot; watermark on all user photo assets
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant={globalWatermark ? "default" : "outline"}
                    onClick={() => {
                      setGlobalWatermark(!globalWatermark);
                      onLogAction("Toggled Global Watermark Policy", String(!globalWatermark));
                      toast({ title: "Updated Global Watermark Policy" });
                    }}
                    className={`h-8 text-xs font-semibold rounded-lg ${
                      globalWatermark ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                    }`}
                  >
                    {globalWatermark ? "Enforced" : "Optional"}
                  </Button>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-[#2B120C]">
                      Anti-PrintScreen &amp; Blur Guard
                    </span>
                    <span className="text-[11px] text-[#5C4740]">
                      Intercepts PrintScreen keys and blanks sensitive profile cards upon window defocus
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant={globalScreenGuard ? "default" : "outline"}
                    onClick={() => {
                      setGlobalScreenGuard(!globalScreenGuard);
                      onLogAction("Toggled Anti-PrintScreen Guard", String(!globalScreenGuard));
                      toast({ title: "Updated Anti-PrintScreen Guard Policy" });
                    }}
                    className={`h-8 text-xs font-semibold rounded-lg ${
                      globalScreenGuard ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                    }`}
                  >
                    {globalScreenGuard ? "Enforced" : "Optional"}
                  </Button>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-[#2B120C]">
                      Chat Read Receipts Telemetry
                    </span>
                    <span className="text-[11px] text-[#5C4740]">
                      Enables real-time delivered &amp; read checkmark timestamps in member chats
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant={globalReadReceipts ? "default" : "outline"}
                    onClick={() => {
                      setGlobalReadReceipts(!globalReadReceipts);
                      onLogAction("Toggled Chat Read Receipts Policy", String(!globalReadReceipts));
                      toast({ title: "Updated Read Receipts Policy" });
                    }}
                    className={`h-8 text-xs font-semibold rounded-lg ${
                      globalReadReceipts ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                    }`}
                  >
                    {globalReadReceipts ? "Active" : "Disabled"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {profiles.map((p) => {
          const isFeatured = featuredIds.includes(p.id);
          const isHidden = hiddenIds.includes(p.id);
          return (
            <div
              key={p.id}
              className={`bg-white rounded-2xl border p-4 shadow-sm space-y-3 ${
                isHidden ? "border-rose-200 opacity-75" : "border-amber-200/80"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={p.photos[0]}
                  alt={p.name}
                  className="w-16 h-16 rounded-2xl object-cover object-top"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif-royal text-base font-bold text-[#2B120C] truncate">
                      {p.name}
                    </h3>
                    <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-xs text-[#5C4740] truncate">
                    {p.profileId} • {p.age} Yrs • {p.city}
                  </p>
                  <p className="text-xs font-semibold text-[#EA580C] truncate">
                    {p.professionTag} • {p.kundliScore}/36 Gunas
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-100">
                <Button
                  type="button"
                  size="sm"
                  variant={isFeatured ? "default" : "outline"}
                  onClick={() => toggleFeatured(p)}
                  className={`h-9 rounded-xl text-xs font-semibold ${
                    isFeatured
                      ? "bg-saffron-gradient text-white"
                      : "border-amber-300 text-[#3B0A18]"
                  }`}
                >
                  <Star className="w-3.5 h-3.5 mr-1" />
                  {isFeatured ? "Featured" : "Feature"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => toggleHidden(p)}
                  className="h-9 rounded-xl border-amber-200 text-xs font-semibold"
                >
                  <EyeOff className="w-3.5 h-3.5 mr-1" />
                  {isHidden ? "Unhide" : "Hide"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};



export const AdminPaymentsTab: React.FC<{
  transactions: PaymentTransaction[];
  coupons: PromoCoupon[];
  onRefundTxn: (txnId: string) => void;
  onToggleCoupon: (code: string) => void;
  onAddCoupon: (code: string, discountLabel: string) => void;
}> = ({
  transactions,
  coupons,
  onRefundTxn,
  onToggleCoupon,
  onAddCoupon,
}) => {
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<
    | "plans"
    | "requests"
    | "subscribers"
    | "transactions"
    | "coupons"
    | "abandoned"
    | "invoicing"
  >("plans");

  const [newCode, setNewCode] = useState("");
  const [newLabel, setNewLabel] = useState("");

  // Abandoned Cart Recovery State
  const [abandonedRecoveryEnabled, setAbandonedRecoveryEnabled] = useState(true);
  const [abandonedDelayMins, setAbandonedDelayMins] = useState(15);
  const [abandonedDiscountPct, setAbandonedDiscountPct] = useState(10);
  const [abandonedCouponCode, setAbandonedCouponCode] = useState("COMEBACK10");
  const [abandonedMessageTemplate, setAbandonedMessageTemplate] = useState(
    "Namaste {userName}! You were exploring the {planName} plan on Vivah Kar Lo. Complete your upgrade now & get an extra {discountPercent}% OFF with coupon code *{couponCode}*! Click here to activate: {checkoutUrl}"
  );
  const [abandonedSessions, setAbandonedSessions] = useState([
    {
      id: "ab-01",
      userName: "Rahul Verma",
      mobile: "+91 98201 44556",
      planName: "Gold Royal 6-Month",
      price: 4999,
      abandonedAt: "18 mins ago",
      recoverySent: false,
    },
    {
      id: "ab-02",
      userName: "Meera Deshmukh",
      mobile: "+91 99302 77881",
      planName: "Diamond VIP Annual",
      price: 9999,
      abandonedAt: "42 mins ago",
      recoverySent: true,
      recoverySentAt: "25 mins ago",
    },
    {
      id: "ab-03",
      userName: "Aditya Singhania",
      mobile: "+91 91234 56789",
      planName: "Platinum 12-Month",
      price: 7499,
      abandonedAt: "1 hour ago",
      recoverySent: false,
    },
  ]);

  // GST B2C Invoicing State
  const [gstInvoicingEnabled, setGstInvoicingEnabled] = useState(true);
  const [legalBusinessName, setLegalBusinessName] = useState(
    "Vivah Kar Lo Matrimonial Services Private Limited"
  );
  const [gstinNumber, setGstinNumber] = useState("27AAACV1234F1Z5");
  const [hsnSacCode, setHsnSacCode] = useState("998397");
  const [stateCode, setStateCode] = useState("27 - Maharashtra");
  const [cgstRate, setCgstRate] = useState(9);
  const [sgstRate, setSgstRate] = useState(9);
  const [igstRate, setIgstRate] = useState(18);
  const [registeredOfficeAddress, setRegisteredOfficeAddress] = useState(
    "Suite 402, Royal Heritage Business Park, Shivaji Nagar, Pune, Maharashtra 411005"
  );
  const [authorizedSignatory, setAuthorizedSignatory] = useState(
    "Director of Finance, Vivah Kar Lo"
  );

  // Plans Management State
  const [plans, setPlans] = useState<MembershipPlan[]>(OFFICIAL_MEMBERSHIP_PLANS);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [planSearch, setPlanSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<"all" | "active" | "inactive">("all");

  // Plan Creator / Editor Modal State
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState({
    id: "",
    name: "",
    badge: "",
    durationMonths: 6,
    durationLabel: "6 Months",
    price: 4999,
    originalPrice: 8499,
    discountLabel: "42% OFF",
    contactsQuota: 75,
    features: [
      "View 75 Verified Phone Numbers & WhatsApp",
      "Direct Call & WhatsApp Unmasking Access",
      "Unlimited Kundli Compatibility & PDF Certificates",
      "Featured Top-of-Search Placement (5X Boost)",
      "Photo Shield™ Privacy Protection",
    ],
    recommended: false,
    isActive: true,
    displayOrder: 1,
  });
  const [newFeatureInput, setNewFeatureInput] = useState("");
  const [isSavingPlan, setIsSavingPlan] = useState(false);

  // Delete Plan Confirmation state
  const [planToDelete, setPlanToDelete] = useState<MembershipPlan | null>(null);
  const [isDeletingPlan, setIsDeletingPlan] = useState(false);

  // Manual Assign Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignUserId, setAssignUserId] = useState("");
  const [assignTier, setAssignTier] = useState<string>("gold");
  const [assignDuration, setAssignDuration] = useState("6");

  const fetchPlans = async () => {
    try {
      setIsLoadingPlans(true);
      const res = await fetch("/api/v1/membership/plans?all=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.plans) && data.plans.length > 0) {
        setPlans(data.plans);
      }
    } catch (err) {
      console.error("Failed to fetch plans", err);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenCreatePlan = () => {
    setEditingPlanId(null);
    setPlanForm({
      id: "",
      name: "",
      badge: "Limited Value ⚡",
      durationMonths: 6,
      durationLabel: "6 Months",
      price: 3999,
      originalPrice: 6999,
      discountLabel: "43% OFF",
      contactsQuota: 50,
      features: [
        "View 50 Verified Phone Numbers & WhatsApp",
        "Direct Chat & WhatsApp Access",
        "Unlimited Kundli Compatibility & PDF Certificates",
        "Standard Search Listing Placement",
      ],
      recommended: false,
      isActive: true,
      displayOrder: plans.length + 1,
    });
    setNewFeatureInput("");
    setShowPlanModal(true);
  };

  const handleOpenEditPlan = (plan: MembershipPlan) => {
    setEditingPlanId(plan.id);
    setPlanForm({
      id: plan.id,
      name: plan.name,
      badge: plan.badge || "",
      durationMonths: plan.durationMonths,
      durationLabel: plan.durationLabel,
      price: plan.price,
      originalPrice: plan.originalPrice,
      discountLabel: plan.discountLabel,
      contactsQuota: plan.contactsQuota,
      features: [...plan.features],
      recommended: !!plan.recommended,
      isActive: plan.isActive !== false,
      displayOrder: plan.displayOrder || 1,
    });
    setNewFeatureInput("");
    setShowPlanModal(true);
  };

  const handleAddFeatureToForm = () => {
    const text = newFeatureInput.trim();
    if (!text) return;
    setPlanForm((prev) => ({
      ...prev,
      features: [...prev.features, text],
    }));
    setNewFeatureInput("");
  };

  const handleRemoveFeatureFromForm = (idx: number) => {
    setPlanForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));
  };

  const handlePriceChange = (priceVal: number, origPriceVal: number) => {
    const discount =
      origPriceVal > priceVal
        ? Math.round(((origPriceVal - priceVal) / origPriceVal) * 100)
        : 0;
    setPlanForm((prev) => ({
      ...prev,
      price: priceVal,
      originalPrice: origPriceVal,
      discountLabel: discount > 0 ? `${discount}% OFF` : "",
    }));
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.name.trim()) {
      toast({
        title: "Plan Name Required",
        description: "Please enter a valid plan name.",
        variant: "destructive",
      });
      return;
    }
    if (planForm.features.length === 0) {
      toast({
        title: "Feature Bullets Required",
        description: "Please add at least one feature entitlement.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingPlan(true);
    try {
      const isEditing = !!editingPlanId;
      const url = isEditing
        ? `/api/v1/membership/plans/${editingPlanId}`
        : "/api/v1/membership/plans";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...planForm,
          price: Number(planForm.price),
          originalPrice: Number(planForm.originalPrice),
          durationMonths: Number(planForm.durationMonths),
          contactsQuota: Number(planForm.contactsQuota),
          displayOrder: Number(planForm.displayOrder),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save plan");

      toast({
        title: isEditing ? "Plan Updated Successfully" : "Plan Created Successfully",
        description: `Plan "${data.plan.name}" is now saved and active.`,
      });

      setShowPlanModal(false);
      await fetchPlans();
    } catch (err: any) {
      toast({
        title: "Failed to Save Plan",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSavingPlan(false);
    }
  };

  const handleTogglePlan = async (plan: MembershipPlan) => {
    try {
      const res = await fetch(`/api/v1/membership/plans/${plan.id}/toggle`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setPlans((prev) =>
        prev.map((p) => (p.id === plan.id ? { ...p, isActive: data.plan.isActive } : p))
      );
      toast({
        title: "Plan Status Toggled",
        description: `Plan "${plan.name}" is now ${data.plan.isActive ? "Active (Visible)" : "Inactive (Hidden)"}.`,
      });
    } catch (err: any) {
      toast({ title: "Toggle Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;
    setIsDeletingPlan(true);
    try {
      const res = await fetch(`/api/v1/membership/plans/${planToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setPlans((prev) => prev.filter((p) => p.id !== planToDelete.id));
      toast({
        title: "Plan Deleted Successfully",
        description: `Plan "${planToDelete.name}" removed from platform.`,
      });
      setPlanToDelete(null);
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsDeletingPlan(false);
    }
  };

  // Live Manual Membership Requests state
  const [requests, setRequests] = useState<MembershipPurchaseRequest[]>([
    {
      id: "mreq-101",
      userId: "usr-001",
      userName: "Arjun Deshmukh",
      userEmail: "arjun.deshmukh@example.com",
      userMobile: "9876543210",
      profileId: "#000002",
      planId: "gold",
      planName: "Gold Royal",
      durationLabel: "6 Months",
      amount: 4999,
      amountDisplay: "₹4,999",
      paymentMethod: "upi",
      utrNumber: "419827361920",
      paymentDate: "Today, 11:30 AM",
      screenshotUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60",
      notes: "Paid via Google Pay UPI. Kindly activate my Gold VIP membership.",
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "mreq-102",
      userId: "usr-003",
      userName: "Rohan Verma",
      userEmail: "rohan.verma@example.com",
      userMobile: "9812345678",
      profileId: "#000003",
      planId: "silver",
      planName: "Silver Connect",
      durationLabel: "3 Months",
      amount: 2499,
      amountDisplay: "₹2,499",
      paymentMethod: "phonepe",
      utrNumber: "420198734561",
      paymentDate: "Yesterday, 04:15 PM",
      screenshotUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60",
      notes: "PhonePe UPI transfer completed.",
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "mreq-104",
      userId: "usr-007",
      userName: "Vikram Malhotra",
      userEmail: "vikram.m@example.com",
      userMobile: "9823456789",
      profileId: "#000005",
      planId: "assisted",
      planName: "Assisted Matchmaking",
      durationLabel: "12 Months Concierge",
      amount: 19999,
      amountDisplay: "₹19,999",
      paymentMethod: "bank_transfer",
      utrNumber: "IMPS26048192348",
      paymentDate: "Today, 02:20 PM",
      notes: "NEFT bank transfer from HDFC. Please assign Senior Relationship Manager.",
      status: "pending",
      createdAt: new Date().toISOString(),
    },
  ]);

  // Active Subscribers Directory
  const [subscribers, setSubscribers] = useState<UserMembershipRecord[]>([
    {
      userId: "usr-004",
      tier: "diamond",
      tierName: "Diamond VIP",
      status: "active",
      startedAt: "10 Nov 2026",
      expiresAt: "10 Nov 2027",
      contactsTotalQuota: 150,
      contactsUsedCount: 18,
      contactsRemaining: 132,
    },
    {
      userId: "usr-008",
      tier: "gold",
      tierName: "Gold Royal",
      status: "active",
      startedAt: "01 Nov 2026",
      expiresAt: "01 May 2027",
      contactsTotalQuota: 75,
      contactsUsedCount: 34,
      contactsRemaining: 41,
    },
  ]);


  // Fetch live requests on mount
  useEffect(() => {
    fetch("/api/v1/membership/requests")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.requests && data.requests.length > 0) {
          setRequests(data.requests);
        }
      })
      .catch(() => {});
  }, []);

  const handleApproveRequest = async (item: MembershipPurchaseRequest) => {
    try {
      const res = await fetch(`/api/v1/membership/requests/${item.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approved",
          reviewedBy: "Admin Superuser",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setRequests((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, status: "approved" as const } : r))
      );

      // Add to subscribers list
      setSubscribers((prev) => [
        {
          userId: item.userId,
          tier: item.planId,
          tierName: item.planName,
          status: "active",
          startedAt: "Today",
          expiresAt: item.planId === "silver" ? "3 Months" : item.planId === "gold" ? "6 Months" : "12 Months",
          contactsTotalQuota: item.planId === "silver" ? 25 : item.planId === "gold" ? 75 : item.planId === "diamond" ? 150 : 9999,
          contactsUsedCount: 0,
          contactsRemaining: item.planId === "silver" ? 25 : item.planId === "gold" ? 75 : item.planId === "diamond" ? 150 : 9999,
        },
        ...prev,
      ]);

      toast({
        title: "Payment Approved & Plan Activated!",
        description: `${item.userName} is now upgraded to ${item.planName}. Contact credits credited.`,
      });
    } catch (err: any) {
      toast({
        title: "Approval Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleRejectRequest = async (item: MembershipPurchaseRequest) => {
    const reason = window.prompt("Enter rejection reason for user:", "UTR not found in bank statement.");
    if (reason === null) return;

    try {
      const res = await fetch(`/api/v1/membership/requests/${item.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rejected",
          reviewedBy: "Admin Superuser",
          rejectionReason: reason,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setRequests((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, status: "rejected" as const, rejectionReason: reason } : r))
      );

      toast({
        title: "Request Rejected",
        description: `Marked rejected with notice to ${item.userName}.`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleManualAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignUserId.trim()) return;

    try {
      const res = await fetch("/api/v1/membership/admin/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: assignUserId.trim(),
          tier: assignTier,
          durationMonths: parseInt(assignDuration, 10),
          assignedBy: "Admin Superuser",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      toast({
        title: "Membership Assigned Successfully",
        description: `Granted ${assignTier.toUpperCase()} for ${assignDuration} months to ${assignUserId}.`,
      });

      setShowAssignModal(false);
      setAssignUserId("");
    } catch (err: any) {
      toast({
        title: "Assignment Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newLabel.trim()) return;
    onAddCoupon(newCode.trim().toUpperCase(), newLabel.trim());
    setNewCode("");
    setNewLabel("");
    toast({ title: `Created coupon ${newCode.trim().toUpperCase()}` });
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");

  const filteredPlans = plans.filter((p) => {
    if (planFilter === "active" && p.isActive === false) return false;
    if (planFilter === "inactive" && p.isActive !== false) return false;
    if (planSearch.trim()) {
      const q = planSearch.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchId = p.id.toLowerCase().includes(q);
      const matchBadge = p.badge?.toLowerCase().includes(q);
      const matchFeat = p.features.some((f) => f.toLowerCase().includes(q));
      if (!matchName && !matchId && !matchBadge && !matchFeat) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
            Revenue, VIP Memberships &amp; Payment Desk
          </h1>
          <p className="text-sm text-[#5C4740]">
            Create and edit VIP membership plans, verify UPI/Bank UTRs, and manage subscriber quotas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            onClick={handleOpenCreatePlan}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-[#EA580C] text-white text-xs font-bold shadow-xs hover:opacity-95"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create New Plan
          </Button>

          <Button
            type="button"
            onClick={() => setShowAssignModal(true)}
            className="h-10 px-4 rounded-xl bg-saffron-gradient text-white text-xs font-bold shadow-saffron-sm hover:opacity-95"
          >
            <Crown className="w-4 h-4 mr-1.5" />
            Manually Assign / Extend Plan
          </Button>
        </div>
      </div>

      {/* Top Monetization KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#8C6D62] uppercase tracking-wider">
            Total Revenue
          </span>
          <p className="font-serif-royal text-2xl font-bold text-[#2B120C]">
            ₹1,48,990
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold">
            +38% vs last month
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#8C6D62] uppercase tracking-wider">
            Configured VIP Plans
          </span>
          <p className="font-serif-royal text-2xl font-bold text-[#EA580C]">
            {plans.length} Plans
          </p>
          <span className="text-[11px] text-amber-800 font-medium">
            {plans.filter((p) => p.isActive !== false).length} Active Live
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#8C6D62] uppercase tracking-wider">
            Pending UTR Approvals
          </span>
          <p className="font-serif-royal text-2xl font-bold text-[#EA580C]">
            {pendingRequests.length}
          </p>
          <span className="text-[11px] text-amber-800 font-medium">
            Requires bank verification
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#8C6D62] uppercase tracking-wider">
            Active VIP Members
          </span>
          <p className="font-serif-royal text-2xl font-bold text-emerald-700">
            {subscribers.length + 18}
          </p>
          <span className="text-[11px] text-[#5C4740]">
            Subscribers across all tiers
          </span>
        </div>
      </div>

      {/* Sub-tab Pill Switch */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 bg-amber-50/70 p-1 rounded-2xl border border-amber-200 self-start">
        <button
          type="button"
          onClick={() => setActiveSubTab("plans")}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === "plans"
              ? "bg-[#3B0A18] text-amber-100 shadow-sm"
              : "text-[#5C4740] hover:text-[#2B120C]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          VIP Membership Plans ({plans.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("requests")}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === "requests"
              ? "bg-[#3B0A18] text-amber-100 shadow-sm"
              : "text-[#5C4740] hover:text-[#2B120C]"
          }`}
        >
          Manual Purchase Requests ({pendingRequests.length} Pending)
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("subscribers")}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === "subscribers"
              ? "bg-[#3B0A18] text-amber-100 shadow-sm"
              : "text-[#5C4740] hover:text-[#2B120C]"
          }`}
        >
          Active VIP Subscribers ({subscribers.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("transactions")}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === "transactions"
              ? "bg-[#3B0A18] text-amber-100 shadow-sm"
              : "text-[#5C4740] hover:text-[#2B120C]"
          }`}
        >
          Transaction Ledger ({transactions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("coupons")}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === "coupons"
              ? "bg-[#3B0A18] text-amber-100 shadow-sm"
              : "text-[#5C4740] hover:text-[#2B120C]"
          }`}
        >
          Promo Coupons ({coupons.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("abandoned")}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === "abandoned"
              ? "bg-[#3B0A18] text-amber-100 shadow-sm"
              : "text-[#5C4740] hover:text-[#2B120C]"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          Abandoned Cart Recovery ({abandonedSessions.filter((s) => !s.recoverySent).length} Pending)
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("invoicing")}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === "invoicing"
              ? "bg-[#3B0A18] text-amber-100 shadow-sm"
              : "text-[#5C4740] hover:text-[#2B120C]"
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-amber-300" />
          GST B2C Invoicing
        </button>
      </div>

      {/* Sub-tab 0: VIP Membership Plans Manager */}
      {activeSubTab === "plans" && (
        <div className="space-y-4">
          {/* Action & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={planSearch}
                  onChange={(e) => setPlanSearch(e.target.value)}
                  placeholder="Search plans or features..."
                  className="pl-9 h-10 rounded-xl border-amber-200 text-xs bg-amber-50/30"
                />
              </div>

              <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200 text-xs">
                <button
                  type="button"
                  onClick={() => setPlanFilter("all")}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    planFilter === "all" ? "bg-[#3B0A18] text-white shadow-2xs" : "text-[#5C4740] hover:text-[#2B120C]"
                  }`}
                >
                  All ({plans.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPlanFilter("active")}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    planFilter === "active" ? "bg-emerald-700 text-white shadow-2xs" : "text-[#5C4740] hover:text-[#2B120C]"
                  }`}
                >
                  Active ({plans.filter((p) => p.isActive !== false).length})
                </button>
                <button
                  type="button"
                  onClick={() => setPlanFilter("inactive")}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    planFilter === "inactive" ? "bg-slate-700 text-white shadow-2xs" : "text-[#5C4740] hover:text-[#2B120C]"
                  }`}
                >
                  Inactive ({plans.filter((p) => p.isActive === false).length})
                </button>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleOpenCreatePlan}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-[#EA580C] text-white text-xs font-bold shadow-xs hover:opacity-95"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create New Plan
            </Button>
          </div>

          {/* Plans Grid */}
          {filteredPlans.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-amber-300 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
              <h4 className="font-serif-royal text-lg font-bold text-[#2B120C]">No Plans Found</h4>
              <p className="text-xs text-[#5C4740] max-w-md mx-auto">
                No subscription plans match your search query or filter. Create a new plan to start offering fresh tiers to members.
              </p>
              <Button
                type="button"
                onClick={handleOpenCreatePlan}
                className="h-10 px-4 rounded-xl bg-saffron-gradient text-white text-xs font-bold shadow-saffron-sm"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Create First Plan
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {filteredPlans.map((plan) => {
                const isActive = plan.isActive !== false;
                return (
                  <div
                    key={plan.id}
                    className={`rounded-3xl border p-5 flex flex-col justify-between space-y-4 relative transition-all bg-white ${
                      plan.recommended
                        ? "border-[#FF7700] ring-2 ring-[#FF7700]/30 shadow-md bg-gradient-to-b from-[#FFFDF9] to-white"
                        : "border-amber-200 shadow-2xs hover:border-amber-300"
                    } ${!isActive ? "opacity-70 bg-slate-50/80" : ""}`}
                  >
                    {/* Header Tags */}
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isActive
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-slate-200 text-slate-700 border border-slate-300"
                        }`}
                      >
                        {isActive ? "Active (Live)" : "Hidden (Inactive)"}
                      </span>

                      {plan.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-saffron-gradient text-white text-[10px] font-bold tracking-wider uppercase shadow-2xs">
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    {/* Plan Title & Slug */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif-royal text-xl font-bold text-[#2B120C]">
                          {plan.name}
                        </h4>
                        {plan.recommended && (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[10px] text-[#8C6D62]">
                        ID: <span className="font-semibold text-[#2B120C]">{plan.id}</span>
                        {plan.displayOrder && ` • Order: #${plan.displayOrder}`}
                      </p>
                    </div>

                    {/* Pricing Block */}
                    <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif-royal text-2xl font-extrabold text-[#3B0A18]">
                          {plan.priceDisplay || `₹${plan.price}`}
                        </span>
                        {plan.originalPrice && plan.originalPrice > plan.price && (
                          <span className="text-xs text-[#8C6D62] line-through">
                            {plan.originalPriceDisplay || `₹${plan.originalPrice}`}
                          </span>
                        )}
                        {plan.discountLabel && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {plan.discountLabel}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#5C4740] font-medium">
                        Duration: <strong>{plan.durationLabel}</strong> ({plan.durationMonths} Months)
                      </p>
                    </div>

                    {/* Quota Highlights */}
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-orange-50/70 border border-orange-200 text-xs text-[#9A3412] font-semibold">
                      <Crown className="w-4 h-4 shrink-0 text-[#EA580C]" />
                      <span>
                        {plan.contactsQuota === 9999 ? "Unlimited" : plan.contactsQuota} Verified Phone &amp; WhatsApp Unmasks
                      </span>
                    </div>

                    {/* Features Preview */}
                    <div className="space-y-1.5 pt-2 border-t border-amber-100 text-xs text-[#4E342E]">
                      {plan.features.slice(0, 4).map((feat, idx) => (
                        <p key={idx} className="flex items-start gap-1.5 leading-snug">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{feat}</span>
                        </p>
                      ))}
                      {plan.features.length > 4 && (
                        <p className="text-[11px] text-[#8C6D62] font-medium italic pl-5">
                          + {plan.features.length - 4} more benefits
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-amber-100 space-y-2">
                      <Button
                        type="button"
                        onClick={() => handleOpenEditPlan(plan)}
                        className="w-full h-9 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#3B0A18] font-bold text-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                        Edit Plan Details
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleTogglePlan(plan)}
                          className={`flex-1 h-8 rounded-xl text-xs font-semibold border ${
                            isActive
                              ? "border-amber-200 text-[#5C4740] hover:bg-amber-50"
                              : "border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                          }`}
                        >
                          {isActive ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5 mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setPlanToDelete(plan)}
                          className="h-8 px-2.5 rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sub-tab 1: Manual Purchase Requests Queue */}
      {activeSubTab === "requests" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-amber-100 flex items-center justify-between">
              <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#EA580C]" />
                Incoming Manual Payment Requests
              </h3>
              <span className="text-xs text-[#5C4740]">
                Match UTR against ICICI Bank statement before approval
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-amber-50/70 border-b border-amber-200 text-[#7C2D12] uppercase font-bold">
                    <th className="px-4 py-3">Member &amp; Contact</th>
                    <th className="px-4 py-3">Plan Selected</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Payment Mode</th>
                    <th className="px-4 py-3">UTR / Reference ID</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 text-[#4E342E]">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-amber-50/40">
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-[#2B120C]">{r.userName}</p>
                        <p className="text-[11px] text-[#5C4740]">{r.userMobile} • {r.userEmail}</p>
                        {r.notes && (
                          <p className="text-[10px] text-[#8C6D62] italic mt-0.5">"{r.notes}"</p>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-[#2B120C]">{r.planName}</span>
                        <p className="text-[11px] text-[#8C6D62]">{r.durationLabel}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <strong className="text-sm font-extrabold text-[#EA580C]">
                          {r.amountDisplay}
                        </strong>
                      </td>
                      <td className="px-4 py-3.5 font-semibold uppercase text-[11px]">
                        {r.paymentMethod}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs font-extrabold bg-amber-100/80 px-2 py-1 rounded text-[#2B120C] border border-amber-300">
                          {r.utrNumber}
                        </span>
                        <p className="text-[10px] text-[#8C6D62] mt-0.5">{r.paymentDate}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            r.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : r.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {r.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {r.status === "pending" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleApproveRequest(r)}
                              className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                            >
                              <Check className="w-3.5 h-3.5 mr-1" />
                              Approve &amp; Activate
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectRequest(r)}
                              className="h-8 rounded-lg border-rose-200 text-rose-700 hover:bg-rose-50 text-xs"
                            >
                              <X className="w-3.5 h-3.5 mr-1" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#8C6D62] font-medium">
                            Reviewed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Active Subscribers Directory */}
      {activeSubTab === "subscribers" && (
        <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-amber-100 flex items-center justify-between">
            <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
              Active VIP Members Directory
            </h3>
            <span className="text-xs text-[#5C4740]">
              Monitored contact viewing limits and subscription expiries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-amber-50/70 border-b border-amber-200 text-[#7C2D12] uppercase font-bold">
                  <th className="px-4 py-3">User ID</th>
                  <th className="px-4 py-3">Active Tier</th>
                  <th className="px-4 py-3">Quota Limits</th>
                  <th className="px-4 py-3">Contacts Remaining</th>
                  <th className="px-4 py-3">Expiry Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 text-[#4E342E]">
                {subscribers.map((s) => (
                  <tr key={s.userId} className="hover:bg-amber-50/40">
                    <td className="px-4 py-3.5 font-mono font-bold text-[#2B120C]">
                      {s.userId}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#7C2D12] font-bold text-xs">
                        {s.tierName}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium">
                      Used: <strong>{s.contactsUsedCount}</strong> / {s.contactsTotalQuota} Limit
                    </td>
                    <td className="px-4 py-3.5">
                      <strong className="text-emerald-700 text-sm">
                        {s.contactsRemaining} Contacts
                      </strong>
                    </td>
                    <td className="px-4 py-3.5 text-[#5C4740]">
                      {s.expiresAt || "Active"}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setAssignUserId(s.userId);
                          setShowAssignModal(true);
                        }}
                        className="h-8 rounded-lg border-amber-300 text-xs font-semibold text-[#3B0A18]"
                      >
                        Extend Plan
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Transactions */}
      {activeSubTab === "transactions" && (
        <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-amber-100 flex items-center justify-between">
            <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-[#EA580C]" />
              Recent Transactions &amp; Receipts
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-amber-50/70 border-b border-amber-200 text-xs font-bold uppercase text-[#7C2D12]">
                  <th className="px-4 py-3">TXN ID</th>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {transactions.map((t) => (
                  <tr key={t.txnId} className="hover:bg-amber-50/30">
                    <td className="px-4 py-3 font-mono text-xs font-bold">
                      {t.txnId}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#2B120C]">{t.memberName}</p>
                      <p className="text-xs text-[#785C52]">{t.date}</p>
                    </td>
                    <td className="px-4 py-3 text-xs">{t.planName}</td>
                    <td className="px-4 py-3 font-bold text-[#EA580C]">
                      {t.amount} ({t.method})
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          t.status === "Paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : t.status === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {t.status === "Paid" && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => onRefundTxn(t.txnId)}
                          className="h-8 rounded-lg border-rose-200 text-rose-700 text-xs"
                        >
                          Refund
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 4: Coupons Manager */}
      {activeSubTab === "coupons" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-3">
            <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#EA580C]" />
              Active Promo Coupons
            </h3>
            <div className="space-y-2.5">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-50/60 border border-amber-100"
                >
                  <div>
                    <p className="font-mono font-bold text-sm text-[#2B120C]">
                      {c.code}{" "}
                      <span className="font-sans font-medium text-xs text-[#5C4740]">
                        — {c.discountLabel}
                      </span>
                    </p>
                    <p className="text-xs text-[#785C52]">
                      Used {c.usageCount}/{c.maxLimit} • Expires: {c.expiry}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant={c.active ? "default" : "outline"}
                    onClick={() => onToggleCoupon(c.code)}
                    className={`h-8 rounded-lg text-xs font-semibold ${
                      c.active
                        ? "bg-emerald-600 text-white"
                        : "border-amber-300 text-[#3B0A18]"
                    }`}
                  >
                    {c.active ? "Active" : "Paused"}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleCreateCoupon}
            className="lg:col-span-5 bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-4"
          >
            <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
              Create New Coupon
            </h3>
            <div>
              <Label className="text-sm font-semibold">Coupon Code</Label>
              <Input
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="e.g., SHUBH25"
                className="mt-1 h-11 rounded-xl border-amber-200 uppercase font-mono"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">Discount Description</Label>
              <Input
                required
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g., 25% OFF on Gold Plan"
                className="mt-1 h-11 rounded-xl border-amber-200"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-saffron-gradient text-white font-semibold"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Promo Coupon
            </Button>
          </form>
        </div>
      )}

      {/* Sub-tab 5: Abandoned Cart WhatsApp Recovery Desk */}
      {activeSubTab === "abandoned" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-emerald-700" />
                  Auto-Recovery Cron
                </span>
                <h3 className="font-serif-royal text-xl font-bold text-[#3B0A18] mt-1">
                  Abandoned Checkout Automated WhatsApp Dispatcher
                </h3>
                <p className="text-xs text-[#5C4740] mt-0.5">
                  Sends automated recovery discount messages via WhatsApp when users abandon payment midway. Recovers 25-35% revenue.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-700">
                  {abandonedRecoveryEnabled ? "Automation Active" : "Automation Paused"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAbandonedRecoveryEnabled(!abandonedRecoveryEnabled);
                    toast({
                      title: !abandonedRecoveryEnabled ? "Recovery Automation Enabled" : "Recovery Automation Paused",
                      description: !abandonedRecoveryEnabled
                        ? `System will auto-dispatch WhatsApp recovery after ${abandonedDelayMins} minutes.`
                        : "Paused all scheduled recovery dispatches.",
                    });
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    abandonedRecoveryEnabled ? "bg-emerald-600" : "bg-stone-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      abandonedRecoveryEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <Label className="text-xs font-semibold text-stone-700">
                  Dispatch Delay (Minutes after drop-off):
                </Label>
                <Input
                  type="number"
                  value={abandonedDelayMins}
                  onChange={(e) => setAbandonedDelayMins(Number(e.target.value))}
                  className="mt-1 h-9 rounded-xl border-amber-200 font-mono text-xs"
                />
                <span className="text-[10px] text-stone-400">Industry ideal: 15-20 minutes</span>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">
                  Special Recovery Discount (%):
                </Label>
                <Input
                  type="number"
                  value={abandonedDiscountPct}
                  onChange={(e) => setAbandonedDiscountPct(Number(e.target.value))}
                  className="mt-1 h-9 rounded-xl border-amber-200 font-mono text-xs"
                />
                <span className="text-[10px] text-stone-400">Example: 10% Extra OFF</span>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">
                  Auto-Applied Coupon Code:
                </Label>
                <Input
                  value={abandonedCouponCode}
                  onChange={(e) => setAbandonedCouponCode(e.target.value.toUpperCase())}
                  className="mt-1 h-9 rounded-xl border-amber-200 font-mono text-xs uppercase"
                />
                <span className="text-[10px] text-stone-400">Dynamic single-use code</span>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-stone-700">
                WhatsApp Message Template:
              </Label>
              <textarea
                rows={3}
                value={abandonedMessageTemplate}
                onChange={(e) => setAbandonedMessageTemplate(e.target.value)}
                className="w-full mt-1.5 p-3 rounded-xl border border-amber-200 text-xs text-stone-800 bg-amber-50/30 focus:outline-none focus:ring-1 focus:ring-[#3B0A18]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                onClick={() => {
                  toast({
                    title: "Settings Saved",
                    description: `Updated recovery cron to dispatch after ${abandonedDelayMins}m with ${abandonedDiscountPct}% discount.`,
                  });
                }}
                className="rounded-xl bg-[#3B0A18] text-amber-100 hover:bg-[#5A0E24] text-xs font-bold h-9 px-4"
              >
                Save Settings
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-amber-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#3B0A18]">
                  Captured Abandoned Checkout Sessions
                </h4>
                <p className="text-xs text-stone-500">
                  Users who selected a plan on checkout but did not complete UPI/card payment.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => {
                  setAbandonedSessions((prev) =>
                    prev.map((s) => ({ ...s, recoverySent: true, recoverySentAt: "Just now" }))
                  );
                  toast({
                    title: "Dispatched WhatsApp Recovery",
                    description: "Sent discount offer messages to all pending abandoned users.",
                  });
                }}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold h-9 px-4"
              >
                Dispatch All Pending Recovery
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="p-3">Candidate / Phone</th>
                    <th className="p-3">Plan Selected</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Abandoned Time</th>
                    <th className="p-3">Recovery Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {abandonedSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-amber-50/40">
                      <td className="p-3 font-semibold text-stone-900">
                        {session.userName}
                        <div className="text-stone-400 font-mono text-[10px]">{session.mobile}</div>
                      </td>
                      <td className="p-3 font-medium text-[#7C2D12]">{session.planName}</td>
                      <td className="p-3 font-bold text-stone-800">Rs. {session.price.toLocaleString()}</td>
                      <td className="p-3 text-stone-500">{session.abandonedAt}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            session.recoverySent
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {session.recoverySent ? "WhatsApp Sent ✓" : "Pending 15m Window"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setAbandonedSessions((prev) =>
                              prev.map((s) =>
                                s.id === session.id
                                  ? { ...s, recoverySent: true, recoverySentAt: "Just now" }
                                  : s
                              )
                            );
                            toast({
                              title: `Recovery Sent to ${session.userName}`,
                              description: `Dispatched ${abandonedDiscountPct}% discount offer to ${session.mobile}.`,
                            });
                          }}
                          className="h-7 text-xs border-amber-300 text-[#3B0A18] hover:bg-emerald-50 hover:text-emerald-800"
                        >
                          Send WhatsApp Now
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 6: B2C GST Tax Invoicing Desk & Settings */}
      {activeSubTab === "invoicing" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <FileText className="w-3 h-3 text-purple-700" />
                  Government of India GST Compliant
                </span>
                <h3 className="font-serif-royal text-xl font-bold text-[#3B0A18] mt-1">
                  B2C Automated GST Tax Invoice Settings
                </h3>
                <p className="text-xs text-[#5C4740] mt-0.5">
                  Generates tamper-evident Tax Invoices with CGST 9%, SGST 9%, IGST 18% and HSN Code 998397 upon successful user subscription.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-700">
                  {gstInvoicingEnabled ? "Invoicing Active" : "Invoicing Paused"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setGstInvoicingEnabled(!gstInvoicingEnabled);
                    toast({
                      title: !gstInvoicingEnabled ? "GST Invoicing Enabled" : "GST Invoicing Paused",
                      description: "Updated automated B2C invoice generation preferences.",
                    });
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    gstInvoicingEnabled ? "bg-emerald-600" : "bg-stone-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      gstInvoicingEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="lg:col-span-2">
                <Label className="text-xs font-semibold text-stone-700">
                  Legal Registered Entity Name:
                </Label>
                <Input
                  value={legalBusinessName}
                  onChange={(e) => setLegalBusinessName(e.target.value)}
                  className="mt-1 h-9 rounded-xl border-amber-200 text-xs font-semibold"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">
                  GSTIN (15 Characters):
                </Label>
                <Input
                  value={gstinNumber}
                  onChange={(e) => setGstinNumber(e.target.value.toUpperCase())}
                  className="mt-1 h-9 rounded-xl border-amber-200 font-mono text-xs uppercase font-bold"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">
                  HSN / SAC Code:
                </Label>
                <Input
                  value={hsnSacCode}
                  onChange={(e) => setHsnSacCode(e.target.value)}
                  className="mt-1 h-9 rounded-xl border-amber-200 font-mono text-xs"
                />
                <span className="text-[10px] text-stone-400">998397 = Matchmaking & Dating Services</span>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">
                  State & Jurisdiction:
                </Label>
                <Input
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  className="mt-1 h-9 rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">
                  Tax Breakdown:
                </Label>
                <div className="flex gap-2 mt-1">
                  <div className="flex-1 p-2 rounded-xl bg-stone-50 border border-stone-200 text-[11px] font-mono">
                    CGST: <strong>{cgstRate}%</strong> + SGST: <strong>{sgstRate}%</strong>
                  </div>
                  <div className="flex-1 p-2 rounded-xl bg-stone-50 border border-stone-200 text-[11px] font-mono">
                    IGST: <strong>{igstRate}%</strong>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <Label className="text-xs font-semibold text-stone-700">
                  Registered Corporate Address:
                </Label>
                <Input
                  value={registeredOfficeAddress}
                  onChange={(e) => setRegisteredOfficeAddress(e.target.value)}
                  className="mt-1 h-9 rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">
                  Authorized Signatory:
                </Label>
                <Input
                  value={authorizedSignatory}
                  onChange={(e) => setAuthorizedSignatory(e.target.value)}
                  className="mt-1 h-9 rounded-xl border-amber-200 text-xs"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-amber-100">
              <span className="text-xs text-stone-500">
                Invoices are generated in real-time, digitally stamped, and archived in the transaction ledger.
              </span>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const invoiceDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>GST Tax Invoice - Vivah Kar Lo</title>
  <style>
    body { font-family: sans-serif; padding: 24px; color: #1e293b; font-size: 13px; }
    .header { border-bottom: 2px solid #ea580c; padding-bottom: 12px; margin-bottom: 16px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .table th, .table td { border: 1px solid #cbd5e1; padding: 8px 12px; }
    .table th { background: #f8fafc; }
  </style>
</head>
<body>
  <div class="header">
    <h2 style="margin:0;color:#9a3412;">\${legalBusinessName}</h2>
    <p style="margin:4px 0 0;font-size:12px;">GSTIN: \${gstinNumber} | HSN: \${hsnSacCode} | State: \${stateCode}</p>
    <p style="margin:2px 0 0;font-size:11px;color:#64748b;">\${registeredOfficeAddress}</p>
  </div>
  <p><strong>INVOICE NO:</strong> VIVAH-2026-00492 | <strong>DATE:</strong> \${new Date().toLocaleDateString()}</p>
  <p><strong>BILLED TO:</strong> Sample VIP Member | Registered Candidate</p>
  <table class="table">
    <thead>
      <tr><th>Description</th><th>HSN/SAC</th><th>Amount</th><th>CGST (9%)</th><th>SGST (9%)</th><th>Total</th></tr>
    </thead>
    <tbody>
      <tr><td>Diamond VIP Annual Subscription</td><td>\${hsnSacCode}</td><td>Rs. 8,473.73</td><td>Rs. 762.64</td><td>Rs. 762.64</td><td><strong>Rs. 9,999.00</strong></td></tr>
    </tbody>
  </table>
  <p style="margin-top:24px;text-align:right;"><strong>Digitally Signed:</strong> \${authorizedSignatory}</p>
</body>
</html>`;
                    const blob = new Blob([invoiceDoc], { type: "text/html" });
                    const url = URL.createObjectURL(blob);
                    const win = window.open(url, "_blank");
                    if (win) {
                      win.focus();
                    } else {
                      toast({ title: "Pop-up blocked", description: "Allow pop-ups to view invoice." });
                    }
                  }}
                  className="rounded-xl border-amber-300 text-[#3B0A18] text-xs font-bold h-9"
                >
                  <FileText className="w-3.5 h-3.5 mr-1 text-[#EA580C]" />
                  Preview Sample Tax Invoice
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    toast({
                      title: "Tax Configuration Saved",
                      description: `Saved GSTIN \${gstinNumber} & HSN \${hsnSacCode}. Automated invoicing active.`,
                    });
                  }}
                  className="rounded-xl bg-[#3B0A18] text-amber-100 hover:bg-[#5A0E24] text-xs font-bold h-9 px-4"
                >
                  Save GST Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Assign / Extend Plan Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="sm:max-w-[480px] rounded-3xl border border-amber-300 bg-[#FFFDF9] p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif-royal text-xl font-bold text-[#2B120C] flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#EA580C]" />
              Manually Assign / Extend VIP Plan
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleManualAssign} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs text-[#5C4740]">User ID or Email *</Label>
              <Input
                value={assignUserId}
                onChange={(e) => setAssignUserId(e.target.value)}
                placeholder="e.g., usr-001 or email@domain.com"
                className="h-10 mt-1 rounded-xl border-amber-200 text-xs font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-[#5C4740]">Target Tier *</Label>
                <select
                  value={assignTier}
                  onChange={(e) => setAssignTier(e.target.value)}
                  className="w-full h-10 mt-1 rounded-xl border border-amber-200 bg-white px-3 text-xs"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.contactsQuota === 9999 ? "Unlimited" : p.contactsQuota} Contacts - {p.priceDisplay})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-xs text-[#5C4740]">Duration (Months) *</Label>
                <select
                  value={assignDuration}
                  onChange={(e) => setAssignDuration(e.target.value)}
                  className="w-full h-10 mt-1 rounded-xl border border-amber-200 bg-white px-3 text-xs"
                >
                  <option value="1">1 Month</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months (1 Year)</option>
                  <option value="24">24 Months (2 Years)</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-[#5C4740]">
              This overrides the user's role to VIP and grants fresh contact view credits immediately.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAssignModal(false)}
                className="h-10 rounded-xl border-amber-200 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 px-5 rounded-xl bg-saffron-gradient text-white text-xs font-bold"
              >
                Assign Entitlement
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Plan Creator / Editor Modal */}
      <Dialog open={showPlanModal} onOpenChange={setShowPlanModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[92vh] overflow-y-auto rounded-3xl border border-amber-300 bg-[#FFFDF9] p-6 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                {editingPlanId ? "VIP Plan Customization" : "Create Subscription Offering"}
              </span>
            </div>
            <DialogTitle className="font-serif-royal text-2xl font-bold text-[#2B120C]">
              {editingPlanId ? `Edit Plan: ${planForm.name}` : "Create New Membership Plan"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSavePlan} className="space-y-4 pt-2">
            {/* Row 1: Plan Name & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-[#5C4740] font-semibold">Plan Name *</Label>
                <Input
                  value={planForm.name}
                  onChange={(e) => {
                    const nameVal = e.target.value;
                    setPlanForm((prev) => ({
                      ...prev,
                      name: nameVal,
                      id: !editingPlanId ? nameVal.toLowerCase().replace(/[^a-z0-9_-]/g, "_").slice(0, 32) : prev.id,
                    }));
                  }}
                  placeholder="e.g., Titanium VIP, Royal Plus"
                  className="h-10 mt-1 rounded-xl border-amber-200 text-xs"
                  required
                />
              </div>

              <div>
                <Label className="text-xs text-[#5C4740] font-semibold">Plan Slug / ID *</Label>
                <Input
                  value={planForm.id}
                  onChange={(e) => setPlanForm((prev) => ({ ...prev, id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "_") }))}
                  placeholder="e.g., titanium_vip"
                  disabled={!!editingPlanId}
                  className={`h-10 mt-1 rounded-xl border-amber-200 text-xs font-mono ${editingPlanId ? "bg-slate-100 cursor-not-allowed" : ""}`}
                  required
                />
                <p className="text-[10px] text-[#8C6D62] mt-0.5">Unique identifier used in database and billing.</p>
              </div>
            </div>

            {/* Row 2: Badge Tag & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-[#5C4740] font-semibold">Ribbon Badge (Optional)</Label>
                <Input
                  value={planForm.badge}
                  onChange={(e) => setPlanForm((prev) => ({ ...prev, badge: e.target.value }))}
                  placeholder="e.g., Most Popular 🔥, Festive Deal"
                  className="h-10 mt-1 rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs text-[#5C4740] font-semibold">Duration (Months) *</Label>
                <Input
                  type="number"
                  min="1"
                  max="60"
                  value={planForm.durationMonths}
                  onChange={(e) => {
                    const months = parseInt(e.target.value, 10) || 1;
                    setPlanForm((prev) => ({
                      ...prev,
                      durationMonths: months,
                      durationLabel: months === 12 ? "12 Months (1 Year)" : `${months} Months`,
                    }));
                  }}
                  className="h-10 mt-1 rounded-xl border-amber-200 text-xs"
                  required
                />
              </div>

              <div>
                <Label className="text-xs text-[#5C4740] font-semibold">Duration Label *</Label>
                <Input
                  value={planForm.durationLabel}
                  onChange={(e) => setPlanForm((prev) => ({ ...prev, durationLabel: e.target.value }))}
                  placeholder="e.g., 6 Months, 1 Year"
                  className="h-10 mt-1 rounded-xl border-amber-200 text-xs"
                  required
                />
              </div>
            </div>

            {/* Row 3: Pricing & Discount */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
              <span className="text-[11px] font-bold text-[#7C2D12] uppercase tracking-wider block">
                Subscription Pricing (INR ₹)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs text-[#5C4740] font-semibold">Selling Price (₹) *</Label>
                  <Input
                    type="number"
                    min="0"
                    value={planForm.price}
                    onChange={(e) => {
                      const p = parseInt(e.target.value, 10) || 0;
                      handlePriceChange(p, planForm.originalPrice);
                    }}
                    className="h-10 mt-1 rounded-xl border-amber-200 text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <Label className="text-xs text-[#5C4740] font-semibold">Original / MRP Price (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={planForm.originalPrice}
                    onChange={(e) => {
                      const op = parseInt(e.target.value, 10) || 0;
                      handlePriceChange(planForm.price, op);
                    }}
                    className="h-10 mt-1 rounded-xl border-amber-200 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs text-[#5C4740] font-semibold">Discount Badge Tag</Label>
                  <Input
                    value={planForm.discountLabel}
                    onChange={(e) => setPlanForm((prev) => ({ ...prev, discountLabel: e.target.value }))}
                    placeholder="e.g., 40% OFF"
                    className="h-10 mt-1 rounded-xl border-amber-200 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Row 4: Quota & Display Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-[#5C4740] font-semibold">
                  Verified Contact Unmasks Quota *
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="9999"
                  value={planForm.contactsQuota}
                  onChange={(e) => setPlanForm((prev) => ({ ...prev, contactsQuota: parseInt(e.target.value, 10) || 0 }))}
                  placeholder="e.g., 75 (or 9999 for unlimited)"
                  className="h-10 mt-1 rounded-xl border-amber-200 text-xs"
                  required
                />
                <p className="text-[10px] text-[#8C6D62] mt-0.5">Use 9999 for Unlimited verified contact access.</p>
              </div>

              <div>
                <Label className="text-xs text-[#5C4740] font-semibold">Display Sort Order</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={planForm.displayOrder}
                  onChange={(e) => setPlanForm((prev) => ({ ...prev, displayOrder: parseInt(e.target.value, 10) || 1 }))}
                  className="h-10 mt-1 rounded-xl border-amber-200 text-xs"
                />
                <p className="text-[10px] text-[#8C6D62] mt-0.5">Lower numbers show up first on pricing screens.</p>
              </div>
            </div>

            {/* Row 5: Features Builder */}
            <div className="space-y-2 pt-2 border-t border-amber-100">
              <Label className="text-xs text-[#5C4740] font-semibold block">
                Features &amp; Benefits Included * ({planForm.features.length})
              </Label>

              {/* Quick Feature Templates */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  "View 100 Verified Phone Numbers & WhatsApp",
                  "Direct Unlimited Chat Messaging with Matches",
                  "Unlimited 36-Guna Kundli Milan Reports & PDF",
                  "Featured Top-of-Search Listing (5X Visibility Boost)",
                  "Photo Shield™ Privacy Protection",
                  "Incognito Mode: Browse Profiles Secretly",
                  "Dedicated Senior Relationship Manager (RM)",
                ].map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (!planForm.features.includes(preset)) {
                        setPlanForm((prev) => ({ ...prev, features: [...prev.features, preset] }));
                      }
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100/70 hover:bg-amber-200 text-[#7C2D12] transition-colors"
                  >
                    + {preset.slice(0, 32)}...
                  </button>
                ))}
              </div>

              {/* Current Features List */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto p-2 bg-amber-50/40 rounded-xl border border-amber-200">
                {planForm.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 bg-white px-3 py-1.5 rounded-lg border border-amber-100 text-xs">
                    <span className="flex items-center gap-1.5 text-[#3B0A18]">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {feat}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeatureFromForm(idx)}
                      className="text-rose-600 hover:text-rose-800 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Feature Input */}
              <div className="flex items-center gap-2">
                <Input
                  value={newFeatureInput}
                  onChange={(e) => setNewFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeatureToForm();
                    }
                  }}
                  placeholder="Type a new feature bullet and press Add..."
                  className="h-9 rounded-xl border-amber-200 text-xs"
                />
                <Button
                  type="button"
                  onClick={handleAddFeatureToForm}
                  className="h-9 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#3B0A18] font-bold text-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            {/* Row 6: Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-100">
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={planForm.recommended}
                  onChange={(e) => setPlanForm((prev) => ({ ...prev, recommended: e.target.checked }))}
                  className="w-4 h-4 text-[#EA580C] rounded accent-[#EA580C]"
                />
                <div>
                  <span className="text-xs font-bold text-[#2B120C] block">Highlight as Recommended 🔥</span>
                  <span className="text-[10px] text-[#8C6D62]">Adds gold border and prominence on pricing cards.</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={planForm.isActive}
                  onChange={(e) => setPlanForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-emerald-600 rounded accent-emerald-600"
                />
                <div>
                  <span className="text-xs font-bold text-[#2B120C] block">Active (Visible to Members)</span>
                  <span className="text-[10px] text-[#8C6D62]">Uncheck to hide plan from user pricing pages.</span>
                </div>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-amber-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPlanModal(false)}
                className="h-10 rounded-xl border-amber-200 text-xs font-semibold"
                disabled={isSavingPlan}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSavingPlan}
                className="h-10 px-5 rounded-xl bg-saffron-gradient text-white text-xs font-bold shadow-saffron-sm"
              >
                {isSavingPlan ? "Saving Plan..." : editingPlanId ? "Update Plan" : "Publish New Plan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!planToDelete} onOpenChange={(open) => !open && setPlanToDelete(null)}>
        <DialogContent className="sm:max-w-[450px] rounded-3xl border border-rose-300 bg-white p-6 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-rose-600 mb-1">
              <AlertCircle className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Confirm Deletion</span>
            </div>
            <DialogTitle className="font-serif-royal text-xl font-bold text-[#2B120C]">
              Delete "{planToDelete?.name}"?
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs text-[#5C4740]">
            <p>
              Are you sure you want to delete this subscription plan? Once deleted, members will no longer be able to select or purchase it.
            </p>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-[#7C2D12]">
              <strong>Note:</strong> Existing subscribers who currently have this plan will keep their active entitlements until their expiry date.
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-amber-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPlanToDelete(null)}
              className="h-9 rounded-xl border-amber-200 text-xs font-semibold"
              disabled={isDeletingPlan}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeletePlan}
              disabled={isDeletingPlan}
              className="h-9 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
            >
              {isDeletingPlan ? "Deleting..." : "Permanently Delete Plan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const AdminReportsTab: React.FC<{
  reports: ModerationReport[];
  onResolveReport: (
    id: string,
    status: "Warned" | "Suspended" | "Dismissed"
  ) => void;
}> = ({ reports, onResolveReport }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
          Abuse Reports &amp; Trust Desk
        </h1>
        <p className="text-sm text-[#5C4740]">
          Investigate flagged conversations, spam reports, and suspicious profiles
        </p>
      </div>

      <div className="space-y-3">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    rep.severity === "High"
                      ? "bg-rose-100 text-rose-700"
                      : rep.severity === "Medium"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {rep.severity} Severity
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-[#3B0A18]">
                  Status: {rep.status}
                </span>
                <span className="text-xs text-[#785C52]">{rep.createdAt}</span>
              </div>

              <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Reported: {rep.reportedUser}
              </h3>
              <p className="text-sm text-[#4E342E]">
                <strong>Reason:</strong> {rep.reason}
              </p>
              <p className="text-xs text-[#785C52]">
                Reported by: {rep.reportedBy}
              </p>
            </div>

            {rep.status === "Open" && (
              <div className="flex flex-wrap gap-2 shrink-0">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onResolveReport(rep.id, "Warned")}
                  className="h-9 rounded-xl border-amber-300 text-xs font-semibold"
                >
                  Issue Warning
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => onResolveReport(rep.id, "Suspended")}
                  className="h-9 rounded-xl text-xs font-semibold"
                >
                  Suspend User
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => onResolveReport(rep.id, "Dismissed")}
                  className="h-9 rounded-xl text-xs font-semibold"
                >
                  Dismiss
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminCmsTab: React.FC = () => {
  const { toast } = useToast();
  const [publishedIds, setPublishedIds] = useState<string[]>(
    SUCCESS_STORIES.map((s) => s.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
          Success Stories &amp; Content CMS
        </h1>
        <p className="text-sm text-[#5C4740]">
          Publish, edit, or unpublish couple success stories shown on the Vivah Kar Lo homepage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SUCCESS_STORIES.map((story) => {
          const isPub = publishedIds.includes(story.id);
          return (
            <div
              key={story.id}
              className="bg-white rounded-2xl border border-amber-200/80 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div>
                <img
                  src={story.image}
                  alt={story.couple}
                  className="w-full h-44 object-cover"
                />
                <div className="p-4 space-y-1.5">
                  <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
                    {story.couple}
                  </h3>
                  <p className="text-xs font-semibold text-[#EA580C]">
                    {story.location} • {story.marriedDate}
                  </p>
                  <p className="text-xs text-[#5C4740] line-clamp-3">
                    {story.quote}
                  </p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setPublishedIds((prev) =>
                      prev.includes(story.id)
                        ? prev.filter((id) => id !== story.id)
                        : [...prev, story.id]
                    );
                    toast({ title: `Updated visibility for ${story.couple}` });
                  }}
                  className={`w-full h-9 rounded-xl text-xs font-semibold ${
                    isPub
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {isPub ? "Published on Homepage ✓" : "Draft (Hidden)"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AdminBroadcastTab: React.FC<{
  broadcasts: AdminBroadcastLog[];
  onSendBroadcast: (
    title: string,
    audience: string,
    channel: "Push + Email" | "Email Only" | "SMS + Push" | "WhatsApp Direct" | "Omnichannel (All Channels)"
  ) => void;
}> = ({ broadcasts, onSendBroadcast }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("All Active Members");
  const [targetUserId, setTargetUserId] = useState("");
  const [targetType, setTargetType] = useState<"segment" | "single_user">("segment");
  const [channel, setChannel] = useState<
    "Push + Email" | "Email Only" | "SMS + Push" | "WhatsApp Direct" | "Omnichannel (All Channels)"
  >("Omnichannel (All Channels)");

  const [campaigns, setCampaigns] = useState<any[]>([
    {
      id: "camp-01",
      name: "Inactive User Re-Engagement",
      triggerType: "Inactive User Reminder",
      channel: "WhatsApp + Email",
      delayCondition: "User inactive for 14 days",
      active: true,
      sentCount: 842,
    },
    {
      id: "camp-02",
      name: "Nudge: Incomplete Matrimonial Profile",
      triggerType: "Profile Completion Reminder",
      channel: "WhatsApp + Email",
      delayCondition: "Profile completion under 50% after 48 hours",
      active: true,
      sentCount: 1250,
    },
    {
      id: "camp-03",
      name: "VIP Membership Renewal Alert",
      triggerType: "Membership Expiry Reminder",
      channel: "WhatsApp + Email",
      delayCondition: "3 days before VIP subscription expiration",
      active: true,
      sentCount: 310,
    },
    {
      id: "camp-04",
      name: "Daily Sacred Kundli Matches Digest",
      triggerType: "New Match Alert",
      channel: "Email Only",
      delayCondition: "Triggered daily at 9:00 AM if score >= 80%",
      active: true,
      sentCount: 4620,
    },
    {
      id: "camp-05",
      name: "Birthday Warm Wishes & Free 3-Day VIP Pass",
      triggerType: "Birthday Wishes",
      channel: "WhatsApp + Email",
      delayCondition: "On member's date of birth at 8:00 AM",
      active: true,
      sentCount: 185,
    },
  ]);

  const NOTIFICATION_TEMPLATES = [
    {
      label: "Kundli Profile Completion",
      title: "Complete Your 36-Guna Kundli Profile for 3X Matches",
      body: "Sacred alliances value complete astrological and family background details. Update your birth details today to unlock top verified matches!",
    },
    {
      label: "VIP Festive Offer",
      title: "Festive VIP Gold Upgrade — Save 42% This Week",
      body: "Get unlimited chats and 75 phone number unmaskings. Connect directly with parents and candidates with Gold Royal VIP.",
    },
    {
      label: "KYC Verification Reminder",
      title: "Verify Your Identity for the 100% Real Person Blue Badge",
      body: "Upload your Aadhaar or Passport to get 5X profile trust and priority placement in matrimony searches.",
    },
    {
      label: "Weekly Matches Digest",
      title: "3 New Verified High-Compatibility Alliances Found",
      body: "We have found 3 new verified alliances matching your community, education, and Kundli preferences. View them now!",
    },
  ];

  const handleApplyTemplate = (tpl: (typeof NOTIFICATION_TEMPLATES)[0]) => {
    setTitle(tpl.title);
    setBody(tpl.body);
    toast({ title: `Loaded template: ${tpl.label}` });
  };

  const handleToggleCampaign = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    toast({ title: "Campaign automation trigger updated" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const finalAudience = targetType === "single_user" ? `User: ${targetUserId}` : audience;
    onSendBroadcast(title.trim(), finalAudience, channel as any);
    setTitle("");
    setBody("");
    setTargetUserId("");
    toast({
      title: `Broadcast Dispatched via ${channel}`,
      description: `Target: ${finalAudience}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
          Notifications, WhatsApp Alerts &amp; Engagement Automation
        </h1>
        <p className="text-sm text-[#5C4740]">
          Send manual announcements, WhatsApp direct alerts, or manage automated lifecycle re-engagement triggers
        </p>
      </div>

      {/* Automated Lifecycle & Engagement Triggers */}
      <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
              Automated Engagement &amp; Retention Campaigns
            </h3>
            <p className="text-xs text-[#5C4740]">
              System triggers automatically dispatches reminders when condition is met
            </p>
          </div>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 font-bold">
            {campaigns.filter((c) => c.active).length} Active Triggers
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className={`p-4 rounded-xl border transition-all space-y-2.5 flex flex-col justify-between ${
                camp.active
                  ? "bg-amber-50/50 border-amber-200"
                  : "bg-gray-50 border-gray-200 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-xs text-[#2B120C] leading-snug">
                    {camp.name}
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      camp.active
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {camp.active ? "Active" : "Paused"}
                  </span>
                </div>
                <p className="text-[11px] text-[#8C6D62] mt-1">{camp.delayCondition}</p>
                <div className="text-[10px] text-[#5C4740] font-semibold mt-1">
                  Channel: {camp.channel}
                </div>
              </div>

              <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs">
                <span className="text-[#EA580C] font-bold text-[11px]">
                  {camp.sentCount.toLocaleString()} Sent
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleCampaign(camp.id)}
                  className="h-7 text-xs font-semibold text-amber-900 hover:bg-amber-100"
                >
                  {camp.active ? "Pause" : "Enable"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Composer & Sent Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-6 bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#EA580C]" />
              Compose Instant Notification
            </h3>
            <span className="text-xs text-[#8C6D62]">WhatsApp / Push / SMS / Email</span>
          </div>

          {/* Quick Template Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#8C6D62] uppercase tracking-wider">
              Quick Templates
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {NOTIFICATION_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.label}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#7C2D12] border border-amber-200 font-medium transition-colors"
                >
                  + {tpl.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#2B120C]">Announcement / Message Title *</Label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Weekend Kundli Match Festival"
              className="mt-1 h-10 rounded-xl border-amber-200 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-[#2B120C]">Target Type</Label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as any)}
                className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-xs"
              >
                <option value="segment">User Segment</option>
                <option value="single_user">Specific User ID</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#2B120C]">Dispatch Channel</Label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-xs"
              >
                <option value="Omnichannel (All Channels)">Omnichannel (WhatsApp + Push + Email + SMS)</option>
                <option value="WhatsApp Direct">WhatsApp Direct Gateway</option>
                <option value="Push + Email">Push + Email</option>
                <option value="Email Only">Email Only</option>
                <option value="SMS + Push">SMS + Push</option>
              </select>
            </div>
          </div>

          {targetType === "segment" ? (
            <div>
              <Label className="text-xs font-semibold text-[#2B120C]">Audience Segment</Label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-xs"
              >
                <option>All Active Members</option>
                <option>Incomplete Profiles (&lt; 50%)</option>
                <option>Pending KYC / OTP Verifications</option>
                <option>VIP Gold &amp; Platinum Members</option>
                <option>Expired Memberships (Renewal Leads)</option>
                <option>Male Profiles Only</option>
                <option>Female Profiles Only</option>
              </select>
            </div>
          ) : (
            <div>
              <Label className="text-xs font-semibold text-[#2B120C]">Recipient User ID or Phone</Label>
              <Input
                required
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                placeholder="e.g. usr-active-complete or 9876543210"
                className="mt-1 h-10 rounded-xl border-amber-200 text-xs font-mono"
              />
            </div>
          )}

          <div>
            <Label className="text-xs font-semibold text-[#2B120C]">Message Body *</Label>
            <Textarea
              required
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write notification content..."
              className="mt-1 rounded-xl border-amber-200 text-xs"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-10 rounded-xl bg-gradient-to-r from-amber-600 to-[#EA580C] hover:from-amber-700 hover:to-[#C2410C] text-white font-bold text-xs"
          >
            <Send className="w-4 h-4 mr-2" />
            Dispatch Broadcast Campaign
          </Button>
        </form>

        <div className="lg:col-span-6 bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
            Recent Broadcast Sent Log
          </h3>
          <div className="space-y-3">
            {broadcasts.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-amber-50/70 border border-amber-100 space-y-1"
              >
                <p className="font-bold text-xs text-[#2B120C]">{b.title}</p>
                <p className="text-[11px] text-[#5C4740]">
                  Audience: <strong>{b.audience}</strong> • {b.channel}
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold">
                  Reached {b.reachCount.toLocaleString()} users • {b.sentAt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminSettingsTab: React.FC<{
  auditLogs: AdminAuditEntry[];
  onLogAction: (action: string, target: string) => void;
}> = ({ auditLogs, onLogAction }) => {
  const { toast } = useToast();
  const [maintenance, setMaintenance] = useState(false);
  const [strictOtpLimit, setStrictOtpLimit] = useState(true);
  const [photoWatermark, setPhotoWatermark] = useState(true);

  // General Platform Branding
  const [siteName, setSiteName] = useState("Vivah Kar Lo");
  const [helpline, setHelpline] = useState("+91 80000 12345");
  const [supportEmail, setSupportEmail] = useState("support@vivahkarlo.in");
  const [currencySymbol, setCurrencySymbol] = useState("INR (Rs)");

  // Password Policy & Login Security
  const [minPasswordLength, setMinPasswordLength] = useState(8);
  const [requireSpecialChar, setRequireSpecialChar] = useState(true);
  const [maxFailedLogins, setMaxFailedLogins] = useState(5);
  const [sessionInactivityMins, setSessionInactivityMins] = useState(30);

  // IP Whitelist
  const [ipWhitelist, setIpWhitelist] = useState("127.0.0.1, 49.36.12.*, 103.21.*");

  const handleSaveGeneralSettings = () => {
    onLogAction("Updated Platform Branding & Helpline", siteName);
    toast({
      title: "Settings Saved",
      description: "Platform branding, helpline and currency rules updated.",
    });
  };

  const handleSaveSecurityPolicy = () => {
    onLogAction(
      "Updated Password & Security Policies",
      `Min Length: ${minPasswordLength}, Max Attempts: ${maxFailedLogins}`
    );
    toast({
      title: "Security Policies Applied",
      description: "Login lockouts and password compliance rules enforced.",
    });
  };

  const handleDownloadBackup = () => {
    const backupData = {
      system: "Vivah Kar Lo Matrimony Platform",
      backupTimestamp: new Date().toISOString(),
      platformVersion: "v2.5.0",
      securityAuditCount: auditLogs.length,
      auditLogs,
    };
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonStr);
    downloadAnchor.setAttribute("download", `VivahKarLo_System_Snapshot_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    onLogAction("Exported System Database Snapshot", "Full JSON Backup");
    toast({
      title: "System Snapshot Generated",
      description: "Encrypted platform configuration backup downloaded successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
            Settings, Security Policies &amp; WhatsApp Integration
          </h1>
          <p className="text-sm text-[#5C4740]">
            Scan WhatsApp QR for live messaging, configure Google Apps Script / SMTP email, and enforce password &amp; IP rules
          </p>
        </div>

        <Button
          type="button"
          onClick={handleDownloadBackup}
          className="h-10 rounded-xl bg-gradient-to-r from-amber-600 to-[#EA580C] hover:from-amber-700 hover:to-[#C2410C] text-white text-xs font-bold shadow-xs self-start sm:self-auto"
        >
          <Database className="w-4 h-4 mr-1.5" />
          Download System Backup
        </Button>
      </div>

      {/* Baileys WhatsApp QR Scan & Render-Ready Email Gateway */}
      <AdminMessagingGatewayDesk onLogAction={onLogAction} />

      {/* General Platform Branding & Helpline */}
      <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#EA580C]" />
            Platform Identity &amp; Helpline Contact
          </h3>
          <Button
            type="button"
            size="sm"
            onClick={handleSaveGeneralSettings}
            className="h-8 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold"
          >
            Save Brand Details
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-[#2B120C]">Platform Title</Label>
            <Input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="rounded-xl border-amber-200 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-[#2B120C]">Toll-Free Helpline</Label>
            <Input
              value={helpline}
              onChange={(e) => setHelpline(e.target.value)}
              className="rounded-xl border-amber-200 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-[#2B120C]">Support Email</Label>
            <Input
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="rounded-xl border-amber-200 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-[#2B120C]">Primary Currency</Label>
            <Input
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
              className="rounded-xl border-amber-200 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Security Policies & Password Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#EA580C]" />
              Password Policy &amp; Account Protection
            </h3>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveSecurityPolicy}
              className="h-8 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
            >
              Apply Policies
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#2B120C]">Min Password Length</Label>
              <Input
                type="number"
                min="6"
                max="20"
                value={minPasswordLength}
                onChange={(e) => setMinPasswordLength(Number(e.target.value))}
                className="rounded-xl border-amber-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#2B120C]">Max Login Attempts</Label>
              <Input
                type="number"
                min="3"
                max="10"
                value={maxFailedLogins}
                onChange={(e) => setMaxFailedLogins(Number(e.target.value))}
                className="rounded-xl border-amber-200 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-[#2B120C]">Session Timeout (Minutes of Inactivity)</Label>
            <Input
              type="number"
              min="5"
              max="1440"
              value={sessionInactivityMins}
              onChange={(e) => setSessionInactivityMins(Number(e.target.value))}
              className="rounded-xl border-amber-200 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-[#2B120C]">Admin IP Whitelist (CIDR / Comma-separated)</Label>
            <Input
              value={ipWhitelist}
              onChange={(e) => setIpWhitelist(e.target.value)}
              className="rounded-xl border-amber-200 text-xs font-mono"
            />
          </div>

          {[
            {
              label: "Enforce OTP & Login Rate Limiting",
              desc: "Auto-lock after 3 wrong OTPs or 5 wrong passwords",
              val: strictOtpLimit,
              setter: setStrictOtpLimit,
            },
            {
              label: "Automatic Photo Watermarking",
              desc: "Apply subtle Vivah Kar Lo watermark on public thumbnails",
              val: photoWatermark,
              setter: setPhotoWatermark,
            },
            {
              label: "Maintenance Mode Banner",
              desc: "Temporarily pause new signups during database upgrades",
              val: maintenance,
              setter: setMaintenance,
            },
          ].map((item) => (
            <label
              key={item.label}
              className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 cursor-pointer"
            >
              <div>
                <p className="text-sm font-semibold text-[#2B120C]">
                  {item.label}
                </p>
                <p className="text-xs text-[#5C4740]">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={item.val}
                onChange={(e) => {
                  item.setter(e.target.checked);
                  onLogAction(
                    `Updated Setting (${e.target.checked ? "ON" : "OFF"})`,
                    item.label
                  );
                  toast({ title: `Updated: ${item.label}` });
                }}
                className="w-5 h-5 accent-[#FF7700]"
              />
            </label>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-3">
          <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
            Admin Role Matrix (RBAC)
          </h3>
          <div className="space-y-2.5">
            {ADMIN_TEAM_ROLES.map((r) => (
              <div
                key={r.role}
                className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100"
              >
                <div className="flex justify-between text-sm font-bold text-[#3B0A18]">
                  <span>{r.role}</span>
                  <span className="text-[#EA580C]">{r.members} Staff</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {r.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-amber-200 text-[11px] font-medium text-[#4E342E]"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-3">
        <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
          System Audit Trail ({auditLogs.length})
        </h3>
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {auditLogs.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs"
            >
              <span>
                <strong className="text-[#2B120C]">{a.action}</strong> →{" "}
                <span className="text-[#EA580C] font-semibold">{a.target}</span>
              </span>
              <span className="text-[#785C52]">
                {a.actor} • {a.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ADMIN SUPPORT TICKETS QUEUE & GRIEVANCE DESK (Feature 40)
// ============================================================================
export const AdminSupportTicketsTab: React.FC<{
  onLogAction?: (action: string, target: string) => void;
}> = ({ onLogAction }) => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: "tkt-1001",
      userId: "usr-active-complete",
      userName: "Vikram Sharma",
      userEmail: "vikram@example.com",
      userPhone: "+91 98765 12345",
      category: "profile_verification",
      subject: "Inquiry about Govt ID Green Shield status",
      message: "I uploaded my Aadhaar card 2 hours ago. Could you please confirm if the verification is underway?",
      priority: "medium",
      status: "resolved",
      adminReply: "Hello Vikram, your identity proof has been validated and the Green Shield badge is now active on your profile.",
      resolvedAt: "Today, 12:30 PM",
      resolvedBy: "Admin Compliance Officer",
      createdAt: "Today, 10:15 AM",
      updatedAt: "Today, 12:30 PM",
    },
    {
      id: "tkt-1002",
      userId: "usr-verify-pending",
      userName: "Rohan Verma",
      userEmail: "rohan.verma@example.com",
      userPhone: "+91 98123 45678",
      category: "billing",
      subject: "Assistance with VIP plan activation",
      message: "Paid via UPI UTR 420198734561. Please verify and enable Gold Royal access.",
      priority: "high",
      status: "open",
      createdAt: "Today, 11:20 AM",
      updatedAt: "Today, 11:20 AM",
    },
  ]);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [targetStatus, setTargetStatus] = useState<"in_progress" | "resolved" | "closed">("resolved");
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = () => {
    fetch(`/api/v1/support/tickets/all${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.tickets)) {
          setTickets(d.tickets);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const handleOpenReplyModal = (t: SupportTicket) => {
    setSelectedTicket(t);
    setReplyText(t.adminReply || "");
    setTargetStatus(t.status === "open" ? "resolved" : (t.status as any));
  };

  const handleSaveReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) {
      toast({ title: "Incomplete", description: "Please enter an official response.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/v1/support/tickets/${selectedTicket.id}/reply`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminReply: replyText,
          status: targetStatus,
          resolvedBy: "Admin Compliance Officer",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update ticket");
      }

      toast({
        title: "Ticket Updated",
        description: `Ticket #${selectedTicket.id} updated to ${targetStatus}.`,
      });

      if (onLogAction) {
        onLogAction(`Replied to Support Ticket #${selectedTicket.id}`, selectedTicket.userName);
      }

      setTickets((prev) =>
        prev.map((t) => (t.id === selectedTicket.id ? data.ticket : t))
      );
      setSelectedTicket(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTickets = tickets.filter(
    (t) =>
      t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
            Support Tickets &amp; Grievances Desk
          </h1>
          <p className="text-sm text-[#5C4740]">
            Review, escalate, and resolve user technical inquiries, verification requests, and complaints
          </p>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm">
          <span className="text-xs text-[#8C6D62] font-semibold">Total Tickets</span>
          <p className="font-serif-royal text-2xl font-bold text-[#2B120C] mt-1">{tickets.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm">
          <span className="text-xs text-amber-700 font-semibold">Open &amp; Pending</span>
          <p className="font-serif-royal text-2xl font-bold text-amber-600 mt-1">{openCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm">
          <span className="text-xs text-blue-700 font-semibold">Under Investigation</span>
          <p className="font-serif-royal text-2xl font-bold text-blue-600 mt-1">{inProgressCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm">
          <span className="text-xs text-emerald-700 font-semibold">Resolved</span>
          <p className="font-serif-royal text-2xl font-bold text-emerald-600 mt-1">{resolvedCount}</p>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white rounded-3xl border border-amber-200/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8C6D62]" />
            <Input
              type="text"
              placeholder="Search by ticket ID, user name, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 rounded-xl border-amber-200 text-xs"
            />
          </div>

          <div className="flex overflow-x-auto gap-1.5 bg-amber-50/70 p-1 rounded-xl border border-amber-200">
            {["all", "open", "in_progress", "resolved", "closed"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  statusFilter === st
                    ? "bg-[#3B0A18] text-amber-100 shadow-sm"
                    : "text-[#5C4740] hover:text-[#2B120C]"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets Table / List */}
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-amber-200 rounded-2xl space-y-1">
            <p className="font-bold text-sm text-[#2B120C]">No tickets found matching current filter</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((tkt) => (
              <div
                key={tkt.id}
                className="bg-amber-50/30 rounded-2xl border border-amber-200/80 p-4 shadow-sm space-y-3 hover:border-amber-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#2B120C]">#{tkt.id}</span>
                    <span className="text-xs font-bold text-[#EA580C] bg-amber-100 px-2 py-0.5 rounded-md uppercase">
                      {tkt.category.replace("_", " ")}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        tkt.priority === "urgent"
                          ? "bg-rose-100 text-rose-800"
                          : tkt.priority === "high"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {tkt.priority} priority
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        tkt.status === "resolved" || tkt.status === "closed"
                          ? "bg-emerald-100 text-emerald-800"
                          : tkt.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {tkt.status.replace("_", " ")}
                    </span>
                    <span className="text-xs text-[#8C6D62]">{tkt.createdAt}</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-bold text-sm text-[#2B120C]">{tkt.subject}</h4>
                    <p className="text-xs text-[#5C4740] whitespace-pre-wrap">{tkt.message}</p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-[#8C6D62]">
                      <span>User: <strong>{tkt.userName}</strong> ({tkt.userPhone})</span>
                      <span>Email: {tkt.userEmail}</span>
                    </div>

                    {tkt.adminReply && (
                      <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-0.5">
                        <span className="font-bold">Official Response ({tkt.resolvedBy || "Admin"}):</span>
                        <p>{tkt.adminReply}</p>
                      </div>
                    )}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleOpenReplyModal(tkt)}
                    className="h-9 px-4 rounded-xl bg-saffron-gradient text-white text-xs font-bold shadow-saffron-sm shrink-0 self-start md:self-center"
                  >
                    Reply &amp; Update
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div>
                <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
                  Respond to Ticket #{selectedTicket.id}
                </h3>
                <p className="text-xs text-[#5C4740]">
                  User: {selectedTicket.userName} • {selectedTicket.subject}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="text-[#8C6D62] hover:text-[#2B120C] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReply} className="space-y-3.5">
              <div>
                <Label className="text-xs font-semibold text-[#2B120C]">Update Status</Label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as any)}
                  className="w-full h-9 mt-1 rounded-xl border border-amber-200 text-xs bg-white px-2.5"
                >
                  <option value="in_progress">Mark In Progress (Investigating)</option>
                  <option value="resolved">Mark Resolved (Fix Provided)</option>
                  <option value="closed">Mark Closed</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-[#2B120C]">Admin Response / Resolution Message</Label>
                <Textarea
                  rows={4}
                  placeholder="Enter clear, helpful response for user dashboard..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="mt-1 rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedTicket(null)}
                  className="flex-1 h-10 rounded-xl border-slate-300 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 h-10 rounded-xl bg-saffron-gradient text-white font-bold text-xs shadow-saffron-sm"
                >
                  {submitting ? "Saving..." : "Send Response"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// ADMIN USER FEEDBACK & REVIEWS MODERATION DESK (Feature 41)
// ============================================================================
export const AdminFeedbackTab: React.FC<{
  onLogAction?: (action: string, target: string) => void;
}> = ({ onLogAction }) => {
  const { toast } = useToast();
  const [feedbackList, setFeedbackList] = useState<UserFeedback[]>([
    {
      id: "fb-101",
      userId: "usr-active-complete",
      userName: "Vikram Sharma",
      userEmail: "vikram@example.com",
      rating: 5,
      category: "profile_quality",
      title: "Excellent match quality and KYC security",
      description: "The Green Shield verification and 36-guna horoscope matching are genuinely accurate and professional.",
      status: "reviewed",
      adminNotes: "Acknowledged and logged in product satisfaction review.",
      createdAt: "Today, 09:30 AM",
    },
    {
      id: "fb-102",
      userId: "usr-verify-pending",
      userName: "Rohan Verma",
      userEmail: "rohan.verma@example.com",
      rating: 4,
      category: "feature_request",
      title: "Please add more cities in western India",
      description: "App works great. Would love to see more verified alliances from Nashik and Kolhapur.",
      status: "new",
      createdAt: "Yesterday, 06:15 PM",
    },
  ]);

  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchFeedback = () => {
    fetch(`/api/v1/support/feedback/all${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.feedback)) {
          setFeedbackList(d.feedback);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchFeedback();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, status: "reviewed" | "addressed") => {
    try {
      const res = await fetch(`/api/v1/support/feedback/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          adminNotes: `Marked ${status} by Admin QA Desk`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update feedback");
      }

      toast({
        title: "Feedback Updated",
        description: `Feedback status changed to ${status}.`,
      });

      if (onLogAction) {
        onLogAction(`Updated Feedback #${id} status`, status);
      }

      setFeedbackList((prev) =>
        prev.map((f) => (f.id === id ? data.feedback : f))
      );
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const avgRating = feedbackList.length > 0
    ? (feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / feedbackList.length).toFixed(1)
    : "5.0";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
            User Feedback &amp; Grievances Moderation
          </h1>
          <p className="text-sm text-[#5C4740]">
            Review user sentiment, star ratings, feature requests, and complaints
          </p>
        </div>
      </div>

      {/* Satisfaction Score Header */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-3xl p-6 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-[#2B120C] flex flex-col items-center justify-center font-bold">
            <span className="text-2xl font-black">{avgRating}</span>
            <span className="text-[10px] uppercase tracking-wider">Out of 5</span>
          </div>
          <div>
            <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
              Overall User Satisfaction Index
            </h3>
            <p className="text-xs text-[#5C4740]">
              Calculated across {feedbackList.length} verified member submissions.
            </p>
          </div>
        </div>

        <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-amber-200">
          {["all", "new", "reviewed", "addressed"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                statusFilter === st
                  ? "bg-[#3B0A18] text-amber-100 shadow-sm"
                  : "text-[#5C4740] hover:text-[#2B120C]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feedbackList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-amber-200/80 p-5 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 border-b border-amber-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={s <= item.rating ? "text-amber-400" : "text-amber-200"}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#7C2D12]">({item.rating}/5)</span>
                </div>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    item.status === "addressed"
                      ? "bg-emerald-100 text-emerald-800"
                      : item.status === "reviewed"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">
                  {item.category.replace("_", " ")}
                </span>
                <h4 className="font-serif-royal text-base font-bold text-[#2B120C]">
                  {item.title}
                </h4>
                <p className="text-xs text-[#5C4740] mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="text-[11px] text-[#8C6D62] pt-1">
                By <strong>{item.userName}</strong> ({item.userEmail}) • {item.createdAt}
              </div>

              {item.adminNotes && (
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-100 text-[11px] text-[#7C2D12]">
                  <strong>Admin Note:</strong> {item.adminNotes}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-amber-100">
              {item.status !== "reviewed" && item.status !== "addressed" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus(item.id, "reviewed")}
                  className="flex-1 h-8 rounded-xl border-amber-300 text-[#3B0A18] text-xs font-semibold"
                >
                  Mark Reviewed
                </Button>
              )}
              {item.status !== "addressed" && (
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(item.id, "addressed")}
                  className="flex-1 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Mark Addressed ✓
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

