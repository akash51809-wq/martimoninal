export interface DlpCheckResult {
  isBlocked: boolean;
  reason?: string;
  matchedPattern?: string;
}

const NUMBER_WORDS: Record<string, string> = {
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  shunya: "0",
  ek: "1",
  do: "2",
  teen: "3",
  chaar: "4",
  paanch: "5",
  chhe: "6",
  saat: "7",
  aath: "8",
  nau: "9",
};

export function analyzeMessageForDlp(rawText: string): DlpCheckResult {
  if (!rawText || !rawText.trim()) {
    return { isBlocked: false };
  }

  const text = rawText.trim().toLowerCase();

  // 1. Direct Email Address Detection
  const emailRegex = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i;
  if (emailRegex.test(text)) {
    return {
      isBlocked: true,
      reason: "Sharing email addresses in chat is prohibited. Please request official Contact Access.",
      matchedPattern: "Email Address",
    };
  }

  // 2. Disguised Email Detection
  const disguisedEmailRegex = /\b[a-z0-9._-]+\s*(?:at|@)\s*[a-z0-9.-]+\s*(?:dot|\.)\s*(?:com|in|org|net|co|io)\b/i;
  if (disguisedEmailRegex.test(text)) {
    return {
      isBlocked: true,
      reason: "Sharing disguised email addresses in chat is prohibited.",
      matchedPattern: "Disguised Email",
    };
  }

  // 3. Social Media & Messaging Keywords
  const socialPlatforms = [
    /\b(?:whatsapp|whats\s*app|wa\.me|wa\s*me)\b/i,
    /\b(?:instagram|insta|ig\s*handle)\b/i,
    /\b(?:telegram|t\.me|tg\s*channel)\b/i,
    /\b(?:facebook|fb\.com|snapchat|snap\s*id)\b/i,
  ];

  for (const regex of socialPlatforms) {
    if (regex.test(text)) {
      return {
        isBlocked: true,
        reason: "Sharing WhatsApp, Instagram, or social media handles is prohibited to protect family privacy.",
        matchedPattern: "Social Handle / WhatsApp",
      };
    }
  }

  // 4. External URLs & Web Links Detection
  const urlRegex = /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/i;
  if (urlRegex.test(text)) {
    return {
      isBlocked: true,
      reason: "Sharing external web links or URLs in chat is prohibited.",
      matchedPattern: "External URL",
    };
  }

  // 5. Direct Phone / Mobile Number Detection
  const directPhoneRegex = /(?:(?:\+|0{0,2})91[\s\-]*)?[6789]\d{9}\b/;
  if (directPhoneRegex.test(text)) {
    return {
      isBlocked: true,
      reason: "Sharing mobile or phone numbers in chat is strictly prohibited. Upgrade to VIP or request Contact Access.",
      matchedPattern: "Direct Phone Number",
    };
  }

  // 6. Spaced or Punctuated Digits Detection
  const digitsOnly = text.replace(/\D/g, "");
  if (digitsOnly.length >= 10) {
    const spacedDigitsRegex = /(?:\d[\s\.\-_,\/\\~*|]{0,3}){9,}\d/;
    if (spacedDigitsRegex.test(text)) {
      return {
        isBlocked: true,
        reason: "Disguised phone numbers using spaces or special characters are blocked by the safety firewall.",
        matchedPattern: "Spaced Digits",
      };
    }
  }

  // 7. Worded Digits Detection
  const words = text.split(/[\s,.\-_/]+/);
  let consecutiveNumberWords = 0;
  for (const w of words) {
    if (NUMBER_WORDS[w]) {
      consecutiveNumberWords++;
      if (consecutiveNumberWords >= 7) {
        return {
          isBlocked: true,
          reason: "Spelling out contact numbers in words is prohibited by security policy.",
          matchedPattern: "Worded Number",
        };
      }
    } else {
      consecutiveNumberWords = 0;
    }
  }

  return { isBlocked: false };
}
