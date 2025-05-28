
const mockSession = {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
    },
    expires: '2025-12-31T23:59:59.999Z',
  }
  
  const mockAuthOptions = {
    providers: [],
    callbacks: {
      session: jest.fn(({ session }) => session),
      jwt: jest.fn(({ token }) => token),
    },
  }
  
  module.exports = {
    authOptions: mockAuthOptions,
    getServerSession: jest.fn(() => Promise.resolve(mockSession)),
    signIn: jest.fn(() => Promise.resolve({ ok: true })),
    signOut: jest.fn(() => Promise.resolve({ ok: true })),
    useSession: jest.fn(() => ({
      data: mockSession,
      status: 'authenticated',
      update: jest.fn(),
    })),
  }
  
 
  module.exports.default = module.exports