import React, { createContext, useContext, useEffect, useState } from "react";
import type {
  AccountBundle,
  AccountStatus,
  LoginPostDestination,
  ProfileCreatedByOption,
  UserSessionRecord,
} from "@/types/authTypes";

const STORAGE_KEY = "vivah_kar_lo_auth_db_v1";
const OTP_TTL_MS = 2 * 60 * 1000; // 2 minutes expiry
const MAX_OTP_ATTEMPTS = 3;
const OTP_RATE_LIMIT_MS = 60 * 1000; // 60s lock after repeated wrong OTPs
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_RATE_LIMIT_MS = 60 * 1000;

/** Demo-only deterministic password hashing placeholder (real bcrypt/argon2 runs on backend in Phase 2) */
export function demoHashPassword(raw: string): string {
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return `demo_sha256_${Math.abs(hash).toString(16)}`;
}

export function normalizeMobile(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) {
    return digits.slice(-10);
  }
  return digits;
}

export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

function generateSixDigitOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function createInitialSeedAccounts(): AccountBundle[] {
  const now = new Date().toISOString();
  const defaultHash = demoHashPassword("Vivah@123");

  return [
    {
      user: {
        id: "usr-active-complete",
        fullName: "Arjun Deshmukh",
        mobile: "9876543210",
        email: "arjun@vivahkarlo.in",
        passwordHash: defaultHash,
        gender: "Male",
        dob: "1996-05-14",
        profileCreatedBy: "Self",
        accountStatus: "active",
        createdAt: now,
        updatedAt: now,
      },
      verification: {
        userId: "usr-active-complete",
        mobileVerified: true,
        emailVerified: true,
        mobileOtpAttempts: 0,
        emailOtpAttempts: 0,
      },
      profileMeta: {
        userId: "usr-active-complete",
        profileStatus: "complete",
        profileCompletion: 100,
        isNewUser: false,
      },
      role: {
        userId: "usr-active-complete",
        role: "vip",
        permissions: ["browse", "send_interest", "chat", "view_contacts"],
      },
      progress: {
        userId: "usr-active-complete",
        currentStep: "completed",
        updatedAt: now,
      },
    },
    {
      user: {
        id: "usr-active-incomplete",
        fullName: "Priya Kulkarni",
        mobile: "9811122233",
        email: "priya@vivahkarlo.in",
        passwordHash: defaultHash,
        gender: "Female",
        dob: "1999-08-22",
        profileCreatedBy: "Parents",
        accountStatus: "active",
        createdAt: now,
        updatedAt: now,
      },
      verification: {
        userId: "usr-active-incomplete",
        mobileVerified: true,
        emailVerified: true,
        mobileOtpAttempts: 0,
        emailOtpAttempts: 0,
      },
      profileMeta: {
        userId: "usr-active-incomplete",
        profileStatus: "incomplete",
        profileCompletion: 0,
        isNewUser: true,
      },
      role: {
        userId: "usr-active-incomplete",
        role: "member",
        permissions: ["complete_profile"],
      },
      progress: {
        userId: "usr-active-incomplete",
        currentStep: "completed",
        updatedAt: now,
      },
    },
    {
      user: {
        id: "usr-pending-otp",
        fullName: "Rohan Verma",
        mobile: "9822233344",
        email: "rohan@vivahkarlo.in",
        passwordHash: defaultHash,
        gender: "Male",
        dob: "1995-11-04",
        accountStatus: "pending_verification",
        createdAt: now,
        updatedAt: now,
      },
      verification: {
        userId: "usr-pending-otp",
        mobileVerified: true,
        emailVerified: false,
        emailOtpCode: "123456",
        emailOtpExpiresAt: Date.now() + OTP_TTL_MS,
        mobileOtpAttempts: 0,
        emailOtpAttempts: 0,
      },
      profileMeta: {
        userId: "usr-pending-otp",
        profileStatus: "incomplete",
        profileCompletion: 0,
        isNewUser: true,
      },
      role: {
        userId: "usr-pending-otp",
        role: "member",
        permissions: ["verify_account"],
      },
      progress: {
        userId: "usr-pending-otp",
        currentStep: 3,
        updatedAt: now,
      },
    },
    {
      user: {
        id: "usr-suspended",
        fullName: "Vikram Malhotra",
        mobile: "9833344455",
        email: "suspended@vivahkarlo.in",
        passwordHash: defaultHash,
        gender: "Male",
        dob: "1994-03-19",
        profileCreatedBy: "Self",
        accountStatus: "suspended",
        suspensionReason:
          "Unverified identity mismatch reported by Trust & Safety Team.",
        createdAt: now,
        updatedAt: now,
      },
      verification: {
        userId: "usr-suspended",
        mobileVerified: true,
        emailVerified: true,
        mobileOtpAttempts: 0,
        emailOtpAttempts: 0,
      },
      profileMeta: {
        userId: "usr-suspended",
        profileStatus: "incomplete",
        profileCompletion: 40,
        isNewUser: false,
      },
      role: {
        userId: "usr-suspended",
        role: "member",
        permissions: [],
      },
      progress: {
        userId: "usr-suspended",
        currentStep: "completed",
        updatedAt: now,
      },
    },
    {
      user: {
        id: "usr-deleted",
        fullName: "Anjali Mehta",
        mobile: "9844455566",
        email: "deleted@vivahkarlo.in",
        passwordHash: defaultHash,
        gender: "Female",
        dob: "1997-01-12",
        profileCreatedBy: "Self",
        accountStatus: "deleted",
        deletedAt: "2026-10-15T10:00:00.000Z",
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        updatedAt: now,
      },
      verification: {
        userId: "usr-deleted",
        mobileVerified: true,
        emailVerified: true,
        mobileOtpAttempts: 0,
        emailOtpAttempts: 0,
      },
      profileMeta: {
        userId: "usr-deleted",
        profileStatus: "complete",
        profileCompletion: 100,
        isNewUser: false,
      },
      role: {
        userId: "usr-deleted",
        role: "member",
        permissions: [],
      },
      progress: {
        userId: "usr-deleted",
        currentStep: "completed",
        updatedAt: now,
      },
    },
    {
      user: {
        id: "usr-vip-sneha",
        fullName: "Sneha Patil",
        mobile: "9855566677",
        email: "sneha.patil@vivahkarlo.in",
        passwordHash: defaultHash,
        gender: "Female",
        dob: "1997-04-18",
        profileCreatedBy: "Self",
        accountStatus: "active",
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        updatedAt: now,
      },
      verification: {
        userId: "usr-vip-sneha",
        mobileVerified: true,
        emailVerified: true,
        mobileOtpAttempts: 0,
        emailOtpAttempts: 0,
      },
      profileMeta: {
        userId: "usr-vip-sneha",
        profileStatus: "complete",
        profileCompletion: 95,
        isNewUser: false,
        primaryPhotoUrl: "/3.jpg",
        city: "Mumbai",
        state: "Maharashtra",
        occupation: "Chartered Accountant",
        education: "CA / B.Com",
        annualIncome: "₹20 - 30 Lakhs",
      },
      role: {
        userId: "usr-vip-sneha",
        role: "vip",
        permissions: ["browse", "send_interest", "chat", "view_contacts", "priority_search"],
      },
      progress: {
        userId: "usr-vip-sneha",
        currentStep: "completed",
        updatedAt: now,
      },
    },
    {
      user: {
        id: "usr-expired-aditya",
        fullName: "Aditya Joshi",
        mobile: "9866677788",
        email: "aditya.joshi@vivahkarlo.in",
        passwordHash: defaultHash,
        gender: "Male",
        dob: "1994-08-11",
        profileCreatedBy: "Self",
        accountStatus: "active",
        createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
        updatedAt: now,
      },
      verification: {
        userId: "usr-expired-aditya",
        mobileVerified: true,
        emailVerified: true,
        mobileOtpAttempts: 0,
        emailOtpAttempts: 0,
      },
      profileMeta: {
        userId: "usr-expired-aditya",
        profileStatus: "complete",
        profileCompletion: 100,
        isNewUser: false,
        primaryPhotoUrl: "/4.jpg",
        city: "Nagpur",
        state: "Maharashtra",
        occupation: "Architect",
        education: "B.Arch",
        annualIncome: "₹18 - 25 Lakhs",
      },
      role: {
        userId: "usr-expired-aditya",
        role: "member",
        permissions: ["browse", "send_interest"],
      },
      progress: {
        userId: "usr-expired-aditya",
        currentStep: "completed",
        updatedAt: now,
      },
    },
    {
      user: {
        id: "usr-verified-meera",
        fullName: "Meera Nair",
        mobile: "9877788899",
        email: "meera.nair@vivahkarlo.in",
        passwordHash: defaultHash,
        gender: "Female",
        dob: "1998-09-25",
        profileCreatedBy: "Parents",
        accountStatus: "active",
        createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
        updatedAt: now,
      },
      verification: {
        userId: "usr-verified-meera",
        mobileVerified: true,
        emailVerified: true,
        mobileOtpAttempts: 0,
        emailOtpAttempts: 0,
      },
      profileMeta: {
        userId: "usr-verified-meera",
        profileStatus: "complete",
        profileCompletion: 90,
        isNewUser: false,
        primaryPhotoUrl: "/1.jpg",
        city: "Bengaluru",
        state: "Karnataka",
        occupation: "Data Scientist",
        education: "M.Tech AI",
        annualIncome: "₹25 - 35 Lakhs",
      },
      role: {
        userId: "usr-verified-meera",
        role: "member",
        permissions: ["browse", "send_interest"],
      },
      progress: {
        userId: "usr-verified-meera",
        currentStep: "completed",
        updatedAt: now,
      },
    },
    {
      user: {
        id: "usr-vip-rajesh",
        fullName: "Rajesh Iyer",
        mobile: "9888899900",
        email: "rajesh.iyer@vivahkarlo.in",
        passwordHash: defaultHash,
        gender: "Male",
        dob: "1993-12-05",
        profileCreatedBy: "Self",
        accountStatus: "active",
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        updatedAt: now,
      },
      verification: {
        userId: "usr-vip-rajesh",
        mobileVerified: true,
        emailVerified: true,
        mobileOtpAttempts: 0,
        emailOtpAttempts: 0,
      },
      profileMeta: {
        userId: "usr-vip-rajesh",
        profileStatus: "complete",
        profileCompletion: 100,
        isNewUser: false,
        primaryPhotoUrl: "/2.jpg",
        city: "Chennai",
        state: "Tamil Nadu",
        occupation: "Product Manager",
        education: "B.Tech + MBA",
        annualIncome: "₹30 - 45 Lakhs",
      },
      role: {
        userId: "usr-vip-rajesh",
        role: "vip",
        permissions: ["browse", "send_interest", "chat", "view_contacts", "priority_search"],
      },
      progress: {
        userId: "usr-vip-rajesh",
        currentStep: "completed",
        updatedAt: now,
      },
    },
    {
      user: {
        id: "usr-new-pooja",
        fullName: "Pooja Gupta",
        mobile: "9899900011",
        email: "pooja.gupta@vivahkarlo.in",
        passwordHash: defaultHash,
        gender: "Female",
        dob: "1999-01-30",
        profileCreatedBy: "Self",
        accountStatus: "active",
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        updatedAt: now,
      },
      verification: {
        userId: "usr-new-pooja",
        mobileVerified: true,
        emailVerified: true,
        mobileOtpAttempts: 0,
        emailOtpAttempts: 0,
      },
      profileMeta: {
        userId: "usr-new-pooja",
        profileStatus: "incomplete",
        profileCompletion: 45,
        isNewUser: true,
        primaryPhotoUrl: "/3.jpg",
        city: "Lucknow",
        state: "Uttar Pradesh",
        occupation: "Graphic Designer",
        education: "B.Des",
        annualIncome: "₹8 - 12 Lakhs",
      },
      role: {
        userId: "usr-new-pooja",
        role: "member",
        permissions: ["complete_profile"],
      },
      progress: {
        userId: "usr-new-pooja",
        currentStep: "completed",
        updatedAt: now,
      },
    },
  ];
}

