
"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

type MovieDetailsProps = {
  title: string;
  posterPath: string | null;
  overview: string;
  genres?: { id: number; name: string }[];
  rating?: number;
};

export default function MovieDetails({
  title,
  posterPath,
  overview,
  genres = [],
  rating,
}: MovieDetailsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3">
        {posterPath ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${posterPath}`}
            alt={title}
            width={500}
            height={750}
            className="rounded-2xl object-cover"
          />
        ) : (
          <Skeleton className="w-full h-[400px]" />
        )}
      </div>
      <div className="flex-1 space-y-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Badge key={genre.id} variant="secondary">
              {genre.name}
            </Badge>
          ))}
        </div>
        {rating && (
          <p className="text-muted-foreground">Rating: {rating}/10</p>
        )}
        <p>{overview}</p>
      </div>
    </div>
  );
}
