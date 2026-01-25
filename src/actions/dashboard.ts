"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { guests, tasks, expenses, events, weddings } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth-helpers";

export const getDashboardStats = async (weddingId: string) => {
    await isAuthenticated();

    // 1. Guest Stats
    const allGuests = await db
        .select()
        .from(guests)
        .where(eq(guests.weddingId, weddingId));

    const totalGuestsCount = allGuests.reduce((acc, guest) => acc + 1 + (guest.plusOnes || 0), 0);

    let acceptedPeople = 0;
    let declinedPeople = 0;
    let pendingPeople = 0;

    allGuests.forEach(guest => {
        const totalForGuest = 1 + (guest.plusOnes || 0);
        // If they have any "accepted" RSVP, we count them as accepted
        if (guest.events.some(e => e.rsvp === 'accepted')) {
            acceptedPeople += totalForGuest;
        } else if (guest.events.every(e => e.rsvp === 'declined')) {
            // Only if they declined EVERY event they are invited to
            declinedPeople += totalForGuest;
        } else {
            pendingPeople += totalForGuest;
        }
    });

    // 2. Budget Stats
    const wedding = await db
        .select({ totalBudget: weddings.totalBudget })
        .from(weddings)
        .where(eq(weddings.id, weddingId))
        .limit(1);

    const totalBudget = Number(wedding[0]?.totalBudget) || 0;

    const allExpenses = await db
        .select({ amount: expenses.amount })
        .from(expenses)
        .where(eq(expenses.weddingId, weddingId));

    const spentBudget = allExpenses.reduce((acc, exp) => acc + Number(exp.amount), 0);

    // 3. Task Stats
    const allTasks = await db
        .select()
        .from(tasks)
        .where(eq(tasks.weddingId, weddingId));

    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.completed).length;
    const now = new Date();
    const overdueTasks = allTasks.filter(t => !t.completed && new Date(t.dueDate) < now).length;

    // 4. Event Stats
    const allEvents = await db
        .select()
        .from(events)
        .where(eq(events.weddingId, weddingId))
        .orderBy(events.date);

    const totalEvents = allEvents.length;
    const nextEvent = allEvents.find(e => new Date(e.date) >= now);

    return {
        guests: {
            total: totalGuestsCount,
            accepted: acceptedPeople,
            pending: pendingPeople,
            declined: declinedPeople,
        },
        budget: {
            total: totalBudget,
            spent: spentBudget,
            remaining: totalBudget - spentBudget,
            percentUsed: totalBudget > 0 ? Math.round((spentBudget / totalBudget) * 100) : 0,
        },
        tasks: {
            total: totalTasks,
            completed: completedTasks,
            overdue: overdueTasks,
            percentDone: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        },
        events: {
            total: totalEvents,
            nextEvent: nextEvent ? {
                name: nextEvent.name,
                date: nextEvent.date,
            } : null,
        }
    };
};
