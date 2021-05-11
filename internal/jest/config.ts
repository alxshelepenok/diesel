import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  rootDir: "../../",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts", "tsx"],
  coveragePathIgnorePatterns: ["/node_modules/", "/internal/", "/target/"],
  transform: { "^.+\\.(ts)x?$": "ts-jest" },
  collectCoverageFrom: ["src/*.{tsx,ts}"],
  testMatch: ["<rootDir>/src/**/?(*.)test.{tsx,ts}"],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      statements: 95,
      lines: 95,
    },
  },
};

export default config;
