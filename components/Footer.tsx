export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night text-paper">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-6 font-mono text-[11px] tracking-[0.14em] text-paper/45 uppercase md:px-10">
        <span>© {new Date().getFullYear()} Alok Ram Tripathi</span>
        <span>Built with Next.js · Tailwind · Motion</span>
        <a href="#top" className="transition hover:text-signal">
          Back to top ↑
        </a>
      </div>
      <p
        aria-hidden
        className="pointer-events-none -mb-[0.2em] text-center font-display text-[21vw] leading-[0.8] font-extrabold tracking-[-0.07em] text-transparent select-none [-webkit-text-stroke:1px_rgba(238,235,227,0.18)]"
      >
        TRIPATHI
      </p>
    </footer>
  );
}
