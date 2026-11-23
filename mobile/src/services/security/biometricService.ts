import * as LocalAuthentication from "expo-local-authentication";

export interface BiometricStatus {
  isHardwareAvailable: boolean;
  isEnrolled: boolean;
  biometricTypes: LocalAuthentication.AuthenticationType[];
  supportsFaceId: boolean;
  supportsFingerprint: boolean;
}

export const BiometricService = {
  async checkBiometricCapabilities(): Promise<BiometricStatus> {
    try {
      const isHardwareAvailable = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const biometricTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      const supportsFaceId = biometricTypes.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
      );
      const supportsFingerprint = biometricTypes.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT
      );

      return {
        isHardwareAvailable,
        isEnrolled,
        biometricTypes,
        supportsFaceId,
        supportsFingerprint,
      };
    } catch (error) {
      console.warn("Biometric check error:", error);
      return {
        isHardwareAvailable: false,
        isEnrolled: false,
        biometricTypes: [],
        supportsFaceId: false,
        supportsFingerprint: false,
      };
    }
  },

  async promptBiometricAuthentication(promptMessage?: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const caps = await this.checkBiometricCapabilities();
      if (!caps.isHardwareAvailable || !caps.isEnrolled) {
        return { success: false, error: "Biometric hardware is not available or not enrolled" };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: promptMessage || "Unlock your Vivah Kar Lo Matrimonial Account",
        cancelLabel: "Use Password",
        disableDeviceFallback: false,
        fallbackLabel: "Enter Passcode",
      });

      if (result.success) {
        return { success: true };
      }

      return {
        success: false,
        error: result.error || "Authentication cancelled",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Biometric authentication failed",
      };
    }
  },
};
