import { CreateWeddingButton } from "@/components/weddings/list/create-wedding-button";
import { Navbar } from "@/components/weddings/list/navbar";
import { WeddingsList } from "@/components/weddings/list/weddings-list";

const WeddingsPage = async () => {
  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Your Weddings
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and plan all your weddings from one place
            </p>
          </div>
          <CreateWeddingButton icon={true} />
        </div>
        <WeddingsList />
      </div>
    </div>
  );
};

export default WeddingsPage;
