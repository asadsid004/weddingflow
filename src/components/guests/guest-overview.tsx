"use client";

import { getWeddingGuests } from "@/actions/guests";
import { getEvents } from "@/actions/events";
import {
  UserGroupIcon,
  TickDouble01Icon,
  ArrowRight02Icon,
  Calendar03Icon,
  Mail01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const GuestOverview = ({ weddingId }: { weddingId: string }) => {
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
      <div className="mt-4 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-32 rounded-md" />
          <Skeleton className="h-32 rounded-md" />
          <Skeleton className="h-32 rounded-md" />
        </div>
        <Skeleton className="h-12 rounded-md" />
        <Skeleton className="h-8 w-32 rounded-md" />
        <Skeleton className="h-24 rounded-md" />
        <Skeleton className="h-24 rounded-md" />
      </div>
    );
  }

  const totalGuestsCount = guests?.length || 0;
  const totalInvitedIncludingPlusOnes =
    guests?.reduce((acc, guest) => acc + 1 + (guest.plusOnes || 0), 0) || 0;

  // Global RSVP counts (calculating based on "accepted at least one" or "all pending" is tricky,
  // so let's focus on the breakdown per event which is more accurate now)

  const eventStats =
    events?.map((event) => {
      let accepted = 0;
      let pending = 0;
      let declined = 0;
      let totalInvited = 0;

      guests?.forEach((guest) => {
        const guestEvent = guest.events?.find((e) => e.eventId === event.id);
        if (guestEvent) {
          const count = 1 + (guest.plusOnes || 0);
          totalInvited += count;
          if (guestEvent.rsvp === "accepted") accepted += count;
          else if (guestEvent.rsvp === "declined") declined += count;
          else pending += count;
        }
      });

      const percentage = totalInvited > 0 ? (accepted / totalInvited) * 100 : 0;

      return {
        id: event.id,
        name: event.name,
        totalInvited,
        accepted,
        pending,
        declined,
        percentage,
      };
    }) || [];

  // Summary stats (across all events - taking the max or union might be better but let's simple)
  // Let's define "Confirmed" as people who accepted at least one event.
  const confirmedGuestsCount =
    guests?.reduce((acc, guest) => {
      const hasAcceptedAny = guest.events?.some((e) => e.rsvp === "accepted");
      return acc + (hasAcceptedAny ? 1 + guest.plusOnes : 0);
    }, 0) || 0;

  const getRsvpStatus = (percentage: number) => {
    if (percentage === 100)
      return { color: "text-green-600", label: "Fully Confirmed" };
    if (percentage >= 75)
      return { color: "text-blue-600", label: "Mostly Confirmed" };
    if (percentage >= 50)
      return { color: "text-yellow-600", label: "Halfway There" };
    if (percentage >= 25)
      return { color: "text-orange-600", label: "Response Started" };
    return { color: "text-muted-foreground", label: "Waiting for Responses" };
  };

  const overallConfirmedPercentage =
    totalInvitedIncludingPlusOnes > 0
      ? (confirmedGuestsCount / totalInvitedIncludingPlusOnes) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Guests Overview Cards */}
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total Invited */}
          <div className="rounded-md border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1 text-sm">
                  Total Invited
                </p>
                <p className="text-2xl font-bold">
                  {totalInvitedIncludingPlusOnes}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {totalGuestsCount} main guests
                </p>
              </div>
              <div className="rounded-md bg-blue-100 p-3 dark:bg-blue-900">
                <HugeiconsIcon
                  icon={UserGroupIcon}
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>

          {/* Confirmed */}
          <div className="rounded-md border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1 text-sm">
                  Confirmed{" "}
                  <Tooltip>
                    <TooltipTrigger>
                      <HugeiconsIcon
                        icon={InformationCircleIcon}
                        strokeWidth={2}
                        className="h-4 w-4 translate-y-1"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        Confirmed guests have accepted at least one event.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {confirmedGuestsCount}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {overallConfirmedPercentage.toFixed(0)}% attendance
                </p>
              </div>
              <div className="rounded-md bg-green-100 p-3 dark:bg-green-900">
                <HugeiconsIcon
                  icon={TickDouble01Icon}
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>

          {/* Pending / No Response */}
          <div className="rounded-md border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1 text-sm">
                  Need Response
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {totalInvitedIncludingPlusOnes - confirmedGuestsCount}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Awaiting RSVPs
                </p>
              </div>
              <div className="rounded-md bg-orange-100 p-3 dark:bg-orange-900">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  className="h-6 w-6 text-orange-600 dark:text-orange-400"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-4 w-full rounded-md border p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">
              Overall RSVP Confirmed
              <Tooltip>
                <TooltipTrigger>
                  <HugeiconsIcon
                    icon={InformationCircleIcon}
                    strokeWidth={2}
                    className="ml-1 h-4 w-4 translate-y-1"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    Confirmed guests have accepted at least one event.
                  </p>
                </TooltipContent>
              </Tooltip>
            </span>
            <span
              className={`text-sm font-semibold ${getRsvpStatus(overallConfirmedPercentage).color}`}
            >
              {overallConfirmedPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={overallConfirmedPercentage} className="h-2 border" />
        </div>
      </div>

      {/* Guests by Event */}
      {eventStats.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Attendance by Event</h2>
          <div className="space-y-3">
            {eventStats.map((event) => {
              const status = getRsvpStatus(event.percentage);
              return (
                <div
                  key={event.id}
                  className="rounded-md border p-4 transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <HugeiconsIcon
                          icon={Calendar03Icon}
                          className="text-muted-foreground h-4 w-4 shrink-0"
                        />
                        <h3 className="truncate font-semibold">{event.name}</h3>
                      </div>
                      <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                        <span className="whitespace-nowrap">
                          {event.totalInvited} invited
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="whitespace-nowrap text-green-600">
                          {event.accepted} accepted
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="whitespace-nowrap text-orange-600">
                          {event.pending} pending
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="whitespace-nowrap text-red-600">
                          {event.declined} declined
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0"
                      asChild
                    >
                      <Link href={`/weddings/${weddingId}/events/${event.id}`}>
                        <span className="hidden sm:inline">Details</span>
                        <HugeiconsIcon
                          icon={ArrowRight02Icon}
                          className="size-4"
                          strokeWidth={2}
                        />
                      </Link>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {event.accepted} confirmed of {event.totalInvited}
                      </span>
                      <span className={`font-semibold ${status.color}`}>
                        {event.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={event.percentage} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
