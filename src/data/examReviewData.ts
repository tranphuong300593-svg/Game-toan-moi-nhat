/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, VisualItemConfig } from '../types';

export type CognitiveLevel = 'nhan_biet' | 'thong_hieu' | 'van_dung';

export interface ExamQuestion {
  id: string;
  level?: CognitiveLevel;
  sgk?: string;
  type?: 'fill' | 'choice' | 'compare' | 'count' | 'match' | 'shape';
  promptVi: string;
  promptEn: string;
  hintVi?: string;
  hintEn?: string;
  visualConfig?: VisualItemConfig;
  options?: (string | number)[];
  answer: string | number;
  explanationVi: string;
  explanationEn?: string;
}

export interface ExamPackage {
  periodId: 'mid-sem-1' | 'final-sem-1' | 'mid-sem-2' | 'final-sem-2';
  periodTitleVi: string;
  periodTitleEn: string;
  testId: string;
  testNumber: number;
  titleVi: string;
  titleEn: string;
  timeMinutes: number;
  questions: ExamQuestion[];
}

export interface ExamPeriodInfo {
  id: 'mid-sem-1' | 'final-sem-1' | 'mid-sem-2' | 'final-sem-2';
  titleVi: string;
  titleEn: string;
  scopeVi: string;
  scopeEn: string;
  badge: string;
  themeColor: string;
  gradient: string;
  accentBg: string;
  testCount: number;
}

export const EXAM_PERIODS: ExamPeriodInfo[] = [
  {
    id: 'mid-sem-1',
    titleVi: 'GIỮA HỌC KÌ I',
    titleEn: 'Mid-Semester 1',
    scopeVi: 'Từ đầu năm đến Giữa Học Kì I: Các số 0 đến 10, So sánh số, Tách - gộp, Hình phẳng (vuông, tròn, tam giác, chữ nhật), Phép cộng trong phạm vi 5',
    scopeEn: 'Numbers 0-10, comparison, split-combine, flat shapes (square, circle, triangle, rectangle), basic addition',
    badge: 'Đợt 1',
    themeColor: '#2563EB',
    gradient: 'from-blue-500 via-sky-500 to-indigo-600',
    accentBg: 'bg-blue-50 border-blue-200 text-blue-800',
    testCount: 4,
  },
  {
    id: 'final-sem-1',
    titleVi: 'CUỐI HỌC KÌ I',
    titleEn: 'End of Semester 1',
    scopeVi: 'Toàn bộ Tập 1 (Bài 1 - 20): Phép cộng & trừ trong phạm vi 10, Khối lập phương, Khối hộp chữ nhật, Vị trí trên/dưới/trái/phải/trước/sau, Bài toán thực tế',
    scopeEn: 'Full Semester 1 (Lessons 1-20): Addition & subtraction within 10, cube, cuboid, spatial orientation, real-life problems',
    badge: 'Đợt 2',
    themeColor: '#F59E0B',
    gradient: 'from-amber-500 via-orange-500 to-yellow-600',
    accentBg: 'bg-amber-50 border-amber-200 text-amber-800',
    testCount: 4,
  },
  {
    id: 'mid-sem-2',
    titleVi: 'GIỮA HỌC KÌ II',
    titleEn: 'Mid-Semester 2',
    scopeVi: 'Từ đầu năm đến Giữa Học Kì II: Số có 2 chữ số đến 100, Chục và đơn vị, So sánh số, Bảng các số đến 100, Dài hơn - ngắn hơn, Đơn vị xăng-ti-mét (cm)',
    scopeEn: 'Two-digit numbers up to 100, tens & ones, comparing numbers, 1-100 chart, longer/shorter, centimeter (cm)',
    badge: 'Đợt 3',
    themeColor: '#22C55E',
    gradient: 'from-emerald-500 via-teal-500 to-green-600',
    accentBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    testCount: 4,
  },
  {
    id: 'final-sem-2',
    titleVi: 'CUỐI HỌC KÌ II',
    titleEn: 'End of Semester 2',
    scopeVi: 'Tổng kết toàn diện cả năm học (Bài 1 - 41): Cộng trừ phạm vi 100 không nhớ, Xem giờ đúng trên đồng hồ, Các ngày trong tuần lễ, Đo độ dài cm, Giải bài toán có lời văn',
    scopeEn: 'Comprehensive Year-End Exam (Lessons 1-41): Addition & subtraction within 100, telling clock hours, days of week, cm measurement, word problems',
    badge: 'Đợt 4',
    themeColor: '#8B5CF6',
    gradient: 'from-purple-500 via-violet-500 to-indigo-600',
    accentBg: 'bg-purple-50 border-purple-200 text-purple-800',
    testCount: 4,
  },
];

