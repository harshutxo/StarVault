type TimelineItem = {
  label: string;
  title: string;
  body: string;
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <article key={item.title} className="rounded-card border border-slate-200 bg-white p-5 shadow-soft">
          <span className="text-xs font-black uppercase text-vault">{item.label}</span>
          <h3 className="mt-2 text-xl font-black">{item.title}</h3>
          <p className="mt-2 leading-7 text-slate-600">{item.body}</p>
        </article>
      ))}
    </div>
  );
}
