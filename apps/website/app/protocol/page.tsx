import { ProtocolDiagram } from "@/components/ProtocolDiagram";
import { protocolLayers } from "@starvault/protocol";

export default function ProtocolPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[0.9fr_1.1fr]">
      <section>
        <p className="text-sm font-black uppercase tracking-normal text-vault">StarVault Protocol</p>
        <h1 className="mt-3 text-5xl font-black">SVP standardizes identity, consent, access, audit, and governance.</h1>
        <p className="mt-5 leading-8 text-slate-600">
          The protocol defines how applications request data, how users approve access, how scoped tokens are issued, and how every action becomes auditable.
        </p>
      </section>
      <ProtocolDiagram />
      <section className="lg:col-span-2">
        <div className="grid gap-4 md:grid-cols-2">
          {protocolLayers.map((layer) => (
            <article key={layer.name} className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
              <span className="text-xs font-black uppercase text-vault">{layer.priority}</span>
              <h2 className="mt-2 text-2xl font-black">{layer.name}</h2>
              <p className="mt-3 text-slate-600">{layer.api}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
