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
import { Edit03Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateGuest } from "@/actions/guests";
import { getEvents } from "@/actions/events";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const editGuestSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  plusOnes: z
    .number()
    .int()
    .min(0, "Plus ones must be 0 or more")
    .max(10, "Plus ones cannot exceed 10"),
  events: z
    .array(
      z.object({
        eventId: z.string(),
        rsvp: z.enum(["pending", "accepted", "declined"]),
      }),
    )
    .min(1, "At least one event is required"),
});

interface Guest {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  plusOnes: number;
  events: {
    eventId: string;
    rsvp: "pending" | "accepted" | "declined";
  }[];
}

interface Event {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface GuestEditDialogProps {
  guest: Guest;
  weddingId: string;
}

export function GuestEditDialog({ guest, weddingId }: GuestEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: allEvents, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["events", weddingId],
    queryFn: () => getEvents(weddingId) as Promise<Event[]>,
  });

  const filteredEvents = allEvents?.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const { mutate: editMutate, isPending: isUpdating } = useMutation({
    mutationFn: (updatedGuest: {
      name: string;
      email: string;
      phoneNumber: string;
      plusOnes: number;
      events: { eventId: string; rsvp: "pending" | "accepted" | "declined" }[];
    }) => {
      return updateGuest(guest.id, {
        ...updatedGuest,
        phoneNumber: Number(updatedGuest.phoneNumber),
        events: updatedGuest.events,
      });
    },
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

  const form = useForm({
    defaultValues: {
      name: guest.name,
      email: guest.email,
      phoneNumber: guest.phoneNumber,
      plusOnes: guest.plusOnes,
      events: guest.events.map((e) => ({
        eventId: e.eventId,
        rsvp: e.rsvp,
      })),
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
          <HugeiconsIcon
            icon={Edit03Icon}
            strokeWidth={2}
            className="h-3.5 w-3.5"
          />
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="flex max-h-[90vh] flex-col sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="text-center">
            Edit Guest
          </ResponsiveDialogTitle>
          <p className="text-muted-foreground text-center text-sm">
            Edit guest details
          </p>
        </ResponsiveDialogHeader>
        <div className="scrollbar-thin flex flex-1 flex-col overflow-y-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup className="p-4 text-left">
              <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FieldSet>
                      <FieldLegend variant="label" className="mb-1">
                        Name
                      </FieldLegend>
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
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldSet>
                  );
                }}
              </form.Field>
              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FieldSet className="-mt-4">
                      <FieldLegend variant="label" className="mb-1">
                        Email
                      </FieldLegend>
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
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldSet>
                  );
                }}
              </form.Field>
              <div className="flex gap-4">
                <form.Field name="phoneNumber">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <FieldSet className="-mt-4 w-full">
                        <FieldLegend variant="label" className="mb-1">
                          Phone Number
                        </FieldLegend>
                        <Input
                          id={field.name}
                          type="text"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="1234567890"
                          maxLength={10}
                          required
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </FieldSet>
                    );
                  }}
                </form.Field>
                <form.Field name="plusOnes">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <FieldSet className="-mt-4 w-full">
                        <FieldLegend variant="label" className="mb-1">
                          Plus Ones
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
                          placeholder="0"
                          min="0"
                          max="10"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </FieldSet>
                    );
                  }}
                </form.Field>
              </div>

              <form.Field name="events">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FieldSet className="-mt-4 w-full">
                      <FieldLegend variant="label" className="mb-1">
                        Events <span className="text-destructive">*</span>
                      </FieldLegend>
                      {eventsLoading ? (
                        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-sm">
                          <Spinner className="mr-2 h-4 w-4" />
                          Loading events...
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <div className="text-muted-foreground flex items-center justify-between text-xs">
                            <span>
                              {field.state.value.length} events selected
                            </span>
                          </div>
                          <div className="relative">
                            <HugeiconsIcon
                              icon={Search01Icon}
                              className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2"
                            />
                            <Input
                              type="text"
                              placeholder="Search events..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="h-8 pl-8 text-xs"
                            />
                          </div>
                          <div className="scrollbar-thin scrollbar-thumb-muted-foreground/20 max-h-[20vh] space-y-2 overflow-y-auto pr-1 sm:max-h-[300px]">
                            {filteredEvents?.map((event) => {
                              const eventValue = field.state.value.find(
                                (v) => v.eventId === event.id,
                              );
                              const isSelected = !!eventValue;

                              return (
                                <div
                                  key={event.id}
                                  className={cn(
                                    "flex flex-col gap-2 rounded-md border p-2 transition-colors",
                                    isSelected
                                      ? "bg-primary/5 border-primary/20"
                                      : "hover:bg-accent/50 border-transparent",
                                  )}
                                >
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`edit-${event.id}`}
                                      checked={isSelected}
                                      onCheckedChange={(checked) => {
                                        const current = field.state.value;
                                        if (checked === true) {
                                          field.handleChange([
                                            ...current,
                                            {
                                              eventId: event.id,
                                              rsvp: "pending",
                                            },
                                          ]);
                                        } else {
                                          field.handleChange(
                                            current.filter(
                                              (v) => v.eventId !== event.id,
                                            ),
                                          );
                                        }
                                      }}
                                    />
                                    <Label
                                      htmlFor={`edit-${event.id}`}
                                      className="line-clamp-1 w-full cursor-pointer text-sm font-medium"
                                    >
                                      {event.name}
                                    </Label>
                                  </div>

                                  {isSelected && (
                                    <div className="ml-6 flex items-center gap-2">
                                      <Select
                                        value={eventValue.rsvp}
                                        onValueChange={(val) => {
                                          const newVal = field.state.value.map(
                                            (v) =>
                                              v.eventId === event.id
                                                ? {
                                                    ...v,
                                                    rsvp: val as
                                                      | "pending"
                                                      | "accepted"
                                                      | "declined",
                                                  }
                                                : v,
                                          );
                                          field.handleChange(newVal);
                                        }}
                                      >
                                        <SelectTrigger
                                          size="sm"
                                          className="bg-background w-full"
                                        >
                                          <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent
                                          className="z-10000"
                                          position="popper"
                                        >
                                          <SelectItem value="pending">
                                            Pending
                                          </SelectItem>
                                          <SelectItem value="accepted">
                                            Accepted
                                          </SelectItem>
                                          <SelectItem value="declined">
                                            Declined
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldSet>
                  );
                }}
              </form.Field>
            </FieldGroup>
            <div className="flex justify-end gap-3 px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
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
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
