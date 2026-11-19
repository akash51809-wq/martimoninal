import React, { useState } from "react";
import {
  ShieldAlert,
  Copy,
  GitMerge,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Fingerprint,
  Smartphone,
  Mail,
  Camera,
  Calendar,
  Layers,
  ArrowRight,
  Search,
  RefreshCw,
  Eye,
  Info,
  Archive,
  History,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DuplicateCluster,
  INITIAL_DUPLICATE_CLUSTERS,
} from "@/data/adminMockData";

interface AdminDuplicateDetectionTabProps {
  onNavigateUser?: (userId: string) => void;
}

export default function AdminDuplicateDetectionTab({
  onNavigateUser,
}: AdminDuplicateDetectionTabProps) {
  const { toast } = useToast();
  const [clusters, setClusters] = useState<DuplicateCluster[]>(
    INITIAL_DUPLICATE_CLUSTERS
  );
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Merge modal state
  const [mergeModalCluster, setMergeModalCluster] =
    useState<DuplicateCluster | null>(null);
  const [masterChoice, setMasterChoice] = useState<"primary" | "duplicate">(
    "primary"
  );
  const [transferChats, setTransferChats] = useState<boolean>(true);
  const [transferInterests, setTransferInterests] = useState<boolean>(true);
  const [transferPlan, setTransferPlan] = useState<boolean>(true);
  const [isProcessingMerge, setIsProcessingMerge] = useState<boolean>(false);

  // Filter logic
  const filteredClusters = clusters.filter((item) => {
    const matchesSearch =
      item.primaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.duplicateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.primaryEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.duplicateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.primaryMobile.includes(searchTerm) ||
      item.duplicateMobile.includes(searchTerm);

    if (!matchesSearch) return false;

    if (selectedFilter === "all") return true;
    if (selectedFilter === "mobile-email") {
      return (
        item.matchReasons.includes("Same Mobile Number") ||
        item.matchReasons.includes("Same Email Address")
      );
    }
    if (selectedFilter === "photo-hash") {
      return item.matchReasons.includes("Same Photo Hash (MD5 Match)");
    }
    if (selectedFilter === "device") {
      return item.matchReasons.includes("Same Device Fingerprint");
    }
    if (selectedFilter === "name-dob") {
      return item.matchReasons.includes("Similar Name + Date of Birth");
    }
    if (selectedFilter === "family-phone") {
      return item.matchReasons.some(
        (r) =>
          r.toLowerCase().includes("family") ||
          r.toLowerCase().includes("father")
      );
    }
    if (selectedFilter === "merged") {
      return item.status === "Merged";
    }
    return true;
  });

  const handleOpenMerge = (cluster: DuplicateCluster) => {
    setMergeModalCluster(cluster);
    setMasterChoice("primary");
    setTransferChats(true);
    setTransferInterests(true);
    setTransferPlan(true);
  };

  const handleExecuteMerge = () => {
    if (!mergeModalCluster) return;
    setIsProcessingMerge(true);

    setTimeout(() => {
      setClusters((prev) =>
        prev.map((c) =>
          c.id === mergeModalCluster.id
            ? {
                ...c,
                status: "Merged" as const,
              }
            : c
        )
      );
      setIsProcessingMerge(false);
      const masterName =
        masterChoice === "primary"
          ? mergeModalCluster.primaryName
          : mergeModalCluster.duplicateName;
      const secondaryName =
        masterChoice === "primary"
          ? mergeModalCluster.duplicateName
          : mergeModalCluster.primaryName;

      toast({
        title: "Accounts Merged Successfully",
        description: `Transferred history from '${secondaryName}' to master account '${masterName}'. Secondary account has been archived.`,
      });
      setMergeModalCluster(null);
    }, 600);
  };

  const handleQuarantine = (cluster: DuplicateCluster) => {
    setClusters((prev) =>
      prev.map((c) =>
        c.id === cluster.id
          ? {
              ...c,
              status: "Quarantined" as const,
            }
          : c
      )
    );
    toast({
      title: "Account Quarantined",
      description: `Secondary profile '${cluster.duplicateName}' (${cluster.duplicateUserId}) has been suspended for duplicate policy violation.`,
      variant: "destructive",
    });
  };

  const handleDismiss = (cluster: DuplicateCluster) => {
    setClusters((prev) =>
      prev.map((c) =>
        c.id === cluster.id
          ? {
              ...c,
              status: "Dismissed" as const,
            }
          : c
      )
    );
    toast({
      title: "Cluster Dismissed",
      description: `Marked cluster ${cluster.id} as a verified independent user.`,
    });
  };

  // Metrics
  const totalClusters = clusters.length;
  const criticalCount = clusters.filter(
    (c) =>
      c.matchReasons.includes("Same Mobile Number") ||
      c.matchReasons.includes("Same Email Address")
  ).length;
  const photoHashCount = clusters.filter((c) =>
    c.matchReasons.includes("Same Photo Hash (MD5 Match)")
  ).length;
  const mergedCount = clusters.filter((c) => c.status === "Merged").length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#3B0A18] via-[#5A0E24] to-[#8B1E3F] text-amber-50 rounded-2xl p-6 shadow-md border border-amber-900/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              Non-AI Deterministic Duplicate Engine
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-100">
              Smart Duplicate User Detection
            </h1>
            <p className="text-sm text-amber-200/80 mt-1 max-w-2xl">
              Identifies duplicate & fraudulent clone accounts via exact mobile,
              email aliases, MD5 photo hash fingerprinting, hardware device IDs,
              and Phonetic Name + DOB matches without unreliable AI guesses.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setClusters(INITIAL_DUPLICATE_CLUSTERS);
                toast({
                  title: "Cluster Index Synced",
                  description: "Full database scan completed across all tables.",
                });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-xl text-sm transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Re-Scan Database
            </button>
          </div>
        </div>

        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-amber-800/40">
          <div className="bg-black/20 rounded-xl p-3 border border-amber-700/30">
            <div className="text-xs text-amber-300/80 font-medium">
              Total Suspect Clusters
            </div>
            <div className="text-2xl font-bold text-amber-100 mt-1">
              {totalClusters}
            </div>
            <div className="text-[11px] text-amber-200/60 mt-0.5">
              Active detection alerts
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-3 border border-rose-500/30">
            <div className="text-xs text-rose-300 font-medium">
              Exact Mobile / Email
            </div>
            <div className="text-2xl font-bold text-rose-200 mt-1">
              {criticalCount}
            </div>
            <div className="text-[11px] text-rose-200/60 mt-0.5">
              100% Deterministic match
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-3 border border-purple-500/30">
            <div className="text-xs text-purple-300 font-medium">
              Photo Hash (MD5) Matches
            </div>
            <div className="text-2xl font-bold text-purple-200 mt-1">
              {photoHashCount}
            </div>
            <div className="text-[11px] text-purple-200/60 mt-0.5">
              Identical uploaded image
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-3 border border-emerald-500/30">
            <div className="text-xs text-emerald-300 font-medium">
              Merged & Resolved
            </div>
            <div className="text-2xl font-bold text-emerald-200 mt-1">
              {mergedCount}
            </div>
            <div className="text-[11px] text-emerald-200/60 mt-0.5">
              Accounts unified by admin
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Detected Clusters" },
              { id: "mobile-email", label: "Same Mobile / Email" },
              { id: "photo-hash", label: "Photo Hash MD5" },
              { id: "device", label: "Device Fingerprint" },
              { id: "family-phone", label: "Family Phone Check" },
              { id: "name-dob", label: "Similar Name + DOB" },
              { id: "merged", label: "Merged History" },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setSelectedFilter(btn.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedFilter === btn.id
                    ? "bg-[#3B0A18] text-amber-100 shadow-sm"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user, email, phone..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3B0A18]"
            />
          </div>
        </div>
      </div>

      {/* Clusters List */}
      <div className="space-y-4">
        {filteredClusters.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">
              No Duplicate Accounts Found
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
              All active profiles adhere to unique credential, biometric photo
              hash, and device identity policies.
            </p>
          </div>
        ) : (
          filteredClusters.map((cluster) => {
            const isMerged = cluster.status === "Merged";
            const isQuarantined = cluster.status === "Quarantined";
            const isDismissed = cluster.status === "Dismissed";

            return (
              <div
                key={cluster.id}
                className={`bg-white rounded-2xl border transition-all shadow-sm ${
                  isMerged
                    ? "border-emerald-300 opacity-80"
                    : isQuarantined
                    ? "border-rose-300 opacity-80"
                    : "border-stone-200 hover:border-amber-400"
                }`}
              >
                {/* Cluster Header */}
                <div className="p-4 bg-stone-50/80 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 rounded-t-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-semibold text-stone-500">
                      CLUSTER #{cluster.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-stone-700">
                        Match Score:
                      </span>
                      <span
                        className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                          cluster.matchScore >= 95
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {cluster.matchScore}% Match
                      </span>
                    </div>

                    {isMerged && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Merged & Consolidated
                      </span>
                    )}
                    {isQuarantined && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                        Duplicate Quarantined
                      </span>
                    )}
                    {isDismissed && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-300">
                        Dismissed as False Positive
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-stone-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Detected: {cluster.detectedAt}
                  </div>
                </div>

                {/* Match Reasons Badges */}
                <div className="px-5 py-3 bg-amber-50/60 border-b border-amber-100 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-amber-900 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Triggered Deterministic Rules:
                  </span>
                  {cluster.matchReasons.map((reason, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white text-stone-800 border border-amber-300 shadow-2xs"
                    >
                      {reason.includes("Mobile") && (
                        <Smartphone className="w-3 h-3 text-rose-600" />
                      )}
                      {reason.includes("Email") && (
                        <Mail className="w-3 h-3 text-blue-600" />
                      )}
                      {reason.includes("Photo") && (
                        <Camera className="w-3 h-3 text-purple-600" />
                      )}
                      {reason.includes("Device") && (
                        <Fingerprint className="w-3 h-3 text-amber-700" />
                      )}
                      {reason.includes("Name") && (
                        <Copy className="w-3 h-3 text-stone-600" />
                      )}
                      {reason}
                    </span>
                  ))}
                </div>

                {/* Side-by-Side Comparison */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  {/* Primary Profile */}
                  <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        Original Account (Primary)
                      </span>
                      <span className="text-xs font-mono text-stone-500">
                        {cluster.primaryUserId}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={cluster.primaryAvatar}
                        alt={cluster.primaryName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-stone-200 shadow-sm"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">
                          {cluster.primaryName}
                        </h4>
                        <div className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-stone-400" />
                          {cluster.primaryEmail}
                        </div>
                        <div className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                          <Smartphone className="w-3 h-3 text-stone-400" />
                          {cluster.primaryMobile}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Duplicate Candidate Profile */}
                  <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
                        Suspect Duplicate (Secondary)
                      </span>
                      <span className="text-xs font-mono text-stone-500">
                        {cluster.duplicateUserId}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={cluster.duplicateAvatar}
                        alt={cluster.duplicateName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-rose-200 shadow-sm"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">
                          {cluster.duplicateName}
                        </h4>
                        <div className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-stone-400" />
                          {cluster.duplicateEmail}
                        </div>
                        <div className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                          <Smartphone className="w-3 h-3 text-stone-400" />
                          {cluster.duplicateMobile}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 rounded-b-2xl flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-stone-500 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-stone-400" />
                    Merged profiles will retain primary ID, consolidate
                    interests & chat conversations.
                  </div>

                  <div className="flex items-center gap-2">
                    {!isMerged && !isQuarantined && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDismiss(cluster)}
                          className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-300 rounded-lg transition-colors"
                        >
                          Dismiss False Positive
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuarantine(cluster)}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                        >
                          Quarantine Secondary
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenMerge(cluster)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#3B0A18] to-[#5A0E24] hover:from-[#5A0E24] hover:to-[#7A1332] rounded-lg shadow-sm transition-all"
                        >
                          <GitMerge className="w-3.5 h-3.5" />
                          Admin Merge Profiles
                        </button>
                      </>
                    )}
                    {(isMerged || isQuarantined || isDismissed) && (
                      <button
                        type="button"
                        onClick={() => {
                          setClusters((prev) =>
                            prev.map((c) =>
                              c.id === cluster.id
                                ? { ...c, status: "Detected" as const }
                                : c
                            )
                          );
                          toast({
                            title: "Cluster Status Reset",
                            description: "Moved back to active review queue.",
                          });
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-stone-600 bg-white border border-stone-300 rounded-lg hover:bg-stone-50"
                      >
                        Re-evaluate Cluster
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Admin Merge Profiles Modal */}
      {mergeModalCluster && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#3B0A18] to-[#5A0E24] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitMerge className="w-5 h-5 text-amber-300" />
                <h3 className="font-serif font-bold text-lg text-amber-100">
                  Consolidate & Merge Duplicate Profiles
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMergeModalCluster(null)}
                className="text-stone-300 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <p className="text-xs text-stone-600 leading-relaxed">
                Choose which account serves as the canonical{" "}
                <strong>Master Profile</strong>. The secondary account will be
                safely archived, and its historical interactions will be
                transferred to the master account.
              </p>

              {/* Master Account Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Select Master (Retained) Account:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setMasterChoice("primary")}
                    className={`cursor-pointer p-3 rounded-xl border text-xs transition-all ${
                      masterChoice === "primary"
                        ? "border-[#3B0A18] bg-amber-50 ring-2 ring-[#3B0A18]"
                        : "border-stone-200 bg-stone-50 hover:bg-white"
                    }`}
                  >
                    <div className="font-bold text-stone-900">
                      {mergeModalCluster.primaryName}
                    </div>
                    <div className="text-stone-500 font-mono text-[11px] mt-0.5">
                      {mergeModalCluster.primaryUserId}
                    </div>
                    <div className="text-stone-600 mt-1">
                      {mergeModalCluster.primaryEmail}
                    </div>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded text-[10px]">
                      Created First (Older)
                    </span>
                  </div>

                  <div
                    onClick={() => setMasterChoice("duplicate")}
                    className={`cursor-pointer p-3 rounded-xl border text-xs transition-all ${
                      masterChoice === "duplicate"
                        ? "border-[#3B0A18] bg-amber-50 ring-2 ring-[#3B0A18]"
                        : "border-stone-200 bg-stone-50 hover:bg-white"
                    }`}
                  >
                    <div className="font-bold text-stone-900">
                      {mergeModalCluster.duplicateName}
                    </div>
                    <div className="text-stone-500 font-mono text-[11px] mt-0.5">
                      {mergeModalCluster.duplicateUserId}
                    </div>
                    <div className="text-stone-600 mt-1">
                      {mergeModalCluster.duplicateEmail}
                    </div>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-amber-100 text-amber-800 font-semibold rounded text-[10px]">
                      Created Second (Newer)
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Migration Options */}
              <div className="space-y-2.5 bg-stone-50 rounded-xl p-4 border border-stone-200">
                <div className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Automated Migration Rules:
                </div>

                <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={transferChats}
                    onChange={(e) => setTransferChats(e.target.checked)}
                    className="rounded border-stone-300 text-[#3B0A18] focus:ring-[#3B0A18]"
                  />
                  <span>
                    Merge active chat threads and direct messaging history
                  </span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={transferInterests}
                    onChange={(e) => setTransferInterests(e.target.checked)}
                    className="rounded border-stone-300 text-[#3B0A18] focus:ring-[#3B0A18]"
                  />
                  <span>
                    Consolidate sent and received match interests into master
                  </span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={transferPlan}
                    onChange={(e) => setTransferPlan(e.target.checked)}
                    className="rounded border-stone-300 text-[#3B0A18] focus:ring-[#3B0A18]"
                  />
                  <span>
                    Retain highest tier subscription & active billing period
                  </span>
                </label>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  The secondary profile will be deactivated with status{" "}
                  <code>MERGED_ARCHIVED</code>. This prevents duplicate login
                  while ensuring no match or payment data is lost.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setMergeModalCluster(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessingMerge}
                onClick={handleExecuteMerge}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#3B0A18] to-[#5A0E24] hover:from-[#5A0E24] hover:to-[#7A1332] rounded-lg shadow-sm transition-all disabled:opacity-50"
              >
                {isProcessingMerge ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Consolidating Profiles...
                  </>
                ) : (
                  <>
                    <GitMerge className="w-3.5 h-3.5" />
                    Confirm & Merge Accounts
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
