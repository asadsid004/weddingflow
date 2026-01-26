import { AuthForm } from "@/components/auth/auth-form";
import Features from "@/components/landing/features";
import { Logo } from "@/components/logo";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main className="relative flex flex-col overflow-hidden">
      <Navbar />
      <div className="mx-auto flex h-full max-w-2xl flex-1 flex-col items-center justify-center px-4 pt-32">
        <div className="border-primary/10 bg-primary/5 text-primary mb-8 inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium backdrop-blur-sm">
          <span className="mr-2">💍</span> Smart wedding planning made simple
        </div>
        <h1 className="text-center text-5xl font-light tracking-tight md:text-6xl">
          Plan Your Wedding.
          <span className="block text-6xl font-semibold italic md:text-7xl">
            Without the Chaos.
          </span>
        </h1>
        <p className="text-muted-foreground my-8 max-w-2xl text-center text-lg leading-relaxed">
          Manage guests, events, vendors, tasks, and budgets seamlessly - all in
          one modern wedding management platform.
        </p>
        <AuthForm title="Start Planning" />
      </div>
      <Features />
      <div className="flex flex-col items-center border-t py-10">
        <Logo href="/" />
        <p className="text-muted-foreground mt-4 text-center text-lg">
          WeddingFlow - Plan Your Wedding Without the Chaos.
        </p>
        <p className="text-muted-foreground mt-4 text-center text-lg">
          All rights reserved. © {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}