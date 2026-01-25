"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, updateTask } from "@/actions/tasks";
import { getEvents } from "@/actions/events";
import { TasksTable } from "./tasks-table";
import { createTaskColumns, Task } from "./task-columns";
import { AddTaskButton } from "./add-task-button";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { useRef } from "react";

export const TasksList = ({ weddingId }: { weddingId: string }) => {
  const queryClient = useQueryClient();
  const refetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", weddingId],
    queryFn: () => getTasks(weddingId),
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["events", weddingId],
    queryFn: () => getEvents(weddingId),
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: async ({
      taskId,
      completed,
    }: {
      taskId: string;
      completed: boolean;
    }) => {
      return updateTask(taskId, { completed });
    },
    onMutate: async ({ taskId, completed }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks", weddingId] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(["tasks", weddingId]);

      // Optimistically update the cache
      queryClient.setQueryData(["tasks", weddingId], (old: Task[]) => {
        if (!old) return old;
        return old.map((task) =>
          task.id === taskId ? { ...task, completed } : task,
        );
      });

      // Return context with the previous data
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", weddingId], context.previousTasks);
      }
      toast.error("Failed to update task");
    },
    onSuccess: () => {
      toast.success("Task status updated");
    },
    onSettled: () => {
      // Debounce refetch to prevent multiple simultaneous invalidations
      if (refetchTimeoutRef.current) {
        clearTimeout(refetchTimeoutRef.current);
      }

      refetchTimeoutRef.current = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["tasks", weddingId] });
      }, 500); // Wait 500ms after last update before refetching
    },
  });

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    toggleCompleteMutation.mutate({ taskId, completed });
  };

  if (tasksLoading || eventsLoading) {
    return (
      <div className="my-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-auto sm:w-52" />
          <Skeleton className="h-10 w-auto sm:w-40" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Create a map of event IDs to event names for quick lookup
  const eventMap = new Map(events?.map((e) => [e.id, e.name]) || []);

  // Transform tasks to include event names and sort: pending first, then completed
  const tasksWithEventNames: Task[] =
    tasks
      ?.map((task) => ({
        id: task.id,
        title: task.title,
        completed: task.completed,
        priority: task.priority,
        dueDate: task.dueDate,
        eventId: task.eventId,
        eventName: task.eventId
          ? eventMap.get(task.eventId) || "Unknown Event"
          : "General",
        weddingId: weddingId,
      }))
      .sort((a, b) => {
        // Sort by completion status: pending (false) comes before completed (true)
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      }) || [];

  const columns = createTaskColumns(handleToggleComplete);

  return (
    <div className="my-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Tasks</h2>
          <p className="text-muted-foreground text-sm">
            Manage and track all your wedding tasks
          </p>
        </div>
        <AddTaskButton weddingId={weddingId} />
      </div>

      <TasksTable
        columns={columns}
        data={tasksWithEventNames}
        events={events?.map((e) => ({ id: e.id, name: e.name }))}
      />
    </div>
  );
};
