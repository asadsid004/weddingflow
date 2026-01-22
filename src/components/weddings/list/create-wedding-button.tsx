import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/revola";
import { WeddingForm } from "./wedding-form";

type CreateWeddingButton = {
  title?: string;
  className?: string;
  icon?: boolean;
};

export const CreateWeddingButton = ({
  title = "Add Wedding",
  className,
  icon,
}: CreateWeddingButton) => {
  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <Button className={className}>
          {icon && <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />}
          {title}
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="max-h-[calc(100vh-10rem)]">
        <div className="space-y-4 overflow-y-auto">
          <ResponsiveDialogHeader className="sm:text-center">
            <ResponsiveDialogTitle>Start Planning</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Create your wedding to manage all the details in one place.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <WeddingForm />
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
