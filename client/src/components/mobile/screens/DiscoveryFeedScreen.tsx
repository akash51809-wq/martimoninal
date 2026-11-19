import React, { useState } from "react";
import { useMobileApp } from "../../../context/MobileAppContext";
import { SathiyaLogo } from "../SathiyaLogo";
import { 
  Heart, 
  RotateCcw, 
  Phone, 
  MessageCircle, 
  Info, 
  Volume2, 
  VolumeX, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Search, 
  Bell, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ShieldCheck
} from "lucide-react";

export const DiscoveryFeedScreen: React.FC = () => {
  const { 
    filteredProfiles, 
    currentProfileIndex, 
    setCurrentProfileIndex, 
    setSelectedProfile, 
    setCurrentScreen,
    toggleLike,
    isLiked,
    user,
    notifications,
    setActiveChatProfileId
  } = useMobileApp();

  const [isMuted, setIsMuted] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const profile = filteredProfiles[currentProfileIndex] || filteredProfiles[0];

  if (!profile) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#FFFDF9]">
        <SathiyaLogo size={48} />
        <h3 className="font-bold text-lg text-gray-800 mt-4">No Profiles Matching Filters</h3>
        <p className="text-xs text-gray-500 mt-1 mb-6">Try broadening your age, caste, or location filters.</p>
        <button
          onClick={() => setCurrentScreen("filter")}
          className="px-5 py-2.5 rounded-full bg-saffron-gradient text-white text-xs font-semibold shadow-saffron"
        >
          Adjust Filters
        </button>
      </div>
    );
  }

  const handleNext = () => {
    setActivePhotoIdx(0);
    setCurrentProfileIndex((prev) => (prev + 1) % filteredProfiles.length);
  };

  const handlePrev = () => {
    setActivePhotoIdx(0);
    setCurrentProfileIndex((prev) => (prev - 1 + filteredProfiles.length) % filteredProfiles.length);
  };

  const handleViewDetail = () => {
    setSelectedProfile(profile);
    setCurrentScreen("profile-detail");
  };

  const handleStartChat = () => {
    setSelectedProfile(profile);
    setActiveChatProfileId(profile.id);
    setCurrentScreen("chat");
  };

  const liked = isLiked(profile.id);

  return (
    <div className="relative w-full h-full min-h-[700px] flex flex-col justify-between overflow-hidden bg-black select-none">
      {/* Top Navigation Bar (matching image) */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-9 px-4 pb-3 flex items-center justify-between bg-gradient-to-b from-black/70 via-black/30 to-transparent">
        {/* App Logo */}
        <button 
          onClick={() => setCurrentScreen("welcome")}
          className="flex items-center gap-1.5 focus:outline-none"
        >
          <div className="p-1 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-white/40">
            <SathiyaLogo size={26} />
          </div>
          <span className="font-serif-royal font-bold text-white text-lg tracking-wide drop-shadow-md">
            Sathiya
          </span>
        </button>

        {/* Right Header Icons: Search, Bell, Profile Avatar */}
        <div className="flex items-center gap-2.5">
          {/* Search / Filter */}
          <button
            onClick={() => setCurrentScreen("filter")}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-orange-600/60 transition-colors"
            title="Search & Filters"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <button
            onClick={() => setCurrentScreen("notifications")}
            className="relative w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-orange-600/60 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-orange-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-black">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={() => setCurrentScreen("my-profile")}
            className="w-8 h-8 rounded-full ring-2 ring-orange-500 overflow-hidden shadow-md"
            title="My Profile"
          >
            <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      {/* Main Full-Card Candidate Photo & Video Reel */}
      <div className="relative w-full h-full flex-1 overflow-hidden">
        {/* Profile Photos Carousel */}
        <img
          src={profile.photos[activePhotoIdx] || profile.photos[0]}
          alt={profile.name}
          className="w-full h-full object-cover object-center filter brightness-95 transition-opacity duration-300"
        />

        {/* Dark Vignette & Saffron Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent pointer-events-none" />

        {/* Top Floating Tags on Photo: Profession Pill & Sound Mute Toggle */}
        <div className="absolute top-20 left-4 right-4 z-20 flex justify-between items-center pointer-events-auto">
          {/* Profession Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-md">
            <Briefcase className="w-3.5 h-3.5 text-orange-400" />
            <span>{profile.professionTag}</span>
          </div>

          {/* Sound Mute / Unmute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-gray-300" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
          </button>
        </div>

        {/* Story Photo Progress Indicators on Top */}
        <div className="absolute top-18 left-4 right-4 z-20 flex gap-1">
          {profile.photos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActivePhotoIdx(idx)}
              className={`h-1 flex-1 rounded-full transition-all ${
                activePhotoIdx === idx ? "bg-orange-500" : "bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Left / Right Photo Tapping Zones */}
        <div 
          onClick={() => setActivePhotoIdx((prev) => Math.max(0, prev - 1))}
          className="absolute left-0 top-24 bottom-32 w-1/3 z-10 cursor-pointer"
        />
        <div 
          onClick={() => setActivePhotoIdx((prev) => Math.min(profile.photos.length - 1, prev + 1))}
          className="absolute right-0 top-24 bottom-32 w-1/3 z-10 cursor-pointer"
        />

        {/* Bottom Profile Details Overlay */}
        <div className="absolute bottom-24 left-4 right-4 z-20 text-white pointer-events-auto">
          {/* Name & Verified Badge */}
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold tracking-tight drop-shadow-md">
              {profile.name}
            </h2>
            <span className="text-xs text-orange-300 font-mono font-medium">
              {profile.profileId}
            </span>
            {profile.verified && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-500/80 backdrop-blur-sm text-[10px] font-semibold text-white">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified</span>
              </span>
            )}
          </div>

          {/* Subtitle: Age & Height */}
          <p className="text-sm text-gray-200 drop-shadow-sm font-medium">
            Age {profile.age} yr, {profile.height}
          </p>

          {/* Education & College */}
          <div className="flex items-center gap-1.5 text-xs text-gray-300 mt-1 drop-shadow-sm">
            <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{profile.education}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-gray-300 mt-0.5 drop-shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span>{profile.city}, {profile.state}</span>
          </div>

          {/* Kundli Match Pill */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-[11px] font-semibold text-amber-200">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Vedic Kundli Milan: {profile.kundliScore}/36 Gunas</span>
          </div>
        </div>

        {/* Next / Prev Candidate Side Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-colors"
          title="Previous Match"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-colors"
          title="Next Match"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Bottom Action Bar with 5 Circular Buttons (matching reference image) */}
      <div className="relative z-30 pb-5 pt-2 px-6 flex items-center justify-between bg-black/50 backdrop-blur-lg border-t border-white/10">
        {/* 1. Rewind / Undo */}
        <button
          onClick={handlePrev}
          className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 border border-white/20 flex items-center justify-center text-white transition-all shadow-md"
          title="Rewind / Pass"
        >
          <RotateCcw className="w-5 h-5 text-gray-200" />
        </button>

        {/* 2. Heart (Like / Shortlist) - Saffron Highlight */}
        <button
          onClick={() => toggleLike(profile.id)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-saffron active:scale-90 ${
            liked 
              ? "bg-saffron-gradient text-white ring-4 ring-orange-500/30 scale-105" 
              : "bg-white/20 hover:bg-white/30 text-white border border-white/30"
          }`}
          title="Like / Shortlist Profile"
        >
          <Heart className={`w-7 h-7 ${liked ? "fill-white text-white" : "text-white"}`} />
        </button>

        {/* 3. Call Button */}
        <button
          onClick={() => {
            alert(`Call Request initiated to ${profile.name}'s family at ${profile.mobile}. VIP members get instant connected calls!`);
          }}
          className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 border border-white/20 flex items-center justify-center text-white transition-all shadow-md"
          title="Call Candidate"
        >
          <Phone className="w-5 h-5 text-emerald-400" />
        </button>

        {/* 4. Chat Button */}
        <button
          onClick={handleStartChat}
          className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 border border-white/20 flex items-center justify-center text-white transition-all shadow-md"
          title="Chat Message"
        >
          <MessageCircle className="w-5 h-5 text-sky-400" />
        </button>

        {/* 5. Info / Full Details Button */}
        <button
          onClick={handleViewDetail}
          className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 border border-white/20 flex items-center justify-center text-white transition-all shadow-md"
          title="Detailed Profile"
        >
          <Info className="w-5 h-5 text-amber-300" />
        </button>
      </div>
    </div>
  );
};

export default DiscoveryFeedScreen;
