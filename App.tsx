import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar as RNStatusBar,
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  type ViewStyle,
  View,
} from 'react-native';

import type { IAttempt } from './types';
import { DIGIT_COUNT, digitsToString } from './src/lib/game';
import { type Screen, TOTAL_INNINGS, OUTS_PER_INNING } from './src/constants/game';
import { useGame } from './src/hooks/useGame';
import { ordinal } from './src/utils/format';

function Pill({ text, variant }: { text: string; variant: 'neutral' | 'good' | 'bad' }) {
  return (
    <View
      style={[
        styles.pill,
        variant === 'good' ? styles.pillGood : undefined,
        variant === 'bad' ? styles.pillBad : undefined,
      ]}
    >
      <Text style={styles.pillText}>{text}</Text>
    </View>
  );
}

function PrimaryButton({
  label,
  onPress,
  style,
}: {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryButton, style, pressed && styles.pressed]}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function SecondaryButton({
  label,
  onPress,
  style,
}: {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.secondaryButton, style, pressed && styles.pressed]}
    >
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function KeyButton({
  label,
  onPress,
  variant,
}: {
  label: string;
  onPress: () => void;
  variant?: 'default' | 'action';
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.keyButton,
        variant === 'action' ? styles.keyButtonAction : undefined,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.keyButtonText, variant === 'action' ? styles.keyButtonTextAction : undefined]}>
        {label}
      </Text>
    </Pressable>
  );
}

function AttemptRow({
  attempt,
  index,
  totalAttempts,
}: {
  attempt: IAttempt;
  index: number;
  totalAttempts: number;
}) {
  const guessText = digitsToString(attempt.guess);
  const attemptNumber = totalAttempts - index;
  return (
    <View style={styles.attemptRow}>
      <Text style={styles.attemptIndex}>#{String(attemptNumber).padStart(2, '0')}</Text>
      <Text style={styles.attemptGuess}>{guessText}</Text>
      <View style={styles.attemptScore}>
        <Pill text={`${attempt.score.strikes}S`} variant={attempt.score.strikes > 0 ? 'good' : 'neutral'} />
        <Pill text={`${attempt.score.balls}B`} variant={attempt.score.balls > 0 ? 'good' : 'neutral'} />
        <Pill text={`${attempt.score.outs}O`} variant={attempt.score.outs > 0 ? 'bad' : 'neutral'} />
      </View>
    </View>
  );
}

