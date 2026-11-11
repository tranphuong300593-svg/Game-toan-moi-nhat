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
import { ArrowLeft, RotateCcw, Volume2 } from 'lucide-react';

interface NumberTrainGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

interface TrainQuest {
  id: number;
  titleVi: string;
  titleEn: string;
  sequence: (number | null)[]; // e.g. [12, 13, null, null, 16]
  fullSequence: number[];
  missingIndices: number[];
  options: number[];
}

export const NumberTrainGame: React.FC<NumberTrainGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [round, setRound] = useState(0); // 3 rounds to complete a train journey
  const [quest, setQuest] = useState<TrainQuest | null>(null);
  const [currentSlots, setCurrentSlots] = useState<(number | null)[]>([]);
  const [trainDeparting, setTrainDeparting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState<string | null>(null);

  // Generate sequence quest
  const generateQuest = (roundIndex: number): TrainQuest => {
    let start = 1;
    let step = 1;
    if (roundIndex === 0) {
      // 1-digit numbers
      start = Math.floor(Math.random() * 5) + 1; // e.g. 2, 3, 4, 5, 6
    } else if (roundIndex === 1) {
      // Teen numbers
      start = 10 + Math.floor(Math.random() * 5); // 12, 13, 14, 15, 16
    } else {
      // Multiples of 10 or two-digit
      start = Math.floor(Math.random() * 5) * 10 + 20; // 30, 40, 50, 60
      step = 10;
    }

    const full = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
    // Hide 2 slots
    const missingIndices = [2, 3];
    const initialSlots: (number | null)[] = full.map((val, idx) =>
      missingIndices.includes(idx) ? null : val
    );

    const neededVals = missingIndices.map((i) => full[i]);
    const distractor1 = full[2] + 2;
    const distractor2 = Math.max(0, full[3] - 1);
    const options = Array.from(new Set([...neededVals, distractor1, distractor2])).sort(
      () => Math.random() - 0.5
    );

    return {
      id: roundIndex,
      titleVi: step === 10 ? 'Ghép toa các số tròn chục' : 'Ghép toa tàu theo thứ tự từ bé đến lớn',
      titleEn: step === 10 ? 'Attach tens carriages' : 'Arrange train cars in ascending order',
      sequence: initialSlots,
      fullSequence: full,
      missingIndices,
      options,
    };
  };

  useEffect(() => {
    const q = generateQuest(0);
    setQuest(q);
    setCurrentSlots([...q.sequence]);
  }, []);

  const handlePlaceCar = (val: number) => {
    if (!quest || trainDeparting || isCompleted) return;

    // Find first empty slot
    const emptyIdx = currentSlots.findIndex((s) => s === null);
    if (emptyIdx === -1) return;

    if (quest.fullSequence[emptyIdx] === val) {
      // Correct!
      soundService.playWhistle();
      soundEffects.correct();
      const nextSlots = [...currentSlots];
      nextSlots[emptyIdx] = val;
      setCurrentSlots(nextSlots);
      setFeedback('Toa tàu đã được gắn chặt vào đoàn tàu!');

      // Check if all slots filled
      if (!nextSlots.includes(null)) {
        // Train completes and departs!
        setTrainDeparting(true);
        soundService.playWhistle();

        setTimeout(() => {
          if (round + 1 < 3) {
            const nextRound = round + 1;
            setRound(nextRound);
            const nextQ = generateQuest(nextRound);
            setQuest(nextQ);
            setCurrentSlots([...nextQ.sequence]);
            setTrainDeparting(false);
            setFeedback(null);
          } else {
            // Victory!
            setIsCompleted(true);
            setTrainDeparting(false);
            soundEffects.celebrate();
            confetti({ particleCount: 140, spread: 90 });

            StorageService.recordActivity(student.id, {
              type: 'game',
              targetId: 'number-train',
              targetName: 'Đoàn Tàu Số',
              score: 3,
              totalQuestions: 3,
              starsEarned: 20,
              timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
            });

            const updated = StorageService.getCurrentStudent();
            if (updated) onUpdateStudent(updated);
          }
        }, 1500);
      }
    } else {
      // Wrong
      soundEffects.wrong();
      setFeedback('Toa này chưa đúng vị trí rồi, bé hãy chọn lại nhé!');
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const restartGame = () => {
    setRound(0);
    setIsCompleted(false);
    setTrainDeparting(false);
    setFeedback(null);
    const q = generateQuest(0);
    setQuest(q);
    setCurrentSlots([...q.sequence]);
    soundService.playClick();
  };

  return (
    <FullscreenStage
      titleVi="Đoàn Tàu Số"
      titleEn="Number Train Master"
      categoryBadge="Trò chơi Lớp 1"
      onBack={onBack}
      topRightControls={
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1 rounded-xl font-bold text-xs">
            Chuyến {round + 1} / 3
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
      {!isCompleted && quest ? (
        <div className="w-full h-full flex flex-col justify-between overflow-hidden p-2 sm:p-4 gap-2">
          {/* KHU VỰC TRÊN: CÂU HỎI (15-20%) */}
          <div className="shrink-0 bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-amber-200 shadow-xs flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  {quest.titleVi}
                </span>
                <span className="text-base sm:text-lg md:text-xl font-black text-slate-900 font-heading truncate">
                  Nhấn vào toa số còn thiếu để hoàn thiện đoàn tàu!
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 italic truncate">
                {quest.titleEn}
              </p>
            </div>

            <button
              onClick={() => soundService.speakEn(quest.titleEn)}
              className="p-2 sm:p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 cursor-pointer shadow-xs shrink-0 flex items-center gap-1 text-xs font-bold"
              title="Nghe tiếng Anh"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Phát âm 🔊</span>
            </button>
          </div>

          {/* KHU VỰC GIỮA: HÌNH MINH HỌA ĐOÀN TÀU 1.5-2X (50-55%) */}
          <div className="flex-1 min-h-0 relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-inner border-2 md:border-4 border-amber-300 bg-gradient-to-b from-sky-200 via-sky-100 to-amber-100 select-none flex items-center justify-center">
            {/* Scenery details */}
            <div className="absolute top-3 left-6 text-4xl animate-pulse-subtle">☀️</div>
            <div className="absolute top-6 left-28 text-2xl opacity-80 animate-float">☁️</div>
            <div className="absolute top-8 right-32 text-3xl opacity-70 animate-float">☁️</div>

            {/* Railway Station House on background */}
            <div className="absolute right-4 bottom-20 bg-rose-400 border-2 border-rose-600 rounded-2xl p-2.5 shadow-md flex flex-col items-center">
              <span className="text-[10px] font-black text-white uppercase tracking-wider bg-rose-700 px-2 py-0.5 rounded-md">
                Nhà Ga Vui Vẻ
              </span>
              <span className="text-3xl mt-0.5">🚉</span>
            </div>

            {/* Railway Track */}
            <div className="absolute inset-x-0 bottom-8 sm:bottom-10 h-7 bg-slate-700 flex items-center justify-around border-t-4 border-slate-900">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="w-2 h-6 bg-amber-800 border-r border-amber-900" />
              ))}
            </div>

            {/* The Train with Engine & Carriages (Enlarged) */}
            <div
              className={`absolute bottom-12 sm:bottom-14 flex items-end transition-all duration-1000 ease-in-out ${
                trainDeparting ? 'translate-x-full opacity-70' : 'left-3 sm:left-8'
              }`}
            >
              {/* Steam Engine (Enlarged) */}
              <div className="relative flex flex-col items-center mr-2 sm:mr-3">
                <div className="absolute -top-12 left-4 flex gap-1.5 animate-bounce">
                  <span className="text-2xl opacity-80">💨</span>
                  <span className="text-base opacity-60">💨</span>
                </div>

                <div className="w-24 sm:w-28 md:w-32 h-28 sm:h-32 md:h-36 bg-gradient-to-b from-red-500 to-red-700 rounded-t-2xl border-4 border-red-900 flex flex-col items-center justify-between p-2 shadow-lg">
                  <span className="text-xs font-black text-yellow-300">ROBOT</span>
                  <div className="w-12 h-10 bg-sky-200 rounded-lg border-2 border-slate-700 flex items-center justify-center text-2xl">
                    🤖
                  </div>
                  <div className="w-16 h-5 bg-yellow-400 rounded-full border border-yellow-600" />
                </div>

                <div className="flex gap-2 -mt-3">
                  <div className="w-8 h-8 bg-slate-800 rounded-full border-4 border-slate-400 animate-spin" />
                  <div className="w-8 h-8 bg-slate-800 rounded-full border-4 border-slate-400 animate-spin" />
                </div>
              </div>

              {/* Carriages Slots (Enlarged 1.5-2x) */}
              <div className="flex items-end gap-2 sm:gap-3">
                {currentSlots.map((slotVal, idx) => {
                  const isFilled = slotVal !== null;
                  const isTargetSlot = !isFilled && currentSlots.findIndex((s) => s === null) === idx;

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className={`w-18 h-20 sm:w-22 sm:h-24 md:w-26 md:h-28 rounded-2xl border-4 flex flex-col items-center justify-center font-black text-2xl sm:text-3xl md:text-4xl shadow-md transition-all ${
                          isFilled
                            ? 'bg-gradient-to-b from-sky-300 to-blue-500 border-blue-800 text-white scale-100'
                            : isTargetSlot
                            ? 'bg-yellow-200/90 border-dashed border-amber-600 text-amber-900 animate-pulse scale-105 ring-4 ring-yellow-400'
                            : 'bg-white/60 border-dashed border-slate-400 text-slate-400'
                        }`}
                      >
                        {isFilled ? slotVal : '?'}
                        {isFilled && (
                          <span className="text-[11px] text-sky-100 uppercase tracking-tighter mt-1">
                            Toa {idx + 1}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2 -mt-2">
                        <div className="w-6 h-6 bg-slate-800 rounded-full border-2 border-slate-300" />
                        <div className="w-6 h-6 bg-slate-800 rounded-full border-2 border-slate-300" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* KHU VỰC DƯỚI: TOA TÀU ĐÁP ÁN LỚN (20-25%) */}
          <div className="shrink-0 bg-white/95 rounded-2xl p-2.5 sm:p-4 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm font-black text-slate-700 shrink-0">
              Chọn toa số đúng để gắn vào vị trí nhấp nháy:
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 flex-1">
              {quest.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handlePlaceCar(opt)}
                  disabled={trainDeparting}
                  className="w-18 h-16 sm:w-22 sm:h-18 md:w-26 md:h-20 bg-gradient-to-b from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 active:scale-95 text-white font-black text-2xl sm:text-3xl rounded-2xl shadow-md border-b-4 border-amber-800 transition-transform cursor-pointer flex flex-col items-center justify-center"
                >
                  <span>{opt}</span>
                  <span className="text-[10px] text-amber-100 font-bold">Gắn toa</span>
                </button>
              ))}
            </div>

            {feedback && (
              <div className="text-xs sm:text-sm font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 shrink-0 animate-pulse">
                {feedback}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* VICTORY VIEW (Zero Scroll) */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-50 to-orange-100 text-center space-y-4">
          <div className="text-6xl animate-bounce">🚂💨⭐</div>
          <h3 className="text-2xl md:text-3xl font-black text-amber-900 font-heading">
            ĐOÀN TÀU ĐÃ KHỞI HÀNH THÀNH CÔNG!
          </h3>
          <p className="text-base font-bold text-amber-700">
            “Number Train Master! All carriages arrived safely!”
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl w-full py-2">
            <div className="bg-white p-3 rounded-2xl border border-amber-200">
              <div className="text-2xl">🚂</div>
              <div className="text-xs text-slate-500 font-bold">Chuyến tàu</div>
              <div className="text-lg font-black text-amber-600">3 / 3</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-amber-200">
              <div className="text-2xl">⭐</div>
              <div className="text-xs text-slate-500 font-bold">Số sao</div>
              <div className="text-lg font-black text-amber-500">+20 Sao</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-amber-200">
              <div className="text-2xl">🏅</div>
              <div className="text-xs text-slate-500 font-bold">Huy hiệu</div>
              <div className="text-xs font-black text-purple-700">Number Train Master</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-amber-200">
              <div className="text-2xl">⏰</div>
              <div className="text-xs text-slate-500 font-bold">Thời gian</div>
              <div className="text-lg font-black text-blue-600">
                {Math.round((Date.now() - startTime) / 1000)}s
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={restartGame}
              className="py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold rounded-2xl shadow-md hover:from-amber-600 hover:to-orange-600 cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi chuyến mới</span>
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
