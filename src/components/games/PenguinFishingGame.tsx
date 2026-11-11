/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundService, soundEffects } from '../../services/audioService';
import confetti from 'canvas-confetti';
import { BilingualQuestionBox } from '../common/BilingualQuestionBox';
import { FullscreenStage } from '../common/FullscreenStage';
import { ArrowLeft, RotateCcw, Volume2 } from 'lucide-react';

interface PenguinFishingGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

interface FishItem {
  id: number;
  val: number;
  color: string;
  depthY: number; // percentage from top
  speed: number;
  dir: 1 | -1;
  emoji: string;
}

interface FishingQuest {
  promptVi: string;
  promptEn: string;
  targetAnswer: number;
}

export const PenguinFishingGame: React.FC<PenguinFishingGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [catches, setCatches] = useState(0); // 5 to win
  const [fishes, setFishes] = useState<FishItem[]>([]);
  const [quest, setQuest] = useState<FishingQuest | null>(null);
  const [isCatching, setIsCatching] = useState(false);
  const [hookY, setHookY] = useState(25); // %
  const [caughtFish, setCaughtFish] = useState<FishItem | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState<string | null>(null);

  // Generate random swimming fish and current quest
  const generateLevel = (currentCatchCount: number) => {
    // Generate quest
    let ans = 0;
    let promptVi = '';
    let promptEn = '';

    if (currentCatchCount < 2) {
      // Numbers to 10
      const a = Math.floor(Math.random() * 5) + 2;
      const b = Math.floor(Math.random() * (10 - a)) + 1;
      ans = a + b;
      promptVi = `Câu con cá mang kết quả: ${a} + ${b} = ?`;
      promptEn = `Catch the fish with result of: ${a} + ${b} = ?`;
    } else if (currentCatchCount < 4) {
      // Subtraction within 10
      const a = Math.floor(Math.random() * 5) + 5;
      const b = Math.floor(Math.random() * (a - 1)) + 1;
      ans = a - b;
      promptVi = `Câu con cá mang kết quả: ${a} - ${b} = ?`;
      promptEn = `Catch the fish with result of: ${a} - ${b} = ?`;
    } else {
      // Two-digit number recognition
      ans = (Math.floor(Math.random() * 6) + 2) * 10; // 20, 30, 40, 50, 60, 70
      promptVi = `Câu con cá mang số tròn chục: ${ans}!`;
      promptEn = `Catch the fish labeled with multiple of ten: ${ans}!`;
    }

    // Generate 4 fish, 1 correct, 3 wrong
    const otherNums = [ans + 1, Math.max(1, ans - 1), ans + 2, ans + 3]
      .filter((v) => v !== ans)
      .slice(0, 3);
    const fishVals = [ans, ...otherNums].sort(() => Math.random() - 0.5);

    const fishColors = ['text-orange-500', 'text-sky-500', 'text-pink-500', 'text-emerald-500'];
    const fishIcons = ['🐟', '🐠', '🐡', '🐟'];

    const newFishes: FishItem[] = fishVals.map((val, idx) => ({
      id: idx,
      val,
      color: fishColors[idx % fishColors.length],
      depthY: 45 + idx * 12,
      speed: 1.5 + Math.random(),
      dir: idx % 2 === 0 ? 1 : -1,
      emoji: fishIcons[idx % fishIcons.length],
    }));

    setQuest({ promptVi, promptEn, targetAnswer: ans });
    setFishes(newFishes);
  };

  useEffect(() => {
    generateLevel(0);
  }, []);

  const handleHookFish = (fish: FishItem) => {
    if (isCatching || isCompleted) return;

    setIsCatching(true);
    setHookY(fish.depthY);

    if (fish.val === quest?.targetAnswer) {
      // Correct catch!
      soundService.playSplash();
      soundEffects.correct();
      setCaughtFish(fish);
      setFeedback(`Tuyệt vời! Chú chim cánh cụt đã câu được cá số ${fish.val}!`);

      setTimeout(() => {
        // Reel up
        setHookY(25);
        const nextCatches = catches + 1;
        setCatches(nextCatches);
        setIsCatching(false);
        setCaughtFish(null);

        if (nextCatches >= 5) {
          setIsCompleted(true);
          soundEffects.celebrate();
          confetti({ particleCount: 150, spread: 90 });

          StorageService.recordActivity(student.id, {
            type: 'game',
            targetId: 'penguin-fishing',
            targetName: 'Cánh Cụt Câu Cá',
            score: 5,
            totalQuestions: 5,
            starsEarned: 20,
            timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
          });

          const updated = StorageService.getCurrentStudent();
          if (updated) onUpdateStudent(updated);
        } else {
          generateLevel(nextCatches);
          setFeedback(null);
        }
      }, 1000);
    } else {
      // Wrong fish
      soundEffects.wrong();
      setFeedback(`Chú cá số ${fish.val} chưa phải là đáp án đúng! Hãy thử con cá khác nhé!`);
      setTimeout(() => {
        setHookY(25);
        setIsCatching(false);
        setFeedback(null);
      }, 800);
    }
  };

  const restartGame = () => {
    setCatches(0);
    setIsCatching(false);
    setHookY(25);
    setCaughtFish(null);
    setIsCompleted(false);
    setFeedback(null);
    generateLevel(0);
    soundService.playClick();
  };

  return (
    <FullscreenStage
      titleVi="Cánh Cụt Câu Cá"
      titleEn="Penguin Ice Fishing"
      categoryBadge="Toán Đố Vui Lớp 1"
      onBack={onBack}
      topRightControls={
        <div className="flex items-center gap-2">
          <div className="bg-cyan-100 border border-cyan-300 text-cyan-900 px-3 py-1 rounded-xl font-bold text-xs">
            🐟 {catches} / 5 Con cá
          </div>
          <button
            onClick={restartGame}
            title="Làm lại từ đầu"
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      }
    >
      {!isCompleted && quest ? (
        <div className="w-full h-full flex flex-col justify-between overflow-hidden p-2 sm:p-4 gap-2">
          {/* KHU VỰC TRÊN: CÂU HỎI & NHIỆM VỤ (15-20%) */}
          <div className="shrink-0 bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-cyan-200 shadow-xs flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎣</span>
                <span className="text-xs font-black uppercase text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-full border border-cyan-300">
                  Mẻ câu {catches + 1} / 5
                </span>
                <span className="text-base sm:text-lg md:text-xl font-black text-slate-900 font-heading truncate">
                  {quest.promptVi}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 italic truncate">
                {quest.promptEn}
              </p>
            </div>

            <button
              onClick={() => soundService.speakEn(quest.promptEn)}
              className="p-2 sm:p-2.5 rounded-xl bg-cyan-100 hover:bg-cyan-200 text-cyan-900 cursor-pointer shadow-xs shrink-0 flex items-center gap-1 text-xs font-bold"
              title="Phát âm tiếng Anh"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Phát âm 🔊</span>
            </button>
          </div>

          {/* KHU VỰC GIỮA: HỒ BĂNG VÀ ĐÀN CÁ BƠI (PHÓNG TO 1.5-2X) (50-55%) */}
          <div className="flex-1 min-h-0 relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-inner border-2 md:border-4 border-cyan-300 bg-gradient-to-b from-sky-200 via-cyan-600 to-blue-900 select-none">
            {/* Snowy Top Bank (Enlarged) */}
            <div className="absolute inset-x-0 top-0 h-24 sm:h-28 bg-gradient-to-b from-white to-sky-100 border-b-4 border-sky-300 flex items-center justify-between px-6 sm:px-10">
              {/* Cute Penguin with Fishing Rod */}
              <div className="relative flex items-center gap-3">
                <div className="text-5xl sm:text-6xl animate-pulse-subtle">🐧</div>
                <div className="relative -ml-2 -mt-4">
                  <div className="w-24 sm:w-32 h-2 bg-amber-800 rotate-[-20deg] origin-left rounded-full shadow-xs" />
                </div>
                <div className="relative ml-2 text-3xl sm:text-4xl">
                  🧺
                  {catches > 0 && (
                    <span className="absolute -top-1 -right-2 text-xs font-black bg-rose-500 text-white px-2 py-0.5 rounded-full">
                      {catches}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-4xl sm:text-5xl opacity-80">🏔️</div>
            </div>

            {/* Fishing Line dropping down into water */}
            <div
              className="absolute left-32 sm:left-44 top-16 sm:top-20 w-1 bg-white/90 transition-all duration-300 z-10"
              style={{ height: `${hookY}%` }}
            >
              <div className="absolute -bottom-3 -left-2 text-xl font-black text-amber-300">
                🪝
              </div>
              {caughtFish && (
                <div className="absolute -bottom-8 -left-4 text-4xl animate-bounce">
                  {caughtFish.emoji}
                </div>
              )}
            </div>

            {/* Swimming Fish in the Deep Water (Enlarged 1.5-2x) */}
            <div className="absolute inset-x-0 top-24 sm:top-28 bottom-0 overflow-hidden">
              <div className="absolute top-8 left-1/4 text-sm opacity-50 animate-float">🫧</div>
              <div className="absolute top-16 right-1/3 text-base opacity-60 animate-float" style={{ animationDelay: '1s' }}>🫧</div>
              <div className="absolute bottom-4 left-1/2 text-sm opacity-40 animate-float" style={{ animationDelay: '2s' }}>🫧</div>

              {fishes.map((fish) => (
                <div
                  key={fish.id}
                  onClick={() => handleHookFish(fish)}
                  className="absolute flex items-center gap-2 px-4 py-2 rounded-full bg-white/25 backdrop-blur-xs border-2 border-white/50 shadow-lg hover:scale-115 active:scale-95 transition-transform cursor-pointer animate-float"
                  style={{
                    top: `${fish.depthY - 26}%`,
                    left: `${12 + fish.id * 22}%`,
                    animationDelay: `${fish.id * 0.4}s`,
                  }}
                >
                  <span className="text-4xl sm:text-5xl">{fish.emoji}</span>
                  <span className="text-2xl sm:text-3xl font-black text-yellow-300 drop-shadow-md">
                    {fish.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* KHU VỰC DƯỚI: NÚT CÂU CÁ LỚN (20-25%) */}
          <div className="shrink-0 bg-white/95 rounded-2xl p-2.5 sm:p-4 border border-cyan-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm font-black text-slate-700 shrink-0">
              Chạm vào con cá đúng để giật cần:
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 flex-1 max-w-2xl">
              {fishes.map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleHookFish(f)}
                  className="h-14 sm:h-18 flex items-center justify-center gap-2 px-3 rounded-2xl bg-cyan-50 hover:bg-cyan-100 border-2 border-cyan-300 text-cyan-950 font-black text-xl sm:text-2xl transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
                >
                  <span className="text-2xl">{f.emoji}</span>
                  <span>Cá {f.val}</span>
                </button>
              ))}
            </div>

            {feedback && (
              <div className="text-xs sm:text-sm font-bold text-cyan-800 bg-cyan-50 px-3 py-1.5 rounded-xl border border-cyan-200 shrink-0 animate-pulse">
                {feedback}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* VICTORY CELEBRATION (Zero Scroll) */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-cyan-50 to-blue-100 text-center space-y-4">
          <div className="text-6xl animate-bounce">🐧🐟🧺</div>
          <h3 className="text-2xl md:text-3xl font-black text-cyan-900 font-heading">
            CHIM CÁNH CỤT ĐÃ CÂU ĐỦ CÁ RỒI!
          </h3>
          <p className="text-base font-bold text-cyan-700">
            “Fishing Champion! Bữa tiệc cá băng tuyết sẵn sàng!”
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl w-full py-2">
            <div className="bg-white p-3 rounded-2xl border border-cyan-200">
              <div className="text-2xl">🐟</div>
              <div className="text-xs text-slate-500 font-bold">Số cá câu được</div>
              <div className="text-lg font-black text-cyan-600">5 / 5 Con</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-cyan-200">
              <div className="text-2xl">⭐</div>
              <div className="text-xs text-slate-500 font-bold">Số sao thưởng</div>
              <div className="text-lg font-black text-amber-500">+20 Sao</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-cyan-200">
              <div className="text-2xl">🏅</div>
              <div className="text-xs text-slate-500 font-bold">Huy hiệu mới</div>
              <div className="text-xs font-black text-purple-700">Vua Câu Cá</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-cyan-200">
              <div className="text-2xl">⏰</div>
              <div className="text-xs text-slate-500 font-bold">Thời gian</div>
              <div className="text-lg font-black text-blue-600">
                {Math.round((Date.now() - startTime) / 1000)}s
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={restartGame}
              className="py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold rounded-2xl shadow-md hover:from-cyan-600 hover:to-blue-700 cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Câu mẻ cá mới</span>
            </button>
            <button
              onClick={onBack}
              className="py-3 px-6 bg-white hover:bg-slate-100 text-slate-800 font-extrabold rounded-2xl border-2 border-slate-300 cursor-pointer active:scale-95"
            >
              Về kho trò chơi
            </button>
          </div>
        </div>
      )}
    </FullscreenStage>
  );
};
