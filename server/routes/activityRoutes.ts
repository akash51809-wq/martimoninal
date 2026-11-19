import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { dbService } from "../databaseService";
import { whatsappBaileysService } from "../services/whatsappBaileysService";

export const activityRouter = Router();

const recordViewSchema = z.object({
  viewerId: z.string().min(1, "Viewer ID required"),
  viewedUserId: z.string().min(1, "Viewed User ID required"),
  deviceType: z.string().optional(),
});

const toggleShortlistSchema = z.object({
  userId: z.string().min(1, "User ID required"),
  targetUserId: z.string().min(1, "Target User ID required"),
});

/**
 * 1. Record Profile View (Feature 20 & 21)
 */
activityRouter.post("/views/record", async (req: Request, res: Response) => {
  try {
    const { viewerId, viewedUserId, deviceType } = recordViewSchema.parse(req.body);
    const view = await dbService.recordProfileView(viewerId, viewedUserId, deviceType);
    res.json({ success: true, view });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Failed to record profile view",
    });
  }
});

/**
 * 2. Get Recently Viewed Profiles by User (Feature 20)
 */
activityRouter.get("/views/recent", (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ success: false, error: "User ID required" });
  }

  const views = dbService.getViewedProfiles(userId);
  res.json({ success: true, views, count: views.length });
});

/**
 * 3. Get Who Viewed My Profile / Profile Visitors (Feature 21)
 */
activityRouter.get("/views/visitors", (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ success: false, error: "User ID required" });
  }

  const visitors = dbService.getWhoViewedMyProfile(userId);
  res.json({ success: true, visitors, count: visitors.length });
});

/**
 * 4. Toggle Shortlist / Favourite (Feature 19 & 22)
 */
activityRouter.post("/shortlist/toggle", async (req: Request, res: Response) => {
  try {
    const { userId, targetUserId } = toggleShortlistSchema.parse(req.body);
    const result = await dbService.toggleShortlist(userId, targetUserId);
    res.json({
      success: true,
      shortlisted: result.shortlisted,
      message: result.shortlisted ? "Profile added to shortlist." : "Profile removed from shortlist.",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Failed to update shortlist",
    });
  }
});

/**
 * 5. Check if profile is shortlisted
 */
activityRouter.get("/shortlist/check", (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const targetUserId = req.query.targetUserId as string;
  if (!userId || !targetUserId) {
    return res.status(400).json({ success: false, error: "Both userId and targetUserId required" });
  }

  const shortlisted = dbService.isProfileShortlisted(userId, targetUserId);
  res.json({ success: true, shortlisted });
});

/**
 * 6. Get Shortlisted Profiles by User (Feature 19)
 */
activityRouter.get("/shortlist", (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ success: false, error: "User ID required" });
  }

  const shortlist = dbService.getShortlistedProfiles(userId);
  res.json({ success: true, shortlist, count: shortlist.length });
});

/**
 * 7. Get Who Shortlisted Me (Feature 22)
 */
activityRouter.get("/shortlist/who-shortlisted-me", (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ success: false, error: "User ID required" });
  }

  const members = dbService.getWhoShortlistedMe(userId);
  res.json({ success: true, members, count: members.length });
});

// ============================================================================
// EXTENDED ACTIVITY ENGINE: FAVORITES, LIKES, REVISIT & LIMITED UNDO LAST PASS
// ============================================================================

const favoriteStore = new Map<string, Set<string>>();
const likesGivenStore = new Map<string, Set<string>>();
const likesReceivedStore = new Map<
  string,
  Array<{
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
  }>
>();
const revisitStore = new Map<
  string,
  Array<{
    targetUserId: string;
    visitCount: number;
    lastVisitedAt: string;
    note?: string;
  }>
>();
const passStackStore = new Map<
  string,
  Array<{
    id: string;
    targetUserId: string;
    targetName: string;
    passedAt: string;
    reason?: string;
  }>
