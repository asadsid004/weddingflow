import { AuthForm } from "@/components/auth/auth-form";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden">
      <Navbar />
      <div className="mx-auto flex h-full max-w-2xl flex-1 flex-col items-center justify-center px-4">
        <div className="border-primary/10 bg-primary/5 text-primary mb-8 inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium backdrop-blur-sm">
          <span className="mr-2">💍</span> Smart wedding planning made simple
        </div>
        <h1 className="text-center text-4xl font-light tracking-tight">
          Plan Your Wedding.
          <span className="block text-5xl font-semibold italic md:text-6xl">
            Without the Chaos.
          </span>
        </h1>
        <p className="text-muted-foreground my-8 text-center text-lg">
          Manage guests, events, vendors, tasks, and budgets seamlessly - all in
          one modern wedding management platform.
        </p>
        <AuthForm title="Start Planning" />
      </div>
    </main>
  );
}
