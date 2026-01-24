import { SidebarInset } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/weddings/sidebar/app-header";
import { VendorsList } from "@/components/vendors/vendors-list";

export default async function VendorsPage({
  params,
}: {
  params: Promise<{ weddingId: string }>;
}) {
  const { weddingId } = await params;

  return (
    <SidebarInset>
      <AppHeader breadcrumbs={[{ label: "Vendors" }]} />
      <div className="mx-auto w-full max-w-7xl p-4">
        <div className="mb-8 space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Find Vendors
          </h1>
          <p className="text-muted-foreground text-sm">
            Discover and bookmark the best professionals for your special day.
          </p>
        </div>
        <VendorsList weddingId={weddingId} />
      </div>
    </SidebarInset>
  );
}
