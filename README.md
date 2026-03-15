# Pasapalabra - El Rosco

A browser-based version of the classic Spanish word quiz game "El Rosco" from the TV show Pasapalabra.

## How to Play

1. Open `index.html` in your browser (Chrome or Safari recommended)
2. Click **COMENZAR** to start
3. For each of the 27 letters (A–Z + Ñ), you'll get a definition clue
4. Type your answer or speak it using your microphone
5. Say or click **Pasapalabra** to skip a letter and come back to it later
6. Answer all letters before the timer runs out!

## Features

- **27-letter rosco** arranged in a circular layout, just like the TV show
- **Voice interaction** — questions are read aloud (TTS) and you can answer by speaking
- **"Contains" mode** — hard letters (K, W, X) use "contains the letter" clues instead of "starts with"
- **Wrong answer modal** — shows the correct answer before continuing
- **No dependencies** — pure vanilla JS with ES modules, no build step required

## Tech Stack

- Vanilla JavaScript (ES modules)
- HTML5 + CSS3 (dark theme, responsive down to 580px)
- Web Speech API (SpeechSynthesis + SpeechRecognition)
- Montserrat font via Google Fonts

## Project Structure

```
index.html              — HTML shell: three screens + modal
css/styles.css          — All styles (dark theme, responsive)
js/
  main.js               — Entry point: event listeners, boots initial rosco
  config.js             — Constants (letters, timing, skip words)
  state.js              — Single shared mutable state object
  word-bank.js          — Static dictionary (~1350 words) keyed by letter
  word-picker.js        — Selects one word per letter from the bank
  api.js                — Datamuse + Wiktionary integration (experimental)
  speech.js             — TTS and speech recognition
  ui.js                 — DOM rendering: rosco, screens, stats, modals
  game.js               — Game flow: start, timer, submit, pass, end
  debug.js              — Color-coded console logger
```

## Browser Compatibility

Optimized for **Chrome** and **Safari**. Speech recognition requires `webkitSpeechRecognition` support. Works directly from `file://` — no server needed.
