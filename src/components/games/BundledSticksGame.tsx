/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundService, soundEffects } from '../../services/audioService';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Sparkles, Box, CheckCircle2, Plus, Minus, Volume2, Trophy, PackageCheck } from 'lucide-react';

interface BundledSticksGameProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onBack: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
}

type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface StickOrder {
  orderNumber: number;
  targetNumber: number;
  tens: number;
  ones: number;
}

export const BundledSticksGame: React.FC<BundledSticksGameProps> = ({
  student,
  langMode,
  onBack,
  onUpdateStudent,
}) => {
  const [level, setLevel] = useState<DifficultyLevel>('easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [orderIdx, setOrderIdx] = useState(0);
  const [orders, setOrders] = useState<StickOrder[]>([]);
  const [placedTens, setPlacedTens] = useState(0);
  const [placedOnes, setPlacedOnes] = useState(0);
  const [isPackaging, setIsPackaging] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  // Generate 5 orders based on level
  const generateOrders = (diff: DifficultyLevel): StickOrder[] => {
    const list: StickOrder[] = [];
    const usedNumbers = new Set<number>();

    while (list.length < 5) {
      let num = 0;
      if (diff === 'easy') {
        num = Math.floor(Math.random() * 20) + 11; // 11..30
      } else if (diff === 'medium') {
        num = Math.floor(Math.random() * 30) + 31; // 31..60
      } else {
        const isRoundTen = Math.random() > 0.6;
        num = isRoundTen
          ? (Math.floor(Math.random() * 4) + 6) * 10 // 60, 70, 80, 90
          : Math.floor(Math.random() * 40) + 61; // 61..100
      }

      if (!usedNumbers.has(num)) {
        usedNumbers.add(num);
        list.push({
          orderNumber: list.length + 1,
          targetNumber: num,
          tens: Math.floor(num / 10),
          ones: num % 10,
        });
      }
    }

    return list;
  };

  const handleStartGame = (selectedDiff: DifficultyLevel) => {
    setLevel(selectedDiff);
    const gen = generateOrders(selectedDiff);
    setOrders(gen);
    setOrderIdx(0);
    setPlacedTens(0);
    setPlacedOnes(0);
    setIsPackaging(false);
    setFeedback(null);
    setIsCompleted(false);
    setStartTime(Date.now());
    setGameStarted(true);
    soundService.playClick();
  };

  const currentOrder = orders[orderIdx];

  const handleAddTen = () => {
    if (isPackaging || placedTens >= 10) return;
    soundService.playClick();
    setPlacedTens((t) => t + 1);
    setFeedback(null);
  };

  const handleRemoveTen = () => {
    if (isPackaging || placedTens <= 0) return;
    soundService.playClick();
    setPlacedTens((t) => t - 1);
    setFeedback(null);
  };

  const handleAddOne = () => {
    if (isPackaging || placedOnes >= 10) return;
    soundService.playClick();
    setPlacedOnes((o) => o + 1);
    setFeedback(null);
  };

  const handleRemoveOne = () => {
    if (isPackaging || placedOnes <= 0) return;
    soundService.playClick();
    setPlacedOnes((o) => o - 1);
    setFeedback(null);
  };

  const handleResetCurrentOrder = () => {
    if (isPackaging) return;
    soundService.playClick();
    setPlacedTens(0);
    setPlacedOnes(0);
    setFeedback(null);
  };

  const handlePack = () => {
    if (!currentOrder || isPackaging || isCompleted) return;

    setIsPackaging(true);

    if (placedTens === currentOrder.tens && placedOnes === currentOrder.ones) {
      // Correct!
      soundEffects.correct();
      setFeedback({
        text: `Tuyệt đỉnh! Số ${currentOrder.targetNumber} gồm đúng ${currentOrder.tens} chục và ${currentOrder.ones} đơn vị!`,
        isCorrect: true,
      });

      setTimeout(() => {
        setIsPackaging(false);
        setPlacedTens(0);
        setPlacedOnes(0);
        setFeedback(null);

        if (orderIdx + 1 < orders.length) {
          setOrderIdx((i) => i + 1);
        } else {
          // Finished all 5 orders
          setIsCompleted(true);
          soundEffects.celebrate();
          confetti({ particleCount: 160, spread: 90 });

          StorageService.recordActivity(student.id, {
            type: 'game',
            targetId: 'bundled-sticks',
            targetName: 'Nhà Máy Bó Que Tính Thần Kỳ',
            score: 5,
            totalQuestions: 5,
            starsEarned: 25,
            timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
          });

          const updated = StorageService.getCurrentStudent();
          if (updated) onUpdateStudent(updated);
        }
      }, 1500);
    } else {
      // Incorrect
      soundEffects.wrong();
      setIsPackaging(false);
      setFeedback({
        text: `Chưa khớp rồi! Số ${currentOrder.targetNumber} cần ${currentOrder.tens} bó chục và ${currentOrder.ones} que đơn nhé!`,
        isCorrect: false,
      });
      setTimeout(() => {
        setFeedback(null);
      }, 1800);
    }
  };

  // --- START SCREEN (16:9 Zero-Scroll) ---
  if (!gameStarted) {
    return (
      <div className="w-full h-full max-h-[100dvh] flex flex-col bg-gradient-to-br from-amber-950 via-slate-900 to-amber-950 text-white select-none overflow-hidden font-sans">
        {/* Header */}
        <header className="flex-none px-4 sm:px-6 py-2.5 bg-black/50 backdrop-blur-md border-b border-amber-500/30 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-bold text-xs sm:text-sm border border-amber-400/30 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Lâu Đài Những Con Số</span>
          </button>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Khu 1 • Lâu Đài Những Con Số
          </span>
        </header>

        {/* Content */}
        <main className="flex-1 min-h-0 flex flex-col items-center justify-center p-4 max-w-3xl mx-auto text-center space-y-5 my-auto">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 shadow-xl flex items-center justify-center text-4xl sm:text-5xl border-4 border-amber-200 animate-bounce">
            📦
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300 bg-clip-text text-transparent uppercase tracking-wide">
              ĐÓNG GÓI KIỆN HÀNG
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 font-medium max-w-lg mx-auto">
              Bé hãy đóng gói que tính thành các <strong>BÓ CHỤC</strong> (10 que) và <strong>QUE ĐƠN VỊ</strong> để hoàn thành các kiện hàng nhé!
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border-2 border-amber-400/40 shadow-2xl w-full max-w-md space-y-3">
            <div className="text-xs font-black uppercase text-amber-300 tracking-wider">
              Chọn mức độ thử thách
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleStartGame('easy')}
                className="py-3 px-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                🌱 DỄ
                <div className="text-[10px] font-medium opacity-90 mt-0.5">Số đến 30</div>
              </button>

              <button
                type="button"
                onClick={() => handleStartGame('medium')}
                className="py-3 px-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                ⭐ VỪA
                <div className="text-[10px] font-medium opacity-90 mt-0.5">Số đến 60</div>
              </button>

              <button
                type="button"
                onClick={() => handleStartGame('hard')}
                className="py-3 px-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                🔥 THỬ THÁCH
                <div className="text-[10px] font-medium opacity-90 mt-0.5">Số đến 100</div>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- VICTORY SCREEN (16:9 Zero-Scroll) ---
  if (isCompleted) {
    return (
      <div className="w-full h-full max-h-[100dvh] flex flex-col bg-gradient-to-br from-amber-950 via-slate-900 to-amber-950 text-white select-none overflow-hidden font-sans">
        <header className="flex-none px-4 sm:px-6 py-2.5 bg-black/50 backdrop-blur-md border-b border-amber-500/30 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-bold text-xs sm:text-sm border border-amber-400/30 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Lâu Đài Những Con Số</span>
          </button>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Khu 1 • Lâu Đài Những Con Số
          </span>
        </header>

        <main className="flex-1 min-h-0 flex flex-col items-center justify-center p-4 max-w-lg mx-auto text-center space-y-4 my-auto">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_30px_rgba(251,191,36,0.6)] animate-bounce border-2 border-yellow-200">
            <Trophy className="w-12 h-12 text-yellow-950" />
          </div>

          <div className="space-y-1">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Hoàn thành 5/5 Kiện Hàng
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-300 uppercase tracking-wide">
              ĐÓNG GÓI THÀNH CÔNG!
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/90 font-medium">
              Chúc mừng <strong>{student.fullName}</strong>! Bé đã hoàn thành xuất sắc tất cả các kiện hàng!
            </p>
          </div>

          <div className="my-3 px-5 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-base sm:text-lg flex items-center gap-2">
            <span>⭐</span>
            <span>Bé nhận được +25 SAO VÀNG!</span>
          </div>

          <div className="flex gap-3 w-full max-w-xs pt-1">
            <button
              type="button"
              onClick={() => handleStartGame(level)}
              className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-amber-200 font-black text-xs sm:text-sm uppercase transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi lại</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm uppercase shadow-lg shadow-amber-500/30 transition transform hover:scale-105 cursor-pointer"
            >
              Về Khu Vực
            </button>
          </div>
        </main>
      </div>
    );
  }

  // --- GAMEPLAY SCREEN (STRICT 3-ZONE 16:9 ZERO-SCROLL LAYOUT) ---
  const currentTotal = placedTens * 10 + placedOnes;
  const isMatch = currentTotal === currentOrder.targetNumber;

  return (
    <div className="w-full h-full max-h-[100dvh] flex flex-col bg-gradient-to-br from-amber-950 via-slate-900 to-amber-950 text-white select-none overflow-hidden font-sans">
      {/* 0. Top Universal Navigation Bar */}
      <header className="flex-none px-3 sm:px-6 py-2 bg-black/60 backdrop-blur-md border-b border-amber-500/30 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-bold text-xs sm:text-sm border border-amber-400/30 transition shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Về Lâu Đài Những Con Số</span>
            <span className="sm:hidden">Quay lại</span>
          </button>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="text-lg">📦</span>
            <h1 className="text-xs sm:text-sm md:text-base font-black tracking-wide text-amber-300 uppercase">
              ĐÓNG GÓI KIỆN HÀNG
            </h1>
          </div>
        </div>

        {/* Progress & Reset */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg font-black text-[10px] sm:text-xs flex items-center justify-center transition-all ${
                  i < orderIdx
                    ? 'bg-emerald-400 text-emerald-950 font-bold'
                    : i === orderIdx
                    ? 'bg-amber-400 text-slate-900 ring-2 ring-yellow-200 scale-105'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {i < orderIdx ? '✓' : i + 1}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleResetCurrentOrder}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-400/30 transition cursor-pointer"
            title="Xóa kiện hàng xếp lại"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Làm lại</span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* KHU VỰC 1 – PHÍA TRÊN (Khoảng 15% chiều cao) */}
      {/* Tiêu đề ĐÓNG GÓI KIỆN HÀNG, Tiến trình, và KHUNG NHIỆM VỤ SỐ CỰC LỚN */}
      {/* ========================================================= */}
      <section className="flex-none px-3 sm:px-6 pt-2 pb-1 flex flex-col items-center justify-center z-10">
        <div className="w-full max-w-4xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 rounded-2xl px-4 py-2 text-white shadow-lg border-2 border-yellow-300 flex items-center justify-between gap-3">
          {/* Left badge */}
          <div className="flex flex-col items-start min-w-[90px] sm:min-w-[120px]">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-yellow-200">
              ĐƠN HÀNG {currentOrder.orderNumber}/5
            </span>
            <span className="text-[11px] sm:text-xs text-white/90 font-bold">
              Khu 1 • Số học
            </span>
          </div>

          {/* Center Prominent Target Number Mission Banner */}
          <div className="flex-1 flex items-center justify-center gap-3 text-center">
            <div className="flex flex-col items-end text-right">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-yellow-200">
                NHIỆM VỤ ĐÓNG GÓI
              </span>
              <span className="text-xs sm:text-sm md:text-base font-black text-white uppercase tracking-tight">
                HÃY ĐÓNG GÓI SỐ
              </span>
            </div>

            {/* THE TARGET NUMBER: Huge, bold, high-contrast, crystal clear */}
            <div className="px-4 py-0.5 rounded-2xl bg-black/35 border-2 border-yellow-300/80 shadow-inner flex items-center justify-center">
              <span className="text-4xl sm:text-5xl md:text-6xl font-black text-yellow-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] tracking-tight leading-none animate-pulse">
                {currentOrder.targetNumber}
              </span>
            </div>
          </div>

          {/* Right hint */}
          <div className="hidden sm:flex flex-col items-end text-right text-[11px] text-yellow-100 font-medium min-w-[120px]">
            <span>1 bó chục = 10 que</span>
            <span>Ghép đúng bó chục & que lẻ</span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* KHU VỰC 2 – CHÍNH GIỮA (Khoảng 65% chiều cao) */}
      {/* 2 CỘT CÂN ĐỐI RỘNG RÃI: BÊN TRÁI (SẢN PHẨM THAO TÁC) - BÊN PHẢI (KIỆN HÀNG 3D) */}
      {/* ========================================================= */}
      <section className="flex-1 min-h-0 px-3 sm:px-6 py-2 flex items-center justify-center">
        <div className="w-full max-w-4xl h-full grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 items-stretch">
          {/* ------------------------------------------------------- */}
          {/* BÊN TRÁI: CÁC VẬT PHẨM CẦN ĐÓNG GÓI & CÔNG CỤ THAO TÁC */}
          {/* ------------------------------------------------------- */}
          <div className="bg-slate-900/90 rounded-3xl p-3 sm:p-4 border-2 border-amber-400/40 shadow-xl flex flex-col justify-between gap-2 min-h-0">
            <div className="flex items-center justify-between pb-1.5 border-b border-amber-500/20">
              <span className="text-xs sm:text-sm font-black uppercase text-amber-300 flex items-center gap-1.5">
                <span>🛠️</span>
                <span>CHỌN SẢN PHẨM ĐÓNG GÓI</span>
              </span>
              <span className="text-[10px] text-amber-200/70 font-semibold">Bấm + hoặc -</span>
            </div>

            {/* 2 Tool Cards: BÓ CHỤC (10 que) & QUE ĐƠN VỊ (1 que) */}
            <div className="flex-1 min-h-0 flex flex-col justify-around gap-2.5 py-1">
              {/* Tool 1: BÓ CHỤC */}
              <div className="bg-gradient-to-r from-amber-950/80 to-slate-950/80 rounded-2xl p-2.5 sm:p-3 border-2 border-amber-500/50 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-t from-amber-600 to-yellow-500 border-2 border-red-500 flex flex-col items-center justify-center text-white shadow-sm shrink-0">
                    <span className="text-xs">🥢</span>
                    <span className="text-[11px] font-black leading-none">10</span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300">
                      BÓ CHỤC
                    </h3>
                    <p className="text-[11px] text-amber-200/80 font-medium">Mỗi bó = 10 que tính</p>
                  </div>
                </div>

                {/* Counter & Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleRemoveTen}
                    disabled={placedTens <= 0}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-30 text-white font-black text-xl flex items-center justify-center cursor-pointer shadow-md active:scale-95 transition"
                    title="Bớt 1 bó chục"
                  >
                    <Minus className="w-4 h-4 stroke-[3]" />
                  </button>
                  <span className="w-10 text-center text-xl sm:text-2xl font-black text-amber-300">
                    {placedTens}
                  </span>
                  <button
                    type="button"
                    onClick={handleAddTen}
                    disabled={placedTens >= 10}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white font-black text-xl flex items-center justify-center cursor-pointer shadow-md active:scale-95 transition"
                    title="Thêm 1 bó chục"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>

              {/* Tool 2: QUE ĐƠN VỊ */}
              <div className="bg-gradient-to-r from-amber-950/80 to-slate-950/80 rounded-2xl p-2.5 sm:p-3 border-2 border-yellow-500/50 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-t from-yellow-500 to-amber-600 border-2 border-yellow-200 flex flex-col items-center justify-center text-white shadow-sm shrink-0">
                    <span className="text-xs">🥢</span>
                    <span className="text-[11px] font-black leading-none">1</span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-yellow-300">
                      QUE ĐƠN VỊ
                    </h3>
                    <p className="text-[11px] text-yellow-200/80 font-medium">Từng que tính lẻ rời</p>
                  </div>
                </div>

                {/* Counter & Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleRemoveOne}
                    disabled={placedOnes <= 0}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-30 text-white font-black text-xl flex items-center justify-center cursor-pointer shadow-md active:scale-95 transition"
                    title="Bớt 1 que đơn vị"
                  >
                    <Minus className="w-4 h-4 stroke-[3]" />
                  </button>
                  <span className="w-10 text-center text-xl sm:text-2xl font-black text-yellow-300">
                    {placedOnes}
                  </span>
                  <button
                    type="button"
                    onClick={handleAddOne}
                    disabled={placedOnes >= 10}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white font-black text-xl flex items-center justify-center cursor-pointer shadow-md active:scale-95 transition"
                    title="Thêm 1 que đơn vị"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center text-[11px] text-amber-200/70 font-medium">
              Đang chọn: <strong>{placedTens}</strong> bó chục + <strong>{placedOnes}</strong> que lẻ
            </div>
          </div>

          {/* ------------------------------------------------------- */}
          {/* BÊN PHẢI: KHU VỰC KIỆN HÀNG (THÙNG CARTON ĐÓNG GÓI 3D) */}
          {/* ------------------------------------------------------- */}
          <div
            className={`rounded-3xl p-3 sm:p-4 border-3 transition-all duration-300 flex flex-col justify-between gap-2 shadow-2xl relative min-h-0 ${
              isMatch
                ? 'bg-gradient-to-b from-amber-950/90 to-emerald-950/90 border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.4)]'
                : 'bg-gradient-to-b from-amber-950/90 via-slate-900/90 to-amber-950/90 border-yellow-400/50'
            }`}
          >
            {/* Package Box Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-amber-500/20">
              <span className="text-xs sm:text-sm font-black uppercase text-amber-300 flex items-center gap-1.5">
                <span>📦</span>
                <span>KIỆN HÀNG ĐANG ĐÓNG</span>
              </span>
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-lg border ${
                  isMatch
                    ? 'bg-emerald-500 text-white border-emerald-300 animate-pulse'
                    : 'bg-black/40 text-amber-300 border-amber-500/30'
                }`}
              >
                Tổng: {currentTotal} que
              </span>
            </div>

            {/* Inside the Package Box Visual Arena */}
            <div className="flex-1 min-h-0 bg-black/45 rounded-2xl p-2.5 border border-amber-500/30 flex flex-col justify-around gap-2 shadow-inner overflow-hidden">
              {/* Tens Row */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <span>🎗️ Bó chục ({placedTens} bó = {placedTens * 10} que):</span>
                </span>
                <div className="flex flex-wrap items-center gap-1.5 min-h-[32px] p-1.5 bg-slate-950/60 rounded-xl border border-white/5">
                  {placedTens === 0 ? (
                    <span className="text-[11px] text-slate-500 italic">Chưa có bó chục nào trong kiện</span>
                  ) : (
                    Array.from({ length: placedTens }).map((_, i) => (
                      <div
                        key={i}
                        className="px-2 py-0.5 bg-gradient-to-t from-amber-600 to-yellow-500 rounded-md border border-red-500 flex items-center gap-1 text-white shadow-sm animate-scale-up"
                      >
                        <span className="text-[10px]">🥢</span>
                        <span className="text-[10px] font-black">10</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Ones Row */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-300 flex items-center gap-1">
                  <span>🥢 Que đơn vị ({placedOnes} que lẻ):</span>
                </span>
                <div className="flex flex-wrap items-center gap-1 min-h-[32px] p-1.5 bg-slate-950/60 rounded-xl border border-white/5">
                  {placedOnes === 0 ? (
                    <span className="text-[11px] text-slate-500 italic">Chưa có que lẻ nào trong kiện</span>
                  ) : (
                    Array.from({ length: placedOnes }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-7 bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-600 rounded-xs shadow-xs border border-yellow-200 animate-scale-up"
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Status indicator inside box */}
            <div className="text-center text-[11px] font-bold">
              {isMatch ? (
                <span className="text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đã khớp đủ {currentOrder.targetNumber} que! Sẵn sàng đóng gói!</span>
                </span>
              ) : (
                <span className="text-amber-200/80">
                  Cần thêm hoặc bớt để đúng <strong>{currentOrder.targetNumber}</strong> que
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* KHU VỰC 3 – PHÍA DƯỚI (Khoảng 20% chiều cao) */}
      {/* CÁC NÚT THAO TÁC CHÍNH, THÔNG BÁO VÀ CHUYỂN CÂU HỎI */}
      {/* ========================================================= */}
      <footer className="flex-none px-3 sm:px-6 py-2 sm:py-3 bg-black/60 backdrop-blur-md border-t border-amber-500/30 flex flex-col items-center justify-center gap-2 z-20">
        {/* Floating feedback message */}
        {feedback && (
          <div
            className={`px-4 py-1 rounded-full text-xs font-black shadow-lg animate-bounce border ${
              feedback.isCorrect
                ? 'bg-emerald-500 text-white border-emerald-300'
                : 'bg-rose-500 text-white border-rose-300'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Action Button Row */}
        <div className="flex items-center justify-center gap-3 w-full max-w-md">
          <button
            type="button"
            onClick={handlePack}
            disabled={isPackaging}
            className={`flex-1 py-3 px-6 rounded-2xl font-black text-sm sm:text-base shadow-xl border-2 transition-all transform flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
              isMatch
                ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-yellow-950 border-yellow-200 shadow-amber-500/50 scale-102 animate-pulse'
                : 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white border-amber-300 shadow-amber-600/30'
            }`}
          >
            <Box className="w-5 h-5 shrink-0" />
            <span>ĐÓNG GÓI KIỆN HÀNG 📦</span>
          </button>
        </div>

        {/* Helper bottom note */}
        <div className="text-[10px] sm:text-[11px] text-amber-200/70 text-center font-medium">
          💡 Ghi nhớ: Cứ <strong>10 que tính</strong> rời được bó lại thành <strong>1 chục</strong> (Ví dụ: Số {currentOrder.targetNumber} gồm {currentOrder.tens} chục và {currentOrder.ones} đơn vị).
        </div>
      </footer>
    </div>
  );
};
