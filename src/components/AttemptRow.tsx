import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { DigitResult, IAttempt } from '../../types';
import { radius, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { Pill } from './Pill';

function digitResultStyle(colors: ReturnType<typeof useTheme>['colors'], result: DigitResult) {
  if (result === 'strike') return { color: colors.success };
  if (result === 'ball') return { color: colors.warning };
  return { color: colors.textFaint };
}

export function AttemptRow({
  attempt,
  index,
  totalAttempts,
}: {
  attempt: IAttempt;
  index: number;
  totalAttempts: number;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const attemptNumber = totalAttempts - index;

  return (
    <View style={styles.row}>
      <Text style={styles.index}>#{String(attemptNumber).padStart(2, '0')}</Text>
      <View style={styles.guess}>
        {attempt.guess.map((digit, i) => (
          <Text key={i} style={[styles.digit, digitResultStyle(colors, attempt.digitResults[i])]}>
            {digit}
          </Text>
        ))}
      </View>
      <View style={styles.score}>
        <Pill text={`${attempt.score.strikes}S`} variant={attempt.score.strikes > 0 ? 'good' : 'neutral'} />
        <Pill text={`${attempt.score.balls}B`} variant={attempt.score.balls > 0 ? 'good' : 'neutral'} />
        <Pill text={`${attempt.score.outs}O`} variant={attempt.score.outs > 0 ? 'bad' : 'neutral'} />
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      padding: spacing.lg,
    },
    index: {
      width: 40,
      color: colors.textMuted,
      fontWeight: '900',
    },
    guess: {
      flexDirection: 'row',
      gap: spacing.xs,
      width: 70,
    },
    digit: {
      fontSize: 20,
      fontWeight: '900',
      fontVariant: ['tabular-nums'],
      width: 20,
      textAlign: 'center',
    },
    score: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: spacing.md,
    },
  });
}
