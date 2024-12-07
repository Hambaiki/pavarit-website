import { useEffect } from "react";
import { useRouter } from "next/router";

interface UseAuthCheckOptions {
  validateAuth: () => boolean;
  redirectTo?: string;
  callback?: (valid: boolean) => void;
}

export const useAuthCheck = ({
  validateAuth,
  redirectTo,
  callback,
}: UseAuthCheckOptions) => {
  const router = useRouter();

  useEffect(() => {
    const isValid = validateAuth();

    if (callback) {
      callback(isValid);
    }

    if (!isValid) {
      if (redirectTo) {
        router.push(redirectTo);
      }
    }
  }, [validateAuth, redirectTo, router, callback]);
};
