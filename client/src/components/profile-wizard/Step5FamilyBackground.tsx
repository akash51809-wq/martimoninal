import React from "react";
import type {
  Step5FamilyData,
  FamilyTypeOption,
  FamilyValuesOption,
  FamilyStatusOption,
} from "@/types/matrimonialProfileTypes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, Home, MapPin } from "lucide-react";

interface Step5Props {
  data: Partial<Step5FamilyData>;
  onChange: (updates: Partial<Step5FamilyData>) => void;
}

const OCCUPATION_OPTIONS = [
  "Government Service / PSU",
  "Private Sector Executive",
  "Business / Industrialist",
  "Retired Official",
  "Defense Forces",
  "Civil Services",
  "Homemaker",
  "Passed Away",
  "Other",
];

const FAMILY_TYPES: FamilyTypeOption[] = ["Nuclear", "Joint"];

const FAMILY_VALUES: FamilyValuesOption[] = ["Traditional", "Moderate", "Liberal"];

const FAMILY_STATUSES: FamilyStatusOption[] = [
  "Middle Class",
  "Upper Middle Class",
  "Rich / Affluent",
  "High Net-Worth / Elite",
];

export const Step5FamilyBackground: React.FC<Step5Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="font-serif-royal text-xl sm:text-2xl font-bold text-[#2B120C] flex items-center gap-2">
          <Users className="w-5 h-5 text-[#EA580C]" />
          Step 5: Family Background &amp; Heritage
        </h2>
        <p className="text-sm text-[#5C4740] mt-1">
          Indian weddings celebrate the alliance of two esteemed families. Share your family structure and roots.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Father's Occupation */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            Father's Occupation <span className="text-rose-500">*</span>
          </Label>
          <select
            value={data.fatherOccupation || "Government Service / PSU"}
            onChange={(e) => onChange({ fatherOccupation: e.target.value })}
            className="w-full h-11 px-3.5 rounded-xl border border-amber-200 bg-white text-sm text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
          >
            {OCCUPATION_OPTIONS.map((occ) => (
              <option key={occ} value={occ}>
                {occ}
              </option>
            ))}
          </select>
        </div>

        {/* Mother's Occupation */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            Mother's Occupation <span className="text-rose-500">*</span>
          </Label>
          <select
            value={data.motherOccupation || "Homemaker"}
            onChange={(e) => onChange({ motherOccupation: e.target.value })}
            className="w-full h-11 px-3.5 rounded-xl border border-amber-200 bg-white text-sm text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
          >
            {OCCUPATION_OPTIONS.map((occ) => (
              <option key={occ} value={occ}>
                {occ}
              </option>
            ))}
          </select>
        </div>

        {/* Brothers Count & Married */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-[#2B120C]">
              Brothers
            </Label>
            <select
              value={data.brothersCount ?? 0}
              onChange={(e) =>
                onChange({ brothersCount: parseInt(e.target.value, 10) })
              }
              className="w-full h-11 px-3.5 rounded-xl border border-amber-200 bg-white text-sm text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? "None" : n}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-[#2B120C]">
              Married
            </Label>
            <select
              value={data.brothersMarried ?? 0}
              onChange={(e) =>
                onChange({ brothersMarried: parseInt(e.target.value, 10) })
              }
              className="w-full h-11 px-3.5 rounded-xl border border-amber-200 bg-white text-sm text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? "None" : n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sisters Count & Married */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-[#2B120C]">
              Sisters
            </Label>
            <select
              value={data.sistersCount ?? 0}
              onChange={(e) =>
                onChange({ sistersCount: parseInt(e.target.value, 10) })
              }
              className="w-full h-11 px-3.5 rounded-xl border border-amber-200 bg-white text-sm text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? "None" : n}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-[#2B120C]">
              Married
            </Label>
            <select
              value={data.sistersMarried ?? 0}
              onChange={(e) =>
                onChange({ sistersMarried: parseInt(e.target.value, 10) })
              }
              className="w-full h-11 px-3.5 rounded-xl border border-amber-200 bg-white text-sm text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? "None" : n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Family Type */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C] flex items-center gap-1.5">
            <Home className="w-4 h-4 text-[#EA580C]" />
            Family Type <span className="text-rose-500">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {FAMILY_TYPES.map((type) => {
              const isSelected = (data.familyType || "Nuclear") === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChange({ familyType: type })}
                  className={`py-2.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
                    isSelected
                      ? "bg-amber-100 border-[#EA580C] text-[#3B0A18] font-bold shadow-sm"
                      : "bg-white border-amber-200 text-[#5C4740] hover:bg-amber-50"
                  }`}
                >
                  {type} Family
                </button>
              );
            })}
          </div>
        </div>

        {/* Family Values */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            Family Values <span className="text-rose-500">*</span>
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {FAMILY_VALUES.map((val) => {
              const isSelected = (data.familyValues || "Moderate") === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => onChange({ familyValues: val })}
                  className={`py-2.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
                    isSelected
                      ? "bg-amber-100 border-[#EA580C] text-[#3B0A18] font-bold shadow-sm"
                      : "bg-white border-amber-200 text-[#5C4740] hover:bg-amber-50"
                  }`}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>

        {/* Family Status */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            Family Financial Status <span className="text-rose-500">*</span>
          </Label>
          <select
            value={data.familyStatus || "Upper Middle Class"}
            onChange={(e) =>
              onChange({ familyStatus: e.target.value as FamilyStatusOption })
            }
            className="w-full h-11 px-3.5 rounded-xl border border-amber-200 bg-white text-sm text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
          >
            {FAMILY_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Native Place */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#EA580C]" />
            Native Place / Family Ancestral Hometown <span className="text-rose-500">*</span>
          </Label>
          <Input
            placeholder="e.g. Pune (Maharashtra), Jaipur, Varanasi"
            value={data.nativePlace || ""}
            onChange={(e) => onChange({ nativePlace: e.target.value })}
            className="h-11 rounded-xl border-amber-200 text-sm"
          />
        </div>

        {/* About Family Note */}
        <div className="sm:col-span-2 space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            A Few Words About Your Family (Optional)
          </Label>
          <Textarea
            placeholder="Describe your family traditions, values, and celebrations..."
            value={data.aboutFamily || ""}
            onChange={(e) => onChange({ aboutFamily: e.target.value })}
            rows={3}
            className="rounded-xl border-amber-200 text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
};
