import Constants from "expo-constants";
import { Platform } from "react-native";

const getDevHost = (): string => {
  if (Platform.OS === "android") {
    // Android emulator standard loopback to host PC
    return "http://10.0.2.2:3001";
  }
  return "http://localhost:3001";
};

export const AppConfig = {
  appName: "Vivah Kar Lo",
  appVersion: "1.0.0",
  apiBaseUrl:
    Constants.expoConfig?.extra?.apiUrl ||
    (process.env.EXPO_PUBLIC_API_URL ?? getDevHost()),
  apiTimeoutMs: 15000,
  tokenStorageKey: "vivahkarlo_auth_token_secure_v2",
  userBundleStorageKey: "vivahkarlo_user_bundle_secure_v2",
  biometricPrefKey: "vivahkarlo_biometric_enabled_v2",
  dailyInterestLimit: 15,
};
