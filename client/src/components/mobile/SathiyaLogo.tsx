import React from "react";

interface SathiyaLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  light?: boolean;
  brandName?: string;
  subtitle?: string;
}

export const SathiyaLogo: React.FC<SathiyaLogoProps> = ({
  size = 48,
  className = "",
  showText = false,
  light = false,
  brandName = "Sathiya",
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
            ry="23" 
            stroke="url(#logoSaffron)" 
            strokeWidth="6.5" 
            fill="none" 
            filter="url(#logoShadow)" 
          />
          
          {/* Right Gold Ring */}
          <ellipse 
            cx="60" 
            cy="56" 
            rx="23" 
            ry="23" 
            stroke="url(#logoGold)" 
            strokeWidth="6.5" 
            fill="none" 
          />
          
          {/* Overlapping Arch */}
          <path 
            d="M 40 33 A 23 23 0 0 1 55 38" 
            stroke="url(#logoSaffron)" 
            strokeWidth="6.5" 
            strokeLinecap="round" 
            fill="none" 
          />

          {/* Diamond / Heart Accent */}
          <path 
            d="M 50 16 L 58 25 L 50 34 L 42 25 Z" 
            fill="url(#logoSaffron)" 
          />
          <circle cx="50" cy="25" r="2.8" fill="#FFFFFF" />
          <path 
            d="M 47 20 L 50 17 L 53 20" 
            stroke="#FFFFFF" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-serif-royal font-bold tracking-wide leading-none whitespace-nowrap ${light ? 'text-white' : 'text-[#FF7700]'}`} style={{ fontSize: size * 0.45 }}>
            {brandName}
          </span>
          <span className={`text-[10px] tracking-widest uppercase font-semibold mt-0.5 whitespace-nowrap ${light ? 'text-amber-200' : 'text-amber-700'}`}>
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
};

export default SathiyaLogo;
