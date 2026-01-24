import { CreateEventButton } from "@/components/events/create-event-button";
import { EventLists } from "@/components/events/events-list";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/weddings/sidebar/app-header";

const EventsPage = async ({
  params,
}: {
  params: Promise<{ weddingId: string }>;
}) => {
  const { weddingId } = await params;

  return (
    <SidebarInset>
      <AppHeader breadcrumbs={[{ label: "Events" }]} />
      <div className="mx-auto w-full max-w-7xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Your Events</h1>
          <CreateEventButton weddingId={weddingId} />
        </div>
        <div className="mt-4">
          <EventLists weddingId={weddingId} />
        </div>
      </div>
    </SidebarInset>
  );
};

export default EventsPage;
