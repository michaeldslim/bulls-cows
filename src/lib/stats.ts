import type { IInningResult, IStats } from '../../types';
import { TOTAL_INNINGS } from '../constants/game';

export const DEFAULT_STATS: IStats = {
  bestRuns: 0,
  perfectGames: 0,
  gamesPlayed: 0,
  totalAttemptsOnScoredInnings: 0,
  scoredInnings: 0,
};

export function updateStatsAfterGame(stats: IStats, inningResults: IInningResult[]): IStats {
  const runs = inningResults.filter((result) => result.scored).length;
  const scoredInnings = inningResults.filter((result) => result.scored);
  const attemptsOnScored = scoredInnings.reduce((sum, result) => sum + result.attempts.length, 0);
  const isPerfectGame = runs === TOTAL_INNINGS && inningResults.length === TOTAL_INNINGS;

  return {
    bestRuns: Math.max(stats.bestRuns, runs),
    perfectGames: stats.perfectGames + (isPerfectGame ? 1 : 0),
    gamesPlayed: stats.gamesPlayed + 1,
    totalAttemptsOnScoredInnings: stats.totalAttemptsOnScoredInnings + attemptsOnScored,
    scoredInnings: stats.scoredInnings + scoredInnings.length,
  };
}

export function averageAttemptsPerScoredInning(stats: IStats): number | null {
  if (stats.scoredInnings === 0) return null;
  return stats.totalAttemptsOnScoredInnings / stats.scoredInnings;
}

export function isNewBestRun(stats: IStats, runs: number): boolean {
  return runs > stats.bestRuns;
}
