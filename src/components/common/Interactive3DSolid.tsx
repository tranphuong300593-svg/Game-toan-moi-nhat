/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Layers } from 'lucide-react';

interface Interactive3DSolidProps {
  solidType: 'cube' | 'cuboid';
  onFaceInspect?: (faceName: string) => void;
  className?: string;
}

export const Interactive3DSolid: React.FC<Interactive3DSolidProps> = ({
  solidType,
  onFaceInspect,
  className = '',
}) => {
  // Rotation angles in degrees
  const [rotX, setRotX] = useState<number>(-20);
  const [rotY, setRotY] = useState<number>(35);
  const [zoom, setZoom] = useState<number>(1);
  const [isAutoSpin, setIsAutoSpin] = useState<boolean>(true);
  const [activeFace, setActiveFace] = useState<string | null>(null);

  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const isCube = solidType === 'cube';

  // Dimensions in pixels for 3D faces
  // Cube: 130 x 130 x 130
  // Cuboid: 170 (width) x 110 (height) x 90 (depth)
  const size = isCube
    ? { w: 130, h: 130, d: 130 }
    : { w: 170, h: 110, d: 90 };

  const halfW = size.w / 2;
  const halfH = size.h / 2;
  const halfD = size.d / 2;

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    setIsAutoSpin(false);
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setRotY((prev) => (prev + deltaX * 0.8) % 360);
    setRotX((prev) => Math.max(-80, Math.min(80, prev - deltaY * 0.8)));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      setIsAutoSpin(false);
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - lastMousePosRef.current.x;
    const deltaY = e.touches[0].clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setRotY((prev) => (prev + deltaX * 0.8) % 360);
    setRotX((prev) => Math.max(-80, Math.min(80, prev - deltaY * 0.8)));
  };

  const handleFaceClick = (faceName: string, shapeDescription: string) => {
    setActiveFace(faceName);
    onFaceInspect?.(`${faceName}: ${shapeDescription}`);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white select-none shadow-xl border-2 border-indigo-400/40 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* 3D Model Header Badges */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-indigo-500/30">
        <div className="flex items-center gap-2">
          <span className="text-xl">{isCube ? '🎲' : '🧃'}</span>
          <div>
            <h4 className="text-sm md:text-base font-black text-amber-300 font-heading">
              {isCube ? 'MÔ HÌNH 3D: KHỐI LẬP PHƯƠNG' : 'MÔ HÌNH 3D: KHỐI HỘP CHỮ NHẬT'}
            </h4>
            <p className="text-[10px] text-indigo-200">
              {isCube ? 'Cube (6 mặt hình vuông)' : 'Cuboid (6 mặt hình chữ nhật)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isAutoSpin
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
            title="Bật/Tắt tự động xoay"
          >
            <RotateCw className={`w-3.5 h-3.5 inline mr-1 ${isAutoSpin ? 'animate-spin' : ''}`} />
            <span>{isAutoSpin ? 'Đang xoay' : 'Xoay tự do'}</span>
          </button>
        </div>
      </div>

      {/* 3D Viewport Arena */}
      <div
        className="relative w-72 h-64 md:w-80 md:h-72 flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ perspective: '900px' }}
      >
        {/* Floating guidance hint */}
        <div className="absolute top-2 left-2 text-[10px] bg-black/50 text-indigo-200 px-2.5 py-1 rounded-full border border-indigo-500/30 pointer-events-none z-20">
          👆 Kéo chuột hoặc vuốt để xoay khối 360°
        </div>

        {/* 3D Object with 6 faces */}
        <div
          className="relative transition-transform duration-75"
          style={{
            width: `${size.w}px`,
            height: `${size.h}px`,
            transformStyle: 'preserve-3d',
            transform: `scale(${zoom}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            animation: isAutoSpin ? 'spin3d 10s linear infinite' : 'none',
          }}
        >
          {/* FACE 1: FRONT */}
          <div
            onClick={() => handleFaceClick('Mặt trước', isCube ? 'Hình vuông' : 'Hình chữ nhật')}
            className={`absolute inset-0 flex flex-col items-center justify-center font-black text-xs md:text-sm border-2 rounded-lg cursor-pointer transition-colors shadow-lg ${
              isCube
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-200 text-amber-950'
                : 'bg-gradient-to-br from-cyan-400 to-blue-600 border-cyan-200 text-white'
            }`}
            style={{
              width: `${size.w}px`,
              height: `${size.h}px`,
              transform: `translateZ(${halfD}px)`,
            }}
          >
            <span>Mặt Trước</span>
            <span className="text-[10px] opacity-80">{isCube ? 'Hình vuông' : 'Hình chữ nhật'}</span>
          </div>

          {/* FACE 2: BACK */}
          <div
            onClick={() => handleFaceClick('Mặt sau', isCube ? 'Hình vuông' : 'Hình chữ nhật')}
            className={`absolute inset-0 flex flex-col items-center justify-center font-black text-xs md:text-sm border-2 rounded-lg cursor-pointer transition-colors shadow-lg ${
              isCube
                ? 'bg-gradient-to-br from-amber-500 to-orange-600 border-amber-300 text-amber-950'
                : 'bg-gradient-to-br from-cyan-500 to-blue-700 border-cyan-300 text-white'
            }`}
            style={{
              width: `${size.w}px`,
              height: `${size.h}px`,
              transform: `rotateY(180deg) translateZ(${halfD}px)`,
            }}
          >
            <span>Mặt Sau</span>
            <span className="text-[10px] opacity-80">{isCube ? 'Hình vuông' : 'Hình chữ nhật'}</span>
          </div>

          {/* FACE 3: LEFT */}
          <div
            onClick={() => handleFaceClick('Mặt bên trái', isCube ? 'Hình vuông' : 'Hình chữ nhật')}
            className={`absolute flex flex-col items-center justify-center font-black text-xs md:text-sm border-2 rounded-lg cursor-pointer transition-colors shadow-lg ${
              isCube
                ? 'bg-gradient-to-br from-orange-400 to-amber-600 border-amber-300 text-amber-950'
                : 'bg-gradient-to-br from-sky-400 to-indigo-600 border-sky-300 text-white'
            }`}
            style={{
              width: `${size.d}px`,
              height: `${size.h}px`,
              left: `${halfW - halfD}px`,
              transform: `rotateY(-90deg) translateZ(${halfW}px)`,
            }}
          >
            <span>Bên Trái</span>
            <span className="text-[9px] opacity-80">{isCube ? 'Hình vuông' : 'Hình chữ nhật'}</span>
          </div>

          {/* FACE 4: RIGHT */}
          <div
            onClick={() => handleFaceClick('Mặt bên phải', isCube ? 'Hình vuông' : 'Hình chữ nhật')}
            className={`absolute flex flex-col items-center justify-center font-black text-xs md:text-sm border-2 rounded-lg cursor-pointer transition-colors shadow-lg ${
              isCube
                ? 'bg-gradient-to-br from-orange-500 to-amber-600 border-amber-300 text-amber-950'
                : 'bg-gradient-to-br from-sky-500 to-indigo-700 border-sky-300 text-white'
            }`}
            style={{
              width: `${size.d}px`,
              height: `${size.h}px`,
              left: `${halfW - halfD}px`,
              transform: `rotateY(90deg) translateZ(${halfW}px)`,
            }}
          >
            <span>Bên Phải</span>
            <span className="text-[9px] opacity-80">{isCube ? 'Hình vuông' : 'Hình chữ nhật'}</span>
          </div>

          {/* FACE 5: TOP */}
          <div
            onClick={() => handleFaceClick('Mặt trên', isCube ? 'Hình vuông' : 'Hình chữ nhật')}
            className={`absolute flex flex-col items-center justify-center font-black text-xs md:text-sm border-2 rounded-lg cursor-pointer transition-colors shadow-lg ${
              isCube
                ? 'bg-gradient-to-br from-yellow-300 to-amber-400 border-yellow-100 text-amber-950'
                : 'bg-gradient-to-br from-teal-300 to-cyan-500 border-teal-100 text-slate-900'
            }`}
            style={{
              width: `${size.w}px`,
              height: `${size.d}px`,
              top: `${halfH - halfD}px`,
              transform: `rotateX(90deg) translateZ(${halfH}px)`,
            }}
          >
            <span>Mặt Trên</span>
            <span className="text-[9px] opacity-80">{isCube ? 'Hình vuông' : 'Hình chữ nhật'}</span>
          </div>

          {/* FACE 6: BOTTOM */}
          <div
            onClick={() => handleFaceClick('Mặt đáy (dưới)', isCube ? 'Hình vuông' : 'Hình chữ nhật')}
            className={`absolute flex flex-col items-center justify-center font-black text-xs md:text-sm border-2 rounded-lg cursor-pointer transition-colors shadow-lg ${
              isCube
                ? 'bg-gradient-to-br from-amber-600 to-orange-700 border-amber-400 text-white'
                : 'bg-gradient-to-br from-blue-700 to-indigo-900 border-blue-400 text-white'
            }`}
            style={{
              width: `${size.w}px`,
              height: `${size.d}px`,
              top: `${halfH - halfD}px`,
              transform: `rotateX(-90deg) translateZ(${halfH}px)`,
            }}
          >
            <span>Mặt Đáy</span>
            <span className="text-[9px] opacity-80">{isCube ? 'Hình vuông' : 'Hình chữ nhật'}</span>
          </div>
        </div>

        {/* Shadow under the solid */}
        <div
          className="absolute bottom-4 w-44 h-8 bg-black/60 rounded-full blur-md pointer-events-none"
          style={{ transform: 'scale(1, 0.4)' }}
        />
      </div>

      {/* Zoom and Orientation Controls */}
      <div className="w-full flex items-center justify-between pt-2 border-t border-indigo-500/30 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-indigo-200">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.4, z + 0.15))}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            title="Phóng to"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[11px] text-amber-300 font-bold">
          {activeFace ? `👉 Vừa chạm: ${activeFace}` : 'Chạm vào từng mặt để kiểm tra'}
        </div>

        <button
          onClick={() => {
            setRotX(-20);
            setRotY(35);
            setZoom(1);
          }}
          className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white cursor-pointer"
        >
          Đặt lại góc nhìn
        </button>
      </div>

      {/* Key Architectural Truth Box */}
      <div className="mt-3 w-full bg-indigo-900/50 p-2.5 rounded-2xl border border-indigo-400/30 text-center">
        <div className="text-xs font-black text-amber-300">
          {isCube
            ? '⭐ ĐẶC ĐIỂM CHUẨN: Khối lập phương có 6 mặt ĐỀU LÀ HÌNH VUÔNG!'
            : '⭐ ĐẶC ĐIỂM CHUẨN: Khối hộp chữ nhật có 6 mặt LÀ HÌNH CHỮ NHẬT!'}
        </div>
        <p className="text-[10px] text-indigo-200 mt-0.5">
          {isCube
            ? 'Vật thật điển hình: Quân xúc xắc 🎲, Hộp quà vuông 🎁, Khối Rubik 🧊'
            : 'Vật thật điển hình: Hộp sữa 🧃, Bao diêm, Viên gạch 🧱, Hộp bánh quy 📦'}
        </p>
      </div>

      <style>{`
        @keyframes spin3d {
          0% {
            transform: scale(${zoom}) rotateX(-20deg) rotateY(0deg);
          }
          100% {
            transform: scale(${zoom}) rotateX(-20deg) rotateY(360deg);
          }
        }
      `}</style>
    </div>
  );
};
