/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Topic, Lesson, Question, GameMetadata, VisualObjectType } from '../types';
import { getLessonQuestionsPackage } from './lessonQuestionsData';

export const TOPICS: Topic[] = [
  {
    id: 1,
    volume: 1,
    name: 'Các số từ 0 đến 10',
    enName: 'Numbers from 0 to 10',
    description: 'Nhận biết, đọc, viết, đếm các số từ 0 đến 10, so sánh nhiều hơn, ít hơn, bằng nhau.',
    enDescription: 'Recognize, read, write, and count numbers from 0 to 10. Learn more, less, equal.',
    icon: '🔢',
    color: 'from-amber-400 to-orange-500',
    bgGradient: 'bg-gradient-to-br from-amber-50 to-orange-100',
    lessonIds: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 2,
    volume: 1,
    name: 'Làm quen với một số hình phẳng',
    enName: 'Flat Shapes Exploration',
    description: 'Nhận biết hình vuông, hình tròn, hình tam giác, hình chữ nhật và thực hành xếp hình.',
    enDescription: 'Discover squares, circles, triangles, rectangles and practice tangram assembly.',
    icon: '🔺',
    color: 'from-emerald-400 to-teal-500',
    bgGradient: 'bg-gradient-to-br from-emerald-50 to-teal-100',
    lessonIds: [7, 8, 9]
  },
  {
    id: 3,
    volume: 1,
    name: 'Phép cộng, phép trừ trong phạm vi 10',
    enName: 'Addition & Subtraction within 10',
    description: 'Khám phá ý nghĩa phép cộng, phép trừ, bảng cộng trừ và giải các bài toán thực tế.',
    enDescription: 'Master addition and subtraction within 10 and solve cheerful real-life problems.',
    icon: '➕',
    color: 'from-sky-400 to-blue-600',
    bgGradient: 'bg-gradient-to-br from-sky-50 to-blue-100',
    lessonIds: [10, 11, 12, 13]
  },
  {
    id: 4,
    volume: 1,
    name: 'Làm quen với một số hình khối',
    enName: 'Solid Shapes & Spatial Orientation',
    description: 'Khối lập phương, khối hộp chữ nhật, vị trí trên dưới, trước sau, phải trái.',
    enDescription: 'Cube, cuboid, and spatial directions: top, bottom, front, behind, left, right.',
    icon: '🧊',
    color: 'from-indigo-400 to-purple-500',
    bgGradient: 'bg-gradient-to-br from-indigo-50 to-purple-100',
    lessonIds: [14, 15, 16]
  },
  {
    id: 5,
    volume: 1,
    name: 'Ôn tập học kì I',
    enName: 'Semester 1 Grand Review',
    description: 'Củng cố toàn bộ kiến thức số, phép tính và hình học học kì 1.',
    enDescription: 'Review all numbers, calculations, and shapes from the first semester.',
    icon: '🏆',
    color: 'from-rose-400 to-pink-500',
    bgGradient: 'bg-gradient-to-br from-rose-50 to-pink-100',
    lessonIds: [17, 18, 19, 20]
  },
  {
    id: 6,
    volume: 2,
    name: 'Các số đến 100',
    enName: 'Numbers up to 100',
    description: 'Số có hai chữ số, số tròn chục, chục và đơn vị, so sánh số và bảng các số từ 1 đến 100.',
    enDescription: 'Two-digit numbers, tens and ones, number comparison and the 100 chart.',
    icon: '💯',
    color: 'from-violet-400 to-purple-600',
    bgGradient: 'bg-gradient-to-br from-violet-50 to-purple-100',
    lessonIds: [21, 22, 23, 24]
  },
  {
    id: 7,
    volume: 2,
    name: 'Độ dài và đo độ dài',
    enName: 'Length & Measurement',
    description: 'Dài hơn, ngắn hơn, gang tay, bước chân, sải tay, đơn vị đo xăng-ti-mét (cm).',
    enDescription: 'Longer, shorter, hand spans, footsteps, and centimeters (cm).',
    icon: '📏',
    color: 'from-cyan-400 to-blue-500',
    bgGradient: 'bg-gradient-to-br from-cyan-50 to-blue-100',
    lessonIds: [25, 26, 27, 28]
  },
  {
    id: 8,
    volume: 2,
    name: 'Phép cộng, phép trừ (không nhớ) trong phạm vi 100',
    enName: 'Addition & Subtraction within 100 (No Carrying)',
    description: 'Cộng trừ số có hai chữ số với số có một chữ số và hai chữ số (không nhớ).',
    enDescription: 'Addition and subtraction without carrying or borrowing up to 100.',
    icon: '🧮',
    color: 'from-amber-400 to-yellow-500',
    bgGradient: 'bg-gradient-to-br from-amber-50 to-yellow-100',
    lessonIds: [29, 30, 31, 32, 33]
  },
  {
    id: 9,
    volume: 2,
    name: 'Thời gian. Giờ và lịch',
    enName: 'Time, Clocks & Calendar',
    description: 'Xem giờ đúng trên đồng hồ, các ngày trong tuần (Thứ Hai đến Chủ Nhật).',
    enDescription: 'Telling exact hours on clocks, days of the week from Monday to Sunday.',
    icon: '⏰',
    color: 'from-emerald-400 to-green-600',
    bgGradient: 'bg-gradient-to-br from-emerald-50 to-green-100',
    lessonIds: [34, 35, 36, 37]
  },
  {
    id: 10,
    volume: 2,
    name: 'Ôn tập cuối năm',
    enName: 'Year-End Championship Review',
    description: 'Tổng kết và củng cố toàn diện chương trình Toán lớp 1 Kết nối tri thức.',
    enDescription: 'Comprehensive review and test preparation across Grade 1 math curriculum.',
    icon: '🌟',
    color: 'from-red-400 to-amber-500',
    bgGradient: 'bg-gradient-to-br from-red-50 to-amber-100',
    lessonIds: [38, 39, 40, 41]
  }
];

