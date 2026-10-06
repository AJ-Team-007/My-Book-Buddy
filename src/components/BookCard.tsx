import React from 'react';
import { Heart, BookOpen, Clock, UserCheck, Sparkles } from 'lucide-react';
import { BookListing, BookCondition } from '../types';

interface BookCardProps {
  book: BookListing;
  isFavorite: boolean;
  onToggleFavorite: (bookId: string, e: React.MouseEvent) => void;
  onSelectBook: (book: BookListing) => void;
  variant?: 'horizontal' | 'grid';
}

export const getConditionBadgeStyle = (condition: BookCondition) => {
  switch (condition) {
    case 'Like New':
      return 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]';
    case 'Good':
      return 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/40 shadow-[0_0_12px_rgba(56,189,248,0.2)]';
    case 'Used':
      return 'bg-[#FFD13B]/15 text-[#FFD13B] border-[#FFD13B]/40';
    case 'Heavily Used':
      return 'bg-[#FF2E93]/15 text-[#FF6BB5] border-[#FF2E93]/40';
    default:
      return 'bg-slate-800 text-slate-300 border-slate-700';
  }
};

export const BookCard: React.FC<BookCardProps> = ({
  book,
  isFavorite,
  onToggleFavorite,
  onSelectBook,
  variant = 'grid',
}) => {
  const [imgError, setImgError] = React.useState(false);

  const discountPercent =
    book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : 0;

  if (variant === 'horizontal') {
    return (
      <div
        onClick={() => onSelectBook(book)}
        className="group relative bg-[#0B0F26]/90 hover:bg-[#121836] border border-white/10 hover:border-[#7B3FE4]/60 rounded-2xl p-3.5 flex gap-4 cursor-pointer transition-all duration-200 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(123,63,228,0.25)]"
      >
        {/* Left Cover */}
        <div className="relative w-24 sm:w-28 h-36 rounded-xl overflow-hidden bg-[#121836] shrink-0 border border-white/10">
          {!imgError ? (
            <img
              src={book.coverImage}
              alt={book.title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#7B3FE4]/40 via-[#0B0F26] to-[#FF2E93]/40 flex flex-col items-center justify-center p-2 text-center">
              <BookOpen className="w-7 h-7 text-[#38BDF8] mb-1" />
              <span className="text-[10px] font-bold text-white line-clamp-2">{book.title}</span>
            </div>
          )}
          {book.status === 'Sold' && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
              <span className="px-2.5 py-1 rounded-full bg-rose-500/90 text-white text-[11px] font-bold uppercase tracking-wider">
                Sold
              </span>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <div className="flex items-start justify-between gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getConditionBadgeStyle(
                  book.condition
                )}`}
              >
                {book.condition}
              </span>
              <button
                type="button"
                onClick={(e) => onToggleFavorite(book.id, e)}
                aria-label="Toggle favorite"
                className={`p-1.5 rounded-full border transition-colors ${
                  isFavorite
                    ? 'bg-[#FF2E93]/20 border-[#FF2E93]/50 text-[#FF2E93]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#FF2E93]' : ''}`} />
              </button>
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-[#38BDF8] transition-colors truncate mt-1.5">
              {book.title}
            </h3>

            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {book.classGrade} • {book.subject} • {book.board}
            </p>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 flex items-end justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-extrabold text-[#FFD13B] font-mono-num drop-shadow-[0_0_8px_rgba(255,209,59,0.25)]">
                  ₹{book.price}
                </span>
                {book.originalPrice > book.price && (
                  <span className="text-xs text-slate-500 line-through font-mono-num">
                    ₹{book.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span className="inline-flex items-center gap-1 text-slate-300 font-medium truncate max-w-[110px]">
                  <UserCheck className="w-3 h-3 text-[#38BDF8] shrink-0" />
                  {book.sellerName}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-0.5 text-slate-400 shrink-0">
                  <Clock className="w-3 h-3" />
                  {book.postedTime}
                </span>
              </div>
            </div>

            <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#7B3FE4] to-[#FF2E93] text-white text-xs font-semibold whitespace-nowrap shadow-[0_0_15px_rgba(123,63,228,0.4)] group-hover:brightness-110 transition-all">
              Details →
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Grid Card (Browse Books & Featured Grid)
  return (
    <div
      onClick={() => onSelectBook(book)}
      className="group relative bg-[#0B0F26]/95 hover:bg-[#121836] border border-white/10 hover:border-[#7B3FE4]/60 rounded-[20px] overflow-hidden flex flex-col cursor-pointer transition-all duration-200 shadow-[0_10px_30px_rgba(0,0,0,0.45)] hover:shadow-[0_10px_35px_rgba(123,63,228,0.3)] hover:-translate-y-0.5"
    >
      {/* Top Book Cover Thumbnail */}
      <div className="relative aspect-[4/3] w-full bg-[#121836] overflow-hidden border-b border-white/10">
        {!imgError ? (
          <img
            src={book.coverImage}
            alt={book.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#7B3FE4]/30 via-[#0B0F26] to-[#00E5FF]/30 flex flex-col items-center justify-center p-4 text-center">
            <BookOpen className="w-10 h-10 text-[#38BDF8] mb-2" />
            <span className="text-sm font-bold text-white">{book.title}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F26] via-transparent to-black/30 opacity-80" />

        {/* Condition Badge Top-Left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md border ${getConditionBadgeStyle(
              book.condition
            )}`}
          >
            {book.condition}
          </span>
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 backdrop-blur-md">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Favorite Heart Button Top-Right */}
        <button
          type="button"
          onClick={(e) => onToggleFavorite(book.id, e)}
          aria-label="Favorite book"
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
            isFavorite
              ? 'bg-[#FF2E93]/25 border-[#FF2E93] text-[#FF2E93] shadow-[0_0_12px_rgba(255,46,147,0.5)]'
              : 'bg-black/40 border-white/15 text-white/80 hover:text-white hover:bg-black/60'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#FF2E93]' : ''}`} />
        </button>

        {/* Bottom Price Overlay on Image */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-[#FFD13B] font-mono-num drop-shadow-[0_2px_10px_rgba(255,209,59,0.4)]">
              ₹{book.price}
            </span>
            {book.originalPrice > book.price && (
              <span className="text-xs text-slate-300/80 line-through font-mono-num">
                ₹{book.originalPrice}
              </span>
            )}
          </div>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
              book.status === 'Available'
                ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {book.status}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-[#38BDF8] transition-colors line-clamp-1">
            {book.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 truncate">
            <span className="text-[#38BDF8] font-medium">{book.classGrade}</span>
            <span>•</span>
            <span>{book.board}</span>
            <span>•</span>
            <span>{book.subject}</span>
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="inline-flex items-center gap-1.5 text-slate-300 font-medium truncate">
              <Sparkles className="w-3.5 h-3.5 text-[#FF2E93] shrink-0" />
              Seller: {book.sellerName}
            </span>
            <span className="text-[11px] text-slate-500 shrink-0">{book.postedTime}</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectBook(book);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#7B3FE4] via-[#9D4EDD] to-[#FF2E93] hover:from-[#6929D4] hover:to-[#E01E7A] text-white text-xs font-bold tracking-wide shadow-[0_4px_15px_rgba(123,63,228,0.35)] transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
