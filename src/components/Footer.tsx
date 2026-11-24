import React from 'react';
import { BookId, HadithBook } from '../types/hadith';

interface FooterProps {
  books: HadithBook[];
  onSelectBook: (bookId: BookId) => void;
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  books,
  onSelectBook,
  onNavigateHome,
}) => {
  return (
    <footer className="mt-16 border-t border-stone-200 dark:border-emerald-900/60 bg-stone-50/70 dark:bg-[#050E0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <button
              type="button"
              onClick={onNavigateHome}
              className="urdu-text text-2xl font-bold text-stone-900 dark:text-stone-100 hover:text-emerald-800 dark:hover:text-[#D4AF37] transition-colors"
            >
              صحاحِ ستہ
            </button>
            <p className="urdu-text mt-1 text-sm text-stone-500 dark:text-stone-400">
              احادیثِ مبارکہ کی چھ مستند کتابیں عربی متن اور اردو ترجمے کے ساتھ۔
            </p>
          </div>

          <div className="urdu-text flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-stone-600 dark:text-stone-300">
            {books.map((book) => (
              <button
                key={book.id}
                type="button"
                onClick={() => onSelectBook(book.id)}
                className="hover:text-emerald-900 dark:hover:text-[#D4AF37] hover:underline whitespace-nowrap"
              >
                {book.urduName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
