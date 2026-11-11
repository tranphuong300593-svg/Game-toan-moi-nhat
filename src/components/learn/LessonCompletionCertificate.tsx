/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LessonCertificate } from '../../types';
import { RobotMathChibi } from '../chibi/RobotMathChibi';
import { Star, Sparkles } from 'lucide-react';

interface LessonCompletionCertificateProps {
  certificate: LessonCertificate;
  id?: string;
  className?: string;
}

/**
 * Giấy Chứng Nhận Thành Tích dành riêng cho mục HỌC THEO BÀI.
 * Thiết kế chuẩn mực theo mẫu THÀNH TÍCH CỦA BÉ:
 * - Khung viền đôi mạ vàng sang trọng (border-double border-amber-400)
 * - Nền ngà hổ phách - xanh dịu (amber-50 to sky-50)
 * - 4 góc trang trí ngôi sao vàng cân đối
 * - Phân chia 4 vùng Flexbox độc lập, tuyệt đối không dùng position:absolute cho các dòng chữ
 * - Tự động co giãn cỡ chữ theo độ dài tên học sinh và tên bài học
 * - Vừa vặn hoàn hảo trong màn hình 16:9, không tạo thanh cuộn, không bị cắt viền
 */
export const LessonCompletionCertificate: React.FC<LessonCompletionCertificateProps> = ({
  certificate,
  id = 'printable-certificate-area',
  className = '',
}) => {
  const nameLen = certificate.studentName.length;
  // Adaptive font size: điều chỉnh mượt mà cho mọi độ dài tên học sinh
  const nameSizeClass =
    nameLen > 24
      ? 'text-xs sm:text-sm'
      : nameLen > 16
      ? 'text-sm sm:text-base'
      : 'text-base sm:text-lg';

  const lessonLen = certificate.lessonTitle.length;
  const lessonSizeClass =
    lessonLen > 40
      ? 'text-[9px] sm:text-[10px] md:text-[11px]'
      : 'text-[10px] sm:text-[11px] md:text-xs';

  return (
    <div
      id={id}
      className={`w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto relative bg-gradient-to-br from-amber-50/95 via-white to-sky-50/85 rounded-2xl border-3 sm:border-4 border-double border-amber-400 p-2 sm:p-2.5 md:p-3 text-center flex flex-col justify-between items-center shadow-md select-none ${className}`}
    >
      {/* 4 Ngôi sao vàng trang trí ở 4 góc - Định vị an toàn ở mép trong của khung viền */}
      <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 text-amber-400 text-xs sm:text-sm select-none pointer-events-none animate-pulse">
        ⭐
      </div>
      <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 text-amber-400 text-xs sm:text-sm select-none pointer-events-none animate-pulse">
        ⭐
      </div>
      <div className="absolute bottom-1 left-1 sm:bottom-1.5 sm:left-1.5 text-amber-400 text-xs sm:text-sm select-none pointer-events-none animate-pulse">
        ⭐
      </div>
      <div className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 text-amber-400 text-xs sm:text-sm select-none pointer-events-none animate-pulse">
        ⭐
      </div>

      {/* VÙNG 1: TIÊU ĐỀ & TÊN TRƯỜNG (Căn giữa, độc lập, không chồng chữ) */}
      <div className="w-full flex flex-col items-center gap-0.5 shrink-0">
        <div className="text-[8.5px] sm:text-[9.5px] md:text-[10px] font-black text-blue-900 tracking-wider uppercase font-['Be_Vietnam_Pro'] leading-tight">
          TRƯỜNG TIỂU HỌC TRẦN ĐẠI NGHĨA • TP. ĐÀ NẴNG
        </div>

        <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full text-[7px] sm:text-[8px] font-black uppercase tracking-widest shadow-2xs mt-0.5">
          <Sparkles className="w-2 h-2 text-yellow-200" />
          <span>VƯƠNG QUỐC TOÁN HỌC SONG NGỮ – LỚP 1</span>
          <Sparkles className="w-2 h-2 text-yellow-200" />
        </div>

        <h2 className="font-['Be_Vietnam_Pro'] font-black text-sm sm:text-base md:text-lg text-amber-600 tracking-tight drop-shadow-xs mt-0.5 leading-tight">
          GIẤY CHỨNG NHẬN THÀNH TÍCH
        </h2>
        <p className="text-[7px] sm:text-[7.5px] font-bold text-slate-500 tracking-wider uppercase leading-none">
          MATH ADVENTURE GRADE 1 • CERTIFICATE OF ACHIEVEMENT
        </p>
      </div>

      {/* VÙNG 2: THÔNG TIN HỌC SINH & BÀI HỌC (Flexbox dọc, phân tách dòng rõ ràng) */}
      <div className="my-0.5 w-full max-w-lg text-center flex flex-col items-center gap-0.5 shrink-0">
        <div className="text-[8px] sm:text-[9px] font-bold text-slate-600 uppercase tracking-wide leading-none">
          Khen tặng học sinh xuất sắc:
        </div>

        {/* Họ tên học sinh: Căn giữa, chữ hoa trang trọng, cỡ chữ tự điều chỉnh theo độ dài */}
        <div
          className={`font-['Be_Vietnam_Pro'] font-black uppercase text-blue-950 tracking-wide break-words px-2 leading-tight ${nameSizeClass}`}
        >
          {certificate.studentName}
        </div>

        {/* Lớp học */}
        <div className="pt-0.5">
          <span className="inline-block px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300 font-extrabold text-[8px] sm:text-[9px] leading-none">
            Lớp: <strong className="text-slate-900">{certificate.className}</strong>
          </span>
        </div>

        {/* Khung tôn vinh bài học */}
        <div className="w-full max-w-md mx-auto bg-gradient-to-r from-amber-100/80 via-yellow-50/90 to-amber-100/80 border border-amber-300 rounded-lg py-0.5 px-2.5 my-0.5 shadow-2xs">
          <div className="text-[7px] sm:text-[8px] text-amber-800 font-extrabold uppercase tracking-wide leading-none">
            Đã hoàn thành xuất sắc bài học:
          </div>
          <div
            className={`font-['Be_Vietnam_Pro'] font-black text-amber-950 mt-0.5 leading-tight break-words ${lessonSizeClass}`}
          >
            {certificate.lessonTitle}
          </div>
        </div>

        <div className="font-['Be_Vietnam_Pro'] font-black text-[9px] sm:text-[10.5px] text-emerald-600 tracking-tight leading-none mt-0.5">
          🎉 Con thật tuyệt vời! Well done! 🎉
        </div>
      </div>

      {/* VÙNG 3: HUY HIỆU, LINH VẬT & CON DẤU (Xếp ngang cân đối) */}
      <div className="flex items-center justify-center gap-2 sm:gap-3.5 my-0.5 flex-wrap shrink-0">
        {/* Linh vật Rô-bốt Toán Học */}
        <div className="flex flex-col items-center shrink-0">
          <RobotMathChibi expression="cheering" size="sm" className="scale-75 sm:scale-80 drop-shadow-xs" />
          <span className="text-[7px] sm:text-[8px] font-black text-sky-700 mt-0.5 leading-none">Rô-bốt Toán Học</span>
        </div>

        {/* Huy chương 1 Ngôi sao vàng */}
        <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-lg p-0.5 sm:p-1 shadow-xs border border-yellow-200 flex flex-col items-center justify-center min-w-[65px] sm:min-w-[75px] shrink-0">
          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-200 text-white animate-spin-slow drop-shadow-xs" />
          <span className="font-['Be_Vietnam_Pro'] font-black text-[7.5px] sm:text-[8.5px] mt-0.5 leading-tight">
            1 Ngôi Sao Vàng
          </span>
          <span className="text-[6.5px] sm:text-[7.5px] font-bold text-amber-100 leading-none">Math Star</span>
        </div>

        {/* Con dấu chứng nhận trường tiểu học */}
        <div className="flex flex-col items-center justify-center p-0.5 sm:p-1 rounded-lg border border-dashed border-rose-300 bg-rose-50/90 min-w-[65px] sm:min-w-[72px] shrink-0">
          <span className="text-[6.5px] sm:text-[7.5px] font-black text-rose-800 uppercase tracking-wider leading-none">
            CHỨNG NHẬN
          </span>
          <span className="text-xs sm:text-sm my-0.5 leading-none">💮</span>
          <span className="text-[6.5px] sm:text-[7.5px] font-black text-rose-700 leading-none">TOÁN LỚP 1</span>
        </div>
      </div>

      {/* VÙNG 4: CHÂN TRANG (Mã chứng nhận & Ngày hoàn thành) */}
      <div className="w-full flex items-center justify-between border-t border-amber-200/80 pt-0.5 px-1 text-[7px] sm:text-[8px] font-bold text-slate-500 mt-0.5 shrink-0">
        <span>Mã giấy: #{certificate.id}</span>
        <span>
          Ngày hoàn thành: <strong className="text-slate-900">{certificate.formattedDate}</strong>
        </span>
      </div>
    </div>
  );
};
