"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Money01Icon, Wallet02Icon } from "@hugeicons/core-free-icons";
import { Progress } from "@/components/ui/progress";

interface BudgetStatsProps {
  spent: number;
  percentUsed: number;
  remaining: number;
}

export const BudgetStatsCard = ({
  spent,
  percentUsed,
  remaining,
}: BudgetStatsProps) => {
  const isOverBudget = remaining < 0;

  const formatFullCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  return (
    <Card className="overflow-hidden rounded-md">
      <CardContent className="px-6">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <span className="text-lg font-semibold">Budget Overview</span>
            <p className="text-muted-foreground mb-1 text-sm font-medium">
              Budget Consumed
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold tracking-tight">
                {percentUsed}%
              </h3>
              <span
                className={`text-sm font-semibold ${
                  isOverBudget
                    ? "text-destructive"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {isOverBudget ? "Over Budget" : "On Track"}
              </span>
            </div>
          </div>
          <div className="ml-4 shrink-0">
            <div className="rounded-md bg-emerald-100 p-3 dark:bg-emerald-900">
              <HugeiconsIcon
                icon={Money01Icon}
                className="size-6 text-emerald-600 dark:text-emerald-400"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Progress
            value={Math.min(percentUsed, 100)}
            className={
              isOverBudget ? "[&>div]:bg-destructive" : "[&>div]:bg-emerald-500"
            }
          />
        </div>

        <div className="space-y-2">
          <div className="bg-muted/70 flex items-center justify-between rounded-md p-2">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={Wallet02Icon}
                className="size-4 text-emerald-600 dark:text-emerald-400"
                strokeWidth={2.5}
              />
              <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Spent
              </span>
            </div>
            <p className="text-xl font-bold">{formatFullCurrency(spent)} L</p>
          </div>

          <div className="bg-muted/70 flex items-center justify-between rounded-md p-2">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={Money01Icon}
                className={`size-4 ${
                  isOverBudget
                    ? "text-destructive"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
                strokeWidth={2.5}
              />
              <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Remaining
              </span>
            </div>
            <p
              className={`text-xl font-bold ${
                isOverBudget ? "text-destructive" : ""
              }`}
            >
              {formatFullCurrency(remaining)} L
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
