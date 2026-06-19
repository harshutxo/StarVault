import type { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export function FeatureCard({ icon: Icon, title, body }: FeatureCardProps) {
  return (
    <article className="rounded-card border border-white/10 bg-white/[0.035] p-6 shadow-[0_0_50px_rgba(59,130,246,0.08)]">
      <Icon className="text-cyan" />
      <h3 className="mt-4 text-xl font-black text-white">{title}</h3>
      <p className="mt-3 leading-7 text-slate-400">{body}</p>
    </article>
  );
}
