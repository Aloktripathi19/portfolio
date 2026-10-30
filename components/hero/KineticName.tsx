"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ease } from "../Reveal";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&@$*+/<>";
const BASE = 300;
const PEAK = 800;
const INFLUENCE = 340; // px

type Props = { play: boolean; aside?: React.ReactNode };

/**
 * The hero name. Letters decode from random glyphs, then each one's
 * variable-font weight swells toward the pointer. With no pointer
 * activity (or on touch), a weight wave rolls through the name.
 */
export default function KineticName({ play, aside }: Props) {
  const letters = useRef<HTMLSpanElement[]>([]);
  const root = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!play) return;
    const els = letters.current.filter(Boolean);
    const finals = els.map((e) => e.dataset.ch ?? "");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const level = els.map(() => 0);
    const settleAt = els.map((_, i) => 280 + i * 75);
    const introEnd = settleAt[settleAt.length - 1] + 200;
    let mx = -9999;
    let my = -9999;
    let lastMove = -Infinity;
    let visible = true;
    let raf = 0;
    const t0 = performance.now();

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX;
      my = e.clientY;
      lastMove = performance.now();
    };
    const onLeave = () => (lastMove = -Infinity);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (root.current) io.observe(root.current);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = now - t0;
      const idle = now - lastMove > 2200;

      // read phase
      const targets = els.map((el, i) => {
        if (t < introEnd) return 0;
        if (idle) {
          const s = Math.sin(now / 520 - i * 0.6);
          return s > 0 ? Math.pow(s, 8) * 0.85 : 0;
        }
        const r = el.getBoundingClientRect();
        const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
        const f = Math.max(0, 1 - d / INFLUENCE);
        return f * f * (3 - 2 * f);
      });

      // write phase
      els.forEach((el, i) => {
        if (t < settleAt[i]) {
          if (Math.random() < 0.55) el.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        } else if (el.textContent !== finals[i]) {
          el.textContent = finals[i];
        }
        level[i] += (targets[i] - level[i]) * 0.14;
        const k = level[i];
        el.style.fontWeight = String(Math.round(BASE + (PEAK - BASE) * k));
        // Snap to signal near the peak (a CSS transition softens it), since blending black→orange reads as brown.
        const hot = k > 0.62;
        if (hot !== (el.dataset.hot === "1")) {
          el.dataset.hot = hot ? "1" : "0";
          el.style.color = hot ? "#ff4f1f" : "";
        }
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      els.forEach((el, i) => {
        el.textContent = finals[i];
        el.style.fontWeight = "";
        el.style.color = "";
        delete el.dataset.hot;
      });
    };
  }, [play]);

  let n = 0;
  const word = (text: string, start: number) => (
    <span className="inline-flex" aria-hidden>
      {text.split("").map((ch, i) => {
        const idx = n++;
        return (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: "110%", rotate: 8 }}
              animate={play ? { y: 0, rotate: 0 } : undefined}
              transition={{ duration: 1, delay: start + i * 0.045, ease }}
            >
              <span
                ref={(el) => {
                  if (el) letters.current[idx] = el;
                }}
                data-ch={ch}
                className="inline-block transition-colors duration-300"
              >
                {ch}
              </span>
            </motion.span>
          </span>
        );
      })}
    </span>
  );

  return (
    <h1
      ref={root}
      aria-label="Alok Ram Tripathi"
      className="font-display text-[clamp(3.2rem,13vw,12.5rem)] leading-[0.88] font-light tracking-[-0.045em] text-ink uppercase select-none"
    >
      <span className="block whitespace-nowrap">
        {word("ALOK", 0.1)} {word("RAM", 0.3)}
      </span>
      <span className="flex items-end justify-between gap-4">
        {word("TRIPATHI", 0.45)}
        {aside}
      </span>
    </h1>
  );
}
