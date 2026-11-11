/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentProfile, LanguageMode, GameMetadata } from '../../types';
import { GAMES_CATALOG } from '../../data/curriculumData';
import { GAME_PARK_ZONES, GameParkZone } from '../../data/gameParkZonesData';
import { ZoneIllustration } from './ZoneIllustration';
import { RobotMathChibi } from '../chibi/RobotMathChibi';
import { RabbitRiverGame } from './RabbitRiverGame';
import { NumberTrainGame } from './NumberTrainGame';
import { GeometryExplorerGame } from './GeometryExplorerGame';
import { MagicShapeWorkshopGame } from './MagicShapeWorkshopGame';
import { CalculationRacerGame } from './CalculationRacerGame';
import { ComprehensiveRaceTrackGame } from './ComprehensiveRaceTrackGame';
import { PenguinFishingGame } from './PenguinFishingGame';
import { MathTreasureIslandZoneView } from './MathTreasureIslandZoneView';
import { MysteryTreasureCipherGame } from './MysteryTreasureCipherGame';
import { TreasureHuntJourneyGame } from './TreasureHuntJourneyGame';
import { BridgeBuilderGame } from './BridgeBuilderGame';
import { MagicClockGame } from './MagicClockGame';
import { MagicTimeTrainGame } from './MagicTimeTrainGame';
import { MathSupermarketGame } from './MathSupermarketGame';
import { GiantTurnipFarmGame } from './GiantTurnipFarmGame';
import { TrainJourneyGame } from './TrainJourneyGame';
import { BundledSticksGame } from './BundledSticksGame';
import { SiblingCardsGame } from './SiblingCardsGame';
import { ForestRescueJourneyGame } from './ForestRescueJourneyGame';
import { TinyMeasurementWorkshopView } from './TinyMeasurementWorkshopView';
import { MagicRulerGame } from './MagicRulerGame';
import { WhoIsLongerGame } from './WhoIsLongerGame';
import { soundService } from '../../services/audioService';
import {
  Gamepad2,
  Play,
  Sparkles,
  Award,
  ArrowLeft,
  Home,
  FerrisWheel,
  Grid,
  Info,
  Clock,
  ChevronRight,
} from 'lucide-react';

interface GameWorldViewProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onUpdateStudent: (student: StudentProfile) => void;
  initialGameId?: string | null;
  onBack?: () => void;
  onActiveGameChange?: (isPlaying: boolean) => void;
}

