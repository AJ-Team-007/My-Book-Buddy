import { StudentUser, BookListing, BuyRequest, Conversation, ChatMessage } from './types';

export const HERO_BOOKS_IMAGE = '/src/assets/images/hero_books_stack_1791257775159.jpg';
export const COVER_PHYSICS_11 = '/src/assets/images/book_physics_11_1791257789052.jpg';
export const COVER_CHEMISTRY_12 = '/src/assets/images/book_chemistry_12_1791257804497.jpg';
export const COVER_MATH_10 = '/src/assets/images/book_math_10_1791257815522.jpg';
export const COVER_BIOLOGY_11 = '/src/assets/images/book_biology_11_1791257828164.jpg';

// SVG Data URLs for secondary previews (open pages, back cover, chemistry guide, computer science, english)
export const SVG_OPEN_PAGES = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B0F26"/>
      <stop offset="100%" stop-color="#1E1B4B"/>
    </linearGradient>
    <linearGradient id="page" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="48%" stop-color="#E2E8F0"/>
      <stop offset="50%" stop-color="#94A3B8"/>
      <stop offset="52%" stop-color="#F1F5F9"/>
      <stop offset="100%" stop-color="#F8FAFC"/>
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#bg)"/>
  <rect x="50" y="120" width="500" height="560" rx="12" fill="#0EA5E9" opacity="0.3"/>
  <rect x="60" y="130" width="480" height="540" rx="8" fill="url(#page)"/>
  <line x1="300" y1="130" x2="300" y2="670" stroke="#CBD5E1" stroke-width="3"/>
  <!-- Left Page Diagram & Lines -->
  <text x="90" y="185" fill="#0F172A" font-family="sans-serif" font-size="16" font-weight="bold">Chapter 4: Laws of Motion</text>
  <rect x="90" y="210" width="180" height="8" rx="4" fill="#94A3B8"/>
  <rect x="90" y="230" width="160" height="8" rx="4" fill="#94A3B8"/>
  <rect x="90" y="250" width="175" height="8" rx="4" fill="#94A3B8"/>
  <rect x="90" y="285" width="180" height="120" rx="8" fill="#E0F2FE" stroke="#0284C7" stroke-width="2"/>
  <circle cx="150" cy="345" r="28" fill="none" stroke="#0284C7" stroke-width="3"/>
  <path d="M 150 345 L 220 315 M 150 345 L 220 375" stroke="#EC4899" stroke-width="3"/>
  <rect x="90" y="430" width="180" height="8" rx="4" fill="#94A3B8"/>
  <rect x="90" y="450" width="150" height="8" rx="4" fill="#94A3B8"/>
  <rect x="90" y="470" width="170" height="8" rx="4" fill="#94A3B8"/>
  <!-- Right Page Clean Notes -->
  <text x="330" y="185" fill="#0F172A" font-family="sans-serif" font-size="16" font-weight="bold">4.2 Conservation of Momentum</text>
  <rect x="330" y="210" width="180" height="8" rx="4" fill="#94A3B8"/>
  <rect x="330" y="230" width="170" height="8" rx="4" fill="#94A3B8"/>
  <rect x="330" y="265" width="180" height="50" rx="6" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5"/>
  <text x="348" y="296" fill="#B45309" font-family="monospace" font-size="16" font-weight="bold">F = dp / dt = m·a</text>
  <rect x="330" y="340" width="180" height="8" rx="4" fill="#94A3B8"/>
  <rect x="330" y="360" width="160" height="8" rx="4" fill="#94A3B8"/>
  <rect x="330" y="380" width="175" height="8" rx="4" fill="#94A3B8"/>
  <circle cx="460" cy="590" r="32" fill="#10B981" opacity="0.15"/>
  <text x="330" y="635" fill="#059669" font-family="sans-serif" font-size="13" font-weight="bold">✓ Clean Unmarked Pages</text>
</svg>
`)}`;

