/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { StudentProfile, LanguageMode, Question } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundService, getExamPraise, ExamPraiseItem } from '../../services/audioService';
import { MathQuestionVisual, resolveVisualConfig } from '../common/MathQuestionVisual';
import {
  EXAM_PERIODS,
  ALL_16_EXAMS,
  ExamPackage,
  CognitiveLevel,
} from '../../data/examReviewData';
import confetti from 'canvas-confetti';
import {
  FileCheck,
  RotateCcw,
  Volume2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Trophy,
  ChevronRight,
  Check,
  Lightbulb,
  Award,
  Sparkles,
  Star,
  FileText,
  X,
} from 'lucide-react';

interface MathReviewViewProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onUpdateStudent: (student: StudentProfile) => void;
  onBack: () => void;
  onFinishReview?: () => void;
  onActiveExamChange?: (isActive: boolean) => void;
}

export const MathReviewView: React.FC<MathReviewViewProps> = ({
  student,
  langMode,
  onUpdateStudent,
  onBack,
  onFinishReview,
  onActiveExamChange,
}) => {
  // Navigation State
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);
  const [activeExam, setActiveExam] = useState<ExamPackage | null>(null);

  // View Mode: 'exam' | 'result' | 'review-wrong'
  const [viewMode, setViewMode] = useState<'exam' | 'result' | 'review-wrong'>('exam');
  const [reviewWrongIndex, setReviewWrongIndex] = useState(0);

  // Exam Taking State
  const [qIndex, setQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [filterReview, setFilterReview] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [currentPraise, setCurrentPraise] = useState<ExamPraiseItem | null>(null);
  const [showAllQuestionsModal, setShowAllQuestionsModal] = useState(false);

  // Load student records to show best score on test cards
  const studentRecords = useMemo(() => {
    try {
      const all = StorageService.getAllRecords();
      return all.filter((r) => r.studentId === student.id && r.type === 'review');
    } catch {
      return [];
    }
  }, [student.id, isSubmitted]);

  const getBestScore = (testId: string): number | null => {
    const testRecords = studentRecords.filter((r) => r.targetId === testId);
    if (testRecords.length === 0) return null;
    return Math.max(...testRecords.map((r) => r.score || 0));
  };

  // Start Exam
  const handleStartExam = (exam: ExamPackage) => {
    setActiveExam(exam);
    setQIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setIsSubmitting(false);
    setShowSubmitConfirm(false);
    setViewMode('exam');
    setReviewWrongIndex(0);
    setFilterReview('all');
    setCurrentPraise(null);
    setStartTime(Date.now());
    soundService.playClick();
    onActiveExamChange?.(true);
  };

  // Exit Exam
  const handleExitExam = () => {
    setActiveExam(null);
    setViewMode('exam');
    setShowSubmitConfirm(false);
    onActiveExamChange?.(false);
    soundService.playClick();
  };

  // Option selection during exam (no instant right/wrong feedback)
  const handleSelectOption = (opt: any) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qIndex]: opt }));
    soundService.playClick();
  };

  // Check if current question has been answered
  const isCurrentAnswered = useMemo(() => {
    const ans = userAnswers[qIndex];
    return ans !== undefined && ans !== null && String(ans).trim() !== '';
  }, [userAnswers, qIndex]);

  // Check unanswered questions
  const unansweredIndices = useMemo(() => {
    if (!activeExam) return [];
    const unanswered: number[] = [];
    activeExam.questions.forEach((_, idx) => {
      const ans = userAnswers[idx];
      if (ans === undefined || ans === null || String(ans).trim() === '') {
        unanswered.push(idx);
      }
    });
    return unanswered;
  }, [activeExam, userAnswers]);

  const answeredCount = activeExam ? activeExam.questions.length - unansweredIndices.length : 0;

  // Enforce sequential answering check for question palette
  // Student can always go backward to previously answered/visited questions
  // Student can only advance forward to targetIdx if ALL questions before targetIdx are answered
  const canNavigateTo = (targetIdx: number): boolean => {
    if (targetIdx <= qIndex) return true;
    for (let i = 0; i < targetIdx; i++) {
      const ans = userAnswers[i];
      if (ans === undefined || ans === null || String(ans).trim() === '') {
        return false;
      }
    }
    return true;
  };

  // Submit trigger - opens confirmation modal
  const handleRequestSubmit = () => {
    setShowSubmitConfirm(true);
    soundService.playPop();
  };

  // Execute Submission & Grading
  const executeSubmit = () => {
    if (!activeExam || isSubmitting) return;
    setIsSubmitting(true);
    setShowSubmitConfirm(false);

    let correctCount = 0;
    activeExam.questions.forEach((q, idx) => {
      const userAns = String(userAnswers[idx] ?? '').trim().toLowerCase();
      const correctAns = String(q.answer).trim().toLowerCase();
      if (userAns === correctAns) {
        correctCount++;
      }
    });

    const scaledScore = Math.round((correctCount / activeExam.questions.length) * 10 * 10) / 10;
    const starsEarned = correctCount * 4;
    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    // Choose appropriate English praise based on student's actual score
    const praise = getExamPraise(scaledScore);
    setCurrentPraise(praise);

    setIsSubmitted(true);
    setViewMode('result');
    setIsSubmitting(false);
    onActiveExamChange?.(false);

    // Save record via StorageService
    try {
      StorageService.recordActivity(student.id, {
        type: 'review',
        targetId: activeExam.testId,
        targetName: `${activeExam.periodTitleVi} - ${activeExam.titleVi}`,
        score: scaledScore,
        totalQuestions: activeExam.questions.length,
        starsEarned,
        timeSpentSeconds,
      });

      const updated = StorageService.getCurrentStudent();
      if (updated) onUpdateStudent(updated);
    } catch {
      // storage handled gracefully
    }

    // Play sparkling stars & colorful confetti celebration effects
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#3b82f6'],
    });
    confetti({
      particleCount: 60,
      spread: 120,
      origin: { y: 0.5 },
      shapes: ['star'],
      colors: ['#ffd700', '#ffb703', '#fb8500'],
      scalar: 1.2,
    });

    // Play 2-3s cheerful celebratory chime & soft applause, then speak the English praise without overlapping
    soundService.playExamCelebration(() => {
      soundService.speak(praise.en, 'en', {
        rate: 0.92,
        pitch: 1.08,
      });
    });
  };

  // Wrong questions list for review
  const wrongQuestionsList = useMemo(() => {
    if (!activeExam) return [];
    return activeExam.questions
      .map((q, idx) => {
        const userAns = userAnswers[idx];
        const isCorrect = String(userAns ?? '').trim().toLowerCase() === String(q.answer).trim().toLowerCase();
        return { q, idx, userAns, isCorrect };
      })
      .filter((item) => !item.isCorrect);
  }, [activeExam, userAnswers]);

  const selectedPeriod = useMemo(() => {
    return EXAM_PERIODS.find((p) => p.id === selectedPeriodId) || null;
  }, [selectedPeriodId]);

  const periodExams = useMemo(() => {
    if (!selectedPeriodId) return [];
    return ALL_16_EXAMS.filter((e) => e.periodId === selectedPeriodId);
  }, [selectedPeriodId]);

  // Level Badge Renderer
  const renderLevelBadge = (level?: CognitiveLevel) => {
    switch (level) {
      case 'nhan_biet':
        return (
          <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black bg-blue-100 text-blue-700 border border-blue-200 shrink-0">
            Mức 1: Nhận biết
          </span>
        );
      case 'thong_hieu':
        return (
          <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
            Mức 2: Thông hiểu
          </span>
        );
      case 'van_dung':
        return (
          <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black bg-purple-100 text-purple-800 border border-purple-200 shrink-0">
            Mức 3: Vận dụng
          </span>
        );
      default:
        return null;
    }
  };

  // -------------------------------------------------------------
  // VIEW 1: 4 EXAM PERIODS SELECTION SCREEN
  // -------------------------------------------------------------
  if (!selectedPeriodId) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6 animate-fadeIn pb-6">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-pink-100">
              <FileCheck className="w-4 h-4" /> Hệ Thống Kiểm Tra Đánh Giá Năng Lực Toán Lớp 1
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading tracking-tight drop-shadow-md">
              ÔN TẬP VÀ KIỂM TRA ĐỊNH KỲ
            </h1>
            <p className="text-sm md:text-base text-pink-100 font-medium max-w-2xl leading-relaxed">
              Chuẩn hóa theo 2 tập Sách Giáo Khoa Toán 1 (Kết nối tri thức với cuộc sống). Hệ thống gồm 4 đợt kiểm tra lớn, 16 đề thi chuẩn hóa và 240 câu hỏi trắc nghiệm sinh động!
            </p>
          </div>

          <div className="relative z-10 bg-white/95 text-slate-800 p-5 rounded-2xl shadow-lg text-center shrink-0 border-2 border-white/60">
            <div className="text-xs font-bold text-slate-500 uppercase">Tổng cộng</div>
            <div className="text-3xl font-black text-purple-700">16 ĐỀ THI</div>
            <div className="text-xs font-bold text-emerald-600 mt-1">240 Câu Hỏi Chuẩn SGK</div>
          </div>
        </div>

        {/* 4 Period Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {EXAM_PERIODS.map((period) => {
            const exams = ALL_16_EXAMS.filter((e) => e.periodId === period.id);
            const completedCount = exams.filter((e) => getBestScore(e.testId) !== null).length;

            return (
              <div
                key={period.id}
                onClick={() => {
                  setSelectedPeriodId(period.id);
                  soundService.playClick();
                }}
                className="group bg-white rounded-3xl p-6 border-2 border-slate-200/90 hover:border-purple-400 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top Badge & Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3.5 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xs">
                    {period.badge} · 4 ĐỀ CHUẨN
                  </span>
                  <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    Đã hoàn thành: {completedCount} / 4 đề
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                    {period.titleVi}
                  </h3>
                  <div className="text-xs font-bold text-purple-600 tracking-wide">
                    {period.titleEn}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <strong className="text-slate-800">Phạm vi SGK:</strong> {period.scopeVi}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    15 câu / đề · Thang điểm 10
                  </span>
                  <div className="flex items-center gap-2 text-sm font-black text-purple-700 group-hover:translate-x-1 transition-transform">
                    <span>Vào chọn đề</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: EXAM LIST (4 TESTS PER PERIOD)
  // -------------------------------------------------------------
  if (selectedPeriod && !activeExam) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn pb-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedPeriodId(null);
              soundService.playClick();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-2xl text-xs sm:text-sm font-black text-slate-700 transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại 4 Đợt kiểm tra</span>
          </button>

          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            Học sinh: <strong className="text-purple-700">{student.fullName}</strong> ({student.className})
          </span>
        </div>

        {/* Period Banner */}
        <div className={`bg-gradient-to-r ${selectedPeriod.gradient} rounded-3xl p-6 text-white shadow-lg space-y-2`}>
          <div className="inline-block px-3 py-0.5 bg-white/20 rounded-full text-xs font-black uppercase tracking-wider">
            {selectedPeriod.badge} · 4 ĐỀ KIỂM TRA CHUẨN SGK
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading">{selectedPeriod.titleVi}</h2>
          <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed max-w-3xl">
            {selectedPeriod.scopeVi}
          </p>
        </div>

        {/* 4 Tests Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {periodExams.map((test) => {
            const best = getBestScore(test.testId);

            return (
              <div
                key={test.testId}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 hover:border-purple-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-xl text-xs font-black bg-purple-100 text-purple-800">
                      Đề số {test.testNumber}
                    </span>
                    {best !== null ? (
                      <span className="flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        <Trophy className="w-3.5 h-3.5" /> Điểm cao nhất: {best}/10
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">Chưa làm</span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-slate-900 mb-1">{test.titleVi}</h3>
                  <div className="text-xs font-bold text-slate-500 mb-3">{test.titleEn}</div>

                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-2xl text-[11px] font-bold text-slate-600 mb-4 text-center">
                    <div>
                      <span className="block text-blue-600 font-black text-xs">6 câu</span>
                      Nhận biết
                    </div>
                    <div>
                      <span className="block text-amber-600 font-black text-xs">6 câu</span>
                      Thông hiểu
                    </div>
                    <div>
                      <span className="block text-purple-600 font-black text-xs">3 câu</span>
                      Vận dụng
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    Thời gian: {test.timeMinutes} phút
                  </span>
                  <button
                    onClick={() => handleStartExam(test)}
                    className="py-2.5 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs md:text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <span>{best !== null ? 'Làm lại đề thi' : 'Bắt đầu làm bài'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (!activeExam) return null;

  // -------------------------------------------------------------
  // VIEW: DEDICATED 16:9 WRONG QUESTION REVIEW STEP-BY-STEP
  // -------------------------------------------------------------
  if (viewMode === 'review-wrong') {
    const wrongItem = wrongQuestionsList[reviewWrongIndex];

    if (!wrongItem) {
      return (
        <div className="w-full aspect-[16/9] max-w-[calc((100dvh-0.5rem)*16/9)] max-h-[calc(100dvh-0.5rem)] mx-auto flex flex-col items-center justify-center p-6 bg-white rounded-2xl md:rounded-3xl border-2 border-amber-300 shadow-2xl text-center space-y-4">
          <div className="text-4xl">🎉</div>
          <h3 className="text-xl font-black text-slate-900">Bé không có câu nào sai trong đề thi này!</h3>
          <button
            onClick={() => {
              setViewMode('result');
              onActiveExamChange?.(false);
            }}
            className="py-2.5 px-6 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-sm cursor-pointer shadow-xs"
          >
            Quay về bảng kết quả
          </button>
        </div>
      );
    }

    const { q, idx, userAns } = wrongItem;

    return (
      <div className="w-full min-h-[100dvh] md:min-h-0 md:aspect-[16/9] md:max-w-[calc((100dvh-0.5rem)*16/9)] md:max-h-[calc(100dvh-0.5rem)] mx-auto flex flex-col justify-between p-1.5 sm:p-2.5 overflow-y-auto md:overflow-hidden select-none animate-fadeIn">
        {/* 1. THANH TRÊN CÙNG: 10-12% height */}
        <div className="shrink-0 min-h-[48px] h-auto sm:h-13 bg-white/95 backdrop-blur-xs rounded-2xl border border-rose-200/90 shadow-2xs px-3 sm:px-4 py-1.5 sm:py-0 flex items-center justify-between gap-2 z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setViewMode('result');
                onActiveExamChange?.(false);
                soundService.playClick();
              }}
              className="text-xs font-black text-slate-700 hover:text-slate-900 min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Bảng điểm</span>
            </button>
            <span className="hidden sm:inline-block text-xs font-black text-amber-950 truncate max-w-xs">
              {activeExam.titleVi}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {renderLevelBadge(q.level)}
            <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-xs">
              Câu sai {reviewWrongIndex + 1} / {wrongQuestionsList.length} (Gốc: Câu {idx + 1})
            </span>
          </div>
        </div>

        {/* 2. KHUNG VÀNG CHÍNH GIỮA: 72-78% height */}
        <div className="flex-1 md:min-h-0 my-1 sm:my-1.5 bg-[#FFFDF0] border-2 border-amber-300 rounded-2xl md:rounded-3xl shadow-sm p-3 sm:p-4 flex flex-col justify-between overflow-y-auto md:overflow-hidden">
          {/* PHẦN TRÊN: Câu hỏi */}
          <div className="shrink-0 space-y-1 bg-amber-100/50 p-2.5 sm:p-3 rounded-2xl border border-amber-200/80">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5 flex-1 min-w-0">
                <span className="text-[10px] sm:text-[11px] font-black uppercase text-amber-900 tracking-wider">
                  CÂU HỎI SỐ {idx + 1}
                </span>
                <div className="text-sm sm:text-base md:text-lg font-black text-amber-950 font-heading leading-snug">
                  {q.promptVi}
                </div>
                {q.promptEn && (
                  <div className="text-xs sm:text-sm font-semibold text-amber-800/80 italic leading-tight">
                    {q.promptEn}
                  </div>
                )}
              </div>

              {q.promptEn && (
                <button
                  type="button"
                  onClick={() => soundService.speak(q.promptEn, 'en', { rate: 0.88 })}
                  className="w-8 h-8 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-900 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
                  title="Nghe câu hỏi tiếng Anh"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* PHẦN GIỮA: Hình minh họa (nếu có) */}
          {Boolean(q.visualConfig || resolveVisualConfig(q as unknown as Question)) && (
            <div className="flex-1 min-h-0 my-1 sm:my-1.5 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full max-h-[140px] sm:max-h-[160px] md:max-h-[190px] bg-white/90 rounded-2xl border border-amber-200/80 p-1.5 flex items-center justify-center overflow-hidden shadow-2xs">
                <MathQuestionVisual question={q as unknown as Question} />
              </div>
            </div>
          )}

          {/* PHẦN DƯỚI: Đối chiếu đáp án & Lời giải chi tiết */}
          <div className="shrink-0 space-y-2 mt-1">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <XCircle className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[10px] sm:text-[11px] font-extrabold text-rose-700 uppercase">Con đã chọn:</div>
                  <div className="text-xs sm:text-sm font-black text-rose-900 truncate">
                    {userAns !== undefined && userAns !== null && String(userAns).trim() !== '' ? String(userAns) : '(Chưa chọn đáp án)'}
                  </div>
                </div>
              </div>

              <div className="p-2 sm:p-2.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[10px] sm:text-[11px] font-extrabold text-emerald-700 uppercase">Đáp án đúng chuẩn SGK:</div>
                  <div className="text-xs sm:text-sm font-black text-emerald-900 truncate">
                    {String(q.answer)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-100/60 rounded-2xl border-2 border-amber-300/80 p-2.5 sm:p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-900 font-black text-xs uppercase tracking-wide">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <span>HƯỚNG DẪN LỜI GIẢI CHI TIẾT (SGK KẾT NỐI TRI THỨC VỚI CUỘC SỐNG):</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed pl-5 sm:pl-6">
                {q.explanationVi}
              </p>
            </div>
          </div>
        </div>

        {/* 3. THANH ĐIỀU KHIỂN PHÍA DƯỚI: 10-12% height */}
        <div className="shrink-0 min-h-[50px] h-auto sm:h-14 bg-white/95 backdrop-blur-xs rounded-2xl border border-rose-200/90 shadow-2xs px-3 sm:px-4 py-2 sm:py-0 flex items-center justify-between gap-2 z-10 sticky bottom-0">
          <button
            type="button"
            onClick={() => {
              setReviewWrongIndex((prev) => Math.max(0, prev - 1));
              soundService.playClick();
            }}
            disabled={reviewWrongIndex === 0}
            className="py-2 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-black text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Câu sai trước</span>
            <span className="sm:hidden">Trước</span>
          </button>

          {/* Dải nút nhảy câu sai */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[50%] px-1">
            {wrongQuestionsList.map((item, wIdx) => {
              const isCurrentWrong = wIdx === reviewWrongIndex;
              return (
                <button
                  key={wIdx}
                  type="button"
                  onClick={() => {
                    setReviewWrongIndex(wIdx);
                    soundService.playClick();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black shrink-0 transition-all cursor-pointer ${
                    isCurrentWrong
                      ? 'bg-rose-600 text-white shadow-xs scale-105 ring-2 ring-rose-300'
                      : 'bg-white hover:bg-rose-100 text-rose-700 border border-rose-200'
                  }`}
                >
                  Câu {item.idx + 1}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setViewMode('result');
                onActiveExamChange?.(false);
                soundService.playClick();
              }}
              className="py-2 px-3.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-black transition-all cursor-pointer hidden md:flex items-center gap-1"
            >
              <span>Về bảng điểm</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setReviewWrongIndex((prev) => Math.min(wrongQuestionsList.length - 1, prev + 1));
                soundService.playClick();
              }}
              disabled={reviewWrongIndex === wrongQuestionsList.length - 1}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-xs font-black disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span className="hidden sm:inline">Câu sai tiếp theo</span>
              <span className="sm:hidden">Tiếp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // VIEW: RESULT & CELEBRATION (CHUẨN 16:9 ZERO-SCROLL)
  // -------------------------------------------------------------
  if (viewMode === 'result') {
    let correctCount = 0;
    activeExam.questions.forEach((q, idx) => {
      if (String(userAnswers[idx] ?? '').trim().toLowerCase() === String(q.answer).trim().toLowerCase()) {
        correctCount++;
      }
    });
    const scaledScore = Math.round((correctCount / activeExam.questions.length) * 10 * 10) / 10;
    const starsEarned = correctCount * 4;
    const wrongCount = activeExam.questions.length - correctCount;

    const praise = currentPraise || getExamPraise(scaledScore);

    return (
      <div className="w-full min-h-[100dvh] md:min-h-0 md:aspect-[16/9] md:max-w-[calc((100dvh-0.5rem)*16/9)] md:max-h-[calc(100dvh-0.5rem)] mx-auto flex flex-col justify-between p-2 sm:p-3 md:p-3.5 bg-gradient-to-br from-amber-50/95 via-yellow-50 to-orange-50 rounded-2xl md:rounded-3xl border-3 border-amber-300 shadow-2xl overflow-y-auto md:overflow-hidden select-none animate-fadeIn relative">
        {/* Floating Sparkles & Stars Decoration */}
        <div className="absolute top-2.5 left-3 text-2xl animate-float pointer-events-none select-none opacity-80">
          ⭐
        </div>
        <div className="absolute top-2.5 right-4 text-2xl animate-float pointer-events-none select-none opacity-80" style={{ animationDelay: '1s' }}>
          ✨
        </div>
        <div className="absolute bottom-16 left-4 text-xl animate-float pointer-events-none select-none opacity-70" style={{ animationDelay: '2s' }}>
          🌟
        </div>
        <div className="absolute bottom-16 right-5 text-xl animate-float pointer-events-none select-none opacity-70" style={{ animationDelay: '1.5s' }}>
          🎉
        </div>

        {/* 1. TOP HEADER BANNER (15% height) */}
        <div className="shrink-0 text-center space-y-0.5 py-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-200/90 text-amber-900 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>KẾT QUẢ ĐÁNH GIÁ NĂNG LỰC TOÁN HỌC LỚP 1</span>
          </div>
          <h1 className="text-base sm:text-xl md:text-2xl font-black text-amber-950 font-heading tracking-tight drop-shadow-xs">
            CHÚC MỪNG BÉ ĐÃ HOÀN THÀNH BÀI THI!
          </h1>
          <p className="text-[10px] sm:text-xs font-bold text-amber-800">
            {activeExam.periodTitleVi} · {activeExam.titleVi} · SGK Kết nối tri thức với cuộc sống
          </p>
        </div>

        {/* 2. CENTER SCORE & PRAISE CARD (70% height) */}
        <div className="flex-1 md:min-h-0 my-1 sm:my-1.5 bg-white/95 rounded-2xl md:rounded-3xl border-2 border-amber-200/90 shadow-sm p-3 sm:p-4 flex flex-col justify-between items-center text-center max-w-2xl w-full mx-auto overflow-y-auto md:overflow-hidden gap-2">
          {/* Student Info Pill */}
          <div className="shrink-0 px-3 py-0.5 rounded-xl bg-purple-50 border border-purple-200 text-[11px] sm:text-xs font-bold text-slate-700">
            Nhà toán học nhí: <strong className="text-purple-700 font-black">{student.fullName}</strong> – Lớp <strong className="text-purple-700 font-black">{student.className}</strong>
          </div>

          {/* Prominent Score Area */}
          <div className="shrink-0 py-0.5 space-y-0.5">
            <div className="text-[10px] sm:text-[11px] font-black text-amber-800 uppercase tracking-widest">
              ĐIỂM SỐ ĐẠT ĐƯỢC
            </div>
            <div className="text-3xl sm:text-5xl md:text-5xl font-black text-rose-600 font-heading tracking-tight drop-shadow-xs">
              {scaledScore} / 10 ĐIỂM
            </div>

            {/* Results Pill badges */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5 text-[11px] sm:text-xs font-black">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                ✓ Đúng: {correctCount} / 15 câu
              </span>
              {wrongCount > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                  ✗ Chưa đúng: {wrongCount} câu
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  ⭐ Xuất sắc 100%
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                ⭐ Thưởng +{starsEarned} Sao
              </span>
            </div>
          </div>

          {/* English Praise Card with Replay Button */}
          <div className="w-full shrink-0 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-2xl border-2 border-purple-200/90 p-2 sm:p-2.5 flex items-center justify-between gap-2.5 shadow-2xs">
            <div className="flex items-center gap-2.5 flex-1 min-w-0 text-left">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] sm:text-[10px] font-black uppercase text-purple-700 tracking-wider">
                  LỜI KHEN TIẾNG ANH (ENGLISH PRAISE):
                </div>
                <div className="text-xs sm:text-sm md:text-base font-black text-purple-950 font-heading truncate">
                  "{praise.en}"
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-purple-700/80 italic truncate">
                  {praise.vi}
                </div>
              </div>
            </div>

            {/* Replay English Speech Button */}
            <button
              type="button"
              onClick={() => {
                soundService.speak(praise.en, 'en', {
                  rate: 0.92,
                  pitch: 1.08,
                });
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
              title="Bấm để nghe lại lời khen tiếng Anh"
            >
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* 3. BOTTOM ACTION BAR: 12-14% height - LUÔN HIỂN THỊ TRỌN VẸN */}
        <div className="shrink-0 min-h-[50px] h-auto sm:h-13 bg-white/95 backdrop-blur-xs rounded-2xl border border-amber-200/90 shadow-2xs px-2.5 sm:px-4 py-2 sm:py-0 flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2 z-10 sticky bottom-0">
          {/* Left Action: Xem lại câu sai */}
          {wrongCount > 0 ? (
            <button
              type="button"
              onClick={() => {
                setReviewWrongIndex(0);
                setViewMode('review-wrong');
                onActiveExamChange?.(true);
                soundService.playClick();
              }}
              className="py-1.5 sm:py-2 px-2.5 sm:px-4 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white font-black text-[11px] sm:text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 animate-pulse shrink-0"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
              <span>Xem lại {wrongCount} câu sai & Lời giải</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-xl shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Xuất sắc đúng 15/15 câu!</span>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={() => handleStartExam(activeExam)}
              className="py-1.5 sm:py-2 px-2 sm:px-3 bg-purple-100 hover:bg-purple-200 text-purple-900 font-black text-[11px] sm:text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Làm lại đề này</span>
              <span className="md:hidden">Làm lại</span>
            </button>

            <button
              type="button"
              onClick={handleExitExam}
              className="py-1.5 sm:py-2 px-2 sm:px-3 bg-white hover:bg-slate-100 text-slate-700 font-black text-[11px] sm:text-xs rounded-xl border border-slate-300 transition-all cursor-pointer flex items-center gap-1 shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Quay về khu ôn tập</span>
              <span className="md:hidden">Đề khác</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAllQuestionsModal(true);
                soundService.playClick();
              }}
              className="py-1.5 sm:py-2 px-2 sm:px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-[11px] sm:text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
              title="Xem danh sách cả 15 câu hỏi và đáp án chi tiết"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Chi tiết 15 câu</span>
            </button>

            {onFinishReview && (
              <button
                type="button"
                onClick={onFinishReview}
                className="py-1.5 sm:py-2 px-2.5 sm:px-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-[11px] sm:text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>Trang chủ</span>
              </button>
            )}
          </div>
        </div>

        {/* MODAL: CHI TIẾT 15 CÂU HỎI VÀ ĐÁP ÁN (Dành cho Giáo viên & Phụ huynh xem xét) */}
        {showAllQuestionsModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-4xl w-full max-h-[88vh] flex flex-col justify-between shadow-2xl border-2 border-amber-300 animate-scaleIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    CHI TIẾT 15 CÂU HỎI VÀ ĐÁP ÁN ĐỀ THI
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {activeExam.periodTitleVi} · {activeExam.titleVi} · SGK Kết nối tri thức
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllQuestionsModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 py-2.5 shrink-0 bg-slate-50 px-2 rounded-xl text-xs font-black my-2">
                <button
                  type="button"
                  onClick={() => setFilterReview('all')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    filterReview === 'all' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Tất cả (15)
                </button>
                <button
                  type="button"
                  onClick={() => setFilterReview('correct')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    filterReview === 'correct' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Đúng ({correctCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterReview('incorrect')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    filterReview === 'incorrect' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Chưa đúng ({wrongCount})
                </button>
              </div>

              {/* Scrollable Questions list inside Modal */}
              <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
                {activeExam.questions
                  .map((q, idx) => {
                    const userAns = userAnswers[idx];
                    const isCorrect = String(userAns ?? '').trim().toLowerCase() === String(q.answer).trim().toLowerCase();
                    return { q, idx, userAns, isCorrect };
                  })
                  .filter(({ isCorrect }) => {
                    if (filterReview === 'correct') return isCorrect;
                    if (filterReview === 'incorrect') return !isCorrect;
                    return true;
                  })
                  .map(({ q, idx, userAns, isCorrect }) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border-2 transition-all space-y-2 ${
                        isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black text-white ${
                              isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className="text-xs font-extrabold text-slate-700">
                            Câu hỏi {idx + 1}
                          </span>
                          {renderLevelBadge(q.level)}
                        </div>
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded-full ${
                            isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isCorrect ? '✓ Đúng' : '✗ Chưa đúng'}
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm font-black text-slate-900 bg-white p-2.5 rounded-xl border border-slate-200">
                        {q.promptVi}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-white rounded-xl border border-slate-200">
                          <span className="text-slate-500 block text-[10px]">Bé đã chọn:</span>
                          <span className={`font-black ${isCorrect ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {userAns !== undefined && userAns !== null && String(userAns).trim() !== '' ? String(userAns) : '(Chưa chọn)'}
                          </span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-emerald-300">
                          <span className="text-slate-500 block text-[10px]">Đáp án đúng:</span>
                          <span className="font-black text-emerald-700">
                            {String(q.answer)}
                          </span>
                        </div>
                      </div>

                      {q.explanationVi && (
                        <div className="text-[11px] sm:text-xs text-slate-700 bg-white/90 p-2 rounded-xl border border-slate-200 flex items-start gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-purple-900 font-bold">Giải thích:</strong> {q.explanationVi}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAllQuestionsModal(false)}
                  className="py-2 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs rounded-xl cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: EXAM TAKING (Zero-scroll 16:9 layout with 3 zones)
  // -------------------------------------------------------------
  const currentQ = activeExam.questions[qIndex];
  const isSelected = (opt: any) => userAnswers[qIndex] === opt;
  const isLastQuestion = qIndex === activeExam.questions.length - 1;
  const hasVisual = Boolean(currentQ.visualConfig || resolveVisualConfig(currentQ as unknown as Question));

  const getOptionsGrid = (opts?: (string | number)[]) => {
    if (!opts) return 'grid-cols-1';
    const maxLen = Math.max(...opts.map((o) => String(o).length));
    if (opts.length === 4) {
      // 2x2 layout (A B / C D) as requested in Prompt IV
      return 'grid-cols-1 sm:grid-cols-2';
    }
    if (opts.length === 2) {
      return 'grid-cols-1 sm:grid-cols-2';
    }
    if (maxLen > 24) {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
    return 'grid-cols-1 sm:grid-cols-3';
  };

  return (
    <div className="w-full min-h-[100dvh] md:min-h-0 md:aspect-[16/9] md:max-w-[calc((100dvh-0.5rem)*16/9)] md:max-h-[calc(100dvh-0.5rem)] mx-auto flex flex-col justify-between p-1 sm:p-2.5 overflow-y-auto md:overflow-hidden select-none animate-fadeIn">
      {/* 1. THANH TRÊN CÙNG: 10-12% height (~48-52px) */}
      <div className="shrink-0 min-h-[48px] h-auto sm:h-13 bg-white/95 backdrop-blur-xs rounded-2xl border border-amber-200/90 shadow-2xs px-2.5 sm:px-4 py-1.5 sm:py-0 flex items-center justify-between gap-1.5 sm:gap-2 z-10 sticky top-0">
        {/* Left: Thoát đề & Exam Info */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (Object.keys(userAnswers).length === 0) {
                handleExitExam();
              } else {
                if (window.confirm('Bé có chắc muốn thoát bài kiểm tra này không? Kết quả đang làm sẽ không được lưu.')) {
                  handleExitExam();
                }
              }
            }}
            className="text-xs font-black text-slate-700 hover:text-slate-900 min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Thoát</span>
          </button>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-black text-amber-950 truncate max-w-[200px] lg:max-w-xs">
              {activeExam.periodTitleVi} · {activeExam.titleVi}
            </span>
          </div>
        </div>

        {/* Center: Dải 15 câu gọn gàng (palette tuần tự) */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-[55vw] sm:max-w-none px-1 py-0.5">
          {activeExam.questions.map((_, idx) => {
            const isCurrent = idx === qIndex;
            const isAnswered = userAnswers[idx] !== undefined && userAnswers[idx] !== null && String(userAnswers[idx]).trim() !== '';
            const allowed = canNavigateTo(idx);

            return (
              <button
                key={idx}
                type="button"
                disabled={!allowed}
                onClick={() => {
                  if (allowed) {
                    setQIndex(idx);
                    soundService.playClick();
                  }
                }}
                title={
                  !allowed
                    ? `Câu ${idx + 1}: Bé cần hoàn thành các câu trước trước khi xem câu này!`
                    : `Câu ${idx + 1}${isAnswered ? ' (Đã làm)' : ' (Chưa làm)'}`
                }
                className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7.5 md:h-7.5 rounded-lg sm:rounded-xl font-black text-[11px] sm:text-xs transition-all flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? 'bg-amber-500 text-white ring-2 ring-amber-300 scale-105 shadow-xs cursor-pointer'
                    : !allowed
                    ? 'bg-slate-100 text-slate-300 border border-slate-200 opacity-40 cursor-not-allowed'
                    : isAnswered
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-300 hover:bg-indigo-200 cursor-pointer'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 cursor-pointer'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Right: Số câu hiện tại & Level */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="hidden lg:block">{renderLevelBadge(currentQ.level)}</div>
          <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
            Câu {qIndex + 1} / 15
          </span>
        </div>
      </div>

      {/* 2. KHUNG VÀNG CHÍNH GIỮA: 72-78% height */}
      <div className="flex-1 md:min-h-0 my-1 sm:my-1.5 bg-[#FFFDF0] border-2 border-amber-300 rounded-2xl md:rounded-3xl shadow-sm p-3 sm:p-4 flex flex-col justify-between overflow-y-auto md:overflow-hidden">
        {!hasVisual ? (
          /* BỐ CỤC KHÔNG CÓ HÌNH MINH HỌA (DẠNG 1): Gom câu hỏi và đáp án lại gần nhau, căn giữa trung tâm */
          <div className="flex-1 min-h-0 flex flex-col justify-center items-center max-w-3xl w-full mx-auto px-2 sm:px-4 py-1">
            {/* Hộp câu hỏi trung tâm */}
            <div className="w-full bg-amber-100/60 p-3 sm:p-4.5 rounded-2xl md:rounded-3xl border border-amber-200/90 text-center space-y-1.5 shadow-2xs mb-3 sm:mb-4">
              <div className="inline-block px-3 py-0.5 rounded-full bg-amber-200/90 text-amber-900 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                CÂU HỎI TRỌNG TÂM
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-black text-amber-950 font-heading leading-snug max-w-2xl mx-auto">
                {currentQ.promptVi}
              </h2>
              {currentQ.promptEn && (
                <div className="flex items-center justify-center gap-2 pt-0.5">
                  <p className="text-xs sm:text-sm font-semibold text-amber-800/80 italic">
                    {currentQ.promptEn}
                  </p>
                  <button
                    type="button"
                    onClick={() => soundService.speak(currentQ.promptEn!, 'en', { rate: 0.88 })}
                    className="w-7 h-7 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
                    title="Nghe câu hỏi tiếng Anh"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Các phương án trả lời đặt sát dưới câu hỏi, không để khoảng trống rỗng */}
            {currentQ.options && (
              <div className={`w-full max-w-2xl grid ${getOptionsGrid(currentQ.options)} gap-2.5 sm:gap-3`}>
                {currentQ.options.map((opt, i) => {
                  const active = isSelected(opt);
                  const optLabels = ['A', 'B', 'C', 'D'];
                  const label = optLabels[i] || String(i + 1);

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`relative min-h-[48px] sm:min-h-[52px] p-3 sm:p-4 rounded-2xl border-2 font-black transition-all cursor-pointer text-left flex items-center gap-3 active:scale-[0.98] ${
                        active
                          ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300 shadow-md scale-[1.01]'
                          : 'bg-white hover:bg-amber-50/80 border-amber-200/90 text-slate-800 shadow-2xs'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs sm:text-sm font-black shrink-0 transition-colors ${
                          active
                            ? 'bg-white text-amber-700'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {label}
                      </span>
                      <span className="text-sm sm:text-base md:text-lg font-bold flex-1 leading-snug">
                        {opt}
                      </span>
                      {active && (
                        <Check className="w-5 h-5 text-white shrink-0 animate-scaleIn" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* BỐ CỤC CÓ HÌNH MINH HỌA: 3 Tầng cân đối */
          <>
            {/* PHẦN TRÊN: Câu hỏi tiếng Việt + Tiếng Anh + Loa */}
            <div className="shrink-0 space-y-1 bg-amber-100/50 p-2.5 sm:p-3 rounded-2xl border border-amber-200/80">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg md:text-xl font-black text-amber-950 font-heading leading-snug">
                    {currentQ.promptVi}
                  </h2>
                  {currentQ.promptEn && (
                    <p className="text-xs sm:text-sm font-semibold text-amber-800/80 italic leading-tight">
                      {currentQ.promptEn}
                    </p>
                  )}
                </div>

                {currentQ.promptEn && (
                  <button
                    type="button"
                    onClick={() => soundService.speak(currentQ.promptEn!, 'en', { rate: 0.88 })}
                    className="w-8 h-8 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-900 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
                    title="Nghe câu hỏi tiếng Anh"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* PHẦN GIỮA: Hình ảnh minh họa chuẩn xác, tự co giãn cân đối */}
            <div className="flex-1 min-h-0 my-1.5 sm:my-2 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full max-h-[170px] sm:max-h-[200px] md:max-h-[230px] bg-white/90 rounded-2xl border border-amber-200/80 p-1.5 sm:p-2 flex items-center justify-center overflow-hidden shadow-2xs">
                <MathQuestionVisual question={currentQ as unknown as Question} />
              </div>
            </div>

            {/* PHẦN DƯỚI: Các phương án trả lời */}
            {currentQ.options && (
              <div className={`shrink-0 grid ${getOptionsGrid(currentQ.options)} gap-2 sm:gap-3`}>
                {currentQ.options.map((opt, i) => {
                  const active = isSelected(opt);
                  const optLabels = ['A', 'B', 'C', 'D'];
                  const label = optLabels[i] || String(i + 1);

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`relative min-h-[44px] sm:min-h-[48px] p-2.5 sm:p-3 md:p-3.5 rounded-2xl border-2 font-black transition-all cursor-pointer text-left flex items-center gap-2.5 sm:gap-3 active:scale-[0.98] ${
                        active
                          ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300 shadow-md scale-[1.01]'
                          : 'bg-white hover:bg-amber-50/80 border-amber-200/90 text-slate-800 shadow-2xs'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs sm:text-sm font-black shrink-0 transition-colors ${
                          active
                            ? 'bg-white text-amber-700'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {label}
                      </span>
                      <span className="text-sm sm:text-base md:text-lg font-bold flex-1 leading-snug">
                        {opt}
                      </span>
                      {active && (
                        <Check className="w-5 h-5 text-white shrink-0 animate-scaleIn" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* 3. THANH ĐIỀU KHIỂN PHÍA DƯỚI: 10-12% height (~50-56px) - LUÔN LUÔN HIỂN THỊ */}
      <div className="shrink-0 min-h-[52px] h-auto sm:h-14 bg-white/95 backdrop-blur-xs rounded-2xl border border-amber-200/90 shadow-2xs px-3 sm:px-4 py-2 sm:py-0 flex items-center justify-between gap-2 z-10 sticky bottom-0">
        {/* Nút CÂU TRƯỚC */}
        <button
          type="button"
          onClick={() => {
            setQIndex(Math.max(0, qIndex - 1));
            soundService.playClick();
          }}
          disabled={qIndex === 0}
          className="min-h-[42px] py-2 px-3 sm:px-4 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 transition-all shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Câu trước</span>
        </button>

        {/* Trạng thái tiến độ */}
        <div className="text-xs font-bold text-slate-600 text-center">
          Đã làm: <strong className="text-slate-800 font-black">{answeredCount}</strong> / 15 câu
          {!isCurrentAnswered && (
            <span className="hidden sm:inline text-amber-700 font-extrabold ml-1.5">
              (Chọn đáp án để mở Câu tiếp theo)
            </span>
          )}
        </div>

        {/* Nút CÂU TIẾP THEO hoặc NỘP BÀI THI - LUÔN HIỂN THỊ */}
        {!isLastQuestion ? (
          <button
            type="button"
            disabled={!isCurrentAnswered}
            onClick={() => {
              if (isCurrentAnswered) {
                setQIndex(qIndex + 1);
                soundService.playClick();
              }
            }}
            className={`min-h-[42px] py-2 px-4 sm:px-6 font-black text-xs md:text-sm rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 ${
              isCurrentAnswered
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white cursor-pointer active:scale-95 shadow-md'
                : 'bg-slate-200 text-slate-400 border border-slate-300 opacity-60 cursor-not-allowed'
            }`}
          >
            <span>Câu tiếp theo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            disabled={!isCurrentAnswered}
            onClick={handleRequestSubmit}
            className={`min-h-[42px] py-2 px-5 sm:px-7 font-black text-xs sm:text-sm md:text-base rounded-xl sm:rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0 ${
              isCurrentAnswered
                ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white cursor-pointer active:scale-95 animate-pulse'
                : 'bg-slate-200 text-slate-400 border border-slate-300 opacity-60 cursor-not-allowed'
            }`}
          >
            <FileCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>NỘP BÀI THI</span>
          </button>
        )}
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border-2 border-amber-300 space-y-4 text-center animate-scaleIn">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
              unansweredIndices.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {unansweredIndices.length > 0 ? (
                <AlertTriangle className="w-8 h-8" />
              ) : (
                <FileCheck className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900">
                {unansweredIndices.length > 0
                  ? `Bé còn ${unansweredIndices.length} câu chưa làm!`
                  : 'Bé đã hoàn thành đủ 15 câu!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {unansweredIndices.length > 0 ? (
                  <>
                    Bé chưa chọn đáp án cho:{' '}
                    <strong className="text-amber-800">
                      {unansweredIndices.map((i) => `Câu ${i + 1}`).join(', ')}
                    </strong>
                    . Bé có chắc chắn muốn nộp bài để xem điểm số không?
                  </>
                ) : (
                  'Bé có chắc chắn muốn nộp bài thi ngay bây giờ để nhận điểm số và sao thưởng không?'
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSubmitConfirm(false);
                  if (unansweredIndices.length > 0) {
                    setQIndex(unansweredIndices[0]);
                  }
                  soundService.playClick();
                }}
                className="w-full sm:w-auto py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
              >
                {unansweredIndices.length > 0 ? 'Làm tiếp các câu còn lại' : 'Kiểm tra lại bài'}
              </button>

              <button
                type="button"
                onClick={executeSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto py-2.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md hover:from-emerald-600 hover:to-teal-700 transition-all cursor-pointer"
              >
                {isSubmitting ? 'Đang chấm điểm...' : 'Xác nhận Nộp bài & Chấm điểm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


