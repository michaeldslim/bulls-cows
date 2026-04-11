import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

export function useSound() {
  const winSoundRef = useRef<Audio.Sound | null>(null);
  const loseSoundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (winSoundRef.current) {
        void winSoundRef.current.unloadAsync();
        winSoundRef.current = null;
      }
      if (loseSoundRef.current) {
        void loseSoundRef.current.unloadAsync();
        loseSoundRef.current = null;
      }
    };
  }, []);

  async function playWinSound() {
    try {
      if (winSoundRef.current) {
        await winSoundRef.current.unloadAsync();
        winSoundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync(
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('../../assets/sounds/tada.mp3'),
        { shouldPlay: true },
      );
      winSoundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          void sound.unloadAsync();
          if (winSoundRef.current === sound) winSoundRef.current = null;
        }
      });
    } catch {
      // ignore
    }
  }

  async function playLoseSound() {
    try {
      if (loseSoundRef.current) {
        await loseSoundRef.current.unloadAsync();
        loseSoundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync(
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('../../assets/sounds/out.mp3'),
        { shouldPlay: true },
      );
      loseSoundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          void sound.unloadAsync();
          if (loseSoundRef.current === sound) loseSoundRef.current = null;
        }
      });
    } catch {
      // ignore
    }
  }

  return { playWinSound, playLoseSound };
}
