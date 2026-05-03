const state = {
  mode: "solo",           // "solo" or "two-player"
  songMode: "pick",       // "pick" or "random"
  lyricOrder: "in-order", // "in-order" or "shuffled"
  songs: [],
  currentSong: null,
  currentLyricIndex: 0,
  lyricIndices: [],       // order to play lyrics in (supports shuffled mode)
  timerSeconds: 45,
  timerInterval: null,
  usedHint: false,
  scores: { player1: 0, player2: 0 },
  currentPlayer: 1,
};

// --- Screen Management ---

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById("screen-" + id).classList.add("active");
}

// --- Init ---

async function init() {
  const res = await fetch("lyrics.json");
  state.songs = (await res.json()).songs;

  // Top-level mode picker
  document.getElementById("btn-mode-scramble").addEventListener("click", () => {
    showScreen("scramble-menu");
  });
  document.getElementById("btn-mode-wheel").addEventListener("click", () => {
    showScreen("wof-options");
  });
  document.getElementById("btn-scramble-back").addEventListener("click", () => {
    showScreen("start");
  });

  document.getElementById("btn-solo").addEventListener("click", () => {
    state.mode = "solo";
    showScreen("options");
  });

  document.getElementById("btn-two-player").addEventListener("click", () => {
    state.mode = "two-player";
    showScreen("options");
  });

  // Options screen toggles
  setupToggle("btn-pick-song", "btn-random-song", (id) => {
    state.songMode = id === "btn-pick-song" ? "pick" : "random";
  });
  setupToggle("btn-lyrics-order", "btn-lyrics-random", (id) => {
    state.lyricOrder = id === "btn-lyrics-order" ? "in-order" : "shuffled";
  });

  document.getElementById("btn-options-go").addEventListener("click", () => {
    if (state.songMode === "pick") {
      showSongSelect();
    } else {
      pickRandomSongAndStart();
    }
  });

  document.getElementById("btn-back-start").addEventListener("click", () => {
    showScreen("start");
  });

  document.getElementById("btn-back-options").addEventListener("click", () => {
    showScreen("options");
  });

  document.getElementById("btn-done").addEventListener("click", endRound);
  document.getElementById("btn-hint").addEventListener("click", useHint);
  document.getElementById("btn-next-round").addEventListener("click", nextRound);
  document.getElementById("btn-play-again").addEventListener("click", () => {
    showScreen("start");
  });
  document.getElementById("btn-start-turn").addEventListener("click", () => {
    startRound();
  });
}

// --- Song Select ---

function initGame(song) {
  state.currentSong = song;
  state.currentLyricIndex = 0;
  // Build lyric indices based on order mode
  const indices = song.lyrics.map((_, i) => i);
  state.lyricIndices = state.lyricOrder === "shuffled" ? shuffle([...indices]) : indices;
  if (state.mode === "two-player") {
    state.scores = { player1: 0, player2: 0 };
    state.currentPlayer = 1;
  } else {
    state.scores = { player1: 0 };
  }
  startRound();
}

function showSongSelect() {
  const list = document.getElementById("song-list");
  list.innerHTML = "";
  state.songs.forEach((song) => {
    const btn = document.createElement("button");
    btn.textContent = song.title;
    btn.addEventListener("click", () => initGame(song));
    list.appendChild(btn);
  });
  showScreen("song-select");
}

function pickRandomSongAndStart() {
  const song = state.songs[Math.floor(Math.random() * state.songs.length)];
  initGame(song);
}

// --- Round ---

function getCurrentLyric() {
  return state.currentSong.lyrics[state.lyricIndices[state.currentLyricIndex]];
}

