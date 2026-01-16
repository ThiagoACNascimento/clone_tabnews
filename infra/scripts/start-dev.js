const { execSync, spawn } = require("node:child_process");

startServicer();

process.on("SIGINT", () => {
  console.log("[SIGINT] Stopping services...");
  stopServicer();
  process.exit();
});
process.on("SIGTERM", () => {
  console.log("[SIGTERM] Stopping services...");
  stopServicer();
  process.exit();
});

function stopServicer() {
  console.log("All services stopped.");
  execSync("npm run services:down");
}

function startServicer() {
  console.log("Starting development services...");
  execSync("npm run services:up");
  execSync("npm run services:wait:database");
  execSync("npm run migrations:up");
  spawn("node", ["node_modules/next/dist/bin/next", "dev"], {
    stdio: "inherit",
  });
}
