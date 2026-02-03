import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
  variant?: 'modern' | 'glass' | 'neon';
}

const Logo: React.FC<LogoProps> = ({
  className = "",
  size = 48,
  primaryColor = "#10b981",
  secondaryColor = "#64748b",
  variant = 'modern'
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-700 hover:scale-110 active:scale-95`}
    >
      <defs>
        {/* Main Brand Gradient */}
        <linearGradient id="navbatMainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" /> {/* emerald-500 */}
          <stop offset="100%" stopColor="#059669" /> {/* emerald-600 */}
        </linearGradient>

        {/* Depth Shadow Filter */}
        <filter id="navbatShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
        </filter>

        {/* Inner Glow for 3D Feel */}
        <filter id="navbatInnerGlow">
          <feFlood floodColor="white" floodOpacity="0.4" result="glowColor" />
          <feComposite in="glowColor" in2="SourceGraphic" operator="in" result="glowIn" />
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feOffset dx="1" dy="1" result="offsetBlur" />
          <feComposite in="offsetBlur" in2="SourceGraphic" operator="atop" />
        </filter>

        {/* Glass Effect Overlay */}
        <linearGradient id="navbatGlass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Background Orbitrings (Atmospheric) */}
      <circle cx="50" cy="50" r="45" stroke="url(#navbatMainGrad)" strokeWidth="0.5" strokeOpacity="0.2" fill="none" className="animate-pulse" />
      <circle cx="50" cy="50" r="38" stroke="url(#navbatMainGrad)" strokeWidth="0.5" strokeOpacity="0.1" fill="none" className="animate-pulse" style={{ animationDelay: '1s' }} />

      {/* The abstract "N" / "Queue" Symbolism */}
      {/* 3 Steps representing a queue/progression */}

      {/* Step 1: Background Layer */}
      <rect x="20" y="55" width="16" height="30" rx="6" fill="#10b981" fillOpacity="0.1" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" />

      {/* Step 2: Middle Layer */}
      <rect x="42" y="35" width="16" height="50" rx="6" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="1" strokeOpacity="0.3" />

      {/* Step 3: Front Primary Layer (Distinctive element) */}
      <g filter="url(#navbatShadow)">
        <rect x="64" y="15" width="16" height="70" rx="6" fill="url(#navbatMainGrad)" />
        {/* Shine Layer */}
        <rect x="65" y="16" width="14" height="68" rx="5" fill="url(#navbatGlass)" filter="url(#navbatInnerGlow)" />
      </g>

      {/* The Dot / Head of the figure */}
      <circle cx="72" cy="10" r="8" fill="url(#navbatMainGrad)" filter="url(#navbatShadow)" />

      {/* Dynamic Swoosh (Movement) */}
      <path
        d="M15 90 Q 50 82, 85 90"
        stroke="url(#navbatMainGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeOpacity="0.3"
        fill="none"
      />
    </svg>
  );
};

export default Logo;