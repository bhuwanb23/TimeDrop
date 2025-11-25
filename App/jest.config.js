module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  setupFilesAfterEnv: [],
  moduleFileExtensions: ['js', 'json', 'node']
};