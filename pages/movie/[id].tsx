
"use client";

import { useParams } from "next/navigation";
import { useMovieDetails } from "@/hooks/useMovieDetails";
import MovieDetails from "@/components/MovieDetails";
import { Skeleton } from "@/components/ui/skeleton";

export default function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const { movie, loading, error } = useMovieDetails(id);

  return (
    <main className="p-6">
      {loading && <Skeleton className="w-full h-80 rounded-2xl" />}
      {error && <p className="text-red-500">{error}</p>}
      {movie && (
        <MovieDetails
          title={movie.title}
          posterPath={movie.poster_path}
          overview={movie.overview}
          genres={movie.genres}
          rating={movie.vote_average}
        />
      )}
    </main>
  );
}
