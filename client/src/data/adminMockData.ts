export interface KycRequestItem {
  id: string;
  userName: string;
  profileId: string;
  city: string;
  documentType: "Aadhaar Card + Selfie" | "Passport + Selfie" | "PAN + Video KYC";
  submittedAt: string;
  riskScore: "Low" | "Medium" | "High";
  status: "Pending" | "Approved" | "Rejected";
  avatar: string;
}

export interface PaymentTransaction {
  txnId: string;
  memberName: string;
  email: string;
  planName: string;
  amount: string;
  method: "UPI" | "Credit Card" | "NetBanking";
  status: "Paid" | "Pending" | "Refunded";
  date: string;
}

export interface PromoCoupon {
  code: string;
  discountLabel: string;
  usageCount: number;
  maxLimit: number;
  active: boolean;
  expiry: string;
}

export interface ModerationReport {
  id: string;
  reportedUser: string;
  reportedBy: string;
  reason: string;
  severity: "High" | "Medium" | "Low";
  status: "Open" | "Warned" | "Suspended" | "Dismissed";
  createdAt: string;
}

export interface AdminBroadcastLog {
  id: string;
  title: string;
  audience: string;
  channel: "Push + Email" | "Email Only" | "SMS + Push";
  sentAt: string;
  reachCount: number;
}

export interface AdminAuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

export const INITIAL_KYC_QUEUE: KycRequestItem[] = [
  {
    id: "kyc-101",
    userName: "Priya Kulkarni",
    profileId: "#000012",
    city: "Pune, Maharashtra",
    documentType: "Aadhaar Card + Selfie",
    submittedAt: "10 mins ago",
    riskScore: "Low",
    status: "Pending",
    avatar:
      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "kyc-102",
    userName: "Rohan Verma",
    profileId: "#000014",
    city: "Delhi NCR",
    documentType: "Passport + Selfie",
    submittedAt: "42 mins ago",
    riskScore: "Low",
    status: "Pending",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "kyc-103",
    userName: "Vikram Malhotra",
    profileId: "#000018",
    city: "Gurugram, Haryana",
    documentType: "PAN + Video KYC",
    submittedAt: "3 hours ago",
    riskScore: "High",
    status: "Pending",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    txnId: "TXN-VKL-98412",
    memberName: "Arjun Deshmukh",
    email: "arjun@vivahkarlo.in",
    planName: "Gold Royal VIP (6 Months)",
    amount: "₹4,999",
    method: "UPI",
    status: "Paid",
    date: "Today, 2:15 PM",
  },
  {
    txnId: "TXN-VKL-98409",
    memberName: "Ananya Iyer",
    email: "ananya.iyer@vivahkarlo.in",
    planName: "Platinum Exclusive (12 Months)",
    amount: "₹7,999",
    method: "Credit Card",
    status: "Paid",
    date: "Today, 11:40 AM",
  },
  {
    txnId: "TXN-VKL-98395",
    memberName: "Rani Patel",
    email: "rani.patel@vivahkarlo.in",
    planName: "Silver Connect (3 Months)",
    amount: "₹2,499",
    method: "NetBanking",
    status: "Paid",
    date: "Yesterday",
  },
  {
    txnId: "TXN-VKL-98381",
    memberName: "Aditya Deshmukh",
    email: "aditya.d@vivahkarlo.in",
    planName: "Gold Royal VIP (6 Months)",
    amount: "₹4,999",
    method: "UPI",
    status: "Pending",
    date: "2 days ago",
  },
  {
    txnId: "TXN-VKL-98360",
    memberName: "Vikram Malhotra",
    email: "suspended@vivahkarlo.in",
    planName: "Silver Connect (3 Months)",
    amount: "₹2,499",
    method: "Credit Card",
    status: "Refunded",
    date: "5 days ago",
  },
];

export const INITIAL_COUPONS: PromoCoupon[] = [
  {
    code: "VIVAH20",
    discountLabel: "20% OFF on Gold & Platinum",
    usageCount: 148,
    maxLimit: 500,
    active: true,
    expiry: "31 Dec 2026",
  },
  {
    code: "ROYAL500",
    discountLabel: "Flat ₹500 Instant Discount",
    usageCount: 92,
    maxLimit: 250,
    active: true,
    expiry: "30 Nov 2026",
  },
  {
    code: "FESTIVAL30",
    discountLabel: "30% Festive Alliance Offer",
    usageCount: 300,
    maxLimit: 300,
    active: false,
    expiry: "Expired",
  },
];

