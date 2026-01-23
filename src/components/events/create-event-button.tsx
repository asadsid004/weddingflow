import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/revola";
import { CreateEventForm } from "./create-event-form";
import { Button } from "../ui/button";

import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";

export const CreateEventButton = ({ weddingId }: { weddingId: string }) => {
  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <Button>
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          Create Event
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="max-h-[calc(100vh-10rem)] overflow-y-auto sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="text-center text-lg font-semibold tracking-tight">
            Create Event
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription className="text-center">
            Add a ceremony, or celebration to your wedding timeline
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <CreateEventForm weddingId={weddingId} />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
