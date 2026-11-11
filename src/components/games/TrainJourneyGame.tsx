/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundEffects, soundService } from '../../services/audioService';
import { Volume2, Sparkles, Check, ArrowLeft, RotateCcw, Trophy } from 'lucide-react';

interface TrainJourneyGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

export const TrainJourneyGame: React.FC<TrainJourneyGameProps> = ({
  student,
  langMode: _langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isTrainMoving, setIsTrainMoving] = useState<boolean>(false);

  // Helper for English pronunciation
  const handleSpeakEn = (text: string) => {
    soundEffects.click();
    soundService.speak(text, 'en');
  };

  // -------------------------------------------------------------
  // THỬ THÁCH 1: TOA TÀU BÍ MẬT (21 – 22 – ? – 24 – 25 -> chọn 23)
  // -------------------------------------------------------------
  const [selectedSlotC1, setSelectedSlotC1] = useState<number | null>(null);
  const c1Options = [20, 23, 26];

  const handleSelectC1 = (num: number) => {
    if (selectedSlotC1 !== null || feedback) return;

    if (num === 23) {
      soundEffects.correct();
      setSelectedSlotC1(23);
      setIsTrainMoving(true);
      setFeedback({ isCorrect: true, text: 'Chính xác! Số 23 là số còn thiếu trong dãy 21, 22, 23, 24, 25!' });
      setScore((prev) => prev + 5);
      setTimeout(() => {
        setIsTrainMoving(false);
        handleNextStage();
      }, 1500);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: `Số ${num} chưa đúng! Dãy số đếm tiến cách 1 đơn vị: 21, 22 rồi đến số nào?` });
      setTimeout(() => setFeedback(null), 1400);
    }
  };

  // -------------------------------------------------------------
  // THỬ THÁCH 2: ĐỔI CHỖ CHO TOA TÀU (46 – 12 – 35 – 24 -> Xếp từ bé đến lớn)
  // Thứ tự đúng: 12, 24, 35, 46
  // -------------------------------------------------------------
  const initialC2Cars = [46, 12, 35, 24];
  const targetC2Order = [12, 24, 35, 46];
  const [sortedCars, setSortedCars] = useState<number[]>([]);

  const handlePickCarC2 = (val: number) => {
    if (feedback || sortedCars.includes(val)) return;
    soundEffects.click();

    const expectedNext = targetC2Order[sortedCars.length];
    if (val === expectedNext) {
      const nextList = [...sortedCars, val];
      setSortedCars(nextList);

      if (nextList.length === targetC2Order.length) {
        soundEffects.correct();
        setIsTrainMoving(true);
        setFeedback({ isCorrect: true, text: 'Tuyệt đỉnh! Các toa tàu đã được sắp xếp từ bé đến lớn: 12, 24, 35, 46!' });
        setScore((prev) => prev + 5);
        setTimeout(() => {
          setIsTrainMoving(false);
          handleNextStage();
        }, 1600);
      }
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Chưa đúng thứ tự từ bé đến lớn! Bé hãy tìm số nhỏ nhất tiếp theo nhé.' });
      setTimeout(() => setFeedback(null), 1400);
    }
  };

  const handleResetC2 = () => {
    if (isTrainMoving) return;
    soundEffects.click();
    setSortedCars([]);
    setFeedback(null);
  };

  // -------------------------------------------------------------
  // THỬ THÁCH 3: GA TÀU HÀNG CHỤC ("Toa nào có 4 chục và 3 đơn vị?")
  // 3 toa: 34, 43, 57 -> chọn 43
  // -------------------------------------------------------------
  const [selectedCarC3, setSelectedCarC3] = useState<number | null>(null);

  const handleSelectC3 = (val: number) => {
    if (selectedCarC3 !== null || feedback) return;
    setSelectedCarC3(val);

    if (val === 43) {
      soundEffects.correct();
      setIsTrainMoving(true);
      setFeedback({ isCorrect: true, text: 'Rất giỏi! Số 43 gồm 4 chục và 3 đơn vị. Toa 43 đã nối vào đầu máy!' });
      setScore((prev) => prev + 5);
      setTimeout(() => {
        setIsTrainMoving(false);
        handleNextStage();
      }, 1500);
    } else {
      soundEffects.wrong();
      const hint = val === 34 ? 'Số 34 gồm 3 chục và 4 đơn vị!' : 'Số 57 gồm 5 chục và 7 đơn vị!';
      setFeedback({ isCorrect: false, text: `Chưa đúng! ${hint} Hãy tìm toa có 4 chục và 3 đơn vị nhé!` });
      setTimeout(() => {
        setSelectedCarC3(null);
        setFeedback(null);
      }, 1500);
    }
  };

  // -------------------------------------------------------------
  // THỬ THÁCH 4: ĐƯỜNG RAY SO SÁNH (58 và 63: "Số nào lớn hơn?")
  // Đáp án: 63
  // -------------------------------------------------------------
  const [selectedCarC4, setSelectedCarC4] = useState<number | null>(null);

  const handleSelectC4 = (val: number) => {
    if (selectedCarC4 !== null || feedback) return;
    setSelectedCarC4(val);

    if (val === 63) {
      soundEffects.correct();
      setIsTrainMoving(true);
      setFeedback({ isCorrect: true, text: 'Chính xác! 63 lớn hơn 58 (vì chữ số hàng chục 6 > 5)!' });
      setScore((prev) => prev + 5);
      setTimeout(() => {
        setIsTrainMoving(false);
        handleNextStage();
      }, 1500);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Chưa đúng! 58 có 5 chục, còn 63 có 6 chục. 6 chục lớn hơn 5 chục nhé!' });
      setTimeout(() => {
        setSelectedCarC4(null);
        setFeedback(null);
      }, 1400);
    }
  };

  // -------------------------------------------------------------
  // THỬ THÁCH 5: CHUYẾN TÀU VỀ ĐÍCH (60 – 70 – ? – 90 – 100 -> chọn 80)
  // -------------------------------------------------------------
  const [selectedSlotC5, setSelectedSlotC5] = useState<number | null>(null);
  const c5Options = [75, 80, 85];

  const handleSelectC5 = (num: number) => {
    if (selectedSlotC5 !== null || feedback) return;

    if (num === 80) {
      soundEffects.celebrate();
      setSelectedSlotC5(80);
      setIsTrainMoving(true);
      setFeedback({ isCorrect: true, text: 'Xuất sắc! Số 80 là số còn thiếu trong dãy số tròn chục 60, 70, 80, 90, 100!' });
      setScore((prev) => prev + 5);

      setTimeout(() => {
        setIsTrainMoving(false);
        setIsCompleted(true);
        StorageService.recordActivity(student.id, {
          type: 'game',
          targetId: 'train-journey',
          targetName: 'Đoàn Tàu Xuyên Vương Quốc',
          score: 5,
          totalQuestions: 5,
          starsEarned: 25,
          timeSpentSeconds: 90,
        });
        const updated = StorageService.getCurrentStudent();
        if (updated) {
          onUpdateStudent(updated);
        }
      }, 1600);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: `Số ${num} chưa đúng! Đây là dãy số tròn chục đếm thêm 10: 60, 70 rồi đến số nào?` });
      setTimeout(() => setFeedback(null), 1400);
    }
  };

  const handleNextStage = () => {
    setFeedback(null);
    setStageIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    setStageIndex(0);
    setScore(0);
    setFeedback(null);
    setIsCompleted(false);
    setSelectedSlotC1(null);
    setSortedCars([]);
    setSelectedCarC3(null);
    setSelectedCarC4(null);
    setSelectedSlotC5(null);
    setIsTrainMoving(false);
  };

  const stageTitles = [
    'Thử thách 1: Toa tàu bí mật',
    'Thử thách 2: Đổi chỗ cho toa tàu',
    'Thử thách 3: Ga tàu hàng chục',
    'Thử thách 4: Đường ray so sánh',
    'Thử thách 5: Chuyến tàu về đích',
  ];

  return (
    <div className="w-full h-full max-h-[100dvh] flex flex-col bg-gradient-to-br from-amber-950 via-slate-900 to-indigo-950 text-white select-none overflow-hidden font-sans">
      {/* 1. Header Navigation Bar */}
      <header className="flex-none px-4 sm:px-6 py-2 sm:py-2.5 bg-black/50 backdrop-blur-md border-b border-amber-500/30 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-bold text-xs sm:text-sm border border-amber-400/30 transition shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Lâu Đài Những Con Số</span>
          </button>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xl">🚂</span>
            <div>
              <h1 className="text-xs sm:text-sm md:text-base font-black tracking-wide bg-gradient-to-r from-amber-300 via-orange-200 to-yellow-300 bg-clip-text text-transparent uppercase">
                ĐOÀN TÀU XUYÊN VƯƠNG QUỐC
              </h1>
              <p className="text-[11px] sm:text-xs text-amber-300 font-medium">
                {stageTitles[stageIndex] || 'Hoàn thành chuyến hành trình'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress & Stars */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex gap-1 sm:gap-1.5">
            {[0, 1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className={`w-6 sm:w-8 h-2 rounded-full transition-all duration-300 ${
                  idx < stageIndex
                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                    : idx === stageIndex
                    ? 'bg-orange-400 animate-pulse'
                    : 'bg-slate-700/60'
                }`}
              />
            ))}
          </div>
          <div className="px-2.5 sm:px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-xs sm:text-sm flex items-center gap-1 shadow-sm">
            <span>⭐</span>
            <span>+{score} sao</span>
          </div>
        </div>
      </header>

      {/* 2. Main Stage Area (16:9 Zero-Scroll Layout) */}
      <main className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 relative overflow-hidden">
        {/* Floating feedback alert */}
        {feedback && (
          <div
            className={`absolute top-2 sm:top-4 z-40 px-5 py-2 rounded-2xl font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 animate-bounce border ${
              feedback.isCorrect
                ? 'bg-emerald-500 text-white border-emerald-300 shadow-emerald-500/40'
                : 'bg-rose-500 text-white border-rose-300 shadow-rose-500/40'
            }`}
          >
            <span>{feedback.isCorrect ? '🌟' : '💡'}</span>
            <span>{feedback.text}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* THỬ THÁCH 1: TOA TÀU BÍ MẬT (21 – 22 – ? – 24 – 25) */}
        {/* ========================================================= */}
        {stageIndex === 0 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-5 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 1 • Toa tàu bí mật
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                Số nào còn thiếu?
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-amber-200/90 italic mt-0.5">
                <span>Which number is missing in the train sequence?</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Which number is missing?')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-6 rounded-3xl bg-slate-900/80 border-2 border-amber-500/40 backdrop-blur-md shadow-2xl flex flex-col items-center gap-5">
              {/* Train Display with Couplers & Track */}
              <div className="w-full overflow-x-auto pb-2 flex flex-col items-center">
                <div
                  className={`flex items-center gap-2 sm:gap-3 transition-transform duration-700 ${
                    isTrainMoving ? 'translate-x-12' : ''
                  }`}
                >
                  {/* Locomotive Engine */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-600 to-amber-700 rounded-2xl border-2 border-amber-300 flex flex-col items-center justify-center shadow-lg relative">
                    <span className="text-2xl sm:text-3xl">🚂</span>
                    <span className="text-[10px] font-black uppercase text-yellow-200">ĐẦU MÁY</span>
                  </div>

                  {/* Carriage 21 */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-b from-blue-600 to-indigo-700 rounded-xl border-2 border-blue-300 flex flex-col items-center justify-center font-black text-xl sm:text-2xl text-white shadow-md">
                    21
                  </div>

                  {/* Carriage 22 */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-b from-blue-600 to-indigo-700 rounded-xl border-2 border-blue-300 flex flex-col items-center justify-center font-black text-xl sm:text-2xl text-white shadow-md">
                    22
                  </div>

                  {/* Missing Carriage Slot */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-800 rounded-xl border-2 border-dashed border-amber-400 flex flex-col items-center justify-center font-black text-xl sm:text-2xl text-amber-300 shadow-inner">
                    {selectedSlotC1 ? (
                      <span className="animate-scale-up text-emerald-400">{selectedSlotC1}</span>
                    ) : (
                      <span className="animate-pulse">?</span>
                    )}
                  </div>

                  {/* Carriage 24 */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-b from-blue-600 to-indigo-700 rounded-xl border-2 border-blue-300 flex flex-col items-center justify-center font-black text-xl sm:text-2xl text-white shadow-md">
                    24
                  </div>

                  {/* Carriage 25 */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-b from-blue-600 to-indigo-700 rounded-xl border-2 border-blue-300 flex flex-col items-center justify-center font-black text-xl sm:text-2xl text-white shadow-md">
                    25
                  </div>
                </div>

                {/* Railway Track */}
                <div className="w-full max-w-xl h-3 bg-amber-900 border-y border-amber-600 mt-2 rounded flex justify-between px-2">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-full bg-slate-400" />
                  ))}
                </div>
              </div>

                {/* Options to Choose */}
                <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  Chạm chọn thẻ số lắp vào toa trống:
                </span>
                <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-sm">
                  {c1Options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      disabled={selectedSlotC1 !== null}
                      onClick={() => handleSelectC1(opt)}
                      className="py-3 px-4 rounded-2xl font-black text-2xl sm:text-3xl border-2 border-amber-400/40 bg-slate-800 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-300 hover:scale-105 active:scale-95 text-amber-100 transition-all transform shadow-xl cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* THỬ THÁCH 2: ĐỔI CHỖ CHO TOA TÀU (Xếp từ bé đến lớn: 12, 24, 35, 46) */}
        {/* ========================================================= */}
        {stageIndex === 1 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 2 • Đổi chỗ cho toa tàu
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                Xếp các số từ bé đến lớn
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-amber-200/90 italic mt-0.5">
                <span>Arrange carriages from smallest to largest!</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Arrange numbers from smallest to largest!')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-amber-500/40 backdrop-blur-md shadow-2xl flex flex-col items-center gap-4">
              {/* Assembled Train on Track */}
              <div className="w-full flex flex-col items-center">
                <span className="text-xs font-bold text-amber-200 uppercase tracking-wider mb-2">
                  Đoàn tàu đang nối (từ bé đến lớn):
                </span>
                <div
                  className={`flex items-center gap-2 sm:gap-3 transition-transform duration-700 ${
                    isTrainMoving ? 'translate-x-12' : ''
                  }`}
                >
                  {/* Locomotive */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-red-600 to-amber-700 rounded-xl border-2 border-amber-300 flex flex-col items-center justify-center shadow-lg">
                    <span className="text-2xl">🚂</span>
                  </div>

                  {/* 4 Slots for Sorted Train */}
                  {[0, 1, 2, 3].map((slotIdx) => {
                    const carVal = sortedCars[slotIdx];
                    return (
                      <div
                        key={slotIdx}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 flex items-center justify-center font-black text-xl sm:text-2xl shadow-md transition-all ${
                          carVal !== undefined
                            ? 'bg-gradient-to-b from-emerald-600 to-teal-700 border-emerald-300 text-white animate-scale-up'
                            : 'bg-slate-800/80 border-dashed border-amber-400/50 text-slate-500'
                        }`}
                      >
                        {carVal !== undefined ? carVal : `Toa ${slotIdx + 1}`}
                      </div>
                    );
                  })}
                </div>

                {/* Track */}
                <div className="w-full max-w-lg h-3 bg-amber-900 border-y border-amber-600 mt-2 rounded flex justify-between px-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-full bg-slate-400" />
                  ))}
                </div>
              </div>

              {/* Pool of Carriages to Click */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                  Chạm lần lượt các toa từ bé đến lớn:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {initialC2Cars.map((num) => {
                    const isPlaced = sortedCars.includes(num);
                    return (
                      <button
                        key={num}
                        type="button"
                        disabled={isPlaced}
                        onClick={() => handlePickCarC2(num)}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-black text-2xl sm:text-3xl shadow-lg transition-all transform cursor-pointer ${
                          isPlaced
                            ? 'opacity-30 bg-slate-800 border-slate-700 cursor-not-allowed scale-95'
                            : 'bg-gradient-to-b from-amber-500 to-orange-600 border-amber-300 text-white hover:scale-105 active:scale-95 shadow-amber-500/30'
                        }`}
                      >
                        <span>{num}</span>
                        <span className="text-[10px] font-bold text-amber-100">Toa số</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {sortedCars.length > 0 && sortedCars.length < targetC2Order.length && (
                <button
                  type="button"
                  onClick={handleResetC2}
                  className="px-3 py-1 text-xs text-amber-300 hover:text-white rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer"
                >
                  Xếp lại từ đầu ↺
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* THỬ THÁCH 3: GA TÀU HÀNG CHỤC ("Toa nào có 4 chục và 3 đơn vị?") */}
        {/* 34, 43, 57 -> chọn 43 */}
        {/* ========================================================= */}
        {stageIndex === 2 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 3 • Ga tàu hàng chục
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                Toa nào có 4 chục và 3 đơn vị?
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-amber-200/90 italic mt-0.5">
                <span>Which car has 4 tens and 3 ones?</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Which carriage has 4 tens and 3 ones?')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-6 rounded-3xl bg-slate-900/80 border-2 border-amber-500/40 backdrop-blur-md shadow-2xl flex flex-col items-center gap-5">
              {/* Locomotive waiting on station */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-20 h-20 bg-gradient-to-br from-red-600 to-amber-700 rounded-2xl border-2 border-amber-300 flex flex-col items-center justify-center shadow-lg transition-transform duration-700 ${
                    isTrainMoving ? 'translate-x-12' : ''
                  }`}
                >
                  <span className="text-3xl">🚂</span>
                  <span className="text-[10px] font-bold text-yellow-200">ĐẦU MÁY</span>
                </div>
                {selectedCarC3 === 43 && (
                  <div className="w-16 h-16 bg-emerald-600 border-2 border-emerald-300 rounded-xl flex items-center justify-center font-black text-2xl text-white shadow-md animate-scale-up">
                    43 ✓
                  </div>
                )}
              </div>

              {/* 3 Carriage Choices */}
              <div className="grid grid-cols-3 gap-3 sm:gap-5 w-full max-w-md">
                {[34, 43, 57].map((val) => {
                  const isSelected = selectedCarC3 === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      disabled={selectedCarC3 !== null}
                      onClick={() => handleSelectC3(val)}
                      className={`h-28 sm:h-32 rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all transform shadow-xl cursor-pointer ${
                        isSelected
                          ? val === 43
                            ? 'border-emerald-400 bg-emerald-600 text-white scale-105 shadow-emerald-500/50'
                            : 'border-rose-400 bg-rose-600 text-white scale-95'
                          : 'border-amber-400/40 bg-slate-800 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-300 hover:scale-105 active:scale-95 text-amber-100'
                      }`}
                    >
                      <span className="text-2xl sm:text-4xl font-black">{val}</span>
                      <span className="text-[10px] font-bold mt-1 opacity-80">Toa tàu</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* THỬ THÁCH 4: ĐƯỜNG RAY SO SÁNH (58 và 63: "Số nào lớn hơn?") */}
        {/* ========================================================= */}
        {stageIndex === 3 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 4 • Đường ray so sánh
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                Số nào lớn hơn?
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-amber-200/90 italic mt-0.5">
                <span>Which number is greater? Tap the larger carriage!</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Which number is greater?')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-6 rounded-3xl bg-slate-900/80 border-2 border-amber-500/40 backdrop-blur-md shadow-2xl flex flex-col items-center gap-5">
              <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full max-w-md">
                {[58, 63].map((val) => {
                  const isSelected = selectedCarC4 === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      disabled={selectedCarC4 !== null}
                      onClick={() => handleSelectC4(val)}
                      className={`h-32 sm:h-36 rounded-2xl border-3 flex flex-col items-center justify-center p-3 transition-all transform shadow-2xl cursor-pointer ${
                        isSelected
                          ? val === 63
                            ? 'border-emerald-400 bg-emerald-600 text-white scale-105 shadow-emerald-500/60'
                            : 'border-rose-400 bg-rose-600 text-white scale-95'
                          : 'border-amber-400/50 bg-slate-800 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-300 hover:scale-105 active:scale-95 text-amber-100'
                      }`}
                    >
                      <span className="text-4xl sm:text-5xl font-black">{val}</span>
                      <span className="text-xs font-bold mt-2 opacity-80">Toa tàu</span>
                    </button>
                  );
                })}
              </div>

              {/* Railway Track Signal */}
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950 border border-slate-700 text-xs text-amber-200">
                <span>🚦 Đèn tín hiệu:</span>
                <span className={selectedCarC4 === 63 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {selectedCarC4 === 63 ? 'Xanh (Thông qua)' : 'Đang chờ chọn số lớn hơn'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* THỬ THÁCH 5: CHUYẾN TÀU VỀ ĐÍCH (60 – 70 – ? – 90 – 100) */}
        {/* ========================================================= */}
        {stageIndex === 4 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-5 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 5 • Chuyến tàu về đích
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                Số nào còn thiếu?
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-amber-200/90 italic mt-0.5">
                <span>Complete the tens sequence to bring the train home!</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Which number is missing in the tens sequence?')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-6 rounded-3xl bg-slate-900/80 border-2 border-amber-500/40 backdrop-blur-md shadow-2xl flex flex-col items-center gap-5">
              {/* Grand Train Sequence 60, 70, ?, 90, 100 */}
              <div className="w-full overflow-x-auto pb-2 flex flex-col items-center">
                <div
                  className={`flex items-center gap-2 sm:gap-3 transition-transform duration-700 ${
                    isTrainMoving ? 'translate-x-12' : ''
                  }`}
                >
                  {/* Locomotive */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-600 to-amber-700 rounded-2xl border-2 border-amber-300 flex flex-col items-center justify-center shadow-lg">
                    <span className="text-2xl sm:text-3xl">🚂</span>
                    <span className="text-[10px] font-black uppercase text-yellow-200">VỀ ĐÍCH</span>
                  </div>

                  {/* 60 */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-b from-purple-600 to-indigo-700 rounded-xl border-2 border-purple-300 flex flex-col items-center justify-center font-black text-xl sm:text-2xl text-white shadow-md">
                    60
                  </div>

                  {/* 70 */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-b from-purple-600 to-indigo-700 rounded-xl border-2 border-purple-300 flex flex-col items-center justify-center font-black text-xl sm:text-2xl text-white shadow-md">
                    70
                  </div>

                  {/* Slot ? */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-800 rounded-xl border-2 border-dashed border-amber-400 flex flex-col items-center justify-center font-black text-xl sm:text-2xl text-amber-300 shadow-inner">
                    {selectedSlotC5 ? (
                      <span className="animate-scale-up text-emerald-400">{selectedSlotC5}</span>
                    ) : (
                      <span className="animate-pulse">?</span>
                    )}
                  </div>

                  {/* 90 */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-b from-purple-600 to-indigo-700 rounded-xl border-2 border-purple-300 flex flex-col items-center justify-center font-black text-xl sm:text-2xl text-white shadow-md">
                    90
                  </div>

                  {/* 100 */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-b from-purple-600 to-indigo-700 rounded-xl border-2 border-purple-300 flex flex-col items-center justify-center font-black text-xl sm:text-2xl text-white shadow-md">
                    100
                  </div>
                </div>

                {/* Track */}
                <div className="w-full max-w-xl h-3 bg-amber-900 border-y border-amber-600 mt-2 rounded flex justify-between px-2">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-full bg-slate-400" />
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  Chạm chọn thẻ số tròn chục:
                </span>
                <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-sm">
                  {c5Options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      disabled={selectedSlotC5 !== null}
                      onClick={() => handleSelectC5(opt)}
                      className="py-3 px-4 rounded-2xl font-black text-2xl sm:text-3xl border-2 border-amber-400/40 bg-slate-800 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-300 hover:scale-105 active:scale-95 text-amber-100 transition-all transform shadow-xl cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* COMPLETION SCREEN */}
        {/* ========================================================= */}
        {isCompleted && (
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/95 border-2 border-amber-400 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center animate-scale-up my-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_30px_rgba(251,191,36,0.6)] mb-3 animate-bounce">
              <Trophy className="w-12 h-12 text-yellow-300" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-300 uppercase tracking-wide">
              ĐOÀN TÀU ĐÃ VỀ ĐÍCH!
            </h2>
            <p className="text-xs sm:text-sm text-amber-200 mt-1 font-medium">
              Bé đã xuất sắc hoàn thành 5 thử thách số học của <br />
              <strong className="text-amber-300">ĐOÀN TÀU XUYÊN VƯƠNG QUỐC</strong>!
            </p>

            <div className="my-4 sm:my-5 px-5 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-base sm:text-lg flex items-center gap-2">
              <span>⭐</span>
              <span>Bé nhận được +25 SAO VÀNG!</span>
            </div>

            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={handleRestart}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-amber-200 font-black text-xs sm:text-sm uppercase transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm uppercase shadow-lg shadow-amber-500/30 transition transform hover:scale-105 cursor-pointer"
              >
                Về Khu Vực
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
