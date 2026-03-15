import { LETTERS, API_CACHE_TTL, SKIP_WORDS } from './config.js';
import { D } from './debug.js';
import { state } from './state.js';

/** Returns true if the word is suitable for the game. */
export function isGoodWord(w) {
  const lw = w.toLowerCase();
  if (SKIP_WORDS.has(lw)) return false;
  if (lw.length < 4 || lw.length > 14) return false;
  if (/\s|\d/.test(w)) return false;
  if (/mente$/.test(lw)) return false;
  if (lw.length >= 5 && /[bcdfglmnprstvz]os$/.test(lw)) return false;
  if (lw.length >= 5 && /[bcdfglmnprstvz]as$/.test(lw)) return false;
  if (lw.length >= 5 && /[cdlnrst]es$/.test(lw)) return false;
  if (/[aei]rse$/.test(lw)) return false;
  if (/(?:amos|emos|imos|aron|ieron|ieran|aban|ando|endo|ería|erán|arán|irán)$/.test(lw)) return false;
  if (/[aeiu]ó$/.test(lw) && lw.length > 3) return false;
  if (/^[A-ZÁÉÍÓÚÑ]/.test(w) && w !== w.toLowerCase()) return false;
  return true;
}

/** Fetch candidate words from Datamuse for a given letter. */
async function fetchWordCandidates(letter) {
  const words = [];
  try {
    const pattern = letter.toLowerCase() + '????*';
    const url = `https://api.datamuse.com/words?sp=${encodeURIComponent(pattern)}&v=es&max=100`;
    const res = await fetch(url);
    const data = await res.json();
    let accepted = 0;
    for (const w of data) {
      if (isGoodWord(w.word)) { words.push({ word: w.word, contains: false }); accepted++; }
    }
    D.api(`[${letter}] Datamuse: ${data.length} total → ${accepted} accepted`);
  } catch (e) { D.err(`[${letter}] Datamuse failed: ${e.message}`); }

  // For hard letters, also search "contains" mode
  if (['K', 'W', 'X'].includes(letter)) {
    try {
      const pattern = '???*' + letter.toLowerCase() + '*';
      const url = `https://api.datamuse.com/words?sp=${encodeURIComponent(pattern)}&v=es&max=60`;
      const res = await fetch(url);
      const data = await res.json();
      let accepted = 0;
      for (const w of data) {
        if (isGoodWord(w.word) && !w.word.toLowerCase().startsWith(letter.toLowerCase())) {
          words.push({ word: w.word, contains: true }); accepted++;
        }
      }
      D.api(`[${letter}] Datamuse contains: ${data.length} total → ${accepted} accepted`);
    } catch (e) { D.err(`[${letter}] Datamuse contains failed: ${e.message}`); }
  }
  return words;
}

const WIKI_HEADERS = { 'Api-User-Agent': 'PasapalabraGame/1.0 (browser-game; no-contact)' };

/** Fetch a Spanish definition from Wiktionary using the Action API. */
async function fetchWiktionaryDef(word) {
  try {
    const url = `https://es.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(word)}&prop=text&format=json&origin=*`;
    const res = await fetch(url, { headers: WIKI_HEADERS });
    if (!res.ok) { D.api(`  Wiki "${word}" → ${res.status}`); return null; }
    const json = await res.json();
    if (json.error) { D.api(`  Wiki "${word}" → ${json.error.code}`); return null; }
    const html = json.parse.text['*'];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Find the Spanish section (H2 containing "Español")
    const h2s = doc.querySelectorAll('h2');
    let esSection = null;
    for (const h2 of h2s) {
      const span = h2.querySelector('#Español') || (h2.textContent.trim() === 'Español' ? h2 : null);
      if (span || h2.textContent.trim() === 'Español') {
        esSection = [];
        let el = h2.nextElementSibling;
        while (el && el.tagName !== 'H2') {
          esSection.push(el);
          el = el.nextElementSibling;
        }
        break;
      }
    }
    if (!esSection || esSection.length === 0) { D.api(`  Wiki "${word}" → no Spanish section`); return null; }

    // Find first <dd> element with a good definition
    for (const el of esSection) {
      const dds = el.tagName === 'DD' ? [el] : el.querySelectorAll('dd');
      for (const dd of dds) {
        const clone = dd.cloneNode(true);
        clone.querySelectorAll('style, .mw-editsection').forEach(s => s.remove());
        let text = clone.textContent.trim();
        text = text.split(/\nEjemplo:/)[0].split(/\nSinónimo/)[0].split(/\nUso:/)[0].trim();
        text = text.replace(/\[\d+\]/g, '').trim();
        text = text.replace(/\s{2,}/g, ' ').trim();
        if (/^(Participio|Forma del|Flexión de|Conjugación|Primera persona|Segunda persona|Tercera persona)/i.test(text)) continue;
        if (text.length >= 15 && text.length <= 200) {
          text = text.charAt(0).toUpperCase() + text.slice(1);
          D.api(`  Wiki "${word}" → "${text.substring(0, 60)}..."`);
          return text;
        }
      }
    }
    D.api(`  Wiki "${word}" → no valid definition found`);
    return null;
  } catch (e) { D.err(`  Wiki "${word}" failed: ${e.message}`); return null; }
}

