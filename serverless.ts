import type { AWS } from '@serverless/typescript';

import serverlessFn from './src/functions';

const serverlessConfiguration: AWS = {
  service: 'finance-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', './plugin/get-functions.js', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
  },
  functions: serverlessFn,
  package: { individually: false },
  custom: {
    'serverless-offline': {
      httpPort: 3000,
      useChildProcesses: true,
      reloadHandler: true,
      host: '0.0.0.0',
    },
    esbuild: {
      bundle: true,
      minify: false,
      watch: {
        pattern: ['src/**/*.ts'],
        ignore: ['.esbuild', 'dist', 'node_modules', '.build', '*.spec.ts'],
      },
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
