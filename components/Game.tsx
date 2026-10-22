"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import SectionHeading from "./SectionHeading";
import Reveal, { ease } from "./Reveal";

type Phase = "idle" | "running" | "over";
type Obstacle = { x: number; w: number; h: number; kind: "bug" | "conflict"; count: number; passed: boolean };
type Coin = { x: number; y: number; label: string; legend: string; taken: boolean; seed: number };
type Pop = { x: number; y: number; text: string; t: number };
type Dust = { x: number; y: number; vx: number; vy: number; t: number };
type Glyph = { x: number; y: number; ch: string; depth: number };
type Result = { score: number; best: number; isBest: boolean; dodged: number; logos: number };

const TECH: [string, string][] = [
  ["Next.js", "N"],
  ["Python", "PY"],
  ["pgvector", "PG"],
  ["OpenAI", "AI"],
  ["Docker", "DK"],
  ["AWS", "AWS"],
];
const STAGES = ["build ✓", "test ✓", "deploy ✓"];
const GLYPHS = ["{ }", "</>", "=>", "[ ]", "&&", "//", "( )", "::"];

const INK = "#111110";
const SIGNAL = "#ff4f1f";
const RULE = "rgba(17,17,16,0.14)";
const MUTED = "rgba(17,17,16,0.45)";
const GRAVITY = 2700;
const JUMP_V = -880;
const CUT_V = -330; // releasing early cuts the jump → short hop
const SIZE = 26;
const BEST_KEY = "deploy-dash-best";

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}
function writeBest(v: number) {
  try {
    localStorage.setItem(BEST_KEY, String(v));
  } catch {}
}