interface StoredAuthState {
  accounts: AccountBundle[];
  activeUserId: string | null;
  activeSession: UserSessionRecord | null;
  statusNoticeUserId: string | null;
  loginAttempts: number;
  loginLockedUntil: number | null;
}

export interface RegisterStep1Input {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  gender: "Male" | "Female";
  dob: string;
}

export interface ActionResult<T = undefined> {
  ok: boolean;
  error?: string;
  code?:
    | "DUPLICATE_MOBILE"
    | "DUPLICATE_EMAIL"
    | "INVALID_CREDENTIALS"
    | "RATE_LIMITED"
    | "SUSPENDED"
    | "DELETED"
    | "OTP_EXPIRED"
    | "WRONG_OTP"
    | "NOT_FOUND";
  redirectTo?: LoginPostDestination;
  data?: T;
}

interface AuthAccountContextValue {
  accounts: AccountBundle[];
  currentAccount: AccountBundle | null;
  statusNoticeAccount: AccountBundle | null;
  activeSession: UserSessionRecord | null;
  loginLockedUntil: number | null;
  isMobileRegistered: (mobile: string) => boolean;
  isEmailRegistered: (email: string) => boolean;
  updateProfileProgress: (completion: number, userId?: string) => void;
  adminSetAccountStatus: (
    userId: string,
    status: AccountStatus,
    reason?: string
  ) => void;
  adminVerifyUser: (userId: string) => void;
  adminSetUserRole: (userId: string, role: "member" | "vip" | "admin") => void;
  adminUpdateAccount: (
    userId: string,
    updates: { user?: Partial<AccountBundle["user"]>; profileMeta?: Record<string, any> }
  ) => void;
  adminCreateAccount: (input: {
    fullName: string;
    email: string;
    mobile: string;
    password?: string;
    gender: string;
    dob: string;
    profileCreatedBy?: string;
    religion?: string;
    caste?: string;
    city?: string;
    state?: string;
    occupation?: string;
  }) => AccountBundle;
  adminResetPassword: (userId: string, newPassword?: string) => string;
  adminDeleteAccount: (userId: string, permanent?: boolean) => void;
  registerStep1: (input: RegisterStep1Input) => ActionResult<{ otp: string }>;
  sendOtp: (
    channel: "mobile" | "email",
    userId?: string
  ) => ActionResult<{ otp: string; expiresAt: number }>;
  verifyOtp: (
    channel: "mobile" | "email",
    code: string,
    userId?: string
  ) => ActionResult<{ nextRoute: string }>;
  expireOtpForDemo: (channel: "mobile" | "email", userId?: string) => void;
  setProfileCreatedBy: (
    choice: ProfileCreatedByOption,
    userId?: string
  ) => ActionResult;
  loginWithCredentials: (
    identifier: string,
    password: string
  ) => ActionResult<{ destination: LoginPostDestination }>;
  loginWithGoogle: (googleProfile: {
    email: string;
    fullName: string;
    photoUrl?: string;
  }) => ActionResult<{ destination: LoginPostDestination }>;
  reactivateMyAccount: (userId: string) => ActionResult;
  findAccountByIdentifier: (identifier: string) => AccountBundle | undefined;
  resetPasswordWithOtp: (
    identifier: string,
    newPassword: string
  ) => ActionResult;
  logout: () => void;
  resetDemoAccounts: () => void;
}

