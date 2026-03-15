import { D } from './debug.js';
import { state } from './state.js';

function clearMicTimer() {
  clearTimeout(state.micRestartTimer);
  state.micRestartTimer = null;
}

function beep() {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();
}

/** Try to (re)start the mic, but only if conditions are right. */
export function tryStartMic() {
  clearMicTimer();
  if (!state.micEnabled || !state.recognition) { D.mic('tryStartMic: mic disabled or no recognition'); return; }
  if (state.isSpeaking) { D.mic('tryStartMic: blocked — TTS speaking'); return; }
  if (state.isListening) { D.mic('tryStartMic: already listening'); return; }
  const gameOn = document.getElementById('screen-game')?.classList.contains('visible');
  const modalOn = document.getElementById('wrong-modal')?.classList.contains('visible');
  if (!gameOn || modalOn) { D.mic(`tryStartMic: blocked — gameOn=${gameOn}, modalOn=${modalOn}`); return; }
  state.wantsMicOn = true;
  try {
    state.recognition.start();
    state.isListening = true;
    D.mic('🟢 Mic STARTED — listening');
    beep();
    const btn = document.getElementById('btn-mic');
    if (btn) btn.classList.add('listening');
    const vs = document.getElementById('voice-status');
    if (vs) vs.textContent = 'Escuchando...';
  } catch (e) { D.warn(`tryStartMic exception: ${e.message}`); }
}

export function stopListening() {
  D.mic('🔴 stopListening()');
  state.wantsMicOn = false;
  clearMicTimer();
  state.isListening = false;
  const btn = document.getElementById('btn-mic');
  if (btn) btn.classList.remove('listening');
  const vs = document.getElementById('voice-status');
  if (vs) vs.textContent = '';
  try { if (state.recognition) state.recognition.abort(); } catch (_) {}
}

function scheduleListenAfterTTS(gen) {
  clearMicTimer();
  if (gen !== state.speakGeneration) { D.warn(`scheduleListenAfterTTS gen=${gen} STALE`); return; }
  const modalOn = document.getElementById('wrong-modal')?.classList.contains('visible');
  if (modalOn) { D.mic('Modal visible, NOT scheduling mic'); return; }
  D.mic('Scheduling mic start in 150ms');
  state.wantsMicOn = true;
  state.micRestartTimer = setTimeout(() => tryStartMic(), 100);
}

/**
 * Initializes the SpeechRecognition engine.
 * onFinalResult(transcript) is called when a final transcript is available.
 */
export function initSpeechRecognition(onFinalResult) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { console.warn('SpeechRecognition not supported'); return; }
  state.recognition = new SR();
  state.recognition.lang = 'es-ES';
  state.recognition.interimResults = true;
  state.recognition.continuous = false;
  state.recognition.maxAlternatives = 3;

  state.recognition.onresult = (event) => {
    if (state.isSpeaking) { D.mic('onresult IGNORED — TTS speaking'); return; }
    const result = event.results[0];
    const transcript = result[0].transcript.trim();
    const input = document.getElementById('answer-input');
    if (input) input.value = transcript;
    const vs = document.getElementById('voice-status');
    if (vs) vs.textContent = result.isFinal ? '' : 'Escuchando...';

    if (result.isFinal) {
      D.mic(`✏️ Final transcript: "${transcript}"`);
      stopListening();
      onFinalResult(transcript);
    } else {
      D.mic(`... interim: "${transcript}"`);
    }
  };

  state.recognition.onerror = (event) => {
    state.isListening = false;
    if (event.error !== 'no-speech' && event.error !== 'aborted') {
      D.err(`recognition.onerror: ${event.error}`);
      const vs = document.getElementById('voice-status');
      if (vs) { vs.textContent = 'Error de voz'; setTimeout(() => { vs.textContent = ''; }, 1500); }
    } else {
      D.mic(`recognition.onerror (normal): ${event.error}`);
    }
  };

  state.recognition.onend = () => {
    state.isListening = false;
    const btn = document.getElementById('btn-mic');
    if (btn) btn.classList.remove('listening');
    if (state.wantsMicOn && !state.isSpeaking) {
      D.mic('onend: auto-restart in 300ms');
      clearMicTimer();
      state.micRestartTimer = setTimeout(() => tryStartMic(), 300);
    } else {
      D.mic(`onend: NOT restarting (wantsMicOn=${state.wantsMicOn}, isSpeaking=${state.isSpeaking})`);
    }
  };
}

// ========== TTS ==========

function pickBestVoice() {
  const voices = window.speechSynthesis.getVoices();
  const priorities = ['Mónica', 'Paulina', 'Jorge'];
  for (const name of priorities) {
    const v = voices.find(v => v.name === name);
    if (v) { state.bestVoice = v; return; }
  }
  const novelty = /eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley/i;
  const good = voices.find(v => v.lang === 'es-ES' && !novelty.test(v.name));
  state.bestVoice = good || voices.find(v => v.lang.startsWith('es')) || null;
}

export function speak(text) {
  const gen = ++state.speakGeneration;
  D.tts(`speak() gen=${gen}: "${text.substring(0, 60)}..."`);
  if (!state.ttsEnabled) {
    D.tts('TTS disabled, skipping');
    state.isSpeaking = false;
    scheduleListenAfterTTS(gen);
    return;
  }
  stopListening();
  state.isSpeaking = true;
  clearTimeout(state.speakTimer);
  window.speechSynthesis.cancel();
  if (!state.bestVoice) pickBestVoice();
  state.speakTimer = setTimeout(() => {
    if (gen !== state.speakGeneration) { D.warn(`speak() gen=${gen} stale (current=${state.speakGeneration}), aborting`); return; }
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'es-ES';
    utt.rate = 0.95;
    utt.pitch = 1.0;
    if (state.bestVoice) { utt.voice = state.bestVoice; utt.lang = state.bestVoice.lang; }
    utt.onend = () => {
      if (gen === state.speakGeneration) { D.tts(`onend gen=${gen} → isSpeaking=false, scheduling mic`); state.isSpeaking = false; scheduleListenAfterTTS(gen); }
      else { D.warn(`onend gen=${gen} STALE (current=${state.speakGeneration}), ignoring`); }
    };
    utt.onerror = (e) => {
      if (gen === state.speakGeneration) { D.err(`onerror gen=${gen}: ${e.error || 'unknown'}`); state.isSpeaking = false; scheduleListenAfterTTS(gen); }
      else { D.warn(`onerror gen=${gen} STALE, ignoring`); }
    };
    D.tts(`Speaking via ${state.bestVoice?.name || 'default'}`);
    window.speechSynthesis.speak(utt);
  }, 50);
}

export function stopAudio() {
  D.tts('stopAudio() → isSpeaking=false, cancel synth');
  state.isSpeaking = false;
  state.wantsMicOn = false;
  clearTimeout(state.speakTimer);
  clearMicTimer();
  window.speechSynthesis.cancel();
}

export function toggleMic() {
  if (state.isListening) {
    stopListening();
  } else {
    state.wantsMicOn = true;
    tryStartMic();
  }
}

// Load voices as soon as available
window.speechSynthesis.onvoiceschanged = () => pickBestVoice();
pickBestVoice();
