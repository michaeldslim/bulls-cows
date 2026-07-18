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
export type DigitCount = 3 | 4;
export type GameInnings = 6 | 9;
export type GameMode = 'classic' | 'daily';

export interface ISettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  language: AppLanguage;
  digitCount: DigitCount;
  totalInnings: GameInnings;
}

export interface IHintReveal {
  position: number;
  digit: number;
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
