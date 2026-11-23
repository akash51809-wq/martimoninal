import { apiRequest, ApiResponse } from "./apiClient";

export interface LoginPayload {
  identity: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  gender: "Male" | "Female" | "Other";
  dob: string;
  profileCreatedBy?: string;
  deviceFingerprint?: string;
}

export interface VerifyOtpPayload {
  userId: string;
  type: "mobile" | "email";
  otpCode: string;
}

export const AuthApi = {
  async checkDuplicate(params: { mobile?: string; email?: string }): Promise<ApiResponse> {
    return apiRequest("api/v1/auth/check-duplicate", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  async register(payload: RegisterPayload): Promise<ApiResponse> {
    return apiRequest("api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async login(payload: LoginPayload): Promise<ApiResponse> {
    return apiRequest("api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async verifyOtp(payload: VerifyOtpPayload): Promise<ApiResponse> {
    return apiRequest("api/v1/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async resendOtp(userId: string, type: "mobile" | "email"): Promise<ApiResponse> {
    return apiRequest("api/v1/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ userId, type }),
    });
  },

  async setProfileCreator(userId: string, profileCreatedBy: string): Promise<ApiResponse> {
    return apiRequest("api/v1/auth/set-profile-creator", {
      method: "POST",
      body: JSON.stringify({ userId, profileCreatedBy }),
    });
  },

  async getSession(): Promise<ApiResponse> {
    return apiRequest("api/v1/auth/session", {
      method: "GET",
    });
  },
};
