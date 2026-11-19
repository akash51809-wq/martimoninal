import React from "react";
import { Home, Search, Heart, Crown, User } from "lucide-react";

export type MobileTabId = "home" | "matches" | "liked" | "plans" | "account";

interface MobileBottomNavProps {
  activeTab: MobileTabId;
  likedCount: number;
  onSelectTab: (tab: MobileTabId) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  likedCount,
  onSelectTab,
}) => {
  const tabs: {
    id: MobileTabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "matches", label: "Matches", icon: Search },
    { id: "liked", label: "Liked", icon: Heart, badge: likedCount },
    { id: "plans", label: "Plans", icon: Crown },
    { id: "account", label: "Profile", icon: User },
  ];

  return (
    <nav
      aria-label="Mobile app navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#FFFDF9]/98 border-t border-amber-200/90 shadow-[0_-8px_30px_rgba(120,53,15,0.12)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 items-center h-[64px] px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-1 h-full transition-colors active:scale-95 ${
                isActive ? "text-[#EA580C]" : "text-[#6E564E]"
              }`}
            >
              {/* Top active indicator pill */}
              {isActive && (
                <span className="absolute top-0 w-8 h-[3px] rounded-b-full bg-saffron-gradient" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${
                    isActive && tab.id === "liked" ? "fill-current" : ""
                  }`}
                />
                {typeof tab.badge === "number" && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-saffron-gradient text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] leading-none ${
                  isActive ? "font-bold" : "font-medium"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
