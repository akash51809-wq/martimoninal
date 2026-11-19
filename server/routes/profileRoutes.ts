import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { dbService } from "../databaseService";
import { MASTER_PROFILES } from "../data/masterProfiles";
import { extractToken } from "../middleware/authMiddleware";

export const profileRouter = Router();

// Zod schemas for the 6 wizard steps
const step1PhysicalSchema = z.object({
  heightCm: z.number().min(100).max(250),
  heightDisplay: z.string().min(2),
  weightKg: z.number().min(30).max(200),
  bloodGroup: z.string().min(1),
  physicalStatus: z.string().min(1),
  maritalStatus: z.string().min(1),
  bodyType: z.string().optional(),
});

const step2ReligiousSchema = z.object({
  religion: z.string().min(1),
  caste: z.string().min(1),
  subCaste: z.string().optional(),
  gothram: z.string().optional(),
  manglikStatus: z.string().min(1),
  motherTongue: z.string().min(1),
  rashi: z.string().optional(),
  nakshatra: z.string().optional(),
});

const step3EducationCareerSchema = z.object({
  highestDegree: z.string().min(1),
  collegeUniversity: z.string().min(1),
  employedIn: z.string().min(1),
  occupation: z.string().min(1),
  organizationName: z.string().optional(),
  annualIncome: z.string().min(1),
  workCity: z.string().min(1),
  workState: z.string().min(1),
  workCountry: z.string().min(1),
});

const step4LifestyleSchema = z.object({
  diet: z.string().min(1),
  smoking: z.string().min(1),
  drinking: z.string().min(1),
  hobbies: z.array(z.string()).default([]),
});

const step5FamilySchema = z.object({
  fatherOccupation: z.string().min(1),
  motherOccupation: z.string().min(1),
  brothersCount: z.number().min(0).max(10),
  brothersMarried: z.number().min(0).max(10).optional().default(0),
  sistersCount: z.number().min(0).max(10),
  sistersMarried: z.number().min(0).max(10).optional().default(0),
  familyType: z.string().min(1),
  familyValues: z.string().min(1),
  familyStatus: z.string().min(1),
  nativePlace: z.string().min(1),
  aboutFamily: z.string().optional(),
});

const step6PhotosBioSchema = z.object({
  primaryPhotoUrl: z.string().min(1),
  galleryPhotoUrls: z.array(z.string()).default([]),
  photoPrivacy: z.string().min(1),
  bio: z.string().min(10, "Bio should be at least 10 characters"),
});

