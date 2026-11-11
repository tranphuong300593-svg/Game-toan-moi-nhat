/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { soundService } from '../../services/audioService';
import { StorageService } from '../../services/storageService';
import { RobotMathChibi } from '../chibi/RobotMathChibi';
import { MathQuestionVisual } from '../common/MathQuestionVisual';
import {
  DailyChallengeService,
  DailyChallengeStudentRecord,
  DailyDayProgress,
  DAILY_STREAK_BADGES,
  DailyBadgeInfo,
} from '../../services/dailyChallengeService';
import {
  DailyQuestion,
  getDailyQuestionById,
} from '../../data/dailyQuestionsBank';
import {
  getRandomPraise,
  getRandomEncouragement,
  FeedbackItem,
} from '../../data/lessonFeedbackData';
import confetti from 'canvas-confetti';
import {
  Flame,
  CheckCircle2,
  Volume2,
  Sparkles,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Award,
  Calendar,
  Star,
  Check,
  Eye,
  Info,
} from 'lucide-react';

interface DailyChallengeViewProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onUpdateStudent: (student: StudentProfile) => void;
  onBack: () => void;
}

export const DailyChallengeView: React.FC<DailyChallengeViewProps> = ({
  student,
  langMode,
  onUpdateStudent,
  onBack,
}) => {
  // Vietnam date key
  const [vietnamDateKey, setVietnamDateKey] = useState(() =>
    DailyChallengeService.getVietnamDateKey()
  );

  // Student Daily Challenge State
  const [studentRecord, setStudentRecord] = useState<DailyChallengeStudentRecord>(
    () => DailyChallengeService.getStudentRecord(student.id)
  );
  const [todayProgress, setTodayProgress] = useState<DailyDayProgress | null>(null);
  const [dailyQuestions, setDailyQuestions] = useState<DailyQuestion[]>([]);

  // UI state: 'challenge' | 'completed' | 'review'
  const [viewMode, setViewMode] = useState<'challenge' | 'completed' | 'review'>('challenge');
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  // Current question index in challenge
  const [qIndex, setQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<any | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [playingQuestionAudio, setPlayingQuestionAudio] = useState(false);

  // Feedback state
  const lastPraiseIndex = useRef<number>(-1);
  const lastEncouragementIndex = useRef<number>(-1);
  const [currentFeedback, setCurrentFeedback] = useState<
    (FeedbackItem & { isCorrect: boolean }) | null
  >(null);

  // Celebration state when newly completed
  const [newBadges, setNewBadges] = useState<DailyBadgeInfo[]>([]);
  const [completionPhrase, setCompletionPhrase] = useState('Congratulations!');

  // --------------------------------------------------------------------------
  // 1. Khởi tạo dữ liệu thử thách theo ngày Việt Nam và hồ sơ học sinh
  // --------------------------------------------------------------------------
  const loadDailyChallenge = () => {
    const { record, progress, questions } =
      DailyChallengeService.getOrInitTodayProgress(student.id);

    setStudentRecord(record);
    setTodayProgress(progress);
    setDailyQuestions(questions);

    if (progress.isCompleted) {
      setViewMode('completed');
    } else {
      setViewMode('challenge');
      const resumeIndex = Math.min(Math.max(0, progress.currentQIndex || 0), 4);
      setQIndex(resumeIndex);
      setSelectedOption(progress.answers[resumeIndex] ?? null);
    }
  };

  useEffect(() => {
    loadDailyChallenge();
  }, [student.id]);

  // --------------------------------------------------------------------------
  // 2. Tự động kiểm tra sang ngày mới lúc 00:00 (Asia/Ho_Chi_Minh)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const checkDayRollover = () => {
      const currentKey = DailyChallengeService.getVietnamDateKey();
      if (currentKey !== vietnamDateKey) {
        setVietnamDateKey(currentKey);
        setIsPracticeMode(false);
        loadDailyChallenge();
      }
    };

    // Check on tab visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkDayRollover();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Check periodically every 30s
    const timer = setInterval(checkDayRollover, 30000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(timer);
      soundService.cancelSpeech();
    };
  }, [vietnamDateKey]);

  // Clean audio on question index change
  useEffect(() => {
    soundService.cancelSpeech();
    setPlayingQuestionAudio(false);
    setSelectedOption(todayProgress?.answers[qIndex] ?? null);
    setIsCorrect(null);
    setCurrentFeedback(null);
  }, [qIndex]);

  const currentQ = dailyQuestions[qIndex];

  // --------------------------------------------------------------------------
  // 3. Xử lý giọng đọc tiếng Anh en-US khi bấm loa
  // --------------------------------------------------------------------------
  const handlePlayQuestionSpeech = (enText: string) => {
    soundService.cancelSpeech();
    setPlayingQuestionAudio(true);
    soundService.speakEn(enText, {
      slow: true,
      onEnd: () => setPlayingQuestionAudio(false),
    });
  };

  // --------------------------------------------------------------------------
  // 4. Xử lý khi học sinh chọn đáp án
  // --------------------------------------------------------------------------
  const handleSelectOption = (opt: any) => {
    if (isCorrect === true) return; // Đã đúng câu này, đợi bấm Tiếp tục

    soundService.cancelSpeech();
    setPlayingQuestionAudio(false);
    soundService.playClick();
    setSelectedOption(opt);

    const match =
      String(opt).trim().toLowerCase() === String(currentQ.answer).trim().toLowerCase();

    if (match) {
      setIsCorrect(true);
      soundService.playCorrect();

      // Tiếng vỗ tay chúc mừng vui tươi
      if (Math.random() > 0.4) {
        setTimeout(() => soundService.playApplause(), 200);
      }

      // Ngôi sao lấp lánh nhẹ
      confetti({
        particleCount: 26,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#22c55e', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
      });

      // Lời khen tiếng Anh ngẫu nhiên không lặp liên tiếp (en-US chuẩn Mỹ)
      const { item, index } = getRandomPraise(lastPraiseIndex.current);
      lastPraiseIndex.current = index;
      setCurrentFeedback({ ...item, isCorrect: true });
      soundService.speakEn(item.en, { rate: 0.94, pitch: 1.1 });

      // Lưu câu trả lời vào Service
      if (!isPracticeMode) {
        const updated = DailyChallengeService.recordAnswer(
          student.id,
          qIndex,
          opt,
          true
        );
        setTodayProgress({ ...updated });
      }
    } else {
      setIsCorrect(false);
      soundService.playIncorrect();

      // Lời động viên tiếng Anh ngẫu nhiên không lặp liên tiếp (en-US chuẩn Mỹ)
      const { item, index } = getRandomEncouragement(lastEncouragementIndex.current);
      lastEncouragementIndex.current = index;
      setCurrentFeedback({ ...item, isCorrect: false });
      soundService.speakEn(item.en, { rate: 0.9, pitch: 1.05 });

      // Lưu lần thử vào Service
      if (!isPracticeMode) {
        const updated = DailyChallengeService.recordAnswer(
          student.id,
          qIndex,
          opt,
          false
        );
        setTodayProgress({ ...updated });
      }
    }
  };

  // --------------------------------------------------------------------------
  // 5. Chuyển sang câu tiếp theo hoặc Hoàn thành
  // --------------------------------------------------------------------------
  const handleNext = () => {
    soundService.cancelSpeech();
    setPlayingQuestionAudio(false);
    soundService.playClick();
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentFeedback(null);

    if (qIndex + 1 < dailyQuestions.length) {
      const nextIndex = qIndex + 1;
      setQIndex(nextIndex);
      if (!isPracticeMode) {
        DailyChallengeService.updateCurrentIndex(student.id, nextIndex);
      }
    } else {
      // Đã hoàn thành 5 câu!
      if (!isPracticeMode) {
        const result = DailyChallengeService.completeTodayChallenge(student.id);
        setStudentRecord(result.record);
        setTodayProgress(result.progress);
        setNewBadges(result.newlyUnlockedBadges);

        // Cập nhật profile trên App
        const currentStudent = StorageService.getCurrentStudent();
        if (currentStudent) {
          onUpdateStudent(currentStudent);
        }
      }

      setViewMode('completed');
      soundService.cancelSpeech();
      soundService.playVictory();

      // Chọn MỘT câu tiếng Anh chúc mừng hoàn thành thử thách
      const COMPLETION_CONGRATS = [
        'Congratulations!',
        'You did it!',
        'Great work today!',
        "You're a math star!",
      ];
      const selectedPhrase =
        COMPLETION_CONGRATS[Math.floor(Math.random() * COMPLETION_CONGRATS.length)];
      setCompletionPhrase(selectedPhrase);

      setTimeout(() => {
        soundService.playApplause();
        soundService.speakEn(selectedPhrase, { rate: 0.92, pitch: 1.1 });
      }, 350);

      confetti({ particleCount: 160, spread: 90 });
    }
  };

  // --------------------------------------------------------------------------
  // 6. Chế độ luyện tập lại (Practice Replay) trong cùng ngày
  // --------------------------------------------------------------------------
  const handleStartPracticeReplay = () => {
    soundService.playClick();
    soundService.cancelSpeech();
    setIsPracticeMode(true);
    setQIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentFeedback(null);
    setViewMode('challenge');
  };

  // Phân loại nhãn từng câu trong thử thách 5 câu
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'recognize':
        return 'Nhận biết';
      case 'calculate':
        return 'Tính toán';
      case 'compare_order':
        return 'So sánh & Sắp xếp';
      case 'geometry_measure':
        return 'Hình học & Đo lường';
      case 'applied':
        return 'Vận dụng thực tế';
      default:
        return 'Toán học';
    }
  };

  const formattedDate = DailyChallengeService.formatVietnamDateDisplay(vietnamDateKey);
  const currentStreak = studentRecord.currentStreak || 0;
  const totalDays = studentRecord.totalCompletedDays || 0;
  const isAlreadyDoneToday = todayProgress?.isCompleted ?? false;
  const firstTryScore = todayProgress?.firstTryScore ?? 0;

  return (
    <div className="w-full min-h-[100dvh] md:min-h-0 md:aspect-[16/9] md:max-w-[calc((100dvh-1rem)*16/9)] md:max-h-[calc(100dvh-1rem)] mx-auto flex flex-col justify-between p-1.5 sm:p-2.5 text-slate-800 select-none overflow-y-auto md:overflow-hidden bg-gradient-to-b from-amber-50/80 via-white to-sky-50/50 rounded-2xl md:rounded-3xl border-2 border-amber-300 shadow-2xl">
      {/* ===================================================================== */}
      {/* TOP HEADER: Gọn gàng, đầy đủ ngày giờ Việt Nam, Streak, Stars */}
      {/* ===================================================================== */}
      <div className="shrink-0 w-full flex items-center justify-between gap-2 py-1.5 px-2 bg-white/90 backdrop-blur-xs rounded-2xl border border-amber-200 shadow-2xs sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-['Be_Vietnam_Pro'] font-bold text-xs sm:text-sm flex items-center gap-1 cursor-pointer transition-all active:scale-95"
            title="Quay về trang chủ"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Trang chủ</span>
          </button>

          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-['Be_Vietnam_Pro'] font-bold text-[11px] sm:text-xs text-amber-900 truncate max-w-[150px] sm:max-w-none">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Streak & Status Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Flame streak */}
          <div
            className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2.5 py-1 rounded-xl shadow-2xs"
            title={`Chuỗi chăm học: ${currentStreak} ngày liên tiếp`}
          >
            <Flame className="w-4 h-4 fill-amber-200 text-amber-200 animate-pulse" />
            <span className="font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm">
              {currentStreak} Ngày
            </span>
          </div>

          {/* Total completed */}
          <div
            className="hidden sm:flex items-center gap-1 bg-sky-50 border border-sky-200 px-2 py-1 rounded-xl text-sky-800"
            title={`Tổng số ngày đã hoàn thành: ${totalDays} ngày`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-['Be_Vietnam_Pro'] font-bold text-xs">
              {totalDays} ngày xong
            </span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* VIEW MODE 1: LÀM THỬ THÁCH (CHALLENGE / PRACTICE) */}
      {/* ===================================================================== */}
      {viewMode === 'challenge' && currentQ && (
        <div className="flex-1 min-h-0 flex flex-col justify-between py-1 px-1 sm:px-2 max-w-4xl mx-auto w-full overflow-y-auto md:overflow-hidden">
          {/* A. Progress tracker & category tag */}
          <div className="shrink-0 flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                Câu {qIndex + 1} / 5
              </span>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md hidden sm:inline">
                {getCategoryLabel(currentQ.category)}
              </span>
              {isPracticeMode && (
                <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                  Chế độ ôn luyện
                </span>
              )}
            </div>

            {/* Visual Step Dots */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {[0, 1, 2, 3, 4].map((idx) => {
                const isCurrent = idx === qIndex;
                const isPast = idx < qIndex;
                return (
                  <div
                    key={idx}
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-white ring-2 ring-amber-300 scale-110 font-black'
                        : isPast
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isPast ? '✓' : idx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. Question Box (Vietnamese top bold, English underneath with speaker) */}
          <div className="shrink-0 bg-white rounded-2xl p-2 sm:p-2.5 border-2 border-amber-300 shadow-2xs text-center relative overflow-hidden">
            <h3 className="font-['Be_Vietnam_Pro'] font-black text-sm sm:text-base md:text-lg text-slate-900 leading-snug">
              {currentQ.promptVi}
            </h3>

            {currentQ.promptEn && (
              <div className="mt-0.5 flex items-center justify-center gap-1 text-slate-500">
                <p className="font-['Be_Vietnam_Pro'] font-medium italic text-xs sm:text-sm text-slate-600">
                  {currentQ.promptEn}
                </p>
                <button
                  type="button"
                  onClick={() => handlePlayQuestionSpeech(currentQ.promptEn)}
                  className={`p-1 rounded-full transition-all cursor-pointer shrink-0 ${
                    playingQuestionAudio
                      ? 'bg-amber-500 text-white scale-110'
                      : 'text-amber-600 hover:text-amber-800 hover:bg-amber-50'
                  }`}
                  title="Nghe phát âm tiếng Anh chuẩn Mỹ"
                >
                  <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </div>

          {/* C. Visual Illustration: Strictly responsive max-h-[22vh], never overflowing */}
          {currentQ.visualConfig && (
            <div className="flex-1 min-h-0 shrink-1 flex items-center justify-center py-0.5 overflow-hidden my-auto max-h-[22vh] sm:max-h-[25vh]">
              <div className="scale-90 sm:scale-100 origin-center max-w-full">
                <MathQuestionVisual question={currentQ} />
              </div>
            </div>
          )}

          {/* D. Options: 3 or 4 tactile, large buttons */}
          <div
            className={`shrink-0 grid gap-2 sm:gap-2.5 w-full ${
              (currentQ.options?.length ?? 3) <= 3
                ? 'grid-cols-3'
                : 'grid-cols-2 sm:grid-cols-4'
            }`}
          >
            {currentQ.options?.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isOptionCorrect =
                isCorrect === true &&
                String(opt).trim().toLowerCase() ===
                  String(currentQ.answer).trim().toLowerCase();
              const isOptionWrong = isCorrect === false && isSelected;

              let btnColor =
                'bg-white hover:bg-amber-50/70 border-slate-200 text-slate-800 hover:border-amber-300';

              if (isOptionCorrect) {
                btnColor =
                  'bg-emerald-500 hover:bg-emerald-600 border-emerald-600 text-white ring-4 ring-emerald-200 shadow-md scale-[1.01]';
              } else if (isOptionWrong) {
                btnColor =
                  'bg-amber-100 hover:bg-amber-200/90 border-amber-400 text-amber-950 ring-4 ring-amber-200/80 shadow-xs animate-shake';
              } else if (isSelected && isCorrect === null) {
                btnColor =
                  'bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-200';
              }

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={`min-h-[44px] sm:min-h-[50px] md:min-h-[56px] px-2 py-1 sm:px-3 sm:py-2 rounded-2xl border-2 font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm md:text-base transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 ${btnColor}`}
                >
                  <span className="truncate">{opt}</span>
                  {isOptionCorrect && <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                </button>
              );
            })}
          </div>

          {/* E. Feedback indicator & Next button: permanently docked in viewport */}
          <div className="shrink-0 w-full flex items-center justify-between min-h-[40px] px-1 pt-0.5">
            <div className="flex-1 min-w-0 pr-2">
              {isCorrect === false && currentFeedback && (
                <span className="text-xs sm:text-sm font-black text-amber-950 bg-amber-50 px-3 py-1 rounded-full border-2 border-amber-300 inline-flex items-center gap-1.5 shadow-2xs animate-shake">
                  <span className="text-base">{currentFeedback.emoji}</span>
                  <span className="font-extrabold text-amber-950">{currentFeedback.en}</span>
                  <span className="font-semibold text-amber-800 text-xs hidden sm:inline">
                    – {currentFeedback.vi}
                  </span>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded-full ml-1">
                    Bé chọn lại nhé!
                  </span>
                </span>
              )}
              {isCorrect === true && currentFeedback && (
                <span className="text-xs sm:text-sm font-black text-emerald-950 bg-emerald-50 px-3 py-1 rounded-full border-2 border-emerald-300 inline-flex items-center gap-1.5 shadow-2xs">
                  <span className="text-base">{currentFeedback.emoji}</span>
                  <span className="font-extrabold text-emerald-900">{currentFeedback.en}</span>
                  <span className="font-semibold text-emerald-700 text-xs hidden sm:inline">
                    – {currentFeedback.vi}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-200/70 px-2 py-0.5 rounded-full ml-1">
                    Đúng rồi!
                  </span>
                </span>
              )}
            </div>

            <div className="shrink-0">
              {isCorrect === true && (
                <button
                  onClick={handleNext}
                  className="min-h-[44px] py-2 px-4 sm:py-2.5 sm:px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm md:text-base rounded-2xl shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <span>{qIndex + 1 < dailyQuestions.length ? 'TIẾP TỤC ➡️' : 'HOÀN THÀNH 🏆'}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW MODE 2: ĐÃ HOÀN THÀNH THỬ THÁCH HÔM NAY (COMPLETED DASHBOARD) */}
      {/* ===================================================================== */}
      {viewMode === 'completed' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between py-1 sm:py-2 px-2 sm:px-6 max-w-4xl mx-auto w-full overflow-y-auto md:overflow-hidden text-center">
          {/* Header & Chibi */}
          <div className="shrink-0 space-y-1">
            <div className="flex justify-center">
              <RobotMathChibi expression="cheering" size="md" className="animate-bounce" />
            </div>
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3.5 py-0.5 rounded-full shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span className="font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm tracking-wide uppercase">
                ĐÃ HOÀN THÀNH THỬ THÁCH HÔM NAY
              </span>
            </div>
            <h3 className="font-['Be_Vietnam_Pro'] font-black text-lg sm:text-xl md:text-2xl text-slate-900 tracking-tight">
              CHÚC MỪNG BẠN ĐÃ HOÀN THÀNH THỬ THÁCH HÔM NAY!
            </h3>
            <p className="font-black text-sm sm:text-base text-amber-700 italic drop-shadow-xs">
              “{completionPhrase}”
            </p>
            <p className="font-semibold text-xs text-slate-500">
              {formattedDate} • 5 câu hỏi Toán lớp 1 thông minh
            </p>
          </div>

          {/* 4 Stats Cards */}
          <div className="shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 py-1">
            <div className="bg-white rounded-2xl p-2.5 sm:p-3 border-2 border-amber-300 shadow-2xs">
              <div className="text-xl sm:text-2xl">🔥</div>
              <div className="text-[11px] text-slate-500 font-bold">Chuỗi chăm học</div>
              <div className="text-base sm:text-lg font-black text-orange-600">
                {currentStreak} Ngày
              </div>
            </div>

            <div className="bg-white rounded-2xl p-2.5 sm:p-3 border-2 border-emerald-300 shadow-2xs">
              <div className="text-xl sm:text-2xl">🎯</div>
              <div className="text-[11px] text-slate-500 font-bold">Đúng ngay lần đầu</div>
              <div className="text-base sm:text-lg font-black text-emerald-600">
                {firstTryScore} / 5 câu
              </div>
            </div>

            <div className="bg-white rounded-2xl p-2.5 sm:p-3 border-2 border-yellow-300 shadow-2xs">
              <div className="text-xl sm:text-2xl">⭐</div>
              <div className="text-[11px] text-slate-500 font-bold">Sao nhận được</div>
              <div className="text-base sm:text-lg font-black text-amber-500">
                +{firstTryScore} Sao
              </div>
            </div>

            <div className="bg-white rounded-2xl p-2.5 sm:p-3 border-2 border-sky-300 shadow-2xs">
              <div className="text-xl sm:text-2xl">📅</div>
              <div className="text-[11px] text-slate-500 font-bold">Tổng số ngày học</div>
              <div className="text-base sm:text-lg font-black text-sky-600">
                {totalDays} Ngày
              </div>
            </div>
          </div>

          {/* Daily Streak Badges Shelf */}
          <div className="shrink-0 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl p-2 sm:p-2.5 border border-amber-200">
            <div className="text-[11px] sm:text-xs font-black text-amber-900 mb-1 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              HUY HIỆU CHUỖI CHĂM HỌC (DAILY STREAK)
            </div>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {DAILY_STREAK_BADGES.map((b) => {
                const isUnlocked = studentRecord.unlockedBadges.includes(b.name);
                return (
                  <div
                    key={b.id}
                    className={`p-1.5 rounded-xl border text-center transition-all ${
                      isUnlocked
                        ? 'bg-white border-amber-300 shadow-2xs'
                        : 'bg-slate-100/70 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="text-base sm:text-lg">{b.icon}</div>
                    <div className="font-black text-[10px] sm:text-[11px] text-slate-800 truncate">
                      {b.name}
                    </div>
                    <div className="text-[9px] text-slate-500 font-bold">{b.minStreak} ngày</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* New Day Notice */}
          <div className="shrink-0 text-slate-500 font-medium text-[11px] sm:text-xs bg-slate-50 py-1 px-3 rounded-full border border-slate-200 inline-flex items-center justify-center gap-1 mx-auto">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>🌙 Bộ 5 câu hỏi thử thách mới sẽ tự động mở vào 00:00 ngày mai (giờ Việt Nam).</span>
          </div>

          {/* Action buttons */}
          <div className="shrink-0 flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              onClick={() => setViewMode('review')}
              className="py-1.5 px-3.5 sm:py-2 sm:px-5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-300 font-['Be_Vietnam_Pro'] font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            >
              <Eye className="w-4 h-4 text-slate-600" />
              <span>XEM KẾT QUẢ</span>
            </button>

            <button
              onClick={handleStartPracticeReplay}
              className="py-1.5 px-3.5 sm:py-2 sm:px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-['Be_Vietnam_Pro'] font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>LUYỆN TẬP LẠI</span>
            </button>

            <button
              onClick={onBack}
              className="py-1.5 px-4 sm:py-2 sm:px-6 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-['Be_Vietnam_Pro'] font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            >
              <span>VỀ TRANG CHỦ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW MODE 3: XEM LẠI 5 CÂU HỎI & LỜI GIẢI (REVIEW MODE) */}
      {/* ===================================================================== */}
      {viewMode === 'review' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between py-1 px-1 sm:px-4 max-w-4xl mx-auto w-full overflow-hidden">
          <div className="shrink-0 flex items-center justify-between pb-1">
            <h4 className="font-['Be_Vietnam_Pro'] font-black text-sm sm:text-base text-slate-800">
              Đáp Án & Lời Giải 5 Câu Hôm Nay ({formattedDate})
            </h4>
            <button
              onClick={() => setViewMode('completed')}
              className="py-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Đóng xem lại ✕
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
            {dailyQuestions.map((q, idx) => {
              const studentAnswer = todayProgress?.answers[idx];
              const wasFirstTry = todayProgress?.firstTryCorrect[idx];

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200 shadow-2xs space-y-1 text-left"
                >
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      Câu {idx + 1}: {getCategoryLabel(q.category)}
                    </span>
                    {wasFirstTry ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold text-[11px]">
                        ✓ Đúng ngay lần đầu (+1 ⭐)
                      </span>
                    ) : (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-bold text-[11px]">
                        Đã hoàn thành sau khi thử lại
                      </span>
                    )}
                  </div>

                  <p className="font-['Be_Vietnam_Pro'] font-black text-slate-900 text-xs sm:text-sm">
                    {q.promptVi}
                  </p>
                  {q.promptEn && (
                    <p className="font-medium italic text-slate-500 text-[11px] sm:text-xs">
                      {q.promptEn}
                    </p>
                  )}

                  <div className="pt-0.5 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-slate-600">
                      Đáp án đúng: <strong className="text-emerald-600">{q.answer}</strong>
                    </span>
                    {studentAnswer !== undefined && (
                      <span className="text-slate-500">
                        (Bé đã chọn: <strong>{studentAnswer}</strong>)
                      </span>
                    )}
                  </div>

                  {q.explanationVi && (
                    <div className="p-1.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 font-medium">
                      💡 {q.explanationVi}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="shrink-0 pt-1 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setViewMode('completed')}
              className="min-h-[42px] py-2 px-5 bg-slate-800 hover:bg-slate-900 text-white font-['Be_Vietnam_Pro'] font-bold text-xs sm:text-sm rounded-xl cursor-pointer active:scale-95 transition-all"
            >
              QUAY LẠI KẾT QUẢ
            </button>
            <button
              onClick={onBack}
              className="min-h-[42px] py-2 px-5 bg-sky-600 hover:bg-sky-700 text-white font-['Be_Vietnam_Pro'] font-bold text-xs sm:text-sm rounded-xl cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>VỀ TRANG CHỦ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
