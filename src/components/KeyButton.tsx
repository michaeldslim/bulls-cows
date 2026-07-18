import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius } from '../theme';

export function KeyButton({
  label,
  onPress,
  variant,
  disabled,
  used,
}: {
  label: string;
  onPress: () => void;
  variant?: 'default' | 'action';
  disabled?: boolean;
  used?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === 'action' ? styles.action : undefined,
        used ? styles.used : undefined,
        disabled ? styles.disabled : undefined,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === 'action' ? styles.textAction : undefined,
          used ? styles.textUsed : undefined,
          disabled && variant === 'action' ? styles.textDisabled : undefined,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    alignItems: 'center',
  },
  action: {
    backgroundColor: colors.keyAction,
    borderColor: colors.keyAction,
  },
  used: {
    backgroundColor: colors.keyUsed,
    borderColor: colors.border,
  },
  disabled: {
    opacity: 0.45,
  },
  text: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  textAction: {
    color: '#FFFFFF',
  },
  textUsed: {
    color: colors.textFaint,
  },
  textDisabled: {
    color: colors.textFaint,
  },
  pressed: {
    opacity: 0.85,
  },
});
