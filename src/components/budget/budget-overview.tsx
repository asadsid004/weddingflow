"use client";

import { getExpenses } from "@/actions/budgets";
import { getWeddingById } from "@/actions/weddings";
import { getEvents } from "@/actions/events";
import {
  MoneyBag02Icon,
  MoneyReceive02Icon,
  WalletDone01Icon,
  Calendar03Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { EditTotalBudgetButton } from "./edit-total-budget-button";

export const BudgetOverview = ({ weddingId }: { weddingId: string }) => {
  const { data: wedding, isLoading: weddingLoading } = useQuery({
    queryKey: ["wedding", weddingId],
    queryFn: () => getWeddingById(weddingId),
  });

  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ["expenses", weddingId],
    queryFn: () => getExpenses(weddingId),
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["events", weddingId],
    queryFn: () => getEvents(weddingId),
  });

  if (weddingLoading || expensesLoading || eventsLoading) {
    return (
      <div className="mt-4 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-32 rounded-md" />
          <Skeleton className="h-32 rounded-md" />
          <Skeleton className="h-32 rounded-md" />
        </div>
        <Skeleton className="h-12 rounded-md" />
        <Skeleton className="h-8 w-32 rounded-md" />
        <Skeleton className="h-24 rounded-md" />
        <Skeleton className="h-24 rounded-md" />
      </div>
    );
  }

  const totalBudget = Number(wedding?.[0]?.totalBudget || 0);
  const totalSpent =
    expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
  const remaining = totalBudget - totalSpent;
  const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Calculate budget by event
  const eventBudgets =
    events?.map((event) => {
      const eventExpenses =
        expenses?.filter((exp) => exp.eventId === event.id) || [];
      const spent = eventExpenses.reduce(
        (sum, exp) => sum + Number(exp.amount),
        0,
      );
      const allocated = Number(event.allocatedBudget || 0);
      const eventRemaining = allocated - spent;
      const eventPercentage = allocated > 0 ? (spent / allocated) * 100 : 0;

      return {
        id: event.id,
        name: event.name,
        allocated,
        spent,
        remaining: eventRemaining,
        percentage: eventPercentage,
        expenseCount: eventExpenses.length,
        isOverBudget: spent > allocated,
      };
    }) || [];

  // Calculate general expenses (no event)
  const generalExpenses = expenses?.filter((exp) => !exp.eventId) || [];
  const generalSpent = generalExpenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0,
  );
  const totalAllocatedToEvents = eventBudgets.reduce(
    (sum, e) => sum + e.allocated,
    0,
  );
  const generalAllocated = totalBudget - totalAllocatedToEvents;
  const generalRemaining = generalAllocated - generalSpent;
  const generalPercentage =
    generalAllocated > 0 ? (generalSpent / generalAllocated) * 100 : 0;

  const getBudgetStatus = (percentage: number) => {
    if (percentage > 100)
      return {
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-900",
        label: "Over Budget",
      };
    if (percentage > 90)
      return {
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-50 dark:bg-orange-900",
        label: "Warning",
      };
    if (percentage > 80)
      return {
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-50 dark:bg-yellow-900",
        label: "Caution",
      };
    return {
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900",
      label: "On Track",
    };
  };

  const overallStatus = getBudgetStatus(percentageUsed);

  return (
    <div className="space-y-6">
      {/* Budget Overview Cards */}
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total Budget */}
          <div className="rounded-md border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1 text-sm">
                  Total Budget
                </p>
                <p className="text-2xl font-bold">
                  ₹{totalBudget.toLocaleString()} L
                </p>
                <EditTotalBudgetButton
                  weddingId={weddingId}
                  totalBudget={totalBudget}
                />
              </div>
              <div className="rounded-md bg-blue-100 p-3 dark:bg-blue-900">
                <HugeiconsIcon
                  icon={MoneyBag02Icon}
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>

          {/* Total Spent */}
          <div className="rounded-md border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1 text-sm">
                  Total Spent
                </p>
                <p className="text-2xl font-bold">
                  ₹{totalSpent.toLocaleString()} L
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {percentageUsed.toFixed(1)}% used
                </p>
              </div>
              <div className="rounded-md bg-purple-100 p-3 dark:bg-purple-900">
                <HugeiconsIcon
                  icon={MoneyReceive02Icon}
                  className="h-6 w-6 text-purple-600 dark:text-purple-400"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>

          {/* Remaining */}
          <div className="rounded-md border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1 text-sm">
                  {remaining >= 0 ? "Remaining" : "Over Budget"}
                </p>
                <p
                  className={`text-2xl font-bold ${remaining >= 0 ? "text-green-600" : "text-destructive"}`}
                >
                  ₹{Math.abs(remaining).toLocaleString()} L
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {Math.abs(100 - percentageUsed).toFixed(1)}%{" "}
                  {remaining >= 0 ? "left" : "over"}
                </p>
              </div>
              <div
                className={`p-3 ${remaining >= 0 ? "bg-green-100 dark:bg-green-900" : "bg-destructive/10"} rounded-md`}
              >
                <HugeiconsIcon
                  icon={WalletDone01Icon}
                  className={`h-6 w-6 ${remaining >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-4 rounded-md border p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Overall Budget Usage</span>
            <span className={`text-sm font-semibold ${overallStatus.color}`}>
              {percentageUsed.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={Math.min(percentageUsed, 100)}
            className="h-2 border"
          />
        </div>
      </div>

      {/* Budget by Event */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Budget by Event</h2>
        <div className="space-y-3">
          {eventBudgets.map((event) => {
            const status = getBudgetStatus(event.percentage);
            return (
              <div
                key={event.id}
                className="rounded-md border p-4 transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <HugeiconsIcon
                        icon={Calendar03Icon}
                        className="text-muted-foreground h-4 w-4 shrink-0"
                      />
                      <h3 className="truncate font-semibold">{event.name}</h3>
                      {event.isOverBudget && (
                        <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900 dark:text-red-300">
                          Over Budget
                        </span>
                      )}
                    </div>
                    <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                      <span className="whitespace-nowrap">
                        ₹{event.allocated.toLocaleString()} L allocated
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span
                        className={`whitespace-nowrap ${event.isOverBudget ? "font-medium text-red-600 dark:text-red-400" : ""}`}
                      >
                        ₹{event.spent.toLocaleString()} L spent
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span
                        className={`whitespace-nowrap ${event.remaining < 0 ? "font-medium text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                      >
                        ₹{Math.abs(event.remaining).toLocaleString()} L{" "}
                        {event.remaining < 0 ? "over" : "left"}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0"
                    asChild
                  >
                    <Link href={`/weddings/${weddingId}/events/${event.id}`}>
                      <span className="hidden sm:inline">View</span>
                      <HugeiconsIcon
                        icon={ArrowRight02Icon}
                        className="size-4"
                        strokeWidth={2}
                      />
                    </Link>
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {event.expenseCount}{" "}
                      {event.expenseCount === 1 ? "expense" : "expenses"}
                    </span>
                    <span className={`font-semibold ${status.color}`}>
                      {event.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.min(event.percentage, 100)}
                    className="h-2"
                  />
                </div>
              </div>
            );
          })}

          {/* General Expenses */}
          {generalExpenses.length > 0 && (
            <div className="bg-muted/30 rounded-md border p-4 transition-shadow hover:shadow-md">
              <div className="mb-3 min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="font-semibold">General (No Event)</h3>
                  {generalSpent > generalAllocated && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900 dark:text-red-300">
                      Over
                    </span>
                  )}
                </div>
                <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span className="whitespace-nowrap">
                    ${generalAllocated.toLocaleString()} allocated
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span
                    className={`whitespace-nowrap ${generalSpent > generalAllocated ? "font-medium text-red-600" : ""}`}
                  >
                    ${generalSpent.toLocaleString()} spent
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span
                    className={`whitespace-nowrap ${generalRemaining < 0 ? "font-medium text-red-600" : "text-green-600"}`}
                  >
                    ${Math.abs(generalRemaining).toLocaleString()}{" "}
                    {generalRemaining < 0 ? "over" : "left"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {generalExpenses.length}{" "}
                    {generalExpenses.length === 1 ? "expense" : "expenses"}
                  </span>
                  <span
                    className={`font-semibold ${generalSpent > generalAllocated ? "text-red-600" : "text-green-600"}`}
                  >
                    {generalPercentage.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={Math.min(generalPercentage, 100)}
                  className="h-2"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
