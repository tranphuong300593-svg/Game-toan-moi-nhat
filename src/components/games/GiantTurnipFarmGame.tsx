import React, { useState } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundEffects, soundService } from '../../services/audioService';
import { Volume2, Check, Delete } from 'lucide-react';

interface GiantTurnipFarmGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

export const GiantTurnipFarmGame: React.FC<GiantTurnipFarmGameProps> = ({
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
  // THỬ THÁCH 1: QUẦY HÀNG HÌNH HỌC
  // "Hãy chọn vật có dạng hình tròn."
  // -------------------------------------------------------------
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const shapeItems = [
    {
      id: 'circle-cookie',
      nameVi: 'Bánh quy tròn',
      shape: 'Hình tròn',
      emoji: '🍪',
      isCorrect: true,
      color: 'from-amber-500 to-yellow-600',
    },
    {
      id: 'square-box',
      nameVi: 'Hộp bánh vuông',
      shape: 'Hình vuông',
      emoji: '🟨',
      isCorrect: false,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'triangle-pizza',
      nameVi: 'Bánh pizza tam giác',
      shape: 'Hình tam giác',
      emoji: '🍕',
      isCorrect: false,
      color: 'from-orange-500 to-red-600',
    },
    {
      id: 'rect-milk',
      nameVi: 'Hộp sữa chữ nhật',
      shape: 'Hình chữ nhật',
      emoji: '🧃',
      isCorrect: false,
      color: 'from-sky-500 to-blue-600',
    },
  ];

  const handleSelectShape = (item: (typeof shapeItems)[0]) => {
    if (selectedShapeId || feedback) return;
    setSelectedShapeId(item.id);
    if (item.isCorrect) {
      soundEffects.correct();
      setFeedback({ isCorrect: true, text: 'Chính xác! Chiếc bánh quy có dạng hình tròn!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1400);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: `Chưa đúng! ${item.nameVi} là ${item.shape}, hãy chọn vật hình tròn nhé!` });
      setTimeout(() => {
        setSelectedShapeId(null);
        setFeedback(null);
      }, 1400);
    }
  };

  // -------------------------------------------------------------
  // THỬ THÁCH 2: ĐO HÀNG TRƯỚC KHI BÁN
  // "Chiếc bút chì dài bao nhiêu xăng-ti-mét?" -> 8 cm
  // Thước 0-10 cm, cục tẩy ở 0 cm, đầu ngòi ở 8 cm, tính cả cục tẩy.
  // -------------------------------------------------------------
  const [selectedMeasure, setSelectedMeasure] = useState<number | null>(null);
  const targetMeasure = 8;
  const measureOptions = [7, 8, 9];

  const handleSelectMeasure = (val: number) => {
    if (selectedMeasure || feedback) return;
    setSelectedMeasure(val);
    if (val === targetMeasure) {
      soundEffects.correct();
      setFeedback({ isCorrect: true, text: 'Tuyệt vời! Chiếc bút chì dài chính xác 8 cm (tính cả cục tẩy)!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1400);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Chưa chính xác! Bé hãy nhìn vạch số ở đầu nhọn bút chì nhé!' });
      setTimeout(() => {
        setSelectedMeasure(null);
        setFeedback(null);
      }, 1400);
    }
  };

  // -------------------------------------------------------------
  // THỬ THÁCH 3: SIÊU THỊ MỞ CỬA LÚC MẤY GIỜ?
  // Đồng hồ kim chỉ 9 giờ đúng. Kim ngắn chỉ 9, kim dài chỉ 12.
  // -------------------------------------------------------------
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const targetHour = 9;
  const hourOptions = [8, 9, 10];

  const handleSelectHour = (val: number) => {
    if (selectedHour || feedback) return;
    setSelectedHour(val);
    if (val === targetHour) {
      soundEffects.correct();
      setFeedback({ isCorrect: true, text: 'Chính xác! Đồng hồ chỉ đúng 9 giờ, siêu thị mở cửa đón khách!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1400);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Kim ngắn chỉ số 9, kim dài chỉ số 12 là mấy giờ nhỉ? Thử lại nhé!' });
      setTimeout(() => {
        setSelectedHour(null);
        setFeedback(null);
      }, 1400);
    }
  };

  // -------------------------------------------------------------
  // THỬ THÁCH 4: THU NGÂN TÍNH NHANH
  // 56 - 24 = ? -> 32
  // -------------------------------------------------------------
  const [selectedCalcAns, setSelectedCalcAns] = useState<number | null>(null);
  const targetCalcAns = 32;
  const calcOptions = [22, 32, 42];

  const handleSelectCalc = (ans: number) => {
    if (selectedCalcAns || feedback) return;
    setSelectedCalcAns(ans);
    if (ans === targetCalcAns) {
      soundEffects.correct();
      setFeedback({ isCorrect: true, text: 'Rất giỏi! 56 - 24 = 32! Bé tính rất nhanh!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1400);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Bé hãy trừ nhẩm: 6 - 4 = 2 và 5 - 2 = 3 nhé!' });
      setTimeout(() => {
        setSelectedCalcAns(null);
        setFeedback(null);
      }, 1400);
    }
  };

  // -------------------------------------------------------------
  // THỬ THÁCH 5: HÓA ĐƠN BÍ MẬT (BÀI TOÁN CÓ LỜI VĂN)
  // "Siêu thị có 35 hộp sữa, đã bán 12 hộp. Hỏi còn lại bao nhiêu hộp sữa?"
  // Phép tính: 35 - 12 = 23
  // -------------------------------------------------------------
  const [inputInvoiceAns, setInputInvoiceAns] = useState<string>('');
  const targetInvoiceAns = '23';

  const handleKeypadPress = (val: string) => {
    if (feedback) return;
    soundEffects.click();
    if (val === 'DEL') {
      setInputInvoiceAns((prev) => prev.slice(0, -1));
    } else if (inputInvoiceAns.length < 3) {
      setInputInvoiceAns((prev) => prev + val);
    }
  };

  const handleConfirmInvoice = () => {
    if (!inputInvoiceAns || feedback) return;
    if (inputInvoiceAns === targetInvoiceAns) {
      soundEffects.celebrate();
      setFeedback({ isCorrect: true, text: 'Xuất sắc! 35 - 12 = 23 hộp sữa! Hóa đơn đã hoàn thành!' });
      setScore((prev) => prev + 5);
      setTimeout(() => {
        setIsCompleted(true);
        StorageService.recordActivity(student.id, {
          type: 'game',
          targetId: 'giant-turnip-farm',
          targetName: 'Thu Ngân Nhí Tài Ba',
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
      setFeedback({ isCorrect: false, text: 'Bé hãy tính nhẩm lại: 35 trừ 12 bằng bao nhiêu nhé!' });
      setTimeout(() => {
        setInputInvoiceAns('');
        setFeedback(null);
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
    setSelectedShapeId(null);
    setSelectedMeasure(null);
    setSelectedHour(null);
    setSelectedCalcAns(null);
    setInputInvoiceAns('');
  };

  const stageTitles = [
    'Thử thách 1: Quầy hàng hình học',
    'Thử thách 2: Đo hàng trước khi bán',
    'Thử thách 3: Siêu thị mở cửa lúc mấy giờ?',
    'Thử thách 4: Thu ngân tính nhanh',
    'Thử thách 5: Hóa đơn bí mật',
  ];

  return (
    <div className="w-full h-full max-h-[100dvh] flex flex-col bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white select-none overflow-hidden font-sans">
      {/* 1. Header Bar (Compact & Clean) */}
      <header className="flex-none px-4 sm:px-6 py-2 sm:py-2.5 bg-black/50 backdrop-blur-md border-b border-emerald-500/30 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-bold text-xs sm:text-sm border border-amber-400/30 transition shadow-sm cursor-pointer"
          >
            ← Về Siêu Thị
          </button>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xl">🧾</span>
            <div>
              <h1 className="text-xs sm:text-sm md:text-base font-black tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-teal-300 bg-clip-text text-transparent uppercase">
                THU NGÂN NHÍ TÀI BA
              </h1>
              <p className="text-[11px] sm:text-xs text-emerald-300 font-medium">
                {stageTitles[stageIndex] || 'Hoàn thành ca làm việc thu ngân'}
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

      {/* 2. Main Stage Area (Flexible 16:9 Zero-Scroll Layout) */}
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
        {/* CÂU 1: QUẦY HÀNG HÌNH HỌC */}
        {/* ========================================================= */}
        {stageIndex === 0 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 1 • Nhận biết hình phẳng
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                Hãy chọn vật có dạng hình tròn
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-teal-200/90 italic mt-0.5">
                <span>Choose the object shaped like a circle</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Choose the object shaped like a circle')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-6 rounded-3xl bg-slate-900/80 border-2 border-emerald-500/40 backdrop-blur-md shadow-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {shapeItems.map((item) => {
                const isPicked = selectedShapeId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectShape(item)}
                    className={`h-36 sm:h-44 rounded-2xl border-2 flex flex-col items-center justify-center p-3 transition-all transform shadow-lg cursor-pointer ${
                      isPicked
                        ? item.isCorrect
                          ? 'border-emerald-400 bg-emerald-600/40 scale-105 shadow-[0_0_20px_rgba(52,211,153,0.6)]'
                          : 'border-rose-400 bg-rose-600/40 scale-95'
                        : 'border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 hover:border-amber-400/60 hover:scale-105 active:scale-95'
                    }`}
                  >
                    <span className="text-4xl sm:text-5xl mb-2 filter drop-shadow">
                      {item.emoji}
                    </span>
                    <span className="font-black text-sm sm:text-base text-slate-100 text-center">
                      {item.nameVi}
                    </span>
                    <span className="text-[10px] text-teal-300 font-semibold mt-1">
                      {item.shape}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CÂU 2: ĐO HÀNG TRƯỚC KHI BÁN (BÚT CHÌ DÀI 8 CM) */}
        {/* ========================================================= */}
        {stageIndex === 1 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 2 • Đo độ dài xăng-ti-mét (cm)
              </span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-amber-300 drop-shadow-md">
                Chiếc bút chì dài bao nhiêu xăng-ti-mét?
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-teal-200/90 italic mt-0.5">
                <span>How many centimeters long is the pencil?</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('How many centimeters long is the pencil?')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-emerald-500/40 backdrop-blur-md shadow-2xl flex flex-col items-center gap-4">
              {/* Scalable Vector Ruler & Pencil (8 cm exact) */}
              <div className="w-full max-w-2xl bg-amber-50/95 rounded-2xl p-2 sm:p-3 border-2 border-amber-300 shadow-xl flex items-center justify-center">
                <svg
                  viewBox="0 0 600 160"
                  className="w-full h-auto max-h-[160px] select-none"
                  style={{ overflow: 'visible' }}
                >
                  <defs>
                    <linearGradient id="ferruleGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#cbd5e1" />
                      <stop offset="50%" stopColor="#f8fafc" />
                      <stop offset="100%" stopColor="#94a3b8" />
                    </linearGradient>

                    <linearGradient id="pencilGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fde047" />
                      <stop offset="45%" stopColor="#eab308" />
                      <stop offset="85%" stopColor="#ca8a04" />
                      <stop offset="100%" stopColor="#a16207" />
                    </linearGradient>

                    <linearGradient id="rulerGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fef3c7" />
                      <stop offset="100%" stopColor="#fde68a" />
                    </linearGradient>
                  </defs>

                  {/* Guidelines */}
                  <line x1="50" y1="25" x2="50" y2="95" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,3" />
                  <rect x="30" y="8" width="40" height="18" rx="4" fill="#fee2e2" stroke="#ef4444" strokeWidth="1" />
                  <text x="50" y="21" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#b91c1c">0 cm</text>

                  <line x1="450" y1="25" x2="450" y2="95" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,3" />
                  <rect x="430" y="8" width="40" height="18" rx="4" fill="#fee2e2" stroke="#ef4444" strokeWidth="1" />
                  <text x="450" y="21" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#b91c1c">8 cm</text>

                  {/* Pencil (Length 400px = 8 cm exact) */}
                  <g>
                    <rect x="52" y="72" width="394" height="6" rx="3" fill="#000000" opacity="0.15" />
                    {/* Pink Eraser (0 cm) */}
                    <rect x="50" y="40" width="30" height="30" rx="4" fill="#f472b6" stroke="#db2777" strokeWidth="1.5" />
                    <rect x="52" y="42" width="26" height="4" rx="2" fill="#fbcfe8" opacity="0.8" />
                    {/* Metal Ferrule */}
                    <rect x="80" y="40" width="18" height="30" fill="url(#ferruleGrad2)" stroke="#64748b" strokeWidth="1.5" />
                    <line x1="86" y1="40" x2="86" y2="70" stroke="#94a3b8" strokeWidth="1" />
                    <line x1="92" y1="40" x2="92" y2="70" stroke="#94a3b8" strokeWidth="1" />
                    {/* Shaft */}
                    <rect x="98" y="40" width="302" height="30" fill="url(#pencilGrad2)" stroke="#b45309" strokeWidth="1.5" />
                    <line x1="98" y1="50" x2="400" y2="50" stroke="#fef08a" strokeWidth="1.5" />
                    <line x1="98" y1="60" x2="400" y2="60" stroke="#92400e" strokeWidth="1.5" />
                    <text x="249" y="58" textAnchor="middle" fontSize="11" fontWeight="900" fill="#78350f" letterSpacing="2">
                      ★ BÚT CHÌ SIÊU THỊ 2B ★
                    </text>
                    {/* Wood Cone */}
                    <polygon points="400,40 450,55 400,70" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
                    {/* Lead Tip (8 cm mark) */}
                    <polygon points="434,50 450,55 434,60" fill="#0f172a" stroke="#020617" strokeWidth="0.5" />
                  </g>

                  {/* Ruler */}
                  <g>
                    <rect x="40" y="95" width="520" height="50" rx="6" fill="url(#rulerGrad2)" stroke="#b45309" strokeWidth="2" />
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((cm) => (
                      <line key={`half-${cm}`} x1={50 + cm * 50 + 25} y1="95" x2={50 + cm * 50 + 25} y2="108" stroke="#78350f" strokeWidth="1" />
                    ))}
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((cm) => {
                      const x = 50 + cm * 50;
                      const isHighlighted = cm === 8;
                      return (
                        <g key={`cm-${cm}`}>
                          <line x1={x} y1="95" x2={x} y2={cm % 5 === 0 ? '118' : '114'} stroke={isHighlighted ? '#b91c1c' : '#1e293b'} strokeWidth={isHighlighted ? '2.5' : '1.8'} />
                          <text x={x} y="134" textAnchor="middle" fontSize="15" fontWeight={isHighlighted ? '900' : '800'} fill={isHighlighted ? '#b91c1c' : '#1e293b'}>
                            {cm}
                          </text>
                        </g>
                      );
                    })}
                    <text x="546" y="134" textAnchor="middle" fontSize="13" fontWeight="900" fill="#78350f">cm</text>
                  </g>
                </svg>
              </div>

              {/* Options */}
              <div className="flex items-center justify-center gap-4 sm:gap-6 w-full">
                {measureOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectMeasure(opt)}
                    className={`flex-1 max-w-[140px] py-3 sm:py-3.5 rounded-2xl font-black text-xl sm:text-2xl border-2 transition-all transform shadow-xl cursor-pointer ${
                      selectedMeasure === opt
                        ? opt === targetMeasure
                          ? 'border-emerald-400 bg-emerald-600 text-white scale-105 shadow-emerald-500/50'
                          : 'border-rose-400 bg-rose-600 text-white scale-95'
                        : 'border-amber-400/50 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-300 hover:scale-105 active:scale-95 text-amber-200'
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
        {/* CÂU 3: SIÊU THỊ MỞ CỬA LÚC MẤY GIỜ? (9 GIỜ ĐÚNG) */}
        {/* ========================================================= */}
        {stageIndex === 2 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 3 • Xem đồng hồ đúng giờ
              </span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-amber-300 drop-shadow-md">
                Đồng hồ chỉ mấy giờ?
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-teal-200/90 italic mt-0.5">
                <span>What time does the clock show?</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('What time does the clock show?')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-6 rounded-3xl bg-slate-900/80 border-2 border-emerald-500/40 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8">
              {/* Analog Clock (9:00 exact) */}
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
                      fill={num === 9 ? '#dc2626' : '#1e293b'}
                    >
                      {num}
                    </text>
                  ))}

                  {/* Kim ngắn (đỏ): chỉ số 9 (nằm ngang sang trái, length 36px) */}
                  <line
                    x1="100"
                    y1="100"
                    x2="64"
                    y2="100"
                    stroke="#dc2626"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />

                  {/* Kim dài (xanh): chỉ số 12 (thẳng đứng lên trên, length 50px) */}
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
                  {hourOptions.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => handleSelectHour(hour)}
                      className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl font-black text-lg sm:text-xl border-2 transition-all transform shadow-xl cursor-pointer ${
                        selectedHour === hour
                          ? hour === targetHour
                            ? 'border-emerald-400 bg-emerald-600 text-white scale-105 shadow-emerald-500/50'
                            : 'border-rose-400 bg-rose-600 text-white scale-95'
                          : 'border-amber-400/50 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-300 hover:scale-105 active:scale-95 text-amber-200'
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
        {/* CÂU 4: THU NGÂN TÍNH NHANH (56 - 24 = 32) */}
        {/* ========================================================= */}
        {stageIndex === 3 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 4 • Phép tính trừ hai chữ số không mượn
              </span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-amber-300 drop-shadow-md">
                56 − 24 = ?
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-teal-200/90 italic mt-0.5">
                <span>Calculate: 56 − 24 = ?</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Calculate: 56 minus 24')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-6 rounded-3xl bg-slate-900/80 border-2 border-emerald-500/40 backdrop-blur-md shadow-2xl flex flex-col items-center gap-5">
              {/* Cashier Calculator Screen */}
              <div className="px-8 py-4 rounded-2xl bg-slate-950 border-2 border-amber-400/40 text-center shadow-inner">
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-widest block mb-1">
                  MÁY TÍNH TIỀN THU NGÂN
                </span>
                <span className="text-3xl sm:text-4xl font-mono font-black text-yellow-300 tracking-wider">
                  56 − 24 = ?
                </span>
              </div>

              {/* Options */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-md">
                {calcOptions.map((ans) => (
                  <button
                    key={ans}
                    type="button"
                    onClick={() => handleSelectCalc(ans)}
                    className={`py-3.5 sm:py-4 rounded-2xl font-black text-2xl sm:text-3xl border-2 transition-all transform shadow-xl cursor-pointer ${
                      selectedCalcAns === ans
                        ? ans === targetCalcAns
                          ? 'border-emerald-400 bg-emerald-600 text-white scale-105 shadow-emerald-500/50'
                          : 'border-rose-400 bg-rose-600 text-white scale-95'
                        : 'border-amber-400/50 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-300 hover:scale-105 active:scale-95 text-amber-200'
                    }`}
                  >
                    {ans}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CÂU 5: HÓA ĐƠN BÍ MẬT (35 - 12 = 23) */}
        {/* ========================================================= */}
        {stageIndex === 4 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-2.5 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 5 • Bài toán có lời văn
              </span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-amber-300 drop-shadow-md">
                HÓA ĐƠN BÍ MẬT SIÊU THỊ
              </h2>
            </div>

            {/* Word Problem Card */}
            <div className="w-full p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-emerald-500/50 backdrop-blur-md shadow-2xl flex flex-col items-center gap-3 sm:gap-4">
              <div className="w-full bg-amber-950/40 border border-amber-400/40 rounded-2xl p-3.5 sm:p-4 text-center sm:text-left shadow-inner flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-3xl sm:text-4xl shadow-md shrink-0">
                  🥛
                </div>

                <div className="flex-1">
                  <p className="text-sm sm:text-base md:text-lg font-bold text-amber-100 leading-snug">
                    Siêu thị có <span className="text-yellow-300 font-black text-base sm:text-xl">35</span> hộp sữa, đã bán <span className="text-yellow-300 font-black text-base sm:text-xl">12</span> hộp.
                  </p>
                  <p className="text-sm sm:text-base font-black text-teal-300 mt-1">
                    Hỏi còn lại bao nhiêu hộp sữa?
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-teal-200/80 italic mt-0.5">
                    <span>The supermarket has 35 milk cartons and sells 12. How many are left?</span>
                    <button
                      type="button"
                      onClick={() => handleSpeakEn('The supermarket has 35 milk cartons and sells 12. How many are left?')}
                      className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                      title="Nghe tiếng Anh"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Equation Clue */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-slate-950 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold shadow-inner">
                <span>✨</span>
                <span>Phép tính: 35 − 12 = ? (hộp sữa)</span>
              </div>

              {/* Interactive Keypad Input */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                {/* Result Display Box */}
                <div className="flex flex-col items-center bg-slate-950 px-6 py-3 rounded-2xl border-2 border-emerald-400/50 w-44 sm:w-48 shadow-inner">
                  <span className="text-[10px] text-teal-300 font-bold uppercase mb-1">Số hộp còn lại</span>
                  <div className="text-3xl font-mono font-black text-yellow-300">
                    {inputInvoiceAns || '_'}
                  </div>
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleKeypadPress(digit.toString())}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 font-black text-lg text-amber-100 shadow active:scale-95 cursor-pointer"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('DEL')}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-900/80 hover:bg-rose-800 border border-rose-500/40 font-bold text-xs text-rose-200 flex items-center justify-center shadow active:scale-95 cursor-pointer"
                  >
                    <Delete className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmInvoice}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 border border-emerald-400 font-black text-xs text-white flex items-center justify-center shadow active:scale-95 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
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
              <strong className="text-amber-300">THU NGÂN NHÍ TÀI BA</strong>!
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
                Về Siêu Thị
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