// All 41 lessons mapping exactly to SGK Kết nối tri thức với cuộc sống
export const LESSONS: Lesson[] = [
  // --- TẬP 1 (Chủ đề 1) ---
  {
    id: 1,
    volume: 1,
    topicId: 1,
    topicName: 'Các số từ 0 đến 10',
    title: 'Bài 1. Các số 0, 1, 2, 3, 4, 5',
    enTitle: 'Lesson 1. Numbers 0, 1, 2, 3, 4, 5',
    summary: 'Nhận biết, đọc, viết và đếm số lượng các nhóm đồ vật từ 0 đến 5.',
    enSummary: 'Recognize, read, write, and count objects from 0 to 5.',
    vocab: [
      { vi: 'Số không', en: 'Zero', ipa: '/ˈzɪroʊ/', pronounce: 'zi-râu', exampleVi: 'Bể không có cá: 0 con cá', exampleEn: 'Zero fish in the bowl', icon: '0️⃣' },
      { vi: 'Số một', en: 'One', ipa: '/wʌn/', pronounce: 'oăn', exampleVi: '1 chú mèo con', exampleEn: 'One little kitten', icon: '1️⃣' },
      { vi: 'Số hai', en: 'Two', ipa: '/tuː/', pronounce: 'tu', exampleVi: '2 quả cà rốt', exampleEn: 'Two carrots', icon: '2️⃣' },
      { vi: 'Số ba', en: 'Three', ipa: '/θriː/', trickyNote: 'Đưa đầu lưỡi ra giữa hai răng thổi hơi nhẹ /θ/, không đọc nhầm thành "Tree" (cây)!', pronounce: 'th-ri', exampleVi: '3 chú cún con', exampleEn: 'Three puppies', icon: '3️⃣' },
      { vi: 'Số bốn', en: 'Four', ipa: '/fɔːr/', pronounce: 'fo', exampleVi: '4 quả bóng bay', exampleEn: 'Four balloons', icon: '4️⃣' },
      { vi: 'Số năm', en: 'Five', ipa: '/faɪv/', trickyNote: 'Phát âm rõ âm đuôi /v/ bằng cách chạm răng trên vào môi dưới nhé bé!', pronounce: 'phai-v', exampleVi: '5 ngón tay xinh', exampleEn: 'Five fingers', icon: '5️⃣' },
    ],
    exploreConcept: {
      headingVi: 'Cùng Robot đếm đồ vật từ 0 đến 5',
      headingEn: 'Count objects from 0 to 5 with Robot',
      descriptionVi: 'Chạm vào các chú cá hoặc khối lập phương để đếm cùng Robot nhé!',
      descriptionEn: 'Tap fish or cubes to count along with Robot!',
      interactiveType: 'counter',
      defaultData: { max: 5, current: 3, itemType: 'fish' }
    },
    robotGuide: {
      tipVi: 'Bé nhớ nhé: 0 nghĩa là không có gì cả. Số lượng tăng dần từ 0, 1, 2, 3, 4 đến 5!',
      tipEn: 'Remember: 0 means none at all. Count up step by step: 0, 1, 2, 3, 4, 5!',
      keyPoints: ['0: Không có đồ vật nào', '1, 2, 3, 4, 5: Mỗi số thêm 1 đơn vị', 'Thứ tự từ bé đến lớn: 0, 1, 2, 3, 4, 5']
    },
    sampleQuestions: [
      {
        id: '1-1',
        type: 'count',
        promptVi: 'Có mấy chú mèo con trong hình?',
        promptEn: 'How many kittens are there in the picture?',
        visualType: 'cats' as any,
        visualCount: 3,
        visualConfig: { mode: 'count', count: 3, itemType: 'cat' },
        options: [2, 3, 4, 5],
        answer: 3,
        hintVi: 'Bé hãy đếm từng chú mèo từ trái sang phải nhé: 1, 2, 3!',
        hintEn: 'Count each kitten from left to right: 1, 2, 3!',
        explanationVi: 'Có đúng 3 chú mèo con!',
        explanationEn: 'There are exactly 3 kittens!'
      },
      {
        id: '1-2',
        type: 'fill',
        promptVi: 'Điền số thích hợp vào chỗ trống: 0, 1, 2, ..., 4, 5',
        promptEn: 'Fill in the missing number: 0, 1, 2, ..., 4, 5',
        options: [1, 2, 3, 4],
        answer: 3,
        hintVi: 'Số đứng liền sau số 2 và liền trước số 4 là số nào nhỉ?',
        hintEn: 'What number comes right after 2 and before 4?',
        explanationVi: 'Số 3 nằm giữa số 2 và số 4.',
        explanationEn: 'Number 3 is between 2 and 4.'
      }
    ],
    recommendedGameId: 'number-train'
  },
  {
    id: 2,
    volume: 1,
    topicId: 1,
    topicName: 'Các số từ 0 đến 10',
    title: 'Bài 2. Các số 6, 7, 8, 9, 10',
    enTitle: 'Lesson 2. Numbers 6, 7, 8, 9, 10',
    summary: 'Đếm, đọc, viết các số 6, 7, 8, 9, 10 và nhận biết thứ tự dãy số.',
    enSummary: 'Count, read, write numbers 6, 7, 8, 9, 10 and master the number sequence.',
    vocab: [
      { vi: 'Số sáu', en: 'Six', ipa: '/sɪks/', trickyNote: 'Bật rõ âm đuôi /ks/ dứt khoát nhé!', pronounce: 'xích-x', exampleVi: '6 chú ong mật', exampleEn: 'Six bees', icon: '6️⃣' },
      { vi: 'Số bảy', en: 'Seven', ipa: '/ˈsɛvn/', pronounce: 'xe-vừn', exampleVi: '7 chú chim nhỏ', exampleEn: 'Seven little birds', icon: '7️⃣' },
      { vi: 'Số tám', en: 'Eight', ipa: '/eɪt/', trickyNote: 'Bật nhẹ âm cuối /t/ rõ ràng!', pronounce: 'ây-t', exampleVi: '8 bông hoa rực rỡ', exampleEn: 'Eight flowers', icon: '8️⃣' },
      { vi: 'Số chín', en: 'Nine', ipa: '/naɪn/', pronounce: 'nai-n', exampleVi: '9 ngôi sao lấp lánh', exampleEn: 'Nine stars', icon: '9️⃣' },
      { vi: 'Số mười', en: 'Ten', ipa: '/tɛn/', pronounce: 'ten', exampleVi: '10 chú bọ rùa', exampleEn: 'Ten ladybugs', icon: '🔟' },
    ],
    exploreConcept: {
      headingVi: 'Đếm số lượng từ 6 đến 10',
      headingEn: 'Counting from 6 to 10',
      descriptionVi: 'Chạm vào cành cây để nhìn các chú chim bay đến và đếm nhé!',
      descriptionEn: 'Tap branches to see birds arrive and count them!',
      interactiveType: 'counter',
      defaultData: { max: 10, current: 7, itemType: 'birds' }
    },
    robotGuide: {
      tipVi: 'Số 10 là số đầu tiên được ghép từ hai chữ số: chữ số 1 và chữ số 0!',
      tipEn: '10 is written with two digits: 1 and 0!',
      keyPoints: ['Dãy số: 6, 7, 8, 9, 10', '10 gồm 1 chục', 'Mỗi bước đếm tăng thêm 1']
    },
    sampleQuestions: [
      {
        id: '2-1',
        type: 'count',
        promptVi: 'Đếm xem có bao nhiêu bông hoa hướng dương trong hình?',
        promptEn: 'Count how many sunflowers there are:',
        visualType: 'apples',
        visualCount: 8,
        visualConfig: { mode: 'count', count: 8, itemType: 'flower' },
        options: [6, 7, 8, 9],
        answer: 8,
        hintVi: 'Hãy chỉ tay đếm lần lượt nhé: 1, 2, 3, 4, 5, 6, 7, 8.',
        hintEn: 'Count carefully: 1, 2, 3, 4, 5, 6, 7, 8.',
        explanationVi: 'Có tất cả 8 bông hoa hướng dương.',
        explanationEn: 'There are 8 sunflowers.'
      }
    ],
    recommendedGameId: 'penguin-fishing'
  },
  {
    id: 3,
    volume: 1,
    topicId: 1,
    topicName: 'Các số từ 0 đến 10',
    title: 'Bài 3. Nhiều hơn, ít hơn, bằng nhau',
    enTitle: 'Lesson 3. More, Less, Equal',
    summary: 'So sánh số lượng hai nhóm đối tượng bằng cách ghép đôi tương ứng 1 - 1.',
    enSummary: 'Compare quantities using one-to-one correspondence.',
    vocab: [
      { vi: 'Nhiều hơn', en: 'More than', pronounce: 'mo đan', exampleVi: 'Số ếch nhiều hơn số lá', exampleEn: 'More frogs than leaves', icon: '🟢' },
      { vi: 'Ít hơn', en: 'Less than', pronounce: 'le-x đan', exampleVi: 'Số lá ít hơn số ếch', exampleEn: 'Fewer leaves than frogs', icon: '🟡' },
      { vi: 'Bằng nhau', en: 'Equal to', pronounce: 'y-cùa tu', exampleVi: 'Số thỏ bằng số cà rốt', exampleEn: 'Rabbits equal to carrots', icon: '⚖️' },
    ],
    exploreConcept: {
      headingVi: 'Ghép đôi thỏ và cà rốt',
      headingEn: 'Pairing bunnies and carrots',
      descriptionVi: 'Mỗi chú thỏ ăn 1 củ cà rốt. Thỏ hay cà rốt nhiều hơn?',
      descriptionEn: 'Each rabbit gets one carrot. Are there more rabbits or carrots?',
      interactiveType: 'comparator',
      defaultData: { leftCount: 4, rightCount: 3, leftIcon: '🐰', rightIcon: '🥕' }
    },
    robotGuide: {
      tipVi: 'Bé hãy nối 1 bạn thỏ với 1 củ cà rốt, nhóm nào còn thừa thì nhóm đó nhiều hơn!',
      tipEn: 'Pair one-to-one! The group with leftover items has more!',
      keyPoints: ['Ghép đôi 1 - 1 để so sánh', 'Nhóm thừa ra là nhóm nhiều hơn', 'Không thừa bên nào là bằng nhau']
    },
    sampleQuestions: [
      {
        id: '3-1',
        type: 'choice',
        promptVi: 'Nhóm A có 4 quả bóng, nhóm B có 3 quả bóng. Nhóm nào nhiều hơn?',
        promptEn: 'Group A has 4 balls, Group B has 3 balls. Which group has more?',
        visualConfig: {
          mode: 'compare',
          compareA: { count: 4, nameVi: 'Nhóm A', itemType: 'ball' },
          compareB: { count: 3, nameVi: 'Nhóm B', itemType: 'ball' },
        },
        options: ['Nhóm A nhiều hơn', 'Nhóm B nhiều hơn', 'Bằng nhau'],
        answer: 'Nhóm A nhiều hơn',
        hintVi: '4 lớn hơn 3 nên nhóm A nhiều hơn.',
        hintEn: '4 is greater than 3, so Group A has more.',
        explanationVi: 'Nhóm A nhiều hơn nhóm B vì 4 > 3.',
        explanationEn: 'Group A has more than Group B because 4 > 3.'
      }
    ],
    recommendedGameId: 'rabbit-river'
  },
  {
    id: 4,
    volume: 1,
    topicId: 1,
    topicName: 'Các số từ 0 đến 10',
    title: 'Bài 4. So sánh số',
    enTitle: 'Lesson 4. Comparing Numbers',
    summary: 'Sử dụng các dấu lớn hơn (>), bé hơn (<) và bằng (=) để so sánh các số.',
    enSummary: 'Use greater than (>), less than (<), and equal (=) signs.',
    vocab: [
      { vi: 'Lớn hơn (>)', en: 'Greater than', pronounce: 'grây-tơ đan', exampleVi: '5 > 3: Năm lớn hơn ba', exampleEn: '5 > 3: Five is greater than three', icon: '👉' },
      { vi: 'Bé hơn (<)', en: 'Less than', pronounce: 'le-x đan', exampleVi: '2 < 4: Hai bé hơn bốn', exampleEn: '2 < 4: Two is less than four', icon: '👈' },
      { vi: 'Bằng (=)', en: 'Equals', pronounce: 'y-cùa-z', exampleVi: '4 = 4: Bốn bằng bốn', exampleEn: '4 = 4: Four equals four', icon: '🟰' },
    ],
    exploreConcept: {
      headingVi: 'Miệng cá sấu thích ăn số lớn hơn!',
      headingEn: 'The alligator mouth opens to the bigger number!',
      descriptionVi: 'Mũi nhọn luôn quay về số bé hơn, miệng mở rộng quay về số lớn hơn.',
      descriptionEn: 'The pointed tip points to the smaller number!',
      interactiveType: 'comparator',
      defaultData: { leftCount: 5, rightCount: 2, leftIcon: '🟢', rightIcon: '🔵' }
    },
    robotGuide: {
      tipVi: 'Mẹo nhỏ của Robot: Dấu > và < giống mỏ chim, luôn há to về phía số lớn hơn!',
      tipEn: 'Robot tip: The sign always opens its mouth towards the bigger number!',
      keyPoints: ['> đọc là lớn hơn', '< đọc là bé hơn', '= đọc là bằng']
    },
    sampleQuestions: [
      {
        id: '4-1',
        type: 'compare',
        promptVi: 'Chọn dấu thích hợp: 7 ... 5',
        promptEn: 'Choose the correct sign: 7 ... 5',
        options: ['>', '<', '='],
        answer: '>',
        hintVi: '7 que tính nhiều hơn 5 que tính.',
        hintEn: '7 is larger than 5.',
        explanationVi: '7 > 5 (Bảy lớn hơn năm).',
        explanationEn: '7 > 5 (Seven is greater than five).'
      }
    ],
    recommendedGameId: 'math-racing'
  },
  {
    id: 5,
    volume: 1,
    topicId: 1,
    topicName: 'Các số từ 0 đến 10',
    title: 'Bài 5. Mấy và mấy',
    enTitle: 'Lesson 5. Number Bonds',
    summary: 'Tách và gộp số trong phạm vi 10 (ví dụ: 5 gồm 2 và 3, 2 và 3 được 5).',
    enSummary: 'Decompose and combine numbers within 10 (number bonds).',
    vocab: [
      { vi: 'Gộp lại', en: 'Combine / Put together', pronounce: 'com-bai-n', exampleVi: '3 và 2 được 5', exampleEn: '3 and 2 make 5', icon: '🤝' },
      { vi: 'Tách ra', en: 'Split / Separate', pronounce: 'x-p-lít', exampleVi: '5 gồm 4 và 1', exampleEn: '5 is made of 4 and 1', icon: '✂️' },
    ],
    exploreConcept: {
      headingVi: 'Tách và gộp cá vào 2 bể',
      headingEn: 'Split and combine fish into 2 bowls',
      descriptionVi: 'Có 5 chú cá, chia vào bể tròn và bể vuông xem được mấy và mấy nhé!',
      descriptionEn: 'Split 5 fish into two bowls to see different number bonds!',
      interactiveType: 'counter',
      defaultData: { total: 5, left: 3, right: 2 }
    },
    robotGuide: {
      tipVi: 'Gộp là đem gom chung lại với nhau. Tách là chia một nhóm thành hai nhóm nhỏ hơn!',
      tipEn: 'Combine means put together. Split means divide into smaller groups!',
      keyPoints: ['4 gồm 1 và 3 (hoặc 2 và 2)', 'Gộp 1 và 3 được 4', 'Đây là nền tảng cho phép cộng và trừ!']
    },
    sampleQuestions: [
      {
        id: '5-1',
        type: 'fill',
        promptVi: '6 gồm 4 và mấy?',
        promptEn: '6 is made of 4 and ...?',
        options: [1, 2, 3, 4],
        answer: 2,
        hintVi: 'Bé lấy 6 ngón tay, cụp 4 ngón lại xem còn mấy ngón xòe?',
        hintEn: 'Hold up 6 fingers, tuck away 4. How many are left?',
        explanationVi: '6 gồm 4 và 2.',
        explanationEn: '6 is made of 4 and 2.'
      }
    ],
    recommendedGameId: 'number-train'
  },
  {
    id: 6,
    volume: 1,
    topicId: 1,
    topicName: 'Các số từ 0 đến 10',
    title: 'Bài 6. Luyện tập chung',
    enTitle: 'Lesson 6. Review & Practice',
    summary: 'Ôn tập tổng hợp nhận biết số, thứ tự số, so sánh và tách gộp từ 0 đến 10.',
    enSummary: 'Comprehensive review of numbers 0 to 10.',
    vocab: [
      { vi: 'Thứ tự', en: 'Order', pronounce: 'o-đơ', exampleVi: 'Thứ tự từ bé đến lớn', exampleEn: 'Ascending order', icon: '📶' },
      { vi: 'Luyện tập', en: 'Practice', pronounce: 'p-rắc-tít-x', exampleVi: 'Cùng luyện tập vui vẻ', exampleEn: 'Let us practice happily', icon: '📝' },
    ],
    exploreConcept: {
      headingVi: 'Thử thách toa tàu từ 0 đến 10',
      headingEn: 'Number train challenge from 0 to 10',
      descriptionVi: 'Kéo các toa số còn thiếu vào đúng vị trí trên đường ray!',
      descriptionEn: 'Connect carriages in the correct order!',
      interactiveType: 'counter',
      defaultData: { sequence: [0, 2, 4, 6, 8, 10] }
    },
    robotGuide: {
      tipVi: 'Bé đã học xong Chủ đề 1 rồi! Hãy làm bài tập để nhận cúp vàng của Robot nhé!',
      tipEn: 'You completed Topic 1! Practice now to earn your golden trophy!',
      keyPoints: ['Đếm xuôi: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10', 'Đếm ngược: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0']
    },
    sampleQuestions: [
      {
        id: '6-1',
        type: 'choice',
        promptVi: 'Số nào lớn nhất trong các số: 3, 8, 5, 2?',
        promptEn: 'Which is the largest number among: 3, 8, 5, 2?',
        options: [3, 8, 5, 2],
        answer: 8,
        hintVi: 'Số 8 đứng sau cùng trong các số trên khi đếm.',
        hintEn: '8 is the highest number here.',
        explanationVi: 'Số 8 là số lớn nhất.',
        explanationEn: '8 is the greatest number.'
      }
    ],
    recommendedGameId: 'treasure-cipher'
  },

  // --- TẬP 1 (Chủ đề 2) ---
  {
    id: 7,
    volume: 1,
    topicId: 2,
    topicName: 'Làm quen với một số hình phẳng',
    title: 'Bài 7. Hình vuông, hình tròn, hình tam giác, hình chữ nhật',
    enTitle: 'Lesson 7. Square, Circle, Triangle, Rectangle',
    summary: 'Nhận biết, gọi tên và phân biệt 4 hình phẳng cơ bản qua đồ vật đời sống.',
    enSummary: 'Identify square, circle, triangle, rectangle in everyday objects.',
    vocab: [
      { vi: 'Hình tròn', en: 'Circle', ipa: '/ˈsɜːrkl/', trickyNote: 'Trọng âm rơi vào âm tiết đầu CIR-cle!', pronounce: 'xơ-cồ', exampleVi: 'Mặt đồng hồ, cái đĩa', exampleEn: 'Clock face, dinner plate', icon: '⚪' },
      { vi: 'Hình vuông', en: 'Square', ipa: '/skwɛər/', trickyNote: 'Bật nhẹ cụm phụ âm /skw/ ở đầu từ!', pronounce: 'x-khoe', exampleVi: 'Khung ảnh, viên gạch lát', exampleEn: 'Photo frame, floor tile', icon: '🟧' },
      { vi: 'Hình tam giác', en: 'Triangle', ipa: '/ˈtraɪæŋɡl/', trickyNote: 'Âm đầu /traɪ/ phát âm dứt khoát!', pronounce: 't-rai-ang-gồ', exampleVi: 'Biển báo giao thông, mái nhà', exampleEn: 'Traffic sign, roof', icon: '🔺' },
      { vi: 'Hình chữ nhật', en: 'Rectangle', ipa: '/ˈrɛktæŋɡl/', trickyNote: 'Trọng âm rơi vào REC-tangle!', pronounce: 'rếch-tang-gồ', exampleVi: 'Bảng lớp, cánh cửa', exampleEn: 'Blackboard, door', icon: '🟩' },
    ],
    exploreConcept: {
      headingVi: 'Khám phá thế giới hình học xung quanh em',
      headingEn: 'Discover geometry all around us',
      descriptionVi: 'Chạm vào đồng hồ (hình tròn), biển báo (tam giác), khung tranh (chữ nhật) nhé!',
      descriptionEn: 'Tap circular clocks, triangular signs, and rectangular frames!',
      interactiveType: 'shape-shelf',
      defaultData: { currentShape: 'circle' }
    },
    robotGuide: {
      tipVi: 'Hình tròn cong tròn trĩnh lăn được. Hình tam giác có 3 đỉnh nhọn. Hình vuông có 4 cạnh bằng nhau!',
      tipEn: 'Circles are round and roll. Triangles have 3 corners. Squares have 4 equal sides!',
      keyPoints: ['Hình tròn không có góc nhọn', 'Hình tam giác có 3 cạnh, 3 đỉnh', 'Hình vuông có 4 cạnh bằng nhau', 'Hình chữ nhật có 2 cạnh dài và 2 cạnh ngắn']
    },
    sampleQuestions: [
      {
        id: '7-1',
        type: 'shape',
        promptVi: 'Hình nào dưới đây là hình vuông?',
        promptEn: 'Which shape is a square?',
        options: ['circle', 'triangle', 'square', 'rectangle'],
        answer: 'square',
        hintVi: 'Hình vuông có đúng 4 cạnh bằng nhau và 4 góc vuông.',
        hintEn: 'A square has 4 equal sides and 4 right angles.',
        explanationVi: 'Chính xác! Đó là hình vuông (4 cạnh bằng nhau, 4 góc vuông).',
        explanationEn: 'Correct! That is a square (4 equal sides, 4 right angles).'
      },
      {
        id: '7-2',
        type: 'shape',
        promptVi: 'Hình nào dưới đây là hình tròn?',
        promptEn: 'Which shape is a circle?',
        options: ['square', 'circle', 'rectangle', 'triangle'],
        answer: 'circle',
        hintVi: 'Hình tròn là đường cong tròn khép kín, không có góc nhọn hay cạnh thẳng.',
        hintEn: 'A circle is a round curve with no corners or straight edges.',
        explanationVi: 'Chính xác! Đó là hình tròn đều.',
        explanationEn: 'Correct! That is a circle.'
      },
      {
        id: '7-3',
        type: 'shape',
        promptVi: 'Hình nào dưới đây là hình tam giác?',
        promptEn: 'Which shape is a triangle?',
        options: ['rectangle', 'square', 'triangle', 'circle'],
        answer: 'triangle',
        hintVi: 'Hình tam giác có đúng 3 cạnh thẳng và 3 đỉnh.',
        hintEn: 'A triangle has exactly 3 straight edges and 3 corners.',
        explanationVi: 'Chính xác! Đó là hình tam giác có 3 cạnh.',
        explanationEn: 'Correct! That is a triangle with 3 sides.'
      },
      {
        id: '7-4',
        type: 'shape',
        promptVi: 'Hình nào dưới đây là hình chữ nhật?',
        promptEn: 'Which shape is a rectangle?',
        options: ['triangle', 'rectangle', 'square', 'circle'],
        answer: 'rectangle',
        hintVi: 'Hình chữ nhật có 2 cạnh dài bằng nhau, 2 cạnh ngắn bằng nhau và 4 góc vuông.',
        hintEn: 'A rectangle has 2 equal long sides, 2 equal short sides and 4 right angles.',
        explanationVi: 'Chính xác! Đó là hình chữ nhật.',
        explanationEn: 'Correct! That is a rectangle.'
      }
    ],
    recommendedGameId: 'geometry-explorer'
  },
  {
    id: 8,
    volume: 1,
    topicId: 2,
    topicName: 'Làm quen với một số hình phẳng',
    title: 'Bài 8. Thực hành lắp ghép, xếp hình',
    enTitle: 'Lesson 8. Shape Building & Tangram Practice',
    summary: 'Ghép các miếng bìa hình tam giác, hình vuông thành hình chữ nhật, mũi tên, ngôi nhà.',
    enSummary: 'Assemble geometric pieces to create houses, boats, and arrows.',
    vocab: [
      { vi: 'Lắp ghép', en: 'Assemble / Build', pronounce: 'ơ-xem-bồ', exampleVi: 'Ghép 2 hình tam giác thành hình vuông', exampleEn: 'Assemble 2 triangles into a square', icon: '🧩' },
      { vi: 'Xếp hình', en: 'Puzzle', pronounce: 'pơ-zồ', exampleVi: 'Xếp thuyền buồm xinh xắn', exampleEn: 'Make a pretty sailboat', icon: '⛵' },
    ],
    exploreConcept: {
      headingVi: 'Ghép 2 hình tam giác thành hình vuông',
      headingEn: 'Combine two triangles into a square',
      descriptionVi: 'Kéo các mảnh tam giác ghép lại để tạo thành các hình mới lạ!',
      descriptionEn: 'Combine colored shapes together to form new objects!',
      interactiveType: 'shape-shelf',
      defaultData: { target: 'house' }
    },
    robotGuide: {
      tipVi: 'Hai hình tam giác bằng nhau có thể ghép thành một hình vuông hoặc hình chữ nhật đấy!',
      tipEn: 'Two identical triangles can fit together to make a square or rectangle!',
      keyPoints: ['Xoay hình để tìm vị trí khớp', 'Ghép mái nhà tam giác lên thân nhà vuông']
    },
    sampleQuestions: [
      {
        id: '8-1',
        type: 'choice',
        promptVi: 'Cần mấy hình tam giác bằng nhau để ghép thành một hình vuông?',
        promptEn: 'How many identical triangles are needed to make a square?',
        options: [1, 2, 3, 4],
        answer: 2,
        hintVi: 'Hãy tưởng tượng cắt chéo hình vuông làm đôi!',
        hintEn: 'Imagine cutting a square diagonally in half.',
        explanationVi: 'Cần 2 hình tam giác bằng nhau để ghép thành một hình vuông.',
        explanationEn: '2 identical triangles make a square.'
      }
    ],
    recommendedGameId: 'magic-shape-workshop'
  },
  {
    id: 9,
    volume: 1,
    topicId: 2,
    topicName: 'Làm quen với một số hình phẳng',
    title: 'Bài 9. Luyện tập chung',
    enTitle: 'Lesson 9. Shapes Review & Practice',
    summary: 'Đếm số lượng hình vuông, tròn, tam giác, chữ nhật trong bức tranh ngôi nhà và xe cộ.',
    enSummary: 'Count shapes in complex artwork like houses, trucks, and rockets.',
    vocab: [
      { vi: 'Đồ vật', en: 'Object', pronounce: 'óp-giếch-t', exampleVi: 'Đồ vật quanh em', exampleEn: 'Objects around you', icon: '📦' },
      { vi: 'Màu sắc', en: 'Color', pronounce: 'ca-lơ', exampleVi: 'Hình tròn màu đỏ', exampleEn: 'Red circle', icon: '🎨' },
    ],
    exploreConcept: {
      headingVi: 'Đếm hình trong bức tranh đoàn tàu',
      headingEn: 'Count shapes in the train picture',
      descriptionVi: 'Đoàn tàu có bánh tròn, toa chữ nhật, ống khói tam giác!',
      descriptionEn: 'The train has round wheels, rectangular cars, and a triangular chimney!',
      interactiveType: 'shape-shelf',
      defaultData: { countMode: true }
    },
    robotGuide: {
      tipVi: 'Khi đếm hình, bé hãy đánh dấu từng hình để không bị đếm sót hoặc trùng lặp nhé!',
      tipEn: 'Count systematically so you do not miss any hidden shapes!',
      keyPoints: ['Nhìn kĩ từng bộ phận của xe hoặc nhà', 'Phân biệt rõ hình vuông (4 cạnh bằng nhau) và hình chữ nhật']
    },
    sampleQuestions: [
      {
        id: '9-1',
        type: 'choice',
        promptVi: 'Biển báo giao thông dưới đây có dạng hình gì?',
        promptEn: 'What shape is the traffic sign shown below?',
        visualConfig: {
          mode: 'traffic-sign',
          signType: 'warning_triangle',
          shapeType: 'triangle'
        },
        options: ['Hình tam giác', 'Hình tròn', 'Hình vuông', 'Hình chữ nhật'],
        answer: 'Hình tam giác',
        hintVi: 'Biển báo nguy hiểm này có 3 cạnh thẳng và 3 đỉnh nhọn.',
        hintEn: 'This warning sign has 3 straight edges and 3 corners.',
        explanationVi: 'Chính xác! Biển báo giao thông cảnh báo nguy hiểm này có dạng hình tam giác.',
        explanationEn: 'Correct! This traffic sign has the shape of a triangle.'
      }
    ],
    recommendedGameId: 'geometry-explorer'
  },

  // --- TẬP 1 (Chủ đề 3) ---
  {
    id: 10,
    volume: 1,
    topicId: 3,
    topicName: 'Phép cộng, phép trừ trong phạm vi 10',
    title: 'Bài 10. Phép cộng trong phạm vi 10',
    enTitle: 'Lesson 10. Addition within 10',
    summary: 'Làm quen dấu cộng (+), dấu bằng (=), ý nghĩa gộp lại và cộng thêm.',
    enSummary: 'Learn the plus sign (+), equals sign (=), and addition as combining groups.',
    vocab: [
      { vi: 'Dấu cộng (+)', en: 'Plus', pronounce: 'p-lớt-x', exampleVi: '3 + 2 = 5: Ba cộng hai bằng năm', exampleEn: '3 + 2 = 5: Three plus two equals five', icon: '➕' },
      { vi: 'Thêm vào', en: 'Add more', pronounce: 'át mo', exampleVi: 'Thêm 2 quả bóng', exampleEn: 'Add 2 more balloons', icon: '🎈' },
      { vi: 'Tất cả', en: 'In all / Total', pronounce: 'tâu-tồ', exampleVi: 'Có tất cả mấy quả táo?', exampleEn: 'How many apples in all?', icon: '🍎' },
    ],
    exploreConcept: {
      headingVi: 'Gộp lại thì bằng mấy?',
      headingEn: 'How many when put together?',
      descriptionVi: 'Bạn trai có 3 quả bóng, bạn gái có 2 quả bóng. Gộp lại có 3 + 2 = 5 quả bóng!',
      descriptionEn: '3 red balloons plus 2 blue balloons equal 5 balloons!',
      interactiveType: 'addition-bar',
      defaultData: { a: 3, b: 2, op: '+' }
    },
    robotGuide: {
      tipVi: 'Phép cộng là phép tính gộp các nhóm lại hoặc thêm vào. Số 0 cộng với số nào cũng bằng chính số đó: 5 + 0 = 5!',
      tipEn: 'Addition means putting together. Adding zero keeps the number unchanged: 5 + 0 = 5!',
      keyPoints: ['Dấu + đọc là "cộng"', 'Đếm thêm: 5 thêm 2 là 6, 7', 'a + 0 = a và 0 + a = a']
    },
    sampleQuestions: [
      {
        id: '10-1',
        type: 'fill',
        promptVi: 'Có 4 quả táo đỏ và 3 quả cam vàng. Có tất cả bao nhiêu quả? (4 + 3 = ?)',
        promptEn: 'There are 4 red apples and 3 oranges. How many fruits are there altogether?',
        visualConfig: {
          mode: 'addition',
          groupA: { count: 4, itemType: 'apple', labelVi: 'Quả táo đỏ' },
          groupB: { count: 3, itemType: 'orange', labelVi: 'Quả cam vàng' }
        },
        options: [5, 6, 7, 8],
        answer: 7,
        hintVi: 'Bé hãy tự đếm tất cả các quả táo và quả cam nhé!',
        hintEn: 'Count all red apples and oranges together!',
        explanationVi: '4 quả táo + 3 quả cam = 7 quả.',
        explanationEn: '4 + 3 = 7.'
      },
      {
        id: '10-2',
        type: 'fill',
        promptVi: 'Có 5 bông hoa đỏ và 2 bông hoa vàng. Tính: 5 + 2 = ?',
        promptEn: 'There are 5 red flowers and 2 yellow flowers. Calculate: 5 + 2 = ?',
        visualConfig: {
          mode: 'addition',
          groupA: { count: 5, itemType: 'flower_red', labelVi: 'Hoa đỏ' },
          groupB: { count: 2, itemType: 'flower_yellow', labelVi: 'Hoa vàng' }
        },
        options: [6, 7, 8, 9],
        answer: 7,
        hintVi: 'Bé đếm tiếp 2 bông từ số 5: 6, 7!',
        hintEn: 'Count on 2 from 5: 6, 7!',
        explanationVi: '5 + 2 = 7.',
        explanationEn: '5 + 2 = 7.'
      }
    ],
    recommendedGameId: 'rabbit-river'
  },
  {
    id: 11,
    volume: 1,
    topicId: 3,
    topicName: 'Phép cộng, phép trừ trong phạm vi 10',
    title: 'Bài 11. Phép trừ trong phạm vi 10',
    enTitle: 'Lesson 11. Subtraction within 10',
    summary: 'Làm quen dấu trừ (-), ý nghĩa bớt đi, bay mất, ăn mất hoặc tách ra.',
    enSummary: 'Learn the minus sign (-) and subtraction as taking away.',
    vocab: [
      { vi: 'Dấu trừ (-)', en: 'Minus', pronounce: 'mai-nớt-x', exampleVi: '6 - 2 = 4: Sáu trừ hai bằng bốn', exampleEn: '6 - 2 = 4: Six minus two equals four', icon: '➖' },
      { vi: 'Bớt đi', en: 'Take away', pronounce: 'tếch ơ-oây', exampleVi: 'Bớt đi 1 quả cam', exampleEn: 'Take away one orange', icon: '🍊' },
      { vi: 'Còn lại', en: 'Left / Remaining', pronounce: 'lép-t', exampleVi: 'Còn lại mấy chú chim?', exampleEn: 'How many birds are left?', icon: '🕊️' },
    ],
    exploreConcept: {
      headingVi: 'Bớt đi thì còn lại mấy?',
      headingEn: 'How many are left when taken away?',
      descriptionVi: 'Có 5 quả bóng, bay mất 2 quả. Còn lại 5 - 2 = 3 quả bóng!',
      descriptionEn: '5 balloons minus 2 floating away leaves 3 balloons!',
      interactiveType: 'addition-bar',
      defaultData: { a: 5, b: 2, op: '-' }
    },
    robotGuide: {
      tipVi: 'Phép trừ là bớt đi hoặc tìm phần còn lại. Hai số giống nhau trừ cho nhau luôn bằng 0: 4 - 4 = 0!',
      tipEn: 'Subtracting a number from itself equals zero: 4 - 4 = 0! Minus 0 leaves it unchanged: 5 - 0 = 5!',
      keyPoints: ['Dấu - đọc là "trừ"', 'Đếm lùi: 6 bớt 2 lùi 5, 4', 'a - a = 0 và a - 0 = a']
    },
    sampleQuestions: [
      {
        id: '11-1',
        type: 'fill',
        promptVi: 'Trên cành có 7 chú chim, 3 chú bay đi. Còn lại mấy chú chim?',
        promptEn: '7 birds on a branch, 3 fly away. How many remain?',
        options: [3, 4, 5, 6],
        answer: 4,
        hintVi: 'Lấy 7 - 3 = ?',
        hintEn: 'Calculate 7 - 3 = ?',
        explanationVi: '7 - 3 = 4 chú chim.',
        explanationEn: '7 - 3 = 4 birds remain.'
      }
    ],
    recommendedGameId: 'penguin-fishing'
  },
  {
    id: 12,
    volume: 1,
    topicId: 3,
    topicName: 'Phép cộng, phép trừ trong phạm vi 10',
    title: 'Bài 12. Bảng cộng, bảng trừ trong phạm vi 10',
    enTitle: 'Lesson 12. Addition & Subtraction Tables to 10',
    summary: 'Thuộc và vận dụng linh hoạt bảng cộng, bảng trừ trong phạm vi 10.',
    enSummary: 'Memorize and master the addition and subtraction tables within 10.',
    vocab: [
      { vi: 'Bảng cộng', en: 'Addition table', pronounce: 'ơ-đi-sừn tây-bồ', exampleVi: 'Học thuộc bảng cộng', exampleEn: 'Learn the addition table', icon: '📊' },
      { vi: 'Bảng trừ', en: 'Subtraction table', pronounce: 'xớp-trắc-sừn tây-bồ', exampleVi: 'Vận dụng bảng trừ', exampleEn: 'Apply the subtraction table', icon: '📉' },
    ],
    exploreConcept: {
      headingVi: 'Cánh hoa phép tính',
      headingEn: 'Math flower petals',
      descriptionVi: 'Tìm các cánh hoa có phép tính có kết quả bằng số ở nhụy hoa!',
      descriptionEn: 'Match petals whose math equals the flower center!',
      interactiveType: 'addition-bar',
      defaultData: { a: 4, b: 6, op: '+' }
    },
    robotGuide: {
      tipVi: 'Bé chú ý tính chất đổi chỗ nhé: 2 + 5 cũng bằng 5 + 2 = 7!',
      tipEn: 'Robot tip: Order does not matter in addition! 2 + 5 = 5 + 2 = 7!',
      keyPoints: ['Đổi chỗ 2 số cộng kết quả không đổi', 'Từ 3 + 4 = 7 ta có 7 - 3 = 4 và 7 - 4 = 3']
    },
    sampleQuestions: [
      {
        id: '12-1',
        type: 'choice',
        promptVi: 'Phép tính nào dưới đây có kết quả bằng 8?',
        promptEn: 'Which calculation equals 8?',
        options: ['5 + 3', '4 + 2', '10 - 3', '6 + 1'],
        answer: '5 + 3',
        hintVi: '5 + 3 = 8; 4 + 2 = 6; 10 - 3 = 7.',
        hintEn: '5 + 3 = 8.',
        explanationVi: '5 + 3 = 8.',
        explanationEn: '5 + 3 = 8.'
      }
    ],
    recommendedGameId: 'math-racing'
  },
  {
    id: 13,
    volume: 1,
    topicId: 3,
    topicName: 'Phép cộng, phép trừ trong phạm vi 10',
    title: 'Bài 13. Luyện tập chung',
    enTitle: 'Lesson 13. Mixed Operations Review to 10',
    summary: 'Thực hiện dãy tính có hai dấu phép tính (cộng, trừ liên tiếp trong phạm vi 10).',
    enSummary: 'Two-step addition and subtraction sequences up to 10.',
    vocab: [
      { vi: 'Dãy tính', en: 'Expression', pronounce: 'ếch-x-p-ré-sừn', exampleVi: '3 + 2 + 1 = 6', exampleEn: '3 + 2 + 1 = 6', icon: '🔗' },
      { vi: 'Tính nhẩm', en: 'Mental calculation', pronounce: 'men-tồ cal-cu-lây-sừn', exampleVi: 'Tính nhẩm thật nhanh', exampleEn: 'Quick mental math', icon: '⚡' },
    ],
    exploreConcept: {
      headingVi: 'Tính từ trái sang phải',
      headingEn: 'Calculate from left to right',
      descriptionVi: 'Ví dụ: 3 + 1 + 2 = ? Ta lấy 3 + 1 = 4, sau đó lấy 4 + 2 = 6!',
      descriptionEn: 'First 3 + 1 = 4, then 4 + 2 = 6!',
      interactiveType: 'addition-bar',
      defaultData: { a: 3, b: 1, c: 2 }
    },
    robotGuide: {
      tipVi: 'Khi có hai dấu phép tính, bé tính lần lượt từ trái sang phải nhé!',
      tipEn: 'When there are two operations, calculate step-by-step from left to right!',
      keyPoints: ['Làm phép tính thứ nhất trước', 'Lấy kết quả đó tính tiếp với số thứ ba']
    },
    sampleQuestions: [
      {
        id: '13-1',
        type: 'fill',
        promptVi: 'Tính: 8 - 2 - 3 = ?',
        promptEn: 'Calculate: 8 - 2 - 3 = ?',
        options: [2, 3, 4, 5],
        answer: 3,
        hintVi: 'Lấy 8 - 2 = 6, rồi lấy 6 - 3 = ?',
        hintEn: 'First 8 - 2 = 6, then 6 - 3 = ?',
        explanationVi: '8 - 2 = 6; 6 - 3 = 3.',
        explanationEn: '8 - 2 = 6; 6 - 3 = 3.'
      }
    ],
    recommendedGameId: 'treasure-cipher'
  },

  // --- TẬP 1 (Chủ đề 4) ---
  {
    id: 14,
    volume: 1,
    topicId: 4,
    topicName: 'Làm quen với một số hình khối',
    title: 'Bài 14. Khối lập phương, khối hộp chữ nhật',
    enTitle: 'Lesson 14. Cube and Cuboid',
    summary: 'Nhận biết khối lập phương (con xúc xắc, rubik) và khối hộp chữ nhật (hộp bánh, bể cá).',
    enSummary: 'Recognize 3D solid shapes: cube (dice) and cuboid (tissue box).',
    vocab: [
      { vi: 'Khối lập phương', en: 'Cube', pronounce: 'k-diu-b', exampleVi: 'Con xúc xắc, khối rubik', exampleEn: 'Playing dice, Rubik cube', icon: '🎲' },
      { vi: 'Khối hộp chữ nhật', en: 'Cuboid / Rectangular prism', pronounce: 'k-diu-boi-d', exampleVi: 'Hộp bánh, bao diêm, viên gạch', exampleEn: 'Cookie box, brick', icon: '📦' },
    ],
    exploreConcept: {
      headingVi: 'Khám phá các đồ vật dạng hình khối',
      headingEn: 'Exploring 3D everyday shapes',
      descriptionVi: 'Xúc xắc có 6 mặt vuông bằng nhau là khối lập phương. Hộp sữa, hộp quà là khối hộp chữ nhật!',
      descriptionEn: 'Dice with 6 square faces is a cube. Milk cartons are cuboids!',
      interactiveType: 'shape-shelf',
      defaultData: { solidType: 'cube' }
    },
    robotGuide: {
      tipVi: 'Khối lập phương có tất cả các mặt đều là hình vuông bằng nhau!',
      tipEn: 'A cube has 6 identical square faces!',
      keyPoints: ['Khối lập phương: 6 mặt hình vuông', 'Khối hộp chữ nhật: các mặt hình chữ nhật']
    },
    sampleQuestions: [
      {
        id: '14-1',
        type: 'choice',
        promptVi: 'Con súc sắc (xúc xắc) có dạng hình khối gì?',
        promptEn: 'What 3D shape is a game die?',
        options: ['Khối lập phương', 'Khối hộp chữ nhật', 'Hình vuông'],
        answer: 'Khối lập phương',
        hintVi: 'Nó là vật thể 3D có 6 mặt vuông bằng nhau.',
        hintEn: 'It is a 3D solid with equal square faces.',
        explanationVi: 'Con xúc xắc có dạng khối lập phương.',
        explanationEn: 'The die has the shape of a cube.'
      }
    ],
    recommendedGameId: 'bridge-builder'
  },
  {
    id: 15,
    volume: 1,
    topicId: 4,
    topicName: 'Làm quen với một số hình khối',
    title: 'Bài 15. Vị trí, định hướng trong không gian',
    enTitle: 'Lesson 15. Spatial Orientation & Positions',
    summary: 'Xác định vị trí: trên - dưới, trước - sau, ở giữa, phải - trái.',
    enSummary: 'Identify spatial positions: top/bottom, front/behind, middle, left/right.',
    vocab: [
      { vi: 'Ở trên - Ở dưới', en: 'Above / Below (Top / Bottom)', pronounce: 'ơ-bắp / bi-lâu', exampleVi: 'Búp bê ở trên, mèo ở dưới gầm bàn', exampleEn: 'Doll is on top, cat is under the table', icon: '⬆️' },
      { vi: 'Ở trước - Ở sau', en: 'In front of / Behind', pronounce: 'in f-răn / bi-hai-n', exampleVi: 'Thỏ nâu ở trước thỏ xám', exampleEn: 'Brown bunny in front of gray bunny', icon: '➡️' },
      { vi: 'Ở giữa', en: 'Between / In the middle', pronounce: 'bi-t-oen', exampleVi: 'Đèn vàng ở giữa đèn đỏ và xanh', exampleEn: 'Yellow light in the middle', icon: '↔️' },
      { vi: 'Bên phải - Bên trái', en: 'Right / Left', pronounce: 'rai-t / lép-t', exampleVi: 'Tay phải cầm bút, tay trái giữ vở', exampleEn: 'Right hand holds pen, left hand holds paper', icon: '✋' },
    ],
    exploreConcept: {
      headingVi: 'Quan sát các bạn trong phòng học',
      headingEn: 'Spot friends in the classroom',
      descriptionVi: 'Ai ngồi bên trái? Ai ngồi bên phải? Đèn giao thông đèn nào ở trên cùng?',
      descriptionEn: 'Who is on the left? Who is on the right? Which light is at the top?',
      interactiveType: 'comparator',
      defaultData: { pos: 'left-right' }
    },
    robotGuide: {
      tipVi: 'Bé giơ bàn tay hay cầm thìa lên nào, đó thường là tay phải! Tay còn lại là tay trái nhé!',
      tipEn: 'Raise your spoon hand, that is your right hand! The other is your left!',
      keyPoints: ['Trên - dưới theo chiều cao', 'Trước - sau theo hướng nhìn', 'Phải - trái theo cơ thể em']
    },
    sampleQuestions: [
      {
        id: '15-1',
        type: 'choice',
        promptVi: 'Trên cột đèn giao thông, bóng đèn màu nào nằm ở trên cùng?',
        promptEn: 'On a traffic light, which color is at the top?',
        visualConfig: {
          mode: 'traffic-light'
        },
        options: ['Màu đỏ', 'Màu vàng', 'Màu xanh'],
        answer: 'Màu đỏ',
        hintVi: 'Đèn đỏ dừng lại nằm ở trên cùng.',
        hintEn: 'Red light is always at the top.',
        explanationVi: 'Đèn đỏ ở trên cùng, đèn vàng ở giữa, đèn xanh ở dưới.',
        explanationEn: 'Red is on top, yellow in middle, green at bottom.'
      }
    ],
    recommendedGameId: 'treasure-hunt'
  },
  {
    id: 16,
    volume: 1,
    topicId: 4,
    topicName: 'Làm quen với một số hình khối',
    title: 'Bài 16. Luyện tập chung',
    enTitle: 'Lesson 16. Solids & Positions Review',
    summary: 'Ôn tập phân biệt khối lập phương, khối hộp chữ nhật và vị trí không gian.',
    enSummary: 'Practice with 3D shapes and spatial placement puzzles.',
    vocab: [
      { vi: 'Xếp chồng', en: 'Stack up', pronounce: 'x-tắc áp', exampleVi: 'Xếp chồng các khối gỗ', exampleEn: 'Stack up toy blocks', icon: '🧱' },
      { vi: 'Mặt trước', en: 'Front face', pronounce: 'f-răn fây-x', exampleVi: 'Mặt trước sơn màu đỏ', exampleEn: 'Front face painted red', icon: '🪟' },
    ],
    exploreConcept: {
      headingVi: 'Lâu đài khối gỗ của Robot',
      headingEn: 'Robot toy block castle',
      descriptionVi: 'Đếm xem có bao nhiêu khối lập phương màu vàng và khối hộp chữ nhật màu xanh!',
      descriptionEn: 'Count how many yellow cubes and blue cuboids are used!',
      interactiveType: 'shape-shelf',
      defaultData: { solidType: 'both' }
    },
    robotGuide: {
      tipVi: 'Khi quan sát hình khối, bé nhớ nhìn từ các hướng: mặt trên, mặt trước và hai bên nhé!',
      tipEn: 'Look at 3D shapes from different perspectives: top, front, and sides!',
      keyPoints: ['Khối hộp chữ nhật có thể lăn không? Không, chỉ trượt được thôi!']
    },
    sampleQuestions: [
      {
        id: '16-1',
        type: 'choice',
        promptVi: 'Vật nào sau đây có dạng khối hộp chữ nhật?',
        promptEn: 'Which item has the shape of a cuboid?',
        options: ['Hộp sữa giấy', 'Quả bóng đá', 'Cái nón lá'],
        answer: 'Hộp sữa giấy',
        hintVi: 'Hộp sữa có các mặt hình chữ nhật.',
        hintEn: 'A milk box has rectangular sides.',
        explanationVi: 'Hộp sữa giấy có dạng khối hộp chữ nhật.',
        explanationEn: 'The carton box is a cuboid.'
      }
    ],
    recommendedGameId: 'bridge-builder'
  },

  // --- TẬP 1 (Chủ đề 5: Ôn tập học kì I) ---
  {
    id: 17,
    volume: 1,
    topicId: 5,
    topicName: 'Ôn tập học kì I',
    title: 'Bài 17. Ôn tập các số trong phạm vi 10',
    enTitle: 'Lesson 17. Semester 1 Review: Numbers to 10',
    summary: 'Ôn tập đếm, đọc, viết, so sánh và thứ tự các số từ 0 đến 10.',
    enSummary: 'Review numbers, counting, and comparisons from 0 to 10.',
    vocab: [
      { vi: 'Số bé nhất', en: 'Smallest number', pronounce: 'x-mo-lít', exampleVi: '0 là số bé nhất trong phạm vi 10', exampleEn: '0 is the smallest', icon: '🌱' },
      { vi: 'Số lớn nhất', en: 'Largest number', pronounce: 'la-r-dít', exampleVi: '10 là số lớn nhất trong phạm vi 10', exampleEn: '10 is the greatest', icon: '🌳' },
    ],
    exploreConcept: {
      headingVi: 'Bể cá sắc màu',
      headingEn: 'Colorful aquariums',
      descriptionVi: 'Nối số lượng cá trong mỗi bể với số tương ứng từ 0 đến 10.',
      descriptionEn: 'Connect fish bowls with matching numbers from 0 to 10.',
      interactiveType: 'counter',
      defaultData: { max: 10, current: 10 }
    },
    robotGuide: {
      tipVi: 'Bé đã đi được nửa chặng đường lớp 1 rồi! Hãy cùng Robot ôn thật chắc các số nhé!',
      tipEn: 'Great progress! Review numbers 0-10 carefully to stay sharp!',
      keyPoints: ['0 là số nhỏ nhất trong phạm vi 10', '10 là số tròn chục nhỏ nhất']
    },
    sampleQuestions: [
      {
        id: '17-1',
        type: 'fill',
        promptVi: 'Số liền sau của số 9 là số nào?',
        promptEn: 'What number comes immediately after 9?',
        options: [8, 9, 10, 11],
        answer: 10,
        hintVi: 'Đếm 9 rồi đến...',
        hintEn: 'Count: 8, 9, ...',
        explanationVi: 'Số liền sau số 9 là 10.',
        explanationEn: 'The number after 9 is 10.'
      }
    ],
    recommendedGameId: 'number-train'
  },
  {
    id: 18,
    volume: 1,
    topicId: 5,
    topicName: 'Ôn tập học kì I',
    title: 'Bài 18. Ôn tập phép cộng, phép trừ trong phạm vi 10',
    enTitle: 'Lesson 18. Semester 1 Review: Add & Subtract to 10',
    summary: 'Rèn luyện tính nhẩm nhanh các phép tính cộng, trừ và giải toán có lời văn.',
    enSummary: 'Practice mental arithmetic and simple word problems within 10.',
    vocab: [
      { vi: 'Kết quả', en: 'Result / Answer', pronounce: 'ri-dát', exampleVi: 'Kết quả của phép tính 5 + 4 là 9', exampleEn: 'Result of 5 + 4 is 9', icon: '🎯' },
    ],
    exploreConcept: {
      headingVi: 'Vườn hoa phép tính',
      headingEn: 'Math calculation garden',
      descriptionVi: 'Tìm những bông hoa ghi phép tính có kết quả bằng 5!',
      descriptionEn: 'Find all flowers whose calculations equal 5!',
      interactiveType: 'addition-bar',
      defaultData: { a: 2, b: 3, op: '+' }
    },
    robotGuide: {
      tipVi: 'Bé hãy nhẩm thật nhanh: 10 - mấy bằng 6? 10 - 4 = 6!',
      tipEn: 'Mental trick: 10 minus what equals 6? 10 - 4 = 6!',
      keyPoints: ['Luyện tập tính nhẩm mỗi ngày', 'Kiểm tra lại kết quả bằng phép cộng ngược lại']
    },
    sampleQuestions: [
      {
        id: '18-1',
        type: 'fill',
        promptVi: 'Điền số thích hợp: 6 + ... = 10',
        promptEn: 'Fill in the blank: 6 + ... = 10',
        options: [2, 3, 4, 5],
        answer: 4,
        hintVi: '10 bớt đi 6 còn lại mấy?',
        hintEn: '10 minus 6 leaves what?',
        explanationVi: '6 + 4 = 10.',
        explanationEn: '6 + 4 = 10.'
      }
    ],
    recommendedGameId: 'math-racing'
  },
  {
    id: 19,
    volume: 1,
    topicId: 5,
    topicName: 'Ôn tập học kì I',
    title: 'Bài 19. Ôn tập hình học',
    enTitle: 'Lesson 19. Semester 1 Review: Geometry',
    summary: 'Ôn tập nhận biết hình vuông, tròn, tam giác, chữ nhật, khối lập phương và khối hộp chữ nhật.',
    enSummary: 'Review 2D and 3D shapes covered in Semester 1.',
    vocab: [
      { vi: 'Hình phẳng', en: '2D Shapes', pronounce: 'tu đi xê-i-p', exampleVi: 'Hình vuông, hình tròn', exampleEn: 'Square, circle', icon: '📐' },
      { vi: 'Hình khối', en: '3D Shapes / Solids', pronounce: 'th-ri đi xô-lít', exampleVi: 'Khối lập phương', exampleEn: 'Cube', icon: '🧊' },
    ],
    exploreConcept: {
      headingVi: 'Phân loại hình phẳng và hình khối',
      headingEn: 'Sort 2D flat shapes and 3D solids',
      descriptionVi: 'Xếp hình phẳng vào giỏ vàng, hình khối vào giỏ xanh nhé!',
      descriptionEn: 'Sort flat shapes and 3D blocks into matching baskets!',
      interactiveType: 'shape-shelf',
      defaultData: { review: true }
    },
    robotGuide: {
      tipVi: 'Hình phẳng vẽ trên trang giấy được. Hình khối cầm nắm trên tay được!',
      tipEn: 'Flat shapes are drawn on paper. 3D solid blocks can be held in your hands!',
      keyPoints: ['Hình phẳng: 4 loại đã học', 'Hình khối: 2 loại đã học']
    },
    sampleQuestions: [
      {
        id: '19-1',
        type: 'choice',
        promptVi: 'Khối hộp chữ nhật có tất cả bao nhiêu mặt?',
        promptEn: 'How many faces does a cuboid have?',
        options: [4, 5, 6, 8],
        answer: 6,
        hintVi: 'Có mặt trên, mặt dưới và 4 mặt xung quanh.',
        hintEn: 'Top, bottom, and 4 sides.',
        explanationVi: 'Khối hộp chữ nhật và khối lập phương đều có 6 mặt.',
        explanationEn: 'A cuboid and a cube both have 6 faces.'
      }
    ],
    recommendedGameId: 'magic-shape-workshop'
  },
  {
    id: 20,
    volume: 1,
    topicId: 5,
    topicName: 'Ôn tập học kì I',
    title: 'Bài 20. Ôn tập chung',
    enTitle: 'Lesson 20. Semester 1 Comprehensive Review',
    summary: 'Bài kiểm tra tổng hợp kiến thức học kì I với các thử thách thú vị.',
    enSummary: 'Semester 1 grand checkpoint challenges.',
    vocab: [
      { vi: 'Xuất sắc', en: 'Excellent', pronounce: 'ếch-xơ-lừn-t', exampleVi: 'Hoàn thành xuất sắc kì 1', exampleEn: 'Excellent work in Semester 1', icon: '🏅' },
    ],
    exploreConcept: {
      headingVi: 'Vượt chướng ngại vật cùng Robot',
      headingEn: 'Obstacle run with Robot',
      descriptionVi: 'Giải các câu hỏi để đưa Robot đến bục vinh quang học kì I!',
      descriptionEn: 'Solve math questions to lead Robot to the Semester 1 podium!',
      interactiveType: 'addition-bar',
      defaultData: { a: 7, b: 3, op: '-' }
    },
    robotGuide: {
      tipVi: 'Chúc mừng bé đã chuẩn bị bước sang Tập 2 với nhiều kiến thức thú vị về các số đến 100!',
      tipEn: 'Congratulations on completing Book 1! Ready for Book 2 and numbers to 100!',
      keyPoints: ['Tự tin đếm và tính toán đến 10', 'Nhận diện hình học chuẩn xác']
    },
    sampleQuestions: [
      {
        id: '20-1',
        type: 'fill',
        promptVi: 'Tính: 10 - 5 + 3 = ?',
        promptEn: 'Calculate: 10 - 5 + 3 = ?',
        options: [6, 7, 8, 9],
        answer: 8,
        hintVi: '10 - 5 = 5; 5 + 3 = ?',
        hintEn: '10 - 5 = 5; 5 + 3 = ?',
        explanationVi: '10 - 5 + 3 = 8.',
        explanationEn: '10 - 5 + 3 = 8.'
      }
    ],
    recommendedGameId: 'treasure-cipher'
  },

  // --- TẬP 2 (Chủ đề 6: Các số đến 100) ---
  {
    id: 21,
    volume: 2,
    topicId: 6,
    topicName: 'Các số đến 100',
    title: 'Bài 21. Số có hai chữ số',
    enTitle: 'Lesson 21. Two-Digit Numbers',
    summary: 'Làm quen các số từ 11 đến 99, khái niệm chục và đơn vị (ví dụ: 24 gồm 2 chục và 4 đơn vị).',
    enSummary: 'Two-digit numbers from 11 to 99, tens and ones (e.g. 24 is 2 tens and 4 ones).',
    vocab: [
      { vi: 'Chục', en: 'Tens', ipa: '/tɛnz/', trickyNote: 'Âm cuối là /z/ rung nhẹ thanh quản!', pronounce: 'ten-z', exampleVi: '1 chục = 10 quả cà chua', exampleEn: '1 ten = 10 tomatoes', icon: '🍅' },
      { vi: 'Đơn vị', en: 'Ones', ipa: '/wʌnz/', trickyNote: 'Âm đầu /w/, âm cuối /z/!', pronounce: 'oăn-z', exampleVi: '4 đơn vị', exampleEn: '4 ones', icon: '1️⃣' },
      { vi: 'Số tròn chục', en: 'Multiples of ten', ipa: '/ˈmʌltɪplz əv tɛn/', trickyNote: 'Chú ý đuôi -ty (như twenty, thirty) nhấn trọng âm đầu, đọc ngắn gọn!', pronounce: 'ten, twenty, thirty...', exampleVi: '10, 20, 30, 40, 50, 60, 70, 80, 90', exampleEn: '10, 20, 30, 40, 50, 60, 70, 80, 90', icon: '🔟' },
    ],
    exploreConcept: {
      headingVi: 'Túi cà chua chục và quả rời đơn vị',
      headingEn: 'Bags of 10 tomatoes and loose ones',
      descriptionVi: 'Mỗi túi có 10 quả cà chua (1 chục). 3 túi và 5 quả rời là số 35 (ba mươi lăm)!',
      descriptionEn: '3 bags of ten and 5 loose ones make 35 (thirty-five)!',
      interactiveType: 'tens-ones',
      defaultData: { tens: 3, ones: 5 }
    },
    robotGuide: {
      tipVi: 'Chữ số đứng trước là hàng chục, chữ số đứng sau là hàng đơn vị. Ví dụ: 57 gồm 5 chục và 7 đơn vị!',
      tipEn: 'The first digit is tens, the second digit is ones. 57 is 5 tens and 7 ones!',
      keyPoints: ['10 quả = 1 chục', 'Số tròn chục có chữ số tận cùng là 0', '42 gồm 4 chục và 2 đơn vị']
    },
    sampleQuestions: [
      {
        id: '21-1',
        type: 'fill',
        promptVi: 'Số 46 gồm mấy chục và mấy đơn vị?',
        promptEn: '46 consists of how many tens and ones?',
        options: ['4 chục và 6 đơn vị', '6 chục và 4 đơn vị', '40 chục'],
        answer: '4 chục và 6 đơn vị',
        hintVi: 'Chữ số 4 đứng trước là chục, chữ số 6 đứng sau là đơn vị.',
        hintEn: '4 in the tens place and 6 in the ones place.',
        explanationVi: 'Số 46 gồm 4 chục và 6 đơn vị.',
        explanationEn: '46 is made of 4 tens and 6 ones.'
      }
    ],
    recommendedGameId: 'penguin-fishing'
  },
  {
    id: 22,
    volume: 2,
    topicId: 6,
    topicName: 'Các số đến 100',
    title: 'Bài 22. So sánh số có hai chữ số',
    enTitle: 'Lesson 22. Comparing Two-Digit Numbers',
    summary: 'So sánh số hàng chục trước; nếu hàng chục bằng nhau thì so sánh hàng đơn vị.',
    enSummary: 'Compare tens first; if tens are equal, compare the ones digits.',
    vocab: [
      { vi: 'So sánh hàng chục', en: 'Compare tens', pronounce: 'com-pe ten-z', exampleVi: '53 > 35 vì 5 chục > 3 chục', exampleEn: '53 > 35 because 5 tens > 3 tens', icon: '⚖️' },
      { vi: 'So sánh hàng đơn vị', en: 'Compare ones', pronounce: 'com-pe oăn-z', exampleVi: '37 > 35 vì 7 đơn vị > 5 đơn vị', exampleEn: '37 > 35 because 7 ones > 5 ones', icon: '🔍' },
    ],
    exploreConcept: {
      headingVi: 'Túi nào có số lớn hơn?',
      headingEn: 'Which bag has the larger number?',
      descriptionVi: 'So sánh 57 và 50: Hàng chục đều là 5, hàng đơn vị 7 > 0 nên 57 > 50!',
      descriptionEn: 'Tens are both 5, but 7 ones > 0 ones, so 57 > 50!',
      interactiveType: 'tens-ones',
      defaultData: { leftVal: 57, rightVal: 50 }
    },
    robotGuide: {
      tipVi: 'Bí quyết của Robot: Luôn nhìn chữ số hàng chục trước! 62 > 59 vì 6 chục lớn hơn 5 chục!',
      tipEn: 'Robot secret: Check tens first! 62 > 59 because 6 tens is greater than 5 tens!',
      keyPoints: ['Chữ số hàng chục lớn hơn thì số đó lớn hơn', 'Nếu hàng chục bằng nhau, so sánh hàng đơn vị']
    },
    sampleQuestions: [
      {
        id: '22-1',
        type: 'compare',
        promptVi: 'Điền dấu thích hợp: 68 ... 86',
        promptEn: 'Choose the correct sign: 68 ... 86',
        options: ['>', '<', '='],
        answer: '<',
        hintVi: 'So sánh hàng chục: 6 chục bé hơn 8 chục.',
        hintEn: 'Compare tens: 6 tens is less than 8 tens.',
        explanationVi: '68 < 86 vì 6 chục < 8 chục.',
        explanationEn: '68 < 86 because 6 tens < 8 tens.'
      }
    ],
    recommendedGameId: 'math-racing'
  },
  {
    id: 23,
    volume: 2,
    topicId: 6,
    topicName: 'Các số đến 100',
    title: 'Bài 23. Bảng các số từ 1 đến 100',
    enTitle: 'Lesson 23. The 1 to 100 Number Chart',
    summary: 'Khám phá quy luật hàng và cột trong bảng 100 số, số 100 (một trăm = 10 chục).',
    enSummary: 'Explore rows and columns in the 100 chart, and understand 100 (ten tens).',
    vocab: [
      { vi: 'Một trăm', en: 'One hundred', pronounce: 'oăn hăn-đrợt', exampleVi: '99 thêm 1 là 100', exampleEn: '99 plus 1 is 100', icon: '💯' },
      { vi: 'Hàng', en: 'Row', pronounce: 'râu', exampleVi: 'Các số trên cùng một hàng', exampleEn: 'Numbers in a row', icon: '↔️' },
      { vi: 'Cột', en: 'Column', pronounce: 'co-lùm', exampleVi: 'Các số trên cùng một cột', exampleEn: 'Numbers in a column', icon: '↕️' },
    ],
    exploreConcept: {
      headingVi: 'Bảng 100 ô số kỳ diệu',
      headingEn: 'The magical 100-grid board',
      descriptionVi: 'Chạm vào ô số để nghe phát âm tiếng Việt và tiếng Anh!',
      descriptionEn: 'Tap numbers to hear Vietnamese and English pronunciations!',
      interactiveType: 'tens-ones',
      defaultData: { showGrid: true, highlighted: 100 }
    },
    robotGuide: {
      tipVi: '100 là số có ba chữ số: gồm 1 chữ số một và 2 chữ số không. 100 gồm 10 chục!',
      tipEn: '100 is written with three digits: 1, 0, 0. One hundred is 10 tens!',
      keyPoints: ['Mỗi hàng có 10 số', 'Các số tận cùng giống nhau nằm trên cùng một cột', 'Số lớn nhất có hai chữ số là 99']
    },
    sampleQuestions: [
      {
        id: '23-1',
        type: 'fill',
        promptVi: 'Số lớn nhất có hai chữ số là số nào?',
        promptEn: 'What is the largest two-digit number?',
        options: [90, 99, 100, 89],
        answer: 99,
        hintVi: 'Số này đứng ngay trước số 100.',
        hintEn: 'It comes right before 100.',
        explanationVi: 'Số lớn nhất có 2 chữ số là 99.',
        explanationEn: '99 is the largest two-digit number.'
      }
    ],
    recommendedGameId: 'number-train'
  },
  {
    id: 24,
    volume: 2,
    topicId: 6,
    topicName: 'Các số đến 100',
    title: 'Bài 24. Luyện tập chung',
    enTitle: 'Lesson 24. Numbers to 100 Review',
    summary: 'Rèn luyện sắp xếp số thứ tự, tìm số còn thiếu trong dãy số đến 100.',
    enSummary: 'Sequence ordering, missing numbers, and two-digit challenges.',
    vocab: [
      { vi: 'Số liền trước', en: 'Preceding number', pronounce: 'p-ri-xí-đinh', exampleVi: 'Số liền trước của 50 là 49', exampleEn: 'The number before 50 is 49', icon: '⏮️' },
      { vi: 'Số liền sau', en: 'Succeeding number', pronounce: 'xấc-xí-đinh', exampleVi: 'Số liền sau của 50 là 51', exampleEn: 'The number after 50 is 51', icon: '⏭️' },
    ],
    exploreConcept: {
      headingVi: 'Đường ray xe lửa xuyên rừng',
      headingEn: 'Forest train railway',
      descriptionVi: 'Tìm toa số bị rơi mất: 70, 71, ?, 73, 74',
      descriptionEn: 'Find the missing train car: 70, 71, ?, 73, 74',
      interactiveType: 'counter',
      defaultData: { missingSequence: [70, 71, 72, 73, 74] }
    },
    robotGuide: {
      tipVi: 'Muốn tìm số liền trước, bé bớt đi 1. Muốn tìm số liền sau, bé thêm vào 1 nhé!',
      tipEn: 'Subtract 1 for preceding number. Add 1 for succeeding number!',
      keyPoints: ['Liền trước 40 là 39', 'Liền sau 40 là 41']
    },
    sampleQuestions: [
      {
        id: '24-1',
        type: 'fill',
        promptVi: 'Số liền trước của số 70 là số nào?',
        promptEn: 'What number comes immediately before 70?',
        options: [68, 69, 71, 72],
        answer: 69,
        hintVi: 'Lấy 70 bớt đi 1 đơn vị.',
        hintEn: '70 minus 1 unit.',
        explanationVi: 'Số liền trước của 70 là 69.',
        explanationEn: 'The number right before 70 is 69.'
      }
    ],
    recommendedGameId: 'treasure-hunt'
  },

  // --- TẬP 2 (Chủ đề 7: Độ dài và đo độ dài) ---
  {
    id: 25,
    volume: 2,
    topicId: 7,
    topicName: 'Độ dài và đo độ dài',
    title: 'Bài 25. Dài hơn, ngắn hơn',
    enTitle: 'Lesson 25. Longer, Shorter, Taller',
    summary: 'So sánh độ dài: dài hơn, ngắn hơn; so sánh chiều cao: cao hơn, thấp hơn, cao bằng.',
    enSummary: 'Compare lengths and heights: longer, shorter, taller, shorter, same height.',
    vocab: [
      { vi: 'Dài hơn', en: 'Longer', pronounce: 'long-gơ', exampleVi: 'Bút mực dài hơn bút chì', exampleEn: 'The pen is longer than the pencil', icon: '📏' },
      { vi: 'Ngắn hơn', en: 'Shorter', pronounce: 'so-tơ', exampleVi: 'Bút chì ngắn hơn bút mực', exampleEn: 'The pencil is shorter than the pen', icon: '✏️' },
      { vi: 'Cao hơn', en: 'Taller', pronounce: 'to-lơ', exampleVi: 'Hươu cao cổ cao hơn ngựa vằn', exampleEn: 'Giraffe is taller than zebra', icon: '🦒' },
      { vi: 'Thấp hơn', en: 'Shorter (height)', pronounce: 'so-tơ', exampleVi: 'Ngựa vằn thấp hơn hươu', exampleEn: 'Zebra is shorter', icon: '🦓' },
    ],
    exploreConcept: {
      headingVi: 'So sánh bút mực và bút chì',
      headingEn: 'Comparing pens and pencils',
      descriptionVi: 'Đặt một đầu của hai chiếc bút thẳng hàng nhau để nhìn xem chiếc bút nào nhô ra dài hơn!',
      descriptionEn: 'Align one end together to see which one extends further!',
      interactiveType: 'ruler',
      defaultData: { itemA: 12, itemB: 8 }
    },
    robotGuide: {
      tipVi: 'Bé nhớ nhé: Để so sánh chính xác, phải đặt một đầu của hai vật bằng nhau trên cùng một đường thẳng!',
      tipEn: 'Line up one end on a flat baseline before comparing lengths!',
      keyPoints: ['Đặt bằng một đầu', 'Vật nhô ra nhiều hơn là dài hơn (hoặc cao hơn)']
    },
    sampleQuestions: [
      {
        id: '25-1',
        type: 'choice',
        promptVi: 'Hươu cao cổ và ngựa vằn, con vật nào cao hơn?',
        promptEn: 'Between a giraffe and a zebra, which animal is taller?',
        options: ['Hươu cao cổ', 'Ngựa vằn', 'Cao bằng nhau'],
        answer: 'Hươu cao cổ',
        hintVi: 'Hươu có chiếc cổ rất dài vươn lên cao.',
        hintEn: 'The giraffe has a long neck reaching up.',
        explanationVi: 'Hươu cao cổ cao hơn ngựa vằn.',
        explanationEn: 'The giraffe is taller than the zebra.'
      }
    ],
    recommendedGameId: 'bridge-builder'
  },
  {
    id: 26,
    volume: 2,
    topicId: 7,
    topicName: 'Độ dài và đo độ dài',
    title: 'Bài 26. Đơn vị đo độ dài',
    enTitle: 'Lesson 26. Centimeter (cm) & Non-standard Units',
    summary: 'Đo độ dài bằng gang tay, bước chân, sải tay và làm quen thước đo xăng-ti-mét (cm).',
    enSummary: 'Measure with handspans, footsteps, and centimeters with a ruler.',
    vocab: [
      { vi: 'Xăng-ti-mét', en: 'Centimeter', pronounce: 'xen-ti-mi-tơ', exampleVi: 'Viết tắt là cm', exampleEn: 'Abbreviated as cm', icon: '📐' },
      { vi: 'Gang tay', en: 'Handspan', pronounce: 'han-x-pan', exampleVi: 'Bàn học dài 5 gang tay', exampleEn: 'Desk is 5 handspans long', icon: '🖐️' },
      { vi: 'Thước kẻ', en: 'Ruler', pronounce: 'ru-lơ', exampleVi: 'Thước kẻ có chia vạch xăng-ti-mét', exampleEn: 'Ruler with cm markings', icon: '📏' },
    ],
    exploreConcept: {
      headingVi: 'Đo bút chì bằng thước kẻ xăng-ti-mét',
      headingEn: 'Measure a pencil using a cm ruler',
      descriptionVi: 'Đặt một đầu bút vào vạch số 0 của thước, đầu kia chỉ vào số mấy thì bút dài bấy nhiêu cm!',
      descriptionEn: 'Align the tip with mark 0, read the number at the other end!',
      interactiveType: 'ruler',
      defaultData: { targetLength: 7 }
    },
    robotGuide: {
      tipVi: 'Quy tắc vàng của thước đo: Đặt một đầu vật ngay đúng vạch số 0 của thước, không đặt ở mép thước nhé!',
      tipEn: 'Golden rule: Always align one end with the 0 cm mark, not the physical edge!',
      keyPoints: ['Xăng-ti-mét viết tắt là cm', 'Đọc số ở đầu kia của vật', 'Đơn vị đo chuẩn xác']
    },
    sampleQuestions: [
      {
        id: '26-1',
        type: 'fill',
        promptVi: 'Một chiếc bút chì đặt đầu vào vạch 0 cm, đầu kia chỉ vào vạch 8 cm. Bút chì dài mấy cm?',
        promptEn: 'A pencil from 0 cm to 8 cm on a ruler is how many cm long?',
        options: [6, 7, 8, 9],
        answer: 8,
        hintVi: 'Nhìn số đo ở vạch thước cuối cùng.',
        hintEn: 'Look at the tick mark number.',
        explanationVi: 'Chiếc bút chì dài 8 cm.',
        explanationEn: 'The pencil is 8 cm long.'
      }
    ],
    recommendedGameId: 'bridge-builder'
  },
  {
    id: 27,
    volume: 2,
    topicId: 7,
    topicName: 'Độ dài và đo độ dài',
    title: 'Bài 27. Thực hành ước lượng và đo độ dài',
    enTitle: 'Lesson 27. Estimating and Measuring Lengths',
    summary: 'Tập ước lượng độ dài các đồ dùng học tập trước khi dùng thước đo chính xác.',
    enSummary: 'Estimate lengths of classroom tools, then measure to verify.',
    vocab: [
      { vi: 'Ước lượng', en: 'Estimate / Guess', pronounce: 'e-x-ti-mây-t', exampleVi: 'Ước lượng bút dài khoảng 10 cm', exampleEn: 'Estimate pencil is about 10 cm', icon: '🤔' },
      { vi: 'Khoảng chừng', en: 'About / Approximately', pronounce: 'ơ-bao-t', exampleVi: 'Khoảng 4 sải tay', exampleEn: 'About 4 armspans', icon: '📏' },
    ],
    exploreConcept: {
      headingVi: 'Ước lượng và kiểm tra cùng Robot',
      headingEn: 'Estimate and verify with Robot',
      descriptionVi: 'Đoán xem chiếc hộp bút dài 12 cm hay 25 cm, sau đó kéo thước vào để kiểm tra!',
      descriptionEn: 'Guess if the pencil case is 12 cm or 25 cm, then slide the ruler!',
      interactiveType: 'ruler',
      defaultData: { item: 'pencil-box', actual: 18 }
    },
    robotGuide: {
      tipVi: 'Ước lượng nghĩa là bé nhìn và đoán gần đúng kích thước dựa trên những vật đã biết!',
      tipEn: 'Estimating means making a smart guess based on objects you already know!',
      keyPoints: ['1 gang tay học sinh khoảng 12 - 15 cm', '1 cục tẩy dài khoảng 3 - 4 cm']
    },
    sampleQuestions: [
      {
        id: '27-1',
        type: 'choice',
        promptVi: 'Độ dài của một chiếc bút mực trong thực tế khoảng bao nhiêu?',
        promptEn: 'How long is a real ink pen approximately?',
        options: ['14 cm', '50 cm', '1 cm'],
        answer: '14 cm',
        hintVi: 'Bút mực dài khoảng 1 gang tay (khoảng 14 cm).',
        hintEn: 'A pen is about one handspan long.',
        explanationVi: 'Bút mực dài khoảng 14 cm.',
        explanationEn: 'An ink pen is about 14 cm long.'
      }
    ],
    recommendedGameId: 'bridge-builder'
  },
  {
    id: 28,
    volume: 2,
    topicId: 7,
    topicName: 'Độ dài và đo độ dài',
    title: 'Bài 28. Luyện tập chung',
    enTitle: 'Lesson 28. Length & Measurement Review',
    summary: 'Củng cố kỹ năng so sánh độ dài, đọc số đo trên thước và giải bài toán đo lường.',
    enSummary: 'Reinforce measuring skills, reading rulers, and comparing lengths.',
    vocab: [
      { vi: 'Dài nhất', en: 'Longest', pronounce: 'long-gít', exampleVi: 'Bút chì nào dài nhất?', exampleEn: 'Which pencil is the longest?', icon: '🏆' },
      { vi: 'Ngắn nhất', en: 'Shortest', pronounce: 'so-tít', exampleVi: 'Cục tẩy ngắn nhất', exampleEn: 'The eraser is the shortest', icon: '🥇' },
    ],
    exploreConcept: {
      headingVi: 'Xếp hàng theo độ dài từ ngắn đến dài',
      headingEn: 'Sort objects from shortest to longest',
      descriptionVi: 'Kéo các thanh gỗ sắp xếp theo thứ tự dài dần!',
      descriptionEn: 'Order beams from shortest to longest!',
      interactiveType: 'ruler',
      defaultData: { sortMode: true }
    },
    robotGuide: {
      tipVi: 'Bé đã nắm vững cách đo độ dài rồi! Hãy dùng thước kẻ cẩn thận nhé!',
      tipEn: 'You are now a measurement master! Always measure carefully!',
      keyPoints: ['So sánh các số xăng-ti-mét: 15 cm > 10 cm']
    },
    sampleQuestions: [
      {
        id: '28-1',
        type: 'compare',
        promptVi: 'Băng giấy đỏ dài 12 cm, băng giấy xanh dài 15 cm. Băng giấy nào dài hơn?',
        promptEn: 'Red strip is 12 cm, blue strip is 15 cm. Which strip is longer?',
        options: ['Băng giấy xanh', 'Băng giấy đỏ', 'Bằng nhau'],
        answer: 'Băng giấy xanh',
        hintVi: '15 cm lớn hơn 12 cm.',
        hintEn: '15 cm is greater than 12 cm.',
        explanationVi: 'Băng giấy xanh dài hơn (15 cm > 12 cm).',
        explanationEn: 'The blue strip is longer (15 cm > 12 cm).'
      }
    ],
    recommendedGameId: 'bridge-builder'
  },

  // --- TẬP 2 (Chủ đề 8: Phép cộng, trừ không nhớ trong phạm vi 100) ---
  {
    id: 29,
    volume: 2,
    topicId: 8,
    topicName: 'Phép cộng, phép trừ (không nhớ) trong phạm vi 100',
    title: 'Bài 29. Phép cộng số có hai chữ số với số có một chữ số',
    enTitle: 'Lesson 29. Two-digit + One-digit Addition (No Regrouping)',
    summary: 'Đặt tính và tính phép cộng dạng 41 + 5 = 46 (cộng hàng đơn vị với nhau, giữ nguyên hàng chục).',
    enSummary: 'Add 2-digit with 1-digit numbers without carrying: 41 + 5 = 46.',
    vocab: [
      { vi: 'Đặt tính', en: 'Column addition', pronounce: 'co-lùm', exampleVi: 'Viết các chữ số thẳng cột', exampleEn: 'Align digits vertically in columns', icon: '📝' },
      { vi: 'Cộng đơn vị', en: 'Add ones', pronounce: 'át oăn-z', exampleVi: '1 cộng 5 bằng 6, viết 6', exampleEn: '1 plus 5 is 6, write 6', icon: '1️⃣' },
      { vi: 'Hạ chục', en: 'Bring down tens', pronounce: 'b-ring đao ten-z', exampleVi: 'Hạ 4, viết 4', exampleEn: 'Bring down 4', icon: '⬇️' },
    ],
    exploreConcept: {
      headingVi: 'Bó que tính và que rời: 41 + 5 = ?',
      headingEn: 'Tens bundles and single sticks: 41 + 5 = ?',
      descriptionVi: '4 bó chục que tính và 1 que rời. Thêm 5 que rời nữa: 1 + 5 = 6 que rời. Tất cả là 46!',
      descriptionEn: '4 tens and 1 one. Add 5 ones: 1 + 5 = 6 ones. Total is 46!',
      interactiveType: 'tens-ones',
      defaultData: { tens: 4, ones: 1, addOnes: 5 }
    },
    robotGuide: {
      tipVi: 'Cách đặt tính: Đơn vị thẳng cột với đơn vị! 1 cộng 5 bằng 6, viết 6. Hạ 4, viết 4. Kết quả là 46!',
      tipEn: 'Line up ones under ones! Add ones: 1 + 5 = 6. Bring down 4 tens. Total is 46!',
      keyPoints: ['Đơn vị cộng với đơn vị', 'Hàng chục giữ nguyên', 'Tuyệt đối không có nhớ trong phạm vi lớp 1']
    },
    sampleQuestions: [
      {
        id: '29-1',
        type: 'fill',
        promptVi: 'Tính: 32 + 4 = ?',
        promptEn: 'Calculate: 32 + 4 = ?',
        options: [34, 35, 36, 37],
        answer: 36,
        hintVi: 'Lấy 2 + 4 = 6 đơn vị. Hạ 3 chục được 36.',
        hintEn: '2 + 4 = 6 ones. Keep 3 tens = 36.',
        explanationVi: '32 + 4 = 36.',
        explanationEn: '32 + 4 = 36.'
      }
    ],
    recommendedGameId: 'math-racing'
  },
  {
    id: 30,
    volume: 2,
    topicId: 8,
    topicName: 'Phép cộng, phép trừ (không nhớ) trong phạm vi 100',
    title: 'Bài 30. Phép cộng số có hai chữ số với số có hai chữ số',
    enTitle: 'Lesson 30. Two-digit + Two-digit Addition (No Regrouping)',
    summary: 'Cộng hàng đơn vị với hàng đơn vị, hàng chục với hàng chục: 32 + 15 = 47.',
    enSummary: 'Add 2-digit to 2-digit numbers: add ones to ones, tens to tens: 32 + 15 = 47.',
    vocab: [
      { vi: 'Cộng chục với chục', en: 'Add tens to tens', pronounce: 'át ten-z', exampleVi: '3 cộng 1 bằng 4, viết 4', exampleEn: '3 plus 1 is 4, write 4', icon: '🔟' },
    ],
    exploreConcept: {
      headingVi: 'Thao tác que tính: 32 + 15 = ?',
      headingEn: 'Stick bundle model: 32 + 15 = ?',
      descriptionVi: '2 + 5 = 7 đơn vị. 3 chục + 1 chục = 4 chục. Kết quả là 47!',
      descriptionEn: '2 + 5 = 7 ones. 3 tens + 1 ten = 4 tens. Total is 47!',
      interactiveType: 'tens-ones',
      defaultData: { tens1: 3, ones1: 2, tens2: 1, ones2: 5 }
    },
    robotGuide: {
      tipVi: 'Bước 1: Cộng từ phải sang trái (đơn vị trước). Bước 2: Cộng hàng chục!',
      tipEn: 'Step 1: Add from right to left (ones first). Step 2: Add tens column!',
      keyPoints: ['Đơn vị thẳng cột đơn vị', 'Chục thẳng cột chục', 'Tính từ phải sang trái']
    },
    sampleQuestions: [
      {
        id: '30-1',
        type: 'fill',
        promptVi: 'Tính nhẩm: 40 + 30 = ?',
        promptEn: 'Mental addition: 40 + 30 = ?',
        options: [60, 70, 80, 50],
        answer: 70,
        hintVi: '4 chục + 3 chục = 7 chục (70).',
        hintEn: '4 tens + 3 tens = 7 tens (70).',
        explanationVi: '40 + 30 = 70.',
        explanationEn: '40 + 30 = 70.'
      },
      {
        id: '30-2',
        type: 'fill',
        promptVi: 'Tính: 23 + 45 = ?',
        promptEn: 'Calculate: 23 + 45 = ?',
        options: [67, 68, 69, 58],
        answer: 68,
        hintVi: '3 + 5 = 8; 2 + 4 = 6 -> 68.',
        hintEn: '3 + 5 = 8; 2 + 4 = 6 -> 68.',
        explanationVi: '23 + 45 = 68.',
        explanationEn: '23 + 45 = 68.'
      }
    ],
    recommendedGameId: 'math-supermarket'
  },
  {
    id: 31,
    volume: 2,
    topicId: 8,
    topicName: 'Phép cộng, phép trừ (không nhớ) trong phạm vi 100',
    title: 'Bài 31. Phép trừ số có hai chữ số cho số có một chữ số',
    enTitle: 'Lesson 31. Two-digit - One-digit Subtraction (No Regrouping)',
    summary: 'Đặt tính và trừ hàng đơn vị cho hàng đơn vị, giữ nguyên hàng chục: 76 - 5 = 71.',
    enSummary: 'Subtract 1-digit from 2-digit numbers: 76 - 5 = 71.',
    vocab: [
      { vi: 'Trừ đơn vị', en: 'Subtract ones', pronounce: 'xớp-trắc oăn-z', exampleVi: '6 trừ 5 bằng 1, viết 1', exampleEn: '6 minus 5 is 1', icon: '➖' },
    ],
    exploreConcept: {
      headingVi: 'Bớt que rời: 76 - 5 = ?',
      headingEn: 'Taking away single sticks: 76 - 5 = ?',
      descriptionVi: '7 bó chục và 6 que rời. Bớt đi 5 que rời: 6 - 5 = 1. Còn lại 71!',
      descriptionEn: '7 tens and 6 ones. Remove 5 ones: 6 - 5 = 1. 71 left!',
      interactiveType: 'tens-ones',
      defaultData: { tens: 7, ones: 6, subOnes: 5 }
    },
    robotGuide: {
      tipVi: 'Bé lấy chữ số đơn vị trừ cho nhau trước, rồi hạ hàng chục xuống nhé!',
      tipEn: 'Subtract the ones digits first, then bring down the tens!',
      keyPoints: ['6 - 5 = 1, hạ 7 được 71', 'Tính cẩn thận từng cột']
    },
    sampleQuestions: [
      {
        id: '31-1',
        type: 'fill',
        promptVi: 'Tính: 58 - 3 = ?',
        promptEn: 'Calculate: 58 - 3 = ?',
        options: [54, 55, 56, 57],
        answer: 55,
        hintVi: '8 - 3 = 5; hạ 5 chục được 55.',
        hintEn: '8 - 3 = 5 ones, keep 5 tens = 55.',
        explanationVi: '58 - 3 = 55.',
        explanationEn: '58 - 3 = 55.'
      }
    ],
    recommendedGameId: 'rabbit-river'
  },
  {
    id: 32,
    volume: 2,
    topicId: 8,
    topicName: 'Phép cộng, phép trừ (không nhớ) trong phạm vi 100',
    title: 'Bài 32. Phép trừ số có hai chữ số cho số có hai chữ số',
    enTitle: 'Lesson 32. Two-digit - Two-digit Subtraction (No Regrouping)',
    summary: 'Trừ đơn vị cho đơn vị, trừ chục cho chục (không nhớ): 68 - 25 = 43.',
    enSummary: 'Subtract 2-digit numbers: ones from ones, tens from tens: 68 - 25 = 43.',
    vocab: [
      { vi: 'Trừ chục cho chục', en: 'Subtract tens from tens', pronounce: 'xớp-trắc ten-z', exampleVi: '6 chục trừ 2 chục bằng 4 chục', exampleEn: '6 tens minus 2 tens is 4 tens', icon: '📉' },
    ],
    exploreConcept: {
      headingVi: 'Bớt cả bó chục và que rời: 68 - 25 = ?',
      headingEn: 'Subtracting tens and ones: 68 - 25 = ?',
      descriptionVi: '8 - 5 = 3 đơn vị; 6 chục - 2 chục = 4 chục. Còn lại 43!',
      descriptionEn: '8 - 5 = 3 ones; 6 - 2 = 4 tens. Total remaining: 43!',
      interactiveType: 'tens-ones',
      defaultData: { tens1: 6, ones1: 8, tens2: 2, ones2: 5 }
    },
    robotGuide: {
      tipVi: 'Luôn trừ hàng đơn vị trước (ở bên phải), sau đó trừ hàng chục (ở bên trái)!',
      tipEn: 'Always subtract the ones column on the right first, then the tens on the left!',
      keyPoints: ['Không có mượn/nhớ trong chương trình lớp 1', 'Đơn vị trừ đơn vị, chục trừ chục']
    },
    sampleQuestions: [
      {
        id: '32-1',
        type: 'fill',
        promptVi: 'Tính: 79 - 34 = ?',
        promptEn: 'Calculate: 79 - 34 = ?',
        options: [43, 44, 45, 46],
        answer: 45,
        hintVi: '9 - 4 = 5; 7 - 3 = 4 -> 45.',
        hintEn: '9 - 4 = 5; 7 - 3 = 4 -> 45.',
        explanationVi: '79 - 34 = 45.',
        explanationEn: '79 - 34 = 45.'
      }
    ],
    recommendedGameId: 'math-supermarket'
  },
  {
    id: 33,
    volume: 2,
    topicId: 8,
    topicName: 'Phép cộng, phép trừ (không nhớ) trong phạm vi 100',
    title: 'Bài 33. Luyện tập chung',
    enTitle: 'Lesson 33. Review Addition & Subtraction to 100',
    summary: 'Rèn luyện thành thạo cộng trừ không nhớ trong phạm vi 100 và giải toán có lời văn.',
    enSummary: 'Practice addition, subtraction and word problems up to 100.',
    vocab: [
      { vi: 'Bài toán', en: 'Word problem', pronounce: 'uốt p-róp-lầm', exampleVi: 'Giải bài toán có lời văn', exampleEn: 'Solve a word problem', icon: '📖' },
    ],
    exploreConcept: {
      headingVi: 'Xe buýt chở học sinh',
      headingEn: 'School bus passenger problem',
      descriptionVi: 'Xe buýt có 35 bạn, thêm 12 bạn lên xe. Trên xe có tất cả 35 + 12 = 47 bạn!',
      descriptionEn: '35 kids on the bus, 12 more get on. Total 35 + 12 = 47 kids!',
      interactiveType: 'tens-ones',
      defaultData: { busProblem: true }
    },
    robotGuide: {
      tipVi: 'Khi đọc bài toán có lời văn, bé chú ý chữ "thêm" hoặc "tất cả" là làm phép cộng, "bớt" hoặc "còn lại" là làm phép trừ nhé!',
      tipEn: 'In word problems: "more / all together" = add (+), "left / fewer" = subtract (-)!',
      keyPoints: ['Đọc kĩ đề bài', 'Chọn phép tính đúng (+ hoặc -)', 'Ghi kèm đơn vị']
    },
    sampleQuestions: [
      {
        id: '33-1',
        type: 'fill',
        promptVi: 'Vườn nhà bà có 42 cây bắp cải, mẹ trồng thêm 15 cây nữa. Hỏi có tất cả bao nhiêu cây bắp cải?',
        promptEn: 'Grandma has 42 cabbages, mom plants 15 more. How many in all?',
        options: ['55 cây bắp cải', '56 cây bắp cải', '57 cây bắp cải', '58 cây bắp cải'],
        answer: '57 cây bắp cải',
        hintVi: 'Lấy 42 + 15 = ?',
        hintEn: 'Add 42 + 15 = ?',
        explanationVi: '42 + 15 = 57 cây bắp cải.',
        explanationEn: '42 + 15 = 57 cabbages in all.'
      }
    ],
    recommendedGameId: 'math-supermarket'
  },

  // --- TẬP 2 (Chủ đề 9: Thời gian. Giờ và lịch) ---
  {
    id: 34,
    volume: 2,
    topicId: 9,
    topicName: 'Thời gian. Giờ và lịch',
    title: 'Bài 34. Xem giờ đúng trên đồng hồ',
    enTitle: "Lesson 34. Telling Time: Exact Hours (O'clock)",
    summary: 'Nhận biết kim ngắn chỉ giờ, kim dài chỉ phút. Xem giờ đúng khi kim dài chỉ số 12.',
    enSummary: "Read exact hours when the minute hand points to 12 (o'clock).",
    vocab: [
      { vi: 'Đồng hồ', en: 'Clock', pronounce: 'c-lóc', exampleVi: 'Đồng hồ treo tường', exampleEn: 'Wall clock', icon: '⏰' },
      { vi: 'Giờ đúng', en: "O'clock", pronounce: 'ơ c-lóc', exampleVi: '8 giờ đúng', exampleEn: "8 o'clock", icon: '🕗' },
      { vi: 'Kim ngắn (kim giờ)', en: 'Hour hand', pronounce: 'au-ơ han-d', exampleVi: 'Kim ngắn chỉ số 7 là 7 giờ', exampleEn: 'Short hand points to 7', icon: '🕐' },
      { vi: 'Kim dài (kim phút)', en: 'Minute hand', pronounce: 'mi-nịt han-d', exampleVi: 'Kim dài chỉ số 12', exampleEn: 'Long hand points to 12', icon: '🕛' },
    ],
    exploreConcept: {
      headingVi: 'Mặt đồng hồ kim quay tích tắc',
      headingEn: 'Tick-tock analog clock face',
      descriptionVi: 'Kéo kim ngắn đến các số: Khi kim dài chỉ số 12, kim ngắn chỉ số 8 tức là 8 giờ đúng!',
      descriptionEn: "When the minute hand points to 12, the hour hand tells the exact hour!",
      interactiveType: 'clock',
      defaultData: { hour: 8 }
    },
    robotGuide: {
      tipVi: 'Bé nhớ câu thần chú: Kim dài số 12, kim ngắn chỉ số nào thì đúng bấy nhiêu giờ!',
      tipEn: "Golden rule: Long hand at 12 = exact o'clock! Short hand shows the hour!",
      keyPoints: ['Kim ngắn là kim giờ', 'Kim dài chỉ số 12', '7 giờ sáng em thức dậy']
    },
    sampleQuestions: [
      {
        id: '34-1',
        type: 'choice',
        promptVi: 'Đồng hồ có kim dài chỉ số 12, kim ngắn chỉ số 9. Lúc đó là mấy giờ?',
        promptEn: 'Long hand points to 12, short hand points to 9. What time is it?',
        visualConfig: {
          mode: 'clock',
          hour: 9,
          minute: 0
        },
        options: ['9 giờ', '12 giờ', '3 giờ'],
        answer: '9 giờ',
        hintVi: 'Kim ngắn chỉ số 9.',
        hintEn: 'The short hand points at 9.',
        explanationVi: 'Lúc đó là 9 giờ đúng.',
        explanationEn: "It is 9 o'clock."
      }
    ],
    recommendedGameId: 'magic-clock'
  },
  {
    id: 35,
    volume: 2,
    topicId: 9,
    topicName: 'Thời gian. Giờ và lịch',
    title: 'Bài 35. Các ngày trong tuần',
    enTitle: 'Lesson 35. Days of the Week',
    summary: 'Một tuần lễ có 7 ngày: Thứ Hai, Thứ Ba, Thứ Tư, Thứ Năm, Thứ Sáu, Thứ Bảy, Chủ Nhật.',
    enSummary: 'A week has 7 days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.',
    vocab: [
      { vi: 'Thứ Hai', en: 'Monday', pronounce: 'măn-đây', exampleVi: 'Em chào cờ Thứ Hai', exampleEn: 'Monday flag ceremony', icon: '1️⃣' },
      { vi: 'Thứ Ba', en: 'Tuesday', pronounce: 'tiu-z-đây', exampleVi: 'Học Toán vui nhộn', exampleEn: 'Math adventure', icon: '2️⃣' },
      { vi: 'Thứ Tư', en: 'Wednesday', pronounce: 'oen-z-đây', exampleVi: 'Giữa tuần lễ', exampleEn: 'Midweek', icon: '3️⃣' },
      { vi: 'Thứ Năm', en: 'Thursday', pronounce: 'thơ-z-đây', exampleVi: 'Học tiếng Anh', exampleEn: 'English class', icon: '4️⃣' },
      { vi: 'Thứ Sáu', en: 'Friday', pronounce: 'f-rai-đây', exampleVi: 'Sinh hoạt cuối tuần', exampleEn: 'Friday class meeting', icon: '5️⃣' },
      { vi: 'Thứ Bảy', en: 'Saturday', pronounce: 'xát-tơ-đây', exampleVi: 'Bé đi công viên', exampleEn: 'Park visit', icon: '🎈' },
      { vi: 'Chủ Nhật', en: 'Sunday', pronounce: 'xăn-đây', exampleVi: 'Nghỉ ngơi cùng gia đình', exampleEn: 'Family day', icon: '☀️' },
    ],
    exploreConcept: {
      headingVi: 'Vòng quay 7 ngày trong tuần',
      headingEn: '7-Day wheel of the week',
      descriptionVi: 'Một tuần có 7 ngày. Em đi học từ Thứ Hai đến Thứ Sáu, nghỉ Thứ Bảy và Chủ Nhật!',
      descriptionEn: '5 school days and 2 weekend days make one full week!',
      interactiveType: 'clock',
      defaultData: { currentDay: 'Monday' }
    },
    robotGuide: {
      tipVi: 'Bé nhớ nhé: Sau Chủ Nhật lại bắt đầu một tuần mới bằng ngày Thứ Hai đấy!',
      tipEn: 'After Sunday, a brand new week begins with Monday!',
      keyPoints: ['Một tuần có đúng 7 ngày', 'Ngày đầu tuần là Thứ Hai', 'Hai ngày nghỉ cuối tuần là Thứ Bảy và Chủ Nhật']
    },
    sampleQuestions: [
      {
        id: '35-1',
        type: 'choice',
        promptVi: 'Một tuần lễ có bao nhiêu ngày?',
        promptEn: 'How many days are there in a week?',
        options: ['5 ngày', '6 ngày', '7 ngày', '8 ngày'],
        answer: '7 ngày',
        hintVi: 'Từ Thứ Hai đến Chủ Nhật có mấy ngày?',
        hintEn: 'Count Monday through Sunday.',
        explanationVi: 'Một tuần lễ có 7 ngày.',
        explanationEn: 'There are 7 days in a week.'
      },
      {
        id: '35-2',
        type: 'choice',
        promptVi: 'Nếu hôm nay là Thứ Năm thì ngày mai là thứ mấy?',
        promptEn: 'If today is Thursday, what day is tomorrow?',
        options: ['Thứ Tư', 'Thứ Sáu', 'Thứ Bảy'],
        answer: 'Thứ Sáu',
        hintVi: 'Liền sau Thứ Năm là ngày nào?',
        hintEn: 'What day comes after Thursday?',
        explanationVi: 'Ngày mai là Thứ Sáu.',
        explanationEn: 'Tomorrow is Friday.'
      }
    ],
    recommendedGameId: 'magic-clock'
  },
  {
    id: 36,
    volume: 2,
    topicId: 9,
    topicName: 'Thời gian. Giờ và lịch',
    title: 'Bài 36. Thực hành xem lịch và giờ',
    enTitle: 'Lesson 36. Calendar & Daily Clock Schedule',
    summary: 'Đọc tờ lịch bóc hàng ngày, nhận biết thứ và ngày trong tháng.',
    enSummary: 'Read daily calendars, matching dates and days with daily routines.',
    vocab: [
      { vi: 'Tờ lịch', en: 'Calendar page', pronounce: 'ca-lừn-đơ', exampleVi: 'Tờ lịch ghi ngày và thứ', exampleEn: 'Calendar shows day and date', icon: '📅' },
      { vi: 'Hôm qua, hôm nay, ngày mai', en: 'Yesterday, Today, Tomorrow', pronounce: 'dét-tơ-đây, tu-đây, tu-mo-râu', exampleVi: 'Hôm nay là ngày 20', exampleEn: 'Today is the 20th', icon: '📆' },
    ],
    exploreConcept: {
      headingVi: 'Lịch bóc của bé',
      headingEn: 'Daily tear-off calendar',
      descriptionVi: 'Xem tờ lịch: Số to ở giữa chỉ ngày, chữ ở dưới chỉ thứ trong tuần!',
      descriptionEn: 'Large number is the day date, label below is the weekday!',
      interactiveType: 'clock',
      defaultData: { showCalendar: true }
    },
    robotGuide: {
      tipVi: 'Mỗi sáng thức dậy, bé hãy tập xem tờ lịch trên tường cùng ba mẹ nhé!',
      tipEn: 'Check the calendar every morning with your family!',
      keyPoints: ['Số to là ngày', 'Chữ là thứ trong tuần']
    },
    sampleQuestions: [
      {
        id: '36-1',
        type: 'choice',
        promptVi: 'Em thường đi ngủ vào lúc mấy giờ tối?',
        promptEn: 'What time should a first grader go to sleep at night?',
        options: ['9 giờ tối', '12 giờ đêm', '2 giờ chiều'],
        answer: '9 giờ tối',
        hintVi: 'Học sinh lớp 1 nên đi ngủ sớm lúc 9 giờ tối để có sức khỏe tốt!',
        hintEn: '9 o clock is a great bedtime for kids!',
        explanationVi: '9 giờ tối là giờ đi ngủ hợp lý.',
        explanationEn: "9 o'clock at night is the proper bedtime."
      }
    ],
    recommendedGameId: 'magic-clock'
  },
  {
    id: 37,
    volume: 2,
    topicId: 9,
    topicName: 'Thời gian. Giờ và lịch',
    title: 'Bài 37. Luyện tập chung',
    enTitle: 'Lesson 37. Time & Calendar Review',
    summary: 'Ôn tập đồng hồ và lịch, sắp xếp thời gian biểu hoạt động hàng ngày.',
    enSummary: 'Review time, clock reading, and daily schedules.',
    vocab: [
      { vi: 'Thời gian biểu', en: 'Daily schedule', pronounce: 'x-kê-diu-ồ', exampleVi: 'Thời gian biểu trong ngày', exampleEn: 'Daily schedule', icon: '📋' },
    ],
    exploreConcept: {
      headingVi: 'Một ngày vui vẻ của Robot',
      headingEn: 'A joyful day of Robot',
      descriptionVi: '7 giờ sáng đến trường, 11 giờ ăn trưa, 5 giờ chiều đá bóng!',
      descriptionEn: '7 am school, 11 am lunch, 5 pm soccer!',
      interactiveType: 'clock',
      defaultData: { scheduleHour: 7 }
    },
    robotGuide: {
      tipVi: 'Biết xem giờ giúp bé luôn đúng giờ và sắp xếp thời gian học tập thật khoa học!',
      tipEn: 'Knowing time helps you stay punctual and organize your day like a pro!',
      keyPoints: ['Luyện xem cả giờ và thứ']
    },
    sampleQuestions: [
      {
        id: '37-1',
        type: 'choice',
        promptVi: 'Nếu hôm qua là Chủ Nhật thì hôm nay là thứ mấy?',
        promptEn: 'If yesterday was Sunday, what day is today?',
        options: ['Thứ Hai', 'Thứ Bảy', 'Thứ Ba'],
        answer: 'Thứ Hai',
        hintVi: 'Ngày bắt đầu tuần học mới ngay sau Chủ Nhật.',
        hintEn: 'The first day of the week after Sunday.',
        explanationVi: 'Hôm nay là Thứ Hai.',
        explanationEn: 'Today is Monday.'
      }
    ],
    recommendedGameId: 'magic-clock'
  },

  // --- TẬP 2 (Chủ đề 10: Ôn tập cuối năm) ---
  {
    id: 38,
    volume: 2,
    topicId: 10,
    topicName: 'Ôn tập cuối năm',
    title: 'Bài 38. Ôn tập các số và phép tính trong phạm vi 10',
    enTitle: 'Lesson 38. Year-End Review: Numbers & Operations to 10',
    summary: 'Ôn luyện vững chắc bảng cộng, bảng trừ và so sánh các số trong phạm vi 10.',
    enSummary: 'Consolidate numbers, addition, and subtraction within 10.',
    vocab: [
      { vi: 'Ôn tập', en: 'Review', pronounce: 'ri-viu', exampleVi: 'Ôn tập cuối năm', exampleEn: 'Year-end review', icon: '🎓' },
    ],
    exploreConcept: {
      headingVi: 'Bảng cộng trừ vàng trong phạm vi 10',
      headingEn: 'Golden addition and subtraction table to 10',
      descriptionVi: 'Kiểm tra tốc độ tính nhẩm trong phạm vi 10 cùng Robot!',
      descriptionEn: 'Test your mental math speed within 10 with Robot!',
      interactiveType: 'addition-bar',
      defaultData: { a: 9, b: 4, op: '-' }
    },
    robotGuide: {
      tipVi: 'Bé hãy cố gắng tính nhẩm thật nhanh mà không cần dùng đến ngón tay nhé!',
      tipEn: 'Try calculating mentally without using your fingers!',
      keyPoints: ['Thuộc bảng cộng trừ trong phạm vi 10 là chìa khóa của mọi bài toán!']
    },
    sampleQuestions: [
      {
        id: '38-1',
        type: 'fill',
        promptVi: 'Tính: 10 - 7 + 4 = ?',
        promptEn: 'Calculate: 10 - 7 + 4 = ?',
        options: [5, 6, 7, 8],
        answer: 7,
        hintVi: '10 - 7 = 3; 3 + 4 = ?',
        hintEn: '10 - 7 = 3; 3 + 4 = ?',
        explanationVi: '10 - 7 + 4 = 7.',
        explanationEn: '10 - 7 + 4 = 7.'
      }
    ],
    recommendedGameId: 'math-racing'
  },
  {
    id: 39,
    volume: 2,
    topicId: 10,
    topicName: 'Ôn tập cuối năm',
    title: 'Bài 39. Ôn tập các số và phép tính trong phạm vi 100',
    enTitle: 'Lesson 39. Year-End Review: Numbers & Operations to 100',
    summary: 'Ôn tập các số đến 100, cấu tạo số, so sánh số và cộng trừ không nhớ trong phạm vi 100.',
    enSummary: 'Review two-digit operations and place values up to 100.',
    vocab: [
      { vi: 'Thành thạo', en: 'Proficient / Master', pronounce: 'ma-x-tơ', exampleVi: 'Bé đã thành thạo cộng trừ', exampleEn: 'You mastered addition & subtraction', icon: '👑' },
    ],
    exploreConcept: {
      headingVi: 'Đường đua tính nhanh đến 100',
      headingEn: 'Speed calculation to 100',
      descriptionVi: 'Cộng trừ các số có hai chữ số siêu tốc!',
      descriptionEn: 'Speed calculation of two-digit numbers!',
      interactiveType: 'tens-ones',
      defaultData: { tens1: 5, ones1: 4, tens2: 2, ones2: 3 }
    },
    robotGuide: {
      tipVi: 'Bé nhớ tính từ hàng đơn vị sang hàng chục nhé: 54 + 23 = 77!',
      tipEn: 'Always add ones first, then tens: 54 + 23 = 77!',
      keyPoints: ['Đơn vị tính với đơn vị', 'Chục tính với chục']
    },
    sampleQuestions: [
      {
        id: '39-1',
        type: 'fill',
        promptVi: 'Tính: 65 - 23 = ?',
        promptEn: 'Calculate: 65 - 23 = ?',
        options: [41, 42, 43, 44],
        answer: 42,
        hintVi: '5 - 3 = 2; 6 - 2 = 4 -> 42.',
        hintEn: '5 - 3 = 2; 6 - 2 = 4 -> 42.',
        explanationVi: '65 - 23 = 42.',
        explanationEn: '65 - 23 = 42.'
      }
    ],
    recommendedGameId: 'rabbit-river'
  },
  {
    id: 40,
    volume: 2,
    topicId: 10,
    topicName: 'Ôn tập cuối năm',
    title: 'Bài 40. Ôn tập hình học và đo lường',
    enTitle: 'Lesson 40. Year-End Review: Geometry & Measurement',
    summary: 'Tổng kết hình phẳng, hình khối, đo độ dài xăng-ti-mét, xem giờ và xem lịch.',
    enSummary: 'Comprehensive review of shapes, measurements, clocks, and calendars.',
    vocab: [
      { vi: 'Đo lường', en: 'Measurement', pronounce: 'me-giơ-mừn-t', exampleVi: 'Đo lường độ dài và thời gian', exampleEn: 'Measure length and time', icon: '📏' },
    ],
    exploreConcept: {
      headingVi: 'Công viên toán học kỳ quan',
      headingEn: 'Wonder math park',
      descriptionVi: 'Nhận biết các hình khối của lâu đài và xem đồng hồ cổng thành!',
      descriptionEn: 'Spot castle shapes and check the fortress gate clock!',
      interactiveType: 'shape-shelf',
      defaultData: { finale: true }
    },
    robotGuide: {
      tipVi: 'Bé đã học được rất nhiều kiến thức hình học và đo lường bổ ích trong năm học lớp 1 này!',
      tipEn: 'You have learned so much about shapes and measurement this year!',
      keyPoints: ['Hình phẳng và hình khối', 'Đo xăng-ti-mét và xem giờ đúng']
    },
    sampleQuestions: [
      {
        id: '40-1',
        type: 'choice',
        promptVi: 'Đơn vị đo độ dài đã học ở lớp 1 là gì?',
        promptEn: 'What length unit did we learn in Grade 1?',
        options: ['Xăng-ti-mét (cm)', 'Ki-lô-mét (km)', 'Lít (l)'],
        answer: 'Xăng-ti-mét (cm)',
        hintVi: 'Viết tắt là cm.',
        hintEn: 'Abbreviated as cm.',
        explanationVi: 'Đơn vị đo độ dài là xăng-ti-mét (cm).',
        explanationEn: 'The unit is centimeter (cm).'
      }
    ],
    recommendedGameId: 'geometry-explorer'
  },
  {
    id: 41,
    volume: 2,
    topicId: 10,
    topicName: 'Ôn tập cuối năm',
    title: 'Bài 41. Ôn tập chung',
    enTitle: 'Lesson 41. Grand Finale Review & Graduation',
    summary: 'Bài ôn tập chung toàn bộ chương trình Toán lớp 1 Kết nối tri thức với cuộc sống!',
    enSummary: 'Grand final review of all Grade 1 Math concepts and graduation celebration!',
    vocab: [
      { vi: 'Chúc mừng tốt nghiệp', en: 'Congratulations Graduate!', pronounce: 'cơn-g-rát-tu-lây-sừn', exampleVi: 'Chúc mừng bé hoàn thành xuất sắc lớp 1', exampleEn: 'Congratulations on finishing Grade 1!', icon: '🎓' },
    ],
    exploreConcept: {
      headingVi: 'Đại hội toán học cấp tiểu học',
      headingEn: 'Primary math grand championship',
      descriptionVi: 'Chinh phục huy hiệu cao quý nhất của Vương Quốc Toán Học Song Ngữ!',
      descriptionEn: 'Claim the highest badge of the Bilingual Math Kingdom!',
      interactiveType: 'addition-bar',
      defaultData: { a: 50, b: 50, op: '+' }
    },
    robotGuide: {
      tipVi: 'Robot và các bạn động vật rất tự hào về bé! Chúc bé bước vào lớp 2 luôn tự tin và yêu thích môn Toán!',
      tipEn: 'Robot and all forest friends are proud of you! Ready to shine in Grade 2!',
      keyPoints: ['Vững vàng các số đến 100', 'Cộng trừ nhanh nhẹn', 'Yêu thích học tiếng Anh mỗi ngày']
    },
    sampleQuestions: [
      {
        id: '41-1',
        type: 'fill',
        promptVi: 'Tính: 50 + 50 = ?',
        promptEn: 'Calculate: 50 + 50 = ?',
        options: [80, 90, 100, 70],
        answer: 100,
        hintVi: '5 chục + 5 chục = 10 chục (100).',
        hintEn: '5 tens + 5 tens = 10 tens (100).',
        explanationVi: '50 + 50 = 100.',
        explanationEn: '50 + 50 = 100.'
      }
    ],
    recommendedGameId: 'treasure-cipher'
  }
];

