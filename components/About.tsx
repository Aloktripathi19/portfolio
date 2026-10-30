"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useScroll, useTransform } from "motion/react";
import { stats } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value]);
  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString("en-US")}
      <span className="text-signal">{suffix}</span>
    </span>
  );
}

/** Paragraph whose words light up as it scrolls through the viewport. */
function ScrollLitText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="flex flex-wrap font-serif text-[clamp(1.7rem,3.4vw,3rem)] leading-[1.12]">
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const highlight = /10,000\+|end|AWS|production/.test(children);
  return (
    <motion.span style={{ opacity }} className={`mr-[0.25em] ${highlight ? "italic text-signal" : ""}`}>
      {children}
    </motion.span>
  );
}

const principles = [
  ["Own it end to end", "Design review → schema → API → UI → container → release. No hand-offs into the void."],
  ["Fast by default", "Server-rendered, SEO-first pages and tuned Postgres queries that hold up as usage scales."],
  ["Grounded AI", "LLM features that cite their sources — embeddings, pgvector and similarity search, not guesswork."],
];

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          index="01"
          eyebrow="About"
          title={
            <>
              Code that <span className="font-serif font-normal italic">reaches</span> people.
            </>
          }
          aside="2+ years of professional engineering on products with real users, real data and real deadlines."
        />

        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-8">
            <ScrollLitText text="I'm a full-stack engineer and AWS Certified Developer shipping production web apps used by 10,000+ people. I take features end to end — SEO-optimized React and Next.js frontends, Python and Node.js APIs, and PostgreSQL models for real business workflows, deployed as containers on AWS." />
            <Reveal className="mt-10 max-w-2xl text-lg leading-relaxed text-ink-soft">
              <p>
                Most recently I was a Software Engineer at <span className="text-ink">MandS Consulting</span> (May 2025 – Nov 2026), owning features
                on three client products, including <span className="text-ink">Braided</span> (5,500+ users) and{" "}
                <span className="text-ink">Hey Coach</span> (4,000+ users, growing monthly) — and partnering with product
                and design from the first review to the production release.
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-4">
            <dl className="border-t border-ink">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.08}>
                  <div className="flex items-end justify-between gap-4 border-b border-rule py-5">
                    <dt className="max-w-[12rem] font-mono text-[11px] tracking-[0.12em] text-muted uppercase">{s.label}</dt>
                    <dd className="font-display text-5xl font-bold tracking-tight">
                      <Counter value={s.value} suffix={s.suffix} />
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-24 grid gap-px overflow-hidden border border-ink bg-ink md:grid-cols-3">
          {principles.map(([t, b], i) => (
            <Reveal key={t} delay={i * 0.1} y={0} className="h-full">
              <div className="group relative h-full bg-paper p-8 transition-colors duration-500 hover:bg-ink hover:text-paper md:p-10">
                <span className="font-mono text-[11px] tracking-[0.18em] text-signal">P/0{i + 1}</span>
                <h3 className="mt-10 font-display text-3xl font-bold tracking-tight">{t}</h3>
                <p className="mt-4 leading-relaxed text-ink-soft transition-colors group-hover:text-paper/70">{b}</p>
                <span className="absolute top-8 right-8 text-2xl transition-transform duration-500 group-hover:rotate-90 group-hover:text-signal">
                  +
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
