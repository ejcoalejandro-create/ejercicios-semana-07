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
          <Link href="/catas" className="font-medium text-amber-800 hover:underline">
            Ejercicio 3: libro de catas →
          </Link>
        </li>
        <li>
          <a href="/api/estado" className="font-medium text-amber-800 hover:underline">
            Ejercicio 1: GET /api/estado →
          </a>
        </li>
      </ul>
    </main>
  );
}