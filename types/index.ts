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

export interface ISettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

export interface IInningResult {
  inning: number;
  scored: boolean;
  attempts: IAttempt[];
}
