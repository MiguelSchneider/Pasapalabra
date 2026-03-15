import { TOTAL, GAME_TIME } from './config.js';
import { D } from './debug.js';
import { state } from './state.js';
import { pickWords } from './word-picker.js';
import { initSpeechRecognition, stopListening, stopAudio, toggleMic } from './speech.js';
import {
  normalize, buildRosco, showScreen, showQuestion, highlightCurrent,
  updateTimerDisplay, updateStats, showFeedback, showWrongModal, hideWrongModal,
  renderEndScreen,
} from './ui.js';

// ========== Timer ==========

function startTimer() {
  clearInterval(state.timerInterval);
  updateTimerDisplay();
  state.timerInterval = setInterval(() => {
    state.timer--;
    updateTimerDisplay();
    if (state.timer <= 0) {
      clearInterval(state.timerInterval);
      endGame();
    }
  }, 1000);
}

// ========== Answer handling ==========

function submitAnswer() {
  stopListening();
  stopAudio();
  const input = document.getElementById('answer-input').value.trim();
  if (!input) { D.game('submitAnswer: empty input, ignoring'); return; }

  const item = state.gameState[state.currentIdx];
  const correct = normalize(input) === normalize(item.word);
  D.game(`submitAnswer: "${input}" vs "${item.word}" → ${correct ? '✅ CORRECT' : '❌ WRONG'} (normalized: "${normalize(input)}" vs "${normalize(item.word)}")`);

  if (correct) {
    item.status = 'correct';
    state.correctCount++;
    document.getElementById(`cell-${state.currentIdx}`).className = 'letter-cell correct';
    showFeedback(true);
    updateStats();
    advanceToNext();
  } else {
    item.status = 'wrong';
    state.wrongCount++;
    document.getElementById(`cell-${state.currentIdx}`).className = 'letter-cell wrong';
    showFeedback(false);
    updateStats();
    clearInterval(state.timerInterval);
    showWrongModal(item.word);
  }
}

function passTurn() {
  D.game('⏭️ passTurn()');
  stopListening();
  stopAudio();
  advanceToNext();
}

function advanceToNext() {
  const pending = state.gameState.filter(g => g.status === 'pending');
  if (pending.length === 0 || state.correctCount === TOTAL) {
    clearInterval(state.timerInterval);
    setTimeout(endGame, 400);
    return;
  }
  let next = (state.currentIdx + 1) % TOTAL;
  while (state.gameState[next].status !== 'pending') {
    next = (next + 1) % TOTAL;
  }
  state.currentIdx = next;
  highlightCurrent();
  showQuestion();
}

export function closeWrongModal() {
  D.game('closeWrongModal → resuming timer, advancing');
  stopAudio();
  hideWrongModal();
  startTimer();
  advanceToNext();
}

function endGame() {
  clearInterval(state.timerInterval);
  stopListening();
  stopAudio();
  renderEndScreen();
}

// ========== Speech recognition result handler ==========

function handleSpeechResult(transcript) {
  const lower = transcript.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (lower.includes('pasapalabra') || lower.includes('pasa palabra')) {
    D.game('Detected "pasapalabra" → passing turn');
    const input = document.getElementById('answer-input');
    if (input) input.value = '';
    setTimeout(() => passTurn(), 200);
  } else {
    D.game(`Submitting answer: "${transcript}"`);
    setTimeout(() => submitAnswer(), 300);
  }
}

// ========== Public game lifecycle ==========

export function startGame() {
  state.ttsEnabled = document.getElementById('tts-enabled').checked;
  state.micEnabled = document.getElementById('mic-enabled').checked;
  if (state.micEnabled) initSpeechRecognition(handleSpeechResult);

  pickWords();

  buildRosco({ onSubmit: submitAnswer, onPass: passTurn, onToggleMic: toggleMic });
  state.correctCount = 0;
  state.wrongCount = 0;
  state.currentIdx = 0;
  state.timer = GAME_TIME;
  updateStats();
  showScreen('screen-game');

  const micBtn = document.getElementById('btn-mic');
  if (micBtn) micBtn.style.display = state.micEnabled ? 'flex' : 'none';

  highlightCurrent();
  showQuestion();
  startTimer();
  document.getElementById('answer-input').focus();
}

export function resetGame() {
  clearInterval(state.timerInterval);
  stopListening();
  stopAudio();
  showScreen('screen-start');
}
