/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lesson, StudentProfile, LanguageMode } from '../../types';
import { LESSONS, TOPICS } from '../../data/curriculumData';
import { soundService } from '../../services/audioService';
import { BookOpen, Search, Sparkles, Gamepad2, Play } from 'lucide-react';

interface LessonListViewProps {
  student: StudentProfile;
  langMode: LanguageMode;
  onSelectLesson: (lesson: Lesson) => void;
  onLaunchGame: (gameId: string) => void;
}

export const LessonListView: React.FC<LessonListViewProps> = ({
  student,
  langMode,
  onSelectLesson,
  onLaunchGame,
}) => {
  const [selectedVolume, setSelectedVolume] = useState<'all' | 1 | 2>('all');
  const [selectedTopicId, setSelectedTopicId] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLessons = LESSONS.filter((l) => {
    if (selectedVolume !== 'all' && l.volume !== selectedVolume) return false;
    if (selectedTopicId !== 'all' && l.topicId !== selectedTopicId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        l.title.toLowerCase().includes(q) ||
        l.enTitle.toLowerCase().includes(q) ||
        l.summary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative z-10 space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-sky-100">
            <BookOpen className="w-3.5 h-3.5" /> SGK Kết Nối Tri Thức Với Cuộc Sống
          </div>
          <h2 className="text-2xl md:text-3xl font-black font-heading drop-shadow">
            HỌC THEO BÀI – 41 BÀI HỌC TOÁN LỚP 1
          </h2>
          <p className="text-xs md:text-sm text-sky-100 font-medium max-w-xl">
            Tất cả 41 bài học đều được mở sẵn! Bé tự do lựa chọn bất kỳ bài học nào để cùng Robot khám phá kiến thức và luyện tập!
          </p>
        </div>

        <div className="relative z-10 bg-white/90 backdrop-blur-xs text-slate-800 p-4 rounded-2xl shadow-sm text-center">
          <div className="text-xs text-slate-500 font-bold">Tổng số bài học</div>
          <div className="text-2xl font-black text-sky-600">41 Bài Học</div>
          <div className="text-[10px] text-emerald-600 font-black mt-0.5">🔓 Mở khóa 100%</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Volume Segments */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto">
          <button
            onClick={() => {
              setSelectedVolume('all');
              soundService.playClick();
            }}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
              selectedVolume === 'all'
                ? 'bg-white text-sky-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả (41 bài)
          </button>
          <button
            onClick={() => {
              setSelectedVolume(1);
              soundService.playClick();
            }}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
              selectedVolume === 1
                ? 'bg-white text-sky-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tập Một (Bài 1 - 20)
          </button>
          <button
            onClick={() => {
              setSelectedVolume(2);
              soundService.playClick();
            }}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
              selectedVolume === 2
                ? 'bg-white text-sky-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tập Hai (Bài 21 - 41)
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên bài học..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm font-semibold focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Topics Quick Dropdown Filter */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => {
            setSelectedTopicId('all');
            soundService.playClick();
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            selectedTopicId === 'all'
              ? 'bg-sky-500 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Tất cả chủ đề
        </button>
        {TOPICS.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedTopicId(t.id);
              soundService.playClick();
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedTopicId === t.id
                ? 'bg-indigo-500 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{t.icon} CĐ {t.id}</span>
          </button>
        ))}
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-3xl p-5 border-2 border-slate-200/80 hover:border-sky-400 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-md">
                  Tập {lesson.volume} · Chủ đề {lesson.topicId}
                </span>
                <span className="text-[11px] font-black text-emerald-600 flex items-center gap-1">
                  <span>🔓</span> Mở sẵn
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900 font-heading group-hover:text-sky-600 transition-colors">
                {lesson.title}
              </h3>
              <div className="text-xs font-semibold text-slate-400">
                {lesson.enTitle}
              </div>

              <p className="text-xs text-slate-600 font-medium line-clamp-2">
                {lesson.summary}
              </p>

              {/* Vocab snippet */}
              <div className="flex flex-wrap gap-1 pt-1">
                {lesson.vocab.slice(0, 3).map((v, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100"
                  >
                    {v.en} ({v.vi})
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={() => {
                  soundService.playClick();
                  onSelectLesson(lesson);
                }}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-extrabold text-xs md:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <BookOpen className="w-4 h-4" />
                <span>HỌC BÀI NÀY NGAY</span>
              </button>

              {lesson.recommendedGameId && (
                <button
                  onClick={() => {
                    soundService.playClick();
                    onLaunchGame(lesson.recommendedGameId);
                  }}
                  className="w-full py-1.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Chơi trò chơi liên quan</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
