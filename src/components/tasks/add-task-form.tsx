import { useForm } from "@tanstack/react-form";
import z from "zod";
import { FieldError, FieldGroup, FieldLegend, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { getEvents } from "@/actions/events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { createTask } from "@/actions/tasks";
import { toast } from "sonner";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  priority: z.enum(["low", "medium", "high"]),
  eventId: z.string().min(1, "Event is required"),
  dueDate: z.date(),
});

export const AddTaskForm = ({
  weddingId,
  setOpen,
}: {
  weddingId: string;
  setOpen: (open: boolean) => void;
}) => {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events", weddingId],
    queryFn: () => getEvents(weddingId),
  });

  const hasEvents = events && events.length > 0;

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      setOpen(false);
      toast.success("Task created successfully");
      queryClient.invalidateQueries({
        queryKey: ["tasks", weddingId],
      });
    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });

  const form = useForm({
    defaultValues: {
      title: "",
      priority: "low",
      eventId: "",
      dueDate: new Date(),
    },
    validators: {
      onSubmit: taskSchema,
    },
    onSubmit: ({ value }) => {
      mutate({
        weddingId,
        ...value,
        dueDate: value.dueDate.toISOString(),
      });
    },
  });

  return (
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
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                      new Date(field.state.value).toISOString().split("T")[0]
                    }
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(new Date(e.target.value))
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
            Adding...
          </>
        ) : (
          "Add Expense"
        )}
      </Button>
    </form>
  );
};
