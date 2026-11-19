import React, { useState } from "react";
import { useMobileApp } from "../../../context/MobileAppContext";
import { 
  ChevronLeft, 
  Heart, 
  Phone, 
  MessageCircle, 
  Play, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  ShieldCheck, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Home, 
  Moon, 
  Utensils, 
  Target,
  Share2
} from "lucide-react";

export const DetailedProfileScreen: React.FC = () => {
  const { 
    selectedProfile, 
    setCurrentScreen, 
    toggleLike, 
    isLiked, 
    toggleBlock, 
    blockedProfileIds,
    setActiveChatProfileId
  } = useMobileApp();

  const [activeTab, setActiveTab] = useState<"basic" | "education" | "family" | "horoscope" | "lifestyle" | "partner">("basic");
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const profile = selectedProfile;
  const liked = isLiked(profile.id);
  const isBlocked = blockedProfileIds.includes(profile.id);

  const handleStartChat = () => {
    setActiveChatProfileId(profile.id);
    setCurrentScreen("chat");
  };

  return (
    <div className="relative w-full h-full min-h-[700px] flex flex-col bg-[#FFFDF9] overflow-y-auto no-scrollbar select-none">
      {/* Top Sticky Header (matching reference image) */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-100 shadow-xs">
        {/* Back Button */}
        <button
          onClick={() => setCurrentScreen("feed")}
          className="flex items-center gap-1 text-gray-700 hover:text-orange-600 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4 text-orange-600" />
          <span>Back</span>
        </button>

        {/* Candidate Mini Profile in Header */}
        <div className="flex items-center gap-2 max-w-[200px]">
          <img
            src={profile.photos[0]}
            alt={profile.name}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-orange-500 shrink-0"
          />
          <div className="truncate text-left">
            <h4 className="text-xs font-bold text-gray-900 truncate leading-tight">{profile.name}</h4>
            <p className="text-[10px] text-gray-500 truncate">{profile.city}, India</p>
          </div>
        </div>

        {/* Block Button */}
        <button
          onClick={() => {
            toggleBlock(profile.id);
            alert(`${profile.name} has been ${isBlocked ? "unblocked" : "blocked"}.`);
          }}
          className="px-3 py-1 rounded-full bg-gray-900 text-white text-[11px] font-semibold hover:bg-red-600 transition-colors shadow-xs"
        >
          {isBlocked ? "Unblock" : "Block"}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4 pb-20">
        {/* Top Media Reel / Video Card (matching reference image) */}
        <div className="relative w-full h-72 rounded-3xl overflow-hidden shadow-card-elevated bg-gray-900">
          <img
            src={profile.photos[activePhotoIdx]}
            alt={profile.name}
            className="w-full h-full object-cover object-center filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Top Overlays: Expand & Mute Buttons */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-20">
            <button className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-gray-300" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
            </button>
          </div>

          {/* Center Play Button Overlay */}
          <button
            onClick={() => setIsPlayingVideo(!isPlayingVideo)}
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/30 backdrop-blur-md border border-white/60 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg z-20"
          >
            <Play className="w-6 h-6 fill-white text-white ml-0.5" />
          </button>

          {/* Bottom Photo Dots */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
            {profile.photos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIdx(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activePhotoIdx === idx ? "w-6 bg-orange-500" : "bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Action Pills Row (Like, Call, Chat - matching reference image) */}
        <div className="grid grid-cols-3 gap-3 bg-white p-3 rounded-2xl shadow-xs border border-orange-100">
          {/* 1. Like Pill */}
          <button
            onClick={() => toggleLike(profile.id)}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
              liked ? "bg-orange-50 text-orange-600 font-bold" : "hover:bg-gray-50 text-gray-600"
            }`}
          >
            <Heart className={`w-5 h-5 mb-1 ${liked ? "fill-orange-600 text-orange-600" : "text-gray-500"}`} />
            <span className="text-[11px] font-medium">{liked ? "Liked" : "Like"}</span>
          </button>

          {/* 2. Call Pill */}
          <button
            onClick={() => alert(`Connecting call to ${profile.name}'s verified contact. Number: ${profile.mobile}`)}
            className="flex flex-col items-center justify-center py-2 px-3 rounded-xl hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 transition-all"
          >
            <Phone className="w-5 h-5 mb-1 text-emerald-600" />
            <span className="text-[11px] font-medium">Call</span>
          </button>

          {/* 3. Chat Pill */}
          <button
            onClick={handleStartChat}
            className="flex flex-col items-center justify-center py-2 px-3 rounded-xl hover:bg-sky-50 text-gray-600 hover:text-sky-600 transition-all"
          >
            <MessageCircle className="w-5 h-5 mb-1 text-sky-600" />
            <span className="text-[11px] font-medium">Chat</span>
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "basic", label: "Basic Details" },
            { id: "education", label: "Career & Education" },
            { id: "family", label: "Family" },
            { id: "horoscope", label: "Kundli Milan" },
            { id: "lifestyle", label: "Lifestyle" },
            { id: "partner", label: "Partner Choice" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-saffron-gradient text-white shadow-saffron-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. Basic Details Card (matching reference image table layout) */}
        {activeTab === "basic" && (
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-orange-100 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Basic Details</h3>
              <span className="text-xs text-orange-600 font-semibold">{profile.profileId}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">Full Name</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.name}</span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">Email</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800 truncate">{profile.email}</span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">Mobile Number</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-emerald-700">{profile.mobile}</span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">Gender</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.gender}</span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">DOB / Age</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.dob} ({profile.age} yrs)</span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">Height</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.height}</span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">City</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.city}</span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">State</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.state}</span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">Marital status</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.maritalStatus}</span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">Religion / Caste</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.religion} - {profile.caste} ({profile.subCaste})</span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">Mother Tongue</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.motherTongue}</span>
              </div>
            </div>

            {/* About Me snippet */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <h4 className="font-bold text-gray-800 text-xs mb-1.5">About Her</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{profile.bio}</p>
            </div>
          </div>
        )}

        {/* 2. Education & Career Tab */}
        {activeTab === "education" && (
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-orange-100 space-y-3.5 animate-in fade-in duration-200">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-orange-600" />
              <span>Education & Career</span>
            </h3>

            <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Annual Income</p>
                <p className="text-sm font-bold text-orange-700">{profile.income}</p>
              </div>
              <Briefcase className="w-6 h-6 text-orange-400" />
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <p className="text-gray-500 font-medium">Highest Qualification</p>
                <p className="font-semibold text-gray-800 mt-0.5">{profile.education}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">College / University</p>
                <p className="font-semibold text-gray-800 mt-0.5">{profile.college}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Occupation / Profession</p>
                <p className="font-semibold text-gray-800 mt-0.5">{profile.profession}</p>
              </div>
              {profile.company && (
                <div>
                  <p className="text-gray-500 font-medium">Employed At</p>
                  <p className="font-semibold text-gray-800 mt-0.5">{profile.company}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Family Tab */}
        {activeTab === "family" && (
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-orange-100 space-y-3.5 animate-in fade-in duration-200">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-600" />
              <span>Family Background</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">Father's Name & Occ</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.family.father} ({profile.family.fatherOccupation})</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">Mother's Name & Occ</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.family.mother} ({profile.family.motherOccupation})</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">Siblings</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.family.siblings}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">Family Type</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.family.familyType}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">Family Values</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.family.familyValues}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">Native Place</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.family.nativePlace}</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. Horoscope & Kundli Milan Tab */}
        {activeTab === "horoscope" && (
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-orange-100 space-y-4 animate-in fade-in duration-200">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Vedic Kundli Milan</span>
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                {profile.kundliScore} / 36 Gunas
              </span>
            </div>

            <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 text-center">
              <p className="text-xs text-amber-900 font-medium">Compatibility Assessment</p>
              <p className="text-base font-bold text-orange-600 mt-0.5">Uttam (Highly Auspicious Match)</p>
              <p className="text-[11px] text-gray-600 mt-1">
                Excellent alignment for health, family bliss, and intellectual resonance.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-gray-50 rounded-lg">
                <span className="text-gray-500 block text-[10px]">Rashi (Moon Sign)</span>
                <span className="font-bold text-gray-800">{profile.rashi}</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-lg">
                <span className="text-gray-500 block text-[10px]">Nakshatra</span>
                <span className="font-bold text-gray-800">{profile.nakshatra}</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-lg">
                <span className="text-gray-500 block text-[10px]">Manglik Status</span>
                <span className="font-bold text-emerald-700">{profile.manglik}</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-lg">
                <span className="text-gray-500 block text-[10px]">Gotra</span>
                <span className="font-bold text-gray-800">{profile.gotra}</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen("kundli")}
              className="w-full py-2.5 rounded-xl border border-orange-500 text-orange-600 font-semibold text-xs hover:bg-orange-50 transition-colors"
            >
              View Full 36 Guna Milan Report →
            </button>
          </div>
        )}

        {/* 5. Lifestyle Tab */}
        {activeTab === "lifestyle" && (
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-orange-100 space-y-3.5 animate-in fade-in duration-200">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Utensils className="w-4 h-4 text-orange-600" />
              <span>Lifestyle & Habits</span>
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                <span className="text-gray-500 block text-[10px]">Diet</span>
                <span className="font-bold text-gray-800 mt-1 block">{profile.lifestyle.diet}</span>
              </div>
              <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                <span className="text-gray-500 block text-[10px]">Drinking</span>
                <span className="font-bold text-gray-800 mt-1 block">{profile.lifestyle.drink}</span>
              </div>
              <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                <span className="text-gray-500 block text-[10px]">Smoking</span>
                <span className="font-bold text-gray-800 mt-1 block">{profile.lifestyle.smoke}</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-semibold mb-2">Interests & Hobbies</p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium"
                  >
                    {interest.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. Partner Preferences Tab */}
        {activeTab === "partner" && (
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-orange-100 space-y-3.5 animate-in fade-in duration-200">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-600" />
              <span>What She Is Looking For</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">Desired Age</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.partnerPreferences.ageRange}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">Desired Height</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.partnerPreferences.heightRange}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">Education</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.partnerPreferences.education}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">Expected Income</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.partnerPreferences.income}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-5 text-gray-500 font-medium">Preferred Cities</span>
                <span className="col-span-1 text-gray-400">:</span>
                <span className="col-span-6 font-semibold text-gray-800">{profile.partnerPreferences.preferredCities.join(", ")}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Connect Floating Buttons */}
        <div className="pt-2 flex gap-3">
          <button
            onClick={() => toggleLike(profile.id)}
            className={`flex-1 py-3.5 rounded-full font-semibold text-sm transition-all shadow-saffron flex items-center justify-center gap-2 ${
              liked
                ? "bg-rose-500 text-white"
                : "bg-saffron-gradient text-white hover:opacity-95"
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-white" : ""}`} />
            <span>{liked ? "Shortlisted in Likes" : "Express Interest / Like"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailedProfileScreen;
