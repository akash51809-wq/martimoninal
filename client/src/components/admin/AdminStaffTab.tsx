import React, { useState } from "react";
import {
  INITIAL_STAFF_ACCOUNTS,
  type StaffAccount,
  ADMIN_TEAM_ROLES,
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
  ShieldAlert,
  UserCheck,
  Plus,
  Search,
  Pencil,
  Trash2,
  Key,
  Lock,
  CheckCircle2,
  Phone,
  Mail,
  Sliders,
  FileCheck,
} from "lucide-react";

interface AdminStaffTabProps {
  onLogAction?: (action: string, target: string) => void;
}

const AVAILABLE_PERMISSIONS = [
  { id: "all_access", label: "Full System Super Admin (Root Access)", category: "System" },
  { id: "manage_users", label: "View, Edit & Manage User Accounts", category: "Users" },
  { id: "approve_kyc", label: "Approve & Reject Aadhaar / ID KYC", category: "Verification" },
  { id: "moderate_photos", label: "Approve, Blur & Moderate User Photos", category: "Verification" },
  { id: "view_transactions", label: "Inspect Ledger & Payment Transactions", category: "Finance" },
  { id: "issue_refunds", label: "Authorize Subscription Refunds", category: "Finance" },
  { id: "manage_coupons", label: "Create & Deactivate Promo Coupons", category: "Finance" },
  { id: "reply_tickets", label: "Respond to Support & Grievance Tickets", category: "Support" },
  { id: "send_notifications", label: "Send Bulk WhatsApp, SMS & Emails", category: "Engagement" },
  { id: "system_settings", label: "Update API Keys & Core Settings", category: "System" },
];

