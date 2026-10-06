export type ScreenId =
  | 'home'
  | 'browse'
  | 'book-details'
  | 'sell'
  | 'messages'
  | 'chat'
  | 'dashboard'
  | 'requests'
  | 'profile'
  | 'demo'
  | 'trust';

export type ViewportMode = 'auto' | 'mobile' | 'tablet' | 'desktop';

export type BookCondition = 'Like New' | 'Good' | 'Used' | 'Heavily Used';

export interface StudentUser {
  id: string;
  name: string;
  displayName: string;
  shortRole: string;
  avatarGradient: string;
  initials: string;
  classGrade: string;
  board: string;
  school: string;
  memberSince: string;
  verified: boolean;
  online: boolean;
  bio: string;
}

export interface BookListing {
  id: string;
  title: string;
  author: string;
  subject: string;
  classGrade: string;
  board: string;
  medium: 'English' | 'Hindi';
  edition: string;
  condition: BookCondition;
  price: number;
  originalPrice: number;
  description: string;
  coverImage: string;
  galleryImages: string[];
  sellerId: string;
  sellerName: string;
  sellerDisplay: string;
  postedTime: string;
  createdAt: number;
  status: 'Available' | 'Sold';
  requestsCount: number;
}

export interface BuyRequest {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  bookPrice: number;
  bookCondition: BookCondition;
  buyerId: string;
  buyerName: string;
  buyerAvatarGradient: string;
  buyerInitials: string;
  sellerId: string;
  sellerName: string;
  message: string;
  timestamp: string;
  createdAt: number;
  status: 'Pending' | 'Accepted' | 'Declined' | 'Completed';
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
  attachedPhoto?: string;
  isLocationPin?: boolean;
}

export interface Conversation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookPrice: number;
  bookCondition: BookCondition;
  bookCover: string;
  participantIds: string[];
  otherStudentId: string;
  otherStudentName: string;
  otherStudentClass: string;
  otherStudentAvatarGradient: string;
  otherStudentInitials: string;
  otherStudentOnline: boolean;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
}

export interface FilterState {
  search: string;
  classGrade: string;
  subject: string;
  board: string;
  medium: string;
  condition: string;
  availability: string;
  minPrice: string;
  maxPrice: string;
  sortBy: 'newest' | 'price-asc' | 'price-desc';
}
