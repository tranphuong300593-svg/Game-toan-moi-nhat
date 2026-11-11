/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { soundService } from '../../services/audioService';
import { RobotMathChibi } from '../chibi/RobotMathChibi';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, CheckCircle2, RotateCcw, ChevronRight, Layers } from 'lucide-react';
import { LanguageMode } from '../../types';

interface InteractiveAdditionExplorationProps {
  onCompleteStep?: () => void;
  langMode?: LanguageMode;
}

type StepStage = 'observe' | 'identify' | 'combine' | 'equation' | 'conclusion';

interface AdditionPairTheme {
  id: string;
  categoryVi: string;
  categoryEn: string;
  unitVi: string;
  unitEn: string;
  itemA: { nameVi: string; emoji: string; color: string; border: string; bg: string };
  itemB: { nameVi: string; emoji: string; color: string; border: string; bg: string };
  countA: number;
  countB: number;
}

const PAIR_THEMES: AdditionPairTheme[] = [
  {
    id: 'apple_orange',
    categoryVi: 'hoa quả',
    categoryEn: 'fruits',
    unitVi: 'quả',
    unitEn: 'fruits',
    itemA: { nameVi: 'quả táo đỏ', emoji: '🍎', color: 'text-rose-600', border: 'border-rose-300', bg: 'bg-rose-50' },
    itemB: { nameVi: 'quả cam vàng', emoji: '🍊', color: 'text-amber-600', border: 'border-amber-300', bg: 'bg-amber-50' },
    countA: 3,
    countB: 2,
  },
  {
    id: 'flowers',
    categoryVi: 'bông hoa',
    categoryEn: 'flowers',
    unitVi: 'bông hoa',
    unitEn: 'flowers',
    itemA: { nameVi: 'hoa đỏ', emoji: '🌺', color: 'text-pink-600', border: 'border-pink-300', bg: 'bg-pink-50' },
    itemB: { nameVi: 'hoa vàng', emoji: '🌼', color: 'text-yellow-600', border: 'border-yellow-300', bg: 'bg-yellow-50' },
    countA: 4,
    countB: 2,
  },
  {
    id: 'animals',
    categoryVi: 'con vật',
    categoryEn: 'animals',
    unitVi: 'con',
    unitEn: 'animals',
    itemA: { nameVi: 'chú thỏ trắng', emoji: '🐰', color: 'text-slate-700', border: 'border-slate-300', bg: 'bg-slate-50' },
    itemB: { nameVi: 'chú gà con', emoji: '🐥', color: 'text-amber-600', border: 'border-amber-300', bg: 'bg-amber-50' },
    countA: 2,
    countB: 3,
  },
];

