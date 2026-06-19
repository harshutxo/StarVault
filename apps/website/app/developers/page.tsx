import { Code2, KeyRound, RadioTower, Webhook } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const items: Array<{ title: string; body: string; icon: LucideIcon }> = [
  { title: "API Explorer", body: "Inspect consent, token, vault, and audit endpoints.", icon: Code2 },
  { title: "SDK Downloads", body: "JavaScript first, then Python, Go, Java, and Swift.", icon: RadioTower },
  { title: "Authentication", body: "App IDs, keys, scoped tokens, and revocation.", icon: KeyRound },
  { title: "Events", body: "Subscribe to consent approved, revoked, and resource updated events.", icon: Webhook }
];

export default function DevelopersPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-14">
      <p className="text-sm font-black uppercase tracking-normal text-vault">Developer portal</p>
      <h1 className="mt-3 max-w-4xl text-5xl font-black">Build applications that ask before they access human data.</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {items.map(({ title, body, icon: Icon }) => (
          <article key={title} className="rounded-card border border-white/10 bg-white/[0.035] p-6 shadow-[0_0_50px_rgba(59,130,246,0.08)]">
            <Icon className="text-vault" />
            <h2 className="mt-4 text-2xl font-black text-white">{title}</h2>
            <p className="mt-3 leading-7 text-slate-400">{body}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
