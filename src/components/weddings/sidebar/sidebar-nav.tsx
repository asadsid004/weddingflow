"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams, usePathname } from "next/navigation";
import {
  Calendar02Icon,
  CheckListIcon,
  DashboardSquare01Icon,
  Money03Icon,
  Settings01Icon,
  Store02Icon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

export function NavMain() {
  const params = useParams();
  const pathname = usePathname();

  const weddingId = params.weddingId;

  const items = [
    {
      groupTitle: "Overview",
      subItems: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: DashboardSquare01Icon,
        },
      ],
    },
    {
      groupTitle: "Planning",
      subItems: [
        {
          title: "Events",
          url: "/events",
          icon: Calendar02Icon,
        },
        {
          title: "Tasks",
          url: "/tasks",
          icon: CheckListIcon,
        },
      ],
    },
    {
      groupTitle: "People",
      subItems: [
        {
          title: "Guests",
          url: "/guests",
          icon: UserMultiple02Icon,
        },
        {
          title: "Vendors",
          url: "/vendors",
          icon: Store02Icon,
        },
      ],
    },
    {
      groupTitle: "Finances",
      subItems: [
        {
          title: "Budget",
          url: "/budget",
          icon: Money03Icon,
        },
      ],
    },
    {
      groupTitle: "Setup",
      subItems: [
        {
          title: "Settings",
          url: "/settings",
          icon: Settings01Icon,
        },
      ],
    },
  ];

  return (
    <div>
      {items.map((item) => (
        <SidebarGroup key={item.groupTitle}>
          <SidebarGroupLabel>{item.groupTitle}</SidebarGroupLabel>
          <SidebarMenu>
            {item.subItems.map((subItem) => {
              const fullUrl = `/weddings/${weddingId}${subItem.url}`;
              const isActive =
                pathname === fullUrl || pathname.startsWith(`${fullUrl}/`);

              return (
                <SidebarMenuItem key={subItem.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={subItem.title}
                    isActive={isActive}
                  >
                    <Link href={fullUrl}>
                      <HugeiconsIcon icon={subItem.icon} strokeWidth={2} />
                      <span className="font-medium">{subItem.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </div>
  );
}
