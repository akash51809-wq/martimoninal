/**
 * Comprehensive In-House Vedic Kundli & 36-Guna Ashtakoot Matching Engine
 * 100% Rule-based mathematical astrological calculation
 * No third-party API dependencies. 0ms latency.
 */

export interface AstrologicalProfile {
  name: string;
  gender: "male" | "female";
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  rashi: string; // Moon sign
  nakshatra: string; // Birth constellation
  charan?: number; // 1 to 4
  manglik: "Non-manglik" | "Manglik" | "Anshik Manglik" | "Don't know";
  gotra?: string;
}

export interface KootaScore {
  koota: string;
  name: string;
  maxScore: number;
  obtainedScore: number;
  area: string;
  description: string;
  verdict: "Excellent" | "Good" | "Average" | "Dosha / Concern";
}

export interface DoshaAnalysis {
  nadiDosha: {
    hasDosha: boolean;
    isCancelled: boolean;
    cancellationReason?: string;
    description: string;
  };
  bhakootDosha: {
    hasDosha: boolean;
    isCancelled: boolean;
    cancellationReason?: string;
    description: string;
  };
  ganaDosha: {
    hasDosha: boolean;
    description: string;
  };
  manglikCompatibility: {
    isCompatible: boolean;
    groomStatus: string;
    brideStatus: string;
    verdict: string;
    remedyRecommendation?: string;
  };
}

export interface KundliMatchingResult {
  groom: AstrologicalProfile;
  bride: AstrologicalProfile;
  totalScore: number;
  maxScore: 36;
  percentage: number;
  verdictTitle: string;
  verdictCategory: "Uttam" | "Madhyam" | "Sadharan" | "Anukul";
  verdictSummary: string;
  kootas: KootaScore[];
  doshas: DoshaAnalysis;
  recommendation: string;
  generatedAt: string;
  reportId: string;
}

// 12 Rashis (Moon Signs) with lords and varna
export const RASHI_DATA: Record<
  string,
  {
    index: number;
    english: string;
    lord: string;
    varna: number; // 4: Brahmin, 3: Kshatriya, 2: Vaishya, 1: Shudra
    vashya: "Chatuspada" | "Manava" | "Jalachara" | "Vanachara" | "Keeta";
    element: "Fire" | "Earth" | "Air" | "Water";
  }
> = {
  Mesha: { index: 0, english: "Aries", lord: "Mars", varna: 3, vashya: "Chatuspada", element: "Fire" },
  Vrishabha: { index: 1, english: "Taurus", lord: "Venus", varna: 2, vashya: "Chatuspada", element: "Earth" },
  Mithuna: { index: 2, english: "Gemini", lord: "Mercury", varna: 1, vashya: "Manava", element: "Air" },
  Karka: { index: 3, english: "Cancer", lord: "Moon", varna: 4, vashya: "Jalachara", element: "Water" },
  Simha: { index: 4, english: "Leo", lord: "Sun", varna: 3, vashya: "Vanachara", element: "Fire" },
  Kanya: { index: 5, english: "Virgo", lord: "Mercury", varna: 2, vashya: "Manava", element: "Earth" },
  Tula: { index: 6, english: "Libra", lord: "Venus", varna: 1, vashya: "Manava", element: "Air" },
  Vrishchika: { index: 7, english: "Scorpio", lord: "Mars", varna: 4, vashya: "Keeta", element: "Water" },
  Dhanu: { index: 8, english: "Sagittarius", lord: "Jupiter", varna: 3, vashya: "Manava", element: "Fire" },
  Makara: { index: 9, english: "Capricorn", lord: "Saturn", varna: 2, vashya: "Jalachara", element: "Earth" },
  Kumbha: { index: 10, english: "Aquarius", lord: "Saturn", varna: 1, vashya: "Manava", element: "Air" },
  Meena: { index: 11, english: "Pisces", lord: "Jupiter", varna: 4, vashya: "Jalachara", element: "Water" },
};

// 27 Nakshatras with Gana, Yoni, and Nadi
export const NAKSHATRA_DATA: Record<
  string,
  {
    index: number;
    gana: "Deva" | "Manushya" | "Rakshasa";
    yoni: string;
    nadi: "Adi" | "Madhya" | "Antya";
  }
