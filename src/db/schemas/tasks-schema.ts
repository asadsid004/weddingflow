import { pgTable, text, timestamp, pgEnum, boolean, date } from "drizzle-orm/pg-core";
import { weddings } from "./weddings-schema";
import { events } from "./events-schema";

export const taskPriorityEnum = pgEnum("task_priority", [
    "low",
    "medium",
    "high",
]);

export const tasks = pgTable("tasks", {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),

    title: text("title").notNull(),

    completed: boolean("completed").notNull().default(false),
    priority: taskPriorityEnum("priority").notNull().default("medium"),

    dueDate: date('due_date').notNull(),

    weddingId: text("wedding_id")
        .notNull()
        .references(() => weddings.id, { onDelete: "cascade" }),
    eventId: text("event_id").references(() => events.id, { onDelete: "set null" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});