"use client";

import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "@/actions/budgets";
import { getEvents } from "@/actions/events";
import { ExpenseTable } from "./expense-table";
import { createExpenseColumns, Expense } from "./expense-columns";
import { AddExpenseButton } from "./add-expense-button";
import { Skeleton } from "../ui/skeleton";

export const ExpensesList = ({
  weddingId,
  eventId,
}: {
  weddingId: string;
  eventId?: string;
}) => {
  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ["expenses", weddingId],
    queryFn: () => getExpenses(weddingId),
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["events", weddingId],
    queryFn: () => getEvents(weddingId),
  });

  if (expensesLoading || eventsLoading) {
    return (
      <div className="my-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-full flex-1" />
          <Skeleton className="h-10 w-auto sm:w-52" />
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  // Create a map of event IDs to event names for quick lookup
  const eventMap = new Map(events?.map((e) => [e.id, e.name]) || []);

  // Transform expenses to include event names
  const expensesWithEventNames: Expense[] =
    expenses?.map((expense) => ({
      id: expense.id,
      description: expense.description,
      amount: Number(expense.amount),
      eventId: expense.eventId || "",
      date: expense.date,
      eventName: eventMap.get(expense.eventId || "") || "Unknown Event",
      weddingId: weddingId,
      category: expense.category,
    })) || [];

  const columns = createExpenseColumns();

  return (
    <div className="my-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Expenses</h2>
          <p className="text-muted-foreground text-sm">
            Manage and track all your wedding expenses
          </p>
        </div>
        <AddExpenseButton weddingId={weddingId} initialEventId={eventId} />
      </div>

      <ExpenseTable
        columns={columns}
        data={expensesWithEventNames}
        eventId={eventId}
        events={events?.map((e) => ({ id: e.id, name: e.name }))}
      />
    </div>
  );
};
