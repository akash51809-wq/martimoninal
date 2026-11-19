import React from "react";
import { useMobileApp } from "../../../context/MobileAppContext";
import { ChevronLeft, RotateCcw, Filter, Check } from "lucide-react";
import { MOCK_COMMUNITIES } from "../../../data/mockData";

export const FilterScreen: React.FC = () => {
  const { filters, updateFilters, resetFilters, setCurrentScreen, filteredProfiles } = useMobileApp();

  const handleApply = () => {
    setCurrentScreen("feed");
  };

  return (
    <div className="relative w-full h-full min-h-[700px] flex flex-col bg-[#FFFDF9] overflow-y-auto no-scrollbar select-none">
      {/* Top Header (matching reference image) */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-gray-100 shadow-xs">
        <button
          onClick={() => setCurrentScreen("feed")}
          className="flex items-center gap-1 text-gray-700 hover:text-orange-600 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4 text-orange-600" />
          <span>Filter</span>
        </button>

        <h2 className="text-base font-bold text-gray-900 tracking-tight">Match Preferences</h2>

        {/* Clear Button (Red/Saffron pill matching reference image) */}
        <button
          onClick={resetFilters}
          className="px-3 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="p-5 space-y-6 pb-28">
        {/* 1. Age Range Slider (matching reference image) */}
        <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-gray-800">Age Range</label>
            <div className="flex items-center gap-1 text-xs font-bold text-orange-600">
              <span className="px-2 py-0.5 bg-orange-100 rounded-md">{filters.minAge} yrs</span>
              <span>-</span>
              <span className="px-2 py-0.5 bg-orange-100 rounded-md">{filters.maxAge} yrs</span>
            </div>
          </div>

          <div className="pt-2 px-1">
            <input
              type="range"
              min={20}
              max={40}
              value={filters.maxAge}
              onChange={(e) => updateFilters({ maxAge: Number(e.target.value) })}
              className="w-full accent-orange-600 cursor-pointer h-2 bg-orange-100 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>20 yrs</span>
              <span>25 yrs</span>
              <span>30 yrs</span>
              <span>35 yrs</span>
              <span>40 yrs</span>
            </div>
          </div>
        </div>

        {/* 2. Height Range (matching reference image) */}
        <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-gray-800">Height (Ft In)</label>
            <div className="flex items-center gap-1 text-xs font-bold text-orange-600">
              <span className="px-2 py-0.5 bg-orange-100 rounded-md">
                {Math.floor(filters.minHeight / 30.48)}'{Math.round((filters.minHeight % 30.48) / 2.54)}"
              </span>
              <span>-</span>
              <span className="px-2 py-0.5 bg-orange-100 rounded-md">
                {Math.floor(filters.maxHeight / 30.48)}'{Math.round((filters.maxHeight % 30.48) / 2.54)}"
              </span>
            </div>
          </div>

          <div className="pt-2 px-1">
            <input
              type="range"
              min={145}
              max={195}
              value={filters.maxHeight}
              onChange={(e) => updateFilters({ maxHeight: Number(e.target.value) })}
              className="w-full accent-orange-600 cursor-pointer h-2 bg-orange-100 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>4'9"</span>
              <span>5'3"</span>
              <span>5'8"</span>
              <span>6'1"</span>
              <span>6'5"</span>
            </div>
          </div>
        </div>

        {/* 3. Caste & Sub-caste (matching reference image) */}
        <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">Caste</label>
            <select
              value={filters.caste}
              onChange={(e) => updateFilters({ caste: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="All">Please select (All)</option>
              {MOCK_COMMUNITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">Sub-caste</label>
            <select
              value={filters.subCaste}
              onChange={(e) => updateFilters({ subCaste: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="All">Please select (All)</option>
              <option value="96 Kuli">96 Kuli</option>
              <option value="Deshastha">Deshastha</option>
              <option value="Koknastha">Koknastha</option>
              <option value="Kadva">Kadva</option>
              <option value="Levva">Levva</option>
              <option value="Srivastava">Srivastava</option>
            </select>
          </div>
        </div>

        {/* 4. Mother Tongue (matching reference image) */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <label className="block text-xs font-bold text-gray-800 mb-1.5">Mother tongue</label>
          <select
            value={filters.motherTongue}
            onChange={(e) => updateFilters({ motherTongue: e.target.value })}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          >
            <option value="All">Please select (All Languages)</option>
            <option value="Hindi">Hindi</option>
            <option value="Marathi">Marathi</option>
            <option value="Gujarati">Gujarati</option>
            <option value="Tamil">Tamil</option>
            <option value="Telugu">Telugu</option>
            <option value="Bengali">Bengali</option>
            <option value="Punjabi">Punjabi</option>
          </select>
        </div>

        {/* 5. Income Range Slider (matching reference image) */}
        <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-gray-800">Minimum Annual Income</label>
            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-md">
              ₹{filters.minIncomeLpa} Lakhs+ P.A.
            </span>
          </div>

          <div className="pt-2 px-1">
            <input
              type="range"
              min={3}
              max={40}
              step={1}
              value={filters.minIncomeLpa}
              onChange={(e) => updateFilters({ minIncomeLpa: Number(e.target.value) })}
              className="w-full accent-orange-600 cursor-pointer h-2 bg-orange-100 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>₹3 LPA</span>
              <span>₹10 LPA</span>
              <span>₹20 LPA</span>
              <span>₹30 LPA</span>
              <span>₹40+ LPA</span>
            </div>
          </div>
        </div>

        {/* 6. City & State (matching reference image) */}
        <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">City</label>
            <select
              value={filters.city}
              onChange={(e) => updateFilters({ city: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="All">All Cities</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Surat">Surat</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Delhi">Delhi NCR</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">State</label>
            <select
              value={filters.state}
              onChange={(e) => updateFilters({ state: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="All">All States</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Telangana">Telangana</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Floating Bottom Button - Apply Filters */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg z-30">
        <button
          onClick={handleApply}
          className="w-full py-3.5 rounded-full bg-saffron-gradient text-white font-semibold text-sm shadow-saffron hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>Apply Filters ({filteredProfiles.length} Profiles Found)</span>
        </button>
      </div>
    </div>
  );
};

export default FilterScreen;
