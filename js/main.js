import { LETTERS, TOTAL } from './config.js';
import { startGame, resetGame, closeWrongModal } from './game.js';
import { buildRosco } from './ui.js';

// Wire up static buttons (replacing inline onclick attributes)
document.getElementById('btn-start').addEventListener('click', startGame);
document.getElementById('btn-replay').addEventListener('click', resetGame);
document.getElementById('btn-continue').addEventListener('click', closeWrongModal);

// Build decorative rosco on start screen
function buildStartRosco() {
  const container = document.getElementById('start-rosco-bg');
  if (!container) return;
  container.innerHTML = '';
  const size = Math.min(window.innerWidth - 40, 520);
  container.style.width = size + 'px';
  container.style.height = size + 'px';
  const cx = size / 2, cy = size / 2;
  const radius = size * 0.42;
  const cellSize = Math.max(28, size * 0.075);

  LETTERS.forEach((letter, i) => {
    const angle = (i / TOTAL) * 2 * Math.PI - Math.PI / 2;
    const x = cx + radius * Math.cos(angle) - cellSize / 2;
    const y = cy + radius * Math.sin(angle) - cellSize / 2;
    const el = document.createElement('div');
    el.className = 'start-rosco-cell';
    el.textContent = letter;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.width = cellSize + 'px';
    el.style.height = cellSize + 'px';
    el.style.fontSize = (cellSize * 0.45) + 'px';
    container.appendChild(el);
  });
}
buildStartRosco();
window.addEventListener('resize', buildStartRosco);

// Build initial rosco preview (empty, no callbacks needed)
buildRosco();
