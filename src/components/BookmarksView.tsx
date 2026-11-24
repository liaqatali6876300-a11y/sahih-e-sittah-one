import React from 'react';
import { ArrowRight, Bookmark, Trash2 } from 'lucide-react';
import { ALL_CHAPTERS } from '../data/sihahSittaCatalog';
import { BookId, HadithBook, HadithItem, TextSizePreset } from '../types/hadith';
import { toUrduDigits } from '../utils/urdu';
import { HadithCard } from './HadithCard';

interface BookmarksViewProps {
  books: HadithBook[];
  savedHadiths: HadithItem[];
  onToggleBookmark: (hadith: HadithItem) => void;
  onClearAllBookmarks: () => void;
  onOpenChapter: (bookId: BookId, sectionNumber: number) => void;
  onBackHome: () => void;
  textSize: TextSizePreset;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  books,
  savedHadiths,
  onToggleBookmark,
  onClearAllBookmarks,
  onOpenChapter,
  onBackHome,
  textSize,
}) => {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <button
            type="button"
            onClick={onBackHome}
            className="urdu-text inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 dark:text-[#D4AF37] hover:underline mb-4"
          >
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            تمام کتب پر واپس جائیں
          </button>
          <h1 className="urdu-text text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
            محفوظ شدہ احادیث
          </h1>
          <p className="urdu-text mt-2 text-base text-stone-600 dark:text-stone-300">
            آپ کے پاس کل {toUrduDigits(savedHadiths.length)} احادیث محفوظ ہیں
          </p>
        </div>

        {savedHadiths.length > 0 && (
          <button
            type="button"
            onClick={onClearAllBookmarks}
            className="urdu-text inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-stone-200 dark:border-emerald-900/70 bg-white dark:bg-[#0D1F18] text-stone-700 dark:text-stone-300 hover:border-red-300 hover:text-red-700 dark:hover:border-red-800 dark:hover:text-red-400 transition-colors whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            تمام محفوظ احادیث حذف کریں
          </button>
        )}
      </div>

      {savedHadiths.length === 0 ? (
        <div className="rounded-xl bg-white dark:bg-[#0D1F18] border border-stone-200 dark:border-emerald-900/60 p-12 text-center">
          <Bookmark
            className="w-10 h-10 text-stone-400 dark:text-stone-500 mx-auto mb-3"
            aria-hidden="true"
          />
          <h2 className="urdu-text text-2xl font-bold text-stone-900 dark:text-stone-100">
            ابھی کوئی حدیث محفوظ نہیں کی گئی
          </h2>
          <p className="urdu-text mt-2 text-base text-stone-600 dark:text-stone-300 max-w-md mx-auto">
            کسی بھی حدیث کے نیچے موجود «محفوظ کریں» کے بٹن پر کلک کریں تاکہ وہ یہاں آسانی سے دستیاب رہے۔
          </p>
          <button
            type="button"
            onClick={onBackHome}
            className="urdu-text mt-6 px-6 py-2.5 text-sm font-semibold rounded-lg bg-emerald-800 dark:bg-[#D4AF37] text-white dark:text-[#07130E] hover:bg-emerald-900 dark:hover:bg-[#e0be4d] transition-colors"
          >
            صحاحِ ستہ کا مطالعہ کریں
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {savedHadiths.map((hadith) => {
            const book = books.find((b) => b.id === hadith.bookId);
            if (!book) return null;
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
                isBookmarked={true}
                onToggleBookmark={onToggleBookmark}
                onOpenChapter={onOpenChapter}
                textSize={textSize}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};
