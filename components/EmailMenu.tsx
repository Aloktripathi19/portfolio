"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "@/lib/data";
import { ease } from "./Reveal";

const SUBJECT = "Hello Alok";
const to = encodeURIComponent(profile.email);
const su = encodeURIComponent(SUBJECT);

// A bare mailto: does nothing on machines without a desktop mail client
// (most webmail users), so offer webmail compose links alongside it.
const options = [
  { label: "Gmail", hint: "Opens in browser", href: `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}`, external: true },
  { label: "Outlook", hint: "Opens in browser", href: `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${su}`, external: true },
  { label: "Mail app", hint: "Default mail client", href: `mailto:${profile.email}?subject=${su}`, external: false },
];

type Props = {
  /** Renders the trigger; call `toggle` from its onClick. */
  trigger: (p: { toggle: () => void; open: boolean }) => React.ReactNode;
  placement?: "top" | "bottom";
  align?: "start" | "end";
  className?: string;
};

export default function EmailMenu({ trigger, placement = "top", align = "end", className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // Older browsers / insecure contexts: fall back to a hidden textarea
      const ta = document.createElement("textarea");
      ta.value = profile.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const pos = `${placement === "top" ? "bottom-full mb-3" : "top-full mt-3"} ${align === "end" ? "right-0" : "left-0"}`;

  return (
    <div ref={root} className={`relative inline-block ${className}`}>
      {trigger({ toggle: () => setOpen((o) => !o), open })}

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: placement === "top" ? 8 : -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: placement === "top" ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease }}
            className={`absolute z-40 w-64 border border-ink bg-paper text-ink shadow-[6px_6px_0_0_#111110] ${pos}`}
          >
            <p className="border-b border-ink/15 px-4 pt-3 pb-2 font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
              Email {profile.email}
            </p>
            {options.map((o) => (
              <a
                key={o.label}
                role="menuitem"
                href={o.href}
                target={o.external ? "_blank" : undefined}
                rel={o.external ? "noopener noreferrer" : undefined}
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between border-b border-ink/10 px-4 py-3 transition-colors hover:bg-ink hover:text-paper"
              >
                <span>
                  <span className="block font-display text-base font-bold tracking-tight">{o.label}</span>
                  <span className="block font-mono text-[10px] tracking-[0.12em] text-muted uppercase group-hover:text-paper/60">
                    {o.hint}
                  </span>
                </span>
                <span className="transition-transform group-hover:-rotate-45">→</span>
              </a>
            ))}
            <button
              role="menuitem"
              onClick={copy}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-signal"
            >
              <span>
                <span className="block font-display text-base font-bold tracking-tight">
                  {copied ? "Copied ✓" : "Copy address"}
                </span>
                <span className="block font-mono text-[10px] tracking-[0.12em] text-muted uppercase">Paste it anywhere</span>
              </span>
              <span>⧉</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
