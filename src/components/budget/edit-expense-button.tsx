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
import { updateExpense } from "@/actions/budgets";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { expenseCategories, ExpenseCategory } from "@/db/schema";

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
  category: z.enum(expenseCategories),
  eventId: z.string().min(1, "Please select an event"),
});

export const EditExpenseButton = ({
  expenseId,
  weddingId,
  expense,
}: {
  expenseId: string;
  weddingId: string;
  expense: {
    description: string;
    amount: string;
    date: string;
    eventId: string;
    category: string;
  };
}) => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ["events", weddingId],
    queryFn: () => getEvents(weddingId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      form.reset();
      setOpen(false);
      toast.success("Expense updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["expenses", weddingId],
      });
    },
    onError: () => {
      toast.error("Failed to update expense");
    },
  });

  const form = useForm({
    defaultValues: {
      description: expense.description || "",
      amount: expense.amount || "",
      date: expense.date ? new Date(expense.date) : new Date(),
      eventId: expense.eventId || "",
      category: expense.category || "",
    },
    validators: {
      onSubmit: expenseSchema,
    },
    onSubmit: ({ value }) => {
      mutate({
        expenseId,
        description: value.description,
        amount: Number(value.amount),
        eventId: value.eventId,
        date: new Date(value.date).toISOString().split("T")[0],
        category: value.category as ExpenseCategory,
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
          <ResponsiveDialogTitle className="pb-2 text-center">
            Edit Expense
          </ResponsiveDialogTitle>
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
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
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
                            new Date(field.state.value)
                              .toISOString()
                              .split("T")[0]
                          }
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(new Date(e.target.value))
                          }
                          max={new Date().toISOString().split("T")[0]}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
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
                          Amount (₹ Lakhs){" "}
                          <span className="text-destructive">*</span>
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
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={(e) => field.handleChange(e)}
                          aria-invalid={isInvalid}
                        >
                          <SelectTrigger
                            size="sm"
                            className="bg-background w-full"
                          >
                            <SelectValue placeholder="Select an event" />
                          </SelectTrigger>
                          <SelectContent className="z-10000" position="popper">
                            {events?.map((event) => (
                              <SelectItem key={event.id} value={event.id}>
                                {event.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldSet>
                  );
                }}
              </form.Field>
            </FieldGroup>
            <form.Field name="category">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <FieldSet className="mt-2 w-full">
                    <FieldLegend variant="label" className="mb-1">
                      Category <span className="text-destructive">*</span>
                    </FieldLegend>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(e) => field.handleChange(e)}
                      aria-invalid={isInvalid}
                    >
                      <SelectTrigger size="sm" className="bg-background w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="z-10000" position="popper">
                        {expenseCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldSet>
                );
              }}
            </form.Field>
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
