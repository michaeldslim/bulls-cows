import type { IAttempt, IInningResult } from '../../types';
import { OUTS_PER_INNING } from '../constants/game';
import { classifyGuessDigits, scoreGuess } from './game';

export type InningOutcome = 'continue' | 'run_scored' | 'inning_over';

export interface ISubmitGuessInput {
  inning: number;
  totalInnings: number;
  digitCount: number;
  attempts: IAttempt[];
  outsThisInning: number;
  guess: number[];
  secret: number[];
  attemptId: string;
}

export interface ISubmitGuessResult {
  attempt: IAttempt;
  newAttempts: IAttempt[];
  newOutsThisInning: number;
  lastStrikeMask: boolean[];
  outcome: InningOutcome;
  inningResult: IInningResult | null;
  showGameEnd: boolean;
  showInningEnd: boolean;
}

export function computeOutsThisInning(attempts: IAttempt[]): number {
  return attempts.reduce((sum, attempt) => sum + attempt.score.outs, 0);
}

export function submitGuessReducer(input: ISubmitGuessInput): ISubmitGuessResult {
  const score = scoreGuess(input.secret, input.guess);
  const digitResults = classifyGuessDigits(input.secret, input.guess);
  const attempt: IAttempt = {
    id: input.attemptId,
    guess: input.guess,
    score,
    digitResults,
  };
  const newAttempts = [attempt, ...input.attempts];
  const newOutsThisInning = input.outsThisInning + score.outs;
  const lastStrikeMask = input.guess.map((digit, index) => digit === input.secret[index]);

  if (score.strikes === input.digitCount) {
    return {
      attempt,
      newAttempts,
      newOutsThisInning,
      lastStrikeMask,
      outcome: 'run_scored',
      inningResult: { inning: input.inning, scored: true, attempts: newAttempts },
      showGameEnd: input.inning >= input.totalInnings,
      showInningEnd: input.inning < input.totalInnings,
    };
  }

  if (newOutsThisInning >= OUTS_PER_INNING) {
    return {
      attempt,
      newAttempts,
      newOutsThisInning,
      lastStrikeMask,
      outcome: 'inning_over',
      inningResult: { inning: input.inning, scored: false, attempts: newAttempts },
      showGameEnd: input.inning >= input.totalInnings,
      showInningEnd: input.inning < input.totalInnings,
    };
  }

  return {
    attempt,
    newAttempts,
    newOutsThisInning,
    lastStrikeMask,
    outcome: 'continue',
    inningResult: null,
    showGameEnd: false,
    showInningEnd: false,
  };
}

export function undoLastAttempt(attempts: IAttempt[]): {
  newAttempts: IAttempt[];
  newOutsThisInning: number;
} | null {
  if (attempts.length === 0) return null;

  const newAttempts = attempts.slice(1);
  return {
    newAttempts,
    newOutsThisInning: computeOutsThisInning(newAttempts),
  };
}
