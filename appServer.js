import './env.js'
import { app } from "./index.js";
import { connnectDatabase, closeDatabase} from "./postgressDB/connectDB.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  const maxRetries = 5;
  let retries = 1;
  while (retries <= maxRetries) {
    try {
      const dbConnected = await connnectDatabase();
      !dbConnected
        ? console.log(
            "Server startup aborted due to database connection failure"
          )
        : app.listen(PORT, () => {
            console.log(
              `Database connection successful \n Server running on port ${PORT}`
            );
          });
      return;
    } catch (err) {
      console.log(
        `Database connection failed. Retries left: ${maxRetries - retries}`
      );
      retries += 1;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  console.log(`Failed to connect to the database after 5 attempts`);
  return false;
}

startServer();

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully");
  await closeDatabase();
  process.exit(0);
});
