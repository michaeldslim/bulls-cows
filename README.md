# Bulls Cows (숫자야구)

A **3-digit Strike / Ball / Out** number-baseball game built with **React Native + TypeScript + Expo (SDK 55)**.

## Game Rules

- **Secret**: 3 unique digits (0–9, no duplicates)
- **Innings**: Play 9 innings, each with a new secret number
- **Outs**: Each guess adds outs for digits not in the secret; 3 outs ends the inning
- **Run**: Guess all 3 digits correctly (3 strikes) before 3 outs to score a run
- **Goal**: Score as many runs as possible across all 9 innings (perfect game = 9 runs)

### Scoring

- **Strike (S)**: correct digit in the correct position
- **Ball (B)**: correct digit but wrong position
- **Out (O)**: digit not in the secret — counts toward 3 outs per inning

Example (secret `123`):

- Guess `134` → `1S 1B 1O` (1 out)
- Guess `120` → `2S 0B 1O` (2 outs)
- Guess `123` → `3S 0B 0O` → Run!

## Features

- **Keypad input** with used-digit dimming and disabled Enter until guess is complete
- **Active digit highlight** (yellow border) and strike-position flash after submit
- **Per-digit attempt coloring** — green = strike, yellow = ball, gray = out
- **Shake feedback** on invalid/incomplete guesses
- **Sound effects** and **haptic feedback** (toggleable in Settings)
- **9-inning scoreboard** with run/out tracking and perfect-game celebration
- **Attempt history** (latest attempt shown at the top)

## Tech Stack

- Expo SDK: `~55`
- React Native: `0.83.x`
- React: `19.x`
- TypeScript: `~5.9`

## Project Structure

- `App.tsx` — Home and Game screens, keypad, modals
- `src/lib/game.ts` — Secret generation, validation, scoring, digit classification
- `src/hooks/useGame.ts` — Inning/session state and game flow
- `src/hooks/useSettings.ts` — Persisted sound/haptics preferences
- `types/index.ts` — Shared TypeScript types

## Getting Started

### 1) Install

```bash
npm install
```

### 2) Run (Dev)

Start the dev server:

```bash
npm start
```

Run on Android (dev build):

```bash
npm run android
```

> Note: This project uses `expo run:android` (native dev build). If you prefer Expo Go, use `npm start` and open with Expo Go.

## Android (`android/`) and APK Build

This repo includes an `android/` folder (generated via Expo prebuild).

### Build a Release APK

From the `android/` directory:

```bash
./gradlew assembleRelease
```

APK output path:

```text
android/app/build/outputs/apk/release/app-release.apk
```

### Build a Debug APK

```bash
./gradlew assembleDebug
```

Output:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Notes

- If UI elements are too close to the bottom gesture bar on your device, adjust `styles.keypad.paddingBottom` in `App.tsx`.

## EAS (Expo Application Services)

This project uses **EAS Build** for cloud builds and **EAS Update** for over-the-air (OTA) JS updates.

### Setup

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Log in to your Expo account
eas login

# Link this project to EAS (first time only)
eas init
```

### Build

```bash
# Build for production (Android AAB + iOS IPA)
eas build --platform android --profile production
eas build --platform ios --profile production

# Build both platforms at once
eas build --platform all --profile production
```

> Builds run on Expo's cloud servers. When complete, a download link for the `.aab` / `.ipa` is provided.

### OTA Update (JS-only changes)

Use this instead of a full store release when only JavaScript/assets changed.

```bash
# Push an OTA update to production
eas update --channel production --message "Fix bug / update description"
```

> OTA updates are only delivered to devices whose `runtimeVersion` matches. A new binary build is required when native code changes.

### Channels

| Profile | Channel | Purpose |
|---|---|---|
| `development` | `development` | Dev client builds |
| `production` | `production` | App Store / Play Store |
