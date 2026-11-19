import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { dbService } from "../databaseService";
import { isSupabaseConfigured } from "../supabase";
import { requireAdminAuth } from "../middleware/authMiddleware";

export const adminRouter = Router();

// ============================================================================
// ADMIN AUTHENTICATION (Server-Verified Login & Bearer Token Generation)
// ============================================================================
adminRouter.post("/login", (req: Request, res: Response) => {
  try {
    const { email, password, pin } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    const result = dbService.adminLogin(email, password, pin);
    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json({
      success: true,
      token: result.token,
      user: result.user,
      message: "Admin authentication successful.",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Protect all subsequent administrative routes against CWE-306
adminRouter.use(requireAdminAuth);

// GET full executive dashboard metrics (Total, Active, Male/Female, Today, New, Verified, Pending, Premium, Expired)
adminRouter.get("/dashboard/metrics", (_req: Request, res: Response) => {
  try {
    const data = dbService.getAdminDashboardMetrics();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET platform activity stream with category filter
adminRouter.get("/activity", (req: Request, res: Response) => {
  try {
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const activities = dbService.getAdminActivityStream(category);
    res.json({ success: true, activities, count: activities.length });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET registration graph time-series analytics (7d, 30d, 6m, 12m)
adminRouter.get("/analytics/registrations", (req: Request, res: Response) => {
  try {
    const period = (req.query.period as "7d" | "30d" | "6m" | "12m") || "6m";
    const data = dbService.getAdminRegistrationGraph(period);
    res.json({ success: true, ...data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all accounts with detailed profile summaries
adminRouter.get("/accounts", (_req: Request, res: Response) => {
  const accounts = dbService.getAllAccounts();
  res.json({ success: true, accounts, count: accounts.length });
});

// GET single user full matrimonial dossier
adminRouter.get("/users/:id/dossier", (req: Request, res: Response) => {
  const { id } = req.params;
  const dossier = dbService.getUserDossier(id);
  if (!dossier) {
    return res.status(404).json({ success: false, error: "User dossier not found" });
  }
  res.json({ success: true, dossier });
});

// CREATE new user account (Admin Add User)
adminRouter.post("/users", async (req: Request, res: Response) => {
  try {
    const ok = await dbService.createUserByAdmin(req.body);
    res.json({ success: true, created: ok, message: "User account provisioned successfully." });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// RESET user password by admin (Properly hashes input password instead of hardcoded default)
adminRouter.post("/users/:id/reset-password", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const plainPassword =
      password && String(password).trim().length >= 6
        ? String(password).trim()
        : `Vivah@${crypto.randomInt(100000, 999999)}`;
    const newHash = await bcrypt.hash(plainPassword, 10);
    const ok = await dbService.resetUserPassword(id, newHash);
    res.json({
      success: true,
      reset: ok,
      temporaryPassword: plainPassword,
      message: "User password reset successfully.",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE user account (Permanent purge)
adminRouter.delete("/accounts/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ok = await dbService.deleteUser(id, true);
    res.json({ success: true, deleted: ok, message: "User purged permanently." });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE full user account & matrimonial profile details (Admin Edit)
adminRouter.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user, profileMeta } = req.body || {};
    const ok = await dbService.updateUserByAdmin(id, { user, profileMeta });
    res.json({
      success: true,
      updated: ok,
      message: "User account and profile details updated successfully.",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE account status (Active, Suspended, Deleted)
adminRouter.patch("/accounts/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const ok = await dbService.updateUserStatus(id, status, reason);
    if (!ok) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.json({ success: true, message: `Account status updated to ${status}.` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// UPGRADE user role (Free, VIP, Admin)
adminRouter.patch("/accounts/:id/role", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const ok = await dbService.updateUserRole(id, role);
    if (!ok) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.json({ success: true, message: `User role upgraded to ${role}.` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DATABASE TABLES INSPECTOR (All 8 Relational Tables)
adminRouter.get("/database/tables", (_req: Request, res: Response) => {
  const tables = dbService.getDatabaseTablesSnapshot();
  res.json({
    success: true,
    supabaseConnected: isSupabaseConfigured(),
    tables,
  });
});

// DATABASE RESET
adminRouter.post("/database/reset", (_req: Request, res: Response) => {
  dbService.resetDemoDatabase();
  res.json({ success: true, message: "Database reset to verified initial seed state." });
});
