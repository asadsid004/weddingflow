"use client";

import {
  AlarmClockIcon,
  Calendar02Icon,
  ChartColumnIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card, CardContent } from "../ui/card";
import { EventDeleteButton } from "./event-delete-button";

export const EventOverviewCard = ({
  event,
}: {
  event: {
    id: string;
    weddingId: string;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
  };
}) => {
  const daysRemaining = Math.ceil(
    (new Date(event.date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{event.name}</h1>
        <EventDeleteButton eventId={event.id} weddingId={event.weddingId} />
      </div>

      <Card className="rounded-md sm:max-w-fit">
        <CardContent>
          <div className="flex flex-row justify-between sm:flex-col">
            <Metric
              label="Days Remaining"
              icon={
                <HugeiconsIcon
                  icon={ChartColumnIcon}
                  strokeWidth={2}
                  className="h-5 w-5"
                />
              }
              value={daysRemaining}
              isUrgent={daysRemaining <= 7}
            />

            <Metric
              label="Event Date"
              icon={
                <HugeiconsIcon
                  icon={Calendar02Icon}
                  strokeWidth={2}
                  className="h-5 w-5"
                />
              }
              value={new Date(event.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            />
          </div>
          <Metric
            label="Event Time"
            icon={
              <HugeiconsIcon
                icon={AlarmClockIcon}
                strokeWidth={2}
                className="h-5 w-5"
              />
            }
            value={`${event.startTime} – ${event.endTime}`}
          />
        </CardContent>
      </Card>
    </div>
  );
};

const Metric = ({
  label,
  value,
  icon,
  isUrgent,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  isUrgent?: boolean;
}) => {
  return (
    <div className="bg-background py-2">
      <div className="text-muted-foreground flex items-center gap-2 text-xs tracking-wide uppercase">
        {icon}
        <span>{label}</span>
      </div>

      <div
        className={`mt-1 text-lg font-semibold ${
          isUrgent ? "text-destructive" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
};
