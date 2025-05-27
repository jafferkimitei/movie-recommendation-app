"use client";

import MovieDetails from "@/components/MovieDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { useMovieDetails } from "@/hooks/useMovieDetails";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function MoviePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id || "";
  const { movie, loading, error } = useMovieDetails(id);

  return (
    <main className="p-6">
      <Link href="/" className="text-sm underline mb-4 inline-block">
        ← Back to Movies
      </Link>
      {loading && <Skeleton className="w-full h-80 rounded-2xl" />}
      {error && <p className="text-red-500">{error}</p>}
      {movie && (
        <MovieDetails
          title={movie.title}
          posterPath={movie.poster_path}
          overview={movie.overview}
          genres={movie.genres}
          rating={movie.vote_average}
          releaseDate={movie.release_date}
          cast={movie.cast}
          crew={movie.crew}
        />
      )}
    </main>
  );
}
