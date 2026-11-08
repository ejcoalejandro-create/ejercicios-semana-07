'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { valoraciones } from '@/db/schema';

export type EstadoFormulario = {
  ok: boolean;
  mensaje: string;
  valores: { nombre: string; comentario: string; puntuacion: string };
};

export async function guardarValoracion(
  _estadoPrevio: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const nombre = String(formData.get('nombre') ?? '').trim();
  const comentario = String(formData.get('comentario') ?? '').trim();
  const puntuacionTexto = String(formData.get('puntuacion') ?? '').trim();
  const valores = { nombre, comentario, puntuacion: puntuacionTexto };

  // Validación en el servidor: lo que llega del navegador no es de fiar.
  if (nombre === '' || comentario === '') {
    return { ok: false, mensaje: 'El nombre y el comentario no pueden estar vacíos.', valores };
  }

  if (nombre.length > 60 || comentario.length > 500) {
    return { ok: false, mensaje: 'El nombre admite 60 caracteres y el comentario 500.', valores };
  }

  const puntuacion = Number(puntuacionTexto);
  if (!Number.isInteger(puntuacion) || puntuacion < 1 || puntuacion > 5) {
    return { ok: false, mensaje: 'La puntuación debe ser un número entero entre 1 y 5.', valores };
  }

  db.insert(valoraciones).values({ nombre, comentario, puntuacion }).run();

  // Le dice a Next.js que la página /catas ha quedado desactualizada.
  revalidatePath('/catas');

  return {
    ok: true,
    mensaje: '¡Gracias por tu valoración!',
    valores: { nombre: '', comentario: '', puntuacion: '' },
  };
}