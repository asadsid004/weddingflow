import { Toaster } from "sonner";

import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme/theme-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster richColors closeButton />
        <QueryProvider>{children}</QueryProvider>
      </ThemeProvider>
    </div>
  );
};