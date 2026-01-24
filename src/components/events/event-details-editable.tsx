import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { convertTo24Hour } from "@/lib/utils";
import { FieldError, FieldGroup, FieldSet, FieldLegend } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar02Icon,
  Edit04Icon,
  Location04Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { updateEvent } from "@/actions/events";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { Card, CardContent } from "../ui/card";
import { EventBudgetCard } from "./event-budget-card";

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
    venue: z.string(),
    venueAddress: z.string(),
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

export const EventDetailsEditable = (event: {
  event: {
    id: string;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    venue: string;
    venueAddress: string;
  };
  weddingId: string;
}) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: {
      name: string;
      date: string;
      startTime: string;
      endTime: string;
      venue: string;
      venueAddress: string;
    }) => {
      return updateEvent(event.event.id, {
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", event.event.id] });
      queryClient.invalidateQueries({ queryKey: ["events", event.weddingId] });
      toast.success("Event details updated successfully");
    },
    onError: () => {
      toast.error("Failed to update event details");
    },
  });

  const form = useForm({
    defaultValues: {
      name: event.event.name,
      date: event.event.date,
      startTime: convertTo24Hour(event.event.startTime),
      endTime: convertTo24Hour(event.event.endTime),
      venue: event.event.venue,
      venueAddress: event.event.venueAddress,
    },
    validators: {
      onSubmit: eventSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });

  const handleSubmit = () => {
    form.handleSubmit();
  };

  return (
    <Card className="mt-8 rounded-md">
      <CardContent className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="flex items-center gap-2 font-semibold">
            <HugeiconsIcon
              icon={Calendar02Icon}
              strokeWidth={2}
              className="h-5 w-5"
            />
            Event Details
          </h1>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Spinner className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <HugeiconsIcon
                  icon={Edit04Icon}
                  strokeWidth={2}
                  className="h-4 w-4"
                />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                    placeholder="e.g., Wedding Ceremony"
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
        </FieldGroup>
        <div className="space-y-4 pt-2">
          <h2 className="flex items-center gap-2 font-semibold">
            <HugeiconsIcon
              icon={Location04Icon}
              strokeWidth={2}
              className="h-5 w-5"
            />
            Venue Information
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.Field name="venue">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <FieldSet>
                    <FieldLegend variant="label" className="mb-1">
                      Venue Name
                    </FieldLegend>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g., Grand Hall"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldSet>
                );
              }}
            </form.Field>

            <form.Field name="venueAddress">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <FieldSet>
                    <FieldLegend variant="label" className="mb-1">
                      Venue Address
                    </FieldLegend>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g., 123 Main St, City, Country"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldSet>
                );
              }}
            </form.Field>
          </div>
        </div>
        <EventBudgetCard
          currentEventId={event.event.id}
          weddingId={event.weddingId}
        />
      </CardContent>
    </Card>
  );
};
