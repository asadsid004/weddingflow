"use client";

import { getTasks } from "@/actions/tasks";
import { getEvents } from "@/actions/events";
import {
  TaskDone01Icon,
  TaskAdd01Icon,
  TaskRemove01Icon,
  Calendar03Icon,
  ArrowRight02Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

export const TasksOverview = ({ weddingId }: { weddingId: string }) => {
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", weddingId],
    queryFn: () => getTasks(weddingId),
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["events", weddingId],
    queryFn: () => getEvents(weddingId),
  });

  if (tasksLoading || eventsLoading) {
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

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((task) => task.completed).length || 0;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Calculate overdue tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueTasks =
    tasks?.filter((task) => {
      if (task.completed) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    }).length || 0;

  // Tasks by priority
  const highPriorityTasks =
    tasks?.filter((task) => task.priority === "high" && !task.completed)
      .length || 0;
  const mediumPriorityTasks =
    tasks?.filter((task) => task.priority === "medium" && !task.completed)
      .length || 0;
  const lowPriorityTasks =
    tasks?.filter((task) => task.priority === "low" && !task.completed)
      .length || 0;

  // Calculate tasks by event
  const eventTasks =
    events
      ?.map((event) => {
        const eventTasksList =
          tasks?.filter((task) => task.eventId === event.id) || [];
        const completed = eventTasksList.filter(
          (task) => task.completed,
        ).length;
        const total = eventTasksList.length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        const eventOverdue = eventTasksList.filter((task) => {
          if (task.completed) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate < today;
        }).length;

        return {
          id: event.id,
          name: event.name,
          total,
          completed,
          pending: total - completed,
          percentage,
          overdue: eventOverdue,
          hasOverdue: eventOverdue > 0,
        };
      })
      .filter((event) => event.total > 0) || [];

  // General tasks (no event)
  const generalTasks = tasks?.filter((task) => !task.eventId) || [];
  const generalCompleted = generalTasks.filter((task) => task.completed).length;
  const generalTotal = generalTasks.length;
  const generalPercentage =
    generalTotal > 0 ? (generalCompleted / generalTotal) * 100 : 0;
  const generalOverdue = generalTasks.filter((task) => {
    if (task.completed) return false;
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }).length;

  const getTaskStatus = (percentage: number) => {
    if (percentage === 100)
      return { color: "text-green-600", label: "Complete" };
    if (percentage >= 75)
      return { color: "text-blue-600", label: "Almost Done" };
    if (percentage >= 50)
      return { color: "text-yellow-600", label: "In Progress" };
    if (percentage >= 25)
      return { color: "text-orange-600", label: "Getting Started" };
    return { color: "text-red-600", label: "Just Started" };
  };

  const overallStatus = getTaskStatus(completionPercentage);

  return (
    <div className="space-y-6">
      {/* Tasks Overview Cards */}
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total Tasks */}
          <div className="rounded-md border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1 text-sm">
                  Total Tasks
                </p>
                <p className="text-2xl font-bold">{totalTasks}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {completionPercentage.toFixed(0)}% completed
                </p>
              </div>
              <div className="rounded-md bg-blue-100 p-3 dark:bg-blue-900">
                <HugeiconsIcon
                  icon={TaskAdd01Icon}
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="rounded-md border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedTasks}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {pendingTasks} pending
                </p>
              </div>
              <div className="rounded-md bg-green-100 p-3 dark:bg-green-900">
                <HugeiconsIcon
                  icon={TaskDone01Icon}
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>

          {/* Overdue Tasks */}
          <div className="rounded-md border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1 text-sm">Overdue</p>
                <p
                  className={`text-2xl font-bold ${overdueTasks > 0 ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {overdueTasks}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {overdueTasks > 0 ? "Need attention" : "All on track"}
                </p>
              </div>
              <div
                className={`rounded-md p-3 ${overdueTasks > 0 ? "bg-red-100 dark:bg-red-900" : "bg-gray-100 dark:bg-gray-800"}`}
              >
                <HugeiconsIcon
                  icon={overdueTasks > 0 ? AlertCircleIcon : TaskRemove01Icon}
                  className={`h-6 w-6 ${overdueTasks > 0 ? "text-destructive" : "text-muted-foreground"}`}
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Overall Progress Bar */}
          <div className="mt-4 w-full rounded-md border p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">
                Overall Task Completion
              </span>
              <span className={`text-sm font-semibold ${overallStatus.color}`}>
                {completionPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2 border" />
          </div>

          {/* Priority Breakdown */}
          {pendingTasks > 0 && (
            <div className="mt-0 w-full rounded-md border p-4 sm:mt-4">
              <h3 className="mb-1 text-sm font-semibold">
                Pending Tasks by Priority
              </h3>
              <div className="flex flex-wrap gap-4">
                {highPriorityTasks > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-sm">
                      <span className="font-medium">{highPriorityTasks}</span>{" "}
                      High
                    </span>
                  </div>
                )}
                {mediumPriorityTasks > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="text-sm">
                      <span className="font-medium">{mediumPriorityTasks}</span>{" "}
                      Medium
                    </span>
                  </div>
                )}
                {lowPriorityTasks > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-sm">
                      <span className="font-medium">{lowPriorityTasks}</span>{" "}
                      Low
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tasks by Event */}
      {eventTasks.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Tasks by Event</h2>
          <div className="space-y-3">
            {eventTasks.map((event) => {
              const status = getTaskStatus(event.percentage);
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
                        {event.hasOverdue && (
                          <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900 dark:text-red-300">
                            {event.overdue} Overdue
                          </span>
                        )}
                      </div>
                      <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                        <span className="whitespace-nowrap">
                          {event.total} total
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="whitespace-nowrap text-green-600">
                          {event.completed} completed
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="whitespace-nowrap">
                          {event.pending} pending
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
                        {event.completed} of {event.total} completed
                      </span>
                      <span className={`font-semibold ${status.color}`}>
                        {event.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={event.percentage} className="h-2" />
                  </div>
                </div>
              );
            })}

            {/* General Tasks */}
            {generalTotal > 0 && (
              <div className="bg-muted/30 rounded-md border p-4 transition-shadow hover:shadow-md">
                <div className="mb-3 min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="font-semibold">General (No Event)</h3>
                    {generalOverdue > 0 && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900 dark:text-red-300">
                        {generalOverdue} Overdue
                      </span>
                    )}
                  </div>
                  <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    <span className="whitespace-nowrap">
                      {generalTotal} total
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="whitespace-nowrap text-green-600">
                      {generalCompleted} completed
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="whitespace-nowrap">
                      {generalTotal - generalCompleted} pending
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {generalCompleted} of {generalTotal} completed
                    </span>
                    <span
                      className={`font-semibold ${generalPercentage === 100 ? "text-green-600" : "text-blue-600"}`}
                    >
                      {generalPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={generalPercentage} className="h-2" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
