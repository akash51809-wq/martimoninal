import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MessageCircle, ShieldCheck, ChevronRight } from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Header } from "../../components/common/Header";
import type { RootStackParamList } from "../../navigation/types";

interface ChatThread {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isKycVerified: boolean;
}

const SEED_THREADS: ChatThread[] = [
  {
    id: "th_usr-demo-priya",
    recipientId: "usr-demo-priya",
    recipientName: "Priya Sharma",
    recipientAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    lastMessage: "Namaste! It was wonderful reviewing your matrimonial profile.",
    lastMessageTime: "10:45 AM",
    unreadCount: 1,
    isKycVerified: true,
  },
  {
    id: "th_usr-demo-ananya",
    recipientId: "usr-demo-ananya",
    recipientName: "Ananya Deshmukh",
    recipientAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80",
    lastMessage: "Yes, our family values align very nicely.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    isKycVerified: true,
  },
];

export const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [threads, setThreads] = useState<ChatThread[]>(SEED_THREADS);

  return (
    <View style={styles.container}>
      <Header
        title="Messages"
        subtitle="End-to-end encrypted matrimonial conversations"
      />

      <View style={styles.securityNoticeRow}>
        <ShieldCheck size={14} color={Colors.badgeVerified} />
        <Text style={styles.securityNoticeText}>
          Protected by Anti-Fraud Safety Shield • Never share OTP or bank details
        </Text>
      </View>

      <FlatList
        data={threads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MessageCircle size={36} color={Colors.border} />
            <Text style={styles.emptyTitle}>No active conversations yet</Text>
            <Text style={styles.emptySubtitle}>
              Chat unlocks when both members mutually accept express interest.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.threadItem}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("ChatRoom", {
                threadId: item.id,
                recipientId: item.recipientId,
                recipientName: item.recipientName,
                recipientAvatar: item.recipientAvatar,
              })
            }
          >
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: item.recipientAvatar }} style={styles.avatar} />
              {item.isKycVerified && (
                <View style={styles.kycDot}>
                  <ShieldCheck size={10} color={Colors.surface} />
                </View>
              )}
            </View>

            <View style={styles.contentCol}>
              <View style={styles.topRow}>
                <Text style={styles.name}>{item.recipientName}</Text>
                <Text style={styles.time}>{item.lastMessageTime}</Text>
              </View>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>

            {item.unreadCount > 0 ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            ) : (
              <ChevronRight size={16} color={Colors.textMuted} />
            )}
          </TouchableOpacity>
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
  securityNoticeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 6,
  },
  securityNoticeText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  listContent: {
    padding: 14,
  },
  threadItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  kycDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: Colors.badgeKyc,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },
  contentCol: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  time: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  lastMessage: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  unreadBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
  },
  unreadText: {
    color: Colors.surface,
    fontSize: 11,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 20,
  },
});
