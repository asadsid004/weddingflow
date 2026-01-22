"use client";

import { getWeddings } from "@/actions/weddings";
import { useQuery } from "@tanstack/react-query";
import { EmptyState } from "./empty-state";
import { WeddingCard } from "./wedding-card";
import { WeddingCardSkeleton } from "./wedding-card-skeleton";

export const WeddingsList = () => {
  const { data: weddings, isLoading } = useQuery({
    queryKey: ["weddings"],
    queryFn: () => getWeddings(),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 py-10 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <WeddingCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!weddings?.length) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 gap-4 py-10 sm:grid-cols-2 md:grid-cols-3">
      {weddings.map((data) => {
        return <WeddingCard key={data.id} {...data} />;
      })}
    </div>
  );
};
