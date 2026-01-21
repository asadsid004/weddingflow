"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";

const SignInFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

interface SignInFormProps {
  disabled: boolean;
  onLoading: (loading: boolean) => void;
}

export function SignInForm({ disabled, onLoading }: SignInFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: SignInFormSchema,
    },
    onSubmit: async ({ value }) => {
      handleSubmit(value);
    },
  });

  async function handleSubmit({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    setIsLoading(true);
    onLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) throw new Error(error.message);

      router.push("/weddings");
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Invalid email or password");
      setIsLoading(false);
      onLoading(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="-space-y-2">
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <FieldSet>
                <FieldLegend className="mb-1">Email</FieldLegend>
                <Input
                  id={field.name}
                  type="email"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  disabled={disabled || isLoading}
                  placeholder="sam@example.com"
                  required
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            );
          }}
        </form.Field>
        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <FieldSet>
                <FieldLegend className="mb-1">Password</FieldLegend>
                <Input
                  id={field.name}
                  type="password"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  disabled={disabled || isLoading}
                  placeholder="Your password"
                  required
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            );
          }}
        </form.Field>
        <Button
          type="submit"
          className="w-full"
          disabled={disabled || isLoading}
        >
          {isLoading && <Spinner className="mr-2 h-4 w-4" />}
          Sign In
        </Button>
      </FieldGroup>
    </form>
  );
}
