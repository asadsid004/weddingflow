import { Logo } from "@/components/logo";
import { AuthForm } from "@/components/auth/auth-form";

export const Navbar = () => {
  return (
    <nav className="border-muted-foreground/30 border-b">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          <Logo href="/" />
          <AuthForm />
        </div>
      </div>
    </nav>
  );
};
