/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, Lesson } from '../types';
import { LESSONS, generateQuestionsForLesson } from '../data/curriculumData';
import { resolveVisualConfig } from '../components/common/MathQuestionVisual';

export interface ValidationResult {
  questionId: string;
  lessonId?: number;
  promptVi: string;
  isPassed: boolean;
  objectTypeMatched: boolean;
  quantityMatched: boolean;
  answerMathematicallyCorrect: boolean;
  detectedObject?: string;
  visualObject?: string;
  expectedCount?: number;
  visualCount?: number;
  errors: string[];
}

export interface SuiteAuditReport {
  totalChecked: number;
  totalPassed: number;
  totalFailed: number;
  passRate: number;
  results: ValidationResult[];
  summaryByTopic: Record<number, { checked: number; passed: number }>;
  timestamp: string;
}

/**
 * Validates a single math question for visual accuracy, object matching, quantity matching, and math correctness.
 */
export function validateQuestionVisual(question: Question, lessonId?: number): ValidationResult {
  const errors: string[] = [];
  const prompt = question.promptVi.toLowerCase();
  const config = resolveVisualConfig(question);

  let objectTypeMatched = true;
  let quantityMatched = true;
  let answerMathematicallyCorrect = true;
  let detectedObject: string | undefined;
  let visualObject: string | undefined;
  let expectedCount: number | undefined;
  let visualCount: number | undefined;

  // 1. Detect expected object from question prompt
  if (prompt.includes('táo') || prompt.includes('apple')) detectedObject = 'apple';
  else if (prompt.includes('cá') || prompt.includes('fish')) detectedObject = 'fish';
  else if (prompt.includes('vịt') || prompt.includes('duck')) detectedObject = 'duck';
  else if (prompt.includes('hoa') || prompt.includes('flower')) detectedObject = 'flower';
  else if (prompt.includes('bút') || prompt.includes('pencil')) detectedObject = 'pencil';
  else if (prompt.includes('bóng') || prompt.includes('ball')) detectedObject = 'ball';
  else if (prompt.includes('mèo') || prompt.includes('cat')) detectedObject = 'cat';
  else if (prompt.includes('chim') || prompt.includes('bird')) detectedObject = 'bird';
  else if (prompt.includes('cà rốt') || prompt.includes('carrot')) detectedObject = 'carrot';
  else if (prompt.includes('kẹo') || prompt.includes('candy')) detectedObject = 'candy';

  // 2. Check visual configuration
  if (config) {
    visualObject = config.itemType;

    // Check object matching when applicable
    if (detectedObject && visualObject && detectedObject !== visualObject) {
      objectTypeMatched = false;
      errors.push(`Đối tượng không khớp: Câu hỏi nhắc đến "${detectedObject}" nhưng hình hiển thị "${visualObject}".`);
    }

    // Check count for countable items
    if (config.mode === 'count' && config.count !== undefined) {
      visualCount = config.count;
      if (question.type === 'count' && typeof question.answer === 'number') {
        expectedCount = question.answer;
        if (visualCount !== expectedCount) {
          quantityMatched = false;
          errors.push(`Số lượng sai: Hình hiển thị ${visualCount} vật nhưng đáp án là ${expectedCount}.`);
        }
      }
    }

    // Check addition math
    if (config.mode === 'addition' && config.groupA && config.groupB) {
      const sum = config.groupA.count + config.groupB.count;
      visualCount = sum;
      if (typeof question.answer === 'number' && question.answer !== sum) {
        answerMathematicallyCorrect = false;
        errors.push(`Phép cộng sai: Hình hiển thị ${config.groupA.count} + ${config.groupB.count} = ${sum} nhưng đáp án là ${question.answer}.`);
      }
    }

    // Check subtraction math
    if (config.mode === 'subtraction' && config.initialCount !== undefined && config.removedCount !== undefined) {
      const diff = config.initialCount - config.removedCount;
      visualCount = diff;
      if (typeof question.answer === 'number' && question.answer !== diff) {
        answerMathematicallyCorrect = false;
        errors.push(`Phép trừ sai: Hình hiển thị ${config.initialCount} - ${config.removedCount} = ${diff} nhưng đáp án là ${question.answer}.`);
      }
    }

    // Check clock
    if (config.mode === 'clock' && config.hour !== undefined) {
      const hStr = `${config.hour} giờ`;
      if (typeof question.answer === 'string' && !question.answer.includes(String(config.hour))) {
        answerMathematicallyCorrect = false;
        errors.push(`Đồng hồ sai: Kim giờ chỉ ${config.hour} giờ nhưng đáp án là "${question.answer}".`);
      }
    }

    // Check ruler
    if (config.mode === 'ruler' && config.lengthCm !== undefined) {
      if (typeof question.answer === 'number' && question.answer !== config.lengthCm) {
        quantityMatched = false;
        errors.push(`Độ dài thước sai: Thước hiển thị ${config.lengthCm} cm nhưng đáp án là ${question.answer} cm.`);
      }
    }
  }

  // 3. Mathematical correctness check for addition/subtraction questions without visual
  const addMatch = prompt.match(/(\d+)\s*\+\s*(\d+)/);
  if (addMatch && typeof question.answer === 'number') {
    const expected = parseInt(addMatch[1], 10) + parseInt(addMatch[2], 10);
    if (question.answer !== expected) {
      answerMathematicallyCorrect = false;
      errors.push(`Phép cộng toán học không đúng: ${addMatch[1]} + ${addMatch[2]} phải bằng ${expected}, đáp án đang ghi ${question.answer}.`);
    }
  }

  const subMatch = prompt.match(/(\d+)\s*-\s*(\d+)/);
  if (subMatch && typeof question.answer === 'number') {
    const expected = parseInt(subMatch[1], 10) - parseInt(subMatch[2], 10);
    if (question.answer !== expected) {
      answerMathematicallyCorrect = false;
      errors.push(`Phép trừ toán học không đúng: ${subMatch[1]} - ${subMatch[2]} phải bằng ${expected}, đáp án đang ghi ${question.answer}.`);
    }
  }

  const isPassed = errors.length === 0;

  return {
    questionId: question.id,
    lessonId,
    promptVi: question.promptVi,
    isPassed,
    objectTypeMatched,
    quantityMatched,
    answerMathematicallyCorrect,
    detectedObject,
    visualObject,
    expectedCount,
    visualCount,
    errors,
  };
}

