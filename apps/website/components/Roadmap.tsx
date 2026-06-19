import { roadmapPhases } from "@starvault/protocol";

export function Roadmap() {
  return (
    <section className="bg-deep-space px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-normal text-cyan">Mission control</p>
        <h2 className="mt-3 text-4xl font-black text-white md:text-6xl">Twelve months to a protocol company.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {roadmapPhases.map((phase) => (
            <article key={phase.title} className="rounded-card border border-white/10 bg-midnight p-5 shadow-[0_0_50px_rgba(59,130,246,0.08)]">
              <span className="text-xs font-black uppercase text-cyan">{phase.phase}</span>
              <h3 className="mt-2 text-xl font-black text-white">{phase.title}</h3>
              <p className="mt-3 leading-7 text-slate-400">{phase.objective}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
