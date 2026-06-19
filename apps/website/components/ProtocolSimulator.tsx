"use client";

import { useState } from "react";
import { Bot, CalendarDays, KeyRound, ShieldCheck, XCircle } from "lucide-react";

type SimulatorState = "requesting" | "approved" | "revoked";

export function ProtocolSimulator() {
  const [state, setState] = useState<SimulatorState>("requesting");

  return (
    <section className="border-y border-white/10 bg-deep-space px-6 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-normal text-cyan">Live protocol simulator</p>
          <h2 className="mt-3 text-4xl font-black text-white md:text-6xl">Watch consent become infrastructure.</h2>
          <p className="mt-5 leading-8 text-slate-300">
            An AI agent requests calendar access. StarVault does not hand over data by default. A scoped, temporary encrypted stream appears only after approval.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => setState("approved")} className="rounded-card bg-white px-5 py-3 font-black text-midnight">
              Approve
            </button>
            <button onClick={() => setState("revoked")} className="rounded-card border border-cyan/40 bg-cyan/10 px-5 py-3 font-black text-cyan">
              Revoke
            </button>
            <button onClick={() => setState("requesting")} className="rounded-card border border-white/15 px-5 py-3 font-black text-white">
              Reset
            </button>
          </div>
        </div>

        <div className="rounded-card border border-white/10 bg-midnight p-6 shadow-[0_0_60px_rgba(59,130,246,0.12)]">
          <div className="grid gap-4 md:grid-cols-3">
            <Node icon={<Bot />} title="AI Agent" body="Requests Calendar Access" />
            <Node icon={<ShieldCheck />} title="StarVault" body={state === "requesting" ? "Waiting For Consent" : state === "approved" ? "Token Issued" : "Token Revoked"} active />
            <Node icon={<CalendarDays />} title="Calendar" body="Private Resource" />
          </div>
          <div className="relative my-8 h-20 overflow-hidden rounded-card border border-white/10 bg-white/[0.03]">
            {state === "approved" ? (
              <div className="absolute inset-y-0 left-0 flex animate-[packet-drift_3s_linear_infinite] items-center gap-3">
                {Array.from({ length: 16 }, (_, index) => (
                  <span key={index} className="h-2 w-10 rounded-full bg-cyan shadow-[0_0_18px_rgba(34,211,238,0.8)]" />
                ))}
              </div>
            ) : (
              <div className="grid h-full place-items-center text-sm font-black uppercase text-slate-500">
                {state === "requesting" ? "No stream before consent" : "Connection revoked"}
              </div>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Status icon={<KeyRound />} label="Scope" value={state === "approved" ? "calendar.read" : "none"} />
            <Status icon={<ShieldCheck />} label="Duration" value={state === "approved" ? "15 minutes" : "0"} />
            <Status icon={<XCircle />} label="Export" value="blocked" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Node({ icon, title, body, active = false }: { icon: React.ReactNode; title: string; body: string; active?: boolean }) {
  return (
    <article className={`rounded-card border p-5 ${active ? "border-cyan/40 bg-cyan/10" : "border-white/10 bg-white/[0.03]"}`}>
      <div className="text-cyan">{icon}</div>
      <h3 className="mt-4 font-black text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{body}</p>
    </article>
  );
}

function Status({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-card border border-white/10 bg-white/[0.03] p-4">
      <div className="text-cyan">{icon}</div>
      <p className="mt-3 text-xs font-black uppercase text-slate-500">{label}</p>
      <strong className="text-white">{value}</strong>
    </div>
  );
}