export const ALL_16_EXAMS: ExamPackage[] = [
  {
    "periodId": "mid-sem-1",
    "periodTitleVi": "GIỮA HỌC KÌ I",
    "periodTitleEn": "Mid-Semester 1",
    "testId": "mid1_test1",
    "testNumber": 1,
    "titleVi": "Đề Kiểm Tra Số 1 – Giữa Học Kì I",
    "titleEn": "Math Test 1 – Mid-Semester 1",
    "timeMinutes": 35,
    "questions": [
      {
        "id": "m1_t1_q1",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 1",
        "promptVi": "Có bao nhiêu quả bóng bay trong hình dưới đây?",
        "promptEn": "How many balloons are there in the picture below?",
        "visualConfig": {
          "mode": "count",
          "count": 5,
          "itemType": "balloon"
        },
        "options": [
          "4 quả bóng",
          "5 quả bóng",
          "6 quả bóng"
        ],
        "answer": "5 quả bóng",
        "explanationVi": "Đếm lần lượt từng quả bóng ta được 5 quả bóng bay."
      },
      {
        "id": "m1_t1_q2",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 2",
        "promptVi": "Trong dãy số, số nào đứng ngay sau số 7?",
        "promptEn": "In the number sequence, which number comes right after 7?",
        "options": [
          "Số 6",
          "Số 8",
          "Số 9"
        ],
        "answer": "Số 8",
        "explanationVi": "Trong dãy số, số đứng ngay sau số 7 là số 8 (7 thêm 1 bằng 8)."
      },
      {
        "id": "m1_t1_q3",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 7",
        "promptVi": "Hình nào dưới đây có 3 cạnh và 3 góc nhọn?",
        "promptEn": "Which shape below has 3 sides and 3 corners?",
        "visualConfig": {
          "mode": "shape",
          "shapeType": "triangle"
        },
        "options": [
          "Hình vuông",
          "Hình tròn",
          "Hình tam giác"
        ],
        "answer": "Hình tam giác",
        "explanationVi": "Hình tam giác có 3 cạnh và 3 góc."
      },
      {
        "id": "m1_t1_q4",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 1",
        "promptVi": "Đĩa không có đồ vật nào tương ứng với số mấy?",
        "promptEn": "Which number represents a plate with no items?",
        "options": [
          "Số 0",
          "Số 1",
          "Số 2"
        ],
        "answer": "Số 0",
        "explanationVi": "Số 0 biểu thị không có đồ vật nào."
      },
      {
        "id": "m1_t1_q5",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 7",
        "promptVi": "Quan sát mặt chiếc đồng hồ treo tường dưới đây, mặt đồng hồ có dạng hình gì?",
        "promptEn": "Look at the wall clock below. What shape is its face?",
        "visualConfig": {
          "mode": "clock",
          "hour": 8,
          "minute": 0
        },
        "options": [
          "Hình chữ nhật",
          "Hình tròn",
          "Hình tam giác"
        ],
        "answer": "Hình tròn",
        "explanationVi": "Mặt đồng hồ có dạng hình tròn, đường cong khép kín."
      },
      {
        "id": "m1_t1_q6",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 2",
        "promptVi": "Số 10 là số gồm hai chữ số nào ghép lại?",
        "promptEn": "The number 10 is formed by which two digits?",
        "options": [
          "Chữ số 1 và chữ số 0",
          "Chữ số 0 và chữ số 1",
          "Chữ số 1 và chữ số 1"
        ],
        "answer": "Chữ số 1 và chữ số 0",
        "explanationVi": "Số 10 gồm chữ số 1 đứng trước và chữ số 0 đứng sau."
      },
      {
        "id": "m1_t1_q7",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 4",
        "promptVi": "Chọn dấu thích hợp để điền vào chỗ chấm: 8 ... 6",
        "promptEn": "Choose the correct sign to compare: 8 ... 6",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": ">",
        "explanationVi": "8 lớn hơn 6, nên ta điền dấu >."
      },
      {
        "id": "m1_t1_q8",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 5",
        "promptVi": "Tách số 5 thành 2 và số mấy?",
        "promptEn": "Split 5 into 2 and what number?",
        "options": [
          "Số 2",
          "Số 3",
          "Số 4"
        ],
        "answer": "Số 3",
        "explanationVi": "5 gồm 2 và 3 (vì 2 + 3 = 5)."
      },
      {
        "id": "m1_t1_q9",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 6",
        "promptVi": "Dãy số nào được sắp xếp theo thứ tự từ bé đến lớn?",
        "promptEn": "Which sequence of numbers is ordered from smallest to greatest?",
        "options": [
          "2, 5, 7, 9",
          "9, 7, 5, 2",
          "5, 2, 9, 7"
        ],
        "answer": "2, 5, 7, 9",
        "explanationVi": "2 < 5 < 7 < 9, dãy số sắp xếp từ bé đến lớn là 2, 5, 7, 9."
      },
      {
        "id": "m1_t1_q10",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 10",
        "promptVi": "Tính kết quả phép tính: 3 + 2 = ?",
        "promptEn": "Calculate: 3 + 2 = ?",
        "visualConfig": {
          "mode": "equation",
          "equation": {
            "left": 3,
            "op": "+",
            "right": 2,
            "label": "3 + 2 = ?"
          }
        },
        "options": [
          "4",
          "5",
          "6"
        ],
        "answer": "5",
        "explanationVi": "3 thêm 2 bằng 5, vậy 3 + 2 = 5."
      },
      {
        "id": "m1_t1_q11",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 4",
        "promptVi": "Trong các số: 3, 8, 5, 9, số nào là số bé nhất?",
        "promptEn": "Among the numbers 3, 8, 5, 9, which is the smallest?",
        "options": [
          "Số 3",
          "Số 5",
          "Số 8"
        ],
        "answer": "Số 3",
        "explanationVi": "Số 3 bé hơn các số 5, 8, 9."
      },
      {
        "id": "m1_t1_q12",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 8",
        "promptVi": "Khung tranh có 4 cạnh bằng nhau và 4 góc vuông là hình gì?",
        "promptEn": "A picture frame with 4 equal sides and 4 square corners is which shape?",
        "visualConfig": {
          "mode": "picture-frame",
          "frameShape": "square"
        },
        "options": [
          "Hình vuông",
          "Hình chữ nhật",
          "Hình tam giác"
        ],
        "answer": "Hình vuông",
        "explanationVi": "Hình có 4 cạnh bằng nhau và 4 góc vuông là hình vuông."
      },
      {
        "id": "m1_t1_q13",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 10",
        "promptVi": "Trên cây có 4 chú chim, có thêm 1 chú chim bay đến đậu cùng. Hỏi trên cây có tất cả bao nhiêu chú chim?",
        "promptEn": "There are 4 birds on a tree, 1 more bird flies in. How many birds are on the tree in total?",
        "visualConfig": {
          "mode": "addition",
          "groupA": {
            "count": 4,
            "itemType": "bird",
            "labelVi": "4 con chim"
          },
          "groupB": {
            "count": 1,
            "itemType": "bird",
            "labelVi": "1 con chim"
          }
        },
        "options": [
          "4 con chim",
          "5 con chim",
          "6 con chim"
        ],
        "answer": "5 con chim",
        "explanationVi": "Phép tính: 4 + 1 = 5 chú chim."
      },
      {
        "id": "m1_t1_q14",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 6",
        "promptVi": "Bạn Mai có số nhãn vở nhiều hơn 6 nhưng ít hơn 8. Hỏi bạn Mai có mấy nhãn vở?",
        "promptEn": "Mai has more than 6 stickers but fewer than 8 stickers. How many stickers does Mai have?",
        "options": [
          "6 nhãn vở",
          "7 nhãn vở",
          "8 nhãn vở"
        ],
        "answer": "7 nhãn vở",
        "explanationVi": "Số nằm giữa 6 và 8 là số 7."
      },
      {
        "id": "m1_t1_q15",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 9",
        "promptVi": "Ghép hai hình tam giác vuông bằng nhau có thể tạo thành hình phẳng nào?",
        "promptEn": "Combining two equal right triangles can make which flat shape?",
        "options": [
          "Hình chữ nhật",
          "Hình tròn",
          "Hình bầu dục"
        ],
        "answer": "Hình chữ nhật",
        "explanationVi": "Ghép hai hình tam giác vuông có cùng kích thước lại với nhau tạo thành hình chữ nhật (hoặc hình vuông)."
      }
    ]
  },
  {
    "periodId": "mid-sem-1",
    "periodTitleVi": "GIỮA HỌC KÌ I",
    "periodTitleEn": "Mid-Semester 1",
    "testId": "mid1_test2",
    "testNumber": 2,
    "titleVi": "Đề Kiểm Tra Số 2 – Giữa Học Kì I",
    "titleEn": "Math Test 2 – Mid-Semester 1",
    "timeMinutes": 35,
    "questions": [
      {
        "id": "m1_t2_q1",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 2",
        "promptVi": "Đếm số ngôi sao vàng có trong hình dưới đây:",
        "promptEn": "Count the number of yellow stars in the picture below:",
        "visualConfig": {
          "mode": "count",
          "count": 7,
          "itemType": "star"
        },
        "options": [
          "6 ngôi sao",
          "7 ngôi sao",
          "8 ngôi sao"
        ],
        "answer": "7 ngôi sao",
        "explanationVi": "Đếm lần lượt từ trái sang phải ta có đúng 7 ngôi sao vàng."
      },
      {
        "id": "m1_t2_q2",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 1",
        "promptVi": "Trong dãy số, số nào đứng ngay trước số 5?",
        "promptEn": "In the number sequence, which number comes right before 5?",
        "options": [
          "Số 4",
          "Số 5",
          "Số 6"
        ],
        "answer": "Số 4",
        "explanationVi": "Trong dãy số, số đứng ngay trước số 5 là số 4 (5 bớt 1 bằng 4)."
      },
      {
        "id": "m1_t2_q3",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 7",
        "promptVi": "Tấm bảng đen lớp học thường có dạng hình học nào?",
        "promptEn": "A classroom chalkboard usually has which geometric shape?",
        "options": [
          "Hình chữ nhật",
          "Hình tròn",
          "Hình tam giác"
        ],
        "answer": "Hình chữ nhật",
        "explanationVi": "Tấm bảng đen lớp học có 4 cạnh (2 cạnh dài bằng nhau, 2 cạnh ngắn bằng nhau) là hình chữ nhật."
      },
      {
        "id": "m1_t2_q4",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 2",
        "promptVi": "Trong dãy số từ 0 đến 10, số nào là số lớn nhất?",
        "promptEn": "In the sequence of numbers from 0 to 10, which number is the greatest?",
        "options": [
          "Số 8",
          "Số 9",
          "Số 10"
        ],
        "answer": "Số 10",
        "explanationVi": "Số 10 là số lớn nhất trong dãy số từ 0 đến 10."
      },
      {
        "id": "m1_t2_q5",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 7",
        "promptVi": "Biển báo giao thông hình tam giác có mấy cạnh?",
        "promptEn": "How many sides does a triangle traffic sign have?",
        "visualConfig": {
          "mode": "traffic-sign",
          "signType": "warning_triangle"
        },
        "options": [
          "3 cạnh",
          "4 cạnh",
          "5 cạnh"
        ],
        "answer": "3 cạnh",
        "explanationVi": "Hình tam giác luôn có 3 cạnh."
      },
      {
        "id": "m1_t2_q6",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 1",
        "promptVi": "Điền số còn thiếu vào chỗ chấm: 0, 1, 2, ..., 4, 5",
        "promptEn": "Fill in the missing number: 0, 1, 2, ..., 4, 5",
        "options": [
          "Số 2",
          "Số 3",
          "Số 4"
        ],
        "answer": "Số 3",
        "explanationVi": "Dãy số tăng dần: 0, 1, 2, 3, 4, 5."
      },
      {
        "id": "m1_t2_q7",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 4",
        "promptVi": "Chọn dấu thích hợp để so sánh: 4 ... 7",
        "promptEn": "Choose the correct sign to compare: 4 ... 7",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": "<",
        "explanationVi": "4 bé hơn 7, ta điền dấu <."
      },
      {
        "id": "m1_t2_q8",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 5",
        "promptVi": "Gộp 3 và 1 ta được số mấy?",
        "promptEn": "Combine 3 and 1 to make which number?",
        "options": [
          "Số 2",
          "Số 3",
          "Số 4"
        ],
        "answer": "Số 4",
        "explanationVi": "Gộp 3 và 1 được 4 (3 + 1 = 4)."
      },
      {
        "id": "m1_t2_q9",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 10",
        "promptVi": "Tính kết quả: 4 + 0 = ?",
        "promptEn": "Calculate: 4 + 0 = ?",
        "options": [
          "0",
          "4",
          "5"
        ],
        "answer": "4",
        "explanationVi": "Bất kì số nào cộng với 0 cũng bằng chính số đó: 4 + 0 = 4."
      },
      {
        "id": "m1_t2_q10",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 6",
        "promptVi": "Dãy số nào được sắp xếp theo thứ tự từ lớn đến bé?",
        "promptEn": "Which sequence is ordered from greatest to smallest?",
        "options": [
          "10, 8, 6, 3",
          "3, 6, 8, 10",
          "6, 10, 8, 3"
        ],
        "answer": "10, 8, 6, 3",
        "explanationVi": "10 > 8 > 6 > 3, thứ tự từ lớn đến bé là 10, 8, 6, 3."
      },
      {
        "id": "m1_t2_q11",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 4",
        "promptVi": "Điền dấu thích hợp: 5 ... 5",
        "promptEn": "Choose the sign: 5 ... 5",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": "=",
        "explanationVi": "5 bằng 5, điền dấu =."
      },
      {
        "id": "m1_t2_q12",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 11",
        "promptVi": "Tính nhẩm: 2 + 2 = ?",
        "promptEn": "Calculate: 2 + 2 = ?",
        "options": [
          "3",
          "4",
          "5"
        ],
        "answer": "4",
        "explanationVi": "2 thêm 2 bằng 4."
      },
      {
        "id": "m1_t2_q13",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 10",
        "promptVi": "Lan có 3 quả táo đỏ và 2 quả táo xanh. Hỏi Lan có tất cả bao nhiêu quả táo?",
        "promptEn": "Lan has 3 red apples and 2 green apples. How many apples does Lan have in total?",
        "visualConfig": {
          "mode": "addition",
          "groupA": {
            "count": 3,
            "itemType": "apple",
            "labelVi": "3 quả táo đỏ"
          },
          "groupB": {
            "count": 2,
            "itemType": "apple",
            "labelVi": "2 quả táo xanh"
          }
        },
        "options": [
          "4 quả",
          "5 quả",
          "6 quả"
        ],
        "answer": "5 quả",
        "explanationVi": "Phép tính: 3 + 2 = 5 quả táo."
      },
      {
        "id": "m1_t2_q14",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 4",
        "promptVi": "Bình có 6 viên bi, Nam có 4 viên bi. Bạn nào có nhiều viên bi hơn?",
        "promptEn": "Binh has 6 marbles, Nam has 4 marbles. Who has more marbles?",
        "options": [
          "Bạn Bình",
          "Bạn Nam",
          "Hai bạn bằng nhau"
        ],
        "answer": "Bạn Bình",
        "explanationVi": "Vì 6 > 4 nên bạn Bình có nhiều bi hơn."
      },
      {
        "id": "m1_t2_q15",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 9",
        "promptVi": "Quan sát chiếc thuyền đồ chơi: Thuyền gồm 1 thân hình chữ nhật và 2 cánh buồm hình gì?",
        "promptEn": "Look at the toy sailboat: it has 1 rectangular body and 2 sails shaped like which shape?",
        "options": [
          "Hình tam giác",
          "Hình tròn",
          "Hình vuông"
        ],
        "answer": "Hình tam giác",
        "explanationVi": "Cánh buồm của thuyền có dạng hình tam giác."
      }
    ]
  },
  {
    "periodId": "mid-sem-1",
    "periodTitleVi": "GIỮA HỌC KÌ I",
    "periodTitleEn": "Mid-Semester 1",
    "testId": "mid1_test3",
    "testNumber": 3,
    "titleVi": "Đề Kiểm Tra Số 3 – Giữa Học Kì I",
    "titleEn": "Math Test 3 – Mid-Semester 1",
    "timeMinutes": 35,
    "questions": [
      {
        "id": "m1_t3_q1",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 2",
        "promptVi": "Có mấy chú cá heo đang nhảy trong hình?",
        "promptEn": "How many dolphins are leaping in the picture?",
        "visualConfig": {
          "mode": "count",
          "count": 6,
          "itemType": "dolphin"
        },
        "options": [
          "5 con",
          "6 con",
          "7 con"
        ],
        "answer": "6 con",
        "explanationVi": "Có 6 chú cá heo."
      },
      {
        "id": "m1_t3_q2",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 2",
        "promptVi": "Số nào đứng ngay sau số 8?",
        "promptEn": "Which number comes right after 8?",
        "options": [
          "Số 7",
          "Số 9",
          "Số 10"
        ],
        "answer": "Số 9",
        "explanationVi": "Số đứng ngay sau số 8 là số 9 (8 thêm 1 bằng 9)."
      },
      {
        "id": "m1_t3_q3",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 7",
        "promptVi": "Hình vuông có bao nhiêu góc?",
        "promptEn": "How many corners does a square have?",
        "options": [
          "3 góc",
          "4 góc",
          "5 góc"
        ],
        "answer": "4 góc",
        "explanationVi": "Hình vuông có 4 góc bằng nhau."
      },
      {
        "id": "m1_t3_q4",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 1",
        "promptVi": "Số bé nhất trong các số từ 0 đến 10 là số nào?",
        "promptEn": "What is the smallest number from 0 to 10?",
        "options": [
          "Số 0",
          "Số 1",
          "Số 2"
        ],
        "answer": "Số 0",
        "explanationVi": "Số 0 là số bé nhất."
      },
      {
        "id": "m1_t3_q5",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 7",
        "promptVi": "Hình nào dưới đây có thể lăn tròn được trên mặt bàn?",
        "promptEn": "Which shape can roll smoothly on the table?",
        "options": [
          "Hình tròn",
          "Hình vuông",
          "Hình tam giác"
        ],
        "answer": "Hình tròn",
        "explanationVi": "Hình tròn lăn được vì đường viền cong khép kín."
      },
      {
        "id": "m1_t3_q6",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 2",
        "promptVi": "Số 9 đọc là gì?",
        "promptEn": "How do you read the number 9?",
        "options": [
          "Tám",
          "Chín",
          "Mười"
        ],
        "answer": "Chín",
        "explanationVi": "Số 9 đọc là chín."
      },
      {
        "id": "m1_t3_q7",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 4",
        "promptVi": "Chọn dấu thích hợp: 9 ... 10",
        "promptEn": "Choose the sign: 9 ... 10",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": "<",
        "explanationVi": "9 bé hơn 10 nên điền dấu <."
      },
      {
        "id": "m1_t3_q8",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 5",
        "promptVi": "Tách 4 thành 1 và số mấy?",
        "promptEn": "Split 4 into 1 and what number?",
        "options": [
          "Số 2",
          "Số 3",
          "Số 4"
        ],
        "answer": "Số 3",
        "explanationVi": "4 gồm 1 và 3."
      },
      {
        "id": "m1_t3_q9",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 10",
        "promptVi": "Tính: 1 + 3 = ?",
        "promptEn": "Calculate: 1 + 3 = ?",
        "options": [
          "3",
          "4",
          "5"
        ],
        "answer": "4",
        "explanationVi": "1 + 3 = 4."
      },
      {
        "id": "m1_t3_q10",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 6",
        "promptVi": "Trong các số: 7, 2, 8, 4, số nào lớn nhất?",
        "promptEn": "Among 7, 2, 8, 4, which is the greatest?",
        "options": [
          "Số 7",
          "Số 8",
          "Số 4"
        ],
        "answer": "Số 8",
        "explanationVi": "Số 8 lớn nhất."
      },
      {
        "id": "m1_t3_q11",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 11",
        "promptVi": "Điền số thích hợp: 3 + ... = 4",
        "promptEn": "Fill in the blank: 3 + ... = 4",
        "options": [
          "0",
          "1",
          "2"
        ],
        "answer": "1",
        "explanationVi": "3 + 1 = 4."
      },
      {
        "id": "m1_t3_q12",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 8",
        "promptVi": "Khăn quàng đỏ của đội viên có dạng hình gì?",
        "promptEn": "The school pioneer red scarf has which shape?",
        "options": [
          "Hình tam giác",
          "Hình chữ nhật",
          "Hình vuông"
        ],
        "answer": "Hình tam giác",
        "explanationVi": "Khăn quàng đỏ có dạng hình tam giác."
      },
      {
        "id": "m1_t3_q13",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 10",
        "promptVi": "Có 2 bông hoa đỏ và 3 bông hoa vàng. Hỏi có tất cả mấy bông hoa?",
        "promptEn": "There are 2 red flowers and 3 yellow flowers. How many flowers in total?",
        "options": [
          "4 bông hoa",
          "5 bông hoa",
          "6 bông hoa"
        ],
        "answer": "5 bông hoa",
        "explanationVi": "2 + 3 = 5 bông hoa."
      },
      {
        "id": "m1_t3_q14",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 6",
        "promptVi": "Đoàn tàu gồm 4 toa được đánh số: 1, 2, 3, 4. Toa đứng ngay sau toa số 2 là toa số mấy?",
        "promptEn": "A train has 4 cars numbered 1, 2, 3, 4. Which car is right after car 2?",
        "options": [
          "Toa số 1",
          "Toa số 3",
          "Toa số 4"
        ],
        "answer": "Toa số 3",
        "explanationVi": "Toa đứng ngay sau toa số 2 là toa số 3."
      },
      {
        "id": "m1_t3_q15",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 4",
        "promptVi": "Tổ Một có 5 học sinh, tổ Hai có 5 học sinh. Số học sinh hai tổ như thế nào với nhau?",
        "promptEn": "Group 1 has 5 students, Group 2 has 5 students. How do they compare?",
        "options": [
          "Bằng nhau",
          "Tổ Một nhiều hơn",
          "Tổ Hai nhiều hơn"
        ],
        "answer": "Bằng nhau",
        "explanationVi": "5 = 5 nên số học sinh hai tổ bằng nhau."
      }
    ]
  },
  {
    "periodId": "mid-sem-1",
    "periodTitleVi": "GIỮA HỌC KÌ I",
    "periodTitleEn": "Mid-Semester 1",
    "testId": "mid1_test4",
    "testNumber": 4,
    "titleVi": "Đề Kiểm Tra Số 4 – Giữa Học Kì I",
    "titleEn": "Math Test 4 – Mid-Semester 1",
    "timeMinutes": 35,
    "questions": [
      {
        "id": "m1_t4_q1",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 2",
        "promptVi": "Đếm số củ cà rốt có trong hình dưới đây:",
        "promptEn": "Count the number of carrots in the picture below:",
        "visualConfig": {
          "mode": "count",
          "count": 8,
          "itemType": "carrot"
        },
        "options": [
          "7 củ",
          "8 củ",
          "9 củ"
        ],
        "answer": "8 củ",
        "explanationVi": "Có đúng 8 củ cà rốt."
      },
      {
        "id": "m1_t4_q2",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 1",
        "promptVi": "Số nào đứng ngay trước số 2?",
        "promptEn": "Which number comes right before 2?",
        "options": [
          "Số 0",
          "Số 1",
          "Số 3"
        ],
        "answer": "Số 1",
        "explanationVi": "Số đứng ngay trước số 2 là số 1 (2 bớt 1 bằng 1)."
      },
      {
        "id": "m1_t4_q3",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 7",
        "promptVi": "Hình tròn có bao nhiêu cạnh thẳng?",
        "promptEn": "How many straight sides does a circle have?",
        "options": [
          "0 cạnh",
          "1 cạnh",
          "4 cạnh"
        ],
        "answer": "0 cạnh",
        "explanationVi": "Hình tròn không có cạnh thẳng."
      },
      {
        "id": "m1_t4_q4",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 2",
        "promptVi": "Số 6 đọc là gì?",
        "promptEn": "How do you read the number 6?",
        "options": [
          "Sáu",
          "Bảy",
          "Tám"
        ],
        "answer": "Sáu",
        "explanationVi": "Số 6 đọc là sáu."
      },
      {
        "id": "m1_t4_q5",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 7",
        "promptVi": "Hình nào dưới đây có 4 cạnh và 4 góc vuông?",
        "promptEn": "Which shape has 4 sides and 4 square corners?",
        "options": [
          "Hình chữ nhật",
          "Hình tròn",
          "Hình tam giác"
        ],
        "answer": "Hình chữ nhật",
        "explanationVi": "Hình chữ nhật có 4 cạnh và 4 góc vuông."
      },
      {
        "id": "m1_t4_q6",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 1",
        "promptVi": "Các số từ 0 đến 5 gồm mấy số?",
        "promptEn": "How many numbers are there from 0 to 5?",
        "options": [
          "5 số",
          "6 số",
          "7 số"
        ],
        "answer": "6 số",
        "explanationVi": "Gồm 6 số: 0, 1, 2, 3, 4, 5."
      },
      {
        "id": "m1_t4_q7",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 4",
        "promptVi": "Chọn dấu thích hợp: 7 ... 7",
        "promptEn": "Choose the sign: 7 ... 7",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": "=",
        "explanationVi": "7 bằng 7, điền dấu =."
      },
      {
        "id": "m1_t4_q8",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 5",
        "promptVi": "Gộp 2 và 3 ta được số mấy?",
        "promptEn": "Combine 2 and 3 to make which number?",
        "options": [
          "Số 4",
          "Số 5",
          "Số 6"
        ],
        "answer": "Số 5",
        "explanationVi": "Gộp 2 và 3 được 5."
      },
      {
        "id": "m1_t4_q9",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 10",
        "promptVi": "Tính: 2 + 1 = ?",
        "promptEn": "Calculate: 2 + 1 = ?",
        "options": [
          "2",
          "3",
          "4"
        ],
        "answer": "3",
        "explanationVi": "2 + 1 = 3."
      },
      {
        "id": "m1_t4_q10",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 6",
        "promptVi": "Số nào vừa lớn hơn 3 lại vừa bé hơn 5?",
        "promptEn": "Which number is both greater than 3 and less than 5?",
        "options": [
          "Số 2",
          "Số 4",
          "Số 6"
        ],
        "answer": "Số 4",
        "explanationVi": "3 < 4 < 5."
      },
      {
        "id": "m1_t4_q11",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 4",
        "promptVi": "Chọn dấu thích hợp: 6 ... 3",
        "promptEn": "Choose the sign: 6 ... 3",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": ">",
        "explanationVi": "6 > 3."
      },
      {
        "id": "m1_t4_q12",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 11",
        "promptVi": "Tính: 0 + 5 = ?",
        "promptEn": "Calculate: 0 + 5 = ?",
        "options": [
          "0",
          "4",
          "5"
        ],
        "answer": "5",
        "explanationVi": "0 + 5 = 5."
      },
      {
        "id": "m1_t4_q13",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 10",
        "promptVi": "Bác nông dân có 3 con bò, bác mua thêm 1 con bò nữa. Hỏi bác có tất cả mấy con bò?",
        "promptEn": "A farmer has 3 cows and buys 1 more cow. How many cows in total?",
        "options": [
          "3 con",
          "4 con",
          "5 con"
        ],
        "answer": "4 con",
        "explanationVi": "3 + 1 = 4 con bò."
      },
      {
        "id": "m1_t4_q14",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 6",
        "promptVi": "Sắp xếp tuổi của 3 bạn: An 6 tuổi, Bình 8 tuổi, Chi 7 tuổi theo thứ tự từ nhỏ đến lớn:",
        "promptEn": "Order ages of An (6), Binh (8), Chi (7) from youngest to oldest:",
        "options": [
          "An, Chi, Bình",
          "Bình, Chi, An",
          "Chi, An, Bình"
        ],
        "answer": "An, Chi, Bình",
        "explanationVi": "6 < 7 < 8 tương ứng là An, Chi, Bình."
      },
      {
        "id": "m1_t4_q15",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 9",
        "promptVi": "Một chiếc bánh quy hình vuông được cắt chéo thành 2 phần bằng nhau. Mỗi phần có dạng hình gì?",
        "promptEn": "A square biscuit is cut diagonally into 2 equal parts. Each part is which shape?",
        "options": [
          "Hình tam giác",
          "Hình tròn",
          "Hình vuông"
        ],
        "answer": "Hình tam giác",
        "explanationVi": "Cắt chéo hình vuông được 2 hình tam giác."
      }
    ]
  },
  {
    "periodId": "final-sem-1",
    "periodTitleVi": "CUỐI HỌC KÌ I",
    "periodTitleEn": "End of Semester 1",
    "testId": "final1_test1",
    "testNumber": 1,
    "titleVi": "Đề Kiểm Tra Số 1 – Cuối Học Kì I",
    "titleEn": "Math Test 1 – End of Semester 1",
    "timeMinutes": 35,
    "questions": [
      {
        "id": "f1_t1_q1",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 14",
        "promptVi": "Viên xúc xắc (con súc sắc) có dạng khối gì?",
        "promptEn": "A playing die has which solid 3D shape?",
        "visualConfig": {
          "mode": "shape",
          "shapeType": "cube"
        },
        "options": [
          "Khối lập phương",
          "Khối hộp chữ nhật",
          "Hình vuông"
        ],
        "answer": "Khối lập phương",
        "explanationVi": "Viên xúc xắc có 6 mặt hình vuông bằng nhau là khối lập phương."
      },
      {
        "id": "f1_t1_q2",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 12",
        "promptVi": "Tính kết quả phép trừ: 5 - 2 = ?",
        "promptEn": "Calculate: 5 - 2 = ?",
        "options": [
          "2",
          "3",
          "4"
        ],
        "answer": "3",
        "explanationVi": "5 bớt 2 bằng 3."
      },
      {
        "id": "f1_t1_q3",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 15",
        "promptVi": "Khi ngồi học ngay ngắn, tay cầm bút viết của em thường là tay nào?",
        "promptEn": "Which hand do you usually write with?",
        "options": [
          "Tay phải",
          "Tay trái",
          "Cả hai tay"
        ],
        "answer": "Tay phải",
        "explanationVi": "Học sinh thường cầm bút bằng tay phải."
      },
      {
        "id": "f1_t1_q4",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 16",
        "promptVi": "Tính: 6 + 3 = ?",
        "promptEn": "Calculate: 6 + 3 = ?",
        "options": [
          "8",
          "9",
          "10"
        ],
        "answer": "9",
        "explanationVi": "6 + 3 = 9."
      },
      {
        "id": "f1_t1_q5",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 14",
        "promptVi": "Hộp sữa tươi giấy hoặc viên gạch xây nhà có dạng khối gì?",
        "promptEn": "A milk carton or a building brick has which 3D shape?",
        "options": [
          "Khối hộp chữ nhật",
          "Khối lập phương",
          "Hình tròn"
        ],
        "answer": "Khối hộp chữ nhật",
        "explanationVi": "Hộp sữa, viên gạch có dạng khối hộp chữ nhật."
      },
      {
        "id": "f1_t1_q6",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 17",
        "promptVi": "Tính: 10 - 4 = ?",
        "promptEn": "Calculate: 10 - 4 = ?",
        "options": [
          "5",
          "6",
          "7"
        ],
        "answer": "6",
        "explanationVi": "10 - 4 = 6."
      },
      {
        "id": "f1_t1_q7",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 18",
        "promptVi": "Tính giá trị biểu thức: 4 + 3 - 2 = ?",
        "promptEn": "Calculate: 4 + 3 - 2 = ?",
        "options": [
          "5",
          "6",
          "7"
        ],
        "answer": "5",
        "explanationVi": "4 + 3 = 7; 7 - 2 = 5."
      },
      {
        "id": "f1_t1_q8",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 18",
        "promptVi": "So sánh hai vế: 5 + 3 ... 9 - 1",
        "promptEn": "Compare: 5 + 3 ... 9 - 1",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": "=",
        "explanationVi": "5 + 3 = 8 và 9 - 1 = 8, vậy 8 = 8."
      },
      {
        "id": "f1_t1_q9",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 17",
        "promptVi": "Điền số thích hợp vào chỗ chấm: 7 + ... = 10",
        "promptEn": "Fill in the blank: 7 + ... = 10",
        "options": [
          "2",
          "3",
          "4"
        ],
        "answer": "3",
        "explanationVi": "7 + 3 = 10."
      },
      {
        "id": "f1_t1_q10",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 15",
        "promptVi": "Mặt trời mọc ở phía trên ngọn núi. Ngọn núi ở vị trí nào so với mặt trời?",
        "promptEn": "The sun rises above the mountain. Where is the mountain relative to the sun?",
        "options": [
          "Ở phía dưới",
          "Ở phía trên",
          "Ở bên phải"
        ],
        "answer": "Ở phía dưới",
        "explanationVi": "Mặt trời ở phía trên thì ngọn núi ở phía dưới."
      },
      {
        "id": "f1_t1_q11",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 13",
        "promptVi": "Tính: 8 - 0 = ?",
        "promptEn": "Calculate: 8 - 0 = ?",
        "options": [
          "0",
          "7",
          "8"
        ],
        "answer": "8",
        "explanationVi": "Số nào trừ đi 0 cũng bằng chính nó: 8 - 0 = 8."
      },
      {
        "id": "f1_t1_q12",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 19",
        "promptVi": "Tính nhẩm: 2 + 5 + 3 = ?",
        "promptEn": "Calculate: 2 + 5 + 3 = ?",
        "options": [
          "9",
          "10",
          "8"
        ],
        "answer": "10",
        "explanationVi": "2 + 5 = 7; 7 + 3 = 10."
      },
      {
        "id": "f1_t1_q13",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 17",
        "promptVi": "Bà có 9 quả trứng vịt, bà đã rán 4 quả ăn sáng. Hỏi bà còn lại bao nhiêu quả trứng?",
        "promptEn": "Grandma has 9 eggs, she fries 4 for breakfast. How many eggs are left?",
        "options": [
          "4 quả",
          "5 quả",
          "6 quả"
        ],
        "answer": "5 quả",
        "explanationVi": "9 - 4 = 5 quả trứng."
      },
      {
        "id": "f1_t1_q14",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 18",
        "promptVi": "Trong bể có 6 chú cá. Minh thả thêm 3 chú cá, sau đó vớt ra 2 chú cá. Hỏi trong bể còn mấy chú cá?",
        "promptEn": "There are 6 fish in a tank. Minh adds 3 fish, then removes 2. How many fish are in the tank now?",
        "options": [
          "6 con",
          "7 con",
          "8 con"
        ],
        "answer": "7 con",
        "explanationVi": "6 + 3 = 9; 9 - 2 = 7 chú cá."
      },
      {
        "id": "f1_t1_q15",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 20",
        "promptVi": "Một cột đèn tín hiệu giao thông gồm 3 bóng đèn: đỏ, vàng, xanh. Hỏi 2 cột đèn tín hiệu giao thông có tất cả mấy bóng đèn?",
        "promptEn": "A traffic signal has 3 lights: red, yellow, green. How many lights do 2 traffic signals have in total?",
        "options": [
          "5 bóng",
          "6 bóng",
          "7 bóng"
        ],
        "answer": "6 bóng",
        "explanationVi": "3 + 3 = 6 bóng đèn."
      }
    ]
  },
  {
    "periodId": "final-sem-1",
    "periodTitleVi": "CUỐI HỌC KÌ I",
    "periodTitleEn": "End of Semester 1",
    "testId": "final1_test2",
    "testNumber": 2,
    "titleVi": "Đề Kiểm Tra Số 2 – Cuối Học Kì I",
    "titleEn": "Math Test 2 – End of Semester 1",
    "timeMinutes": 35,
    "questions": [
      {
        "id": "f1_t2_q1",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 16",
        "promptVi": "Tính: 5 + 4 = ?",
        "promptEn": "Calculate: 5 + 4 = ?",
        "options": [
          "8",
          "9",
          "10"
        ],
        "answer": "9",
        "explanationVi": "5 + 4 = 9."
      },
      {
        "id": "f1_t2_q2",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 17",
        "promptVi": "Tính: 9 - 3 = ?",
        "promptEn": "Calculate: 9 - 3 = ?",
        "options": [
          "5",
          "6",
          "7"
        ],
        "answer": "6",
        "explanationVi": "9 - 3 = 6."
      },
      {
        "id": "f1_t2_q3",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 14",
        "promptVi": "Khối lập phương có bao nhiêu mặt phẳng?",
        "promptEn": "How many flat faces does a cube have?",
        "options": [
          "4 mặt",
          "6 mặt",
          "8 mặt"
        ],
        "answer": "6 mặt",
        "explanationVi": "Khối lập phương có 6 mặt hình vuông."
      },
      {
        "id": "f1_t2_q4",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 15",
        "promptVi": "Quyển sách để trên mặt bàn. Mặt bàn ở vị trí nào so với quyển sách?",
        "promptEn": "The book is on the table. Where is the table relative to the book?",
        "options": [
          "Ở phía dưới",
          "Ở phía trên",
          "Ở bên phải"
        ],
        "answer": "Ở phía dưới",
        "explanationVi": "Mặt bàn ở phía dưới quyển sách."
      },
      {
        "id": "f1_t2_q5",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 12",
        "promptVi": "Tính: 4 - 4 = ?",
        "promptEn": "Calculate: 4 - 4 = ?",
        "options": [
          "0",
          "1",
          "4"
        ],
        "answer": "0",
        "explanationVi": "Một số trừ đi chính nó bằng 0."
      },
      {
        "id": "f1_t2_q6",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 16",
        "promptVi": "Tính: 7 + 2 = ?",
        "promptEn": "Calculate: 7 + 2 = ?",
        "options": [
          "8",
          "9",
          "10"
        ],
        "answer": "9",
        "explanationVi": "7 + 2 = 9."
      },
      {
        "id": "f1_t2_q7",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 18",
        "promptVi": "Tính: 8 - 3 + 4 = ?",
        "promptEn": "Calculate: 8 - 3 + 4 = ?",
        "options": [
          "8",
          "9",
          "10"
        ],
        "answer": "9",
        "explanationVi": "8 - 3 = 5; 5 + 4 = 9."
      },
      {
        "id": "f1_t2_q8",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 17",
        "promptVi": "Điền số thích hợp: 10 - ... = 4",
        "promptEn": "Fill in the blank: 10 - ... = 4",
        "options": [
          "5",
          "6",
          "7"
        ],
        "answer": "6",
        "explanationVi": "10 - 6 = 4."
      },
      {
        "id": "f1_t2_q9",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 18",
        "promptVi": "Chọn dấu thích hợp: 6 + 2 ... 10 - 1",
        "promptEn": "Choose the sign: 6 + 2 ... 10 - 1",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": "<",
        "explanationVi": "6 + 2 = 8 và 10 - 1 = 9. Vì 8 < 9 nên điền dấu <."
      },
      {
        "id": "f1_t2_q10",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 19",
        "promptVi": "Tính: 10 - 5 - 2 = ?",
        "promptEn": "Calculate: 10 - 5 - 2 = ?",
        "options": [
          "3",
          "4",
          "5"
        ],
        "answer": "3",
        "explanationVi": "10 - 5 = 5; 5 - 2 = 3."
      },
      {
        "id": "f1_t2_q11",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 14",
        "promptVi": "Hộp phấn viết của cô giáo thường có dạng hình khối nào?",
        "promptEn": "A chalk box usually has which solid shape?",
        "options": [
          "Khối hộp chữ nhật (hoặc khối lập phương)",
          "Hình tròn",
          "Hình tam giác"
        ],
        "answer": "Khối hộp chữ nhật (hoặc khối lập phương)",
        "explanationVi": "Hộp phấn có dạng khối hộp chữ nhật hoặc khối lập phương."
      },
      {
        "id": "f1_t2_q12",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 16",
        "promptVi": "Điền số thích hợp: 5 + 5 = ?",
        "promptEn": "Calculate: 5 + 5 = ?",
        "options": [
          "9",
          "10",
          "8"
        ],
        "answer": "10",
        "explanationVi": "5 + 5 = 10."
      },
      {
        "id": "f1_t2_q13",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 20",
        "promptVi": "Lớp 1A có 6 bạn nữ và 4 bạn nam tham gia đồng diễn thể dục. Hỏi có tất cả bao nhiêu bạn?",
        "promptEn": "Class 1A has 6 girls and 4 boys in the show. How many students in total?",
        "options": [
          "9 bạn",
          "10 bạn",
          "8 bạn"
        ],
        "answer": "10 bạn",
        "explanationVi": "6 + 4 = 10 bạn."
      },
      {
        "id": "f1_t2_q14",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 17",
        "promptVi": "Hùng có 8 quả bóng, Hùng cho em 3 quả bóng. Hỏi Hùng còn lại mấy quả bóng?",
        "promptEn": "Hung has 8 balloons, he gives 3 to his sister. How many balloons does he have left?",
        "options": [
          "4 quả",
          "5 quả",
          "6 quả"
        ],
        "answer": "5 quả",
        "explanationVi": "8 - 3 = 5 quả bóng."
      },
      {
        "id": "f1_t2_q15",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 19",
        "promptVi": "Đàn gà có 10 con. Lúc đầu có 3 con chạy vào chuồng, lúc sau có thêm 2 con nữa chạy vào chuồng. Hỏi ngoài sân còn lại mấy con gà?",
        "promptEn": "There are 10 chickens. First 3 run inside, then 2 more run inside. How many are left outside?",
        "options": [
          "5 con",
          "6 con",
          "7 con"
        ],
        "answer": "5 con",
        "explanationVi": "10 - 3 - 2 = 5 con gà."
      }
    ]
  },
  {
    "periodId": "final-sem-1",
    "periodTitleVi": "CUỐI HỌC KÌ I",
    "periodTitleEn": "End of Semester 1",
    "testId": "final1_test3",
    "testNumber": 3,
    "titleVi": "Đề Kiểm Tra Số 3 – Cuối Học Kì I",
    "titleEn": "Math Test 3 – End of Semester 1",
    "timeMinutes": 35,
    "questions": [
      {
        "id": "f1_t3_q1",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 16",
        "promptVi": "Tính: 8 + 1 = ?",
        "promptEn": "Calculate: 8 + 1 = ?",
        "options": [
          "8",
          "9",
          "10"
        ],
        "answer": "9",
        "explanationVi": "8 + 1 = 9."
      },
      {
        "id": "f1_t3_q2",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 17",
        "promptVi": "Tính: 7 - 4 = ?",
        "promptEn": "Calculate: 7 - 4 = ?",
        "options": [
          "2",
          "3",
          "4"
        ],
        "answer": "3",
        "explanationVi": "7 - 4 = 3."
      },
      {
        "id": "f1_t3_q3",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 15",
        "promptVi": "Em đi bộ trên vỉa hè thì phải đi về phía bên nào theo quy định an toàn giao thông?",
        "promptEn": "Which side of the road or sidewalk should you walk on?",
        "options": [
          "Bên phải",
          "Bên trái",
          "Ở giữa lòng đường"
        ],
        "answer": "Bên phải",
        "explanationVi": "Luật giao thông quy định đi về phía bên phải."
      },
      {
        "id": "f1_t3_q4",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 16",
        "promptVi": "Tính: 4 + 4 = ?",
        "promptEn": "Calculate: 4 + 4 = ?",
        "options": [
          "7",
          "8",
          "9"
        ],
        "answer": "8",
        "explanationVi": "4 + 4 = 8."
      },
      {
        "id": "f1_t3_q5",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 14",
        "promptVi": "Khối hộp chữ nhật có mấy mặt?",
        "promptEn": "How many faces does a cuboid have?",
        "options": [
          "4 mặt",
          "6 mặt",
          "8 mặt"
        ],
        "answer": "6 mặt",
        "explanationVi": "Khối hộp chữ nhật có 6 mặt."
      },
      {
        "id": "f1_t3_q6",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 17",
        "promptVi": "Tính: 10 - 8 = ?",
        "promptEn": "Calculate: 10 - 8 = ?",
        "options": [
          "1",
          "2",
          "3"
        ],
        "answer": "2",
        "explanationVi": "10 - 8 = 2."
      },
      {
        "id": "f1_t3_q7",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 18",
        "promptVi": "Tính: 9 - 5 + 3 = ?",
        "promptEn": "Calculate: 9 - 5 + 3 = ?",
        "options": [
          "6",
          "7",
          "8"
        ],
        "answer": "7",
        "explanationVi": "9 - 5 = 4; 4 + 3 = 7."
      },
      {
        "id": "f1_t3_q8",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 18",
        "promptVi": "So sánh: 7 + 1 ... 10 - 2",
        "promptEn": "Compare: 7 + 1 ... 10 - 2",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": "=",
        "explanationVi": "7 + 1 = 8 và 10 - 2 = 8. Ta điền dấu =."
      },
      {
        "id": "f1_t3_q9",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 17",
        "promptVi": "Điền số thích hợp: 8 - ... = 5",
        "promptEn": "Fill in the blank: 8 - ... = 5",
        "options": [
          "2",
          "3",
          "4"
        ],
        "answer": "3",
        "explanationVi": "8 - 3 = 5."
      },
      {
        "id": "f1_t3_q10",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 19",
        "promptVi": "Tính: 3 + 3 + 3 = ?",
        "promptEn": "Calculate: 3 + 3 + 3 = ?",
        "options": [
          "8",
          "9",
          "10"
        ],
        "answer": "9",
        "explanationVi": "3 + 3 = 6; 6 + 3 = 9."
      },
      {
        "id": "f1_t3_q11",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 16",
        "promptVi": "Chọn dấu thích hợp: 5 + 4 ... 10",
        "promptEn": "Choose the sign: 5 + 4 ... 10",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": "<",
        "explanationVi": "5 + 4 = 9 < 10."
      },
      {
        "id": "f1_t3_q12",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 18",
        "promptVi": "Điền số thích hợp: ... + 6 = 10",
        "promptEn": "Fill in the blank: ... + 6 = 10",
        "options": [
          "3",
          "4",
          "5"
        ],
        "answer": "4",
        "explanationVi": "4 + 6 = 10."
      },
      {
        "id": "f1_t3_q13",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 20",
        "promptVi": "Trên cành cây có 7 chú chim, có 2 chú chim bay đi, sau đó lại có 1 chú chim bay đến. Hỏi trên cành cây lúc này có mấy chú chim?",
        "promptEn": "7 birds on a tree, 2 fly away, then 1 flies in. How many birds now?",
        "options": [
          "5 con",
          "6 con",
          "7 con"
        ],
        "answer": "6 con",
        "explanationVi": "7 - 2 = 5; 5 + 1 = 6 chú chim."
      },
      {
        "id": "f1_t3_q14",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 17",
        "promptVi": "Mẹ mua về 10 quả cam, cả nhà đã ăn 6 quả. Hỏi còn lại bao nhiêu quả cam?",
        "promptEn": "Mother buys 10 oranges, family eats 6. How many oranges remain?",
        "options": [
          "3 quả",
          "4 quả",
          "5 quả"
        ],
        "answer": "4 quả",
        "explanationVi": "10 - 6 = 4 quả cam."
      },
      {
        "id": "f1_t3_q15",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 20",
        "promptVi": "Nam có 5 viên bi, An có nhiều hơn Nam 2 viên bi. Hỏi bạn An có mấy viên bi?",
        "promptEn": "Nam has 5 marbles, An has 2 more than Nam. How many marbles does An have?",
        "options": [
          "6 viên bi",
          "7 viên bi",
          "8 viên bi"
        ],
        "answer": "7 viên bi",
        "explanationVi": "5 + 2 = 7 viên bi."
      }
    ]
  },
  {
    "periodId": "final-sem-1",
    "periodTitleVi": "CUỐI HỌC KÌ I",
    "periodTitleEn": "End of Semester 1",
    "testId": "final1_test4",
    "testNumber": 4,
    "titleVi": "Đề Kiểm Tra Số 4 – Cuối Học Kì I",
    "titleEn": "Math Test 4 – End of Semester 1",
    "timeMinutes": 35,
    "questions": [
      {
        "id": "f1_t4_q1",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 16",
        "promptVi": "Tính: 3 + 7 = ?",
        "promptEn": "Calculate: 3 + 7 = ?",
        "options": [
          "9",
          "10",
          "8"
        ],
        "answer": "10",
        "explanationVi": "3 + 7 = 10."
      },
      {
        "id": "f1_t4_q2",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 17",
        "promptVi": "Tính: 8 - 5 = ?",
        "promptEn": "Calculate: 8 - 5 = ?",
        "options": [
          "2",
          "3",
          "4"
        ],
        "answer": "3",
        "explanationVi": "8 - 5 = 3."
      },
      {
        "id": "f1_t4_q3",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 14",
        "promptVi": "Hộp bánh quy hình lập phương có tất cả các mặt là hình gì?",
        "promptEn": "All faces of a cube biscuit tin are shaped like which shape?",
        "options": [
          "Hình vuông",
          "Hình chữ nhật",
          "Hình tròn"
        ],
        "answer": "Hình vuông",
        "explanationVi": "Các mặt của khối lập phương đều là hình vuông."
      },
      {
        "id": "f1_t4_q4",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 15",
        "promptVi": "Bạn đứng xếp hàng ở ngay sau em. Vậy em ở vị trí nào so với bạn?",
        "promptEn": "A friend stands right behind you in line. Where are you relative to that friend?",
        "options": [
          "Ở phía trước",
          "Ở phía sau",
          "Ở bên phải"
        ],
        "answer": "Ở phía trước",
        "explanationVi": "Bạn ở phía sau thì em ở phía trước."
      },
      {
        "id": "f1_t4_q5",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 17",
        "promptVi": "Tính: 10 - 10 = ?",
        "promptEn": "Calculate: 10 - 10 = ?",
        "options": [
          "0",
          "1",
          "10"
        ],
        "answer": "0",
        "explanationVi": "10 - 10 = 0."
      },
      {
        "id": "f1_t4_q6",
        "level": "nhan_biet",
        "sgk": "Tập 1 - Bài 16",
        "promptVi": "Tính: 6 + 1 = ?",
        "promptEn": "Calculate: 6 + 1 = ?",
        "options": [
          "6",
          "7",
          "8"
        ],
        "answer": "7",
        "explanationVi": "6 + 1 = 7."
      },
      {
        "id": "f1_t4_q7",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 18",
        "promptVi": "Tính: 10 - 3 + 2 = ?",
        "promptEn": "Calculate: 10 - 3 + 2 = ?",
        "options": [
          "8",
          "9",
          "10"
        ],
        "answer": "9",
        "explanationVi": "10 - 3 = 7; 7 + 2 = 9."
      },
      {
        "id": "f1_t4_q8",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 18",
        "promptVi": "Chọn dấu thích hợp: 4 + 5 ... 10 - 2",
        "promptEn": "Choose the sign: 4 + 5 ... 10 - 2",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": ">",
        "explanationVi": "4 + 5 = 9 và 10 - 2 = 8. Vì 9 > 8 nên điền dấu >."
      },
      {
        "id": "f1_t4_q9",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 17",
        "promptVi": "Điền số thích hợp: 9 - ... = 2",
        "promptEn": "Fill in the blank: 9 - ... = 2",
        "options": [
          "6",
          "7",
          "8"
        ],
        "answer": "7",
        "explanationVi": "9 - 7 = 2."
      },
      {
        "id": "f1_t4_q10",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 19",
        "promptVi": "Tính: 2 + 2 + 5 = ?",
        "promptEn": "Calculate: 2 + 2 + 5 = ?",
        "options": [
          "8",
          "9",
          "10"
        ],
        "answer": "9",
        "explanationVi": "2 + 2 = 4; 4 + 5 = 9."
      },
      {
        "id": "f1_t4_q11",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 18",
        "promptVi": "Điền số thích hợp: 6 + ... = 9",
        "promptEn": "Fill in the blank: 6 + ... = 9",
        "options": [
          "2",
          "3",
          "4"
        ],
        "answer": "3",
        "explanationVi": "6 + 3 = 9."
      },
      {
        "id": "f1_t4_q12",
        "level": "thong_hieu",
        "sgk": "Tập 1 - Bài 20",
        "promptVi": "Trong các phép tính sau, phép tính nào có kết quả bằng 8?",
        "promptEn": "Which calculation has the result 8?",
        "options": [
          "5 + 3",
          "4 + 3",
          "10 - 3"
        ],
        "answer": "5 + 3",
        "explanationVi": "5 + 3 = 8."
      },
      {
        "id": "f1_t4_q13",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 20",
        "promptVi": "Bác thợ rèn có 10 thanh sắt, bác đã dùng 7 thanh để làm hàng rào. Hỏi bác còn lại mấy thanh sắt?",
        "promptEn": "A blacksmith has 10 iron bars, uses 7 for a fence. How many remain?",
        "options": [
          "2 thanh",
          "3 thanh",
          "4 thanh"
        ],
        "answer": "3 thanh",
        "explanationVi": "10 - 7 = 3 thanh sắt."
      },
      {
        "id": "f1_t4_q14",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 20",
        "promptVi": "Hà có 4 chiếc bút chì màu, mẹ mua thêm cho Hà 3 chiếc nữa. Sau đó Hà cho bạn mượn 1 chiếc. Hỏi Hà còn mấy chiếc bút chì màu?",
        "promptEn": "Ha has 4 colored pencils, mom buys 3 more, then Ha lends 1 to a friend. How many left?",
        "options": [
          "5 chiếc",
          "6 chiếc",
          "7 chiếc"
        ],
        "answer": "6 chiếc",
        "explanationVi": "4 + 3 = 7; 7 - 1 = 6 chiếc bút chì màu."
      },
      {
        "id": "f1_t4_q15",
        "level": "van_dung",
        "sgk": "Tập 1 - Bài 20",
        "promptVi": "Tổ Một trồng được 5 cây xanh, tổ Hai trồng được số cây bằng tổ Một. Hỏi cả hai tổ trồng được tất cả bao nhiêu cây xanh?",
        "promptEn": "Group 1 planted 5 trees, Group 2 planted the same. How many trees in total?",
        "options": [
          "8 cây",
          "9 cây",
          "10 cây"
        ],
        "answer": "10 cây",
        "explanationVi": "5 + 5 = 10 cây xanh."
      }
    ]
  },
  {
    "periodId": "mid-sem-2",
    "periodTitleVi": "GIỮA HỌC KÌ II",
    "periodTitleEn": "Mid-Semester 2",
    "testId": "mid2_test1",
    "testNumber": 1,
    "titleVi": "Đề Kiểm Tra Số 1 – Giữa Học Kì II",
    "titleEn": "Math Test 1 – Mid-Semester 2",
    "timeMinutes": 35,
    "questions": [
      {
        "id": "m2_t1_q1",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 21",
        "promptVi": "1 bó que tính chục gồm bao nhiêu que tính rời?",
        "promptEn": "How many single sticks are in 1 ten-bundle?",
        "options": [
          "10 que tính",
          "1 que tính",
          "100 que tính"
        ],
        "answer": "10 que tính",
        "explanationVi": "1 chục que tính gồm đúng 10 que tính."
      },
      {
        "id": "m2_t1_q2",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 26",
        "promptVi": "Đơn vị đo độ dài xăng-ti-mét được viết tắt là gì?",
        "promptEn": "What is the abbreviation for the unit centimeter?",
        "options": [
          "cm",
          "m",
          "kg"
        ],
        "answer": "cm",
        "explanationVi": "Xăng-ti-mét viết tắt là cm."
      },
      {
        "id": "m2_t1_q3",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 21",
        "promptVi": "Số 45 gồm mấy chục và mấy đơn vị?",
        "promptEn": "Number 45 consists of how many tens and ones?",
        "options": [
          "4 chục và 5 đơn vị",
          "5 chục và 4 đơn vị",
          "40 chục và 5 đơn vị"
        ],
        "answer": "4 chục và 5 đơn vị",
        "explanationVi": "Số 45 gồm chữ số 4 chỉ hàng chục và chữ số 5 chỉ hàng đơn vị."
      },
      {
        "id": "m2_t1_q4",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 23",
        "promptVi": "Số nào đứng ngay sau số 69?",
        "promptEn": "Which number comes right after 69?",
        "options": [
          "Số 68",
          "Số 70",
          "Số 71"
        ],
        "answer": "Số 70",
        "explanationVi": "Số đứng ngay sau số 69 là số 70 (69 thêm 1 bằng 70)."
      },
      {
        "id": "m2_t1_q5",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 26",
        "promptVi": "Khi dùng thước kẻ để đo độ dài, đầu bên trái của đồ vật phải đặt trùng với vạch số mấy?",
        "promptEn": "When measuring with a ruler, which mark must the left end align with?",
        "options": [
          "Vạch số 0",
          "Vạch số 1",
          "Vạch số 10"
        ],
        "answer": "Vạch số 0",
        "explanationVi": "Phải đặt đầu vật trùng vạch số 0 của thước."
      },
      {
        "id": "m2_t1_q6",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 23",
        "promptVi": "Số lớn nhất có hai chữ số là số nào?",
        "promptEn": "What is the greatest two-digit number?",
        "options": [
          "90",
          "99",
          "100"
        ],
        "answer": "99",
        "explanationVi": "99 là số lớn nhất có 2 chữ số."
      },
      {
        "id": "m2_t1_q7",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 22",
        "promptVi": "Chọn dấu thích hợp để điền vào chỗ chấm: 54 ... 45",
        "promptEn": "Choose the sign: 54 ... 45",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": ">",
        "explanationVi": "5 chục lớn hơn 4 chục nên 54 > 45."
      },
      {
        "id": "m2_t1_q8",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 26",
        "promptVi": "Bút chì đặt từ vạch 0 cm đến vạch 12 cm trên thước kẻ. Bút chì dài mấy cm?",
        "promptEn": "A pencil spans from 0 cm to 12 cm on the ruler. How long is it?",
        "visualConfig": {
          "mode": "ruler",
          "startCm": 0,
          "lengthCm": 12,
          "objectName": "Bút chì"
        },
        "options": [
          "10 cm",
          "11 cm",
          "12 cm"
        ],
        "answer": "12 cm",
        "explanationVi": "Từ vạch 0 cm đến vạch 12 cm là 12 cm."
      },
      {
        "id": "m2_t1_q9",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 27",
        "promptVi": "Tính kết quả: 14 cm + 5 cm = ?",
        "promptEn": "Calculate: 14 cm + 5 cm = ?",
        "options": [
          "18 cm",
          "19 cm",
          "20 cm"
        ],
        "answer": "19 cm",
        "explanationVi": "14 + 5 = 19, thêm đơn vị đo là 19 cm."
      },
      {
        "id": "m2_t1_q10",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 22",
        "promptVi": "Trong các số: 37, 73, 58, 85, số nào lớn nhất?",
        "promptEn": "Among 37, 73, 58, 85, which is the greatest?",
        "options": [
          "73",
          "58",
          "85"
        ],
        "answer": "85",
        "explanationVi": "Số 85 có 8 chục và 5 đơn vị là số lớn nhất."
      },
      {
        "id": "m2_t1_q11",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 27",
        "promptVi": "Tính: 18 cm - 8 cm = ?",
        "promptEn": "Calculate: 18 cm - 8 cm = ?",
        "options": [
          "8 cm",
          "10 cm",
          "12 cm"
        ],
        "answer": "10 cm",
        "explanationVi": "18 cm - 8 cm = 10 cm."
      },
      {
        "id": "m2_t1_q12",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 23",
        "promptVi": "Số nào đứng ngay trước số 90?",
        "promptEn": "Which number comes right before 90?",
        "options": [
          "88",
          "89",
          "91"
        ],
        "answer": "89",
        "explanationVi": "Số đứng ngay trước số 90 là số 89 (90 bớt 1 bằng 89)."
      },
      {
        "id": "m2_t1_q13",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 28",
        "promptVi": "Băng giấy đỏ dài 15 cm, băng giấy xanh dài 10 cm. Hỏi cả hai băng giấy dài tất cả bao nhiêu cm?",
        "promptEn": "Red strip is 15 cm, blue strip is 10 cm. How long are both strips in total?",
        "options": [
          "20 cm",
          "25 cm",
          "30 cm"
        ],
        "answer": "25 cm",
        "explanationVi": "15 cm + 10 cm = 25 cm."
      },
      {
        "id": "m2_t1_q14",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 28",
        "promptVi": "Đoạn dây thừng dài 40 cm, bố cắt bớt đi 10 cm. Hỏi đoạn dây còn lại dài bao nhiêu cm?",
        "promptEn": "A rope is 40 cm long, dad cuts off 10 cm. How long is the remaining rope?",
        "options": [
          "20 cm",
          "30 cm",
          "35 cm"
        ],
        "answer": "30 cm",
        "explanationVi": "40 cm - 10 cm = 30 cm."
      },
      {
        "id": "m2_t1_q15",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 22",
        "promptVi": "Nhà bà có 35 con gà, nhà cô có 42 con gà. Nhà ai có nhiều gà hơn và nhiều hơn mấy con?",
        "promptEn": "Grandma has 35 chickens, aunt has 42 chickens. Who has more chickens?",
        "options": [
          "Nhà cô nhiều hơn",
          "Nhà bà nhiều hơn",
          "Hai nhà bằng nhau"
        ],
        "answer": "Nhà cô nhiều hơn",
        "explanationVi": "Vì 42 > 35 nên nhà cô có nhiều gà hơn."
      }
    ]
  },
  {
    "periodId": "mid-sem-2",
    "periodTitleVi": "GIỮA HỌC KÌ II",
    "periodTitleEn": "Mid-Semester 2",
    "testId": "mid2_test2",
    "testNumber": 2,
    "titleVi": "Đề Kiểm Tra Số 2 – Giữa Học Kì II",
    "titleEn": "Math Test 2 – Mid-Semester 2",
    "timeMinutes": 35,
    "questions": [
      {
        "id": "m2_t2_q1",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 21",
        "promptVi": "Số gồm 7 chục và 3 đơn vị được viết là số nào?",
        "promptEn": "Which number is made of 7 tens and 3 ones?",
        "options": [
          "37",
          "73",
          "70"
        ],
        "answer": "73",
        "explanationVi": "7 chục và 3 đơn vị viết là 73."
      },
      {
        "id": "m2_t2_q2",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 23",
        "promptVi": "Số bé nhất có hai chữ số là số nào?",
        "promptEn": "What is the smallest two-digit number?",
        "options": [
          "0",
          "10",
          "11"
        ],
        "answer": "10",
        "explanationVi": "10 là số bé nhất có hai chữ số."
      },
      {
        "id": "m2_t2_q3",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 25",
        "promptVi": "Cái bút chì dài hơn hay ngắn hơn cục tẩy nhỏ?",
        "promptEn": "Is a pencil longer or shorter than a small eraser?",
        "options": [
          "Dài hơn",
          "Ngắn hơn",
          "Bằng nhau"
        ],
        "answer": "Dài hơn",
        "explanationVi": "Bút chì thông thường dài hơn cục tẩy nhỏ."
      },
      {
        "id": "m2_t2_q4",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 21",
        "promptVi": "Số 60 đọc là gì?",
        "promptEn": "How do you read 60?",
        "options": [
          "Sáu mươi",
          "Mười sáu",
          "Sáu linh"
        ],
        "answer": "Sáu mươi",
        "explanationVi": "Số 60 đọc là sáu mươi."
      },
      {
        "id": "m2_t2_q5",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 26",
        "promptVi": "Trên thước kẻ học sinh, khoảng cách giữa vạch 0 và vạch 1 là mấy xăng-ti-mét?",
        "promptEn": "On a student ruler, what is the distance between mark 0 and 1?",
        "options": [
          "1 cm",
          "2 cm",
          "10 cm"
        ],
        "answer": "1 cm",
        "explanationVi": "Khoảng cách giữa vạch 0 và 1 là đúng 1 cm."
      },
      {
        "id": "m2_t2_q6",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 23",
        "promptVi": "Số nào đứng ngay sau số 99?",
        "promptEn": "Which number comes right after 99?",
        "options": [
          "98",
          "100",
          "90"
        ],
        "answer": "100",
        "explanationVi": "Số đứng ngay sau số 99 là số 100 (99 thêm 1 bằng 100)."
      },
      {
        "id": "m2_t2_q7",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 22",
        "promptVi": "Chọn dấu thích hợp: 78 ... 87",
        "promptEn": "Choose the sign: 78 ... 87",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": "<",
        "explanationVi": "7 chục bé hơn 8 chục nên 78 < 87."
      },
      {
        "id": "m2_t2_q8",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 27",
        "promptVi": "Tính: 30 cm + 20 cm = ?",
        "promptEn": "Calculate: 30 cm + 20 cm = ?",
        "options": [
          "40 cm",
          "50 cm",
          "60 cm"
        ],
        "answer": "50 cm",
        "explanationVi": "30 + 20 = 50 cm."
      },
      {
        "id": "m2_t2_q9",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 26",
        "promptVi": "Chiếc tẩy đặt từ vạch 0 cm đến vạch 4 cm. Chiếc tẩy dài mấy cm?",
        "promptEn": "An eraser spans from 0 cm to 4 cm. How long is it?",
        "visualConfig": {
          "mode": "ruler",
          "startCm": 0,
          "lengthCm": 4,
          "objectName": "Cục tẩy"
        },
        "options": [
          "3 cm",
          "4 cm",
          "5 cm"
        ],
        "answer": "4 cm",
        "explanationVi": "Dài đúng 4 cm."
      },
      {
        "id": "m2_t2_q10",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 22",
        "promptVi": "Dãy số nào được xếp theo thứ tự từ bé đến lớn?",
        "promptEn": "Which sequence is from smallest to greatest?",
        "options": [
          "24, 38, 51, 69",
          "69, 51, 38, 24",
          "51, 24, 69, 38"
        ],
        "answer": "24, 38, 51, 69",
        "explanationVi": "24 < 38 < 51 < 69."
      },
      {
        "id": "m2_t2_q11",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 27",
        "promptVi": "Tính: 25 cm - 5 cm = ?",
        "promptEn": "Calculate: 25 cm - 5 cm = ?",
        "options": [
          "15 cm",
          "20 cm",
          "25 cm"
        ],
        "answer": "20 cm",
        "explanationVi": "25 cm - 5 cm = 20 cm."
      },
      {
        "id": "m2_t2_q12",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 24",
        "promptVi": "Số nào nằm giữa số 49 và số 51?",
        "promptEn": "Which number lies between 49 and 51?",
        "options": [
          "48",
          "50",
          "52"
        ],
        "answer": "50",
        "explanationVi": "Số nằm giữa 49 và 51 là 50."
      },
      {
        "id": "m2_t2_q13",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 28",
        "promptVi": "Đoạn thẳng AB dài 8 cm, đoạn thẳng BC dài 6 cm. Hỏi đoạn thẳng AC dài bao nhiêu cm?",
        "promptEn": "Segment AB is 8 cm, BC is 6 cm. How long is AC?",
        "options": [
          "12 cm",
          "14 cm",
          "15 cm"
        ],
        "answer": "14 cm",
        "explanationVi": "8 cm + 6 cm = 14 cm."
      },
      {
        "id": "m2_t2_q14",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 28",
        "promptVi": "Cây bút chì của Nam dài 16 cm, cục tẩy của Nam dài 4 cm. Hỏi cây bút chì dài hơn cục tẩy mấy cm?",
        "promptEn": "Pencil is 16 cm, eraser is 4 cm. How much longer is the pencil?",
        "options": [
          "10 cm",
          "12 cm",
          "14 cm"
        ],
        "answer": "12 cm",
        "explanationVi": "16 cm - 4 cm = 12 cm."
      },
      {
        "id": "m2_t2_q15",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 24",
        "promptVi": "Bác nông dân thu hoạch được 50 bắp ngô vàng và 40 bắp ngô trắng. Hỏi bác thu hoạch được tất cả bao nhiêu bắp ngô?",
        "promptEn": "Farmer harvests 50 yellow corns and 40 white corns. How many in total?",
        "options": [
          "80 bắp",
          "90 bắp",
          "100 bắp"
        ],
        "answer": "90 bắp",
        "explanationVi": "50 + 40 = 90 bắp ngô."
      }
    ]
  },
  {
    "periodId": "mid-sem-2",
    "periodTitleVi": "GIỮA HỌC KÌ II",
    "periodTitleEn": "Mid-Semester 2",
    "testId": "mid2_test3",
    "testNumber": 3,
    "titleVi": "Đề Kiểm Tra Số 3 – Giữa Học Kì II",
    "titleEn": "Math Test 3 – Mid-Semester 2",
    "timeMinutes": 35,
    "questions": [
      {
        "id": "m2_t3_q1",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 21",
        "promptVi": "Số 82 gồm mấy chục và mấy đơn vị?",
        "promptEn": "Number 82 consists of how many tens and ones?",
        "options": [
          "8 chục và 2 đơn vị",
          "2 chục và 8 đơn vị",
          "80 chục và 2 đơn vị"
        ],
        "answer": "8 chục và 2 đơn vị",
        "explanationVi": "82 gồm 8 chục và 2 đơn vị."
      },
      {
        "id": "m2_t3_q2",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 23",
        "promptVi": "Số nào đứng ngay trước số 60?",
        "promptEn": "Which number comes right before 60?",
        "options": [
          "58",
          "59",
          "61"
        ],
        "answer": "59",
        "explanationVi": "Số đứng ngay trước số 60 là số 59 (60 bớt 1 bằng 59)."
      },
      {
        "id": "m2_t3_q3",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 26",
        "promptVi": "Chiếc bút chì màu đặt từ vạch 0 cm đến vạch 9 cm. Bút dài mấy cm?",
        "promptEn": "A crayon spans 0 cm to 9 cm. How long is it?",
        "options": [
          "8 cm",
          "9 cm",
          "10 cm"
        ],
        "answer": "9 cm",
        "explanationVi": "Dài đúng 9 cm."
      },
      {
        "id": "m2_t3_q4",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 21",
        "promptVi": "Số 94 đọc là gì?",
        "promptEn": "How do you read 94?",
        "options": [
          "Chín mươi bốn (hoặc chín mươi tư)",
          "Chín mươi",
          "Bốn mươi chín"
        ],
        "answer": "Chín mươi bốn (hoặc chín mươi tư)",
        "explanationVi": "94 đọc là chín mươi tư hoặc chín mươi bốn."
      },
      {
        "id": "m2_t3_q5",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 25",
        "promptVi": "Để so sánh độ dài 2 cái thước, ta phải đặt 1 đầu của 2 thước như thế nào?",
        "promptEn": "To compare two rulers, how must one end be placed?",
        "options": [
          "Đặt thẳng hàng bằng nhau ở 1 đầu",
          "Đặt lệch nhau",
          "Đặt vuông góc"
        ],
        "answer": "Đặt thẳng hàng bằng nhau ở 1 đầu",
        "explanationVi": "Phải đặt 1 đầu của hai vật bằng nhau."
      },
      {
        "id": "m2_t3_q6",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 23",
        "promptVi": "Các số tròn chục từ 10 đến 90 gồm mấy số?",
        "promptEn": "How many round-ten numbers are there from 10 to 90?",
        "options": [
          "8 số",
          "9 số",
          "10 số"
        ],
        "answer": "9 số",
        "explanationVi": "Gồm 9 số: 10, 20, 30, 40, 50, 60, 70, 80, 90."
      },
      {
        "id": "m2_t3_q7",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 22",
        "promptVi": "Chọn dấu thích hợp: 66 ... 69",
        "promptEn": "Choose the sign: 66 ... 69",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": "<",
        "explanationVi": "6 chục bằng 6 chục, 6 đơn vị < 9 đơn vị nên 66 < 69."
      },
      {
        "id": "m2_t3_q8",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 27",
        "promptVi": "Tính: 40 cm + 30 cm = ?",
        "promptEn": "Calculate: 40 cm + 30 cm = ?",
        "options": [
          "60 cm",
          "70 cm",
          "80 cm"
        ],
        "answer": "70 cm",
        "explanationVi": "40 + 30 = 70 cm."
      },
      {
        "id": "m2_t3_q9",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 27",
        "promptVi": "Tính: 38 cm - 8 cm = ?",
        "promptEn": "Calculate: 38 cm - 8 cm = ?",
        "options": [
          "20 cm",
          "30 cm",
          "38 cm"
        ],
        "answer": "30 cm",
        "explanationVi": "38 cm - 8 cm = 30 cm."
      },
      {
        "id": "m2_t3_q10",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 22",
        "promptVi": "Trong các số: 91, 19, 84, 48, số nào bé nhất?",
        "promptEn": "Among 91, 19, 84, 48, which is the smallest?",
        "options": [
          "19",
          "48",
          "84"
        ],
        "answer": "19",
        "explanationVi": "Số 19 có 1 chục là số bé nhất."
      },
      {
        "id": "m2_t3_q11",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 24",
        "promptVi": "Số gồm 8 chục và 0 đơn vị là số nào?",
        "promptEn": "Which number is 8 tens and 0 ones?",
        "options": [
          "8",
          "80",
          "18"
        ],
        "answer": "80",
        "explanationVi": "8 chục và 0 đơn vị là 80."
      },
      {
        "id": "m2_t3_q12",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 28",
        "promptVi": "Chọn dấu thích hợp: 15 cm + 4 cm ... 20 cm",
        "promptEn": "Choose the sign: 15 cm + 4 cm ... 20 cm",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": "<",
        "explanationVi": "15 + 4 = 19 cm < 20 cm."
      },
      {
        "id": "m2_t3_q13",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 28",
        "promptVi": "Một sợi ruy-băng dài 35 cm, chị cắt may nơ hết 15 cm. Hỏi sợi ruy-băng còn lại dài bao nhiêu cm?",
        "promptEn": "A ribbon is 35 cm, sister cuts 15 cm for a bow. How long is the rest?",
        "options": [
          "15 cm",
          "20 cm",
          "25 cm"
        ],
        "answer": "20 cm",
        "explanationVi": "35 cm - 15 cm = 20 cm."
      },
      {
        "id": "m2_t3_q14",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 24",
        "promptVi": "Vườn nhà Mai có 30 cây cam, mẹ trồng thêm 20 cây cam nữa. Hỏi vườn nhà Mai có tất cả bao nhiêu cây cam?",
        "promptEn": "Mai's garden has 30 orange trees, mother plants 20 more. How many trees in total?",
        "options": [
          "40 cây",
          "50 cây",
          "60 cây"
        ],
        "answer": "50 cây",
        "explanationVi": "30 + 20 = 50 cây cam."
      },
      {
        "id": "m2_t3_q15",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 28",
        "promptVi": "Cột cờ trường em cao hơn hay thấp hơn cây bút mực của em?",
        "promptEn": "Is your school flagpole taller or shorter than your pen?",
        "options": [
          "Cao hơn rất nhiều",
          "Thấp hơn",
          "Bằng nhau"
        ],
        "answer": "Cao hơn rất nhiều",
        "explanationVi": "Cột cờ trường học cao hơn cây bút rất nhiều."
      }
    ]
  },
  {
    "periodId": "mid-sem-2",
    "periodTitleVi": "GIỮA HỌC KÌ II",
    "periodTitleEn": "Mid-Semester 2",
    "testId": "mid2_test4",
    "testNumber": 4,
    "titleVi": "Đề Kiểm Tra Số 4 – Giữa Học Kì II",
    "titleEn": "Math Test 4 – Mid-Semester 2",
    "timeMinutes": 35,
    "questions": [
      {
        "id": "m2_t4_q1",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 21",
        "promptVi": "Số 55 gồm mấy chục và mấy đơn vị?",
        "promptEn": "Number 55 consists of how many tens and ones?",
        "options": [
          "5 chục và 5 đơn vị",
          "50 chục và 5 đơn vị",
          "5 chục và 0 đơn vị"
        ],
        "answer": "5 chục và 5 đơn vị",
        "explanationVi": "55 gồm 5 chục và 5 đơn vị."
      },
      {
        "id": "m2_t4_q2",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 23",
        "promptVi": "Số nào đứng ngay sau số 79?",
        "promptEn": "Which number comes right after 79?",
        "options": [
          "78",
          "80",
          "81"
        ],
        "answer": "80",
        "explanationVi": "Số đứng ngay sau số 79 là số 80 (79 thêm 1 bằng 80)."
      },
      {
        "id": "m2_t4_q3",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 26",
        "promptVi": "Cây kéo thủ công đặt từ vạch 0 cm đến vạch 11 cm. Kéo dài mấy cm?",
        "promptEn": "Scissors span from 0 cm to 11 cm. How long are they?",
        "options": [
          "10 cm",
          "11 cm",
          "12 cm"
        ],
        "answer": "11 cm",
        "explanationVi": "Dài đúng 11 cm."
      },
      {
        "id": "m2_t4_q4",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 21",
        "promptVi": "Số 71 đọc là gì?",
        "promptEn": "How do you read 71?",
        "options": [
          "Bảy mươi mốt",
          "Bảy mươi một",
          "Mười bảy"
        ],
        "answer": "Bảy mươi mốt",
        "explanationVi": "Chữ số 1 đứng sau hàng chục đọc là 'mốt': Bảy mươi mốt."
      },
      {
        "id": "m2_t4_q5",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 24",
        "promptVi": "Số nào có 5 chục và 3 đơn vị?",
        "promptEn": "Which number has 5 tens and 3 ones?",
        "options": [
          "35",
          "53",
          "50",
          "30"
        ],
        "answer": "53",
        "explanationVi": "5 chục = 50, 3 đơn vị = 3. 50 + 3 = 53."
      },
      {
        "id": "m2_t4_q6",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 23",
        "promptVi": "Số tròn chục đứng ngay sau số 30 là số nào?",
        "promptEn": "Which round-ten number comes right after 30?",
        "options": [
          "20",
          "40",
          "50"
        ],
        "answer": "40",
        "explanationVi": "Số tròn chục đứng ngay sau số 30 là số 40."
      },
      {
        "id": "m2_t4_q7",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 22",
        "promptVi": "Chọn dấu thích hợp: 92 ... 89",
        "promptEn": "Choose the sign: 92 ... 89",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": ">",
        "explanationVi": "9 chục > 8 chục nên 92 > 89."
      },
      {
        "id": "m2_t4_q8",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 27",
        "promptVi": "Tính: 50 cm + 40 cm = ?",
        "promptEn": "Calculate: 50 cm + 40 cm = ?",
        "options": [
          "80 cm",
          "90 cm",
          "100 cm"
        ],
        "answer": "90 cm",
        "explanationVi": "50 cm + 40 cm = 90 cm."
      },
      {
        "id": "m2_t4_q9",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 27",
        "promptVi": "Tính: 70 cm - 30 cm = ?",
        "promptEn": "Calculate: 70 cm - 30 cm = ?",
        "options": [
          "30 cm",
          "40 cm",
          "50 cm"
        ],
        "answer": "40 cm",
        "explanationVi": "70 cm - 30 cm = 40 cm."
      },
      {
        "id": "m2_t4_q10",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 22",
        "promptVi": "Dãy số nào được xếp theo thứ tự từ lớn đến bé?",
        "promptEn": "Which sequence is from greatest to smallest?",
        "options": [
          "86, 74, 52, 31",
          "31, 52, 74, 86",
          "74, 86, 31, 52"
        ],
        "answer": "86, 74, 52, 31",
        "explanationVi": "86 > 74 > 52 > 31."
      },
      {
        "id": "m2_t4_q11",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 24",
        "promptVi": "Số nào gồm 5 chục và 8 đơn vị?",
        "promptEn": "Which number is 5 tens and 8 ones?",
        "options": [
          "58",
          "85",
          "50"
        ],
        "answer": "58",
        "explanationVi": "5 chục và 8 đơn vị là số 58."
      },
      {
        "id": "m2_t4_q12",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 28",
        "promptVi": "So sánh: 20 cm + 10 cm ... 30 cm",
        "promptEn": "Compare: 20 cm + 10 cm ... 30 cm",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": "=",
        "explanationVi": "20 + 10 = 30 cm = 30 cm."
      },
      {
        "id": "m2_t4_q13",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 28",
        "promptVi": "Cuộn len màu vàng dài 60 cm, mẹ đan áo hết 40 cm. Hỏi cuộn len còn lại bao nhiêu cm?",
        "promptEn": "A yellow yarn is 60 cm, mother knits 40 cm. How many cm left?",
        "options": [
          "10 cm",
          "20 cm",
          "30 cm"
        ],
        "answer": "20 cm",
        "explanationVi": "60 cm - 40 cm = 20 cm."
      },
      {
        "id": "m2_t4_q14",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 24",
        "promptVi": "Lớp 1B thu gom được 40 vỏ lon, lớp 1C thu gom được 50 vỏ lon. Hỏi cả hai lớp thu gom được bao nhiêu vỏ lon?",
        "promptEn": "Class 1B collects 40 cans, Class 1C collects 50 cans. How many in total?",
        "options": [
          "80 vỏ lon",
          "90 vỏ lon",
          "100 vỏ lon"
        ],
        "answer": "90 vỏ lon",
        "explanationVi": "40 + 50 = 90 vỏ lon."
      },
      {
        "id": "m2_t4_q15",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 28",
        "promptVi": "Đoạn đường kiến đen bò dài 18 cm, đoạn đường kiến đỏ bò dài 12 cm. Hỏi kiến nào bò đoạn đường dài hơn và dài hơn bao nhiêu xăng-ti-mét?",
        "promptEn": "Black ant crawls 18 cm, red ant crawls 12 cm. Which ant crawls longer and by how many centimeters?",
        "options": [
          "Kiến đỏ bò dài hơn 6 cm",
          "Kiến đen bò dài hơn 6 cm",
          "Kiến đen bò dài hơn 8 cm",
          "Kiến đỏ bò dài hơn 8 cm"
        ],
        "answer": "Kiến đen bò dài hơn 6 cm",
        "explanationVi": "Đoạn đường kiến đen bò là 18 cm, đoạn đường kiến đỏ bò là 12 cm. Vì 18 cm > 12 cm nên kiến đen bò đoạn đường dài hơn. Phép tính: 18 - 12 = 6 cm. Vậy: Kiến đen bò dài hơn 6 cm."
      }
    ]
  },
  {
    "periodId": "final-sem-2",
    "periodTitleVi": "CUỐI HỌC KÌ II",
    "periodTitleEn": "End of Semester 2",
    "testId": "final2_test1",
    "testNumber": 1,
    "titleVi": "Đề Kiểm Tra Số 1 – Cuối Học Kì II",
    "titleEn": "Math Test 1 – End of Year",
    "timeMinutes": 35,
    "questions": [
      {
        "id": "f2_t1_q1",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 34",
        "promptVi": "Khi đồng hồ chỉ 8 giờ đúng, kim phút (kim dài) chỉ vào số nào?",
        "promptEn": "When the clock shows 8 o'clock sharp, which number does the minute hand point to?",
        "visualConfig": {
          "mode": "clock",
          "hour": 8,
          "minute": 0
        },
        "options": [
          "Số 8",
          "Số 12",
          "Số 6"
        ],
        "answer": "Số 12",
        "explanationVi": "Khi chỉ giờ đúng, kim dài luôn chỉ vào số 12."
      },
      {
        "id": "f2_t1_q2",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 35",
        "promptVi": "Một tuần lễ có bao nhiêu ngày?",
        "promptEn": "How many days are there in a week?",
        "options": [
          "5 ngày",
          "6 ngày",
          "7 ngày"
        ],
        "answer": "7 ngày",
        "explanationVi": "Một tuần lễ có đúng 7 ngày (từ Thứ Hai đến Chủ Nhật)."
      },
      {
        "id": "f2_t1_q3",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 29",
        "promptVi": "Tính: 42 + 5 = ?",
        "promptEn": "Calculate: 42 + 5 = ?",
        "options": [
          "46",
          "47",
          "48"
        ],
        "answer": "47",
        "explanationVi": "2 + 5 = 7, viết 47."
      },
      {
        "id": "f2_t1_q4",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 31",
        "promptVi": "Tính: 68 - 4 = ?",
        "promptEn": "Calculate: 68 - 4 = ?",
        "options": [
          "62",
          "64",
          "66"
        ],
        "answer": "64",
        "explanationVi": "8 - 4 = 4, viết 64."
      },
      {
        "id": "f2_t1_q5",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 35",
        "promptVi": "Ngày đầu tiên trong tuần lễ em đi học là ngày thứ mấy?",
        "promptEn": "Which day is the first school day of the week?",
        "options": [
          "Thứ Hai",
          "Thứ Ba",
          "Chủ Nhật"
        ],
        "answer": "Thứ Hai",
        "explanationVi": "Thứ Hai là ngày đầu tuần đi học."
      },
      {
        "id": "f2_t1_q6",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 40",
        "promptVi": "Biển báo giao thông cấm đi ngược chiều có dạng hình gì?",
        "promptEn": "What shape is a 'No Entry' traffic sign?",
        "visualConfig": {
          "mode": "traffic-sign",
          "signType": "prohibition_circle"
        },
        "options": [
          "Hình tròn",
          "Hình vuông",
          "Hình tam giác"
        ],
        "answer": "Hình tròn",
        "explanationVi": "Biển báo cấm đi ngược chiều có dạng hình tròn đỏ viền trắng."
      },
      {
        "id": "f2_t1_q7",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 30",
        "promptVi": "Tính: 35 + 24 = ?",
        "promptEn": "Calculate: 35 + 24 = ?",
        "options": [
          "58",
          "59",
          "60"
        ],
        "answer": "59",
        "explanationVi": "5 + 4 = 9; 3 + 2 = 5 -> 59."
      },
      {
        "id": "f2_t1_q8",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 32",
        "promptVi": "Tính: 78 - 35 = ?",
        "promptEn": "Calculate: 78 - 35 = ?",
        "options": [
          "42",
          "43",
          "44"
        ],
        "answer": "43",
        "explanationVi": "8 - 5 = 3; 7 - 3 = 4 -> 43."
      },
      {
        "id": "f2_t1_q9",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 34",
        "promptVi": "Quan sát đồng hồ: Kim ngắn chỉ số 4, kim dài chỉ số 12. Lúc đó là mấy giờ?",
        "promptEn": "Short hand on 4, long hand on 12. What time is it?",
        "visualConfig": {
          "mode": "clock",
          "hour": 4,
          "minute": 0
        },
        "options": [
          "4 giờ đúng",
          "12 giờ đúng",
          "3 giờ đúng"
        ],
        "answer": "4 giờ đúng",
        "explanationVi": "Đồng hồ chỉ đúng 4 giờ."
      },
      {
        "id": "f2_t1_q10",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 35",
        "promptVi": "Hôm nay là Thứ Tư. Ngày mai là ngày thứ mấy?",
        "promptEn": "Today is Wednesday. What day is tomorrow?",
        "options": [
          "Thứ Năm",
          "Thứ Sáu",
          "Thứ Ba"
        ],
        "answer": "Thứ Năm",
        "explanationVi": "Sau Thứ Tư là Thứ Năm."
      },
      {
        "id": "f2_t1_q11",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 33",
        "promptVi": "Tính nhẩm: 80 - 30 + 10 = ?",
        "promptEn": "Mental math: 80 - 30 + 10 = ?",
        "options": [
          "50",
          "60",
          "70"
        ],
        "answer": "60",
        "explanationVi": "80 - 30 = 50; 50 + 10 = 60."
      },
      {
        "id": "f2_t1_q12",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 39",
        "promptVi": "Chọn dấu thích hợp: 42 + 16 ... 60",
        "promptEn": "Choose the sign: 42 + 16 ... 60",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": "<",
        "explanationVi": "42 + 16 = 58 < 60."
      },
      {
        "id": "f2_t1_q13",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 33",
        "promptVi": "Vườn nhà bác An có 45 cây bưởi và 23 cây cam. Hỏi vườn nhà bác An có tất cả bao nhiêu cây ăn quả?",
        "promptEn": "Uncle An has 45 pomelo trees and 23 orange trees. How many in total?",
        "options": [
          "67 cây",
          "68 cây",
          "69 cây"
        ],
        "answer": "68 cây",
        "explanationVi": "45 + 23 = 68 cây."
      },
      {
        "id": "f2_t1_q14",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 32",
        "promptVi": "Đoàn tàu hỏa có 58 hành khách. Đến ga thứ nhất có 25 hành khách xuống tàu. Hỏi trên tàu còn lại bao nhiêu hành khách?",
        "promptEn": "A train has 58 passengers, 25 get off. How many passengers remain?",
        "options": [
          "32 hành khách",
          "33 hành khách",
          "34 hành khách"
        ],
        "answer": "33 hành khách",
        "explanationVi": "58 - 25 = 33 hành khách."
      },
      {
        "id": "f2_t1_q15",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 36",
        "promptVi": "Buổi chiều em tan học lúc 4 giờ. Sau đó em đi bộ về nhà mất 1 giờ. Hỏi em về đến nhà lúc mấy giờ?",
        "promptEn": "School ends at 4 PM, you walk home for 1 hour. What time do you arrive?",
        "options": [
          "4 giờ",
          "5 giờ",
          "6 giờ"
        ],
        "answer": "5 giờ",
        "explanationVi": "4 giờ + 1 giờ = 5 giờ chiều."
      }
    ]
  },
  {
    "periodId": "final-sem-2",
    "periodTitleVi": "CUỐI HỌC KÌ II",
    "periodTitleEn": "End of Semester 2",
    "testId": "final2_test2",
    "testNumber": 2,
    "titleVi": "Đề Kiểm Tra Số 2 – Cuối Học Kì II",
    "titleEn": "Math Test 2 – End of Year",
    "timeMinutes": 35,
    "questions": [
      {
        "id": "f2_t2_q1",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 34",
        "promptVi": "Đồng hồ có kim ngắn chỉ số 7, kim dài chỉ số 12. Lúc đó là mấy giờ?",
        "promptEn": "Short hand on 7, long hand on 12. What time is it?",
        "visualConfig": {
          "mode": "clock",
          "hour": 7,
          "minute": 0
        },
        "options": [
          "6 giờ",
          "7 giờ",
          "8 giờ"
        ],
        "answer": "7 giờ",
        "explanationVi": "Đồng hồ chỉ đúng 7 giờ."
      },
      {
        "id": "f2_t2_q2",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 35",
        "promptVi": "Hai ngày cuối tuần học sinh thường được nghỉ học là những ngày nào?",
        "promptEn": "Which two weekend days are students usually off from school?",
        "options": [
          "Thứ Bảy và Chủ Nhật",
          "Thứ Sáu và Thứ Bảy",
          "Chủ Nhật và Thứ Hai"
        ],
        "answer": "Thứ Bảy và Chủ Nhật",
        "explanationVi": "Thứ Bảy và Chủ Nhật là hai ngày cuối tuần."
      },
      {
        "id": "f2_t2_q3",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 29",
        "promptVi": "Tính: 51 + 7 = ?",
        "promptEn": "Calculate: 51 + 7 = ?",
        "options": [
          "57",
          "58",
          "59"
        ],
        "answer": "58",
        "explanationVi": "51 + 7 = 58."
      },
      {
        "id": "f2_t2_q4",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 31",
        "promptVi": "Tính: 79 - 6 = ?",
        "promptEn": "Calculate: 79 - 6 = ?",
        "options": [
          "73",
          "74",
          "75"
        ],
        "answer": "73",
        "explanationVi": "79 - 6 = 73."
      },
      {
        "id": "f2_t2_q5",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 38",
        "promptVi": "Số gồm 9 chục và 8 đơn vị là số nào?",
        "promptEn": "Which number is 9 tens and 8 ones?",
        "options": [
          "89",
          "98",
          "90"
        ],
        "answer": "98",
        "explanationVi": "9 chục và 8 đơn vị là 98."
      },
      {
        "id": "f2_t2_q6",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 40",
        "promptVi": "Biển báo tam giác viền đỏ cảnh báo người đi bộ qua đường có dạng hình phẳng nào?",
        "promptEn": "What shape is a triangular pedestrian crossing warning sign?",
        "visualConfig": {
          "mode": "traffic-sign",
          "signType": "warning_triangle"
        },
        "options": [
          "Hình tam giác",
          "Hình tròn",
          "Hình vuông"
        ],
        "answer": "Hình tam giác",
        "explanationVi": "Biển báo nguy hiểm có dạng hình tam giác đều."
      },
      {
        "id": "f2_t2_q7",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 30",
        "promptVi": "Tính: 43 + 35 = ?",
        "promptEn": "Calculate: 43 + 35 = ?",
        "options": [
          "77",
          "78",
          "79"
        ],
        "answer": "78",
        "explanationVi": "43 + 35 = 78."
      },
      {
        "id": "f2_t2_q8",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 32",
        "promptVi": "Tính: 86 - 42 = ?",
        "promptEn": "Calculate: 86 - 42 = ?",
        "options": [
          "43",
          "44",
          "45"
        ],
        "answer": "44",
        "explanationVi": "86 - 42 = 44."
      },
      {
        "id": "f2_t2_q9",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 35",
        "promptVi": "Hôm nay là Thứ Sáu ngày 15. Ngày mai là Thứ Bảy ngày bao nhiêu?",
        "promptEn": "Today is Friday the 15th. What date is tomorrow Saturday?",
        "options": [
          "Ngày 14",
          "Ngày 16",
          "Ngày 17"
        ],
        "answer": "Ngày 16",
        "explanationVi": "Sau ngày 15 là ngày 16."
      },
      {
        "id": "f2_t2_q10",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 33",
        "promptVi": "Tính: 54 + 23 - 10 = ?",
        "promptEn": "Calculate: 54 + 23 - 10 = ?",
        "options": [
          "66",
          "67",
          "68"
        ],
        "answer": "67",
        "explanationVi": "54 + 23 = 77; 77 - 10 = 67."
      },
      {
        "id": "f2_t2_q11",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 34",
        "promptVi": "Em bắt đầu ngủ lúc 9 giờ tối. Lúc đó kim ngắn chỉ số mấy?",
        "promptEn": "You go to sleep at 9 PM. Which number does the hour hand point to?",
        "options": [
          "Số 9",
          "Số 12",
          "Số 10"
        ],
        "answer": "Số 9",
        "explanationVi": "Kim ngắn chỉ giờ, chỉ vào số 9."
      },
      {
        "id": "f2_t2_q12",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 39",
        "promptVi": "So sánh: 65 - 20 ... 40 + 5",
        "promptEn": "Compare: 65 - 20 ... 40 + 5",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": "=",
        "explanationVi": "65 - 20 = 45 và 40 + 5 = 45. Hai vế bằng nhau."
      },
      {
        "id": "f2_t2_q13",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 41",
        "promptVi": "Đàn vịt dưới ao có 56 con, lúc sau có 22 con lên bờ phơi nắng. Hỏi dưới ao còn lại bao nhiêu con vịt?",
        "promptEn": "56 ducks in the pond, 22 get out onto the bank. How many ducks remain in the pond?",
        "options": [
          "32 con",
          "34 con",
          "36 con"
        ],
        "answer": "34 con",
        "explanationVi": "56 - 22 = 34 con vịt."
      },
      {
        "id": "f2_t2_q14",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 41",
        "promptVi": "Mẹ mua 32 bông hoa hồng và 15 bông hoa cúc. Hỏi mẹ đã mua tất cả bao nhiêu bông hoa?",
        "promptEn": "Mother buys 32 roses and 15 daisies. How many flowers in total?",
        "options": [
          "46 bông",
          "47 bông",
          "48 bông"
        ],
        "answer": "47 bông",
        "explanationVi": "32 + 15 = 47 bông hoa."
      },
      {
        "id": "f2_t2_q15",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 40",
        "promptVi": "Một sợi dây thép dài 48 cm, người thợ cắt đi 25 cm để buộc giàn hoa. Đoạn dây thép còn lại dài bao nhiêu cm?",
        "promptEn": "A wire is 48 cm, craftsman cuts 25 cm. How long is the remaining wire?",
        "options": [
          "22 cm",
          "23 cm",
          "24 cm"
        ],
        "answer": "23 cm",
        "explanationVi": "48 cm - 25 cm = 23 cm."
      }
    ]
  },
  {
    "periodId": "final-sem-2",
    "periodTitleVi": "CUỐI HỌC KÌ II",
    "periodTitleEn": "End of Semester 2",
    "testId": "final2_test3",
    "testNumber": 3,
    "titleVi": "Đề Kiểm Tra Số 3 – Cuối Học Kì II",
    "titleEn": "Math Test 3 – End of Year",
    "timeMinutes": 35,
    "questions": [
      {
        "id": "f2_t3_q1",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 34",
        "promptVi": "Khi cả hai kim (kim ngắn và kim dài) cùng chỉ vào số 12 thì lúc đó là mấy giờ?",
        "promptEn": "When both hands point to 12, what time is it?",
        "visualConfig": {
          "mode": "clock",
          "hour": 12,
          "minute": 0
        },
        "options": [
          "12 giờ đúng",
          "6 giờ đúng",
          "1 giờ đúng"
        ],
        "answer": "12 giờ đúng",
        "explanationVi": "Hai kim cùng chỉ số 12 là 12 giờ đúng."
      },
      {
        "id": "f2_t3_q2",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 35",
        "promptVi": "Sau ngày Thứ Bảy là ngày thứ mấy?",
        "promptEn": "Which day comes right after Saturday?",
        "options": [
          "Thứ Sáu",
          "Chủ Nhật",
          "Thứ Hai"
        ],
        "answer": "Chủ Nhật",
        "explanationVi": "Sau Thứ Bảy là Chủ Nhật."
      },
      {
        "id": "f2_t3_q3",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 29",
        "promptVi": "Tính: 63 + 4 = ?",
        "promptEn": "Calculate: 63 + 4 = ?",
        "options": [
          "66",
          "67",
          "68"
        ],
        "answer": "67",
        "explanationVi": "63 + 4 = 67."
      },
      {
        "id": "f2_t3_q4",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 31",
        "promptVi": "Tính: 85 - 3 = ?",
        "promptEn": "Calculate: 85 - 3 = ?",
        "options": [
          "81",
          "82",
          "83"
        ],
        "answer": "82",
        "explanationVi": "85 - 3 = 82."
      },
      {
        "id": "f2_t3_q5",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 38",
        "promptVi": "Số nào đứng ngay sau số 89?",
        "promptEn": "Which number comes right after 89?",
        "options": [
          "88",
          "90",
          "91"
        ],
        "answer": "90",
        "explanationVi": "Số đứng ngay sau số 89 là số 90 (89 thêm 1 bằng 90)."
      },
      {
        "id": "f2_t3_q6",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 40",
        "promptVi": "Thước kẻ của em có đơn vị đo độ dài thông dụng là gì?",
        "promptEn": "What is the common length unit on your student ruler?",
        "options": [
          "Xăng-ti-mét (cm)",
          "Ki-lô-gam (kg)",
          "Lít (l)"
        ],
        "answer": "Xăng-ti-mét (cm)",
        "explanationVi": "Thước đo độ dài dùng đơn vị cm."
      },
      {
        "id": "f2_t3_q7",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 30",
        "promptVi": "Tính: 52 + 36 = ?",
        "promptEn": "Calculate: 52 + 36 = ?",
        "options": [
          "87",
          "88",
          "89"
        ],
        "answer": "88",
        "explanationVi": "52 + 36 = 88."
      },
      {
        "id": "f2_t3_q8",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 32",
        "promptVi": "Tính: 97 - 45 = ?",
        "promptEn": "Calculate: 97 - 45 = ?",
        "options": [
          "51",
          "52",
          "53"
        ],
        "answer": "52",
        "explanationVi": "97 - 45 = 52."
      },
      {
        "id": "f2_t3_q9",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 35",
        "promptVi": "Nếu hôm nay là Chủ Nhật thì ngày mai là ngày thứ mấy?",
        "promptEn": "If today is Sunday, what day is tomorrow?",
        "options": [
          "Thứ Hai",
          "Thứ Bảy",
          "Thứ Ba"
        ],
        "answer": "Thứ Hai",
        "explanationVi": "Hết Chủ Nhật là bắt đầu tuần mới vào Thứ Hai."
      },
      {
        "id": "f2_t3_q10",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 33",
        "promptVi": "Tính nhẩm: 40 + 50 - 30 = ?",
        "promptEn": "Mental math: 40 + 50 - 30 = ?",
        "options": [
          "50",
          "60",
          "70"
        ],
        "answer": "60",
        "explanationVi": "40 + 50 = 90; 90 - 30 = 60."
      },
      {
        "id": "f2_t3_q11",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 34",
        "promptVi": "Buổi trưa gia đình em ăn cơm lúc 11 giờ. Lúc đó kim ngắn và kim dài chỉ số nào?",
        "promptEn": "Family lunch at 11 o'clock. Where do the hands point?",
        "options": [
          "Kim ngắn chỉ số 11, kim dài chỉ số 12",
          "Kim ngắn chỉ số 12, kim dài chỉ số 11",
          "Cả 2 kim chỉ số 11"
        ],
        "answer": "Kim ngắn chỉ số 11, kim dài chỉ số 12",
        "explanationVi": "Kim ngắn chỉ số 11, kim dài chỉ số 12."
      },
      {
        "id": "f2_t3_q12",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 39",
        "promptVi": "Chọn dấu thích hợp: 74 - 21 ... 50",
        "promptEn": "Choose the sign: 74 - 21 ... 50",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": ">",
        "explanationVi": "74 - 21 = 53 > 50."
      },
      {
        "id": "f2_t3_q13",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 41",
        "promptVi": "Thư viện trường có 64 cuốn sách truyện tranh, cô thủ thư cho học sinh mượn 31 cuốn. Hỏi thư viện còn lại bao nhiêu cuốn truyện tranh?",
        "promptEn": "School library has 64 comic books, librarian lends 31. How many remain?",
        "options": [
          "32 cuốn",
          "33 cuốn",
          "34 cuốn"
        ],
        "answer": "33 cuốn",
        "explanationVi": "64 - 31 = 33 cuốn sách."
      },
      {
        "id": "f2_t3_q14",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 41",
        "promptVi": "Khối lớp 1 trồng được 41 bồn hoa, khối lớp 2 trồng được 38 bồn hoa. Hỏi cả hai khối trồng được tất cả bao nhiêu bồn hoa?",
        "promptEn": "Grade 1 planted 41 flowerbeds, Grade 2 planted 38. How many in total?",
        "options": [
          "78 bồn hoa",
          "79 bồn hoa",
          "80 bồn hoa"
        ],
        "answer": "79 bồn hoa",
        "explanationVi": "41 + 38 = 79 bồn hoa."
      },
      {
        "id": "f2_t3_q15",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 36",
        "promptVi": "Trong một tuần lễ, số ngày em đi học ở trường (5 ngày) nhiều hơn số ngày nghỉ học (2 ngày) là mấy ngày?",
        "promptEn": "In a week, school days (5) are how many more than days off (2)?",
        "options": [
          "2 ngày",
          "3 ngày",
          "4 ngày"
        ],
        "answer": "3 ngày",
        "explanationVi": "5 - 2 = 3 ngày."
      }
    ]
  },
  {
    "periodId": "final-sem-2",
    "periodTitleVi": "CUỐI HỌC KÌ II",
    "periodTitleEn": "End of Semester 2",
    "testId": "final2_test4",
    "testNumber": 4,
    "titleVi": "Đề Kiểm Tra Số 4 – Cuối Học Kì II",
    "titleEn": "Math Test 4 – End of Year",
    "timeMinutes": 35,
    "questions": [
      {
        "id": "f2_t4_q1",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 34",
        "promptVi": "Đồng hồ chỉ đúng 3 giờ chiều. Kim dài đang chỉ vào số nào?",
        "promptEn": "Clock shows 3 PM sharp. Which number does the minute hand point to?",
        "visualConfig": {
          "mode": "clock",
          "hour": 3,
          "minute": 0
        },
        "options": [
          "Số 3",
          "Số 12",
          "Số 6"
        ],
        "answer": "Số 12",
        "explanationVi": "Khi đúng giờ, kim dài chỉ số 12."
      },
      {
        "id": "f2_t4_q2",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 35",
        "promptVi": "Một tuần lễ có mấy ngày em được đi học ở trường tiểu học?",
        "promptEn": "How many days a week do elementary students attend school?",
        "options": [
          "4 ngày",
          "5 ngày",
          "6 ngày"
        ],
        "answer": "5 ngày",
        "explanationVi": "Học sinh tiểu học đi học 5 ngày từ Thứ Hai đến Thứ Sáu."
      },
      {
        "id": "f2_t4_q3",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 29",
        "promptVi": "Tính: 72 + 6 = ?",
        "promptEn": "Calculate: 72 + 6 = ?",
        "options": [
          "77",
          "78",
          "79"
        ],
        "answer": "78",
        "explanationVi": "72 + 6 = 78."
      },
      {
        "id": "f2_t4_q4",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 31",
        "promptVi": "Tính: 98 - 7 = ?",
        "promptEn": "Calculate: 98 - 7 = ?",
        "options": [
          "91",
          "92",
          "93"
        ],
        "answer": "91",
        "explanationVi": "98 - 7 = 91."
      },
      {
        "id": "f2_t4_q5",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 38",
        "promptVi": "Số lớn nhất có một chữ số là số nào?",
        "promptEn": "What is the greatest single-digit number?",
        "options": [
          "8",
          "9",
          "10"
        ],
        "answer": "9",
        "explanationVi": "Số 9 là số lớn nhất có 1 chữ số."
      },
      {
        "id": "f2_t4_q6",
        "level": "nhan_biet",
        "sgk": "Tập 2 - Bài 40",
        "promptVi": "Hình vuông và hình chữ nhật giống nhau ở điểm nào?",
        "promptEn": "How are a square and a rectangle similar?",
        "options": [
          "Đều có 4 cạnh và 4 góc vuông",
          "Đều có 3 cạnh",
          "Đều có thể lăn tròn được"
        ],
        "answer": "Đều có 4 cạnh và 4 góc vuông",
        "explanationVi": "Cả hai hình đều có 4 cạnh và 4 góc vuông."
      },
      {
        "id": "f2_t4_q7",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 30",
        "promptVi": "Tính: 64 + 25 = ?",
        "promptEn": "Calculate: 64 + 25 = ?",
        "options": [
          "88",
          "89",
          "90"
        ],
        "answer": "89",
        "explanationVi": "64 + 25 = 89."
      },
      {
        "id": "f2_t4_q8",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 32",
        "promptVi": "Tính: 89 - 53 = ?",
        "promptEn": "Calculate: 89 - 53 = ?",
        "options": [
          "35",
          "36",
          "37"
        ],
        "answer": "36",
        "explanationVi": "89 - 53 = 36."
      },
      {
        "id": "f2_t4_q9",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 35",
        "promptVi": "Hôm nay là Thứ Bảy. Hôm qua là ngày thứ mấy?",
        "promptEn": "Today is Saturday. What day was yesterday?",
        "options": [
          "Thứ Năm",
          "Thứ Sáu",
          "Chủ Nhật"
        ],
        "answer": "Thứ Sáu",
        "explanationVi": "Trước Thứ Bảy là Thứ Sáu."
      },
      {
        "id": "f2_t4_q10",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 33",
        "promptVi": "Tính: 90 - 50 + 40 = ?",
        "promptEn": "Calculate: 90 - 50 + 40 = ?",
        "options": [
          "70",
          "80",
          "90"
        ],
        "answer": "80",
        "explanationVi": "90 - 50 = 40; 40 + 40 = 80."
      },
      {
        "id": "f2_t4_q11",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 34",
        "promptVi": "Đồng hồ chỉ đúng 10 giờ sáng. Sau 1 giờ nữa là mấy giờ?",
        "promptEn": "Clock shows 10 AM. What time is it 1 hour later?",
        "options": [
          "10 giờ",
          "11 giờ",
          "12 giờ"
        ],
        "answer": "11 giờ",
        "explanationVi": "10 giờ thêm 1 giờ là 11 giờ."
      },
      {
        "id": "f2_t4_q12",
        "level": "thong_hieu",
        "sgk": "Tập 2 - Bài 39",
        "promptVi": "Chọn dấu thích hợp: 50 + 50 ... 100",
        "promptEn": "Choose the sign: 50 + 50 ... 100",
        "options": [
          ">",
          "<",
          "="
        ],
        "answer": "=",
        "explanationVi": "50 + 50 = 100 = 100."
      },
      {
        "id": "f2_t4_q13",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 41",
        "promptVi": "Bác nông dân nuôi 78 con thỏ trắng và thỏ xám, trong đó có 34 con thỏ trắng. Hỏi bác có bao nhiêu con thỏ xám?",
        "promptEn": "Farmer has 78 rabbits, including 34 white rabbits. How many gray rabbits?",
        "options": [
          "42 con",
          "44 con",
          "46 con"
        ],
        "answer": "44 con",
        "explanationVi": "78 - 34 = 44 con thỏ xám."
      },
      {
        "id": "f2_t4_q14",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 41",
        "promptVi": "Một cửa hàng buổi sáng bán được 42 hộp bánh, buổi chiều bán được 36 hộp bánh. Hỏi cả ngày cửa hàng bán được bao nhiêu hộp bánh?",
        "promptEn": "Store sold 42 boxes in morning, 36 boxes in afternoon. How many in all?",
        "options": [
          "76 hộp",
          "78 hộp",
          "80 hộp"
        ],
        "answer": "78 hộp",
        "explanationVi": "42 + 36 = 78 hộp bánh."
      },
      {
        "id": "f2_t4_q15",
        "level": "van_dung",
        "sgk": "Tập 2 - Bài 40",
        "promptVi": "Sợi dây thứ nhất dài 32 cm, sợi dây thứ hai dài 45 cm. Nối hai sợi dây lại (không tính nút buộc) thì được đoạn dây dài bao nhiêu cm?",
        "promptEn": "First rope is 32 cm, second is 45 cm. Joined together, how long is it?",
        "options": [
          "76 cm",
          "77 cm",
          "78 cm"
        ],
        "answer": "77 cm",
        "explanationVi": "32 cm + 45 cm = 77 cm."
      }
    ]
  }
];

export function getExamsByPeriod(periodId: string): ExamPackage[] {
  return ALL_16_EXAMS.filter((e) => e.periodId === periodId);
}

export function getExamById(testId: string): ExamPackage | undefined {
  return ALL_16_EXAMS.find((e) => e.testId === testId);
}
