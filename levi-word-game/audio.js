// Web Audio sound effects for Wheel of Fortune.
// Pure synthesis — no audio files. Lazy-inits AudioContext on first play
// to satisfy iOS's user-gesture requirement.

(function () {
  let ctx = null;
  let muted = loadMuted();

  function loadMuted() {
    try { return localStorage.getItem("wof-muted") === "1"; }
    catch (e) { return false; }
  }
  function saveMuted() {
    try { localStorage.setItem("wof-muted", muted ? "1" : "0"); }
    catch (e) {}
  }

  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone({ freq, type = "sine", start = 0, duration = 0.15, gain = 0.2, freqEnd }) {
    const c = ensureCtx();
    if (!c) return;
    const t0 = c.currentTime + start;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (freqEnd !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t0 + duration);
    }
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  function noiseBurst({ start = 0, duration = 0.3, gain = 0.15, filterFreq, filterQ = 1 }) {
    const c = ensureCtx();
    if (!c) return;
    const t0 = c.currentTime + start;
    const bufferSize = Math.floor(c.sampleRate * duration);
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buffer;
    const g = c.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    let node = src;
    if (filterFreq !== undefined) {
      const filter = c.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = filterFreq;
      filter.Q.value = filterQ;
      node = node.connect(filter);
    }
    node.connect(g).connect(c.destination);
    src.start(t0);
    src.stop(t0 + duration + 0.02);
  }

  const Sound = {
    isMuted() { return muted; },
    setMuted(m) { muted = !!m; saveMuted(); },
    toggle() { muted = !muted; saveMuted(); return muted; },

    tick() {
      if (muted) return;
      noiseBurst({ duration: 0.022, gain: 0.45, filterFreq: 1900, filterQ: 8 });
      tone({ freq: 1600, type: "triangle", duration: 0.012, gain: 0.18 });
    },
    click() {
      if (muted) return;
      noiseBurst({ duration: 0.018, gain: 0.25, filterFreq: 1300, filterQ: 5 });
    },
    correct() {
      if (muted) return;
      tone({ freq: 523, type: "sine", start: 0,    duration: 0.12, gain: 0.25 }); // C5
      tone({ freq: 784, type: "sine", start: 0.10, duration: 0.18, gain: 0.25 }); // G5
    },
    wrong() {
      if (muted) return;
      tone({ freq: 220, type: "square", duration: 0.2, gain: 0.18, freqEnd: 140 });
    },
    bankrupt() {
      if (muted) return;
      tone({ freq: 400, type: "sawtooth", duration: 0.55, gain: 0.25, freqEnd: 60 });
      noiseBurst({ start: 0.15, duration: 0.35, gain: 0.12 });
    },
    loseTurn() {
      if (muted) return;
      tone({ freq: 392, type: "triangle", start: 0,    duration: 0.20, gain: 0.22 }); // G4
      tone({ freq: 329, type: "triangle", start: 0.18, duration: 0.20, gain: 0.22 }); // E4
      tone({ freq: 261, type: "triangle", start: 0.36, duration: 0.35, gain: 0.22 }); // C4
    },
    win() {
      if (muted) return;
      tone({ freq: 523,  type: "triangle", start: 0,    duration: 0.14, gain: 0.25 }); // C5
      tone({ freq: 659,  type: "triangle", start: 0.13, duration: 0.14, gain: 0.25 }); // E5
      tone({ freq: 784,  type: "triangle", start: 0.26, duration: 0.14, gain: 0.25 }); // G5
      tone({ freq: 1046, type: "triangle", start: 0.39, duration: 0.40, gain: 0.28 }); // C6
    },
  };

  window.Sound = Sound;

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.id === "btn-wof-mute") return;
    if (btn.id === "btn-wof-spin") return;
    Sound.click();
  }, true);
})();
