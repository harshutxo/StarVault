"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export function CTA() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    setJoined(true);
  }

  return (
    <section className="starfield px-6 py-24 text-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-normal text-cyan">Join the protocol</p>
          <h2 className="mt-3 max-w-4xl text-4xl font-black md:text-6xl">Own the layer that owns you.</h2>
          <p className="mt-4 max-w-xl leading-7 text-slate-300">
            StarVault is building a world where personal data follows the person, not the platform. Join the early access list or start a conversation with the team.
          </p>
        </div>
        <div className="flex w-full max-w-md flex-col gap-3">
          {joined ? (
            <p className="rounded-card border border-cyan/40 bg-cyan/10 px-5 py-4 text-center font-bold text-cyan">
              You&apos;re on the StarVault early access list.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                className="min-w-0 flex-1 rounded-card border border-white/15 bg-white/5 px-5 py-4 text-white placeholder:text-slate-500 focus:border-cyan/50 focus:outline-none"
              />
              <button type="submit" className="rounded-card bg-white px-6 py-4 text-center font-black text-midnight transition hover:bg-cyan">
                Join the waitlist
              </button>
            </form>
          )}
          <Link href="/contact" className="text-center text-sm font-bold text-slate-400 transition hover:text-cyan">
            or start a conversation with the team
          </Link>
        </div>
      </div>
    </section>
  );
}
