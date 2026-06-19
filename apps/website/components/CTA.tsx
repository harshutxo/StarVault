import Link from "next/link";

export function CTA() {
  return (
    <section className="starfield px-6 py-24 text-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-normal text-cyan">Join the protocol</p>
          <h2 className="mt-3 max-w-4xl text-4xl font-black md:text-6xl">Help build the next layer of the internet.</h2>
        </div>
        <Link href="/contact" className="rounded-card bg-white px-6 py-4 text-center font-black text-midnight">
          Start a conversation
        </Link>
      </div>
    </section>
  );
}
