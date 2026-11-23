import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import { z } from "zod";
import { dbService, normalizeEmail, normalizeMobile } from "./databaseService";
import { isSupabaseConfigured } from "./supabase";
import { storage } from "./localStorage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProfileSchema, insertMessageSchema } from "@shared/schema";
import { profileRouter } from "./routes/profileRoutes";
import { adminRouter } from "./routes/adminRoutes";
import { matchingRouter } from "./routes/matchingRoutes";
import { searchRouter } from "./routes/searchRoutes";
import { communicationRouter } from "./routes/communicationRoutes";
import { securityRouter } from "./routes/securityRoutes";
import { kundliRouter } from "./routes/kundliRoutes";
import { membershipRouter } from "./routes/membershipRoutes";
import { activityRouter } from "./routes/activityRoutes";
import { supportRouter } from "./routes/supportRoutes";
import { settingsRouter } from "./routes/settingsRoutes";
import { gatewayRouter } from "./routes/gatewayRoutes";

// Zod Validation Schemas for API Safety
const duplicateCheckSchema = z.object({
  mobile: z.string().optional(),
  email: z.string().optional(),
});

const registrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  mobile: z.string().min(10, "Valid 10-digit mobile number required"),
  email: z.string().email("Valid email address required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["Male", "Female", "Other"]),
  dob: z.string().min(4, "Date of birth required"),
  profileCreatedBy: z.string().optional(),
  deviceFingerprint: z.string().optional(),
});

const loginSchema = z.object({
  identity: z.string().min(3, "Mobile or email required"),
  password: z.string().min(1, "Password required"),
});

const verifyOtpSchema = z.object({
  userId: z.string().min(1, "User ID required"),
  type: z.enum(["mobile", "email"]),
  otpCode: z.string().min(4, "OTP code required"),
});

