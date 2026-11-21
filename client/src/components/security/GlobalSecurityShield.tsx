import React, { useEffect, useState } from "react";
import { ShieldCheck, EyeOff } from "lucide-react";

interface GlobalSecurityShieldProps {
  enabled?: boolean;
}

/**
 * Global Security Shield Component
 * Enforces Anti-Right Click, Anti-Drag, Anti-Print, Screenshot Interception,
 * and Mobile WebView FLAG_SECURE bridging.
 */
export const GlobalSecurityShield: React.FC<GlobalSecurityShieldProps> = ({
  enabled = true,
}) => {
  const [shieldActive, setShieldActive] = useState(false);
  const [shieldMessage, setShieldMessage] = useState("");

  useEffect(() => {
    if (!enabled) return;

    // 1. Android/iOS Webview FLAG_SECURE Bridge Invocation
    try {
      const win = window as any;
      if (win.AndroidBridge && typeof win.AndroidBridge.setFlagSecure === "function") {
        win.AndroidBridge.setFlagSecure(true);
      }
      if (
        win.webkit &&
        win.webkit.messageHandlers &&
        win.webkit.messageHandlers.flagSecure
      ) {
        win.webkit.messageHandlers.flagSecure.postMessage({ enable: true, flagSecure: true });
      }
    } catch {
      // Running inside standard browser
    }

    // 2. Global Right-Click Prevention on Images and Protected Areas
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isImage = target.tagName === "IMG" || target.closest(".protected-photo") || target.closest("[data-protected-image]");
      if (isImage) {
        e.preventDefault();
        e.stopPropagation();
        setShieldMessage("Right-click image saving is disabled for member privacy.");
        setShieldActive(true);
        setTimeout(() => setShieldActive(false), 2200);
      }
    };

    // 3. Global Drag-Start Prevention for Images
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "IMG" || target.closest(".protected-photo"))) {
        e.preventDefault();
      }
    };

    // 4. Keyboard Shortcuts Interception (PrintScreen, Ctrl+P, Ctrl+S)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Intercept PrintScreen
      if (e.key === "PrintScreen" || e.keyCode === 44) {
        setShieldMessage("Screen capture guard active. Profile photo shielded.");
        setShieldActive(true);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText("Vivah Kar Lo - Screenshot Protected Matrimonial Profile");
        }
        setTimeout(() => setShieldActive(false), 2500);
      }

      // Intercept Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
        const inDashboardOrProfile = window.location.pathname.includes("/dashboard") || window.location.pathname.includes("/profile");
        if (inDashboardOrProfile) {
          e.preventDefault();
          setShieldMessage("Direct page printing disabled. Please use official verified Biodata PDF download.");
          setShieldActive(true);
          setTimeout(() => setShieldActive(false), 2500);
        }
      }
    };

    document.addEventListener("contextmenu", handleContextMenu, { capture: true });
    document.addEventListener("dragstart", handleDragStart, { capture: true });
    window.addEventListener("keyup", handleKeyDown, { capture: true });
    window.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, { capture: true });
      document.removeEventListener("dragstart", handleDragStart, { capture: true });
      window.removeEventListener("keyup", handleKeyDown, { capture: true });
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [enabled]);

  if (!shieldActive) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[9999] max-w-sm rounded-2xl bg-[#2B120C]/95 text-amber-100 p-4 shadow-2xl border border-amber-300/40 backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3"
    >
      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-300/30 flex items-center justify-center text-amber-300 shrink-0">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
          <EyeOff className="w-3.5 h-3.5 text-[#EA580C]" />
          Vivah Photo Shield Active
        </p>
        <p className="text-[12px] text-amber-200/90 mt-0.5 leading-snug">
          {shieldMessage}
        </p>
      </div>
    </div>
  );
};
