/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LessonCertificate } from '../../types';
import { RobotMathChibi } from '../chibi/RobotMathChibi';
import { Star, Sparkles } from 'lucide-react';

interface LessonCertificateCardProps {
  certificate: LessonCertificate;
  id?: string;
  className?: string;
}

export const LessonCertificateCard: React.FC<LessonCertificateCardProps> = ({
  certificate,
  id = 'printable-certificate-area',
  className = '',
}) => {
  const nameLen = certificate.studentName.length;
  // Adaptive font size: scales gracefully without overflowing or overlapping
  const nameSizeClass =
    nameLen > 22
      ? 'text-base sm:text-lg md:text-xl'
      : nameLen > 14
      ? 'text-lg sm:text-xl md:text-2xl'
      : 'text-xl sm:text-2xl md:text-3xl';

  return (
    <div
      id={id}
      className={`w-full max-w-2xl mx-auto relative bg-gradient-to-br from-amber-50/95 via-white to-sky-50/80 rounded-2xl border-4 sm:border-5 border-double border-amber-400 p-3 sm:p-5 text-center flex flex-col justify-between items-center shadow-md select-none ${className}`}
    >
      {/* 4 Corner Decorative Stars */}
      <div className="absolute top-2 left-2 text-amber-400 text-sm sm:text-lg select-none animate-pulse">
        ⭐
      </div>
      <div className="absolute top-2 right-2 text-amber-400 text-sm sm:text-lg select-none animate-pulse">
        ⭐
      </div>
      <div className="absolute bottom-2 left-2 text-amber-400 text-sm sm:text-lg select-none animate-pulse">
        ⭐
      </div>
      <div className="absolute bottom-2 right-2 text-amber-400 text-sm sm:text-lg select-none animate-pulse">
        ⭐
      </div>

      {/* 1. Header Zone: School Name, Ribbon & Title */}
      <div className="w-full flex flex-col items-center gap-0.5 sm:gap-1">
        <div className="text-[10px] sm:text-xs font-black text-blue-900 tracking-wider uppercase font-['Be_Vietnam_Pro'] leading-tight">
          TRƯỜNG TIỂU HỌC TRẦN ĐẠI NGHĨA • TP. ĐÀ NẴNG
        </div>

        <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-2xs">
          <Sparkles className="w-3 h-3 text-yellow-200" />
          <span>VƯƠNG QUỐC TOÁN HỌC SONG NGỮ – LỚP 1</span>
          <Sparkles className="w-3 h-3 text-yellow-200" />
        </div>

        <h2 className="font-['Be_Vietnam_Pro'] font-black text-xl sm:text-2xl md:text-3xl text-amber-600 tracking-tight drop-shadow-xs mt-0.5 leading-tight">
          GIẤY CHỨNG NHẬN THÀNH TÍCH
        </h2>
        <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 tracking-wider uppercase leading-tight">
          MATH ADVENTURE GRADE 1 • CERTIFICATE OF ACHIEVEMENT
        </p>
      </div>

      {/* 2. Recipient Zone: Student Name & Class */}
      <div className="my-1.5 sm:my-2 w-full max-w-xl text-center flex flex-col items-center gap-0.5 sm:gap-1">
        <div className="text-[11px] sm:text-xs font-bold text-slate-600 uppercase tracking-wide leading-tight">
          Khen tặng học sinh xuất sắc:
        </div>

        {/* Student Name: Prominent, centered, in its own region with adaptive sizing */}
        <div
          className={`font-['Be_Vietnam_Pro'] font-black uppercase text-blue-950 tracking-wide break-words px-2 leading-tight ${nameSizeClass}`}
        >
          {certificate.studentName}
        </div>

        {/* Class Badge: Separate line */}
        <div className="pt-0.5">
          <span className="inline-block px-3 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300 font-extrabold text-[10px] sm:text-xs leading-none">
            Lớp: <strong className="text-slate-900">{certificate.className}</strong>
          </span>
        </div>

        {/* Lesson Achievement Box */}
        <div className="w-full max-w-lg mx-auto bg-gradient-to-r from-amber-100/80 via-yellow-50/90 to-amber-100/80 border-2 border-amber-300 rounded-xl py-1 px-3 sm:px-4 my-1 shadow-2xs">
          <div className="text-[9px] sm:text-[10px] text-amber-800 font-extrabold uppercase tracking-wide leading-tight">
            Đã hoàn thành xuất sắc bài học:
          </div>
          <div className="font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm md:text-base text-amber-950 mt-0.5 leading-tight break-words">
            {certificate.lessonTitle}
          </div>
        </div>

        <div className="font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm md:text-base text-emerald-600 tracking-tight leading-tight">
          🎉 Con thật tuyệt vời! Well done! 🎉
        </div>
      </div>

      {/* 3. Reward & Seal Zone: Chibi, Gold Star & Official Seal */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 my-1 flex-wrap">
        {/* Robot Chibi Mascot */}
        <div className="flex flex-col items-center shrink-0">
          <RobotMathChibi expression="cheering" size="sm" className="scale-100 sm:scale-105 drop-shadow-xs" />
          <span className="text-[9px] sm:text-[10px] font-black text-sky-700 mt-0.5">Rô-bốt Toán Học</span>
        </div>

        {/* Gold Star Medal */}
        <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-xl p-1.5 sm:p-2 shadow-xs border border-yellow-200 flex flex-col items-center justify-center min-w-[85px] sm:min-w-[100px] shrink-0">
          <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-200 text-white animate-spin-slow drop-shadow-xs" />
          <span className="font-['Be_Vietnam_Pro'] font-black text-[10px] sm:text-xs mt-0.5 leading-tight">
            1 Ngôi Sao Vàng
          </span>
          <span className="text-[8px] sm:text-[9px] font-bold text-amber-100 leading-tight">Math Star</span>
        </div>

        {/* Primary School Seal Stamp */}
        <div className="flex flex-col items-center justify-center p-1.5 rounded-xl border-2 border-dashed border-rose-300 bg-rose-50/90 min-w-[85px] sm:min-w-[95px] shrink-0">
          <span className="text-[8px] sm:text-[9px] font-black text-rose-800 uppercase tracking-wider leading-tight">
            CHỨNG NHẬN
          </span>
          <span className="text-lg sm:text-xl my-0.5 leading-none">💮</span>
          <span className="text-[8px] sm:text-[9px] font-black text-rose-700 leading-tight">TOÁN LỚP 1</span>
        </div>
      </div>

      {/* 4. Footer Zone: ID & Completion Date */}
      <div className="w-full flex items-center justify-between border-t border-amber-200/80 pt-1.5 px-2 text-[9px] sm:text-[10px] font-bold text-slate-600 mt-0.5">
        <span>Mã giấy: #{certificate.id}</span>
        <span>
          Ngày hoàn thành: <strong className="text-slate-900">{certificate.formattedDate}</strong>
        </span>
      </div>
    </div>
  );
};
