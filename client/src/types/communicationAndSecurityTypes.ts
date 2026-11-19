export type InterestStatus = "pending" | "accepted" | "declined" | "cancelled";

export interface InterestRecord {
  id: string;
  senderId: string;
  senderName: string;
  senderProfileId?: string;
  senderPhoto?: string;
  receiverId: string;
  receiverName: string;
  receiverProfileId?: string;
  receiverPhoto?: string;
  message: string;
  status: InterestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  blocked: boolean;
  blockReason?: string;
  createdAt: string;
}

export interface ChatThread {
  threadId: string;
  participantId: string;
  participantName: string;
  participantProfileId: string;
  participantPhoto: string;
  participantProfession: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isMutual: boolean;
  trustScore: number;
  isGovtVerified: boolean;
}

export type AccessRequestStatus = "pending" | "approved" | "rejected";

export interface ContactAccessRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterProfileId: string;
  requesterPhoto: string;
  requesterRole: "free" | "gold" | "vip" | "admin";
  targetUserId: string;
  status: AccessRequestStatus;
  createdAt: string;
  approvedAt?: string;
}

export interface PhotoAccessRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterProfileId: string;
  requesterPhoto: string;
  targetUserId: string;
  status: AccessRequestStatus;
  createdAt: string;
  approvedAt?: string;
}

export type KycDocumentType =
  | "Aadhaar Card"
  | "Passport"
  | "Voter ID"
  | "Driving License"
  | "PAN Card";

export type VerificationStatus = "Not Uploaded" | "Pending" | "Approved" | "Rejected";

export interface KycVerificationRecord {
  id: string;
  userId: string;
  userName: string;
  docType: KycDocumentType;
  maskedIdNumber: string; // e.g., "XXXX-XXXX-4210"
  docFrontUrl: string;
  docBackUrl?: string;
  status: VerificationStatus;
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export type EmploymentProofType =
  | "Salary Slip"
  | "Form 16 / ITR"
  | "Govt Appointment Letter"
  | "Official ID Card";

export interface EmploymentVerificationRecord {
  id: string;
  userId: string;
  userName: string;
  proofType: EmploymentProofType;
  organization: string;
  designation: string;
  declaredIncome: string;
  isGovtJob: boolean;
  docUrl: string;
  status: VerificationStatus;
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface UserPrivacySettings {
  userId: string;
  photoVisibility: "all" | "accepted_only" | "request_only";
  contactVisibility: "accepted_vip_only" | "permission_only" | "hidden";
  showOnlineStatus: boolean;
  watermarkEnabled: boolean;
  updatedAt: string;
}

export interface BlockedUserRecord {
  id: string;
  blockerUserId: string;
  blockedUserId: string;
  blockedUserName: string;
  reason?: string;
  createdAt: string;
}

export interface ModerationReportSubmission {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId: string;
  reportedUserName: string;
  category:
    | "Fake Profile"
    | "Inappropriate Messages"
    | "Commercial / Scam"
    | "Already Married"
    | "Harassment"
    | "Other Violation";
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Pending" | "Investigating" | "Resolved" | "Dismissed";
  createdAt: string;
}

export interface TrustScoreBreakdown {
  score: number; // 0 to 100
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isProfileComplete: boolean;
  isGovtIdVerified: boolean;
  isIncomeVerified: boolean;
  tier: "Standard" | "Verified" | "High Trust" | "Gold Certified";
}
