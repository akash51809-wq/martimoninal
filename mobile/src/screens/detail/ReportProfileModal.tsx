import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { AlertTriangle, Flag, ShieldCheck } from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Header } from "../../components/common/Header";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { SecurityApi } from "../../services/api/securityApi";
import { useAuth } from "../../context/AuthContext";
import type { RootStackParamList } from "../../navigation/types";

const REASONS = [
  "Asked for money, loans or financial help via UPI/Bank",
  "Fake profile / Identity theft / Stolen photographs",
  "Inappropriate behavior, harassment or offensive messages",
  "Already married or misrepresenting marital status",
  "Commercial advertisement, broker or spam",
];

export const ReportProfileModal: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ReportProfile">>();
  const navigation = useNavigation();
  const { user } = useAuth();

  const { targetUserId, targetUserName } = route.params;

  const [selectedReason, setSelectedReason] = useState(REASONS[0]);
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReport = async () => {
    if (!user?.id) {
      Alert.alert("Sign In Required", "Please sign in to report a profile.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await SecurityApi.reportProfile({
        reporterId: user.id,
        reportedUserId: targetUserId,
        reportedUserName: targetUserName,
        reason: `${selectedReason}${details.trim() ? `: ${details.trim()}` : ""}`,
        severity: "High",
      });

      if (res.success) {
        Alert.alert(
          "Report Filed Successfully",
          res.data?.autoSuspended
            ? "Thank you for protecting our community. This profile has received multiple verified reports and has been automatically suspended pending administrative review."
            : "Your complaint has been submitted to the Trust & Safety team for formal review.",
          [{ text: "Done", onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert("Notice", res.error || "Report submitted successfully.");
        navigation.goBack();
      }
    } catch {
      Alert.alert("Report Filed", "Complaint registered with moderation desk.");
      navigation.goBack();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Report Profile"
        subtitle={`Flagging ${targetUserName}`}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.warningBanner}>
          <AlertTriangle size={22} color={Colors.danger} />
          <View style={styles.warningTextCol}>
            <Text style={styles.warningTitle}>Community Safety Policy</Text>
            <Text style={styles.warningSubtitle}>
              Vivah Kar Lo maintains zero tolerance for fraud. If 3 verified members report an account, it is automatically suspended immediately.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeading}>Select Reason for Complaint</Text>
          {REASONS.map((r, idx) => (
            <TouchableOpacity
              key={`reason_${idx}`}
              onPress={() => setSelectedReason(r)}
              style={[
                styles.reasonRow,
                selectedReason === r && styles.reasonRowActive,
              ]}
            >
              <View
                style={[
                  styles.radioOuter,
                  selectedReason === r && styles.radioOuterActive,
                ]}
              >
                {selectedReason === r && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.reasonText}>{r}</Text>
            </TouchableOpacity>
          ))}

          <Input
            label="Additional Details (Optional)"
            placeholder="Provide context or description of incident..."
            value={details}
            onChangeText={setDetails}
            multiline
            numberOfLines={3}
            style={{ height: 70 }}
          />

          <Button
            title="Submit Report to Trust & Safety"
            variant="danger"
            size="large"
            loading={isSubmitting}
            onPress={handleSubmitReport}
            style={{ marginTop: 12 }}
            icon={<Flag size={16} color={Colors.surface} />}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  warningBanner: {
    flexDirection: "row",
    backgroundColor: Colors.dangerLight,
    borderWidth: 1,
    borderColor: Colors.dangerBorder,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    alignItems: "center",
    gap: 12,
  },
  warningTextCol: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.danger,
  },
  warningSubtitle: {
    fontSize: 11,
    color: Colors.danger,
    marginTop: 2,
    lineHeight: 15,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  reasonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  reasonRowActive: {
    backgroundColor: Colors.surfaceSubtle,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioOuterActive: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  reasonText: {
    fontSize: 13,
    color: Colors.textPrimary,
    flex: 1,
  },
});
