import { date, decimal, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const weddings = pgTable('weddings', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),

    // Basic Info (Required)
    name: text('name').notNull(), // Auto-generated: "Jane & John"
    brideName: text('bride_name').notNull(),
    groomName: text('groom_name').notNull(),
    weddingDate: date('wedding_date').notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),

    // Budget
    totalBudget: decimal('total_budget', { precision: 10, scale: 2 }).default('0'),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});
