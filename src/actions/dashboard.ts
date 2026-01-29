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

    // Normalize "today" to start of day for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTasks = allTasks.filter(t => {
        const d = new Date(t.dueDate);
        d.setHours(0, 0, 0, 0);
        return !t.completed && d < today;
    }).length;

    const dueTodayTasks = allTasks.filter(t => {
        const d = new Date(t.dueDate);
        d.setHours(0, 0, 0, 0);
        return !t.completed && d.getTime() === today.getTime();
    }).length;

    // 4. Event Stats
    const allEvents = await db
        .select()
        .from(events)
        .where(eq(events.weddingId, weddingId))
        .orderBy(events.date);

    const totalEvents = allEvents.length;
    const now = new Date();
    const upcomingEvents = allEvents
        .filter(e => new Date(e.date) >= now)
        .slice(0, 3);
    const nextEvent = upcomingEvents[0] || null;

    // 5. Recent Expenses
    const recentExpenses = await db
        .select()
        .from(expenses)
        .where(eq(expenses.weddingId, weddingId))
        .orderBy(expenses.createdAt)
        .limit(5);

    // 6. Generate Smart Alerts
    const alerts = [];

    if (totalBudget > 0 && spentBudget > totalBudget) {
        alerts.push({
            type: 'warning',
            message: `You are ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(spentBudget - totalBudget)} L over budget.`,
            category: 'budget'
        });
    }

    if (overdueTasks > 0) {
        alerts.push({
            type: 'destructive',
            message: `You have ${overdueTasks} overdue tasks that need attention.`,
            category: 'tasks'
        });
    }

    if (dueTodayTasks > 0) {
        alerts.push({
            type: 'warning',
            message: `You have ${dueTodayTasks} task${dueTodayTasks > 1 ? 's' : ''} due today.`,
            category: 'tasks'
        });
    }

    const pendingRSVPs = allGuests.filter(g => g.events.some(e => e.rsvp === 'pending')).length;

    return {
        guests: {
            total: totalGuestsCount,
            accepted: acceptedPeople,
            pending: pendingPeople,
            declined: declinedPeople,
            pendingRSVPsCount: pendingRSVPs,
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
            dueToday: dueTodayTasks,
            percentDone: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
            priorityTasks: allTasks
                .filter(t => !t.completed)
                .sort((a, b) => {
                    // Priority sorting: Overdue first, then by date
                    const aDate = new Date(a.dueDate);
                    aDate.setHours(0, 0, 0, 0);
                    const bDate = new Date(b.dueDate);
                    bDate.setHours(0, 0, 0, 0);

                    const aOverdue = aDate < today;
                    const bOverdue = bDate < today;

                    if (aOverdue && !bOverdue) return -1;
                    if (!aOverdue && bOverdue) return 1;
                    return aDate.getTime() - bDate.getTime();
                })
                .slice(0, 5),
        },
        events: {
            total: totalEvents,
            upcoming: upcomingEvents,
            nextEvent: nextEvent ? {
                name: nextEvent.name,
                date: nextEvent.date,
            } : null,
        },
        recentExpenses: recentExpenses.map(e => ({
            id: e.id,
            description: e.description,
            amount: Number(e.amount),
            date: e.date,
        })),
        alerts,
    };
};
