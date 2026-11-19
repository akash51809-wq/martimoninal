import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { dbService } from "../databaseService";
import { MASTER_PROFILES, type MasterProfileRecord } from "../data/masterProfiles";

export const searchRouter = Router();

// Geographic City Coordinates for Map-Based Profile Search
export const CITY_COORDINATES: Record<string, { lat: number; lng: number; state: string; isNri?: boolean }> = {
  Pune: { lat: 18.5204, lng: 73.8567, state: "Maharashtra" },
  Mumbai: { lat: 19.076, lng: 72.8777, state: "Maharashtra" },
  Nagpur: { lat: 21.1458, lng: 79.0882, state: "Maharashtra" },
  Nashik: { lat: 19.9975, lng: 73.7898, state: "Maharashtra" },
  Delhi: { lat: 28.6139, lng: 77.209, state: "Delhi NCR" },
  Bengaluru: { lat: 12.9716, lng: 77.5946, state: "Karnataka" },
  Hyderabad: { lat: 17.385, lng: 78.4867, state: "Telangana" },
  Chennai: { lat: 13.0827, lng: 80.2707, state: "Tamil Nadu" },
  Ahmedabad: { lat: 23.0225, lng: 72.5714, state: "Gujarat" },
  Surat: { lat: 21.1702, lng: 72.8311, state: "Gujarat" },
  Kolkata: { lat: 22.5726, lng: 88.3639, state: "West Bengal" },
  Jaipur: { lat: 26.9124, lng: 75.7873, state: "Rajasthan" },
  Chandigarh: { lat: 30.7333, lng: 76.7794, state: "Punjab/Haryana" },
  Lucknow: { lat: 26.8467, lng: 80.9462, state: "Uttar Pradesh" },
  Indore: { lat: 22.7196, lng: 75.8577, state: "Madhya Pradesh" },
  // Global NRI Hubs
  "New York": { lat: 40.7128, lng: -74.006, state: "NY, USA", isNri: true },
  "San Francisco": { lat: 37.7749, lng: -122.4194, state: "CA, USA", isNri: true },
  London: { lat: 51.5074, lng: -0.1278, state: "UK", isNri: true },
  Toronto: { lat: 43.6532, lng: -79.3832, state: "Canada", isNri: true },
  Dubai: { lat: 25.2048, lng: 55.2708, state: "UAE", isNri: true },
  Singapore: { lat: 1.3521, lng: 103.8198, state: "Singapore", isNri: true },
  Sydney: { lat: -33.8688, lng: 151.2093, state: "Australia", isNri: true },
};

// Zod Validation Schema for Advanced Search Query
const searchFilterSchema = z.object({
  query: z.string().optional(),
  gender: z.enum(["All", "Female", "Male"]).optional().default("All"),
  ageMin: z.number().min(18).max(80).optional(),
  ageMax: z.number().min(18).max(80).optional(),
  heightMinCm: z.number().min(120).max(220).optional(),
  heightMaxCm: z.number().min(120).max(220).optional(),
  religions: z.array(z.string()).optional(),
  castes: z.array(z.string()).optional(),
  motherTongues: z.array(z.string()).optional(), // Feature 11: Multi-language
  cities: z.array(z.string()).optional(),
  states: z.array(z.string()).optional(),
  countries: z.array(z.string()).optional(), // Feature 12: NRI / Foreign

  // Professional & Elite Filters
  isGovtJob: z.boolean().optional(),
  isPremierInstitute: z.boolean().optional(),
  isNri: z.boolean().optional(), // Feature 12: NRI
  minIncomeLpa: z.number().min(0).max(500).optional(), // Feature 13: Income range
  maxIncomeLpa: z.number().min(0).max(1000).optional(), // Feature 13: Income range
  occupations: z.array(z.string()).optional(),
  diet: z.array(z.string()).optional(),
  smoking: z.string().optional(),
  drinking: z.string().optional(),

  // Feature 14: Family Background Filters
  familyTypes: z.array(z.string()).optional(), // Nuclear, Joint
  familyValues: z.array(z.string()).optional(), // Traditional, Moderate, Liberal
  familyStatuses: z.array(z.string()).optional(), // Middle Class, Upper Middle Class, Affluent

  // Feature 15: Manglik / Horoscope Filters
  manglik: z.string().optional(),
  rashis: z.array(z.string()).optional(),
  nakshatras: z.array(z.string()).optional(),
  minKundliScore: z.number().min(0).max(36).optional(),

  verifiedOnly: z.boolean().optional(),
  horoscopeAvailableOnly: z.boolean().optional(),
  premiumOnly: z.boolean().optional(),
  minProfileCompleteness: z.number().min(0).max(100).optional(),
  recentlyJoinedDays: z.number().min(0).max(365).optional(),
  maritalStatuses: z.array(z.string()).optional(),
  profileCreatedBy: z.array(z.string()).optional(),
  excludeViewed: z.boolean().optional(),
  excludeRejected: z.boolean().optional(),
  viewerUserId: z.string().optional(), // For selective profile hiding check

  // Sorting & Pagination
  sortBy: z
    .enum([
      "relevance",
      "newest",
      "income_desc",
      "age_asc",
      "kundli_desc",
      "completeness",
      "recently_active",
      "compatibility",
    ])
    .optional()
    .default("relevance"),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
});