/**
 * Runs a full comprehensive audit across all 41 lessons in the SGK Kết nối tri thức curriculum.
 */
export function runFullCurriculumAudit(): SuiteAuditReport {
  const results: ValidationResult[] = [];
  const summaryByTopic: Record<number, { checked: number; passed: number }> = {};

  LESSONS.forEach((lesson) => {
    if (!summaryByTopic[lesson.topicId]) {
      summaryByTopic[lesson.topicId] = { checked: 0, passed: 0 };
    }

    // 1. Audit sample questions
    if (lesson.sampleQuestions) {
      lesson.sampleQuestions.forEach((q) => {
        const res = validateQuestionVisual(q, lesson.id);
        results.push(res);
        summaryByTopic[lesson.topicId].checked++;
        if (res.isPassed) summaryByTopic[lesson.topicId].passed++;
      });
    }

    // 2. Audit generated practice questions (5 generated per lesson)
    const generated = generateQuestionsForLesson(lesson.id, 5);
    generated.forEach((q) => {
      const res = validateQuestionVisual(q, lesson.id);
      results.push(res);
      summaryByTopic[lesson.topicId].checked++;
      if (res.isPassed) summaryByTopic[lesson.topicId].passed++;
    });
  });

  const totalChecked = results.length;
  const totalPassed = results.filter((r) => r.isPassed).length;
  const totalFailed = totalChecked - totalPassed;
  const passRate = totalChecked > 0 ? Math.round((totalPassed / totalChecked) * 100) : 100;

  return {
    totalChecked,
    totalPassed,
    totalFailed,
    passRate,
    results,
    summaryByTopic,
    timestamp: new Date().toISOString(),
  };
}
