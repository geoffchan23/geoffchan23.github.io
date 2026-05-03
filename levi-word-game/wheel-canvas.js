// Browser-only: draws the Wheel of Fortune and runs spin animations.
// Depends on window.WheelMath (loaded from wheel-math.js).

(function () {
  const COLORS = [
    "#e63946", "#f1c453", "#2a9d8f", "#264653",
    "#f4a261", "#ffffff", "#457b9d", "#e76f51",
  ];
  const BANKRUPT_COLOR = "#111111";
  const LOSE_TURN_COLOR = "#ffffff";

  class WheelCanvas {
    constructor(canvas, wedges, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.wedges = wedges;
      this.onStop = options.onStop || (() => {});
      this.onTick = options.onTick || (() => {});
      this.currentAngle = 0;
      this.spinning = false;
      this.lastBoundaryIndex = -1;
      this.zoomed = false;
      this.resize();
      window.addEventListener("resize", () => this.resize());
    }

    setZoomed(flag) {
      this.zoomed = !!flag;
      this.resize();
    }

    resize() {
      const dpr = window.devicePixelRatio || 1;
      const parent = this.canvas.parentElement;
      const parentW = parent.clientWidth || window.innerWidth;
      const cssSize = this.zoomed
        ? Math.min(parentW, 640)
        : Math.min(parentW, window.innerHeight * 0.45, 400);
      this.canvas.style.width = cssSize + "px";
      this.canvas.style.height = cssSize + "px";
      this.canvas.width = cssSize * dpr;
      this.canvas.height = cssSize * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.cssSize = cssSize;
      this.draw();
    }

    wedgeColor(wedge, index) {
      if (wedge.type === "bankrupt") return BANKRUPT_COLOR;
      if (wedge.type === "loseTurn") return LOSE_TURN_COLOR;
      return COLORS[index % COLORS.length];
    }

    wedgeLabel(wedge) {
      if (wedge.type === "bankrupt") return "BUST";
      if (wedge.type === "loseTurn") return "SKIP";
      return String(wedge.value);
    }

    draw() {
      const ctx = this.ctx;
      const size = this.cssSize;
      const cx = size / 2;
      const cy = size / 2;
      const radius = size / 2 - 4;
      const wedgeCount = this.wedges.length;
      const wedgeAngle = (Math.PI * 2) / wedgeCount;

      ctx.clearRect(0, 0, size, size);

      // The canvas angle 0 is at 3 o'clock. We want wedge 0 to sit at the top (12 o'clock)
      // under the pointer when currentAngle is 0. So offset by -π/2 and flip direction:
      // rotating the wheel clockwise by currentAngle degrees ⇒ add to baseline rotation.
      const baseRotation = -Math.PI / 2 + (this.currentAngle * Math.PI) / 180;

      for (let i = 0; i < wedgeCount; i++) {
        const start = baseRotation + i * wedgeAngle - wedgeAngle / 2;
        const end = start + wedgeAngle;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, start, end);
        ctx.closePath();
        ctx.fillStyle = this.wedgeColor(this.wedges[i], i);
        ctx.fill();
        ctx.strokeStyle = "rgba(11, 16, 39, 0.85)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        const labelAngle = start + wedgeAngle / 2;
        ctx.save();
        ctx.translate(cx + Math.cos(labelAngle) * radius * 0.65,
                      cy + Math.sin(labelAngle) * radius * 0.65);
        ctx.rotate(labelAngle + Math.PI / 2);
        ctx.fillStyle = this.wedges[i].type === "bankrupt" ? "#fff" : "#111";
        ctx.font = `bold ${Math.max(10, size * 0.035)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.wedgeLabel(this.wedges[i]), 0, 0);
        ctx.restore();
      }

      // Outer rim
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 2, 0, Math.PI * 2);
      ctx.strokeStyle = "#ffd24b";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Hub
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.12, 0, Math.PI * 2);
      const hubGradient = ctx.createRadialGradient(cx, cy - radius * 0.05, 0, cx, cy, radius * 0.12);
      hubGradient.addColorStop(0, "#ffe89d");
      hubGradient.addColorStop(1, "#c99000");
      ctx.fillStyle = hubGradient;
      ctx.fill();
      ctx.strokeStyle = "#0b1027";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pegs around rim
      const pegCount = wedgeCount;
      for (let i = 0; i < pegCount; i++) {
        const a = baseRotation + i * wedgeAngle + wedgeAngle / 2;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * (radius - 2),
                cy + Math.sin(a) * (radius - 2),
                Math.max(2, size * 0.008),
                0, Math.PI * 2);
        ctx.fillStyle = "#222";
        ctx.fill();
      }
    }

    spin() {
      if (this.spinning) return;
      this.spinning = true;
      const { angleToWedgeIndex, pickSpinTarget, easeOutCubic } = window.WheelMath;
      const { targetAngle, targetWedgeIndex } = pickSpinTarget(
        this.currentAngle, this.wedges.length, Math.random
      );
      const startAngle = this.currentAngle;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const duration = reduced ? 1500 : 4500;
      const startTime = performance.now();
      this.lastBoundaryIndex = angleToWedgeIndex(startAngle, this.wedges.length);

      const tick = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = easeOutCubic(t);
        this.currentAngle = startAngle + (targetAngle - startAngle) * eased;
        this.draw();

        const currentIdx = angleToWedgeIndex(this.currentAngle, this.wedges.length);
        if (currentIdx !== this.lastBoundaryIndex) {
          this.lastBoundaryIndex = currentIdx;
          this.onTick();
        }

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          this.spinning = false;
          this.onStop(this.wedges[targetWedgeIndex]);
        }
      };
      requestAnimationFrame(tick);
    }
  }

  window.WheelCanvas = WheelCanvas;
})();
