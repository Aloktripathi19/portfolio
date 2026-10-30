"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { featuredWork, type FeaturedWork } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import Reveal, { ease } from "./Reveal";

const rag = [
  ["01", "Ingest", "Product data"],
  ["02", "Chunk", "Semantic chunking"],
  ["03", "Embed", "OpenAI embeddings"],
  ["04", "Store", "pgvector on Postgres"],
  ["05", "Retrieve", "Similarity search"],
  ["06", "Answer", "Streamed, cited LLM reply"],
];

function RagDiagram() {
  return (
    <div className="mt-10">
      <p className="mb-4 font-mono text-[11px] tracking-[0.16em] text-paper/40 uppercase">Fig. 1: Production RAG pipeline</p>
      <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-paper/15 bg-paper/15 sm:grid-cols-3">
        {rag.map(([n, k, v], i) => (
          <motion.li
            key={n}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.5 }}
            className="relative bg-night p-4"
          >
            <span className="font-mono text-[10px] text-signal">{n}</span>
            <p className="mt-2 font-display text-lg font-bold">{k}</p>
            <p className="text-xs text-paper/50">{v}</p>
            <motion.span
              className="absolute bottom-0 left-0 h-[2px] bg-signal"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.18, duration: 0.6, ease }}
            />
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function SurfaceDiagram() {
  const surfaces = [
    ["Web", "Server-rendered Next.js dashboards"],
    ["Mobile", "Cross-platform Flutter app"],
    ["API", "REST services + PostgreSQL"],
  ];
  return (
    <div className="mt-10">
      <p className="mb-4 font-mono text-[11px] tracking-[0.16em] text-paper/40 uppercase">Fig. 2: One product, three surfaces</p>
      <div className="grid gap-px overflow-hidden rounded-lg border border-paper/15 bg-paper/15 sm:grid-cols-3">
        {surfaces.map(([k, v], i) => (
          <motion.div
            key={k}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.6, ease }}
            className="bg-night p-4"
          >
            <p className="font-display text-lg font-bold">{k}</p>
            <p className="text-xs text-paper/50">{v}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Case({ w, index }: { w: FeaturedWork; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const metricY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <article ref={ref} className="grid gap-10 border-t border-paper/15 py-14 md:grid-cols-12 md:py-20">
      <div className="md:col-span-5">
        <p className="font-mono text-[11px] tracking-[0.16em] text-paper/50 uppercase">
          Case {String(index + 1).padStart(2, "0")} · {w.tagline}
        </p>
        <h3 className="mt-4 font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.9] font-extrabold tracking-[-0.05em]">
          {w.name}
          <span className="text-signal">.</span>
        </h3>
        <motion.div style={{ y: metricY }} className="mt-10 md:mt-16">
          <p className="font-display text-[clamp(4rem,10vw,9rem)] leading-none font-extrabold tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_#eeebe3]">
            {w.metric}
          </p>
          <p className="mt-2 font-serif text-2xl italic text-paper/70">{w.metricLabel}</p>
        </motion.div>
      </div>

      <div className="md:col-span-7">
        <Reveal>
          <p className="text-xl leading-relaxed text-paper/80 md:text-2xl md:leading-snug">{w.description}</p>
        </Reveal>
        <ul className="mt-8 divide-y divide-paper/10 border-y border-paper/10">
          {w.points.map((p, i) => (
            <Reveal key={p} delay={i * 0.06} y={12}>
              <li className="flex items-baseline gap-4 py-4 text-paper/75">
                <span className="font-mono text-[11px] text-signal">→</span>
                {p}
              </li>
            </Reveal>
          ))}
        </ul>
        {index === 0 ? <RagDiagram /> : <SurfaceDiagram />}
        <div className="mt-8 flex flex-wrap gap-2">
          {w.stack.map((s) => (
            <span key={s} className="rounded-full border border-paper/25 px-3 py-1 font-mono text-[11px] text-paper/70">
              {s}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function Work() {
  return (
    <section id="work" className="relative overflow-hidden rounded-t-[2rem] bg-night py-24 text-paper md:rounded-t-[3rem] md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          dark
          index="03"
          eyebrow="Featured work"
          title={
            <>
              In production, <span className="font-serif font-normal italic text-signal">used by thousands.</span>
            </>
          }
          aside="Client products I built and owned at MandS Consulting: web, mobile and AI, shipped from design review to release."
        />
        {featuredWork.map((w, i) => (
          <Case key={w.name} w={w} index={i} />
        ))}
      </div>
    </section>
  );
}
