# Ejercicios de la semana 7 — Route Handlers, Drizzle y Server Actions

Tres ejercicios cortos con el tostadero de Tueste Norte como excusa.
Hecho con Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Drizzle ORM y SQLite (better-sqlite3).

## Cómo arrancarlo

```bash
npm install
npx drizzle-kit push        # crea las tablas cafes y valoraciones
npx tsx src/db/seed.ts      # inserta los cafés de ejemplo
npm run dev                 # http://localhost:3000
```

La base de datos vive en `data/tostadero.db` y **no se sube a Git** (`data/` está en el `.gitignore`).
Lo que se entrega es el schema y el seed, así que quien clone el repo la reconstruye con los comandos de arriba.

## Ejercicio 1 — API del tostadero

Dos Route Handlers en `src/app/api/`:

| Endpoint | Archivo | Qué hace |
|---|---|---|
| `GET /api/estado` | `estado/route.ts` | Devuelve el estado del tostadero en JSON |
| `POST /api/reservas` | `reservas/route.ts` | Valida una reserva para una cata y la devuelve |

`POST /api/reservas` recibe `{ "nombre": "...", "personas": 1-6 }` y responde:

- `201 Created` con la reserva recibida, si todo es correcto (todavía no se guarda).
- `400 Bad Request` con `{ "error": "..." }` si el cuerpo no es un JSON válido, falta `nombre`
  o `personas` no es un número entero entre 1 y 6.

### Pruebas con curl

Se usa `curl.exe` porque en PowerShell `curl` es un alias de otro comando.

**GET /api/estado (caso correcto)**

```powershell
curl.exe -i http://localhost:3000/api/estado
```

```
HTTP/1.1 200 OK
content-type: application/json

{"abierto":true,"cafesDisponibles":4,"proximaCata":"2026-11-26"}
```

**POST /api/reservas**

En PowerShell las comillas del JSON se estropean al pasarlas con `-d '...'`, y el servidor responde
con razón `400 "El cuerpo de la petición debe ser un JSON válido."`. Por eso el JSON se guarda en un
archivo y se envía con `@`:

```powershell
'{"nombre":"Ana","personas":3}' | Set-Content -Encoding ascii reserva-ok.json
'{"nombre":"Ana","personas":9}' | Set-Content -Encoding ascii reserva-mal.json
'{"personas":3}' | Set-Content -Encoding ascii reserva-sin-nombre.json
```

Caso correcto:

```powershell
curl.exe -i -X POST http://localhost:3000/api/reservas -H "Content-Type: application/json" -d "@reserva-ok.json"
```

```
HTTP/1.1 201 Created

{"nombre":"Ana","personas":3}
```

Personas fuera de rango:

```powershell
curl.exe -i -X POST http://localhost:3000/api/reservas -H "Content-Type: application/json" -d "@reserva-mal.json"
```

```
HTTP/1.1 400 Bad Request

{"error":"El campo \"personas\" debe ser un número entero entre 1 y 6."}
```

Falta el nombre:

```powershell
curl.exe -i -X POST http://localhost:3000/api/reservas -H "Content-Type: application/json" -d "@reserva-sin-nombre.json"
```

```
HTTP/1.1 400 Bad Request

{"error":"Falta el campo \"nombre\" (texto no vacío)."}
```

En Bash o macOS se puede escribir directamente:

```bash
curl -i -X POST http://localhost:3000/api/reservas -H "Content-Type: application/json" -d '{"nombre":"Ana","personas":3}'
```

## Ejercicio 2 — Drizzle sin Next.js

Solo con scripts, para ver que Drizzle no depende del framework.

- `src/db/schema.ts`: tabla `cafes` con `id` (autoincremental), `nombre`, `origen`, `precio` (decimal, `real`)
  y `tueste` (enum `claro`, `medio`, `oscuro`; el enum solo se comprueba en TypeScript, SQLite no lo hace cumplir).
- `drizzle.config.ts`: dialecto sqlite, schema `./src/db/schema.ts`, base de datos `./data/tostadero.db`.
- `src/db/seed.ts`: borra los cafés e inserta varios de orígenes distintos.
- `src/db/consultas.ts`: imprime (a) todos los cafés ordenados por precio y (b) solo los de tueste `medio`.

```bash
npx drizzle-kit push
npx tsx src/db/seed.ts
npx tsx src/db/consultas.ts
npx drizzle-kit studio      # visor de la base de datos en el navegador
```

## Ejercicio 3 — Libro de catas

Página `/catas` donde los asistentes dejan su valoración.

- La tabla `valoraciones` (`id`, `nombre`, `comentario`, `puntuacion` de 1 a 5) está en el mismo schema.
- `src/app/catas/page.tsx` es un Server Component que lee las valoraciones directamente con Drizzle.
- `src/app/catas/actions.ts` es la Server Action: valida en el servidor (campos no vacíos y puntuación
  entre 1 y 5), inserta y llama a `revalidatePath('/catas')` para que la valoración nueva aparezca sin recargar a mano.
- `src/app/catas/FormularioValoracion.tsx` es un Client Component con `useActionState` para mostrar los
  errores y `useFormStatus` para que el botón diga «Enviando…» mientras se procesa.

## Notas

- `next.config.ts` incluye `serverExternalPackages: ['better-sqlite3']`, porque es un módulo nativo que
  Next.js no debe empaquetar.
- `cacheComponents` está desactivado porque las páginas que leen la base de datos usan
  `export const dynamic = 'force-dynamic'`, incompatible con ese modo.
- En el historial hay tres commits del proyecto del club que se colaron por error en este repositorio.
  Se retiraron en commits posteriores (`Quita del repo de ejercicios los archivos del club...` y
  `Quita src/app/alta...`).