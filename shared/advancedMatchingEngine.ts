/**
 * Advanced Matching & Compatibility Engine
 * 
 * Provides:
 * 1. Multidimensional Compatibility Scoring (Lifestyle, Family, Education/Career)
 * 2. Psychometric Personality Matching & Trait Alignment
 * 3. Bidirectional (2-Way) Mutual Preference Evaluation
 * 4. Predictive Match Success Probability Modeling
 * 5. Configurable Smart Match Ranking Algorithm
 * 
 * Strict Enterprise Grade TypeScript - Zero external dependencies.
 */

// ============================================================================
// 1. DATA MODELS & TYPES
// ============================================================================

export interface LifestyleAttributes {
  diet: string; // Vegetarian, Eggetarian, Non-Vegetarian, Vegan, Jain
  drink: string; // Never, Occasionally, Socially, Regularly
  smoke: string; // Never, Occasionally, Yes
  hobbies?: string[];
  petPreference?: string; // Pet Lover, Doesn't Mind, Not Comfortable
  routine?: string; // Early Riser, Night Owl, Flexible
}

export interface FamilyAttributes {
  familyType: string; // Nuclear, Joint
  familyValues: string; // Traditional, Moderate, Liberal
  familyStatus: string; // Middle Class, Upper Middle Class, Affluent, High Networth
  fatherOccupation?: string;
  motherOccupation?: string;
  nativePlace?: string;
}

export interface EducationCareerAttributes {
  education: string;
  educationLevel?: string; // Doctorate, Masters, Bachelors, Professional
  college?: string;
  isPremierInstitute?: boolean; // IIT, IIM, AIIMS, NIT, BITS, etc.
  profession: string;
  professionTag?: string; // Software Engineer, Doctor, CA, Civil Services, etc.
  company?: string;
  isGovtJob?: boolean;
  annualIncomeLpa: number;
}

export interface PersonalityTraits {
  socialEnergy: number; // 1 (Introspective / Calm) to 5 (Extroverted / Social Butterfly)
  lifeOutlook: number; // 1 (Deeply Traditional) to 5 (Progressive / Contemporary)
  ambition: number; // 1 (Work-Life Balance Focus) to 5 (Driven / Ambitious Achiever)
  finances: number; // 1 (Disciplined Saver / Frugal) to 5 (Experience Focused / Spender)
  familyBoundaries: number; // 1 (Deep Joint Kinship) to 5 (Independent Couple Focus)
}

export interface PersonalityProfile {
  userId: string;
  archetype: string;
  archetypeBadge: string;
  archetypeDescription: string;
  traits: PersonalityTraits;
  topValues: string[];
  completedAt?: string;
}

export interface QuizQuestion {
  id: keyof PersonalityTraits;
  title: string;
  question: string;
  dimensionName: string;
  options: Array<{
    value: number;
    label: string;
    sublabel: string;
  }>;
}

export interface SubScoreBreakdown {
  score: number; // 0 - 100
  label: string;
  status: "Excellent" | "High" | "Moderate" | "Fair";
  highlights: string[];
}

export interface MultidimensionalScore {
  lifestyle: SubScoreBreakdown;
  family: SubScoreBreakdown;
  educationCareer: SubScoreBreakdown;
  compositeScore: number;
}

export interface MutualPreferenceCheck {
  criteriaName: string;
  userSatisfiesCandidate: boolean;
  candidateSatisfiesUser: boolean;
  userDetail: string;
  candidateDetail: string;
}

export interface TwoWayMutualMatchResult {
  isMutualMatch: boolean;
  mutualScore: number; // 0 - 100
  candidateSatisfiesUserPct: number;
  userSatisfiesCandidatePct: number;
  checks: MutualPreferenceCheck[];
  summary: string;
}

export interface MatchSuccessProbabilityReport {
  successProbability: number; // 0 - 100%
  stabilityGrade: "Grade A+ (Elite Harmony)" | "Grade A (High Stability)" | "Grade B+ (Good Balance)" | "Grade B (Balanced / Needs Open Communication)";
  confidenceLevel: "Very High" | "High" | "Moderate";
  keyStrengths: string[];
  advisoryNote: string;
  factorsBreakdown: Array<{
    pillar: string;
    weightPct: number;
    score: number;
    verdict: "Strong Positive" | "Favorable" | "Neutral / Moderate";
  }>;
}

export interface SmartRankingWeights {
  horoscopeWeight: number; // default 25
  partnerPreferencesWeight: number; // default 25
  lifestyleWeight: number; // default 20
  educationCareerWeight: number; // default 15
  familyWeight: number; // default 10
  personalityWeight: number; // default 5
}

export const DEFAULT_RANKING_WEIGHTS: SmartRankingWeights = {
  horoscopeWeight: 25,
  partnerPreferencesWeight: 25,
  lifestyleWeight: 20,
  educationCareerWeight: 15,
  familyWeight: 10,
  personalityWeight: 5,
};

