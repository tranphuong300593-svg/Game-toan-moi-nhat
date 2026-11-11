import React, { useState } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundEffects } from '../../services/audioService';

interface TreasureHuntJourneyGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

export const TreasureHuntJourneyGame: React.FC<TreasureHuntJourneyGameProps> = ({
  student,
  langMode: _langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // -------------------------------------------------------------
  // THỬ THÁCH 1: CẦU ĐÁ THẦN KỲ (Sắp xếp số từ bé đến lớn trong phạm vi 100)
  // -------------------------------------------------------------
  const [selectedStones, setSelectedStones] = useState<number[]>([]);
  const stonePool = [28, 45, 16, 73]; // Target order: 16, 28, 45, 73
  const targetStoneOrder = [16, 28, 45, 73];

  const handleSelectStone = (num: number) => {
    if (selectedStones.includes(num) || feedback) return;
    soundEffects.click();
    const nextList = [...selectedStones, num];
    setSelectedStones(nextList);

    if (nextList.length === targetStoneOrder.length) {
      const isRight = nextList.every((val, idx) => val === targetStoneOrder[idx]);
      if (isRight) {
        soundEffects.correct();
        setFeedback({ isCorrect: true, text: 'Chính xác! Cầu đá thần kỳ đã được bắc qua suối!' });
        setScore((prev) => prev + 5);
        setTimeout(handleNextStage, 1500);
      } else {
        soundEffects.wrong();
        setFeedback({ isCorrect: false, text: 'Chưa đúng thứ tự từ bé đến lớn rồi! Hãy thử lại nhé.' });
        setTimeout(() => {
          setSelectedStones([]);
          setFeedback(null);
        }, 1500);
      }
    }
  };

  // -------------------------------------------------------------
  // THỬ THÁCH 2: BẾN CẢNG ĐO LƯỜNG (CÂU HỎI SỐ 2: ĐO CHIỀU DÀI BÚT CHÌ)
  // Chiếc bút chì dài 8 cm (tính cả phần cục tẩy)
  // Cục tẩy ở 0 cm, đầu nhọn ở 8 cm. Bút chì thẳng, song song, nằm ngay phía trên thước.
  // -------------------------------------------------------------
  const [measureSelected, setMeasureSelected] = useState<number | null>(null);
  const measureTargetCm = 8;
  const measureOptions = [7, 8, 9];

  const handleSelectMeasure = (val: number) => {
    if (measureSelected || feedback) return;
    setMeasureSelected(val);
    if (val === measureTargetCm) {
      soundEffects.correct();
      setFeedback({ isCorrect: true, text: 'Tuyệt vời! Chiếc bút chì dài chính xác 8 cm (tính cả cục tẩy)!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1500);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Chưa đúng rồi! Bé hãy nhìn kỹ vạch số ở đầu nhọn bút chì nhé!' });
      setTimeout(() => {
        setMeasureSelected(null);
        setFeedback(null);
      }, 1500);
    }
  };

  // -------------------------------------------------------------
  // THỬ THÁCH 3: KHU RỪNG HÌNH HỌC (Nhận biết hình tam giác)
  // -------------------------------------------------------------
  const [geoSelected, setGeoSelected] = useState<string | null>(null);
  const geoQuestion = {
    targetShape: 'tam giác',
    options: [
      { id: 'square', label: 'Hình vuông', shape: 'square' },
      { id: 'triangle', label: 'Hình tam giác', shape: 'triangle' },
      { id: 'circle', label: 'Hình tròn', shape: 'circle' },
      { id: 'rect', label: 'Hình chữ nhật', shape: 'rectangle' },
    ],
    correctId: 'triangle',
  };

  const handleSelectGeo = (id: string) => {
    if (geoSelected || feedback) return;
    setGeoSelected(id);
    if (id === geoQuestion.correctId) {
      soundEffects.correct();
      setFeedback({ isCorrect: true, text: 'Rất giỏi! Hốc đá hình tam giác đã phát sáng mở đường!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1500);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Chưa đúng hình tam giác rồi, bé hãy chọn lại nhé!' });
      setTimeout(() => {
        setGeoSelected(null);
        setFeedback(null);
      }, 1500);
    }
  };

  // -------------------------------------------------------------
  // THỬ THÁCH 4: THÁP ĐỒNG HỒ (Đọc giờ đúng: kim ngắn đỏ ở 4, kim dài xanh ở 12)
  // -------------------------------------------------------------
  const [clockSelected, setClockSelected] = useState<number | null>(null);
  const targetHour = 4;
  const clockOptions = [3, 4, 5];

  const handleSelectClock = (hour: number) => {
    if (clockSelected || feedback) return;
    setClockSelected(hour);
    if (hour === targetHour) {
      soundEffects.correct();
      setFeedback({ isCorrect: true, text: 'Chính xác! Đồng hồ chỉ đúng 4 giờ!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1500);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Kim ngắn chỉ số 4, kim dài chỉ số 12 là mấy giờ nhỉ? Thử lại nhé!' });
      setTimeout(() => {
        setClockSelected(null);
        setFeedback(null);
      }, 1500);
    }
  };

  // -------------------------------------------------------------
  // THỬ THÁCH 5: RƯƠNG BÁU CUỐI CÙNG (CÂU HỎI SỐ 5: BÀI TOÁN CÓ LỜI VĂN)
  // 35 + 14 = 49 đồng vàng
  // Bố cục tối ưu 16:9, không cuộn, song ngữ VI/EN rõ ràng
  // -------------------------------------------------------------
  const [wordProblemSelected, setWordProblemSelected] = useState<number | null>(null);
  const targetWordProblemAns = 49;
  const wordProblemOptions = [48, 49, 59];

  const handleSelectWordProblem = (ans: number) => {
    if (wordProblemSelected || feedback) return;
    setWordProblemSelected(ans);
    if (ans === targetWordProblemAns) {
      soundEffects.celebrate();
      setFeedback({ isCorrect: true, text: 'Xuất sắc! 35 + 14 = 49 đồng vàng! Rương báu mở tung!' });
      setScore((prev) => prev + 5);
      setTimeout(() => {
        setIsCompleted(true);
        StorageService.recordActivity(student.id, {
          type: 'game',
          targetId: 'treasure-hunt',
          targetName: 'Hành Trình Săn Kho Báu',
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
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Hãy tính nhẩm lại: 35 + 14 bằng bao nhiêu nhé!' });
      setTimeout(() => {
        setWordProblemSelected(null);
        setFeedback(null);
      }, 1400);
    }
  };

  const handleNextStage = () => {
    setFeedback(null);
    setCurrentStageIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentStageIndex(0);
    setScore(0);
    setFeedback(null);
    setIsCompleted(false);
    setSelectedStones([]);
    setMeasureSelected(null);
    setGeoSelected(null);
    setClockSelected(null);
    setWordProblemSelected(null);
  };

  const stageTitles = [
    'Thử thách 1: Cầu đá thần kỳ',
    'Thử thách 2: Bến cảng đo lường',
    'Thử thách 3: Khu rừng hình học',
    'Thử thách 4: Tháp đồng hồ',
    'Thử thách 5: Rương báu cuối cùng',
  ];

  return (
    <div className="w-full h-full max-h-[100dvh] flex flex-col bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white select-none overflow-hidden font-sans">
      {/* 1. Header bar (Compact & Clean) */}
      <header className="flex-none px-4 sm:px-6 py-2 sm:py-2.5 bg-black/50 backdrop-blur-md border-b border-emerald-500/30 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-bold text-xs sm:text-sm border border-amber-400/30 transition shadow-sm cursor-pointer"
          >
            ← Về Khu Vực 8
          </button>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <div>
            <h1 className="text-xs sm:text-sm md:text-base font-black tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-teal-300 bg-clip-text text-transparent uppercase">
              HÀNH TRÌNH SĂN KHO BÁU
            </h1>
            <p className="text-[11px] sm:text-xs text-emerald-300 font-medium">
              {stageTitles[currentStageIndex] || 'Hoàn thành chuyến thám hiểm'}
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex gap-1 sm:gap-1.5">
            {[0, 1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className={`w-6 sm:w-8 h-2 rounded-full transition-all duration-300 ${
                  idx < currentStageIndex
                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                    : idx === currentStageIndex
                    ? 'bg-emerald-400 animate-pulse'
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

      {/* 2. Main Game Stage Area (Flexible 16:9 Zero-Scroll Layout) */}
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
        {/* THỬ THÁCH 1: CẦU ĐÁ THẦN KỲ */}
        {/* ========================================================= */}
        {currentStageIndex === 0 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-5 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 1 • So sánh & Xếp số
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                BƯỚC LÊN CẦU ĐÁ THEO THỨ TỰ TỪ BÉ ĐẾN LỚN
              </h2>
              <p className="text-xs sm:text-sm text-teal-200 mt-0.5">
                Chạm lần lượt vào các phiến đá số từ bé nhất đến lớn nhất để bắc cầu qua suối!
              </p>
            </div>

            <div className="w-full p-4 sm:p-6 rounded-3xl bg-teal-950/70 border-2 border-teal-500/40 backdrop-blur-md shadow-2xl flex flex-col items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                <span className="text-xs font-bold text-amber-200 bg-amber-500/20 px-3 py-1 rounded-lg border border-amber-400/30">
                  Cầu đá của bé:
                </span>
                <div className="flex gap-2 sm:gap-3">
                  {[0, 1, 2, 3].map((slotIdx) => {
                    const stone = selectedStones[slotIdx];
                    return (
                      <div
                        key={slotIdx}
                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl border-2 transition-all ${
                          stone !== undefined
                            ? 'bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 border-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.5)] scale-105'
                            : 'bg-slate-900/60 border-dashed border-teal-500/40 text-teal-400/40'
                        }`}
                      >
                        {stone !== undefined ? stone : slotIdx + 1}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap">
                {stonePool.map((stoneVal) => {
                  const isUsed = selectedStones.includes(stoneVal);
                  return (
                    <button
                      key={stoneVal}
                      type="button"
                      disabled={isUsed}
                      onClick={() => handleSelectStone(stoneVal)}
                      className={`w-18 h-18 sm:w-22 sm:h-22 rounded-2xl font-black text-2xl sm:text-3xl shadow-xl transition-all transform flex flex-col items-center justify-center border-2 cursor-pointer ${
                        isUsed
                          ? 'opacity-30 bg-slate-800 border-slate-700 scale-95 cursor-not-allowed'
                          : 'bg-gradient-to-b from-teal-700 via-teal-800 to-emerald-900 hover:from-teal-600 hover:to-emerald-700 text-teal-100 border-teal-300/50 hover:scale-105 active:scale-95 shadow-teal-900/60'
                      }`}
                    >
                      <span className="drop-shadow">{stoneVal}</span>
                      <span className="text-[10px] text-teal-300 mt-0.5 uppercase font-semibold">Phiến đá</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* THỬ THÁCH 2: BẾN CẢNG ĐO LƯỜNG (CÂU HỎI SỐ 2: ĐO ĐỘ DÀI BÚT CHÌ) */}
        {/* Bút chì dài 8 cm (tính cả cục tẩy), đầu tẩy ở 0 cm, đầu chì ở 8 cm */}
        {/* ========================================================= */}
        {currentStageIndex === 1 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 2 • Đo độ dài xăng-ti-mét (cm)
              </span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-amber-300 drop-shadow-md">
                Chiếc bút chì dài bao nhiêu xăng-ti-mét (tính cả phần cục tẩy)?
              </h2>
              <p className="text-xs sm:text-sm text-teal-200/90 mt-0.5 italic">
                How many centimeters long is the pencil (including the eraser)?
              </p>
            </div>

            <div className="w-full p-4 sm:p-5 rounded-3xl bg-teal-950/70 border-2 border-teal-500/40 backdrop-blur-md shadow-2xl flex flex-col items-center gap-4">
              {/* Scalable Vector Ruler & Pencil Display (Pixel-Perfect 8 cm) */}
              <div className="w-full max-w-2xl bg-amber-50/95 rounded-2xl p-2 sm:p-3 border-2 border-amber-300 shadow-xl flex items-center justify-center">
                <svg
                  viewBox="0 0 600 160"
                  className="w-full h-auto max-h-[160px] select-none"
                  style={{ overflow: 'visible' }}
                >
                  <defs>
                    {/* Metal Ferrule Gradient */}
                    <linearGradient id="ferruleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#cbd5e1" />
                      <stop offset="50%" stopColor="#f8fafc" />
                      <stop offset="100%" stopColor="#94a3b8" />
                    </linearGradient>

                    {/* Pencil Shaft 3D Gradient */}
                    <linearGradient id="pencilShaftGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fde047" />
                      <stop offset="45%" stopColor="#eab308" />
                      <stop offset="85%" stopColor="#ca8a04" />
                      <stop offset="100%" stopColor="#a16207" />
                    </linearGradient>

                    {/* Ruler Gradient */}
                    <linearGradient id="rulerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fef3c7" />
                      <stop offset="100%" stopColor="#fde68a" />
                    </linearGradient>
                  </defs>

                  {/* --- GUIDELINES (Red Dashed) --- */}
                  {/* Guideline at 0 cm (X = 50) */}
                  <line
                    x1="50"
                    y1="25"
                    x2="50"
                    y2="95"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="4,3"
                  />
                  <rect x="30" y="8" width="40" height="18" rx="4" fill="#fee2e2" stroke="#ef4444" strokeWidth="1" />
                  <text x="50" y="21" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#b91c1c">0 cm</text>

                  {/* Guideline at 8 cm (X = 450) */}
                  <line
                    x1="450"
                    y1="25"
                    x2="450"
                    y2="95"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="4,3"
                  />
                  <rect x="430" y="8" width="40" height="18" rx="4" fill="#fee2e2" stroke="#ef4444" strokeWidth="1" />
                  <text x="450" y="21" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#b91c1c">8 cm</text>

                  {/* --- BÚT CHÌ (PENCIL): X = 50 to X = 450 (Length = 400px = EXACT 8 cm) --- */}
                  <g id="pencil">
                    {/* Shadow under pencil */}
                    <rect x="52" y="72" width="394" height="6" rx="3" fill="#000000" opacity="0.15" />

                    {/* 1. Pink Eraser: X = 50 to 80 (width 30, height 30) */}
                    <rect
                      x="50"
                      y="40"
                      width="30"
                      height="30"
                      rx="4"
                      fill="#f472b6"
                      stroke="#db2777"
                      strokeWidth="1.5"
                    />
                    {/* Eraser highlight */}
                    <rect x="52" y="42" width="26" height="4" rx="2" fill="#fbcfe8" opacity="0.8" />

                    {/* 2. Metal Ferrule: X = 80 to 98 (width 18, height 30) */}
                    <rect
                      x="80"
                      y="40"
                      width="18"
                      height="30"
                      fill="url(#ferruleGradient)"
                      stroke="#64748b"
                      strokeWidth="1.5"
                    />
                    <line x1="86" y1="40" x2="86" y2="70" stroke="#94a3b8" strokeWidth="1" />
                    <line x1="92" y1="40" x2="92" y2="70" stroke="#94a3b8" strokeWidth="1" />

                    {/* 3. Wooden Hexagonal Shaft: X = 98 to 400 (width 302, height 30) */}
                    <rect
                      x="98"
                      y="40"
                      width="302"
                      height="30"
                      fill="url(#pencilShaftGradient)"
                      stroke="#b45309"
                      strokeWidth="1.5"
                    />
                    {/* Pencil longitudinal facets for 3D effect */}
                    <line x1="98" y1="50" x2="400" y2="50" stroke="#fef08a" strokeWidth="1.5" />
                    <line x1="98" y1="60" x2="400" y2="60" stroke="#92400e" strokeWidth="1.5" />

                    {/* Gold text on pencil */}
                    <text
                      x="249"
                      y="58"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="900"
                      fill="#78350f"
                      letterSpacing="2"
                    >
                      ★ BÚT CHÌ TOÁN HỌC 2B ★
                    </text>

                    {/* 4. Sharpened Wood Cone: X = 400 to 450 (Length 50) */}
                    <polygon
                      points="400,40 450,55 400,70"
                      fill="#fef3c7"
                      stroke="#b45309"
                      strokeWidth="1.5"
                    />

                    {/* 5. Graphite Lead Core Tip: X = 432 to 450 (Tip point touches EXACTLY X = 450 = 8 cm) */}
                    <polygon
                      points="434,50 450,55 434,60"
                      fill="#0f172a"
                      stroke="#020617"
                      strokeWidth="0.5"
                    />
                  </g>

                  {/* --- THƯỚC ĐO (RULER): X = 50 (0 cm) to X = 550 (10 cm) --- */}
                  <g id="ruler">
                    {/* Ruler Body */}
                    <rect
                      x="40"
                      y="95"
                      width="520"
                      height="50"
                      rx="6"
                      fill="url(#rulerGradient)"
                      stroke="#b45309"
                      strokeWidth="2"
                    />

                    {/* Millimeter / Half-cm tick marks */}
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((cm) => (
                      <line
                        key={`half-${cm}`}
                        x1={50 + cm * 50 + 25}
                        y1="95"
                        x2={50 + cm * 50 + 25}
                        y2="108"
                        stroke="#78350f"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Centimeter tick marks (0 to 10) and numbers */}
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((cm) => {
                      const x = 50 + cm * 50;
                      const isHighlighted = cm === 8;
                      return (
                        <g key={`cm-${cm}`}>
                          <line
                            x1={x}
                            y1="95"
                            x2={x}
                            y2={cm % 5 === 0 ? '118' : '114'}
                            stroke={isHighlighted ? '#b91c1c' : '#1e293b'}
                            strokeWidth={isHighlighted ? '2.5' : '1.8'}
                          />
                          <text
                            x={x}
                            y="134"
                            textAnchor="middle"
                            fontSize="15"
                            fontWeight={isHighlighted ? '900' : '800'}
                            fill={isHighlighted ? '#b91c1c' : '#1e293b'}
                          >
                            {cm}
                          </text>
                        </g>
                      );
                    })}

                    {/* Unit 'cm' */}
                    <text
                      x="546"
                      y="134"
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="900"
                      fill="#78350f"
                    >
                      cm
                    </text>
                  </g>
                </svg>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-center gap-4 sm:gap-6 w-full">
                {measureOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectMeasure(opt)}
                    className={`flex-1 max-w-[140px] py-3 sm:py-3.5 rounded-2xl font-black text-xl sm:text-2xl border-2 transition-all transform shadow-xl cursor-pointer ${
                      measureSelected === opt
                        ? opt === measureTargetCm
                          ? 'border-emerald-400 bg-emerald-600 text-white scale-105 shadow-emerald-500/50'
                          : 'border-rose-400 bg-rose-600 text-white scale-95'
                        : 'border-amber-400/50 bg-slate-850 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-300 hover:scale-105 active:scale-95 text-amber-200'
                    }`}
                  >
                    {opt} cm
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* THỬ THÁCH 3: KHU RỪNG HÌNH HỌC */}
        {/* ========================================================= */}
        {currentStageIndex === 2 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-5 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 3 • Nhận biết hình học
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                CHỌN ĐÚNG <span className="text-yellow-300 uppercase underline decoration-wavy">HÌNH TAM GIÁC</span> ĐỂ MỞ CỔNG RỪNG!
              </h2>
              <p className="text-xs sm:text-sm text-teal-200 mt-0.5">
                Khu rừng phép thuật cần một khối ngọc hình tam giác để kích hoạt ánh sáng thần bí.
              </p>
            </div>

            <div className="w-full p-4 sm:p-6 rounded-3xl bg-teal-950/70 border-2 border-teal-500/40 backdrop-blur-md shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {geoQuestion.options.map((opt) => {
                const isPicked = geoSelected === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectGeo(opt.id)}
                    className={`h-36 sm:h-44 rounded-2xl border-2 flex flex-col items-center justify-center p-3 transition-all transform shadow-lg cursor-pointer ${
                      isPicked
                        ? opt.id === geoQuestion.correctId
                          ? 'border-emerald-400 bg-emerald-600/40 scale-105'
                          : 'border-rose-400 bg-rose-600/40 scale-95'
                        : 'border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 hover:border-amber-400/60 hover:scale-105 active:scale-95'
                    }`}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-2">
                      {opt.shape === 'square' && (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-400 rounded-md border-2 border-emerald-200 shadow-md" />
                      )}
                      {opt.shape === 'triangle' && (
                        <div className="w-0 h-0 border-l-[30px] sm:border-l-[34px] border-l-transparent border-r-[30px] sm:border-r-[34px] border-r-transparent border-b-[50px] sm:border-b-[58px] border-b-amber-400 drop-shadow-md" />
                      )}
                      {opt.shape === 'circle' && (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-rose-400 rounded-full border-2 border-rose-200 shadow-md" />
                      )}
                      {opt.shape === 'rectangle' && (
                        <div className="w-16 h-10 sm:w-20 sm:h-12 bg-sky-400 rounded-md border-2 border-sky-200 shadow-md" />
                      )}
                    </div>
                    <span className="font-black text-sm sm:text-base text-slate-100">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* THỬ THÁCH 4: THÁP ĐỒNG HỒ */}
        {/* ========================================================= */}
        {currentStageIndex === 3 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 4 • Xem đồng hồ đúng giờ
              </span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-amber-300 drop-shadow-md">
                ĐỒNG HỒ TRÊN THÁP CHỈ MẤY GIỜ?
              </h2>
              <p className="text-xs sm:text-sm text-teal-200 mt-0.5">
                Kim ngắn (màu đỏ) chỉ số 4, kim dài (màu xanh) chỉ số 12.
              </p>
            </div>

            <div className="w-full p-4 sm:p-6 rounded-3xl bg-teal-950/70 border-2 border-teal-500/40 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8">
              {/* SVG Analog Clock */}
              <div className="w-44 h-44 sm:w-52 sm:h-52 relative flex items-center justify-center shrink-0">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                  <circle cx="100" cy="100" r="95" fill="#fef3c7" stroke="#b45309" strokeWidth="8" />
                  <circle cx="100" cy="100" r="88" fill="#ffffff" stroke="#fde68a" strokeWidth="3" />

                  {[
                    { num: 12, x: 100, y: 32 },
                    { num: 1, x: 134, y: 41 },
                    { num: 2, x: 159, y: 66 },
                    { num: 3, x: 168, y: 100 },
                    { num: 4, x: 159, y: 134 },
                    { num: 5, x: 134, y: 159 },
                    { num: 6, x: 100, y: 168 },
                    { num: 7, x: 66, y: 159 },
                    { num: 8, x: 41, y: 134 },
                    { num: 9, x: 32, y: 100 },
                    { num: 10, x: 41, y: 66 },
                    { num: 11, x: 66, y: 41 },
                  ].map(({ num, x, y }) => (
                    <text
                      key={num}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={num === 12 || num === 3 || num === 6 || num === 9 ? '18' : '15'}
                      fontWeight="900"
                      fill={num === 4 ? '#dc2626' : '#1e293b'}
                    >
                      {num}
                    </text>
                  ))}

                  {/* Kim ngắn (đỏ): số 4 (120 độ) */}
                  <line
                    x1="100"
                    y1="100"
                    x2={100 + 36 * Math.cos(((120 - 90) * Math.PI) / 180)}
                    y2={100 + 36 * Math.sin(((120 - 90) * Math.PI) / 180)}
                    stroke="#dc2626"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />

                  {/* Kim dài (xanh): số 12 (0 độ) */}
                  <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="48"
                    stroke="#0284c7"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <circle cx="100" cy="100" r="6" fill="#1e293b" />
                  <circle cx="100" cy="100" r="2.5" fill="#fde68a" />
                </svg>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider text-center md:text-left">
                  Chọn giờ đúng:
                </span>
                <div className="flex md:flex-col gap-2.5 sm:gap-3">
                  {clockOptions.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => handleSelectClock(hour)}
                      className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl font-black text-lg sm:text-xl border-2 transition-all transform shadow-xl cursor-pointer ${
                        clockSelected === hour
                          ? hour === targetHour
                            ? 'border-emerald-400 bg-emerald-600 text-white scale-105'
                            : 'border-rose-400 bg-rose-600 text-white scale-95'
                          : 'border-amber-400/50 bg-slate-850 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-300 hover:scale-105 active:scale-95 text-amber-200'
                      }`}
                    >
                      {hour} giờ
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* THỬ THÁCH 5: RƯƠNG BÁU CUỐI CÙNG (CÂU HỎI SỐ 5: BÀI TOÁN CÓ LỜI VĂN) */}
        {/* Thiết kế tối ưu trọn vẹn màn hình 16:9, không che khuất, không cuộn */}
        {/* ========================================================= */}
        {currentStageIndex === 4 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-2.5 sm:gap-4 my-auto">
            {/* Header / Title of Question 5 */}
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 5 • Bài toán có lời văn
              </span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-amber-300 drop-shadow-md">
                GIẢI TOÁN MỞ RƯƠNG BÁU CUỐI CÙNG!
              </h2>
              <p className="text-xs sm:text-sm text-teal-200/90 mt-0.5 italic">
                Solve the word problem to unlock the grand treasure chest!
              </p>
            </div>

            {/* Word Problem Card (Compact, Responsive, Centered) */}
            <div className="w-full p-4 sm:p-5 rounded-3xl bg-teal-950/80 border-2 border-teal-500/50 backdrop-blur-md shadow-2xl flex flex-col items-center gap-3 sm:gap-4">
              <div className="w-full bg-amber-950/40 border border-amber-400/40 rounded-2xl p-3.5 sm:p-4 text-center shadow-inner flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
                {/* 3D Cute Chest Icon / Illustration */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-3xl sm:text-4xl shadow-md shrink-0">
                  👑
                </div>

                {/* Problem Statement: Vietnamese (Large & Clear) + English (Right below) */}
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-sm sm:text-base md:text-lg font-bold text-amber-100 leading-snug">
                    Bác thuyền trưởng có <span className="text-yellow-300 font-black text-base sm:text-xl">35</span> đồng vàng. Trên đảo, bác tìm thấy thêm <span className="text-yellow-300 font-black text-base sm:text-xl">14</span> đồng vàng nữa.
                  </p>
                  <p className="text-sm sm:text-base font-black text-teal-300 mt-1">
                    Hỏi bác thuyền trưởng có tất cả bao nhiêu đồng vàng?
                  </p>
                  {/* English Translation */}
                  <p className="text-[11px] sm:text-xs text-teal-200/80 italic mt-0.5">
                    Captain has 35 gold coins and finds 14 more. How many gold coins in total?
                  </p>
                </div>
              </div>

              {/* Equation Clue Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-slate-900/80 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold shadow-inner">
                <span>✨</span>
                <span>Phép tính: 35 + 14 = ? (đồng vàng)</span>
              </div>

              {/* Answer Choices (Equal Size, Touch-Friendly, Never Overflowing) */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg">
                {wordProblemOptions.map((ans) => (
                  <button
                    key={ans}
                    type="button"
                    onClick={() => handleSelectWordProblem(ans)}
                    className={`h-14 sm:h-16 rounded-2xl font-black text-xl sm:text-2xl border-2 transition-all transform shadow-xl flex flex-col items-center justify-center cursor-pointer ${
                      wordProblemSelected === ans
                        ? ans === targetWordProblemAns
                          ? 'border-emerald-400 bg-emerald-600 text-white scale-105 shadow-emerald-500/50'
                          : 'border-rose-400 bg-rose-600 text-white scale-95'
                        : 'border-amber-400/50 bg-slate-850 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-300 hover:scale-105 active:scale-95 text-amber-200'
                    }`}
                  >
                    <span>{ans}</span>
                    <span className="text-[10px] sm:text-xs font-semibold opacity-80 -mt-0.5">đồng vàng</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* COMPLETION MODAL */}
        {/* ========================================================= */}
        {isCompleted && (
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/95 border-2 border-amber-400 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center animate-scale-up my-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_30px_rgba(251,191,36,0.6)] mb-3 animate-bounce">
              🏆
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-300 uppercase tracking-wide">
              CHÚC MỪNG CHIẾN THẮNG!
            </h2>
            <p className="text-xs sm:text-sm text-teal-200 mt-1 font-medium">
              Bé đã chinh phục toàn bộ 5 thử thách của <br />
              <strong className="text-amber-300">HÀNH TRÌNH SĂN KHO BÁU</strong>!
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
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm uppercase shadow-lg shadow-amber-500/30 transition transform hover:scale-105 cursor-pointer"
              >
                Về Khu Vực 8
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
