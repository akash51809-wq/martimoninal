import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Search, Sparkles, SlidersHorizontal, Check } from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Header } from "../../components/common/Header";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { ProfileCard, ProfileCardData } from "../../components/profile/ProfileCard";
import { SearchApi, SearchFilters } from "../../services/api/searchApi";
import type { RootStackParamList } from "../../navigation/types";

export const AdvancedSearchScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [ageMin, setAgeMin] = useState("21");
  const [ageMax, setAgeMax] = useState("32");
  const [religion, setReligion] = useState("Hindu");
  const [caste, setCaste] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [education, setEducation] = useState("");
  const [diet, setDiet] = useState("Vegetarian");
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [withPhotosOnly, setWithPhotosOnly] = useState(true);

  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ProfileCardData[] | null>(null);

  const RELIGION_OPTIONS = ["All", "Hindu", "Muslim", "Sikh", "Jain", "Christian"];
  const DIET_OPTIONS = ["All", "Vegetarian", "Non-Vegetarian", "Eggetarian", "Jain"];

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchResults(null);

    const filters: SearchFilters = {
      ageMin: Number(ageMin) || 21,
      ageMax: Number(ageMax) || 35,
      religion: religion !== "All" ? [religion] : undefined,
      caste: caste.trim() ? [caste.trim()] : undefined,
      state: state.trim() ? [state.trim()] : undefined,
      city: city.trim() ? [city.trim()] : undefined,
      diet: diet !== "All" ? [diet] : undefined,
      verifiedOnly,
      withPhotosOnly,
    };

    try {
      const res = await SearchApi.queryProfiles(filters);
      if (res.success && Array.isArray(res.data?.profiles)) {
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
          matchScore: p.matchScore || 85,
        }));
        setSearchResults(mapped);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.warn("Search query fallback:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Search Prospects"
        subtitle="Filter by community, education, location & diet"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Filter Input Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Custom Criteria</Text>

          {/* Age Range */}
          <Text style={styles.label}>Age Range (Years)</Text>
          <View style={styles.row}>
            <View style={styles.halfCol}>
              <Input
                label="Min Age"
                placeholder="21"
                value={ageMin}
                onChangeText={setAgeMin}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfCol}>
              <Input
                label="Max Age"
                placeholder="32"
                value={ageMax}
                onChangeText={setAgeMax}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Religion Selection */}
          <Text style={styles.label}>Religion</Text>
          <View style={styles.pillsRow}>
            {RELIGION_OPTIONS.map((rel) => (
              <TouchableOpacity
                key={rel}
                onPress={() => setReligion(rel)}
                style={[styles.pill, religion === rel && styles.pillActive]}
              >
                <Text style={[styles.pillText, religion === rel && styles.pillTextActive]}>
                  {rel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Community / Caste (Optional)"
            placeholder="e.g. Brahmin, Maratha, Agarwal, Gupta"
            value={caste}
            onChangeText={setCaste}
          />

          {/* Location */}
          <View style={styles.row}>
            <View style={styles.halfCol}>
              <Input
                label="State"
                placeholder="e.g. Maharashtra"
                value={state}
                onChangeText={setState}
              />
            </View>
            <View style={styles.halfCol}>
              <Input
                label="City"
                placeholder="e.g. Mumbai, Pune"
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>

          {/* Diet Selection */}
          <Text style={styles.label}>Dietary Preference</Text>
          <View style={styles.pillsRow}>
            {DIET_OPTIONS.map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => setDiet(d)}
                style={[styles.pill, diet === d && styles.pillActive]}
              >
                <Text style={[styles.pillText, diet === d && styles.pillTextActive]}>
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Verification Toggles */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.toggleTitle}>Verified Profiles Only</Text>
              <Text style={styles.toggleSubtitle}>Show members with mobile/KYC verification</Text>
            </View>
            <Switch
              value={verifiedOnly}
              onValueChange={setVerifiedOnly}
              trackColor={{ false: Colors.border, true: Colors.secondary }}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.toggleTitle}>With Photos Only</Text>
              <Text style={styles.toggleSubtitle}>Exclude profiles without display photos</Text>
            </View>
            <Switch
              value={withPhotosOnly}
              onValueChange={setWithPhotosOnly}
              trackColor={{ false: Colors.border, true: Colors.secondary }}
            />
          </View>

          <Button
            title="Search Matrimonial Profiles"
            variant="primary"
            size="large"
            loading={isSearching}
            onPress={handleSearch}
            style={styles.searchBtn}
            icon={<Search size={18} color={Colors.surface} />}
          />
        </View>

        {/* Results Section */}
        {searchResults !== null && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsHeading}>
              Search Results ({searchResults.length} Profiles Found)
            </Text>

            {searchResults.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No exact profiles found</Text>
                <Text style={styles.emptySubtitle}>
                  Try broadening your age range or clearing city/caste filters.
                </Text>
              </View>
            ) : (
              searchResults.map((item) => (
                <ProfileCard
                  key={item.id}
                  profile={item}
                  onViewDetails={(id) => navigation.navigate("ProfileDetail", { profileId: id })}
                  onSendInterest={() => {}}
                />
              ))
            )}
          </View>
        )}
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
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfCol: {
    flex: 1,
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  pillTextActive: {
    color: Colors.surface,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  toggleTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  toggleSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  searchBtn: {
    marginTop: 16,
  },
  resultsSection: {
    marginTop: 10,
  },
  resultsHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
});
