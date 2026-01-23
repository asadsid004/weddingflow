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
  Money03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import Link from "next/link";

export const WeddingCard = ({
  id,
  name,
  weddingDate,
  totalBudget,
}: {
  id: string;
  name: string;
  weddingDate: string;
  totalBudget: string | null;
}) => {
  const daysLeft = Math.ceil(
    (new Date(weddingDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <Card className="rounded-md transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">
          {name}&apos;s Wedding
        </CardTitle>
        <CardDescription>
          <div className="flex items-center gap-1">
            <HugeiconsIcon icon={Calendar02Icon} size={20} />
            {new Date(weddingDate).toLocaleDateString("en-GB", {
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
              icon={Money03Icon}
              strokeWidth={2}
              className="h-4 w-4"
            />
            <span>Budget (₹ Lakhs)</span>
          </div>
          <div className="font-medium">{totalBudget}</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/weddings/${id}/dashboard`}>
            Continue Planning
            <HugeiconsIcon icon={ArrowUpRight03Icon} />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
