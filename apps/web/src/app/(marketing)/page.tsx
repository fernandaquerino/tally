export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 text-slate-950">
      <section className="w-full max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
          Tally
        </p>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
          Finanças PF e PJ no mesmo lugar.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
          Saiba quanto do seu faturamento é imposto, reserva da empresa e
          dinheiro realmente disponível para você.
        </p>
      </section>
    </main>
  );
}
