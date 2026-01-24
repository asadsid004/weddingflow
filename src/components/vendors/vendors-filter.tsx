"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Cancel01Icon,
  Search01Icon,
  Bookmark02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface VendorsFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  category: string;
  setCategory: (category: string) => void;
  categories: string[];
  onReset: () => void;
  hasActiveFilters: boolean;
  showBookmarksOnly: boolean;
  setShowBookmarksOnly: (show: boolean) => void;
}

export function VendorsFilter({
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  categories,
  onReset,
  hasActiveFilters,
  showBookmarksOnly,
  setShowBookmarksOnly,
}: VendorsFilterProps) {
  return (
    <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative w-full flex-1">
        <HugeiconsIcon
          icon={Search01Icon}
          strokeWidth={2}
          className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
        />
        <Input
          placeholder="Search by name, location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-background w-full pl-9"
        />
      </div>
      <div className="flex w-full gap-2 sm:w-auto">
        <Button
          variant={showBookmarksOnly ? "default" : "outline"}
          className="px-4"
          onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
        >
          <HugeiconsIcon
            icon={Bookmark02Icon}
            strokeWidth={2}
            className="h-4 w-4"
          />
          My Bookmarks
        </Button>
        <div className="flex w-full gap-2 sm:w-auto">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-background w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
    </div>
  );
}