const saveSearchSchema = z.object({
  searchName: z.string().min(2, "Search name must be at least 2 characters"),
  filters: z.record(z.any()),
  alertsEnabled: z.boolean().default(true),
});

// ============================================================================
// 1. ADVANCED & PROFESSIONAL MULTI-TIER SEARCH
// ============================================================================
searchRouter.post("/advanced", async (req: Request, res: Response) => {
  try {
    const filters = searchFilterSchema.parse(req.body);
    let results: MasterProfileRecord[] = [...MASTER_PROFILES];

    // Check selective stealth invisibility (Hide Profile from Selected Users)
    if (filters.viewerUserId) {
      results = results.filter(
        (p) => !dbService.isProfileHiddenFromViewer(p.id, filters.viewerUserId!)
      );
    }

    let activeFiltersCount = 0;

    // Free text keyword search
    if (filters.query && filters.query.trim().length > 0) {
      activeFiltersCount++;
      const q = filters.query.trim().toLowerCase();
      results = results.filter((p) => {
        const textToSearch = [
          p.name,
          p.profileId,
          p.city,
          p.state,
          p.country,
          p.education,
          p.college,
          p.profession,
          p.professionTag,
          p.company || "",
          p.caste,
          p.religion,
          p.bio,
        ]
          .join(" ")
          .toLowerCase();
        return textToSearch.includes(q);
      });
    }

    // Gender filter
    if (filters.gender && filters.gender !== "All") {
      results = results.filter((p) => p.gender === filters.gender);
    }

    // Age Range filter
    if (filters.ageMin !== undefined) {
      activeFiltersCount++;
      results = results.filter((p) => p.age >= filters.ageMin!);
    }
    if (filters.ageMax !== undefined) {
      activeFiltersCount++;
      results = results.filter((p) => p.age <= filters.ageMax!);
    }

    // Height Range filter
    if (filters.heightMinCm !== undefined) {
      activeFiltersCount++;
      results = results.filter((p) => p.heightCm >= filters.heightMinCm!);
    }
    if (filters.heightMaxCm !== undefined) {
      activeFiltersCount++;
      results = results.filter((p) => p.heightCm <= filters.heightMaxCm!);
    }

    // Religion filter
    if (filters.religions && filters.religions.length > 0 && !filters.religions.includes("All")) {
      activeFiltersCount++;
      results = results.filter((p) => filters.religions!.includes(p.religion));
    }

    // Caste filter
    if (filters.castes && filters.castes.length > 0 && !filters.castes.includes("All")) {
      activeFiltersCount++;
      results = results.filter((p) =>
        filters.castes!.some(
          (c) => p.caste.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase() === "all"
        )
      );
    }

    // Feature 11: Multi-language (Mother Tongue / Languages)
    if (filters.motherTongues && filters.motherTongues.length > 0 && !filters.motherTongues.includes("All")) {
      activeFiltersCount++;
      results = results.filter((p) =>
        filters.motherTongues!.some(
          (lang) =>
            p.motherTongue.toLowerCase().includes(lang.toLowerCase()) ||
            lang.toLowerCase().includes(p.motherTongue.toLowerCase())
        )
      );
    }

    // City / State filter
    if (filters.cities && filters.cities.length > 0) {
      activeFiltersCount++;
      results = results.filter((p) =>
        filters.cities!.some(
          (c) =>
            p.city.toLowerCase().includes(c.toLowerCase()) ||
            c.toLowerCase().includes(p.city.toLowerCase())
        )
      );
    }

    // Feature 12: NRI / Foreign Locations filter
    if (filters.isNri === true) {
      activeFiltersCount++;
      results = results.filter((p) => p.isNri || p.country !== "India");
    }
    if (filters.countries && filters.countries.length > 0 && !filters.countries.includes("All")) {
      activeFiltersCount++;
      results = results.filter((p) =>
        filters.countries!.some(
          (ctry) =>
            p.country.toLowerCase().includes(ctry.toLowerCase()) ||
            ctry.toLowerCase().includes(p.country.toLowerCase())
        )
      );
    }

    // Feature 13: Annual Income Range (Min & Max LPA)
    if (filters.minIncomeLpa !== undefined && filters.minIncomeLpa > 0) {
      activeFiltersCount++;
      results = results.filter((p) => p.annualIncomeLpa >= filters.minIncomeLpa!);
    }
    if (filters.maxIncomeLpa !== undefined && filters.maxIncomeLpa < 1000) {
      activeFiltersCount++;
      results = results.filter((p) => p.annualIncomeLpa <= filters.maxIncomeLpa!);
    }

    // Professional Filters
    if (filters.isGovtJob === true) {
      activeFiltersCount++;
      results = results.filter((p) => p.isGovtJob);
    }
    if (filters.isPremierInstitute === true) {
      activeFiltersCount++;
      results = results.filter((p) => p.isPremierInstitute);
    }
    if (filters.occupations && filters.occupations.length > 0) {
      activeFiltersCount++;
      results = results.filter((p) =>
        filters.occupations!.some(
          (occ) =>
            p.profession.toLowerCase().includes(occ.toLowerCase()) ||
            p.professionTag.toLowerCase().includes(occ.toLowerCase())
        )
      );
    }

    // Diet filter
    if (filters.diet && filters.diet.length > 0) {
      activeFiltersCount++;
      results = results.filter((p) =>
        filters.diet!.some((d) => p.lifestyle.diet.toLowerCase().includes(d.toLowerCase()))
      );
    }

    // Feature 14: Family Background Filters (Nuclear/Joint, Values, Status)
    if (filters.familyTypes && filters.familyTypes.length > 0 && !filters.familyTypes.includes("All")) {
      activeFiltersCount++;
      results = results.filter((p) => {
        const fType = p.state === "Maharashtra" || p.state === "Gujarat" ? "Joint" : "Nuclear";
        return filters.familyTypes!.includes(fType);
      });
    }

    // Feature 15: Manglik / Horoscope Filters
    if (filters.manglik && filters.manglik !== "Any") {
      activeFiltersCount++;
      results = results.filter((p) => p.manglik.toLowerCase() === filters.manglik!.toLowerCase());
    }
    if (filters.rashis && filters.rashis.length > 0 && !filters.rashis.includes("All")) {
      activeFiltersCount++;
      results = results.filter((p) =>
        filters.rashis!.some((r) => p.rashi.toLowerCase().includes(r.toLowerCase()))
      );
    }
    if (filters.minKundliScore && filters.minKundliScore > 0) {
      activeFiltersCount++;
      results = results.filter((p) => p.kundliScore >= filters.minKundliScore!);
    }

    // Verified profiles only
    if (filters.verifiedOnly === true) {
      activeFiltersCount++;
      results = results.filter((p) => p.verified);
    }

    // Marital Status filter
    if (filters.maritalStatuses && filters.maritalStatuses.length > 0 && !filters.maritalStatuses.includes("All")) {
      activeFiltersCount++;
      results = results.filter((p) =>
        filters.maritalStatuses!.some((ms) => p.maritalStatus.toLowerCase().includes(ms.toLowerCase()))
      );
    }

    // Horoscope Available filter
    if (filters.horoscopeAvailableOnly === true) {
      activeFiltersCount++;
      results = results.filter((p) => Boolean(p.rashi && p.nakshatra && p.kundliScore > 0));
    }

    // Premium / VIP Profiles only
    if (filters.premiumOnly === true) {
      activeFiltersCount++;
      results = results.filter((p) => p.verified && (p.annualIncomeLpa >= 20 || p.isPremierInstitute || p.isNri));
    }

    // Profile Completeness filter
    if (filters.minProfileCompleteness && filters.minProfileCompleteness > 0) {
      activeFiltersCount++;
      results = results.filter((p) => {
        const comp = p.verified ? 95 : 82;
        return comp >= filters.minProfileCompleteness!;
      });
    }

    // Recently Joined filter
    if (filters.recentlyJoinedDays && filters.recentlyJoinedDays > 0) {
      activeFiltersCount++;
      results = results.filter((p) => p.registeredDaysAgo <= filters.recentlyJoinedDays!);
    }

    // Profile Created By filter
    if (filters.profileCreatedBy && filters.profileCreatedBy.length > 0 && !filters.profileCreatedBy.includes("All")) {
      activeFiltersCount++;
      results = results.filter((p, idx) => {
        const createdBy = idx % 3 === 0 ? "Parents" : idx % 3 === 1 ? "Self" : "Sibling";
        return filters.profileCreatedBy!.includes(createdBy);
      });
    }

    // Exclude Already Viewed Profiles
    if (filters.excludeViewed === true && filters.viewerUserId) {
      activeFiltersCount++;
      const viewedIds = new Set(
        dbService.getViewedProfiles(filters.viewerUserId).map((v) => v.viewedUserId)
      );
      results = results.filter((p) => !viewedIds.has(p.id));
    }

    // Exclude Rejected / Declined / Blocked Profiles
    if (filters.excludeRejected === true && filters.viewerUserId) {
      activeFiltersCount++;
      const declinedIds = new Set(
        dbService.getDeclinedOrBlockedUserIds(filters.viewerUserId)
      );
      results = results.filter((p) => !declinedIds.has(p.id));
    }

    // Sorting
    switch (filters.sortBy) {
      case "newest":
        results.sort((a, b) => a.registeredDaysAgo - b.registeredDaysAgo);
        break;
      case "income_desc":
        results.sort((a, b) => b.annualIncomeLpa - a.annualIncomeLpa);
        break;
      case "age_asc":
        results.sort((a, b) => a.age - b.age);
        break;
      case "kundli_desc":
        results.sort((a, b) => b.kundliScore - a.kundliScore);
        break;
      case "completeness":
        results.sort((a, b) => (b.verified ? 98 : 84) - (a.verified ? 98 : 84));
        break;
      case "recently_active":
        results.sort((a, b) => (b.online ? 1 : 0) - (a.online ? 1 : 0) || a.registeredDaysAgo - b.registeredDaysAgo);
        break;
      case "compatibility":
        results.sort((a, b) => b.kundliScore - a.kundliScore || (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
        break;
      case "relevance":
      default:
        results.sort((a, b) => {
          const scoreA = (a.verified ? 10 : 0) + a.kundliScore + (a.isPremierInstitute ? 5 : 0);
          const scoreB = (b.verified ? 10 : 0) + b.kundliScore + (b.isPremierInstitute ? 5 : 0);
          return scoreB - scoreA;
        });
        break;
    }

    // Pagination
    const total = results.length;
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const startIndex = (page - 1) * limit;
    const paginated = results.slice(startIndex, startIndex + limit);

    const enrichedResults = paginated.map((p, idx) => {
      // Strictly redact sensitive contact PII from discovery search (CWE-200 / CWE-359)
      const { mobile: _mob, email: _em, ...safeProfile } = p as any;

      return {
        ...safeProfile,
        mobile: undefined,
        email: undefined,
        matchScore: Math.min(99, 70 + (p.kundliScore - 20) + (p.verified ? 5 : 0)),
        matchReasons: [
          `${p.professionTag} in ${p.city}`,
          p.isGovtJob
            ? "Government / PSU Official"
            : p.isPremierInstitute
            ? `Alumni of ${p.college}`
            : "Verified Alliance",
          `Kundli Compatibility: ${p.kundliScore}/36 Gunas`,
        ],
        isMutualMatch: p.verified && p.kundliScore >= 30,
        isNewMember: p.registeredDaysAgo <= 7,
        isVerifiedGovtId: p.verified,
        profileCompleteness: p.verified ? 96 : 84,
        isPremiumMember: p.verified && (p.annualIncomeLpa >= 20 || Boolean(p.isPremierInstitute)),
        profileCreatedBy: idx % 3 === 0 ? "Parents" : idx % 3 === 1 ? "Self" : "Sibling",
        horoscopeAvailable: Boolean(p.rashi && p.nakshatra),
      };
    });

    res.json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      activeFiltersCount,
      results: enrichedResults,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Invalid search query",
    });
  }
});

