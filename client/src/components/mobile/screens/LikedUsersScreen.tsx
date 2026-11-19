import React, { useState } from "react";
import { useMobileApp } from "../../../context/MobileAppContext";
import { ChevronLeft, Search, Heart, MessageCircle, MapPin, Trash2, ArrowRight } from "lucide-react";
import { MOCK_PROFILES } from "../../../data/mockData";

export const LikedUsersScreen: React.FC = () => {
  const { 
    likedProfileIds, 
    toggleLike, 
    setCurrentScreen, 
    setSelectedProfile, 
    toggleBlock,
    blockedProfileIds,
    setActiveChatProfileId 
  } = useMobileApp();

  const [searchQuery, setSearchQuery] = useState("");

  const likedProfiles = MOCK_PROFILES.filter((p) => 
    likedProfileIds.includes(p.id) && !blockedProfileIds.includes(p.id)
  ).filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.profession.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenProfile = (profile: any) => {
    setSelectedProfile(profile);
    setCurrentScreen("profile-detail");
  };

  const handleStartChat = (profile: any) => {
    setSelectedProfile(profile);
    setActiveChatProfileId(profile.id);
    setCurrentScreen("chat");
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
          <span>Back</span>
        </button>

        <h2 className="text-base font-bold text-gray-900 tracking-tight">Liked Users</h2>

        <div className="w-7 h-7 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
          <Search className="w-4 h-4" />
        </div>
      </div>

      {/* Search Input Filter */}
      <div className="p-4 pb-2">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, city or career..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Subtitle Header */}
      <div className="px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-bold text-gray-800">
          Liked Users List ({likedProfiles.length})
        </span>
        <span className="text-[11px] text-orange-600 font-medium">
          Shortlisted Matches
        </span>
      </div>

      {/* Liked Users List (matching reference image card style) */}
      <div className="p-4 pt-1 space-y-3 pb-24">
        {likedProfiles.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200 mt-4 shadow-xs">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm">No Liked Users Yet</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Explore prospective profiles and tap the heart icon to save them here!
            </p>
            <button
              onClick={() => setCurrentScreen("feed")}
              className="px-4 py-2 bg-saffron-gradient text-white rounded-full text-xs font-semibold shadow-saffron-sm"
            >
              Explore Matches
            </button>
          </div>
        ) : (
          likedProfiles.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs hover:border-orange-200 transition-all flex items-center justify-between gap-3 group"
            >
              {/* Thumbnail with Overlaid Location Badge */}
              <div 
                onClick={() => handleOpenProfile(p)}
                className="relative w-18 h-18 rounded-xl overflow-hidden shrink-0 cursor-pointer bg-gray-100"
              >
                <img
                  src={p.photos[0]}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Location Overlay Pill at Bottom of Photo */}
                <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs py-0.5 text-center">
                  <span className="text-[9px] font-semibold text-white truncate px-1 block">
                    {p.city}
                  </span>
                </div>
              </div>

              {/* Center Info: Name, ID, Age, Height, Block link */}
              <div className="flex-1 min-w-0" onClick={() => handleOpenProfile(p)}>
                <div className="flex items-center gap-1.5 cursor-pointer">
                  <h4 className="text-sm font-bold text-gray-900 truncate">{p.name}</h4>
                  <span className="text-[11px] font-mono font-medium text-orange-600 shrink-0">
                    {p.profileId}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  Age {p.age} yr, {p.height}
                </p>

                <p className="text-[11px] text-gray-600 truncate mt-0.5">
                  {p.profession}
                </p>

                <div className="flex items-center gap-3 mt-1.5">
                  {/* Block text link matching reference image */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBlock(p.id);
                    }}
                    className="text-[10px] text-gray-400 hover:text-red-600 underline font-medium"
                  >
                    Block
                  </button>

                  <span className="text-gray-300 text-xs">•</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenProfile(p);
                    }}
                    className="text-[10px] text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    View Biodata →
                  </button>
                </div>
              </div>

              {/* Right Action Icons: Quick Chat & Heart Toggle */}
              <div className="flex flex-col items-center gap-2 shrink-0 pl-1">
                {/* Heart Toggle */}
                <button
                  onClick={() => toggleLike(p.id)}
                  className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-colors"
                  title="Remove from Liked"
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </button>

                {/* Quick Chat */}
                <button
                  onClick={() => handleStartChat(p)}
                  className="w-8 h-8 rounded-full bg-orange-50 hover:bg-orange-100 flex items-center justify-center text-orange-600 transition-colors"
                  title="Message Match"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LikedUsersScreen;
