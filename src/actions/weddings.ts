"use server";

import { eq, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { user, weddings, events } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth-helpers";

export const getWeddings = async () => {
    const session = await isAuthenticated();

    return await db.select().from(weddings).where(eq(weddings.userId, session.user.id));
}

export const getWeddingById = async (weddingId: string) => {
    await isAuthenticated();

    return await db.select().from(weddings).where(eq(weddings.id, weddingId));
}

export const createWedding = async ({
    brideName,
    groomName,
    weddingDate,
    totalBudget,
}: {
    brideName: string;
    groomName: string;
    weddingDate: Date;
    totalBudget: number;
}) => {
    const session = await isAuthenticated();

    const brideFirstName = brideName.split(' ')[0];
    const groomFirstName = groomName.split(' ')[0];
    const name = `${brideFirstName.charAt(0).toUpperCase() + brideFirstName.slice(1)} & ${groomFirstName.charAt(0).toUpperCase() + groomFirstName.slice(1)}`;

    const result = await db.insert(weddings).values({
        name,
        userId: session.user.id,
        brideName,
        groomName,
        weddingDate: weddingDate.toISOString().split('T')[0],
        totalBudget: totalBudget.toFixed(2),
    }).returning();

    if (!result[0]) {
        throw new Error("Failed to create wedding");
    }

    await db.insert(events).values({
        weddingId: result[0].id,
        userId: session.user.id,
        name: "Wedding Ceremony",
        date: weddingDate.toISOString().split('T')[0],
    });

    await db
        .update(user)
        .set({
            totalWeddings: sql`${user.totalWeddings} + 1`,
        })
        .where(eq(user.id, session.user.id));

    return result[0].id;
}

export const increaseTotalBudget = async ({
    weddingId,
    totalBudget,
}: {
    weddingId: string;
    totalBudget: number;
}) => {
    await isAuthenticated();

    await db.update(weddings).set({
        totalBudget: totalBudget.toFixed(2),
    }).where(eq(weddings.id, weddingId));
}