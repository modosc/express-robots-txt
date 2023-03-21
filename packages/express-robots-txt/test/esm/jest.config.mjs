/* eslint import/no-extraneous-dependencies: "off" */
// Or async function
import { defaults } from 'jest-config'

export default async () => ({
  verbose: true,
  setupFilesAfterEnv: [
    '<rootDir>/setup-test-framework-script.mjs',
  ],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mjs', 'ts', 'tsx'],
  testMatch: ['<rootDir>/index.mjs'],
})
