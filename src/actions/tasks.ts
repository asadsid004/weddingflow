"use server";

import { Task } from "@/components/tasks/task-columns";
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

export const updateTask = async (taskId: string, data: Partial<Task>) => {
    await isAuthenticated();

    const [updatedTask] = await db.update(tasks).set(data).where(eq(tasks.id, taskId)).returning();

    if (!updatedTask) {
        throw new Error("Failed to update task");
    }

    return updatedTask;
}

export const deleteTask = async (taskId: string) => {
    await isAuthenticated();

    const task = await db.query.tasks.findFirst({
        where: eq(tasks.id, taskId),
    });

    if (!task) {
        throw new Error("Task not found or unauthorized");
    }

    await db.delete(tasks).where(eq(tasks.id, taskId));
};