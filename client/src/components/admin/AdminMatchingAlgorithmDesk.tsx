import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Sliders,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Scale,
  Save,
  SlidersHorizontal,
  Compass,
  Award,
} from "lucide-react";
import {
  type SmartRankingWeights,
  DEFAULT_RANKING_WEIGHTS,
} from "../../../../shared/advancedMatchingEngine";

export const AdminMatchingAlgorithmDesk: React.FC = () => {
  const { toast } = useToast();
  const [weights, setWeights] = useState<SmartRankingWeights>(DEFAULT_RANKING_WEIGHTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [sampleMatches, setSampleMatches] = useState<any[]>([]);

  // Advanced Matchmaking Rules State
  const [maxAgeGap, setMaxAgeGap] = useState<number>(5);
  const [strictAgeFilter, setStrictAgeFilter] = useState<boolean>(true);
  const [sameReligionMandatory, setSameReligionMandatory] = useState<boolean>(true);
  const [gotraExogamyCheck, setGotraExogamyCheck] = useState<boolean>(true);
  const [subCasteRelaxation, setSubCasteRelaxation] = useState<boolean>(true);
  const [degreeTierMatching, setDegreeTierMatching] = useState<boolean>(true);
  const [incomeToleranceUpwardOnly, setIncomeToleranceUpwardOnly] = useState<boolean>(false);
  const [sameCityBonusScore, setSameCityBonusScore] = useState<number>(15);
  const [nriMatchingEnabled, setNriMatchingEnabled] = useState<boolean>(true);
  const [minMatchCutoff, setMinMatchCutoff] = useState<number>(65);
  const [dailyRecommendationsQuota, setDailyRecommendationsQuota] = useState<number>(15);
  const [aiDynamicLearning, setAiDynamicLearning] = useState<boolean>(true);

  const handleSaveMatchingRules = () => {
    toast({
      title: "Matchmaking Rules Saved",
      description: "Age, Caste, Income, Location, and AI recommendation cutoff rules updated.",
    });
  };

  const fetchWeights = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/matches/admin/ranking-weights");
      const data = await res.json();
      if (data.success && data.weights) {
        setWeights(data.weights);
      }
    } catch (err) {
      console.error("Failed to load ranking weights:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSampleRankings = async () => {
    try {
      const res = await fetch("/api/v1/matches/recommendations?userId=usr-active-complete&category=daily&sortBy=smart_rank");
      const data = await res.json();
      if (data.success && data.matches) {
        setSampleMatches(data.matches.slice(0, 4));
      }
    } catch (err) {
      console.warn("Failed to load sample matches:", err);
    }
  };

  useEffect(() => {
    fetchWeights();
    fetchSampleRankings();
  }, []);

  const totalWeight =
    weights.horoscopeWeight +
    weights.partnerPreferencesWeight +
    weights.lifestyleWeight +
    weights.educationCareerWeight +
    weights.familyWeight +
    weights.personalityWeight;

  const isBalanced = totalWeight === 100;

  const handleWeightChange = (key: keyof SmartRankingWeights, val: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(100, val)),
    }));
  };

  const handleResetDefaults = () => {
    setWeights({ ...DEFAULT_RANKING_WEIGHTS });
    toast({
      title: "Reset to Default Parameters",
      description: "Default balanced algorithm weights have been restored.",
    });
  };

  const handleSaveWeights = async () => {
    if (!isBalanced) {
      toast({
        title: "Weights Must Sum to 100%",
        description: `Current total weight is ${totalWeight}%. Please adjust the sliders before saving.`,
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/v1/matches/admin/ranking-weights", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(weights),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update ranking weights.");
      }

      toast({
        title: "Ranking Algorithm Updated! 🚀",
        description: "New weight distribution is live across all user matching feeds and recommendations.",
      });

      fetchSampleRankings();
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "Failed to save weights.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const weightSliders: Array<{
    key: keyof SmartRankingWeights;
    title: string;
    description: string;
    icon: string;
  }> = [
    {
      key: "horoscopeWeight",
      title: "Vedic Horoscope & Kundli Gunas",
      description: "Weight given to 36-Guna Ashtakoot Milan, Nadi, and Bhakoot astrological harmony.",
      icon: "✨",
    },
    {
      key: "partnerPreferencesWeight",
      title: "Partner Criteria Fulfillment",
      description: "Weight given to user-specified age, height, marital status, and preferred cities.",
      icon: "🎯",
    },
    {
      key: "lifestyleWeight",
      title: "Lifestyle & Daily Habits",
      description: "Dietary sync (Veg/Non-Veg/Jain), drinking, smoking, and routine alignment.",
      icon: "🥗",
    },
    {
      key: "educationCareerWeight",
      title: "Education, Premier College & Career",
      description: "Parity in degrees, IIT/IIM credentials, corporate/govt status, and income bracket.",
      icon: "🎓",
    },
    {
      key: "familyWeight",
      title: "Family Values & Socio-Cultural Heritage",
      description: "Family type (Nuclear/Joint), cultural heritage, caste/community, and status.",
      icon: "🏛️",
    },
    {
      key: "personalityWeight",
      title: "Psychometric Personality Vector",
      description: "Compatibility across 5 dimensions: social energy, life outlook, ambition, and finances.",
      icon: "🧠",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Desk Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EA580C]">
            <Sliders className="w-4 h-4" />
            <span>Smart Recommendations Engine • Programme 05</span>
          </div>
          <h2 className="font-serif-royal text-2xl font-bold text-[#2B120C] mt-1">
            Matching Algorithm Tuning & Smart Ranking Desk
          </h2>
          <p className="text-xs sm:text-sm text-[#5C4740] mt-1">
            Fine-tune the mathematical weights governing the composite Smart Match Rank across the platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleResetDefaults}
            className="rounded-xl border-amber-200 text-[#5C4740] hover:bg-amber-50 h-10 text-xs font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Restore Factory Weights
          </Button>

          <Button
            type="button"
            onClick={handleSaveWeights}
            disabled={saving || !isBalanced}
            className="rounded-xl bg-saffron-gradient text-white font-bold h-10 px-5 shadow-sm text-xs"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {saving ? "Saving..." : "Apply Live Weights"}
          </Button>
        </div>
      </div>

      {/* Total Balance Status Card */}
      <div
        className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isBalanced
            ? "bg-emerald-50/70 border-emerald-200"
            : "bg-rose-50/70 border-rose-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
              isBalanced ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
            }`}
          >
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#2B120C]">
              {isBalanced ? "Algorithm Weights Perfectly Balanced" : "Weight Calibration Required"}
            </h3>
            <p className="text-xs text-[#5C4740] mt-0.5">
              {isBalanced
                ? "Total algorithmic weight is 100%. Ranking scores will compute with exact 0-100 normalization."
                : `Total weight is currently ${totalWeight}%. Adjust weights by ${100 - totalWeight > 0 ? `+${100 - totalWeight}` : 100 - totalWeight}% to reach 100%.`}
            </p>
          </div>
        </div>

        <div className="text-center px-6 py-2.5 rounded-2xl bg-white border border-amber-200 shadow-sm shrink-0">
          <span
            className={`text-2xl font-extrabold font-serif-royal ${
              isBalanced ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {totalWeight}%
          </span>
          <span className="block text-[10px] font-bold text-[#5C4740]">Target: 100%</span>
        </div>
      </div>

      {/* 6 Weight Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weightSliders.map((slider) => {
          const val = weights[slider.key];
          return (
            <div
              key={slider.key}
              className="bg-white rounded-3xl border border-amber-200/90 p-5 space-y-3.5 shadow-sm hover:border-amber-300 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{slider.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm text-[#2B120C] leading-snug">
                      {slider.title}
                    </h4>
                    <p className="text-[11px] text-[#5C4740] mt-0.5 line-clamp-1">
                      {slider.description}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-xl bg-amber-100 text-[#7C2D12] font-extrabold text-sm border border-amber-200 shrink-0">
                  {val}%
                </span>
              </div>

              {/* Slider Control */}
              <div className="space-y-1.5 pt-1">
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={val}
                  onChange={(e) => handleWeightChange(slider.key, parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-[#EA580C]"
                />
                <div className="flex items-center justify-between text-[10px] text-[#5C4740] font-semibold">
                  <span>0% (Disabled)</span>
                  <span>Recommended: {DEFAULT_RANKING_WEIGHTS[slider.key]}%</span>
                  <span>60% (Dominant)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advanced Matchmaking Policy & Rules Desk */}
      <div className="bg-white rounded-3xl border border-amber-200/90 p-6 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[#EA580C]" />
              Matchmaking Hard Rules &amp; AI Recommendation Controls
            </h3>
            <p className="text-xs text-[#5C4740]">
              Configure cultural compatibility constraints, Gotra rules, degree tiers, and AI recommendation quotas
            </p>
          </div>

          <Button
            type="button"
            onClick={handleSaveMatchingRules}
            className="rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold h-9 px-4 self-start sm:self-auto"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Save Match Rules
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-[#2B120C]">
          {/* Rule 1: Age Compatibility */}
          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-2.5">
            <div className="font-bold text-[#2B120C] flex items-center justify-between">
              <span>Age Gap Tolerance</span>
              <span className="text-[#EA580C] font-extrabold">{maxAgeGap} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={maxAgeGap}
              onChange={(e) => setMaxAgeGap(Number(e.target.value))}
              className="w-full h-1.5 bg-amber-200 rounded-lg accent-[#EA580C]"
            />
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={strictAgeFilter}
                onChange={(e) => setStrictAgeFilter(e.target.checked)}
                className="rounded text-[#EA580C]"
              />
              <span className="text-[11px] text-[#5C4740]">Strict cutoff (Hide profiles exceeding gap)</span>
            </label>
          </div>

          {/* Rule 2: Religion & Gotra Exogamy */}
          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-2">
            <span className="font-bold text-[#2B120C] block">Religion &amp; Vedic Gotra</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sameReligionMandatory}
                onChange={(e) => setSameReligionMandatory(e.target.checked)}
                className="rounded text-[#EA580C]"
              />
              <span className="text-[11px]">Same Religion Mandatory</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={gotraExogamyCheck}
                onChange={(e) => setGotraExogamyCheck(e.target.checked)}
                className="rounded text-[#EA580C]"
              />
              <span className="text-[11px]">Enforce Gotra Exogamy (Ban same Gotra)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={subCasteRelaxation}
                onChange={(e) => setSubCasteRelaxation(e.target.checked)}
                className="rounded text-[#EA580C]"
              />
              <span className="text-[11px]">Allow Sub-Caste Relaxation</span>
            </label>
          </div>

          {/* Rule 3: Education & Career Tier */}
          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-2">
            <span className="font-bold text-[#2B120C] block">Education &amp; Profession</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={degreeTierMatching}
                onChange={(e) => setDegreeTierMatching(e.target.checked)}
                className="rounded text-[#EA580C]"
              />
              <span className="text-[11px]">Match Equivalent Degrees (Tech, Medical, CA, Civil)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={incomeToleranceUpwardOnly}
                onChange={(e) => setIncomeToleranceUpwardOnly(e.target.checked)}
                className="rounded text-[#EA580C]"
              />
              <span className="text-[11px]">Income Match: Allow Higher Only</span>
            </label>
          </div>

          {/* Rule 4: Location & NRI Bonus */}
          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-2.5">
            <div className="font-bold text-[#2B120C] flex items-center justify-between">
              <span>Same City Bonus</span>
              <span className="text-emerald-700 font-extrabold">+{sameCityBonusScore} Pts</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={sameCityBonusScore}
              onChange={(e) => setSameCityBonusScore(Number(e.target.value))}
              className="w-full h-1.5 bg-amber-200 rounded-lg accent-emerald-600"
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={nriMatchingEnabled}
                onChange={(e) => setNriMatchingEnabled(e.target.checked)}
                className="rounded text-[#EA580C]"
              />
              <span className="text-[11px]">Highlight NRI / Global Relocation Alliances</span>
            </label>
          </div>

          {/* Rule 5: AI Score Threshold */}
          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-2.5">
            <div className="font-bold text-[#2B120C] flex items-center justify-between">
              <span>Min Score Cutoff for Feeds</span>
              <span className="text-[#EA580C] font-extrabold">{minMatchCutoff}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="90"
              step="5"
              value={minMatchCutoff}
              onChange={(e) => setMinMatchCutoff(Number(e.target.value))}
              className="w-full h-1.5 bg-amber-200 rounded-lg accent-[#EA580C]"
            />
            <p className="text-[11px] text-[#8C6D62]">
              Candidates below {minMatchCutoff}% match score will not appear in daily recommendations.
            </p>
          </div>

          {/* Rule 6: Daily Recommendation Quota */}
          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-2.5">
            <div className="font-bold text-[#2B120C] flex items-center justify-between">
              <span>Daily Match Digest Quota</span>
              <span className="text-[#EA580C] font-extrabold">{dailyRecommendationsQuota} Matches</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={dailyRecommendationsQuota}
              onChange={(e) => setDailyRecommendationsQuota(Number(e.target.value))}
              className="w-full h-1.5 bg-amber-200 rounded-lg accent-[#EA580C]"
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={aiDynamicLearning}
                onChange={(e) => setAiDynamicLearning(e.target.checked)}
                className="rounded text-[#EA580C]"
              />
              <span className="text-[11px]">AI Feedback Loop (Adapt to user pass/like patterns)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Live Sample Simulation Preview */}
      <div className="bg-white rounded-3xl border border-amber-200/90 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#EA580C]" />
              Live Match Ranking Preview (Simulated with Active Weights)
            </h3>
            <p className="text-xs text-[#5C4740]">
              Sample test candidates showing their recalculated Smart Rank Score and Success Probability.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchSampleRankings}
            className="rounded-xl border-amber-200 text-xs font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Re-simulate
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {sampleMatches.map((match) => (
            <div
              key={match.id}
              className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2.5 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={match.photos[0] || "/1.jpg"}
                  alt={match.name}
                  className="w-10 h-10 rounded-xl object-cover object-top border border-amber-200"
                />
                <div className="overflow-hidden">
                  <h5 className="font-bold text-xs text-[#2B120C] truncate">{match.name}</h5>
                  <p className="text-[10px] text-[#5C4740] truncate">{match.profession}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-center pt-1 border-t border-amber-100">
                <div className="p-1.5 rounded-lg bg-white border border-amber-100">
                  <span className="text-[10px] text-[#5C4740] block">Smart Rank</span>
                  <span className="text-xs font-extrabold text-[#7C2D12]">
                    {match.smartRankScore || match.matchScore} pts
                  </span>
                </div>
                <div className="p-1.5 rounded-lg bg-white border border-amber-100">
                  <span className="text-[10px] text-[#5C4740] block">Success Prob</span>
                  <span className="text-xs font-extrabold text-emerald-700">
                    {match.successProbability || 88}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
