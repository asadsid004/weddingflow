"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useOptimistic, startTransition } from "react";
import { toggleBookmark } from "@/actions/vendors";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Bookmark02Icon,
  Call02Icon,
  Location05Icon,
  Mail01Icon,
  RupeeIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { useQueryClient } from "@tanstack/react-query";

interface Vendor {
  id: string;
  name: string;
  category: string;
  description: string | null;
  location: string;
  priceMin: string | null;
  priceMax: string | null;
  rating: string | null;
  imageUrl: string | null;
  email: string | null;
  phone: string | null;
}

interface VendorCardProps {
  vendor: Vendor;
  initialIsBookmarked: boolean;
  weddingId: string;
}

export function VendorCard({
  vendor,
  initialIsBookmarked,
  weddingId,
}: VendorCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  const queryClient = useQueryClient();

  const [optimisticBookmarked, setOptimisticBookmarked] =
    useOptimistic(isBookmarked);

  const handleBookmark = async () => {
    const next = !optimisticBookmarked;

    startTransition(() => {
      setOptimisticBookmarked(next);
    });

    try {
      const res = await toggleBookmark(weddingId, vendor.id);
      setIsBookmarked(res.bookmarked);
      queryClient.invalidateQueries({ queryKey: ["bookmarks", weddingId] });
      toast.success(res.bookmarked ? "Vendor bookmarked" : "Bookmark removed");
    } catch {
      setOptimisticBookmarked(!next);
      toast.error("Failed to update bookmark");
    }
  };

  return (
    <Card className="group relative rounded-md py-0 hover:shadow-md">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={vendor.imageUrl!}
          alt={vendor.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={handleBookmark}
          className={cn(
            "bg-background/80 absolute top-3 right-3 z-10 h-8 w-8 rounded-md backdrop-blur",
            optimisticBookmarked ? "text-primary" : "text-muted-foreground",
          )}
        >
          <HugeiconsIcon
            icon={Bookmark02Icon}
            strokeWidth={optimisticBookmarked ? 1 : 2}
            className={cn(
              "h-4 w-4 transition-all",
              optimisticBookmarked && "scale-110 fill-current",
            )}
          />
        </Button>
        <Badge className="bg-background text-primary absolute top-3 left-3 rounded-md text-xs opacity-90 backdrop-blur">
          {vendor.category}
        </Badge>
      </div>
      <div className="-mt-2 space-y-4 px-4 pb-4">
        <div className="space-y-1">
          <h3 className="line-clamp-1 text-lg font-semibold transition-colors">
            {vendor.name}
          </h3>
          <div className="flex items-start justify-between gap-2">
            {vendor.location && (
              <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <HugeiconsIcon icon={Location05Icon} className="h-3.5 w-3.5" />
                {vendor.location}
              </div>
            )}
            {vendor.rating && (
              <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                <HugeiconsIcon
                  icon={StarIcon}
                  className="h-3 w-3 fill-current"
                />
                {vendor.rating}
              </div>
            )}
          </div>
        </div>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {vendor.description}
        </p>
        <div className="border-border/50 bg-muted/40 space-y-2 rounded-md border p-3 text-sm">
          <p className="text-muted-foreground text-sm">Price Range</p>
          {vendor.priceMin && vendor.priceMax && (
            <div className="flex items-center gap-1.5 font-medium">
              <HugeiconsIcon
                icon={RupeeIcon}
                className="text-muted-foreground h-4 w-4"
              />
              {vendor.priceMin} – {vendor.priceMax}
            </div>
          )}
        </div>
        <div className="border-border/50 bg-muted/40 space-y-2 rounded-md border p-3 text-sm">
          <p className="text-muted-foreground text-sm">Contact Info</p>
          {vendor.email && (
            <div className="flex items-center gap-1.5 font-medium">
              <HugeiconsIcon
                icon={Mail01Icon}
                className="text-muted-foreground h-4 w-4"
              />
              {vendor.email}
            </div>
          )}
          {vendor.phone && (
            <div className="flex items-center gap-1.5 font-medium">
              <HugeiconsIcon
                icon={Call02Icon}
                className="text-muted-foreground h-4 w-4"
              />
              {vendor.phone}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
