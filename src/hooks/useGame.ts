import { useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, LayoutAnimation, Platform, UIManager } from 'react-native';

import type { GameMode, IHintReveal, IInningResult, ISettings } from '../../types';
import {
  DEFAULT_DIGIT_COUNT,
  DEFAULT_TOTAL_INNINGS,
  HINT_AFTER_ATTEMPTS,
  MAX_HINTS_PER_INNING,
} from '../constants/game';
import i18n from '../i18n';
import {
  computeHintReveal,
  digitsToString,
  generateDailySecret,
  generateSecretDigits,
  getDailyDateKey,
  isValidGuessDigits,
  makeId,
} from '../lib/game';
import { computeOutsThisInning, submitGuessReducer, undoLastAttempt } from '../lib/inning';
import { triggerHaptic } from '../lib/haptics';
import { useSound } from './useSound';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface UseGameOptions {
  onGameComplete?: (results: IInningResult[]) => void;
}

function announceScore(strikes: number, balls: number, outs: number) {
  void AccessibilityInfo.announceForAccessibility(
    i18n.t('a11y.scoreResult', { strikes, balls, outs }),
  );
}

function announceHint(position: number, digit: number) {
  void AccessibilityInfo.announceForAccessibility(
    i18n.t('a11y.hintRevealed', { position: position + 1, digit }),
  );
}

