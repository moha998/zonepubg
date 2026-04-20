@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  
  --color-primary: #D4AF37; /* Primary Gold */
  --color-primary-hover: #B8962E;
  
  /* Premium Gaming Dark Mode - Refined */
  --color-bg-dark: #0B0E11; 
  --color-bg-card: #15191C;
  --color-bg-secondary: #0B0E11;
  --color-text-main: #FFFFFF; 
  --color-text-muted: #A0AEC0; 
  --color-border-subtle: rgba(212, 175, 55, 0.1);
  --color-nav-bg: rgba(11, 14, 17, 0.9);
  
  /* Luxury Gold Gradient Palette */
  --gold-gradient: linear-gradient(135deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
  --gold-gradient-hover: linear-gradient(135deg, #AA771C, #FBF5B7, #B38728, #FCF6BA, #BF953F);

  --animate-marquee: marquee 90s linear infinite;
  --animate-pulse-gold: pulse-gold 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animate-pulse-slow: pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animate-shimmer: shimmer 6s linear infinite;

  @keyframes pulse-slow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-100%); }
  }

  @keyframes pulse-gold {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.3; }
  }

  @keyframes shimmer {
    to { background-position: 200% center; }
  }
}

.light {
  --color-bg-dark: #F8FAFC; 
  --color-bg-card: #FFFFFF;
  --color-bg-secondary: #F1F5F9;
  --color-text-main: #0F172A; 
  --color-text-muted: #64748B; 
  --color-border-subtle: rgba(0, 0, 0, 0.05);
  --color-nav-bg: rgba(248, 250, 252, 0.8);
}

@layer base {
  body {
    @apply bg-bg-dark text-text-main antialiased transition-colors duration-300 min-h-screen relative overflow-x-hidden;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.02) 0%, transparent 45%),
      radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.02) 0%, transparent 45%),
      linear-gradient(180deg, #0B0E11 0%, #050608 100%);
    background-attachment: fixed;
  }

  body.is-home {
    background-image: none;
    background-color: #0B0E11;
  }

  body::before {
    content: "";
    @apply fixed inset-0 pointer-events-none opacity-[0.02] z-[-2];
    /* Custom SVG pattern with PUBG-like icons in faint gray */
    background-image: url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='10' y='30' font-family='sans-serif' font-size='14' fill='%23888888'%3E🪖%3C/text%3E%3Ctext x='60' y='60' font-family='sans-serif' font-size='14' fill='%23888888'%3E🔫%3C/text%3E%3Ctext x='30' y='90' font-family='sans-serif' font-size='14' fill='%23888888'%3E✈️%3C/text%3E%3C/svg%3E");
    background-size: 180px 180px;
    background-attachment: fixed;
  }

  header {
    @apply sticky top-0 z-50 backdrop-blur-2xl border-b border-white/10 px-6 py-4;
    background: rgba(2, 3, 4, 0.75);
  }
}

@layer utilities {
  .bg-gold-gradient {
    background: linear-gradient(135deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    background-size: 200% 200%;
    @apply transition-all duration-500;
  }

  .bg-gold-gradient:hover {
    background-position: 100% 100%;
  }

  .pro-card {
    @apply border border-white/10 rounded-2xl transition-all duration-500 shadow-2xl backdrop-blur-xl;
    box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.8);
    background-color: rgba(21, 25, 28, 0.6); /* Using new card dark with transparency */
  }

  .pro-card:hover {
    @apply border-primary/30;
    box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 20px -5px rgba(212, 175, 55, 0.15);
  }
  
  .premium-glow {
    @apply relative overflow-hidden;
  }

  .premium-glow::after {
    content: "";
    @apply absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent -rotate-45 transition-all duration-1000 pointer-events-none;
    transform: translateX(-100%);
  }

  .premium-glow:hover::after {
    transform: translateX(100%);
  }

  .gold-shimmer {
    background: var(--gold-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    background-size: 200% auto;
    animation: shimmer 3s linear infinite;
  }
  
  .btn-gold {
    background: var(--gold-gradient);
    background-size: 200% auto;
    @apply text-black font-black transition-all duration-500 shadow-lg shadow-primary/10 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2;
  }
  
  .btn-gold:hover {
    background-position: right center;
  }

  .text-gradient {
    background: var(--gold-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .markdown-body {
    @apply space-y-4 text-text-muted text-sm md:text-base;
  }
  .markdown-body p {
    @apply leading-relaxed;
  }
  .markdown-body ul, .markdown-body ol {
    @apply pr-8 space-y-2 list-outside text-right;
  }
  .markdown-body ul {
    @apply list-disc;
  }
  .markdown-body ol {
    @apply list-decimal;
  }
  .markdown-body li {
    @apply pl-2 transition-colors hover:text-white;
  }
  .markdown-body li::marker {
    @apply text-primary font-bold;
  }
  .markdown-body strong {
    @apply text-primary font-bold;
  }
  .markdown-body code {
    @apply bg-white/10 px-2 py-0.5 rounded text-xs font-mono text-primary border border-white/5;
  }
  
  /* Responsive Tables with Professional Look */
  .markdown-body table {
    @apply w-full border-collapse my-6 text-xs md:text-sm overflow-hidden rounded-2xl border border-white/5 bg-black/20;
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(242, 169, 0, 0.2) transparent;
  }
  
  .markdown-body thead {
    @apply bg-white/5 text-primary font-bold border-b border-white/10;
  }
  
  .markdown-body th {
    @apply p-4 text-right font-bold uppercase tracking-wider whitespace-nowrap;
  }
  
  .markdown-body td {
    @apply p-4 border-b border-white/5 text-right min-w-[140px] align-middle;
  }
  
  .markdown-body tr:last-child td {
    @apply border-b-0;
  }
  
  .markdown-body tr:nth-child(even) {
    @apply bg-white/[0.03];
  }
  
  .markdown-body tr:hover {
    @apply bg-primary/5 transition-all duration-200;
  }

  /* Professional Scrollbar for tables */
  .markdown-body table::-webkit-scrollbar {
    @apply h-2;
  }
  .markdown-body table::-webkit-scrollbar-track {
    @apply bg-black/40 rounded-full;
  }
  .markdown-body table::-webkit-scrollbar-thumb {
    @apply bg-white/10 rounded-full border-2 border-transparent bg-clip-padding hover:bg-primary/40 transition-colors;
  }

  /* Table Scroll Indicator Hint */
  .markdown-body table {
    background-image: linear-gradient(to right, rgba(11, 14, 17, 0.8), rgba(11, 14, 17, 0)),
                      linear-gradient(to right, rgba(11, 14, 17, 0), rgba(11, 14, 17, 0.8)),
                      linear-gradient(to right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05));
    background-position: left center, right center, center center;
    background-repeat: no-repeat;
    background-size: 20px 100%, 20px 100%, 100% 100%;
    background-attachment: scroll, scroll, local;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
