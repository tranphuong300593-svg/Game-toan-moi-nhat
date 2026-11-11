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
import { Volume2, VolumeX, RotateCcw, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

interface MagicTimeTrainGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

interface StationConfig {
  id: number;
  stationNameVi: string;
  stationNameEn: string;
  theme: 'sunrise' | 'school' | 'park' | 'lunch' | 'home';
  targetHour: number;
  questionVi: string;
  questionEn: string;
  options: number[];
  animal: {
    nameVi: string;
    nameEn: string;
    emoji: string;
  };
  destinationNoteVi: string;
}

const STATIONS_DATA: StationConfig[] = [
  {
    id: 1,
    stationNameVi: 'Ga 1 – Bình Minh',
    stationNameEn: 'Station 1 – Sunrise',
    theme: 'sunrise',
    targetHour: 6,
    questionVi: 'Tìm đồng hồ chỉ 6 giờ!',
    questionEn: 'Find six o\'clock!',
    options: [5, 6, 8],
    animal: { nameVi: 'Thỏ Trắng', nameEn: 'White Bunny', emoji: '🐰' },
    destinationNoteVi: 'Tàu đến ga Bình Minh, Thỏ Trắng lên tàu!',
  },
  {
    id: 2,
    stationNameVi: 'Ga 2 – Đến Trường',
    stationNameEn: 'Station 2 – School',
    theme: 'school',
    targetHour: 7,
    questionVi: 'Tìm đồng hồ chỉ 7 giờ!',
    questionEn: 'Find seven o\'clock!',
    options: [7, 9, 10],
    animal: { nameVi: 'Sóc Nâu', nameEn: 'Brown Squirrel', emoji: '🐿️' },
    destinationNoteVi: 'Tàu đến ga Trường Học, Sóc Nâu lên tàu!',
  },
  {
    id: 3,
    stationNameVi: 'Ga 3 – Công Viên',
    stationNameEn: 'Station 3 – City Park',
    theme: 'park',
    targetHour: 9,
    questionVi: 'Tìm đồng hồ chỉ 9 giờ!',
    questionEn: 'Find nine o\'clock!',
    options: [8, 10, 9],
    animal: { nameVi: 'Gấu Con', nameEn: 'Baby Bear', emoji: '🐻' },
    destinationNoteVi: 'Tàu đến công viên, Gấu Con lên tàu!',
  },
  {
    id: 4,
    stationNameVi: 'Ga 4 – Ăn Trưa',
    stationNameEn: 'Station 4 – Lunch',
    theme: 'lunch',
    targetHour: 11,
    questionVi: 'Tìm đồng hồ chỉ 11 giờ!',
    questionEn: 'Find eleven o\'clock!',
    options: [11, 12, 10],
    animal: { nameVi: 'Mèo Con', nameEn: 'Little Cat', emoji: '🐱' },
    destinationNoteVi: 'Tàu đến ga Ăn Trưa, Mèo Con lên tàu!',
  },
  {
    id: 5,
    stationNameVi: 'Ga 5 – Về Nhà',
    stationNameEn: 'Station 5 – Home',
    theme: 'home',
    targetHour: 5,
    questionVi: 'Tìm đồng hồ chỉ 5 giờ!',
    questionEn: 'Find five o\'clock!',
    options: [4, 6, 5],
    animal: { nameVi: 'Tất cả các bạn', nameEn: 'All Friends', emoji: '🎉' },
    destinationNoteVi: 'Tàu đến ga Về Nhà, tất cả hành khách xuống tàu!',
  },
];

const CORRECT_PRAISES = ['Great job!', 'Well done!', 'Excellent!', 'Amazing!', 'Fantastic!'];
const WRONG_ENCOURAGEMENTS = ['Try again!', 'Almost there!', 'Keep trying!', 'You can do it!'];

function shuffle<T>(arr: T[]): T[] {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

/**
 * High-precision SVG Analog Clock
 * - Strictly 12 numbers clearly drawn
 * - Hands never touch or obscure numbers
 * - Long minute hand (points to 12)
 * - Short hour hand (points to target hour)
 * - Pivots exactly at center
 * - Clean natural colors (no red number highlights)
 */
const SvgAnalogClock: React.FC<{ hour: number; size?: number }> = ({ hour, size = 110 }) => {
  const hourAngle = (hour % 12) * 30;

  // Polar coordinate helper for 12 numbers
  const numberPositions = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => {
    const angle = (h % 12) * 30;
    const rad = (angle - 90) * (Math.PI / 180);
    // Radius from center (50) is 34.5; leaves safe 5.5px inner margin from bezel at 44
    const x = 50 + 34.5 * Math.cos(rad);
    const y = 50 + 34.5 * Math.sin(rad) + 2.8; // optical vertical align
    return { h, x, y };
  });

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="drop-shadow-md select-none shrink-0"
    >
      <defs>
        {/* Bezel gradient */}
        <radialGradient id="bezelGrad" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="70%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
        {/* Dial Face gradient */}
        <radialGradient id="dialGrad" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="85%" stopColor="#fcfbf7" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </radialGradient>
      </defs>

      {/* Outer Metallic Bezel */}
      <circle cx="50" cy="50" r="48" fill="url(#bezelGrad)" stroke="#78350f" strokeWidth="1.2" />

      {/* Inner Cream Dial Face */}
      <circle cx="50" cy="50" r="43.5" fill="url(#dialGrad)" stroke="#e2e8f0" strokeWidth="0.8" />

      {/* Minute Tick Ring */}
      <circle cx="50" cy="50" r="40" fill="none" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="1, 3.14" />

      {/* 12 Hour Numbers (Clearly visible, bold, neutral slate-800, no red highlights) */}
      {numberPositions.map(({ h, x, y }) => (
        <text
          key={h}
          x={x}
          y={y}
          textAnchor="middle"
          fontSize="9.2"
          fontWeight="900"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fill="#1e293b"
          className="select-none pointer-events-none"
        >
          {h}
        </text>
      ))}

      {/* Long Minute Hand (Length 24; tip stops at y=26, well before number 12 at y=15) */}
      <g>
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="26"
          stroke="#0284c7"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Sleek arrow tip */}
        <circle cx="50" cy="27" r="1.8" fill="#0369a1" />
      </g>

      {/* Short Hour Hand (Length 15.5; tip stops at radius 15.5, far from numbers at radius 34.5) */}
      <g transform={`rotate(${hourAngle} 50 50)`}>
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="34.5"
          stroke="#dc2626"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        {/* Sleek arrow tip */}
        <circle cx="50" cy="35.5" r="2.2" fill="#991b1b" />
      </g>

      {/* Center Golden Pin Cap */}
      <circle cx="50" cy="50" r="4.2" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="1.8" fill="#78350f" />
    </svg>
  );
};

