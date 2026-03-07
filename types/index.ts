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
