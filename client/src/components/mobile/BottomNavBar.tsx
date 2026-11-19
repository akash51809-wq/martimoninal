import React from "react";
import { useMobileApp, ScreenType } from "../../context/MobileAppContext";
import { Compass, Heart, MessageCircle, Sparkles, User, Flame } from "lucide-react";

export const BottomNavBar: React.FC = () => {
  const { currentScreen, setCurrentScreen, likedProfileIds, chats } = useMobileApp();

  // Hide bottom nav on welcome, signin, register screens
  if (currentScreen === "welcome" || currentScreen === "signin" || currentScreen === "register") {
    return null;
  }

  const unreadChats = chats.reduce((acc, curr) => acc + (curr.unread || 0), 0);

  const navItems: { id: ScreenType; label: string; icon: any; badge?: number }[] = [
    { id: "feed", label: "Matches", icon: Compass },
    { id: "liked", label: "Liked", icon: Heart, badge: likedProfileIds.length },
    { id: "chat", label: "Chat", icon: MessageCircle, badge: unreadChats },
    { id: "kundli", label: "Kundli", icon: Sparkles },
    { id: "my-profile", label: "Profile", icon: User }
  ];

  return (
    <div className="absolute bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-3 py-2 shadow-lg select-none">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? "text-orange-600 font-bold scale-105"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px] text-orange-600" : ""}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 bg-saffron-gradient text-white rounded-full text-[9px] font-bold shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? "text-orange-600 font-bold" : "text-gray-500 font-medium"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavBar;
