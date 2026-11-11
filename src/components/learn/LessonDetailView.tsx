/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Lesson, StudentProfile, LanguageMode, LessonCertificate } from '../../types';
import { getLessonQuestionsPackage } from '../../data/lessonQuestionsData';
import {
  FeedbackItem,
  getRandomPraise,
  getRandomEncouragement,
} from '../../data/lessonFeedbackData';
import { LESSONS } from '../../data/curriculumData';
import { StorageService } from '../../services/storageService';
import { soundService } from '../../services/audioService';
import { MathQuestionVisual, resolveVisualConfig } from '../common/MathQuestionVisual';
import { LessonCompletionCertificate } from './LessonCompletionCertificate';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight,
  Award,
  Gamepad2,
  Volume2,
  Trophy,
  Star,
  Home,
  Printer,
} from 'lucide-react';

interface LessonDetailViewProps {
  lesson: Lesson;
  student: StudentProfile;
  langMode?: LanguageMode;
  onBack: () => void;
  onLaunchGame?: (gameId: string) => void;
  onUpdateStudent: (student: StudentProfile) => void;
  onFinishLesson?: () => void;
  onSelectLesson?: (lesson: Lesson) => void;
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({
  lesson,
  student,
  onBack,
  onLaunchGame,
  onUpdateStudent,
  onFinishLesson,
  onSelectLesson,
}) => {
  // Package data for this lesson: exactly 5 questions
  const lessonPkg = getLessonQuestionsPackage(lesson.id);

  // Next lesson finder strictly according to the 41-lesson curriculum order
  const currentIndex = LESSONS.findIndex((l) => l.id === lesson.id);
  const nextLesson =
    currentIndex !== -1 && currentIndex + 1 < LESSONS.length
      ? LESSONS[currentIndex + 1]
      : null;

  // States: Only 2 phases: 'question' and 'completed' (No 'conclusion' / 'chốt kiến thức')
  const [phase, setPhase] = useState<'question' | 'completed'>('question');
  const [qIndex, setQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<any | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [questionResults, setQuestionResults] = useState<Record<number, boolean>>({});
  const [startTime, setStartTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const [playingQuestionAudio, setPlayingQuestionAudio] = useState(false);

  // Certificate Modal State & 1-Star Award Tracking
  const [certificate, setCertificate] = useState<LessonCertificate | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [isNewCertificate, setIsNewCertificate] = useState(false);

  // English praise & encouragement non-consecutive feedback tracking
  const lastPraiseIndex = useRef<number>(-1);
  const lastEncouragementIndex = useRef<number>(-1);
  const autoFinishTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<
    (FeedbackItem & { isCorrect: boolean }) | null
  >(null);

  // Reset all states when lesson changes (switching to a new lesson)
  useEffect(() => {
    soundService.cancelSpeech();
    setPlayingQuestionAudio(false);
    setPhase('question');
    setQIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentFeedback(null);
    setCorrectCount(0);
    setQuestionResults({});
    setCertificate(null);
    setIsNewCertificate(false);
    setStartTime(Date.now());
    lastPraiseIndex.current = -1;
    lastEncouragementIndex.current = -1;
    if (autoFinishTimerRef.current) {
      clearTimeout(autoFinishTimerRef.current);
      autoFinishTimerRef.current = null;
    }
  }, [lesson.id]);

  // Cancel any ongoing audio or auto-finish timer when unmounting or switching questions
  useEffect(() => {
    soundService.cancelSpeech();
    setPlayingQuestionAudio(false);
    return () => {
      soundService.cancelSpeech();
      setPlayingQuestionAudio(false);
      if (autoFinishTimerRef.current) {
        clearTimeout(autoFinishTimerRef.current);
      }
    };
  }, [phase, qIndex]);

  // Navigate directly to the next lesson
  const handleGoToNextLesson = () => {
    if (!nextLesson) return;
    soundService.playClick();
    soundService.cancelSpeech();
    setPlayingQuestionAudio(false);

    if (autoFinishTimerRef.current) {
      clearTimeout(autoFinishTimerRef.current);
      autoFinishTimerRef.current = null;
    }

    // Explicitly reset states before transitioning
    setPhase('question');
    setQIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentFeedback(null);
    setCorrectCount(0);
    setQuestionResults({});
    setCertificate(null);
    setIsNewCertificate(false);
    setStartTime(Date.now());
    lastPraiseIndex.current = -1;
    lastEncouragementIndex.current = -1;

    if (onSelectLesson) {
      onSelectLesson(nextLesson);
    }
  };

  const currentQ = lessonPkg.questions[qIndex] || lessonPkg.questions[0];

  // Play English question with standard natural en-US pronunciation
  const handlePlayQuestionSpeech = (enText: string) => {
    soundService.cancelSpeech();
    setPlayingQuestionAudio(true);
    soundService.speakEn(enText, {
      slow: true,
      onEnd: () => setPlayingQuestionAudio(false),
    });
  };

  // Handle student clicking an option directly
  const handleSelectOption = (opt: any) => {
    if (isCorrect) return;

    soundService.cancelSpeech();
    setPlayingQuestionAudio(false);
    soundService.playClick();
    setSelectedOption(opt);

    const match = String(opt).trim().toLowerCase() === String(currentQ.answer).trim().toLowerCase();

    if (match) {
      setIsCorrect(true);
      setQuestionResults((prev) => ({ ...prev, [qIndex]: true }));
      setCorrectCount((prev) => prev + 1);

      soundService.playCorrect();
      if (Math.random() > 0.45) {
        setTimeout(() => soundService.playApplause(), 200);
      }

      // Small confetti burst on correct answer
      confetti({
        particleCount: 22,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#22c55e', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
      });

      // Pick random non-consecutive English praise
      const { item, index } = getRandomPraise(lastPraiseIndex.current);
      lastPraiseIndex.current = index;
      setCurrentFeedback({ ...item, isCorrect: true });

      soundService.speakEn(item.en, { rate: 0.94, pitch: 1.1 });

      // Sau câu thứ 5: Tự động ghi nhận thành tích và chuyển ngay sang Giấy chứng nhận
      if (qIndex + 1 >= lessonPkg.questions.length) {
        if (autoFinishTimerRef.current) clearTimeout(autoFinishTimerRef.current);
        autoFinishTimerRef.current = setTimeout(() => {
          handleFinishLesson();
        }, 750);
      }
    } else {
      setIsCorrect(false);
      soundService.playIncorrect();

      // Pick random non-consecutive English encouragement
      const { item, index } = getRandomEncouragement(lastEncouragementIndex.current);
      lastEncouragementIndex.current = index;
      setCurrentFeedback({ ...item, isCorrect: false });

      soundService.speakEn(item.en, { rate: 0.9, pitch: 1.05 });
    }
  };

  // Move to next question or complete lesson after question 5
  const handleNext = () => {
    if (autoFinishTimerRef.current) {
      clearTimeout(autoFinishTimerRef.current);
      autoFinishTimerRef.current = null;
    }
    soundService.cancelSpeech();
    setPlayingQuestionAudio(false);
    soundService.playClick();
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentFeedback(null);

    if (qIndex + 1 < lessonPkg.questions.length) {
      setQIndex(qIndex + 1);
    } else {
      // Completed all 5 questions -> TRANSITION DIRECTLY TO CONGRATULATIONS SCREEN (No Chốt kiến thức)
      handleFinishLesson();
    }
  };

  const handleFinishLesson = () => {
    if (autoFinishTimerRef.current) {
      clearTimeout(autoFinishTimerRef.current);
      autoFinishTimerRef.current = null;
    }
    soundService.cancelSpeech();
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    setTimeSpent(elapsed);
    setPhase('completed');

    // Award certificate and 1 gold star if first-time completion
    const result = StorageService.awardLessonCertificate(
      student.id,
      student.fullName,
      student.className,
      lesson.id,
      lesson.title
    );

    setCertificate(result.certificate);
    setIsNewCertificate(result.isNew);

    if (result.updatedStudent) {
      onUpdateStudent(result.updatedStudent);
    }

    // Save activity record
    StorageService.recordActivity(student.id, {
      type: 'lesson',
      targetId: lesson.id,
      targetName: lesson.title,
      topicId: lesson.topicId,
      score: correctCount,
      totalQuestions: 5,
      starsEarned: result.isNew ? 1 : 0,
      timeSpentSeconds: elapsed,
    });

    // Big victory fireworks & celebratory sound
    soundService.playVictory();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
    });

    // English celebration praise
    soundService.speakEn('Congratulations! You did a fantastic job!', {
      rate: 0.95,
      pitch: 1.1,
    });
  };

  // Restart lesson
  const handleRestart = () => {
    soundService.playClick();
    soundService.cancelSpeech();
    setPlayingQuestionAudio(false);
    setPhase('question');
    setQIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentFeedback(null);
    setCorrectCount(0);
    setQuestionResults({});
    lastPraiseIndex.current = -1;
    lastEncouragementIndex.current = -1;
  };

  // Determine option grid columns count based on options count and text length
  const optionsCount = currentQ.options?.length || 3;
  const maxOptionLength = Math.max(...(currentQ.options?.map((o) => String(o).length) || [0]));
  const gridColsClass =
    optionsCount === 2
      ? 'grid-cols-2 max-w-lg'
      : optionsCount === 4
      ? maxOptionLength > 14
        ? 'grid-cols-2 max-w-2xl'
        : 'grid-cols-2 sm:grid-cols-4 max-w-3xl'
      : optionsCount === 3
      ? maxOptionLength > 20
        ? 'grid-cols-1 sm:grid-cols-3 max-w-2xl'
        : 'grid-cols-3 max-w-2xl'
      : 'grid-cols-2 max-w-xl';

  const hasVisual = Boolean(resolveVisualConfig(currentQ));

  return (
    <div className="w-full min-h-[100dvh] md:h-[100dvh] md:max-h-[100dvh] overflow-y-auto md:overflow-hidden select-none flex flex-col p-1 sm:p-2 bg-gradient-to-b from-sky-50/50 via-orange-50/30 to-amber-50/40">
      {/* ===================================================================== */}
      {/* KHU VỰC A – THANH ĐIỀU HƯỚNG PHÍA TRÊN (Gọn gàng, chiều cao thực tế) */}
      {/* ===================================================================== */}
      <header className="shrink-0 w-full max-w-5xl mx-auto min-h-[44px] h-auto sm:h-10 bg-white/95 rounded-2xl px-3 sm:px-4 py-1.5 sm:py-0 border border-orange-200/80 shadow-2xs flex items-center justify-between gap-2 z-10 mb-1 sm:mb-1.5 sticky top-0">
        {/* Nút quay lại (bên trái) */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 min-h-[38px] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm transition-all cursor-pointer shrink-0 active:scale-95"
          title="Quay lại danh sách bài học"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
          <span className="hidden sm:inline">Danh sách bài</span>
          <span className="sm:hidden">Bài học</span>
        </button>

        {/* Tên bài học và tiến trình câu hỏi (ở giữa, sắp xếp thẳng hàng gọn gàng, không chồng chéo) */}
        <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 min-w-0 px-1 sm:px-2">
          <h2 className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm font-black text-slate-900 truncate max-w-[160px] sm:max-w-xs md:max-w-md">
            {lesson.title}
          </h2>
          {phase === 'question' && (
            <>
              <span className="hidden sm:inline text-amber-300 font-bold">|</span>
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                {lessonPkg.questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`transition-all rounded-full ${
                      idx < qIndex
                        ? 'w-3.5 h-1.5 sm:w-4 sm:h-2 bg-emerald-500'
                        : idx === qIndex
                        ? 'w-5 h-2 sm:w-6 sm:h-2.5 bg-amber-500 shadow-2xs ring-2 ring-amber-200 animate-pulse'
                        : 'w-2 h-1.5 sm:w-2.5 sm:h-2 bg-slate-200'
                    }`}
                    title={`Câu ${idx + 1}`}
                  />
                ))}
                <span className="text-[11px] sm:text-xs font-black text-amber-950 ml-1">
                  {qIndex + 1}/5
                </span>
              </div>
            </>
          )}
          {phase === 'completed' && (
            <span className="text-[10px] sm:text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 truncate">
              🎉 Hoàn thành bài học – Giấy chứng nhận
            </span>
          )}
        </div>

