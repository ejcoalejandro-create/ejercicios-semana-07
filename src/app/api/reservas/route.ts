function error(mensaje: string) {
  return Response.json({ error: mensaje }, { status: 400 });
}

export async function POST(request: Request) {
  // 1) El cuerpo tiene que ser un JSON válido.
  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return error('El cuerpo de la petición debe ser un JSON válido.');
  }

  if (typeof cuerpo !== 'object' || cuerpo === null) {
    return error('El cuerpo debe ser un objeto con "nombre" y "personas".');
  }

  const { nombre, personas } = cuerpo as Record<string, unknown>;

  // 2) Validación de los campos.
  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return error('Falta el campo "nombre" (texto no vacío).');
  }

  if (typeof personas !== 'number' || !Number.isInteger(personas) || personas < 1 || personas > 6) {
    return error('El campo "personas" debe ser un número entero entre 1 y 6.');
  }

  // 3) Todo correcto: 201 Created con la reserva recibida (todavía no se guarda).
  return Response.json({ nombre: nombre.trim(), personas }, { status: 201 });
}