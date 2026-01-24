"use client";

import { getEventById } from "@/actions/events";
import { useQuery } from "@tanstack/react-query";
import { EventOverviewCard } from "./event-overview";
import { EventDetailsEditable } from "./event-details-editable";
import { Skeleton } from "../ui/skeleton";

export const EventDetails = ({
  eventId,
  weddingId,
}: {
  eventId: string;
  weddingId: string;
}) => {
  const { data: event, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEventById(eventId),
  });

  if (isLoading) {
    return (
      <div className="space-y-4 px-6 py-4">
        <Skeleton className="h-[30vh] w-full" />
        <Skeleton className="h-[50vh] w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="px-6 pt-20 text-center text-2xl">Event not found</div>
    );
  }

  return (
    <div className="px-6 py-4">
      <EventOverviewCard
        event={{
          id: event.id,
          weddingId: event.weddingId,
          name: event.name,
          date: event.date,
          startTime: event.startTime!,
          endTime: event.endTime!,
          allocatedBudget: Number(event.allocatedBudget) || 0,
        }}
      />
      <EventDetailsEditable
        event={{
          ...event,
          startTime: event.startTime!,
          endTime: event.endTime!,
          venue: event.venue || "",
          venueAddress: event.venueAddress || "",
        }}
        weddingId={weddingId}
      />
    </div>
  );
};
