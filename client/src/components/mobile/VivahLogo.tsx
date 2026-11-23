import React from "react";

interface VivahLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  light?: boolean;
  brandName?: string;
  subtitle?: string;
}

export const VivahLogo: React.FC<VivahLogoProps> = ({
  size = 48,
  className = "",
  showText = false,
  light = false,
  brandName = "Vivah Kar Lo",
  subtitle = "Matrimony",
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div 
        style={{ width: size, height: size }} 
        className="relative flex items-center justify-center shrink-0 drop-shadow-md"
      >
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          className="w-full h-full transform transition-transform hover:scale-105"
        >
          <defs>
            <linearGradient id="logoSaffron" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7700" />
              <stop offset="50%" stopColor="#FF5A1E" />
              <stop offset="100%" stopColor="#E64A19" />
            </linearGradient>
            <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#FF7700" floodOpacity="0.35"/>
            </filter>
          </defs>

          {/* Left Saffron Ring */}
          <ellipse 
            cx="40" 
            cy="56" 
            rx="23" 
            ry="25" 
            stroke="url(#logoSaffron)" 
            strokeWidth="9" 
            transform="rotate(-15 40 56)" 
            strokeLinecap="round"
          />

          {/* Right Gold Ring */}
          <ellipse 
            cx="60" 
            cy="56" 
            rx="23" 
            ry="25" 
            stroke="url(#logoGold)" 
            strokeWidth="9" 
            transform="rotate(15 60 56)" 
            strokeLinecap="round"
          />

          {/* Sparkling Gem Top Center */}
          <path 
            d="M50 18 L55 28 L67 31 L58 40 L60 52 L50 46 L40 52 L42 40 L33 31 L45 28 Z" 
            fill="#FBBF24" 
            filter="url(#logoShadow)"
          />
          <circle cx="50" cy="34" r="3.5" fill="#FFFBEB" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-none">
          <span 
            className={`font-serif-royal font-bold tracking-tight ${
              light ? "text-white" : "text-gray-900"
            }`}
            style={{ fontSize: size * 0.48 }}
          >
            {brandName}
          </span>
          <span 
            className={`tracking-widest uppercase font-semibold text-orange-600`}
            style={{ fontSize: Math.max(9, size * 0.22) }}
          >
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
};

export const SathiyaLogo = VivahLogo;
export default VivahLogo;
