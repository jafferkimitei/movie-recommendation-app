"use client";

import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { useMovies } from "@/hooks/useMovies";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { movies, loading, error, page, setPage, setQuery } = useMovies();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <Skeleton className="h-96 w-full rounded-3xl bg-slate-800/50" />
                <Skeleton className="h-4 w-3/4 mt-4 rounded-full bg-slate-800/50" />
                <Skeleton className="h-3 w-1/2 mt-2 rounded-full bg-slate-800/50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-3xl"></div>
        <div className="relative container mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                🎬 JAFFLIX
              </h1>
              <p className="text-slate-400 text-lg">Discover your next favorite film</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-400">Welcome back,</p>
                <p className="text-lg font-semibold text-purple-300">
                  {session.user?.name}
                </p>
              </div>
              <Button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                variant="outline"
                className="cursor-pointer border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300 backdrop-blur-sm"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-12 space-y-8">
        {/* Search Section */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl mt-5">
            <SearchBar onSearch={setQuery} />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <Skeleton className="h-96 w-full rounded-3xl bg-slate-800/50" />
                <Skeleton className="h-4 w-3/4 mt-4 rounded-full bg-slate-800/50" />
                <Skeleton className="h-3 w-1/2 mt-2 rounded-full bg-slate-800/50" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-400 text-lg">{error}</p>
            <p className="text-slate-500 mt-2">Please try again later</p>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && !error && (
          <>
            {movies.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 mb-6">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No movies found</h3>
                <p className="text-slate-500">Try searching for something else</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {movies.map((movie, index) => (
                    <div
                      key={movie.id}
                      className="animate-fade-in-up"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animationFillMode: 'both'
                      }}
                    >
                      <MovieCard
                        id={movie.id}
                        title={movie.title}
                        posterPath={movie.poster_path}
                        overview={movie.overview}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="flex justify-center pt-8">
                  <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
                    <Pagination page={page} setPage={setPage} />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}