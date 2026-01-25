"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../ui/revola";
import { AddTaskForm } from "./add-task-form";

export const AddTaskButton = ({ weddingId }: { weddingId: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button variant="default">
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          Add Task
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="text-center">
            Add Task
          </ResponsiveDialogTitle>
          <p className="text-muted-foreground text-center text-sm">
            Add a new task to your wedding
          </p>
        </ResponsiveDialogHeader>
        <div className="py-4">
          <AddTaskForm weddingId={weddingId} setOpen={setOpen} />
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
