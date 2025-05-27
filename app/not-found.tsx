import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <h2 className="text-3xl">Movie Not Found</h2>
        <p className="text-gray-400">
          The page you&#39;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="pt-6">
          <Button asChild variant="destructive" size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}