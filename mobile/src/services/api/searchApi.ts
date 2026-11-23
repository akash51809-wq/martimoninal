import { apiRequest, ApiResponse } from "./apiClient";

export interface SearchFilters {
  ageMin?: number;
  ageMax?: number;
  heightMin?: number;
  heightMax?: number;
  gender?: string;
  maritalStatus?: string[];
  religion?: string[];
  caste?: string[];
  motherTongue?: string[];
  state?: string[];
  city?: string[];
  education?: string[];
  occupation?: string[];
  annualIncome?: string[];
  diet?: string[];
  manglik?: string;
  verifiedOnly?: boolean;
  withPhotosOnly?: boolean;
}

export const SearchApi = {
  async browseProfiles(page: number = 1, limit: number = 20): Promise<ApiResponse> {
    return apiRequest(`api/v1/search/browse?page=${page}&limit=${limit}`, {
      method: "GET",
    });
  },

  async queryProfiles(filters: SearchFilters): Promise<ApiResponse> {
    return apiRequest("api/v1/search/query", {
      method: "POST",
      body: JSON.stringify({ filters }),
    });
  },

  async saveSearch(userId: string, name: string, filters: SearchFilters): Promise<ApiResponse> {
    return apiRequest("api/v1/search/save-search", {
      method: "POST",
      body: JSON.stringify({ userId, name, filters }),
    });
  },

  async getSavedSearches(userId: string): Promise<ApiResponse> {
    return apiRequest(`api/v1/search/saved-searches/${userId}`, {
      method: "GET",
    });
  },
};
