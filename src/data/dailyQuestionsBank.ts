/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, VisualItemConfig } from '../types';
import { RECOGNIZE_QUESTIONS } from './dailyBank/recognizeQuestions';
import { CALCULATE_QUESTIONS } from './dailyBank/calculateQuestions';
import { COMPARE_QUESTIONS } from './dailyBank/compareQuestions';
import { GEOMETRY_MEASURE_QUESTIONS } from './dailyBank/geometryMeasureQuestions';
import { APPLIED_QUESTIONS } from './dailyBank/appliedQuestions';

export type DailyCategory = 'recognize' | 'calculate' | 'compare_order' | 'geometry_measure' | 'applied';

export interface DailyQuestion extends Question {
  category: DailyCategory;
  difficulty: 1 | 2 | 3;
  topic: string;
  lessonId: number;
}

export {
  RECOGNIZE_QUESTIONS,
  CALCULATE_QUESTIONS,
  COMPARE_QUESTIONS,
  GEOMETRY_MEASURE_QUESTIONS,
  APPLIED_QUESTIONS,
};

/**
 * Ngân hàng hơn 210+ câu hỏi Toán lớp 1 chuẩn SGK Kết nối tri thức với cuộc sống.
 * Phân bổ thành 5 nhóm:
 * - Câu 1: Nhận biết (recognize) - 42 câu
 * - Câu 2: Tính toán (calculate) - 45 câu
 * - Câu 3: So sánh hoặc sắp xếp (compare_order) - 42 câu
 * - Câu 4: Hình học hoặc đo lường (geometry_measure) - 42 câu
 * - Câu 5: Vận dụng thực tế (applied) - 42 câu
 * Tổng cộng: 213 câu hỏi độc lập, chuẩn xác, song ngữ Anh - Việt.
 */
export const DAILY_QUESTION_BANK: DailyQuestion[] = [
  ...RECOGNIZE_QUESTIONS,
  ...CALCULATE_QUESTIONS,
  ...COMPARE_QUESTIONS,
  ...GEOMETRY_MEASURE_QUESTIONS,
  ...APPLIED_QUESTIONS,
];

export const DAILY_QUESTIONS_BY_ID = new Map<string, DailyQuestion>(
  DAILY_QUESTION_BANK.map((q) => [q.id, q])
);

export function getDailyQuestionById(id: string): DailyQuestion | undefined {
  return DAILY_QUESTIONS_BY_ID.get(id);
}
