/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ZoneIllustrationProps {
  type:
    | 'numbers'
    | 'operations'
    | 'geometry'
    | 'clock'
    | 'supermarket'
    | 'patterns'
    | 'racing'
    | 'treasure'
    | 'measurement';
  imageSrc?: string;
  alt?: string;
  className?: string;
}

export const ZoneIllustration: React.FC<ZoneIllustrationProps> = ({
  type,
  imageSrc,
  alt = 'Khu vui chơi Toán học 3D Chibi',
  className = '',
}) => {
  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${className}`}
        loading="lazy"
      />
    );
  }

  // High-fidelity 4:3 3D Chibi SVG Artwork (viewBox 400 300)
  return (
    <div className={`w-full h-full relative overflow-hidden flex items-center justify-center select-none ${className}`}>
      {type === 'numbers' && (
        /* KHU 1: LÂU ĐÀI NHỮNG CON SỐ - Xanh dương & Vàng, số 1-5, lâu đài cổ tích */
        <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skyN" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
            <linearGradient id="hillN" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#4ADE80" />
            </linearGradient>
            <linearGradient id="castleN" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#DBEAFE" />
            </linearGradient>
            <linearGradient id="roofN" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="goldN" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#skyN)" />
          {/* Fluffy clouds */}
          <path d="M40 70 Q55 50 75 60 Q95 45 115 65 Q130 65 130 80 L30 80 Z" fill="#FFFFFF" opacity="0.8" />
          <path d="M280 50 Q295 35 315 45 Q335 30 355 50 L270 50 Z" fill="#FFFFFF" opacity="0.8" />
          {/* Hills */}
          <path d="M-20 220 Q100 160 220 200 Q320 170 420 210 L420 300 L-20 300 Z" fill="url(#hillN)" />
          {/* Path */}
          <path d="M170 300 L185 220 L215 220 L230 300 Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />
          {/* Main Castle */}
          <rect x="150" y="140" width="100" height="80" rx="8" fill="url(#castleN)" stroke="#0284C7" strokeWidth="3" />
          {/* Castle Door */}
          <path d="M185 220 V185 C185 175 215 175 215 185 V220 Z" fill="#1E3A8A" />
          <circle cx="210" cy="202" r="2.5" fill="#FDE047" />
          {/* Towers Left & Right */}
          <rect x="120" y="120" width="35" height="90" rx="6" fill="url(#castleN)" stroke="#0284C7" strokeWidth="2.5" />
          <path d="M115 120 L137 75 L160 120 Z" fill="url(#roofN)" stroke="#0369A1" strokeWidth="2.5" />
          <rect x="245" y="120" width="35" height="90" rx="6" fill="url(#castleN)" stroke="#0284C7" strokeWidth="2.5" />
          <path d="M240 120 L262 75 L285 120 Z" fill="url(#roofN)" stroke="#0369A1" strokeWidth="2.5" />
          {/* Central High Spire */}
          <path d="M175 140 L200 85 L225 140 Z" fill="url(#roofN)" stroke="#0369A1" strokeWidth="2.5" />
          <circle cx="200" cy="80" r="6" fill="url(#goldN)" />
          {/* Number Blocks (1, 2, 3, 4, 5) with joyful colors */}
          {/* 1 */}
          <g className="animate-bounce">
            <circle cx="70" cy="230" r="22" fill="#EF4444" stroke="#FFFFFF" strokeWidth="3" />
            <text x="70" y="238" fill="#FFFFFF" fontSize="24" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">1</text>
          </g>
          {/* 2 */}
          <g>
            <circle cx="115" cy="255" r="20" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="3" />
            <text x="115" y="262" fill="#FFFFFF" fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">2</text>
          </g>
          {/* 3 */}
          <g className="animate-pulse">
            <circle cx="200" cy="155" r="18" fill="url(#goldN)" stroke="#FFFFFF" strokeWidth="2.5" />
            <text x="200" y="162" fill="#1E3A8A" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">3</text>
          </g>
          {/* 4 */}
          <g>
            <circle cx="285" cy="255" r="20" fill="#10B981" stroke="#FFFFFF" strokeWidth="3" />
            <text x="285" y="262" fill="#FFFFFF" fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">4</text>
          </g>
          {/* 5 */}
          <g className="animate-bounce">
            <circle cx="330" cy="230" r="22" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="3" />
            <text x="330" y="238" fill="#FFFFFF" fontSize="24" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">5</text>
          </g>
        </svg>
      )}

      {type === 'operations' && (
        /* KHU 2: KHU RỪNG PHÉP TÍNH - Cây táo, +, −, =, thỏ con Chibi */
        <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="forestSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D1FAE5" />
              <stop offset="100%" stopColor="#A7F3D0" />
            </linearGradient>
            <linearGradient id="treeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#forestSky)" />
          {/* Hills */}
          <ellipse cx="200" cy="300" rx="250" ry="110" fill="#10B981" />
          <ellipse cx="60" cy="280" rx="140" ry="70" fill="#059669" />
          {/* Big Apple Tree */}
          <rect x="75" y="130" width="30" height="120" rx="6" fill="#78350F" />
          <circle cx="90" cy="110" r="55" fill="url(#treeGrad)" />
          <circle cx="130" cy="120" r="45" fill="url(#treeGrad)" />
          <circle cx="50" cy="120" r="45" fill="url(#treeGrad)" />
          {/* Red and Yellow Apples on tree */}
          <circle cx="65" cy="100" r="9" fill="#EF4444" />
          <circle cx="110" cy="95" r="9" fill="#EF4444" />
          <circle cx="95" cy="130" r="9" fill="#FBBF24" />
          <circle cx="135" cy="125" r="9" fill="#EF4444" />
          {/* Math Equation Blocks: 3 + 2 = 5 */}
          <g transform="translate(180, 70)">
            <rect x="0" y="0" width="36" height="36" rx="8" fill="#F97316" stroke="#FFFFFF" strokeWidth="2.5" />
            <text x="18" y="26" fill="#FFFFFF" fontSize="22" fontWeight="900" textAnchor="middle">3</text>
            <rect x="42" y="0" width="36" height="36" rx="8" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2.5" />
            <text x="60" y="27" fill="#FFFFFF" fontSize="26" fontWeight="900" textAnchor="middle">+</text>
            <rect x="84" y="0" width="36" height="36" rx="8" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" />
            <text x="102" y="26" fill="#FFFFFF" fontSize="22" fontWeight="900" textAnchor="middle">2</text>
            <rect x="126" y="0" width="36" height="36" rx="8" fill="#EAB308" stroke="#FFFFFF" strokeWidth="2.5" />
            <text x="144" y="27" fill="#FFFFFF" fontSize="26" fontWeight="900" textAnchor="middle">=</text>
            <rect x="168" y="0" width="36" height="36" rx="8" fill="#EC4899" stroke="#FFFFFF" strokeWidth="2.5" />
            <text x="186" y="26" fill="#FFFFFF" fontSize="22" fontWeight="900" textAnchor="middle">5</text>
          </g>
          {/* Cute Chibi Bunny */}
          <g transform="translate(250, 160)">
            {/* Ears */}
            <ellipse cx="40" cy="20" rx="9" ry="25" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <ellipse cx="40" cy="20" rx="5" ry="17" fill="#F472B6" />
            <ellipse cx="60" cy="20" rx="9" ry="25" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <ellipse cx="60" cy="20" rx="5" ry="17" fill="#F472B6" />
            {/* Head */}
            <circle cx="50" cy="55" r="26" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="42" cy="52" r="3.5" fill="#0F172A" />
            <circle cx="58" cy="52" r="3.5" fill="#0F172A" />
            <ellipse cx="50" cy="60" rx="4" ry="2.5" fill="#F43F5E" />
            {/* Body */}
            <ellipse cx="50" cy="95" rx="22" ry="20" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            {/* Holding Red Apple */}
            <circle cx="50" cy="88" r="10" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5" />
            <path d="M50 78 Q54 75 52 72" stroke="#15803D" strokeWidth="2" fill="none" />
          </g>
        </svg>
      )}

      {type === 'geometry' && (
        /* KHU 3: XỨ SỞ HÌNH HỌC - Mái tam giác, cửa vuông, bánh xe tròn, robot chibi */
        <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="geomSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F3E8FF" />
              <stop offset="100%" stopColor="#E9D5FF" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#geomSky)" />
          {/* Ground */}
          <rect x="0" y="210" width="400" height="90" fill="#DDD6FE" />
          {/* Geometric Cobblestone Path */}
          <g fill="#C4B5FD" stroke="#A78BFA" strokeWidth="1">
            <rect x="180" y="220" width="20" height="15" rx="3" />
            <circle cx="215" cy="230" r="8" />
            <polygon points="190,250 200,240 210,250" />
            <rect x="175" y="260" width="22" height="14" rx="3" />
            <circle cx="215" cy="270" r="9" />
          </g>
          {/* House 1: Square with Triangle Roof */}
          <g transform="translate(60, 95)">
            <polygon points="50,0 0,60 100,60" fill="#EC4899" stroke="#BE185D" strokeWidth="3" />
            <rect x="10" y="60" width="80" height="75" fill="#FDF2F8" stroke="#DB2777" strokeWidth="3" />
            {/* Square Windows */}
            <rect x="22" y="75" width="20" height="20" rx="3" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
            <rect x="58" y="75" width="20" height="20" rx="3" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
            {/* Door */}
            <rect x="38" y="105" width="24" height="30" rx="3" fill="#A855F7" stroke="#7E22CE" strokeWidth="2" />
          </g>
          {/* House 2: Cylinder / Circle Tower */}
          <g transform="translate(260, 80)">
            <path d="M40 0 L10 50 L70 50 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="3" />
            <rect x="15" y="50" width="50" height="95" rx="10" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3" />
            <circle cx="40" cy="80" r="12" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
          </g>
          {/* Cute Geometry Robot Chibi */}
          <g transform="translate(170, 120)">
            {/* Head: Square with antenna */}
            <rect x="15" y="15" width="30" height="26" rx="6" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
            <line x1="30" y1="15" x2="30" y2="5" stroke="#0284C7" strokeWidth="2.5" />
            <circle cx="30" cy="4" r="3" fill="#FDE047" />
            <circle cx="23" cy="27" r="3" fill="#0F172A" />
            <circle cx="37" cy="27" r="3" fill="#0F172A" />
            {/* Body */}
            <rect x="12" y="45" width="36" height="32" rx="6" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="2" />
            <polygon points="30,52 23,65 37,65" fill="#FDE047" />
            {/* Wheel Legs */}
            <circle cx="20" cy="83" r="6" fill="#64748B" stroke="#334155" strokeWidth="2" />
            <circle cx="40" cy="83" r="6" fill="#64748B" stroke="#334155" strokeWidth="2" />
          </g>
        </svg>
      )}

      {type === 'clock' && (
        /* KHU 4: THÁP ĐỒNG HỒ KỲ DIỆU - Đồng hồ tròn 1-12, tháp xanh ngọc, thước đo, bút chì */
        <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="clockSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#CFFAFE" />
              <stop offset="100%" stopColor="#A5F3FC" />
            </linearGradient>
            <linearGradient id="towerGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0891B2" />
              <stop offset="100%" stopColor="#0E7490" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#clockSky)" />
          {/* Green lawn */}
          <ellipse cx="200" cy="290" rx="240" ry="60" fill="#34D399" />
          {/* Clock Tower Body */}
          <rect x="145" y="110" width="110" height="150" rx="8" fill="url(#towerGrad)" stroke="#155E75" strokeWidth="3" />
          {/* Spire */}
          <polygon points="200,20 135,110 265,110" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
          <circle cx="200" cy="18" r="6" fill="#FDE047" />
          {/* Big Round Clock Face */}
          <circle cx="200" cy="165" r="42" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="5" />
          {/* Clock Numbers (1-12) */}
          <text x="200" y="136" fill="#0F172A" fontSize="11" fontWeight="900" textAnchor="middle">12</text>
          <text x="230" y="169" fill="#0F172A" fontSize="11" fontWeight="900" textAnchor="middle">3</text>
          <text x="200" y="200" fill="#0F172A" fontSize="11" fontWeight="900" textAnchor="middle">6</text>
          <text x="170" y="169" fill="#0F172A" fontSize="11" fontWeight="900" textAnchor="middle">9</text>
          {/* Clock Hands: Showing 3:00 clearly */}
          <line x1="200" y1="165" x2="200" y2="142" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="200" y1="165" x2="222" y2="165" stroke="#1E3A8A" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="200" cy="165" r="4" fill="#F59E0B" />
          {/* Ruler on Left */}
          <g transform="translate(60, 160) rotate(-15)">
            <rect x="0" y="0" width="90" height="22" rx="4" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
            <line x1="15" y1="0" x2="15" y2="8" stroke="#CA8A04" strokeWidth="1.5" />
            <line x1="30" y1="0" x2="30" y2="12" stroke="#CA8A04" strokeWidth="1.5" />
            <line x1="45" y1="0" x2="45" y2="8" stroke="#CA8A04" strokeWidth="1.5" />
            <line x1="60" y1="0" x2="60" y2="12" stroke="#CA8A04" strokeWidth="1.5" />
            <line x1="75" y1="0" x2="75" y2="8" stroke="#CA8A04" strokeWidth="1.5" />
            <text x="45" y="19" fill="#854D0E" fontSize="9" fontWeight="900" textAnchor="middle">cm</text>
          </g>
          {/* Pencil on Right */}
          <g transform="translate(290, 160) rotate(20)">
            <rect x="0" y="0" width="75" height="16" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
            <polygon points="75,0 90,8 75,16" fill="#FDE68A" stroke="#C2410C" strokeWidth="1.5" />
            <polygon points="85,5 90,8 85,11" fill="#0F172A" />
            <rect x="-15" y="0" width="15" height="16" fill="#F472B6" stroke="#C2410C" strokeWidth="1.5" />
          </g>
        </svg>
      )}

      {type === 'supermarket' && (
        /* KHU 5: SIÊU THỊ TOÁN HỌC - Mái hồng pastel, giỏ hàng, gấu bông, bánh kẹo */
        <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="martSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FCE7F3" />
              <stop offset="100%" stopColor="#FBCFE8" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#martSky)" />
          {/* Floor */}
          <rect x="0" y="210" width="400" height="90" fill="#F5D0FE" />
          {/* Shop Front */}
          <g transform="translate(100, 60)">
            {/* Awning stripes (Pink and White) */}
            <path d="M0 60 L15 20 L185 20 L200 60 Z" fill="#F43F5E" />
            <polygon points="20,20 45,20 35,60 10,60" fill="#FFFFFF" opacity="0.9" />
            <polygon points="70,20 95,20 85,60 60,60" fill="#FFFFFF" opacity="0.9" />
            <polygon points="120,20 145,20 135,60 110,60" fill="#FFFFFF" opacity="0.9" />
            <polygon points="170,20 185,20 180,60 160,60" fill="#FFFFFF" opacity="0.9" />
            {/* Store Body */}
            <rect x="15" y="60" width="170" height="100" fill="#FFFFFF" stroke="#FB7185" strokeWidth="3" />
            {/* Window with Toys & Apples */}
            <rect x="30" y="75" width="80" height="60" rx="6" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="2" />
            {/* Teddy bear in window */}
            <circle cx="55" cy="100" r="10" fill="#B45309" />
            <circle cx="48" cy="92" r="3.5" fill="#B45309" />
            <circle cx="62" cy="92" r="3.5" fill="#B45309" />
            {/* Apple in window */}
            <circle cx="85" cy="105" r="8" fill="#EF4444" />
            {/* Door */}
            <rect x="125" y="75" width="45" height="85" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
          </g>
          {/* Cute Shopping Cart on Left */}
          <g transform="translate(45, 175)">
            {/* Basket wireframe */}
            <rect x="0" y="0" width="45" height="30" rx="4" fill="none" stroke="#E11D48" strokeWidth="3" />
            <line x1="12" y1="0" x2="12" y2="30" stroke="#E11D48" strokeWidth="2" />
            <line x1="25" y1="0" x2="25" y2="30" stroke="#E11D48" strokeWidth="2" />
            <line x1="38" y1="0" x2="38" y2="30" stroke="#E11D48" strokeWidth="2" />
            {/* Handle */}
            <line x1="-8" y1="-8" x2="0" y2="5" stroke="#BE123C" strokeWidth="3" strokeLinecap="round" />
            {/* Items in cart */}
            <circle cx="15" cy="-4" r="8" fill="#EF4444" />
            <rect x="25" y="-8" width="14" height="12" rx="3" fill="#FBBF24" />
            {/* Wheels */}
            <circle cx="10" cy="36" r="5" fill="#0F172A" />
            <circle cx="35" cy="36" r="5" fill="#0F172A" />
          </g>
        </svg>
      )}

      {type === 'patterns' && (
        /* KHU 6: VƯỜN QUY LUẬT BÍ ẨN - Luống hoa theo quy luật, chuỗi lặp lại, bướm và sao */
        <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="patSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ECFCCB" />
              <stop offset="100%" stopColor="#D9F99D" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#patSky)" />
          {/* Garden Hills */}
          <ellipse cx="200" cy="270" rx="230" ry="90" fill="#84CC16" />
          {/* Flower Gate */}
          <g transform="translate(130, 60)">
            <path d="M0 160 C0 30 140 30 140 160" stroke="#65A30D" strokeWidth="10" fill="none" />
            {/* Vines & Roses */}
            <circle cx="20" cy="80" r="10" fill="#F43F5E" />
            <circle cx="70" cy="40" r="12" fill="#FB7185" />
            <circle cx="120" cy="80" r="10" fill="#F43F5E" />
          </g>
          {/* Repeating Pattern Beds: Red - Yellow - Blue - Red - Yellow - Blue */}
          <g transform="translate(40, 200)">
            {/* 1. Red Flower */}
            <circle cx="30" cy="25" r="14" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="30" cy="25" r="5" fill="#FEF08A" />
            {/* 2. Yellow Flower */}
            <circle cx="90" cy="25" r="14" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="90" cy="25" r="5" fill="#78350F" />
            {/* 3. Blue Flower */}
            <circle cx="150" cy="25" r="14" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="150" cy="25" r="5" fill="#FEF08A" />
            {/* 4. Red Flower */}
            <circle cx="210" cy="25" r="14" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="210" cy="25" r="5" fill="#FEF08A" />
            {/* 5. Yellow Flower */}
            <circle cx="270" cy="25" r="14" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="270" cy="25" r="5" fill="#78350F" />
            {/* 6. Question mark flower (solve the pattern!) */}
            <circle cx="330" cy="25" r="16" fill="#A855F7" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="4 2" />
            <text x="330" y="32" fill="#FFFFFF" fontSize="18" fontWeight="900" textAnchor="middle">?</text>
          </g>
          {/* Butterfly */}
          <g transform="translate(300, 70) scale(0.9)">
            <ellipse cx="20" cy="20" rx="14" ry="9" fill="#EC4899" />
            <ellipse cx="40" cy="20" rx="14" ry="9" fill="#EC4899" />
            <ellipse cx="22" cy="30" rx="10" ry="7" fill="#F472B6" />
            <ellipse cx="38" cy="30" rx="10" ry="7" fill="#F472B6" />
            <line x1="30" y1="12" x2="30" y2="38" stroke="#0F172A" strokeWidth="3" />
          </g>
        </svg>
      )}

      {type === 'racing' && (
        /* KHU 7: ĐƯỜNG ĐUA TOÁN HỌC - Đường đua uốn lượn, xe Chibi, cờ đích, cầu vồng */
        <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="raceSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FED7AA" />
              <stop offset="100%" stopColor="#FFEDD5" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#raceSky)" />
          {/* Rainbow */}
          <path d="M40 180 A160 160 0 0 1 360 180" stroke="#EF4444" strokeWidth="6" fill="none" opacity="0.6" />
          <path d="M46 180 A154 154 0 0 1 354 180" stroke="#F59E0B" strokeWidth="6" fill="none" opacity="0.6" />
          <path d="M52 180 A148 148 0 0 1 348 180" stroke="#10B981" strokeWidth="6" fill="none" opacity="0.6" />
          <path d="M58 180 A142 142 0 0 1 342 180" stroke="#3B82F6" strokeWidth="6" fill="none" opacity="0.6" />
          {/* Green Hills */}
          <ellipse cx="200" cy="280" rx="260" ry="100" fill="#4ADE80" />
          {/* Winding Race Track */}
          <path d="M-20 250 Q120 180 200 220 Q280 260 420 180" stroke="#334155" strokeWidth="55" fill="none" />
          <path d="M-20 250 Q120 180 200 220 Q280 260 420 180" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="14 10" fill="none" />
          {/* Red Chibi Race Car */}
          <g transform="translate(130, 185) rotate(-10)">
            {/* Wheels */}
            <circle cx="16" cy="30" r="8" fill="#0F172A" />
            <circle cx="16" cy="30" r="4" fill="#94A3B8" />
            <circle cx="64" cy="30" r="8" fill="#0F172A" />
            <circle cx="64" cy="30" r="4" fill="#94A3B8" />
            {/* Car body */}
            <path d="M0 24 Q10 10 30 10 L55 10 Q75 14 80 24 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
            {/* Windshield & Driver */}
            <path d="M25 10 L35 0 L55 0 L58 10 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
            <circle cx="45" cy="5" r="5" fill="#FEF08A" />
            {/* Number 1 Badge */}
            <circle cx="40" cy="20" r="7" fill="#FFFFFF" />
            <text x="40" y="24" fill="#B91C1C" fontSize="10" fontWeight="900" textAnchor="middle">1</text>
          </g>
          {/* Finish Line Checkered Banner */}
          <g transform="translate(290, 110)">
            <line x1="0" y1="0" x2="0" y2="70" stroke="#64748B" strokeWidth="3" />
            <line x1="50" y1="0" x2="50" y2="70" stroke="#64748B" strokeWidth="3" />
            <rect x="0" y="0" width="50" height="24" fill="#0F172A" />
            <rect x="0" y="0" width="12.5" height="12" fill="#FFFFFF" />
            <rect x="25" y="0" width="12.5" height="12" fill="#FFFFFF" />
            <rect x="12.5" y="12" width="12.5" height="12" fill="#FFFFFF" />
            <rect x="37.5" y="12" width="12.5" height="12" fill="#FFFFFF" />
          </g>
        </svg>
      )}

      {type === 'treasure' && (
        /* KHU 8: ĐẢO KHO BÁU TOÁN HỌC - Đảo nhiệt đới, rương vàng, sao lấp lánh, chìa khóa */
        <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="seaSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#7DD3FC" />
            </linearGradient>
            <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#0891B2" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#seaSky)" />
          {/* Sea */}
          <rect x="0" y="170" width="400" height="130" fill="url(#seaGrad)" />
          {/* Island */}
          <ellipse cx="200" cy="220" rx="140" ry="50" fill="#FDE047" stroke="#CA8A04" strokeWidth="3" />
          {/* Palm Tree */}
          <g transform="translate(90, 80)">
            <path d="M25 110 Q40 50 20 20" stroke="#92400E" strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d="M20 20 Q-10 10 -25 30" stroke="#16A34A" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M20 20 Q20 -15 35 -20" stroke="#16A34A" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M20 20 Q55 10 70 30" stroke="#16A34A" strokeWidth="7" strokeLinecap="round" fill="none" />
          </g>
          {/* Big Glowing Gold & Purple Treasure Chest */}
          <g transform="translate(190, 160)">
            {/* Glowing stars hovering */}
            <path d="M30 -20 L33 -10 L43 -10 L35 -4 L38 6 L30 0 L22 6 L25 -4 L17 -10 L27 -10 Z" fill="#FDE047" stroke="#EAB308" strokeWidth="1" className="animate-bounce" />
            <circle cx="5" cy="-8" r="3" fill="#FDE047" />
            <circle cx="55" cy="-12" r="3.5" fill="#FDE047" />
            {/* Chest base */}
            <rect x="0" y="15" width="60" height="35" rx="5" fill="#7C3AED" stroke="#4C1D95" strokeWidth="2.5" />
            <rect x="6" y="15" width="8" height="35" fill="#FBBF24" />
            <rect x="46" y="15" width="8" height="35" fill="#FBBF24" />
            {/* Chest Lid open */}
            <path d="M0 15 C0 0 20 -8 30 -8 C40 -8 60 0 60 15 Z" fill="#9333EA" stroke="#4C1D95" strokeWidth="2.5" />
            <circle cx="30" cy="28" r="4" fill="#FBBF24" />
          </g>
          {/* Golden Key on Sand */}
          <g transform="translate(270, 220) rotate(15)">
            <circle cx="8" cy="8" r="6" fill="#FBBF24" stroke="#CA8A04" strokeWidth="1.5" />
            <line x1="14" y1="8" x2="32" y2="8" stroke="#FBBF24" strokeWidth="3" />
            <line x1="26" y1="8" x2="26" y2="13" stroke="#FBBF24" strokeWidth="2.5" />
            <line x1="31" y1="8" x2="31" y2="13" stroke="#FBBF24" strokeWidth="2.5" />
          </g>
        </svg>
      )}

      {type === 'measurement' && (
        /* KHU 6: XƯỞNG ĐO LƯỜNG TÍ HON - Thước kẻ cm, bút chì, que tính, cuộn ruy băng, xưởng mộc dễ thương */
        <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="measSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="#FFFBEB" />
            </linearGradient>
            <linearGradient id="tableWood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="rulerGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>
          </defs>
          {/* Workshop wall */}
          <rect width="400" height="300" fill="url(#measSky)" />
          {/* Pegboard holes */}
          {[60, 100, 140, 180, 220, 260, 300, 340].map((x) =>
            [40, 70, 100].map((y) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="#D97706" opacity="0.25" />
            ))
          )}
          {/* Wooden Workshop Table */}
          <rect x="0" y="150" width="400" height="150" fill="url(#tableWood)" stroke="#B45309" strokeWidth="3" />
          <line x1="0" y1="180" x2="400" y2="180" stroke="#B45309" strokeWidth="2" opacity="0.4" />
          {/* Big Beautiful Ruler */}
          <g transform="translate(35, 175)">
            {/* Ruler body */}
            <rect x="0" y="0" width="330" height="52" rx="8" fill="url(#rulerGrad)" stroke="#B45309" strokeWidth="3" />
            {/* Centimeter ticks */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((cm) => {
              const xPos = 25 + cm * 28;
              return (
                <g key={cm}>
                  <line x1={xPos} y1="0" x2={xPos} y2="20" stroke="#78350F" strokeWidth="2.5" />
                  {cm < 10 && <line x1={xPos + 14} y1="0" x2={xPos + 14} y2="12" stroke="#92400E" strokeWidth="1.5" />}
                  <text x={xPos} y="38" fill="#78350F" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                    {cm}
                  </text>
                </g>
              );
            })}
            <text x="316" y="38" fill="#92400E" fontSize="12" fontWeight="bold">cm</text>
          </g>
          {/* Cute Red & Wood Pencil on table */}
          <g transform="translate(60, 130) rotate(-4)">
            {/* Wooden Tip */}
            <polygon points="0,12 25,0 25,24" fill="#FDE68A" stroke="#78350F" strokeWidth="1.5" />
            <polygon points="0,12 8,7 8,17" fill="#1E293B" />
            {/* Pencil Body */}
            <rect x="25" y="0" width="160" height="24" rx="2" fill="#EF4444" stroke="#78350F" strokeWidth="1.5" />
            <line x1="25" y1="8" x2="185" y2="8" stroke="#F87171" strokeWidth="2" />
            <line x1="25" y1="16" x2="185" y2="16" stroke="#DC2626" strokeWidth="2" />
            {/* Metal band */}
            <rect x="185" y="0" width="16" height="24" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
            {/* Pink Eraser */}
            <rect x="201" y="0" width="22" height="24" rx="4" fill="#F472B6" stroke="#BE185D" strokeWidth="1.5" />
          </g>
          {/* Cute Pastel Eraser */}
          <g transform="translate(290, 115) rotate(12)">
            <rect x="0" y="0" width="55" height="35" rx="6" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
            <path d="M0 0 L25 0 L15 35 L0 35 Z" fill="#F8FAFC" opacity="0.9" />
            <text x="36" y="23" fill="#0369A1" fontSize="11" fontWeight="900" textAnchor="middle">TẨY</text>
          </g>
          {/* Colorful Satin Ribbon */}
          <g transform="translate(80, 248)">
            <path d="M0,15 Q60,-5 120,15 T240,15" fill="none" stroke="#EC4899" strokeWidth="12" strokeLinecap="round" />
            <path d="M0,15 Q60,-5 120,15 T240,15" fill="none" stroke="#F472B6" strokeWidth="6" strokeLinecap="round" />
          </g>
          {/* Stars & Sparkles */}
          <g className="animate-bounce">
            <text x="35" y="70" fontSize="24">📏</text>
            <text x="335" y="60" fontSize="22">✨</text>
            <text x="190" y="45" fontSize="20">⭐</text>
          </g>
        </svg>
      )}
    </div>
  );
};
