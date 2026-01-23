"use server";

import { db } from "@/db/drizzle";
import { events } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth-helpers";
import { eq } from "drizzle-orm";

export const createEvent = async (
    weddingId: string,
    event: {
        name: string;
        date: string;
        startTime: string;
        endTime: string;
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
    }).returning();

    if (!result[0]) {
        throw new Error("Failed to create event");
    }

    return result[0].id;
}

export const getEvents = async (weddingId: string) => {
    await isAuthenticated();

    const result = await db.query.events.findMany({
        where: (events, { eq }) => eq(events.weddingId, weddingId),
    });

    return result;
}

export async function getEventById(eventId: string) {
    const session = await isAuthenticated();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, eventId))
        .limit(1);

    if (!event) {
        throw new Error("Event not found");
    }

    return event;
}

export async function updateEvent(
    eventId: string,
    data: {
        name?: string;
        date?: string;
        startTime?: string;
        endTime?: string;
        venue?: string;
        venueAddress?: string;
        allocatedBudget?: string;
    }
) {
    const session = await isAuthenticated();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const [event] = await db
        .select({ weddingId: events.weddingId })
        .from(events)
        .where(eq(events.id, eventId))
        .limit(1);

    if (!event) {
        throw new Error("Event not found");
    }

    await db
        .update(events)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(eq(events.id, eventId));

    return { success: true };
}

export const deleteEvent = async (eventId: string) => {
    await isAuthenticated();

    const [event] = await db
        .select({ weddingId: events.weddingId })
        .from(events)
        .where(eq(events.id, eventId))
        .limit(1);

    if (!event) {
        throw new Error("Event not found");
    }

    await db
        .delete(events)
        .where(eq(events.id, eventId));

    return { success: true };
}