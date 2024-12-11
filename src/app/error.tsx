"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh)] bg-neutral-800 text-white">
      <h1 className="text-center text-4xl lg:text-6xl font-bold mb-4">
        An error has occurred
      </h1>
      <p className="text-center text-xl lg:text-2xl mb-6">
        Sorry, something must have gone wrong. Please try again later.
      </p>
      <button
        onClick={() => router.refresh()}
        className="text-center text-lg lg:text-2xl text-suzuha-teal-500"
      >
        Refresh
      </button>
    </div>
  );
}
