"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { Progress } from "@/components/ui/progress";

interface GuestStatsProps {
  total: number;
  accepted: number;
  pending: number;
}

export const GuestStatsCard = ({
  total,
  accepted,
  pending,
}: GuestStatsProps) => {
  const acceptedPercentage =
    total > 0 ? Math.round((accepted / total) * 100) : 0;

  return (
    <Card className="overflow-hidden rounded-md">
      <CardContent className="px-6">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <span className="text-lg font-semibold">Guest Status</span>
            <p className="text-muted-foreground mb-1 text-sm font-medium">
              Total Invited
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold tracking-tight">{total}</h3>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {acceptedPercentage}% Confirmed
              </span>
            </div>
          </div>
          <div className="ml-4 shrink-0">
            <div className="rounded-md bg-blue-100 p-3 dark:bg-blue-900">
              <HugeiconsIcon
                icon={UserGroupIcon}
                className="size-6 text-blue-600 dark:text-blue-400"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Progress value={acceptedPercentage} />
        </div>

        <div className="space-y-2">
          <div className="bg-muted/70 flex items-center justify-between rounded-md p-2">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                className="size-4 text-green-600 dark:text-green-400"
                strokeWidth={2.5}
              />
              <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Accepted
              </span>
            </div>
            <p className="text-xl font-bold">{accepted}</p>
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
