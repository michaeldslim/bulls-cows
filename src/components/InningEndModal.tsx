import { Modal, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors, radius, spacing } from '../theme';
import { formatInningLabel } from '../utils/format';
import { PrimaryButton } from './PrimaryButton';

export function InningEndModal({
  visible,
  lastInningScored,
  attemptsCount,
  secretPreview,
  inning,
  onNextInning,
}: {
  visible: boolean;
  lastInningScored: boolean;
  attemptsCount: number;
  secretPreview: string;
  inning: number;
  onNextInning: () => void;
}) {
  const { t, i18n } = useTranslation();
  const language = i18n.language === 'ko' ? 'ko' : 'en';
  const nextLabel =
    language === 'ko'
      ? formatInningLabel(inning + 1, language)
      : `${formatInningLabel(inning + 1, language)} up next`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => {}}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {lastInningScored ? t('inningEnd.runScored') : t('inningEnd.threeOuts')}
          </Text>
          {lastInningScored ? (
            <Text style={styles.text}>
              {t('inningEnd.gotItIn', { count: attemptsCount })}
            </Text>
          ) : (
            <Text style={styles.text}>{t('inningEnd.secretWas', { secret: secretPreview })}</Text>
          )}
          <Text style={styles.text}>{t('inningEnd.nextInning', { label: nextLabel })}</Text>
          <PrimaryButton label={t('inningEnd.nextInningButton')} onPress={onNextInning} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
});
