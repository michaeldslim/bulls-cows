import type { DigitResult, IAttempt, IScore } from '../../types';
import { DEFAULT_DIGIT_COUNT } from '../constants/game';

/** @deprecated Use game config digitCount instead */
export const DIGIT_COUNT = DEFAULT_DIGIT_COUNT;

function shuffleWithRng(pool: number[], count: number, rng: () => number): number[] {
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

export function generateSecretDigits(digitCount: number = DEFAULT_DIGIT_COUNT): number[] {
  const pool = Array.from({ length: 10 }, (_, i) => i);
  return shuffleWithRng(pool, digitCount, Math.random);
}

export function isValidGuessDigits(digits: number[], digitCount: number = DEFAULT_DIGIT_COUNT): boolean {
  if (digits.length !== digitCount) return false;
  const seen = new Set<number>();

  for (const d of digits) {
    if (!Number.isInteger(d)) return false;
    if (d < 0 || d > 9) return false;
    if (seen.has(d)) return false;
    seen.add(d);
  }

  return true;
}

export function classifyGuessDigits(secret: number[], guess: number[]): DigitResult[] {
  const digitCount = secret.length;
  if (guess.length !== digitCount) {
    throw new Error(`Secret and guess must both be ${digitCount} digits.`);
  }

  const secretSet = new Set(secret);
  return guess.map((digit, index) => {
    if (digit === secret[index]) return 'strike';
    if (secretSet.has(digit)) return 'ball';
    return 'out';
  });
}

export function scoreGuess(secret: number[], guess: number[]): IScore {
  const digitCount = secret.length;
  if (guess.length !== digitCount) {
    throw new Error(`Secret and guess must both be ${digitCount} digits.`);
  }

  const secretSet = new Set(secret);
  let strikes = 0;
  let balls = 0;

  for (let i = 0; i < digitCount; i += 1) {
    const g = guess[i];
    if (g === secret[i]) {
      strikes += 1;
    } else if (secretSet.has(g)) {
      balls += 1;
    }
  }

  const outs = digitCount - strikes - balls;
  return { strikes, balls, outs };
}

export function computeHintReveal(
  attempts: IAttempt[],
  secret: number[],
  revealedPositions: number[],
  hintsUsed: number,
  hintAfterAttempts: number,
  maxHintsPerInning: number,
): { position: number; digit: number } | null {
  if (hintsUsed >= maxHintsPerInning) return null;
  if (attempts.length < hintAfterAttempts) return null;

  const unrevealed = secret
    .map((digit, position) => ({ position, digit }))
    .filter(({ position }) => !revealedPositions.includes(position));

  if (unrevealed.length === 0) return null;

  const pick = unrevealed[attempts.length % unrevealed.length];
  return pick;
}

export function digitsToString(digits: number[]): string {
  return digits.join('');
}

export function makeId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
