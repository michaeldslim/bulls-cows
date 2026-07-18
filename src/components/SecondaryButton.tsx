import { useMemo } from 'react';
import { Pressable, type StyleProp, StyleSheet, Text, type ViewStyle } from 'react-native';

import { radius } from '../theme';
import { useTheme } from '../theme/ThemeContext';

export function SecondaryButton({
  label,
  onPress,
  style,
}: {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    button: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      paddingVertical: 14,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    text: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '800',
    },
    pressed: {
      opacity: 0.85,
    },
  });
}
