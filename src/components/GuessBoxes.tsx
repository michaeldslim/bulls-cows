import { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { IHintReveal } from '../../types';
import { radius, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';

export function GuessBoxes({
  digitCount,
  currentGuess,
  lastStrikeMask,
  hintReveals,
  inningEndVisible,
  gameEndVisible,
  shakeTrigger,
}: {
  digitCount: number;
  currentGuess: number[];
  lastStrikeMask: boolean[] | null;
  hintReveals: IHintReveal[];
  inningEndVisible: boolean;
  gameEndVisible: boolean;
  shakeTrigger: number;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const hintByPosition = useMemo(() => {
    const map = new Map<number, number>();
    hintReveals.forEach((hint) => map.set(hint.position, hint.digit));
    return map;
  }, [hintReveals]);

  useEffect(() => {
    if (shakeTrigger === 0) return;
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [shakeTrigger, shakeAnim]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: shakeAnim }] }]}>
      {Array.from({ length: digitCount }, (_, i) => {
        const val = currentGuess[i];
        const hintDigit = hintByPosition.get(i);
        const activeIndex = currentGuess.length;
        const showStrikes =
          !inningEndVisible && !gameEndVisible && currentGuess.length === 0 && lastStrikeMask !== null;
        const isStrike = showStrikes ? Boolean(lastStrikeMask?.[i]) : false;
        const isActive =
          !inningEndVisible &&
          !gameEndVisible &&
          !showStrikes &&
          activeIndex < digitCount &&
          i === activeIndex;
        const showHint = hintDigit !== undefined && val === undefined && !showStrikes;

        const accessibilityLabel = showHint
          ? t('a11y.guessBoxHint', { position: i + 1, digit: hintDigit })
          : isStrike
            ? t('a11y.guessBoxStrike', { position: i + 1 })
            : isActive
              ? t('a11y.guessBoxActive', { position: i + 1, total: digitCount })
              : t('a11y.guessBox', { position: i + 1, total: digitCount });

        return (
          <View
            key={i}
            accessible
            accessibilityLabel={accessibilityLabel}
            style={[
              styles.box,
              isStrike ? styles.strike : undefined,
              isActive ? styles.active : undefined,
              showHint ? styles.hint : undefined,
            ]}
          >
            <Text style={styles.text}>
              {val === undefined ? (showHint ? String(hintDigit) : '') : String(val)}
            </Text>
          </View>
        );
      })}
    </Animated.View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.lg,
      paddingTop: 2,
    },
    box: {
      width: 74,
      height: 80,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    active: {
      borderColor: colors.activeGuess,
      borderWidth: 3,
      backgroundColor: colors.activeGuessBg,
    },
    strike: {
      borderColor: colors.strike,
      borderWidth: 3,
      backgroundColor: colors.strikeBg,
    },
    hint: {
      borderColor: colors.hint,
      borderWidth: 2,
      borderStyle: 'dashed',
      backgroundColor: colors.hintBg,
    },
    text: {
      fontSize: 34,
      fontWeight: '900',
      color: colors.text,
      fontVariant: ['tabular-nums'],
    },
  });
}
