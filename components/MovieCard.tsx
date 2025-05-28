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
};

export default function MovieCard({
  id,
  title,
  posterPath,
  overview,
}: MovieCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="group relative w-full bg-slate-800/40 backdrop-blur-sm border-slate-700/50 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-slate-800/60 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
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
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
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
      <CardContent className="p-6 space-y-3">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-100 group-hover:text-purple-300 transition-colors duration-300 line-clamp-2 leading-tight">
            {title}
          </h2>
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