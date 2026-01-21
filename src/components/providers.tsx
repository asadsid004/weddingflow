import { Toaster } from "sonner";

import { QueryProvider } from "./query-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Toaster richColors closeButton />
      <QueryProvider>{children}</QueryProvider>
    </div>
  );
};
