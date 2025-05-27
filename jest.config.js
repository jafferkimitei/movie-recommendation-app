module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
    moduleNameMapping: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: [
      '**/__tests__/**/*.test.(ts|tsx)',
      '**/*.test.(ts|tsx)',
    ],
    collectCoverageFrom: [
      '/components/**/*.{ts,tsx}',
      '/lib/**/*.{ts,tsx}',
      '/services/**/*.{ts,tsx}',
      '!/components/**/*.stories.{ts,tsx}',
      '!/components/**/*.d.ts',
      '!/lib/**/*.d.ts',
    ],
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testTimeout: 10000,
  };