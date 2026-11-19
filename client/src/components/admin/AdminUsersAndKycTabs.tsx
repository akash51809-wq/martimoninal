import React, { useMemo, useState, useEffect } from "react";
import type { AccountBundle, AccountStatus } from "@/types/authTypes";
import type { KycRequestItem } from "@/data/adminMockData";
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
import { AdminUserDossierModal } from "./AdminUserDossierModal";
import {
  Search,
  CheckCircle2,
  Ban,
  Trash2,
  RotateCcw,
  Crown,
  ShieldCheck,
  Eye,
  XCircle,
  FileText,
  Pencil,
  TableProperties,
  Plus,
  Key,
  History,
  FileSpreadsheet,
  SlidersHorizontal,
  Filter,
  ShieldAlert,
  UserPlus,
  Lock,
  Smartphone,
  Globe,
  MapPin,
} from "lucide-react";

interface AdminUsersTabProps {
  accounts: AccountBundle[];
  onSetStatus: (userId: string, status: AccountStatus, reason?: string) => void;
  onVerifyUser: (userId: string) => void;
  onSetRole: (userId: string, role: "member" | "vip" | "admin") => void;
  onUpdateUser?: (
    userId: string,
    updates: { user?: Partial<AccountBundle["user"]>; profileMeta?: Record<string, any> }
  ) => void;
  onAddUser?: (input: any) => void;
  onResetPassword?: (userId: string, newPassword?: string) => string;
  onDeleteUser?: (userId: string, permanent?: boolean) => void;
  onLogAction: (action: string, target: string) => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  accounts,
  onSetStatus,
  onVerifyUser,
  onSetRole,
  onUpdateUser,
  onAddUser,
  onResetPassword,
  onDeleteUser,
  onLogAction,
}) => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");

  const getInitialFilter = () => {
    if (typeof window === "undefined") return "all";
    const param = new URLSearchParams(window.location.search).get("filter");
    const valid = [
      "all",
      "active",
      "male",
      "female",
      "today",
      "new",
      "verified",
      "pending",
      "premium",
      "expired",
      "suspended",
      "deleted",
    ];
    return param && valid.includes(param) ? param : "all";
  };

  const [statusFilter, setStatusFilter] = useState<string>(getInitialFilter);

  useEffect(() => {
    const handlePopState = () => {
      setStatusFilter(getInitialFilter());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSelectFilter = (filterId: string) => {
    setStatusFilter(filterId);
    const newUrl =
      filterId === "all" ? "/admin/users" : `/admin/users?filter=${filterId}`;
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", newUrl);
    }
  };

  const [inspectBundle, setInspectBundle] = useState<AccountBundle | null>(
    null
  );
  const [openInEditMode, setOpenInEditMode] = useState<boolean>(false);

  // Advanced Search Drawer state
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filterReligion, setFilterReligion] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterEducation, setFilterEducation] = useState("");
  const [filterIncome, setFilterIncome] = useState("");
  const [filterMinAge, setFilterMinAge] = useState("");
  const [filterMaxAge, setFilterMaxAge] = useState("");

  // Modals state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    gender: "Male",
    dob: "1996-05-15",
    profileCreatedBy: "Self",
    religion: "Hindu",
    caste: "Brahmin",
    city: "Pune",
    state: "Maharashtra",
    occupation: "Software Engineer",
  });

  const [resetPasswordTarget, setResetPasswordTarget] = useState<AccountBundle | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [generatedTempPass, setGeneratedTempPass] = useState("");

  const [loginHistoryTarget, setLoginHistoryTarget] = useState<AccountBundle | null>(null);
  const [deleteUserTarget, setDeleteUserTarget] = useState<AccountBundle | null>(null);

  const filtered = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStartTime = today.getTime();
    const sevenDaysAgo = Date.now() - 7 * 86400000;

    return accounts.filter((acc) => {
      if (statusFilter === "active") {
        if (acc.user.accountStatus !== "active") return false;
      } else if (statusFilter === "male") {
        if ((acc.user.gender || "").toLowerCase() !== "male") return false;
      } else if (statusFilter === "female") {
        if ((acc.user.gender || "").toLowerCase() !== "female") return false;
      } else if (statusFilter === "today") {
        const d = new Date(acc.user.createdAt).getTime();
        if (d < todayStartTime) return false;
      } else if (statusFilter === "new") {
        const d = new Date(acc.user.createdAt).getTime();
        if (d < sevenDaysAgo) return false;
      } else if (statusFilter === "verified") {
        const isVer =
          Boolean(acc.verification.mobileVerified && acc.verification.emailVerified) ||
          acc.profileMeta.profileStatus === "complete";
        if (!isVer) return false;
      } else if (statusFilter === "pending") {
        const isPend =
          acc.user.accountStatus === "pending_verification" ||
          !acc.verification.mobileVerified ||
          !acc.verification.emailVerified;
        if (!isPend) return false;
      } else if (statusFilter === "premium") {
        const isVip =
          acc.role.role === "vip" || (acc as any).membership?.status === "active";
        if (!isVip) return false;
      } else if (statusFilter === "expired") {
        const isExp =
          (acc as any).membership?.status === "expired" ||
          acc.user.id === "usr-expired-aditya";
        if (!isExp) return false;
      } else if (statusFilter === "suspended") {
        if (acc.user.accountStatus !== "suspended") return false;
      } else if (statusFilter === "deleted") {
        if (acc.user.accountStatus !== "deleted") return false;
      }

      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = `${acc.user.fullName} ${acc.user.email} ${acc.user.mobile} ${acc.user.id} ${acc.user.gender}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      // Advanced criteria filters
      const pm: any = acc.profileMeta || {};
      if (filterReligion.trim() && pm.religion && !pm.religion.toLowerCase().includes(filterReligion.toLowerCase())) {
        return false;
      }
      if (filterCity.trim() && pm.city && !pm.city.toLowerCase().includes(filterCity.toLowerCase())) {
        return false;
      }
      if (filterEducation.trim() && pm.education && !pm.education.toLowerCase().includes(filterEducation.toLowerCase())) {
        return false;
      }
      if (filterIncome.trim() && pm.annualIncome && !pm.annualIncome.toLowerCase().includes(filterIncome.toLowerCase())) {
        return false;
      }
      if (filterMinAge) {
        const minA = parseInt(filterMinAge, 10);
        if (!isNaN(minA)) {
          const birthYear = new Date(acc.user.dob).getFullYear();
          const age = new Date().getFullYear() - birthYear;
          if (age < minA) return false;
        }
      }
      if (filterMaxAge) {
        const maxA = parseInt(filterMaxAge, 10);
        if (!isNaN(maxA)) {
          const birthYear = new Date(acc.user.dob).getFullYear();
          const age = new Date().getFullYear() - birthYear;
          if (age > maxA) return false;
        }
      }

      return true;
    });
  }, [
    accounts,
    query,
    statusFilter,
    filterReligion,
    filterCity,
    filterEducation,
    filterIncome,
    filterMinAge,
    filterMaxAge,
  ]);

  const handleResetAdvancedFilters = () => {
    setFilterReligion("");
    setFilterCity("");
    setFilterEducation("");
    setFilterIncome("");
    setFilterMinAge("");
    setFilterMaxAge("");
  };

  const exportUsersCsv = () => {
    const headers = [
      "User ID",
      "Full Name",
      "Gender",
      "DOB",
      "Mobile",
      "Email",
      "Religion",
      "Caste",
      "City",
      "State",
      "Education",
      "Occupation",
      "Income",
      "Account Status",
      "Role",
      "Profile %",
    ];
    const rows = filtered.map((acc) => {
      const pm: any = acc.profileMeta || {};
      return [
        acc.user.id,
        `"${acc.user.fullName}"`,
        acc.user.gender,
        acc.user.dob,
        acc.user.mobile,
        acc.user.email,
        pm.religion || "Hindu",
        pm.caste || "General",
        pm.city || "Pune",
        pm.state || "Maharashtra",
        `"${pm.education || "Graduate"}"`,
        `"${pm.occupation || "Professional"}"`,
        `"${pm.annualIncome || "15 - 20 Lakhs P.A."}"`,
        acc.user.accountStatus,
        acc.role.role,
        `${pm.profileCompletion || 100}%`,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `VivahKarLo_Members_${statusFilter}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Members Export Complete",
      description: `Downloaded CSV with ${filtered.length} member records.`,
    });
  };

  const handleSaveNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addUserForm.fullName || !addUserForm.email || !addUserForm.mobile) {
      toast({
        title: "Validation Error",
        description: "Full Name, Email, and Mobile are mandatory.",
        variant: "destructive",
      });
      return;
    }

    if (onAddUser) {
      onAddUser(addUserForm);
    }
    onLogAction("Admin Added New User", `${addUserForm.fullName} (${addUserForm.email})`);
    toast({
      title: "User Created Successfully",
      description: `${addUserForm.fullName} is now provisioned on the platform.`,
    });
    setIsAddUserModalOpen(false);
  };

  const handleExecuteResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordTarget) return;

    let finalPass = newPasswordInput.trim();
    if (onResetPassword) {
      finalPass = onResetPassword(resetPasswordTarget.user.id, finalPass || undefined);
    }
    setGeneratedTempPass(finalPass);
    onLogAction("Admin Reset Password", resetPasswordTarget.user.email);
    toast({
      title: "Password Reset Successful",
      description: `New password has been set for ${resetPasswordTarget.user.fullName}.`,
    });
  };

  const handleConfirmDelete = (permanent: boolean) => {
    if (!deleteUserTarget) return;

    if (onDeleteUser) {
      onDeleteUser(deleteUserTarget.user.id, permanent);
    } else {
      onSetStatus(
        deleteUserTarget.user.id,
        "deleted",
        permanent ? "Permanently purged." : "Soft deleted by Admin."
      );
    }

    onLogAction(
      permanent ? "Permanently Purged User" : "Soft Deleted User",
      deleteUserTarget.user.email
    );
    toast({
      title: permanent ? "User Permanently Purged" : "User Account Soft Deleted",
      description: `${deleteUserTarget.user.fullName} status updated.`,
      variant: permanent ? "destructive" : "default",
    });
    setDeleteUserTarget(null);
  };

  const FILTER_OPTIONS = [
    { id: "all", label: "All Accounts" },
    { id: "active", label: "Active" },
    { id: "male", label: "Male Users" },
    { id: "female", label: "Female Users" },
    { id: "today", label: "Today's Signups" },
    { id: "new", label: "New (7 Days)" },
    { id: "verified", label: "Verified" },
    { id: "pending", label: "Pending Verification" },
    { id: "premium", label: "Premium VIP" },
    { id: "expired", label: "Expired VIP" },
    { id: "suspended", label: "Suspended" },
    { id: "deleted", label: "Deleted" },
  ];

  const statusColors: Record<AccountStatus, string> = {
    active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    pending_verification: "bg-amber-100 text-amber-800 border-amber-200",
    suspended: "bg-rose-100 text-rose-800 border-rose-200",
    deleted: "bg-slate-200 text-slate-700 border-slate-300",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
            Users &amp; Account Control
          </h1>
          <p className="text-sm text-[#5C4740]">
            Manage registered users, verify OTP statuses, suspend/restore accounts, and toggle VIP roles
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            className={`h-9 rounded-xl border-amber-300 text-xs font-semibold ${
              showAdvancedSearch ? "bg-amber-100 text-[#2B120C]" : "bg-white text-[#5C4740]"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
            {showAdvancedSearch ? "Hide Advanced Search" : "Advanced Filters"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={exportUsersCsv}
            className="h-9 rounded-xl border-amber-300 text-[#2B120C] hover:bg-amber-50 text-xs font-semibold"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            Export CSV
          </Button>

          <Button
            type="button"
            onClick={() => setIsAddUserModalOpen(true)}
            className="h-9 rounded-xl bg-gradient-to-r from-amber-600 to-[#EA580C] hover:from-amber-700 hover:to-[#C2410C] text-white text-xs font-bold shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            Add New User
          </Button>
        </div>
      </div>

      {/* Advanced Filter Drawer */}
      {showAdvancedSearch && (
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-serif-royal font-bold text-xs uppercase tracking-wider text-[#7C2D12] flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#EA580C]" />
              Multi-Parameter Query Console
            </span>
            <button
              type="button"
              onClick={handleResetAdvancedFilters}
              className="text-xs text-[#EA580C] font-semibold hover:underline"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <div>
              <Label className="text-[11px] font-semibold text-[#2B120C]">Min Age</Label>
              <Input
                type="number"
                placeholder="e.g. 21"
                value={filterMinAge}
                onChange={(e) => setFilterMinAge(e.target.value)}
                className="h-8 text-xs bg-white rounded-lg border-amber-200 mt-1"
              />
            </div>
            <div>
              <Label className="text-[11px] font-semibold text-[#2B120C]">Max Age</Label>
              <Input
                type="number"
                placeholder="e.g. 35"
                value={filterMaxAge}
                onChange={(e) => setFilterMaxAge(e.target.value)}
                className="h-8 text-xs bg-white rounded-lg border-amber-200 mt-1"
              />
            </div>
            <div>
              <Label className="text-[11px] font-semibold text-[#2B120C]">Religion</Label>
              <Input
                placeholder="e.g. Hindu"
                value={filterReligion}
                onChange={(e) => setFilterReligion(e.target.value)}
                className="h-8 text-xs bg-white rounded-lg border-amber-200 mt-1"
              />
            </div>
            <div>
              <Label className="text-[11px] font-semibold text-[#2B120C]">City</Label>
              <Input
                placeholder="e.g. Pune"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="h-8 text-xs bg-white rounded-lg border-amber-200 mt-1"
              />
            </div>
            <div>
              <Label className="text-[11px] font-semibold text-[#2B120C]">Education</Label>
              <Input
                placeholder="e.g. B.Tech"
                value={filterEducation}
                onChange={(e) => setFilterEducation(e.target.value)}
                className="h-8 text-xs bg-white rounded-lg border-amber-200 mt-1"
              />
            </div>
            <div>
              <Label className="text-[11px] font-semibold text-[#2B120C]">Income</Label>
              <Input
                placeholder="e.g. 20 Lakhs"
                value={filterIncome}
                onChange={(e) => setFilterIncome(e.target.value)}
                className="h-8 text-xs bg-white rounded-lg border-amber-200 mt-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or mobile..."
            className="h-10 pl-10 rounded-xl border-amber-200 bg-[#FFFDF9] text-sm"
          />
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-1.5 pb-1 sm:pb-0">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => handleSelectFilter(f.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                statusFilter === f.id
                  ? "bg-[#3B0A18] text-amber-100 border-[#3B0A18] shadow-xs"
                  : "bg-amber-50/70 text-[#5C4740] border-amber-200 hover:bg-amber-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Notification Banner */}
      {statusFilter !== "all" && (
        <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-xs">
          <div className="flex items-center gap-2 text-[#7C2D12] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
            <span>
              Active Filter:{" "}
              <strong>
                {FILTER_OPTIONS.find((f) => f.id === statusFilter)?.label}
              </strong>{" "}
              &bull; URL:{" "}
              <code className="bg-white px-1.5 py-0.5 rounded border border-amber-200 font-mono text-[11px] text-[#2B120C]">
                /admin/users?filter={statusFilter}
              </code>{" "}
              &bull; Showing {filtered.length} member(s)
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSelectFilter("all")}
            className="text-xs font-bold text-[#EA580C] hover:underline self-start sm:self-auto"
          >
            Clear Filter (Show All Accounts)
          </button>
        </div>
      )}

      {/* Users Enterprise Table View with Photo Thumbnails & Actions */}
      <div className="bg-white rounded-2xl border border-amber-200/90 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-[#3B0A18] to-[#5C1024] text-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <TableProperties className="w-4 h-4 text-amber-300" />
            <span>Registered Members Master Table ({filtered.length})</span>
          </div>
          <span className="text-[11px] text-amber-200 hidden sm:inline">
            Click &ldquo;Edit&rdquo; or &ldquo;View Tables&rdquo; to inspect/modify all 6 separate profile detail tables
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-amber-50/90 border-b border-amber-200 text-[#7C2D12] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3 font-bold">Photo &amp; Member</th>
                <th className="py-3 px-3 font-bold">Contact &amp; OTP</th>
                <th className="py-3 px-3 font-bold">Community &amp; Astro</th>
                <th className="py-3 px-3 font-bold">Education &amp; Career</th>
                <th className="py-3 px-3 font-bold">Location &amp; Family</th>
                <th className="py-3 px-3 font-bold">Role &amp; Status</th>
                <th className="py-3 px-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#5C4740]">
                    No user accounts matched your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((acc, idx) => {
                  const { user, verification, profileMeta, role } = acc;
                  const pm: any = profileMeta || {};
                  const fallbackPhotos = ["/2.jpg", "/1.jpg", "/3.jpg", "/4.jpg"];
                  const avatarUrl =
                    pm.primaryPhotoUrl ||
                    fallbackPhotos[idx % fallbackPhotos.length];

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-amber-50/40 transition-colors align-top"
                    >
                      {/* Col 1: Photo & Member */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3 min-w-[190px]">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-300 bg-amber-50 shrink-0 shadow-xs">
                            <img
                              src={avatarUrl}
                              alt={user.fullName}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-serif-royal text-sm font-bold text-[#2B120C] truncate">
                              {user.fullName}
                            </p>
                            <p className="text-[11px] font-mono text-[#7C2D12] truncate">
                              {user.id}
                            </p>
                            <p className="text-[10px] text-[#6E564E]">
                              {user.gender} • By {user.profileCreatedBy || "Self"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Col 2: Contact & OTP */}
                      <td className="py-3 px-3 min-w-[180px]">
                        <p className="font-semibold text-[#2B120C]">+91 {user.mobile}</p>
                        <p className="text-[11px] text-[#5C4740] break-all">{user.email}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              verification.mobileVerified
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            Mob: {verification.mobileVerified ? "✓" : "Pending"}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              verification.emailVerified
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            Email: {verification.emailVerified ? "✓" : "Pending"}
                          </span>
                        </div>
                      </td>

                      {/* Col 3: Community & Astro */}
                      <td className="py-3 px-3 min-w-[140px]">
                        <p className="font-semibold text-[#2B120C]">
                          {pm.religion || "Hindu"} • {pm.caste || "General"}
                        </p>
                        <p className="text-[11px] text-[#5C4740]">
                          Lang: {pm.motherTongue || "Hindi"}
                        </p>
                        <p className="text-[10px] text-[#8C6D62]">
                          {pm.manglik || "Non-Manglik"} • {pm.rashi || "Simha"}
                        </p>
                      </td>

                      {/* Col 4: Education & Career */}
                      <td className="py-3 px-3 min-w-[160px]">
                        <p className="font-semibold text-[#2B120C] truncate max-w-[170px]">
                          {pm.occupation || "Software Engineer"}
                        </p>
                        <p className="text-[11px] text-[#5C4740] truncate max-w-[170px]">
                          {pm.education || "Graduate"}
                        </p>
                        <p className="text-[11px] font-bold text-[#EA580C]">
                          {pm.annualIncome || "15 - 20 Lakhs P.A."}
                        </p>
                      </td>

                      {/* Col 5: Location & Family */}
                      <td className="py-3 px-3 min-w-[130px]">
                        <p className="font-semibold text-[#2B120C]">
                          {pm.city || pm.workCity || "Pune"}, {pm.state || "MH"}
                        </p>
                        <p className="text-[11px] text-[#5C4740]">
                          {pm.nriStatus || "Resident Indian"}
                        </p>
                        <p className="text-[10px] text-[#8C6D62]">
                          {pm.familyType || "Nuclear"} • {pm.familyValues || "Moderate"}
                        </p>
                      </td>

                      {/* Col 6: Role & Status */}
                      <td className="py-3 px-3 min-w-[130px]">
                        <div className="flex flex-col gap-1 items-start">
                          <Badge
                            className={`border text-[10px] font-bold ${
                              statusColors[user.accountStatus]
                            }`}
                          >
                            {user.accountStatus}
                          </Badge>
                          <Badge className="bg-amber-50 text-[#9A3412] border border-amber-200 text-[10px] font-bold uppercase">
                            {role.role}
                          </Badge>
                          <span className="text-[10px] font-bold text-[#EA580C]">
                            Profile: {profileMeta.profileCompletion}%
                          </span>
                        </div>
                      </td>

                      {/* Col 7: Action Controls */}
                      <td className="py-3 px-3 text-right min-w-[210px]">
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              setOpenInEditMode(true);
                              setInspectBundle(acc);
                            }}
                            className="h-8 px-2.5 rounded-lg bg-saffron-gradient text-white text-[11px] font-bold shadow-xs"
                          >
                            <Pencil className="w-3 h-3 mr-1" />
                            Edit
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setOpenInEditMode(false);
                              setInspectBundle(acc);
                            }}
                            className="h-8 px-2.5 rounded-lg bg-amber-50 hover:bg-orange-100 border-amber-300 text-[#3B0A18] text-[11px] font-bold"
                          >
                            <Eye className="w-3 h-3 mr-1 text-[#EA580C]" />
                            Tables
                          </Button>

                          {(!verification.mobileVerified || !verification.emailVerified) && (
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => {
                                onVerifyUser(user.id);
                                onLogAction("Verified User OTPs", user.email);
                                toast({ title: `Verified & activated ${user.fullName}` });
                              }}
                              className="h-8 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold"
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Verify
                            </Button>
                          )}

                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const nextRole = role.role === "vip" ? "member" : "vip";
                              onSetRole(user.id, nextRole);
                              onLogAction(`Changed Role to ${nextRole}`, user.email);
                              toast({
                                title: `${user.fullName} updated to ${nextRole.toUpperCase()}`,
                              });
                            }}
                            className="h-8 px-2 rounded-lg border-amber-300 text-[#3B0A18] text-[11px] font-semibold"
                            title={role.role === "vip" ? "Set Member" : "Make VIP"}
                          >
                            <Crown className="w-3 h-3 text-[#EA580C]" />
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setResetPasswordTarget(acc);
                              setNewPasswordInput("");
                              setGeneratedTempPass("");
                            }}
                            className="h-8 px-2 rounded-lg border-amber-300 text-[#3B0A18] text-[11px] font-semibold"
                            title="Reset Password"
                          >
                            <Key className="w-3 h-3 text-amber-700" />
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setLoginHistoryTarget(acc)}
                            className="h-8 px-2 rounded-lg border-amber-300 text-[#3B0A18] text-[11px] font-semibold"
                            title="Login History & Devices"
                          >
                            <History className="w-3 h-3 text-blue-700" />
                          </Button>

                          {user.accountStatus === "suspended" ||
                          user.accountStatus === "deleted" ? (
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => {
                                onSetStatus(user.id, "active");
                                onLogAction("Restored Account", user.email);
                                toast({ title: `Account restored: ${user.fullName}` });
                              }}
                              className="h-8 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold"
                              title="Activate Account"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                onSetStatus(
                                  user.id,
                                  "suspended",
                                  "Suspended by Admin from Control Panel."
                                );
                                onLogAction("Suspended Account", user.email);
                                toast({
                                  title: `Suspended ${user.fullName}`,
                                  variant: "destructive",
                                });
                              }}
                              className="h-8 px-2 rounded-lg border-rose-200 text-rose-700 hover:bg-rose-50 text-[11px] font-semibold"
                              title="Suspend Account"
                            >
                              <Ban className="w-3 h-3" />
                            </Button>
                          )}

                          {user.accountStatus !== "deleted" && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeleteUserTarget(acc)}
                              className="h-8 px-2 rounded-lg text-rose-600 hover:bg-rose-50 text-[11px] font-semibold"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Separate-Table Matrimonial Dossier & Live Editor Modal */}
      <AdminUserDossierModal
        account={inspectBundle}
        open={!!inspectBundle}
        initialEditMode={openInEditMode}
        onOpenChange={(open) => !open && setInspectBundle(null)}
        onActivate={(id) => {
          onSetStatus(id, "active");
          onLogAction("Activated User from Dossier", id);
          toast({ title: "User Account Activated" });
        }}
        onSuspend={(id) => {
          onSetStatus(id, "suspended", "Suspended by Admin after reviewing dossier.");
          onLogAction("Suspended User from Dossier", id);
          toast({ title: "User Account Suspended", variant: "destructive" });
        }}
        onMakeVip={(id) => {
          onSetRole(id, "vip");
          onLogAction("Upgraded User to VIP from Dossier", id);
          toast({ title: "User Upgraded to VIP Member" });
        }}
        onSaveUser={(userId, updates) => {
          if (onUpdateUser) {
            onUpdateUser(userId, updates);
          }
          onLogAction("Edited User Profile Tables", updates.user?.email || userId);
        }}
      />

      {/* Modal 1: Add New User */}
      <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
        <DialogContent className="max-w-xl rounded-2xl p-6 bg-white border border-amber-200 shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif-royal text-xl font-bold text-[#2B120C]">
              Add New Matrimonial Candidate
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveNewUser} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Full Name *</Label>
                <Input
                  required
                  value={addUserForm.fullName}
                  onChange={(e) => setAddUserForm({ ...addUserForm, fullName: e.target.value })}
                  placeholder="e.g. Aarav Patil"
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Gender</Label>
                <select
                  value={addUserForm.gender}
                  onChange={(e) => setAddUserForm({ ...addUserForm, gender: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-amber-200 text-xs bg-white text-[#2B120C]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Official Email *</Label>
                <Input
                  required
                  type="email"
                  value={addUserForm.email}
                  onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
                  placeholder="e.g. aarav@example.com"
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Mobile Number *</Label>
                <Input
                  required
                  value={addUserForm.mobile}
                  onChange={(e) => setAddUserForm({ ...addUserForm, mobile: e.target.value })}
                  placeholder="10-digit mobile"
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Date of Birth</Label>
                <Input
                  type="date"
                  value={addUserForm.dob}
                  onChange={(e) => setAddUserForm({ ...addUserForm, dob: e.target.value })}
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Profile Created By</Label>
                <select
                  value={addUserForm.profileCreatedBy}
                  onChange={(e) => setAddUserForm({ ...addUserForm, profileCreatedBy: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-amber-200 text-xs bg-white text-[#2B120C]"
                >
                  <option value="Self">Self</option>
                  <option value="Parents">Parents</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Relative">Relative</option>
                  <option value="Friend">Friend</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Religion / Community</Label>
                <Input
                  value={addUserForm.religion}
                  onChange={(e) => setAddUserForm({ ...addUserForm, religion: e.target.value })}
                  placeholder="e.g. Hindu"
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Caste / Sub-Caste</Label>
                <Input
                  value={addUserForm.caste}
                  onChange={(e) => setAddUserForm({ ...addUserForm, caste: e.target.value })}
                  placeholder="e.g. Maratha"
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">City</Label>
                <Input
                  value={addUserForm.city}
                  onChange={(e) => setAddUserForm({ ...addUserForm, city: e.target.value })}
                  placeholder="e.g. Pune"
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Occupation</Label>
                <Input
                  value={addUserForm.occupation}
                  onChange={(e) => setAddUserForm({ ...addUserForm, occupation: e.target.value })}
                  placeholder="e.g. Software Engineer"
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddUserModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold"
              >
                Create Candidate
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Reset Password */}
      <Dialog open={Boolean(resetPasswordTarget)} onOpenChange={() => setResetPasswordTarget(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-white border border-amber-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif-royal text-lg font-bold text-[#2B120C]">
              Admin Password Reset: {resetPasswordTarget?.user.fullName}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleExecuteResetPassword} className="space-y-4 pt-2">
            <p className="text-xs text-[#5C4740]">
              Assign a new permanent password or auto-generate a secure random temporary credential for this member.
            </p>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#2B120C]">New Password</Label>
              <Input
                type="text"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                placeholder="Leave blank to auto-generate random"
                className="rounded-xl border-amber-200 text-xs font-mono"
              />
            </div>

            {generatedTempPass && (
              <div className="rounded-xl p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Password Successfully Reset!
                </p>
                <p className="font-mono text-sm bg-white p-2 rounded-lg border border-emerald-200 font-bold text-center">
                  {generatedTempPass}
                </p>
                <p className="text-[11px] text-emerald-700">
                  Please communicate this temporary password to the user.
                </p>
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setResetPasswordTarget(null)}
                className="rounded-xl text-xs"
              >
                Close
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
              >
                Apply New Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 3: Login History & Devices */}
      <Dialog open={Boolean(loginHistoryTarget)} onOpenChange={() => setLoginHistoryTarget(null)}>
        <DialogContent className="max-w-lg rounded-2xl p-6 bg-white border border-amber-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif-royal text-lg font-bold text-[#2B120C]">
              Login Devices &amp; Security Audit: {loginHistoryTarget?.user.fullName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <p className="text-xs text-[#5C4740]">
              Past authentication sessions, IP addresses, geographical geolocation, and client browser telemetry.
            </p>

            <div className="space-y-2.5 max-h-64 overflow-y-auto">
              <div className="rounded-xl p-3 bg-amber-50/50 border border-amber-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-[#2B120C]">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                    Apple iPhone 15 Pro • Safari Mobile
                  </span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">
                    Active Now
                  </Badge>
                </div>
                <div className="text-[11px] text-[#8C6D62] flex items-center justify-between">
                  <span>IP: 49.36.12.84 (Reliance Jio Infocomm)</span>
                  <span>Pune, Maharashtra</span>
                </div>
              </div>

              <div className="rounded-xl p-3 bg-white border border-amber-100 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-[#2B120C]">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-purple-600" />
                    Windows 11 • Google Chrome 128
                  </span>
                  <span className="text-[11px] text-[#8C6D62]">2 days ago</span>
                </div>
                <div className="text-[11px] text-[#8C6D62] flex items-center justify-between">
                  <span>IP: 103.21.54.12 (Tata Communications)</span>
                  <span>Mumbai, Maharashtra</span>
                </div>
              </div>

              <div className="rounded-xl p-3 bg-white border border-amber-100 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-[#2B120C]">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-600" />
                    MacBook Pro • Safari 17.5
                  </span>
                  <span className="text-[11px] text-[#8C6D62]">5 days ago</span>
                </div>
                <div className="text-[11px] text-[#8C6D62] flex items-center justify-between">
                  <span>IP: 152.57.19.102 (Airtel Broadband)</span>
                  <span>Pune, Maharashtra</span>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLoginHistoryTarget(null)}
                className="rounded-xl text-xs"
              >
                Close Audit
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal 4: Delete User Confirmation */}
      <Dialog open={Boolean(deleteUserTarget)} onOpenChange={() => setDeleteUserTarget(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-white border border-amber-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif-royal text-lg font-bold text-rose-900">
              Confirm Account Deletion: {deleteUserTarget?.user.fullName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <p className="text-xs text-[#5C4740]">
              Please choose between a <strong>Soft Deactivation</strong> (marks account deleted but retains archival records for compliance) or a <strong>Permanent Purge</strong> (erases all personal data, biodata, and chat logs).
            </p>

            <div className="rounded-xl p-3 bg-rose-50 border border-rose-200 text-xs text-rose-900">
              <p className="font-bold">Member Information:</p>
              <p>Email: {deleteUserTarget?.user.email}</p>
              <p>Mobile: {deleteUserTarget?.user.mobile}</p>
              <p>User ID: {deleteUserTarget?.user.id}</p>
            </div>

            <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteUserTarget(null)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => handleConfirmDelete(false)}
                className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
              >
                Soft Delete (Archival)
              </Button>
              <Button
                type="button"
                onClick={() => handleConfirmDelete(true)}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Permanent Purge
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface AdminKycTabProps {
  kycQueue: KycRequestItem[];
  onUpdateKyc: (id: string, status: "Approved" | "Rejected") => void;
}

interface EmploymentQueueItem {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  profileId: string;
  employmentType: "govt" | "private" | "business" | "nri";
  employerName: string;
  designation: string;
  claimedIncome: string;
  documentType: string;
  documentUrl: string;
  submittedAt: string;
  status: "Pending" | "Approved" | "Rejected";
}

export const AdminKycTab: React.FC<AdminKycTabProps> = ({
  kycQueue,
  onUpdateKyc,
}) => {
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<"gov_id" | "employment">("gov_id");

  const [employmentQueue, setEmploymentQueue] = useState<EmploymentQueueItem[]>([
    {
      id: "emp-01",
      userId: "usr-002",
      userName: "Dr. Aditya Joshi",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60",
      profileId: "VK-1002",
      employmentType: "private",
      employerName: "Apollo Hospitals",
      designation: "Consultant Cardiologist",
      claimedIncome: "35-50 Lakhs",
      documentType: "Salary Slip (Recent 3 Months)",
      documentUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60",
      submittedAt: "Today, 10:45 AM",
      status: "Pending",
    },
    {
      id: "emp-02",
      userId: "usr-005",
      userName: "Vikram Malhotra",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60",
      profileId: "VK-1005",
      employmentType: "govt",
      employerName: "Ministry of Finance",
      designation: "Deputy Director",
      claimedIncome: "20-25 Lakhs",
      documentType: "Govt Service Appointment Letter",
      documentUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&auto=format&fit=crop&q=60",
      submittedAt: "Yesterday, 04:15 PM",
      status: "Pending",
    },
  ]);

  const handleReviewEmployment = (id: string, status: "Approved" | "Rejected") => {
    setEmploymentQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    toast({
      title: `Employment Proof ${status}`,
      description:
        status === "Approved"
          ? "Verified Income & Govt Job badges unlocked (+30% Trust Score)."
          : "Employment verification rejected with notification to user.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
            Trust, KYC &amp; Verification Desk
          </h1>
          <p className="text-sm text-[#5C4740]">
            Review Aadhaar, PAN, Govt Job orders, and Salary Slips to issue official platform trust badges
          </p>
        </div>

        {/* Sub-tab Pill Switch */}
        <div className="flex bg-amber-50 p-1 rounded-2xl border border-amber-200 self-start">
          <button
            type="button"
            onClick={() => setActiveSubTab("gov_id")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "gov_id"
                ? "bg-[#3B0A18] text-amber-100 shadow-sm"
                : "text-[#5C4740] hover:text-[#2B120C]"
            }`}
          >
            Govt ID / Aadhaar Queue ({kycQueue.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("employment")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "employment"
                ? "bg-[#3B0A18] text-amber-100 shadow-sm"
                : "text-[#5C4740] hover:text-[#2B120C]"
            }`}
          >
            Income &amp; Employment ({employmentQueue.length})
          </button>
        </div>
      </div>

      {/* Trust Score Breakdown Info Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl border border-amber-200 p-4 text-xs text-[#4E342E] grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <span className="font-bold text-[#EA580C]">Aadhaar / Govt ID:</span>
          <p className="text-[#5C4740] mt-0.5">+35% Trust Score</p>
        </div>
        <div>
          <span className="font-bold text-[#EA580C]">Salary / Job Proof:</span>
          <p className="text-[#5C4740] mt-0.5">+30% Trust Score</p>
        </div>
        <div>
          <span className="font-bold text-[#EA580C]">OTP Verification:</span>
          <p className="text-[#5C4740] mt-0.5">+20% Trust Score</p>
        </div>
        <div>
          <span className="font-bold text-[#EA580C]">Verified Photos:</span>
          <p className="text-[#5C4740] mt-0.5">+15% Trust Score</p>
        </div>
      </div>

      {/* Govt ID Queue */}
      {activeSubTab === "gov_id" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {kycQueue.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.riskScore === "High"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {item.riskScore} Risk
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.status === "Approved"
                        ? "bg-emerald-600 text-white"
                        : item.status === "Rejected"
                        ? "bg-rose-600 text-white"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <img
                    src={item.avatar}
                    alt={item.userName}
                    className="w-14 h-14 rounded-2xl object-cover border border-amber-200"
                  />
                  <div>
                    <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
                      {item.userName}
                    </h3>
                    <p className="text-xs text-[#5C4740]">
                      {item.profileId} • {item.city}
                    </p>
                    <p className="text-xs font-semibold text-[#EA580C] mt-0.5">
                      {item.documentType}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-amber-50/70 border border-amber-100 p-3 text-xs text-[#4E342E]">
                  Submitted: <strong>{item.submittedAt}</strong> • Selfie Liveness Match:{" "}
                  <strong className="text-emerald-700">
                    {item.riskScore === "High" ? "64% (Manual Review)" : "97% Pass"}
                  </strong>
                </div>
              </div>

              {item.status === "Pending" && (
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-amber-100">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => onUpdateKyc(item.id, "Approved")}
                    className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                  >
                    <ShieldCheck className="w-4 h-4 mr-1" />
                    Approve ID
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateKyc(item.id, "Rejected")}
                    className="h-10 rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold text-xs"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Income & Employment Queue */}
      {activeSubTab === "employment" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {employmentQueue.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-[#7C2D12] text-xs font-bold">
                    {item.employmentType === "govt" ? "Govt Officer" : "Corporate"}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.status === "Approved"
                        ? "bg-emerald-600 text-white"
                        : item.status === "Rejected"
                        ? "bg-rose-600 text-white"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <img
                    src={item.avatar}
                    alt={item.userName}
                    className="w-14 h-14 rounded-2xl object-cover border border-amber-200"
                  />
                  <div>
                    <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
                      {item.userName}
                    </h3>
                    <p className="text-xs text-[#5C4740]">
                      {item.profileId} • {item.designation}
                    </p>
                    <p className="text-xs font-semibold text-[#EA580C] mt-0.5">
                      {item.employerName}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-amber-50/70 border border-amber-100 p-3 text-xs text-[#4E342E] space-y-1">
                  <p>
                    <strong>Claimed Income:</strong> {item.claimedIncome}
                  </p>
                  <p>
                    <strong>Proof Type:</strong> {item.documentType}
                  </p>
                  <p className="text-[#8C6D62] text-[11px]">Submitted {item.submittedAt}</p>
                </div>
              </div>

              {item.status === "Pending" && (
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-amber-100">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleReviewEmployment(item.id, "Approved")}
                    className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                  >
                    <ShieldCheck className="w-4 h-4 mr-1" />
                    Verify Income
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleReviewEmployment(item.id, "Rejected")}
                    className="h-10 rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold text-xs"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
