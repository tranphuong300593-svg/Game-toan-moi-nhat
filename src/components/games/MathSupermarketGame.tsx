import React, { useState } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundEffects, soundService } from '../../services/audioService';
import { Volume2, ShoppingCart, Sparkles, Check, Delete } from 'lucide-react';

interface MathSupermarketGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

export const MathSupermarketGame: React.FC<MathSupermarketGameProps> = ({
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
  // THỬ THÁCH 1: CHỌN HÀNG ĐÚNG SỐ
  // Yêu cầu: "Hãy cho 8 quả táo vào giỏ!"
  // -------------------------------------------------------------
  const [cartApplesCount, setCartApplesCount] = useState<number>(0);
  const targetApples = 8;
  const maxAvailableApples = 12;

  const handleAddApple = () => {
    if (feedback || cartApplesCount >= maxAvailableApples) return;
    soundEffects.click();
    const nextCount = cartApplesCount + 1;
    setCartApplesCount(nextCount);

    if (nextCount === targetApples) {
      soundEffects.correct();
      setFeedback({ isCorrect: true, text: 'Tuyệt vời! Bé đã cho đủ 8 quả táo vào giỏ hàng!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1400);
    } else if (nextCount > targetApples) {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Quá 8 quả táo rồi! Bé hãy bấm nút [Bỏ bớt] nhé!' });
    }
  };

  const handleRemoveApple = () => {
    if (feedback || cartApplesCount <= 0) return;
    soundEffects.click();
    const nextCount = cartApplesCount - 1;
    setCartApplesCount(nextCount);
    if (nextCount === targetApples) {
      soundEffects.correct();
      setFeedback({ isCorrect: true, text: 'Chính xác! Đúng 8 quả táo rồi!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1400);
    } else {
      setFeedback(null);
    }
  };

  // -------------------------------------------------------------
  // THỬ THÁCH 2: GIỎ HÀNG PHÉP TÍNH
  // 7 quả cam và 5 quả cam. "Có tất cả bao nhiêu quả cam?" -> 12
  // -------------------------------------------------------------
  const [selectedOrangesAns, setSelectedOrangesAns] = useState<number | null>(null);
  const targetOrangesAns = 12;
  const orangeOptions = [10, 11, 12, 13];

  const handleSelectOranges = (ans: number) => {
    if (selectedOrangesAns || feedback) return;
    setSelectedOrangesAns(ans);
    if (ans === targetOrangesAns) {
      soundEffects.correct();
      setFeedback({ isCorrect: true, text: 'Chính xác! 7 quả cam + 5 quả cam = 12 quả cam!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1400);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Chưa chính xác! Bé hãy đếm lại 7 + 5 bằng bao nhiêu nhé!' });
      setTimeout(() => {
        setSelectedOrangesAns(null);
        setFeedback(null);
      }, 1400);
    }
  };

  // -------------------------------------------------------------
  // THỬ THÁCH 3: SĂN HÀNG THEO SỐ
  // 3 sản phẩm có nhãn: 45, 54, 49. "Số nào lớn nhất?" -> 54
  // -------------------------------------------------------------
  const [selectedItemNumber, setSelectedItemNumber] = useState<number | null>(null);
  const targetGreatest = 54;
  const itemNumbers = [45, 54, 49];

  const handleSelectGreatest = (num: number) => {
    if (selectedItemNumber || feedback) return;
    setSelectedItemNumber(num);
    if (num === targetGreatest) {
      soundEffects.correct();
      setFeedback({ isCorrect: true, text: 'Xuất sắc! Số 54 là số lớn nhất!' });
      setScore((prev) => prev + 5);
      setTimeout(handleNextStage, 1400);
    } else {
      soundEffects.wrong();
      setFeedback({ isCorrect: false, text: 'Chưa đúng! So sánh chữ số hàng chục và hàng đơn vị nhé!' });
      setTimeout(() => {
        setSelectedItemNumber(null);
        setFeedback(null);
      }, 1400);
    }
  };

  // -------------------------------------------------------------
  // THỬ THÁCH 4: XẾP HÀNG LÊN KỆ
  // 23, 56, 14, 42. "Xếp các số từ bé đến lớn" -> 14, 23, 42, 56
  // -------------------------------------------------------------
  const [placedOnShelf, setPlacedOnShelf] = useState<number[]>([]);
  const shelfNumbersPool = [23, 56, 14, 42];
  const targetShelfOrder = [14, 23, 42, 56];

  const handlePlaceNumberOnShelf = (num: number) => {
    if (placedOnShelf.includes(num) || feedback) return;
    soundEffects.click();
    const nextList = [...placedOnShelf, num];
    setPlacedOnShelf(nextList);

    if (nextList.length === targetShelfOrder.length) {
      const isRight = nextList.every((val, idx) => val === targetShelfOrder[idx]);
      if (isRight) {
        soundEffects.correct();
        setFeedback({ isCorrect: true, text: 'Rất giỏi! Bé đã xếp đúng thứ tự từ bé đến lớn: 14, 23, 42, 56!' });
        setScore((prev) => prev + 5);
        setTimeout(handleNextStage, 1400);
      } else {
        soundEffects.wrong();
        setFeedback({ isCorrect: false, text: 'Chưa đúng thứ tự từ bé đến lớn rồi! Hãy thử lại nhé.' });
        setTimeout(() => {
          setPlacedOnShelf([]);
          setFeedback(null);
        }, 1400);
      }
    }
  };

  // -------------------------------------------------------------
  // THỬ THÁCH 5: GIỎ HÀNG THỬ THÁCH (NHẬP SỐ)
  // 34 + 25 = ? -> 59
  // -------------------------------------------------------------
  const [inputAnswer, setInputAnswer] = useState<string>('');
  const targetCalcAnswer = '59';

  const handleKeypadPress = (val: string) => {
    if (feedback) return;
    soundEffects.click();
    if (val === 'DEL') {
      setInputAnswer((prev) => prev.slice(0, -1));
    } else if (inputAnswer.length < 3) {
      setInputAnswer((prev) => prev + val);
    }
  };

  const handleConfirmAnswer = () => {
    if (!inputAnswer || feedback) return;
    if (inputAnswer === targetCalcAnswer) {
      soundEffects.celebrate();
      setFeedback({ isCorrect: true, text: 'Tuyệt đỉnh! 34 + 25 = 59! Giỏ hàng hoàn tất xuất sắc!' });
      setScore((prev) => prev + 5);
      setTimeout(() => {
        setIsCompleted(true);
        StorageService.recordActivity(student.id, {
          type: 'game',
          targetId: 'math-supermarket',
          targetName: 'Giỏ Hàng Thông Minh',
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
      setFeedback({ isCorrect: false, text: 'Chưa đúng rồi! Bé hãy cộng nhẩm: 4+5=9 và 3+2=5 nhé!' });
      setTimeout(() => {
        setInputAnswer('');
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
    setCartApplesCount(0);
    setSelectedOrangesAns(null);
    setSelectedItemNumber(null);
    setPlacedOnShelf([]);
    setInputAnswer('');
  };

  const stageTitles = [
    'Thử thách 1: Chọn hàng đúng số',
    'Thử thách 2: Giỏ hàng phép tính',
    'Thử thách 3: Săn hàng theo số',
    'Thử thách 4: Xếp hàng lên kệ',
    'Thử thách 5: Giỏ hàng thử thách',
  ];

  return (
    <div className="w-full h-full max-h-[100dvh] flex flex-col bg-gradient-to-br from-sky-950 via-indigo-950 to-slate-950 text-white select-none overflow-hidden font-sans">
      {/* 1. Header Bar (Compact & Clean) */}
      <header className="flex-none px-4 sm:px-6 py-2 sm:py-2.5 bg-black/50 backdrop-blur-md border-b border-sky-500/30 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-sky-300 font-bold text-xs sm:text-sm border border-sky-400/30 transition shadow-sm cursor-pointer"
          >
            ← Về Siêu Thị
          </button>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <div>
              <h1 className="text-xs sm:text-sm md:text-base font-black tracking-wide bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent uppercase">
                GIỎ HÀNG THÔNG MINH
              </h1>
              <p className="text-[11px] sm:text-xs text-cyan-300 font-medium">
                {stageTitles[stageIndex] || 'Hoàn thành thử thách siêu thị'}
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
                    ? 'bg-cyan-400 animate-pulse'
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
        {/* CÂU 1: CHỌN HÀNG ĐÚNG SỐ (8 quả táo vào giỏ) */}
        {/* ========================================================= */}
        {stageIndex === 0 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            {/* Header Question */}
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 1 • Đếm và chọn số lượng
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md flex items-center justify-center gap-2">
                Hãy cho 8 quả táo vào giỏ!
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-cyan-200/90 italic mt-0.5">
                <span>Put 8 apples into the cart!</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Put 8 apples into the cart!')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Area: Apples Shelf + Cart */}
            <div className="w-full p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-sky-500/40 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center justify-around gap-4">
              {/* Left: Fresh Apple Counter / Clickable Apples on Shelf */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                  Quầy táo siêu thị (Chạm vào táo để lấy):
                </span>
                <div className="grid grid-cols-4 gap-2.5 sm:gap-3 p-3 bg-slate-800/80 rounded-2xl border border-sky-400/20 shadow-inner">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={handleAddApple}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-b from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 border-2 border-rose-300 text-2xl sm:text-3xl flex items-center justify-center shadow-lg transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      🍎
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Shopping Cart Display with Count */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Giỏ hàng của bé:
                </span>
                <div className="w-56 sm:w-64 p-4 rounded-2xl bg-gradient-to-b from-sky-900/60 to-indigo-950/80 border-2 border-amber-400/40 shadow-xl flex flex-col items-center gap-3">
                  <div className="text-4xl">🛒</div>
                  <div className="text-center">
                    <span className="text-2xl sm:text-3xl font-black text-amber-300">
                      {cartApplesCount} / 8
                    </span>
                    <p className="text-xs text-sky-200">quả táo trong giỏ</p>
                  </div>

                  {/* Apples in cart icons */}
                  <div className="flex flex-wrap justify-center gap-1 min-h-[28px]">
                    {Array.from({ length: cartApplesCount }).map((_, i) => (
                      <span key={i} className="text-lg animate-scale-up">🍎</span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 w-full mt-1">
                    <button
                      type="button"
                      onClick={handleRemoveApple}
                      disabled={cartApplesCount === 0}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-rose-600/80 hover:bg-rose-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-xs transition cursor-pointer"
                    >
                      Bỏ bớt (-1)
                    </button>
                    <button
                      type="button"
                      onClick={handleAddApple}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Thêm táo (+1)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CÂU 2: GIỎ HÀNG PHÉP TÍNH (7 cam + 5 cam = 12) */}
        {/* ========================================================= */}
        {stageIndex === 1 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 2 • Phép tính cộng
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                Có tất cả bao nhiêu quả cam?
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-cyan-200/90 italic mt-0.5">
                <span>How many oranges are there in total?</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('How many oranges are there in total?')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-sky-500/40 backdrop-blur-md shadow-2xl flex flex-col items-center gap-4">
              {/* Visual Fruit Baskets (Accurate fruit count, NO cheat numbers on fruit) */}
              <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
                {/* Basket 1: 7 Oranges */}
                <div className="flex flex-col items-center bg-amber-950/40 border border-amber-400/40 p-3 sm:p-4 rounded-2xl shadow-inner">
                  <span className="text-xs font-bold text-amber-200 mb-2">Khay 1: 7 quả cam</span>
                  <div className="flex flex-wrap justify-center gap-1.5 max-w-[140px] sm:max-w-[170px]">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <span key={i} className="text-2xl sm:text-3xl filter drop-shadow">🍊</span>
                    ))}
                  </div>
                </div>

                <span className="text-3xl sm:text-4xl font-black text-amber-300">+</span>

                {/* Basket 2: 5 Oranges */}
                <div className="flex flex-col items-center bg-amber-950/40 border border-amber-400/40 p-3 sm:p-4 rounded-2xl shadow-inner">
                  <span className="text-xs font-bold text-amber-200 mb-2">Khay 2: 5 quả cam</span>
                  <div className="flex flex-wrap justify-center gap-1.5 max-w-[140px] sm:max-w-[170px]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-2xl sm:text-3xl filter drop-shadow">🍊</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-lg mt-1">
                {orangeOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectOranges(opt)}
                    className={`py-3 sm:py-3.5 rounded-2xl font-black text-xl sm:text-2xl border-2 transition-all transform shadow-xl cursor-pointer ${
                      selectedOrangesAns === opt
                        ? opt === targetOrangesAns
                          ? 'border-emerald-400 bg-emerald-600 text-white scale-105 shadow-emerald-500/50'
                          : 'border-rose-400 bg-rose-600 text-white scale-95'
                        : 'border-sky-400/40 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-300 hover:scale-105 active:scale-95 text-sky-100'
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
        {/* CÂU 3: SĂN HÀNG THEO SỐ (Số nào lớn nhất: 45, 54, 49 -> 54) */}
        {/* ========================================================= */}
        {stageIndex === 2 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 3 • So sánh số trong phạm vi 100
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                Số nào lớn nhất?
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-cyan-200/90 italic mt-0.5">
                <span>Which number is the greatest?</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Which number is the greatest?')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-6 rounded-3xl bg-slate-900/80 border-2 border-sky-500/40 backdrop-blur-md shadow-2xl flex flex-col items-center gap-5">
              <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-xl">
                {itemNumbers.map((num) => {
                  const isPicked = selectedItemNumber === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleSelectGreatest(num)}
                      className={`h-36 sm:h-44 rounded-3xl border-3 flex flex-col items-center justify-center p-3 transition-all transform shadow-xl cursor-pointer ${
                        isPicked
                          ? num === targetGreatest
                            ? 'border-emerald-400 bg-emerald-600/50 scale-105 shadow-[0_0_20px_rgba(52,211,153,0.6)]'
                            : 'border-rose-400 bg-rose-600/50 scale-95'
                          : 'border-amber-400/50 bg-gradient-to-b from-slate-800 to-indigo-950 hover:from-amber-500/30 hover:to-indigo-900 hover:border-amber-300 hover:scale-105 active:scale-95'
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl mb-1">🎁</span>
                      <span className="text-3xl sm:text-4xl font-black text-amber-300 drop-shadow-md">
                        {num}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-sky-300 uppercase mt-1">
                        Hộp quà số
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CÂU 4: XẾP HÀNG LÊN KỆ (23, 56, 14, 42 -> 14, 23, 42, 56) */}
        {/* ========================================================= */}
        {stageIndex === 3 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[11px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 4 • Thứ tự các số
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                Xếp các số từ bé đến lớn
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-cyan-200/90 italic mt-0.5">
                <span>Arrange the numbers from smallest to greatest</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Arrange the numbers from smallest to greatest')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-sky-500/40 backdrop-blur-md shadow-2xl flex flex-col items-center gap-4">
              {/* Shelf with 4 slots */}
              <div className="w-full max-w-xl bg-amber-950/40 border-2 border-amber-500/40 p-4 rounded-2xl shadow-inner flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-amber-200">Kệ hàng siêu thị (Thứ tự từ bé đến lớn):</span>
                <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full">
                  {[0, 1, 2, 3].map((slotIdx) => {
                    const num = placedOnShelf[slotIdx];
                    return (
                      <div
                        key={slotIdx}
                        className={`h-16 sm:h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-black transition-all ${
                          num !== undefined
                            ? 'bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 border-amber-200 shadow-md scale-105 text-2xl sm:text-3xl'
                            : 'bg-slate-950/60 border-dashed border-sky-400/40 text-sky-400/30 text-sm'
                        }`}
                      >
                        {num !== undefined ? (
                          <>
                            <span>{num}</span>
                            <span className="text-[9px] uppercase font-semibold text-slate-900">Vị trí {slotIdx + 1}</span>
                          </>
                        ) : (
                          <span>Ô {slotIdx + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Number products pool to click */}
              <div className="flex items-center justify-center gap-2.5 sm:gap-4 flex-wrap">
                {shelfNumbersPool.map((num) => {
                  const isUsed = placedOnShelf.includes(num);
                  return (
                    <button
                      key={num}
                      type="button"
                      disabled={isUsed}
                      onClick={() => handlePlaceNumberOnShelf(num)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl font-black text-2xl sm:text-3xl border-2 flex flex-col items-center justify-center transition-all transform shadow-xl cursor-pointer ${
                        isUsed
                          ? 'opacity-30 bg-slate-800 border-slate-700 scale-95 cursor-not-allowed'
                          : 'bg-gradient-to-b from-sky-600 to-indigo-700 hover:from-sky-500 hover:to-indigo-600 text-white border-sky-300 hover:scale-105 active:scale-95'
                      }`}
                    >
                      <span>{num}</span>
                      <span className="text-[9px] text-sky-200 font-normal">Hộp số</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CÂU 5: GIỎ HÀNG THỬ THÁCH (34 + 25 = 59) */}
        {/* ========================================================= */}
        {stageIndex === 4 && !isCompleted && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-2.5 sm:gap-4 my-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[10px] sm:text-xs font-bold uppercase mb-1">
                Thử thách 5 • Phép tính hai chữ số không nhớ
              </span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-amber-300 drop-shadow-md">
                34 + 25 = ?
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-cyan-200/90 italic mt-0.5">
                <span>Calculate: 34 + 25 = ?</span>
                <button
                  type="button"
                  onClick={() => handleSpeakEn('Calculate: 34 plus 25')}
                  className="p-1 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-sky-500/40 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-8">
              {/* Cash Register Display with Equation */}
              <div className="flex flex-col items-center bg-slate-950 p-4 sm:p-6 rounded-2xl border-2 border-amber-400/50 shadow-inner w-56 sm:w-64">
                <span className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase tracking-widest mb-1">
                  MÁY TÍNH TIỀN SIÊU THỊ
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-400 tracking-wider">
                  34 + 25 =
                </div>
                {/* Result screen */}
                <div className="mt-3 w-full h-12 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-3xl font-mono font-black text-yellow-300 shadow-inner">
                  {inputAnswer || '_'}
                </div>
              </div>

              {/* On-screen Keypad */}
              <div className="flex flex-col items-center gap-2">
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleKeypadPress(digit.toString())}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 font-black text-xl text-sky-100 hover:text-white shadow transition active:scale-95 cursor-pointer"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('DEL')}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-rose-900/80 hover:bg-rose-800 border border-rose-500/40 font-bold text-xs text-rose-200 flex items-center justify-center shadow transition active:scale-95 cursor-pointer"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('0')}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 font-black text-xl text-sky-100 shadow transition active:scale-95 cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAnswer}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-600 hover:bg-emerald-500 border border-emerald-400 font-black text-xs text-white flex items-center justify-center shadow transition active:scale-95 cursor-pointer"
                  >
                    <Check className="w-5 h-5" />
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
            <p className="text-xs sm:text-sm text-cyan-200 mt-1 font-medium">
              Bé đã chinh phục toàn bộ 5 thử thách của <br />
              <strong className="text-amber-300">GIỎ HÀNG THÔNG MINH</strong>!
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
