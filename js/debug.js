// Color-coded debug logging — use D.api(), D.game(), D.tts(), D.mic(), etc.
export const D = {
  api(msg, ...args)  { console.log(`%c🌐 API %c${msg}`,  'background:#1a5fa0;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold', 'color:#5ab4f7', ...args); },
  game(msg, ...args) { console.log(`%c🎮 GAME %c${msg}`, 'background:#27ae60;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold', 'color:#2ecc71', ...args); },
  tts(msg, ...args)  { console.log(`%c🔊 TTS %c${msg}`,  'background:#f39c12;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold', 'color:#f7b733', ...args); },
  mic(msg, ...args)  { console.log(`%c🎙️ MIC %c${msg}`,  'background:#e74c3c;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold', 'color:#e74c3c', ...args); },
  err(msg, ...args)  { console.log(`%c❌ ERR %c${msg}`,  'background:#c0392b;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold', 'color:#ff6b6b', ...args); },
  ok(msg, ...args)   { console.log(`%c✅ OK %c${msg}`,   'background:#1e8449;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold', 'color:#2ecc71', ...args); },
  warn(msg, ...args) { console.log(`%c⚠️ WARN %c${msg}`, 'background:#e67e22;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold', 'color:#f39c12', ...args); },
};