        {/* Điểm số hoặc ngôi sao (bên phải) */}
        <div className="shrink-0 text-right">
          <span className="text-[11px] sm:text-xs font-black text-amber-900 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 inline-flex items-center gap-1 shadow-2xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{student.totalStars || 0} ⭐</span>
          </span>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* KHU VỰC B – VÙNG HIỂN THỊ NỘI DUNG CHÍNH (Căn giữa, hỗ trợ cuộn dọc trên điện thoại) */}
      {/* ===================================================================== */}
      <main className="w-full flex-1 md:min-h-0 flex items-center justify-center p-1 sm:p-2 overflow-y-auto md:overflow-hidden">
        {/* PHASE 1: 5 INTERACTIVE QUESTIONS (CỤM NỘI DUNG THỐNG NHẤT TRONG KHUNG CAM MỜ BO TRÒN) */}
        {phase === 'question' && (
          <div className="w-full h-full max-h-full flex items-center justify-center my-auto">
            {/* TRƯỜNG HỢP 1: CÂU HỎI CÓ HÌNH MINH HỌA - TỰ ĐỘNG MỞ RỘNG KHUNG, HÌNH RÕ RÀNG */}
            {hasVisual ? (
              <div className="w-full max-w-2xl lg:max-w-3xl bg-[#FFF4E6] rounded-[24px] sm:rounded-[28px] border-2 border-[#F6C58B] shadow-xs px-3.5 py-2.5 sm:px-5 sm:py-3.5 flex flex-col items-center justify-center text-center transition-all">
                {/* 1. Câu hỏi tiếng Việt */}
                <h3
                  className={`font-['Be_Vietnam_Pro'] font-extrabold text-slate-900 leading-snug tracking-tight break-words text-center ${
                    currentQ.promptVi.length > 55
                      ? 'text-xs sm:text-sm md:text-base'
                      : 'text-sm sm:text-base md:text-lg'
                  }`}
                >
                  {currentQ.promptVi}
                </h3>

                {/* 2. Dòng tiếng Anh + Loa phát âm */}
                {currentQ.promptEn && (
                  <div className="mt-0.5 sm:mt-1 inline-flex items-center justify-center gap-1.5 flex-wrap">
                    <span className="font-['Be_Vietnam_Pro'] font-bold text-amber-900/80 text-[11px] sm:text-xs md:text-sm leading-snug text-center">
                      {currentQ.promptEn}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayQuestionSpeech(currentQ.promptEn);
                      }}
                      className={`inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all cursor-pointer shrink-0 shadow-2xs active:scale-90 ${
                        playingQuestionAudio
                          ? 'bg-amber-600 text-white animate-bounce ring-2 ring-amber-300'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-800 hover:scale-105'
                      }`}
                      title="Nghe phát âm tiếng Anh tự nhiên (en-US)"
                    >
                      <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                )}

                {/* 3. Vùng hiển thị riêng của hình minh họa: Rõ ràng, trọn vẹn 100%, không bị cắt/che */}
                <div className="my-1 sm:my-1.5 w-full flex items-center justify-center max-h-[145px] sm:max-h-[160px]">
                  <MathQuestionVisual question={currentQ} />
                </div>

                {/* 4. Các nút đáp án */}
                <div className="w-full mt-1 sm:mt-1.5">
                  <div className={`grid ${gridColsClass} gap-1.5 sm:gap-2.5 mx-auto w-full`}>
                    {currentQ.options?.map((opt, i) => {
                      const isSelected = selectedOption === opt;
                      const optStr = String(opt);
                      const textSizeClass =
                        optStr.length > 15
                          ? 'text-xs sm:text-sm'
                          : optStr.length > 8
                          ? 'text-xs sm:text-sm md:text-base'
                          : 'text-sm sm:text-base md:text-lg';

                      let cardStyle =
                        'bg-white hover:bg-orange-50/70 border-2 border-[#F6C58B] hover:border-amber-400 text-slate-800 shadow-2xs';

                      if (isSelected) {
                        if (isCorrect) {
                          cardStyle =
                            'bg-emerald-500 text-white border-2 border-emerald-600 ring-4 ring-emerald-200 shadow-md scale-102';
                        } else {
                          cardStyle =
                            'bg-amber-100 text-amber-950 border-2 border-amber-400 ring-4 ring-amber-200 animate-shake';
                        }
                      }

                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectOption(opt)}
                          className={`relative min-h-[38px] sm:min-h-[42px] md:min-h-[44px] px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl font-['Be_Vietnam_Pro'] font-black transition-all cursor-pointer flex items-center justify-center text-center active:scale-95 ${cardStyle} ${textSizeClass}`}
                        >
                          <span className="break-words leading-tight hyphens-auto w-full text-center px-1">
                            {opt}
                          </span>
                          {isSelected && isCorrect && (
                            <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                            </span>
                          )}
                          {isSelected && !isCorrect && (
                            <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5">
                              <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Phản hồi và nút TIẾP TỤC tích hợp ngay trong khung cam */}
                {isCorrect === false && currentFeedback && (
                  <div className="mt-1.5 sm:mt-2 inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-amber-950 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300 shadow-2xs animate-shake">
                    <span>{currentFeedback.emoji}</span>
                    <span className="font-extrabold">{currentFeedback.en}</span>
                    <span className="font-semibold text-amber-800 hidden sm:inline">– {currentFeedback.vi}</span>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded-full ml-1">Bé chọn lại nhé!</span>
                  </div>
                )}

                {isCorrect === true && currentFeedback && (
                  <div className="mt-1.5 sm:mt-2 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                    <span className="text-xs sm:text-sm font-black text-emerald-950 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300 inline-flex items-center gap-1.5 shadow-2xs">
                      <span>{currentFeedback.emoji}</span>
                      <span className="font-extrabold text-emerald-900">{currentFeedback.en}</span>
                      <span className="font-semibold text-emerald-700 hidden sm:inline">– {currentFeedback.vi}</span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-200/80 px-2 py-0.5 rounded-full ml-1">Đúng rồi!</span>
                    </span>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="min-h-[40px] sm:min-h-[44px] px-4 py-1.5 sm:px-5 sm:py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all animate-pulse"
                    >
                      <span>{qIndex + 1 < lessonPkg.questions.length ? 'TIẾP TỤC ➡️' : 'HOÀN THÀNH 🏆'}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* TRƯỜNG HỢP 2: CÂU HỎI KHÔNG CÓ HÌNH - KHUNG GỌN GÀNG, ĐÁP ÁN NẰM GẦN CÂU HỎI, KHÔNG CÓ KHOẢNG TRỐNG THỪA */
              <div className="w-full max-w-xl lg:max-w-2xl bg-[#FFF4E6] rounded-[24px] sm:rounded-[28px] border-2 border-[#F6C58B] shadow-xs px-4 py-3.5 sm:px-6 sm:py-5 flex flex-col items-center justify-center text-center transition-all">
                {/* 1. Câu hỏi tiếng Việt lớn, rõ ràng */}
                <h3
                  className={`font-['Be_Vietnam_Pro'] font-extrabold text-slate-900 leading-snug tracking-tight break-words text-center ${
                    currentQ.promptVi.length > 55
                      ? 'text-sm sm:text-base md:text-lg'
                      : 'text-base sm:text-lg md:text-xl'
                  }`}
                >
                  {currentQ.promptVi}
                </h3>

                {/* 2. Dòng tiếng Anh + Loa phát âm */}
                {currentQ.promptEn && (
                  <div className="mt-1 sm:mt-1.5 inline-flex items-center justify-center gap-1.5 flex-wrap">
                    <span className="font-['Be_Vietnam_Pro'] font-bold text-amber-900/80 text-xs sm:text-sm md:text-base leading-snug text-center">
                      {currentQ.promptEn}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayQuestionSpeech(currentQ.promptEn);
                      }}
                      className={`inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all cursor-pointer shrink-0 shadow-2xs active:scale-90 ${
                        playingQuestionAudio
                          ? 'bg-amber-600 text-white animate-bounce ring-2 ring-amber-300'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-800 hover:scale-105'
                      }`}
                      title="Nghe phát âm tiếng Anh tự nhiên (en-US)"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* 3. Các nút đáp án: Đưa lên ngay bên dưới câu hỏi, không có vùng chứa hình trống */}
                <div className="w-full mt-3 sm:mt-4 md:mt-5">
                  <div className={`grid ${gridColsClass} gap-2 sm:gap-3 mx-auto w-full`}>
                    {currentQ.options?.map((opt, i) => {
                      const isSelected = selectedOption === opt;
                      const optStr = String(opt);
                      const textSizeClass =
                        optStr.length > 15
                          ? 'text-xs sm:text-sm'
                          : optStr.length > 8
                          ? 'text-sm sm:text-base md:text-lg'
                          : 'text-base sm:text-lg md:text-xl';

                      let cardStyle =
                        'bg-white hover:bg-orange-50/70 border-2 border-[#F6C58B] hover:border-amber-400 text-slate-800 shadow-2xs';

                      if (isSelected) {
                        if (isCorrect) {
                          cardStyle =
                            'bg-emerald-500 text-white border-2 border-emerald-600 ring-4 ring-emerald-200 shadow-md scale-102';
                        } else {
                          cardStyle =
                            'bg-amber-100 text-amber-950 border-2 border-amber-400 ring-4 ring-amber-200 animate-shake';
                        }
                      }

                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectOption(opt)}
                          className={`relative min-h-[44px] sm:min-h-[48px] px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-['Be_Vietnam_Pro'] font-black transition-all cursor-pointer flex items-center justify-center text-center active:scale-95 ${cardStyle} ${textSizeClass}`}
                        >
                          <span className="break-words leading-tight hyphens-auto w-full text-center px-1">
                            {opt}
                          </span>
                          {isSelected && isCorrect && (
                            <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                            </span>
                          )}
                          {isSelected && !isCorrect && (
                            <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5">
                              <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Phản hồi và nút TIẾP TỤC tích hợp ngay trong khung cam */}
                {isCorrect === false && currentFeedback && (
                  <div className="mt-2.5 sm:mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-amber-950 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300 shadow-2xs animate-shake">
                    <span>{currentFeedback.emoji}</span>
                    <span className="font-extrabold">{currentFeedback.en}</span>
                    <span className="font-semibold text-amber-800 hidden sm:inline">– {currentFeedback.vi}</span>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded-full ml-1">Bé chọn lại nhé!</span>
                  </div>
                )}

                {isCorrect === true && currentFeedback && (
                  <div className="mt-2.5 sm:mt-3 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                    <span className="text-xs sm:text-sm font-black text-emerald-950 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300 inline-flex items-center gap-1.5 shadow-2xs">
                      <span>{currentFeedback.emoji}</span>
                      <span className="font-extrabold text-emerald-900">{currentFeedback.en}</span>
                      <span className="font-semibold text-emerald-700 hidden sm:inline">– {currentFeedback.vi}</span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-200/80 px-2 py-0.5 rounded-full ml-1">Đúng rồi!</span>
                    </span>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="min-h-[40px] sm:min-h-[44px] px-4 py-1.5 sm:px-5 sm:py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all animate-pulse"
                    >
                      <span>{qIndex + 1 < lessonPkg.questions.length ? 'TIẾP TỤC ➡️' : 'HOÀN THÀNH 🏆'}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* PHASE 2: GIẤY CHỨNG NHẬN (CỤM NỘI DUNG THỐNG NHẤT, VỪA TRỌN MÀN HÌNH 16:9, KHÔNG CUỘN) */}
        {phase === 'completed' && certificate && (
          <div className="w-full h-full max-h-full flex items-center justify-center my-auto">
            <div className="w-full max-w-xl md:max-w-2xl flex flex-col items-center justify-center gap-1.5 sm:gap-2 mx-auto">
              {/* Vùng hiển thị Giấy chứng nhận ở giữa, vừa vặn 16:9, không cuộn */}
              <LessonCompletionCertificate certificate={certificate} />

              {/* Các nút điều hướng tinh gọn bên dưới giấy chứng nhận: hiển thị trọn vẹn, không che, không đẩy xuống */}
              <div className="no-print flex items-center justify-center gap-1.5 sm:gap-2.5 w-full flex-wrap pt-1">
                {/* Nút chính 1: Về danh sách bài học */}
                <button
                  type="button"
                  onClick={onBack}
                  className={`min-h-[40px] sm:min-h-[44px] py-2 px-4 sm:py-2.5 sm:px-5 rounded-xl sm:rounded-2xl text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shrink-0 whitespace-nowrap ${
                    nextLesson
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg animate-pulse'
                  }`}
                  title="Quay về danh sách 41 bài học"
                >
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{nextLesson ? 'Về danh sách bài' : 'Hoàn thành – Về danh sách bài'}</span>
                </button>

                {/* Nút chính 2: Học bài tiếp theo (Chỉ hiển thị từ Bài 1 đến Bài 40, chuyển ngay sang câu 1/5 của bài kế tiếp) */}
                {nextLesson && (
                  <button
                    type="button"
                    onClick={handleGoToNextLesson}
                    className="min-h-[40px] sm:min-h-[44px] py-2 px-4 sm:py-2.5 sm:px-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 animate-pulse shrink-0 whitespace-nowrap"
                    title={`Chuyển sang ${nextLesson.title}`}
                  >
                    <span>Học bài tiếp theo</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}

                {/* Nút phụ 1: In giấy chứng nhận */}
                <button
                  type="button"
                  onClick={() => {
                    soundService.playClick();
                    window.print();
                  }}
                  className="min-h-[40px] sm:min-h-[44px] py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl sm:rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-['Be_Vietnam_Pro'] font-extrabold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shrink-0 whitespace-nowrap"
                  title="In giấy chứng nhận khổ A4 ngang"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-600" />
                  <span>In giấy</span>
                </button>

                {/* Nút phụ 2: Học lại bài này */}
                <button
                  type="button"
                  onClick={handleRestart}
                  className="min-h-[40px] sm:min-h-[44px] py-2 px-3 sm:py-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300 font-['Be_Vietnam_Pro'] font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shrink-0 whitespace-nowrap"
                  title="Học lại bài này"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Học lại</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
