import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ShieldCheck,
  Lock,
  Bell,
  Smartphone,
  LogOut,
  ChevronRight,
  RefreshCw,
  Info,
} from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Header } from "../../components/common/Header";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { OtaUpdateService } from "../../services/updates/otaUpdateService";

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    user,
    logout,
    biometricSupported,
    biometricEnabled,
    setBiometricPreference,
  } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [checkingUpdate, setCheckingUpdate] = useState(false);

  const handleToggleBiometrics = async (val: boolean) => {
    const success = await setBiometricPreference(val);
    if (!success) {
      Alert.alert("Biometrics Notice", "Unable to update biometric lock preference.");
    }
  };

  const handleCheckUpdate = async () => {
    setCheckingUpdate(true);
    try {
      const result = await OtaUpdateService.checkForUpdate();
      if (result.isAvailable) {
        Alert.alert(
          "Update Available",
          "A new version of Vivah Kar Lo is ready. Download and apply now?",
          [
            {
              text: "Update Now",
              onPress: async () => {
                await OtaUpdateService.fetchAndApplyUpdate();
              },
            },
            { text: "Later", style: "cancel" },
          ]
        );
      } else {
        Alert.alert("Up to Date", "You are running the latest version of Vivah Kar Lo (v1.0.0).");
      }
    } catch {
      Alert.alert("Up to Date", "Your application is currently up to date.");
    } finally {
      setCheckingUpdate(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to securely sign out of your Vivah Kar Lo account on this device?",
      [
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Account & Security"
        subtitle="Manage device security, notifications & biometrics"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Device Security & Biometrics */}
        <Text style={styles.sectionHeading}>Device Security</Text>
        <View style={styles.card}>
          {biometricSupported && (
            <View style={styles.settingRow}>
              <View style={styles.iconCircle}>
                <ShieldCheck size={20} color={Colors.primary} />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.settingTitle}>Biometric App Lock</Text>
                <Text style={styles.settingSubtitle}>
                  Require Face ID or Fingerprint on app launch
                </Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={handleToggleBiometrics}
                trackColor={{ false: Colors.border, true: Colors.secondary }}
              />
            </View>
          )}

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => Alert.alert("Change Password", "A password reset link has been dispatched to your email.")}
          >
            <View style={styles.iconCircle}>
              <Lock size={18} color={Colors.secondary} />
            </View>
            <Text style={styles.actionRowTitle}>Change Account Password</Text>
            <ChevronRight size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Preferences & Notifications */}
        <Text style={styles.sectionHeading}>Preferences</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.iconCircle}>
              <Bell size={18} color={Colors.info} />
            </View>
            <View style={styles.textCol}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingSubtitle}>
                Alerts for interests, messages and daily matches
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.border, true: Colors.secondary }}
            />
          </View>
        </View>

        {/* App Version & OTA Updates */}
        <Text style={styles.sectionHeading}>App Information</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>v1.0.0 (Production Release)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build Channel</Text>
            <Text style={styles.infoValue}>Production EAS / OTA Ready</Text>
          </View>

          <TouchableOpacity
            style={styles.updateRow}
            onPress={handleCheckUpdate}
            disabled={checkingUpdate}
          >
            <RefreshCw size={16} color={Colors.primary} />
            <Text style={styles.updateRowText}>
              {checkingUpdate ? "Checking updates..." : "Check for Over-The-Air (OTA) Updates"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <Button
          title="Sign Out from This Device"
          variant="outline"
          size="large"
          onPress={handleLogout}
          style={styles.logoutBtn}
          icon={<LogOut size={18} color={Colors.danger} />}
          textStyle={{ color: Colors.danger }}
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
  sectionHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionRowTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textCol: {
    flex: 1,
    paddingRight: 8,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  settingSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  updateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  updateRowText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primary,
  },
  logoutBtn: {
    marginTop: 10,
    borderColor: Colors.dangerBorder,
  },
});
