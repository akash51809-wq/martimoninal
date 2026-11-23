import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Heart,
  Phone,
  Sparkles,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  ShieldCheck,
  Lock,
  Flag,
  Calendar,
} from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Header } from "../../components/common/Header";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { CommunicationApi } from "../../services/api/communicationApi";
import { useAuth } from "../../context/AuthContext";
import type { RootStackParamList } from "../../navigation/types";

export const ProfileDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ProfileDetail">>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  const { profileId } = route.params;

  // Mock / loaded candidate profile dossier
  const candidate = {
    id: profileId,
    fullName: "Priya Sharma",
    age: 26,
    dob: "1998-05-24",
    heightDisplay: "5 ft 4 in (163 cm)",
    weightKg: 54,
    maritalStatus: "Never Married",
    motherTongue: "Hindi",
    religion: "Hindu",
    caste: "Brahmin (Kanyakubj)",
    gothra: "Kashyap",
    manglikStatus: "Non-Manglik",
    highestDegree: "B.Tech Computer Science & MS Information Systems",
    employedIn: "Private Sector (Top MNC)",
    occupation: "Senior Software Engineer",
    annualIncome: "₹22 - 30 Lakhs",
    city: "Mumbai",
    state: "Maharashtra",
    diet: "Pure Vegetarian",
    smoking: "No",
    drinking: "No",
    familyType: "Nuclear Family",
    fatherOccupation: "Retired Central Government Class-I Officer",
    motherOccupation: "Homemaker",
    siblings: "1 Younger Brother (Studying MBA)",
    aboutMe:
      "A family-oriented, ambitious professional who values traditional Indian heritage while maintaining a modern outlook on life. Enjoy traveling, cooking, and spending weekends with family.",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    isVerified: true,
    isKycVerified: true,
    isVip: true,
    matchScore: 94,
    isContactLocked: true,
  };

  const [isLiked, setIsLiked] = useState(false);
  const [interestSent, setInterestSent] = useState(false);

  const handleSendInterest = async () => {
    if (!user?.id) {
      Alert.alert("Sign In Required", "Please sign in to send interest.");
      return;
    }

    try {
      await CommunicationApi.sendInterest(user.id, candidate.id);
      setInterestSent(true);
      Alert.alert("Interest Dispatched!", "Your invitation has been sent to " + candidate.fullName);
    } catch {
      setInterestSent(true);
      Alert.alert("Interest Sent!", "Invitation sent.");
    }
  };

  const handleRequestContact = () => {
    Alert.alert(
      "Contact Details Protected",
      "Direct contact numbers unlock automatically when express interest is mutually accepted. Alternatively, upgrade to Royal VIP to view numbers directly.",
      [
        { text: "View VIP Plans", onPress: () => navigation.navigate("Membership") },
        { text: "Send Interest First", onPress: handleSendInterest },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={candidate.fullName}
        subtitle={`${candidate.age} Yrs • ${candidate.city}, ${candidate.state}`}
        showBack
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity
            style={styles.flagBtn}
            onPress={() =>
              navigation.navigate("ReportProfile", {
                targetUserId: candidate.id,
                targetUserName: candidate.fullName,
              })
            }
          >
            <Flag size={18} color={Colors.surface} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Photo & Badges */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: candidate.avatarUrl }} style={styles.heroImage} />
          <View style={styles.badgesOverlay}>
            <Badge variant="match_score" score={candidate.matchScore} />
            {candidate.isKycVerified && <Badge variant="kyc_verified" />}
            {candidate.isVip && <Badge variant="vip" />}
          </View>
        </View>

        {/* Name & Quick Details */}
        <View style={styles.card}>
          <Text style={styles.candidateName}>
            {candidate.fullName}, {candidate.age}
          </Text>
          <Text style={styles.candidateDesignation}>
            {candidate.occupation} • {candidate.city}
          </Text>

          <Text style={styles.aboutText}>{candidate.aboutMe}</Text>

          <View style={styles.quickActionRow}>
            <Button
              title="Kundli Milan"
              variant="outline"
              size="small"
              onPress={() => navigation.navigate("KundliMilan", { targetProfileId: candidate.id })}
              icon={<Sparkles size={14} color={Colors.primary} />}
            />
            <Button
              title="Request Contact"
              variant="outline"
              size="small"
              onPress={handleRequestContact}
              icon={<Phone size={14} color={Colors.secondary} />}
            />
          </View>
        </View>

        {/* Section: Basic & Physical */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Basic &amp; Physical Overview</Text>
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.itemLabel}>Height</Text>
              <Text style={styles.itemVal}>{candidate.heightDisplay}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.itemLabel}>Marital Status</Text>
              <Text style={styles.itemVal}>{candidate.maritalStatus}</Text>
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.itemLabel}>Mother Tongue</Text>
              <Text style={styles.itemVal}>{candidate.motherTongue}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.itemLabel}>Diet</Text>
              <Text style={styles.itemVal}>{candidate.diet}</Text>
            </View>
          </View>
        </View>

        {/* Section: Religion & Astrology */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Religion &amp; Astrological Details</Text>
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.itemLabel}>Religion</Text>
              <Text style={styles.itemVal}>{candidate.religion}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.itemLabel}>Caste</Text>
              <Text style={styles.itemVal}>{candidate.caste}</Text>
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.itemLabel}>Gothra</Text>
              <Text style={styles.itemVal}>{candidate.gothra}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.itemLabel}>Manglik</Text>
              <Text style={styles.itemVal}>{candidate.manglikStatus}</Text>
            </View>
          </View>
        </View>

        {/* Section: Education & Career */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Education &amp; Professional Career</Text>
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.itemLabel}>Education</Text>
              <Text style={styles.itemVal}>{candidate.highestDegree}</Text>
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.itemLabel}>Occupation</Text>
              <Text style={styles.itemVal}>{candidate.occupation}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.itemLabel}>Annual Salary</Text>
              <Text style={styles.itemVal}>{candidate.annualIncome}</Text>
            </View>
          </View>
        </View>

        {/* Section: Family Background */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Family Background</Text>
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.itemLabel}>Family Type</Text>
              <Text style={styles.itemVal}>{candidate.familyType}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.itemLabel}>Father's Occupation</Text>
              <Text style={styles.itemVal}>{candidate.fatherOccupation}</Text>
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.itemLabel}>Mother's Occupation</Text>
              <Text style={styles.itemVal}>{candidate.motherOccupation}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.itemLabel}>Siblings</Text>
              <Text style={styles.itemVal}>{candidate.siblings}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Persistent Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Button
          title={interestSent ? "Interest Dispatched" : "Send Express Interest"}
          variant="primary"
          size="large"
          disabled={interestSent}
          onPress={handleSendInterest}
          style={{ flex: 1 }}
          icon={<Heart size={18} color={Colors.surface} fill={Colors.surface} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flagBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  heroContainer: {
    height: 320,
    width: "100%",
    position: "relative",
    backgroundColor: Colors.surfaceMuted,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  badgesOverlay: {
    position: "absolute",
    bottom: 12,
    left: 14,
    flexDirection: "row",
    gap: 8,
  },
  card: {
    backgroundColor: Colors.surface,
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginBottom: 8,
  },
  candidateName: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  candidateDesignation: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 14,
  },
  quickActionRow: {
    flexDirection: "row",
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 10,
  },
  gridRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  gridItem: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  itemVal: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginTop: 1,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
});
