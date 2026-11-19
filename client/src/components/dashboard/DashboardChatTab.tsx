import React, { useState, useEffect, useRef } from "react";
import { MOCK_CHATS } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  ShieldCheck,
  Phone,
  Video,
  ArrowLeft,
  Lock,
  AlertTriangle,
  UserX,
  Flag,
  Sparkles,
  Check,
  CheckCheck,
  Languages,
  Mic,
  Square,
  HelpCircle,
  X,
} from "lucide-react";

const COMPATIBILITY_5_QUESTIONS = [
  {
    id: "q1",
    topic: "Weekend & Lifestyle",
    question: "How does your ideal relaxing Sunday with family look?",
  },
  {
    id: "q2",
    topic: "Family & Living Setup",
    question: "How do you envision balancing closeness with both families after marriage?",
  },
  {
    id: "q3",
    topic: "Career & Relocation",
    question: "What are your thoughts on career growth and potential city relocation?",
  },
  {
    id: "q4",
    topic: "Financial Outlook",
    question: "Are you more of a planner/investor or spontaneous about travel and lifestyle?",
  },
  {
    id: "q5",
    topic: "Core Marriage Value",
    question: "What is the single most important quality you value in a lifelong partner?",
  },
];

const REACTION_EMOJIS = ["❤️", "👍", "🙏", "😊"];
import { useToast } from "@/hooks/use-toast";
import { analyzeMessageForDlp } from "@/utils/dataLeakPrevention";
import { RequestContactModal } from "@/components/modals/RequestContactModal";
import { BlockUserModal } from "@/components/modals/BlockUserModal";
import { ReportUserModal } from "@/components/modals/ReportUserModal";

interface DashboardChatTabProps {
  initialProfileId?: string | null;
  currentUserId?: string;
  isVipMember?: boolean;
}

