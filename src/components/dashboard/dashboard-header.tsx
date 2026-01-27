"use client";

import { useQuery } from "@tanstack/react-query";
import { getWeddingById } from "@/actions/weddings";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

export const DashboardHeader = ({ weddingId }: { weddingId: string }) => {
  const { data: wedding, isLoading } = useQuery({
    queryKey: ["wedding", weddingId],
    queryFn: () => getWeddingById(weddingId),
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    );
  }
  if (!wedding || wedding.length === 0)
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground mt-20 flex items-center gap-2 text-center text-xl">
          <HugeiconsIcon
            icon={Alert02Icon}
            strokeWidth={2}
            className="size-5"
          />{" "}
          Wedding not found
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/weddings">
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              strokeWidth={2}
              className="size-4"
            />{" "}
            Back to Weddings
          </Link>
        </Button>
      </div>
    );

  const weddingData = wedding[0];
  const weddingDate = new Date(weddingData.weddingDate);
  const now = new Date();
  const diffTime = weddingDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const dayName = weddingDate.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight">{weddingData.name}</h1>
      <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <span>{formatDate(weddingDate)}</span>
        <span>•</span>
        <span>{dayName}</span>
        <span>•</span>
        <span className="text-foreground font-medium">
          {diffDays > 0
            ? `${diffDays} days to go`
            : diffDays === 0
              ? "Today is the big day!"
              : "A beautiful memory"}
        </span>
      </div>
    </div>
  );
};
