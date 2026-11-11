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
  CheckCircle2,
  XCircle,
  Award,
  Star,
  Ruler,
} from 'lucide-react';

interface MagicRulerGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

interface RulerItemQuestion {
  id: string;
  itemNameVi: string;
  itemNameEn: string;
  lengthCm: number;
  itemType:
    | 'pencil_yellow'
    | 'pencil_blue'
    | 'pencil_pink'
    | 'pencil_cyan'
    | 'pencil_red'
    | 'pencil_green'
    | 'eraser_blue'
    | 'eraser_pink'
    | 'counting_stick'
    | 'icecream_stick'
    | 'wooden_block'
    | 'crayon_orange'
    | 'crayon_blue'
    | 'crayon_red'
    | 'small_spoon'
    | 'key_gold'
    | 'leaf_green'
    | 'pen_purple'
    | 'chalk_box'
    | 'paper_clip';
}

const RULER_QUESTION_BANK: RulerItemQuestion[] = [
  { id: 'q1', itemNameVi: 'Chiếc bút chì vàng', itemNameEn: 'yellow pencil', lengthCm: 6, itemType: 'pencil_yellow' },
  { id: 'q2', itemNameVi: 'Chiếc bút chì xanh', itemNameEn: 'blue pencil', lengthCm: 8, itemType: 'pencil_blue' },
  { id: 'q3', itemNameVi: 'Cục tẩy xanh', itemNameEn: 'blue eraser', lengthCm: 3, itemType: 'eraser_blue' },
  { id: 'q4', itemNameVi: 'Cục tẩy hồng', itemNameEn: 'pink eraser', lengthCm: 4, itemType: 'eraser_pink' },
  { id: 'q5', itemNameVi: 'Chiếc bút chì hồng', itemNameEn: 'pink pencil', lengthCm: 7, itemType: 'pencil_pink' },
  { id: 'q6', itemNameVi: 'Chiếc bút chì xanh ngọc', itemNameEn: 'cyan pencil', lengthCm: 9, itemType: 'pencil_cyan' },
  { id: 'q7', itemNameVi: 'Chiếc que tính', itemNameEn: 'counting stick', lengthCm: 10, itemType: 'counting_stick' },
  { id: 'q8', itemNameVi: 'Chiếc que kem gỗ', itemNameEn: 'wooden popsicle stick', lengthCm: 8, itemType: 'icecream_stick' },
  { id: 'q9', itemNameVi: 'Thanh gỗ đồ chơi', itemNameEn: 'wooden toy block', lengthCm: 5, itemType: 'wooden_block' },
  { id: 'q10', itemNameVi: 'Chiếc bút sáp màu cam', itemNameEn: 'orange crayon', lengthCm: 7, itemType: 'crayon_orange' },
  { id: 'q11', itemNameVi: 'Chiếc thìa nhỏ', itemNameEn: 'small spoon', lengthCm: 6, itemType: 'small_spoon' },
  { id: 'q12', itemNameVi: 'Chiếc chìa khóa', itemNameEn: 'toy key', lengthCm: 4, itemType: 'key_gold' },
  { id: 'q13', itemNameVi: 'Chiếc lá xanh', itemNameEn: 'green leaf', lengthCm: 5, itemType: 'leaf_green' },
  { id: 'q14', itemNameVi: 'Chiếc bút mực', itemNameEn: 'purple pen', lengthCm: 11, itemType: 'pen_purple' },
  { id: 'q15', itemNameVi: 'Hộp phấn viết', itemNameEn: 'chalk box', lengthCm: 6, itemType: 'chalk_box' },
  { id: 'q16', itemNameVi: 'Chiếc kẹp giấy', itemNameEn: 'paper clip', lengthCm: 3, itemType: 'paper_clip' },
  { id: 'q17', itemNameVi: 'Chiếc bút sáp màu xanh dương', itemNameEn: 'blue crayon', lengthCm: 8, itemType: 'crayon_blue' },
  { id: 'q18', itemNameVi: 'Chiếc bút chì đỏ', itemNameEn: 'red pencil', lengthCm: 5, itemType: 'pencil_red' },
];

