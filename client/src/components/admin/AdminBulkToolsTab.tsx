import React, { useState, useMemo } from "react";
import {
  Users,
  CheckSquare,
  Square,
  MinusSquare,
  ShieldAlert,
  UserCheck,
  UserX,
  Send,
  Crown,
  FileDown,
  Trash2,
  Tag,
  Search,
  Filter,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Smartphone,
  Info,
  Layers,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AccountBundle } from "@/data/mockAccounts";

interface AdminBulkToolsTabProps {
  accounts: AccountBundle[];
  onUpdateAccount?: (userId: string, patch: any) => void;
  onDeleteAccount?: (userId: string) => void;
}

export default function AdminBulkToolsTab({
  accounts,
  onUpdateAccount,
  onDeleteAccount,
}: AdminBulkToolsTabProps) {
  const { toast } = useToast();

  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [membershipFilter, setMembershipFilter] = useState<string>("all");

  // Active bulk modals
  const [activeModal, setActiveModal] = useState<
    | null
    | "notification"
    | "membership"
    | "suspend"
    | "category"
    | "export"
    | "delete"
    | "festival"
  >(null);

  // Festival greeting states
  const [festivalGreetingName, setFestivalGreetingName] = useState(
    "Diwali Shubh Vivah Wishes"
  );
  const [festivalGreetingBody, setFestivalGreetingBody] = useState(
    "Wishing you and your family an auspicious, joyful festive season! May this divine occasion bring the blessing of a lifelong, prosperous matrimonial union. Explore special festive matches curated for you on Vivah Kar Lo."
  );

  // Modal payload states
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyBody, setNotifyBody] = useState("");
  const [notifyChannel, setNotifyChannel] = useState<
    "in_app" | "whatsapp" | "email"
  >("in_app");

  const [selectedPlan, setSelectedPlan] = useState<string>("Platinum");
  const [planDurationMonths, setPlanDurationMonths] = useState<number>(3);

  const [suspendReason, setSuspendReason] = useState<string>(
    "Profile Information Verification Inconsistency"
  );
  const [targetCategory, setTargetCategory] = useState<string>("Featured");

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Filter candidates
  const filteredUsers = useMemo(() => {
    return accounts.filter((acc) => {
      const name = `${acc.profile.first_name || ""} ${
        acc.profile.last_name || ""
      }`.toLowerCase();
      const email = acc.user.email.toLowerCase();
      const mobile = acc.user.mobile || "";
      const q = searchTerm.toLowerCase();

      const matchesSearch =
        name.includes(q) ||
        email.includes(q) ||
        mobile.includes(q) ||
        acc.user.id.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (statusFilter !== "all" && acc.user.status !== statusFilter) {
        return false;
      }

      if (membershipFilter !== "all") {
        const userPlan = (
          acc.profile.membership_tier || "free"
        ).toLowerCase();
        if (userPlan !== membershipFilter.toLowerCase()) return false;
      }

      return true;
    });
  }, [accounts, searchTerm, statusFilter, membershipFilter]);

  // Selection handlers
  const handleToggleSelect = (userId: string) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleSelectAllFiltered = () => {
    if (selectedUserIds.size === filteredUsers.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(filteredUsers.map((u) => u.user.id)));
    }
  };

  const handleInvertSelection = () => {
    setSelectedUserIds((prev) => {
      const next = new Set<string>();
      filteredUsers.forEach((u) => {
        if (!prev.has(u.user.id)) {
          next.add(u.user.id);
        }
      });
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedUserIds(new Set());
  };

  // Bulk Operations
  const handleBulkActivate = () => {
    if (selectedUserIds.size === 0) return;
    setIsProcessing(true);

    selectedUserIds.forEach((id) => {
      onUpdateAccount?.(id, { status: "active" });
    });

    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Bulk Activation Complete",
        description: `Successfully activated ${selectedUserIds.size} user accounts.`,
      });
      setSelectedUserIds(new Set());
    }, 500);
  };

  const handleBulkApproveProfiles = () => {
    if (selectedUserIds.size === 0) return;
    setIsProcessing(true);

    selectedUserIds.forEach((id) => {
      onUpdateAccount?.(id, {
        status: "active",
        profile: {
          verification_badge: true,
          photo_approved: true,
        },
      });
    });

    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Bulk Profiles & Photos Approved",
        description: `Verified and approved photo visibility for ${selectedUserIds.size} candidates.`,
      });
      setSelectedUserIds(new Set());
    }, 500);
  };

  const handleBulkSuspendSubmit = () => {
    if (selectedUserIds.size === 0) return;
    setIsProcessing(true);

    selectedUserIds.forEach((id) => {
      onUpdateAccount?.(id, {
        status: "suspended",
        suspension_reason: suspendReason,
      });
    });

    setTimeout(() => {
      setIsProcessing(false);
      setActiveModal(null);
      toast({
        title: "Bulk Accounts Suspended",
        description: `Flagged and suspended ${selectedUserIds.size} profiles with reason: ${suspendReason}.`,
        variant: "destructive",
      });
      setSelectedUserIds(new Set());
    }, 500);
  };

  const handleBulkNotificationSubmit = () => {
    if (selectedUserIds.size === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setActiveModal(null);
      toast({
        title: "Bulk Broadcast Dispatched",
        description: `Sent '${notifyTitle || "System Notification"}' via ${notifyChannel.toUpperCase()} to ${selectedUserIds.size} recipients.`,
      });
      setNotifyTitle("");
      setNotifyBody("");
      setSelectedUserIds(new Set());
    }, 600);
  };

  const handleBulkFestivalSubmit = () => {
    if (selectedUserIds.size === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setActiveModal(null);
      toast({
        title: "Bulk Festival Greetings Dispatched",
        description: `Broadcasted '${festivalGreetingName}' via WhatsApp & In-App notification to ${selectedUserIds.size} recipient(s).`,
      });
      setSelectedUserIds(new Set());
    }, 600);
  };

  const handleBulkMembershipSubmit = () => {
    if (selectedUserIds.size === 0) return;
    setIsProcessing(true);

    selectedUserIds.forEach((id) => {
      onUpdateAccount?.(id, {
        profile: {
          membership_tier: selectedPlan.toLowerCase(),
        },
      });
    });

    setTimeout(() => {
      setIsProcessing(false);
      setActiveModal(null);
      toast({
        title: "Bulk Membership Assigned",
        description: `Upgraded ${selectedUserIds.size} accounts to ${selectedPlan} (${planDurationMonths} Months).`,
      });
      setSelectedUserIds(new Set());
    }, 500);
  };

  const handleBulkCategorySubmit = () => {
    if (selectedUserIds.size === 0) return;
    setIsProcessing(true);

    selectedUserIds.forEach((id) => {
      onUpdateAccount?.(id, {
        profile: {
          highlight_tag: targetCategory,
        },
      });
    });

    setTimeout(() => {
      setIsProcessing(false);
      setActiveModal(null);
      toast({
        title: "Bulk Category Updated",
        description: `Applied category badge '${targetCategory}' to ${selectedUserIds.size} profiles.`,
      });
      setSelectedUserIds(new Set());
    }, 500);
  };

  const handleBulkExportCSV = () => {
    const listToExport =
      selectedUserIds.size > 0
        ? accounts.filter((a) => selectedUserIds.has(a.user.id))
        : filteredUsers;

    if (listToExport.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Select candidates or clear filters to export records.",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "User ID",
      "Full Name",
      "Gender",
      "Email",
      "Mobile",
      "Status",
      "Role",
      "Membership Tier",
      "Religion",
      "Caste",
      "City",
    ];

    const rows = listToExport.map((a) => [
      a.user.id,
      `"${a.profile.first_name || ""} ${a.profile.last_name || ""}"`,
      a.profile.gender || "Not specified",
      a.user.email,
      a.user.mobile || "",
      a.user.status,
      a.user.role,
      a.profile.membership_tier || "Free",
      a.profile.religion || "",
      a.profile.caste || "",
      a.profile.city || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `matrimonial_bulk_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Bulk CSV Export Downloaded",
      description: `Exported ${listToExport.length} candidate profiles into CSV.`,
    });
  };

  const handleBulkDeleteSubmit = () => {
    if (selectedUserIds.size === 0) return;
    setIsProcessing(true);

    selectedUserIds.forEach((id) => {
      onDeleteAccount?.(id);
    });

    setTimeout(() => {
      setIsProcessing(false);
      setActiveModal(null);
      toast({
        title: "Bulk Accounts Deleted",
        description: `Permanently removed ${selectedUserIds.size} accounts from database.`,
        variant: "destructive",
      });
      setSelectedUserIds(new Set());
    }, 600);
  };

  const isAllSelected =
    filteredUsers.length > 0 && selectedUserIds.size === filteredUsers.length;
  const isPartiallySelected =
    selectedUserIds.size > 0 && selectedUserIds.size < filteredUsers.length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#3B0A18] via-[#5A0E24] to-[#8B1E3F] text-amber-50 rounded-2xl p-6 shadow-md border border-amber-900/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
              <Sliders className="w-3.5 h-3.5" />
              Administrative Power Operations
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-100">
              Admin Quick Tools & Bulk Hub
            </h1>
            <p className="text-sm text-amber-200/80 mt-1 max-w-2xl">
              Execute high-impact bulk actions across hundreds of profiles in
              seconds: bulk activation, suspensions, verified badges, plan
              assignments, category tags, broadcast messages, and CSV exports.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkExportCSV}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900/80 hover:bg-stone-900 text-amber-200 font-semibold rounded-xl text-xs transition-colors border border-amber-500/30 shadow-sm"
            >
              <FileDown className="w-4 h-4" />
              Export Selection (CSV)
            </button>
          </div>
        </div>
      </div>

      {/* Floating / Sticky Bulk Action Bar */}
      {selectedUserIds.size > 0 && (
        <div className="sticky top-4 z-30 bg-[#3B0A18] text-white p-3.5 rounded-2xl shadow-xl border border-amber-500/40 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-amber-500 text-slate-900 font-extrabold rounded-lg text-xs">
              {selectedUserIds.size} Selected
            </div>
            <button
              type="button"
              onClick={handleClearSelection}
              className="text-xs text-amber-200 hover:text-white underline"
            >
              Deselect All
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleBulkActivate}
              disabled={isProcessing}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Bulk Activate
            </button>

            <button
              type="button"
              onClick={handleBulkApproveProfiles}
              disabled={isProcessing}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Bulk Approve KYC/Photo
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("notification")}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg text-xs font-bold transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Bulk Notify
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("festival")}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              Festival Greetings
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("membership")}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <Crown className="w-3.5 h-3.5" />
              Assign Plan
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("category")}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-amber-100 rounded-lg text-xs font-bold transition-colors"
            >
              <Tag className="w-3.5 h-3.5" />
              Category Change
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("suspend")}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <UserX className="w-3.5 h-3.5" />
              Bulk Suspend
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("delete")}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-800 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Bulk Delete
            </button>
          </div>
        </div>
      )}

      {/* Filter and Selection Tools */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Quick Select Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAllFiltered}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold"
            >
              {isAllSelected ? (
                <CheckSquare className="w-3.5 h-3.5 text-[#3B0A18]" />
              ) : isPartiallySelected ? (
                <MinusSquare className="w-3.5 h-3.5 text-[#3B0A18]" />
              ) : (
                <Square className="w-3.5 h-3.5 text-stone-500" />
              )}
              {isAllSelected ? "Deselect Filtered" : "Select All Filtered"}
            </button>

            <button
              type="button"
              onClick={handleInvertSelection}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold"
            >
              Invert Selection
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, ID, phone, email..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3B0A18]"
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-3 pt-3 border-t border-stone-100">
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold">Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-stone-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={membershipFilter}
            onChange={(e) => setMembershipFilter(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-stone-700 focus:outline-none"
          >
            <option value="all">All Membership Plans</option>
            <option value="free">Free</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
            <option value="vip">VIP</option>
          </select>

          <div className="ml-auto text-xs text-stone-500 self-center">
            Showing {filteredUsers.length} of {accounts.length} candidates
          </div>
        </div>
      </div>

      {/* User Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isPartiallySelected;
                    }}
                    onChange={handleSelectAllFiltered}
                    className="rounded border-stone-300 text-[#3B0A18] focus:ring-[#3B0A18]"
                  />
                </th>
                <th className="p-3">Candidate</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Status</th>
                <th className="p-3">Verification</th>
                <th className="p-3">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-400">
                    No matching users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((acc) => {
                  const isChecked = selectedUserIds.has(acc.user.id);
                  const fullName = `${acc.profile.first_name || ""} ${
                    acc.profile.last_name || ""
                  }`;

                  return (
                    <tr
                      key={acc.user.id}
                      onClick={() => handleToggleSelect(acc.user.id)}
                      className={`cursor-pointer transition-colors ${
                        isChecked ? "bg-amber-50/60" : "hover:bg-stone-50/80"
                      }`}
                    >
                      <td
                        className="p-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(acc.user.id)}
                          className="rounded border-stone-300 text-[#3B0A18] focus:ring-[#3B0A18]"
                        />
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              acc.profile.avatar_url ||
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                            }
                            alt={fullName}
                            className="w-8 h-8 rounded-full object-cover border border-stone-200"
                          />
                          <div>
                            <div className="font-bold text-stone-900">
                              {fullName || "Unnamed Profile"}
                            </div>
                            <div className="text-[10px] text-stone-500 font-mono">
                              {acc.user.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="text-stone-700">{acc.user.email}</div>
                        <div className="text-stone-500 text-[10px]">
                          {acc.user.mobile || "No Mobile"}
                        </div>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            acc.profile.membership_tier === "platinum"
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : acc.profile.membership_tier === "gold"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-stone-100 text-stone-700"
                          }`}
                        >
                          {(acc.profile.membership_tier || "Free").toUpperCase()}
                        </span>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            acc.user.status === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : acc.user.status === "suspended"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {acc.user.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          {acc.verifications?.aadhaar_verified && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-semibold rounded">
                              KYC
                            </span>
                          )}
                          {acc.profile.photo_approved && (
                            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-semibold rounded">
                              PHOTO
                            </span>
                          )}
                          {!acc.verifications?.aadhaar_verified &&
                            !acc.profile.photo_approved && (
                              <span className="text-[10px] text-stone-400">
                                Unverified
                              </span>
                            )}
                        </div>
                      </td>

                      <td className="p-3 text-stone-600">
                        {acc.profile.city || "Not Provided"}
                        {acc.profile.state ? `, ${acc.profile.state}` : ""}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Bulk Notification */}
      {activeModal === "notification" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base text-stone-900">
                  Bulk Message Dispatch ({selectedUserIds.size} Users)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700">
                  Delivery Channel:
                </label>
                <div className="flex gap-2 mt-1">
                  {[
                    { id: "in_app", label: "In-App Push" },
                    { id: "whatsapp", label: "WhatsApp" },
                    { id: "email", label: "Email Digest" },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setNotifyChannel(ch.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        notifyChannel === ch.id
                          ? "bg-[#3B0A18] text-amber-100 border-[#3B0A18]"
                          : "bg-stone-50 text-stone-700 border-stone-200"
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700">
                  Broadcast Subject / Header:
                </label>
                <input
                  type="text"
                  value={notifyTitle}
                  onChange={(e) => setNotifyTitle(e.target.value)}
                  placeholder="e.g. Special Festive Matches Alert"
                  className="w-full mt-1 p-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3B0A18]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700">
                  Message Content:
                </label>
                <textarea
                  rows={4}
                  value={notifyBody}
                  onChange={(e) => setNotifyBody(e.target.value)}
                  placeholder="Write message to broadcast to all selected users..."
                  className="w-full mt-1 p-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3B0A18]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkNotificationSubmit}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-bold text-white bg-[#3B0A18] hover:bg-[#5A0E24] rounded-lg"
              >
                Dispatch to {selectedUserIds.size} Users
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Bulk Assign Membership */}
      {activeModal === "membership" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-base text-stone-900">
                  Bulk Assign Membership Plan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700">
                  Select Plan:
                </label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full mt-1 p-2 text-xs border border-stone-200 rounded-lg"
                >
                  <option value="Free">Free Basic</option>
                  <option value="Gold">Gold Elite (Standard)</option>
                  <option value="Platinum">Platinum Royal (Featured)</option>
                  <option value="VIP">VIP Assisted Matchmaking</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700">
                  Duration (Months):
                </label>
                <select
                  value={planDurationMonths}
                  onChange={(e) =>
                    setPlanDurationMonths(Number(e.target.value))
                  }
                  className="w-full mt-1 p-2 text-xs border border-stone-200 rounded-lg"
                >
                  <option value={1}>1 Month</option>
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months (Annual)</option>
                </select>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs text-purple-900">
                This will automatically adjust profile view limits, direct
                messaging allowances, and unlock contact view tokens for all{" "}
                <strong>{selectedUserIds.size}</strong> selected users.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkMembershipSubmit}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg"
              >
                Upgrade {selectedUserIds.size} Accounts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Bulk Suspend */}
      {activeModal === "suspend" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-base text-stone-900">
                  Bulk Account Suspension
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700">
                  Violation Reason:
                </label>
                <select
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full mt-1 p-2 text-xs border border-stone-200 rounded-lg"
                >
                  <option value="Duplicate Account Violation">
                    Duplicate Account Violation
                  </option>
                  <option value="Inappropriate Content or Unverified Photo">
                    Inappropriate Content or Unverified Photo
                  </option>
                  <option value="Commercial Solicitation / Fake Profile">
                    Commercial Solicitation / Fake Profile
                  </option>
                  <option value="Abusive Language in Chat Messages">
                    Abusive Language in Chat Messages
                  </option>
                  <option value="Temporary Inactive Account Sweep">
                    Temporary Inactive Account Sweep
                  </option>
                </select>
              </div>

              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-xs text-rose-900">
                Suspended users will not be able to log in, send interests, or
                appear in search recommendations.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkSuspendSubmit}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-lg"
              >
                Suspend {selectedUserIds.size} Accounts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Bulk Category Change */}
      {activeModal === "category" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base text-stone-900">
                  Bulk Category & Badge Assignment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700">
                  Target Badge / Category:
                </label>
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value)}
                  className="w-full mt-1 p-2 text-xs border border-stone-200 rounded-lg"
                >
                  <option value="Featured">Featured Spotlight Profile</option>
                  <option value="High Privacy">High Privacy Shield</option>
                  <option value="NRI">NRI Elite Alliance</option>
                  <option value="Kundali Verified">
                    Kundali / Horoscope Verified
                  </option>
                  <option value="Govt Officer">Govt / PSU Professional</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkCategorySubmit}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-bold text-white bg-[#3B0A18] hover:bg-[#5A0E24] rounded-lg"
              >
                Apply to {selectedUserIds.size} Profiles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Bulk Delete */}
      {activeModal === "delete" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-base text-stone-900">
                  Bulk Permanent Deletion
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-xs text-red-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Irreversible Administrative Action
              </div>
              <p>
                You are about to permanently delete{" "}
                <strong>{selectedUserIds.size}</strong> user accounts and their
                associated profiles, chats, and KYC records.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDeleteSubmit}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-bold text-white bg-red-800 hover:bg-red-900 rounded-lg"
              >
                Confirm Permanent Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Bulk Festival Greeting Broadcast */}
      {activeModal === "festival" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-stone-900">
                  Bulk Festival & Auspicious Occasion Greeting
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700">
                  Festival / Occasion:
                </label>
                <select
                  value={festivalGreetingName}
                  onChange={(e) => setFestivalGreetingName(e.target.value)}
                  className="w-full mt-1 p-2 text-xs border border-stone-200 rounded-lg"
                >
                  <option value="Diwali Shubh Vivah Wishes">
                    Diwali Shubh Vivah & Lakshmi Pujan Wishes
                  </option>
                  <option value="New Year 2026 Matrimonial Greetings">
                    New Year 2026 Auspicious Matchmaking Greetings
                  </option>
                  <option value="Makar Sankranti & Pongal Wishes">
                    Makar Sankranti, Uttarayan & Pongal Wishes
                  </option>
                  <option value="Holi Milan & Vivah Greetings">
                    Holi Milan & Spring Alliance Greetings
                  </option>
                  <option value="Akshaya Tritiya Vivah Mahotsav">
                    Akshaya Tritiya Shubh Vivah Muhurat
                  </option>
                  <option value="Raksha Bandhan Family Blessings">
                    Raksha Bandhan Matrimonial Blessings
                  </option>
                  <option value="Navratri & Dussehra Auspicious Blessings">
                    Navratri & Dussehra Auspicious Blessings
                  </option>
                  <option value="Eid Mubarak Harmony Greetings">
                    Eid Mubarak Matrimonial Harmony Greetings
                  </option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700">
                  Greeting Message Body:
                </label>
                <textarea
                  value={festivalGreetingBody}
                  onChange={(e) => setFestivalGreetingBody(e.target.value)}
                  rows={4}
                  className="w-full mt-1 p-2.5 text-xs border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  Dispatches high-priority festive greetings to{" "}
                  <strong>{selectedUserIds.size}</strong> selected member(s)
                  simultaneously across their registered WhatsApp mobile and
                  In-App Notification Center with special festive badge.
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkFestivalSubmit}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 rounded-lg shadow-sm"
              >
                Broadcast to {selectedUserIds.size} Members
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
