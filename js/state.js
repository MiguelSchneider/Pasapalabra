import { GAME_TIME } from './config.js';

// Single shared state object — all modules import this same reference.
export const state = {
  // Game
  gameState: [],        // [{letter, word, definition, contains, status}]
  currentIdx: 0,
  correctCount: 0,
  wrongCount: 0,
  timer: GAME_TIME,
  timerInterval: null,

  // TTS & Speech Recognition
  ttsEnabled: true,
  micEnabled: true,
  recognition: null,
  isListening: false,
  isSpeaking: false,
  wantsMicOn: false,
  micRestartTimer: null,
  bestVoice: null,
  speakTimer: null,
  speakGeneration: 0,

  // Word tracking
  usedWords: new Set(),
};
