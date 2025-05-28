"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showAllCast, setShowAllCast] = useState(false);
  const [showAllCrew, setShowAllCrew] = useState(false);

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-400";
    if (rating >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  const getRatingBg = (rating: number) => {
    if (rating >= 8) return "bg-green-500/20 border-green-500/30";
    if (rating >= 6) return "bg-yellow-500/20 border-yellow-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  const displayedCast = showAllCast ? cast : cast.slice(0, 6);
  const displayedCrew = showAllCrew ? crew : crew.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section with Backdrop */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
        
        <div className="relative container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Poster Section */}
            <div className="w-full lg:w-1/3 max-w-md mx-auto lg:mx-0">
              <div className="relative group">
                {!imageLoaded && (
                  <Skeleton className="w-full aspect-[2/3] rounded-3xl bg-slate-800/50" />
                )}
                
                {posterPath ? (
                  <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20 group-hover:shadow-purple-500/30 transition-all duration-500">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                      alt={title}
                      fill
                      className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setImageLoaded(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <div className="aspect-[2/3] rounded-3xl bg-slate-800/50 flex items-center justify-center">
                    <span className="text-6xl opacity-50">🎬</span>
                  </div>
                )}
                
                {/* Floating rating badge */}
                <div className={`absolute -top-4 -right-4 px-4 py-2 rounded-2xl backdrop-blur-sm border ${getRatingBg(rating)} ${getRatingColor(rating)}`}>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="font-bold text-lg">{rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 space-y-8 text-slate-100">
              {/* Title and Basic Info */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                  {title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400">📅</span>
                    <span>{new Date(releaseDate).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400">⭐</span>
                    <span className={`font-semibold ${getRatingColor(rating)}`}>
                      {rating.toFixed(1)}/10
                    </span>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-3">
                  {genres.map((genre) => (
                    <Badge 
                      key={genre.id} 
                      className="cursor-pointer px-4 py-2 bg-slate-800/50 hover:bg-purple-600/20 border-slate-700/50 hover:border-purple-500/50 text-slate-300 hover:text-purple-300 transition-all duration-300 rounded-full"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Overview */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-purple-300">Overview</h2>
                <p className="text-lg leading-relaxed text-slate-300">
                  {overview || "No overview available for this movie."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast and Crew Section */}
      <div className="container mx-auto px-6 py-12 space-y-12">
        {/* Cast Section */}
        {cast.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-purple-300 flex items-center gap-3">
                <span>🎭</span>
                Top Cast
              </h2>
              {cast.length > 6 && (
                <Button
                  onClick={() => setShowAllCast(!showAllCast)}
                  variant="outline"
                  className="cursor-pointer border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400"
                >
                  {showAllCast ? 'Show Less' : `Show All (${cast.length})`}
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedCast.map((actor, index) => (
                <div 
                  key={`${actor.id}-${actor.character}`}
                  className="group flex items-center gap-4 p-4 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-purple-500/50 hover:bg-slate-800/50 transition-all duration-300"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-700/50 flex-shrink-0">
                    {actor.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        👤
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-200 group-hover:text-purple-300 transition-colors duration-300 truncate">
                      {actor.name}
                    </p>
                    <p className="text-sm text-slate-400 truncate">
                      as {actor.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Crew Section */}
        {crew.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-purple-300 flex items-center gap-3">
                <span>🎬</span>
                Crew
              </h2>
              {crew.length > 5 && (
                <Button
                  onClick={() => setShowAllCrew(!showAllCrew)}
                  variant="outline"
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400"
                >
                  {showAllCrew ? 'Show Less' : `Show All (${crew.length})`}
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedCrew.map((member, index) => (
                <div 
                  key={`${member.id}-${member.job}`}
                  className="p-4 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-purple-500/50 hover:bg-slate-800/50 transition-all duration-300 group"
                  style={{
                    animationDelay: `${index * 0.03}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <p className="font-semibold text-slate-200 group-hover:text-purple-300 transition-colors duration-300">
                    {member.name}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {member.job}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
        
        .grid > * {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}