function ScreenHeader({
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
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onLeft}
        disabled={!onLeft}
        style={({ pressed }) => [
          styles.headerButton,
          leftStyle,
          pressed && onLeft && styles.pressed,
          !onLeft && styles.disabled,
        ]}
      >
        <Text style={[styles.headerButtonText, leftTextStyle]}>{leftLabel ?? ''}</Text>
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      <Pressable
        onPress={onRight}
        disabled={!onRight}
        style={({ pressed }) => [
          styles.headerButton,
          rightStyle,
          pressed && onRight && styles.pressed,
          !onRight && styles.disabled,
        ]}
      >
        <Text style={[styles.headerButtonText, rightTextStyle]}>{rightLabel ?? ''}</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');

  const {
    secretPreview,
    currentGuess,
    attempts,
    inning,
    inningResults,
    outsThisInning,
    inningEndVisible,
    lastInningScored,
    gameEndVisible,
    lastStrikeMask,
    resetFullGame,
    startNextInning,
    pushDigit,
    popDigit,
    submitGuess,
  } = useGame();

  const keyRows: Array<Array<{ label: string; onPress: () => void; variant?: 'default' | 'action' }>> = [
    [
      { label: '1', onPress: () => pushDigit(1) },
      { label: '2', onPress: () => pushDigit(2) },
      { label: '3', onPress: () => pushDigit(3) },
    ],
    [
      { label: '4', onPress: () => pushDigit(4) },
      { label: '5', onPress: () => pushDigit(5) },
      { label: '6', onPress: () => pushDigit(6) },
    ],
    [
      { label: '7', onPress: () => pushDigit(7) },
      { label: '8', onPress: () => pushDigit(8) },
      { label: '9', onPress: () => pushDigit(9) },
    ],
    [
      { label: 'Del', onPress: popDigit, variant: 'action' },
      { label: '0', onPress: () => pushDigit(0) },
      { label: 'Enter', onPress: submitGuess, variant: 'action' },
    ],
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      {screen === 'home' ? (
        <View style={styles.screen}>
          <View style={styles.homeHero}>
            <Text style={styles.title}>Bulls & Cows</Text>
            <Text style={styles.subtitle}>Guess the secret 3-digit number</Text>
            <View style={styles.ruleRow}>
              <Pill text="3 digits" variant="neutral" />
              <Pill text="no duplicates" variant="neutral" />
              <Pill text="0 allowed" variant="neutral" />
            </View>
          </View>

          <ScrollView style={styles.howtoScroll} contentContainerStyle={styles.homeScrollContent}>
            <Text style={styles.howtoTitle}>Innings</Text>
            <View style={styles.howtoCard}>
              <Text style={styles.howtoText}>Play {TOTAL_INNINGS} innings — just like real baseball.</Text>
              <Text style={styles.howtoText}>Each inning has a brand new secret 3-digit number.</Text>
              <Text style={styles.howtoText}>Crack the secret before 3 outs to score a run!</Text>
              <Text style={styles.howtoText}>Hit 3 outs first — inning ends, no run scored.</Text>
            </View>

            <Text style={styles.howtoTitle}>Scoring</Text>
            <View style={styles.howtoCard}>
              <Text style={styles.howtoText}>Strike (S): correct digit in the correct position</Text>
              <Text style={styles.howtoText}>Ball (B): correct digit but wrong position</Text>
              <Text style={styles.howtoText}>Out (O): digit not in the secret — counts toward 3 outs</Text>
              <Text style={styles.howtoText}>3 Strikes = crack the code = score a run!</Text>
            </View>

            <Text style={styles.howtoTitle}>Example</Text>
            <View style={styles.howtoCard}>
              <Text style={styles.howtoText}>Secret: 123</Text>
              <Text style={styles.howtoText}>Guess: 134 → 1S 1B 1O  (1 out)</Text>
              <Text style={styles.howtoText}>Guess: 120 → 2S 0B 1O  (2 outs)</Text>
              <Text style={styles.howtoText}>Guess: 123 → 3S 0B 0O  → Run! ⚾</Text>
            </View>

            <Text style={styles.howtoTitle}>Win Condition</Text>
            <View style={styles.howtoCard}>
              <Text style={styles.howtoText}>Score as many runs as possible across all {TOTAL_INNINGS} innings.</Text>
              <Text style={styles.howtoText}>Perfect game = {TOTAL_INNINGS} runs!</Text>
            </View>
          </ScrollView>

          <View style={styles.homeButtons}>
            <PrimaryButton
              label="Start Game"
              onPress={() => {
                resetFullGame();
                setScreen('game');
              }}
            />
          </View>
        </View>
      ) : null}

      {screen === 'game' ? (
        <View style={styles.screen}>
          <ScreenHeader
            title={`${ordinal(inning)} ▲`}
            onLeft={() => setScreen('home')}
            leftLabel="Home"
            leftStyle={styles.headerButtonBlue}
            leftTextStyle={styles.headerButtonTextOnColor}
            onRight={() => {
              Alert.alert('Restart game?', 'This will reset all innings.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Restart', style: 'destructive', onPress: resetFullGame },
              ]);
            }}
            rightLabel="Restart"
            rightStyle={styles.headerButtonGreen}
            rightTextStyle={styles.headerButtonTextOnColor}
          />

          <View style={styles.gameTop}>
            <View style={styles.inningBar}>
              <View style={styles.outDotsRow}>
                <Text style={styles.outLabel}>Outs</Text>
                <View style={styles.outDots}>
                  {Array.from({ length: OUTS_PER_INNING }, (_, i) => (
                    <View key={i} style={[styles.outDot, i < outsThisInning ? styles.outDotFilled : undefined]} />
                  ))}
                </View>
              </View>
              <View style={styles.inningScoreboard}>
                <View style={styles.inningGridRow}>
                  {Array.from({ length: TOTAL_INNINGS }, (_, i) => (
                    <React.Fragment key={i}>
                      <Text style={[styles.inningGridNum, inning === i + 1 ? styles.inningGridNumActive : undefined]}>
                        {i + 1}
                      </Text>
                      {i < TOTAL_INNINGS - 1 ? <Text style={styles.inningGridSep}>|</Text> : null}
                    </React.Fragment>
                  ))}
                </View>
                <View style={styles.inningGridRow}>
                  {Array.from({ length: TOTAL_INNINGS }, (_, i) => {
                    const result = inningResults.find((r) => r.inning === i + 1);
                    return (
                      <React.Fragment key={i}>
                        <Text style={[styles.inningGridMark, result ? (result.scored ? styles.inningScoreMarkRun : styles.inningScoreMarkOut) : undefined]}>
                          {result ? (result.scored ? '⚾' : '✕') : ' '}
                        </Text>
                        {i < TOTAL_INNINGS - 1 ? <Text style={styles.inningGridSep}>|</Text> : null}
                      </React.Fragment>
                    );
                  })}
                </View>
              </View>
            </View>

            <View style={styles.guessBoxes}>
              {Array.from({ length: DIGIT_COUNT }, (_, i) => {
                const val = currentGuess[i];
                const activeIndex = currentGuess.length;
                const showStrikes =
                  !inningEndVisible && !gameEndVisible && currentGuess.length === 0 && lastStrikeMask !== null;
                const isStrike = showStrikes ? Boolean(lastStrikeMask?.[i]) : false;
                const isActive =
                  !inningEndVisible &&
                  !gameEndVisible &&
                  !showStrikes &&
                  activeIndex < DIGIT_COUNT &&
                  i === activeIndex;
                return (
                  <View
                    key={i}
                    style={[
                      styles.guessBox,
                      isStrike ? styles.guessBoxStrike : undefined,
                      isActive ? styles.guessBoxActive : undefined,
                    ]}
                  >
                    <Text style={styles.guessBoxText}>{val === undefined ? '' : String(val)}</Text>
                  </View>
                );
              })}
            </View>
            <Text style={styles.helperText}>Tap digits below. No duplicates.</Text>
          </View>

          <ScrollView style={styles.history} contentContainerStyle={styles.historyContent}>
            {attempts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No attempts yet.</Text>
              </View>
            ) : (
              attempts.map((a, idx) => (
                <AttemptRow key={a.id} attempt={a} index={idx} totalAttempts={attempts.length} />
              ))
            )}
          </ScrollView>

          <View style={styles.keypad}>
            {keyRows.map((row, rIdx) => (
              <View key={rIdx} style={styles.keyRow}>
                {row.map((k) => (
                  <KeyButton key={k.label} label={k.label} onPress={k.onPress} variant={k.variant} />
                ))}
              </View>
            ))}
          </View>

          <Modal visible={inningEndVisible} transparent animationType="fade" onRequestClose={() => {}}>
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>
                  {lastInningScored ? '⚾ Run Scored!' : '3 Outs — Inning Over'}
                </Text>
                {lastInningScored ? (
                  <Text style={styles.modalText}>
                    You got it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!
                  </Text>
                ) : (
                  <Text style={styles.modalText}>Secret was: {secretPreview}</Text>
                )}
                <Text style={styles.modalText}>{ordinal(inning + 1)} inning up next</Text>
                <PrimaryButton label="Next Inning →" onPress={startNextInning} />
              </View>
            </View>
          </Modal>

          <Modal visible={gameEndVisible} transparent animationType="fade" onRequestClose={() => {}}>
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>Full Game Done!</Text>
                <View style={styles.scoreboardRows}>
                  {inningResults.map((r) => (
                    <View key={r.inning} style={styles.scoreboardRow}>
                      <Text style={styles.scoreboardInning}>{ordinal(r.inning)} Inning</Text>
                      <Text style={[styles.scoreboardResult, r.scored ? styles.scoreboardRun : styles.scoreboardOut]}>
                        {r.scored ? '⚾ Run' : '✕ No Run'}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.scoreTotal}>
                  {inningResults.filter((r) => r.scored).length} / {TOTAL_INNINGS} runs scored
                </Text>
                <View style={styles.modalButtons}>
                  <SecondaryButton
                    label="Home"
                    style={styles.modalButton}
                    onPress={() => {
                      resetFullGame();
                      setScreen('home');
                    }}
                  />
                  <PrimaryButton
                    label="Play Again"
                    style={styles.modalButton}
                    onPress={resetFullGame}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 0 : 0,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  homeHero: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 4,
  },
  howtoScroll: {
    flex: 1,
  },
  homeScrollContent: {
    paddingTop: 10,
    gap: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  ruleRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  attemptCounter: {
    textAlign: 'center',
    color: '#111827',
    fontWeight: '900',
  },
  homeButtons: {
    gap: 10,
    paddingBottom: 34,
  },
  primaryButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  headerButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 92,
    alignItems: 'center',
  },
  headerButtonText: {
    fontWeight: '800',
    fontSize: 16,
    color: '#111827',
  },
  headerButtonBlue: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },
  headerButtonGreen: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  headerButtonNarrow: {
    minWidth: 68,
    paddingHorizontal: 10,
  },
  headerButtonTextOnColor: {
    color: '#FFFFFF',
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  pillGood: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  pillBad: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  pillText: {
    color: '#111827',
    fontWeight: '800',
    fontSize: 13,
  },
  howtoContent: {
    paddingTop: 10,
    gap: 12,
  },
  howtoTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  howtoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  howtoText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
  },
  gameTop: {
    gap: 6,
    paddingBottom: 6,
  },
  guessBoxes: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    paddingTop: 2,
  },
  guessBox: {
    width: 74,
    height: 80,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guessBoxActive: {
    borderColor: '#FACC15',
    borderWidth: 3,
    backgroundColor: '#FFFBEB',
  },
  guessBoxStrike: {
    borderColor: '#38BDF8',
    borderWidth: 3,
    backgroundColor: '#F0F9FF',
  },
  guessBoxText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111827',
    fontVariant: ['tabular-nums'],
  },
  helperText: {
    textAlign: 'center',
    color: '#6B7280',
    fontWeight: '700',
    fontSize: 13,
  },
  history: {
    flex: 1,
    marginTop: 6,
  },
  historyContent: {
    paddingBottom: 10,
    gap: 10,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#6B7280',
    fontWeight: '700',
  },
  attemptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 12,
  },
  attemptIndex: {
    width: 40,
    color: '#6B7280',
    fontWeight: '900',
  },
  attemptGuess: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
    width: 70,
  },
  attemptScore: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  keypad: {
    gap: 6,
    paddingTop: 6,
    paddingBottom: 40,
  },
  keyRow: {
    flexDirection: 'row',
    gap: 6,
  },
  keyButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 8,
    alignItems: 'center',
  },
  keyButtonAction: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  keyButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  keyButtonTextAction: {
    color: '#FFFFFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },
  modalText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4B5563',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
  },
  secretHintArea: {
    paddingVertical: 6,
  },
  secretHintText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontWeight: '700',
    fontSize: 12,
  },
  inningBar: {
    flexDirection: 'column',
    gap: 6,
    paddingVertical: 6,
  },
  inningScoreboard: {
    gap: 2,
  },
  inningGridRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inningGridNum: {
    width: 26,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  inningGridNumActive: {
    color: '#1D4ED8',
    fontWeight: '900',
  },
  inningGridSep: {
    width: 8,
    textAlign: 'center',
    color: '#D1D5DB',
    fontSize: 11,
  },
  inningGridMark: {
    width: 26,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '800',
  },
  outDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  outLabel: {
    fontWeight: '800',
    color: '#6B7280',
    fontSize: 13,
  },
  outDots: {
    flexDirection: 'row',
    gap: 6,
  },
  outDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
  },
  outDotFilled: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  inningScoreRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  inningScoreMark: {
    fontSize: 18,
    fontWeight: '800',
  },
  inningScoreMarkRun: {
    color: '#16A34A',
  },
  inningScoreMarkOut: {
    color: '#9CA3AF',
  },
  scoreboardRows: {
    gap: 8,
    paddingVertical: 4,
  },
  scoreboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  scoreboardInning: {
    fontWeight: '800',
    color: '#111827',
    fontSize: 15,
  },
  scoreboardResult: {
    fontWeight: '800',
    fontSize: 15,
  },
  scoreboardRun: {
    color: '#16A34A',
  },
  scoreboardOut: {
    color: '#9CA3AF',
  },
  scoreTotal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    paddingTop: 4,
  },
});