export const INITIAL_REPORTS: ModerationReport[] = [
  {
    id: "rep-501",
    reportedUser: "Vikram Malhotra (suspended@vivahkarlo.in)",
    reportedBy: "Shital Verma (#000005)",
    reason: "Profile identity mismatch and unverified workplace claim",
    severity: "High",
    status: "Open",
    createdAt: "1 hour ago",
  },
  {
    id: "rep-502",
    reportedUser: "Guest Account (#000091)",
    reportedBy: "Shivani Doe (#000003)",
    reason: "Repeated unsolicited messages requesting external phone contact",
    severity: "Medium",
    status: "Open",
    createdAt: "4 hours ago",
  },
  {
    id: "rep-503",
    reportedUser: "Demo Candidate (#000084)",
    reportedBy: "Automated Fraud Engine",
    reason: "Duplicate mobile number pattern detected during onboarding",
    severity: "Low",
    status: "Open",
    createdAt: "Yesterday",
  },
];

export const INITIAL_BROADCASTS: AdminBroadcastLog[] = [
  {
    id: "bc-1",
    title: "Complete Your 36-Guna Kundli Profile for 3X Matches",
    audience: "Incomplete Profiles",
    channel: "Push + Email",
    sentAt: "Today, 9:00 AM",
    reachCount: 1420,
  },
  {
    id: "bc-2",
    title: "Festive VIP Gold Upgrade — Save 42% This Week",
    audience: "All Active Members",
    channel: "Email Only",
    sentAt: "Yesterday",
    reachCount: 4850,
  },
];

export const INITIAL_AUDIT_LOGS: AdminAuditEntry[] = [
  {
    id: "aud-1",
    actor: "Super Admin (admin@vivahkarlo.in)",
    action: "Suspended Account",
    target: "Vikram Malhotra (usr-suspended)",
    timestamp: "Today, 10:15 AM",
  },
  {
    id: "aud-2",
    actor: "KYC Officer (kyc@vivahkarlo.in)",
    action: "Verified Aadhaar & Selfie",
    target: "Arjun Deshmukh (usr-active-complete)",
    timestamp: "Yesterday, 4:40 PM",
  },
  {
    id: "aud-3",
    actor: "Finance Admin",
    action: "Processed Refund TXN-VKL-98360",
    target: "₹2,499 via Credit Card",
    timestamp: "5 days ago",
  },
];

export const MONTHLY_REVENUE_SERIES = [
  { month: "Jun", signups: 680, revenueK: 420 },
  { month: "Jul", signups: 820, revenueK: 510 },
  { month: "Aug", signups: 940, revenueK: 635 },
  { month: "Sep", signups: 1120, revenueK: 790 },
  { month: "Oct", signups: 1380, revenueK: 940 },
  { month: "Nov", signups: 1640, revenueK: 1185 },
];

export const ADMIN_TEAM_ROLES = [
  {
    role: "Super Admin",
    members: 2,
    permissions: [
      "Full Database Explorer & Export",
      "Suspend / Delete / Restore Users",
      "Payment Refunds & Coupons",
      "Security & Maintenance Controls",
    ],
  },
  {
    role: "KYC & Verification Officer",
    members: 5,
    permissions: [
      "Approve / Reject Aadhaar & Selfie KYC",
      "Grant Verified Badge",
      "Flag Fraud Risk Profiles",
    ],
  },
  {
    role: "Trust & Moderation Lead",
    members: 4,
    permissions: [
      "Review Abuse & Harassment Reports",
      "Issue Warnings & Temporary Suspensions",
      "Moderate Photos & Bios",
    ],
  },
];

export interface FranchiseBranch {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  managerName: string;
  phone: string;
  email: string;
  address: string;
  activeUsersCount: number;
  totalRevenue: string;
  commissionRate: number; // e.g. 20 for 20%
  status: "Active" | "Inactive";
}