> = {
  Ashwini: { index: 0, gana: "Deva", yoni: "Horse", nadi: "Adi" },
  Bharani: { index: 1, gana: "Manushya", yoni: "Elephant", nadi: "Madhya" },
  Krittika: { index: 2, gana: "Rakshasa", yoni: "Sheep", nadi: "Antya" },
  Rohini: { index: 3, gana: "Manushya", yoni: "Serpent", nadi: "Antya" },
  Mrigashirsha: { index: 4, gana: "Deva", yoni: "Serpent", nadi: "Madhya" },
  Ardra: { index: 5, gana: "Manushya", yoni: "Dog", nadi: "Adi" },
  Punarvasu: { index: 6, gana: "Deva", yoni: "Cat", nadi: "Adi" },
  Pushya: { index: 7, gana: "Deva", yoni: "Sheep", nadi: "Madhya" },
  Ashlesha: { index: 8, gana: "Rakshasa", yoni: "Cat", nadi: "Antya" },
  Magha: { index: 9, gana: "Rakshasa", yoni: "Rat", nadi: "Antya" },
  "Purva Phalguni": { index: 10, gana: "Manushya", yoni: "Rat", nadi: "Madhya" },
  "Uttara Phalguni": { index: 11, gana: "Manushya", yoni: "Cow", nadi: "Adi" },
  Hasta: { index: 12, gana: "Deva", yoni: "Buffalo", nadi: "Adi" },
  Chitra: { index: 13, gana: "Rakshasa", yoni: "Tiger", nadi: "Madhya" },
  Swati: { index: 14, gana: "Deva", yoni: "Buffalo", nadi: "Antya" },
  Vishakha: { index: 15, gana: "Rakshasa", yoni: "Tiger", nadi: "Antya" },
  Anuradha: { index: 16, gana: "Deva", yoni: "Deer", nadi: "Madhya" },
  Jyeshtha: { index: 17, gana: "Rakshasa", yoni: "Deer", nadi: "Adi" },
  Mula: { index: 18, gana: "Rakshasa", yoni: "Dog", nadi: "Adi" },
  "Purva Ashadha": { index: 19, gana: "Manushya", yoni: "Monkey", nadi: "Madhya" },
  "Uttara Ashadha": { index: 20, gana: "Manushya", yoni: "Mongoose", nadi: "Antya" },
  Shravana: { index: 21, gana: "Deva", yoni: "Monkey", nadi: "Antya" },
  Dhanishta: { index: 22, gana: "Rakshasa", yoni: "Lion", nadi: "Madhya" },
  Shatabhisha: { index: 23, gana: "Rakshasa", yoni: "Horse", nadi: "Adi" },
  "Purva Bhadrapada": { index: 24, gana: "Manushya", yoni: "Lion", nadi: "Adi" },
  "Uttara Bhadrapada": { index: 25, gana: "Manushya", yoni: "Cow", nadi: "Madhya" },
  Revati: { index: 26, gana: "Deva", yoni: "Elephant", nadi: "Antya" },
};

// Planetary Friendship Matrix (Graha Maitri)
const PLANET_FRIENDSHIP: Record<string, { friends: string[]; neutrals: string[]; enemies: string[] }> = {
  Sun: {
    friends: ["Moon", "Mars", "Jupiter"],
    neutrals: ["Mercury"],
    enemies: ["Venus", "Saturn"],
  },
  Moon: {
    friends: ["Sun", "Mercury"],
    neutrals: ["Mars", "Jupiter", "Venus", "Saturn"],
    enemies: [],
  },
  Mars: {
    friends: ["Sun", "Moon", "Jupiter"],
    neutrals: ["Venus", "Saturn"],
    enemies: ["Mercury"],
  },
  Mercury: {
    friends: ["Sun", "Venus"],
    neutrals: ["Mars", "Jupiter", "Saturn"],
    enemies: ["Moon"],
  },
  Jupiter: {
    friends: ["Sun", "Moon", "Mars"],
    neutrals: ["Saturn"],
    enemies: ["Mercury", "Venus"],
  },
  Venus: {
    friends: ["Mercury", "Saturn"],
    neutrals: ["Mars", "Jupiter"],
    enemies: ["Sun", "Moon"],
  },
  Saturn: {
    friends: ["Mercury", "Venus"],
    neutrals: ["Jupiter"],
    enemies: ["Sun", "Moon", "Mars"],
  },
};

