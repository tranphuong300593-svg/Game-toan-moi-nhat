import React, { useState } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundEffects, soundService } from '../../services/audioService';
import { Volume2, CheckCircle2 } from 'lucide-react';

interface GeometryExplorerGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

export const GeometryExplorerGame: React.FC<GeometryExplorerGameProps> = ({
  student,
  langMode: _langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Helper to speak English prompt
  const handleSpeakEn = (text: string) => {
    soundEffects.click();
    soundService.speak(text, 'en');
  };

  // -------------------------------------------------------------
  // CÂU 1: TÌM ĐÚNG HÌNH ("Đâu là hình vuông?")
  // 4 hình: Tròn, Vuông (4 cạnh bằng nhau, 4 góc vuông), Tam giác, Chữ nhật
  // Các góc sắc nét, không bo góc (rx=0, không border-radius)
  // -------------------------------------------------------------
  const [selectedShape1, setSelectedShape1] = useState<string | null>(null);
  const q1Shapes = [
    {
      id: 'circle',
      nameVi: 'Hình tròn',
      type: 'circle',
      isCorrect: false,
    },
    {
      id: 'square',
      nameVi: 'Hình vuông',
      type: 'square',
      isCorrect: true,
    },
    {
      id: 'triangle',
      nameVi: 'Hình tam giác',
      type: 'triangle',
      isCorrect: false,
    },
    {
      id: 'rectangle',
      nameVi: 'Hình chữ nhật',
      type: 'rectangle',
      isCorrect: false,
    },
  ];

  const handleSelectQ1 = (id: string, isCorrect: boolean) => {
    if (selectedShape1 || feedback) return;
    setSelectedShape1(id);
    if (isCorrect) {
      soundEffects.correct();
      setFeedback({ isCorrect: true, text: 'Chính xác! Đây là hình vuông có 4 cạnh bằng nhau và 4 góc vuông!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1400);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Chưa đúng rồi! Hình vuông có 4 cạnh bằng nhau và 4 góc vuông nhé!' });
      setTimeout(() => {
        setSelectedShape1(null);
        setFeedback(null);
      }, 1400);
    }
  };

  // -------------------------------------------------------------
  // CÂU 2: ĐẾM HÌNH THẬT NHANH ("Có bao nhiêu hình tam giác?")
  // 3 tam giác, 2 hình vuông, 1 hình tròn. Phân tách rõ ràng, không chồng lấn.
  // Đáp án: 3
  // -------------------------------------------------------------
  const [selectedCountQ2, setSelectedCountQ2] = useState<number | null>(null);
  const targetCountQ2 = 3;
  const q2Options = [2, 3, 4, 5];

  const handleSelectQ2 = (count: number) => {
    if (selectedCountQ2 || feedback) return;
    setSelectedCountQ2(count);
    if (count === targetCountQ2) {
      soundEffects.correct();
      setFeedback({ isCorrect: true, text: 'Rất giỏi! Có đúng 3 hình tam giác (mỗi hình có 3 cạnh và 3 đỉnh)!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1400);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Bé hãy đếm kỹ lại các hình có 3 cạnh thẳng xem có mấy hình tam giác nhé!' });
      setTimeout(() => {
        setSelectedCountQ2(null);
        setFeedback(null);
      }, 1400);
    }
  };

  // -------------------------------------------------------------
  // CÂU 3: AI KHÔNG CÙNG NHÓM? ("Hình nào khác loại?")
  // 3 hình vuông (khác kích thước/màu) và 1 hình chữ nhật không phải hình vuông
  // Học sinh chọn: Hình chữ nhật
  // -------------------------------------------------------------
  const [selectedDifferentQ3, setSelectedDifferentQ3] = useState<string | null>(null);
  const q3Shapes = [
    { id: 'sq-1', nameVi: 'Hình vuông nhỏ', isDiff: false, w: 50, h: 50, color: '#f59e0b' },
    { id: 'sq-2', nameVi: 'Hình vuông lớn', isDiff: false, w: 75, h: 75, color: '#10b981' },
    { id: 'sq-3', nameVi: 'Hình vuông vừa', isDiff: false, w: 60, h: 60, color: '#8b5cf6' },
    { id: 'rect-diff', nameVi: 'Hình chữ nhật', isDiff: true, w: 90, h: 46, color: '#ef4444' },
  ];

  const handleSelectQ3 = (shape: (typeof q3Shapes)[0]) => {
    if (selectedDifferentQ3 || feedback) return;
    setSelectedDifferentQ3(shape.id);
    if (shape.isDiff) {
      soundEffects.correct();
      setFeedback({ isCorrect: true, text: 'Chính xác! Ba hình kia đều là hình vuông, riêng hình này là hình chữ nhật!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1400);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Chưa đúng! Đây là hình vuông (4 cạnh bằng nhau). Hãy tìm hình khác loại nhé!' });
      setTimeout(() => {
        setSelectedDifferentQ3(null);
        setFeedback(null);
      }, 1400);
    }
  };

  // -------------------------------------------------------------
  // CÂU 4: ĐỒ VẬT MANG HÌNH GÌ? ("Mặt quyển sách có dạng hình gì?")
  // Minh họa quyển sách Toán 1 có mặt bìa hình chữ nhật rõ ràng.
  // Đáp án: Hình chữ nhật
  // -------------------------------------------------------------
  const [selectedBookShapeQ4, setSelectedBookShapeQ4] = useState<string | null>(null);
  const targetBookShape = 'rect';
  const q4Options = [
    { id: 'circle', labelVi: 'Hình tròn' },
    { id: 'square', labelVi: 'Hình vuông' },
    { id: 'triangle', labelVi: 'Hình tam giác' },
    { id: 'rect', labelVi: 'Hình chữ nhật' },
  ];

  const handleSelectQ4 = (id: string) => {
    if (selectedBookShapeQ4 || feedback) return;
    setSelectedBookShapeQ4(id);
    if (id === targetBookShape) {
      soundEffects.correct();
      setFeedback({ isCorrect: true, text: 'Tuyệt vời! Mặt bìa quyển sách có dạng hình chữ nhật!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1400);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Chưa chính xác! Mặt bìa quyển sách có 2 chiều dài bằng nhau, 2 chiều rộng bằng nhau đấy!' });
      setTimeout(() => {
        setSelectedBookShapeQ4(null);
        setFeedback(null);
      }, 1400);
    }
  };

  // -------------------------------------------------------------
  // CÂU 5: THỬ THÁCH MẮT TINH ("Hãy tìm tất cả hình vuông!")
  // Bức tranh ghép gồm 3 hình vuông phân tách rõ ràng + các hình khác (tam giác, tròn, chữ nhật).
  // Hệ thống đếm đúng số hình vuông đã chọn (3/3).
  // -------------------------------------------------------------
  const [foundSquares, setFoundSquares] = useState<number[]>([]);
  const targetTotalSquares = 3;

  const handleTapPictureShape = (shapeId: number, isSquare: boolean) => {
    if (feedback) return;
    soundEffects.click();
    if (!isSquare) {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Đây không phải hình vuông! Hãy tìm hình có 4 cạnh bằng nhau và 4 góc vuông nhé.' });
      setTimeout(() => setFeedback(null), 1200);
      return;
    }

    if (foundSquares.includes(shapeId)) return;
    const nextList = [...foundSquares, shapeId];
    setFoundSquares(nextList);

    if (nextList.length === targetTotalSquares) {
      soundEffects.celebrate();
      setFeedback({ isCorrect: true, text: 'Xuất sắc! Bé đã tìm đủ cả 3 hình vuông trong bức tranh!' });
      setScore((prev) => prev + 5);
      setTimeout(() => {
        setIsCompleted(true);
        StorageService.recordActivity(student.id, {
          type: 'game',
          targetId: 'geometry-explorer',
          targetName: 'Nhà Thám Hiểm Hình Học',
          score: 5,
          totalQuestions: 5,
          starsEarned: 25,
          timeSpentSeconds: 60,
        });
        const updated = StorageService.getCurrentStudent();
        if (updated) {
          onUpdateStudent(updated);
        }
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
    setSelectedShape1(null);
    setSelectedCountQ2(null);
    setSelectedDifferentQ3(null);
    setSelectedBookShapeQ4(null);
    setFoundSquares([]);
  };

  const stageTitles = [
    'Thử thách 1: Tìm đúng hình',
    'Thử thách 2: Đếm hình thật nhanh',
    'Thử thách 3: Ai không cùng nhóm?',
    'Thử thách 4: Đồ vật mang hình gì?',
    'Thử thách 5: Thử thách mắt tinh',
  ];

  return (
    <div className="w-full h-full max-h-[100dvh] flex flex-col bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white select-none overflow-hidden font-sans">
      {/* 1. Header Bar */}
      <header className="flex-none px-4 sm:px-6 py-2 sm:py-2.5 bg-black/50 backdrop-blur-md border-b border-purple-500/30 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-purple-300 font-bold text-xs sm:text-sm border border-purple-400/30 transition shadow-sm cursor-pointer"
          >
            ← Về Xứ Sở Hình Học
          </button>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xl">📐</span>
            <div>
              <h1 className="text-xs sm:text-sm md:text-base font-black tracking-wide bg-gradient-to-r from-purple-300 via-pink-200 to-amber-300 bg-clip-text text-transparent uppercase">
                NHÀ THÁM HIỂM HÌNH HỌC
              </h1>
              <p className="text-[11px] sm:text-xs text-purple-300 font-medium">
                {stageTitles[stageIndex] || 'Hoàn thành cuộc thám hiểm'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex gap-1 sm:gap-1.5">
            {[0, 1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className={`w-6 sm:w-8 h-2 rounded-full transition-all duration-300 ${
                  idx < stageIndex
                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                    : idx === stageIndex
                    ? 'bg-purple-400 animate-pulse'
                    : 'bg-slate-700/60'
                }`}
              />
            ))}
          </div>
          <div className="px-2.5 sm:px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-xs sm:text-sm flex items-center gap-1">
            <span>⭐</span>
            <span>+{score} sao</span>
          </div>
        </div>
      </header>

      {/* 2. Main Stage Area (16:9 Zero-Scroll Layout) */}
      <main className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 relative overflow-hidden">
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
        {/* CÂU 1: TÌM ĐÚNG HÌNH ("Đâu là hình vuông?") */}
        {/* Các góc sắc nét, KHÔNG bo góc, KHÔNG border-radius */}
        {/* ========================================================= */}
        {stageIndex === 0 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-5 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 1 • Nhận biết hình phẳng
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                Đâu là hình vuông?
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-purple-200/90 italic mt-0.5">
                <span>Which one is the square?</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Which one is the square?')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-6 rounded-3xl bg-slate-900/80 border-2 border-purple-500/40 backdrop-blur-md shadow-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {q1Shapes.map((s) => {
                const isPicked = selectedShape1 === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectQ1(s.id, s.isCorrect)}
                    className={`h-36 sm:h-44 rounded-2xl border-2 flex flex-col items-center justify-center p-3 transition-all transform shadow-lg cursor-pointer ${
                      isPicked
                        ? s.isCorrect
                          ? 'border-emerald-400 bg-emerald-600/40 scale-105 shadow-[0_0_20px_rgba(52,211,153,0.6)]'
                          : 'border-rose-400 bg-rose-600/40 scale-95'
                        : 'border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 hover:border-amber-400/60 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {/* SVG Graphic with Sharp, Exact Geometry (NO borders/strokes, NO rounded corners) */}
                    <div className="w-20 h-20 flex items-center justify-center mb-2">
                      <svg viewBox="0 0 90 90" className="w-full h-full">
                        {s.type === 'circle' && (
                          <circle cx="45" cy="45" r="38" fill="#ec4899" stroke="none" strokeWidth="0" />
                        )}
                        {s.type === 'square' && (
                          /* Square: width=70, height=70, exactly 4 equal sides, 4 right angles, rx=0, no stroke */
                          <rect x="10" y="10" width="70" height="70" fill="#3b82f6" stroke="none" strokeWidth="0" />
                        )}
                        {s.type === 'triangle' && (
                          /* Triangle: 3 straight lines, 3 sharp vertices, no stroke */
                          <polygon points="45,8 82,78 8,78" fill="#f59e0b" stroke="none" strokeWidth="0" />
                        )}
                        {s.type === 'rectangle' && (
                          /* Rectangle: width 80 !== height 46, 4 sharp right angles, rx=0, no stroke */
                          <rect x="5" y="22" width="80" height="46" fill="#10b981" stroke="none" strokeWidth="0" />
                        )}
                      </svg>
                    </div>
                    <span className="font-black text-sm sm:text-base text-slate-100">{s.nameVi}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CÂU 2: ĐẾM HÌNH THẬT NHANH ("Có bao nhiêu hình tam giác?") */}
        {/* 3 tam giác, 2 hình vuông, 1 hình tròn. Tách bạch, không chồng lấn. */}
        {/* ========================================================= */}
        {stageIndex === 1 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 2 • Đếm số lượng hình
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                Có bao nhiêu hình tam giác?
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-purple-200/90 italic mt-0.5">
                <span>How many triangles are there?</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('How many triangles are there?')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-purple-500/40 backdrop-blur-md shadow-2xl flex flex-col items-center gap-4">
              {/* Shapes Display Board: 3 Triangles, 2 Squares, 1 Circle (Zero overlap) */}
              <div className="w-full max-w-xl bg-purple-950/40 border border-purple-400/30 p-3 sm:p-4 rounded-2xl shadow-inner">
                <svg viewBox="0 0 500 130" className="w-full h-auto select-none">
                  {/* Triangle 1 (Orange) */}
                  <polygon points="50,15 85,85 15,85" fill="#f97316" stroke="none" strokeWidth="0" />
                  {/* Square 1 (Blue) */}
                  <rect x="115" y="25" width="60" height="60" fill="#3b82f6" stroke="none" strokeWidth="0" />
                  {/* Triangle 2 (Yellow) */}
                  <polygon points="230,15 265,85 195,85" fill="#eab308" stroke="none" strokeWidth="0" />
                  {/* Circle 1 (Pink) */}
                  <circle cx="320" cy="55" r="30" fill="#ec4899" stroke="none" strokeWidth="0" />
                  {/* Triangle 3 (Red) */}
                  <polygon points="405,15 440,85 370,85" fill="#ef4444" stroke="none" strokeWidth="0" />
                  {/* Square 2 (Purple) */}
                  <rect x="455" y="30" width="50" height="50" fill="#8b5cf6" stroke="none" strokeWidth="0" />
                </svg>
              </div>

              {/* Options */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-md">
                {q2Options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectQ2(opt)}
                    className={`py-3 sm:py-3.5 rounded-2xl font-black text-xl sm:text-2xl border-2 transition-all transform shadow-xl cursor-pointer ${
                      selectedCountQ2 === opt
                        ? opt === targetCountQ2
                          ? 'border-emerald-400 bg-emerald-600 text-white scale-105 shadow-emerald-500/50'
                          : 'border-rose-400 bg-rose-600 text-white scale-95'
                        : 'border-purple-400/40 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-300 hover:scale-105 active:scale-95 text-purple-100'
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
        {/* CÂU 3: AI KHÔNG CÙNG NHÓM? ("Hình nào khác loại?") */}
        {/* 3 hình vuông và 1 hình chữ nhật không phải hình vuông */}
        {/* ========================================================= */}
        {stageIndex === 2 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 3 • Phân loại hình học
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                Hình nào khác loại?
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-purple-200/90 italic mt-0.5">
                <span>Which shape is different?</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Which shape is different?')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-6 rounded-3xl bg-slate-900/80 border-2 border-purple-500/40 backdrop-blur-md shadow-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {q3Shapes.map((shape) => {
                const isPicked = selectedDifferentQ3 === shape.id;
                return (
                  <button
                    key={shape.id}
                    type="button"
                    onClick={() => handleSelectQ3(shape)}
                    className={`h-36 sm:h-44 rounded-2xl border-2 flex flex-col items-center justify-center p-3 transition-all transform shadow-lg cursor-pointer ${
                      isPicked
                        ? shape.isDiff
                          ? 'border-emerald-400 bg-emerald-600/40 scale-105 shadow-[0_0_20px_rgba(52,211,153,0.6)]'
                          : 'border-rose-400 bg-rose-600/40 scale-95'
                        : 'border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 hover:border-amber-400/60 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {/* SVG Sharp Shape (No border radius, no stroke) */}
                    <div className="w-24 h-24 flex items-center justify-center mb-2">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <rect
                          x={(100 - shape.w) / 2}
                          y={(100 - shape.h) / 2}
                          width={shape.w}
                          height={shape.h}
                          fill={shape.color}
                          stroke="none"
                          strokeWidth="0"
                        />
                      </svg>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-slate-200">{shape.nameVi}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CÂU 4: ĐỒ VẬT MANG HÌNH GÌ? ("Mặt quyển sách có dạng hình gì?") */}
        {/* Bìa sách hình chữ nhật rõ ràng, đáp án: Hình chữ nhật */}
        {/* ========================================================= */}
        {stageIndex === 3 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 4 • Hình học trong thực tế
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                Mặt quyển sách có dạng hình gì?
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-purple-200/90 italic mt-0.5">
                <span>What shape is the book cover?</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('What shape is the book cover?')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-purple-500/40 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              {/* Book SVG (Perfect straight rectangular cover, 110 x 150) */}
              <div className="w-36 h-48 sm:w-40 sm:h-52 bg-slate-950 p-2 rounded-2xl border border-purple-400/30 shadow-inner flex items-center justify-center">
                <svg viewBox="0 0 120 160" className="w-full h-full select-none">
                  {/* Book Spine & Cover: Pure sharp rectangle without border */}
                  <rect x="15" y="10" width="95" height="140" fill="#2563eb" stroke="none" strokeWidth="0" />
                  <rect x="25" y="20" width="75" height="120" fill="#dbeafe" stroke="none" strokeWidth="0" />
                  {/* Spine line */}
                  <line x1="20" y1="10" x2="20" y2="150" stroke="#1d4ed8" strokeWidth="2" />
                  {/* Text on book */}
                  <text x="62" y="55" textAnchor="middle" fontSize="13" fontWeight="900" fill="#1e3a8a">TOÁN 1</text>
                  <text x="62" y="75" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2563eb">LỚP 1</text>
                  {/* Center emblem rectangle */}
                  <rect x="42" y="90" width="40" height="26" fill="#fef08a" stroke="none" strokeWidth="0" />
                  <text x="62" y="107" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#854d0e">SGK</text>
                </svg>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-sm">
                {q4Options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectQ4(opt.id)}
                    className={`py-3 sm:py-3.5 px-4 rounded-2xl font-black text-sm sm:text-base border-2 transition-all transform shadow-xl cursor-pointer ${
                      selectedBookShapeQ4 === opt.id
                        ? opt.id === targetBookShape
                          ? 'border-emerald-400 bg-emerald-600 text-white scale-105 shadow-emerald-500/50'
                          : 'border-rose-400 bg-rose-600 text-white scale-95'
                        : 'border-purple-400/40 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-300 hover:scale-105 active:scale-95 text-purple-100'
                    }`}
                  >
                    {opt.labelVi}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CÂU 5: THỬ THÁCH MẮT TINH ("Hãy tìm tất cả hình vuông!") */}
        {/* Bức tranh ghép, các hình vuông phân tách rõ ràng. Đếm đúng 3/3. */}
        {/* ========================================================= */}
        {stageIndex === 4 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-2.5 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 5 • Quan sát tinh mắt
              </span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-amber-300 drop-shadow-md">
                Hãy tìm tất cả hình vuông!
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-purple-200/90 italic mt-0.5">
                <span>Find and tap all the squares!</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Find and tap all the squares!')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-purple-500/40 backdrop-blur-md shadow-2xl flex flex-col items-center gap-3">
              {/* Counter pill */}
              <div className="px-4 py-1.5 rounded-xl bg-purple-950/80 border border-purple-400/40 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-2">
                <span>🔍 Đã tìm thấy:</span>
                <span className="text-base font-black text-yellow-300">{foundSquares.length} / {targetTotalSquares} hình vuông</span>
              </div>

              {/* Picture Puzzle Canvas (SVG) */}
              <div className="w-full max-w-lg bg-indigo-950/60 border-2 border-indigo-400/30 p-2 sm:p-3 rounded-2xl shadow-inner">
                <svg viewBox="0 0 460 220" className="w-full h-auto select-none">
                  {/* Sun (Circle - no stroke) */}
                  <circle cx="50" cy="45" r="28" fill="#facc15" stroke="none" strokeWidth="0" />

                  {/* Mountain (Triangle - no stroke) */}
                  <polygon points="120,30 190,140 50,140" fill="#64748b" stroke="none" strokeWidth="0" />

                  {/* House Roof (Triangle - no stroke) */}
                  <polygon points="300,30 380,100 220,100" fill="#f97316" stroke="none" strokeWidth="0" />

                  {/* House Body (Rectangle: width 140, height 100 - no stroke) */}
                  <rect x="230" y="100" width="140" height="100" fill="#e2e8f0" stroke="none" strokeWidth="0" />

                  {/* Door (Rectangle: width 34, height 60 - no stroke) */}
                  <rect x="283" y="140" width="34" height="60" fill="#78350f" stroke="none" strokeWidth="0" />

                  {/* --- 3 SQUARES TO FIND (Clickable - no stroke) --- */}
                  {/* Square 1: Window Left (40 x 40) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => handleTapPictureShape(1, true)}
                  >
                    <rect
                      x="242"
                      y="115"
                      width="34"
                      height="34"
                      fill={foundSquares.includes(1) ? '#22c55e' : '#38bdf8'}
                      stroke="none"
                      strokeWidth="0"
                    />
                    {foundSquares.includes(1) && (
                      <text x="259" y="137" textAnchor="middle" fontSize="16" fill="#ffffff" fontWeight="bold">✓</text>
                    )}
                  </g>

                  {/* Square 2: Window Right (40 x 40) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => handleTapPictureShape(2, true)}
                  >
                    <rect
                      x="324"
                      y="115"
                      width="34"
                      height="34"
                      fill={foundSquares.includes(2) ? '#22c55e' : '#38bdf8'}
                      stroke="none"
                      strokeWidth="0"
                    />
                    {foundSquares.includes(2) && (
                      <text x="341" y="137" textAnchor="middle" fontSize="16" fill="#ffffff" fontWeight="bold">✓</text>
                    )}
                  </g>

                  {/* Square 3: Stepping Stone Garden Square (50 x 50) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => handleTapPictureShape(3, true)}
                  >
                    <rect
                      x="110"
                      y="150"
                      width="50"
                      height="50"
                      fill={foundSquares.includes(3) ? '#22c55e' : '#a855f7'}
                      stroke="none"
                      strokeWidth="0"
                    />
                    {foundSquares.includes(3) && (
                      <text x="135" y="180" textAnchor="middle" fontSize="18" fill="#ffffff" fontWeight="bold">✓</text>
                    )}
                  </g>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* COMPLETION MODAL */}
        {/* ========================================================= */}
        {isCompleted && (
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/95 border-2 border-purple-400 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center animate-scale-up my-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-purple-500 to-pink-400 flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_30px_rgba(168,85,247,0.6)] mb-3 animate-bounce">
              🏆
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-300 uppercase tracking-wide">
              CHÚC MỪNG CHIẾN THẮNG!
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 mt-1 font-medium">
              Bé đã chinh phục toàn bộ 5 thử thách của <br />
              <strong className="text-amber-300">NHÀ THÁM HIỂM HÌNH HỌC</strong>!
            </p>

            <div className="my-4 sm:my-5 px-5 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-base sm:text-lg flex items-center gap-2">
              <span>⭐</span>
              <span>Bé nhận được +25 SAO VÀNG!</span>
            </div>

            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={handleRestart}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-amber-200 font-black text-xs sm:text-sm uppercase transition cursor-pointer"
              >
                Chơi lại
              </button>
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-black text-xs sm:text-sm uppercase shadow-lg shadow-purple-500/30 transition transform hover:scale-105 cursor-pointer"
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
