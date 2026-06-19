import Link from "next/link";
import { ArrowRight } from "lucide-react";

const particles = Array.from({ length: 42 }, (_, index) => ({
  left: `${(index * 23) % 100}%`,
  top: `${(index * 37) % 100}%`,
  delay: `${(index % 9) * 0.75}s`,
  duration: `${10 + (index % 7)}s`
}));

export function Hero() {
  return (
    <section className="starfield relative min-h-[calc(100vh-73px)] overflow-hidden border-b border-white/10">
      <div className="particle-field">
        {particles.map((particle, index) => (
          <span
            key={index}
            className="particle"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl content-center gap-12 px-6 py-20 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="max-w-4xl">
          <p className="text-sm font-black uppercase tracking-normal text-cyan/80">StarVault Protocol</p>
          <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-normal text-white md:text-7xl lg:text-8xl">
            The Internet Connected Information.
            <span className="mt-3 block text-cyan">It Is Time To Connect Trust.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
            StarVault is the open protocol and platform where applications request permission, users approve with intent, and encrypted access exists only inside consent.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/developers" className="inline-flex items-center gap-2 rounded-card bg-white px-5 py-3 font-black text-midnight">
              Help build the next layer <ArrowRight size={18} />
            </Link>
            <Link href="/protocol" className="inline-flex items-center gap-2 rounded-card border border-cyan/40 bg-cyan/10 px-5 py-3 font-black text-cyan">
              Read the protocol
            </Link>
          </div>
        </div>

        <div className="relative min-h-[520px]">
          <svg viewBox="0 0 640 640" className="absolute inset-0 h-full w-full" role="img" aria-label="Human data network">
            <defs>
              <radialGradient id="sphere" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="42%" stopColor="#3B82F6" stopOpacity="0.34" />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.03" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx="320" cy="320" r="168" fill="url(#sphere)" stroke="#3B82F6" strokeOpacity="0.3" />
            <circle cx="320" cy="320" r="236" fill="none" stroke="#ffffff" strokeOpacity="0.08" />
            <circle cx="320" cy="320" r="292" fill="none" stroke="#22D3EE" strokeOpacity="0.08" />

            {[
              [320, 118, 168, 210],
              [320, 118, 478, 212],
              [168, 210, 220, 438],
              [478, 212, 420, 440],
              [220, 438, 420, 440],
              [168, 210, 320, 320],
              [478, 212, 320, 320],
              [220, 438, 320, 320],
              [420, 440, 320, 320]
            ].map(([x1, y1, x2, y2], index) => (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#22D3EE"
                strokeOpacity="0.34"
                strokeWidth="1.5"
                className="connection-draw"
                style={{ animationDelay: `${index * 0.18 + 0.7}s` }}
              />
            ))}

            {[
              [320, 118, "People"],
              [168, 210, "AI"],
              [478, 212, "Apps"],
              [220, 438, "Vaults"],
              [420, 440, "Consent"],
              [320, 320, "Human Data"]
            ].map(([cx, cy, label], index) => (
              <g key={label} className="node-pulse" style={{ animationDelay: `${index * 0.25}s` }} filter="url(#glow)">
                <circle cx={cx as number} cy={cy as number} r={label === "Human Data" ? 20 : 12} fill={label === "Human Data" ? "#ffffff" : "#22D3EE"} />
                <text x={cx as number} y={(cy as number) + 34} textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="700">
                  {label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
