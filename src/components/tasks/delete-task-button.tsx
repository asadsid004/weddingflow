"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../ui/revola";
import { HugeiconsIcon } from "@hugeicons/react";
import { deleteTask } from "@/actions/tasks";

export function TaskDeleteButton({
  taskId,
  weddingId,
}: {
  taskId: string;
  weddingId: string;
}) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteTask(taskId),
    onSuccess: () => {
      toast.success("Task deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["tasks", weddingId],
      });
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-destructive hover:text-destructive h-8 w-8 p-0"
          size="sm"
        >
          <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="sm:max-w-sm">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="text-center">
            Delete Task
          </ResponsiveDialogTitle>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to delete this task? This action cannot be
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
              "Delete Task"
            )}
          </Button>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
