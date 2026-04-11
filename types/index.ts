export interface IScore {
  strikes: number;
  balls: number;
  outs: number;
}

export interface IAttempt {
  id: string;
  guess: number[];
  score: IScore;
}

export interface IInningResult {
  inning: number;
  scored: boolean;
  attempts: IAttempt[];
}
