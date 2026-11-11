/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MathVocabItem {
  en: string;
  vi: string;
  symbol: string;
  ipa?: string;
}

export const ALL_LESSON_VOCABULARY: Record<number, MathVocabItem[]> = {
  // =========================================================================
  // CHỦ ĐỀ 1: CÁC SỐ TỪ 0 ĐẾN 10 (Bài 1 - 6)
  // =========================================================================
  1: [
    { en: 'Zero', vi: 'Số không (0)', symbol: '0', ipa: '/ˈzɪroʊ/' },
    { en: 'One', vi: 'Số một (1)', symbol: '1', ipa: '/wʌn/' },
    { en: 'Two', vi: 'Số hai (2)', symbol: '2', ipa: '/tuː/' },
    { en: 'Three', vi: 'Số ba (3)', symbol: '3', ipa: '/θriː/' },
    { en: 'Four', vi: 'Số bốn (4)', symbol: '4', ipa: '/fɔːr/' },
    { en: 'Five', vi: 'Số năm (5)', symbol: '5', ipa: '/faɪv/' },
  ],

  2: [
    { en: 'Six', vi: 'Số sáu (6)', symbol: '6', ipa: '/sɪks/' },
    { en: 'Seven', vi: 'Số bảy (7)', symbol: '7', ipa: '/ˈsɛvən/' },
    { en: 'Eight', vi: 'Số tám (8)', symbol: '8', ipa: '/eɪt/' },
    { en: 'Nine', vi: 'Số chín (9)', symbol: '9', ipa: '/naɪn/' },
    { en: 'Ten', vi: 'Số mười (10)', symbol: '10', ipa: '/tɛn/' },
  ],

  3: [
    { en: 'More than', vi: 'Nhiều hơn', symbol: '➕', ipa: '/mɔːr ðæn/' },
    { en: 'Fewer than', vi: 'Ít hơn', symbol: '➖', ipa: '/ˈfjuːər ðæn/' },
    { en: 'Equal to', vi: 'Bằng nhau', symbol: '=', ipa: '/ˈiːkwəl tuː/' },
  ],

  4: [
    { en: 'Greater than', vi: 'Lớn hơn', symbol: '>', ipa: '/ˈɡreɪtər ðæn/' },
    { en: 'Less than', vi: 'Bé hơn', symbol: '<', ipa: '/lɛs ðæn/' },
    { en: 'Equals', vi: 'Bằng nhau', symbol: '=', ipa: '/ˈiːkwəlz/' },
  ],

  5: [
    { en: 'Split', vi: 'Tách số', symbol: '➗', ipa: '/splɪt/' },
    { en: 'Combine', vi: 'Gộp lại', symbol: '🔗', ipa: '/kəmˈbaɪn/' },
    { en: 'Number bonds', vi: 'Sơ đồ tách - gộp', symbol: '🌿', ipa: '/ˈnʌmbər bɑːndz/' },
  ],

  6: [
    { en: 'Order', vi: 'Thứ tự dãy số', symbol: '🔢', ipa: '/ˈɔːrdər/' },
    { en: 'Smallest', vi: 'Số bé nhất', symbol: '🌱', ipa: '/ˈsmɔːlɪst/' },
    { en: 'Greatest', vi: 'Số lớn nhất', symbol: '👑', ipa: '/ˈɡreɪtɪst/' },
  ],

  // =========================================================================
  // CHỦ ĐỀ 2: HÌNH PHẲNG (Bài 7 - 9)
  // =========================================================================
  7: [
    { en: 'Circle', vi: 'Hình tròn', symbol: '🔴', ipa: '/ˈsɜːrkəl/' },
    { en: 'Square', vi: 'Hình vuông', symbol: '🟧', ipa: '/skwɛər/' },
    { en: 'Triangle', vi: 'Hình tam giác', symbol: '🔺', ipa: '/ˈtraɪæŋɡəl/' },
    { en: 'Rectangle', vi: 'Hình chữ nhật', symbol: '🟦', ipa: '/ˈrɛktæŋɡəl/' },
  ],

  8: [
    { en: 'Assemble', vi: 'Lắp ghép hình', symbol: '🧩', ipa: '/əˈsɛmbəl/' },
    { en: 'Shape', vi: 'Hình dạng', symbol: '⭐', ipa: '/ʃeɪp/' },
    { en: 'Pattern', vi: 'Mẫu sắp xếp', symbol: '🎨', ipa: '/ˈpætərn/' },
  ],

  9: [
    { en: 'Flat shape', vi: 'Hình phẳng 2D', symbol: '📐', ipa: '/flæt ʃeɪp/' },
    { en: 'Side', vi: 'Cạnh thẳng', symbol: '📏', ipa: '/saɪd/' },
    { en: 'Corner', vi: 'Đỉnh nhọn / Góc', symbol: '📍', ipa: '/ˈkɔːrnər/' },
  ],

  // =========================================================================
  // CHỦ ĐỀ 3: PHÉP CỘNG, PHÉP TRỪ PHẠM VI 10 (Bài 10 - 13)
  // =========================================================================
  10: [
    { en: 'Plus', vi: 'Dấu cộng (+)', symbol: '+', ipa: '/plʌs/' },
    { en: 'Add', vi: 'Thêm vào', symbol: '➕', ipa: '/æd/' },
    { en: 'Addition', vi: 'Phép cộng', symbol: '✨', ipa: '/əˈdɪʃən/' },
    { en: 'Total', vi: 'Tất cả / Tổng', symbol: '🧮', ipa: '/ˈtoʊtəl/' },
  ],

  11: [
    { en: 'Minus', vi: 'Dấu trừ (-)', symbol: '-', ipa: '/ˈmaɪnəs/' },
    { en: 'Subtract', vi: 'Bớt đi', symbol: '➖', ipa: '/səbˈtrækt/' },
    { en: 'Subtraction', vi: 'Phép trừ', symbol: '✂️', ipa: '/səbˈtrækʃən/' },
    { en: 'Left', vi: 'Còn lại', symbol: '🎯', ipa: '/lɛft/' },
  ],

  12: [
    { en: 'Addition table', vi: 'Bảng cộng', symbol: '➕', ipa: '/əˈdɪʃən ˈteɪbəl/' },
    { en: 'Subtraction table', vi: 'Bảng trừ', symbol: '➖', ipa: '/səbˈtrækʃən ˈteɪbəl/' },
    { en: 'Equals', vi: 'Bằng nhau (=)', symbol: '=', ipa: '/ˈiːkwəlz/' },
  ],

  13: [
    { en: 'Mental math', vi: 'Tính nhẩm', symbol: '💡', ipa: '/ˈmɛntəl mæθ/' },
    { en: 'Calculate', vi: 'Tính toán', symbol: '✏️', ipa: '/ˈkælkjəleɪt/' },
    { en: 'Correct', vi: 'Chính xác', symbol: '✅', ipa: '/kəˈrɛkt/' },
  ],

  // =========================================================================
  // CHỦ ĐỀ 4: HÌNH KHỐI & VỊ TRÍ KHÔNG GIAN (Bài 14 - 16)
  // =========================================================================
  14: [
    { en: 'Cube', vi: 'Khối lập phương', symbol: '🎲', ipa: '/kjuːb/' },
    { en: 'Cuboid', vi: 'Khối hộp chữ nhật', symbol: '📦', ipa: '/ˈkjuːbɔɪd/' },
    { en: 'Solid shape', vi: 'Hình khối 3D', symbol: '🧱', ipa: '/ˈsɑːlɪd ʃeɪp/' },
  ],

  15: [
    { en: 'Left', vi: 'Bên trái', symbol: '👈', ipa: '/lɛft/' },
    { en: 'Right', vi: 'Bên phải', symbol: '👉', ipa: '/raɪt/' },
    { en: 'Above', vi: 'Ở phía trên', symbol: '👆', ipa: '/əˈbʌv/' },
    { en: 'Below', vi: 'Ở phía dưới', symbol: '👇', ipa: '/bɪˈloʊ/' },
    { en: 'In front of', vi: 'Ở phía trước', symbol: '👀', ipa: '/ɪn frʌnt ʌv/' },
    { en: 'Behind', vi: 'Ở phía sau', symbol: '🎒', ipa: '/bɪˈhaɪnd/' },
  ],

  16: [
    { en: 'Top', vi: 'Phía trên cùng', symbol: '🔝', ipa: '/tɑːp/' },
    { en: 'Middle', vi: 'Ở chính giữa', symbol: '🎯', ipa: '/ˈmɪdəl/' },
    { en: 'Bottom', vi: 'Phía dưới cùng', symbol: '⚓', ipa: '/ˈbɑːtəm/' },
  ],

  // =========================================================================
  // CHỦ ĐỀ 5: ÔN TẬP HỌC KÌ 1 (Bài 17 - 20)
  // =========================================================================
  17: [
    { en: 'Number line', vi: 'Tia số', symbol: '📏', ipa: '/ˈnʌmbər laɪn/' },
    { en: 'Before', vi: 'Số liền trước', symbol: '⬅️', ipa: '/bɪˈfɔːr/' },
    { en: 'After', vi: 'Số liền sau', symbol: '➡️', ipa: '/ˈæftər/' },
  ],

  18: [
    { en: 'Add and subtract', vi: 'Cộng và trừ', symbol: '±', ipa: '/æd ænd səbˈtrækt/' },
    { en: 'Equation', vi: 'Phép tính', symbol: '📝', ipa: '/ɪˈkweɪʒən/' },
    { en: 'Left to right', vi: 'Từ trái sang phải', symbol: '➡️', ipa: '/lɛft tuː raɪt/' },
  ],

  19: [
    { en: 'Flat shape', vi: 'Hình phẳng', symbol: '📐', ipa: '/flæt ʃeɪp/' },
    { en: 'Solid shape', vi: 'Hình khối', symbol: '📦', ipa: '/ˈsɑːlɪd ʃeɪp/' },
    { en: 'Sort', vi: 'Phân loại hình', symbol: '🗂️', ipa: '/sɔːrt/' },
  ],

  20: [
    { en: 'Review', vi: 'Ôn tập kiến thức', symbol: '📚', ipa: '/rɪˈvjuː/' },
    { en: 'Champion', vi: 'Nhà vô địch Toán', symbol: '🏆', ipa: '/ˈtʃæmpiən/' },
    { en: 'Star', vi: 'Ngôi sao điểm tốt', symbol: '⭐', ipa: '/stɑːr/' },
  ],

  // =========================================================================
  // TẬP 2 - CHỦ ĐỀ 6: CÁC SỐ ĐẾN 100 (Bài 21 - 24)
  // =========================================================================
  21: [
    { en: 'Tens', vi: 'Hàng chục', symbol: '🔟', ipa: '/tɛnz/' },
    { en: 'Ones', vi: 'Hàng đơn vị', symbol: '1️⃣', ipa: '/wʌnz/' },
    { en: 'Bundle', vi: 'Bó chục que tính', symbol: '🥢', ipa: '/ˈbʌndəl/' },
    { en: 'Two-digit', vi: 'Số có hai chữ số', symbol: '2️⃣4️⃣', ipa: '/tuː ˈdɪdʒɪt/' },
  ],

  22: [
    { en: 'Compare', vi: 'So sánh số', symbol: '⚖️', ipa: '/kəmˈpɛər/' },
    { en: 'Tens place', vi: 'So sánh hàng chục', symbol: '🔟', ipa: '/tɛnz pleɪs/' },
    { en: 'Ones place', vi: 'So sánh hàng đơn vị', symbol: '1️⃣', ipa: '/wʌnz pleɪs/' },
  ],

  23: [
    { en: 'Hundred chart', vi: 'Bảng 100 số', symbol: '💯', ipa: '/ˈhʌndrəd tʃɑːrt/' },
    { en: 'Row', vi: 'Hàng ngang', symbol: '↔️', ipa: '/roʊ/' },
    { en: 'Column', vi: 'Cột dọc', symbol: '↕️', ipa: '/ˈkɑːləm/' },
    { en: 'One hundred', vi: 'Một trăm (100)', symbol: '100', ipa: '/wʌn ˈhʌndrəd/' },
  ],

  24: [
    { en: 'Round tens', vi: 'Số tròn chục', symbol: '20', ipa: '/raʊnd tɛnz/' },
    { en: 'Count by tens', vi: 'Đếm theo chục', symbol: '🔟', ipa: '/kaʊnt baɪ tɛnz/' },
    { en: 'Next number', vi: 'Số tiếp theo', symbol: '➡️', ipa: '/nɛkst ˈnʌmbər/' },
  ],

  // =========================================================================
  // CHỦ ĐỀ 7: ĐỘ DÀI VÀ ĐO ĐỘ DÀI (Bài 25 - 28)
  // =========================================================================
  25: [
    { en: 'Longer', vi: 'Dài hơn', symbol: '📏', ipa: '/ˈlɔːŋɡər/' },
    { en: 'Shorter', vi: 'Ngắn hơn', symbol: '✏️', ipa: '/ˈʃɔːrtər/' },
    { en: 'Equal length', vi: 'Dài bằng nhau', symbol: '=', ipa: '/ˈiːkwəl lɛŋkθ/' },
  ],

  26: [
    { en: 'Centimeter', vi: 'Xăng-ti-mét (cm)', symbol: 'cm', ipa: '/ˈsɛntɪˌmiːtər/' },
    { en: 'Ruler', vi: 'Cây thước kẻ', symbol: '📐', ipa: '/ˈruːlər/' },
    { en: 'Measure', vi: 'Đo độ dài', symbol: '📏', ipa: '/ˈmɛʒər/' },
    { en: 'Length', vi: 'Chiều dài', symbol: '↔️', ipa: '/lɛŋkθ/' },
  ],

  27: [
    { en: 'Estimate', vi: 'Ước lượng độ dài', symbol: '👀', ipa: '/ˈɛstəˌmeɪt/' },
    { en: 'Hand span', vi: 'Gang tay', symbol: '✋', ipa: '/hænd spæn/' },
    { en: 'Accurate', vi: 'Đo chính xác', symbol: '🎯', ipa: '/ˈækjərət/' },
  ],

  28: [
    { en: 'Line segment', vi: 'Đoạn thẳng', symbol: '〰️', ipa: '/laɪn ˈsɛɡmənt/' },
    { en: 'Unit', vi: 'Đơn vị đo', symbol: '🏷️', ipa: '/ˈjuːnɪt/' },
    { en: 'Distance', vi: 'Khoảng cách', symbol: '🚶', ipa: '/ˈdɪstəns/' },
  ],

  // =========================================================================
  // CHỦ ĐỀ 8: PHÉP CỘNG, TRỪ PHẠM VI 100 KHÔNG NHỚ (Bài 29 - 33)
  // =========================================================================
  29: [
    { en: 'Add ones', vi: 'Cộng hàng đơn vị', symbol: '1️⃣', ipa: '/æd wʌnz/' },
    { en: 'Keep tens', vi: 'Giữ nguyên hàng chục', symbol: '🔟', ipa: '/kiːp tɛnz/' },
    { en: 'Sum', vi: 'Tổng phép tính', symbol: '🧮', ipa: '/sʌm/' },
  ],

  30: [
    { en: 'Column addition', vi: 'Đặt tính cộng cột dọc', symbol: '➕', ipa: '/ˈkɑːləm əˈdɪʃən/' },
    { en: 'Align columns', vi: 'Thẳng cột chục và đơn vị', symbol: '↕️', ipa: '/əˈlaɪn ˈkɑːləmz/' },
    { en: 'Total', vi: 'Kết quả cộng', symbol: '✅', ipa: '/ˈtoʊtəl/' },
  ],

  31: [
    { en: 'Subtract ones', vi: 'Trừ hàng đơn vị', symbol: '1️⃣', ipa: '/səbˈtrækt wʌnz/' },
    { en: 'Difference', vi: 'Hiệu số', symbol: '➖', ipa: '/ˈdɪfərəns/' },
    { en: 'Remainder', vi: 'Phần còn lại', symbol: '🎯', ipa: '/rɪˈmeɪndər/' },
  ],

  32: [
    { en: 'Column subtraction', vi: 'Đặt tính trừ cột dọc', symbol: '➖', ipa: '/ˈkɑːləm səbˈtrækʃən/' },
    { en: 'Line up', vi: 'Đặt thẳng cột', symbol: '↕️', ipa: '/laɪn ʌp/' },
    { en: 'Subtract tens', vi: 'Trừ hàng chục', symbol: '🔟', ipa: '/səbˈtrækt tɛnz/' },
  ],

  33: [
    { en: 'Quick math', vi: 'Tính nhanh', symbol: '⚡', ipa: '/kwɪk mæθ/' },
    { en: 'Practice', vi: 'Luyện tập chăm chỉ', symbol: '📖', ipa: '/ˈpræktɪs/' },
    { en: 'Result', vi: 'Đáp số', symbol: '🏁', ipa: '/rɪˈzʌlt/' },
  ],

  // =========================================================================
  // CHỦ ĐỀ 9: THỜI GIAN, GIỜ VÀ LỊCH (Bài 34 - 37)
  // =========================================================================
  34: [
    { en: 'Clock', vi: 'Đồng hồ kim', symbol: '🕒', ipa: '/klɑːk/' },
    { en: "O'clock", vi: 'Giờ đúng', symbol: '⏰', ipa: '/əˈklɑːk/' },
    { en: 'Hour hand', vi: 'Kim giờ (ngắn)', symbol: '🔴', ipa: '/ˈaʊər hænd/' },
    { en: 'Minute hand', vi: 'Kim phút (dài)', symbol: '🔵', ipa: '/ˈmɪnɪt hænd/' },
  ],

  35: [
    { en: 'Monday', vi: 'Thứ Hai', symbol: '2️⃣', ipa: '/ˈmʌndeɪ/' },
    { en: 'Tuesday', vi: 'Thứ Ba', symbol: '3️⃣', ipa: '/ˈtjuːzdeɪ/' },
    { en: 'Wednesday', vi: 'Thứ Tư', symbol: '4️⃣', ipa: '/ˈwɛnzdeɪ/' },
    { en: 'Thursday', vi: 'Thứ Năm', symbol: '5️⃣', ipa: '/ˈθɜːrzdeɪ/' },
    { en: 'Friday', vi: 'Thứ Sáu', symbol: '6️⃣', ipa: '/ˈfraɪdeɪ/' },
    { en: 'Saturday', vi: 'Thứ Bảy', symbol: '7️⃣', ipa: '/ˈsætərdeɪ/' },
    { en: 'Sunday', vi: 'Chủ Nhật', symbol: '☀️', ipa: '/ˈsʌndeɪ/' },
  ],

  36: [
    { en: 'Calendar', vi: 'Tờ lịch', symbol: '📅', ipa: '/ˈkæləndər/' },
    { en: 'Today', vi: 'Hôm nay', symbol: '📌', ipa: '/təˈdeɪ/' },
    { en: 'Schedule', vi: 'Thời gian biểu', symbol: '📋', ipa: '/ˈskɛdʒuːl/' },
  ],

  37: [
    { en: 'Morning', vi: 'Buổi sáng', symbol: '🌅', ipa: '/ˈmɔːrnɪŋ/' },
    { en: 'Afternoon', vi: 'Buổi chiều', symbol: '☀️', ipa: '/ˌæftərˈnuːn/' },
    { en: 'Evening', vi: 'Buổi tối', symbol: '🌙', ipa: '/ˈiːvnɪŋ/' },
    { en: 'On time', vi: 'Đúng giờ', symbol: '⏱️', ipa: '/ɑːn taɪm/' },
  ],

  // =========================================================================
  // CHỦ ĐỀ 10: ÔN TẬP CUỐI NĂM (Bài 38 - 41)
  // =========================================================================
  38: [
    { en: 'Make 10', vi: 'Gộp thành 10', symbol: '🔟', ipa: '/meɪk tɛn/' },
    { en: 'Number pair', vi: 'Cặp số cộng', symbol: '🤝', ipa: '/ˈnʌmbər pɛər/' },
    { en: 'Math facts', vi: 'Phép tính quen thuộc', symbol: '📝', ipa: '/mæθ fækts/' },
  ],

  39: [
    { en: 'Two digits', vi: 'Số có hai chữ số', symbol: '🔢', ipa: '/tuː ˈdɪdʒɪts/' },
    { en: 'Tens and ones', vi: 'Chục và đơn vị', symbol: '🧮', ipa: '/tɛnz ænd wʌnz/' },
    { en: 'Problem solving', vi: 'Giải toán có lời văn', symbol: '💡', ipa: '/ˈprɑːbləm ˈsɑːlvɪŋ/' },
  ],

  40: [
    { en: 'Geometry', vi: 'Hình học', symbol: '📐', ipa: '/dʒiˈɑːmətri/' },
    { en: 'Measurement', vi: 'Đo lường độ dài (cm)', symbol: '📏', ipa: '/ˈmɛʒərmənt/' },
    { en: 'Solid and flat', vi: 'Hình phẳng và hình khối', symbol: '📦', ipa: '/ˈsɑːlɪd ænd flæt/' },
  ],

  41: [
    { en: 'Great job', vi: 'Rất xuất sắc!', symbol: '🌟', ipa: '/ɡreɪt dʒɑːb/' },
    { en: 'Congratulations', vi: 'Chúc mừng em!', symbol: '🎉', ipa: '/kənˌɡrætʃəˈleɪʃənz/' },
    { en: 'Grade 2 ready', vi: 'Sẵn sàng lên Lớp 2', symbol: '🚀', ipa: '/ɡreɪd tuː ˈrɛdi/' },
  ],
};

/**
 * Retrieves the vocabulary package for any of the 41 lessons
 */
export function getLessonVocabulary(lessonId: number): MathVocabItem[] {
  return ALL_LESSON_VOCABULARY[lessonId] || ALL_LESSON_VOCABULARY[1];
}
