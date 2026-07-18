import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';

export function Pill({ text, variant }: { text: string; variant: 'neutral' | 'good' | 'bad' }) {
  return (
    <View
      style={[
        styles.pill,
        variant === 'good' ? styles.pillGood : undefined,
        variant === 'bad' ? styles.pillBad : undefined,
      ]}
    >
      <Text style={styles.pillText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.pill,
    borderWidth: 1,
    borderColor: colors.pillBorder,
  },
  pillGood: {
    backgroundColor: colors.pillGood,
    borderColor: colors.pillGoodBorder,
  },
  pillBad: {
    backgroundColor: colors.pillBad,
    borderColor: colors.pillBadBorder,
  },
  pillText: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 13,
  },
});
