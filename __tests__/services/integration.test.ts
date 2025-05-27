/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuthSession } from '@/services/auth';

// Extend the user type to include 'id'
declare module 'next-auth' {
  interface User {
    id?: string;
  }

  interface Session {
    user?: User;
  }
}
import { getPopularMovies, searchMovies, getMovieDetails } from '@/services/tmdb';
import { getServerSession } from 'next-auth/next';
import axios from 'axios';

// Mock dependencies
jest.mock('next-auth/next');
jest.mock('axios');
jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: { providers: [] },
}));

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Services Integration Tests', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
    process.env.TMDB_API_KEY = 'test-key';
  });

  it('should handle authenticated user making TMDB requests', async () => {
    // Mock authenticated session
    const mockSession = {
      user: { id: '1', email: 'user@example.com' },
      expires: '2024-12-31',
    };
    mockGetServerSession.mockResolvedValue(mockSession);

    // Mock TMDB response
    const mockMoviesResponse = {
      data: {
        results: [{ id: 1, title: 'Test Movie' }],
      },
    };
    mockAxiosInstance.get.mockResolvedValue(mockMoviesResponse);

    // Test both services work together
    const session = await getAuthSession();
    expect(session).toEqual(mockSession);

    const movies = await getPopularMovies();
    expect(movies).toEqual(mockMoviesResponse.data.results);
  });

  it('should handle unauthenticated user making TMDB requests', async () => {
    // Mock no session
    mockGetServerSession.mockResolvedValue(null);

    // Mock TMDB response
    const mockMoviesResponse = {
      data: {
        results: [{ id: 1, title: 'Public Movie' }],
      },
    };
    mockAxiosInstance.get.mockResolvedValue(mockMoviesResponse);

    // Test that TMDB still works without authentication
    const session = await getAuthSession();
    expect(session).toBeNull();

    const movies = await getPopularMovies();
    expect(movies).toEqual(mockMoviesResponse.data.results);
  });

  it('should handle service failures gracefully', async () => {
    // Auth service fails
    mockGetServerSession.mockRejectedValue(new Error('Auth service down'));

    // TMDB service works
    mockAxiosInstance.get.mockResolvedValue({
      data: { results: [{ id: 1, title: 'Movie' }] },
    });

    // Auth should fail
    await expect(getAuthSession()).rejects.toThrow('Auth service down');

    // TMDB should still work
    const movies = await getPopularMovies();
    expect(movies).toEqual([{ id: 1, title: 'Movie' }]);
  });

  it('should handle concurrent service calls', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: '1' },
      expires: '2024-12-31',
    });

    mockAxiosInstance.get
      .mockResolvedValueOnce({ data: { results: [{ id: 1 }] } })
      .mockResolvedValueOnce({ data: { results: [{ id: 2 }] } })
      .mockResolvedValueOnce({ data: { id: 3, title: 'Details' } });

    // Make concurrent calls
    const [session, popularMovies, searchResults, movieDetails] = await Promise.all([
      getAuthSession(),
      getPopularMovies(),
      searchMovies('test'),
      getMovieDetails(1),
    ]);

    expect(session?.user?.id).toBe('1');
    expect(popularMovies).toEqual([{ id: 1 }]);
    expect(searchResults).toEqual([{ id: 2 }]);
    expect(movieDetails).toEqual({ id: 3, title: 'Details' });
  });
});