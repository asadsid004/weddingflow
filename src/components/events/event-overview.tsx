"use client";
import {
  AlarmClockIcon,
  Calendar02Icon,
  ChartColumnIcon,
  Money01Icon,
  WalletDone01Icon,
  WalletRemove01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card, CardContent } from "../ui/card";
import { EventDeleteButton } from "./event-delete-button";
import { useQuery } from "@tanstack/react-query";
import { getExpensesByEventId } from "@/actions/budgets";
import { GuestOverviewCard } from "../guests/guest-overview-card";

export const EventOverviewCard = ({
  event,
}: {
  event: {
    id: string;
    weddingId: string;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    allocatedBudget: number;
  };
}) => {
  const daysRemaining = Math.ceil(
    (new Date(event.date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const { data: expenses } = useQuery({
    queryKey: ["expenses", event.weddingId, event.id],
    queryFn: () => getExpensesByEventId(event.id),
  });

  // Calculate budget metrics
  const allocatedBudget = event.allocatedBudget || 0;
  const spentBudget = expenses
    ? expenses
        .filter((expense) => expense.eventId === event.id)
        .reduce((sum, expense) => Number(expense.amount) + sum, 0)
    : 0;
  const remainingBudget = allocatedBudget - spentBudget;
  const budgetUsedPercentage =
    allocatedBudget > 0
      ? Math.round((spentBudget / allocatedBudget) * 100)
      : spentBudget > 0
        ? 100
        : 0;
  const isOverBudget = remainingBudget < 0;
  const isNearingLimit = budgetUsedPercentage >= 80 && !isOverBudget;

  const formatCurrency = (amount: number) => {
    return `₹${Math.abs(amount).toLocaleString("en-IN")} L`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-start justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">{event.name}</h1>
        <EventDeleteButton eventId={event.id} weddingId={event.weddingId} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Event Details Card */}
        <Card className="rounded-md">
          <CardContent>
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              Event Overview
            </h2>
            <div className="space-y-4">
              <Metric
                label="Days Remaining"
                icon={
                  <HugeiconsIcon
                    icon={ChartColumnIcon}
                    strokeWidth={2}
                    className="h-5 w-5"
                  />
                }
                value={daysRemaining}
                isUrgent={daysRemaining <= 7}
              />
              <Metric
                label="Event Date"
                icon={
                  <HugeiconsIcon
                    icon={Calendar02Icon}
                    strokeWidth={2}
                    className="h-5 w-5"
                  />
                }
                value={new Date(event.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              />
              <Metric
                label="Event Time"
                icon={
                  <HugeiconsIcon
                    icon={AlarmClockIcon}
                    strokeWidth={2}
                    className="h-5 w-5"
                  />
                }
                value={`${event.startTime} – ${event.endTime}`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Budget Details Card */}
        <Card className="rounded-md">
          <CardContent>
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              Budget Details
            </h2>
            <div className="space-y-4">
              <Metric
                label="Allocated Budget"
                icon={
                  <HugeiconsIcon
                    icon={Money01Icon}
                    strokeWidth={2}
                    className="h-5 w-5"
                  />
                }
                value={formatCurrency(allocatedBudget)}
              />
              <Metric
                label="Spent"
                icon={
                  <HugeiconsIcon
                    icon={WalletRemove01Icon}
                    strokeWidth={2}
                    className="h-5 w-5"
                  />
                }
                value={
                  <div className="flex items-baseline gap-2">
                    <span>{formatCurrency(spentBudget)}</span>
                    <span className="text-muted-foreground text-sm">
                      ({budgetUsedPercentage}%)
                    </span>
                  </div>
                }
                isWarning={isNearingLimit}
                isUrgent={isOverBudget}
              />
              <Metric
                label={isOverBudget ? "Over Budget" : "Remaining"}
                icon={
                  <HugeiconsIcon
                    icon={WalletDone01Icon}
                    strokeWidth={2}
                    className="h-5 w-5"
                  />
                }
                value={
                  isOverBudget
                    ? formatCurrency(remainingBudget)
                    : formatCurrency(remainingBudget)
                }
                isUrgent={isOverBudget}
                isSuccess={!isOverBudget && !isNearingLimit}
              />
            </div>

            {/* Budget Progress Bar */}
            <div className="mt-4 space-y-2">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>Budget Usage</span>
                <span>{budgetUsedPercentage}%</span>
              </div>
              <div className="bg-muted h-2 overflow-hidden rounded-full">
                <div
                  className={`h-full transition-all ${
                    isOverBudget
                      ? "bg-destructive"
                      : isNearingLimit
                        ? "bg-amber-500"
                        : "bg-primary"
                  }`}
                  style={{
                    width: `${Math.min(budgetUsedPercentage, 100)}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guest Overview Card */}
        <GuestOverviewCard weddingId={event.weddingId} eventId={event.id} />
      </div>
    </div>
  );
};

const Metric = ({
  label,
  value,
  icon,
  isUrgent,
  isWarning,
  isSuccess,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  isUrgent?: boolean;
  isWarning?: boolean;
  isSuccess?: boolean;
}) => {
  return (
    <div>
      <div className="text-muted-foreground flex items-center gap-2 text-xs tracking-wide uppercase">
        {icon}
        <span>{label}</span>
      </div>
      <div
        className={`mt-1 text-lg font-semibold ${
          isUrgent
            ? "text-destructive"
            : isWarning
              ? "text-amber-600"
              : isSuccess
                ? "text-green-600"
                : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
};
