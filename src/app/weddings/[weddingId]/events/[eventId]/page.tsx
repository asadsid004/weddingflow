import { EventDetails } from "@/components/events/event-details";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/weddings/sidebar/app-header";

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ eventId: string; weddingId: string }>;
}) => {
  const { eventId, weddingId } = await params;

  return (
    <SidebarInset>
      <AppHeader
        breadcrumbs={[
          { label: "Events", href: `/weddings/${weddingId}/events` },
          { label: "Details" },
        ]}
      />
      <div className="mx-auto w-full max-w-7xl">
        <EventDetails eventId={eventId} weddingId={weddingId} />
      </div>
    </SidebarInset>
  );
};

export default EventDetailsPage;
