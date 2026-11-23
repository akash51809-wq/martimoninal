import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SlidersHorizontal, Sparkles } from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Header } from "../../components/common/Header";
import { ProfileCard, ProfileCardData } from "../../components/profile/ProfileCard";
import { SearchApi } from "../../services/api/searchApi";
import { CommunicationApi } from "../../services/api/communicationApi";
import { useAuth } from "../../context/AuthContext";
import type { RootStackParamList } from "../../navigation/types";

// Fallback seed matches for instant responsive UI
const SEED_PROFILES: ProfileCardData[] = [
  {
    id: "usr-demo-priya",
    fullName: "Priya Sharma",
    age: 26,
    heightDisplay: "5 ft 4 in (163 cm)",
    city: "Mumbai",
    state: "Maharashtra",
    religion: "Hindu",
    caste: "Brahmin",
    occupation: "Software Engineer at Tech MNC",
    highestDegree: "B.Tech Computer Science",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    isVerified: true,
    isKycVerified: true,
    isVip: true,
    matchScore: 94,
  },
  {
    id: "usr-demo-ananya",
    fullName: "Ananya Deshmukh",
    age: 25,
    heightDisplay: "5 ft 3 in (160 cm)",
    city: "Pune",
    state: "Maharashtra",
    religion: "Hindu",
    caste: "Maratha",
    occupation: "Architect & Interior Designer",
    highestDegree: "B.Arch",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80",
    isVerified: true,
    isKycVerified: true,
    matchScore: 89,
  },
  {
    id: "usr-demo-kavya",
    fullName: "Kavya Iyer",
    age: 27,
    heightDisplay: "5 ft 5 in (165 cm)",
    city: "Bengaluru",
    state: "Karnataka",
    religion: "Hindu",
    caste: "Iyer",
    occupation: "Senior Financial Analyst",
    highestDegree: "MBA Finance",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    isVerified: true,
    isKycVerified: false,
    matchScore: 91,
  },
  {
    id: "usr-demo-sneha",
    fullName: "Sneha Patel",
    age: 26,
    heightDisplay: "5 ft 2 in (158 cm)",
    city: "Ahmedabad",
    state: "Gujarat",
    religion: "Hindu",
    caste: "Patel",
    occupation: "Doctor (MBBS)",
    highestDegree: "MBBS",
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80",
    isVerified: true,
    isKycVerified: true,
    matchScore: 86,
  },
];

export const DiscoverScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  const [profiles, setProfiles] = useState<ProfileCardData[]>(SEED_PROFILES);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [activeFilterTag, setActiveFilterTag] = useState("All");
  const [isLoading, setIsLoading] = useState(false);

  const FILTER_TAGS = ["All", "90%+ Match", "Verified ID", "Same State", "Doctor / Engineer"];

  useEffect(() => {
    async function loadBrowseFeed() {
      setIsLoading(true);
      try {
        const res = await SearchApi.browseProfiles();
        if (res.success && Array.isArray(res.data?.profiles) && res.data.profiles.length > 0) {
          const mapped: ProfileCardData[] = res.data.profiles.map((p: any) => ({
            id: p.userId || p.id,
            fullName: p.fullName || "Member",
            age: p.age || 26,
            heightDisplay: p.heightDisplay || "5 ft 5 in",
            city: p.city || "Mumbai",
            state: p.state || "Maharashtra",
            religion: p.religion || "Hindu",
            caste: p.caste || "",
            occupation: p.occupation || "Professional",
            highestDegree: p.highestDegree || "Graduate",
            avatarUrl: p.avatarUrl || p.photoUrl,
            isVerified: Boolean(p.isVerified),
            isKycVerified: Boolean(p.isKycVerified),
            isVip: Boolean(p.isVip),
            matchScore: p.matchScore || 88,
          }));
          setProfiles(mapped);
        }
      } catch (err) {
        console.warn("Using fallback seed profiles for discover feed:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadBrowseFeed();
  }, []);

  const handleSendInterest = async (targetId: string) => {
    if (!user?.id) {
      Alert.alert("Sign In Required", "Please sign in to express interest in members.");
      return;
    }

    try {
      const res = await CommunicationApi.sendInterest(user.id, targetId);
      if (res.success) {
        Alert.alert("Interest Sent!", "Your express interest invitation has been delivered.");
      } else {
        Alert.alert("Notice", res.error || "Unable to send interest.");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to send interest.");
    }
  };

  const handleToggleShortlist = (id: string) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredProfiles = profiles.filter((p) => {
    if (activeFilterTag === "90%+ Match") return (p.matchScore || 0) >= 90;
    if (activeFilterTag === "Verified ID") return p.isKycVerified;
    if (activeFilterTag === "Doctor / Engineer") {
      const occ = (p.occupation || "").toLowerCase();
      return occ.includes("engineer") || occ.includes("doctor");
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <Header
        title="Discover Matches"
        subtitle="Profiles tailored to your partner preferences"
        rightAction={
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => (navigation as any).navigate("SearchTab")}
          >
            <SlidersHorizontal size={18} color={Colors.surface} />
          </TouchableOpacity>
        }
      />

      {/* Filter Tag Chips */}
      <View style={styles.tagsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTER_TAGS}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.tagsContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveFilterTag(item)}
              style={[
                styles.tagChip,
                activeFilterTag === item && styles.tagChipActive,
              ]}
            >
              <Text
                style={[
                  styles.tagText,
                  activeFilterTag === item && styles.tagTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading verified matrimonial prospects...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProfiles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProfileCard
              profile={{
                ...item,
                isLiked: likedIds.includes(item.id),
              }}
              onViewDetails={(id) => navigation.navigate("ProfileDetail", { profileId: id })}
              onSendInterest={handleSendInterest}
              onToggleShortlist={handleToggleShortlist}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterButton: {
    padding: 6,
  },
  tagsContainer: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 10,
  },
  tagsContent: {
    paddingHorizontal: 14,
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  tagTextActive: {
    color: Colors.surface,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
