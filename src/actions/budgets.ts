"use server";

import { eq, and } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { expenses, events, weddings, ExpenseCategory } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth-helpers";

export const createExpense = async ({
    weddingId,
    description,
    amount,
    eventId,
    date,
    category,
}: {
    weddingId: string;
    description: string;
    amount: number;
    eventId: string;
    date: string;
    category: ExpenseCategory;
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

    const [newExpense] = await db
        .insert(expenses)
        .values({
            weddingId,
            eventId,
            description,
            amount: amount.toFixed(2),
            date,
            category,
        })
        .returning();

    if (!newExpense) {
        throw new Error("Failed to create expense");
    }

    return newExpense;
};

export const getExpenses = async (weddingId: string) => {
    const session = await isAuthenticated();

    if (!session) {
        throw new Error("Unauthorized");
    }
    const allExpenses = await db.query.expenses.findMany({
        where: eq(expenses.weddingId, weddingId),
    });

    return allExpenses;
};

export const updateExpense = async ({
    expenseId,
    description,
    amount,
    eventId,
    date,
    category,
}: {
    expenseId: string;
    description: string;
    amount: number;
    eventId: string;
    date: string;
    category: ExpenseCategory;
}) => {
    const session = await isAuthenticated();

    if (!session) {
        throw new Error("Unauthorized");
    }
    const expense = await db.query.expenses.findFirst({
        where: eq(expenses.id, expenseId),
    });

    if (!expense) {
        throw new Error("Expense not found or unauthorized");
    }

    const updatedExpense = await db
        .update(expenses)
        .set({
            description,
            amount: amount.toFixed(2),
            eventId,
            date,
            category,
        })
        .where(eq(expenses.id, expenseId))
        .returning();

    if (!updatedExpense) {
        throw new Error("Failed to update expense");
    }

    return updatedExpense;
};

export const deleteExpense = async (expenseId: string) => {
    await isAuthenticated();

    const expense = await db.query.expenses.findFirst({
        where: eq(expenses.id, expenseId),
    });

    if (!expense) {
        throw new Error("Expense not found or unauthorized");
    }

    await db.delete(expenses).where(eq(expenses.id, expenseId));
};

export const getExpensesByEventId = async (eventId: string) => {
    await isAuthenticated();

    const allExpenses = await db.query.expenses.findMany({
        where: eq(expenses.eventId, eventId),
    });

    return allExpenses;
};