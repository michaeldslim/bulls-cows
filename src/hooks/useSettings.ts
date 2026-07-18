import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import type { ISettings } from '../../types';

const SETTINGS_KEY = 'bulls-cows-settings';

const DEFAULT_SETTINGS: ISettings = {
  soundEnabled: true,
  hapticsEnabled: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<ISettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void AsyncStorage.getItem(SETTINGS_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Partial<ISettings>;
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        } catch {
          // ignore corrupt storage
        }
      }
      setLoaded(true);
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<ISettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { settings, loaded, updateSettings };
}
