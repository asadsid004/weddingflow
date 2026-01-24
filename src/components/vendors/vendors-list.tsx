"use client";

import { useState, useMemo } from "react";
import { VendorCard } from "./vendor-card";
import { VendorsFilter } from "./vendors-filter";
import { EmptyState } from "./empty-state";
import { getVendors, getWeddingBookmarks } from "@/actions/vendors";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";

export function VendorsList({ weddingId }: { weddingId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const { data: vendors, isLoading: isLoadingVendors } = useQuery({
    queryKey: ["vendors", weddingId],
    queryFn: () => getVendors(),
  });

  const { data: initialBookmarksIds, isLoading: isLoadingBookmarks } = useQuery(
    {
      queryKey: ["bookmarks", weddingId],
      queryFn: () => getWeddingBookmarks(weddingId),
    },
  );

  const categories = useMemo(() => {
    const cats = new Set(vendors?.map((v) => v.category));
    return Array.from(cats).sort();
  }, [vendors]);

  const filteredVendors = useMemo(() => {
    return vendors?.filter((vendor) => {
      const matchesSearch =
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vendor.description &&
          vendor.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        category === "all" || vendor.category === category;

      const matchesBookmark =
        !showBookmarksOnly || initialBookmarksIds?.includes(vendor.id);

      return matchesSearch && matchesCategory && matchesBookmark;
    });
  }, [vendors, searchQuery, category, showBookmarksOnly, initialBookmarksIds]);

  const hasActiveFilters =
    searchQuery !== "" || category !== "all" || showBookmarksOnly;

  if (isLoadingVendors || isLoadingBookmarks) {
    return (
      <div>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="w-full flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="w-full sm:w-auto">
            <Skeleton className="h-10 w-full sm:w-[180px]" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Skeleton className="h-128 w-full" />
          <Skeleton className="h-128 w-full" />
          <Skeleton className="h-128 w-full" />
          <Skeleton className="h-128 w-full" />
          <Skeleton className="h-128 w-full" />
          <Skeleton className="h-128 w-full" />
        </div>
      </div>
    );
  }

  const handleReset = () => {
    setSearchQuery("");
    setCategory("all");
    setShowBookmarksOnly(false);
  };

  return (
    <div className="space-y-6">
      <VendorsFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        category={category}
        setCategory={setCategory}
        categories={categories}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
        showBookmarksOnly={showBookmarksOnly}
        setShowBookmarksOnly={setShowBookmarksOnly}
      />

      {filteredVendors!.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredVendors!.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              initialIsBookmarked={initialBookmarksIds!.includes(vendor.id)}
              weddingId={weddingId}
            />
          ))}
        </div>
      ) : (
        <EmptyState hasFilters={hasActiveFilters} onReset={handleReset} />
      )}
    </div>
  );
}
