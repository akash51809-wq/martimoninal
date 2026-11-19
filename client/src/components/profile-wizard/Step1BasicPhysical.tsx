import React from "react";
import type {
  Step1PhysicalData,
  MaritalStatusOption,
  BloodGroupOption,
  PhysicalStatusOption,
} from "@/types/matrimonialProfileTypes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User, Heart, Activity } from "lucide-react";

interface Step1Props {
  data: Partial<Step1PhysicalData>;
  onChange: (updates: Partial<Step1PhysicalData>) => void;
}

const HEIGHT_OPTIONS: { cm: number; display: string }[] = [
  { cm: 137, display: "4 ft 6 in (137 cm)" },
  { cm: 140, display: "4 ft 7 in (140 cm)" },
  { cm: 142, display: "4 ft 8 in (142 cm)" },
  { cm: 145, display: "4 ft 9 in (145 cm)" },
  { cm: 147, display: "4 ft 10 in (147 cm)" },
  { cm: 150, display: "4 ft 11 in (150 cm)" },
  { cm: 152, display: "5 ft 0 in (152 cm)" },
  { cm: 155, display: "5 ft 1 in (155 cm)" },
  { cm: 157, display: "5 ft 2 in (157 cm)" },
  { cm: 160, display: "5 ft 3 in (160 cm)" },
  { cm: 162, display: "5 ft 4 in (162 cm)" },
  { cm: 165, display: "5 ft 5 in (165 cm)" },
  { cm: 168, display: "5 ft 6 in (168 cm)" },
  { cm: 170, display: "5 ft 7 in (170 cm)" },
  { cm: 173, display: "5 ft 8 in (173 cm)" },
  { cm: 175, display: "5 ft 9 in (175 cm)" },
  { cm: 178, display: "5 ft 10 in (178 cm)" },
  { cm: 180, display: "5 ft 11 in (180 cm)" },
  { cm: 183, display: "6 ft 0 in (183 cm)" },
  { cm: 185, display: "6 ft 1 in (185 cm)" },
  { cm: 188, display: "6 ft 2 in (188 cm)" },
  { cm: 191, display: "6 ft 3 in (191 cm)" },
  { cm: 193, display: "6 ft 4 in (193 cm)" },
];

const BLOOD_GROUPS: BloodGroupOption[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
  "Don't Know",
];

const MARITAL_STATUSES: MaritalStatusOption[] = [
  "Never Married",
  "Divorced",
  "Widowed",
  "Awaiting Divorce",
  "Annulled",
];

const PHYSICAL_STATUSES: PhysicalStatusOption[] = [
  "Normal",
  "Physically Challenged",
  "Specially Abled",
];

export const Step1BasicPhysical: React.FC<Step1Props> = ({ data, onChange }) => {
  const currentHeightCm = data.heightCm || 170;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="font-serif-royal text-xl sm:text-2xl font-bold text-[#2B120C] flex items-center gap-2">
          <User className="w-5 h-5 text-[#EA580C]" />
          Step 1: Basic &amp; Physical Details
        </h2>
        <p className="text-sm text-[#5C4740] mt-1">
          Provide your height, physical attributes, and marital status for accurate matrimonial match filters.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Marital Status */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C] flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-[#EA580C]" />
            Marital Status <span className="text-rose-500">*</span>
          </Label>
          <select
            value={data.maritalStatus || "Never Married"}
            onChange={(e) =>
              onChange({ maritalStatus: e.target.value as MaritalStatusOption })
            }
            className="w-full h-11 px-3.5 rounded-xl border border-amber-200 bg-white text-sm text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
          >
            {MARITAL_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            Height <span className="text-rose-500">*</span>
          </Label>
          <select
            value={currentHeightCm}
            onChange={(e) => {
              const cm = parseInt(e.target.value, 10);
              const opt = HEIGHT_OPTIONS.find((h) => h.cm === cm);
              onChange({
                heightCm: cm,
                heightDisplay: opt ? opt.display : `${cm} cm`,
              });
            }}
            className="w-full h-11 px-3.5 rounded-xl border border-amber-200 bg-white text-sm text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
          >
            {HEIGHT_OPTIONS.map((h) => (
              <option key={h.cm} value={h.cm}>
                {h.display}
              </option>
            ))}
          </select>
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            Weight (in kg) <span className="text-rose-500">*</span>
          </Label>
          <Input
            type="number"
            min={35}
            max={180}
            placeholder="e.g. 68"
            value={data.weightKg || ""}
            onChange={(e) =>
              onChange({ weightKg: parseInt(e.target.value, 10) || 0 })
            }
            className="h-11 rounded-xl border-amber-200 text-sm"
          />
        </div>

        {/* Blood Group */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            Blood Group <span className="text-rose-500">*</span>
          </Label>
          <select
            value={data.bloodGroup || "B+"}
            onChange={(e) =>
              onChange({ bloodGroup: e.target.value as BloodGroupOption })
            }
            className="w-full h-11 px-3.5 rounded-xl border border-amber-200 bg-white text-sm text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
          >
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        {/* Physical Status */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C] flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#EA580C]" />
            Physical Status <span className="text-rose-500">*</span>
          </Label>
          <select
            value={data.physicalStatus || "Normal"}
            onChange={(e) =>
              onChange({ physicalStatus: e.target.value as PhysicalStatusOption })
            }
            className="w-full h-11 px-3.5 rounded-xl border border-amber-200 bg-white text-sm text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
          >
            {PHYSICAL_STATUSES.map((ps) => (
              <option key={ps} value={ps}>
                {ps}
              </option>
            ))}
          </select>
        </div>

        {/* Body Type */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            Body Type
          </Label>
          <div className="grid grid-cols-4 gap-2 pt-1">
            {(["Slim", "Athletic", "Average", "Heavy"] as const).map((type) => {
              const isSelected = (data.bodyType || "Average") === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChange({ bodyType: type })}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all ${
                    isSelected
                      ? "bg-amber-100 border-[#EA580C] text-[#3B0A18] shadow-sm font-bold"
                      : "bg-white border-amber-200 text-[#5C4740] hover:bg-amber-50"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
