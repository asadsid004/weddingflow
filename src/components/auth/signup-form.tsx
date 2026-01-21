"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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

const SignUpFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

interface SignUpFormProps {
  disabled: boolean;
  onLoading: (loading: boolean) => void;
}

export function SignUpForm({ disabled, onLoading }: SignUpFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: SignUpFormSchema,
    },
    onSubmit: async ({ value }) => {
      handleSubmit(value);
    },
  });

  async function handleSubmit({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    setIsLoading(true);
    onLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) throw new Error(error.message);

      router.push("/dashboard");
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to create account");
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
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <FieldSet>
                <FieldLegend className="mb-1">Name</FieldLegend>
                <Input
                  id={field.name}
                  type="text"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  disabled={disabled || isLoading}
                  placeholder="Sam"
                  required
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            );
          }}
        </form.Field>
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
