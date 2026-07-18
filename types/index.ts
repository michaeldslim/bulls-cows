export interface IScore {
  strikes: number;
  balls: number;
  outs: number;
}

export type DigitResult = 'strike' | 'ball' | 'out';

export interface IAttempt {
  id: string;
  guess: number[];
  score: IScore;
  digitResults: DigitResult[];
}

export type AppLanguage = 'en' | 'ko';

export interface ISettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  language: AppLanguage;
}

export interface IInningResult {
  inning: number;
  scored: boolean;
  attempts: IAttempt[];
}

export interface IStats {
  bestRuns: number;
  perfectGames: number;
  gamesPlayed: number;
  totalAttemptsOnScoredInnings: number;
  scoredInnings: number;
}
