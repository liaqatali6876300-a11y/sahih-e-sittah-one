import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  Loader2,
  Search,
} from 'lucide-react';
import { downloadBookOffline } from '../services/hadithApi';
import { BookId, HadithBook, HadithChapter } from '../types/hadith';
import { toUrduDigits } from '../utils/urdu';

interface ChaptersViewProps {
  book: HadithBook;
  chapters: HadithChapter[];
  onSelectChapter: (sectionNumber: number) => void;
  onBackHome: () => void;
  isBookOffline: boolean;
  onBookDownloaded: (bookId: BookId) => void;
}

export const ChaptersView: React.FC<ChaptersViewProps> = ({
  book,
  chapters,
  onSelectChapter,
  onBackHome,
  isBookOffline,
  onBookDownloaded,
}) => {
  const [chapterFilter, setChapterFilter] = useState('');
  const [downloading, setDownloading] = useState(false);

  const filteredChapters = useMemo(() => {
    const q = chapterFilter.trim();
    if (!q) return chapters;
    return chapters.filter(
      (ch) =>
        ch.urduName.includes(q) ||
        toUrduDigits(ch.sectionNumber).includes(q) ||
        String(ch.sectionNumber).includes(q)
    );
  }, [chapters, chapterFilter]);

  const handleSaveBookOffline = async () => {
    if (downloading || isBookOffline) return;
    setDownloading(true);
    const ok = await downloadBookOffline(book.id);
    setDownloading(false);
    if (ok) {
      onBookDownloaded(book.id);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* راستہ */}
      <nav
        aria-label="صفحے کا راستہ"
        className="urdu-text flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 mb-5"
      >
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 dark:text-[#D4AF37] hover:underline whitespace-nowrap"
        >
          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          تمام چھ کتابیں
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-stone-900 dark:text-stone-100 font-semibold truncate">
          {book.urduName}
        </span>
      </nav>

      {/* کتاب کا تعارفی کارڈ */}
      <div className="rounded-xl bg-white dark:bg-[#0D1F18] border border-stone-200 dark:border-emerald-900/60 p-6 sm:p-8 shadow-sm mb-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-2xl">
            <p className="urdu-text text-sm font-semibold text-[#9A6F22] dark:text-[#D4AF37]">
              کتاب نمبر {book.orderUrdu} · مصنف: {book.compilerUrdu} · {book.deathYearUrdu}
            </p>
            <h1 className="urdu-text mt-1.5 text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 leading-relaxed">
              {book.urduName}
            </h1>
            <p className="urdu-text mt-2 text-base text-stone-600 dark:text-stone-300 leading-loose">
              {book.descriptionUrdu}
            </p>
          </div>

          <div className="flex flex-col lg:items-end gap-3 shrink-0">
            <p className="urdu-text text-base font-semibold text-[#9A6F22] dark:text-[#D4AF37]">
              {book.totalHadithUrdu} · {toUrduDigits(chapters.length)} ابواب
            </p>

            <button
              type="button"
              onClick={handleSaveBookOffline}
              disabled={downloading || isBookOffline}
              className={`urdu-text inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                isBookOffline
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-stone-50 dark:bg-[#07130E] border-stone-200 dark:border-emerald-900/70 text-stone-800 dark:text-[#D4AF37] hover:border-emerald-700 dark:hover:border-[#D4AF37]'
              }`}
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                  <span>آف لائن محفوظ ہو رہی ہے...</span>
                </>
              ) : isBookOffline ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>آف لائن مطالعہ کے لیے محفوظ ہے</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>مکمل کتاب آف لائن محفوظ کریں</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ابواب تلاش کرنے کی پٹی */}
        <div className="mt-6 pt-5 border-t border-stone-100 dark:border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="urdu-text text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
            ابواب کی فہرست ({toUrduDigits(filteredChapters.length)})
          </h2>

          <div className="relative w-full sm:w-80">
            <Search
              className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={chapterFilter}
              onChange={(e) => setChapterFilter(e.target.value)}
              placeholder="باب کا نام یا نمبر تلاش کریں..."
              aria-label="باب تلاش کریں"
              className="urdu-text w-full h-10 pr-10 pl-3 text-sm bg-stone-50 dark:bg-[#07130E] border border-stone-200 dark:border-emerald-900/70 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-emerald-700 dark:focus:border-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      {/* ابواب کی مختصر اور متوازن فہرست */}
      {filteredChapters.length === 0 ? (
        <div className="rounded-xl bg-white dark:bg-[#0D1F18] border border-stone-200 dark:border-emerald-900/60 p-8 text-center">
          <p className="urdu-text text-base font-medium text-stone-700 dark:text-stone-300">
            “{chapterFilter}” کے نام سے کوئی باب نہیں ملا۔
          </p>
          <button
            type="button"
            onClick={() => setChapterFilter('')}
            className="urdu-text mt-3 px-4 py-1.5 text-sm font-semibold rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition-colors"
          >
            تمام ابواب دکھائیں
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredChapters.map((chapter) => (
            <button
              key={chapter.id}
              type="button"
              onClick={() => onSelectChapter(chapter.sectionNumber)}
              className="group flex items-center justify-between gap-4 text-right px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl bg-white dark:bg-[#0D1F18] border border-stone-200 dark:border-emerald-900/60 hover:border-[#B4832C] dark:hover:border-[#D4AF37] shadow-sm hover:shadow transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="urdu-text inline-flex items-center justify-center min-w-[2.25rem] h-8 px-2 rounded-md bg-emerald-950/[0.04] dark:bg-emerald-950/70 border border-stone-200/80 dark:border-emerald-900/60 text-xs font-bold text-[#9A6F22] dark:text-[#D4AF37] shrink-0">
                  {chapter.sectionNumber === 0
                    ? '۰'
                    : toUrduDigits(chapter.sectionNumber)}
                </span>
                <span className="urdu-text text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-900 dark:group-hover:text-[#D4AF37] transition-colors py-0.5 leading-[2.25]">
                  {chapter.urduName}
                </span>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span className="urdu-text text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300 whitespace-nowrap">
                  {toUrduDigits(chapter.hadithCount)} احادیث
                </span>
                <ArrowLeft
                  className="w-4 h-4 text-stone-400 group-hover:text-emerald-800 dark:group-hover:text-[#D4AF37] transition-transform duration-150 group-hover:-translate-x-0.5 shrink-0"
                  aria-hidden="true"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
