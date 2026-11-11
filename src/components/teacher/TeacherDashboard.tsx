/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { ALL_CLASSES, GradeClass, StudentProfile, ActivityRecord, LanguageMode } from '../../types';
import { StorageService } from '../../services/storageService';
import { soundService } from '../../services/audioService';
import { ALL_16_EXAMS, EXAM_PERIODS } from '../../data/examReviewData';
import { FirebaseSyncService, SyncStatus, onSyncStatusChange } from '../../services/firebaseService';
import {
  Users,
  Download,
  Lock,
  Settings,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Search,
  BookOpen,
  FileCheck,
  Award,
  Star,
  GraduationCap,
  LogOut,
  Calendar,
  ChevronRight,
  Info,
  RefreshCw,
  Sparkles,
  School,
  TrendingUp,
} from 'lucide-react';

interface TeacherDashboardProps {
  onBack: () => void;
  langMode: LanguageMode;
  onSetLangMode: (mode: LanguageMode) => void;
  onOpenPronunciationStudio?: () => void;
  onOpenVisualAudit?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onBack,
  langMode,
  onSetLangMode,
  onOpenPronunciationStudio,
  onOpenVisualAudit,
}) => {
  // Simple Teacher PIN Gate (Mã cố định: 1234, tuyệt đối không hiển thị mã trên giao diện)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Selected Class: null means 26 Class Cards Grid View; non-null means viewing that specific class (e.g. '1/5')
  const [selectedClass, setSelectedClass] = useState<GradeClass | null>(null);

  // Active Sub-view when inside a class or overview: 'roster' | 'settings'
  const [currentView, setCurrentView] = useState<'roster' | 'settings'>('roster');

  // Filters within the selected class
  const [searchName, setSearchName] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'not_submitted'>('all');
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>('all');

  // Student selected for detailed 16-exam inspection modal
  const [inspectStudent, setInspectStudent] = useState<StudentProfile | null>(null);

  // Teaching options
  const [questionsPerRound, setQuestionsPerRound] = useState(10);
  const [audioSettings, setAudioSettings] = useState(soundService.getSettings());

  // Live Cloud Sync Status
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  useEffect(() => {
    return onSyncStatusChange((s) => setSyncStatus(s));
  }, []);

  // Overview stats across all 26 classes from Firestore
  const [overviewStats, setOverviewStats] = useState<{
    totalStudents: number;
    totalActivities: number;
    classCounts: Record<string, number>;
  }>({
    totalStudents: 0,
    totalActivities: 0,
    classCounts: {},
  });

  // Real-time overview listener across 26 classes
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsub = FirebaseSyncService.subscribeOverviewStats((stats) => {
      setOverviewStats(stats);
    });
    return () => unsub();
  }, [isAuthenticated]);

  // Real-time Class data when a specific class is selected
  const [classCloudStudents, setClassCloudStudents] = useState<StudentProfile[]>([]);
  const [classCloudActivities, setClassCloudActivities] = useState<ActivityRecord[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !selectedClass) return;

    // Subscribe to students in this class
    const unsubStudents = FirebaseSyncService.subscribeClassStudents(
      selectedClass,
      (students) => {
        setClassCloudStudents(students);
      },
      (err) => {
        console.warn('Real-time class students error:', err);
      }
    );

    // Subscribe to activities in this class
    const unsubActivities = FirebaseSyncService.subscribeClassActivities(
      selectedClass,
      (activities) => {
        setClassCloudActivities(activities);
      },
      (err) => {
        console.warn('Real-time class activities error:', err);
      }
    );

    return () => {
      unsubStudents();
      unsubActivities();
    };
  }, [isAuthenticated, selectedClass]);

  // Handle PIN Form Submit (Mã 1234 cố định)
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '1234') {
      setIsAuthenticated(true);
      setPinError('');
      soundService.playCorrect();
    } else {
      setPinError('Mã PIN chưa chính xác. Vui lòng thử lại.');
      soundService.playIncorrect();
    }
  };

  // Exit Teacher Area (Resets PIN auth and returns to Home)
  const handleExitTeacher = () => {
    setIsAuthenticated(false);
    setPinInput('');
    setPinError('');
    setSelectedClass(null);
    setInspectStudent(null);
    soundService.playClick();
    onBack();
  };

  // Combine local and cloud students for selected class to ensure 100% offline-ready & online synced
  const activeClassStudents = useMemo(() => {
    if (!selectedClass) return [];
    const local = StorageService.getClassStudents(selectedClass);

    // Map by canonical ID
    const mergedMap = new Map<string, StudentProfile>();
    local.forEach((s) => mergedMap.set(s.id, s));
    classCloudStudents.forEach((s) => mergedMap.set(s.id, s));

    const list = Array.from(mergedMap.values());
    list.sort((a, b) => a.fullName.localeCompare(b.fullName, 'vi'));
    return list;
  }, [selectedClass, classCloudStudents]);

  // Combine local and cloud activities for selected class
  const activeClassActivities = useMemo(() => {
    if (!selectedClass) return [];
    const local = StorageService.getAllRecords();
    const studentIds = new Set(activeClassStudents.map((s) => s.id));
    const localForClass = local.filter((r) => studentIds.has(r.studentId));

    const mergedMap = new Map<string, ActivityRecord>();
    localForClass.forEach((r) => mergedMap.set(r.id, r));
    classCloudActivities.forEach((r) => mergedMap.set(r.id, r));

    return Array.from(mergedMap.values());
  }, [selectedClass, activeClassStudents, classCloudActivities]);

  // Helper to extract student exam stats
  const getStudentStats = (studentId: string) => {
    const studentRecords = activeClassActivities.filter((r) => r.studentId === studentId);
    const reviewRecords = studentRecords.filter((r) => r.type === 'review');

    // Group records by testId (highest score)
    const completedExams = new Map<string, { score: number; completedAt: string; targetName: string }>();
    reviewRecords.forEach((r) => {
      const key = String(r.targetId);
      const existing = completedExams.get(key);
      if (!existing || r.score > existing.score) {
        completedExams.set(key, {
          score: r.score,
          completedAt: r.completedAt,
          targetName: r.targetName,
        });
      }
    });

    const completedCount = completedExams.size;
    const avgScore =
      completedCount > 0
        ? Math.round(
            (Array.from(completedExams.values()).reduce((sum, v) => sum + v.score, 0) / completedCount) * 10
          ) / 10
        : 0;

    const latestExamRecord = reviewRecords[0] || null;

    return {
      completedExams,
      completedCount,
      avgScore,
      totalExams: 16,
      hasSubmittedAnyExam: completedCount > 0,
      latestExamRecord,
      lessonCount: studentRecords.filter((r) => r.type === 'lesson').length,
      gameCount: studentRecords.filter((r) => r.type === 'game').length,
    };
  };

  // Class Overview Stats
  const classStats = useMemo(() => {
    if (!selectedClass) {
      return { totalStudents: 0, submittedCount: 0, notSubmittedCount: 0, classAvgScore: 0 };
    }

    const total = activeClassStudents.length;
    let submitted = 0;
    let totalScoreSum = 0;
    let totalScoreExams = 0;

    activeClassStudents.forEach((s) => {
      const st = getStudentStats(s.id);
      if (st.hasSubmittedAnyExam) {
        submitted += 1;
        st.completedExams.forEach((val) => {
          totalScoreSum += val.score;
          totalScoreExams += 1;
        });
      }
    });

    const classAvgScore =
      totalScoreExams > 0 ? Math.round((totalScoreSum / totalScoreExams) * 10) / 10 : 0;

    return {
      totalStudents: total,
      submittedCount: submitted,
      notSubmittedCount: total - submitted,
      classAvgScore,
    };
  }, [selectedClass, activeClassStudents, activeClassActivities]);

  // Filtered students in current class
  const filteredClassStudents = useMemo(() => {
    return activeClassStudents.filter((st) => {
      const matchName = st.fullName.toLowerCase().includes(searchName.toLowerCase().trim());
      const stats = getStudentStats(st.id);

      let matchStatus = true;
      if (statusFilter === 'submitted') {
        matchStatus = stats.hasSubmittedAnyExam;
      } else if (statusFilter === 'not_submitted') {
        matchStatus = !stats.hasSubmittedAnyExam;
      }

      let matchExam = true;
      if (selectedExamFilter !== 'all') {
        matchExam = stats.completedExams.has(selectedExamFilter);
      }

      return matchName && matchStatus && matchExam;
    });
  }, [activeClassStudents, searchName, statusFilter, selectedExamFilter, activeClassActivities]);

  // Export CSV for current class
  const handleExportClassCSV = () => {
    if (!selectedClass) return;
    soundService.playClick();
    const csvContent = StorageService.exportClassToCSV(selectedClass);
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Ket_qua_hoc_tap_Lop_${selectedClass.replace('/', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  // =========================================================================
  // VIEW 1: CỔNG ĐĂNG NHẬP GIÁO VIÊN (MÃ PIN 1234 BẢO MẬT)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto bg-gradient-to-b from-sky-50/90 via-white to-blue-50/50 rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-sky-200 text-center space-y-6 animate-fadeIn">
          {/* Cute Teacher Mascot Illustration */}
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-200 via-blue-100 to-indigo-100 animate-pulse-subtle shadow-inner" />
            <svg viewBox="0 0 120 120" className="w-20 h-20 sm:w-24 sm:h-24 relative z-10 drop-shadow-sm select-none">
              <circle cx="60" cy="50" r="32" fill="#78350f" />
              <rect x="53" y="70" width="14" height="12" fill="#fde68a" />
              <path d="M 32 108 C 32 86, 88 86, 88 108 Z" fill="#0284c7" />
              <polygon points="60,82 50,72 70,72" fill="#ffffff" />
              <polygon points="60,82 56,102 64,102" fill="#0369a1" />
              <circle cx="60" cy="50" r="24" fill="#fed7aa" />
              <path d="M 38 46 Q 60 26 82 46 Q 60 36 38 46 Z" fill="#78350f" />
              <rect x="42" y="44" width="14" height="10" rx="3" fill="none" stroke="#be185d" strokeWidth="2" />
              <rect x="64" y="44" width="14" height="10" rx="3" fill="none" stroke="#be185d" strokeWidth="2" />
              <line x1="56" y1="49" x2="64" y2="49" stroke="#be185d" strokeWidth="2" />
              <circle cx="49" cy="49" r="2" fill="#1e293b" />
              <circle cx="71" cy="49" r="2" fill="#1e293b" />
              <path d="M 54 58 Q 60 63 66 58" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
              <polygon points="60,16 92,26 60,34 28,26" fill="#1e3a8a" />
              <rect x="47" y="27" width="26" height="7" fill="#1d4ed8" rx="2" />
              <line x1="86" y1="28" x2="88" y2="42" stroke="#f59e0b" strokeWidth="2" />
              <circle cx="88" cy="43" r="2.5" fill="#f59e0b" />
            </svg>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md border-2 border-white">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
              CỔNG QUẢN LÝ GIÁO VIÊN
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">
              Khu vực dành riêng cho giáo viên theo dõi kết quả học tập của học sinh.
            </p>
          </div>

          <form onSubmit={handleVerifyPin} className="space-y-4 max-w-xs mx-auto">
            <div>
              <input
                type="password"
                maxLength={4}
                inputMode="numeric"
                pattern="[0-9]*"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (pinError) setPinError('');
                }}
                placeholder="Nhập mã PIN giáo viên"
                className="w-full text-center px-4 py-3 text-2xl font-mono tracking-widest font-black rounded-2xl border-2 border-sky-300 focus:border-blue-600 focus:outline-none bg-white text-slate-900 shadow-xs transition-colors"
                autoFocus
              />
              {pinError && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-600 font-bold mt-2 animate-fadeIn">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-3 px-4 rounded-xl border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: 26 THẺ LỚP (GRID CỦA 26 LỚP: LỚP 1/1 ĐẾN LỚP 1/26)
  // =========================================================================
  if (selectedClass === null) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white rounded-3xl p-5 sm:p-6 shadow-lg">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider">
              <School className="w-4 h-4" /> BẢNG ĐIỀU KHIỂN GIÁO VIÊN · 26 LỚP KHỐI 1
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight drop-shadow-xs">
              CHỌN LỚP THEO DÕI HỌC TẬP
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 font-medium">
              Dữ liệu học sinh được đồng bộ trực tuyến theo từng lớp riêng biệt. Nhấn vào lớp để xem chi tiết.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
            {/* Live Sync Badge */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 border border-white/20 text-xs font-bold text-white shadow-2xs">
              {syncStatus === 'synced' ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  <span>Đồng bộ trực tuyến</span>
                </>
              ) : syncStatus === 'syncing' ? (
                <>
                  <RefreshCw className="w-3 h-3 text-amber-300 animate-spin" />
                  <span>Đang kết nối...</span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span>Ngoại tuyến</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setCurrentView(currentView === 'settings' ? 'roster' : 'settings');
                soundService.playClick();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-black text-xs transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>{currentView === 'settings' ? 'Xem các lớp' : 'Cấu hình'}</span>
            </button>

            <button
              type="button"
              onClick={handleExitTeacher}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-xs transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Thoát</span>
            </button>
          </div>
        </div>

        {/* Settings View if toggled */}
        {currentView === 'settings' && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Settings className="w-5 h-5 text-slate-700" />
              <h3 className="text-base font-black text-slate-900 font-heading">
                Tùy Chọn Lớp Học & Công Cụ Sư Phạm
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase">
                  Số câu hỏi mỗi lượt luyện tập:
                </span>
                <div className="flex items-center gap-2">
                  {[5, 10, 15].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionsPerRound(cnt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        questionsPerRound === cnt
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cnt} câu
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase">
                  Chế độ ngôn ngữ mặc định:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onSetLangMode('bilingual')}
                    className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      langMode === 'bilingual'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Song ngữ
                  </button>
                  <button
                    type="button"
                    onClick={() => onSetLangMode('vi')}
                    className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      langMode === 'vi'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Thuần Việt
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase">
                  Âm thanh & Giọng đọc:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleSpeech}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      audioSettings.speechEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    Giọng đọc: {audioSettings.speechEnabled ? 'Bật' : 'Tắt'}
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleSfx}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      audioSettings.sfxEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    Hiệu ứng: {audioSettings.sfxEnabled ? 'Bật' : 'Tắt'}
                  </button>
                </div>
              </div>
            </div>

            {/* Dedicated Tools */}
            <div className="space-y-3 pt-2">
              {onOpenPronunciationStudio && (
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-purple-950 font-bold">
                    🎙️ Phòng Kiểm Tra & Cấu Hình Phát Âm Tiếng Anh Chuẩn (en-US)
                  </div>
                  <button
                    type="button"
                    onClick={onOpenPronunciationStudio}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black cursor-pointer shadow-xs"
                  >
                    Mở Studio Phát Âm
                  </button>
                </div>
              )}
              {onOpenVisualAudit && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-emerald-950 font-bold">
                    🔬 Trung Tâm Kiểm Định Học Liệu Trực Quan & SGK Toán 1
                  </div>
                  <button
                    type="button"
                    onClick={onOpenVisualAudit}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer shadow-xs"
                  >
                    Mở Kiểm Định Trực Quan
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notice Info Card */}
        <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 flex items-start gap-3 text-xs text-sky-950 leading-relaxed shadow-2xs">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-black">Đồng bộ trực tuyến theo từng lớp:</strong> Mỗi lớp từ <strong>1/1</strong> đến <strong>1/26</strong> có một không gian dữ liệu riêng biệt. Khi học sinh làm bài trên điện thoại hoặc máy tính ở nhà, kết quả được tự động lưu lên máy chủ trực tuyến và hiển thị ngay tại thẻ lớp tương ứng.
          </div>
        </div>

        {/* 26 Class Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {ALL_CLASSES.map((cls) => {
            const count = overviewStats.classCounts[cls] || 0;
            const localCount = StorageService.getClassStudents(cls).length;
            const displayCount = Math.max(count, localCount);

            return (
              <button
                key={cls}
                type="button"
                onClick={() => {
                  setSelectedClass(cls);
                  soundService.playClick();
                }}
                className="group relative bg-white hover:bg-gradient-to-b hover:from-sky-50 hover:to-white p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md transition-all duration-200 text-left cursor-pointer flex flex-col justify-between min-h-[125px] active:scale-95"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {cls.split('/')[1]}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                </div>

                <div className="space-y-1 mt-3">
                  <div className="text-base sm:text-lg font-black text-slate-900 font-heading group-hover:text-blue-700 transition-colors">
                    LỚP {cls}
                  </div>
                  <div className="text-xs text-slate-500 font-bold flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>{displayCount} học sinh</span>
                  </div>
                </div>

                {displayCount > 0 && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: GIAO DIỆN THEO DÕI RIÊNG BIỆT CHO LỚP ĐƯỢC CHỌN (VD: LỚP 1/5)
  // =========================================================================
  return (
    <div className="w-full max-w-6xl mx-auto space-y-5 animate-fadeIn pb-12">
      {/* Class Header & Navigation */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white rounded-3xl p-5 sm:p-6 shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider">
            <School className="w-4 h-4" /> DỮ LIỆU ĐỒNG BỘ TRỰC TUYẾN · KHỐI 1
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight drop-shadow-xs flex items-center gap-2">
            <span>KẾT QUẢ HỌC TẬP – LỚP {selectedClass}</span>
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 font-medium">
            Theo dõi cụ thể học sinh lớp {selectedClass} đã làm đề thi nào, điểm số và trạng thái học tập.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
          {/* Back to 26 Classes Grid Button */}
          <button
            type="button"
            onClick={() => {
              setSelectedClass(null);
              setSearchName('');
              setStatusFilter('all');
              setSelectedExamFilter('all');
              soundService.playClick();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-black text-xs shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại 26 lớp</span>
          </button>

          {/* Export CSV for this class */}
          <button
            type="button"
            onClick={handleExportClassCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Xuất file Excel/CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExitTeacher}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-xs transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Thoát</span>
          </button>
        </div>
      </div>

      {/* Class Statistics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase">Tổng học sinh lớp {selectedClass}</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {classStats.totalStudents} <span className="text-xs font-bold text-slate-500">em</span>
          </div>
          <p className="text-[10px] text-slate-500">Đã đăng nhập trên hệ thống</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase">Đã nộp đề thi</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {classStats.submittedCount} <span className="text-xs font-bold text-slate-500">em</span>
          </div>
          <p className="text-[10px] text-slate-500">Hoàn thành ít nhất 1 đề ôn tập</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase">Chưa nộp đề thi</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">
            {classStats.notSubmittedCount} <span className="text-xs font-bold text-slate-500">em</span>
          </div>
          <p className="text-[10px] text-slate-500">Chưa nộp đề thi nào</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase">Điểm trung bình lớp</span>
            <TrendingUp className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600">
            {classStats.classAvgScore > 0 ? `${classStats.classAvgScore} / 10` : '-'}
          </div>
          <p className="text-[10px] text-slate-500">Tính trên toàn bộ đề đã nộp</p>
        </div>
      </div>

      {/* Filters Bar: Search & Status & Exam */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search by Name */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Tìm tên học sinh trong lớp..."
              className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Exam */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <span>Đề thi:</span>
              <select
                value={selectedExamFilter}
                onChange={(e) => {
                  setSelectedExamFilter(e.target.value);
                  soundService.playClick();
                }}
                className="p-2 rounded-xl border-2 border-slate-200 bg-slate-50 text-xs font-black text-slate-800 cursor-pointer focus:outline-none focus:border-blue-500"
              >
                <option value="all">Tất cả 16 đề thi</option>
                {ALL_16_EXAMS.map((ex) => (
                  <option key={ex.testId} value={ex.testId}>
                    {ex.periodTitleVi} - {ex.titleVi}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'all' ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-600'
                }`}
              >
                Tất cả ({activeClassStudents.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('submitted')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'submitted' ? 'bg-white text-emerald-700 shadow-2xs font-black' : 'text-slate-600'
                }`}
              >
                Đã nộp đề ({classStats.submittedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('not_submitted')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'not_submitted' ? 'bg-white text-amber-700 shadow-2xs font-black' : 'text-slate-600'
                }`}
              >
                Chưa nộp ({classStats.notSubmittedCount})
              </button>
            </div>
          </div>
        </div>

        {/* Student Table */}
        {filteredClassStudents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm font-semibold space-y-2">
            <div className="text-3xl">🔍</div>
            <p>Không có học sinh nào trong Lớp {selectedClass} phù hợp với bộ lọc hiện tại.</p>
          </div>
        ) : (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3 w-10 text-center">STT</th>
                  <th className="pb-3">Họ và tên</th>
                  <th className="pb-3 text-center">Tiến độ đề thi</th>
                  <th className="pb-3 text-center">Điểm thi TB</th>
                  <th className="pb-3 text-center">Số sao ⭐</th>
                  <th className="pb-3 text-center">Trạng thái</th>
                  <th className="pb-3 text-right">Lần làm bài gần nhất</th>
                  <th className="pb-3 text-center">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClassStudents.map((st, index) => {
                  const stats = getStudentStats(st.id);
                  const isSubmitted = stats.hasSubmittedAnyExam;

                  return (
                    <tr key={st.id} className="hover:bg-sky-50/40 transition-colors">
                      <td className="py-3 text-center text-slate-400 font-bold">{index + 1}</td>
                      <td className="py-3 font-black text-slate-900 flex items-center gap-2">
                        <span className="text-xl">{st.avatar || '🤖'}</span>
                        <span className="font-bold">{st.fullName}</span>
                      </td>
                      <td className="py-3 text-center font-black text-purple-700">
                        {stats.completedCount} / 16 đề
                      </td>
                      <td className="py-3 text-center">
                        {stats.completedCount > 0 ? (
                          <span className="font-black text-rose-600">{stats.avgScore} / 10</span>
                        ) : (
                          <span className="text-slate-300 italic text-xs">-</span>
                        )}
                      </td>
                      <td className="py-3 text-center font-black text-amber-500">
                        ⭐ {st.totalStars}
                      </td>
                      <td className="py-3 text-center">
                        {isSubmitted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đã nộp đề thi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-500" /> Chưa nộp đề thi
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right text-slate-400 text-xs">
                        {stats.latestExamRecord
                          ? new Date(stats.latestExamRecord.completedAt).toLocaleDateString('vi-VN')
                          : new Date(st.lastLoginAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setInspectStudent(st);
                            soundService.playClick();
                          }}
                          className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-black transition-colors cursor-pointer"
                        >
                          Xem chi tiết 16 đề
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drilldown Modal: Chi tiết 16 đề thi của học sinh */}
      {inspectStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-5 shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{inspectStudent.avatar || '🤖'}</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
                    {inspectStudent.fullName}
                  </h3>
                  <div className="text-xs text-slate-500 font-bold">
                    Lớp {inspectStudent.className} · Sao tích lũy: ⭐ {inspectStudent.totalStars}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectStudent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Student Exam Progress Breakdown */}
            {(() => {
              const stats = getStudentStats(inspectStudent.id);

              return (
                <div className="space-y-4">
                  {/* Summary Bar */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-purple-50 rounded-2xl border border-purple-200 text-center text-xs font-black">
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Đề đã làm</div>
                      <div className="text-base text-purple-700 font-black">
                        {stats.completedCount} / 16 đề
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Điểm trung bình</div>
                      <div className="text-base text-rose-600 font-black">
                        {stats.completedCount > 0 ? `${stats.avgScore} / 10` : '-'}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Huy hiệu đạt được</div>
                      <div className="text-base text-amber-600 font-black">
                        {inspectStudent.badges.length} huy hiệu
                      </div>
                    </div>
                  </div>

                  {/* 4 Periods Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {EXAM_PERIODS.map((period) => {
                      const periodExams = ALL_16_EXAMS.filter((e) => e.periodId === period.id);

                      return (
                        <div
                          key={period.id}
                          className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-purple-100 text-purple-800">
                              {period.badge}
                            </span>
                            <span className="text-xs font-bold text-slate-600">
                              {period.titleVi}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            {periodExams.map((exam) => {
                              const rec = stats.completedExams.get(exam.testId);
                              const isDone = Boolean(rec);

                              return (
                                <div
                                  key={exam.testId}
                                  className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                                    isDone
                                      ? 'bg-emerald-50/80 border-emerald-300'
                                      : 'bg-white border-slate-200'
                                  }`}
                                >
                                  <div>
                                    <div className="font-bold text-slate-900 flex items-center gap-1">
                                      <span>{exam.titleVi}</span>
                                      {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                                    </div>
                                    <div className="text-[10px] text-slate-400">{exam.titleEn}</div>
                                  </div>

                                  <div className="text-right">
                                    {isDone ? (
                                      <div>
                                        <div className="font-black text-rose-600">{rec!.score} / 10</div>
                                        <div className="text-[9px] text-emerald-700 font-bold">
                                          {new Date(rec!.completedAt).toLocaleDateString('vi-VN')}
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-[10px] text-slate-400 font-bold">
                                        Chưa làm
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <div className="text-right pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInspectStudent(null)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs cursor-pointer shadow-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
