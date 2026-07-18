import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const ONBOARDING_KEY = 'bulls-cows-onboarding-seen';

export function useOnboarding() {
  const [expanded, setExpanded] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
      setExpanded(value !== 'true');
      setLoaded(true);
    });
  }, []);

  const dismiss = useCallback(() => {
    setExpanded(false);
    void AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  }, []);

  const toggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return {
    showHowToPlay: expanded && loaded,
    dismissHowToPlay: dismiss,
    toggleHowToPlay: toggle,
    loaded,
  };
}