// Yoni Hostility Pairs (Sworn natural enemies)
const YONI_ENEMIES: [string, string][] = [
  ["Horse", "Buffalo"],
  ["Elephant", "Lion"],
  ["Sheep", "Monkey"],
  ["Serpent", "Mongoose"],
  ["Dog", "Deer"],
  ["Cat", "Rat"],
  ["Cow", "Tiger"],
];

/**
 * 1. Calculate Varna Koota (1 point)
 * Groom Varna >= Bride Varna -> 1 point
 */
function calculateVarna(groomRashi: string, brideRashi: string): { score: number; desc: string } {
  const g = RASHI_DATA[groomRashi]?.varna || 2;
  const b = RASHI_DATA[brideRashi]?.varna || 2;
  if (g >= b) {
    return {
      score: 1,
      desc: "Ego harmony and shared spiritual perspective are naturally aligned.",
    };
  }
  return {
    score: 0,
    desc: "Requires mutual patience and shared decision-making in financial matters.",
  };
}

/**
 * 2. Calculate Vashya Koota (2 points)
 * Mutual attraction and control
 */
function calculateVashya(groomRashi: string, brideRashi: string): { score: number; desc: string } {
  const g = RASHI_DATA[groomRashi]?.vashya || "Manava";
  const b = RASHI_DATA[brideRashi]?.vashya || "Manava";

  if (g === b) {
    return { score: 2, desc: "Equal magnetic attraction and harmonious companionship." };
  }
  if (
    (g === "Manava" && b === "Chatuspada") ||
    (g === "Chatuspada" && b === "Manava") ||
    (g === "Jalachara" && b === "Jalachara")
  ) {
    return { score: 1, desc: "Moderate mutual affection with healthy independence." };
  }
  return { score: 0.5, desc: "Balanced mutual respect needed to maintain mutual interest." };
}

/**
 * 3. Calculate Tara Koota (3 points)
 * Health, destiny, and longevity alignment
 */
function calculateTara(groomNak: string, brideNak: string): { score: number; desc: string } {
  const gIdx = NAKSHATRA_DATA[groomNak]?.index ?? 0;
  const bIdx = NAKSHATRA_DATA[brideNak]?.index ?? 0;

  const diff1 = (bIdx - gIdx + 27) % 9;
  const diff2 = (gIdx - bIdx + 27) % 9;

  const inauspicious = [3, 5, 7]; // Vipat, Pratyak, Naidhana
  const b1Good = !inauspicious.includes(diff1);
  const b2Good = !inauspicious.includes(diff2);

  if (b1Good && b2Good) {
    return { score: 3, desc: "Both birth stars promote sound health, prosperity, and destiny." };
  }
  if (b1Good || b2Good) {
    return { score: 1.5, desc: "Favorable planetary energies with neutral destiny impact." };
  }
  return { score: 0, desc: "Regular spiritual practice and good health routines recommended." };
}

/**
 * 4. Calculate Yoni Koota (4 points)
 * Physical, biological and sensual harmony
 */
function calculateYoni(groomNak: string, brideNak: string): { score: number; desc: string } {
  const gYoni = NAKSHATRA_DATA[groomNak]?.yoni || "Horse";
  const bYoni = NAKSHATRA_DATA[brideNak]?.yoni || "Horse";

  if (gYoni === bYoni) {
    return { score: 4, desc: "Identical animal archetypes ensuring highest physical compatibility." };
  }

  const isEnemy = YONI_ENEMIES.some(
    ([a, b]) => (a === gYoni && b === bYoni) || (a === bYoni && b === gYoni)
  );

  if (isEnemy) {
    return { score: 0, desc: "Contrasting physical temperaments; patience and mutual care advised." };
  }

  return { score: 2, desc: "Pleasant biological alignment and affectionate co-existence." };
}

