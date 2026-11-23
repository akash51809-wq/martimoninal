import * as SecureStore from "expo-secure-store";
import { AppConfig } from "../../constants/config";

export interface StoredSessionBundle {
  token: string;
  user: any;
  savedAt: string;
}

export const SecureStorageService = {
  async saveAuthToken(token: string): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(AppConfig.tokenStorageKey, token, {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      });
      return true;
    } catch (error) {
      console.warn("SecureStore error saving auth token:", error);
      return false;
    }
  },

  async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(AppConfig.tokenStorageKey);
    } catch (error) {
      console.warn("SecureStore error reading auth token:", error);
      return null;
    }
  },

  async removeAuthToken(): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(AppConfig.tokenStorageKey);
      return true;
    } catch (error) {
      console.warn("SecureStore error deleting auth token:", error);
      return false;
    }
  },

  async saveUserBundle(bundle: any): Promise<boolean> {
    try {
      const payload = JSON.stringify(bundle);
      await SecureStore.setItemAsync(AppConfig.userBundleStorageKey, payload, {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      });
      return true;
    } catch (error) {
      console.warn("SecureStore error saving user bundle:", error);
      return false;
    }
  },

  async getUserBundle(): Promise<any | null> {
    try {
      const payload = await SecureStore.getItemAsync(AppConfig.userBundleStorageKey);
      if (!payload) return null;
      return JSON.parse(payload);
    } catch (error) {
      console.warn("SecureStore error reading user bundle:", error);
      return null;
    }
  },

  async removeUserBundle(): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(AppConfig.userBundleStorageKey);
      return true;
    } catch (error) {
      console.warn("SecureStore error deleting user bundle:", error);
      return false;
    }
  },

  async setBiometricEnabled(enabled: boolean): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(AppConfig.biometricPrefKey, enabled ? "true" : "false");
      return true;
    } catch (error) {
      console.warn("SecureStore error saving biometric preference:", error);
      return false;
    }
  },

  async isBiometricEnabled(): Promise<boolean> {
    try {
      const val = await SecureStore.getItemAsync(AppConfig.biometricPrefKey);
      return val === "true";
    } catch (error) {
      return false;
    }
  },

  async clearAllSessionData(): Promise<void> {
    await Promise.allSettled([
      SecureStore.deleteItemAsync(AppConfig.tokenStorageKey),
      SecureStore.deleteItemAsync(AppConfig.userBundleStorageKey),
    ]);
  },
};
