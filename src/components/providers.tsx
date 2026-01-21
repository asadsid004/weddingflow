import { Toaster } from "sonner";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Toaster richColors closeButton />
      {children}
    </div>
  );
};
