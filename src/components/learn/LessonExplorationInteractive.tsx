/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Lesson, LanguageMode } from '../../types';
import { LESSON_EXPLORATIONS } from '../../data/explorationData';
import { soundService } from '../../services/audioService';
import { RobotMathChibi } from '../chibi/RobotMathChibi';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Award,
  Layers,
  HelpCircle,
  Clock,
  Ruler,
  Calendar,
  Grid
} from 'lucide-react';
import { Interactive2DShape, ShapeCategory } from '../common/Interactive2DShape';
import { Interactive3DSolid } from '../common/Interactive3DSolid';
import { InteractiveSpatialPlay } from '../common/InteractiveSpatialPlay';
import { InteractiveAdditionExploration } from '../common/InteractiveAdditionExploration';

interface LessonExplorationInteractiveProps {
  lesson: Lesson;
  langMode: LanguageMode;
  onCompleteStep: () => void;
}

export const LessonExplorationInteractive: React.FC<LessonExplorationInteractiveProps> = ({
  lesson,
  langMode,
  onCompleteStep,
}) => {
  const config = LESSON_EXPLORATIONS[lesson.id] || LESSON_EXPLORATIONS[1];

  // Internal states for interactive manipulations
  const [hasOperated, setHasOperated] = useState(false);
  const [activeTabSubstep, setActiveTabSubstep] = useState<1 | 2 | 3 | 4>(1);

  // Manipulative states for each type
  const [counterCount, setCounterCount] = useState<number>(
    config.explorationType === 'counting' ? 1 : 0
  );
  const [pairedItems, setPairedItems] = useState<number[]>([]);
  const [selectedCompareSymbol, setSelectedCompareSymbol] = useState<string | null>(null);
  const [splitBasketA, setSplitBasketA] = useState<number>(3);
  const [splitBasketB, setSplitBasketB] = useState<number>(2);
  const [additionAdded, setAdditionAdded] = useState(false);
  const [subtractionRemoved, setSubtractionRemoved] = useState(false);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [tangramPlaced, setTangramPlaced] = useState<{ roof: boolean; body: boolean }>({
    roof: false,
    body: false,
  });
  const [solidAction, setSolidAction] = useState<string | null>(null);
  const [spatialChoice, setSpatialChoice] = useState<string | null>(null);
  const [tensCount, setTensCount] = useState<number>(config.illustrationData?.tens || 1);
  const [onesCount, setOnesCount] = useState<number>(config.illustrationData?.ones || 4);
  const [rulerPositionCm, setRulerPositionCm] = useState<number>(
    config.illustrationData?.objectLengthCm || 7
  );
  const [clockHour, setClockHour] = useState<number>(config.illustrationData?.targetHour || 8);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [selectedChartNum, setSelectedChartNum] = useState<number | null>(null);

  // Audio status
  const [isSpeakingEn, setIsSpeakingEn] = useState(false);

  // Reset when lesson changes
  useEffect(() => {
    handleReset();
  }, [lesson.id]);

  const handleReset = () => {
    soundService.cancelSpeech();
    setHasOperated(false);
    setActiveTabSubstep(1);
    setCounterCount(config.explorationType === 'counting' ? 1 : 0);
    setPairedItems([]);
    setSelectedCompareSymbol(null);
    setSplitBasketA(3);
    setSplitBasketB(2);
    setAdditionAdded(false);
    setSubtractionRemoved(false);
    setSelectedShape(null);
    setTangramPlaced({ roof: false, body: false });
    setSolidAction(null);
    setSpatialChoice(null);
    setTensCount(config.illustrationData?.tens || 1);
    setOnesCount(config.illustrationData?.ones || 4);
    setRulerPositionCm(config.illustrationData?.objectLengthCm || 7);
    setClockHour(config.illustrationData?.targetHour || 8);
    setSelectedDayIndex(null);
    setSelectedChartNum(null);
    setIsSpeakingEn(false);
  };

  const triggerDiscovery = () => {
    if (!hasOperated) {
      setHasOperated(true);
      setActiveTabSubstep(4);
      soundService.praiseVictory(langMode);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handlePlayEnQuestion = (slow: boolean = false) => {
    soundService.cancelSpeech();
    setIsSpeakingEn(true);
    soundService.speak(config.guidingQuestionsEn, 'en', {
      slow,
      rate: slow ? 0.72 : 0.88,
      onEnd: () => setIsSpeakingEn(false),
    });
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col justify-between overflow-hidden min-h-[560px] h-[calc(100vh-11rem)] max-h-[820px]">
      {/* Textbook Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3 shrink-0">
        <div className="space-y-0.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              SGK Toán 1 (Tập {config.textbookVolume}) · Trang {config.textbookPage}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ✓ Chuẩn Kết nối tri thức
            </span>
          </div>

          <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900 font-heading truncate">
            {lesson.title}
          </h3>
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">
            {config.learningObjective}
          </p>
        </div>

        {/* 4 Interactive Steps Progress Indicator */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTabSubstep(1)}
            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTabSubstep === 1 ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Quan sát
          </button>
          <button
            onClick={() => setActiveTabSubstep(2)}
            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTabSubstep === 2 ? 'bg-indigo-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Suy nghĩ
          </button>
          <button
            onClick={() => setActiveTabSubstep(3)}
            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTabSubstep === 3 ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Thao tác
          </button>
          <button
            onClick={() => {
              if (hasOperated) setActiveTabSubstep(4);
            }}
            disabled={!hasOperated}
            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTabSubstep === 4
                ? 'bg-emerald-500 text-white shadow-xs'
                : hasOperated
                ? 'text-emerald-700 hover:bg-emerald-50'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            4. Phát hiện
          </button>
        </div>
      </div>

      {/* =========================================================================
          BƯỚC 1: QUAN SÁT (Robot giới thiệu tình huống thực tế bám sát SGK)
          ========================================================================= */}
      {activeTabSubstep === 1 && (
        <div className="flex-1 min-h-0 flex flex-col justify-center items-center p-4 bg-gradient-to-r from-sky-50 via-indigo-50 to-blue-50 border-2 border-sky-200 rounded-3xl shadow-xs text-center space-y-4 my-auto">
          <RobotMathChibi expression="happy" size="lg" className="animate-float" />
          <div className="max-w-xl space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-black uppercase text-sky-800 bg-sky-100 px-3 py-1 rounded-full">
                Bước 1: Robot Nhí Giới Thiệu
              </span>
            </div>
            <p className="text-base sm:text-xl font-extrabold text-slate-800 leading-snug">
              “{config.robotIntroductionVi}”
            </p>
            <div className="text-xs sm:text-sm text-slate-600 italic bg-white/80 p-2.5 rounded-2xl border border-sky-200">
              Tình huống thực tế SGK: {config.sceneDescription}
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTabSubstep(2);
              soundService.playClick();
            }}
            className="py-3 px-8 bg-sky-500 hover:bg-sky-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-md cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <span>Sang Bước 2: Suy nghĩ</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* =========================================================================
          BƯỚC 2: SUY NGHĨ (Câu hỏi gợi mở song ngữ Việt - Anh có nút loa en-US)
          ========================================================================= */}
      {activeTabSubstep === 2 && (
        <div className="flex-1 min-h-0 flex flex-col justify-center items-center p-5 bg-white rounded-3xl border-2 border-indigo-200 shadow-xs space-y-4 my-auto text-center">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Bước 2: Câu Hỏi Gợi Mở (Bilingual Inquiry)
          </span>

          <div className="max-w-2xl space-y-3">
            {/* Vietnamese Question */}
            <div className="flex items-center justify-center">
              <h4 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 font-heading leading-snug">
                ❓ {config.guidingQuestionsVi}
              </h4>
            </div>

            {/* English Question with Speaker and Slow Mode */}
            {langMode !== 'vi' && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500">
                    English Question:
                  </span>
                  <p className="text-sm sm:text-base font-bold text-indigo-950">
                    {config.guidingQuestionsEn}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handlePlayEnQuestion(false)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer active:scale-95"
                    title="Nghe tiếng Anh chuẩn en-US"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>🔊 Nghe</span>
                  </button>
                  <button
                    onClick={() => handlePlayEnQuestion(true)}
                    className="px-2.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs cursor-pointer active:scale-95"
                    title="Nghe chậm 0.72x"
                  >
                    <span>🐢 Chậm</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setActiveTabSubstep(3);
              soundService.playClick();
            }}
            className="py-3 px-8 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-md cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <span>Bắt đầu Thao tác thực tế</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* =========================================================================
          BƯỚC 3: THAO TÁC TRỰC QUAN (Tùy biến theo từng loại bài học)
          ========================================================================= */}
      {activeTabSubstep === 3 && (
        <div className="flex-1 min-h-0 rounded-3xl border-2 border-amber-300 bg-amber-50/40 p-3 sm:p-5 flex flex-col justify-between overflow-y-auto sm:overflow-hidden">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                Bước 3: Bé Trực Tiếp Thao Tác
              </span>
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                (Thực hành để tự phát hiện quy luật)
              </span>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 cursor-pointer shadow-xs active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại</span>
            </button>
          </div>

          <div className="flex-1 min-h-0 flex items-center justify-center p-2 my-auto w-full">

        {/* ---------------------------------------------------------------------
            SUB-SANDBOX 1: ĐẾM SỐ LƯỢNG (Bài 1, Bài 2, Bài 17...)
            --------------------------------------------------------------------- */}
        {config.interactionType === 'tap_count' && (
          <div className="space-y-4 text-center py-2">
            <p className="text-xs md:text-sm font-bold text-slate-700">
              Chạm vào các ô để tăng dần số lượng đối tượng từ bé đến lớn:
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {Array.from({ length: counterCount }).map((_, i) => (
                <div
                  key={i}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white border-2 border-sky-400 shadow-md flex flex-col items-center justify-center text-2xl animate-scale-in"
                >
                  <span>{config.illustrationData?.itemEmoji || (i % 2 === 0 ? '🐠' : '🕊️')}</span>
                  <span className="text-[10px] font-black text-sky-800">{i + 1}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  const next = Math.max(0, counterCount - 1);
                  setCounterCount(next);
                  soundService.playClick();
                }}
                disabled={counterCount <= 0}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-black text-sm text-slate-700 cursor-pointer disabled:opacity-50"
              >
                - Bớt 1
              </button>
              <div className="text-xl md:text-2xl font-black text-sky-950 bg-white px-5 py-2 rounded-2xl border-2 border-sky-300 shadow-xs">
                Số lượng: <strong className="text-sky-600">{counterCount}</strong>
              </div>
              <button
                onClick={() => {
                  const max = config.illustrationData?.maxCount || config.illustrationData?.max || 10;
                  const next = Math.min(max, counterCount + 1);
                  setCounterCount(next);
                  soundService.playClick();
                  if (next >= (config.correctResult || 5)) {
                    triggerDiscovery();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 font-black text-sm text-white cursor-pointer shadow-xs"
              >
                + Thêm 1
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------------
            SUB-SANDBOX 2: GHÉP ĐÔI 1 - 1 (Nhiều hơn, ít hơn, bằng nhau - Bài 3)
            --------------------------------------------------------------------- */}
        {config.interactionType === 'pair_matching' && (
          <div className="space-y-4 py-2">
            <p className="text-xs md:text-sm font-bold text-slate-700 text-center">
              Chạm vào chú thỏ để ghép đôi với một củ cà rốt tương ứng:
            </p>

            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
              {[0, 1, 2, 3].map((idx) => {
                const isPaired = pairedItems.includes(idx);
                const hasCarrot = idx < 3;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!isPaired) {
                        const next = [...pairedItems, idx];
                        setPairedItems(next);
                        soundService.playPop();
                        if (next.length >= 3) {
                          triggerDiscovery();
                        }
                      }
                    }}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isPaired
                        ? 'bg-emerald-50 border-emerald-400 scale-105'
                        : 'bg-white border-slate-300 hover:border-amber-400'
                    }`}
                  >
                    <span className="text-3xl">🐰</span>
                    <span className="text-xs font-bold text-slate-600">Thỏ {idx + 1}</span>
                    <div className="w-full border-t border-dashed border-slate-300 my-1" />
                    {hasCarrot ? (
                      <span className="text-2xl">🥕</span>
                    ) : (
                      <span className="text-xs font-black text-rose-500 bg-rose-50 px-1 rounded">
                        Thiếu
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                Đã ghép: {pairedItems.length} cặp · Có 1 chú thỏ chưa có cà rốt!
              </span>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------------
            SUB-SANDBOX 3: SO SÁNH SỐ >, <, = (Bài 4, Bài 22)
            --------------------------------------------------------------------- */}
        {config.interactionType === 'number_compare' && (
          <div className="space-y-4 py-2 text-center">
            <p className="text-xs md:text-sm font-bold text-slate-700">
              Chọn dấu thích hợp để so sánh hai số:
            </p>

            <div className="flex items-center justify-center gap-4 text-3xl md:text-5xl font-black">
              <div className="p-4 md:p-6 bg-white rounded-2xl border-2 border-indigo-300 text-indigo-900 shadow-xs">
                {config.illustrationData?.numA || 4}
              </div>

              <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-100 rounded-2xl border-2 border-amber-400 flex items-center justify-center text-amber-950 font-black">
                {selectedCompareSymbol || '?'}
              </div>

              <div className="p-4 md:p-6 bg-white rounded-2xl border-2 border-indigo-300 text-indigo-900 shadow-xs">
                {config.illustrationData?.numB || 2}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              {['>', '<', '='].map((sym) => (
                <button
                  key={sym}
                  onClick={() => {
                    setSelectedCompareSymbol(sym);
                    soundService.playClick();
                    if (sym === config.correctResult) {
                      triggerDiscovery();
                    } else {
                      soundService.encourageWrong(langMode);
                    }
                  }}
                  className={`w-14 h-14 rounded-2xl text-2xl font-black border-2 transition-all cursor-pointer ${
                    selectedCompareSymbol === sym
                      ? 'bg-amber-500 text-white border-amber-600 scale-110 shadow-md'
                      : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-300'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------------
            SUB-SANDBOX 4: TÁCH - GỘP SỐ (Mấy và mấy - Bài 5)
            --------------------------------------------------------------------- */}
        {config.interactionType === 'drag_split_merge' && (
          <div className="space-y-4 py-2 text-center">
            <p className="text-xs md:text-sm font-bold text-slate-700">
              Chuyển hạt dẻ qua lại giữa 2 giỏ để khám phá cách tách 5:
            </p>

            <div className="flex items-center justify-center gap-6">
              {/* Giỏ 1 */}
              <div className="p-4 bg-white rounded-3xl border-2 border-amber-300 space-y-2 min-w-[130px]">
                <span className="text-xs font-black text-amber-800">Giỏ Trái</span>
                <div className="flex flex-wrap justify-center gap-1.5 min-h-[40px]">
                  {Array.from({ length: splitBasketA }).map((_, i) => (
                    <span key={i} className="text-2xl">🌰</span>
                  ))}
                </div>
                <div className="text-lg font-black text-amber-900">{splitBasketA}</div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (splitBasketA > 1) {
                      setSplitBasketA((a) => a - 1);
                      setSplitBasketB((b) => b + 1);
                      soundService.playClick();
                      triggerDiscovery();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-white font-black text-xs cursor-pointer shadow-xs"
                >
                  Chuyển sang phải ➡️
                </button>
                <button
                  onClick={() => {
                    if (splitBasketB > 1) {
                      setSplitBasketB((b) => b - 1);
                      setSplitBasketA((a) => a + 1);
                      soundService.playClick();
                      triggerDiscovery();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-white font-black text-xs cursor-pointer shadow-xs"
                >
                  ⬅️ Chuyển sang trái
                </button>
              </div>

              {/* Giỏ 2 */}
              <div className="p-4 bg-white rounded-3xl border-2 border-amber-300 space-y-2 min-w-[130px]">
                <span className="text-xs font-black text-amber-800">Giỏ Phải</span>
                <div className="flex flex-wrap justify-center gap-1.5 min-h-[40px]">
                  {Array.from({ length: splitBasketB }).map((_, i) => (
                    <span key={i} className="text-2xl">🌰</span>
                  ))}
                </div>
                <div className="text-lg font-black text-amber-900">{splitBasketB}</div>
              </div>
            </div>

            <div className="text-sm font-black text-amber-950 bg-white p-2.5 rounded-2xl border border-amber-300 inline-block">
              5 gồm {splitBasketA} và {splitBasketB} (Gộp {splitBasketA} và {splitBasketB} được 5)
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------------
            SUB-SANDBOX 5: PHÉP CỘNG (HAI NHÓM ĐỐI TƯỢNG KHÁC NHAU, HỌC SINH TỰ ĐẾM)
            --------------------------------------------------------------------- */}
        {(config.interactionType === 'add_combine' || config.explorationType === 'addition') && (
          <div className="w-full h-full py-1">
            <InteractiveAdditionExploration
              onCompleteStep={onCompleteStep}
              langMode={langMode}
            />
          </div>
        )}

        {/* ---------------------------------------------------------------------
            SUB-SANDBOX 6: PHÉP TRỪ (BỚT ĐI / CÒN LẠI - Bài 11, 31, 32...)
            --------------------------------------------------------------------- */}
        {config.interactionType === 'remove_subtract' && (
          <div className="space-y-4 py-2 text-center">
            <p className="text-xs md:text-sm font-bold text-slate-700">
              Bấm nút để bớt đi quả táo và xem phép tính trừ:
            </p>

            <div className="flex items-center justify-center gap-4 text-4xl">
              <div className="p-4 bg-white rounded-2xl border border-rose-300 flex items-center gap-2">
                <span>🍎🍎🍎</span>
                {subtractionRemoved ? (
                  <span className="text-xs font-bold text-slate-400 line-through">🍎🍎</span>
                ) : (
                  <span>🍎🍎</span>
                )}
                <span className="text-sm font-black text-rose-800">
                  {subtractionRemoved ? 'Còn lại 3 quả' : 'Có 5 quả táo'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              {!subtractionRemoved ? (
                <button
                  onClick={() => {
                    setSubtractionRemoved(true);
                    soundService.playPop();
                    triggerDiscovery();
                  }}
                  className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-base shadow-md cursor-pointer active:scale-95"
                >
                  ➖ Rụng bớt đi 2 quả táo!
                </button>
              ) : (
                <div className="text-2xl md:text-3xl font-black text-rose-900 bg-white px-6 py-2.5 rounded-2xl border-2 border-rose-300 inline-block shadow-xs">
                  Phép tính: 5 - 2 = 3
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------------
            SUB-SANDBOX 7: HÌNH HỌC PHẲNG & ĐỒ VẬT (Bài 7, 9, 19, 40...)
            --------------------------------------------------------------------- */}
        {(config.interactionType === 'pick_2d_shape' || config.explorationType === '2d_shapes') && (
          <div className="space-y-4 py-2">
            <Interactive2DShape
              initialShape={(selectedShape as ShapeCategory) || 'square'}
              onShapeSelect={(shape) => {
                setSelectedShape(shape);
                triggerDiscovery();
              }}
            />
          </div>
        )}

        {/* ---------------------------------------------------------------------
            SUB-SANDBOX 8: LẮP GHÉP TANGRAM (Bài 8)
            --------------------------------------------------------------------- */}
        {config.interactionType === 'tangram_assembly' && (
          <div className="space-y-4 py-2 text-center">
            <p className="text-xs md:text-sm font-bold text-slate-700">
              Chọn mảnh tam giác và mảnh vuông để hoàn thành ngôi nhà:
            </p>

            <div className="flex flex-col items-center justify-center gap-1">
              {/* Mái nhà */}
              <div
                onClick={() => {
                  setTangramPlaced((prev) => {
                    const next = { ...prev, roof: true };
                    if (next.roof && next.body) triggerDiscovery();
                    return next;
                  });
                  soundService.playPop();
                }}
                className={`w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[60px] cursor-pointer transition-all ${
                  tangramPlaced.roof
                    ? 'border-b-rose-500 scale-105'
                    : 'border-b-slate-300 hover:border-b-rose-300'
                }`}
                title="Bấm để đặt mái nhà hình tam giác"
              />
              {/* Thân nhà */}
              <div
                onClick={() => {
                  setTangramPlaced((prev) => {
                    const next = { ...prev, body: true };
                    if (next.roof && next.body) triggerDiscovery();
                    return next;
                  });
                  soundService.playPop();
                }}
                className={`w-28 h-28 rounded-lg cursor-pointer transition-all flex items-center justify-center font-black text-xs ${
                  tangramPlaced.body
                    ? 'bg-amber-400 text-amber-950 scale-105 shadow-md'
                    : 'bg-slate-200 hover:bg-amber-200 text-slate-500 border border-slate-300'
                }`}
              >
                {tangramPlaced.body ? 'Thân nhà (Hình vuông)' : 'Chạm đặt hình vuông'}
              </div>
            </div>

            <div className="text-xs font-bold text-slate-600">
              {tangramPlaced.roof && tangramPlaced.body
                ? '🎉 Đã hoàn thành ngôi nhà xinh xắn!'
                : 'Chạm vào vị trí mái (tam giác) và thân (hình vuông) để ghép!'}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------------
            SUB-SANDBOX 9: KHỐI LẬP PHƯƠNG & KHỐI HỘP CHỮ NHẬT (Bài 14, 16, 19, 40...)
            --------------------------------------------------------------------- */}
        {(config.interactionType === 'inspect_3d_solids' || config.explorationType === '3d_shapes') && (
          <div className="space-y-5 py-2">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSolidAction('cube');
                  soundService.playClick();
                  triggerDiscovery();
                }}
                className={`px-5 py-2.5 rounded-2xl font-black text-xs md:text-sm transition-all cursor-pointer flex items-center gap-2 border-2 ${
                  solidAction !== 'cuboid'
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-indigo-50'
                }`}
              >
                <span className="text-xl">🎲</span>
                <span>Khối Lập Phương (Cube)</span>
              </button>

              <button
                onClick={() => {
                  setSolidAction('cuboid');
                  soundService.playClick();
                  triggerDiscovery();
                }}
                className={`px-5 py-2.5 rounded-2xl font-black text-xs md:text-sm transition-all cursor-pointer flex items-center gap-2 border-2 ${
                  solidAction === 'cuboid'
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-indigo-50'
                }`}
              >
                <span className="text-xl">🧃</span>
                <span>Khối Hộp Chữ Nhật (Cuboid)</span>
              </button>
            </div>

            <Interactive3DSolid
              solidType={solidAction === 'cuboid' ? 'cuboid' : 'cube'}
              onFaceInspect={() => {
                soundService.playPop();
                triggerDiscovery();
              }}
            />
          </div>
        )}

        {/* ---------------------------------------------------------------------
            SUB-SANDBOX 10: ĐỊNH HƯỚNG KHÔNG GIAN (Bài 15, 16)
            --------------------------------------------------------------------- */}
        {(config.interactionType === 'spatial_grid_placement' || config.explorationType === 'spatial_orientation') && (
          <div className="space-y-4 py-2">
            <InteractiveSpatialPlay onSuccess={triggerDiscovery} />
          </div>
        )}

        {/* ---------------------------------------------------------------------
            SUB-SANDBOX 11: SỐ CÓ HAI CHỮ SỐ & BÓ QUE TÍNH (Bài 21, 24...)
            --------------------------------------------------------------------- */}
        {config.interactionType === 'tens_ones_bundle' && (
          <div className="space-y-4 py-2 text-center">
            <p className="text-xs md:text-sm font-bold text-slate-700">
              Thêm bớt bó chục và que tính rời để khám phá số có hai chữ số:
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {/* Hàng chục */}
              <div className="p-4 bg-white rounded-3xl border-2 border-indigo-200 space-y-2">
                <span className="text-xs font-black text-indigo-700 uppercase">Hàng Chục</span>
                <div className="flex flex-wrap items-center justify-center gap-2 min-h-[44px]">
                  {Array.from({ length: tensCount }).map((_, i) => (
                    <div
                      key={i}
                      className="px-2 py-1 bg-amber-100 border border-amber-400 rounded-md text-xs font-black text-amber-900"
                    >
                      Bó 10 🪵
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setTensCount((t) => Math.max(1, t - 1));
                      soundService.playClick();
                      triggerDiscovery();
                    }}
                    className="w-7 h-7 rounded-lg bg-slate-200 font-black text-xs cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-lg font-black text-indigo-900">{tensCount} chục</span>
                  <button
                    onClick={() => {
                      setTensCount((t) => Math.min(9, t + 1));
                      soundService.playClick();
                      triggerDiscovery();
                    }}
                    className="w-7 h-7 rounded-lg bg-indigo-500 text-white font-black text-xs cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Hàng đơn vị */}
              <div className="p-4 bg-white rounded-3xl border-2 border-emerald-200 space-y-2">
                <span className="text-xs font-black text-emerald-700 uppercase">Hàng Đơn Vị</span>
                <div className="flex flex-wrap items-center justify-center gap-1.5 min-h-[44px]">
                  {Array.from({ length: onesCount }).map((_, i) => (
                    <span key={i} className="text-base">🥢</span>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setOnesCount((o) => Math.max(0, o - 1));
                      soundService.playClick();
                      triggerDiscovery();
                    }}
                    className="w-7 h-7 rounded-lg bg-slate-200 font-black text-xs cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-lg font-black text-emerald-900">{onesCount} que</span>
                  <button
                    onClick={() => {
                      setOnesCount((o) => Math.min(9, o + 1));
                      soundService.playClick();
                      triggerDiscovery();
                    }}
                    className="w-7 h-7 rounded-lg bg-emerald-500 text-white font-black text-xs cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="text-2xl md:text-3xl font-black text-indigo-950 bg-white px-6 py-2 rounded-2xl border-2 border-indigo-300 inline-block">
              Số tạo thành: <strong className="text-indigo-600">{tensCount * 10 + onesCount}</strong> ({tensCount} chục và {onesCount} đơn vị)
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------------
            SUB-SANDBOX 12: ĐO ĐỘ DÀI BẰNG THƯỚC CM (Bài 26, 27, 28, 40)
            --------------------------------------------------------------------- */}
        {(config.interactionType === 'ruler_measure_slider' ||
          config.interactionType === 'compare_length_bars') && (
          <div className="space-y-4 py-2 text-center">
            <p className="text-xs md:text-sm font-bold text-slate-700">
              Đặt đầu vật trùng vạch 0 cm, đọc số đo ở đầu còn lại:
            </p>

            <div className="p-4 bg-white rounded-3xl border-2 border-cyan-300 max-w-md mx-auto space-y-3">
              {/* Vật cần đo: Bút sáp */}
              <div className="flex items-center justify-start pl-2">
                <div
                  className="h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-sm flex items-center justify-end pr-2 text-white font-bold text-xs transition-all"
                  style={{ width: `${rulerPositionCm * 32}px` }}
                >
                  ✏️ {config.illustrationData?.objectName || 'Bút sáp'}
                </div>
              </div>

              {/* Thước kẻ có vạch số 0..10 cm */}
              <div className="relative w-full h-12 bg-amber-100 rounded-xl border border-amber-400 flex items-end justify-between px-2 pb-1 font-mono text-[11px] font-black text-amber-900 select-none">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <div key={num} className="flex flex-col items-center">
                    <div className="w-0.5 h-3 bg-amber-800" />
                    <span>{num}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <span className="text-xs font-bold text-slate-600">Điều chỉnh độ dài:</span>
              <button
                onClick={() => {
                  setRulerPositionCm((c) => Math.max(1, c - 1));
                  soundService.playClick();
                }}
                className="w-8 h-8 rounded-xl bg-slate-200 font-bold text-sm cursor-pointer"
              >
                -
              </button>
              <div className="text-xl font-black text-cyan-900 bg-white px-4 py-1.5 rounded-xl border border-cyan-300">
                {rulerPositionCm} cm
              </div>
              <button
                onClick={() => {
                  setRulerPositionCm((c) => Math.min(10, c + 1));
                  soundService.playClick();
                  triggerDiscovery();
                }}
                className="w-8 h-8 rounded-xl bg-cyan-500 text-white font-bold text-sm cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------------
            SUB-SANDBOX 13: XEM GIỜ ĐÚNG TRÊN ĐỒNG HỒ (Bài 34, 37)
            --------------------------------------------------------------------- */}
        {config.interactionType === 'interactive_clock' && (
          <div className="space-y-4 py-2 text-center">
            <p className="text-xs md:text-sm font-bold text-slate-700">
              Kim dài chỉ số 12. Bấm chọn số để kim ngắn chỉ giờ đúng:
            </p>

            <div className="relative w-44 h-44 mx-auto rounded-full bg-white border-4 border-purple-500 shadow-md flex items-center justify-center select-none">
              {/* Clock Numbers 1 to 12 */}
              {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x = 70 * Math.cos(angle);
                const y = 70 * Math.sin(angle);

                return (
                  <button
                    key={n}
                    onClick={() => {
                      setClockHour(n);
                      soundService.playClick();
                      if (n === (config.correctResult || 8)) {
                        triggerDiscovery();
                      }
                    }}
                    className={`absolute w-7 h-7 rounded-full text-xs font-black flex items-center justify-center cursor-pointer transition-transform hover:scale-125 ${
                      clockHour === n
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-purple-100'
                    }`}
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                  >
                    {n}
                  </button>
                );
              })}

              {/* Center Dot */}
              <div className="w-3.5 h-3.5 bg-slate-900 rounded-full z-20" />

              {/* Minute Hand (pointing to 12) */}
              <div
                className="absolute top-4 w-1.5 h-16 bg-blue-600 rounded-full origin-bottom z-10"
                title="Kim phút chỉ số 12"
              />

              {/* Hour Hand (pointing to clockHour) */}
              <div
                className="absolute w-2 h-12 bg-rose-500 rounded-full origin-bottom z-10 transition-transform duration-300"
                style={{
                  transform: `rotate(${clockHour * 30}deg) translateY(-50%)`,
                }}
                title="Kim giờ chỉ số giờ đúng"
              />
            </div>

            <div className="text-xl md:text-2xl font-black text-purple-950 bg-white px-5 py-2 rounded-2xl border-2 border-purple-300 inline-block shadow-xs">
              Đồng hồ đang chỉ: <strong className="text-rose-600">{clockHour} giờ đúng</strong>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------------
            SUB-SANDBOX 14: CÁC NGÀY TRONG TUẦN & LỊCH (Bài 35, 36)
            --------------------------------------------------------------------- */}
        {config.interactionType === 'weekly_calendar_pick' && (
          <div className="space-y-4 py-2 text-center">
            <p className="text-xs md:text-sm font-bold text-slate-700">
              Chạm vào các ngày trong tuần để xếp thứ tự từ Thứ Hai đến Chủ Nhật:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 max-w-2xl mx-auto">
              {[
                { vi: 'Thứ Hai', en: 'Monday', type: 'school' },
                { vi: 'Thứ Ba', en: 'Tuesday', type: 'school' },
                { vi: 'Thứ Tư', en: 'Wednesday', type: 'school' },
                { vi: 'Thứ Năm', en: 'Thursday', type: 'school' },
                { vi: 'Thứ Sáu', en: 'Friday', type: 'school' },
                { vi: 'Thứ Bảy', en: 'Saturday', type: 'weekend' },
                { vi: 'Chủ Nhật', en: 'Sunday', type: 'weekend' },
              ].map((day, idx) => {
                const isSelected = selectedDayIndex === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedDayIndex(idx);
                      soundService.playClick();
                      triggerDiscovery();
                    }}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-md'
                        : day.type === 'weekend'
                        ? 'bg-rose-50 border-rose-200 text-rose-900 hover:bg-rose-100'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-300'
                    }`}
                  >
                    <span className="text-xs font-black">{day.vi}</span>
                    <span className="text-[10px] opacity-75">{day.en}</span>
                    <span className="text-[9px] px-1 rounded bg-black/10 mt-1 font-bold">
                      {day.type === 'weekend' ? 'Nghỉ' : 'Đi học'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-bold text-slate-500">
              Một tuần có 7 ngày · 5 ngày đi học và 2 ngày nghỉ cuối tuần!
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------------
            SUB-SANDBOX 15: BẢNG 100 SỐ (Bài 23)
            --------------------------------------------------------------------- */}
        {config.interactionType === 'hundred_chart_explore' && (
          <div className="space-y-4 py-2 text-center">
            <p className="text-xs md:text-sm font-bold text-slate-700">
              Khám phá các số tròn chục (10, 20, 30... 100) ở cột cuối cùng:
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
              {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setSelectedChartNum(num);
                    soundService.playClick();
                    if (num === 100) triggerDiscovery();
                  }}
                  className={`w-11 h-11 rounded-xl font-black text-sm transition-all cursor-pointer ${
                    selectedChartNum === num
                      ? 'bg-violet-600 text-white shadow-md scale-110'
                      : 'bg-white hover:bg-violet-50 text-violet-950 border border-violet-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------------
            SUB-SANDBOX 16: TỔNG HỢP ÔN TẬP CUỐI NĂM & CÚP VÀNG (Bài 41...)
            --------------------------------------------------------------------- */}
        {config.interactionType === 'review_quest_board' && (
          <div className="space-y-4 py-3 text-center">
            <div className="text-5xl md:text-6xl animate-bounce">🏆🌟🎓</div>
            <h4 className="text-xl md:text-2xl font-black text-amber-900 font-heading">
              Cúp Vàng Vinh Quang Toán Học Lớp 1
            </h4>
            <p className="text-xs md:text-sm font-semibold text-slate-600 max-w-md mx-auto">
              Dành tặng học sinh chăm ngoan Khối 1, Trường Tiểu học Trần Đại Nghĩa, P. Hòa Xuân, Đà Nẵng!
            </p>
            <button
              onClick={() => {
                triggerDiscovery();
                soundService.praiseVictory(langMode);
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-black text-base shadow-md cursor-pointer active:scale-95"
            >
              🎉 Chạm nhận Cúp Vô Địch Toán 1
            </button>
          </div>
        )}
          </div>
        </div>
      )}

      {/* =========================================================================
          BƯỚC 4: PHÁT HIỆN KIẾN THỨC (Kết luận toán học khoa học của Robot)
          ========================================================================= */}
      {activeTabSubstep === 4 && (
        <div className="flex-1 min-h-0 rounded-3xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 p-4 sm:p-6 space-y-3 flex flex-col justify-center animate-scale-in my-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-200/80 px-3 py-1 rounded-full border border-emerald-300">
                Bước 4: Phát Hiện Kiến Thức Mới
              </span>
            </div>
          </div>

          <div className="p-4 bg-white/95 rounded-2xl border border-emerald-300 shadow-xs space-y-1">
            <div className="text-sm md:text-base font-black text-emerald-950 leading-relaxed">
              {config.explanationVi}
            </div>
            <div className="text-xs font-bold text-slate-500">
              Kiến thức trọng tâm: {config.learningObjective}
            </div>
          </div>

          {/* Bilingual English Keywords Preview */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-black text-slate-600">Từ vựng tiếng Anh (bấm loa để nghe):</span>
            {config.vocabularyEn.map((v, i) => (
              <button
                key={i}
                type="button"
                onClick={() => soundService.speakEn(v.en)}
                className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 hover:bg-emerald-50 text-xs font-bold text-emerald-900 flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                title={`Listen: "${v.en}"`}
              >
                <Volume2 className="w-3 h-3 text-emerald-600" />
                <span>{v.en}</span>
                <span className="text-slate-400 font-normal">({v.vi})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons to Next Step (Học cùng Robot) */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs md:text-sm hover:bg-slate-50 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Khám phá lại từ đầu</span>
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            onCompleteStep();
          }}
          className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold text-sm md:text-base rounded-2xl shadow-md transition-all cursor-pointer active:scale-95"
        >
          <span>Tiếp tục: Học cùng Robot</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
