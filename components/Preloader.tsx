"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ease } from "./Reveal";

let finished = false;
const listeners = new Set<() => void>();
function markFinished() {
  finished = true;
  listeners.forEach((l) => l());
}

/** True once the intro loader has cleared, so entrance animations start on cue. */
export function usePreloaderDone() {
  const [ready, setReady] = useState(finished);
  useEffect(() => {
    if (finished) return setReady(true);
    const l = () => setReady(true);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return ready;
}

/** Matches the CSS intro length in globals.css (.pl-*). */
const INTRO_MS = 2300;
const MAX_MS = 5000;
const COLS = 5;
const NAME = "ALOK RAM TRIPATHI";
const STACK = ["Next.js", "Python", "PostgreSQL", "pgvector", "OpenAI", "AWS", "Docker", "Flutter", "Shipped."];

/**
 * Intro loader. Everything visible here is driven by CSS keyframes, so it
 * animates from the very first paint, before React hydrates. JS only decides
 * when to leave: after the intro has played and the page has loaded, the
 * panel splits into columns that wipe upward.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minMs = reduce ? 400 : INTRO_MS;
    let timer = 0;

    const leave = () => {
      // performance.now() counts from navigation start, so slow hydration eats into the wait
      const remaining = Math.max(0, minMs - performance.now());
      timer = window.setTimeout(() => setDone(true), remaining);
    };
    if (document.readyState === "complete") leave();
    else window.addEventListener("load", leave, { once: true });
    // Safety cap: never hold the page hostage to a slow asset or a load event that doesn't come.
    const cap = window.setTimeout(() => setDone(true), Math.max(0, MAX_MS - performance.now()));

    return () => {
      clearTimeout(timer);
      clearTimeout(cap);
      window.removeEventListener("load", leave);
      html.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    document.documentElement.style.overflow = "";
    markFinished();
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100]"
          exit={{ pointerEvents: "none", transition: { duration: 1.3 } }}
          aria-busy="true"
          aria-label="Loading"
        >
          {/* Wipe columns: orange underlay trails the ink layer */}
          {Array.from({ length: COLS }).map((_, i) => (
            <div key={i} className="absolute top-0 h-full" style={{ left: `${(i * 100) / COLS}%`, width: `${100 / COLS + 0.2}%` }}>
              <motion.div
                className="absolute inset-0 bg-signal"
                exit={{ y: "-100%" }}
                transition={{ duration: 0.85, delay: 0.18 + i * 0.07, ease: [0.76, 0, 0.24, 1] }}
              />
              <motion.div
                className="absolute inset-0 bg-ink"
                exit={{ y: "-100%" }}
                transition={{ duration: 0.85, delay: i * 0.07, ease: [0.76, 0, 0.24, 1] }}
              />
            </div>
          ))}

          <motion.div
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.35, ease }}
            className="relative flex h-full flex-col justify-between p-6 text-paper md:p-10"
          >
            {/* top bar */}
            <div className="pl-fade flex items-center justify-between gap-4 font-mono text-[11px] tracking-[0.2em] text-paper/50 uppercase">
              <span className="flex items-center gap-2">
                <span className="pl-pulse inline-block h-2 w-2 bg-signal" />
                Portfolio · 2026
              </span>
              <span className="hidden sm:inline">Full-stack · AI · Cloud</span>
              <span>India</span>
            </div>

            {/* center: name + stack ticker */}
            <div className="flex flex-col items-start gap-6">
              <p className="font-display text-[clamp(2.2rem,7vw,6rem)] leading-none font-light tracking-[-0.04em] uppercase">
                {NAME.split("").map((ch, i) => (
                  <span key={i} className="inline-block overflow-hidden align-bottom">
                    <span className="pl-rise inline-block" style={{ animationDelay: `${120 + i * 35}ms` }}>
                      {ch === " " ? " " : ch}
                    </span>
                  </span>
                ))}
              </p>
              <div className="pl-fade flex items-center gap-3 font-mono text-sm text-paper/60 md:text-base" style={{ animationDelay: "500ms" }}>
                <span className="text-signal">&gt;</span>
                <span>loading</span>
                <span className="relative inline-block h-[1.4em] overflow-hidden text-paper">
                  <span className="pl-ticker flex flex-col">
                    {STACK.map((s) => (
                      <span key={s} className="h-[1.4em] leading-[1.4em] whitespace-nowrap">
                        {s}
                      </span>
                    ))}
                  </span>
                </span>
              </div>
            </div>

            {/* bottom: progress + counter */}
            <div>
              <div className="flex items-end justify-between gap-6">
                <span className="pl-fade mb-3 font-serif text-xl text-paper/60 italic md:text-3xl" style={{ animationDelay: "300ms" }}>
                  building &amp; shipping
                </span>
                <span className="font-display text-[22vw] leading-[0.78] font-bold tracking-[-0.06em] tabular-nums md:text-[13vw]">
                  <span className="pl-count" />
                  <span className="text-signal">%</span>
                </span>
              </div>
              <div className="mt-5 h-[2px] w-full bg-paper/10">
                <div className="pl-bar h-full bg-signal" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
