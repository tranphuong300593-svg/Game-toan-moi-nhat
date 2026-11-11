/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Topic, StudentProfile, LanguageMode, Lesson, Question } from '../../types';
import { TOPICS, LESSONS } from '../../data/curriculumData';
import { getLessonQuestionsPackage } from '../../data/lessonQuestionsData';
import {
  FeedbackItem,
  getRandomPraise,
  getRandomEncouragement,
} from '../../data/lessonFeedbackData';
import { StorageService } from '../../services/storageService';
import { soundService } from '../../services/audioService';
import { MathQuestionVisual, resolveVisualConfig } from '../common/MathQuestionVisual';
import confetti from 'canvas-confetti';
import {
  Layers,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Star,
  Home,
  Volume2,
  Play,
  X,
} from 'lucide-react';

interface TopicListViewProps {
  student: StudentProfile;
  langMode?: LanguageMode;
  onSelectLesson: (lesson: Lesson) => void;
  onUpdateStudent?: (student: StudentProfile) => void;
  onBack?: () => void;
}

// Curated 5 pedagogical questions for each of the 10 topics in SGK Toán 1
const TOPIC_CURATED_QUESTIONS_MAP: Record<number, string[]> = {
  1: ['1-1', '2-1', '3-1', '4-1', '5-1'],
  2: ['7-1', '7-2', '7-3', '8-1', '9-1'],
  3: ['10-1', '10-3', '11-1', '11-4', '12-1'],
  4: ['14-1', '14-2', '15-1', '15-3', '16-2'],
  5: ['17-1', '17-3', '18-1', '18-2', '19-2'],
  6: ['21-1', '21-3', '22-1', '23-1', '24-5'],
  7: ['25-1', '26-1', '26-2', '27-1', '26-4'],
  8: ['29-1', '30-1', '31-1', '32-1', '33-1'],
  9: ['34-1', '36-1', '37-4', '37-1', '34-4'],
  10: ['38-1', '39-1', '40-1', '40-3', '41-4'],
};

