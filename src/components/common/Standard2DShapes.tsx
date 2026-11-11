/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export type StandardShapeType = 'square' | 'rectangle' | 'triangle' | 'circle';

export interface ShapeStyleConfig {
  nameVi: string;
  nameEn: string;
  defaultColor: string;
}

export const STANDARD_SHAPES_CONFIG: Record<StandardShapeType, ShapeStyleConfig> = {
  circle: {
    nameVi: 'Hình tròn',
    nameEn: 'Circle',
    defaultColor: '#ef4444', // Đỏ tươi chuẩn
  },
  triangle: {
    nameVi: 'Hình tam giác',
    nameEn: 'Triangle',
    defaultColor: '#eab308', // Vàng tươi chuẩn
  },
  square: {
    nameVi: 'Hình vuông',
    nameEn: 'Square',
    defaultColor: '#22c55e', // Xanh lá chuẩn
  },
  rectangle: {
    nameVi: 'Hình chữ nhật',
    nameEn: 'Rectangle',
    defaultColor: '#3b82f6', // Xanh dương chuẩn
  },
};

/**
 * Normalizes any shape string (Vietnamese text, English text, or key) to StandardShapeType.
 */
export function normalizeShapeKey(val: any): StandardShapeType | null {
  if (!val) return null;
  const s = String(val).trim().toLowerCase();
  if (s === 'square' || s === 'hình vuông' || s.includes('vuông')) return 'square';
  if (s === 'rectangle' || s === 'hình chữ nhật' || s.includes('chữ nhật')) return 'rectangle';
  if (s === 'triangle' || s === 'hình tam giác' || s.includes('tam giác')) return 'triangle';
  if (s === 'circle' || s === 'hình tròn' || s.includes('tròn')) return 'circle';
  return null;
}

/**
 * Checks whether an array of options represents a 2D shape identification question.
 */
export function isShapeOptionsList(options?: (string | number)[]): boolean {
  if (!options || options.length < 2) return false;
  return options.every((opt) => normalizeShapeKey(opt) !== null);
}

