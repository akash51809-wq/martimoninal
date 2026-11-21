import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { dbService } from "../databaseService";
import { analyzeMessageForDlp } from "../utils/dataLeakPrevention";
import { extractToken } from "../middleware/authMiddleware";
import { dailyRateLimiterService } from "../services/dailyRateLimiterService";

export const communicationRouter = Router();

// Validation Schemas
const sendInterestSchema = z.object({
  senderId: z.string().min(1),
  senderName: z.string().min(1),
  senderProfileId: z.string().optional(),
  senderPhoto: z.string().optional(),
  receiverId: z.string().min(1),
  receiverName: z.string().min(1),
  receiverProfileId: z.string().optional(),
  receiverPhoto: z.string().optional(),
  message: z.string().max(300).optional(),
});

const respondInterestSchema = z.object({
  interestId: z.string().min(1),
  action: z.enum(["accepted", "declined", "cancelled"]),
  userId: z.string().min(1),
});

const sendChatMessageSchema = z.object({
  threadId: z.string().min(1),
  senderId: z.string().min(1),
  senderName: z.string().min(1),
  receiverId: z.string().min(1),
  text: z.string().min(1).max(1000),
});

const contactRequestSchema = z.object({
  requesterId: z.string().min(1),
  requesterName: z.string().min(1),
  requesterProfileId: z.string().optional(),
  requesterPhoto: z.string().optional(),
  requesterRole: z.enum(["free", "gold", "vip", "admin"]),
  targetUserId: z.string().min(1),
});

const respondContactRequestSchema = z.object({
  requestId: z.string().min(1),
  action: z.enum(["approved", "rejected"]),
  targetUserId: z.string().min(1),
});

const photoRequestSchema = z.object({
  requesterId: z.string().min(1),
  requesterName: z.string().min(1),
  requesterProfileId: z.string().optional(),
  requesterPhoto: z.string().optional(),
  targetUserId: z.string().min(1),
});

const respondPhotoRequestSchema = z.object({
  requestId: z.string().min(1),
  action: z.enum(["approved", "rejected"]),
  targetUserId: z.string().min(1),
});

// ============================================================================
// 1. EXPRESS INTEREST ENDPOINTS
// ============================================================================
communicationRouter.post("/interest/send", async (req: Request, res: Response) => {
  try {
    const data = sendInterestSchema.parse(req.body);

    // Verify session identity to prevent user impersonation (CWE-285)
    const token = extractToken(req);
    if (token) {
      const session = dbService.validateSession(token);
      if (session && session.user.id !== data.senderId && session.role !== "admin") {
        return res.status(403).json({
          success: false,
          error: "Unauthorized. You cannot express interest on behalf of another member.",
        });
      }
    }

    // Anti-Bot & Anti-Spam Daily Rate Limiting (Feature: 15 interests/day for free users)
    const senderAccount = dbService.getAccount(data.senderId);
    const isVip = senderAccount?.role?.role === "vip" || senderAccount?.role?.role === "admin" || (senderAccount?.membership?.status === "active" && senderAccount?.membership?.tier !== "free");
    const quotaCheck = dailyRateLimiterService.checkAndConsumeInterest(data.senderId, isVip);
    if (!quotaCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: quotaCheck.error,
        remaining: quotaCheck.remaining,
        limit: quotaCheck.limit,
      });
    }

    const result = await dbService.sendInterest(data);
    res.status(201).json({
      success: true,
      interest: result,
      remainingDailyInterests: quotaCheck.remaining,
      message: `Interest successfully sent to ${data.receiverName}. (${quotaCheck.remaining} daily interests remaining today)`,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Failed to send interest",
    });
  }
});

