/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { GameParkZone } from '../../data/gameParkZonesData';
import { soundService } from '../../services/audioService';
import { ArrowLeft, Home, Play, Sparkles, Star, Ruler, Flag, Award } from 'lucide-react';

interface TinyMeasurementWorkshopViewProps {
  zone: GameParkZone;
  student: StudentProfile;
  langMode: LanguageMode;
  onBackToPark: () => void;
  onHome?: () => void;
  onLaunchGame: (gameId: string) => void;
}

export const TinyMeasurementWorkshopView: React.FC<TinyMeasurementWorkshopViewProps> = ({
  zone,
  student,
  langMode,
  onBackToPark,
  onHome,
  onLaunchGame,
}) => {
  const hasRulerBadge = student.badges.includes('Bậc Thầy Đo Lường');
  const hasCompareBadge = student.badges.includes('Nhà Thám Hiểm Đo Độ Dài');

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col justify-between select-none py-1 sm:py-2">
      {/* 1. Navigation Breadcrumb Bar */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-amber-200/90 shadow-2xs flex items-center justify-between gap-2 shrink-0 mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              onBackToPark();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-amber-600" />
            <span>CÔNG VIÊN TRÒ CHƠI</span>
          </button>

          {onHome && (
            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                onHome();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Home className="w-4 h-4 text-emerald-600" />
              <span>TRANG CHỦ</span>
            </button>
          )}
        </div>

        {/* Current Stars & Badge indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-white px-3 py-1 rounded-full shadow-xs bg-amber-500">
            Khu 6 – Đo Lường
          </span>
          <span className="text-xs font-black text-amber-950 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 inline-flex items-center gap-1 shadow-2xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{student.totalStars || 0} ⭐</span>
          </span>
        </div>
      </div>

      {/* 2. Hero Header Banner: 3D Cute Premium Measurement Workshop */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-4 sm:p-6 text-white shadow-lg relative overflow-hidden mb-4 sm:mb-6 border-2 border-amber-300">
        {/* Soft background cover of zone image with semi-transparent overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
          <img
            src={zone.imageSrc || '/images/zone-6-measurement.png'}
            alt=""
            className="w-full h-full object-cover object-center filter blur-2xs"
          />
        </div>

        {/* Subtle background decoration */}
        <div className="absolute -right-10 -bottom-10 opacity-15 text-white pointer-events-none select-none text-9xl z-0">
          📏
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider text-yellow-100">
              <Sparkles className="w-3.5 h-3.5" /> KHU VUI CHƠI SỐ 6
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-['Be_Vietnam_Pro'] drop-shadow-sm">
              KHU 6 – XƯỞNG ĐO LƯỜNG TÍ HON
            </h1>

            <div className="text-xs sm:text-sm font-black tracking-wider uppercase text-yellow-200">
              TINY MEASUREMENT WORKSHOP
            </div>

            <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed pt-1">
              Khám phá thế giới đo độ dài cùng thước thần xăng-ti-mét và trổ tài so sánh xem đồ vật nào dài hơn, ngắn hơn nhé!
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 shrink-0">
            {/* 4:3 Zone Artwork Preview - Always visible with crisp 4:3 aspect ratio */}
            <div className="w-32 sm:w-44 md:w-52 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90 bg-white shrink-0">
              <img
                src={zone.imageSrc || '/images/zone-6-measurement.png'}
                alt={zone.nameVi}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            {/* Quick badge status */}
            <div className="shrink-0 bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/30 text-center space-y-1">
              <div className="text-[11px] font-bold text-yellow-100 uppercase tracking-wide">
                Huy hiệu thợ đo nhí
              </div>
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1 ${
                    hasRulerBadge
                      ? 'bg-yellow-400 text-yellow-950 shadow-xs'
                      : 'bg-black/20 text-white/70'
                  }`}
                >
                  📏 Thước Thần
                </span>
                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1 ${
                    hasCompareBadge
                      ? 'bg-yellow-400 text-yellow-950 shadow-xs'
                      : 'bg-black/20 text-white/70'
                  }`}
                >
                  📐 So Sánh
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. The 2 Large Game Cards (THẺ 1 & THẺ 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* ========================================================== */}
        {/* THẺ 1: THƯỚC THẦN ĐO VẬT */}
        {/* ========================================================== */}
        <div className="bg-white rounded-3xl border-2 border-amber-300 hover:border-amber-500 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
          {/* Top illustration banner */}
          <div className="relative h-44 sm:h-48 bg-gradient-to-b from-amber-100 to-yellow-50 p-3 flex flex-col items-center justify-center border-b border-amber-200 overflow-hidden">
            {/* SVG Illustration: Ruler and colorful pencil */}
            <svg viewBox="0 0 340 130" className="w-full h-full max-h-[120px] select-none drop-shadow-xs">
              {/* Ruler */}
              <g transform="translate(20, 60)">
                <rect x="0" y="0" width="300" height="46" rx="6" fill="#FDE047" stroke="#B45309" strokeWidth="2" />
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((cm) => (
                  <g key={cm}>
                    <line x1={20 + cm * 32} y1="0" x2={20 + cm * 32} y2="16" stroke="#78350F" strokeWidth="2" />
                    {cm < 8 && <line x1={36 + cm * 32} y1="0" x2={36 + cm * 32} y2="10" stroke="#92400E" strokeWidth="1.2" />}
                    <text x={20 + cm * 32} y="32" fill="#78350F" fontSize="11" fontWeight="900" textAnchor="middle">
                      {cm}
                    </text>
                  </g>
                ))}
                <text x="286" y="32" fill="#92400E" fontSize="11" fontWeight="bold">cm</text>
              </g>

              {/* Yellow Wood Pencil on ruler starting at 0cm */}
              <g transform="translate(40, 26)">
                {/* Dotted guidelines */}
                <line x1="0" y1="-6" x2="0" y2="44" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="192" y1="-6" x2="192" y2="44" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" />

                {/* Pencil graphics: exactly 6cm = 6 * 32 = 192px (Eraser at 0cm, Tip points right at 6cm) */}
                <rect x="0" y="0" width="12" height="24" rx="3" fill="#F472B6" stroke="#BE185D" strokeWidth="1.5" />
                <rect x="12" y="0" width="12" height="24" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
                <rect x="24" y="0" width="144" height="24" rx="2" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
                <line x1="24" y1="8" x2="168" y2="8" stroke="#FEF08A" strokeWidth="2" />
                <polygon points="168,0 192,12 168,24" fill="#FDE68A" stroke="#78350F" strokeWidth="1.5" />
                <polygon points="184,8 192,12 184,16" fill="#1E293B" />
              </g>
            </svg>

            {/* Badge on top right */}
            {hasRulerBadge && (
              <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-yellow-800" /> Đã có huy hiệu
              </span>
            )}
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📏</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black font-['Be_Vietnam_Pro'] text-slate-900 leading-tight">
                    THƯỚC THẦN ĐO VẬT
                  </h2>
                  <div className="text-xs font-bold text-amber-700">
                    Magic Ruler Measuring
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-2.5">
                Quan sát đồ vật đặt thẳng trên thước kẻ xăng-ti-mét (cm), điểm đầu ở vạch 0 và đọc độ dài chính xác ở đầu còn lại!
              </p>
            </div>

            {/* Features & Reward badge */}
            <div className="bg-amber-50/80 rounded-2xl p-2.5 border border-amber-200/80 text-xs text-amber-950 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span>⭐ Mục tiêu:</span>
                <span className="font-extrabold text-amber-800">5 câu đo độ dài cm chuẩn</span>
              </div>
              <div className="flex items-center justify-between font-bold">
                <span>🏆 Thưởng:</span>
                <span className="text-purple-700 font-black">+2 ⭐ & Huy hiệu Bậc Thầy Đo Lường</span>
              </div>
            </div>

            {/* Big Launch Button */}
            <button
              type="button"
              onClick={() => onLaunchGame('magic-ruler')}
              className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-['Be_Vietnam_Pro'] font-black text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 group-hover:scale-101"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>BẮT ĐẦU CHƠI</span>
            </button>
          </div>
        </div>

        {/* ========================================================== */}
        {/* THẺ 2: AI DÀI HƠN? */}
        {/* ========================================================== */}
        <div className="bg-white rounded-3xl border-2 border-orange-300 hover:border-orange-500 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
          {/* Top illustration banner */}
          <div className="relative h-44 sm:h-48 bg-gradient-to-b from-orange-100 to-amber-50 p-3 flex flex-col items-center justify-center border-b border-orange-200 overflow-hidden">
            {/* SVG Illustration: Two pencils with different lengths from same start line */}
            <svg viewBox="0 0 340 130" className="w-full h-full max-h-[120px] select-none drop-shadow-xs">
              {/* Baseline Start Line */}
              <line x1="50" y1="10" x2="50" y2="120" stroke="#EF4444" strokeWidth="3" />
              <rect x="44" y="10" width="6" height="110" fill="#EF4444" rx="1.5" />
              <polygon points="34,12 46,17 34,22" fill="#EF4444" />
              <text x="50" y="127" fill="#DC2626" fontSize="9" fontWeight="900" textAnchor="middle">
                VẠCH BẮT ĐẦU
              </text>

              {/* Red pencil (Longer: 210px) */}
              <g transform="translate(50, 30)">
                <polygon points="0,11 20,2 20,20" fill="#FDE68A" stroke="#78350F" strokeWidth="1.2" />
                <polygon points="0,11 7,7 7,15" fill="#1E293B" />
                <rect x="20" y="2" width="168" height="18" rx="2" fill="#EF4444" stroke="#78350F" strokeWidth="1.2" />
                <rect x="188" y="2" width="10" height="18" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2" />
                <rect x="198" y="2" width="12" height="18" rx="2" fill="#F472B6" stroke="#BE185D" strokeWidth="1.2" />
              </g>

              {/* Blue pencil (Shorter: 140px) */}
              <g transform="translate(50, 75)">
                <polygon points="0,11 20,2 20,20" fill="#FDE68A" stroke="#78350F" strokeWidth="1.2" />
                <polygon points="0,11 7,7 7,15" fill="#1E293B" />
                <rect x="20" y="2" width="98" height="18" rx="2" fill="#0284C7" stroke="#78350F" strokeWidth="1.2" />
                <rect x="118" y="2" width="10" height="18" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2" />
                <rect x="128" y="2" width="12" height="18" rx="2" fill="#F472B6" stroke="#BE185D" strokeWidth="1.2" />
              </g>
            </svg>

            {/* Badge on top right */}
            {hasCompareBadge && (
              <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-yellow-800" /> Đã có huy hiệu
              </span>
            )}
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📐</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black font-['Be_Vietnam_Pro'] text-slate-900 leading-tight">
                    AI DÀI HƠN?
                  </h2>
                  <div className="text-xs font-bold text-orange-700">
                    Who Is Longer?
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-2.5">
                Quan sát hai đồ vật đặt chung vạch xuất phát, trổ tài so sánh xem vật nào dài hơn, ngắn hơn hoặc hai vật dài bằng nhau!
              </p>
            </div>

            {/* Features & Reward badge */}
            <div className="bg-orange-50/80 rounded-2xl p-2.5 border border-orange-200/80 text-xs text-orange-950 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span>⭐ Mục tiêu:</span>
                <span className="font-extrabold text-orange-800">5 câu so sánh độ dài</span>
              </div>
              <div className="flex items-center justify-between font-bold">
                <span>🏆 Thưởng:</span>
                <span className="text-purple-700 font-black">+2 ⭐ & Huy hiệu Nhà Thám Hiểm Đo Độ Dài</span>
              </div>
            </div>

            {/* Big Launch Button */}
            <button
              type="button"
              onClick={() => onLaunchGame('who-is-longer')}
              className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-['Be_Vietnam_Pro'] font-black text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 group-hover:scale-101"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>BẮT ĐẦU CHƠI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
