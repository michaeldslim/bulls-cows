import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { DIGIT_COUNT } from '../lib/game';
import { colors, radius, spacing } from '../theme';

export function GuessBoxes({
  currentGuess,
  lastStrikeMask,
  inningEndVisible,
  gameEndVisible,
  shakeTrigger,
}: {
  currentGuess: number[];
  lastStrikeMask: boolean[] | null;
  inningEndVisible: boolean;
  gameEndVisible: boolean;
  shakeTrigger: number;
}) {
  const shakeAnim = useRef(new Animated.Value(0)).current;

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
      {Array.from({ length: DIGIT_COUNT }, (_, i) => {
        const val = currentGuess[i];
        const activeIndex = currentGuess.length;
        const showStrikes =
          !inningEndVisible && !gameEndVisible && currentGuess.length === 0 && lastStrikeMask !== null;
        const isStrike = showStrikes ? Boolean(lastStrikeMask?.[i]) : false;
        const isActive =
          !inningEndVisible &&
          !gameEndVisible &&
          !showStrikes &&
          activeIndex < DIGIT_COUNT &&
          i === activeIndex;

        return (
          <View
            key={i}
            style={[styles.box, isStrike ? styles.strike : undefined, isActive ? styles.active : undefined]}
          >
            <Text style={styles.text}>{val === undefined ? '' : String(val)}</Text>
          </View>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
  text: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
});
