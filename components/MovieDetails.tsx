"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

type Props = {
  title: string;
  posterPath: string | null;
  overview: string;
  genres: { id: number; name: string }[];
  rating: number;
  releaseDate: string;
  cast: { id: number; name: string; character: string; profile_path: string | null }[];
  crew: { id: number; name: string; job: string }[];
};

export default function MovieDetails({
  title,
  posterPath,
  overview,
  genres,
  rating,
  releaseDate,
  cast,
  crew,
}: Props) {
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
          <Skeleton className="w-full h-[400px] rounded-2xl" />
        )}
      </div>

      <div className="flex-1 space-y-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">Release Date: {releaseDate}</p>
        <p className="text-muted-foreground">Rating: {rating}/10</p>

        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Badge key={genre.id} variant="secondary">
              {genre.name}
            </Badge>
          ))}
        </div>

        <p>{overview}</p>

        <div className="mt-4">
          <h2 className="text-xl font-semibold">Top Cast</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {cast.slice(0, 6).map((actor) => (
              <li key={`${actor.id}-${actor.character}`} className="flex items-center gap-2">
                {actor.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                    alt={actor.name}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <Skeleton className="w-8 h-8 rounded-full" />
                )}
                <span className="text-sm">{actor.name} as {actor.character}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold">Crew</h2>
          <ul className="space-y-1">
            {crew.slice(0, 5).map((c) => (
              <li key={`${c.id}-${c.job}`} className="text-sm">
                {c.name} ({c.job})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