>();
const undoUsageStore = new Map<string, { dateKey: string; count: number }>();

const FREE_DAILY_UNDO_LIMIT = 3;

function getTodayDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getOrSeedLikesReceived(userId: string) {
  if (!likesReceivedStore.has(userId)) {
    likesReceivedStore.set(userId, [
      {
        id: `like-rec-${userId}-1`,
        likerId: "1",
        likerName: "Dr. Ananya Sen",
        likerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60",
        likerAge: 26,
        likerCity: "Mumbai, Maharashtra",
        likerProfession: "Doctor (BHMS)",
        likerCaste: "Hindu - Brahmin",
        likedAt: "Today, 09:20 AM",
        isMutualLike: false,
      },
      {
        id: `like-rec-${userId}-2`,
        likerId: "5",
        likerName: "Pooja Hegde",
        likerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60",
        likerAge: 27,
        likerCity: "Bangalore, Karnataka",
        likerProfession: "Architect & Interior Designer",
        likerCaste: "Hindu - Bunt",
        likedAt: "Yesterday, 06:15 PM",
        isMutualLike: true,
      },
      {
        id: `like-rec-${userId}-3`,
        likerId: "3",
        likerName: "Sneha Patil",
        likerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60",
        likerAge: 25,
        likerCity: "Pune, Maharashtra",
        likerProfession: "Fashion Designer",
        likerCaste: "Hindu - Maratha",
        likedAt: "2 days ago",
        isMutualLike: false,
      },
    ]);
  }
  return likesReceivedStore.get(userId)!;
}

const toggleTargetSchema = z.object({
  userId: z.string().min(1),
  targetUserId: z.string().min(1),
});

const passProfileSchema = z.object({
  userId: z.string().min(1),
  targetUserId: z.string().min(1),
  targetName: z.string().optional(),
  reason: z.string().optional(),
});

const undoPassSchema = z.object({
  userId: z.string().min(1),
  isVip: z.boolean().optional().default(false),
});

/**
 * 8. Toggle Favorite Profile (Feature #13 - Separate from Shortlist)
 */
