import { LETTERS } from './config.js';
import { D } from './debug.js';
import { state } from './state.js';
import WORD_BANK from './word-bank.js';

/**
 * Selects one word per letter for this game round from the static word bank.
 * Tracks used words to avoid repeats across games.
 */
export function pickWords() {
  console.group('%c🎮 Picking words for this game', 'color:#2ecc71;font-weight:bold;font-size:12px');
  state.gameState = [];

  LETTERS.forEach(letter => {
    const pool = WORD_BANK[letter];
    const fresh = pool.filter(w => !state.usedWords.has(w.word));
    const pick = fresh.length > 0
      ? fresh[Math.floor(Math.random() * fresh.length)]
      : pool[Math.floor(Math.random() * pool.length)];
    const source = fresh.length > 0 ? 'fresh' : 'reuse';

    D.game(`[${letter}] ${source} → "${pick.word}" — ${pick.def.substring(0, 50)}...`);

    state.usedWords.add(pick.word);
    state.gameState.push({
      letter,
      word: pick.word,
      definition: pick.def,
      contains: pick.contains === true,
      status: 'pending',
    });
  });

  D.ok(`Words picked from static bank. usedWords total: ${state.usedWords.size}`);
  console.groupEnd();

  // Cap usedWords to prevent memory buildup
  if (state.usedWords.size > 500) {
    const arr = [...state.usedWords];
    state.usedWords = new Set(arr.slice(arr.length - 300));
  }
}
