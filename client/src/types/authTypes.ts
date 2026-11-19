export type AccountStatus =
  | "active"
  | "pending_verification"
  | "suspended"
  | "deleted";

export type ProfileStatus = "incomplete" | "complete";

export type ProfileCreatedByOption =
  | "Self"
  | "Parents"
  | "Brother / Sister"
  | "Relative"
  | "Friend";

export type RegistrationStep = 1 | 2 | 3 | 4 | "completed";

/** Future DB table: users */
export interface UserRecord {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  passwordHash: string;
  gender: "Male" | "Female";
  dob: string; // YYYY-MM-DD
  profileCreatedBy?: ProfileCreatedByOption;
  accountStatus: AccountStatus;
  suspensionReason?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** Future DB table: user_verifications */
export interface UserVerificationRecord {
  userId: string;
  mobileVerified: boolean;
  emailVerified: boolean;
  mobileOtpCode?: string;
  mobileOtpExpiresAt?: number;
  mobileOtpAttempts: number;
  mobileLockedUntil?: number;
  emailOtpCode?: string;
  emailOtpExpiresAt?: number;
  emailOtpAttempts: number;
  emailLockedUntil?: number;
}

/** Future DB table: user_sessions */
export interface UserSessionRecord {
  sessionId: string;
  userId: string;
  accessToken: string;
  deviceLabel: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

/** Future DB table: user_profiles */
export interface UserProfileMeta {
  userId: string;
  profileStatus: ProfileStatus;
  profileCompletion: number; // 0 - 100
  isNewUser: boolean;
}

/** Future DB table: user_roles */
export interface UserRoleRecord {
  userId: string;
  role: "member" | "vip" | "admin";
  permissions: string[];
}

/** Future DB table: registration_progress */
export interface RegistrationProgressRecord {
  userId: string;
  currentStep: RegistrationStep;
  updatedAt: string;
}

export interface AccountBundle {
  user: UserRecord;
  verification: UserVerificationRecord;
  profileMeta: UserProfileMeta;
  role: UserRoleRecord;
  progress: RegistrationProgressRecord;
}

export type LoginPostDestination =
  | "/dashboard"
  | "/profile-setup"
  | "/verify-otp"
  | "/profile-created-by"
  | "/account-status";