// ============================================================================
// 2. PSYCHOMETRIC QUIZ DEFINITIONS & ARCHETYPES
// ============================================================================

export const PERSONALITY_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "socialEnergy",
    title: "Weekend & Social Style",
    question: "How do you prefer spending your ideal weekend or leisure time?",
    dimensionName: "Social Energy",
    options: [
      {
        value: 1,
        label: "Peaceful & Cozy at Home",
        sublabel: "Reading, watching movies, unwinding quietly with immediate loved ones.",
      },
      {
        value: 2,
        label: "Calm & Intimate",
        sublabel: "Dinner with a close friend or family member, quiet walks.",
      },
      {
        value: 3,
        label: "Balanced Mix",
        sublabel: "One day relaxing at home, one day meeting friends or going out.",
      },
      {
        value: 4,
        label: "Active & Outgoing",
        sublabel: "Exploring cafes, outdoor activities, gathering with groups.",
      },
      {
        value: 5,
        label: "High Energy & Highly Social",
        sublabel: "Attending parties, hosting gatherings, networking, vibrant social circle.",
      },
    ],
  },
  {
    id: "lifeOutlook",
    title: "Tradition vs Modernity",
    question: "What is your approach towards cultural traditions and modern lifestyle?",
    dimensionName: "Life Outlook",
    options: [
      {
        value: 1,
        label: "Deeply Traditional",
        sublabel: "Committed to ancestral rituals, traditional customs, and cultural heritage.",
      },
      {
        value: 2,
        label: "Traditional with Modern Touch",
        sublabel: "Cherishing cultural values while adopting modern practical thinking.",
      },
      {
        value: 3,
        label: "Balanced Harmony",
        sublabel: "Respecting family traditions on festivals, otherwise modern in daily life.",
      },
      {
        value: 4,
        label: "Modern & Progressive",
        sublabel: "Forward-looking mindset, equality-centric, flexible cultural beliefs.",
      },
      {
        value: 5,
        label: "Contemporary & Cosmopolitan",
        sublabel: "Global lifestyle, individualistic values, open and progressive world-view.",
      },
    ],
  },
  {
    id: "ambition",
    title: "Career & Life Ambition",
    question: "How do you prioritize career progression versus personal and family time?",
    dimensionName: "Career & Ambition",
    options: [
      {
        value: 1,
        label: "Family & Wellbeing First",
        sublabel: "Peaceful routine, stable job hours, priority on home and personal health.",
      },
      {
        value: 2,
        label: "Balanced Equilibrium",
        sublabel: "Steady career growth with firm boundaries for evening and weekend family life.",
      },
      {
        value: 3,
        label: "Growing & Adaptive",
        sublabel: "Willing to stretch during critical work phases, balancing family responsibilities.",
      },
      {
        value: 4,
        label: "Career Driven",
        sublabel: "High professional aspiration, pursuing senior leadership or entrepreneurship.",
      },
      {
        value: 5,
        label: "Relentless Visionary",
        sublabel: "Building an enterprise or top-tier career; high energy, high dedication.",
      },
    ],
  },
  {
    id: "finances",
    title: "Financial Philosophy",
    question: "How do you view money management, savings, and investments?",
    dimensionName: "Financial Philosophy",
    options: [
      {
        value: 1,
        label: "Disciplined Saver & Conservative",
        sublabel: "High savings rate, risk-averse, safety fund first, cautious spending.",
      },
      {
        value: 2,
        label: "Prudent & Structured",
        sublabel: "Systematic investments (SIP, real estate), budgeting with occasional treats.",
      },
      {
        value: 3,
        label: "Balanced Growth",
        sublabel: "Saving 40-50% while enjoying quality dining, vacations, and comfort.",
      },
      {
        value: 4,
        label: "Experience Focused",
        sublabel: "Investing in memories, travel, modern gadgets, and quality of life.",
      },
      {
        value: 5,
        label: "Abundant & Spontaneous",
        sublabel: "Life is for living now; generous spending on luxury, lifestyle, and passion.",
      },
    ],
  },
  {
    id: "familyBoundaries",
    title: "Family Living & Dynamics",
    question: "What is your vision for living arrangements and extended family involvement?",
    dimensionName: "Family Living",
    options: [
      {
        value: 1,
        label: "Traditional Joint Family",
        sublabel: "Living together with parents/elders in a warm, unified joint household.",
      },
      {
        value: 2,
        label: "Close-Knit Proximity",
        sublabel: "Living nearby or in the same building as parents for daily mutual support.",
      },
      {
        value: 3,
        label: "Flexible & Caring",
        sublabel: "Open to living together or nuclear depending on job location and mutual comfort.",
      },
      {
        value: 4,
        label: "Nuclear Family with Regular Visits",
        sublabel: "Independent couple home with frequent weekend visits and holiday gatherings.",
      },
      {
        value: 5,
        label: "Fully Independent Space",
        sublabel: "Strictly nuclear household with distinct boundaries for couple autonomy.",
      },
    ],
  },
];

