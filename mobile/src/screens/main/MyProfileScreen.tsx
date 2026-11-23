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
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Camera,
  Edit,
  ShieldCheck,
  Crown,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Users,
  Compass,
  Lock,
  ChevronRight,
} from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Header } from "../../components/common/Header";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { MediaPickerService } from "../../services/media/mediaPickerService";
import { ProfileApi } from "../../services/api/profileApi";
import type { RootStackParamList } from "../../navigation/types";

export const MyProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, bundle, updateBundle } = useAuth();

  const [avatarUri, setAvatarUri] = useState<string | null>(
    bundle?.profile?.avatarUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
  );
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const profile = bundle?.profile || {};
  const isKycVerified = bundle?.verification?.kycStatus === "approved";
  const isBasicVerified = bundle?.verification?.mobileVerified;

  const handleUploadPhoto = async () => {
    Alert.alert(
      "Update Profile Photo",
      "Choose a photo from your gallery or take a live picture. EXIF GPS data will be automatically stripped for your privacy.",
      [
        {
          text: "Open Gallery",
          onPress: async () => {
            const res = await MediaPickerService.pickImageFromGallery();
            if (!res.cancelled && res.base64 && user?.id) {
              await uploadPhotoToServer(res.base64, res.uri);
            }
          },
        },
        {
          text: "Take Photo",
          onPress: async () => {
            const res = await MediaPickerService.captureImageWithCamera();
            if (!res.cancelled && res.base64 && user?.id) {
              await uploadPhotoToServer(res.base64, res.uri);
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const uploadPhotoToServer = async (base64: string, localUri?: string) => {
    if (!user?.id) return;
    setIsUploadingPhoto(true);

    try {
      const response = await ProfileApi.uploadSanitizedPhoto(user.id, base64);
      if (response.success) {
        if (localUri) setAvatarUri(localUri);
        Alert.alert("Success", "Profile photo uploaded and sanitized successfully.");
        if (bundle) {
          updateBundle({
            ...bundle,
            profile: { ...bundle.profile, avatarUrl: localUri || base64 },
          });
        }
      } else {
        Alert.alert("Upload Notice", response.error || "Photo upload rejected by security filter.");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to upload photo.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="My Dossier"
        subtitle="Manage your personal and matrimonial details"
        rightAction={
          <TouchableOpacity
            style={styles.settingsHeaderBtn}
            onPress={() => navigation.navigate("Settings")}
          >
            <Text style={styles.settingsBtnText}>Settings</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Avatar Card */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: avatarUri || undefined }} style={styles.avatarImage} />
            <TouchableOpacity
              style={styles.cameraBtn}
              onPress={handleUploadPhoto}
              disabled={isUploadingPhoto}
            >
              <Camera size={16} color={Colors.surface} />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>
            {user?.fullName || "Member Name"},{" "}
            {profile.dob ? new Date().getFullYear() - new Date(profile.dob).getFullYear() : 26}
          </Text>
          <Text style={styles.profileMeta}>
            {profile.city || "Mumbai"}, {profile.state || "Maharashtra"}
          </Text>

          <View style={styles.badgesRow}>
            {isKycVerified ? (
              <Badge variant="kyc_verified" />
            ) : isBasicVerified ? (
              <Badge variant="basic_verified" />
            ) : null}
            <Badge variant="vip" label="Gold Plan" />
          </View>
        </View>

        {/* Section 1: Basic & Physical */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Basic & Physical Info</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditProfile", { section: "basic" })}
            >
              <Edit size={16} color={Colors.secondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Height:</Text>
            <Text style={styles.detailValue}>{profile.heightDisplay || "5 ft 6 in (168 cm)"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Marital Status:</Text>
            <Text style={styles.detailValue}>{profile.maritalStatus || "Never Married"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mother Tongue:</Text>
            <Text style={styles.detailValue}>{profile.motherTongue || "Hindi"}</Text>
          </View>
        </View>

        {/* Section 2: Religion & Community */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Religion & Horoscope</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditProfile", { section: "religion" })}
            >
              <Edit size={16} color={Colors.secondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Religion:</Text>
            <Text style={styles.detailValue}>{profile.religion || "Hindu"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Caste / Community:</Text>
            <Text style={styles.detailValue}>{profile.caste || "Brahmin"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Manglik Status:</Text>
            <Text style={styles.detailValue}>{profile.manglikStatus || "Non-Manglik"}</Text>
          </View>
        </View>

        {/* Section 3: Education & Career */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Education & Career</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditProfile", { section: "career" })}
            >
              <Edit size={16} color={Colors.secondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Highest Degree:</Text>
            <Text style={styles.detailValue}>{profile.highestDegree || "B.Tech / MBA"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Occupation:</Text>
            <Text style={styles.detailValue}>{profile.occupation || "Software Professional"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Annual Income:</Text>
            <Text style={styles.detailValue}>{profile.annualIncome || "₹15 - 25 Lakhs"}</Text>
          </View>
        </View>

        {/* Section 4: Family & Lifestyle */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Family & Lifestyle</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditProfile", { section: "family" })}
            >
              <Edit size={16} color={Colors.secondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Family Type:</Text>
            <Text style={styles.detailValue}>{profile.familyType || "Nuclear Family"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Diet:</Text>
            <Text style={styles.detailValue}>{profile.diet || "Pure Vegetarian"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Smoking / Drinking:</Text>
            <Text style={styles.detailValue}>
              {profile.smoking || "No"} / {profile.drinking || "No"}
            </Text>
          </View>
        </View>

        {/* Shortcuts: Preferences & KYC */}
        <TouchableOpacity
          style={styles.navRowCard}
          onPress={() => navigation.navigate("PartnerPreferences")}
        >
          <Compass size={20} color={Colors.primary} />
          <Text style={styles.navRowTitle}>Partner Preferences</Text>
          <ChevronRight size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navRowCard}
          onPress={() => navigation.navigate("KycVerification")}
        >
          <ShieldCheck size={20} color={Colors.info} />
          <Text style={styles.navRowTitle}>KYC Verification & Trust Badges</Text>
          <ChevronRight size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navRowCard}
          onPress={() => navigation.navigate("PrivacySettings")}
        >
          <Lock size={20} color={Colors.secondary} />
          <Text style={styles.navRowTitle}>Selective Field Lock & Privacy</Text>
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
  settingsHeaderBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  settingsBtnText: {
    color: Colors.goldLight,
    fontSize: 13,
    fontWeight: "600",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  avatarCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: Colors.goldBorder,
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  profileMeta: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingBottom: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  navRowCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
    gap: 12,
  },
  navRowTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
});
