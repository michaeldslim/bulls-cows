import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export type HapticKind = 'selection' | 'impact' | 'success' | 'warning' | 'error';

export async function triggerHaptic(kind: HapticKind): Promise<void> {
  try {
    if (Platform.OS === 'android') {
      switch (kind) {
        case 'selection':
          await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Keyboard_Tap);
          return;
        case 'impact':
          await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Context_Click);
          return;
        case 'success':
          await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
          return;
        case 'warning':
          await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Gesture_End);
          return;
        case 'error':
          await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Reject);
          return;
      }
    }

    switch (kind) {
      case 'selection':
        await Haptics.selectionAsync();
        return;
      case 'impact':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        return;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
    }
  } catch {
    // Haptics unavailable on some emulators / devices.
  }
}

export function previewHapticFeedback(): void {
  void triggerHaptic('impact');
}
