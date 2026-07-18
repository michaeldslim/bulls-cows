import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { IInningResult } from '../../types';
import { OUTS_PER_INNING } from '../constants/game';
import { spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';

function AnimatedOutDot({ filled }: { filled: boolean }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createDotStyles(colors), [colors]);
  const scale = useRef(new Animated.Value(filled ? 1 : 0.6)).current;
  const opacity = useRef(new Animated.Value(filled ? 1 : 0.4)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: filled ? 1 : 0.6,
        useNativeDriver: true,
        friction: 6,
      }),
      Animated.timing(opacity, {
        toValue: filled ? 1 : 0.4,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [filled, scale, opacity]);

  return (
    <Animated.View
      style={[
        styles.outDot,
        filled ? styles.outDotFilled : undefined,
        { transform: [{ scale }], opacity },
      ]}
    />
  );
}

export function InningScoreboard({
  inning,
  totalInnings,
  inningResults,
  outsThisInning,
}: {
  inning: number;
  totalInnings: number;
  inningResults: IInningResult[];
  outsThisInning: number;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.bar}>
      <View style={styles.outDotsRow}>
        <Text style={styles.outLabel}>{t('common.outs')}</Text>
        <View style={styles.outDots}>
          {Array.from({ length: OUTS_PER_INNING }, (_, i) => (
            <AnimatedOutDot key={i} filled={i < outsThisInning} />
          ))}
        </View>
      </View>
      <View style={styles.scoreboard}>
        <View style={styles.gridRow}>
          {Array.from({ length: totalInnings }, (_, i) => (
            <React.Fragment key={i}>
              <Text style={[styles.gridNum, inning === i + 1 ? styles.gridNumActive : undefined]}>
                {i + 1}
              </Text>
              {i < totalInnings - 1 ? <Text style={styles.gridSep}>|</Text> : null}
            </React.Fragment>
          ))}
        </View>
        <View style={styles.gridRow}>
          {Array.from({ length: totalInnings }, (_, i) => {
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
                {i < totalInnings - 1 ? <Text style={styles.gridSep}>|</Text> : null}
              </React.Fragment>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function createDotStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
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
  });
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
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
}
