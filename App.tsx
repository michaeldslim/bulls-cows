import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, SafeAreaView, StatusBar as RNStatusBar, StyleSheet } from 'react-native';

import './src/i18n';
import { type Screen } from './src/constants/game';
import type { GameMode } from './types';
import { useGame } from './src/hooks/useGame';
import { useSettings } from './src/hooks/useSettings';
import { useStats } from './src/hooks/useStats';
import { isNewBestRun } from './src/lib/stats';
import { GameScreen } from './src/screens/GameScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

function AppContent() {
  const [screen, setScreen] = useState<Screen>('home');
  const [isNewBest, setIsNewBest] = useState(false);
  const { settings, updateSettings } = useSettings();
  const { stats, recordGame, averageAttempts } = useStats();
  const { colors, isDark } = useTheme();

  const game = useGame(settings, {
    onGameComplete: (results) => {
      const runs = results.filter((result) => result.scored).length;
      setIsNewBest(isNewBestRun(stats, runs));
      recordGame(results);
    },
  });

  function startGame(mode: GameMode) {
    game.resetFullGame(mode);
    setIsNewBest(false);
    setScreen('game');
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {screen === 'home' ? (
        <HomeScreen
          stats={stats}
          averageAttempts={averageAttempts}
          settings={settings}
          onOpenSettings={() => setScreen('settings')}
          onStartGame={() => startGame('classic')}
          onStartDaily={() => startGame('daily')}
        />
      ) : screen === 'settings' ? (
        <SettingsScreen
          settings={settings}
          onUpdateSettings={updateSettings}
          onBack={() => setScreen('home')}
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

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 0 : 0,
  },
});
