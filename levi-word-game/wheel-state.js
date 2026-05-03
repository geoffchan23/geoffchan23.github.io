// Pure game state reducer for Wheel of Fortune. No DOM, no side effects.

const VOWEL_COST = 250;
const VOWELS = new Set(["A", "E", "I", "O", "U"]);

function createInitialState({ puzzle, category, playerNames, totalRounds }) {
  return {
    puzzle,
    category,
    revealed: new Set(),
    usedLetters: new Set(),
    players: playerNames.map((name) => ({
      name,
      roundScore: 0,
      totalScore: 0,
    })),
    currentPlayer: 0,
    round: 1,
    totalRounds,
    phase: "spin",
    currentWedge: null,
    lastMessage: "",
  };
}

function advancePlayer(state) {
  const next = { ...state };
  next.players = state.players.map((p) => ({ ...p }));
  next.currentPlayer = (state.currentPlayer + 1) % state.players.length;
  return next;
}

function resolveSpin(state, wedge) {
  if (wedge.type === "bankrupt") {
    const next = advancePlayer(state);
    next.players[state.currentPlayer].roundScore = 0;
    next.phase = "spin";
    next.currentWedge = null;
    next.lastMessage = "Bankrupt!";
    return next;
  }
  if (wedge.type === "loseTurn") {
    const next = advancePlayer(state);
    next.phase = "spin";
    next.currentWedge = null;
    next.lastMessage = "Lose a turn!";
    return next;
  }
  // points
  return {
    ...state,
    players: state.players.map((p) => ({ ...p })),
    phase: "guessConsonant",
    currentWedge: { ...wedge },
    lastMessage: `Pick a consonant (${wedge.value} per letter)`,
  };
}

function isVowel(letter) {
  return VOWELS.has(letter);
}

function countOccurrences(puzzle, letter) {
  let count = 0;
  for (const ch of puzzle) if (ch === letter) count++;
  return count;
}

function isPuzzleFullyRevealed(puzzle, revealed) {
  for (const ch of puzzle) {
    if (ch === " ") continue;
    if (!revealed.has(ch)) return false;
  }
  return true;
}

function completeRound(state, players) {
  const winner = state.currentPlayer;
  const nextPlayers = players.map((p) => ({ ...p }));
  nextPlayers[winner].totalScore += nextPlayers[winner].roundScore;
  return {
    ...state,
    players: nextPlayers,
    phase: "roundEnd",
    roundWinner: winner,
    revealed: new Set(state.puzzle.split("").filter((c) => c !== " ")),
    currentWedge: null,
    lastMessage: `${nextPlayers[winner].name} revealed it!`,
  };
}

function guessConsonant(state, letter) {
  if (state.phase !== "guessConsonant") return state;
  if (isVowel(letter)) return state;
  if (state.usedLetters.has(letter)) return state;
  const count = countOccurrences(state.puzzle, letter);
  const usedLetters = new Set(state.usedLetters);
  usedLetters.add(letter);
  if (count > 0) {
    const revealed = new Set(state.revealed);
    revealed.add(letter);
    const players = state.players.map((p) => ({ ...p }));
    players[state.currentPlayer].roundScore += state.currentWedge.value * count;
    if (isPuzzleFullyRevealed(state.puzzle, revealed)) {
      return completeRound({ ...state, revealed, usedLetters }, players);
    }
    return {
      ...state,
      revealed,
      usedLetters,
      players,
      phase: "spin",
      currentWedge: null,
      lastMessage: `+${state.currentWedge.value * count}`,
    };
  }
  // Wrong letter
  const next = advancePlayer(state);
  next.usedLetters = usedLetters;
  next.phase = "spin";
  next.currentWedge = null;
  next.lastMessage = `No ${letter}. Next player.`;
  return next;
}

function buyVowel(state) {
  if (state.phase !== "guessConsonant") return state;
  const player = state.players[state.currentPlayer];
  if (player.roundScore < VOWEL_COST) return state;
  const players = state.players.map((p) => ({ ...p }));
  players[state.currentPlayer].roundScore -= VOWEL_COST;
  return {
    ...state,
    players,
    phase: "guessVowel",
    lastMessage: "Pick a vowel",
  };
}

function guessVowel(state, letter) {
  if (state.phase !== "guessVowel") return state;
  if (!isVowel(letter)) return state;
  if (state.usedLetters.has(letter)) return state;
  const count = countOccurrences(state.puzzle, letter);
  const usedLetters = new Set(state.usedLetters);
  usedLetters.add(letter);
  if (count > 0) {
    const revealed = new Set(state.revealed);
    revealed.add(letter);
    if (isPuzzleFullyRevealed(state.puzzle, revealed)) {
      return completeRound({ ...state, revealed, usedLetters }, state.players);
    }
    return {
      ...state,
      revealed,
      usedLetters,
      phase: "spin",
      currentWedge: null,
      lastMessage: `Revealed ${count} ${letter}${count > 1 ? "s" : ""}`,
    };
  }
  const next = advancePlayer(state);
  next.usedLetters = usedLetters;
  next.phase = "spin";
  next.currentWedge = null;
  next.lastMessage = `No ${letter}. Next player.`;
  return next;
}

function startSolve(state) {
  if (state.phase !== "guessConsonant" && state.phase !== "guessVowel") return state;
  return { ...state, phase: "solve", preSolvePhase: state.phase, lastMessage: "Type your guess" };
}

function normalizeForSolve(text) {
  // Uppercase, strip anything that isn't a letter or space (apostrophes,
  // punctuation, accents), collapse whitespace runs, and trim.
  return text
    .toUpperCase()
    .replace(/[^A-Z ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function attemptSolve(state, guess) {
  if (state.phase !== "solve") return state;
  if (normalizeForSolve(guess) === normalizeForSolve(state.puzzle)) {
    const players = state.players.map((p) => ({ ...p }));
    const winner = state.currentPlayer;
    players[winner].totalScore += players[winner].roundScore;
    return {
      ...state,
      players,
      phase: "roundEnd",
      roundWinner: winner,
      revealed: new Set(state.puzzle.split("").filter((c) => c !== " ")),
      lastMessage: `${players[winner].name} solved it!`,
    };
  }
  const next = advancePlayer(state);
  next.phase = "spin";
  next.currentWedge = null;
  next.lastMessage = "Not quite. Next player.";
  return next;
}

function startNextRound(state, { puzzle, category }) {
  if (state.round >= state.totalRounds) {
    return { ...state, phase: "gameOver", lastMessage: "Game over" };
  }
  return {
    ...state,
    puzzle,
    category,
    revealed: new Set(),
    usedLetters: new Set(),
    players: state.players.map((p) => ({ ...p, roundScore: 0 })),
    round: state.round + 1,
    phase: "spin",
    currentWedge: null,
    roundWinner: undefined,
    lastMessage: "",
  };
}

const exportsObj = {
  createInitialState,
  resolveSpin,
  guessConsonant,
  buyVowel,
  guessVowel,
  startSolve,
  attemptSolve,
  startNextRound,
  isVowel,
  VOWEL_COST,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = exportsObj;
} else if (typeof window !== "undefined") {
  window.WheelState = exportsObj;
}