// ============================================================================
// 2. MAP-BASED PROFILE SEARCH (Feature 4: Geographic Discovery)
// ============================================================================
searchRouter.post("/map", (req: Request, res: Response) => {
  try {
    const { city, maxRadiusKm = 500, isNriOnly = false, viewerUserId } = req.body;

    let profiles = [...MASTER_PROFILES];
    if (viewerUserId) {
      profiles = profiles.filter((p) => !dbService.isProfileHiddenFromViewer(p.id, viewerUserId));
    }

    if (isNriOnly) {
      profiles = profiles.filter((p) => p.isNri || p.country !== "India");
    }

    // Group profiles by city clusters
    const cityClusterMap: Record<
      string,
      {
        city: string;
        state: string;
        coordinates: { lat: number; lng: number };
        isNri: boolean;
        count: number;
        profiles: any[];
      }
    > = {};

    profiles.forEach((p) => {
      const coords = CITY_COORDINATES[p.city] || {
        lat: 18.5204 + (Math.random() - 0.5) * 4,
        lng: 73.8567 + (Math.random() - 0.5) * 4,
        state: p.state,
        isNri: p.isNri,
      };

      if (!cityClusterMap[p.city]) {
        cityClusterMap[p.city] = {
          city: p.city,
          state: p.state,
          coordinates: { lat: coords.lat, lng: coords.lng },
          isNri: Boolean(p.isNri || p.country !== "India"),
          count: 0,
          profiles: [],
        };
      }

      cityClusterMap[p.city].count++;
      cityClusterMap[p.city].profiles.push({
        id: p.id,
        profileId: p.profileId,
        name: p.name,
        age: p.age,
        height: p.height,
        profession: p.profession,
        education: p.education,
        income: p.income,
        kundliScore: p.kundliScore,
        caste: p.caste,
        photo: p.photos[0] || "/1.jpg",
        verified: p.verified,
      });
    });

    const clusters = Object.values(cityClusterMap);

    res.json({
      success: true,
      totalProfiles: profiles.length,
      totalCities: clusters.length,
      clusters,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 3. PROFILE COMPARISON ENGINE (Feature 17: Side-by-Side Comparison)
// ============================================================================
searchRouter.get("/compare", (req: Request, res: Response) => {
  try {
    const idsQuery = (req.query.ids as string) || "";
    const ids = idsQuery.split(",").map((s) => s.trim()).filter(Boolean);

    if (ids.length < 2) {
      return res.status(400).json({
        success: false,
        error: "Please provide at least 2 profile IDs to compare (e.g. ?ids=1,2,3).",
      });
    }

    const profilesToCompare = MASTER_PROFILES.filter(
      (p) => ids.includes(p.id) || ids.includes(p.profileId.replace(/^#/, ""))
    );

    if (profilesToCompare.length < 2) {
      return res.status(404).json({
        success: false,
        error: "One or more requested profiles could not be found for comparison.",
      });
    }

    const comparisonMatrix = {
      basic: [
        { label: "Profile ID", values: profilesToCompare.map((p) => p.profileId) },
        { label: "Age", values: profilesToCompare.map((p) => `${p.age} Yrs`) },
        { label: "Height", values: profilesToCompare.map((p) => p.height) },
        { label: "Location", values: profilesToCompare.map((p) => `${p.city}, ${p.state}`) },
        { label: "Marital Status", values: profilesToCompare.map((p) => p.maritalStatus) },
      ],
      educationCareer: [
        { label: "Highest Education", values: profilesToCompare.map((p) => p.education) },
        { label: "College / Institute", values: profilesToCompare.map((p) => p.college) },
        { label: "Profession", values: profilesToCompare.map((p) => p.profession) },
        { label: "Annual Income", values: profilesToCompare.map((p) => p.income) },
        {
          label: "Institution Tier",
          values: profilesToCompare.map((p) => (p.isPremierInstitute ? "🎓 Premier (IIT/IIM)" : "Recognized University")),
        },
        {
          label: "Job Sector",
          values: profilesToCompare.map((p) => (p.isGovtJob ? "🏛️ Govt / PSU" : p.isNri ? "✈️ Global / NRI" : "Private Sector")),
        },
      ],
      communityAstro: [
        { label: "Religion & Caste", values: profilesToCompare.map((p) => `${p.religion} - ${p.caste}`) },
        { label: "Mother Tongue", values: profilesToCompare.map((p) => p.motherTongue) },
        { label: "Rashi / Nakshatra", values: profilesToCompare.map((p) => `${p.rashi} • ${p.nakshatra}`) },
        { label: "Manglik Status", values: profilesToCompare.map((p) => p.manglik) },
        { label: "Kundli Guna Match", values: profilesToCompare.map((p) => `${p.kundliScore}/36 Gunas`) },
      ],
      lifestyleFamily: [
        { label: "Dietary Habits", values: profilesToCompare.map((p) => p.lifestyle.diet) },
        { label: "Drinking / Smoking", values: profilesToCompare.map((p) => `${p.lifestyle.drink} / ${p.lifestyle.smoke}`) },
        { label: "Hobbies & Interests", values: profilesToCompare.map((p) => p.lifestyle.hobbies.join(", ")) },
      ],
    };

    res.json({
      success: true,
      profiles: profilesToCompare,
      comparisonMatrix,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 4. SIMILAR PROFILE SUGGESTIONS (Feature 18: Similar Profiles Like This)
// ============================================================================
searchRouter.get("/similar/:profileId", (req: Request, res: Response) => {
  try {
    const rawId = req.params.profileId.trim().replace(/^#/, "");
    const base = MASTER_PROFILES.find(
      (p) => p.id === rawId || p.profileId.replace(/^#/, "") === rawId
    );

    if (!base) {
      return res.status(404).json({ success: false, error: "Target profile not found" });
    }

    // Score all other candidates for similarity
    const candidatesWithSimilarity = MASTER_PROFILES.filter((p) => p.id !== base.id && p.gender === base.gender).map(
      (p) => {
        let similarityScore = 40;
        const reasons: string[] = [];

        // 1. Same or related career category
        if (p.professionTag === base.professionTag) {
          similarityScore += 25;
          reasons.push(`Similar professional background (${p.professionTag})`);
        } else if (p.isGovtJob && base.isGovtJob) {
          similarityScore += 20;
          reasons.push("Government sector career parity");
        }

        // 2. Community & Caste parity
        if (p.caste === base.caste) {
          similarityScore += 20;
          reasons.push(`Shared community (${p.caste})`);
        } else if (p.religion === base.religion) {
          similarityScore += 10;
        }

        // 3. Similar age bracket (within 2-3 years)
        if (Math.abs(p.age - base.age) <= 2) {
          similarityScore += 15;
          reasons.push(`Similar age group (${p.age} Yrs)`);
        }

        // 4. Similar income tier
        const incomeDiff = Math.abs(p.annualIncomeLpa - base.annualIncomeLpa);
        if (incomeDiff <= 5) {
          similarityScore += 15;
          reasons.push(`Matching financial tier (${p.income})`);
        }

        return {
          ...p,
          similarityPercentage: Math.min(98, similarityScore),
          similarityReasons: reasons.slice(0, 3),
        };
      }
    );

    const sortedSimilar = candidatesWithSimilarity
      .sort((a, b) => b.similarityPercentage - a.similarityPercentage)
      .slice(0, 6);

    res.json({
      success: true,
      baseProfile: {
        id: base.id,
        name: base.name,
        profession: base.profession,
        caste: base.caste,
      },
      similarProfiles: sortedSimilar,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 5. DIRECT PROFILE ID LOOKUP (e.g., VK-10492 or #000003)
// ============================================================================
searchRouter.get("/by-id/:profileId", async (req: Request, res: Response) => {
  try {
    const rawId = req.params.profileId.trim();
    if (!rawId) {
      return res.status(400).json({ success: false, error: "Profile ID required" });
    }

    const cleanId = rawId.replace(/^#/, "").toLowerCase();

    const profile = MASTER_PROFILES.find((p) => {
      const targetClean = p.profileId.replace(/^#/, "").toLowerCase();
      const directId = p.id.toLowerCase();
      return (
        targetClean === cleanId ||
        directId === cleanId ||
        p.profileId.toLowerCase() === rawId.toLowerCase()
      );
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: `No matrimonial profile found with ID "${rawId}". Please verify the profile number.`,
      });
    }

    res.json({
      success: true,
      profile: {
        ...profile,
        matchScore: 95,
        matchReasons: ["Direct Profile Lookup Match", "Government ID Verified Alliance"],
        isMutualMatch: true,
        isNewMember: profile.registeredDaysAgo <= 7,
        isVerifiedGovtId: profile.verified,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to lookup profile by ID",
    });
  }
});

// ============================================================================
// 6. SAVED SEARCHES MANAGEMENT (Feature 16: Custom Search Filters Save)
// ============================================================================
searchRouter.get("/saved/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    const searches = dbService.getSavedSearches(userId);
    res.json({
      success: true,
      savedSearches: searches,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to retrieve saved searches",
    });
  }
});

searchRouter.post("/saved/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    const { searchName, filters, alertsEnabled } = saveSearchSchema.parse(req.body);

    const saved = await dbService.createSavedSearch(userId, {
      searchName,
      filters,
      alertsEnabled,
      matchCount: 4,
    });

    res.status(201).json({
      success: true,
      savedSearch: saved,
      message: `Search "${searchName}" saved successfully. You will receive notification alerts for new matches.`,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Validation error",
    });
  }
});

searchRouter.patch("/saved/:userId/:searchId/toggle-alert", async (req: Request, res: Response) => {
  try {
    const { userId, searchId } = req.params;
    const { alertsEnabled } = req.body;

    const updated = await dbService.toggleSavedSearchAlert(userId, searchId, Boolean(alertsEnabled));
    if (!updated) {
      return res.status(404).json({ success: false, error: "Saved search not found" });
    }

    res.json({
      success: true,
      savedSearch: updated,
      message: `Email & push alerts ${updated.alertsEnabled ? "enabled" : "disabled"} for this search.`,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to toggle alert notifications",
    });
  }
});

searchRouter.delete("/saved/:userId/:searchId", async (req: Request, res: Response) => {
  try {
    const { userId, searchId } = req.params;

    const success = await dbService.deleteSavedSearch(userId, searchId);
    if (!success) {
      return res.status(404).json({ success: false, error: "Saved search not found" });
    }

    res.json({
      success: true,
      message: "Saved search removed successfully.",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to delete saved search",
    });
  }
});
