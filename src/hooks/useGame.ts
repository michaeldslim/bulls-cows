import { useMemo, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Alert } from 'react-native';

import type { IAttempt } from '../../types';
import {
  DIGIT_COUNT,
  digitsToString,
  generateSecretDigits,
  isValidGuessDigits,
  makeId,
  scoreGuess,
} from '../lib/game';
import { MAX_ATTEMPTS } from '../constants/game';
import { useSound } from './useSound';

export function useGame() {
  const [secret, setSecret] = useState<number[]>(() => generateSecretDigits());
  const [currentGuess, setCurrentGuess] = useState<number[]>([]);
  const [attempts, setAttempts] = useState<IAttempt[]>([]);
  const [winVisible, setWinVisible] = useState(false);
  const [gameOverVisible, setGameOverVisible] = useState(false);
  const [lastStrikeMask, setLastStrikeMask] = useState<boolean[] | null>(null);

  const { playWinSound, playLoseSound } = useSound();

  const secretPreview = useMemo(() => digitsToString(secret), [secret]);

  function resetGame() {
    setSecret(generateSecretDigits());
    setCurrentGuess([]);
    setAttempts([]);
    setWinVisible(false);
    setGameOverVisible(false);
    setLastStrikeMask(null);
  }

  function pushDigit(d: number) {
    if (winVisible || gameOverVisible) return;
    if (currentGuess.length >= DIGIT_COUNT) return;
    if (currentGuess.includes(d)) return;
    void Haptics.selectionAsync();
    setLastStrikeMask(null);
    setCurrentGuess((prev) => [...prev, d]);
  }

  function popDigit() {
    if (winVisible || gameOverVisible) return;
    void Haptics.selectionAsync();
    setLastStrikeMask(null);
    setCurrentGuess((prev) => prev.slice(0, -1));
  }

  function submitGuess() {
    if (winVisible || gameOverVisible) return;
    if (attempts.length >= MAX_ATTEMPTS) return;

    if (!isValidGuessDigits(currentGuess)) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Invalid guess', 'Enter 3 unique digits (0-9).');
      return;
    }

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const score = scoreGuess(secret, currentGuess);
    setLastStrikeMask(currentGuess.map((d, i) => d === secret[i]));
    const attempt: IAttempt = { id: makeId(), guess: currentGuess, score };
    setAttempts((prev) => [attempt, ...prev]);
    setCurrentGuess([]);

    if (score.strikes === DIGIT_COUNT) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      void playWinSound();
      setWinVisible(true);
      return;
    }

    if (attempts.length + 1 >= MAX_ATTEMPTS) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      void playLoseSound();
      setGameOverVisible(true);
    }
  }

  return {
    secret,
    secretPreview,
    currentGuess,
    attempts,
    winVisible,
    gameOverVisible,
    lastStrikeMask,
    setWinVisible,
    setGameOverVisible,
    resetGame,
    pushDigit,
    popDigit,
    submitGuess,
  };
}
