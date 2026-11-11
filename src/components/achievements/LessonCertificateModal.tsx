/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { LessonCertificate } from '../../types';
import { LessonCertificateCard } from './LessonCertificateCard';
import { soundService } from '../../services/audioService';
import confetti from 'canvas-confetti';
import { Printer, X, RotateCcw, Check } from 'lucide-react';

interface LessonCertificateModalProps {
  certificate: LessonCertificate;
  isOpen: boolean;
  onClose: () => void;
  isNewAward?: boolean;
  onReviewLesson?: () => void;
}

export const LessonCertificateModal: React.FC<LessonCertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
  isNewAward = false,
  onReviewLesson,
}) => {
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

  useEffect(() => {
    if (isOpen && isNewAward && !hasPlayedIntro) {
      setHasPlayedIntro(true);

      // 1. Play gentle applause
      soundService.playApplause();

      // 2. Play soft sparkle confetti
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#FBBF24', '#38BDF8', '#10B981', '#EC4899'],
      });

      // 3. Play American English praise
      const praises = ['Congratulations!', 'Great job!', "You're a star!"];
      const randomPraise = praises[Math.floor(Math.random() * praises.length)];
      setTimeout(() => {
        soundService.speakEn(randomPraise, { rate: 0.92, pitch: 1.1 });
      }, 350);
    }
  }, [isOpen, isNewAward, hasPlayedIntro]);

  if (!isOpen) return null;

  const handlePrint = () => {
    soundService.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 flex flex-col max-h-[96vh] overflow-hidden">
        {/* Close button in top-right for normal UI */}
        <button
          type="button"
          onClick={onClose}
          className="no-print absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-xs"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable container for UI if screen is very small, but printable area will format cleanly */}
        <div className="overflow-y-auto p-3 sm:p-4 flex-1 flex flex-col items-center justify-center">
          <LessonCertificateCard certificate={certificate} />
        </div>

        {/* BOTTOM ACTION BUTTONS (Hidden when printing via no-print class) */}
        <div className="no-print shrink-0 bg-slate-50 border-t border-slate-200 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2.5">
          {/* Review / Re-learn button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                onClose();
                if (onReviewLesson) onReviewLesson();
              }}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Xem lại</span>
            </button>
          </div>

          {/* Print button & OK button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>In giấy chứng nhận</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Xong</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
