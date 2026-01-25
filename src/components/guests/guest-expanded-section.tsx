"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getEvents } from "@/actions/events";
import { addGuestToEvent, removeGuestFromEvent } from "@/actions/guests";

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/revola";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon } from "@hugeicons/core-free-icons";

interface GuestEvent {
  id: string;
  name: string;
  rsvpStatus: 'pending' | 'accepted' | 'declined';
}

interface GuestExpandedSectionProps {
  weddingId: string;
  guestId: string;
  additionalEvents: GuestEvent[];
  getRSVPStatusBadge: (status: string) => React.ReactNode;
}

export function GuestExpandedSection({
  weddingId,
  guestId,
  additionalEvents,
  getRSVPStatusBadge,
}: GuestExpandedSectionProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: allEvents, isLoading: isEventsLoading } = useQuery({
    queryKey: ["events", weddingId],
    queryFn: () => getEvents(weddingId),
  });

  const availableEvents = useMemo(() => {
    if (!allEvents) return [];
    return allEvents.filter(
      (e) => !additionalEvents.some((ge) => ge.id === e.id),
    );
  }, [allEvents, additionalEvents]);

  const handleAdd = async () => {
    if (!selectedEventId) {
      toast.error("Please select an event");
      return;
    }

    setIsSubmitting(true);
    try {
      await addGuestToEvent(selectedEventId, guestId);
      toast.success("Guest added to event");
      setOpen(false);
      setSelectedEventId("");
      await queryClient.invalidateQueries({ queryKey: ["guestEvents", weddingId] });
    } catch (err) {
      toast.error("Failed to add guest to event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (eventId: string, eventName: string) => {
    setIsSubmitting(true);
    try {
      await removeGuestFromEvent(eventId, guestId);
      toast.success("Guest removed from event");
      await queryClient.invalidateQueries({ queryKey: ["guestEvents", weddingId] });
    } catch (err) {
      toast.error("Failed to remove guest from event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setSelectedEventId("");
    setOpen(nextOpen);
  };

  return (
    <div className="border-t border-gray-100 bg-muted/30">
      <div className="px-4 py-3">
        <div className="mb-2 pl-4 sm:pl-8">
          <ResponsiveDialog open={open} onOpenChange={handleOpenChange}>
            <ResponsiveDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                disabled={isEventsLoading || availableEvents.length === 0}
              >
                Add to Event
              </Button>
            </ResponsiveDialogTrigger>
            <ResponsiveDialogContent className="sm:max-w-md">
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle className="text-center text-lg font-semibold tracking-tight">
                  Add to Event
                </ResponsiveDialogTitle>
                <ResponsiveDialogDescription className="text-center">
                  Select an event to add this guest to
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>

              <div className="space-y-4">
                <Select
                  value={selectedEventId}
                  onValueChange={setSelectedEventId}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isEventsLoading
                          ? "Loading events..."
                          : availableEvents.length === 0
                            ? "No available events"
                            : "Choose an event..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 z-[10000]">
                    {availableEvents.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAdd}
                    disabled={!selectedEventId || isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "Adding..." : "Add"}
                  </Button>
                </div>
              </div>
            </ResponsiveDialogContent>
          </ResponsiveDialog>

          {!isEventsLoading && availableEvents.length === 0 ? (
            <div className="mt-2 text-xs text-muted-foreground">
              Guest is already in all events
            </div>
          ) : null}
        </div>

        <div className="pl-4 sm:pl-8 space-y-1">
          {additionalEvents.length === 0 ? (
            <div className="py-1 px-2 text-xs text-muted-foreground">
              No events assigned
            </div>
          ) : (
            additionalEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-2 py-1 px-2">
                <span className="text-xs font-medium">
                  {event.name}: 
                </span>
                {getRSVPStatusBadge(event.rsvpStatus)}
                <RemoveFromEventDialog
                  eventId={event.id}
                  eventName={event.name}
                  onRemove={() => handleRemove(event.id, event.name)}
                  disabled={isSubmitting}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function RemoveFromEventDialog({
  eventId,
  eventName,
  onRemove,
  disabled,
}: {
  eventId: string;
  eventName: string;
  onRemove: () => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
          disabled={disabled}
        >
          <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} className="h-3 w-3" />
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="text-center text-lg font-semibold tracking-tight">
            Remove from Event
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription className="text-center">
            Are you sure you want to remove this guest from "{eventName}"?
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <HugeiconsIcon
                icon={Delete01Icon}
                strokeWidth={2}
                className="h-5 w-5 text-red-500 mt-0.5"
              />
              <div>
                <p className="text-sm font-medium text-red-800">
                  This action cannot be undone
                </p>
                <p className="text-sm text-red-600 mt-1">
                  The guest will lose their RSVP status and any attendance records for this event.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={disabled}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onRemove();
              setOpen(false);
            }}
            disabled={disabled}
            className="flex-1"
          >
            Remove
          </Button>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