export const InteractiveAdditionExploration: React.FC<InteractiveAdditionExplorationProps> = ({
  onCompleteStep,
  langMode = 'bilingual',
}) => {
  const [themeIndex, setThemeIndex] = useState(0);
  const theme = PAIR_THEMES[themeIndex];

  const [currentStage, setCurrentStage] = useState<StepStage>('observe');

  // Track tapped items for visual counting feedback (glow, no numbers)
  const [tappedA, setTappedA] = useState<number[]>([]);
  const [tappedB, setTappedB] = useState<number[]>([]);

  // Step 2 answers
  const [userAnswerA, setUserAnswerA] = useState<number | null>(null);
  const [userAnswerB, setUserAnswerB] = useState<number | null>(null);
  const [isAnswerACorrect, setIsAnswerACorrect] = useState(false);
  const [isAnswerBCorrect, setIsAnswerBCorrect] = useState(false);

  // Step 3 answer (total)
  const [userAnswerTotal, setUserAnswerTotal] = useState<number | null>(null);
  const [isTotalCorrect, setIsTotalCorrect] = useState(false);


  const handleReset = () => {
    setCurrentStage('observe');
    setTappedA([]);
    setTappedB([]);
    setUserAnswerA(null);
    setUserAnswerB(null);
    setIsAnswerACorrect(false);
    setIsAnswerBCorrect(false);
    setUserAnswerTotal(null);
    setIsTotalCorrect(false);
  };

  const handleToggleTapA = (index: number) => {
    soundService.playPop();
    if (tappedA.includes(index)) {
      setTappedA(tappedA.filter((i) => i !== index));
    } else {
      setTappedA([...tappedA, index]);
    }
  };

  const handleToggleTapB = (index: number) => {
    soundService.playPop();
    if (tappedB.includes(index)) {
      setTappedB(tappedB.filter((i) => i !== index));
    } else {
      setTappedB([...tappedB, index]);
    }
  };

  const handleSelectCountA = (num: number) => {
    soundService.playClick();
    setUserAnswerA(num);
    if (num === theme.countA) {
      setIsAnswerACorrect(true);
      soundService.playCorrect();
    } else {
      soundService.playIncorrect();
    }
  };

  const handleSelectCountB = (num: number) => {
    soundService.playClick();
    setUserAnswerB(num);
    if (num === theme.countB) {
      setIsAnswerBCorrect(true);
      soundService.playCorrect();
    } else {
      soundService.playIncorrect();
    }
  };

  const handleSelectTotal = (num: number) => {
    soundService.playClick();
    setUserAnswerTotal(num);
    const expected = theme.countA + theme.countB;
    if (num === expected) {
      setIsTotalCorrect(true);
      soundService.playMagicChime();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => {
        setCurrentStage('equation');
      }, 900);
    } else {
      soundService.playIncorrect();
    }
  };

  return (
    <div className="flex flex-col justify-between h-full space-y-3">
      {/* 5 Progression Steps Indicator */}
      <div className="flex items-center justify-between gap-1 bg-slate-100 p-1.5 rounded-2xl shrink-0 overflow-x-auto scrollbar-none">
        {[
          { key: 'observe', label: '1. Quan sát 2 nhóm' },
          { key: 'identify', label: '2. Đếm từng nhóm' },
          { key: 'combine', label: '3. Gộp hai nhóm' },
          { key: 'equation', label: '4. Phép cộng' },
          { key: 'conclusion', label: '5. Kết luận' },
        ].map((st, idx) => {
          const isAct = currentStage === st.key;
          return (
            <button
              key={st.key}
              onClick={() => {
                soundService.playClick();
                setCurrentStage(st.key as StepStage);
              }}
              className={`flex-1 min-w-[110px] sm:min-w-0 py-1.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer text-center ${
                isAct
                  ? 'bg-[#2563EB] text-white shadow-xs scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {st.label}
            </button>
          );
        })}
      </div>

      {/* Main Exploration Stage Box */}
      <div className="flex-1 bg-gradient-to-b from-sky-50/50 via-white to-amber-50/40 rounded-3xl border-2 border-indigo-100 p-4 sm:p-5 flex flex-col justify-between overflow-hidden relative shadow-xs">
        {/* Robot Speech Prompt Box */}
        <div className="flex items-center gap-3 bg-white/95 rounded-2xl p-3 border border-indigo-100 shadow-xs shrink-0">
          <RobotMathChibi expression="happy" size="sm" className="shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm font-black text-indigo-950 leading-snug">
              {currentStage === 'observe' && (
                <span>
                  “Các bạn nhỏ ơi! Con hãy quan sát hai nhóm quả. Nhóm bên trái có mấy {theme.itemA.nameVi}? Nhóm bên phải có mấy {theme.itemB.nameVi}?”
                </span>
              )}
              {currentStage === 'identify' && (
                <span>
                  “Bé hãy chọn đúng số lượng cho từng nhóm nhé! (Táo đỏ và Cam vàng)”
                </span>
              )}
              {currentStage === 'combine' && (
                <span>
                  “Bây giờ chúng mình cùng đếm xem có tất cả bao nhiêu {theme.unitVi} nhé!”
                </span>
              )}
              {currentStage === 'equation' && (
                <span>
                  “Tuyệt vời! Ta viết được phép tính cộng: {theme.countA} + {theme.countB} = {theme.countA + theme.countB}!”
                </span>
              )}
              {currentStage === 'conclusion' && (
                <span>
                  “Khi gộp hai nhóm đồ vật lại với nhau, chúng mình có thể dùng phép cộng để tìm số đồ vật có tất cả!”
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 font-semibold italic flex items-center gap-2 mt-0.5">
              <span>
                {currentStage === 'observe' && 'Observe the two distinct groups. Count each group carefully.'}
                {currentStage === 'identify' && 'Select the correct quantity for each fruit basket.'}
                {currentStage === 'combine' && 'Now combine both groups and count how many fruits altogether.'}
                {currentStage === 'equation' && `${theme.countA} plus ${theme.countB} equals ${theme.countA + theme.countB}.`}
                {currentStage === 'conclusion' && 'Combining groups represents addition.'}
              </span>
              <button
                type="button"
                onClick={() => {
                  let enText = 'Observe the two distinct groups. Count each group carefully.';
                  if (currentStage === 'observe') {
                    enText = `Observe the two groups of ${theme.categoryEn}. Count each group carefully.`;
                  } else if (currentStage === 'identify') {
                    enText = 'Select the correct quantity for each fruit basket.';
                  } else if (currentStage === 'combine') {
                    enText = 'Now combine both groups and count how many fruits altogether.';
                  } else if (currentStage === 'equation') {
                    enText = `${theme.countA} plus ${theme.countB} equals ${theme.countA + theme.countB}.`;
                  } else if (currentStage === 'conclusion') {
                    enText = 'Combining two groups together represents addition.';
                  }
                  soundService.speakEn(enText);
                }}
                className="p-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 cursor-pointer shrink-0"
                title="Nghe tiếng Anh chuẩn en-US"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* STAGE 1: QUAN SÁT HAI NHÓM (KHÔNG ĐÁNH SỐ, KHÔNG HIỆN TRƯỚC SỐ) */}
        {/* ============================================================ */}
        {currentStage === 'observe' && (
          <div className="flex-1 flex flex-col justify-center items-center py-2 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-2xl mx-auto">
              {/* Group A */}
              <div className="flex-1 w-full bg-white rounded-3xl p-4 sm:p-5 border-2 border-rose-200 shadow-sm text-center space-y-3">
                <div className="text-xs font-black text-rose-800 uppercase tracking-wider">
                  Nhóm bên trái (Táo đỏ)
                </div>
                {/* Clean large fruits without any numbers, tap glows gently */}
                <div className="flex flex-wrap items-center justify-center gap-3 py-2 min-h-[90px]">
                  {Array.from({ length: theme.countA }).map((_, i) => {
                    const isTapped = tappedA.includes(i);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleToggleTapA(i)}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl transition-all cursor-pointer bg-rose-50 border ${
                          isTapped
                            ? 'ring-4 ring-amber-400 scale-110 drop-shadow-md bg-amber-50 border-amber-300'
                            : 'border-rose-200 hover:scale-105'
                        }`}
                        title="Chạm vào để đánh dấu đã đếm"
                      >
                        <span>{theme.itemA.emoji}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="text-[11px] font-semibold text-slate-500">
                  (Chạm vào từng quả để kiểm tra)
                </div>
              </div>

              {/* Separator */}
              <div className="text-2xl font-black text-slate-400 shrink-0">
                và
              </div>

              {/* Group B */}
              <div className="flex-1 w-full bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200 shadow-sm text-center space-y-3">
                <div className="text-xs font-black text-amber-800 uppercase tracking-wider">
                  Nhóm bên phải (Cam vàng)
                </div>
                {/* Clean large fruits without any numbers */}
                <div className="flex flex-wrap items-center justify-center gap-3 py-2 min-h-[90px]">
                  {Array.from({ length: theme.countB }).map((_, i) => {
                    const isTapped = tappedB.includes(i);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleToggleTapB(i)}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl transition-all cursor-pointer bg-amber-50 border ${
                          isTapped
                            ? 'ring-4 ring-amber-400 scale-110 drop-shadow-md bg-amber-100 border-amber-300'
                            : 'border-amber-200 hover:scale-105'
                        }`}
                        title="Chạm vào để đánh dấu đã đếm"
                      >
                        <span>{theme.itemB.emoji}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="text-[11px] font-semibold text-slate-500">
                  (Chạm vào từng quả để kiểm tra)
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundService.playClick();
                setCurrentStage('identify');
              }}
              className="py-3 px-8 bg-[#2563EB] hover:bg-blue-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-md cursor-pointer flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>Em đã đếm xong! Sang Bước 2 ➡️</span>
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 2: XÁC ĐỊNH SỐ LƯỢNG (CHỈ HIỂN THỊ SỐ KHI HỌC SINH CHỌN ĐÚNG) */}
        {/* ============================================================ */}
        {currentStage === 'identify' && (
          <div className="flex-1 flex flex-col justify-center items-center py-2 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 sm:gap-6 w-full max-w-2xl mx-auto">
              {/* Group A Selector */}
              <div className="flex-1 bg-white rounded-3xl p-4 sm:p-5 border-2 border-rose-200 shadow-sm text-center space-y-3">
                <div className="text-xs font-black text-rose-800 uppercase tracking-wider">
                  Nhóm bên trái có mấy quả?
                </div>
                <div className="flex justify-center gap-2 min-h-[50px] items-center">
                  {Array.from({ length: theme.countA }).map((_, i) => (
                    <span key={i} className="text-3xl sm:text-4xl">{theme.itemA.emoji}</span>
                  ))}
                </div>

                {!isAnswerACorrect ? (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-bold text-slate-500">Chọn số quả táo:</div>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleSelectCountA(num)}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-black text-sm sm:text-base border-2 cursor-pointer transition-all ${
                            userAnswerA === num
                              ? 'bg-rose-500 text-white border-rose-600 scale-105'
                              : 'bg-slate-50 hover:bg-rose-50 text-slate-800 border-slate-200'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-2xl p-2.5 font-black text-sm flex items-center justify-center gap-1.5 animate-bounce">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Chính xác: Có 3 quả táo!</span>
                  </div>
                )}
              </div>

              {/* Group B Selector */}
              <div className="flex-1 bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200 shadow-sm text-center space-y-3">
                <div className="text-xs font-black text-amber-800 uppercase tracking-wider">
                  Nhóm bên phải có mấy quả?
                </div>
                <div className="flex justify-center gap-2 min-h-[50px] items-center">
                  {Array.from({ length: theme.countB }).map((_, i) => (
                    <span key={i} className="text-3xl sm:text-4xl">{theme.itemB.emoji}</span>
                  ))}
                </div>

                {!isAnswerBCorrect ? (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-bold text-slate-500">Chọn số quả cam:</div>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleSelectCountB(num)}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-black text-sm sm:text-base border-2 cursor-pointer transition-all ${
                            userAnswerB === num
                              ? 'bg-amber-500 text-white border-amber-600 scale-105'
                              : 'bg-slate-50 hover:bg-amber-50 text-slate-800 border-slate-200'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-2xl p-2.5 font-black text-sm flex items-center justify-center gap-1.5 animate-bounce">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Chính xác: Có 2 quả cam!</span>
                  </div>
                )}
              </div>
            </div>

            {isAnswerACorrect && isAnswerBCorrect && (
              <button
                onClick={() => {
                  soundService.playClick();
                  setCurrentStage('combine');
                }}
                className="py-3 px-8 bg-[#22C55E] hover:bg-emerald-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-md cursor-pointer flex items-center gap-2 active:scale-95 transition-all animate-pulse"
              >
                <span>Đúng cả hai nhóm! Sang Bước 3: Gộp hai nhóm ➡️</span>
              </button>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 3: GỘP HAI NHÓM (DI CHUYỂN GẦN NHAU, TỰ ĐẾM TỔNG) */}
        {/* ============================================================ */}
        {currentStage === 'combine' && (
          <div className="flex-1 flex flex-col justify-center items-center py-2 space-y-4">
            {/* Combined plate with animation */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-indigo-200 shadow-md text-center max-w-xl w-full space-y-3">
              <div className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center justify-center gap-2">
                <span>🍽️ Chiếc đĩa chung: Gộp cả hai nhóm quả</span>
              </div>

              {/* All fruits together in one shared container, no numbers printed */}
              <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-gradient-to-r from-rose-50/70 via-indigo-50/50 to-amber-50/70 rounded-2xl border border-indigo-100 min-h-[90px]">
                {/* Apples */}
                {Array.from({ length: theme.countA }).map((_, i) => (
                  <div
                    key={`a-${i}`}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl bg-rose-50 border border-rose-200 shadow-xs animate-scaleIn"
                  >
                    <span>{theme.itemA.emoji}</span>
                  </div>
                ))}
                {/* Oranges */}
                {Array.from({ length: theme.countB }).map((_, i) => (
                  <div
                    key={`b-${i}`}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl bg-amber-50 border border-amber-200 shadow-xs animate-scaleIn"
                  >
                    <span>{theme.itemB.emoji}</span>
                  </div>
                ))}
              </div>

              {/* Prompt to count total */}
              <div className="space-y-2 pt-1">
                <div className="text-sm font-black text-slate-800">
                  Có tất cả bao nhiêu quả?
                </div>
                <div className="flex justify-center gap-2.5">
                  {[3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleSelectTotal(num)}
                      className={`w-12 h-12 rounded-2xl font-black text-lg sm:text-xl border-2 cursor-pointer transition-all ${
                        userAnswerTotal === num
                          ? isTotalCorrect
                            ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-md'
                            : 'bg-rose-500 text-white border-rose-600'
                          : 'bg-slate-50 hover:bg-indigo-50 text-slate-800 border-slate-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 4: HÌNH THÀNH PHÉP CỘNG (3 + 2 = 5) */}
        {/* ============================================================ */}
        {currentStage === 'equation' && (
          <div className="flex-1 flex flex-col justify-center items-center py-2 space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-emerald-300 shadow-lg text-center max-w-xl w-full space-y-4">
              <div className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                ✨ Hình thành phép tính cộng
              </div>

              {/* Large Equation Display */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 text-3xl sm:text-4xl md:text-5xl font-black font-heading text-slate-900 py-2">
                <div className="p-3 sm:p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-700 shadow-xs flex flex-col items-center">
                  <span>{theme.countA}</span>
                  <span className="text-[10px] text-rose-500 font-bold tracking-normal">{theme.itemA.emoji} {theme.itemA.nameVi}</span>
                </div>

                <span className="text-indigo-600 font-black">+</span>

                <div className="p-3 sm:p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-700 shadow-xs flex flex-col items-center">
                  <span>{theme.countB}</span>
                  <span className="text-[10px] text-amber-500 font-bold tracking-normal">{theme.itemB.emoji} {theme.itemB.nameVi}</span>
                </div>

                <span className="text-slate-500 font-black">=</span>

                <div className="p-3 sm:p-4 rounded-2xl bg-emerald-50 border-3 border-emerald-400 text-emerald-700 shadow-md scale-105 flex flex-col items-center">
                  <span>{theme.countA + theme.countB}</span>
                  <span className="text-[10px] text-emerald-600 font-bold tracking-normal">Tất cả {theme.unitVi}</span>
                </div>
              </div>

              {/* Spoken sentence */}
              <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 text-xs sm:text-sm font-black text-emerald-900">
                Đọc là: “Ba cộng hai bằng năm.” (Three plus two equals five.)
              </div>
            </div>

            <button
              onClick={() => {
                soundService.playClick();
                setCurrentStage('conclusion');
              }}
              className="py-3 px-8 bg-[#2563EB] hover:bg-blue-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-md cursor-pointer flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>Xem kết luận kiến thức mới ➡️</span>
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 5: KẾT LUẬN KIẾN THỨC MỚI */}
        {/* ============================================================ */}
        {currentStage === 'conclusion' && (
          <div className="flex-1 flex flex-col justify-center items-center py-2 space-y-4">
            <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-3xl p-6 sm:p-8 border-3 border-amber-300 shadow-lg text-center max-w-xl w-full space-y-4">
              <div className="flex justify-center">
                <RobotMathChibi expression="cheering" size="md" className="animate-bounce" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900 font-heading">
                  GHI NHỚ CÙNG ROBOT
                </h3>
                <p className="text-sm sm:text-base font-black text-amber-950 leading-relaxed px-2">
                  “Khi gộp hai nhóm đồ vật lại với nhau, chúng mình có thể dùng phép cộng để tìm số đồ vật có tất cả.”
                </p>
                <p className="text-xs font-semibold text-amber-800 italic pt-1">
                  “Putting two groups together gives us addition!”
                </p>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-amber-200 inline-block text-base sm:text-lg font-black text-emerald-700 shadow-xs">
                3 + 2 = 5
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Khám phá lại</span>
              </button>

              {onCompleteStep && (
                <button
                  onClick={onCompleteStep}
                  className="py-3 px-8 bg-[#22C55E] hover:bg-emerald-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-md cursor-pointer flex items-center gap-2 active:scale-95 transition-all"
                >
                  <span>TIẾP TỤC BÀI HỌC ➡️</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
