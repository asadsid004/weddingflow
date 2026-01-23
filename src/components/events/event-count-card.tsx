"use client";

import { useQuery } from "@tanstack/react-query";

import { getEvents } from "@/actions/events";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChartColumnIcon } from "@hugeicons/core-free-icons";
import { Skeleton } from "@/components/ui/skeleton";

export const EventCountCard = ({ weddingId }: { weddingId: string }) => {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events", weddingId],
    queryFn: () => getEvents(weddingId),
  });

  if (isLoading) {
    return (
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon
              icon={ChartColumnIcon}
              strokeWidth={2}
              className="size-5"
            />
            Total Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon
            icon={ChartColumnIcon}
            strokeWidth={2}
            className="size-5"
          />
          Total Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{events?.length}</p>
      </CardContent>
    </Card>
  );
};
