/* eslint-disable @typescript-eslint/no-unused-vars */
import path from 'path';

export const testEnvironment = 'jsdom';
export const setupFilesAfterEnv = ['<rootDir>/jest.setup.js'];
export const moduleNameMapper = {
  '^@/(.*)$': '<rootDir>/$1',
  '^@/components/(.*)$': '<rootDir>/components/$1',
  '^@/services/(.*)$': '<rootDir>/services/$1',
  '^@/lib/(.*)$': '<rootDir>/lib/$1',
  '^@/app/(.*)$': '<rootDir>/app/$1',
  '^@/types/(.*)$': '<rootDir>/types/$1',
  '^@/__tests__/(.*)$': '<rootDir>/__tests__/$1',
  '^@/__mocks__/(.*)$': '<rootDir>/__mocks__/$1',
  // Handle CSS imports (with CSS modules)
  '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  // Handle static file imports
  '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
};
export const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx', 'json'];

// Replace Babel with SWC (faster alternative)
export const transform = {
  '^.+\\.(js|jsx|ts|tsx)$': '@swc/jest',
};

export const transformIgnorePatterns = [
  'node_modules/(?!(.*\\.mjs$))', 
];
export const testPathIgnorePatterns = [
  '<rootDir>/.next/',
  '<rootDir>/node_modules/',
];
export const collectCoverageFrom = [
  '**/*.{js,jsx,ts,tsx}',
  '!**/*.d.ts',
  '!**/node_modules/**',
  '!**/.next/**',
  '!**/coverage/**',
  '!jest.config.js',
  '!jest.setup.js',
];
export const testMatch = [
  '<rootDir>/**/__tests__/**/*.{js,jsx,ts,tsx}',
  '<rootDir>/**/*.(test|spec).{js,jsx,ts,tsx}',
];
export const verbose = true;