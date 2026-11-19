import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { dbService, type PartnerPreferencesRow } from "../databaseService";
import { MASTER_PROFILES, type MasterProfileRecord } from "../data/masterProfiles";
import {
  PERSONALITY_QUIZ_QUESTIONS,
  determineArchetype,
  calculateMultidimensionalScore,
  calculatePersonalityCompatibility,
  evaluateTwoWayMutualMatch,
  calculateMatchSuccessProbability,
  computeSmartMatchRank,
  type PersonalityTraits,
  type SmartRankingWeights,
  DEFAULT_RANKING_WEIGHTS,
} from "../../shared/advancedMatchingEngine";

export const matchingRouter = Router();

// Zod Validation Schema for Partner Preferences
const partnerPreferencesSchema = z.object({
  ageMin: z.number().min(18).max(75),
  ageMax: z.number().min(18).max(80),
  heightMinCm: z.number().min(120).max(220),
  heightMaxCm: z.number().min(120).max(220),
  maritalStatus: z.array(z.string()).default(["Never Married"]),
  religions: z.array(z.string()).default(["Hindu"]),
  castes: z.array(z.string()).default([]),
  motherTongues: z.array(z.string()).default([]),
  educationLevels: z.array(z.string()).default([]),
  employedIn: z.array(z.string()).default([]),
  occupations: z.array(z.string()).default([]),
  minAnnualIncomeLpa: z.number().min(0).max(500).default(0),
  preferredCities: z.array(z.string()).default([]),
  preferredStates: z.array(z.string()).default([]),
  preferredCountries: z.array(z.string()).default(["India"]),
  diet: z.array(z.string()).default([]),
  smoking: z.string().default("No"),
  drinking: z.string().default("No"),
  manglik: z.string().default("Non-Manglik"),
  familyTypes: z.array(z.string()).optional(),
  familyValues: z.array(z.string()).optional(),
  willingToRelocate: z.string().optional(),
  marriageExpectations: z.record(z.any()).optional(),
  dealbreakers: z.record(z.boolean()).optional(),
  flexiblePreferences: z.record(z.boolean()).optional(),
  priorities: z.record(z.string()).optional(),
}).passthrough();

// Zod Schema for Personality Traits
const personalityTraitsSchema = z.object({
  socialEnergy: z.number().min(1).max(5),
  lifeOutlook: z.number().min(1).max(5),
  ambition: z.number().min(1).max(5),
  finances: z.number().min(1).max(5),
  familyBoundaries: z.number().min(1).max(5),
});

// Zod Schema for Admin Ranking Weights
const rankingWeightsSchema = z.object({
  horoscopeWeight: z.number().min(0).max(100),
  partnerPreferencesWeight: z.number().min(0).max(100),
  lifestyleWeight: z.number().min(0).max(100),
  educationCareerWeight: z.number().min(0).max(100),
  familyWeight: z.number().min(0).max(100),
  personalityWeight: z.number().min(0).max(100),
});

/**
 * Deterministically constructs personality traits for a candidate profile based on their credentials and lifestyle.
 */
function getCandidatePersonalityTraits(candidate: MasterProfileRecord): PersonalityTraits {
  const charCodeSum = (candidate.name + candidate.profession + candidate.city)
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);

  let socialEnergy = 3;
  const pTag = (candidate.professionTag || candidate.profession).toLowerCase();
  if (pTag.includes("doctor") || pTag.includes("civil") || pTag.includes("ias")) {
    socialEnergy = 3;
  } else if (pTag.includes("business") || pTag.includes("marketing") || pTag.includes("designer")) {
    socialEnergy = 4;
  } else if (pTag.includes("software") || pTag.includes("engineer") || pTag.includes("ca")) {
    socialEnergy = 2;
  } else {
    socialEnergy = 2 + (charCodeSum % 3);
  }

  let ambition = candidate.isPremierInstitute || candidate.annualIncomeLpa >= 25 ? 5 : candidate.annualIncomeLpa >= 14 ? 4 : 3;
  let lifeOutlook = candidate.lifestyle?.diet === "Jain" ? 2 : candidate.isNri ? 5 : 3;
  let finances = candidate.annualIncomeLpa >= 30 ? 3 : 2;
  let familyBoundaries = candidate.state === "Maharashtra" || candidate.state === "Gujarat" ? 2 : 3;

  return {
    socialEnergy: Math.max(1, Math.min(5, socialEnergy)),
    lifeOutlook: Math.max(1, Math.min(5, lifeOutlook)),
    ambition: Math.max(1, Math.min(5, ambition)),
    finances: Math.max(1, Math.min(5, finances)),
    familyBoundaries: Math.max(1, Math.min(5, familyBoundaries)),
  };
}

