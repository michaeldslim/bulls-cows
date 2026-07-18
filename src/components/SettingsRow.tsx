import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import type { AppLanguage } from '../../types';
import { colors, radius, spacing } from '../theme';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
    paddingRight: 8,
  },
  chipGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 48,
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: colors.pill,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.primary,
  },
});

export function SettingsRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.switchOff, true: colors.switchOn }}
        thumbColor={value ? colors.primary : colors.switchThumb}
      />
    </View>
  );
}

export function LanguageSettingsRow({
  label,
  language,
  onChange,
}: {
  label: string;
  language: AppLanguage;
  onChange: (language: AppLanguage) => void;
}) {
  const options: AppLanguage[] = ['ko', 'en'];

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipGroup}>
        {options.map((lang) => {
          const active = language === lang;
          return (
            <Pressable
              key={lang}
              onPress={() => onChange(lang)}
              style={[styles.chip, active ? styles.chipActive : undefined]}
            >
              <Text style={[styles.chipText, active ? styles.chipTextActive : undefined]}>
                {lang.toUpperCase()}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
