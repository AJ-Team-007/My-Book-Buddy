import React, { useState } from 'react';
import {
  X,
  Send,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { BookListing, FilterState, ScreenId, StudentUser } from '../types';
import { getConditionBadgeStyle } from './BookCard';

interface RequestToBuyModalProps {
  book: BookListing | null;
  currentUser: StudentUser;
  onClose: () => void;
  onSubmitRequest: (book: BookListing, buyerName: string, message: string) => void;
}

export const RequestToBuyModal: React.FC<RequestToBuyModalProps> = ({
  book,
  currentUser,
  onClose,
  onSubmitRequest,
}) => {
  const [buyerName, setBuyerName] = useState(currentUser.displayName);
  const [message, setMessage] = useState(
    'Hi, I’m interested in this book. Is it still available?'
  );

  if (!book) return null;

  const maxChars = 250;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) return;
    onSubmitRequest(
      book,
      buyerName.trim(),
      message.trim() || 'Hi, I’m interested in this book. Is it still available?'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#0B0F26] border border-[#7B3FE4]/50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-extrabold text-white">Request to Buy</h3>
            <p className="text-xs text-slate-400">
              Send a buy request & start chatting with {book.sellerName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 p-3 rounded-2xl bg-[#121836] border border-white/10 flex items-center gap-3.5">
          <img
            src={book.coverImage}
            alt={book.title}
            referrerPolicy="no-referrer"
            className="w-14 h-20 rounded-xl object-cover shrink-0 border border-white/10"
          />
          <div className="min-w-0 flex-1">
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border mb-1 ${getConditionBadgeStyle(
                book.condition
              )}`}
            >
              {book.condition}
            </span>
            <h4 className="text-sm font-bold text-white truncate">{book.title}</h4>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-base font-extrabold text-[#FFD13B] font-mono-num">
                ₹{book.price}
              </span>
              <span className="text-xs text-slate-500 line-through font-mono-num">
                ₹{book.originalPrice}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Your Name <span className="text-[#FF2E93]">*</span>
            </label>
            <input
              type="text"
              required
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="Enter your student name"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121836] border border-white/15 focus:border-[#38BDF8] text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Message (Optional)
              </label>
              <span className="text-[11px] text-slate-400 font-mono-num">
                {message.length}/{maxChars}
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={maxChars}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, I’m interested in this book. Is it still available?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121836] border border-white/15 focus:border-[#38BDF8] text-sm text-white placeholder-slate-500 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:brightness-110 text-white text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface SearchFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (newFilters: FilterState) => void;
  onResetFilters: () => void;
}

export const SearchFiltersModal: React.FC<SearchFiltersModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [local, setLocal] = useState<FilterState>(filters);

  React.useEffect(() => {
    setLocal(filters);
  }, [filters, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0B0F26] border border-[#7B3FE4]/50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#38BDF8]" />
            <h3 className="text-lg font-extrabold text-white">Search & Filters</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Search Keyword
            </label>
            <input
              type="text"
              value={local.search}
              onChange={(e) => setLocal({ ...local, search: e.target.value })}
              placeholder="Search by book title, author, or subject..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121836] border border-white/15 focus:border-[#38BDF8] text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Sort By</label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'newest', label: 'Newest' },
                  { id: 'price-asc', label: 'Lowest Price' },
                  { id: 'price-desc', label: 'Highest Price' },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setLocal({ ...local, sortBy: s.id })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    local.sortBy === s.id
                      ? 'bg-gradient-to-r from-[#7B3FE4] to-[#FF2E93] text-white border-transparent shadow-[0_0_12px_rgba(123,63,228,0.4)]'
                      : 'bg-[#121836] text-slate-300 border-white/10 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Class</label>
              <select
                value={local.classGrade}
                onChange={(e) => setLocal({ ...local, classGrade: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#121836] border border-white/15 text-xs text-white"
              >
                <option value="All">All Classes</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Board</label>
              <select
                value={local.board}
                onChange={(e) => setLocal({ ...local, board: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#121836] border border-white/15 text-xs text-white"
              >
                <option value="All">All Boards</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">State Board</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Subject</label>
              <select
                value={local.subject}
                onChange={(e) => setLocal({ ...local, subject: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#121836] border border-white/15 text-xs text-white"
              >
                <option value="All">All Subjects</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Medium</label>
              <select
                value={local.medium}
                onChange={(e) => setLocal({ ...local, medium: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#121836] border border-white/15 text-xs text-white"
              >
                <option value="All">All Mediums</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Condition</label>
              <select
                value={local.condition}
                onChange={(e) => setLocal({ ...local, condition: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#121836] border border-white/15 text-xs text-white"
              >
                <option value="All">Any Condition</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Used">Used</option>
                <option value="Heavily Used">Heavily Used</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Availability</label>
              <select
                value={local.availability}
                onChange={(e) => setLocal({ ...local, availability: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#121836] border border-white/15 text-xs text-white"
              >
                <option value="All">All Listings</option>
                <option value="Available">Available Only</option>
                <option value="Sold">Sold Books</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Minimum / Maximum Price Range (₹)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min={0}
                value={local.minPrice}
                onChange={(e) => setLocal({ ...local, minPrice: e.target.value })}
                placeholder="Min ₹ (e.g. 100)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121836] border border-white/15 text-xs text-white font-mono-num"
              />
              <input
                type="number"
                min={0}
                value={local.maxPrice}
                onChange={(e) => setLocal({ ...local, maxPrice: e.target.value })}
                placeholder="Max ₹ (e.g. 400)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121836] border border-white/15 text-xs text-white font-mono-num"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onResetFilters();
                onClose();
              }}
              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onApplyFilters(local);
                onClose();
              }}
              className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-[#7B3FE4] to-[#FF2E93] hover:brightness-110 text-white text-sm font-bold shadow-[0_0_20px_rgba(123,63,228,0.4)]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ReportModalProps {
  bookTitle: string | null;
  onClose: () => void;
  onReported: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  bookTitle,
  onClose,
  onReported,
}) => {
  const [reason, setReason] = useState('Inaccurate condition or price');
  const [notes, setNotes] = useState('');

  if (!bookTitle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#0B0F26] border border-rose-500/40 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-extrabold text-white">Report Listing</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 mt-3">
          Reporting <span className="font-bold text-white">“{bookTitle}”</span> for review by the student safety moderators.
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#121836] border border-white/15 text-xs text-white"
            >
              <option value="Inaccurate condition or price">Inaccurate condition or price</option>
              <option value="Book already sold outside">Book already sold</option>
              <option value="Duplicate student listing">Duplicate student listing</option>
              <option value="Inappropriate content">Inappropriate content</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Additional Details</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Explain the issue briefly..."
              className="w-full px-3 py-2 rounded-xl bg-[#121836] border border-white/15 text-xs text-white resize-none"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 text-xs font-bold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onReported();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white"
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TOUR_STEPS: {
  step: number;
  screen: ScreenId;
  title: string;
  description: string;
}[] = [
  {
    step: 1,
    screen: 'browse',
    title: '1/7 • Browse School Books',
    description: 'Students filter textbooks by Class, Subject, Board, and Condition at affordable prices.',
  },
  {
    step: 2,
    screen: 'book-details',
    title: '2/7 • Inspect Book Details',
    description: 'Check multi-angle book previews, edition metadata, seller profile, and savings.',
  },
  {
    step: 3,
    screen: 'book-details',
    title: '3/7 • Send Request to Buy',
    description: 'Click "Request to Buy" to send an instant request without needing online payment gateways.',
  },
  {
    step: 4,
    screen: 'messages',
    title: '4/7 • Student Messages Inbox',
    description: 'All textbook inquiries and unread conversations stay organized in one student inbox.',
  },
  {
    step: 5,
    screen: 'chat',
    title: '5/7 • Real-Time Student Chat',
    description: 'Coordinate a safe school-gate or library exchange and test live replies with "⚡ Partner Reply".',
  },
  {
    step: 6,
    screen: 'dashboard',
    title: '6/7 • My Dashboard & Listings',
    description: 'Manage active listings, edit book details, or mark books as Sold once exchanged.',
  },
  {
    step: 7,
    screen: 'requests',
    title: '7/7 • Accept or Manage Buy Requests',
    description: 'Review incoming requests from fellow students and accept or open chat directly.',
  },
];

interface DemoTourBannerProps {
  tourStep: number | null;
  onNextStep: () => void;
  onPrevStep: () => void;
  onEndTour: () => void;
}

export const DemoTourBanner: React.FC<DemoTourBannerProps> = ({
  tourStep,
  onNextStep,
  onPrevStep,
  onEndTour,
}) => {
  if (tourStep === null) return null;
  const current = TOUR_STEPS[tourStep] || TOUR_STEPS[0];

  return (
    <div className="bg-gradient-to-r from-[#7B3FE4] via-[#9D4EDD] to-[#FF2E93] text-white px-4 py-2.5 shadow-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-0.5 rounded-full bg-black/30 text-[#FFD13B] text-xs font-extrabold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Science Fair Tour
          </span>
          <div>
            <span className="text-xs sm:text-sm font-extrabold mr-2">{current.title}:</span>
            <span className="text-xs text-white/90">{current.description}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={onPrevStep}
            disabled={tourStep === 0}
            className="px-2.5 py-1 rounded-lg bg-black/25 hover:bg-black/40 disabled:opacity-40 text-xs font-bold flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>
          <button
            type="button"
            onClick={onNextStep}
            className="px-3 py-1 rounded-lg bg-[#FFD13B] text-[#070A18] hover:brightness-105 text-xs font-extrabold flex items-center gap-1"
          >
            {tourStep === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onEndTour}
            className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white"
            title="Exit Demo Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="fixed bottom-20 lg:bottom-8 right-4 z-50 max-w-sm">
      <div className="px-4 py-3 rounded-2xl bg-[#121836] border border-[#10B981] shadow-[0_10px_30px_rgba(16,185,129,0.35)] flex items-center gap-3 text-white">
        <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
        <span className="text-xs font-bold">{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
