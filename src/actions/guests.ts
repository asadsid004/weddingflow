"use server";

import { eq, and } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { guests, eventGuests } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth-helpers";

export const getWeddingGuests = async (weddingId: string) => {
    await isAuthenticated();

    return await db.select().from(guests).where(eq(guests.weddingId, weddingId));
};

export const createGuest = async (weddingId: string, guest: {
    name: string;
    email: string;
    phoneNumber: string;
    plusOnes?: number;
}) => {
    const session = await isAuthenticated();

    const result = await db.insert(guests).values({
        weddingId,
        name: guest.name,
        email: guest.email,
        phoneNumber: guest.phoneNumber,
        plusOnes: guest.plusOnes ?? 0,
    }).returning();

    if (!result[0]) {
        throw new Error("Failed to create guest");
    }

    return result[0].id;
};

export const updateGuest = async (guestId: string, updates: {
    name?: string;
    email?: string;
    phoneNumber?: string;
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

export const toggleEventGuestAttendance = async (eventId: string, guestId: string) => {
    await isAuthenticated();

    const [record] = await db
        .select({ attended: eventGuests.attended })
        .from(eventGuests)
        .where(and(
            eq(eventGuests.eventId, eventId),
            eq(eventGuests.guestId, guestId)
        ))
        .limit(1);

    if (!record) {
        throw new Error("Event guest not found");
    }

    await db
        .update(eventGuests)
        .set({ attended: !record.attended })
        .where(and(
            eq(eventGuests.eventId, eventId),
            eq(eventGuests.guestId, guestId)
        ));

    return { attended: !record.attended };
};