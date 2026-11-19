import React, { useEffect, useState } from "react";
import { Lock, ShieldCheck, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WatermarkedProtectedImageProps {
  src: string;
  alt: string;
  profileId?: string;
  viewerUserId?: string;
  isUnlocked?: boolean;
  visibilityMode?: "all" | "accepted_only" | "request_only";
  className?: string;
  aspectRatio?: string;
  onRequestPhotoAccess?: () => void;
  hasRequestedAccess?: boolean;
}

export const WatermarkedProtectedImage: React.FC<WatermarkedProtectedImageProps> = ({
  src,
  alt,
  profileId = "VK-PROT",
  viewerUserId = "USR",
  isUnlocked = true,
  visibilityMode = "all",
  className = "w-full h-full object-cover",
  aspectRatio = "aspect-[4/3]",
  onRequestPhotoAccess,
  hasRequestedAccess = false,
}) => {
  const [screenCaptureShield, setScreenCaptureShield] = useState<boolean>(false);

  // Determine if photo should be blurred based on privacy permission
  const isBlurred = !isUnlocked && visibilityMode !== "all";

  // Anti-Screen Capture / Snipping Tool Blur Detection
  useEffect(() => {
    const handleBlur = () => {
      // Blur image when user switches window or launches external screen capture tools
      setScreenCaptureShield(true);
    };

    const handleFocus = () => {
      setScreenCaptureShield(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Intercept PrintScreen key
      if (e.key === "PrintScreen" || e.keyCode === 44) {
        setScreenCaptureShield(true);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText("Vivah Kar Lo - Screenshot Protected Image");
        }
        setTimeout(() => setScreenCaptureShield(false), 2000);
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("keyup", handleKeyDown);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("keyup", handleKeyDown);
    };
  }, []);

  return (
    <div
      className={`relative overflow-hidden select-none ${aspectRatio} bg-gradient-to-br from-amber-100 to-orange-100`}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
      style={{
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      {/* 1. Underlying Base Image */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        className={`${className} transition-all duration-300 pointer-events-none ${
          isBlurred || screenCaptureShield
            ? "filter blur-2xl scale-110 opacity-75"
            : ""
        }`}
        style={{
          WebkitTouchCallout: "none",
        }}
      />

      {/* 2. Brand & User ID Diagonal Watermark Matrix */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden opacity-35 mix-blend-overlay flex flex-col justify-around py-4"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -35deg,
            transparent,
            transparent 60px,
            rgba(255, 255, 255, 0.08) 60px,
            rgba(255, 255, 255, 0.08) 120px
          )`,
        }}
      >
        <div className="rotate-[-25deg] scale-105 flex flex-col gap-6 text-center whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="text-[11px] sm:text-xs font-black tracking-widest uppercase text-white/70 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            >
              VIVAH KAR LO • CONFIDENTIAL • {profileId} • VIEW: {viewerUserId} • {new Date().toISOString().slice(0, 10)}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Official Brand Seal Badge at Bottom-Right */}
      <div className="absolute bottom-2.5 right-2.5 pointer-events-none flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-amber-200 shadow-sm">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        <span>Vivah Kar Lo Protected</span>
      </div>

      {/* 4. Anti-Save Transparent Glass Shield Overlay */}
      <div
        className="absolute inset-0 z-10 cursor-default bg-transparent"
        onContextMenu={(e) => {
          e.preventDefault();
          return false;
        }}
      />

      {/* 5. Frosted Glass Privacy Lock Overlay when Photo is Private/Blurred */}
      {isBlurred && (
        <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center text-white space-y-2.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-lg">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif-royal text-base font-bold drop-shadow-sm">
              Photo Protected
            </h4>
            <p className="text-[11px] text-amber-100/90 max-w-[200px] mx-auto mt-0.5">
              {visibilityMode === "accepted_only"
                ? "Visible only to accepted matrimonial interests"
                : "Profile owner has restricted public photo access"}
            </p>
          </div>

          {onRequestPhotoAccess && (
            <Button
              type="button"
              size="sm"
              disabled={hasRequestedAccess}
              onClick={(e) => {
                e.stopPropagation();
                onRequestPhotoAccess();
              }}
              className="mt-1 h-8 px-4 rounded-xl bg-saffron-gradient text-white text-xs font-semibold shadow-sm hover:opacity-95"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              {hasRequestedAccess ? "Request Sent ✓" : "Request Photo Access"}
            </Button>
          )}
        </div>
      )}

      {/* 6. Screen Capture / Window Unfocus Alert Banner */}
      {screenCaptureShield && (
        <div className="absolute inset-0 z-30 bg-[#2B120C]/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 text-center text-amber-100 space-y-2">
          <ShieldCheck className="w-8 h-8 text-[#FF7700]" />
          <h4 className="font-serif-royal text-sm font-bold">
            Screen Capture Shield Active
          </h4>
          <p className="text-[10px] text-amber-200/80 max-w-[220px]">
            To protect matrimonial integrity, photos are shielded while focus is outside the browser.
          </p>
        </div>
      )}

      {/* 7. Print Restriction Shield (Prints pure black watermark card) */}
      <style>{`
        @media print {
          .watermarked-photo-img {
            display: none !important;
          }
          .print-shield-card {
            display: flex !important;
          }
        }
      `}</style>
      <div className="hidden print-shield-card absolute inset-0 bg-[#2B120C] text-white p-6 flex flex-col items-center justify-center text-center">
        <ShieldCheck className="w-10 h-10 text-amber-400 mb-2" />
        <h3 className="font-bold text-sm">CONFIDENTIAL VIVAH KAR LO PROFILE</h3>
        <p className="text-xs text-amber-200 mt-1">Printing and physical copying of candidate photos is strictly prohibited.</p>
        <span className="text-[10px] text-white/60 mt-2">ID: {profileId} • Viewer: {viewerUserId}</span>
      </div>
    </div>
  );
};