// ---------------------------------------------------------------------------
// 1. HÌNH VUÔNG (Square)
// - Đúng 4 cạnh bằng nhau.
// - Đúng 4 góc vuông.
// - Không bo góc (rx=0, ry=0).
// - Không đường viền (stroke=none).
// - Mảng màu đặc rõ ràng.
// ---------------------------------------------------------------------------
interface ShapeProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export const SquareShape: React.FC<ShapeProps> = ({
  size = 130,
  color = STANDARD_SHAPES_CONFIG.square.defaultColor,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`shrink-0 select-none ${className}`}
      style={{ overflow: 'visible' }}
    >
      <rect
        x="0"
        y="0"
        width={size}
        height={size}
        rx="0"
        ry="0"
        fill={color}
        stroke="none"
      />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 2. HÌNH CHỮ NHẬT (Rectangle)
// - 4 góc vuông.
// - Hai cặp cạnh đối diện bằng nhau.
// - Chiều dài và chiều rộng khác nhau rõ ràng (tỉ lệ ~ 1.7:1).
// - Không bo góc (rx=0, ry=0).
// - Không đường viền (stroke=none).
// ---------------------------------------------------------------------------
export const RectangleShape: React.FC<ShapeProps> = ({
  width = 170,
  height = 100,
  color = STANDARD_SHAPES_CONFIG.rectangle.defaultColor,
  className = '',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`shrink-0 select-none ${className}`}
      style={{ overflow: 'visible' }}
    >
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        rx="0"
        ry="0"
        fill={color}
        stroke="none"
      />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 3. HÌNH TAM GIÁC (Triangle)
// - Đúng 3 cạnh thẳng và 3 đỉnh.
// - Không bo góc, không cạnh cong.
// - Không đường viền (stroke=none).
// ---------------------------------------------------------------------------
export const TriangleShape: React.FC<ShapeProps> = ({
  size = 130,
  color = STANDARD_SHAPES_CONFIG.triangle.defaultColor,
  className = '',
}) => {
  // Tam giác cân đều đỉnh trên (size/2, 0) đến đáy (0, size) và (size, size)
  const points = `${size / 2},0 0,${size} ${size},${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`shrink-0 select-none ${className}`}
      style={{ overflow: 'visible' }}
    >
      <polygon points={points} fill={color} stroke="none" />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 4. HÌNH TRÒN (Circle)
// - Tròn đều tuyệt đối, không méo bầu dục.
// - Không đường viền (stroke=none).
// - Không có góc nhọn hay cạnh thẳng.
// ---------------------------------------------------------------------------
export const CircleShape: React.FC<ShapeProps> = ({
  size = 130,
  color = STANDARD_SHAPES_CONFIG.circle.defaultColor,
  className = '',
}) => {
  const r = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`shrink-0 select-none ${className}`}
      style={{ overflow: 'visible' }}
    >
      <circle cx={r} cy={r} r={r} fill={color} stroke="none" />
    </svg>
  );
};

/**
 * Universal shape renderer by key
 */
export const StandardGeometricShape: React.FC<{
  type: StandardShapeType | string;
  size?: number;
  color?: string;
  className?: string;
}> = ({ type, size = 120, color, className = '' }) => {
  const normType = normalizeShapeKey(type) || (String(type).toLowerCase().includes('vuông') ? 'square' : 'circle');
  const chosenColor = color || (STANDARD_SHAPES_CONFIG[normType] ? STANDARD_SHAPES_CONFIG[normType].defaultColor : '#22c55e');

  switch (normType) {
    case 'square':
      return <SquareShape size={size} color={chosenColor} className={className} />;
    case 'rectangle':
      // Chiều rộng = 1.65 x size, chiều cao = 0.95 x size để cân xứng diện tích quan sát
      return (
        <RectangleShape
          width={Math.round(size * 1.55)}
          height={Math.round(size * 0.92)}
          color={chosenColor}
          className={className}
        />
      );
    case 'triangle':
      return <TriangleShape size={size} color={chosenColor} className={className} />;
    case 'circle':
      return <CircleShape size={size} color={chosenColor} className={className} />;
    default:
      return <SquareShape size={size} color={chosenColor} className={className} />;
  }
};

// ---------------------------------------------------------------------------
// 5. SHAPE CHOICE CARD (Đáp án bằng hình trực quan, KHÔNG dùng chữ)
// - Vùng nhấn rộng rãi, trong suốt, không có khung viền giả lập hình khác.
// - Hiển thị nhãn nhỏ A, B, C, D ở góc trên bên ngoài hình.
// - Hiệu ứng chọn đúng/sai hiển thị bên ngoài (glow ánh sáng hoặc badge dấu tích).
// ---------------------------------------------------------------------------
interface ShapeChoiceCardProps {
  shapeKey: StandardShapeType;
  labelIndex?: number; // 0 -> A, 1 -> B, 2 -> C, 3 -> D
  isSelected: boolean;
  isAnswerChecked: boolean;
  isCorrectOption: boolean;
  onClick: () => void;
  disabled?: boolean;
  size?: number;
}

export const ShapeChoiceCard: React.FC<ShapeChoiceCardProps> = ({
  shapeKey,
  labelIndex,
  isSelected,
  isAnswerChecked,
  isCorrectOption,
  onClick,
  disabled = false,
  size = 120,
}) => {
  const letter = labelIndex !== undefined ? String.fromCharCode(65 + labelIndex) : null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative group flex flex-col items-center justify-center p-3 sm:p-5 rounded-3xl transition-all cursor-pointer select-none active:scale-95 ${
        isSelected && !isAnswerChecked
          ? 'bg-sky-50/70 shadow-lg ring-4 ring-sky-300 scale-105'
          : isAnswerChecked && isCorrectOption
          ? 'bg-emerald-50/80 shadow-xl ring-4 ring-emerald-400 scale-105'
          : isAnswerChecked && isSelected && !isCorrectOption
          ? 'bg-rose-50/70 shadow-md ring-4 ring-rose-300 opacity-60'
          : 'bg-transparent hover:bg-slate-50/80 hover:scale-105'
      }`}
      style={{ outline: 'none' }}
    >
      {/* Label A, B, C, D nhỏ ở góc trên để phân biệt vị trí (không phải chữ tên hình) */}
      {letter && (
        <span
          className={`text-xs sm:text-sm font-black mb-2 px-2.5 py-0.5 rounded-full transition-colors ${
            isAnswerChecked && isCorrectOption
              ? 'bg-emerald-500 text-white'
              : isSelected
              ? 'bg-sky-500 text-white'
              : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
          }`}
        >
          {letter}
        </span>
      )}

      {/* Pure Vector Geometric Shape - KHÔNG viền, KHÔNG bo góc */}
      <div className="flex items-center justify-center min-h-[130px] sm:min-h-[140px]">
        <StandardGeometricShape type={shapeKey} size={size} />
      </div>

      {/* External Correct / Incorrect Badges (Bên ngoài hình) */}
      {isAnswerChecked && isCorrectOption && (
        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg animate-bounce">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      )}
      {isAnswerChecked && isSelected && !isCorrectOption && (
        <div className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full shadow-lg">
          <XCircle className="w-6 h-6" />
        </div>
      )}
    </button>
  );
};