export const GameWorldView: React.FC<GameWorldViewProps> = ({
  student,
  langMode,
  onUpdateStudent,
  initialGameId = null,
  onBack,
  onActiveGameChange,
}) => {
  // Navigation & View states
  const [activeTab, setActiveTab] = useState<'zones' | 'all-games'>('zones');
  const [selectedZone, setSelectedZone] = useState<GameParkZone | null>(null);
  const [activeGameId, setActiveGameId] = useState<string | null>(initialGameId);

  // Return destination after exiting a game
  const [returnToZone, setReturnToZone] = useState<GameParkZone | null>(null);

  useEffect(() => {
    onActiveGameChange?.(Boolean(activeGameId));
  }, [activeGameId, onActiveGameChange]);

  const handleLaunchGame = (gameId: string, fromZone?: GameParkZone | null) => {
    soundService.playClick();
    setReturnToZone(fromZone || null);
    setActiveGameId(gameId);
    onActiveGameChange?.(true);
  };

  const handleBackToCatalog = () => {
    soundService.playClick();
    setActiveGameId(null);
    onActiveGameChange?.(false);
    if (returnToZone) {
      setSelectedZone(returnToZone);
    }
  };

  const handleSelectZone = (zone: GameParkZone) => {
    soundService.playClick();
    setSelectedZone(zone);
  };

  const handleBackToPark = () => {
    soundService.playClick();
    setSelectedZone(null);
  };

  // --- RENDER ACTIVE GAME IF ONE IS LAUNCHED (All 10 Games Preserved 100%) ---
  if (activeGameId === 'rabbit-river') {
    return (
      <RabbitRiverGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }
  if (activeGameId === 'number-train') {
    return (
      <NumberTrainGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }
  if (activeGameId === 'geometry-explorer' || activeGameId === 'shape-builder') {
    return (
      <GeometryExplorerGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }
  if (activeGameId === 'magic-shape-workshop') {
    return (
      <MagicShapeWorkshopGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }
  if (activeGameId === 'math-racing') {
    return (
      <CalculationRacerGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }
  if (activeGameId === 'duong-dua-tong-hop') {
    return (
      <ComprehensiveRaceTrackGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }
  if (activeGameId === 'penguin-fishing') {
    return (
      <PenguinFishingGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }
  if (activeGameId === 'treasure-cipher') {
    return (
      <MysteryTreasureCipherGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }
  if (activeGameId === 'bridge-builder') {
    return (
      <BridgeBuilderGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }
  if (activeGameId === 'magic-clock') {
    return (
      <MagicClockGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }
  if (activeGameId === 'magic-time-train') {
    return (
      <MagicTimeTrainGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }
  if (activeGameId === 'math-supermarket') {
    return (
      <MathSupermarketGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }
  if (activeGameId === 'giant-turnip-farm') {
    return (
      <GiantTurnipFarmGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }
  if (activeGameId === 'treasure-hunt') {
    return (
      <TreasureHuntJourneyGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }

  // --- KHU 1: LÂU ĐÀI NHỮNG CON SỐ (2 Games) ---
  if (activeGameId === 'train-journey') {
    return (
      <TrainJourneyGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }
  if (activeGameId === 'bundled-sticks') {
    return (
      <BundledSticksGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }

  // --- KHU 2: KHU RỪNG PHÉP TÍNH (2 Games) ---
  if (activeGameId === 'sibling-cards') {
    return (
      <SiblingCardsGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }
  if (activeGameId === 'forest-rescue') {
    return (
      <ForestRescueJourneyGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }

  // --- KHU VỰC 6: XƯỞNG ĐO LƯỜNG TÍ HON (2 Games) ---
  if (activeGameId === 'magic-ruler') {
    return (
      <MagicRulerGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }
  if (activeGameId === 'who-is-longer') {
    return (
      <WhoIsLongerGame
        student={student}
        langMode={langMode}
        onBack={handleBackToCatalog}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }

  // --- VIEW 2: ZONE DETAIL SCREEN (When a zone is selected) ---
  if (selectedZone) {
    // Khu vực 6: Xưởng Đo Lường Tí Hon có giao diện 16:9 chuyên biệt
    if (selectedZone.id === 'zone-6-measurement' || selectedZone.number === 6) {
      return (
        <TinyMeasurementWorkshopView
          zone={selectedZone}
          student={student}
          langMode={langMode}
          onBackToPark={handleBackToPark}
          onHome={onBack}
          onLaunchGame={(gId) => handleLaunchGame(gId, selectedZone)}
        />
      );
    }

    // Khu vực 8: Đảo Kho Báu Toán Học có giao diện 16:9 chuyên biệt
    if (selectedZone.id === 'zone-8-treasure' || selectedZone.number === 8) {
      return (
        <MathTreasureIslandZoneView
          zone={selectedZone}
          student={student}
          langMode={langMode}
          onBackToPark={handleBackToPark}
          onHome={onBack}
          onLaunchGame={(gId) => handleLaunchGame(gId, selectedZone)}
        />
      );
    }

    // Check if any games are mapped to this zone (none currently assigned, ready for future categorization)
    const zoneGames = GAMES_CATALOG.filter(
      (g) => (g as any).categoryId === selectedZone.id
    );

    return (
      <div className="space-y-6 select-none pb-8 px-3 sm:px-4 md:px-0">
        {/* Navigation Breadcrumb Bar */}
        <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBackToPark}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600" />
              <span>QUAY LẠI CÔNG VIÊN</span>
            </button>

            {onBack && (
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onBack();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <Home className="w-4 h-4 text-emerald-600" />
                <span>TRANG CHỦ</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span
              className="text-xs font-black text-white px-3 py-1 rounded-full shadow-xs"
              style={{ backgroundColor: selectedZone.accentHex }}
            >
              Khu {selectedZone.number}
            </span>
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">
              Màu {selectedZone.colorName}
            </span>
          </div>
        </div>

        {/* Zone Hero Header Banner */}
        <div
          className={`bg-gradient-to-r ${selectedZone.bgGrad} rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6`}
        >
          <div className="relative z-10 space-y-2 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider text-yellow-100">
              <Sparkles className="w-3.5 h-3.5" /> KHU VUI CHƠI SỐ {selectedZone.number}
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-['Be_Vietnam_Pro'] drop-shadow-sm">
              KHU {selectedZone.number} – {selectedZone.nameVi}
            </h2>

            <div className="text-xs sm:text-sm font-black tracking-wider uppercase text-yellow-200">
              {selectedZone.nameEn}
            </div>

            <div className="bg-black/15 backdrop-blur-xs px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-white/95 inline-block">
              <strong>Chủ đề:</strong> {selectedZone.topicTitleVi}
            </div>

            <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed">
              {selectedZone.taglineVi}
            </p>
          </div>

          {/* 4:3 Zone Artwork Preview */}
          <div className="shrink-0 w-44 sm:w-56 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white">
            <ZoneIllustration
              type={selectedZone.illustrationType}
              imageSrc={selectedZone.imageSrc}
            />
          </div>
        </div>

        {/* Zone Content: Games or Coming Soon Notice */}
        {zoneGames.length === 0 ? (
          /* SẮP CÓ TRÒ CHƠI MỚI (Per user instructions: Khu vực chưa phân loại hiển thị "Sắp có trò chơi mới!") */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-slate-200 shadow-sm text-center space-y-5 max-w-2xl mx-auto">
            <div className="flex justify-center">
              <RobotMathChibi expression="excited" size="lg" className="animate-float" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Đang chuẩn bị trò chơi
              </div>

              <h3 className="text-2xl sm:text-3xl font-black font-['Be_Vietnam_Pro'] text-slate-900">
                Sắp có trò chơi mới!
              </h3>

              <p className="text-sm font-semibold text-slate-600 max-w-lg mx-auto leading-relaxed">
                Khu vui chơi <strong>{selectedZone.nameVi}</strong> đang được các thầy cô Trường TH Trần Đại Nghĩa chuẩn bị những trò chơi toán học đặc sắc nhất dành cho bé!
              </p>
            </div>

            {/* Quick Action to Play the 10 Existing Games */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  setSelectedZone(null);
                  setActiveTab('all-games');
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>CHƠI NGAY 10 TRÒ CHƠI CÓ SẴN 🎮</span>
              </button>

              <button
                type="button"
                onClick={handleBackToPark}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <span>Khám phá các khu vui chơi khác</span>
              </button>
            </div>
          </div>
        ) : (
          /* Render classified games belonging to this zone */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {zoneGames.map((game) => {
              const hasBadge = student.badges.includes(game.badgeName);

              return (
                <div
                  key={game.id}
                  className="bg-white rounded-3xl border-2 border-slate-200/80 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  {game.imageSrc ? (
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img
                        src={game.imageSrc}
                        alt={game.nameVi}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl filter drop-shadow">{game.icon}</span>
                          {hasBadge && (
                            <span className="bg-yellow-400 text-yellow-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Đã nhận cúp
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-black font-heading text-white drop-shadow-md mt-1">
                          {game.nameVi}
                        </h3>
                        <div className="text-xs font-semibold text-yellow-200">
                          {game.nameEn}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`p-5 bg-gradient-to-r ${game.themeColor} text-white relative overflow-hidden`}>
                      <div className="flex items-center justify-between">
                        <span className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">
                          {game.icon}
                        </span>
                        {hasBadge && (
                          <span className="bg-yellow-400 text-yellow-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Đã nhận cúp
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-black font-heading mt-3 text-white drop-shadow-xs">
                        {game.nameVi}
                      </h3>
                      <div className="text-xs font-semibold text-white/90">
                        {game.nameEn}
                      </div>
                    </div>
                  )}

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
                      {langMode === 'en' ? game.storyEn : game.taglineVi}
                    </p>

                    <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-500 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-600">Phần thưởng:</span>
                        <span className="font-black text-amber-600">
                          {game.rewardType === 'carrot'
                            ? '🥕 Cà rốt giòn ngọt'
                            : game.rewardType === 'trophy'
                            ? '🏆 Cúp vàng Grand Prix'
                            : game.rewardType === 'fish'
                            ? '🐟 Cá tươi ngon'
                            : '🗝️ Chìa khóa vàng'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-600">Huy hiệu:</span>
                        <span className="font-semibold text-purple-700">{game.badgeName}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleLaunchGame(game.id, selectedZone)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 group-hover:shadow-sky-400/30"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>BẮT ĐẦU CHƠI</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // --- VIEW 1: MAIN PARK SCREEN (8 Zones in 4x2 on Desktop + Transitional "TẤT CẢ TRÒ CHƠI" Tab) ---
  return (
    <div className="space-y-6 select-none pb-10 px-3 sm:px-4 md:px-0">
      {/* 1. HERO PARK BANNER */}
      <div className="bg-gradient-to-r from-amber-400 via-pink-400 to-purple-500 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 border-2 border-yellow-200">
        {/* Soft background glows */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/20 blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-yellow-200/20 blur-lg pointer-events-none" />

        <div className="relative z-10 space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/25 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-yellow-100 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            VƯƠNG QUỐC TOÁN HỌC SONG NGỮ • GRADE 1
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-['Be_Vietnam_Pro'] tracking-tight drop-shadow-sm">
            CÔNG VIÊN TOÁN HỌC KỲ DIỆU
          </h1>

          <p className="text-sm sm:text-base text-yellow-100 font-bold italic">
            🎡 Khám phá 8 khu vui chơi – Học Toán thật vui! 🎡
          </p>

          <p className="text-xs text-white/90 font-medium">
            Trường TH Trần Đại Nghĩa • Phường Hòa Xuân, TP. Đà Nẵng
          </p>
        </div>

        {/* Badges / Student Info Counter */}
        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <div className="bg-white/95 backdrop-blur-xs text-slate-800 p-3.5 rounded-2xl shadow-md text-center min-w-32 border border-purple-100">
            <div className="text-[11px] text-slate-500 font-bold uppercase">Huy hiệu trò chơi</div>
            <div className="text-xl font-black text-purple-700 flex items-center justify-center gap-1 mt-0.5">
              <Award className="w-5 h-5 text-purple-600" />
              <span>{student.badges.length} Đạt Được</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TAB SWITCHER: 8 KHU VUI CHƠI vs TẤT CẢ TRÒ CHƠI + TRANG CHỦ BUTTON */}
      <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-2 sm:p-2.5 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Tab 1: 8 Khu vui chơi */}
          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              setActiveTab('zones');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm transition-all cursor-pointer shadow-2xs ${
              activeTab === 'zones'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>8 KHU VUI CHƠI</span>
          </button>

          {/* Tab 2: TẤT CẢ TRÒ CHƠI (Mục chuyển tiếp chứa đầy đủ 10 trò chơi hiện có) */}
          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              setActiveTab('all-games');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm transition-all cursor-pointer shadow-2xs ${
              activeTab === 'all-games'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>TẤT CẢ TRÒ CHƠI ({GAMES_CATALOG.length} TRÒ CHƠI)</span>
          </button>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-['Be_Vietnam_Pro'] font-black text-xs sm:text-sm transition-all cursor-pointer shadow-2xs active:scale-95 ml-auto"
          >
            <Home className="w-4 h-4 text-emerald-600" />
            <span>Về Trang chủ</span>
          </button>
        )}
      </div>

      {/* 3. MAIN CONTENT BASED ON ACTIVE TAB */}

      {/* TAB 1: 8 KHU VUI CHƠI (Bố cục 4 cột × 2 hàng trên máy tính/TV, 2 cột × 4 hàng trên iPad) */}
      {activeTab === 'zones' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-['Be_Vietnam_Pro'] font-black text-base sm:text-lg text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-amber-500" />
              <span>DANH SÁCH 8 KHU VUI CHƠI TOÁN HỌC</span>
            </h2>
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">
              Bấm vào từng khu vực để khám phá
            </span>
          </div>

          {/* Grid 4 columns × 2 rows on Desktop/TV, 2 columns × 4 rows on iPad, responsive on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {GAME_PARK_ZONES.map((zone) => (
              <div
                key={zone.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectZone(zone)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectZone(zone);
                  }
                }}
                className={`group relative rounded-3xl overflow-hidden border-3 ${zone.borderTheme} shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-2 hover:scale-[1.01] bg-white min-h-[390px] sm:min-h-[410px] text-left select-none`}
              >
                {/* LỚP 1 – ẢNH NỀN 3D CHIBI (Tỷ lệ 4:3, position center top, giữ nguyên nét) */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  {zone.imageSrc ? (
                    <img
                      src={zone.imageSrc}
                      alt={zone.nameVi}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <ZoneIllustration
                      type={zone.illustrationType}
                      imageSrc={zone.imageSrc}
                      alt={zone.nameVi}
                    />
                  )}
                </div>

                {/* LỚP 2 – GRADIENT TRẮNG KEM CHUYỂN SẮC
                    - Từ 0% đến 46%: trong suốt 100% để giữ trọn vẹn hình ảnh rõ nét và bảng tên 3D
                    - Từ 46% đến 65%: chuyển sắc mềm mại từ trong suốt sang trắng kem
                    - Từ 65% đến 100%: lớp phủ trắng kem bán trong suốt (độ phủ 75% - 95%) làm dịu chi tiết ảnh, nổi bật chữ HTML
                */}
                <div
                  className="absolute inset-0 z-1 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 46%, rgba(255, 253, 247, 0.40) 56%, rgba(255, 253, 247, 0.78) 68%, rgba(255, 255, 255, 0.94) 84%, rgba(255, 255, 255, 0.98) 100%)',
                  }}
                />

                {/* LỚP 3 – NỘI DUNG WEB APP (Nằm trên cùng z-10, hoàn toàn sắc nét, không bị mờ) */}
                {/* VÙNG TRÊN (60–65%): Để lộ trọn vẹn hình ảnh 3D và bảng tên tiếng Việt trong ảnh */}
                <div className="relative z-10 p-3 sm:p-3.5 flex items-start justify-between pointer-events-none">
                  <div
                    className="text-white text-[10px] sm:text-[11px] font-black px-2.5 py-1 rounded-full shadow-md backdrop-blur-2xs flex items-center gap-1"
                    style={{ backgroundColor: zone.accentHex }}
                  >
                    <span>Khu {zone.number}</span>
                  </div>
                </div>

                {/* VÙNG DƯỚI (35–40%): Toàn bộ chữ Web App nằm trên nền trắng kem dịu mắt */}
                <div className="relative z-10 p-3.5 sm:p-4 pt-1 flex flex-col justify-end space-y-1.5 mt-auto">
                  <div className="text-center space-y-0.5">
                    <h3 className="font-['Be_Vietnam_Pro'] font-black text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug drop-shadow-2xs">
                      {zone.nameVi}
                    </h3>

                    <div
                      className="text-[10px] sm:text-[11px] font-black tracking-wider uppercase font-['Be_Vietnam_Pro']"
                      style={{ color: zone.accentHex }}
                    >
                      {zone.nameEn}
                    </div>

                    <p className="text-[11px] sm:text-xs text-slate-700 font-semibold line-clamp-2 px-1 pt-0.5 leading-relaxed">
                      {zone.topicTitleVi}
                    </p>
                  </div>

                  {/* Đáy thẻ: Chấm màu chủ đề & nút Khám phá */}
                  <div className="pt-2 border-t border-slate-200/90 flex items-center justify-between text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <span
                        className="w-2.5 h-2.5 rounded-full shadow-2xs shrink-0"
                        style={{ backgroundColor: zone.accentHex }}
                      />
                      <span>{zone.colorName}</span>
                    </span>

                    <span className="text-blue-600 font-black group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5 text-xs">
                      <span>Khám phá</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TẤT CẢ TRÒ CHƠI (Chứa đầy đủ 10 trò chơi hiện có để học sinh chơi bình thường) */}
      {activeTab === 'all-games' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-['Be_Vietnam_Pro'] font-black text-base sm:text-lg text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-blue-600" />
              <span>TẤT CẢ 10 TRÒ CHƠI TOÁN HỌC ĐANG MỞ SẴN</span>
            </h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ✓ Đầy đủ 10 trò chơi
            </span>
          </div>

          {/* Grid of 10 Games */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GAMES_CATALOG.map((game) => {
              const hasBadge = student.badges.includes(game.badgeName);

              return (
                <div
                  key={game.id}
                  className="bg-white rounded-3xl border-2 border-slate-200/80 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  {game.imageSrc ? (
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img
                        src={game.imageSrc}
                        alt={game.nameVi}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl filter drop-shadow">{game.icon}</span>
                          {hasBadge && (
                            <span className="bg-yellow-400 text-yellow-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Đã nhận cúp
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-black font-heading text-white drop-shadow-md mt-1">
                          {game.nameVi}
                        </h3>
                        <div className="text-xs font-semibold text-yellow-200">
                          {game.nameEn}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`p-5 bg-gradient-to-r ${game.themeColor} text-white relative overflow-hidden`}>
                      <div className="flex items-center justify-between">
                        <span className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">
                          {game.icon}
                        </span>
                        {hasBadge && (
                          <span className="bg-yellow-400 text-yellow-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Đã nhận cúp
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-black font-heading mt-3 text-white drop-shadow-xs">
                        {game.nameVi}
                      </h3>
                      <div className="text-xs font-semibold text-white/90">
                        {game.nameEn}
                      </div>
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
                      {langMode === 'en' ? game.storyEn : game.taglineVi}
                    </p>

                    <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-500 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-600">Phần thưởng:</span>
                        <span className="font-black text-amber-600">
                          {game.rewardType === 'carrot'
                            ? '🥕 Cà rốt giòn ngọt'
                            : game.rewardType === 'trophy'
                            ? '🏆 Cúp vàng Grand Prix'
                            : game.rewardType === 'fish'
                            ? '🐟 Cá tươi ngon'
                            : '🗝️ Chìa khóa vàng'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-600">Huy hiệu:</span>
                        <span className="font-semibold text-purple-700">{game.badgeName}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleLaunchGame(game.id)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 group-hover:shadow-sky-400/30"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>CHƠI NGAY – PLAY NOW!</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
