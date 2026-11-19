import React, { useState } from "react";
import { useMobileApp } from "../../../context/MobileAppContext";
import { ChevronLeft, Sparkles, ShieldCheck, Sun, Moon, Compass, HeartHandshake } from "lucide-react";
import { MOCK_PROFILES } from "../../../data/mockData";

export const KundliMilanScreen: React.FC = () => {
  const { selectedProfile, setSelectedProfile, setCurrentScreen, user } = useMobileApp();
  const [selectedMatchId, setSelectedMatchId] = useState(selectedProfile.id);

  const candidate = MOCK_PROFILES.find((p) => p.id === selectedMatchId) || selectedProfile;

  // 8 Guna (Ashtakoot) Milan breakdown
  const ashtakootItems = [
    { name: "Varna", score: 1, max: 1, area: "Work & Spiritual Compatibility", desc: "Mutual respect and ego harmony" },
    { name: "Vashya", score: 2, max: 2, area: "Mutual Attraction & Dominance", desc: "Balanced equation and mutual affection" },
    { name: "Tara", score: 3, max: 3, area: "Destiny & Health Compatibility", desc: "Long, prosperous life together" },
    { name: "Yoni", score: 4, max: 4, area: "Physical & Intimacy Compatibility", desc: "Physical harmony and mutual joy" },
    { name: "Graha Maitri", score: 5, max: 5, area: "Mental Outlook & Friendship", desc: "Friendship and shared life vision" },
    { name: "Gana", score: 5, max: 6, area: "Temperament & Nature", desc: "Deva & Manushya combination (Auspicious)" },
    { name: "Bhakoot", score: 6, max: 7, area: "Love & Financial Prosperity", desc: "Growth in wealth and emotional bliss" },
    { name: "Nadi", score: 8, max: 8, area: "Genetic Health & Progeny", desc: "Different Nadis (No Nadi Dosha)" }
  ];

  const totalScore = ashtakootItems.reduce((acc, curr) => acc + curr.score, 0); // 34 out of 36

  return (
    <div className="relative w-full h-full min-h-[700px] flex flex-col bg-[#FFFDF9] overflow-y-auto no-scrollbar select-none">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-gray-100 shadow-xs">
        <button
          onClick={() => setCurrentScreen("feed")}
          className="flex items-center gap-1 text-gray-700 hover:text-orange-600 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4 text-orange-600" />
          <span>Back</span>
        </button>

        <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Vedic Kundli Milan</span>
        </h2>

        <span className="text-xs text-orange-600 font-bold">36 Gunas</span>
      </div>

      <div className="p-4 space-y-5 pb-28">
        {/* Match Selector Strip */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {MOCK_PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedMatchId(p.id);
                setSelectedProfile(p);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all ${
                p.id === candidate.id
                  ? "bg-orange-50 border-orange-500 text-orange-700 shadow-2xs"
                  : "bg-white border-gray-200 text-gray-600"
              }`}
            >
              <img src={p.photos[0]} alt={p.name} className="w-5 h-5 rounded-full object-cover" />
              <span>{p.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* Circular Guna Score Hero Card */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 text-white text-center shadow-saffron relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          {/* Couple Names */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-center">
              <img
                src={user.photo}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-white mx-auto shadow-md"
              />
              <span className="text-xs font-bold block mt-1">{user.name.split(" ")[0]}</span>
              <span className="text-[10px] text-amber-200">Groom</span>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold">
              +
            </div>

            <div className="text-center">
              <img
                src={candidate.photos[0]}
                alt={candidate.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-white mx-auto shadow-md"
              />
              <span className="text-xs font-bold block mt-1">{candidate.name.split(" ")[0]}</span>
              <span className="text-[10px] text-amber-200">Bride</span>
            </div>
          </div>

          {/* Score Badge */}
          <div className="inline-flex flex-col items-center justify-center bg-white/20 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/30">
            <span className="text-3xl font-extrabold tracking-tight">{totalScore} / 36</span>
            <span className="text-[11px] font-semibold text-amber-100 uppercase tracking-wider">
              Ashtakoot Guna Match
            </span>
          </div>

          <div className="mt-3 text-xs text-amber-100 font-medium">
            Verdict: <span className="text-white font-bold underline">Uttam (Highly Recommended Match)</span>
          </div>
        </div>

        {/* Manglik Dosha Verification Box */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Manglik Dosha Status</h4>
              <p className="text-[11px] text-emerald-700 font-semibold">
                Both are Non-Manglik (No Dosha Conflict)
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
            Safe 100%
          </span>
        </div>

        {/* 8 Ashtakoot Guna Breakdown */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider px-1">
            Ashtakoot Milan Breakdown (8 Kootas)
          </h3>

          <div className="space-y-2">
            {ashtakootItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-800">{item.name}</span>
                    <span className="text-[10px] text-gray-400 font-medium">({item.area})</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                </div>

                <div className="text-right shrink-0 ml-3">
                  <span className="text-sm font-bold text-orange-600">
                    {item.score} <span className="text-gray-400 text-xs">/ {item.max}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Astrologer Consultation Simulation */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200 text-center space-y-2">
          <p className="text-xs font-bold text-amber-950">
            Want detailed planetary Dasha analysis by Senior Vedic Astrologer?
          </p>
          <button
            onClick={() => alert("Connecting you with Acharya Shastri for Kundli consultation (Included with Gold/Platinum VIP)!")}
            className="px-4 py-2 bg-saffron-gradient text-white rounded-full text-xs font-bold shadow-saffron-sm hover:opacity-95"
          >
            Consult Astrologer Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default KundliMilanScreen;
