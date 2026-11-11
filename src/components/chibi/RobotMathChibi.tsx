/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface RobotMathChibiProps {
  expression?: 'happy' | 'thinking' | 'cheering' | 'waving' | 'excited';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const RobotMathChibi: React.FC<RobotMathChibiProps> = ({
  expression = 'happy',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="robotHeadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="antennaEarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
          <linearGradient id="metalArmGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
        </defs>

        {/* Ear Antennas (Yellow cylindrical pods like textbook mascot) */}
        <circle cx="28" cy="62" r="14" fill="url(#antennaEarGrad)" stroke="#CA8A04" strokeWidth="2.5" />
        <ellipse cx="28" cy="62" rx="6" ry="10" fill="#FEF08A" />

        <circle cx="132" cy="62" r="14" fill="url(#antennaEarGrad)" stroke="#CA8A04" strokeWidth="2.5" />
        <ellipse cx="132" cy="62" rx="6" ry="10" fill="#FEF08A" />

        {/* Top Antenna */}
        <rect x="76" y="10" width="8" height="15" rx="4" fill="#94A3B8" />
        <circle cx="80" cy="10" r="7" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" className="animate-pulse" />

        {/* Robot Head (Rounded oblong shape from SGK) */}
        <rect
          x="30"
          y="22"
          width="100"
          height="80"
          rx="40"
          fill="url(#robotHeadGrad)"
          stroke="#475569"
          strokeWidth="3.5"
        />

        {/* Screen / Visor (Black curved visor where the big cute eyes reside) */}
        <rect
          x="42"
          y="35"
          width="76"
          height="54"
          rx="27"
          fill="url(#visorGrad)"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Cute Big Cartoon Eyes (Iconic to SGK Rô-bốt) */}
        {expression === 'happy' && (
          <>
            {/* Left Eye */}
            <circle cx="64" cy="62" r="15" fill="#38BDF8" />
            <circle cx="64" cy="62" r="11" fill="#0284C7" />
            <circle cx="61" cy="58" r="4.5" fill="#FFFFFF" />
            <circle cx="67" cy="65" r="2" fill="#FFFFFF" />
            {/* Right Eye */}
            <circle cx="96" cy="62" r="15" fill="#38BDF8" />
            <circle cx="96" cy="62" r="11" fill="#0284C7" />
            <circle cx="93" cy="58" r="4.5" fill="#FFFFFF" />
            <circle cx="99" cy="65" r="2" fill="#FFFFFF" />
          </>
        )}

        {expression === 'thinking' && (
          <>
            {/* Looking up right */}
            <circle cx="66" cy="58" r="14" fill="#38BDF8" />
            <circle cx="68" cy="55" r="8" fill="#0369A1" />
            <circle cx="67" cy="53" r="3" fill="#FFFFFF" />

            <circle cx="98" cy="58" r="14" fill="#38BDF8" />
            <circle cx="100" cy="55" r="8" fill="#0369A1" />
            <circle cx="99" cy="53" r="3" fill="#FFFFFF" />
          </>
        )}

        {expression === 'cheering' || expression === 'excited' ? (
          <>
            {/* Inverted joyful happy arches (^_^) */}
            <path
              d="M 52 64 Q 64 46 76 64"
              stroke="#38BDF8"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="64" cy="54" r="3" fill="#FFFFFF" />
            <path
              d="M 84 64 Q 96 46 108 64"
              stroke="#38BDF8"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="96" cy="54" r="3" fill="#FFFFFF" />
            {/* Rosy cheeks */}
            <ellipse cx="48" cy="74" rx="4" ry="2.5" fill="#F43F5E" opacity="0.8" />
            <ellipse cx="112" cy="74" rx="4" ry="2.5" fill="#F43F5E" opacity="0.8" />
          </>
        ) : null}

        {expression === 'waving' && (
          <>
            <circle cx="64" cy="62" r="15" fill="#38BDF8" />
            <circle cx="64" cy="62" r="10" fill="#0284C7" />
            <circle cx="62" cy="58" r="4" fill="#FFFFFF" />

            <path
              d="M 87 63 Q 96 52 105 63"
              stroke="#38BDF8"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}

        {/* Neck */}
        <rect x="72" y="100" width="16" height="8" rx="2" fill="#64748B" />

        {/* Body (Segmented blue robot chassis from SGK) */}
        <rect
          x="50"
          y="108"
          width="60"
          height="40"
          rx="12"
          fill="url(#bodyGrad)"
          stroke="#0369A1"
          strokeWidth="3"
        />

        {/* Chest screen with mini heart or plus icon */}
        <rect x="65" y="116" width="30" height="18" rx="5" fill="#E0F2FE" />
        <path d="M 80 120 V 130 M 75 125 H 85" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />

        {/* Arms */}
        {expression === 'waving' ? (
          <>
            <path d="M 50 118 Q 30 110 32 135" stroke="url(#metalArmGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* Waving Right arm up! */}
            <path d="M 110 118 Q 130 95 138 78" stroke="url(#metalArmGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
            <circle cx="138" cy="76" r="6" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
          </>
        ) : expression === 'cheering' || expression === 'excited' ? (
          <>
            {/* Both arms raised! */}
            <path d="M 50 118 Q 30 95 24 78" stroke="url(#metalArmGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
            <circle cx="24" cy="76" r="6" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
            <path d="M 110 118 Q 130 95 136 78" stroke="url(#metalArmGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
            <circle cx="136" cy="76" r="6" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
          </>
        ) : (
          <>
            <path d="M 50 118 Q 34 125 36 142" stroke="url(#metalArmGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
            <circle cx="36" cy="143" r="5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
            <path d="M 110 118 Q 126 125 124 142" stroke="url(#metalArmGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
            <circle cx="124" cy="143" r="5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
          </>
        )}

        {/* Legs / Feet */}
        <rect x="62" y="147" width="12" height="10" rx="3" fill="#64748B" />
        <ellipse cx="68" cy="157" rx="9" ry="3" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />

        <rect x="86" y="147" width="12" height="10" rx="3" fill="#64748B" />
        <ellipse cx="92" cy="157" rx="9" ry="3" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
      </svg>
    </div>
  );
};
