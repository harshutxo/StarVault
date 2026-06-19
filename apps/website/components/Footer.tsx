import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-midnight px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-slate-400 md:flex-row">
        <p className="font-bold">StarVault: human consent infrastructure.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
