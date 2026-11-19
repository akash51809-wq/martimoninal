import React, { useState } from "react";
import {
  INITIAL_FRANCHISES,
  type FranchiseBranch,
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
  Building2,
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  IndianRupee,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Award,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";

interface AdminFranchiseTabProps {
  onLogAction?: (action: string, target: string) => void;
}

export const AdminFranchiseTab: React.FC<AdminFranchiseTabProps> = ({
  onLogAction,
}) => {
  const { toast } = useToast();
  const [franchises, setFranchises] =
    useState<FranchiseBranch[]>(INITIAL_FRANCHISES);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFranchise, setEditingFranchise] =
    useState<FranchiseBranch | null>(null);
  const [assignUserModal, setAssignUserModal] =
    useState<FranchiseBranch | null>(null);
  const [assignUserId, setAssignUserId] = useState("");

  const [formData, setFormData] = useState<Partial<FranchiseBranch>>({
    name: "",
    code: "",
    city: "",
    state: "",
    managerName: "",
    phone: "",
    email: "",
    address: "",
    commissionRate: 20,
    status: "Active",
  });

  const filteredFranchises = franchises.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.managerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenueNumber = franchises.reduce((acc, f) => {
    const num = parseInt(f.totalRevenue.replace(/[^0-9]/g, ""), 10) || 0;
    return acc + num;
  }, 0);

  const totalActiveUsers = franchises.reduce(
    (acc, f) => acc + f.activeUsersCount,
    0
  );

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      code: `VKL-${Math.floor(100 + Math.random() * 900)}`,
      city: "",
      state: "",
      managerName: "",
      phone: "+91 ",
      email: "",
      address: "",
      commissionRate: 20,
      status: "Active",
    });
    setEditingFranchise(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (f: FranchiseBranch) => {
    setEditingFranchise(f);
    setFormData({ ...f });
    setIsAddModalOpen(true);
  };

  const handleSaveFranchise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.city || !formData.managerName) {
      toast({
        title: "Validation Error",
        description: "Please fill in Franchise Name, City, and Manager Name.",
        variant: "destructive",
      });
      return;
    }

    if (editingFranchise) {
      setFranchises((prev) =>
        prev.map((f) =>
          f.id === editingFranchise.id
            ? ({
                ...f,
                ...formData,
              } as FranchiseBranch)
            : f
        )
      );
      onLogAction?.("Updated Franchise Branch", formData.name || "");
      toast({
        title: "Franchise Updated",
        description: `${formData.name} details have been saved.`,
      });
    } else {
      const newFranchise: FranchiseBranch = {
        id: `fr-${Date.now()}`,
        name: formData.name || "New Branch",
        code: formData.code || `VKL-${Date.now().toString().slice(-4)}`,
        city: formData.city || "",
        state: formData.state || "Maharashtra",
        managerName: formData.managerName || "",
        phone: formData.phone || "",
        email: formData.email || "",
        address: formData.address || "",
        activeUsersCount: 0,
        totalRevenue: "Rs 0",
        commissionRate: Number(formData.commissionRate) || 20,
        status: "Active",
      };
      setFranchises((prev) => [newFranchise, ...prev]);
      onLogAction?.("Created Franchise Branch", newFranchise.name);
      toast({
        title: "Franchise Created",
        description: `${newFranchise.name} has been provisioned.`,
      });
    }
    setIsAddModalOpen(false);
  };

  const handleDeleteFranchise = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the franchise "${name}"?`)) {
      setFranchises((prev) => prev.filter((f) => f.id !== id));
      onLogAction?.("Deleted Franchise Branch", name);
      toast({
        title: "Franchise Removed",
        description: `${name} has been deleted from records.`,
      });
    }
  };

  const handleAssignUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignUserId.trim() || !assignUserModal) return;

    setFranchises((prev) =>
      prev.map((f) =>
        f.id === assignUserModal.id
          ? { ...f, activeUsersCount: f.activeUsersCount + 1 }
          : f
      )
    );
    onLogAction?.(
      `Assigned User ${assignUserId} to Franchise`,
      assignUserModal.name
    );
    toast({
      title: "User Assigned to Franchise",
      description: `User ${assignUserId} successfully mapped to ${assignUserModal.name}.`,
    });
    setAssignUserId("");
    setAssignUserModal(null);
  };

  const exportFranchiseCsv = () => {
    const headers = [
      "Branch Code",
      "Branch Name",
      "City",
      "State",
      "Manager",
      "Phone",
      "Email",
      "Users",
      "Revenue",
      "Commission %",
      "Status",
    ];
    const rows = franchises.map((f) => [
      f.code,
      `"${f.name}"`,
      f.city,
      f.state,
      `"${f.managerName}"`,
      f.phone,
      f.email,
      f.activeUsersCount,
      f.totalRevenue,
      `${f.commissionRate}%`,
      f.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `VivahKarLo_Franchise_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Franchise Report Exported",
      description: "CSV report downloaded successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-[#EA580C] text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
                Franchise &amp; Branch Network
              </h1>
              <p className="text-xs sm:text-sm text-[#5C4740]">
                Manage offline matrimony bureaus, branch revenues, client allocations and partner commissions
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={exportFranchiseCsv}
            className="h-10 rounded-xl border-amber-300 text-[#2B120C] hover:bg-amber-50 text-xs font-semibold"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-600" />
            Export CSV
          </Button>
          <Button
            type="button"
            onClick={handleOpenAdd}
            className="h-10 rounded-xl bg-gradient-to-r from-amber-600 to-[#EA580C] hover:from-amber-700 hover:to-[#C2410C] text-white text-xs font-bold shadow-md shadow-amber-900/10"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Franchise Branch
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C6D62]">Total Active Branches</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold font-serif-royal text-[#2B120C] mt-2">
            {franchises.length}
          </p>
          <p className="text-[11px] text-[#5C4740] mt-1">
            Spread across {new Set(franchises.map((f) => f.city)).size} major cities
          </p>
        </div>

        <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C6D62]">Total Franchise Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-serif-royal text-emerald-900 mt-2">
            Rs {totalRevenueNumber.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-emerald-700 mt-1">Cumulative offline &amp; assisted bookings</p>
        </div>

        <div className="rounded-2xl p-4 bg-gradient-to-br from-blue-50 to-indigo-50/40 border border-blue-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C6D62]">Assigned Clients</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold font-serif-royal text-blue-900 mt-2">
            {totalActiveUsers.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-blue-700 mt-1">Managed by branch relationship managers</p>
        </div>

        <div className="rounded-2xl p-4 bg-gradient-to-br from-purple-50 to-pink-50/40 border border-purple-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C6D62]">Avg Commission Share</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold font-serif-royal text-purple-900 mt-2">
            {(
              franchises.reduce((acc, f) => acc + f.commissionRate, 0) /
              (franchises.length || 1)
            ).toFixed(1)}
            %
          </p>
          <p className="text-[11px] text-purple-700 mt-1">Standard franchise margin payout</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl bg-white border border-amber-200/80 p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6D62]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search branches by city, branch code, branch name or manager..."
            className="pl-10 h-10 rounded-xl border-amber-200 text-xs sm:text-sm text-[#2B120C] focus-visible:ring-amber-500"
          />
        </div>
      </div>

      {/* Franchise List Table */}
      <div className="rounded-2xl bg-white border border-amber-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-amber-50/60 border-b border-amber-200/80 text-[#8C6D62] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Branch &amp; Code</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Manager Contact</th>
                <th className="py-3 px-4 text-center">Active Clients</th>
                <th className="py-3 px-4">Total Revenue</th>
                <th className="py-3 px-4 text-center">Commission</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {filteredFranchises.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#8C6D62]">
                    No franchise branches matched your search query.
                  </td>
                </tr>
              ) : (
                filteredFranchises.map((f) => (
                  <tr key={f.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#2B120C]">{f.name}</div>
                      <div className="text-[11px] font-mono text-[#8C6D62]">{f.code}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-[#2B120C] font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#EA580C]" />
                        {f.city}, {f.state}
                      </div>
                      <div className="text-[11px] text-[#8C6D62] line-clamp-1 max-w-[200px]">
                        {f.address}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-[#2B120C] font-medium">{f.managerName}</div>
                      <div className="text-[11px] text-[#8C6D62] flex items-center gap-2">
                        <span>{f.phone}</span>
                        <span>•</span>
                        <span>{f.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant="outline" className="bg-amber-50 text-amber-900 border-amber-200 font-bold">
                        {f.activeUsersCount} Users
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-800">
                      {f.totalRevenue}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                        {f.commissionRate}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          f.status === "Active"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setAssignUserModal(f)}
                          className="h-8 px-2 text-xs text-blue-700 hover:bg-blue-50 hover:text-blue-900 rounded-lg"
                          title="Assign Client"
                        >
                          <Users className="w-3.5 h-3.5 mr-1" />
                          Assign
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(f)}
                          className="h-8 w-8 p-0 text-amber-700 hover:bg-amber-100/60 rounded-lg"
                          title="Edit Branch"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFranchise(f.id, f.name)}
                          className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete Branch"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Franchise Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6 bg-white border border-amber-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif-royal text-xl font-bold text-[#2B120C]">
              {editingFranchise ? "Edit Franchise Branch" : "Add New Franchise Branch"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveFranchise} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Branch Name *</Label>
                <Input
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pune Central Hub"
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Branch Code *</Label>
                <Input
                  required
                  value={formData.code || ""}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. VKL-PUN-01"
                  className="rounded-xl border-amber-200 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">City *</Label>
                <Input
                  required
                  value={formData.city || ""}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Pune"
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">State</Label>
                <Input
                  value={formData.state || ""}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Maharashtra"
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Branch Manager *</Label>
                <Input
                  required
                  value={formData.managerName || ""}
                  onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                  placeholder="e.g. Sanjay Deshpande"
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Phone Number</Label>
                <Input
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98220 11223"
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Email Address</Label>
                <Input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="pune.branch@vivahkarlo.in"
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">Commission Rate (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.commissionRate || 20}
                  onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#2B120C]">Office Address</Label>
              <Input
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full address of franchise premises"
                className="rounded-xl border-amber-200 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold"
              >
                {editingFranchise ? "Save Changes" : "Create Branch"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assign User Modal */}
      <Dialog open={Boolean(assignUserModal)} onOpenChange={() => setAssignUserModal(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-white border border-amber-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif-royal text-lg font-bold text-[#2B120C]">
              Assign User to {assignUserModal?.name}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAssignUser} className="space-y-4 pt-2">
            <p className="text-xs text-[#5C4740]">
              Enter the User ID or Phone Number to map the client account to this branch office.
            </p>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#2B120C]">User ID / Mobile Number</Label>
              <Input
                required
                value={assignUserId}
                onChange={(e) => setAssignUserId(e.target.value)}
                placeholder="e.g. usr-active-complete or 9876543210"
                className="rounded-xl border-amber-200 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAssignUserModal(null)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Confirm Allocation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
