import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowUpRight03Icon,
  Calendar02Icon,
  Clock03Icon,
  AlarmClockIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import Link from "next/link";

export const EventCard = ({
  id,
  name,
  date,
  startTime,
  endTime,
  weddingId,
}: {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  weddingId: string;
}) => {
  const daysLeft = Math.ceil(
    (new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <Card className="rounded-md transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">
          {name}
        </CardTitle>
        <CardDescription>
          <div className="flex items-center gap-1">
            <HugeiconsIcon icon={Calendar02Icon} size={20} />
            {new Date(date).toLocaleDateString("en-GB", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="bg-muted flex items-center justify-between rounded-md p-2">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={Clock03Icon}
              strokeWidth={2}
              className="h-4 w-4"
            />
            <span>Days Left</span>
          </div>
          <div className="font-medium">{daysLeft}</div>
        </div>
        <div className="bg-muted flex items-center justify-between rounded-md p-2">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={AlarmClockIcon}
              strokeWidth={2}
              className="h-4 w-4"
            />
            <span>Time</span>
          </div>
          <div className="font-medium">
            {startTime} - {endTime}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/weddings/${weddingId}/events/${id}`}>
            Continue Planning
            <HugeiconsIcon icon={ArrowUpRight03Icon} />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
