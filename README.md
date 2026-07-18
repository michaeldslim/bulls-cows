# Bulls & Cows (숫자야구)

A baseball-themed **Strike / Ball / Out** number puzzle built with **React Native**, **TypeScript**, and **Expo SDK 55**.

Guess unique-digit secrets across multiple innings. Score a run when you crack the code before 3 outs. Default rules mirror classic 숫자야구: **3 digits**, **9 innings**, **3 outs per inning** — all configurable in Settings.


---

## Overview

Each inning presents a new secret number made of unique digits (0–9). Enter guesses on a numeric keypad; each submission is scored as strikes, balls, and outs. Land every digit in the correct position (a full strike count) to score a run. Rack up outs with wrong digits — three outs ends the inning with no run.

The app wraps this core loop in a baseball metaphor: innings, runs, outs, and a live scoreboard. Sound effects call out results like a ballpark announcer. Stats, daily challenges, hints, dark mode, and Korean/English localization are built in.

---

## Game Rules

### Secret number

- Digits are **unique** (no repeats).
- **0 is allowed**, including as the first digit (e.g. `012`).
- Default length is **3 digits**; Settings allow **4-digit** mode.

### Innings & outs

- Play **6 or 9 innings** (default 9), each with a **new secret**.
- Every guess adds **outs** for digits not present in the secret.
- **3 outs** ends the inning — no run scored.
- A **run** is scored when your guess has a strike on every position (you guessed the full secret).

### Scoring (per guess)

| Result | Meaning |
|--------|---------|
| **Strike (S)** | Correct digit in the correct position |
| **Ball (B)** | Digit is in the secret but in the wrong position |
| **Out (O)** | Digit is not in the secret — counts toward 3 outs |

Strikes + balls + outs always equal the digit count.

### Example (secret `123`)

| Guess | Result | Notes |
|-------|--------|-------|
| `134` | 1S 1B 1O | 1 out |
| `120` | 2S 0B 1O | 2 outs |
| `123` | 3S 0B 0O | Run scored |

### Win condition

Score as many runs as possible across all innings. A **perfect game** means a run in every inning (e.g. 9/9 in standard mode).

### Hints

After **3 unsuccessful attempts** in an inning (no run scored yet), **one digit position** is revealed. Limited to **1 hint per inning**. Revealed digits appear in the guess boxes with a dashed border.

---

## Game Modes

### Classic

Uses your Settings preferences for digit count (3 or 4) and innings (6 or 9). Each secret is randomly generated.

### Daily Challenge

From the home screen, tap **Daily Challenge** (오늘의 챌린지). Uses a **date-seeded** secret so every player gets the same puzzle for that day. Each inning's secret is derived from the date + inning number. Daily mode always uses **3 digits** and **9 innings**.

---

## Features

### Gameplay

- Numeric **keypad** with used-digit dimming
- **Enter** disabled until the guess is complete; helper text shows remaining digits
- **Active digit** highlight (yellow border) on the current input slot
- **Strike flash** on guess boxes after submit (correct positions stay highlighted briefly)
- **Per-digit attempt coloring** in history — green = strike, yellow = ball, gray = out
- **Shake animation** on invalid submit
- **Undo last guess** — once per inning, before the next submit
- Input **locked during scoring** (sound sequence + modals) to prevent double-submit

### Audio & haptics

- Spoken-style **S / B / O sound sequence** after each guess (speed-optimized playback)
- **Win** and **inning-over** sounds
- **Haptic feedback** on keypress, submit, run scored, inning over, and errors
  - Android uses `performAndroidHapticsAsync` for reliable feedback
  - Toggle in Settings; turning haptics **on** plays a preview vibration
- Sound and haptics can be disabled independently in Settings

### UI & accessibility

