module.exports = {
  roots: ['<rootDir>/src'],
  collectCovarageFrom: ['<rootDir>/src/**/*ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
