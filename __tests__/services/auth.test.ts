import { getAuthSession } from '@/services/auth';
import { getServerSession } from 'next-auth/next';

// Mock next-auth
jest.mock('next-auth/next');
jest.mock('@/app/auth/options', () => ({
  authOptions: {
    providers: [],
    callbacks: {},
  },
}));

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuthSession', () => {
    it('should return session when user is authenticated', async () => {
      const mockSession = {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
        expires: '2024-12-31T23:59:59.999Z',
      };

      mockGetServerSession.mockResolvedValue(mockSession);

      const result = await getAuthSession();

      expect(result).toEqual(mockSession);
      expect(mockGetServerSession).toHaveBeenCalledTimes(1);
    });

    it('should return null when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await getAuthSession();

      expect(result).toBeNull();
      expect(mockGetServerSession).toHaveBeenCalledTimes(1);
    });

    it('should handle authentication errors gracefully', async () => {
      const mockError = new Error('Authentication failed');
      mockGetServerSession.mockRejectedValue(mockError);

      await expect(getAuthSession()).rejects.toThrow('Authentication failed');
      expect(mockGetServerSession).toHaveBeenCalledTimes(1);
    });

    it('should call getServerSession with correct authOptions', async () => {
      mockGetServerSession.mockResolvedValue(null);

      await getAuthSession();

      expect(mockGetServerSession).toHaveBeenCalledWith(
        expect.objectContaining({
          providers: expect.any(Array),
          callbacks: expect.any(Object),
        })
      );
    });

    it('should handle partial session data', async () => {
      const partialSession = {
        user: {
          email: 'test@example.com',
        },
        expires: '2024-12-31T23:59:59.999Z',
      };

      mockGetServerSession.mockResolvedValue(partialSession);

      const result = await getAuthSession();

      expect(result).toEqual(partialSession);
      expect(result?.user?.email).toBe('test@example.com');
    });

    it('should handle session with additional properties', async () => {
      const extendedSession = {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          image: 'https://example.com/avatar.jpg',
          role: 'admin',
        },
        expires: '2024-12-31T23:59:59.999Z',
        accessToken: 'token123',
      };

      mockGetServerSession.mockResolvedValue(extendedSession);

      const result = await getAuthSession();

      expect(result).toEqual(extendedSession);
    });
  });
});