function startRound() {
  const lyric = getCurrentLyric();
  const words = lyric.split(" ");
  const scrambled = shuffle([...words]);

  // Set up header
  const songTitle = state.songMode === "random" ? "???" : state.currentSong.title;
  document.getElementById("round-song-title").textContent = songTitle;
  document.getElementById("round-counter").textContent =
    (state.currentLyricIndex + 1) + " / " + state.currentSong.lyrics.length;

  // Set up word bank
  const wordBank = document.getElementById("word-bank");
  wordBank.innerHTML = "";
  scrambled.forEach(word => {
    const tile = document.createElement("div");
    tile.className = "word-tile";
    tile.textContent = word;
    wordBank.appendChild(tile);
  });

  // Clear drop zone
  const dropZone = document.getElementById("drop-zone");
  dropZone.innerHTML = '<p class="drop-hint">Drag words here</p>';

  // Set up hint button
  state.usedHint = false;
  const hintBtn = document.getElementById("btn-hint");
  hintBtn.disabled = !state.currentSong.youtubeId;
  hintBtn.textContent = "🎵 Hint";
  document.getElementById("hint-container").innerHTML = "";

  // Init drag
  cleanupDrag();
  initDrag(wordBank, dropZone);

  // Start timer
  startTimer();
  showScreen("round");
}

function startTimer() {
  let remaining = state.timerSeconds;
  const timerEl = document.getElementById("timer");
  timerEl.textContent = formatTime(remaining);

  clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    remaining--;
    timerEl.textContent = formatTime(remaining);
    if (remaining <= 0) {
      clearInterval(state.timerInterval);
      endRound();
    }
  }, 1000);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m + ":" + String(s).padStart(2, "0");
}

// --- Hint ---

function useHint() {
  if (state.usedHint || !state.currentSong.youtubeId) return;
  state.usedHint = true;

  const container = document.getElementById("hint-container");
  container.innerHTML =
    '<p class="volume-reminder">Turn your volume up!</p>' +
    '<iframe src="https://www.youtube.com/embed/' + state.currentSong.youtubeId +
    '?autoplay=1" frameborder="0" allow="autoplay" allowfullscreen></iframe>';

  setTimeout(() => {
    container.innerHTML = "";
  }, 3000);

  const hintBtn = document.getElementById("btn-hint");
  hintBtn.disabled = true;
  hintBtn.textContent = "🎵 Hint used";
}

// --- Scoring ---

function endRound() {
  clearInterval(state.timerInterval);
  document.getElementById("hint-container").innerHTML = "";
  cleanupDrag();

  const lyric = getCurrentLyric();
  const correctWords = lyric.split(" ");
  const playerWords = getDropZoneWords();

  let correctCount = 0;
  const results = correctWords.map((word, i) => {
    const isCorrect = playerWords[i] === word;
    if (isCorrect) correctCount++;
    return { word, playerWord: playerWords[i] || "", isCorrect };
  });

  // Points: 100 per correct word, bonus 200 for all correct
  let points = correctCount * 100;
  if (correctCount === correctWords.length) {
    points += 200;
  }

  // Hint penalty: lose 10% of possible points
  if (state.usedHint) {
    const maxPoints = correctWords.length * 100 + 200;
    points = Math.max(0, points - Math.round(maxPoints * 0.1));
  }

  // Update score
  const playerKey = state.mode === "two-player" ? ("player" + state.currentPlayer) : "player1";
  state.scores[playerKey] += points;

  // Show score screen — player's answer
  const scoreLyric = document.getElementById("score-lyric");
  scoreLyric.innerHTML = "";
  results.forEach(r => {
    const tile = document.createElement("div");
    tile.className = "word-tile " + (r.isCorrect ? "correct" : "incorrect");
    tile.textContent = r.playerWord || "—";
    scoreLyric.appendChild(tile);
  });

  // Show correct answer
  const scoreCorrect = document.getElementById("score-correct");
  scoreCorrect.innerHTML = "";
  correctWords.forEach(word => {
    const tile = document.createElement("div");
    tile.className = "word-tile correct";
    tile.textContent = word;
    scoreCorrect.appendChild(tile);
  });

  document.getElementById("score-points").textContent = "+" + points + " points";

  // Perfect score animation
  if (correctCount === correctWords.length) {
    showPerfectAnimation();
  }

  // Update next button text
  const isLastLyric = state.currentLyricIndex >= state.currentSong.lyrics.length - 1;
  const nextBtn = document.getElementById("btn-next-round");

  if (state.mode === "two-player" && state.currentPlayer === 1 && isLastLyric) {
    nextBtn.textContent = "Player 2's Turn";
  } else if (isLastLyric) {
    nextBtn.textContent = "See Final Score";
  } else {
    nextBtn.textContent = "Next Lyric";
  }

  showScreen("score");
}

