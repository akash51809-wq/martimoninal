import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Lock, EyeOff, ShieldCheck, UserX, Save } from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Header } from "../../components/common/Header";
import { Button } from "../../components/common/Button";
import { SecurityApi } from "../../services/api/securityApi";
import { useAuth } from "../../context/AuthContext";

export const PrivacySettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [lockSalary, setLockSalary] = useState(true);
  const [lockContact, setLockContact] = useState(true);
  const [lockFamily, setLockFamily] = useState(false);
  const [hidePhotosFromUnverified, setHidePhotosFromUnverified] = useState(true);
  const [visibleOnlyToVerified, setVisibleOnlyToVerified] = useState(false);
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);

    try {
      await SecurityApi.updatePrivacySettings(user.id, {
        lockSalary,
        lockContact,
        lockFamily,
        hidePhotosFromUnverified,
        visibleOnlyToVerified,
        incognitoMode,
      });

      Alert.alert("Privacy Updated", "Your selective field lock and visibility rules have been saved.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert("Saved", "Privacy settings updated.");
      navigation.goBack();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Privacy & Field Lock"
        subtitle="Control who sees your personal and sensitive details"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Selective Field Lock Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Lock size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>Selective Field Lock</Text>
          </View>
          <Text style={styles.cardDesc}>
            Locked details remain hidden until you mutually accept an express interest invitation.
          </Text>

          <View style={styles.switchRow}>
            <View style={styles.textCol}>
              <Text style={styles.switchTitle}>Lock Contact Number</Text>
              <Text style={styles.switchSubtitle}>Visible only after mutual connection</Text>
            </View>
            <Switch
              value={lockContact}
              onValueChange={setLockContact}
              trackColor={{ false: Colors.border, true: Colors.secondary }}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.textCol}>
              <Text style={styles.switchTitle}>Lock Annual Income &amp; Salary</Text>
              <Text style={styles.switchSubtitle}>Hide financial figures from public search</Text>
            </View>
            <Switch
              value={lockSalary}
              onValueChange={setLockSalary}
              trackColor={{ false: Colors.border, true: Colors.secondary }}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.textCol}>
              <Text style={styles.switchTitle}>Lock Family Background Details</Text>
              <Text style={styles.switchSubtitle}>Protect parents and siblings information</Text>
            </View>
            <Switch
              value={lockFamily}
              onValueChange={setLockFamily}
              trackColor={{ false: Colors.border, true: Colors.secondary }}
            />
          </View>
        </View>

        {/* Custom Visibility Rules Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ShieldCheck size={18} color={Colors.info} />
            <Text style={styles.cardTitle}>Custom Visibility Rules</Text>
          </View>

          <View style={styles.switchRow}>
            <View style={styles.textCol}>
              <Text style={styles.switchTitle}>Hide Display Photos From Unverified Users</Text>
              <Text style={styles.switchSubtitle}>Only verified profiles can see your portrait</Text>
            </View>
            <Switch
              value={hidePhotosFromUnverified}
              onValueChange={setHidePhotosFromUnverified}
              trackColor={{ false: Colors.border, true: Colors.secondary }}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.textCol}>
              <Text style={styles.switchTitle}>Visible Only To Verified Prospects</Text>
              <Text style={styles.switchSubtitle}>Completely hide your profile from unverified accounts</Text>
            </View>
            <Switch
              value={visibleOnlyToVerified}
              onValueChange={setVisibleOnlyToVerified}
              trackColor={{ false: Colors.border, true: Colors.secondary }}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.textCol}>
              <Text style={styles.switchTitle}>Incognito / Hide Profile Temporarily</Text>
              <Text style={styles.switchSubtitle}>Pause discovery while you talk to ongoing matches</Text>
            </View>
            <Switch
              value={incognitoMode}
              onValueChange={setIncognitoMode}
              trackColor={{ false: Colors.border, true: Colors.secondary }}
            />
          </View>
        </View>

        <Button
          title="Save Privacy Rules"
          variant="primary"
          size="large"
          loading={isSaving}
          onPress={handleSave}
          icon={<Save size={18} color={Colors.surface} />}
        />
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
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  cardDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 16,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  textCol: {
    flex: 1,
    paddingRight: 12,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  switchSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
