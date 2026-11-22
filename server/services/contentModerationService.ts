/**
 * Content Moderation, Safe Browsing & Anti-Scam Keyword Engine
 * Integrates:
 * 1. Google Perspective API (Free AI Toxicity & Harassment Filter + Local High-Precision Fallback)
 * 2. Google Safe Browsing API (Anti-Phishing & Malware Link Protection)
 * 3. Chat Keyword & Financial Scam Alert System (Real-time detection of UPI, money requests, OTP phishing)
 */

export interface ToxicityResult {
  isToxic: boolean;
  score: number;
  flaggedCategories: string[];
  reason?: string;
}

export interface LinkSafetyResult {
  isSafe: boolean;
  detectedUrls: string[];
  flaggedUrls: string[];
  reason?: string;
}

export interface ScamAlertResult {
  isScamAlert: boolean;
  category?: "financial_solicitation" | "otp_phishing" | "off_platform_diversion";
  matchedKeywords: string[];
  severity: "low" | "medium" | "high" | "critical";
  safetyWarning?: string;
}

class ContentModerationService {
  private perspectiveApiKey?: string;
  private safeBrowsingApiKey?: string;

  // Multi-lingual profanity & harassment patterns (English + Romanized Hindi/Hinglish)
  private toxicityPatterns: { pattern: RegExp; category: string }[] = [
    { pattern: /\b(chutiya|bhenchod|madarchod|harami|bhosdike|gandu|kameena|saale)\b/i, category: "profanity_hinglish" },
    { pattern: /\b(fuck|bitch|bastard|asshole|whore|slut|cunt|dick|pussy)\b/i, category: "profanity_english" },
    { pattern: /\b(kill yourself|die|murder|acid attack|rape|blackmail|destroy you)\b/i, category: "threat_violence" },
    { pattern: /\b(nude|send nudes|naked|sex video|call girl|rate per night|escort)\b/i, category: "sexual_harassment" },
  ];

  // Financial Scam keywords
  private financialKeywords = [
    "paise bhejo",
    "paise transfer",
    "paise chahiye",
    "paise send",
    "send money",
    "transfer money",
    "google pay",
    "gpay",
    "phonepe",
    "paytm",
    "upi id",
    "bhim upi",
    "emergency money",
    "hospital bill",
    "help money",
    "urgent cash",
    "crypto",
    "bitcoin",
    "forex trading",
    "daily return",
    "double money",
  ];

  // OTP & Credential Phishing keywords
  private otpKeywords = [
    "otp batao",
    "otp send",
    "otp share",
    "one time password",
    "sms code",
    "verification code",
    "atm pin",
    "bank otp",
    "card number",
    "cvv",
  ];

  // Off-platform diversion keywords
  private offPlatformKeywords = [
    "whatsapp par aao",
    "whatsapp pe baat",
    "come on whatsapp",
    "chat on telegram",
    "telegram id",
    "insta id",
  ];

  // Suspicious TLDs and URL shorteners
  private suspiciousTlds = [".xyz", ".top", ".click", ".cam", ".ru", ".link", ".buzz", ".work"];
  private urlShorteners = ["bit.ly", "tinyurl.com", "cutt.ly", "is.gd", "t.co", "rb.gy"];

  constructor() {
    this.perspectiveApiKey = process.env.PERSPECTIVE_API_KEY;
    this.safeBrowsingApiKey = process.env.GOOGLE_SAFE_BROWSING_KEY;
  }

