import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AttemptRow } from '../components/AttemptRow';
import { GameEndModal } from '../components/GameEndModal';
import { GuessBoxes } from '../components/GuessBoxes';
import { InningEndModal } from '../components/InningEndModal';
import { InningScoreboard } from '../components/InningScoreboard';
import { Keypad } from '../components/Keypad';
import { ScreenHeader } from '../components/ScreenHeader';
import { TOTAL_INNINGS } from '../constants/game';
import type { useGame } from '../hooks/useGame';
import { DIGIT_COUNT } from '../lib/game';
import { colors, radius, spacing } from '../theme';
import { formatOrdinal } from '../utils/format';

type GameState = ReturnType<typeof useGame>;

export function GameScreen({
  game,
  isNewBest,
  onHome,
}: {
  game: GameState;
  isNewBest: boolean;
  onHome: () => void;
}) {
  const { t, i18n } = useTranslation();
  const language = i18n.language === 'ko' ? 'ko' : 'en';

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
    isInputLocked,
    invalidShakeTrigger,
    canUndo,
    resetFullGame,
    startNextInning,
    pushDigit,
    popDigit,
    submitGuess,
    undoLastAttempt,
  } = game;

  const guessComplete = currentGuess.length === DIGIT_COUNT;
  const runsScored = inningResults.filter((result) => result.scored).length;
  const isPerfectGame = gameEndVisible && runsScored === TOTAL_INNINGS;
  const remainingDigits = DIGIT_COUNT - currentGuess.length;

  const helperText = isInputLocked
    ? t('game.scoringGuess')
    : guessComplete
      ? t('game.tapEnter')
      : t('game.enterMore', { count: remainingDigits });

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={`${formatOrdinal(inning, language)} ▲`}
        onLeft={onHome}
        leftLabel={t('common.home')}
        leftStyle={styles.headerBlue}
        leftTextStyle={styles.headerTextOnColor}
        onRight={() => {
          Alert.alert(t('game.restartTitle'), t('game.restartMessage'), [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('game.restart'), style: 'destructive', onPress: resetFullGame },
          ]);
        }}
        rightLabel={t('game.restart')}
        rightStyle={styles.headerGreen}
        rightTextStyle={styles.headerTextOnColor}
      />

      <View style={styles.gameTop}>
        <InningScoreboard inning={inning} inningResults={inningResults} outsThisInning={outsThisInning} />
        <GuessBoxes
          currentGuess={currentGuess}
          lastStrikeMask={lastStrikeMask}
          inningEndVisible={inningEndVisible}
          gameEndVisible={gameEndVisible}
          shakeTrigger={invalidShakeTrigger}
        />
        <Text style={styles.helperText}>{helperText}</Text>
        {canUndo ? (
          <Pressable onPress={undoLastAttempt} style={styles.undoButton}>
            <Text style={styles.undoText}>{t('game.undoLastGuess')}</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView style={styles.history} contentContainerStyle={styles.historyContent}>
        {attempts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>{t('game.noAttempts')}</Text>
          </View>
        ) : (
          attempts.map((attempt, index) => (
            <AttemptRow
              key={attempt.id}
              attempt={attempt}
              index={index}
              totalAttempts={attempts.length}
            />
          ))
        )}
      </ScrollView>

      <Keypad
        currentGuess={currentGuess}
        isInputLocked={isInputLocked}
        onPushDigit={pushDigit}
        onPopDigit={popDigit}
        onSubmit={submitGuess}
      />

      <InningEndModal
        visible={inningEndVisible}
        lastInningScored={lastInningScored}
        attemptsCount={attempts.length}
        secretPreview={secretPreview}
        inning={inning}
        onNextInning={startNextInning}
      />

      <GameEndModal
        visible={gameEndVisible}
        inningResults={inningResults}
        isPerfectGame={isPerfectGame}
        isNewBest={isNewBest}
        onHome={() => {
          resetFullGame();
          onHome();
        }}
        onPlayAgain={resetFullGame}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  headerBlue: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  headerGreen: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  headerTextOnColor: {
    color: '#FFFFFF',
  },
  gameTop: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  helperText: {
    textAlign: 'center',
    color: colors.textMuted,
    fontWeight: '700',
    fontSize: 13,
  },
  undoButton: {
    alignSelf: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  undoText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 13,
  },
  history: {
    flex: 1,
    marginTop: spacing.sm,
  },
  historyContent: {
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    color: colors.textMuted,
    fontWeight: '700',
  },
});