const AuthAccountContext = createContext<AuthAccountContextValue | undefined>(
  undefined
);

function loadStoredState(): StoredAuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredAuthState;
      if (Array.isArray(parsed.accounts) && parsed.accounts.length > 0) {
        const initialSeeds = createInitialSeedAccounts();
        for (const seed of initialSeeds) {
          if (!parsed.accounts.some((a) => a.user.id === seed.user.id)) {
            parsed.accounts.push(seed);
          }
        }
        return parsed;
      }
    }
  } catch {
    // Fallback to clean seed accounts
  }

  return {
    accounts: createInitialSeedAccounts(),
    activeUserId: null,
    activeSession: null,
    statusNoticeUserId: null,
    loginAttempts: 0,
    loginLockedUntil: null,
  };
}

export function resolvePostLoginDestination(
  bundle: AccountBundle
): LoginPostDestination {
  if (
    bundle.user.accountStatus === "suspended" ||
    bundle.user.accountStatus === "deleted"
  ) {
    return "/account-status";
  }
  if (
    bundle.user.accountStatus === "pending_verification" ||
    !bundle.verification.mobileVerified ||
    !bundle.verification.emailVerified
  ) {
    return "/verify-otp";
  }
  if (bundle.progress.currentStep !== "completed") {
    return "/profile-created-by";
  }
  return "/dashboard";
}

