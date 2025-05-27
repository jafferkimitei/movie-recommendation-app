"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-6xl font-bold text-red-600">Oops!</h1>
        <h2 className="text-3xl">Something went wrong!</h2>
        <p className="text-gray-400">{error.message}</p>
        <div className="flex gap-4 justify-center pt-6">
          <Button variant="destructive" size="lg" onClick={() => reset()}>
            Try Again
          </Button>
            <Link href="/">Go Home</Link>
        </div>
      </div>
    </div>
  );
}