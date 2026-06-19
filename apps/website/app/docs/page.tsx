const docs = [
  ["Protocol Architecture", "/docs/PROTOCOL.md"],
  ["API Draft", "/docs/API.md"],
  ["Roadmap", "/docs/ROADMAP.md"],
  ["SVIP-0001", "/docs/SVIP-0001.md"]
];

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-14">
      <p className="text-sm font-black uppercase tracking-normal text-vault">Docs</p>
      <h1 className="mt-3 text-5xl font-black">Protocol specs, API drafts, and implementation notes.</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {docs.map(([title, href]) => (
          <a key={title} href={href} className="rounded-card border border-slate-200 bg-white p-6 shadow-soft hover:border-vault">
            <h2 className="text-2xl font-black">{title}</h2>
            <p className="mt-3 text-slate-600">{href}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
