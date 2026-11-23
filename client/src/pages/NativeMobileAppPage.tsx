import React from "react";
import { MobileAppProvider, useMobileApp } from "@/context/MobileAppContext";
import { BottomNavBar } from "@/components/mobile/BottomNavBar";
import { WelcomeScreen } from "@/components/mobile/screens/WelcomeScreen";
import { SignInScreen } from "@/components/mobile/screens/SignInScreen";
import { RegisterScreen } from "@/components/mobile/screens/RegisterScreen";
import { DiscoveryFeedScreen } from "@/components/mobile/screens/DiscoveryFeedScreen";
import { DetailedProfileScreen } from "@/components/mobile/screens/DetailedProfileScreen";
import { LikedUsersScreen } from "@/components/mobile/screens/LikedUsersScreen";
import { HobbiesInterestsScreen } from "@/components/mobile/screens/HobbiesInterestsScreen";
import { FilterScreen } from "@/components/mobile/screens/FilterScreen";
import { ChatScreen } from "@/components/mobile/screens/ChatScreen";
import { KundliMilanScreen } from "@/components/mobile/screens/KundliMilanScreen";
import { NotificationsScreen } from "@/components/mobile/screens/NotificationsScreen";
import { PremiumScreen } from "@/components/mobile/screens/PremiumScreen";
import { MyProfileScreen } from "@/components/mobile/screens/MyProfileScreen";

function NativeMobileAppContent() {
  const { currentScreen } = useMobileApp();

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
    <div className="fixed inset-0 w-full h-[100dvh] max-w-md mx-auto bg-black flex flex-col overflow-hidden select-none touch-manipulation">
      <main className="flex-1 w-full h-full relative overflow-hidden bg-[#FFFDF9]">
        {renderActiveScreen()}
      </main>
      <BottomNavBar />
    </div>
  );
}

export default function NativeMobileAppPage() {
  return (
    <MobileAppProvider>
      <NativeMobileAppContent />
    </MobileAppProvider>
  );
}
