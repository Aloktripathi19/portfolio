"use client";

import { motion } from "motion/react";
import { certifications, education } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import Reveal, { ease } from "./Reveal";

// Speckled mask so the stamp ink looks pressed, not printed
const inkMask = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' seed='7'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.3 1.5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`;

/** Rubber stamp that "thunks" down onto the ticket when it scrolls into view. */
function Stamp() {
  const ring = "AWS CERTIFIED · DEVELOPER · ASSOCIATE · ";
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 2.4, rotate: -30 }}
      whileInView={{ opacity: 0.92, scale: 1, rotate: -14 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 520, damping: 22, mass: 1.1, delay: 0.55 }}
      className="pointer-events-none absolute top-12 right-4 h-28 w-28 text-ink mix-blend-multiply sm:h-32 sm:w-32 md:top-14 md:right-7"
      style={{ maskImage: inkMask, WebkitMaskImage: inkMask, maskSize: "200px", WebkitMaskSize: "200px" }}
    >
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <path id="stamp-ring" d="M100,100 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0" />
        </defs>
        <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="5" />
        <circle cx="100" cy="100" r="84" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="52" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text fill="currentColor" style={{ font: "600 13px var(--font-mono-f), monospace", letterSpacing: "0.22em" }}>
          <textPath href="#stamp-ring" textLength="430" lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
        {/* center banner */}
        <rect x="18" y="84" width="164" height="34" fill="currentColor" />
        <text
          x="100"
          y="108"
          textAnchor="middle"
          fill="#eeebe3"
          style={{ font: "800 22px var(--font-display-f), sans-serif", letterSpacing: "0.12em" }}
        >
          CERTIFIED
        </text>
        <text x="100" y="74" textAnchor="middle" fill="currentColor" style={{ font: "700 16px var(--font-display-f), sans-serif" }}>
          ✓
        </text>
        <text
          x="100"
          y="140"
          textAnchor="middle"
          fill="currentColor"
          style={{ font: "700 12px var(--font-display-f), sans-serif", letterSpacing: "0.3em" }}
        >
          ★ ★ ★
        </text>
      </svg>
    </motion.div>
  );
}

export default function Credentials() {
  const [aws, ...rest] = certifications;

  return (
    <section id="credentials" className="relative bg-paper-2 py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          index="06"
          eyebrow="Credentials"
          title={
            <>
              Certified &amp; <span className="font-serif font-normal italic">schooled.</span>
            </>
          }
        />

        <div className="grid gap-6 lg:grid-cols-12">
          {/* AWS ticket: sticky so it doesn't stretch to the list's height */}
          <div className="lg:col-span-5 lg:self-start lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, rotate: -6, y: 40 }}
              whileInView={{ opacity: 1, rotate: -2, y: 0 }}
              whileHover={{ rotate: 0, scale: 1.01 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease }}
              className="relative border border-ink bg-signal shadow-[10px_10px_0_0_#111110]"
            >
              <div className="relative p-7 md:p-9">
                <div className="flex items-start justify-between font-mono text-[11px] tracking-[0.16em] uppercase">
                  <span>Certification · 01</span>
                  <span>Amazon Web Services</span>
                </div>

                <div className="mt-12 mb-8">
                  <p className="font-display text-6xl leading-[0.85] font-extrabold tracking-[-0.05em] md:text-7xl">
                    AWS
                    <br />
                    Developer
                  </p>
                  <p className="mt-3 font-serif text-3xl italic">Associate</p>
                </div>

                <dl className="grid grid-cols-2 border-t border-ink/40 font-mono text-[11px] tracking-[0.1em] uppercase">
                  {[
                    ["Level", "Associate"],
                    ["Track", "Developer"],
                    ["Issuer", "Amazon Web Services"],
                    ["Holder", "Alok Ram Tripathi"],
                  ].map(([k, v], i) => (
                    <div key={k} className={`border-b border-ink/40 py-3 ${i % 2 === 0 ? "border-r pr-3" : "pl-4"}`}>
                      <dt className="text-ink/55">{k}</dt>
                      <dd className="mt-1 text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 font-mono text-[10px] tracking-[0.14em] text-ink/60 uppercase">
                  Domains: Develop · Secure · Deploy · Troubleshoot &amp; optimize
                </p>

                <Stamp />
              </div>

              {/* perforation */}
              <div className="relative flex items-center">
                <span className="absolute -left-[13px] h-6 w-6 rounded-full border border-ink bg-paper-2 [clip-path:inset(0_0_0_50%)]" />
                <span className="mx-5 h-px flex-1 border-t-2 border-dashed border-ink/60" />
                <span className="absolute -right-[13px] h-6 w-6 rounded-full border border-ink bg-paper-2 [clip-path:inset(0_50%_0_0)]" />
              </div>

              {/* stub */}
              <div className="p-7 md:px-9 md:pt-6 md:pb-8">
                <p className="mb-3 flex items-center justify-between font-mono text-[10px] tracking-[0.16em] uppercase">
                  <span>Used in production</span>
                  <span className="text-ink/60">Admit: Cloud</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["ECS", "ECR", "EC2", "VPC", "Route 53", "ALB", "IAM", "CodePipeline", "CodeBuild"].map((s, i) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.04, duration: 0.4, ease }}
                      className="border border-ink bg-paper/90 px-2 py-1 font-mono text-[11px] text-ink transition-colors hover:bg-ink hover:text-paper"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
                {/* faux barcode */}
                <div aria-hidden className="mt-6 flex h-8 items-stretch gap-[2px] opacity-80">
                  {"3121142213112412131221413112213142".split("").map((w, i) => (
                    <span key={i} className={i % 2 ? "bg-transparent" : "bg-ink"} style={{ width: `${Number(w) * 1.5}px` }} />
                  ))}
                </div>
              </div>
              <span className="sr-only">{aws.title}</span>
            </motion.div>
          </div>

          <div className="lg:col-span-7">
            <ul className="border-t border-ink">
              {rest.map((c, i) => (
                <Reveal key={c.title} delay={i * 0.06} y={14}>
                  <li className="group flex items-baseline gap-5 border-b border-ink/20 py-5">
                    <span className="font-mono text-[11px] text-signal">{String(i + 2).padStart(2, "0")}</span>
                    <div className="flex-1">
                      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-xl font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-2 md:text-2xl">
                        {c.title}
                        {c.tag && (
                          <span className="rounded-full bg-signal px-2 py-0.5 font-mono text-[10px] font-normal tracking-[0.14em] text-ink uppercase">
                            {c.tag}
                          </span>
                        )}
                      </p>
                      <p className="mt-1 font-mono text-[11px] tracking-[0.1em] text-muted uppercase">{c.issuer}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.2}>
              <div className="mt-10 border border-ink bg-paper p-6 md:p-8">
                <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">Education</p>
                <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <p className="font-display text-2xl font-bold tracking-tight md:text-3xl">{education.degree}</p>
                    <p className="mt-1 font-serif text-xl italic text-ink-soft">
                      {education.school}, {education.location}
                    </p>
                  </div>
                  <div className="text-right font-mono text-xs tracking-wider uppercase">
                    <p>{education.period}</p>
                    <p className="mt-1 text-signal">{education.grade}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
