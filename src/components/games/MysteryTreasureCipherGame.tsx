/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundService, soundEffects } from '../../services/audioService';
import confetti from 'canvas-confetti';
import { FullscreenStage } from '../common/FullscreenStage';
import {
  RotateCcw,
  Volume2,
  Key,
  Trophy,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Unlock,
  Check,
  Delete,
} from 'lucide-react';

interface MysteryTreasureCipherGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

export const MysteryTreasureCipherGame: React.FC<MysteryTreasureCipherGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [currentStage, setCurrentStage] = useState<number>(0); // 0 to 4 (5 stages)
  const [keysCollected, setKeysCollected] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [startTime] = useState(Date.now());

  // --- STAGE 1: HANG ĐỘNG PHÉP TÍNH (GEM SELECTION) ---
  interface CaveQuestion {
    expr: string;
    ans: number;
    options: number[];
  }
  const [caveQuest, setCaveQuest] = useState<CaveQuestion>({
    expr: '34 + 25',
    ans: 59,
    options: [59, 49, 69, 58],
  });

  // --- STAGE 2: CÁNH CỬA BÍ MẬT (MISSING NUMBER KEYPAD) ---
  interface SecretDoorQuestion {
    prompt: string;
    missingAns: number;
    leftPart: string;
    rightPart: string;
    operator: string;
  }
  const [doorQuest, setDoorQuest] = useState<SecretDoorQuestion>({
    prompt: '46 - □ = 23',
    missingAns: 23,
    leftPart: '46',
    rightPart: '23',
    operator: '-',
  });
  const [doorInput, setDoorInput] = useState<string>('');

  // --- STAGE 3: BA CHIẾC RƯƠNG (3 EQUATIONS TO 3 CHESTS) ---
  interface ChestPair {
    id: string;
    expr: string;
    ans: number;
    matched: boolean;
  }
  const [chestPairs, setChestPairs] = useState<ChestPair[]>([]);
  const [selectedExprId, setSelectedExprId] = useState<string | null>(null);
  const [selectedChestVal, setSelectedChestVal] = useState<number | null>(null);

  // --- STAGE 4: BẢN ĐỒ BỊ LỖI (FIND & FIX ERROR) ---
  interface MapEquation {
    id: string;
    expr: string;
    displayedResult: number;
    correctResult: number;
    isWrong: boolean;
  }
  const [mapEquations, setMapEquations] = useState<MapEquation[]>([]);
  const [selectedWrongId, setSelectedWrongId] = useState<string | null>(null);
  const [fixOptions, setFixOptions] = useState<number[]>([]);
  const [mapFixed, setMapFixed] = useState<boolean>(false);

  // --- STAGE 5: MẬT MÃ KHO BÁU (3 COMBINATION LOCK CIPHERS) ---
  interface LockCipher {
    exprA: string;
    ansA: number;
    exprB: string;
    ansB: number;
    exprC: string;
    ansC: number;
  }
  const [lockCipher, setLockCipher] = useState<LockCipher>({
    exprA: '2 + 3',
    ansA: 5,
    exprB: '9 - 7',
    ansB: 2,
    exprC: '4 + 4',
    ansC: 8,
  });
  const [enteredA, setEnteredA] = useState<string>('');
  const [enteredB, setEnteredB] = useState<string>('');
  const [enteredC, setEnteredC] = useState<string>('');

  // Initializers
  const initStage1 = () => {
    // 2-digit addition without carry
    const tensA = Math.floor(Math.random() * 4) + 2; // 2..5
    const tensB = Math.floor(Math.random() * 3) + 1; // 1..3
    const onesA = Math.floor(Math.random() * 4) + 1; // 1..4
    const onesB = Math.floor(Math.random() * 4) + 1; // 1..4
    const a = tensA * 10 + onesA;
    const b = tensB * 10 + onesB;
    const sum = a + b;
    const distractors = [sum + 10, sum - 10, sum + 1, sum - 1].filter((v) => v !== sum);
    const opts = [sum, distractors[0], distractors[1], distractors[2]].sort(() => Math.random() - 0.5);

    setCaveQuest({
      expr: `${a} + ${b}`,
      ans: sum,
      options: opts,
    });
  };

  const initStage2 = () => {
    // 46 - □ = 23 -> missing = 46 - 23 = 23
    const tensA = Math.floor(Math.random() * 4) + 4; // 4..7
    const tensB = Math.floor(Math.random() * 3) + 1; // 1..3
    const onesA = Math.floor(Math.random() * 4) + 5; // 5..8
    const onesB = Math.floor(Math.random() * 4) + 1; // 1..4
    const a = tensA * 10 + onesA;
    const b = tensB * 10 + onesB;
    const diff = a - b;

    setDoorQuest({
      prompt: `${a} - □ = ${diff}`,
      missingAns: b,
      leftPart: `${a}`,
      rightPart: `${diff}`,
      operator: '-',
    });
    setDoorInput('');
  };

  const initStage3 = () => {
    // 3 distinct equations with distinct results
    const pool = [
      { id: 'c1', expr: '21 + 13', ans: 34, matched: false },
      { id: 'c2', expr: '58 - 25', ans: 33, matched: false },
      { id: 'c3', expr: '42 + 35', ans: 77, matched: false },
      { id: 'c4', expr: '65 - 14', ans: 51, matched: false },
      { id: 'c5', expr: '32 + 26', ans: 58, matched: false },
      { id: 'c6', expr: '79 - 34', ans: 45, matched: false },
    ].sort(() => Math.random() - 0.5).slice(0, 3);

    setChestPairs(pool);
    setSelectedExprId(null);
    setSelectedChestVal(null);
  };

  const initStage4 = () => {
    // 3 equations, 1 wrong
    const eq1 = { id: 'eq1', expr: '43 + 12', displayedResult: 55, correctResult: 55, isWrong: false };
    const eq2 = { id: 'eq2', expr: '67 - 25', displayedResult: 40, correctResult: 42, isWrong: true };
    const eq3 = { id: 'eq3', expr: '31 + 45', displayedResult: 76, correctResult: 76, isWrong: false };

    const shuffled = [eq1, eq2, eq3].sort(() => Math.random() - 0.5);
    setMapEquations(shuffled);
    setSelectedWrongId(null);
    setFixOptions([42, 45, 52].sort(() => Math.random() - 0.5));
    setMapFixed(false);
  };

  const initStage5 = () => {
    setLockCipher({
      exprA: '2 + 3',
      ansA: 5,
      exprB: '9 - 7',
      ansB: 2,
      exprC: '4 + 4',
      ansC: 8,
    });
    setEnteredA('');
    setEnteredB('');
    setEnteredC('');
  };

  const startNewGame = () => {
    setCurrentStage(0);
    setKeysCollected(0);
    setFeedback(null);
    setIsCompleted(false);
    initStage1();
    initStage2();
    initStage3();
    initStage4();
    initStage5();
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleStageSuccess = (msg: string) => {
    soundEffects.correct();
    setKeysCollected((prev) => Math.min(5, prev + 1));
    setFeedback(msg);

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#f59e0b', '#fbbf24', '#10b981', '#3b82f6'],
    });

    setTimeout(() => {
      setFeedback(null);
      if (currentStage < 4) {
        setCurrentStage((prev) => prev + 1);
      } else {
        // Complete all 5 challenges - Open Treasure Chest!
        setIsCompleted(true);
        soundEffects.celebrate();
        confetti({
          particleCount: 160,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#f97316', '#38bdf8', '#8b5cf6'],
        });

        StorageService.recordActivity(student.id, {
          type: 'game',
          targetId: 'treasure-cipher',
          targetName: 'Giải Mã Kho Báu Bí Ẩn',
          score: 5,
          totalQuestions: 5,
          starsEarned: 25,
          timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
        });

        const updated = StorageService.getCurrentStudent();
        if (updated) onUpdateStudent(updated);
      }
    }, 1200);
  };

  // HANDLER: STAGE 1 (GEMS)
  const handleSelectGem = (val: number) => {
    soundService.playClick();
    if (val === caveQuest.ans) {
      handleStageSuccess('CHÍNH XÁC! Viên ngọc phát sáng rực rỡ, bé đã tìm được Chìa Khóa Vàng số 1!');
    } else {
      soundEffects.wrong();
      setFeedback('Chưa đúng viên ngọc rồi! Bé hãy cộng hàng đơn vị trước rồi cộng hàng chục nhé!');
    }
  };

  // HANDLER: STAGE 2 (DOOR KEYPAD)
  const handleKeypadPress = (digit: string) => {
    soundService.playClick();
    if (doorInput.length < 2) {
      setDoorInput((prev) => prev + digit);
    }
  };

  const handleKeypadDelete = () => {
    soundService.playClick();
    setDoorInput((prev) => prev.slice(0, -1));
  };

  const handleSubmitDoor = () => {
    soundService.playClick();
    const val = parseInt(doorInput, 10);
    if (val === doorQuest.missingAns) {
      handleStageSuccess('XUẤT SẮC! Cánh cửa đá cổ xưa đã mở rộng, nhận Chìa Khóa Vàng số 2!');
    } else {
      soundEffects.wrong();
      setFeedback(`Chưa đúng rồi! Bé lấy ${doorQuest.leftPart} trừ ${doorQuest.rightPart} để tìm số cần điền nhé!`);
      setDoorInput('');
    }
  };

  // HANDLER: STAGE 3 (CHEST MATCHING)
  const handleSelectExpr = (id: string) => {
    soundService.playClick();
    setSelectedExprId(id);

    if (selectedChestVal !== null) {
      checkPairMatch(id, selectedChestVal);
    }
  };

  const handleSelectChest = (ans: number) => {
    soundService.playClick();
    setSelectedChestVal(ans);

    if (selectedExprId !== null) {
      checkPairMatch(selectedExprId, ans);
    }
  };

  const checkPairMatch = (exprId: string, chestVal: number) => {
    const pair = chestPairs.find((p) => p.id === exprId);
    if (pair && pair.ans === chestVal) {
      soundEffects.correct();
      const updated = chestPairs.map((p) => (p.id === exprId ? { ...p, matched: true } : p));
      setChestPairs(updated);
      setSelectedExprId(null);
      setSelectedChestVal(null);

      if (updated.every((p) => p.matched)) {
        handleStageSuccess('TUYỆT VỜI! Ghép đúng cả 3 chiếc rương, nhận Chìa Khóa Vàng số 3!');
      }
    } else {
      soundEffects.wrong();
      setFeedback('Chưa đúng kết quả của rương này! Bé hãy tính lại thật cẩn thận nhé!');
      setTimeout(() => {
        setSelectedExprId(null);
        setSelectedChestVal(null);
      }, 500);
    }
  };

  // HANDLER: STAGE 4 (MAP ERROR)
  const handleSelectMapEq = (eq: MapEquation) => {
    soundService.playClick();
    if (eq.isWrong) {
      setSelectedWrongId(eq.id);
      soundEffects.correct();
      setFeedback('Chính xác! Đây là phép tính bị sai. Bé hãy chọn kết quả đúng bên dưới để sửa bản đồ!');
    } else {
      soundEffects.wrong();
      setFeedback('Phép tính này tính đúng rồi, không có lỗi sai! Bé hãy kiểm tra phép tính khác nhé!');
    }
  };

  const handleFixResult = (val: number) => {
    soundService.playClick();
    const wrongEq = mapEquations.find((e) => e.isWrong);
    if (wrongEq && val === wrongEq.correctResult) {
      setMapFixed(true);
      handleStageSuccess('QUÁ ĐỈNH! Bản đồ kho báu đã được sửa chữa chuẩn xác, nhận Chìa Khóa Vàng số 4!');
    } else {
      soundEffects.wrong();
      setFeedback('Chưa đúng kết quả sửa! 67 - 25 bằng mấy bé ơi?');
    }
  };

  // HANDLER: STAGE 5 (LOCK CIPHER)
  const handleOpenChest = () => {
    soundService.playClick();
    const a = parseInt(enteredA, 10);
    const b = parseInt(enteredB, 10);
    const c = parseInt(enteredC, 10);

    if (a === lockCipher.ansA && b === lockCipher.ansB && c === lockCipher.ansC) {
      handleStageSuccess('CHIẾN THẮNG NGOẠN MỤC! Mật mã 5-2-8 chính xác! Rương kho báu đã bật mở!');
    } else {
      soundEffects.wrong();
      setFeedback('Mật mã chưa khớp! Bé hãy kiểm tra lại từng phép tính: 2+3, 9-7 và 4+4 nhé!');
    }
  };


  const readPrompt = (text: string) => {
    soundService.speak(text);
  };

  return (
    <FullscreenStage
      titleVi="GIẢI MÃ KHO BÁU BÍ ẨN"
      titleEn="Mystery Treasure Decoder"
      categoryBadge="Khu 8 – Đảo Kho Báu Toán Học"
      onBack={onBack}
      topRightControls={
        <div className="flex items-center gap-2 font-['Be_Vietnam_Pro']">
          {/* Key Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 font-black text-xs shadow-2xs">
            <Key className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>{keysCollected}/5 Chìa khóa</span>
          </div>

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
    >
      <div className="w-full h-full flex flex-col bg-gradient-to-b from-amber-600 via-orange-600 to-amber-800 text-white select-none overflow-hidden relative font-['Be_Vietnam_Pro']">
        {/* Background Sparkles & Treasure Map Island Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* 2. MAIN CIPHER ARENA (16:9 Zero-Scroll Layout) */}
        <main className="flex-1 flex flex-col justify-between p-3 sm:p-5 relative z-10 max-w-6xl w-full mx-auto overflow-hidden">
          {/* Progress Key Lap Bar */}
          <div className="w-full bg-black/30 backdrop-blur-xs rounded-full p-1 border border-amber-400/30 flex items-center justify-between gap-1 shadow-sm shrink-0 mb-2">
            {[
              { id: 0, label: '1. Hang động ngọc' },
              { id: 1, label: '2. Cửa bí mật' },
              { id: 2, label: '3. Ba chiếc rương' },
              { id: 3, label: '4. Bản đồ bị lỗi' },
              { id: 4, label: '5. Mật mã kho báu' },
            ].map((step) => {
              const isPast = currentStage > step.id;
              const isCurr = currentStage === step.id;
              return (
                <div
                  key={step.id}
                  className={`flex-1 py-1.5 px-2 rounded-full text-center transition-all flex items-center justify-center gap-1 text-[11px] font-black truncate ${
                    isPast
                      ? 'bg-emerald-500 text-white'
                      : isCurr
                      ? 'bg-gradient-to-r from-yellow-300 to-amber-400 text-slate-950 shadow-md ring-2 ring-white scale-102'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  <Key className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate hidden md:inline">{step.label}</span>
                  <span className="md:hidden">Ải {step.id + 1}</span>
                </div>
              );
            })}
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`p-2.5 rounded-2xl text-center text-xs sm:text-sm font-black border shadow-lg shrink-0 transition-all ${
                feedback.includes('CHÍNH XÁC') || feedback.includes('XUẤT SẮC') || feedback.includes('TUYỆT VỜI') || feedback.includes('QUÁ ĐỈNH') || feedback.includes('CHIẾN THẮNG')
                  ? 'bg-emerald-500/90 border-emerald-300 text-white'
                  : 'bg-amber-500/90 border-amber-300 text-slate-950'
              }`}
            >
              {feedback}
            </div>
          )}

          {/* CHALLENGE WORKSPACE CARDS */}
          <div className="flex-1 flex flex-col justify-center items-center my-auto w-full">
            {/* --- STAGE 1: HANG ĐỘNG PHÉP TÍNH --- */}
            {currentStage === 0 && (
              <div className="w-full max-w-4xl bg-white/95 text-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-yellow-400 flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500 text-white font-black text-xs px-2.5 py-1 rounded-full">
                      ẢI 1: HANG ĐỘNG PHÉP TÍNH
                    </span>
                    <h2 className="text-sm sm:text-base font-black text-slate-800">
                      Chọn viên ngọc thần chứa kết quả đúng
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      readPrompt(
                        langMode === 'en'
                          ? `Calculate ${caveQuest.expr} and select the correct glowing gem!`
                          : `Tính ${caveQuest.expr} và chọn viên ngọc có kết quả đúng!`
                      )
                    }
                    className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full transition-all cursor-pointer"
                    title="Nghe câu hỏi"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 rounded-2xl p-4 w-full text-center mb-5 shadow-xs">
                  <span className="text-3xl sm:text-5xl font-black text-amber-950 tracking-wider">
                    {caveQuest.expr} = ?
                  </span>
                  <p className="text-xs text-amber-700 font-bold mt-2">
                    {langMode === 'en'
                      ? 'Tap the matching gemstone to unlock Key #1'
                      : 'Chạm chọn viên ngọc có kết quả đúng để nhận Chìa Khóa 1!'}
                  </p>
                </div>

                {/* 4 Sparkling Gem Options */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 w-full">
                  {caveQuest.options.map((val, idx) => {
                    const gemGradients = [
                      'from-red-400 to-rose-600 border-red-300 text-white',
                      'from-blue-400 to-indigo-600 border-blue-300 text-white',
                      'from-emerald-400 to-teal-600 border-emerald-300 text-white',
                      'from-amber-400 to-yellow-600 border-amber-300 text-slate-950',
                    ];
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectGem(val)}
                        className={`bg-gradient-to-b ${gemGradients[idx % 4]} border-3 p-4 sm:p-5 rounded-3xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer`}
                      >
                        <span className="text-2xl">💎</span>
                        <span className="text-2xl sm:text-3xl font-black drop-shadow-sm">
                          {val}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                          Viên ngọc
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --- STAGE 2: CÁNH CỬA BÍ MẬT --- */}
            {currentStage === 1 && (
              <div className="w-full max-w-4xl bg-white/95 text-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-yellow-400 flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500 text-white font-black text-xs px-2.5 py-1 rounded-full">
                      ẢI 2: CÁNH CỬA BÍ MẬT
                    </span>
                    <h2 className="text-sm sm:text-base font-black text-slate-800">
                      Tìm số còn thiếu trong phép tính và bấm mở cửa
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      readPrompt(
                        langMode === 'en'
                          ? `Find the missing number: ${doorQuest.prompt}`
                          : `Tìm số còn thiếu: ${doorQuest.prompt}`
                      )
                    }
                    className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full transition-all cursor-pointer"
                    title="Nghe câu hỏi"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full my-2">
                  {/* Equation Display Board */}
                  <div className="flex-1 flex flex-col items-center justify-center p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 shadow-xs text-center w-full">
                    <span className="text-xs font-black text-amber-800 uppercase tracking-wider mb-2">
                      Mật mã khắc trên cửa đá
                    </span>
                    <div className="flex items-center justify-center gap-2 text-3xl sm:text-4xl font-black text-slate-800">
                      <span>{doorQuest.leftPart}</span>
                      <span className="text-amber-600 font-extrabold">{doorQuest.operator}</span>
                      <span className="min-w-[70px] px-3 py-1.5 rounded-xl border-3 border-dashed border-amber-500 bg-white text-blue-700 shadow-inner">
                        {doorInput !== '' ? doorInput : '?'}
                      </span>
                      <span className="text-amber-600 font-extrabold">=</span>
                      <span>{doorQuest.rightPart}</span>
                    </div>

                    <p className="text-xs text-slate-600 font-bold mt-3">
                      Bé nhập số còn thiếu vào ô trống rồi bấm <strong>MỞ CỬA</strong>!
                    </p>
                  </div>

                  {/* Touch Keypad */}
                  <div className="flex flex-col items-center">
                    <div className="grid grid-cols-3 gap-2 w-52 sm:w-60">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => handleKeypadPress(`${d}`)}
                          className="py-2.5 rounded-xl bg-slate-100 hover:bg-amber-200 border-2 border-slate-200 hover:border-amber-400 font-black text-lg text-slate-800 shadow-xs active:scale-95 cursor-pointer"
                        >
                          {d}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={handleKeypadDelete}
                        className="py-2.5 rounded-xl bg-red-100 hover:bg-red-200 border-2 border-red-300 text-red-800 font-black text-sm flex items-center justify-center shadow-xs active:scale-95 cursor-pointer"
                        title="Xóa"
                      >
                        <Delete className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmitDoor}
                        disabled={doorInput === ''}
                        className={`col-span-1 py-2.5 rounded-xl font-black text-sm flex items-center justify-center shadow-md active:scale-95 cursor-pointer ${
                          doorInput !== ''
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- STAGE 3: BA CHIẾC RƯƠNG --- */}
            {currentStage === 2 && (
              <div className="w-full max-w-4xl bg-white/95 text-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-yellow-400 flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500 text-white font-black text-xs px-2.5 py-1 rounded-full">
                      ẢI 3: BA CHIẾC RƯƠNG
                    </span>
                    <h2 className="text-sm sm:text-base font-black text-slate-800">
                      Chạm chọn 1 phép tính rồi chạm vào chiếc rương có kết quả tương ứng
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      readPrompt('Ghép từng phép tính với chiếc rương mang kết quả chính xác!')
                    }
                    className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full transition-all cursor-pointer"
                    title="Nghe câu hỏi"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full my-2">
                  {/* Equations List */}
                  <div className="space-y-3">
                    <span className="text-xs font-black text-amber-900 uppercase tracking-wider block text-center">
                      1. Chọn Thẻ Phép Tính
                    </span>
                    {chestPairs.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        disabled={p.matched}
                        onClick={() => handleSelectExpr(p.id)}
                        className={`w-full p-4 rounded-2xl border-3 font-black text-xl flex items-center justify-between transition-all ${
                          p.matched
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-60'
                            : selectedExprId === p.id
                            ? 'bg-amber-300 border-amber-500 text-slate-950 scale-102 shadow-md ring-4 ring-amber-200'
                            : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-slate-800 cursor-pointer shadow-xs active:scale-95'
                        }`}
                      >
                        <span>{p.expr}</span>
                        {p.matched ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <span className="text-xs bg-amber-200 text-amber-900 px-2 py-1 rounded-md font-bold">
                            Chạm chọn
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Treasure Chests List */}
                  <div className="space-y-3">
                    <span className="text-xs font-black text-amber-900 uppercase tracking-wider block text-center">
                      2. Chọn Chiếc Rương Kết Quả
                    </span>
                    {chestPairs.map((p) => (
                      <button
                        key={`chest-${p.ans}`}
                        type="button"
                        disabled={p.matched}
                        onClick={() => handleSelectChest(p.ans)}
                        className={`w-full p-3.5 rounded-2xl border-3 font-black text-xl flex items-center justify-between transition-all ${
                          p.matched
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-60'
                            : selectedChestVal === p.ans
                            ? 'bg-amber-300 border-amber-500 text-slate-950 scale-102 shadow-md ring-4 ring-amber-200'
                            : 'bg-gradient-to-r from-amber-100 to-yellow-100 hover:from-amber-200 hover:to-yellow-200 border-amber-300 text-slate-900 cursor-pointer shadow-xs active:scale-95'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📦</span>
                          <span>Rương số {p.ans}</span>
                        </div>
                        {p.matched ? (
                          <span className="text-xs bg-emerald-200 text-emerald-900 px-2 py-1 rounded-md font-bold">
                            Đã mở
                          </span>
                        ) : (
                          <span className="text-xs bg-amber-200 text-amber-900 px-2 py-1 rounded-md font-bold">
                            Khớp rương
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* --- STAGE 4: BẢN ĐỒ BỊ LỖI --- */}
            {currentStage === 3 && (
              <div className="w-full max-w-4xl bg-white/95 text-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-yellow-400 flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500 text-white font-black text-xs px-2.5 py-1 rounded-full">
                      ẢI 4: BẢN ĐỒ BỊ LỖI
                    </span>
                    <h2 className="text-sm sm:text-base font-black text-slate-800">
                      Tìm phép tính sai trên bản đồ và sửa lại kết quả
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      readPrompt(
                        'Quan sát 3 phép tính trên bản đồ, tìm phép tính sai và chọn kết quả đúng để sửa!'
                      )
                    }
                    className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full transition-all cursor-pointer"
                    title="Nghe câu hỏi"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* 3 Map Equations */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-4">
                  {mapEquations.map((eq) => {
                    const isSelected = selectedWrongId === eq.id;
                    return (
                      <button
                        key={eq.id}
                        type="button"
                        onClick={() => handleSelectMapEq(eq)}
                        className={`p-4 rounded-2xl border-3 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-red-50 border-red-500 ring-4 ring-red-200 scale-102'
                            : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-slate-800 active:scale-95'
                        }`}
                      >
                        <span className="text-xl sm:text-2xl font-black">
                          {eq.expr} ={' '}
                          {mapFixed && eq.isWrong ? (
                            <span className="text-emerald-600 font-extrabold underline">
                              {eq.correctResult}
                            </span>
                          ) : (
                            <span className={isSelected ? 'text-red-600 line-through' : ''}>
                              {eq.displayedResult}
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">
                          {mapFixed && eq.isWrong ? 'Đã sửa đúng!' : 'Chạm để kiểm tra'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Fix Options (appears after identifying error) */}
                {selectedWrongId && !mapFixed && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 w-full flex flex-col items-center animate-fadeIn">
                    <p className="text-xs sm:text-sm font-black text-amber-950 mb-3">
                      Sửa lại kết quả đúng cho phép tính <strong>67 - 25</strong>:
                    </p>
                    <div className="flex gap-4">
                      {fixOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleFixResult(opt)}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-b from-amber-200 to-orange-300 hover:from-yellow-300 hover:to-orange-400 border-2 border-orange-400 font-black text-xl text-slate-950 shadow-md active:scale-95 cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- STAGE 5: MẬT MÃ KHO BÁU --- */}
            {currentStage === 4 && (
              <div className="w-full max-w-4xl bg-white/95 text-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-yellow-400 flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500 text-white font-black text-xs px-2.5 py-1 rounded-full">
                      ẢI 5: MẬT MÃ KHO BÁU
                    </span>
                    <h2 className="text-sm sm:text-base font-black text-slate-800">
                      Tính 3 phép tính để tìm 3 chữ số mật mã mở rương báu
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      readPrompt(
                        'Tính 3 phép tính để tìm 3 chữ số mật mã, sau đó nhập đúng thứ tự để mở rương!'
                      )
                    }
                    className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full transition-all cursor-pointer"
                    title="Nghe câu hỏi"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-5">
                  {/* Cipher 1 */}
                  <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col items-center text-center">
                    <span className="text-xs font-bold text-amber-800">Số thứ nhất</span>
                    <span className="text-2xl font-black text-slate-800 my-1">{lockCipher.exprA} = ?</span>
                    <input
                      type="number"
                      maxLength={1}
                      value={enteredA}
                      onChange={(e) => setEnteredA(e.target.value.slice(-1))}
                      placeholder="?"
                      className="w-14 h-12 text-center text-2xl font-black rounded-xl border-2 border-amber-400 bg-white text-blue-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Cipher 2 */}
                  <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col items-center text-center">
                    <span className="text-xs font-bold text-amber-800">Số thứ hai</span>
                    <span className="text-2xl font-black text-slate-800 my-1">{lockCipher.exprB} = ?</span>
                    <input
                      type="number"
                      maxLength={1}
                      value={enteredB}
                      onChange={(e) => setEnteredB(e.target.value.slice(-1))}
                      placeholder="?"
                      className="w-14 h-12 text-center text-2xl font-black rounded-xl border-2 border-amber-400 bg-white text-blue-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Cipher 3 */}
                  <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col items-center text-center">
                    <span className="text-xs font-bold text-amber-800">Số thứ ba</span>
                    <span className="text-2xl font-black text-slate-800 my-1">{lockCipher.exprC} = ?</span>
                    <input
                      type="number"
                      maxLength={1}
                      value={enteredC}
                      onChange={(e) => setEnteredC(e.target.value.slice(-1))}
                      placeholder="?"
                      className="w-14 h-12 text-center text-2xl font-black rounded-xl border-2 border-amber-400 bg-white text-blue-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Big Unlock Button */}
                <button
                  type="button"
                  onClick={handleOpenChest}
                  disabled={enteredA === '' || enteredB === '' || enteredC === ''}
                  className={`w-full max-w-md py-4 rounded-2xl font-black text-base sm:text-lg shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                    enteredA !== '' && enteredB !== '' && enteredC !== ''
                      ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-slate-950 animate-pulse'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Unlock className="w-5 h-5" />
                  <span>MỞ RƯƠNG KHO BÁU 🏆</span>
                </button>
              </div>
            )}
          </div>

          {/* VICTORY MODAL OVERLAY */}
          {isCompleted && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-gradient-to-b from-amber-50 to-orange-100 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl border-4 border-yellow-400 animate-scaleIn text-slate-900">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 border-4 border-white shadow-xl flex items-center justify-center text-5xl mb-3 animate-bounce">
                  🏆
                </div>

                <span className="text-xs font-black text-amber-800 bg-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  HOÀN THÀNH XUẤT SẮC
                </span>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-1">
                  BẬC THẦY GIẢI MÃ KHO BÁU!
                </h2>

                <p className="text-xs sm:text-sm text-slate-700 font-medium mb-4">
                  Bé đã thu thập đủ 5 Chìa Khóa Vàng và mở toang rương báu trên Đảo Kho Báu!
                </p>

                <div className="bg-white rounded-2xl p-3.5 border-2 border-amber-200 shadow-sm flex items-center justify-around mb-5">
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">Chìa khóa</span>
                    <span className="text-xl font-black text-amber-600">5/5 🗝️</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">Sao thưởng</span>
                    <span className="text-xl font-black text-amber-600">+25 ⭐</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={startNewGame}
                    className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs sm:text-sm shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    CHƠI LẠI
                  </button>
                  <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    VỀ KHU VỰC 8
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </FullscreenStage>
  );
};
