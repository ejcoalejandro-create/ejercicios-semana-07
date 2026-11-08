import type { Metadata } from 'next';
import { asc } from 'drizzle-orm';
import { db } from '@/db';
import { planes } from '@/db/schema';
import FormularioAlta from './FormularioAlta';

export const metadata: Metadata = {
  title: 'Hazte socio',
};

// Los planes se leen de la base de datos en cada visita, no al compilar.
export const dynamic = 'force-dynamic';

export default function PaginaAlta() {
  const lista = db.select().from(planes).orderBy(asc(planes.precioMensual)).all();

  return (
    <main className="mx-auto max-w-xl px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">Hazte socio del club</h1>
      <p className="mt-3 text-stone-600">
        Elige tu plan y cada mes te mandamos a casa una selección de nuestros cafés.
      </p>

      <div className="mt-8">
        {lista.length === 0 ? (
          <p className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-stone-700">
            Ahora mismo no hay planes disponibles. Vuelve a intentarlo más tarde.
          </p>
        ) : (
          <FormularioAlta planes={lista} />
        )}
      </div>
    </main>
  );
}