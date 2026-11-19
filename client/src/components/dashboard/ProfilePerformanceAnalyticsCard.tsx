import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Eye,
  Heart,
  MapPin,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import type { DashboardTabId } from "./DashboardOverviewTab";

interface ProfilePerformanceAnalyticsCardProps {
  userId: string;
  onNavigateTab: (tab: DashboardTabId) => void;
}

export const ProfilePerformanceAnalyticsCard: React.FC<ProfilePerformanceAnalyticsCardProps> = ({
  userId,
  onNavigateTab,
}) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/v1/activity/analytics/${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.analytics) setData(res.analytics);
      })
      .catch(() => {});
  }, [userId]);

  if (!data) return null;

  const maxViews = Math.max(
    1,
    ...(data.weeklySeries || []).map((d: any) => Number(d.views) || 0)
  );

  return (
    <div className="bg-white rounded-3xl border border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C] flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            Profile Strength &amp; Weekly Performance Analytics
          </span>
          <h3 className="font-serif-royal text-xl font-bold text-[#2B120C] mt-0.5">
            Your 7-Day Visibility &amp; Growth Insights
          </h3>
        </div>
        <div className="flex items-center gap-2 self-start">
          <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +{data.weeklyGrowthPct}% This Week
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#7C2D12] text-xs font-bold">
            Strength: {data.strengthScore}%
          </span>
        </div>
      </div>

      {/* Top KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
          <span className="text-[11px] font-semibold text-[#6E564E] flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-[#EA580C]" />
            7-Day Views
          </span>
          <p className="font-serif-royal text-2xl font-bold text-[#2B120C] mt-1">
            {data.totalWeeklyViews}
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/80">
          <span className="text-[11px] font-semibold text-[#6E564E] flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-600" />
            Weekly Interests
          </span>
          <p className="font-serif-royal text-2xl font-bold text-[#2B120C] mt-1">
            {data.totalWeeklyInterests}
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
          <span className="text-[11px] font-semibold text-[#6E564E]">Shortlisted By</span>
          <p className="font-serif-royal text-2xl font-bold text-emerald-800 mt-1">
            {data.shortlistedByCount}
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-200/80">
          <span className="text-[11px] font-semibold text-[#6E564E]">Response Rate</span>
          <p className="font-serif-royal text-2xl font-bold text-sky-900 mt-1">
            {data.responseRatePct}%
          </p>
        </div>
      </div>

      {/* Charts & Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 7-Day Views & Interests Bar Graph */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#3B0A18]">Weekly Profile Views &amp; Interests</span>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-[#5C4740]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#EA580C]" /> Views
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Interests
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 items-end h-40 pt-4">
            {(data.weeklySeries || []).map((item: any) => {
              const viewPct = Math.max(12, Math.round((item.views / maxViews) * 100));
              const intPct = Math.max(8, Math.round((item.interests / Math.max(1, maxViews)) * 220));
              return (
                <div key={item.day} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-28">
                    <div
                      className="w-3.5 sm:w-4 rounded-t-md bg-gradient-to-t from-[#EA580C] to-amber-400 transition-all"
                      style={{ height: `${viewPct}%` }}
                      title={`${item.day}: ${item.views} Views`}
                    />
                    <div
                      className="w-2.5 sm:w-3 rounded-t-md bg-emerald-500 transition-all"
                      style={{ height: `${Math.min(100, intPct)}%` }}
                      title={`${item.day}: ${item.interests} Interests`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#5C4740]">{item.day}</span>
                  <span className="text-[9px] text-[#8C6D62]">{item.views}v</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Cities Sending Interests */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200/80 space-y-3">
          <span className="font-bold text-xs text-[#3B0A18] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#EA580C]" />
            Top Cities Interested in Your Profile
          </span>
          <div className="space-y-3">
            {(data.topCities || []).map((c: any) => (
              <div key={c.city} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#2B120C]">{c.city}</span>
                  <span className="font-bold text-[#EA580C]">
                    {c.percentage}% ({c.count} views)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-amber-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-saffron-gradient"
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Strength Actionable Checklist */}
      <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#3B0A18] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#EA580C]" />
            How to Boost Your Profile to 100% Strength
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {(data.strengthChecklist || []).map((item: any) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigateTab(item.targetTab as DashboardTabId)}
              className={`p-2.5 rounded-xl border text-left text-xs flex items-center justify-between gap-2 transition-colors ${
                item.done
                  ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                  : "bg-white border-amber-300 text-[#2B120C] hover:bg-amber-50"
              }`}
            >
              <span className="flex items-center gap-2 font-semibold">
                {item.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <span>{item.label}</span>
              </span>
              {!item.done && <ArrowRight className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
