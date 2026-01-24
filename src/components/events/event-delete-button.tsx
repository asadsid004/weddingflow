"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { deleteEvent } from "@/actions/events";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../ui/revola";
import { HugeiconsIcon } from "@hugeicons/react";

export function EventDeleteButton({
  eventId,
  weddingId,
}: {
  eventId: string;
  weddingId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteEvent(eventId),
    onSuccess: () => {
      toast.success("Event deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["events", weddingId],
      });
      setOpen(false);
      router.push(`/weddings/${weddingId}/events`);
    },
    onError: () => {
      toast.error("Failed to delete event");
    },
  });

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
          Delete Event
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="sm:max-w-sm">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="text-center">
            Delete Event
          </ResponsiveDialogTitle>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to delete this event? This action cannot be
            undone.
          </p>
        </ResponsiveDialogHeader>
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteMutate()}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Event"
            )}
          </Button>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
