import {
    integer,
    pgTable,
    text,
    timestamp,
    jsonb,
} from "drizzle-orm/pg-core";
import { weddings } from "./weddings-schema";

export const guests = pgTable("guests", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),

    weddingId: text("wedding_id")
        .notNull()
        .references(() => weddings.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    email: text("email").notNull(),
    phoneNumber: text("phone_number").notNull(),

    plusOnes: integer("plus_ones").default(0).notNull(),

    /**
     * [
     *   { eventId: string, rsvp: 'pending' | 'accepted' | 'declined' }
     * ]
     */
    events: jsonb("events")
        .$type<
            {
                eventId: string;
                rsvp: "pending" | "accepted" | "declined";
            }[]
        >()
        .default([])
        .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});
