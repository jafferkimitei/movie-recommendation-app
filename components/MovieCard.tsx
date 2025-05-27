
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type MovieCardProps = {
  id: number;
  title: string;
  posterPath: string | null;
  overview: string;
};

export default function MovieCard({
  id,
  title,
  posterPath,
  overview,
}: MovieCardProps) {
  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-lg hover:scale-105 transition-transform">
      <Image
        src={posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : "/placeholder.png"}
        alt={title}
        width={500}
        height={750}
        className="rounded-t-2xl object-cover"
      />
      <CardContent className="p-4 space-y-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground line-clamp-3">{overview}</p>
        <Link href={`/movie/${id}`}>
          <Button variant="default" className="mt-2 w-full">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
