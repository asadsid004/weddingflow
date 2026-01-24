"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Cancel01Icon,
  Search01Icon,
  FilterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddGuestButton } from "./add-guest-button";

interface GuestsFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
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

export function GuestsFilter({
  searchQuery,
  setSearchQuery,
  onReset,
  hasActiveFilters,
  weddingId,
  onOptimisticAdd,
}: GuestsFilterProps) {
  return (
    <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative w-full flex-1">
        <HugeiconsIcon
          icon={Search01Icon}
          strokeWidth={2}
          className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
        />
        <Input
          placeholder="Search by name, email, phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-background w-full pl-9"
        />
      </div>
      <div className="flex w-full gap-2 sm:w-auto">
        <Button variant="outline" className="px-4">
          <HugeiconsIcon
            icon={FilterIcon}
            strokeWidth={2}
            className="h-4 w-4 mr-2"
          />
          Filter
        </Button>
        <AddGuestButton weddingId={weddingId} onOptimisticAdd={onOptimisticAdd} />
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            title="Clear Filters"
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              strokeWidth={2}
              className="h-4 w-4"
            />
          </Button>
        )}
      </div>
    </div>
  );
}
