import { pgTable, text, decimal, date, timestamp, pgEnum } from "drizzle-orm/pg-core";

import { weddings } from "./weddings-schema";
import { events } from "./events-schema";

export const expenseCategoriesEnum = pgEnum('expense_categories', [
    'Venue & Rentals',
    'Food & Beverage',
    'Photography & Video',
    'Music & Entertainment',
    'Decor & Flowers',
    'Attire & Beauty',
    'Stationery & Favors',
    'Transportation',
    'Planning & Officiant',
    'Cake & Desserts',
    'Rings',
    'Miscellaneous',
]);

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
    category: expenseCategoriesEnum('category').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const expenseCategories = expenseCategoriesEnum.enumValues;
export type ExpenseCategory = (typeof expenseCategories)[number];