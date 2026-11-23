import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Sparkles,
  Heart,
  Eye,
  Crown,
  ShieldCheck,
  Compass,
  Search,
  MessageCircle,
  FileText,
  Lock,
  ChevronRight,
  UserCheck,
} from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Header } from "../../components/common/Header";
import { Badge } from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import type { RootStackParamList } from "../../navigation/types";

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, bundle } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const profileCompletion = bundle?.profile?.profileCompletion ?? 75;
  const isKycVerified = bundle?.verification?.kycStatus === "approved";
  const isBasicVerified = bundle?.verification?.mobileVerified;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Vivah Kar Lo"
        subtitle={`Namaste, ${user?.fullName || "Member"}`}
        rightAction={
          <TouchableOpacity
            style={styles.headerKycBadge}
            onPress={() => navigation.navigate("KycVerification")}
          >
            {isKycVerified ? (
              <Badge variant="kyc_verified" label="KYC" />
            ) : isBasicVerified ? (
              <Badge variant="basic_verified" label="Verified" />
            ) : (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>Verify ID</Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
      >
        {/* Profile Completion Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>Profile Completion</Text>
              <Text style={styles.cardSubtitle}>
                Profiles with 100% details receive 5x more responses
              </Text>
            </View>
            <Text style={styles.scoreNumber}>{profileCompletion}%</Text>
          </View>

          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(profileCompletion, 100)}%` },
              ]}
            />
          </View>

          {profileCompletion < 100 && (
            <TouchableOpacity
              style={styles.completeBtn}
              onPress={() => navigation.navigate("EditProfile", { section: "basic" })}
            >
              <Text style={styles.completeBtnText}>Complete Remaining Details</Text>
              <ChevronRight size={14} color={Colors.secondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Matrimonial Action Modules */}
        <Text style={styles.sectionHeading}>Exclusive Matrimonial Tools</Text>
        <View style={styles.toolsGrid}>
          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate("KundliMilan", {})}
          >
            <View style={[styles.toolIconCircle, { backgroundColor: "#FEF3C7" }]}>
              <Sparkles size={22} color={Colors.warning} />
            </View>
            <Text style={styles.toolTitle}>Kundli Milan</Text>
            <Text style={styles.toolSubtitle}>36-Guna Ashtakoot</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate("PartnerPreferences")}
          >
            <View style={[styles.toolIconCircle, { backgroundColor: "#DCFCE7" }]}>
              <Compass size={22} color={Colors.success} />
            </View>
            <Text style={styles.toolTitle}>Preferences</Text>
            <Text style={styles.toolSubtitle}>Custom Match Rules</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate("KycVerification")}
          >
            <View style={[styles.toolIconCircle, { backgroundColor: "#E0F2FE" }]}>
              <ShieldCheck size={22} color={Colors.info} />
            </View>
            <Text style={styles.toolTitle}>Trust & KYC</Text>
            <Text style={styles.toolSubtitle}>Selfie & Govt ID</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate("Membership")}
          >
            <View style={[styles.toolIconCircle, { backgroundColor: "#FEE2E2" }]}>
              <Crown size={22} color={Colors.primary} />
            </View>
            <Text style={styles.toolTitle}>Royal VIP</Text>
            <Text style={styles.toolSubtitle}>Assisted Plans</Text>
          </TouchableOpacity>
        </View>

        {/* Real-time Activity Stats */}
        <Text style={styles.sectionHeading}>Your Matrimonial Activity</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Eye size={18} color={Colors.secondary} />
            <Text style={styles.statCount}>42</Text>
            <Text style={styles.statLabel}>Profile Views</Text>
          </View>
          <View style={styles.statBox}>
            <Heart size={18} color={Colors.danger} />
            <Text style={styles.statCount}>18</Text>
            <Text style={styles.statLabel}>Interests</Text>
          </View>
          <View style={styles.statBox}>
            <MessageCircle size={18} color={Colors.info} />
            <Text style={styles.statCount}>6</Text>
            <Text style={styles.statLabel}>Conversations</Text>
          </View>
        </View>

        {/* Trust & Safety Banner */}
        <TouchableOpacity
          style={styles.safetyCard}
          onPress={() => navigation.navigate("PrivacySettings")}
        >
          <View style={styles.safetyIcon}>
            <Lock size={20} color={Colors.surface} />
          </View>
          <View style={styles.safetyTextWrapper}>
            <Text style={styles.safetyTitle}>Privacy & Selective Field Lock</Text>
            <Text style={styles.safetySubtitle}>
              Hide salary, phone number or family details until interest is accepted.
            </Text>
          </View>
          <ChevronRight size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerKycBadge: {
    padding: 2,
  },
  pendingBadge: {
    backgroundColor: Colors.goldLight,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  pendingBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    maxWidth: 240,
  },
  scoreNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.secondary,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.secondary,
    borderRadius: 4,
  },
  completeBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    alignSelf: "flex-start",
  },
  completeBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.secondary,
    marginRight: 4,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  toolCard: {
    width: "48%",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  toolIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  toolSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  statCount: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  safetyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  safetyIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  safetyTextWrapper: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  safetySubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
});
