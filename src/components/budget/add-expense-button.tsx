"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../ui/revola";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { AddExpenseForm } from "./add-expense-form";

export const AddExpenseButton = ({
  weddingId,
  initialEventId,
}: {
  weddingId: string;
  initialEventId?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button>
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          Add Expense
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="text-center">
            Add Expense
          </ResponsiveDialogTitle>
          <p className="text-muted-foreground text-center text-sm">
            Add a new expense to your budget.
          </p>
        </ResponsiveDialogHeader>
        <div className="py-4">
          <AddExpenseForm
            weddingId={weddingId}
            setOpen={setOpen}
            initialEventId={initialEventId}
          />
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
