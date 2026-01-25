"use server";

import { eq, and } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { guests, eventGuests, events, weddings } from "@/db/schema";
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

    const newGuestId = result[0].id;

    const [wedding] = await db
        .select({ weddingDate: weddings.weddingDate })
        .from(weddings)
        .where(eq(weddings.id, weddingId))
        .limit(1);

    if (wedding) {
        const [mainEvent] = await db
            .select({ id: events.id })
            .from(events)
            .where(and(
                eq(events.weddingId, weddingId),
                eq(events.date, wedding.weddingDate)
            ))
            .limit(1);

        // If main wedding event exists, add guest to it
        if (mainEvent) {
            await db.insert(eventGuests).values({
                eventId: mainEvent.id,
                guestId: newGuestId,
                rsvpStatus: 'pending', 
            });
        }
    }

    return newGuestId;
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