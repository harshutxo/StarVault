import { Architecture } from "@/components/Architecture";
import { CTA } from "@/components/CTA";
import { FeatureCard } from "@/components/FeatureCard";
import { Hero } from "@/components/Hero";
import { InternetTimeline } from "@/components/InternetTimeline";
import { ProtocolSimulator } from "@/components/ProtocolSimulator";
import { Roadmap } from "@/components/Roadmap";
import { WorldNodes } from "@/components/WorldNodes";
import { ShieldCheck, Network, KeyRound, ScrollText, Code2, BrainCircuit } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Personal Data Vault",
    body: "Encrypted identity, documents, AI memory, health, finance, and personal records under user control."
  },
  {
    icon: KeyRound,
    title: "Consent Engine",
    body: "Every request names purpose, scope, benefit, duration, retention, and revocation before access is granted."
  },
  {
    icon: Network,
    title: "Access Gateway",
    body: "Temporary scoped tokens let apps use exactly what was approved and nothing more."
  },
  {
    icon: ScrollText,
    title: "Audit Layer",
    body: "Users and enterprises can inspect who accessed what, why, when, and under which policy."
  },
  {
    icon: Code2,
    title: "Developer Platform",
    body: "SDKs, API docs, examples, app registration, and event hooks make protocol adoption practical."
  },
  {
    icon: BrainCircuit,
    title: "AI Context Gateway",
    body: "AI agents request memory and context through explicit user permissions instead of silent ingestion."
  }
];

export default function HomePage() {
  return (
    <main>
      <Hero />
      <section className="bg-midnight px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-normal text-cyan">There is another way</p>
          <h2 className="mt-3 max-w-4xl text-4xl font-black text-white md:text-6xl">
            Data does not need to flow outward by default.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
          </div>
        </div>
      </section>
      <ProtocolSimulator />
      <Architecture />
      <InternetTimeline />
      <Roadmap />
      <WorldNodes />
      <CTA />
    </main>
  );
}
