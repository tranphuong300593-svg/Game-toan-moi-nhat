/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundService, soundEffects } from '../../services/audioService';
import confetti from 'canvas-confetti';
import { FullscreenStage } from '../common/FullscreenStage';
import {
  ArrowLeft,
  RotateCcw,
  Volume2,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  Award,
  Star,
  Trophy,
  Delete,
  Flag,
} from 'lucide-react';

interface CalculationRacerGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

// 5 Stages of the Calculation Racer
type RacerStageType =
  | 'lane_speed' // Thử thách 1: Chạm chọn làn đường đúng để tăng tốc
  | 'match_pairs' // Thử thách 2: Ghép đôi tiếp sức (ghép phép tính với kết quả)
  | 'find_error' // Thử thách 3: Khúc cua tìm lỗi sai (kiểm tra pit-stop)
  | 'keypad_input' // Thử thách 4: Nhập kết quả bằng bàn phím số tốc độ
  | 'word_problem'; // Thử thách 5: Bài toán có lời văn về đích

// Helper: Sinh phép tính cộng 2 chữ số KHÔNG NHỚ trong phạm vi 100
export function generateNoCarryAddition() {
  const tensA = Math.floor(Math.random() * 5) + 1; // 1 to 5
  const tensB = Math.floor(Math.random() * (8 - tensA)) + 1; // 1 to 8 - tensA
  const onesA = Math.floor(Math.random() * 5) + 1; // 1 to 5
  const onesB = Math.floor(Math.random() * (9 - onesA)) + 1; // 1 to 9 - onesA

  const a = tensA * 10 + onesA;
  const b = tensB * 10 + onesB;
  return { a, b, ans: a + b, expr: `${a} + ${b}` };
}

// Helper: Sinh phép tính trừ 2 chữ số KHÔNG MƯỢN trong phạm vi 100
export function generateNoBorrowSubtraction() {
  const tensA = Math.floor(Math.random() * 5) + 4; // 4 to 8
  const tensB = Math.floor(Math.random() * (tensA - 1)) + 1; // 1 to tensA-1
  const onesA = Math.floor(Math.random() * 5) + 4; // 4 to 8
  const onesB = Math.floor(Math.random() * onesA) + 1; // 1 to onesA

  const a = tensA * 10 + onesA;
  const b = tensB * 10 + onesB;
  return { a, b, ans: a - b, expr: `${a} - ${b}` };
}

