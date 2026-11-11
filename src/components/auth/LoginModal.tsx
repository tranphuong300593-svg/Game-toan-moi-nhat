/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ALL_CLASSES, GradeClass, StudentProfile } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundService } from '../../services/audioService';
import { RobotMathChibi } from '../chibi/RobotMathChibi';
import { Sparkles, Users, Award, BookOpen, ShieldAlert } from 'lucide-react';

interface LoginModalProps {
  onLoginSuccess: (student: StudentProfile) => void;
  isOpen: boolean;
  onClose?: () => void;
}

const AVATARS = ['🤖', '🐰', '🐧', '🐻', '🐱', '🦖', '🦊', '🦁', '🚀', '⭐'];

export const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess, isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [selectedClass, setSelectedClass] = useState<GradeClass>('1/1');
  const [selectedAvatar, setSelectedAvatar] = useState('🤖');
  const [errorMsg, setErrorMsg] = useState('');

  const recentProfiles = StorageService.getProfiles();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = fullName.trim();
    if (!clean) {
      setErrorMsg('Bé hoặc quý thầy cô vui lòng nhập họ và tên của bé nhé!');
      soundService.playIncorrect();
      return;
    }
    if (clean.length > 35) {
      setErrorMsg('Tên bé dài tối đa 35 ký tự nhé!');
      return;
    }

    soundService.playCorrect();
    const profile = StorageService.loginOrRegister(clean, selectedClass, selectedAvatar);
    onLoginSuccess(profile);
  };

  const handleSelectRecent = (profile: StudentProfile) => {
    soundService.playClick();
    StorageService.setCurrentStudent(profile);
    onLoginSuccess(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-sky-300 overflow-hidden my-6">
        {/* Playful Header Banner */}
        <div className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-2 right-4 opacity-20">
            <Sparkles className="w-24 h-24" />
          </div>

          <div className="flex justify-center mb-2">
            <RobotMathChibi expression="waving" size="md" className="animate-float" />
          </div>

          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider font-heading drop-shadow">
            Vương Quốc Toán Học Song Ngữ
          </h2>
          <div className="text-sm font-extrabold tracking-widest text-yellow-200 uppercase mt-0.5">
            Math Adventure – Grade 1
          </div>
          <div className="text-[11px] font-bold text-sky-100 bg-white/20 inline-block px-3 py-0.5 rounded-full mt-1.5 backdrop-blur-xs">
            Trường Tiểu học Trần Đại Nghĩa · P. Hòa Xuân, TP Đà Nẵng
          </div>
          <p className="text-xs text-sky-100 font-medium mt-1">
            “Học Toán thật vui – Khám phá tiếng Anh mỗi ngày!”
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Greeting Tagline */}
          <div className="text-center">
            <div className="inline-block bg-amber-100 text-amber-800 text-xs md:text-sm font-bold px-4 py-1.5 rounded-full border border-amber-300 shadow-xs">
              🌟 Chào mừng nhà toán học nhí! 🌟
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Field 1: Họ tên */}
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5">
                Họ và tên học sinh <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Ví dụ: Nguyễn Minh Anh"
                className="w-full px-4 py-3 text-base md:text-lg font-semibold rounded-2xl border-2 border-sky-200 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all bg-sky-50/40 text-slate-800 placeholder:text-slate-400"
                autoFocus
              />
              {errorMsg && (
                <p className="text-xs text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
                  <span>⚠️</span> {errorMsg}
                </p>
              )}
            </div>

            {/* Field 2: Chọn lớp (Đúng 26 lớp 1/1 đến 1/26) */}
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5">
                Chọn lớp học (Lớp 1/1 đến 1/26) <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value as GradeClass)}
                className="w-full px-4 py-3 text-base md:text-lg font-bold rounded-2xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 bg-indigo-50/40 text-indigo-900 cursor-pointer"
              >
                {ALL_CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    Lớp {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5">
                Chọn nhân vật đồng hành yêu thích
              </label>
              <div className="flex flex-wrap gap-2 justify-center p-2 bg-slate-50 rounded-2xl border border-slate-200">
                {AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(emoji);
                      soundService.playClick();
                    }}
                    className={`text-2xl p-2 rounded-xl transition-transform ${
                      selectedAvatar === emoji
                        ? 'bg-sky-400 scale-125 shadow-md ring-2 ring-sky-300'
                        : 'hover:bg-slate-200 hover:scale-110'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Big Action Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-lg md:text-xl rounded-2xl shadow-lg shadow-emerald-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border-b-4 border-emerald-700"
            >
              <span>BẮT ĐẦU KHÁM PHÁ – LET'S GO!</span>
              <span className="text-2xl animate-bounce">🚀</span>
            </button>
          </form>

          {/* Quick Profile Switching for Same-Device Classroom or Home sharing */}
          {recentProfiles.length > 0 && (
            <div className="border-t border-slate-200 pt-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Học sinh đã đăng nhập trên máy này
              </div>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                {recentProfiles.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectRecent(p)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 hover:border-sky-400 text-xs font-semibold text-slate-800 transition-all text-left cursor-pointer"
                  >
                    <span className="text-base">{p.avatar || '🤖'}</span>
                    <span>
                      <strong className="text-sky-900">{p.fullName}</strong> ({p.className})
                    </span>
                    <span className="text-amber-500 font-bold ml-1">⭐ {p.totalStars}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cloud Synchronization Notice */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 text-xs text-emerald-950 flex items-start gap-2 shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Đồng bộ trực tuyến:</strong> Kết quả học tập và số sao của bé được tự động đồng bộ lên hệ thống trực tuyến. Thầy cô giáo có thể theo dõi kết quả của cả 26 lớp dễ dàng trên mọi thiết bị.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
