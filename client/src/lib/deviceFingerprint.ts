/**
 * Client-Side Device Fingerprinting Utility
 * Generates a stable, high-entropy hardware & browser identifier
 * to prevent automated Sybil attacks and multi-account creation.
 */

export interface DeviceMetadata {
  fingerprint: string;
  userAgent: string;
  screenResolution: string;
  colorDepth: number;
  timezone: string;
  language: string;
  hardwareConcurrency: number;
  deviceMemory?: number;
  webglRenderer?: string;
}

const STORAGE_KEY = "vivah_device_id_v2";

/**
 * Fast string hashing algorithm (MurmurHash3 / FNV-1a hybrid for 64-bit hex)
 */
function hashComponents(str: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const part1 = (h1 >>> 0).toString(16).padStart(8, "0");
  const part2 = (h2 >>> 0).toString(16).padStart(8, "0");

  // Re-hash for 32 bytes (64 hex characters)
  let h3 = 0x85ebca6b;
  let h4 = 0xc2b2ae35;
  for (let i = str.length - 1; i >= 0; i--) {
    const ch = str.charCodeAt(i);
    h3 = Math.imul(h3 ^ ch, 2654435761);
    h4 = Math.imul(h4 ^ ch, 1597334677);
  }
  const part3 = (h3 >>> 0).toString(16).padStart(8, "0");
  const part4 = (h4 >>> 0).toString(16).padStart(8, "0");

  return `${part1}${part2}${part3}${part4}`;
}

/**
 * Collects Canvas 2D render hash
 */
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "canvas-none";

    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial', sans-serif";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("VivahKarLo,🛡️2026", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("Trust&Safety", 4, 17);
    return canvas.toDataURL().slice(-50);
  } catch {
    return "canvas-err";
  }
}

/**
 * Collects WebGL graphics driver vendor and renderer
 */
function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return "webgl-none";
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return "webgl-no-debug";
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "";
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
    return `${vendor}__${renderer}`;
  } catch {
    return "webgl-err";
  }
}

/**
 * Returns comprehensive device metadata and stable fingerprint string
 */
export async function getDeviceFingerprint(): Promise<string> {
  try {
    // Check local storage persistent anchor
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached && cached.length >= 16) {
      return cached;
    }
  } catch {
    // LocalStorage restricted or disabled
  }

  // Collect entropy components
  const components: string[] = [
    navigator.userAgent || "ua-none",
    `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth || 24}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone || "tz-none",
    String(new Date().getTimezoneOffset()),
    navigator.language || "lang-none",
    String(navigator.hardwareConcurrency || 4),
    String((navigator as any).deviceMemory || 8),
    getCanvasFingerprint(),
    getWebGLFingerprint(),
  ];

  const rawString = components.join("###");
  const computedFingerprint = `dfp_${hashComponents(rawString)}`;

  try {
    localStorage.setItem(STORAGE_KEY, computedFingerprint);
  } catch {
    // Ignore storage quota or access errors
  }

  return computedFingerprint;
}

export async function getDetailedDeviceMetadata(): Promise<DeviceMetadata> {
  const fingerprint = await getDeviceFingerprint();
  return {
    fingerprint,
    userAgent: navigator.userAgent || "Unknown",
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    colorDepth: window.screen.colorDepth || 24,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    language: navigator.language || "en",
    hardwareConcurrency: navigator.hardwareConcurrency || 2,
    deviceMemory: (navigator as any).deviceMemory,
    webglRenderer: getWebGLFingerprint(),
  };
}
