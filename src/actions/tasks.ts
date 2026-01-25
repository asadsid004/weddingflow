"use server";

import { db } from "@/db/drizzle";
import { events, weddings } from "@/db/schema";
import { tasks } from "@/db/schemas/tasks-schema";
import { isAuthenticated } from "@/lib/auth-helpers";
import { and, eq } from "drizzle-orm";

export const createTask = async ({
    weddingId,
    title,
    priority,
    eventId,
    dueDate,
}: {
    weddingId: string;
    title: string;
    priority: string;
    eventId: string;
    dueDate: string;
}) => {
    const session = await isAuthenticated();

    if (!session) {
        throw new Error("Unauthorized");
    }
    const wedding = await db.query.weddings.findFirst({
        where: and(
            eq(weddings.id, weddingId),
            eq(weddings.userId, session.user.id)
        ),
    });

    if (!wedding) {
        throw new Error("Wedding not found or unauthorized");
    }

    const event = await db.query.events.findFirst({
        where: and(
            eq(events.id, eventId),
            eq(events.weddingId, weddingId)
        ),
    });

    if (!event) {
        throw new Error("Event not found or does not belong to this wedding");
    }

    const [newTask] = await db.insert(tasks).values({
        title,
        priority: priority as "high" | "medium" | "low",
        eventId,
        dueDate,
        weddingId,
    }).returning();

    if (!newTask) {
        throw new Error("Failed to create task");
    }

    return newTask;
}

export const getTasks = async (weddingId: string) => {
    await isAuthenticated();

    const allTasks = await db.query.tasks.findMany({
        where: eq(tasks.weddingId, weddingId),
    });

    return allTasks;
}