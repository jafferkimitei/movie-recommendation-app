/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getPopularMovies, searchMovies, getMovieDetails } from '@/services/tmdb';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock environment variables
const originalEnv = process.env;

describe('TMDB Service', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
  };

  beforeAll(() => {
    process.env = {
      ...originalEnv,
      TMDB_API_KEY: 'test-api-key-123',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
  });

  describe('axios instance configuration', () => {
    it('should create axios instance with correct configuration', () => {
      // Import the module to trigger axios.create
      require('@/services/tmdb');

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.themoviedb.org/3',
        params: {
          api_key: 'test-api-key-123',
        },
      });
    });
  });

  describe('getPopularMovies', () => {
    const mockPopularMoviesResponse = {
      data: {
        results: [
          {
            id: 1,
            title: 'Popular Movie 1',
            overview: 'A popular movie',
            poster_path: '/poster1.jpg',
            release_date: '2023-01-01',
            vote_average: 8.5,
          },
          {
            id: 2,
            title: 'Popular Movie 2',
            overview: 'Another popular movie',
            poster_path: '/poster2.jpg',
            release_date: '2023-02-01',
            vote_average: 7.8,
          },
        ],
        page: 1,
        total_pages: 100,
        total_results: 2000,
      },
    };

    it('should fetch popular movies with default page', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockPopularMoviesResponse);

      const result = await getPopularMovies();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/movie/popular', {
        params: { page: 1 },
      });
      expect(result).toEqual(mockPopularMoviesResponse.data.results);
    });

    it('should fetch popular movies with specific page', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockPopularMoviesResponse);

      const result = await getPopularMovies(3);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/movie/popular', {
        params: { page: 3 },
      });
      expect(result).toEqual(mockPopularMoviesResponse.data.results);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Network Error');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(getPopularMovies()).rejects.toThrow('Network Error');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/movie/popular', {
        params: { page: 1 },
      });
    });

    it('should handle empty results', async () => {
      const emptyResponse = {
        data: {
          results: [],
          page: 1,
          total_pages: 0,
          total_results: 0,
        },
      };
      mockAxiosInstance.get.mockResolvedValue(emptyResponse);

      const result = await getPopularMovies();

      expect(result).toEqual([]);
    });

    it('should handle page parameter edge cases', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockPopularMoviesResponse);

      // Test with page 0
      await getPopularMovies(0);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/movie/popular', {
        params: { page: 0 },
      });

      // Test with negative page
      await getPopularMovies(-1);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/movie/popular', {
        params: { page: -1 },
      });
    });
  });

  describe('searchMovies', () => {
    const mockSearchResponse = {
      data: {
        results: [
          {
            id: 100,
            title: 'Search Result Movie',
            overview: 'A movie from search',
            poster_path: '/search-poster.jpg',
            release_date: '2023-03-01',
            vote_average: 6.5,
          },
        ],
        page: 1,
        total_pages: 5,
        total_results: 50,
      },
    };

    it('should search movies with query and default page', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockSearchResponse);

      const result = await searchMovies('Inception');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/search/movie', {
        params: { query: 'Inception', page: 1 },
      });
      expect(result).toEqual(mockSearchResponse.data.results);
    });

    it('should search movies with query and specific page', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockSearchResponse);

      const result = await searchMovies('Matrix', 2);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/search/movie', {
        params: { query: 'Matrix', page: 2 },
      });
      expect(result).toEqual(mockSearchResponse.data.results);
    });

    it('should handle empty search query', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: { results: [] } });

      const result = await searchMovies('');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/search/movie', {
        params: { query: '', page: 1 },
      });
      expect(result).toEqual([]);
    });

    it('should handle special characters in search query', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockSearchResponse);

      await searchMovies('Movie: The "Special" Edition & More');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/search/movie', {
        params: { query: 'Movie: The "Special" Edition & More', page: 1 },
      });
    });

    it('should handle no search results', async () => {
      const noResultsResponse = {
        data: {
          results: [],
          page: 1,
          total_pages: 0,
          total_results: 0,
        },
      };
      mockAxiosInstance.get.mockResolvedValue(noResultsResponse);

      const result = await searchMovies('NonexistentMovie');

      expect(result).toEqual([]);
    });

    it('should handle search API errors', async () => {
      const mockError = new Error('Search failed');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(searchMovies('Test')).rejects.toThrow('Search failed');
    });
  });

  describe('getMovieDetails', () => {
    const mockMovieDetailsResponse = {
      data: {
        id: 550,
        title: 'Fight Club',
        overview: 'An insomniac office worker...',
        poster_path: '/fight-club-poster.jpg',
        backdrop_path: '/fight-club-backdrop.jpg',
        release_date: '1999-10-15',
        vote_average: 8.8,
        runtime: 139,
        genres: [
          { id: 18, name: 'Drama' },
          { id: 53, name: 'Thriller' },
        ],
        credits: {
          cast: [
            {
              id: 287,
              name: 'Brad Pitt',
              character: 'Tyler Durden',
              profile_path: '/brad-pitt.jpg',
            },
            {
              id: 819,
              name: 'Edward Norton',
              character: 'The Narrator',
              profile_path: '/edward-norton.jpg',
            },
          ],
          crew: [
            {
              id: 7467,
              name: 'David Fincher',
              job: 'Director',
            },
          ],
        },
      },
    };

    it('should fetch movie details with string ID', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockMovieDetailsResponse);

      const result = await getMovieDetails('550');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/movie/550', {
        params: { append_to_response: 'credits' },
      });
      expect(result).toEqual(mockMovieDetailsResponse.data);
    });

    it('should fetch movie details with number ID', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockMovieDetailsResponse);

      const result = await getMovieDetails(550);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/movie/550', {
        params: { append_to_response: 'credits' },
      });
      expect(result).toEqual(mockMovieDetailsResponse.data);
    });

    it('should include credits in the response', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockMovieDetailsResponse);

      const result = await getMovieDetails(550);

      expect(result.credits).toBeDefined();
      expect(result.credits.cast).toHaveLength(2);
      expect(result.credits.crew).toHaveLength(1);
      expect(result.credits.cast[0].name).toBe('Brad Pitt');
      expect(result.credits.crew[0].job).toBe('Director');
    });

    it('should handle movie not found error', async () => {
      const notFoundError = {
        response: {
          status: 404,
          data: { status_message: 'The resource you requested could not be found.' },
        },
      };
      mockAxiosInstance.get.mockRejectedValue(notFoundError);

      await expect(getMovieDetails(999999)).rejects.toEqual(notFoundError);
    });

    it('should handle invalid movie ID', async () => {
      const invalidIdError = {
        response: {
          status: 400,
          data: { status_message: 'Invalid id: The pre-requisite id is invalid or not found.' },
        },
      };
      mockAxiosInstance.get.mockRejectedValue(invalidIdError);

      await expect(getMovieDetails('invalid')).rejects.toEqual(invalidIdError);
    });

    it('should handle API rate limiting', async () => {
      const rateLimitError = {
        response: {
          status: 429,
          data: { status_message: 'Your request count is over the allowed limit.' },
        },
      };
      mockAxiosInstance.get.mockRejectedValue(rateLimitError);

      await expect(getMovieDetails(550)).rejects.toEqual(rateLimitError);
    });

    it('should handle movie with minimal data', async () => {
      const minimalMovieResponse = {
        data: {
          id: 123,
          title: 'Minimal Movie',
          overview: null,
          poster_path: null,
          release_date: null,
          vote_average: 0,
          genres: [],
          credits: {
            cast: [],
            crew: [],
          },
        },
      };
      mockAxiosInstance.get.mockResolvedValue(minimalMovieResponse);

      const result = await getMovieDetails(123);

      expect(result).toEqual(minimalMovieResponse.data);
      expect(result.genres).toEqual([]);
      expect(result.credits.cast).toEqual([]);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      networkError.name = 'AxiosError';
      mockAxiosInstance.get.mockRejectedValue(networkError);

      await expect(getPopularMovies()).rejects.toThrow('Network Error');
      await expect(searchMovies('test')).rejects.toThrow('Network Error');
      await expect(getMovieDetails(1)).rejects.toThrow('Network Error');
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('timeout of 5000ms exceeded');
      timeoutError.name = 'AxiosError';
      mockAxiosInstance.get.mockRejectedValue(timeoutError);

      await expect(getPopularMovies()).rejects.toThrow('timeout of 5000ms exceeded');
    });

    it('should handle API key authentication errors', async () => {
      const authError = {
        response: {
          status: 401,
          data: { status_message: 'Invalid API key' },
        },
      };
      mockAxiosInstance.get.mockRejectedValue(authError);

      await expect(getPopularMovies()).rejects.toEqual(authError);
    });
  });

  describe('Environment Configuration', () => {
    it('should handle missing API key', () => {
      const originalEnv = process.env.TMDB_API_KEY;
      delete process.env.TMDB_API_KEY;

      // Re-require the module to test missing API key
      jest.resetModules();
      
      expect(() => {
        require('@/lib/tmdb');
      }).not.toThrow(); // Should not throw immediately

      // Restore
      process.env.TMDB_API_KEY = originalEnv;
    });
  });
});