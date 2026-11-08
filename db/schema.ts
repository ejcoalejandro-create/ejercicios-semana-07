import { relations } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const ESTADOS_PEDIDO = ['pendiente', 'tostando', 'enviado', 'entregado'] as const;
export type EstadoPedido = (typeof ESTADOS_PEDIDO)[number];

export const planes = sqliteTable('planes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  gramosAlMes: integer('gramos_al_mes').notNull(),
  precioMensual: real('precio_mensual').notNull(),
});

export const clientes = sqliteTable('clientes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  email: text('email').notNull().unique(),
  planId: integer('plan_id')
    .notNull()
    .references(() => planes.id),
  creadoEn: text('creado_en')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const pedidos = sqliteTable('pedidos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  clienteId: integer('cliente_id')
    .notNull()
    .references(() => clientes.id),
  mes: text('mes').notNull(), // formato AAAA-MM, por ejemplo "2026-11"
  cafe: text('cafe').notNull(),
  estado: text('estado', { enum: ESTADOS_PEDIDO }).notNull().default('pendiente'),
});

export const planesRelations = relations(planes, ({ many }) => ({
  clientes: many(clientes),
}));

export const clientesRelations = relations(clientes, ({ one, many }) => ({
  plan: one(planes, { fields: [clientes.planId], references: [planes.id] }),
  pedidos: many(pedidos),
}));

export const pedidosRelations = relations(pedidos, ({ one }) => ({
  cliente: one(clientes, { fields: [pedidos.clienteId], references: [clientes.id] }),
}));

export type Plan = typeof planes.$inferSelect;
export type Cliente = typeof clientes.$inferSelect;
export type Pedido = typeof pedidos.$inferSelect;