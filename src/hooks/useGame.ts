import { useMemo, useState } from 'react';
import * as Haptics from 'expo-haptics';

import type { IAttempt, IInningResult, ISettings } from '../../types';
import {
  classifyGuessDigits,
  DIGIT_COUNT,
  digitsToString,
  generateSecretDigits,
  isValidGuessDigits,
  makeId,
  scoreGuess,
} from '../lib/game';
import { TOTAL_INNINGS, OUTS_PER_INNING } from '../constants/game';
import { useSound } from './useSound';

export function useGame(settings: ISettings) {
  const [secret, setSecret] = useState<number[]>(() => generateSecretDigits());
  const [currentGuess, setCurrentGuess] = useState<number[]>([]);
  const [attempts, setAttempts] = useState<IAttempt[]>([]);
  const [inning, setInning] = useState(1);
  const [inningResults, setInningResults] = useState<IInningResult[]>([]);
  const [inningEndVisible, setInningEndVisible] = useState(false);
  const [lastInningScored, setLastInningScored] = useState(false);
  const [gameEndVisible, setGameEndVisible] = useState(false);
  const [lastStrikeMask, setLastStrikeMask] = useState<boolean[] | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [invalidShakeTrigger, setInvalidShakeTrigger] = useState(0);

  const { playWinSound, playLoseSound, playCallSequence } = useSound(settings.soundEnabled);

  const secretPreview = useMemo(() => digitsToString(secret), [secret]);

  const outsThisInning = useMemo(
    () => attempts.reduce((sum, a) => sum + a.score.outs, 0),
    [attempts],
  );

  const isInputLocked = inningEndVisible || gameEndVisible || isScoring;

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
  }

  function startNextInning() {
    setSecret(generateSecretDigits());
    setCurrentGuess([]);
    setAttempts([]);
    setLastStrikeMask(null);
    setInningEndVisible(false);
    setIsScoring(false);
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

  function submitGuess() {
    if (isInputLocked) return;

    if (!isValidGuessDigits(currentGuess)) {
      triggerErrorHaptic();
      setInvalidShakeTrigger((prev) => prev + 1);
      return;
    }

    triggerImpactHaptic();

    const score = scoreGuess(secret, currentGuess);
    const digitResults = classifyGuessDigits(secret, currentGuess);
    setLastStrikeMask(currentGuess.map((d, i) => d === secret[i]));
    const attempt: IAttempt = { id: makeId(), guess: currentGuess, score, digitResults };
    const newAttempts = [attempt, ...attempts];
    setAttempts(newAttempts);
    setCurrentGuess([]);

    const newOuts = outsThisInning + score.outs;
    const inningOver = newOuts >= OUTS_PER_INNING;

    setIsScoring(true);

    if (score.strikes === DIGIT_COUNT) {
      void playCallSequence(score.strikes, score.balls, score.outs).finally(() => setIsScoring(false));
      triggerSuccessHaptic();
      void playWinSound();
      setLastInningScored(true);
      const result: IInningResult = { inning, scored: true, attempts: newAttempts };
      setInningResults((prev) => [...prev, result]);
      if (inning >= TOTAL_INNINGS) {
        setGameEndVisible(true);
      } else {
        setInningEndVisible(true);
      }
      return;
    }

    if (inningOver) {
      triggerWarningHaptic();
      setLastInningScored(false);
      const result: IInningResult = { inning, scored: false, attempts: newAttempts };
      setInningResults((prev) => [...prev, result]);
      playCallSequence(score.strikes, score.balls, score.outs).then(() => {
        void playLoseSound();
        if (inning >= TOTAL_INNINGS) {
          setGameEndVisible(true);
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
    resetFullGame,
    startNextInning,
    pushDigit,
    popDigit,
    submitGuess,
  };
}