- **Dark mode** — follows system color scheme; themed tokens throughout
- **KO / EN** localization (`react-i18next`); Korean is the default
- **Accessibility labels** on keypad and guess boxes
- **Screen reader announcements** for S/B/O results and hint reveals
- **Collapsible “How to play”** on the game screen (auto-expands on first launch; collapses on first digit entry or dismiss)
- **Responsive layout** — max content width on tablets; landscape scoreboard sidebar on wide screens
- **Animations** — attempt list inserts, out-dot fill, modal enter

### Progress & settings

- **Stats** (persisted): best runs, perfect games, games played, average attempts on scored innings
- **Settings screen** (gear icon on home): language, digit count, innings, sound, haptics
- Separate **Settings** navigation from home (gear icon next to title)

---

## Screens

| Screen | Description |
|--------|-------------|
| **Home** | Rules summary, stats, Start Game / Daily Challenge buttons |
| **Game** | Scoreboard, guess boxes, attempt history, keypad, inning/game modals |
| **Settings** | Language, difficulty, sound, haptics |

---

## Tech Stack

| Package | Version |
|---------|---------|
| Expo SDK | ~55 |
| React Native | 0.83.x |
| React | 19.x |
| TypeScript | ~5.9 |
| i18next / react-i18next | KO + EN |
| Vitest | unit tests for game logic |
| AsyncStorage | settings, stats, onboarding flag |

---

## Project Structure

```text
App.tsx                    # Root navigation (home / game / settings)
index.ts                   # Expo entry

src/
  constants/game.ts        # Innings, digits, hints, layout constants
  lib/
    game.ts                # Secret generation, validation, scoring, hints, daily seed
    inning.ts              # Pure inning reducer (submit / undo)
    stats.ts               # Stats aggregation
    haptics.ts             # Cross-platform haptic helpers
    game.test.ts           # Vitest unit tests
  hooks/
    useGame.ts             # Session state, game flow, accessibility announcements
    useSettings.ts         # Persisted preferences
    useStats.ts            # Persisted stats
    useSound.ts            # S/B/O call sequence + win/lose sounds
    useOnboarding.ts       # First-launch how-to-play state
  screens/
    HomeScreen.tsx
    GameScreen.tsx
    SettingsScreen.tsx
  components/              # Keypad, GuessBoxes, AttemptRow, modals, etc.
  theme/                   # Light/dark tokens + ThemeProvider
  i18n/locales/            # en.ts, ko.ts
  utils/format.ts          # Ordinal / inning labels

types/index.ts             # Shared TypeScript interfaces
assets/sounds/             # Strike, ball, out, win, lose MP3s
android/                   # Native Android project (prebuild)
```

---

## Getting Started

### Install

```bash
npm install
```

### Run (development)

Start Metro:

```bash
npm start
```

Android dev build (recommended — includes native modules like `expo-font`, `expo-haptics`):

```bash
npm run android
# or
npx expo run:android --device
```

iOS:

```bash
npm run ios
```

> This project uses a **development build** (`expo run:*`), not Expo Go alone. After adding or updating native dependencies (`expo-font`, `expo-haptics`, etc.), rebuild the native app.

### Test

```bash
npm test          # run once
npm run test:watch
```

Covers `scoreGuess`, validation, secret generation, daily seed determinism, hint logic, inning reducer, and stats.

---

## Android APK Build

The repo includes an `android/` folder from Expo prebuild.

### Release APK

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### Debug APK

```bash
cd android
./gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## EAS (Expo Application Services)

Cloud builds and OTA updates are configured via `eas.json` and `app.json`.

### Setup

```bash
npm install -g eas-cli
eas login
eas init   # first time only
```

### Build

```bash
eas build --platform android --profile production
eas build --platform ios --profile production
eas build --platform all --profile production
```

### OTA update (JS-only changes)

```bash
eas update --channel production --message "Describe your change"
```

OTA updates apply only when the device's `runtimeVersion` matches `app.json` (`2.2.1`). Bump `runtimeVersion` and ship a new binary when native code changes.

| Profile | Channel | Purpose |
|---------|---------|---------|
| `development` | `development` | Dev client builds |
| `production` | `production` | Store releases |
