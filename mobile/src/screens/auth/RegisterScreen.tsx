import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { User, Smartphone, Mail, Lock, Calendar, Sparkles } from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { AuthApi } from "../../services/api/authApi";
import type { AuthStackParamList } from "../../navigation/types";

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Female");
  const [dob, setDob] = useState("");
  const [profileCreatedBy, setProfileCreatedBy] = useState("Self");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CREATOR_OPTIONS = ["Self", "Parents", "Sibling", "Relative", "Friend"];

  const handleRegister = async () => {
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Please enter your complete legal full name.");
      return;
    }
    if (!mobile.trim() || mobile.trim().length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid personal email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!dob.trim() || dob.trim().length < 4) {
      setError("Please enter date of birth (YYYY-MM-DD).");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // 1. Pre-flight duplicate check
      const dupCheck = await AuthApi.checkDuplicate({
        mobile: mobile.trim(),
        email: email.trim(),
      });

      if (dupCheck.data?.hasDuplicate) {
        setError(dupCheck.data.message || "Mobile number or email already in use.");
        setIsLoading(false);
        return;
      }

      // 2. Perform atomic registration
      const regResponse = await AuthApi.register({
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        password,
        gender,
        dob: dob.trim(),
        profileCreatedBy,
        deviceFingerprint: `native_${Platform.OS}_app`,
      });

      if (!regResponse.success || !regResponse.data?.user?.id) {
        setError(regResponse.error || "Registration could not be completed.");
        return;
      }

      // Navigate to OTP verification
      navigation.navigate("VerifyOtp", {
        userId: regResponse.data.user.id,
        type: "mobile",
        mobile: mobile.trim(),
      });
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Create Your Matrimonial Profile</Text>
          <Text style={styles.subtitle}>
            Join thousands of verified members finding life partners on Vivah Kar Lo.
          </Text>
        </View>

        <View style={styles.card}>
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Profile Created By Selector */}
          <Text style={styles.sectionLabel}>Profile Being Created For</Text>
          <View style={styles.creatorPillsRow}>
            {CREATOR_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setProfileCreatedBy(opt)}
                style={[
                  styles.creatorPill,
                  profileCreatedBy === opt && styles.creatorPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.creatorPillText,
                    profileCreatedBy === opt && styles.creatorPillTextActive,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Gender Selector */}
          <Text style={styles.sectionLabel}>Prospect Gender</Text>
          <View style={styles.creatorPillsRow}>
            {(["Female", "Male", "Other"] as const).map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setGender(g)}
                style={[styles.creatorPill, gender === g && styles.creatorPillActive]}
              >
                <Text
                  style={[
                    styles.creatorPillText,
                    gender === g && styles.creatorPillTextActive,
                  ]}
                >
                  {g === "Female" ? "Bride (Female)" : g === "Male" ? "Groom (Male)" : g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Full Legal Name"
            placeholder="e.g. Priya Sharma"
            value={fullName}
            onChangeText={(txt) => {
              setFullName(txt);
              if (error) setError(null);
            }}
            leftIcon={<User size={18} color={Colors.textSecondary} />}
          />

          <Input
            label="Mobile Number (For Verification OTP)"
            placeholder="10-digit Indian Mobile"
            value={mobile}
            onChangeText={(txt) => {
              setMobile(txt.replace(/[^0-9]/g, "").slice(0, 10));
              if (error) setError(null);
            }}
            keyboardType="phone-pad"
            leftIcon={<Smartphone size={18} color={Colors.textSecondary} />}
          />

          <Input
            label="Email Address"
            placeholder="name@example.com"
            value={email}
            onChangeText={(txt) => {
              setEmail(txt);
              if (error) setError(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={18} color={Colors.textSecondary} />}
          />

          <Input
            label="Create Secure Password"
            placeholder="Minimum 6 characters"
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              if (error) setError(null);
            }}
            isPassword
            leftIcon={<Lock size={18} color={Colors.textSecondary} />}
          />

          <Input
            label="Date of Birth"
            placeholder="YYYY-MM-DD (e.g. 1998-05-24)"
            value={dob}
            onChangeText={(txt) => {
              setDob(txt);
              if (error) setError(null);
            }}
            leftIcon={<Calendar size={18} color={Colors.textSecondary} />}
          />

          <Button
            title="Continue to OTP Verification"
            onPress={handleRegister}
            loading={isLoading}
            variant="secondary"
            size="large"
            style={styles.submitBtn}
            icon={<Sparkles size={18} color={Colors.surface} />}
          />

          <View style={styles.loginPrompt}>
            <Text style={styles.promptText}>Already registered? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Sign In Here</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 18,
    paddingTop: 36,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
  },
  card: {
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
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  creatorPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  creatorPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  creatorPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  creatorPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  creatorPillTextActive: {
    color: Colors.surface,
  },
  submitBtn: {
    marginTop: 6,
    marginBottom: 16,
  },
  loginPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  promptText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.primary,
  },
});
