import { Suspense } from "react";

import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="card w-full rounded-2xl max-w-sm space-y-6 p-8">
        <h1 className="text-2xl font-bold text-center">Admin Access</h1>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
