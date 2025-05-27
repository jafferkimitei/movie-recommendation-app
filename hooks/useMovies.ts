
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
};

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = query
        ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`
        : `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;

      const { data } = await axios.get(url);
      setMovies(data.results);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page]);

  return {
    movies,
    loading,
    error,
    page,
    setPage,
    setQuery,
  };
};
