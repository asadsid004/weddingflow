"use client";

import { useQuery } from "@tanstack/react-query";

import { getEvents } from "@/actions/events";

import { HugeiconsIcon } from "@hugeicons/react";
import { ChartColumnIcon } from "@hugeicons/core-free-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyEventsState } from "./empty-state";
import { EventCard } from "./event-card";
import { WeddingCardSkeleton } from "../weddings/list/wedding-card-skeleton";

export const EventLists = ({ weddingId }: { weddingId: string }) => {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events", weddingId],
    queryFn: () => getEvents(weddingId),
  });

  if (isLoading) {
    return (
      <div className="rounded-md">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-md" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <WeddingCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return <EmptyEventsState weddingId={weddingId} />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <HugeiconsIcon
          icon={ChartColumnIcon}
          strokeWidth={2}
          className="size-4"
        />
        Total Events:
        <p className="font-bold">{events.length}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            {...event}
            startTime={event.startTime!}
            endTime={event.endTime!}
          />
        ))}
      </div>
    </div>
  );
};