export const MagicTimeTrainGame: React.FC<MagicTimeTrainGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  // Game lifecycle states
  const [hasStarted, setHasStarted] = useState(false);
  const [stationIdx, setStationIdx] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Train animation & interactive states
  const [currentOptions, setCurrentOptions] = useState<number[]>([]);
  const [selectedStationIdx, setSelectedStationIdx] = useState<number | null>(null);
  const [wrongStationIdx, setWrongStationIdx] = useState<number | null>(null);
  const [isTrainMoving, setIsTrainMoving] = useState(false);
  const [trainTargetPos, setTrainTargetPos] = useState<'depot' | 'left' | 'center' | 'right'>('depot');
  const [boardedAnimals, setBoardedAnimals] = useState<string[]>([]);
  const [showPassengerHop, setShowPassengerHop] = useState(false);

  const [startTime] = useState(Date.now());

  const currentStation = STATIONS_DATA[stationIdx];

  // Initialize or shuffle options when current station changes
  useEffect(() => {
    if (currentStation) {
      setCurrentOptions(shuffle(currentStation.options));
      setSelectedStationIdx(null);
      setWrongStationIdx(null);
      setTrainTargetPos('depot');
      setIsTrainMoving(false);
      setShowPassengerHop(false);
    }
  }, [stationIdx]);

  // Launch the journey
  const handleStartGame = () => {
    soundService.playClick();
    if (!isMuted) {
      soundService.playWhistle();
    }
    setHasStarted(true);
  };

  // Click on a station clock
  const handleSelectStation = (optHour: number, optIdx: number) => {
    if (isTrainMoving || isCompleted) return;

    soundService.playClick();

    if (optHour === currentStation.targetHour) {
      // --- CORRECT ANSWER ---
      setSelectedStationIdx(optIdx);
      setWrongStationIdx(null);
      setIsTrainMoving(true);

      // Determine track direction: 0 = left, 1 = center, 2 = right
      const targetPos: 'left' | 'center' | 'right' = optIdx === 0 ? 'left' : optIdx === 1 ? 'center' : 'right';
      setTrainTargetPos(targetPos);

      // Sound effects
      if (!isMuted) {
        soundService.playWhistle();
        soundEffects.correct();
      }

      // Step 1: Train arrives at station after 1.2s
      setTimeout(() => {
        setShowPassengerHop(true);
        if (currentStation.id <= 4) {
          setBoardedAnimals((prev) => [...prev, currentStation.animal.emoji]);
        }

        // Step 2: Auto-transition to next station after 1.5s
        setTimeout(() => {
          if (stationIdx + 1 < STATIONS_DATA.length) {
            setStationIdx((prev) => prev + 1);
          } else {
            // ALL 5 STATIONS COMPLETED! VICTORY!
            triggerVictory();
          }
        }, 1500);
      }, 1200);
    } else {
      // --- WRONG ANSWER ---
      setWrongStationIdx(optIdx);
      if (!isMuted) {
        soundEffects.wrong();
      }

      // Clear wobble after 600ms so student can retry without losing progress
      setTimeout(() => {
        setWrongStationIdx(null);
      }, 700);
    }
  };

  const triggerVictory = () => {
    setIsCompleted(true);
    if (!isMuted) {
      soundEffects.celebrate();
    }
    confetti({ particleCount: 180, spread: 95, origin: { y: 0.6 } });

    // Record activity in StorageService
    StorageService.recordActivity(student.id, {
      type: 'game',
      targetId: 'magic-time-train',
      targetName: 'Chuyến Tàu Thời Gian',
      score: 5,
      totalQuestions: 5,
      starsEarned: 25,
      timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
    });

    const updated = StorageService.getCurrentStudent();
    if (updated) onUpdateStudent(updated);
  };

  const handleRestart = () => {
    soundService.playClick();
    if (!isMuted) {
      soundService.playWhistle();
    }
    setStationIdx(0);
    setIsCompleted(false);
    setBoardedAnimals([]);
    setTrainTargetPos('depot');
    setIsTrainMoving(false);
    setSelectedStationIdx(null);
    setWrongStationIdx(null);
  };

  // Toggle Mute
  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
    soundService.playClick();
  };

  // English speaker button handler
  const handleSpeakQuestion = () => {
    soundService.cancelSpeech();
    soundService.speakEn(currentStation.questionEn);
  };

  // Dynamic scenery classes according to station theme
  const getThemeBackground = () => {
    switch (currentStation?.theme) {
      case 'sunrise':
        return 'from-amber-100 via-orange-100 to-sky-200';
      case 'school':
        return 'from-sky-100 via-teal-50 to-emerald-100';
      case 'park':
        return 'from-emerald-100 via-lime-50 to-sky-100';
      case 'lunch':
        return 'from-amber-50 via-yellow-100 to-orange-100';
      case 'home':
        return 'from-indigo-100 via-purple-100 to-pink-100';
      default:
        return 'from-sky-100 via-indigo-50 to-purple-100';
    }
  };

  return (
    <FullscreenStage
      titleVi="CHUYẾN TÀU THỜI GIAN"
      titleEn="Magic Time Train"
      categoryBadge="Khu 4: Tháp Đồng Hồ"
      onBack={onBack}
      topRightControls={
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Progress Indicator */}
          {hasStarted && !isCompleted && (
            <div className="bg-amber-100 border border-amber-300 text-amber-900 px-2.5 py-1 rounded-xl font-black text-xs">
              Ga {stationIdx + 1} / 5
            </div>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleMute}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all active:scale-95"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          {/* Restart */}
          {hasStarted && (
            <button
              type="button"
              onClick={handleRestart}
              title="Làm lại từ đầu"
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      }
    >
      {!hasStarted ? (
        /* --- 1. WELCOME SCREEN (Direct Start - No Level Selection) --- */
        <div className="w-full h-full max-w-[177.78vh] mx-auto flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-br from-amber-50 via-sky-50 to-indigo-100 text-center select-none overflow-hidden">
          {/* Top Title Banner */}
          <div className="pt-2 sm:pt-4">
            <span className="text-4xl sm:text-5xl animate-bounce inline-block mb-1">🚂✨⏰</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-950 font-heading tracking-tight">
              CHUYẾN TÀU THỜI GIAN KỲ DIỆU
            </h2>
            <p className="text-xs sm:text-sm font-bold text-amber-700 mt-1">
              Magic Time Train · Khám phá 5 nhà ga đồng hồ cổ tích!
            </p>
          </div>

          {/* Center Showcase: Animated 3D Chibi Train & 4 Animal Friends */}
          <div className="relative w-full max-w-lg aspect-video max-h-[220px] bg-gradient-to-b from-sky-200/50 to-emerald-200/50 rounded-3xl border-2 border-amber-300 shadow-inner flex flex-col items-center justify-center p-3">
            <div className="flex items-center justify-center gap-3 text-4xl sm:text-5xl mb-2">
              <span className="animate-pulse">🐰</span>
              <span className="animate-bounce" style={{ animationDelay: '150ms' }}>🐿️</span>
              <span className="text-5xl sm:text-6xl animate-pulse">🚂</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>🐻</span>
              <span className="animate-pulse" style={{ animationDelay: '450ms' }}>🐱</span>
            </div>
            <p className="text-xs sm:text-sm font-extrabold text-slate-800 max-w-sm">
              Chọn đúng nhà ga có mặt đồng hồ chỉ giờ để đón các bạn thú lên tàu nhé!
            </p>
          </div>

          {/* Bottom Direct Start Button */}
          <div className="pb-3 sm:pb-5">
            <button
              type="button"
              onClick={handleStartGame}
              className="px-8 py-3.5 sm:px-12 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-base sm:text-xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-3 border-2 border-yellow-300"
            >
              <span>BẮT ĐẦU CHUYẾN ĐI 🚂</span>
            </button>
            <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-2">
              5 Nhà ga · Học xem giờ đúng · Tàu chạy thật
            </p>
          </div>
        </div>
      ) : !isCompleted ? (
        /* --- 2. MAIN GAME SCREEN (Strict 16:9 - 3 Proportions) --- */
        <div className={`w-full h-full max-w-[177.78vh] mx-auto flex flex-col justify-between overflow-hidden select-none p-1.5 sm:p-2 bg-gradient-to-b ${getThemeBackground()} transition-colors duration-1000`}>
          
          {/* TOP BAR: Concise Station Prompt & Audio Button (14% Height) */}
          <div className="h-[14%] flex items-center justify-between bg-white/95 backdrop-blur-xs px-3 sm:px-4 py-1 rounded-2xl border border-amber-300 shadow-xs shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="text-2xl sm:text-3xl shrink-0">
                {currentStation.animal.emoji}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base md:text-lg font-black text-slate-900 truncate">
                    {currentStation.questionVi}
                  </span>
                  <span className="hidden sm:inline-block text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                    {currentStation.stationNameVi}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-bold truncate">
                  <span>{currentStation.questionEn}</span>
                  <button
                    type="button"
                    onClick={handleSpeakQuestion}
                    className="p-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 cursor-pointer shadow-xs active:scale-95 transition-all flex items-center gap-1 text-[11px]"
                    title="Nghe phát âm tiếng Anh"
                  >
                    <Volume2 className="w-3 h-3 text-amber-700" />
                    <span>Phát âm 🔊</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Target Friend Waiting Badge */}
            <div className="hidden md:flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 text-xs font-bold text-amber-950">
              <span>Đón bạn:</span>
              <strong className="text-rose-600 font-black">{currentStation.animal.nameVi}</strong>
            </div>
          </div>

          {/* CENTER ARENA: 3 Station Platforms, Tracks, and The Magic Train (72% Height) */}
          <div className="h-[72%] relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-inner border-2 border-amber-300 bg-gradient-to-b from-sky-200/60 via-amber-50/40 to-emerald-200/50 select-none flex flex-col justify-between p-2 shrink-0">
            
            {/* Background Fairytale Scenery Details */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              {/* Distant Hills */}
              <svg className="w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="none">
                <path d="M0,320 Q250,220 500,310 T1000,280 L1000,500 L0,500 Z" fill="#bbf7d0" />
                <path d="M0,360 Q350,290 700,370 T1000,340 L1000,500 L0,500 Z" fill="#86efac" />
              </svg>
            </div>

            {/* SVG RAILROAD TRACKS (Branching from bottom center to each of the 3 stations) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Glowing Golden Rail Glow */}
                <filter id="railGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Wooden Ties (Crossbeams) */}
              {/* Left Track Crossbeams */}
              {[0.2, 0.4, 0.6, 0.8].map((t, idx) => {
                const x = 50 + (20 - 50) * t;
                const y = 88 + (42 - 88) * t;
                return (
                  <line
                    key={`tie-l-${idx}`}
                    x1={x - 2.5}
                    y1={y - 0.8}
                    x2={x + 2.5}
                    y2={y + 0.8}
                    stroke="#78350f"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                );
              })}
              {/* Center Track Crossbeams */}
              {[0.2, 0.4, 0.6, 0.8].map((t, idx) => {
                const y = 88 + (42 - 88) * t;
                return (
                  <line
                    key={`tie-c-${idx}`}
                    x1={47.5}
                    y1={y}
                    x2={52.5}
                    y2={y}
                    stroke="#78350f"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                );
              })}
              {/* Right Track Crossbeams */}
              {[0.2, 0.4, 0.6, 0.8].map((t, idx) => {
                const x = 50 + (80 - 50) * t;
                const y = 88 + (42 - 88) * t;
                return (
                  <line
                    key={`tie-r-${idx}`}
                    x1={x - 2.5}
                    y1={y + 0.8}
                    x2={x + 2.5}
                    y2={y - 0.8}
                    stroke="#78350f"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Base Rails (Left, Center, Right) */}
              {/* Track Left: from (50, 88) to (20, 42) */}
              <path
                d="M50,88 Q35,68 20,42"
                fill="none"
                stroke="#64748b"
                strokeWidth="1.8"
                strokeDasharray="2, 1"
              />
              {/* Track Center: from (50, 88) to (50, 42) */}
              <line
                x1="50"
                y1="88"
                x2="50"
                y2="42"
                stroke="#64748b"
                strokeWidth="1.8"
                strokeDasharray="2, 1"
              />
              {/* Track Right: from (50, 88) to (80, 42) */}
              <path
                d="M50,88 Q65,68 80,42"
                fill="none"
                stroke="#64748b"
                strokeWidth="1.8"
                strokeDasharray="2, 1"
              />

              {/* Glowing Active Track (Lights up in gold when correct station is selected) */}
              {trainTargetPos === 'left' && (
                <path
                  d="M50,88 Q35,68 20,42"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3.5"
                  filter="url(#railGlow)"
                  className="animate-pulse"
                />
              )}
              {trainTargetPos === 'center' && (
                <line
                  x1="50"
                  y1="88"
                  x2="50"
                  y2="42"
                  stroke="#fbbf24"
                  strokeWidth="3.5"
                  filter="url(#railGlow)"
                  className="animate-pulse"
                />
              )}
              {trainTargetPos === 'right' && (
                <path
                  d="M50,88 Q65,68 80,42"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3.5"
                  filter="url(#railGlow)"
                  className="animate-pulse"
                />
              )}
            </svg>

            {/* THREE STATION PLATFORMS (Top Row) */}
            <div className="relative z-10 w-full grid grid-cols-3 gap-2 sm:gap-4 pt-1 sm:pt-2">
              {currentOptions.map((optHour, optIdx) => {
                const isSelected = selectedStationIdx === optIdx;
                const isWrong = wrongStationIdx === optIdx;

                return (
                  <button
                    key={`${stationIdx}-${optIdx}-${optHour}`}
                    type="button"
                    onClick={() => handleSelectStation(optHour, optIdx)}
                    disabled={isTrainMoving}
                    className={`relative group rounded-2xl sm:rounded-3xl p-1.5 sm:p-2.5 flex flex-col items-center justify-between transition-all cursor-pointer border-2 shadow-lg active:scale-95 ${
                      isSelected
                        ? 'bg-amber-100 border-amber-400 ring-4 ring-emerald-400 scale-105 z-20'
                        : isWrong
                        ? 'bg-rose-100 border-rose-400 animate-shake ring-2 ring-rose-300'
                        : 'bg-white/95 hover:bg-amber-50/90 border-amber-200 hover:border-amber-400 hover:scale-102 hover:shadow-xl'
                    }`}
                  >
                    {/* Fairytale Station Awning / Roof */}
                    <div className="w-full flex items-center justify-between px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 text-white shadow-xs">
                      <span className="text-[10px] sm:text-xs font-black tracking-wider">
                        GA SỐ {optIdx + 1}
                      </span>
                      {/* Signal Lamp: Red when idle, green pulse when correct */}
                      <span
                        className={`w-2.5 h-2.5 rounded-full border border-white transition-colors ${
                          isSelected
                            ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse'
                            : isWrong
                            ? 'bg-rose-500'
                            : 'bg-amber-300'
                        }`}
                      />
                    </div>

                    {/* BIG ANALOG CLOCK (No red highlights, crystal clear) */}
                    <div className="my-1 sm:my-2 p-1 bg-white rounded-full shadow-inner border border-amber-200/80 flex items-center justify-center">
                      <SvgAnalogClock hour={optHour} size={92} />
                    </div>

                    {/* Target animal waiting at station (shows when train arrives) */}
                    {isSelected && showPassengerHop && (
                      <div className="absolute -bottom-3 text-2xl sm:text-3xl animate-bounce z-30">
                        {currentStation.animal.emoji}✨
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* THE RED & GOLD CHIBI MAGIC TRAIN */}
            <div
              className={`absolute z-20 transition-all duration-1200 ease-in-out pointer-events-none flex flex-col items-center ${
                trainTargetPos === 'left'
                  ? 'left-[20%] top-[40%] -translate-x-1/2 -translate-y-1/2 scale-95'
                  : trainTargetPos === 'center'
                  ? 'left-[50%] top-[40%] -translate-x-1/2 -translate-y-1/2 scale-95'
                  : trainTargetPos === 'right'
                  ? 'left-[80%] top-[40%] -translate-x-1/2 -translate-y-1/2 scale-95'
                  : 'left-[50%] bottom-[4%] -translate-x-1/2 scale-100'
              }`}
            >
              {/* Star Puff Smoke coming from chimney */}
              <div className="flex items-center gap-1 -mb-1 animate-pulse">
                <span className="text-xs sm:text-sm animate-bounce" style={{ animationDelay: '0ms' }}>✨</span>
                <span className="text-sm sm:text-base animate-bounce" style={{ animationDelay: '150ms' }}>⭐</span>
                <span className="text-xs sm:text-sm animate-bounce" style={{ animationDelay: '300ms' }}>💨</span>
              </div>

              {/* The Chibi Locomotive and Carriages */}
              <div className="flex items-end">
                {/* Boarded Animals Carriages */}
                {boardedAnimals.map((emoji, idx) => (
                  <div
                    key={`car-${idx}`}
                    className="relative w-10 sm:w-12 h-9 sm:h-11 bg-gradient-to-b from-amber-400 to-amber-600 rounded-lg border-2 border-yellow-200 shadow-md flex items-center justify-center -mr-1 z-0"
                  >
                    <div className="w-6 h-5 bg-sky-100 rounded-sm border border-amber-800 flex items-center justify-center text-sm sm:text-base">
                      {emoji}
                    </div>
                    {/* Tiny carriage wheels */}
                    <div className="absolute -bottom-1 left-1 w-2.5 h-2.5 rounded-full bg-slate-800 border border-amber-300" />
                    <div className="absolute -bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-slate-800 border border-amber-300" />
                  </div>
                ))}

                {/* Locomotive Head */}
                <div className="relative w-20 sm:w-26 h-12 sm:h-15 bg-gradient-to-b from-rose-500 via-red-600 to-rose-700 rounded-r-2xl rounded-l-md border-2 border-yellow-300 shadow-xl flex items-center justify-between px-1.5 z-10">
                  {/* Driver Cab */}
                  <div className="w-7 sm:w-9 h-7 sm:h-9 bg-sky-100 rounded-md border border-red-900 flex items-center justify-center text-sm sm:text-base shadow-inner">
                    🤖
                  </div>

                  {/* Boiler & Chimney */}
                  <div className="relative flex-1 flex flex-col items-center justify-center">
                    {/* Golden boiler stripe */}
                    <div className="w-full h-1 bg-amber-300 rounded-full my-0.5" />
                    {/* Cute Smiling Face on Boiler Front */}
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-100 border border-amber-400 flex items-center justify-center text-xs font-black shadow-xs">
                      😊
                    </div>
                  </div>

                  {/* Golden Cowcatcher at the front */}
                  <div className="w-2.5 h-6 bg-amber-400 rounded-r-md border-l border-amber-600" />

                  {/* Chimney on top */}
                  <div className="absolute -top-3.5 left-8 sm:left-10 w-3 h-4 bg-slate-800 rounded-t-sm border border-amber-400" />

                  {/* Revolving Wheels with Golden Rim */}
                  <div className="absolute -bottom-2 left-1.5 w-4 h-4 rounded-full bg-slate-800 border-2 border-amber-400 flex items-center justify-center animate-spin">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  </div>
                  <div className="absolute -bottom-2 left-8 w-4 h-4 rounded-full bg-slate-800 border-2 border-amber-400 flex items-center justify-center animate-spin">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  </div>
                  <div className="absolute -bottom-2.5 right-2 w-5 h-5 rounded-full bg-slate-800 border-2 border-amber-400 flex items-center justify-center animate-spin">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                  </div>
                </div>
              </div>

              {/* Destination feedback note */}
              {isTrainMoving && (
                <div className="mt-1 bg-amber-900/90 text-yellow-200 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full border border-amber-400 shadow-md animate-pulse">
                  Tu tu! Tàu đang chạy đến ga...
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM BAR: Concise instruction, animal status, progress (14% Height) */}
          <div className="h-[14%] bg-white/95 backdrop-blur-xs rounded-2xl px-3 py-1 border border-amber-200 shadow-xs flex items-center justify-between shrink-0">
            {/* Status note */}
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-slate-800">
                {currentStation.destinationNoteVi}
              </span>
            </div>

            {/* Animals boarded checklist */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <span className="hidden sm:inline">Hành khách:</span>
              <div className="flex items-center gap-1">
                {['🐰', '🐿️', '🐻', '🐱'].map((emoji, idx) => {
                  const hasBoarded = boardedAnimals.includes(emoji);
                  return (
                    <span
                      key={emoji}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border text-xs transition-all ${
                        hasBoarded
                          ? 'bg-amber-100 border-amber-400 shadow-xs scale-110'
                          : 'bg-slate-100 border-slate-200 opacity-40'
                      }`}
                      title={hasBoarded ? 'Đã lên tàu' : 'Chưa lên tàu'}
                    >
                      {emoji}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- 3. GRAND VICTORY SCREEN --- */
        <div className="w-full h-full max-w-[177.78vh] mx-auto flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-amber-50 via-rose-50 to-indigo-100 text-center select-none overflow-hidden">
          {/* Animated Rainbow & Castle Celebrations */}
          <div className="text-5xl sm:text-6xl animate-bounce mb-2">
            🌈🚂🏰🎉
          </div>

          <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-amber-950 font-heading mb-1">
            CHÚC MỪNG BÉ!
          </h3>
          <h4 className="text-sm sm:text-lg md:text-xl font-black text-rose-600 mb-1">
            CON ĐÃ HOÀN THÀNH CHUYẾN TÀU THỜI GIAN!
          </h4>
          <p className="text-xs sm:text-sm font-bold text-amber-800 mb-4">
            “Congratulations! You did it! What a wonderful trip!”
          </p>

          {/* All animal friends cheering */}
          <div className="flex items-center justify-center gap-3 text-3xl sm:text-4xl bg-white/90 p-3 rounded-2xl border-2 border-amber-300 shadow-md mb-4">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🐰</span>
            <span className="animate-bounce" style={{ animationDelay: '100ms' }}>🐿️</span>
            <span className="animate-bounce" style={{ animationDelay: '200ms' }}>🐻</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>🐱</span>
            <span className="text-4xl sm:text-5xl">🚂</span>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-2.5 max-w-md w-full mb-5">
            <div className="bg-white p-2.5 rounded-2xl border border-amber-200 shadow-xs">
              <div className="text-2xl">🚉</div>
              <div className="text-[11px] text-slate-500 font-bold">Nhà ga</div>
              <div className="text-base font-black text-amber-600">5 / 5 Ga</div>
            </div>
            <div className="bg-white p-2.5 rounded-2xl border border-amber-200 shadow-xs">
              <div className="text-2xl">⭐</div>
              <div className="text-[11px] text-slate-500 font-bold">Ngôi sao</div>
              <div className="text-base font-black text-yellow-500">+25 Sao</div>
            </div>
            <div className="bg-white p-2.5 rounded-2xl border border-amber-200 shadow-xs">
              <div className="text-2xl">🎖️</div>
              <div className="text-[11px] text-slate-500 font-bold">Huy hiệu</div>
              <div className="text-xs font-black text-emerald-600 truncate">Lái Tàu Thời Gian</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRestart}
              className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 border border-yellow-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>CHƠI LẠI</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-black text-sm sm:text-base shadow-sm hover:shadow-md border border-slate-300 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>QUAY LẠI</span>
            </button>
          </div>
        </div>
      )}
    </FullscreenStage>
  );
};
