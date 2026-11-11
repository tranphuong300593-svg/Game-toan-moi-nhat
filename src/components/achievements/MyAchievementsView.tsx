/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProfile, LanguageMode, LessonCertificate } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundService } from '../../services/audioService';
import { LessonCertificateModal } from './LessonCertificateModal';
import { RobotMathChibi } from '../chibi/RobotMathChibi';
import confetti from 'canvas-confetti';
import {
  Star,
  ArrowLeft,
  Award,
  Calendar,
  BookOpen,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  Gift,
  Volume2,
  ChevronDown,
  ChevronUp,
  Heart,
} from 'lucide-react';

interface MyAchievementsViewProps {
  student: StudentProfile;
  langMode?: LanguageMode;
  onBack: () => void;
  onNavigateToLearn?: () => void;
}

interface StarMilestone {
  starsRequired: number;
  titleVi: string;
  titleEn: string;
  badgeName: string;
  descVi: string;
  iconEmoji: string;
  praiseEn: string;
  bgGrad: string;
  borderTheme: string;
}

const MILESTONES: StarMilestone[] = [
  {
    starsRequired: 5,
    titleVi: 'Ngôi sao chăm chỉ',
    titleEn: 'Diligent Star',
    badgeName: 'Ngôi Sao Chăm Chỉ',
    descVi: 'Bé đã hoàn thành 5 bài học đầu tiên thật chăm chỉ!',
    iconEmoji: '🌱',
    praiseEn: 'Wonderful! You are a math star!',
    bgGrad: 'from-emerald-50 to-teal-50',
    borderTheme: 'border-emerald-300',
  },
  {
    starsRequired: 10,
    titleVi: 'Ngôi sao tỏa sáng',
    titleEn: 'Shining Star',
    badgeName: 'Ngôi Sao Tỏa Sáng',
    descVi: 'Bé đã đạt mốc 10 bài học, tự tin tỏa sáng!',
    iconEmoji: '🌟',
    praiseEn: 'Great job! Keep shining!',
    bgGrad: 'from-amber-50 to-yellow-50',
    borderTheme: 'border-amber-300',
  },
  {
    starsRequired: 20,
    titleVi: 'Ngôi sao xuất sắc',
    titleEn: 'Brilliant Star',
    badgeName: 'Ngôi Sao Xuất Sắc',
    descVi: 'Bé xuất sắc chinh phục gần một nửa chặng đường!',
    iconEmoji: '💎',
    praiseEn: "You're amazing! Outstanding work!",
    bgGrad: 'from-purple-50 to-indigo-50',
    borderTheme: 'border-purple-300',
  },
  {
    starsRequired: 41,
    titleVi: 'Nhà chinh phục Toán học',
    titleEn: 'Math Conqueror',
    badgeName: 'Nhà Chinh Phục Toán Học',
    descVi: 'Đỉnh cao tri thức! Bé đã hoàn thành trọn vẹn cả 41 bài học Toán lớp 1!',
    iconEmoji: '👑',
    praiseEn: 'Congratulations! You conquered all math lessons!',
    bgGrad: 'from-rose-50 to-amber-50',
    borderTheme: 'border-rose-300',
  },
];

