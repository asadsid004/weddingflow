import { pgTable, text, date, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { weddings } from "./weddings-schema";
import { user } from "./auth-schema";

export const events = pgTable('events', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),

    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),

    weddingId: text('wedding_id')
        .notNull()
        .references(() => weddings.id, { onDelete: "cascade" }),

    name: text('name').notNull(),
    date: date('date').notNull(),

    startTime: text('start_time'),
    endTime: text('end_time'),

    venue: text('venue'),
    venueAddress: text('venue_address'),

    estimatedGuests: integer('estimated_guests'),

    allocatedBudget: decimal('allocated_budget', { precision: 10, scale: 2 }),
    description: text('description'),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});
