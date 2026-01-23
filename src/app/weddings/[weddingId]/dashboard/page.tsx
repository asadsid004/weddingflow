import React from "react";

import { SidebarInset } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/weddings/sidebar/app-header";

const DashboardPage = async ({
  params,
}: {
  params: Promise<{ weddingId: string }>;
}) => {
  const { weddingId } = await params;

  return (
    <SidebarInset>
      <AppHeader breadcrumbs={[{ label: "Dashboard" }]} />
      <div className="flex-1 overflow-y-auto p-4">
        <h1>Wedding: {weddingId}</h1>
      </div>
    </SidebarInset>
  );
};

export default DashboardPage;
