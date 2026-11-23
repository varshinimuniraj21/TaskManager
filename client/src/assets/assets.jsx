// High-resolution curated editorial imagery and SVG illustrations matching the blueprint

export const IMAGES = {
  // Vintage desk with typewriter, books, warm scholarly study room
  heroBanner: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1600&q=80',
  
  // Fountain pen resting on cursive manuscript
  fountainPenQuote: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
  
  // High quality book covers matching the blueprint gallery
  bookSilentHours: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
  bookEchoes: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  bookVintageJournal: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
  bookSciFi: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
  bookNoir: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
  
  // Note & idea board images
  typewriterClose: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
  quillWriting: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
  manuscriptDesk: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80'
};

export const QuillIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M54.5 7.5C54.5 7.5 49 14.5 39 19C29 23.5 22 28.5 17 38.5C12 48.5 11 56.5 11 56.5C11 56.5 16 52 23 48.5C30 45 36 44 43 40C50 36 56 28 56 28L47 29C47 29 49 22 53 16C55.5 12 54.5 7.5 54.5 7.5Z" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 56.5C11 56.5 17.5 51 29 45C40.5 39 49 27 52 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M11 56.5L8 58.5C6.5 59.5 5 57.5 6 56L8.5 52.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M7 61C13 58 20 59 25 58" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 3" />
  </svg>
);

export const InkSplatter = ({ className = "w-12 h-12", color = "#262422" }) => (
  <svg viewBox="0 0 100 100" fill={color} xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="14" />
    <circle cx="68" cy="38" r="6" />
    <circle cx="34" cy="62" r="5" />
    <circle cx="32" cy="36" r="4.5" />
    <circle cx="66" cy="64" r="5.5" />
    <circle cx="78" cy="52" r="3" />
    <circle cx="48" cy="74" r="3.5" />
    <circle cx="20" cy="48" r="2.5" />
    <circle cx="54" cy="24" r="3" />
    <circle cx="82" cy="30" r="2" />
    <circle cx="16" cy="60" r="1.5" />
    <circle cx="40" cy="84" r="2" />
    <path d="M50 36 C55 42, 60 45, 68 38 C62 48, 62 55, 66 64 C56 58, 44 60, 34 62 C40 54, 42 46, 32 36 C42 42, 45 40, 50 36 Z" opacity="0.9" />
  </svg>
);
