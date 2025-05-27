"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-4xl font-bold text-red-600">Auth Error</h1>
        <p className="text-gray-400">
          Something went wrong during authentication. Please try again.
        </p>
        <Button asChild variant="destructive" size="lg">
          <Link href="/auth/signin">Back to Sign In</Link>
        </Button>
      </div>
    </div>
  );
}