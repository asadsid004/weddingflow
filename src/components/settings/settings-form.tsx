"use client";

import { getWeddingById, updateWedding } from "@/actions/weddings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { useForm } from "@tanstack/react-form";
import z from "zod";
import { FieldError, FieldGroup, FieldLegend, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

const settingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brideName: z.string().min(1, "Bride name is required"),
  groomName: z.string().min(1, "Groom name is required"),
  weddingDate: z.string().min(1, "Wedding date is required"),
  totalBudget: z.string().min(1, "Total budget is required"),
});

export const SettingsForm = ({ weddingId }: { weddingId: string }) => {
  const { data: wedding, isLoading } = useQuery({
    queryKey: ["wedding", weddingId],
    queryFn: () => getWeddingById(weddingId),
  });

  if (isLoading)
    return (
      <div className="mt-8 space-y-6">
        {/* Wedding Name */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Bride & Groom */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Date & Budget */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Submit button */}
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    );

  if (!wedding)
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground mt-20 flex items-center gap-2 text-center text-xl">
          <HugeiconsIcon
            icon={Alert02Icon}
            strokeWidth={2}
            className="size-5"
          />{" "}
          Wedding not found
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/weddings">
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              strokeWidth={2}
              className="size-4"
            />{" "}
            Back to Weddings
          </Link>
        </Button>
      </div>
    );

  return (
    <SettingsFormContent
      {...wedding[0]}
      weddingId={wedding[0].id}
      totalBudget={wedding[0].totalBudget!}
    />
  );
};

const SettingsFormContent = ({
  weddingId,
  name,
  brideName,
  groomName,
  weddingDate,
  totalBudget,
}: {
  weddingId: string;
  name: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  totalBudget: string;
}) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateWedding,
    onSuccess: () => {
      toast.success("Wedding updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["wedding", weddingId],
      });
    },
    onError: () => {
      toast.error("Failed to update wedding");
    },
  });

  const form = useForm({
    defaultValues: {
      name: name,
      brideName: brideName,
      groomName: groomName,
      weddingDate: weddingDate,
      totalBudget: totalBudget,
    },
    validators: {
      onSubmit: settingsSchema,
    },
    onSubmit: async (values) => {
      mutate({
        weddingId: weddingId,
        name: values.value.name,
        brideName: values.value.brideName,
        groomName: values.value.groomName,
        weddingDate: new Date(values.value.weddingDate),
        totalBudget: Number(values.value.totalBudget),
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
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <FieldSet className="-mb-4 w-full">
                <FieldLegend variant="label" className="mb-1">
                  Wedding Name
                </FieldLegend>
                <Input
                  id={field.name}
                  type="text"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Peter & Gwen Wedding"
                  required
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            );
          }}
        </form.Field>
        <div className="mt-0 flex flex-col gap-2 space-y-2 sm:mt-3 sm:flex-row">
          <form.Field name="brideName">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <FieldSet className="w-full">
                  <FieldLegend variant="label" className="mb-1">
                    Bride Name
                  </FieldLegend>
                  <Input
                    id={field.name}
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Gwen Stacy"
                    required
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              );
            }}
          </form.Field>
          <form.Field name="groomName">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <FieldSet className="w-full">
                  <FieldLegend variant="label" className="mb-1">
                    Groom Name
                  </FieldLegend>
                  <Input
                    id={field.name}
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Peter Parker"
                    required
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              );
            }}
          </form.Field>
        </div>
        <div className="-mt-3 flex flex-col gap-2 space-y-2 sm:flex-row">
          <form.Field name="weddingDate">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <FieldSet className="w-full">
                  <FieldLegend variant="label" className="mb-1">
                    Wedding Date
                  </FieldLegend>
                  <Input
                    id={field.name}
                    type="date"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              );
            }}
          </form.Field>

          <form.Field name="totalBudget">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <FieldSet className="w-full">
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
                    step={0.01}
                    min={0}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              );
            }}
          </form.Field>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-full sm:w-fit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Updating...
              </>
            ) : (
              "Update Wedding"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};