// Rich metadata for the 10 games specified in Section VII
export const GAMES_CATALOG: GameMetadata[] = [
  // --- 2 TRÒ CHƠI THUỘC KHU 6: XƯỞNG ĐO LƯỜNG TÍ HON ---
  {
    id: 'magic-ruler',
    categoryId: 'zone-6-measurement',
    nameVi: 'Thước Thần Đo Vật',
    nameEn: 'Magic Ruler Measuring',
    taglineVi: 'Đọc độ dài đồ vật chính xác trên thước xăng-ti-mét (cm) từ vạch 0!',
    taglineEn: 'Read object lengths in centimeters accurately on the ruler from mark 0!',
    icon: '📏',
    themeColor: 'from-amber-500 to-orange-500',
    bgGradient: 'from-amber-50 via-orange-50 to-yellow-100',
    storyVi: 'Xưởng đo lường tí hon cần bé giúp đo các dụng cụ học tập dễ thương bằng chiếc thước thần xăng-ti-mét. Hãy xem đầu kia của vật chỉ đúng vào vạch số mấy nhé!',
    storyEn: 'Help measure adorable stationary items using the magic centimeter ruler! Check which tick mark the object reaches.',
    instructionsVi: 'Quan sát một đầu vật ở vạch 0 -> Đọc số cm ở đầu còn lại -> Chạm vào đáp án đúng!',
    instructionsEn: 'Check object starting at mark 0 -> Read the number at the other end -> Tap matching answer!',
    rewardType: 'badge',
    badgeName: 'Bậc Thầy Đo Lường',
    relatedTopicIds: [7, 10]
  },
  {
    id: 'who-is-longer',
    categoryId: 'zone-6-measurement',
    nameVi: 'Ai Dài Hơn?',
    nameEn: 'Who Is Longer?',
    taglineVi: 'So sánh độ dài hai đồ vật: dài hơn, ngắn hơn hoặc bằng nhau từ vạch xuất phát chuẩn!',
    taglineEn: 'Compare lengths of two objects: longer, shorter, or equal with common starting point!',
    icon: '📐',
    themeColor: 'from-orange-500 to-amber-600',
    bgGradient: 'from-orange-50 via-amber-50 to-yellow-100',
    storyVi: 'Các dụng cụ học tập trong xưởng tí hon đang thi tài xem ai dài hơn, ngắn hơn! Hai bạn nhỏ đã xếp thẳng hàng ở vạch xuất phát, bé hãy quan sát và tìm câu trả lời nhé!',
    storyEn: 'Friendly school supplies are competing to see who is longer! Aligned at the starting line, observe and pick the right answer!',
    instructionsVi: 'Quan sát hai vật cùng vạch xuất phát -> Xem vật nào vươn xa hơn -> Chạm vào đáp án chính xác!',
    instructionsEn: 'Observe objects from the baseline -> See which reaches farther -> Tap the correct choice!',
    rewardType: 'star',
    badgeName: 'Nhà Thám Hiểm Đo Độ Dài',
    relatedTopicIds: [7, 10]
  },
  // --- 2 GAME THUỘC KHU 1: LÂU ĐÀI NHỮNG CON SỐ ---
  {
    id: 'train-journey',
    categoryId: 'zone-1-numbers',
    nameVi: 'Đoàn Tàu Xuyên Vương Quốc',
    nameEn: 'Kingdom Train Journey',
    taglineVi: 'Khám phá 5 thử thách toa tàu: điền số, sắp xếp, nhận biết hàng chục và so sánh số!',
    taglineEn: 'Explore 5 diverse train challenges: missing cars, sorting, tens/ones, and comparison!',
    icon: '🚂',
    themeColor: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-50 via-orange-50 to-yellow-100',
    storyVi: 'Đoàn tàu tốc hành xuyên vương quốc cần vượt qua 5 thử thách số học đặc sắc! Bé hãy giúp bác lái tàu hoàn thiện các toa tàu để khởi hành nhé!',
    storyEn: 'The kingdom express needs to complete 5 math challenges! Help the conductor assemble carriages to depart!',
    instructionsVi: 'Thử thách 1: Toa tàu bí mật -> Thử thách 2: Đổi chỗ toa tàu -> Thử thách 3: Ga tàu hàng chục -> Thử thách 4: Đường ray so sánh -> Thử thách 5: Chuyến tàu về đích!',
    instructionsEn: 'Station 1: Missing car -> Station 2: Sorting cars -> Station 3: Tens and ones -> Station 4: Comparison -> Station 5: Final station!',
    rewardType: 'badge',
    badgeName: 'Trưởng Tàu Tài Ba',
    relatedTopicIds: [1, 6, 10]
  },
  {
    id: 'bundled-sticks',
    categoryId: 'zone-1-numbers',
    nameVi: 'Nhà Máy Bó Que Tính',
    nameEn: 'Magic Stick Bundle Factory',
    taglineVi: 'Đóng gói que tính thành các bó Chục và Đơn Vị theo đúng đơn hàng!',
    taglineEn: 'Pack counting sticks into Tens bundles and Ones to fulfill factory orders!',
    icon: '🥢',
    themeColor: 'from-yellow-500 to-amber-600',
    bgGradient: 'from-yellow-50 via-amber-50 to-orange-100',
    storyVi: 'Nhà máy phép thuật đang sản xuất que tính học tập. Bé hãy giúp Robot xếp đúng số bó chục và que đơn vị cho từng kiện hàng!',
    storyEn: 'Help Robot bundle sticks into Tens and Ones according to factory orders!',
    instructionsVi: 'Quan sát số cần đóng gói ở khung nhiệm vụ -> Bấm + hoặc - để xếp bó chục và que lẻ -> Bấm ĐÓNG GÓI KIỆN HÀNG!',
    instructionsEn: 'View target number -> Use + / - to add bundles and sticks -> Tap PACK ORDER!',
    rewardType: 'badge',
    badgeName: 'Chuyên Viên Đóng Gói',
    relatedTopicIds: [6, 10]
  },
  // --- 2 GAME MỚI THUỘC KHU 2: KHU RỪNG PHÉP TÍNH ---
  {
    id: 'sibling-cards',
    categoryId: 'zone-2-operations',
    nameVi: 'Cặp Thẻ Anh Em',
    nameEn: 'Sibling Math Cards',
    taglineVi: 'Lật thẻ tìm cặp phép tính và kết quả, ghi nhớ thông minh qua 5 vòng rừng xanh!',
    taglineEn: 'Flip and match math equations with results through 5 fun forest memory rounds!',
    icon: '🎴',
    themeColor: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 via-teal-50 to-green-100',
    storyVi: 'Những chiếc thẻ bài ma thuật của khu rừng xanh bị úp lại dưới bóng cây. Bé hãy lật và ghép các cặp thẻ anh em có cùng kết quả để khám phá bí mật rừng xanh nhé!',
    storyEn: 'Magic cards in the green forest are face down. Flip and match sibling cards with identical math values!',
    instructionsVi: 'Chạm lật thẻ thứ nhất -> Chạm lật thẻ thứ hai -> Ghép đúng cặp phép tính và kết quả -> Hoàn thành 5 vòng!',
    instructionsEn: 'Tap first card -> Tap second card -> Match equation with result -> Complete 5 rounds!',
    rewardType: 'star',
    badgeName: 'Bậc Thầy Cặp Thẻ',
    relatedTopicIds: [2, 3, 8]
  },
  {
    id: 'forest-rescue',
    categoryId: 'zone-2-operations',
    nameVi: 'Hành Trình Giải Cứu Rừng Xanh',
    nameEn: 'Forest Rescue Journey',
    taglineVi: 'Giúp thỏ qua cầu, tìm số sau lá, mở đường mòn, cứu sóc con và mở rương kho báu!',
    taglineEn: 'Help rabbit cross the bridge, reveal hidden leaf numbers, rescue squirrels and unlock chests!',
    icon: '🌲',
    themeColor: 'from-lime-500 to-emerald-600',
    bgGradient: 'from-lime-50 via-emerald-50 to-teal-100',
    storyVi: 'Khu rừng xanh đang cần hiệp sĩ toán học! Hãy vượt qua 5 trạm thử thách đa dạng: qua cầu gỗ, lật lá bí mật, chọn đường mòn, cứu bạn sóc và mở rương kho báu!',
    storyEn: 'The green forest needs a math hero! Conquer 5 diverse interactive stations to rescue forest friends!',
    instructionsVi: 'Trạm 1: Giúp thỏ qua cầu -> Trạm 2: Tìm số sau lá -> Trạm 3: Chọn phép tính đúng -> Trạm 4: Nhập sửa kết quả -> Trạm 5: Giải toán có lời văn!',
    instructionsEn: 'Station 1: Bridge math -> Station 2: Leaf reveal -> Station 3: Trail paths -> Station 4: Rescue squirrel -> Station 5: Word problem chest!',
    rewardType: 'badge',
    badgeName: 'Hiệp Sĩ Rừng Xanh',
    relatedTopicIds: [2, 3, 8]
  },
  // --- 10 TRÒ CHƠI GỐC HIỆN CÓ ĐƯỢC GIỮ NGUYÊN 100% ---
  {
    id: 'rabbit-river',
    categoryId: '',
    nameVi: 'Thỏ Con Vượt Suối',
    nameEn: 'Rabbit River Adventure',
    taglineVi: 'Giúp thỏ con nhảy qua các hòn đá suối để về nhà và nhận cà rốt!',
    taglineEn: 'Help little rabbit jump across river stepping stones to get home!',
    icon: '🐰',
    themeColor: 'from-emerald-400 to-teal-500',
    bgGradient: 'from-emerald-50 via-teal-50 to-sky-100',
    storyVi: 'Trời sắp tối rồi, thỏ con đang ở bên kia dòng suối mát lành. Hãy giải đúng các phép tính để kích hoạt những hòn đá thần kỳ, giúp thỏ nhảy an toàn về ngôi nhà ấm áp nhé!',
    storyEn: 'It is almost dusk! Little rabbit needs to hop across river stones. Solve math calculations to power up stepping stones and bring rabbit home with crunchy carrots!',
    instructionsVi: 'Nhìn phép tính trên hòn đá tiếp theo -> Chọn hoặc nhập đáp án đúng -> Thỏ sẽ nhảy vút sang hòn đá đó!',
    instructionsEn: 'Solve the math problem on the next stone -> Tap correct answer -> Watch rabbit leap forward!',
    rewardType: 'carrot',
    badgeName: 'Thỏ Con Nhanh Trí',
    relatedTopicIds: [1, 3, 8]
  },
  {
    id: 'number-train',
    categoryId: '',
    nameVi: 'Đoàn Tàu Số',
    nameEn: 'Number Train Master',
    taglineVi: 'Ghép đúng các toa tàu theo thứ tự số để tàu khởi hành ra ga!',
    taglineEn: 'Assemble numbered carriages in sequence so the steam train can depart!',
    icon: '🚂',
    themeColor: 'from-amber-400 to-orange-500',
    bgGradient: 'from-amber-50 via-orange-50 to-yellow-100',
    storyVi: 'Đoàn tàu tốc hành chở các bạn thú chuẩn bị khởi hành, nhưng các toa tàu số đang bị xếp lộn xộn. Bé hãy giúp bác lái tàu xếp đúng thứ tự các toa tàu nhé!',
    storyEn: 'The express train is ready to leave the colorful station, but train cars are scattered. Help the conductor place carriages in the correct numerical order!',
    instructionsVi: 'Kéo thả các toa tàu số vào vị trí còn thiếu trên đường ray -> Khi đủ toa, tàu sẽ hú còi và lăn bánh!',
    instructionsEn: 'Place the missing numbered carriages onto the train -> Once complete, hear the whistle and watch it roll!',
    rewardType: 'badge',
    badgeName: 'Number Train Master',
    relatedTopicIds: [1, 6, 10]
  },
  {
    id: 'geometry-explorer',
    categoryId: 'zone-3-geometry',
    nameVi: 'Nhà Thám Hiểm Hình Học',
    nameEn: 'Geometry Explorer',
    taglineVi: 'Nhận biết hình vuông, tam giác, chữ nhật, đếm hình và thử thách mắt tinh!',
    taglineEn: 'Identify squares, triangles, rectangles, count shapes and spot geometric objects!',
    icon: '📐',
    themeColor: 'from-purple-500 to-indigo-600',
    bgGradient: 'from-purple-50 via-indigo-50 to-pink-100',
    storyVi: 'Khám phá thế giới hình phẳng sắc nét và chính xác khoa học! Bé sẽ cùng thám hiểm tìm hình vuông, đếm tam giác, phát hiện hình khác loại và tìm hình trong tranh!',
    storyEn: 'Explore scientifically accurate 2D shapes! Identify squares, count triangles, find odd shapes and spot hidden geometry!',
    instructionsVi: 'Chạm chọn hình đúng yêu cầu -> Đếm số lượng -> Phân loại hình học -> Tìm đủ các hình trong tranh!',
    instructionsEn: 'Tap correct shapes -> Count quantities -> Classify geometry -> Find shapes in picture!',
    rewardType: 'badge',
    badgeName: 'Nhà Thám Hiểm Hình Học',
    relatedTopicIds: [2, 4, 10]
  },
  {
    id: 'magic-shape-workshop',
    categoryId: 'zone-3-geometry',
    nameVi: 'Xưởng Ghép Hình Kỳ Diệu',
    nameEn: 'Magic Shape Workshop',
    taglineVi: 'Ghép tam giác theo mẫu, hoàn thiện xe tải, xây nhà, ghép thuyền buồm và hình vuông lớn!',
    taglineEn: 'Fit shapes into frames, complete trucks, build houses, sail boats and construct big squares!',
    icon: '🧩',
    themeColor: 'from-pink-500 to-rose-600',
    bgGradient: 'from-pink-50 via-rose-50 to-purple-100',
    storyVi: 'Xưởng lắp ghép hình học kỳ thú! Bé sẽ hóa thân thành thợ ghép tài hoa, lắp mảnh tam giác, hoàn thiện xe tải, ghép nhà thân vuông mái tam giác, dựng thuyền buồm và ghép hình vuông lớn!',
    storyEn: 'The magical shape workshop is open! Fit triangles, finish cargo trucks, build houses, sails and combine 4 small squares into a big square!',
    instructionsVi: 'Chọn mảnh ghép đúng -> Lắp vào khung mẫu -> Khớp cạnh chính xác -> Hoàn thành tác phẩm!',
    instructionsEn: 'Select correct piece -> Fit into frame -> Align edges perfectly -> Complete creation!',
    rewardType: 'trophy',
    badgeName: 'Bậc Thầy Ghép Hình',
    relatedTopicIds: [2, 4, 10]
  },
  {
    id: 'math-racing',
    categoryId: 'zone-7-racing',
    nameVi: 'Tay Đua Phép Tính',
    nameEn: 'Calculation Racer',
    taglineVi: 'Đổi làn, ghép cặp tiếp sức, sửa pit-stop, gõ phím số và giải toán có lời văn để về đích!',
    taglineEn: 'Change lanes, pair calculations, fix pit-stop, type speed keys and solve word problems!',
    icon: '🏎️',
    themeColor: 'from-red-500 to-amber-500',
    bgGradient: 'from-red-50 via-amber-50 to-orange-100',
    storyVi: 'Đại hội đua xe siêu tốc của vương quốc đã bắt đầu! Động cơ của xe chạy bằng năng lượng phép tính. Mỗi câu trả lời đúng sẽ kích hoạt Turbo tăng tốc vượt qua các đối thủ!',
    storyEn: 'The Grand Prix has begun! Your engine is fueled by math prowess. Each correct solution ignites turbo speed to overtake rival racers!',
    instructionsVi: 'Giải phép tính càng nhanh thì xe càng phóng nhanh -> Vượt qua 5 khúc cua để cán vạch đích và nhận cúp vàng!',
    instructionsEn: 'Solve calculations promptly -> Speed up along curves -> Cross the finish line to lift the Golden Cup!',
    rewardType: 'trophy',
    badgeName: 'Tay Đua Cự Phách',
    relatedTopicIds: [3, 4, 8, 10]
  },
  {
    id: 'duong-dua-tong-hop',
    categoryId: 'zone-7-racing',
    nameVi: 'Đường Đua Toán Học Tổng Hợp',
    nameEn: 'Comprehensive Race Track',
    taglineVi: 'Chinh phục 5 chặng đua: Biển báo hình học, Đo thước cm, Xem giờ đồng hồ, Ghép chục - đơn vị và Bài toán lời văn!',
    taglineEn: 'Conquer 5 track stages: Geometry signs, cm ruler, clock time, tens-ones pairs, and race word problems!',
    icon: '🏆',
    themeColor: 'from-orange-500 to-red-600',
    bgGradient: 'from-orange-50 via-amber-50 to-red-100',
    storyVi: 'Đại hội đua xe tổng hợp quy tụ tất cả các kỹ năng toán học lớp 1 đỉnh cao. Bé hãy vượt qua 5 chặng thử thách để trở thành Quán Quân Đường Đua!',
    storyEn: 'The comprehensive Grand Prix brings together all first-grade math skills. Conquer all 5 stages to become the Track Champion!',
    instructionsVi: 'Nhận diện biển báo hình học -> Đo độ dài thanh ray cm -> Đọc giờ kim đồng hồ -> Ghép số chục và đơn vị -> Giải bài toán có lời văn về đích!',
    instructionsEn: 'Identify geometry signs -> Measure rail in cm -> Read clock time -> Match tens and ones -> Solve word problems to the finish line!',
    rewardType: 'trophy',
    badgeName: 'Quán Quân Đường Đua',
    relatedTopicIds: [2, 7, 9, 10]
  },
  {
    id: 'penguin-fishing',
    categoryId: '',
    nameVi: 'Cánh Cụt Câu Cá',
    nameEn: 'Penguin Ice Fishing',
    taglineVi: 'Thả cần câu bắt đúng những chú cá mang số thích hợp dưới hồ băng!',
    taglineEn: 'Cast your fishing line into the icy pond to catch the right numbered fish!',
    icon: '🐧',
    themeColor: 'from-cyan-400 to-blue-600',
    bgGradient: 'from-cyan-50 via-blue-50 to-indigo-100',
    storyVi: 'Ở đảo băng tuyết, gia đình chim cánh cụt đang chuẩn bị bữa tiệc cá tươi ngon. Chú chim cánh cụt cần câu những con cá có ghi số hoặc kết quả đúng theo yêu cầu!',
    storyEn: 'On the snowy iceberg, little penguin needs delicious fish. Cast the fishing rod and pull up the target numbered fish into the bucket!',
    instructionsVi: 'Đọc yêu cầu nhiệm vụ -> Nhấp vào chú cá bơi lội có số phù hợp -> Cần câu sẽ kéo cá lên giỏ!',
    instructionsEn: 'Read the quest -> Tap the swimming fish matching the math clue -> Reel it up into your basket!',
    rewardType: 'fish',
    badgeName: 'Vua Câu Cá',
    relatedTopicIds: [1, 3, 6]
  },
  {
    id: 'treasure-cipher',
    categoryId: 'zone-8-treasure',
    nameVi: 'Giải Mã Kho Báu Bí Ẩn',
    nameEn: 'Mystery Treasure Cipher',
    taglineVi: 'Vượt qua 5 thử thách toán học và nhập mã số 3 chữ số để mở rương báu!',
    taglineEn: 'Conquer 5 math challenges and enter the 3-digit cipher to open the chest!',
    icon: '💎',
    themeColor: 'from-amber-400 to-yellow-600',
    bgGradient: 'from-amber-50 via-yellow-50 to-orange-100',
    storyVi: 'Hang động bí mật trên Đảo Kho Báu cất giấu chiếc rương vàng với ổ khóa mật mã 3 chữ số. Bé hãy chinh phục 5 thử thách toán để tìm ra 3 con số chìa khóa mở rương nhé!',
    storyEn: 'A secret cave hides a golden chest with a 3-digit combination lock. Solve 5 math challenges to decrypt the cipher!',
    instructionsVi: 'Chạm chọn đáp án đúng -> Ghép nối rương -> Sửa lỗi phép tính -> Nhập mã số 3 chữ số mở rương báu!',
    instructionsEn: 'Select answers -> Match chests -> Fix equations -> Enter 3-digit cipher to open the chest!',
    rewardType: 'key',
    badgeName: 'Bậc Thầy Giải Mã',
    relatedTopicIds: [1, 5, 6, 8, 10]
  },
  {
    id: 'bridge-builder',
    categoryId: 'zone-4-clock',
    nameVi: 'Kỹ Sư Xây Cầu Thần Kỳ',
    nameEn: 'Magic Bridge Builder Engineer',
    taglineVi: 'Dùng thước đo cm, căn vạch 0 và chọn thanh gỗ chuẩn xác để cùng Hải Ly sửa cầu cứu các bạn thú!',
    taglineEn: 'Measure sticks in cm, align zero-mark, and build the magic bridge with Beaver Engineer!',
    icon: '🌉',
    themeColor: 'from-amber-500 to-emerald-600',
    bgGradient: 'from-amber-50 via-teal-50 to-emerald-100',
    storyVi: 'Một trận mưa lớn làm hỏng cây cầu qua suối. Kỹ sư Hải Ly cùng các bạn Thỏ, Sóc, Gấu cần sự giúp đỡ của bé! Hãy dùng thước đo chuẩn xăng-ti-mét và lắp các thanh gỗ hoàn thiện 5 nhịp cầu nhé!',
    storyEn: 'A storm broke the bridge! Help Beaver Engineer measure sticks in centimeters and build a sturdy bridge for bunny, squirrel, and bear!',
    instructionsVi: 'Kéo thước căn vạch 0 trùng mép gỗ -> Đọc số cm ở đầu còn lại -> Lắp thanh gỗ vào nhịp cầu!',
    instructionsEn: 'Align 0 mark with wood edge -> Read cm at right edge -> Install stick into bridge!',
    rewardType: 'badge',
    badgeName: 'Kỹ Sư Cầu Đường Nhí',
    relatedTopicIds: [7, 10]
  },
  {
    id: 'magic-clock',
    categoryId: 'zone-4-clock',
    nameVi: 'Đồng Hồ Phép Thuật',
    nameEn: 'Magic Clock Time Machine',
    taglineVi: 'Xoay kim đồng hồ và chọn đúng ngày giờ để kích hoạt cỗ máy thời gian!',
    taglineEn: 'Rotate clock hands and select the correct time to activate the Time Portal!',
    icon: '⏰',
    themeColor: 'from-violet-400 to-purple-600',
    bgGradient: 'from-violet-50 via-purple-50 to-fuchsia-100',
    storyVi: 'Cỗ máy thời gian cổ đại chỉ hoạt động khi bánh răng và kim đồng hồ chỉ đúng giờ hẹn bí mật. Hãy giúp Robot xoay kim đồng hồ và xếp lịch các ngày trong tuần!',
    storyEn: 'The ancient Time Portal only activates when clock gears align with the secret hour. Help Robot set the clock hands and organize weekly schedules!',
    instructionsVi: 'Kéo kim ngắn đồng hồ đến đúng giờ yêu cầu hoặc chọn đúng thứ trong tuần -> Cánh cổng thần kỳ sẽ phát sáng!',
    instructionsEn: 'Adjust the hour hand to match the target time -> Watch gears spin and the portal open!',
    rewardType: 'badge',
    badgeName: 'Chủ Nhân Thời Gian',
    relatedTopicIds: [9, 10]
  },
  {
    id: 'magic-time-train',
    categoryId: 'zone-4-clock',
    nameVi: 'Chuyến Tàu Thời Gian Kỳ Diệu',
    nameEn: 'Magic Time Train',
    taglineVi: 'Lái đoàn tàu Chibi đón các bạn thú tại 5 nhà ga đồng hồ đúng giờ!',
    taglineEn: 'Drive the Chibi train and pick up animal friends at 5 clock stations on time!',
    icon: '🚂',
    themeColor: 'from-amber-500 to-rose-600',
    bgGradient: 'from-amber-50 via-sky-50 to-indigo-100',
    storyVi: 'Đoàn tàu phép thuật đỏ vàng sẵn sàng xuất bến! Hãy quan sát đồng hồ kim tại các nhà ga để đón Thỏ, Sóc, Gấu và Mèo về nhà an toàn nhé!',
    storyEn: 'The red and gold magical train is departing! Check the analog clocks at each station to pick up Bunny, Squirrel, Bear, and Cat on time!',
    instructionsVi: 'Đọc câu hỏi giờ -> Bấm chọn nhà ga có đồng hồ chỉ giờ đúng -> Tàu sẽ lăn bánh đến ga đón bạn thú!',
    instructionsEn: 'Read the target time -> Tap the station with the matching clock -> Watch the train ride to pick up your friend!',
    rewardType: 'badge',
    badgeName: 'Bác Lái Tàu Thời Gian',
    relatedTopicIds: [9, 10]
  },
  {
    id: 'math-supermarket',
    categoryId: 'zone-5-supermarket',
    nameVi: 'Giỏ Hàng Thông Minh',
    nameEn: 'Smart Shopping Cart',
    taglineVi: 'Cho 8 quả táo vào giỏ, cộng cam, săn số lớn nhất, xếp kệ và tính tiền!',
    taglineEn: 'Pick apples into cart, add oranges, find greatest number, arrange shelf and calculate!',
    icon: '🛒',
    themeColor: 'from-sky-400 to-indigo-500',
    bgGradient: 'from-sky-50 via-indigo-50 to-blue-100',
    storyVi: 'Hôm nay siêu thị mở đợt thử thách thú vị! Bé hãy chọn đúng 8 quả táo vào giỏ, tính tổng số cam, tìm hộp quà lớn nhất, xếp hàng lên kệ và nhập kết quả phép cộng nhé!',
    storyEn: 'Help shop with the smart cart! Pick 8 apples, add oranges, find greatest number, order shelves and solve equations!',
    instructionsVi: 'Chọn đủ 8 táo vào giỏ -> Chọn kết quả cộng cam -> Tìm số lớn nhất -> Xếp từ bé đến lớn -> Nhập kết quả phép tính!',
    instructionsEn: 'Put 8 apples in cart -> Add oranges -> Pick greatest number -> Arrange from smallest to greatest -> Enter sum!',
    rewardType: 'badge',
    badgeName: 'Bậc Thầy Giỏ Hàng',
    relatedTopicIds: [1, 3, 6, 8]
  },
  {
    id: 'giant-turnip-farm',
    categoryId: 'zone-5-supermarket',
    nameVi: 'Thu Ngân Nhí Tài Ba',
    nameEn: 'Talented Little Cashier',
    taglineVi: 'Nhận biết hình học, đo chiều dài bút chì 8 cm, xem đồng hồ và thanh toán hóa đơn sữa!',
    taglineEn: 'Recognize shapes, measure 8 cm pencil, check clock time and solve milk carton invoice!',
    icon: '🧾',
    themeColor: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 via-teal-50 to-cyan-100',
    storyVi: 'Bé làm nhân viên thu ngân siêu thị tài ba! Nhận biết đồ vật hình tròn, đo chiều dài bút chì trên thước cm, xem giờ mở cửa đồng hồ, tính nhanh phép trừ và giải hóa đơn bí mật!',
    storyEn: 'Work as a star supermarket cashier! Find circular objects, measure pencil length, read clock hour and solve math invoices!',
    instructionsVi: 'Chọn vật hình tròn -> Đọc số đo bút chì -> Xem giờ đồng hồ -> Chọn kết quả phép trừ -> Nhập số hộp sữa còn lại!',
    instructionsEn: 'Select circle shape -> Read pencil cm -> Read clock time -> Pick subtraction result -> Enter remaining milk cartons!',
    rewardType: 'trophy',
    badgeName: 'Thu Ngân Nhí Tài Ba',
    relatedTopicIds: [2, 4, 7, 8, 9]
  },
  {
    id: 'treasure-hunt',
    categoryId: 'zone-8-treasure',
    nameVi: 'Hành Trình Săn Kho Báu',
    nameEn: 'Treasure Hunt Journey',
    taglineVi: 'Khám phá 5 địa điểm bí ẩn trên đảo: cầu đá, rừng hình học, cảng đo lường, tháp đồng hồ và rương báu!',
    taglineEn: 'Explore 5 mystery island checkpoints: stone bridge, geometry forest, measurement port, clock tower and grand chest!',
    icon: '🗺️',
    themeColor: 'from-teal-400 to-emerald-600',
    bgGradient: 'from-teal-50 via-emerald-50 to-sky-100',
    storyVi: 'Chuyến thám hiểm xuyên qua hòn đảo kỳ thú! Bé sẽ lần lượt bắc cầu đá số, mở cổng rừng hình học, đo độ dài chiếc bút chì tại bến cảng, xem giờ tháp đồng hồ và giải bài toán mở rương báu!',
    storyEn: 'An epic journey across the island! Bridge stones by number order, unlock geometry gates, measure lengths, read clock time and solve word problems!',
    instructionsVi: 'Xếp cầu đá từ bé đến lớn -> Chọn hình tam giác -> Đọc số đo cm -> Xem giờ đúng -> Giải toán mở rương!',
    instructionsEn: 'Step stones in order -> Pick triangle shape -> Read ruler cm -> Read exact hour -> Solve word problem!',
    rewardType: 'badge',
    badgeName: 'Nhà Thám Hiểm Đại Dương',
    relatedTopicIds: [2, 4, 6, 7, 9, 10]
  }
];

