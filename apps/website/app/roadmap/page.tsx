import { Timeline } from "@/components/Timeline";
import { roadmapPhases } from "@starvault/protocol";

export default function RoadmapPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-14">
      <p className="text-sm font-black uppercase tracking-normal text-vault">Roadmap</p>
      <h1 className="mt-3 max-w-4xl text-5xl font-black">From vault MVP to open consent infrastructure.</h1>
      <div className="mt-10">
        <Timeline
          items={roadmapPhases.map((phase) => ({
            label: phase.phase,
            title: phase.title,
            body: phase.objective
          }))}
        />
      </div>
    </main>
  );
}
