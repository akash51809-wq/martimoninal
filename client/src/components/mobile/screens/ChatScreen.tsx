import React, { useState } from "react";
import { useMobileApp } from "../../../context/MobileAppContext";
import { 
  ChevronLeft, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Sparkles, 
  FileText, 
  ShieldCheck,
  CheckCheck
} from "lucide-react";
import { MOCK_PROFILES } from "../../../data/mockData";

export const ChatScreen: React.FC = () => {
  const { 
    chats, 
    sendMessage, 
    activeChatProfileId, 
    setActiveChatProfileId, 
    setCurrentScreen, 
    setSelectedProfile,
    user 
  } = useMobileApp();

  const [inputMessage, setInputMessage] = useState("");

  const activeChat = chats.find((c) => c.profileId === activeChatProfileId) || chats[0];
  const candidate = MOCK_PROFILES.find((p) => p.id === activeChat?.profileId) || MOCK_PROFILES[0];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;
    sendMessage(candidate.id, inputMessage.trim());
    setInputMessage("");
  };

  const icebreakers = [
    "Namaste! Liked your biodata.",
    "Our Kundli score is high!",
    "Would our families like to connect?",
    "Loved your travel hobbies!"
  ];

  return (
    <div className="relative w-full h-full min-h-[700px] flex flex-col bg-[#FFFDF9] overflow-hidden select-none">
      {/* Top Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 shadow-xs z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentScreen("feed")}
            className="text-gray-700 hover:text-orange-600 p-1"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Profile details */}
          <div 
            onClick={() => {
              setSelectedProfile(candidate);
              setCurrentScreen("profile-detail");
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="relative">
              <img
                src={candidate.photos[0]}
                alt={candidate.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-500"
              />
              {candidate.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 leading-tight flex items-center gap-1">
                <span>{candidate.name}</span>
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
              </h3>
              <p className="text-[10px] text-emerald-600 font-medium">Online • Responds within 1 hr</p>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => alert(`Connecting verified Audio Call to ${candidate.name}...`)}
            className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={() => alert(`Starting 1-on-1 Matrimony Video Session with ${candidate.name}...`)}
            className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-100"
          >
            <Video className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stories / Match Switcher Row */}
      <div className="bg-white/60 px-4 py-2 border-b border-gray-100 flex items-center gap-3 overflow-x-auto no-scrollbar">
        {chats.map((c) => {
          const isActive = c.profileId === activeChat?.profileId;
          return (
            <button
              key={c.profileId}
              onClick={() => setActiveChatProfileId(c.profileId)}
              className={`flex flex-col items-center gap-1 shrink-0 transition-transform ${
                isActive ? "scale-105" : "opacity-75"
              }`}
            >
              <div className={`p-0.5 rounded-full ${isActive ? "ring-2 ring-orange-500 bg-orange-100" : ""}`}>
                <img src={c.avatar} alt={c.candidateName} className="w-10 h-10 rounded-full object-cover" />
              </div>
              <span className="text-[10px] font-semibold text-gray-700 max-w-[48px] truncate">
                {c.candidateName.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 pb-2 no-scrollbar">
        {/* Verified Match Banner */}
        <div className="bg-amber-50/80 border border-amber-200/80 p-3 rounded-2xl text-center space-y-1">
          <p className="text-[11px] font-bold text-amber-900 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Kundli Compatibility: {candidate.kundliScore}/36 Gunas</span>
          </p>
          <p className="text-[10px] text-gray-500">
            Both families have verified mobile numbers and government IDs.
          </p>
        </div>

        {activeChat?.messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                  isUser
                    ? "bg-saffron-gradient text-white rounded-br-xs"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-xs"
                }`}
              >
                {msg.text}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[9px] text-gray-400 px-1">
                <span>{msg.time}</span>
                {isUser && <CheckCheck className="w-3 h-3 text-orange-600" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Smart Icebreaker Buttons */}
      <div className="px-4 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar bg-white/70">
        {icebreakers.map((text, idx) => (
          <button
            key={idx}
            onClick={() => {
              sendMessage(candidate.id, text);
            }}
            className="px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-[10px] font-semibold whitespace-nowrap hover:bg-orange-100 transition-colors"
          >
            {text}
          </button>
        ))}
      </div>

      {/* Message Input Bar */}
      <div className="p-3 bg-white border-t border-gray-100 z-20">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sendMessage(candidate.id, `📄 Shared Official Matrimonial Biodata of ${user.name}`);
            }}
            className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 transition-colors shrink-0"
            title="Share Biodata"
          >
            <FileText className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Message ${candidate.name}...`}
            className="flex-1 px-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="w-9 h-9 rounded-full bg-saffron-gradient text-white flex items-center justify-center shadow-saffron-sm hover:opacity-95 disabled:opacity-40 transition-opacity shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatScreen;
