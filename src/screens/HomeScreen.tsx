import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { ISettings, IStats } from '../../types';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { DEFAULT_TOTAL_INNINGS, MAX_CONTENT_WIDTH } from '../constants/game';
import { radius, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';

export function HomeScreen({
  stats,
  averageAttempts,
  settings,
  onOpenSettings,
  onStartGame,
  onStartDaily,
}: {
  stats: IStats;
  averageAttempts: number | null;
  settings: ISettings;
  onOpenSettings: () => void;
  onStartGame: () => void;
  onStartDaily: () => void;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{t('app.title')}</Text>
          <Pressable
            onPress={onOpenSettings}
            style={({ pressed }) => [styles.settingsButton, pressed && styles.settingsPressed]}
            accessibilityRole="button"
            accessibilityLabel={t('settings.open')}
          >
            <Ionicons name="settings-outline" size={26} color={colors.textMuted} />
          </Pressable>
        </View>
        <Text style={styles.subtitle}>{t('app.subtitle')}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {stats.gamesPlayed > 0 ? (
          <>
            <Text style={styles.sectionTitle}>{t('home.yourStats')}</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>
                {t('home.bestRuns', { runs: stats.bestRuns, total: DEFAULT_TOTAL_INNINGS })}
              </Text>
              <Text style={styles.cardText}>
                {t('home.perfectGames', { count: stats.perfectGames })}
              </Text>
              <Text style={styles.cardText}>
                {t('home.avgAttempts', {
                  value: averageAttempts === null ? t('common.emDash') : averageAttempts.toFixed(1),
                })}
              </Text>
              <Text style={styles.cardText}>
                {t('home.gamesPlayed', { count: stats.gamesPlayed })}
              </Text>
            </View>
          </>
        ) : null}

        <Text style={styles.sectionTitle}>{t('home.inningsTitle')}</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            {t('home.innings1', { count: settings.totalInnings })}
          </Text>
          <Text style={styles.cardText}>
            {t('home.innings2', { digitCount: settings.digitCount })}
          </Text>
          <Text style={styles.cardText}>{t('home.innings3')}</Text>
          <Text style={styles.cardText}>{t('home.innings4')}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t('home.scoringTitle')}</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>{t('home.scoring1')}</Text>
          <Text style={styles.cardText}>{t('home.scoring2')}</Text>
          <Text style={styles.cardText}>{t('home.scoring3')}</Text>
          <Text style={styles.cardText}>
            {t('home.scoring4', { count: settings.digitCount })}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>{t('home.exampleTitle')}</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>{t('home.example1')}</Text>
          <Text style={styles.cardText}>{t('home.example2')}</Text>
          <Text style={styles.cardText}>{t('home.example3')}</Text>
          <Text style={styles.cardText}>{t('home.example4')}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t('home.winTitle')}</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            {t('home.win1', { count: settings.totalInnings })}
          </Text>
          <Text style={styles.cardText}>
            {t('home.win2', { count: settings.totalInnings })}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttons}>
        <PrimaryButton label={t('home.startGame')} onPress={onStartGame} />
        <SecondaryButton label={t('home.dailyChallenge')} onPress={onStartDaily} />
        <Text style={styles.dailyHint}>{t('home.dailySubtitle')}</Text>
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl,
      maxWidth: MAX_CONTENT_WIDTH,
      width: '100%',
      alignSelf: 'center',
    },
    hero: {
      alignItems: 'center',
      paddingTop: spacing.md,
      paddingBottom: spacing.xl,
      gap: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginBottom: spacing.xs,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    title: {
      fontSize: 34,
      fontWeight: '800',
      color: colors.text,
    },
    settingsButton: {
      padding: spacing.xs,
      borderRadius: radius.sm,
    },
    settingsPressed: {
      opacity: 0.7,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: spacing.md,
      gap: spacing.lg,
      paddingBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '900',
      color: colors.text,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.sm,
    },
    cardText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '600',
    },
    buttons: {
      gap: spacing.md,
      paddingBottom: 34,
    },
    dailyHint: {
      textAlign: 'center',
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: '600',
    },
  });
}
