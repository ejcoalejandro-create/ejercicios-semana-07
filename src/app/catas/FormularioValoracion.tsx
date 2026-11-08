'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { guardarValoracion, type EstadoFormulario } from './actions';

const estadoInicial: EstadoFormulario = {
  ok: false,
  mensaje: '',
  valores: { nombre: '', comentario: '', puntuacion: '' },
};

function BotonEnviar() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-stone-900 px-5 py-2 font-medium text-stone-50 hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Enviando…' : 'Enviar valoración'}
    </button>
  );
}

export default function FormularioValoracion() {
  const [estado, accion] = useActionState(guardarValoracion, estadoInicial);

  return (
    <form action={accion} className="space-y-4 rounded-xl border border-stone-200 bg-white p-5">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-stone-700">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          defaultValue={estado.valores.nombre}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="puntuacion" className="block text-sm font-medium text-stone-700">
          Puntuación
        </label>
        <select
          id="puntuacion"
          name="puntuacion"
          defaultValue={estado.valores.puntuacion || '5'}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'estrella' : 'estrellas'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="comentario" className="block text-sm font-medium text-stone-700">
          Comentario
        </label>
        <textarea
          id="comentario"
          name="comentario"
          rows={3}
          required
          defaultValue={estado.valores.comentario}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
        />
      </div>

      <BotonEnviar />

      {estado.mensaje !== '' && (
        <p
          role="status"
          className={estado.ok ? 'text-sm font-medium text-emerald-700' : 'text-sm font-medium text-red-700'}
        >
          {estado.mensaje}
        </p>
      )}
    </form>
  );
}