/**
 * 5. Calculate Graha Maitri Koota (5 points)
 * Mental outlook, friendship, and intellectual companionship
 */
function calculateGrahaMaitri(groomRashi: string, brideRashi: string): { score: number; desc: string } {
  const gLord = RASHI_DATA[groomRashi]?.lord || "Sun";
  const bLord = RASHI_DATA[brideRashi]?.lord || "Sun";

  if (gLord === bLord) {
    return { score: 5, desc: "Same planetary ruler creates natural friendship and effortless communication." };
  }

  const gFriends = PLANET_FRIENDSHIP[gLord]?.friends || [];
  const gNeutrals = PLANET_FRIENDSHIP[gLord]?.neutrals || [];
  const bFriends = PLANET_FRIENDSHIP[bLord]?.friends || [];
  const bNeutrals = PLANET_FRIENDSHIP[bLord]?.neutrals || [];

  const gViewsB = gFriends.includes(bLord) ? "friend" : gNeutrals.includes(bLord) ? "neutral" : "enemy";
  const bViewsG = bFriends.includes(gLord) ? "friend" : bNeutrals.includes(gLord) ? "neutral" : "enemy";

  if (gViewsB === "friend" && bViewsG === "friend") {
    return { score: 5, desc: "Planetary rulers are mutual friends; deep emotional bond and trust." };
  }
  if ((gViewsB === "friend" && bViewsG === "neutral") || (gViewsB === "neutral" && bViewsG === "friend")) {
    return { score: 4, desc: "Harmonious mental rapport and mutual understanding of perspectives." };
  }
  if (gViewsB === "neutral" && bViewsG === "neutral") {
    return { score: 3, desc: "Neutral planetary disposition; intellect matches through shared life goals." };
  }
  if (gViewsB === "enemy" && bViewsG === "enemy") {
    return { score: 0, desc: "Diverse viewpoints; active empathetic communication brings harmony." };
  }
  return { score: 1, desc: "Occasional differences in viewpoint easily bridged by respect." };
}

/**
 * 6. Calculate Gana Koota (6 points)
 * Temperament and behavioral chemistry
 */
function calculateGana(groomNak: string, brideNak: string): { score: number; desc: string; hasDosha: boolean } {
  const gGana = NAKSHATRA_DATA[groomNak]?.gana || "Deva";
  const bGana = NAKSHATRA_DATA[brideNak]?.gana || "Deva";

  if (gGana === bGana) {
    return {
      score: 6,
      desc: `Both possess ${gGana} Gana, ensuring seamless compatibility in behavior and lifestyle.`,
      hasDosha: false,
    };
  }

  if (
    (gGana === "Deva" && bGana === "Manushya") ||
    (gGana === "Manushya" && bGana === "Deva")
  ) {
    return {
      score: 5,
      desc: "Deva & Manushya Gana alliance provides admirable balance of spirituality and pragmatism.",
      hasDosha: false,
    };
  }

  if (gGana === "Rakshasa" || bGana === "Rakshasa") {
    return {
      score: 0,
      desc: "Distinct behavioral temperaments; mutual understanding required during disagreements.",
      hasDosha: true,
    };
  }

  return { score: 1, desc: "Moderate behavioral compatibility.", hasDosha: false };
}

/**
 * 7. Calculate Bhakoot Koota (7 points)
 * Financial prosperity, marital joy, and familial happiness
 */
