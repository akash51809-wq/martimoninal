import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ShieldCheck, Smartphone, CheckCircle2 } from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { AuthApi } from "../../services/api/authApi";
import { useAuth } from "../../context/AuthContext";
import type { AuthStackParamList } from "../../navigation/types";

export const VerifyOtpScreen: React.FC = () => {
  const route = useRoute<RouteProp<AuthStackParamList, "VerifyOtp">>();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { login } = useAuth();

  const { userId, type = "mobile", mobile } = route.params;

  const [otpCode, setOtpCode] = useState("");
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (!otpCode.trim() || otpCode.trim().length < 4) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setError(null);
    setIsVerifying(true);

    try {
      const response = await AuthApi.verifyOtp({
        userId,
        type,
        otpCode: otpCode.trim(),
      });

      if (!response.success) {
        setError(response.error || "OTP code is incorrect or expired.");
        return;
      }

      if (response.data?.bundle && response.data?.token) {
        await login(response.data.token, response.data.bundle);
      } else {
        Alert.alert(
          "Verification Successful",
          "Your mobile number has been verified. Please sign in with your credentials.",
          [{ text: "Sign In", onPress: () => navigation.navigate("Login") }]
        );
      }
    } catch (err: any) {
      setError(err.message || "OTP verification failed. Check connection.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setIsResending(true);
    setError(null);

    try {
      const res = await AuthApi.resendOtp(userId, type);
      if (res.success) {
        setTimer(60);
        Alert.alert("New OTP Dispatched", "A fresh 6-digit OTP code has been sent.");
      } else {
        setError(res.error || "Failed to resend OTP.");
      }
    } catch (err: any) {
      setError(err.message || "Resend OTP failed.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <ShieldCheck size={36} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Verify Your Mobile</Text>
        <Text style={styles.subtitle}>
          We have dispatched a 6-digit verification code to{" "}
          <Text style={styles.highlightText}>{mobile || "your registered mobile"}</Text>.
        </Text>

        <View style={styles.card}>
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Input
            label="Enter 6-Digit OTP"
            placeholder="• • • • • •"
            value={otpCode}
            onChangeText={(txt) => {
              setOtpCode(txt.replace(/[^0-9]/g, "").slice(0, 6));
              if (error) setError(null);
            }}
            keyboardType="number-pad"
            maxLength={6}
            leftIcon={<Smartphone size={18} color={Colors.textSecondary} />}
          />

          <Button
            title="Verify & Continue"
            onPress={handleVerify}
            loading={isVerifying}
            variant="primary"
            size="large"
            style={styles.verifyBtn}
            icon={<CheckCircle2 size={18} color={Colors.surface} />}
          />

          <View style={styles.resendRow}>
            {timer > 0 ? (
              <Text style={styles.timerText}>Resend code in {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={handleResend} disabled={isResending}>
                <Text style={styles.resendLink}>
                  {isResending ? "Sending..." : "Resend OTP Code"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: Colors.goldBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  highlightText: {
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  card: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
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
  verifyBtn: {
    marginTop: 8,
  },
  resendRow: {
    alignItems: "center",
    marginTop: 18,
  },
  timerText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  resendLink: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.secondary,
  },
});
