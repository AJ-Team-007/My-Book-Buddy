import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Inbox,
  Edit3,
  RotateCcw,
  PlusCircle,
  MessageSquare,
  Check,
  X,
  Clock,
} from 'lucide-react';
import { BookListing, BuyRequest, ScreenId, StudentUser } from '../types';
import { getConditionBadgeStyle } from './BookCard';

interface DashboardViewProps {
  books: BookListing[];
  requests: BuyRequest[];
  currentUser: StudentUser;
  onEditBook: (book: BookListing) => void;
  onToggleSoldStatus: (bookId: string) => void;
  onSelectBook: (book: BookListing) => void;
  onNavigate: (screen: ScreenId) => void;
  onOpenChatFromRequest: (req: BuyRequest) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  books,
  requests,
  currentUser,
  onEditBook,
  onToggleSoldStatus,
  onSelectBook,
  onNavigate,
  onOpenChatFromRequest,
}) => {
  const [mainTab, setMainTab] = useState<'listings' | 'requests'>('listings');
  const [listingSubTab, setListingSubTab] = useState<'Active' | 'Sold'>('Active');

  const myBooks = books.filter((b) => b.sellerId === currentUser.id);
  const activeBooks = myBooks.filter((b) => b.status === 'Available');
  const soldBooks = myBooks.filter((b) => b.status === 'Sold');
  const myRequests = requests.filter(
    (r) => r.sellerId === currentUser.id || r.buyerId === currentUser.id
  );

  const displayedListings = listingSubTab === 'Active' ? activeBooks : soldBooks;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your textbook listings, sold items, and student buy requests
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('sell')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2E93] to-[#7B3FE4] hover:brightness-110 text-white text-xs font-extrabold shadow-[0_0_20px_rgba(255,46,147,0.4)] flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List New Book</span>
        </button>
      </div>

      {/* Top Statistics Cards: Active Listings | Sold Books | Requests */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-2xl bg-[#0B0F26] border border-[#38BDF8]/40 p-4 text-center shadow-lg">
          <BookOpen className="w-5 h-5 text-[#38BDF8] mx-auto mb-1" />
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono-num">
            {activeBooks.length}
          </div>
          <div className="text-[11px] sm:text-xs font-bold text-slate-400 mt-0.5">
            Active Listings
          </div>
        </div>

        <div className="rounded-2xl bg-[#0B0F26] border border-[#10B981]/40 p-4 text-center shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-[#10B981] mx-auto mb-1" />
          <div className="text-2xl sm:text-3xl font-extrabold text-[#10B981] font-mono-num">
            {soldBooks.length}
          </div>
          <div className="text-[11px] sm:text-xs font-bold text-slate-400 mt-0.5">
            Sold Books
          </div>
        </div>

        <div
          onClick={() => onNavigate('requests')}
          className="rounded-2xl bg-[#0B0F26] border border-[#FF2E93]/40 p-4 text-center shadow-lg cursor-pointer hover:bg-[#121836] transition-colors"
        >
          <Inbox className="w-5 h-5 text-[#FF2E93] mx-auto mb-1" />
          <div className="text-2xl sm:text-3xl font-extrabold text-[#FFD13B] font-mono-num">
            {myRequests.length}
          </div>
          <div className="text-[11px] sm:text-xs font-bold text-slate-400 mt-0.5">
            Requests
          </div>
        </div>
      </div>

      {/* Main Tabs: My Listings | My Requests */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMainTab('listings')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              mainTab === 'listings'
                ? 'bg-gradient-to-r from-[#7B3FE4] to-[#FF2E93] text-white shadow-[0_0_15px_rgba(123,63,228,0.4)]'
                : 'bg-[#0B0F26] text-slate-300 border border-white/10 hover:text-white'
            }`}
          >
            My Listings ({myBooks.length})
          </button>

          <button
            type="button"
            onClick={() => setMainTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              mainTab === 'requests'
                ? 'bg-gradient-to-r from-[#7B3FE4] to-[#FF2E93] text-white shadow-[0_0_15px_rgba(123,63,228,0.4)]'
                : 'bg-[#0B0F26] text-slate-300 border border-white/10 hover:text-white'
            }`}
          >
            My Requests ({myRequests.length})
          </button>
        </div>

        {mainTab === 'listings' && (
          <div className="flex items-center bg-[#0B0F26] p-1 rounded-xl border border-white/10">
            {(['Active', 'Sold'] as const).map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setListingSubTab(sub)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  listingSubTab === sub
                    ? 'bg-[#121836] text-[#38BDF8] border border-[#38BDF8]/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sub} ({sub === 'Active' ? activeBooks.length : soldBooks.length})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Listings Content */}
      {mainTab === 'listings' ? (
        displayedListings.length === 0 ? (
          <div className="rounded-3xl bg-[#0B0F26] border border-white/10 p-10 text-center space-y-3">
            <BookOpen className="w-9 h-9 text-[#38BDF8] mx-auto" />
            <h3 className="text-sm font-bold text-white">
              No {listingSubTab.toLowerCase()} listings yet
            </h3>
            <p className="text-xs text-slate-400">
              List your old school books so juniors in your school can request them!
            </p>
            <button
              type="button"
              onClick={() => onNavigate('sell')}
              className="px-4 py-2 rounded-xl bg-[#7B3FE4] text-white text-xs font-bold"
            >
              Sell a Book
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedListings.map((book) => (
              <div
                key={book.id}
                className="rounded-2xl bg-[#0B0F26] border border-white/10 p-4 flex gap-4 items-center shadow-lg"
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  referrerPolicy="no-referrer"
                  onClick={() => onSelectBook(book)}
                  className="w-20 h-28 rounded-xl object-cover border border-white/10 shrink-0 cursor-pointer hover:opacity-90"
                />

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getConditionBadgeStyle(
                        book.condition
                      )}`}
                    >
                      {book.condition}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                        book.status === 'Available'
                          ? 'bg-[#10B981]/20 text-[#34D399]'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {book.status}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectBook(book)}
                    className="text-sm sm:text-base font-extrabold text-white hover:text-[#38BDF8] truncate cursor-pointer"
                  >
                    {book.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-base font-extrabold text-[#FFD13B] font-mono-num">
                      ₹{book.price}
                    </span>
                    <span className="text-slate-400 font-semibold">
                      {book.requestsCount} {book.requestsCount === 1 ? 'Request' : 'Requests'}
                    </span>
                  </div>

                  {/* Compact Edit and Mark as Sold / Relist buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEditBook(book)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-[#121836] hover:bg-white/10 border border-white/15 text-xs font-bold text-slate-200 flex items-center justify-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleSoldStatus(book.id)}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-all ${
                        book.status === 'Available'
                          ? 'bg-[#10B981]/20 hover:bg-[#10B981]/30 border border-[#10B981]/50 text-[#34D399]'
                          : 'bg-[#7B3FE4]/25 hover:bg-[#7B3FE4]/40 border border-[#7B3FE4]/50 text-white'
                      }`}
                    >
                      {book.status === 'Available' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark as Sold</span>
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Relist</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-3">
          {myRequests.map((req) => (
            <div
              key={req.id}
              className="rounded-2xl bg-[#0B0F26] border border-white/10 p-4 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={req.bookCover}
                  alt={req.bookTitle}
                  referrerPolicy="no-referrer"
                  className="w-12 h-16 rounded-lg object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-extrabold text-white truncate">{req.bookTitle}</h4>
                  <p className="text-xs text-slate-400">
                    Buyer: <span className="text-slate-200 font-semibold">{req.buyerName}</span> •{' '}
                    <span className="text-[#FFD13B] font-mono-num font-bold">₹{req.bookPrice}</span>
                  </p>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-1">“{req.message}”</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#38BDF8]">
                  {req.status}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenChatFromRequest(req)}
                  className="px-3.5 py-2 rounded-xl bg-[#7B3FE4] hover:brightness-110 text-white text-xs font-bold"
                >
                  Open Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface BuyRequestsViewProps {
  requests: BuyRequest[];
  currentUser: StudentUser;
  onUpdateRequestStatus: (
    requestId: string,
    newStatus: 'Accepted' | 'Declined' | 'Completed'
  ) => void;
  onOpenChatFromRequest: (req: BuyRequest) => void;
}

export const BuyRequestsView: React.FC<BuyRequestsViewProps> = ({
  requests,
  currentUser,
  onUpdateRequestStatus,
  onOpenChatFromRequest,
}) => {
  const [tab, setTab] = useState<'received' | 'sent'>('received');

  const receivedRequests = requests.filter((r) => r.sellerId === currentUser.id);
  const sentRequests = requests.filter((r) => r.buyerId === currentUser.id);

  const activeList = tab === 'received' ? receivedRequests : sentRequests;

  const getStatusPill = (status: BuyRequest['status']) => {
    switch (status) {
      case 'Accepted':
        return 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/40';
      case 'Declined':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Completed':
        return 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40';
      default:
        return 'bg-[#FFD13B]/20 text-[#FFD13B] border-[#FFD13B]/40';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Buy Requests</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Review incoming requests for your books or track requests you sent to seniors
        </p>
      </div>

      {/* Tabs: Received | Sent */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTab('received')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            tab === 'received'
              ? 'bg-gradient-to-r from-[#7B3FE4] to-[#FF2E93] text-white shadow-[0_0_15px_rgba(123,63,228,0.4)]'
              : 'bg-[#0B0F26] text-slate-300 border border-white/10 hover:text-white'
          }`}
        >
          Received ({receivedRequests.length})
        </button>

        <button
          type="button"
          onClick={() => setTab('sent')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            tab === 'sent'
              ? 'bg-gradient-to-r from-[#7B3FE4] to-[#FF2E93] text-white shadow-[0_0_15px_rgba(123,63,228,0.4)]'
              : 'bg-[#0B0F26] text-slate-300 border border-white/10 hover:text-white'
          }`}
        >
          Sent ({sentRequests.length})
        </button>
      </div>

      {/* Request Cards */}
      {activeList.length === 0 ? (
        <div className="rounded-3xl bg-[#0B0F26] border border-white/10 p-10 text-center space-y-2">
          <Inbox className="w-9 h-9 text-[#38BDF8] mx-auto" />
          <h3 className="text-sm font-bold text-white">No {tab} requests yet</h3>
          <p className="text-xs text-slate-400">
            {tab === 'received'
              ? 'When another student clicks "Request to Buy" on your books, it will appear here.'
              : 'Browse available textbooks and tap "Request to Buy" to send a request.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeList.map((req) => (
            <div
              key={req.id}
              className="rounded-2xl bg-[#0B0F26] border border-white/10 p-5 space-y-4 shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${req.buyerAvatarGradient} flex items-center justify-center text-white font-extrabold text-xs shrink-0`}
                  >
                    {req.buyerInitials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-white truncate">
                      {tab === 'received' ? req.buyerName : `Seller: ${req.sellerName}`}
                    </h3>
                    <p className="text-xs font-bold text-[#FFD13B] truncate">
                      📘 {req.bookTitle} • ₹{req.bookPrice}
                    </p>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {req.timestamp}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold border shrink-0 ${getStatusPill(
                    req.status
                  )}`}
                >
                  {req.status}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#121836] border border-white/10 text-xs text-slate-200 leading-relaxed">
                “{req.message}”
              </div>

              {tab === 'received' ? (
                /* 3 Action Buttons: Accept (Green), Decline (Red outline), Open Chat (Purple outline) */
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => onUpdateRequestStatus(req.id, 'Accepted')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.35)] flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateRequestStatus(req.id, 'Declined')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-transparent hover:bg-rose-500/15 border border-rose-500/60 text-rose-300 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <X className="w-4 h-4" />
                    <span>Decline</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenChatFromRequest(req)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#7B3FE4]/15 hover:bg-[#7B3FE4]/30 border border-[#7B3FE4] text-[#38BDF8] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open Chat</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-400">
                    Status: <strong className="text-white">{req.status}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenChatFromRequest(req)}
                    className="py-2 px-4 rounded-xl bg-[#7B3FE4]/20 hover:bg-[#7B3FE4]/35 border border-[#7B3FE4] text-white text-xs font-extrabold flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Open Chat</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
