import { apiRequest, ApiResponse } from "./apiClient";

export const CommunicationApi = {
  async sendInterest(senderId: string, recipientId: string): Promise<ApiResponse> {
    return apiRequest("api/v1/communication/interests/send", {
      method: "POST",
      body: JSON.stringify({ senderId, recipientId }),
    });
  },

  async respondToInterest(interestId: string, action: "accept" | "decline"): Promise<ApiResponse> {
    return apiRequest(`api/v1/communication/interests/${interestId}/respond`, {
      method: "POST",
      body: JSON.stringify({ action }),
    });
  },

  async getReceivedInterests(userId: string): Promise<ApiResponse> {
    return apiRequest(`api/v1/communication/interests/received?userId=${userId}`, {
      method: "GET",
    });
  },

  async getSentInterests(userId: string): Promise<ApiResponse> {
    return apiRequest(`api/v1/communication/interests/sent?userId=${userId}`, {
      method: "GET",
    });
  },

  async getAcceptedConnections(userId: string): Promise<ApiResponse> {
    return apiRequest(`api/v1/communication/interests/accepted?userId=${userId}`, {
      method: "GET",
    });
  },

  async getDailyInterestQuota(userId: string): Promise<ApiResponse> {
    return apiRequest(`api/v1/communication/interests/quota?userId=${userId}`, {
      method: "GET",
    });
  },

  async getChatThreads(userId: string): Promise<ApiResponse> {
    return apiRequest(`api/v1/communication/chat/threads?userId=${userId}`, {
      method: "GET",
    });
  },

  async getChatMessages(threadId: string): Promise<ApiResponse> {
    return apiRequest(`api/v1/communication/chat/messages/${threadId}`, {
      method: "GET",
    });
  },

  async sendMessage(senderId: string, recipientId: string, text: string): Promise<ApiResponse> {
    return apiRequest("api/v1/communication/chat/send", {
      method: "POST",
      body: JSON.stringify({ senderId, recipientId, text }),
    });
  },
};
