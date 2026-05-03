// Pure geometry helpers for the wheel. No DOM, no canvas — safe to require() in Node.

function angleToWedgeIndex(angleDegrees, wedgeCount) {
  const wedgeSize = 360 / wedgeCount;
  // Wedges are center-aligned: at currentAngle=0 wedge 0's CENTER sits at
  // the pointer, and wedge i covers [center - wedgeSize/2, center + wedgeSize/2].
  // Shift by half a wedge so the "fromPointer" buckets align with wedge edges.
  const normalized = ((angleDegrees % 360) + 360) % 360;
  const fromPointer = ((360 - normalized) + wedgeSize / 2) % 360;
  return Math.floor(fromPointer / wedgeSize) % wedgeCount;
}

function easeOutCubic(t) {
  const inv = 1 - t;
  return 1 - inv * inv * inv;
}

// rng: function returning a number in [0, 1) — same contract as Math.random().
function pickSpinTarget(currentAngle, wedgeCount, rng) {
  const wedgeSize = 360 / wedgeCount;
  const extraRotations = 5 + Math.floor(rng() * 4); // 5..8 full rotations
  const targetWedgeIndex = Math.floor(rng() * wedgeCount);
  // Offset from the wedge center, within ±30% of the wedge width so the
  // pointer lands clearly inside the target wedge's visual span (which
  // extends ±50% from center). Keeps a 20% safety margin from each edge.
  const offset = wedgeSize * (rng() - 0.5) * 0.6;
  // Wedge i's center is at the pointer when currentAngle ≡ -i*wedgeSize (mod 360).
  // Add `offset` to nudge the landing position within the wedge.
  const targetNormalized = ((-targetWedgeIndex * wedgeSize + offset) % 360 + 360) % 360;
  const base = currentAngle + extraRotations * 360;
  const baseNormalized = ((base % 360) + 360) % 360;
  let delta = targetNormalized - baseNormalized;
  if (delta < 0) delta += 360;
  const targetAngle = base + delta;
  return { targetAngle, targetWedgeIndex };
}

// Dual export: browser attaches to window, Node uses module.exports.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { angleToWedgeIndex, easeOutCubic, pickSpinTarget };
} else if (typeof window !== "undefined") {
  window.WheelMath = { angleToWedgeIndex, easeOutCubic, pickSpinTarget };
}
