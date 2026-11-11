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
  Star,
  Flag,
} from 'lucide-react';

interface WhoIsLongerGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

type QuestionType = 'find_longer' | 'find_shorter' | 'compare_equal';

interface ComparisonPair {
  id: string;
  type: QuestionType;
  promptVi: string;
  promptEn: string;
  itemA: {
    nameVi: string;
    nameEn: string;
    units: number; // proportional length units (e.g. 5 to 10)
    colorTheme: 'red' | 'blue' | 'yellow' | 'pink' | 'emerald' | 'purple' | 'amber';
    category: 'pencil' | 'ribbon' | 'stick' | 'crayon' | 'leaf';
  };
  itemB: {
    nameVi: string;
    nameEn: string;
    units: number;
    colorTheme: 'red' | 'blue' | 'yellow' | 'pink' | 'emerald' | 'purple' | 'amber';
    category: 'pencil' | 'ribbon' | 'stick' | 'crayon' | 'leaf';
  };
  options: string[];
  correctAnswer: string;
}

const COMPARISON_BANK: ComparisonPair[] = [
  // --- DẠNG 1: TÌM VẬT DÀI HƠN ---
  {
    id: 'p1',
    type: 'find_longer',
    promptVi: 'Chiếc bút chì nào dài hơn?',
    promptEn: 'Which pencil is longer?',
    itemA: { nameVi: 'Bút chì đỏ', nameEn: 'Red pencil', units: 9, colorTheme: 'red', category: 'pencil' },
    itemB: { nameVi: 'Bút chì xanh', nameEn: 'Blue pencil', units: 6, colorTheme: 'blue', category: 'pencil' },
    options: ['Bút chì đỏ', 'Bút chì xanh'],
    correctAnswer: 'Bút chì đỏ',
  },
  {
    id: 'p2',
    type: 'find_longer',
    promptVi: 'Dải ruy băng nào dài hơn?',
    promptEn: 'Which ribbon is longer?',
    itemA: { nameVi: 'Ruy băng xanh lá', nameEn: 'Green ribbon', units: 5, colorTheme: 'emerald', category: 'ribbon' },
    itemB: { nameVi: 'Ruy băng vàng', nameEn: 'Yellow ribbon', units: 8, colorTheme: 'yellow', category: 'ribbon' },
    options: ['Ruy băng xanh lá', 'Ruy băng vàng'],
    correctAnswer: 'Ruy băng vàng',
  },
  {
    id: 'p3',
    type: 'find_longer',
    promptVi: 'Chiếc que nào dài hơn?',
    promptEn: 'Which stick is longer?',
    itemA: { nameVi: 'Que gỗ cam', nameEn: 'Orange stick', units: 10, colorTheme: 'amber', category: 'stick' },
    itemB: { nameVi: 'Que gỗ tím', nameEn: 'Purple stick', units: 7, colorTheme: 'purple', category: 'stick' },
    options: ['Que gỗ cam', 'Que gỗ tím'],
    correctAnswer: 'Que gỗ cam',
  },
  {
    id: 'p4',
    type: 'find_longer',
    promptVi: 'Bút sáp màu nào dài hơn?',
    promptEn: 'Which crayon is longer?',
    itemA: { nameVi: 'Bút sáp hồng', nameEn: 'Pink crayon', units: 6, colorTheme: 'pink', category: 'crayon' },
    itemB: { nameVi: 'Bút sáp xanh dương', nameEn: 'Blue crayon', units: 9, colorTheme: 'blue', category: 'crayon' },
    options: ['Bút sáp hồng', 'Bút sáp xanh dương'],
    correctAnswer: 'Bút sáp xanh dương',
  },

  // --- DẠNG 2: TÌM VẬT NGẮN HƠN ---
  {
    id: 'p5',
    type: 'find_shorter',
    promptVi: 'Dải ruy băng nào ngắn hơn?',
    promptEn: 'Which ribbon is shorter?',
    itemA: { nameVi: 'Ruy băng tím', nameEn: 'Purple ribbon', units: 5, colorTheme: 'purple', category: 'ribbon' },
    itemB: { nameVi: 'Ruy băng hồng', nameEn: 'Pink ribbon', units: 9, colorTheme: 'pink', category: 'ribbon' },
    options: ['Ruy băng tím', 'Ruy băng hồng'],
    correctAnswer: 'Ruy băng tím',
  },
  {
    id: 'p6',
    type: 'find_shorter',
    promptVi: 'Chiếc bút chì nào ngắn hơn?',
    promptEn: 'Which pencil is shorter?',
    itemA: { nameVi: 'Bút chì vàng', nameEn: 'Yellow pencil', units: 8, colorTheme: 'yellow', category: 'pencil' },
    itemB: { nameVi: 'Bút chì đỏ', nameEn: 'Red pencil', units: 4, colorTheme: 'red', category: 'pencil' },
    options: ['Bút chì vàng', 'Bút chì đỏ'],
    correctAnswer: 'Bút chì đỏ',
  },
  {
    id: 'p7',
    type: 'find_shorter',
    promptVi: 'Chiếc que nào ngắn hơn?',
    promptEn: 'Which stick is shorter?',
    itemA: { nameVi: 'Que gỗ xanh', nameEn: 'Blue stick', units: 6, colorTheme: 'blue', category: 'stick' },
    itemB: { nameVi: 'Que gỗ vàng', nameEn: 'Yellow stick', units: 10, colorTheme: 'amber', category: 'stick' },
    options: ['Que gỗ xanh', 'Que gỗ vàng'],
    correctAnswer: 'Que gỗ xanh',
  },
  {
    id: 'p8',
    type: 'find_shorter',
    promptVi: 'Chiếc lá nào ngắn hơn?',
    promptEn: 'Which leaf is shorter?',
    itemA: { nameVi: 'Chiếc lá xanh đậm', nameEn: 'Dark green leaf', units: 5, colorTheme: 'emerald', category: 'leaf' },
    itemB: { nameVi: 'Chiếc lá vàng', nameEn: 'Yellow leaf', units: 8, colorTheme: 'yellow', category: 'leaf' },
    options: ['Chiếc lá xanh đậm', 'Chiếc lá vàng'],
    correctAnswer: 'Chiếc lá xanh đậm',
  },

  // --- DẠNG 3: SO SÁNH BẰNG NHAU ---
  {
    id: 'p9',
    type: 'compare_equal',
    promptVi: 'Hai chiếc que có độ dài như thế nào?',
    promptEn: 'How do the lengths of the two sticks compare?',
    itemA: { nameVi: 'Que gỗ đỏ', nameEn: 'Red stick', units: 7, colorTheme: 'red', category: 'stick' },
    itemB: { nameVi: 'Que gỗ xanh', nameEn: 'Blue stick', units: 7, colorTheme: 'blue', category: 'stick' },
    options: ['Que gỗ đỏ dài hơn', 'Que gỗ xanh dài hơn', 'Hai que dài bằng nhau'],
    correctAnswer: 'Hai que dài bằng nhau',
  },
  {
    id: 'p10',
    type: 'compare_equal',
    promptVi: 'Hai dải ruy băng có độ dài như thế nào?',
    promptEn: 'How do the lengths of the two ribbons compare?',
    itemA: { nameVi: 'Ruy băng hồng', nameEn: 'Pink ribbon', units: 8, colorTheme: 'pink', category: 'ribbon' },
    itemB: { nameVi: 'Ruy băng vàng', nameEn: 'Yellow ribbon', units: 8, colorTheme: 'yellow', category: 'ribbon' },
    options: ['Ruy băng hồng dài hơn', 'Ruy băng vàng dài hơn', 'Hai dải ruy băng dài bằng nhau'],
    correctAnswer: 'Hai dải ruy băng dài bằng nhau',
  },
  {
    id: 'p11',
    type: 'compare_equal',
    promptVi: 'Hai chiếc bút chì có độ dài như thế nào?',
    promptEn: 'How do the lengths of the two pencils compare?',
    itemA: { nameVi: 'Bút chì vàng', nameEn: 'Yellow pencil', units: 6, colorTheme: 'yellow', category: 'pencil' },
    itemB: { nameVi: 'Bút chì xanh', nameEn: 'Blue pencil', units: 6, colorTheme: 'blue', category: 'pencil' },
    options: ['Bút chì vàng dài hơn', 'Bút chì xanh dài hơn', 'Hai bút chì dài bằng nhau'],
    correctAnswer: 'Hai bút chì dài bằng nhau',
  },
  {
    id: 'p12',
    type: 'find_longer',
    promptVi: 'Vật nào dài hơn?',
    promptEn: 'Which item is longer?',
    itemA: { nameVi: 'Bút sáp cam', nameEn: 'Orange crayon', units: 8, colorTheme: 'amber', category: 'crayon' },
    itemB: { nameVi: 'Bút sáp tím', nameEn: 'Purple crayon', units: 5, colorTheme: 'purple', category: 'crayon' },
    options: ['Bút sáp cam', 'Bút sáp tím'],
    correctAnswer: 'Bút sáp cam',
  },
  {
    id: 'p13',
    type: 'find_longer',
    promptVi: 'Chiếc bút sáp nào dài hơn?',
    promptEn: 'Which crayon is longer?',
    itemA: { nameVi: 'Bút sáp xanh dương', nameEn: 'Blue crayon', units: 8, colorTheme: 'blue', category: 'crayon' },
    itemB: { nameVi: 'Bút sáp đỏ', nameEn: 'Red crayon', units: 5, colorTheme: 'red', category: 'crayon' },
    options: ['Bút sáp xanh dương', 'Bút sáp đỏ'],
    correctAnswer: 'Bút sáp xanh dương',
  },
  {
    id: 'p14',
    type: 'find_shorter',
    promptVi: 'Chiếc bút sáp nào ngắn hơn?',
    promptEn: 'Which crayon is shorter?',
    itemA: { nameVi: 'Bút sáp vàng', nameEn: 'Yellow crayon', units: 6, colorTheme: 'yellow', category: 'crayon' },
    itemB: { nameVi: 'Bút sáp xanh lá', nameEn: 'Green crayon', units: 9, colorTheme: 'emerald', category: 'crayon' },
    options: ['Bút sáp vàng', 'Bút sáp xanh lá'],
    correctAnswer: 'Bút sáp vàng',
  },
  {
    id: 'p15',
    type: 'compare_equal',
    promptVi: 'Hai chiếc bút sáp có độ dài như thế nào?',
    promptEn: 'How do the lengths of the two crayons compare?',
    itemA: { nameVi: 'Bút sáp xanh dương', nameEn: 'Blue crayon', units: 7, colorTheme: 'blue', category: 'crayon' },
    itemB: { nameVi: 'Bút sáp đỏ', nameEn: 'Red crayon', units: 7, colorTheme: 'red', category: 'crayon' },
    options: ['Bút sáp xanh dương dài hơn', 'Bút sáp đỏ dài hơn', 'Hai bút sáp dài bằng nhau'],
    correctAnswer: 'Hai bút sáp dài bằng nhau',
  },
];

