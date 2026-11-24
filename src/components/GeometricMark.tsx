import React from 'react';

export const OctagramEmblem: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect
      x="14"
      y="14"
      width="36"
      height="36"
      rx="2"
      stroke="currentColor"
      strokeWidth="2.2"
    />
    <rect
      x="14"
      y="14"
      width="36"
      height="36"
      rx="2"
      transform="rotate(45 32 32)"
      stroke="#B4832C"
      strokeWidth="2.2"
    />
    <circle cx="32" cy="32" r="7" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="32" cy="32" r="2.2" fill="#B4832C" />
  </svg>
);

export const OrnamentalDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-300 to-[#B4832C]/50 dark:via-emerald-800 dark:to-[#D4AF37]/40" />
    <OctagramEmblem className="w-5 h-5 text-emerald-800 dark:text-emerald-400 shrink-0" />
    <span className="h-px flex-1 bg-gradient-to-l from-transparent via-stone-300 to-[#B4832C]/50 dark:via-emerald-800 dark:to-[#D4AF37]/40" />
  </div>
);