export const INITIAL_FRANCHISES: FranchiseBranch[] = [
  {
    id: "fr-101",
    name: "Pune Central Hub",
    code: "VKL-PUN-01",
    city: "Pune",
    state: "Maharashtra",
    managerName: "Sanjay Deshpande",
    phone: "+91 98220 11223",
    email: "pune.branch@vivahkarlo.in",
    address: "304, Millennium Business Park, FC Road, Pune - 411005",
    activeUsersCount: 420,
    totalRevenue: "Rs 3,85,000",
    commissionRate: 20,
    status: "Active",
  },
  {
    id: "fr-102",
    name: "Mumbai South Elite Desk",
    code: "VKL-BOM-02",
    city: "Mumbai",
    state: "Maharashtra",
    managerName: "Kavita Singhania",
    phone: "+91 98200 44556",
    email: "mumbai.elite@vivahkarlo.in",
    address: "1202, Maker Chambers V, Nariman Point, Mumbai - 400021",
    activeUsersCount: 680,
    totalRevenue: "Rs 8,40,000",
    commissionRate: 25,
    status: "Active",
  },
  {
    id: "fr-103",
    name: "Ahmedabad West Alliances",
    code: "VKL-AMD-03",
    city: "Ahmedabad",
    state: "Gujarat",
    managerName: "Jignesh Shah",
    phone: "+91 98980 77889",
    email: "ahmedabad@vivahkarlo.in",
    address: "4th Floor, Iscon Elegance, SG Highway, Ahmedabad - 380015",
    activeUsersCount: 310,
    totalRevenue: "Rs 2,75,000",
    commissionRate: 18,
    status: "Active",
  },
  {
    id: "fr-104",
    name: "Delhi NCR VIP Lounge",
    code: "VKL-DEL-04",
    city: "Delhi NCR",
    state: "Delhi",
    managerName: "Rajeev Mehra",
    phone: "+91 98110 33445",
    email: "delhi.vip@vivahkarlo.in",
    address: "Tower B, DLF Cyber City, Phase 2, Gurugram - 122002",
    activeUsersCount: 540,
    totalRevenue: "Rs 6,10,000",
    commissionRate: 22,
    status: "Active",
  },
];

export interface StaffAccount {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Moderator" | "Customer Support" | "Relationship Manager" | "Finance Officer";
  department: string;
  phone: string;
  status: "Active" | "Inactive";
  lastActive: string;
  permissions: string[];
}

export const INITIAL_STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: "stf-01",
    name: "Admin Command Desk",
    email: "admin@vivahkarlo.in",
    role: "Super Admin",
    department: "Executive Management",
    phone: "+91 98000 11111",
    status: "Active",
    lastActive: "Active Now",
    permissions: ["all_access", "manage_users", "approve_kyc", "issue_refunds", "system_settings"],
  },
  {
    id: "stf-02",
    name: "Snehal Sharma",
    email: "snehal.kyc@vivahkarlo.in",
    role: "Moderator",
    department: "Trust & Safety / KYC",
    phone: "+91 98000 22222",
    status: "Active",
    lastActive: "15 mins ago",
    permissions: ["approve_kyc", "moderate_photos", "view_reports", "flag_fake_profiles"],
  },
  {
    id: "stf-03",
    name: "Vikram Rathi",
    email: "vikram.support@vivahkarlo.in",
    role: "Customer Support",
    department: "Customer Success",
    phone: "+91 98000 33333",
    status: "Active",
    lastActive: "1 hour ago",
    permissions: ["view_users", "reply_tickets", "send_notifications"],
  },
  {
    id: "stf-04",
    name: "Ritu Kapoor",
    email: "ritu.finance@vivahkarlo.in",
    role: "Finance Officer",
    department: "Accounts & Billing",
    phone: "+91 98000 44444",
    status: "Active",
    lastActive: "Yesterday",
    permissions: ["view_transactions", "issue_refunds", "manage_coupons", "tax_settings"],
  },
  {
    id: "stf-05",
    name: "Anand Verma",
    email: "anand.rm@vivahkarlo.in",
    role: "Relationship Manager",
    department: "VIP Concierge",
    phone: "+91 98000 55555",
    status: "Active",
    lastActive: "3 hours ago",
    permissions: ["view_vip_users", "matchmaking_assist", "contact_reveal"],
  },
];

export interface MembershipPlan {
  id: string;
  name: string;
  tier: "free" | "silver" | "gold" | "platinum";
  price: number;
  strikePrice: number;
  durationDays: number;
  durationLabel: string;
  contactsQuota: number;
  chatEnabled: boolean;
  prioritySearch: boolean;
  horoscopeMatching: boolean;
  verifiedBadge: boolean;
  relationshipManager: boolean;
  active: boolean;
  popular: boolean;
}

