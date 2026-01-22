"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import z from "zod";
import { toast } from "sonner";

import {
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { createWedding } from "@/actions/weddings";

type WeddingFormData = z.infer<typeof WeddingFormSchema>;

const WeddingFormSchema = z.object({
  brideName: z.string().min(1, "Bride name is required"),
  groomName: z.string().min(1, "Groom name is required"),
  weddingDate: z.date().min(new Date(), "Wedding date cannot be in the past"),
  estimatedGuests: z.number().min(1, "Estimated guests is required"),
  totalBudget: z.number().min(0, "Total budget cannot be less than 0"),
});

export const WeddingForm = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: WeddingFormData) => {
      const id = await createWedding(data);
      return id;
    },
    onSuccess: (id) => {
      router.push(`/weddings/${id}/dashboard`);
      toast.success("Wedding created successfully");
    },
    onError: () => {
      toast.error("Failed to create wedding");
    },
  });

  const form = useForm({
    defaultValues: {
      brideName: "",
      groomName: "",
      weddingDate: new Date(),
      estimatedGuests: 1,
      totalBudget: 1,
    },
    validators: {
      onSubmit: WeddingFormSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="pb-4"
    >
      <FieldGroup>
        <form.Field name="brideName">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <FieldSet>
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
                  disabled={isPending}
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
              <FieldSet className="-mt-4">
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
                  disabled={isPending}
                  placeholder="Peter Parker"
                  required
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            );
          }}
        </form.Field>
        <form.Field name="weddingDate">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <FieldSet className="-mt-4">
                <FieldLegend variant="label" className="mb-1">
                  Wedding Date
                </FieldLegend>
                <Input
                  id={field.name}
                  type="date"
                  name={field.name}
                  value={
                    field.state.value instanceof Date
                      ? field.state.value.toISOString().split("T")[0]
                      : ""
                  }
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(new Date(e.target.value))}
                  aria-invalid={isInvalid}
                  disabled={isPending}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            );
          }}
        </form.Field>
        <div className="flex gap-2">
          <form.Field name="estimatedGuests">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <FieldSet className="-mt-4 w-full">
                  <FieldLegend variant="label" className="mb-1">
                    Estimated Guests
                  </FieldLegend>
                  <Input
                    id={field.name}
                    type="number"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    aria-invalid={isInvalid}
                    disabled={isPending}
                    min={1}
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
                    onChange={(e) => field.handleChange(Number(e.target.value))}
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
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Creating...
            </>
          ) : (
            "Create Wedding"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
};
