// Browser-only: wires the WoF DOM to WheelState + WheelCanvas.

(function () {
  const WEDGES = [
    { type: "points", value: 500 },
    { type: "points", value: 600 },
    { type: "points", value: 700 },
    { type: "bankrupt" },
    { type: "points", value: 800 },
    { type: "points", value: 300 },
    { type: "points", value: 900 },
    { type: "loseTurn" },
    { type: "points", value: 500 },
    { type: "points", value: 600 },
    { type: "points", value: 2500 },
    { type: "points", value: 700 },
    { type: "points", value: 400 },
    { type: "points", value: 800 },
    { type: "points", value: 500 },
    { type: "bankrupt" },
    { type: "points", value: 600 },
    { type: "points", value: 700 },
    { type: "points", value: 900 },
    { type: "points", value: 500 },
    { type: "points", value: 800 },
    { type: "points", value: 300 },
    { type: "points", value: 1000 },
    { type: "points", value: 600 },
  ];

  const wof = {
    pool: null,            // { songTitles: [...], phrases: [...], characters: [...] }
    usedPuzzles: new Set(),
    totalRounds: 3,
    playerCount: 1,
    state: null,
    wheel: null,
  };

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    document.getElementById("screen-" + id).classList.add("active");
  }

  function pickPuzzle() {
    const pools = ["songTitles", "phrases", "characters", "locations"];
    // Flatten to (category, text) pairs not yet used
    const all = [];
    for (const key of pools) {
      for (const text of wof.pool[key]) {
        if (!wof.usedPuzzles.has(text)) {
          all.push({ category: key, text });
        }
      }
    }
    if (all.length === 0) {
      // Pool exhausted — recycle
      wof.usedPuzzles.clear();
      return pickPuzzle();
    }
    const pick = all[Math.floor(Math.random() * all.length)];
    wof.usedPuzzles.add(pick.text);
    return pick;
  }

  const DEFAULT_NAMES = ["Poop67 💩", "Daddy"];

  function renderNameInputs() {
    const wrap = document.getElementById("wof-name-inputs");
    wrap.innerHTML = "";
    for (let i = 1; i <= wof.playerCount; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = "wof-name-" + i;
      input.placeholder = "Player " + i + " name";
      input.value = DEFAULT_NAMES[i - 1] || "Player " + i;
      wrap.appendChild(input);
    }
  }

  function setupOptionsScreen() {
    // Rounds toggle
    document.querySelectorAll(".wof-rounds").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".wof-rounds").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        wof.totalRounds = parseInt(btn.dataset.rounds, 10);
      });
    });
    // Player toggle
    document.querySelectorAll(".wof-players").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".wof-players").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        wof.playerCount = parseInt(btn.dataset.players, 10);
        renderNameInputs();
      });
    });
    document.getElementById("btn-wof-back-start").addEventListener("click", () => {
      showScreen("start");
    });
    document.getElementById("btn-wof-start").addEventListener("click", startGame);
    renderNameInputs();
  }

  async function loadPool() {
    if (wof.pool) return;
    const res = await fetch("lyrics.json");
    const data = await res.json();
    wof.pool = data.wheel;
  }

  async function startGame() {
    await loadPool();
    wof.usedPuzzles = new Set();
    const names = [];
    for (let i = 1; i <= wof.playerCount; i++) {
      names.push(document.getElementById("wof-name-" + i).value || "Player " + i);
    }
    const first = pickPuzzle();
    wof.state = WheelState.createInitialState({
      puzzle: first.text,
      category: first.category,
      playerNames: names,
      totalRounds: wof.totalRounds,
    });
    showScreen("wof-play");
    ensureWheel();
    setZoomed(false);
    render();
  }

  function ensureWheel() {
    if (wof.wheel) { wof.wheel.resize(); return; }
    const canvas = document.getElementById("wof-wheel");
    wof.wheel = new WheelCanvas(canvas, WEDGES, {
      onStop: onWheelStop,
      onTick: onWheelTick,
    });
    attachSwipeToSpin(canvas);
  }

  function attachSwipeToSpin(target) {
    let startX = 0, startY = 0, startTime = 0, tracking = false;
    const begin = (x, y) => {
      startX = x; startY = y; startTime = performance.now(); tracking = true;
    };
    const end = (x, y) => {
      if (!tracking) return;
      tracking = false;
      const dx = x - startX;
      const dy = y - startY;
      const dist = Math.hypot(dx, dy);
      const elapsed = performance.now() - startTime;
      if (dist > 30 && elapsed < 600 && wof.state && wof.state.phase === "spin" && !wof.wheel.spinning) {
        beginSpin();
      }
    };
    target.addEventListener("touchstart", (e) => {
      const t = e.changedTouches[0];
      begin(t.clientX, t.clientY);
    }, { passive: true });
    target.addEventListener("touchend", (e) => {
      const t = e.changedTouches[0];
      end(t.clientX, t.clientY);
    }, { passive: true });
    target.addEventListener("mousedown", (e) => begin(e.clientX, e.clientY));
    target.addEventListener("mouseup", (e) => end(e.clientX, e.clientY));
  }

  function onWheelStop(wedge) {
    if (window.Sound) {
      if (wedge.type === "bankrupt") window.Sound.bankrupt();
      else if (wedge.type === "loseTurn") window.Sound.loseTurn();
    }
    wof.state = WheelState.resolveSpin(wof.state, wedge);
    render();
  }

  function onWheelTick() {
    if (window.Sound) window.Sound.tick();
    const pointer = document.querySelector(".wof-pointer");
    if (!pointer) return;
    pointer.classList.add("bounce");
    setTimeout(() => pointer.classList.remove("bounce"), 60);
  }

  const CATEGORY_LABELS = {
    songTitles: "SONG TITLE",
    phrases: "PHRASE",
    characters: "CHARACTER",
    locations: "LOCATION",
    // allow callers to pass the singular form too
    songTitle: "SONG TITLE",
    phrase: "PHRASE",
    character: "CHARACTER",
    location: "LOCATION",
  };

  function renderBoard(targetEl, puzzle, revealed, justRevealed) {
    targetEl.innerHTML = "";
    // Word-based rows: split on spaces, keep words intact, wrap whole words.
    const words = puzzle.split(" ");
    const row = document.createElement("div");
    row.className = "wof-board-row";
    row.style.flexWrap = "wrap";
    let delayCount = 0;
    for (let w = 0; w < words.length; w++) {
      const wordWrap = document.createElement("div");
      wordWrap.style.display = "flex";
      wordWrap.style.gap = "4px";
      wordWrap.style.margin = "2px 6px";
      for (const ch of words[w]) {
        const tile = document.createElement("div");
        tile.className = "wof-tile";
        if (revealed.has(ch)) {
          tile.textContent = ch;
          if (justRevealed && ch === justRevealed) {
            tile.classList.add("revealing");
            tile.style.animationDelay = (delayCount * 120) + "ms";
            delayCount++;
          }
        } else {
          tile.classList.add("blank");
          tile.textContent = "";
        }
        wordWrap.appendChild(tile);
      }
      row.appendChild(wordWrap);
    }
    targetEl.appendChild(row);
  }

  function renderScores(targetEl, state) {
    targetEl.innerHTML = "";
    state.players.forEach((p, i) => {
      const card = document.createElement("div");
      card.className = "wof-score-card" + (i === state.currentPlayer ? " active" : "");
      card.innerHTML = `
        <div class="name">${p.name}</div>
        <div class="round-label">This Round</div>
        <div class="round">${p.roundScore}</div>
        <div class="total">Banked: ${p.totalScore}</div>
      `;
      targetEl.appendChild(card);
    });
  }

  function renderLetterGrid(state) {
    const wrap = document.getElementById("wof-letters");
    wrap.innerHTML = "";
    if (state.phase !== "guessConsonant" && state.phase !== "guessVowel") {
      wrap.classList.add("hidden");
      return;
    }
    wrap.classList.remove("hidden");
    const CONSONANTS = "BCDFGHJKLMNPQRSTVWXYZ".split("");
    const VOWELS = "AEIOU".split("");
    const letters = state.phase === "guessConsonant" ? CONSONANTS : VOWELS;
    for (const L of letters) {
      const btn = document.createElement("button");
      btn.className = "wof-letter";
      btn.textContent = L;
      btn.disabled = state.usedLetters.has(L);
      btn.addEventListener("click", () => onLetter(L));
      wrap.appendChild(btn);
    }
  }

  function onLetter(letter) {
    const wasRevealed = wof.state.revealed.has(letter);
    const wasUsed = wof.state.usedLetters.has(letter);
    if (wof.state.phase === "guessConsonant") {
      wof.state = WheelState.guessConsonant(wof.state, letter);
    } else if (wof.state.phase === "guessVowel") {
      wof.state = WheelState.guessVowel(wof.state, letter);
    }
    if (!wasRevealed && wof.state.revealed.has(letter)) {
      wof.justRevealed = letter;
      if (window.Sound) window.Sound.correct();
    } else if (!wasUsed && wof.state.usedLetters.has(letter)) {
      if (window.Sound) window.Sound.wrong();
    }
    afterStateChange();
    wof.justRevealed = null;
  }

  function afterStateChange() {
    if (wof.state.phase === "roundEnd") {
      if (window.Sound) window.Sound.win();
      setZoomed(false);
      renderRoundEnd();
      showScreen("wof-round-end");
      return;
    }
    if (wof.state.phase === "gameOver") {
      setZoomed(false);
      renderGameOver();
      showScreen("wof-game-over");
      return;
    }
    render();
  }

  function render() {
    const s = wof.state;
    document.getElementById("wof-category").textContent = CATEGORY_LABELS[s.category] || "";
    renderBoard(document.getElementById("wof-board"), s.puzzle, s.revealed, wof.justRevealed);
    renderScores(document.getElementById("wof-scores"), s);
    const statusEl = document.getElementById("wof-status");
    const newMessage = s.lastMessage || "";
    if (newMessage && newMessage !== statusEl.textContent) {
      statusEl.classList.remove("flash");
      void statusEl.offsetWidth;
      statusEl.classList.add("flash");
    }
    statusEl.textContent = newMessage;

    const spinBtn = document.getElementById("btn-wof-spin");
    const actions = document.getElementById("wof-actions");
    const vowelBtn = document.getElementById("btn-wof-vowel");
    const solveBtn = document.getElementById("btn-wof-solve");
    const solveInput = document.getElementById("wof-solve-input");

    spinBtn.classList.toggle("hidden", s.phase !== "spin");
    actions.classList.toggle("hidden", s.phase !== "guessConsonant" && s.phase !== "guessVowel");
    solveInput.classList.toggle("active", s.phase === "solve");

    const currentPlayer = s.players[s.currentPlayer];
    const allVowelsUsed = ["A", "E", "I", "O", "U"].every((v) => s.usedLetters.has(v));
    vowelBtn.disabled = s.phase !== "guessConsonant"
      || currentPlayer.roundScore < WheelState.VOWEL_COST
      || allVowelsUsed;
    solveBtn.disabled = s.phase !== "guessConsonant" && s.phase !== "guessVowel";

    renderLetterGrid(s);
  }

  function renderRoundEnd() {
    const s = wof.state;
    const title = document.getElementById("wof-round-end-title");
    if (s.roundWinner != null) {
      title.textContent = `${s.players[s.roundWinner].name} solved it!`;
    } else {
      title.textContent = "Round over";
    }
    renderBoard(
      document.getElementById("wof-round-end-phrase"),
      s.puzzle,
      new Set(s.puzzle.split(""))
    );
    renderFinalScores(document.getElementById("wof-round-end-scores"), s);
  }

  function renderFinalScores(targetEl, state) {
    targetEl.innerHTML = "";
    const sorted = state.players.slice().sort((a, b) => b.totalScore - a.totalScore);
    const winner = sorted.length > 1 && sorted[0].totalScore !== sorted[1].totalScore ? sorted[0].name : null;
    state.players.forEach((p, i) => {
      const card = document.createElement("div");
      const isWinner = winner && p.name === winner;
      card.className = "wof-score-card" + (isWinner ? " active" : "");
      card.innerHTML = `
        <div class="name">${p.name}</div>
        <div class="round-label">Total</div>
        <div class="round">${p.totalScore}</div>
        <div class="total">This Round: ${p.roundScore}</div>
      `;
      targetEl.appendChild(card);
    });
  }

  function renderGameOver() {
    renderFinalScores(document.getElementById("wof-final-scores"), wof.state);
  }

  function setZoomed(flag) {
    const play = document.getElementById("screen-wof-play");
    play.classList.toggle("zoomed", !!flag);
    if (wof.wheel) wof.wheel.setZoomed(!!flag);
  }

  function beginSpin() {
    if (wof.state.phase !== "spin" || wof.wheel.spinning) return;
    setZoomed(true);
    document.getElementById("btn-wof-spin").classList.add("hidden");
    wof.wheel.spin();
  }

  function setupPlayScreen() {
    const muteBtn = document.getElementById("btn-wof-mute");
    if (muteBtn && window.Sound) {
      muteBtn.textContent = window.Sound.isMuted() ? "🔇" : "🔊";
      muteBtn.addEventListener("click", () => {
        const m = window.Sound.toggle();
        muteBtn.textContent = m ? "🔇" : "🔊";
      });
    }
    document.getElementById("btn-wof-spin").addEventListener("click", beginSpin);
    document.getElementById("btn-wof-vowel").addEventListener("click", () => {
      wof.state = WheelState.buyVowel(wof.state);
      afterStateChange();
    });
    document.getElementById("btn-wof-solve").addEventListener("click", () => {
      wof.state = WheelState.startSolve(wof.state);
      afterStateChange();
    });
    document.getElementById("btn-wof-solve-submit").addEventListener("click", () => {
      const text = document.getElementById("wof-solve-text").value;
      wof.state = WheelState.attemptSolve(wof.state, text);
      document.getElementById("wof-solve-text").value = "";
      afterStateChange();
    });
    document.getElementById("btn-wof-solve-cancel").addEventListener("click", () => {
      const restorePhase = wof.state.preSolvePhase || "guessConsonant";
      wof.state = { ...wof.state, phase: restorePhase, preSolvePhase: null, lastMessage: "" };
      document.getElementById("wof-solve-text").value = "";
      render();
    });
    document.getElementById("btn-wof-next-round").addEventListener("click", () => {
      const next = pickPuzzle();
      wof.state = WheelState.startNextRound(wof.state, {
        puzzle: next.text,
        category: next.category,
      });
      if (wof.state.phase === "gameOver") {
        renderGameOver();
        showScreen("wof-game-over");
      } else {
        render();
        showScreen("wof-play");
        wof.wheel.resize();
      }
    });
    document.getElementById("btn-wof-play-again").addEventListener("click", () => {
      showScreen("wof-options");
    });
    document.getElementById("btn-wof-home").addEventListener("click", () => {
      showScreen("start");
    });
  }

  function init() {
    setupOptionsScreen();
    setupPlayScreen();
    if (location.search.includes("debug")) {
      window.__wof = wof;
      window.__wofForceState = (s) => { wof.state = s; afterStateChange(); };
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
