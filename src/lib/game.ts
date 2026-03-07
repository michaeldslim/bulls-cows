import type { IScore } from '../../types';

export const DIGIT_COUNT = 3 as const;

export function generateSecretDigits(): number[] {
  const pool = Array.from({ length: 10 }, (_, i) => i);

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, DIGIT_COUNT);
}

export function isValidGuessDigits(digits: number[]): boolean {
  if (digits.length !== DIGIT_COUNT) return false;
  const seen = new Set<number>();

  for (const d of digits) {
    if (!Number.isInteger(d)) return false;
    if (d < 0 || d > 9) return false;
    if (seen.has(d)) return false;
    seen.add(d);
  }

  return true;
}

export function scoreGuess(secret: number[], guess: number[]): IScore {
  if (secret.length !== DIGIT_COUNT || guess.length !== DIGIT_COUNT) {
    throw new Error('Secret and guess must both be 3 digits.');
  }

  const secretSet = new Set(secret);
  let strikes = 0;
  let balls = 0;

  for (let i = 0; i < DIGIT_COUNT; i += 1) {
    const g = guess[i];
    if (g === secret[i]) {
      strikes += 1;
    } else if (secretSet.has(g)) {
      balls += 1;
    }
  }

  const outs = DIGIT_COUNT - strikes - balls;
  return { strikes, balls, outs };
}

export function digitsToString(digits: number[]): string {
  return digits.join('');
}

export function makeId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