export const MyAchievementsView: React.FC<MyAchievementsViewProps> = ({
  student,
  onBack,
  onNavigateToLearn,
}) => {
  // Load valid certificates for this student
  const certificates = StorageService.getLessonCertificates(student.id);

  // Exactly 1 star per completed lesson, max 41 stars for 41 lessons
  const lessonStars = Math.min(41, certificates.length);

  // State for viewing full certificate modal
  const [selectedCert, setSelectedCert] = useState<LessonCertificate | null>(null);

  // Toggle show all certificates if more than 6
  const [showAllCerts, setShowAllCerts] = useState(false);

  // State for milestone gift celebration popup
  const [activeGiftModal, setActiveGiftModal] = useState<StarMilestone | null>(null);

  // Open full-screen certificate modal
  const handleOpenCertificate = (cert: LessonCertificate) => {
    soundService.playClick();
    setSelectedCert(cert);
  };

  // Open milestone gift modal & speak English praise
  const handleOpenGift = (milestone: StarMilestone, isUnlocked: boolean) => {
    soundService.playClick();
    if (isUnlocked) {
      soundService.playMagicChime();
      soundService.playApplause();
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#FBBF24', '#8B5CF6', '#10B981', '#EC4899'],
      });
      setTimeout(() => {
        soundService.speakEn(milestone.praiseEn, { rate: 0.92, pitch: 1.1 });
      }, 300);
      setActiveGiftModal(milestone);
    }
  };

  const displayedCerts = showAllCerts ? certificates : certificates.slice(0, 6);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 select-none pb-10 px-3 sm:px-4 md:px-0">
      {/* 1. TOP HEADER & NAVIGATION */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 border-2 border-purple-200">
        {/* Soft decorative background circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-yellow-300/15 blur-lg pointer-events-none" />

        {/* Back Button & Title Area */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-slate-800 bg-white/95 hover:bg-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-[#2563EB]" />
            <span>Trang chủ</span>
          </button>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-yellow-300 text-yellow-950 font-black text-[10px] sm:text-xs px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-yellow-800" />
              <span>TRƯỜNG TH TRẦN ĐẠI NGHĨA • ĐÀ NẴNG</span>
            </div>
            <h1 className="font-['Be_Vietnam_Pro'] font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight drop-shadow-sm">
              KHO BÁU THÀNH TÍCH CỦA BÉ
            </h1>
            <p className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm font-bold text-yellow-200 italic">
              ✨ Mỗi bài học – Một niềm vui! ✨
            </p>
          </div>
        </div>

        {/* Student Quick Identity Pill */}
        <div className="bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/30 text-center shrink-0">
          <div className="text-[11px] text-purple-100 font-bold uppercase">Học sinh</div>
          <div className="font-['Be_Vietnam_Pro'] font-black text-sm sm:text-base text-white">
            {student.fullName}
          </div>
          <div className="text-xs font-semibold text-yellow-200 mt-0.5">
            Lớp: <strong className="text-white">{student.className}</strong>
          </div>
        </div>
      </div>

      {/* 2. PHẦN 1: KHO NGÔI SAO & TỔNG SỐ GIẤY CHỨNG NHẬN (2 CỘT CÂN ĐỐI) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Cột Trái: KHO NGÔI SAO CỦA BÉ với Rương kho báu tím viền vàng */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-purple-50 to-white rounded-3xl p-6 border-3 border-purple-300 shadow-md flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            {/* 3D Chibi Lavender & Gold Treasure Chest Illustration */}
            <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
              <svg
                viewBox="0 0 160 140"
                className="w-full h-full drop-shadow-lg animate-pulse-subtle"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="chestPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A855F7" />
                    <stop offset="60%" stopColor="#7E22CE" />
                    <stop offset="100%" stopColor="#581C87" />
                  </linearGradient>
                  <linearGradient id="chestGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDE047" />
                    <stop offset="50%" stopColor="#EAB308" />
                    <stop offset="100%" stopColor="#CA8A04" />
                  </linearGradient>
                  <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#EAB308" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Golden Glow radiating from chest */}
                <ellipse cx="80" cy="55" rx="55" ry="35" fill="url(#starGlow)" />

                {/* Floating sparkling stars emerging from chest */}
                <g className="animate-bounce">
                  <path
                    d="M 80 18 L 84 32 L 98 32 L 87 40 L 91 54 L 80 45 L 69 54 L 73 40 L 62 32 L 76 32 Z"
                    fill="url(#chestGold)"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                  <circle cx="50" cy="35" r="4" fill="#FDE047" />
                  <circle cx="110" cy="30" r="3.5" fill="#FDE047" />
                </g>

                {/* Chest Base (Purple Lavender) */}
                <path
                  d="M 25 65 L 135 65 L 128 120 C 128 126 122 130 115 130 L 45 130 C 38 130 32 126 32 120 Z"
                  fill="url(#chestPurple)"
                  stroke="#4C1D95"
                  strokeWidth="3.5"
                />

                {/* Chest Gold Bands */}
                <rect x="42" y="65" width="14" height="65" fill="url(#chestGold)" stroke="#A16207" strokeWidth="1.5" />
                <rect x="104" y="65" width="14" height="65" fill="url(#chestGold)" stroke="#A16207" strokeWidth="1.5" />
                <line x1="25" y1="65" x2="135" y2="65" stroke="url(#chestGold)" strokeWidth="4" />

                {/* Chest Lid (Slightly tilted open) */}
                <path
                  d="M 22 65 C 22 45 45 35 80 35 C 115 35 138 45 138 65 Z"
                  fill="url(#chestPurple)"
                  stroke="#4C1D95"
                  strokeWidth="3.5"
                />
                <path
                  d="M 40 65 C 40 45 55 37 80 37 C 105 37 120 45 120 65"
                  stroke="url(#chestGold)"
                  strokeWidth="6"
                  fill="none"
                />

                {/* Center Golden Lock Plate */}
                <rect x="71" y="60" width="18" height="22" rx="4" fill="url(#chestGold)" stroke="#A16207" strokeWidth="2" />
                <circle cx="80" cy="68" r="3" fill="#451A03" />
                <path d="M 80 71 L 80 77" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Star count and header */}
            <div className="flex-1 space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-200/70 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                PHẦN 1 • KHO NGÔI SAO CỦA BÉ
              </div>
              <h2 className="font-['Be_Vietnam_Pro'] font-black text-xl sm:text-2xl text-purple-950">
                NGÔI SAO CỦA BÉ
              </h2>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-['Be_Vietnam_Pro'] font-black text-2xl sm:text-3xl px-4 py-1.5 rounded-2xl shadow-md border-2 border-yellow-200">
                <Star className="w-7 h-7 fill-yellow-200 text-white animate-pulse" />
                <span>⭐ {lessonStars} ngôi sao</span>
              </div>
            </div>
          </div>

          {/* Quy tắc nhận sao rõ ràng */}
          <div className="mt-4 pt-3 border-t border-purple-200/80 bg-white/80 p-3 rounded-2xl space-y-1 text-xs text-purple-950 font-semibold leading-relaxed">
            <p className="font-bold text-purple-800 flex items-center gap-1.5">
              <span>📌</span> Quy tắc nhận sao:
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700">
              <li>Hoàn thành một bài học lần đầu: nhận đúng <strong>1 ngôi sao vàng</strong>.</li>
              <li>Học lại bài cũ: ôn tập vui vẻ, không cộng thêm sao trùng.</li>
              <li>Tối đa <strong>41 ngôi sao</strong> từ 41 bài học Toán lớp 1.</li>
            </ul>
          </div>
        </div>

        {/* Cột Phải: BỘ TỔNG HỢP GIẤY CHỨNG NHẬN ĐÃ ĐẠT */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-sky-50 to-white rounded-3xl p-6 border-3 border-amber-300 shadow-md flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            {/* Certificate Icon with ribbons */}
            <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-400 text-white flex flex-col items-center justify-center shadow-lg border-4 border-yellow-200">
              <span className="text-4xl drop-shadow-md">📜</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-yellow-100 mt-0.5">
                Chứng nhận
              </span>
            </div>

            <div className="flex-1 space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-200/70 px-3 py-1 rounded-full">
                <Award className="w-3.5 h-3.5 text-amber-800" />
                TỔNG SỐ GIẤY CHỨNG NHẬN
              </div>
              <h2 className="font-['Be_Vietnam_Pro'] font-black text-xl sm:text-2xl text-slate-900">
                BÀI HỌC HOÀN THÀNH
              </h2>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-['Be_Vietnam_Pro'] font-black text-2xl sm:text-3xl px-4 py-1.5 rounded-2xl shadow-md border-2 border-sky-200">
                <span>📜 {certificates.length} / 41 bài</span>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-4 pt-3 border-t border-amber-200/80 bg-white/80 p-3 rounded-2xl space-y-1 text-xs text-slate-700 font-semibold leading-relaxed">
            <p className="font-bold text-sky-800 flex items-center gap-1.5">
              <span>🏫</span> Trường Tiểu học Trần Đại Nghĩa:
            </p>
            <p className="text-slate-600">
              Bé <strong>{student.fullName}</strong> (Lớp {student.className}) đã hoàn thành{' '}
              <strong className="text-[#2563EB]">{certificates.length}</strong> bài học. Hãy cùng sưu tập trọn bộ 41 giấy chứng nhận danh dự nhé!
            </p>
          </div>
        </div>
      </div>

      {/* 3. PHẦN 2: BỘ SƯU TẬP GIẤY CHỨNG NHẬN (CÁC THẺ GỌN GÀNG) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl shadow-xs">
              📜
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-['Be_Vietnam_Pro']">
                PHẦN 2 • BỘ SƯU TẬP GIẤY CHỨNG NHẬN
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Danh sách các bài học bé đã hoàn thành ({certificates.length} giấy chứng nhận đã lưu)
              </p>
            </div>
          </div>

          {certificates.length > 0 && (
            <span className="text-xs font-black text-purple-700 bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-200 self-start sm:self-auto shadow-2xs">
              ⭐ Đã nhận {certificates.length} / 41 giấy
            </span>
          )}
        </div>

        {/* Empty State */}
        {certificates.length === 0 ? (
          <div className="text-center py-10 px-4 space-y-3 bg-slate-50/70 rounded-2xl border-2 border-dashed border-slate-200">
            <div className="flex justify-center">
              <RobotMathChibi expression="waving" size="md" className="drop-shadow-xs" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base sm:text-lg font-black text-slate-800 font-['Be_Vietnam_Pro']">
                Bé chưa có giấy chứng nhận nào!
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed">
                Bé hãy vào mục <strong>HỌC BÀI</strong>, trả lời trọn vẹn 5 câu hỏi của một bài để nhận <strong>1 ngôi sao vàng</strong> và mở khóa giấy chứng nhận đầu tiên nhé!
              </p>
            </div>
            {onNavigateToLearn && (
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onNavigateToLearn();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Vào Học Bài Ngay 🚀</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Grid of Certificates Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
              {displayedCerts.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-gradient-to-br from-amber-50/50 via-white to-purple-50/40 rounded-2xl p-4 border-2 border-amber-200 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between gap-3"
                >
                  {/* Top Bar: Icon, Star, Lesson ID */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100/80 px-2.5 py-0.5 rounded-full border border-purple-200">
                      Bài {cert.lessonId}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>1 Sao Vàng</span>
                    </div>
                  </div>

                  {/* Title & Date */}
                  <div className="space-y-1">
                    <h4 className="font-['Be_Vietnam_Pro'] font-black text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
                      {cert.lessonTitle}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Ngày hoàn thành: <strong>{cert.formattedDate}</strong></span>
                    </div>
                  </div>

                  {/* Action Button: XEM GIẤY CHỨNG NHẬN */}
                  <button
                    type="button"
                    onClick={() => handleOpenCertificate(cert)}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-['Be_Vietnam_Pro'] font-black text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>📜 XEM GIẤY CHỨNG NHẬN</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Show more / Collapse if > 6 certificates */}
            {certificates.length > 6 && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    soundService.playClick();
                    setShowAllCerts(!showAllCerts);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-['Be_Vietnam_Pro'] font-black text-xs transition-all cursor-pointer shadow-2xs"
                >
                  {showAllCerts ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      <span>Thu gọn danh sách</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      <span>Xem tất cả {certificates.length} giấy chứng nhận</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. PHẦN 3: QUÀ TẶNG NGÔI SAO (4 PHẦN THƯỞNG THEO MỐC SAO) */}
      <div className="bg-gradient-to-br from-amber-50/70 via-white to-purple-50/50 rounded-3xl p-5 sm:p-7 shadow-sm border-2 border-amber-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center text-xl shadow-xs">
              🎁
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-['Be_Vietnam_Pro']">
                PHẦN 3 • QUÀ TẶNG NGÔI SAO
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                4 phần thưởng đặc biệt mở khóa khi bé chăm chỉ tích lũy đủ số sao
              </p>
            </div>
          </div>

          <span className="text-xs font-black text-amber-800 bg-amber-100/80 px-3.5 py-1.5 rounded-full border border-amber-300 self-start sm:self-auto">
            ⭐ Tiến độ: {lessonStars} / 41 sao
          </span>
        </div>

        {/* 4 Milestone Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {MILESTONES.map((m) => {
            const isUnlocked = lessonStars >= m.starsRequired;
            const starsRemaining = Math.max(0, m.starsRequired - lessonStars);

            return (
              <div
                key={m.starsRequired}
                onClick={() => handleOpenGift(m, isUnlocked)}
                className={`relative rounded-2xl p-4 border-2 transition-all flex flex-col justify-between gap-3 ${
                  isUnlocked
                    ? `bg-gradient-to-br ${m.bgGrad} ${m.borderTheme} shadow-sm hover:shadow-md cursor-pointer transform hover:-translate-y-1`
                    : 'bg-slate-50/80 border-slate-200 opacity-60 cursor-default'
                }`}
              >
                {/* Header: Milestone badge & lock status */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-amber-400 text-amber-950 font-bold'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    ⭐ Mốc {m.starsRequired} sao
                  </span>

                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <Unlock className="w-3 h-3 text-emerald-600" />
                      Đã mở
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3 text-slate-400" />
                      Khóa
                    </span>
                  )}
                </div>

                {/* 3D Icon & Title */}
                <div className="text-center space-y-1.5 py-2">
                  <div className="text-4xl sm:text-5xl drop-shadow-sm transition-transform group-hover:scale-110">
                    {m.iconEmoji}
                  </div>
                  <h3 className="font-['Be_Vietnam_Pro'] font-black text-base text-slate-900">
                    {m.titleVi}
                  </h3>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {m.titleEn}
                  </div>
                  <p className="text-[11px] text-slate-600 font-semibold leading-tight pt-1">
                    {m.descVi}
                  </p>
                </div>

                {/* Bottom status line */}
                <div className="pt-2 border-t border-slate-200/60 text-center">
                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenGift(m, true);
                      }}
                      className="w-full py-1.5 px-3 rounded-xl bg-white hover:bg-amber-100 text-amber-800 border border-amber-300 font-['Be_Vietnam_Pro'] font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1 shadow-2xs active:scale-95"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Nghe khen ngợi</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-500">
                      Cần thêm <strong>{starsRemaining}</strong> sao nữa
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. CUỐI TRANG: LỜI ĐỘNG VIÊN & NÚT ĐIỀU HƯỚNG */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 text-center space-y-4">
        <div className="space-y-1 max-w-lg mx-auto">
          <div className="text-3xl animate-bounce">🎉</div>
          <h3 className="font-['Be_Vietnam_Pro'] font-black text-xl sm:text-2xl text-emerald-600 tracking-tight">
            Con thật tuyệt vời!
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
            Mỗi bài học là một bước tiến mới. Thầy cô Trường TH Trần Đại Nghĩa luôn tự hào và đồng hành cùng bé!
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              onBack();
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>QUAY VỀ TRANG CHỦ</span>
          </button>

          {onNavigateToLearn && (
            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                onNavigateToLearn();
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>TIẾP TỤC HỌC BÀI 🚀</span>
            </button>
          )}
        </div>
      </div>

      {/* MODAL 1: FULL SCREEN PRINTABLE CERTIFICATE */}
      {selectedCert && (
        <LessonCertificateModal
          certificate={selectedCert}
          isOpen={Boolean(selectedCert)}
          onClose={() => setSelectedCert(null)}
          isNewAward={false}
        />
      )}

      {/* MODAL 2: CELEBRATION MODAL FOR STAR MILESTONE GIFT */}
      {activeGiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-amber-300 text-center space-y-4 animate-hop">
            {/* Top Gift Emoji & Chibi */}
            <div className="flex justify-center items-center gap-2">
              <span className="text-5xl">{activeGiftModal.iconEmoji}</span>
              <RobotMathChibi expression="cheering" size="sm" className="scale-110" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                <Gift className="w-3.5 h-3.5 text-amber-600" />
                MỐC {activeGiftModal.starsRequired} NGÔI SAO VÀNG
              </div>
              <h3 className="font-['Be_Vietnam_Pro'] font-black text-xl sm:text-2xl text-slate-900">
                {activeGiftModal.titleVi}
              </h3>
              <p className="text-xs font-black text-purple-700 tracking-wider uppercase">
                {activeGiftModal.titleEn}
              </p>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-700 bg-amber-50 p-3 rounded-2xl border border-amber-200 leading-relaxed">
              {activeGiftModal.descVi}
            </p>

            <div className="p-2.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-black">
              🔊 &ldquo;{activeGiftModal.praiseEn}&rdquo;
            </div>

            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                setActiveGiftModal(null);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
            >
              <span>Tuyệt Vời! Đóng Lại ✨</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
