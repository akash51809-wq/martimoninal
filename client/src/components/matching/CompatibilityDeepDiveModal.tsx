import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Sparkles,
  Heart,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  UserCheck,
  Compass,
  Briefcase,
  GraduationCap,
  Home,
  Utensils,
  Wine,
  Scale,
  Smile,
  ArrowRight,
  TrendingUp,
  Award,
} from "lucide-react";

interface CompatibilityDeepDiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewerId?: string;
  candidateId: string | null;
  candidateName?: string;
  onSendInterest?: () => void;
  hasSentInterest?: boolean;
}

export const CompatibilityDeepDiveModal: React.FC<CompatibilityDeepDiveModalProps> = ({
  isOpen,
  onClose,
  viewerId = "usr-active-complete",
  candidateId,
  candidateName,
  onSendInterest,
  hasSentInterest = false,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"success" | "multidimensional" | "personality" | "mutual">("success");

  useEffect(() => {
    if (!isOpen || !candidateId) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(`/api/v1/matches/compatibility-detail/${encodeURIComponent(viewerId)}/${encodeURIComponent(candidateId)}`)
      .then((res) => res.json())
      .then((resData) => {
        if (!isMounted) return;
        if (!resData.success) {
          throw new Error(resData.error || "Failed to load deep compatibility details.");
        }
        setData(resData);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        console.error("Error loading compatibility deep dive:", err);
        setError(err.message || "Failed to connect to compatibility engine.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, candidateId, viewerId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#FFFDF9] rounded-3xl border border-amber-200/90 shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-900 via-[#7C2D12] to-amber-900 text-white border-b border-amber-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-200">
                <span>AI Algorithmic Compatibility Deep Dive</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-300">Live Analysis</span>
              </div>
              <h2 className="font-serif-royal text-xl sm:text-2xl font-bold leading-tight">
                {candidateName || data?.candidate?.name || "Candidate"} & You
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-amber-50/90 border-b border-amber-200/70 text-xs font-bold text-[#5C4740]">
          <button
            type="button"
            onClick={() => setActiveTab("success")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all ${
              activeTab === "success"
                ? "bg-white text-[#7C2D12] shadow-sm border border-amber-200"
                : "hover:bg-amber-100/60 text-[#7C2D12]/70"
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#EA580C]" />
            <span className="hidden sm:inline">Match Success</span> Probability
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("multidimensional")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all ${
              activeTab === "multidimensional"
                ? "bg-white text-[#7C2D12] shadow-sm border border-amber-200"
                : "hover:bg-amber-100/60 text-[#7C2D12]/70"
            }`}
          >
            <Scale className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Multidimensional</span> Score
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("personality")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all ${
              activeTab === "personality"
                ? "bg-white text-[#7C2D12] shadow-sm border border-amber-200"
                : "hover:bg-amber-100/60 text-[#7C2D12]/70"
            }`}
          >
            <Smile className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">Personality</span> Alignment
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("mutual")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all ${
              activeTab === "mutual"
                ? "bg-white text-[#7C2D12] shadow-sm border border-amber-200"
                : "hover:bg-amber-100/60 text-[#7C2D12]/70"
            }`}
          >
            <UserCheck className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">2-Way Mutual</span> Fit
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-amber-200 border-t-[#EA580C] rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold text-[#5C4740]">
                Computing multidimensional compatibility & marriage success probability...
              </p>
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
              <h3 className="font-bold text-rose-900">Analysis Unavailable</h3>
              <p className="text-xs text-rose-700">{error}</p>
            </div>
          ) : data ? (
            <>
              {/* TAB 1: MATCH SUCCESS PROBABILITY */}
              {activeTab === "success" && (
                <div className="space-y-6">
                  {/* Hero Metric Banner */}
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF8EE] via-amber-50 to-orange-50 border border-amber-200/90 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="space-y-2 text-center sm:text-left">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-800">
                          <Award className="w-3.5 h-3.5 text-emerald-600" />
                          {data.matchSuccessReport.stabilityGrade}
                        </span>
                        <h3 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
                          Predictive Match Success Probability
                        </h3>
                        <p className="text-sm text-[#5C4740] max-w-lg">
                          Synthesized across Vedic Ashtakoot, lifestyle synchronization, educational parity, and mutual partner criteria.
                        </p>
                      </div>

                      {/* Percentage Ring Card */}
                      <div className="flex flex-col items-center justify-center w-36 h-36 rounded-3xl bg-white border-2 border-amber-300 shadow-md p-4 text-center">
                        <span className="text-4xl font-extrabold font-serif-royal text-[#7C2D12]">
                          {data.matchSuccessReport.successProbability}%
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 mt-1">
                          {data.matchSuccessReport.confidenceLevel} Confidence
                        </span>
                        <span className="text-[10px] text-[#5C4740]">Marriage Stability</span>
                      </div>
                    </div>

                    {/* Advisory Banner */}
                    <div className="mt-6 p-4 rounded-2xl bg-white/90 border border-amber-200/80 text-xs sm:text-sm text-[#3E2723] flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#7C2D12] block mb-0.5">Senior Matchmaker AI Advisory:</span>
                        {data.matchSuccessReport.advisoryNote}
                      </div>
                    </div>
                  </div>

                  {/* 5 Factors Breakdown Table */}
                  <div className="bg-white rounded-3xl border border-amber-200/90 p-5 sm:p-6 space-y-4">
                    <h4 className="font-serif-royal text-lg font-bold text-[#2B120C]">
                      Comprehensive Factor Impact Breakdown
                    </h4>

                    <div className="space-y-3">
                      {data.matchSuccessReport.factorsBreakdown.map((item: any, i: number) => (
                        <div
                          key={i}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 gap-2.5"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#2B120C]">{item.pillar}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-[#7C2D12] font-semibold">
                                Weight: {item.weightPct}%
                              </span>
                            </div>
                            <div className="w-48 sm:w-64 h-2 bg-amber-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                                style={{ width: `${item.score}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-sm font-extrabold text-[#7C2D12]">{item.score}%</span>
                            <span
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                item.verdict === "Strong Positive"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : item.verdict === "Favorable"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {item.verdict}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Marriage Strengths */}
                  <div className="bg-white rounded-3xl border border-amber-200/90 p-5 sm:p-6 space-y-3">
                    <h4 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      Key Foundational Strengths of this Alliance
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {data.matchSuccessReport.keyStrengths.map((str: string, i: number) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs font-semibold text-emerald-900"
                        >
                          <span className="text-emerald-600 text-sm">✦</span>
                          <span>{str}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MULTIDIMENSIONAL SCORE */}
              {activeTab === "multidimensional" && (
                <div className="space-y-6">
                  {/* Overall Composite */}
                  <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                        Programme 02 • Multidimensional Score
                      </span>
                      <h3 className="font-serif-royal text-2xl font-bold text-[#2B120C] mt-1">
                        Composite Harmony Rating
                      </h3>
                      <p className="text-xs text-[#5C4740] mt-1">
                        Granular cross-evaluation of everyday living habits, cultural roots, and career standing.
                      </p>
                    </div>
                    <div className="text-center px-6 py-3 rounded-2xl bg-white border border-amber-200 shadow-sm">
                      <span className="text-3xl font-extrabold font-serif-royal text-[#7C2D12]">
                        {data.multidimensionalScore.compositeScore}%
                      </span>
                      <span className="block text-[11px] font-bold text-emerald-700">Overall Multidimensional</span>
                    </div>
                  </div>

                  {/* 3 Pillars Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 1. Lifestyle */}
                    <div className="bg-white rounded-3xl border border-amber-200 p-5 space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-[#EA580C]">
                            <Utensils className="w-5 h-5" />
                          </div>
                          <span className="text-xl font-bold font-serif-royal text-[#7C2D12]">
                            {data.multidimensionalScore.lifestyle.score}%
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#2B120C]">
                            {data.multidimensionalScore.lifestyle.label}
                          </h4>
                          <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {data.multidimensionalScore.lifestyle.status} Fit
                          </span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-[#5C4740] pt-2 border-t border-amber-100">
                          {data.multidimensionalScore.lifestyle.highlights.map((h: string, i: number) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* 2. Family */}
                    <div className="bg-white rounded-3xl border border-amber-200 p-5 space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-[#7C2D12]">
                            <Home className="w-5 h-5" />
                          </div>
                          <span className="text-xl font-bold font-serif-royal text-[#7C2D12]">
                            {data.multidimensionalScore.family.score}%
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#2B120C]">
                            {data.multidimensionalScore.family.label}
                          </h4>
                          <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {data.multidimensionalScore.family.status} Fit
                          </span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-[#5C4740] pt-2 border-t border-amber-100">
                          {data.multidimensionalScore.family.highlights.map((h: string, i: number) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* 3. Education & Career */}
                    <div className="bg-white rounded-3xl border border-amber-200 p-5 space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <span className="text-xl font-bold font-serif-royal text-[#7C2D12]">
                            {data.multidimensionalScore.educationCareer.score}%
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#2B120C]">
                            {data.multidimensionalScore.educationCareer.label}
                          </h4>
                          <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {data.multidimensionalScore.educationCareer.status} Fit
                          </span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-[#5C4740] pt-2 border-t border-amber-100">
                          {data.multidimensionalScore.educationCareer.highlights.map((h: string, i: number) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PERSONALITY ALIGNMENT */}
              {activeTab === "personality" && (
                <div className="space-y-6">
                  {/* Archetype Comparison Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">
                        Your Personality Archetype
                      </span>
                      <h4 className="font-serif-royal text-xl font-bold text-[#2B120C]">
                        ⚖️ Balanced Realist
                      </h4>
                      <p className="text-xs text-[#5C4740]">
                        Pragmatic, adaptable, and emotionally mature; balances career with family and tradition with modern comfort.
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-orange-50/60 border border-orange-200 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">
                        {data.candidate.name}&apos;s Archetype
                      </span>
                      <h4 className="font-serif-royal text-xl font-bold text-[#2B120C]">
                        {data.candidate.personality.archetypeBadge}
                      </h4>
                      <p className="text-xs text-[#5C4740]">
                        {data.candidate.personality.archetypeDescription}
                      </p>
                    </div>
                  </div>

                  {/* Archetype Synergy Banner */}
                  <div className="p-4 rounded-2xl bg-white border border-amber-200 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-[#7C2D12]">Psychometric Synergy Vector</span>
                      <p className="text-xs text-[#5C4740]">{data.personalityCompatibility.archetypeSynergy}</p>
                    </div>
                    <span className="text-2xl font-extrabold font-serif-royal text-purple-700 shrink-0">
                      {data.personalityCompatibility.compatibilityScore}%
                    </span>
                  </div>

                  {/* 5 Dimensions Vector Comparison */}
                  <div className="bg-white rounded-3xl border border-amber-200 p-5 sm:p-6 space-y-4">
                    <h4 className="font-serif-royal text-lg font-bold text-[#2B120C]">
                      5-Dimensional Trait Alignment
                    </h4>

                    <div className="space-y-3.5">
                      {data.personalityCompatibility.dimensionComparisons.map((dim: any, i: number) => (
                        <div key={i} className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-100 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#2B120C]">{dim.dimension}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                dim.harmonyStatus === "Optimal Alignment"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : dim.harmonyStatus === "Healthy Complement"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {dim.harmonyStatus}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-[#5C4740]">
                            <span>You: Level {dim.userLevel}/5</span>
                            <span className="text-[10px] text-[#7C2D12] font-semibold">
                              Δ Variance: {dim.difference === 0 ? "Perfect Match" : `${dim.difference} pt`}
                            </span>
                            <span>{data.candidate.name}: Level {dim.candidateLevel}/5</span>
                          </div>

                          <div className="relative w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                            <div
                              className="absolute top-0 bottom-0 bg-purple-500 rounded-full"
                              style={{
                                left: `${Math.min(dim.userLevel, dim.candidateLevel) * 20 - 10}%`,
                                width: `${Math.max(1, Math.abs(dim.userLevel - dim.candidateLevel) + 1) * 20}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Synergies & Growth Areas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                      <h5 className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Natural Synergies
                      </h5>
                      <ul className="text-xs text-emerald-800 space-y-1">
                        {data.personalityCompatibility.synergies.map((s: string, idx: number) => (
                          <li key={idx}>• {s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
                      <h5 className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-amber-600" />
                        Suggested Discussion Points
                      </h5>
                      <ul className="text-xs text-amber-800 space-y-1">
                        {data.personalityCompatibility.growthAreas.length > 0 ? (
                          data.personalityCompatibility.growthAreas.map((g: string, idx: number) => (
                            <li key={idx}>• {g}</li>
                          ))
                        ) : (
                          <li>• Both of you share closely aligned temperaments; enjoy getting to know each other&apos;s daily routines!</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: 2-WAY MUTUAL FIT */}
              {activeTab === "mutual" && (
                <div className="space-y-6">
                  {/* Mutual Score Banner */}
                  <div className="p-6 rounded-3xl bg-rose-50/70 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                        Programme 06 • Bidirectional Preference Match
                      </span>
                      <h3 className="font-serif-royal text-2xl font-bold text-[#2B120C]">
                        100% Reciprocal Criteria Verification
                      </h3>
                      <p className="text-xs text-[#5C4740] max-w-md">
                        {data.twoWayMutualMatch.summary}
                      </p>
                    </div>

                    <div className="text-center px-6 py-3 rounded-2xl bg-white border border-rose-200 shadow-sm">
                      <span className="text-3xl font-extrabold font-serif-royal text-rose-600">
                        {data.twoWayMutualMatch.mutualScore}%
                      </span>
                      <span className="block text-[11px] font-bold text-rose-800">Mutual Fit Score</span>
                    </div>
                  </div>

                  {/* 2-Way Percentage Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                    <div className="p-4 rounded-2xl bg-white border border-amber-200">
                      <span className="text-xs text-[#5C4740]">Candidate Satisfies Your Criteria:</span>
                      <span className="block text-2xl font-bold text-[#7C2D12] mt-1">
                        {data.twoWayMutualMatch.candidateSatisfiesUserPct}%
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-amber-200">
                      <span className="text-xs text-[#5C4740]">You Satisfy Candidate&apos;s Criteria:</span>
                      <span className="block text-2xl font-bold text-[#7C2D12] mt-1">
                        {data.twoWayMutualMatch.userSatisfiesCandidatePct}%
                      </span>
                    </div>
                  </div>

                  {/* 7-Criteria Checklist Table */}
                  <div className="bg-white rounded-3xl border border-amber-200 overflow-hidden shadow-sm">
                    <div className="px-5 py-3.5 bg-amber-50/80 border-b border-amber-200 text-xs font-bold text-[#7C2D12] grid grid-cols-12 gap-2">
                      <span className="col-span-4">Criteria</span>
                      <span className="col-span-4">Your Profile</span>
                      <span className="col-span-4">Candidate Profile</span>
                    </div>

                    <div className="divide-y divide-amber-100">
                      {data.twoWayMutualMatch.checks.map((check: any, idx: number) => (
                        <div key={idx} className="px-5 py-3 text-xs grid grid-cols-12 gap-2 items-center hover:bg-amber-50/30">
                          <span className="col-span-4 font-bold text-[#2B120C]">
                            {check.criteriaName}
                          </span>
                          <span className="col-span-4 flex items-center gap-1.5 text-[#5C4740]">
                            {check.userSatisfiesCandidate ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                            )}
                            <span className="truncate">{check.userDetail}</span>
                          </span>
                          <span className="col-span-4 flex items-center gap-1.5 text-[#5C4740]">
                            {check.candidateSatisfiesUser ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                            )}
                            <span className="truncate">{check.candidateDetail}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 sm:p-5 bg-[#FFFDF9] border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#5C4740]">
            Vedic Ashtakoot, Multidimensional, & Psychometric indices calculated in real-time.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none rounded-xl border-amber-200 text-[#5C4740] hover:bg-amber-50"
            >
              Close
            </Button>

            {onSendInterest && (
              <Button
                type="button"
                onClick={onSendInterest}
                className={`flex-1 sm:flex-none rounded-xl text-xs font-bold transition-all ${
                  hasSentInterest
                    ? "bg-rose-50 text-rose-700 border border-rose-300"
                    : "bg-saffron-gradient text-white shadow-saffron-sm"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 mr-1.5 ${hasSentInterest ? "fill-rose-600" : ""}`} />
                {hasSentInterest ? "Interest Sent" : "Send Express Interest"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
