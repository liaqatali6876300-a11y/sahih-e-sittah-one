import React, { useState } from 'react';
import { Bookmark, BookOpen, Check, Copy } from 'lucide-react';
import { BookId, HadithBook, HadithItem, TextSizePreset } from '../types/hadith';
import { toUrduDigits } from '../utils/urdu';

interface HadithCardProps {
  hadith: HadithItem;
  book: HadithBook;
  chapterNameUrdu?: string;
  isBookmarked: boolean;
  onToggleBookmark: (hadith: HadithItem) => void;
  onOpenChapter?: (bookId: BookId, sectionNumber: number) => void;
  textSize?: TextSizePreset;
}

const ARABIC_SIZE_CLASS: Record<TextSizePreset, string> = {
  medium: 'text-2xl sm:text-[28px]',
  large: 'text-3xl sm:text-[34px]',
  xlarge: 'text-[32px] sm:text-[40px]',
};

const URDU_SIZE_CLASS: Record<TextSizePreset, string> = {
  medium: 'text-lg sm:text-xl',
  large: 'text-xl sm:text-2xl',
  xlarge: 'text-2xl sm:text-[28px]',
};

export const HadithCard: React.FC<HadithCardProps> = ({
  hadith,
  book,
  chapterNameUrdu,
  isBookmarked,
  onToggleBookmark,
  onOpenChapter,
  textSize = 'large',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const formatted = [
      `${book.urduName}${chapterNameUrdu ? ` — ${chapterNameUrdu}` : ''} (حدیث نمبر: ${toUrduDigits(hadith.hadithNumber)})`,
      '',
      hadith.arabic,
      '',
      `اردو ترجمہ:`,
      hadith.urdu,
      hadith.gradeUrdu ? `\nدرجہ: ${hadith.gradeUrdu}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = formatted;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <article className="rounded-xl bg-white dark:bg-[#0D1F18] border border-stone-200 dark:border-emerald-900/60 p-6 sm:p-8 shadow-sm">
      {/* حدیث کا حوالہ */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-stone-100 dark:border-emerald-900/50">
        <div className="urdu-text flex flex-wrap items-center gap-2 text-sm sm:text-base text-stone-600 dark:text-stone-300">
          <span className="font-bold text-emerald-900 dark:text-emerald-300">
            {book.urduName}
          </span>
          {chapterNameUrdu && (
            <>
              <span aria-hidden="true" className="text-stone-300 dark:text-emerald-800">
                ·
              </span>
              <span>{chapterNameUrdu}</span>
            </>
          )}
          <span aria-hidden="true" className="text-stone-300 dark:text-emerald-800">
            ·
          </span>
          <span className="font-bold text-[#9A6F22] dark:text-[#D4AF37]">
            حدیث نمبر {toUrduDigits(hadith.hadithNumber)}
          </span>
        </div>

        {hadith.gradeUrdu && (
          <span className="urdu-text text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            حکم: {hadith.gradeUrdu}
          </span>
        )}
      </div>

      {/* عربی متن اور اردو ترجمہ */}
      <div className="divide-y divide-stone-100 dark:divide-emerald-900/50">
        {/* عربی متن */}
        <div className="py-7">
          <p className="urdu-text text-xs sm:text-sm font-semibold text-[#9A6F22] dark:text-[#D4AF37] mb-3">
            عربی متن
          </p>
          <p
            dir="rtl"
            lang="ar"
            className={`arabic-text ${ARABIC_SIZE_CLASS[textSize]} text-stone-900 dark:text-stone-100 text-right`}
          >
            {hadith.arabic}
          </p>
        </div>

        {/* اردو ترجمہ */}
        <div className="py-7">
          <p className="urdu-text text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-400 mb-3">
            اردو ترجمہ
          </p>
          <p
            dir="rtl"
            lang="ur"
            className={`urdu-text ${URDU_SIZE_CLASS[textSize]} text-stone-800 dark:text-stone-200 text-right`}
          >
            {hadith.urdu}
          </p>
        </div>
      </div>

      {/* بٹن: محفوظ کریں اور کاپی کریں */}
      <div className="pt-5 border-t border-stone-100 dark:border-emerald-900/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onToggleBookmark(hadith)}
            aria-pressed={isBookmarked}
            className={`urdu-text inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              isBookmarked
                ? 'bg-[#F5EFE0] dark:bg-[#D4AF37]/15 border-[#B4832C]/60 dark:border-[#D4AF37]/60 text-[#9A6F22] dark:text-[#D4AF37]'
                : 'bg-stone-50 dark:bg-[#07130E] border-stone-200 dark:border-emerald-900/70 text-stone-700 dark:text-stone-200 hover:border-emerald-700 dark:hover:border-[#D4AF37]'
            }`}
          >
            <Bookmark
              className={`w-4 h-4 shrink-0 ${isBookmarked ? 'fill-current' : ''}`}
              aria-hidden="true"
            />
            <span>{isBookmarked ? 'محفوظ شدہ' : 'محفوظ کریں'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="urdu-text inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-stone-200 dark:border-emerald-900/70 bg-stone-50 dark:bg-[#07130E] text-stone-700 dark:text-stone-200 hover:border-emerald-700 dark:hover:border-[#D4AF37] transition-colors whitespace-nowrap shrink-0"
          >
            {copied ? (
              <>
                <Check
                  className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-emerald-800 dark:text-emerald-300">کاپی ہو گئی</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>حدیث کاپی کریں</span>
              </>
            )}
          </button>
        </div>

        {onOpenChapter && (
          <button
            type="button"
            onClick={() => onOpenChapter(book.id, hadith.sectionNumber)}
            className="urdu-text inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-[#D4AF37] hover:underline whitespace-nowrap shrink-0 py-1.5"
          >
            <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>باب کھولیں</span>
          </button>
        )}
      </div>
    </article>
  );
};
