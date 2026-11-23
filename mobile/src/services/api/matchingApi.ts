import { apiRequest, ApiResponse } from "./apiClient";

export const MatchingApi = {
  async getRecommendations(userId: string): Promise<ApiResponse> {
    return apiRequest(`api/v1/matches/recommendations?userId=${userId}`, {
      method: "GET",
    });
  },

  async getSmartMatches(userId: string): Promise<ApiResponse> {
    return apiRequest(`api/v1/matches/smart?userId=${userId}`, {
      method: "GET",
    });
  },

  async getPartnerPreferences(userId: string): Promise<ApiResponse> {
    return apiRequest(`api/v1/matches/preferences/${userId}`, {
      method: "GET",
    });
  },

  async updatePartnerPreferences(userId: string, preferences: any): Promise<ApiResponse> {
    return apiRequest("api/v1/matches/preferences", {
      method: "PUT",
      body: JSON.stringify({ userId, preferences }),
    });
  },
};