// 100% faithful crayon color themes with unified body & tip
const CRAYON_COLOR_PALETTES: Record<
  string,
  { body: string; tip: string; highlight: string; shadow: string; border: string; wrapper: string }
> = {
  blue: {
    body: '#2563EB',      // pure vivid blue
    tip: '#1D4ED8',       // deep rich blue tip
    highlight: '#93C5FD', // soft light blue shine
    shadow: '#1E40AF',    // deep blue shadow
    border: '#1E3A8A',    // dark navy border
    wrapper: '#60A5FA',   // sky blue band
  },
  red: {
    body: '#DC2626',      // vivid red
    tip: '#B91C1C',       // deep red tip
    highlight: '#FCA5A5', // light red shine
    shadow: '#991B1B',    // shadow
    border: '#7F1D1D',    // dark red border
    wrapper: '#EF4444',   // red band
  },
  yellow: {
    body: '#EAB308',      // vibrant yellow
    tip: '#CA8A04',       // golden yellow tip
    highlight: '#FEF08A', // pale yellow shine
    shadow: '#A16207',    // golden brown shadow
    border: '#713F12',    // brown border
    wrapper: '#FDE047',   // yellow band
  },
  emerald: {
    body: '#16A34A',      // clear green
    tip: '#15803D',       // forest green tip
    highlight: '#86EFAC', // light green shine
    shadow: '#166534',    // dark green shadow
    border: '#14532D',    // border
    wrapper: '#4ADE80',   // green band
  },
  amber: {
    body: '#EA580C',      // bright orange
    tip: '#C2410C',       // deep orange tip
    highlight: '#FDBA74', // peach highlight
    shadow: '#9A3412',    // shadow
    border: '#7C2D12',    // border
    wrapper: '#FB923C',   // orange band
  },
  pink: {
    body: '#DB2777',      // vibrant pink
    tip: '#BE185D',       // deep pink tip
    highlight: '#F9A8D4', // light pink shine
    shadow: '#9D174D',    // shadow
    border: '#831843',    // border
    wrapper: '#F472B6',   // pink band
  },
  purple: {
    body: '#7C3AED',      // bright purple
    tip: '#6D28D9',       // deep violet tip
    highlight: '#C4B5FD', // lavender shine
    shadow: '#5B21B6',    // shadow
    border: '#4C1D95',    // border
    wrapper: '#A78BFA',   // purple band
  },
};

