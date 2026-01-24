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
      <div className="mx-auto w-full max-w-7xl p-4">
        <h1>Wedding: {weddingId}</h1>
      </div>
    </SidebarInset>
  );
};

export default DashboardPage;