export const SVG_BACK_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B0F26"/>
      <stop offset="100%" stop-color="#121836"/>
    </linearGradient>
    <linearGradient id="coverBack" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#bg2)"/>
  <rect x="100" y="80" width="400" height="640" rx="16" fill="url(#coverBack)" stroke="#38BDF8" stroke-width="2" stroke-opacity="0.4"/>
  <rect x="140" y="130" width="320" height="90" rx="10" fill="#0F172A" stroke="#334155" stroke-width="1"/>
  <text x="165" y="168" fill="#38BDF8" font-family="sans-serif" font-size="18" font-weight="bold">NATIONAL COUNCIL OF</text>
  <text x="165" y="195" fill="#F8FAFC" font-family="sans-serif" font-size="16" font-weight="bold">EDUCATIONAL RESEARCH</text>
  <rect x="140" y="260" width="280" height="10" rx="5" fill="#475569"/>
  <rect x="140" y="285" width="310" height="10" rx="5" fill="#475569"/>
  <rect x="140" y="310" width="260" height="10" rx="5" fill="#475569"/>
  <rect x="140" y="335" width="290" height="10" rx="5" fill="#475569"/>
  <!-- Barcode Box -->
  <rect x="140" y="540" width="180" height="110" rx="8" fill="#F8FAFC"/>
  <rect x="160" y="555" width="6" height="60" fill="#0F172A"/>
  <rect x="172" y="555" width="12" height="60" fill="#0F172A"/>
  <rect x="190" y="555" width="4" height="60" fill="#0F172A"/>
  <rect x="200" y="555" width="10" height="60" fill="#0F172A"/>
  <rect x="216" y="555" width="6" height="60" fill="#0F172A"/>
  <rect x="228" y="555" width="14" height="60" fill="#0F172A"/>
  <rect x="248" y="555" width="4" height="60" fill="#0F172A"/>
  <rect x="258" y="555" width="8" height="60" fill="#0F172A"/>
  <rect x="272" y="555" width="12" height="60" fill="#0F172A"/>
  <rect x="290" y="555" width="6" height="60" fill="#0F172A"/>
  <text x="165" y="635" fill="#0F172A" font-family="monospace" font-size="13" font-weight="bold">ISBN 978-81-7450-1</text>
  <circle cx="400" cy="595" r="42" fill="#10B981" opacity="0.2" stroke="#10B981" stroke-width="2"/>
  <text x="372" y="600" fill="#34D399" font-family="sans-serif" font-size="14" font-weight="bold">VERIFIED</text>
</svg>
`)}`;

export const SVG_CHEM_GUIDE_11 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="chemBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3B0764"/>
      <stop offset="50%" stop-color="#1E1B4B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#FF2E93"/>
      <stop offset="100%" stop-color="#7B3FE4"/>
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#chemBg)"/>
  <rect x="45" y="45" width="510" height="710" rx="20" fill="none" stroke="#FF2E93" stroke-width="2" stroke-opacity="0.4"/>
  <rect x="80" y="90" width="170" height="36" rx="18" fill="url(#accent)"/>
  <text x="105" y="114" fill="#FFFFFF" font-family="sans-serif" font-size="16" font-weight="bold">CLASS 11 • CBSE</text>
  <text x="80" y="195" fill="#F8FAFC" font-family="sans-serif" font-size="48" font-weight="800">CHEMISTRY</text>
  <text x="80" y="250" fill="#38BDF8" font-family="sans-serif" font-size="34" font-weight="700">REFERENCE GUIDE</text>
  <text x="80" y="290" fill="#CBD5E1" font-family="sans-serif" font-size="18">Organic, Inorganic &amp; Physical</text>
  <!-- Hexagonal ring graphic -->
  <g transform="translate(300, 470)" stroke="#38BDF8" stroke-width="4" fill="none">
    <polygon points="0,-110 95,-55 95,55 0,110 -95,55 -95,-55" stroke="#FF2E93" stroke-width="5"/>
    <polygon points="0,-80 70,-40 70,40 0,80 -70,40 -70,-40" stroke="#38BDF8" stroke-width="3" stroke-dasharray="10,6"/>
    <circle cx="0" cy="-110" r="14" fill="#38BDF8"/>
    <circle cx="95" cy="-55" r="14" fill="#FF2E93"/>
    <circle cx="95" cy="55" r="14" fill="#38BDF8"/>
    <circle cx="0" cy="110" r="14" fill="#FFD13B"/>
    <circle cx="-95" cy="55" r="14" fill="#38BDF8"/>
    <circle cx="-95" cy="-55" r="14" fill="#FF2E93"/>
  </g>
  <text x="80" y="695" fill="#FFD13B" font-family="sans-serif" font-size="22" font-weight="bold">Dr. R.K. Sharma • Latest Edition</text>
