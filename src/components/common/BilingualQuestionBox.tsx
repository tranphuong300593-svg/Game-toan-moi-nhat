/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageMode } from '../../types';
import { soundService } from '../../services/audioService';
import { Volume2 } from 'lucide-react';

interface BilingualQuestionBoxProps {
  promptVi: string;
  promptEn: string;
  langMode?: LanguageMode;
  badgeText?: string;
  className?: string;
  children?: React.ReactNode;
  onAudioPlay?: () => void;
}

export const BilingualQuestionBox: React.FC<BilingualQuestionBoxProps> = ({
  promptVi,
  promptEn,
  badgeText,
  className = '',
  children,
  onAudioPlay,
}) => {
  const [isSpeakingEn, setIsSpeakingEn] = useState(false);

  // Stop preceding speech whenever the question changes
  useEffect(() => {
    soundService.cancelSpeech();
    setIsSpeakingEn(false);
  }, [promptVi, promptEn]);

  // Clean English prompt for natural en-US speech
  const formatSpeechEn = (text: string): string => {
    return text
      .replace(/(\d+)\s*\+\s*(\d+)\s*=\s*\?/g, 'what is $1 plus $2?')
      .replace(/(\d+)\s*-\s*(\d+)\s*=\s*\?/g, 'what is $1 minus $2?')
      .replace(/(\d+)\s*\+\s*(\d+)/g, '$1 plus $2')
      .replace(/(\d+)\s*-\s*(\d+)/g, '$1 minus $2')
      .replace(/\s*=\s*\?/g, ' equals what?');
  };

  const handlePlayEn = () => {
    soundService.cancelSpeech();
    setIsSpeakingEn(true);
    onAudioPlay?.();

    const speechText = formatSpeechEn(promptEn);
    soundService.speak(speechText, 'en', {
      rate: 0.88,
      onEnd: () => setIsSpeakingEn(false),
    });
  };

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl border border-sky-200/90 bg-gradient-to-r from-sky-50/80 via-white to-indigo-50/70 p-3 sm:p-4 md:p-5 shadow-xs space-y-2 shrink-0 ${className}`}
    >
      {badgeText && (
        <div className="inline-block px-3 py-0.5 bg-sky-100 text-[#0369A1] text-[11px] font-black uppercase tracking-wider rounded-full shadow-2xs">
          {badgeText}
        </div>
      )}

      {/* 1. CÂU HỎI TIẾNG VIỆT TO, ĐẬM, RÕ RÀNG (Khoảng 36-44px trên Desktop) - KHÔNG CÓ NÚT LOA */}
      <h3 className="font-['Be_Vietnam_Pro'] font-black text-xl sm:text-2xl md:text-3xl lg:text-[34px] xl:text-[38px] text-slate-900 leading-snug tracking-tight">
        {promptVi}
      </h3>

      {/* 2. CÂU HỎI TIẾNG ANH NHỎ HƠN (Khoảng 18-22px) NGAY BÊN DƯỚI - CÓ NÚT LOA TIẾNG ANH 🔊 */}
      {promptEn && (
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-sky-100/80">
          <p className="font-['Be_Vietnam_Pro'] font-semibold text-sm sm:text-base md:text-lg lg:text-[20px] text-slate-600 leading-normal flex-1">
            {promptEn}
          </p>

          {/* CHỈ GIỮ NÚT LOA CHO CÂU HỎI TIẾNG ANH (en-US chuẩn) */}
          <button
            type="button"
            onClick={handlePlayEn}
            title="Nghe câu hỏi tiếng Anh chuẩn Mỹ (en-US)"
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border-2 font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-95 shrink-0 ${
              isSpeakingEn
                ? 'bg-purple-600 text-white border-purple-700 ring-2 ring-purple-200 scale-105 animate-pulse'
                : 'bg-white hover:bg-purple-50 text-purple-700 border-purple-300 hover:border-purple-500'
            }`}
          >
            <Volume2 className={`w-4 h-4 sm:w-5 sm:h-5 ${isSpeakingEn ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">{isSpeakingEn ? 'Đang đọc...' : 'Nghe en-US'}</span>
            <span className="text-xs">🔊</span>
          </button>
        </div>
      )}

      {children && <div className="pt-1">{children}</div>}
    </div>
  );
};

