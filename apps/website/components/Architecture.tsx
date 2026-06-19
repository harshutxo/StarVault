const layers = [
  ["Applications", "AI, healthcare, finance, HR, social systems request access."],
  ["Developer SDKs", "Python, JavaScript, Java, Go, and Swift make consent easy to integrate."],
  ["StarVault Protocol", "Identity, consent, access gateway, vault, policy, audit, discovery, federation, crypto, governance."],
  ["Storage Providers", "Local, cloud, IPFS, and enterprise storage remain interchangeable."],
  ["Internet", "The substrate. StarVault adds the missing trust layer."]
];

export function Architecture() {
  return (
    <section className="border-y border-white/10 bg-midnight px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-normal text-cyan">Interactive architecture</p>
        <h2 className="mt-3 max-w-4xl text-4xl font-black text-white md:text-6xl">
          Watch the protocol assemble like a city being built.
        </h2>
        <div className="mt-10 grid gap-3">
          {layers.map(([title, body], index) => (
            <article
              key={title}
              className="rounded-card border border-white/10 bg-white/[0.035] p-6 shadow-[0_0_50px_rgba(59,130,246,0.08)]"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <h3 className="text-2xl font-black text-white">{title}</h3>
                <p className="max-w-3xl leading-7 text-slate-400">{body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