</svg>
`)}`;

export const SVG_CS_PYTHON_12 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="csBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#091E3A"/>
      <stop offset="50%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E1B4B"/>
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#csBg)"/>
  <rect x="45" y="45" width="510" height="710" rx="20" fill="none" stroke="#38BDF8" stroke-width="2" stroke-opacity="0.45"/>
  <rect x="80" y="90" width="180" height="36" rx="18" fill="#0284C7"/>
  <text x="102" y="114" fill="#FFFFFF" font-family="sans-serif" font-size="16" font-weight="bold">CLASS 12 • NCERT</text>
  <text x="80" y="190" fill="#F8FAFC" font-family="sans-serif" font-size="44" font-weight="800">COMPUTER</text>
  <text x="80" y="245" fill="#38BDF8" font-family="sans-serif" font-size="44" font-weight="800">SCIENCE</text>
  <text x="80" y="290" fill="#FFD13B" font-family="monospace" font-size="22" font-weight="bold">WITH PYTHON &amp; SQL</text>
  <rect x="80" y="340" width="440" height="260" rx="16" fill="#070A18" stroke="#38BDF8" stroke-width="2"/>
  <circle cx="110" cy="370" r="7" fill="#EF4444"/>
  <circle cx="132" cy="370" r="7" fill="#F59E0B"/>
  <circle cx="154" cy="370" r="7" fill="#10B981"/>
  <text x="105" y="425" fill="#FF2E93" font-family="monospace" font-size="20">def</text>
  <text x="155" y="425" fill="#38BDF8" font-family="monospace" font-size="20">binary_search(arr, x):</text>
  <text x="130" y="465" fill="#A78BFA" font-family="monospace" font-size="18">low, high = 0, len(arr) - 1</text>
  <text x="130" y="505" fill="#34D399" font-family="monospace" font-size="18">while low &lt;= high:</text>
  <text x="155" y="545" fill="#FFD13B" font-family="monospace" font-size="18">return mid_index</text>
  <text x="80" y="695" fill="#94A3B8" font-family="sans-serif" font-size="20" font-weight="bold">Sumita Arora • CBSE Curriculum</text>
</svg>
`)}`;

export const SVG_ENGLISH_10 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="engBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1E1B4B"/>
      <stop offset="50%" stop-color="#311042"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#engBg)"/>
  <rect x="45" y="45" width="510" height="710" rx="20" fill="none" stroke="#FFD13B" stroke-width="2" stroke-opacity="0.45"/>
  <rect x="80" y="90" width="175" height="36" rx="18" fill="#7B3FE4"/>
  <text x="102" y="114" fill="#FFFFFF" font-family="sans-serif" font-size="16" font-weight="bold">CLASS 10 • CBSE</text>
  <text x="80" y="195" fill="#FFD13B" font-family="serif" font-size="52" font-weight="bold">FIRST FLIGHT</text>
  <text x="80" y="250" fill="#F8FAFC" font-family="sans-serif" font-size="30" font-weight="700">ENGLISH LITERATURE</text>
  <text x="80" y="290" fill="#CBD5E1" font-family="sans-serif" font-size="18">Textbook in English for Class X</text>
  <circle cx="300" cy="470" r="115" fill="none" stroke="#FFD13B" stroke-width="3" stroke-dasharray="8,8"/>
  <path d="M 220 510 Q 300 380 380 430 Q 320 480 220 510 Z" fill="#38BDF8" opacity="0.85"/>
  <text x="80" y="695" fill="#F8FAFC" font-family="sans-serif" font-size="20" font-weight="bold">NCERT • Complete Anthology</text>
</svg>
`)}`;

