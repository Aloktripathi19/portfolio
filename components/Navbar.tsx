"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav, profile } from "@/lib/data";
import { ease } from "./Reveal";

function LocalTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{t || "--:--:--"} IST</span>;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    nav.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color] duration-500 ${
          scrolled ? "border-b border-rule bg-paper/85 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 font-mono text-[11px] tracking-[0.16em] uppercase md:px-10">
          <a href="#top" className="flex items-center gap-2 font-semibold text-ink">
            <span className="inline-block h-2.5 w-2.5 bg-signal" />
            A.R.Tripathi
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`group relative transition-colors ${active === item.id ? "text-ink" : "text-muted hover:text-ink"}`}
              >
                <span className="text-signal">0{i + 1}</span> {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-ink transition-all duration-300 ${
                    active === item.id ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <span className="hidden text-muted md:inline">
              <LocalTime />
            </span>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener"
              className="hidden rounded-full border border-ink px-4 py-2 text-ink transition hover:bg-ink hover:text-paper sm:inline-block"
            >
              Résumé ↗
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              className="relative z-[60] flex h-9 items-center gap-2 text-ink lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? "Close" : "Menu"}
              <span className="flex w-5 flex-col gap-1">
                <span className={`h-px bg-current transition ${open ? "translate-y-[2.5px] rotate-45" : ""}`} />
                <span className={`h-px bg-current transition ${open ? "-translate-y-[2.5px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease }}
            className="fixed inset-0 z-[55] flex flex-col justify-between bg-paper px-5 pt-24 pb-8 lg:hidden"
          >
            <nav className="flex flex-col">
              {nav.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease }}
                  className="flex items-baseline justify-between border-b border-rule py-3 font-display text-5xl font-bold tracking-tight"
                >
                  {item.label}
                  <span className="font-mono text-xs text-signal">0{i + 1}</span>
                </motion.a>
              ))}
            </nav>
            <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
              <LocalTime />
              <a href={profile.resume} target="_blank" rel="noopener" className="text-ink underline underline-offset-4">
                Résumé ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
