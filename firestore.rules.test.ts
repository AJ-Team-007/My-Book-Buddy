/**
 * Firestore Security Rules Test Suite for My Book Buddy
 * Verifies that all "Dirty Dozen" adversarial payloads return PERMISSION_DENIED.
 */

export interface DirtyPayloadTestCase {
  id: number;
  name: string;
  collectionPath: string;
  operation: 'create' | 'update' | 'get' | 'list';
  auth: { uid: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TESTS: DirtyPayloadTestCase[] = [
  {
    id: 1,
    name: 'Unverified Email Spoof on Book Create',
    collectionPath: '/books/book-101',
    operation: 'create',
    auth: { uid: 'user-1', email_verified: false },
    payload: { ownerUid: 'user-1', title: 'Physics' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Identity Spoofing on Book Create',
    collectionPath: '/books/book-102',
    operation: 'create',
    auth: { uid: 'attacker-uid', email_verified: true },
    payload: { ownerUid: 'victim-uid', title: 'Physics' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Shadow Field Injection on Book Update',
    collectionPath: '/books/book-1',
    operation: 'update',
    auth: { uid: 'user-1', email_verified: true },
    payload: { price: 250, isVerifiedAdmin: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'ID Poisoning with Special Characters',
    collectionPath: '/books/invalid$id!@#',
    operation: 'create',
    auth: { uid: 'user-1', email_verified: true },
    payload: { ownerUid: 'user-1', title: 'Chemistry' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Orphaned Buy Request for Non-Existent Book',
    collectionPath: '/requests/req-999',
    operation: 'create',
    auth: { uid: 'user-1', email_verified: true },
    payload: { bookId: 'missing-book-id', buyerUid: 'user-1' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Terminal State Mutation on Declined Buy Request',
    collectionPath: '/requests/req-declined',
    operation: 'update',
    auth: { uid: 'user-1', email_verified: true },
    payload: { status: 'Accepted' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Unbounded Array Poisoning on galleryImages',
    collectionPath: '/books/book-103',
    operation: 'create',
    auth: { uid: 'user-1', email_verified: true },
    payload: {
      ownerUid: 'user-1',
      galleryImages: ['1', '2', '3', '4', '5', '6', '7'],
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Value Type Poisoning on Price Field',
    collectionPath: '/books/book-1',
    operation: 'update',
    auth: { uid: 'user-1', email_verified: true },
    payload: { price: 'two-hundred' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Timestamp Forgery on Creation',
    collectionPath: '/books/book-104',
    operation: 'create',
    auth: { uid: 'user-1', email_verified: true },
    payload: { ownerUid: 'user-1', createdAt: '2020-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Immortal Field Mutation on ownerUid',
    collectionPath: '/books/book-1',
    operation: 'update',
    auth: { uid: 'user-1', email_verified: true },
    payload: { ownerUid: 'other-user' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Orphaned Subcollection Chat Message',
    collectionPath: '/conversations/missing-conv/messages/msg-1',
    operation: 'create',
    auth: { uid: 'user-1', email_verified: true },
    payload: { senderUid: 'user-1', text: 'Hello' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Unauthorized Private Document List Query',
    collectionPath: '/books',
    operation: 'list',
    auth: null,
    expectedResult: 'PERMISSION_DENIED',
  },
];
