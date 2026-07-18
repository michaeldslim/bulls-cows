import { describe, expect, it } from 'vitest';

import {
  classifyGuessDigits,
  DIGIT_COUNT,
  generateSecretDigits,
  isValidGuessDigits,
  scoreGuess,
} from './game';
import { computeOutsThisInning, submitGuessReducer, undoLastAttempt } from './inning';
import { averageAttemptsPerScoredInning, DEFAULT_STATS, updateStatsAfterGame } from './stats';
import type { IAttempt } from '../../types';

function makeAttempt(outs: number, strikes = 0, balls = 0): IAttempt {
  return {
    id: 'test',
    guess: [0, 1, 2],
    score: { strikes, balls, outs },
    digitResults: ['out', 'out', 'out'],
  };
}

describe('generateSecretDigits', () => {
  it('returns 3 unique digits in range 0-9', () => {
    const secret = generateSecretDigits();
    expect(secret).toHaveLength(DIGIT_COUNT);
    expect(new Set(secret).size).toBe(DIGIT_COUNT);
    secret.forEach((digit) => {
      expect(digit).toBeGreaterThanOrEqual(0);
      expect(digit).toBeLessThanOrEqual(9);
    });
  });
});

describe('isValidGuessDigits', () => {
  it('accepts 3 unique digits', () => {
    expect(isValidGuessDigits([1, 2, 3])).toBe(true);
    expect(isValidGuessDigits([0, 5, 9])).toBe(true);
  });

  it('rejects wrong length, duplicates, and out-of-range digits', () => {
    expect(isValidGuessDigits([1, 2])).toBe(false);
    expect(isValidGuessDigits([1, 1, 2])).toBe(false);
    expect(isValidGuessDigits([1, 2, 10])).toBe(false);
    expect(isValidGuessDigits([1, 2, -1])).toBe(false);
  });
});

describe('scoreGuess', () => {
  it('scores strikes, balls, and outs', () => {
    expect(scoreGuess([1, 2, 3], [1, 3, 4])).toEqual({ strikes: 1, balls: 1, outs: 1 });
    expect(scoreGuess([1, 2, 3], [1, 2, 0])).toEqual({ strikes: 2, balls: 0, outs: 1 });
    expect(scoreGuess([1, 2, 3], [4, 5, 6])).toEqual({ strikes: 0, balls: 0, outs: 3 });
    expect(scoreGuess([1, 2, 3], [1, 2, 3])).toEqual({ strikes: 3, balls: 0, outs: 0 });
  });
});

describe('classifyGuessDigits', () => {
  it('classifies each digit position', () => {
    expect(classifyGuessDigits([1, 2, 3], [1, 3, 4])).toEqual(['strike', 'ball', 'out']);
  });
});

describe('submitGuessReducer', () => {
  it('continues inning when outs remain', () => {
    const result = submitGuessReducer({
      inning: 1,
      attempts: [],
      outsThisInning: 0,
      guess: [1, 3, 4],
      secret: [1, 2, 3],
      attemptId: 'a1',
    });

    expect(result.outcome).toBe('continue');
    expect(result.newOutsThisInning).toBe(1);
    expect(result.showGameEnd).toBe(false);
    expect(result.showInningEnd).toBe(false);
  });

  it('ends inning on 3 outs', () => {
    const result = submitGuessReducer({
      inning: 2,
      attempts: [makeAttempt(2)],
      outsThisInning: 2,
      guess: [4, 5, 6],
      secret: [1, 2, 3],
      attemptId: 'a2',
    });

    expect(result.outcome).toBe('inning_over');
    expect(result.inningResult?.scored).toBe(false);
    expect(result.showInningEnd).toBe(true);
  });

  it('scores a run on 3 strikes', () => {
    const result = submitGuessReducer({
      inning: 9,
      attempts: [],
      outsThisInning: 0,
      guess: [1, 2, 3],
      secret: [1, 2, 3],
      attemptId: 'a3',
    });

    expect(result.outcome).toBe('run_scored');
    expect(result.showGameEnd).toBe(true);
    expect(result.showInningEnd).toBe(false);
  });
});

describe('undoLastAttempt', () => {
  it('removes latest attempt and recalculates outs', () => {
    const attempts = [makeAttempt(1), makeAttempt(2)];
    const result = undoLastAttempt(attempts);

    expect(result?.newAttempts).toHaveLength(1);
    expect(result?.newOutsThisInning).toBe(2);
  });

  it('returns null when no attempts exist', () => {
    expect(undoLastAttempt([])).toBeNull();
  });
});

describe('computeOutsThisInning', () => {
  it('sums outs across attempts', () => {
    expect(computeOutsThisInning([makeAttempt(1), makeAttempt(2)])).toBe(3);
  });
});

describe('updateStatsAfterGame', () => {
  it('tracks best runs, perfect games, and averages', () => {
    const inningResults = [
      { inning: 1, scored: true, attempts: [makeAttempt(0, 3)] },
      { inning: 2, scored: false, attempts: [makeAttempt(3)] },
    ];

    const next = updateStatsAfterGame(DEFAULT_STATS, inningResults);
    expect(next.bestRuns).toBe(1);
    expect(next.gamesPlayed).toBe(1);
    expect(next.scoredInnings).toBe(1);
    expect(averageAttemptsPerScoredInning(next)).toBe(1);
  });
});