/**
 * Helper to build viewer profile data for compatibility comparisons.
 */
function getViewerProfileData(userId: string) {
  const p = dbService.getProfile(userId);
  return {
    age: p?.dob ? Math.floor((Date.now() - new Date(p.dob).getTime()) / (365.25 * 24 * 3600 * 1000)) : 28,
    heightCm: p?.heightCm || 178,
    education: p?.education || p?.highestDegree || "B.Tech - Computer Science",
    caste: p?.caste || "Maratha",
    religion: p?.religion || "Hindu",
    city: p?.city || p?.workCity || "Pune",
    state: p?.state || p?.workState || "Maharashtra",
    annualIncomeLpa: p?.annualIncome ? parseInt(p.annualIncome.replace(/\D/g, ""), 10) || 24 : 24,
    maritalStatus: p?.maritalStatus || "Never Married",
    diet: p?.diet || "Vegetarian",
    drink: p?.drinking || "Never",
    smoke: p?.smoking || "Never",
    familyType: p?.familyType || "Nuclear",
    familyValues: p?.familyValues || "Moderate",
    familyStatus: p?.familyStatus || "Upper Middle Class",
    isPremierInstitute: true,
    isGovtJob: false,
  };
}

/**
 * Calculates a weighted compatibility score between partner preferences and a candidate profile.
 */
