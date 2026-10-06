import React from 'react';
import {
  Search,
  Sparkles,
  GraduationCap,
  Tag,
  ShieldCheck,
  Users,
  ArrowRight,
  BookOpen,
  PlusCircle,
  Compass,
  SlidersHorizontal,
  Send,
  Handshake,
} from 'lucide-react';
import { BookListing, FilterState, ScreenId } from '../types';
import { HERO_BOOKS_IMAGE } from '../data/mockData';
import { BookCard } from './BookCard';

interface HomeViewProps {
  books: BookListing[];
  favorites: string[];
  onToggleFavorite: (bookId: string, e: React.MouseEvent) => void;
  onSelectBook: (book: BookListing) => void;
  onNavigate: (screen: ScreenId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  onSelectSubject: (subject: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  books,
  favorites,
  onToggleFavorite,
  onSelectBook,
  onNavigate,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSelectSubject,
}) => {
  const recentBooks = books.slice(0, 5);

  const highlights = [
    { label: 'For Students', icon: GraduationCap, color: 'text-[#38BDF8]' },
    { label: 'Affordable Prices', icon: Tag, color: 'text-[#FFD13B]' },
    { label: 'Safe Exchange', icon: ShieldCheck, color: 'text-[#10B981]' },
    { label: 'Build a Better Community', icon: Users, color: 'text-[#FF2E93]' },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'List your old book',
      desc: 'Snap a photo, pick class & condition, and set a fair student price.',
      icon: PlusCircle,
      accent: 'from-[#FF2E93] to-[#7B3FE4]',
    },
    {
      step: '2',
      title: 'Another student finds it',
      desc: 'Juniors search by Class, Board, or Subject to find the exact book.',
      icon: Compass,
      accent: 'from-[#7B3FE4] to-[#38BDF8]',
    },
    {
      step: '3',
      title: 'They send a request',
      desc: 'Buyer sends a quick Request to Buy and starts a direct student chat.',
      icon: Send,
      accent: 'from-[#38BDF8] to-[#10B981]',
    },
    {
      step: '4',
      title: 'Arrange a safe exchange',
      desc: 'Meet safely at school library or gate, verify the book, and exchange.',
      icon: Handshake,
      accent: 'from-[#10B981] to-[#FFD13B]',
    },
  ];

  const popularSubjects = [
    'Physics',
    'Chemistry',
    'Mathematics',
    'Biology',
    'English',
    'Computer Science',
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* MAIN HERO SECTION */}
      <section className="relative rounded-3xl bg-gradient-to-br from-[#121836] via-[#0B0F26] to-[#1E1445] border border-[#7B3FE4]/40 p-5 sm:p-8 lg:p-10 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.65)]">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#7B3FE4]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#FF2E93]/20 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Side */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#38BDF8]">
              <Sparkles className="w-3.5 h-3.5 text-[#FF2E93]" />
              <span>Student-to-Student Used Book Marketplace</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
              Give Your Old Books a{' '}
              <span className="bg-gradient-to-r from-[#00E5FF] via-[#FF2E93] to-[#7B3FE4] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,46,147,0.3)]">
                New Student
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Buy and sell useful school books within your student community.
            </p>

