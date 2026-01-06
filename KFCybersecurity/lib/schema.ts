import { pgTable, text, timestamp, integer, varchar, pgEnum, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('UserRole', ['ADMIN', 'CLIENT']);

// Users table
export const users = pgTable('User', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  name: text('name'),
  role: userRoleEnum('role').notNull().default('CLIENT'),
  clientId: text('clientId').references(() => clients.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  emailIdx: index('User_email_idx').on(table.email),
  clientIdIdx: index('User_clientId_idx').on(table.clientId),
}));

// Clients table
export const clients = pgTable('Client', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  nameIdx: index('Client_name_idx').on(table.name),
}));

// Services table
export const services = pgTable('Service', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  vertical: varchar('vertical', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: varchar('price', { length: 255 }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  verticalIdx: index('Service_vertical_idx').on(table.vertical),
}));

// Deployments table
export const deployments = pgTable('Deployment', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  clientId: text('clientId').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  serviceId: integer('serviceId').notNull().references(() => services.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  clientIdIdx: index('Deployment_clientId_idx').on(table.clientId),
  serviceIdIdx: index('Deployment_serviceId_idx').on(table.serviceId),
  uniqueDeployment: uniqueIndex('Deployment_clientId_serviceId_key').on(table.clientId, table.serviceId),
}));

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  client: one(clients, {
    fields: [users.clientId],
    references: [clients.id],
  }),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  users: many(users),
  deployments: many(deployments),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  deployments: many(deployments),
}));

export const deploymentsRelations = relations(deployments, ({ one }) => ({
  client: one(clients, {
    fields: [deployments.clientId],
    references: [clients.id],
  }),
  service: one(services, {
    fields: [deployments.serviceId],
    references: [services.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type Deployment = typeof deployments.$inferSelect;
export type NewDeployment = typeof deployments.$inferInsert;
