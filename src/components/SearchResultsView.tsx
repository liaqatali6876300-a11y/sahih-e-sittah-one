import React, { useEffect, useState } from 'react';
import { ArrowRight, Loader2, SearchX } from 'lucide-react';
import { ALL_CHAPTERS } from '../data/sihahSittaCatalog';
import { searchHadithsAcrossBooks } from '../services/hadithApi';
import { BookId, HadithBook, HadithItem, TextSizePreset } from '../types/hadith';
import { toUrduDigits } from '../utils/urdu';
import { HadithCard } from './HadithCard';

interface SearchResultsViewProps {
  query: string;
  books: HadithBook[];
  bookmarkedIds: string[];
  onToggleBookmark: (hadith: HadithItem) => void;
  onOpenChapter: (bookId: BookId, sectionNumber: number) => void;
  onQuickSearch: (q: string) => void;
  onBackHome: () => void;
  textSize: TextSizePreset;
}

const SUGGESTED_QUERIES = ['۱', 'نماز', 'روزہ', 'نیت', 'علم', 'صدقہ', 'حج'];
const PAGE_SIZE = 20;

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  query,
  books,
  bookmarkedIds,
  onToggleBookmark,
  onOpenChapter,
  onQuickSearch,
  onBackHome,
  textSize,
}) => {
  const [selectedBook, setSelectedBook] = useState<'all' | BookId>('all');
  const [results, setResults] = useState<HadithItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setVisibleCount(PAGE_SIZE);

    const timer = window.setTimeout(() => {
      searchHadithsAcrossBooks(trimmed, selectedBook).then((items) => {
        if (cancelled) return;
        setResults(items);
        setLoading(false);
      });
    }, 280);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, selectedBook]);

  const visibleResults = results.slice(0, visibleCount);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <button
          type="button"
          onClick={onBackHome}
          className="urdu-text inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 dark:text-[#D4AF37] hover:underline mb-4"
        >
          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          تمام کتب پر واپس جائیں
        </button>

        <h1 className="urdu-text text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          تلاش کے نتائج
        </h1>
        <p className="urdu-text mt-2 text-base text-stone-600 dark:text-stone-300">
          {!query.trim()
            ? 'تلاش بار میں کوئی حدیث نمبر یا اردو / عربی لفظ تحریر کریں۔'
            : loading
              ? `“${query.trim()}” کے لیے کتبِ احادیث میں تلاش جاری ہے...`
              : `“${query.trim()}” کے لیے ${toUrduDigits(results.length)} احادیث ملیں`}
        </p>
      </div>

      {/* کتاب کے لحاظ سے فلٹر */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-stone-100 dark:bg-[#0D1F18] border border-stone-200/80 dark:border-emerald-900/60 mb-8">
        <button
          type="button"
          onClick={() => setSelectedBook('all')}
          className={`urdu-text px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            selectedBook === 'all'
              ? 'bg-white dark:bg-[#132E24] text-emerald-900 dark:text-[#D4AF37] shadow-sm'
              : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          تمام کتب
        </button>
        {books.map((book) => (
          <button
            key={book.id}
            type="button"
            onClick={() => setSelectedBook(book.id)}
            className={`urdu-text px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedBook === book.id
                ? 'bg-white dark:bg-[#132E24] text-emerald-900 dark:text-[#D4AF37] shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            {book.urduName}
          </button>
        ))}
      </div>

      {/* نتائج */}
      {loading ? (
        <div className="rounded-xl bg-white dark:bg-[#0D1F18] border border-stone-200 dark:border-emerald-900/60 p-12 text-center">
          <Loader2
            className="w-8 h-8 text-emerald-800 dark:text-[#D4AF37] animate-spin mx-auto mb-3"
            aria-hidden="true"
          />
          <p className="urdu-text text-lg font-medium text-stone-700 dark:text-stone-200">
            صحاحِ ستہ میں تلاش جاری ہے، براہِ کرم انتظار فرمائیں...
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-xl bg-white dark:bg-[#0D1F18] border border-stone-200 dark:border-emerald-900/60 p-10 text-center">
          <SearchX
            className="w-10 h-10 text-stone-400 dark:text-stone-500 mx-auto mb-3"
            aria-hidden="true"
          />
          <h2 className="urdu-text text-2xl font-bold text-stone-900 dark:text-stone-100">
            کوئی حدیث نہیں ملی
          </h2>
          <p className="urdu-text mt-2 text-base text-stone-600 dark:text-stone-300 max-w-md mx-auto">
            حدیث نمبر (مثلاً ۱، ۲۲۳، ۴۹۵، ۱۷۲۱) یا کوئی اردو / عربی لفظ لکھ کر تلاش کریں۔
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {SUGGESTED_QUERIES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onQuickSearch(term)}
                className="urdu-text px-4 py-1.5 text-sm font-semibold rounded-lg border border-stone-200 dark:border-emerald-900/70 bg-stone-50 dark:bg-[#07130E] text-emerald-800 dark:text-[#D4AF37] hover:border-emerald-700 dark:hover:border-[#D4AF37] transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {visibleResults.map((hadith) => {
              const book = books.find((b) => b.id === hadith.bookId)!;
              const chapterObj = ALL_CHAPTERS[hadith.bookId]?.find(
                (c) => c.sectionNumber === hadith.sectionNumber
              );
              const chapterNameUrdu =
                chapterObj?.urduName ||
                `باب نمبر ${toUrduDigits(hadith.sectionNumber)}`;

              return (
                <HadithCard
                  key={hadith.id}
                  hadith={hadith}
                  book={book}
                  chapterNameUrdu={chapterNameUrdu}
                  isBookmarked={bookmarkedIds.includes(hadith.id)}
                  onToggleBookmark={onToggleBookmark}
                  onOpenChapter={onOpenChapter}
                  textSize={textSize}
                />
              );
            })}
          </div>

          {visibleCount < results.length && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="urdu-text px-8 py-3 text-base font-semibold rounded-xl bg-emerald-800 dark:bg-[#D4AF37] text-white dark:text-[#07130E] hover:bg-emerald-900 dark:hover:bg-[#e0be4d] transition-colors shadow-sm"
              >
                مزید نتائج دیکھیں ({toUrduDigits(visibleResults.length)} از{' '}
                {toUrduDigits(results.length)})
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};
