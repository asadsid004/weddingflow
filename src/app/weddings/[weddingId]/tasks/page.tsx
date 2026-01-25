import { AddTaskButton } from "@/components/tasks/add-task-button";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/weddings/sidebar/app-header";
import React from "react";

const TasksPage = async ({
  params,
}: {
  params: Promise<{ weddingId: string }>;
}) => {
  const { weddingId } = await params;

  return (
    <SidebarInset>
      <AppHeader breadcrumbs={[{ label: "Tasks" }]} />
      <div className="mx-auto w-full max-w-7xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
          <AddTaskButton weddingId={weddingId} />
        </div>
      </div>
    </SidebarInset>
  );
};

export default TasksPage;
