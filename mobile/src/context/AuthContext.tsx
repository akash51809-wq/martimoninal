import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SecureStorageService } from "../services/security/secureStorage";
import { BiometricService } from "../services/security/biometricService";
import { AuthApi } from "../services/api/authApi";

export interface UserAccount {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  gender: string;
  dob: string;
  accountStatus: string;
}

export interface UserBundle {
  user: UserAccount;
  profile?: any;
  verification?: {
    mobileVerified: boolean;
    emailVerified: boolean;
    faceVerified?: boolean;
    kycStatus?: string;
  };
  membership?: {
    planName: string;
    isVip: boolean;
    expiresAt?: string;
  };
}

interface AuthContextType {
  token: string | null;
  bundle: UserBundle | null;
  user: UserAccount | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isBiometricLocked: boolean;
  biometricSupported: boolean;
  biometricEnabled: boolean;
  login: (token: string, bundle: UserBundle) => Promise<void>;
  logout: () => Promise<void>;
  unlockWithBiometrics: () => Promise<boolean>;
  setBiometricPreference: (enabled: boolean) => Promise<boolean>;
  updateBundle: (bundle: UserBundle) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [bundle, setBundle] = useState<UserBundle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBiometricLocked, setIsBiometricLocked] = useState<boolean>(false);
  const [biometricSupported, setBiometricSupported] = useState<boolean>(false);
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(false);

  useEffect(() => {
    async function hydrateSession() {
      try {
        const [savedToken, savedBundle, bioPref, bioCaps] = await Promise.all([
          SecureStorageService.getAuthToken(),
          SecureStorageService.getUserBundle(),
          SecureStorageService.isBiometricEnabled(),
          BiometricService.checkBiometricCapabilities(),
        ]);

        const hasBioSupport = bioCaps.isHardwareAvailable && bioCaps.isEnrolled;
        setBiometricSupported(hasBioSupport);
        setBiometricEnabled(bioPref);

        if (savedToken && savedBundle) {
          setToken(savedToken);
          setBundle(savedBundle);

          if (bioPref && hasBioSupport) {
            setIsBiometricLocked(true);
          }
        }
      } catch (error) {
        console.warn("Session hydration error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    hydrateSession();
  }, []);

  const login = async (newToken: string, newBundle: UserBundle) => {
    setToken(newToken);
    setBundle(newBundle);
    setIsBiometricLocked(false);
    await Promise.all([
      SecureStorageService.saveAuthToken(newToken),
      SecureStorageService.saveUserBundle(newBundle),
    ]);
  };

  const logout = async () => {
    setToken(null);
    setBundle(null);
    setIsBiometricLocked(false);
    await SecureStorageService.clearAllSessionData();
  };

  const unlockWithBiometrics = async (): Promise<boolean> => {
    const result = await BiometricService.promptBiometricAuthentication(
      "Unlock Vivah Kar Lo"
    );
    if (result.success) {
      setIsBiometricLocked(false);
      return true;
    }
    return false;
  };

  const setBiometricPreference = async (enabled: boolean): Promise<boolean> => {
    const success = await SecureStorageService.setBiometricEnabled(enabled);
    if (success) {
      setBiometricEnabled(enabled);
    }
    return success;
  };

  const updateBundle = async (newBundle: UserBundle) => {
    setBundle(newBundle);
    await SecureStorageService.saveUserBundle(newBundle);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        bundle,
        user: bundle?.user || null,
        isAuthenticated: Boolean(token && bundle),
        isLoading,
        isBiometricLocked,
        biometricSupported,
        biometricEnabled,
        login,
        logout,
        unlockWithBiometrics,
        setBiometricPreference,
        updateBundle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
