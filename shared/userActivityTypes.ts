/**
 * User Activity, Support, Feedback & Engagement Types
 * 100% English. Enterprise Grade.
 */

export interface ProfileViewItem {
  id: string;
  viewerId: string;
  viewerName: string;
  viewerAvatar: string;
  viewerAge: number;
  viewerCity: string;
  viewerProfession: string;
  viewerCaste: string;
  viewedUserId: string;
  viewedAt: string;
  isMutualMatch?: boolean;
}

export interface ShortlistItem {
  id: string;
  userId: string;
  targetUserId: string;
  targetName: string;
  targetAvatar: string;
  targetAge: number;
  targetCity: string;
  targetProfession: string;
  targetCaste: string;
  shortlistedAt: string;
  matchScore?: number;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  category: "billing" | "matchmaking" | "profile_verification" | "privacy" | "technical" | "general";
  subject: string;
  message: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  adminReply?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFeedback {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number; // 1 to 5
  category: "general_feedback" | "bug_report" | "profile_quality" | "feature_request" | "complaint";
  title: string;
  description: string;
  status: "new" | "reviewed" | "addressed";
  adminNotes?: string;
  createdAt: string;
}

export interface WhatsAppNotificationPreferences {
  userId: string;
  mobile: string;
  matchesAlerts: boolean;
  interestAlerts: boolean;
  chatAlerts: boolean;
  dailyDigest: boolean;
  promotions: boolean;
  updatedAt: string;
}

export interface SubscriptionInvoice {
  id: string;
  invoiceNumber: string;
  planId: string;
  planName: string;
  durationLabel: string;
  amount: number;
  amountDisplay: string;
  paymentMethod: string;
  utrNumber: string;
  status: "active" | "approved" | "pending" | "rejected";
  paymentDate: string;
  downloadUrl?: string;
}

export interface FAQCategory {
  category: string;
  items: {
    question: string;
    answer: string;
  }[];
}

export const OFFICIAL_PLATFORM_FAQS: FAQCategory[] = [
  {
    category: "Profile Verification & KYC",
    items: [
      {
        question: "How do I get the official Green Shield Verified Badge?",
        answer: "Upload a clear government-issued identity proof (Aadhaar Card, Passport, Voter ID, or Driving License) in the 'Trust & Safety' section. Our compliance desk manually verifies document validity within 1-2 hours and awards the Green Shield.",
      },
      {
        question: "Is my Aadhaar or Government ID safe and visible to other users?",
        answer: "No. Your identification documents are strictly confidential, encrypted with AES-256, and never visible to other members. Only verified admin compliance officers inspect the document for authenticity.",
      },
      {
        question: "How do I earn the 'Verified Income / Govt Job' badge?",
        answer: "Upload your latest official salary slip, Form 16, or government appointment letter under Employment Verification. Once validated, your profile showcases the Verified Career badge.",
      },
    ],
  },
  {
    category: "Privacy & Photo Protection",
    items: [
      {
        question: "What is Photo Shield™ and how does it prevent screenshot abuse?",
        answer: "Photo Shield applies dynamic, translucent user-specific watermarks across your uploaded images, rendering screenshots non-reusable and discouraging unauthorized sharing.",
      },
      {
        question: "Can I hide my phone number from non-premium or unapproved members?",
        answer: "Yes. By default, your contact number is masked (+91 98*** *****). Only users with an active VIP plan whose interest you have mutually accepted can unmask your verified phone number.",
      },
      {
        question: "How do I set my photo album to private or blurred?",
        answer: "Navigate to 'Trust & Safety Shield' > 'Photo Visibility' and select 'Blur Photo with Request Access'. Other members must send a formal Photo Access Request which you can approve or decline.",
      },
    ],
  },
  {
    category: "Vedic Kundli Milan & Astrological Matching",
    items: [
      {
        question: "How does the in-house 36-Guna Kundli Milan system work?",
        answer: "Our proprietary Vedic astrology engine computes complete Ashtakoot compatibility (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi) using exact Moon signs and Nakshatras. It also detects Manglik Dosha and validates classical Nadi and Bhakoot parihara cancellations.",
      },
      {
        question: "Can I download and print a full color Kundli Match Report PDF?",
        answer: "Yes! Active VIP members can view and download high-resolution vector PDF match certificates with royal borders, auspicious emblems, and in-depth planetary breakdown.",
      },
    ],
  },
  {
    category: "VIP Membership & Monetization",
    items: [
      {
        question: "How do I activate a VIP membership plan via UPI or Bank Transfer?",
        answer: "Select your preferred plan (Silver, Gold Royal, Diamond VIP, or Assisted), send the exact amount to our official ICICI Bank Account or UPI ID vivahkarlo@icici, and enter your 12-digit UTR transaction reference number. Admin approves and activates your plan within 1-2 hours.",
      },
      {
        question: "What are Contact Credits and how do they work?",
        answer: "Each VIP tier includes a quota of verified contact views (e.g., 75 for Gold, 150 for Diamond). Viewing an unmasked contact number consumes 1 credit. Once unmasked, that contact remains accessible to you without consuming further credits.",
      },
      {
        question: "What is the Assisted Matchmaking tier?",
        answer: "Assisted Matchmaking assigns a dedicated Senior Relationship Manager (RM) who personally handpicks alliances, conducts confidential family background screenings, and arranges formal family calls.",
      },
    ],
  },
];