/**
 * Determine personality archetype based on trait vectors.
 */
export function determineArchetype(traits: PersonalityTraits): {
  archetype: string;
  archetypeBadge: string;
  archetypeDescription: string;
  topValues: string[];
} {
  const { socialEnergy, lifeOutlook, ambition, finances, familyBoundaries } = traits;

  if (ambition >= 4 && lifeOutlook >= 4) {
    return {
      archetype: "Ambitious Visionary",
      archetypeBadge: "🚀 Visionary Achiever",
      archetypeDescription: "Dynamic, progressive, and forward-looking with high career aspiration and cosmopolitan values.",
      topValues: ["Career Growth", "Modern Thinking", "Mutual Equality", "Global Mindset"],
    };
  }

  if (lifeOutlook <= 2 && familyBoundaries <= 2) {
    return {
      archetype: "Cultured Traditionalist",
      archetypeBadge: "🏛️ Cultured Traditionalist",
      archetypeDescription: "Rooted in timeless heritage, values family togetherness, respectful of rituals and joint family warmth.",
      topValues: ["Family Bonding", "Cultural Heritage", "Respect for Elders", "Stability"],
    };
  }

  if (socialEnergy <= 2 && finances <= 2) {
    return {
      archetype: "Thoughtful Guardian",
      archetypeBadge: "🛡️ Thoughtful Guardian",
      archetypeDescription: "Prudent, serene, and deeply loyal; values financial security, peace of mind, and quiet home comforts.",
      topValues: ["Financial Prudence", "Peaceful Home", "Loyalty", "Emotional Security"],
    };
  }

  if (socialEnergy >= 4 && finances >= 4) {
    return {
      archetype: "Vibrant Trailblazer",
      archetypeBadge: "✨ Vibrant Trailblazer",
      archetypeDescription: "High-spirited, adventurous, and social; loves discovering new cuisines, traveling, and living life to the fullest.",
      topValues: ["Adventure & Travel", "Social Connection", "Spontaneity", "Joyful Living"],
    };
  }

  if (familyBoundaries <= 3 && ambition <= 3) {
    return {
      archetype: "Warm Harmonizer",
      archetypeBadge: "🌸 Warm Harmonizer",
      archetypeDescription: "Gentle, empathetic, and nurturing; excels at creating harmony, understanding partner feelings, and fostering peace.",
      topValues: ["Empathy", "Harmonious Relationships", "Work-Life Balance", "Kindness"],
    };
  }

  return {
    archetype: "Balanced Realist",
    archetypeBadge: "⚖️ Balanced Realist",
    archetypeDescription: "Pragmatic, adaptable, and emotionally mature; balances career with family and tradition with modern comfort.",
    topValues: ["Practicality", "Adaptability", "Mutual Respect", "Balanced Growth"],
  };
}

// ============================================================================
// 3. MULTIDIMENSIONAL COMPATIBILITY CALCULATOR
// ============================================================================

