"use client";

import { useQuery } from "@tanstack/react-query";
import { getEventGuests } from "@/actions/guests";
import { Card, CardContent } from "../ui/card";
import {
  UserGroupIcon,
  CheckmarkCircle02Icon,
  CancelCircleIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Skeleton } from "../ui/skeleton";

interface GuestOverviewCardProps {
  weddingId: string;
  eventId: string;
}

export const GuestOverviewCard = ({
  weddingId,
  eventId,
}: GuestOverviewCardProps) => {
  const { data: guests, isLoading } = useQuery({
    queryKey: ["event-guests", weddingId, eventId],
    queryFn: () => getEventGuests(weddingId, eventId),
  });

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full rounded-md" />;
  }

  const totalGuests = guests?.length || 0;

  const stats = guests?.reduce(
    (acc, guest) => {
      const eventStatus = guest.events.find((e) => e.eventId === eventId)?.rsvp;
      if (eventStatus === "accepted") acc.accepted++;
      else if (eventStatus === "declined") acc.declined++;
      else acc.pending++;
      return acc;
    },
    { accepted: 0, declined: 0, pending: 0 },
  ) || { accepted: 0, declined: 0, pending: 0 };

  const acceptedPercentage =
    totalGuests > 0 ? Math.round((stats.accepted / totalGuests) * 100) : 0;

  return (
    <Card className="rounded-md">
      <CardContent>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">
          Guest Overview
        </h2>
        <div className="space-y-2">
          <Metric
            label="Total Invited"
            icon={
              <HugeiconsIcon
                icon={UserGroupIcon}
                strokeWidth={2}
                className="h-5 w-5"
              />
            }
            value={totalGuests}
          />
          <div className="space-y-2">
            <MiniMetric
              label="Accepted"
              icon={
                <HugeiconsIcon
                  strokeWidth={2}
                  icon={CheckmarkCircle02Icon}
                  size={16}
                  className="text-green-600"
                />
              }
              value={stats.accepted}
              color="text-green-600"
            />
            <MiniMetric
              label="Pending"
              icon={
                <HugeiconsIcon
                  strokeWidth={2}
                  icon={Clock01Icon}
                  size={16}
                  className="text-amber-600"
                />
              }
              value={stats.pending}
              color="text-amber-600"
            />
            <MiniMetric
              label="Declined"
              icon={
                <HugeiconsIcon
                  strokeWidth={2}
                  icon={CancelCircleIcon}
                  size={16}
                  className="text-destructive"
                />
              }
              value={stats.declined}
              color="text-destructive"
            />
          </div>

          <div className="mt-4 space-y-2">
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>RSVP Progress</span>
              <span>{acceptedPercentage}% Accepted</span>
            </div>
            <div className="bg-muted h-2 overflow-hidden rounded-full">
              <div
                className="bg-primary h-full transition-all"
                style={{ width: `${acceptedPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Metric = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <div className="bg-background">
    <div className="text-muted-foreground flex items-center gap-2 text-xs tracking-wide uppercase">
      {icon}
      <span>{label}</span>
    </div>
    <div className="mt-1 text-lg font-semibold">{value}</div>
  </div>
);

const MiniMetric = ({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className="bg-muted/50 flex items-center justify-between rounded-lg p-2">
    <div className="mb-1 flex items-center gap-1">
      {icon}
      <span className="text-muted-foreground text-xs font-medium uppercase">
        {label}
      </span>
    </div>
    <div className={`text-sm font-bold ${color}`}>{value}</div>
  </div>
);
