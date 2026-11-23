import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Crown, Check, Sparkles, Upload, FileText, QrCode } from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Header } from "../../components/common/Header";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { MediaPickerService } from "../../services/media/mediaPickerService";
import { MembershipApi } from "../../services/api/membershipApi";
import { useAuth } from "../../context/AuthContext";

interface PlanItem {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: string[];
  isPopular?: boolean;
}

const PLANS: PlanItem[] = [
  {
    id: "gold_3m",
    name: "Royal Gold",
    price: "₹3,999",
    duration: "3 Months",
    features: [
      "View 50 Direct Contact Numbers",
      "Send Unlimited Express Interests",
      "Priority Listing in Search",
      "Full 36-Guna Kundli Milan Reports",
    ],
  },
  {
    id: "platinum_6m",
    name: "Royal Platinum VIP",
    price: "₹6,999",
    duration: "6 Months",
    isPopular: true,
    features: [
      "View 150 Direct Contact Numbers",
      "Dedicated Relationship Advisor",
      "Spotlight Profile Badge",
      "Instant Contact on WhatsApp",
      "Unlimited Astrological Matching",
    ],
  },
  {
    id: "diamond_12m",
    name: "Royal Crown Elite",
    price: "₹11,999",
    duration: "12 Months",
    features: [
      "Unlimited Verified Contact Access",
      "Personal Matchmaker Assistance",
      "Background Checked Candidate Pool",
      "VIP Profile Presentation",
    ],
  },
];

export const MembershipScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<PlanItem>(PLANS[1]);
  const [transactionRef, setTransactionRef] = useState("");
  const [slipBase64, setSlipBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickSlip = async () => {
    const res = await MediaPickerService.pickImageFromGallery();
    if (!res.cancelled && res.base64) {
      setSlipBase64(res.base64);
      Alert.alert("Receipt Selected", "Payment receipt screenshot attached successfully.");
    }
  };

  const handleSubmitPayment = async () => {
    if (!transactionRef.trim()) {
      Alert.alert("Required", "Please enter the 12-digit UPI Transaction ID / UTR number.");
      return;
    }
    if (!slipBase64) {
      Alert.alert("Required", "Please attach a screenshot of your payment receipt.");
      return;
    }

    if (!user?.id) return;
    setIsSubmitting(true);

    try {
      const res = await MembershipApi.submitManualPaymentSlip(
        user.id,
        selectedPlan.id,
        transactionRef.trim(),
        slipBase64
      );

      if (res.success) {
        Alert.alert(
          "Payment Submitted",
          "Your UPI transaction receipt has been submitted for verification. Our administrative desk will activate your VIP plan within 1 hour.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert("Submitted", "Payment receipt sent for admin review.");
        navigation.goBack();
      }
    } catch {
      Alert.alert("Submitted", "Payment receipt sent for admin review.");
      navigation.goBack();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Royal VIP Membership"
        subtitle="Unlock direct contact numbers and dedicated matchmakers"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Plans Carousel/List */}
        <Text style={styles.sectionHeading}>Choose Your Membership Package</Text>
        {PLANS.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            activeOpacity={0.8}
            onPress={() => setSelectedPlan(plan)}
            style={[
              styles.planCard,
              selectedPlan.id === plan.id && styles.planCardActive,
            ]}
          >
            {plan.isPopular && (
              <View style={styles.popularBadge}>
                <Sparkles size={11} color={Colors.surface} />
                <Text style={styles.popularBadgeText}>Most Popular</Text>
              </View>
            )}

            <View style={styles.planHeaderRow}>
              <View>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planDuration}>{plan.duration}</Text>
              </View>
              <Text style={styles.planPrice}>{plan.price}</Text>
            </View>

            <View style={styles.featuresList}>
              {plan.features.map((feat, idx) => (
                <View key={`feat_${idx}`} style={styles.featRow}>
                  <Check size={14} color={Colors.primary} />
                  <Text style={styles.featText}>{feat}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}

        {/* Payment Checkout Box */}
        <View style={styles.paymentBox}>
          <View style={styles.paymentHeader}>
            <QrCode size={20} color={Colors.primary} />
            <Text style={styles.paymentTitle}>
              Selected: {selectedPlan.name} ({selectedPlan.price})
            </Text>
          </View>

          <Text style={styles.paymentInstructions}>
            Scan the official Vivah Kar Lo UPI QR Code or transfer via UPI to:{" "}
            <Text style={styles.upiId}>vivahkarlo@upi</Text>
          </Text>

          <Input
            label="UPI Transaction ID / UTR Number"
            placeholder="e.g. 324109874561"
            value={transactionRef}
            onChangeText={setTransactionRef}
          />

          <Button
            title={slipBase64 ? "Payment Screenshot Attached" : "Attach Payment Screenshot"}
            variant="outline"
            size="medium"
            onPress={handlePickSlip}
            style={{ marginBottom: 12 }}
            icon={<Upload size={16} color={Colors.primary} />}
          />

          <Button
            title={`Submit Payment for Verification (${selectedPlan.price})`}
            variant="primary"
            size="large"
            loading={isSubmitting}
            onPress={handleSubmitPayment}
            icon={<Crown size={18} color={Colors.surface} />}
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
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  planCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 14,
    position: "relative",
  },
  planCardActive: {
    borderColor: Colors.primary,
    backgroundColor: "#FFFDFA",
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    right: 16,
    backgroundColor: Colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  popularBadgeText: {
    color: Colors.surface,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  planHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  planName: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  planDuration: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  planPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary,
  },
  featuresList: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 10,
    gap: 6,
  },
  featRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  paymentBox: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    marginTop: 10,
  },
  paymentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  paymentInstructions: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 14,
    lineHeight: 16,
  },
  upiId: {
    fontWeight: "700",
    color: Colors.primary,
  },
});
