"use client";

import MovieDetails from "@/components/MovieDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useMovieDetails } from "@/hooks/useMovieDetails";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRef, useEffect, useState } from 'react';
import SharePopover from '@/components/SharePopover';
import { Share2 } from 'lucide-react';


export default function MoviePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id || "";
  const { movie, loading, error } = useMovieDetails(id);
  const [mounted, setMounted] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
const shareButtonRef = useRef<HTMLButtonElement>(null);


  useEffect(() => {
    setMounted(true);
  }, []);

  // Enhanced loading state
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation skeleton */}
      <div className="container mx-auto px-6 py-8">
        <Skeleton className="h-10 w-40 rounded-2xl bg-slate-800/50 mb-8" />
        
        {/* Content skeleton */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Poster skeleton */}
          <div className="w-full lg:w-1/3 max-w-md mx-auto lg:mx-0">
            <Skeleton className="w-full aspect-[2/3] rounded-3xl bg-slate-800/50" />
          </div>
          
          {/* Details skeleton */}
          <div className="flex-1 space-y-6">
            <Skeleton className="h-12 w-3/4 rounded-2xl bg-slate-800/50" />
            <div className="flex gap-4">
              <Skeleton className="h-8 w-24 rounded-full bg-slate-800/50" />
              <Skeleton className="h-8 w-20 rounded-full bg-slate-800/50" />
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full bg-slate-800/50" />
              ))}
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded bg-slate-800/50" />
              <Skeleton className="h-4 w-5/6 rounded bg-slate-800/50" />
              <Skeleton className="h-4 w-4/5 rounded bg-slate-800/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced error state
  const ErrorState = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        <div className="relative">
          <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">🎬</span>
          </div>
          <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping"></div>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-100">Movie Not Found</h2>
        <p className="text-slate-400 leading-relaxed">
          {error || "We couldn't find the movie you're looking for. It might have been removed or the ID is incorrect."}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:border-purple-500/50 rounded-2xl backdrop-blur-sm"
          >
            <span className="mr-2">←</span>
            Go Back
          </Button>
          
          <Button
            asChild
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl shadow-lg hover:shadow-purple-500/25"
          >
            <Link href="/">
              <span className="mr-2">🏠</span>
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );

  if (loading) return <LoadingSkeleton />;
  if (error || !movie) return <ErrorState />;

 

  return (
    <div className={`transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Enhanced Navigation */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="text-slate-300 hover:text-purple-300 hover:bg-slate-800/50 rounded-2xl transition-all duration-300 group"
            >
              <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
              Back to Movies
            </Button>
            
            {/* Movie title in nav (only visible when scrolled) */}
            {movie && (
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-slate-300 truncate max-w-md">
                  {movie.title}
                </h1>
              </div>
            )}
            
            <Button
  ref={shareButtonRef}
  onClick={() => setIsShareOpen(!isShareOpen)}
  variant="ghost"
  size="sm"
  className="cursor-pointer relative text-slate-400 hover:text-purple-300 hover:bg-slate-800/50 rounded-xl"
>
  <Share2 className="w-5 h-5" />
</Button>

{/* Share Popover */}
<div className="relative">
  {isShareOpen && (
    <SharePopover
      url={`https://jafflix.vercel.app/movies/${id}`}
      title={movie.title}
      onClose={() => setIsShareOpen(false)}
      positionRef={shareButtonRef as React.RefObject<HTMLButtonElement>}
    />
  )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
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
      </main>

      <div className="sticky bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent p-6">
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.7s ease-out;
        }
      `}</style>
    </div>
  );
}