export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <p className="text-sm font-black uppercase tracking-normal text-vault">Contact</p>
      <h1 className="mt-3 text-5xl font-black">Join the StarVault pilot program.</h1>
      <form className="mt-8 grid gap-4 rounded-card border border-slate-200 bg-white p-6 shadow-soft">
        <input className="rounded-card border border-slate-200 px-4 py-3" placeholder="Name" />
        <input className="rounded-card border border-slate-200 px-4 py-3" placeholder="Email" type="email" />
        <textarea className="min-h-32 rounded-card border border-slate-200 px-4 py-3" placeholder="Tell us what you want to build with StarVault" />
        <button className="rounded-card bg-vault px-5 py-3 font-black text-white" type="button">Request access</button>
      </form>
    </main>
  );
}
