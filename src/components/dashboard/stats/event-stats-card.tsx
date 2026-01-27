"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar02Icon } from "@hugeicons/core-free-icons";
import { Progress } from "@/components/ui/progress";

interface EventStatsProps {
  total: number;
  nextEvent: {
    name: string;
    date: string;
  } | null;
}

export const EventStatsCard = ({ total, nextEvent }: EventStatsProps) => {
  const getDaysUntil = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysToNext = nextEvent ? getDaysUntil(nextEvent.date) : null;

  return (
    <Card className="overflow-hidden rounded-md">
      <CardContent className="px-6">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <span className="text-lg font-semibold">Events Schedule</span>
            <p className="text-muted-foreground mb-1 text-sm font-medium">
              {daysToNext !== null ? "Days to Next Event" : "Total Events"}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold tracking-tight">
                {daysToNext !== null
                  ? daysToNext > 0
                    ? daysToNext
                    : "Today"
                  : total}
              </h3>
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                {total} Planned
              </span>
            </div>
          </div>
          <div className="ml-4 shrink-0">
            <div className="rounded-md bg-orange-100 p-3 dark:bg-orange-900">
              <HugeiconsIcon
                icon={Calendar02Icon}
                className="size-6 text-orange-600 dark:text-orange-400"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Progress
            value={Math.min(total * 15, 100)}
            className="[&>div]:bg-orange-500"
          />
        </div>

        <div className="space-y-2">
          {nextEvent ? (
            <div className="bg-muted/70 rounded-md p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <HugeiconsIcon
                  icon={Calendar02Icon}
                  className="size-4 text-orange-600 dark:text-orange-400"
                  strokeWidth={2.5}
                />
                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Next Event
                </span>
              </div>
              <p className="mb-1 truncate text-sm font-semibold">
                {nextEvent.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {new Date(nextEvent.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          ) : (
            <div className="bg-muted/70 rounded-md p-3 text-center">
              <p className="text-muted-foreground text-sm">
                No upcoming events
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
