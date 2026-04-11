import { useMemo, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Alert } from 'react-native';

import type { IAttempt, IInningResult } from '../../types';
import {
  DIGIT_COUNT,
  digitsToString,
  generateSecretDigits,
  isValidGuessDigits,
  makeId,
  scoreGuess,
} from '../lib/game';
import { TOTAL_INNINGS, OUTS_PER_INNING } from '../constants/game';
import { useSound } from './useSound';

export function useGame() {
  const [secret, setSecret] = useState<number[]>(() => generateSecretDigits());
  const [currentGuess, setCurrentGuess] = useState<number[]>([]);
  const [attempts, setAttempts] = useState<IAttempt[]>([]);
  const [inning, setInning] = useState(1);
  const [inningResults, setInningResults] = useState<IInningResult[]>([]);
  const [inningEndVisible, setInningEndVisible] = useState(false);
  const [lastInningScored, setLastInningScored] = useState(false);
  const [gameEndVisible, setGameEndVisible] = useState(false);
  const [lastStrikeMask, setLastStrikeMask] = useState<boolean[] | null>(null);

  const { playWinSound, playLoseSound } = useSound();

  const secretPreview = useMemo(() => digitsToString(secret), [secret]);

  const outsThisInning = useMemo(
    () => attempts.reduce((sum, a) => sum + a.score.outs, 0),
    [attempts],
  );

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
  }

  function startNextInning() {
    setSecret(generateSecretDigits());
    setCurrentGuess([]);
    setAttempts([]);
    setLastStrikeMask(null);
    setInningEndVisible(false);
    setInning((prev) => prev + 1);
  }

  function pushDigit(d: number) {
    if (inningEndVisible || gameEndVisible) return;
    if (currentGuess.length >= DIGIT_COUNT) return;
    if (currentGuess.includes(d)) return;
    void Haptics.selectionAsync();
    setLastStrikeMask(null);
    setCurrentGuess((prev) => [...prev, d]);
  }

  function popDigit() {
    if (inningEndVisible || gameEndVisible) return;
    void Haptics.selectionAsync();
    setLastStrikeMask(null);
    setCurrentGuess((prev) => prev.slice(0, -1));
  }

  function submitGuess() {
    if (inningEndVisible || gameEndVisible) return;

    if (!isValidGuessDigits(currentGuess)) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Invalid guess', 'Enter 3 unique digits (0-9).');
      return;
    }

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const score = scoreGuess(secret, currentGuess);
    setLastStrikeMask(currentGuess.map((d, i) => d === secret[i]));
    const attempt: IAttempt = { id: makeId(), guess: currentGuess, score };
    const newAttempts = [attempt, ...attempts];
    setAttempts(newAttempts);
    setCurrentGuess([]);

    if (score.strikes === DIGIT_COUNT) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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

    const newOuts = outsThisInning + score.outs;
    if (newOuts >= OUTS_PER_INNING) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      void playLoseSound();
      setLastInningScored(false);
      const result: IInningResult = { inning, scored: false, attempts: newAttempts };
      setInningResults((prev) => [...prev, result]);
      if (inning >= TOTAL_INNINGS) {
        setGameEndVisible(true);
      } else {
        setInningEndVisible(true);
      }
    }
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
    resetFullGame,
    startNextInning,
    pushDigit,
    popDigit,
    submitGuess,
  };
}


