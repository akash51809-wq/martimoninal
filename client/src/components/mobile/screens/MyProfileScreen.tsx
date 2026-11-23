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
  LogOut,
  User,
  LogIn
} from "lucide-react";
import { MOCK_LANGUAGES } from "../../../data/mockData";

export const MyProfileScreen: React.FC = () => {
  const { user, logout, setCurrentScreen, installPwa, selectedLanguage, setSelectedLanguage } = useMobileApp();
  const [photoPrivacy, setPhotoPrivacy] = useState<"visible" | "requested">("visible");
  const [contactPrivacy, setContactPrivacy] = useState<"visible" | "accepted">("accepted");
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const currentLangObj = MOCK_LANGUAGES.find((l) => l.code === selectedLanguage) || MOCK_LANGUAGES[0];

  // If user is not logged in, show an authenticated sign-in prompt
  if (!user) {
    return (
      <div className="relative w-full h-full min-h-[700px] flex flex-col bg-[#FFFDF9] overflow-y-auto no-scrollbar select-none">
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-gray-100 shadow-xs">
          <button
            onClick={() => setCurrentScreen("feed")}
            className="flex items-center gap-1 text-gray-700 hover:text-orange-600 text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4 text-orange-600" />
            <span>Matches</span>
          </button>
          <h2 className="text-base font-bold text-gray-900 tracking-tight">Account &amp; Profile</h2>
          <div className="w-6" />
        </div>

        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-gray-900">Signed Out of Account</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Please sign in to view your verified biodata, manage privacy locks, and unlock contacts.
            </p>
          </div>

          <div className="w-full max-w-xs space-y-2.5 pt-2">
            <button
              onClick={() => setCurrentScreen("signin")}
              className="w-full py-3.5 rounded-full bg-saffron-gradient text-white font-semibold text-sm shadow-saffron hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Your Account</span>
            </button>
            <button
              onClick={() => setCurrentScreen("register")}
              className="w-full py-3 rounded-full bg-white border border-orange-200 text-orange-700 font-semibold text-xs hover:bg-orange-50 transition-colors"
            >
              Create New Matrimony Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        <h2 className="text-base font-bold text-gray-900 tracking-tight">My Profile &amp; Settings</h2>

        <button
          onClick={() => setCurrentScreen("premium")}
          className="w-7 h-7 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center"
          title="VIP Membership Plans"
        >
          <Crown className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 pb-28">
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-card-elevated text-center relative overflow-hidden">
          <div className="relative inline-block mx-auto mb-3">
            <img
              src={user.photo || "/2.jpg"}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-orange-500 shadow-md"
            />
            <button 
              onClick={() => alert("Upload photo: you can update your profile photo from the photo management section.")}
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
          <p className="text-xs text-gray-500 mt-0.5">{user.email} • {user.mobile}</p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>{user.planName || "Active Member"}</span>
          </div>

          {/* Profile Completion Meter */}
          <div className="mt-4 p-3 bg-orange-50/80 rounded-2xl border border-orange-100 text-left">
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-gray-800">Profile Verification</span>
              <span className="text-emerald-700">100% Live in Database</span>
            </div>
            <div className="w-full bg-orange-200 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full w-full" />
            </div>
          </div>
        </div>

        {/* Selective Privacy Controls */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
          <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            <span>Privacy &amp; Contact Visibility</span>
          </h4>

          {/* Photo Visibility Toggle */}
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div>
              <p className="text-xs font-semibold text-gray-800">Photo Visibility</p>
              <p className="text-[11px] text-gray-500">Choose who can view your photo album</p>
            </div>
            <button
              onClick={() => setPhotoPrivacy(photoPrivacy === "visible" ? "requested" : "visible")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                photoPrivacy === "visible"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-gray-100 border-gray-300 text-gray-600"
              }`}
            >
              {photoPrivacy === "visible" ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{photoPrivacy === "visible" ? "All Matches" : "Only on Request"}</span>
            </button>
          </div>

          {/* Contact Visibility Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-semibold text-gray-800">Contact / Phone Lock</p>
              <p className="text-[11px] text-gray-500">Require mutual interest before sharing phone</p>
            </div>
            <button
              onClick={() => setContactPrivacy(contactPrivacy === "accepted" ? "visible" : "accepted")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                contactPrivacy === "accepted"
                  ? "bg-orange-50 border-orange-300 text-orange-700"
                  : "bg-gray-100 border-gray-300 text-gray-600"
              }`}
            >
              <span>{contactPrivacy === "accepted" ? "Mutual Accepted" : "Visible to VIP"}</span>
            </button>
          </div>
        </div>

        {/* Quick Settings Action Strip */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-2.5">
          {/* VIP Upgrade */}
          <div 
            onClick={() => setCurrentScreen("premium")}
            className="flex items-center justify-between py-1 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-gray-800">Upgrade to VIP Gold</span>
            </div>
            <span className="text-xs text-orange-600 font-bold">Plans →</span>
          </div>

          {/* Language Selector */}
          <div 
            onClick={() => setShowLanguageModal(true)}
            className="flex items-center justify-between py-1 cursor-pointer border-t border-gray-50 pt-2"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
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

        {/* REAL SIGN OUT ACTION BUTTON */}
        <div className="pt-2 text-center">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to sign out of Vivah Kar Lo?")) {
                logout();
              }
            }}
            className="w-full py-3.5 rounded-full border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600 text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Sign Out of Vivah Kar Lo</span>
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
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedLanguage === lang.code
                      ? "bg-orange-50 border-orange-500 text-orange-700 font-bold"
                      : "border-gray-200 text-gray-700"
                  }`}
                >
                  <p className="text-sm">{lang.nativeName}</p>
                  <p className="text-[10px] text-gray-400">{lang.name}</p>
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
