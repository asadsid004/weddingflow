import { pgTable, text, decimal, date, timestamp } from "drizzle-orm/pg-core";

import { weddings } from "./weddings-schema";
import { events } from "./events-schema";

export const expenses = pgTable('expenses', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),

    weddingId: text('wedding_id')
        .notNull()
        .references(() => weddings.id, { onDelete: 'cascade' }),

    eventId: text('event_id')
        .references(() => events.id, { onDelete: 'set null' }),

    description: text('description').notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    date: date('date').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});