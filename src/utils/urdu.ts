const URDU_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toUrduDigits(input: number | string): string {
  return String(input).replace(/\d/g, (d) => URDU_DIGITS[Number(d)] ?? d);
}

export function formatUrduNumber(num: number): string {
  return toUrduDigits(num.toLocaleString('en-US').replace(/,/g, '،'));
}

export function normalizeDigitsToAscii(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

export function stripArabicDiacritics(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
}

export function mapGradeToUrdu(gradeRaw?: string): string {
  if (!gradeRaw) return '';
  const g = gradeRaw.toLowerCase();
  if (g.includes('sahih') && g.includes('hasan')) return 'حسن صحیح';
  if (g.includes('sahih')) return 'صحیح';
  if (g.includes('hasan')) return 'حسن';
  if (g.includes('daif') || g.includes("da'if") || g.includes('weak')) return 'ضعیف';
  if (g.includes('mawdu')) return 'موضوع';
  if (g.includes('muttafaqun')) return 'متفق علیہ';
  if (g.includes('isnad')) return 'مستند';
  return 'مستند';
}