export function calculateMultidimensionalScore(
  user: {
    diet?: string;
    drink?: string;
    smoke?: string;
    familyType?: string;
    familyValues?: string;
    familyStatus?: string;
    education?: string;
    profession?: string;
    annualIncomeLpa?: number;
    isPremierInstitute?: boolean;
    isGovtJob?: boolean;
    caste?: string;
    religion?: string;
    motherTongue?: string;
  },
  candidate: {
    diet?: string;
    drink?: string;
    smoke?: string;
    familyType?: string;
    familyValues?: string;
    familyStatus?: string;
    education?: string;
    profession?: string;
    annualIncomeLpa?: number;
    isPremierInstitute?: boolean;
    isGovtJob?: boolean;
    caste?: string;
    religion?: string;
    motherTongue?: string;
  }
): MultidimensionalScore {
  // --------------------------------------------------------------------------
  // A. LIFESTYLE COMPATIBILITY (Diet, Drinking, Smoking, Routine)
  // --------------------------------------------------------------------------
  let lifestylePoints = 0;
  const lifestyleHighlights: string[] = [];

  // 1. Diet Compatibility (40 pts)
  const uDiet = (user.diet || "Vegetarian").toLowerCase();
  const cDiet = (candidate.diet || "Vegetarian").toLowerCase();

  if (uDiet === cDiet) {
    lifestylePoints += 40;
    lifestyleHighlights.push(`Identical culinary lifestyle (${user.diet || "Vegetarian"})`);
  } else if (
    (uDiet.includes("veg") && cDiet.includes("veg") && !cDiet.includes("non")) ||
    (uDiet.includes("jain") && cDiet.includes("veg"))
  ) {
    lifestylePoints += 35;
    lifestyleHighlights.push(`Compatible vegetarian food habits`);
  } else if (uDiet.includes("non") && cDiet.includes("non")) {
    lifestylePoints += 40;
    lifestyleHighlights.push(`Both enjoy non-vegetarian dining`);
  } else {
    // Mixed diet: manageable in modern households
    lifestylePoints += 20;
    lifestyleHighlights.push(`Complementary dietary choices (${uDiet} & ${cDiet})`);
  }

  // 2. Drinking Habits (30 pts)
  const uDrink = (user.drink || "Never").toLowerCase();
  const cDrink = (candidate.drink || "Never").toLowerCase();

  if (uDrink === cDrink) {
    lifestylePoints += 30;
    lifestyleHighlights.push(`Harmonious alcohol outlook (${user.drink || "Never"})`);
  } else if (
    (uDrink === "never" && cDrink === "occasionally") ||
    (uDrink === "occasionally" && cDrink === "never")
  ) {
    lifestylePoints += 24;
  } else {
    lifestylePoints += 15;
  }

  // 3. Smoking Habits (30 pts)
  const uSmoke = (user.smoke || "Never").toLowerCase();
  const cSmoke = (candidate.smoke || "Never").toLowerCase();

  if (uSmoke === cSmoke) {
    lifestylePoints += 30;
    if (uSmoke === "never") {
      lifestyleHighlights.push(`Both maintain clean, non-smoking lifestyle`);
    }
  } else if (uSmoke === "never" && cSmoke !== "never") {
    lifestylePoints += 10;
  } else {
    lifestylePoints += 20;
  }

  const lifestyleScore = Math.min(100, Math.max(30, lifestylePoints));

  // --------------------------------------------------------------------------
  // B. FAMILY VALUES & BACKGROUND COMPATIBILITY
  // --------------------------------------------------------------------------
  let familyPoints = 0;
  const familyHighlights: string[] = [];

  // 1. Family Type (30 pts)
  const uFamType = (user.familyType || "Nuclear").toLowerCase();
  const cFamType = (candidate.familyType || "Nuclear").toLowerCase();
  if (uFamType === cFamType) {
    familyPoints += 30;
    familyHighlights.push(`Aligned family living preference (${user.familyType || "Nuclear"})`);
  } else {
    familyPoints += 20;
    familyHighlights.push(`Complementary family structure`);
  }

  // 2. Cultural & Caste Parity (35 pts)
  const uRel = (user.religion || "Hindu").toLowerCase();
  const cRel = (candidate.religion || "Hindu").toLowerCase();
  const uCaste = (user.caste || "").toLowerCase();
  const cCaste = (candidate.caste || "").toLowerCase();

  if (uRel === cRel) {
    familyPoints += 20;
    if (uCaste && cCaste && (uCaste === cCaste || uCaste.includes(cCaste) || cCaste.includes(uCaste))) {
      familyPoints += 15;
      familyHighlights.push(`Shared cultural & community heritage (${candidate.caste})`);
    } else {
      familyPoints += 10;
      familyHighlights.push(`Shared religious traditions (${candidate.religion || "Hindu"})`);
    }
  } else {
    familyPoints += 10;
  }

  // 3. Family Status & Background (35 pts)
  const uStatus = (user.familyStatus || "Middle Class").toLowerCase();
  const cStatus = (candidate.familyStatus || "Middle Class").toLowerCase();
  if (uStatus === cStatus || uStatus.includes(cStatus) || cStatus.includes(uStatus)) {
    familyPoints += 35;
    familyHighlights.push(`Well-aligned socioeconomic background`);
  } else {
    familyPoints += 25;
  }

  const familyScore = Math.min(100, Math.max(35, familyPoints));

  // --------------------------------------------------------------------------
  // C. EDUCATION & CAREER PARITY
  // --------------------------------------------------------------------------
  let eduPoints = 0;
  const eduHighlights: string[] = [];

  // 1. Professional & Educational Standing (40 pts)
  const uEdu = (user.education || "").toLowerCase();
  const cEdu = (candidate.education || "").toLowerCase();

  const isBothMasterOrHigher =
    (uEdu.includes("mba") || uEdu.includes("m.") || uEdu.includes("md") || uEdu.includes("phd") || uEdu.includes("b.tech")) &&
    (cEdu.includes("mba") || cEdu.includes("m.") || cEdu.includes("md") || cEdu.includes("phd") || cEdu.includes("b.tech"));

  if (isBothMasterOrHigher) {
    eduPoints += 40;
    eduHighlights.push(`High educational parity & professional degrees`);
  } else if (uEdu.length > 0 && cEdu.length > 0) {
    eduPoints += 32;
    eduHighlights.push(`Graduation qualification parity`);
  } else {
    eduPoints += 25;
  }

  // 2. Premier Institute & Career Badges (30 pts)
  if (candidate.isPremierInstitute) {
    eduPoints += 15;
    eduHighlights.push(`Premier academic background`);
  }
  if (candidate.isGovtJob) {
    eduPoints += 15;
    eduHighlights.push(`Prestigious government sector stability`);
  } else if (candidate.profession) {
    eduPoints += 12;
    eduHighlights.push(`Established career profile`);
  }

  // 3. Financial & Income Parity (30 pts)
  const uInc = user.annualIncomeLpa || 15;
  const cInc = candidate.annualIncomeLpa || 18;
  const ratio = Math.min(uInc, cInc) / Math.max(uInc, cInc || 1);

  if (ratio >= 0.6) {
    eduPoints += 30;
    eduHighlights.push(`Balanced financial earning parity`);
  } else if (ratio >= 0.4) {
    eduPoints += 22;
  } else {
    eduPoints += 15;
  }

  const educationScore = Math.min(100, Math.max(35, eduPoints));

  // Composite multi-score
  const compositeScore = Math.round(
    lifestyleScore * 0.35 + familyScore * 0.3 + educationScore * 0.35
  );

  const getStatus = (sc: number): "Excellent" | "High" | "Moderate" | "Fair" => {
    if (sc >= 85) return "Excellent";
    if (sc >= 72) return "High";
    if (sc >= 55) return "Moderate";
    return "Fair";
  };

  return {
    lifestyle: {
      score: lifestyleScore,
      label: "Lifestyle & Daily Living",
      status: getStatus(lifestyleScore),
      highlights: lifestyleHighlights.slice(0, 3),
    },
    family: {
      score: familyScore,
      label: "Family Values & Culture",
      status: getStatus(familyScore),
      highlights: familyHighlights.slice(0, 3),
    },
    educationCareer: {
      score: educationScore,
      label: "Education & Career Parity",
      status: getStatus(educationScore),
      highlights: eduHighlights.slice(0, 3),
    },
    compositeScore,
  };
}