export const WhoIsLongerGame: React.FC<WhoIsLongerGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [questions, setQuestions] = useState<ComparisonPair[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const autoNextTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize 5 questions: mix of longer, shorter, and equal
  const initializeGame = () => {
    if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
    soundService.cancelSpeech();
    setIsPlayingAudio(false);

    // Pick 2 find_longer, 2 find_shorter, and 1 compare_equal for balanced learning
    const longerPool = COMPARISON_BANK.filter((q) => q.type === 'find_longer').sort(() => Math.random() - 0.5);
    const shorterPool = COMPARISON_BANK.filter((q) => q.type === 'find_shorter').sort(() => Math.random() - 0.5);
    const equalPool = COMPARISON_BANK.filter((q) => q.type === 'compare_equal').sort(() => Math.random() - 0.5);

    const selection = [
      longerPool[0],
      shorterPool[0],
      longerPool[1],
      equalPool[0],
      shorterPool[1],
    ].sort(() => Math.random() - 0.5);

    setQuestions(selection);
    setCurrentIdx(0);
    setCorrectCount(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setFeedbackMsg(null);
    setIsCompleted(false);
    setStartTime(Date.now());
  };

  useEffect(() => {
    initializeGame();
    return () => {
      soundService.cancelSpeech();
      if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
    };
  }, []);

  const currentQ = questions[currentIdx];

  const handlePlayVoice = () => {
    if (!currentQ) return;
    soundService.cancelSpeech();
    setIsPlayingAudio(true);
    soundService.speakEn(currentQ.promptEn, {
      slow: true,
      onEnd: () => setIsPlayingAudio(false),
    });
  };

  const handleSelectAnswer = (ans: string) => {
    if (isCorrect === true || !currentQ) return;

    soundService.cancelSpeech();
    setIsPlayingAudio(false);
    soundService.playClick();
    setSelectedAnswer(ans);

    if (ans === currentQ.correctAnswer) {
      setIsCorrect(true);
      setCorrectCount((prev) => prev + 1);
      setFeedbackMsg(`Đúng rồi! Bạn quan sát rất tinh mắt! 🎉`);
      soundEffects.correct();

      confetti({
        particleCount: 26,
        spread: 55,
        origin: { y: 0.75 },
        colors: ['#22c55e', '#38bdf8', '#fbbf24', '#f59e0b', '#ec4899'],
      });

      autoNextTimerRef.current = setTimeout(() => {
        if (currentIdx + 1 < questions.length) {
          setCurrentIdx((prev) => prev + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setFeedbackMsg(null);
        } else {
          finishGame(correctCount + 1);
        }
      }, 900);
    } else {
      setIsCorrect(false);
      setFeedbackMsg('Chưa chính xác rồi! Bé hãy so sánh xem vật nào vươn xa hơn từ vạch bắt đầu nhé!');
      soundEffects.wrong();
    }
  };

  const finishGame = (finalCorrect: number) => {
    setIsCompleted(true);
    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);

    const starsToAward = finalCorrect >= 4 ? 2 : 1;
    StorageService.recordActivity(student.id, {
      type: 'game',
      targetId: 'who-is-longer',
      targetName: 'Ai Dài Hơn?',
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

  // Coordinate Calculations:
  // Baseline (Vạch bắt đầu) is at x = 70.
  // 1 unit = 38px
  const baselineX = 70;
  const unitPx = 38;
  const lenAPx = (currentQ?.itemA.units ?? 5) * unitPx;
  const lenBPx = (currentQ?.itemB.units ?? 5) * unitPx;

  // Helper renderer for item graphic
  const renderItemGraphic = (
    item: typeof currentQ.itemA,
    widthPx: number,
    yPos: number,
    isWinner: boolean
  ) => {
    const isSelected = selectedAnswer?.includes(item.nameVi);

    return (
      <g
        transform={`translate(${baselineX}, ${yPos})`}
        className={isWinner && isCorrect ? 'animate-pulse' : ''}
      >
        {/* Glow halo when correctly chosen */}
        {isWinner && isCorrect && (
          <rect
            x="-4"
            y="-4"
            width={widthPx + 8}
            height="36"
            rx="8"
            fill="#86EFAC"
            opacity="0.6"
            className="animate-ping"
          />
        )}

        {/* Pencil Category - Eraser at baseline (x=0), tip pointing right to widthPx */}
        {item.category === 'pencil' && (() => {
          const pencilFill =
            item.colorTheme === 'red'
              ? '#EF4444'
              : item.colorTheme === 'yellow'
              ? '#F59E0B'
              : item.colorTheme === 'emerald'
              ? '#10B981'
              : item.colorTheme === 'pink'
              ? '#EC4899'
              : item.colorTheme === 'purple'
              ? '#8B5CF6'
              : '#0284C7';

          return (
            <g>
              {/* Pink Eraser at 0 (touching baseline) */}
              <path
                d="M 12,2 H 6 Q 0,2 0,7 V 21 Q 0,26 6,26 H 12 Z"
                fill="#F472B6"
                stroke="#BE185D"
                strokeWidth="1.5"
              />
              {/* Metal Ferrule */}
              <rect x="12" y="2" width="12" height="24" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
              <line x1="18" y1="2" x2="18" y2="26" stroke="#94A3B8" strokeWidth="1" />
              {/* Pencil Shaft */}
              <rect
                x="24"
                y="2"
                width={Math.max(10, widthPx - 48)}
                height="24"
                rx="2"
                fill={pencilFill}
                stroke="#78350F"
                strokeWidth="1.5"
              />
              <line x1="24" y1="9" x2={widthPx - 24} y2="9" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />
              <line x1="24" y1="18" x2={widthPx - 24} y2="18" stroke="#000000" strokeWidth="1.5" opacity="0.2" />
              {/* Sharpened wooden cone pointing right */}
              <polygon
                points={`${widthPx - 24},2 ${widthPx},14 ${widthPx - 24},26`}
                fill="#FDE68A"
                stroke="#78350F"
                strokeWidth="1.5"
              />
              {/* Graphite lead tip pointing right ending exactly at widthPx */}
              <polygon points={`${widthPx - 9},9.5 ${widthPx},14 ${widthPx - 9},18.5`} fill="#1E293B" />
            </g>
          );
        })()}

        {/* Ribbon Category - Straight horizontal ribbon */}
        {item.category === 'ribbon' && (
          <g>
            <rect
              x="0"
              y="5"
              width={widthPx}
              height="18"
              rx="4"
              fill={
                item.colorTheme === 'yellow'
                  ? '#EAB308'
                  : item.colorTheme === 'pink'
                  ? '#EC4899'
                  : item.colorTheme === 'purple'
                  ? '#A855F7'
                  : '#10B981'
              }
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            <line
              x1="4"
              y1="14"
              x2={widthPx - 4}
              y2="14"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeDasharray="6 4"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>
        )}

        {/* Stick Category */}
        {item.category === 'stick' && (
          <g>
            <rect
              x="0"
              y="4"
              width={widthPx}
              height="20"
              rx="10"
              fill={
                item.colorTheme === 'amber'
                  ? '#F59E0B'
                  : item.colorTheme === 'purple'
                  ? '#8B5CF6'
                  : item.colorTheme === 'red'
                  ? '#EF4444'
                  : '#3B82F6'
              }
              stroke="#78350F"
              strokeWidth="2"
            />
            <circle cx="10" cy="14" r="3" fill="#FFFFFF" opacity="0.6" />
            <circle cx={widthPx - 10} cy="14" r="3" fill="#FFFFFF" opacity="0.6" />
          </g>
        )}

        {/* Crayon Category - Base at 0 (baseline), wax tip pointing right ending at widthPx, 100% unified hue */}
        {item.category === 'crayon' && (() => {
          const cp = CRAYON_COLOR_PALETTES[item.colorTheme] || CRAYON_COLOR_PALETTES.blue;
          return (
            <g>
              {/* Crayon Body starting at baseline x = 0 */}
              <rect
                x="0"
                y="3"
                width={widthPx - 16}
                height="22"
                rx="2"
                fill={cp.body}
                stroke={cp.border}
                strokeWidth="1.5"
              />
              {/* 3D Highlight & Shadow */}
              <line x1="4" y1="7" x2={widthPx - 20} y2="7" stroke={cp.highlight} strokeWidth="2" strokeLinecap="round" />
              <line x1="4" y1="21" x2={widthPx - 20} y2="21" stroke={cp.shadow} strokeWidth="2" strokeLinecap="round" />
              {/* Decorative Wrapper Bands in matching hue */}
              <line x1={Math.max(12, widthPx * 0.3)} y1="3" x2={Math.max(12, widthPx * 0.3)} y2="25" stroke={cp.wrapper} strokeWidth="2.5" />
              <line x1={Math.max(20, widthPx * 0.65)} y1="3" x2={Math.max(20, widthPx * 0.65)} y2="25" stroke={cp.wrapper} strokeWidth="2.5" />
              {/* Conical wax tip pointing right ending exactly at widthPx */}
              <polygon
                points={`${widthPx - 16},3 ${widthPx},14 ${widthPx - 16},25`}
                fill={cp.tip}
                stroke={cp.border}
                strokeWidth="1.5"
              />
            </g>
          );
        })()}

        {/* Leaf Category */}
        {item.category === 'leaf' && (
          <g>
            <path
              d={`M 0,14 Q ${widthPx * 0.4},0 ${widthPx},14 Q ${widthPx * 0.4},28 0,14 Z`}
              fill={item.colorTheme === 'emerald' ? '#16A34A' : '#EAB308'}
              stroke="#14532D"
              strokeWidth="2"
            />
            <line x1="0" y1="14" x2={widthPx} y2="14" stroke="#14532D" strokeWidth="1.5" />
          </g>
        )}

        {/* Name Badge on the left */}
        <text
          x="-12"
          y="18"
          fill="#334155"
          fontSize="12"
          fontWeight="900"
          textAnchor="end"
          fontFamily="'Be Vietnam Pro', sans-serif"
        >
          {item.nameVi}
        </text>
      </g>
    );
  };

  const isAWinner =
    currentQ &&
    ((currentQ.type === 'find_longer' && currentQ.itemA.units > currentQ.itemB.units) ||
      (currentQ.type === 'find_shorter' && currentQ.itemA.units < currentQ.itemB.units) ||
      (currentQ.type === 'compare_equal' && currentQ.itemA.units === currentQ.itemB.units));

  const isBWinner =
    currentQ &&
    ((currentQ.type === 'find_longer' && currentQ.itemB.units > currentQ.itemA.units) ||
      (currentQ.type === 'find_shorter' && currentQ.itemB.units < currentQ.itemA.units) ||
      (currentQ.type === 'compare_equal' && currentQ.itemA.units === currentQ.itemB.units));

  return (
    <FullscreenStage
      titleVi="AI DÀI HƠN?"
      titleEn="Who Is Longer?"
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
      className="bg-gradient-to-b from-orange-50/60 via-amber-50/40 to-yellow-50/40"
    >
      {!isCompleted ? (
        <div className="w-full h-full flex flex-col justify-between p-2 sm:p-3 select-none">
          {/* 1. Header & Question */}
          <div className="text-center shrink-0">
            <h2 className="font-['Be_Vietnam_Pro'] font-extrabold text-slate-900 text-sm sm:text-base md:text-lg leading-tight">
              {currentQ.promptVi}
            </h2>
            <div className="mt-0.5 inline-flex items-center justify-center gap-1.5 flex-wrap">
              <span className="text-[11px] sm:text-xs font-bold text-amber-900/80">
                {currentQ.promptEn}
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

          {/* 2. Precision Comparison Visual Stage */}
          <div className="flex-1 min-h-0 flex items-center justify-center py-1">
            <div className="w-full max-w-2xl bg-white/95 rounded-2xl p-2 sm:p-3 border-2 border-amber-200 shadow-sm flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 580 155"
                className="w-full h-auto max-h-[145px] sm:max-h-[160px] select-none overflow-visible"
              >
                {/* Background Grid Lines to assist visual alignment */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((u) => (
                  <line
                    key={u}
                    x1={baselineX + u * unitPx}
                    y1="15"
                    x2={baselineX + u * unitPx}
                    y2="135"
                    stroke="#F1F5F9"
                    strokeWidth="1.5"
                    strokeDasharray="2 3"
                  />
                ))}

                {/* Common Starting Baseline (Vạch xuất phát) */}
                <g>
                  {/* Thick Start Guideline */}
                  <line
                    x1={baselineX}
                    y1="10"
                    x2={baselineX}
                    y2="140"
                    stroke="#EF4444"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Checkered Start Post */}
                  <rect x={baselineX - 8} y="8" width="8" height="134" fill="#EF4444" rx="2" />
                  <rect x={baselineX - 6} y="15" width="4" height="12" fill="#FFFFFF" />
                  <rect x={baselineX - 6} y="45" width="4" height="12" fill="#FFFFFF" />
                  <rect x={baselineX - 6} y="75" width="4" height="12" fill="#FFFFFF" />
                  <rect x={baselineX - 6} y="105" width="4" height="12" fill="#FFFFFF" />
                  {/* Flag on top */}
                  <g transform={`translate(${baselineX - 22}, 2)`}>
                    <polygon points="0,0 16,6 0,12" fill="#EF4444" />
                  </g>
                  {/* Label */}
                  <text
                    x={baselineX}
                    y="150"
                    fill="#DC2626"
                    fontSize="10"
                    fontWeight="900"
                    textAnchor="middle"
                    fontFamily="'Be Vietnam Pro', sans-serif"
                  >
                    VẠCH BẮT ĐẦU
                  </text>
                </g>

                {/* Object 1 (Item A) */}
                {renderItemGraphic(currentQ.itemA, lenAPx, 30, isAWinner)}

                {/* Object 2 (Item B) */}
                {renderItemGraphic(currentQ.itemB, lenBPx, 85, isBWinner)}
              </svg>

              <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-amber-900/90">
                <Flag className="w-3.5 h-3.5 text-red-500 fill-red-400" />
                <span>Hai đồ vật được đặt CÙNG MỘT VẠCH BẮT ĐẦU để bé so sánh trực quan!</span>
              </div>
            </div>
          </div>

          {/* 3. Feedback message */}
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

          {/* 4. Large Answer Buttons */}
          <div
            className={`w-full max-w-xl mx-auto grid gap-2 sm:gap-3 shrink-0 ${
              currentQ.options.length === 2 ? 'grid-cols-2 max-w-md' : 'grid-cols-1 sm:grid-cols-3'
            }`}
          >
            {currentQ.options.map((opt) => {
              const isSelected = selectedAnswer === opt;
              let btnStyle =
                'bg-white hover:bg-orange-50 text-slate-800 border-2 border-amber-300 hover:border-amber-500 shadow-2xs';

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
                  onClick={() => handleSelectAnswer(opt)}
                  className={`min-h-[44px] sm:min-h-[48px] px-3.5 py-1.5 rounded-2xl font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm md:text-base transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${btnStyle}`}
                >
                  <span className="text-center">{opt}</span>
                  {isSelected && isCorrect && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                  {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* 5. Congratulations Victory Screen */
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none space-y-3 sm:space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 border-4 border-white shadow-xl flex items-center justify-center text-3xl sm:text-4xl animate-bounce">
            📐
          </div>

          <div className="space-y-1">
            <h3 className="font-['Be_Vietnam_Pro'] font-black text-2xl sm:text-3xl text-slate-900 drop-shadow-xs">
              HOÀN THÀNH XUẤT SẮC!
            </h3>
            <p className="text-xs sm:text-sm font-bold text-amber-900/90">
              Bé đã làm chủ kỹ năng so sánh độ dài đồ vật!
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
                Nhà Thám Hiểm Đo Độ Dài
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