function calculateCompatibility(
  prefs: PartnerPreferencesRow,
  profile: MasterProfileRecord
): { score: number; reasons: string[]; isMutual: boolean } {
  let score = 0;
  const reasons: string[] = [];

  // 1. Age Compatibility (Up to 20 Points)
  if (profile.age >= prefs.ageMin && profile.age <= prefs.ageMax) {
    score += 20;
    reasons.push(`Age ${profile.age} matches preferred range (${prefs.ageMin}-${prefs.ageMax} yrs)`);
  } else if (Math.abs(profile.age - prefs.ageMin) <= 2 || Math.abs(profile.age - prefs.ageMax) <= 2) {
    score += 10;
  }

  // 2. Height Compatibility (Up to 10 Points)
  if (profile.heightCm >= prefs.heightMinCm && profile.heightCm <= prefs.heightMaxCm) {
    score += 10;
    reasons.push(`Height ${profile.height} matches preferences`);
  } else if (Math.abs(profile.heightCm - prefs.heightMinCm) <= 5 || Math.abs(profile.heightCm - prefs.heightMaxCm) <= 5) {
    score += 5;
  }

  // 3. Religion & Caste Compatibility (Up to 20 Points)
  const religionMatch = prefs.religions.length === 0 || prefs.religions.includes(profile.religion);
  const casteMatch =
    prefs.castes.length === 0 ||
    prefs.castes.some((c) => profile.caste.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes("all"));

  if (religionMatch && casteMatch) {
    score += 20;
    reasons.push(`${profile.religion} - ${profile.caste} Community match`);
  } else if (religionMatch) {
    score += 12;
    reasons.push(`${profile.religion} Religion match`);
  }

  // 4. Education & Profession (Up to 20 Points)
  const educationMatch =
    prefs.educationLevels.length === 0 ||
    prefs.educationLevels.some(
      (edu) =>
        profile.education.toLowerCase().includes(edu.toLowerCase()) ||
        profile.profession.toLowerCase().includes(edu.toLowerCase())
    );

  const occupationMatch =
    prefs.occupations.length === 0 ||
    prefs.occupations.some(
      (occ) =>
        profile.profession.toLowerCase().includes(occ.toLowerCase()) ||
        profile.professionTag.toLowerCase().includes(occ.toLowerCase())
    );

  if (educationMatch && occupationMatch) {
    score += 20;
    reasons.push(`Education & Career: ${profile.professionTag} (${profile.education})`);
  } else if (educationMatch || occupationMatch || profile.isPremierInstitute) {
    score += 14;
    reasons.push(`Strong academic credentials (${profile.college})`);
  }

  // 5. Income Criteria (Up to 15 Points)
  if (profile.annualIncomeLpa >= prefs.minAnnualIncomeLpa) {
    score += 15;
    reasons.push(`Annual income ${profile.income} meets minimum criteria (₹${prefs.minAnnualIncomeLpa}L+)`);
  } else if (profile.annualIncomeLpa >= prefs.minAnnualIncomeLpa * 0.75) {
    score += 8;
  }

  // 6. Location / Preferred Cities (Up to 15 Points)
  const cityMatch =
    prefs.preferredCities.length === 0 ||
    prefs.preferredCities.some(
      (c) =>
        profile.city.toLowerCase().includes(c.toLowerCase()) ||
        c.toLowerCase().includes(profile.city.toLowerCase())
    );

  if (cityMatch) {
    score += 15;
    reasons.push(`Location preference met: ${profile.city}, ${profile.state}`);
  } else if (prefs.preferredStates.includes(profile.state)) {
    score += 8;
    reasons.push(`State preference met: ${profile.state}`);
  }

  // Bonus: Kundli Score harmony (> 28 gunas is highly auspicious)
  if (profile.kundliScore >= 28) {
    score = Math.min(100, score + 5);
    reasons.push(`Auspicious Kundli Milan: ${profile.kundliScore}/36 Gunas`);
  }

  const isMutual = score >= 75 && (profile.kundliScore >= 28 || profile.verified);
  const finalScore = Math.min(100, Math.max(45, score));
  return { score: finalScore, reasons, isMutual };
}

// ============================================================================
// 1. GET & UPDATE PARTNER PREFERENCES
// ============================================================================
matchingRouter.get("/preferences/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    const preferences = dbService.getPartnerPreferences(userId);
    res.json({
      success: true,
      preferences,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to retrieve partner preferences",
    });
  }
});

matchingRouter.put("/preferences/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    const parsed = partnerPreferencesSchema.parse(req.body);
    const updated = await dbService.savePartnerPreferences(userId, parsed);

    res.json({
      success: true,
      preferences: updated,
      message: "Partner preferences saved successfully. Matching recommendations updated.",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Validation error",
    });
  }
});

// ============================================================================
// 2. PERSONALITY QUIZ & PROFILES (Feature 4: Personality-Based Matching)
// ============================================================================
matchingRouter.get("/personality/quiz", (_req: Request, res: Response) => {
  res.json({
    success: true,
    questions: PERSONALITY_QUIZ_QUESTIONS,
  });
});

matchingRouter.get("/personality/:userId", (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const profile = dbService.getPersonalityProfile(userId);
    res.json({
      success: true,
      profile,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to load personality profile",
    });
  }
});

matchingRouter.post("/personality/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const traits = personalityTraitsSchema.parse(req.body.traits || req.body);
    const updatedProfile = await dbService.savePersonalityProfile(userId, traits);

    res.json({
      success: true,
      profile: updatedProfile,
      message: "Personality profile updated successfully with your core values.",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Invalid personality traits input",
    });
  }
});

