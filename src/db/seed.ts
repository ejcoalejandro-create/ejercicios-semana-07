import { db } from './index';
import { cafes } from './schema';

// Vaciamos la tabla para poder ejecutar el script más de una vez sin duplicar datos.
db.delete(cafes).run();

db.insert(cafes)
  .values([
    { nombre: 'Amanecer', origen: 'Etiopía — Yirgacheffe', precio: 12.5, tueste: 'claro' },
    { nombre: 'Tierra Alta', origen: 'Colombia — Huila', precio: 10.9, tueste: 'medio' },
    { nombre: 'Fondo de Casa', origen: 'Brasil — Cerrado', precio: 9.5, tueste: 'medio' },
    { nombre: 'Ceniza Volcánica', origen: 'Guatemala — Antigua', precio: 11.2, tueste: 'oscuro' },
  ])
  .run();

console.log('Cafés insertados:', db.select().from(cafes).all().length);