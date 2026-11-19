import React, { useState, useEffect } from "react";
import { ProfileData } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  Heart,
  MessageCircle,
  Bookmark,
  MapPin,
  Sparkles,
  Eye,
  Phone,
  Image as ImageIcon,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Users,
  Crown,
  Lock,
  Star,
  ThumbsUp,
  RotateCcw,
  Scale,
  Ban,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SendInterestModal } from "@/components/modals/SendInterestModal";
import { RequestContactModal } from "@/components/modals/RequestContactModal";
import { ProfileComparisonModal } from "@/components/search/ProfileComparisonModal";
import { type ProfileViewItem, type ShortlistItem } from "@shared/userActivityTypes";

interface ReceivedLikeItem {
  id: string;
  likerId: string;
  likerName: string;
  likerAvatar: string;
  likerAge: number;
  likerCity: string;
  likerProfession: string;
  likerCaste: string;
  likedAt: string;
  isMutualLike: boolean;
}

interface ContactAccessRequestItem {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  requestedAt: string;
  vipTier: string;
  status: "pending" | "approved" | "declined";
}

interface PhotoAccessRequestItem {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  requestedAt: string;
  reason: string;
  status: "pending" | "approved" | "declined";
}

interface DashboardInterestsTabProps {
  allProfiles: ProfileData[];
  receivedIds: string[];
  sentIds: string[];
  mutualIds: string[];
  rejectedIds?: string[];
  shortlistedIds: string[];
  favoriteIds?: string[];
  currentUserId?: string;
  onAcceptReceived: (profile: ProfileData) => void;
  onDeclineReceived: (profile: ProfileData) => void;
  onReconsiderRejected?: (profile: ProfileData) => void;
  onWithdrawSent: (profile: ProfileData) => void;
  onToggleShortlist: (profile: ProfileData) => void;
  onToggleFavorite?: (profile: ProfileData) => void;
  onViewProfile: (profile: ProfileData) => void;
  onOpenChat: (profileId: string) => void;
  isVipMember?: boolean;
}

