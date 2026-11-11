/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FeedbackItem {
  en: string;
  vi: string;
  emoji: string;
}

/**
 * 10 chuẩn lời khen tiếng Anh chuẩn Mỹ khi trả lời đúng
 * (Giọng đọc en-US, vui tươi, tự nhiên, không lặp liên tiếp)
 */
export const PRAISE_FEEDBACK_ITEMS: FeedbackItem[] = [
  { en: 'Excellent!', vi: 'Xuất sắc!', emoji: '🌟' },
  { en: 'Great job!', vi: 'Làm tốt lắm!', emoji: '🎉' },
  { en: 'Well done!', vi: 'Giỏi lắm!', emoji: '👏' },
  { en: 'Amazing!', vi: 'Tuyệt vời!', emoji: '✨' },
  { en: 'Fantastic!', vi: 'Rất tuyệt!', emoji: '🚀' },
  { en: 'You got it!', vi: 'Con làm đúng rồi!', emoji: '🎯' },
  { en: "That's right!", vi: 'Chính xác!', emoji: '💡' },
  { en: 'Perfect!', vi: 'Hoàn hảo!', emoji: '💯' },
  { en: 'Wonderful!', vi: 'Tuyệt vời!', emoji: '🌈' },
  { en: "You're a star!", vi: 'Con thật xuất sắc!', emoji: '⭐' },
];

/**
 * 8 chuẩn lời động viên tiếng Anh chuẩn Mỹ khi trả lời chưa đúng
 * (Giọng đọc en-US, nhẹ nhàng, khích lệ trẻ thử lại, không lặp liên tiếp)
 */
export const ENCOURAGEMENT_FEEDBACK_ITEMS: FeedbackItem[] = [
  { en: 'Try again!', vi: 'Thử lại nhé!', emoji: '🌱' },
  { en: 'Almost there!', vi: 'Gần đúng rồi!', emoji: '💪' },
  { en: 'Keep trying!', vi: 'Tiếp tục cố gắng!', emoji: '🎈' },
  { en: 'You can do it!', vi: 'Con làm được mà!', emoji: '⭐' },
  { en: 'Give it another try!', vi: 'Hãy thử lại lần nữa!', emoji: '🔄' },
  { en: "Let's try again!", vi: 'Chúng mình thử lại nhé!', emoji: '🌼' },
  { en: "Don't give up!", vi: 'Đừng bỏ cuộc!', emoji: '🍀' },
  { en: 'Have another go!', vi: 'Thử thêm lần nữa nào!', emoji: '🌻' },
];

/**
 * Lấy ngẫu nhiên câu khen không trùng với câu ngay trước đó
 */
export function getRandomPraise(lastIndex?: number): { item: FeedbackItem; index: number } {
  let index: number;
  do {
    index = Math.floor(Math.random() * PRAISE_FEEDBACK_ITEMS.length);
  } while (lastIndex !== undefined && index === lastIndex && PRAISE_FEEDBACK_ITEMS.length > 1);
  return { item: PRAISE_FEEDBACK_ITEMS[index], index };
}

/**
 * Lấy ngẫu nhiên câu động viên không trùng với câu ngay trước đó
 */
export function getRandomEncouragement(lastIndex?: number): { item: FeedbackItem; index: number } {
  let index: number;
  do {
    index = Math.floor(Math.random() * ENCOURAGEMENT_FEEDBACK_ITEMS.length);
  } while (
    lastIndex !== undefined &&
    index === lastIndex &&
    ENCOURAGEMENT_FEEDBACK_ITEMS.length > 1
  );
  return { item: ENCOURAGEMENT_FEEDBACK_ITEMS[index], index };
}
