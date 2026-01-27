"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/actions/dashboard";
import { GuestStatsCard } from "./stats/guest-stats-card";
import { BudgetStatsCard } from "./stats/budget-stats-card";
import { TaskStatsCard } from "./stats/task-stats-card";
import { EventStatsCard } from "./stats/event-stats-card";
import { Skeleton } from "@/components/ui/skeleton";

interface QuickStatsProps {
  weddingId: string;
}

export const QuickStats = ({ weddingId }: QuickStatsProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats", weddingId],
    queryFn: () => getDashboardStats(weddingId),
  });

  if (isLoading) {
    return (
      <>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-md" />
        ))}
      </>
    );
  }

  if (!data) return null;

  return (
    <>
      <GuestStatsCard
        total={data.guests.total}
        accepted={data.guests.accepted}
        pending={data.guests.pending}
      />
      <BudgetStatsCard
        spent={data.budget.spent}
        percentUsed={data.budget.percentUsed}
        remaining={data.budget.remaining}
      />
      <TaskStatsCard
        total={data.tasks.total}
        completed={data.tasks.completed}
        percentDone={data.tasks.percentDone}
        overdue={data.tasks.overdue}
      />
      <EventStatsCard
        total={data.events.total}
        nextEvent={data.events.nextEvent}
      />
    </>
  );
};
