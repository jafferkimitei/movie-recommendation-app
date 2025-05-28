"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type MovieCardProps = {
  id: number;
  title: string;
  posterPath: string | null;
  overview: string;
  releaseDate?: string;
  voteAverage?: number;
  voteCount?: number;
  genre?: string[];
};

export default function MovieCard({
  id,
  title,
  posterPath,
  overview,
  releaseDate,
  voteAverage,
  voteCount,
  genre,
}: MovieCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Format release date
  const formatDate = (date: string | undefined) => {
    if (!date) return "Unknown";
    return new Date(date).getFullYear().toString();
  };

  // Format rating
  const formatRating = (rating: number | undefined) => {
    if (!rating) return null;
    return (rating / 10 * 5).toFixed(1); // Convert to 5-star scale
  };

  // Format vote count
  const formatVoteCount = (count: number | undefined) => {
    if (!count) return null;
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Card className="group relative w-full bg-slate-800/40 backdrop-blur-sm border-slate-700/50 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02]">
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-slate-800/60 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Rating Badge */}
        {voteAverage && voteAverage > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-white text-sm font-semibold">
              {formatRating(voteAverage)}
            </span>
          </div>
        )}

        {/* Release Year Badge */}
        {releaseDate && (
          <div className="absolute top-3 right-3 z-10 bg-purple-600/80 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white text-sm font-semibold">
              {formatDate(releaseDate)}
            </span>
          </div>
        )}
        
        <Image
          src={
            imageError || !posterPath
              ? "/placeholder.jpg"
              : `https://image.tmdb.org/t/p/w500${posterPath}`
          }
          alt={title}
          fill
          className={`object-cover transition-all duration-700 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Hover Content */}
        <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <Link href={`/movie/${id}`} className="w-full">
            <Button 
              variant="default" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white border-0 rounded-xl backdrop-blur-sm shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            >
              <span className="mr-2">🎬</span>
              View Details
            </Button>
          </Link>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-5 space-y-3">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-100 group-hover:text-purple-300 transition-colors duration-300 line-clamp-2 leading-tight">
            {title}
          </h2>
          
          {/* Movie Stats */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            {voteAverage && voteAverage > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                <span>{formatRating(voteAverage)}/5</span>
                {voteCount && (
                  <span className="text-slate-500">({formatVoteCount(voteCount)})</span>
                )}
              </div>
            )}
            {releaseDate && (
              <div className="flex items-center gap-1">
                <span>📅</span>
                <span>{formatDate(releaseDate)}</span>
              </div>
            )}
          </div>

          {/* Genres */}
          {genre && genre.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {genre.slice(0, 2).map((g, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full"
                >
                  {g}
                </span>
              ))}
              {genre.length > 2 && (
                <span className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded-full">
                  +{genre.length - 2}
                </span>
              )}
            </div>
          )}
          
          <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
            {overview || "No description available."}
          </p>
        </div>
      </CardContent>

      {/* Subtle border glow effect */}
      <div className="absolute inset-0 rounded-3xl border border-purple-500/0 group-hover:border-purple-500/30 transition-all duration-500 pointer-events-none"></div>
    </Card>
  );
}