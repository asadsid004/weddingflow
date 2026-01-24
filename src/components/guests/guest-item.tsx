"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useOptimistic, startTransition } from "react";
import { deleteGuest } from "@/actions/guests";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  EyeIcon,
  Edit03Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";
import { useQueryClient } from "@tanstack/react-query";

interface Guest {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  plusOnes: number;
}

interface GuestItemProps {
  guest: Guest;
  weddingId: string;
}

export function GuestItem({ guest, weddingId }: GuestItemProps) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const [optimisticGuests, addOptimisticGuest] = useOptimistic(
    { guests: [], guestId: "" },
    (state, newGuestId: string) => ({
      guests: state.guests.filter((g: Guest) => g.id !== newGuestId),
      guestId: newGuestId,
    })
  );

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this guest?")) return;

    startTransition(() => {
      setIsDeleting(true);
      addOptimisticGuest(guest.id);
    });

    try {
      await deleteGuest(guest.id);
      toast.success("Guest deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["guests", weddingId] });
    } catch (error) {
      toast.error("Failed to delete guest");
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-between rounded-md border p-4 transition-opacity ${
        isDeleting ? "opacity-50" : ""
      }`}
    >
      <div className="flex-1">
        <p className="font-medium">{guest.name}</p>
        <p className="text-sm text-muted-foreground">{guest.email}</p>
        <p className="text-sm text-muted-foreground">{guest.phoneNumber}</p>
        <p className="text-sm text-muted-foreground">
          Plus Ones: {guest.plusOnes}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <HugeiconsIcon icon={EyeIcon} strokeWidth={2} className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <HugeiconsIcon icon={Edit03Icon} strokeWidth={2} className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
