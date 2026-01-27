"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { createGuest } from "@/actions/guests";
import { getEvents } from "@/actions/events";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Search01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const guestSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
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
  events: z.array(z.string()).min(1, "Events are required"),
});

interface AddGuestFormProps {
  weddingId: string;
  setOpen: (open: boolean) => void;
}

export function AddGuestForm({ weddingId, setOpen }: AddGuestFormProps) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events, isLoading } = useQuery({
    queryKey: ["events", weddingId],
    queryFn: () => getEvents(weddingId),
  });

  const filteredEvents = events?.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const hasEvents = events && events.length > 0;

  const { mutate, isPending } = useMutation({
    mutationFn: (guest: {
      name: string;
      email: string;
      phoneNumber: number;
      plusOnes: number;
      events: string[];
    }) => createGuest(weddingId, guest),
    onSuccess: () => {
      toast.success("Guest added successfully");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["guests", weddingId] });
    },
    onError: () => {
      toast.error("Failed to add guest");
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      plusOnes: 0,
      events: [] as string[],
    },
    validators: {
      onSubmit: guestSchema,
    },
    onSubmit: ({ value }) => {
      mutate({
        ...value,
        phoneNumber: Number(value.phoneNumber),
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
              <FieldSet className="-mb-4">
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
                  disabled={isPending}
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
              <FieldSet className="-mb-4">
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
                  disabled={isPending}
                  placeholder="guest@example.com"
                  maxLength={255}
                  required
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            );
          }}
        </form.Field>
        <div className="flex gap-2">
          <form.Field name="phoneNumber">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <FieldSet className="-mb-4 w-full">
                  <FieldLegend variant="label" className="mb-1">
                    Phone Number
                  </FieldLegend>
                  <Input
                    id={field.name}
                    type="number"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    aria-invalid={isInvalid}
                    disabled={isPending}
                    placeholder="1234567890"
                    maxLength={10}
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
                <FieldSet className="-mb-4 w-full">
                  <FieldLegend variant="label" className="mb-1">
                    Plus Ones
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
                    placeholder="0"
                    min="0"
                    max="10"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
              <FieldSet className="w-full">
                <FieldLegend variant="label" className="mb-1">
                  Event <span className="text-destructive">*</span>
                </FieldLegend>
                {isLoading ? (
                  <div className="border-input bg-background/50 text-muted-foreground flex h-32 items-center justify-center rounded-md border border-dashed text-sm">
                    <Spinner className="mr-2 h-4 w-4" />
                    Loading events...
                  </div>
                ) : !hasEvents ? (
                  <p className="text-muted-foreground bg-card flex items-center gap-2 rounded-md border p-2 text-sm">
                    <HugeiconsIcon
                      icon={InformationCircleIcon}
                      strokeWidth={2}
                      className="text-foreground h-4 w-4"
                    />
                    <span>
                      No events found. Please{" "}
                      <Link
                        href={`/weddings/${weddingId}/events`}
                        className="text-primary font-medium underline hover:no-underline"
                      >
                        create an event
                      </Link>{" "}
                      before adding guests.
                    </span>
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="text-muted-foreground flex items-center justify-between text-xs font-medium">
                      <span>Selected: {field.state.value.length} events</span>
                      {field.state.value.length > 0 && (
                        <button
                          type="button"
                          onClick={() => field.handleChange([])}
                          className="text-primary hover:underline hover:opacity-80"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <HugeiconsIcon
                        icon={Search01Icon}
                        strokeWidth={2}
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
                    <div className="scrollbar-thin scrollbar-thumb-muted-foreground/20 max-h-[180px] space-y-1 overflow-y-auto pr-1">
                      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                        {filteredEvents?.map((event) => {
                          const isSelected = field.state.value.includes(
                            event.id,
                          );
                          return (
                            <div
                              key={event.id}
                              className={cn(
                                "group hover:bg-accent/50 flex items-center space-x-2 rounded-md border border-transparent p-1.5 transition-colors",
                                isSelected && "bg-primary/5 border-primary/10",
                              )}
                            >
                              <Checkbox
                                id={event.id}
                                checked={isSelected}
                                onCheckedChange={(checked) => {
                                  const current = field.state.value;
                                  const newVal = checked
                                    ? [...current, event.id]
                                    : current.filter((id) => id !== event.id);
                                  field.handleChange(newVal);
                                }}
                              />
                              <Label
                                htmlFor={event.id}
                                className="line-clamp-1 w-full cursor-pointer text-sm font-medium"
                              >
                                {event.name}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                      {filteredEvents?.length === 0 && (
                        <p className="text-muted-foreground py-4 text-center text-xs">
                          No matching events found
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            );
          }}
        </form.Field>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Adding...
            </>
          ) : (
            "Add Guest"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
