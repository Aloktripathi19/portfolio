"use client";

import { motion } from "motion/react";
import { experience } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import Reveal, { ease } from "./Reveal";

/** Tag each résumé bullet like a conventional commit, for the git-log presentation. */
function commitType(text: string) {
  const t = text.toLowerCase();
  if (t.startsWith("overhaul") || t.includes("technical debt")) return "refactor";
  if (t.includes("optimiz") || t.includes("faster") || t.includes("page-load")) return "perf";
  if (t.includes("shipped") || t.includes("delivered") || t.includes("deploy")) return "release";
  if (t.includes("library") || t.includes("design system")) return "ui";
  if (t.includes("ownership") || t.includes("drive")) return "own";
  return "feat";
}

const typeColor: Record<string, string> = {
  feat: "bg-signal text-ink",
  perf: "bg-ink text-paper",
  refactor: "border border-ink text-ink",
  release: "bg-[#c8f169] text-ink",
  ui: "bg-[#b9b3ff] text-ink",
  own: "bg-paper-2 text-ink",
};

export default function Experience() {
  return (
    <section id="experience" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          index="02"
          eyebrow="Experience"
          title={
            <>
              The <span className="font-serif font-normal italic">commit</span> history.
            </>
          }
          aside="Every bullet from my résumé, written like a changelog. That's how the work actually ships."
        />

        <Reveal>
          <div className="flex items-center justify-between rounded-t-xl border border-b-0 border-ink bg-ink px-5 py-3 font-mono text-xs text-paper/70">
            <span>
              <span className="text-signal">$</span> git log --author=&quot;alok&quot; --all --reverse=false
            </span>
            <span className="hidden gap-1.5 sm:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-paper/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-paper/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-signal" />
            </span>
          </div>
        </Reveal>

        <div className="rounded-b-xl border border-ink">
          {experience.map((job, j) => (
            <div key={job.company} className={`grid md:grid-cols-12 ${j > 0 ? "border-t border-ink" : ""}`}>
              <div className="border-b border-rule p-6 md:col-span-4 md:border-r md:border-b-0 md:p-8">
                <div className="md:sticky md:top-24">
                  <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
                    branch / <span className="text-signal">{j === 0 ? "main" : "internship"}</span>
                  </p>
                  <h3 className="mt-5 font-display text-3xl leading-none font-bold tracking-tight md:text-4xl">{job.role}</h3>
                  <p className="mt-3 font-serif text-2xl italic">@ {job.company}</p>
                  <p className="mt-6 inline-block rounded-full border border-ink px-3 py-1 font-mono text-[11px] tracking-wider uppercase">
                    {job.period}
                  </p>
                  <p className="mt-2 font-mono text-[11px] tracking-wider text-muted uppercase">{job.type}</p>
                  {job.stackGroups ? (
                    <div className="mt-8 space-y-5">
                      <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
                        Tech stack <span className="text-signal">/</span> {job.stackGroups.reduce((n, g) => n + g.items.length, 0)} tools
                      </p>
                      {job.stackGroups.map((g, gi) => (
                        <div key={g.label}>
                          <p className="mb-2 flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] uppercase">
                            <span className={`h-1.5 w-1.5 ${gi === 0 ? "bg-signal" : "bg-ink"}`} />
                            {g.label}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {g.items.map((s, i) => (
                              <motion.span
                                key={s}
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: gi * 0.08 + i * 0.025, ease }}
                                className={`px-2 py-1 font-mono text-[11px] transition-colors ${
                                  gi === 0
                                    ? "bg-signal text-ink hover:bg-ink hover:text-paper"
                                    : "bg-paper-2 hover:bg-ink hover:text-paper"
                                }`}
                              >
                                {s}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-8 flex flex-wrap gap-1.5">
                      {job.stack.map((s) => (
                        <span key={s} className="bg-paper-2 px-2 py-1 font-mono text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <ol className="md:col-span-8">
                {job.highlights.map((h, i) => {
                  const type = commitType(h);
                  return (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.6, delay: (i % 4) * 0.05, ease }}
                      className="group relative grid grid-cols-[auto_1fr] gap-4 border-b border-rule px-6 py-5 transition-colors last:border-b-0 hover:bg-paper-2 md:gap-6 md:px-8"
                    >
                      <span className="relative flex flex-col items-center pt-1">
                        <span className="h-3 w-3 rounded-full border-2 border-ink bg-paper transition-colors group-hover:bg-signal" />
                      </span>
                      <div>
                        <div className="mb-2 flex items-center gap-3 font-mono text-[10px] tracking-[0.14em] uppercase">
                          <span className={`rounded px-1.5 py-0.5 ${typeColor[type]}`}>{type}</span>
                          <span className="text-muted">
                            {job.company.split(" ")[0].toLowerCase()}/{String(job.highlights.length - i).padStart(2, "0")}
                          </span>
                        </div>
                        <p className="text-[15px] leading-relaxed text-ink-soft md:text-base">{h}</p>
                      </div>
                    </motion.li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
