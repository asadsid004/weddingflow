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
}

export const AddGuestButton = ({ weddingId }: AddGuestButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
          Add Guest
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="flex max-h-[90vh] flex-col sm:max-w-md">
        <ResponsiveDialogHeader className="">
          <ResponsiveDialogTitle className="text-center text-lg font-semibold tracking-tight">
            Add Guest
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription className="text-center">
            Add a new guest to your wedding guest list
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className="scrollbar-thin flex-1 overflow-y-auto p-4 sm:p-0">
          <AddGuestForm weddingId={weddingId} setOpen={setOpen} />
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