export const MagicRulerGame: React.FC<MagicRulerGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [questions, setQuestions] = useState<RulerItemQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const autoNextTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate 5 random non-repeating questions
  const initializeGame = () => {
    if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
    soundService.cancelSpeech();
    setIsPlayingAudio(false);

    const shuffled = [...RULER_QUESTION_BANK].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, 5);
    setQuestions(chosen);
    setCurrentIdx(0);
    setCorrectCount(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setFeedbackMsg(null);
    setIsCompleted(false);
    setStartTime(Date.now());

    generateOptions(chosen[0].lengthCm);
  };

  const generateOptions = (answer: number) => {
    const distractors = new Set<number>();
    distractors.add(answer);

    // Candidates within answer ± 3, keeping >= 1
    const candidateDeltas = [-2, -1, 1, 2, 3, -3];
    for (const d of candidateDeltas) {
      const val = answer + d;
      if (val >= 1 && val !== answer) {
        distractors.add(val);
      }
      if (distractors.size === 4) break;
    }

    // Fallback if needed
    let fallback = 2;
    while (distractors.size < 4) {
      if (!distractors.has(fallback)) distractors.add(fallback);
      fallback++;
    }

    const arr = Array.from(distractors).sort(() => Math.random() - 0.5);
    setOptions(arr);
  };

  useEffect(() => {
    initializeGame();
    return () => {
      soundService.cancelSpeech();
      if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
    };
  }, []);

  const currentQ = questions[currentIdx];

  // Play English voice on demand
  const handlePlayVoice = () => {
    if (!currentQ) return;
    soundService.cancelSpeech();
    setIsPlayingAudio(true);
    const textEn = `How long is the ${currentQ.itemNameEn} in centimeters?`;
    soundService.speakEn(textEn, {
      slow: true,
      onEnd: () => setIsPlayingAudio(false),
    });
  };

  const handleSelectOption = (chosen: number) => {
    if (isCorrect === true || !currentQ) return;

    soundService.cancelSpeech();
    setIsPlayingAudio(false);
    soundService.playClick();
    setSelectedOption(chosen);

    if (chosen === currentQ.lengthCm) {
      setIsCorrect(true);
      setCorrectCount((prev) => prev + 1);
      setFeedbackMsg(`Chính xác! ${currentQ.itemNameVi} dài đúng ${currentQ.lengthCm} cm! 🎉`);
      soundEffects.correct();

      // Confetti burst
      confetti({
        particleCount: 28,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#22c55e', '#38bdf8', '#fbbf24', '#f59e0b', '#ec4899'],
      });

      // Advance to next after 850ms
      autoNextTimerRef.current = setTimeout(() => {
        if (currentIdx + 1 < questions.length) {
          const nextIdx = currentIdx + 1;
          setCurrentIdx(nextIdx);
          setSelectedOption(null);
          setIsCorrect(null);
          setFeedbackMsg(null);
          generateOptions(questions[nextIdx].lengthCm);
        } else {
          finishGame(correctCount + 1);
        }
      }, 850);
    } else {
      setIsCorrect(false);
      setFeedbackMsg('Chưa đúng rồi! Bé hãy nhìn xem đầu kia của vật chỉ đúng vào vạch số mấy nhé!');
      soundEffects.wrong();
    }
  };

  const finishGame = (finalCorrect: number) => {
    setIsCompleted(true);
    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);

    // Record activity and award star
    const starsToAward = finalCorrect >= 4 ? 2 : 1;
    StorageService.recordActivity(student.id, {
      type: 'game',
      targetId: 'magic-ruler',
      targetName: 'Thước Thần Đo Vật',
      topicId: 7,
      score: finalCorrect,
      totalQuestions: 5,
      starsEarned: starsToAward,
      timeSpentSeconds: elapsedSeconds,
    });

    const updated = StorageService.getCurrentStudent();
    if (updated) {
      onUpdateStudent(updated);
    }

    soundEffects.celebrate();
    confetti({
      particleCount: 75,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'],
    });
  };


  if (!currentQ && !isCompleted) return null;

  // SVG Coordinates Calculation:
  // We use viewBox 0 0 680 190.
  // Pixels per centimeter: 36px
  // Zero tick starts at x = 50.
  const pixelsPerCm = 36;
  const startZeroX = 50;
  const totalRulerCm = Math.max(12, (currentQ?.lengthCm ?? 6) + 3);
  const rulerWidth = totalRulerCm * pixelsPerCm + 40;
  const objectWidth = (currentQ?.lengthCm ?? 6) * pixelsPerCm;
  const objectEndX = startZeroX + objectWidth;

  return (
    <FullscreenStage
      titleVi="THƯỚC THẦN ĐO VẬT"
      titleEn="Magic Ruler Measuring"
      categoryBadge="Khu 6 – Xưởng Đo Lường"
      onBack={onBack}
      topRightControls={
        <div className="flex items-center gap-2">
          {/* Progress */}
          <span className="text-xs font-black text-amber-900 bg-amber-100/90 px-2.5 py-1 rounded-full border border-amber-300">
            Câu {currentIdx + 1}/5
          </span>
          {/* Stars */}
          <span className="text-xs font-black text-amber-950 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 inline-flex items-center gap-1 shadow-2xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{student.totalStars || 0} ⭐</span>
          </span>
        </div>
      }
      className="bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-yellow-50/40"
    >
      {!isCompleted ? (
        <div className="w-full h-full flex flex-col justify-between p-2 sm:p-3 select-none">
          {/* 1. Header & Bilingual Question */}
          <div className="text-center shrink-0">
            <h2 className="font-['Be_Vietnam_Pro'] font-extrabold text-slate-900 text-sm sm:text-base md:text-lg leading-tight">
              {currentQ.itemNameVi} dài bao nhiêu xăng-ti-mét (cm)?
            </h2>
            <div className="mt-0.5 inline-flex items-center justify-center gap-1.5 flex-wrap">
              <span className="text-[11px] sm:text-xs font-bold text-amber-900/80">
                How long is the {currentQ.itemNameEn} in cm?
              </span>
              <button
                type="button"
                onClick={handlePlayVoice}
                className={`inline-flex items-center justify-center w-5 h-5 rounded-full transition-all cursor-pointer shadow-2xs active:scale-90 ${
                  isPlayingAudio
                    ? 'bg-amber-600 text-white animate-bounce ring-2 ring-amber-300'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                }`}
                title="Nghe phát âm tiếng Anh tự nhiên"
              >
                <Volume2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 2. Precision Math Ruler SVG Stage (100% Mathematically Accurate) */}
          <div className="flex-1 min-h-0 flex items-center justify-center py-1">
            <div className="w-full max-w-2xl bg-white/95 rounded-2xl p-2 sm:p-3 border-2 border-amber-200 shadow-sm flex flex-col items-center justify-center">
              <svg
                viewBox={`0 0 ${Math.max(620, rulerWidth + 40)} 170`}
                className="w-full h-auto max-h-[145px] sm:max-h-[160px] select-none overflow-visible"
              >
                <defs>
                  {/* Ruler Gradient */}
                  <linearGradient id="rulerBodyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="50%" stopColor="#FDE047" />
                    <stop offset="100%" stopColor="#FACC15" />
                  </linearGradient>
                  {/* Wood Pencil Gradient */}
                  <linearGradient id="woodPencil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FDE68A" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                </defs>

                {/* --- RENDER OBJECT TO MEASURE --- */}
                {/* Object starts at x = startZeroX (EXACTLY 0 cm), length = objectWidth */}
                <g transform={`translate(${startZeroX}, 48)`}>
                  {/* Pencil Types - Straight, horizontal, pink eraser at 0 cm, tip at objectWidth */}
                  {currentQ.itemType.startsWith('pencil_') && (() => {
                    let shaftColor = '#F59E0B';
                    let topStripe = '#FDE68A';
                    let botStripe = '#D97706';

                    if (currentQ.itemType === 'pencil_blue') {
                      shaftColor = '#0284C7';
                      topStripe = '#38BDF8';
                      botStripe = '#0369A1';
                    } else if (currentQ.itemType === 'pencil_pink') {
                      shaftColor = '#EC4899';
                      topStripe = '#F9A8D4';
                      botStripe = '#BE185D';
                    } else if (currentQ.itemType === 'pencil_cyan') {
                      shaftColor = '#0D9488';
                      topStripe = '#5EEAD4';
                      botStripe = '#115E59';
                    } else if (currentQ.itemType === 'pencil_red') {
                      shaftColor = '#DC2626';
                      topStripe = '#FCA5A5';
                      botStripe = '#991B1B';
                    } else if (currentQ.itemType === 'pencil_green') {
                      shaftColor = '#16A34A';
                      topStripe = '#86EFAC';
                      botStripe = '#166534';
                    }

                    return (
                      <g>
                        {/* Pink Eraser at exact 0cm (tail of pencil, left-most at x=0) */}
                        <path
                          d="M 14,0 H 6 Q 0,0 0,6 V 24 Q 0,30 6,30 H 14 Z"
                          fill="#F472B6"
                          stroke="#BE185D"
                          strokeWidth="1.5"
                        />
                        {/* Metal ferrule */}
                        <rect
                          x="14"
                          y="0"
                          width="14"
                          height="30"
                          fill="#E2E8F0"
                          stroke="#64748B"
                          strokeWidth="1.5"
                        />
                        <line
                          x1="21"
                          y1="0"
                          x2="21"
                          y2="30"
                          stroke="#94A3B8"
                          strokeWidth="1"
                        />
                        {/* Straight hexagonal pencil shaft: parallel, no curve */}
                        <rect
                          x="28"
                          y="0"
                          width={Math.max(10, objectWidth - 56)}
                          height="30"
                          rx="2"
                          fill={shaftColor}
                          stroke="#78350F"
                          strokeWidth="1.5"
                        />
                        {/* Body straight ridge stripes */}
                        <line
                          x1="28"
                          y1="10"
                          x2={objectWidth - 28}
                          y2="10"
                          stroke={topStripe}
                          strokeWidth="2"
                        />
                        <line
                          x1="28"
                          y1="20"
                          x2={objectWidth - 28}
                          y2="20"
                          stroke={botStripe}
                          strokeWidth="2"
                        />
                        {/* Sharpened wooden cone pointing right */}
                        <polygon
                          points={`${objectWidth - 28},0 ${objectWidth},15 ${objectWidth - 28},30`}
                          fill="#FDE68A"
                          stroke="#78350F"
                          strokeWidth="1.5"
                        />
                        {/* Graphite lead tip pointing right ending exactly at objectWidth (target cm) */}
                        <polygon
                          points={`${objectWidth - 10},9.5 ${objectWidth},15 ${objectWidth - 10},20.5`}
                          fill="#1E293B"
                        />
                      </g>
                    );
                  })()}

                  {/* Eraser Types */}
                  {(currentQ.itemType === 'eraser_blue' || currentQ.itemType === 'eraser_pink') && (
                    <g>
                      <rect
                        x="0"
                        y="4"
                        width={objectWidth}
                        height="26"
                        rx="5"
                        fill={currentQ.itemType === 'eraser_blue' ? '#38BDF8' : '#F472B6'}
                        stroke={currentQ.itemType === 'eraser_blue' ? '#0284C7' : '#DB2777'}
                        strokeWidth="2"
                      />
                      {/* Cardboard sleeve */}
                      <path
                        d={`M 0,4 H ${objectWidth * 0.55} L ${objectWidth * 0.55 - 8},30 H 0 Z`}
                        fill="#FFFFFF"
                        stroke="#CBD5E1"
                        strokeWidth="1.5"
                      />
                      <text
                        x={objectWidth * 0.25}
                        y="21"
                        fill="#0369A1"
                        fontSize="11"
                        fontWeight="900"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        GÔM
                      </text>
                    </g>
                  )}

                  {/* Counting Stick / Ice Cream Stick */}
                  {(currentQ.itemType === 'counting_stick' || currentQ.itemType === 'icecream_stick') && (
                    <g>
                      <rect
                        x="0"
                        y="6"
                        width={objectWidth}
                        height="20"
                        rx="10"
                        fill="#FBBF24"
                        stroke="#B45309"
                        strokeWidth="2"
                      />
                      <line x1="8" y1="16" x2={objectWidth - 8} y2="16" stroke="#FDE68A" strokeWidth="2" />
                    </g>
                  )}

                  {/* Wooden Block */}
                  {currentQ.itemType === 'wooden_block' && (
                    <g>
                      <rect
                        x="0"
                        y="2"
                        width={objectWidth}
                        height="28"
                        rx="4"
                        fill="#38BDF8"
                        stroke="#0369A1"
                        strokeWidth="2"
                      />
                      <rect x="4" y="6" width={objectWidth - 8} height="20" rx="2" fill="#E0F2FE" />
                    </g>
                  )}

                  {/* Crayon Types (orange, blue, red) - Base at 0 cm, wax tip pointing right ending at objectWidth */}
                  {(currentQ.itemType === 'crayon_orange' || currentQ.itemType === 'crayon_blue' || currentQ.itemType === 'crayon_red') && (() => {
                    const crayonPalette =
                      currentQ.itemType === 'crayon_blue'
                        ? { body: '#2563EB', tip: '#1D4ED8', border: '#1E3A8A', highlight: '#93C5FD', shadow: '#1E40AF', wrapper: '#60A5FA' }
                        : currentQ.itemType === 'crayon_red'
                        ? { body: '#DC2626', tip: '#B91C1C', border: '#7F1D1D', highlight: '#FCA5A5', shadow: '#991B1B', wrapper: '#EF4444' }
                        : { body: '#EA580C', tip: '#C2410C', border: '#7C2D12', highlight: '#FDBA74', shadow: '#9A3412', wrapper: '#FB923C' };

                    return (
                      <g>
                        {/* Crayon Body starting at 0cm */}
                        <rect
                          x="0"
                          y="3"
                          width={objectWidth - 18}
                          height="24"
                          rx="2"
                          fill={crayonPalette.body}
                          stroke={crayonPalette.border}
                          strokeWidth="1.5"
                        />
                        {/* 3D Highlight & Shadow */}
                        <line x1="4" y1="7" x2={objectWidth - 22} y2="7" stroke={crayonPalette.highlight} strokeWidth="2" strokeLinecap="round" />
                        <line x1="4" y1="23" x2={objectWidth - 22} y2="23" stroke={crayonPalette.shadow} strokeWidth="2" strokeLinecap="round" />
                        {/* Decorative Wrapper Bands in matching hue */}
                        <line x1={Math.max(14, objectWidth * 0.3)} y1="3" x2={Math.max(14, objectWidth * 0.3)} y2="27" stroke={crayonPalette.wrapper} strokeWidth="3" />
                        <line x1={Math.max(22, objectWidth * 0.65)} y1="3" x2={Math.max(22, objectWidth * 0.65)} y2="27" stroke={crayonPalette.wrapper} strokeWidth="3" />
                        {/* Conical wax tip pointing right ending exactly at objectWidth */}
                        <polygon
                          points={`${objectWidth - 18},3 ${objectWidth},15 ${objectWidth - 18},27`}
                          fill={crayonPalette.tip}
                          stroke={crayonPalette.border}
                          strokeWidth="1.5"
                        />
                      </g>
                    );
                  })()}

                  {/* Small Spoon - Handle at 0 cm, bowl ending at objectWidth */}
                  {currentQ.itemType === 'small_spoon' && (
                    <g>
                      {/* Spoon Handle starting at 0cm */}
                      <path
                        d={`M 0,13 H ${objectWidth - 26} Q ${objectWidth - 24},15 ${objectWidth - 26},17 H 0 Z`}
                        fill="#CBD5E1"
                        stroke="#64748B"
                        strokeWidth="2"
                      />
                      {/* Spoon Bowl at the right ending at objectWidth */}
                      <ellipse cx={objectWidth - 14} cy="15" rx="14" ry="12" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
                      <ellipse cx={objectWidth - 14} cy="15" rx="9" ry="8" fill="#F8FAFC" />
                    </g>
                  )}

                  {/* Toy Key - Bow at 0 cm, shaft & teeth ending at objectWidth */}
                  {currentQ.itemType === 'key_gold' && (
                    <g>
                      {/* Key Bow Ring at 0cm */}
                      <circle cx="15" cy="15" r="14" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
                      <circle cx="15" cy="15" r="6" fill="#FFFBEB" stroke="#B45309" strokeWidth="1.5" />
                      {/* Key Shaft extending right */}
                      <rect x="26" y="12" width={objectWidth - 26} height="6" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                      {/* Teeth */}
                      <rect x={objectWidth - 14} y="18" width="5" height="9" rx="1" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                      <rect x={objectWidth - 24} y="18" width="5" height="6" rx="1" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                    </g>
                  )}

                  {/* Green Leaf - Stem at 0 cm, tip ending at objectWidth */}
                  {currentQ.itemType === 'leaf_green' && (
                    <g>
                      <path
                        d={`M 0,15 Q ${objectWidth * 0.4},0 ${objectWidth},15 Q ${objectWidth * 0.4},30 0,15 Z`}
                        fill="#22C55E"
                        stroke="#15803D"
                        strokeWidth="2"
                      />
                      <line x1="0" y1="15" x2={objectWidth} y2="15" stroke="#166534" strokeWidth="1.5" />
                    </g>
                  )}

                  {/* Purple Pen - Cap at 0 cm, nib pointing right ending at objectWidth */}
                  {currentQ.itemType === 'pen_purple' && (
                    <g>
                      <rect x="0" y="4" width="20" height="22" rx="4" fill="#7E22CE" stroke="#581C87" strokeWidth="2" />
                      <rect x="20" y="7" width={objectWidth - 36} height="16" fill="#A855F7" stroke="#6B21A8" strokeWidth="2" />
                      <polygon points={`${objectWidth - 16},7 ${objectWidth},15 ${objectWidth - 16},23`} fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
                    </g>
                  )}

                  {/* Chalk Box */}
                  {currentQ.itemType === 'chalk_box' && (
                    <g>
                      <rect x="0" y="2" width={objectWidth} height="28" rx="4" fill="#EC4899" stroke="#9D174D" strokeWidth="2" />
                      <text x={objectWidth / 2} y="20" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">
                        PHẤN
                      </text>
                    </g>
                  )}

                  {/* Paper Clip */}
                  {currentQ.itemType === 'paper_clip' && (
                    <g>
                      <path
                        d={`M 6,15 H ${objectWidth - 8} Q ${objectWidth},15 ${objectWidth},8 Q ${objectWidth},2 ${objectWidth - 8},2 H 8 Q 0,2 0,10 Q 0,22 8,22 H ${objectWidth - 12}`}
                        fill="none"
                        stroke="#0284C7"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </g>
                  )}
                </g>

                {/* --- RED GUIDELINE MARKS AT START (0cm) AND END (k cm) --- */}
                {/* 1. Start Zero Guideline: Dashed red line at exact 0cm */}
                <line
                  x1={startZeroX}
                  y1="38"
                  x2={startZeroX}
                  y2="92"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
                {/* 2. End Guideline: Dashed red line at exact answer cm */}
                <line
                  x1={objectEndX}
                  y1="38"
                  x2={objectEndX}
                  y2="92"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />

                {/* --- MATHEMATICALLY PRECISE CENTIMETER RULER --- */}
                {/* Ruler Body */}
                <rect
                  x="18"
                  y="92"
                  width={rulerWidth}
                  height="64"
                  rx="6"
                  fill="url(#rulerBodyGrad)"
                  stroke="#B45309"
                  strokeWidth="2.5"
                />

                {/* Centimeter ticks and numbers */}
                {Array.from({ length: totalRulerCm + 1 }).map((_, cm) => {
                  const x = startZeroX + cm * pixelsPerCm;
                  const isEndMark = cm === currentQ.lengthCm;
                  return (
                    <g key={cm}>
                      {/* Major tick (Centimeter mark) */}
                      <line
                        x1={x}
                        y1="92"
                        x2={x}
                        y2="114"
                        stroke="#78350F"
                        strokeWidth={cm === 0 || isEndMark ? '2.5' : '1.8'}
                      />

                      {/* Half-cm tick (5mm) */}
                      {cm < totalRulerCm && (
                        <line
                          x1={x + pixelsPerCm / 2}
                          y1="92"
                          x2={x + pixelsPerCm / 2}
                          y2="106"
                          stroke="#92400E"
                          strokeWidth="1.2"
                        />
                      )}

                      {/* Millimeter ticks */}
                      {cm < totalRulerCm &&
                        [1, 2, 3, 4, 6, 7, 8, 9].map((mm) => (
                          <line
                            key={mm}
                            x1={x + (pixelsPerCm / 10) * mm}
                            y1="92"
                            x2={x + (pixelsPerCm / 10) * mm}
                            y2="99"
                            stroke="#B45309"
                            strokeWidth="0.8"
                          />
                        ))}

                      {/* Centimeter Number Label */}
                      <text
                        x={x}
                        y="136"
                        textAnchor="middle"
                        fill={isEndMark && isCorrect ? '#15803D' : '#451A03'}
                        fontSize={cm === 0 || isEndMark ? '14' : '13'}
                        fontWeight="900"
                        fontFamily="'Be Vietnam Pro', system-ui, sans-serif"
                      >
                        {cm}
                      </text>
                    </g>
                  );
                })}

                {/* Ruler unit label "cm" */}
                <text
                  x={rulerWidth - 14}
                  y="136"
                  fill="#92400E"
                  fontSize="12"
                  fontWeight="900"
                  fontFamily="'Be Vietnam Pro', system-ui, sans-serif"
                >
                  cm
                </text>
              </svg>

              {/* Start guide note */}
              <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-amber-900/90">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span>Một đầu vật bắt đầu tại vạch 0 cm – Đầu còn lại chỉ vào vạch số mấy?</span>
              </div>
            </div>
          </div>

          {/* 3. Feedback notification message */}
          {feedbackMsg && (
            <div
              className={`text-center py-1 px-3 rounded-full text-xs sm:text-sm font-black mx-auto shadow-2xs transition-all ${
                isCorrect
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 animate-bounce'
                  : 'bg-rose-100 text-rose-900 border border-rose-300 animate-shake'
              }`}
            >
              {feedbackMsg}
            </div>
          )}

          {/* 4. Four Large Answer Buttons */}
          <div className="w-full max-w-xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 shrink-0">
            {options.map((opt) => {
              const isSelected = selectedOption === opt;
              let btnStyle =
                'bg-white hover:bg-amber-50 text-slate-800 border-2 border-amber-300 hover:border-amber-500 shadow-2xs';

              if (isSelected) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500 text-white border-2 border-emerald-600 ring-4 ring-emerald-200 scale-102';
                } else {
                  btnStyle = 'bg-rose-100 text-rose-950 border-2 border-rose-400 ring-4 ring-rose-200 animate-shake';
                }
              }

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={`min-h-[44px] sm:min-h-[48px] px-3 py-1.5 rounded-2xl font-['Be_Vietnam_Pro'] font-black text-sm sm:text-base transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95 ${btnStyle}`}
                >
                  <span>{opt} cm</span>
                  {isSelected && isCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
                  {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* 5. Congratulations Victory Screen */
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none space-y-3 sm:space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-white shadow-xl flex items-center justify-center text-3xl sm:text-4xl animate-bounce">
            📏
          </div>

          <div className="space-y-1">
            <h3 className="font-['Be_Vietnam_Pro'] font-black text-2xl sm:text-3xl text-slate-900 drop-shadow-xs">
              HOÀN THÀNH XUẤT SẮC!
            </h3>
            <p className="text-xs sm:text-sm font-bold text-amber-900/90">
              Bé đã làm chủ kỹ năng đo độ dài bằng thước xăng-ti-mét!
            </p>
          </div>

          {/* Stats Box */}
          <div className="bg-white/95 rounded-2xl p-4 border-2 border-amber-300 shadow-sm max-w-sm w-full space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700">
              <span>Số câu trả lời đúng:</span>
              <span className="font-black text-emerald-600 text-base">{correctCount}/5 câu</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700">
              <span>Phần thưởng đạt được:</span>
              <span className="font-black text-amber-600 text-base inline-flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>+2 Ngôi sao ⭐</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700">
              <span>Huy hiệu khen thưởng:</span>
              <span className="font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                Bậc Thầy Đo Lường
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={initializeGame}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>CHƠI LẠI LƯỢT MỚI</span>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>VỀ KHU VỰC 6</span>
            </button>
          </div>
        </div>
      )}
    </FullscreenStage>
  );
};
