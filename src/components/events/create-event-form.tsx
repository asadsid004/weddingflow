"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";

import { createEvent } from "@/actions/events";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

const eventSchema = z
  .object({
    name: z.string().min(1, "Event name is required"),
    date: z
      .string()
      .min(1, "Date is required")
      .refine(
        (date) => new Date(date) >= new Date(),
        "Wedding date cannot be in the past",
      ),
    startTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    endTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    estimatedGuests: z
      .number()
      .positive("Must be a positive number")
      .min(1, "At least 1 guest required"),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        const [startHour, startMin] = data.startTime.split(":").map(Number);
        const [endHour, endMin] = data.endTime.split(":").map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        return endMinutes > startMinutes;
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  );

export function CreateEventForm({ weddingId }: { weddingId: string }) {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (event: {
      name: string;
      date: string;
      startTime: string;
      endTime: string;
      estimatedGuests: number;
    }) => createEvent(weddingId, event),
    onSuccess: (id) => {
      router.push(`/dashboard/${weddingId}/events/${id}`);
      toast.success("Event created successfully");
    },
    onError: () => {
      toast.error("Failed to create event");
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      date: "",
      startTime: "",
      endTime: "",
      estimatedGuests: 0,
    },
    validators: {
      onSubmit: eventSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(value);
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4 py-4"
    >
      <form.Field name="name">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <FieldSet>
              <FieldLegend variant="label" className="mb-1">
                Event Name <span className="text-destructive">*</span>
              </FieldLegend>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Wedding Ceremony"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </FieldSet>
          );
        }}
      </form.Field>
      <form.Field name="date">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <FieldSet>
              <FieldLegend variant="label" className="mb-1">
                Event Date <span className="text-destructive">*</span>
              </FieldLegend>
              <Input
                id={field.name}
                name={field.name}
                type="date"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </FieldSet>
          );
        }}
      </form.Field>

      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="startTime"
          validators={{
            onChange: eventSchema.shape.startTime,
          }}
        >
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <FieldSet>
                <FieldLegend variant="label" className="mb-1">
                  Start Time <span className="text-destructive">*</span>
                </FieldLegend>
                <Input
                  id={field.name}
                  name={field.name}
                  type="time"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            );
          }}
        </form.Field>
        <form.Field
          name="endTime"
          validators={{
            onChange: eventSchema.shape.endTime,
            onChangeListenTo: ["startTime"],
          }}
        >
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <FieldSet>
                <FieldLegend variant="label" className="mb-1">
                  End Time <span className="text-destructive">*</span>
                </FieldLegend>
                <Input
                  id={field.name}
                  name={field.name}
                  type="time"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            );
          }}
        </form.Field>
      </div>

      <form.Field name="estimatedGuests">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <FieldSet>
              <FieldLegend variant="label" className="mb-1">
                Estimated Guests <span className="text-destructive">*</span>
              </FieldLegend>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min="1"
                value={field.state.value || ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                placeholder="200"
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
            Creating...
          </>
        ) : (
          "Create Event"
        )}
      </Button>
    </form>
  );
}
