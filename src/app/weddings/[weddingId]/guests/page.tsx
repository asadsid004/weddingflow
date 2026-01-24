import { SidebarInset } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/weddings/sidebar/app-header";
import { GuestsList } from "@/components/guests/guests-list";

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
        <div className="mb-8 space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Manage Guests
          </h1>
          <p className="text-muted-foreground text-sm">
            Add and manage your wedding guest list and invitations.
          </p>
        </div>
        <GuestsList weddingId={weddingId} />
      </div>
    </SidebarInset>
  );
}

