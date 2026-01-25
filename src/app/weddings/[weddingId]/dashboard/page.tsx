import React from "react";

import { SidebarInset } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/weddings/sidebar/app-header";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardView } from "@/components/dashboard/dashboard-view";

const DashboardPage = async ({
  params,
}: {
  params: Promise<{ weddingId: string }>;
}) => {
  const { weddingId } = await params;

  return (
    <SidebarInset>
      <AppHeader breadcrumbs={[{ label: "Dashboard" }]} />
      <div className="mx-auto w-full max-w-7xl space-y-8 p-6">
        <DashboardHeader weddingId={weddingId} />
        <DashboardView weddingId={weddingId} />
      </div>
    </SidebarInset>
  );
};

export default DashboardPage;
