import { apiRequest, ApiResponse } from "./apiClient";

export interface KundliMatchRequest {
  boyRashi: string;
  boyNakshatra: string;
  girlRashi: string;
  girlNakshatra: string;
}

export const KundliApi = {
  async calculateGunaMilan(data: KundliMatchRequest): Promise<ApiResponse> {
    return apiRequest("api/v1/kundli/calculate-guna", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async matchWithProfile(userId: string, targetProfileId: string): Promise<ApiResponse> {
    return apiRequest("api/v1/kundli/match-profile", {
      method: "POST",
      body: JSON.stringify({ userId, targetProfileId }),
    });
  },
};
