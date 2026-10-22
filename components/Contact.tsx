"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { profile } from "@/lib/data";
import { MaskLine } from "./Reveal";
import Reveal from "./Reveal";

function Magnetic({ children, href }: { children: React.ReactNode; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className="group relative grid h-40 w-40 shrink-0 place-items-center overflow-hidden rounded-full bg-signal text-ink md:h-52 md:w-52"
    >
      <span className="absolute inset-0 translate-y-full rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
      <span className="relative font-mono text-xs tracking-[0.18em] uppercase transition-colors group-hover:text-paper">
        {children}
      </span>
    </motion.a>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const links = [
    ["GitHub", profile.socials.github],
    ["LinkedIn", profile.socials.linkedin],
    ["HackerRank", profile.socials.hackerrank],
    ["Résumé (PDF)", profile.resume],
  ];

  return (
    <section id="contact" className="relative overflow-hidden bg-night pt-24 pb-10 text-paper md:pt-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex items-center justify-between border-t border-paper/15 pt-4 font-mono text-[11px] tracking-[0.18em] text-paper/50 uppercase">
          <span>
            <span className="text-signal">§08</span> &nbsp;Contact
          </span>
          <span>Replies within a day</span>
        </div>

        <div className="mt-12 flex flex-col gap-12 md:mt-20 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="font-display text-[clamp(3.4rem,11vw,11rem)] leading-[0.85] font-extrabold tracking-[-0.055em]">
            <MaskLine>Let&apos;s build</MaskLine>
            <MaskLine delay={0.1}>
              <span className="font-serif font-normal tracking-[-0.02em] italic text-signal">something</span>
            </MaskLine>
            <MaskLine delay={0.2}>real.</MaskLine>
          </h2>
          <Magnetic href={`mailto:${profile.email}`}>Say hello →</Magnetic>
        </div>

        <div className="mt-20 grid gap-10 border-t border-paper/15 pt-10 md:grid-cols-12">
          <Reveal className="md:col-span-6">
            <p className="font-mono text-[11px] tracking-[0.16em] text-paper/40 uppercase">Email</p>
            <button
              onClick={copy}
              data-cursor={copied ? "Copied" : "Copy"}
              className="group mt-3 flex items-center gap-3 text-left font-display text-2xl font-bold tracking-tight break-all sm:text-3xl md:text-4xl"
            >
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                {profile.email}
              </span>
            </button>
            <p className="mt-2 h-4 font-mono text-[11px] tracking-wider text-signal uppercase">
              {copied ? "✓ Copied to clipboard" : ""}
            </p>

            <p className="mt-8 font-mono text-[11px] tracking-[0.16em] text-paper/40 uppercase">Phone</p>
            <a href={profile.phoneHref} className="mt-3 inline-block font-display text-2xl font-bold tracking-tight hover:text-signal">
              {profile.phone}
            </a>
          </Reveal>

          <Reveal className="md:col-span-6" delay={0.1}>
            <p className="font-mono text-[11px] tracking-[0.16em] text-paper/40 uppercase">Elsewhere</p>
            <ul className="mt-3">
              {links.map(([label, href]) => (
                <li key={label} className="border-b border-paper/10">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener"
                    className="group flex items-center justify-between py-4 text-lg transition-colors hover:text-signal"
                  >
                    {label}
                    <span className="transition-transform duration-300 group-hover:-rotate-45">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
