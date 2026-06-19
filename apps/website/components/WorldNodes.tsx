const nodes = ["India", "Europe", "Japan", "Brazil", "US", "Kenya", "Singapore"];

export function WorldNodes() {
  return (
    <section className="border-y border-white/10 bg-deep-space px-6 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-normal text-cyan">Federation</p>
          <h2 className="mt-3 text-4xl font-black text-white md:text-6xl">A world map of future personal vault nodes.</h2>
          <p className="mt-5 leading-8 text-slate-300">
            StarVault should not depend on one server owning everything. The long-term network is federated: local nodes, institutional nodes, and user-owned vaults speaking the same protocol.
          </p>
        </div>
        <div className="relative min-h-[360px] rounded-card border border-white/10 bg-midnight">
          {nodes.map((node, index) => (
            <div
              key={node}
              className="node-pulse absolute rounded-full border border-cyan/40 bg-cyan/20 px-3 py-2 text-xs font-black text-cyan"
              style={{
                left: `${12 + ((index * 29) % 72)}%`,
                top: `${18 + ((index * 17) % 58)}%`,
                animationDelay: `${index * 0.3}s`
              }}
            >
              {node}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
