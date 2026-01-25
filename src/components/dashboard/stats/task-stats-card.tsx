"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Task02Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { Progress } from "@/components/ui/progress";

interface TaskStatsProps {
  total: number;
  completed: number;
  percentDone: number;
  overdue: number;
}

export const TaskStatsCard = ({
  total,
  completed,
  percentDone,
  overdue,
}: TaskStatsProps) => {
  const pending = total - completed;

  return (
    <Card className="overflow-hidden">
      <CardContent className="px-6">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <span className="text-lg font-semibold">Task Progress</span>
            <p className="text-muted-foreground mb-1 text-sm font-medium">
              Tasks Completed
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold tracking-tight">
                {completed}/{total}
              </h3>
              <span
                className={`text-sm font-semibold ${
                  overdue > 0
                    ? "text-destructive"
                    : "text-purple-600 dark:text-purple-400"
                }`}
              >
                {overdue > 0 ? `${overdue} Overdue` : "All Current"}
              </span>
            </div>
          </div>
          <div className="ml-4 shrink-0">
            <div className="rounded-xl bg-purple-50 p-3 dark:bg-purple-950/30">
              <HugeiconsIcon
                icon={Task02Icon}
                className="size-6 text-purple-600 dark:text-purple-400"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Progress value={percentDone} className="[&>div]:bg-purple-600" />
        </div>

        <div className="space-y-2">
          <div className="bg-muted/70 flex items-center justify-between rounded-md p-2">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                className="size-4 text-purple-600 dark:text-purple-400"
                strokeWidth={2.5}
              />
              <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Progress
              </span>
            </div>
            <p className="text-xl font-bold">{percentDone}%</p>
          </div>

          <div className="bg-muted/70 flex items-center justify-between rounded-md p-2">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={Clock01Icon}
                className="size-4 text-amber-600 dark:text-amber-400"
                strokeWidth={2.5}
              />
              <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Pending
              </span>
            </div>
            <p className="text-xl font-bold">{pending}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
