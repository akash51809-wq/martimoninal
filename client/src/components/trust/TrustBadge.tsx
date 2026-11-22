import React from "react";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle2, Sparkles, Award } from "lucide-react";

export type TrustBadgeTier = "none" | "basic" | "selfie_id";

interface TrustBadgeProps {
  tier?: TrustBadgeTier;
  isSelfieIdVerified?: boolean;
  isBasicVerified?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  tier,
  isSelfieIdVerified = false,
  isBasicVerified = false,
  size = "md",
  showLabel = true,
  className = "",
}) => {
  // Determine effective tier
  const effectiveTier: TrustBadgeTier =
    tier || (isSelfieIdVerified ? "selfie_id" : isBasicVerified ? "basic" : "none");

  if (effectiveTier === "none") {
    return null;
  }

  const isSelfieId = effectiveTier === "selfie_id";

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3 py-1.5 gap-2",
  }[size];

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  }[size];

  if (isSelfieId) {
    return (
      <Badge
        variant="outline"
        className={`inline-flex items-center font-bold tracking-wide rounded-full border shadow-xs transition-all ${
          "bg-gradient-to-r from-amber-500/15 via-blue-500/15 to-amber-500/15 border-amber-400/80 text-amber-900 dark:text-amber-200"
        } ${sizeClasses} ${className}`}
        title="Live Selfie Biometric & Government ID 100% Authenticated"
      >
        <span className="relative flex items-center justify-center text-amber-600">
          <Award className={iconSizes} />
          <Sparkles className="w-2 h-2 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
        </span>
        {showLabel && <span>Selfie &amp; Govt ID Verified</span>}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center font-bold rounded-full border shadow-xs transition-all ${
        "bg-emerald-50 border-emerald-300 text-emerald-800"
      } ${sizeClasses} ${className}`}
      title="Mobile Number & Email Verified Member"
    >
      <CheckCircle2 className={`${iconSizes} text-emerald-600`} />
      {showLabel && <span>Basic Verified</span>}
    </Badge>
  );
};
