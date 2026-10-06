import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Heart,
  CheckCircle2,
  MessageSquare,
  Send,
  Flag,
  Upload,
  X,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Edit3,
} from 'lucide-react';
import { BookCondition, BookListing, ScreenId, StudentUser } from '../types';
import {
  DEMO_USERS,
  PRESET_COVERS,
  SVG_BACK_COVER,
  SVG_OPEN_PAGES,
} from '../data/mockData';
import { processAndUploadBookImage } from '../firebase';
import { getConditionBadgeStyle } from './BookCard';

interface BookDetailsViewProps {
  book: BookListing;
  isFavorite: boolean;
  onToggleFavorite: (bookId: string, e: React.MouseEvent) => void;
  onBack: () => void;
  onOpenRequestModal: (book: BookListing) => void;
  onMessageSeller: (book: BookListing) => void;
  onViewSellerProfile: (sellerId: string) => void;
  onReportListing: (bookTitle: string) => void;
  onEditListing?: (book: BookListing) => void;
  currentUser: StudentUser;
}

export const BookDetailsView: React.FC<BookDetailsViewProps> = ({
  book,
  isFavorite,
  onToggleFavorite,
  onBack,
  onOpenRequestModal,
  onMessageSeller,
  onViewSellerProfile,
  onReportListing,
  onEditListing,
  currentUser,
}) => {
  const gallery =
    book.galleryImages && book.galleryImages.length >= 3
      ? book.galleryImages
      : [book.coverImage, SVG_OPEN_PAGES, SVG_BACK_COVER];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const thumbLabels = ['Front Cover', 'Open Pages', 'Back Cover'];

  useEffect(() => {
    setActiveImageIndex(0);
  }, [book.id]);

  const seller: StudentUser = DEMO_USERS[book.sellerId] || DEMO_USERS['student-a'];
  const isOwner = book.sellerId === currentUser.id;

  const detailsRows = [
    { label: 'Author', value: book.author },
    { label: 'Subject', value: book.subject },
    { label: 'Class', value: book.classGrade },
    { label: 'Board', value: book.board },
    { label: 'Edition', value: book.edition },
    { label: 'Condition', value: `${book.condition} Condition` },
    { label: 'Medium', value: book.medium },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Top Bar with Back Arrow */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121836] hover:bg-[#1E293B] border border-white/10 text-xs font-bold text-slate-200 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#38BDF8]" />
          <span>Back to Books</span>
        </button>

        <div className="flex items-center gap-2">
          {isOwner && onEditListing && (
            <button
              type="button"
              onClick={() => onEditListing(book)}
              className="px-3.5 py-2 rounded-xl bg-[#7B3FE4]/20 hover:bg-[#7B3FE4]/30 border border-[#7B3FE4]/50 text-xs font-bold text-[#38BDF8] flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Listing</span>
            </button>
          )}
          <button
            type="button"
            onClick={(e) => onToggleFavorite(book.id, e)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              isFavorite
                ? 'bg-[#FF2E93]/20 border-[#FF2E93] text-[#FF2E93]'
                : 'bg-[#121836] border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#FF2E93]' : ''}`} />
            <span>{isFavorite ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Main Image Area + 3 Clickable Thumbnail Previews on Right */}
        <div className="lg:col-span-6 rounded-3xl bg-[#0B0F26] border border-white/10 p-4 sm:p-5 shadow-xl">
          <div className="grid grid-cols-12 gap-3.5">
            {/* Large Book Cover Image on Left */}
            <div className="col-span-9 relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#121836] border border-white/10">
              <img
                src={gallery[activeImageIndex] || book.coverImage}
                alt={`${book.title} preview`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white">
                {thumbLabels[activeImageIndex] || `Photo ${activeImageIndex + 1}`}
              </div>
            </div>

            {/* 3 Clickable Thumbnail Previews on Right */}
            <div className="col-span-3 flex flex-col gap-3">
              {gallery.slice(0, 3).map((imgUrl, idx) => {
                const isSelected = activeImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${
                      isSelected
                        ? 'border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.45)] scale-[1.02]'
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={thumbLabels[idx] || `Thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-black/75 text-[9px] font-bold text-slate-200 py-0.5 text-center truncate px-1">
                      {thumbLabels[idx] || `View ${idx + 1}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Book Info, Details Table, Seller Card, Description */}
        <div className="lg:col-span-6 space-y-5">
          {/* Book Header Info Card */}
          <div className="rounded-3xl bg-[#0B0F26] border border-white/10 p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                  book.status === 'Available'
                    ? 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}
              >
                ● {book.status}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${getConditionBadgeStyle(
                  book.condition
                )}`}
              >
                {book.condition} Condition
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {book.title}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#38BDF8] mt-1.5">
                {book.subject} • {book.classGrade} • {book.board} • {book.medium}
              </p>
            </div>

            {/* Pricing */}
            <div className="p-4 rounded-2xl bg-[#121836] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                  Student Exchange Price
                </span>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  <span className="text-3xl font-extrabold text-[#FFD13B] font-mono-num drop-shadow-[0_0_12px_rgba(255,209,59,0.35)]">
                    ₹{book.price}
                  </span>
                  <span className="text-sm text-slate-400 line-through font-mono-num">
                    ₹{book.originalPrice} (Original)
                  </span>
                </div>
              </div>
              {book.originalPrice > book.price && (
                <div className="text-right">
                  <span className="px-3 py-1.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-extrabold text-[#34D399] font-mono-num">
                    Save ₹{book.originalPrice - book.price}
                  </span>
                </div>
              )}
            </div>

            {/* Details Table */}
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
                Book Specifications
              </h3>
              <div className="rounded-2xl bg-[#121836] border border-white/10 divide-y divide-white/10 overflow-hidden">
                {detailsRows.map((row) => (
                  <div
                    key={row.label}
                    className="px-4 py-2.5 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-400">{row.label}</span>
                    <span className="font-bold text-white text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seller Card */}
          <div className="rounded-3xl bg-[#0B0F26] border border-white/10 p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${seller.avatarGradient} flex items-center justify-center text-white font-extrabold text-base shrink-0 shadow-md`}
              >
                {seller.initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-extrabold text-white truncate">
                    {seller.displayName}
                  </h4>
                  <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                </div>
                <p className="text-xs text-[#38BDF8] font-semibold">
                  {seller.classGrade} • {seller.board}
                </p>
                <p className="text-[11px] text-slate-400">
                  Member since {seller.memberSince}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onViewSellerProfile(seller.id)}
              className="px-3.5 py-2 rounded-xl bg-[#121836] hover:bg-[#1E293B] border border-white/15 text-xs font-bold text-white whitespace-nowrap transition-colors"
            >
              View Profile
            </button>
          </div>

          {/* Description Card + Report Listing */}
          <div className="rounded-3xl bg-[#0B0F26] border border-white/10 p-5 space-y-3">
            <h3 className="text-sm font-extrabold text-white">Seller’s Book Notes</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {book.description}
            </p>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                Verify book condition in person before exchanging cash
              </span>
              <button
                type="button"
                onClick={() => onReportListing(book.title)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300 whitespace-nowrap"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report Listing</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar (Request to Buy & Message Seller) */}
      <div className="fixed bottom-14 lg:bottom-0 left-0 right-0 z-30 bg-[#0B0F26]/95 backdrop-blur-xl border-t border-white/15 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.7)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-white truncate max-w-xs">{book.title}</p>
            <p className="text-sm font-extrabold text-[#FFD13B] font-mono-num">
              ₹{book.price}{' '}
              <span className="text-xs text-slate-400 font-normal">
                • Direct Student Exchange (No Payment Gateway)
              </span>
            </p>
          </div>

          <div className="flex-1 sm:flex-initial flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={() => onMessageSeller(book)}
              className="flex-1 sm:flex-initial py-3 px-5 rounded-xl bg-gradient-to-r from-[#7B3FE4] to-[#6D28D9] hover:brightness-110 text-white text-xs sm:text-sm font-extrabold shadow-[0_0_20px_rgba(123,63,228,0.4)] flex items-center justify-center gap-2 whitespace-nowrap transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Message Seller</span>
            </button>

            <button
              type="button"
              disabled={book.status === 'Sold'}
              onClick={() => onOpenRequestModal(book)}
              className="flex-1 sm:flex-initial py-3 px-6 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:brightness-110 disabled:opacity-50 text-white text-xs sm:text-sm font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.45)] flex items-center justify-center gap-2 whitespace-nowrap transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{book.status === 'Sold' ? 'Already Sold' : 'Request to Buy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SellBookViewProps {
  editingBook: BookListing | null;
  onSaveBook: (
    bookData: Omit<
      BookListing,
      'id' | 'sellerId' | 'sellerName' | 'sellerDisplay' | 'postedTime' | 'createdAt' | 'status' | 'requestsCount'
    >,
    existingId?: string
  ) => void;
  onCancel: () => void;
}

export const SellBookView: React.FC<SellBookViewProps> = ({
  editingBook,
  onSaveBook,
  onCancel,
}) => {
  const [title, setTitle] = useState(editingBook?.title || '');
  const [author, setAuthor] = useState(editingBook?.author || '');
  const [subject, setSubject] = useState(editingBook?.subject || 'Physics');
  const [classGrade, setClassGrade] = useState(editingBook?.classGrade || 'Class 11');
  const [board, setBoard] = useState(editingBook?.board || 'CBSE');
  const [medium, setMedium] = useState<'English' | 'Hindi'>(editingBook?.medium || 'English');
  const [edition, setEdition] = useState(editingBook?.edition || '2024 Edition');
  const [condition, setCondition] = useState<BookCondition>(
    editingBook?.condition || 'Good'
  );
  const [originalPrice, setOriginalPrice] = useState(
    editingBook ? String(editingBook.originalPrice) : '450'
  );
  const [price, setPrice] = useState(editingBook ? String(editingBook.price) : '240');
  const [description, setDescription] = useState(
    editingBook?.description ||
      'Well-maintained school textbook with all pages intact. Ready for immediate student exchange.'
  );
  const [photos, setPhotos] = useState<string[]>(
    editingBook?.galleryImages?.length
      ? editingBook.galleryImages
      : [PRESET_COVERS[0].url, SVG_OPEN_PAGES, SVG_BACK_COVER]
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhoto(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files).slice(0, 4)) {
        const url = await processAndUploadBookImage(file);
        uploadedUrls.push(url);
      }
      setPhotos((prev) => [...uploadedUrls, ...prev].slice(0, 5));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectPreset = (presetUrl: string, presetSubject: string) => {
    setPhotos([presetUrl, SVG_OPEN_PAGES, SVG_BACK_COVER]);
    setSubject(presetSubject);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !price.trim() || !description.trim()) {
      setErrorMsg('Please fill in all required fields marked with *.');
      return;
    }

    const numericPrice = Math.max(1, Number(price) || 200);
    const numericOriginal = Math.max(numericPrice, Number(originalPrice) || numericPrice + 150);
    const cover = photos[0] || PRESET_COVERS[0].url;

    onSaveBook(
      {
        title: title.trim(),
        author: author.trim(),
        subject,
        classGrade,
        board,
        medium,
        edition: edition.trim() || '2024 Edition',
        condition,
        price: numericPrice,
        originalPrice: numericOriginal,
        description: description.trim(),
        coverImage: cover,
        galleryImages: photos.length >= 3 ? photos : [cover, SVG_OPEN_PAGES, SVG_BACK_COVER],
      },
      editingBook?.id
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {editingBook ? 'Edit Book Listing' : 'Sell a Book'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Help another student by giving your book a second life.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="px-3.5 py-2 rounded-xl bg-[#121836] border border-white/10 text-xs font-bold text-slate-300 hover:text-white"
        >
          Cancel
        </button>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-xs font-bold text-rose-300">
          {errorMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-[#0B0F26] border border-white/10 p-5 sm:p-7 space-y-6 shadow-xl"
      >
        {/* Photo Upload Area */}
        <div className="space-y-3">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#38BDF8]">
            Upload Book Photos — Add clear photos of your book
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <label className="sm:col-span-5 cursor-pointer rounded-2xl border-2 border-dashed border-[#7B3FE4]/60 hover:border-[#00E5FF] bg-[#121836]/70 p-5 flex flex-col items-center justify-center text-center transition-colors">
              <Upload className="w-7 h-7 text-[#38BDF8] mb-2" />
              <span className="text-xs font-bold text-white">
                {uploadingPhoto ? 'Uploading to Firebase Storage...' : 'Upload Book Photos'}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                Add clear photos of your book (Front, Pages, Back)
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Removable Preview Thumbnails */}
            <div className="sm:col-span-7 flex items-center gap-3 overflow-x-auto py-1">
              {photos.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-20 h-28 rounded-xl overflow-hidden bg-[#121836] border border-white/15 shrink-0"
                >
                  <img
                    src={img}
                    alt={`Book preview ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] font-bold text-center text-white py-0.5">
                    {idx === 0 ? 'Cover' : `Pic ${idx + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Sample Textbook Cover Presets */}
          <div className="pt-1">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">
              Or pick a quick sample textbook cover preset:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_COVERS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url, preset.subject)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#121836] hover:bg-[#7B3FE4]/30 border border-white/10 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Book Title <span className="text-[#FF2E93]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., NCERT Physics Class 11 (Part 1 & 2)"
              className="w-full px-4 py-3 rounded-xl bg-[#121836] border border-white/15 focus:border-[#38BDF8] text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Author / Publisher <span className="text-[#FF2E93]">*</span>
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g., NCERT / R.D. Sharma"
              className="w-full px-4 py-3 rounded-xl bg-[#121836] border border-white/15 focus:border-[#38BDF8] text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Subject <span className="text-[#FF2E93]">*</span>
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#121836] border border-white/15 text-sm text-white"
            >
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
              <option value="English">English</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Class <span className="text-[#FF2E93]">*</span>
            </label>
            <select
              value={classGrade}
              onChange={(e) => setClassGrade(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#121836] border border-white/15 text-sm text-white"
            >
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Board <span className="text-[#FF2E93]">*</span>
            </label>
            <select
              value={board}
              onChange={(e) => setBoard(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#121836] border border-white/15 text-sm text-white"
            >
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="State Board">State Board</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Medium (English / Hindi)
            </label>
            <select
              value={medium}
              onChange={(e) => setMedium(e.target.value as 'English' | 'Hindi')}
              className="w-full px-4 py-3 rounded-xl bg-[#121836] border border-white/15 text-sm text-white"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Edition / Year
            </label>
            <input
              type="text"
              value={edition}
              onChange={(e) => setEdition(e.target.value)}
              placeholder="e.g., 2024 Rationalised Edition"
              className="w-full px-4 py-3 rounded-xl bg-[#121836] border border-white/15 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Condition <span className="text-[#FF2E93]">*</span>
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as BookCondition)}
              className="w-full px-4 py-3 rounded-xl bg-[#121836] border border-white/15 text-sm text-white"
            >
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Used">Used</option>
              <option value="Heavily Used">Heavily Used</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Original MRP Price (₹)
            </label>
            <input
              type="number"
              min={1}
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="450"
              className="w-full px-4 py-3 rounded-xl bg-[#121836] border border-white/15 text-sm text-white font-mono-num"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#FFD13B] mb-1.5">
              Selling Price (₹) <span className="text-[#FF2E93]">*</span>
            </label>
            <input
              type="number"
              required
              min={1}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="250"
              className="w-full px-4 py-3 rounded-xl bg-[#121836] border border-[#FFD13B]/50 focus:border-[#FFD13B] text-sm font-bold text-[#FFD13B] font-mono-num"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Description <span className="text-[#FF2E93]">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mention page quality, whether solutions or notes are included, and preferred school exchange timing..."
              className="w-full px-4 py-3 rounded-xl bg-[#121836] border border-white/15 focus:border-[#38BDF8] text-sm text-white resize-none"
            />
          </div>
        </div>

        {/* Bottom Gradient Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#7B3FE4] via-[#FF2E93] to-[#FF6BB5] hover:brightness-110 text-white text-sm sm:text-base font-extrabold shadow-[0_10px_30px_rgba(255,46,147,0.45)] flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles className="w-5 h-5" />
          <span>{editingBook ? 'Save Updated Listing' : 'Publish Listing'}</span>
        </button>
      </form>
    </div>
  );
};
