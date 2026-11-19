import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { dbService } from "../databaseService";
import {
  OFFICIAL_MEMBERSHIP_PLANS,
  OFFICIAL_BANK_DETAILS,
} from "../../shared/membershipTypes";
import { requireAdminAuth } from "../middleware/authMiddleware";

export const membershipRouter = Router();

const planSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Plan name must be at least 2 characters"),
  badge: z.string().optional(),
  durationMonths: z.number().min(1).max(120),
  durationLabel: z.string().min(1, "Duration label is required"),
  price: z.number().min(0, "Price cannot be negative"),
  originalPrice: z.number().min(0).optional(),
  discountLabel: z.string().optional(),
  contactsQuota: z.number().min(0, "Contacts quota cannot be negative"),
  features: z.array(z.string().min(1)).min(1, "At least one feature is required"),
  recommended: z.boolean().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

const purchaseRequestSchema = z.object({
  userId: z.string().min(1, "User ID required"),
  userName: z.string().min(1, "User Name required"),
  userEmail: z.string().email("Valid email required"),
  userMobile: z.string().min(10, "Valid mobile required"),
  profileId: z.string().optional(),
  planId: z.string().min(1, "Plan ID required"),
  planName: z.string().min(1),
  durationLabel: z.string().min(1),
  amount: z.number().positive(),
  amountDisplay: z.string().min(1),
  paymentMethod: z.string().min(1),
  utrNumber: z.string().min(6, "Valid 6 to 16 character UTR / Reference number required"),
  paymentDate: z.string().min(1),
  screenshotUrl: z.string().optional(),
  notes: z.string().max(500).optional(),
});

const reviewRequestSchema = z.object({
  action: z.enum(["approved", "rejected"]),
  reviewedBy: z.string().min(1),
  rejectionReason: z.string().optional(),
});

const assignMembershipSchema = z.object({
  userId: z.string().min(1),
  tier: z.string().min(1, "Tier required"),
  durationMonths: z.number().min(1).max(120),
  assignedBy: z.string().min(1),
});

/**
 * 1. Get Membership Plans & Bank/UPI Details
 * Returns all active plans for users, or all plans if ?all=true
 */
membershipRouter.get("/plans", (req: Request, res: Response) => {
  const includeAll = req.query.all === "true" || req.query.includeInactive === "true";
  const plans = dbService.getMembershipPlans(includeAll);
  res.json({
    success: true,
    plans,
    bankDetails: OFFICIAL_BANK_DETAILS,
  });
});

/**
 * 1a. Admin: Create New Membership Plan
 */
membershipRouter.post("/plans", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const data = planSchema.parse(req.body);
    const created = await dbService.createMembershipPlan(data);
    res.status(201).json({
      success: true,
      plan: created,
      message: `Plan "${created.name}" created successfully.`,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Failed to create plan",
    });
  }
});

/**
 * 1b. Admin: Update Existing Membership Plan
 */
membershipRouter.put("/plans/:id", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = planSchema.partial().parse(req.body);
    const updated = await dbService.updateMembershipPlan(id, data);
    res.json({
      success: true,
      plan: updated,
      message: `Plan "${updated.name}" updated successfully.`,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Failed to update plan",
    });
  }
});

/**
 * 1c. Admin: Delete Membership Plan
 */
membershipRouter.delete("/plans/:id", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await dbService.deleteMembershipPlan(id);
    if (!success) {
      return res.status(404).json({ success: false, error: `Plan "${id}" not found.` });
    }
    res.json({
      success: true,
      message: `Plan "${id}" deleted successfully.`,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to delete plan",
    });
  }
});

/**
 * 1d. Admin: Toggle Plan Active/Inactive Status
 */
membershipRouter.patch("/plans/:id/toggle", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await dbService.toggleMembershipPlanStatus(id);
    res.json({
      success: true,
      plan: updated,
      message: `Plan "${updated.name}" is now ${updated.isActive ? "Active" : "Inactive"}.`,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.message || "Failed to toggle plan status",
    });
  }
});

/**
 * 2. Get User's Active Membership Status
 */
membershipRouter.get("/status/:userId", (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const membership = dbService.getUserMembership(userId);
    res.json({ success: true, membership });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 3. Submit Manual Plan Purchase Request (with UPI UTR / Bank Details)
 */
membershipRouter.post("/purchase-request", async (req: Request, res: Response) => {
  try {
    const data = purchaseRequestSchema.parse(req.body);
    const newRequest = await dbService.createMembershipRequest(data);

    res.status(201).json({
      success: true,
      request: newRequest,
      message:
        "Payment verification request submitted successfully. Admin will review the UTR and activate your VIP plan within 1-2 hours.",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Invalid payment details submitted",
    });
  }
});

/**
 * 4. Admin: Get Membership Purchase Requests
 */
membershipRouter.get("/requests", requireAdminAuth, (req: Request, res: Response) => {
  try {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const requests = dbService.getMembershipRequests(status);
    res.json({ success: true, requests });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 5. Admin: Review (Approve / Reject) Purchase Request
 */
membershipRouter.post("/requests/:requestId/review", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { action, reviewedBy, rejectionReason } = reviewRequestSchema.parse(req.body);

    const result = await dbService.reviewMembershipRequest(
      requestId,
      action,
      reviewedBy,
      rejectionReason
    );

    if (!result.success) {
      return res.status(404).json({ success: false, error: "Membership request not found" });
    }

    res.json({
      success: true,
      request: result.request,
      membership: result.membership,
      message:
        action === "approved"
          ? "Membership plan successfully activated with contact credits."
          : "Membership request rejected.",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Failed to review request",
    });
  }
});

/**
 * 6. Admin: Manually Assign or Extend Membership
 */
membershipRouter.post("/admin/assign", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { userId, tier, durationMonths, assignedBy } = assignMembershipSchema.parse(req.body);
    const updated = await dbService.assignUserMembership(userId, tier, durationMonths, assignedBy);

    res.json({
      success: true,
      membership: updated,
      message: `Successfully assigned ${tier.toUpperCase()} membership for ${durationMonths} months.`,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Failed to assign membership",
    });
  }
});

/**
 * 8. User: Get Subscription & Invoice History
 */
membershipRouter.get("/history", (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ success: false, error: "User ID required" });
  }

  const invoices = dbService.getUserSubscriptionHistory(userId);
  res.json({
    success: true,
    invoices,
  });
});

membershipRouter.post("/consume-contact", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: "User ID required" });
    }

    const result = await dbService.consumeContactCredit(userId);
    if (!result.success) {
      return res.status(403).json(result);
    }

    res.json({ success: true, remaining: result.remaining });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
