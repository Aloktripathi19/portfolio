"use client";

import { motion } from "motion/react";
import { skills } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import Reveal, { ease } from "./Reveal";

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          index="05"
          eyebrow="Toolkit"
          title={
            <>
              The <span className="font-serif font-normal italic">spec</span> sheet.
            </>
          }
          aside="What I reach for, grouped the way it shows up in a real stack."
        />

        <div className="border-t border-ink">
          {skills.map((g, gi) => (
            <Reveal key={g.group} delay={gi * 0.04} y={16}>
              <div className="group grid gap-4 border-b border-rule py-6 md:grid-cols-12 md:py-8">
                <div className="flex items-baseline gap-4 md:col-span-4">
                  <span className="font-mono text-[11px] text-signal">{String(gi + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{g.group}</h3>
                  <span className="ml-auto font-mono text-[11px] text-muted md:hidden">{g.items.length}</span>
                </div>
                <ul className="flex flex-wrap gap-2 md:col-span-8">
                  {g.items.map((s, i) => (
                    <motion.li
                      key={s}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.03, ease }}
                      whileHover={{ rotate: i % 2 ? 3 : -3, y: -3 }}
                      className="cursor-default rounded-full border border-ink px-4 py-2 text-sm transition-colors hover:bg-signal"
                    >
                      {s}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
