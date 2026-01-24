"use client";

import { useState, useMemo, useOptimistic, startTransition } from "react";
import { getWeddingGuests } from "@/actions/guests";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { GuestsFilter } from "./guests-filter";
import { EmptyState } from "./empty-state";
import { GuestItem } from "./guest-item";

interface Guest {
  id: string;
  weddingId: string;
  name: string;
  email: string;
  phoneNumber: string;
  plusOnes: number;
  createdAt: Date;
  updatedAt: Date;
}

export function GuestsList({ weddingId }: { weddingId: string }) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: guests, isLoading } = useQuery({
    queryKey: ["guests", weddingId],
    queryFn: () => getWeddingGuests(weddingId),
  });

  const [optimisticGuests, addOptimisticGuest] = useOptimistic(
    guests || [],
    (currentGuests, newGuest: Guest) => [...currentGuests, newGuest]
  );

  const filteredGuests = useMemo(() => {
    const guestsToFilter = optimisticGuests;
    return guestsToFilter.filter((guest) =>
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [optimisticGuests, searchQuery]);

  const hasActiveFilters = searchQuery !== "";

  const handleReset = () => {
    setSearchQuery("");
  };

  const handleOptimisticAdd = (newGuest: Guest) => {
    startTransition(() => {
      addOptimisticGuest(newGuest);
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="w-full flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="w-full sm:w-auto">
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="w-full sm:w-auto">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GuestsFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
        weddingId={weddingId}
        onOptimisticAdd={handleOptimisticAdd}
      />

      {filteredGuests && filteredGuests.length > 0 ? (
        <div className="space-y-2">
          {filteredGuests.map((guest) => (
            <GuestItem key={guest.id} guest={guest} weddingId={weddingId} />
          ))}
        </div>
      ) : (
        <EmptyState hasFilters={hasActiveFilters} onReset={handleReset} />
      )}
    </div>
  );
}
