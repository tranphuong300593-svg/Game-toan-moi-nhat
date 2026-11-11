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
  ArrowLeft,
  RotateCcw,
  Volume2,
  Sparkles,
  Zap,
  CheckCircle2,
  Award,
  Star,
  Trophy,
  Flag,
  Clock,
  Ruler,
  Shapes,
  Boxes,
} from 'lucide-react';

interface ComprehensiveRaceTrackGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

// 5 Comprehensive Challenges
type StageType =
  | 'geometry_signs' // Thử thách 1: Biển báo hình học đường đua
  | 'measure_ruler' // Thử thách 2: Đo độ dài thanh chắn bằng thước cm
  | 'clock_time' // Thử thách 3: Xem giờ xuất phát trên đồng hồ kim
  | 'tens_ones_pairs' // Thử thách 4: Ghép đôi cấu tạo số Chục và Đơn vị
  | 'word_problem'; // Thử thách 5: Bài toán lời văn tổng hợp về đích

export const ComprehensiveRaceTrackGame: React.FC<ComprehensiveRaceTrackGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [currentStage, setCurrentStage] = useState<number>(0); // 0 to 4
  const [speed, setSpeed] = useState<number>(70); // km/h
  const [isNitro, setIsNitro] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [startTime] = useState(Date.now());

  // --- STAGE 1: SO SÁNH SỐ TRONG PHẠM VI 100 ---
  interface CompareQuestion {
    promptVi: string;
    promptEn: string;
    options: number[];
    ans: number;
  }
  const [compareQuest, setCompareQuest] = useState<CompareQuestion>({
    promptVi: 'Số nào lớn nhất?',
    promptEn: 'Which number is the greatest?',
    options: [45, 54, 49],
    ans: 54,
  });

  // --- STAGE 2: PHÉP CỘNG HAI SỐ CÓ HAI CHỮ SỐ KHÔNG NHỚ ---
  interface AdditionQuestion {
    promptVi: string;
    promptEn: string;
    options: number[];
    ans: number;
  }
  const [additionQuest, setAdditionQuest] = useState<AdditionQuestion>({
    promptVi: '32 + 15 = ?',
    promptEn: '32 + 15 = ?',
    options: [37, 47, 57],
    ans: 47,
  });
  const [selectedAddAns, setSelectedAddAns] = useState<number | null>(null);

  // --- STAGE 3: CLOCK TIME ---
  interface ClockQuestion {
    hour: number;
    options: number[];
  }
  const [clockQuest, setClockQuest] = useState<ClockQuestion>({
    hour: 3,
    options: [2, 3, 4],
  });

  // --- STAGE 4: TENS & ONES PAIRS ---
  interface PairItem {
    id: string;
    text: string;
    val: number;
    matched: boolean;
  }
  const [tensPairs, setTensPairs] = useState<{
    leftItems: PairItem[];
    rightItems: PairItem[];
  }>({ leftItems: [], rightItems: [] });
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  // --- STAGE 5: WORD PROBLEM ---
  interface WordQuest {
    storyVi: string;
    storyEn: string;
    questionVi: string;
    questionEn: string;
    options: number[];
    ans: number;
    unit: string;
  }
  const [wordQuest, setWordQuest] = useState<WordQuest | null>(null);
  const [selectedWordAns, setSelectedWordAns] = useState<number | null>(null);

  // Initialize stage questions
  const initStage1 = () => {
    setCompareQuest({
      promptVi: 'Số nào lớn nhất?',
      promptEn: 'Which number is the greatest?',
      options: [45, 54, 49],
      ans: 54,
    });
  };

  const initStage2 = () => {
    setAdditionQuest({
      promptVi: '32 + 15 = ?',
      promptEn: '32 + 15 = ?',
      options: [37, 47, 57],
      ans: 47,
    });
    setSelectedAddAns(null);
  };

  const initStage3 = () => {
    // 3 giờ đúng: kim ngắn chỉ số 3, kim dài chỉ số 12
    setClockQuest({
      hour: 3,
      options: [2, 3, 4],
    });
  };

  const initStage4 = () => {
    // 3 distinct tens & ones pairs
    const pool = [
      { tens: 4, ones: 3, val: 43 },
      { tens: 5, ones: 6, val: 56 },
      { tens: 7, ones: 2, val: 72 },
      { tens: 8, ones: 5, val: 85 },
      { tens: 6, ones: 0, val: 60 },
      { tens: 9, ones: 4, val: 94 },
      { tens: 3, ones: 8, val: 38 },
      { tens: 6, ones: 7, val: 67 },
    ].sort(() => Math.random() - 0.5).slice(0, 3);

    const left = pool.map((p, idx) => ({
      id: `l-${idx}`,
      text: `${p.tens} chục và ${p.ones} đơn vị`,
      val: p.val,
      matched: false,
    }));

    const right = [...pool].sort(() => Math.random() - 0.5).map((p, idx) => ({
      id: `r-${idx}`,
      text: `${p.val}`,
      val: p.val,
      matched: false,
    }));

    setTensPairs({ leftItems: left, rightItems: right });
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const initStage5 = () => {
    const isAdd = Math.random() > 0.5;
    if (isAdd) {
      // 2-digit addition without carry
      const tensA = Math.floor(Math.random() * 4) + 2; // 2 to 5
      const tensB = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const onesA = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const onesB = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const a = tensA * 10 + onesA;
      const b = tensB * 10 + onesB;
      const sum = a + b;
      const opts = [sum, sum + 10, Math.max(10, sum - 10), sum + 2]
        .filter((v, idx, arr) => arr.indexOf(v) === idx)
        .sort(() => Math.random() - 0.5);

      setWordQuest({
        storyVi: `Đoàn xe xuất phát có ${a} chiếc ô tô đua, đến khúc cua thứ nhất có thêm ${b} chiếc nữa cùng gia nhập.`,
        storyEn: `The race began with ${a} cars, and ${b} more cars joined at the first curve.`,
        questionVi: 'Hỏi đoàn đua có tất cả bao nhiêu chiếc ô tô đua?',
        questionEn: 'How many racing cars are there in total?',
        options: opts,
        ans: sum,
        unit: 'chiếc xe',
      });
    } else {
      // 2-digit subtraction without borrow
      const tensA = Math.floor(Math.random() * 4) + 5; // 5 to 8
      const tensB = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const onesA = Math.floor(Math.random() * 4) + 5; // 5 to 8
      const onesB = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const a = tensA * 10 + onesA;
      const b = tensB * 10 + onesB;
      const diff = a - b;
      const opts = [diff, diff + 10, Math.max(10, diff - 10), diff + 1]
        .filter((v, idx, arr) => arr.indexOf(v) === idx)
        .sort(() => Math.random() - 0.5);

      setWordQuest({
        storyVi: `Cuộc đua lớn có ${a} chiếc xe tranh tài, đã có ${b} chiếc xe xuất sắc hoàn thành và về đích.`,
        storyEn: `There were ${a} cars competing, and ${b} cars have successfully finished the race.`,
        questionVi: 'Hỏi còn lại bao nhiêu chiếc xe đang tiếp tục thi đấu trên đường đua?',
        questionEn: 'How many cars are still racing on the track?',
        options: opts,
        ans: diff,
        unit: 'chiếc xe',
      });
    }
    setSelectedWordAns(null);
  };

  const startNewGame = () => {
    setCurrentStage(0);
    setSpeed(70);
    setIsNitro(false);
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

  const handleStageSuccess = (successMsg: string) => {
    soundEffects.correct();
    setSpeed((prev) => Math.min(180, prev + 25));
    setIsNitro(true);
    setFeedback(successMsg);

    confetti({
      particleCount: 35,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#ea580c', '#f59e0b', '#3b82f6', '#10b981'],
    });

    setTimeout(() => {
      setIsNitro(false);
      setFeedback(null);
      if (currentStage < 4) {
        setCurrentStage((prev) => prev + 1);
      } else {
        // GRAND PRIX CHAMPION VICTORY!
        setIsCompleted(true);
        soundEffects.celebrate();
        confetti({
          particleCount: 160,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#ea580c', '#f97316', '#fbbf24', '#38bdf8', '#8b5cf6'],
        });

        StorageService.recordActivity(student.id, {
          type: 'game',
          targetId: 'duong-dua-tong-hop',
          targetName: 'Đường Đua Toán Học Tổng Hợp',
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

  // --- HANDLER: STAGE 1 (COMPARE NUMBERS <= 100) ---
  const handleSelectCompare = (val: number) => {
    soundService.playClick();
    if (val === compareQuest.ans) {
      handleStageSuccess('CHÍNH XÁC! 54 là số lớn nhất trong các số 45, 54, 49. Xe tăng tốc bứt phá!');
    } else {
      soundEffects.wrong();
      setSpeed(45);
      setFeedback('Chưa đúng rồi! Bé hãy so sánh số chục trước nhé: 4 chục và 5 chục!');
    }
  };

  // --- HANDLER: STAGE 2 (ADDITION 2-DIGIT) ---
  const handleSelectAddition = (val: number) => {
    soundService.playClick();
    setSelectedAddAns(val);
    if (val === additionQuest.ans) {
      handleStageSuccess('XUẤT SẮC! 32 + 15 = 47. Bé tính rất chuẩn, động cơ bốc hỏa vọt lên!');
    } else {
      soundEffects.wrong();
      setSpeed(45);
      setFeedback('Chưa đúng rồi! Bé hãy cộng hàng đơn vị trước: 2 + 5 = 7, sau đó cộng hàng chục: 3 + 1 = 4 nhé!');
    }
  };

  // --- HANDLER: STAGE 3 (CLOCK) ---
  const handleSelectClock = (val: number) => {
    soundService.playClick();
    if (val === clockQuest.hour) {
      handleStageSuccess('TUYỆT VỜI! Kim ngắn chỉ số 3, kim dài chỉ số 12 là đúng 3 giờ!');
    } else {
      soundEffects.wrong();
      setSpeed(45);
      setFeedback('Chưa đúng giờ! Kim ngắn màu đỏ đang chỉ số mấy bé ơi?');
    }
  };

  // --- HANDLER: STAGE 4 (TENS & ONES PAIRING) ---
  const handleSelectTensLeft = (item: PairItem) => {
    if (item.matched) return;
    soundService.playClick();
    setSelectedLeft(item.id);

    if (selectedRight) {
      const rightObj = tensPairs.rightItems.find((r) => r.id === selectedRight);
      if (rightObj && item.val === rightObj.val) {
        // MATCH!
        soundEffects.correct();
        const newLeft = tensPairs.leftItems.map((l) => (l.id === item.id ? { ...l, matched: true } : l));
        const newRight = tensPairs.rightItems.map((r) => (r.id === rightObj.id ? { ...r, matched: true } : r));
        setTensPairs({ leftItems: newLeft, rightItems: newRight });
        setSelectedLeft(null);
        setSelectedRight(null);

        if (newLeft.every((l) => l.matched)) {
          handleStageSuccess('QUÁ ĐỈNH! Bé ghép đúng cấu tạo số Chục và Đơn vị rất nhanh!');
        }
      } else {
        soundEffects.wrong();
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 500);
      }
    }
  };

  const handleSelectTensRight = (item: PairItem) => {
    if (item.matched) return;
    soundService.playClick();
    setSelectedRight(item.id);

    if (selectedLeft) {
      const leftObj = tensPairs.leftItems.find((l) => l.id === selectedLeft);
      if (leftObj && item.val === leftObj.val) {
        // MATCH!
        soundEffects.correct();
        const newLeft = tensPairs.leftItems.map((l) => (l.id === leftObj.id ? { ...l, matched: true } : l));
        const newRight = tensPairs.rightItems.map((r) => (r.id === item.id ? { ...r, matched: true } : r));
        setTensPairs({ leftItems: newLeft, rightItems: newRight });
        setSelectedLeft(null);
        setSelectedRight(null);

        if (newLeft.every((l) => l.matched)) {
          handleStageSuccess('QUÁ ĐỈNH! Bé ghép đúng cấu tạo số Chục và Đơn vị rất nhanh!');
        }
      } else {
        soundEffects.wrong();
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 500);
      }
    }
  };

  // --- HANDLER: STAGE 5 (WORD PROBLEM) ---
  const handleSelectWordAns = (ans: number) => {
    soundService.playClick();
    setSelectedWordAns(ans);
    if (wordQuest && ans === wordQuest.ans) {
      handleStageSuccess('CÁN ĐÍCH NGOẠN MỤC! Bé giải bài toán có lời văn chính xác tuyệt đối!');
    } else {
      soundEffects.wrong();
      setSpeed(45);
      setFeedback('Chưa đúng kết quả! Bé hãy đọc kỹ đề và tính lại nhé!');
    }
  };


  const readPrompt = (text: string) => {
    soundService.speak(text);
  };

  // Precision SVG Analog Clock renderer for Grade 1
  const renderAnalogClock = (hour: number) => {
    // 12 clock numbers positioned evenly around the dial at radius 68
    const dialNumbers = [
      { num: 12, angle: 0 },
      { num: 1, angle: 30 },
      { num: 2, angle: 60 },
      { num: 3, angle: 90 },
      { num: 4, angle: 120 },
      { num: 5, angle: 150 },
      { num: 6, angle: 180 },
      { num: 7, angle: 210 },
      { num: 8, angle: 240 },
      { num: 9, angle: 270 },
      { num: 10, angle: 300 },
      { num: 11, angle: 330 },
    ];

    // Angle calculation for 3 o'clock
    const hourAngle = (hour % 12) * 30; // 90 degrees for 3
    const minuteAngle = 0; // 0 degrees pointing to 12

    // Minute hand (Blue): stops 20px before number 12 (length 48px from center 100, 100)
    const minRad = (minuteAngle * Math.PI) / 180;
    const minLen = 48;
    const minX = 100 + minLen * Math.sin(minRad);
    const minY = 100 - minLen * Math.cos(minRad);

    // Hour hand (Red): stays strictly within inner region (length 34px from center 100, 100)
    const hourRad = (hourAngle * Math.PI) / 180;
    const hourLen = 34;
    const hourX = 100 + hourLen * Math.sin(hourRad);
    const hourY = 100 - hourLen * Math.cos(hourRad);

    return (
      <div className="flex flex-col items-center">
        <svg
          viewBox="0 0 200 200"
          className="w-44 h-44 sm:w-52 sm:h-52 drop-shadow-xl select-none"
        >
          <defs>
            {/* Outer Rim Gradient */}
            <linearGradient id="clockRimGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
            {/* Face Gradient */}
            <radialGradient id="clockFaceGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="85%" stopColor="#fffbeb" />
              <stop offset="100%" stopColor="#fed7aa" />
            </radialGradient>
          </defs>

          {/* Outer Bezel */}
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="url(#clockRimGrad)"
            stroke="#7c2d12"
            strokeWidth="3"
          />

          {/* Clock Dial Face */}
          <circle
            cx="100"
            cy="100"
            r="87"
            fill="url(#clockFaceGrad)"
            stroke="#ea580c"
            strokeWidth="2"
          />

          {/* Inner Decorative Ring */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#fdba74"
            strokeWidth="1"
            strokeDasharray="2,2"
          />

          {/* 60 Minute Tick Marks (subtle ticks on outer rim) */}
          {Array.from({ length: 60 }).map((_, i) => {
            const isHourTick = i % 5 === 0;
            const tickAngle = (i * 6 * Math.PI) / 180;
            const rInner = isHourTick ? 81 : 83;
            const rOuter = 85;
            const x1 = 100 + rInner * Math.sin(tickAngle);
            const y1 = 100 - rInner * Math.cos(tickAngle);
            const x2 = 100 + rOuter * Math.sin(tickAngle);
            const y2 = 100 - rOuter * Math.cos(tickAngle);
            return (
              <line
                key={`tick-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isHourTick ? '#c2410c' : '#fdba74'}
                strokeWidth={isHourTick ? 2 : 1}
                strokeLinecap="round"
              />
            );
          })}

          {/* 12 Clear Dial Numbers (positioned at r=68, completely clear of hands) */}
          {dialNumbers.map(({ num, angle }) => {
            const rad = (angle * Math.PI) / 180;
            const x = 100 + 68 * Math.sin(rad);
            const y = 100 - 68 * Math.cos(rad);
            const isCardinal = num === 12 || num === 3 || num === 6 || num === 9;
            return (
              <text
                key={`num-${num}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isCardinal ? '15' : '13'}
                fontWeight={isCardinal ? '900' : '800'}
                fill={isCardinal ? '#9a3412' : '#334155'}
                fontFamily="sans-serif"
              >
                {num}
              </text>
            );
          })}

          {/* Minute Hand (Blue): Points at 12, stops safely before number 12 */}
          <line
            x1="100"
            y1={100 + 8}
            x2={minX}
            y2={minY}
            stroke="#2563eb"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Minute Hand Arrowhead/Tip Accent */}
          <circle cx={minX} cy={minY} r="3" fill="#1d4ed8" />

          {/* Hour Hand (Red): Points at 3, stays compact in inner circle, stops far before 3 */}
          <line
            x1={100 - 6 * Math.sin(hourRad)}
            y1={100 + 6 * Math.cos(hourRad)}
            x2={hourX}
            y2={hourY}
            stroke="#dc2626"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          {/* Hour Hand Tip Accent */}
          <circle cx={hourX} cy={hourY} r="3.5" fill="#b91c1c" />

          {/* Center Compact Pivot: Never touches or obscures any numbers */}
          <circle
            cx="100"
            cy="100"
            r="6"
            fill="#b91c1c"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <circle
            cx="100"
            cy="100"
            r="2.5"
            fill="#fef08a"
          />
        </svg>
      </div>
    );
  };

  return (
    <FullscreenStage
      titleVi="ĐƯỜNG ĐUA TOÁN HỌC TỔNG HỢP"
      titleEn="Comprehensive Race Track"
      categoryBadge="Khu 7 – Đường Đua Toán Học"
      onBack={onBack}
      topRightControls={
        <div className="flex items-center gap-2">
          {/* Speedometer */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-black text-xs border transition-all ${
              isNitro
                ? 'bg-red-500 text-yellow-100 border-yellow-300 shadow-sm animate-bounce'
                : 'bg-red-100 text-red-950 border-red-300 shadow-2xs'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isNitro ? 'fill-yellow-300 text-yellow-300' : 'fill-amber-500 text-amber-500'}`} />
            <span>{speed} km/h</span>
          </div>

          {/* Progress */}
          <span className="text-xs font-black text-white bg-gradient-to-r from-orange-600 to-red-600 px-2.5 py-1 rounded-full shadow-xs">
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
    >
      <div className="w-full h-full flex flex-col bg-gradient-to-b from-orange-600 via-amber-600 to-red-700 text-white select-none overflow-hidden relative font-['Be_Vietnam_Pro']">
        {/* Animated Speed Lines & Checkered Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* 2. MAIN RACE TRACK ARENA (16:9 Zero-Scroll Layout) */}
        <main className="flex-1 flex flex-col justify-between p-3 sm:p-5 relative z-10 max-w-6xl w-full mx-auto overflow-hidden">
          {/* Progress Lap Bar */}
          <div className="w-full bg-black/30 backdrop-blur-xs rounded-full p-1 border border-orange-400/30 flex items-center justify-between gap-1 shadow-sm shrink-0 mb-2">
            {[
              { id: 0, label: '1. So sánh số', icon: CheckCircle2 },
              { id: 1, label: '2. Phép tính cộng', icon: Zap },
              { id: 2, label: '3. Đồng hồ giờ', icon: Clock },
              { id: 3, label: '4. Chục & Đơn vị', icon: Boxes },
              { id: 4, label: '5. Về đích lời văn', icon: Trophy },
            ].map((step) => {
              const StepIcon = step.icon;
              const isPast = currentStage > step.id;
              const isCurr = currentStage === step.id;
              return (
                <div
                  key={step.id}
                  className={`flex-1 py-1.5 px-2 rounded-full text-center transition-all flex items-center justify-center gap-1 text-[11px] font-black truncate ${
                    isPast
                      ? 'bg-emerald-500 text-white'
                      : isCurr
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 shadow-md ring-2 ring-white scale-102'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  <StepIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate hidden md:inline">{step.label}</span>
                  <span className="md:hidden">C{step.id + 1}</span>
                </div>
              );
            })}
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`p-2.5 rounded-2xl text-center text-xs sm:text-sm font-black border shadow-lg shrink-0 transition-all ${
                feedback.includes('XUẤT SẮC') || feedback.includes('CHÍNH XÁC') || feedback.includes('TUYỆT VỜI') || feedback.includes('QUÁ ĐỈNH') || feedback.includes('CÁN ĐÍCH')
                  ? 'bg-emerald-500/90 border-emerald-300 text-white'
                  : 'bg-amber-500/90 border-amber-300 text-slate-950'
              }`}
            >
              {feedback}
            </div>
          )}

          {/* CHALLENGE WORKSPACE CARDS */}
          <div className="flex-1 flex flex-col justify-center items-center my-auto w-full">
            {/* --- STAGE 1: SO SÁNH SỐ TRONG PHẠM VI 100 --- */}
            {currentStage === 0 && (
              <div className="w-full max-w-4xl bg-white/95 text-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-yellow-400 flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-500 text-white font-black text-xs px-2.5 py-1 rounded-full">
                      CHẶNG 1: SO SÁNH SỐ TRONG PHẠM VI 100
                    </span>
                    <h2 className="text-sm sm:text-base font-black text-slate-800">
                      Bấm chọn đáp án đúng để xe đua tiến lên
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      readPrompt(
                        langMode === 'en'
                          ? 'Which number is the greatest? 45, 54, or 49?'
                          : 'Số nào lớn nhất trong các số: 45, 54, 49?'
                      )
                    }
                    className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-full transition-all cursor-pointer"
                    title="Nghe câu hỏi"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-orange-200 rounded-2xl p-4 w-full text-center mb-5 shadow-xs">
                  <p className="text-lg sm:text-2xl font-black text-orange-950">
                    {langMode === 'en' ? compareQuest.promptEn : compareQuest.promptVi}
                  </p>
                  <p className="text-xs text-orange-700 font-bold mt-1">
                    {langMode === 'en'
                      ? 'Compare 45, 54, 49 and select the greatest number!'
                      : 'Quan sát các số 45, 54, 49 và chạm chọn số lớn nhất!'}
                  </p>
                </div>

                {/* 3 Number Options: 45, 54, 49 */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-xl">
                  {compareQuest.options.map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleSelectCompare(num)}
                      className="bg-gradient-to-b from-amber-50 to-orange-100 hover:from-yellow-300 hover:to-orange-400 border-3 border-orange-300 hover:border-orange-500 p-5 rounded-3xl shadow-md hover:shadow-xl transition-all flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer group"
                    >
                      <span className="text-3xl sm:text-4xl font-black text-slate-800 group-hover:text-slate-950 transition-colors">
                        {num}
                      </span>
                      <span className="text-[11px] font-bold text-orange-700 group-hover:text-orange-950 uppercase tracking-wide">
                        Số xe
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* --- STAGE 2: PHÉP CỘNG HAI SỐ CÓ HAI CHỮ SỐ KHÔNG NHỚ --- */}
            {currentStage === 1 && (
              <div className="w-full max-w-4xl bg-white/95 text-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-yellow-400 flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-500 text-white font-black text-xs px-2.5 py-1 rounded-full">
                      CHẶNG 2: PHÉP CỘNG KHÔNG NHỚ
                    </span>
                    <h2 className="text-sm sm:text-base font-black text-slate-800">
                      Chọn kết quả đúng để xe đua tăng tốc bứt phá
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      readPrompt(
                        langMode === 'en'
                          ? 'Thirty-two plus fifteen equals what?'
                          : 'Ba mươi hai cộng mười lăm bằng bao nhiêu?'
                      )
                    }
                    className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-full transition-all cursor-pointer"
                    title="Nghe câu hỏi"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Math Equation Visual Board */}
                <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-orange-200 rounded-2xl p-4 w-full flex flex-col items-center justify-center mb-5 shadow-xs">
                  <div className="flex items-center justify-center gap-3 sm:gap-4 text-2xl sm:text-4xl font-black text-slate-800 select-none">
                    <span className="bg-white px-4 py-2 rounded-2xl border-2 border-orange-300 shadow-sm text-blue-700">
                      32
                    </span>
                    <span className="text-orange-600 font-extrabold">+</span>
                    <span className="bg-white px-4 py-2 rounded-2xl border-2 border-orange-300 shadow-sm text-emerald-700">
                      15
                    </span>
                    <span className="text-orange-600 font-extrabold">=</span>
                    <span
                      className={`min-w-[70px] sm:min-w-[85px] text-center px-4 py-2 rounded-2xl border-2 border-dashed shadow-sm transition-all ${
                        selectedAddAns !== null
                          ? selectedAddAns === additionQuest.ans
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-800 animate-pulse font-black'
                            : 'bg-red-100 border-red-500 text-red-800 font-black'
                          : 'bg-amber-100/70 border-amber-400 text-amber-700'
                      }`}
                    >
                      {selectedAddAns !== null ? selectedAddAns : '?'}
                    </span>
                  </div>
                  <p className="text-xs text-orange-700 font-bold mt-2">
                    {langMode === 'en'
                      ? 'Calculate: 32 + 15 = ?'
                      : 'Thực hiện phép tính: 32 + 15 = ?'}
                  </p>
                </div>

                {/* 3 Options: 37, 47, 57 */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-xl">
                  {additionQuest.options.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSelectAddition(val)}
                      className={`p-4 sm:p-5 rounded-3xl border-3 font-black text-2xl sm:text-3xl shadow-md hover:shadow-xl transition-all flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer ${
                        selectedAddAns === val
                          ? val === additionQuest.ans
                            ? 'bg-emerald-400 border-emerald-600 text-white ring-4 ring-emerald-200'
                            : 'bg-red-400 border-red-600 text-white'
                          : 'bg-gradient-to-b from-amber-50 to-orange-100 hover:from-yellow-300 hover:to-orange-400 border-orange-300 hover:border-orange-500 text-slate-800'
                      }`}
                    >
                      <span>{val}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                        Đáp án
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* --- STAGE 3: CLOCK TIME --- */}
            {currentStage === 2 && (
              <div className="w-full max-w-4xl bg-white/95 text-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-yellow-400 flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-500 text-white font-black text-xs px-2.5 py-1 rounded-full">
                      CHẶNG 3: GIỜ XUẤT PHÁT ĐUA XE
                    </span>
                    <h2 className="text-sm sm:text-base font-black text-slate-800">
                      Xem đồng hồ kim chỉ mấy giờ
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      readPrompt(
                        langMode === 'en'
                          ? 'What time is shown on the start line clock?'
                          : 'Đồng hồ tại vạch xuất phát đang chỉ mấy giờ?'
                      )
                    }
                    className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-full transition-all cursor-pointer"
                    title="Nghe câu hỏi"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 w-full my-2">
                  {/* Precision SVG Clock: Hand never touches or obscures numbers */}
                  {renderAnalogClock(clockQuest.hour)}

                  <div className="flex flex-col items-center sm:items-start space-y-3">
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs sm:text-sm font-bold text-amber-950 space-y-1">
                      <p>⏱️ Kim ngắn màu đỏ: Chỉ <strong>GIỜ</strong> (chỉ số 3).</p>
                      <p>⏱️ Kim dài màu xanh: Chỉ số 12 (đúng giờ).</p>
                    </div>

                    <p className="text-sm sm:text-base font-black text-slate-800">
                      {langMode === 'en'
                        ? 'What time is it?'
                        : 'Đồng hồ đang chỉ mấy giờ?'}
                    </p>

                    {/* 3 Options: 2 giờ, 3 giờ, 4 giờ */}
                    <div className="grid grid-cols-3 gap-3 w-full sm:w-80">
                      {clockQuest.options.map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => handleSelectClock(h)}
                          className="py-3 px-3 bg-gradient-to-b from-amber-50 to-orange-100 hover:from-yellow-300 hover:to-orange-400 border-2 border-orange-300 hover:border-orange-500 rounded-2xl font-black text-sm sm:text-base text-slate-900 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer text-center"
                        >
                          {h} giờ
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- STAGE 4: TENS & ONES PAIRING --- */}
            {currentStage === 3 && (
              <div className="w-full max-w-4xl bg-white/95 text-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-yellow-400 flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-500 text-white font-black text-xs px-2.5 py-1 rounded-full">
                      CHẶNG 4: TIẾP SỨC CHỤC VÀ ĐƠN VỊ
                    </span>
                    <h2 className="text-sm sm:text-base font-black text-slate-800">
                      Chạm chọn 1 ô bên trái và 1 ô số tương ứng bên phải để ghép đôi
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      readPrompt('Ghép cấu tạo số Chục và Đơn vị với số có hai chữ số tương ứng!')
                    }
                    className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-full transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full my-2">
                  {/* Left Column (Tens & Ones) */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                      CẤU TẠO SỐ (CHỤC & ĐƠN VỊ)
                    </span>
                    {tensPairs.leftItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        disabled={item.matched}
                        onClick={() => handleSelectTensLeft(item)}
                        className={`w-full py-3 px-4 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-between border-2 shadow-xs cursor-pointer ${
                          item.matched
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-800 cursor-not-allowed opacity-80'
                            : selectedLeft === item.id
                            ? 'bg-orange-500 border-orange-600 text-white ring-4 ring-orange-200 scale-102'
                            : 'bg-orange-50 border-orange-200 hover:border-orange-400 text-orange-950'
                        }`}
                      >
                        <span>{item.text}</span>
                        {item.matched && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                    ))}
                  </div>

                  {/* Right Column (2-digit Number) */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                      SỐ TƯƠNG ỨNG
                    </span>
                    {tensPairs.rightItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        disabled={item.matched}
                        onClick={() => handleSelectTensRight(item)}
                        className={`w-full py-3 px-4 rounded-2xl font-black text-sm sm:text-base transition-all flex items-center justify-between border-2 shadow-xs cursor-pointer ${
                          item.matched
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-800 cursor-not-allowed opacity-80'
                            : selectedRight === item.id
                            ? 'bg-orange-500 border-orange-600 text-white ring-4 ring-orange-200 scale-102'
                            : 'bg-orange-50 border-orange-200 hover:border-orange-400 text-orange-950'
                        }`}
                      >
                        <span className="text-base font-extrabold">{item.text}</span>
                        {item.matched && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* --- STAGE 5: COMPREHENSIVE WORD PROBLEM --- */}
            {currentStage === 4 && wordQuest && (
              <div className="w-full max-w-4xl bg-white/95 text-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-yellow-400 flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500 text-white font-black text-xs px-2.5 py-1 rounded-full animate-pulse">
                      CHẶNG 5: CÁN ĐÍCH VINH QUANG
                    </span>
                    <h2 className="text-sm sm:text-base font-black text-slate-800">
                      Giải bài toán có lời văn về cuộc đua
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      readPrompt(`${wordQuest.storyVi} ${wordQuest.questionVi}`)
                    }
                    className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-full transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-4 w-full mb-4 text-slate-800">
                  <p className="text-sm sm:text-base font-bold mb-1 leading-relaxed">
                    🏎️ {langMode === 'en' ? wordQuest.storyEn : wordQuest.storyVi}
                  </p>
                  <p className="text-sm sm:text-base font-black text-orange-950 leading-relaxed">
                    👉 {langMode === 'en' ? wordQuest.questionEn : wordQuest.questionVi}
                  </p>
                </div>

                {/* 4 Choices */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                  {wordQuest.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectWordAns(opt)}
                      className={`py-3.5 px-4 rounded-2xl font-black text-sm sm:text-base border-2 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer ${
                        selectedWordAns === opt
                          ? opt === wordQuest.ans
                            ? 'bg-emerald-500 border-emerald-600 text-white'
                            : 'bg-red-500 border-red-600 text-white'
                          : 'bg-orange-50 hover:bg-orange-100 border-orange-300 hover:border-orange-500 text-orange-950'
                      }`}
                    >
                      {opt} {wordQuest.unit}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. BOTTOM CHIBI CAR TRACK ANIMATION */}
          <div className="w-full h-16 sm:h-20 bg-black/40 backdrop-blur-xs rounded-2xl border border-orange-400/30 p-2 relative flex items-center shrink-0 overflow-hidden shadow-inner mt-2">
            {/* Road lines */}
            <div className="absolute inset-x-0 h-1 border-b-2 border-dashed border-yellow-300/60" />

            {/* Checkered Finish Line on Right */}
            <div className="absolute right-3 top-0 bottom-0 w-6 bg-[repeating-conic-gradient(#000_0_25%,#fff_0_50%)] [background-size:10px_10px] opacity-80 rounded-r-xl" />

            {/* Animated Chibi Car along track */}
            <div
              className="absolute transition-all duration-700 ease-out flex items-center gap-2"
              style={{
                left: `calc(10px + ${currentStage * 21}%)`,
              }}
            >
              <div
                className={`text-3xl sm:text-4xl transition-transform ${
                  isNitro ? 'scale-125 translate-x-2' : ''
                }`}
              >
                🏎️
              </div>
              {isNitro && (
                <div className="flex items-center gap-1 bg-red-600 text-yellow-200 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md animate-pulse">
                  <Zap className="w-3 h-3 fill-yellow-300" /> NITRO!
                </div>
              )}
            </div>
          </div>
        </main>

        {/* 4. GRAND PRIX VICTORY MODAL OVERLAY */}
        {isCompleted && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-gradient-to-b from-slate-900 to-orange-950 border-4 border-yellow-400 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center text-white shadow-[0_0_50px_rgba(234,88,12,0.8)] relative">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-300 border-4 border-white flex items-center justify-center shadow-2xl">
                <Trophy className="w-14 h-14 text-orange-950 drop-shadow-md animate-bounce" />
              </div>

              <div className="mt-10 space-y-2">
                <span className="bg-orange-500 text-yellow-100 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  GRAND PRIX GRADE 1
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-yellow-300">
                  QUÁN QUÂN ĐƯỜNG ĐUA!
                </h2>
                <p className="text-xs sm:text-sm text-orange-200 font-medium">
                  Bé đã xuất sắc chinh phục trọn vẹn cả 5 chặng đua tổng hợp: Hình học, Đo độ dài, Xem giờ, Chục - Đơn vị và Bài toán có lời văn!
                </p>
              </div>

              <div className="my-5 p-4 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-around">
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-yellow-300 font-black text-xl gap-1">
                    <Star className="w-5 h-5 fill-yellow-300" /> +25
                  </div>
                  <span className="text-[11px] text-yellow-200">Sao Vàng</span>
                </div>

                <div className="h-8 w-px bg-white/20" />

                <div className="flex flex-col items-center">
                  <div className="flex items-center text-orange-300 font-black text-xl gap-1">
                    <Award className="w-5 h-5 text-orange-400" /> 1
                  </div>
                  <span className="text-[11px] text-orange-200">Cúp Vàng</span>
                </div>

                <div className="h-8 w-px bg-white/20" />

                <div className="flex flex-col items-center">
                  <span className="text-xs font-black text-emerald-300">Quán Quân</span>
                  <span className="text-[11px] text-white/70">Huy hiệu mới</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={startNewGame}
                  className="flex-1 py-3 px-4 bg-white/20 hover:bg-white/30 active:scale-95 text-white font-black text-sm rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>ĐUA LẠI</span>
                </button>

                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 active:scale-95 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>VỀ KHU VỰC 7</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </FullscreenStage>
  );
};
