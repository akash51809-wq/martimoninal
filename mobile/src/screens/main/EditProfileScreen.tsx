import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { Save } from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Header } from "../../components/common/Header";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { ProfileApi } from "../../services/api/profileApi";
import { useAuth } from "../../context/AuthContext";
import type { RootStackParamList } from "../../navigation/types";

export const EditProfileScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "EditProfile">>();
  const navigation = useNavigation();
  const { user, bundle, updateBundle } = useAuth();

  const section = route.params?.section || "basic";
  const existing = bundle?.profile || {};

  const [heightDisplay, setHeightDisplay] = useState(existing.heightDisplay || "5 ft 6 in");
  const [maritalStatus, setMaritalStatus] = useState(existing.maritalStatus || "Never Married");
  const [motherTongue, setMotherTongue] = useState(existing.motherTongue || "Hindi");
  const [religion, setReligion] = useState(existing.religion || "Hindu");
  const [caste, setCaste] = useState(existing.caste || "Brahmin");
  const [occupation, setOccupation] = useState(existing.occupation || "Software Engineer");
  const [highestDegree, setHighestDegree] = useState(existing.highestDegree || "B.Tech");
  const [annualIncome, setAnnualIncome] = useState(existing.annualIncome || "₹15 - 25 Lakhs");
  const [diet, setDiet] = useState(existing.diet || "Pure Vegetarian");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);

    const payload = {
      heightDisplay,
      maritalStatus,
      motherTongue,
      religion,
      caste,
      occupation,
      highestDegree,
      annualIncome,
      diet,
    };

    try {
      const res = await ProfileApi.updateProfileSection(user.id, section, payload);
      if (res.success) {
        if (bundle) {
          updateBundle({
            ...bundle,
            profile: { ...bundle.profile, ...payload },
          });
        }
        Alert.alert("Success", "Profile updated successfully.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Notice", res.error || "Failed to update profile.");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Network error.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Header
        title={`Edit ${section.toUpperCase()} Details`}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          {section === "basic" && (
            <>
              <Input
                label="Height (Display)"
                placeholder="e.g. 5 ft 6 in (168 cm)"
                value={heightDisplay}
                onChangeText={setHeightDisplay}
              />
              <Input
                label="Marital Status"
                placeholder="e.g. Never Married, Awaiting Divorce"
                value={maritalStatus}
                onChangeText={setMaritalStatus}
              />
              <Input
                label="Mother Tongue"
                placeholder="e.g. Hindi, Marathi, Gujarati"
                value={motherTongue}
                onChangeText={setMotherTongue}
              />
            </>
          )}

          {section === "religion" && (
            <>
              <Input
                label="Religion"
                placeholder="e.g. Hindu, Sikh, Jain"
                value={religion}
                onChangeText={setReligion}
              />
              <Input
                label="Caste / Sub-caste"
                placeholder="e.g. Brahmin, Maratha, Agarwal"
                value={caste}
                onChangeText={setCaste}
              />
            </>
          )}

          {section === "career" && (
            <>
              <Input
                label="Highest Degree"
                placeholder="e.g. B.Tech, MBA, MBBS"
                value={highestDegree}
                onChangeText={setHighestDegree}
              />
              <Input
                label="Occupation / Designation"
                placeholder="e.g. Lead Software Engineer"
                value={occupation}
                onChangeText={setOccupation}
              />
              <Input
                label="Annual Income"
                placeholder="e.g. ₹15 - 25 Lakhs"
                value={annualIncome}
                onChangeText={setAnnualIncome}
              />
            </>
          )}

          {section === "family" || section === "lifestyle" ? (
            <>
              <Input
                label="Dietary Preference"
                placeholder="e.g. Pure Vegetarian, Eggetarian"
                value={diet}
                onChangeText={setDiet}
              />
            </>
          ) : null}

          <Button
            title="Save Changes"
            variant="primary"
            size="large"
            loading={isSaving}
            onPress={handleSave}
            style={{ marginTop: 10 }}
            icon={<Save size={18} color={Colors.surface} />}
          />
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
    padding: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