export const DEMO_USERS: Record<string, StudentUser> = {
  'student-a': {
    id: 'student-a',
    name: 'Jaimin & Aarush',
    displayName: 'Jaimin & Aarush (Student A)',
    shortRole: 'Student A (Demo)',
    avatarGradient: 'from-[#FF2E93] via-[#7B3FE4] to-[#00E5FF]',
    initials: 'JA',
    classGrade: 'Class 12',
    board: 'CBSE',
    school: 'Delhi Public Academy • Science Stream',
    memberSince: 'Jan 2024',
    verified: true,
    online: true,
    bio: 'Founders of My Book Buddy. Passing along well-kept NCERT & reference textbooks to juniors!',
  },
  'student-b': {
    id: 'student-b',
    name: 'Riya Verma',
    displayName: 'Riya Verma (Student B)',
    shortRole: 'Student B (Demo)',
    avatarGradient: 'from-[#00E5FF] to-[#7B3FE4]',
    initials: 'RV',
    classGrade: 'Class 11',
    board: 'CBSE',
    school: 'Delhi Public Academy • PCM Stream',
    memberSince: 'Mar 2024',
    verified: true,
    online: true,
    bio: 'Class 11 Science student looking for Physics & Chemistry books and sharing Class 10 guides.',
  },
  'student-c': {
    id: 'student-c',
    name: 'Kabir Mehta',
    displayName: 'Kabir Mehta (Student C)',
    shortRole: 'Student C (Demo)',
    avatarGradient: 'from-[#10B981] to-[#00E5FF]',
    initials: 'KM',
    classGrade: 'Class 10',
    board: 'ICSE',
    school: 'St. Xavier High School',
    memberSince: 'Jun 2024',
    verified: true,
    online: true,
    bio: 'Preparing for Class 10 board exams. Love keeping my textbooks neat and bookmark-free.',
  },
  'student-d': {
    id: 'student-d',
    name: 'Ananya Nair',
    displayName: 'Ananya Nair (Student D)',
    shortRole: 'Student D',
    avatarGradient: 'from-[#FFD13B] to-[#FF2E93]',
    initials: 'AN',
    classGrade: 'Class 12',
    board: 'CBSE',
    school: 'Delhi Public Academy • PCB Stream',
    memberSince: 'Feb 2024',
    verified: true,
    online: true,
    bio: 'NEET aspirant sharing spotless Class 11 Biology and Chemistry reference books.',
  },
};

