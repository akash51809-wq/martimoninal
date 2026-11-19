import React from "react";
import type {
  Step3EducationCareerData,
  EmploymentTypeOption,
  AnnualIncomeOption,
} from "@/types/matrimonialProfileTypes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Briefcase, GraduationCap, IndianRupee, MapPin } from "lucide-react";

interface Step3Props {
  data: Partial<Step3EducationCareerData>;
  onChange: (updates: Partial<Step3EducationCareerData>) => void;
}

const DEGREES = [
  "B.Tech / B.E / Engineering",
  "M.Tech / M.E / MS",
  "MBA / PGDM / Management",
  "MBBS / MD / MS (Doctor)",
  "BDS / MDS (Dental)",
  "CA (Chartered Accountant) / CS",
  "B.Com / M.Com / Finance",
  "B.Sc / M.Sc / Science",
  "BCA / MCA / Computers",
  "Law / LLB / LLM",
  "B.Arch / M.Arch (Architecture)",
  "PhD / Doctorate",
  "B.A / M.A / Humanities",
  "Diploma / Higher Secondary",
  "Other Degree",
];

const EMPLOYMENT_TYPES: EmploymentTypeOption[] = [
  "Private Company",
  "Government / Public Sector",
  "Business / Entrepreneur",
  "Civil Services / IAS / IPS",
  "Defense / Armed Forces",
  "Self Employed / Consultant",
  "Not Working",
  "NRI / Working Abroad",
];

const ANNUAL_INCOMES: AnnualIncomeOption[] = [
  "Below ₹3 Lakhs",
  "₹3 - 5 Lakhs",
  "₹5 - 7.5 Lakhs",
  "₹7.5 - 10 Lakhs",
  "₹10 - 15 Lakhs",
  "₹15 - 25 Lakhs",
  "₹25 - 50 Lakhs",
  "₹50 Lakhs - 1 Crore",
  "₹1 Crore+ / $150K+",
];

export const Step3EducationCareer: React.FC<Step3Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="font-serif-royal text-xl sm:text-2xl font-bold text-[#2B120C] flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#EA580C]" />
          Step 3: Education &amp; Career Details
        </h2>
        <p className="text-sm text-[#5C4740] mt-1">
          Highlight your academic achievements, profession, employer, and annual compensation package.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Highest Degree */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            Highest Qualification <span className="text-rose-500">*</span>
          </Label>
          <select
            value={data.highestDegree || "B.Tech / B.E / Engineering"}
            onChange={(e) => onChange({ highestDegree: e.target.value })}
            className="w-full h-11 px-3.5 rounded-xl border border-amber-200 bg-white text-sm text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
          >
            {DEGREES.map((deg) => (
              <option key={deg} value={deg}>
                {deg}
              </option>
            ))}
          </select>
        </div>

        {/* College / University */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            College / Institute Name <span className="text-rose-500">*</span>
          </Label>
          <Input
            placeholder="e.g. IIT Bombay, IIM Ahmedabad, Delhi University"
            value={data.collegeUniversity || ""}
            onChange={(e) => onChange({ collegeUniversity: e.target.value })}
            className="h-11 rounded-xl border-amber-200 text-sm"
          />
        </div>

        {/* Employed In */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C] flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-[#EA580C]" />
            Employed In <span className="text-rose-500">*</span>
          </Label>
          <select
            value={data.employedIn || "Private Company"}
            onChange={(e) =>
              onChange({ employedIn: e.target.value as EmploymentTypeOption })
            }
            className="w-full h-11 px-3.5 rounded-xl border border-amber-200 bg-white text-sm text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
          >
            {EMPLOYMENT_TYPES.map((emp) => (
              <option key={emp} value={emp}>
                {emp}
              </option>
            ))}
          </select>
        </div>

        {/* Occupation / Designation */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            Occupation / Designation <span className="text-rose-500">*</span>
          </Label>
          <Input
            placeholder="e.g. Senior Software Architect, Doctor, VP Product"
            value={data.occupation || ""}
            onChange={(e) => onChange({ occupation: e.target.value })}
            className="h-11 rounded-xl border-amber-200 text-sm"
          />
        </div>

        {/* Organization Name */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            Employer / Organization Name (Optional)
          </Label>
          <Input
            placeholder="e.g. Google, Microsoft, Govt of India, Self"
            value={data.organizationName || ""}
            onChange={(e) => onChange({ organizationName: e.target.value })}
            className="h-11 rounded-xl border-amber-200 text-sm"
          />
        </div>

        {/* Annual Income */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C] flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-[#EA580C]" />
            Annual Income Package <span className="text-rose-500">*</span>
          </Label>
          <select
            value={data.annualIncome || "₹15 - 25 Lakhs"}
            onChange={(e) =>
              onChange({ annualIncome: e.target.value as AnnualIncomeOption })
            }
            className="w-full h-11 px-3.5 rounded-xl border border-amber-200 bg-white text-sm text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
          >
            {ANNUAL_INCOMES.map((inc) => (
              <option key={inc} value={inc}>
                {inc}
              </option>
            ))}
          </select>
        </div>

        {/* Work City */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#EA580C]" />
            Work City <span className="text-rose-500">*</span>
          </Label>
          <Input
            placeholder="e.g. Mumbai, Bengaluru, Delhi NCR, London"
            value={data.workCity || ""}
            onChange={(e) => onChange({ workCity: e.target.value })}
            className="h-11 rounded-xl border-amber-200 text-sm"
          />
        </div>

        {/* Work State & Country */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-[#2B120C]">
              State <span className="text-rose-500">*</span>
            </Label>
            <Input
              placeholder="e.g. Maharashtra"
              value={data.workState || ""}
              onChange={(e) => onChange({ workState: e.target.value })}
              className="h-11 rounded-xl border-amber-200 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-[#2B120C]">
              Country <span className="text-rose-500">*</span>
            </Label>
            <Input
              placeholder="e.g. India, USA"
              value={data.workCountry || "India"}
              onChange={(e) => onChange({ workCountry: e.target.value })}
              className="h-11 rounded-xl border-amber-200 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
