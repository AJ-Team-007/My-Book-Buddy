# Security Specification — My Book Buddy (Firestore)

## 1. Data Invariants
1. **Verified Identity Invariant**: Every write operation (`create`, `update`, `delete`) requires `request.auth != null` and `request.auth.token.email_verified == true`.
2. **User Profile Ownership Invariant**: A document at `/users/{userId}` can only be created or updated if `userId == request.auth.uid` and `incoming().uid == request.auth.uid`. No PII (`email`, `phone`, `address`) is permitted in `/users/{userId}`.
3. **Book Listing Integrity Invariant**: A book at `/books/{bookId}` must have `ownerUid == request.auth.uid`, valid bounded strings, valid `condition` enum (`Like New`, `Good`, `Used`, `Heavily Used`), valid `status` (`Available`, `Sold`), and `galleryImages.size() <= 5`.
4. **Buy Request Relational Invariant**: A buy request at `/requests/{requestId}` requires `buyerUid == request.auth.uid` and `exists(/databases/$(database)/documents/books/$(incoming().bookId))`. Once `status` reaches terminal state (`Completed` or `Declined`), no further status updates are permitted.
5. **Conversation & Subcollection Master Gate Invariant**: A message at `/conversations/{conversationId}/messages/{messageId}` requires the parent `/conversations/{conversationId}` document to exist via `get()` and be active (`isPublic == true` or `ownerUid == request.auth.uid`).
6. **Temporal Integrity Invariant**: All `createdAt` and `updatedAt` fields must strictly equal `request.time`.

## 2. The "Dirty Dozen" Payloads
1. **Unverified Email Spoof**: Authenticated user with `email_verified: false` attempting to create a book listing.
2. **Identity Spoofing on Book Creation**: Setting `ownerUid: "victim-uid"` when `request.auth.uid == "attacker-uid"`.
3. **Shadow Field Injection on Book Update**: Updating a book with `{ price: 200, isAdmin: true }`.
4. **Resource Exhaustion / ID Poisoning**: Creating a document with a 200-character or special-character ID `book$@#123`.
5. **Orphaned Buy Request**: Creating a `/requests/{requestId}` referencing a non-existent `bookId`.
6. **Terminal State Reversal**: Attempting to update a `/requests/{requestId}` document after its `status` is already `'Declined'` or `'Completed'`.
7. **Unbounded Array Poisoning**: Sending `galleryImages` with 25 items (`size() > 5`).
8. **Value Poisoning on Update**: Updating `price` on `/books/{bookId}` with a string `"free"` instead of a positive number.
9. **Timestamp Forgery**: Sending a client-crafted past/future timestamp instead of `request.time`.
10. **Immortal Field Mutation**: Attempting to mutate `createdAt` or `ownerUid` during a book update.
11. **Orphaned Subcollection Message**: Attempting to create a message under `/conversations/non-existent-conv/messages/m1`.
12. **Blanket Unfiltered List Scraping**: Attempting to list a collection without satisfying `resource.data.isPublic == true` or ownership.
