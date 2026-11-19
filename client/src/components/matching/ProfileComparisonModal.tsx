import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Heart,
  Scale,
  Briefcase,
  GraduationCap,
  MapPin,
  Calendar,
  FileDown,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { ProfileData } from "@/data/mockData";
import { downloadProtectedBiodataPdf, BiodataPdfTemplate } from "@/utils/biodataPdfGenerator";
import { useToast } from "@/hooks/use-toast";

interface ProfileComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateA: ProfileData;
  candidateB: ProfileData;
  onSendInterest?: (profileId: string) => void;
}

export const ProfileComparisonModal: React.FC<ProfileComparisonModalProps> = ({
  isOpen,
  onClose,
  candidateA,
  candidateB,
  onSendInterest,
}) => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<BiodataPdfTemplate>("classic_royal");

  if (!isOpen) return null;

  // Comparison metrics calculations
  const ageDiff = Math.abs(candidateA.age - candidateB.age);
  const isCasteMatch =
    candidateA.caste.toLowerCase() === candidateB.caste.toLowerCase() ||
    candidateA.religion.toLowerCase() === candidateB.religion.toLowerCase();
  const isDietMatch =
    (candidateA.lifestyle?.diet || "Vegetarian").toLowerCase() ===
    (candidateB.lifestyle?.diet || "Vegetarian").toLowerCase();
  const isKundliBothGood = candidateA.kundliScore >= 18 && candidateB.kundliScore >= 18;

  const handleDownload = async (profile: ProfileData) => {
    toast({
      title: "Generating Protected Biodata...",
      description: `Preparing ${selectedTemplate.replace("_", " ").toUpperCase()} template for ${profile.name}.`,
    });
    await downloadProtectedBiodataPdf(profile, "user-session", true, selectedTemplate);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#FFFDF9] border border-amber-300 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-[#2B120C] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#3B0A18] via-[#5A0E24] to-[#8B1E3F] text-amber-50 flex items-center justify-between rounded-t-3xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-1 border border-amber-500/30">
              <Scale className="w-3.5 h-3.5" />
              Side-by-Side Match Matrix
            </div>
            <h2 className="font-serif-royal text-xl sm:text-2xl font-bold text-amber-100">
              Candidate Compatibility Comparison
            </h2>
            <p className="text-xs text-amber-200/80 mt-0.5">
              Automated compatibility highlights: Green indicates alignment, Amber indicates points of discussion.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profiles Banner Cards */}
        <div className="p-4 sm:p-6 grid grid-cols-2 gap-4 border-b border-amber-200/80 bg-amber-50/40">
          {/* Candidate A */}
          <div className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <img
              src={candidateA.photos[0]}
              alt={candidateA.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-500 shadow-xs"
            />
            <div className="text-center sm:text-left truncate">
              <h3 className="font-serif-royal font-bold text-base text-[#3B0A18] truncate">
                {candidateA.name}
              </h3>
              <p className="text-xs text-[#5C4740] truncate">
                {candidateA.age} Yrs â€¢ {candidateA.city}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-100 text-[#7C2D12] text-[10px] font-bold">
                {candidateA.caste}
              </span>
            </div>
          </div>

          {/* Candidate B */}
          <div className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <img
              src={candidateB.photos[0]}
              alt={candidateB.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-500 shadow-xs"
            />
            <div className="text-center sm:text-left truncate">
              <h3 className="font-serif-royal font-bold text-base text-[#3B0A18] truncate">
                {candidateB.name}
              </h3>
              <p className="text-xs text-[#5C4740] truncate">
                {candidateB.age} Yrs â€¢ {candidateB.city}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-100 text-[#7C2D12] text-[10px] font-bold">
                {candidateB.caste}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="p-4 sm:p-6 overflow-x-auto space-y-4">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-amber-100/70 border-b border-amber-200 text-[#7C2D12] uppercase font-bold text-[11px]">
                <th className="p-3 w-1/3">Compatibility Parameter</th>
                <th className="p-3 w-1/3">{candidateA.name}</th>
                <th className="p-3 w-1/3">{candidateB.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {/* Age & Difference */}
              <tr className="hover:bg-amber-50/50">
                <td className="p-3 font-semibold text-stone-700">
                  Age & Gap
                  <div className="text-[10px] font-normal text-stone-400">
                    Difference: {ageDiff} Years
                  </div>
                </td>
                <td className="p-3 font-medium text-stone-900">{candidateA.age} Years</td>
                <td className="p-3 font-medium text-stone-900">{candidateB.age} Years</td>
              </tr>

              {/* Height */}
              <tr className="hover:bg-amber-50/50">
                <td className="p-3 font-semibold text-stone-700">Height</td>
                <td className="p-3 font-medium text-stone-900">{candidateA.height}</td>
                <td className="p-3 font-medium text-stone-900">{candidateB.height}</td>
              </tr>

              {/* Religion & Caste */}
              <tr className={isCasteMatch ? "bg-emerald-50/50" : ""}>
                <td className="p-3 font-semibold text-stone-700">
                  Religion & Caste
                  {isCasteMatch && (
                    <span className="block text-[10px] text-emerald-700 font-bold">
                      âœ“ Community Aligned
                    </span>
                  )}
                </td>
                <td className="p-3 font-medium text-stone-900">
                  {candidateA.religion} - {candidateA.caste}
                </td>
                <td className="p-3 font-medium text-stone-900">
                  {candidateB.religion} - {candidateB.caste}
                </td>
              </tr>

              {/* Kundali Score */}
              <tr className={isKundliBothGood ? "bg-emerald-50/50" : ""}>
                <td className="p-3 font-semibold text-stone-700">
                  Vedic Kundali Gunas
                  <span className="block text-[10px] text-amber-700 font-medium">
                    Out of 36 Ashtakoot Gunas
                  </span>
                </td>
                <td className="p-3 font-bold text-amber-900">
                  {candidateA.kundliScore} / 36 Gunas
                </td>
                <td className="p-3 font-bold text-amber-900">
                  {candidateB.kundliScore} / 36 Gunas
                </td>
              </tr>

              {/* Manglik Status */}
              <tr className="hover:bg-amber-50/50">
                <td className="p-3 font-semibold text-stone-700">Manglik Status</td>
                <td className="p-3 font-medium text-stone-900">{candidateA.manglik}</td>
                <td className="p-3 font-medium text-stone-900">{candidateB.manglik}</td>
              </tr>

              {/* Education */}
              <tr className="hover:bg-amber-50/50">
                <td className="p-3 font-semibold text-stone-700">Education</td>
                <td className="p-3 font-medium text-stone-900">{candidateA.education}</td>
                <td className="p-3 font-medium text-stone-900">{candidateB.education}</td>
              </tr>

              {/* Profession & Income */}
              <tr className="hover:bg-amber-50/50">
                <td className="p-3 font-semibold text-stone-700">Profession & Income</td>
                <td className="p-3 font-medium text-stone-900">
                  {candidateA.profession} ({candidateA.income})
                </td>
                <td className="p-3 font-medium text-stone-900">
                  {candidateB.profession} ({candidateB.income})
                </td>
              </tr>

              {/* Diet / Lifestyle */}
              <tr className={isDietMatch ? "bg-emerald-50/50" : "bg-rose-50/40"}>
                <td className="p-3 font-semibold text-stone-700">
                  Dietary Habits
                  {isDietMatch ? (
                    <span className="block text-[10px] text-emerald-700 font-bold">
                      âœ“ Diet Harmony
                    </span>
                  ) : (
                    <span className="block text-[10px] text-rose-700 font-bold">
                      âš  Dietary Discrepancy
                    </span>
                  )}
                </td>
                <td className="p-3 font-medium text-stone-900">
                  {candidateA.lifestyle?.diet || "Vegetarian"}
                </td>
                <td className="p-3 font-medium text-stone-900">
                  {candidateB.lifestyle?.diet || "Vegetarian"}
                </td>
              </tr>

              {/* Marriage Horizon Tag */}
              <tr className="hover:bg-amber-50/50">
                <td className="p-3 font-semibold text-stone-700">Marriage Timeline Intent</td>
                <td className="p-3 font-medium text-emerald-800">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[10px] font-bold">
                    Marriage in 3-6 Months
                  </span>
                </td>
                <td className="p-3 font-medium text-blue-800">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[10px] font-bold">
                    Within 1 Year
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Template Selector for Biodata Download */}
          <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#3B0A18] block">
                Select Biodata PDF Presentation Template:
              </span>
              <span className="text-[11px] text-[#5C4740]">
                Choose styling before downloading Pandit-ready matrimonial bio-data.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as BiodataPdfTemplate)}
                className="text-xs font-semibold bg-white border border-amber-300 rounded-xl px-3 py-1.5 focus:outline-none"
              >
                <option value="classic_royal">Classic Royal (Saffron & Gold)</option>
                <option value="modern_minimalist">Modern Minimalist (Slate / Emerald)</option>
                <option value="vedic_traditional">Vedic Traditional (Ganesha Invocations)</option>
              </select>

              <button
                type="button"
                onClick={() => handleDownload(candidateA)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#3B0A18] hover:bg-[#5A0E24] text-amber-100 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <FileDown className="w-3.5 h-3.5" />
                Download {candidateA.name.split(" ")[0]}
              </button>
              <button
                type="button"
                onClick={() => handleDownload(candidateB)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <FileDown className="w-3.5 h-3.5" />
                Download {candidateB.name.split(" ")[0]}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-amber-200 flex items-center justify-between rounded-b-3xl">
          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Zero photo leaks: Biodata downloads strictly exclude private photographs.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-100 transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
