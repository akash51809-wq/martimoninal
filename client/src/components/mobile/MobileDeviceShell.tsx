import React, { useState, useEffect } from "react";
import { useMobileApp, ScreenType } from "../../context/MobileAppContext";
import { SathiyaLogo } from "./SathiyaLogo";
import { BottomNavBar } from "./BottomNavBar";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { SignInScreen } from "./screens/SignInScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { DiscoveryFeedScreen } from "./screens/DiscoveryFeedScreen";
import { DetailedProfileScreen } from "./screens/DetailedProfileScreen";
import { LikedUsersScreen } from "./screens/LikedUsersScreen";
import { HobbiesInterestsScreen } from "./screens/HobbiesInterestsScreen";
import { FilterScreen } from "./screens/FilterScreen";
import { ChatScreen } from "./screens/ChatScreen";
import { KundliMilanScreen } from "./screens/KundliMilanScreen";
import { NotificationsScreen } from "./screens/NotificationsScreen";
import { PremiumScreen } from "./screens/PremiumScreen";
import { MyProfileScreen } from "./screens/MyProfileScreen";
import { 
  Smartphone, 
  Maximize, 
  Minimize, 
  Download, 
  Wifi, 
  Battery, 
  Signal, 
  Layers, 
  Sparkles,
  Share2,
  ChevronDown
} from "lucide-react";

