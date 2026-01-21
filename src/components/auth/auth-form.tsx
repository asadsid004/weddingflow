"use client";

import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/revola";
import { SignInGoogle } from "./signin-google";
import { SignInForm } from "./signin-form";
import { SignUpForm } from "./signup-form";
import Link from "next/link";

export function AuthForm({ title = "Sign In" }: { title?: string }) {
  const [view, setView] = useState<"signin" | "signup">("signin");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session, error } = authClient.useSession();

  if (error) {
    toast.error(error.message || "Login failed. Please try again.");
  }

  if (session) {
    return (
      <Link href="/weddings" className={buttonVariants()}>
        Continue Planning
      </Link>
    );
  }

  const handleLoading = (loading: boolean) => {
    setIsSubmitting(loading);
  };

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <Button>{title}</Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="max-h-[calc(100vh-10rem)] sm:max-w-sm">
        <div className="space-y-4 overflow-y-auto">
          <ResponsiveDialogHeader className="sm:text-center">
            <ResponsiveDialogTitle>
              {view === "signin" ? "Sign In" : "Create Account"}
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              {view === "signin"
                ? "Welcome back! Please enter your details."
                : "Join us today! It only takes a minute."}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          {view === "signin" ? (
            <SignInForm disabled={isSubmitting} onLoading={handleLoading} />
          ) : (
            <SignUpForm disabled={isSubmitting} onLoading={handleLoading} />
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">
                Or continue with
              </span>
            </div>
          </div>

          <SignInGoogle disabled={isSubmitting} onLoading={handleLoading} />

          <p className="text-muted-foreground pb-4 text-center text-sm sm:pb-0">
            {view === "signin" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setView("signup")}
                  className="text-primary font-medium hover:underline disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setView("signin")}
                  className="text-primary font-medium hover:underline disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
