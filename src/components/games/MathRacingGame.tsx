/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundService, soundEffects } from '../../services/audioService';
import confetti from 'canvas-confetti';
import { BilingualQuestionBox } from '../common/BilingualQuestionBox';
import { FullscreenStage } from '../common/FullscreenStage';
import { ArrowLeft, RotateCcw, Volume2, Zap } from 'lucide-react';

interface MathRacingGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

interface RacingQuest {
  id: number;
  question: string;
  questionVi: string;
  questionEn: string;
  math: string;
  options: number[];
  answer: number;
}

export const MathRacingGame: React.FC<MathRacingGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [lap, setLap] = useState(0); // 0 to 4 (5 checkpoints)
  const [playerDistance, setPlayerDistance] = useState(10); // %
  const [rivalDistance, setRivalDistance] = useState(12); // %
  const [speed, setSpeed] = useState(50); // km/h
  const [isNitro, setIsNitro] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [quests, setQuests] = useState<RacingQuest[]>([]);
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState<string | null>(null);

  // Generate 5 racing questions
  const generateQuests = (): RacingQuest[] => {
    const list: RacingQuest[] = [];
    for (let i = 0; i < 5; i++) {
      if (i % 2 === 0) {
        // Addition
        const a = Math.floor(Math.random() * 6) + 2;
        const b = Math.floor(Math.random() * (10 - a)) + 1;
        const ans = a + b;
        const opts = [ans, ans + 1, Math.max(1, ans - 1), ans + 2]
          .filter((v, idx, arr) => arr.indexOf(v) === idx)
          .sort(() => Math.random() - 0.5);
        list.push({
          id: i,
          question: `Tăng tốc! Tính: ${a} + ${b}`,
          questionVi: `Tăng tốc! Tính: ${a} + ${b} = ?`,
          questionEn: `Speed boost! What is ${a} + ${b}?`,
          math: `${a} + ${b} = ?`,
          options: opts,
          answer: ans,
        });
      } else {
        // Subtraction
        const a = Math.floor(Math.random() * 5) + 5;
        const b = Math.floor(Math.random() * (a - 1)) + 1;
        const ans = a - b;
        const opts = [ans, ans + 1, Math.max(0, ans - 1), ans + 2]
          .filter((v, idx, arr) => arr.indexOf(v) === idx)
          .sort(() => Math.random() - 0.5);
        list.push({
          id: i,
          question: `Vượt chướng ngại vật! Tính: ${a} - ${b}`,
          questionVi: `Vượt chướng ngại vật! Tính: ${a} - ${b} = ?`,
          questionEn: `Dodge obstacle! What is ${a} - ${b}?`,
          math: `${a} - ${b} = ?`,
          options: opts,
          answer: ans,
        });
      }
    }
    return list;
  };

  useEffect(() => {
    setQuests(generateQuests());
  }, []);

  const handleAnswer = (val: number) => {
    if (isCompleted || isNitro) return;
    const currentQ = quests[lap];
    if (!currentQ) return;

    if (val === currentQ.answer) {
      // NITRO BOOST!
      setIsNitro(true);
      setSpeed(120);
      soundService.playEngine();
      soundEffects.correct();
      setFeedback('NITRO KÍCH HOẠT! Xe phóng vút lên phía trước!');

      const nextPlayerDist = Math.min(100, playerDistance + 22);
      const nextRivalDist = Math.min(92, rivalDistance + 14);
      setPlayerDistance(nextPlayerDist);
      setRivalDistance(nextRivalDist);

      setTimeout(() => {
        setIsNitro(false);
        setSpeed(75);
        const nextLap = lap + 1;

        if (nextLap >= 5 || nextPlayerDist >= 95) {
          // Finish line victory!
          setIsCompleted(true);
          setPlayerDistance(100);
          soundEffects.celebrate();
          confetti({ particleCount: 160, spread: 100 });

          StorageService.recordActivity(student.id, {
            type: 'game',
            targetId: 'math-racing',
            targetName: 'Đường Đua Siêu Tốc',
            score: 5,
            totalQuestions: 5,
            starsEarned: 25,
            timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
          });

          const updated = StorageService.getCurrentStudent();
          if (updated) onUpdateStudent(updated);
        } else {
          setLap(nextLap);
          setFeedback(null);
        }
      }, 1000);
    } else {
      // Wrong
      soundEffects.wrong();
      setSpeed(35);
      setFeedback('Xe hơi giảm tốc! Bé hãy thử lại nhé!');
      setTimeout(() => setFeedback(null), 1200);
    }
  };

  const restartGame = () => {
    setLap(0);
    setPlayerDistance(10);
    setRivalDistance(12);
    setSpeed(50);
    setIsNitro(false);
    setIsCompleted(false);
    setFeedback(null);
    setQuests(generateQuests());
    soundService.playClick();
  };

  const currentQ = quests[lap];

  return (
    <FullscreenStage
      titleVi="Đường Đua Siêu Tốc"
      titleEn="Math Racing Grand Prix"
      categoryBadge="Phép Tính Nhanh Lớp 1"
      onBack={onBack}
      topRightControls={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-red-100 text-red-900 px-3 py-1 rounded-xl font-bold text-xs border border-red-300">
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            {speed} km/h
          </div>
          <button
            onClick={restartGame}
            title="Làm lại từ đầu"
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      }
    >
      {!isCompleted && currentQ ? (
        <div className="w-full h-full flex flex-col justify-between overflow-hidden p-2 sm:p-4 gap-2">
          {/* KHU VỰC TRÊN: CÂU HỎI & CHẶNG ĐUA (15-20%) */}
          <div className="shrink-0 bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-red-200 shadow-xs flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏎️</span>
                <span className="text-xs font-black uppercase text-red-800 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-300">
                  Chặng {lap + 1} / 5
                </span>
                <span className="text-base sm:text-lg md:text-xl font-black text-slate-900 font-heading truncate">
                  {currentQ.questionVi}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 italic truncate">
                {currentQ.questionEn}
              </p>
            </div>

            <button
              onClick={() => soundService.speakEn(currentQ.questionEn)}
              className="p-2 sm:p-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-900 cursor-pointer shadow-xs shrink-0 flex items-center gap-1 text-xs font-bold"
              title="Phát âm tiếng Anh"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Phát âm 🔊</span>
            </button>
          </div>

          {/* KHU VỰC GIỮA: ĐƯỜNG ĐUA VÀ XE ĐUA (PHÓNG TO 1.5-2X) (50-55%) */}
          <div className="flex-1 min-h-0 relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-inner border-2 md:border-4 border-amber-400 bg-slate-800 select-none flex flex-col justify-between">
            {/* Top Border */}
            <div className="h-8 sm:h-10 bg-emerald-600 border-b-4 border-red-500 flex items-center justify-around shrink-0">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-6 h-3 bg-white" />
              ))}
            </div>

            {/* Road Surface */}
            <div className="relative flex-1 bg-slate-700 overflow-hidden flex flex-col justify-around py-2 sm:py-4">
              <div className="w-full h-2 border-b-4 border-dashed border-yellow-400 opacity-80" />

              {/* Finish Line */}
              <div className="absolute right-6 sm:right-10 top-0 bottom-0 w-8 sm:w-10 bg-[repeating-conic-gradient(#000_0_90deg,#fff_90deg_180deg)] [background-size:16px_16px] shadow-lg flex items-center justify-center">
                <span className="text-xs font-black bg-white/90 text-slate-900 px-1 py-0.5 rounded-sm rotate-90 whitespace-nowrap">
                  ĐÍCH
                </span>
              </div>

              {/* Lane 1: Rival AI Green Car */}
              <div
                className="relative h-14 sm:h-16 flex items-center transition-all duration-700 ease-out"
                style={{ left: `${rivalDistance}%` }}
              >
                <div className="relative text-5xl sm:text-6xl filter drop-shadow">
                  🚙
                  <span className="absolute -top-3 left-1 text-[9px] font-black text-emerald-300 bg-slate-900 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    Đối thủ máy
                  </span>
                </div>
              </div>

              {/* Lane 2: Player Red Speedster (Enlarged) */}
              <div
                className={`relative h-14 sm:h-16 flex items-center transition-all duration-700 ease-out ${
                  isNitro ? 'scale-115' : ''
                }`}
                style={{ left: `${playerDistance}%` }}
              >
                {isNitro && (
                  <div className="absolute -left-12 text-4xl animate-pulse">
                    🔥💨
                  </div>
                )}
                <div className="relative text-5xl sm:text-6xl filter drop-shadow">
                  🏎️
                  <span className="absolute -top-4 left-1 text-[10px] font-black text-yellow-300 bg-red-700 px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm border border-yellow-400">
                    {student.fullName} ⭐
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Border */}
            <div className="h-8 sm:h-10 bg-emerald-600 border-t-4 border-red-500 flex items-center justify-around shrink-0">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-6 h-3 bg-white" />
              ))}
            </div>

            {/* Lap Indicator Badge */}
            <div className="absolute top-10 left-3 bg-slate-900/85 backdrop-blur-xs text-white px-3 py-1 rounded-xl text-xs font-bold border border-slate-600 flex items-center gap-2">
              <span>🏁 Chặng: {Math.min(5, lap + 1)} / 5</span>
              <span>·</span>
              <span className="text-yellow-400">{playerDistance >= rivalDistance ? 'Dẫn đầu (#1)' : 'Thứ 2'}</span>
            </div>
          </div>

          {/* KHU VỰC DƯỚI: PHÉP TÍNH VÀ NÚT ĐÁP ÁN LỚN (20-25%) */}
          <div className="shrink-0 bg-white/95 rounded-2xl p-2.5 sm:p-4 border border-red-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 font-heading bg-red-50 px-4 py-2 rounded-xl border border-red-200 shrink-0">
              {currentQ.math}
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4 flex-1 max-w-xl">
              {currentQ.options.map((opt) => (
                <button
                  key={opt}
                  disabled={isNitro}
                  onClick={() => handleAnswer(opt)}
                  className="h-14 sm:h-16 md:h-20 text-2xl sm:text-3xl font-black rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 active:scale-95 text-white border-b-4 border-amber-800 shadow-xs transition-all cursor-pointer hover:scale-105 flex items-center justify-center"
                >
                  {opt}
                </button>
              ))}
            </div>

            {feedback && (
              <div className="text-xs sm:text-sm font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded-xl border border-red-200 shrink-0 animate-pulse">
                {feedback}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* VICTORY CELEBRATION (Zero Scroll) */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-50 via-yellow-100 to-orange-100 text-center space-y-4">
          <div className="text-6xl animate-bounce">🏆🏁🏎️</div>
          <h3 className="text-2xl md:text-3xl font-black text-amber-900 font-heading">
            XUẤT SẮC CÁN ĐÍCH VỊ TRÍ QUÁN QUÂN!
          </h3>
          <p className="text-base font-bold text-amber-700">
            “You are the Racing Champion! Cúp Vàng thuộc về bạn!”
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl w-full py-2">
            <div className="bg-white p-3 rounded-2xl border border-amber-200">
              <div className="text-2xl">🥇</div>
              <div className="text-xs text-slate-500 font-bold">Thứ hạng</div>
              <div className="text-lg font-black text-amber-600">Hạng Nhất (P1)</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-amber-200">
              <div className="text-2xl">🏆</div>
              <div className="text-xs text-slate-500 font-bold">Phần thưởng</div>
              <div className="text-lg font-black text-orange-600">Cúp Vàng Grand Prix</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-amber-200">
              <div className="text-2xl">⭐</div>
              <div className="text-xs text-slate-500 font-bold">Số sao nhận</div>
              <div className="text-lg font-black text-amber-500">+25 Sao</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-amber-200">
              <div className="text-2xl">🏅</div>
              <div className="text-xs text-slate-500 font-bold">Huy hiệu mới</div>
              <div className="text-xs font-black text-purple-700">Tay Đua Cự Phách</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={restartGame}
              className="py-3 px-6 bg-gradient-to-r from-red-500 to-amber-500 text-white font-extrabold rounded-2xl shadow-md hover:from-red-600 hover:to-amber-600 cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi đường đua mới</span>
            </button>
            <button
              onClick={onBack}
              className="py-3 px-6 bg-white hover:bg-slate-100 text-slate-800 font-extrabold rounded-2xl border-2 border-slate-300 cursor-pointer active:scale-95"
            >
              Về kho trò chơi
            </button>
          </div>
        </div>
      )}
    </FullscreenStage>
  );
};
