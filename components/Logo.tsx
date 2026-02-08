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
  primaryColor = "#10b981", // emerald-500
  secondaryColor = "#94a3b8", // slate-400
  variant = 'modern'
}) => {
  const uniqueId = React.useId ? React.useId().replace(/:/g, '') : Math.random().toString(36).substr(2, 9);
  const suffix = `-${uniqueId}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-700 hover:scale-105 active:scale-95 drop-shadow-xl`}
    >
      <defs>
        {/* Silver Gradient (Left Figure) */}
        <linearGradient id={`silverGrad${suffix}`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#f1f5f9" /> {/* slate-100 */}
          <stop offset="50%" stopColor="#cbd5e1" /> {/* slate-300 */}
          <stop offset="100%" stopColor="#94a3b8" /> {/* slate-400 */}
        </linearGradient>

        {/* Charcoal Gradient (Middle Figure) */}
        <linearGradient id={`charcoalGrad${suffix}`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#64748b" /> {/* slate-500 */}
          <stop offset="50%" stopColor="#475569" /> {/* slate-600 */}
          <stop offset="100%" stopColor="#334155" /> {/* slate-700 */}
        </linearGradient>

        {/* Vibrant Green Gradient (Front Figure) */}
        <linearGradient id={`emeraldGrad${suffix}`} x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" /> {/* emerald-400 */}
          <stop offset="45%" stopColor="#10b981" /> {/* emerald-500 */}
          <stop offset="100%" stopColor="#047857" /> {/* emerald-700 */}
        </linearGradient>

        {/* Gloss/Shine Highlight */}
        <linearGradient id={`shine${suffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.7" />
          <stop offset="40%" stopColor="white" stopOpacity="0.2" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        {/* Base Gradient */}
        <radialGradient id={`baseGrad${suffix}`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 90) rotate(90) scale(10 40)">
          <stop stopColor="#064e3b" stopOpacity="0.8" />
          <stop offset="1" stopColor="#064e3b" stopOpacity="0" />
        </radialGradient>

        {/* Drop Shadow for depth */}
        <filter id={`shadow${suffix}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Base/Ground Shadow */}
      <ellipse cx="50" cy="92" rx="42" ry="5" fill={`url(#baseGrad${suffix})`} />

      {/* --- BACK FIGURE (Silver - Furthest) --- */}
      <g transform="translate(10, 25) scale(0.70)">
        {/* Body */}
        <path
          d="M5 35 Q 5 25, 15 25 Q 25 25, 25 35 L 28 75 Q 28 80, 20 80 L 10 80 Q 2 80, 2 75 Z"
          fill={`url(#silverGrad${suffix})`}
          filter={`url(#shadow${suffix})`}
        />
        {/* Head */}
        <circle cx="15" cy="12" r="10" fill={`url(#silverGrad${suffix})`} filter={`url(#shadow${suffix})`} />
        {/* Shine */}
        <circle cx="12" cy="9" r="4" fill={`url(#shine${suffix})`} />
      </g>

      {/* --- MIDDLE FIGURE (Charcoal) --- */}
      <g transform="translate(30, 18) scale(0.85)">
        {/* Body */}
        <path
          d="M5 35 Q 5 25, 15 25 Q 25 25, 25 35 L 28 75 Q 28 80, 20 80 L 10 80 Q 2 80, 2 75 Z"
          fill={`url(#charcoalGrad${suffix})`}
          filter={`url(#shadow${suffix})`}
        />
        {/* Head */}
        <circle cx="15" cy="12" r="10" fill={`url(#charcoalGrad${suffix})`} filter={`url(#shadow${suffix})`} />
        {/* Shine */}
        <circle cx="12" cy="9" r="4" fill={`url(#shine${suffix})`} />
      </g>

      {/* --- FRONT FIGURE (Green - Closest) --- */}
      <g transform="translate(50, 8) scale(1.05)">
        {/* Body */}
        <path
          d="M5 35 Q 5 25, 15 25 Q 25 25, 25 35 L 29 75 Q 29 80, 20 80 L 10 80 Q 1 80, 1 75 Z"
          fill={`url(#emeraldGrad${suffix})`}
          filter={`url(#shadow${suffix})`}
        />
        {/* Head */}
        <circle cx="15" cy="12" r="10" fill={`url(#emeraldGrad${suffix})`} filter={`url(#shadow${suffix})`} />
        {/* Stronger Shine for focal point */}
        <circle cx="11" cy="9" r="5" fill={`url(#shine${suffix})`} />
      </g>
    </svg>
  );
};

export default Logo;