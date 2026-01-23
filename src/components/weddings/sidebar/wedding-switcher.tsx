"use client";

import { useParams, useRouter } from "next/navigation";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpDownIcon,
  FavouriteIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

type Wedding = {
  id: string;
  name: string;
  weddingDate: string;
};

export function WeddingSwitcher({ weddings }: { weddings: Wedding[] }) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const params = useParams();

  const activeWedding =
    weddings.find((w) => w.id === params.weddingId) ?? weddings[0];

  if (!activeWedding) return null;

  return (
    <SidebarMenu className="pt-2">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={FavouriteIcon} strokeWidth={2} />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeWedding.name}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {activeWedding.weddingDate}
                </span>
              </div>

              <HugeiconsIcon icon={ArrowUpDownIcon} strokeWidth={2} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
            className="min-w-56 rounded-lg"
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Weddings
            </DropdownMenuLabel>

            {weddings.map((wedding) => {
              const isActive = wedding.id === activeWedding.id;

              return (
                <DropdownMenuItem
                  key={wedding.id}
                  className={`flex items-center gap-2 p-2 ${isActive ? "bg-muted font-medium" : ""} `}
                  onClick={() => {
                    if (!isActive) {
                      router.push(`/weddings/${wedding.id}/dashboard`);
                    }
                  }}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <HugeiconsIcon
                      icon={FavouriteIcon}
                      strokeWidth={2}
                      className="hover:text-primary-foreground"
                    />
                  </div>

                  <span className="flex-1 truncate">{wedding.name}</span>

                  {isActive && (
                    <span className="text-muted-foreground text-xs">
                      Active
                    </span>
                  )}
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild className="flex items-center gap-2 p-2">
              <Link href="/weddings">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
                </div>
                <span className="text-muted-foreground font-medium">
                  Create wedding
                </span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
