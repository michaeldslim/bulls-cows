import { Alert, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { AttemptRow } from '../components/AttemptRow';
import { GameEndModal } from '../components/GameEndModal';
import { GuessBoxes } from '../components/GuessBoxes';
import { InningEndModal } from '../components/InningEndModal';
import { InningScoreboard } from '../components/InningScoreboard';
import { Keypad } from '../components/Keypad';
import { Pill } from '../components/Pill';
import { ScreenHeader } from '../components/ScreenHeader';
import { HINT_AFTER_ATTEMPTS as HINT_THRESHOLD, MAX_CONTENT_WIDTH, TABLET_BREAKPOINT } from '../constants/game';
import { useOnboarding } from '../hooks/useOnboarding';
import type { useGame } from '../hooks/useGame';
import { radius, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
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
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height && width >= TABLET_BREAKPOINT;
  const { showHowToPlay, dismissHowToPlay, toggleHowToPlay } = useOnboarding();
  const language = i18n.language === 'ko' ? 'ko' : 'en';

  const {
    gameMode,
    digitCount,
    totalInnings,
    dailyDateKey,
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
    hintReveals,
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

  useEffect(() => {
    if (showHowToPlay && currentGuess.length === 1) {
      dismissHowToPlay();
    }
  }, [showHowToPlay, currentGuess.length, dismissHowToPlay]);

  const guessComplete = currentGuess.length === digitCount;
  const runsScored = inningResults.filter((result) => result.scored).length;
  const isPerfectGame = gameEndVisible && runsScored === totalInnings;
  const remainingDigits = digitCount - currentGuess.length;
  const latestHint = hintReveals[hintReveals.length - 1];

  const helperText = isInputLocked
    ? t('game.scoringGuess')
    : guessComplete
      ? t('game.tapEnter')
      : t('game.enterMore', { count: remainingDigits });

  const howToPlayLines = [
    t('game.howToPlayGuess', { count: digitCount }),
    t('game.howToPlayZero'),
    t('game.howToPlayStrike'),
    t('game.howToPlayBall'),
    t('game.howToPlayOut'),
    t('game.howToPlayInningEnd'),
    t('game.howToPlayHint', { hintAfter: HINT_THRESHOLD }),
  ];

  const scoreboard = (
    <InningScoreboard
      inning={inning}
      totalInnings={totalInnings}
      inningResults={inningResults}
      outsThisInning={outsThisInning}
    />
  );

  const gameMain = (
    <>
      <GuessBoxes
        digitCount={digitCount}
        currentGuess={currentGuess}
        lastStrikeMask={lastStrikeMask}
        hintReveals={hintReveals}
        inningEndVisible={inningEndVisible}
        gameEndVisible={gameEndVisible}
        shakeTrigger={invalidShakeTrigger}
      />
      {latestHint ? (
        <Text style={styles.hintText}>
          {t('game.hintLabel', { position: latestHint.position + 1, digit: latestHint.digit })}
        </Text>
      ) : null}
      <Text style={styles.helperText}>{helperText}</Text>
      {canUndo ? (
        <Pressable onPress={undoLastAttempt} style={styles.undoButton}>
          <Text style={styles.undoText}>{t('game.undoLastGuess')}</Text>
        </Pressable>
      ) : null}
    </>
  );

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
            { text: t('game.restart'), style: 'destructive', onPress: () => resetFullGame(gameMode) },
          ]);
        }}
        rightLabel={t('game.restart')}
        rightStyle={styles.headerGreen}
        rightTextStyle={styles.headerTextOnColor}
      />

      {gameMode === 'daily' ? (
        <View style={styles.dailyBadgeRow}>
          <Pill text={t('game.dailyBadge', { date: dailyDateKey })} variant="good" />
        </View>
      ) : null}

      <Pressable onPress={toggleHowToPlay} style={styles.howToPlayToggle}>
        <Text style={styles.howToPlayTitle}>
          {t('game.howToPlay')} {showHowToPlay ? `(${t('common.hide')})` : `(${t('common.show')})`}
        </Text>
      </Pressable>
      {showHowToPlay ? (
        <View style={styles.howToPlayCard}>
          {howToPlayLines.map((line, index) => (
            <Text key={index} style={styles.howToPlayLine}>
              {line}
            </Text>
          ))}
          <Pressable onPress={dismissHowToPlay}>
            <Text style={styles.howToPlayDismiss}>{t('common.hide')}</Text>
          </Pressable>
        </View>
      ) : null}

      {isLandscape ? (
        <View style={styles.landscapeLayout}>
          <View style={styles.landscapeSidebar}>{scoreboard}</View>
          <View style={styles.landscapeMain}>
            <View style={styles.gameTop}>{gameMain}</View>
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
          </View>
        </View>
      ) : (
        <>
          <View style={styles.gameTop}>
            {scoreboard}
            {gameMain}
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
        </>
      )}

      <Keypad
        digitCount={digitCount}
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
        totalInnings={totalInnings}
        inningResults={inningResults}
        isPerfectGame={isPerfectGame}
        isNewBest={isNewBest}
        onHome={() => {
          resetFullGame(gameMode);
          onHome();
        }}
        onPlayAgain={() => resetFullGame(gameMode)}
      />
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
    headerBlue: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    headerGreen: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    headerTextOnColor: {
      color: colors.onPrimary,
    },
    dailyBadgeRow: {
      alignItems: 'center',
      paddingBottom: spacing.xs,
    },
    howToPlayToggle: {
      paddingVertical: spacing.xs,
    },
    howToPlayTitle: {
      fontWeight: '800',
      color: colors.primary,
      fontSize: 14,
    },
    howToPlayCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    howToPlayLine: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 20,
    },
    howToPlayDismiss: {
      color: colors.primary,
      fontWeight: '800',
      fontSize: 13,
      alignSelf: 'flex-end',
      paddingTop: spacing.xs,
    },
    landscapeLayout: {
      flex: 1,
      flexDirection: 'row',
      gap: spacing.lg,
    },
    landscapeSidebar: {
      width: 180,
      paddingTop: spacing.sm,
    },
    landscapeMain: {
      flex: 1,
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
    hintText: {
      textAlign: 'center',
      color: colors.hint,
      fontWeight: '800',
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
}