const setProfileCreatorSchema = z.object({
  userId: z.string().min(1, "User ID required"),
  profileCreatedBy: z.string().min(1, "Profile created by required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Legacy auth middleware for existing routes
  await setupAuth(app);

  // ============================================================================
  // HEALTH & TELEMETRY
  // ============================================================================
  app.get("/api/v1/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      supabaseConfigured: isSupabaseConfigured(),
      service: "Vivah Kar Lo Production API",
      version: "2.0.0",
    });
  });

  // ============================================================================
  // DIRECT ANDROID APK DOWNLOAD ENDPOINT
  // ============================================================================
  app.get("/downloads/vivahkarlo-release.apk", (_req: Request, res: Response) => {
    const apkFilePath = path.resolve("public/downloads/vivahkarlo-release.apk");
    if (fs.existsSync(apkFilePath)) {
      res.setHeader("Content-Type", "application/vnd.android.package-archive");
      res.setHeader("Content-Disposition", 'attachment; filename="vivahkarlo-release.apk"');
      return res.sendFile(apkFilePath);
    }
    res.status(404).json({ error: "Release APK build is being generated. Please check back shortly." });
  });

  // ============================================================================
  // PROGRAMME 01: REAL-TIME DUPLICATE DETECTION ENDPOINT
  // ============================================================================
  app.post("/api/v1/auth/check-duplicate", async (req: Request, res: Response) => {
    try {
      const parsed = duplicateCheckSchema.parse(req.body);
      const result = await dbService.checkDuplicates(parsed.mobile, parsed.email);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({
        hasDuplicate: false,
        field: null,
        message: err.message || "Invalid input parameters",
      });
    }
  });

  // ============================================================================
  // PROGRAMME 01: ATOMIC REGISTRATION ENDPOINT
  // ============================================================================
  app.post("/api/v1/auth/register", async (req: Request, res: Response) => {
    try {
      const input = registrationSchema.parse(req.body);
      const result = await dbService.registerUser(input);

      if (!result.success) {
        return res.status(409).json({
          success: false,
          error: result.error || "Registration failed.",
        });
      }

      res.status(201).json({
        success: true,
        user: result.user,
        message: "Account successfully created. Please proceed to mobile OTP verification.",
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.errors ? err.errors[0]?.message : err.message || "Validation error",
      });
    }
  });

  // ============================================================================
  // PROGRAMME 01: SECURE AUTHENTICATION & LOGIN
  // ============================================================================
  app.post("/api/v1/auth/login", async (req: Request, res: Response) => {
    try {
      const { identity, password } = loginSchema.parse(req.body);
      const result = await dbService.loginUser(identity, password);

      if (!result.success) {
        return res.status(401).json({
          success: false,
          accountStatus: result.accountStatus,
          error: result.error || "Invalid credentials.",
        });
      }

      res.json({
        success: true,
        token: result.token,
        bundle: result.bundle,
        postDestination: result.postDestination,
        message: "Login successful.",
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.errors ? err.errors[0]?.message : err.message || "Validation error",
      });
    }
  });

  // ============================================================================
  // PROGRAMME 01: OTP VERIFICATION
  // ============================================================================
  app.post("/api/v1/auth/verify-otp", async (req: Request, res: Response) => {
    try {
      const { userId, type, otpCode } = verifyOtpSchema.parse(req.body);
      const result = await dbService.verifyOtp(userId, type, otpCode);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error || "OTP verification failed.",
        });
      }

      res.json({
        success: true,
        bundle: result.bundle,
        message: `${type === "mobile" ? "Mobile" : "Email"} verified successfully.`,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.errors ? err.errors[0]?.message : err.message || "Validation error",
      });
    }
  });

  // ============================================================================
  // PROGRAMME 01: RESEND OTP
  // ============================================================================
  app.post("/api/v1/auth/resend-otp", async (req: Request, res: Response) => {
    try {
      const { userId, type } = req.body;
      if (!userId || !type) {
        return res.status(400).json({ success: false, error: "Missing parameters" });
      }

      // Generate simulated fresh OTP
      const freshOtp = type === "mobile" ? "123456" : "654321";
      res.json({
        success: true,
        type,
        demoOtp: freshOtp,
        expiresInSeconds: 120,
        message: `New OTP has been dispatched to your registered ${type}.`,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ============================================================================
  // PROGRAMME 01: PROFILE CREATED BY
  // ============================================================================
  app.post("/api/v1/auth/set-profile-creator", async (req: Request, res: Response) => {
    try {
      const { userId, profileCreatedBy } = setProfileCreatorSchema.parse(req.body);
      const result = await dbService.setProfileCreatedBy(userId, profileCreatedBy);
      res.json({
        success: true,
        bundle: result.bundle,
        message: "Profile creator successfully recorded.",
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.errors ? err.errors[0]?.message : err.message || "Validation error",
      });
    }
  });

  // ============================================================================
  // PROGRAMME 02: PROFILE WIZARD & DOSSIER ROUTES (Modular Sub-system)
  // ============================================================================
  app.use("/api/v1/profile", profileRouter);
  app.use("/api/v1/profiles", profileRouter);

  // ============================================================================
  // ADMIN PORTAL API: ACCOUNTS, DOSSIERS & RELATIONAL DATABASE (Modular Sub-system)
  // ============================================================================
  app.use("/api/v1/admin", adminRouter);

  // ============================================================================
  // PROGRAMME 03: PARTNER PREFERENCES & SMART MATCHING ENGINE (Modular Sub-system)
  // ============================================================================
  app.use("/api/v1/matches", matchingRouter);

  // ============================================================================
  // PROGRAMME 04: ADVANCED SEARCH & FILTER SYSTEM (Modular Sub-system)
  // ============================================================================
  app.use("/api/v1/search", searchRouter);

  // ============================================================================
  // PROGRAMME 05: COMMUNICATION & EXPRESS INTEREST LIFECYCLE (Modular Sub-system)
  // ============================================================================
  app.use("/api/v1/communication", communicationRouter);

  // ============================================================================
  // PROGRAMME 06 & 07: TRUST, KYC, PRIVACY CONTROLS & PHOTO SHIELD (Modular Sub-system)
  // ============================================================================
  app.use("/api/v1/security", securityRouter);

  // ============================================================================
  // PROGRAMME: IN-HOUSE VEDIC KUNDLI & 36-GUNA ASHTAKOOT MATCHING ENGINE
  // ============================================================================
  app.use("/api/v1/kundli", kundliRouter);

  // ============================================================================
  // PROGRAMME: MEMBERSHIP PLANS & MONETIZATION (MANUAL PAYMENT & FEATURE GATING)
  // ============================================================================
  app.use("/api/v1/membership", membershipRouter);

  // ============================================================================
  // PROGRAMME: USER ACTIVITY, RECENTLY VIEWED, VISITORS & SHORTLISTS
  // ============================================================================
  app.use("/api/v1/activity", activityRouter);

  // ============================================================================
  // PROGRAMME: 24/7 HELP DESK, FAQS, SUPPORT TICKETS & USER FEEDBACK
  // ============================================================================
  app.use("/api/v1/support", supportRouter);

  // ============================================================================
  // PROGRAMME: SECURITY SETTINGS, WHATSAPP ALERTS & ACCOUNT LIFECYCLE
  // ============================================================================
  app.use("/api/v1/settings", settingsRouter);
  app.use("/api/v1/gateway", gatewayRouter);

  // ============================================================================
  // LEGACY ROUTE SUPPORT (For compatibility with existing components)
  // ============================================================================
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id || req.user.claims?.sub;
      const user = await storage.getUser(userId);
      const profile = await storage.getProfile(userId);
      res.json({ ...user, profile });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/profiles", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id || req.user.claims?.sub;
      const profileData = insertProfileSchema.parse({ ...req.body, userId });
      const existingProfile = await storage.getProfile(userId);
      if (existingProfile) {
        const updatedProfile = await storage.updateProfile(userId, profileData);
        res.json(updatedProfile);
      } else {
        const profile = await storage.createProfile(profileData);
        res.json(profile);
      }
    } catch (error: any) {
      res.status(400).json({ message: "Failed to create/update profile", error: error.message });
    }
  });

  app.get("/api/profiles", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id || req.user.claims?.sub;
      const profiles = await storage.getProfiles(userId);
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });

  app.post("/api/likes", isAuthenticated, async (req: any, res) => {
    try {
      const likerId = req.user.id || req.user.claims?.sub;
      const { likedId } = req.body;
      const existingLike = await storage.getLike(likerId, likedId);
      if (existingLike) {
        return res.status(400).json({ message: "Already liked this profile" });
      }
      const like = await storage.createLike({ likerId, likedId });
      const isMutual = await storage.checkMutualLike(likerId, likedId);
      if (isMutual) {
        await storage.createMatch(likerId, likedId);
      }
      res.json({ like, matched: isMutual });
    } catch (error) {
      res.status(400).json({ message: "Failed to create like" });
    }
  });

  app.get("/api/matches", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id || req.user.claims?.sub;
      const matches = await storage.getUserMatches(userId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  app.post("/api/messages", isAuthenticated, async (req: any, res) => {
    try {
      const senderId = req.user.id || req.user.claims?.sub;
      const messageData = insertMessageSchema.parse({ ...req.body, senderId });
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Failed to create message" });
    }
  });

  app.get("/api/messages/:matchId", isAuthenticated, async (req: any, res) => {
    try {
      const { matchId } = req.params;
      const messages = await storage.getMatchMessages(matchId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.get("/api/event-vendors", async (req, res) => {
    try {
      const { category } = req.query;
      const vendors = await storage.getEventVendors(category as string);
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event vendors" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