export const CalculationRacerGame: React.FC<CalculationRacerGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [currentStage, setCurrentStage] = useState<number>(0); // 0 to 4 (5 challenges)
  const [speed, setSpeed] = useState<number>(65); // km/h
  const [carLane, setCarLane] = useState<number>(1); // 0: top, 1: mid, 2: bot
  const [isNitro, setIsNitro] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [startTime] = useState(Date.now());

  // --- STATE FOR CHALLENGE 1 (LANE SPEED) ---
  const [laneQuest, setLaneQuest] = useState<{
    expr: string;
    ans: number;
    options: { lane: number; val: number }[];
  }>({
    expr: '42 + 25',
    ans: 67,
    options: [
      { lane: 0, val: 77 },
      { lane: 1, val: 67 },
      { lane: 2, val: 66 },
    ],
  });

  // --- STATE FOR CHALLENGE 2 (MATCH PAIRS) ---
  const [matchPairs, setMatchPairs] = useState<{
    items: { id: string; text: string; val: number; matched: boolean }[];
    targets: { id: string; val: number; matched: boolean }[];
  }>({ items: [], targets: [] });
  const [selectedPairItem, setSelectedPairItem] = useState<string | null>(null);

  // --- STATE FOR CHALLENGE 3 (FIND ERROR) ---
  const [errorQuest, setErrorQuest] = useState<{
    cases: { id: string; expr: string; isWrong: boolean; explanation: string }[];
  }>({ cases: [] });
  const [selectedErrorId, setSelectedErrorId] = useState<string | null>(null);

  // --- STATE FOR CHALLENGE 4 (KEYPAD INPUT) ---
  const [keypadQuest, setKeypadQuest] = useState<{
    expr: string;
    ans: number;
  }>({ expr: '78 - 35', ans: 43 });
  const [typedInput, setTypedInput] = useState<string>('');

  // --- STATE FOR CHALLENGE 5 (WORD PROBLEM) ---
  const [wordQuest, setWordQuest] = useState<{
    storyVi: string;
    storyEn: string;
    questionVi: string;
    questionEn: string;
    options: number[];
    ans: number;
    unit: string;
  }>({
    storyVi: 'Đội đua Xe Đỏ chạy được 43 vòng, đội đua Xe Vàng chạy được 32 vòng.',
    storyEn: 'Red team completed 43 laps, Yellow team completed 32 laps.',
    questionVi: 'Hỏi cả hai đội chạy được tất cả bao nhiêu vòng đua?',
    questionEn: 'How many laps did both teams complete in total?',
    options: [75, 85, 74, 65],
    ans: 75,
    unit: 'vòng',
  });
  const [selectedWordAns, setSelectedWordAns] = useState<number | null>(null);

  // Generate question states
  const initChallenge1 = () => {
    const isAdd = Math.random() > 0.5;
    const calc = isAdd ? generateNoCarryAddition() : generateNoBorrowSubtraction();
    const wrong1 = calc.ans + 10 <= 99 ? calc.ans + 10 : calc.ans - 10;
    const wrong2 = calc.ans - 1 >= 10 ? calc.ans - 1 : calc.ans + 1;
    const opts = [
      { lane: 0, val: wrong1 },
      { lane: 1, val: calc.ans },
      { lane: 2, val: wrong2 },
    ].sort(() => Math.random() - 0.5).map((opt, idx) => ({ ...opt, lane: idx }));

    setLaneQuest({
      expr: `${calc.expr} = ?`,
      ans: calc.ans,
      options: opts,
    });
    setCarLane(1);
  };

  const initChallenge2 = () => {
    const c1 = generateNoCarryAddition();
    const c2 = generateNoBorrowSubtraction();
    const c3 = generateNoCarryAddition();

    const items = [
      { id: 'i1', text: c1.expr, val: c1.ans, matched: false },
      { id: 'i2', text: c2.expr, val: c2.ans, matched: false },
      { id: 'i3', text: c3.expr, val: c3.ans, matched: false },
    ].sort(() => Math.random() - 0.5);

    const targets = [
      { id: 't1', val: c1.ans, matched: false },
      { id: 't2', val: c2.ans, matched: false },
      { id: 't3', val: c3.ans, matched: false },
    ].sort(() => Math.random() - 0.5);

    setMatchPairs({ items, targets });
    setSelectedPairItem(null);
  };

  const initChallenge3 = () => {
    const c1 = generateNoCarryAddition();
    const c2 = generateNoBorrowSubtraction();
    const cWrong = generateNoCarryAddition();
    const wrongResult = cWrong.ans + 10 <= 99 ? cWrong.ans + 10 : cWrong.ans - 10;

    const list = [
      { id: 'c1', expr: `${c1.expr} = ${c1.ans}`, isWrong: false, explanation: 'Chính xác!' },
      { id: 'c2', expr: `${c2.expr} = ${c2.ans}`, isWrong: false, explanation: 'Chính xác!' },
      { id: 'c3', expr: `${cWrong.expr} = ${wrongResult}`, isWrong: true, explanation: `Phép tính sai! Đúng phải là ${cWrong.ans}.` },
    ].sort(() => Math.random() - 0.5);

    setErrorQuest({ cases: list });
    setSelectedErrorId(null);
  };

  const initChallenge4 = () => {
    const isAdd = Math.random() > 0.5;
    const calc = isAdd ? generateNoCarryAddition() : generateNoBorrowSubtraction();
    setKeypadQuest({ expr: `${calc.expr} = ?`, ans: calc.ans });
    setTypedInput('');
  };

  const initChallenge5 = () => {
    const isAdd = Math.random() > 0.5;
    if (isAdd) {
      const tensA = Math.floor(Math.random() * 4) + 2; // 2 to 5
      const tensB = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const onesA = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const onesB = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const a = tensA * 10 + onesA;
      const b = tensB * 10 + onesB;
      const sum = a + b;
      const opts = [sum, sum + 10, Math.max(10, sum - 10), sum + 1]
        .filter((v, idx, arr) => arr.indexOf(v) === idx)
        .sort(() => Math.random() - 0.5);

      setWordQuest({
        storyVi: `Xe đua Số 1 chạy được ${a} vòng đua, Xe đua Số 2 chạy được ${b} vòng đua.`,
        storyEn: `Car 1 completed ${a} laps, Car 2 completed ${b} laps.`,
        questionVi: 'Hỏi cả hai xe chạy được tất cả bao nhiêu vòng đua?',
        questionEn: 'How many laps did both cars complete in total?',
        options: opts,
        ans: sum,
        unit: 'vòng',
      });
    } else {
      const tensA = Math.floor(Math.random() * 4) + 5; // 5 to 8
      const tensB = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const onesA = Math.floor(Math.random() * 4) + 5; // 5 to 8
      const onesB = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const a = tensA * 10 + onesA;
      const b = tensB * 10 + onesB;
      const diff = a - b;
      const opts = [diff, diff + 10, Math.max(10, diff - 10), diff + 2]
        .filter((v, idx, arr) => arr.indexOf(v) === idx)
        .sort(() => Math.random() - 0.5);

      setWordQuest({
        storyVi: `Đoàn xe có ${a} chiếc đang thi đấu, đã có ${b} chiếc hoàn thành cuộc đua.`,
        storyEn: `There are ${a} cars in race, ${b} cars have crossed the finish line.`,
        questionVi: 'Hỏi còn lại bao nhiêu chiếc xe đang trên đường đua?',
        questionEn: 'How many cars are still racing on the track?',
        options: opts,
        ans: diff,
        unit: 'xe',
      });
    }
    setSelectedWordAns(null);
  };

  const startNewGame = () => {
    setCurrentStage(0);
    setSpeed(65);
    setIsNitro(false);
    setFeedback(null);
    setIsCompleted(false);
    initChallenge1();
    initChallenge2();
    initChallenge3();
    initChallenge4();
    initChallenge5();
  };

  useEffect(() => {
    startNewGame();
  }, []);

  // Advance stage helper
  const handleStageSuccess = (successMsg: string) => {
    soundEffects.correct();
    setIsNitro(true);
    setSpeed((prev) => Math.min(160, prev + 25));
    setFeedback(successMsg);

    confetti({
      particleCount: 35,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'],
    });

    setTimeout(() => {
      setIsNitro(false);
      setFeedback(null);
      if (currentStage < 4) {
        setCurrentStage((prev) => prev + 1);
      } else {
        // VICTORY!
        setIsCompleted(true);
        soundEffects.celebrate();
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#ef4444', '#f59e0b', '#fbbf24', '#38bdf8', '#8b5cf6'],
        });

        StorageService.recordActivity(student.id, {
          type: 'game',
          targetId: 'math-racing',
          targetName: 'Tay Đua Phép Tính',
          score: 5,
          totalQuestions: 5,
          starsEarned: 25,
          timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
        });

        const updated = StorageService.getCurrentStudent();
        if (updated) onUpdateStudent(updated);
      }
    }, 1100);
  };

  // --- HANDLER: CHALLENGE 1 (LANE SELECT) ---
  const handleSelectLane = (opt: { lane: number; val: number }) => {
    soundService.playClick();
    setCarLane(opt.lane);
    if (opt.val === laneQuest.ans) {
      handleStageSuccess('TUYỆT VỜI! Xe chuyển làn chính xác, Nitro kích hoạt phóng vọt lên!');
    } else {
      soundEffects.wrong();
      setSpeed(40);
      setFeedback('Chưa đúng làn đường! Bé hãy tính kỹ lại nhé!');
    }
  };

  // --- HANDLER: CHALLENGE 2 (MATCH PAIRS) ---
  const handleMatchSelect = (type: 'item' | 'target', id: string, val: number) => {
    soundService.playClick();
    if (type === 'item') {
      setSelectedPairItem(id);
    } else if (type === 'target' && selectedPairItem) {
      const srcItem = matchPairs.items.find((i) => i.id === selectedPairItem);
      if (srcItem && srcItem.val === val) {
        // Matched!
        soundEffects.correct();
        const nextItems = matchPairs.items.map((i) => (i.id === selectedPairItem ? { ...i, matched: true } : i));
        const nextTargets = matchPairs.targets.map((t) => (t.id === id ? { ...t, matched: true } : t));
        setMatchPairs({ items: nextItems, targets: nextTargets });
        setSelectedPairItem(null);

        // Check if all matched
        if (nextItems.every((i) => i.matched)) {
          handleStageSuccess('XUẤT SẮC! Cả 3 bình nhiên liệu đã được tiếp đầy, xe tăng tốc!');
        }
      } else {
        soundEffects.wrong();
        setSelectedPairItem(null);
        setFeedback('Chưa khớp rồi! Hãy tính lại kết quả của phép tính nhé!');
        setTimeout(() => setFeedback(null), 1200);
      }
    }
  };

  // --- HANDLER: CHALLENGE 3 (FIND ERROR) ---
  const handleSelectErrorCase = (c: { id: string; isWrong: boolean; explanation: string }) => {
    soundService.playClick();
    setSelectedErrorId(c.id);
    if (c.isWrong) {
      handleStageSuccess(`CHÍNH XÁC! ${c.explanation} Đội kỹ thuật đã khắc phục xong!`);
    } else {
      soundEffects.wrong();
      setFeedback('Phép tính này đúng rồi mà! Hãy tìm phép tính có kết quả SAI nhé!');
      setTimeout(() => setFeedback(null), 1200);
    }
  };

  // --- HANDLER: CHALLENGE 4 (KEYPAD INPUT) ---
  const handleKeypadPress = (digit: string) => {
    soundService.playClick();
    if (typedInput.length < 3) {
      setTypedInput((prev) => prev + digit);
    }
  };

  const handleKeypadBackspace = () => {
    soundService.playClick();
    setTypedInput((prev) => prev.slice(0, -1));
  };

  const handleKeypadSubmit = () => {
    soundService.playClick();
    const num = parseInt(typedInput, 10);
    if (num === keypadQuest.ans) {
      handleStageSuccess('ĐỈNH CAO! Mật mã chính xác, rào chắn laser mở tung!');
    } else {
      soundEffects.wrong();
      setFeedback('Mật mã chưa đúng! Bé hãy kiểm tra lại hàng chục và hàng đơn vị nhé!');
      setTimeout(() => setFeedback(null), 1200);
    }
  };

  // --- HANDLER: CHALLENGE 5 (WORD PROBLEM) ---
  const handleSelectWordAns = (ans: number) => {
    soundService.playClick();
    setSelectedWordAns(ans);
    if (ans === wordQuest.ans) {
      handleStageSuccess(`CHIẾN THẮNG! Đáp án đúng là ${wordQuest.ans} ${wordQuest.unit}! Xe cán đích vinh quang!`);
    } else {
      soundEffects.wrong();
      setFeedback('Chưa đúng rồi! Bé hãy đọc kỹ đề bài và thực hiện phép tính nhé!');
      setTimeout(() => setFeedback(null), 1200);
    }
  };


  return (
    <FullscreenStage
      titleVi="TAY ĐUA PHÉP TÍNH"
      titleEn="Calculation Speed Racer"
      categoryBadge="Khu 7 – Đường Đua Toán Học"
      onBack={onBack}
      topRightControls={
        <div className="flex items-center gap-2">
          {/* Speedometer */}
          <div className="flex items-center gap-1.5 bg-red-100 text-red-950 px-2.5 py-1 rounded-xl font-black text-xs border border-red-300 shadow-2xs">
            <Zap className={`w-3.5 h-3.5 ${isNitro ? 'fill-yellow-400 text-yellow-500 animate-bounce' : 'fill-amber-500 text-amber-500'}`} />
            <span>{speed} km/h</span>
          </div>

          {/* Progress */}
          <span className="text-xs font-black text-white bg-gradient-to-r from-red-600 to-orange-500 px-2.5 py-1 rounded-full shadow-xs">
            Chặng {currentStage + 1}/5
          </span>

          {/* Restart */}
          <button
            type="button"
            onClick={startNewGame}
            title="Chơi lại từ đầu"
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer shadow-2xs active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      }
      className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-white"
    >
      {!isCompleted ? (
        <div className="w-full h-full flex flex-col justify-between p-2 sm:p-3 select-none">
          {/* 1. Header Banner & Current Challenge Title */}
          <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 border border-red-500/40 shadow-md flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-2xl filter drop-shadow">🏎️</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-amber-300 bg-red-950/80 px-2 py-0.5 rounded-md border border-red-500/50">
                    {currentStage === 0 && 'Thử thách 1: Chuyển làn tăng tốc'}
                    {currentStage === 1 && 'Thử thách 2: Ghép đôi tiếp sức'}
                    {currentStage === 2 && 'Thử thách 3: Pit-stop tìm lỗi sai'}
                    {currentStage === 3 && 'Thử thách 4: Phá rào cản tốc độ'}
                    {currentStage === 4 && 'Thử thách 5: Cán vạch đích vinh quang'}
                  </span>
                  {feedback && (
                    <span className="text-xs font-bold text-yellow-300 animate-pulse hidden md:inline truncate">
                      {feedback}
                    </span>
                  )}
                </div>
                <h2 className="text-xs sm:text-sm md:text-base font-black font-['Be_Vietnam_Pro'] text-white truncate mt-0.5">
                  {currentStage === 0 && `Chọn làn đường có kết quả: ${laneQuest.expr}`}
                  {currentStage === 1 && 'Ghép phép tính với kết quả đúng để tiếp đầy 3 bình nhiên liệu!'}
                  {currentStage === 2 && 'Phát hiện phép tính SAI trong báo cáo kỹ thuật để sửa xe!'}
                  {currentStage === 3 && `Nhập kết quả phép tính: ${keypadQuest.expr} để phá rào chắn!`}
                  {currentStage === 4 && wordQuest.questionVi}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundService.cancelSpeech();
                const text =
                  currentStage === 0
                    ? `Calculate ${laneQuest.expr} and pick the right lane!`
                    : currentStage === 1
                    ? 'Match each addition or subtraction with its answer.'
                    : currentStage === 2
                    ? 'Find the incorrect equation to fix the racing engine.'
                    : currentStage === 3
                    ? `Type the answer for ${keypadQuest.expr}`
                    : wordQuest.questionEn;
                soundService.speakEn(text, { slow: true });
              }}
              className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-amber-300 border border-red-500/40 cursor-pointer shadow-xs shrink-0 flex items-center gap-1 text-xs font-bold active:scale-95"
              title="Phát âm tiếng Anh bổ trợ"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Phát âm 🔊</span>
            </button>
          </div>

          {/* 2. Interactive Arena Based on Stage */}
          <div className="flex-1 min-h-0 relative my-1 sm:my-2 rounded-3xl overflow-hidden border-2 sm:border-3 border-amber-400/80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl flex flex-col justify-center p-2 sm:p-4">
            {/* Speed stripes animation in background */}
            <div className="absolute inset-0 opacity-15 pointer-events-none flex flex-col justify-around">
              <div className="w-full h-1 bg-yellow-400 animate-pulse" />
              <div className="w-full h-1 bg-white animate-pulse" />
              <div className="w-full h-1 bg-yellow-400 animate-pulse" />
            </div>

            {/* ======================================================== */}
            {/* STAGE 1: LANE SELECT (Chạm chọn 3 làn đường) */}
            {/* ======================================================== */}
            {currentStage === 0 && (
              <div className="w-full h-full max-w-2xl mx-auto flex flex-col justify-around py-1">
                <div className="text-center">
                  <div className="inline-block bg-black/50 px-4 py-1.5 rounded-2xl border border-amber-400/60 shadow-inner">
                    <span className="text-amber-300 text-xs font-bold">PHÉP TÍNH: </span>
                    <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-wider">
                      {laneQuest.expr}
                    </span>
                  </div>
                </div>

                {/* 3 Racing Lanes */}
                <div className="space-y-2.5">
                  {laneQuest.options.map((opt) => {
                    const isCarHere = carLane === opt.lane;
                    return (
                      <div
                        key={opt.lane}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectLane(opt)}
                        className={`group relative h-14 sm:h-16 rounded-2xl border-2 transition-all flex items-center justify-between px-4 cursor-pointer active:scale-98 select-none ${
                          isCarHere
                            ? 'bg-gradient-to-r from-red-600/80 via-orange-600/70 to-amber-600/60 border-yellow-400 shadow-lg shadow-red-500/30'
                            : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-600 hover:border-amber-400/60'
                        }`}
                      >
                        {/* Car position */}
                        <div className="flex items-center gap-2">
                          <span className={`text-3xl filter drop-shadow transition-transform ${isCarHere ? 'scale-125 animate-bounce' : 'opacity-30'}`}>
                            🏎️
                          </span>
                          <span className="text-xs font-black text-slate-400 group-hover:text-amber-300">
                            Làn {opt.lane === 0 ? 'A (Trái)' : opt.lane === 1 ? 'B (Giữa)' : 'C (Phải)'}
                          </span>
                        </div>

                        {/* Result target gate */}
                        <div className="flex items-center gap-2">
                          <span className="text-xl sm:text-2xl font-black font-mono px-4 py-1 rounded-xl bg-black/60 text-yellow-300 border border-yellow-400/50 shadow-inner">
                            {opt.val}
                          </span>
                          <span className="text-xs font-bold text-amber-400 hidden sm:inline">
                            CHẠM ĐỂ CHỌN ➔
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STAGE 2: MATCH PAIRS (Ghép đôi 3 cặp tiếp sức) */}
            {/* ======================================================== */}
            {currentStage === 1 && (
              <div className="w-full h-full max-w-2xl mx-auto flex flex-col justify-around py-1">
                <div className="text-center">
                  <span className="text-xs sm:text-sm font-bold text-amber-300 bg-black/40 px-3 py-1 rounded-full border border-amber-400/40">
                    💡 Chạm 1 phép tính ở cột trái, rồi chạm kết quả tương ứng ở cột phải!
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-8 items-center">
                  {/* Left Column: Expressions */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-black uppercase text-slate-400 text-center">
                      Bình nhiên liệu (Phép tính)
                    </div>
                    {matchPairs.items.map((it) => (
                      <button
                        key={it.id}
                        type="button"
                        disabled={it.matched}
                        onClick={() => handleMatchSelect('item', it.id, it.val)}
                        className={`w-full py-3 px-3 rounded-2xl border-2 font-mono font-black text-base sm:text-lg transition-all cursor-pointer flex items-center justify-between ${
                          it.matched
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400 opacity-60 cursor-default'
                            : selectedPairItem === it.id
                            ? 'bg-amber-500 text-slate-950 border-yellow-300 ring-4 ring-yellow-400/50 shadow-lg scale-102'
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white'
                        }`}
                      >
                        <span>⛽ {it.text}</span>
                        {it.matched && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      </button>
                    ))}
                  </div>

                  {/* Right Column: Targets */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-black uppercase text-slate-400 text-center">
                      Đồng hồ đích (Kết quả)
                    </div>
                    {matchPairs.targets.map((tg) => (
                      <button
                        key={tg.id}
                        type="button"
                        disabled={tg.matched}
                        onClick={() => handleMatchSelect('target', tg.id, tg.val)}
                        className={`w-full py-3 px-3 rounded-2xl border-2 font-mono font-black text-base sm:text-lg transition-all cursor-pointer flex items-center justify-between ${
                          tg.matched
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400 opacity-60 cursor-default'
                            : 'bg-slate-800 hover:bg-amber-600/40 border-slate-600 hover:border-yellow-400 text-yellow-300'
                        }`}
                      >
                        <span>⚡ {tg.val}</span>
                        {tg.matched && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STAGE 3: FIND ERROR (Tìm phép tính sai) */}
            {/* ======================================================== */}
            {currentStage === 2 && (
              <div className="w-full h-full max-w-2xl mx-auto flex flex-col justify-around py-1">
                <div className="text-center">
                  <div className="inline-block bg-black/50 px-4 py-1.5 rounded-2xl border border-red-500/60 shadow-inner">
                    <span className="text-amber-300 text-xs font-bold">TRẠM PIT-STOP: </span>
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      Bé hãy bấm vào phép tính có kết quả SAI để kỹ sư sửa xe nhé!
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {errorQuest.cases.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectErrorCase(c)}
                      className={`w-full p-3 sm:p-4 rounded-2xl border-2 font-mono font-black text-base sm:text-xl transition-all cursor-pointer flex items-center justify-between ${
                        selectedErrorId === c.id
                          ? c.isWrong
                            ? 'bg-emerald-600/80 border-emerald-400 text-white shadow-lg'
                            : 'bg-red-600/80 border-red-400 text-white'
                          : 'bg-slate-800/90 hover:bg-slate-700 border-slate-600 hover:border-amber-400 text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>🔧</span>
                        <span>{c.expr}</span>
                      </span>
                      <span className="text-xs font-sans font-bold text-amber-400">
                        {selectedErrorId === c.id ? (c.isWrong ? '✓ Phép tính sai đã tìm thấy!' : '✗ Phép tính này đúng') : 'Bấm để báo lỗi'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STAGE 4: KEYPAD INPUT (Bàn phím ảo nhập kết quả) */}
            {/* ======================================================== */}
            {currentStage === 3 && (
              <div className="w-full h-full max-w-xl mx-auto flex flex-col justify-around py-1">
                <div className="text-center">
                  <span className="text-xs font-bold text-amber-300">RÀO CHẮN TỐC ĐỘ: BÉ HÃY NHẬP MẬT MÃ KẾT QUẢ</span>
                  <div className="text-2xl sm:text-3xl font-black text-yellow-300 font-mono tracking-widest mt-0.5">
                    {keypadQuest.expr}
                  </div>
                </div>

                {/* Input Screen Box */}
                <div className="flex items-center justify-center">
                  <div className="min-w-44 px-6 py-2.5 rounded-2xl bg-black/80 border-2 border-amber-400 text-center shadow-inner">
                    <span className="text-3xl sm:text-4xl font-mono font-black text-white tracking-widest">
                      {typedInput || <span className="opacity-30">__</span>}
                    </span>
                  </div>
                </div>

                {/* Numeric Keypad */}
                <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto w-full">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleKeypadPress(digit)}
                      className="py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-mono font-black text-lg border border-slate-500 shadow-2xs active:scale-95 cursor-pointer"
                    >
                      {digit}
                    </button>
                  ))}
                </div>

                {/* Control Action Buttons */}
                <div className="flex items-center justify-center gap-3 max-w-sm mx-auto w-full">
                  <button
                    type="button"
                    onClick={handleKeypadBackspace}
                    className="flex-1 py-2 rounded-xl bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-500 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                  >
                    <Delete className="w-4 h-4" />
                    <span>XÓA</span>
                  </button>
                  <button
                    type="button"
                    disabled={!typedInput}
                    onClick={handleKeypadSubmit}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs border border-emerald-300 shadow-md flex items-center justify-center gap-1 cursor-pointer active:scale-95 disabled:opacity-40"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>XÁC NHẬN</span>
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STAGE 5: WORD PROBLEM (Bài toán lời văn về đích) */}
            {/* ======================================================== */}
            {currentStage === 4 && (
              <div className="w-full h-full max-w-2xl mx-auto flex flex-col justify-around py-1">
                {/* Story Context */}
                <div className="bg-slate-800/90 rounded-2xl p-3 border border-amber-400/60 text-center space-y-1">
                  <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-yellow-300 bg-red-900/50 px-2.5 py-0.5 rounded-full">
                    <Flag className="w-3.5 h-3.5" /> CHẶNG CUỐI CÁN ĐÍCH
                  </div>
                  <p className="text-xs sm:text-sm md:text-base font-semibold text-white">
                    {wordQuest.storyVi}
                  </p>
                  <p className="text-sm sm:text-base md:text-lg font-black text-amber-300 font-['Be_Vietnam_Pro']">
                    {wordQuest.questionVi}
                  </p>
                </div>

                {/* 4 Options */}
                <div className="grid grid-cols-2 gap-3">
                  {wordQuest.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectWordAns(opt)}
                      className={`py-3.5 sm:py-4 px-4 rounded-2xl border-2 font-mono font-black text-lg sm:text-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 ${
                        selectedWordAns === opt
                          ? opt === wordQuest.ans
                            ? 'bg-emerald-600 border-emerald-300 text-white shadow-lg'
                            : 'bg-red-600 border-red-300 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 border-slate-600 hover:border-yellow-400 text-yellow-300'
                      }`}
                    >
                      <span>🏁</span>
                      <span>{opt} {wordQuest.unit}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* VICTORY SCREEN (5/5 Complete) */
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 max-w-xl mx-auto space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-2xl border-4 border-white animate-bounce">
            <Trophy className="w-10 h-10 text-yellow-950 fill-yellow-900" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-black uppercase tracking-wider border border-yellow-400/40">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> CHIẾN THẮNG GRAND PRIX
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-['Be_Vietnam_Pro'] text-white">
              XUẤT SẮC! BÉ ĐÃ VỀ ĐÍCH HẠNG NHẤT!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Vượt qua cả 5 thử thách tính nhẩm cộng trừ xuất sắc, giành Cúp Vàng và Huy hiệu <strong>Tay Đua Cự Phách</strong>!
            </p>
          </div>

          <div className="bg-slate-800/90 rounded-2xl p-3 border border-yellow-400/40 flex items-center justify-around w-full">
            <div>
              <div className="text-[11px] font-bold text-slate-400">Điểm số</div>
              <div className="text-xl font-black text-emerald-400">5 / 5 Chặng</div>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div>
              <div className="text-[11px] font-bold text-slate-400">Thưởng sao</div>
              <div className="text-xl font-black text-amber-300">+25 ⭐</div>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div>
              <div className="text-[11px] font-bold text-slate-400">Tốc độ tối đa</div>
              <div className="text-xl font-black text-red-400">{speed} km/h</div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full pt-2">
            <button
              type="button"
              onClick={startNewGame}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>CHƠI LẠI</span>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>VỀ KHU VỰC 7</span>
            </button>
          </div>
        </div>
      )}
    </FullscreenStage>
  );
};
