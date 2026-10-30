import Reveal from "./Reveal";

type Props = {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  dark?: boolean;
};

export default function SectionHeading({ index, eyebrow, title, aside, dark }: Props) {
  const rule = dark ? "border-paper/15" : "border-rule";
  const sub = dark ? "text-paper/50" : "text-muted";
  return (
    <div className="mb-14 md:mb-20">
      <Reveal>
        <div className={`flex items-center justify-between border-t ${rule} pt-4 font-mono text-[11px] tracking-[0.18em] uppercase ${sub}`}>
          <span>
            <span className="text-signal">§{index}</span> &nbsp;{eyebrow}
          </span>
          <span className="hidden sm:inline">Alok Ram Tripathi · Portfolio</span>
        </div>
      </Reveal>
      <div className="mt-8 grid gap-6 md:grid-cols-12 md:items-end">
        <Reveal className="md:col-span-8" delay={0.05}>
          <h2 className="font-display text-[clamp(2.4rem,6vw,5.2rem)] leading-[0.95] font-bold tracking-[-0.035em]">
            {title}
          </h2>
        </Reveal>
        {aside && (
          <Reveal className={`md:col-span-4 md:pb-2 ${sub} leading-relaxed`} delay={0.12}>
            {aside}
          </Reveal>
        )}
      </div>
    </div>
  );
}
