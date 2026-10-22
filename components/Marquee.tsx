type Props = {
  items: string[];
  variant?: "signal" | "ink" | "outline";
  reverse?: boolean;
  tilt?: number;
  duration?: number;
};

export default function Marquee({ items, variant = "signal", reverse, tilt = 0, duration = 38 }: Props) {
  const styles = {
    signal: "bg-signal text-ink",
    ink: "bg-ink text-paper",
    outline: "bg-transparent text-outline",
  }[variant];
  const row = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-1" style={{ transform: `rotate(${tilt}deg)` }} aria-hidden>
      <div className={`${styles} ${variant === "outline" ? "" : "border-y border-ink"} py-4`}>
        <div
          className={`marquee flex w-max items-center ${reverse ? "marquee-rev" : ""}`}
          style={{ ["--dur" as string]: `${duration}s` }}
        >
          {row.map((t, i) => (
            <span
              key={i}
              className={`flex items-center gap-8 px-4 font-display font-bold tracking-tight uppercase ${
                variant === "outline" ? "text-[clamp(3rem,9vw,8rem)] leading-none" : "text-2xl md:text-4xl"
              }`}
            >
              {t}
              <span className={variant === "outline" ? "text-signal [-webkit-text-stroke:0]" : ""}>✱</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
