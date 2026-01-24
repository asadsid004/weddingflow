import { decimal, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { weddings } from "./weddings-schema";

export const vendors = pgTable('vendors', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),

    name: text('name').notNull(),
    category: text('category').notNull(),
    description: text('description'),
    location: text('location').notNull(),

    priceMin: decimal('price_min', { precision: 10, scale: 2 }).notNull(),
    priceMax: decimal('price_max', { precision: 10, scale: 2 }).notNull(),

    rating: decimal('rating', { precision: 2, scale: 1 }).default('0'),

    imageUrl: text('image_url'),
    email: text('email'),
    phone: text('phone'),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const vendorBookmarks = pgTable('vendor_bookmarks', {
    weddingId: text('wedding_id')
        .notNull()
        .references(() => weddings.id, { onDelete: "cascade" }),
    vendorId: text('vendor_id')
        .notNull()
        .references(() => vendors.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
    pk: primaryKey({ columns: [t.weddingId, t.vendorId] }),
}));