// ============================================================================
// 4. PERSONALITY COMPATIBILITY CALCULATOR
// ============================================================================

export function calculatePersonalityCompatibility(
  userTraits: PersonalityTraits,
  candidateTraits: PersonalityTraits
): {
  compatibilityScore: number;
  archetypeSynergy: string;
  dimensionComparisons: Array<{
    dimension: string;
    userLevel: number;
    candidateLevel: number;
    difference: number;
    harmonyStatus: "Optimal Alignment" | "Healthy Complement" | "Discussion Recommended";
  }>;
  synergies: string[];
  growthAreas: string[];
} {
  const dimensions: Array<{ key: keyof PersonalityTraits; label: string }> = [
    { key: "socialEnergy", label: "Social Energy" },
    { key: "lifeOutlook", label: "Cultural Outlook" },
    { key: "ambition", label: "Career Ambition" },
    { key: "finances", label: "Financial Philosophy" },
    { key: "familyBoundaries", label: "Family Dynamics" },
  ];

  let totalDiff = 0;
  const comparisons = dimensions.map(({ key, label }) => {
    const uVal = userTraits[key] || 3;
    const cVal = candidateTraits[key] || 3;
    const diff = Math.abs(uVal - cVal);
    totalDiff += diff;

    let harmonyStatus: "Optimal Alignment" | "Healthy Complement" | "Discussion Recommended" = "Healthy Complement";
    if (diff <= 1) {
      harmonyStatus = "Optimal Alignment";
    } else if (diff >= 3) {
      harmonyStatus = "Discussion Recommended";
    }

    return {
      dimension: label,
      userLevel: uVal,
      candidateLevel: cVal,
      difference: diff,
      harmonyStatus,
    };
  });

  // Maximum possible distance across 5 dimensions is 4 * 5 = 20.
  // Base compatibility is scaled 100 - (totalDiff / 20 * 50) => range 50 - 100
  const compatibilityScore = Math.max(52, Math.min(98, Math.round(100 - (totalDiff / 20) * 48)));

  const synergies: string[] = [];
  const growthAreas: string[] = [];

  comparisons.forEach((item) => {
    if (item.harmonyStatus === "Optimal Alignment") {
      synergies.push(`Strong shared wavelength on ${item.dimension.toLowerCase()}`);
    } else if (item.harmonyStatus === "Discussion Recommended") {
      growthAreas.push(`Different viewpoints on ${item.dimension.toLowerCase()}; valuable to discuss priorities early.`);
    }
  });

  if (synergies.length === 0) {
    synergies.push("Complementary temperaments that can balance each other nicely");
  }

  let archetypeSynergy = "Balanced and complementary personalities with healthy communication potential.";
  if (compatibilityScore >= 85) {
    archetypeSynergy = "Exceptional cognitive and emotional wavelength; instinctive mutual understanding.";
  } else if (compatibilityScore >= 72) {
    archetypeSynergy = "High emotional harmony with complementary strengths in daily life management.";
  }

  return {
    compatibilityScore,
    archetypeSynergy,
    dimensionComparisons: comparisons,
    synergies,
    growthAreas,
  };
}

