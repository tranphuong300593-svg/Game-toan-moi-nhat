/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundService, soundEffects } from '../../services/audioService';
import confetti from 'canvas-confetti';
import { FullscreenStage } from '../common/FullscreenStage';
import { RotateCcw, Volume2, Clock, Sparkles } from 'lucide-react';

interface MagicClockGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

interface ClockQuest {
  id: number;
  targetHour: number;
  activityVi: string;
  activityEn: string;
  icon: string;
}

// 4 core quests matching Grade 1 curriculum
const CLOCK_QUESTS: ClockQuest[] = [
  { id: 1, targetHour: 7, activityVi: 'Bé thức dậy chuẩn bị đến trường', activityEn: "Wake up for school", icon: '🌅' },
  { id: 2, targetHour: 11, activityVi: 'Ăn trưa ngon lành tại trường', activityEn: "Lunch at school", icon: '🍱' },
  { id: 3, targetHour: 5, activityVi: 'Tan học đá bóng vui chơi', activityEn: "Play soccer after class", icon: '⚽' },
  { id: 4, targetHour: 9, activityVi: 'Bé đi ngủ đúng giờ để khỏe mạnh', activityEn: "Bedtime to stay healthy", icon: '🌙' },
];

export const MagicClockGame: React.FC<MagicClockGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [questIdx, setQuestIdx] = useState(0);
  const [currentHour, setCurrentHour] = useState(12);
  const [gearsSpinning, setGearsSpinning] = useState(false);
  const [portalActivated, setPortalActivated] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState<string | null>(null);

  const quest = CLOCK_QUESTS[questIdx];

  const handleSetHour = (hour: number) => {
    if (gearsSpinning || isCompleted) return;

    setCurrentHour(hour);
    soundService.playClick();

    if (hour === quest?.targetHour) {
      // Correct!
      setGearsSpinning(true);
      soundEffects.correct();
      setFeedback(`Chính xác! Đồng hồ đã chỉ đúng ${hour} giờ!`);

      setTimeout(() => {
        setGearsSpinning(false);
        if (questIdx + 1 < CLOCK_QUESTS.length) {
          setQuestIdx(questIdx + 1);
          setFeedback(null);
        } else {
          // Completed all 4 times! Time portal activates!
          setPortalActivated(true);
          soundEffects.celebrate();
          confetti({ particleCount: 160, spread: 90 });

          setTimeout(() => {
            setIsCompleted(true);
            StorageService.recordActivity(student.id, {
              type: 'game',
              targetId: 'magic-clock',
              targetName: 'Đồng Hồ Phép Thuật',
              score: 4,
              totalQuestions: 4,
              starsEarned: 20,
              timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
            });

            const updated = StorageService.getCurrentStudent();
            if (updated) onUpdateStudent(updated);
          }, 1200);
        }
      }, 1000);
    } else {
      // Wrong
      soundEffects.wrong();
      setFeedback(`Đang là ${hour} giờ. Hãy chỉnh đến ${quest?.targetHour} giờ đúng nhé!`);
    }
  };

  const restartGame = () => {
    setQuestIdx(0);
    setCurrentHour(12);
    setGearsSpinning(false);
    setPortalActivated(false);
    setIsCompleted(false);
    setFeedback(null);
    soundService.playClick();
  };

  // Hour hand rotation angle (12 = 0 deg, 1 = 30 deg, etc.)
  const hourAngle = (currentHour % 12) * 30;

  return (
    <FullscreenStage
      titleVi="Đồng Hồ Phép Thuật"
      titleEn="Magic Clock Time Machine"
      categoryBadge="Xem Giờ Đúng Lớp 1"
      onBack={onBack}
      topRightControls={
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="bg-purple-100 border border-purple-300 text-purple-900 px-2.5 py-1 rounded-xl font-black text-xs">
            Mốc {questIdx + 1} / 4
          </div>
          <button
            type="button"
            onClick={restartGame}
            title="Làm lại từ đầu"
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      }
    >
      {!isCompleted && quest ? (
        <div className="w-full h-full max-w-[177.78vh] mx-auto flex flex-col justify-between overflow-hidden select-none p-1.5 sm:p-2.5">
          {/* 1. TOP SECTION (12% Height) - Crisp Short Prompt & Voice Button */}
          <div className="h-[12%] flex items-center justify-between bg-white/95 backdrop-blur-xs px-3 sm:px-4 py-1.5 rounded-2xl border border-purple-200 shadow-xs shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-2xl sm:text-3xl shrink-0 animate-bounce">{quest.icon}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm md:text-base font-black text-slate-900 truncate">
                    Hãy chỉnh đồng hồ:{' '}
                    <span className="text-rose-600 font-black text-sm sm:text-lg md:text-xl underline decoration-rose-300">
                      {quest.targetHour} giờ đúng
                    </span>
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-semibold truncate">
                  {quest.activityVi} ({quest.activityEn})
                </p>
              </div>
            </div>

            {/* Quick English Speaker Audio Button */}
            <button
              type="button"
              onClick={() => soundService.speakEn(`Set the clock to ${quest.targetHour} o'clock`)}
              className="p-1.5 sm:p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 cursor-pointer shadow-xs shrink-0 flex items-center gap-1 text-xs font-bold active:scale-95 transition-all"
              title="Phát âm tiếng Anh"
            >
              <Volume2 className="w-4 h-4 text-purple-700" />
              <span className="hidden sm:inline">Phát âm 🔊</span>
            </button>
          </div>

          {/* 2. CENTER SECTION (66% Height) - Giant Analog Clock Face */}
          <div className="h-[66%] relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-inner border-2 border-purple-400 bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-900 select-none flex items-center justify-center p-2 shrink-0">
            {/* Background Spinning Magic Gears */}
            <div
              className={`absolute text-7xl sm:text-8xl text-purple-800/30 -top-4 -left-4 pointer-events-none transition-transform duration-1000 ${
                gearsSpinning ? 'rotate-180 animate-spin' : ''
              }`}
            >
              ⚙️
            </div>
            <div
              className={`absolute text-7xl sm:text-8xl text-indigo-800/30 -bottom-4 -right-4 pointer-events-none transition-transform duration-1000 ${
                gearsSpinning ? '-rotate-180 animate-spin' : ''
              }`}
            >
              ⚙️
            </div>

            {/* Time Portal Sparkles when complete */}
            {portalActivated && (
              <div className="absolute inset-0 bg-radial from-fuchsia-500/30 to-transparent animate-pulse pointer-events-none" />
            )}

            {/* The Giant Circular Analog Clock Face */}
            <div className="relative aspect-square h-[92%] max-h-[380px] rounded-full bg-gradient-to-br from-white via-sky-50 to-purple-50 border-8 sm:border-10 border-amber-400 shadow-2xl flex items-center justify-center">
              {/* Outer Minute Tick Ring */}
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-amber-300/60 pointer-events-none" />

              {/* Numbers 1 to 12 Positioned Perfectly by Trig Geometry - Fixed clean color without red highlight */}
              {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => {
                const angle = (h % 12) * 30;
                const rad = (angle - 90) * (Math.PI / 180);
                // Proportional radius from center (39% of container diameter)
                const radiusPct = 39;
                const leftPct = 50 + radiusPct * Math.cos(rad);
                const topPct = 50 + radiusPct * Math.sin(rad);

                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleSetHour(h)}
                    className="absolute w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center font-black text-sm sm:text-base md:text-xl text-slate-800 hover:bg-purple-100 hover:text-purple-700 active:scale-95 transition-all cursor-pointer z-10"
                    style={{
                      left: `${leftPct}%`,
                      top: `${topPct}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    title={`Chỉnh ${h} giờ`}
                  >
                    {h}
                  </button>
                );
              })}

              {/* Long Minute Hand (Points directly up at 12 o'clock, stops cleanly before numbers) */}
              <div
                className="absolute w-2 sm:w-2.5 h-[26%] bg-sky-600 rounded-full shadow-sm pointer-events-none"
                style={{
                  bottom: '50%',
                  left: 'calc(50% - 4px)',
                  transformOrigin: 'bottom center',
                  transform: 'rotate(0deg)',
                }}
              >
                {/* Arrow head tip */}
                <div className="w-3.5 h-3.5 rounded-full bg-sky-800 -top-1 left-1/2 -translate-x-1/2 absolute shadow-xs" />
              </div>

              {/* Short Hour Hand (Points to currentHour, rotates smoothly, stops well before numbers) */}
              <div
                className="absolute w-3.5 sm:w-4 h-[17%] bg-rose-600 rounded-full shadow-md pointer-events-none transition-transform duration-500 ease-out z-10"
                style={{
                  bottom: '50%',
                  left: 'calc(50% - 7px)',
                  transformOrigin: 'bottom center',
                  transform: `rotate(${hourAngle}deg)`,
                }}
              >
                {/* Arrow head tip */}
                <div className="w-4.5 h-4.5 rounded-full bg-rose-800 -top-1 left-1/2 -translate-x-1/2 absolute shadow-xs" />
              </div>

              {/* Center Golden Pin */}
              <div
                className="absolute w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-400 border-2 border-white shadow-md z-20 flex items-center justify-center pointer-events-none"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-amber-800" />
              </div>
            </div>

            {/* Current Time Digital Badge */}
            <div className="absolute bottom-2 left-3 bg-slate-900/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-xl border border-purple-500/80 text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-md">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Đang chỉ:{' '}
                <strong className="text-yellow-300 font-black">{currentHour} giờ đúng</strong>
              </span>
            </div>
          </div>

          {/* 3. BOTTOM SECTION (22% Height) - 12 Big Hour Buttons & Feedback */}
          <div className="h-[22%] bg-white/95 backdrop-blur-xs rounded-2xl p-2 sm:p-2.5 border border-purple-200 shadow-sm flex flex-col justify-between shrink-0">
            {/* Feedback & Short instruction */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] sm:text-xs font-black text-slate-700">
                Bấm số giờ để xoay kim:
              </span>
              {feedback && (
                <span className="text-[11px] sm:text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-md border border-purple-300 animate-pulse">
                  {feedback}
                </span>
              )}
            </div>

            {/* 12 Hour Quick-Tap Buttons */}
            <div className="grid grid-cols-12 gap-1 sm:gap-1.5 w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => handleSetHour(h)}
                  className={`h-10 sm:h-12 rounded-xl font-black text-sm sm:text-lg transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
                    currentHour === h
                      ? 'bg-purple-700 text-white shadow-md scale-105 ring-2 ring-purple-300'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-200 hover:border-purple-300'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* VICTORY SCREEN */
        <div className="w-full h-full max-w-[177.78vh] mx-auto flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-indigo-100 text-center select-none overflow-hidden">
          <div className="text-5xl sm:text-6xl animate-bounce mb-2">⏰✨🌀⌛</div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-purple-950 font-heading mb-1">
            CỖ MÁY THỜI GIAN ĐÃ KÍCH HOẠT!
          </h3>
          <p className="text-xs sm:text-sm font-bold text-purple-700 mb-3">
            “Time Explorer Master! Cánh cổng thời gian đã mở ra!”
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl w-full py-2 mb-3">
            <div className="bg-white p-2.5 rounded-2xl border border-purple-200 shadow-xs">
              <div className="text-2xl">⏰</div>
              <div className="text-[11px] text-slate-500 font-bold">Chỉnh đúng</div>
              <div className="text-base font-black text-purple-600">4 / 4 Mốc</div>
            </div>
            <div className="bg-white p-2.5 rounded-2xl border border-purple-200 shadow-xs">
              <div className="text-2xl">⭐</div>
              <div className="text-[11px] text-slate-500 font-bold">Số sao nhận</div>
              <div className="text-base font-black text-amber-500">+20 Sao</div>
            </div>
            <div className="bg-white p-2.5 rounded-2xl border border-purple-200 shadow-xs">
              <div className="text-2xl">🏅</div>
              <div className="text-[11px] text-slate-500 font-bold">Huy hiệu mới</div>
              <div className="text-xs font-black text-purple-700">Chủ Nhân Thời Gian</div>
            </div>
            <div className="bg-white p-2.5 rounded-2xl border border-purple-200 shadow-xs">
              <div className="text-2xl">🌀</div>
              <div className="text-[11px] text-slate-500 font-bold">Cổng thời gian</div>
              <div className="text-base font-black text-indigo-600">Đã kích hoạt</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 w-full max-w-md">
            <button
              type="button"
              onClick={restartGame}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold rounded-xl shadow-md hover:from-purple-600 hover:to-indigo-700 cursor-pointer flex items-center justify-center gap-2 active:scale-95 text-xs sm:text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi lại</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 font-extrabold rounded-xl border-2 border-slate-300 cursor-pointer active:scale-95 text-xs sm:text-sm"
            >
              Quay lại Khu Vực 4
            </button>
          </div>
        </div>
      )}
    </FullscreenStage>
  );
};
