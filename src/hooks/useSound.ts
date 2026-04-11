import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const SOUND_WIN = require('../../assets/sounds/tada.mp3');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const SOUND_LOSE = require('../../assets/sounds/inning-over.mp3');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const SOUNDS_STRIKES: Record<number, unknown> = {
  1: require('../../assets/sounds/one-strike.mp3'),
  2: require('../../assets/sounds/two-strikes.mp3'),
  3: require('../../assets/sounds/three-strikes.mp3'),
};
// eslint-disable-next-line @typescript-eslint/no-require-imports
const SOUNDS_BALLS: Record<number, unknown> = {
  1: require('../../assets/sounds/one-ball.mp3'),
  2: require('../../assets/sounds/two-balls.mp3'),
  3: require('../../assets/sounds/three-balls.mp3'),
};
// eslint-disable-next-line @typescript-eslint/no-require-imports
const SOUNDS_OUTS: Record<number, unknown> = {
  1: require('../../assets/sounds/one-out.mp3'),
  2: require('../../assets/sounds/two-outs.mp3'),
  3: require('../../assets/sounds/three-outs.mp3'),
};

async function playOnce(
  ref: React.MutableRefObject<Audio.Sound | null>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: any,
) {
  try {
    if (ref.current) {
      await ref.current.unloadAsync();
      ref.current = null;
    }
    const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true });
    ref.current = sound;
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;
      if (status.didJustFinish) {
        void sound.unloadAsync();
        if (ref.current === sound) ref.current = null;
      }
    });
  } catch {
    // ignore
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function playOneShot(source: unknown): Promise<void> {
  return new Promise((resolve) => {
    Audio.Sound.createAsync(source, { shouldPlay: false })
      .then(({ sound }) => {
        void sound.setRateAsync(1.5, true);
        void sound.playAsync();
        sound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) return;
          if (status.didJustFinish) {
            void sound.unloadAsync();
            resolve();
          }
        });
      })
      .catch(() => resolve());
  });
}

export function useSound() {
  const winSoundRef = useRef<Audio.Sound | null>(null);
  const loseSoundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      [winSoundRef, loseSoundRef].forEach((ref) => {
        if (ref.current) {
          void ref.current.unloadAsync();
          ref.current = null;
        }
      });
    };
  }, []);

  const playWinSound = () => playOnce(winSoundRef, SOUND_WIN);
  const playLoseSound = () => playOnce(loseSoundRef, SOUND_LOSE);

  async function playCallSequence(strikes: number, balls: number, outs: number) {
    const sources: unknown[] = [];
    if (strikes > 0 && SOUNDS_STRIKES[strikes]) sources.push(SOUNDS_STRIKES[strikes]);
    if (balls > 0 && SOUNDS_BALLS[balls]) sources.push(SOUNDS_BALLS[balls]);
    if (outs > 0 && SOUNDS_OUTS[outs]) sources.push(SOUNDS_OUTS[outs]);
    if (sources.length === 0) return;

    // Pre-load all sounds in parallel to eliminate load gaps between clips
    const sounds = await Promise.all(
      sources.map((src) =>
        Audio.Sound.createAsync(src, { shouldPlay: false }).then(({ sound }) => sound).catch(() => null),
      ),
    );

    for (const sound of sounds) {
      if (!sound) continue;
      await new Promise<void>((resolve) => {
        void sound.setRateAsync(1.5, true);
        sound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) return;
          if (status.didJustFinish) {
            void sound.unloadAsync();
            resolve();
          }
        });
        void sound.playAsync();
      });
    }
  }

  return { playWinSound, playLoseSound, playCallSequence };
}


