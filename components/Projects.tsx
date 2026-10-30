"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { projects, profile } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import Reveal, { ease } from "./Reveal";

export default function Projects() {
  const [hovered, setHovered] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 30 });
  const sy = useSpring(y, { stiffness: 260, damping: 30 });

  const onMove = (e: React.MouseEvent) => {
    const flip = e.clientX > window.innerWidth - 380;
    x.set(flip ? e.clientX - 350 : e.clientX + 28);
    y.set(e.clientY - 80);
  };

  const active = hovered !== null ? projects[hovered] : null;

  return (
    <section id="projects" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          index="04"
          eyebrow="Index of projects"
          title={
            <>
              Built on my <span className="font-serif font-normal italic">own</span> time.
            </>
          }
          aside="Open-source work from GitHub: AI assistants, typed APIs, full-stack apps and developer tooling."
        />

        <div className="hidden grid-cols-12 gap-4 border-b border-ink pb-3 font-mono text-[11px] tracking-[0.16em] text-muted uppercase md:grid">
          <span className="col-span-1">No.</span>
          <span className="col-span-5">Project</span>
          <span className="col-span-2">Type</span>
          <span className="col-span-3">Stack</span>
          <span className="col-span-1 text-right">Link</span>
        </div>

        <ul onMouseMove={onMove} onMouseLeave={() => setHovered(null)}>
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.04} y={16}>
              <li onMouseEnter={() => setHovered(i)} className="group relative border-b border-rule">
                <a
                  href={p.live ?? p.repo}
                  target="_blank"
                  rel="noopener"
                  data-cursor={p.live ? "Live ↗" : "Code ↗"}
                  className="relative isolate grid grid-cols-12 items-baseline gap-4 overflow-hidden py-6 md:py-8"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
                  />
                  <span className="col-span-2 font-mono text-xs text-muted transition-colors group-hover:text-signal md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-10 md:col-span-5">
                    <span className="block font-display text-2xl leading-tight font-bold tracking-tight transition-all duration-500 group-hover:translate-x-3 group-hover:text-paper md:text-4xl">
                      {p.name}
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-ink-soft md:hidden">{p.description}</span>
                  </span>
                  <span className="col-span-6 col-start-3 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors group-hover:text-paper/70 md:col-span-2 md:col-start-auto">
                    {p.category}
                    {p.live && <span className="ml-2 rounded-full bg-signal px-1.5 py-0.5 text-[9px] text-ink">Live</span>}
                  </span>
                  <span className="hidden font-mono text-[11px] text-muted transition-colors group-hover:text-paper/60 md:col-span-3 md:block">
                    {p.stack.slice(0, 3).join(" / ")}
                  </span>
                  <span className="col-span-4 text-right font-display text-2xl transition-all duration-500 group-hover:-rotate-45 group-hover:text-signal md:col-span-1">
                    →
                  </span>
                </a>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <p className="font-serif text-2xl italic text-ink-soft">…and 30+ more repositories.</p>
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noopener"
            className="rounded-full border border-ink px-6 py-3 font-mono text-xs tracking-[0.14em] uppercase transition hover:bg-ink hover:text-paper"
          >
            github.com/Aloktripathi19 ↗
          </a>
        </Reveal>
      </div>

      {/* Floating preview card (desktop) */}
      <motion.div
        aria-hidden
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed top-0 left-0 z-40 hidden md:block"
      >
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.name}
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease }}
              className="w-80 border border-ink bg-signal p-5 text-ink shadow-[8px_8px_0_0_#111110]"
            >
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase">{active.category} · open source</p>
              <p className="mt-3 text-sm leading-relaxed">{active.description}</p>
              <div className="mt-4 flex flex-wrap gap-1">
                {active.stack.map((s) => (
                  <span key={s} className="bg-ink px-1.5 py-0.5 font-mono text-[10px] text-paper">
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
