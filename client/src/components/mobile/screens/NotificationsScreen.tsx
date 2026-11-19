import React, { useState } from "react";
import { useMobileApp } from "../../../context/MobileAppContext";
import { ChevronLeft, Bell, Heart, Sparkles, Eye, CheckCheck } from "lucide-react";

export const NotificationsScreen: React.FC = () => {
  const { notifications, markNotificationRead, setCurrentScreen, setSelectedProfile } = useMobileApp();
  const [filterType, setFilterType] = useState<"all" | "interest" | "horoscope" | "view">("all");

  const filtered = notifications.filter((n) => {
    if (filterType === "all") return true;
    return n.type === filterType;
  });

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

        <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-orange-600" />
          <span>Notifications</span>
        </h2>

        <button
          onClick={() => notifications.forEach((n) => markNotificationRead(n.id))}
          className="text-xs text-orange-600 font-semibold"
        >
          Mark all read
        </button>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: "All Activity" },
            { id: "interest", label: "Interests 🎉" },
            { id: "horoscope", label: "Kundli Match 🌟" },
            { id: "view", label: "Profile Views 👀" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === cat.id
                  ? "bg-saffron-gradient text-white shadow-saffron-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                item.read
                  ? "bg-white border-gray-100 shadow-2xs"
                  : "bg-orange-50/50 border-orange-200 shadow-xs"
              }`}
            >
              {/* Avatar / Icon */}
              <div className="relative shrink-0">
                <img
                  src={item.avatar}
                  alt="avatar"
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-orange-400"
                />
                {!item.read && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-orange-600 rounded-full border-2 border-white" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-900 leading-snug">{item.title}</h4>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.body}</p>
                <span className="text-[10px] text-gray-400 mt-1 block">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsScreen;
