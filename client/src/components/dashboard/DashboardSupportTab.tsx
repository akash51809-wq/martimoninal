import React, { useState, useEffect } from "react";
import type { AccountBundle } from "@/types/authTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  LifeBuoy,
  Phone,
  Mail,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Star,
  ShieldCheck,
  PlusCircle,
  Headphones,
} from "lucide-react";
import {
  OFFICIAL_PLATFORM_FAQS,
  type FAQCategory,
  type SupportTicket,
  type UserFeedback,
} from "@shared/userActivityTypes";

export const DashboardSupportTab: React.FC<{
  account: AccountBundle;
}> = ({ account }) => {
  const { toast } = useToast();

  const [activeSubTab, setActiveSubTab] = useState<"faqs" | "tickets" | "feedback">("faqs");

  // FAQs Search & Accordion State
  const [faqSearchQuery, setFaqSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<string | null>("0-0");

  // Support Tickets State (Feature 40)
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: "tkt-1001",
      userId: account.user.id,
      userName: account.user.fullName,
      userEmail: account.user.email,
      userPhone: account.user.mobile,
      category: "profile_verification",
      subject: "Inquiry about Govt ID Green Shield status",
      message: "I uploaded my Aadhaar card 2 hours ago. Could you please confirm if the verification is underway?",
      priority: "medium",
      status: "resolved",
      adminReply: "Hello! Your identity proof has been validated and the official Green Shield badge is now active on your matrimonial profile.",
      resolvedAt: "Today, 12:30 PM",
      resolvedBy: "Admin Compliance Officer",
      createdAt: "Today, 10:15 AM",
      updatedAt: "Today, 12:30 PM",
    },
  ]);
  const [ticketCategory, setTicketCategory] = useState<
    "billing" | "matchmaking" | "profile_verification" | "privacy" | "technical" | "general"
  >("general");
  const [ticketPriority, setTicketPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);

  // User Feedback State (Feature 41)
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackCategory, setFeedbackCategory] = useState<
    "general_feedback" | "bug_report" | "profile_quality" | "feature_request" | "complaint"
  >("general_feedback");
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackDesc, setFeedbackDesc] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  // Fetch user's own tickets on mount
  useEffect(() => {
    fetch(`/api/v1/support/tickets/my?userId=${encodeURIComponent(account.user.id)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.tickets) && data.tickets.length > 0) {
          setTickets(data.tickets);
        }
      })
      .catch(() => {});
  }, [account.user.id]);

  // Handle Ticket Submission
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast({ title: "Incomplete Form", description: "Please enter both subject and detailed message.", variant: "destructive" });
      return;
    }

    setTicketSubmitting(true);
    try {
      const res = await fetch("/api/v1/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: account.user.id,
          userName: account.user.fullName,
          userEmail: account.user.email,
          userPhone: account.user.mobile,
          category: ticketCategory,
          priority: ticketPriority,
          subject: ticketSubject,
          message: ticketMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit ticket");
      }

      toast({
        title: "Support Ticket Raised",
        description: `Ticket #${data.ticket.id} created. Our compliance team will inspect and respond shortly.`,
      });

      setTickets((prev) => [data.ticket, ...prev]);
      setTicketSubject("");
      setTicketMessage("");
      setShowCreateTicketModal(false);
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setTicketSubmitting(false);
    }
  };

  // Handle Feedback Submission
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackTitle.trim() || !feedbackDesc.trim()) {
      toast({ title: "Incomplete Form", description: "Please enter title and description for your feedback.", variant: "destructive" });
      return;
    }

    setFeedbackSubmitting(true);
    try {
      const res = await fetch("/api/v1/support/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: account.user.id,
          userName: account.user.fullName,
          userEmail: account.user.email,
          rating: feedbackRating,
          category: feedbackCategory,
          title: feedbackTitle,
          description: feedbackDesc,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      toast({
        title: "Feedback Recorded ✓",
        description: "Thank you for sharing your experience. Our quality assurance team reviews all user reviews.",
      });

      setFeedbackTitle("");
      setFeedbackDesc("");
      setFeedbackRating(5);
    } catch (err: any) {
      toast({
        title: "Feedback Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // Filtered FAQs
  const filteredFaqs = OFFICIAL_PLATFORM_FAQS.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(faqSearchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
            Help Desk, FAQs &amp; Support
          </h1>
          <p className="text-sm text-[#5C4740]">
            Get 24/7 dedicated assistance, explore common queries, track tickets, and share feedback
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            setActiveSubTab("tickets");
            setShowCreateTicketModal(true);
          }}
          className="h-10 px-4 rounded-xl bg-saffron-gradient text-white text-xs font-bold shadow-saffron-sm hover:opacity-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Create Support Ticket
        </Button>
      </div>

      {/* 24/7 Helpline & Concierge Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#EA580C] flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#8C6D62] uppercase tracking-wider">Toll-Free Helpline</span>
            <p className="font-bold text-sm text-[#2B120C]">1800-848-2452</p>
            <p className="text-[11px] text-[#5C4740]">Mon - Sun, 9 AM - 9 PM IST</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#8C6D62] uppercase tracking-wider">WhatsApp Support</span>
            <p className="font-bold text-sm text-[#2B120C]">+91 98765 43210</p>
            <p className="text-[11px] text-emerald-700 font-semibold">Instant automated assistance</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#8C6D62] uppercase tracking-wider">Email Grievance Desk</span>
            <p className="font-bold text-sm text-[#2B120C]">support@vivahkarlo.com</p>
            <p className="text-[11px] text-[#5C4740]">Guaranteed reply in 2 hours</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#8C6D62] uppercase tracking-wider">VIP Assisted RM</span>
            <p className="font-bold text-sm text-[#2B120C]">Priority Hotline</p>
            <p className="text-[11px] text-[#5C4740]">For Diamond &amp; Assisted Members</p>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Switcher */}
      <div className="flex bg-amber-50/80 p-1 rounded-2xl border border-amber-200 max-w-md">
        <button
          type="button"
          onClick={() => setActiveSubTab("faqs")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === "faqs"
              ? "bg-[#3B0A18] text-amber-100 shadow-sm"
              : "text-[#5C4740] hover:text-[#2B120C]"
          }`}
        >
          Knowledgebase &amp; FAQs
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("tickets")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === "tickets"
              ? "bg-[#3B0A18] text-amber-100 shadow-sm"
              : "text-[#5C4740] hover:text-[#2B120C]"
          }`}
        >
          My Tickets ({tickets.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("feedback")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === "feedback"
              ? "bg-[#3B0A18] text-amber-100 shadow-sm"
              : "text-[#5C4740] hover:text-[#2B120C]"
          }`}
        >
          Feedback &amp; Complaints
        </button>
      </div>

      {/* SUBTAB 1: Knowledgebase & FAQs (Feature 40) */}
      {activeSubTab === "faqs" && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-amber-200/80 p-5 shadow-sm space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8C6D62]" />
              <Input
                type="text"
                placeholder="Search FAQs (e.g., Aadhaar safety, Kundli matching, contact unmasking, UTR verification)..."
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl border-amber-200 text-xs text-[#2B120C]"
              />
            </div>

            <div className="space-y-6 pt-2">
              {filteredFaqs.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-3">
                  <h3 className="font-serif-royal text-base font-bold text-[#7C2D12] border-b border-amber-100 pb-1.5 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
                    {cat.category}
                  </h3>

                  <div className="space-y-2">
                    {cat.items.map((item, itemIdx) => {
                      const key = `${catIdx}-${itemIdx}`;
                      const isOpen = openFaqIndex === key;
                      return (
                        <div
                          key={itemIdx}
                          className="rounded-2xl border border-amber-100 bg-amber-50/40 overflow-hidden transition-all"
                        >
                          <button
                            type="button"
                            onClick={() => setOpenFaqIndex(isOpen ? null : key)}
                            className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs font-bold text-[#2B120C] hover:bg-amber-100/50"
                          >
                            <span className="flex items-center gap-2">
                              <HelpCircle className="w-4 h-4 text-[#EA580C] shrink-0" />
                              {item.question}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-[#8C6D62] shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#8C6D62] shrink-0" />
                            )}
                          </button>

                          {isOpen && (
                            <div className="p-3.5 pt-0 text-xs text-[#5C4740] leading-relaxed border-t border-amber-100/60 bg-white/70">
                              {item.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: My Support Tickets (Feature 40) */}
      {activeSubTab === "tickets" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
              Your Support &amp; Grievance History
            </h3>
            <Button
              size="sm"
              onClick={() => setShowCreateTicketModal(true)}
              className="rounded-xl bg-saffron-gradient text-white text-xs font-bold h-9 px-3.5 shadow-saffron-sm"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              New Ticket
            </Button>
          </div>

          {tickets.length === 0 ? (
            <div className="bg-white rounded-3xl border border-amber-200/80 p-10 text-center space-y-2">
              <LifeBuoy className="w-10 h-10 text-amber-400 mx-auto" />
              <p className="font-serif-royal text-lg font-bold text-[#2B120C]">No Support Tickets</p>
              <p className="text-xs text-[#5C4740]">
                If you encounter any issues regarding KYC documents, matchmaking, or membership, raise a ticket.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((tkt) => (
                <div
                  key={tkt.id}
                  className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#2B120C]">
                        #{tkt.id}
                      </span>
                      <span className="text-xs font-bold text-[#EA580C] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md uppercase">
                        {tkt.category.replace("_", " ")}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          tkt.priority === "urgent"
                            ? "bg-rose-100 text-rose-800"
                            : tkt.priority === "high"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {tkt.priority} priority
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          tkt.status === "resolved" || tkt.status === "closed"
                            ? "bg-emerald-100 text-emerald-800"
                            : tkt.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {tkt.status.replace("_", " ")}
                      </span>
                      <span className="text-[11px] text-[#8C6D62] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tkt.createdAt}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif-royal text-base font-bold text-[#2B120C]">
                      {tkt.subject}
                    </h4>
                    <p className="text-xs text-[#5C4740] mt-1 whitespace-pre-wrap">
                      {tkt.message}
                    </p>
                  </div>

                  {/* Admin Reply Section */}
                  {tkt.adminReply && (
                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
                      <div className="flex items-center justify-between text-emerald-900 font-bold">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Compliance Desk Reply ({tkt.resolvedBy || "Support Admin"}):
                        </span>
                        {tkt.resolvedAt && (
                          <span className="text-[10px] font-normal text-emerald-700">
                            {tkt.resolvedAt}
                          </span>
                        )}
                      </div>
                      <p className="text-[#2B120C] leading-relaxed pt-0.5">
                        {tkt.adminReply}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: Feedback & Complaints (Feature 41) */}
      {activeSubTab === "feedback" && (
        <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-4 max-w-2xl">
          <div>
            <h3 className="font-serif-royal text-xl font-bold text-[#2B120C]">
              Feedback &amp; Grievances Redressal
            </h3>
            <p className="text-xs text-[#5C4740]">
              Rate your matchmaking experience or report a bug. Our leadership inspects every report.
            </p>
          </div>

          <form onSubmit={handleFeedbackSubmit} className="space-y-4 pt-1">
            {/* 5-Star Rating Selector */}
            <div>
              <Label className="text-xs font-semibold text-[#2B120C]">Rate Platform Experience</Label>
              <div className="flex items-center gap-2 mt-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= feedbackRating ? "fill-amber-400 text-amber-400" : "text-amber-200"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-[#7C2D12] ml-2">
                  {feedbackRating === 5
                    ? "⭐⭐⭐⭐⭐ Outstanding"
                    : feedbackRating === 4
                    ? "⭐⭐⭐⭐ Great Experience"
                    : feedbackRating === 3
                    ? "⭐⭐⭐ Satisfactory"
                    : feedbackRating === 2
                    ? "⭐⭐ Needs Improvement"
                    : "⭐ Unsatisfactory"}
                </span>
              </div>
            </div>

            {/* Category */}
            <div>
              <Label className="text-xs font-semibold text-[#2B120C]">Category</Label>
              <select
                value={feedbackCategory}
                onChange={(e) => setFeedbackCategory(e.target.value as any)}
                className="w-full h-10 mt-1 rounded-xl border border-amber-200 bg-white px-3 text-xs text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="general_feedback">General Experience &amp; Praise</option>
                <option value="profile_quality">Match Quality &amp; Community</option>
                <option value="feature_request">Feature Request / Suggestion</option>
                <option value="bug_report">Technical Bug / Malfunction</option>
                <option value="complaint">Grievance / Formal Complaint</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <Label className="text-xs font-semibold text-[#2B120C]">Feedback Title</Label>
              <Input
                type="text"
                placeholder="Brief summary of your review or issue"
                value={feedbackTitle}
                onChange={(e) => setFeedbackTitle(e.target.value)}
                className="h-10 mt-1 rounded-xl border-amber-200 text-xs"
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-xs font-semibold text-[#2B120C]">Detailed Description</Label>
              <Textarea
                rows={4}
                placeholder="Share your detailed feedback, suggestion, or complaint..."
                value={feedbackDesc}
                onChange={(e) => setFeedbackDesc(e.target.value)}
                className="mt-1 rounded-xl border-amber-200 text-xs"
              />
            </div>

            <Button
              type="submit"
              disabled={feedbackSubmitting}
              className="w-full h-11 rounded-xl bg-saffron-gradient text-white font-bold text-xs shadow-saffron-sm"
            >
              <Send className="w-4 h-4 mr-1.5" />
              {feedbackSubmitting ? "Submitting Review..." : "Submit Platform Feedback"}
            </Button>
          </form>
        </div>
      )}

      {/* Create Support Ticket Modal */}
      {showCreateTicketModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div>
                <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
                  Raise Support / Helpdesk Ticket
                </h3>
                <p className="text-xs text-[#5C4740]">
                  Our 24/7 matrimonial compliance desk will attend to your request
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateTicketModal(false)}
                className="text-[#8C6D62] hover:text-[#2B120C] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-[#2B120C]">Category</Label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="w-full h-9 mt-1 rounded-xl border border-amber-200 text-xs bg-white px-2.5"
                  >
                    <option value="profile_verification">Govt ID / KYC Verification</option>
                    <option value="billing">VIP Plans &amp; UTR Payment</option>
                    <option value="privacy">Photo Shield &amp; Masking</option>
                    <option value="matchmaking">Kundli &amp; Matches Help</option>
                    <option value="technical">Technical / Login Issue</option>
                    <option value="general">General Support</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-[#2B120C]">Priority Level</Label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as any)}
                    className="w-full h-9 mt-1 rounded-xl border border-amber-200 text-xs bg-white px-2.5"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Escalation</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-[#2B120C]">Subject</Label>
                <Input
                  type="text"
                  placeholder="e.g. Assistance verifying salary slip for career badge"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="h-9 mt-1 rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-[#2B120C]">Detailed Message</Label>
                <Textarea
                  rows={4}
                  placeholder="Explain your inquiry or issue with relevant dates or transaction references..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="mt-1 rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateTicketModal(false)}
                  className="flex-1 h-10 rounded-xl border-slate-300 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={ticketSubmitting}
                  className="flex-1 h-10 rounded-xl bg-saffron-gradient text-white font-bold text-xs shadow-saffron-sm"
                >
                  {ticketSubmitting ? "Submitting..." : "Submit Ticket"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
