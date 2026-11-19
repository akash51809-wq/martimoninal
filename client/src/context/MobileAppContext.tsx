import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_PROFILES, ProfileData, MOCK_CHATS, MOCK_NOTIFICATIONS } from "../data/mockData";

export type ScreenType =
  | "welcome"
  | "signin"
  | "register"
  | "feed"
  | "profile-detail"
  | "liked"
  | "interests"
  | "filter"
  | "chat"
  | "kundli"
  | "notifications"
  | "premium"
  | "my-profile";

interface FilterState {
  minAge: number;
  maxAge: number;
  minHeight: number; // in cm
  maxHeight: number;
  caste: string;
  subCaste: string;
  motherTongue: string;
  minIncomeLpa: number;
  maxIncomeLpa: number;
  city: string;
  state: string;
  maritalStatus: string;
  manglik: string;
}

interface MobileAppContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  selectedProfile: ProfileData;
  setSelectedProfile: (profile: ProfileData) => void;
  likedProfileIds: string[];
  toggleLike: (profileId: string) => void;
  isLiked: (profileId: string) => boolean;
  blockedProfileIds: string[];
  toggleBlock: (profileId: string) => void;
  filters: FilterState;
  updateFilters: (partial: Partial<FilterState>) => void;
  resetFilters: () => void;
  filteredProfiles: ProfileData[];
  currentProfileIndex: number;
  setCurrentProfileIndex: (idx: number | ((prev: number) => number)) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  user: {
    name: string;
    profileId: string;
    email: string;
    mobile: string;
    photo: string;
    isPremium: boolean;
    planName: string;
  };
  upgradeToPlan: (planId: string) => void;
  chats: typeof MOCK_CHATS;
  sendMessage: (profileId: string, text: string) => void;
  notifications: typeof MOCK_NOTIFICATIONS;
  markNotificationRead: (id: string) => void;
  activeChatProfileId: string | null;
  setActiveChatProfileId: (id: string | null) => void;
  deferredPrompt: any;
  installPwa: () => void;
  isInstallable: boolean;
}

const defaultFilters: FilterState = {
  minAge: 21,
  maxAge: 32,
  minHeight: 150,
  maxHeight: 190,
  caste: "All",
  subCaste: "All",
  motherTongue: "All",
  minIncomeLpa: 5,
  maxIncomeLpa: 50,
  city: "All",
  state: "All",
  maritalStatus: "All",
  manglik: "All"
};

const MobileAppContext = createContext<MobileAppContextType | undefined>(undefined);

export const MobileAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("feed");
  const [selectedProfile, setSelectedProfile] = useState<ProfileData>(MOCK_PROFILES[0]);
  const [likedProfileIds, setLikedProfileIds] = useState<string[]>(["1", "3"]);
  const [blockedProfileIds, setBlockedProfileIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [currentProfileIndex, setCurrentProfileIndex] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [chats, setChats] = useState(MOCK_CHATS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeChatProfileId, setActiveChatProfileId] = useState<string | null>("1");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  const [user, setUser] = useState({
    name: "Aarav Sharma",
    profileId: "#000001",
    email: "aarav.sharma@example.com",
    mobile: "+91 98200 88776",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    isPremium: true,
    planName: "Gold Royal VIP"
  });

  // PWA install event listener
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const installPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      alert("To install Sathiya Matrimony on your phone:\n\n• On Android (Chrome): Tap the ⋮ menu at top right and choose 'Install App' or 'Add to Home screen'.\n• On iPhone (Safari): Tap the Share button (square with arrow) and tap 'Add to Home Screen'.");
    }
  };

  const toggleLike = (profileId: string) => {
    setLikedProfileIds((prev) =>
      prev.includes(profileId) ? prev.filter((id) => id !== profileId) : [...prev, profileId]
    );
  };

  const isLiked = (profileId: string) => likedProfileIds.includes(profileId);

  const toggleBlock = (profileId: string) => {
    setBlockedProfileIds((prev) =>
      prev.includes(profileId) ? prev.filter((id) => id !== profileId) : [...prev, profileId]
    );
  };

  const updateFilters = (partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const filteredProfiles = MOCK_PROFILES.filter((p) => {
    if (blockedProfileIds.includes(p.id)) return false;
    if (p.age < filters.minAge || p.age > filters.maxAge) return false;
    if (p.heightCm < filters.minHeight || p.heightCm > filters.maxHeight) return false;
    if (filters.caste !== "All" && !p.caste.toLowerCase().includes(filters.caste.toLowerCase())) return false;
    if (filters.motherTongue !== "All" && !p.motherTongue.toLowerCase().includes(filters.motherTongue.toLowerCase())) return false;
    if (p.annualIncomeLpa < filters.minIncomeLpa) return false;
    if (filters.city !== "All" && !p.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
    if (filters.manglik !== "All" && p.manglik !== filters.manglik) return false;
    return true;
  });

  const upgradeToPlan = (planId: string) => {
    setUser((prev) => ({
      ...prev,
      isPremium: true,
      planName: planId === "platinum" ? "Platinum Exclusive" : planId === "gold" ? "Gold Royal VIP" : "Silver Connect"
    }));
  };

  const sendMessage = (profileId: string, text: string) => {
    const newMessage = {
      id: `m_${Date.now()}`,
      sender: "user",
      text,
      time: "Just now"
    };

    setChats((prev) => {
      const existing = prev.find((c) => c.profileId === profileId);
      if (existing) {
        return prev.map((c) =>
          c.profileId === profileId
            ? { ...c, lastMessage: text, timestamp: "Just now", messages: [...c.messages, newMessage] }
            : c
        );
      } else {
        const candidate = MOCK_PROFILES.find((p) => p.id === profileId);
        return [
          {
            profileId,
            candidateName: candidate?.name || "Match",
            avatar: candidate?.photos[0] || "",
            lastMessage: text,
            timestamp: "Just now",
            unread: 0,
            online: true,
            messages: [newMessage]
          },
          ...prev
        ];
      }
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <MobileAppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        selectedProfile,
        setSelectedProfile,
        likedProfileIds,
        toggleLike,
        isLiked,
        blockedProfileIds,
        toggleBlock,
        filters,
        updateFilters,
        resetFilters,
        filteredProfiles,
        currentProfileIndex,
        setCurrentProfileIndex,
        selectedLanguage,
        setSelectedLanguage,
        user,
        upgradeToPlan,
        chats,
        sendMessage,
        notifications,
        markNotificationRead,
        activeChatProfileId,
        setActiveChatProfileId,
        deferredPrompt,
        installPwa,
        isInstallable
      }}
    >
      {children}
    </MobileAppContext.Provider>
  );
};

export const useMobileApp = () => {
  const context = useContext(MobileAppContext);
  if (!context) {
    throw new Error("useMobileApp must be used within a MobileAppProvider");
  }
  return context;
};
