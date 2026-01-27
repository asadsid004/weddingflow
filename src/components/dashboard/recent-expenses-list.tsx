"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Money01Icon,
  Wallet02Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RecentExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

interface RecentExpensesListProps {
  weddingId: string;
  expenses: RecentExpense[];
}

export const RecentExpensesList = ({
  weddingId,
  expenses,
}: RecentExpensesListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden rounded-md">
      <CardContent className="px-6">
        <div className="mb-6 flex items-start justify-between">
          <div className="mr-4 shrink-0">
            <div className="bg-muted/80 rounded-md p-3">
              <HugeiconsIcon
                icon={Wallet02Icon}
                className="size-6"
                strokeWidth={2}
              />
            </div>
          </div>
          <div className="flex-1">
            <span className="text-base font-semibold">Recent Expenses</span>
            <p className="text-muted-foreground text-sm font-medium">
              Latest transactions
            </p>
          </div>
          {expenses.length > 0 && (
            <div className="mt-4">
              <Button variant="ghost" className="w-full" asChild>
                <Link
                  href={`/weddings/${weddingId}/budget`}
                  className="flex items-center justify-center gap-2"
                >
                  View All
                  <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    className="size-4"
                    strokeWidth={2}
                  />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-8 text-center">
            <div className="bg-muted mb-3 rounded-full p-3">
              <HugeiconsIcon
                icon={Money01Icon}
                className="text-muted-foreground size-6"
              />
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              No expenses logged yet
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Start tracking your wedding expenses
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {expenses.slice(0, 5).map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="bg-muted/80 shrink-0 rounded-md p-2">
                    <HugeiconsIcon
                      icon={Money01Icon}
                      className="size-4"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {expense.description}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {formatDate(expense.date)}
                    </p>
                  </div>
                </div>
                <div className="ml-3 shrink-0">
                  <p className="text-destructive text-sm font-bold">
                    {formatCurrency(expense.amount)} L
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
