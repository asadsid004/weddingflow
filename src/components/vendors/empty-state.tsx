import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search02Icon } from "@hugeicons/core-free-icons";

interface EmptyStateProps {
  hasFilters: boolean;
  onReset: () => void;
}

export function EmptyState({ hasFilters, onReset }: EmptyStateProps) {
  return (
    <div className="border-border/50 bg-muted/20 flex min-h-[400px] flex-col items-center justify-center rounded-md border-2 border-dashed p-8 text-center">
      <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-md">
        <HugeiconsIcon
          icon={Search02Icon}
          strokeWidth={2}
          className="h-8 w-8"
        />
      </div>
      <h3 className="mb-2 text-lg font-semibold">No vendors found</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {hasFilters
          ? "We couldn't find any vendors matching your search filters. Try adjusting your criteria."
          : "There are no vendors available at the moment."}
      </p>
      {hasFilters && (
        <Button
          onClick={onReset}
          className="text-sm font-medium hover:underline"
        >
          Clear all filters
        </Button>
      )}
    </div>
  );
}
