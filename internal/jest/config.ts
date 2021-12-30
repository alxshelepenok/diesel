import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  collectCoverageFrom: ["src/*.{tsx,ts}"],
  coveragePathIgnorePatterns: ["/node_modules/", "/internal/", "/target/"],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  moduleFileExtensions: ["js", "ts", "tsx"],
  rootDir: "../../",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/?(*.)test.{tsx,ts}"],
  transform: { "^.+\\.(ts)x?$": "ts-jest" },
};

export default config;
