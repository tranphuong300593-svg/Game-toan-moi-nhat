/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GameParkZone {
  id: string;
  number: number;
  nameVi: string;
  nameEn: string;
  topicTitleVi: string;
  taglineVi: string;
  taglineEn: string;
  colorName: string;
  accentHex: string;
  bgGrad: string;
  borderTheme: string;
  imageSrc?: string;
  illustrationType:
    | 'numbers'
    | 'operations'
    | 'geometry'
    | 'clock'
    | 'supermarket'
    | 'patterns'
    | 'racing'
    | 'treasure'
    | 'measurement';
}

export const GAME_PARK_ZONES: GameParkZone[] = [
  {
    id: 'zone-1-numbers',
    number: 1,
    nameVi: 'LÂU ĐÀI NHỮNG CON SỐ',
    nameEn: 'NUMBER CASTLE',
    topicTitleVi: 'Nhận biết số, đếm, so sánh và sắp xếp số',
    taglineVi: 'Khám phá thế giới số đếm kỳ diệu trong tòa lâu đài nguy nga cùng các con số sắc màu!',
    taglineEn: 'Recognize, count, compare and order numbers in the magical fairy castle.',
    colorName: 'Xanh dương và Vàng',
    accentHex: '#2563EB',
    bgGrad: 'from-blue-500 to-indigo-600',
    borderTheme: 'border-blue-300 hover:border-blue-500',
    imageSrc: '/images/zone-1-castle.png',
    illustrationType: 'numbers',
  },
  {
    id: 'zone-2-operations',
    number: 2,
    nameVi: 'KHU RỪNG PHÉP TÍNH',
    nameEn: 'CALCULATION FOREST',
    topicTitleVi: 'Phép cộng, phép trừ và tính nhẩm',
    taglineVi: 'Hái táo ngọt, tính nhẩm cùng thỏ trắng đáng yêu dưới tán rừng xanh mát rực rỡ hoa!',
    taglineEn: 'Addition, subtraction and mental math with friendly bunny under apple trees.',
    colorName: 'Xanh lá và Cam',
    accentHex: '#16A34A',
    bgGrad: 'from-emerald-500 to-teal-600',
    borderTheme: 'border-emerald-300 hover:border-emerald-500',
    imageSrc: '/images/zone-2-forest.png',
    illustrationType: 'operations',
  },
  {
    id: 'zone-3-geometry',
    number: 3,
    nameVi: 'XỨ SỞ HÌNH HỌC',
    nameEn: 'GEOMETRY LAND',
    topicTitleVi: 'Nhận biết hình, ghép hình và vị trí không gian',
    taglineVi: 'Ngôi làng cổ tích xây từ hình vuông, tròn, tam giác cùng chú Rô-bốt nhỏ thông minh!',
    taglineEn: 'Explore 2D and 3D shapes, assembly, and spatial awareness with Chibi robot.',
    colorName: 'Tím lavender và Hồng pastel',
    accentHex: '#8B5CF6',
    bgGrad: 'from-purple-500 to-pink-500',
    borderTheme: 'border-purple-300 hover:border-purple-500',
    imageSrc: '/images/zone-3-geometry.png',
    illustrationType: 'geometry',
  },
  {
    id: 'zone-4-clock',
    number: 4,
    nameVi: 'THÁP ĐỒNG HỒ KỲ DIỆU',
    nameEn: 'MAGIC CLOCK TOWER',
    topicTitleVi: 'Thời gian và đo lường',
    taglineVi: 'Chỉnh kim giờ kim phút chuẩn xác, đo độ dài cùng thước kẻ và bút chì học tập!',
    taglineEn: 'Read analog clocks, explore calendar days, and measure lengths with rulers.',
    colorName: 'Xanh ngọc và Vàng kem',
    accentHex: '#0891B2',
    bgGrad: 'from-cyan-500 to-teal-600',
    borderTheme: 'border-cyan-300 hover:border-cyan-500',
    imageSrc: '/images/zone-4-clock.png',
    illustrationType: 'clock',
  },
  {
    id: 'zone-5-supermarket',
    number: 5,
    nameVi: 'SIÊU THỊ TOÁN HỌC',
    nameEn: 'MATH SUPERMARKET',
    topicTitleVi: 'Vận dụng Toán học vào cuộc sống',
    taglineVi: 'Đi siêu thị mini, chọn đồ chơi, tính tiền giỏ hàng bánh kẹo và gấu bông đáng yêu!',
    taglineEn: 'Apply math to real life: shopping carts, grocery items, prices and counting.',
    colorName: 'Hồng pastel và Vàng',
    accentHex: '#DB2777',
    bgGrad: 'from-pink-500 to-rose-500',
    borderTheme: 'border-pink-300 hover:border-pink-500',
    imageSrc: '/images/zone-5-supermarket.png',
    illustrationType: 'supermarket',
  },
  {
    id: 'zone-6-measurement',
    number: 6,
    nameVi: 'XƯỞNG ĐO LƯỜNG TÍ HON',
    nameEn: 'TINY MEASUREMENT WORKSHOP',
    topicTitleVi: 'Đo độ dài bằng thước xăng-ti-mét (cm) & So sánh độ dài',
    taglineVi: 'Đo độ dài đồ vật cùng thước thần xăng-ti-mét và trổ tài so sánh xem ai dài hơn, ngắn hơn nhé!',
    taglineEn: 'Measure objects in centimeters with the magic ruler and compare lengths.',
    colorName: 'Cam pastel và Vàng tươi',
    accentHex: '#F59E0B',
    bgGrad: 'from-amber-500 to-orange-500',
    borderTheme: 'border-amber-300 hover:border-amber-500',
    imageSrc: '/images/zone-6-measurement.png',
    illustrationType: 'measurement',
  },
  {
    id: 'zone-7-racing',
    number: 7,
    nameVi: 'ĐƯỜNG ĐUA TOÁN HỌC',
    nameEn: 'MATH RACING TRACK',
    topicTitleVi: 'Phản xạ, tính nhanh và vượt thử thách',
    taglineVi: 'Lái xe đua Chibi siêu tốc, tăng ga vượt chướng ngại vật phép tính về đích vinh quang!',
    taglineEn: 'High-speed Chibi racing with rapid math calculations and rainbow tracks.',
    colorName: 'Đỏ cam và Xanh dương',
    accentHex: '#EA580C',
    bgGrad: 'from-orange-500 to-red-500',
    borderTheme: 'border-orange-300 hover:border-orange-500',
    imageSrc: '/images/zone-7-racing.png',
    illustrationType: 'racing',
  },
  {
    id: 'zone-8-treasure',
    number: 8,
    nameVi: 'ĐẢO KHO BÁU TOÁN HỌC',
    nameEn: 'MATH TREASURE ISLAND',
    topicTitleVi: 'Thử thách tổng hợp và khám phá kiến thức',
    taglineVi: 'Tìm chìa khóa vàng mở rương kho báu ngôi sao trên hòn đảo nhiệt đới giữa hồ nước ngọc!',
    taglineEn: 'Find golden keys to unlock star treasure chests in tropical island paradise.',
    colorName: 'Vàng ánh kim và Xanh ngọc',
    accentHex: '#D97706',
    bgGrad: 'from-amber-400 to-yellow-500',
    borderTheme: 'border-amber-300 hover:border-amber-500',
    imageSrc: '/images/zone-8-treasure.png',
    illustrationType: 'treasure',
  },
];
