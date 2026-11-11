/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { soundService } from '../../services/audioService';

interface InteractiveSpatialPlayProps {
  onSuccess?: () => void;
  className?: string;
}

export const InteractiveSpatialPlay: React.FC<InteractiveSpatialPlayProps> = ({
  onSuccess,
  className = '',
}) => {
  // Placement target: Quả bóng ⚽
  // Positions: 'above' (trên bàn), 'below' (dưới bàn), 'left' (bên trái), 'right' (bên phải), 'front' (phía trước), 'behind' (phía sau)
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState<number>(0);
  const [ballPosition, setBallPosition] = useState<'above' | 'below' | 'left' | 'right' | 'bench'>('bench');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const challenges = [
    {
      targetPosition: 'below',
      promptVi: 'Bé hãy đặt quả bóng ⚽ vào PHÍA DƯỚI bàn học!',
      promptEn: 'Place the ball UNDER the desk!',
      successVi: 'Chính xác! Quả bóng đang ở PHÍA DƯỚI bàn!',
    },
    {
      targetPosition: 'above',
      promptVi: 'Bé hãy đặt chú mèo 🐱 lên PHÍA TRÊN mặt bàn!',
      promptEn: 'Place the cat ON TOP OF the desk!',
      successVi: 'Tuyệt vời! Chú mèo đang ngồi ở PHÍA TRÊN mặt bàn!',
    },
    {
      targetPosition: 'left',
      promptVi: 'Bé hãy đặt chiếc cặp sách 🎒 sang BÊN TRÁI chiếc bàn!',
      promptEn: 'Place the school bag to the LEFT of the desk!',
      successVi: 'Đúng rồi! Chiếc cặp sách đang ở BÊN TRÁI chiếc bàn!',
    },
    {
      targetPosition: 'right',
      promptVi: 'Bé hãy đặt chậu cây 🪴 sang BÊN PHẢI chiếc bàn!',
      promptEn: 'Place the potted plant to the RIGHT of the desk!',
      successVi: 'Xuất sắc! Chậu cây đang ở BÊN PHẢI chiếc bàn!',
    },
  ];

  const currentQuest = challenges[currentChallengeIdx];

  const handleChooseZone = (zone: 'above' | 'below' | 'left' | 'right') => {
    setBallPosition(zone);
    soundService.playClick();

    if (zone === currentQuest.targetPosition) {
      soundService.praiseCorrect('vi');
      setFeedback(currentQuest.successVi);

      setTimeout(() => {
        if (currentChallengeIdx + 1 < challenges.length) {
          setCurrentChallengeIdx((c) => c + 1);
          setBallPosition('bench');
          setFeedback(null);
        } else {
          setIsCompleted(true);
          onSuccess?.();
        }
      }, 900);
    } else {
      soundService.encourageWrong('vi');
      setFeedback('Vị trí này chưa đúng rồi. Bé hãy thử lại nhé!');
    }
  };

  const handleReset = () => {
    setCurrentChallengeIdx(0);
    setBallPosition('bench');
    setFeedback(null);
    setIsCompleted(false);
  };

  return (
    <div className={`p-5 bg-gradient-to-br from-amber-50/70 via-sky-50 to-indigo-50 rounded-3xl border-2 border-amber-300 shadow-sm space-y-4 ${className}`}>
      {/* Header Prompt */}
      <div className="flex items-center justify-between border-b border-amber-200 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
              Thử thách vị trí không gian {currentChallengeIdx + 1} / {challenges.length}
            </span>
            <button
              onClick={() => soundService.speakEn(currentQuest.promptEn)}
              className="p-1.5 rounded-full bg-white hover:bg-amber-100 text-amber-800 shadow-xs cursor-pointer flex items-center gap-1 text-xs font-bold"
              title="Nghe tiếng Anh chuẩn en-US"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="text-[10px]">en-US</span>
            </button>
          </div>
          <h4 className="text-sm md:text-base font-black text-slate-900">
            👉 {currentQuest.promptVi}
          </h4>
          <p className="text-xs text-indigo-900 font-semibold italic">
            “{currentQuest.promptEn}”
          </p>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer shadow-xs"
          title="Làm lại"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Classroom Desk Visual Arena */}
      <div className="relative w-full max-w-xl mx-auto h-72 md:h-80 bg-white rounded-3xl border-2 border-indigo-200 shadow-sm p-4 flex items-center justify-center select-none overflow-hidden">
        {/* Wall background decor */}
        <div className="absolute top-3 left-6 text-xs font-bold text-slate-400">
          🖼️ Bức tranh trên tường (Phía sau)
        </div>
        <div className="absolute top-3 right-6 text-xs font-bold text-slate-400">
          🪟 Cửa sổ lớp học
        </div>

        {/* 4 Interactive Drop Zones surrounding the central Desk */}
        {/* 1. ZONE: ABOVE (TRÊN BÀN) */}
        <button
          onClick={() => handleChooseZone('above')}
          className={`absolute top-10 inset-x-32 h-14 rounded-2xl border-2 border-dashed flex items-center justify-center font-black text-xs md:text-sm transition-all cursor-pointer ${
            ballPosition === 'above'
              ? 'bg-amber-100 border-amber-500 scale-105 shadow-md text-amber-950'
              : 'bg-slate-50/70 hover:bg-amber-50 border-slate-300 text-slate-600'
          }`}
        >
          {ballPosition === 'above' ? (
            <span className="text-2xl animate-bounce">
              {currentChallengeIdx === 1 ? '🐱' : '⚽'}
            </span>
          ) : (
            <span>⬆️ PHÍA TRÊN BÀN</span>
          )}
        </button>

        {/* CENTRAL DESK */}
        <div className="relative z-10 w-44 md:w-52 h-20 bg-gradient-to-b from-amber-700 to-amber-800 rounded-2xl border-4 border-amber-900 shadow-lg flex flex-col items-center justify-center text-white">
          <div className="w-full h-4 bg-amber-600 rounded-t-xl border-b border-amber-900" />
          <span className="text-xs md:text-sm font-black text-amber-100 mt-1">BÀN HỌC</span>
          <div className="absolute -bottom-10 left-3 w-3 h-10 bg-amber-900 rounded-b" />
          <div className="absolute -bottom-10 right-3 w-3 h-10 bg-amber-900 rounded-b" />
        </div>

        {/* 2. ZONE: BELOW (DƯỚI BÀN) */}
        <button
          onClick={() => handleChooseZone('below')}
          className={`absolute bottom-6 inset-x-32 h-14 rounded-2xl border-2 border-dashed flex items-center justify-center font-black text-xs md:text-sm transition-all cursor-pointer ${
            ballPosition === 'below'
              ? 'bg-amber-100 border-amber-500 scale-105 shadow-md text-amber-950'
              : 'bg-slate-50/70 hover:bg-amber-50 border-slate-300 text-slate-600'
          }`}
        >
          {ballPosition === 'below' ? (
            <span className="text-2xl animate-bounce">
              {currentChallengeIdx === 0 ? '⚽' : '🐱'}
            </span>
          ) : (
            <span>⬇️ PHÍA DƯỚI BÀN (GẦM BÀN)</span>
          )}
        </button>

        {/* 3. ZONE: LEFT (BÊN TRÁI) */}
        <button
          onClick={() => handleChooseZone('left')}
          className={`absolute left-4 inset-y-24 w-24 md:w-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center font-black text-xs transition-all cursor-pointer ${
            ballPosition === 'left'
              ? 'bg-sky-100 border-sky-500 scale-105 shadow-md text-sky-950'
              : 'bg-slate-50/70 hover:bg-sky-50 border-slate-300 text-slate-600'
          }`}
        >
          {ballPosition === 'left' ? (
            <span className="text-2xl animate-bounce">
              {currentChallengeIdx === 2 ? '🎒' : '⚽'}
            </span>
          ) : (
            <>
              <span>⬅️</span>
              <span>BÊN TRÁI</span>
            </>
          )}
        </button>

        {/* 4. ZONE: RIGHT (BÊN PHẢI) */}
        <button
          onClick={() => handleChooseZone('right')}
          className={`absolute right-4 inset-y-24 w-24 md:w-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center font-black text-xs transition-all cursor-pointer ${
            ballPosition === 'right'
              ? 'bg-emerald-100 border-emerald-500 scale-105 shadow-md text-emerald-950'
              : 'bg-slate-50/70 hover:bg-emerald-50 border-slate-300 text-slate-600'
          }`}
        >
          {ballPosition === 'right' ? (
            <span className="text-2xl animate-bounce">
              {currentChallengeIdx === 3 ? '🪴' : '⚽'}
            </span>
          ) : (
            <>
              <span>➡️</span>
              <span>BÊN PHẢI</span>
            </>
          )}
        </button>
      </div>

      {/* Real-time Feedback Banner */}
      {feedback && (
        <div className="p-3 bg-white rounded-2xl border-2 border-emerald-400 text-center font-black text-xs md:text-sm text-emerald-800 shadow-xs animate-scale-in">
          {feedback}
        </div>
      )}

      {/* Completed celebration */}
      {isCompleted && (
        <div className="p-3 bg-emerald-500 text-white rounded-2xl text-center font-black text-sm shadow-md animate-bounce">
          🎉 Bé đã xuất sắc làm chủ toàn bộ các vị trí: TRÊN - DƯỚI - TRÁI - PHẢI!
        </div>
      )}
    </div>
  );
};
