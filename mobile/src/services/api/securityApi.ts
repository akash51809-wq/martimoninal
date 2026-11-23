import { apiRequest, ApiResponse } from "./apiClient";

export const SecurityApi = {
  async uploadKycDocument(userId: string, docType: string, docBase64: string): Promise<ApiResponse> {
    return apiRequest("api/v1/security/kyc/upload", {
      method: "POST",
      body: JSON.stringify({ userId, docType, docBase64 }),
    });
  },

  async verifySelfie(userId: string, selfieBase64: string): Promise<ApiResponse> {
    return apiRequest("api/v1/security/selfie/verify", {
      method: "POST",
      body: JSON.stringify({ userId, selfieBase64 }),
    });
  },

  async getTrustBadges(userId: string): Promise<ApiResponse> {
    return apiRequest(`api/v1/security/trust-badges/${userId}`, {
      method: "GET",
    });
  },

  async reportProfile(payload: {
    reporterId: string;
    reportedUserId: string;
    reportedUserName: string;
    reason: string;
    severity?: "Low" | "Medium" | "High" | "Critical";
  }): Promise<ApiResponse> {
    return apiRequest("api/v1/security/report-profile", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updatePrivacySettings(userId: string, settings: any): Promise<ApiResponse> {
    return apiRequest("api/v1/security/privacy/settings", {
      method: "PUT",
      body: JSON.stringify({ userId, settings }),
    });
  },

  async blockUser(userId: string, blockedUserId: string, reason?: string): Promise<ApiResponse> {
    return apiRequest("api/v1/security/privacy/block", {
      method: "POST",
      body: JSON.stringify({ userId, blockedUserId, reason }),
    });
  },

  async getBlockedUsers(userId: string): Promise<ApiResponse> {
    return apiRequest(`api/v1/security/privacy/blocked-users?userId=${userId}`, {
      method: "GET",
    });
  },
};
