# Bulls Cows (숫자야구)

A simple **3-digit Strike / Ball / Out** number-baseball game built with **React Native + TypeScript + Expo (SDK 55)**.

## Game Rules

- **Secret**: 3 digits
- **Digits are unique** (no duplicates)
- **0 is allowed**
- **Win condition**: `3 Strikes`
- **Max attempts**: `10` (Game Over after 10 tries)

### Scoring

- **Strike (S)**: correct digit in the correct position
- **Ball (B)**: correct digit but wrong position
- **Out (O)**: digit not included in the secret

Example:

- Secret: `123`
- Guess: `134`
- Result: `1S 1B 1O`

## Features

- **Keypad input** (prevents duplicate digits)
- **Active digit highlight** (yellow border)
- **Strike position highlight after submit** (sky-blue border)
- **Haptic feedback** on keypad/submit/win/game over (`expo-haptics`)
- **Attempt history list** (latest attempt shown at the top)

## Tech Stack

- Expo SDK: `~55`
- React Native: `0.83.x`
- React: `19.x`
- TypeScript: `~5.9`

## Project Structure

- `App.tsx`
  - UI screens (Home / How to Play / Game)
  - Attempt limit (10 tries)
  - Haptics + highlights
- `src/lib/game.ts`
  - Secret generation
  - Guess validation
  - Strike/Ball/Out scoring
- `types/index.ts`
  - Shared TypeScript types (`IAttempt`, `IScore`)

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