export const INITIAL_MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "plan-free",
    name: "Free Starter",
    tier: "free",
    price: 0,
    strikePrice: 0,
    durationDays: 365,
    durationLabel: "Lifetime Free",
    contactsQuota: 0,
    chatEnabled: false,
    prioritySearch: false,
    horoscopeMatching: true,
    verifiedBadge: false,
    relationshipManager: false,
    active: true,
    popular: false,
  },
  {
    id: "plan-silver",
    name: "Silver Connect",
    tier: "silver",
    price: 2499,
    strikePrice: 3999,
    durationDays: 90,
    durationLabel: "3 Months",
    contactsQuota: 25,
    chatEnabled: true,
    prioritySearch: false,
    horoscopeMatching: true,
    verifiedBadge: true,
    relationshipManager: false,
    active: true,
    popular: false,
  },
  {
    id: "plan-gold",
    name: "Gold Royal VIP",
    tier: "gold",
    price: 4999,
    strikePrice: 7999,
    durationDays: 180,
    durationLabel: "6 Months",
    contactsQuota: 75,
    chatEnabled: true,
    prioritySearch: true,
    horoscopeMatching: true,
    verifiedBadge: true,
    relationshipManager: false,
    active: true,
    popular: true,
  },
  {
    id: "plan-platinum",
    name: "Platinum Exclusive VIP",
    tier: "platinum",
    price: 8999,
    strikePrice: 14999,
    durationDays: 365,
    durationLabel: "12 Months",
    contactsQuota: 150,
    chatEnabled: true,
    prioritySearch: true,
    horoscopeMatching: true,
    verifiedBadge: true,
    relationshipManager: true,
    active: true,
    popular: false,
  },
];

export interface InterestAuditItem {
  id: string;
  senderName: string;
  senderId: string;
  senderAvatar: string;
  receiverName: string;
  receiverId: string;
  receiverAvatar: string;
  status: "Sent" | "Accepted" | "Rejected" | "Pending";
  sentAt: string;
  isFlaggedSpam: boolean;
}

export const INITIAL_INTERESTS_AUDIT: InterestAuditItem[] = [
  {
    id: "int-801",
    senderName: "Arjun Deshmukh",
    senderId: "usr-active-complete",
    senderAvatar: "/2.jpg",
    receiverName: "Meera Nair",
    receiverId: "usr-verified-meera",
    receiverAvatar: "/3.jpg",
    status: "Accepted",
    sentAt: "2 hours ago",
    isFlaggedSpam: false,
  },
  {
    id: "int-802",
    senderName: "Sneha Patil",
    senderId: "usr-vip-sneha",
    senderAvatar: "/1.jpg",
    receiverName: "Rajesh Iyer",
    receiverId: "usr-vip-rajesh",
    receiverAvatar: "/2.jpg",
    status: "Accepted",
    sentAt: "5 hours ago",
    isFlaggedSpam: false,
  },
  {
    id: "int-803",
    senderName: "Rohan Verma",
    senderId: "usr-verify-pending",
    senderAvatar: "/4.jpg",
    receiverName: "Pooja Gupta",
    receiverId: "usr-new-pooja",
    receiverAvatar: "/1.jpg",
    status: "Pending",
    sentAt: "Yesterday",
    isFlaggedSpam: false,
  },
  {
    id: "int-804",
    senderName: "Vikram Malhotra",
    senderId: "usr-suspended",
    senderAvatar: "/4.jpg",
    receiverName: "Priya Kulkarni",
    receiverId: "usr-active-incomplete",
    receiverAvatar: "/1.jpg",
    status: "Rejected",
    sentAt: "3 days ago",
    isFlaggedSpam: true,
  },
];

export interface ChatAuditSession {
  id: string;
  user1Name: string;
  user1Id: string;
  user2Name: string;
  user2Id: string;
  totalMessages: number;
  lastMessageAt: string;
  flaggedWordCount: number;
  isReported: boolean;
  status: "Safe" | "Under Review" | "Suspended";
}

export const INITIAL_CHAT_SESSIONS: ChatAuditSession[] = [
  {
    id: "chat-901",
    user1Name: "Arjun Deshmukh",
    user1Id: "usr-active-complete",
    user2Name: "Meera Nair",
    user2Id: "usr-verified-meera",
    totalMessages: 28,
    lastMessageAt: "10 mins ago",
    flaggedWordCount: 0,
    isReported: false,
    status: "Safe",
  },
  {
    id: "chat-902",
    user1Name: "Sneha Patil",
    user1Id: "usr-vip-sneha",
    user2Name: "Rajesh Iyer",
    user2Id: "usr-vip-rajesh",
    totalMessages: 42,
    lastMessageAt: "1 hour ago",
    flaggedWordCount: 0,
    isReported: false,
    status: "Safe",
  },
  {
    id: "chat-903",
    user1Name: "Vikram Malhotra",
    user1Id: "usr-suspended",
    user2Name: "Shital Verma",
    user2Id: "usr-005",
    totalMessages: 6,
    lastMessageAt: "2 days ago",
    flaggedWordCount: 3,
    isReported: true,
    status: "Under Review",
  },
];

