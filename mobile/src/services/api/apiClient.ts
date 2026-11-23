import { AppConfig } from "../../constants/config";
import { SecureStorageService } from "../security/secureStorage";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
  message?: string;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${AppConfig.apiBaseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const token = await SecureStorageService.getAuthToken();

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Client-Platform": "mobile-app",
    "X-App-Version": AppConfig.appVersion,
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AppConfig.apiTimeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type") || "";
    let data: any = null;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error:
          data?.error ||
          data?.message ||
          `Request failed with status code ${response.status}`,
        data,
      };
    }

    return {
      success: true,
      status: response.status,
      data,
      message: data?.message,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      return {
        success: false,
        status: 408,
        error: "Request timed out. Please check your network connection and try again.",
      };
    }

    return {
      success: false,
      status: 0,
      error:
        error.message ||
        "Unable to connect to Vivah Kar Lo server. Please verify network access.",
    };
  }
}
