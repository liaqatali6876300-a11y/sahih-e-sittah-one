import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { HadithBook } from '../types/hadith';
import { toUrduDigits } from '../utils/urdu';

interface BookCardProps {
  book: HadithBook;
  chapterCount: number;
  onSelect: (bookId: HadithBook['id']) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  chapterCount,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(book.id)}
      className="group relative flex flex-col justify-between text-right w-full p-6 sm:p-8 rounded-xl bg-white dark:bg-[#0D1F18] border border-stone-200 dark:border-emerald-900/60 hover:border-[#B4832C] dark:hover:border-[#D4AF37] shadow-sm hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
    >
      <div className="w-full">
        {/* شمار اور کل احادیث */}
        <div className="flex items-center justify-between gap-3 text-sm text-stone-500 dark:text-stone-400">
          <span className="urdu-text font-semibold text-[#9A6F22] dark:text-[#D4AF37]">
            کتاب {book.orderUrdu} · {book.deathYearUrdu}
          </span>
          <span className="urdu-text font-semibold text-emerald-800 dark:text-emerald-300">
            {book.totalHadithUrdu}
          </span>
        </div>

        {/* کتاب کا عنوان اور مصنف */}
        <div className="mt-4">
          <h3 className="urdu-text text-3xl sm:text-[34px] font-bold text-emerald-900 dark:text-[#D4AF37] group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors leading-[2.4]">
            {book.urduName}
          </h3>
          <p className="urdu-text mt-2 text-sm sm:text-base font-medium text-stone-600 dark:text-stone-300 leading-[2.3]">
            مصنف: {book.compilerUrdu}
          </p>
        </div>

        {/* مختصر تعارف */}
        <p className="urdu-text mt-4 text-base text-stone-600 dark:text-stone-300 leading-[2.45]">
          {book.descriptionUrdu}
        </p>
      </div>

      {/* ابواب کا بٹن */}
      <div className="mt-6 pt-4 border-t border-stone-100 dark:border-emerald-900/50 flex items-center justify-between gap-3 w-full text-sm font-medium">
        <span className="urdu-text text-stone-500 dark:text-stone-400">
          کل ابواب: {toUrduDigits(chapterCount)}
        </span>
        <span className="urdu-text inline-flex items-center gap-2 text-emerald-800 dark:text-[#D4AF37] font-semibold whitespace-nowrap shrink-0">
          ابواب دیکھیں
          <ArrowLeft
            className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </button>
  );
};
