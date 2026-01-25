import { SettingsForm } from "@/components/settings/settings-form";
import { WeddingDeleteButton } from "@/components/settings/wedding-delete-button";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/weddings/sidebar/app-header";

const SettingsPage = async ({
  params,
}: {
  params: Promise<{ weddingId: string }>;
}) => {
  const { weddingId } = await params;

  return (
    <SidebarInset>
      <AppHeader breadcrumbs={[{ label: "Settings" }]} />
      <div className="mx-auto w-full max-w-7xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
            <p className="text-muted-foreground text-sm">
              Manage your wedding settings here.
            </p>
          </div>
          <WeddingDeleteButton weddingId={weddingId} />
        </div>
        <div className="mt-4">
          <SettingsForm weddingId={weddingId} />
        </div>
      </div>
    </SidebarInset>
  );
};

export default SettingsPage;
