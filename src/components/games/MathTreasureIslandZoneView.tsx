/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { GameParkZone } from '../../data/gameParkZonesData';
import { soundService } from '../../services/audioService';
import { ArrowLeft, Home, Play, Sparkles, Star, Key, Compass, ShieldCheck, MapPin, Award } from 'lucide-react';

interface MathTreasureIslandZoneViewProps {
  zone: GameParkZone;
  student: StudentProfile;
  langMode: LanguageMode;
  onBackToPark: () => void;
  onHome?: () => void;
  onLaunchGame: (gameId: string) => void;
}

export const MathTreasureIslandZoneView: React.FC<MathTreasureIslandZoneViewProps> = ({
  zone,
  student,
  langMode,
  onBackToPark,
  onHome,
  onLaunchGame,
}) => {
  const hasCipherBadge = student.badges.includes('Bậc Thầy Giải Mã');
  const hasHuntBadge = student.badges.includes('Nhà Thám Hiểm Đại Dương');

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col justify-between select-none py-1 sm:py-2 font-['Be_Vietnam_Pro']">
      {/* 1. Navigation Breadcrumb Bar */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-amber-200/90 shadow-2xs flex items-center justify-between gap-2 shrink-0 mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              onBackToPark();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-black text-xs sm:text-sm transition-all cursor-pointer shadow-2xs active:scale-95"
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-black text-xs sm:text-sm transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Home className="w-4 h-4 text-emerald-600" />
              <span>TRANG CHỦ</span>
            </button>
          )}
        </div>

        {/* Current Stars & Badge indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-white px-3 py-1 rounded-full shadow-xs bg-amber-500">
            Khu 8 – Đảo Kho Báu
          </span>
          <span className="text-xs font-black text-amber-950 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 inline-flex items-center gap-1 shadow-2xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{student.totalStars || 0} ⭐</span>
          </span>
        </div>
      </div>

      {/* 2. Hero Header Banner: 3D Cute Premium Treasure Island */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-3xl p-4 sm:p-6 text-white shadow-lg relative overflow-hidden mb-4 sm:mb-6 border-2 border-amber-300">
        {/* Soft background cover of zone image with semi-transparent overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
          <img
            src={zone.imageSrc || '/images/zone-8-treasure.png'}
            alt=""
            className="w-full h-full object-cover object-center filter blur-2xs"
          />
        </div>

        {/* Subtle background decoration */}
        <div className="absolute -right-10 -bottom-10 opacity-15 text-white pointer-events-none select-none text-9xl z-0">
          🏝️
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider text-yellow-100">
              <Sparkles className="w-3.5 h-3.5" /> KHU VUI CHƠI SỐ 8
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black drop-shadow-sm">
              KHU 8 – ĐẢO KHO BÁU TOÁN HỌC
            </h1>

            <div className="text-xs sm:text-sm font-black tracking-wider uppercase text-yellow-100">
              MATH TREASURE ISLAND
            </div>

            <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed pt-1">
              Khám phá hòn đảo huyền bí, giải mã 5 thử thách mật thư và săn lùng rương báu ngôi sao vàng lấp lánh!
            </p>
          </div>

          {/* 4:3 Zone Artwork Preview */}
          <div className="shrink-0 w-44 sm:w-56 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90 bg-amber-50 flex items-center justify-center relative">
            <img
              src={zone.imageSrc || '/images/zone-8-treasure.png'}
              alt="Đảo Kho Báu Toán Học"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* 3. TWO BIG GAME CARDS (16:9 Zero-Scroll Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 flex-1 items-stretch">
        {/* GAME CARD 1: GIẢI MÃ KHO BÁU BÍ ẨN */}
        <div className="bg-white rounded-3xl border-3 border-amber-300 hover:border-amber-500 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
          {/* Top Visual Header: Pirate Decoder Theme */}
          <div className="relative h-44 sm:h-52 bg-gradient-to-br from-amber-400 via-orange-400 to-amber-600 flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Glowing Secret Cipher Chest Graphic */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-amber-100/90 border-3 border-yellow-300 shadow-xl flex items-center justify-center text-4xl mb-2 group-hover:scale-110 transition-transform">
                🗝️
              </div>
              <span className="text-xs font-black text-amber-950 bg-yellow-300/90 px-3 py-0.5 rounded-full shadow-xs">
                5 THỬ THÁCH GIẢI MÃ
              </span>
            </div>

            {hasCipherBadge && (
              <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-yellow-800" /> Đã có huy hiệu
              </span>
            )}
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💎</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                    GIẢI MÃ KHO BÁU BÍ ẨN
                  </h2>
                  <div className="text-xs font-bold text-amber-700">
                    Mystery Treasure Decoder
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-medium mt-2.5 leading-relaxed">
                Vượt qua 5 ải hiểm trở: Hang động phép tính, Cánh cửa bí mật, Ba chiếc rương, Bản đồ bị lỗi và giải Mật mã kho báu mở rương vàng!
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                  💎 Hang động ngọc
                </span>
                <span className="text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                  🚪 Cửa bí mật
                </span>
                <span className="text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                  📦 3 Chiếc rương
                </span>
                <span className="text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                  🗺️ Sửa bản đồ
                </span>
                <span className="text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                  🔢 Mật mã rương
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-700">
                Thưởng +25 ⭐ & Huy hiệu
              </span>

              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onLaunchGame('treasure-cipher');
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 group-hover:scale-105"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>CHƠI NGAY</span>
              </button>
            </div>
          </div>
        </div>

        {/* GAME CARD 2: HÀNH TRÌNH SĂN KHO BÁU */}
        <div className="bg-white rounded-3xl border-3 border-teal-300 hover:border-teal-500 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
          {/* Top Visual Header: Exploration Theme */}
          <div className="relative h-44 sm:h-52 bg-gradient-to-br from-teal-400 via-emerald-500 to-cyan-600 flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Glowing Map & Compass Graphic */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-teal-100/90 border-3 border-teal-200 shadow-xl flex items-center justify-center text-4xl mb-2 group-hover:scale-110 transition-transform">
                🧭
              </div>
              <span className="text-xs font-black text-teal-950 bg-teal-200/90 px-3 py-0.5 rounded-full shadow-xs">
                5 CHẶNG THÁM HIỂM
              </span>
            </div>

            {hasHuntBadge && (
              <span className="absolute top-3 right-3 bg-teal-300 text-teal-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-teal-800" /> Đã có huy hiệu
              </span>
            )}
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🗺️</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                    HÀNH TRÌNH SĂN KHO BÁU
                  </h2>
                  <div className="text-xs font-bold text-teal-700">
                    Treasure Hunt Journey
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-medium mt-2.5 leading-relaxed">
                Khởi hành chuyến thám hiểm kỳ thú qua 5 vùng đất: Cầu đá thần kỳ, Khu rừng hình học, Bến cảng đo lường, Tháp đồng hồ và Rương báu cuối cùng!
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-md">
                  🌉 Cầu đá số
                </span>
                <span className="text-[10px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-md">
                  🌲 Rừng hình học
                </span>
                <span className="text-[10px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-md">
                  📏 Thước đo bến cảng
                </span>
                <span className="text-[10px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-md">
                  ⏰ Tháp đồng hồ
                </span>
                <span className="text-[10px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-md">
                  🏴‍☠️ Rương báu cuối
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-extrabold text-teal-700">
                Thưởng +25 ⭐ & Huy hiệu
              </span>

              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onLaunchGame('treasure-hunt');
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 group-hover:scale-105"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>CHƠI NGAY</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