// ============================================================================
// 3. FULL COMPATIBILITY DEEP-DIVE (Features 2, 4, 6, 8)
// ============================================================================
matchingRouter.get("/compatibility-detail/:viewerId/:candidateId", (req: Request, res: Response) => {
  try {
    const { viewerId, candidateId } = req.params;
    const candidate = MASTER_PROFILES.find(
      (p) => p.id === candidateId || p.profileId.toLowerCase() === candidateId.toLowerCase()
    );

    if (!candidate) {
      return res.status(404).json({ success: false, error: "Candidate profile not found." });
    }

    const viewerData = getViewerProfileData(viewerId);
    const viewerPrefs = dbService.getPartnerPreferences(viewerId);
    const viewerPersonality = dbService.getPersonalityProfile(viewerId);

    const candidateTraits = getCandidatePersonalityTraits(candidate);
    const candidateArchetype = determineArchetype(candidateTraits);

    // 1. Multidimensional Compatibility (Feature 2)
    const multidimensionalScore = calculateMultidimensionalScore(viewerData, {
      diet: candidate.lifestyle?.diet,
      drink: candidate.lifestyle?.drink,
      smoke: candidate.lifestyle?.smoke,
      familyType: "Nuclear",
      familyValues: "Moderate",
      familyStatus: "Upper Middle Class",
      education: candidate.education,
      profession: candidate.profession,
      annualIncomeLpa: candidate.annualIncomeLpa,
      isPremierInstitute: candidate.isPremierInstitute,
      isGovtJob: candidate.isGovtJob,
      caste: candidate.caste,
      religion: candidate.religion,
    });

    // 2. Personality-Based Alignment (Feature 4)
    const personalityCompatibility = calculatePersonalityCompatibility(
      viewerPersonality.traits,
      candidateTraits
    );

    // 3. Bidirectional (2-Way) Mutual Preference Evaluation (Feature 6)
    const twoWayMutualMatch = evaluateTwoWayMutualMatch(
      viewerData,
      viewerPrefs,
      {
        age: candidate.age,
        heightCm: candidate.heightCm,
        education: candidate.education,
        caste: candidate.caste,
        city: candidate.city,
        annualIncomeLpa: candidate.annualIncomeLpa,
        maritalStatus: candidate.maritalStatus,
      },
      candidate.partnerPreferences
    );

    // 4. Match Success Probability (Feature 8)
    const matchSuccessReport = calculateMatchSuccessProbability({
      kundliGunaScore: candidate.kundliScore || 28,
      multidimensionalScore,
      personalityScore: personalityCompatibility.compatibilityScore,
      mutualMatchResult: twoWayMutualMatch,
    });

    // 5. Smart Ranking Composite (Feature 5)
    const weights = dbService.getSmartRankingWeights();
    const astroScore = Math.min(100, Math.round((candidate.kundliScore / 36) * 100));
    const smartRank = computeSmartMatchRank(
      {
        horoscopeScore: astroScore,
        partnerPreferencesScore: twoWayMutualMatch.candidateSatisfiesUserPct,
        lifestyleScore: multidimensionalScore.lifestyle.score,
        educationCareerScore: multidimensionalScore.educationCareer.score,
        familyScore: multidimensionalScore.family.score,
        personalityScore: personalityCompatibility.compatibilityScore,
      },
      weights
    );

    res.json({
      success: true,
      candidate: {
        id: candidate.id,
        profileId: candidate.profileId,
        name: candidate.name,
        age: candidate.age,
        height: candidate.height,
        profession: candidate.profession,
        education: candidate.education,
        city: candidate.city,
        state: candidate.state,
        caste: candidate.caste,
        income: candidate.income,
        kundliScore: candidate.kundliScore,
        verified: candidate.verified,
        photos: candidate.photos,
        personality: {
          archetype: candidateArchetype.archetype,
          archetypeBadge: candidateArchetype.archetypeBadge,
          archetypeDescription: candidateArchetype.archetypeDescription,
          topValues: candidateArchetype.topValues,
          traits: candidateTraits,
        },
      },
      multidimensionalScore,
      personalityCompatibility,
      twoWayMutualMatch,
      matchSuccessReport,
      smartRank,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to calculate deep-dive compatibility",
    });
  }
});

