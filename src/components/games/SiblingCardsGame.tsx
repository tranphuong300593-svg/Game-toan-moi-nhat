/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundEffects, soundService } from '../../services/audioService';
import { Volume2, Sparkles, Check, RotateCcw, ArrowLeft, Trophy } from 'lucide-react';

interface SiblingCardsGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

interface CardItem {
  uid: string; // unique card id for key
  pairKey: string; // identifier matching the two sibling cards
  label: string; // text displayed on card front
  displayType: 'equation' | 'result';
  isFlipped: boolean;
  isMatched: boolean;
}

interface RoundData {
  roundNumber: number;
  titleVi: string;
  titleEn: string;
  promptVi: string;
  promptEn: string;
  gridCols: string;
  pairs: Array<{
    pairKey: string;
    card1Text: string;
    card2Text: string;
    result: number;
  }>;
}

export const SiblingCardsGame: React.FC<SiblingCardsGameProps> = ({
  student,
  langMode: _langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [matchedPairsCount, setMatchedPairsCount] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // -------------------------------------------------------------
  // DATA FOR 5 ROUNDS (Strictly Math Grade 1, no duplicate answers within a round)
  // -------------------------------------------------------------
  const ROUNDS_CONFIG: RoundData[] = [
    // VÒNG 1: ANH EM TÌM NHAU (6 thẻ = 3 cặp, phạm vi 10, phép tính ↔ kết quả)
    {
      roundNumber: 1,
      titleVi: 'Vòng 1: Anh Em Tìm Nhau',
      titleEn: 'Round 1: Sibling Search',
      promptVi: 'Lật thẻ phép tính và kết quả tương ứng trong phạm vi 10!',
      promptEn: 'Match each equation with its correct result up to 10!',
      gridCols: 'grid-cols-3',
      pairs: [
        { pairKey: 'p1', card1Text: '3 + 4', card2Text: '7', result: 7 },
        { pairKey: 'p2', card1Text: '9 - 5', card2Text: '4', result: 4 },
        { pairKey: 'p3', card1Text: '2 + 3', card2Text: '5', result: 5 },
      ],
    },
    // VÒNG 2: CẶP ĐÔI BÍ MẬT (6 thẻ = 3 cặp phép tính có cùng kết quả)
    {
      roundNumber: 2,
      titleVi: 'Vòng 2: Cặp Đôi Bí Mật',
      titleEn: 'Round 2: Secret Pairs',
      promptVi: 'Tìm hai phép tính có cùng kết quả để ghép thành một cặp!',
      promptEn: 'Find two different equations that share the same result!',
      gridCols: 'grid-cols-3',
      pairs: [
        { pairKey: 'p1', card1Text: '2 + 5', card2Text: '9 - 2', result: 7 },
        { pairKey: 'p2', card1Text: '8 - 3', card2Text: '1 + 4', result: 5 },
        { pairKey: 'p3', card1Text: '6 + 2', card2Text: '10 - 2', result: 8 },
      ],
    },
    // VÒNG 3: BẠN NÀO CÙNG NHÀ? (6 thẻ = 3 cặp, phép tính 2 chữ số không nhớ/mượn ↔ kết quả)
    {
      roundNumber: 3,
      titleVi: 'Vòng 3: Bạn Nào Cùng Nhà?',
      titleEn: 'Round 3: Same House Buddies',
      promptVi: 'Ghép phép tính hai chữ số không nhớ với kết quả chính xác!',
      promptEn: 'Match two-digit equations without regrouping to correct answers!',
      gridCols: 'grid-cols-3',
      pairs: [
        { pairKey: 'p1', card1Text: '23 + 14', card2Text: '37', result: 37 },
        { pairKey: 'p2', card1Text: '68 - 25', card2Text: '43', result: 43 },
        { pairKey: 'p3', card1Text: '42 + 16', card2Text: '58', result: 58 },
      ],
    },
    // VÒNG 4: THỬ TÀI TRÍ NHỚ (8 thẻ = 4 cặp phép tính và kết quả phạm vi 100)
    {
      roundNumber: 4,
      titleVi: 'Vòng 4: Thử Tài Trí Nhớ',
      titleEn: 'Round 4: Memory Master',
      promptVi: 'Ghi nhớ vị trí và ghép 4 cặp thẻ phép tính phạm vi 100!',
      promptEn: 'Memorize positions and match 4 pairs of two-digit math cards!',
      gridCols: 'grid-cols-4',
      pairs: [
        { pairKey: 'p1', card1Text: '31 + 27', card2Text: '58', result: 58 },
        { pairKey: 'p2', card1Text: '76 - 34', card2Text: '42', result: 42 },
        { pairKey: 'p3', card1Text: '45 + 12', card2Text: '57', result: 57 },
        { pairKey: 'p4', card1Text: '89 - 26', card2Text: '63', result: 63 },
      ],
    },
    // VÒNG 5: CẶP THẺ SIÊU TỐC (10 thẻ = 5 cặp trộn phạm vi 10 và phạm vi 100)
    {
      roundNumber: 5,
      titleVi: 'Vòng 5: Cặp Thẻ Siêu Tốc',
      titleEn: 'Round 5: Speed Pairs',
      promptVi: 'Chinh phục thử thách cuối cùng với 5 cặp thẻ tổng hợp!',
      promptEn: 'Conquer the final speed challenge with 5 mixed math pairs!',
      gridCols: 'grid-cols-5',
      pairs: [
        { pairKey: 'p1', card1Text: '4 + 5', card2Text: '9', result: 9 },
        { pairKey: 'p2', card1Text: '10 - 4', card2Text: '6', result: 6 },
        { pairKey: 'p3', card1Text: '52 + 25', card2Text: '77', result: 77 },
        { pairKey: 'p4', card1Text: '86 - 31', card2Text: '55', result: 55 },
        { pairKey: 'p5', card1Text: '34 + 14', card2Text: '48', result: 48 },
      ],
    },
  ];

  // Helper to shuffle cards randomly
  const shuffleCards = (items: CardItem[]): CardItem[] => {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Initialize round cards
  const initRound = useCallback((roundIdx: number) => {
    const roundConfig = ROUNDS_CONFIG[roundIdx];
    if (!roundConfig) return;

    const newCards: CardItem[] = [];
    roundConfig.pairs.forEach((pair, pIdx) => {
      // Card 1
      newCards.push({
        uid: `r${roundIdx}-p${pIdx}-c1`,
        pairKey: pair.pairKey,
        label: pair.card1Text,
        displayType: 'equation',
        isFlipped: false,
        isMatched: false,
      });
      // Card 2
      newCards.push({
        uid: `r${roundIdx}-p${pIdx}-c2`,
        pairKey: pair.pairKey,
        label: pair.card2Text,
        displayType: roundIdx === 1 ? 'equation' : 'result',
        isFlipped: false,
        isMatched: false,
      });
    });

    const shuffled = shuffleCards(newCards);
    setCards(shuffled);
    setFlippedIndices([]);
    setIsProcessing(false);
    setMatchedPairsCount(0);
    setFeedback(null);
  }, []);

  // Set up round on mount or round index change
  useEffect(() => {
    initRound(currentRoundIndex);
  }, [currentRoundIndex, initRound]);

  // Handle card click
  const handleCardClick = (cardIndex: number) => {
    // Prevent interaction if busy, card already flipped or already matched
    if (isProcessing) return;
    if (cards[cardIndex].isFlipped || cards[cardIndex].isMatched) return;

    soundEffects.click();

    // Flip selected card
    const updatedCards = [...cards];
    updatedCards[cardIndex].isFlipped = true;
    setCards(updatedCards);

    const newFlipped = [...flippedIndices, cardIndex];
    setFlippedIndices(newFlipped);

    // If 2 cards are now flipped, compare them
    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const [firstIdx, secondIdx] = newFlipped;
      const card1 = updatedCards[firstIdx];
      const card2 = updatedCards[secondIdx];

      if (card1.pairKey === card2.pairKey) {
        // MATCH!
        soundEffects.correct();
        setFeedback({ isCorrect: true, text: `Xuất sắc! Cặp đúng: ${card1.label} = ${card2.label}` });

        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIdx].isMatched = true;
          matchedCards[secondIdx].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setIsProcessing(false);
          setFeedback(null);

          const nextMatchedCount = matchedPairsCount + 1;
          setMatchedPairsCount(nextMatchedCount);

          // Check if round is complete
          const totalPairsInRound = ROUNDS_CONFIG[currentRoundIndex].pairs.length;
          if (nextMatchedCount >= totalPairsInRound) {
            // Round finished!
            soundEffects.celebrate();
            setScore((prev) => prev + 5);

            if (currentRoundIndex < ROUNDS_CONFIG.length - 1) {
              setFeedback({ isCorrect: true, text: '🌟 Chúc mừng bé! Đã hoàn thành vòng này!' });
              setTimeout(() => {
                setCurrentRoundIndex((prev) => prev + 1);
              }, 1200);
            } else {
              // ALL 5 ROUNDS COMPLETED!
              setIsCompleted(true);
              StorageService.recordActivity(student.id, {
                type: 'game',
                targetId: 'sibling-cards',
                targetName: 'Cặp Thẻ Anh Em',
                score: 5,
                totalQuestions: 5,
                starsEarned: 25,
                timeSpentSeconds: 90,
              });
              const updated = StorageService.getCurrentStudent();
              if (updated) {
                onUpdateStudent(updated);
              }
            }
          }
        }, 600);
      } else {
        // MISMATCH!
        soundEffects.wrong();
        setFeedback({ isCorrect: false, text: 'Chưa đúng rồi! Bé hãy nhớ vị trí thẻ nhé.' });

        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIdx].isFlipped = false;
          resetCards[secondIdx].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
          setIsProcessing(false);
          setFeedback(null);
        }, 1100);
      }
    }
  };

  const handleSpeakEn = (text: string) => {
    soundEffects.click();
    soundService.speak(text, 'en');
  };

  const handleRestart = () => {
    setCurrentRoundIndex(0);
    setScore(0);
    setIsCompleted(false);
    initRound(0);
  };

  const currentRound = ROUNDS_CONFIG[currentRoundIndex];

  return (
    <div className="w-full h-full max-h-[100dvh] flex flex-col bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white select-none overflow-hidden font-sans">
      {/* 1. Header Navigation Bar */}
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
            <span className="text-xl">🎴</span>
            <div>
              <h1 className="text-xs sm:text-sm md:text-base font-black tracking-wide bg-gradient-to-r from-emerald-300 via-amber-200 to-lime-300 bg-clip-text text-transparent uppercase">
                CẶP THẺ ANH EM
              </h1>
              <p className="text-[11px] sm:text-xs text-emerald-300 font-medium">
                {currentRound.titleVi}
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
                  idx < currentRoundIndex
                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                    : idx === currentRoundIndex
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

      {/* 2. Main Game Arena (16:9 Zero-Scroll Layout) */}
      <main className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 relative overflow-hidden">
        {/* Floating feedback toast */}
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

        {!isCompleted ? (
          <div className="w-full max-w-4xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            {/* Title & Bilingual Prompt */}
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                {currentRound.titleVi} • Thẻ Trí Nhớ Rừng Xanh
              </span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-amber-300 drop-shadow-md">
                {currentRound.promptVi}
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-emerald-200/90 italic mt-0.5">
                <span>{currentRound.promptEn}</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn(currentRound.promptEn)}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cards Grid */}
            <div
              className={`w-full p-4 sm:p-6 rounded-3xl bg-slate-900/80 border-2 border-emerald-500/40 backdrop-blur-md shadow-2xl grid ${currentRound.gridCols} gap-3 sm:gap-4 items-center justify-center max-w-3xl`}
            >
              {cards.map((card, idx) => {
                const isShown = card.isFlipped || card.isMatched;

                return (
                  <button
                    key={card.uid}
                    type="button"
                    disabled={isProcessing || isShown}
                    onClick={() => handleCardClick(idx)}
                    className={`h-24 sm:h-32 md:h-36 rounded-2xl border-2 transition-all duration-300 transform flex flex-col items-center justify-center p-2 relative shadow-lg cursor-pointer ${
                      card.isMatched
                        ? 'bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-400 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)] scale-100 cursor-default'
                        : card.isFlipped
                        ? 'bg-gradient-to-br from-white via-emerald-50 to-teal-100 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)] scale-105'
                        : 'bg-gradient-to-br from-emerald-800 via-teal-900 to-emerald-950 border-emerald-400/50 hover:border-amber-300 hover:scale-105 active:scale-95 shadow-md'
                    }`}
                  >
                    {isShown ? (
                      /* Card Front: Equation or Result */
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <span
                          className={`font-black tracking-tight text-center ${
                            card.isMatched
                              ? 'text-amber-950 text-xl sm:text-2xl md:text-3xl'
                              : 'text-slate-900 text-xl sm:text-2xl md:text-3xl'
                          }`}
                        >
                          {card.label}
                        </span>
                        {card.isMatched && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Card Back: 3D Forest Tree / Animal Cute Theme */
                      <div className="flex flex-col items-center justify-center gap-1 select-none pointer-events-none">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-700/60 border border-emerald-400/40 flex items-center justify-center text-2xl shadow-inner">
                          {idx % 4 === 0 ? '🍃' : idx % 4 === 1 ? '🐰' : idx % 4 === 2 ? '🌰' : '🍄'}
                        </div>
                        <span className="text-[10px] font-black tracking-wider uppercase text-emerald-300/80">
                          Toán 1
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Status pill */}
            <div className="px-4 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-400/30 text-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                Đã ghép: <strong className="text-amber-300">{matchedPairsCount}</strong> / {currentRound.pairs.length} cặp
              </span>
            </div>
          </div>
        ) : (
          /* Completion Screen */
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/95 border-2 border-emerald-400 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center animate-scale-up my-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-amber-300 flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_30px_rgba(52,211,153,0.6)] mb-3 animate-bounce">
              <Trophy className="w-12 h-12 text-yellow-300" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-300 uppercase tracking-wide">
              CHIẾN THẮNG XUẤT SẮC!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1 font-medium">
              Bé đã chinh phục toàn bộ 5 vòng thử thách của <br />
              <strong className="text-amber-300">CẶP THẺ ANH EM</strong>!
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
