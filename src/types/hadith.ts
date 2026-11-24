export type BookId =
  | 'bukhari'
  | 'muslim'
  | 'abudawood'
  | 'tirmizi'
  | 'nasai'
  | 'ibnmajah';

export type ApiSlug =
  | 'bukhari'
  | 'muslim'
  | 'abudawud'
  | 'tirmidhi'
  | 'nasai'
  | 'ibnmajah';

export interface HadithBook {
  id: BookId;
  apiSlug: ApiSlug;
  orderUrdu: string;
  urduName: string;
  arabicName: string;
  compilerUrdu: string;
  deathYearUrdu: string;
  totalHadith: number;
  totalHadithUrdu: string;
  descriptionUrdu: string;
}

export interface HadithChapter {
  id: string;
  bookId: BookId;
  sectionNumber: number;
  urduName: string;
  arabicName: string;
  hadithCount: number;
}

export interface HadithItem {
  id: string;
  bookId: BookId;
  sectionNumber: number;
  hadithNumber: number;
  arabic: string;
  urdu: string;
  gradeUrdu?: string;
}

export type AppRoute =
  | { view: 'home' }
  | { view: 'chapters'; bookId: BookId }
  | { view: 'hadiths'; bookId: BookId; sectionNumber: number }
  | { view: 'search'; query: string }
  | { view: 'bookmarks' };

export type TextSizePreset = 'medium' | 'large' | 'xlarge';