export function useGame(settings: ISettings, options?: UseGameOptions) {
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [secret, setSecret] = useState<number[]>(() => generateSecretDigits(settings.digitCount));
  const [currentGuess, setCurrentGuess] = useState<number[]>([]);
  const [attempts, setAttempts] = useState<IInningResult['attempts']>([]);
  const [inning, setInning] = useState(1);
  const [inningResults, setInningResults] = useState<IInningResult[]>([]);
  const [inningEndVisible, setInningEndVisible] = useState(false);
  const [lastInningScored, setLastInningScored] = useState(false);
  const [gameEndVisible, setGameEndVisible] = useState(false);
  const [lastStrikeMask, setLastStrikeMask] = useState<boolean[] | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [invalidShakeTrigger, setInvalidShakeTrigger] = useState(0);
  const [hasUsedUndoThisInning, setHasUsedUndoThisInning] = useState(false);
  const [hintReveals, setHintReveals] = useState<IHintReveal[]>([]);
  const [hintsUsedThisInning, setHintsUsedThisInning] = useState(0);

  const digitCount = gameMode === 'daily' ? DEFAULT_DIGIT_COUNT : settings.digitCount;
  const totalInnings = gameMode === 'daily' ? DEFAULT_TOTAL_INNINGS : settings.totalInnings;
  const dailyDateKey = useMemo(() => getDailyDateKey(), []);

  const { playWinSound, playLoseSound, playCallSequence } = useSound(settings.soundEnabled);
  const onGameCompleteRef = useRef(options?.onGameComplete);
  onGameCompleteRef.current = options?.onGameComplete;

  const secretPreview = useMemo(() => digitsToString(secret), [secret]);
  const outsThisInning = useMemo(() => computeOutsThisInning(attempts), [attempts]);
  const isInputLocked = inningEndVisible || gameEndVisible || isScoring;
  const canUndo =
    !isInputLocked &&
    !hasUsedUndoThisInning &&
    currentGuess.length === 0 &&
    attempts.length > 0;

  function createSecret(inningNumber: number, mode: GameMode) {
    if (mode === 'daily') {
      return generateDailySecret(dailyDateKey, inningNumber, DEFAULT_DIGIT_COUNT);
    }
    return generateSecretDigits(settings.digitCount);
  }

  function triggerErrorHaptic() {
    if (!settings.hapticsEnabled) return;
    void triggerHaptic('error');
  }

  function triggerSelectionHaptic() {
    if (!settings.hapticsEnabled) return;
    void triggerHaptic('selection');
  }

  function triggerImpactHaptic() {
    if (!settings.hapticsEnabled) return;
    void triggerHaptic('impact');
  }

  function triggerSuccessHaptic() {
    if (!settings.hapticsEnabled) return;
    void triggerHaptic('success');
  }

  function triggerWarningHaptic() {
    if (!settings.hapticsEnabled) return;
    void triggerHaptic('warning');
  }

  function finishGame(newInningResults: IInningResult[]) {
    setGameEndVisible(true);
    queueMicrotask(() => onGameCompleteRef.current?.(newInningResults));
  }

  function maybeRevealHint(newAttempts: IInningResult['attempts']) {
    const revealedPositions = hintReveals.map((hint) => hint.position);
    const hint = computeHintReveal(
      newAttempts,
      secret,
      revealedPositions,
      hintsUsedThisInning,
      HINT_AFTER_ATTEMPTS,
      MAX_HINTS_PER_INNING,
    );

    if (!hint) return;

    setHintReveals((prev) => [...prev, hint]);
    setHintsUsedThisInning((prev) => prev + 1);
    announceHint(hint.position, hint.digit);
  }

  function resetFullGame(mode: GameMode = 'classic') {
    setGameMode(mode);
    setSecret(createSecret(1, mode));
    setCurrentGuess([]);
    setAttempts([]);
    setInning(1);
    setInningResults([]);
    setInningEndVisible(false);
    setLastInningScored(false);
    setGameEndVisible(false);
    setLastStrikeMask(null);
    setIsScoring(false);
    setInvalidShakeTrigger(0);
    setHasUsedUndoThisInning(false);
    setHintReveals([]);
    setHintsUsedThisInning(0);
  }

  function startNextInning() {
    const nextInning = inning + 1;
    setSecret(createSecret(nextInning, gameMode));
    setCurrentGuess([]);
    setAttempts([]);
    setLastStrikeMask(null);
    setInningEndVisible(false);
    setIsScoring(false);
    setHasUsedUndoThisInning(false);
    setHintReveals([]);
    setHintsUsedThisInning(0);
    setInning(nextInning);
  }

  function pushDigit(d: number) {
    if (isInputLocked) return;
    if (currentGuess.length >= digitCount) return;
    if (currentGuess.includes(d)) return;
    triggerSelectionHaptic();
    setLastStrikeMask(null);
    setCurrentGuess((prev) => [...prev, d]);
  }

  function popDigit() {
    if (isInputLocked) return;
    triggerSelectionHaptic();
    setLastStrikeMask(null);
    setCurrentGuess((prev) => prev.slice(0, -1));
  }

  function undoLastAttemptAction() {
    if (!canUndo) return;

    const result = undoLastAttempt(attempts);
    if (!result) return;

    triggerSelectionHaptic();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAttempts(result.newAttempts);
    setLastStrikeMask(null);
    setHasUsedUndoThisInning(true);
  }

  function submitGuess() {
    if (isInputLocked) return;

    if (!isValidGuessDigits(currentGuess, digitCount)) {
      triggerErrorHaptic();
      setInvalidShakeTrigger((prev) => prev + 1);
      return;
    }

    triggerImpactHaptic();

    const submitResult = submitGuessReducer({
      inning,
      totalInnings,
      digitCount,
      attempts,
      outsThisInning,
      guess: currentGuess,
      secret,
      attemptId: makeId(),
    });

    setLastStrikeMask(submitResult.lastStrikeMask);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAttempts(submitResult.newAttempts);
    setCurrentGuess([]);
    setHasUsedUndoThisInning(false);

    const { score } = submitResult.attempt;
    announceScore(score.strikes, score.balls, score.outs);
    setIsScoring(true);

    if (submitResult.outcome === 'run_scored') {
      void playCallSequence(score.strikes, score.balls, score.outs).finally(() => setIsScoring(false));
      triggerSuccessHaptic();
      void playWinSound();
      setLastInningScored(true);

      const newInningResults = submitResult.inningResult
        ? [...inningResults, submitResult.inningResult]
        : inningResults;
      setInningResults(newInningResults);

      if (submitResult.showGameEnd) {
        finishGame(newInningResults);
      } else {
        setInningEndVisible(true);
      }
      return;
    }

    if (submitResult.outcome === 'inning_over') {
      triggerWarningHaptic();
      setLastInningScored(false);

      const newInningResults = submitResult.inningResult
        ? [...inningResults, submitResult.inningResult]
        : inningResults;
      setInningResults(newInningResults);

      playCallSequence(score.strikes, score.balls, score.outs).then(() => {
        void playLoseSound();
        if (submitResult.showGameEnd) {
          finishGame(newInningResults);
        } else {
          setInningEndVisible(true);
        }
      }).finally(() => setIsScoring(false));
      return;
    }

    maybeRevealHint(submitResult.newAttempts);
    void playCallSequence(score.strikes, score.balls, score.outs).finally(() => setIsScoring(false));
  }

  return {
    gameMode,
    digitCount,
    totalInnings,
    dailyDateKey,
    secretPreview,
    currentGuess,
    attempts,
    inning,
    inningResults,
    outsThisInning,
    inningEndVisible,
    lastInningScored,
    gameEndVisible,
    lastStrikeMask,
    hintReveals,
    isInputLocked,
    invalidShakeTrigger,
    canUndo,
    resetFullGame,
    startNextInning,
    pushDigit,
    popDigit,
    submitGuess,
    undoLastAttempt: undoLastAttemptAction,
  };
}
