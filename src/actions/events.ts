"use server";

import { db } from "@/db/drizzle";
import { events } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth-helpers";

export const createEvent = async (
    weddingId: string,
    event: {
        name: string;
        date: string;
        startTime: string;
        endTime: string;
        estimatedGuests: number;
    }
) => {
    const session = await isAuthenticated();

    const result = await db.insert(events).values({
        weddingId,
        userId: session.user.id,
        name: event.name,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        estimatedGuests: event.estimatedGuests,
    }).returning();

    if (!result[0]) {
        throw new Error("Failed to create event");
    }

    return result[0].id;
}