import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpDownIcon,
  ArrowUp02Icon,
  ArrowDown02Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { GuestEditDialog } from "./guest-edit-dialog";
import { GuestDeleteDialog } from "./guest-delete-dialog";

export type Guest = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  plusOnes: number;
  events: {
    eventId: string;
    rsvp: "pending" | "accepted" | "declined";
  }[];
  weddingId: string;
};

const rsvpColors = {
  pending:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-800",
  accepted:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800",
  declined: "bg-destructive/20 text-destructive border-destructive/30",
};

const rsvpLabels = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
};

export const createGuestColumns = (
  weddingId: string,
  selectedEventId?: string,
): ColumnDef<Guest>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8"
      >
        Name
        {column.getIsSorted() === "asc" ? (
          <HugeiconsIcon icon={ArrowUp02Icon} className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <HugeiconsIcon icon={ArrowDown02Icon} className="ml-2 h-4 w-4" />
        ) : (
          <HugeiconsIcon icon={ArrowUpDownIcon} className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-wrap">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8"
      >
        Email
        {column.getIsSorted() === "asc" ? (
          <HugeiconsIcon icon={ArrowUp02Icon} className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <HugeiconsIcon icon={ArrowDown02Icon} className="ml-2 h-4 w-4" />
        ) : (
          <HugeiconsIcon icon={ArrowUpDownIcon} className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm break-all whitespace-normal">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {row.getValue("phoneNumber")}
      </div>
    ),
  },
  {
    accessorKey: "plusOnes",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8"
      >
        Guests
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
      const total = 1 + (row.original.plusOnes || 0);
      return (
        <div className="text-sm">
          {total} {total === 1 ? "person" : "people"}
          {row.original.plusOnes > 0 && (
            <span className="text-muted-foreground ml-1 text-xs">
              (+{row.original.plusOnes})
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "rsvp",
    accessorKey: "events",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8"
      >
        RSVP
        {column.getIsSorted() === "asc" ? (
          <HugeiconsIcon icon={ArrowUp02Icon} className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <HugeiconsIcon icon={ArrowDown02Icon} className="ml-2 h-4 w-4" />
        ) : (
          <HugeiconsIcon icon={ArrowUpDownIcon} className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    sortingFn: (rowA, rowB) => {
      const guestA = rowA.original;
      const guestB = rowB.original;

      if (selectedEventId && selectedEventId !== "all") {
        const rsvpA =
          guestA.events.find((e) => e.eventId === selectedEventId)?.rsvp ||
          "pending";
        const rsvpB =
          guestB.events.find((e) => e.eventId === selectedEventId)?.rsvp ||
          "pending";
        const order = { accepted: 3, pending: 2, declined: 1 };
        return order[rsvpA] - order[rsvpB];
      }

      const acceptedA = guestA.events.filter(
        (e) => e.rsvp === "accepted",
      ).length;
      const acceptedB = guestB.events.filter(
        (e) => e.rsvp === "accepted",
      ).length;
      return acceptedA - acceptedB;
    },
    cell: ({ row }) => {
      const guest = row.original;

      if (selectedEventId && selectedEventId !== "all") {
        const guestEvent = guest.events.find(
          (e) => e.eventId === selectedEventId,
        );
        const rsvp = guestEvent?.rsvp || "pending";
        return (
          <Badge
            variant="outline"
            className={`${rsvpColors[rsvp]} font-medium`}
          >
            {rsvpLabels[rsvp]}
          </Badge>
        );
      }

      const acceptedCount = guest.events.filter(
        (e) => e.rsvp === "accepted",
      ).length;
      const totalEvents = guest.events.length;

      if (totalEvents === 0)
        return <span className="text-muted-foreground text-xs">No events</span>;

      return (
        <div className="flex flex-col gap-1">
          <div className="text-xs font-medium">
            {acceptedCount}/{totalEvents} Accepted
          </div>
          <div className="flex gap-1">
            {guest.events.slice(0, 3).map((e, i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  e.rsvp === "accepted"
                    ? "bg-green-500"
                    : e.rsvp === "declined"
                      ? "bg-red-500"
                      : "bg-amber-500"
                }`}
              />
            ))}
            {totalEvents > 3 && (
              <span className="text-muted-foreground text-[8px]">...</span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const guest = row.original;
      return (
        <div className="flex items-center gap-2">
          <GuestEditDialog weddingId={weddingId} guest={guest} />
          <GuestDeleteDialog guest={guest} weddingId={weddingId} />
        </div>
      );
    },
  },
];
