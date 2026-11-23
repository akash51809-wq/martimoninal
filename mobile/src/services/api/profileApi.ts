import { apiRequest, ApiResponse } from "./apiClient";

export const ProfileApi = {
  async getDossier(userId: string): Promise<ApiResponse> {
    return apiRequest(`api/v1/profile/dossier/${userId}`, {
      method: "GET",
    });
  },

  async updateProfileSection(
    userId: string,
    section: "basic" | "religion" | "education" | "career" | "family" | "lifestyle" | "about",
    data: Record<string, any>
  ): Promise<ApiResponse> {
    return apiRequest("api/v1/profile/update", {
      method: "PUT",
      body: JSON.stringify({ userId, section, data }),
    });
  },

  async uploadSanitizedPhoto(userId: string, photoBase64: string): Promise<ApiResponse> {
    return apiRequest("api/v1/security/photo/upload-sanitized", {
      method: "POST",
      body: JSON.stringify({ userId, photoBase64 }),
    });
  },

  async getPhotoGallery(userId: string): Promise<ApiResponse> {
    return apiRequest(`api/v1/profile/${userId}/photos`, {
      method: "GET",
    });
  },
};