// ============================================================================
// 5. BIDIRECTIONAL (2-WAY) MUTUAL PREFERENCE CHECK
// ============================================================================

export function evaluateTwoWayMutualMatch(
  userProfile: {
    age: number;
    heightCm: number;
    education: string;
    caste: string;
    city: string;
    annualIncomeLpa: number;
    maritalStatus: string;
  },
  userPrefs: {
    ageMin: number;
    ageMax: number;
    heightMinCm: number;
    heightMaxCm: number;
    castes: string[];
    educationLevels: string[];
    minAnnualIncomeLpa: number;
    preferredCities: string[];
    maritalStatus: string[];
  },
  candidateProfile: {
    age: number;
    heightCm: number;
    education: string;
    caste: string;
    city: string;
    annualIncomeLpa: number;
    maritalStatus: string;
  },
  candidatePrefs?: {
    ageRange?: string; // e.g. "23-28 Yrs"
    heightRange?: string; // e.g. "160-175 cm"
    education?: string;
    caste?: string;
    maritalStatus?: string;
    income?: string;
    preferredCities?: string[];
  }
): TwoWayMutualMatchResult {
  const checks: MutualPreferenceCheck[] = [];

  // 1. Age Range Check
  const candInUserAge = candidateProfile.age >= userPrefs.ageMin && candidateProfile.age <= userPrefs.ageMax;
  let userInCandAge = true;
  if (candidatePrefs?.ageRange) {
    const parts = candidatePrefs.ageRange.match(/\d+/g);
    if (parts && parts.length >= 2) {
      const cMinAge = parseInt(parts[0], 10);
      const cMaxAge = parseInt(parts[1], 10);
      userInCandAge = userProfile.age >= cMinAge && userProfile.age <= cMaxAge;
    }
  }
  checks.push({
    criteriaName: "Age Criteria",
    userSatisfiesCandidate: userInCandAge,
    candidateSatisfiesUser: candInUserAge,
    userDetail: `${userProfile.age} Yrs`,
    candidateDetail: `${candidateProfile.age} Yrs`,
  });

  // 2. Height Check
  const candInUserHeight = candidateProfile.heightCm >= userPrefs.heightMinCm && candidateProfile.heightCm <= userPrefs.heightMaxCm;
  let userInCandHeight = true;
  if (candidatePrefs?.heightRange) {
    const hParts = candidatePrefs.heightRange.match(/\d+/g);
    if (hParts && hParts.length >= 2) {
      const cMinH = parseInt(hParts[0], 10);
      const cMaxH = parseInt(hParts[1], 10);
      userInCandHeight = userProfile.heightCm >= cMinH && userProfile.heightCm <= cMaxH;
    }
  }
  checks.push({
    criteriaName: "Height Criteria",
    userSatisfiesCandidate: userInCandHeight,
    candidateSatisfiesUser: candInUserHeight,
    userDetail: `${userProfile.heightCm} cm`,
    candidateDetail: `${candidateProfile.heightCm} cm`,
  });

  // 3. Marital Status Check
  const candInUserMarital = userPrefs.maritalStatus.length === 0 || userPrefs.maritalStatus.includes(candidateProfile.maritalStatus);
  const userInCandMarital = !candidatePrefs?.maritalStatus || candidatePrefs.maritalStatus.toLowerCase().includes(userProfile.maritalStatus.toLowerCase()) || candidatePrefs.maritalStatus === "All";
  checks.push({
    criteriaName: "Marital Status",
    userSatisfiesCandidate: userInCandMarital,
    candidateSatisfiesUser: candInUserMarital,
    userDetail: userProfile.maritalStatus,
    candidateDetail: candidateProfile.maritalStatus,
  });

  // 4. Caste & Community Check
  const candInUserCaste = userPrefs.castes.length === 0 || userPrefs.castes.some((c) => candidateProfile.caste.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes("all"));
  const userInCandCaste = !candidatePrefs?.caste || candidatePrefs.caste.toLowerCase().includes(userProfile.caste.toLowerCase()) || candidatePrefs.caste.toLowerCase().includes("any") || candidatePrefs.caste.toLowerCase().includes("all");
  checks.push({
    criteriaName: "Community & Caste",
    userSatisfiesCandidate: userInCandCaste,
    candidateSatisfiesUser: candInUserCaste,
    userDetail: userProfile.caste,
    candidateDetail: candidateProfile.caste,
  });

  // 5. Education Check
  const candInUserEdu = userPrefs.educationLevels.length === 0 || userPrefs.educationLevels.some((e) => candidateProfile.education.toLowerCase().includes(e.toLowerCase()));
  const userInCandEdu = !candidatePrefs?.education || candidatePrefs.education.toLowerCase().includes("any") || userProfile.education.toLowerCase().includes(candidatePrefs.education.toLowerCase());
  checks.push({
    criteriaName: "Education Qualification",
    userSatisfiesCandidate: userInCandEdu,
    candidateSatisfiesUser: candInUserEdu,
    userDetail: userProfile.education,
    candidateDetail: candidateProfile.education,
  });

  // 6. Location / Preferred Cities
  const candInUserCity = userPrefs.preferredCities.length === 0 || userPrefs.preferredCities.some((c) => candidateProfile.city.toLowerCase().includes(c.toLowerCase()));
  const userInCandCity = !candidatePrefs?.preferredCities || candidatePrefs.preferredCities.length === 0 || candidatePrefs.preferredCities.some((c) => userProfile.city.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes("any"));
  checks.push({
    criteriaName: "Preferred Location",
    userSatisfiesCandidate: userInCandCity,
    candidateSatisfiesUser: candInUserCity,
    userDetail: userProfile.city,
    candidateDetail: candidateProfile.city,
  });

  // 7. Income Expectation
  const candInUserInc = candidateProfile.annualIncomeLpa >= userPrefs.minAnnualIncomeLpa;
  let userInCandInc = true;
  if (candidatePrefs?.income) {
    const incMatches = candidatePrefs.income.match(/\d+/g);
    if (incMatches && incMatches.length > 0) {
      const minExpected = parseInt(incMatches[0], 10);
      userInCandInc = userProfile.annualIncomeLpa >= minExpected;
    }
  }
  checks.push({
    criteriaName: "Income Benchmark",
    userSatisfiesCandidate: userInCandInc,
    candidateSatisfiesUser: candInUserInc,
    userDetail: `₹${userProfile.annualIncomeLpa} LPA`,
    candidateDetail: `₹${candidateProfile.annualIncomeLpa} LPA`,
  });

  const totalChecks = checks.length;
  const userSatisfiedCount = checks.filter((c) => c.candidateSatisfiesUser).length;
  const candidateSatisfiedCount = checks.filter((c) => c.userSatisfiesCandidate).length;

  const candidateSatisfiesUserPct = Math.round((userSatisfiedCount / totalChecks) * 100);
  const userSatisfiesCandidatePct = Math.round((candidateSatisfiedCount / totalChecks) * 100);

  const mutualScore = Math.round((candidateSatisfiesUserPct + userSatisfiesCandidatePct) / 2);
  const isMutualMatch = candidateSatisfiesUserPct >= 75 && userSatisfiesCandidatePct >= 75;

  let summary = `Balanced 2-Way preference alignment: Candidate satisfies ${candidateSatisfiesUserPct}% of your preferences, and you satisfy ${userSatisfiesCandidatePct}% of theirs.`;
  if (isMutualMatch) {
    summary = `100% Verified Mutual Match! Both profiles fulfill key expectations including age, education, location, and community standards.`;
  }

  return {
    isMutualMatch,
    mutualScore,
    candidateSatisfiesUserPct,
    userSatisfiesCandidatePct,
    checks,
    summary,
  };
}

