import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import type { IInningResult, IStats } from '../../types';
import {
  averageAttemptsPerScoredInning,
  DEFAULT_STATS,
  updateStatsAfterGame,
} from '../lib/stats';

const STATS_KEY = 'bulls-cows-stats';

export function useStats() {
  const [stats, setStats] = useState<IStats>(DEFAULT_STATS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void AsyncStorage.getItem(STATS_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Partial<IStats>;
          setStats({ ...DEFAULT_STATS, ...parsed });
        } catch {
          // ignore corrupt storage
        }
      }
      setLoaded(true);
    });
  }, []);

  const recordGame = useCallback((inningResults: IInningResult[]) => {
    setStats((prev) => {
      const next = updateStatsAfterGame(prev, inningResults);
      void AsyncStorage.setItem(STATS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { stats, loaded, recordGame, averageAttempts: averageAttemptsPerScoredInning(stats) };
}