activityRouter.post("/favorites/toggle", (req: Request, res: Response) => {
  try {
    const { userId, targetUserId } = toggleTargetSchema.parse(req.body);
    if (!favoriteStore.has(userId)) {
      favoriteStore.set(userId, new Set(["1", "2"]));
    }
    const set = favoriteStore.get(userId)!;
    let isFavorite = false;
    if (set.has(targetUserId)) {
      set.delete(targetUserId);
      isFavorite = false;
    } else {
      set.add(targetUserId);
      isFavorite = true;
    }
    res.json({
      success: true,
      isFavorite,
      favoriteIds: Array.from(set),
      message: isFavorite ? "Added to Favorites." : "Removed from Favorites.",
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

activityRouter.get("/favorites", (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || "usr-active-complete";
  if (!favoriteStore.has(userId)) {
    favoriteStore.set(userId, new Set(["1", "2"]));
  }
  const favoriteIds = Array.from(favoriteStore.get(userId)!);
  res.json({ success: true, favoriteIds, count: favoriteIds.length });
});

/**
 * 9. Toggle Like & Get Who Liked My Profile (Feature #17)
 */
activityRouter.post("/likes/toggle", (req: Request, res: Response) => {
  try {
    const { userId, targetUserId } = toggleTargetSchema.parse(req.body);
    if (!likesGivenStore.has(userId)) {
      likesGivenStore.set(userId, new Set(["5"]));
    }
    const set = likesGivenStore.get(userId)!;
    let liked = false;
    if (set.has(targetUserId)) {
      set.delete(targetUserId);
      liked = false;
    } else {
      set.add(targetUserId);
      liked = true;
    }

    // Update mutual flag in received likes if applicable
    const received = getOrSeedLikesReceived(userId);
    const matchingRec = received.find((r) => r.likerId === targetUserId);
    if (matchingRec) {
      matchingRec.isMutualLike = liked;
    }

    res.json({
      success: true,
      liked,
      likedIds: Array.from(set),
      isMutualLike: Boolean(matchingRec && liked),
      message: liked ? "Profile liked successfully." : "Like removed.",
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

activityRouter.get("/likes/received", (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || "usr-active-complete";
  const likes = getOrSeedLikesReceived(userId);
  res.json({ success: true, likes, count: likes.length });
});

/**
 * 10. Revisit Profile Tracker (Feature #18)
 */
activityRouter.post("/revisit", (req: Request, res: Response) => {
  try {
    const { userId, targetUserId } = toggleTargetSchema.parse(req.body);
    const note = typeof req.body.note === "string" ? req.body.note : undefined;
    if (!revisitStore.has(userId)) {
      revisitStore.set(userId, []);
    }
    const list = revisitStore.get(userId)!;
    const existing = list.find((r) => r.targetUserId === targetUserId);
    const now = new Date().toISOString();
    if (existing) {
      existing.visitCount += 1;
      existing.lastVisitedAt = now;
      if (note) existing.note = note;
    } else {
      list.unshift({ targetUserId, visitCount: 2, lastVisitedAt: now, note });
    }
    res.json({
      success: true,
      revisits: list,
      message: "Profile revisited and activity updated.",
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

activityRouter.get("/revisit", (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || "usr-active-complete";
  const revisits = revisitStore.get(userId) || [];
  res.json({ success: true, revisits, count: revisits.length });
});

/**
 * 11. Pass Profile & Undo Last Pass with Daily Quota Enforcement (Feature #19)
 */
activityRouter.post("/pass", (req: Request, res: Response) => {
  try {
    const { userId, targetUserId, targetName, reason } = passProfileSchema.parse(req.body);
    if (!passStackStore.has(userId)) {
      passStackStore.set(userId, []);
    }
    const stack = passStackStore.get(userId)!;
    // Prevent duplicate stacking for same profile
    const filtered = stack.filter((s) => s.targetUserId !== targetUserId);
    const entry = {
      id: `pass-${Date.now()}`,
      targetUserId,
      targetName: targetName || `Profile #${targetUserId}`,
      passedAt: new Date().toISOString(),
      reason,
    };
    filtered.push(entry);
    passStackStore.set(userId, filtered);

    res.json({
      success: true,
      passed: entry,
      stackSize: filtered.length,
      message: `${entry.targetName} skipped. You can undo your last pass anytime within your daily quota.`,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

activityRouter.get("/pass-status", (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || "usr-active-complete";
  const isVip = req.query.isVip === "true";
  const stack = passStackStore.get(userId) || [];
  const todayKey = getTodayDateKey();
  const usage = undoUsageStore.get(userId);
  const usedToday = usage && usage.dateKey === todayKey ? usage.count : 0;
  const remainingUndos = isVip ? 999 : Math.max(0, FREE_DAILY_UNDO_LIMIT - usedToday);

  res.json({
    success: true,
    stackSize: stack.length,
    lastPassed: stack.length > 0 ? stack[stack.length - 1] : null,
    passedProfileIds: stack.map((s) => s.targetUserId),
    undosUsedToday: usedToday,
    dailyLimit: isVip ? "Unlimited" : FREE_DAILY_UNDO_LIMIT,
    remainingUndos,
    isVip,
  });
});

activityRouter.post("/undo-pass", (req: Request, res: Response) => {
  try {
    const { userId, isVip } = undoPassSchema.parse(req.body);
    const stack = passStackStore.get(userId) || [];
    if (stack.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No recently passed profile available to undo.",
      });
    }

    const todayKey = getTodayDateKey();
    const usage = undoUsageStore.get(userId);
    const usedToday = usage && usage.dateKey === todayKey ? usage.count : 0;

    if (!isVip && usedToday >= FREE_DAILY_UNDO_LIMIT) {
      return res.status(403).json({
        success: false,
        limitReached: true,
        dailyLimit: FREE_DAILY_UNDO_LIMIT,
        undosUsedToday: usedToday,
        remainingUndos: 0,
        error: `Daily Undo Limit reached (${FREE_DAILY_UNDO_LIMIT}/${FREE_DAILY_UNDO_LIMIT} free undos used today). Upgrade to VIP for unlimited Undo Last Pass.`,
      });
    }

    const restored = stack.pop()!;
    passStackStore.set(userId, stack);
    const nextUsed = usedToday + 1;
    undoUsageStore.set(userId, { dateKey: todayKey, count: nextUsed });

    res.json({
      success: true,
      restoredProfile: restored,
      stackSize: stack.length,
      undosUsedToday: nextUsed,
      dailyLimit: isVip ? "Unlimited" : FREE_DAILY_UNDO_LIMIT,
      remainingUndos: isVip ? 999 : Math.max(0, FREE_DAILY_UNDO_LIMIT - nextUsed),
      message: `Restored ${restored.targetName} back to your active recommendations!`,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 12. REAL-TIME NOTIFICATIONS CENTER
// ============================================================================
interface UserNotificationItem {
  id: string;
  type: "interest" | "view" | "like" | "chat" | "security" | "membership";
  title: string;
  body: string;
  targetTab: string;
  createdAt: string;
  read: boolean;
}

const notificationStore = new Map<string, UserNotificationItem[]>();

function getOrSeedNotifications(userId: string): UserNotificationItem[] {
  if (!notificationStore.has(userId)) {
    const now = Date.now();
    notificationStore.set(userId, [
      {
        id: `ntf-${userId}-1`,
        type: "interest",
        title: "New Interest Received",
        body: "Dr. Ananya Sen (Mumbai, 31/36 Kundli Gunas) sent a formal family proposal.",
        targetTab: "interests",
        createdAt: new Date(now - 12 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: `ntf-${userId}-2`,
        type: "like",
        title: "Someone Liked Your Profile",
        body: "Pooja Hegde liked your profile. Like back for an instant Mutual Like!",
        targetTab: "interests",
        createdAt: new Date(now - 55 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: `ntf-${userId}-3`,
        type: "view",
        title: "3 Verified Members Viewed You",
        body: "Your profile was recently viewed by Dr. Aditya Joshi & 2 others today.",
        targetTab: "interests",
        createdAt: new Date(now - 3 * 3600 * 1000).toISOString(),
        read: false,
      },
      {
        id: `ntf-${userId}-4`,
        type: "chat",
        title: "New Message in Family Chat",
        body: "Shivani sent a message: 'Thank you for expressing interest!'",
        targetTab: "chat",
        createdAt: new Date(now - 5 * 3600 * 1000).toISOString(),
        read: false,
      },
      {
        id: `ntf-${userId}-5`,
        type: "security",
        title: "Security Alert: New Login Check",
        body: "Review your active devices & suspicious login monitor under Settings.",
        targetTab: "settings",
        createdAt: new Date(now - 18 * 3600 * 1000).toISOString(),
        read: true,
      },
    ]);
  }
  return notificationStore.get(userId)!;
}

activityRouter.get("/notifications", (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || "usr-active-complete";
  const notifications = getOrSeedNotifications(userId);
  const unreadCount = notifications.filter((n) => !n.read).length;
  res.json({ success: true, notifications, unreadCount });
});

activityRouter.post("/notifications/mark-read", (req: Request, res: Response) => {
  const { userId, notificationId, markAll } = req.body || {};
  const uid = String(userId || "usr-active-complete");
  const list = getOrSeedNotifications(uid);
  if (markAll) {
    for (const item of list) item.read = true;
  } else if (notificationId) {
    const found = list.find((n) => n.id === notificationId);
    if (found) found.read = true;
  }
  const unreadCount = list.filter((n) => !n.read).length;
  res.json({ success: true, notifications: list, unreadCount });
});

// ============================================================================
// 13. PROFILE STRENGTH & WEEKLY PERFORMANCE ANALYTICS
// ============================================================================
activityRouter.get("/analytics/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;
  const visitors = dbService.getWhoViewedMyProfile(userId);
  const shortlisters = dbService.getWhoShortlistedMe(userId);

  const weeklySeries = [
    { day: "Mon", views: 14, interests: 2 },
    { day: "Tue", views: 19, interests: 3 },
    { day: "Wed", views: 12, interests: 1 },
    { day: "Thu", views: 27, interests: 5 },
    { day: "Fri", views: 22, interests: 4 },
    { day: "Sat", views: 34, interests: 7 },
    { day: "Sun", views: 29 + visitors.length, interests: 6 },
  ];

  const totalWeeklyViews = weeklySeries.reduce((sum, d) => sum + d.views, 0);
  const totalWeeklyInterests = weeklySeries.reduce((sum, d) => sum + d.interests, 0);

  const topCities = [
    { city: "Mumbai", percentage: 34, count: Math.round(totalWeeklyViews * 0.34) },
    { city: "Pune", percentage: 28, count: Math.round(totalWeeklyViews * 0.28) },
    { city: "Bengaluru", percentage: 21, count: Math.round(totalWeeklyViews * 0.21) },
    { city: "Delhi NCR", percentage: 17, count: Math.round(totalWeeklyViews * 0.17) },
  ];

  const strengthChecklist = [
    { label: "Basic & Family Biodata Completed", done: true, weight: 25, targetTab: "profile" },
    { label: "Protected Profile Photos Uploaded", done: true, weight: 20, targetTab: "profile" },
    { label: "Government ID KYC Verified", done: true, weight: 20, targetTab: "kyc_privacy" },
    { label: "Partner Preferences & Dealbreakers Set", done: true, weight: 15, targetTab: "preferences" },
    { label: "Live Selfie Face Liveness Badge", done: false, weight: 10, targetTab: "kyc_privacy" },
    { label: "Corporate Email / LinkedIn Workplace Badge", done: false, weight: 10, targetTab: "kyc_privacy" },
  ];

  const strengthScore = strengthChecklist
    .filter((item) => item.done)
    .reduce((sum, item) => sum + item.weight, 0);

  res.json({
    success: true,
    analytics: {
      strengthScore,
      totalWeeklyViews,
      totalWeeklyInterests,
      shortlistedByCount: Math.max(4, shortlisters.length),
      responseRatePct: 86,
      weeklyGrowthPct: 24,
      weeklySeries,
      topCities,
      strengthChecklist,
      improvementTips: [
        "Complete Live Selfie Liveness verification to boost profile trust score by +15% and rank higher in searches.",
        "Link your Corporate Email or LinkedIn profile to earn the Verified Workplace Badge.",
        "Adding a structured 'My Family' & 'Marriage Vision' section increases interest acceptance by 2.3x.",
      ],
    },
  });
});

// ============================================================================
// 14. REFER & EARN PROGRAM (Friends & Relatives Referral Wallet)
// ============================================================================
interface ReferralEntry {
  id: string;
  inviteeName: string;
  inviteeContact: string;
  status: "Joined & Verified" | "Invited (Pending)";
  rewardCredits: number;
  couponEarned?: string;
  invitedAt: string;
}

interface ReferralWallet {
  referralCode: string;
  contactCreditsEarned: number;
  coupons: Array<{ code: string; discountPct: number; status: "Available" | "Redeemed" }>;
  history: ReferralEntry[];
}

const referralStore = new Map<string, ReferralWallet>();

function getOrSeedReferralWallet(userId: string): ReferralWallet {
  if (!referralStore.has(userId)) {
    const suffix = userId.replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase() || "2026";
    referralStore.set(userId, {
      referralCode: `VIVAH-${suffix}26`,
      contactCreditsEarned: 6,
      coupons: [
        { code: `REF20-${suffix}`, discountPct: 20, status: "Available" },
      ],
      history: [
        {
          id: `ref-${userId}-1`,
          inviteeName: "Rohan Deshmukh (Cousin)",
          inviteeContact: "+91 98220 *****",
          status: "Joined & Verified",
          rewardCredits: 3,
          couponEarned: `REF20-${suffix}`,
          invitedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        },
        {
          id: `ref-${userId}-2`,
          inviteeName: "Neha Kulkarni (Friend)",
          inviteeContact: "+91 98901 *****",
          status: "Joined & Verified",
          rewardCredits: 3,
          invitedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        },
      ],
    });
  }
  return referralStore.get(userId)!;
}

activityRouter.get("/referrals/:userId", (req: Request, res: Response) => {
  const wallet = getOrSeedReferralWallet(req.params.userId);
  res.json({ success: true, wallet });
});

activityRouter.post("/referrals/invite", async (req: Request, res: Response) => {
  try {
    const { userId, inviteeName, inviteeMobile, relation } = req.body || {};
    if (!userId || !inviteeName || !inviteeMobile) {
      return res.status(400).json({
        success: false,
        error: "Invitee name and 10-digit mobile number are required.",
      });
    }
    const cleanMobile = String(inviteeMobile).replace(/\D/g, "");
    if (cleanMobile.length < 10) {
      return res.status(400).json({ success: false, error: "Enter a valid 10-digit mobile number." });
    }

    const wallet = getOrSeedReferralWallet(userId);
    const masked = `+91 ${cleanMobile.slice(0, 5)} *****`;
    const newEntry: ReferralEntry = {
      id: `ref-${Date.now()}`,
      inviteeName: relation ? `${inviteeName} (${relation})` : inviteeName,
      inviteeContact: masked,
      status: "Invited (Pending)",
      rewardCredits: 3,
      invitedAt: new Date().toISOString(),
    };
    wallet.history.unshift(newEntry);

    // Attempt live Baileys WhatsApp invite dispatch
    const inviteMsg = `Namaste ${inviteeName}! You have been personally invited to join Vivah Kar Lo — India's trusted verified matrimony platform. Register using referral code *${wallet.referralCode}* to get priority verification & 20% VIP discount!`;
    const waLog = await whatsappBaileysService.sendMessage(cleanMobile, inviteMsg, "broadcast");

    res.status(201).json({
      success: true,
      entry: newEntry,
      wallet,
      deliveredViaWhatsApp: waLog.status === "sent_live_baileys",
      message:
        waLog.status === "sent_live_baileys"
          ? `Referral invite sent live on WhatsApp to ${inviteeName}! You'll earn +3 Contact Credits & a 20% VIP coupon once they verify.`
          : `Referral invite logged for ${inviteeName}! Share your code ${wallet.referralCode} on WhatsApp to unlock +3 Contact Credits.`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

activityRouter.post("/referrals/redeem-coupon", (req: Request, res: Response) => {
  const { userId, couponCode } = req.body || {};
  if (!userId || !couponCode) {
    return res.status(400).json({ success: false, error: "userId and couponCode required" });
  }
  const wallet = getOrSeedReferralWallet(userId);
  const coupon = wallet.coupons.find((c) => c.code === couponCode && c.status === "Available");
  if (!coupon) {
    return res.status(400).json({ success: false, error: "Coupon not found or already redeemed." });
  }
  coupon.status = "Redeemed";
  wallet.contactCreditsEarned += 2;
  res.json({
    success: true,
    wallet,
    message: `Coupon ${coupon.code} (${coupon.discountPct}% OFF VIP) applied to your checkout wallet + 2 Bonus Credits unlocked!`,
  });
});
