import React, { useState } from "react";
import { useMobileApp } from "../../../context/MobileAppContext";
import { 
  ChevronLeft, 
  Crown, 
  Download, 
  Globe, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Settings, 
  Edit3, 
  Heart, 
  Sparkles, 
  FileText,
  LogOut
} from "lucide-react";
import { MOCK_LANGUAGES } from "../../../data/mockData";

export const MyProfileScreen: React.FC = () => {
  const { user, setCurrentScreen, installPwa, selectedLanguage, setSelectedLanguage } = useMobileApp();
  const [photoPrivacy, setPhotoPrivacy] = useState<"visible" | "requested">("visible");
  const [contactPrivacy, setContactPrivacy] = useState<"visible" | "accepted">("accepted");
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const currentLangObj = MOCK_LANGUAGES.find((l) => l.code === selectedLanguage) || MOCK_LANGUAGES[0];

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

        <h2 className="text-base font-bold text-gray-900 tracking-tight">My Profile & Settings</h2>

        <button
          onClick={() => setCurrentScreen("premium")}
          className="w-7 h-7 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center"
        >
          <Crown className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 pb-28">
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-card-elevated text-center relative overflow-hidden">
          <div className="relative inline-block mx-auto mb-3">
            <img
              src={user.photo}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-orange-500 shadow-md"
            />
            <button 
              onClick={() => alert("Upload photo feature: select image from gallery")}
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-orange-600 text-white shadow-md hover:scale-105 transition-transform"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <h3 className="font-bold text-lg text-gray-900 flex items-center justify-center gap-1.5">
            <span>{user.name}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </h3>
          <p className="text-xs text-orange-600 font-mono font-semibold">{user.profileId}</p>
          <p className="text-xs text-gray-500 mt-0.5">Software Architect • Mumbai, Maharashtra</p>

          {/* Profile Completion Meter */}
          <div className="mt-4 p-3 bg-orange-50/80 rounded-2xl border border-orange-100 text-left">
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-gray-800">Profile Strength</span>
              <span className="text-orange-600">85% Complete</span>
            </div>
            <div className="w-full bg-orange-200 h-2 rounded-full overflow-hidden">
              <div className="bg-saffron-gradient h-full w-[85%] rounded-full" />
            </div>
            <p className="text-[10px] text-gray-500 mt-1.5">
              💡 Add your Kundli birth time to reach 100% and gain 3X visibility!
            </p>
          </div>
        </div>

        {/* Install Mobile App PWA Banner (Highlighting the "ready to install" requirement) */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-4 text-white shadow-saffron flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Download className="w-4 h-4 text-amber-200" />
              <h4 className="font-bold text-xs">Install Sathiya App</h4>
            </div>
            <p className="text-[11px] text-amber-100">
              Install directly to phone home screen (No app store needed)
            </p>
          </div>
          <button
            onClick={installPwa}
            className="px-3.5 py-1.5 bg-white text-orange-700 rounded-full text-xs font-bold shadow-md hover:bg-amber-50 active:scale-95 transition-all shrink-0"
          >
            Install Now
          </button>
        </div>

        {/* Privacy Controls Card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Privacy & Security
          </h4>

          {/* Photo Privacy Toggle */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-xs font-semibold text-gray-800">Photo Visibility</p>
              <p className="text-[10px] text-gray-500">
                {photoPrivacy === "visible" ? "Visible to all members" : "Visible only to accepted interests"}
              </p>
            </div>
            <button
              onClick={() => setPhotoPrivacy(photoPrivacy === "visible" ? "requested" : "visible")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                photoPrivacy === "visible"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              {photoPrivacy === "visible" ? "Public" : "Protected"}
            </button>
          </div>

          {/* Contact Privacy Toggle */}
          <div className="flex items-center justify-between py-1 border-t border-gray-50 pt-2">
            <div>
              <p className="text-xs font-semibold text-gray-800">Phone Number Privacy</p>
              <p className="text-[10px] text-gray-500">
                {contactPrivacy === "accepted" ? "Only members I approve" : "Visible to VIP verified"}
              </p>
            </div>
            <button
              onClick={() => setContactPrivacy(contactPrivacy === "accepted" ? "visible" : "accepted")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                contactPrivacy === "accepted"
                  ? "bg-orange-50 text-orange-700 border border-orange-200"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {contactPrivacy === "accepted" ? "On Request" : "Direct"}
            </button>
          </div>
        </div>

        {/* App Settings & Language */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Preferences & Language
          </h4>

          {/* Language Selector */}
          <div 
            onClick={() => setShowLanguageModal(true)}
            className="flex items-center justify-between py-1 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-semibold text-gray-800">App Language</span>
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
              {currentLangObj.name}
            </span>
          </div>

          {/* Partner Preferences Shortcut */}
          <div 
            onClick={() => setCurrentScreen("filter")}
            className="flex items-center justify-between py-1 cursor-pointer border-t border-gray-50 pt-2"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-gray-800">Edit Partner Expectations</span>
            </div>
            <span className="text-xs text-gray-400">→</span>
          </div>
        </div>

        {/* Log Out Button */}
        <div className="pt-2 text-center">
          <button
            onClick={() => setCurrentScreen("welcome")}
            className="w-full py-3 rounded-full border border-gray-300 text-gray-600 text-xs font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
            <span>Sign Out of Sathiya</span>
          </button>
        </div>
      </div>

      {/* Language Picker Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-6 text-gray-900 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-900">Choose Language</h3>
              <button
                onClick={() => setShowLanguageModal(false)}
                className="text-xs text-orange-600 font-bold"
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

export default MyProfileScreen;
