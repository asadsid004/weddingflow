"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";

import { createGuest } from "@/actions/guests";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

const guestSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
    phoneNumber: z.string().min(1, "Phone number is required").regex(/^[+]?[\d\s\-\(\)]+$/, "Invalid phone number format").max(20, "Phone number must be less than 20 characters"),
    plusOnes: z.number().int().min(0, "Plus ones must be 0 or more").max(10, "Plus ones cannot exceed 10"),
  })
  .refine(
    (data) => {
      // If bringing more than 5 guests, phone number should be provided (already required but good practice)
      if (data.plusOnes > 5 && data.phoneNumber.length < 10) {
        return false;
      }
      return true;
    },
    {
      message: "Phone number is required when bringing more than 5 guests",
      path: ["phoneNumber"],
    }
  );

interface AddGuestFormProps {
  weddingId: string;
  onSuccess?: () => void;
  onOptimisticAdd?: (guest: {
    id: string;
    weddingId: string;
    name: string;
    email: string;
    phoneNumber: string;
    plusOnes: number;
    createdAt: Date;
    updatedAt: Date;
  }) => void;
}

export function AddGuestForm({ weddingId, onSuccess, onOptimisticAdd }: AddGuestFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (guest: {
      name: string;
      email: string;
      phoneNumber: string;
      plusOnes: number;
    }) => createGuest(weddingId, guest),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      plusOnes: 0,
    },
    validators: {
      onSubmit: guestSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(value, {
        onSuccess: () => {
          toast.success("Guest added successfully");
          // Add optimistic guest after successful DB insertion
          const optimisticGuest = {
            id: `temp-${Date.now()}`,
            weddingId,
            name: value.name,
            email: value.email,
            phoneNumber: value.phoneNumber,
            plusOnes: value.plusOnes,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          onOptimisticAdd?.(optimisticGuest);
          onSuccess?.();
          // Invalidate query to fetch fresh data immediately
          queryClient.invalidateQueries({ queryKey: ["guests", weddingId] });
        },
        onError: () => {
          toast.error("Failed to add guest");
        },
      });
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
      <form.Field name="name">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <FieldSet>
              <FieldLegend variant="label" className="mb-1">
                Name <span className="text-destructive">*</span>
              </FieldLegend>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Guest name"
                maxLength={100}
                required
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </FieldSet>
          );
        }}
      </form.Field>

      <form.Field name="email">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <FieldSet>
              <FieldLegend variant="label" className="mb-1">
                Email <span className="text-destructive">*</span>
              </FieldLegend>
              <Input
                id={field.name}
                name={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="guest@example.com"
                maxLength={255}
                required
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </FieldSet>
          );
        }}
      </form.Field>

      <form.Field name="phoneNumber">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <FieldSet>
              <FieldLegend variant="label" className="mb-1">
                Phone Number <span className="text-destructive">*</span>
              </FieldLegend>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="+1234567890"
                maxLength={20}
                required
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </FieldSet>
          );
        }}
      </form.Field>

      <form.Field name="plusOnes">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <FieldSet>
              <FieldLegend variant="label" className="mb-1">
                Plus Ones
              </FieldLegend>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min="0"
                max="10"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                placeholder="0"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </FieldSet>
          );
        }}
      </form.Field>

      <Button
        type="button"
        className="mt-2 w-full"
        disabled={isPending}
        onClick={handleFormSubmit}
      >
        {isPending ? (
          <>
            <Spinner />
            Adding...
          </>
        ) : (
          "Add Guest"
        )}
      </Button>
    </form>
  );
}