export const AuthAccountProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<StoredAuthState>(loadStoredState);

  // Synchronize state from backend Supabase / database on initial mount
  useEffect(() => {
    fetch("/api/v1/admin/accounts")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && Array.isArray(data.accounts) && data.accounts.length > 0) {
          setState((prev) => ({
            ...prev,
            accounts: data.accounts,
          }));
        }
      })
      .catch((err) => {
        // Silently fallback to locally stored snapshot
        console.info("[Database] Client hydrated from local snapshot:", err?.message || "offline");
      });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const currentAccount =
    state.accounts.find((a) => a.user.id === state.activeUserId) ?? null;

  const statusNoticeAccount =
    state.accounts.find((a) => a.user.id === state.statusNoticeUserId) ?? null;

  const updateAccount = (
    userId: string,
    updater: (bundle: AccountBundle) => AccountBundle
  ) => {
    setState((prev) => ({
      ...prev,
      accounts: prev.accounts.map((acc) =>
        acc.user.id === userId ? updater(acc) : acc
      ),
    }));
  };

  const findAccountByIdentifier = (identifier: string) => {
    const emailNorm = normalizeEmail(identifier);
    const mobileNorm = normalizeMobile(identifier);
    return state.accounts.find(
      (a) =>
        (emailNorm && a.user.email === emailNorm) ||
        (mobileNorm.length >= 10 && a.user.mobile === mobileNorm)
    );
  };

  const isMobileRegistered = (mobile: string): boolean => {
    const mobileNorm = normalizeMobile(mobile);
    if (mobileNorm.length < 10) return false;
    return state.accounts.some((a) => a.user.mobile === mobileNorm);
  };

  const isEmailRegistered = (email: string): boolean => {
    const emailNorm = normalizeEmail(email);
    if (!emailNorm || !emailNorm.includes("@")) return false;
    return state.accounts.some((a) => a.user.email === emailNorm);
  };

  const updateProfileProgress = (completion: number, userId?: string) => {
    const targetId = userId ?? state.activeUserId;
    if (!targetId) return;
    const clamped = Math.max(0, Math.min(100, Math.round(completion)));
    updateAccount(targetId, (acc) => ({
      ...acc,
      profileMeta: {
        ...acc.profileMeta,
        profileCompletion: clamped,
        profileStatus: clamped >= 80 ? "complete" : "incomplete",
        isNewUser: clamped < 80,
      },
      role: {
        ...acc.role,
        permissions:
          clamped >= 80
            ? ["browse", "send_interest", "chat", "view_contacts"]
            : ["complete_profile"],
      },
    }));
  };

  const adminSetAccountStatus = (
    userId: string,
    status: AccountStatus,
    reason?: string
  ) => {
    const now = new Date().toISOString();
    updateAccount(userId, (acc) => ({
      ...acc,
      user: {
        ...acc.user,
        accountStatus: status,
        suspensionReason:
          status === "suspended"
            ? reason || "Suspended by Admin Moderation Desk."
            : undefined,
        deletedAt: status === "deleted" ? now : undefined,
        updatedAt: now,
      },
    }));

    // Database Sync
    fetch(`/api/v1/admin/accounts/${userId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reason }),
    }).catch((err) => console.warn("[DB Sync] Admin status update error:", err));
  };

  const adminVerifyUser = (userId: string) => {
    const now = new Date().toISOString();
    updateAccount(userId, (acc) => ({
      ...acc,
      user: {
        ...acc.user,
        accountStatus:
          acc.user.accountStatus === "pending_verification"
            ? "active"
            : acc.user.accountStatus,
        updatedAt: now,
      },
      verification: {
        ...acc.verification,
        mobileVerified: true,
        emailVerified: true,
      },
      progress: {
        ...acc.progress,
        currentStep: "completed",
        updatedAt: now,
      },
    }));

    // Database Sync
    fetch(`/api/v1/admin/accounts/${userId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "active" }),
    }).catch((err) => console.warn("[DB Sync] Admin verify update error:", err));
  };

  const adminSetUserRole = (
    userId: string,
    role: "member" | "vip" | "admin"
  ) => {
    updateAccount(userId, (acc) => ({
      ...acc,
      role: {
        userId,
        role,
        permissions:
          role === "admin"
            ? ["all_admin", "manage_users", "verify_kyc", "view_payments"]
            : role === "vip"
            ? ["browse", "send_interest", "chat", "view_contacts"]
            : ["browse", "send_interest"],
      },
    }));

    // Database Sync
    fetch(`/api/v1/admin/accounts/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    }).catch((err) => console.warn("[DB Sync] Admin role update error:", err));
  };

  const adminUpdateAccount = (
    userId: string,
    updates: { user?: Partial<AccountBundle["user"]>; profileMeta?: Record<string, any> }
  ) => {
    const now = new Date().toISOString();
    updateAccount(userId, (acc) => ({
      ...acc,
      user: {
        ...acc.user,
        ...(updates.user || {}),
        updatedAt: now,
      },
      profileMeta: {
        ...acc.profileMeta,
        ...(updates.profileMeta || {}),
        updatedAt: now,
      },
    }));

    fetch(`/api/v1/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }).catch((err) => console.warn("[DB Sync] Admin user edit error:", err));
  };

  const adminCreateAccount = (input: {
    fullName: string;
    email: string;
    mobile: string;
    password?: string;
    gender: string;
    dob: string;
    profileCreatedBy?: string;
    religion?: string;
    caste?: string;
    city?: string;
    state?: string;
    occupation?: string;
  }): AccountBundle => {
    const now = new Date().toISOString();
    const newId = `usr-${Date.now().toString().slice(-6)}`;
    const pass = input.password || "Vivah@2026";
    const newBundle: AccountBundle = {
      user: {
        id: newId,
        fullName: input.fullName,
        mobile: input.mobile.replace(/\D/g, "").slice(-10),
        email: input.email.toLowerCase().trim(),
        passwordHash: demoHashPassword(pass),
        gender: input.gender,
        dob: input.dob,
        profileCreatedBy: (input.profileCreatedBy as any) || "Self",
        accountStatus: "active",
        createdAt: now,
        updatedAt: now,
      },
      verification: {
        userId: newId,
        mobileVerified: true,
        emailVerified: true,
        mobileOtpAttempts: 0,
        emailOtpAttempts: 0,
        updatedAt: now,
      },
      profileMeta: {
        userId: newId,
        profileStatus: "complete",
        profileCompletion: 85,
        isNewUser: true,
        religion: input.religion || "Hindu",
        caste: input.caste || "Brahmin",
        city: input.city || "Pune",
        state: input.state || "Maharashtra",
        occupation: input.occupation || "Professional",
        primaryPhotoUrl: input.gender === "Female" ? "/1.jpg" : "/2.jpg",
        createdAt: now,
        updatedAt: now,
      },
      role: {
        userId: newId,
        role: "member",
        permissions: ["browse", "send_interest", "chat"],
        updatedAt: now,
      },
      progress: {
        userId: newId,
        currentStep: "completed",
        updatedAt: now,
      },
    };

    setState((prev) => ({
      ...prev,
      accounts: [newBundle, ...prev.accounts],
    }));

    fetch("/api/v1/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBundle),
    }).catch((err) => console.warn("[DB Sync] Admin create user error:", err));

    return newBundle;
  };

  const adminResetPassword = (userId: string, newPassword?: string): string => {
    const now = new Date().toISOString();
    const pass = newPassword || `Vivah#${Math.floor(1000 + Math.random() * 9000)}`;
    const newHash = demoHashPassword(pass);

    updateAccountBundle(userId, (acc) => ({
      ...acc,
      user: {
        ...acc.user,
        passwordHash: newHash,
        updatedAt: now,
      },
    }));

    fetch(`/api/v1/admin/users/${userId}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pass }),
    }).catch((err) => console.warn("[DB Sync] Admin reset password error:", err));

    return pass;
  };

  const adminDeleteAccount = (userId: string, permanent: boolean = false) => {
    if (permanent) {
      setState((prev) => ({
        ...prev,
        accounts: prev.accounts.filter((a) => a.user.id !== userId),
      }));
      fetch(`/api/v1/admin/accounts/${userId}`, { method: "DELETE" })
        .catch((err) => console.warn("[DB Sync] Admin delete user error:", err));
    } else {
      adminSetAccountStatus(userId, "deleted", "Permanently deleted by Admin command.");
    }
  };

  const registerStep1 = (
    input: RegisterStep1Input
  ): ActionResult<{ otp: string }> => {
    const mobile = normalizeMobile(input.mobile);
    const email = normalizeEmail(input.email);

    const existingMobile = state.accounts.find((a) => a.user.mobile === mobile);
    if (existingMobile) {
      return {
        ok: false,
        code: "DUPLICATE_MOBILE",
        error:
          "This mobile number is already registered. Please sign in to your existing account.",
      };
    }

    const existingEmail = state.accounts.find((a) => a.user.email === email);
    if (existingEmail) {
      return {
        ok: false,
        code: "DUPLICATE_EMAIL",
        error:
          "This email address is already registered. Please sign in or reset your password.",
      };
    }

    const now = new Date().toISOString();
    const userId = `usr-${Date.now()}`;
    const otp = generateSixDigitOtp();

    const newBundle: AccountBundle = {
      user: {
        id: userId,
        fullName: input.fullName.trim(),
        mobile,
        email,
        passwordHash: demoHashPassword(input.password),
        gender: input.gender,
        dob: input.dob,
        accountStatus: "pending_verification",
        createdAt: now,
        updatedAt: now,
      },
      verification: {
        userId,
        mobileVerified: false,
        emailVerified: false,
        mobileOtpCode: otp,
        mobileOtpExpiresAt: Date.now() + OTP_TTL_MS,
        mobileOtpAttempts: 0,
        emailOtpAttempts: 0,
      },
      profileMeta: {
        userId,
        profileStatus: "incomplete",
        profileCompletion: 0,
        isNewUser: true,
      },
      role: {
        userId,
        role: "member",
        permissions: ["verify_account"],
      },
      progress: {
        userId,
        currentStep: 2,
        updatedAt: now,
      },
    };

    const session: UserSessionRecord = {
      sessionId: `sess-${Date.now()}`,
      userId,
      accessToken: `demo_jwt_${userId}`,
      deviceLabel: navigator.userAgent.includes("Mobile")
        ? "Mobile Browser"
        : "Desktop Browser",
      createdAt: now,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
    };

    setState((prev) => ({
      ...prev,
      accounts: [newBundle, ...prev.accounts],
      activeUserId: userId,
      activeSession: session,
      statusNoticeUserId: null,
    }));

    // Asynchronously dispatch database creation to backend / Supabase
    fetch("/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: input.fullName,
        mobile,
        email,
        password: input.password,
        gender: input.gender,
        dob: input.dob,
        profileCreatedBy: "Self",
      }),
    }).catch((err) => console.warn("[DB Sync] Background registration sync error:", err));

    return { ok: true, data: { otp } };
  };

  const sendOtp = (
    channel: "mobile" | "email",
    userId?: string
  ): ActionResult<{ otp: string; expiresAt: number }> => {
    const targetId = userId ?? state.activeUserId;
    const bundle = state.accounts.find((a) => a.user.id === targetId);
    if (!bundle) {
      return { ok: false, code: "NOT_FOUND", error: "Account not found." };
    }

    const otp = generateSixDigitOtp();
    const expiresAt = Date.now() + OTP_TTL_MS;

    updateAccount(bundle.user.id, (acc) => ({
      ...acc,
      verification:
        channel === "mobile"
          ? {
              ...acc.verification,
              mobileOtpCode: otp,
              mobileOtpExpiresAt: expiresAt,
              mobileOtpAttempts: 0,
              mobileLockedUntil: undefined,
            }
          : {
              ...acc.verification,
              emailOtpCode: otp,
              emailOtpExpiresAt: expiresAt,
              emailOtpAttempts: 0,
              emailLockedUntil: undefined,
            },
    }));

    return { ok: true, data: { otp, expiresAt } };
  };

  const expireOtpForDemo = (channel: "mobile" | "email", userId?: string) => {
    const targetId = userId ?? state.activeUserId;
    if (!targetId) return;
    updateAccount(targetId, (acc) => ({
      ...acc,
      verification:
        channel === "mobile"
          ? { ...acc.verification, mobileOtpExpiresAt: Date.now() - 1000 }
          : { ...acc.verification, emailOtpExpiresAt: Date.now() - 1000 },
    }));
  };

  const verifyOtp = (
    channel: "mobile" | "email",
    code: string,
    userId?: string
  ): ActionResult<{ nextRoute: string }> => {
    const targetId = userId ?? state.activeUserId;
    const bundle = state.accounts.find((a) => a.user.id === targetId);
    if (!bundle) {
      return { ok: false, code: "NOT_FOUND", error: "Account not found." };
    }

    const v = bundle.verification;
    const lockedUntil =
      channel === "mobile" ? v.mobileLockedUntil : v.emailLockedUntil;
    if (lockedUntil && Date.now() < lockedUntil) {
      const secs = Math.ceil((lockedUntil - Date.now()) / 1000);
      return {
        ok: false,
        code: "RATE_LIMITED",
        error: `Too many incorrect OTP attempts. Please try again in ${secs} seconds.`,
      };
    }

    const expectedOtp = channel === "mobile" ? v.mobileOtpCode : v.emailOtpCode;
    const expiresAt =
      channel === "mobile" ? v.mobileOtpExpiresAt : v.emailOtpExpiresAt;

    if (!expiresAt || Date.now() > expiresAt) {
      return {
        ok: false,
        code: "OTP_EXPIRED",
        error: "This OTP has expired. Please request a new OTP.",
      };
    }

    if (code.trim() !== expectedOtp) {
      const currentAttempts =
        (channel === "mobile" ? v.mobileOtpAttempts : v.emailOtpAttempts) + 1;
      const shouldLock = currentAttempts >= MAX_OTP_ATTEMPTS;
      const lockTime = shouldLock ? Date.now() + OTP_RATE_LIMIT_MS : undefined;

      updateAccount(bundle.user.id, (acc) => ({
        ...acc,
        verification:
          channel === "mobile"
            ? {
                ...acc.verification,
                mobileOtpAttempts: currentAttempts,
                mobileLockedUntil: lockTime,
              }
            : {
                ...acc.verification,
                emailOtpAttempts: currentAttempts,
                emailLockedUntil: lockTime,
              },
      }));

      if (shouldLock) {
        return {
          ok: false,
          code: "RATE_LIMITED",
          error:
            "3 consecutive wrong OTP attempts detected. Locked for 60 seconds for security.",
        };
      }

      const remaining = MAX_OTP_ATTEMPTS - currentAttempts;
      return {
        ok: false,
        code: "WRONG_OTP",
        error: `Invalid OTP entered. ${remaining} attempt(s) remaining.`,
      };
    }

    const now = new Date().toISOString();

    if (channel === "mobile") {
      updateAccount(bundle.user.id, (acc) => {
        const bothVerified = acc.verification.emailVerified;
        const emailOtp = generateSixDigitOtp();
        return {
          ...acc,
          user: {
            ...acc.user,
            accountStatus: bothVerified ? "active" : "pending_verification",
            updatedAt: now,
          },
          verification: {
            ...acc.verification,
            mobileVerified: true,
            mobileOtpAttempts: 0,
            mobileLockedUntil: undefined,
            emailOtpCode: bothVerified ? undefined : emailOtp,
            emailOtpExpiresAt: bothVerified
              ? undefined
              : Date.now() + OTP_TTL_MS,
            emailOtpAttempts: 0,
          },
          progress: {
            ...acc.progress,
            currentStep: bothVerified ? 4 : 3,
            updatedAt: now,
          },
        };
      });

      return {
        ok: true,
        data: {
          nextRoute: bundle.verification.emailVerified
            ? "/profile-created-by"
            : "/verify-otp",
        },
      };
    }

    // Email verification succeeds -> if mobile also verified, account becomes active
    updateAccount(bundle.user.id, (acc) => {
      const bothVerified = acc.verification.mobileVerified;
      return {
        ...acc,
        user: {
          ...acc.user,
          accountStatus: bothVerified ? "active" : "pending_verification",
          updatedAt: now,
        },
        verification: {
          ...acc.verification,
          emailVerified: true,
          emailOtpAttempts: 0,
          emailLockedUntil: undefined,
        },
        role: {
          ...acc.role,
          permissions: bothVerified
            ? ["complete_profile"]
            : acc.role.permissions,
        },
        progress: {
          ...acc.progress,
          currentStep: bothVerified ? 4 : 2,
          updatedAt: now,
        },
      };
    });

    return { ok: true, data: { nextRoute: "/profile-created-by" } };
  };

  const setProfileCreatedBy = (
    choice: ProfileCreatedByOption,
    userId?: string
  ): ActionResult => {
    const targetId = userId ?? state.activeUserId;
    const bundle = state.accounts.find((a) => a.user.id === targetId);
    if (!bundle) {
      return { ok: false, code: "NOT_FOUND", error: "Account not found." };
    }
    const now = new Date().toISOString();
    updateAccount(bundle.user.id, (acc) => ({
      ...acc,
      user: {
        ...acc.user,
        profileCreatedBy: choice,
        accountStatus:
          acc.verification.mobileVerified && acc.verification.emailVerified
            ? "active"
            : "pending_verification",
        updatedAt: now,
      },
      progress: {
        ...acc.progress,
        currentStep: "completed",
        updatedAt: now,
      },
    }));

    // Database Sync
    fetch("/api/v1/auth/set-profile-creator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: bundle.user.id, profileCreatedBy: choice }),
    }).catch((err) => console.warn("[DB Sync] Profile creator update error:", err));

    return { ok: true };
  };

  const loginWithCredentials = (
    identifier: string,
    password: string
  ): ActionResult<{ destination: LoginPostDestination }> => {
    if (state.loginLockedUntil && Date.now() < state.loginLockedUntil) {
      const secs = Math.ceil((state.loginLockedUntil - Date.now()) / 1000);
      return {
        ok: false,
        code: "RATE_LIMITED",
        error: `Too many failed login attempts. Please wait ${secs} seconds before trying again.`,
      };
    }

    const bundle = findAccountByIdentifier(identifier);
    const inputHash = demoHashPassword(password);

    if (!bundle || bundle.user.passwordHash !== inputHash) {
      const attempts = state.loginAttempts + 1;
      const locked = attempts >= MAX_LOGIN_ATTEMPTS;
      setState((prev) => ({
        ...prev,
        loginAttempts: locked ? 0 : attempts,
        loginLockedUntil: locked ? Date.now() + LOGIN_RATE_LIMIT_MS : null,
      }));
      return {
        ok: false,
        code: "INVALID_CREDENTIALS",
        error: locked
          ? "5 failed password attempts detected. Account login is temporarily locked for 60 seconds."
          : "Invalid mobile/email or password. Please check your credentials and try again.",
      };
    }

    // Check account status rules before granting session
    if (bundle.user.accountStatus === "suspended") {
      setState((prev) => ({
        ...prev,
        activeUserId: null,
        activeSession: null,
        statusNoticeUserId: bundle.user.id,
        loginAttempts: 0,
        loginLockedUntil: null,
      }));
      return {
        ok: false,
        code: "SUSPENDED",
        redirectTo: "/account-status",
        error:
          "Your account has been temporarily suspended. Please review the Account Status page for details.",
      };
    }

    if (bundle.user.accountStatus === "deleted") {
      setState((prev) => ({
        ...prev,
        activeUserId: null,
        activeSession: null,
        statusNoticeUserId: bundle.user.id,
        loginAttempts: 0,
        loginLockedUntil: null,
      }));
      return {
        ok: false,
        code: "DELETED",
        redirectTo: "/account-status",
        error:
          "This account has been closed under our Account Deletion Policy.",
      };
    }

    const now = new Date().toISOString();
    const session: UserSessionRecord = {
      sessionId: `sess-${Date.now()}`,
      userId: bundle.user.id,
      accessToken: `demo_jwt_${bundle.user.id}_${Date.now()}`,
      deviceLabel: navigator.userAgent.includes("Mobile")
        ? "Mobile Browser"
        : "Desktop Browser",
      createdAt: now,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
    };

    const destination = resolvePostLoginDestination(bundle);

    setState((prev) => ({
      ...prev,
      activeUserId: bundle.user.id,
      activeSession: session,
      statusNoticeUserId: null,
      loginAttempts: 0,
      loginLockedUntil: null,
    }));

    return { ok: true, data: { destination } };
  };

  const resetPasswordWithOtp = (
    identifier: string,
    newPassword: string
  ): ActionResult => {
    const bundle = findAccountByIdentifier(identifier);
    if (!bundle) {
      return {
        ok: false,
        code: "NOT_FOUND",
        error: "No account was found with this mobile number or email address.",
      };
    }
    const now = new Date().toISOString();
    updateAccount(bundle.user.id, (acc) => ({
      ...acc,
      user: {
        ...acc.user,
        passwordHash: demoHashPassword(newPassword),
        updatedAt: now,
      },
    }));
    return { ok: true };
  };

  const loginWithGoogle = (googleProfile: {
    email: string;
    fullName: string;
    photoUrl?: string;
  }): ActionResult<{ destination: LoginPostDestination }> => {
    const cleanEmail = googleProfile.email.trim().toLowerCase();
    const existing = state.accounts.find(
      (a) => a.user.email.toLowerCase() === cleanEmail
    );
    const now = new Date().toISOString();

    if (existing) {
      const session: UserSessionRecord = {
        id: `sess-google-${Date.now()}`,
        userId: existing.user.id,
        sessionToken: `tok_google_${Math.random().toString(36).slice(2)}`,
        deviceInfo: "Google OAuth 2.0 Web Client",
        ipAddress: "103.84.212.14",
        createdAt: now,
        expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
        isActive: true,
      };
      setState((prev) => ({
        ...prev,
        activeUserId: existing.user.id,
        activeSession: session,
        statusNoticeUserId: null,
      }));
      return {
        ok: true,
        data: {
          destination:
            existing.profileMeta.profileStatus === "complete"
              ? "/dashboard"
              : "/profile-wizard",
        },
      };
    }

    const newId = `usr-google-${Date.now()}`;
    const newBundle: AccountBundle = {
      user: {
        id: newId,
        fullName: googleProfile.fullName || "Google Member",
        email: cleanEmail,
        mobile: `98${Math.floor(10000000 + Math.random() * 89999999)}`,
        passwordHash: demoHashPassword(`google_${Date.now()}`),
        gender: "Male",
        dob: "1996-06-15",
        profileCreatedBy: "Self",
        accountStatus: "active",
        createdAt: now,
        updatedAt: now,
      },
      verification: {
        userId: newId,
        mobileVerified: true,
        emailVerified: true,
        mobileOtpAttempts: 0,
        emailOtpAttempts: 0,
      },
      profileMeta: {
        userId: newId,
        profileStatus: "incomplete",
        profileCompletion: 35,
        primaryPhotoUrl: googleProfile.photoUrl || "/2.jpg",
        updatedAt: now,
      } as any,
      role: {
        userId: newId,
        role: "member",
        permissions: ["browse", "send_interest"],
      },
    };

    const session: UserSessionRecord = {
      id: `sess-google-${Date.now()}`,
      userId: newId,
      sessionToken: `tok_google_${Math.random().toString(36).slice(2)}`,
      deviceInfo: "Google OAuth 2.0 Web Client",
      ipAddress: "103.84.212.14",
      createdAt: now,
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      isActive: true,
    };

    setState((prev) => ({
      ...prev,
      accounts: [newBundle, ...prev.accounts],
      activeUserId: newId,
      activeSession: session,
      statusNoticeUserId: null,
    }));

    return { ok: true, data: { destination: "/dashboard" } };
  };

  const reactivateMyAccount = (userId: string): ActionResult => {
    const target = state.accounts.find((a) => a.user.id === userId);
    if (!target) {
      return { ok: false, error: "Account not found." };
    }
    const now = new Date().toISOString();
    const session: UserSessionRecord = {
      id: `sess-react-${Date.now()}`,
      userId,
      sessionToken: `tok_react_${Math.random().toString(36).slice(2)}`,
      deviceInfo: "Self-Service Reactivated Session",
      ipAddress: "103.84.212.14",
      createdAt: now,
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      isActive: true,
    };

    setState((prev) => ({
      ...prev,
      accounts: prev.accounts.map((acc) =>
        acc.user.id === userId
          ? {
              ...acc,
              user: {
                ...acc.user,
                accountStatus: "active",
                statusReason: undefined,
                updatedAt: now,
              },
            }
          : acc
      ),
      activeUserId: userId,
      activeSession: session,
      statusNoticeUserId: null,
    }));

    fetch("/api/v1/settings/reactivate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }).catch(() => {});

    return { ok: true };
  };

  const logout = () => {
    setState((prev) => ({
      ...prev,
      activeUserId: null,
      activeSession: null,
      statusNoticeUserId: null,
    }));
  };

  const resetDemoAccounts = () => {
    const fresh: StoredAuthState = {
      accounts: createInitialSeedAccounts(),
      activeUserId: null,
      activeSession: null,
      statusNoticeUserId: null,
      loginAttempts: 0,
      loginLockedUntil: null,
    };
    setState(fresh);

    // Database Sync
    fetch("/api/v1/admin/database/reset", {
      method: "POST",
    }).catch((err) => console.warn("[DB Sync] Database reset error:", err));
  };

  return (
    <AuthAccountContext.Provider
      value={{
        accounts: state.accounts,
        currentAccount,
        statusNoticeAccount,
        activeSession: state.activeSession,
        loginLockedUntil: state.loginLockedUntil,
        isMobileRegistered,
        isEmailRegistered,
        updateProfileProgress,
        adminSetAccountStatus,
        adminVerifyUser,
        adminSetUserRole,
        adminUpdateAccount,
        adminCreateAccount,
        adminResetPassword,
        adminDeleteAccount,
        registerStep1,
        sendOtp,
        verifyOtp,
        expireOtpForDemo,
        setProfileCreatedBy,
        loginWithCredentials,
        loginWithGoogle,
        reactivateMyAccount,
        findAccountByIdentifier,
        resetPasswordWithOtp,
        logout,
        resetDemoAccounts,
      }}
    >
      {children}
    </AuthAccountContext.Provider>
  );
};

export function useAuthAccount() {
  const ctx = useContext(AuthAccountContext);
  if (!ctx) {
    throw new Error("useAuthAccount must be used inside AuthAccountProvider");
  }
  return ctx;
}
