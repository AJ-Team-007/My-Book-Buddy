import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

interface BrandLogoProps {
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  onClick,
  size = 'md',
  showSubtitle = true,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-2.5 text-left focus:outline-none"
    >
      <div
        className={`${iconSizes[size]} relative rounded-xl bg-gradient-to-br from-[#FF2E93] via-[#7B3FE4] to-[#00E5FF] p-[1.5px] shadow-[0_0_20px_rgba(123,63,228,0.45)] group-hover:shadow-[0_0_25px_rgba(255,46,147,0.65)] transition-all duration-200 shrink-0`}
      >
        <div className="w-full h-full bg-[#0B0F26] rounded-[10px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#FF2E93]/20 via-transparent to-[#00E5FF]/25" />
          <BookOpen className="w-5 h-5 text-[#00E5FF] relative z-10 group-hover:scale-110 transition-transform" />
          <Sparkles className="w-2.5 h-2.5 text-[#FF2E93] absolute top-1.5 right-1.5 animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col">
        <div className={`${titleSizes[size]} font-extrabold tracking-tight leading-none flex items-center gap-1`}>
          <span className="bg-gradient-to-r from-[#FF2E93] to-[#FF6BB5] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,46,147,0.35)]">
            My Book
          </span>
          <span className="bg-gradient-to-r from-[#38BDF8] to-[#00E5FF] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,229,255,0.35)]">
            Buddy
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 tracking-wider mt-0.5 whitespace-nowrap">
            Buy • Sell • Share • Learn
          </span>
        )}
      </div>
    </button>
  );
};
