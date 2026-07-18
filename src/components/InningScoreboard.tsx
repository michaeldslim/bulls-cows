import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { IInningResult } from '../../types';
import { OUTS_PER_INNING, TOTAL_INNINGS } from '../constants/game';
import { colors, spacing } from '../theme';

export function InningScoreboard({
  inning,
  inningResults,
  outsThisInning,
}: {
  inning: number;
  inningResults: IInningResult[];
  outsThisInning: number;
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.bar}>
      <View style={styles.outDotsRow}>
        <Text style={styles.outLabel}>{t('common.outs')}</Text>
        <View style={styles.outDots}>
          {Array.from({ length: OUTS_PER_INNING }, (_, i) => (
            <View key={i} style={[styles.outDot, i < outsThisInning ? styles.outDotFilled : undefined]} />
          ))}
        </View>
      </View>
      <View style={styles.scoreboard}>
        <View style={styles.gridRow}>
          {Array.from({ length: TOTAL_INNINGS }, (_, i) => (
            <React.Fragment key={i}>
              <Text style={[styles.gridNum, inning === i + 1 ? styles.gridNumActive : undefined]}>
                {i + 1}
              </Text>
              {i < TOTAL_INNINGS - 1 ? <Text style={styles.gridSep}>|</Text> : null}
            </React.Fragment>
          ))}
        </View>
        <View style={styles.gridRow}>
          {Array.from({ length: TOTAL_INNINGS }, (_, i) => {
            const result = inningResults.find((r) => r.inning === i + 1);
            return (
              <React.Fragment key={i}>
                <Text
                  style={[
                    styles.gridMark,
                    result ? (result.scored ? styles.markRun : styles.markOut) : undefined,
                  ]}
                >
                  {result ? (result.scored ? '⚾' : '✕') : ' '}
                </Text>
                {i < TOTAL_INNINGS - 1 ? <Text style={styles.gridSep}>|</Text> : null}
              </React.Fragment>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'column',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  outDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  outLabel: {
    fontWeight: '800',
    color: colors.textMuted,
    fontSize: 13,
  },
  outDots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  outDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.gridSep,
    backgroundColor: 'transparent',
  },
  outDotFilled: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  scoreboard: {
    gap: 2,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridNum: {
    width: 26,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: colors.textFaint,
  },
  gridNumActive: {
    color: colors.primary,
    fontWeight: '900',
  },
  gridSep: {
    width: 8,
    textAlign: 'center',
    color: colors.gridSep,
    fontSize: 11,
  },
  gridMark: {
    width: 26,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '800',
  },
  markRun: {
    color: colors.success,
  },
  markOut: {
    color: colors.textFaint,
  },
});
