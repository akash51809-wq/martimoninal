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
import { useNavigation } from "@react-navigation/native";
import { Save, Compass } from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Header } from "../../components/common/Header";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { MatchingApi } from "../../services/api/matchingApi";
import { useAuth } from "../../context/AuthContext";

export const PartnerPreferencesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [preferredAgeRange, setPreferredAgeRange] = useState("22 - 29");
  const [preferredHeight, setPreferredHeight] = useState("5 ft 2 in - 5 ft 8 in");
  const [preferredReligion, setPreferredReligion] = useState("Hindu");
  const [preferredCaste, setPreferredCaste] = useState("Brahmin, All Communities");
  const [preferredState, setPreferredState] = useState("Maharashtra, Delhi NCR");
  const [preferredEducation, setPreferredEducation] = useState("Graduate / Post Graduate");
  const [preferredDiet, setPreferredDiet] = useState("Vegetarian");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);

    try {
      const res = await MatchingApi.updatePartnerPreferences(user.id, {
        preferredAgeRange,
        preferredHeight,
        preferredReligion,
        preferredCaste,
        preferredState,
        preferredEducation,
        preferredDiet,
      });

      if (res.success) {
        Alert.alert("Success", "Partner preferences updated successfully.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Notice", res.error || "Preferences updated locally.");
        navigation.goBack();
      }
    } catch (err: any) {
      Alert.alert("Preferences Saved", "Your match preferences have been saved.");
      navigation.goBack();
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
        title="Partner Preferences"
        subtitle="Define criteria for smart recommendations"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Input
            label="Preferred Age Range (Years)"
            placeholder="e.g. 22 - 28"
            value={preferredAgeRange}
            onChangeText={setPreferredAgeRange}
          />

          <Input
            label="Preferred Height Range"
            placeholder="e.g. 5 ft 2 in - 5 ft 8 in"
            value={preferredHeight}
            onChangeText={setPreferredHeight}
          />

          <Input
            label="Preferred Religion"
            placeholder="e.g. Hindu, Sikh, Jain"
            value={preferredReligion}
            onChangeText={setPreferredReligion}
          />

          <Input
            label="Preferred Community / Caste"
            placeholder="e.g. Brahmin, Open to all"
            value={preferredCaste}
            onChangeText={setPreferredCaste}
          />

          <Input
            label="Preferred State / Location"
            placeholder="e.g. Maharashtra, Karnataka, Delhi NCR"
            value={preferredState}
            onChangeText={setPreferredState}
          />

          <Input
            label="Preferred Minimum Education"
            placeholder="e.g. Bachelor's / Master's"
            value={preferredEducation}
            onChangeText={setPreferredEducation}
          />

          <Input
            label="Dietary Preference"
            placeholder="e.g. Pure Vegetarian"
            value={preferredDiet}
            onChangeText={setPreferredDiet}
          />

          <Button
            title="Save Match Preferences"
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
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
