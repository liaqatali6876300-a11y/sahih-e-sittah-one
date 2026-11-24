import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { fetchChapterHadiths } from '../services/hadithApi';
import {
  HadithBook,
  HadithChapter,
  HadithItem,
  TextSizePreset,
} from '../types/hadith';
import { toUrduDigits } from '../utils/urdu';
import { HadithCard } from './HadithCard';

interface HadithListViewProps {
  book: HadithBook;
  chapter: HadithChapter;
  chapters: HadithChapter[];
  bookmarkedIds: string[];
  onToggleBookmark: (hadith: HadithItem) => void;
  onSelectChapter: (sectionNumber: number) => void;
  onBackToBook: () => void;
  onBackHome: () => void;
  textSize: TextSizePreset;
  onChangeTextSize: (size: TextSizePreset) => void;
}

const PAGE_SIZE = 25;

export const HadithListView: React.FC<HadithListViewProps> = ({
  book,
  chapter,
  chapters,
  bookmarkedIds,
  onToggleBookmark,
  onSelectChapter,
  onBackToBook,
  onBackHome,
  textSize,
  onChangeTextSize,
}) => {
  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setVisibleCount(PAGE_SIZE);

    fetchChapterHadiths(book.id, chapter.sectionNumber).then((res) => {
      if (!active) return;
      setHadiths(res.items);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [book.id, chapter.sectionNumber]);

  const currentIdx = chapters.findIndex(
    (c) => c.sectionNumber === chapter.sectionNumber
  );
  const prevChapter = currentIdx > 0 ? chapters[currentIdx - 1] : null;
  const nextChapter =
    currentIdx >= 0 && currentIdx < chapters.length - 1
      ? chapters[currentIdx + 1]
      : null;

  const visibleHadiths = hadiths.slice(0, visibleCount);
  const hasMore = visibleCount < hadiths.length;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* راستہ / بریڈکرمب */}
      <nav
        aria-label="صفحے کا راستہ"
        className="urdu-text flex flex-wrap items-center gap-2 text-sm text-stone-500 dark:text-stone-400 mb-6"
      >
        <button
          type="button"
          onClick={onBackHome}
          className="font-semibold text-emerald-800 dark:text-[#D4AF37] hover:underline whitespace-nowrap"
        >
          تمام چھ کتابیں
        </button>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          onClick={onBackToBook}
          className="font-semibold text-emerald-800 dark:text-[#D4AF37] hover:underline whitespace-nowrap"
        >
          {book.urduName}
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-stone-900 dark:text-stone-100 font-semibold truncate">
          {chapter.sectionNumber === 0
            ? 'مقدمہ'
            : `باب نمبر ${toUrduDigits(chapter.sectionNumber)}`}
        </span>
      </nav>

      {/* باب کا عنوان اور ترتیبات */}
      <div className="rounded-xl bg-white dark:bg-[#0D1F18] border border-stone-200 dark:border-emerald-900/60 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="urdu-text text-sm font-semibold text-[#9A6F22] dark:text-[#D4AF37]">
              {book.urduName} ·{' '}
              {chapter.sectionNumber === 0
                ? 'مقدمہ'
                : `باب نمبر ${toUrduDigits(chapter.sectionNumber)}`}
            </p>
            <h1 className="urdu-text mt-2 text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 leading-relaxed">
              {chapter.urduName}
            </h1>
          </div>

          <div className="md:text-left shrink-0">
            <p className="urdu-text text-base font-semibold text-emerald-800 dark:text-emerald-300">
              اس باب میں کل احادیث: {toUrduDigits(loading ? chapter.hadithCount : hadiths.length)}
            </p>
          </div>
        </div>

        {/* فونٹ سائز اور واپسی کا بٹن */}
        <div className="mt-6 pt-5 border-t border-stone-100 dark:border-emerald-900/50 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToBook}
            className="urdu-text inline-flex items-center gap-2 text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-emerald-900 dark:hover:text-[#D4AF37] whitespace-nowrap"
          >
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            ابواب کی فہرست پر واپس جائیں
          </button>

          <div className="flex items-center gap-2">
            <span className="urdu-text text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              خط کا حجم:
            </span>
            <div
              role="group"
              aria-label="خط کا حجم منتخب کریں"
              className="inline-flex items-center p-1 rounded-lg bg-stone-100 dark:bg-[#07130E] border border-stone-200/70 dark:border-emerald-900/60"
            >
              {[
                { id: 'medium', label: 'درمیانہ' },
                { id: 'large', label: 'بڑا' },
                { id: 'xlarge', label: 'بہت بڑا' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChangeTextSize(opt.id as TextSizePreset)}
                  className={`urdu-text px-3 py-1 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    textSize === opt.id
                      ? 'bg-white dark:bg-[#132E24] text-emerald-900 dark:text-[#D4AF37] shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* احادیث کی فہرست */}
      {loading ? (
        <div className="rounded-xl bg-white dark:bg-[#0D1F18] border border-stone-200 dark:border-emerald-900/60 p-12 text-center">
          <Loader2
            className="w-8 h-8 text-emerald-800 dark:text-[#D4AF37] animate-spin mx-auto mb-3"
            aria-hidden="true"
          />
          <p className="urdu-text text-lg font-medium text-stone-700 dark:text-stone-200">
            مستند احادیث لوڈ ہو رہی ہیں، براہِ کرم انتظار فرمائیں...
          </p>
        </div>
      ) : hadiths.length === 0 ? (
        <div className="rounded-xl bg-white dark:bg-[#0D1F18] border border-stone-200 dark:border-emerald-900/60 p-10 text-center">
          <p className="urdu-text text-lg text-stone-700 dark:text-stone-300">
            اس باب میں فی الحال احادیث دستیاب نہیں ہو سکیں۔
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {visibleHadiths.map((hadith) => (
              <HadithCard
                key={hadith.id}
                hadith={hadith}
                book={book}
                isBookmarked={bookmarkedIds.includes(hadith.id)}
                onToggleBookmark={onToggleBookmark}
                textSize={textSize}
              />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="urdu-text px-8 py-3 text-base font-semibold rounded-xl bg-emerald-800 dark:bg-[#D4AF37] text-white dark:text-[#07130E] hover:bg-emerald-900 dark:hover:bg-[#e0be4d] transition-colors shadow-sm"
              >
                مزید احادیث دیکھیں ({toUrduDigits(visibleHadiths.length)} از{' '}
                {toUrduDigits(hadiths.length)})
              </button>
            </div>
          )}
        </>
      )}

      {/* پچھلا اور اگلا باب */}
      <div className="mt-10 pt-6 border-t border-stone-200 dark:border-emerald-900/60 flex items-center justify-between gap-4">
        {prevChapter ? (
          <button
            type="button"
            onClick={() => onSelectChapter(prevChapter.sectionNumber)}
            className="urdu-text inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg border border-stone-200 dark:border-emerald-900/70 bg-white dark:bg-[#0D1F18] text-stone-700 dark:text-stone-200 hover:border-emerald-700 dark:hover:border-[#D4AF37] transition-colors"
          >
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate max-w-[160px] sm:max-w-xs">
              پچھلا باب: {prevChapter.urduName}
            </span>
          </button>
        ) : (
          <div />
        )}

        {nextChapter && (
          <button
            type="button"
            onClick={() => onSelectChapter(nextChapter.sectionNumber)}
            className="urdu-text inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg border border-stone-200 dark:border-emerald-900/70 bg-white dark:bg-[#0D1F18] text-stone-700 dark:text-stone-200 hover:border-emerald-700 dark:hover:border-[#D4AF37] transition-colors"
          >
            <span className="truncate max-w-[160px] sm:max-w-xs">
              اگلا باب: {nextChapter.urduName}
            </span>
            <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
};