function calculateBhakoot(
  groomRashi: string,
  brideRashi: string
): {
  score: number;
  desc: string;
  hasDosha: boolean;
  isCancelled: boolean;
  cancellationReason?: string;
} {
  const gIdx = RASHI_DATA[groomRashi]?.index ?? 0;
  const bIdx = RASHI_DATA[brideRashi]?.index ?? 0;

  const dist = ((bIdx - gIdx + 12) % 12) + 1; // 1 to 12

  // Inauspicious Bhakoot patterns: 6/8 (Shadashtaka), 9/5 (Navapanchama), 2/12 (Dwirdwadasha)
  const isShadashtaka = dist === 6 || dist === 8;
  const isNavapanchama = dist === 5 || dist === 9;
  const isDwirdwadasha = dist === 2 || dist === 12;

  const hasDosha = isShadashtaka || isNavapanchama || isDwirdwadasha;

  if (!hasDosha) {
    return {
      score: 7,
      desc: "Auspicious planetary house alignment fostering financial wealth, love, and joy.",
      hasDosha: false,
      isCancelled: false,
    };
  }

  // Check Bhakoot Dosha Cancellation
  // Cancelled if Rashi lords are same or mutual friends
  const gLord = RASHI_DATA[groomRashi]?.lord || "";
  const bLord = RASHI_DATA[brideRashi]?.lord || "";

  if (gLord === bLord) {
    return {
      score: 7,
      desc: "Bhakoot Dosha is neutralized because both zodiac signs are ruled by the same planetary lord.",
      hasDosha: true,
      isCancelled: true,
      cancellationReason: `Both signs are ruled by ${gLord}, establishing Bhakoot Dosha Parihara.`,
    };
  }

  const isFriends = (PLANET_FRIENDSHIP[gLord]?.friends || []).includes(bLord);
  if (isFriends) {
    return {
      score: 7,
      desc: "Bhakoot Dosha is cancelled due to planetary friendship between rulers.",
      hasDosha: true,
      isCancelled: true,
      cancellationReason: `${gLord} and ${bLord} share cordial planetary friendship.`,
    };
  }

  return {
    score: 0,
    desc: `Presents ${
      isShadashtaka ? "Shadashtaka (6/8)" : isNavapanchama ? "Navapanchama (9/5)" : "Dwirdwadasha (2/12)"
    } combination.`,
    hasDosha: true,
    isCancelled: false,
  };
}

/**
 * 8. Calculate Nadi Koota (8 points)
 * Genetic health, physiological vitality, and progeny
 */
function calculateNadi(
  groomNak: string,
  brideNak: string,
  groomRashi: string,
  brideRashi: string
): {
  score: number;
  desc: string;
  hasDosha: boolean;
  isCancelled: boolean;
  cancellationReason?: string;
} {
  const gNadi = NAKSHATRA_DATA[groomNak]?.nadi || "Adi";
  const bNadi = NAKSHATRA_DATA[brideNak]?.nadi || "Madhya";

  if (gNadi !== bNadi) {
    return {
      score: 8,
      desc: `Distinct Nadis (${gNadi} & ${bNadi}) assure optimum genetic diversity and offspring vitality.`,
      hasDosha: false,
      isCancelled: false,
    };
  }

  // Same Nadi = Nadi Dosha. Check cancellations:
  // 1. Same Rashi but different Nakshatras
  if (groomRashi === brideRashi && groomNak !== brideNak) {
    return {
      score: 8,
      desc: "Nadi Dosha is completely mitigated because the zodiac sign is identical with distinct birth stars.",
      hasDosha: true,
      isCancelled: true,
      cancellationReason: "Same Moon sign (Rashi) with different Nakshatras provides Vedic Nadi Parihara.",
    };
  }

  // 2. Same Nakshatra but different Rashis (e.g., Krittika in Aries vs Taurus)
  if (groomNak === brideNak && groomRashi !== brideRashi) {
    return {
      score: 8,
      desc: "Nadi Dosha is neutralized as the constellation spans across two distinct zodiac signs.",
      hasDosha: true,
      isCancelled: true,
      cancellationReason: "Same constellation placed in different zodiac houses neutralizes genetic dosha.",
    };
  }

  return {
    score: 0,
    desc: `Both share ${gNadi} Nadi. Consultation with an astrologer for specific remedial mantras is recommended.`,
    hasDosha: true,
    isCancelled: false,
  };
}

/**
 * Check Manglik Compatibility
 */
