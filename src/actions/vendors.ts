'use server'

import { db } from "@/db/drizzle";
import { vendorBookmarks } from "@/db/schemas/vendors-schema";
import { eq, and } from "drizzle-orm";

export async function getVendors() {
    return await db.query.vendors.findMany();
}

export async function getWeddingBookmarks(weddingId: string) {
    const bookmarks = await db.query.vendorBookmarks.findMany({
        where: eq(vendorBookmarks.weddingId, weddingId),
    });
    return bookmarks.map(b => b.vendorId);
}

export async function toggleBookmark(weddingId: string, vendorId: string) {
    try {
        const existing = await db.query.vendorBookmarks.findFirst({
            where: and(
                eq(vendorBookmarks.weddingId, weddingId),
                eq(vendorBookmarks.vendorId, vendorId)
            ),
        });

        if (existing) {
            await db.delete(vendorBookmarks)
                .where(and(
                    eq(vendorBookmarks.weddingId, weddingId),
                    eq(vendorBookmarks.vendorId, vendorId)
                ));
            return { bookmarked: false };
        } else {
            await db.insert(vendorBookmarks).values({
                weddingId,
                vendorId,
            });
            return { bookmarked: true };
        }
    } catch (error) {
        console.error("Error toggling bookmark:", error);
        throw new Error("Failed to toggle bookmark");
    }
}