// --- Next Round / End ---

function nextRound() {
  const isLastLyric = state.currentLyricIndex >= state.currentSong.lyrics.length - 1;

  if (!isLastLyric) {
    state.currentLyricIndex++;
    startRound();
    return;
  }

  // Last lyric done
  if (state.mode === "two-player" && state.currentPlayer === 1) {
    // Switch to player 2 — same lyric order so it's fair
    state.currentPlayer = 2;
    state.currentLyricIndex = 0;
    // lyricIndices stays the same so both players get same lyrics
    document.getElementById("turn-title").textContent = "Player 2's Turn!";
    showScreen("turn");
    return;
  }

  // Game over
  showEndScreen();
}

function showEndScreen() {
  const endScores = document.getElementById("end-scores");
  const endTitle = document.getElementById("end-title");

  if (state.mode === "two-player") {
    const p1 = state.scores.player1;
    const p2 = state.scores.player2;
    endScores.innerHTML =
      "Player 1: " + p1 + " pts<br>Player 2: " + p2 + " pts";
    if (p1 > p2) {
      endTitle.textContent = "Player 1 Wins!";
    } else if (p2 > p1) {
      endTitle.textContent = "Player 2 Wins!";
    } else {
      endTitle.textContent = "It's a Tie!";
    }
  } else {
    endTitle.textContent = "Great Job!";
    endScores.innerHTML = "Final Score: " + state.scores.player1 + " pts";
  }

  showScreen("end");
}

// --- Perfect Score Animation ---

function showPerfectAnimation() {
  const overlay = document.createElement("div");
  overlay.className = "perfect-overlay";

  // Banner
  const banner = document.createElement("div");
  banner.className = "perfect-banner";
  banner.textContent = "PERFECT!";
  overlay.appendChild(banner);

  // Stars
  const stars = ["⭐", "🌟", "✨", "💫"];
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  for (let i = 0; i < 20; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.textContent = stars[i % stars.length];
    star.style.left = cx + "px";
    star.style.top = cy + "px";
    const angle = (i / 20) * Math.PI * 2;
    const dist = 120 + Math.random() * 160;
    star.style.setProperty("--tx", Math.cos(angle) * dist + "px");
    star.style.setProperty("--ty", Math.sin(angle) * dist + "px");
    star.style.animationDelay = (Math.random() * 0.3) + "s";
    overlay.appendChild(star);
  }

  // Confetti
  const colors = ["#e94560", "#ffd700", "#27ae60", "#3498db", "#f39c12", "#9b59b6"];
  for (let i = 0; i < 50; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * window.innerWidth + "px";
    c.style.backgroundColor = colors[i % colors.length];
    c.style.setProperty("--fall", (window.innerHeight + 40) + "px");
    c.style.setProperty("--spin", (Math.random() * 1080 - 540) + "deg");
    c.style.animationDuration = (1.5 + Math.random() * 1.5) + "s";
    c.style.animationDelay = (Math.random() * 0.8) + "s";
    overlay.appendChild(c);
  }

  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 3500);
}

// --- Helpers ---

function setupToggle(btnAId, btnBId, onChange) {
  const btnA = document.getElementById(btnAId);
  const btnB = document.getElementById(btnBId);
  btnA.addEventListener("click", () => {
    btnA.classList.add("active");
    btnB.classList.remove("active");
    onChange(btnAId);
  });
  btnB.addEventListener("click", () => {
    btnB.classList.add("active");
    btnA.classList.remove("active");
    onChange(btnBId);
  });
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- Start ---

init();
