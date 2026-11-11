/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DailyQuestion,
  DAILY_QUESTION_BANK,
  DAILY_QUESTIONS_BY_ID,
  RECOGNIZE_QUESTIONS,
  CALCULATE_QUESTIONS,
  COMPARE_QUESTIONS,
  GEOMETRY_MEASURE_QUESTIONS,
  APPLIED_QUESTIONS,
} from '../data/dailyQuestionsBank';
import { StorageService } from './storageService';

export interface DailyDayProgress {
  dateKey: string; // YYYY-MM-DD
  questionIds: string[];
  answers: Record<number, any>;
  firstTryCorrect: Record<number, boolean>;
  attemptsCount: Record<number, number>;
  currentQIndex: number;
  isCompleted: boolean;
  firstTryScore: number; // 0 to 5
  starsAwarded: number; // 0 to 5
  completedAt?: string;
}

export interface DailyChallengeStudentRecord {
  studentId: string;
  lastCompletedDateKey?: string;
  currentStreak: number;
  totalCompletedDays: number;
  unlockedBadges: string[];
  history: Record<string, DailyDayProgress>;
}

export interface DailyBadgeInfo {
  id: string;
  name: string;
  minStreak: number;
  icon: string;
  desc: string;
}

export const DAILY_STREAK_BADGES: DailyBadgeInfo[] = [
  {
    id: 'badge_diligent_3',
    name: 'Chăm chỉ',
    minStreak: 3,
    icon: '🥉',
    desc: 'Hoàn thành thử thách 3 ngày liên tiếp',
  },
  {
    id: 'badge_math_star_7',
    name: 'Ngôi sao Toán học',
    minStreak: 7,
    icon: '🥈',
    desc: 'Hoàn thành thử thách 7 ngày liên tiếp',
  },
  {
    id: 'badge_superstar_14',
    name: 'Siêu sao chăm học',
    minStreak: 14,
    icon: '🥇',
    desc: 'Hoàn thành thử thách 14 ngày liên tiếp',
  },
  {
    id: 'badge_junior_mathematician_30',
    name: 'Nhà Toán học nhí',
    minStreak: 30,
    icon: '👑',
    desc: 'Hoàn thành thử thách 30 ngày liên tiếp',
  },
];

