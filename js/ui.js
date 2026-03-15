import { LETTERS, TOTAL } from './config.js';
import { D } from './debug.js';
import { state } from './state.js';
import { speak, stopAudio, stopListening } from './speech.js';

/** Strip accents and normalize for answer comparison. */
export function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9ñ]/g, '');
}

/**
 * Build the circular rosco layout.
 * callbacks: { onSubmit, onPass, onToggleMic } — wired to dynamic buttons.
 */
export function buildRosco(callbacks = {}) {
  const container = document.getElementById('rosco');
  container.innerHTML = '';
  const w = window.innerWidth;
  const isSmallPhone = w <= 400;
  const isMobile = w <= 580;

  const areaSize = isSmallPhone ? 300 : isMobile ? 360 : 520;
  const cx = areaSize / 2, cy = areaSize / 2;
  const radius = isSmallPhone ? 125 : isMobile ? 155 : 220;
  const size = isSmallPhone ? 28 : isMobile ? 34 : 46;

  LETTERS.forEach((letter, i) => {
    const angle = (i / TOTAL) * 2 * Math.PI - Math.PI / 2;
    const x = cx + radius * Math.cos(angle) - size / 2;
    const y = cy + radius * Math.sin(angle) - size / 2;

    const el = document.createElement('div');
    el.className = 'letter-cell';
    el.id = `cell-${i}`;
    el.textContent = letter;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    container.appendChild(el);
  });

  // Center content (question only — stays inside the rosco)
  const center = document.createElement('div');
  center.className = 'center-content';
  center.innerHTML = `
    <div class="question-box">
      <div class="q-prefix" id="q-prefix"></div>
      <div class="q-text" id="q-text"></div>
    </div>
  `;
  container.appendChild(center);

  // Wire up controls (already in HTML, below the rosco)
  document.getElementById('btn-ok').addEventListener('click', () => callbacks.onSubmit?.());
  document.getElementById('btn-pass').addEventListener('click', () => callbacks.onPass?.());
  document.getElementById('btn-mic').addEventListener('click', () => callbacks.onToggleMic?.());
  document.getElementById('answer-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') callbacks.onSubmit?.();
  });
}

export function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('visible'));
  document.getElementById(id).classList.add('visible');
}

export function showQuestion() {
  D.game(`━━━ showQuestion() idx=${state.currentIdx} ━━━`);
  stopAudio();
  stopListening();
  const item = state.gameState[state.currentIdx];
  D.game(`Letter: ${item.letter} | Word: "${item.word}" | Contains: ${item.contains}`);
  const prefix = item.contains
    ? `CONTIENE LA "${item.letter}"`
    : `EMPIEZA POR "${item.letter}"`;
  document.getElementById('q-prefix').textContent = prefix;
  document.getElementById('q-text').textContent = item.definition;
  document.getElementById('answer-input').value = '';
  document.getElementById('answer-input').focus();

  const spokenPrefix = item.contains
    ? `Contiene la ${item.letter}.`
    : `Empieza por ${item.letter}.`;
  speak(spokenPrefix + ' ' + item.definition);
}

export function highlightCurrent() {
  document.querySelectorAll('.letter-cell').forEach(c => c.classList.remove('active'));
  const cell = document.getElementById(`cell-${state.currentIdx}`);
  if (cell) cell.classList.add('active');
}

export function updateTimerDisplay() {
  const m = Math.floor(state.timer / 60);
  const s = state.timer % 60;
  const el = document.getElementById('timer');
  // el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  el.textContent = `${state.timer.toString()}`;

  el.classList.toggle('danger', state.timer <= 30);
}

export function updateStats() {
  const pending = TOTAL - state.correctCount - state.wrongCount;
  document.getElementById('s-correct').textContent = state.correctCount;
  document.getElementById('s-wrong').textContent = state.wrongCount;
  document.getElementById('s-pending').textContent = pending;
}

export function showFeedback(isCorrect) {
  const el = document.getElementById('feedback');
  el.textContent = isCorrect ? '✓' : '✗';
  el.className = `feedback show ${isCorrect ? 'fc' : 'fw'}`;
  setTimeout(() => el.className = 'feedback', 600);
}

export function showWrongModal(correctWord) {
  D.game(`🚫 showWrongModal: correct was "${correctWord}"`);
  document.getElementById('modal-correct-word').textContent = correctWord.toUpperCase();
  document.getElementById('wrong-modal').classList.add('visible');
  speak(`Incorrecto. La respuesta correcta era: ${correctWord}`);
}

export function hideWrongModal() {
  document.getElementById('wrong-modal').classList.remove('visible');
}

export function renderEndScreen() {
  const allCorrect = state.correctCount === TOTAL;
  const title = document.getElementById('end-title');
  title.textContent = allCorrect ? '¡ROSCO COMPLETADO!' : 'FIN DEL JUEGO';
  title.className = `end-title ${allCorrect ? 'win' : 'lose'}`;

  document.getElementById('end-stats').innerHTML =
    `Aciertos: <b style="color:#2ecc71">${state.correctCount}</b> · ` +
    `Fallos: <b style="color:#e74c3c">${state.wrongCount}</b> · ` +
    `Sin responder: <b style="color:#3498db">${TOTAL - state.correctCount - state.wrongCount}</b>`;

  const wordsDiv = document.getElementById('end-words');
  wordsDiv.innerHTML = '';
  state.gameState.forEach(item => {
    const cls = item.status === 'correct' ? 'c' : item.status === 'wrong' ? 'w' : 'p';
    wordsDiv.innerHTML += `
      <div class="end-word">
        <div class="ew-letter ${cls}">${item.letter}</div>
        <span><b>${item.word.toUpperCase()}</b></span>
        <span class="ew-answer">${item.definition}</span>
      </div>`;
  });

  showScreen('screen-end');
}
