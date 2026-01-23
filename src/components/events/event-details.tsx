"use client";

import { getEventById, getEvents } from "@/actions/events";
import { useQuery } from "@tanstack/react-query";
import { EventOverviewCard } from "./event-overview";
import { EventDetailsEditable } from "./event-details-editable";
import { getWeddingById } from "@/actions/weddings";

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

  const { data: wedding } = useQuery({
    queryKey: ["wedding", weddingId],
    queryFn: () => getWeddingById(weddingId),
  });

  const { data: events } = useQuery({
    queryKey: ["events", weddingId],
    queryFn: () => getEvents(weddingId),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
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
        }}
      />
      <EventDetailsEditable
        event={{
          ...event,
          startTime: event.startTime!,
          endTime: event.endTime!,
          venue: event.venue || "",
          venueAddress: event.venueAddress || "",
          allocatedBudget: Number(event.allocatedBudget),
        }}
        totalWeddingBudget={Number(wedding?.[0].totalBudget || 0)}
        weddingId={weddingId}
        allEvents={events?.map((e) => ({
          id: e.id,
          allocatedBudget: Number(e.allocatedBudget || 0),
        }))}
        currentEventId={eventId}
      />
    </div>
  );
};
