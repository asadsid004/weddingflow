import { AddExpenseButton } from "@/components/budget/add-expense-button";
import { BudgetOverview } from "@/components/budget/budget-overview";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/weddings/sidebar/app-header";

const BudgetPage = async ({
  params,
}: {
  params: Promise<{ weddingId: string }>;
}) => {
  const { weddingId } = await params;

  return (
    <SidebarInset>
      <AppHeader breadcrumbs={[{ label: "Budget" }]} />
      <div className="mx-auto w-full max-w-7xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Budget</h1>
          <AddExpenseButton weddingId={weddingId} />
        </div>
        <BudgetOverview weddingId={weddingId} />
      </div>
    </SidebarInset>
  );
};

export default BudgetPage;
