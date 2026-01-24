import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Location01Icon,
  Cash01Icon,
  TickDouble01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { CreateEventButton } from "./create-event-button";

export const EmptyEventsState = ({ weddingId }: { weddingId: string }) => {
  return (
    <div className="animate-in fade-in zoom-in flex min-h-[45vh] flex-col items-center justify-center space-y-6 py-10 text-center duration-500">
      <div className="flex h-16 w-16 items-center justify-center rounded-md bg-rose-100 dark:bg-rose-900">
        <HugeiconsIcon
          icon={Calendar03Icon}
          strokeWidth={2}
          className="h-8 w-8 text-rose-600 dark:text-rose-200"
        />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight">No Events Yet</h2>

      <p className="text-muted-foreground max-w-md">
        Create your first event to start planning the timeline for your special
        day. Add ceremonies, receptions, and celebrations with all the details.
      </p>

      <Button asChild size="lg" className="px-8">
        <CreateEventButton weddingId={weddingId} />
      </Button>

      <div className="text-muted-foreground flex flex-wrap justify-center gap-6 text-sm">
        <span className="flex items-center gap-2">
          <HugeiconsIcon icon={Calendar03Icon} className="h-4 w-4" />
          Date & Time
        </span>
        <span className="flex items-center gap-2">
          <HugeiconsIcon icon={Location01Icon} className="h-4 w-4" />
          Venue
        </span>
        <span className="flex items-center gap-2">
          <HugeiconsIcon icon={Cash01Icon} /> Budget
        </span>
        <span className="flex items-center gap-2">
          <HugeiconsIcon icon={TickDouble01Icon} /> Tasks
        </span>
      </div>
    </div>
  );
};
