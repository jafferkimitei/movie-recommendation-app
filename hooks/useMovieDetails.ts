/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const useMovieDetails = (id: string | number) => {
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits`);
      setMovie(data);
    } catch (err: any) {
      setError(err.message || "Error fetching movie details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchMovie();
  }, [id]);

  return { movie, loading, error };
};
