/**
 * Device Fingerprinting & Multi-Account Prevention Service
 * Tracks hardware / browser fingerprints to prevent mass fake account creation.
 */

export interface DeviceRegistryEntry {
  fingerprint: string;
  userIds: string[];
  registeredDates: string[];
  ipAddresses: string[];
  isBanned: boolean;
  bannedReason?: string;
  lastSeenAt: string;
}

class DeviceFingerprintService {
  private devices: Map<string, DeviceRegistryEntry>;
  private readonly MAX_DAILY_REGISTRATIONS = 3;
  private readonly MAX_LIFETIME_REGISTRATIONS = 6;

  constructor() {
    this.devices = new Map();
  }

  /**
   * Checks whether a device fingerprint is permitted to register a new account.
   */
  public checkDeviceAllowed(
    fingerprint?: string,
    ipAddress?: string
  ): { allowed: boolean; error?: string; accountCount: number } {
    if (!fingerprint) {
      return { allowed: true, accountCount: 0 };
    }

    const device = this.devices.get(fingerprint);
    if (!device) {
      return { allowed: true, accountCount: 0 };
    }

    // 1. Check if device has been banned
    if (device.isBanned) {
      return {
        allowed: false,
        accountCount: device.userIds.length,
        error: `Registration blocked. This device has been quarantined due to prior violations of Trust & Safety policies.`,
      };
    }

    // 2. Check 24-hour velocity limit
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentRegistrations = device.registeredDates.filter(
      (d) => new Date(d).getTime() > oneDayAgo
    ).length;

    if (recentRegistrations >= this.MAX_DAILY_REGISTRATIONS) {
      return {
        allowed: false,
        accountCount: device.userIds.length,
        error: `Daily registration limit reached for this device (${recentRegistrations} accounts in 24h). To prevent automated Sybil spam, please try again tomorrow or contact support.`,
      };
    }

    // 3. Check lifetime accounts from single device
    if (device.userIds.length >= this.MAX_LIFETIME_REGISTRATIONS) {
      return {
        allowed: false,
        accountCount: device.userIds.length,
        error: `Maximum allowed profiles limit reached for this hardware device. Multiple account farming is prohibited on Vivah Kar Lo.`,
      };
    }

    return { allowed: true, accountCount: device.userIds.length };
  }

  /**
   * Records a successfully registered account against the device fingerprint.
   */
  public recordDeviceRegistration(
    fingerprint: string,
    userId: string,
    ipAddress: string = "127.0.0.1"
  ): void {
    if (!fingerprint) return;

    const now = new Date().toISOString();
    let device = this.devices.get(fingerprint);

    if (!device) {
      device = {
        fingerprint,
        userIds: [userId],
        registeredDates: [now],
        ipAddresses: [ipAddress],
        isBanned: false,
        lastSeenAt: now,
      };
      this.devices.set(fingerprint, device);
    } else {
      if (!device.userIds.includes(userId)) {
        device.userIds.push(userId);
      }
      device.registeredDates.push(now);
      if (!device.ipAddresses.includes(ipAddress)) {
        device.ipAddresses.push(ipAddress);
      }
      device.lastSeenAt = now;
    }
  }

  /**
   * Bans a device fingerprint when associated profiles are confirmed fake or scam.
   */
  public banDevice(fingerprint: string, reason: string): void {
    const device = this.devices.get(fingerprint);
    if (device) {
      device.isBanned = true;
      device.bannedReason = reason;
    } else {
      this.devices.set(fingerprint, {
        fingerprint,
        userIds: [],
        registeredDates: [],
        ipAddresses: [],
        isBanned: true,
        bannedReason: reason,
        lastSeenAt: new Date().toISOString(),
      });
    }
  }

  public getDevice(fingerprint: string): DeviceRegistryEntry | undefined {
    return this.devices.get(fingerprint);
  }

  public getAllDevices(): DeviceRegistryEntry[] {
    return Array.from(this.devices.values());
  }
}

export const deviceFingerprintService = new DeviceFingerprintService();