export const DashboardInterestsTab: React.FC<DashboardInterestsTabProps> = ({
  allProfiles,
  receivedIds,
  sentIds,
  mutualIds,
  rejectedIds = [],
  shortlistedIds,
  favoriteIds = [],
  currentUserId = "usr-active-complete",
  onAcceptReceived,
  onDeclineReceived,
  onReconsiderRejected,
  onWithdrawSent,
  onToggleShortlist,
  onToggleFavorite,
  onViewProfile,
  onOpenChat,
  isVipMember = true,
}) => {
  const { toast } = useToast();
  const [subTab, setSubTab] = useState<
    | "pending"
    | "received"
    | "sent"
    | "mutual"
    | "rejected"
    | "shortlisted"
    | "favorites"
    | "viewed_profiles"
    | "who_viewed_me"
    | "who_shortlisted_me"
    | "who_liked_me"
    | "contact_requests"
    | "photo_requests"
  >("received");

  // State for Who Liked My Profile (#17)
  const [whoLikedMe, setWhoLikedMe] = useState<ReceivedLikeItem[]>([]);
  // State for Revisit Profile counts (#18)
  const [revisitCounts, setRevisitCounts] = useState<Record<string, number>>({});
  // State for Profile Comparison (#20)
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  // State for Viewed Profiles (Feature 20)
  const [viewedProfiles, setViewedProfiles] = useState<ProfileViewItem[]>([
    {
      id: "pv-1",
      viewerId: "1",
      viewerName: "Dr. Ananya Sen",
      viewerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60",
      viewerAge: 26,
      viewerCity: "Mumbai, Maharashtra",
      viewerProfession: "Doctor (BHMS)",
      viewerCaste: "Hindu - Brahmin",
      viewedUserId: currentUserId,
      viewedAt: "Today, 10:45 AM",
    },
    {
      id: "pv-2",
      viewerId: "3",
      viewerName: "Sneha Patil",
      viewerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60",
      viewerAge: 25,
      viewerCity: "Pune, Maharashtra",
      viewerProfession: "Fashion Designer",
      viewerCaste: "Hindu - Maratha",
      viewedUserId: currentUserId,
      viewedAt: "Yesterday, 04:30 PM",
    },
    {
      id: "pv-3",
      viewerId: "5",
      viewerName: "Pooja Hegde",
      viewerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60",
      viewerAge: 27,
      viewerCity: "Bangalore, Karnataka",
      viewerProfession: "Architect & Interior Designer",
      viewerCaste: "Hindu - Bunt",
      viewedUserId: currentUserId,
      viewedAt: "2 days ago",
    },
  ]);

  // State for Who Viewed My Profile (Feature 21)
  const [whoViewedMe, setWhoViewedMe] = useState<ProfileViewItem[]>([
    {
      id: "wvm-1",
      viewerId: "2",
      viewerName: "Dr. Aditya Joshi",
      viewerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60",
      viewerAge: 29,
      viewerCity: "New Delhi",
      viewerProfession: "Cardiologist (MD)",
      viewerCaste: "Hindu - Brahmin",
      viewedUserId: currentUserId,
      viewedAt: "Today, 11:15 AM",
    },
    {
      id: "wvm-2",
      viewerId: "4",
      viewerName: "Vikram Malhotra",
      viewerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60",
      viewerAge: 28,
      viewerCity: "Bangalore, Karnataka",
      viewerProfession: "Senior AI Engineer (IIT Delhi)",
      viewerCaste: "Hindu - Khatri",
      viewedUserId: currentUserId,
      viewedAt: "Yesterday, 07:40 PM",
    },
    {
      id: "wvm-3",
      viewerId: "6",
      viewerName: "Rohan Verma",
      viewerAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60",
      viewerAge: 30,
      viewerCity: "Gurgaon, Haryana",
      viewerProfession: "Product Director (Fintech)",
      viewerCaste: "Hindu - Kayastha",
      viewedUserId: currentUserId,
      viewedAt: "3 days ago",
    },
  ]);

  // State for Who Shortlisted Me (Feature 22)
  const [whoShortlistedMe, setWhoShortlistedMe] = useState<ShortlistItem[]>([
    {
      id: "wsm-1",
      userId: "4",
      targetUserId: currentUserId,
      targetName: "Vikram Malhotra",
      targetAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60",
      targetAge: 28,
      targetCity: "Bangalore, Karnataka",
      targetProfession: "Senior AI Engineer (IIT Delhi)",
      targetCaste: "Hindu - Khatri",
      shortlistedAt: "Yesterday, 08:10 PM",
      matchScore: 94,
    },
    {
      id: "wsm-2",
      userId: "2",
      targetUserId: currentUserId,
      targetName: "Dr. Aditya Joshi",
      targetAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60",
      targetAge: 29,
      targetCity: "New Delhi",
      targetProfession: "Cardiologist (MD)",
      targetCaste: "Hindu - Brahmin",
      shortlistedAt: "3 days ago",
      matchScore: 89,
    },
  ]);

  // Fetch live activity on mount or user change
  useEffect(() => {
    if (!currentUserId) return;

    fetch(`/api/v1/activity/views/recent?userId=${encodeURIComponent(currentUserId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.views) && d.views.length > 0) {
          setViewedProfiles(d.views);
        }
      })
      .catch(() => {});

    fetch(`/api/v1/activity/views/visitors?userId=${encodeURIComponent(currentUserId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.visitors) && d.visitors.length > 0) {
          setWhoViewedMe(d.visitors);
        }
      })
      .catch(() => {});

    fetch(`/api/v1/activity/shortlist/who-shortlisted-me?userId=${encodeURIComponent(currentUserId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.members) && d.members.length > 0) {
          setWhoShortlistedMe(d.members);
        }
      })
      .catch(() => {});

    fetch(`/api/v1/activity/likes/received?userId=${encodeURIComponent(currentUserId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.likes)) {
          setWhoLikedMe(d.likes);
        }
      })
      .catch(() => {});

    fetch(`/api/v1/activity/revisit?userId=${encodeURIComponent(currentUserId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.revisits)) {
          const map: Record<string, number> = {};
          for (const r of d.revisits) map[r.targetUserId] = r.visitCount;
          setRevisitCounts(map);
        }
      })
      .catch(() => {});
  }, [currentUserId]);

  // Mock state for Contact and Photo requests
  const [contactRequests, setContactRequests] = useState<ContactAccessRequestItem[]>([
    {
      id: "cr-101",
      requesterId: "2",
      requesterName: "Dr. Aditya Joshi",
      requesterAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60",
      requestedAt: "Today, 11:20 AM",
      vipTier: "VIP Platinum",
      status: "pending",
    },
    {
      id: "cr-102",
      requesterId: "5",
      requesterName: "Vikram Malhotra",
      requesterAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60",
      requestedAt: "Yesterday",
      vipTier: "VIP Gold",
      status: "pending",
    },
  ]);

  const [photoRequests, setPhotoRequests] = useState<PhotoAccessRequestItem[]>([
    {
      id: "pr-201",
      requesterId: "3",
      requesterName: "Rohan Kulkarni",
      requesterAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60",
      requestedAt: "2 days ago",
      reason: "Our family would like to view full album photos before proceeding.",
      status: "pending",
    },
  ]);

  // Selected profile for Contact Request modal
  const [contactTarget, setContactTarget] = useState<ProfileData | null>(null);
  const [sendInterestTarget, setSendInterestTarget] = useState<ProfileData | null>(null);

  const byIds = (ids: string[]) =>
    allProfiles.filter((p) => ids.includes(p.id));

  const pendingContactCount = contactRequests.filter((r) => r.status === "pending").length;
  const pendingPhotoCount = photoRequests.filter((r) => r.status === "pending").length;

  const pendingCombinedIds = Array.from(new Set([...receivedIds, ...sentIds]));

  const tabs = [
    { id: "pending" as const, label: "Pending Interests", count: pendingCombinedIds.length },
    { id: "received" as const, label: "Received", count: receivedIds.length },
    { id: "sent" as const, label: "Sent", count: sentIds.length },
    { id: "mutual" as const, label: "Accepted / Mutual", count: mutualIds.length },
    { id: "rejected" as const, label: "Rejected", count: rejectedIds.length },
    { id: "shortlisted" as const, label: "Shortlisted", count: shortlistedIds.length },
    { id: "favorites" as const, label: "Favorites", count: favoriteIds.length },
    { id: "who_liked_me" as const, label: "Who Liked Me", count: whoLikedMe.length },
    { id: "viewed_profiles" as const, label: "Recently Viewed", count: viewedProfiles.length },
    { id: "who_viewed_me" as const, label: "Who Viewed Me", count: whoViewedMe.length },
    { id: "who_shortlisted_me" as const, label: "Who Shortlisted Me", count: whoShortlistedMe.length },
    { id: "contact_requests" as const, label: "Contact Requests", count: pendingContactCount },
    { id: "photo_requests" as const, label: "Photo Requests", count: pendingPhotoCount },
  ];

  const handleLikeBack = async (likerId: string, likerName: string) => {
    try {
      const res = await fetch("/api/v1/activity/likes/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, targetUserId: likerId }),
      });
      const data = await res.json();
      if (data.success) {
        setWhoLikedMe((prev) =>
          prev.map((item) =>
            item.likerId === likerId ? { ...item, isMutualLike: data.liked } : item
          )
        );
        toast({
          title: data.liked ? `Mutual Like with ${likerName}!` : `Like removed for ${likerName}`,
          description: data.liked
            ? "You both liked each other's profile. Send a formal interest to start chatting!"
            : undefined,
        });
      }
    } catch {
      toast({ title: "Could not update like status", variant: "destructive" });
    }
  };

  const handleRevisitProfile = (id: string, name: string) => {
    setRevisitCounts((prev) => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
    fetch("/api/v1/activity/revisit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUserId, targetUserId: id }),
    }).catch(() => {});
    handleOpenProfileFromItem(id, name);
    toast({
      title: `Revisiting ${name}`,
      description: `Revisit recorded (#${(revisitCounts[id] || 1) + 1} visit).`,
    });
  };

  const toggleCompare = (profileId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(profileId)) return prev.filter((id) => id !== profileId);
      if (prev.length >= 3) {
        toast({
          title: "Maximum 3 Profiles",
          description: "You can compare up to 3 profiles side-by-side at once.",
          variant: "destructive",
        });
        return prev;
      }
      return [...prev, profileId];
    });
  };

  const handleApproveContact = (id: string, name: string) => {
    setContactRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r))
    );
    toast({
      title: "Contact Details Shared",
      description: `Your phone number and WhatsApp are now unmasked for ${name}.`,
    });
  };

  const handleDeclineContact = (id: string, name: string) => {
    setContactRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "declined" as const } : r))
    );
    toast({
      title: "Contact Request Declined",
      description: `Request from ${name} was politely declined.`,
    });
  };

  const handleApprovePhoto = (id: string, name: string) => {
    setPhotoRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r))
    );
    toast({
      title: "Photo Access Granted",
      description: `${name} can now view your protected photo album.`,
    });
  };

  const handleDeclinePhoto = (id: string, name: string) => {
    setPhotoRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "declined" as const } : r))
    );
    toast({
      title: "Photo Request Declined",
      description: `Request from ${name} was declined.`,
    });
  };

  const activeList =
    subTab === "pending"
      ? byIds(pendingCombinedIds)
      : subTab === "received"
      ? byIds(receivedIds)
      : subTab === "sent"
      ? byIds(sentIds)
      : subTab === "mutual"
      ? byIds(mutualIds)
      : subTab === "rejected"
      ? byIds(rejectedIds)
      : subTab === "shortlisted"
      ? byIds(shortlistedIds)
      : subTab === "favorites"
      ? byIds(favoriteIds)
      : [];

  const handleOpenProfileFromItem = (id: string, name: string) => {
    const matched = allProfiles.find((p) => p.id === id || p.name.includes(name));
    if (matched) {
      onViewProfile(matched);
    } else if (allProfiles[0]) {
      onViewProfile(allProfiles[0]);
    }
  };

  const handleSendInterestFromItem = (id: string, name: string) => {
    const matched = allProfiles.find((p) => p.id === id || p.name.includes(name));
    if (matched) {
      setSendInterestTarget(matched);
    } else if (allProfiles[0]) {
      setSendInterestTarget(allProfiles[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
            Matches, Interests, Favorites &amp; Activity
          </h1>
          <p className="text-sm text-[#5C4740]">
            Track pending, accepted &amp; rejected interests, favorites, likes, revisits, and side-by-side comparison
          </p>
        </div>

        {compareIds.length >= 2 && (
          <Button
            type="button"
            onClick={() => setIsCompareOpen(true)}
            className="h-10 px-4 rounded-xl bg-saffron-gradient text-white font-bold text-xs shadow-saffron-sm self-start"
          >
            <Scale className="w-4 h-4 mr-1.5" />
            Compare Selected ({compareIds.length}/3)
          </Button>
        )}
      </div>

      {/* Horizontal Swipeable Sub-Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSubTab(t.id)}
            className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border transition-all ${
              subTab === t.id
                ? "bg-[#3B0A18] text-amber-100 border-[#3B0A18] shadow-sm"
                : "bg-white text-[#5C4740] border-amber-200 hover:border-[#FF7700]"
            }`}
          >
            <span>{t.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                subTab === t.id
                  ? "bg-amber-400 text-[#2B120C]"
                  : "bg-amber-100 text-[#EA580C]"
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* FEATURE 20: Viewed Profiles Tab */}
      {subTab === "viewed_profiles" && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-[#EA580C]" />
              <div>
                <h4 className="font-bold text-sm text-[#2B120C]">Recently Viewed Profiles</h4>
                <p className="text-xs text-[#5C4740]">
                  Profiles you inspected recently. You can quickly reconnect, shortlist, or send an interest.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-[#7C2D12] rounded-full">
              {viewedProfiles.length} Profiles
            </span>
          </div>

          {viewedProfiles.length === 0 ? (
            <div className="rounded-3xl bg-white border border-amber-200 p-10 text-center space-y-2">
              <Eye className="w-10 h-10 text-amber-400 mx-auto" />
              <p className="font-serif-royal text-xl font-bold text-[#2B120C]">No Viewed Profiles Yet</p>
              <p className="text-sm text-[#5C4740]">
                Explore Smart Matches or Advanced Search to discover and view verified profiles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {viewedProfiles.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={item.viewerAvatar}
                      alt={item.viewerName}
                      className="w-16 h-16 rounded-xl object-cover object-top border border-amber-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-serif-royal text-base font-bold text-[#2B120C] truncate">
                          {item.viewerName}, {item.viewerAge}
                        </h3>
                        <span className="text-[10px] text-[#8C6D62] flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3 text-amber-500" />
                          {item.viewedAt}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#EA580C] truncate mt-0.5">
                        {item.viewerProfession}
                      </p>
                      <p className="text-xs text-[#785C52] flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                        {item.viewerCity} • {item.viewerCaste}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-amber-100">
                    <Button
                      size="sm"
                      onClick={() => handleRevisitProfile(item.viewerId, item.viewerName)}
                      className="flex-1 rounded-xl bg-saffron-gradient text-white text-xs font-bold h-8"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      Revisit Profile
                      {revisitCounts[item.viewerId] ? ` (${revisitCounts[item.viewerId]}x)` : ""}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendInterestFromItem(item.viewerId, item.viewerName)}
                      className="rounded-xl border-amber-300 text-[#3B0A18] hover:bg-amber-50 text-xs font-semibold h-8 px-3"
                    >
                      <Heart className="w-3.5 h-3.5 mr-1 text-[#EA580C]" />
                      Interest
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FEATURE #17: Who Liked My Profile Tab */}
      {subTab === "who_liked_me" && (
        <div className="space-y-4">
          <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ThumbsUp className="w-5 h-5 text-rose-600" />
              <div>
                <h4 className="font-bold text-sm text-[#2B120C]">Who Liked My Profile</h4>
                <p className="text-xs text-[#5C4740]">
                  Members who liked and appreciated your profile. Like back for an instant Mutual Like!
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-rose-100 text-rose-800 rounded-full">
              {whoLikedMe.length} Likes
            </span>
          </div>

          {whoLikedMe.length === 0 ? (
            <div className="rounded-3xl bg-white border border-amber-200 p-10 text-center space-y-2">
              <ThumbsUp className="w-10 h-10 text-rose-400 mx-auto" />
              <p className="font-serif-royal text-xl font-bold text-[#2B120C]">No Likes Received Yet</p>
              <p className="text-sm text-[#5C4740]">
                Keep your profile photo and bio updated to attract more profile likes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {whoLikedMe.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={item.likerAvatar}
                      alt={item.likerName}
                      className="w-16 h-16 rounded-xl object-cover object-top border border-amber-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-serif-royal text-base font-bold text-[#2B120C] truncate">
                          {item.likerName}, {item.likerAge}
                        </h3>
                        {item.isMutualLike && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold shrink-0">
                            Mutual Like ♥
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-[#EA580C] truncate mt-0.5">
                        {item.likerProfession}
                      </p>
                      <p className="text-xs text-[#785C52] flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                        {item.likerCity} • {item.likerCaste}
                      </p>
                      <p className="text-[10px] text-[#8C6D62] mt-1">Liked {item.likedAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-amber-100">
                    <Button
                      size="sm"
                      onClick={() => handleLikeBack(item.likerId, item.likerName)}
                      className={`flex-1 rounded-xl text-xs font-bold h-8 ${
                        item.isMutualLike
                          ? "bg-rose-600 hover:bg-rose-700 text-white"
                          : "bg-saffron-gradient text-white"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5 mr-1" />
                      {item.isMutualLike ? "Liked Back ✓" : "Like Back"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendInterestFromItem(item.likerId, item.likerName)}
                      className="rounded-xl border-amber-300 text-[#3B0A18] hover:bg-amber-50 text-xs font-semibold h-8 px-2.5"
                    >
                      <Heart className="w-3.5 h-3.5 mr-1 text-[#EA580C]" />
                      Interest
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRevisitProfile(item.likerId, item.likerName)}
                      className="rounded-xl text-[#5C4740] h-8 px-2"
                      title="Revisit Profile"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FEATURE 21: Who Viewed My Profile Tab */}
      {subTab === "who_viewed_me" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-[#EA580C]" />
              <div>
                <h4 className="font-bold text-sm text-[#2B120C]">Profile Visitors (Who Viewed Me)</h4>
                <p className="text-xs text-[#5C4740]">
                  Members who actively opened and explored your matrimonial dossier.
                </p>
              </div>
            </div>
            {!isVipMember && (
              <span className="px-3 py-1 rounded-full bg-amber-400 text-[#2B120C] text-xs font-bold flex items-center gap-1 self-start sm:self-auto">
                <Crown className="w-3.5 h-3.5" />
                VIP Member Privilege
              </span>
            )}
          </div>

          {whoViewedMe.length === 0 ? (
            <div className="rounded-3xl bg-white border border-amber-200 p-10 text-center space-y-2">
              <Users className="w-10 h-10 text-amber-400 mx-auto" />
              <p className="font-serif-royal text-xl font-bold text-[#2B120C]">No Profile Visitors Yet</p>
              <p className="text-sm text-[#5C4740]">
                Boost your profile or complete all 6 dossier steps to increase your daily visitor views.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {whoViewedMe.map((item, index) => {
                const isMaskedForFree = !isVipMember && index >= 2;
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    {isMaskedForFree && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 text-center space-y-2">
                        <Lock className="w-7 h-7 text-amber-500" />
                        <p className="font-bold text-xs text-[#2B120C]">
                          Upgrade to Gold Royal to unlock full visitor identity
                        </p>
                      </div>
                    )}

                    <div className="flex items-start gap-3.5">
                      <img
                        src={item.viewerAvatar}
                        alt={item.viewerName}
                        className="w-16 h-16 rounded-xl object-cover object-top border border-amber-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-serif-royal text-base font-bold text-[#2B120C] truncate">
                            {item.viewerName}, {item.viewerAge}
                          </h3>
                          <span className="text-[10px] text-[#8C6D62] flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3 text-emerald-600" />
                            {item.viewedAt}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#EA580C] truncate mt-0.5">
                          {item.viewerProfession}
                        </p>
                        <p className="text-xs text-[#785C52] flex items-center gap-1 mt-1 truncate">
                          <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                          {item.viewerCity} • {item.viewerCaste}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 mt-3 border-t border-amber-100">
                      <Button
                        size="sm"
                        onClick={() => handleOpenProfileFromItem(item.viewerId, item.viewerName)}
                        className="flex-1 rounded-xl bg-saffron-gradient text-white text-xs font-bold h-8"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View Profile
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendInterestFromItem(item.viewerId, item.viewerName)}
                        className="rounded-xl border-amber-300 text-[#3B0A18] hover:bg-amber-50 text-xs font-semibold h-8 px-3"
                      >
                        <Heart className="w-3.5 h-3.5 mr-1 text-[#EA580C]" />
                        Connect
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* FEATURE 22: Who Shortlisted Me Tab */}
      {subTab === "who_shortlisted_me" && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bookmark className="w-5 h-5 text-[#EA580C] fill-current" />
              <div>
                <h4 className="font-bold text-sm text-[#2B120C]">Who Shortlisted Me</h4>
                <p className="text-xs text-[#5C4740]">
                  Members who saved your profile in their favourites list. High likelihood of mutual interest!
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-[#7C2D12] rounded-full">
              {whoShortlistedMe.length} Members
            </span>
          </div>

          {whoShortlistedMe.length === 0 ? (
            <div className="rounded-3xl bg-white border border-amber-200 p-10 text-center space-y-2">
              <Bookmark className="w-10 h-10 text-amber-400 mx-auto" />
              <p className="font-serif-royal text-xl font-bold text-[#2B120C]">No Shortlists Yet</p>
              <p className="text-sm text-[#5C4740]">
                When prospective matches shortlist your profile for marriage talks, they will be listed here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {whoShortlistedMe.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={item.targetAvatar}
                      alt={item.targetName}
                      className="w-16 h-16 rounded-xl object-cover object-top border border-amber-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-serif-royal text-base font-bold text-[#2B120C] truncate">
                          {item.targetName}, {item.targetAge}
                        </h3>
                        {item.matchScore && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700 shrink-0">
                            <Sparkles className="w-2.5 h-2.5" />
                            {item.matchScore}% Match
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-[#EA580C] truncate mt-0.5">
                        {item.targetProfession}
                      </p>
                      <p className="text-xs text-[#785C52] flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                        {item.targetCity} • {item.targetCaste}
                      </p>
                      <p className="text-[11px] text-[#8C6D62] mt-1 flex items-center gap-1">
                        <Bookmark className="w-3 h-3 text-[#EA580C] fill-current" />
                        Shortlisted {item.shortlistedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-amber-100">
                    <Button
                      size="sm"
                      onClick={() => handleOpenProfileFromItem(item.userId, item.targetName)}
                      className="flex-1 rounded-xl bg-saffron-gradient text-white text-xs font-bold h-8"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View Dossier
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendInterestFromItem(item.userId, item.targetName)}
                      className="rounded-xl border-amber-300 text-[#3B0A18] hover:bg-amber-50 text-xs font-semibold h-8 px-3"
                    >
                      <Heart className="w-3.5 h-3.5 mr-1 text-[#EA580C]" />
                      Express Interest
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contact Requests Tab */}
      {subTab === "contact_requests" && (
        <div className="space-y-3">
          {contactRequests.length === 0 ? (
            <div className="rounded-3xl bg-white border border-amber-200 p-10 text-center space-y-2">
              <Phone className="w-10 h-10 text-amber-400 mx-auto" />
              <p className="font-serif-royal text-xl font-bold text-[#2B120C]">
                No Contact Requests
              </p>
              <p className="text-sm text-[#5C4740]">
                When verified VIP members request your direct phone number or WhatsApp, they will appear here for your explicit consent.
              </p>
            </div>
          ) : (
            contactRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={req.requesterAvatar}
                    alt={req.requesterName}
                    className="w-14 h-14 rounded-full object-cover border border-amber-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
                        {req.requesterName}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-[#7C2D12] text-[11px] font-bold">
                        {req.vipTier}
                      </span>
                    </div>
                    <p className="text-xs text-[#5C4740] mt-0.5">
                      Requested unmasked phone &amp; WhatsApp on {req.requestedAt}
                    </p>
                  </div>
                </div>

                {req.status === "pending" ? (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApproveContact(req.id, req.requesterName)}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-4"
                    >
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                      Approve &amp; Share
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeclineContact(req.id, req.requesterName)}
                      className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold text-xs h-9 px-3.5"
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      Decline
                    </Button>
                  </div>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      req.status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {req.status === "approved" ? "Shared ✓" : "Declined ✗"}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Photo Access Requests Tab */}
      {subTab === "photo_requests" && (
        <div className="space-y-3">
          {photoRequests.length === 0 ? (
            <div className="rounded-3xl bg-white border border-amber-200 p-10 text-center space-y-2">
              <ImageIcon className="w-10 h-10 text-amber-400 mx-auto" />
              <p className="font-serif-royal text-xl font-bold text-[#2B120C]">
                No Photo Access Requests
              </p>
              <p className="text-sm text-[#5C4740]">
                If your photos are set to "Request Access Only", incoming permissions to unblur will appear here.
              </p>
            </div>
          ) : (
            photoRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={req.requesterAvatar}
                    alt={req.requesterName}
                    className="w-14 h-14 rounded-full object-cover border border-amber-200"
                  />
                  <div>
                    <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
                      {req.requesterName}
                    </h3>
                    <p className="text-xs text-[#5C4740] italic mt-0.5">
                      "{req.reason}"
                    </p>
                    <p className="text-[11px] text-[#8C6D62] mt-0.5">
                      Requested {req.requestedAt}
                    </p>
                  </div>
                </div>

                {req.status === "pending" ? (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprovePhoto(req.id, req.requesterName)}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-4"
                    >
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                      Grant Photo Access
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeclinePhoto(req.id, req.requesterName)}
                      className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold text-xs h-9 px-3.5"
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      Decline
                    </Button>
                  </div>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      req.status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {req.status === "approved" ? "Access Granted ✓" : "Declined ✗"}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Profiles List for Pending, Received, Sent, Mutual, Rejected, Shortlisted, Favorites */}
      {subTab !== "contact_requests" &&
        subTab !== "photo_requests" &&
        subTab !== "viewed_profiles" &&
        subTab !== "who_viewed_me" &&
        subTab !== "who_shortlisted_me" &&
        subTab !== "who_liked_me" && (
          <>
            {activeList.length === 0 ? (
              <div className="rounded-3xl bg-white border border-amber-200 p-10 text-center space-y-2">
                <Heart className="w-10 h-10 text-amber-400 mx-auto" />
                <p className="font-serif-royal text-xl font-bold text-[#2B120C]">
                  No profiles in this list yet
                </p>
                <p className="text-sm text-[#5C4740]">
                  Explore Smart Matches or Advanced Search to discover and connect with profiles.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeList.map((profile) => {
                  const isIncomingPending = receivedIds.includes(profile.id);
                  const isSentPending = sentIds.includes(profile.id);
                  const isFav = favoriteIds.includes(profile.id);
                  const isCompared = compareIds.includes(profile.id);

                  return (
                    <div
                      key={profile.id}
                      className={`bg-white rounded-2xl border p-4 shadow-sm flex flex-col sm:flex-row gap-4 transition-all ${
                        isCompared ? "border-[#EA580C] ring-2 ring-[#EA580C]/20" : "border-amber-200/80"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={profile.photos[0]}
                          alt={profile.name}
                          onClick={() => handleRevisitProfile(profile.id, profile.name)}
                          className="w-full sm:w-28 h-48 sm:h-32 rounded-xl object-cover object-top cursor-pointer"
                        />
                        <label
                          className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 border border-amber-300 text-[10px] font-bold text-[#3B0A18] cursor-pointer shadow-xs"
                          title="Select for Side-by-Side Comparison"
                        >
                          <input
                            type="checkbox"
                            checked={isCompared}
                            onChange={() => toggleCompare(profile.id)}
                            className="accent-[#EA580C] w-3 h-3"
                          />
                          Compare
                        </label>
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0 space-y-3">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-serif-royal text-lg font-bold text-[#2B120C] truncate">
                              {profile.name}, {profile.age}
                            </h3>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-[#EA580C] shrink-0">
                              <Sparkles className="w-3 h-3" />
                              {profile.kundliScore}/36
                            </span>
                          </div>

                          {/* Direction / Status Tags for Pending & Rejected Tabs */}
                          {subTab === "pending" && (
                            <div className="flex gap-1.5 mt-1">
                              {isIncomingPending && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                  Incoming Pending Request
                                </span>
                              )}
                              {isSentPending && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                                  Sent • Awaiting Reply
                                </span>
                              )}
                            </div>
                          )}
                          {subTab === "rejected" && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                              <Ban className="w-2.5 h-2.5" />
                              Declined / Rejected Interest
                            </span>
                          )}

                          <p className="text-sm font-medium text-[#4E342E] truncate mt-0.5">
                            {profile.profession}
                          </p>
                          <p className="text-xs text-[#785C52] flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-[#EA580C]" />
                            {profile.city}, {profile.state} • {profile.caste}
                          </p>
                        </div>

                        {/* Tab-Specific Actions */}
                        <div className="flex flex-wrap gap-2">
                          {(subTab === "received" || (subTab === "pending" && isIncomingPending)) && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => onAcceptReceived(profile)}
                                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 px-3.5"
                              >
                                <Check className="w-3.5 h-3.5 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onDeclineReceived(profile)}
                                className="rounded-lg border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold h-9 px-3.5"
                              >
                                <X className="w-3.5 h-3.5 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}

                          {(subTab === "sent" || (subTab === "pending" && isSentPending && !isIncomingPending)) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onWithdrawSent(profile)}
                              className="rounded-lg border-amber-300 text-[#3B0A18] text-xs font-semibold h-9 px-3.5"
                            >
                              Withdraw Interest
                            </Button>
                          )}

                          {subTab === "rejected" && onReconsiderRejected && (
                            <Button
                              size="sm"
                              onClick={() => onReconsiderRejected(profile)}
                              className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 px-3.5"
                            >
                              <RotateCcw className="w-3.5 h-3.5 mr-1" />
                              Reconsider &amp; Accept
                            </Button>
                          )}

                          {subTab === "mutual" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => onOpenChat(profile.id)}
                                className="rounded-lg bg-saffron-gradient text-white text-xs font-semibold h-9 px-4"
                              >
                                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                                Chat Now
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setContactTarget(profile)}
                                className="rounded-lg border-amber-300 bg-amber-50/70 text-[#3B0A18] text-xs font-semibold h-9 px-3.5"
                              >
                                <Phone className="w-3.5 h-3.5 mr-1 text-[#EA580C]" />
                                Request Contact
                              </Button>
                            </>
                          )}

                          {subTab === "shortlisted" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onToggleShortlist(profile)}
                              className="rounded-lg border-amber-300 text-[#3B0A18] text-xs font-semibold h-9 px-3.5"
                            >
                              <Bookmark className="w-3.5 h-3.5 mr-1 fill-current text-[#EA580C]" />
                              Remove Shortlist
                            </Button>
                          )}

                          {subTab === "favorites" && onToggleFavorite && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => setSendInterestTarget(profile)}
                                className="rounded-lg bg-saffron-gradient text-white text-xs font-semibold h-9 px-3.5"
                              >
                                <Heart className="w-3.5 h-3.5 mr-1" />
                                Send Interest
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onToggleFavorite(profile)}
                                className="rounded-lg border-amber-300 text-[#3B0A18] text-xs font-semibold h-9 px-3"
                              >
                                <Star className="w-3.5 h-3.5 mr-1 fill-amber-400 text-amber-500" />
                                Unfavorite
                              </Button>
                            </>
                          )}

                          {subTab !== "favorites" && onToggleFavorite && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onToggleFavorite(profile)}
                              className="rounded-lg text-xs font-semibold text-amber-700 h-9 px-2.5"
                              title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                            >
                              <Star
                                className={`w-3.5 h-3.5 ${
                                  isFav ? "fill-amber-400 text-amber-500" : "text-amber-500"
                                }`}
                              />
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRevisitProfile(profile.id, profile.name)}
                            className="rounded-lg text-xs font-semibold text-[#5C4740] h-9 px-3"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            {revisitCounts[profile.id] ? `Revisit (${revisitCounts[profile.id]}x)` : "Revisit"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      {/* Side-by-Side Profile Comparison Modal (#20) */}
      <ProfileComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        profileIds={compareIds}
      />

      {/* Send Interest Modal */}
      {sendInterestTarget && (
        <SendInterestModal
          open={!!sendInterestTarget}
          onOpenChange={(open) => !open && setSendInterestTarget(null)}
          recipientId={sendInterestTarget.id}
          recipientName={sendInterestTarget.name}
          onSuccess={() => {
            toast({
              title: "Interest Sent",
              description: `Your formal interest has been dispatched to ${sendInterestTarget.name}.`,
            });
            setSendInterestTarget(null);
          }}
        />
      )}

      {/* Request Contact Modal */}
      {contactTarget && (
        <RequestContactModal
          open={!!contactTarget}
          onOpenChange={(open) => !open && setContactTarget(null)}
          recipientId={contactTarget.id}
          recipientName={contactTarget.name}
          isVipMember={isVipMember}
        />
      )}
    </div>
  );
};