// Helper: Seeded Pseudo-Random Number Generator (Mulberry32)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Convert string to 32-bit integer hash
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export class DailyChallengeService {
  private static STORAGE_PREFIX = 'math_adventure_daily_v2_';

  /**
   * Lấy ngày hiện tại theo múi giờ Việt Nam (Asia/Ho_Chi_Minh, UTC+7) định dạng YYYY-MM-DD.
   * Đổi ngày đúng vào 00:00 giờ Việt Nam.
   */
  public static getVietnamDateKey(date: Date = new Date()): string {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(date); // e.g. "2026-11-04"
  }

  /**
   * Lấy ngày hôm qua theo giờ Việt Nam
   */
  public static getYesterdayVietnamDateKey(todayKey: string): string {
    const [y, m, d] = todayKey.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    date.setUTCDate(date.getUTCDate() - 1);
    const prevY = date.getUTCFullYear();
    const prevM = String(date.getUTCMonth() + 1).padStart(2, '0');
    const prevD = String(date.getUTCDate()).padStart(2, '0');
    return `${prevY}-${prevM}-${prevD}`;
  }

  /**
   * Format ngày hiển thị tiếng Việt thân thiện
   */
  public static formatVietnamDateDisplay(dateKey: string): string {
    try {
      const [y, m, d] = dateKey.split('-').map(Number);
      const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
      const formatter = new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      return formatter.format(date);
    } catch {
      return dateKey;
    }
  }

  /**
   * Thuật toán chọn 5 câu hỏi có tính xác định tuyệt đối (Deterministic Seeded Selection) theo ngày.
   * - Cùng một ngày = luôn nhận cùng 5 câu hỏi.
   * - Ngày hôm trước != ngày hôm nay (tránh lặp câu hỏi hôm qua).
   * - Đảm bảo cấu trúc:
   *   Câu 1: Nhận biết (recognize)
   *   Câu 2: Tính toán (calculate)
   *   Câu 3: So sánh hoặc sắp xếp (compare_order)
   *   Câu 4: Hình học hoặc đo lường (geometry_measure)
   *   Câu 5: Vận dụng thực tế (applied)
   */
  public static generateQuestionsForDay(dateKey: string): DailyQuestion[] {
    const [y, m, d] = dateKey.split('-').map(Number);
    const dayEpoch = Math.floor(Date.UTC(y, m - 1, d) / (86400 * 1000));
    const seed = hashString(`daily_${dateKey}_seed`);
    const rng = mulberry32(seed);

    // Pick 1 from each category with dayEpoch shift to avoid repeating questions in rolling 14-day window
    const pickFromPool = (pool: DailyQuestion[], catIdx: number): DailyQuestion => {
      if (pool.length === 0) {
        return DAILY_QUESTION_BANK[0];
      }
      // Calculate rotating base index using dayEpoch with prime multipliers
      const prime = [17, 23, 29, 31, 37][catIdx] || 19;
      const jitter = Math.floor(rng() * 3);
      const index = Math.abs((dayEpoch * prime + jitter) % pool.length);
      return pool[index];
    };

    const q1 = pickFromPool(RECOGNIZE_QUESTIONS, 0);
    const q2 = pickFromPool(CALCULATE_QUESTIONS, 1);
    const q3 = pickFromPool(COMPARE_QUESTIONS, 2);
    const q4 = pickFromPool(GEOMETRY_MEASURE_QUESTIONS, 3);
    const q5 = pickFromPool(APPLIED_QUESTIONS, 4);

    return [q1, q2, q3, q4, q5];
  }

  /**
   * Lấy bản ghi tiến độ thử thách riêng của từng học sinh (không ghi đè giữa các học sinh)
   */
  public static getStudentRecord(studentId: string): DailyChallengeStudentRecord {
    const key = `${this.STORAGE_PREFIX}${studentId}`;
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }

    return {
      studentId,
      currentStreak: 0,
      totalCompletedDays: 0,
      unlockedBadges: [],
      history: {},
    };
  }

  /**
   * Lưu bản ghi của học sinh
   */
  public static saveStudentRecord(record: DailyChallengeStudentRecord): void {
    try {
      const key = `${this.STORAGE_PREFIX}${record.studentId}`;
      localStorage.setItem(key, JSON.stringify(record));
    } catch {
      // ignore
    }
  }

  /**
   * Lấy hoặc khởi tạo tiến độ thử thách cho ngày hôm nay của học sinh
   */
  public static getOrInitTodayProgress(studentId: string): {
    record: DailyChallengeStudentRecord;
    progress: DailyDayProgress;
    questions: DailyQuestion[];
  } {
    const todayKey = this.getVietnamDateKey();
    const record = this.getStudentRecord(studentId);

    let progress = record.history[todayKey];
    let questions: DailyQuestion[] = [];

    if (!progress) {
      // Create new progress for today
      const generated = this.generateQuestionsForDay(todayKey);
      progress = {
        dateKey: todayKey,
        questionIds: generated.map((q) => q.id),
        answers: {},
        firstTryCorrect: {},
        attemptsCount: {},
        currentQIndex: 0,
        isCompleted: false,
        firstTryScore: 0,
        starsAwarded: 0,
      };
      record.history[todayKey] = progress;
      this.saveStudentRecord(record);
      questions = generated;
    } else {
      // Re-hydrate questions from questionIds
      questions = progress.questionIds
        .map((id) => DAILY_QUESTIONS_BY_ID.get(id))
        .filter((q): q is DailyQuestion => q !== undefined);

      if (questions.length < 5) {
        // Fallback in case of missing IDs
        const generated = this.generateQuestionsForDay(todayKey);
        progress.questionIds = generated.map((q) => q.id);
        questions = generated;
        this.saveStudentRecord(record);
      }
    }

    return { record, progress, questions };
  }

  /**
   * Cập nhật câu trả lời khi học sinh chọn đáp án
   */
  public static recordAnswer(
    studentId: string,
    qIndex: number,
    chosenAnswer: any,
    isCorrect: boolean
  ): DailyDayProgress {
    const todayKey = this.getVietnamDateKey();
    const record = this.getStudentRecord(studentId);
    const progress = record.history[todayKey];

    if (!progress) return progress;

    const currentAttempts = progress.attemptsCount[qIndex] || 0;
    progress.attemptsCount[qIndex] = currentAttempts + 1;
    progress.answers[qIndex] = chosenAnswer;

    // Track first-try correctness
    if (currentAttempts === 0) {
      progress.firstTryCorrect[qIndex] = isCorrect;
      if (isCorrect) {
        progress.firstTryScore = Object.values(progress.firstTryCorrect).filter(Boolean).length;
      }
    }

    this.saveStudentRecord(record);
    return progress;
  }

  /**
   * Cập nhật chỉ số câu hỏi hiện tại (khi chuyển câu)
   */
  public static updateCurrentIndex(studentId: string, nextIndex: number): void {
    const todayKey = this.getVietnamDateKey();
    const record = this.getStudentRecord(studentId);
    const progress = record.history[todayKey];
    if (progress) {
      progress.currentQIndex = nextIndex;
      this.saveStudentRecord(record);
    }
  }

  /**
   * Hoàn thành thử thách ngày hôm nay:
   * - Cập nhật trạng thái hoàn thành
   * - Tính sao thưởng (1 sao cho mỗi câu đúng lần đầu, tối đa 5 sao, chỉ thưởng 1 lần/ngày)
   * - Cập nhật Daily Streak (chuỗi ngày chăm học)
   * - Mở khóa huy hiệu nếu đạt mốc (3 ngày, 7 ngày, 14 ngày, 30 ngày)
   * - Đồng bộ sao và huy hiệu vào StudentProfile chính
   */
  public static completeTodayChallenge(studentId: string): {
    record: DailyChallengeStudentRecord;
    progress: DailyDayProgress;
    newlyUnlockedBadges: DailyBadgeInfo[];
    starsAdded: number;
  } {
    const todayKey = this.getVietnamDateKey();
    const yesterdayKey = this.getYesterdayVietnamDateKey(todayKey);
    const record = this.getStudentRecord(studentId);
    const progress = record.history[todayKey];

    if (!progress) {
      throw new Error('No challenge found for today');
    }

    const wasAlreadyCompleted = progress.isCompleted;
    let starsAdded = 0;
    const newlyUnlockedBadges: DailyBadgeInfo[] = [];

    if (!wasAlreadyCompleted) {
      progress.isCompleted = true;
      progress.completedAt = new Date().toISOString();

      // Calculate score and stars: 1 star per first try correct answer
      const firstTryCount = Object.values(progress.firstTryCorrect).filter(Boolean).length;
      progress.firstTryScore = firstTryCount;
      progress.starsAwarded = firstTryCount; // 0 to 5 stars
      starsAdded = progress.starsAwarded;

      // Update streak
      if (record.lastCompletedDateKey === yesterdayKey) {
        record.currentStreak += 1;
      } else if (record.lastCompletedDateKey === todayKey) {
        // already today, streak doesn't change
      } else {
        // Missed yesterday, reset streak to 1
        record.currentStreak = 1;
      }

      record.lastCompletedDateKey = todayKey;
      record.totalCompletedDays += 1;

      // Check badge milestones
      DAILY_STREAK_BADGES.forEach((badge) => {
        if (
          record.currentStreak >= badge.minStreak &&
          !record.unlockedBadges.includes(badge.name)
        ) {
          record.unlockedBadges.push(badge.name);
          newlyUnlockedBadges.push(badge);
        }
      });

      this.saveStudentRecord(record);

      // Save activity in main StorageService & sync student profile
      StorageService.recordActivity(studentId, {
        type: 'daily',
        targetId: `daily_${todayKey}`,
        targetName: `Thử Thách Ngày ${todayKey}`,
        score: progress.firstTryScore,
        totalQuestions: 5,
        starsEarned: starsAdded,
        timeSpentSeconds: 60,
      });

      // Also ensure student profile includes new streak badges
      const profiles = StorageService.getProfiles();
      const st = profiles.find((p) => p.id === studentId);
      if (st) {
        newlyUnlockedBadges.forEach((b) => {
          if (!st.badges.includes(b.name)) {
            st.badges.push(b.name);
          }
        });
        StorageService.saveProfiles(profiles);
        const curr = StorageService.getCurrentStudent();
        if (curr && curr.id === studentId) {
          StorageService.setCurrentStudent(st);
        }
      }
    }

    return {
      record,
      progress,
      newlyUnlockedBadges,
      starsAdded,
    };
  }

  /**
   * Reset trạng thái cho chế độ Luyện tập lại (Practice Replay):
   * Cho phép học sinh làm lại 5 câu hôm nay để ghi nhớ kiến thức,
   * nhưng KHÔNG cộng thêm sao hoặc tăng thưởng lặp lại.
   */
  public static resetForPracticeReplay(studentId: string): DailyDayProgress {
    const todayKey = this.getVietnamDateKey();
    const record = this.getStudentRecord(studentId);
    const progress = record.history[todayKey];

    if (progress) {
      progress.answers = {};
      progress.currentQIndex = 0;
      this.saveStudentRecord(record);
    }

    return progress;
  }
}
