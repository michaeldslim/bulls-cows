import type { AppLanguage } from '../../types';

export function formatOrdinal(n: number, language: AppLanguage): string {
  if (language === 'ko') return `${n}이닝`;
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
}

export function formatInningLabel(n: number, language: AppLanguage): string {
  if (language === 'ko') return `${n}회`;
  return `${formatOrdinal(n, language)} Inning`;
}
