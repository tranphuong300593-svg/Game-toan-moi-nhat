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
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface BridgeBuilderGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

// English praises and encouragements
const PRAISES = [
  'Great job!',
  'Well done!',
  'Excellent!',
  'Amazing!',
  'You did it!',
  'Fantastic!',
];

const ENCOURAGEMENTS = [
  'Try again!',
  'Almost there!',
  'Keep trying!',
  'You can do it!',
  'Not quite. Try again!',
];

interface QuestionData {
  id: 'pencil' | 'eraser' | 'spoon' | 'comb' | 'toothbrush';
  nameVi: string;
  nameEn: string;
  questionText: string;
  lengthCm: number;
  options: number[];
  icon: string;
}

// 5 core questions matching Grade 1 curriculum exactly
const QUESTIONS: QuestionData[] = [
  {
    id: 'pencil',
    nameVi: 'Chiếc bút chì',
    nameEn: 'Pencil',
    questionText: 'Chiếc bút chì dài bao nhiêu xăng-ti-mét?',
    lengthCm: 6,
    options: [5, 6, 7],
    icon: '✏️',
  },
  {
    id: 'eraser',
    nameVi: 'Cục tẩy',
    nameEn: 'Eraser',
    questionText: 'Cục tẩy màu hồng dài bao nhiêu xăng-ti-mét?',
    lengthCm: 3,
    options: [2, 3, 4],
    icon: '🧼',
  },
  {
    id: 'spoon',
    nameVi: 'Chiếc muỗng',
    nameEn: 'Spoon',
    questionText: 'Chiếc muỗng nhỏ dài bao nhiêu xăng-ti-mét?',
    lengthCm: 8,
    options: [7, 8, 9],
    icon: '🥄',
  },
  {
    id: 'comb',
    nameVi: 'Chiếc lược',
    nameEn: 'Comb',
    questionText: 'Chiếc lược màu xanh dài bao nhiêu xăng-ti-mét?',
    lengthCm: 7,
    options: [6, 7, 8],
    icon: '🪮',
  },
  {
    id: 'toothbrush',
    nameVi: 'Chiếc bàn chải đánh răng',
    nameEn: 'Toothbrush',
    questionText: 'Chiếc bàn chải đánh răng dài bao nhiêu xăng-ti-mét?',
    lengthCm: 9,
    options: [8, 9, 10],
    icon: '🪥',
  },
];

