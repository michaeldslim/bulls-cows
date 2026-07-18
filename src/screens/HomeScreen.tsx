import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { ISettings, IStats } from '../../types';
import { Pill } from '../components/Pill';
import { LanguageSettingsRow, SettingsRow } from '../components/SettingsRow';
import { PrimaryButton } from '../components/PrimaryButton';
import { TOTAL_INNINGS } from '../constants/game';
import { colors, radius, spacing } from '../theme';

export function HomeScreen({
  stats,
  averageAttempts,
  settings,
  onUpdateSettings,
  onStartGame,
}: {
  stats: IStats;
  averageAttempts: number | null;
  settings: ISettings;
  onUpdateSettings: (patch: Partial<ISettings>) => void;
  onStartGame: () => void;
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.title}>{t('app.title')}</Text>
        <Text style={styles.subtitle}>{t('app.subtitle')}</Text>
        <View style={styles.ruleRow}>
          <Pill text={t('rules.threeDigits')} variant="neutral" />
          <Pill text={t('rules.noDuplicates')} variant="neutral" />
          <Pill text={t('rules.zeroAllowed')} variant="neutral" />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {stats.gamesPlayed > 0 ? (
          <>
            <Text style={styles.sectionTitle}>{t('home.yourStats')}</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>
                {t('home.bestRuns', { runs: stats.bestRuns, total: TOTAL_INNINGS })}
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
          <Text style={styles.cardText}>{t('home.innings1', { count: TOTAL_INNINGS })}</Text>
          <Text style={styles.cardText}>{t('home.innings2')}</Text>
          <Text style={styles.cardText}>{t('home.innings3')}</Text>
          <Text style={styles.cardText}>{t('home.innings4')}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t('home.scoringTitle')}</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>{t('home.scoring1')}</Text>
          <Text style={styles.cardText}>{t('home.scoring2')}</Text>
          <Text style={styles.cardText}>{t('home.scoring3')}</Text>
          <Text style={styles.cardText}>{t('home.scoring4')}</Text>
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
          <Text style={styles.cardText}>{t('home.win1', { count: TOTAL_INNINGS })}</Text>
          <Text style={styles.cardText}>{t('home.win2', { count: TOTAL_INNINGS })}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t('home.settingsTitle')}</Text>
        <View style={styles.card}>
          <LanguageSettingsRow
            label={t('home.language')}
            language={settings.language}
            onChange={(language) => onUpdateSettings({ language })}
          />
          <SettingsRow
            label={t('home.soundEffect')}
            value={settings.soundEnabled}
            onValueChange={(soundEnabled) => onUpdateSettings({ soundEnabled })}
          />
          <SettingsRow
            label={t('home.hapticFeedback')}
            value={settings.hapticsEnabled}
            onValueChange={(hapticsEnabled) => onUpdateSettings({ hapticsEnabled })}
          />
        </View>
      </ScrollView>

      <View style={styles.buttons}>
        <PrimaryButton label={t('home.startGame')} onPress={onStartGame} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.md,
    gap: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  ruleRow: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
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
});
