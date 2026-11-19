import React, { useState } from "react";
import { useMobileApp } from "../../../context/MobileAppContext";
import { SathiyaLogo } from "../SathiyaLogo";
import { ChevronRight, Globe, Download, Sparkles, Heart } from "lucide-react";
import { MOCK_LANGUAGES } from "../../../data/mockData";

export const WelcomeScreen: React.FC = () => {
  const { setCurrentScreen, selectedLanguage, setSelectedLanguage, installPwa } = useMobileApp();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const currentLangObj = MOCK_LANGUAGES.find((l) => l.code === selectedLanguage) || MOCK_LANGUAGES[0];

  return (
    <div className="relative w-full h-full min-h-[700px] flex flex-col justify-between overflow-hidden bg-black select-none">
      {/* Background Wedding Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1080&q=85')`
        }}
      >
        {/* Saffron & Dark Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/40 via-transparent to-amber-950/60" />
      </div>

      {/* Top Header with Circular Logo Badge on Top Right */}
      <div className="relative z-10 pt-10 px-6 flex justify-between items-start">
        <button 
          onClick={installPwa}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-medium hover:bg-orange-600/60 transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-amber-300" />
          <span>Install App</span>
        </button>

        {/* Circular Logo Badge */}
        <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-xl flex items-center justify-center border border-white/40">
          <SathiyaLogo size={36} />
        </div>
      </div>

      {/* Center Branding & Catchy Text */}
      <div className="relative z-10 px-6 pb-8 flex flex-col items-center text-center">
        {/* Script Cursive Brand Name */}
        <div className="inline-flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          <h1 className="font-cursive text-5xl md:text-6xl text-white font-medium drop-shadow-[0_4px_12px_rgba(255,119,0,0.5)]">
            Sathiya
          </h1>
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
        </div>

        <p className="text-amber-200/90 text-xs tracking-widest uppercase font-semibold mb-3">
          Sacred Bonds & Matrimony
        </p>

        <h2 className="text-white text-3xl font-bold tracking-tight leading-snug drop-shadow-md mb-8 max-w-xs">
          Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">Perfect match</span> Today
        </h2>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3.5 max-w-xs">
          {/* Sign In - Saffron Filled Button */}
          <button
            onClick={() => setCurrentScreen("signin")}
            className="w-full py-4 rounded-full bg-saffron-gradient text-white font-semibold text-base shadow-saffron hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Register - Clean White Button */}
          <button
            onClick={() => setCurrentScreen("register")}
            className="w-full py-4 rounded-full bg-white/95 hover:bg-white text-gray-800 font-semibold text-base shadow-lg border border-white active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Register Free</span>
            <Heart className="w-4 h-4 text-orange-500 fill-orange-500" />
          </button>

          {/* Explore As Guest / Directly View Profiles */}
          <button
            onClick={() => setCurrentScreen("feed")}
            className="text-xs text-white/80 hover:text-white underline underline-offset-4 py-1 font-medium transition-colors"
          >
            Explore Profiles without Sign In →
          </button>
        </div>

        {/* Language Selector Pill */}
        <div className="mt-6">
          <button
            onClick={() => setShowLanguageModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/90 text-xs font-medium hover:bg-black/60 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span>Select Language?</span>
            <span className="font-semibold text-amber-300 underline underline-offset-2">
              {currentLangObj.name}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-white/60" />
          </button>
        </div>
      </div>

      {/* Language Picker Bottom Modal */}
      {showLanguageModal && (
        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-6 text-gray-900 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[80%] overflow-y-auto">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-900">Select Your Language</h3>
              <button
                onClick={() => setShowLanguageModal(false)}
                className="text-xs text-orange-600 font-bold px-2 py-1"
              >
                Done
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {MOCK_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLanguage(lang.code);
                    setShowLanguageModal(false);
                  }}
                  className={`p-3 rounded-xl border text-left flex flex-col transition-all ${
                    selectedLanguage === lang.code
                      ? "border-orange-500 bg-orange-50 ring-2 ring-orange-500/20"
                      : "border-gray-200 hover:border-orange-200 bg-white"
                  }`}
                >
                  <span className="font-bold text-sm text-gray-800">{lang.name}</span>
                  <span className="text-xs text-gray-500">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;
