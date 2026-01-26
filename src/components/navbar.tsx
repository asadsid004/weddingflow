import { Logo } from "@/components/logo";
import { AuthForm } from "@/components/auth/auth-form";
import { ThemeToggle } from "./theme/theme-toggle";

export const Navbar = () => {
  return (
    <nav className="border-muted-foreground/30 border-b">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          <Logo href="/" />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <AuthForm />
          </div>
        </div>
      </div>
    </nav>
  );
};