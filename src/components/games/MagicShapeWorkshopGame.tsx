import React, { useState } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundEffects, soundService } from '../../services/audioService';
import { Volume2 } from 'lucide-react';

interface MagicShapeWorkshopGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

export const MagicShapeWorkshopGame: React.FC<MagicShapeWorkshopGameProps> = ({
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
  // CÂU 1: GHÉP HÌNH THEO MẪU
  // Khung hình tam giác nét đứt. Học sinh chọn đúng hình tam giác.
  // -------------------------------------------------------------
  const [isQ1Filled, setIsQ1Filled] = useState(false);
  const q1Options = [
    { id: 'circle', nameVi: 'Hình tròn', type: 'circle', isCorrect: false },
    { id: 'triangle', nameVi: 'Hình tam giác', type: 'triangle', isCorrect: true },
    { id: 'square', nameVi: 'Hình vuông', type: 'square', isCorrect: false },
    { id: 'rect', nameVi: 'Hình chữ nhật', type: 'rectangle', isCorrect: false },
  ];

  const handleSelectQ1 = (opt: (typeof q1Options)[0]) => {
    if (isQ1Filled || feedback) return;
    if (opt.isCorrect) {
      setIsQ1Filled(true);
      soundEffects.correct();
      setFeedback({ isCorrect: true, text: 'Chính xác! Mảnh tam giác đã khớp hoàn hảo vào khung mẫu!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1400);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: `Chưa đúng! Đây là ${opt.nameVi}. Hãy chọn hình tam giác để khớp vào khung nhé!` });
      setTimeout(() => setFeedback(null), 1400);
    }
  };

  // -------------------------------------------------------------
  // CÂU 2: HOÀN THIỆN BỨC TRANH
  // Bức tranh xe tải thiếu thùng xe hình chữ nhật (120 x 60).
  // -------------------------------------------------------------
  const [isQ2Filled, setIsQ2Filled] = useState(false);
  const q2Options = [
    { id: 'tri', nameVi: 'Hình tam giác', type: 'triangle', isCorrect: false },
    { id: 'rect', nameVi: 'Hình chữ nhật', type: 'rectangle', isCorrect: true },
    { id: 'circle', nameVi: 'Hình tròn', type: 'circle', isCorrect: false },
    { id: 'sq', nameVi: 'Hình vuông', type: 'square', isCorrect: false },
  ];

  const handleSelectQ2 = (opt: (typeof q2Options)[0]) => {
    if (isQ2Filled || feedback) return;
    if (opt.isCorrect) {
      setIsQ2Filled(true);
      soundEffects.correct();
      setFeedback({ isCorrect: true, text: 'Tuyệt vời! Mảnh hình chữ nhật đã hoàn thiện chiếc xe tải đồ chơi!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1400);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Chưa đúng! Thùng xe tải có dạng hình chữ nhật, bé hãy chọn lại nhé!' });
      setTimeout(() => setFeedback(null), 1400);
    }
  };

  // -------------------------------------------------------------
  // CÂU 3: KIẾN TRÚC SƯ NHÍ
  // Mẫu nhà: 1 hình vuông làm thân nhà (100x100) + 1 hình tam giác làm mái nhà (đáy 100, cao 60).
  // Các cạnh của mái và thân nhà khớp chính xác 100%.
  // -------------------------------------------------------------
  const [placedRoof, setPlacedRoof] = useState(false);
  const [placedBody, setPlacedBody] = useState(false);

  const handlePlaceHousePiece = (piece: 'roof' | 'body') => {
    if (feedback) return;
    soundEffects.click();
    if (piece === 'roof' && !placedRoof) {
      setPlacedRoof(true);
      if (placedBody) {
        soundEffects.correct();
        setFeedback({ isCorrect: true, text: 'Xuất sắc! Ngôi nhà đã hoàn thiện với mái tam giác và thân vuông khớp khít!' });
        setScore((prev) => prev + 5);
        setTimeout(handleNextStage, 1400);
      }
    } else if (piece === 'body' && !placedBody) {
      setPlacedBody(true);
      if (placedRoof) {
        soundEffects.correct();
        setFeedback({ isCorrect: true, text: 'Xuất sắc! Ngôi nhà đã hoàn thiện với mái tam giác và thân vuông khớp khít!' });
        setScore((prev) => prev + 5);
        setTimeout(handleNextStage, 1400);
      }
    }
  };

  // -------------------------------------------------------------
  // CÂU 4: CHIẾC THUYỀN SÁNG TẠO
  // Mẫu thuyền: 1 hình chữ nhật làm thân thuyền (140x40) + 1 hình tam giác làm cánh buồm (đáy 70, cao 90).
  // -------------------------------------------------------------
  const [placedSail, setPlacedSail] = useState(false);
  const [placedHull, setPlacedHull] = useState(false);

  const handlePlaceBoatPiece = (piece: 'sail' | 'hull') => {
    if (feedback) return;
    soundEffects.click();
    if (piece === 'sail' && !placedSail) {
      setPlacedSail(true);
      if (placedHull) {
        soundEffects.correct();
        setFeedback({ isCorrect: true, text: 'Rất giỏi! Chiếc thuyền buồm đã sẵn sàng giương buồm ra khơi!' });
        setScore((prev) => prev + 5);
        setTimeout(handleNextStage, 1400);
      }
    } else if (piece === 'hull' && !placedHull) {
      setPlacedHull(true);
      if (placedSail) {
        soundEffects.correct();
        setFeedback({ isCorrect: true, text: 'Rất giỏi! Chiếc thuyền buồm đã sẵn sàng giương buồm ra khơi!' });
        setScore((prev) => prev + 5);
        setTimeout(handleNextStage, 1400);
      }
    }
  };

  // -------------------------------------------------------------
  // CÂU 5: CHINH PHỤC THỬ THÁCH
  // Một hình vuông lớn (140x140) chia thành 4 hình vuông nhỏ bằng nhau (70x70).
  // Học sinh kéo/chạm 4 mảnh hình vuông nhỏ vào đúng 4 vị trí:
  // Ô 1 (trên trái), Ô 2 (trên phải), Ô 3 (dưới trái), Ô 4 (dưới phải).
  // -------------------------------------------------------------
  const [placedGridSquares, setPlacedGridSquares] = useState<number[]>([]);
  const totalGridSlots = 4;

  const handlePlaceGridSquare = (quadrantIndex: number) => {
    if (feedback || placedGridSquares.includes(quadrantIndex)) return;
    soundEffects.click();
    const nextList = [...placedGridSquares, quadrantIndex];
    setPlacedGridSquares(nextList);

    if (nextList.length === totalGridSlots) {
      soundEffects.celebrate();
      setFeedback({ isCorrect: true, text: 'Tuyệt đỉnh! 4 hình vuông nhỏ đã ghép kín thành 1 hình vuông lớn hoàn hảo!' });
      setScore((prev) => prev + 5);
      setTimeout(() => {
        setIsCompleted(true);
        StorageService.recordActivity(student.id, {
          type: 'game',
          targetId: 'magic-shape-workshop',
          targetName: 'Xưởng Ghép Hình Kỳ Diệu',
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
    setIsQ1Filled(false);
    setIsQ2Filled(false);
    setPlacedRoof(false);
    setPlacedBody(false);
    setPlacedSail(false);
    setPlacedHull(false);
    setPlacedGridSquares([]);
  };

  const stageTitles = [
    'Thử thách 1: Ghép hình theo mẫu',
    'Thử thách 2: Hoàn thiện bức tranh',
    'Thử thách 3: Kiến trúc sư nhí',
    'Thử thách 4: Chiếc thuyền sáng tạo',
    'Thử thách 5: Chinh phục thử thách',
  ];

  return (
    <div className="w-full h-full max-h-[100dvh] flex flex-col bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white select-none overflow-hidden font-sans">
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
            <span className="text-xl">🧩</span>
            <div>
              <h1 className="text-xs sm:text-sm md:text-base font-black tracking-wide bg-gradient-to-r from-amber-300 via-pink-200 to-purple-300 bg-clip-text text-transparent uppercase">
                XƯỞNG GHÉP HÌNH KỲ DIỆU
              </h1>
              <p className="text-[11px] sm:text-xs text-purple-300 font-medium">
                {stageTitles[stageIndex] || 'Hoàn thành xưởng ghép hình'}
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
        {/* CÂU 1: GHÉP HÌNH THEO MẪU (Ghép đúng hình tam giác vào khung) */}
        {/* ========================================================= */}
        {stageIndex === 0 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 1 • Ghép hình theo mẫu
              </span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-amber-300 drop-shadow-md">
                Kéo đúng hình tam giác vào khung mờ!
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-purple-200/90 italic mt-0.5">
                <span>Fit the triangle into the matching frame!</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Fit the triangle into the matching frame!')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-purple-500/40 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center justify-around gap-4 sm:gap-6">
              {/* Target Frame (SVG Dashed Triangle) */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">Khung hình mẫu:</span>
                <div className="w-40 h-40 bg-slate-950/70 border border-purple-400/30 rounded-2xl flex items-center justify-center shadow-inner">
                  <svg viewBox="0 0 140 140" className="w-full h-full p-3">
                    {/* Target Outline (Dashed guide slot, borderless when filled) */}
                    <polygon
                      points="70,15 130,125 10,125"
                      fill={isQ1Filled ? '#f59e0b' : 'none'}
                      stroke={isQ1Filled ? 'none' : '#a855f7'}
                      strokeWidth={isQ1Filled ? 0 : 2.5}
                      strokeDasharray={isQ1Filled ? 'none' : '5,4'}
                    />
                    {isQ1Filled && (
                      <text x="70" y="90" textAnchor="middle" fontSize="24" fill="#ffffff" fontWeight="bold">✓</text>
                    )}
                  </svg>
                </div>
              </div>

              {/* Pieces Pool to Click */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">Chạm chọn mảnh ghép:</span>
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {q1Options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isQ1Filled}
                      onClick={() => handleSelectQ1(opt)}
                      className="w-24 h-24 rounded-2xl bg-slate-800/90 hover:bg-slate-700 border-2 border-purple-400/40 hover:border-amber-400 flex flex-col items-center justify-center p-2 shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <svg viewBox="0 0 70 70" className="w-14 h-14">
                        {opt.type === 'circle' && (
                          <circle cx="35" cy="35" r="28" fill="#ec4899" stroke="none" strokeWidth="0" />
                        )}
                        {opt.type === 'triangle' && (
                          <polygon points="35,10 62,60 8,60" fill="#f59e0b" stroke="none" strokeWidth="0" />
                        )}
                        {opt.type === 'square' && (
                          <rect x="10" y="10" width="50" height="50" fill="#3b82f6" stroke="none" strokeWidth="0" />
                        )}
                        {opt.type === 'rectangle' && (
                          <rect x="6" y="18" width="58" height="34" fill="#10b981" stroke="none" strokeWidth="0" />
                        )}
                      </svg>
                      <span className="text-[10px] font-bold text-slate-200 mt-1">{opt.nameVi}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CÂU 2: HOÀN THIỆN BỨC TRANH (Thiếu mảnh hình chữ nhật 120 x 60) */}
        {/* ========================================================= */}
        {stageIndex === 1 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 2 • Hoàn thiện bức tranh
              </span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-amber-300 drop-shadow-md">
                Chọn đúng mảnh còn thiếu để hoàn thiện bức tranh!
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-purple-200/90 italic mt-0.5">
                <span>Choose the missing piece to complete the picture!</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Choose the missing piece to complete the picture!')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-purple-500/40 backdrop-blur-md shadow-2xl flex flex-col items-center gap-4">
              {/* Truck picture with dashed rectangle container */}
              <div className="w-full max-w-md bg-slate-950 p-3 rounded-2xl border border-purple-400/30 flex items-center justify-center shadow-inner">
                <svg viewBox="0 0 320 150" className="w-full h-auto select-none">
                  {/* Truck Cabin (Square: 70 x 70 - no stroke) */}
                  <rect x="210" y="40" width="70" height="70" fill="#3b82f6" stroke="none" strokeWidth="0" />
                  {/* Cabin Window (Square: 32 x 32 - no stroke) */}
                  <rect x="235" y="50" width="32" height="32" fill="#bae6fd" stroke="none" strokeWidth="0" />

                  {/* Truck Cargo Body: Missing Rectangle (140 x 70) */}
                  <rect
                    x="50"
                    y="40"
                    width="140"
                    height="70"
                    fill={isQ2Filled ? '#10b981' : 'none'}
                    stroke={isQ2Filled ? 'none' : '#a855f7'}
                    strokeWidth={isQ2Filled ? 0 : 2.5}
                    strokeDasharray={isQ2Filled ? 'none' : '5,4'}
                  />
                  {isQ2Filled ? (
                    <text x="120" y="82" textAnchor="middle" fontSize="16" fontWeight="900" fill="#ffffff">THÙNG XE</text>
                  ) : (
                    <text x="120" y="80" textAnchor="middle" fontSize="12" fill="#c084fc" fontWeight="bold">Mảnh còn thiếu (?)</text>
                  )}

                  {/* Wheels (Circles - no stroke) */}
                  <circle cx="90" cy="120" r="18" fill="#1e293b" stroke="none" strokeWidth="0" />
                  <circle cx="90" cy="120" r="7" fill="#e2e8f0" stroke="none" strokeWidth="0" />
                  <circle cx="245" cy="120" r="18" fill="#1e293b" stroke="none" strokeWidth="0" />
                  <circle cx="245" cy="120" r="7" fill="#e2e8f0" stroke="none" strokeWidth="0" />
                </svg>
              </div>

              {/* Options */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-lg">
                {q2Options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isQ2Filled}
                    onClick={() => handleSelectQ2(opt)}
                    className="py-2.5 px-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border-2 border-purple-400/40 hover:border-amber-400 flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                  >
                    <svg viewBox="0 0 60 50" className="w-12 h-10 mb-1">
                      {opt.type === 'triangle' && (
                        <polygon points="30,5 55,45 5,45" fill="#f59e0b" stroke="none" strokeWidth="0" />
                      )}
                      {opt.type === 'rectangle' && (
                        <rect x="5" y="10" width="50" height="28" fill="#10b981" stroke="none" strokeWidth="0" />
                      )}
                      {opt.type === 'circle' && (
                        <circle cx="30" cy="25" r="20" fill="#ec4899" stroke="none" strokeWidth="0" />
                      )}
                      {opt.type === 'square' && (
                        <rect x="15" y="10" width="30" height="30" fill="#3b82f6" stroke="none" strokeWidth="0" />
                      )}
                    </svg>
                    <span className="text-[10px] font-bold text-slate-200">{opt.nameVi}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CÂU 3: KIẾN TRÚC SƯ NHÍ */}
        {/* Mái nhà hình tam giác (đáy 100, cao 60) + Thân nhà hình vuông (100x100). */}
        {/* Các cạnh khớp chính xác tuyệt đối. */}
        {/* ========================================================= */}
        {stageIndex === 2 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 3 • Kiến trúc sư nhí
              </span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-amber-300 drop-shadow-md">
                Ghép mái tam giác và thân vuông để xây ngôi nhà!
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-purple-200/90 italic mt-0.5">
                <span>Assemble the triangle roof and square house body!</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Assemble the triangle roof and square body!')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-purple-500/40 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-around gap-4 sm:gap-6">
              {/* Assembly Stage Area */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">Vùng ghép nhà:</span>
                <div className="w-44 h-52 bg-slate-950 p-2 rounded-2xl border border-purple-400/30 flex items-center justify-center shadow-inner">
                  <svg viewBox="0 0 140 180" className="w-full h-full select-none">
                    {/* Roof Slot (Triangle: đáy rộng 100 từ x=20 đến x=120, y=80; đỉnh x=70, y=20) */}
                    <polygon
                      points="70,20 120,80 20,80"
                      fill={placedRoof ? '#f97316' : 'none'}
                      stroke={placedRoof ? 'none' : '#c084fc'}
                      strokeWidth={placedRoof ? 0 : 2.5}
                      strokeDasharray={placedRoof ? 'none' : '4,3'}
                    />
                    {!placedRoof && (
                      <text x="70" y="60" textAnchor="middle" fontSize="10" fill="#a855f7" fontWeight="bold">Mái nhà</text>
                    )}

                    {/* House Body Slot (Square: x=20, y=80, w=100, h=100. Đáy mái và đỉnh thân trùng khít y=80!) */}
                    <rect
                      x="20"
                      y="80"
                      width="100"
                      height="100"
                      fill={placedBody ? '#eab308' : 'none'}
                      stroke={placedBody ? 'none' : '#c084fc'}
                      strokeWidth={placedBody ? 0 : 2.5}
                      strokeDasharray={placedBody ? 'none' : '4,3'}
                    />
                    {!placedBody && (
                      <text x="70" y="135" textAnchor="middle" fontSize="10" fill="#a855f7" fontWeight="bold">Thân nhà</text>
                    )}

                    {/* Windows & Door appear when both are placed (no stroke) */}
                    {placedBody && (
                      <>
                        <rect x="55" y="130" width="30" height="50" fill="#78350f" stroke="none" strokeWidth="0" />
                        <rect x="35" y="95" width="22" height="22" fill="#38bdf8" stroke="none" strokeWidth="0" />
                        <rect x="83" y="95" width="22" height="22" fill="#38bdf8" stroke="none" strokeWidth="0" />
                      </>
                    )}
                  </svg>
                </div>
              </div>

              {/* Pieces Tray */}
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">Chạm vào mảnh ghép để lắp:</span>
                <div className="flex sm:flex-col gap-3">
                  {/* Roof Piece button */}
                  <button
                    type="button"
                    disabled={placedRoof}
                    onClick={() => handlePlaceHousePiece('roof')}
                    className={`px-4 py-2.5 rounded-2xl border-2 flex items-center gap-3 transition-all transform cursor-pointer ${
                      placedRoof
                        ? 'opacity-30 bg-slate-800 border-slate-700 cursor-not-allowed'
                        : 'bg-slate-800 hover:bg-slate-700 border-amber-400 hover:scale-105 active:scale-95 shadow-md'
                    }`}
                  >
                    <svg viewBox="0 0 50 35" className="w-10 h-7">
                      <polygon points="25,5 45,30 5,30" fill="#f97316" stroke="none" strokeWidth="0" />
                    </svg>
                    <span className="font-bold text-xs text-amber-200">1. Mái tam giác</span>
                  </button>

                  {/* Body Piece button */}
                  <button
                    type="button"
                    disabled={placedBody}
                    onClick={() => handlePlaceHousePiece('body')}
                    className={`px-4 py-2.5 rounded-2xl border-2 flex items-center gap-3 transition-all transform cursor-pointer ${
                      placedBody
                        ? 'opacity-30 bg-slate-800 border-slate-700 cursor-not-allowed'
                        : 'bg-slate-800 hover:bg-slate-700 border-amber-400 hover:scale-105 active:scale-95 shadow-md'
                    }`}
                  >
                    <svg viewBox="0 0 40 40" className="w-8 h-8">
                      <rect x="5" y="5" width="30" height="30" fill="#eab308" stroke="none" strokeWidth="0" />
                    </svg>
                    <span className="font-bold text-xs text-amber-200">2. Thân vuông</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CÂU 4: CHIẾC THUYỀN SÁNG TẠO */}
        {/* 1 hình chữ nhật làm thân thuyền (140 x 40) + 1 hình tam giác làm cánh buồm (đáy 70, cao 90) */}
        {/* ========================================================= */}
        {stageIndex === 3 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 4 • Chiếc thuyền sáng tạo
              </span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-amber-300 drop-shadow-md">
                Ghép thuyền buồm từ hình chữ nhật và hình tam giác!
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-purple-200/90 italic mt-0.5">
                <span>Assemble the sailboat using rectangle and triangle!</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Assemble the sailboat using rectangle and triangle!')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-purple-500/40 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-around gap-4 sm:gap-6">
              {/* Boat Assembly Frame */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">Khung ghép thuyền:</span>
                <div className="w-56 h-48 bg-slate-950 p-2 rounded-2xl border border-purple-400/30 flex items-center justify-center shadow-inner">
                  <svg viewBox="0 0 200 160" className="w-full h-full select-none">
                    {/* Sail Slot (Triangle: x=100, y=20 to 100, 110 to 35, 110) */}
                    <polygon
                      points="100,20 100,110 35,110"
                      fill={placedSail ? '#ef4444' : 'none'}
                      stroke={placedSail ? 'none' : '#c084fc'}
                      strokeWidth={placedSail ? 0 : 2.5}
                      strokeDasharray={placedSail ? 'none' : '4,3'}
                    />
                    {/* Mast line */}
                    <line x1="100" y1="18" x2="100" y2="110" stroke="#fcd34d" strokeWidth="2.5" />

                    {!placedSail && (
                      <text x="75" y="80" textAnchor="middle" fontSize="10" fill="#a855f7" fontWeight="bold">Cánh buồm</text>
                    )}

                    {/* Boat Hull Slot (Rectangle: x=30, y=110, width=140, height=36) */}
                    <rect
                      x="30"
                      y="110"
                      width="140"
                      height="36"
                      fill={placedHull ? '#0284c7' : 'none'}
                      stroke={placedHull ? 'none' : '#c084fc'}
                      strokeWidth={placedHull ? 0 : 2.5}
                      strokeDasharray={placedHull ? 'none' : '4,3'}
                    />
                    {!placedHull && (
                      <text x="100" y="132" textAnchor="middle" fontSize="10" fill="#a855f7" fontWeight="bold">Thân thuyền</text>
                    )}

                    {/* Water waves */}
                    <path d="M10,150 Q40,142 70,150 T130,150 T190,150" fill="none" stroke="#38bdf8" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Pieces Tray */}
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">Chạm vào mảnh ghép để lắp:</span>
                <div className="flex sm:flex-col gap-3">
                  <button
                    type="button"
                    disabled={placedSail}
                    onClick={() => handlePlaceBoatPiece('sail')}
                    className={`px-4 py-2.5 rounded-2xl border-2 flex items-center gap-3 transition-all transform cursor-pointer ${
                      placedSail
                        ? 'opacity-30 bg-slate-800 border-slate-700 cursor-not-allowed'
                        : 'bg-slate-800 hover:bg-slate-700 border-amber-400 hover:scale-105 active:scale-95 shadow-md'
                    }`}
                  >
                    <svg viewBox="0 0 35 45" className="w-8 h-10">
                      <polygon points="30,5 30,40 5,40" fill="#ef4444" stroke="none" strokeWidth="0" />
                    </svg>
                    <span className="font-bold text-xs text-amber-200">1. Cánh buồm tam giác</span>
                  </button>

                  <button
                    type="button"
                    disabled={placedHull}
                    onClick={() => handlePlaceBoatPiece('hull')}
                    className={`px-4 py-2.5 rounded-2xl border-2 flex items-center gap-3 transition-all transform cursor-pointer ${
                      placedHull
                        ? 'opacity-30 bg-slate-800 border-slate-700 cursor-not-allowed'
                        : 'bg-slate-800 hover:bg-slate-700 border-amber-400 hover:scale-105 active:scale-95 shadow-md'
                    }`}
                  >
                    <svg viewBox="0 0 60 25" className="w-12 h-6">
                      <rect x="5" y="5" width="50" height="15" fill="#0284c7" stroke="none" strokeWidth="0" />
                    </svg>
                    <span className="font-bold text-xs text-amber-200">2. Thân thuyền chữ nhật</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CÂU 5: CHINH PHỤC THỬ THÁCH */}
        {/* 1 hình vuông lớn (140x140) chia thành 4 hình vuông nhỏ (70x70). */}
        {/* Ghép 4 mảnh khớp cạnh, không chồng lấn, không khe hở. */}
        {/* ========================================================= */}
        {stageIndex === 4 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-2.5 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 5 • Chinh phục ghép hình
              </span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-amber-300 drop-shadow-md">
                Ghép 4 hình vuông nhỏ thành 1 hình vuông lớn!
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-purple-200/90 italic mt-0.5">
                <span>Assemble 4 small squares into a big square!</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Assemble 4 small squares into a big square!')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-purple-500/40 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-around gap-4 sm:gap-6">
              {/* Big Square Assembly Frame (140 x 140 divided into 4 quadrants 70 x 70) */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">Khung hình vuông lớn:</span>
                <div className="w-44 h-44 bg-slate-950 p-2 rounded-2xl border-2 border-purple-400/40 flex items-center justify-center shadow-inner">
                  <svg viewBox="0 0 150 150" className="w-full h-full select-none">
                    {/* Big Square Outer Border: 140 x 140 at x=5, y=5 */}
                    <rect x="5" y="5" width="140" height="140" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,3" />

                    {/* Quadrant 0: Top-Left (70 x 70 at x=5, y=5 - no stroke when placed) */}
                    <rect
                      x="5"
                      y="5"
                      width="70"
                      height="70"
                      fill={placedGridSquares.includes(0) ? '#ef4444' : 'none'}
                      stroke={placedGridSquares.includes(0) ? 'none' : '#a855f7'}
                      strokeWidth={placedGridSquares.includes(0) ? 0 : 1.5}
                      strokeDasharray={placedGridSquares.includes(0) ? 'none' : '4,3'}
                    />

                    {/* Quadrant 1: Top-Right (70 x 70 at x=75, y=5 - no stroke when placed) */}
                    <rect
                      x="75"
                      y="5"
                      width="70"
                      height="70"
                      fill={placedGridSquares.includes(1) ? '#3b82f6' : 'none'}
                      stroke={placedGridSquares.includes(1) ? 'none' : '#a855f7'}
                      strokeWidth={placedGridSquares.includes(1) ? 0 : 1.5}
                      strokeDasharray={placedGridSquares.includes(1) ? 'none' : '4,3'}
                    />

                    {/* Quadrant 2: Bottom-Left (70 x 70 at x=5, y=75 - no stroke when placed) */}
                    <rect
                      x="5"
                      y="75"
                      width="70"
                      height="70"
                      fill={placedGridSquares.includes(2) ? '#10b981' : 'none'}
                      stroke={placedGridSquares.includes(2) ? 'none' : '#a855f7'}
                      strokeWidth={placedGridSquares.includes(2) ? 0 : 1.5}
                      strokeDasharray={placedGridSquares.includes(2) ? 'none' : '4,3'}
                    />

                    {/* Quadrant 3: Bottom-Right (70 x 70 at x=75, y=75 - no stroke when placed) */}
                    <rect
                      x="75"
                      y="75"
                      width="70"
                      height="70"
                      fill={placedGridSquares.includes(3) ? '#f59e0b' : 'none'}
                      stroke={placedGridSquares.includes(3) ? 'none' : '#a855f7'}
                      strokeWidth={placedGridSquares.includes(3) ? 0 : 1.5}
                      strokeDasharray={placedGridSquares.includes(3) ? 'none' : '4,3'}
                    />
                  </svg>
                </div>
              </div>

              {/* 4 Small Square Pieces to Click and Snap into Place */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">Chạm lần lượt 4 mảnh vuông:</span>
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {[
                    { id: 0, label: 'Mảnh Đỏ (Góc 1)', color: '#ef4444' },
                    { id: 1, label: 'Mảnh Xanh (Góc 2)', color: '#3b82f6' },
                    { id: 2, label: 'Mảnh Lục (Góc 3)', color: '#10b981' },
                    { id: 3, label: 'Mảnh Vàng (Góc 4)', color: '#f59e0b' },
                  ].map((p) => {
                    const isPlaced = placedGridSquares.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        disabled={isPlaced}
                        onClick={() => handlePlaceGridSquare(p.id)}
                        className={`w-20 h-20 sm:w-22 sm:h-22 rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all transform cursor-pointer shadow-lg ${
                          isPlaced
                            ? 'opacity-30 bg-slate-800 border-slate-700 cursor-not-allowed scale-95'
                            : 'bg-slate-800 hover:bg-slate-700 border-amber-400 hover:scale-105 active:scale-95'
                        }`}
                      >
                        <svg viewBox="0 0 40 40" className="w-10 h-10 mb-1">
                          <rect x="5" y="5" width="30" height="30" fill={p.color} stroke="none" strokeWidth="0" />
                        </svg>
                        <span className="text-[9px] font-bold text-slate-200">{isPlaced ? 'Đã lắp' : 'Lắp mảnh'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* COMPLETION MODAL */}
        {/* ========================================================= */}
        {isCompleted && (
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/95 border-2 border-purple-400 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center animate-scale-up my-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-purple-500 to-amber-300 flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_30px_rgba(168,85,247,0.6)] mb-3 animate-bounce">
              🏆
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-300 uppercase tracking-wide">
              CHÚC MỪNG CHIẾN THẮNG!
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 mt-1 font-medium">
              Bé đã chinh phục toàn bộ 5 thử thách của <br />
              <strong className="text-amber-300">XƯỞNG GHÉP HÌNH KỲ DIỆU</strong>!
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
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-amber-400 hover:from-purple-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm uppercase shadow-lg shadow-purple-500/30 transition transform hover:scale-105 cursor-pointer"
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
