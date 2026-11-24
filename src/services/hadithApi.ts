import { FALLBACK_HADITHS } from '../data/fallbackHadiths';
import { HADITH_BOOKS } from '../data/sihahSittaCatalog';
import { BookId, HadithItem } from '../types/hadith';
import {
  mapGradeToUrdu,
  normalizeDigitsToAscii,
  stripArabicDiacritics,
} from '../utils/urdu';
import {
  getOfflineBook,
  getOfflineChapter,
  saveOfflineBook,
  saveOfflineChapter,
} from './offlineStore';

const API_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

interface ApiHadithRecord {
  hadithnumber: number;
  arabicnumber?: number;
  text: string;
  grades?: Array<{ name?: string; grade?: string }>;
  reference?: { book?: number; hadith?: number };
}

interface ApiResponse {
  hadiths?: ApiHadithRecord[];
}

const chapterCache = new Map<string, HadithItem[]>();
const fullBookCache = new Map<BookId, HadithItem[]>();
const fullBookInFlight = new Map<BookId, Promise<HadithItem[]>>();

function mergeArabicAndUrdu(
  bookId: BookId,
  sectionNumber: number,
  araList: ApiHadithRecord[],
  urdList: ApiHadithRecord[]
): HadithItem[] {
  const araMap = new Map<number, ApiHadithRecord>();
  for (const item of araList) {
    if (item && typeof item.hadithnumber === 'number') {
      araMap.set(item.hadithnumber, item);
    }
  }

  const urdMap = new Map<number, ApiHadithRecord>();
  for (const item of urdList) {
    if (item && typeof item.hadithnumber === 'number') {
      urdMap.set(item.hadithnumber, item);
    }
  }

  const allNumbers = Array.from(new Set([...araMap.keys(), ...urdMap.keys()])).sort(
    (a, b) => a - b
  );

  const merged: HadithItem[] = [];
  for (const num of allNumbers) {
    const ara = araMap.get(num);
    const urd = urdMap.get(num);
    const arabicText = ara?.text?.trim() || '';
    const urduText = urd?.text?.trim() || '';
    if (!arabicText && !urduText) continue;

    const rawGrade = urd?.grades?.[0]?.grade || ara?.grades?.[0]?.grade || '';
    const secNum =
      urd?.reference?.book ?? ara?.reference?.book ?? sectionNumber;

    merged.push({
      id: `${bookId}-${num}`,
      bookId,
      sectionNumber: secNum,
      hadithNumber: num,
      arabic: arabicText || urduText,
      urdu: urduText || arabicText,
      gradeUrdu: mapGradeToUrdu(rawGrade),
    });
  }

  return merged;
}

async function fetchJsonSafe(url: string): Promise<ApiResponse | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as ApiResponse;
  } catch {
    return null;
  }
}

export async function fetchChapterHadiths(
  bookId: BookId,
  sectionNumber: number
): Promise<{ items: HadithItem[]; fromFallback: boolean }> {
  const cacheKey = `${bookId}:${sectionNumber}`;
  const cached = chapterCache.get(cacheKey);
  if (cached) {
    return { items: cached, fromFallback: false };
  }

  const book = HADITH_BOOKS.find((b) => b.id === bookId);
  if (!book) return { items: [], fromFallback: true };

  // 1. Check in-memory full book cache
  const cachedBook = fullBookCache.get(bookId);
  if (cachedBook) {
    const filtered = cachedBook.filter((h) => h.sectionNumber === sectionNumber);
    if (filtered.length > 0) {
      chapterCache.set(cacheKey, filtered);
      return { items: filtered, fromFallback: false };
    }
  }

  // 2. Check IndexedDB offline full book or chapter cache
  const offlineBook = await getOfflineBook(bookId);
  if (offlineBook && offlineBook.length > 0) {
    fullBookCache.set(bookId, offlineBook);
    const filtered = offlineBook.filter((h) => h.sectionNumber === sectionNumber);
    if (filtered.length > 0) {
      chapterCache.set(cacheKey, filtered);
      return { items: filtered, fromFallback: false };
    }
  }

  const offlineChapter = await getOfflineChapter(cacheKey);
  if (offlineChapter && offlineChapter.length > 0) {
    chapterCache.set(cacheKey, offlineChapter);
    return { items: offlineChapter, fromFallback: false };
  }

  // 3. Fetch from API and save to IndexedDB for offline use
  const [araRes, urdRes] = await Promise.all([
    fetchJsonSafe(`${API_BASE}/ara-${book.apiSlug}/sections/${sectionNumber}.min.json`),
    fetchJsonSafe(`${API_BASE}/urd-${book.apiSlug}/sections/${sectionNumber}.min.json`),
  ]);

  const araList = araRes?.hadiths ?? [];
  const urdList = urdRes?.hadiths ?? [];

  if (araList.length > 0 || urdList.length > 0) {
    const merged = mergeArabicAndUrdu(bookId, sectionNumber, araList, urdList);
    if (merged.length > 0) {
      chapterCache.set(cacheKey, merged);
      void saveOfflineChapter(cacheKey, merged);
      return { items: merged, fromFallback: false };
    }
  }

  // 4. Local bundled fallback
  const fallback = FALLBACK_HADITHS.filter(
    (h) => h.bookId === bookId && h.sectionNumber === sectionNumber
  );
  if (fallback.length > 0) {
    return { items: fallback, fromFallback: true };
  }
  const bookFallback = FALLBACK_HADITHS.filter((h) => h.bookId === bookId);
  return { items: bookFallback, fromFallback: true };
}

