"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../ui/revola";
import { Edit04Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { FieldGroup, FieldSet, FieldLegend, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { getEvents } from "@/actions/events";
import Link from "next/link";
import { updateTask } from "@/actions/tasks";
import { Task } from "./task-columns";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  priority: z.string().min(1, "Priority is required"),
  dueDate: z.date(),
  eventId: z.string().min(1, "Please select an event"),
});

export const EditTaskButton = ({
  weddingId,
  task,
}: {
  weddingId: string;
  task: {
    id: string;
    title: string;
    priority: string;
    dueDate: string;
    eventId: string;
  };
}) => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ["events", weddingId],
    queryFn: () => getEvents(weddingId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: Partial<Task> }) =>
      updateTask(taskId, data),
    onSuccess: () => {
      form.reset();
      setOpen(false);
      toast.success("Task updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["tasks", weddingId],
      });
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });

  const form = useForm({
    defaultValues: {
      title: task.title || "",
      priority: task.priority || "",
      dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
      eventId: task.eventId || "",
    },
    validators: {
      onSubmit: taskSchema,
    },
    onSubmit: ({ value }) => {
      mutate({
        taskId: task.id,
        data: {
          title: value.title,
          priority: value.priority as "low" | "medium" | "high",
          dueDate: new Date(value.dueDate).toISOString().split("T")[0],
          eventId: value.eventId,
        },
      });
    },
  });

  const hasEvents = events && events.length > 0;

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button variant="ghost">
          <HugeiconsIcon icon={Edit04Icon} strokeWidth={2} />
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Edit Expense</ResponsiveDialogTitle>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="title">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FieldSet>
                      <FieldLegend variant="label" className="mb-1">
                        Title <span className="text-destructive">*</span>
                      </FieldLegend>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g., Pay for Party Hall"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldSet>
                  );
                }}
              </form.Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <form.Field name="dueDate">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <FieldSet className="-mt-4 w-full">
                        <FieldLegend variant="label" className="mb-1">
                          Due Date <span className="text-destructive">*</span>
                        </FieldLegend>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="date"
                          value={
                            new Date(field.state.value)
                              .toISOString()
                              .split("T")[0]
                          }
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(new Date(e.target.value))
                          }
                          min={new Date().toISOString().split("T")[0]}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </FieldSet>
                    );
                  }}
                </form.Field>

                <form.Field name="priority">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <FieldSet className="-mt-4 w-full">
                        <FieldLegend variant="label" className="mb-1">
                          Priority <span className="text-destructive">*</span>
                        </FieldLegend>
                        <select
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                          aria-invalid={isInvalid}
                        >
                          <option value="" disabled>
                            Select priority
                          </option>
                          {["low", "medium", "high"]?.map((level) => (
                            <option key={level} value={level}>
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </option>
                          ))}
                        </select>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </FieldSet>
                    );
                  }}
                </form.Field>
              </div>
              <form.Field name="eventId">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FieldSet className="-mt-4 w-full">
                      <FieldLegend variant="label" className="mb-1">
                        Event <span className="text-destructive">*</span>
                      </FieldLegend>
                      {isLoading ? (
                        <div className="border-input bg-background text-muted-foreground flex h-10 items-center rounded-md border px-3 py-2 text-sm">
                          Loading events...
                        </div>
                      ) : !hasEvents ? (
                        <p className="text-muted-foreground bg-card flex items-center gap-2 rounded-md border p-2 text-sm">
                          <HugeiconsIcon
                            icon={InformationCircleIcon}
                            strokeWidth={2}
                            className="text-foreground h-4 w-4"
                          />
                          <span>
                            No events found. Please{" "}
                            <Link
                              href={`/weddings/${weddingId}/events`}
                              className="text-primary font-medium underline hover:no-underline"
                            >
                              create an event
                            </Link>{" "}
                            before adding expenses.
                          </span>
                        </p>
                      ) : (
                        <select
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                          aria-invalid={isInvalid}
                        >
                          <option value="" disabled>
                            Select an event
                          </option>
                          {events?.map((event) => (
                            <option key={event.id} value={event.id}>
                              {event.name}
                            </option>
                          ))}
                        </select>
                      )}
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldSet>
                  );
                }}
              </form.Field>
            </FieldGroup>

            <Button
              type="submit"
              className="mt-4 w-full"
              disabled={!hasEvents || isPending}
            >
              {isPending ? (
                <>
                  <Spinner />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </ResponsiveDialogHeader>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
