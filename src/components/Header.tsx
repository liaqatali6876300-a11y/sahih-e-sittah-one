import React from 'react';
import { Bookmark, Moon, Search, Sun, X } from 'lucide-react';
import { toUrduDigits } from '../utils/urdu';
import { OctagramEmblem } from './GeometricMark';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  onNavigateHome: () => void;
  onNavigateBookmarks: () => void;
  bookmarkCount: number;
  isDark: boolean;
  onToggleDark: () => void;
  activeView: string;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onNavigateHome,
  onNavigateBookmarks,
  bookmarkCount,
  isDark,
  onToggleDark,
  activeView,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <header className="bg-white/95 dark:bg-[#07130E]/95 border-b border-stone-200 dark:border-emerald-900/60 backdrop-blur-sm">
      {/* بسم اللہ شریف */}
      <div className="bg-emerald-950/[0.035] dark:bg-emerald-950/60 border-b border-stone-200/80 dark:border-emerald-900/50 py-2.5 px-4">
        <p
          dir="rtl"
          lang="ar"
          className="arabic-text text-center text-2xl sm:text-3xl font-bold text-emerald-900 dark:text-[#D4AF37] leading-relaxed"
        >
          بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>
      </div>

      {/* مرکزی مینو اور تلاش */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 lg:gap-8">
          {/* لوگو اور عنوان */}
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-3 text-right group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-lg py-1 shrink-0"
          >
            <OctagramEmblem className="w-9 h-9 text-emerald-800 dark:text-emerald-400 transition-transform duration-200 group-hover:rotate-45 shrink-0" />
            <span className="urdu-text text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 whitespace-nowrap leading-normal">
              صحاحِ ستہ
            </span>
          </button>

          {/* تلاش بار */}
          <form
            onSubmit={handleSubmit}
            className="order-3 md:order-2 w-full md:flex-1 md:max-w-md"
            role="search"
          >
            <div className="relative flex items-center">
              <Search
                className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute right-3.5 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="حدیث نمبر یا اردو / عربی لفظ تلاش کریں..."
                aria-label="حدیث نمبر یا لفظ تلاش کریں"
                className="urdu-text w-full h-11 pr-10 pl-9 text-sm sm:text-base bg-stone-50 dark:bg-[#0D1F18] border border-stone-200 dark:border-emerald-900/70 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-emerald-700 dark:focus:border-[#D4AF37] focus:ring-1 focus:ring-emerald-700 dark:focus:ring-[#D4AF37] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="تلاش صاف کریں"
                  className="absolute left-2.5 p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* روابط، انسٹال اور رات کا موڈ */}
          <div className="order-2 md:order-3 flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
            <nav className="flex items-center gap-4 sm:gap-5 text-base font-medium">
              <button
                type="button"
                onClick={onNavigateHome}
                className={`urdu-text whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 leading-relaxed ${
                  activeView === 'home' || activeView === 'chapters' || activeView === 'hadiths'
                    ? 'border-emerald-800 dark:border-[#D4AF37] text-emerald-900 dark:text-[#D4AF37]'
                    : 'border-transparent text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                تمام کتب
              </button>
              <button
                type="button"
                onClick={onNavigateBookmarks}
                className={`urdu-text inline-flex items-center gap-2 whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 leading-relaxed ${
                  activeView === 'bookmarks'
                    ? 'border-emerald-800 dark:border-[#D4AF37] text-emerald-900 dark:text-[#D4AF37]'
                    : 'border-transparent text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Bookmark className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>محفوظ</span>
                <span className="text-sm text-stone-500 dark:text-stone-400">
                  ({toUrduDigits(bookmarkCount)})
                </span>
              </button>
            </nav>

            <PWAInstallButton />

            <button
              type="button"
              onClick={onToggleDark}
              aria-label={isDark ? 'دن کا موڈ فعال کریں' : 'رات کا موڈ فعال کریں'}
              title={isDark ? 'دن کا موڈ' : 'رات کا موڈ'}
              className="inline-flex items-center gap-2 px-3 h-10 rounded-lg border border-stone-200 dark:border-emerald-900/70 bg-stone-50 dark:bg-[#0D1F18] text-stone-700 dark:text-[#D4AF37] hover:border-emerald-700 dark:hover:border-[#D4AF37] transition-colors shrink-0 text-sm whitespace-nowrap"
            >
              {isDark ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
              <span className="hidden sm:inline urdu-text leading-none">
                {isDark ? 'دن کا موڈ' : 'رات کا موڈ'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
