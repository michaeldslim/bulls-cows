import { useEffect, useMemo, useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { IInningResult } from '../../types';
import { radius, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { formatInningLabel } from '../utils/format';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

export function GameEndModal({
  visible,
  totalInnings,
  inningResults,
  isPerfectGame,
  isNewBest,
  onHome,
  onPlayAgain,
}: {
  visible: boolean;
  totalInnings: number;
  inningResults: IInningResult[];
  isPerfectGame: boolean;
  isNewBest: boolean;
  onHome: () => void;
  onPlayAgain: () => void;
}) {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const language = i18n.language === 'ko' ? 'ko' : 'en';
  const runsScored = inningResults.filter((result) => result.scored).length;
  const scale = useRef(new Animated.Value(0.92)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    scale.setValue(0.92);
    opacity.setValue(0);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 7 }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [visible, scale, opacity]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => {}}>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.card, { transform: [{ scale }], opacity }]}>
          <Text style={styles.title}>
            {isPerfectGame ? t('gameEnd.perfectGame') : t('gameEnd.fullGameDone')}
          </Text>
          {isPerfectGame ? (
            <Text style={styles.text}>
              {t('gameEnd.perfectMessage', { count: totalInnings })}
            </Text>
          ) : null}
          {isNewBest ? <Text style={styles.highlight}>{t('gameEnd.newBest')}</Text> : null}
          <View style={styles.rows}>
            {inningResults.map((result) => (
              <View key={result.inning} style={styles.row}>
                <Text style={styles.inning}>
                  {t('gameEnd.inningLabel', {
                    label: formatInningLabel(result.inning, language),
                  })}
                </Text>
                <Text style={[styles.result, result.scored ? styles.run : styles.out]}>
                  {result.scored ? t('common.run') : t('common.noRun')}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.total}>
            {t('gameEnd.runsScored', { runs: runsScored, total: totalInnings })}
          </Text>
          <View style={styles.buttons}>
            <SecondaryButton label={t('common.home')} style={styles.button} onPress={onHome} />
            <PrimaryButton label={t('gameEnd.playAgain')} style={styles.button} onPress={onPlayAgain} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: colors.modalBackdrop,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    card: {
      width: '100%',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.xl,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.md,
    },
    title: {
      fontSize: 22,
      fontWeight: '900',
      color: colors.text,
    },
    text: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    highlight: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.primary,
      textAlign: 'center',
    },
    rows: {
      gap: spacing.md,
      paddingVertical: spacing.xs,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    inning: {
      fontWeight: '800',
      color: colors.text,
      fontSize: 15,
    },
    result: {
      fontWeight: '800',
      fontSize: 15,
    },
    run: {
      color: colors.success,
    },
    out: {
      color: colors.textFaint,
    },
    total: {
      fontSize: 20,
      fontWeight: '900',
      color: colors.text,
      textAlign: 'center',
      paddingTop: spacing.xs,
    },
    buttons: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    button: {
      flex: 1,
    },
  });
}
