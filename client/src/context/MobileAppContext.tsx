import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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

export interface MobileUser {
  id: string;
  name: string;
  profileId: string;
  email: string;
  mobile: string;
  photo: string;
  gender: string;
  role: string;
  isPremium: boolean;
  planName: string;
}

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

interface RegisterInput {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  gender: "Male" | "Female" | "Other";
  dob?: string;
  profileCreatedBy?: string;
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
  user: MobileUser | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  isLoadingProfiles: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  login: (identity: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (input: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  upgradeToPlan: (planId: string) => void;
  refreshProfiles: () => Promise<void>;
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
  // 1. Authenticated User State initialized from localStorage
  const [user, setUser] = useState<MobileUser | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("vivah_mobile_user");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading saved mobile user:", e);
      }
    }
    return null;
  });

  // 2. Initial Screen: if logged in, go to "feed"; otherwise start at "welcome"
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("vivah_mobile_user");
        if (saved) return "feed";
      } catch (e) {
        // Fallback to welcome
      }
    }
    return "welcome";
  });

  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);

  // 3. Profiles from Live Backend Database (with master profile fallback)
  const [allProfiles, setAllProfiles] = useState<ProfileData[]>(MOCK_PROFILES);
  const [selectedProfile, setSelectedProfile] = useState<ProfileData>(MOCK_PROFILES[0]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState<number>(0);

  // 4. User Interaction State (Liked & Blocked IDs)
  const [likedProfileIds, setLikedProfileIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("vivah_mobile_liked");
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return ["1", "3"];
  });

  const [blockedProfileIds, setBlockedProfileIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [chats, setChats] = useState(MOCK_CHATS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeChatProfileId, setActiveChatProfileId] = useState<string | null>("1");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

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

  // Sync liked profiles to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vivah_mobile_liked", JSON.stringify(likedProfileIds));
      } catch (e) {}
    }
  }, [likedProfileIds]);

  // Fetch live profiles from database
  const refreshProfiles = useCallback(async () => {
    setIsLoadingProfiles(true);
    try {
      const viewerId = user?.id || "usr-active-complete";
      const res = await fetch(`/api/v1/matches/recommendations?userId=${viewerId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.matches) && data.matches.length > 0) {
          const mapped: ProfileData[] = data.matches.map((m: any, idx: number) => {
            const fallback = MOCK_PROFILES[idx % MOCK_PROFILES.length] || MOCK_PROFILES[0];
            return {
              id: String(m.id || idx + 1),
              profileId: m.profileId || `#00000${idx + 1}`,
              name: m.name || fallback.name,
              gender: m.gender || fallback.gender,
              age: m.age || fallback.age,
              dob: m.dob || fallback.dob,
              height: m.height || fallback.height,
              heightCm: m.heightCm || fallback.heightCm,
              profession: m.profession || fallback.profession,
              professionTag: m.professionTag || fallback.professionTag,
              education: m.education || fallback.education,
              college: m.college || fallback.college,
              company: m.company || fallback.company,
              city: m.city || fallback.city,
              state: m.state || fallback.state,
              country: m.country || fallback.country,
              maritalStatus: m.maritalStatus || fallback.maritalStatus,
              religion: m.religion || fallback.religion,
              caste: m.caste || fallback.caste,
              subCaste: m.subCaste || fallback.subCaste,
              motherTongue: m.motherTongue || fallback.motherTongue,
              gotra: m.gotra || fallback.gotra,
              rashi: m.rashi || fallback.rashi,
              nakshatra: m.nakshatra || fallback.nakshatra,
              manglik: m.manglik || fallback.manglik,
              kundliScore: m.kundliScore || fallback.kundliScore,
              income: m.income || fallback.income,
              annualIncomeLpa: m.annualIncomeLpa || fallback.annualIncomeLpa,
              email: m.email || fallback.email,
              mobile: m.mobile || fallback.mobile,
              verified: m.verified !== undefined ? m.verified : fallback.verified,
              online: m.online !== undefined ? m.online : fallback.online,
              bio: m.bio || fallback.bio,
              photos: Array.isArray(m.photos) && m.photos.length > 0 ? m.photos : fallback.photos,
              interests: m.interests || fallback.interests,
              family: m.family || fallback.family,
              lifestyle: m.lifestyle || fallback.lifestyle,
              partnerPreferences: m.partnerPreferences || fallback.partnerPreferences,
            };
          });

          setAllProfiles(mapped);
          setSelectedProfile(mapped[0]);
        }
      }
    } catch (e) {
      console.warn("Using offline master profiles cache:", e);
    } finally {
      setIsLoadingProfiles(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshProfiles();
  }, [refreshProfiles]);

  // Real Database Authentication: Login
  const login = async (identity: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    setIsLoadingAuth(true);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity: identity.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const errMsg = data.error || "Invalid mobile number/email or password";
        setAuthError(errMsg);
        setIsLoadingAuth(false);
        return { success: false, error: errMsg };
      }

      const bundleUser = data.bundle?.user || {};
      const bundleRole = data.bundle?.role || {};

      const mobileUser: MobileUser = {
        id: bundleUser.id || `usr-${Date.now()}`,
        name: bundleUser.fullName || "Member",
        profileId: bundleUser.profileId || `#${(bundleUser.id || "").slice(-6) || "000001"}`,
        email: bundleUser.email || "",
        mobile: bundleUser.mobile || "",
        photo: bundleUser.gender === "Female" ? "/3.jpg" : "/2.jpg",
        gender: bundleUser.gender || "Male",
        role: bundleRole.role || "free",
        isPremium: bundleRole.role === "vip",
        planName: bundleRole.role === "vip" ? "Gold Royal VIP" : "Free Member",
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("vivah_mobile_auth_token", data.token || "token_authenticated");
        localStorage.setItem("vivah_mobile_user", JSON.stringify(mobileUser));
      }

      setUser(mobileUser);
      setCurrentScreen("feed");
      setIsLoadingAuth(false);
      return { success: true };
    } catch (err: any) {
      const errMsg = err.message || "Network error. Could not connect to server.";
      setAuthError(errMsg);
      setIsLoadingAuth(false);
      return { success: false, error: errMsg };
    }
  };

  // Real Database Authentication: Register
  const registerUser = async (input: RegisterInput): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    setIsLoadingAuth(true);
    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: input.fullName.trim(),
          mobile: input.mobile.trim(),
          email: input.email.trim(),
          password: input.password,
          gender: input.gender,
          dob: input.dob || "1998-01-01",
          profileCreatedBy: input.profileCreatedBy || "Self",
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        const errMsg = result.error || "Registration failed. Mobile or email may already be in use.";
        setAuthError(errMsg);
        setIsLoadingAuth(false);
        return { success: false, error: errMsg };
      }

      // Immediately log in with new credentials
      return await login(input.mobile || input.email, input.password);
    } catch (err: any) {
      const errMsg = err.message || "Network error during registration.";
      setAuthError(errMsg);
      setIsLoadingAuth(false);
      return { success: false, error: errMsg };
    }
  };

  // Real Logout: wipes session, tokens, and returns to welcome screen
  const logout = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("vivah_mobile_auth_token");
        localStorage.removeItem("vivah_mobile_user");
        localStorage.removeItem("vivah_mobile_liked");
      } catch (e) {
        console.error("Logout error:", e);
      }
    }
    setUser(null);
    setLikedProfileIds([]);
    setCurrentScreen("welcome");
  };

  const installPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      alert("To install Vivah Kar Lo on your phone:\n\n• On Android (Chrome): Tap the ⋮ menu at top right and choose 'Install App' or 'Add to Home screen'.\n• On iPhone (Safari): Tap the Share button (square with arrow) and tap 'Add to Home Screen'.");
    }
  };

  const toggleLike = (profileId: string) => {
    setLikedProfileIds((prev) => {
      const exists = prev.includes(profileId);
      const updated = exists ? prev.filter((id) => id !== profileId) : [...prev, profileId];
      return updated;
    });

    // Send async interest to backend
    fetch("/api/v1/communication/interest/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidateId: profileId,
        message: "Expressed interest via Vivah Kar Lo Mobile App",
      }),
    }).catch(() => {});
  };

  const isLiked = (profileId: string) => likedProfileIds.includes(profileId);

  const toggleBlock = (profileId: string) => {
    setBlockedProfileIds((prev) =>
      prev.includes(profileId) ? prev.filter((id) => id !== profileId) : [...prev, profileId]
    );

    // Call backend security block
    fetch("/api/v1/security/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockedUserId: profileId }),
    }).catch(() => {});
  };

  const updateFilters = (partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const filteredProfiles = allProfiles.filter((p) => {
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
    if (!user) return;
    const planName = planId === "platinum" ? "Platinum Exclusive" : planId === "gold" ? "Gold Royal VIP" : "Silver Connect";
    const updated = {
      ...user,
      isPremium: true,
      planName,
      role: "vip",
    };
    setUser(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("vivah_mobile_user", JSON.stringify(updated));
    }
  };

  const sendMessage = (profileId: string, text: string) => {
    const newMessage = {
      id: `m_${Date.now()}`,
      sender: "user",
      text,
      time: "Just now",
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
        const candidate = allProfiles.find((p) => p.id === profileId);
        return [
          {
            profileId,
            candidateName: candidate?.name || "Match",
            avatar: candidate?.photos[0] || "",
            lastMessage: text,
            timestamp: "Just now",
            unread: 0,
            online: true,
            messages: [newMessage],
          },
          ...prev,
        ];
      }
    });

    // Send async message to backend
    fetch("/api/v1/communication/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientId: profileId, content: text }),
    }).catch(() => {});
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
        isAuthenticated: !!user,
        isLoadingAuth,
        isLoadingProfiles,
        authError,
        setAuthError,
        login,
        registerUser,
        logout,
        upgradeToPlan,
        refreshProfiles,
        chats,
        sendMessage,
        notifications,
        markNotificationRead,
        activeChatProfileId,
        setActiveChatProfileId,
        deferredPrompt,
        installPwa,
        isInstallable,
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