export const MobileDeviceShell: React.FC = () => {
  const { currentScreen, setCurrentScreen, installPwa } = useMobileApp();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState("9:41");
  const [showScreenDrawer, setShowScreenDrawer] = useState(false);

  // Live time ticker
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "" : "";
      hours = hours % 12 || 12;
      const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
      setCurrentTime(`${hours}:${minStr}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  const screensList: { id: ScreenType; label: string; tag: string }[] = [
    { id: "welcome", label: "1. Welcome & Splash", tag: "Screen 1" },
    { id: "signin", label: "2. Sign In (Login)", tag: "Screen 2" },
    { id: "feed", label: "3. Discovery Feed (Reels)", tag: "Screen 3" },
    { id: "profile-detail", label: "4. Detailed Profile View", tag: "Screen 4" },
    { id: "register", label: "5. Register Account", tag: "Screen 5" },
    { id: "liked", label: "6. Liked Users List", tag: "Screen 6" },
    { id: "interests", label: "7. Hobbies & Interests", tag: "Screen 7" },
    { id: "filter", label: "8. Search & Filters", tag: "Screen 8" },
    { id: "chat", label: "9. Live Chat & Messaging", tag: "Essential" },
    { id: "kundli", label: "10. Kundli Milan (36 Gunas)", tag: "Essential" },
    { id: "notifications", label: "11. Activity Notifications", tag: "Essential" },
    { id: "premium", label: "12. VIP Membership Plans", tag: "Essential" },
    { id: "my-profile", label: "13. My Profile & Settings", tag: "Essential" }
  ];

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return <WelcomeScreen />;
      case "signin":
        return <SignInScreen />;
      case "register":
        return <RegisterScreen />;
      case "feed":
        return <DiscoveryFeedScreen />;
      case "profile-detail":
        return <DetailedProfileScreen />;
      case "liked":
        return <LikedUsersScreen />;
      case "interests":
        return <HobbiesInterestsScreen />;
      case "filter":
        return <FilterScreen />;
      case "chat":
        return <ChatScreen />;
      case "kundli":
        return <KundliMilanScreen />;
      case "notifications":
        return <NotificationsScreen />;
      case "premium":
        return <PremiumScreen />;
      case "my-profile":
        return <MyProfileScreen />;
      default:
        return <DiscoveryFeedScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7ED] via-[#FDFBF7] to-[#FED7AA]/30 text-gray-900 flex flex-col justify-between py-2 sm:py-6 px-2 sm:px-4">
      {/* Top Desktop Controls Bar */}
      <header className="max-w-4xl w-full mx-auto mb-3 sm:mb-5 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-xs border border-orange-100 flex flex-wrap items-center justify-between gap-3">
        {/* App Title & Saffron Theme Badge */}
        <div className="flex items-center gap-2.5">
          <SathiyaLogo size={32} showText={true} />
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <span>Saffron & Royal Gold Theme</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Screen Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowScreenDrawer(!showScreenDrawer)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-bold border border-orange-200 transition-colors shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5 text-orange-600" />
              <span>Screens ({screensList.length})</span>
              <ChevronDown className="w-3 h-3 text-orange-600" />
            </button>

            {/* Dropdown Menu */}
            {showScreenDrawer && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-96 overflow-y-auto no-scrollbar">
                <div className="px-2 py-1.5 border-b border-gray-100 mb-1">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    All Matrimonial App Pages
                  </p>
                </div>
                {screensList.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentScreen(s.id);
                      setShowScreenDrawer(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      currentScreen === s.id
                        ? "bg-orange-500 text-white"
                        : "hover:bg-orange-50 text-gray-700"
                    }`}
                  >
                    <span>{s.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                      currentScreen === s.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      {s.tag}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Toggle Full Screen / Device Frame View */}
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
            title="Toggle between Mobile Frame and Full Screen View"
          >
            {isFullScreen ? (
              <>
                <Minimize className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Phone Frame</span>
              </>
            ) : (
              <>
                <Maximize className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Full Screen</span>
              </>
            )}
          </button>

          {/* Install Mobile App (PWA) Button */}
          <button
            onClick={installPwa}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-saffron-gradient text-white text-xs font-bold shadow-saffron-sm hover:opacity-95 active:scale-95 transition-all"
            title="Install Sathiya as standalone Mobile App"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
        </div>
      </header>

      {/* Main Container - Mobile Chassis Frame */}
      <main className="flex-1 flex items-center justify-center w-full">
        <div
          className={`${
            isFullScreen
              ? "w-full max-w-md h-[95vh] rounded-none sm:rounded-3xl shadow-2xl border sm:border-gray-300"
              : "mobile-device-frame"
          } relative flex flex-col overflow-hidden bg-white select-none transition-all duration-300`}
        >
          {/* Smartphone Status Bar (Clock, Camera Notch, WiFi, Battery) */}
          <div className="absolute top-0 inset-x-0 h-10 px-6 z-50 flex items-center justify-between text-xs font-semibold pointer-events-none select-none">
            {/* Clock */}
            <span className={`text-[13px] tracking-tight ${
              currentScreen === "welcome" || currentScreen === "feed" ? "text-white" : "text-gray-900"
            }`}>
              {currentTime}
            </span>

            {/* Dynamic Island / Camera Notch */}
            <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center">
              <span className="w-2.5 h-2.5 bg-gray-900 rounded-full border border-gray-700 mr-2" />
              <span className="w-1.5 h-1.5 bg-blue-900/60 rounded-full" />
            </div>

            {/* Signal & Battery Icons */}
            <div className={`flex items-center gap-1.5 ${
              currentScreen === "welcome" || currentScreen === "feed" ? "text-white" : "text-gray-900"
            }`}>
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Screen Content Render */}
          <div className="flex-1 h-full w-full overflow-hidden relative">
            {renderActiveScreen()}
          </div>

          {/* Bottom Persistent Navigation Bar */}
          <BottomNavBar />

          {/* Bottom Gesture Bar Indicator */}
          <div className="absolute bottom-1 inset-x-0 h-3 flex items-center justify-center pointer-events-none z-50">
            <div className={`w-32 h-1 rounded-full ${
              currentScreen === "welcome" || currentScreen === "feed" ? "bg-white/60" : "bg-black/30"
            }`} />
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="text-center mt-3 text-xs text-gray-500">
        <p>
          <span className="font-semibold text-orange-600">Sathiya Matrimony Mobile App</span> • Fully Functional UI Prototype • Ready to Install on Android / iOS
        </p>
      </footer>
    </div>
  );
};

export default MobileDeviceShell;
