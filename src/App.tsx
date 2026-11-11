/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentProfile, LanguageMode, Lesson } from './types';
import { StorageService } from './services/storageService';
import { soundService } from './services/audioService';
import { TopNavBar } from './components/navigation/TopNavBar';
import { LoginModal } from './components/auth/LoginModal';
import { HomeDashboard } from './components/home/HomeDashboard';
import { LessonListView } from './components/learn/LessonListView';
import { LessonDetailView } from './components/learn/LessonDetailView';
import { TopicListView } from './components/learn/TopicListView';
import { GameWorldView } from './components/games/GameWorldView';
import { DailyChallengeView } from './components/daily/DailyChallengeView';
import { MyAchievementsView } from './components/achievements/MyAchievementsView';
import { MathReviewView } from './components/review/MathReviewView';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { RobotMathChibi } from './components/chibi/RobotMathChibi';
import { PronunciationStudioModal } from './components/audio/PronunciationStudioModal';
import { VisualAuditModal } from './components/teacher/VisualAuditModal';

export default function App() {
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPronunciationOpen, setIsPronunciationOpen] = useState(false);
  const [isVisualAuditOpen, setIsVisualAuditOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [targetGameId, setTargetGameId] = useState<string | null>(null);
  const [langMode, setLangMode] = useState<LanguageMode>('bilingual');

  // Load active student on mount - if not logged in, prompt login
  useEffect(() => {
    const student = StorageService.getCurrentStudent();
    if (student) {
      setCurrentStudent(student);
    } else {
      setIsLoginOpen(true);
    }
  }, []);

  const handleLoginSuccess = (student: StudentProfile) => {
    setCurrentStudent(student);
    setIsLoginOpen(false);
    setActiveSection('home');
  };

  const handleLogout = () => {
    StorageService.logout();
    setCurrentStudent(null);
    setIsLoginOpen(true);
    setActiveSection('home');
    setActiveLesson(null);
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setActiveSection('lesson-detail');
  };

  const handleLaunchGame = (gameId: string) => {
    setTargetGameId(gameId);
    setActiveSection('games');
    setActiveLesson(null);
  };

  const [isPlayingGame, setIsPlayingGame] = useState<boolean>(false);
  const [isReviewExamActive, setIsReviewExamActive] = useState<boolean>(false);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    if (section !== 'lesson-detail') {
      setActiveLesson(null);
    }
    if (section !== 'games') {
      setTargetGameId(null);
      setIsPlayingGame(false);
    }
    if (section !== 'review') {
      setIsReviewExamActive(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isFullScreenView =
    activeSection === 'lesson-detail' ||
    activeSection === 'daily' ||
    (activeSection === 'games' && isPlayingGame) ||
    (activeSection === 'review' && isReviewExamActive);

  return (
    <div
      className={`w-full bg-gradient-to-b from-sky-50 via-teal-50/30 to-amber-50/40 text-slate-800 flex flex-col font-sans select-none ${
        isFullScreenView
          ? activeSection === 'lesson-detail'
            ? 'min-h-screen min-h-[100dvh] md:h-screen md:h-[100dvh] md:max-h-[100dvh] overflow-y-auto md:overflow-hidden p-0'
            : 'min-h-screen min-h-[100dvh] md:h-screen md:h-[100dvh] md:max-h-[100dvh] overflow-y-auto md:overflow-hidden p-1 sm:p-2.5'
          : 'min-h-screen overflow-x-hidden'
      }`}
    >
      {/* Top Header Navigation Bar - Hidden in full-screen views (lesson-detail & daily) for automatic zero-scroll learning */}
      {!isFullScreenView && (
        <TopNavBar
          student={currentStudent}
          activeNav={activeSection}
          onNavigate={handleNavigate}
          langMode={langMode}
          onSetLangMode={setLangMode}
          onOpenLogin={() => setIsLoginOpen(true)}
          onLogout={handleLogout}
          onOpenTeacher={() => handleNavigate('teacher')}
          onOpenPronunciationStudio={() => setIsPronunciationOpen(true)}
          onOpenVisualAudit={() => setIsVisualAuditOpen(true)}
        />
      )}

      {/* Main Container Area */}
      <main
        className={`w-full mx-auto flex flex-col ${
          isFullScreenView
            ? activeSection === 'lesson-detail'
              ? 'flex-1 min-h-0 md:h-full md:max-h-full overflow-y-auto md:overflow-hidden p-0'
              : 'flex-1 min-h-0 md:h-full md:max-h-full overflow-y-auto md:overflow-hidden p-0 md:items-center md:justify-center'
            : 'flex-1 max-w-7xl p-3 sm:p-6 md:p-8'
        }`}
      >
        {/* If no student logged in and modal closed */}
        {!currentStudent && !isLoginOpen && (
          <div className="bg-white rounded-3xl p-8 text-center max-w-lg mx-auto shadow-md border-2 border-sky-200 space-y-4 my-12">
            <RobotMathChibi expression="waving" size="lg" className="animate-float" />
            <h2 className="text-2xl font-black text-slate-800 font-heading">
              Chào mừng bạn đến với Vương Quốc Toán Học!
            </h2>
            <p className="text-sm text-slate-600 font-semibold">
              Vui lòng nhập họ tên và chọn lớp để bắt đầu hành trình khám phá!
            </p>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="py-3 px-8 bg-sky-500 hover:bg-sky-600 text-white font-black text-base rounded-2xl shadow-md transition-all cursor-pointer"
            >
              Đăng nhập ngay
            </button>
          </div>
        )}

        {/* Content Views */}
        {currentStudent && activeSection === 'home' && (
          <HomeDashboard
            student={currentStudent}
            langMode={langMode}
            onNavigate={handleNavigate}
            onOpenLogin={() => setIsLoginOpen(true)}
            onLogout={handleLogout}
          />
        )}

        {currentStudent && activeSection === 'lessons' && (
          <LessonListView
            student={currentStudent}
            langMode={langMode}
            onSelectLesson={handleSelectLesson}
            onLaunchGame={handleLaunchGame}
          />
        )}

        {currentStudent && activeSection === 'lesson-detail' && activeLesson && (
          <LessonDetailView
            key={activeLesson.id}
            lesson={activeLesson}
            student={currentStudent}
            langMode={langMode}
            onBack={() => handleNavigate('lessons')}
            onLaunchGame={handleLaunchGame}
            onUpdateStudent={setCurrentStudent}
            onFinishLesson={() => handleNavigate('lessons')}
            onSelectLesson={handleSelectLesson}
          />
        )}

        {currentStudent && activeSection === 'topics' && (
          <TopicListView
            student={currentStudent}
            langMode={langMode}
            onSelectLesson={handleSelectLesson}
            onUpdateStudent={setCurrentStudent}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentStudent && activeSection === 'games' && (
          <GameWorldView
            student={currentStudent}
            langMode={langMode}
            onUpdateStudent={setCurrentStudent}
            initialGameId={targetGameId}
            onBack={() => handleNavigate('home')}
            onActiveGameChange={setIsPlayingGame}
          />
        )}

        {currentStudent && activeSection === 'daily' && (
          <DailyChallengeView
            student={currentStudent}
            langMode={langMode}
            onUpdateStudent={setCurrentStudent}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentStudent && activeSection === 'achievements' && (
          <MyAchievementsView
            student={currentStudent}
            langMode={langMode}
            onBack={() => handleNavigate('home')}
            onNavigateToLearn={() => handleNavigate('lessons')}
          />
        )}

        {currentStudent && activeSection === 'review' && (
          <MathReviewView
            student={currentStudent}
            langMode={langMode}
            onUpdateStudent={setCurrentStudent}
            onBack={() => handleNavigate('home')}
            onFinishReview={() => handleNavigate('home')}
            onActiveExamChange={setIsReviewExamActive}
          />
        )}

        {activeSection === 'teacher' && (
          <TeacherDashboard
            onBack={() => handleNavigate('home')}
            langMode={langMode}
            onSetLangMode={setLangMode}
            onOpenPronunciationStudio={() => setIsPronunciationOpen(true)}
            onOpenVisualAudit={() => setIsVisualAuditOpen(true)}
          />
        )}
      </main>

      {/* Child-Friendly Footer - Hidden in full-screen views (lesson-detail & daily) */}
      {!isFullScreenView && (
        <footer className="bg-white border-t border-slate-200/80 py-6 mt-12 text-center text-xs text-slate-500 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-4 font-bold text-slate-600">
            <span>SGK Toán 1 – Kết nối tri thức với cuộc sống</span>
            <span>·</span>
            <span>41 Bài học & 10 Trò chơi tương tác</span>
            <span>·</span>
            <span>Chương trình Toán Tiểu học 2018</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Vương Quốc Toán Học Song Ngữ (Math Adventure Grade 1) · Trường Tiểu học Trần Đại Nghĩa, P. Hòa Xuân, TP Đà Nẵng
          </p>
        </footer>
      )}

      {/* Login / Profile Switcher Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onLoginSuccess={handleLoginSuccess}
        onClose={() => currentStudent && setIsLoginOpen(false)}
      />

      {/* English Pronunciation & Voice Testing Studio Modal */}
      <PronunciationStudioModal
        isOpen={isPronunciationOpen}
        onClose={() => setIsPronunciationOpen(false)}
      />

      {/* Teacher Math & Visual Illustration Inspection Center Modal */}
      <VisualAuditModal
        isOpen={isVisualAuditOpen}
        onClose={() => setIsVisualAuditOpen(false)}
      />
    </div>
  );
}
