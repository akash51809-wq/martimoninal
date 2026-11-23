import { apiRequest, ApiResponse } from "./apiClient";

export const MembershipApi = {
  async getPlans(): Promise<ApiResponse> {
    return apiRequest("api/v1/membership/plans", {
      method: "GET",
    });
  },

  async getCurrentMembership(userId: string): Promise<ApiResponse> {
    return apiRequest(`api/v1/membership/current?userId=${userId}`, {
      method: "GET",
    });
  },

  async submitManualPaymentSlip(
    userId: string,
    planId: string,
    transactionRef: string,
    slipBase64: string
  ): Promise<ApiResponse> {
    return apiRequest("api/v1/membership/payment/upload-slip", {
      method: "POST",
      body: JSON.stringify({ userId, planId, transactionRef, slipBase64 }),
    });
  },
};
