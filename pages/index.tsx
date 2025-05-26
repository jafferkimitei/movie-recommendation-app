
"use client";

import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { useMovies } from "@/hooks/useMovies";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { movies, loading, error, page, setPage, setQuery } = useMovies();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">🎬 Movie Explorer</h1>
      <SearchBar onSearch={setQuery} />

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!loading && error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                overview={movie.overview}
              />
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Pagination page={page} setPage={setPage} />
          </div>
        </>
      )}
    </main>
  );
}
