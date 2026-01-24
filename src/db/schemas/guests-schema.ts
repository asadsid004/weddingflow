
import { boolean, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { weddings } from "./weddings-schema";
import { events } from "./events-schema";

export const rsvpStatusEnum = pgEnum('rsvp_status', ['pending', 'accepted', 'declined']);

export const guests = pgTable('guests', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    weddingId: text('wedding_id')
        .notNull()
        .references(() => weddings.id, { onDelete: "cascade" }),

    name: text('name').notNull(),

    email: text('email').notNull(),
    phoneNumber: text('phone_number').notNull(),


    plusOnes: integer('plus_ones').default(0).notNull(),


    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const eventGuests = pgTable('event_guests', {
    eventId: text('event_id')
        .notNull()
        .references(() => events.id, { onDelete: "cascade" }),

    guestId: text('guest_id')
        .notNull()
        .references(() => guests.id, { onDelete: "cascade" }),

    rsvpStatus: text('rsvp_status', { enum: ['pending', 'accepted', 'declined'] }).default('pending'),
    attended: boolean('attended').default(false),
    notes: text('notes'),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

