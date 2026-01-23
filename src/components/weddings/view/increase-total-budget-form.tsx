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
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export const IncreaseTotalBudgetForm = ({
  weddingId,
  currentTotalBudget,
}: {
  weddingId: string;
  currentTotalBudget: number;
}) => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (totalBudget: number) =>
      increaseTotalBudget({ weddingId, totalBudget }),
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["wedding", weddingId],
      });
      toast.success("Total budget increased successfully");
    },
    onError: () => {
      toast.error("Failed to increase total budget");
    },
  });

  const form = useForm({
    defaultValues: {
      totalBudget: currentTotalBudget.toString(),
    },
    validators: {
      onSubmit: z.object({
        totalBudget: z.string().min(1, "Amount is required"),
      }),
    },
    onSubmit: ({ value }) => {
      mutate(Number(value.totalBudget));
    },
  });

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button variant="outline">
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          Increase Wedding Budget
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="max-h-[calc(100vh-10rem)] overflow-y-auto sm:max-w-sm">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="text-center text-lg font-semibold tracking-tight">
            Increase Total Budget
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
            {isPending ? "Increasing..." : "Increase Budget"}
          </Button>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
