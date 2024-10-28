/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  clearMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/env/*.ts',
    '!src/factories/**/*.ts',
    '!src/lib/**/*.ts',
    '!src/protocols/**/*.ts',
    '!src/_errors/**/*.ts',
    '!src/@types/**/*.ts',
  ],
  coverageProvider: 'v8',

  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  // maxWorkers: 1,
  rootDir: '.',

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  testPathIgnorePatterns: ['/node_modules/'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  extensionsToTreatAsEsm: ['.ts'],
};

module.exports = config;
