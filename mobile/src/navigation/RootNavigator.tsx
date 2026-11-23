import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { Colors } from "../constants/colors";
import type { RootStackParamList, AuthStackParamList } from "./types";

import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { VerifyOtpScreen } from "../screens/auth/VerifyOtpScreen";
import { ForgotPasswordScreen } from "../screens/auth/ForgotPasswordScreen";

import { AppTabsNavigator } from "./AppTabsNavigator";
import { ProfileDetailScreen } from "../screens/detail/ProfileDetailScreen";
import { ReportProfileModal } from "../screens/detail/ReportProfileModal";
import { EditProfileScreen } from "../screens/main/EditProfileScreen";
import { PartnerPreferencesScreen } from "../screens/main/PartnerPreferencesScreen";
import { KundliMilanScreen } from "../screens/main/KundliMilanScreen";
import { KycVerificationScreen } from "../screens/main/KycVerificationScreen";
import { PrivacySettingsScreen } from "../screens/main/PrivacySettingsScreen";
import { MembershipScreen } from "../screens/main/MembershipScreen";
import { SupportScreen } from "../screens/main/SupportScreen";
import { SettingsScreen } from "../screens/main/SettingsScreen";
import { ChatRoomScreen } from "../screens/main/ChatRoomScreen";
import { Button } from "../components/common/Button";
import { ShieldCheck } from "lucide-react-native";

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, isBiometricLocked, unlockWithBiometrics, logout } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Initializing Vivah Kar Lo Mobile Security...</Text>
      </View>
    );
  }

  // Biometric App Lock Gate Screen
  if (isAuthenticated && isBiometricLocked) {
    return (
      <View style={styles.lockContainer}>
        <View style={styles.lockIconCircle}>
          <ShieldCheck size={44} color={Colors.surface} />
        </View>
        <Text style={styles.lockTitle}>Vivah Kar Lo Locked</Text>
        <Text style={styles.lockSubtitle}>
          Authenticate using Face ID or Fingerprint to access your matrimonial dossier.
        </Text>

        <Button
          title="Unlock with Biometrics"
          variant="primary"
          size="large"
          onPress={unlockWithBiometrics}
          style={styles.unlockBtn}
          icon={<ShieldCheck size={20} color={Colors.surface} />}
        />

        <Button
          title="Sign Out Instead"
          variant="outline"
          size="medium"
          onPress={logout}
          style={styles.signOutBtn}
        />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={AppTabsNavigator} />
          <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="PartnerPreferences" component={PartnerPreferencesScreen} />
          <Stack.Screen name="KundliMilan" component={KundliMilanScreen} />
          <Stack.Screen name="KycVerification" component={KycVerificationScreen} />
          <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
          <Stack.Screen name="Membership" component={MembershipScreen} />
          <Stack.Screen name="Support" component={SupportScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
          <Stack.Screen
            name="ReportProfile"
            component={ReportProfileModal}
            options={{ presentation: "modal" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  lockContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  lockIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    borderWidth: 2,
    borderColor: Colors.goldBorder,
  },
  lockTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary,
  },
  lockSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 28,
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  unlockBtn: {
    width: "100%",
    marginBottom: 12,
  },
  signOutBtn: {
    width: "100%",
  },
});
