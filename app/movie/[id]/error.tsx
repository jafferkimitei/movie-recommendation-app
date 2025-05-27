"use client";

import { Button } from "@/components/ui/button";

export default function MovieError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Failed to load movie
      </h2>
      <p className="text-gray-400 mb-6">{error.message}</p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => reset()}>
          Retry
        </Button>
        <Button asChild>
          <a href="/movies">Browse Movies</a>
        </Button>
      </div>
    </div>
  );
}