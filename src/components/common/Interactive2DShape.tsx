/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, RotateCw, CheckCircle2, Sparkles, Info } from 'lucide-react';
import { soundService } from '../../services/audioService';

export type ShapeCategory = 'square' | 'circle' | 'triangle' | 'rectangle';

interface Interactive2DShapeProps {
  initialShape?: ShapeCategory;
  onShapeSelect?: (shape: ShapeCategory) => void;
  className?: string;
}

export const Interactive2DShape: React.FC<Interactive2DShapeProps> = ({
  initialShape = 'square',
  onShapeSelect,
  className = '',
}) => {
  const [selectedShape, setSelectedShape] = useState<ShapeCategory>(initialShape);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [showProperties, setShowProperties] = useState<boolean>(true);
  const [testedOrientation, setTestedOrientation] = useState<boolean>(false);

  const shapesInfo: Record<
    ShapeCategory,
    {
      nameVi: string;
      nameEn: string;
      color: string;
      borderColor: string;
      sidesCount: number;
      cornersCount: number;
      explanationVi: string;
      realLifeObjects: { name: string; emoji: string }[];
    }
  > = {
    square: {
      nameVi: 'Hình vuông',
      nameEn: 'Square',
      color: 'fill-amber-400',
      borderColor: 'stroke-amber-600',
      sidesCount: 4,
      cornersCount: 4,
      explanationVi: 'Hình vuông có 4 cạnh thẳng bằng nhau và 4 góc vuông.',
      realLifeObjects: [
        { name: 'Mặt xúc xắc', emoji: '🎲' },
        { name: 'Khung ảnh vuông', emoji: '🖼️' },
        { name: 'Viên gạch hoa lát nền', emoji: '🟨' },
        { name: 'Chiếc bánh chưng', emoji: '🫔' },
      ],
    },
    circle: {
      nameVi: 'Hình tròn',
      nameEn: 'Circle',
      color: 'fill-rose-400',
      borderColor: 'stroke-rose-600',
      sidesCount: 0,
      cornersCount: 0,
      explanationVi: 'Hình tròn là đường cong tròn khép kín, không có cạnh thẳng và không có góc.',
      realLifeObjects: [
        { name: 'Mặt đồng hồ', emoji: '⏰' },
        { name: 'Bánh xe đạp', emoji: '🚲' },
        { name: 'Chiếc đĩa ăn', emoji: '🍽️' },
        { name: 'Đồng xu', emoji: '🪙' },
      ],
    },
    triangle: {
      nameVi: 'Hình tam giác',
      nameEn: 'Triangle',
      color: 'fill-emerald-400',
      borderColor: 'stroke-emerald-600',
      sidesCount: 3,
      cornersCount: 3,
      explanationVi: 'Hình tam giác có 3 cạnh thẳng và 3 góc. Dù quay theo hướng nào thì vẫn là hình tam giác!',
      realLifeObjects: [
        { name: 'Biển báo giao thông', emoji: '⚠️' },
        { name: 'Mái nhà', emoji: '🏠' },
        { name: 'Miếng dưa hấu cắt', emoji: '🍉' },
        { name: 'Cánh buồm con thuyền', emoji: '⛵' },
      ],
    },
    rectangle: {
      nameVi: 'Hình chữ nhật',
      nameEn: 'Rectangle',
      color: 'fill-sky-400',
      borderColor: 'stroke-sky-600',
      sidesCount: 4,
      cornersCount: 4,
      explanationVi: 'Hình chữ nhật có 2 cạnh dài bằng nhau, 2 cạnh ngắn bằng nhau và 4 góc vuông. Đặt nằm ngang hay dựng đứng đều là hình chữ nhật!',
      realLifeObjects: [
        { name: 'Phong bì thư', emoji: '✉️' },
        { name: 'Bảng đen lớp học', emoji: '📋' },
        { name: 'Cánh cửa ra vào', emoji: '🚪' },
        { name: 'Quyển sách Toán 1', emoji: '📕' },
      ],
    },
  };

  const current = shapesInfo[selectedShape];

  const handleSelect = (shape: ShapeCategory) => {
    setSelectedShape(shape);
    setRotationAngle(0);
    setTestedOrientation(false);
    onShapeSelect?.(shape);
    soundService.playClick();
  };

  const handleRotate = () => {
    const next = (rotationAngle + 90) % 360;
    setRotationAngle(next);
    setTestedOrientation(true);
    soundService.playPop();
  };

  const handleSpeakEn = () => {
    soundService.speakEn(current.nameEn);
  };

  return (
    <div className={`p-5 bg-gradient-to-br from-indigo-50/70 via-sky-50 to-purple-50 rounded-3xl border-2 border-indigo-200 shadow-sm space-y-4 ${className}`}>
      {/* 4 Tabs to Select Shapes */}
      <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
        <div className="flex flex-wrap gap-2">
          {(['square', 'circle', 'triangle', 'rectangle'] as ShapeCategory[]).map((shp) => {
            const isAct = selectedShape === shp;
            const info = shapesInfo[shp];

            return (
              <button
                key={shp}
                onClick={() => handleSelect(shp)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl font-black text-xs md:text-sm border-2 transition-all cursor-pointer ${
                  isAct
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105'
                    : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200'
                }`}
              >
                <span>{shp === 'square' ? '🟧' : shp === 'circle' ? '🔴' : shp === 'triangle' ? '🔺' : '🟦'}</span>
                <span>{info.nameVi}</span>
                <span className="text-[10px] opacity-75 hidden sm:inline">({info.nameEn})</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleRotate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-xs cursor-pointer active:scale-95"
          title="Xoay hình 90 độ để kiểm tra tính chất hình học"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Xoay hình ({rotationAngle}°)</span>
        </button>
      </div>

      {/* Main Canvas: Mathematical Geometric SVG Illustration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Left: SVG Canvas with Pure Geometry */}
        <div className="relative w-full h-64 bg-white rounded-2xl border-2 border-indigo-200 flex flex-col items-center justify-center p-4 overflow-hidden shadow-xs">
          <div className="absolute top-2 left-3 flex items-center gap-2">
            <span className="text-xs font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              Mô hình hình học chuẩn
            </span>
            <button
              onClick={handleSpeakEn}
              className="px-2.5 py-1 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold text-xs cursor-pointer flex items-center gap-1 shadow-xs"
              title="Nghe phát âm tiếng Anh chuẩn en-US"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>🔊 en-US</span>
            </button>
          </div>

          <div
            className="transition-transform duration-500 ease-out flex items-center justify-center p-4"
            style={{ transform: `rotate(${rotationAngle}deg)` }}
          >
            {/* 1. SQUARE: Exact 1:1 ratio, pure vector, no stroke, no rounded corners */}
            {selectedShape === 'square' && (
              <div className="flex flex-col items-center">
                <svg width="140" height="140" viewBox="0 0 140 140" className="select-none">
                  <rect x="0" y="0" width="140" height="140" rx="0" ry="0" fill="#22c55e" stroke="none" />
                </svg>
              </div>
            )}

            {/* 2. CIRCLE: Exact smooth curve, no stroke, no distortion */}
            {selectedShape === 'circle' && (
              <div className="flex flex-col items-center">
                <svg width="140" height="140" viewBox="0 0 140 140" className="select-none">
                  <circle cx="70" cy="70" r="70" fill="#ef4444" stroke="none" />
                </svg>
              </div>
            )}

            {/* 3. TRIANGLE: 3 straight edges and 3 vertices, no stroke */}
            {selectedShape === 'triangle' && (
              <div className="flex flex-col items-center">
                <svg width="140" height="140" viewBox="0 0 140 140" className="select-none">
                  <polygon points="70,0 0,140 140,140" fill="#eab308" stroke="none" />
                </svg>
              </div>
            )}

            {/* 4. RECTANGLE: Clear aspect ratio (190 x 110), 4 right angles, no stroke, no rounded corners */}
            {selectedShape === 'rectangle' && (
              <div className="flex flex-col items-center">
                <svg width="190" height="110" viewBox="0 0 190 110" className="select-none">
                  <rect x="0" y="0" width="190" height="110" rx="0" ry="0" fill="#3b82f6" stroke="none" />
                </svg>
              </div>
            )}
          </div>

          {/* Orientation feedback */}
          {testedOrientation && (
            <div className="absolute bottom-2 inset-x-2 text-center text-[10px] font-bold text-emerald-700 bg-emerald-50 py-1 rounded-lg border border-emerald-200 animate-scale-in">
              ✓ Khi xoay {rotationAngle}°, đây vẫn là <strong>{current.nameVi} ({current.nameEn})</strong>!
            </div>
          )}
        </div>

        {/* Right: Real-Life Objects Matching Grid */}
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-2xl border border-indigo-200">
            <div className="flex items-center gap-1.5 text-xs font-black text-indigo-950 pb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Đặc điểm toán học chuẩn lớp 1:</span>
            </div>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
              {current.explanationVi}
            </p>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-indigo-200 space-y-2">
            <span className="text-xs font-black text-indigo-900 block">
              Đồ vật thực tế có dạng {current.nameVi}:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {current.realLifeObjects.map((obj, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-indigo-50/50 rounded-xl border border-slate-200 transition-colors"
                >
                  <span className="text-2xl">{obj.emoji}</span>
                  <span className="text-xs font-bold text-slate-700">{obj.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
