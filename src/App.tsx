import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Download, Loader2 } from 'lucide-react';
import { BookCard } from './components/BookCard';
import { BookmarksView } from './components/BookmarksView';
import { ChaptersView } from './components/ChaptersView';
import { Footer } from './components/Footer';
import { OrnamentalDivider } from './components/GeometricMark';
import { HadithCard } from './components/HadithCard';
import { HadithListView } from './components/HadithListView';
import { Header } from './components/Header';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SearchResultsView } from './components/SearchResultsView';
import { FALLBACK_HADITHS } from './data/fallbackHadiths';
import { ALL_CHAPTERS, HADITH_BOOKS } from './data/sihahSittaCatalog';
import { downloadBookOffline } from './services/hadithApi';
import { getOfflineBookIds } from './services/offlineStore';
import { AppRoute, BookId, HadithItem, TextSizePreset } from './types/hadith';
import { toUrduDigits } from './utils/urdu';

const SAVED_HADITHS_KEY = 'sihah-sitta-saved-hadiths';
const THEME_KEY = 'sihah-sitta-theme';
const TEXT_SIZE_KEY = 'sihah-sitta-text-size';

function getInitialDarkMode(): boolean {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

function getInitialSavedHadiths(): HadithItem[] {
  try {
    const raw = localStorage.getItem(SAVED_HADITHS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is HadithItem =>
        Boolean(item && typeof item.id === 'string' && typeof item.arabic === 'string')
    );
  } catch {
    return [];
  }
}

function getInitialTextSize(): TextSizePreset {
  try {
    const val = localStorage.getItem(TEXT_SIZE_KEY);
    if (val === 'medium' || val === 'large' || val === 'xlarge') return val;
    return 'large';
  } catch {
    return 'large';
  }
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>({ view: 'home' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState<boolean>(getInitialDarkMode);
  const [savedHadiths, setSavedHadiths] = useState<HadithItem[]>(getInitialSavedHadiths);
  const [textSize, setTextSize] = useState<TextSizePreset>(getInitialTextSize);
  const [offlineBookIds, setOfflineBookIds] = useState<string[]>([]);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    getOfflineBookIds().then(setOfflineBookIds);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    } catch {
      // نظر انداز کریں
    }
  }, [isDark]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_HADITHS_KEY, JSON.stringify(savedHadiths));
    } catch {
      // نظر انداز کریں
    }
  }, [savedHadiths]);

  useEffect(() => {
    try {
      localStorage.setItem(TEXT_SIZE_KEY, textSize);
    } catch {
      // نظر انداز کریں
    }
  }, [textSize]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateHome = () => {
    setRoute({ view: 'home' });
    scrollToTop();
  };

  const navigateBook = (bookId: BookId) => {
    setRoute({ view: 'chapters', bookId });
    scrollToTop();
  };

  const navigateChapter = (bookId: BookId, sectionNumber: number) => {
    setRoute({ view: 'hadiths', bookId, sectionNumber });
    scrollToTop();
  };

  const navigateBookmarks = () => {
    setRoute({ view: 'bookmarks' });
    scrollToTop();
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q.trim().length > 0) {
      setRoute({ view: 'search', query: q });
    } else if (route.view === 'search') {
      setRoute({ view: 'home' });
    }
  };

  const handleSearchSubmit = () => {
    setRoute({ view: 'search', query: searchQuery });
    scrollToTop();
  };

  const handleQuickSearch = (q: string) => {
    setSearchQuery(q);
    setRoute({ view: 'search', query: q });
    scrollToTop();
  };

  const toggleBookmark = (hadith: HadithItem) => {
    setSavedHadiths((prev) => {
      const exists = prev.some((item) => item.id === hadith.id);
      if (exists) {
        return prev.filter((item) => item.id !== hadith.id);
      }
      return [hadith, ...prev];
    });
  };

  const clearAllBookmarks = () => {
    setSavedHadiths([]);
  };

  const handleBookDownloaded = (bookId: BookId) => {
    setOfflineBookIds((prev) => (prev.includes(bookId) ? prev : [...prev, bookId]));
  };

  const handleDownloadAllOffline = async () => {
    if (downloadingAll) return;
    setDownloadingAll(true);
    let count = 0;
    for (const book of HADITH_BOOKS) {
      if (!offlineBookIds.includes(book.id)) {
        const ok = await downloadBookOffline(book.id);
        if (ok) {
          handleBookDownloaded(book.id);
        }
      }
      count += 1;
      setDownloadProgress(count);
    }
    setDownloadingAll(false);
  };

  const allBooksOffline = offlineBookIds.length >= HADITH_BOOKS.length;

  const bookmarkedIds = useMemo(
    () => savedHadiths.map((item) => item.id),
    [savedHadiths]
  );

  const featuredHadith = FALLBACK_HADITHS[0];
  const featuredBook = HADITH_BOOKS.find((b) => b.id === featuredHadith.bookId)!;
  const featuredChapter = ALL_CHAPTERS[featuredHadith.bookId].find(
    (c) => c.sectionNumber === featuredHadith.sectionNumber
  )!;

  return (
    <div
      dir="rtl"
      lang="ur"
      className="min-h-screen flex flex-col bg-white dark:bg-[#07130E] text-stone-900 dark:text-stone-100 transition-colors duration-200"
    >
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onNavigateHome={navigateHome}
        onNavigateBookmarks={navigateBookmarks}
        bookmarkCount={savedHadiths.length}
        isDark={isDark}
        onToggleDark={() => setIsDark((d) => !d)}
        activeView={route.view}
      />

      <main className="flex-1">
        {route.view === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            {/* مرکزی تعارف */}
            <div className="max-w-3xl mx-auto text-center">
              <p className="urdu-text text-sm sm:text-base font-semibold text-[#9A6F22] dark:text-[#D4AF37]">
                احادیثِ نبوی ﷺ کی چھ مستند ترین کتابیں
              </p>
              <h1 className="urdu-text mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-stone-100 leading-relaxed [text-wrap:balance]">
                صحاحِ ستہ
              </h1>
              <p className="urdu-text mt-4 text-lg sm:text-xl text-stone-600 dark:text-stone-300 leading-loose [text-wrap:balance]">
                صحیح بخاری، صحیح مسلم، سنن ابوداؤد، جامع ترمذی، سنن نسائی اور سنن ابن ماجہ کی تمام احادیثِ مبارکہ مستند عربی متن اور خوبصورت اردو ترجمے کے ساتھ۔
              </p>
              <p className="urdu-text mt-4 text-sm sm:text-base font-medium text-stone-500 dark:text-stone-400">
                ۶ مستند کتابیں · ۳۴,۳۹۵ احادیث · عربی متن و اردو ترجمہ
              </p>
            </div>

            <OrnamentalDivider className="my-10 max-w-2xl mx-auto" />

            {/* چھ کتابوں کے بڑے کارڈز */}
            <section aria-labelledby="books-heading">
              <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
                <h2
                  id="books-heading"
                  className="urdu-text text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100"
                >
                  کتبِ صحاحِ ستہ
                </h2>
                <span className="urdu-text text-sm font-medium text-stone-500 dark:text-stone-400">
                  ابواب اور احادیث دیکھنے کے لیے کسی بھی کتاب پر کلک کریں
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {HADITH_BOOKS.map((book) => {
                  const chapters = ALL_CHAPTERS[book.id] || [];
                  return (
                    <BookCard
                      key={book.id}
                      book={book}
                      chapterCount={chapters.length}
                      onSelect={navigateBook}
                    />
                  );
                })}
              </div>

              {/* مکمل ایپ آف لائن محفوظ کرنے کی پٹی */}
              <div className="mt-8 rounded-xl bg-stone-50 dark:bg-[#0D1F18] border border-stone-200 dark:border-emerald-900/60 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="urdu-text text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                    انٹرنیٹ کے بغیر مطالعہ (آف لائن سہولت)
                  </p>
                  <p className="urdu-text text-sm text-stone-600 dark:text-stone-300">
                    {allBooksOffline
                      ? 'تمام چھ کتابیں آپ کے فون یا کمپیوٹر میں آف لائن محفوظ ہو چکی ہیں۔'
                      : `ابھی ${toUrduDigits(offlineBookIds.length)} از ۶ کتابیں آف لائن محفوظ ہیں۔ مکمل مجموعہ محفوظ کرنے کے لیے بٹن دبائیں۔`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadAllOffline}
                  disabled={downloadingAll || allBooksOffline}
                  className={`urdu-text inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    allBooksOffline
                      ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-emerald-800 dark:bg-[#D4AF37] text-white dark:text-[#07130E] hover:bg-emerald-900 dark:hover:bg-[#e0be4d]'
                  }`}
                >
                  {downloadingAll ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                      <span>
                        محفوظ ہو رہی ہیں ({toUrduDigits(downloadProgress)} از ۶)...
                      </span>
                    </>
                  ) : allBooksOffline ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>مکمل صحاحِ ستہ آف لائن محفوظ ہے</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>تمام ۶ کتابیں آف لائن محفوظ کریں</span>
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* منتخب حدیثِ افتتاح */}
            <section aria-labelledby="featured-hadith-heading" className="mt-14">
              <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
                <div>
                  <h2
                    id="featured-hadith-heading"
                    className="urdu-text text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100"
                  >
                    حدیثِ افتتاح
                  </h2>
                  <p className="urdu-text mt-1 text-base text-stone-500 dark:text-stone-400">
                    صحیح بخاری کی پہلی حدیثِ مبارکہ — اعمال کا دارومدار نیت پر ہے
                  </p>
                </div>
              </div>

              <HadithCard
                hadith={featuredHadith}
                book={featuredBook}
                chapterNameUrdu={featuredChapter.urduName}
                isBookmarked={bookmarkedIds.includes(featuredHadith.id)}
                onToggleBookmark={toggleBookmark}
                onOpenChapter={navigateChapter}
                textSize={textSize}
              />
            </section>
          </div>
        )}

        {route.view === 'chapters' && (() => {
          const book = HADITH_BOOKS.find((b) => b.id === route.bookId);
          if (!book) return null;
          const chapters = ALL_CHAPTERS[book.id] || [];
          return (
            <ChaptersView
              book={book}
              chapters={chapters}
              onSelectChapter={(sectionNumber) =>
                navigateChapter(book.id, sectionNumber)
              }
              onBackHome={navigateHome}
              isBookOffline={offlineBookIds.includes(book.id)}
              onBookDownloaded={handleBookDownloaded}
            />
          );
        })()}

        {route.view === 'hadiths' && (() => {
          const book = HADITH_BOOKS.find((b) => b.id === route.bookId);
          const chapters = ALL_CHAPTERS[route.bookId] || [];
          const chapter = chapters.find(
            (c) => c.sectionNumber === route.sectionNumber
          );
          if (!book || !chapter) return null;
          return (
            <HadithListView
              book={book}
              chapter={chapter}
              chapters={chapters}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={toggleBookmark}
              onSelectChapter={(secNum) => navigateChapter(book.id, secNum)}
              onBackToBook={() => navigateBook(book.id)}
              onBackHome={navigateHome}
              textSize={textSize}
              onChangeTextSize={setTextSize}
            />
          );
        })()}

        {route.view === 'search' && (
          <SearchResultsView
            query={route.query}
            books={HADITH_BOOKS}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={toggleBookmark}
            onOpenChapter={navigateChapter}
            onQuickSearch={handleQuickSearch}
            onBackHome={navigateHome}
            textSize={textSize}
          />
        )}

        {route.view === 'bookmarks' && (
          <BookmarksView
            books={HADITH_BOOKS}
            savedHadiths={savedHadiths}
            onToggleBookmark={toggleBookmark}
            onClearAllBookmarks={clearAllBookmarks}
            onOpenChapter={navigateChapter}
            onBackHome={navigateHome}
            textSize={textSize}
          />
        )}
      </main>

      <Footer
        books={HADITH_BOOKS}
        onSelectBook={navigateBook}
        onNavigateHome={navigateHome}
      />

      <OfflineIndicator />
    </div>
  );
}
