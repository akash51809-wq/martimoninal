import React from "react";

interface VivahBrandLogoProps {
  size?: "sm" | "md" | "lg";
  darkBg?: boolean;
  className?: string;
}

const sizeClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "h-12 sm:h-14",
  md: "h-14 sm:h-[74px]",
  lg: "h-16 sm:h-20",
};

export const VivahBrandLogo: React.FC<VivahBrandLogoProps> = ({
  size = "md",
  darkBg = false,
  className = "",
}) => {
  if (darkBg) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-2xl bg-[#FFFDF9] px-4 py-2 shadow-sm border border-amber-200/80 ${className}`}
      >
        <img
          src="/vivah-kar-lo-logo.png"
          alt="vivah kar lo"
          className={`${sizeClasses[size]} w-auto object-contain select-none`}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src="/vivah-kar-lo-logo.png"
        alt="vivah kar lo"
        className={`${sizeClasses[size]} w-auto object-contain mix-blend-multiply select-none transition-transform duration-200 group-hover:scale-[1.03]`}
      />
    </div>
  );
};
