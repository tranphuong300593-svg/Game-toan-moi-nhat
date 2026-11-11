/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { RobotMathChibi } from '../chibi/RobotMathChibi';
import { soundService } from '../../services/audioService';
import {
  Star,
  Award,
  Sparkles,
  ArrowRight,
  Volume2,
  CheckCircle2,
  Flame,
  Gamepad2,
  BookOpen,
  MapPin,
  Trophy,
  FileCheck,
  Heart
} from 'lucide-react';

interface HomeDashboardProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onNavigate: (section: string) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  student,
  langMode,
  onNavigate,
}) => {
  /**
   * 6 KHU VỰC – 6 MÀU RIÊNG BIỆT (Chuẩn xác theo quy định):
   * Khu vực 1: Xanh dương #2563EB
   * Khu vực 2: Vàng cam #F59E0B
   * Khu vực 3: Xanh lá #22C55E
   * Khu vực 4: Hồng #EC4899
   * Khu vực 5: Tím #8B5CF6
   * Khu vực 6: Xanh ngọc #06B6D4
   */
  const ZONES = [
    {
      id: 'lessons',
      number: 1,
      nameVi: 'HỌC THEO BÀI',
      nameEn: 'LEARN BY LESSON',
      descVi: '41 bài học chuẩn SGK Kết nối tri thức. Khám phá cùng Robot, học từ vựng và luyện tập tương tác!',
      descEn: 'All 41 textbook lessons with visual interactive demos, vocabulary and self-paced practice.',
      hexColor: '#2563EB',
      colorName: 'Xanh dương',
      bgImage: '/images/area-lessons.png',
      bgPosition: 'center center',
      tag: '41 Bài Học Chuẩn SGK',
      badgeBg: 'bg-blue-50 text-[#2563EB] border-blue-200',
      btnBg: 'bg-[#2563EB] hover:bg-blue-700 text-white',
      cardBorder: 'border-blue-200 hover:border-[#2563EB]',
      glowColor: 'hover:shadow-blue-200/70',
      headerGradient: 'from-blue-600 to-blue-500',
      iconEmoji: '📚',
      customIcon: (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-[#2563EB] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
          <BookOpen className="w-8 h-8 drop-shadow" />
        </div>
      ),
    },
    {
      id: 'topics',
      number: 2,
      nameVi: 'HỌC THEO CHỦ ĐỀ',
      nameEn: 'LEARN BY TOPIC',
      descVi: '10 đảo tri thức lớn: Số đến 10, Hình phẳng, Phép cộng trừ, Hình khối, Số đến 100, Đo độ dài, Đồng hồ & Lịch!',
      descEn: 'Explore 10 themed math islands covering numbers, geometry, operations and measurements.',
      hexColor: '#F59E0B',
      colorName: 'Vàng cam',
      bgImage: '/images/area-topics.png',
      bgPosition: 'center center',
      tag: '10 Chủ Đề Tri Thức',
      badgeBg: 'bg-amber-50 text-[#D97706] border-amber-200',
      btnBg: 'bg-[#F59E0B] hover:bg-amber-600 text-white',
      cardBorder: 'border-amber-200 hover:border-[#F59E0B]',
      glowColor: 'hover:shadow-amber-200/70',
      headerGradient: 'from-amber-500 to-amber-400',
      iconEmoji: '🏝️',
      customIcon: (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-[#F59E0B] text-white flex items-center justify-center shadow-lg shadow-amber-500/30 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
          <MapPin className="w-8 h-8 drop-shadow" />
        </div>
      ),
    },
    {
      id: 'games',
      number: 3,
      nameVi: 'KHO TRÒ CHƠI',
      nameEn: 'GAME WORLD',
      descVi: 'Thỏ vượt suối, Đoàn tàu số, Đua xe siêu tốc, Câu cá băng, Đảo kho báu, Xây cầu, Đồng hồ phép thuật!',
      descEn: 'Engaging animated math games with physics, friendly animals, points and instant rewards.',
      hexColor: '#22C55E',
      colorName: 'Xanh lá',
      bgImage: '/images/area-games.png',
      bgPosition: 'center center',
      tag: '10 Trò Chơi Toán Học',
      badgeBg: 'bg-emerald-50 text-[#16A34A] border-emerald-200',
      btnBg: 'bg-[#22C55E] hover:bg-green-600 text-white',
      cardBorder: 'border-green-200 hover:border-[#22C55E]',
      glowColor: 'hover:shadow-green-200/70',
      headerGradient: 'from-green-500 to-emerald-400',
      iconEmoji: '🎮',
      customIcon: (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-[#22C55E] text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
          <Gamepad2 className="w-8 h-8 drop-shadow" />
        </div>
      ),
    },
    {
      id: 'daily',
      number: 4,
      nameVi: 'THỬ THÁCH MỖI NGÀY',
      nameEn: 'DAILY CHALLENGE',
      descVi: '5 câu hỏi toán học tự động mỗi ngày theo giờ Việt Nam để duy trì chuỗi chăm học và nhận thưởng sao!',
      descEn: 'Daily 5-question math challenge with streaks and star rewards for curious learners.',
      hexColor: '#EC4899',
      colorName: 'Hồng',
      bgImage: '/images/area-daily.png',
      bgPosition: 'center center',
      tag: 'Chuỗi Chăm Học Mỗi Ngày',
      badgeBg: 'bg-pink-50 text-[#DB2777] border-pink-200',
      btnBg: 'bg-[#EC4899] hover:bg-pink-600 text-white',
      cardBorder: 'border-pink-200 hover:border-[#EC4899]',
      glowColor: 'hover:shadow-pink-200/70',
      headerGradient: 'from-pink-500 to-rose-400',
      iconEmoji: '🔥',
      customIcon: (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-[#EC4899] text-white flex items-center justify-center shadow-lg shadow-pink-500/30 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
          <Flame className="w-8 h-8 drop-shadow" />
        </div>
      ),
    },
    {
      id: 'achievements',
      number: 5,
      nameVi: 'THÀNH TÍCH CỦA BÉ',
      nameEn: 'MY ACHIEVEMENTS',
      descVi: 'Xem bảng tổng kết sao thưởng, bộ sưu tập cúp vàng, cà rốt, chìa khóa vàng và tiến độ tích lũy!',
      descEn: 'Trophy showcase, collected carrots, golden cups, keys, badges and personal progress.',
      hexColor: '#8B5CF6',
      colorName: 'Tím',
      bgImage: '/images/area-achievements.png',
      bgPosition: 'center center',
      tag: `${student.badges.length} Huy Hiệu Đạt Được`,
      badgeBg: 'bg-purple-50 text-[#7C3AED] border-purple-200',
      btnBg: 'bg-[#8B5CF6] hover:bg-purple-600 text-white',
      cardBorder: 'border-purple-200 hover:border-[#8B5CF6]',
      glowColor: 'hover:shadow-purple-200/70',
      headerGradient: 'from-purple-500 to-violet-400',
      iconEmoji: '🏆',
      customIcon: (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-[#8B5CF6] text-white flex items-center justify-center shadow-lg shadow-purple-500/30 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
          <Trophy className="w-8 h-8 drop-shadow" />
        </div>
      ),
    },
    {
      id: 'review',
      number: 6,
      nameVi: 'ÔN TẬP TỔNG HỢP',
      nameEn: 'MATH REVIEW',
      descVi: 'Đề ôn tập Giữa kì I, Cuối kì I, Giữa kì II và Cuối năm. Hoàn thành để nhận Giấy khen Điện tử danh dự!',
      descEn: 'Comprehensive periodic exams with automated grading and proud Certificate of Honor.',
      hexColor: '#06B6D4',
      colorName: 'Xanh ngọc',
      bgImage: '/images/area-review.png',
      bgPosition: 'center center',
      tag: 'Giấy Khen Điện Tử',
      badgeBg: 'bg-cyan-50 text-[#0891B2] border-cyan-200',
      btnBg: 'bg-[#06B6D4] hover:bg-cyan-600 text-white',
      cardBorder: 'border-cyan-200 hover:border-[#06B6D4]',
      glowColor: 'hover:shadow-cyan-200/70',
      headerGradient: 'from-cyan-500 to-teal-400',
      iconEmoji: '📝',
      customIcon: (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-[#06B6D4] text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
          <FileCheck className="w-8 h-8 drop-shadow" />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-8 px-3 sm:px-4 md:px-0 overflow-x-hidden">
      {/* 1. HÌNH BÌA Ở ĐẦU TRANG CHỦ (Tỷ lệ 16:9 chuẩn xác, sắc nét, không méo, không đè chữ/nút) */}
      <section className="w-full flex justify-center">
        <div className="w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-sky-300/40 bg-slate-900 transition-all duration-300 hover:shadow-sky-200/60">
          <img
            src="/images/cover.png"
            alt="Vương Quốc Toán Học Song Ngữ - Bìa Sách"
            className="w-full h-full object-contain sm:object-cover"
            loading="eager"
          />
        </div>
      </section>

      {/* 2. PHẦN CHÀO MỪNG SINH ĐỘNG (Hero Welcome 3D Chibi) */}
      <section className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white ring-4 ring-sky-200/50 bg-gradient-to-br from-sky-200 via-sky-100 to-indigo-100 p-6 md:p-8">
        {/* Subtle Rainbow Glow Background */}
        <div className="absolute -top-24 -right-16 w-96 h-96 rounded-full bg-gradient-to-tr from-rose-300/30 via-amber-200/30 to-sky-300/30 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-200/35 to-emerald-200/30 blur-2xl pointer-events-none" />

        {/* Fluffy White Clouds (SVG) */}
        <div className="absolute top-3 left-8 opacity-70 pointer-events-none hidden sm:block">
          <svg className="w-24 h-12 text-white" viewBox="0 0 100 50" fill="currentColor">
            <path d="M 20 40 Q 10 40 10 30 Q 10 20 22 20 Q 25 10 38 12 Q 50 8 60 18 Q 72 15 78 26 Q 88 28 85 40 Z" />
          </svg>
        </div>
        <div className="absolute bottom-2 right-12 opacity-65 pointer-events-none hidden sm:block">
          <svg className="w-28 h-14 text-white" viewBox="0 0 100 50" fill="currentColor">
            <path d="M 15 42 Q 8 42 8 32 Q 8 22 20 22 Q 24 12 36 14 Q 48 10 58 20 Q 70 17 76 28 Q 86 30 83 42 Z" />
          </svg>
        </div>

        {/* Floating Playful Math Badges & Shapes (1, 2, 3, +, −, ⭐, ▲, ●, ■) */}
        <div className="absolute top-4 right-28 hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs text-amber-500 font-black text-xs shadow-sm transform rotate-6 animate-pulse">
          <span>⭐</span>
          <span>1 2 3</span>
        </div>
        <div className="absolute bottom-4 left-32 hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs text-indigo-600 font-black text-xs shadow-sm transform -rotate-6">
          <span className="text-rose-500 font-bold">+</span>
          <span className="text-sky-500 font-bold">−</span>
          <span className="text-amber-500">▲</span>
          <span className="text-emerald-500">●</span>
          <span className="text-purple-500">■</span>
        </div>

        {/* Main Content Layout */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Mascot Robot Waving & Greeting */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative group shrink-0">
              <RobotMathChibi
                expression="waving"
                size="lg"
                className="filter drop-shadow-xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 bg-yellow-300 text-yellow-950 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-yellow-800" />
                <span>CHÀO MỪNG BẠN ĐẾN VỚI VƯƠNG QUỐC TOÁN HỌC!</span>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-heading tracking-tight">
                Xin chào, <span className="text-[#2563EB]">{student.fullName}</span>! 👋
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs md:text-sm font-bold text-slate-700">
                <span className="bg-white/90 text-slate-800 px-3 py-1 rounded-xl shadow-xs border border-sky-100 flex items-center gap-1">
                  <span>Lớp:</span>
                  <strong className="text-[#2563EB] text-sm">{student.className}</strong>
                </span>
                <span className="hidden sm:inline text-slate-400">·</span>
                <span className="bg-white/90 text-slate-700 px-3 py-1 rounded-xl shadow-xs border border-sky-100 text-xs">
                  Trường TH Trần Đại Nghĩa · P. Hòa Xuân, Đà Nẵng
                </span>
              </div>

              <p className="text-sm md:text-base text-slate-700 font-medium leading-relaxed bg-white/70 backdrop-blur-xs p-3 rounded-2xl border border-white shadow-xs">
                “Hôm nay chúng mình cùng khám phá những điều kỳ diệu của Toán học nhé!” ✨
              </p>
            </div>
          </div>

          {/* Quick Badges & Total Stars Card */}
          <div className="flex flex-row sm:flex-col gap-3 shrink-0 w-full sm:w-auto justify-center">
            <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-3.5 border-2 border-amber-200 shadow-md text-center min-w-36 flex-1 sm:flex-initial">
              <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Tổng số sao</div>
              <div className="text-2xl md:text-3xl font-black text-amber-500 flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-6 h-6 fill-amber-400 text-amber-500 animate-pulse" />
                <span>{student.totalStars}</span>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-3.5 border-2 border-purple-200 shadow-md text-center min-w-36 flex-1 sm:flex-initial">
              <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Huy hiệu đạt được</div>
              <div className="text-2xl md:text-3xl font-black text-[#8B5CF6] flex items-center justify-center gap-1 mt-0.5">
                <Award className="w-6 h-6 text-[#8B5CF6]" />
                <span>{student.badges.length}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 6 KHU VỰC – 6 MÀU RIÊNG BIỆT (3 CỘT × 2 HÀNG TRÊN MÁY TÍNH / TV) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 font-heading flex items-center gap-2">
              <span className="w-3 h-8 rounded-full bg-[#2563EB]" />
              6 KHU VỰC TOÁN HỌC KỲ THÚ
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium ml-5">
              Chọn một khu vực bên dưới để bắt đầu chuyến phiêu lưu hôm nay!
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            TẤT CẢ 6 KHU VỰC ĐÃ MỞ SẴN
          </span>
        </div>

        {/* Grid 3 Columns × 2 Rows on Desktop / TV */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ZONES.map((zone) => (
            <div
              key={zone.id}
              onClick={() => {
                soundService.playClick();
                onNavigate(zone.id);
              }}
              className={`group bg-white rounded-3xl p-6 border-3 ${zone.cardBorder} shadow-md hover:shadow-2xl ${zone.glowColor} transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-2 hover:scale-[1.01] relative overflow-hidden`}
              style={{
                // Subtle top border bar with exact hex color
                borderTopColor: zone.hexColor,
                borderTopWidth: '6px',
              }}
            >
              {/* LỚP 1 – HÌNH NỀN 3D CHIBI (Phủ vừa khung, background-size: cover, không méo) */}
              {zone.bgImage && (
                <div
                  className="absolute inset-0 pointer-events-none bg-cover bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{
                    backgroundImage: `url("${zone.bgImage}")`,
                    backgroundPosition: zone.bgPosition || 'center center',
                    backgroundSize: 'cover',
                  }}
                />
              )}

              {/* LỚP 2 – LỚP PHỦ LÀM DỊU HÌNH (Gradient trắng kem bán trong suốt 35-45%, vùng chữ sáng dịu, tranh 3D vẫn sắc nét) */}
              {zone.bgImage && (
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.72) 48%, rgba(255, 255, 255, 0.90) 100%)',
                  }}
                />
              )}

              {/* Soft decorative background bubble */}
              <div
                className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-5 pointer-events-none group-hover:scale-150 transition-transform duration-500"
                style={{ backgroundColor: zone.hexColor }}
              />

              {/* LỚP 3 – NỘI DUNG CHỮ & NÚT BẤM (Nằm trên cùng với z-index, chữ sắc nét, đậm đà, nền mềm dịu) */}
              <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                {/* Card Top: 3D Chibi Icon, Number Badge and Tag */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    {zone.customIcon}
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className="text-[11px] font-black text-white px-2.5 py-0.5 rounded-full shadow-xs"
                        style={{ backgroundColor: zone.hexColor }}
                      >
                        Khu vực {zone.number}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shadow-2xs ${zone.badgeBg}`}>
                        {zone.tag}
                      </span>
                    </div>
                  </div>

                  {/* Card Title & English Subtitle & Description với nền mềm bo góc thanh lịch */}
                  <div className="space-y-1 bg-white/85 backdrop-blur-[2px] p-3 rounded-2xl border border-white/90 shadow-2xs">
                    <h3
                      className="text-xl font-black font-heading transition-colors"
                      style={{ color: '#0F172A' }}
                    >
                      {zone.nameVi}
                    </h3>
                    <div
                      className="text-xs font-black tracking-wider uppercase"
                      style={{ color: zone.hexColor }}
                    >
                      {zone.nameEn}
                    </div>

                    {/* Description */}
                    <p className="text-xs md:text-sm text-slate-800 font-semibold leading-relaxed pt-1">
                      {langMode === 'en' ? zone.descEn : zone.descVi}
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Action Button & Color Indicator */}
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between mt-auto bg-white/80 backdrop-blur-[2px] px-3 py-2 rounded-2xl border border-white/80 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-xs"
                      style={{ backgroundColor: zone.hexColor }}
                    />
                    <span>Màu {zone.colorName}</span>
                  </div>

                  <div
                    className={`inline-flex items-center gap-1.5 text-xs font-black px-4 py-2 rounded-xl shadow-sm transition-all duration-300 ${zone.btnBg} group-hover:shadow-md transform group-hover:scale-105`}
                  >
                    <span>Khám phá ngay</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HÌNH CHÂN TRANG Ở CUỐI TRANG CHỦ (Tỷ lệ 16:9 chuẩn xác, sắc nét, không méo, khi học sinh kéo xuống sẽ nhìn thấy) */}
      <section className="w-full flex flex-col items-center pt-4 space-y-4">
        <div className="w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-amber-300/40 bg-slate-900 transition-all duration-300 hover:shadow-amber-200/60">
          <img
            src="/images/ending.png"
            alt="Vương Quốc Toán Học Song Ngữ - Chân Trang"
            className="w-full h-full object-contain sm:object-cover"
            loading="lazy"
          />
        </div>

        {/* Dòng chữ dưới hình chân trang của Trang chủ */}
        <div className="w-full max-w-5xl text-center px-6 py-4 rounded-2xl bg-white/90 backdrop-blur-xs border border-sky-200/80 shadow-sm flex items-center justify-center gap-2.5">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500 shrink-0 animate-pulse" />
          <p className="text-xs sm:text-sm md:text-base font-bold text-blue-900 font-['Be_Vietnam_Pro'] tracking-tight leading-relaxed">
            Website được sáng tạo bởi các cô giáo Khối 1 – Trường Tiểu học Trần Đại Nghĩa, phường Hòa Xuân, TP. Đà Nẵng.
          </p>
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0 hidden sm:inline" />
        </div>
      </section>
    </div>
  );
};

