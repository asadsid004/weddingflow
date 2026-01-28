"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar02Icon,
  Task02Icon,
  ArrowRight02Icon,
  CheckmarkSquare02Icon,
  SquareIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "@/actions/tasks";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface DashboardEvent {
  id: string;
  name: string;
  date: string;
  venue: string | null;
}

interface DashboardTask {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

interface UpcomingOverviewProps {
  weddingId: string;
  upcomingEvents: DashboardEvent[];
  priorityTasks: DashboardTask[];
}

export const UpcomingOverview = ({
  weddingId,
  upcomingEvents,
  priorityTasks,
}: UpcomingOverviewProps) => {
  const queryClient = useQueryClient();
  const [localTasks, setLocalTasks] = useState(priorityTasks);

  useEffect(() => {
    setLocalTasks(priorityTasks);
  }, [priorityTasks]);

  const mutation = useMutation({
    mutationFn: ({
      taskId,
      completed,
    }: {
      taskId: string;
      completed: boolean;
    }) => updateTask(taskId, { completed }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["dashboard-stats", weddingId],
      });
      const previousStats = queryClient.getQueryData([
        "dashboard-stats",
        weddingId,
      ]);

      setLocalTasks((prev) =>
        prev.map((t) =>
          t.id === variables.taskId
            ? { ...t, completed: variables.completed }
            : t,
        ),
      );

      return { previousStats };
    },
    onError: (err, variables, context) => {
      if (context?.previousStats) {
        queryClient.setQueryData(
          ["dashboard-stats", weddingId],
          context.previousStats,
        );
        setLocalTasks(priorityTasks);
      }
      toast.error("Failed to update task");
    },
    onSuccess: (data, variables) => {
      if (variables.completed) {
        toast.success("Task marked as completed");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["dashboard-stats", weddingId],
      });
    },
  });

  const formatDate = (date: string, part: "MMM" | "dd" | "MMM dd") => {
    const d = new Date(date);
    if (part === "MMM")
      return d.toLocaleDateString("en-US", { month: "short" });
    if (part === "dd") return d.toLocaleDateString("en-US", { day: "2-digit" });
    if (part === "MMM dd")
      return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
    return "";
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="rounded-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-muted/80 rounded-md p-3">
              <HugeiconsIcon
                icon={Calendar02Icon}
                className="size-6"
                strokeWidth={2}
              />
            </div>
            <CardTitle className="text-base font-semibold">
              Upcoming Events
            </CardTitle>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/weddings/${weddingId}/events`}>
              View All
              <HugeiconsIcon icon={ArrowRight02Icon} className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {upcomingEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-muted/80 mb-3 rounded-md p-3">
                <HugeiconsIcon
                  icon={Calendar02Icon}
                  className="size-6"
                  strokeWidth={2}
                />
              </div>
              <p className="text-muted-foreground text-sm">
                No upcoming events scheduled
              </p>
            </div>
          ) : (
            upcomingEvents.map((event) => (
              <Link
                key={event.id}
                href={`/weddings/${weddingId}/events/${event.id}`}
                className="group hover:bg-muted/50 hover:border-primary/50 flex items-center justify-between rounded-md border p-3 transition-all"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="bg-card flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-md border">
                    <span className="text-muted-foreground text-[10px] font-medium uppercase">
                      {formatDate(event.date, "MMM")}
                    </span>
                    <span className="text-base leading-none font-bold">
                      {formatDate(event.date, "dd")}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {event.name}
                    </p>
                    {event.venue && (
                      <p className="text-muted-foreground truncate text-xs">
                        {event.venue}
                      </p>
                    )}
                  </div>
                </div>

                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  className="text-muted-foreground h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1"
                />
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="rounded-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-muted/80 rounded-md p-3">
              <HugeiconsIcon
                icon={Task02Icon}
                className="size-6"
                strokeWidth={2}
              />
            </div>
            <CardTitle className="text-base font-semibold">
              Priority Tasks
            </CardTitle>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/weddings/${weddingId}/tasks`}>
              View All
              <HugeiconsIcon icon={ArrowRight02Icon} className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {localTasks.filter((t) => !t.completed).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-muted mb-3 rounded-md p-3">
                <HugeiconsIcon
                  icon={CheckmarkSquare02Icon}
                  className="text-muted-foreground h-8 w-8"
                />
              </div>
              <p className="text-muted-foreground text-sm">
                All caught up! No priority tasks
              </p>
            </div>
          ) : (
            localTasks
              .filter((t) => !t.completed)
              .map((task) => {
                const dueDate = new Date(task.dueDate);
                dueDate.setHours(0, 0, 0, 0);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const overdue = !task.completed && dueDate < today;
                const dueToday =
                  !task.completed && dueDate.getTime() === today.getTime();
                return (
                  <div
                    key={task.id}
                    className="bg-card hover:bg-muted/50 flex items-center gap-3 rounded-md border p-3 transition-all"
                  >
                    <button
                      onClick={() =>
                        mutation.mutate({
                          taskId: task.id,
                          completed: !task.completed,
                        })
                      }
                      className="shrink-0"
                    >
                      <HugeiconsIcon
                        icon={
                          task.completed ? CheckmarkSquare02Icon : SquareIcon
                        }
                        className="h-5 w-5"
                        strokeWidth={task.completed ? 2.5 : 2}
                      />
                    </button>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm font-medium ${task.completed ? "text-muted-foreground line-through" : ""}`}
                      >
                        {task.title}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span
                          className={`text-xs ${overdue ? "font-medium text-red-600" : dueToday ? "font-semibold text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
                        >
                          {overdue
                            ? "Overdue"
                            : dueToday
                              ? "Due Today"
                              : `Due ${formatDate(task.dueDate, "MMM dd")}`}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : task.priority === "medium"
                                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {task.priority.charAt(0).toUpperCase() +
                            task.priority.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </CardContent>
      </Card>
    </div>
  );
};
