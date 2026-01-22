import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cash01Icon,
  HeartAddIcon,
  Store02Icon,
  TickDouble01Icon,
  UserLove01Icon,
} from "@hugeicons/core-free-icons";
import { CreateWeddingButton } from "./create-wedding-button";

export const EmptyState = () => {
  return (
    <div className="animate-in fade-in zoom-in flex min-h-[45vh] flex-col items-center justify-center space-y-6 py-10 text-center duration-500">
      <div className="flex h-16 w-16 items-center justify-center rounded-md bg-rose-100 dark:bg-rose-900">
        <HugeiconsIcon
          icon={HeartAddIcon}
          strokeWidth={2}
          className="h-8 w-8 text-rose-600 dark:text-rose-200"
        />
      </div>

      <h2 className="text-2xl font-semibold tracking-tight">
        Start Planning Your Wedding
      </h2>

      <p className="text-muted-foreground max-w-md">
        Create your first wedding and manage guests, vendors, budgets, and tasks
        — all beautifully organized in one place.
      </p>

      <CreateWeddingButton title="Create My Wedding" className="px-8" />

      <div className="text-muted-foreground flex flex-wrap justify-center gap-6">
        <span className="flex items-center gap-2">
          <HugeiconsIcon icon={UserLove01Icon} />
          Guests
        </span>
        <span className="flex items-center gap-2">
          <HugeiconsIcon icon={Cash01Icon} /> Budget
        </span>
        <span className="flex items-center gap-2">
          <HugeiconsIcon icon={Store02Icon} /> Vendors
        </span>
        <span className="flex items-center gap-2">
          <HugeiconsIcon icon={TickDouble01Icon} /> Tasks
        </span>
      </div>
    </div>
  );
};
