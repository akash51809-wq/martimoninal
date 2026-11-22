/**
 * Disposable & Temporary Email Blocker Service
 * Powered by open-source 'disposable-email-domains' (121,000+ domains)
 * Prevents registration with 10-minute mail, burner, guerrilla, and throwaway inboxes.
 */

import { createRequire } from "module";

const require = createRequire(import.meta.url);
const disposableDomainsList: string[] = require("disposable-email-domains");

class DisposableEmailService {
  private disposableSet: Set<string>;
  private knownPatterns: RegExp[];
  private trustedDomains: Set<string>;

  constructor() {
    // Initialize in-memory O(1) lookup set
    const domainArray = Array.isArray(disposableDomainsList)
      ? disposableDomainsList
      : [];
    this.disposableSet = new Set(domainArray.map((d: string) => d.toLowerCase().trim()));

    // Common disposable prefixes and keywords
    this.knownPatterns = [
      /10minute/i,
      /tempmail/i,
      /guerrillamail/i,
      /dispostable/i,
      /throwaway/i,
      /sharklasers/i,
      /mailinator/i,
      /yopmail/i,
      /fakemail/i,
      /trashmail/i,
      /getnada/i,
      /mohmal/i,
      /crazymailing/i,
      /mytemp/i,
    ];

    // High-reputation whitelist that should never be falsely blocked
    this.trustedDomains = new Set([
      "gmail.com",
      "googlemail.com",
      "yahoo.com",
      "yahoo.in",
      "yahoo.co.in",
      "outlook.com",
      "hotmail.com",
      "live.com",
      "icloud.com",
      "proton.me",
      "protonmail.com",
      "rediffmail.com",
      "zoho.com",
      "aol.com",
    ]);
  }

  /**
   * Evaluates whether an email address belongs to a disposable or throwaway domain.
   */
  public isDisposable(email: string): { isDisposable: boolean; domain: string; reason?: string } {
    if (!email || !email.includes("@")) {
      return { isDisposable: false, domain: "" };
    }

    const domain = email.split("@")[1]?.toLowerCase().trim() || "";
    if (!domain) {
      return { isDisposable: false, domain: "" };
    }

    // Never block trusted reputable domains
    if (this.trustedDomains.has(domain)) {
      return { isDisposable: false, domain };
    }

    // 1. Direct O(1) match in 121,000+ disposable domain database
    if (this.disposableSet.has(domain)) {
      return {
        isDisposable: true,
        domain,
        reason: "Domain is listed in the global disposable email blacklist.",
      };
    }

    // 2. Check parent domain if it is a subdomain (e.g. abc.mailinator.com -> mailinator.com)
    const domainParts = domain.split(".");
    if (domainParts.length > 2) {
      const parentDomain = domainParts.slice(-2).join(".");
      if (this.disposableSet.has(parentDomain)) {
        return {
          isDisposable: true,
          domain,
          reason: `Parent domain (${parentDomain}) is a known disposable provider.`,
        };
      }
    }

    // 3. Heuristic pattern checks
    for (const pattern of this.knownPatterns) {
      if (pattern.test(domain)) {
        return {
          isDisposable: true,
          domain,
          reason: "Domain name contains known temporary mailbox keywords.",
        };
      }
    }

    return { isDisposable: false, domain };
  }
}

export const disposableEmailService = new DisposableEmailService();
