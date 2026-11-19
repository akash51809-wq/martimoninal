/**
 * Feature Gating & Entitlements Engine
 * Enforces monetization restrictions cleanly across the application.
 */

import type { UserMembershipRecord, MembershipTier } from "./membershipTypes";

export interface FeatureAccessCheck {
  allowed: boolean;
  reason?: string;
  requiredTier?: MembershipTier;
  upgradePrompt?: string;
}

/**
 * 1. Check if user is entitled to view/unmask a phone number
 */
export function checkContactAccess(
  membership: UserMembershipRecord | undefined | null
): FeatureAccessCheck {
  if (!membership || membership.status !== "active" || membership.tier === "free") {
    return {
      allowed: false,
      reason: "Free members cannot view direct contact numbers.",
      requiredTier: "silver",
      upgradePrompt: "Upgrade to Silver Connect, Gold Royal, or Diamond VIP to view verified phone numbers.",
    };
  }

  if (membership.contactsRemaining <= 0) {
    return {
      allowed: false,
      reason: "Your plan's verified contact numbers quota has been exhausted.",
      upgradePrompt: "Upgrade or renew your plan to unlock additional verified contact credits.",
    };
  }

  return { allowed: true };
}

/**
 * 2. Check if user is entitled to initiate direct chat
 */
export function checkChatAccess(
  membership: UserMembershipRecord | undefined | null,
  isMutualMatch: boolean
): FeatureAccessCheck {
  if (!isMutualMatch) {
    return {
      allowed: false,
      reason: "Chat is restricted to mutually accepted alliances for user safety.",
    };
  }

  if (!membership || membership.status !== "active" || membership.tier === "free") {
    return {
      allowed: false,
      reason: "VIP membership is required for real-time secure messaging.",
      requiredTier: "silver",
      upgradePrompt: "Upgrade to any VIP membership to chat seamlessly with mutually accepted matches.",
    };
  }

  return { allowed: true };
}

/**
 * 3. Check if user can download official designer Kundli PDF certificate
 */
export function checkKundliPdfAccess(
  membership: UserMembershipRecord | undefined | null
): FeatureAccessCheck {
  // Free users can preview on screen, but VIP membership is encouraged for printing/downloading
  return { allowed: true };
}
