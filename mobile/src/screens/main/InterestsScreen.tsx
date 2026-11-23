import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Check, X, MessageCircle, Heart, Clock, ShieldCheck } from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Header } from "../../components/common/Header";
import { Button } from "../../components/common/Button";
import { CommunicationApi } from "../../services/api/communicationApi";
import { useAuth } from "../../context/AuthContext";
import type { RootStackParamList } from "../../navigation/types";

interface InterestItem {
  id: string;
  userId: string;
  fullName: string;
  age: number;
  city: string;
  state: string;
  occupation: string;
  avatarUrl: string;
  sentAt: string;
  status: "pending" | "accepted" | "declined";
}

const SEED_RECEIVED: InterestItem[] = [
  {
    id: "int-101",
    userId: "usr-demo-ananya",
    fullName: "Ananya Deshmukh",
    age: 25,
    city: "Pune",
    state: "Maharashtra",
    occupation: "Architect",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80",
    sentAt: "2 hours ago",
    status: "pending",
  },
  {
    id: "int-102",
    userId: "usr-demo-kavya",
    fullName: "Kavya Iyer",
    age: 27,
    city: "Bengaluru",
    state: "Karnataka",
    occupation: "Senior Financial Analyst",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    sentAt: "Yesterday",
    status: "pending",
  },
];

const SEED_MUTUAL: InterestItem[] = [
  {
    id: "int-201",
    userId: "usr-demo-priya",
    fullName: "Priya Sharma",
    age: 26,
    city: "Mumbai",
    state: "Maharashtra",
    occupation: "Software Engineer",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    sentAt: "3 days ago",
    status: "accepted",
  },
];

export const InterestsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"received" | "sent" | "mutual">("received");
  const [receivedList, setReceivedList] = useState<InterestItem[]>(SEED_RECEIVED);
  const [mutualList, setMutualList] = useState<InterestItem[]>(SEED_MUTUAL);

  const handleRespond = async (interestId: string, action: "accept" | "decline") => {
    try {
      await CommunicationApi.respondToInterest(interestId, action);

      if (action === "accept") {
        const accepted = receivedList.find((i) => i.id === interestId);
        if (accepted) {
          setMutualList((prev) => [{ ...accepted, status: "accepted" }, ...prev]);
        }
        setReceivedList((prev) => prev.filter((i) => i.id !== interestId));
        Alert.alert(
          "Interest Accepted!",
          "You are now mutually connected. You can start a secure chat conversation.",
          [
            {
              text: "Start Chat",
              onPress: () => {
                if (accepted) {
                  navigation.navigate("ChatRoom", {
                    threadId: `th_${accepted.userId}`,
                    recipientId: accepted.userId,
                    recipientName: accepted.fullName,
                    recipientAvatar: accepted.avatarUrl,
                  });
                }
              },
            },
            { text: "Later", style: "cancel" },
          ]
        );
      } else {
        setReceivedList((prev) => prev.filter((i) => i.id !== interestId));
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to respond to interest.");
    }
  };

  const currentData =
    activeTab === "received" ? receivedList : activeTab === "mutual" ? mutualList : [];

  return (
    <View style={styles.container}>
      <Header
        title="Interests & Matches"
        subtitle="Manage invitations and connected prospects"
      />

      {/* Tabs Row */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          onPress={() => setActiveTab("received")}
          style={[styles.tabBtn, activeTab === "received" && styles.tabBtnActive]}
        >
          <Text style={[styles.tabText, activeTab === "received" && styles.tabTextActive]}>
            Received ({receivedList.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("mutual")}
          style={[styles.tabBtn, activeTab === "mutual" && styles.tabBtnActive]}
        >
          <Text style={[styles.tabText, activeTab === "mutual" && styles.tabTextActive]}>
            Connected ({mutualList.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("sent")}
          style={[styles.tabBtn, activeTab === "sent" && styles.tabBtnActive]}
        >
          <Text style={[styles.tabText, activeTab === "sent" && styles.tabTextActive]}>
            Sent (3)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Daily Quota Counter Banner */}
      <View style={styles.quotaBanner}>
        <Clock size={14} color={Colors.secondary} />
        <Text style={styles.quotaText}>
          Daily Interest Quota: <Text style={styles.quotaHighlight}>12 of 15 remaining today</Text>
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={currentData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Heart size={32} color={Colors.border} />
            <Text style={styles.emptyTitle}>No pending invitations in this category</Text>
            <Text style={styles.emptySubtitle}>
              Browse prospective matches in Discover to expand your network.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.interestCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ProfileDetail", { profileId: item.userId })}
              style={styles.cardHeader}
            >
              <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
              <View style={styles.infoCol}>
                <Text style={styles.name}>
                  {item.fullName}, {item.age}
                </Text>
                <Text style={styles.meta}>
                  {item.city}, {item.state}
                </Text>
                <Text style={styles.occupation} numberOfLines={1}>
                  {item.occupation}
                </Text>
                <Text style={styles.timeText}>{item.sentAt}</Text>
              </View>
            </TouchableOpacity>

            {activeTab === "received" && (
              <View style={styles.actionsRow}>
                <Button
                  title="Decline"
                  variant="outline"
                  size="small"
                  style={styles.declineBtn}
                  onPress={() => handleRespond(item.id, "decline")}
                  icon={<X size={14} color={Colors.primary} />}
                />
                <Button
                  title="Accept Interest"
                  variant="secondary"
                  size="small"
                  style={styles.acceptBtn}
                  onPress={() => handleRespond(item.id, "accept")}
                  icon={<Check size={14} color={Colors.surface} />}
                />
              </View>
            )}

            {activeTab === "mutual" && (
              <View style={styles.actionsRow}>
                <Button
                  title="Start Chat Conversation"
                  variant="primary"
                  size="small"
                  style={{ flex: 1 }}
                  onPress={() =>
                    navigation.navigate("ChatRoom", {
                      threadId: `th_${item.userId}`,
                      recipientId: item.userId,
                      recipientName: item.fullName,
                      recipientAvatar: item.avatarUrl,
                    })
                  }
                  icon={<MessageCircle size={14} color={Colors.surface} />}
                />
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabsRow: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabBtnActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: "700",
  },
  quotaBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 6,
  },
  quotaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  quotaHighlight: {
    fontWeight: "700",
    color: Colors.secondary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  interestCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  meta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  occupation: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  timeText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 3,
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 10,
  },
  declineBtn: {
    flex: 1,
  },
  acceptBtn: {
    flex: 1.4,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
});
