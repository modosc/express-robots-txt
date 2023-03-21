/* eslint import/no-extraneous-dependencies: "off" */
// Or async function
const { defaults } = require('jest-config')

module.exports = {
  verbose: true,
  setupFilesAfterEnv: [
    '<rootDir>/setup-test-framework-script.js',
  ],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mjs', 'ts', 'tsx'],
  testMatch: ['<rootDir>/index.js'],
}
