"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-800 text-white">
      <h1 className="text-center text-6xl font-bold mb-4">
        An error has occurred
      </h1>
      <p className="text-center text-xl mb-6">
        Sorry, something must have gone wrong. Please try again later.
      </p>
      <button
        onClick={() => router.refresh()}
        className="text-suzuha-teal-500 hover:underline text-lg"
      >
        Refresh
      </button>
    </div>
  );
}
