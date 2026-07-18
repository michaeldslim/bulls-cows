import { StyleSheet, Text, View } from 'react-native';

import type { DigitResult, IAttempt } from '../../types';
import { colors, radius, spacing } from '../theme';
import { Pill } from './Pill';

function digitResultStyle(result: DigitResult) {
  if (result === 'strike') return styles.strike;
  if (result === 'ball') return styles.ball;
  return styles.out;
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
  const attemptNumber = totalAttempts - index;

  return (
    <View style={styles.row}>
      <Text style={styles.index}>#{String(attemptNumber).padStart(2, '0')}</Text>
      <View style={styles.guess}>
        {attempt.guess.map((digit, i) => (
          <Text key={i} style={[styles.digit, digitResultStyle(attempt.digitResults[i])]}>
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

const styles = StyleSheet.create({
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
  strike: {
    color: colors.success,
  },
  ball: {
    color: colors.warning,
  },
  out: {
    color: colors.textFaint,
  },
  score: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
});