export const DashboardChatTab: React.FC<DashboardChatTabProps> = ({
  initialProfileId,
  currentUserId = "usr-demo-001",
  isVipMember = true,
}) => {
  const { toast } = useToast();
  const [chats, setChats] = useState(MOCK_CHATS);
  const [activeId, setActiveId] = useState<string>(
    initialProfileId || MOCK_CHATS[0].profileId
  );
  const [mobileThreadOpen, setMobileThreadOpen] = useState(
    Boolean(initialProfileId)
  );
  const [draft, setDraft] = useState("");
  const [dlpWarning, setDlpWarning] = useState<string | null>(null);

  // Modals state
  const [showContactModal, setShowContactModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Chat Translation state
  const [targetLang, setTargetLang] = useState<string>("hi");
  const [translations, setTranslations] = useState<
    Record<string, { text: string; langName: string }>
  >({});
  const [translatingId, setTranslatingId] = useState<string | null>(null);

  // Live Typing Indicator & Emoji Reactions state
  const [isPartnerTyping, setIsPartnerTyping] = useState<boolean>(false);
  const [reactions, setReactions] = useState<Record<string, Record<string, number>>>({
    m1: { "🙏": 1 },
    m3: { "❤️": 1 },
  });

  // Compatibility Q&A / 5 Questions Deck state
  const [showQaDeck, setShowQaDeck] = useState<boolean>(false);
  const [selectedQa, setSelectedQa] = useState(COMPATIBILITY_5_QUESTIONS[0]);
  const [qaAnswer, setQaAnswer] = useState<string>("");

  // Voice Note Recorder state (Max 60s)
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleReaction = (msgId: string, emoji: string) => {
    setReactions((prev) => {
      const current = { ...(prev[msgId] || {}) };
      if (current[emoji]) {
        delete current[emoji];
      } else {
        current[emoji] = 1;
      }
      return { ...prev, [msgId]: current };
    });
  };

  const triggerSimulatedPartnerTyping = () => {
    setIsPartnerTyping(true);
    setTimeout(() => {
      setIsPartnerTyping(false);
    }, 3200);
  };

  const stopRecordingTimer = () => {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
  };

  const appendVoiceNoteMessage = (audioUrl: string, durationSec: number) => {
    const newMsgId = `voice-${Date.now()}`;
    const label = `Voice Note (${durationSec}s)`;
    setChats((prev) =>
      prev.map((c) =>
        c.profileId === activeChat.profileId
          ? {
              ...c,
              lastMessage: `Voice Message (${durationSec}s)`,
              timestamp: "Just now",
              messages: [
                ...c.messages,
                {
                  id: newMsgId,
                  sender: "user" as const,
                  text: label,
                  time: "Just now",
                  status: "delivered" as const,
                  audioUrl,
                  audioDuration: durationSec,
                } as any,
              ],
            }
          : c
      )
    );
    triggerSimulatedPartnerTyping();
    toast({
      title: "Voice Note Sent",
      description: `${durationSec}-second audio message delivered securely.`,
    });
  };

  const startVoiceRecording = async () => {
    if (isRecording) return;
    setRecordingSeconds(0);
    audioChunksRef.current = [];
    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        recorder.ondataavailable = (ev) => {
          if (ev.data.size > 0) audioChunksRef.current.push(ev.data);
        };
        recorder.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const url = URL.createObjectURL(blob);
          const secs = Math.max(1, recordingSeconds);
          appendVoiceNoteMessage(url, secs);
        };
        recorder.start();
        setIsRecording(true);
        let elapsed = 0;
        recordTimerRef.current = setInterval(() => {
          elapsed += 1;
          setRecordingSeconds(elapsed);
          if (elapsed >= 60) {
            stopAndSendVoiceNote();
          }
        }, 1000);
        return;
      }
      throw new Error("Microphone unavailable");
    } catch {
      // Graceful fallback when microphone permission is unavailable so UX never breaks
      setIsRecording(true);
      let elapsed = 0;
      recordTimerRef.current = setInterval(() => {
        elapsed += 1;
        setRecordingSeconds(elapsed);
        if (elapsed >= 60) {
          stopAndSendVoiceNote();
        }
      }, 1000);
      toast({
        title: "Simulated Voice Recorder Active",
        description: "Microphone access unavailable in this browser — click Stop to send a verified voice greeting clip.",
      });
    }
  };

  const stopAndSendVoiceNote = () => {
    stopRecordingTimer();
    const secs = Math.max(3, recordingSeconds);
    setIsRecording(false);
    setRecordingSeconds(0);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    } else {
      appendVoiceNoteMessage("", secs);
    }
  };

  const cancelVoiceRecording = () => {
    stopRecordingTimer();
    setIsRecording(false);
    setRecordingSeconds(0);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  };

  const handleSendQaCard = (e: React.FormEvent) => {
    e.preventDefault();
    const ans = qaAnswer.trim();
    if (!ans) return;
    const dlp = analyzeMessageForDlp(ans);
    if (dlp.containsViolation) {
      toast({
        title: "Answer Blocked by DLP Firewall",
        description: dlp.warningMessage,
        variant: "destructive",
      });
      return;
    }
    const newMsgId = `qa-${Date.now()}`;
    setChats((prev) =>
      prev.map((c) =>
        c.profileId === activeChat.profileId
          ? {
              ...c,
              lastMessage: `Compatibility Q&A: ${selectedQa.topic}`,
              timestamp: "Just now",
              messages: [
                ...c.messages,
                {
                  id: newMsgId,
                  sender: "user" as const,
                  text: ans,
                  time: "Just now",
                  status: "delivered" as const,
                  qaCard: {
                    topic: selectedQa.topic,
                    question: selectedQa.question,
                  },
                } as any,
              ],
            }
          : c
      )
    );
    setQaAnswer("");
    setShowQaDeck(false);
    triggerSimulatedPartnerTyping();
    toast({
      title: "Compatibility Q&A Card Sent",
      description: "Shared your question & answer to spark a meaningful conversation.",
    });
  };

  const handleTranslateMessage = async (msgId: string, originalText: string) => {
    if (translations[msgId]) {
      // Toggle hide translation
      setTranslations((prev) => {
        const next = { ...prev };
        delete next[msgId];
        return next;
      });
      return;
    }

    setTranslatingId(msgId);
    try {
      const res = await fetch("/api/v1/communication/chat/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: originalText, targetLang }),
      });
      const data = await res.json();
      if (data.success && data.translatedText) {
        setTranslations((prev) => ({
          ...prev,
          [msgId]: {
            text: data.translatedText,
            langName: data.targetLanguageName || targetLang.toUpperCase(),
          },
        }));
      } else {
        throw new Error(data.error || "Translation unavailable");
      }
    } catch {
      toast({
        title: "Translation Notice",
        description: "Unable to translate message right now. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTranslatingId(null);
    }
  };

  const activeChat =
    chats.find((c) => c.profileId === activeId) || chats[0];

  useEffect(() => {
    if (initialProfileId) {
      setActiveId(initialProfileId);
      setMobileThreadOpen(true);
    }
  }, [initialProfileId]);

  // Mark chat as read via API and clear local unread count
  useEffect(() => {
    if (activeId && currentUserId) {
      fetch("/api/v1/communication/chat/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId: `ch_${currentUserId}_${activeId}`,
          readerUserId: currentUserId,
        }),
      }).catch(() => {});

      setChats((prev) =>
        prev.map((c) =>
          c.profileId === activeId ? { ...c, unread: 0 } : c
        )
      );
    }
  }, [activeId, currentUserId]);

  // Live DLP check as user types
  const handleDraftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDraft(value);
    if (value.trim().length > 4) {
      const dlp = analyzeMessageForDlp(value);
      if (dlp.containsViolation) {
        setDlpWarning(dlp.warningMessage);
      } else {
        setDlpWarning(null);
      }
    } else {
      setDlpWarning(null);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !activeChat) return;

    // Strict Data Leak Prevention Check
    const dlp = analyzeMessageForDlp(text);
    if (dlp.containsViolation) {
      setDlpWarning(dlp.warningMessage);
      toast({
        title: "Message Blocked by DLP Firewall",
        description: dlp.warningMessage,
        variant: "destructive",
      });
      return;
    }

    const newMsgId = `msg-${Date.now()}`;
    setChats((prev) =>
      prev.map((c) =>
        c.profileId === activeChat.profileId
          ? {
              ...c,
              lastMessage: text,
              timestamp: "Just now",
              messages: [
                ...c.messages,
                {
                  id: newMsgId,
                  sender: "user" as const,
                  text,
                  time: "Just now",
                  status: "delivered" as const,
                },
              ],
            }
          : c
      )
    );
    setDraft("");
    setDlpWarning(null);
    triggerSimulatedPartnerTyping();

    // Simulate alliance opening and reading message after 2.5 seconds
    setTimeout(() => {
      setChats((prev) =>
        prev.map((c) =>
          c.profileId === activeChat.profileId
            ? {
                ...c,
                messages: c.messages.map((m: any) =>
                  m.id === newMsgId ? { ...m, status: "read" } : m
                ),
              }
            : c
        )
      );
    }, 2500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
            Messages &amp; Family Chat
          </h1>
          <p className="text-sm text-[#5C4740]">
            End-to-end encrypted conversations with mutually accepted alliances
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 self-start">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Active DLP Contact Protection</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-amber-200/80 shadow-sm overflow-hidden grid lg:grid-cols-12 min-h-[560px] max-h-[700px]">
        {/* Left Conversations List */}
        <aside
          className={`lg:col-span-4 border-r border-amber-100 flex flex-col ${
            mobileThreadOpen ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="p-4 border-b border-amber-100 bg-amber-50/40 flex items-center justify-between">
            <span className="text-sm font-bold text-[#3B0A18]">
              Mutual Matches ({chats.length})
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <Lock className="w-3.5 h-3.5" />
              Encrypted
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-amber-100/70">
            {chats.map((chat) => {
              const isSelected = chat.profileId === activeChat.profileId;
              return (
                <button
                  key={chat.profileId}
                  type="button"
                  onClick={() => {
                    setActiveId(chat.profileId);
                    setMobileThreadOpen(true);
                    setDlpWarning(null);
                  }}
                  className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                    isSelected ? "bg-orange-50/80" : "hover:bg-amber-50/40"
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={chat.avatar}
                      alt={chat.candidateName}
                      className="w-12 h-12 rounded-full object-cover border border-amber-200"
                    />
                    {chat.online && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-serif-royal text-sm font-bold text-[#2B120C] truncate">
                        {chat.candidateName}
                      </p>
                      <span className="text-[11px] text-[#8C6D62] shrink-0">
                        {chat.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-xs text-[#5C4740] truncate">
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#FF7700] text-white text-[10px] font-bold shrink-0">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Active Chat Thread */}
        <div
          className={`lg:col-span-8 flex flex-col bg-[#FFFDF9] ${
            mobileThreadOpen ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Chat Header */}
          <div className="p-3.5 sm:p-4 border-b border-amber-100 bg-white flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileThreadOpen(false)}
                className="lg:hidden p-2 rounded-full hover:bg-amber-50 text-[#3B0A18]"
                aria-label="Back to conversations"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <img
                src={activeChat.avatar}
                alt={activeChat.candidateName}
                className="w-10 h-10 rounded-full object-cover border border-amber-200 shrink-0"
              />
              <div className="min-w-0">
                <p className="font-serif-royal text-base font-bold text-[#2B120C] truncate">
                  {activeChat.candidateName}
                </p>
                <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {activeChat.online ? "Online • Privacy Shield Active" : "Offline"}
                </p>
              </div>
            </div>

            {/* Header Actions: Request Contact, Block, Report */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowContactModal(true)}
                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl border-amber-300 bg-amber-50/60 text-[#3B0A18] hover:bg-amber-100 text-xs font-semibold"
              >
                <Phone className="w-3.5 h-3.5 mr-1 text-[#EA580C]" />
                <span className="hidden sm:inline">Request Contact</span>
                <span className="sm:hidden">Contact</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowBlockModal(true)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                title="Block User"
              >
                <UserX className="w-4 h-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowReportModal(true)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                title="Report User"
              >
                <Flag className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Privacy Notice & Live Chat Translation Selector Banner */}
          <div className="px-4 py-2 bg-amber-50/70 border-b border-amber-100 text-[11px] text-[#5C4740] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-[#EA580C] shrink-0" />
              Direct phone/email sharing in chat is restricted. Use <strong>Request Contact</strong> for verified unmasking.
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <Languages className="w-3.5 h-3.5 text-[#EA580C]" />
              <span className="font-bold text-[#3B0A18]">Translate To:</span>
              <select
                value={targetLang}
                onChange={(e) => {
                  setTargetLang(e.target.value);
                  setTranslations({});
                }}
                aria-label="Chat translation language"
                className="h-7 rounded-lg border border-amber-300 bg-white px-2 text-[11px] font-semibold text-[#2B120C]"
              >
                <option value="hi">Hindi</option>
                <option value="en">English</option>
                <option value="mr">Marathi</option>
                <option value="gu">Gujarati</option>
                <option value="bn">Bengali</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="pa">Punjabi</option>
                <option value="kn">Kannada</option>
              </select>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {activeChat.messages.map((m) => {
              const isMe = m.sender === "user";
              const translated = translations[m.id];
              const isTranslating = translatingId === m.id;
              return (
                <div
                  key={m.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                      isMe
                        ? "bg-saffron-gradient text-white rounded-br-sm"
                        : "bg-white border border-amber-200 text-[#2B120C] rounded-bl-sm"
                    }`}
                  >
                    {/* Optional Compatibility Q&A Header Card */}
                    {(m as any).qaCard && (
                      <div
                        className={`mb-2 p-2.5 rounded-xl text-xs border ${
                          isMe
                            ? "bg-white/15 border-white/25 text-amber-50"
                            : "bg-amber-50 border-amber-200 text-[#3B0A18]"
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-85 flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" />
                          Compatibility Q&amp;A • {(m as any).qaCard.topic}
                        </span>
                        <p className="font-bold mt-0.5">{(m as any).qaCard.question}</p>
                      </div>
                    )}

                    {/* Optional Voice Note Audio Player (30-60s) */}
                    {(m as any).audioDuration ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <Mic className="w-3.5 h-3.5" />
                          <span>Voice Note • {(m as any).audioDuration}s</span>
                        </div>
                        {(m as any).audioUrl ? (
                          <audio
                            controls
                            src={(m as any).audioUrl}
                            className="h-8 w-52 max-w-full"
                          />
                        ) : (
                          <div
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-medium ${
                              isMe ? "bg-white/20 text-white" : "bg-amber-50 text-[#5C4740]"
                            }`}
                          >
                            Verified Voice Greeting Clip ({(m as any).audioDuration}s)
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="leading-relaxed">{m.text}</p>
                    )}

                    {translated && (
                      <div
                        className={`mt-2 pt-1.5 border-t text-xs leading-relaxed ${
                          isMe
                            ? "border-white/25 text-amber-50"
                            : "border-amber-200 text-[#4E342E] bg-amber-50/60 -mx-2 px-2 py-1 rounded-lg"
                        }`}
                      >
                        <span className="block text-[9px] font-bold uppercase tracking-wider opacity-80 mb-0.5">
                          Translated ({translated.langName})
                        </span>
                        {translated.text}
                      </div>
                    )}

                    <div
                      className={`flex items-center justify-between gap-3 text-[10px] mt-1.5 ${
                        isMe ? "text-amber-100" : "text-[#8C6D62]"
                      }`}
                    >
                      <button
                        type="button"
                        disabled={isTranslating}
                        onClick={() => handleTranslateMessage(m.id, m.text)}
                        className={`inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline ${
                          isMe ? "text-amber-100/95" : "text-[#EA580C]"
                        }`}
                      >
                        <Languages className="w-3 h-3" />
                        {isTranslating
                          ? "Translating..."
                          : translated
                          ? "Hide"
                          : "Translate"}
                      </button>

                      <span className="inline-flex items-center gap-1">
                        <span>{m.time}</span>
                        {isMe && (
                          <span
                            title={
                              (m as any).status === "read"
                                ? "Read"
                                : (m as any).status === "delivered"
                                ? "Delivered"
                                : "Sent"
                            }
                            className="inline-flex items-center ml-0.5"
                          >
                            {(m as any).status === "read" ? (
                              <CheckCheck className="w-3.5 h-3.5 text-sky-200" />
                            ) : (m as any).status === "delivered" ? (
                              <CheckCheck className="w-3.5 h-3.5 text-amber-200/80" />
                            ) : (
                              <Check className="w-3 h-3 text-amber-200/80" />
                            )}
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Emoji Reactions Bar & Active Reaction Pills */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5 mt-1.5 pt-1 border-t border-black/10">
                      <div className="flex items-center gap-1">
                        {REACTION_EMOJIS.map((emoji) => {
                          const activeCount = reactions[m.id]?.[emoji] || 0;
                          return (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => toggleReaction(m.id, emoji)}
                              className={`px-1.5 py-0.5 rounded-full text-[11px] transition-transform hover:scale-110 ${
                                activeCount > 0
                                  ? isMe
                                    ? "bg-white/25 text-white font-bold"
                                    : "bg-amber-100 border border-amber-300 text-[#2B120C] font-bold"
                                  : isMe
                                  ? "opacity-70 hover:opacity-100"
                                  : "opacity-55 hover:opacity-100"
                              }`}
                              title={`React with ${emoji}`}
                            >
                              {emoji}
                              {activeCount > 0 ? ` ${activeCount}` : ""}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Live Partner Typing Indicator */}
            {isPartnerTyping && (
              <div className="flex justify-start">
                <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm bg-white border border-amber-200 text-xs text-[#7C2D12] font-semibold flex items-center gap-2 shadow-xs">
                  <span>{activeChat.candidateName} is typing</span>
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] animate-bounce [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Compatibility Q&A / 5 Questions Interactive Drawer */}
          {showQaDeck && (
            <div className="mx-3 sm:mx-4 mb-2 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#3B0A18] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#EA580C]" />
                  Compatibility Q&amp;A — 5 Conversation Starter Cards
                </span>
                <button
                  type="button"
                  onClick={() => setShowQaDeck(false)}
                  className="text-xs text-[#7C2D12] hover:text-rose-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex overflow-x-auto no-scrollbar gap-1.5">
                {COMPATIBILITY_5_QUESTIONS.map((q, idx) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setSelectedQa(q)}
                    className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      selectedQa.id === q.id
                        ? "bg-[#3B0A18] text-amber-100 border-[#3B0A18]"
                        : "bg-white text-[#5C4740] border-amber-200"
                    }`}
                  >
                    Q{idx + 1}: {q.topic}
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold text-[#2B120C]">{selectedQa.question}</p>
              <form onSubmit={handleSendQaCard} className="flex gap-2">
                <Input
                  value={qaAnswer}
                  onChange={(e) => setQaAnswer(e.target.value)}
                  placeholder="Share your honest answer to start a meaningful discussion..."
                  className="h-9 rounded-xl border-amber-300 bg-white text-xs"
                  required
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 px-3.5 rounded-xl bg-saffron-gradient text-white text-xs font-bold shrink-0"
                >
                  Send Q&amp;A
                </Button>
              </form>
            </div>
          )}

          {/* Live DLP Warning Alert */}
          {dlpWarning && (
            <div className="mx-3 sm:mx-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Security Alert: Personal Contact Detected</p>
                <p className="text-[11px] mt-0.5">{dlpWarning}</p>
              </div>
            </div>
          )}

          {/* Quick Icebreakers, Voice Note Recorder & Input */}
          <div className="p-3 sm:p-4 border-t border-amber-100 bg-white space-y-2.5">
            <div className="flex overflow-x-auto no-scrollbar items-center gap-2">
              <button
                type="button"
                onClick={() => setShowQaDeck((prev) => !prev)}
                className={`shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                  showQaDeck
                    ? "bg-[#3B0A18] text-amber-100 border-[#3B0A18]"
                    : "bg-orange-100 text-[#7C2D12] border-amber-300 hover:bg-orange-200"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                5 Questions Q&amp;A
              </button>
              {[
                "Namaste! We would love to connect with your family.",
                "Shall we exchange Kundli and horoscope details?",
                "When is a good time for a brief family video call?",
                "We reviewed your profile and values thoroughly.",
              ].map((quick) => (
                <button
                  key={quick}
                  type="button"
                  onClick={() => {
                    setDraft(quick);
                    setDlpWarning(null);
                  }}
                  className="shrink-0 px-3 py-1 rounded-full bg-amber-50 hover:bg-orange-50 border border-amber-200 text-xs font-medium text-[#5C4740]"
                >
                  {quick}
                </button>
              ))}
            </div>

            {isRecording ? (
              <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-rose-50 border border-rose-300">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                  <span>
                    Recording Voice Note: 00:{String(recordingSeconds).padStart(2, "0")} / 01:00
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={cancelVoiceRecording}
                    className="h-8 text-xs text-rose-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={stopAndSendVoiceNote}
                    className="h-8 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                  >
                    <Square className="w-3 h-3 mr-1 fill-current" />
                    Stop &amp; Send
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={startVoiceRecording}
                  className="h-11 w-11 rounded-xl border-amber-300 text-[#EA580C] hover:bg-amber-50 shrink-0"
                  title="Record Voice Note (up to 60s)"
                >
                  <Mic className="w-4 h-4" />
                </Button>
                <Input
                  value={draft}
                  onChange={handleDraftChange}
                  placeholder="Write a respectful family message..."
                  className={`h-11 rounded-xl border bg-[#FFFDF9] text-base sm:text-sm ${
                    dlpWarning ? "border-rose-400 focus:ring-rose-400" : "border-amber-200"
                  }`}
                />
                <Button
                  type="submit"
                  disabled={Boolean(dlpWarning)}
                  className="h-11 px-5 rounded-xl bg-saffron-gradient text-white font-semibold shrink-0 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Modals for Contact, Block, and Report */}
      <RequestContactModal
        open={showContactModal}
        onOpenChange={setShowContactModal}
        recipientId={activeChat.profileId}
        recipientName={activeChat.candidateName}
        isVipMember={isVipMember}
      />

      <BlockUserModal
        open={showBlockModal}
        onOpenChange={setShowBlockModal}
        targetUserId={activeChat.profileId}
        targetUserName={activeChat.candidateName}
        onBlocked={() => {
          setChats((prev) => prev.filter((c) => c.profileId !== activeChat.profileId));
        }}
      />

      <ReportUserModal
        open={showReportModal}
        onOpenChange={setShowReportModal}
        reportedUserId={activeChat.profileId}
        reportedUserName={activeChat.candidateName}
      />
    </div>
  );
};
