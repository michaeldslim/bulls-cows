import { useMemo, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import type { IInningResult, ISettings } from '../../types';
import {
  DIGIT_COUNT,
  digitsToString,
  generateSecretDigits,
  isValidGuessDigits,
  makeId,
} from '../lib/game';
import { computeOutsThisInning, submitGuessReducer, undoLastAttempt } from '../lib/inning';
import { useSound } from './useSound';

interface UseGameOptions {
  onGameComplete?: (results: IInningResult[]) => void;
}

export function useGame(settings: ISettings, options?: UseGameOptions) {
  const [secret, setSecret] = useState<number[]>(() => generateSecretDigits());
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

  function triggerErrorHaptic() {
    if (!settings.hapticsEnabled) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  function triggerSelectionHaptic() {
    if (!settings.hapticsEnabled) return;
    void Haptics.selectionAsync();
  }

  function triggerImpactHaptic() {
    if (!settings.hapticsEnabled) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function triggerSuccessHaptic() {
    if (!settings.hapticsEnabled) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  function triggerWarningHaptic() {
    if (!settings.hapticsEnabled) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  function finishGame(newInningResults: IInningResult[]) {
    setGameEndVisible(true);
    queueMicrotask(() => onGameCompleteRef.current?.(newInningResults));
  }

  function resetFullGame() {
    setSecret(generateSecretDigits());
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
  }

  function startNextInning() {
    setSecret(generateSecretDigits());
    setCurrentGuess([]);
    setAttempts([]);
    setLastStrikeMask(null);
    setInningEndVisible(false);
    setIsScoring(false);
    setHasUsedUndoThisInning(false);
    setInning((prev) => prev + 1);
  }

  function pushDigit(d: number) {
    if (isInputLocked) return;
    if (currentGuess.length >= DIGIT_COUNT) return;
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
    setAttempts(result.newAttempts);
    setLastStrikeMask(null);
    setHasUsedUndoThisInning(true);
  }

  function submitGuess() {
    if (isInputLocked) return;

    if (!isValidGuessDigits(currentGuess)) {
      triggerErrorHaptic();
      setInvalidShakeTrigger((prev) => prev + 1);
      return;
    }

    triggerImpactHaptic();

    const submitResult = submitGuessReducer({
      inning,
      attempts,
      outsThisInning,
      guess: currentGuess,
      secret,
      attemptId: makeId(),
    });

    setLastStrikeMask(submitResult.lastStrikeMask);
    setAttempts(submitResult.newAttempts);
    setCurrentGuess([]);
    setHasUsedUndoThisInning(false);

    const { score } = submitResult.attempt;
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

    void playCallSequence(score.strikes, score.balls, score.outs).finally(() => setIsScoring(false));
  }

  return {
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
