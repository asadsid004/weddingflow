import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpDownIcon,
  ArrowUp02Icon,
  ArrowDown02Icon,
} from "@hugeicons/core-free-icons";
import { EditExpenseButton } from "./edit-expense-button";
import { ExpenseDeleteButton } from "./delete-expense";
import { ExpenseCategory } from "@/db/schema";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

export type Expense = {
  id: string;
  description: string;
  amount: number;
  eventId: string;
  eventName: string;
  date: string;
  weddingId: string;
  category: ExpenseCategory;
};

const categoryColorMap: Record<string, string> = {
  "Venue & Rentals":
    "bg-indigo-100/50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-400/30",
  "Food & Beverage":
    "bg-amber-100/50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-400/30",
  "Photography & Video":
    "bg-purple-100/50 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-400/30",
  "Music & Entertainment":
    "bg-pink-100/50 text-pink-700 border-pink-200 dark:bg-pink-500/20 dark:text-pink-300 dark:border-pink-400/30",
  "Decor & Flowers":
    "bg-rose-100/50 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-400/30",
  "Attire & Beauty":
    "bg-teal-100/50 text-teal-700 border-teal-200 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-400/30",
  "Stationery & Favors":
    "bg-orange-100/50 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-400/30",
  Transportation:
    "bg-blue-100/50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-400/30",
  "Planning & Officiant":
    "bg-emerald-100/50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-400/30",
  "Cake & Desserts":
    "bg-fuchsia-100/50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-500/20 dark:text-fuchsia-300 dark:border-fuchsia-400/30",
  Rings:
    "bg-cyan-100/50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-400/30",
  Miscellaneous:
    "bg-slate-100/50 text-slate-700 border-slate-200 dark:bg-slate-500/20 dark:text-slate-300 dark:border-slate-400/30",
};

export const createExpenseColumns = (): ColumnDef<Expense>[] => [
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="font-medium text-wrap">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 h-8"
        >
          Amount
          {column.getIsSorted() === "asc" ? (
            <HugeiconsIcon icon={ArrowUp02Icon} className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <HugeiconsIcon icon={ArrowDown02Icon} className="ml-2 h-4 w-4" />
          ) : (
            <HugeiconsIcon icon={ArrowUpDownIcon} className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
      return <div className="font-medium">{formatted} L</div>;
    },
  },
  {
    accessorKey: "eventName",
    header: "Event",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm text-wrap">
        {row.original.eventName}
      </div>
    ),
  },
  {
    accessorKey: "eventId",
    header: () => null,
    cell: () => null,
    enableHiding: true,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 h-8"
        >
          Date
          {column.getIsSorted() === "asc" ? (
            <HugeiconsIcon icon={ArrowUp02Icon} className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <HugeiconsIcon icon={ArrowDown02Icon} className="ml-2 h-4 w-4" />
          ) : (
            <HugeiconsIcon icon={ArrowUpDownIcon} className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-sm">
          {new Date(row.getValue("date")).toLocaleDateString("en-GB")}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 h-8"
        >
          Category
          {column.getIsSorted() === "asc" ? (
            <HugeiconsIcon icon={ArrowUp02Icon} className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <HugeiconsIcon icon={ArrowDown02Icon} className="ml-2 h-4 w-4" />
          ) : (
            <HugeiconsIcon icon={ArrowUpDownIcon} className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = row.original.category as string;
      const colorClass =
        categoryColorMap[category] || categoryColorMap["Miscellaneous"];
      return (
        <Badge
          variant="outline"
          className={cn(
            "rounded-md border px-2 py-3 text-xs font-semibold text-wrap",
            colorClass,
          )}
        >
          {category}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const expense = row.original;
      return (
        <div className="flex items-center gap-2">
          <EditExpenseButton
            expenseId={expense.id}
            weddingId={expense.weddingId}
            expense={{
              description: expense.description,
              amount: expense.amount.toString(),
              date: expense.date,
              eventId: expense.eventId,
              category: expense.category,
            }}
          />
          <ExpenseDeleteButton
            expenseId={expense.id}
            weddingId={expense.weddingId}
          />
        </div>
      );
    },
  },
];
