/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface FullscreenStageProps {
  titleVi: string;
  titleEn?: string;
  categoryBadge?: string;
  onBack?: () => void;
  topRightControls?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * FullscreenStage provides a strict 16:9 auto-fit layout optimized for
 * all device screens (smartboards, classroom TVs, PCs, laptops, iPads, tablets).
 * Features:
 * - Pure responsive CSS: aspect-ratio: 16 / 9, auto-fits actual device viewport.
 * - Fits within 100dvh without vertical or horizontal scrollbars.
 * - Zero fullscreen buttons or browser fullscreen API calls.
 * - Organized in clean proportions: Top header (~10-12%), Middle play area (~65-75%), Bottom controls (~15-20%).
 */
export const FullscreenStage: React.FC<FullscreenStageProps> = ({
  titleVi,
  titleEn,
  categoryBadge,
  onBack,
  topRightControls,
  children,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full min-h-[100dvh] md:min-h-0 md:aspect-[16/9] md:max-w-[calc((100dvh-1rem)*16/9)] md:max-h-[calc(100dvh-1rem)] mx-auto bg-slate-900/5 rounded-2xl md:rounded-3xl overflow-y-auto md:overflow-hidden border-2 border-slate-200/80 shadow-2xl flex flex-col justify-between select-none ${className}`}
    >
      {/* Top Header Bar: Title, Category Badge, Back Button and Controls (NO Fullscreen button) */}
      <div className="shrink-0 px-3 py-2 sm:px-5 sm:py-2 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between gap-2.5 z-30 sticky top-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 min-h-[40px] px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer transition-all active:scale-95 shrink-0"
              title="Quay lại danh sách"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Quay lại</span>
            </button>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {categoryBadge && (
                <span className="text-[10px] sm:text-xs font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 shrink-0">
                  {categoryBadge}
                </span>
              )}
              <h2 className="text-xs sm:text-sm md:text-base font-black text-slate-900 truncate font-heading">
                {titleVi}
              </h2>
            </div>
            {titleEn && (
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate font-semibold">
                {titleEn}
              </p>
            )}
          </div>
        </div>

        {/* Right side controls (sound, restart, etc. - NO fullscreen button) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {topRightControls}
        </div>
      </div>

      {/* Main Content Body (Scrollable on mobile if needed, zero scrollbars on 16:9 desktop) */}
      <div className="flex-1 w-full h-full min-h-0 overflow-y-auto md:overflow-hidden flex flex-col justify-between bg-white relative">
        {children}
      </div>
    </div>
  );
};
