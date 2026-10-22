"use client";

import { useEffect, useRef } from "react";

const GAP = 26;
const RADIUS = 190; // cursor influence radius (px)
const PUSH = 22; // max displacement (px)
const INK: [number, number, number] = [17, 17, 16];
const SIGNAL: [number, number, number] = [255, 79, 31];

type Ripple = { x: number; y: number; t0: number };

/**
 * Canvas dot grid that repels from the pointer, glows signal-orange near it,
 * and emits a shockwave ring on click. Pauses when off-screen.
 */
export default function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let mx = -9999;
    let my = -9999;
    let visible = true;
    let raf = 0;
    const ripples: Ripple[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, inside: e.clientY >= r.top && e.clientY <= r.bottom };
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      mx = p.x;
      my = p.y;
    };
    const onLeave = () => {
      mx = -9999;
      my = -9999;
    };
    const onDown = (e: PointerEvent) => {
      const p = local(e);
      if (p.inside && !(e.target as HTMLElement).closest("a, button, [data-sticker]")) {
        ripples.push({ x: p.x, y: p.y, t0: performance.now() });
        if (ripples.length > 4) ripples.shift();
      }
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      // Retire finished ripples
      while (ripples.length && now - ripples[0].t0 > 1800) ripples.shift();

      const cols = Math.ceil(w / GAP) + 1;
      const rows = Math.ceil(h / GAP) + 1;
      const ox = (w - (cols - 1) * GAP) / 2;

      ctx.fillStyle = "rgba(17,17,16,0.16)";
      const active: { x: number; y: number; k: number }[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let x = ox + c * GAP;
          let y = r * GAP + 8;
          // gentle ambient drift
          if (!reduce) y += Math.sin(now / 1400 + c * 0.35 + r * 0.2) * 1.2;

          let k = 0;
          const dx = x - mx;
          const dy = y - my;
          const d = Math.hypot(dx, dy);
          if (d < RADIUS) {
            const f = 1 - d / RADIUS;
            const e = f * f * (3 - 2 * f);
            k = e;
            if (d > 0.01) {
              x += (dx / d) * e * PUSH;
              y += (dy / d) * e * PUSH;
            }
          }
          for (const rp of ripples) {
            const age = now - rp.t0;
            const radius = age * 0.9;
            const rdx = x - rp.x;
            const rdy = y - rp.y;
            const rd = Math.hypot(rdx, rdy);
            const band = 1 - Math.abs(rd - radius) / 46;
            if (band > 0 && rd > 0.01) {
              const fade = 1 - age / 1800;
              const amt = band * fade;
              x += (rdx / rd) * amt * 14;
              y += (rdy / rd) * amt * 14;
              k = Math.max(k, amt);
            }
          }

          if (k > 0.02) active.push({ x, y, k });
          else ctx.fillRect(x - 1, y - 1, 2, 2);
        }
      }

      for (const a of active) {
        const cr = Math.round(INK[0] + (SIGNAL[0] - INK[0]) * a.k);
        const cg = Math.round(INK[1] + (SIGNAL[1] - INK[1]) * a.k);
        const cb = Math.round(INK[2] + (SIGNAL[2] - INK[2]) * a.k);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.18 + a.k * 0.82})`;
        const s = 1 + a.k * 2.6;
        ctx.beginPath();
        ctx.arc(a.x, a.y, s, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (visible) draw(now);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    if (reduce) {
      draw(0);
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="absolute inset-0 -z-10 h-full w-full [mask-image:linear-gradient(to_bottom,black_60%,transparent)]"
    />
  );
}
