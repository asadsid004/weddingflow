"use client";

import { useState } from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/revola";
import { AddGuestForm } from "./add-guest-form";
import { Button } from "../ui/button";

import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";

interface AddGuestButtonProps {
  weddingId: string;
  onOptimisticAdd?: (guest: {
    id: string;
    weddingId: string;
    name: string;
    email: string;
    phoneNumber: string;
    plusOnes: number;
    createdAt: Date;
    updatedAt: Date;
  }) => void;
}

export const AddGuestButton = ({ weddingId, onOptimisticAdd }: AddGuestButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="mr-2" />
          Add Guest
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="max-h-[calc(100vh-10rem)] overflow-y-auto sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="text-center text-lg font-semibold tracking-tight">
            Add Guest
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription className="text-center">
            Add a new guest to your wedding guest list
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <AddGuestForm weddingId={weddingId} onSuccess={handleSuccess} onOptimisticAdd={onOptimisticAdd} />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
