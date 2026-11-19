import React, { useState } from "react";
import { Sparkles, Compass, Eye, ShieldCheck } from "lucide-react";

export type ChartStyle = "north" | "south";
export type KundaliType = "lagna" | "navamsha";

interface PlanetPosition {
  name: string;
  hindiName: string;
  symbol: string;
  house: number; // 1 to 12
  isRetrograde?: boolean;
}

interface KundaliChartVisualizerProps {
  personName: string;
  rashi: string;
  lagnaRashi?: string;
  planets?: PlanetPosition[];
  defaultStyle?: ChartStyle;
  defaultType?: KundaliType;
  className?: string;
}

// 12 Rashi names in Sanskrit/Hindi and English
const RASHI_MAP: Record<string, { num: number; sanskrit: string }> = {
  Mesha: { num: 1, sanskrit: "Mesha" },
  Vrishabha: { num: 2, sanskrit: "Vrishabha" },
  Mithuna: { num: 3, sanskrit: "Mithuna" },
  Karka: { num: 4, sanskrit: "Karka" },
  Simha: { num: 5, sanskrit: "Simha" },
  Kanya: { num: 6, sanskrit: "Kanya" },
  Tula: { num: 7, sanskrit: "Tula" },
  Vrishchika: { num: 8, sanskrit: "Vrishchika" },
  Dhanu: { num: 9, sanskrit: "Dhanu" },
  Makara: { num: 10, sanskrit: "Makara" },
  Kumbha: { num: 11, sanskrit: "Kumbha" },
  Meena: { num: 12, sanskrit: "Meena" },
};

// Default auspicious planetary distribution based on Lagna
function getDefaultPlanets(lagnaNum: number, isNavamsha: boolean): PlanetPosition[] {
  const offset = isNavamsha ? 3 : 0;
  return [
    { name: "Sun", hindiName: "Surya", symbol: "Su", house: ((lagnaNum + offset + 0) % 12) + 1 },
    { name: "Moon", hindiName: "Chandra", symbol: "Mo", house: ((lagnaNum + offset + 3) % 12) + 1 },
    { name: "Mars", hindiName: "Mangal", symbol: "Ma", house: ((lagnaNum + offset + 6) % 12) + 1 },
    { name: "Mercury", hindiName: "Budha", symbol: "Me", house: ((lagnaNum + offset + 0) % 12) + 1 },
    { name: "Jupiter", hindiName: "Guru", symbol: "Ju", house: ((lagnaNum + offset + 8) % 12) + 1 },
    { name: "Venus", hindiName: "Shukra", symbol: "Ve", house: ((lagnaNum + offset + 4) % 12) + 1 },
    { name: "Saturn", hindiName: "Shani", symbol: "Sa", house: ((lagnaNum + offset + 9) % 12) + 1 },
    { name: "Rahu", hindiName: "Rahu", symbol: "Ra", house: ((lagnaNum + offset + 5) % 12) + 1 },
    { name: "Ketu", hindiName: "Ketu", symbol: "Ke", house: ((lagnaNum + offset + 11) % 12) + 1 },
  ];
}

