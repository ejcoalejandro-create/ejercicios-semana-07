import Link from 'next/link';

export default function Inicio() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold text-stone-900">Ejercicios de la semana 7</h1>
      <p className="mt-2 text-stone-600">
        Route Handlers, Drizzle y Server Actions con el tostadero como excusa.
      </p>

      <ul className="mt-6 space-y-3">
        <li>
          <a href="/api/estado" className="font-medium text-amber-800 hover:underline">
            Ejercicio 1: GET /api/estado →
          </a>
          <p className="mt-1 text-sm text-stone-600">
            También hay un POST /api/reservas, que se prueba con curl (ver README).
          </p>
        </li>
        <li>
          <span className="font-medium text-stone-900">Ejercicio 2: Drizzle sin Next.js</span>
          <p className="mt-1 text-sm text-stone-600">
            Se hace con scripts, sin página. Ejecuta{' '}
            <code className="rounded bg-stone-200 px-1">npx tsx src/db/consultas.ts</code> en la
            terminal.
          </p>
        </li>
        <li>
          <Link href="/catas" className="font-medium text-amber-800 hover:underline">
            Ejercicio 3: libro de catas →
          </Link>
        </li>
      </ul>
    </main>
  );
}