export async function fetchFullBook(bookId: BookId): Promise<HadithItem[]> {
  const existing = fullBookCache.get(bookId);
  if (existing) return existing;

  const inflight = fullBookInFlight.get(bookId);
  if (inflight) return inflight;

  const book = HADITH_BOOKS.find((b) => b.id === bookId);
  if (!book) return [];

  const promise = (async () => {
    const offline = await getOfflineBook(bookId);
    if (offline && offline.length > 0) {
      fullBookCache.set(bookId, offline);
      return offline;
    }

    const [araRes, urdRes] = await Promise.all([
      fetchJsonSafe(`${API_BASE}/ara-${book.apiSlug}.min.json`),
      fetchJsonSafe(`${API_BASE}/urd-${book.apiSlug}.min.json`),
    ]);

    const araList = araRes?.hadiths ?? [];
    const urdList = urdRes?.hadiths ?? [];

    if (araList.length > 0 || urdList.length > 0) {
      const merged = mergeArabicAndUrdu(bookId, 1, araList, urdList);
      fullBookCache.set(bookId, merged);
      await saveOfflineBook(bookId, merged);
      return merged;
    }

    return FALLBACK_HADITHS.filter((h) => h.bookId === bookId);
  })();

  fullBookInFlight.set(bookId, promise);
  try {
    return await promise;
  } finally {
    fullBookInFlight.delete(bookId);
  }
}

export async function downloadBookOffline(bookId: BookId): Promise<boolean> {
  const items = await fetchFullBook(bookId);
  const offline = await getOfflineBook(bookId);
  return Boolean(offline && offline.length > 0) || items.length > 10;
}

export async function fetchHadithByNumberAcrossBooks(
  hadithNumber: number,
  bookFilter: 'all' | BookId
): Promise<HadithItem[]> {
  const targetBooks =
    bookFilter === 'all'
      ? HADITH_BOOKS
      : HADITH_BOOKS.filter((b) => b.id === bookFilter);

  const results = await Promise.all(
    targetBooks.map(async (book) => {
      // Check offline/cached full book first
      const cached = fullBookCache.get(book.id) || (await getOfflineBook(book.id));
      if (cached && cached.length > 0) {
        const hit = cached.filter((h) => h.hadithNumber === hadithNumber);
        if (hit.length > 0) return hit;
      }

      const [araRes, urdRes] = await Promise.all([
        fetchJsonSafe(`${API_BASE}/ara-${book.apiSlug}/${hadithNumber}.min.json`),
        fetchJsonSafe(`${API_BASE}/urd-${book.apiSlug}/${hadithNumber}.min.json`),
      ]);
      const ara = araRes?.hadiths?.[0];
      const urd = urdRes?.hadiths?.[0];
      if (!ara && !urd) {
        return FALLBACK_HADITHS.filter(
          (h) => h.bookId === book.id && h.hadithNumber === hadithNumber
        );
      }
      return mergeArabicAndUrdu(
        book.id,
        urd?.reference?.book ?? ara?.reference?.book ?? 1,
        ara ? [ara] : [],
        urd ? [urd] : []
      );
    })
  );

  return results.flat();
}

export async function searchHadithsAcrossBooks(
  rawQuery: string,
  bookFilter: 'all' | BookId
): Promise<HadithItem[]> {
  const trimmed = rawQuery.trim();
  if (!trimmed) return [];

  const ascii = normalizeDigitsToAscii(trimmed);
  const isPureNumber = /^\d+$/.test(ascii);

  if (isPureNumber) {
    const num = Number(ascii);
    if (num > 0) {
      return fetchHadithByNumberAcrossBooks(num, bookFilter);
    }
  }

  const targetBookIds: BookId[] =
    bookFilter === 'all' ? HADITH_BOOKS.map((b) => b.id) : [bookFilter];

  const bookArrays = await Promise.all(
    targetBookIds.map((id) => fetchFullBook(id))
  );
  const allItems = bookArrays.flat();

  const normalizedQuery = stripArabicDiacritics(trimmed).toLowerCase();

  const matches: HadithItem[] = [];
  for (const item of allItems) {
    const arabicClean = stripArabicDiacritics(item.arabic).toLowerCase();
    const urduClean = stripArabicDiacritics(item.urdu).toLowerCase();
    if (
      item.urdu.includes(trimmed) ||
      item.arabic.includes(trimmed) ||
      arabicClean.includes(normalizedQuery) ||
      urduClean.includes(normalizedQuery)
    ) {
      matches.push(item);
      if (matches.length >= 120) break;
    }
  }

  if (matches.length > 0) return matches;

  return FALLBACK_HADITHS.filter(
    (h) =>
      (bookFilter === 'all' || h.bookId === bookFilter) &&
      (h.urdu.includes(trimmed) ||
        h.arabic.includes(trimmed) ||
        stripArabicDiacritics(h.arabic).includes(normalizedQuery))
  );
}
