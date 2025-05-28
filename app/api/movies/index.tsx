
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query = "", page = 1 } = req.query;

  try {
    const url = query
      ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`
      : `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;

      // `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${page}`
    // `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`
    // `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${page}`

    // https://api.themoviedb.org/3/search/collection
    // https://api.themoviedb.org/3/search/keyword
    // https://api.themoviedb.org/3/search/movie
    // https://api.themoviedb.org/3/search/multi
    // https://api.themoviedb.org/3/search/person
    // https://api.themoviedb.org/3/search/tv
    // https://api.themoviedb.org/3/trending/movie/{time_window}
    // https://api.themoviedb.org/3/trending/person/{time_window}
    // https://api.themoviedb.org/3/tv/popular
    // https://api.themoviedb.org/3/tv/{series_id}/recommendations
    

    const { data } = await axios.get(url);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Error fetching movies" });
  }
}