function makeWorld(w = 800, h = 300) {
  return {
    phase: "idle" as Phase,
    w,
    h,
    ground: h - 56,
    t: 0,
    speed: 380,
    dist: 0,
    bonus: 0,
    px: 70,
    py: h - 56,
    vy: 0,
    rot: 0,
    squash: 0,
    onGround: true,
    holding: false,
    obstacles: [] as Obstacle[],
    coins: [] as Coin[],
    pops: [] as Pop[],
    dust: [] as Dust[],
    glyphs: [] as Glyph[],
    nextObs: 520,
    nextCoin: 900,
    dodged: 0,
    logos: 0,
    milestone: 0,
    banner: { text: "", t: 0 },
    shake: 0,
    offset: 0,
  };
}
type World = ReturnType<typeof makeWorld>;

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export default function Game() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const world = useRef<World>(makeWorld());
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [best, setBestState] = useState(0);
  const bestRef = useRef(0);
  const setBest = (v: number) => {
    bestRef.current = v;
    setBestState(v);
  };

  useEffect(() => setBest(readBest()), []);

  const start = useCallback(() => {
    const prev = world.current;
    const g = makeWorld(prev.w, prev.h);
    g.glyphs = prev.glyphs;
    g.phase = "running";
    g.vy = JUMP_V * 0.6; // little hop on start
    g.onGround = false;
    world.current = g;
    setPhase("running");
    setResult(null);
    wrapRef.current?.focus({ preventScroll: true });
  }, []);

  const press = useCallback(() => {
    const g = world.current;
    if (g.phase !== "running") return start();
    g.holding = true;
    if (g.onGround) {
      g.vy = JUMP_V;
      g.onGround = false;
      g.squash = -0.25;
    }
  }, [start]);

  const release = useCallback(() => {
    const g = world.current;
    g.holding = false;
    if (g.vy < CUT_V) g.vy = CUT_V;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = getComputedStyle(document.documentElement);
    const mono = root.getPropertyValue("--font-mono-f").trim() || "monospace";
    const display = root.getPropertyValue("--font-display-f").trim() || "sans-serif";

    let visible = false;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = world.current;
      g.w = r.width;
      g.h = r.height;
      g.ground = r.height - 56;
      g.px = Math.max(48, Math.min(110, r.width * 0.1));
      if (g.onGround) g.py = g.ground;
      if (!g.glyphs.length) {
        for (let i = 0; i < 14; i++) {
          g.glyphs.push({ x: rand(0, r.width), y: rand(24, g.ground - 70), ch: GLYPHS[i % GLYPHS.length], depth: rand(0.12, 0.35) });
        }
      }
    };

    const gameOver = (g: World) => {
      g.phase = "over";
      g.shake = 0.35;
      const score = Math.floor(g.dist / 12) + g.bonus;
      const prevBest = readBest();
      const isBest = score > prevBest;
      if (isBest) writeBest(score);
      const b = Math.max(score, prevBest);
      setBest(b);
      setResult({ score, best: b, isBest, dodged: g.dodged, logos: g.logos });
      setPhase("over");
    };

    const spawnObstacle = (g: World) => {
      const conflict = g.t > 7 && Math.random() < 0.28;
      if (conflict) {
        g.obstacles.push({ x: g.w + 30, w: 20, h: 48, kind: "conflict", count: 1, passed: false });
      } else {
        const max = g.t > 16 ? 3 : g.t > 6 ? 2 : 1;
        const count = 1 + Math.floor(Math.random() * max);
        g.obstacles.push({ x: g.w + 30, w: count * 24, h: 18, kind: "bug", count, passed: false });
      }
      const minGap = g.speed * 0.62;
      g.nextObs = Math.max(minGap, g.speed * rand(0.7, 1.55)) + 40;
    };

    const spawnCoin = (g: World) => {
      const [label, legend] = TECH[Math.floor(Math.random() * TECH.length)];
      g.coins.push({ x: g.w + 30, y: g.ground - rand(92, 128), label, legend, taken: false, seed: Math.random() * 6 });
      g.nextCoin = g.speed * rand(1.8, 3.6);
    };

    const update = (g: World, dt: number) => {
      g.shake = Math.max(0, g.shake - dt);
      g.banner.t = Math.max(0, g.banner.t - dt);
      g.squash += (0 - g.squash) * Math.min(1, dt * 14);
      g.pops = g.pops.filter((p) => (p.t -= dt) > 0);
      g.dust = g.dust.filter((d) => {
        d.t -= dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.vy += 300 * dt;
        return d.t > 0;
      });

      const worldSpeed = g.phase === "running" ? g.speed : g.phase === "idle" ? 70 : 0;
      const dx = worldSpeed * dt;
      g.offset += dx;
      for (const gl of g.glyphs) {
        gl.x -= dx * gl.depth;
        if (gl.x < -40) {
          gl.x = g.w + rand(0, 80);
          gl.y = rand(24, g.ground - 70);
        }
      }

      if (g.phase !== "running") {
        if (g.phase === "idle") g.py = g.ground - Math.abs(Math.sin(performance.now() / 380)) * 10;
        return;
      }

      g.t += dt;
      g.speed = Math.min(940, 380 + g.t * 9.5);
      g.dist += dx;

      // player
      g.vy += GRAVITY * dt;
      g.py += g.vy * dt;
      if (g.py >= g.ground) {
        if (!g.onGround) {
          g.squash = 0.3;
          for (let i = 0; i < 7; i++) {
            g.dust.push({ x: g.px + SIZE / 2 + rand(-12, 12), y: g.ground, vx: rand(-90, 40), vy: rand(-120, -40), t: rand(0.25, 0.45) });
          }
        }
        g.py = g.ground;
        g.vy = 0;
        g.onGround = true;
      }
      if (!g.onGround) g.rot += dt * 7.2;
      else {
        const snap = Math.round(g.rot / (Math.PI / 2)) * (Math.PI / 2);
        g.rot += (snap - g.rot) * Math.min(1, dt * 22);
      }

      // obstacles
      g.nextObs -= dx;
      if (g.nextObs <= 0) spawnObstacle(g);
      const pl = g.px + 5;
      const pr = g.px + SIZE - 5;
      const pt = g.py - SIZE + 5;
      const pb = g.py - 2;
      for (const o of g.obstacles) {
        o.x -= dx;
        const ot = g.ground - o.h + (o.kind === "bug" ? 4 : 0);
        if (pr > o.x + 3 && pl < o.x + o.w - 3 && pb > ot && pt < g.ground) {
          gameOver(g);
          return;
        }
        if (!o.passed && o.x + o.w < g.px) {
          o.passed = true;
          g.dodged += o.count;
        }
      }
      g.obstacles = g.obstacles.filter((o) => o.x + o.w > -40);

      // coins
      g.nextCoin -= dx;
      if (g.nextCoin <= 0) spawnCoin(g);
      for (const c of g.coins) {
        c.x -= dx;
        if (!c.taken) {
          const cy = c.y + Math.sin(performance.now() / 300 + c.seed) * 5;
          if (Math.hypot(c.x + 12 - (g.px + SIZE / 2), cy + 12 - (g.py - SIZE / 2)) < 28) {
            c.taken = true;
            g.bonus += 25;
            g.logos++;
            g.pops.push({ x: c.x, y: cy, text: `+25 ${c.label}`, t: 0.9 });
          }
        }
      }
      g.coins = g.coins.filter((c) => c.x > -40 && !c.taken);

      const score = Math.floor(g.dist / 12) + g.bonus;
      const m = Math.floor(score / 300);
      if (m > g.milestone) {
        g.milestone = m;
        g.banner = { text: `v${m + 1}.0 shipped to prod 🚀`, t: 1.6 };
      }
    };

    const drawBug = (x: number, ground: number, t: number) => {
      const cx = x + 12;
      const cy = ground - 9;
      const leg = Math.sin(t * 22 + x) * 2;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.6;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * 5, cy + 2);
        ctx.lineTo(cx + i * 6 - 3, ground - (i === 0 ? leg : -leg) * 0.5);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy - 5);
      ctx.lineTo(cx - 13, cy - 11);
      ctx.moveTo(cx - 6, cy - 3);
      ctx.lineTo(cx - 14, cy - 5);
      ctx.stroke();
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.ellipse(cx + 1, cy, 10, 7.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx - 8, cy - 1, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(238,235,227,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + 1, cy - 7);
      ctx.lineTo(cx + 1, cy + 7);
      ctx.stroke();
      ctx.fillStyle = SIGNAL;
      ctx.fillRect(cx - 10, cy - 3, 2.2, 2.2);
    };

    const drawConflict = (o: Obstacle, ground: number) => {
      const y = ground - o.h;
      ctx.fillStyle = INK;
      ctx.fillRect(o.x, y, o.w, o.h);
      ctx.save();
      ctx.beginPath();
      ctx.rect(o.x + 2, y + 2, o.w - 4, o.h - 4);
      ctx.clip();
      ctx.strokeStyle = SIGNAL;
      ctx.lineWidth = 4;
      for (let k = -o.h; k < o.w + o.h; k += 10) {
        ctx.beginPath();
        ctx.moveTo(o.x + k, y);
        ctx.lineTo(o.x + k - o.h, y + o.h);
        ctx.stroke();
      }
      ctx.restore();
      ctx.fillStyle = INK;
      ctx.font = `700 9px ${mono}`;
      ctx.textAlign = "center";
      ctx.fillText("<<<", o.x + o.w / 2, y - 6);
    };

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    const draw = (g: World, now: number) => {
      ctx.save();
      ctx.clearRect(0, 0, g.w, g.h);
      if (g.shake > 0) ctx.translate(rand(-5, 5) * g.shake * 2, rand(-4, 4) * g.shake * 2);

      // parallax code glyphs
      ctx.fillStyle = RULE;
      ctx.font = `500 16px ${mono}`;
      ctx.textAlign = "left";
      for (const gl of g.glyphs) ctx.fillText(gl.ch, gl.x, gl.y);

      // ground + moving ticks + pipeline stages
      ctx.fillStyle = INK;
      ctx.fillRect(0, g.ground, g.w, 2);
      ctx.fillStyle = RULE;
      const tick = 28;
      for (let x = -(g.offset % tick); x < g.w; x += tick) ctx.fillRect(x, g.ground + 8, 10, 1.5);
      ctx.font = `500 10px ${mono}`;
      ctx.fillStyle = MUTED;
      const span = 300;
      const first = Math.floor(g.offset / span);
      for (let i = first; i < first + Math.ceil(g.w / span) + 2; i++) {
        const x = i * span - g.offset;
        ctx.fillText(STAGES[((i % 3) + 3) % 3].toUpperCase(), x, g.ground + 32);
        ctx.fillRect(x - 8, g.ground + 25, 3, 3);
      }

      // coins (mini keycaps)
      for (const c of g.coins) {
        const cy = c.y + Math.sin(now / 300 + c.seed) * 5;
        ctx.fillStyle = INK;
        roundRect(c.x, cy + 3, 24, 24, 6);
        ctx.fill();
        ctx.fillStyle = "#f8f5ee";
        roundRect(c.x, cy, 24, 24, 6);
        ctx.fill();
        ctx.strokeStyle = INK;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = INK;
        ctx.font = `700 ${c.legend.length > 2 ? 7 : 9}px ${mono}`;
        ctx.textAlign = "center";
        ctx.fillText(c.legend, c.x + 12, cy + 15.5);
      }

      // obstacles
      for (const o of g.obstacles) {
        if (o.kind === "conflict") drawConflict(o, g.ground);
        else for (let i = 0; i < o.count; i++) drawBug(o.x + i * 24, g.ground, now / 1000);
      }

      // player shadow
      const lift = Math.min(1, (g.ground - g.py) / 140);
      ctx.fillStyle = `rgba(17,17,16,${0.18 * (1 - lift * 0.7)})`;
      ctx.beginPath();
      ctx.ellipse(g.px + SIZE / 2, g.ground + 1, (SIZE / 2) * (1 - lift * 0.5), 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // player
      ctx.save();
      ctx.translate(g.px + SIZE / 2, g.py - SIZE / 2);
      ctx.rotate(g.rot);
      ctx.scale(1 + g.squash, 1 - g.squash);
      ctx.fillStyle = SIGNAL;
      ctx.fillRect(-SIZE / 2, -SIZE / 2, SIZE, SIZE);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.strokeRect(-SIZE / 2, -SIZE / 2, SIZE, SIZE);
      ctx.fillStyle = INK;
      const blink = Math.sin(now / 900) > 0.97 ? 1 : 4;
      ctx.fillRect(3, -6, 3.5, blink);
      ctx.fillRect(8.5, -6, 3.5, blink);
      ctx.restore();

      // dust
      ctx.fillStyle = INK;
      for (const d of g.dust) {
        ctx.globalAlpha = Math.max(0, d.t / 0.45);
        ctx.fillRect(d.x, d.y, 2.5, 2.5);
      }
      ctx.globalAlpha = 1;

      // pops
      ctx.font = `700 11px ${mono}`;
      ctx.textAlign = "left";
      for (const p of g.pops) {
        ctx.globalAlpha = Math.min(1, p.t / 0.5);
        ctx.fillStyle = SIGNAL;
        ctx.fillText(p.text, p.x, p.y - (0.9 - p.t) * 40);
      }
      ctx.globalAlpha = 1;

      // HUD
      if (g.phase !== "idle") {
        const score = Math.floor(g.dist / 12) + g.bonus;
        ctx.textAlign = "right";
        ctx.fillStyle = INK;
        ctx.font = `700 13px ${mono}`;
        ctx.fillText(String(score).padStart(6, "0"), g.w - 18, 28);
        ctx.fillStyle = MUTED;
        ctx.font = `500 10px ${mono}`;
        ctx.fillText(`HI ${String(bestRef.current).padStart(6, "0")}`, g.w - 18, 44);
        ctx.textAlign = "left";
        ctx.fillText(`PIPELINE ${(g.speed / 380).toFixed(1)}x`, 18, 28);
      }

      // milestone banner
      if (g.banner.t > 0) {
        const a = Math.min(1, g.banner.t / 0.4);
        ctx.globalAlpha = a;
        ctx.font = `700 18px ${display}`;
        ctx.textAlign = "center";
        const tw = ctx.measureText(g.banner.text).width + 28;
        const bx = g.w / 2 - tw / 2;
        const by = 56 - (1 - a) * 10;
        ctx.fillStyle = INK;
        ctx.fillRect(bx + 4, by + 4, tw, 34);
        ctx.fillStyle = SIGNAL;
        ctx.fillRect(bx, by, tw, 34);
        ctx.strokeStyle = INK;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bx, by, tw, 34);
        ctx.fillStyle = INK;
        ctx.fillText(g.banner.text, g.w / 2, by + 23);
        ctx.globalAlpha = 1;
      }
      ctx.restore();
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (!visible || document.hidden) return;
      const g = world.current;
      update(g, dt);
      draw(g, now);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(wrap);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Enter") {
      e.preventDefault();
      if (!e.repeat) press();
    }
  };
  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") release();
  };

  return (
    <section id="play" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          index="07"
          eyebrow="Break time"
          title={
            <>
              Ship it. Don&apos;t let <span className="font-serif font-normal italic text-signal">bugs</span> reach prod.
            </>
          }
          aside="A tiny runner built for this site. Jump the bugs, clear the merge conflicts, grab the tech stack. How far can your pipeline go?"
        />

        <Reveal>
          <div className="border border-ink bg-paper shadow-[8px_8px_0_0_#111110]">
            <div className="flex items-center justify-between gap-4 border-b border-ink bg-ink px-4 py-2.5 font-mono text-[11px] tracking-[0.12em] text-paper/70 uppercase">
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${phase === "running" ? "animate-pulse bg-[#c8f169]" : phase === "over" ? "bg-signal" : "bg-paper/40"}`} />
                deploy-dash <span className="text-paper/40">— main</span>
              </span>
              <span className="hidden sm:inline">
                Space / tap to jump · hold for higher
              </span>
              <span className="tabular-nums">best {String(best).padStart(6, "0")}</span>
            </div>

            <div
              ref={wrapRef}
              tabIndex={0}
              role="application"
              aria-label="Deploy Dash game. Press Space or tap to jump."
              data-cursor={phase === "idle" ? "Play" : undefined}
              onPointerDown={(e) => {
                if ((e.target as HTMLElement).closest("button")) return;
                e.preventDefault();
                wrapRef.current?.focus({ preventScroll: true });
                press();
              }}
              onPointerUp={release}
              onPointerLeave={release}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}
              className="bg-dots relative h-[280px] cursor-pointer touch-manipulation outline-none select-none focus-visible:ring-2 focus-visible:ring-signal md:h-[340px]"
            >
              <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

              <AnimatePresence>
                {phase === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 pb-10 text-center"
                  >
                    <p className="font-display text-4xl font-extrabold tracking-[-0.04em] md:text-6xl">
                      Deploy<span className="text-signal">Dash</span>
                    </p>
                    <p className="flex items-center gap-3 font-mono text-xs tracking-[0.14em] text-muted uppercase">
                      Press
                      <span className="rounded-md border-2 border-ink bg-paper px-3 py-1.5 text-ink shadow-[0_3px_0_0_#111110]">space</span>
                      or tap to deploy
                    </p>
                  </motion.div>
                )}

                {phase === "over" && result && (
                  <motion.div
                    key="over"
                    initial={{ opacity: 0, y: 16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease }}
                    className="absolute inset-0 flex items-center justify-center bg-paper/70 p-4 backdrop-blur-[2px]"
                  >
                    <div className="w-full max-w-sm border border-ink bg-paper p-5 text-center shadow-[6px_6px_0_0_#111110]">
                      <p className="font-mono text-[10px] tracking-[0.16em] text-signal uppercase">✕ Pipeline failed</p>
                      <p className="mt-2 font-display text-2xl font-extrabold tracking-tight md:text-3xl">A bug reached production.</p>
                      <div className="mt-4 grid grid-cols-3 border-y border-rule py-3 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
                        <div>
                          Score
                          <p className="mt-1 font-display text-xl font-bold text-ink">{result.score}</p>
                        </div>
                        <div>
                          Bugs dodged
                          <p className="mt-1 font-display text-xl font-bold text-ink">{result.dodged}</p>
                        </div>
                        <div>
                          Logos
                          <p className="mt-1 font-display text-xl font-bold text-ink">{result.logos}</p>
                        </div>
                      </div>
                      <p className="mt-3 font-mono text-[11px] tracking-[0.12em] uppercase">
                        {result.isBest ? <span className="bg-signal px-2 py-0.5 text-ink">★ New best</span> : <>Best {result.best}</>}
                      </p>
                      <button
                        onClick={start}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-mono text-xs tracking-[0.14em] text-paper uppercase transition hover:bg-signal hover:text-ink"
                      >
                        Redeploy ↻
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ink px-4 py-3 font-mono text-[11px] tracking-[0.1em] text-muted uppercase">
              <span className="flex items-center gap-2">
                <span className="inline-block h-3 w-4 rounded-full bg-ink" /> Bug — jump it
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-4 w-2.5 bg-[repeating-linear-gradient(135deg,#ff4f1f_0_3px,#111110_3px_6px)]" /> Merge conflict — jump high
              </span>
              <span className="flex items-center gap-2">
                <span className="grid h-4 w-4 place-items-center rounded-[4px] border border-ink bg-paper text-[7px] text-ink">PY</span> Tech keycap — +25
              </span>
              <span className="ml-auto hidden md:inline">Every 300 pts ships a new version 🚀</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