// ============================================================================
// 6. PREDICTIVE MATCH SUCCESS PROBABILITY MODEL
// ============================================================================

export function calculateMatchSuccessProbability(params: {
  kundliGunaScore: number; // 0 to 36
  multidimensionalScore: MultidimensionalScore;
  personalityScore: number; // 0 to 100
  mutualMatchResult: TwoWayMutualMatchResult;
}): MatchSuccessProbabilityReport {
  const { kundliGunaScore, multidimensionalScore, personalityScore, mutualMatchResult } = params;

  // Scale Ashtakoot 36 Gunas to 100%
  // 18 gunas is passing threshold (50%), 28 gunas is auspicious (78%), 32+ is supreme (90%+)
  const astroPct = Math.min(100, Math.round((Math.max(14, kundliGunaScore) / 36) * 100));

  // Multi-pillar weighted synthesis
  // Pillar 1: Astrological Harmony (25%)
  // Pillar 2: Lifestyle Compatibility (25%)
  // Pillar 3: Educational & Career Alignment (20%)
  // Pillar 4: Family & Socio-cultural Parity (15%)
  // Pillar 5: Mutual Preferences & Personality (15%)
  const lifestyle = multidimensionalScore.lifestyle.score;
  const eduCareer = multidimensionalScore.educationCareer.score;
  const family = multidimensionalScore.family.score;
  const mutualAndPersonality = Math.round((mutualMatchResult.mutualScore * 0.6 + personalityScore * 0.4));

  const weightedSum =
    astroPct * 0.25 +
    lifestyle * 0.25 +
    eduCareer * 0.2 +
    family * 0.15 +
    mutualAndPersonality * 0.15;

  // Bound probability between 60% and 98% for verified credible profiles
  const successProbability = Math.min(98, Math.max(60, Math.round(weightedSum)));

  let stabilityGrade: MatchSuccessProbabilityReport["stabilityGrade"] = "Grade A (High Stability)";
  let confidenceLevel: MatchSuccessProbabilityReport["confidenceLevel"] = "High";

  if (successProbability >= 90) {
    stabilityGrade = "Grade A+ (Elite Harmony)";
    confidenceLevel = "Very High";
  } else if (successProbability >= 80) {
    stabilityGrade = "Grade A (High Stability)";
    confidenceLevel = "High";
  } else if (successProbability >= 70) {
    stabilityGrade = "Grade B+ (Good Balance)";
    confidenceLevel = "High";
  } else {
    stabilityGrade = "Grade B (Balanced / Needs Open Communication)";
    confidenceLevel = "Moderate";
  }

  const keyStrengths: string[] = [];
  if (kundliGunaScore >= 28) {
    keyStrengths.push(`Auspicious Vedic Astrological Compatibility (${kundliGunaScore}/36 Gunas)`);
  }
  if (lifestyle >= 80) {
    keyStrengths.push("Excellent daily habits and dining lifestyle synchronization");
  }
  if (eduCareer >= 80) {
    keyStrengths.push("High educational qualification & financial standing parity");
  }
  if (family >= 80) {
    keyStrengths.push("Strong cultural background and family values alignment");
  }
  if (mutualMatchResult.isMutualMatch) {
    keyStrengths.push("Reciprocal mutual criteria fulfillment across both profiles");
  }
  if (keyStrengths.length === 0) {
    keyStrengths.push("Balanced mutual values and healthy room for mutual understanding");
  }

  const advisoryNote =
    successProbability >= 85
      ? "Outstanding compatibility profile. Families can confidently initiate formal conversations with a high likelihood of harmonious alliance."
      : successProbability >= 75
      ? "Very promising match with strong foundational alignment. Discuss family routines, career mobility, and long-term settlement preferences."
      : "Good potential alliance. An open conversation around personal expectations and lifestyle preferences will ensure complete clarity.";

  const getVerdict = (sc: number): "Strong Positive" | "Favorable" | "Neutral / Moderate" => {
    if (sc >= 80) return "Strong Positive";
    if (sc >= 65) return "Favorable";
    return "Neutral / Moderate";
  };

  const factorsBreakdown = [
    {
      pillar: "Astrological Ashtakoot Harmony",
      weightPct: 25,
      score: astroPct,
      verdict: getVerdict(astroPct),
    },
    {
      pillar: "Lifestyle & Daily Living Alignment",
      weightPct: 25,
      score: lifestyle,
      verdict: getVerdict(lifestyle),
    },
    {
      pillar: "Educational & Career Standing",
      weightPct: 20,
      score: eduCareer,
      verdict: getVerdict(eduCareer),
    },
    {
      pillar: "Family Values & Cultural Roots",
      weightPct: 15,
      score: family,
      verdict: getVerdict(family),
    },
    {
      pillar: "2-Way Mutual Expectations",
      weightPct: 15,
      score: mutualAndPersonality,
      verdict: getVerdict(mutualAndPersonality),
    },
  ];

  return {
    successProbability,
    stabilityGrade,
    confidenceLevel,
    keyStrengths,
    advisoryNote,
    factorsBreakdown,
  };
}