// Helper to generate dynamic practice questions for any lesson (delegates to curated 5-question packages)
export function generateQuestionsForLesson(lessonId: number, count: number = 5): Question[] {
  const pkg = getLessonQuestionsPackage(lessonId);
  return pkg.questions.slice(0, count);
}

function _unusedLegacyGenerateQuestions(lessonId: number, count: number = 10): Question[] {
  const lesson = LESSONS.find((l) => l.id === lessonId);
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    const qId = `${lessonId}_dyn_${i + 1}`;

    if (lessonId === 1) {
      // Numbers 0..5
      const num = Math.floor(Math.random() * 6);
      const types = ['count', 'fill'];
      const picked = types[i % types.length];
      if (picked === 'count') {
        questions.push({
          id: qId,
          type: 'count',
          promptVi: `Đếm xem trong đĩa có bao nhiêu quả táo?`,
          promptEn: `Count how many apples are on the plate:`,
          visualType: 'apples',
          visualCount: num,
          visualConfig: { mode: 'count', count: num, itemType: 'apple' },
          options: [Math.max(0, num - 1), num, num + 1, num + 2].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4),
          answer: num,
          hintVi: `Bé đếm từng quả từ 1 đến ${num}. Nếu đĩa trống là số 0!`,
          hintEn: `Count each apple. If empty, it's 0!`,
          explanationVi: `Có đúng ${num} quả táo.`,
          explanationEn: `There are exactly ${num} apples.`
        });
      } else {
        const next = Math.min(5, num + 1);
        questions.push({
          id: qId,
          type: 'fill',
          promptVi: `Số liền sau của số ${num} là số nào?`,
          promptEn: `What number comes immediately after ${num}?`,
          visualConfig: { mode: 'count', count: num, itemType: 'apple' },
          options: [num, next, next + 1, Math.max(0, num - 1)].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4),
          answer: next,
          hintVi: `Đếm ${num} rồi thêm 1 đơn vị nữa.`,
          hintEn: `Count ${num} then add 1 more.`,
          explanationVi: `Số liền sau của ${num} là ${next}.`,
          explanationEn: `The number right after ${num} is ${next}.`
        });
      }
    } else if (lessonId === 2) {
      // Numbers 6..10
      const num = 6 + Math.floor(Math.random() * 5); // 6..10
      questions.push({
        id: qId,
        type: 'count',
        promptVi: `Đếm xem có bao nhiêu chú cá đang bơi?`,
        promptEn: `Count how many fish are swimming:`,
        visualType: 'fish',
        visualCount: num,
        visualConfig: { mode: 'count', count: num, itemType: 'fish' },
        options: [num - 1, num, num + 1, num + 2].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4),
        answer: num,
        hintVi: `Bé đếm chậm rãi từng chú cá nhé!`,
        hintEn: `Count slowly and carefully!`,
        explanationVi: `Có tất cả ${num} chú cá.`,
        explanationEn: `There are ${num} fish.`
      });
    } else if (lessonId === 3) {
      // More, less, equal
      const a = Math.floor(Math.random() * 6) + 1;
      const b = Math.floor(Math.random() * 6) + 1;
      const ans = a > b ? 'Nhiều hơn' : a < b ? 'Ít hơn' : 'Bằng nhau';
      questions.push({
        id: qId,
        type: 'choice',
        promptVi: `Nhóm A có ${a} quả bóng, nhóm B có ${b} quả bóng. Nhóm A ... nhóm B?`,
        promptEn: `Group A has ${a} balls, Group B has ${b} balls. Group A is ... Group B?`,
        visualConfig: {
          mode: 'compare',
          compareA: { count: a, nameVi: 'Nhóm A', itemType: 'ball' },
          compareB: { count: b, nameVi: 'Nhóm B', itemType: 'ball' }
        },
        options: ['Nhiều hơn', 'Ít hơn', 'Bằng nhau'],
        answer: ans,
        hintVi: `So sánh ${a} và ${b}.`,
        hintEn: `Compare numbers ${a} and ${b}.`,
        explanationVi: `Nhóm A ${ans.toLowerCase()} nhóm B vì ${a} ${a > b ? '>' : a < b ? '<' : '='} ${b}.`,
        explanationEn: `Group A is ${ans} Group B.`
      });
    } else if (lessonId === 4) {
      // Compare <, >, =
      const a = Math.floor(Math.random() * 11);
      const b = Math.floor(Math.random() * 11);
      const sign = a > b ? '>' : a < b ? '<' : '=';
      questions.push({
        id: qId,
        type: 'compare',
        promptVi: `Chọn dấu thích hợp: ${a} ... ${b}`,
        promptEn: `Choose the correct sign: ${a} ... ${b}`,
        visualConfig: {
          mode: 'compare',
          compareA: { count: a, nameVi: `Số ${a}`, itemType: 'star' },
          compareB: { count: b, nameVi: `Số ${b}`, itemType: 'star' }
        },
        options: ['>', '<', '='],
        answer: sign,
        hintVi: `Mũi nhọn luôn quay về số nhỏ hơn!`,
        hintEn: `The point points to the smaller number!`,
        explanationVi: `${a} ${sign} ${b}`,
        explanationEn: `${a} ${sign} ${b}`
      });
    } else if (lessonId === 7 || lessonId === 8 || lessonId === 9) {
      // 2D Shapes identification with both Standard Shapes and Authentic Traffic Signs / Everyday Objects
      const questionPattern = i % 4;

      if (questionPattern === 0) {
        // Authentic Traffic Warning Sign (Triangle)
        questions.push({
          id: qId,
          type: 'choice',
          promptVi: 'Biển báo giao thông nguy hiểm dưới đây có dạng hình gì?',
          promptEn: 'What geometric shape is the traffic warning sign shown below?',
          visualConfig: {
            mode: 'traffic-sign',
            signType: 'warning_triangle',
            shapeType: 'triangle'
          },
          options: ['Hình tam giác', 'Hình tròn', 'Hình vuông', 'Hình chữ nhật'],
          answer: 'Hình tam giác',
          hintVi: 'Biển báo này có đúng 3 cạnh thẳng và 3 đỉnh nhọn.',
          hintEn: 'Look closely at the 3 sides and 3 corners.',
          explanationVi: 'Chính xác! Biển báo cảnh báo nguy hiểm này có dạng hình tam giác.',
          explanationEn: 'Correct! This traffic sign is a triangle.'
        });
      } else if (questionPattern === 1) {
        // Authentic Traffic Prohibition Sign (Circle)
        questions.push({
          id: qId,
          type: 'choice',
          promptVi: 'Biển báo cấm đi ngược chiều dưới đây có dạng hình gì?',
          promptEn: 'What shape is the prohibition traffic sign shown below?',
          visualConfig: {
            mode: 'traffic-sign',
            signType: 'prohibition_circle',
            shapeType: 'circle'
          },
          options: ['Hình tròn', 'Hình vuông', 'Hình tam giác', 'Hình chữ nhật'],
          answer: 'Hình tròn',
          hintVi: 'Biển báo này là một đường tròn cong kín, không có đỉnh nhọn.',
          hintEn: 'It has a smooth circular curve.',
          explanationVi: 'Chính xác! Biển báo cấm này có dạng hình tròn.',
          explanationEn: 'Correct! This prohibition sign is a circle.'
        });
      } else if (questionPattern === 2) {
        // Authentic Traffic Guide Sign (Square)
        questions.push({
          id: qId,
          type: 'choice',
          promptVi: 'Biển báo chỉ dẫn nơi đỗ xe (chữ P) dưới đây có dạng hình gì?',
          promptEn: 'What shape is the parking guide sign (P) shown below?',
          visualConfig: {
            mode: 'traffic-sign',
            signType: 'guide_square',
            shapeType: 'square'
          },
          options: ['Hình vuông', 'Hình tam giác', 'Hình tròn', 'Hình chữ nhật'],
          answer: 'Hình vuông',
          hintVi: 'Biển báo này có 4 cạnh bằng nhau và 4 góc vuông.',
          hintEn: 'It has 4 equal straight edges.',
          explanationVi: 'Chính xác! Biển chỉ dẫn này có dạng hình vuông.',
          explanationEn: 'Correct! This parking sign is a square.'
        });
      } else {
        // Standard geometric shape recognition
        const shapeCodes = ['square', 'circle', 'triangle', 'rectangle'] as const;
        const targetCode = shapeCodes[(i + 1) % shapeCodes.length];
        const namesVi: Record<string, string> = {
          square: 'hình vuông',
          circle: 'hình tròn',
          triangle: 'hình tam giác',
          rectangle: 'hình chữ nhật'
        };
        const namesEn: Record<string, string> = {
          square: 'square',
          circle: 'circle',
          triangle: 'triangle',
          rectangle: 'rectangle'
        };

        const shuffledOptions = ['circle', 'triangle', 'square', 'rectangle'].sort(() => Math.random() - 0.5);

        questions.push({
          id: qId,
          type: 'shape',
          promptVi: `Hình nào dưới đây là ${namesVi[targetCode]}?`,
          promptEn: `Which shape is a ${namesEn[targetCode]}?`,
          options: shuffledOptions,
          answer: targetCode,
          hintVi: targetCode === 'circle' ? 'Hình tròn là đường cong tròn, không có cạnh và góc.' : targetCode === 'triangle' ? 'Hình tam giác có đúng 3 cạnh thẳng và 3 đỉnh.' : targetCode === 'square' ? 'Hình vuông có đúng 4 cạnh bằng nhau và 4 góc vuông.' : 'Hình chữ nhật có 2 cạnh dài bằng nhau, 2 cạnh ngắn bằng nhau và 4 góc vuông.',
          hintEn: `Look for the ${namesEn[targetCode]}!`,
          explanationVi: `Chính xác! Đó là ${namesVi[targetCode]}.`,
          explanationEn: `Correct! That is a ${namesEn[targetCode]}.`
        });
      }
    } else if (lessonId === 10 || lessonId === 12 || (lessonId >= 17 && lessonId <= 20 && i % 2 === 0)) {
      // Addition to 10 with two distinct, complementary groups
      const a = Math.floor(Math.random() * 6);
      const b = Math.floor(Math.random() * (11 - a));
      const sum = a + b;

      const pairs = [
        { itemA: 'apple' as VisualObjectType, itemB: 'orange' as VisualObjectType, nameA: 'quả táo đỏ', nameB: 'quả cam vàng', totalName: 'quả', enCategory: 'fruits' },
        { itemA: 'flower_red' as VisualObjectType, itemB: 'flower_yellow' as VisualObjectType, nameA: 'bông hoa đỏ', nameB: 'bông hoa vàng', totalName: 'bông hoa', enCategory: 'flowers' },
        { itemA: 'rabbit' as VisualObjectType, itemB: 'chick' as VisualObjectType, nameA: 'chú thỏ', nameB: 'chú gà con', totalName: 'con vật', enCategory: 'animals' },
        { itemA: 'pencil' as VisualObjectType, itemB: 'crayon' as VisualObjectType, nameA: 'chiếc bút chì', nameB: 'chiếc bút sáp màu', totalName: 'chiếc bút', enCategory: 'stationery items' },
        { itemA: 'ball_red' as VisualObjectType, itemB: 'ball_blue' as VisualObjectType, nameA: 'quả bóng đỏ', nameB: 'quả bóng xanh', totalName: 'quả bóng', enCategory: 'balls' },
      ];
      const pair = pairs[i % pairs.length];

      questions.push({
        id: qId,
        type: 'fill',
        promptVi: `Có ${a} ${pair.nameA} và ${b} ${pair.nameB}. Có tất cả bao nhiêu ${pair.totalName}? (${a} + ${b} = ?)`,
        promptEn: `There are ${a} ${pair.nameA} and ${b} ${pair.nameB}. How many ${pair.enCategory} altogether?`,
        visualConfig: {
          mode: 'addition',
          groupA: { count: a, itemType: pair.itemA, labelVi: pair.nameA },
          groupB: { count: b, itemType: pair.itemB, labelVi: pair.nameB }
        },
        options: [sum - 1, sum, sum + 1, sum + 2].filter((v, idx, arr) => arr.indexOf(v) === idx && v >= 0).slice(0, 4),
        answer: sum,
        hintVi: `Bé hãy quan sát hai nhóm và tự đếm tất cả để tìm kết quả nhé!`,
        hintEn: `Count all items across both groups!`,
        explanationVi: `${a} + ${b} = ${sum} (${sum} ${pair.totalName}).`,
        explanationEn: `${a} + ${b} = ${sum}.`
      });
    } else if (lessonId === 11 || (lessonId >= 17 && lessonId <= 20 && i % 2 === 1)) {
      // Subtraction to 10
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * (a + 1));
      const diff = a - b;
      questions.push({
        id: qId,
        type: 'fill',
        promptVi: `Có ${a} con cá, bơi đi ${b} con cá. Hỏi còn lại bao nhiêu con cá? (${a} - ${b} = ?)`,
        promptEn: `Calculate: ${a} - ${b} = ?`,
        visualConfig: {
          mode: 'subtraction',
          itemType: 'fish',
          initialCount: a,
          removedCount: b
        },
        options: [diff - 1, diff, diff + 1, diff + 2].filter((v, idx, arr) => arr.indexOf(v) === idx && v >= 0).slice(0, 4),
        answer: diff,
        hintVi: `Bé đếm lùi ${b} bước từ số ${a}.`,
        hintEn: `Count back ${b} steps from ${a}.`,
        explanationVi: `${a} - ${b} = ${diff}.`,
        explanationEn: `${a} - ${b} = ${diff}.`
      });
    } else if (lessonId >= 21 && lessonId <= 24) {
      // Two-digit numbers up to 100
      const num = 10 + Math.floor(Math.random() * 89);
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      questions.push({
        id: qId,
        type: 'fill',
        promptVi: `Số ${num} gồm mấy chục và mấy đơn vị?`,
        promptEn: `How many tens and ones in ${num}?`,
        visualConfig: {
          mode: 'tens-ones',
          tens,
          ones,
          itemType: 'apple'
        },
        options: [`${tens} chục và ${ones} đơn vị`, `${ones} chục và ${tens} đơn vị`, `${tens}0 chục`],
        answer: `${tens} chục và ${ones} đơn vị`,
        hintVi: `Chữ số ${tens} là chục, chữ số ${ones} là đơn vị.`,
        hintEn: `${tens} tens and ${ones} ones.`,
        explanationVi: `Số ${num} gồm ${tens} chục và ${ones} đơn vị.`,
        explanationEn: `${num} consists of ${tens} tens and ${ones} ones.`
      });
    } else if (lessonId >= 25 && lessonId <= 28) {
      // Length and Measurement
      const cm = Math.floor(Math.random() * 12) + 3;
      questions.push({
        id: qId,
        type: 'fill',
        promptVi: `Một chiếc bút sáp màu dài từ vạch 0 cm đến vạch ${cm} cm trên thước. Hỏi bút sáp dài mấy cm?`,
        promptEn: `A crayon spans from 0 cm to ${cm} cm on a ruler. How long is it?`,
        visualConfig: {
          mode: 'ruler',
          lengthCm: cm,
          startCm: 0,
          objectName: 'Bút sáp màu'
        },
        options: [`${cm - 1} cm`, `${cm} cm`, `${cm + 1} cm`, `${cm + 2} cm`].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4),
        answer: `${cm} cm`,
        hintVi: `Đọc đúng vạch số ở đầu bút: ${cm} cm.`,
        hintEn: `Read the number at the ruler mark: ${cm} cm.`,
        explanationVi: `Chiếc bút sáp dài ${cm} cm.`,
        explanationEn: `The crayon is ${cm} cm long.`
      });
    } else if (lessonId === 29 || lessonId === 30 || lessonId === 33 || lessonId === 39 || lessonId === 41) {
      // 2-digit + 1-digit or 2-digit (No carry!)
      const tensA = Math.floor(Math.random() * 5) + 1; // 1..5
      const onesA = Math.floor(Math.random() * 5); // 0..4
      const tensB = lessonId === 29 ? 0 : Math.floor(Math.random() * 4); // 0..3
      const onesB = Math.floor(Math.random() * (9 - onesA)); // ensures onesA + onesB <= 9 (NO CARRY!)
      const numA = tensA * 10 + onesA;
      const numB = tensB * 10 + onesB;
      const sum = numA + numB;
      questions.push({
        id: qId,
        type: 'fill',
        promptVi: `Đặt tính rồi tính: ${numA} + ${numB} = ?`,
        promptEn: `Calculate: ${numA} + ${numB} = ?`,
        options: [sum - 1, sum, sum + 1, sum + 10].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4),
        answer: sum,
        hintVi: `Cộng hàng đơn vị: ${onesA} + ${onesB} = ${onesA + onesB}. Cộng hàng chục: ${tensA} + ${tensB} = ${tensA + tensB}.`,
        hintEn: `Add ones: ${onesA} + ${onesB}. Add tens: ${tensA} + ${tensB}.`,
        explanationVi: `${numA} + ${numB} = ${sum}.`,
        explanationEn: `${numA} + ${numB} = ${sum}.`
      });
    } else if (lessonId === 31 || lessonId === 32) {
      // 2-digit - 1-digit or 2-digit (No borrow!)
      const tensA = Math.floor(Math.random() * 5) + 4; // 4..8
      const onesA = Math.floor(Math.random() * 5) + 4; // 4..8
      const tensB = lessonId === 31 ? 0 : Math.floor(Math.random() * (tensA - 1)); // 0..tensA-1
      const onesB = Math.floor(Math.random() * (onesA + 1)); // ensures onesA >= onesB (NO BORROW!)
      const numA = tensA * 10 + onesA;
      const numB = tensB * 10 + onesB;
      const diff = numA - numB;
      questions.push({
        id: qId,
        type: 'fill',
        promptVi: `Đặt tính rồi tính: ${numA} - ${numB} = ?`,
        promptEn: `Calculate: ${numA} - ${numB} = ?`,
        options: [diff - 1, diff, diff + 1, diff + 2].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4),
        answer: diff,
        hintVi: `Trừ hàng đơn vị: ${onesA} - ${onesB} = ${onesA - onesB}. Trừ hàng chục: ${tensA} - ${tensB} = ${tensA - tensB}.`,
        hintEn: `Subtract ones: ${onesA} - ${onesB}. Subtract tens: ${tensA} - ${tensB}.`,
        explanationVi: `${numA} - ${numB} = ${diff}.`,
        explanationEn: `${numA} - ${numB} = ${diff}.`
      });
    } else if (lessonId >= 34 && lessonId <= 37) {
      // Time and Clocks
      const h = Math.floor(Math.random() * 12) + 1;
      questions.push({
        id: qId,
        type: 'choice',
        promptVi: `Đồng hồ có kim dài chỉ số 12, kim ngắn chỉ số ${h}. Đó là mấy giờ?`,
        promptEn: `Long hand on 12, short hand on ${h}. What time is it?`,
        visualConfig: {
          mode: 'clock',
          hour: h,
          minute: 0
        },
        options: [`${h} giờ`, `${(h % 12) + 1} giờ`, `12 giờ`],
        answer: `${h} giờ`,
        hintVi: `Kim ngắn chỉ số nào là bấy nhiêu giờ.`,
        hintEn: `The short hand points directly at the hour.`,
        explanationVi: `Đó là ${h} giờ đúng.`,
        explanationEn: `It is ${h} o'clock.`
      });
    } else {
      // General fallback calculation
      const a = Math.floor(Math.random() * 8) + 1;
      const b = Math.floor(Math.random() * (10 - a));
      questions.push({
        id: qId,
        type: 'fill',
        promptVi: `Tính: ${a} + ${b} = ?`,
        promptEn: `Calculate: ${a} + ${b} = ?`,
        visualConfig: {
          mode: 'addition',
          itemType: 'star',
          groupA: { count: a, labelVi: `${a} ngôi sao` },
          groupB: { count: b, labelVi: `${b} ngôi sao` }
        },
        options: [a + b - 1, a + b, a + b + 1, a + b + 2].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4),
        answer: a + b,
        hintVi: `Đếm thêm ${b} từ ${a}.`,
        hintEn: `Count up from ${a}.`,
        explanationVi: `${a} + ${b} = ${a + b}.`,
        explanationEn: `${a} + ${b} = ${a + b}.`
      });
    }
  }

  // Prepend any curated sample questions if available
  const list = lesson && lesson.sampleQuestions && lesson.sampleQuestions.length > 0
    ? [...lesson.sampleQuestions, ...questions].slice(0, count)
    : questions.slice(0, count);

  return list.map(normalizeQuestionUnits);
}

