import Link from "next/link";
import { ArrowRight, Check, ChevronRight, LockKeyhole, ScanLine, Sparkles } from "lucide-react";

const particles = Array.from({ length: 42 }, (_, index) => ({
  left: `${(index * 23) % 100}%`,
  top: `${(index * 37) % 100}%`,
  delay: `${(index % 9) * 0.75}s`,
  duration: `${10 + (index % 7)}s`
}));

export function Hero() {
  return (
    <section className="starfield relative overflow-hidden border-b border-white/10">
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

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl content-center gap-12 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-cyan">
            <Sparkles size={14} /> The personal data protocol
          </div>
          <h1 className="mt-6 text-5xl font-black leading-[0.94] tracking-[-0.055em] text-white md:text-7xl lg:text-[5.5rem]">
            Your data should
            <span className="block text-cyan">answer to you.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
            Keep your identity, documents, and AI context in one encrypted vault. Every app request is visible, scoped, and revocable by design.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/developers" className="inline-flex items-center gap-2 rounded-card bg-white px-5 py-3 font-black text-midnight transition hover:bg-cyan">
              Explore the protocol <ArrowRight size={18} />
            </Link>
            <Link href="/protocol" className="inline-flex items-center gap-2 rounded-card border border-white/15 bg-white/5 px-5 py-3 font-black text-white transition hover:border-cyan/40 hover:text-cyan">
              How consent works
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-slate-300">
            {['Encrypted by default', 'Revoke anytime', 'Open protocol'].map((item) => (
              <span key={item} className="inline-flex items-center gap-2"><Check size={16} className="text-cyan" />{item}</span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[590px] py-5 lg:py-0">
          <div className="absolute -inset-10 rounded-full bg-cyan/15 blur-3xl" />
          <div className="relative rounded-[28px] border border-white/15 bg-[#0b1728]/90 p-4 shadow-[0_32px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan text-midnight"><LockKeyhole size={19} /></span><div><p className="text-sm font-black text-white">My Vault</p><p className="text-xs text-slate-400">Protected and in sync</p></div></div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300">Secure</span>
            </div>
            <div className="grid gap-3 py-5 sm:grid-cols-3">
              {[["12", "Protected items"], ["3", "Active permissions"], ["0", "Data breaches"]].map(([value, label]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4"><p className="text-2xl font-black text-white">{value}</p><p className="mt-1 text-xs font-medium text-slate-400">{label}</p></div>)}
            </div>
            <div className="rounded-2xl border border-cyan/25 bg-cyan/[0.07] p-4">
              <div className="flex items-start justify-between gap-4"><div className="flex gap-3"><span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan/15 text-cyan"><ScanLine size={18} /></span><div><p className="font-bold text-white">New access request</p><p className="mt-1 text-sm leading-5 text-slate-300">ResumeAI wants read-only access to your work history for 2 hours.</p></div></div><ChevronRight className="mt-2 text-cyan" size={19} /></div>
              <div className="mt-4 flex items-center gap-3 text-xs font-bold"><span className="rounded-lg bg-white px-3 py-2 text-midnight">Review request</span><span className="inline-flex items-center gap-1 text-slate-400"><Check size={13} /> No export allowed</span></div>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-400/15 text-blue-300"><LockKeyhole size={17} /></span><div className="flex-1"><p className="text-sm font-bold text-white">Wellnest Health</p><p className="text-xs text-slate-400">Fitness trend summary · expires in 29 days</p></div><span className="text-xs font-bold text-emerald-300">Active</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
