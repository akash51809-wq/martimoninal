import React from "react";
import { Link } from "wouter";
import { MOCK_VIP_PLANS } from "@/data/mockData";
import { POPULAR_CATEGORIES } from "@/data/homepageData";
import { Button } from "@/components/ui/button";
import {
  Check,
  Crown,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Download,
  QrCode,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface MembershipAndAppSectionProps {
  onSelectPlan: (planName: string) => void;
  onSelectCommunityFilter: (community: string) => void;
  onOpenRegister: () => void;
}

export const MembershipAndAppSection: React.FC<MembershipAndAppSectionProps> = ({
  onSelectPlan,
  onSelectCommunityFilter,
  onOpenRegister,
}) => {
  const { t } = useLanguage();
  return (
    <>
      {/* Royal Membership Plans */}
      <section
        id="membership"
        className="py-16 sm:py-20 bg-gradient-to-b from-[#FAF3EA] via-[#FFFDF9] to-[#FFFDF9]"
      >
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2.5">
            <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest text-[#EA580C]">
              <Crown className="w-4 h-4" />
              Assisted &amp; VIP Plans
            </span>
            <h2 className="font-serif-royal text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#2B120C]">
              {t("home.plans.title", "Royal Membership Plans")}
            </h2>
            <p className="text-base sm:text-lg text-[#5C4740]">
              {t("home.plans.subtitle", "Start free with verified browsing. Upgrade anytime to unlock direct contact numbers, Kundli reports, and dedicated advisors.")}
            </p>
          </div>

          <div className="flex lg:grid overflow-x-auto snap-x snap-mandatory gap-4 pt-5 pb-3 -mx-4 px-4 no-scrollbar lg:mx-0 lg:px-0 lg:pt-0 lg:pb-0 lg:grid-cols-3 lg:gap-8 items-stretch">
            {MOCK_VIP_PLANS.map((plan) => {
              const isPopular = Boolean(plan.popular);
              return (
                <div
                  key={plan.id}
                  className={`w-[84vw] max-w-[360px] lg:w-auto lg:max-w-none shrink-0 snap-center relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
                    isPopular
                      ? "bg-gradient-to-b from-[#3B0A18] to-[#240610] text-white border-2 border-amber-400 shadow-[0_24px_60px_-15px_rgba(234,88,12,0.32)] lg:-translate-y-2"
                      : "bg-white text-[#2B120C] border border-amber-200 shadow-[0_12px_36px_-15px_rgba(124,45,18,0.1)]"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-saffron-gradient text-white text-[11px] font-bold uppercase tracking-wider shadow-md whitespace-nowrap">
                      Most Popular Choice
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                          isPopular
                            ? "bg-amber-400/20 text-amber-300 border border-amber-300/30"
                            : "bg-amber-50 text-[#C2410C] border border-amber-200"
                        }`}
                      >
                        {plan.duration}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          isPopular ? "text-emerald-300" : "text-emerald-700"
                        }`}
                      >
                        {plan.discount}
                      </span>
                    </div>

                    <h3
                      className={`font-serif-royal text-2xl font-bold ${
                        isPopular ? "text-white" : "text-[#2B120C]"
                      }`}
                    >
                      {plan.name}
                    </h3>

                    <div className="flex items-baseline gap-2.5 mt-3 pb-5 border-b border-current/10">
                      <span
                        className={`font-serif-royal text-3xl sm:text-4xl font-bold ${
                          isPopular ? "text-amber-300" : "text-[#EA580C]"
                        }`}
                      >
                        {plan.price}
                      </span>
                      <span
                        className={`text-sm line-through ${
                          isPopular ? "text-amber-100/50" : "text-[#8C6D62]"
                        }`}
                      >
                        {plan.originalPrice}
                      </span>
                    </div>

                    <ul className="space-y-3.5 my-6">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-[15px]">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isPopular
                                ? "bg-amber-400/20 text-amber-300"
                                : "bg-orange-100 text-[#EA580C]"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </span>
                          <span
                            className={
                              isPopular ? "text-amber-50/95" : "text-[#4E342E]"
                            }
                          >
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    type="button"
                    onClick={() => onSelectPlan(plan.name)}
                    className={`w-full h-12 rounded-xl font-semibold text-base transition-all ${
                      isPopular
                        ? "bg-saffron-gradient hover:opacity-95 text-white shadow-saffron-sm"
                        : "bg-[#3B0A18] hover:bg-[#5B1325] text-white"
                    }`}
                  >
                    Choose {plan.name}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Browse by Community & Cities */}
      <section className="py-12 bg-[#FFFDF9] border-t border-amber-100">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
              Explore Verified Alliances Across India &amp; Global NRIs
            </h3>
            <p className="text-sm sm:text-base text-[#5C4740]">
              Click any community to preview curated profiles instantly
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {POPULAR_CATEGORIES.communities.map((comm) => (
              <button
                key={comm}
                type="button"
                onClick={() => onSelectCommunityFilter(comm)}
                className="px-4 py-2 rounded-full bg-white border border-amber-200 text-sm sm:text-[15px] font-medium text-[#4E342E] hover:border-[#FF7700] hover:bg-orange-50 hover:text-[#EA580C] transition-colors shadow-sm"
              >
                {comm} Matrimony
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 text-sm text-[#785C52]">
            <span className="font-semibold text-[#3B0A18]">Top Cities:</span>
            {POPULAR_CATEGORIES.cities.map((city, i) => (
              <React.Fragment key={city}>
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="hover:text-[#EA580C] transition-colors"
                >
                  {city}
                </button>
                {i < POPULAR_CATEGORIES.cities.length - 1 && (
                  <span className="text-amber-300">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Dedicated Vivah Kar Lo Mobile App Showcase & Official Android APK Download Section */}
      <section id="download-app" className="py-20 bg-gradient-to-br from-[#FFF4E6] via-[#FFF9F2] to-[#FFEAD5] border-t border-amber-200/80">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <div className="rounded-3xl bg-white border border-amber-200 shadow-[0_20px_60px_-15px_rgba(154,52,18,0.15)] p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              
              {/* Left Column: Mobile App Showcase Details */}
              <div className="space-y-4 text-center lg:text-left max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#C2410C] text-sm font-semibold">
                  <Smartphone className="w-4 h-4 text-[#EA580C]" />
                  Vivah Kar Lo Mobile App • Android &amp; iOS Ready
                </div>
                
                <h2 className="font-serif-royal text-2xl sm:text-4xl font-bold text-[#2B120C]">
                  Carry Your Matrimonial Journey Everywhere
                </h2>
                
                <p className="text-base sm:text-lg text-[#5C4740]">
                  Get instant push alerts for interests, unlock with Face ID/Fingerprint, inspect 36-Guna Vedic Kundli reports, and chat securely with anti-scam fraud protection.
                </p>

                {/* Feature Bullets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-[#4E342E]">
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>Biometric Instant Unlock (Face ID &amp; Fingerprint)</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>Private Photo Shield &amp; EXIF GPS Stripping</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>In-Chat Real-Time Financial Fraud Warning</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>Over-The-Air (OTA) Instant Updates</span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-[#8C7A74]">
                  Package: in.vivahkarlo.app • Version: 1.0.0 (Production Release) • 100% Free Direct Download
                </div>
              </div>

              {/* Right Column: Download Actions & QR Code */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4 shrink-0 bg-[#FAF3EA] p-6 rounded-2xl border border-amber-200/80">
                
                {/* Official Direct Download Link */}
                <a
                  href="/downloads/vivahkarlo-release.apk"
                  download="vivahkarlo-release.apk"
                  className="w-full"
                >
                  <Button
                    type="button"
                    className="w-full h-13 px-8 rounded-full bg-saffron-gradient hover:opacity-95 text-white font-bold text-base shadow-saffron-md flex items-center justify-center gap-2.5"
                  >
                    <Download className="w-5 h-5" />
                    Download Android APK (v1.0.0)
                  </Button>
                </a>

                {/* Direct Android APK Install Action */}
                <a
                  href="/downloads/vivahkarlo-release.apk"
                  download="vivahkarlo-release.apk"
                  className="w-full"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 px-6 rounded-full border-amber-300 text-[#3B0A18] hover:bg-amber-100/60 font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <Smartphone className="w-4 h-4 text-[#EA580C]" />
                    Direct APK Installer for Android
                    <Download className="w-4 h-4 ml-1 text-[#EA580C]" />
                  </Button>
                </a>

                {/* QR Code / Scan Indicator */}
                <div className="flex items-center gap-3 pt-1 text-xs text-[#5C4740]">
                  <div className="w-9 h-9 rounded-lg bg-white border border-amber-300 flex items-center justify-center shadow-xs">
                    <QrCode className="w-5 h-5 text-[#721422]" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-[#2B120C]">Scan with Mobile Camera</div>
                    <div>Direct APK download to phone</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