// Automatically ensure units are present when questions require a dimensional quantity
export function normalizeQuestionUnits(q: Question): Question {
  if (!q.options || q.options.length === 0) return q;

  const p = q.promptVi.toLowerCase();

  // Pure arithmetic calculations like "Tính: 8 + 2 = ?" should remain pure numbers
  if (p.startsWith('tính:') || p.startsWith('đặt tính rồi tính:')) {
    return q;
  }

  // 1. Day units
  if (p.includes('mấy ngày') || p.includes('bao nhiêu ngày')) {
    const hasUnit = q.options.some((o) => typeof o === 'string' && o.includes('ngày'));
    if (!hasUnit) {
      return {
        ...q,
        options: q.options.map((o) => `${o} ngày`),
        answer: `${q.answer} ngày`,
      };
    }
  }

  // 2. Length cm units
  if (p.includes('mấy cm') || p.includes('bao nhiêu cm')) {
    const hasUnit = q.options.some((o) => typeof o === 'string' && o.includes('cm'));
    if (!hasUnit) {
      return {
        ...q,
        options: q.options.map((o) => `${o} cm`),
        answer: `${q.answer} cm`,
      };
    }
  }

  // 3. Plant units
  if (p.includes('mấy cây') || p.includes('bao nhiêu cây')) {
    const hasUnit = q.options.some((o) => typeof o === 'string' && o.includes('cây'));
    if (!hasUnit) {
      return {
        ...q,
        options: q.options.map((o) => `${o} cây`),
        answer: `${q.answer} cây`,
      };
    }
  }

  // 4. Counting stick units
  if (p.includes('mấy que tính') || p.includes('bao nhiêu que tính')) {
    const hasUnit = q.options.some((o) => typeof o === 'string' && o.includes('que'));
    if (!hasUnit) {
      return {
        ...q,
        options: q.options.map((o) => `${o} que tính`),
        answer: `${q.answer} que tính`,
      };
    }
  }

  // 5. Hour units
  if ((p.includes('mấy giờ') || p.includes('bao nhiêu giờ')) && !p.includes('thứ')) {
    const hasUnit = q.options.some((o) => typeof o === 'string' && o.includes('giờ'));
    if (!hasUnit) {
      return {
        ...q,
        options: q.options.map((o) => `${o} giờ`),
        answer: `${q.answer} giờ`,
      };
    }
  }

  return q;
}