export interface PhotoModerationItem {
  id: string;
  userId: string;
  userName: string;
  photoUrl: string;
  photoType: "Profile Avatar" | "Gallery Photo" | "Kundli Document";
  submittedAt: string;
  status: "Pending" | "Approved" | "Rejected" | "Blurred";
  aiFaceConfidence: number; // e.g. 98%
}

export const INITIAL_PHOTO_MODERATION_QUEUE: PhotoModerationItem[] = [
  {
    id: "pm-101",
    userId: "usr-new-pooja",
    userName: "Pooja Gupta",
    photoUrl: "/1.jpg",
    photoType: "Profile Avatar",
    submittedAt: "20 mins ago",
    status: "Pending",
    aiFaceConfidence: 99,
  },
  {
    id: "pm-102",
    userId: "usr-verified-meera",
    userName: "Meera Nair",
    photoUrl: "/3.jpg",
    photoType: "Gallery Photo",
    submittedAt: "1 hour ago",
    status: "Pending",
    aiFaceConfidence: 97,
  },
  {
    id: "pm-103",
    userId: "usr-active-complete",
    userName: "Arjun Deshmukh",
    photoUrl: "/2.jpg",
    photoType: "Profile Avatar",
    submittedAt: "Yesterday",
    status: "Approved",
    aiFaceConfidence: 99,
  },
  {
    id: "pm-104",
    userId: "usr-suspended",
    userName: "Vikram Malhotra",
    photoUrl: "/4.jpg",
    photoType: "Profile Avatar",
    submittedAt: "4 days ago",
    status: "Rejected",
    aiFaceConfidence: 62,
  },
];

export interface CmsBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  active: boolean;
  order: number;
}

export const INITIAL_CMS_BANNERS: CmsBanner[] = [
  {
    id: "ban-1",
    title: "Find Your Perfect Sacred Match",
    subtitle: "Over 50,000+ verified Hindu, Marathi, Gujarati & Maratha alliances.",
    imageUrl: "/hero_couple.jpg",
    ctaText: "Register Free Today",
    ctaUrl: "/register",
    active: true,
    order: 1,
  },
  {
    id: "ban-2",
    title: "100% Verified Biodatas with Kundli Matching",
    subtitle: "Accurate 36-Guna Ashtakoot Milan & AI Compatibility Intelligence.",
    imageUrl: "/hero-wedding.jpg",
    ctaText: "Check Compatibility",
    ctaUrl: "/matches",
    active: true,
    order: 2,
  },
];

export interface CmsFaqItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Security" | "Membership" | "Kundli";
  order: number;
  active: boolean;
}

export const INITIAL_CMS_FAQS: CmsFaqItem[] = [
  {
    id: "faq-1",
    question: "How does 100% ID & Selfie verification work?",
    answer: "Every profile can upload government ID proof (Aadhaar/Passport). Our moderation desk verifies documents within 2 hours.",
    category: "Security",
    order: 1,
    active: true,
  },
  {
    id: "faq-2",
    question: "Is my phone number and photos safe from unauthorized viewers?",
    answer: "Yes, you have granular privacy controls to hide photos, watermark downloads, or require mutual interest acceptance before contact reveal.",
    category: "Security",
    order: 2,
    active: true,
  },
  {
    id: "faq-3",
    question: "What are the benefits of Gold Royal VIP?",
    answer: "Gold VIP members receive 75 direct verified phone contact reveals, priority search ranking, and instant chat initiation.",
    category: "Membership",
    order: 3,
    active: true,
  },
];

export interface AutomatedCampaignTrigger {
  id: string;
  name: string;
  triggerType: "Inactive User Reminder" | "Profile Completion Reminder" | "Membership Expiry Reminder" | "New Match Alert" | "Birthday Wishes";
  channel: "WhatsApp + Email" | "Email Only" | "SMS + Push";
  delayCondition: string;
  active: boolean;
  sentCount: number;
}

