import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/actions/events";
import { getWeddingById } from "@/actions/weddings";
import { Edit04Icon, Money01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { EditBudgetForm } from "./edit-budget-form";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export const EventBudgetCard = ({
  currentEventId,
  weddingId,
}: {
  currentEventId: string;
  weddingId: string;
}) => {
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString("en-IN")}`;
  };

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["events", weddingId],
    queryFn: () => getEvents(weddingId),
  });

  const { data: wedding, isLoading: weddingLoading } = useQuery({
    queryKey: ["wedding", weddingId],
    queryFn: () => getWeddingById(weddingId),
  });

  if (eventsLoading || weddingLoading) {
    return (
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold">
            <HugeiconsIcon
              icon={Money01Icon}
              strokeWidth={2}
              className="h-5 w-5"
            />
            Budget Information (₹ Lakhs)
          </h2>
          <Button disabled variant="outline">
            <HugeiconsIcon
              icon={Edit04Icon}
              strokeWidth={2}
              className="h-4 w-4"
            />
            Edit Budget
          </Button>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    );
  }

  const totalWeddingBudget = Number(wedding?.[0].totalBudget || 0);

  const allEvents = events?.map((e) => ({
    id: e.id,
    allocatedBudget: Number(e.allocatedBudget || 0),
  }));

  const currentEventBudget =
    allEvents?.find((e) => e.id === currentEventId)?.allocatedBudget || 0;

  const otherEventsAllocated = allEvents
    ? allEvents
        .filter((e) => e.id !== currentEventId)
        .reduce((sum, e) => sum + e.allocatedBudget, 0)
    : 0;

  const totalAllocated = otherEventsAllocated + currentEventBudget;
  const remainingBudgetForAllocation =
    totalWeddingBudget - otherEventsAllocated;

  const finalRemaining = totalWeddingBudget - totalAllocated;

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold">
          <HugeiconsIcon
            icon={Money01Icon}
            strokeWidth={2}
            className="h-5 w-5"
          />
          Budget Information (₹ Lakhs)
        </h2>
        <EditBudgetForm
          currentEventBudget={currentEventBudget}
          currentTotalBudget={totalWeddingBudget}
          eventId={currentEventId}
          weddingId={weddingId}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Total Wedding Budget
          </span>
          <span className="font-semibold">
            {formatCurrency(totalWeddingBudget)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Allocated to Other Events
          </span>
          <span className="font-medium text-orange-500">
            {formatCurrency(otherEventsAllocated)}
          </span>
        </div>
        <div className="bg-border h-px" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Available for This Event</span>
          <span className="font-semibold text-blue-500">
            {formatCurrency(remainingBudgetForAllocation)}
          </span>
        </div>
        {currentEventBudget > 0 && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Currently Allocated to This Event
              </span>
              <span className="font-medium text-blue-500">
                {formatCurrency(currentEventBudget)}
              </span>
            </div>
            <div className="bg-border h-px" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Final Remaining Budget
              </span>
              <span
                className={`font-semibold ${
                  finalRemaining >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {formatCurrency(finalRemaining)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
