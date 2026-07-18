export type Screen = 'home' | 'game' | 'settings';

export type DigitCount = 3 | 4;
export type GameInnings = 6 | 9;
export type GameMode = 'classic' | 'daily';

export const DEFAULT_DIGIT_COUNT: DigitCount = 3;
export const DEFAULT_TOTAL_INNINGS: GameInnings = 9;
export const OUTS_PER_INNING = 3 as const;

export const DIGIT_COUNT_OPTIONS: DigitCount[] = [3, 4];
export const INNING_OPTIONS: GameInnings[] = [6, 9];

export const HINT_AFTER_ATTEMPTS = 3;
export const MAX_HINTS_PER_INNING = 1;

export const MAX_CONTENT_WIDTH = 480;
export const TABLET_BREAKPOINT = 600;

/** @deprecated Use settings.totalInnings or game config instead */
export const TOTAL_INNINGS = DEFAULT_TOTAL_INNINGS;