export const INITIAL_BOOKS: BookListing[] = [
  {
    id: 'book-1',
    title: 'NCERT Physics Class 11',
    author: 'NCERT Editorial Board',
    subject: 'Physics',
    classGrade: 'Class 11',
    board: 'CBSE',
    medium: 'English',
    edition: '2024 Edition (Part 1 & 2)',
    condition: 'Good',
    price: 250,
    originalPrice: 450,
    description:
      'Complete NCERT Physics Class 11 textbook set in great condition. All pages are intact with zero torn corners. Important formula derivations have neat pencil notes that are super helpful for school exams and JEE foundation.',
    coverImage: COVER_PHYSICS_11,
    galleryImages: [COVER_PHYSICS_11, SVG_OPEN_PAGES, SVG_BACK_COVER],
    sellerId: 'student-a',
    sellerName: 'Student A',
    sellerDisplay: 'Jaimin & Aarush (Student A)',
    postedTime: '2 hours ago',
    createdAt: 1791250000000,
    status: 'Available',
    requestsCount: 2,
  },
  {
    id: 'book-2',
    title: 'NCERT Chemistry Class 12',
    author: 'NCERT Editorial Board',
    subject: 'Chemistry',
    classGrade: 'Class 12',
    board: 'CBSE',
    medium: 'English',
    edition: '2024 Rationalised Edition',
    condition: 'Like New',
    price: 300,
    originalPrice: 450,
    description:
      'Spotless Like-New NCERT Chemistry Class 12 textbook. Protected with a transparent plastic jacket since day one. Zero highlighter marks, crisp diagrams, and ready for board exam prep.',
    coverImage: COVER_CHEMISTRY_12,
    galleryImages: [COVER_CHEMISTRY_12, SVG_OPEN_PAGES, SVG_BACK_COVER],
    sellerId: 'student-a',
    sellerName: 'Student A',
    sellerDisplay: 'Jaimin & Aarush (Student A)',
    postedTime: '5 hours ago',
    createdAt: 1791245000000,
    status: 'Available',
    requestsCount: 1,
  },
  {
    id: 'book-3',
    title: 'Mathematics NCERT Class 10',
    author: 'R.D. & NCERT Committee',
    subject: 'Mathematics',
    classGrade: 'Class 10',
    board: 'CBSE',
    medium: 'English',
    edition: '2023 Reprint',
    condition: 'Used',
    price: 200,
    originalPrice: 380,
    description:
      'Standard Class 10 Mathematics textbook covering Trigonometry, Quadratic Equations, Triangles, and Statistics. Spine is strong and every exercise page is clean and readable.',
    coverImage: COVER_MATH_10,
    galleryImages: [COVER_MATH_10, SVG_OPEN_PAGES, SVG_BACK_COVER],
    sellerId: 'student-a',
    sellerName: 'Student A',
    sellerDisplay: 'Jaimin & Aarush (Student A)',
    postedTime: '1 day ago',
    createdAt: 1791230000000,
    status: 'Available',
    requestsCount: 1,
  },
  {
    id: 'book-4',
    title: 'Biology Reference Class 11',
    author: 'Dr. P.S. Verma & Trueman',
    subject: 'Biology',
    classGrade: 'Class 11',
    board: 'CBSE',
    medium: 'English',
    edition: '2024 Revised Edition',
    condition: 'Like New',
    price: 280,
    originalPrice: 520,
    description:
      'High-scoring Biology Reference book for Class 11 PCB students. Features full-color botanical & human physiology diagrams, chapter summaries, and NEET practice MCQs.',
    coverImage: COVER_BIOLOGY_11,
    galleryImages: [COVER_BIOLOGY_11, SVG_OPEN_PAGES, SVG_BACK_COVER],
    sellerId: 'student-d',
    sellerName: 'Student D',
    sellerDisplay: 'Ananya Nair (Student D)',
    postedTime: '1 day ago',
    createdAt: 1791220000000,
    status: 'Available',
    requestsCount: 1,
  },
  {
    id: 'book-5',
    title: 'Chemistry Guide Class 11',
    author: 'Dr. R.K. Sharma',
    subject: 'Chemistry',
    classGrade: 'Class 11',
    board: 'CBSE',
    medium: 'English',
    edition: '2023 Edition',
    condition: 'Used',
    price: 180,
    originalPrice: 350,
    description:
      'Complete Class 11 Chemistry practice guide with solved NCERT exercises, organic nomenclature charts, and periodic table pull-out sheet.',
    coverImage: SVG_CHEM_GUIDE_11,
    galleryImages: [SVG_CHEM_GUIDE_11, SVG_OPEN_PAGES, SVG_BACK_COVER],
    sellerId: 'student-b',
    sellerName: 'Student B',
    sellerDisplay: 'Riya Verma (Student B)',
    postedTime: '2 days ago',
    createdAt: 1791200000000,
    status: 'Available',
    requestsCount: 0,
  },
  {
    id: 'book-6',
    title: 'Computer Science with Python Class 12',
    author: 'Sumita Arora',
    subject: 'Computer Science',
    classGrade: 'Class 12',
    board: 'CBSE',
    medium: 'English',
    edition: '2024 Edition',
    condition: 'Like New',
    price: 320,
    originalPrice: 595,
    description:
      'Comprehensive Python 3, Data Structures, File Handling, and MySQL database textbook for Class 12 Computer Science. Includes solved practical lab programs.',
    coverImage: SVG_CS_PYTHON_12,
    galleryImages: [SVG_CS_PYTHON_12, SVG_OPEN_PAGES, SVG_BACK_COVER],
    sellerId: 'student-a',
    sellerName: 'Student A',
    sellerDisplay: 'Jaimin & Aarush (Student A)',
    postedTime: '3 days ago',
    createdAt: 1791190000000,
    status: 'Sold',
    requestsCount: 3,
  },
  {
    id: 'book-7',
    title: 'First Flight English Literature Class 10',
    author: 'NCERT Editorial Board',
    subject: 'English',
    classGrade: 'Class 10',
    board: 'CBSE',
    medium: 'English',
    edition: '2024 Edition',
    condition: 'Good',
    price: 140,
    originalPrice: 260,
    description:
      'Official Class 10 English Literature anthology with prose and poetry. Very well maintained with helpful word-meaning annotations in light pencil.',
    coverImage: SVG_ENGLISH_10,
    galleryImages: [SVG_ENGLISH_10, SVG_OPEN_PAGES, SVG_BACK_COVER],
    sellerId: 'student-c',
    sellerName: 'Student C',
    sellerDisplay: 'Kabir Mehta (Student C)',
    postedTime: '4 days ago',
    createdAt: 1791180000000,
    status: 'Available',
    requestsCount: 1,
  },
];

