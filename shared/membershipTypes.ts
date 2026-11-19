/**
 * Membership Plans & Monetization Types
 * 100% English. Enterprise Grade.
 */

export type MembershipTier =
  | "free"
  | "silver"
  | "gold"
  | "diamond"
  | "assisted"
  | (string & {});

export interface MembershipPlan {
  id: string;
  name: string;
  badge?: string;
  durationMonths: number;
  durationLabel: string;
  price: number;
  priceDisplay: string;
  originalPrice: number;
  originalPriceDisplay: string;
  discountLabel: string;
  contactsQuota: number; // 0 for free, 25 for silver, 75 for gold, 150 for diamond, 9999 for assisted
  features: string[];
  recommended?: boolean;
  isActive?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserMembershipRecord {
  userId: string;
  tier: MembershipTier;
  tierName: string;
  status: "active" | "expired" | "free";
  startedAt?: string;
  expiresAt?: string;
  contactsTotalQuota: number;
  contactsUsedCount: number;
  contactsRemaining: number;
  relationshipManager?: {
    name: string;
    phone: string;
    email: string;
  };
}

export type PaymentMethod =
  | "upi"
  | "gpay"
  | "phonepe"
  | "paytm"
  | "bank_transfer"
  | "cash_deposit";

export interface MembershipPurchaseRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userMobile: string;
  profileId?: string;
  planId: MembershipTier;
  planName: string;
  durationLabel: string;
  amount: number;
  amountDisplay: string;
  paymentMethod: PaymentMethod;
  utrNumber: string; // 12-digit UPI reference or bank txn ID
  paymentDate: string;
  screenshotUrl?: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt: string;
}

export const OFFICIAL_MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "silver",
    name: "Silver Connect",
    badge: "Starter Value",
    durationMonths: 3,
    durationLabel: "3 Months",
    price: 2499,
    priceDisplay: "₹2,499",
    originalPrice: 3999,
    originalPriceDisplay: "₹3,999",
    discountLabel: "38% OFF",
    contactsQuota: 25,
    isActive: true,
    displayOrder: 1,
    features: [
      "View 25 Verified Phone Numbers & WhatsApp",
      "Send Unlimited Chat Messages with Matches",
      "In-House 36-Guna Kundli Milan Reports",
      "Standard Search Listing (2X Visibility)",
      "Govt ID Verified Shield Badge",
    ],
  },
  {
    id: "gold",
    name: "Gold Royal",
    badge: "Most Popular 🔥",
    durationMonths: 6,
    durationLabel: "6 Months",
    price: 4999,
    priceDisplay: "₹4,999",
    originalPrice: 8499,
    originalPriceDisplay: "₹8,499",
    discountLabel: "42% OFF",
    contactsQuota: 75,
    recommended: true,
    isActive: true,
    displayOrder: 2,
    features: [
      "View 75 Verified Phone Numbers & WhatsApp",
      "Direct Call & WhatsApp Unmasking Access",
      "Unlimited Kundli Compatibility & PDF Certificates",
      "Featured Top-of-Search Placement (5X Boost)",
      "Photo Shield™ Privacy Protection",
      "Priority Customer Support via WhatsApp",
    ],
  },
  {
    id: "diamond",
    name: "Diamond VIP",
    badge: "Royal Elite 👑",
    durationMonths: 12,
    durationLabel: "12 Months (1 Year)",
    price: 8999,
    priceDisplay: "₹8,999",
    originalPrice: 15999,
    originalPriceDisplay: "₹15,999",
    discountLabel: "44% OFF",
    contactsQuota: 150,
    isActive: true,
    displayOrder: 3,
    features: [
      "View 150 Verified Phone Numbers & WhatsApp",
      "Standout Diamond VIP Crown on Profile",
      "Unlimited Astrological Kundli Matching & PDFs",
      "Incognito Mode: Browse Profiles Secretly",
      "View Locked / Private Photo Albums with Priority",
      "Astrologer Horoscope Guidance Consultation",
    ],
  },
  {
    id: "assisted",
    name: "Assisted Matchmaking",
    badge: "Concierge Matrimony ⭐",
    durationMonths: 12,
    durationLabel: "12 Months Personalized",
    price: 19999,
    priceDisplay: "₹19,999",
    originalPrice: 34999,
    originalPriceDisplay: "₹34,999",
    discountLabel: "43% OFF",
    contactsQuota: 9999, // Unlimited
    isActive: true,
    displayOrder: 4,
    features: [
      "Dedicated Senior Relationship Manager (RM)",
      "Handpicked & Family-Screened Alliances weekly",
      "RM Coordinates Family Calls & Video Introductions",
      "Unlimited Verified Contact Access",
      "Complete Confidentiality & VIP Background Checks",
      "Complete Kundli & Astrological Compatibility Check by RM",
    ],
  },
];

export const OFFICIAL_BANK_DETAILS = {
  accountName: "Vivah Kar Lo Matrimonial Services Pvt Ltd",
  bankName: "ICICI Bank Ltd",
  accountNumber: "50200084729182",
  ifscCode: "ICIC0000042",
  branch: "Connaught Place, New Delhi",
  accountType: "Current Account",
  upiId: "vivahkarlo@icici",
  qrCodeUrl: "/1.jpg",
  supportPhone: "+91 98765 43210",
  supportEmail: "billing@vivahkarlo.com",
};
