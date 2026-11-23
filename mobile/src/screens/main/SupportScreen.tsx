import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LifeBuoy, MessageCircle, Phone, ChevronDown, ChevronUp, Send } from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Header } from "../../components/common/Header";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "How does 100% profile verification work?",
    a: "Every member verifies their mobile via OTP, government photo ID proof (Aadhaar/Passport), and a live selfie. Our moderation desk validates documents to award the Blue/Gold Trust Badge.",
  },
  {
    q: "Are my photos and salary protected?",
    a: "Yes! Use 'Selective Field Lock' in Privacy Settings to hide your salary, contact number, or display photo until you mutually accept an express interest.",
  },
  {
    q: "How is Vedic Kundli Milan calculated?",
    a: "We compute the traditional 36-Guna Ashtakoot system analyzing Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi, alongside Manglik Dosha compatibility.",
  },
  {
    q: "What should I do if someone asks for money?",
    a: "Vivah Kar Lo members never request funds. If any user asks for money, immediately tap 'Report Profile'. Any profile receiving 3 verified reports is automatically suspended.",
  },
];

export const SupportScreen: React.FC = () => {
  const navigation = useNavigation();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenWhatsApp = () => {
    Linking.openURL("whatsapp://send?phone=+919876543210&text=Hello%20Vivah%20Kar%20Lo%20Support");
  };

  const handleCallHelpline = () => {
    Linking.openURL("tel:18001234567");
  };

  const handleCreateTicket = () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      Alert.alert("Required", "Please provide a subject and message for your support ticket.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setTicketSubject("");
      setTicketMessage("");
      Alert.alert(
        "Ticket Created",
        "Your support ticket has been received. Our help desk will respond within 4 business hours."
      );
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Help & Support"
        subtitle="24/7 dedicated matrimonial assistance"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Quick Contact Buttons */}
        <View style={styles.contactRow}>
          <TouchableOpacity style={styles.contactBtn} onPress={handleOpenWhatsApp}>
            <MessageCircle size={22} color={Colors.success} />
            <Text style={styles.contactBtnTitle}>WhatsApp Help</Text>
            <Text style={styles.contactBtnSubtitle}>Instant Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactBtn} onPress={handleCallHelpline}>
            <Phone size={22} color={Colors.primary} />
            <Text style={styles.contactBtnTitle}>Call Helpline</Text>
            <Text style={styles.contactBtnSubtitle}>1800-123-4567</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs Section */}
        <Text style={styles.sectionHeading}>Frequently Asked Questions</Text>
        <View style={styles.card}>
          {FAQS.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <TouchableOpacity
                key={`faq_${idx}`}
                style={styles.faqItem}
                onPress={() => setExpandedFaq(isExpanded ? null : idx)}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.q}</Text>
                  {isExpanded ? (
                    <ChevronUp size={18} color={Colors.primary} />
                  ) : (
                    <ChevronDown size={18} color={Colors.textMuted} />
                  )}
                </View>
                {isExpanded && <Text style={styles.faqAnswer}>{faq.a}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Create Support Ticket */}
        <Text style={styles.sectionHeading}>Create a Support Ticket</Text>
        <View style={styles.card}>
          <Input
            label="Subject / Topic"
            placeholder="e.g. Question regarding profile verification"
            value={ticketSubject}
            onChangeText={setTicketSubject}
          />

          <Input
            label="Detailed Description"
            placeholder="Describe your issue or query..."
            value={ticketMessage}
            onChangeText={setTicketMessage}
            multiline
            numberOfLines={4}
            style={{ height: 80 }}
          />

          <Button
            title="Submit Support Ticket"
            variant="primary"
            size="large"
            loading={isSubmitting}
            onPress={handleCreateTicket}
            icon={<Send size={16} color={Colors.surface} />}
          />
        </View>
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
  contactRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  contactBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  contactBtnTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginTop: 6,
  },
  contactBtnSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingVertical: 12,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
    flex: 1,
    paddingRight: 8,
  },
  faqAnswer: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
    lineHeight: 18,
  },
});
