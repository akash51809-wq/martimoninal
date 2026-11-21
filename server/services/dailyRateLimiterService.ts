/**
 * Anti-Spam & Anti-Bot Daily Rate Limiting Service
 * Protects platform integrity by capping daily Interest sends and Chat messages.
 * Prevents automated scrapers, bots, and scammers from blasting hundreds of users.
 */

interface DailyUsageRecord {
  date: string; // YYYY-MM-DD
  interestsCount: number;
  messagesCount: number;
}

// In-memory daily usage store keyed by userId
const dailyUsageStore = new Map<string, DailyUsageRecord>();

export const FREE_DAILY_INTEREST_LIMIT = 15;
export const VIP_DAILY_INTEREST_LIMIT = 60;

export const FREE_DAILY_MESSAGE_LIMIT = 30;
export const VIP_DAILY_MESSAGE_LIMIT = 150;

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getOrResetUsage(userId: string): DailyUsageRecord {
  const today = getTodayKey();
  const existing = dailyUsageStore.get(userId);

  if (!existing || existing.date !== today) {
    const freshRecord: DailyUsageRecord = {
      date: today,
      interestsCount: 0,
      messagesCount: 0,
    };
    dailyUsageStore.set(userId, freshRecord);
    return freshRecord;
  }

  return existing;
}

export const dailyRateLimiterService = {
  /**
   * Check and consume one interest quota slot
   */
  checkAndConsumeInterest(
    userId: string,
    isVip: boolean
  ): { allowed: boolean; remaining: number; limit: number; error?: string } {
    const record = getOrResetUsage(userId);
    const limit = isVip ? VIP_DAILY_INTEREST_LIMIT : FREE_DAILY_INTEREST_LIMIT;

    if (record.interestsCount >= limit) {
      return {
        allowed: false,
        remaining: 0,
        limit,
        error: `Daily limit of ${limit} interests reached. Anti-bot safety shield is active. ${
          !isVip ? "Upgrade to VIP for 60 daily interests or try again tomorrow." : "Please try again tomorrow."
        }`,
      };
    }

    record.interestsCount += 1;
    const remaining = Math.max(0, limit - record.interestsCount);

    return {
      allowed: true,
      remaining,
      limit,
    };
  },

  /**
   * Check and consume one message quota slot
   */
  checkAndConsumeMessage(
    userId: string,
    isVip: boolean
  ): { allowed: boolean; remaining: number; limit: number; error?: string } {
    const record = getOrResetUsage(userId);
    const limit = isVip ? VIP_DAILY_MESSAGE_LIMIT : FREE_DAILY_MESSAGE_LIMIT;

    if (record.messagesCount >= limit) {
      return {
        allowed: false,
        remaining: 0,
        limit,
        error: `Daily message cap of ${limit} messages reached. Anti-spam safety protocol active. Please try again tomorrow.`,
      };
    }

    record.messagesCount += 1;
    const remaining = Math.max(0, limit - record.messagesCount);

    return {
      allowed: true,
      remaining,
      limit,
    };
  },

  /**
   * Get current quota status for dashboard UI
   */
  getQuotaStatus(
    userId: string,
    isVip: boolean
  ): {
    interestsUsed: number;
    interestsRemaining: number;
    interestsLimit: number;
    messagesUsed: number;
    messagesRemaining: number;
    messagesLimit: number;
    resetsInHours: number;
  } {
    const record = getOrResetUsage(userId);
    const interestLimit = isVip ? VIP_DAILY_INTEREST_LIMIT : FREE_DAILY_INTEREST_LIMIT;
    const messageLimit = isVip ? VIP_DAILY_MESSAGE_LIMIT : FREE_DAILY_MESSAGE_LIMIT;

    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);
    const resetsInHours = Math.max(1, Math.round((endOfDay.getTime() - now.getTime()) / (1000 * 3600)));

    return {
      interestsUsed: record.interestsCount,
      interestsRemaining: Math.max(0, interestLimit - record.interestsCount),
      interestsLimit: interestLimit,
      messagesUsed: record.messagesCount,
      messagesRemaining: Math.max(0, messageLimit - record.messagesCount),
      messagesLimit: messageLimit,
      resetsInHours,
    };
  },
};
