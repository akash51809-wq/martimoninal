import React, { useState } from "react";
import { useMobileApp } from "../../../context/MobileAppContext";
import { ChevronLeft, Heart, Sparkles, BookOpen, Music, Compass, Camera, Palette, Utensils, Send } from "lucide-react";

export const HobbiesInterestsScreen: React.FC = () => {
  const { selectedProfile, setCurrentScreen, toggleLike, isLiked } = useMobileApp();
  const [segment, setSegment] = useState<"my" | "other">("my");
  const [sentInterest, setSentInterest] = useState(false);

  const profile = selectedProfile;
  const liked = isLiked(profile.id);

  const interestCards = [
    {
      title: "Reading & Literature",
      desc: "Loves historical fiction, Sanskrit scriptures, and leadership memoirs.",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      tag: "Intellectual",
      icon: BookOpen
    },
    {
      title: "Yoga & Sunrise Meditation",
      desc: "Daily morning Surya Namaskar and holistic Ayurvedic living.",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
      tag: "Wellness",
      icon: Sparkles
    },
    {
      title: "Heritage Travel & Roads",
      desc: "Exploring ancient temples, forts of Maharashtra, and serene hill stations.",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
      tag: "Outdoors",
      icon: Compass
    },
    {
      title: "Classical Bharatnatyam",
      desc: "Practicing Indian classical dance for grace, rhythm, and devotion.",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
      tag: "Arts & Culture",
      icon: Music
    }
  ];

  return (
    <div className="relative w-full h-full min-h-[700px] flex flex-col bg-[#FFFDF9] overflow-y-auto no-scrollbar select-none">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-gray-100 shadow-xs">
        <button
          onClick={() => setCurrentScreen("profile-detail")}
          className="flex items-center gap-1 text-gray-700 hover:text-orange-600 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4 text-orange-600" />
          <span>Hobbies & Interests</span>
        </button>

        <span className="text-xs text-orange-600 font-semibold">{profile.profileId}</span>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {/* Segmented Control Switcher (matching reference image) */}
        <div className="bg-gray-100 p-1 rounded-2xl flex items-center max-w-xs mx-auto border border-gray-200">
          <button
            onClick={() => setSegment("my")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              segment === "my"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            My Interest
          </button>
          <button
            onClick={() => setSegment("other")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              segment === "other"
                ? "bg-saffron-gradient text-white shadow-saffron-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Other
          </button>
        </div>

        {/* User Mini Profile Header */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-orange-100 shadow-xs">
          <img
            src={profile.photos[0]}
            alt={profile.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-orange-500 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-gray-900 truncate">{profile.name}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <span>📍</span>
              <span>{profile.city}, {profile.state}</span>
            </p>
          </div>

          <button
            onClick={() => toggleLike(profile.id)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              liked ? "bg-rose-50 text-rose-600" : "bg-gray-100 text-gray-400"
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>
        </div>

        {/* Gallery / Interest Cards */}
        <div className="space-y-4">
          {interestCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-card-elevated hover:border-orange-200 transition-all"
              >
                {/* Visual Image */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-900">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover object-center filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Top Tag Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-amber-200 border border-white/20 text-[10px] font-bold">
                      {card.tag}
                    </span>
                  </div>

                  {/* Bottom Text Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Icon className="w-4 h-4 text-orange-400" />
                      <h4 className="font-bold text-base">{card.title}</h4>
                    </div>
                    <p className="text-xs text-gray-200 leading-snug">{card.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Send Direct Interest with Personalized Note */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200 text-center space-y-3">
          <p className="text-xs font-bold text-amber-950">
            Love {profile.name}'s hobbies and lifestyle?
          </p>
          <button
            onClick={() => {
              setSentInterest(true);
              alert(`Interest with personal invitation sent to ${profile.name}!`);
            }}
            disabled={sentInterest}
            className="w-full py-3 rounded-full bg-saffron-gradient text-white text-xs font-semibold shadow-saffron flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-60"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{sentInterest ? "Interest Sent Successfully ✓" : "Send Express Interest with Note"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HobbiesInterestsScreen;
