import React, { useState } from "react";
import {
  Zap,
  Play,
  Pause,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  ShieldCheck,
  UserX,
  CreditCard,
  Bell,
  Headphones,
  Calendar,
  Layers,
  History,
  FileText,
  Activity,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AutomationRule,
  INITIAL_AUTOMATION_RULES,
} from "@/data/adminMockData";

interface AdminAutomationTabProps {
  onNavigateTab?: (tab: string) => void;
}

export default function AdminAutomationTab({
  onNavigateTab,
}: AdminAutomationTabProps) {
  const { toast } = useToast();
  const [rules, setRules] = useState<AutomationRule[]>(
    INITIAL_AUTOMATION_RULES
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [activeConfigRule, setActiveConfigRule] =
    useState<AutomationRule | null>(null);

  // Filter rules
  const filteredRules = rules.filter((r) => {
    if (selectedCategory === "all") return true;
    return r.category === selectedCategory;
  });

  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === ruleId) {
          const nextState = !r.enabled;
          toast({
            title: nextState ? "Rule Enabled" : "Rule Disabled",
            description: `'${r.name}' is now ${
              nextState ? "active and scheduled" : "paused"
            }.`,
          });
          return { ...r, enabled: nextState };
        }
        return r;
      })
    );
  };

  const handleRunSingleRule = (rule: AutomationRule) => {
    toast({
      title: "Executing Automation Job...",
      description: `Running '${rule.name}' across database tables.`,
    });

    setTimeout(() => {
      setRules((prev) =>
        prev.map((r) =>
          r.id === rule.id
            ? {
                ...r,
                lastRun: "Just now",
                actionsTakenCount: r.actionsTakenCount + 1,
              }
            : r
        )
      );
      toast({
        title: "Execution Completed",
        description: `Job '${rule.name}' finished cleanly. Updated records.`,
      });
    }, 600);
  };

  const handleRunAllJobs = () => {
    setIsRunningAll(true);
    toast({
      title: "Batch Automation Triggered",
      description: "Triggering all 8 background administrative cron tasks...",
    });

    setTimeout(() => {
      setIsRunningAll(false);
      setRules((prev) =>
        prev.map((r) => ({
          ...r,
          lastRun: "Just now",
          actionsTakenCount: r.actionsTakenCount + (r.enabled ? 2 : 0),
        }))
      );
      toast({
        title: "All Automation Jobs Completed",
        description:
          "Successfully processed incomplete profiles, fraud checks, payment webhooks, and renewal alerts.",
      });
    }, 1200);
  };

  const handleSaveConfig = () => {
    if (!activeConfigRule) return;
    setRules((prev) =>
      prev.map((r) => (r.id === activeConfigRule.id ? activeConfigRule : r))
    );
    toast({
      title: "Rule Configuration Saved",
      description: `Updated runtime parameters for '${activeConfigRule.name}'.`,
    });
    setActiveConfigRule(null);
  };

  const totalActive = rules.filter((r) => r.enabled).length;
  const totalActions = rules.reduce((acc, r) => acc + r.actionsTakenCount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#3B0A18] via-[#5A0E24] to-[#8B1E3F] text-amber-50 rounded-2xl p-6 shadow-md border border-amber-900/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
              <Zap className="w-3.5 h-3.5" />
              Automated Operations & Event Triggers
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-100">
              Automation Rules Engine
            </h1>
            <p className="text-sm text-amber-200/80 mt-1 max-w-2xl">
              Zero-touch cron daemon handles automated profile rejection, fake
              account quarantines, membership expirations, payment
              auto-activations, renewal reminders, ticket dispatch, and inactive
              sweeps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isRunningAll}
              onClick={handleRunAllJobs}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRunningAll ? "animate-spin" : ""}`}
              />
              {isRunningAll ? "Executing Scheduled Cron..." : "Run All Jobs Now"}
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-amber-800/40">
          <div className="bg-black/20 rounded-xl p-3 border border-amber-700/30">
            <div className="text-xs text-amber-300/80 font-medium">
              Active Engines
            </div>
            <div className="text-2xl font-bold text-amber-100 mt-1">
              {totalActive} / {rules.length}
            </div>
            <div className="text-[11px] text-amber-200/60 mt-0.5">
              Scheduled background tasks
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-3 border border-emerald-500/30">
            <div className="text-xs text-emerald-300 font-medium">
              Total Actions Executed
            </div>
            <div className="text-2xl font-bold text-emerald-200 mt-1">
              {totalActions.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-200/60 mt-0.5">
              Automated actions taken
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-3 border border-blue-500/30">
            <div className="text-xs text-blue-300 font-medium">
              Cron Dispatch Health
            </div>
            <div className="text-2xl font-bold text-blue-200 mt-1">
              100% OK
            </div>
            <div className="text-[11px] text-blue-200/60 mt-0.5">
              Zero failure rate
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-3 border border-purple-500/30">
            <div className="text-xs text-purple-300 font-medium">
              Daemon Interval
            </div>
            <div className="text-2xl font-bold text-purple-200 mt-1">
              Real-time
            </div>
            <div className="text-[11px] text-purple-200/60 mt-0.5">
              Event hook + 15m polling
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-3">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Rules (8)" },
            { id: "profile", label: "Profile Integrity" },
            { id: "security", label: "Fraud & Security" },
            { id: "membership", label: "Membership & Billing" },
            { id: "support", label: "CRM & Support" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === cat.id
                  ? "bg-[#3B0A18] text-amber-100 shadow-sm"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule) => {
          return (
            <div
              key={rule.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-sm flex flex-col justify-between ${
                rule.enabled
                  ? "border-stone-200 hover:border-amber-400"
                  : "border-stone-200 opacity-60 bg-stone-50/50"
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        rule.category === "security"
                          ? "bg-rose-100 text-rose-700"
                          : rule.category === "membership"
                          ? "bg-purple-100 text-purple-700"
                          : rule.category === "support"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {rule.category === "security" && (
                        <UserX className="w-4 h-4" />
                      )}
                      {rule.category === "membership" && (
                        <CreditCard className="w-4 h-4" />
                      )}
                      {rule.category === "support" && (
                        <Headphones className="w-4 h-4" />
                      )}
                      {rule.category === "profile" && (
                        <ShieldCheck className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-stone-900">
                        {rule.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono text-stone-400 uppercase">
                          {rule.id}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="text-[11px] text-stone-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          Every {rule.intervalMinutes} min
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggleRule(rule.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      rule.enabled ? "bg-emerald-600" : "bg-stone-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        rule.enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                  {rule.description}
                </p>

                {/* Configuration Parameters Pill */}
                <div className="mt-3.5 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                  <div className="font-semibold text-stone-800 text-[10px] uppercase tracking-wider">
                    Current Configuration Parameters:
                  </div>
                  <div className="font-mono text-stone-600 break-all">
                    {Object.entries(rule.config).map(([k, v]) => (
                      <span
                        key={k}
                        className="inline-block mr-2 px-1.5 py-0.5 bg-white border border-stone-200 rounded text-[10px]"
                      >
                        {k}: <strong>{String(v)}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div className="text-xs text-stone-500">
                  Actions taken:{" "}
                  <strong className="text-stone-800 font-bold">
                    {rule.actionsTakenCount}
                  </strong>{" "}
                  times • <span className="text-[11px]">Last: {rule.lastRun}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveConfigRule(rule)}
                    className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors text-xs flex items-center gap-1"
                    title="Configure Parameters"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRunSingleRule(rule)}
                    className="px-2.5 py-1 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                    Run Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Execution Audit Stream Log */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-sm text-stone-900">
              Recent Automated Execution Audit Logs
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-mono">
            Daemon PID: #3904 (Healthy)
          </span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {[
            {
              time: "10 mins ago",
              rule: "Auto Expire Membership",
              res: "Scanned 14,800 users. 3 accounts expired. Downgraded to 'free' and sent WhatsApp renewal alerts.",
              status: "SUCCESS",
            },
            {
              time: "25 mins ago",
              rule: "Auto Assign Support Ticket",
              res: "2 unassigned incoming helpdesk tickets routed to 'VIP Relationship Desk'.",
              status: "SUCCESS",
            },
            {
              time: "1 hour ago",
              rule: "Auto Activate Membership on Payment",
              res: "Webhook verified for TXN-UPI-884192. Upgraded user usr-102 to 'Platinum' for 12 months.",
              status: "SUCCESS",
            },
            {
              time: "2 hours ago",
              rule: "Smart Inactive User Identification",
              res: "Flagged 12 accounts with no activity > 90 days. Deactivated discoverability flags.",
              status: "SUCCESS",
            },
          ].map((log, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-stone-400 font-bold">
                  [{log.time}]
                </span>
                <span className="text-stone-800 font-bold">{log.rule}:</span>
                <span className="text-stone-600">{log.res}</span>
              </div>
              <span className="self-start md:self-auto px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Modal */}
      {activeConfigRule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  Configure: {activeConfigRule.name}
                </h3>
                <span className="text-xs text-stone-500">
                  Rule ID: {activeConfigRule.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveConfigRule(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700">
                  Execution Interval (Minutes):
                </label>
                <input
                  type="number"
                  value={activeConfigRule.intervalMinutes}
                  onChange={(e) =>
                    setActiveConfigRule({
                      ...activeConfigRule,
                      intervalMinutes: Number(e.target.value),
                    })
                  }
                  className="w-full mt-1 p-2 text-xs border border-stone-200 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700">
                  Rule Parameters (JSON Key/Value):
                </label>
                <div className="space-y-2 mt-1">
                  {Object.entries(activeConfigRule.config).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-stone-600 w-1/2 truncate">
                        {key}
                      </span>
                      <input
                        type="text"
                        value={String(val)}
                        onChange={(e) => {
                          const nextVal =
                            !isNaN(Number(e.target.value)) &&
                            e.target.value.trim() !== ""
                              ? Number(e.target.value)
                              : e.target.value === "true"
                              ? true
                              : e.target.value === "false"
                              ? false
                              : e.target.value;
                          setActiveConfigRule({
                            ...activeConfigRule,
                            config: {
                              ...activeConfigRule.config,
                              [key]: nextVal,
                            },
                          });
                        }}
                        className="w-1/2 p-1.5 text-xs border border-stone-200 rounded-lg font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setActiveConfigRule(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveConfig}
                className="px-4 py-2 text-xs font-bold text-white bg-[#3B0A18] hover:bg-[#5A0E24] rounded-lg"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
