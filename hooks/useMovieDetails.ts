/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useState, useEffect } from "react";
import axios from "axios";

type Genre = { id: number; name: string };
type Cast = { id: number; name: string; character: string; profile_path: string | null };
type Crew = { id: number; name: string; job: string; department: string };

type MovieDetails = {
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  genres: Genre[];
  release_date: string;
  cast: Cast[];
  crew: Crew[];
};

export function useMovieDetails(id: string) {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const [movieRes, creditsRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`)
        ]);

        const movieData = movieRes.data;
        const creditsData = creditsRes.data;

        setMovie({
          title: movieData.title,
          overview: movieData.overview,
          poster_path: movieData.poster_path,
          vote_average: movieData.vote_average,
          genres: movieData.genres,
          release_date: movieData.release_date,
          cast: creditsData.cast.slice(0, 10),
          crew: creditsData.crew.filter((c: any) => ["Director", "Producer"].includes(c.job)),
        });
        setError(null);
      } catch (err: any) {
        setError("Failed to fetch movie details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  return { movie, loading, error };
}
