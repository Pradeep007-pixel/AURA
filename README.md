# AURA

![Expo](https://img.shields.io/badge/Framework-Expo-yellowgreen.svg)
![React Native](https://img.shields.io/badge/Platform-React%20Native-blue.svg)
![CI](https://github.com/Pradeep007-pixel/aura/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

AURA is a polished focus and productivity companion built with Expo and React Native. It combines a Pomodoro-inspired timer, ambient sound mixer, analytics, and customizable settings into a mobile-first experience.

This repository contains the complete Expo source code for AURA, including timer logic, audio mixing, and performance tracking UI.

## 🚀 Key Features

- **Focus Timer** with Focus, Short Break, and Long Break modes
- **Soundscape Mixer** with layered ambient tracks for ocean, park, and wind
- **Progress Dashboard** for weekly focus minutes, sessions, and streaks
- **Custom Timer Settings** to tailor work/rest intervals
- **Reset Statistics** to clear progress and start fresh

## 🛠️ Tech Stack

- **Framework:** Expo
- **Frontend:** React Native
- **Audio:** expo-av
- **Icons:** lucide-react-native
- **Build Tool:** eas-cli
- **Supported Platforms:** Android, iOS, Web

## 📦 Installation

```bash
git clone https://github.com/Pradeep007-pixel/aura.git
cd aura
npm install
```

### Run locally

```bash
npm start
```

Then open the Expo DevTools in your browser and:

- scan the QR code with Expo Go on mobile, or
- press `a` to launch on Android, or
- press `i` to launch on iOS, or
- press `w` to open the web version.

### Build Android preview

```bash
npm run build:android
```

## ▶️ Usage

1. Open the app and choose one of the bottom tabs: **Timer**, **Sounds**, **Stats**, or **Settings**.
2. Use the **Focus Timer** to start, pause, and reset work/break sessions.
3. Mix ambient tracks in **Soundscapes** and adjust volume levels for each channel.
4. Review your progress in **Analytics** with weekly focus time, session count, and streak metrics.
5. Update session lengths and reset stats in **Settings**.

## 🧩 Project Structure

- `App.js` — main application entry point and bottom tab navigation
- `app.json` — Expo configuration
- `package.json` — dependencies and scripts
- `src/components/FocusTimer.js` — timer interface and countdown logic
- `src/components/SoundscapeMixer.js` — ambient audio mixer UI
- `src/components/StatsDashboard.js` — progress visualization and cards
- `src/components/SettingsScreen.js` — preferences and reset controls
- `src/theme/colors.js` — shared design tokens and styles

## ✅ Notes

- Ambient tracks stream from remote URLs, so a network connection is required for sound playback.
- Timer completion triggers a simple notification and automatically switches between work and break modes.
- Statistics are stored in memory during runtime and reset when the app is closed or when using the reset action.

## 🤝 Contribution

Contributions are welcome. If you want to improve the app, open an issue or submit a pull request with enhancements, bug fixes, or new soundscape options.

## 📜 License

This project is licensed under the MIT License. See `LICENSE` for details.

## ⚠️ Disclaimer

AURA is intended for personal productivity and learning purposes only. It is not a medical or professional wellness tool.
