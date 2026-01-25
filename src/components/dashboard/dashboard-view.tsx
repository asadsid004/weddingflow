"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/actions/dashboard";
import { QuickStats } from "./quick-stats";
import { DashboardAlerts } from "./dashboard-alerts";
import { UpcomingOverview } from "./upcoming-overview";
import { RecentExpensesList } from "./recent-expenses-list";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardViewProps {
  weddingId: string;
}

export const DashboardView = ({ weddingId }: DashboardViewProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats", weddingId],
    queryFn: () => getDashboardStats(weddingId),
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 pb-12">
      <DashboardAlerts
        alerts={
          data.alerts as {
            type: "warning" | "destructive" | "info";
            message: string;
            category: "budget" | "tasks";
          }[]
        }
      />

      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Key Metrics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <QuickStats weddingId={weddingId} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Upcoming Actions</h2>
        <UpcomingOverview
          weddingId={weddingId}
          upcomingEvents={data.events.upcoming}
          priorityTasks={data.tasks.priorityTasks}
        />
      </div>

      <div className="max-w-2xl space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
        <RecentExpensesList
          weddingId={weddingId}
          expenses={data.recentExpenses}
        />
      </div>
    </div>
  );
};
