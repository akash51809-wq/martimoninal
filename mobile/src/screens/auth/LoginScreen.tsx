import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ShieldCheck, Sparkles, Smartphone, Lock } from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { AuthApi } from "../../services/api/authApi";
import { useAuth } from "../../context/AuthContext";
import type { AuthStackParamList } from "../../navigation/types";

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { login, biometricSupported, biometricEnabled, unlockWithBiometrics } = useAuth();

  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!identity.trim()) {
      setError("Please enter your registered mobile number or email.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await AuthApi.login({
        identity: identity.trim(),
        password,
      });

      if (!response.success || !response.data?.token) {
        setError(response.error || "Invalid credentials. Please verify and try again.");
        return;
      }

      await login(response.data.token, response.data.bundle);
    } catch (err: any) {
      setError(err.message || "Login failed. Please check network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricUnlock = async () => {
    const success = await unlockWithBiometrics();
    if (!success) {
      Alert.alert("Biometric Unlock", "Biometric verification cancelled or unavailable.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <View style={styles.iconCircle}>
            <Sparkles size={32} color={Colors.gold} />
          </View>
          <Text style={styles.brandTitle}>Vivah Kar Lo</Text>
          <Text style={styles.brandSubtitle}>
            India's Trusted Premium Matrimonial Platform
          </Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In to Your Account</Text>
          <Text style={styles.cardSubtitle}>
            Find your life partner with verified profiles and secure matching.
          </Text>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Input
            label="Mobile Number or Email"
            placeholder="e.g. 9876543210 or name@example.com"
            value={identity}
            onChangeText={(txt) => {
              setIdentity(txt);
              if (error) setError(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Smartphone size={18} color={Colors.textSecondary} />}
          />

          <Input
            label="Password"
            placeholder="Enter your secret password"
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              if (error) setError(null);
            }}
            isPassword
            leftIcon={<Lock size={18} color={Colors.textSecondary} />}
          />

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Sign In Securely"
            onPress={handleLogin}
            loading={isLoading}
            variant="primary"
            size="large"
            style={styles.signInBtn}
          />

          {biometricSupported && biometricEnabled && (
            <Button
              title="Unlock with Biometrics"
              variant="outline"
              size="medium"
              onPress={handleBiometricUnlock}
              style={styles.bioBtn}
              icon={<ShieldCheck size={18} color={Colors.primary} />}
            />
          )}

          {/* Quick Registration Link */}
          <View style={styles.registerPrompt}>
            <Text style={styles.promptText}>Don't have a profile yet? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>Register Free</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.securityFooter}>
          <ShieldCheck size={16} color={Colors.badgeVerified} />
          <Text style={styles.securityFooterText}>
            100% Verified Profiles • 256-bit Encryption • Anti-Scam Shield
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    justifyContent: "center",
  },
  brandHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.goldBorder,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 18,
    lineHeight: 18,
  },
  errorBanner: {
    backgroundColor: Colors.dangerLight,
    borderWidth: 1,
    borderColor: Colors.dangerBorder,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    fontWeight: "600",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 16,
    marginTop: -4,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: Colors.secondary,
    fontWeight: "600",
  },
  signInBtn: {
    marginBottom: 12,
  },
  bioBtn: {
    marginBottom: 12,
  },
  registerPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  promptText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  registerLink: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.secondary,
  },
  securityFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    gap: 6,
  },
  securityFooterText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