export const INITIAL_AUTOMATED_CAMPAIGNS: AutomatedCampaignTrigger[] = [
  {
    id: "camp-01",
    name: "Inactive User Re-Engagement",
    triggerType: "Inactive User Reminder",
    channel: "WhatsApp + Email",
    delayCondition: "User inactive for 14 days",
    active: true,
    sentCount: 842,
  },
  {
    id: "camp-02",
    name: "Nudge: Incomplete Matrimonial Profile",
    triggerType: "Profile Completion Reminder",
    channel: "WhatsApp + Email",
    delayCondition: "Profile completion under 50% after 48 hours",
    active: true,
    sentCount: 1250,
  },
  {
    id: "camp-03",
    name: "VIP Membership Renewal Alert",
    triggerType: "Membership Expiry Reminder",
    channel: "WhatsApp + Email",
    delayCondition: "3 days before VIP subscription expiration",
    active: true,
    sentCount: 310,
  },
  {
    id: "camp-04",
    name: "Daily Sacred Kundli Matches Digest",
    triggerType: "New Match Alert",
    channel: "Email Only",
    delayCondition: "Triggered daily at 9:00 AM if score >= 80%",
    active: true,
    sentCount: 4620,
  },
  {
    id: "camp-05",
    name: "Birthday Warm Wishes & Free 3-Day VIP Pass",
    triggerType: "Birthday Wishes",
    channel: "WhatsApp + Email",
    delayCondition: "On member's date of birth at 8:00 AM",
    active: true,
    sentCount: 185,
  },
];

export interface DuplicateCluster {
  id: string;
  primaryUserId: string;
  primaryName: string;
  primaryEmail: string;
  primaryMobile: string;
  primaryAvatar: string;
  duplicateUserId: string;
  duplicateName: string;
  duplicateEmail: string;
  duplicateMobile: string;
  duplicateAvatar: string;
  matchReasons: string[];
  matchScore: number; // e.g. 98%
  status: "Detected" | "Merged" | "Quarantined" | "Dismissed";
  detectedAt: string;
  deviceFingerprint?: string;
  photoHash?: string;
}

export const INITIAL_DUPLICATE_CLUSTERS: DuplicateCluster[] = [
  {
    id: "dup-101",
    primaryUserId: "usr-active-complete",
    primaryName: "Arjun Deshmukh",
    primaryEmail: "arjun@vivahkarlo.in",
    primaryMobile: "9876543210",
    primaryAvatar: "/2.jpg",
    duplicateUserId: "usr-dup-arjun2",
    duplicateName: "Arjun D. (Demo Test)",
    duplicateEmail: "arjun.deshmukh+test@gmail.com",
    duplicateMobile: "9876543210",
    duplicateAvatar: "/2.jpg",
    matchReasons: [
      "Same Mobile Number (Exact Match)",
      "Same Email Alias (+test prefix)",
      "Identical Photo Hash (MD5: a9b42cf)",
      "Exact Device Fingerprint (iPhone 15 Pro)",
    ],
    matchScore: 99,
    status: "Detected",
    detectedAt: "10 mins ago",
    deviceFingerprint: "DEV-FPR-881249A",
    photoHash: "md5_a9b42cf8912",
  },
  {
    id: "dup-102",
    primaryUserId: "usr-suspended",
    primaryName: "Vikram Malhotra",
    primaryEmail: "suspended@vivahkarlo.in",
    primaryMobile: "9833344455",
    primaryAvatar: "/4.jpg",
    duplicateUserId: "usr-dup-vikram-alt",
    duplicateName: "Vikram M. (New Profile)",
    duplicateEmail: "vikram.m.business@yahoo.com",
    duplicateMobile: "9833344455",
    duplicateAvatar: "/4.jpg",
    matchReasons: [
      "Same Mobile Number (Exact Match)",
      "Identical Photo Hash (pHash: 0xFA3C19)",
      "Similar Name + Same DOB (1992-02-18)",
    ],
    matchScore: 95,
    status: "Detected",
    detectedAt: "2 hours ago",
    deviceFingerprint: "DEV-FPR-441092B",
    photoHash: "md5_fa3c1901452",
  },
  {
    id: "dup-103",
    primaryUserId: "usr-vip-sneha",
    primaryName: "Sneha Patil",
    primaryEmail: "sneha.patil@vivahkarlo.in",
    primaryMobile: "9855566677",
    primaryAvatar: "/1.jpg",
    duplicateUserId: "usr-dup-sneha-rel",
    duplicateName: "Sneha P. (Created by Aunt)",
    duplicateEmail: "sneha.family@gmail.com",
    duplicateMobile: "9855566677",
    duplicateAvatar: "/1.jpg",
    matchReasons: [
      "Same Mobile Number (Exact Match)",
      "Similar Name + Same DOB (1997-04-18)",
    ],
    matchScore: 88,
    status: "Detected",
    detectedAt: "Yesterday",
    deviceFingerprint: "DEV-FPR-119204C",
    photoHash: "md5_33c90128fa1",
  },
];

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  category: "profile" | "security" | "membership" | "support";
  enabled: boolean;
  intervalMinutes: number;
  lastRun: string;
  actionsTakenCount: number;
  config: Record<string, any>;
}

