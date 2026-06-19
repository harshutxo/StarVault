export function ProtocolDiagram() {
  const layers = ["Identity", "Consent", "Access", "Vault", "Policy", "Audit", "Discovery", "Federation", "Crypto", "Governance"];

  return (
    <div className="grid gap-3">
      {layers.map((layer) => (
        <div key={layer} className="rounded-card border border-slate-200 bg-white p-4 font-black shadow-soft">
          {layer} Layer
        </div>
      ))}
    </div>
  );
}
