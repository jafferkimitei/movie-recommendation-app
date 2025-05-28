module.exports = {
  preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
    moduleNameMapper: {
      
      '^@/(.*)$': '<rootDir>/$1',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      'next/image': '<rootDir>/__mocks__/next/image.js',
      'next-auth/next': '<rootDir>/__mocks__/next-auth.js',
      '^@/app/api/auth/[...nextauth]/route$': '<rootDir>/__mocks__/next-auth-route.js',
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
    transformIgnorePatterns: [
      '/node_modules/(?!next)',
    ],
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testTimeout: 10000,
  };


  // module.exports = {
  //   preset: 'ts-jest',
  //   testEnvironment: 'jsdom',
  //   moduleNameMapper: {
  //     '^@/(.*)$': '<rootDir>/src/$1',
  //     '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  //     'next/image': '<rootDir>/__mocks__/next/image.js',
  //   },
  //   transform: {
  //     '^.+\\.(ts|tsx)?$': 'ts-jest',
  //     '^.+\\.(js|jsx)$': 'babel-jest',
  //   },
  //   transformIgnorePatterns: [
  //     '/node_modules/(?!next)',
  //   ],
  //   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // };