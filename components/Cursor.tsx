"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Custom cursor: a signal-orange dot that turns into a ring over links
 * and into a labelled disc over any element with `data-cursor="Label"`.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hoverLink, setHoverLink] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 42, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 600, damping: 42, mass: 0.35 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setLabel(t?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? null);
      setHoverLink(!!t?.closest("a, button"));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.body.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  const state = label ? "label" : hoverLink ? "link" : "dot";
  const variants = {
    dot: { width: 12, height: 12, backgroundColor: "#ff4f1f", borderWidth: 0 },
    link: { width: 46, height: 46, backgroundColor: "rgba(255,79,31,0)", borderWidth: 1.5 },
    label: { width: 92, height: 92, backgroundColor: "#ff4f1f", borderWidth: 0 },
  };

  return (
    <motion.div aria-hidden className="pointer-events-none fixed top-0 left-0 z-[95]" style={{ x: sx, y: sy }}>
      <motion.div
        animate={variants[state]}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-signal"
        style={{ borderStyle: "solid" }}
      >
        {label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-mono text-[10px] tracking-[0.18em] text-ink uppercase"
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}
