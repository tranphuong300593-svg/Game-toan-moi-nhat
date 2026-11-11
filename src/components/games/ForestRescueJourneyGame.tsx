/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundEffects, soundService } from '../../services/audioService';
import { Volume2, Sparkles, Check, ArrowLeft, RotateCcw, Trophy, Delete } from 'lucide-react';

interface ForestRescueJourneyGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

export const ForestRescueJourneyGame: React.FC<ForestRescueJourneyGameProps> = ({
  student,
  langMode: _langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Helper to pronounce English prompt
  const handleSpeakEn = (text: string) => {
    soundEffects.click();
    soundService.speak(text, 'en');
  };

  // -------------------------------------------------------------
  // TRẠM 1: CẦU GỖ PHÉP TÍNH (8 - 3 = ? -> chọn 5)
  // -------------------------------------------------------------
  const [selectedOptS1, setSelectedOptS1] = useState<number | null>(null);
  const [bunnyHopStep, setBunnyHopStep] = useState<number>(0); // 0: start, 1: mid, 2: across

  const handleSelectS1 = (opt: number) => {
    if (selectedOptS1 !== null || feedback) return;
    setSelectedOptS1(opt);

    if (opt === 5) {
      soundEffects.correct();
      setBunnyHopStep(2);
      setFeedback({ isCorrect: true, text: 'Chính xác! 8 - 3 = 5. Chú thỏ đã nhảy qua cầu gỗ an toàn!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1500);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Chưa đúng rồi! Bé thử đếm lại xem 8 bớt 3 còn mấy nhé!' });
      setTimeout(() => {
        setSelectedOptS1(null);
        setFeedback(null);
      }, 1300);
    }
  };

  // -------------------------------------------------------------
  // TRẠM 2: NHỮNG CHIẾC LÁ BÍ MẬT (24 + □ = 39 -> chọn 15)
  // -------------------------------------------------------------
  const [selectedLeafNumber, setSelectedLeafNumber] = useState<number | null>(null);
  const [isLeafBlown, setIsLeafBlown] = useState<boolean>(false);

  const handleSelectS2 = (num: number) => {
    if (isLeafBlown || feedback) return;

    if (num === 15) {
      soundEffects.correct();
      setSelectedLeafNumber(15);
      setIsLeafBlown(true);
      setFeedback({ isCorrect: true, text: 'Tuyệt vời! 24 + 15 = 39. Chiếc lá đã bay đi để lộ số 15!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1500);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: `Số ${num} chưa đúng! 24 + ${num} = ${24 + num} (khác 39). Bé hãy thử số khác nhé!` });
      setTimeout(() => {
        setFeedback(null);
      }, 1400);
    }
  };

  // -------------------------------------------------------------
  // TRẠM 3: ĐƯỜNG MÒN THÔNG MINH ("Phép tính nào đúng?")
  // Lối 1: 46 - 12 = 34 (ĐÚNG)
  // Lối 2: 35 + 24 = 58 (SAI)
  // Lối 3: 67 - 25 = 43 (SAI)
  // -------------------------------------------------------------
  const [selectedPathId, setSelectedPathId] = useState<number | null>(null);

  const handleSelectS3 = (pathId: number) => {
    if (selectedPathId !== null || feedback) return;
    setSelectedPathId(pathId);

    if (pathId === 1) {
      soundEffects.correct();
      setFeedback({ isCorrect: true, text: 'Rất giỏi! 46 - 12 = 34 là phép tính chính xác! Đường mòn đã mở ra!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1500);
    } else {
      soundEffects.wrong();
      const reason = pathId === 2 ? '35 + 24 = 59 chứ không phải 58!' : '67 - 25 = 42 chứ không phải 43!';
      setFeedback({ isCorrect: false, text: `Lối đi này chưa đúng vì ${reason}` });
      setTimeout(() => {
        setSelectedPathId(null);
        setFeedback(null);
      }, 1500);
    }
  };

  // -------------------------------------------------------------
  // TRẠM 4: GIẢI CỨU SÓC CON (57 - 24 = 32 -> nhập 33)
  // Có bàn phím số lớn trên màn hình
  // -------------------------------------------------------------
  const [inputS4, setInputS4] = useState<string>('');
  const [isSquirrelRescued, setIsSquirrelRescued] = useState<boolean>(false);

  const handleKeypadPress = (val: string) => {
    if (feedback || isSquirrelRescued) return;
    soundEffects.click();
    if (inputS4.length < 2) {
      setInputS4((prev) => prev + val);
    }
  };

  const handleKeypadDelete = () => {
    if (feedback || isSquirrelRescued) return;
    soundEffects.click();
    setInputS4((prev) => prev.slice(0, -1));
  };

  const handleCheckS4 = () => {
    if (feedback || isSquirrelRescued) return;
    if (!inputS4) return;

    if (inputS4 === '33') {
      soundEffects.correct();
      setIsSquirrelRescued(true);
      setFeedback({ isCorrect: true, text: 'Chính xác! 57 - 24 = 33. Bé đã giải cứu sóc con an toàn!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1600);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Chưa đúng rồi! Hàng đơn vị: 7 - 4 = 3; hàng chục: 5 - 2 = 3. Bé tính lại nhé!' });
      setTimeout(() => {
        setInputS4('');
        setFeedback(null);
      }, 1500);
    }
  };

  // -------------------------------------------------------------
  // TRẠM 5: KHO BÁU RỪNG XANH
  // "Sóc có 35 hạt dẻ, nhặt thêm 12 hạt. Hỏi sóc có tất cả bao nhiêu hạt dẻ?"
  // Bước 1: Chọn phép tính 35 + 12
  // Bước 2: Nhập kết quả 47
  // -------------------------------------------------------------
  const [selectedEquationS5, setSelectedEquationS5] = useState<string | null>(null);
  const [inputResultS5, setInputResultS5] = useState<string>('');
  const [isChestOpened, setIsChestOpened] = useState<boolean>(false);

  const handleSelectEquationS5 = (eq: string) => {
    if (feedback || isChestOpened) return;
    soundEffects.click();

    if (eq === '35 + 12') {
      setSelectedEquationS5(eq);
      soundEffects.correct();
      setFeedback({ isCorrect: true, text: 'Đúng rồi! Nhặt thêm thì ta thực hiện phép cộng 35 + 12!' });
      setTimeout(() => setFeedback(null), 1200);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Chưa đúng! Bài toán hỏi "có tất cả" và "nhặt thêm" nên phải dùng phép cộng 35 + 12 nhé!' });
      setTimeout(() => setFeedback(null), 1400);
    }
  };

  const handleKeypadS5 = (val: string) => {
    if (feedback || isChestOpened || !selectedEquationS5) return;
    soundEffects.click();
    if (inputResultS5.length < 2) {
      setInputResultS5((prev) => prev + val);
    }
  };

  const handleKeypadDeleteS5 = () => {
    if (feedback || isChestOpened || !selectedEquationS5) return;
    soundEffects.click();
    setInputResultS5((prev) => prev.slice(0, -1));
  };

  const handleCheckS5 = () => {
    if (feedback || isChestOpened || !selectedEquationS5) return;
    if (!inputResultS5) return;

    if (inputResultS5 === '47') {
      soundEffects.celebrate();
      setIsChestOpened(true);
      setFeedback({ isCorrect: true, text: 'Xuất sắc! 35 + 12 = 47 hạt dẻ! Rương kho báu rừng xanh đã mở!' });
      setScore((prev) => prev + 5);

      setTimeout(() => {
        setIsCompleted(true);
        StorageService.recordActivity(student.id, {
          type: 'game',
          targetId: 'forest-rescue',
          targetName: 'Hành Trình Giải Cứu Rừng Xanh',
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
      setFeedback({ isCorrect: false, text: 'Chưa chính xác! 5 + 2 = 7, 3 + 1 = 4. Kết quả là 47 nhé bé!' });
      setTimeout(() => {
        setInputResultS5('');
        setFeedback(null);
      }, 1400);
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
    setSelectedOptS1(null);
    setBunnyHopStep(0);
    setSelectedLeafNumber(null);
    setIsLeafBlown(false);
    setSelectedPathId(null);
    setInputS4('');
    setIsSquirrelRescued(false);
    setSelectedEquationS5(null);
    setInputResultS5('');
    setIsChestOpened(false);
  };

  const stageTitles = [
    'Trạm 1: Cầu Gỗ Phép Tính',
    'Trạm 2: Những Chiếc Lá Bí Mật',
    'Trạm 3: Đường Mòn Thông Minh',
    'Trạm 4: Giải Cứu Sóc Con',
    'Trạm 5: Kho Báu Rừng Xanh',
  ];

  return (
    <div className="w-full h-full max-h-[100dvh] flex flex-col bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white select-none overflow-hidden font-sans">
      {/* 1. Header Bar */}
      <header className="flex-none px-4 sm:px-6 py-2 sm:py-2.5 bg-black/50 backdrop-blur-md border-b border-emerald-500/30 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-emerald-300 font-bold text-xs sm:text-sm border border-emerald-400/30 transition shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Khu Rừng Phép Tính</span>
          </button>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xl">🌲</span>
            <div>
              <h1 className="text-xs sm:text-sm md:text-base font-black tracking-wide bg-gradient-to-r from-emerald-300 via-amber-200 to-lime-300 bg-clip-text text-transparent uppercase">
                HÀNH TRÌNH GIẢI CỨU RỪNG XANH
              </h1>
              <p className="text-[11px] sm:text-xs text-emerald-300 font-medium">
                {stageTitles[stageIndex] || 'Hoàn thành chuyến phiêu lưu'}
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
                    ? 'bg-emerald-400 animate-pulse'
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

      {/* 2. Main Adventure Stage (16:9 Zero-Scroll Layout) */}
      <main className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 relative overflow-hidden">
        {/* Floating feedback notification */}
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
        {/* TRẠM 1: CẦU GỖ PHÉP TÍNH (8 - 3 = ?) */}
        {/* ========================================================= */}
        {stageIndex === 0 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Trạm 1 • Giúp thỏ qua cầu gỗ
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                8 - 3 = ?
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-emerald-200/90 italic mt-0.5">
                <span>What is 8 minus 3? Help little bunny cross the wooden bridge!</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('What is 8 minus 3?')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bridge Illustration */}
            <div className="w-full max-w-xl p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-emerald-500/40 backdrop-blur-md shadow-2xl flex flex-col items-center gap-4">
              <div className="w-full h-36 sm:h-44 bg-gradient-to-b from-sky-900/50 to-teal-950/80 rounded-2xl border border-emerald-400/30 p-2 relative overflow-hidden flex items-end justify-between">
                {/* River waves */}
                <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-cyan-600/40 to-transparent flex items-center justify-around opacity-60">
                  <span className="text-lg animate-pulse">🌊</span>
                  <span className="text-lg animate-pulse delay-100">🌊</span>
                  <span className="text-lg animate-pulse delay-200">🌊</span>
                </div>

                {/* Left Bank */}
                <div className="w-20 sm:w-28 h-20 bg-emerald-800 rounded-tr-3xl border-t-2 border-r-2 border-emerald-400/60 p-2 z-10 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-emerald-200">Bờ trái</span>
                  {bunnyHopStep === 0 && <span className="text-3xl animate-bounce">🐰</span>}
                </div>

                {/* Wooden Bridge Planks */}
                <div className="flex-1 h-12 bg-amber-800/90 border-y-2 border-amber-600 rounded-md mx-1 flex items-center justify-around z-10 shadow-lg relative">
                  <div className="w-4 h-full bg-amber-900/80 border-r border-amber-700" />
                  <div className="w-4 h-full bg-amber-900/80 border-r border-amber-700" />
                  {bunnyHopStep === 2 && (
                    <div className="absolute top-[-28px] left-1/2 -translate-x-1/2 flex items-center gap-1 animate-bounce">
                      <span className="text-3xl">🐰</span>
                      <span className="text-xl">🥕</span>
                    </div>
                  )}
                  <div className="w-4 h-full bg-amber-900/80 border-r border-amber-700" />
                  <div className="w-4 h-full bg-amber-900/80" />
                </div>

                {/* Right Bank */}
                <div className="w-20 sm:w-28 h-20 bg-emerald-800 rounded-tl-3xl border-t-2 border-l-2 border-emerald-400/60 p-2 z-10 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-emerald-200">Nhà thỏ</span>
                  <span className="text-2xl">🏡</span>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-md">
                {[4, 5, 6].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectS1(opt)}
                    className={`py-3 sm:py-4 rounded-2xl font-black text-2xl sm:text-3xl border-2 transition-all transform shadow-xl cursor-pointer ${
                      selectedOptS1 === opt
                        ? opt === 5
                          ? 'border-emerald-400 bg-emerald-600 text-white scale-105 shadow-emerald-500/50'
                          : 'border-rose-400 bg-rose-600 text-white scale-95'
                        : 'border-emerald-400/40 bg-slate-800 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-300 hover:scale-105 active:scale-95 text-emerald-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TRẠM 2: NHỮNG CHIẾC LÁ BÍ MẬT (24 + □ = 39) */}
        {/* ========================================================= */}
        {stageIndex === 1 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Trạm 2 • Chiếc lá bí mật
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                Chiếc lá đang che số nào?
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-emerald-200/90 italic mt-0.5">
                <span>Find the hidden number behind the autumn leaf!</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Find the hidden number behind the autumn leaf!')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full max-w-xl p-5 sm:p-6 rounded-3xl bg-slate-900/80 border-2 border-emerald-500/40 backdrop-blur-md shadow-2xl flex flex-col items-center gap-5">
              {/* Equation Display with Hidden Leaf Slot */}
              <div className="w-full p-4 sm:p-6 bg-emerald-950/60 rounded-2xl border-2 border-emerald-400/40 flex items-center justify-center gap-2 sm:gap-4 text-2xl sm:text-4xl md:text-5xl font-black text-white">
                <span>24</span>
                <span className="text-amber-300">+</span>
                {/* The Hidden Leaf Slot */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800 border-2 border-dashed border-amber-400 flex items-center justify-center relative overflow-hidden shadow-inner">
                  {isLeafBlown ? (
                    <span className="text-2xl sm:text-4xl font-black text-emerald-300 animate-scale-up">
                      {selectedLeafNumber}
                    </span>
                  ) : (
                    <div className="flex flex-col items-center justify-center animate-pulse">
                      <span className="text-3xl sm:text-4xl">🍂</span>
                      <span className="text-[10px] font-bold text-amber-200 uppercase">?</span>
                    </div>
                  )}
                </div>
                <span className="text-amber-300">=</span>
                <span>39</span>
              </div>

              {/* Number Card Options */}
              <div className="flex flex-col items-center gap-2 w-full">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Chạm chọn chiếc lá mang số đúng:
                </span>
                <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-sm">
                  {[12, 15, 16].map((num) => (
                    <button
                      key={num}
                      type="button"
                      disabled={isLeafBlown}
                      onClick={() => handleSelectS2(num)}
                      className="py-3 sm:py-4 rounded-2xl font-black text-2xl sm:text-3xl border-2 border-emerald-400/40 bg-slate-800 hover:bg-emerald-600 hover:border-emerald-300 hover:scale-105 active:scale-95 text-white transition-all transform shadow-xl cursor-pointer flex flex-col items-center justify-center gap-0.5"
                    >
                      <span className="text-xs text-amber-300">🍃</span>
                      <span>{num}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TRẠM 3: ĐƯỜNG MÒN THÔNG MINH ("Phép tính nào đúng?") */}
        {/* ========================================================= */}
        {stageIndex === 2 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Trạm 3 • Ngã ba đường mòn
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                Phép tính nào đúng?
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-emerald-200/90 italic mt-0.5">
                <span>Which calculation is correct? Choose the right trail sign!</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Which calculation is correct?')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full max-w-xl p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-emerald-500/40 backdrop-blur-md shadow-2xl flex flex-col gap-3">
              {[
                { id: 1, label: '46 - 12 = 34', isCorrect: true, signIcon: '🌲' },
                { id: 2, label: '35 + 24 = 58', isCorrect: false, signIcon: '🍄' },
                { id: 3, label: '67 - 25 = 43', isCorrect: false, signIcon: '🌸' },
              ].map((path) => {
                const isSelected = selectedPathId === path.id;
                return (
                  <button
                    key={path.id}
                    type="button"
                    onClick={() => handleSelectS3(path.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between transition-all transform shadow-lg cursor-pointer ${
                      isSelected
                        ? path.isCorrect
                          ? 'border-emerald-400 bg-emerald-600/40 scale-102 shadow-[0_0_20px_rgba(52,211,153,0.6)]'
                          : 'border-rose-400 bg-rose-600/40 scale-98'
                        : 'border-emerald-400/40 bg-slate-800/90 hover:bg-slate-700 hover:border-amber-300 hover:scale-102 active:scale-98'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{path.signIcon}</span>
                      <span className="font-black text-xl sm:text-2xl text-amber-200">{path.label}</span>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-black/40 text-xs font-bold text-emerald-300 border border-emerald-400/20">
                      Lối {path.id} →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TRẠM 4: GIẢI CỨU SÓC CON (57 - 24 = 32 -> nhập 33) */}
        {/* ========================================================= */}
        {stageIndex === 3 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Trạm 4 • Sửa phép tính sai
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                Kết quả đúng là bao nhiêu?
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-emerald-200/90 italic mt-0.5">
                <span>The squirrel is trapped by a wrong math sign! Enter the correct result.</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('What is the correct result?')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full max-w-xl p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-emerald-500/40 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-around gap-4">
              {/* Problem Visual: Tree Branch & Trapped Squirrel */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-48 h-36 bg-gradient-to-b from-emerald-950 to-slate-950 border border-emerald-400/30 rounded-2xl p-2 relative flex flex-col items-center justify-center shadow-inner">
                  {/* Trapped or Rescued squirrel */}
                  <div className="text-4xl animate-bounce">
                    {isSquirrelRescued ? '🐿️' : '🐿️'}
                  </div>
                  <span className="text-[11px] font-bold text-amber-200 mt-1">
                    {isSquirrelRescued ? '🎉 Đã giải cứu an toàn!' : 'Kẹt trên cành cây!'}
                  </span>

                  {/* Wrong equation banner */}
                  <div className="mt-2 px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs sm:text-sm font-bold flex items-center gap-1">
                    <span>57 - 24 = 32</span>
                    <span className="text-rose-400 font-black">❌</span>
                  </div>
                </div>

                {/* Input Screen Display */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-200">Kết quả đúng:</span>
                  <div className="w-20 h-11 rounded-xl bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-2xl font-black text-amber-300 shadow-inner">
                    {inputS4 || <span className="text-slate-600 animate-pulse">|</span>}
                  </div>
                </div>
              </div>

              {/* Large On-Screen Keypad */}
              <div className="flex flex-col items-center gap-2">
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleKeypadPress(String(digit))}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-emerald-400/40 text-lg font-black text-white shadow-md cursor-pointer"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleKeypadDelete}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-rose-900/80 hover:bg-rose-800 active:scale-95 border border-rose-500/40 text-white flex items-center justify-center shadow-md cursor-pointer"
                    title="Xóa"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('0')}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-emerald-400/40 text-lg font-black text-white shadow-md cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckS4}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 border border-emerald-300 text-white flex items-center justify-center font-bold shadow-md cursor-pointer"
                    title="Kiểm tra"
                  >
                    <Check className="w-6 h-6 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TRẠM 5: KHO BÁU RỪNG XANH (Bài toán có lời văn) */}
        {/* ========================================================= */}
        {stageIndex === 4 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Trạm 5 • Mở rương kho báu
              </span>
              <h2 className="text-base sm:text-xl font-black text-amber-300 drop-shadow-md max-w-2xl">
                Sóc có 35 hạt dẻ, nhặt thêm 12 hạt. Hỏi sóc có tất cả bao nhiêu hạt dẻ?
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-emerald-200/90 italic mt-0.5">
                <span>Squirrel has 35 chestnuts and finds 12 more. How many chestnuts in total?</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Squirrel has 35 chestnuts and finds 12 more. How many chestnuts in total?')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full max-w-2xl p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-emerald-500/40 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-around gap-4">
              {/* Step 1: Choose Equation */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Bước 1: Chọn phép tính
                </span>
                <div className="flex flex-col gap-2 w-48">
                  {['35 + 12', '35 - 12', '35 + 21'].map((eq) => (
                    <button
                      key={eq}
                      type="button"
                      onClick={() => handleSelectEquationS5(eq)}
                      className={`py-2 px-3 rounded-xl border-2 font-black text-base transition-all transform cursor-pointer ${
                        selectedEquationS5 === eq
                          ? 'border-emerald-400 bg-emerald-600 text-white shadow-md'
                          : 'border-emerald-400/40 bg-slate-800 hover:bg-slate-700 text-emerald-100'
                      }`}
                    >
                      {eq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chest Icon Graphic */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-2xl bg-amber-950/60 border border-amber-400/40 flex items-center justify-center text-5xl shadow-inner">
                  {isChestOpened ? '💎' : '🎁'}
                </div>
                <span className="text-[11px] font-bold text-amber-300 mt-1">
                  {isChestOpened ? 'Kho báu đã mở!' : 'Rương khóa phép thuật'}
                </span>
              </div>

              {/* Step 2: Enter Result with Keypad */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Bước 2: Nhập kết quả
                </span>
                <div className="w-24 h-10 rounded-xl bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-xl font-black text-amber-300 shadow-inner">
                  {inputResultS5 || <span className="text-slate-600 animate-pulse">?</span>}
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleKeypadS5(String(digit))}
                      className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 border border-emerald-400/40 text-base font-black text-white shadow cursor-pointer"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleKeypadDeleteS5}
                    className="w-9 h-9 rounded-lg bg-rose-900/80 hover:bg-rose-800 active:scale-95 border border-rose-500/40 text-white flex items-center justify-center cursor-pointer"
                  >
                    <Delete className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadS5('0')}
                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 border border-emerald-400/40 text-base font-black text-white shadow cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckS5}
                    className="w-9 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 border border-emerald-300 text-white flex items-center justify-center font-bold cursor-pointer"
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* COMPLETION SCREEN */}
        {/* ========================================================= */}
        {isCompleted && (
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/95 border-2 border-emerald-400 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center animate-scale-up my-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-amber-300 flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_30px_rgba(52,211,153,0.6)] mb-3 animate-bounce">
              <Trophy className="w-12 h-12 text-yellow-300" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-300 uppercase tracking-wide">
              GIẢI CỨU THÀNH CÔNG!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1 font-medium">
              Bé đã xuất sắc vượt qua 5 trạm thử thách của <br />
              <strong className="text-amber-300">HÀNH TRÌNH GIẢI CỨU RỪNG XANH</strong>!
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
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm uppercase shadow-lg shadow-emerald-500/30 transition transform hover:scale-105 cursor-pointer"
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
