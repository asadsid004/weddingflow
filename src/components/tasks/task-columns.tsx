import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpDownIcon,
  ArrowUp02Icon,
  ArrowDown02Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { EditTaskButton } from "./edit-task-button";
import { TaskDeleteButton } from "./delete-task-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate: string;
  eventId: string | null;
  eventName: string;
  weddingId: string;
};

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800",
  medium:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-800",
  high: "bg-destructive/20 text-destructive border-destructive/30",
};

const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1,
};

export const createTaskColumns = (
  onToggleComplete: (taskId: string, completed: boolean) => void,
): ColumnDef<Task>[] => [
  {
    id: "completed",
    header: "",
    cell: ({ row }) => {
      const task = row.original;
      return (
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) =>
            onToggleComplete(task.id, checked as boolean)
          }
          aria-label="Mark task as complete"
        />
      );
    },
  },
  {
    accessorKey: "title",
    header: "Task",
    cell: ({ row }) => (
      <div
        className={`font-medium text-wrap ${
          row.original.completed ? "text-muted-foreground line-through" : ""
        }`}
      >
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "priority",
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const priorityA = rowA.original.priority as "low" | "medium" | "high";
      const priorityB = rowB.original.priority as "low" | "medium" | "high";

      return priorityOrder[priorityA] - priorityOrder[priorityB];
    },
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8"
      >
        Priority
        {column.getIsSorted() === "asc" ? (
          <HugeiconsIcon icon={ArrowUp02Icon} className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <HugeiconsIcon icon={ArrowDown02Icon} className="ml-2 h-4 w-4" />
        ) : (
          <HugeiconsIcon icon={ArrowUpDownIcon} className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      const priority = row.getValue("priority") as "low" | "medium" | "high";
      return (
        <Badge
          variant="outline"
          className={`${priorityColors[priority]} font-medium`}
        >
          {priorityLabels[priority]}
        </Badge>
      );
    },
  },

  {
    accessorKey: "eventName",
    header: "Event",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm text-wrap">
        {row.getValue("eventName")}
      </div>
    ),
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 h-8"
        >
          Due Date
          {column.getIsSorted() === "asc" ? (
            <HugeiconsIcon
              icon={ArrowUp02Icon}
              strokeWidth={2}
              className="ml-2 h-4 w-4"
            />
          ) : column.getIsSorted() === "desc" ? (
            <HugeiconsIcon
              icon={ArrowDown02Icon}
              strokeWidth={2}
              className="ml-2 h-4 w-4"
            />
          ) : (
            <HugeiconsIcon
              icon={ArrowUpDownIcon}
              strokeWidth={2}
              className="ml-2 h-4 w-4"
            />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueDate = new Date(row.getValue("dueDate"));
      dueDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isOverdue = dueDate < today && !row.original.completed;
      const isDueToday =
        dueDate.getTime() === today.getTime() && !row.original.completed;
      const isDueSoon =
        dueDate > today &&
        dueDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) &&
        !row.original.completed;

      return (
        <div
          className={`text-sm text-wrap ${
            isOverdue
              ? "text-destructive font-semibold"
              : isDueToday
                ? "font-semibold text-emerald-600 dark:text-emerald-400"
                : isDueSoon
                  ? "font-medium text-amber-600 dark:text-amber-400"
                  : ""
          }`}
        >
          {dueDate.toLocaleDateString("en-GB")}
          {isOverdue && <span className="ml-1 text-xs">(Overdue)</span>}
          {isDueToday && <span className="ml-1 text-xs">(Due Today)</span>}
          {isDueSoon && <span className="ml-1 text-xs">(Due Soon)</span>}
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const task = row.original;
      return task.completed ? (
        <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            strokeWidth={2}
            className="h-4 w-4"
          />
          <span>Complete</span>
        </div>
      ) : (
        <div className="text-muted-foreground dark:text-muted-foreground flex items-center gap-1 text-sm">
          <HugeiconsIcon
            icon={Cancel01Icon}
            strokeWidth={2}
            className="h-4 w-4"
          />
          <span>Pending</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const task = row.original;
      return (
        <div className="flex items-center gap-2">
          <EditTaskButton
            weddingId={task.weddingId}
            task={{
              id: task.id,
              title: task.title,
              priority: task.priority,
              dueDate: task.dueDate,
              eventId: task.eventId!,
            }}
          />
          <TaskDeleteButton taskId={task.id} weddingId={task.weddingId} />
        </div>
      );
    },
  },
];
