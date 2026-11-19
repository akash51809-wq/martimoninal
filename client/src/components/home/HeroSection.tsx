import React from "react";
import {
  Search,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_COMMUNITIES, MOCK_LANGUAGES } from "@/data/mockData";

export interface HeroSearchFilters {
  lookingFor: "Female" | "Male" | "All";
  minAge: number;
  maxAge: number;
  community: string;
  motherTongue: string;
}

interface HeroSectionProps {
  filters: HeroSearchFilters;
  onChangeFilters: (next: HeroSearchFilters) => void;
  onSearchSubmit: () => void;
  onOpenRegister: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  filters,
  onChangeFilters,
  onSearchSubmit,
  onOpenRegister,
}) => {
  const ageOptions = Array.from({ length: 20 }, (_, i) => 21 + i);

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-[#FFF9F2] via-[#FFFDF9] to-[#FAF3EA] pt-5 pb-12 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24"
    >
      {/* Ambient Royal Warmth (Zero-Cost Radial Gradients) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,119,0,0.12)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 -right-24 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.14)_0%,transparent_70%)]"
      />

      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
          {/* Left Editorial + Interactive Search Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-fadeUp">
            {/* Eyebrow Trust Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-amber-200/90 shadow-sm text-sm font-semibold text-[#7C2D12]">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-[#EA580C]">
                <Star className="w-3 h-3 fill-current" />
              </span>
              <span>India&apos;s Premier Verified Family Matrimony</span>
              <span className="hidden sm:inline text-amber-500">•</span>
              <span className="hidden sm:inline text-emerald-700 font-semibold">
                100% ID Screened
              </span>
            </div>

            {/* Hero Title */}
            <div className="space-y-3">
              <p className="font-cursive text-3xl sm:text-4xl text-[#C2410C]">
                Where Two Families Become One
              </p>
              <h1 className="font-serif-royal text-4xl sm:text-5xl lg:text-[58px] xl:text-[64px] font-bold tracking-tight text-[#2B120C] leading-[1.12]">
                Where Tradition Meets Your{" "}
                <span className="bg-gradient-to-r from-[#FF6B00] via-[#EA580C] to-[#D97706] bg-clip-text text-transparent">
                  Forever
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg xl:text-xl text-[#5C4740] max-w-3xl mx-auto lg:mx-0 leading-relaxed">
              Thoughtfully curated, Aadhaar &amp; selfie-verified profiles across
              communities—combining{" "}
              <strong className="font-semibold text-[#3B0A18]">
                36-Guna Vedic Kundli matching
              </strong>{" "}
              with dignified family privacy.
            </p>

            {/* Quick Match Finder Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_-15px_rgba(154,52,18,0.16)] border border-amber-200/80 text-left">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-amber-100">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#7C2D12]">
                    Looking for a
                  </span>
                  <div className="inline-flex rounded-full bg-amber-50 p-1 border border-amber-200/70">
                    {(
                      [
                        { label: "Bride", value: "Female" },
                        { label: "Groom", value: "Male" },
                        { label: "All", value: "All" },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          onChangeFilters({ ...filters, lookingFor: opt.value })
                        }
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                          filters.lookingFor === opt.value
                            ? "bg-saffron-gradient text-white shadow-sm"
                            : "text-[#5C4740] hover:text-[#EA580C]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="text-sm font-semibold text-[#EA580C] hover:text-[#9A3412] underline underline-offset-4"
                >
                  Free Profile Creation →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.45fr_1.2fr_1.1fr_auto] gap-3.5 items-end">
                {/* Age Range */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785C52] mb-1.5">
                    Age Preference
                  </label>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1.5">
                    <select
                      aria-label="Minimum Age"
                      value={filters.minAge}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        onChangeFilters({
                          ...filters,
                          minAge: val,
                          maxAge: Math.max(val, filters.maxAge),
                        });
                      }}
                      className="w-full h-12 rounded-xl border border-amber-200 bg-[#FFFDF9] px-2.5 text-base sm:text-[15px] font-medium text-[#2B120C] whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#FF7700]/40"
                    >
                      {ageOptions.map((age) => (
                        <option key={age} value={age}>
                          {age} yrs
                        </option>
                      ))}
                    </select>
                    <span className="text-sm text-[#8C6D62] font-medium">to</span>
                    <select
                      aria-label="Maximum Age"
                      value={filters.maxAge}
                      onChange={(e) =>
                        onChangeFilters({
                          ...filters,
                          maxAge: Number(e.target.value),
                        })
                      }
                      className="w-full h-12 rounded-xl border border-amber-200 bg-[#FFFDF9] px-2.5 text-base sm:text-[15px] font-medium text-[#2B120C] whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#FF7700]/40"
                    >
                      {ageOptions
                        .filter((a) => a >= filters.minAge)
                        .map((age) => (
                          <option key={age} value={age}>
                            {age} yrs
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Community */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785C52] mb-1.5">
                    Community
                  </label>
                  <select
                    aria-label="Select Community"
                    value={filters.community}
                    onChange={(e) =>
                      onChangeFilters({ ...filters, community: e.target.value })
                    }
                    className="w-full h-12 rounded-xl border border-amber-200 bg-[#FFFDF9] px-3 text-base sm:text-[15px] font-medium text-[#2B120C] whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#FF7700]/40"
                  >
                    {MOCK_COMMUNITIES.map((comm) => (
                      <option key={comm} value={comm}>
                        {comm}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mother Tongue */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#785C52] mb-1.5">
                    Mother Tongue
                  </label>
                  <select
                    aria-label="Select Mother Tongue"
                    value={filters.motherTongue}
                    onChange={(e) =>
                      onChangeFilters({
                        ...filters,
                        motherTongue: e.target.value,
                      })
                    }
                    className="w-full h-12 rounded-xl border border-amber-200 bg-[#FFFDF9] px-3 text-base sm:text-[15px] font-medium text-[#2B120C] whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#FF7700]/40"
                  >
                    <option value="All">All Languages</option>
                    {MOCK_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.label}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <Button
                    type="button"
                    onClick={onSearchSubmit}
                    className="w-full lg:w-auto lg:px-7 h-12 rounded-xl bg-saffron-gradient hover:opacity-95 text-white font-semibold text-base shadow-saffron-sm transition-transform active:scale-[0.98]"
                  >
                    <Search className="w-4 h-4 mr-1.5" />
                    Find
                  </Button>
                </div>
              </div>
            </div>

            {/* Key Inline Metrics */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-7 gap-y-2.5 pt-1 text-sm sm:text-base text-[#5C4740]">
              <span className="inline-flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                2.4M+ Verified Profiles
              </span>
              <span className="inline-flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
                Zero-Spam Privacy Shield
              </span>
              <span className="inline-flex items-center gap-2 font-medium">
                <HeartHandshake className="w-4 h-4 text-amber-600" />
                185,000+ Happy Alliances
              </span>
            </div>
          </div>

          {/* Right Editorial Hero Visual Column */}
          <div className="lg:col-span-5 relative mx-auto max-w-md lg:max-w-none w-full">
            {/* Outer Gold Heritage Frame */}
            <div className="relative rounded-[30px] p-2.5 bg-gradient-to-br from-amber-300/70 via-white to-orange-200/80 shadow-[0_30px_70px_-15px_rgba(124,45,18,0.22)]">
              <div className="relative overflow-hidden rounded-[22px] aspect-[4/3.5] bg-[#2C0914]">
                <img
                  src="/hero-sathiya.jpg"
                  decoding="async"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.dataset.fallbackUsed) {
                      img.dataset.fallbackUsed = "true";
                      img.src = "/3.jpg";
                    }
                  }}
                  alt="Smiling Indian wedding couple in ivory and gold attire"
                  className="w-full h-full object-cover object-top"
                />
                {/* Soft lower vignette for editorial readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#240710]/70 via-transparent to-transparent" />

                {/* Top Right Kundli Pill */}
                <div className="absolute top-3.5 right-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md text-xs sm:text-sm font-bold text-[#3B0A18] border border-amber-200">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>36-Guna Kundli Verified</span>
                </div>

                {/* Bottom Overlay Editorial Tag aligned right so floating badge on bottom-left never overlaps */}
                <div className="absolute bottom-4 right-4 left-4 flex items-end justify-end gap-3 text-white">
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
                      Featured Alliance
                    </p>
                    <p className="font-serif-royal text-lg sm:text-xl font-bold leading-snug">
                      Aarav &amp; Ananya • Mumbai
                    </p>
                    <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-emerald-500/90 backdrop-blur-sm text-xs font-semibold">
                      Matched in 18 Days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle Bottom Floating Card */}
            <div className="hidden sm:flex items-center gap-3.5 bg-white/95 backdrop-blur-sm px-4 py-3.5 rounded-2xl shadow-card-elevated border border-amber-100 absolute -bottom-5 -left-6">
              <div className="w-11 h-11 rounded-xl bg-saffron-gradient flex items-center justify-center text-white font-bold text-base shadow-saffron-sm">
                98%
              </div>
              <div>
                <p className="text-sm font-bold text-[#2B120C]">
                  Compatibility Precision
                </p>
                <p className="text-xs text-[#6E564E]">
                  Family values + Vedic Milan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
