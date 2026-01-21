import { toast } from "sonner";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

import { GoogleIcon } from "./google-icon";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface SignInGoogleProps {
  disabled: boolean;
  onLoading: (loading: boolean) => void;
}

export const SignInGoogle = ({ disabled, onLoading }: SignInGoogleProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      onLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/weddings",
      });
    } catch (error) {
      const err = error as Error;
      console.error("Sign in error:", err.message);
      toast.error(err.message || "Unable to sign in. Try again.");
      setIsLoading(false);
      onLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      type="button"
      onClick={signInWithGoogle}
      disabled={disabled || isLoading}
    >
      {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : <GoogleIcon />}
      Google
    </Button>
  );
};
