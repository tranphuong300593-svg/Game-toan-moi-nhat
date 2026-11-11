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
import { ArrowLeft, RotateCcw, Volume2, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface RabbitRiverGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

interface RiverStage {
  id: number;
  questionVi: string;
  questionEn: string;
  mathDisplay: string;
  options: number[];
  answer: number;
}

export const RabbitRiverGame: React.FC<RabbitRiverGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [currentStep, setCurrentStep] = useState(0); // 0 to 5 (5 is home!)
  const [stages, setStages] = useState<RiverStage[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [shakeStone, setShakeStone] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [carrotsCollected, setCarrotsCollected] = useState(0);
  const [startTime] = useState(Date.now());
  const [feedbackMsg, setFeedbackMsg] = useState<{ vi: string; en: string } | null>(null);

  // Generate 5 fun stepping stone math challenges
  const generateStages = () => {
    const list: RiverStage[] = [];
    for (let i = 1; i <= 5; i++) {
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * (10 - a)) + 1;
      const ans = a + b;
      const opts = [ans, ans + 1, Math.max(1, ans - 1), ans + 2]
        .filter((v, idx, arr) => arr.indexOf(v) === idx)
        .sort(() => Math.random() - 0.5);

      list.push({
        id: i,
        questionVi: `Hòn đá số ${i}: ${a} + ${b} bằng mấy?`,
        questionEn: `Stepping stone #${i}: What is ${a} + ${b}?`,
        mathDisplay: `${a} + ${b} = ?`,
        options: opts,
        answer: ans,
      });
    }
    return list;
  };

  useEffect(() => {
    setStages(generateStages());
  }, []);

  const handleOptionClick = (val: number) => {
    if (isJumping || isCompleted) return;
    const stage = stages[currentStep];
    if (!stage) return;

    setSelectedOption(val);

    if (val === stage.answer) {
      // Correct! Bunny leaps!
      setIsJumping(true);
      soundService.playJump();
      soundEffects.correct();
      setFeedbackMsg({
        vi: 'Tuyệt vời! Thỏ con đã nhảy sang hòn đá tiếp theo!',
        en: 'Awesome! Little rabbit leaped onto the stone!',
      });

      setTimeout(() => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setIsJumping(false);
        setSelectedOption(null);
        setFeedbackMsg(null);

        if (nextStep >= 5) {
          // Finish line!
          setIsCompleted(true);
          setCarrotsCollected(3);
          soundEffects.celebrate();
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

          // Record in storage
          const record = StorageService.recordActivity(student.id, {
            type: 'game',
            targetId: 'rabbit-river',
            targetName: 'Thỏ Con Vượt Suối',
            score: 5,
            totalQuestions: 5,
            starsEarned: 15,
            timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
          });

          const updated = StorageService.getCurrentStudent();
          if (updated) onUpdateStudent(updated);
        }
      }, 700);
    } else {
      // Wrong
      setShakeStone(true);
      soundEffects.wrong();
      setFeedbackMsg({
        vi: 'Hòn đá rung nhẹ, bé hãy thử lại để thỏ nhảy nhé!',
        en: 'The stone wobbled! Try another answer!',
      });
      setTimeout(() => {
        setShakeStone(false);
        setSelectedOption(null);
      }, 600);
    }
  };

  const restartGame = () => {
    setCurrentStep(0);
    setIsCompleted(false);
    setSelectedOption(null);
    setCarrotsCollected(0);
    setFeedbackMsg(null);
    setStages(generateStages());
    soundService.playClick();
  };

  const currentStage = stages[currentStep];

  return (
    <FullscreenStage
      titleVi="Thỏ Con Vượt Suối"
      titleEn="Rabbit River Adventure"
      categoryBadge="Trò chơi Lớp 1"
      onBack={onBack}
      topRightControls={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-xl font-bold text-xs">
            <span>🥕</span> {currentStep}/5 Chặng
          </div>
          <button
            onClick={restartGame}
            title="Chơi lại từ đầu"
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      }
    >
      {!isCompleted && currentStage ? (
        <div className="w-full h-full flex flex-col justify-between overflow-hidden p-2 sm:p-4 gap-2">
          {/* KHU VỰC TRÊN: CÂU HỎI (15-20%) */}
          <div className="shrink-0 bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-emerald-200 shadow-xs flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Chặng {currentStep + 1} / 5
                </span>
                <span className="text-base sm:text-lg md:text-xl font-black text-slate-900 font-heading truncate">
                  {currentStage.questionVi}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 italic truncate">
                {currentStage.questionEn}
              </p>
            </div>

            <button
              onClick={() => soundService.speakEn(currentStage.questionEn)}
              className="p-2 sm:p-2.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 cursor-pointer shadow-xs shrink-0 flex items-center gap-1 text-xs font-bold"
              title="Nghe câu hỏi tiếng Anh"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Phát âm 🔊</span>
            </button>
          </div>

          {/* KHU VỰC GIỮA: HÌNH MINH HỌA & DÒNG SÔNG 1.5-2X (50-60%) */}
          <div className="flex-1 min-h-0 relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-inner border-2 md:border-4 border-teal-300 bg-gradient-to-b from-sky-200 via-sky-300 to-teal-400 select-none">
            {/* Animated River Ripples */}
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-teal-500/80 overflow-hidden">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-200 via-cyan-400 to-blue-600 animate-pulse-subtle" />
              <div className="absolute top-6 left-12 text-3xl animate-float">🪷</div>
              <div className="absolute top-16 right-24 text-2xl animate-float" style={{ animationDelay: '1s' }}>🪷</div>
              <div className="absolute top-10 left-1/2 text-3xl animate-float" style={{ animationDelay: '2s' }}>🪷</div>
            </div>

            {/* Left Bank */}
            <div className="absolute left-0 bottom-0 w-24 sm:w-36 h-4/5 bg-gradient-to-t from-emerald-600 to-green-500 rounded-tr-3xl shadow-md border-r-4 border-emerald-700 flex flex-col items-center justify-start pt-3">
              <span className="text-3xl md:text-4xl">🌿</span>
              <span className="text-[11px] sm:text-xs font-black text-white bg-emerald-800/80 px-2.5 py-0.5 rounded-full mt-1">
                Xuất phát
              </span>
            </div>

            {/* Right Bank: House */}
            <div className="absolute right-0 bottom-0 w-28 sm:w-44 h-4/5 bg-gradient-to-t from-emerald-600 to-green-500 rounded-tl-3xl shadow-md border-l-4 border-emerald-700 flex flex-col items-center justify-start pt-2">
              <div className="relative text-5xl md:text-6xl filter drop-shadow">
                🏡
                {isCompleted && (
                  <span className="absolute -top-3 -right-2 text-3xl animate-bounce">🥕🥕🥕</span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs font-black text-white bg-amber-600/90 px-2.5 py-0.5 rounded-full mt-1">
                Nhà thỏ con
              </span>
            </div>

            {/* 5 Stepping Stones */}
            <div className="absolute inset-x-28 sm:inset-x-44 bottom-6 sm:bottom-10 h-32 flex items-center justify-between px-2">
              {[0, 1, 2, 3, 4].map((idx) => {
                const isCurrent = currentStep === idx;
                const isPassed = currentStep > idx;

                return (
                  <div
                    key={idx}
                    className={`relative flex flex-col items-center transition-all duration-300 ${
                      isCurrent && shakeStone ? 'animate-wiggle' : ''
                    }`}
                  >
                    {/* Stepping Stone Oval (Enlarged) */}
                    <div
                      className={`w-16 h-14 sm:w-20 sm:h-16 md:w-24 md:h-18 rounded-[50%] border-b-4 flex items-center justify-center font-black text-base sm:text-lg md:text-xl shadow-lg transition-transform ${
                        isPassed
                          ? 'bg-amber-100 border-amber-400 text-amber-900 scale-95 opacity-80'
                          : isCurrent
                          ? 'bg-gradient-to-b from-amber-200 to-amber-400 border-amber-600 text-amber-950 scale-110 ring-4 ring-yellow-300/90 animate-pulse-subtle'
                          : 'bg-slate-300 border-slate-500 text-slate-700 opacity-90'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    {/* Active Bunny on Stone */}
                    {currentStep === idx && (
                      <div
                        className={`absolute -top-16 sm:-top-20 text-5xl sm:text-6xl drop-shadow-md z-10 transition-transform ${
                          isJumping ? '-translate-y-8 scale-125 rotate-6' : 'animate-bounce'
                        }`}
                      >
                        🐰
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Clouds in sky */}
            <div className="absolute top-3 left-10 text-3xl opacity-80 animate-float">☁️</div>
            <div className="absolute top-4 right-48 text-2xl opacity-70 animate-float" style={{ animationDelay: '1.5s' }}>☁️</div>
          </div>

          {/* KHU VỰC DƯỚI: ĐÁP ÁN LỚN & ĐIỀU KHIỂN (20-25%) */}
          <div className="shrink-0 bg-white/95 rounded-2xl p-2.5 sm:p-4 border border-emerald-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 font-heading bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 shrink-0">
              {currentStage.mathDisplay}
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4 flex-1 max-w-xl">
              {currentStage.options.map((opt) => (
                <button
                  key={opt}
                  disabled={isJumping}
                  onClick={() => handleOptionClick(opt)}
                  className={`h-14 sm:h-16 md:h-20 text-2xl sm:text-3xl font-black rounded-2xl border-b-4 transition-all transform cursor-pointer active:scale-95 flex items-center justify-center ${
                    selectedOption === opt
                      ? opt === currentStage.answer
                        ? 'bg-emerald-500 text-white border-emerald-700 ring-4 ring-emerald-300'
                        : 'bg-rose-500 text-white border-rose-700 ring-4 ring-rose-300 animate-wiggle'
                      : 'bg-sky-50 hover:bg-sky-100 text-sky-950 border-sky-300 hover:border-sky-400 hover:scale-105'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {feedbackMsg && (
              <div className="text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
                {langMode === 'en' ? feedbackMsg.en : feedbackMsg.vi}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* VICTORY VIEW (Zero Scroll) */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-50 to-orange-100 text-center space-y-4">
          <div className="text-6xl animate-bounce">🏆🐰🥕</div>
          <h3 className="text-2xl md:text-3xl font-black text-amber-900 font-heading">
            THỎ CON ĐÃ VỀ NHÀ AN TOÀN!
          </h3>
          <p className="text-base font-bold text-amber-700">
            “You did it! You're a Math Star!”
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl w-full py-2">
            <div className="bg-white p-3 rounded-2xl border border-amber-200">
              <div className="text-2xl">🎯</div>
              <div className="text-xs text-slate-500 font-bold">Chặng vượt qua</div>
              <div className="text-lg font-black text-emerald-600">5 / 5</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-amber-200">
              <div className="text-2xl">🥕</div>
              <div className="text-xs text-slate-500 font-bold">Cà rốt nhận được</div>
              <div className="text-lg font-black text-orange-600">+3 Củ</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-amber-200">
              <div className="text-2xl">⭐</div>
              <div className="text-xs text-slate-500 font-bold">Sao thưởng</div>
              <div className="text-lg font-black text-amber-500">+15 Sao</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-amber-200">
              <div className="text-2xl">🏅</div>
              <div className="text-xs text-slate-500 font-bold">Huy hiệu</div>
              <div className="text-xs font-black text-purple-700">Thỏ Nhanh Trí</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={restartGame}
              className="py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold rounded-2xl shadow-md hover:from-emerald-600 hover:to-teal-600 cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi lại vòng mới</span>
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