export const INITIAL_REQUESTS: BuyRequest[] = [
  {
    id: 'req-1',
    bookId: 'book-1',
    bookTitle: 'NCERT Physics Class 11',
    bookCover: COVER_PHYSICS_11,
    bookPrice: 250,
    bookCondition: 'Good',
    buyerId: 'student-b',
    buyerName: 'Riya Verma (Student B)',
    buyerAvatarGradient: 'from-[#00E5FF] to-[#7B3FE4]',
    buyerInitials: 'RV',
    sellerId: 'student-a',
    sellerName: 'Jaimin & Aarush (Student A)',
    message: 'Hi! I am in Class 11 PCM and really need this NCERT Physics book. Can we meet near the school library tomorrow?',
    timestamp: '10 mins ago',
    createdAt: 1791257000000,
    status: 'Pending',
  },
  {
    id: 'req-2',
    bookId: 'book-2',
    bookTitle: 'NCERT Chemistry Class 12',
    bookCover: COVER_CHEMISTRY_12,
    bookPrice: 300,
    bookCondition: 'Like New',
    buyerId: 'student-c',
    buyerName: 'Kabir Mehta (Student C)',
    buyerAvatarGradient: 'from-[#10B981] to-[#00E5FF]',
    buyerInitials: 'KM',
    sellerId: 'student-a',
    sellerName: 'Jaimin & Aarush (Student A)',
    message: 'Hello Jaimin & Aarush! Buying this for my elder sister. Is the price ₹300 final? Ready to pick up at 2 PM recess.',
    timestamp: '1 hour ago',
    createdAt: 1791254000000,
    status: 'Pending',
  },
  {
    id: 'req-3',
    bookId: 'book-3',
    bookTitle: 'Mathematics NCERT Class 10',
    bookCover: COVER_MATH_10,
    bookPrice: 200,
    bookCondition: 'Used',
    buyerId: 'student-c',
    buyerName: 'Kabir Mehta (Student C)',
    buyerAvatarGradient: 'from-[#10B981] to-[#00E5FF]',
    buyerInitials: 'KM',
    sellerId: 'student-a',
    sellerName: 'Jaimin & Aarush (Student A)',
    message: 'Hi! Interested in the Class 10 Maths NCERT book. Let me know when you are free at the school gate.',
    timestamp: 'Yesterday',
    createdAt: 1791210000000,
    status: 'Accepted',
  },
  {
    id: 'req-4',
    bookId: 'book-4',
    bookTitle: 'Biology Reference Class 11',
    bookCover: COVER_BIOLOGY_11,
    bookPrice: 280,
    bookCondition: 'Like New',
    buyerId: 'student-a',
    buyerName: 'Jaimin & Aarush (Student A)',
    buyerAvatarGradient: 'from-[#FF2E93] via-[#7B3FE4] to-[#00E5FF]',
    buyerInitials: 'JA',
    sellerId: 'student-d',
    sellerName: 'Ananya Nair (Student D)',
    message: 'Hi Ananya! We would love to get your Biology Reference Class 11 book for our junior batch shelf. Is it still available?',
    timestamp: '3 hours ago',
    createdAt: 1791248000000,
    status: 'Accepted',
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    bookId: 'book-1',
    bookTitle: 'NCERT Physics Class 11',
    bookPrice: 250,
    bookCondition: 'Good',
    bookCover: COVER_PHYSICS_11,
    participantIds: ['student-a', 'student-b'],
    otherStudentId: 'student-b',
    otherStudentName: 'Riya Verma (Student B)',
    otherStudentClass: 'Class 11 • CBSE',
    otherStudentAvatarGradient: 'from-[#00E5FF] to-[#7B3FE4]',
    otherStudentInitials: 'RV',
    otherStudentOnline: true,
    lastMessage: 'Hi! Can we meet near the school library tomorrow to check the Physics book?',
    lastTimestamp: '10:42 AM',
    unreadCount: 1,
  },
  {
    id: 'conv-2',
    bookId: 'book-2',
    bookTitle: 'NCERT Chemistry Class 12',
    bookPrice: 300,
    bookCondition: 'Like New',
    bookCover: COVER_CHEMISTRY_12,
    participantIds: ['student-a', 'student-c'],
    otherStudentId: 'student-c',
    otherStudentName: 'Kabir Mehta (Student C)',
    otherStudentClass: 'Class 10 • ICSE',
    otherStudentAvatarGradient: 'from-[#10B981] to-[#00E5FF]',
    otherStudentInitials: 'KM',
    otherStudentOnline: true,
    lastMessage: 'Great, I will bring ₹300 cash at the school gate after 4 PM!',
    lastTimestamp: '9:15 AM',
    unreadCount: 1,
  },
  {
    id: 'conv-3',
    bookId: 'book-4',
    bookTitle: 'Biology Reference Class 11',
    bookPrice: 280,
    bookCondition: 'Like New',
    bookCover: COVER_BIOLOGY_11,
    participantIds: ['student-a', 'student-d'],
    otherStudentId: 'student-d',
    otherStudentName: 'Ananya Nair (Student D)',
    otherStudentClass: 'Class 12 • CBSE',
    otherStudentAvatarGradient: 'from-[#FFD13B] to-[#FF2E93]',
    otherStudentInitials: 'AN',
    otherStudentOnline: true,
    lastMessage: 'Yes, it is available and in spotless condition! See you in the morning assembly.',
    lastTimestamp: 'Yesterday',
    unreadCount: 0,
  },
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'm-101',
      conversationId: 'conv-1',
      senderId: 'student-b',
      text: 'Hello Jaimin & Aarush! I saw your listing for NCERT Physics Class 11 (₹250).',
      timestamp: '10:38 AM',
      read: true,
    },
    {
      id: 'm-102',
      conversationId: 'conv-1',
      senderId: 'student-a',
      text: 'Hi Riya! Yes, both Part 1 and Part 2 are included and all pages are clean.',
      timestamp: '10:40 AM',
      read: true,
    },
    {
      id: 'm-103',
      conversationId: 'conv-1',
      senderId: 'student-b',
      text: 'Hi! Can we meet near the school library tomorrow to check the Physics book?',
      timestamp: '10:42 AM',
      read: false,
    },
  ],
  'conv-2': [
    {
      id: 'm-201',
      conversationId: 'conv-2',
      senderId: 'student-c',
      text: 'Hi! Is the NCERT Chemistry Class 12 book still available?',
      timestamp: '9:10 AM',
      read: true,
    },
    {
      id: 'm-202',
      conversationId: 'conv-2',
      senderId: 'student-a',
      text: 'Hey Kabir! Yes, it is Like New with a protective plastic cover.',
      timestamp: '9:12 AM',
      read: true,
    },
    {
      id: 'm-203',
      conversationId: 'conv-2',
      senderId: 'student-c',
      text: 'Great, I will bring ₹300 cash at the school gate after 4 PM!',
      timestamp: '9:15 AM',
      read: false,
    },
  ],
  'conv-3': [
    {
      id: 'm-301',
      conversationId: 'conv-3',
      senderId: 'student-a',
      text: 'Hi Ananya! We sent a request for your Biology Reference Class 11 textbook.',
      timestamp: 'Yesterday',
      read: true,
    },
    {
      id: 'm-302',
      conversationId: 'conv-3',
      senderId: 'student-d',
      text: 'Yes, it is available and in spotless condition! See you in the morning assembly.',
      timestamp: 'Yesterday',
      read: true,
    },
  ],
};

export const PRESET_COVERS = [
  { label: 'Physics Class 11', url: COVER_PHYSICS_11, subject: 'Physics' },
  { label: 'Chemistry Class 12', url: COVER_CHEMISTRY_12, subject: 'Chemistry' },
  { label: 'Mathematics Class 10', url: COVER_MATH_10, subject: 'Mathematics' },
  { label: 'Biology Class 11', url: COVER_BIOLOGY_11, subject: 'Biology' },
  { label: 'Chemistry Guide 11', url: SVG_CHEM_GUIDE_11, subject: 'Chemistry' },
  { label: 'Computer Science 12', url: SVG_CS_PYTHON_12, subject: 'Computer Science' },
  { label: 'English Literature 10', url: SVG_ENGLISH_10, subject: 'English' },
];
