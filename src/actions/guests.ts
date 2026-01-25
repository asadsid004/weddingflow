"use server";

import { eq, and } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { guests, events } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth-helpers";

export const getWeddingGuests = async (weddingId: string) => {
    await isAuthenticated();

    return await db.select().from(guests).where(eq(guests.weddingId, weddingId));
};

export const createGuest = async (weddingId: string, guest: {
    name: string;
    email: string;
    phoneNumber: number;
    plusOnes: number;
    events: string[];
}) => {
    await isAuthenticated();

    const result = await db.insert(guests).values({
        weddingId,
        name: guest.name,
        email: guest.email,
        phoneNumber: guest.phoneNumber.toString(),
        plusOnes: guest.plusOnes,
        events: guest.events.map(eventId => ({
            eventId,
            rsvp: "pending" as "pending" | "accepted" | "declined",
        })),
    }).returning();

    if (!result[0]) {
        throw new Error("Failed to create guest");
    }

    return result[0].id;
};

export const updateGuest = async (guestId: string, updates: {
    name?: string;
    email?: string;
    phoneNumber?: number;
    plusOnes?: number;
}) => {
    await isAuthenticated();

    await db.update(guests).set(updates).where(eq(guests.id, guestId));

    return { success: true };
};

export const deleteGuest = async (guestId: string) => {
    await isAuthenticated();

    const [guest] = await db
        .select({ weddingId: guests.weddingId })
        .from(guests)
        .where(eq(guests.id, guestId))
        .limit(1);

    if (!guest) {
        throw new Error("Guest not found");
    }

    await db.delete(guests).where(eq(guests.id, guestId));

    return { success: true };
};

// Event-Guest join table actions
export const addGuestToEvent = async (eventId: string, guestId: string) => {
    await isAuthenticated();

    await db.insert(eventGuests).values({ eventId, guestId });

    return { success: true };
};

export const removeGuestFromEvent = async (eventId: string, guestId: string) => {
    await isAuthenticated();

    await db.delete(eventGuests).where(and(
        eq(eventGuests.eventId, eventId),
        eq(eventGuests.guestId, guestId)
    ));

    return { success: true };
};

export const getGuestsForEvent = async (eventId: string) => {
    await isAuthenticated();

    return await db
        .select({
            id: guests.id,
            name: guests.name,
            email: guests.email,
            phoneNumber: guests.phoneNumber,
            plusOnes: guests.plusOnes,
        })
        .from(eventGuests)
        .innerJoin(guests, eq(eventGuests.guestId, guests.id))
        .where(eq(eventGuests.eventId, eventId));
};

export const updateEventGuestRsvp = async (eventId: string, guestId: string, rsvpStatus: 'pending' | 'accepted' | 'declined') => {
    await isAuthenticated();

    await db
        .update(eventGuests)
        .set({ rsvpStatus })
        .where(and(
            eq(eventGuests.eventId, eventId),
            eq(eventGuests.guestId, guestId)
        ));

    return { success: true };
};

export const getGuestEvents = async (guestId: string) => {
    await isAuthenticated();

    return await db
        .select({
            id: events.id,
            name: events.name,
            date: events.date,
            rsvpStatus: eventGuests.rsvpStatus,
        })
        .from(eventGuests)
        .innerJoin(events, eq(eventGuests.eventId, events.id))
        .where(eq(eventGuests.guestId, guestId));
};