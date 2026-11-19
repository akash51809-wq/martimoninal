import React from "react";
import type {
  Step2ReligiousData,
  ReligionOption,
  ManglikOption,
} from "@/types/matrimonialProfileTypes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sparkles, Compass } from "lucide-react";

interface Step2Props {
  data: Partial<Step2ReligiousData>;
  onChange: (updates: Partial<Step2ReligiousData>) => void;
}

const RELIGIONS: ReligionOption[] = [
  "Hindu",
  "Muslim",
  "Sikh",
  "Christian",
  "Jain",
  "Buddhist",
  "Parsi",
  "Jewish",
  "Other",
];

const MANGLIK_OPTIONS: ManglikOption[] = [
  "Non-Manglik",
  "Manglik",
  "Anshik Manglik (Partial)",
  "Don't Know",
];

const MOTHER_TONGUES = [
  "Hindi",
  "Marathi",
  "Punjabi",
  "Gujarati",
  "Bengali",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Odia",
  "Marwari",
  "Urdu",
  "Sindhi",
  "Assamese",
  "English",
];

const POPULAR_RASHIS = [
  "Mesha (Aries)",
  "Vrishabha (Taurus)",
  "Mithuna (Gemini)",
  "Karka (Cancer)",
  "Simha (Leo)",
  "Kanya (Virgo)",
  "Tula (Libra)",
  "Vrishchika (Scorpio)",
  "Dhanu (Sagittarius)",
  "Makara (Capricorn)",
  "Kumbha (Aquarius)",
  "Meena (Pisces)",
  "Don't Know",
];

export const Step2ReligiousSocial: React.FC<Step2Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="font-serif-royal text-xl sm:text-2xl font-bold text-[#2B120C] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#EA580C]" />
          Step 2: Religious &amp; Social Background
        </h2>
        <p className="text-sm text-[#5C4740] mt-1">
          Indian alliances place special emphasis on family traditions, caste culture, and astrological harmony.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Religion */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            Religion <span className="text-rose-500">*</span>
          </Label>
          <select
            value={data.religion || "Hindu"}
            onChange={(e) =>
              onChange({ religion: e.target.value as ReligionOption })
            }
            className="w-full h-11 px-3.5 rounded-xl border border-amber-200 bg-white text-sm text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
          >
            {RELIGIONS.map((rel) => (
              <option key={rel} value={rel}>
                {rel}
              </option>
            ))}
          </select>
        </div>

        {/* Mother Tongue */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            Mother Tongue <span className="text-rose-500">*</span>
          </Label>
          <select
            value={data.motherTongue || "Hindi"}
            onChange={(e) => onChange({ motherTongue: e.target.value })}
            className="w-full h-11 px-3.5 rounded-xl border border-amber-200 bg-white text-sm text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
          >
            {MOTHER_TONGUES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Caste */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            Caste / Community <span className="text-rose-500">*</span>
          </Label>
          <Input
            placeholder="e.g. Brahmin, Maratha, Rajput, Kayastha"
            value={data.caste || ""}
            onChange={(e) => onChange({ caste: e.target.value })}
            className="h-11 rounded-xl border-amber-200 text-sm"
          />
        </div>

        {/* Sub-Caste */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            Sub-Caste (Optional)
          </Label>
          <Input
            placeholder="e.g. Kanyakubj, 96 Kuli, Deshastha"
            value={data.subCaste || ""}
            onChange={(e) => onChange({ subCaste: e.target.value })}
            className="h-11 rounded-xl border-amber-200 text-sm"
          />
        </div>

        {/* Gothram */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            Gotra / Gothram (Optional)
          </Label>
          <Input
            placeholder="e.g. Kashyap, Bharadwaja, Vashishta"
            value={data.gothram || ""}
            onChange={(e) => onChange({ gothram: e.target.value })}
            className="h-11 rounded-xl border-amber-200 text-sm"
          />
        </div>

        {/* Manglik Status */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C] flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#EA580C]" />
            Manglik Status <span className="text-rose-500">*</span>
          </Label>
          <select
            value={data.manglikStatus || "Non-Manglik"}
            onChange={(e) =>
              onChange({ manglikStatus: e.target.value as ManglikOption })
            }
            className="w-full h-11 px-3.5 rounded-xl border border-amber-200 bg-white text-sm text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
          >
            {MANGLIK_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Rashi / Zodiac (Optional) */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            Raasi / Moon Sign (Optional)
          </Label>
          <select
            value={data.rashi || "Don't Know"}
            onChange={(e) => onChange({ rashi: e.target.value })}
            className="w-full h-11 px-3.5 rounded-xl border border-amber-200 bg-white text-sm text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
          >
            {POPULAR_RASHIS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Nakshatra (Optional) */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            Nakshatra / Birth Star (Optional)
          </Label>
          <Input
            placeholder="e.g. Rohini, Swati, Ashwini"
            value={data.nakshatra || ""}
            onChange={(e) => onChange({ nakshatra: e.target.value })}
            className="h-11 rounded-xl border-amber-200 text-sm"
          />
        </div>
      </div>
    </div>
  );
};
