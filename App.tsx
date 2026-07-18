import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, SafeAreaView, StatusBar as RNStatusBar, StyleSheet } from 'react-native';

import './src/i18n';
import { type Screen } from './src/constants/game';
import { useGame } from './src/hooks/useGame';
import { useSettings } from './src/hooks/useSettings';
import { useStats } from './src/hooks/useStats';
import { isNewBestRun } from './src/lib/stats';
import { GameScreen } from './src/screens/GameScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { colors } from './src/theme';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [isNewBest, setIsNewBest] = useState(false);
  const { settings, updateSettings } = useSettings();
  const { stats, recordGame, averageAttempts } = useStats();

  const game = useGame(settings, {
    onGameComplete: (results) => {
      const runs = results.filter((result) => result.scored).length;
      setIsNewBest(isNewBestRun(stats, runs));
      recordGame(results);
    },
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      {screen === 'home' ? (
        <HomeScreen
          stats={stats}
          averageAttempts={averageAttempts}
          settings={settings}
          onUpdateSettings={updateSettings}
          onStartGame={() => {
            game.resetFullGame();
            setIsNewBest(false);
            setScreen('game');
          }}
        />
      ) : (
        <GameScreen
          game={game}
          isNewBest={isNewBest}
          onHome={() => setScreen('home')}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 0 : 0,
  },
});
