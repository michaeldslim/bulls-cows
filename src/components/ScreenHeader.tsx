import { useMemo } from 'react';
import { Pressable, type StyleProp, StyleSheet, Text, type TextStyle, type ViewStyle, View } from 'react-native';

import { radius } from '../theme';
import { useTheme } from '../theme/ThemeContext';

export function ScreenHeader({
  title,
  onLeft,
  leftLabel,
  leftStyle,
  leftTextStyle,
  onRight,
  rightLabel,
  rightStyle,
  rightTextStyle,
}: {
  title: string;
  onLeft?: () => void;
  leftLabel?: string;
  leftStyle?: StyleProp<ViewStyle>;
  leftTextStyle?: StyleProp<TextStyle>;
  onRight?: () => void;
  rightLabel?: string;
  rightStyle?: StyleProp<ViewStyle>;
  rightTextStyle?: StyleProp<TextStyle>;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.header}>
      <Pressable
        onPress={onLeft}
        disabled={!onLeft}
        style={({ pressed }) => [
          styles.button,
          leftStyle,
          pressed && onLeft && styles.pressed,
          !onLeft && styles.hidden,
        ]}
      >
        <Text style={[styles.buttonText, leftTextStyle]}>{leftLabel ?? ''}</Text>
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <Pressable
        onPress={onRight}
        disabled={!onRight}
        style={({ pressed }) => [
          styles.button,
          rightStyle,
          pressed && onRight && styles.pressed,
          !onRight && styles.hidden,
        ]}
      >
        <Text style={[styles.buttonText, rightTextStyle]}>{rightLabel ?? ''}</Text>
      </Pressable>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 6,
      paddingBottom: 6,
    },
    title: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: radius.sm,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      minWidth: 92,
      alignItems: 'center',
    },
    buttonText: {
      fontWeight: '800',
      fontSize: 16,
      color: colors.text,
    },
    pressed: {
      opacity: 0.85,
    },
    hidden: {
      opacity: 0,
    },
  });
}
