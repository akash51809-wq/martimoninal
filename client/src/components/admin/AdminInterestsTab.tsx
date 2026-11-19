import React, { useState } from "react";
import {
  INITIAL_INTERESTS_AUDIT,
  type InterestAuditItem,
} from "@/data/adminMockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Sliders,
  Sparkles,
  ArrowRight,
  Trash2,
  AlertTriangle,
} from "lucide-react";

interface AdminInterestsTabProps {
  onLogAction?: (action: string, target: string) => void;
}

export const AdminInterestsTab: React.FC<AdminInterestsTabProps> = ({
  onLogAction,
}) => {
  const { toast } = useToast();
  const [interests, setInterests] =
    useState<InterestAuditItem[]>(INITIAL_INTERESTS_AUDIT);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Limits Settings State
  const [dailyFreeLimit, setDailyFreeLimit] = useState(5);
  const [dailyVipLimit, setDailyVipLimit] = useState(50);
  const [cooldownMinutes, setCooldownMinutes] = useState(10);

  const filteredInterests = interests.filter((item) => {
    if (statusFilter !== "all" && item.status.toLowerCase() !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.senderName.toLowerCase().includes(q) ||
        item.receiverName.toLowerCase().includes(q) ||
        item.senderId.toLowerCase().includes(q) ||
        item.receiverId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRevokeInterest = (id: string, senderName: string) => {
    setInterests((prev) => prev.filter((item) => item.id !== id));
    onLogAction?.("Revoked Spam Interest", `${senderName} (ID: ${id})`);
    toast({
      title: "Interest Revoked",
      description: `Interest request ${id} removed by administrative decree.`,
    });
  };

  const handleSaveLimits = () => {
    onLogAction?.(
      "Updated Platform Interest Limits",
      `Free: ${dailyFreeLimit}/day, VIP: ${dailyVipLimit}/day`
    );
    toast({
      title: "Interest Limits Saved",
      description: "Platform daily limits & bot cool-down parameters updated.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 text-white fill-white/80" />
            </div>
            <div>
              <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
                Interest &amp; Alliance Discovery Desk
              </h1>
              <p className="text-xs sm:text-sm text-[#5C4740]">
                Monitor sent &amp; received marriage interests, audit mutual acceptances, and tune bot defense limits
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-200 font-bold px-3 py-1">
            {interests.length} Monitored Requests
          </Badge>
        </div>
      </div>

      {/* Daily Limits Configuration Card */}
      <div className="rounded-2xl bg-white border border-amber-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#EA580C]" />
            <h3 className="font-serif-royal font-bold text-[#2B120C] text-sm sm:text-base">
              Interest Rate Limits &amp; Spam Shield Settings
            </h3>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleSaveLimits}
            className="h-8 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold"
          >
            Save Limit Rules
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#2B120C]">
              Free User Daily Cap
            </Label>
            <Input
              type="number"
              min="1"
              max="20"
              value={dailyFreeLimit}
              onChange={(e) => setDailyFreeLimit(Number(e.target.value))}
              className="rounded-xl border-amber-200 text-xs"
            />
            <p className="text-[11px] text-[#8C6D62]">Maximum interests free users can send per day</p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#2B120C]">
              VIP Member Daily Cap
            </Label>
            <Input
              type="number"
              min="10"
              max="200"
              value={dailyVipLimit}
              onChange={(e) => setDailyVipLimit(Number(e.target.value))}
              className="rounded-xl border-amber-200 text-xs"
            />
            <p className="text-[11px] text-[#8C6D62]">Allowed daily quota for Gold/Platinum VIPs</p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#2B120C]">
              Anti-Spam Rapid-Fire Delay (Sec)
            </Label>
            <Input
              type="number"
              min="1"
              max="60"
              value={cooldownMinutes}
              onChange={(e) => setCooldownMinutes(Number(e.target.value))}
              className="rounded-xl border-amber-200 text-xs"
            />
            <p className="text-[11px] text-[#8C6D62]">Minimum interval between two interest dispatches</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-white border border-amber-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6D62]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by sender or receiver name/ID..."
            className="pl-10 h-10 rounded-xl border-amber-200 text-xs sm:text-sm text-[#2B120C]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          {["all", "sent", "accepted", "pending", "rejected"].map((tab) => (
            <Button
              key={tab}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setStatusFilter(tab)}
              className={`h-9 px-3 rounded-xl text-xs font-bold capitalize ${
                statusFilter === tab
                  ? "bg-amber-100/80 text-[#2B120C]"
                  : "text-[#5C4740] hover:text-[#2B120C]"
              }`}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {/* Interests Ledger Table */}
      <div className="rounded-2xl bg-white border border-amber-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-amber-50/60 border-b border-amber-200/80 text-[#8C6D62] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Sender Member</th>
                <th className="py-3 px-4 text-center">Direction</th>
                <th className="py-3 px-4">Recipient Member</th>
                <th className="py-3 px-4">Dispatched At</th>
                <th className="py-3 px-4 text-center">Current Status</th>
                <th className="py-3 px-4 text-center">Spam Analysis</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {filteredInterests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#8C6D62]">
                    No interest transactions found for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredInterests.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.senderAvatar}
                          alt={item.senderName}
                          className="w-8 h-8 rounded-full object-cover border border-amber-200"
                        />
                        <div>
                          <div className="font-semibold text-[#2B120C]">{item.senderName}</div>
                          <div className="text-[11px] text-[#8C6D62] font-mono">{item.senderId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <ArrowRight className="w-4 h-4 text-amber-500 inline-block" />
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.receiverAvatar}
                          alt={item.receiverName}
                          className="w-8 h-8 rounded-full object-cover border border-amber-200"
                        />
                        <div>
                          <div className="font-semibold text-[#2B120C]">{item.receiverName}</div>
                          <div className="text-[11px] text-[#8C6D62] font-mono">{item.receiverId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#5C4740]">
                      {item.sentAt}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <Badge
                        variant="outline"
                        className={`font-bold ${
                          item.status === "Accepted"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : item.status === "Pending"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : item.status === "Rejected"
                            ? "bg-rose-50 text-rose-800 border-rose-200"
                            : "bg-blue-50 text-blue-800 border-blue-200"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {item.isFlaggedSpam ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Spam Bot Pattern
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Legitimate
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {item.isFlaggedSpam && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevokeInterest(item.id, item.senderName)}
                          className="h-8 px-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Revoke & Purge"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          Revoke
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
