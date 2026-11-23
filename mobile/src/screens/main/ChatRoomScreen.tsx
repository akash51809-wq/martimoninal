import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Send,
  AlertTriangle,
  ShieldCheck,
  Flag,
  UserX,
  Sparkles,
} from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Header } from "../../components/common/Header";
import { CommunicationApi } from "../../services/api/communicationApi";
import { useAuth } from "../../context/AuthContext";
import type { RootStackParamList } from "../../navigation/types";

interface MessageItem {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
  hasScamWarning?: boolean;
}

const COMPATIBILITY_ICEBREAKERS = [
  "What does your ideal family Sunday look like?",
  "How do you balance work and personal life?",
  "What are your thoughts on city relocation after marriage?",
  "What core values are most essential for your future home?",
];

const SCAM_KEYWORDS = [
  "upi",
  "gpay",
  "phonepe",
  "paytm",
  "otp",
  "send money",
  "transfer money",
  "emergency cash",
  "whatsapp pe aao",
];

export const ChatRoomScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ChatRoom">>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  const { threadId, recipientId, recipientName } = route.params;

  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "msg-1",
      senderId: recipientId,
      text: "Namaste! It was wonderful reviewing your matrimonial profile.",
      timestamp: "10:45 AM",
      isSelf: false,
    },
    {
      id: "msg-2",
      senderId: user?.id || "usr-self",
      text: "Namaste! Thank you for accepting the interest. I am glad our family values align.",
      timestamp: "10:48 AM",
      isSelf: true,
    },
  ]);

  const [scamAlertVisible, setScamAlertVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const checkForScamKeywords = (text: string): boolean => {
    const lower = text.toLowerCase();
    return SCAM_KEYWORDS.some((kw) => lower.includes(kw));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const text = inputMessage.trim();
    setInputMessage("");

    const isSuspicious = checkForScamKeywords(text);
    if (isSuspicious) {
      setScamAlertVisible(true);
    }

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || "usr-self",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSelf: true,
      hasScamWarning: isSuspicious,
    };

    setMessages((prev) => [...prev, newMsg]);

    try {
      if (user?.id) {
        await CommunicationApi.sendMessage(user.id, recipientId, text);
      }
    } catch (err) {
      console.warn("Failed to persist message:", err);
    }
  };

  const handleInsertIcebreaker = (question: string) => {
    setInputMessage(question);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      <Header
        title={recipientName}
        subtitle="Active Conversation"
        showBack
        onBack={() => navigation.goBack()}
        rightAction={
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() =>
                navigation.navigate("ReportProfile", {
                  targetUserId: recipientId,
                  targetUserName: recipientName,
                })
              }
            >
              <Flag size={18} color={Colors.surface} />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Safety Alert Warning Banner */}
      <View style={styles.safetyNoticeBanner}>
        <ShieldCheck size={14} color={Colors.badgeVerified} />
        <Text style={styles.safetyNoticeText}>
          Safety First: Never share UPI PIN, OTP, or transfer emergency funds to any member.
        </Text>
      </View>

      {/* Real-Time Scam Warning Interceptor */}
      {scamAlertVisible && (
        <View style={styles.scamBanner}>
          <AlertTriangle size={18} color={Colors.danger} />
          <View style={styles.scamTextWrapper}>
            <Text style={styles.scamTitle}>Financial Safety Warning</Text>
            <Text style={styles.scamSubtitle}>
              Mentions of payments, UPI or money transfers detected. Vivah Kar Lo never requests funds between members.
            </Text>
          </View>
          <TouchableOpacity onPress={() => setScamAlertVisible(false)}>
            <Text style={styles.dismissText}>OK</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubbleWrapper,
              item.isSelf ? styles.selfWrapper : styles.otherWrapper,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                item.isSelf ? styles.selfBubble : styles.otherBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.isSelf ? styles.selfText : styles.otherText,
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  styles.timestampText,
                  item.isSelf ? styles.selfTimestamp : styles.otherTimestamp,
                ]}
              >
                {item.timestamp}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Compatibility Icebreakers Bar */}
      <View style={styles.icebreakerBar}>
        <View style={styles.icebreakerHeader}>
          <Sparkles size={12} color={Colors.gold} />
          <Text style={styles.icebreakerLabel}>Compatibility Icebreaker Questions</Text>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={COMPATIBILITY_ICEBREAKERS}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.icebreakerContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.icebreakerChip}
              onPress={() => handleInsertIcebreaker(item)}
            >
              <Text style={styles.icebreakerText} numberOfLines={1}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Input Row */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a respectful message..."
          placeholderTextColor={Colors.textMuted}
          value={inputMessage}
          onChangeText={setInputMessage}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputMessage.trim() && styles.sendBtnDisabled]}
          disabled={!inputMessage.trim()}
          onPress={handleSendMessage}
        >
          <Send size={18} color={Colors.surface} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerBtn: {
    padding: 6,
  },
  safetyNoticeBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 6,
  },
  safetyNoticeText: {
    fontSize: 11,
    color: Colors.textSecondary,
    flex: 1,
  },
  scamBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dangerLight,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dangerBorder,
    gap: 8,
  },
  scamTextWrapper: {
    flex: 1,
  },
  scamTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.danger,
  },
  scamSubtitle: {
    fontSize: 11,
    color: Colors.danger,
    marginTop: 1,
  },
  dismissText: {
    color: Colors.danger,
    fontWeight: "700",
    fontSize: 12,
    paddingHorizontal: 8,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 10,
  },
  messageBubbleWrapper: {
    marginBottom: 10,
    maxWidth: "80%",
  },
  selfWrapper: {
    alignSelf: "flex-end",
  },
  otherWrapper: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  selfBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  selfText: {
    color: Colors.surface,
  },
  otherText: {
    color: Colors.textPrimary,
  },
  timestampText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  selfTimestamp: {
    color: Colors.goldLight,
  },
  otherTimestamp: {
    color: Colors.textMuted,
  },
  icebreakerBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingVertical: 6,
  },
  icebreakerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 4,
    marginBottom: 4,
  },
  icebreakerLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  icebreakerContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  icebreakerChip: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    maxWidth: 240,
  },
  icebreakerText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