export const INITIAL_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: "auto-01",
    name: "Auto Reject Incomplete Profile",
    description: "Automatically flag or reject profiles remaining under 25% complete after 30 days of registration.",
    category: "profile",
    enabled: true,
    intervalMinutes: 1440, // 24 hours
    lastRun: "2 hours ago",
    actionsTakenCount: 14,
    config: { thresholdDays: 30, minCompletion: 25 },
  },
  {
    id: "auto-02",
    name: "Auto Block Repeated Fake Accounts",
    description: "Instantly suspend accounts receiving 3+ unique fraud/impersonation reports or matching blacklisted device fingerprints.",
    category: "security",
    enabled: true,
    intervalMinutes: 60,
    lastRun: "25 mins ago",
    actionsTakenCount: 5,
    config: { reportThreshold: 3, autoQuarantine: true },
  },
  {
    id: "auto-03",
    name: "Auto Expire Membership on Due Date",
    description: "Daily cron transitions VIP subscriptions to Expired status once midnight UTC exceeds the plan expiresAt timestamp.",
    category: "membership",
    enabled: true,
    intervalMinutes: 360,
    lastRun: "1 hour ago",
    actionsTakenCount: 28,
    config: { gracePeriodHours: 24, downgradeTier: "free" },
  },
  {
    id: "auto-04",
    name: "Auto Activate Membership on Payment",
    description: "Instant IPN / webhook trigger activates VIP benefits, unmasks contact quota, and dispatches invoice upon payment capture.",
    category: "membership",
    enabled: true,
    intervalMinutes: 1,
    lastRun: "Just now",
    actionsTakenCount: 194,
    config: { instantCredit: true, sendReceiptWhatsApp: true },
  },
  {
    id: "auto-05",
    name: "Auto Send Renewal Reminder",
    description: "Dispatches automated reminder via WhatsApp and Email 3 days before VIP subscription expires with discount coupon.",
    category: "membership",
    enabled: true,
    intervalMinutes: 720,
    lastRun: "3 hours ago",
    actionsTakenCount: 42,
    config: { daysBefore: 3, promoCoupon: "RENEW20" },
  },
  {
    id: "auto-06",
    name: "Auto Assign Support Tickets",
    description: "Round-robin assignment of incoming user tickets to active support executives based on department specialization.",
    category: "support",
    enabled: true,
    intervalMinutes: 15,
    lastRun: "10 mins ago",
    actionsTakenCount: 86,
    config: { routingMode: "round_robin", fallbackDepartment: "Customer Success" },
  },
  {
    id: "auto-07",
    name: "Auto Follow-up Reminder for Pending Alliances",
    description: "Notifies candidates when an interest has been pending without action for 5 days to encourage alliance progress.",
    category: "profile",
    enabled: true,
    intervalMinutes: 1440,
    lastRun: "4 hours ago",
    actionsTakenCount: 65,
    config: { pendingDays: 5, sendNotification: true },
  },
  {
    id: "auto-08",
    name: "Inactive User Identification",
    description: "Flags members inactive for 14+ days and queues re-engagement matches digest to revive dormant accounts.",
    category: "security",
    enabled: true,
    intervalMinutes: 1440,
    lastRun: "Yesterday",
    actionsTakenCount: 112,
    config: { inactiveDays: 14 },
  },
];

export interface UserTimelineEvent {
  id: string;
  userId: string;
  userName: string;
  eventType:
    | "login"
    | "logout"
    | "profile_update"
    | "search"
    | "interest_sent"
    | "interest_accepted"
    | "profile_view"
    | "suspicious_login";
  title: string;
  detail: string;
  ipAddress: string;
  deviceInfo: string;
  location: string;
  timestamp: string;
  isSuspicious?: boolean;
}