function analyzeManglik(
  groomManglik: string,
  brideManglik: string
): {
  isCompatible: boolean;
  groomStatus: string;
  brideStatus: string;
  verdict: string;
  remedyRecommendation?: string;
} {
  const isGManglik = groomManglik === "Manglik";
  const isBManglik = brideManglik === "Manglik";

  if (isGManglik && isBManglik) {
    return {
      isCompatible: true,
      groomStatus: groomManglik,
      brideStatus: brideManglik,
      verdict: "Perfect Manglik Match: Both individuals are Manglik, completely cancelling Mars affliction.",
    };
  }

  if (!isGManglik && !isBManglik) {
    return {
      isCompatible: true,
      groomStatus: groomManglik,
      brideStatus: brideManglik,
      verdict: "Auspicious Non-Manglik Alignment: Both individuals are free from planetary Mars afflictions.",
    };
  }

  return {
    isCompatible: false,
    groomStatus: groomManglik,
    brideStatus: brideManglik,
    verdict: "Partial Manglik Alignment: One partner is Manglik. Planetary pacification or Kumbh Vivah suggested.",
    remedyRecommendation: "Chanting Hanuman Chalisa or performing Manglik Shanti Puja before nuptials brings peace.",
  };
}

/**
 * MAIN MATCHING FUNCTION
 * Computes the full 36 Gunas and returns a complete, structured analysis.
 */
