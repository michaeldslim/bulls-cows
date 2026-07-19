import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import appConfig from '../../app.json';

import type { DigitCount, GameInnings, ISettings } from '../../types';
import { LanguageSettingsRow, SettingsChipRow, SettingsRow } from '../components/SettingsRow';
import { ScreenHeader } from '../components/ScreenHeader';
import { MAX_CONTENT_WIDTH } from '../constants/game';
import { previewHapticFeedback } from '../lib/haptics';
import { radius, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';

export function SettingsScreen({
  settings,
  onUpdateSettings,
  onBack,
}: {
  settings: ISettings;
  onUpdateSettings: (patch: Partial<ISettings>) => void;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const appVersion = appConfig.expo.version;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={t('settings.title')}
        onLeft={onBack}
        leftLabel={t('common.back')}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <LanguageSettingsRow
            label={t('settings.language')}
            language={settings.language}
            onChange={(language) => onUpdateSettings({ language })}
          />
          <SettingsChipRow<DigitCount>
            label={t('settings.digitCount')}
            value={settings.digitCount}
            options={[
              { value: 3, label: t('settings.digits3') },
              { value: 4, label: t('settings.digits4') },
            ]}
            onChange={(digitCount) => onUpdateSettings({ digitCount })}
          />
          <SettingsChipRow<GameInnings>
            label={t('settings.innings')}
            value={settings.totalInnings}
            options={[
              { value: 6, label: t('settings.innings6') },
              { value: 9, label: t('settings.innings9') },
            ]}
            onChange={(totalInnings) => onUpdateSettings({ totalInnings })}
          />
          <SettingsRow
            label={t('settings.soundEffect')}
            value={settings.soundEnabled}
            onValueChange={(soundEnabled) => onUpdateSettings({ soundEnabled })}
          />
          <SettingsRow
            label={t('settings.hapticFeedback')}
            value={settings.hapticsEnabled}
            onValueChange={(hapticsEnabled) => {
              onUpdateSettings({ hapticsEnabled });
              if (hapticsEnabled) previewHapticFeedback();
            }}
          />
        </View>

        {appVersion ? (
          <Text style={styles.version}>
            {t('settings.version', { version: appVersion })}
          </Text>
        ) : null}
      </ScrollView>
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
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.sm,
    },
    version: {
      marginTop: spacing.sm,
      textAlign: 'center',
      fontSize: 13,
      color: colors.textFaint,
    },
  });
}
