/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentProfile, LanguageMode } from '../../types';
import { soundService } from '../../services/audioService';
import { onSyncStatusChange, SyncStatus } from '../../services/firebaseService';
import {
  Volume2,
  VolumeX,
  Languages,
  Award,
  Users,
  LogOut,
  ShieldCheck,
  Settings,
  Star,
  Cloud,
  RefreshCw,
} from 'lucide-react';

interface TopNavBarProps {
  student: StudentProfile | null;
  activeNav: string;
  onNavigate: (nav: string) => void;
  langMode: LanguageMode;
  onSetLangMode: (mode: LanguageMode) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenTeacher: () => void;
  onOpenPronunciationStudio?: () => void;
  onOpenVisualAudit?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  student,
  activeNav,
  onNavigate,
  langMode,
  onSetLangMode,
  onOpenLogin,
  onLogout,
  onOpenTeacher,
  onOpenPronunciationStudio,
  onOpenVisualAudit,
}) => {
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [audioSettings, setAudioSettings] = useState(soundService.getSettings());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');

  useEffect(() => {
    return onSyncStatusChange((s) => setSyncStatus(s));
  }, []);

  const handleToggleSfx = () => {
    const next = !audioSettings.sfxEnabled;
    const updated = { ...audioSettings, sfxEnabled: next };
    setAudioSettings(updated);
    soundService.updateSettings(updated);
  };

  const handleToggleSpeech = () => {
    const next = !audioSettings.speechEnabled;
    const updated = { ...audioSettings, speechEnabled: next };
    setAudioSettings(updated);
    soundService.updateSettings(updated);
  };

  const handleToggleBgm = () => {
    const next = !audioSettings.bgmEnabled;
    const updated = { ...audioSettings, bgmEnabled: next };
    setAudioSettings(updated);
    soundService.updateSettings(updated);
  };

  const handleCycleLanguage = () => {
    soundService.playClick();
    if (langMode === 'bilingual') {
      onSetLangMode('vi');
    } else if (langMode === 'vi') {
      onSetLangMode('en');
    } else {
      onSetLangMode('bilingual');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#2563EB] text-white shadow-md border-b-2 border-blue-700 select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 md:h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand Wordmark & Robot Chibi */}
        <button
          onClick={() => {
            onNavigate('home');
            soundService.playClick();
          }}
          className="flex items-center gap-2 sm:gap-2.5 text-left shrink-0 cursor-pointer group"
        >
          <span className="text-3xl md:text-4xl filter drop-shadow animate-float">🤖</span>
          <div className="whitespace-nowrap">
            <div className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight font-heading leading-tight group-hover:text-blue-100 transition-colors">
              Vương Quốc Toán Học
            </div>
            <div className="text-[10px] md:text-xs font-black uppercase tracking-wider text-[#FACC15]">
              Math Adventure · Tiểu học Trần Đại Nghĩa
            </div>
          </div>
        </button>

        {/* Zone 2: Horizontal Navigation Bar (7 main existing sections on Desktop/TV) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 md:gap-2 text-xs font-black overflow-x-auto scrollbar-none py-1">
          {[
            { id: 'home', labelVi: 'Trang chủ', icon: '🏠' },
            { id: 'lessons', labelVi: 'Học bài', icon: '📚' },
            { id: 'topics', labelVi: 'Chủ đề', icon: '🏝️' },
            { id: 'games', labelVi: 'Trò chơi', icon: '🎮' },
            { id: 'daily', labelVi: 'Thử thách', icon: '🔥' },
            { id: 'review', labelVi: 'Ôn tập', icon: '📝' },
            { id: 'achievements', labelVi: 'Thành tích', icon: '🏆' },
          ].map((item) => {
            const isAct = activeNav === item.id || (item.id === 'lessons' && activeNav === 'lesson-detail');

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  soundService.playClick();
                }}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  isAct
                    ? 'bg-white text-[#2563EB] shadow-md ring-2 ring-white/60 font-black scale-105'
                    : 'text-blue-100 hover:bg-blue-600/80 hover:text-white font-bold'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.labelVi}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Utility Controls & Student Status */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Online Sync Status Indicator */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-700/80 border border-blue-400/40 text-[11px] font-bold text-white shadow-2xs select-none"
            title={
              syncStatus === 'synced'
                ? 'Đã đồng bộ trực tuyến dữ liệu học sinh & đề thi'
                : syncStatus === 'syncing'
                ? 'Đang đồng bộ dữ liệu lên hệ thống...'
                : 'Đang hoạt động ngoại tuyến (Dữ liệu đã lưu an toàn trên máy)'
            }
          >
            {syncStatus === 'synced' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span className="hidden xl:inline text-sky-100 font-extrabold text-[10px]">Đã đồng bộ</span>
              </>
            ) : syncStatus === 'syncing' ? (
              <>
                <RefreshCw className="w-3 h-3 text-amber-300 animate-spin" />
                <span className="hidden xl:inline text-amber-200 font-extrabold text-[10px]">Đang đồng bộ</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="hidden xl:inline text-slate-200 font-extrabold text-[10px]">Ngoại tuyến</span>
              </>
            )}
          </div>

          {/* Language Mode Toggle Button */}
          <button
            onClick={handleCycleLanguage}
            title="Đổi chế độ ngôn ngữ (Song ngữ / Tiếng Việt / English)"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-700/80 hover:bg-blue-800 border border-blue-400/40 text-white text-xs font-black transition-all cursor-pointer whitespace-nowrap"
          >
            <Languages className="w-3.5 h-3.5 text-blue-200" />
            <span className="hidden sm:inline">
              {langMode === 'bilingual' ? 'Song Ngữ' : langMode === 'vi' ? 'Tiếng Việt' : 'English'}
            </span>
          </button>

          {/* Pronunciation Studio Trigger Button */}
          {onOpenPronunciationStudio && (
            <button
              onClick={() => {
                onOpenPronunciationStudio();
                soundService.playClick();
              }}
              title="Phòng luyện phát âm tiếng Anh chuẩn (en-US)"
              className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-700/80 hover:bg-blue-800 border border-blue-400/40 text-white text-xs font-black transition-all cursor-pointer whitespace-nowrap"
            >
              <span>🎙️</span>
              <span>Phát âm</span>
            </button>
          )}

          {/* Audio Controls Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowAudioMenu(!showAudioMenu)}
              className="p-1.5 sm:p-2 rounded-xl bg-blue-700/80 hover:bg-blue-800 border border-blue-400/40 text-white cursor-pointer"
              title="Cài đặt âm thanh"
            >
              {audioSettings.sfxEnabled || audioSettings.speechEnabled ? (
                <Volume2 className="w-4 h-4 text-[#FACC15]" />
              ) : (
                <VolumeX className="w-4 h-4 text-blue-300" />
              )}
            </button>

            {/* Audio Dropdown Popover */}
            {showAudioMenu && (
              <div className="absolute right-0 top-12 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 space-y-2 z-50 text-xs font-bold text-slate-700">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Cài đặt âm thanh
                </div>
                <button
                  onClick={handleToggleSpeech}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <span>Giọng đọc Robot</span>
                  <span className={audioSettings.speechEnabled ? 'text-emerald-600 font-black' : 'text-slate-400'}>
                    {audioSettings.speechEnabled ? 'Bật' : 'Tắt'}
                  </span>
                </button>
                <button
                  onClick={handleToggleSfx}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <span>Hiệu ứng vui nhộn</span>
                  <span className={audioSettings.sfxEnabled ? 'text-emerald-600 font-black' : 'text-slate-400'}>
                    {audioSettings.sfxEnabled ? 'Bật' : 'Tắt'}
                  </span>
                </button>
                <button
                  onClick={handleToggleBgm}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <span>Nhạc nền nhẹ nhàng</span>
                  <span className={audioSettings.bgmEnabled ? 'text-emerald-600 font-black' : 'text-slate-400'}>
                    {audioSettings.bgmEnabled ? 'Bật' : 'Tắt'}
                  </span>
                </button>

                {onOpenPronunciationStudio && (
                  <div className="pt-1.5 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowAudioMenu(false);
                        onOpenPronunciationStudio();
                        soundService.playClick();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-black cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <span>🎙️</span>
                        <span>Phòng luyện phát âm</span>
                      </span>
                      <span className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded font-black">
                        en-US
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Teacher Portal Entry Button */}
          <button
            onClick={() => {
              onOpenTeacher();
              soundService.playClick();
            }}
            title="Dành cho Giáo viên"
            className="p-1.5 sm:p-2 rounded-xl bg-blue-700/80 hover:bg-blue-800 border border-blue-400/40 text-white cursor-pointer text-xs font-black flex items-center gap-1"
          >
            <ShieldCheck className="w-4 h-4 text-blue-200" />
            <span className="hidden md:inline">Giáo viên</span>
          </button>

          {/* Student Badge or Login CTA */}
          {student ? (
            <div className="flex items-center gap-1.5 pl-1">
              <button
                onClick={() => {
                  onNavigate('achievements');
                  soundService.playClick();
                }}
                className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-2xl bg-blue-700/80 border border-blue-400/50 hover:bg-blue-800 text-white transition-all cursor-pointer shadow-xs"
              >
                <span className="text-xl">{student.avatar || '🤖'}</span>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-black text-white leading-tight">
                    {student.fullName}
                  </div>
                  <div className="text-[10px] text-blue-200 font-bold flex items-center gap-1">
                    <span>Lớp {student.className}</span>
                    <span>·</span>
                    <span className="text-[#FACC15] font-black">⭐ {student.totalStars}</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  onOpenLogin();
                  soundService.playClick();
                }}
                title="Đổi học sinh"
                className="p-1.5 sm:p-2 rounded-xl bg-blue-700/80 hover:bg-blue-800 border border-blue-400/40 text-blue-200 cursor-pointer"
              >
                <Users className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onLogout();
                  soundService.playClick();
                }}
                title="Đăng xuất"
                className="p-1.5 sm:p-2 rounded-xl bg-blue-700/80 hover:bg-rose-600 border border-blue-400/40 text-blue-200 hover:text-white cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="py-1.5 sm:py-2 px-3 sm:px-4 bg-[#FACC15] hover:bg-yellow-400 text-slate-900 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>

      {/* Mobile-Only Horizontal Sub-Navigation Bar (7 Sections, Swipeable, Large Touch Targets >= 44px) */}
      <div className="md:hidden bg-blue-700/95 border-t border-blue-600/60 px-2 py-1.5 overflow-x-auto scrollbar-none flex items-center gap-1.5">
        {[
          { id: 'home', labelVi: 'Trang chủ', icon: '🏠' },
          { id: 'lessons', labelVi: 'Học bài', icon: '📚' },
          { id: 'topics', labelVi: 'Chủ đề', icon: '🏝️' },
          { id: 'games', labelVi: 'Trò chơi', icon: '🎮' },
          { id: 'daily', labelVi: 'Thử thách', icon: '🔥' },
          { id: 'review', labelVi: 'Ôn tập', icon: '📝' },
          { id: 'achievements', labelVi: 'Thành tích', icon: '🏆' },
        ].map((item) => {
          const isAct = activeNav === item.id || (item.id === 'lessons' && activeNav === 'lesson-detail');

          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                soundService.playClick();
              }}
              className={`min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer text-xs font-black shrink-0 ${
                isAct
                  ? 'bg-white text-[#2563EB] shadow-md ring-2 ring-white/60 font-black scale-102'
                  : 'text-blue-100 hover:bg-blue-600/80 hover:text-white font-bold'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.labelVi}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
