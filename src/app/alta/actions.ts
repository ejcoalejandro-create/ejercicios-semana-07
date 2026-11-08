'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { clientes, planes } from '@/db/schema';

export type EstadoAlta = {
  ok: boolean;
  mensaje: string;
  valores: { nombre: string; email: string; planId: string };
};

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// SQLite avisa con este código cuando se viola un índice único (como el del email).
function esEmailDuplicado(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'SQLITE_CONSTRAINT_UNIQUE'
  );
}

export async function altaSocio(
  _estadoPrevio: EstadoAlta,
  formData: FormData,
): Promise<EstadoAlta> {
  const nombre = String(formData.get('nombre') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const planTexto = String(formData.get('planId') ?? '').trim();
  const valores = { nombre, email, planId: planTexto };

  const fallo = (mensaje: string): EstadoAlta => ({ ok: false, mensaje, valores });

  // 1) Validación en el servidor.
  if (nombre === '' || nombre.length > 80) {
    return fallo('Escribe tu nombre (máximo 80 caracteres).');
  }

  if (!REGEX_EMAIL.test(email) || email.length > 120) {
    return fallo('Escribe un email válido.');
  }

  const planId = Number(planTexto);
  if (!Number.isInteger(planId)) {
    return fallo('Elige un plan.');
  }

  // 2) El plan tiene que existir de verdad (el formulario se puede manipular).
  const plan = db.select().from(planes).where(eq(planes.id, planId)).get();
  if (!plan) {
    return fallo('El plan elegido no existe. Recarga la página e inténtalo de nuevo.');
  }

  // 3) Inserción. El índice único del email es el que impide el duplicado.
  try {
    db.insert(clientes).values({ nombre, email, planId }).run();
  } catch (error) {
    if (esEmailDuplicado(error)) {
      return fallo('Ya existe una suscripción con ese email. Si eres tú, no hace falta apuntarse otra vez.');
    }
    console.error('Error al dar de alta al socio:', error);
    return fallo('No hemos podido completar el alta. Inténtalo de nuevo en unos minutos.');
  }

  // 4) Las rutas que muestran datos de clientes quedan desactualizadas.
  revalidatePath('/alta');
  revalidatePath('/pedidos');

  return {
    ok: true,
    mensaje: `¡Bienvenido al club, ${nombre}! Te has apuntado al plan ${plan.nombre}.`,
    valores: { nombre: '', email: '', planId: '' },
  };
}