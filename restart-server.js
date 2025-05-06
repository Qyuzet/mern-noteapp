import { exec } from "child_process";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

console.log("Restarting server...");

// Kill the current server process - works on both Windows and Unix
const isWindows = process.platform === "win32";
const killCommand = isWindows
  ? "npx kill-port 7777"
  : 'pkill -f "node backend/server.js"';

console.log(`Using kill command: ${killCommand}`);
const killProcess = exec(killCommand);

killProcess.on("close", (code) => {
  console.log(`Kill process exited with code ${code}`);

  // Wait a bit to ensure the port is free
  setTimeout(() => {
    console.log("Starting server again...");

    // Start the server again
    const startProcess = exec("npm run dev");

    startProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    startProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    startProcess.on("close", (code) => {
      console.log(`Start process exited with code ${code}`);
    });
  }, 2000); // Wait 2 seconds before starting the server again
});

// Exit this process after giving time for the server to start
setTimeout(() => {
  console.log("Restart script completed successfully");
  process.exit(0);
}, 5000); // Wait 5 seconds before exiting
