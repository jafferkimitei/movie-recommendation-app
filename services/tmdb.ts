
import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";


const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getPopularMovies = async (page = 1) => {
  const { data } = await tmdb.get("/movie/popular", { params: { page } });
  return data.results;
};

export const searchMovies = async (query: string, page = 1) => {
  const { data } = await tmdb.get("/search/movie", { params: { query, page } });
  return data.results;
};

export const getMovieDetails = async (id: string | number) => {
  const { data } = await tmdb.get(`/movie/${id}`, {
    params: { append_to_response: "credits" },
  });
  return data;
};
