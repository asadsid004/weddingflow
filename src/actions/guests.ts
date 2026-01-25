"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { guests } from "@/db/schema";
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
    events?: {
        eventId: string;
        rsvp: "pending" | "accepted" | "declined";
    }[];
}) => {
    await isAuthenticated();

    const { phoneNumber, ...rest } = updates;
    const formattedUpdates = {
        ...rest,
        ...(phoneNumber !== undefined && { phoneNumber: phoneNumber.toString() }),
    };

    await db.update(guests).set(formattedUpdates).where(eq(guests.id, guestId));

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

export const updateEventGuestRsvp = async (
    guestId: string,
    eventId: string,
    rsvp: 'pending' | 'accepted' | 'declined'
) => {
    await isAuthenticated();

    const [guest] = await db
        .select({ events: guests.events })
        .from(guests)
        .where(eq(guests.id, guestId))
        .limit(1);

    if (!guest) throw new Error("Guest not found");

    const updatedEvents = guest.events.map(e =>
        e.eventId === eventId ? { ...e, rsvp } : e
    );

    await db
        .update(guests)
        .set({ events: updatedEvents })
        .where(eq(guests.id, guestId));

    return { success: true };
};