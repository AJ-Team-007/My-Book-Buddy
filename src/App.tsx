import React, { useState, useMemo, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import {
  auth,
  db,
  signInWithGoogle,
  signOutUser,
  handleFirestoreError,
  OperationType,
} from './firebase';
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

function formatTimestampLabel(ts: unknown, fallback = 'Just now'): string {
  if (ts instanceof Timestamp) {
    const date = ts.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return fallback;
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const [viewportMode, setViewportMode] = useState<ViewportMode>('auto');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);

  // Users & Active Student Persona (Supports both Google Auth & Science Fair Demo Mode)
  const [usersMap, setUsersMap] = useState<Record<string, StudentUser>>(DEMO_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>('student-a');
  const currentUser = usersMap[currentUserId] || DEMO_USERS['student-a'];

  // Marketplace State (Merged with Real-time Firestore)
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

  // 1. Listen to Firebase Authentication State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setAuthReady(true);

      if (user) {
        const displayName = user.displayName || 'Jaimin & Aarush (Student A)';
        const parts = displayName.trim().split(/\s+/);
        const initials =
          parts.length >= 2
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : displayName.slice(0, 2).toUpperCase();

        const studentProfile: StudentUser = {
          id: user.uid,
          name: displayName.slice(0, 40),
          displayName: `${displayName.slice(0, 60)}`,
          shortRole: 'Verified Google Student',
          avatarGradient: 'from-[#FF2E93] via-[#7B3FE4] to-[#00E5FF]',
          initials: initials.slice(0, 4) || 'JA',
          classGrade: 'Class 12',
          board: 'CBSE',
          school: 'Delhi Public Academy • Science Stream',
          memberSince: 'Jan 2024',
          verified: true,
          online: true,
          bio: 'Verified student on My Book Buddy sharing and requesting school textbooks.',
        };

        setUsersMap((prev) => ({
          ...prev,
          [user.uid]: prev[user.uid] || studentProfile,
        }));
        setCurrentUserId(user.uid);

        // Save public profile to /users/{uid} (No PII)
        try {
          await setDoc(
            doc(db, 'users', user.uid),
            {
              uid: user.uid,
              displayName: studentProfile.displayName.slice(0, 100),
              classGrade: studentProfile.classGrade.slice(0, 40),
              board: studentProfile.board.slice(0, 40),
              school: studentProfile.school.slice(0, 120),
              avatarGradient: studentProfile.avatarGradient.slice(0, 100),
              initials: studentProfile.initials.slice(0, 6),
              memberSince: studentProfile.memberSince.slice(0, 40),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
        }
      }
    });
    return () => unsub();
  }, []);

  // 2. Real-time Firestore Listeners for Books, Requests, and Conversations
  useEffect(() => {
    if (!authReady) return;

    // Books Listener (where isPublic == true satisfies security rule)
    const booksQuery = query(collection(db, 'books'), where('isPublic', '==', true));
    const unsubBooks = onSnapshot(
      booksQuery,
      (snapshot) => {
        const cloudBooks: BookListing[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const createdMillis =
            data.createdAt instanceof Timestamp
              ? data.createdAt.toMillis()
              : Date.now();
          cloudBooks.push({
            id: docSnap.id,
            title: String(data.title || ''),
            author: String(data.author || ''),
            subject: String(data.subject || 'Physics'),
            classGrade: String(data.classGrade || 'Class 11'),
            board: String(data.board || 'CBSE'),
            medium: data.medium === 'Hindi' ? 'Hindi' : 'English',
            edition: String(data.edition || '2024 Edition'),
            condition: data.condition || 'Good',
            price: Number(data.price) || 200,
            originalPrice: Number(data.originalPrice) || 400,
            description: String(data.description || ''),
            coverImage: String(data.coverImage || ''),
            galleryImages: Array.isArray(data.galleryImages)
              ? data.galleryImages
              : [String(data.coverImage || '')],
            sellerId: String(data.sellerId || data.ownerUid || 'student-a'),
            sellerName: String(data.sellerName || 'Student A'),
            sellerDisplay: String(data.sellerDisplay || 'Jaimin & Aarush (Student A)'),
            postedTime: formatTimestampLabel(data.createdAt, 'Recently'),
            createdAt: createdMillis,
            status: data.status === 'Sold' ? 'Sold' : 'Available',
            requestsCount: Number(data.requestsCount) || 0,
          });
        });

        setBooks(() => {
          const map = new Map<string, BookListing>();
          INITIAL_BOOKS.forEach((b) => map.set(b.id, b));
          cloudBooks.forEach((b) => map.set(b.id, b));
          return Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'books');
      }
    );

    // BuyRequests Listener
    const reqQuery = query(collection(db, 'requests'), where('isPublic', '==', true));
    const unsubReqs = onSnapshot(
      reqQuery,
      (snapshot) => {
        const cloudReqs: BuyRequest[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const createdMillis =
            data.createdAt instanceof Timestamp
              ? data.createdAt.toMillis()
              : Date.now();
          cloudReqs.push({
            id: docSnap.id,
            bookId: String(data.bookId || 'book-1'),
            bookTitle: String(data.bookTitle || ''),
            bookCover: String(data.bookCover || ''),
            bookPrice: Number(data.bookPrice) || 200,
            bookCondition: data.bookCondition || 'Good',
            buyerId: String(data.buyerId || data.buyerUid || 'student-b'),
            buyerName: String(data.buyerName || 'Student'),
            buyerAvatarGradient: String(
              data.buyerAvatarGradient || 'from-[#00E5FF] to-[#7B3FE4]'
            ),
            buyerInitials: String(data.buyerInitials || 'ST'),
            sellerId: String(data.sellerId || data.sellerUid || 'student-a'),
            sellerName: String(data.sellerName || 'Jaimin & Aarush (Student A)'),
            message: String(data.message || ''),
            timestamp: formatTimestampLabel(data.createdAt, 'Just now'),
            createdAt: createdMillis,
            status: data.status || 'Pending',
          });
        });

        setRequests(() => {
          const map = new Map<string, BuyRequest>();
          INITIAL_REQUESTS.forEach((r) => map.set(r.id, r));
          cloudReqs.forEach((r) => map.set(r.id, r));
          return Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'requests');
      }
    );

    // Conversations Listener
    const convQuery = query(
      collection(db, 'conversations'),
      where('isPublic', '==', true)
    );
    const unsubConvs = onSnapshot(
      convQuery,
      (snapshot) => {
        const cloudConvs: Conversation[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          cloudConvs.push({
            id: docSnap.id,
            bookId: String(data.bookId || 'book-1'),
            bookTitle: String(data.bookTitle || ''),
            bookPrice: Number(data.bookPrice) || 250,
            bookCondition: data.bookCondition || 'Good',
            bookCover: String(data.bookCover || ''),
            participantIds: [
              String(data.ownerUid || 'student-a'),
              String(data.otherStudentId || 'student-b'),
            ],
            otherStudentId: String(data.otherStudentId || 'student-b'),
            otherStudentName: String(data.otherStudentName || 'Student B'),
            otherStudentClass: String(data.otherStudentClass || 'Class 11 • CBSE'),
            otherStudentAvatarGradient: String(
              data.otherStudentAvatarGradient || 'from-[#00E5FF] to-[#7B3FE4]'
            ),
            otherStudentInitials: String(data.otherStudentInitials || 'SB'),
            otherStudentOnline: true,
            lastMessage: String(data.lastMessage || ''),
            lastTimestamp: String(data.lastTimestamp || 'Just now'),
            unreadCount: Number(data.unreadCount) || 0,
          });
        });

        setConversations(() => {
          const map = new Map<string, Conversation>();
          INITIAL_CONVERSATIONS.forEach((c) => map.set(c.id, c));
          cloudConvs.forEach((c) => map.set(c.id, c));
          return Array.from(map.values());
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'conversations');
      }
    );

    return () => {
      unsubBooks();
      unsubReqs();
      unsubConvs();
    };
  }, [authReady]);

  // 3. Real-time Firestore Subcollection Listener for Active Conversation Messages
  useEffect(() => {
    if (!authReady || !activeConversationId) return;

    const msgsPath = `conversations/${activeConversationId}/messages`;
    const msgsQuery = query(
      collection(db, 'conversations', activeConversationId, 'messages'),
      where('isPublic', '==', true)
    );

    const unsubMsgs = onSnapshot(
      msgsQuery,
      (snapshot) => {
        if (snapshot.empty) return;
        const loaded: (ChatMessage & { createdMillis: number })[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const createdMillis =
            data.createdAt instanceof Timestamp
              ? data.createdAt.toMillis()
              : Date.now();
          loaded.push({
            id: docSnap.id,
            conversationId: activeConversationId,
            senderId: String(data.senderId || data.senderUid || 'student-a'),
            text: String(data.text || ''),
            timestamp: String(data.timestamp || 'Just now'),
            read: Boolean(data.read),
            attachedPhoto: data.attachedPhoto ? String(data.attachedPhoto) : undefined,
            createdMillis,
          });
        });

        loaded.sort((a, b) => a.createdMillis - b.createdMillis);

        setMessagesByConv((prev) => {
          const existing = prev[activeConversationId] || [];
          const map = new Map<string, ChatMessage>();
          existing.forEach((m) => map.set(m.id, m));
          loaded.forEach((m) => map.set(m.id, m));
          return {
            ...prev,
            [activeConversationId]: Array.from(map.values()),
          };
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, msgsPath);
      }
    );

    return () => unsubMsgs();
  }, [authReady, activeConversationId]);

  // Helper to ensure initial seed book & conversation exist in Firestore when a signed-in user interacts with them
  const ensureBookExistsInFirestore = async (book: BookListing, uid: string) => {
    try {
      await setDoc(
        doc(db, 'books', book.id),
        {
          ownerUid: uid,
          sellerId: book.sellerId.replace(/[^a-zA-Z0-9_-]/g, '_'),
          sellerName: book.sellerName.slice(0, 80),
          sellerDisplay: book.sellerDisplay.slice(0, 100),
          title: book.title.slice(0, 150),
          author: book.author.slice(0, 120),
          subject: book.subject.slice(0, 60),
          classGrade: book.classGrade.slice(0, 40),
          board: book.board.slice(0, 40),
          medium: book.medium === 'Hindi' ? 'Hindi' : 'English',
          edition: book.edition.slice(0, 80),
          condition: book.condition,
          price: Math.max(1, Math.min(50000, Number(book.price) || 200)),
          originalPrice: Math.max(1, Math.min(50000, Number(book.originalPrice) || 400)),
          description: book.description.slice(0, 1000),
          coverImage: book.coverImage.slice(0, 195000),
          galleryImages: (book.galleryImages || [book.coverImage])
            .slice(0, 5)
            .map((g) => g.slice(0, 195000)),
          status: book.status,
          requestsCount: Math.max(0, Number(book.requestsCount) || 0),
          isPublic: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );
    } catch {
      // Book may already exist in Firestore
    }
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
        (r) =>
          (r.sellerId === currentUser.id || r.sellerId === 'student-a') &&
          r.status === 'Pending'
      ).length,
    [requests, currentUser.id]
  );

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      showToast('Signed in with Google! Live Firebase Cloud Sync enabled.');
    } catch (err) {
      console.error('Google Sign-In error:', err);
      showToast('Google Sign-In popup closed or blocked.');
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await signOutUser();
      setCurrentUserId('student-a');
      showToast('Signed out of Google account. Switched to Student A (Demo).');
    } catch (err) {
      console.error('Sign-Out error:', err);
    }
  };

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

  const handleSubmitBuyRequest = async (
    book: BookListing,
    buyerName: string,
    messageText: string
  ) => {
    const reqId = `req-${Date.now()}`;
    const safeMsg = (messageText || 'Hi, I’m interested in this book. Is it still available?').slice(
      0,
      250
    );

    const newReq: BuyRequest = {
      id: reqId,
      bookId: book.id,
      bookTitle: book.title,
      bookCover: book.coverImage,
      bookPrice: book.price,
      bookCondition: book.condition,
      buyerId: currentUser.id,
      buyerName: buyerName.slice(0, 100),
      buyerAvatarGradient: currentUser.avatarGradient,
      buyerInitials: currentUser.initials,
      sellerId: book.sellerId,
      sellerName: book.sellerDisplay,
      message: safeMsg,
      timestamp: 'Just now',
      createdAt: Date.now(),
      status: 'Pending',
    };

    setRequests((prev) => [newReq, ...prev]);
    setBooks((prev) =>
      prev.map((b) =>
        b.id === book.id ? { ...b, requestsCount: b.requestsCount + 1 } : b
      )
    );

    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const existingConv = conversations.find((c) => c.bookId === book.id);
    const targetConvId = existingConv ? existingConv.id : `conv-${Date.now()}`;
    const sellerUser = usersMap[book.sellerId] || DEMO_USERS['student-a'];

    if (existingConv) {
      const newMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        conversationId: existingConv.id,
        senderId: currentUser.id,
        text: `📘 Buy Request Sent: ${safeMsg}`,
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
            ? { ...c, lastMessage: safeMsg, lastTimestamp: 'Just now' }
            : c
        )
      );
      setActiveConversationId(existingConv.id);
    } else {
      const newConv: Conversation = {
        id: targetConvId,
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
        lastMessage: safeMsg,
        lastTimestamp: 'Just now',
        unreadCount: 0,
      };
      const firstMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        conversationId: targetConvId,
        senderId: currentUser.id,
        text: safeMsg,
        timestamp: nowTime,
        read: true,
      };
      setConversations((prev) => [newConv, ...prev]);
      setMessagesByConv((prev) => ({ ...prev, [targetConvId]: [firstMsg] }));
      setActiveConversationId(targetConvId);
    }

    setRequestModalBook(null);
    showToast('Buy request sent successfully.');

    // Persist to Firestore if authenticated
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      try {
        await ensureBookExistsInFirestore(book, uid);
        await setDoc(doc(db, 'requests', reqId), {
          bookId: book.id.replace(/[^a-zA-Z0-9_-]/g, '_'),
          bookTitle: book.title.slice(0, 150),
          bookCover: book.coverImage.slice(0, 195000),
          bookPrice: Math.max(1, Math.min(50000, Number(book.price) || 200)),
          bookCondition: book.condition,
          buyerUid: uid,
          buyerId: currentUser.id.replace(/[^a-zA-Z0-9_-]/g, '_'),
          buyerName: buyerName.slice(0, 100),
          buyerAvatarGradient: currentUser.avatarGradient.slice(0, 100),
          buyerInitials: currentUser.initials.slice(0, 6),
          sellerUid: uid,
          sellerId: book.sellerId.replace(/[^a-zA-Z0-9_-]/g, '_'),
          sellerName: book.sellerDisplay.slice(0, 100),
          message: safeMsg,
          status: 'Pending',
          isPublic: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        await setDoc(doc(db, 'conversations', targetConvId), {
          bookId: book.id.replace(/[^a-zA-Z0-9_-]/g, '_'),
          bookTitle: book.title.slice(0, 150),
          bookPrice: Math.max(1, Math.min(50000, Number(book.price) || 200)),
          bookCondition: book.condition,
          bookCover: book.coverImage.slice(0, 195000),
          ownerUid: uid,
          otherStudentId: sellerUser.id.replace(/[^a-zA-Z0-9_-]/g, '_'),
          otherStudentName: sellerUser.displayName.slice(0, 100),
          otherStudentClass: `${sellerUser.classGrade} • ${sellerUser.board}`.slice(0, 60),
          otherStudentAvatarGradient: sellerUser.avatarGradient.slice(0, 100),
          otherStudentInitials: sellerUser.initials.slice(0, 6),
          lastMessage: safeMsg.slice(0, 500),
          lastTimestamp: nowTime.slice(0, 40),
          unreadCount: 0,
          isPublic: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        const msgDocId = `m-${Date.now()}`;
        await setDoc(
          doc(db, 'conversations', targetConvId, 'messages', msgDocId),
          {
            conversationId: targetConvId,
            senderUid: uid,
            senderId: currentUser.id.replace(/[^a-zA-Z0-9_-]/g, '_'),
            text: `📘 Buy Request Sent: ${safeMsg}`.slice(0, 500),
            timestamp: nowTime.slice(0, 40),
            read: true,
            isPublic: true,
            createdAt: serverTimestamp(),
          }
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `requests/${reqId}`);
      }
    }
  };

  const handleOpenChatForBook = async (book: BookListing) => {
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
    const firstText = `Hi! I'm interested in your listing "${book.title}" (₹${book.price}). Is it available for exchange at school?`;
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
      lastMessage: firstText,
      lastTimestamp: 'Just now',
      unreadCount: 0,
    };

    const initialMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      conversationId: newConvId,
      senderId: currentUser.id,
      text: firstText,
      timestamp: 'Just now',
      read: true,
    };

    setConversations((prev) => [newConv, ...prev]);
    setMessagesByConv((prev) => ({ ...prev, [newConvId]: [initialMsg] }));
    setActiveConversationId(newConvId);
    setActiveScreen('chat');

    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      try {
        await ensureBookExistsInFirestore(book, uid);
        await setDoc(doc(db, 'conversations', newConvId), {
          bookId: book.id.replace(/[^a-zA-Z0-9_-]/g, '_'),
          bookTitle: book.title.slice(0, 150),
          bookPrice: Math.max(1, Math.min(50000, Number(book.price) || 200)),
          bookCondition: book.condition,
          bookCover: book.coverImage.slice(0, 195000),
          ownerUid: uid,
          otherStudentId: sellerUser.id.replace(/[^a-zA-Z0-9_-]/g, '_'),
          otherStudentName: sellerUser.displayName.slice(0, 100),
          otherStudentClass: `${sellerUser.classGrade} • ${sellerUser.board}`.slice(0, 60),
          otherStudentAvatarGradient: sellerUser.avatarGradient.slice(0, 100),
          otherStudentInitials: sellerUser.initials.slice(0, 6),
          lastMessage: firstText.slice(0, 500),
          lastTimestamp: 'Just now',
          unreadCount: 0,
          isPublic: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `conversations/${newConvId}`);
      }
    }
  };

  const handleSendMessage = async (
    text: string,
    attachedPhoto?: string,
    isLocationPin?: boolean
  ) => {
    if (!activeConversation) return;
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const msgId = `m-${Date.now()}`;
    const safeText = text.slice(0, 500);

    const newMsg: ChatMessage = {
      id: msgId,
      conversationId: activeConversation.id,
      senderId: currentUser.id,
      text: safeText,
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
          ? { ...c, lastMessage: safeText, lastTimestamp: nowTime, unreadCount: 0 }
          : c
      )
    );

    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const convId = activeConversation.id;
      const linkedBook =
        books.find((b) => b.id === activeConversation.bookId) || books[0];
      try {
        await ensureBookExistsInFirestore(linkedBook, uid);
        await setDoc(
          doc(db, 'conversations', convId),
          {
            bookId: activeConversation.bookId.replace(/[^a-zA-Z0-9_-]/g, '_'),
            bookTitle: activeConversation.bookTitle.slice(0, 150),
            bookPrice: Math.max(
              1,
              Math.min(50000, Number(activeConversation.bookPrice) || 250)
            ),
            bookCondition: activeConversation.bookCondition,
            bookCover: activeConversation.bookCover.slice(0, 195000),
            ownerUid: uid,
            otherStudentId: activeConversation.otherStudentId.replace(
              /[^a-zA-Z0-9_-]/g,
              '_'
            ),
            otherStudentName: activeConversation.otherStudentName.slice(0, 100),
            otherStudentClass: activeConversation.otherStudentClass.slice(0, 60),
            otherStudentAvatarGradient:
              activeConversation.otherStudentAvatarGradient.slice(0, 100),
            otherStudentInitials: activeConversation.otherStudentInitials.slice(0, 6),
            lastMessage: safeText,
            lastTimestamp: nowTime.slice(0, 40),
            unreadCount: 0,
            isPublic: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );

        const msgPayload: Record<string, unknown> = {
          conversationId: convId,
          senderUid: uid,
          senderId: currentUser.id.replace(/[^a-zA-Z0-9_-]/g, '_'),
          text: safeText,
          timestamp: nowTime.slice(0, 40),
          read: true,
          isPublic: true,
          createdAt: serverTimestamp(),
        };
        if (attachedPhoto) {
          msgPayload.attachedPhoto = attachedPhoto.slice(0, 195000);
        }

        await setDoc(
          doc(db, 'conversations', convId, 'messages', msgId),
          msgPayload
        );
      } catch (err) {
        handleFirestoreError(
          err,
          OperationType.CREATE,
          `conversations/${convId}/messages/${msgId}`
        );
      }
    }
  };

  const handleSimulatePartnerReply = async () => {
    if (!activeConversation) return;
    const replies = [
      `Sounds great! Let's meet near the school library counter at 4:00 PM to check "${activeConversation.bookTitle}".`,
      `Yes, all chapters and diagrams are completely clean! You can inspect the book before paying ₹${activeConversation.bookPrice}.`,
      `Perfect! I will keep the textbook in my school bag tomorrow morning.`,
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)].slice(0, 500);
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const msgId = `m-${Date.now()}`;

    const replyMsg: ChatMessage = {
      id: msgId,
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

    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const convId = activeConversation.id;
      const linkedBook =
        books.find((b) => b.id === activeConversation.bookId) || books[0];
      try {
        await ensureBookExistsInFirestore(linkedBook, uid);
        await setDoc(doc(db, 'conversations', convId), {
          bookId: activeConversation.bookId.replace(/[^a-zA-Z0-9_-]/g, '_'),
          bookTitle: activeConversation.bookTitle.slice(0, 150),
          bookPrice: Math.max(
            1,
            Math.min(50000, Number(activeConversation.bookPrice) || 250)
          ),
          bookCondition: activeConversation.bookCondition,
          bookCover: activeConversation.bookCover.slice(0, 195000),
          ownerUid: uid,
          otherStudentId: activeConversation.otherStudentId.replace(
            /[^a-zA-Z0-9_-]/g,
            '_'
          ),
          otherStudentName: activeConversation.otherStudentName.slice(0, 100),
          otherStudentClass: activeConversation.otherStudentClass.slice(0, 60),
          otherStudentAvatarGradient:
            activeConversation.otherStudentAvatarGradient.slice(0, 100),
          otherStudentInitials: activeConversation.otherStudentInitials.slice(0, 6),
          lastMessage: randomReply,
          lastTimestamp: nowTime.slice(0, 40),
          unreadCount: 0,
          isPublic: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        await setDoc(
          doc(db, 'conversations', convId, 'messages', msgId),
          {
            conversationId: convId,
            senderUid: uid,
            senderId: activeConversation.otherStudentId.replace(/[^a-zA-Z0-9_-]/g, '_'),
            text: randomReply,
            timestamp: nowTime.slice(0, 40),
            read: true,
            isPublic: true,
            createdAt: serverTimestamp(),
          }
        );
      } catch (err) {
        handleFirestoreError(
          err,
          OperationType.CREATE,
          `conversations/${convId}/messages/${msgId}`
        );
      }
    }
  };

  const handleSaveBookListing = async (
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
    const bookId = existingId || `book-${Date.now()}`;
    const sellerShort = currentUser.shortRole.replace(' (Demo)', '').slice(0, 80);

    const updatedOrNewBook: BookListing = {
      ...bookData,
      id: bookId,
      sellerId: currentUser.id,
      sellerName: sellerShort,
      sellerDisplay: currentUser.displayName,
      postedTime: 'Just now',
      createdAt: Date.now(),
      status: 'Available',
      requestsCount: existingId
        ? books.find((b) => b.id === existingId)?.requestsCount || 0
        : 0,
    };

    if (existingId) {
      setBooks((prev) =>
        prev.map((b) => (b.id === existingId ? { ...b, ...bookData } : b))
      );
      setEditingBook(null);
      setSelectedBookId(existingId);
      setActiveScreen('book-details');
      showToast('Book listing updated successfully.');
    } else {
      setBooks((prev) => [updatedOrNewBook, ...prev]);
      setSelectedBookId(bookId);
      setActiveScreen('book-details');
      showToast('Listing published to My Book Buddy!');
    }

    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      try {
        await setDoc(doc(db, 'books', bookId), {
          ownerUid: uid,
          sellerId: currentUser.id.replace(/[^a-zA-Z0-9_-]/g, '_'),
          sellerName: sellerShort,
          sellerDisplay: currentUser.displayName.slice(0, 100),
          title: bookData.title.slice(0, 150),
          author: bookData.author.slice(0, 120),
          subject: bookData.subject.slice(0, 60),
          classGrade: bookData.classGrade.slice(0, 40),
          board: bookData.board.slice(0, 40),
          medium: bookData.medium === 'Hindi' ? 'Hindi' : 'English',
          edition: bookData.edition.slice(0, 80),
          condition: bookData.condition,
          price: Math.max(1, Math.min(50000, Number(bookData.price) || 200)),
          originalPrice: Math.max(
            1,
            Math.min(50000, Number(bookData.originalPrice) || 400)
          ),
          description: bookData.description.slice(0, 1000),
          coverImage: bookData.coverImage.slice(0, 195000),
          galleryImages: (bookData.galleryImages || [bookData.coverImage])
            .slice(0, 5)
            .map((g) => g.slice(0, 195000)),
          status: 'Available',
          requestsCount: updatedOrNewBook.requestsCount,
          isPublic: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `books/${bookId}`);
      }
    }
  };

  const handleToggleSoldStatus = async (bookId: string) => {
    const target = books.find((b) => b.id === bookId);
    if (!target) return;
    const nextStatus = target.status === 'Available' ? 'Sold' : 'Available';

    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, status: nextStatus } : b))
    );

    showToast(
      nextStatus === 'Sold'
        ? `"${target.title}" marked as Sold!`
        : `"${target.title}" relisted as Available!`
    );

    if (auth.currentUser) {
      try {
        await ensureBookExistsInFirestore(target, auth.currentUser.uid);
        await updateDoc(doc(db, 'books', bookId), {
          status: nextStatus,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `books/${bookId}`);
      }
    }
  };

  const handleUpdateRequestStatus = async (
    requestId: string,
    newStatus: 'Accepted' | 'Declined' | 'Completed'
  ) => {
    const targetReq = requests.find((r) => r.id === requestId);
    if (!targetReq) return;

    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
    );
    showToast(`Buy request marked as ${newStatus}.`);

    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'requests', requestId), {
          status: newStatus,
          updatedAt: serverTimestamp(),
        });
      } catch {
        // Request may have been a local demo seed request; create it in Firestore
        const uid = auth.currentUser.uid;
        const linkedBook = books.find((b) => b.id === targetReq.bookId) || books[0];
        try {
          await ensureBookExistsInFirestore(linkedBook, uid);
          await setDoc(doc(db, 'requests', requestId), {
            bookId: targetReq.bookId.replace(/[^a-zA-Z0-9_-]/g, '_'),
            bookTitle: targetReq.bookTitle.slice(0, 150),
            bookCover: targetReq.bookCover.slice(0, 195000),
            bookPrice: Math.max(1, Math.min(50000, Number(targetReq.bookPrice) || 200)),
            bookCondition: targetReq.bookCondition,
            buyerUid: uid,
            buyerId: targetReq.buyerId.replace(/[^a-zA-Z0-9_-]/g, '_'),
            buyerName: targetReq.buyerName.slice(0, 100),
            buyerAvatarGradient: targetReq.buyerAvatarGradient.slice(0, 100),
            buyerInitials: targetReq.buyerInitials.slice(0, 6),
            sellerUid: uid,
            sellerId: targetReq.sellerId.replace(/[^a-zA-Z0-9_-]/g, '_'),
            sellerName: targetReq.sellerName.slice(0, 100),
            message: targetReq.message.slice(0, 250),
            status: newStatus,
            isPublic: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `requests/${requestId}`);
        }
      }
    }
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

  const viewportContainerClass =
    viewportMode === 'mobile'
      ? 'max-w-[412px] mx-auto border-x border-white/15 min-h-screen shadow-[0_0_80px_rgba(123,63,228,0.3)] bg-[#070A18]'
      : viewportMode === 'tablet'
      ? 'max-w-[820px] mx-auto border-x border-white/15 min-h-screen shadow-[0_0_80px_rgba(123,63,228,0.25)] bg-[#070A18]'
      : 'w-full min-h-screen bg-[#070A18]';

  return (
    <div className="min-h-screen bg-[#050711] text-white">
      <div className={viewportContainerClass}>
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
          isGoogleSignedIn={Boolean(firebaseUser)}
          onGoogleSignIn={handleGoogleSignIn}
        />

        <DemoTourBanner
          tourStep={tourStep}
          onNextStep={handleNextTourStep}
          onPrevStep={handlePrevTourStep}
          onEndTour={() => setTourStep(null)}
        />

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
              isGoogleSignedIn={Boolean(firebaseUser)}
              onGoogleSignIn={handleGoogleSignIn}
              onGoogleSignOut={handleGoogleSignOut}
              onUpdateProfileName={async (newName, newClass, newSchool) => {
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

                if (auth.currentUser && currentUser.id === auth.currentUser.uid) {
                  try {
                    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                      displayName: newName.slice(0, 100),
                      classGrade: newClass.slice(0, 40),
                      school: newSchool.slice(0, 120),
                      updatedAt: serverTimestamp(),
                    });
                  } catch (err) {
                    handleFirestoreError(
                      err,
                      OperationType.UPDATE,
                      `users/${auth.currentUser.uid}`
                    );
                  }
                }
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

        <BottomNav
          activeScreen={activeScreen}
          onNavigate={handleNavigate}
          unreadMessagesCount={unreadMessagesCount}
          forceShow={viewportMode === 'mobile'}
        />

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
          onReported={async () => {
            showToast('Thank you. Listing reported to student moderators.');
            if (auth.currentUser && reportBookTitle) {
              const repId = `rep-${Date.now()}`;
              try {
                await setDoc(doc(db, 'reports', repId), {
                  bookTitle: reportBookTitle.slice(0, 150),
                  reporterUid: auth.currentUser.uid,
                  reason: 'Reported via Book Details',
                  notes: 'Submitted for moderator review',
                  createdAt: serverTimestamp(),
                });
              } catch (err) {
                handleFirestoreError(err, OperationType.CREATE, `reports/${repId}`);
              }
            }
          }}
        />

        <ToastNotification
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      </div>
    </div>
  );
}