export const INITIAL_USER_TIMELINE_EVENTS: UserTimelineEvent[] = [
  {
    id: "tl-01",
    userId: "usr-active-complete",
    userName: "Arjun Deshmukh",
    eventType: "login",
    title: "Member Sign-In",
    detail: "Authenticated successfully via Password from trusted mobile device.",
    ipAddress: "49.36.12.84",
    deviceInfo: "Apple iPhone 15 Pro (Safari 17.2)",
    location: "Pune, Maharashtra",
    timestamp: "12 mins ago",
  },
  {
    id: "tl-02",
    userId: "usr-active-complete",
    userName: "Arjun Deshmukh",
    eventType: "search",
    title: "Search Query Executed",
    detail: "Criteria: Age 24-28, Religion: Hindu, Education: B.Tech / MBA, City: Pune / Mumbai.",
    ipAddress: "49.36.12.84",
    deviceInfo: "Apple iPhone 15 Pro",
    location: "Pune, Maharashtra",
    timestamp: "18 mins ago",
  },
  {
    id: "tl-03",
    userId: "usr-active-complete",
    userName: "Arjun Deshmukh",
    eventType: "profile_view",
    title: "Profile Viewed",
    detail: "Inspected full matrimonial biodata of Meera Nair (usr-verified-meera).",
    ipAddress: "49.36.12.84",
    deviceInfo: "Apple iPhone 15 Pro",
    location: "Pune, Maharashtra",
    timestamp: "22 mins ago",
  },
  {
    id: "tl-04",
    userId: "usr-active-complete",
    userName: "Arjun Deshmukh",
    eventType: "interest_sent",
    title: "Interest Dispatched",
    detail: "Sent sacred alliance proposal to Meera Nair with personalized introductory greeting.",
    ipAddress: "49.36.12.84",
    deviceInfo: "Apple iPhone 15 Pro",
    location: "Pune, Maharashtra",
    timestamp: "25 mins ago",
  },
  {
    id: "tl-05",
    userId: "usr-suspended",
    userName: "Vikram Malhotra",
    eventType: "suspicious_login",
    title: "Suspicious Login Alert",
    detail: "Sign-in attempt from new unrecognized IP in Russian Federation using Proxy/VPN.",
    ipAddress: "185.220.101.5",
    deviceInfo: "Linux Tor Browser",
    location: "Moscow, Russia",
    timestamp: "Yesterday, 11:40 PM",
    isSuspicious: true,
  },
  {
    id: "tl-06",
    userId: "usr-vip-sneha",
    userName: "Sneha Patil",
    eventType: "profile_update",
    title: "Profile Data Updated",
    detail: "Updated Annual Income from '18 - 22 Lakhs' to '24 - 28 Lakhs P.A.' and added Master Degree certificate.",
    ipAddress: "103.21.54.12",
    deviceInfo: "Windows 11 Chrome",
    location: "Mumbai, Maharashtra",
    timestamp: "2 days ago",
  },
  {
    id: "tl-07",
    userId: "usr-active-incomplete",
    userName: "Priya Kulkarni",
    eventType: "logout",
    title: "Member Sign-Out",
    detail: "Explicit session logout completed from mobile browser.",
    ipAddress: "49.37.88.19",
    deviceInfo: "Android 14 Chrome Mobile",
    location: "Pune, Maharashtra",
    timestamp: "3 days ago",
  },
];

export interface SavedSearchPreset {
  id: string;
  name: string;
  category: "users" | "transactions" | "tickets" | "kyc";
  query: string;
  filterParam: string;
  targetTab: string;
  description: string;
}

export const INITIAL_SAVED_SEARCHES: SavedSearchPreset[] = [
  {
    id: "preset-1",
    name: "Pending KYC Submissions Today",
    category: "kyc",
    query: "",
    filterParam: "pending",
    targetTab: "kyc",
    description: "Candidates waiting for Aadhaar & Live Selfie approval.",
  },
  {
    id: "preset-2",
    name: "High-Value Platinum VIP Members",
    category: "users",
    query: "platinum",
    filterParam: "premium",
    targetTab: "users",
    description: "All active members on 12-Month Platinum plan.",
  },
  {
    id: "preset-3",
    name: "Suspended & Fraud Risk Accounts",
    category: "users",
    query: "suspended",
    filterParam: "suspended",
    targetTab: "users",
    description: "Profiles flagged for policy violations or suspicious activities.",
  },
  {
    id: "preset-4",
    name: "Pune & Mumbai Elite Alliances",
    category: "users",
    query: "Pune",
    filterParam: "active",
    targetTab: "users",
    description: "Verified active alliances based in Maharashtra metro hubs.",
  },
  {
    id: "preset-5",
    name: "Recent Paid UPI Transactions",
    category: "transactions",
    query: "UPI",
    filterParam: "paid",
    targetTab: "payments",
    description: "Successful real-time subscriptions captured via UPI gateway.",
  },
];
