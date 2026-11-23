import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Mail, ArrowLeft, Send } from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const [identity, setIdentity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!identity.trim()) {
      Alert.alert("Input Required", "Please enter your registered mobile number or email.");
      return;
    }

    setIsLoading(true);
    // Simulate server dispatch
    setTimeout(() => {
      setIsLoading(false);
      setSentSuccess(true);
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={Colors.primary} />
        </TouchableOpacity>

        <Text style={styles.title}>Reset Account Password</Text>
        <Text style={styles.subtitle}>
          Enter your registered mobile number or email to receive password recovery instructions.
        </Text>

        <View style={styles.card}>
          {sentSuccess ? (
            <View style={styles.successBox}>
              <Text style={styles.successTitle}>Recovery Instructions Sent</Text>
              <Text style={styles.successText}>
                We have dispatched a secure password reset link to your registered contact. Please check your messages.
              </Text>
              <Button
                title="Return to Sign In"
                variant="primary"
                onPress={() => navigation.goBack()}
                style={{ marginTop: 14 }}
              />
            </View>
          ) : (
            <>
              <Input
                label="Registered Mobile or Email"
                placeholder="e.g. 9876543210 or name@example.com"
                value={identity}
                onChangeText={setIdentity}
                leftIcon={<Mail size={18} color={Colors.textSecondary} />}
              />
              <Button
                title="Send Recovery Instructions"
                onPress={handleSubmit}
                loading={isLoading}
                variant="primary"
                size="large"
                style={{ marginTop: 10 }}
                icon={<Send size={16} color={Colors.surface} />}
              />
            </>
          )}
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
    paddingTop: 50,
  },
  backBtn: {
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 6,
    marginBottom: 24,
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
  successBox: {
    alignItems: "center",
    paddingVertical: 12,
  },
  successTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.success,
    marginBottom: 6,
  },
  successText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
});
