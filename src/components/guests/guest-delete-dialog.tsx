"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/revola";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon } from "@hugeicons/core-free-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteGuest } from "@/actions/guests";

interface Guest {
  id: string;
  name: string;
}

interface GuestDeleteDialogProps {
  guest: Guest;
  weddingId: string;
}

export function GuestDeleteDialog({ guest, weddingId }: GuestDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteGuest(guest.id),
    onSuccess: () => {
      toast.success("Guest deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["guests", weddingId],
      });
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete guest");
    },
  });

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive h-7 w-7 p-0"
          disabled={isDeleting}
        >
          <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} className="h-3.5 w-3.5" />
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="sm:max-w-sm">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="text-center">
            Delete Guest
          </ResponsiveDialogTitle>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to delete {guest.name}? This action cannot be
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
              "Delete Guest"
            )}
          </Button>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
