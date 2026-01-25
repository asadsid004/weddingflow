import { SidebarInset } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/weddings/sidebar/app-header";
import { AddGuestButton } from "@/components/guests/add-guest-button";
import { GuestOverview } from "@/components/guests/guest-overview";

export default async function GuestsPage({
  params,
}: {
  params: Promise<{ weddingId: string }>;
}) {
  const { weddingId } = await params;

  return (
    <SidebarInset>
      <AppHeader breadcrumbs={[{ label: "Guests" }]} />
      <div className="mx-auto w-full max-w-7xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">
            Manage Guests
          </h1>
          <AddGuestButton weddingId={weddingId} />
        </div>
        <GuestOverview weddingId={weddingId} />
      </div>
    </SidebarInset>
  );
}
