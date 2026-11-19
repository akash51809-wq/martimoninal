import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { ProfileData, MOCK_PROFILES } from "@/data/mockData";
import { WebsiteNavbar } from "@/components/home/WebsiteNavbar";
import {
  HeroSection,
  HeroSearchFilters,
} from "@/components/home/HeroSection";
import { CuratedProfilesSection } from "@/components/home/CuratedProfilesSection";
import { JourneyAndTrustSection } from "@/components/home/JourneyAndTrustSection";
import { SuccessStoriesSection } from "@/components/home/SuccessStoriesSection";
import { MembershipAndAppSection } from "@/components/home/MembershipAndAppSection";
import { WebsiteFooter } from "@/components/home/WebsiteFooter";
import { ProfilePreviewModal } from "@/components/home/ProfilePreviewModal";
import {
  MobileBottomNav,
  MobileTabId,
} from "@/components/home/MobileBottomNav";
import { MobileLikedSheet } from "@/components/home/MobileLikedSheet";
import { useToast } from "@/hooks/use-toast";
import {
  useAuthAccount,
  resolvePostLoginDestination,
} from "@/context/AuthAccountContext";
import { useLanguage, type SupportedLanguageCode } from "@/context/LanguageContext";

const DEFAULT_HERO_FILTERS: HeroSearchFilters = {
  lookingFor: "All",
  minAge: 21,
  maxAge: 35,
  community: "All Communities",
  motherTongue: "All",
};

export default function PremiumHomepage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { currentAccount } = useAuthAccount();

  useEffect(() => {
    document.title = "Vivah Kar Lo - Find Your Perfect Match";
  }, []);

  const { lang, setLang, t } = useLanguage();
  const [heroFilters, setHeroFilters] =
    useState<HeroSearchFilters>(DEFAULT_HERO_FILTERS);
  const [likedIds, setLikedIds] = useState<string[]>(["1"]);
  const [previewProfile, setPreviewProfile] = useState<ProfileData | null>(
    null
  );
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTabId>("home");
  const [likedSheetOpen, setLikedSheetOpen] = useState(false);

  const likedProfiles = useMemo(
    () => MOCK_PROFILES.filter((p) => likedIds.includes(p.id)),
    [likedIds]
  );

  const openAuth = (tab: "login" | "register", planName: string | null = null) => {
    if (planName) {
      toast({
        title: `${planName} Selected`,
        description: "Register or sign in to continue with your selected membership plan.",
      });
    }
    setLocation(tab === "login" ? "/login" : "/register");
  };

  const scrollToSectionId = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSelectMobileTab = (tab: MobileTabId) => {
    setActiveMobileTab(tab);
    if (tab === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (tab === "matches") {
      scrollToSectionId("discover");
    } else if (tab === "liked") {
      setLikedSheetOpen(true);
    } else if (tab === "plans") {
      scrollToSectionId("membership");
    } else if (tab === "account") {
      if (currentAccount) {
        setLocation(resolvePostLoginDestination(currentAccount));
      } else {
        setLocation("/login");
      }
    }
  };

  const handleToggleLike = (profile: ProfileData) => {
    setLikedIds((prev) => {
      const exists = prev.includes(profile.id);
      const next = exists
        ? prev.filter((id) => id !== profile.id)
        : [...prev, profile.id];

      toast({
        title: exists ? "Interest Withdrawn" : `Interest Sent to ${profile.name}!`,
        description: exists
          ? `Removed ${profile.name} from your sent interests.`
          : "Complete your free registration so families can connect with you.",
      });
      return next;
    });
  };

  const handleCommunityQuickFilter = (community: string) => {
    setHeroFilters({
      ...DEFAULT_HERO_FILTERS,
      community,
    });
    scrollToSectionId("discover");
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2B120C] flex flex-col overflow-x-hidden">
      <WebsiteNavbar
        selectedLang={lang}
        onSelectLang={(code) => setLang(code as SupportedLanguageCode)}
        onOpenAuth={(tab) => openAuth(tab)}
      />

      <main className="flex-1">
        <HeroSection
          filters={heroFilters}
          onChangeFilters={setHeroFilters}
          onSearchSubmit={() => scrollToSectionId("discover")}
          onOpenRegister={() => openAuth("register")}
        />

        <CuratedProfilesSection
          filters={heroFilters}
          onResetFilters={() => setHeroFilters(DEFAULT_HERO_FILTERS)}
          likedIds={likedIds}
          onToggleLike={handleToggleLike}
          onViewProfile={(profile) => setPreviewProfile(profile)}
          onOpenRegister={() => openAuth("register")}
        />

        <JourneyAndTrustSection />

        <SuccessStoriesSection />

        <MembershipAndAppSection
          onSelectPlan={(planName) => openAuth("register", planName)}
          onSelectCommunityFilter={handleCommunityQuickFilter}
          onOpenRegister={() => openAuth("register")}
        />
      </main>

      <WebsiteFooter
        onOpenAuth={(tab) => openAuth(tab)}
        onSelectCommunityFilter={handleCommunityQuickFilter}
      />

      {/* Native Mobile App Bottom Bar & Sent Interests Sheet */}
      <MobileBottomNav
        activeTab={activeMobileTab}
        likedCount={likedIds.length}
        onSelectTab={handleSelectMobileTab}
      />

      <MobileLikedSheet
        open={likedSheetOpen}
        onOpenChange={setLikedSheetOpen}
        likedProfiles={likedProfiles}
        onViewProfile={(profile) => setPreviewProfile(profile)}
        onRemoveLike={handleToggleLike}
        onOpenRegister={() => openAuth("register")}
      />

      <ProfilePreviewModal
        profile={previewProfile}
        isLiked={previewProfile ? likedIds.includes(previewProfile.id) : false}
        onClose={() => setPreviewProfile(null)}
        onSendInterest={handleToggleLike}
        onUnlockContact={() => {
          setPreviewProfile(null);
          openAuth("register");
        }}
      />
    </div>
  );
}
