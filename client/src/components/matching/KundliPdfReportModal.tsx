import React, { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { KundliMatchingResult } from "@shared/vedicAstrologyEngine";
import {
  Sparkles,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Calendar,
  Clock,
  MapPin,
  X,
} from "lucide-react";
import { VivahBrandLogo } from "@/components/home/VivahBrandLogo";
import { KundaliChartVisualizer } from "@/components/matching/KundaliChartVisualizer";

interface KundliPdfReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: KundliMatchingResult | null;
}

export const KundliPdfReportModal: React.FC<KundliPdfReportModalProps> = ({
  open,
  onOpenChange,
  result,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  if (!result) return null;

  const handlePrint = () => {
    window.print();
  };

  const isExcellent = result.totalScore >= 28;
  const isGood = result.totalScore >= 18;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] max-h-[92vh] overflow-y-auto rounded-3xl border border-amber-300 bg-[#FFFDF9] p-0 shadow-2xl print:max-h-none print:overflow-visible print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none">
        {/* Print Styles for Crisp A4 Vector PDF Output */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-kundli-report, #printable-kundli-report * {
              visibility: visible;
            }
            #printable-kundli-report {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 24px;
              background-color: #FFFFFF !important;
              color: #000000 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print {
              display: none !important;
            }
            @page {
              size: A4 portrait;
              margin: 12mm;
            }
          }
        `}</style>

        {/* Top Floating Action Bar (Hidden on Print) */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-3.5 border-b border-amber-200 flex items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF7700]" />
            <span className="font-serif-royal text-base font-bold text-[#2B120C]">
              Vedic Kundli Compatibility Certificate
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={handlePrint}
              className="h-9 px-4 rounded-xl bg-saffron-gradient text-white text-xs font-bold shadow-saffron-sm hover:opacity-95"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Download / Print PDF
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-9 w-9 rounded-full border-amber-200 text-[#3B0A18]"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Printable Certificate Document Canvas */}
        <div
          id="printable-kundli-report"
          ref={reportRef}
          className="p-6 sm:p-10 space-y-6 bg-[#FFFDF9] text-[#2B120C] border-[6px] border-double border-amber-300 m-2 sm:m-4 rounded-2xl relative"
        >
          {/* Watermark in Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none select-none z-0">
            <p className="font-serif-royal text-7xl font-bold uppercase tracking-widest text-amber-900 rotate-[-30deg]">
              Vivah Kar Lo
            </p>
          </div>

          {/* Certificate Header */}
          <div className="relative z-10 text-center pb-5 border-b-2 border-amber-200/90 space-y-2">
            <div className="flex items-center justify-center gap-3">
              <VivahBrandLogo size="md" />
            </div>
            <p className="text-xs uppercase tracking-widest font-semibold text-[#8C6D62]">
              Official Vedic Horoscope Matching Certificate • 36-Guna Ashtakoot Milan
            </p>
            <div className="flex items-center justify-center gap-3 text-[11px] text-[#785C52]">
              <span>Report ID: <strong>{result.reportId}</strong></span>
              <span>•</span>
              <span>Date: <strong>{result.generatedAt}</strong></span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Vedic Algorithmic Verification
              </span>
            </div>
          </div>

          {/* Bride & Groom Comparison Card */}
          <div className="relative z-10 grid grid-cols-2 gap-4 sm:gap-6 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/80 p-4 sm:p-5 rounded-2xl border border-amber-200">
            {/* Groom Dossier */}
            <div className="space-y-1.5 border-r border-amber-200/70 pr-3 sm:pr-4">
              <span className="px-2 py-0.5 rounded-md bg-[#3B0A18] text-amber-100 text-[10px] font-bold uppercase tracking-wider">
                Groom Dossier
              </span>
              <h3 className="font-serif-royal text-lg sm:text-xl font-bold text-[#2B120C]">
                {result.groom.name}
              </h3>
              <div className="text-xs text-[#5C4740] space-y-0.5">
                <p><strong>Rashi (Moon Sign):</strong> {result.groom.rashi}</p>
                <p><strong>Nakshatra (Birth Star):</strong> {result.groom.nakshatra}</p>
                <p><strong>Manglik Status:</strong> {result.groom.manglik}</p>
                {result.groom.gotra && <p><strong>Gotra:</strong> {result.groom.gotra}</p>}
                {result.groom.birthPlace && (
                  <p className="text-[11px] text-[#8C6D62]">
                    Birth: {result.groom.birthPlace} {result.groom.birthDate ? `• ${result.groom.birthDate}` : ""}
                  </p>
                )}
              </div>
            </div>

            {/* Bride Dossier */}
            <div className="space-y-1.5 pl-1 sm:pl-2">
              <span className="px-2 py-0.5 rounded-md bg-[#EA580C] text-white text-[10px] font-bold uppercase tracking-wider">
                Bride Dossier
              </span>
              <h3 className="font-serif-royal text-lg sm:text-xl font-bold text-[#2B120C]">
                {result.bride.name}
              </h3>
              <div className="text-xs text-[#5C4740] space-y-0.5">
                <p><strong>Rashi (Moon Sign):</strong> {result.bride.rashi}</p>
                <p><strong>Nakshatra (Birth Star):</strong> {result.bride.nakshatra}</p>
                <p><strong>Manglik Status:</strong> {result.bride.manglik}</p>
                {result.bride.gotra && <p><strong>Gotra:</strong> {result.bride.gotra}</p>}
                {result.bride.birthPlace && (
                  <p className="text-[11px] text-[#8C6D62]">
                    Birth: {result.bride.birthPlace} {result.bride.birthDate ? `• ${result.bride.birthDate}` : ""}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Central Royal Score Circle Banner */}
          <div className="relative z-10 bg-gradient-to-br from-[#2B0712] via-[#3B0A18] to-[#2B0712] text-white p-6 rounded-2xl border-2 border-amber-300 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold border border-amber-300/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{result.verdictTitle}</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <p className="font-serif-royal text-5xl sm:text-6xl font-extrabold text-amber-300">
                {result.totalScore}
                <span className="text-2xl text-amber-100/70"> / {result.maxScore}</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-amber-100/90 max-w-lg mx-auto font-medium">
              {result.verdictSummary}
            </p>

            <div className="pt-1 flex items-center justify-center gap-4 text-xs font-semibold text-amber-200">
              <span>Compatibility: <strong>{result.percentage}%</strong></span>
              <span>•</span>
              <span>Minimum Threshold: <strong>18 Gunas</strong></span>
            </div>
          </div>

          {/* 8-Koota Detailed Breakdown Table */}
          <div className="relative z-10 space-y-2">
            <h4 className="font-serif-royal text-base font-bold text-[#3B0A18] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#EA580C]" />
              Detailed 8-Koota (Ashtakoot) Gunas Breakdown
            </h4>

            <div className="border border-amber-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-amber-100/70 border-b border-amber-200 text-[#3B0A18] font-bold">
                  <tr>
                    <th className="p-2.5 sm:p-3">Koota</th>
                    <th className="p-2.5 sm:p-3">Life Sphere</th>
                    <th className="p-2.5 sm:p-3 text-center">Max</th>
                    <th className="p-2.5 sm:p-3 text-center">Scored</th>
                    <th className="p-2.5 sm:p-3 hidden sm:table-cell">Astrological Analysis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 text-[#4E342E]">
                  {result.kootas.map((k) => (
                    <tr key={k.koota} className="hover:bg-amber-50/40">
                      <td className="p-2.5 sm:p-3 font-bold text-[#2B120C]">
                        {k.koota}
                      </td>
                      <td className="p-2.5 sm:p-3 font-medium text-[#7C2D12]">
                        {k.area}
                      </td>
                      <td className="p-2.5 sm:p-3 text-center font-semibold text-[#8C6D62]">
                        {k.maxScore}
                      </td>
                      <td className="p-2.5 sm:p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                            k.obtainedScore === k.maxScore
                              ? "bg-emerald-100 text-emerald-800"
                              : k.obtainedScore > 0
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {k.obtainedScore}
                        </span>
                      </td>
                      <td className="p-2.5 sm:p-3 text-[11px] text-[#5C4740] hidden sm:table-cell">
                        {k.description}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-amber-50 font-bold border-t-2 border-amber-300 text-[#2B120C]">
                    <td colSpan={2} className="p-3 text-right">
                      Total Vedic Alignment Score:
                    </td>
                    <td className="p-3 text-center font-bold">36</td>
                    <td className="p-3 text-center font-extrabold text-sm text-[#EA580C]">
                      {result.totalScore}
                    </td>
                    <td className="p-3 text-xs text-emerald-800 hidden sm:table-cell">
                      {result.verdictCategory === "Uttam"
                        ? "Outstanding compatibility"
                        : result.verdictCategory === "Madhyam"
                        ? "Auspicious & favorable"
                        : "Threshold met"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Dosha & Astrological Health Analysis Cards */}
          <div className="relative z-10 grid sm:grid-cols-2 gap-3 pt-1">
            {/* Nadi Dosha Card */}
            <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#2B120C]">
                  Nadi Compatibility (Genetic Harmony)
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    !result.doshas.nadiDosha.hasDosha || result.doshas.nadiDosha.isCancelled
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {!result.doshas.nadiDosha.hasDosha
                    ? "No Nadi Dosha ✓"
                    : result.doshas.nadiDosha.isCancelled
                    ? "Parihara (Cancelled) ✓"
                    : "Nadi Dosha Present"}
                </span>
              </div>
              <p className="text-[11px] text-[#5C4740]">
                {result.doshas.nadiDosha.description}
              </p>
            </div>

            {/* Bhakoot Dosha Card */}
            <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#2B120C]">
                  Bhakoot Harmony (Prosperity &amp; Love)
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    !result.doshas.bhakootDosha.hasDosha || result.doshas.bhakootDosha.isCancelled
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {!result.doshas.bhakootDosha.hasDosha
                    ? "No Bhakoot Dosha ✓"
                    : result.doshas.bhakootDosha.isCancelled
                    ? "Parihara (Cancelled) ✓"
                    : "Bhakoot Dosha"}
                </span>
              </div>
              <p className="text-[11px] text-[#5C4740]">
                {result.doshas.bhakootDosha.description}
              </p>
            </div>

            {/* Manglik Compatibility Card */}
            <div className="sm:col-span-2 p-3.5 rounded-xl bg-[#FFF9F2] border border-amber-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#2B120C]">
                  Manglik Dosha Assessment
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    result.doshas.manglikCompatibility.isCompatible
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {result.doshas.manglikCompatibility.isCompatible
                    ? "Manglik Compatible ✓"
                    : "Remedies Suggested"}
                </span>
              </div>
              <p className="text-xs text-[#5C4740]">
                {result.doshas.manglikCompatibility.verdict}
              </p>
              {result.doshas.manglikCompatibility.remedyRecommendation && (
                <p className="text-[11px] text-amber-800 italic">
                  Remedy: {result.doshas.manglikCompatibility.remedyRecommendation}
                </p>
              )}
            </div>
          </div>

          {/* Interactive Vedic Kundali Charts (Groom & Bride) */}
          <div className="relative z-10 pt-2 space-y-4">
            <h4 className="font-serif-royal text-base font-bold text-[#3B0A18] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#EA580C]" />
              Composite Vedic Lagna & Navamsha Charts
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <KundaliChartVisualizer
                personName={result.groom.name}
                rashi={result.groom.rashi}
                lagnaRashi={result.groom.rashi}
                defaultStyle="north"
                defaultType="lagna"
              />
              <KundaliChartVisualizer
                personName={result.bride.name}
                rashi={result.bride.rashi}
                lagnaRashi={result.bride.rashi}
                defaultStyle="north"
                defaultType="lagna"
              />
            </div>
          </div>

          {/* Astrological Verdict & Recommendation */}
          <div className="relative z-10 p-4 rounded-xl bg-amber-50/90 border border-amber-300 text-xs space-y-1">
            <h5 className="font-bold text-[#3B0A18] uppercase tracking-wide">
              Official Vedic Recommendation:
            </h5>
            <p className="text-[#4E342E] leading-relaxed">
              {result.recommendation}
            </p>
          </div>

          {/* Official Sign-off Stamp & Legal Disclaimer */}
          <div className="relative z-10 pt-4 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-[#8C6D62]">
            <p>
              Generated by <strong>Vivah Kar Lo™ Vedic Matching Engine</strong>. Computed according to Brihat Parashara Hora Shastra rules.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-16 h-8 border border-dashed border-amber-400 rounded flex items-center justify-center font-serif-royal text-[9px] font-bold text-[#EA580C] uppercase">
                Seal of Vivah
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
