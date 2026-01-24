import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import z from "zod";

import { increaseTotalBudget } from "@/actions/weddings";

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/revola";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Edit04Icon } from "@hugeicons/core-free-icons";
import {
  FieldDescription,
  FieldError,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "../ui/spinner";
import { updateEvent } from "@/actions/events";

export const EditBudgetForm = ({
  weddingId,
  eventId,
  currentTotalBudget,
  currentEventBudget,
}: {
  weddingId: string;
  eventId: string;
  currentTotalBudget: number;
  currentEventBudget: number;
}) => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      totalBudget,
      allocatedBudget,
    }: {
      totalBudget: number;
      allocatedBudget: number;
    }) => {
      await increaseTotalBudget({ weddingId, totalBudget });
      await updateEvent(eventId, {
        allocatedBudget: allocatedBudget.toFixed(2),
      });
    },
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["wedding", weddingId],
      });
      queryClient.invalidateQueries({
        queryKey: ["events", weddingId],
      });
      toast.success("Budget updated successfully");
    },
    onError: () => {
      toast.error("Failed to update budget");
    },
  });

  const form = useForm({
    defaultValues: {
      totalBudget: currentTotalBudget.toString(),
      allocatedBudget: currentEventBudget.toString(),
    },
    validators: {
      onSubmit: z.object({
        totalBudget: z.string().min(1, "Amount is required"),
        allocatedBudget: z.string().min(0, "Amount can't be less than 0"),
      }),
    },
    onSubmit: ({ value }) => {
      mutate({
        totalBudget: Number(value.totalBudget),
        allocatedBudget: Number(value.allocatedBudget),
      });
    },
  });

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button variant="outline">
          <HugeiconsIcon icon={Edit04Icon} strokeWidth={2} />
          Edit Budget
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="max-h-[calc(100vh-10rem)] overflow-y-auto sm:max-w-sm">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="text-center text-lg font-semibold tracking-tight">
            Edit Budget
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4 pt-8"
        >
          <form.Field name="totalBudget">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <FieldSet className="-mt-4 w-full">
                  <FieldLegend variant="label" className="mb-1">
                    Total Budget (₹ Lakhs)
                  </FieldLegend>
                  <FieldDescription className="-mb-4">
                    Increase the total budget to allocate more funds to this
                    event.
                  </FieldDescription>
                  <Input
                    id={field.name}
                    type="number"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    disabled={isPending}
                    step={0.01}
                    min={0}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              );
            }}
          </form.Field>
          <form.Field name="allocatedBudget">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <FieldSet className="mt-4 w-full">
                  <FieldLegend variant="label" className="mb-1">
                    Budget Allocated to this Event (₹ Lakhs)
                  </FieldLegend>
                  <FieldDescription className="-mb-4">
                    Increase the total budget to allocate more funds to this
                    event.
                  </FieldDescription>
                  <Input
                    id={field.name}
                    type="number"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    disabled={isPending}
                    step={0.01}
                    min={0}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              );
            }}
          </form.Field>
          <Button
            type="submit"
            variant="default"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner />
                Updating...
              </>
            ) : (
              "Update Budget"
            )}
          </Button>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
