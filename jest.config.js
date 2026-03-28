import dotenv from "dotenv";
import nextJest from "next/jest.js";

dotenv.config({
  path: ".env.development",
});

const createJestConfig = nextJest({
  dir: ".",
});
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 6000,
});

export default jestConfig;