communicationRouter.post("/interest/respond", async (req: Request, res: Response) => {
  try {
    const { interestId, action, userId } = respondInterestSchema.parse(req.body);

    // Verify session identity to prevent responding on behalf of another user
    const token = extractToken(req);
    if (token) {
      const session = dbService.validateSession(token);
      if (session && session.user.id !== userId && session.role !== "admin") {
        return res.status(403).json({
          success: false,
          error: "Unauthorized. You cannot respond to interests for another member.",
        });
      }
    }

    const updated = await dbService.respondInterest(interestId, action, userId);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Interest request not found" });
    }
    res.json({
      success: true,
      interest: updated,
      message:
        action === "accepted"
          ? "Interest accepted! Mutual conversation is now unlocked."
          : action === "declined"
          ? "Interest politely declined."
          : "Interest withdrawn.",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.message || "Failed to respond to interest",
    });
  }
});

communicationRouter.get("/interest/list/:userId", (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const list = dbService.getInterests(userId);
    res.json({ success: true, ...list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

communicationRouter.get("/daily-quota/:userId", (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const account = dbService.getAccount(userId);
    const isVip = account?.role?.role === "vip" || account?.role?.role === "admin" || (account?.membership?.status === "active" && account?.membership?.tier !== "free");
    const quota = dailyRateLimiterService.getQuotaStatus(userId, isVip);
    res.json({ success: true, isVip, quota });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 2. SECURE 1-ON-1 CHAT WITH RIGOROUS DLP INTERCEPTOR
// ============================================================================
communicationRouter.get("/chat/threads/:userId", (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const threads = dbService.getChatThreads(userId);
    res.json({ success: true, threads });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

communicationRouter.get("/chat/messages/:threadId", (req: Request, res: Response) => {
  try {
    const { threadId } = req.params;
    const messages = dbService.getChatMessages(threadId);
    res.json({ success: true, messages });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

communicationRouter.post("/chat/send", async (req: Request, res: Response) => {
  try {
    const data = sendChatMessageSchema.parse(req.body);

    // Verify session identity to prevent chat message spoofing (CWE-285)
    const token = extractToken(req);
    if (token) {
      const session = dbService.validateSession(token);
      if (session && session.user.id !== data.senderId && session.role !== "admin") {
        return res.status(403).json({
          success: false,
          error: "Unauthorized. You cannot send messages from another user's identity.",
        });
      }
    }

    // Anti-Bot & Anti-Spam Message Rate Limiting
    const senderAccount = dbService.getAccount(data.senderId);
    const isVip = senderAccount?.role?.role === "vip" || senderAccount?.role?.role === "admin" || (senderAccount?.membership?.status === "active" && senderAccount?.membership?.tier !== "free");
    const quotaCheck = dailyRateLimiterService.checkAndConsumeMessage(data.senderId, isVip);
    if (!quotaCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: quotaCheck.error,
        remaining: quotaCheck.remaining,
        limit: quotaCheck.limit,
      });
    }

    // Run Server-side Data Leak Prevention (DLP)
    const dlpResult = analyzeMessageForDlp(data.text);

    if (dlpResult.isBlocked) {
      // Save blocked telemetry record
      await dbService.saveChatMessage({
        ...data,
        blocked: true,
        blockReason: dlpResult.reason,
      });

      return res.status(403).json({
        success: false,
        blocked: true,
        error: dlpResult.reason,
        matchedPattern: dlpResult.matchedPattern,
        message: "Message blocked by safety firewall: Contact details cannot be shared via chat.",
      });
    }

    const saved = await dbService.saveChatMessage({
      ...data,
      blocked: false,
    });

    res.status(201).json({
      success: true,
      message: saved,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Failed to deliver message",
    });
  }
});

communicationRouter.post("/chat/mark-read", async (req: Request, res: Response) => {
  try {
    const threadId = req.body.threadId || req.body.channelId;
    const receiverId = req.body.receiverId || req.body.readerUserId;
    if (!threadId || !receiverId) {
      return res.status(400).json({ success: false, error: "Missing threadId/channelId or receiverId/readerUserId" });
    }
    const updatedCount = await dbService.markChatMessagesAsRead(threadId, receiverId);
    res.json({
      success: true,
      updatedCount,
      message: `${updatedCount} message(s) marked as read.`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const translateChatSchema = z.object({
  text: z.string().min(1).max(1000),
  targetLang: z.enum(["en", "hi", "mr", "gu", "bn", "ta", "te", "pa", "kn"]),
});

const LANG_LABELS: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
  gu: "Gujarati",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  pa: "Punjabi",
  kn: "Kannada",
};

communicationRouter.post("/chat/translate", async (req: Request, res: Response) => {
  try {
    const { text, targetLang } = translateChatSchema.parse(req.body);
    const cleanText = text.trim();

    // Attempt live HTTPS translation with strict 3.5s timeout
    let translatedText = "";
    let engine: "live_translate" | "local_fallback" = "live_translate";

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(
        targetLang
      )}&dt=t&q=${encodeURIComponent(cleanText)}`;

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (response.ok) {
        const data: any = await response.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          translatedText = data[0]
            .map((segment: any) => (Array.isArray(segment) ? segment[0] : ""))
            .join("")
            .trim();
        }
      }
    } catch {
      // Safe offline fallback
    }

    if (!translatedText) {
      engine = "local_fallback";
      translatedText = `[${LANG_LABELS[targetLang] || targetLang.toUpperCase()} Translation] ${cleanText}`;
    }

    res.json({
      success: true,
      originalText: cleanText,
      translatedText,
      targetLang,
      targetLanguageName: LANG_LABELS[targetLang] || targetLang,
      engine,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Translation failed",
    });
  }
});

// ============================================================================
// 3. CONTACT ACCESS PERMISSION & SUBSCRIPTION VERIFICATION
// ============================================================================
communicationRouter.get("/contact/list/:userId", (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const requests = dbService.getContactRequests(userId);
    res.json({ success: true, ...requests });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

communicationRouter.post("/contact/request", async (req: Request, res: Response) => {
  try {
    const data = contactRequestSchema.parse(req.body);

    // SUBSCRIPTION CHECK: Non-paying members cannot request contact details
    if (data.requesterRole === "free") {
      return res.status(402).json({
        success: false,
        subscriptionRequired: true,
        error: "Subscription Required: Please upgrade to VIP Membership to request direct family contact details and WhatsApp.",
      });
    }

    const created = await dbService.requestContactDetails(data);
    res.status(201).json({
      success: true,
      request: created,
      message: "Contact request dispatched. You will be able to view contact details once the family approves.",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message,
    });
  }
});

communicationRouter.post("/contact/respond", async (req: Request, res: Response) => {
  try {
    const { requestId, action, targetUserId } = respondContactRequestSchema.parse(req.body);
    const updated = await dbService.respondContactRequest(requestId, action, targetUserId);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Contact request not found" });
    }
    res.json({
      success: true,
      request: updated,
      message: action === "approved" ? "Contact access granted to the family." : "Contact access request declined.",
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 4. PHOTO ACCESS PERMISSIONS
// ============================================================================
communicationRouter.get("/photo/list/:userId", (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const requests = dbService.getPhotoRequests(userId);
    res.json({ success: true, ...requests });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

communicationRouter.post("/photo/request", async (req: Request, res: Response) => {
  try {
    const data = photoRequestSchema.parse(req.body);
    const created = await dbService.requestPhotoAccess(data);
    res.status(201).json({
      success: true,
      request: created,
      message: "Photo access request sent to the profile owner.",
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

communicationRouter.post("/photo/respond", async (req: Request, res: Response) => {
  try {
    const { requestId, action, targetUserId } = respondPhotoRequestSchema.parse(req.body);
    const updated = await dbService.respondPhotoRequest(requestId, action, targetUserId);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Photo access request not found" });
    }
    res.json({
      success: true,
      request: updated,
      message: action === "approved" ? "Photo view granted." : "Photo view declined.",
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});