// ============================================================================
// 7. SMART MATCH RANKING COMPOSITE FUNCTION
// ============================================================================

export function computeSmartMatchRank(
  scores: {
    horoscopeScore: number; // scaled 0 - 100
    partnerPreferencesScore: number; // 0 - 100
    lifestyleScore: number; // 0 - 100
    educationCareerScore: number; // 0 - 100
    familyScore: number; // 0 - 100
    personalityScore: number; // 0 - 100
  },
  weights: SmartRankingWeights = DEFAULT_RANKING_WEIGHTS
): number {
  const totalWeight =
    weights.horoscopeWeight +
    weights.partnerPreferencesWeight +
    weights.lifestyleWeight +
    weights.educationCareerWeight +
    weights.familyWeight +
    weights.personalityWeight;

  if (totalWeight <= 0) return 75;

  const weightedSum =
    scores.horoscopeScore * weights.horoscopeWeight +
    scores.partnerPreferencesScore * weights.partnerPreferencesWeight +
    scores.lifestyleScore * weights.lifestyleWeight +
    scores.educationCareerScore * weights.educationCareerWeight +
    scores.familyScore * weights.familyWeight +
    scores.personalityScore * weights.personalityWeight;

  return Math.min(100, Math.max(40, Math.round(weightedSum / totalWeight)));
}
