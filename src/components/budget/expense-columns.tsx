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

export type Expense = {
  id: string;
  description: string;
  amount: number;
  eventId: string;
  eventName: string;
  date: string;
  weddingId: string;
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
        {row.getValue("eventName")}
      </div>
    ),
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