export const AdminStaffTab: React.FC<AdminStaffTabProps> = ({ onLogAction }) => {
  const { toast } = useToast();
  const [staffList, setStaffList] = useState<StaffAccount[]>(INITIAL_STAFF_ACCOUNTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffAccount | null>(null);

  const [formData, setFormData] = useState<Partial<StaffAccount>>({
    name: "",
    email: "",
    role: "Moderator",
    department: "Trust & Safety",
    phone: "+91 ",
    status: "Active",
    permissions: ["approve_kyc", "moderate_photos"],
  });

  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      email: "",
      role: "Moderator",
      department: "Trust & Safety",
      phone: "+91 ",
      status: "Active",
      permissions: ["approve_kyc", "moderate_photos"],
    });
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: StaffAccount) => {
    setEditingStaff(s);
    setFormData({ ...s });
    setIsModalOpen(true);
  };

  const handleTogglePermission = (permId: string) => {
    setFormData((prev) => {
      const current = prev.permissions || [];
      if (current.includes(permId)) {
        return { ...prev, permissions: current.filter((p) => p !== permId) };
      } else {
        return { ...prev, permissions: [...current, permId] };
      }
    });
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Please enter Staff Name and Email.",
        variant: "destructive",
      });
      return;
    }

    if (editingStaff) {
      setStaffList((prev) =>
        prev.map((s) =>
          s.id === editingStaff.id ? ({ ...s, ...formData } as StaffAccount) : s
        )
      );
      onLogAction?.("Updated Staff Permissions", formData.name || "");
      toast({
        title: "Staff Member Updated",
        description: `Permissions for ${formData.name} saved successfully.`,
      });
    } else {
      const newStaff: StaffAccount = {
        id: `stf-${Date.now().toString().slice(-4)}`,
        name: formData.name || "New Staff",
        email: formData.email || "",
        role: formData.role || "Moderator",
        department: formData.department || "Operations",
        phone: formData.phone || "",
        status: "Active",
        lastActive: "Just added",
        permissions: formData.permissions || ["view_users"],
      };
      setStaffList((prev) => [newStaff, ...prev]);
      onLogAction?.("Created Staff Account", newStaff.name);
      toast({
        title: "Staff Account Created",
        description: `${newStaff.name} has been added with ${newStaff.role} role.`,
      });
    }
    setIsModalOpen(false);
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (confirm(`Revoke administrative access and delete staff account "${name}"?`)) {
      setStaffList((prev) => prev.filter((s) => s.id !== id));
      onLogAction?.("Revoked Staff Account", name);
      toast({
        title: "Access Revoked",
        description: `${name} has been removed from staff roster.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
                Staff &amp; Role-Based Access Control (RBAC)
              </h1>
              <p className="text-xs sm:text-sm text-[#5C4740]">
                Configure granular team permissions, departmental roles, audit access privileges and administrative boundaries
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleOpenAdd}
          className="h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Staff Member
        </Button>
      </div>

      {/* Role Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ADMIN_TEAM_ROLES.map((r) => (
          <div
            key={r.role}
            className="rounded-2xl p-4 bg-white border border-amber-200/80 shadow-xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold font-serif-royal text-[#2B120C] text-sm sm:text-base">
                {r.role}
              </span>
              <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200 font-bold">
                {r.members} Officers
              </Badge>
            </div>
            <ul className="text-xs text-[#5C4740] space-y-1 pt-1">
              {r.permissions.map((p, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl bg-white border border-amber-200/80 p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6D62]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search staff members by name, email, department or role..."
            className="pl-10 h-10 rounded-xl border-amber-200 text-xs sm:text-sm text-[#2B120C] focus-visible:ring-purple-500"
          />
        </div>
      </div>

      {/* Staff Roster Table */}
      <div className="rounded-2xl bg-white border border-amber-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-amber-50/60 border-b border-amber-200/80 text-[#8C6D62] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Officer Name &amp; Email</th>
                <th className="py-3 px-4">Designated Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Direct Contact</th>
                <th className="py-3 px-4 text-center">Active Permissions</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#8C6D62]">
                    No staff members matched your query.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((s) => (
                  <tr key={s.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#2B120C] flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                        {s.name}
                      </div>
                      <div className="text-[11px] text-[#8C6D62] font-mono">{s.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant="outline"
                        className={`font-bold ${
                          s.role === "Super Admin"
                            ? "bg-rose-50 text-rose-800 border-rose-200"
                            : s.role === "Moderator"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-blue-50 text-blue-800 border-blue-200"
                        }`}
                      >
                        {s.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-[#5C4740] font-medium">
                      {s.department}
                    </td>
                    <td className="py-3.5 px-4 text-[#5C4740]">
                      <div className="text-xs">{s.phone}</div>
                      <div className="text-[10px] text-[#8C6D62]">Active {s.lastActive}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-purple-900 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 text-xs">
                        {s.permissions.includes("all_access") ? "All 10 Rights" : `${s.permissions.length} Grants`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(s)}
                          className="h-8 px-2 text-xs text-purple-700 hover:bg-purple-50 rounded-lg"
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1" />
                          Edit Rights
                        </Button>
                        {s.role !== "Super Admin" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStaff(s.id, s.name)}
                            className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Revoke Access"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Staff Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl rounded-2xl p-6 bg-white border border-amber-200 shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif-royal text-xl font-bold text-[#2B120C]">
              {editingStaff ? "Edit Staff Rights & Role" : "Add Staff Member"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveStaff} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Staff Full Name *</Label>
                <Input
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Snehal Sharma"
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Official Email *</Label>
                <Input
                  required
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. snehal.kyc@vivahkarlo.in"
                  className="rounded-xl border-amber-200 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Role Designation</Label>
                <select
                  value={formData.role || "Moderator"}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-xl border border-amber-200 text-xs bg-white text-[#2B120C] focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Relationship Manager">Relationship Manager</option>
                  <option value="Finance Officer">Finance Officer</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Department</Label>
                <Input
                  value={formData.department || ""}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Trust & Safety / KYC"
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#2B120C]">Contact Number</Label>
              <Input
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98000 22222"
                className="rounded-xl border-amber-200 text-xs"
              />
            </div>

            {/* Granular Permissions Checklist */}
            <div className="space-y-2 pt-2 border-t border-amber-100">
              <Label className="text-xs font-bold text-[#2B120C] flex items-center justify-between">
                <span>Granular Permissions Matrix</span>
                <span className="text-[11px] font-normal text-[#8C6D62]">
                  {(formData.permissions || []).length} Granted
                </span>
              </Label>
              <div className="space-y-2 max-h-48 overflow-y-auto rounded-xl border border-amber-200 p-3 bg-amber-50/30">
                {AVAILABLE_PERMISSIONS.map((perm) => {
                  const isChecked = (formData.permissions || []).includes(perm.id);
                  return (
                    <label
                      key={perm.id}
                      className="flex items-center gap-2.5 text-xs text-[#2B120C] hover:bg-white/80 p-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTogglePermission(perm.id)}
                        className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                      />
                      <div className="flex-1">
                        <span className="font-medium">{perm.label}</span>
                        <span className="ml-2 text-[10px] text-[#8C6D62] font-semibold uppercase">
                          [{perm.category}]
                        </span>
                      </div>
                    </label>
                  );
                })}
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
                className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
              >
                {editingStaff ? "Update Staff Rights" : "Create Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