export const BridgeBuilderGame: React.FC<BridgeBuilderGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [gameState, setGameState] = useState<'playing' | 'victory'>('playing');
  const [taskIndex, setTaskIndex] = useState(0); // 0..4 (5 tasks)
  const [completedSpans, setCompletedSpans] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [startTime, setStartTime] = useState(Date.now());
  const [animalsCrossing, setAnimalsCrossing] = useState(false);
  const [justInstalledSpan, setJustInstalledSpan] = useState<number | null>(null);

  const lastPraiseRef = useRef<string>('');

  const startNewGame = () => {
    setTaskIndex(0);
    setCompletedSpans([]);
    setSelectedAnswer(null);
    setIsProcessing(false);
    setFeedback(null);
    setAnimalsCrossing(false);
    setJustInstalledSpan(null);
    setStartTime(Date.now());
    setGameState('playing');
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const currentQ = QUESTIONS[taskIndex];

  const speakRandomPraise = () => {
    if (!soundEnabled) return;
    const candidates = PRAISES.filter((p) => p !== lastPraiseRef.current);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)] || 'Great job!';
    lastPraiseRef.current = chosen;
    soundService.speakEn(chosen);
  };

  const speakRandomEncouragement = () => {
    if (!soundEnabled) return;
    const chosen = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
    soundService.speakEn(chosen);
  };

  const handleSelectAnswer = (cm: number) => {
    if (isProcessing || !currentQ || selectedAnswer !== null) return;
    soundService.playClick();
    setSelectedAnswer(cm);

    if (cm === currentQ.lengthCm) {
      // Correct!
      setIsProcessing(true);
      if (soundEnabled) {
        soundEffects.correct();
      }
      setFeedback(`Chính xác! ${currentQ.nameVi} dài đúng ${cm} cm. Nhịp cầu số ${taskIndex + 1} đang được lắp vào!`);

      // Trigger crane & bridge span installation
      setJustInstalledSpan(taskIndex);
      setCompletedSpans((prev) => [...prev, taskIndex]);

      setTimeout(() => {
        if (taskIndex < 4) {
          // Auto advance to next question
          setTimeout(() => {
            setTaskIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            setIsProcessing(false);
            setFeedback(null);
            setJustInstalledSpan(null);
          }, 650);
        } else {
          // Completed all 5 spans! Bridge complete!
          setAnimalsCrossing(true);
          if (soundEnabled) {
            soundEffects.celebrate();
          }

          confetti({
            particleCount: 160,
            spread: 100,
            origin: { y: 0.5 },
          });

          setTimeout(() => {
            setGameState('victory');
            StorageService.recordActivity(student.id, {
              type: 'game',
              targetId: 'bridge-builder',
              targetName: 'Kỹ Sư Xây Cầu Thần Kỳ',
              score: 5,
              totalQuestions: 5,
              starsEarned: 25,
              timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
            });
            const updated = StorageService.getCurrentStudent();
            if (updated) onUpdateStudent(updated);
          }, 3600);
        }
      }, 950);
    } else {
      // Incorrect
      if (soundEnabled) {
        soundEffects.wrong();
      }
      setFeedback(`Chưa đúng rồi! Bé hãy nhìn đường dóng màu xanh dương ở đầu phải của vật để chọn lại nhé!`);
      setTimeout(() => {
        setSelectedAnswer(null);
      }, 700);
    }
  };

  // --- SVG OBJECT RENDERING ---
  // Coordinates: xStart = 70 (at vạch 0). pixelWidth = lengthCm * 72.
  // The object must begin at exactly x=0 and end at exactly x=pixelWidth.
  const renderSvgObject = (objId: QuestionData['id'], xStart: number, yCenter: number, pixelWidth: number) => {
    switch (objId) {
      case 'pencil':
        return (
          <g transform={`translate(${xStart}, ${yCenter - 14})`}>
            {/* Eraser */}
            <rect x="0" y="2" width="22" height="24" rx="4" fill="#f472b6" />
            {/* Ferrule */}
            <rect x="20" y="1" width="12" height="26" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
            <line x1="26" y1="2" x2="26" y2="26" stroke="#64748b" strokeWidth="1" />
            {/* Wooden shaft */}
            <rect x="32" y="2" width={Math.max(10, pixelWidth - 62)} height="24" fill="#f59e0b" />
            <line x1="32" y1="9" x2={pixelWidth - 30} y2="9" stroke="#d97706" strokeWidth="1.5" />
            <line x1="32" y1="19" x2={pixelWidth - 30} y2="19" stroke="#b45309" strokeWidth="1.5" />
            {/* Sharpened wood cone */}
            <polygon
              points={`${pixelWidth - 30},2 ${pixelWidth},14 ${pixelWidth - 30},26`}
              fill="#fed7aa"
            />
            {/* Graphite tip: ends exactly at pixelWidth */}
            <polygon
              points={`${pixelWidth - 12},9.5 ${pixelWidth},14 ${pixelWidth - 12},18.5`}
              fill="#1e293b"
            />
          </g>
        );

      case 'eraser':
        return (
          <g transform={`translate(${xStart}, ${yCenter - 15})`}>
            {/* Pink Eraser body from x=0 to x=pixelWidth */}
            <rect x="0" y="0" width={pixelWidth} height="30" rx="6" fill="#fb7185" stroke="#e11d48" strokeWidth="1.5" />
            {/* Sleeve wrapper */}
            <rect x="10" y="0" width={Math.max(20, pixelWidth * 0.55)} height="30" fill="#38bdf8" />
            <rect x="14" y="3" width={Math.max(12, pixelWidth * 0.45)} height="24" rx="3" fill="#ffffff" />
            <text
              x={14 + Math.max(12, pixelWidth * 0.45) / 2}
              y="19"
              fill="#0369a1"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
            >
              GOM
            </text>
          </g>
        );

      case 'spoon':
        return (
          <g transform={`translate(${xStart}, ${yCenter - 14})`}>
            {/* Bowl on left: starts at x=0 */}
            <ellipse cx="26" cy="14" rx="26" ry="14" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
            <ellipse cx="24" cy="14" rx="20" ry="10" fill="#f1f5f9" />
            {/* Handle extends smoothly to right, ending at x=pixelWidth */}
            <path
              d={`M 48 11 Q ${pixelWidth * 0.45} 12 ${pixelWidth - 8} 9 Q ${pixelWidth} 14 ${pixelWidth - 8} 19 Q ${pixelWidth * 0.45} 16 48 17 Z`}
              fill="#94a3b8"
              stroke="#64748b"
              strokeWidth="1"
            />
          </g>
        );

      case 'comb':
        return (
          <g transform={`translate(${xStart}, ${yCenter - 15})`}>
            {/* Comb Spine from x=0 to x=pixelWidth */}
            <rect x="0" y="0" width={pixelWidth} height="12" rx="4" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
            {/* Teeth hanging down */}
            {Array.from({ length: Math.floor((pixelWidth - 12) / 6) }).map((_, i) => (
              <line
                key={i}
                x1={6 + i * 6}
                y1="12"
                x2={6 + i * 6}
                y2="30"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ))}
          </g>
        );

      case 'toothbrush':
      default:
        // Chiếc bàn chải đánh răng (Toothbrush)
        // Strictly horizontal, parallel to ruler.
        // Left end of handle begins at exactly x = 0.
        // Rightmost tip of brush head ends at exactly x = pixelWidth (648px = 9cm).
        // Height between y = 2 and y = 28 (centered, clean, no deformation).
        return (
          <g transform={`translate(${xStart}, ${yCenter - 14})`}>
            {/* Gradient definition for ergonomic handle */}
            <defs>
              <linearGradient id="tb-handle" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="35%" stopColor="#38bdf8" />
                <stop offset="70%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>

            {/* 1. Main Handle: starts at x=0 with smooth rounded ergonomic butt */}
            <path
              d={`
                M 0,14 
                C 0,7 10,4 32,5 
                L 240,7 
                C 320,7 400,11 460,12 
                L 490,12 
                L 490,16 
                L 460,16 
                C 400,17 320,21 240,21 
                L 32,23 
                C 10,24 0,21 0,14 
                Z
              `}
              fill="url(#tb-handle)"
              stroke="#0369a1"
              strokeWidth="1.5"
            />

            {/* 2. Soft Rubber Grip Inlay (in center of handle) */}
            <path
              d="M 60,8 L 200,8 C 206,8 210,10 210,14 C 210,18 206,20 200,20 L 60,20 C 54,20 50,18 50,14 C 50,10 54,8 60,8 Z"
              fill="#e0f2fe"
              stroke="#0284c7"
              strokeWidth="1"
            />
            {/* Rubber grip tactile ribs */}
            <line x1="90" y1="9" x2="90" y2="19" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="120" y1="9" x2="120" y2="19" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="150" y1="9" x2="150" y2="19" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="180" y1="9" x2="180" y2="19" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" />

            {/* 3. Neck transition (x = 460 to 495) */}
            <path
              d="M 460,12 L 495,12 L 495,16 L 460,16 Z"
              fill="#38bdf8"
              stroke="#0284c7"
              strokeWidth="1"
            />

            {/* 4. Brush Head Plastic Base: from x=495 to exactly x=pixelWidth */}
            {/* The rightmost tip touches x = pixelWidth (648px) with a smooth rounded oval */}
            <path
              d={`
                M 495,12 
                L ${pixelWidth - 18},12 
                C ${pixelWidth - 6},12 ${pixelWidth},13 ${pixelWidth},14 
                C ${pixelWidth},15 ${pixelWidth - 6},16 ${pixelWidth - 18},16 
                L 495,16 
                Z
              `}
              fill="#0284c7"
              stroke="#0369a1"
              strokeWidth="1.5"
            />

            {/* 5. Bristles Head: gently contoured tufts placed on top of the head base */}
            {/* Bristles tufts start at x = 505 and end safely at x = pixelWidth - 8 (640px) */}
            {/* White bristles background */}
            <rect
              x="505"
              y="2"
              width={Math.max(20, pixelWidth - 513)}
              height="10"
              rx="2.5"
              fill="#ffffff"
              stroke="#93c5fd"
              strokeWidth="1"
            />
            {/* Deep blue accent tuft blocks */}
            <rect x="515" y="2" width="22" height="10" rx="1.5" fill="#0284c7" />
            <rect x="555" y="2" width="28" height="10" rx="1.5" fill="#0284c7" />
            <rect x="605" y="2" width={Math.max(10, pixelWidth - 616)} height="10" rx="1.5" fill="#0284c7" />

            {/* Subtle vertical bristle texture lines */}
            {Array.from({ length: 13 }).map((_, i) => (
              <line
                key={i}
                x1={512 + i * 10}
                y1="3"
                x2={512 + i * 10}
                y2="11"
                stroke="#bae6fd"
                strokeWidth="1"
                opacity="0.8"
              />
            ))}
          </g>
        );
    }
  };

  return (
    <FullscreenStage
      titleVi="Kỹ Sư Xây Cầu Thần Kỳ"
      titleEn="Magic Bridge Builder Engineer"
      categoryBadge="Khu Vực 4: Tháp Đồng Hồ Kỳ Diệu"
      onBack={onBack}
      topRightControls={
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              soundService.playClick();
            }}
            className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200 shadow-xs"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
          </button>
        </div>
      }
    >
      {gameState === 'playing' && currentQ && (
        <div className="w-full h-full max-w-[177.78vh] mx-auto flex flex-col justify-between overflow-hidden select-none p-1.5 sm:p-2.5">
          {/* 1. TOP 11% - Header & 5-Span Progress */}
          <div className="h-[11%] flex items-center justify-between bg-white/95 backdrop-blur-xs px-3 sm:px-4 py-1 rounded-2xl border border-amber-200 shadow-xs shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">👷‍♂️🦫</span>
              <div>
                <div className="text-xs sm:text-sm font-black text-amber-950 flex items-center gap-1.5 leading-none">
                  <span>KỸ SƯ XÂY CẦU THẦN KỲ</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                    Câu {taskIndex + 1}/5
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-semibold truncate max-w-xs sm:max-w-md mt-0.5">
                  Đo: <strong className="text-amber-700">{currentQ.nameVi}</strong> bằng thước xăng-ti-mét (cm)
                </div>
              </div>
            </div>

            {/* 5-span progress indicator */}
            <div className="flex items-center gap-1 sm:gap-2">
              {[0, 1, 2, 3, 4].map((idx) => {
                const isDone = completedSpans.includes(idx);
                const isCurrent = idx === taskIndex;
                return (
                  <div
                    key={idx}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-black transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300 scale-105 shadow-md animate-pulse'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isDone ? '✓' : idx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. UPPER-MIDDLE 29% - River, Beaver, 5-Span Wooden Bridge & Animals */}
          <div className="h-[29%] relative bg-gradient-to-b from-sky-200 via-emerald-50 to-teal-200 rounded-2xl border-2 border-amber-300/60 p-2 shadow-inner flex items-center justify-between overflow-hidden shrink-0">
            <div className="absolute top-1 left-3 text-2xl opacity-70">🌳</div>
            <div className="absolute top-1 right-3 text-2xl opacity-70">🌲</div>
            <div className="absolute bottom-1 inset-x-0 h-6 bg-teal-400/20 blur-xs" />

            {/* Left Bank: Beaver Engineer */}
            <div className="flex flex-col items-center gap-0.5 bg-amber-800/85 px-2 py-1 rounded-xl border border-amber-600 text-white shadow-md z-10 shrink-0">
              <div className="text-2xl sm:text-3xl animate-bounce">👷‍♂️🦫</div>
              <div className="text-xs">🏗️</div>
              <span className="text-[9px] font-bold">Hải Ly</span>
            </div>

            {/* 5-Span Bridge */}
            <div className="flex-1 mx-2 sm:mx-4 relative z-10">
              <div className="absolute inset-x-0 -top-1.5 h-0.5 border-t border-dashed border-amber-800 opacity-60" />
              <div className="absolute inset-x-0 -bottom-1.5 h-0.5 border-b border-dashed border-amber-800 opacity-60" />

              {/* Crossing Animals Animation */}
              {animalsCrossing && (
                <div className="absolute -top-7 inset-x-0 flex justify-around text-2xl z-30 animate-pulse">
                  <span className="animate-bounce">🐰</span>
                  <span className="animate-bounce delay-100">🐿️</span>
                  <span className="animate-bounce delay-200">🐻</span>
                </div>
              )}

              {/* 5 Spans Grid */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {[0, 1, 2, 3, 4].map((spanIdx) => {
                  const isDone = completedSpans.includes(spanIdx);
                  const isJustInstalled = justInstalledSpan === spanIdx;

                  return (
                    <div
                      key={spanIdx}
                      className={`h-12 sm:h-16 rounded-lg sm:rounded-xl border-2 flex flex-col items-center justify-center p-0.5 transition-all duration-500 ${
                        isDone
                          ? 'bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 border-amber-500 text-amber-100 shadow-md'
                          : 'bg-white/40 border-dashed border-slate-300 text-slate-400'
                      } ${isJustInstalled ? 'scale-105 ring-4 ring-yellow-400 animate-pulse' : ''}`}
                    >
                      {isDone ? (
                        <>
                          <span className="text-xs">🪵</span>
                          <span className="text-[9px] font-black text-amber-200">
                            Nhịp {spanIdx + 1}
                          </span>
                          <span className="text-[8px] bg-amber-950/80 px-1 rounded-xs text-yellow-300 font-bold">
                            ✓ Đã Lắp
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] opacity-40">🔒</span>
                          <span className="text-[9px] font-bold opacity-60">Nhịp {spanIdx + 1}</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Bank: Waiting Animals */}
            <div className="flex flex-col items-center gap-0.5 bg-emerald-800/85 px-2 py-1 rounded-xl border border-emerald-600 text-white shadow-md z-10 shrink-0">
              <div className="flex gap-1 text-xl sm:text-2xl">
                <span>🐰</span>
                <span>🐿️</span>
                <span>🐻</span>
              </div>
              <span className="text-[9px] font-bold">Thỏ, Sóc, Gấu</span>
            </div>
          </div>

          {/* 3. LOWER-MIDDLE 42% - Measurement Arena (SVG Precision Ruler + Object + Blue Guide Lines) */}
          <div className="h-[42%] relative bg-white/95 backdrop-blur-xs rounded-2xl border-2 border-amber-300 shadow-sm p-1.5 sm:p-2 flex flex-col items-center justify-between overflow-hidden shrink-0">
            {/* Question Banner */}
            <div className="w-full flex items-center justify-between px-2 pt-0.5 pb-0.5 leading-none">
              <span className="text-xs sm:text-sm font-black text-amber-950">
                ❓ {currentQ.questionText}
              </span>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold border border-blue-200">
                📏 Bắt đầu từ vạch 0
              </span>
            </div>

            {/* High-Precision SVG Canvas */}
            {/*
              Coordinate Specs:
              viewBox: 0 0 860 160
              x0 = 70 (vạch 0)
              dx = 72 (1 cm)
              For Question 5 (Toothbrush 9 cm):
                Starts at x = 70 (vạch 0)
                Ends at x = 70 + 9 * 72 = 718 (vạch 9)
                Left blue guide line: x = 70
                Right blue guide line: x = 718
            */}
            <div className="w-full flex-1 flex items-center justify-center">
              <svg
                viewBox="0 0 860 160"
                className="w-full h-full max-h-[155px] select-none"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* 1. Object: Positioned horizontally parallel to ruler */}
                {renderSvgObject(currentQ.id, 70, 42, currentQ.lengthCm * 72)}

                {/* 2. Left Blue Dashed Guide Line (down to vạch 0) */}
                <line
                  x1={70}
                  y1={14}
                  x2={70}
                  y2={100}
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeDasharray="5 4"
                />
                <circle cx={70} cy={14} r="3.5" fill="#2563eb" />
                <circle cx={70} cy={100} r="3.5" fill="#2563eb" />
                {/* Label pill for Zero */}
                <rect x={50} y={0} width="40" height="15" rx="3" fill="#2563eb" />
                <text x={70} y={11} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Vạch 0
                </text>

                {/* 3. Right Blue Dashed Guide Line (down to vạch N) */}
                <line
                  x1={70 + currentQ.lengthCm * 72}
                  y1={14}
                  x2={70 + currentQ.lengthCm * 72}
                  y2={100}
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeDasharray="5 4"
                />
                <circle cx={70 + currentQ.lengthCm * 72} cy={14} r="3.5" fill="#2563eb" />
                <circle cx={70 + currentQ.lengthCm * 72} cy={100} r="3.5" fill="#2563eb" />
                {/* Label pill for Right Edge */}
                <rect
                  x={70 + currentQ.lengthCm * 72 - 20}
                  y={0}
                  width="40"
                  height="15"
                  rx="3"
                  fill="#2563eb"
                />
                <text
                  x={70 + currentQ.lengthCm * 72}
                  y={11}
                  fill="#ffffff"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  ? cm
                </text>

                {/* 4. The 0 to 10 cm Standard Ruler */}
                <g id="wooden-ruler" transform="translate(0, 92)">
                  {/* Ruler Wood Body */}
                  <rect
                    x="45"
                    y="10"
                    width="770"
                    height="56"
                    rx="8"
                    fill="url(#ruler-gradient)"
                    stroke="#92400e"
                    strokeWidth="2"
                  />

                  {/* Gradient Definition */}
                  <defs>
                    <linearGradient id="ruler-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fef3c7" />
                      <stop offset="50%" stopColor="#fde68a" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>

                  {/* Unit label */}
                  <text x="56" y="26" fill="#78350f" fontSize="11" fontWeight="bold">
                    cm
                  </text>

                  {/* Ticks and Numbers from 0 to 10 */}
                  {Array.from({ length: 11 }).map((_, cm) => {
                    const tickX = 70 + cm * 72;
                    return (
                      <g key={cm}>
                        {/* Major Tick */}
                        <line
                          x1={tickX}
                          y1="10"
                          x2={tickX}
                          y2="32"
                          stroke="#78350f"
                          strokeWidth="2.5"
                        />
                        {/* Number (clearly below ticks, never obscured by guide lines) */}
                        <text
                          x={tickX}
                          y="53"
                          fill="#451a03"
                          fontSize="18"
                          fontWeight="900"
                          textAnchor="middle"
                        >
                          {cm}
                        </text>

                        {/* Subticks (0.5 cm, 0.2 cm, etc.) */}
                        {cm < 10 && (
                          <>
                            {/* Half cm tick */}
                            <line
                              x1={tickX + 36}
                              y1="10"
                              x2={tickX + 36}
                              y2="25"
                              stroke="#92400e"
                              strokeWidth="1.5"
                            />
                            {/* Minor ticks */}
                            <line
                              x1={tickX + 18}
                              y1="10"
                              x2={tickX + 18}
                              y2="19"
                              stroke="#b45309"
                              strokeWidth="1"
                              opacity="0.7"
                            />
                            <line
                              x1={tickX + 54}
                              y1="10"
                              x2={tickX + 54}
                              y2="19"
                              stroke="#b45309"
                              strokeWidth="1"
                              opacity="0.7"
                            />
                          </>
                        )}
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>

          {/* 4. BOTTOM 18% - 3 Big Option Buttons & Friendly Feedback */}
          <div className="h-[18%] flex flex-col items-center justify-center gap-1 shrink-0">
            {/* Feedback text */}
            <div className="text-xs sm:text-sm font-bold text-center text-slate-700 min-h-[18px] truncate max-w-lg">
              {feedback || 'Hãy nhìn kỹ vạch số ở đầu phải của đồ vật và chọn đáp án đúng:'}
            </div>

            {/* 3 Large Horizontal Option Buttons */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 w-full max-w-md">
              {currentQ.options.map((cmVal) => {
                const isSelected = selectedAnswer === cmVal;
                const isCorrect = isSelected && cmVal === currentQ.lengthCm;
                const isWrong = isSelected && cmVal !== currentQ.lengthCm;

                return (
                  <button
                    key={cmVal}
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleSelectAnswer(cmVal)}
                    className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl font-black text-base sm:text-xl transition-all shadow-md active:scale-95 border-3 cursor-pointer ${
                      isCorrect
                        ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-xl animate-pulse'
                        : isWrong
                        ? 'bg-rose-500 text-white border-rose-600 shadow-md'
                        : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-300 hover:border-amber-400 hover:scale-102'
                    }`}
                  >
                    {cmVal} cm
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- VICTORY SCREEN --- */}
      {gameState === 'victory' && (
        <div className="w-full h-full max-w-[177.78vh] mx-auto flex flex-col items-center justify-center p-3 text-center select-none overflow-hidden">
          {/* Beaver Mascot with Thumbs Up */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-yellow-400 via-amber-400 to-emerald-400 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl shadow-2xl border-4 border-white mb-2 animate-bounce">
            👍🦫
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-0.5 font-['Be_Vietnam_Pro'] tracking-tight">
            CHÚC MỪNG KỸ SƯ NHÍ!
          </h2>
          <h3 className="text-sm sm:text-base font-black text-emerald-600 mb-2">
            CON ĐÃ XÂY XONG CÂY CẦU THẦN KỲ!
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 mb-3 max-w-md">
            Nhờ tài đo độ dài chuẩn xác bằng thước xăng-ti-mét của bé, cả 5 nhịp cầu đã nối liền. Bạn Thỏ Trắng, Sóc Nâu và Gấu Con đã về nhà an toàn!
          </p>

          {/* Friends across the bridge */}
          <div className="flex justify-center items-center gap-3 text-2xl sm:text-3xl mb-3 bg-emerald-50 py-1.5 px-5 rounded-2xl border border-emerald-200">
            <span>🐰</span>
            <span>🐿️</span>
            <span>🌉</span>
            <span>🐻</span>
            <span>👷‍♂️🦫</span>
          </div>

          {/* Stats Summary */}
          <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-2.5 border border-amber-200 shadow-md w-full max-w-md mb-4 flex items-center justify-around">
            <div className="text-center">
              <div className="text-lg">🪵</div>
              <div className="text-xs font-bold text-slate-600">Nhịp cầu</div>
              <div className="text-sm font-black text-amber-700">5 / 5 nhịp</div>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="text-center">
              <div className="text-lg">⭐</div>
              <div className="text-xs font-bold text-slate-600">Ngôi sao</div>
              <div className="text-sm font-black text-yellow-500">+25 Sao</div>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="text-center">
              <div className="text-lg">🏅</div>
              <div className="text-xs font-bold text-slate-600">Danh hiệu</div>
              <div className="text-xs font-black text-purple-600">Kỹ Sư Cầu Đường Nhí</div>
            </div>
          </div>

          {/* Actions: Replay & Return to Zone 4 */}
          <div className="flex gap-3 w-full max-w-md">
            <button
              type="button"
              onClick={startNewGame}
              className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 text-white font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi lại</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-300 transition-all text-xs sm:text-sm cursor-pointer"
            >
              Quay lại Khu Vực 4
            </button>
          </div>
        </div>
      )}
    </FullscreenStage>
  );
};