// ============================================================================
// 4. ADMIN SMART RANKING WEIGHTS CONFIGURATION (Feature 5: Smart Ranking)
// ============================================================================
matchingRouter.get("/admin/ranking-weights", (_req: Request, res: Response) => {
  try {
    const weights = dbService.getSmartRankingWeights();
    res.json({
      success: true,
      weights,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to load ranking weights",
    });
  }
});

matchingRouter.put("/admin/ranking-weights", async (req: Request, res: Response) => {
  try {
    const parsed = rankingWeightsSchema.parse(req.body);
    const sum =
      parsed.horoscopeWeight +
      parsed.partnerPreferencesWeight +
      parsed.lifestyleWeight +
      parsed.educationCareerWeight +
      parsed.familyWeight +
      parsed.personalityWeight;

    if (sum !== 100) {
      return res.status(400).json({
        success: false,
        error: `Total weights must sum to exactly 100%. Current sum: ${sum}%.`,
      });
    }

    const updated = await dbService.updateSmartRankingWeights(parsed);
    res.json({
      success: true,
      weights: updated,
      message: "Algorithm ranking weights updated successfully across all recommendations.",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Invalid ranking weights",
    });
  }
});

// ============================================================================
// 5. ENRICHED RECOMMENDATIONS FEEDS (Daily, Mutual, New, Verified + Smart Sorts)
// ============================================================================
matchingRouter.get("/recommendations", async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || "usr-active-complete";
    const category = (req.query.category as string) || "daily";
    const sortBy = (req.query.sortBy as string) || "smart_rank";
    const hideDealbreakers = req.query.hideDealbreakers === "true";

    const prefs: any = dbService.getPartnerPreferences(userId);
    const viewerData = getViewerProfileData(userId);
    const viewerPersonality = dbService.getPersonalityProfile(userId);
    const rankingWeights = dbService.getSmartRankingWeights();

    // Compute all advanced multi-factor scores for master profiles
    const scoredProfiles = MASTER_PROFILES.map((p) => {
      const { score, reasons, isMutual } = calculateCompatibility(prefs, p);
      const candidateTraits = getCandidatePersonalityTraits(p);
      const candidateArchetype = determineArchetype(candidateTraits);

      const multiScore = calculateMultidimensionalScore(viewerData, {
        diet: p.lifestyle?.diet,
        drink: p.lifestyle?.drink,
        smoke: p.lifestyle?.smoke,
        familyType: "Nuclear",
        familyValues: "Moderate",
        familyStatus: "Upper Middle Class",
        education: p.education,
        profession: p.profession,
        annualIncomeLpa: p.annualIncomeLpa,
        isPremierInstitute: p.isPremierInstitute,
        isGovtJob: p.isGovtJob,
        caste: p.caste,
        religion: p.religion,
      });

      const personalityComp = calculatePersonalityCompatibility(
        viewerPersonality.traits,
        candidateTraits
      );

      const twoWayMutual = evaluateTwoWayMutualMatch(
        viewerData,
        prefs,
        {
          age: p.age,
          heightCm: p.heightCm,
          education: p.education,
          caste: p.caste,
          city: p.city,
          annualIncomeLpa: p.annualIncomeLpa,
          maritalStatus: p.maritalStatus,
        },
        p.partnerPreferences
      );

      const successReport = calculateMatchSuccessProbability({
        kundliGunaScore: p.kundliScore || 28,
        multidimensionalScore: multiScore,
        personalityScore: personalityComp.compatibilityScore,
        mutualMatchResult: twoWayMutual,
      });

      const astroPct = Math.min(100, Math.round((p.kundliScore / 36) * 100));
      const smartRank = computeSmartMatchRank(
        {
          horoscopeScore: astroPct,
          partnerPreferencesScore: twoWayMutual.candidateSatisfiesUserPct,
          lifestyleScore: multiScore.lifestyle.score,
          educationCareerScore: multiScore.educationCareer.score,
          familyScore: multiScore.family.score,
          personalityScore: personalityComp.compatibilityScore,
        },
        rankingWeights
      );

      // Dealbreaker Evaluation (Section C.8 & E.17)
      const dbRules = prefs.dealbreakers || {
        strictAgeRange: true,
        strictMaritalStatus: true,
        nonSmokerOnly: true,
        nonDrinkerOnly: false,
        strictLocation: false,
        strictDiet: false,
        strictManglik: false,
      };
      const dealbreakerWarnings: string[] = [];
      if (dbRules.strictAgeRange && (p.age < prefs.ageMin || p.age > prefs.ageMax)) {
        dealbreakerWarnings.push(`Age ${p.age} outside strict range (${prefs.ageMin}-${prefs.ageMax})`);
      }
      if (dbRules.nonSmokerOnly && p.lifestyle?.smoke?.toLowerCase() === "yes") {
        dealbreakerWarnings.push("Smoking preference mismatch");
      }
      if (dbRules.nonDrinkerOnly && p.lifestyle?.drink?.toLowerCase() === "yes") {
        dealbreakerWarnings.push("Drinking preference mismatch");
      }
      if (
        dbRules.strictManglik &&
        prefs.manglik &&
        prefs.manglik !== "Doesn't Matter" &&
        p.manglik.toLowerCase() !== prefs.manglik.toLowerCase()
      ) {
        dealbreakerWarnings.push(`Manglik status (${p.manglik}) differs from strict requirement`);
      }
      const dealbreakerPassed = dealbreakerWarnings.length === 0;

      // Specialized AI Dimensions: Interest, Values, Marriage Goals, Relevance, Match Explanation
      const hobbyCount = (p.lifestyle?.hobbies || []).length;
      const interestScore = Math.min(98, 72 + hobbyCount * 6);
      const valuesScore = Math.min(
        99,
        Math.round((multiScore.family.score * 0.6 + personalityComp.compatibilityScore * 0.4))
      );
      const marriageGoalScore = Math.min(
        98,
        Math.round(successReport.successProbability * 0.7 + valuesScore * 0.3)
      );
      const profileRelevanceScore = Math.min(
        99,
        Math.round(smartRank * 0.5 + score * 0.3 + (p.verified ? 12 : 6) + (p.online ? 8 : 3))
      );

      const matchExplanation: string[] = [
        `AI Compatibility ${smartRank}% • Predicted Stability: ${successReport.successProbability}% (${successReport.stabilityGrade})`,
        `Vedic Horoscope Harmony: ${p.kundliScore}/36 Gunas (${p.manglik})`,
        `Shared Values & Marriage Vision: ${valuesScore}% Family-Values & ${marriageGoalScore}% Marriage Goal alignment`,
        p.city.toLowerCase() === viewerData.city.toLowerCase() || p.state.toLowerCase() === viewerData.state.toLowerCase()
          ? `Regional Proximity Advantage: Located in ${p.city}, ${p.state}`
          : `Strong Education & Career Match: ${p.professionTag} (${p.education})`,
      ];

      return {
        ...p,
        matchScore: score,
        matchReasons: reasons,
        isMutualMatch: twoWayMutual.isMutualMatch || isMutual,
        isNewMember: p.registeredDaysAgo <= 7,
        isVerifiedGovtId: p.verified,

        // Enriched Advanced Features Data
        smartRankScore: smartRank,
        successProbability: successReport.successProbability,
        successStabilityGrade: successReport.stabilityGrade,
        multidimensionalScore: multiScore,
        personalityBadge: candidateArchetype.archetypeBadge,
        personalityScore: personalityComp.compatibilityScore,
        candidateArchetype: candidateArchetype.archetype,
        twoWayMutualScore: twoWayMutual.mutualScore,
        candidateSatisfiesUserPct: twoWayMutual.candidateSatisfiesUserPct,
        userSatisfiesCandidatePct: twoWayMutual.userSatisfiesCandidatePct,

        // Section E: Dealbreaker, Marriage Goal, Interest, Values, Relevance & Match Explanation
        dealbreakerPassed,
        dealbreakerWarnings,
        marriageGoalScore,
        interestScore,
        valuesScore,
        profileRelevanceScore,
        matchExplanation,
      };
    });

    let filtered = hideDealbreakers
      ? scoredProfiles.filter((p) => p.dealbreakerPassed)
      : [...scoredProfiles];

    // Category Filter (All 14 Smart Matching Lenses)
    switch (category) {
      case "daily":
        filtered = filtered
          .sort((a, b) => b.smartRankScore - a.smartRankScore)
          .slice(0, 10);
        break;

      case "best":
        filtered = filtered.filter((p) => p.smartRankScore >= 82 || p.matchScore >= 82);
        break;

      case "mutual":
        filtered = filtered.filter(
          (p) => p.isMutualMatch || p.twoWayMutualScore >= 75 || p.matchScore >= 80
        );
        break;

      case "new":
        filtered = filtered.filter((p) => p.registeredDaysAgo <= 14);
        break;

      case "recently_active":
        filtered = filtered.filter((p) => p.online || p.registeredDaysAgo <= 7);
        break;

      case "nearby":
        filtered = filtered.filter(
          (p) =>
            p.city.toLowerCase() === viewerData.city.toLowerCase() ||
            p.state.toLowerCase() === viewerData.state.toLowerCase()
        );
        break;

      case "same_community":
        filtered = filtered.filter(
          (p) =>
            p.religion.toLowerCase() === viewerData.religion.toLowerCase() &&
            (p.caste.toLowerCase().includes(viewerData.caste.toLowerCase()) ||
              p.state.toLowerCase() === viewerData.state.toLowerCase())
        );
        break;

      case "similar_education":
        filtered = filtered.filter(
          (p) =>
            p.isPremierInstitute ||
            p.multidimensionalScore.educationCareer.score >= 82
        );
        break;

      case "similar_career":
        filtered = filtered.filter(
          (p) =>
            p.annualIncomeLpa >= Math.max(12, prefs.minAnnualIncomeLpa) ||
            p.isGovtJob ||
            p.multidimensionalScore.educationCareer.score >= 80
        );
        break;

      case "family_compat":
        filtered = filtered.filter((p) => p.multidimensionalScore.family.score >= 80);
        break;

      case "horoscope":
        filtered = filtered.filter((p) => p.kundliScore >= 26);
        break;

      case "lifestyle":
        filtered = filtered.filter(
          (p) => p.multidimensionalScore.lifestyle.score >= 80 || p.interestScore >= 84
        );
        break;

      case "values_goals":
        filtered = filtered.filter(
          (p) => p.valuesScore >= 80 && p.marriageGoalScore >= 80
        );
        break;

      case "verified":
        filtered = filtered.filter((p) => p.verified);
        break;

      default:
        break;
    }

    // Dynamic Sort By
    switch (sortBy) {
      case "smart_rank":
        filtered = filtered.sort((a, b) => b.smartRankScore - a.smartRankScore);
        break;

      case "success_prob":
        filtered = filtered.sort((a, b) => b.successProbability - a.successProbability);
        break;

      case "mutual_fit":
        filtered = filtered.sort((a, b) => b.twoWayMutualScore - a.twoWayMutualScore);
        break;

      case "kundli":
        filtered = filtered.sort((a, b) => b.kundliScore - a.kundliScore);
        break;

      case "relevance":
        filtered = filtered.sort((a, b) => b.profileRelevanceScore - a.profileRelevanceScore);
        break;

      case "compatibility":
      default:
        filtered = filtered.sort((a, b) => b.matchScore - a.matchScore);
        break;
    }

    res.json({
      success: true,
      category,
      sortBy,
      hideDealbreakers,
      totalCount: filtered.length,
      preferences: prefs,
      rankingWeights,
      matches: filtered,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to generate match recommendations",
    });
  }
});
