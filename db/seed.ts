import { db } from './index';
import { clientes, pedidos, planes } from './schema';

// Se borra en orden inverso a las dependencias, para poder repetir el seed sin errores.
db.delete(pedidos).run();
db.delete(clientes).run();
db.delete(planes).run();

const [pequeno, habitual, familiar] = db
  .insert(planes)
  .values([
    { nombre: 'Pequeño', gramosAlMes: 250, precioMensual: 11.9 },
    { nombre: 'Habitual', gramosAlMes: 500, precioMensual: 22 },
    { nombre: 'Familiar', gramosAlMes: 1000, precioMensual: 40 },
  ])
  .returning()
  .all();

const [lucia, mateo, carmen] = db
  .insert(clientes)
  .values([
    { nombre: 'Lucía Fernández', email: 'lucia@example.com', planId: habitual.id },
    { nombre: 'Mateo Ruiz', email: 'mateo@example.com', planId: pequeno.id },
    { nombre: 'Carmen Soto', email: 'carmen@example.com', planId: familiar.id },
  ])
  .returning()
  .all();

db.insert(pedidos)
  .values([
    { clienteId: lucia.id, mes: '2026-10', cafe: 'Amanecer', estado: 'entregado' },
    { clienteId: mateo.id, mes: '2026-10', cafe: 'Tierra Alta', estado: 'entregado' },
    { clienteId: carmen.id, mes: '2026-10', cafe: 'Fondo de Casa', estado: 'entregado' },
    { clienteId: lucia.id, mes: '2026-11', cafe: 'Ceniza Volcánica', estado: 'enviado' },
    { clienteId: mateo.id, mes: '2026-11', cafe: 'Amanecer', estado: 'tostando' },
    { clienteId: carmen.id, mes: '2026-11', cafe: 'Tierra Alta', estado: 'pendiente' },
  ])
  .run();

console.log('Seed completado: 3 planes, 3 clientes y 6 pedidos.');