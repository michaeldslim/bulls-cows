import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { DIGIT_COUNT } from '../lib/game';
import { spacing } from '../theme';
import { KeyButton } from './KeyButton';

type KeyConfig = {
  label: string;
  onPress: () => void;
  variant?: 'default' | 'action';
  digit?: number;
  isEnter?: boolean;
  isDel?: boolean;
};

export function Keypad({
  currentGuess,
  isInputLocked,
  onPushDigit,
  onPopDigit,
  onSubmit,
}: {
  currentGuess: number[];
  isInputLocked: boolean;
  onPushDigit: (digit: number) => void;
  onPopDigit: () => void;
  onSubmit: () => void;
}) {
  const { t } = useTranslation();
  const guessComplete = currentGuess.length === DIGIT_COUNT;

  const keyRows: KeyConfig[][] = [
    [
      { label: '1', onPress: () => onPushDigit(1), digit: 1 },
      { label: '2', onPress: () => onPushDigit(2), digit: 2 },
      { label: '3', onPress: () => onPushDigit(3), digit: 3 },
    ],
    [
      { label: '4', onPress: () => onPushDigit(4), digit: 4 },
      { label: '5', onPress: () => onPushDigit(5), digit: 5 },
      { label: '6', onPress: () => onPushDigit(6), digit: 6 },
    ],
    [
      { label: '7', onPress: () => onPushDigit(7), digit: 7 },
      { label: '8', onPress: () => onPushDigit(8), digit: 8 },
      { label: '9', onPress: () => onPushDigit(9), digit: 9 },
    ],
    [
      { label: t('game.del'), onPress: onPopDigit, variant: 'action', isDel: true },
      { label: '0', onPress: () => onPushDigit(0), digit: 0 },
      { label: t('game.enter'), onPress: onSubmit, variant: 'action', isEnter: true },
    ],
  ];

  return (
    <View style={styles.keypad}>
      {keyRows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => {
            const isDigitUsed = key.digit !== undefined && currentGuess.includes(key.digit);
            const isDelDisabled = key.isDel && currentGuess.length === 0;
            const isEnterDisabled = Boolean(key.isEnter) && !guessComplete;
            const isDisabled = isInputLocked || isDelDisabled || isEnterDisabled || isDigitUsed;

            return (
              <KeyButton
                key={key.label}
                label={key.label}
                onPress={key.onPress}
                variant={key.variant}
                disabled={isDisabled}
                used={isDigitUsed}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keypad: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