export function calculateVedicKundliMatch(
  groom: AstrologicalProfile,
  bride: AstrologicalProfile
): KundliMatchingResult {
  const gRashi = groom.rashi in RASHI_DATA ? groom.rashi : "Mesha";
  const bRashi = bride.rashi in RASHI_DATA ? bride.rashi : "Kanya";
  const gNak = groom.nakshatra in NAKSHATRA_DATA ? groom.nakshatra : "Ashwini";
  const bNak = bride.nakshatra in NAKSHATRA_DATA ? bride.nakshatra : "Rohini";

  const varna = calculateVarna(gRashi, bRashi);
  const vashya = calculateVashya(gRashi, bRashi);
  const tara = calculateTara(gNak, bNak);
  const yoni = calculateYoni(gNak, bNak);
  const grahaMaitri = calculateGrahaMaitri(gRashi, bRashi);
  const gana = calculateGana(gNak, bNak);
  const bhakoot = calculateBhakoot(gRashi, bRashi);
  const nadi = calculateNadi(gNak, bNak, gRashi, bRashi);
  const manglikComp = analyzeManglik(groom.manglik, bride.manglik);

  const kootas: KootaScore[] = [
    {
      koota: "Varna",
      name: "Work & Spiritual Ego (1 Guna)",
      maxScore: 1,
      obtainedScore: varna.score,
      area: "Spiritual Harmony",
      description: varna.desc,
      verdict: varna.score === 1 ? "Excellent" : "Average",
    },
    {
      koota: "Vashya",
      name: "Mutual Attraction & Dominance (2 Gunas)",
      maxScore: 2,
      obtainedScore: vashya.score,
      area: "Magnetic Bonding",
      description: vashya.desc,
      verdict: vashya.score >= 1.5 ? "Excellent" : vashya.score >= 1 ? "Good" : "Average",
    },
    {
      koota: "Tara",
      name: "Destiny, Health & Longevity (3 Gunas)",
      maxScore: 3,
      obtainedScore: tara.score,
      area: "Health & Fortune",
      description: tara.desc,
      verdict: tara.score === 3 ? "Excellent" : tara.score >= 1.5 ? "Good" : "Dosha / Concern",
    },
    {
      koota: "Yoni",
      name: "Physical & Biological Intimacy (4 Gunas)",
      maxScore: 4,
      obtainedScore: yoni.score,
      area: "Biological Chemistry",
      description: yoni.desc,
      verdict: yoni.score >= 3 ? "Excellent" : yoni.score >= 2 ? "Good" : "Dosha / Concern",
    },
    {
      koota: "Graha Maitri",
      name: "Psychological Rapport & Friendship (5 Gunas)",
      maxScore: 5,
      obtainedScore: grahaMaitri.score,
      area: "Mental Compassion",
      description: grahaMaitri.desc,
      verdict: grahaMaitri.score >= 4 ? "Excellent" : grahaMaitri.score >= 3 ? "Good" : "Dosha / Concern",
    },
    {
      koota: "Gana",
      name: "Temperament & Behavioral Traits (6 Gunas)",
      maxScore: 6,
      obtainedScore: gana.score,
      area: "Temperamental Balance",
      description: gana.desc,
      verdict: gana.score >= 5 ? "Excellent" : gana.score >= 1 ? "Average" : "Dosha / Concern",
    },
    {
      koota: "Bhakoot",
      name: "Love, Wealth & Family Growth (7 Gunas)",
      maxScore: 7,
      obtainedScore: bhakoot.score,
      area: "Prosperity & Bliss",
      description: bhakoot.desc,
      verdict: bhakoot.score === 7 ? "Excellent" : "Dosha / Concern",
    },
    {
      koota: "Nadi",
      name: "Genetic Lineage & Progeny (8 Gunas)",
      maxScore: 8,
      obtainedScore: nadi.score,
      area: "Genetic Health",
      description: nadi.desc,
      verdict: nadi.score === 8 ? "Excellent" : "Dosha / Concern",
    },
  ];

  const totalScore = kootas.reduce((acc, curr) => acc + curr.obtainedScore, 0);
  const percentage = Math.round((totalScore / 36) * 100);

  let verdictTitle = "";
  let verdictCategory: "Uttam" | "Madhyam" | "Sadharan" | "Anukul" = "Uttam";
  let verdictSummary = "";
  let recommendation = "";

  if (totalScore >= 28) {
    verdictTitle = "Uttam Guna Milan (Highly Auspicious Match)";
    verdictCategory = "Uttam";
    verdictSummary =
      "Exceptional Vedic alignment. Deep mutual respect, flourishing financial growth, and enduring domestic peace are predicted.";
    recommendation =
      "Heartiest congratulations! This alliance is strongly recommended by Vedic astrology principles for lifetime companionship.";
  } else if (totalScore >= 21) {
    verdictTitle = "Madhyam Guna Milan (Favorable & Harmonious)";
    verdictCategory = "Madhyam";
    verdictSummary =
      "Above average Vedic compatibility. The couple enjoys strong shared values and affectionate partnership.";
    recommendation =
      "Very auspicious alliance. Mutual understanding and elder blessings will nurture lifelong happiness.";
  } else if (totalScore >= 18) {
    verdictTitle = "Sadharan Guna Milan (Acceptable Alliance)";
    verdictCategory = "Sadharan";
    verdictSummary =
      "Meets the minimum Vedic threshold of 18 Gunas. Minor adjustments in communication styles will ensure harmony.";
    recommendation =
      "The match is acceptable. Complementing each other's strengths and mutual dialogue will bring fulfillment.";
  } else {
    verdictTitle = "Alpa Guna Milan (Astrological Consultation Advised)";
    verdictCategory = "Anukul";
    verdictSummary =
      "Scores below 18 Gunas. Vedic principles suggest comprehensive horoscope assessment and astrological remedies before marriage.";
    recommendation =
      "Astrological consultation recommended to review planetary dashas and perform recommended propitiatory rituals.";
  }

  const reportId = `VKL-ASTRO-${Date.now().toString(36).toUpperCase()}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  return {
    groom: { ...groom, rashi: gRashi, nakshatra: gNak },
    bride: { ...bride, rashi: bRashi, nakshatra: bNak },
    totalScore,
    maxScore: 36,
    percentage,
    verdictTitle,
    verdictCategory,
    verdictSummary,
    kootas,
    doshas: {
      nadiDosha: {
        hasDosha: nadi.hasDosha,
        isCancelled: nadi.isCancelled,
        cancellationReason: nadi.cancellationReason,
        description: nadi.desc,
      },
      bhakootDosha: {
        hasDosha: bhakoot.hasDosha,
        isCancelled: bhakoot.isCancelled,
        cancellationReason: bhakoot.cancellationReason,
        description: bhakoot.desc,
      },
      ganaDosha: {
        hasDosha: gana.hasDosha,
        description: gana.desc,
      },
      manglikCompatibility: manglikComp,
    },
    recommendation,
    generatedAt: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    reportId,
  };
}
