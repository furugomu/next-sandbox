module.exports = {
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/__tests__/**/*.ts?(x)"],
  transform: {
    "^.+\\.tsx?$": "babel-jest"
  }
};
