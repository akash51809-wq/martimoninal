import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { dbService } from "../databaseService";
import { OFFICIAL_PLATFORM_FAQS } from "../../shared/userActivityTypes";
import { requireAdminAuth } from "../middleware/authMiddleware";

export const supportRouter = Router();

const createTicketSchema = z.object({
  userId: z.string().min(1, "User ID required"),
  userName: z.string().min(1, "Name required"),
  userEmail: z.string().email("Valid email required"),
  userPhone: z.string().min(10, "Valid phone number required"),
  category: z.enum([
    "billing",
    "matchmaking",
    "profile_verification",
    "privacy",
    "technical",
    "general",
  ]),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(120),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
});

const replyTicketSchema = z.object({
  adminReply: z.string().min(3, "Reply must be at least 3 characters"),
  status: z.enum(["in_progress", "resolved", "closed"]),
  resolvedBy: z.string().optional(),
});

const submitFeedbackSchema = z.object({
  userId: z.string().min(1, "User ID required"),
  userName: z.string().min(1, "Name required"),
  userEmail: z.string().email("Valid email required"),
  rating: z.number().int().min(1).max(5),
  category: z.enum([
    "general_feedback",
    "bug_report",
    "profile_quality",
    "feature_request",
    "complaint",
  ]),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
});

const updateFeedbackSchema = z.object({
  status: z.enum(["reviewed", "addressed"]),
  adminNotes: z.string().optional(),
});

/**
 * 1. Get Platform FAQs (Feature 40)
 */
supportRouter.get("/faqs", (_req: Request, res: Response) => {
  res.json({
    success: true,
    faqs: OFFICIAL_PLATFORM_FAQS,
  });
});

/**
 * 2. Create Support Ticket (Feature 40)
 */
supportRouter.post("/tickets", async (req: Request, res: Response) => {
  try {
    const data = createTicketSchema.parse(req.body);
    const ticket = await dbService.createSupportTicket(data);
    res.status(201).json({
      success: true,
      ticket,
      message: `Support ticket #${ticket.id} created successfully. Our team will review shortly.`,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Failed to create support ticket",
    });
  }
});

/**
 * 3. Get User's Own Support Tickets (Feature 40)
 */
supportRouter.get("/tickets/my", (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ success: false, error: "User ID required" });
  }

  const tickets = dbService.getUserSupportTickets(userId);
  res.json({ success: true, tickets });
});

/**
 * 4. Admin: Get All Support Tickets (Queue)
 */
supportRouter.get("/tickets/all", requireAdminAuth, (req: Request, res: Response) => {
  const status = req.query.status as string | undefined;
  const tickets = dbService.getAllSupportTickets(status);
  res.json({ success: true, tickets, total: tickets.length });
});

/**
 * 5. Admin: Reply to Support Ticket & Update Status
 */
supportRouter.patch("/tickets/:id/reply", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminReply, status, resolvedBy } = replyTicketSchema.parse(req.body);
    const updated = await dbService.replyToSupportTicket(id, adminReply, status, resolvedBy);

    if (!updated) {
      return res.status(404).json({ success: false, error: "Support ticket not found" });
    }

    res.json({
      success: true,
      ticket: updated,
      message: `Ticket #${id} status updated to ${status}.`,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Failed to update ticket",
    });
  }
});

/**
 * 6. Submit User Feedback & Complaints (Feature 41)
 */
supportRouter.post("/feedback", async (req: Request, res: Response) => {
  try {
    const data = submitFeedbackSchema.parse(req.body);
    const feedback = await dbService.submitUserFeedback(data);
    res.status(201).json({
      success: true,
      feedback,
      message: "Thank you for your valuable feedback. It helps us improve our matrimonial platform.",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Failed to submit feedback",
    });
  }
});

/**
 * 7. Admin: Get All Feedback & Complaints
 */
supportRouter.get("/feedback/all", (req: Request, res: Response) => {
  const status = req.query.status as string | undefined;
  const feedbackList = dbService.getAllUserFeedback(status);
  res.json({ success: true, feedback: feedbackList, total: feedbackList.length });
});

/**
 * 8. Admin: Update Feedback Status
 */
supportRouter.patch("/feedback/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = updateFeedbackSchema.parse(req.body);
    const updated = await dbService.updateFeedbackStatus(id, status, adminNotes);

    if (!updated) {
      return res.status(404).json({ success: false, error: "Feedback item not found" });
    }

    res.json({
      success: true,
      feedback: updated,
      message: `Feedback status updated to ${status}.`,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Failed to update feedback",
    });
  }
});