            {/* Below Hero Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearchSubmit();
              }}
              className="pt-2 max-w-xl"
            >
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-[#38BDF8] absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search books by title, subject, author..."
                  className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-[#070A18]/90 border border-white/15 focus:border-[#38BDF8] text-sm text-white placeholder-slate-400 shadow-inner focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#7B3FE4] to-[#00E5FF] text-white text-xs font-extrabold hover:brightness-110 transition-all"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Two Large Pill Buttons Side-by-Side */}
            <div className="pt-2 grid grid-cols-2 gap-3 sm:gap-4 max-w-xl">
              <button
                type="button"
                onClick={() => onNavigate('browse')}
                className="py-3.5 px-5 rounded-full bg-gradient-to-r from-[#7B3FE4] via-[#6D28D9] to-[#38BDF8] hover:brightness-110 text-white text-xs sm:text-sm font-extrabold shadow-[0_8px_25px_rgba(123,63,228,0.45)] flex items-center justify-center gap-2 transition-all whitespace-nowrap"
              >
                <Compass className="w-4 h-4 shrink-0" />
                <span>Browse Books</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('sell')}
                className="py-3.5 px-5 rounded-full bg-gradient-to-r from-[#FF2E93] via-[#EC4899] to-[#7B3FE4] hover:brightness-110 text-white text-xs sm:text-sm font-extrabold shadow-[0_8px_25px_rgba(255,46,147,0.45)] flex items-center justify-center gap-2 transition-all whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span>Sell Your Book</span>
              </button>
            </div>
          </div>

          {/* Right Side: 3D Stacked Colorful School Books Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 shadow-[0_0_40px_rgba(123,63,228,0.35)] bg-[#070A18]">
              <img
                src={HERO_BOOKS_IMAGE}
                alt="3D stacked colorful school books with glowing sparkles"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F26]/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 px-3.5 py-2 rounded-xl bg-[#0B0F26]/85 backdrop-blur-md border border-white/15 flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD13B]" />
                  Save up to 55% on NCERT & Guides
                </span>
                <span className="text-[11px] font-extrabold text-[#10B981]">100% Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUR COMMUNITY HIGHLIGHTS STRIP */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="p-3.5 sm:p-4 rounded-2xl bg-[#0B0F26] border border-white/10 flex items-center gap-3 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#121836] border border-white/10 flex items-center justify-center shrink-0">
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white leading-snug">
                {item.label}
              </span>
            </div>
          );
        })}
      </section>

      {/* RECENTLY ADDED BOOKS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Recently Added Books
            </h2>
            <p className="text-xs text-slate-400">
              Fresh textbooks listed by students in your school community
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('browse')}
            className="px-3.5 py-2 rounded-xl bg-[#121836] hover:bg-[#1E293B] border border-white/10 text-xs font-bold text-[#38BDF8] flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isFavorite={favorites.includes(book.id)}
              onToggleFavorite={onToggleFavorite}
              onSelectBook={onSelectBook}
              variant="horizontal"
            />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS (4 CONNECTED STEPS) */}
      <section className="rounded-3xl bg-[#0B0F26] border border-white/10 p-6 sm:p-8">
        <div className="text-center max-w-xl mx-auto mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">How It Works</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simple 4-step textbook exchange built for students
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {howItWorks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl bg-[#121836] border border-white/10 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.accent} flex items-center justify-center text-white shadow-md`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-extrabold text-slate-400 font-mono-num">
                      STEP 0{item.step}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.desc}</p>
                </div>

                {idx < 3 && (
                  <div className="hidden lg:flex items-center justify-end mt-3 text-[#38BDF8] text-xs font-bold">
                    <span>Next →</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* POPULAR SUBJECTS */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white">Popular Subjects</h2>
          <p className="text-xs text-slate-400">
            Click any subject chip to filter available textbooks immediately
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {popularSubjects.map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => onSelectSubject(subject)}
              className="px-4 py-2.5 rounded-full bg-[#121836] hover:bg-gradient-to-r hover:from-[#7B3FE4] hover:to-[#FF2E93] border border-white/10 hover:border-transparent text-xs sm:text-sm font-bold text-slate-200 hover:text-white transition-all shadow-sm whitespace-nowrap"
            >
              {subject}
            </button>
          ))}
        </div>
      </section>

      {/* OWNER CREDIT CARD */}
      <section className="rounded-2xl bg-gradient-to-r from-[#121836] via-[#1A1443] to-[#121836] border border-[#7B3FE4]/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-[0_0_25px_rgba(123,63,228,0.2)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF2E93] to-[#7B3FE4] flex items-center justify-center text-white shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-extrabold text-white">
              Created & Owned by Jaimin & Aarush • My Book Buddy Student Marketplace
            </p>
            <p className="text-[11px] text-slate-400">
              Give Your Old Books a New Student • Buy • Sell • Share • Learn
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('demo')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-[#FFD13B] whitespace-nowrap"
          >
            Demo Mode
          </button>
          <button
            type="button"
            onClick={() => onNavigate('trust')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-[#38BDF8] whitespace-nowrap"
          >
            Trust & Safety
          </button>
        </div>
      </section>
    </div>
  );
};

interface BrowseViewProps {
  books: BookListing[];
  favorites: string[];
  onToggleFavorite: (bookId: string, e: React.MouseEvent) => void;
  onSelectBook: (book: BookListing) => void;
  filters: FilterState;
  onUpdateFilters: (partial: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onOpenFilterModal: () => void;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  books,
  favorites,
  onToggleFavorite,
  onSelectBook,
  filters,
  onUpdateFilters,
  onResetFilters,
  onOpenFilterModal,
}) => {
  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Browse Books</h1>
            <span className="px-3 py-1 rounded-full bg-[#7B3FE4]/25 border border-[#7B3FE4]/50 text-xs font-extrabold text-[#38BDF8] font-mono-num">
              {books.length} {books.length === 1 ? 'Book' : 'Books'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Find verified NCERT & reference books from seniors in your school
          </p>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs font-bold text-slate-400 hover:text-[#FF2E93] transition-colors"
        >
          Reset All Filters
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onUpdateFilters({ search: e.target.value })}
          placeholder="Search by title, author or subject…"
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#0B0F26] border border-white/15 focus:border-[#38BDF8] text-sm text-white placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Filter Row: Class, Subject, Board, Condition dropdowns + More Filters button */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <select
          value={filters.classGrade}
          onChange={(e) => onUpdateFilters({ classGrade: e.target.value })}
          className="px-3 py-2.5 rounded-xl bg-[#121836] border border-white/10 text-xs font-semibold text-white focus:border-[#38BDF8] focus:outline-none"
        >
          <option value="All">Class: All</option>
          <option value="Class 9">Class 9</option>
          <option value="Class 10">Class 10</option>
          <option value="Class 11">Class 11</option>
          <option value="Class 12">Class 12</option>
        </select>

        <select
          value={filters.subject}
          onChange={(e) => onUpdateFilters({ subject: e.target.value })}
          className="px-3 py-2.5 rounded-xl bg-[#121836] border border-white/10 text-xs font-semibold text-white focus:border-[#38BDF8] focus:outline-none"
        >
          <option value="All">Subject: All</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Biology">Biology</option>
          <option value="English">English</option>
          <option value="Computer Science">Computer Science</option>
        </select>

        <select
          value={filters.board}
          onChange={(e) => onUpdateFilters({ board: e.target.value })}
          className="px-3 py-2.5 rounded-xl bg-[#121836] border border-white/10 text-xs font-semibold text-white focus:border-[#38BDF8] focus:outline-none"
        >
          <option value="All">Board: All</option>
          <option value="CBSE">CBSE</option>
          <option value="ICSE">ICSE</option>
          <option value="State Board">State Board</option>
        </select>

        <select
          value={filters.condition}
          onChange={(e) => onUpdateFilters({ condition: e.target.value })}
          className="px-3 py-2.5 rounded-xl bg-[#121836] border border-white/10 text-xs font-semibold text-white focus:border-[#38BDF8] focus:outline-none"
        >
          <option value="All">Condition: All</option>
          <option value="Like New">Like New</option>
          <option value="Good">Good</option>
          <option value="Used">Used</option>
          <option value="Heavily Used">Heavily Used</option>
        </select>

        <button
          type="button"
          onClick={onOpenFilterModal}
          className="col-span-2 sm:col-span-1 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#7B3FE4]/30 to-[#FF2E93]/30 hover:from-[#7B3FE4]/50 hover:to-[#FF2E93]/50 border border-[#7B3FE4]/50 text-xs font-bold text-white flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>More Filters</span>
        </button>
      </div>

      {/* Sort Pills: Newest | Lowest Price | Highest Price */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1">Sort by:</span>
          {(
            [
              { id: 'newest', label: 'Newest' },
              { id: 'price-asc', label: 'Lowest Price' },
              { id: 'price-desc', label: 'Highest Price' },
            ] as const
          ).map((pill) => {
            const active = filters.sortBy === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => onUpdateFilters({ sortBy: pill.id })}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-gradient-to-r from-[#7B3FE4] to-[#FF2E93] text-white shadow-[0_0_12px_rgba(123,63,228,0.4)]'
                    : 'bg-[#0B0F26] text-slate-300 border border-white/10 hover:text-white'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Book Grid */}
      {books.length === 0 ? (
        <div className="rounded-3xl bg-[#0B0F26] border border-white/10 p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-[#38BDF8] mx-auto" />
          <h3 className="text-base font-bold text-white">No matching textbooks found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try clearing some filters or searching for another subject like Physics, Chemistry, or Mathematics.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl bg-[#7B3FE4] text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isFavorite={favorites.includes(book.id)}
              onToggleFavorite={onToggleFavorite}
              onSelectBook={onSelectBook}
              variant="grid"
            />
          ))}
        </div>
      )}
    </div>
  );
};
