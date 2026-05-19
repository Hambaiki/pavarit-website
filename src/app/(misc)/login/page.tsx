"use client";

import { Suspense } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Button from "@/components/Button";
import MainContainer from "@/components/container/MainContainer";
import TextInput from "@/components/form/v1/TextInput";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/dashboard";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push(returnTo);
      } else {
        setError("password", { message: "Incorrect password." });
      }
    } catch {
      setError("password", { message: "An error occurred. Please try again." });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <TextInput
        type="password"
        placeholder="Password"
        autoFocus
        required
        error={errors.password?.message}
        {...register("password")}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 rounded-lg bg-primary-500 hover:bg-primary-600
          font-semibold transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Verifying..." : "Login"}
      </Button>
    </form>
  );
}

export default function Login() {
  return (
    <MainContainer>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="card w-full rounded-2xl max-w-sm space-y-6 p-8">
          <h1 className="text-2xl font-bold text-center">Admin Access</h1>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </MainContainer>
  );
}
