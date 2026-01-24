"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { Edit04Icon } from "@hugeicons/core-free-icons";

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../ui/revola";
import z from "zod";
import { FieldError, FieldLegend, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { increaseTotalBudget } from "@/actions/weddings";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";

export const EditTotalBudgetButton = ({
  weddingId,
  totalBudget,
}: {
  weddingId: string;
  totalBudget: number;
}) => {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (totalBudget: number) =>
      increaseTotalBudget({ weddingId, totalBudget }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wedding", weddingId],
      });
      setOpen(false);
      toast.success("Total budget updated successfully");
    },
    onError: () => {
      toast.error("Failed to update total budget");
    },
  });

  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      totalBudget: totalBudget,
    },
    validators: {
      onSubmit: z.object({
        totalBudget: z
          .number()
          .min(1, "Total budget is required")
          .min(1, "Total budget must be greater than 0"),
      }),
    },
    onSubmit: (value) => {
      mutate(Number(value.value.totalBudget));
    },
  });

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger className="mt-1 flex cursor-pointer items-center gap-2 text-sm underline">
        <HugeiconsIcon icon={Edit04Icon} strokeWidth={2} className="size-3" />
        Edit Budget
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogTitle className="text-center">
          Edit Total Budget
        </ResponsiveDialogTitle>
        <div className="mt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.Field name="totalBudget">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <FieldSet className="w-full">
                    <FieldLegend variant="label" className="mb-1">
                      Total Budget (₹ Lakhs){" "}
                      <span className="text-destructive">*</span>
                    </FieldLegend>
                    <Input
                      id={field.name}
                      type="number"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      aria-invalid={isInvalid}
                      step={0.01}
                      min={0}
                      placeholder="15.10"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldSet>
                );
              }}
            </form.Field>
            <div className="mt-4 flex justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Spinner /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
