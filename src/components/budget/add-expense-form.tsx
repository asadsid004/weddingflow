"use client";

import { useForm } from "@tanstack/react-form";
import z from "zod";
import { FieldError, FieldGroup, FieldLegend, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEvents } from "@/actions/events";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { createExpense } from "@/actions/budgets";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

const expenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Amount must be a positive number",
    ),
  date: z.date(),
  eventId: z.string().min(1, "Please select an event"),
});

export const AddExpenseForm = ({
  weddingId,
  setOpen,
  initialEventId,
}: {
  weddingId: string;
  setOpen: (open: boolean) => void;
  initialEventId?: string;
}) => {
  const form = useForm({
    defaultValues: {
      description: "",
      amount: "",
      date: new Date(),
      eventId: initialEventId || "",
    },
    validators: {
      onSubmit: expenseSchema,
    },
    onSubmit: ({ value }) => {
      mutate({
        weddingId,
        description: value.description,
        amount: Number(value.amount),
        eventId: value.eventId,
        date: value.date.toISOString(),
      });
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      form.reset();
      setOpen(false);
      toast.success("Expense added successfully");
      queryClient.invalidateQueries({
        queryKey: ["expenses", weddingId],
      });
      if (initialEventId) {
        queryClient.invalidateQueries({
          queryKey: ["expenses", initialEventId, weddingId],
        });
      }
    },
    onError: () => {
      toast.error("Failed to add expense");
    },
  });

  const { data: events, isLoading } = useQuery({
    queryKey: ["events", weddingId],
    queryFn: () => getEvents(weddingId),
  });

  const hasEvents = events && events.length > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="description">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <FieldSet>
                <FieldLegend variant="label" className="mb-1">
                  Description <span className="text-destructive">*</span>
                </FieldLegend>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., Party Hall"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            );
          }}
        </form.Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <form.Field name="date">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <FieldSet className="-mt-4 w-full">
                  <FieldLegend variant="label" className="mb-1">
                    Paid Date <span className="text-destructive">*</span>
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
                    max={new Date().toISOString().split("T")[0]}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              );
            }}
          </form.Field>

          <form.Field name="amount">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <FieldSet className="-mt-4 w-full">
                  <FieldLegend variant="label" className="mb-1">
                    Amount (₹ Lakhs) <span className="text-destructive">*</span>
                  </FieldLegend>
                  <Input
                    id={field.name}
                    type="number"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    step={0.01}
                    min={0}
                    placeholder="0.00"
                  />
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
