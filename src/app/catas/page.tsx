import { desc } from 'drizzle-orm';
import { db } from '@/db';
import { valoraciones } from '@/db/schema';
import FormularioValoracion from './FormularioValoracion';

// Se lee de la base de datos en cada visita, no al compilar.
export const dynamic = 'force-dynamic';

export default function PaginaCatas() {
  const lista = db.select().from(valoraciones).orderBy(desc(valoraciones.id)).all();

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold text-stone-900">Libro de catas</h1>
      <p className="mt-2 text-stone-600">Deja tu valoración de la última cata.</p>

      <section className="mt-8" aria-labelledby="valoraciones">
        <h2 id="valoraciones" className="text-xl font-semibold text-stone-900">
          Valoraciones ({lista.length})
        </h2>

        {lista.length === 0 ? (
          <p className="mt-4 text-stone-600">Todavía no hay valoraciones. ¡Sé el primero!</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {lista.map((v) => (
              <li key={v.id} className="rounded-xl border border-stone-200 bg-white p-4">
                <p className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-stone-900">{v.nombre}</span>
                  <span className="text-amber-600" aria-label={`${v.puntuacion} de 5`}>
                    {'★'.repeat(v.puntuacion)}
                    {'☆'.repeat(5 - v.puntuacion)}
                  </span>
                </p>
                <p className="mt-2 text-stone-700">{v.comentario}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10" aria-labelledby="nueva">
        <h2 id="nueva" className="mb-4 text-xl font-semibold text-stone-900">
          Deja tu valoración
        </h2>
        <FormularioValoracion />
      </section>
    </main>
  );
}