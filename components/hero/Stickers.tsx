"use client";

import { motion } from "motion/react";
import type { RefObject } from "react";
import { techIcons, type TechIcon } from "./techIcons";

/** Light "index card" sticker: soft tint, ink border, hard offset shadow. */
const card = "rounded-md border border-ink px-3.5 py-2 font-mono text-sm tracking-wider text-ink shadow-[4px_4px_0_0_#111110]";

type Key = { icon: TechIcon; name: string; legend: string; color: string; tint: string; face: string; legendColor: string };

/**
 * Logo-only mechanical keycap: tinted body, dished top face, solid "key depth"
 * edge that presses in on click, a tiny corner legend, and the name on hover.
 */
function Keycap({ icon, name, legend, color, tint, face, legendColor }: Key) {
  return (
    <span className="relative block">
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 translate-y-1 rounded bg-ink px-2 py-1 font-mono text-[10px] tracking-[0.14em] whitespace-nowrap text-paper uppercase opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
        {name}
      </span>
      <span
        className={`relative grid h-16 w-16 place-items-center rounded-[16px] border-2 border-ink shadow-[0_6px_0_0_#111110] transition-[transform,box-shadow] duration-100 group-active:translate-y-1 group-active:shadow-[0_2px_0_0_#111110] md:h-[78px] md:w-[78px] ${tint}`}
      >
        <span className={`absolute inset-[5px] rounded-[11px] shadow-[inset_0_-3px_0_rgba(17,17,16,0.08)] ${face}`} />
        <span className={`absolute top-[9px] left-[11px] font-mono text-[8px] tracking-wider ${legendColor}`}>{legend}</span>
        <svg viewBox="0 0 24 24" className="relative h-8 w-8 md:h-9 md:w-9" fill={color} role="img" aria-label={name}>
          <path d={techIcons[icon]} />
        </svg>
      </span>
    </span>
  );
}

// 24-point starburst outline for the "users" sticker
const starburst = (() => {
  const pts: string[] = [];
  const spikes = 24;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? 50 : 42;
    const a = (Math.PI * i) / spikes;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)}% ${(50 + r * Math.sin(a)).toFixed(2)}%`);
  }
  return `polygon(${pts.join(",")})`;
})();

type Sticker = {
  id: string;
  node: React.ReactNode;
  className?: string;
  pos: string;
  rotate: number;
  delay: number;
  float: number;
};

const light = { tint: "bg-[#f3efe6]", face: "bg-white/60", legendColor: "text-ink/35", color: "#9b978d" };

const stickers: Sticker[] = [
  {
    id: "next",
    node: <Keycap icon="nextjs" name="Next.js" legend="N" {...light} />,
    pos: "right-[50%] top-[30%] md:right-[27%] md:top-[24%]",
    rotate: -10,
    delay: 1.2,
    float: 5,
  },
  {
    id: "pg",
    node: <Keycap icon="postgresql" name="PostgreSQL + pgvector" legend="PG" {...light} />,
    pos: "right-[58%] top-[60%] md:right-[7%] md:top-[18%]",
    rotate: 8,
    delay: 1.32,
    float: 6.5,
  },
  {
    id: "users",
    node: (
      <span className="flex flex-col items-center leading-none">
        <span className="font-display text-lg font-extrabold tracking-tight md:text-[26px]">10,000+</span>
        <span className="mt-1 font-mono text-[9px] tracking-[0.2em] md:text-[10px]">USERS</span>
      </span>
    ),
    className: "grid h-24 w-24 place-items-center bg-[#c8f169] text-ink md:h-32 md:w-32",
    pos: "right-[10%] top-[57%] md:right-[14%] md:top-[36%]",
    rotate: 12,
    delay: 1.44,
    float: 7.5,
  },
  {
    id: "py",
    node: <Keycap icon="python" name="Python" legend="PY" {...light} />,
    pos: "hidden md:block right-[21%] top-[56%]",
    rotate: 6,
    delay: 1.56,
    float: 6,
  },
  {
    id: "rag",
    node: "RAG ✦ LLM",
    className: `${card} whitespace-nowrap bg-paper`,
    pos: "hidden md:block right-[3%] top-[40%]",
    rotate: -6,
    delay: 1.68,
    float: 5.5,
  },
  {
    id: "openai",
    node: <Keycap icon="openai" name="OpenAI" legend="AI" {...light} />,
    pos: "hidden md:block right-[39%] top-[14%]",
    rotate: -5,
    delay: 1.8,
    float: 6.8,
  },
  {
    id: "docker",
    node: <Keycap icon="docker" name="Docker" legend="DK" {...light} />,
    pos: "hidden md:block right-[31%] top-[64%]",
    rotate: -8,
    delay: 1.92,
    float: 5.8,
  },
];

export default function Stickers({ play, bounds }: { play: boolean; bounds: RefObject<HTMLElement | null> }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {stickers.map((s) => (
        <motion.div
          key={s.id}
          data-sticker
          data-cursor="Drag"
          drag
          dragConstraints={bounds}
          dragElastic={0.18}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 18, power: 0.35 }}
          initial={{ scale: 0, rotate: s.rotate - 40 }}
          animate={
            play
              ? { scale: 1, rotate: s.rotate, transition: { type: "spring", stiffness: 260, damping: 14, delay: s.delay } }
              : undefined
          }
          whileHover={{ scale: 1.08, rotate: s.rotate * 0.4 }}
          whileDrag={{ scale: 1.15, rotate: 0, zIndex: 30 }}
          transition={{ type: "spring", stiffness: 380, damping: 20 }}
          className={`group pointer-events-auto absolute cursor-grab touch-none active:cursor-grabbing ${s.pos}`}
        >
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: s.float, repeat: Infinity, ease: "easeInOut" }}
            className={`select-none ${s.className ?? ""}`}
            style={s.id === "users" ? { clipPath: starburst } : undefined}
          >
            {s.node}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
