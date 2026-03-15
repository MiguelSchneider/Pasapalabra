# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pasapalabra is a browser game (Spanish word quiz "El Rosco") built with vanilla JS using ES modules. No build tools, no framework, no dependencies — just open `index.html` in a browser.

## Architecture

The project uses native ES modules (`<script type="module">`). All dependencies flow one way: `main → game → ui → speech`, with `config`, `debug`, `state`, `word-bank`, `api`, `word-picker` as leaf/utility modules.

```
index.html              — HTML shell: three screens + modal, loads css + main.js
css/styles.css          — All styles (Montserrat font, dark theme, responsive at 580px)
js/
  main.js               — Entry point: wires event listeners, boots initial rosco
  config.js             — Constants: LETTERS, TOTAL, GAME_TIME, SKIP_WORDS
  debug.js              — Color-coded console logger (D.api, D.game, D.tts, D.mic, etc.)
  state.js              — Single shared mutable state object (all modules import same ref)
  word-bank.js          — Static dictionary (~1350 words) keyed by letter A–Z
  api.js                — Datamuse word fetching + Wiktionary definition parsing + throttling
  word-picker.js        — Selects one word per letter (prefers API, falls back to static bank)
  speech.js             — TTS (SpeechSynthesis) + speech recognition (webkitSpeechRecognition)
  ui.js                 — DOM rendering: rosco layout, screens, question display, stats, modals
  game.js               — Game flow orchestration: start, timer, submit, pass, end
```

**Note**: `word_bank_1350.js` in the root is the legacy standalone copy of the word bank (kept for reference). The active copy is `js/word-bank.js`.

## Key Design Decisions

- **Shared state object** (`js/state.js`): All mutable state lives in a single exported object. Any module importing `state` gets the same reference — avoids ES module live-binding confusion with `let` re-exports.
- **Callback pattern for dynamic buttons**: `buildRosco({ onSubmit, onPass, onToggleMic })` accepts callbacks to avoid circular imports between `ui.js` and `game.js`.
- **Speech recognition callback**: `initSpeechRecognition(onFinalResult)` receives a handler from `game.js` to process transcripts, keeping speech.js decoupled from game logic.

## Key Game Mechanics

- **27 letters** (A–Z plus Ñ), arranged in a circular "rosco" layout
- **Word sourcing**: Currently uses the static `WORD_BANK` only (`pickWords()` in `word-picker.js`). An API pipeline exists in `api.js` (`fetchAPIWords()`) that fetches candidates from **Datamuse** and looks up Spanish definitions from **Wiktionary**, but it is not yet wired into the word-picking flow
- **"Contains" mode**: For hard letters (K, W, X), clues say "contiene la X" instead of "empieza por X"
- **Word filtering** (`isGoodWord` in `api.js`): Rejects common words, plurals, adverbs (-mente), conjugated verbs, reflexive verbs, proper names, and words outside 4–14 chars
- **Repeat avoidance**: `usedWords` set tracks previously used words across games (capped at 500)
- **Timer**: 280 seconds, danger styling at ≤30s
- **Wrong answer flow**: Pauses timer, shows modal with correct answer, then resumes

## Voice Features

- **TTS**: Reads questions aloud using `SpeechSynthesis` API. Prefers Spanish voices (Mónica, Paulina, Jorge). Controlled by `ttsEnabled` checkbox.
- **Speech Recognition**: Uses `webkitSpeechRecognition` (es-ES). Saying "pasapalabra" triggers a pass. Generation-based invalidation prevents stale TTS/mic callbacks.
- TTS and mic are mutually exclusive — mic waits until TTS finishes via `isSpeaking` flag and `scheduleListenAfterTTS`.

## API Integration

- **Datamuse**: `api.datamuse.com/words?sp=<pattern>&v=es` — fetches word candidates. No rate limiting needed.
- **Wiktionary**: `es.wiktionary.org/w/api.php?action=parse&page=<word>` — fetches definitions. Throttled to 3 concurrent requests with 200ms delay. Parses HTML to extract the first `<dd>` in the "Español" section. 10-minute cache (note: `API_CACHE_TTL` and `apiCache`/`apiCacheTime` state properties are referenced in code but not yet defined — must be added to `config.js` and `state.js` before the API pipeline can work).

## Development

Open `index.html` directly in a browser (no server required, ES modules work on `file://` in modern browsers). Use browser DevTools console — the app has color-coded debug logging via the `D` object (categories: api, game, tts, mic, err, ok, warn).