/**
 * Fetch fresh words with Wiktionary definitions for each letter.
 * Calls onProgress(phase, letter, done, total) to report loading status.
 */
export async function fetchAPIWords(onProgress) {
  if (Object.keys(state.apiCache).length > 0 && Date.now() - state.apiCacheTime < API_CACHE_TTL) {
    D.api('Using cached API words');
    if (onProgress) onProgress('cached', null, 26, 26);
    return state.apiCache;
  }

  console.group('%c🌐 Fetching fresh words from Datamuse + Wiktionary', 'color:#5ab4f7;font-weight:bold;font-size:12px');
  const t0 = performance.now();
  const result = {};
  const activeLetters = LETTERS.filter(l => l !== 'Ñ');
  let completed = 0;

  // Phase 1: Fetch all Datamuse candidates in parallel
  if (onProgress) onProgress('datamuse', null, 0, activeLetters.length);
  const allCandidates = {};
  await Promise.all(
    activeLetters.map(async (letter) => {
      allCandidates[letter] = await fetchWordCandidates(letter);
    })
  );

  // Phase 2: Look up Wiktionary definitions (batched to respect rate limits)
  if (onProgress) onProgress('wiktionary', null, 0, activeLetters.length);

  // Process letters in batches of 3 to limit concurrency
  const BATCH_SIZE = 3;
  for (let i = 0; i < activeLetters.length; i += BATCH_SIZE) {
    const batch = activeLetters.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (letter) => {
      const candidates = allCandidates[letter] || [];
      if (candidates.length === 0) {
        D.warn(`[${letter}] No candidates from Datamuse`);
        completed++;
        if (onProgress) onProgress('letter-fail', letter, completed, activeLetters.length);
        return;
      }

      const shuffled = candidates.sort(() => Math.random() - 0.5).slice(0, 6);
      D.api(`[${letter}] Trying up to ${shuffled.length} words in Wiktionary: ${shuffled.map(c => c.word).join(', ')}`);

      let found = null;
      for (const c of shuffled) {
        const def = await fetchWiktionaryDef(c.word);
        if (!def || def.length < 15) continue;
        if (/^(Nominativo|Forma del|Conjugación|Primera persona|Segunda persona|Tercera persona)/i.test(def)) {
          D.warn(`  Rejected "${c.word}": grammar definition`);
          continue;
        }
        found = { word: c.word, def, contains: c.contains };
        break;
      }

      if (found) {
        D.ok(`[${letter}] Found: ${found.word}`);
        result[letter] = [found];
      } else {
        D.warn(`[${letter}] No good definition found`);
      }
      completed++;
      if (onProgress) onProgress(found ? 'letter-ok' : 'letter-fail', letter, completed, activeLetters.length);
    }));
    // Small pause between batches
    if (i + BATCH_SIZE < activeLetters.length) await new Promise(r => setTimeout(r, 200));
  }
  const elapsed = ((performance.now() - t0) / 1000).toFixed(1);
  const totalWords = Object.values(result).reduce((sum, arr) => sum + arr.length, 0);
  D.ok(`Fetched ${totalWords} words for ${Object.keys(result).length}/26 letters in ${elapsed}s`);
  console.groupEnd();

  state.apiCache = result;
  state.apiCacheTime = Date.now();
  return result;
}