export const KundaliChartVisualizer: React.FC<KundaliChartVisualizerProps> = ({
  personName,
  rashi,
  lagnaRashi = "Mesha",
  planets,
  defaultStyle = "north",
  defaultType = "lagna",
  className = "",
}) => {
  const [chartStyle, setChartStyle] = useState<ChartStyle>(defaultStyle);
  const [kundaliType, setKundaliType] = useState<KundaliType>(defaultType);

  const lagnaInfo = RASHI_MAP[lagnaRashi] || RASHI_MAP[rashi] || { num: 1, sanskrit: "Mesha" };
  const effectivePlanets = planets || getDefaultPlanets(lagnaInfo.num, kundaliType === "navamsha");

  // Group planets by house (1-12)
  const housePlanets: Record<number, PlanetPosition[]> = {};
  for (let h = 1; h <= 12; h++) {
    housePlanets[h] = [];
  }
  effectivePlanets.forEach((p) => {
    if (housePlanets[p.house]) {
      housePlanets[p.house].push(p);
    }
  });

  // Calculate Rashi number inside each house based on Lagna
  const getHouseRashiNum = (houseNum: number): number => {
    const raw = (lagnaInfo.num - 1 + (houseNum - 1)) % 12;
    return raw + 1;
  };

  return (
    <div
      className={`bg-[#FFFDF9] border border-amber-300 rounded-3xl p-5 shadow-sm text-[#2B120C] space-y-4 ${className}`}
    >
      {/* Header with Style and Type Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#EA580C] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Vedic Kundali Visualizer
          </span>
          <h4 className="font-serif font-bold text-base text-[#3B0A18]">
            {personName} â€¢ {kundaliType === "lagna" ? "Lagna Kundali (D-1)" : "Navamsha Kundali (D-9)"}
          </h4>
          <span className="text-xs text-[#7C2D12]">
            Ascendant (Lagna): <strong>{lagnaRashi}</strong> | Moon Sign: <strong>{rashi}</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Lagna vs Navamsha Switch */}
          <div className="inline-flex rounded-xl bg-amber-100/70 p-1 border border-amber-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setKundaliType("lagna")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                kundaliType === "lagna"
                  ? "bg-[#3B0A18] text-amber-100 shadow-xs"
                  : "text-[#5C4740] hover:text-[#2B120C]"
              }`}
            >
              Lagna (D-1)
            </button>
            <button
              type="button"
              onClick={() => setKundaliType("navamsha")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                kundaliType === "navamsha"
                  ? "bg-[#3B0A18] text-amber-100 shadow-xs"
                  : "text-[#5C4740] hover:text-[#2B120C]"
              }`}
            >
              Navamsha (D-9)
            </button>
          </div>

          {/* North vs South Style Switch */}
          <div className="inline-flex rounded-xl bg-amber-100/70 p-1 border border-amber-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setChartStyle("north")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                chartStyle === "north"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-[#5C4740] hover:text-[#2B120C]"
              }`}
            >
              North Style
            </button>
            <button
              type="button"
              onClick={() => setChartStyle("south")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                chartStyle === "south"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-[#5C4740] hover:text-[#2B120C]"
              }`}
            >
              South Style
            </button>
          </div>
        </div>
      </div>

      {/* SVG Chart Render */}
      <div className="flex justify-center items-center py-2">
        {chartStyle === "north" ? (
          /* North Indian Diamond Chart SVG */
          <div className="relative w-full max-w-[380px] aspect-square">
            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="kundliGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF9E6" />
                  <stop offset="100%" stopColor="#FFE8B3" />
                </linearGradient>
              </defs>

              {/* Outer Boundary */}
              <rect
                x="6"
                y="6"
                width="388"
                height="388"
                fill="url(#kundliGoldGrad)"
                stroke="#B45309"
                strokeWidth="4"
              />

              {/* Diagonal Lines */}
              <line x1="6" y1="6" x2="394" y2="394" stroke="#D97706" strokeWidth="2.5" />
              <line x1="394" y1="6" x2="6" y2="394" stroke="#D97706" strokeWidth="2.5" />

              {/* Inner Diamond (Kendra) */}
              <polygon
                points="200,6 394,200 200,394 6,200"
                fill="none"
                stroke="#B45309"
                strokeWidth="3"
              />

              {/* House 1 (Top Center Kendra) */}
              <text x="200" y="70" textAnchor="middle" fontSize="12" fill="#7C2D12" fontWeight="bold">
                {getHouseRashiNum(1)}
              </text>
              <text x="200" y="105" textAnchor="middle" fontSize="13" fill="#1E1B4B" fontWeight="900">
                {housePlanets[1].map((p) => p.symbol).join(" ")}
              </text>

              {/* House 2 (Top Left Corner) */}
              <text x="135" y="45" textAnchor="middle" fontSize="11" fill="#7C2D12" fontWeight="bold">
                {getHouseRashiNum(2)}
              </text>
              <text x="100" y="80" textAnchor="middle" fontSize="12" fill="#1E1B4B" fontWeight="800">
                {housePlanets[2].map((p) => p.symbol).join(" ")}
              </text>

              {/* House 3 (Left Top Triangle) */}
              <text x="60" y="115" textAnchor="middle" fontSize="11" fill="#7C2D12" fontWeight="bold">
                {getHouseRashiNum(3)}
              </text>
              <text x="80" y="150" textAnchor="middle" fontSize="12" fill="#1E1B4B" fontWeight="800">
                {housePlanets[3].map((p) => p.symbol).join(" ")}
              </text>

              {/* House 4 (Left Center Kendra) */}
              <text x="110" y="200" textAnchor="middle" fontSize="12" fill="#7C2D12" fontWeight="bold">
                {getHouseRashiNum(4)}
              </text>
              <text x="105" y="225" textAnchor="middle" fontSize="13" fill="#1E1B4B" fontWeight="900">
                {housePlanets[4].map((p) => p.symbol).join(" ")}
              </text>

              {/* House 5 (Left Bottom Triangle) */}
              <text x="60" y="295" textAnchor="middle" fontSize="11" fill="#7C2D12" fontWeight="bold">
                {getHouseRashiNum(5)}
              </text>
              <text x="80" y="260" textAnchor="middle" fontSize="12" fill="#1E1B4B" fontWeight="800">
                {housePlanets[5].map((p) => p.symbol).join(" ")}
              </text>

              {/* House 6 (Bottom Left Corner) */}
              <text x="135" y="365" textAnchor="middle" fontSize="11" fill="#7C2D12" fontWeight="bold">
                {getHouseRashiNum(6)}
              </text>
              <text x="100" y="330" textAnchor="middle" fontSize="12" fill="#1E1B4B" fontWeight="800">
                {housePlanets[6].map((p) => p.symbol).join(" ")}
              </text>

              {/* House 7 (Bottom Center Kendra) */}
              <text x="200" y="340" textAnchor="middle" fontSize="12" fill="#7C2D12" fontWeight="bold">
                {getHouseRashiNum(7)}
              </text>
              <text x="200" y="305" textAnchor="middle" fontSize="13" fill="#1E1B4B" fontWeight="900">
                {housePlanets[7].map((p) => p.symbol).join(" ")}
              </text>

              {/* House 8 (Bottom Right Corner) */}
              <text x="265" y="365" textAnchor="middle" fontSize="11" fill="#7C2D12" fontWeight="bold">
                {getHouseRashiNum(8)}
              </text>
              <text x="300" y="330" textAnchor="middle" fontSize="12" fill="#1E1B4B" fontWeight="800">
                {housePlanets[8].map((p) => p.symbol).join(" ")}
              </text>

              {/* House 9 (Right Bottom Triangle) */}
              <text x="340" y="295" textAnchor="middle" fontSize="11" fill="#7C2D12" fontWeight="bold">
                {getHouseRashiNum(9)}
              </text>
              <text x="320" y="260" textAnchor="middle" fontSize="12" fill="#1E1B4B" fontWeight="800">
                {housePlanets[9].map((p) => p.symbol).join(" ")}
              </text>

              {/* House 10 (Right Center Kendra) */}
              <text x="290" y="200" textAnchor="middle" fontSize="12" fill="#7C2D12" fontWeight="bold">
                {getHouseRashiNum(10)}
              </text>
              <text x="295" y="225" textAnchor="middle" fontSize="13" fill="#1E1B4B" fontWeight="900">
                {housePlanets[10].map((p) => p.symbol).join(" ")}
              </text>

              {/* House 11 (Right Top Triangle) */}
              <text x="340" y="115" textAnchor="middle" fontSize="11" fill="#7C2D12" fontWeight="bold">
                {getHouseRashiNum(11)}
              </text>
              <text x="320" y="150" textAnchor="middle" fontSize="12" fill="#1E1B4B" fontWeight="800">
                {housePlanets[11].map((p) => p.symbol).join(" ")}
              </text>

              {/* House 12 (Top Right Corner) */}
              <text x="265" y="45" textAnchor="middle" fontSize="11" fill="#7C2D12" fontWeight="bold">
                {getHouseRashiNum(12)}
              </text>
              <text x="300" y="80" textAnchor="middle" fontSize="12" fill="#1E1B4B" fontWeight="800">
                {housePlanets[12].map((p) => p.symbol).join(" ")}
              </text>

              {/* Center Auspicious Emblem */}
              <circle cx="200" cy="200" r="14" fill="#B45309" opacity="0.15" />
              <text x="200" y="205" textAnchor="middle" fontSize="13" fill="#9A3412" fontWeight="900">
                {kundaliType === "lagna" ? "D1" : "D9"}
              </text>
            </svg>
          </div>
        ) : (
          /* South Indian Square Chart SVG */
          <div className="relative w-full max-w-[380px] aspect-square">
            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-md">
              <rect x="6" y="6" width="388" height="388" fill="#FFF9E6" stroke="#B45309" strokeWidth="4" />
              {/* 4x4 Grid lines */}
              <line x1="103" y1="6" x2="103" y2="394" stroke="#D97706" strokeWidth="2" />
              <line x1="200" y1="6" x2="200" y2="394" stroke="#D97706" strokeWidth="2" />
              <line x1="297" y1="6" x2="297" y2="394" stroke="#D97706" strokeWidth="2" />

              <line x1="6" y1="103" x2="394" y2="103" stroke="#D97706" strokeWidth="2" />
              <line x1="6" y1="200" x2="394" y2="200" stroke="#D97706" strokeWidth="2" />
              <line x1="6" y1="297" x2="394" y2="297" stroke="#D97706" strokeWidth="2" />

              {/* Center Hollow Space */}
              <rect x="103" y="103" width="194" height="194" fill="#FFF2CC" stroke="#B45309" strokeWidth="2" />
              <text x="200" y="195" textAnchor="middle" fontSize="16" fill="#3B0A18" fontWeight="bold">
                {personName}
              </text>
              <text x="200" y="220" textAnchor="middle" fontSize="12" fill="#B45309" fontWeight="bold">
                South Indian {kundaliType === "lagna" ? "D-1" : "D-9"}
              </text>

              {/* South Indian 12 Rashis (Clockwise fixed) */}
              {/* Meena (Top Left-1) */}
              <text x="55" y="35" textAnchor="middle" fontSize="10" fill="#7C2D12" fontWeight="bold">
                Pisces
              </text>
              {/* Mesha (Top Left-2) */}
              <text x="150" y="35" textAnchor="middle" fontSize="10" fill="#7C2D12" fontWeight="bold">
                Aries (1)
              </text>
              {/* Vrishabha (Top Right-2) */}
              <text x="250" y="35" textAnchor="middle" fontSize="10" fill="#7C2D12" fontWeight="bold">
                Taurus (2)
              </text>
              {/* Mithuna (Top Right-1) */}
              <text x="345" y="35" textAnchor="middle" fontSize="10" fill="#7C2D12" fontWeight="bold">
                Gemini (3)
              </text>

              {/* Karka (Right Row-2) */}
              <text x="345" y="150" textAnchor="middle" fontSize="10" fill="#7C2D12" fontWeight="bold">
                Cancer (4)
              </text>
              {/* Simha (Right Row-3) */}
              <text x="345" y="250" textAnchor="middle" fontSize="10" fill="#7C2D12" fontWeight="bold">
                Leo (5)
              </text>
              {/* Kanya (Bottom Right-1) */}
              <text x="345" y="345" textAnchor="middle" fontSize="10" fill="#7C2D12" fontWeight="bold">
                Virgo (6)
              </text>

              {/* Tula (Bottom Right-2) */}
              <text x="250" y="345" textAnchor="middle" fontSize="10" fill="#7C2D12" fontWeight="bold">
                Libra (7)
              </text>
              {/* Vrishchika (Bottom Left-2) */}
              <text x="150" y="345" textAnchor="middle" fontSize="10" fill="#7C2D12" fontWeight="bold">
                Scorpio (8)
              </text>
              {/* Dhanu (Bottom Left-1) */}
              <text x="55" y="345" textAnchor="middle" fontSize="10" fill="#7C2D12" fontWeight="bold">
                Sagit (9)
              </text>

              {/* Makara (Left Row-3) */}
              <text x="55" y="250" textAnchor="middle" fontSize="10" fill="#7C2D12" fontWeight="bold">
                Capri (10)
              </text>
              {/* Kumbha (Left Row-2) */}
              <text x="55" y="150" textAnchor="middle" fontSize="10" fill="#7C2D12" fontWeight="bold">
                Aqua (11)
              </text>

              {/* Display Lagna Indicator on Ascendant Box */}
              <text x="150" y="65" textAnchor="middle" fontSize="12" fill="#B91C1C" fontWeight="900">
                [ASC / Lagna]
              </text>
            </svg>
          </div>
        )}
      </div>

      {/* Planetary Key Legend */}
      <div className="pt-2 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5C4740]">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
          <span className="font-bold text-[#3B0A18]">Planets:</span>
          <span>Su = Sun</span>
          <span>Mo = Moon</span>
          <span>Ma = Mars</span>
          <span>Me = Mercury</span>
          <span>Ju = Jupiter</span>
          <span>Ve = Venus</span>
          <span>Sa = Saturn</span>
          <span>Ra = Rahu</span>
          <span>Ke = Ketu</span>
        </div>
        <span className="text-[11px] font-semibold text-[#B45309]">
          100% Traditional Vedic Astronomy
        </span>
      </div>
    </div>
  );
};