// ============================================================================
// SERVER-VERIFIED ZERO-TRUST BIODATA PDF & WHATSAPP SHARE PAYLOAD
// Security Guarantees:
// 1. NEVER includes photos/image URLs (Vivah Photo Shield™ compliance).
// 2. Server-side verifies viewer subscription/role — Free users NEVER receive
//    mobile, WhatsApp, email, or personal address (impossible to bypass via client).
// 3. WhatsApp share summary strictly excludes all personal contact PII.
// ============================================================================
profileRouter.get("/:profileId/biodata-safe", (req: Request, res: Response) => {
  try {
    const rawId = String(req.params.profileId || "").replace(/^#/, "").trim();

    const candidate = MASTER_PROFILES.find(
      (p) =>
        p.id === rawId ||
        p.profileId.replace(/^#/, "").toLowerCase() === rawId.toLowerCase()
    );

    if (!candidate) {
      return res.status(404).json({ success: false, error: "Matrimonial profile not found." });
    }

    // Cryptographic Session Authentication to prevent IDOR (CWE-639)
    const token = extractToken(req);
    const session = token ? dbService.validateSession(token) : null;
    const authenticatedUser = session?.user;
    const role = session?.role;

    let isVerifiedVip = false;
    let viewerLabel = "Guest / Free Member";

    if (authenticatedUser) {
      const activeMembership = dbService.getUserMembership?.(authenticatedUser.id);
      const hasPaidPlan = Boolean(
        activeMembership &&
          activeMembership.status === "active" &&
          activeMembership.planId &&
          activeMembership.planId !== "free"
      );
      if (role === "vip" || role === "admin" || hasPaidPlan) {
        isVerifiedVip = true;
        viewerLabel = role === "admin" ? "Verified Admin" : "Verified VIP Member";
      } else {
        viewerLabel = `${authenticatedUser.fullName || "Member"} (Free Plan)`;
      }
    }

    // Strict Zero-Photo & Tier-Enforced Contact Redaction
    const safeBiodata = {
      profileId: candidate.profileId,
      name: candidate.name,
      gender: candidate.gender,
      age: candidate.age,
      dob: candidate.dob,
      height: candidate.height,
      maritalStatus: candidate.maritalStatus,
      religion: candidate.religion,
      caste: candidate.caste,
      subCaste: candidate.subCaste,
      gotra: candidate.gotra,
      motherTongue: candidate.motherTongue,
      rashi: candidate.rashi,
      nakshatra: candidate.nakshatra,
      manglik: candidate.manglik,
      kundliScore: candidate.kundliScore,
      education: candidate.education,
      college: candidate.college,
      profession: candidate.profession,
      company: candidate.company || "Reputed Organization",
      annualIncome: candidate.income,
      city: candidate.city,
      state: candidate.state,
      country: candidate.country,
      verified: candidate.verified,
      lifestyle: candidate.lifestyle,
      bio: candidate.bio,
      // STRICT SECURITY ENFORCEMENT
      photoIncluded: false,
      photoProtectionNotice:
        "Profile photographs are strictly excluded from PDF downloads under Vivah Photo Shield™ anti-misuse protection.",
      contactRedacted: !isVerifiedVip,
      contactDetails: isVerifiedVip
        ? {
            mobile: candidate.mobile,
            email: candidate.email,
            cityResidence: `${candidate.city}, ${candidate.state}, ${candidate.country}`,
            accessNote: "Unlocked via Verified VIP Membership — Strictly confidential for family alliance discussion.",
          }
        : null,
      redactionNotice: !isVerifiedVip
        ? "Personal contact details (Mobile, WhatsApp, Email & Address) are omitted from PDF for Free Plan users. Upgrade to VIP & request mutual permission to access verified contact details."
        : null,
      auditStamp: {
        viewerId: viewerUserId || "anonymous",
        viewerTier: viewerLabel,
        generatedAt: new Date().toISOString(),
      },
    };

    // PII-Safe WhatsApp Share Summary (NEVER contains phone, email, or street address)
    const whatsappShareText = [
      `*Vivah Kar Lo — Verified Matrimonial Alliance*`,
      ``,
      `*Profile ID:* ${candidate.profileId}`,
      `*Name:* ${candidate.name} (${candidate.age} Yrs, ${candidate.height})`,
      `*Community:* ${candidate.religion} • ${candidate.caste} • ${candidate.motherTongue}`,
      `*Education:* ${candidate.education} (${candidate.college})`,
      `*Career:* ${candidate.profession} • ${candidate.income}`,
      `*Location:* ${candidate.city}, ${candidate.state}, ${candidate.country}`,
      `*Horoscope:* ${candidate.rashi} • ${candidate.nakshatra} • ${candidate.manglik} (${candidate.kundliScore}/36 Gunas)`,
      `*Verification:* ${candidate.verified ? "Govt ID Verified ✓" : "Registered Member"}`,
      ``,
      `_Note: Photos & personal contact details are privacy-protected. View full verified profile securely on Vivah Kar Lo._`,
    ].join("\n");

    res.json({
      success: true,
      isVerifiedVip,
      biodata: safeBiodata,
      whatsappShareText,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Failed to generate safe biodata" });
  }
});

// GET active user profile
profileRouter.get("/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;
  const profile = dbService.getProfile(userId);
  if (!profile) {
    return res.status(404).json({ success: false, error: "Profile not found" });
  }
  res.json({ success: true, profile });
});

// SAVE STEP (Steps 1 to 6)
profileRouter.post("/:userId/step/:stepNumber", async (req: Request, res: Response) => {
  try {
    const { userId, stepNumber } = req.params;
    const stepNum = parseInt(stepNumber, 10);

    let parsedData = req.body;

    // Validate step based on step number
    if (stepNum === 1) parsedData = step1PhysicalSchema.parse(req.body);
    else if (stepNum === 2) parsedData = step2ReligiousSchema.parse(req.body);
    else if (stepNum === 3) parsedData = step3EducationCareerSchema.parse(req.body);
    else if (stepNum === 4) parsedData = step4LifestyleSchema.parse(req.body);
    else if (stepNum === 5) parsedData = step5FamilySchema.parse(req.body);
    else if (stepNum === 6) parsedData = step6PhotosBioSchema.parse(req.body);

    const { profile, completion } = await dbService.saveProfileStep(userId, stepNum, parsedData);

    res.json({
      success: true,
      stepNumber: stepNum,
      completion,
      profile,
      message: `Step ${stepNum} saved successfully. Completion is now ${completion}%.`,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Step validation failed",
    });
  }
});

// FINALIZE PROFILE (100% Complete)
profileRouter.post("/:userId/finalize", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { profile, completion } = await dbService.finalizeProfile(userId);
    res.json({
      success: true,
      profile,
      completion,
      message: "Congratulations! Your matrimonial profile is now 100% complete and active for matching.",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
