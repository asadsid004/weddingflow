"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import {
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/revola";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Edit03Icon } from "@hugeicons/core-free-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateGuest } from "@/actions/guests";

const editGuestSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phoneNumber: z.string().min(1, "Phone number is required").regex(/^[+]?[\d\s\-\(\)]+$/, "Invalid phone number format").max(20, "Phone number must be less than 20 characters"),
  plusOnes: z.number().int().min(0, "Plus ones must be 0 or more").max(10, "Plus ones cannot exceed 10"),
});

interface Guest {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  plusOnes: number;
}

interface GuestEditDialogProps {
  guest: Guest;
  weddingId: string;
}

export function GuestEditDialog({ guest, weddingId }: GuestEditDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: editMutate, isPending: isUpdating } = useMutation({
    mutationFn: (updatedGuest: {
      name: string;
      email: string;
      phoneNumber: string;
      plusOnes: number;
    }) => updateGuest(guest.id, updatedGuest),
    onSuccess: () => {
      toast.success("Guest updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["guests", weddingId],
      });
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to update guest");
    },
  });

  const editForm = useForm({
    defaultValues: {
      name: guest.name,
      email: guest.email,
      phoneNumber: guest.phoneNumber,
      plusOnes: guest.plusOnes,
    },
    validators: {
      onSubmit: editGuestSchema,
    },
    onSubmit: async ({ value }) => {
      editMutate(value);
    },
  });

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <HugeiconsIcon icon={Edit03Icon} strokeWidth={2} className="h-3.5 w-3.5" />
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="text-center">
            Edit Guest
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editForm.handleSubmit();
          }}
        >
          <FieldGroup className="-space-y-2 px-6 py-4">
            <editForm.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <FieldSet>
                    <FieldLegend className="mb-1">Name</FieldLegend>
                    <Input
                      id={field.name}
                      type="text"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Guest name"
                      maxLength={100}
                      required
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </FieldSet>
                );
              }}
            </editForm.Field>
            <editForm.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <FieldSet>
                    <FieldLegend className="mb-1">Email</FieldLegend>
                    <Input
                      id={field.name}
                      type="email"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="guest@example.com"
                      maxLength={255}
                      required
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </FieldSet>
                );
              }}
            </editForm.Field>
            <editForm.Field name="phoneNumber">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <FieldSet>
                    <FieldLegend className="mb-1">Phone Number</FieldLegend>
                    <Input
                      id={field.name}
                      type="tel"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="+1234567890"
                      maxLength={20}
                      required
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </FieldSet>
                );
              }}
            </editForm.Field>
            <editForm.Field name="plusOnes">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <FieldSet>
                    <FieldLegend className="mb-1">Plus Ones</FieldLegend>
                    <Input
                      id={field.name}
                      type="number"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      aria-invalid={isInvalid}
                      placeholder="0"
                      min="0"
                      max="10"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </FieldSet>
                );
              }}
            </editForm.Field>
          </FieldGroup>
          <div className="flex justify-between px-6 py-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Spinner className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Guest"
              )}
            </Button>
          </div>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
