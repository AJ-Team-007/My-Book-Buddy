import React, { useState, useMemo } from 'react';
import {
  BookListing,
  BuyRequest,
  ChatMessage,
  Conversation,
  FilterState,
  ScreenId,
  StudentUser,
  ViewportMode,
} from './types';
import {
  DEMO_USERS,
  INITIAL_BOOKS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_REQUESTS,
} from './data/mockData';
import { TopNav, BottomNav, SideDrawer } from './components/Navigation';
import { HomeView, BrowseView } from './components/HomeAndBrowseViews';
import { BookDetailsView, SellBookView } from './components/DetailsAndSellViews';
import { MessagesView, ChatView } from './components/MessagesAndChatViews';
import { DashboardView, BuyRequestsView } from './components/DashboardAndRequestsViews';
import {
  ProfileView,
  DemoModeView,
  TrustSafetyView,
} from './components/ProfileDemoTrustViews';
import {
  DemoTourBanner,
  ReportModal,
  RequestToBuyModal,
  SearchFiltersModal,
  ToastNotification,
  TOUR_STEPS,
} from './components/Modals';

const DEFAULT_FILTERS: FilterState = {
  search: '',
  classGrade: 'All',
  subject: 'All',
  board: 'All',
  medium: 'All',
  condition: 'All',
  availability: 'All',
  minPrice: '',
  maxPrice: '',
  sortBy: 'newest',
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const [viewportMode, setViewportMode] = useState<ViewportMode>('auto');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Users & Active Student Persona
  const [usersMap, setUsersMap] = useState<Record<string, StudentUser>>(DEMO_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>('student-a');
  const currentUser = usersMap[currentUserId] || DEMO_USERS['student-a'];

  // Marketplace State
  const [books, setBooks] = useState<BookListing[]>(INITIAL_BOOKS);
  const [favorites, setFavorites] = useState<string[]>(['book-1', 'book-4']);
  const [selectedBookId, setSelectedBookId] = useState<string>('book-1');
  const [editingBook, setEditingBook] = useState<BookListing | null>(null);

  // Filters & Modals
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [requestModalBook, setRequestModalBook] = useState<BookListing | null>(null);
  const [reportBookTitle, setReportBookTitle] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Requests, Conversations & Messages
  const [requests, setRequests] = useState<BuyRequest[]>(INITIAL_REQUESTS);
  const [conversations, setConversations] =
    useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [messagesByConv, setMessagesByConv] =
    useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-1');

  // Science Fair Guided Demo Tour
  const [tourStep, setTourStep] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const selectedBook = useMemo(
    () => books.find((b) => b.id === selectedBookId) || books[0],
    [books, selectedBookId]
  );

  const activeConversation = useMemo(
    () =>
      conversations.find((c) => c.id === activeConversationId) || conversations[0],
    [conversations, activeConversationId]
  );

  // Filtered & Sorted Books for Browse
  const filteredBooks = useMemo(() => {
    return books
      .filter((b) => {
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase();
          const matchTitle = b.title.toLowerCase().includes(q);
          const matchSubject = b.subject.toLowerCase().includes(q);
          const matchAuthor = b.author.toLowerCase().includes(q);
          const matchClass = b.classGrade.toLowerCase().includes(q);
          if (!matchTitle && !matchSubject && !matchAuthor && !matchClass) return false;
        }
        if (filters.classGrade !== 'All' && b.classGrade !== filters.classGrade)
          return false;
        if (filters.subject !== 'All' && b.subject !== filters.subject) return false;
        if (filters.board !== 'All' && b.board !== filters.board) return false;
        if (filters.medium !== 'All' && b.medium !== filters.medium) return false;
        if (filters.condition !== 'All' && b.condition !== filters.condition)
          return false;
        if (filters.availability !== 'All' && b.status !== filters.availability)
          return false;
        if (filters.minPrice && b.price < Number(filters.minPrice)) return false;
        if (filters.maxPrice && b.price > Number(filters.maxPrice)) return false;
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        return b.createdAt - a.createdAt;
      });
  }, [books, filters]);

  const unreadMessagesCount = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    [conversations]
  );

  const pendingRequestsCount = useMemo(
    () =>
      requests.filter(
        (r) => r.sellerId === currentUser.id && r.status === 'Pending'
      ).length,
    [requests, currentUser.id]
  );

  const handleToggleFavorite = (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const handleSelectBook = (book: BookListing) => {
    setSelectedBookId(book.id);
    setActiveScreen('book-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (screen: ScreenId) => {
    if (screen !== 'sell') {
      setEditingBook(null);
    }
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitBuyRequest = (
    book: BookListing,
    buyerName: string,
    messageText: string
  ) => {
    const newReq: BuyRequest = {
      id: `req-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookCover: book.coverImage,
      bookPrice: book.price,
      bookCondition: book.condition,
      buyerId: currentUser.id,
      buyerName,
      buyerAvatarGradient: currentUser.avatarGradient,
      buyerInitials: currentUser.initials,
      sellerId: book.sellerId,
      sellerName: book.sellerDisplay,
      message: messageText,
      timestamp: 'Just now',
      createdAt: Date.now(),
      status: 'Pending',
    };

    setRequests((prev) => [newReq, ...prev]);

    // Increment book requests count
    setBooks((prev) =>
      prev.map((b) =>
        b.id === book.id ? { ...b, requestsCount: b.requestsCount + 1 } : b
      )
    );

    // Ensure conversation & initial chat message exist
    const existingConv = conversations.find((c) => c.bookId === book.id);
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (existingConv) {
      const newMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        conversationId: existingConv.id,
        senderId: currentUser.id,
        text: `📘 Buy Request Sent: ${messageText}`,
        timestamp: nowTime,
        read: true,
      };
      setMessagesByConv((prev) => ({
        ...prev,
        [existingConv.id]: [...(prev[existingConv.id] || []), newMsg],
      }));
      setConversations((prev) =>
        prev.map((c) =>
          c.id === existingConv.id
            ? { ...c, lastMessage: messageText, lastTimestamp: 'Just now' }
            : c
        )
      );
      setActiveConversationId(existingConv.id);
    } else {
      const sellerUser = usersMap[book.sellerId] || DEMO_USERS['student-a'];
      const newConvId = `conv-${Date.now()}`;
      const newConv: Conversation = {
        id: newConvId,
        bookId: book.id,
        bookTitle: book.title,
        bookPrice: book.price,
        bookCondition: book.condition,
        bookCover: book.coverImage,
        participantIds: [currentUser.id, sellerUser.id],
        otherStudentId: sellerUser.id,
        otherStudentName: sellerUser.displayName,
        otherStudentClass: `${sellerUser.classGrade} • ${sellerUser.board}`,
        otherStudentAvatarGradient: sellerUser.avatarGradient,
        otherStudentInitials: sellerUser.initials,
        otherStudentOnline: true,
        lastMessage: messageText,
        lastTimestamp: 'Just now',
        unreadCount: 0,
      };
      const firstMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        conversationId: newConvId,
        senderId: currentUser.id,
        text: messageText,
        timestamp: nowTime,
        read: true,
      };
      setConversations((prev) => [newConv, ...prev]);
      setMessagesByConv((prev) => ({ ...prev, [newConvId]: [firstMsg] }));
      setActiveConversationId(newConvId);
    }

    setRequestModalBook(null);
    showToast('Buy request sent successfully.');
  };

  const handleOpenChatForBook = (book: BookListing) => {
    const existingConv = conversations.find((c) => c.bookId === book.id);
    if (existingConv) {
      setActiveConversationId(existingConv.id);
      setConversations((prev) =>
        prev.map((c) => (c.id === existingConv.id ? { ...c, unreadCount: 0 } : c))
      );
      setActiveScreen('chat');
      return;
    }

    const sellerUser = usersMap[book.sellerId] || DEMO_USERS['student-b'];
    const newConvId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newConvId,
      bookId: book.id,
      bookTitle: book.title,
      bookPrice: book.price,
      bookCondition: book.condition,
      bookCover: book.coverImage,
      participantIds: [currentUser.id, sellerUser.id],
      otherStudentId: sellerUser.id,
      otherStudentName: sellerUser.displayName,
      otherStudentClass: `${sellerUser.classGrade} • ${sellerUser.board}`,
      otherStudentAvatarGradient: sellerUser.avatarGradient,
      otherStudentInitials: sellerUser.initials,
      otherStudentOnline: true,
      lastMessage: `Started a conversation about ${book.title}`,
      lastTimestamp: 'Just now',
      unreadCount: 0,
    };

    const initialMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      conversationId: newConvId,
      senderId: currentUser.id,
      text: `Hi! I'm interested in your listing "${book.title}" (₹${book.price}). Is it available for exchange at school?`,
      timestamp: 'Just now',
      read: true,
    };

    setConversations((prev) => [newConv, ...prev]);
    setMessagesByConv((prev) => ({ ...prev, [newConvId]: [initialMsg] }));
    setActiveConversationId(newConvId);
    setActiveScreen('chat');
  };

  const handleSendMessage = (
    text: string,
    attachedPhoto?: string,
    isLocationPin?: boolean
  ) => {
    if (!activeConversation) return;
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: currentUser.id,
      text,
      timestamp: nowTime,
      read: true,
      attachedPhoto,
      isLocationPin,
    };

    setMessagesByConv((prev) => ({
      ...prev,
      [activeConversation.id]: [...(prev[activeConversation.id] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? { ...c, lastMessage: text, lastTimestamp: nowTime, unreadCount: 0 }
          : c
      )
    );
  };

  const handleSimulatePartnerReply = () => {
    if (!activeConversation) return;
    const replies = [
      `Sounds great! Let's meet near the school library counter at 4:00 PM to check "${activeConversation.bookTitle}".`,
      `Yes, all chapters and diagrams are completely clean! You can inspect the book before paying ₹${activeConversation.bookPrice}.`,
      `Perfect! I will keep the textbook in my school bag tomorrow morning.`,
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const replyMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: activeConversation.otherStudentId,
      text: randomReply,
      timestamp: nowTime,
      read: true,
    };

    setMessagesByConv((prev) => ({
      ...prev,
      [activeConversation.id]: [...(prev[activeConversation.id] || []), replyMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? { ...c, lastMessage: randomReply, lastTimestamp: nowTime }
          : c
      )
    );
  };

  const handleSaveBookListing = (
    bookData: Omit<
      BookListing,
      | 'id'
      | 'sellerId'
      | 'sellerName'
      | 'sellerDisplay'
      | 'postedTime'
      | 'createdAt'
      | 'status'
      | 'requestsCount'
    >,
    existingId?: string
  ) => {
    if (existingId) {
      setBooks((prev) =>
        prev.map((b) => (b.id === existingId ? { ...b, ...bookData } : b))
      );
      setEditingBook(null);
      setSelectedBookId(existingId);
      setActiveScreen('book-details');
      showToast('Book listing updated successfully.');
      return;
    }

    const newBook: BookListing = {
      ...bookData,
      id: `book-${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.shortRole.replace(' (Demo)', ''),
      sellerDisplay: currentUser.displayName,
      postedTime: 'Just now',
      createdAt: Date.now(),
      status: 'Available',
      requestsCount: 0,
    };

    setBooks((prev) => [newBook, ...prev]);
    setSelectedBookId(newBook.id);
    setActiveScreen('book-details');
    showToast('Listing published to My Book Buddy!');
  };

  const handleToggleSoldStatus = (bookId: string) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        const nextStatus = b.status === 'Available' ? 'Sold' : 'Available';
        showToast(
          nextStatus === 'Sold'
            ? `"${b.title}" marked as Sold!`
            : `"${b.title}" relisted as Available!`
        );
        return { ...b, status: nextStatus };
      })
    );
  };

  const handleUpdateRequestStatus = (
    requestId: string,
    newStatus: 'Accepted' | 'Declined' | 'Completed'
  ) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
    );
    showToast(`Buy request marked as ${newStatus}.`);
  };

  const handleOpenChatFromRequest = (req: BuyRequest) => {
    const book = books.find((b) => b.id === req.bookId);
    if (book) {
      handleOpenChatForBook(book);
    } else {
      setActiveScreen('messages');
    }
  };

  const handleSwitchUser = (userId: string) => {
    if (usersMap[userId]) {
      setCurrentUserId(userId);
      showToast(`Switched active student persona to ${usersMap[userId].displayName}`);
    }
  };

  const handleStartDemoTour = () => {
    setTourStep(0);
    setActiveScreen(TOUR_STEPS[0].screen);
    showToast('Interactive 7-Step Science Fair Demo Tour started!');
  };

  const handleNextTourStep = () => {
    if (tourStep === null) return;
    if (tourStep >= TOUR_STEPS.length - 1) {
      setTourStep(null);
      showToast('Demo Tour completed! Explore freely.');
      return;
    }
    const nextIdx = tourStep + 1;
    setTourStep(nextIdx);
    const nextScreen = TOUR_STEPS[nextIdx].screen;
    setActiveScreen(nextScreen);
    if (nextIdx === 2) {
      setRequestModalBook(selectedBook);
    } else {
      setRequestModalBook(null);
    }
  };

  const handlePrevTourStep = () => {
    if (tourStep === null || tourStep <= 0) return;
    const prevIdx = tourStep - 1;
    setTourStep(prevIdx);
    setActiveScreen(TOUR_STEPS[prevIdx].screen);
  };

  // Container width classes when user previews Mobile or Tablet screen sizes
  const viewportContainerClass =
    viewportMode === 'mobile'
      ? 'max-w-[412px] mx-auto border-x border-white/15 min-h-screen shadow-[0_0_80px_rgba(123,63,228,0.3)] bg-[#070A18]'
      : viewportMode === 'tablet'
      ? 'max-w-[820px] mx-auto border-x border-white/15 min-h-screen shadow-[0_0_80px_rgba(123,63,228,0.25)] bg-[#070A18]'
      : 'w-full min-h-screen bg-[#070A18]';

  return (
    <div className="min-h-screen bg-[#050711] text-white">
      <div className={viewportContainerClass}>
        {/* Top Navigation */}
        <TopNav
          activeScreen={activeScreen}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          unreadMessagesCount={unreadMessagesCount}
          pendingRequestsCount={pendingRequestsCount}
          searchQuery={filters.search}
          onSearchChange={(q) => setFilters((prev) => ({ ...prev, search: q }))}
          onSearchSubmit={() => handleNavigate('browse')}
          onOpenMenu={() => setIsMenuOpen(true)}
          viewportMode={viewportMode}
          onChangeViewportMode={setViewportMode}
        />

        {/* Science Fair Guided Tour Banner */}
        <DemoTourBanner
          tourStep={tourStep}
          onNextStep={handleNextTourStep}
          onPrevStep={handlePrevTourStep}
          onEndTour={() => setTourStep(null)}
        />

        {/* Side Navigation Drawer */}
        <SideDrawer
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          activeScreen={activeScreen}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          viewportMode={viewportMode}
          onChangeViewportMode={setViewportMode}
          unreadMessagesCount={unreadMessagesCount}
          pendingRequestsCount={pendingRequestsCount}
        />

        {/* Main Screen Container */}
        <main className="max-w-7xl mx-auto px-3.5 sm:px-6 pt-5 pb-20">
          {activeScreen === 'home' && (
            <HomeView
              books={books}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectBook={handleSelectBook}
              onNavigate={handleNavigate}
              searchQuery={filters.search}
              onSearchChange={(q) => setFilters((prev) => ({ ...prev, search: q }))}
              onSearchSubmit={() => handleNavigate('browse')}
              onSelectSubject={(subject) => {
                setFilters((prev) => ({ ...prev, subject }));
                handleNavigate('browse');
              }}
            />
          )}

          {activeScreen === 'browse' && (
            <BrowseView
              books={filteredBooks}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectBook={handleSelectBook}
              filters={filters}
              onUpdateFilters={(partial) =>
                setFilters((prev) => ({ ...prev, ...partial }))
              }
              onResetFilters={() => setFilters(DEFAULT_FILTERS)}
              onOpenFilterModal={() => setIsFilterModalOpen(true)}
            />
          )}

          {activeScreen === 'book-details' && selectedBook && (
            <BookDetailsView
              book={selectedBook}
              isFavorite={favorites.includes(selectedBook.id)}
              onToggleFavorite={handleToggleFavorite}
              onBack={() => handleNavigate('browse')}
              onOpenRequestModal={(b) => setRequestModalBook(b)}
              onMessageSeller={handleOpenChatForBook}
              onViewSellerProfile={(sellerId) => {
                handleSwitchUser(sellerId);
                handleNavigate('profile');
              }}
              onReportListing={(title) => setReportBookTitle(title)}
              onEditListing={(b) => {
                setEditingBook(b);
                setActiveScreen('sell');
              }}
              currentUser={currentUser}
            />
          )}

          {activeScreen === 'sell' && (
            <SellBookView
              editingBook={editingBook}
              onSaveBook={handleSaveBookListing}
              onCancel={() => handleNavigate('home')}
            />
          )}

          {activeScreen === 'messages' && (
            <MessagesView
              conversations={conversations}
              onSelectConversation={(conv) => {
                setActiveConversationId(conv.id);
                setConversations((prev) =>
                  prev.map((c) =>
                    c.id === conv.id ? { ...c, unreadCount: 0 } : c
                  )
                );
                setActiveScreen('chat');
              }}
            />
          )}

          {activeScreen === 'chat' && activeConversation && (
            <ChatView
              conversation={activeConversation}
              messages={messagesByConv[activeConversation.id] || []}
              currentUser={currentUser}
              onBack={() => handleNavigate('messages')}
              onSendMessage={handleSendMessage}
              onSimulatePartnerReply={handleSimulatePartnerReply}
              onViewBookDetails={(bookId) => {
                setSelectedBookId(bookId);
                setActiveScreen('book-details');
              }}
            />
          )}

          {activeScreen === 'dashboard' && (
            <DashboardView
              books={books}
              requests={requests}
              currentUser={currentUser}
              onEditBook={(b) => {
                setEditingBook(b);
                setActiveScreen('sell');
              }}
              onToggleSoldStatus={handleToggleSoldStatus}
              onSelectBook={handleSelectBook}
              onNavigate={handleNavigate}
              onOpenChatFromRequest={handleOpenChatFromRequest}
            />
          )}

          {activeScreen === 'requests' && (
            <BuyRequestsView
              requests={requests}
              currentUser={currentUser}
              onUpdateRequestStatus={handleUpdateRequestStatus}
              onOpenChatFromRequest={handleOpenChatFromRequest}
            />
          )}

          {activeScreen === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              books={books}
              requests={requests}
              onNavigate={handleNavigate}
              onSwitchUser={handleSwitchUser}
              onUpdateProfileName={(newName, newClass, newSchool) => {
                setUsersMap((prev) => ({
                  ...prev,
                  [currentUser.id]: {
                    ...prev[currentUser.id],
                    displayName: newName,
                    classGrade: newClass,
                    school: newSchool,
                  },
                }));
                showToast('Student profile updated!');
              }}
            />
          )}

          {activeScreen === 'demo' && (
            <DemoModeView
              currentUser={currentUser}
              onSwitchUser={handleSwitchUser}
              onStartDemoTour={handleStartDemoTour}
              onNavigate={handleNavigate}
            />
          )}

          {activeScreen === 'trust' && <TrustSafetyView />}
        </main>

        {/* Bottom Navigation Bar (Mobile or forced Mobile preview) */}
        <BottomNav
          activeScreen={activeScreen}
          onNavigate={handleNavigate}
          unreadMessagesCount={unreadMessagesCount}
          forceShow={viewportMode === 'mobile'}
        />

        {/* Modals & Toast */}
        <RequestToBuyModal
          book={requestModalBook}
          currentUser={currentUser}
          onClose={() => setRequestModalBook(null)}
          onSubmitRequest={handleSubmitBuyRequest}
        />

        <SearchFiltersModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          filters={filters}
          onApplyFilters={(newFilters) => setFilters(newFilters)}
          onResetFilters={() => setFilters(DEFAULT_FILTERS)}
        />

        <ReportModal
          bookTitle={reportBookTitle}
          onClose={() => setReportBookTitle(null)}
          onReported={() =>
            showToast('Thank you. Listing reported to student moderators.')
          }
        />

        <ToastNotification
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      </div>
    </div>
  );
}
