"use client";

import { useQuery } from "@tanstack/react-query";
import { getWeddingGuests } from "@/actions/guests";
import { getEvents } from "@/actions/events";
import { GuestsTable } from "./guests-table";
import { createGuestColumns } from "./guest-columns";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";
import { AddGuestButton } from "./add-guest-button";

export const GuestsList = ({
  weddingId,
  eventId,
}: {
  weddingId: string;
  eventId?: string;
}) => {
  const [selectedEvent, setSelectedEvent] = useState(eventId || "all");

  const { data: guests, isLoading: guestsLoading } = useQuery({
    queryKey: ["guests", weddingId],
    queryFn: () => getWeddingGuests(weddingId),
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["events", weddingId],
    queryFn: () => getEvents(weddingId),
  });

  if (guestsLoading || eventsLoading) {
    return (
      <div className="my-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-auto sm:w-52" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const columns = createGuestColumns(weddingId, selectedEvent);

  return (
    <div className="my-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Guest List</h2>
          <p className="text-muted-foreground text-sm">
            Manage your invitations and track RSVPs
          </p>
        </div>
        <AddGuestButton weddingId={weddingId} eventId={eventId} />
      </div>

      <GuestsTable
        columns={columns}
        data={guests || []}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        events={events?.map((e) => ({ id: e.id, name: e.name }))}
      />
    </div>
  );
};