export const TopicListView: React.FC<TopicListViewProps> = ({
  student,
  langMode,
  onSelectLesson,
  onUpdateStudent,
  onBack,
}) => {
  // Navigation & Mode States: 'list' (Bắt đầu) | 'practice' (Làm bài) | 'completed' (Hoàn thành)
  const [mode, setMode] = useState<'list' | 'practice' | 'completed'>('list');
  const [selectedVolumeTab, setSelectedVolumeTab] = useState<1 | 2>(1);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [lessonsModalTopic, setLessonsModalTopic] = useState<Topic | null>(null);

  // Topic Practice States
  const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<any | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const [playingQuestionAudio, setPlayingQuestionAudio] = useState(false);

  // English praise & encouragement non-consecutive feedback tracking
  const lastPraiseIndex = useRef<number>(-1);
  const lastEncouragementIndex = useRef<number>(-1);
  const [currentFeedback, setCurrentFeedback] = useState<
    (FeedbackItem & { isCorrect: boolean }) | null
  >(null);

  // Cancel audio speech on question change or mode change
  useEffect(() => {
    soundService.cancelSpeech();
    setPlayingQuestionAudio(false);
    return () => {
      soundService.cancelSpeech();
      setPlayingQuestionAudio(false);
    };
  }, [mode, qIndex]);

  // Start Topic Practice: Load the curated 5 representative questions for this topic
  const handleStartTopicPractice = (topic: Topic) => {
    soundService.playClick();
    soundService.cancelSpeech();
    setActiveTopic(topic);

    const questionIds = TOPIC_CURATED_QUESTIONS_MAP[topic.id] || [];
    const questions: Question[] = [];

    questionIds.forEach((qid) => {
      const lessonId = parseInt(qid.split('-')[0], 10);
      const pkg = getLessonQuestionsPackage(lessonId);
      if (pkg && pkg.questions) {
        const found = pkg.questions.find((q) => q.id === qid);
        if (found) questions.push(found);
      }
    });

    // Fallback if any ID missing: pull directly from topic's lessons
    if (questions.length < 5) {
      topic.lessonIds.forEach((lid) => {
        const pkg = getLessonQuestionsPackage(lid);
        if (pkg && pkg.questions) {
          for (const q of pkg.questions) {
            if (!questions.some((existing) => existing.id === q.id)) {
              questions.push(q);
              if (questions.length === 5) break;
            }
          }
        }
      });
    }

    setPracticeQuestions(questions.slice(0, 5));
    setQIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentFeedback(null);
    setCorrectCount(0);
    setStartTime(Date.now());
    setMode('practice');
  };

  const currentQ = practiceQuestions[qIndex] || practiceQuestions[0];

  // Trong Chủ đề 3: Câu hỏi số 3 (index 2) và Câu hỏi số 4 (index 3) xóa hoàn toàn hình minh họa theo yêu cầu sư phạm
  const isTopic3Excluded = activeTopic?.id === 3 && (qIndex === 2 || qIndex === 3);

  const visualConfig = !isTopic3Excluded && currentQ ? resolveVisualConfig(currentQ) : null;
  const hasVisual = visualConfig !== null;

  // Play English question speech
  const handlePlayQuestionSpeech = (enText: string) => {
    soundService.cancelSpeech();
    setPlayingQuestionAudio(true);
    soundService.speakEn(enText, {
      slow: true,
      onEnd: () => setPlayingQuestionAudio(false),
    });
  };

  // Handle student selecting an option in topic practice
  const handleSelectOption = (opt: any) => {
    if (isCorrect) return;

    soundService.cancelSpeech();
    setPlayingQuestionAudio(false);
    soundService.playClick();
    setSelectedOption(opt);

    const match = String(opt).trim().toLowerCase() === String(currentQ.answer).trim().toLowerCase();

    if (match) {
      setIsCorrect(true);
      setCorrectCount((prev) => prev + 1);
      soundService.playCorrect();

      confetti({
        particleCount: 22,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#22c55e', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
      });

      const { item, index } = getRandomPraise(lastPraiseIndex.current);
      lastPraiseIndex.current = index;
      setCurrentFeedback({ ...item, isCorrect: true });
      soundService.speakEn(item.en, { rate: 0.94, pitch: 1.1 });
    } else {
      setIsCorrect(false);
      soundService.playIncorrect();

      const { item, index } = getRandomEncouragement(lastEncouragementIndex.current);
      lastEncouragementIndex.current = index;
      setCurrentFeedback({ ...item, isCorrect: false });
      soundService.speakEn(item.en, { rate: 0.9, pitch: 1.05 });
    }
  };

  // Next question or complete topic
  const handleNext = () => {
    soundService.cancelSpeech();
    setPlayingQuestionAudio(false);
    soundService.playClick();
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentFeedback(null);

    if (qIndex + 1 < practiceQuestions.length) {
      setQIndex(qIndex + 1);
    } else {
      handleCompleteTopic();
    }
  };

  const handleCompleteTopic = () => {
    soundService.cancelSpeech();
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    setTimeSpent(elapsed);
    setMode('completed');

    // Record activity and award +1 star
    if (activeTopic) {
      StorageService.recordActivity(student.id, {
        type: 'review',
        targetId: activeTopic.id,
        targetName: activeTopic.name,
        topicId: activeTopic.id,
        score: correctCount,
        totalQuestions: 5,
        starsEarned: 1,
        timeSpentSeconds: elapsed,
      });

      const updated = StorageService.getCurrentStudent();
      if (updated) {
        onUpdateStudent?.(updated);
      }
    }

    soundService.playVictory();
    confetti({
      particleCount: 75,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
    });

    soundService.speakEn('Great job! Topic practice completed!', { rate: 0.95, pitch: 1.1 });
  };

  // Option grid class based on number of options (2, 3, or 4 options)
  const optionsCount = currentQ?.options?.length || 3;
  const gridColsClass =
    optionsCount === 2
      ? 'grid-cols-2 max-w-md'
      : optionsCount === 4
      ? 'grid-cols-2 sm:grid-cols-4 max-w-3xl'
      : 'grid-cols-3 max-w-xl';

  // Filter topics by volume tab (5 topics in Volume 1, 5 topics in Volume 2)
  const currentVolumeTopics = TOPICS.filter((t) => t.volume === selectedVolumeTab);

  return (
    <div className="w-full min-h-[100dvh] md:min-h-0 md:aspect-[16/9] md:max-w-[calc((100dvh-1rem)*16/9)] md:max-h-[calc(100dvh-1rem)] mx-auto flex flex-col justify-between overflow-y-auto md:overflow-hidden select-none bg-gradient-to-b from-teal-50/70 via-white to-sky-50/60 rounded-2xl md:rounded-3xl border-2 border-slate-200/80 shadow-2xl p-2 sm:p-3">
      {/* =========================================================================
          SCREEN 1: TOPIC LIST SELECTION (MÀN HÌNH BẮT ĐẦU CHỦ ĐỀ - 16:9 ZERO SCROLL)
          ========================================================================= */}
      {mode === 'list' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-y-auto md:overflow-hidden w-full">
          {/* Top Bar: Navigation & Volume Selector */}
          <div className="shrink-0 min-h-[44px] h-auto sm:h-12 bg-white/95 rounded-2xl px-2.5 sm:px-3 py-1.5 sm:py-0 border border-slate-200 shadow-2xs flex items-center justify-between gap-2 sticky top-0 z-20">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm transition-all cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Trang chủ</span>
            </button>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => {
                  soundService.playClick();
                  setSelectedVolumeTab(1);
                }}
                className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg text-xs sm:text-sm font-['Be_Vietnam_Pro'] font-black transition-all cursor-pointer ${
                  selectedVolumeTab === 1
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tập 1 (Chủ đề 1 – 5)
              </button>
              <button
                onClick={() => {
                  soundService.playClick();
                  setSelectedVolumeTab(2);
                }}
                className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg text-xs sm:text-sm font-['Be_Vietnam_Pro'] font-black transition-all cursor-pointer ${
                  selectedVolumeTab === 2
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tập 2 (Chủ đề 6 – 10)
              </button>
            </div>

            <div className="shrink-0 text-right">
              <span className="text-[11px] sm:text-xs font-black text-teal-800 bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-100">
                10 Chủ đề lớn 🏝️
              </span>
            </div>
          </div>

          {/* Grid of 5 Topics for Selected Volume (Strict 16:9 Non-Scrollable Layout) */}
          <div className="flex-1 min-h-0 flex items-center justify-center py-1 sm:py-2 overflow-hidden my-auto w-full">
            <div className="w-full grid grid-cols-5 gap-2 sm:gap-2.5 h-full max-h-[62vh]">
              {currentVolumeTopics.map((topic) => {
                const topicLessons = LESSONS.filter((l) => l.topicId === topic.id);
                return (
                  <div
                    key={topic.id}
                    className="bg-white rounded-2xl border-2 border-slate-200 hover:border-teal-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between p-2 sm:p-2.5 text-center group overflow-hidden"
                  >
                    {/* Header: Icon & Topic Number */}
                    <div className="shrink-0 space-y-0.5">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl bg-gradient-to-br from-teal-100 to-sky-100 border border-teal-200 flex items-center justify-center text-xl sm:text-2xl shadow-2xs group-hover:scale-105 transition-transform">
                        {topic.icon}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-black uppercase text-teal-700 tracking-wider">
                        Chủ đề {topic.id}
                      </div>
                      <h3 className="font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2">
                        {topic.name}
                      </h3>
                    </div>

                    {/* Short Description */}
                    <div className="flex-1 min-h-0 flex items-center justify-center my-1 px-1">
                      <p className="text-[10px] sm:text-xs text-slate-500 font-semibold line-clamp-2 leading-tight">
                        {topic.description}
                      </p>
                    </div>

                    {/* Action Buttons: Practice Topic & View Lessons */}
                    <div className="shrink-0 space-y-1">
                      <button
                        onClick={() => handleStartTopicPractice(topic)}
                        className="w-full py-1.5 px-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-['Be_Vietnam_Pro'] font-black text-[11px] sm:text-xs rounded-xl shadow-2xs cursor-pointer flex items-center justify-center gap-1 active:scale-95 transition-all"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Luyện tập 5 câu</span>
                      </button>

                      <button
                        onClick={() => {
                          soundService.playClick();
                          setLessonsModalTopic(topic);
                        }}
                        className="w-full py-1 px-2 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 font-['Be_Vietnam_Pro'] font-bold text-[10px] sm:text-[11px] rounded-xl cursor-pointer flex items-center justify-center gap-1 transition-all"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>{topicLessons.length} bài học</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Info Banner */}
          <div className="shrink-0 h-9 sm:h-10 bg-white/80 rounded-2xl px-3 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Mỗi chủ đề có 5 câu hỏi cốt lõi – Hoàn thành nhận ngay ⭐ +1 Ngôi sao!</span>
            </span>
            <span className="hidden sm:inline text-teal-700 font-black">
              Bộ sách: Kết nối tri thức với cuộc sống
            </span>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN 2: TOPIC PRACTICE (MÀN HÌNH LÀM BÀI THEO CHỦ ĐỀ - CỤM NỘI DUNG THỐNG NHẤT)
          ========================================================================= */}
      {mode === 'practice' && currentQ && (
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-y-auto md:overflow-hidden w-full">
          {/* Top Bar: Nhẹ nhàng, gọn gàng, BỎ TÊN CHỦ ĐỀ DÀI theo yêu cầu */}
          <div className="shrink-0 h-10 sm:h-11 bg-white/95 rounded-2xl px-3 border border-slate-200 shadow-2xs flex items-center justify-between">
            <button
              onClick={() => {
                soundService.playClick();
                setMode('list');
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Chủ đề</span>
            </button>

            {/* Tiến trình 5 câu hỏi gọn gàng ở giữa (Không hiển thị tên chủ đề lặp lại) */}
            <div className="flex items-center justify-center gap-1.5">
              {practiceQuestions.map((_, idx) => (
                <div
                  key={idx}
                  className={`transition-all rounded-full ${
                    idx < qIndex
                      ? 'w-4 h-1.5 sm:w-5 sm:h-2 bg-teal-500'
                      : idx === qIndex
                      ? 'w-6 h-2 sm:w-7 sm:h-2.5 bg-emerald-500 shadow-sm animate-pulse'
                      : 'w-2 h-1.5 sm:w-2.5 sm:h-2 bg-slate-200'
                  }`}
                  title={`Câu ${idx + 1}`}
                />
              ))}
              <span className="text-xs sm:text-sm font-black text-teal-800 ml-1.5">
                Câu {qIndex + 1}/5
              </span>
            </div>

            {/* Ngôi sao phần thưởng */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-black text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>+1 Sao</span>
            </div>
          </div>

          {/* CỤM NỘI DUNG THỐNG NHẤT – CĂN GIỮA DỌC MÀN HÌNH (Không khoảng trống lớn, câu hỏi & đáp án gần nhau) */}
          <div className="flex-1 min-h-0 flex flex-col justify-center items-center w-full max-w-3xl mx-auto my-auto px-2">
            <div className="w-full bg-white/95 rounded-3xl border-2 border-teal-200/90 shadow-sm p-4 sm:p-6 flex flex-col items-center justify-center text-center transition-all">
              {/* 1. Câu hỏi tiếng Việt lớn, rõ ràng */}
              <h3
                className={`font-['Be_Vietnam_Pro'] font-extrabold text-slate-900 leading-snug tracking-tight break-words text-center ${
                  currentQ.promptVi.length > 60
                    ? 'text-base sm:text-lg md:text-xl'
                    : currentQ.promptVi.length > 35
                    ? 'text-lg sm:text-xl md:text-2xl'
                    : 'text-xl sm:text-2xl md:text-3xl'
                }`}
              >
                {currentQ.promptVi}
              </h3>

              {/* 2. Dòng tiếng Anh nhỏ hơn ngay bên dưới (cách 6–10px) kèm nút loa 🔊 */}
              {currentQ.promptEn && (
                <div className="mt-2 inline-flex items-center justify-center gap-2 flex-wrap">
                  <span className="font-['Be_Vietnam_Pro'] font-bold text-teal-800 text-xs sm:text-sm md:text-base leading-snug text-center">
                    {currentQ.promptEn}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayQuestionSpeech(currentQ.promptEn);
                    }}
                    className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full transition-all cursor-pointer shrink-0 shadow-2xs active:scale-90 ${
                      playingQuestionAudio
                        ? 'bg-teal-600 text-white animate-bounce ring-2 ring-teal-300'
                        : 'bg-teal-100 hover:bg-teal-200 text-teal-700 hover:scale-105'
                    }`}
                    title="Nghe phát âm tiếng Anh tự nhiên (en-US)"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* 3. LOẠI A – CÓ HÌNH MINH HỌA (Hiển thị trọn vẹn 100%, không bị cắt hay che khuất) */}
              {hasVisual && (
                <div className="my-2 sm:my-3 max-w-full flex items-center justify-center shrink-0">
                  <MathQuestionVisual question={currentQ} />
                </div>
              )}

              {/* 4. CÁC NÚT ĐÁP ÁN LỚN (LOẠI A: cách hình 16–24px | LOẠI B: cách tiếng Anh 20–28px, KHÔNG CÓ KHOẢNG TRỐNG) */}
              <div className={`w-full ${hasVisual ? 'mt-3 sm:mt-4' : 'mt-5 sm:mt-6'}`}>
                <div className={`grid ${gridColsClass} gap-2.5 sm:gap-3.5 mx-auto w-full`}>
                  {currentQ.options?.map((opt, i) => {
                    const isSelected = selectedOption === opt;
                    const optStr = String(opt);
                    const textSizeClass =
                      optStr.length > 15
                        ? 'text-xs sm:text-sm md:text-base'
                        : optStr.length > 8
                        ? 'text-sm sm:text-base md:text-lg'
                        : 'text-base sm:text-lg md:text-xl';

                    let cardStyle =
                      'bg-white hover:bg-teal-50 border-slate-300 hover:border-teal-400 text-slate-800 shadow-2xs';

                    if (isSelected) {
                      if (isCorrect) {
                        cardStyle =
                          'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-md scale-102';
                      } else {
                        cardStyle =
                          'bg-amber-100 text-amber-950 border-amber-400 ring-4 ring-amber-200 animate-shake';
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelectOption(opt)}
                        className={`relative min-h-[48px] sm:min-h-[52px] md:min-h-[56px] px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl sm:rounded-3xl border-2 sm:border-3 font-['Be_Vietnam_Pro'] font-black transition-all cursor-pointer flex items-center justify-center text-center active:scale-95 ${cardStyle} ${textSizeClass}`}
                      >
                        <span className="break-words leading-tight hyphens-auto w-full text-center px-1">
                          {opt}
                        </span>
                        {isSelected && isCorrect && (
                          <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5">
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </span>
                        )}
                        {isSelected && !isCorrect && (
                          <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5">
                            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. PHẢN HỒI ĐÚNG / SAI & NÚT TIẾP TỤC (Gọn gàng ngay dưới các đáp án) */}
              <div className="min-h-[44px] sm:min-h-[48px] mt-3 sm:mt-4 flex items-center justify-center gap-3 w-full">
                {isCorrect === false && currentFeedback && (
                  <span className="text-xs sm:text-sm font-black text-amber-950 bg-amber-50 px-3.5 py-1.5 rounded-full border-2 border-amber-300 inline-flex items-center gap-1.5 shadow-2xs animate-shake">
                    <span className="text-base">{currentFeedback.emoji}</span>
                    <span className="font-extrabold text-amber-950">{currentFeedback.en}</span>
                    <span className="font-semibold text-amber-800 text-xs hidden sm:inline">– {currentFeedback.vi}</span>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded-full ml-1">Bé chọn lại nhé!</span>
                  </span>
                )}
                {isCorrect === true && (
                  <div className="inline-flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                    {currentFeedback && (
                      <span className="text-xs sm:text-sm font-black text-emerald-950 bg-emerald-50 px-3.5 py-1.5 rounded-full border-2 border-emerald-300 inline-flex items-center gap-1.5 shadow-2xs">
                        <span className="text-base">{currentFeedback.emoji}</span>
                        <span className="font-extrabold text-emerald-900">{currentFeedback.en}</span>
                        <span className="font-semibold text-emerald-700 text-xs hidden sm:inline">– {currentFeedback.vi}</span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-200/70 px-2 py-0.5 rounded-full ml-1">Đúng rồi!</span>
                      </span>
                    )}
                    <button
                      onClick={handleNext}
                      className="min-h-[44px] py-2 px-5 sm:py-2.5 sm:px-6 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm md:text-base rounded-2xl shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <span>{qIndex + 1 < practiceQuestions.length ? 'TIẾP TỤC ➡️' : 'HOÀN THÀNH 🏆'}</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar: Giữ không gian thanh thoát */}
          <div className="shrink-0 h-4" />
        </div>
      )}

      {/* =========================================================================
          SCREEN 3: TOPIC COMPLETION (MÀN HÌNH HOÀN THÀNH CHỦ ĐỀ - 16:9 CELEBRATION)
          ========================================================================= */}
      {mode === 'completed' && activeTopic && (
        <div className="flex-1 min-h-0 flex flex-col justify-between py-2 sm:py-3 px-3 sm:px-6 max-w-3xl mx-auto w-full overflow-y-auto md:overflow-hidden text-center my-auto">
          {/* Header */}
          <div className="shrink-0 space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-3 sm:px-4 py-1 rounded-full shadow-2xs">
              <Trophy className="w-4 h-4" />
              <span className="font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm tracking-wider uppercase">
                HOÀN THÀNH CHỦ ĐỀ TOÁN HỌC
              </span>
            </div>
            <h3 className="font-['Be_Vietnam_Pro'] font-black text-xl sm:text-2xl md:text-3xl text-slate-900 tracking-tight">
              CHÚC MỪNG BÉ ĐÃ HOÀN THÀNH CHỦ ĐỀ! 🌟
            </h3>
            <p className="font-bold text-xs sm:text-sm text-teal-800">
              {activeTopic.enName} – Excellent Work!
            </p>
          </div>

          {/* Results Summary */}
          <div className="flex-1 min-h-0 flex items-center justify-center py-2 overflow-hidden my-auto">
            <div className="w-full max-w-xl bg-white/95 rounded-3xl border-2 sm:border-3 border-teal-300 p-3 sm:p-5 shadow-md flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 text-white flex items-center justify-center text-3xl sm:text-4xl shadow-md animate-bounce">
                {activeTopic.icon}
              </div>

              <div className="space-y-1 text-center">
                <div className="font-['Be_Vietnam_Pro'] font-black text-base sm:text-lg md:text-xl text-slate-900">
                  {activeTopic.name}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600">
                  Tập {activeTopic.volume} · SGK Kết nối tri thức với cuộc sống
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Kết quả: {correctCount}/5 câu đúng</span>
                </div>

                <div className="px-3.5 py-1.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-800 font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>+1 Ngôi sao vàng! ⭐</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="shrink-0 flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1">
            <button
              onClick={() => handleStartTopicPractice(activeTopic)}
              className="py-1.5 px-3 sm:py-2 sm:px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-300 font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-slate-600" />
              <span>Luyện tập lại</span>
            </button>

            <button
              onClick={() => {
                soundService.playClick();
                setMode('list');
              }}
              className="py-1.5 px-4 sm:py-2 sm:px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Layers className="w-4 h-4" />
              <span>Danh sách 10 chủ đề</span>
            </button>

            {onBack && (
              <button
                onClick={onBack}
                className="py-1.5 px-3 sm:py-2 sm:px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Home className="w-4 h-4" />
                <span>Về Trang chủ</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: VIEW LESSONS IN A TOPIC (Pop-up to choose a specific lesson)
          ========================================================================= */}
      {lessonsModalTopic && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="w-full max-w-lg bg-white rounded-3xl border-2 border-teal-300 shadow-2xl p-4 sm:p-5 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{lessonsModalTopic.icon}</span>
                <div>
                  <h4 className="font-['Be_Vietnam_Pro'] font-black text-sm sm:text-base text-slate-900">
                    {lessonsModalTopic.name}
                  </h4>
                  <span className="text-xs text-teal-700 font-bold">
                    Tập {lessonsModalTopic.volume} · Danh sách bài học
                  </span>
                </div>
              </div>
              <button
                onClick={() => setLessonsModalTopic(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of Lessons */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
              {LESSONS.filter((l) => l.topicId === lessonsModalTopic.id).map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => {
                    soundService.playClick();
                    setLessonsModalTopic(null);
                    onSelectLesson(lesson);
                  }}
                  className="w-full p-2.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 flex items-center justify-between text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 font-black text-xs flex items-center justify-center shrink-0">
                      {lesson.id}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-teal-700 truncate">
                        {lesson.title}
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-500 truncate">
                        {lesson.enTitle}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              ))}
            </div>

            {/* Modal Bottom: Quick start topic practice */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500 font-semibold">
                Hoặc luyện tập toàn bộ chủ đề:
              </span>
              <button
                onClick={() => {
                  const t = lessonsModalTopic;
                  setLessonsModalTopic(null);
                  handleStartTopicPractice(t);
                }}
                className="py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl cursor-pointer flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Luyện tập chủ đề</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
