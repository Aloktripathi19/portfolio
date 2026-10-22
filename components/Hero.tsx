"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { profile } from "@/lib/data";
import { usePreloaderDone } from "./Preloader";
import { ease } from "./Reveal";
import DotField from "./hero/DotField";
import KineticName from "./hero/KineticName";
import Stickers from "./hero/Stickers";

function RotatingWord() {
  const words = profile.rotatingRoles;
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % words.length), 2400);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.55, ease }}
          className="whitespace-nowrap text-signal"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Badge() {
  const text = "AWS CERTIFIED DEVELOPER · ASSOCIATE · ";
  return (
    <a
      href="#credentials"
      data-cursor="Certs"
      className="relative grid h-28 w-28 shrink-0 place-items-center md:h-40 md:w-40"
      aria-label="AWS Certified Developer – Associate"
    >
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full">
        <defs>
          <path id="circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-ink font-mono text-[15px] tracking-[0.2em] uppercase">
          <textPath href="#circle" textLength="482" lengthAdjust="spacing">{text}</textPath>
        </text>
      </svg>
      <span className="grid h-12 w-12 place-items-center rounded-full bg-signal font-display text-sm leading-none font-bold tracking-normal text-paper md:h-16 md:w-16 md:text-base">
        AWS
      </span>
    </a>
  );
}

export default function Hero() {
  const play = usePreloaderDone();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const nameY = useTransform(scrollY, [0, 600], [0, -80]);
  const fade = useTransform(scrollY, [0, 500], [1, 0.25]);

  const meta = [
    ["Role", "Full-stack software engineer"],
    ["Based", "India — open to remote"],
    ["Status", "Available for new opportunities"],
  ];

  return (
    <section ref={sectionRef} id="top" className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-24 pb-10">
      <DotField />
      <Stickers play={play} bounds={sectionRef} />

      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={play ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-rule pt-4 font-mono text-[11px] tracking-[0.12em] uppercase md:grid-cols-3"
        >
          {meta.map(([k, v], i) => (
            <div key={k}>
              <p className="text-muted">({k})</p>
              <p className="mt-1 flex items-center gap-2 text-ink">
                {i === 2 && (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
                  </span>
                )}
                {v}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div style={{ y: nameY, opacity: fade }} className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <KineticName
          play={play}
          aside={
            <motion.span
              initial={{ scale: 0, rotate: -90 }}
              animate={play ? { scale: 1, rotate: 0 } : undefined}
              transition={{ duration: 1, delay: 0.9, ease }}
              className="hidden pb-3 sm:block"
            >
              <Badge />
            </motion.span>
          }
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={play ? { opacity: 1 } : undefined}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="mt-6 hidden font-mono text-[11px] tracking-[0.16em] text-muted uppercase md:block"
        >
          <span className="text-signal">✦</span> Hover the name · drag the stickers · click anywhere for a shockwave
        </motion.p>
      </motion.div>

      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-8 border-t border-ink pt-6 md:grid-cols-12 md:items-end">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={play ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.9, ease }}
            className="font-serif text-[clamp(1.6rem,3.2vw,2.8rem)] leading-[1.08] text-ink md:col-span-8"
          >
            <span className="italic">Engineer shipping</span> <RotatingWord />
            <br />
            <span className="italic text-ink-soft">— from database schema to deployed container.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={play ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 1.05, ease }}
            className="flex flex-wrap items-center gap-3 md:col-span-4 md:justify-end"
          >
            <a
              href="#work"
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-4 font-mono text-xs tracking-[0.14em] text-paper uppercase transition hover:bg-signal"
            >
              See the work
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center rounded-full border border-ink px-6 py-4 font-mono text-xs tracking-[0.14em] uppercase transition hover:bg-ink hover:text-paper"
            >
              Email me
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
