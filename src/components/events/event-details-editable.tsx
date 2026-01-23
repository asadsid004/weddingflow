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
  Money01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { IncreaseTotalBudgetForm } from "../weddings/view/increase-total-budget-form";
import { updateEvent } from "@/actions/events";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";

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
    allocatedBudget: z.number().min(0, "Budget cannot be negative"),
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
    allocatedBudget: number;
  };
  totalWeddingBudget: number;
  weddingId: string;
  allEvents?: Array<{
    id: string;
    allocatedBudget: number;
  }>;
  currentEventId?: string;
}) => {
  const totalWeddingBudget = event.totalWeddingBudget;
  const currentEventBudget = event.event.allocatedBudget;

  const otherEventsAllocated = event.allEvents
    ? event.allEvents
        .filter((e) => e.id !== event.currentEventId)
        .reduce((sum, e) => sum + e.allocatedBudget, 0)
    : 0;

  const totalAllocated = otherEventsAllocated + currentEventBudget;
  const remainingBudgetForAllocation =
    totalWeddingBudget - otherEventsAllocated;

  const finalRemaining = totalWeddingBudget - totalAllocated;

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: {
      name: string;
      date: string;
      startTime: string;
      endTime: string;
      venue: string;
      venueAddress: string;
      allocatedBudget: number;
    }) => {
      return updateEvent(event.event.id, {
        ...data,
        allocatedBudget: data.allocatedBudget.toFixed(2),
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
      allocatedBudget: event.event.allocatedBudget,
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

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-6 pt-8">
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

      <div className="grid grid-cols-1 gap-4 pb-10 lg:grid-cols-2">
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold">
              <HugeiconsIcon
                icon={Money01Icon}
                strokeWidth={2}
                className="h-5 w-5"
              />
              Budget Information (₹ Lakhs)
            </h2>
            <IncreaseTotalBudgetForm
              currentTotalBudget={totalWeddingBudget}
              weddingId={event.weddingId}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Total Wedding Budget
              </span>
              <span className="font-semibold">
                {formatCurrency(totalWeddingBudget)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Allocated to Other Events
              </span>
              <span className="font-medium text-orange-500">
                {formatCurrency(otherEventsAllocated)}
              </span>
            </div>
            <div className="bg-border h-px" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Available for This Event
              </span>
              <span className="font-semibold text-blue-500">
                {formatCurrency(remainingBudgetForAllocation)}
              </span>
            </div>
            {currentEventBudget > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Currently Allocated to This Event
                  </span>
                  <span className="font-medium text-blue-500">
                    {formatCurrency(currentEventBudget)}
                  </span>
                </div>
                <div className="bg-border h-px" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Final Remaining Budget
                  </span>
                  <span
                    className={`font-semibold ${
                      finalRemaining >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {formatCurrency(finalRemaining)}
                  </span>
                </div>
              </>
            )}
          </div>

          <form.Field name="allocatedBudget">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const exceedsAvailable =
                field.state.value > remainingBudgetForAllocation;

              return (
                <FieldSet>
                  <FieldLegend variant="label" className="mb-1">
                    Allocate Budget for This Event
                  </FieldLegend>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min="0"
                    step="1000"
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    placeholder="Enter amount"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  {exceedsAvailable && !isInvalid && (
                    <p className="text-destructive -mt-4 text-sm">
                      Warning: Allocated amount exceeds available budget by{" "}
                      {formatCurrency(
                        field.state.value - remainingBudgetForAllocation,
                      )}
                    </p>
                  )}
                </FieldSet>
              );
            }}
          </form.Field>
        </div>
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
      </div>
    </div>
  );
};
