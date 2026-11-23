import * as Updates from "expo-updates";

export interface UpdateCheckResult {
  isAvailable: boolean;
  manifest?: any;
  error?: string;
}

export const OtaUpdateService = {
  async checkForUpdate(): Promise<UpdateCheckResult> {
    if (__DEV__) {
      return { isAvailable: false };
    }

    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        return { isAvailable: true, manifest: update.manifest };
      }
      return { isAvailable: false };
    } catch (error: any) {
      console.warn("OTA update check failed:", error);
      return { isAvailable: false, error: error.message };
    }
  },

  async fetchAndApplyUpdate(): Promise<boolean> {
    if (__DEV__) return false;

    try {
      const fetchResult = await Updates.fetchUpdateAsync();
      if (fetchResult.isNew) {
        await Updates.reloadAsync();
        return true;
      }
      return false;
    } catch (error) {
      console.warn("OTA update download or reload failed:", error);
      return false;
    }
  },
};
