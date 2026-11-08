'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { altaSocio, type EstadoAlta } from './actions';

interface PlanOpcion {
  id: number;
  nombre: string;
  gramosAlMes: number;
  precioMensual: number;
}

interface FormularioAltaProps {
  planes: PlanOpcion[];
}

const estadoInicial: EstadoAlta = {
  ok: false,
  mensaje: '',
  valores: { nombre: '', email: '', planId: '' },
};

function aEuros(valor: number): string {
  return valor.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

function BotonEnviar() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-stone-900 px-5 py-3 font-medium text-stone-50 hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Enviando…' : 'Apuntarme al club'}
    </button>
  );
}

export default function FormularioAlta({ planes }: FormularioAltaProps) {
  const [estado, accion] = useActionState(altaSocio, estadoInicial);

  return (
    <form action={accion} className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 sm:p-6">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-stone-700">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          autoComplete="name"
          defaultValue={estado.valores.nombre}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-stone-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={estado.valores.email}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="planId" className="block text-sm font-medium text-stone-700">
          Plan
        </label>
        <select
          id="planId"
          name="planId"
          required
          defaultValue={estado.valores.planId}
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2"
        >
          <option value="" disabled>
            Elige un plan
          </option>
          {planes.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.nombre} · {plan.gramosAlMes} g al mes · {aEuros(plan.precioMensual)}
            </option>
          ))}
        </select>
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