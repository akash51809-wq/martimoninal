import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CheckCircle2, ShieldCheck, Crown, Sparkles } from "lucide-react-native";
import { Colors } from "../../constants/colors";

export type BadgeVariant = "basic_verified" | "kyc_verified" | "vip" | "match_score";

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  score?: number;
}

export const Badge: React.FC<BadgeProps> = ({ variant, label, score }) => {
  switch (variant) {
    case "basic_verified":
      return (
        <View style={[styles.container, styles.basicVerified]}>
          <CheckCircle2 size={12} color={Colors.badgeVerified} />
          <Text style={[styles.text, { color: Colors.badgeVerified }]}>
            {label || "Basic Verified"}
          </Text>
        </View>
      );
    case "kyc_verified":
      return (
        <View style={[styles.container, styles.kycVerified]}>
          <ShieldCheck size={12} color={Colors.badgeKyc} />
          <Text style={[styles.text, { color: Colors.badgeKyc }]}>
            {label || "Selfie & ID Verified"}
          </Text>
        </View>
      );
    case "vip":
      return (
        <View style={[styles.container, styles.vip]}>
          <Crown size={12} color={Colors.badgeVip} />
          <Text style={[styles.text, { color: Colors.badgeVip }]}>
            {label || "Royal VIP"}
          </Text>
        </View>
      );
    case "match_score":
      return (
        <View style={[styles.container, styles.matchScore]}>
          <Sparkles size={12} color={Colors.primary} />
          <Text style={[styles.text, { color: Colors.primary, fontWeight: "700" }]}>
            {score ? `${score}% Match` : "High Match"}
          </Text>
        </View>
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 4,
  },
  basicVerified: {
    backgroundColor: Colors.successLight,
    borderWidth: 1,
    borderColor: Colors.successBorder,
  },
  kycVerified: {
    backgroundColor: Colors.infoLight,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  vip: {
    backgroundColor: Colors.warningLight,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  matchScore: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
});
