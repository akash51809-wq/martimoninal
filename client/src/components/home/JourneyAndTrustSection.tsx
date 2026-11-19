import React from "react";
import {
  JOURNEY_STEPS,
  SECURITY_PILLARS,
  TRUST_STATS,
} from "@/data/homepageData";
import {
  UserPlus,
  Sparkles,
  MessageCircleHeart,
  ShieldCheck,
  Lock,
  EyeOff,
  Crown,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const stepIcons = [UserPlus, Sparkles, MessageCircleHeart];
const pillarIcons = [ShieldCheck, Lock, EyeOff, Crown];

const stepTitleKeys = [
  "home.journey.step1Title",
  "home.journey.step2Title",
  "home.journey.step3Title",
];
const stepDescKeys = [
  "home.journey.step1Desc",
  "home.journey.step2Desc",
  "home.journey.step3Desc",
];

export const JourneyAndTrustSection: React.FC = () => {
  const { t } = useLanguage();
  return (
    <>
      {/* 3-Step Journey Section */}
      <section
        id="journey"
        className="py-16 sm:py-20 bg-gradient-to-b from-[#FAF3EA] to-[#FFFDF9]"
      >
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="font-cursive text-3xl sm:text-4xl text-[#C2410C]">
              {t("home.tagline", "Simple, Respectful & Guided")}
            </span>
            <h2 className="font-serif-royal text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#2B120C]">
              {t("home.journey.title", "How Vivah Kar Lo Brings Families Together")}
            </h2>
            <p className="text-base sm:text-lg text-[#5C4740]">
              {t("home.journey.subtitle", "Three thoughtful steps designed for serious, family-approved alliances—without noise or endless scrolling.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {JOURNEY_STEPS.map((item, idx) => {
              const Icon = stepIcons[idx] || Sparkles;
              return (
                <div
                  key={item.step}
                  className="relative bg-white rounded-3xl p-7 sm:p-8 border border-amber-200/80 shadow-[0_12px_36px_-15px_rgba(124,45,18,0.1)] hover:border-[#FF7700]/60 transition-colors"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-13 h-13 p-3 rounded-2xl bg-saffron-gradient flex items-center justify-center text-white shadow-saffron-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-serif-royal text-3xl sm:text-4xl font-bold text-amber-200/90">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-serif-royal text-xl sm:text-2xl font-bold text-[#2B120C] mb-3">
                    {t(stepTitleKeys[idx] || "", item.title)}
                  </h3>
                  <p className="text-[15px] sm:text-base text-[#5C4740] leading-relaxed">
                    {t(stepDescKeys[idx] || "", item.description)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Deep Velvet Rosewood Trust & Privacy Showcase */}
      <section
        id="trust"
        className="py-16 sm:py-24 bg-gradient-to-br from-[#2B0712] via-[#3F0C1C] to-[#240610] text-amber-50 relative overflow-hidden"
      >
        {/* Subtle Gold Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 right-0 w-[440px] h-[440px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.12)_0%,transparent_70%)]"
        />

        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 relative z-10">
          {/* Stats Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-12 mb-12 border-b border-amber-300/15">
            {TRUST_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/[0.04] border border-amber-200/15 p-6 text-center backdrop-blur-sm"
              >
                <p className="font-serif-royal text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-base font-semibold text-white mt-1.5">
                  {stat.label}
                </p>
                <p className="text-xs sm:text-sm text-amber-200/80 mt-0.5">
                  {stat.sublabel}
                </p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-300/30 text-amber-300 text-sm font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Zero-Compromise Privacy
              </span>
              <h2 className="font-serif-royal text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-tight">
                Your Family&apos;s Dignity &amp; Privacy Come First
              </h2>
              <p className="text-base sm:text-lg text-amber-100/85 leading-relaxed">
                Matrimony is a sacred family decision. Unlike casual apps,
                Vivah Kar Lo enforces multi-layer identity screening, masked contact
                sharing, and human moderation so every conversation feels safe
                and respectful.
              </p>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
              {SECURITY_PILLARS.map((pillar, idx) => {
                const Icon = pillarIcons[idx] || ShieldCheck;
                return (
                  <div
                    key={pillar.title}
                    className="rounded-2xl bg-white/[0.06] border border-amber-200/15 p-6 hover:bg-white/[0.09] transition-colors"
                  >
                    <div className="w-11 h-11 rounded-xl bg-amber-400/15 border border-amber-300/30 flex items-center justify-center text-amber-300 mb-3.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif-royal text-lg sm:text-xl font-bold text-white mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-sm sm:text-[15px] text-amber-100/80 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
