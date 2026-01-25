import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  Mail01Icon,
  TickDouble01Icon,
  Call02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";
import { AddGuestButton } from "./add-guest-button";

export const EmptyGuestsState = ({ weddingId }: { weddingId: string }) => {
  return (
    <div className="animate-in fade-in zoom-in flex min-h-[45vh] flex-col items-center justify-center space-y-6 py-10 text-center duration-500">
      <div className="flex h-16 w-16 items-center justify-center rounded-md bg-rose-100 dark:bg-rose-900">
        <HugeiconsIcon
          icon={UserGroupIcon}
          strokeWidth={2}
          className="h-8 w-8 text-rose-600 dark:text-rose-200"
        />
      </div>

      <h2 className="text-2xl font-semibold tracking-tight">No Guests Yet</h2>

      <p className="text-muted-foreground max-w-md">
        Start building your guest list by adding friends and family. Track
        invitations, contact details, and RSVP status all in one place.
      </p>

      <Button asChild size="lg" className="px-8">
        <AddGuestButton weddingId={weddingId} />
      </Button>

      <div className="text-muted-foreground flex flex-wrap justify-center gap-6 text-sm">
        <span className="flex items-center gap-2">
          <HugeiconsIcon icon={Mail01Icon} className="h-4 w-4" />
          Invitations
        </span>
        <span className="flex items-center gap-2">
          <HugeiconsIcon icon={TickDouble01Icon} className="h-4 w-4" />
          RSVP Tracking
        </span>
        <span className="flex items-center gap-2">
          <HugeiconsIcon
            icon={Call02Icon}
            strokeWidth={2}
            className="h-4 w-4"
          />
          Contact Info
        </span>
      </div>
    </div>
  );
};