  /**
   * 1. GOOGLE PERSPECTIVE API & TOXICITY DETECTION
   */
  public async checkToxicity(text: string): Promise<ToxicityResult> {
    if (!text || text.trim().length === 0) {
      return { isToxic: false, score: 0, flaggedCategories: [] };
    }

    const cleanText = text.trim();

    // 1A. Check Perspective API if key configured
    if (this.perspectiveApiKey) {
      try {
        const response = await fetch(
          `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${this.perspectiveApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              comment: { text: cleanText },
              languages: ["en", "hi"],
              requestedAttributes: {
                TOXICITY: {},
                SEVERE_TOXICITY: {},
                INSULT: {},
                PROFANITY: {},
                THREAT: {},
                SEXUALLY_EXPLICIT: {},
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const scores = data.attributeScores || {};
          const toxicityScore = scores.TOXICITY?.summaryScore?.value || 0;
          const threatScore = scores.THREAT?.summaryScore?.value || 0;
          const severeScore = scores.SEVERE_TOXICITY?.summaryScore?.value || 0;
          const maxScore = Math.max(toxicityScore, threatScore, severeScore);

          if (maxScore > 0.7) {
            return {
              isToxic: true,
              score: maxScore,
              flaggedCategories: ["perspective_api_flagged"],
              reason: "Message flagged by Google Perspective AI: Content contains abusive, insulting, or inappropriate language.",
            };
          }
        }
      } catch (err) {
        console.warn("[Perspective API] Fallback to local heuristic engine:", err);
      }
    }

    // 1B. Built-in Multi-lingual Profanity & Harassment Engine
    const matchedCategories: string[] = [];
    for (const item of this.toxicityPatterns) {
      if (item.pattern.test(cleanText)) {
        matchedCategories.push(item.category);
      }
    }

    if (matchedCategories.length > 0) {
      return {
        isToxic: true,
        score: 0.95,
        flaggedCategories: matchedCategories,
        reason: "Message rejected: Inappropriate, abusive, or harassing words detected. Please maintain respectful communication.",
      };
    }

    return { isToxic: false, score: 0, flaggedCategories: [] };
  }

  /**
   * 2. GOOGLE SAFE BROWSING & MALICIOUS LINK SCANNER
   */
  public async checkLinks(text: string): Promise<LinkSafetyResult> {
    if (!text) {
      return { isSafe: true, detectedUrls: [], flaggedUrls: [] };
    }

    // Extract all URLs
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(\b[a-zA-Z0-9-]+\.(?:com|org|net|in|io|xyz|top|click|link|info)[^\s]*\b)/gi;
    const matches = text.match(urlRegex) || [];
    const detectedUrls = Array.from(new Set(matches));

    if (detectedUrls.length === 0) {
      return { isSafe: true, detectedUrls: [], flaggedUrls: [] };
    }

    const flaggedUrls: string[] = [];

    // 2A. Check Google Safe Browsing API if key configured
    if (this.safeBrowsingApiKey && detectedUrls.length > 0) {
      try {
        const response = await fetch(
          `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${this.safeBrowsingApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              client: { clientId: "vivahkarlo-safety", clientVersion: "2.0.0" },
              threatInfo: {
                threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                platformTypes: ["ANY_PLATFORM"],
                threatEntryTypes: ["URL"],
                threatEntries: detectedUrls.map((url) => ({ url })),
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.matches && data.matches.length > 0) {
            for (const match of data.matches) {
              flaggedUrls.push(match.threat?.url || match.threatEntry?.url);
            }
          }
        }
      } catch (err) {
        console.warn("[Safe Browsing] Fallback to local heuristic engine:", err);
      }
    }

    // 2B. Built-in Phishing, Raw IP, and URL Shortener Defense
    for (const rawUrl of detectedUrls) {
      const lower = rawUrl.toLowerCase();

      // Check Raw IP Addresses (e.g., http://192.168.1.1/scam)
      if (/(https?:\/\/)?\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(lower)) {
        flaggedUrls.push(rawUrl);
        continue;
      }

      // Check Suspicious TLDs
      for (const tld of this.suspiciousTlds) {
        if (lower.includes(tld)) {
          flaggedUrls.push(rawUrl);
          break;
        }
      }

      // Check URL Masking Shorteners
      for (const shortener of this.urlShorteners) {
        if (lower.includes(shortener)) {
          flaggedUrls.push(rawUrl);
          break;
        }
      }
    }

    if (flaggedUrls.length > 0) {
      return {
        isSafe: false,
        detectedUrls,
        flaggedUrls: Array.from(new Set(flaggedUrls)),
        reason: "Message blocked: Potentially unsafe link, URL shortener, or unverified external link detected for safety.",
      };
    }

    return { isSafe: true, detectedUrls, flaggedUrls: [] };
  }

  /**
   * 3. CHAT KEYWORD & FINANCIAL SCAM ALERT SYSTEM
   */
  public detectScamKeywords(
    text: string,
    isSenderVerified: boolean = false
  ): ScamAlertResult {
    if (!text) {
      return { isScamAlert: false, matchedKeywords: [], severity: "low" };
    }

    const lower = text.toLowerCase();
    const matchedKeywords: string[] = [];
    let category: ScamAlertResult["category"];
    let severity: ScamAlertResult["severity"] = "low";

    // 1. Check Financial Solicitation
    for (const kw of this.financialKeywords) {
      if (lower.includes(kw)) {
        matchedKeywords.push(kw);
        category = "financial_solicitation";
        severity = isSenderVerified ? "medium" : "high";
      }
    }

    // 2. Check OTP Phishing (Critical Severity)
    for (const kw of this.otpKeywords) {
      if (lower.includes(kw)) {
        matchedKeywords.push(kw);
        category = "otp_phishing";
        severity = "critical";
      }
    }

    // 3. Check Off-Platform Diversion
    if (!category) {
      for (const kw of this.offPlatformKeywords) {
        if (lower.includes(kw)) {
          matchedKeywords.push(kw);
          category = "off_platform_diversion";
          severity = "medium";
        }
      }
    }

    if (matchedKeywords.length > 0) {
      let safetyWarning = "⚠️ Safety Advisory: Never send money, gifts, or cryptocurrency to anyone met on matrimonial platforms.";
      if (category === "otp_phishing") {
        safetyWarning = "🚨 Critical Security Alert: Never share your OTP, password, or banking PIN. Official Vivah Kar Lo staff will NEVER ask for your OTP.";
      } else if (category === "off_platform_diversion") {
        safetyWarning = "🛡️ Trust & Safety Tip: For your protection, we recommend continuing conversations on Vivah Kar Lo until mutual trust and ID verification are established.";
      }

      return {
        isScamAlert: true,
        category,
        matchedKeywords,
        severity,
        safetyWarning,
      };
    }

    return {
      isScamAlert: false,
      matchedKeywords: [],
      severity: "low",
    };
  }
}

export const contentModerationService = new ContentModerationService();
