const eras = [
  ["1969", "ARPANET", "Information begins moving between machines."],
  ["1991", "Web", "Publishing becomes global."],
  ["2008", "Blockchain", "Ownership becomes programmable."],
  ["2022", "AI", "Context becomes the new interface."],
  ["2030", "StarVault Protocol", "Consent becomes the network layer for human data."]
];

export function InternetTimeline() {
  return (
    <section className="bg-midnight px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-normal text-cyan">Timeline</p>
        <h2 className="mt-3 max-w-4xl text-4xl font-black text-white md:text-6xl">The internet is ready for a trust layer.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {eras.map(([year, title, body]) => (
            <article key={year} className="rounded-card border border-white/10 bg-white/[0.03] p-5">
              <span className="text-sm font-black text-cyan">{year}</span>
              <h3 className="mt-3 text-xl font-black text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
