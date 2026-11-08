import { asc, eq } from 'drizzle-orm';
import { db } from './index';
import { cafes } from './schema';

// (a) Todos los cafés, de más barato a más caro.
const porPrecio = db.select().from(cafes).orderBy(asc(cafes.precio)).all();
console.log('Cafés ordenados por precio:');
console.table(porPrecio);

// (b) Solo los de tueste medio.
const medios = db.select().from(cafes).where(eq(cafes.tueste, 'medio')).all();
console.log("Cafés de tueste 'medio':");
console.table(medios);